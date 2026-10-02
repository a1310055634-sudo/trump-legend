// R01 冒烟测试：无头 Chrome + CDP —— console 零 error + 关键节点 + 截图
// 用法: node tools/smoke.mjs <相对页面路径如 index.html> <轮次名如 R01>
import { spawn, execSync } from "node:child_process";
import { mkdirSync, writeFileSync, rmSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const ROOT = resolve(import.meta.dirname, "..");
const page = process.argv[2] || "index.html";
const round = process.argv[3] || "R01";
const PORT = 9341;

const fileUrl = "file:///" + join(ROOT, page).replace(/\\/g, "/").replace(/ /g, "%20");
const udd = join(tmpdir(), `tl-smoke-${Date.now()}`);

const chrome = spawn(CHROME, [
  "--headless=new", `--remote-debugging-port=${PORT}`,
  `--user-data-dir=${udd}`, "--no-first-run", "--no-default-browser-check",
  "--disable-gpu", "--window-size=1280,1600", "about:blank",
], { stdio: "ignore" });

const sleep = (ms) => new Promise(r => setTimeout(r, ms));
async function getWsUrl() {
  for (let i = 0; i < 30; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/json/list`);
      const tabs = await res.json();
      const t = tabs.find(x => x.type === "page");
      if (t) return t.webSocketDebuggerUrl;
    } catch {}
    await sleep(300);
  }
  throw new Error("CDP 连接超时");
}

let ws, msgId = 0;
const pending = new Map();
function send(method, params = {}, sessionId) {
  const id = ++msgId;
  return new Promise((res, rej) => {
    pending.set(id, { res, rej });
    ws.send(JSON.stringify({ id, method, params, sessionId }));
  });
}
const errors = [];

try {
  ws = new WebSocket(await getWsUrl());
  await new Promise((r, j) => { ws.onopen = r; ws.onerror = j; });
  ws.onmessage = (ev) => {
    const m = JSON.parse(ev.data);
    if (m.id && pending.has(m.id)) { pending.get(m.id).res(m.result ?? m); pending.delete(m.id); }
    if (m.method === "Runtime.consoleAPICalled" && (m.params.type === "error" || m.params.type === "warning"))
      errors.push(`console.${m.params.type}: ` + (m.params.args?.map(a => a.value ?? a.description ?? "").join(" ") || ""));
    if (m.method === "Runtime.exceptionThrown")
      errors.push("exception: " + (m.params.exceptionDetails?.exception?.description || m.params.exceptionDetails?.text || ""));
  };

  await send("Runtime.enable");
  await send("Page.enable");
  await send("Emulation.setDeviceMetricsOverride", { width: 1280, height: 1600, deviceScaleFactor: 1, mobile: false });
  await send("Page.navigate", { url: fileUrl });
  await sleep(2500);

  const checks = await send("Runtime.evaluate", { returnByValue: true, expression: `(() => {
    const q = s => document.querySelector(s);
    const imgs = [...document.querySelectorAll('img')];
    return {
      title: document.title,
      coverTitle: !!q(".hero__title"),
      pageHead: !!q(".page-head"),
      issueTag: q(".issue-tag")?.textContent || "",
      chapterCards: document.querySelectorAll(".chapter-card").length,
      lockedCards: document.querySelectorAll(".chapter-card[data-locked]").length,
      photosTotal: imgs.length,
      photosBroken: imgs.filter(i => !i.complete || i.naturalWidth === 0).length,
      brokenLinks: [...document.querySelectorAll('a[href]')].filter(a => !a.href.startsWith("http") && !a.href.startsWith("file")).length,
      stats: document.querySelectorAll(".stat").length,
      tbc: !!q(".tbc"),
      footer: !!q(".footer"),
      version: q("#site-version")?.textContent || "",
      metaVersion: q('meta[name="site-version"]')?.getAttribute("content") || "",
      revealsIn: document.querySelectorAll(".panel-reveal.is-in").length,
      revealsAll: document.querySelectorAll(".panel-reveal").length
    };
  })()` });

  const r = checks.result?.value || checks.value || {};
  console.log("== 冒烟检查 ==");
  console.log(JSON.stringify(r, null, 2));

  mkdirSync(join(ROOT, "tools", "shots", round), { recursive: true });
  // 截图前强制全部入场元素就位并等过渡结束（captureBeyondViewport 不触发下方 IO）
  // R13 起入场带同批错峰（≤280ms 延迟），等待窗口相应放宽到 1600ms
  await send("Runtime.evaluate", { expression: `document.querySelectorAll('.panel-reveal').forEach(n => n.classList.add('is-in'))` });
  await sleep(1600);
  const shot1 = await send("Page.captureScreenshot", { format: "png", captureBeyondViewport: true });
  writeFileSync(join(ROOT, "tools", "shots", round, page.replace(/\.html$/, "") + "-1280.png"), Buffer.from(shot1.data, "base64"));

  await send("Emulation.setDeviceMetricsOverride", { width: 375, height: 800, deviceScaleFactor: 2, mobile: true });
  await sleep(600);
  const shot2 = await send("Page.captureScreenshot", { format: "png", captureBeyondViewport: true });
  writeFileSync(join(ROOT, "tools", "shots", round, page.replace(/\.html$/, "") + "-375.png"), Buffer.from(shot2.data, "base64"));

  // 首页专属断言只在 index.html 生效；其他内容页走通用验收线
  const isIndex = page === "index.html";
  const hard = [];
  if (isIndex) {
    if (!r.coverTitle) hard.push("缺少 .hero__title");
    if (r.chapterCards !== 9) hard.push(`目录卡应为 9，实为 ${r.chapterCards}`);
    if (r.stats !== 6) hard.push(`数字速览应为 6，实为 ${r.stats}`);
    if (r.photosTotal !== 10) hard.push(`照片应为 10，实为 ${r.photosTotal}`);
  } else if (!r.pageHead) {
    hard.push("缺少 .page-head（内容页刊头）");
  }
  if (!r.tbc || !r.footer) hard.push("缺 TBC 或页脚");
  if (!r.version || !r.metaVersion || r.version !== r.metaVersion)
    hard.push(`版本戳不一致: 页脚=${r.version} meta=${r.metaVersion}（升版时两处必须一起改）`);
  if (r.photosBroken > 0) hard.push(`有 ${r.photosBroken} 张照片未加载成功`);
  if (errors.length) hard.push(`console ${errors.length} 条: ` + errors.slice(0, 3).join(" | "));

  console.log(errors.length ? "== console 记录 ==\n" + errors.join("\n") : "== console 零 error ==");
  console.log(hard.length ? "FAIL: " + hard.join("; ") : "PASS");
  process.exitCode = hard.length ? 1 : 0;
} catch (e) {
  console.error("SMOKE ERROR:", e.message);
  process.exitCode = 2;
} finally {
  try { ws?.close(); } catch {}
  try { chrome.kill(); } catch {}
  await sleep(400);
  try { execSync(`taskkill /PID ${chrome.pid} /T /F`, { stdio: "ignore" }); } catch {}
  await sleep(300);
  try { if (existsSync(udd)) rmSync(udd, { recursive: true, force: true }); } catch {}
}
