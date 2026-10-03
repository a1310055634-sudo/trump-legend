// R39 可达性专项探针：①20 页 × 375/768/1280 横向溢出 ②data.html 图表 aria ③reduced-motion 直出抽检
import { spawn, execSync } from "node:child_process";
import { rmSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const ROOT = resolve(import.meta.dirname, "..");
const PORT = 9351;
const PAGES = ["index.html", "timeline.html", "empire.html", "stage.html", "whitehouse.html",
  "downfall.html", "comeback.html", "act47.html", "quotes.html", "about.html", "posts.html",
  "speeches.html", "orders.html", "documents.html", "books.html", "family.html", "circle.html",
  "rivals.html", "culture.html", "data.html"];
const WIDTHS = [375, 768, 1280];
const udd = join(tmpdir(), `tl-r39-${Date.now()}`);
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
      const t = (await res.json()).find(x => x.type === "page");
      if (t) return t.webSocketDebuggerUrl;
    } catch {}
    await sleep(300);
  }
  throw new Error("CDP 连接超时");
}
let ws, msgId = 0;
const pending = new Map();
function send(method, params = {}) {
  const id = ++msgId;
  return new Promise((res, rej) => {
    pending.set(id, { res, rej });
    ws.send(JSON.stringify({ id, method, params }));
  });
}
const problems = [];
try {
  ws = new WebSocket(await getWsUrl());
  await new Promise((r, j) => { ws.onopen = r; ws.onerror = j; });
  ws.onmessage = (ev) => {
    const m = JSON.parse(ev.data);
    if (m.id && pending.has(m.id)) { pending.get(m.id).res(m.result ?? m); pending.delete(m.id); }
  };
  await send("Runtime.enable");
  await send("Page.enable");

  // ① 三档溢出 × 20 页
  for (const w of WIDTHS) {
    await send("Emulation.setDeviceMetricsOverride", { width: w, height: 1400, deviceScaleFactor: 1, mobile: w < 700 });
    for (const p of PAGES) {
      const url = "file:///" + join(ROOT, p).replace(/\\/g, "/").replace(/ /g, "%20");
      await send("Page.navigate", { url });
      await sleep(700);
      const r = await send("Runtime.evaluate", { returnByValue: true, expression: `(() => {
        const d = document.documentElement;
        return { sw: d.scrollWidth, iw: window.innerWidth, bw: document.body ? document.body.scrollWidth : 0 };
      })()` });
      const v = r.result?.value || {};
      if (v.sw > v.iw + 1 || v.bw > v.iw + 1)
        problems.push(`[溢出] ${p} @${w}: scrollWidth=${v.sw} innerWidth=${v.iw}`);
    }
    console.log(`溢出扫描 @${w} 完成`);
  }

  // ② data.html 图表 aria
  {
    const url = "file:///" + join(ROOT, "data.html").replace(/\\/g, "/").replace(/ /g, "%20");
    await send("Emulation.setDeviceMetricsOverride", { width: 1280, height: 1400, deviceScaleFactor: 1, mobile: false });
    await send("Page.navigate", { url });
    await sleep(900);
    const r = await send("Runtime.evaluate", { returnByValue: true, expression: `(() => {
      const svgs = [...document.querySelectorAll("svg[role='img']")];
      return { n: svgs.length, bad: svgs.filter(s => !(s.getAttribute("aria-label") || "").trim()).length };
    })()` });
    const v = r.result?.value || {};
    if (v.n < 3 || v.bad > 0) problems.push(`[图表aria] data.html: svg=${v.n} 无标签=${v.bad}`);
    else console.log(`图表 aria: ${v.n} 幅全部带标签`);
  }

  // ③ reduced-motion 直出抽检（index + data）
  await send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: "reduce" }] });
  for (const p of ["index.html", "data.html"]) {
    const url = "file:///" + join(ROOT, p).replace(/\\/g, "/").replace(/ /g, "%20");
    await send("Page.navigate", { url });
    await sleep(900);
    const r = await send("Runtime.evaluate", { returnByValue: true, expression: `(() => {
      const el = document.querySelector(".panel-reveal");
      const el2 = document.querySelector(".post-card, .chapter-card, .stat-strip");
      const t = el ? getComputedStyle(el).transitionDuration : "";
      const t2 = el2 ? getComputedStyle(el2).transitionDuration : "";
      return { t, t2 };
    })()` });
    const v = r.result?.value || {};
    const zero = s => s === "0s" || s === "" || (s || "").split(",").every(x => x.trim() === "0s");
    if (!zero(v.t) || !zero(v.t2))
      problems.push(`[reduced-motion] ${p}: transition=${v.t} / ${v.t2}（应全为 0s）`);
    else console.log(`reduced-motion ${p}: 直出 ✓`);
  }
  await send("Emulation.setEmulatedMedia", { features: [] });

  console.log(problems.length ? "FAIL:\n" + problems.join("\n") : "PASS: 全部专项检查通过");
  process.exitCode = problems.length ? 1 : 0;
} catch (e) {
  console.error("R39 ERROR:", e.message);
  process.exitCode = 2;
} finally {
  try { ws?.close(); } catch {}
  try { chrome.kill(); } catch {}
  await sleep(400);
  try { execSync(`taskkill /PID ${chrome.pid} /T /F`, { stdio: "ignore" }); } catch {}
  await sleep(300);
  try { if (existsSync(udd)) rmSync(udd, { recursive: true, force: true }); } catch {}
}
