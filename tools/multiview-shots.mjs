// R18 QA 卷二：多视口全页截图（375/1280）+ 失真/裁切/溢出审计
// 用法: node tools/multiview-shots.mjs
import { spawn, execSync } from "node:child_process";
import { mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const ROOT = resolve(import.meta.dirname, "..");
const PORT = 9355;
const PAGES = ["index.html", "timeline.html", "empire.html", "stage.html", "whitehouse.html",
  "downfall.html", "comeback.html", "act47.html", "quotes.html", "about.html", "posts.html",
  "speeches.html", "orders.html", "documents.html", "books.html", "family.html", "circle.html",
  "rivals.html", "culture.html", "data.html",
  "court.html", "elections.html", "assets.html", "lexicon.html", "allies.html",
  "diplomacy.html", "promises.html", "gallery.html"];
const WIDTHS = [1280, 375];
const OUT = join(ROOT, "tools", "shots", process.argv[2] || "R40"); /* R40 起：输出目录可传参，勿再硬编码（R18 曾被覆盖） */
mkdirSync(OUT, { recursive: true });

const udd = join(tmpdir(), `tl-mv-${Date.now()}`);
const chrome = spawn(CHROME, ["--headless=new", `--remote-debugging-port=${PORT}`, `--user-data-dir=${udd}`,
  "--no-first-run", "--disable-gpu", "--window-size=1280,900", "about:blank"], { stdio: "ignore" });
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
let ws, id = 0; const pend = new Map();
const send = (m, p = {}) => new Promise((res, rej) => { const i = ++id; pend.set(i, { res, rej }); ws.send(JSON.stringify({ id: i, method: m, params: p })); });
const errors = [];

try {
  let url;
  for (let i = 0; i < 30; i++) {
    try { const r = await fetch(`http://127.0.0.1:${PORT}/json/list`); const t = (await r.json()).find(x => x.type === "page"); if (t) { url = t.webSocketDebuggerUrl; break; } } catch {}
    await sleep(300);
  }
  ws = new WebSocket(url);
  await new Promise((r, j) => { ws.onopen = r; ws.onerror = j; });
  ws.onmessage = (ev) => {
    const m = JSON.parse(ev.data);
    if (m.id && pend.has(m.id)) { pend.get(m.id).res(m.result ?? m); pend.delete(m.id); }
    if (m.method === "Runtime.exceptionThrown") errors.push("exception: " + (m.params.exceptionDetails?.exception?.description || m.params.exceptionDetails?.text || ""));
  };
  await send("Runtime.enable"); await send("Page.enable");

  const problems = [];
  for (const page of PAGES) {
    const fileUrl = "file:///" + join(ROOT, page).replace(/\\/g, "/").replace(/ /g, "%20");
    for (const w of WIDTHS) {
      await send("Emulation.setDeviceMetricsOverride", { width: w, height: 900, deviceScaleFactor: 1, mobile: w < 800 });
      await send("Page.navigate", { url: fileUrl });
      await sleep(1400);
      await send("Runtime.evaluate", { expression: `document.querySelectorAll('.panel-reveal').forEach(n => n.classList.add('is-in'))` });
      await sleep(1600);

      // 审计：溢出 / 非封面图失真 / 隐藏容器裁字
      const r = await send("Runtime.evaluate", { returnByValue: true, expression: `(() => {
        const de = document.documentElement;
        const out = { overflow: de.scrollWidth > window.innerWidth + 1 ? de.scrollWidth + ">" + window.innerWidth : null, distort: [], clip: [] };
        document.querySelectorAll(".figure img").forEach(img => {
          if (img.closest(".cover-art")) return;
          if (!img.naturalWidth) return;
          const nat = img.naturalWidth / img.naturalHeight, ren = img.clientWidth / img.clientHeight;
          if (Math.abs(nat - ren) / nat > 0.06) out.distort.push(img.src.split("/").pop() + " nat=" + nat.toFixed(2) + " ren=" + ren.toFixed(2));
        });
        document.querySelectorAll(".panel, .quote, .tbc, figcaption").forEach(el => {
          const cs = getComputedStyle(el);
          if (cs.overflow === "hidden" && el.scrollHeight > el.clientHeight + 4 && el.textContent.trim()) {
            out.clip.push((el.className || el.tagName).toString().slice(0, 30) + " sh=" + el.scrollHeight + " ch=" + el.clientHeight);
          }
        });
        return out;
      })()` });
      const v = r.result?.value || {};
      if (v.overflow) problems.push(`[溢出] ${page}@${w}: ${v.overflow}`);
      v.distort?.forEach(d => problems.push(`[失真] ${page}@${w}: ${d}`));
      v.clip?.forEach(c => problems.push(`[裁切] ${page}@${w}: ${c}`));

      const shot = await send("Page.captureScreenshot", { format: "png", captureBeyondViewport: true });
      writeFileSync(join(OUT, page.replace(".html", "") + "-" + w + ".png"), Buffer.from(shot.data, "base64"));
    }
    console.log("done:", page);
  }

  console.log(`\n== 多视口审计完成：${PAGES.length * WIDTHS.length} 张全页截图，${problems.length} 个问题，console 异常 ${errors.length} ==`);
  problems.forEach(p => console.log("  " + p));
  errors.slice(0, 3).forEach(e => console.log("  " + e));
  console.log(problems.length || errors.length ? "FAIL" : "PASS");
  process.exitCode = (problems.length || errors.length) ? 1 : 0;
} catch (e) { console.error("MV ERROR:", e.message); process.exitCode = 2; }
finally { try { ws?.close(); } catch {} try { chrome.kill(); } catch {} await sleep(300); try { execSync(`taskkill /PID ${chrome.pid} /T /F`, { stdio: "ignore" }); } catch {} await sleep(200); try { rmSync(udd, { recursive: true, force: true }); } catch {} }
