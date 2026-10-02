// 探针：核查关键元素计算样式（标题颜色/金渐变是否生效）
import { spawn, execSync } from "node:child_process";
import { rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const ROOT = resolve(import.meta.dirname, "..");
const PORT = 9344;
const udd = join(tmpdir(), `tl-probe-${Date.now()}`);
const chrome = spawn(CHROME, ["--headless=new", `--remote-debugging-port=${PORT}`, `--user-data-dir=${udd}`,
  "--no-first-run", "--disable-gpu", "about:blank"], { stdio: "ignore" });
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
  await send("Page.navigate", { url: "file:///" + join(ROOT, "index.html").replace(/\\/g, "/").replace(/ /g, "%20") });
  await sleep(1800);
  const r = await send("Runtime.evaluate", { returnByValue: true, expression: `(() => {
    const cs = (sel, prop) => { const el = document.querySelector(sel); return el ? getComputedStyle(el)[prop] : "MISSING:" + sel; };
    return {
      heroTitleImg: cs(".hero__title", "webkitBackgroundClip") || cs(".hero__title", "backgroundClip"),
      heroTitleColor: cs(".hero__title", "color"),
      heroTitleFont: cs(".hero__title", "fontFamily").slice(0, 60),
      headH1Color: cs(".page-head h1", "color"),
      headH1Font: cs(".page-head h1", "fontFamily").slice(0, 60),
      chaptersH1: [...document.querySelectorAll(".page-head h1")].map(h => { const c = getComputedStyle(h); return { t: h.textContent.trim().slice(0, 8), color: c.color, op: c.opacity }; }),
      statBColor: cs(".stat b", "color"),
      bodyBg: cs("body", "backgroundColor"),
      htmlOverflowX: document.documentElement.scrollWidth <= window.innerWidth ? "no-h-overflow" : "H-OVERFLOW " + document.documentElement.scrollWidth,
    };
  })()` });
  console.log(JSON.stringify(r.result?.value ?? r.value, null, 2));
} catch (e) { console.error("PROBE ERROR:", e.message); process.exitCode = 2; }
finally { try { ws?.close(); } catch {} try { chrome.kill(); } catch {} await sleep(300); try { execSync(`taskkill /PID ${chrome.pid} /T /F`, { stdio: "ignore" }); } catch {} await sleep(200); try { rmSync(udd, { recursive: true, force: true }); } catch {} }
