// R13 交互探针：进度条/back-top/时代导航高亮 实测
// 用法: node tools/probe-interactions.mjs <页面如 timeline.html> <端口>
import { spawn, execSync } from "node:child_process";
import { rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const ROOT = resolve(import.meta.dirname, "..");
const page = process.argv[2] || "timeline.html";
const PORT = Number(process.argv[3] || 9348);
const udd = join(tmpdir(), `tl-probe13-${Date.now()}`);
const chrome = spawn(CHROME, ["--headless=new", `--remote-debugging-port=${PORT}`, `--user-data-dir=${udd}`,
  "--no-first-run", "--disable-gpu", "--window-size=1280,900", "about:blank"], { stdio: "ignore" });
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
let ws, id = 0; const pend = new Map();
const send = (m, p = {}) => new Promise((res, rej) => { const i = ++id; pend.set(i, { res, rej }); ws.send(JSON.stringify({ id: i, method: m, params: p })); });

try {
  let url;
  for (let i = 0; i < 30; i++) {
    try { const r = await fetch(`http://127.0.0.1:${PORT}/json/list`); const t = (await r.json()).find(x => x.type === "page"); if (t) { url = t.webSocketDebuggerUrl; break; } } catch {}
    await sleep(300);
  }
  ws = new WebSocket(url);
  await new Promise((r, j) => { ws.onopen = r; ws.onerror = j; });
  ws.onmessage = (ev) => { const m = JSON.parse(ev.data); if (m.id && pend.has(m.id)) { pend.get(m.id).res(m.result ?? m); pend.delete(m.id); } };
  await send("Runtime.enable"); await send("Page.enable");
  await send("Page.navigate", { url: "file:///" + join(ROOT, page).replace(/\\/g, "/").replace(/ /g, "%20") });
  await sleep(1500);

  const r0 = await send("Runtime.evaluate", { returnByValue: true, expression: `(() => ({
    hasProgress: !!document.getElementById("progress-bar"),
    hasBackTop: !!document.getElementById("back-top"),
    backTopVisibleAtTop: document.getElementById("back-top")?.classList.contains("is-visible") || false
  }))()` });
  console.log("top:", JSON.stringify(r0.result?.value));

  // 滚到 40% 处
  await send("Runtime.evaluate", { expression: `window.scrollTo(0, (document.documentElement.scrollHeight - window.innerHeight) * 0.4)` });
  await sleep(600);
  const r1 = await send("Runtime.evaluate", { returnByValue: true, expression: `(() => {
    const bar = document.getElementById("progress-bar");
    const bt = document.getElementById("back-top");
    const active = document.querySelector(".tl-rail a.is-active");
    return {
      progressWidthPct: bar ? bar.style.width : "none",
      backTopVisibleMid: bt ? bt.classList.contains("is-visible") : false,
      railActive: active ? active.textContent : (document.querySelector(".tl-rail") ? "NONE-BUT-RAIL-EXISTS" : "no-rail")
    };
  })()` });
  console.log("mid(40%):", JSON.stringify(r1.result?.value));

  // 回到顶部按钮点击
  await send("Runtime.evaluate", { expression: `document.getElementById("back-top").click()` });
  await sleep(1200);
  const r2 = await send("Runtime.evaluate", { returnByValue: true, expression: `(() => ({
    scrollY: Math.round(window.scrollY),
    backTopVisibleAfter: document.getElementById("back-top").classList.contains("is-visible")
  }))()` });
  console.log("after-click:", JSON.stringify(r2.result?.value));

  const hard = [];
  if (!r0.result.value.hasProgress) hard.push("进度条未注入");
  if (!r0.result.value.hasBackTop) hard.push("back-top 未注入");
  if (r0.result.value.backTopVisibleAtTop) hard.push("页首不该显示 back-top");
  const mid = r1.result.value;
  if (parseFloat(mid.progressWidthPct) < 30) hard.push("进度条宽度异常: " + mid.progressWidthPct);
  if (!mid.backTopVisibleMid) hard.push("滚动后 back-top 未浮现");
  if (page === "timeline.html" && mid.railActive === "NONE-BUT-RAIL-EXISTS") hard.push("时代导航无高亮");
  if (r2.result.value.scrollY > 50) hard.push("回顶失败 scrollY=" + r2.result.value.scrollY);
  console.log(hard.length ? "FAIL: " + hard.join("; ") : "PASS");
  process.exitCode = hard.length ? 1 : 0;
} catch (e) { console.error("PROBE ERROR:", e.message); process.exitCode = 2; }
finally { try { ws?.close(); } catch {} try { chrome.kill(); } catch {} await sleep(300); try { execSync(`taskkill /PID ${chrome.pid} /T /F`, { stdio: "ignore" }); } catch {} await sleep(200); try { rmSync(udd, { recursive: true, force: true }); } catch {} }
