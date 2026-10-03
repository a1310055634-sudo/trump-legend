// R42 首屏计时探针：file:// 直开 index/posts/data，Performance API 取 DOMContentLoaded 与 load 完整耗时（各两轮取后值）
import { spawn, execSync } from "node:child_process";
import { rmSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const ROOT = resolve(import.meta.dirname, "..");
const PORT = 9355;
const PAGES = ["index.html", "posts.html", "data.html"];
const udd = join(tmpdir(), `tl-r42-${Date.now()}`);
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
try {
  ws = new WebSocket(await getWsUrl());
  await new Promise((r, j) => { ws.onopen = r; ws.onerror = j; });
  ws.onmessage = (ev) => {
    const m = JSON.parse(ev.data);
    if (m.id && pending.has(m.id)) { pending.get(m.id).res(m.result ?? m); pending.delete(m.id); }
  };
  await send("Runtime.enable");
  await send("Page.enable");
  for (const p of PAGES) {
    const times = [];
    for (let run = 0; run < 2; run++) {
      const url = "file:///" + join(ROOT, p).replace(/\\/g, "/").replace(/ /g, "%20");
      await send("Page.navigate", { url });
      await sleep(1600);
      const r = await send("Runtime.evaluate", { returnByValue: true, expression: `(() => {
        const e = performance.getEntriesByType("navigation")[0];
        return { dcl: Math.round(e.domContentLoadedEventEnd), load: Math.round(e.loadEventEnd || performance.now()), imgs: [...document.images].filter(i => i.complete && i.naturalWidth > 0).length + "/" + document.images.length };
      })()` });
      times.push(r.result?.value || {});
      await sleep(300);
    }
    const last = times[1];
    console.log(`${p}: DCL=${last.dcl}ms load=${last.load}ms 照片就绪=${last.imgs}（两轮: ${times.map(t => t.load + "ms").join(", ")}）`);
  }
  console.log("PASS: 计时完成");
  process.exitCode = 0;
} catch (e) {
  console.error("R42 ERROR:", e.message);
  process.exitCode = 2;
} finally {
  try { ws?.close(); } catch {}
  try { chrome.kill(); } catch {}
  await sleep(400);
  try { execSync(`taskkill /PID ${chrome.pid} /T /F`, { stdio: "ignore" }); } catch {}
  await sleep(300);
  try { if (existsSync(udd)) rmSync(udd, { recursive: true, force: true }); } catch {}
}
