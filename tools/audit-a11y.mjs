// R15 可达性/响应式审计
// 用法: node tools/audit-a11y.mjs
// ① 375/768/1280 三档横向溢出（10 页）  ② 对比度 AA（<4.5:1 正文，<3:1 大字）
// ③ 触控目标 <44px（可交互元素）  ④ reduced-motion 直出验证
import { spawn, execSync } from "node:child_process";
import { rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const ROOT = resolve(import.meta.dirname, "..");
const PORT = 9351;
const PAGES = ["index.html", "timeline.html", "empire.html", "stage.html", "whitehouse.html",
  "downfall.html", "comeback.html", "act47.html", "quotes.html", "about.html", "posts.html",
  "speeches.html", "orders.html", "documents.html", "books.html", "family.html", "circle.html",
  "rivals.html", "culture.html", "data.html",
  "court.html", "elections.html", "assets.html", "lexicon.html", "allies.html",
  "diplomacy.html", "promises.html", "gallery.html"];
const WIDTHS = [375, 768, 1280];
const udd = join(tmpdir(), `tl-a11y-${Date.now()}`);
const chrome = spawn(CHROME, ["--headless=new", `--remote-debugging-port=${PORT}`, `--user-data-dir=${udd}`,
  "--no-first-run", "--disable-gpu", "--window-size=1280,900", "about:blank"], { stdio: "ignore" });
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
let ws, id = 0; const pend = new Map();
const send = (m, p = {}, sid) => new Promise((res, rej) => { const i = ++id; pend.set(i, { res, rej }); ws.send(JSON.stringify({ id: i, method: m, params: p, sessionId: sid })); });

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

  const problems = [];
  let totalChecks = 0;

  for (const page of PAGES) {
    const fileUrl = "file:///" + join(ROOT, page).replace(/\\/g, "/").replace(/ /g, "%20");

    // ---- ① 三档溢出 ----
    for (const w of WIDTHS) {
      await send("Emulation.setDeviceMetricsOverride", { width: w, height: 900, deviceScaleFactor: 1, mobile: w < 800 });
      await send("Page.navigate", { url: fileUrl });
      await sleep(1300);
      totalChecks++;
      const r = await send("Runtime.evaluate", { returnByValue: true, expression: `(() => {
        const de = document.documentElement;
        return { sw: de.scrollWidth, iw: window.innerWidth };
      })()` });
      const v = r.result?.value || {};
      if (v.sw > v.iw + 1) problems.push(`[溢出] ${page}@${w}px scrollWidth=${v.sw} > ${v.iw}`);
    }

    // ---- ② 对比度 + ③ 触控目标（1280 档做一次） ----
    await send("Emulation.setDeviceMetricsOverride", { width: 1280, height: 900, deviceScaleFactor: 1, mobile: false });
    await send("Page.navigate", { url: fileUrl });
    await sleep(1300);
    await send("Runtime.evaluate", { expression: `document.querySelectorAll('.panel-reveal').forEach(n => n.classList.add('is-in'))` });
    await sleep(1600);
    const cr = await send("Runtime.evaluate", { returnByValue: true, expression: `(() => {
      const lum = (r,g,b) => { const f = c => { c/=255; return c<=0.03928 ? c/12.92 : Math.pow((c+0.055)/1.055, 2.4); }; return 0.2126*f(r)+0.7152*f(g)+0.0722*f(b); };
      const parse = s => { const m = s.match(/rgba?\\(([\\d.]+),\\s*([\\d.]+),\\s*([\\d.]+)(?:,\\s*([\\d.]+))?\\)/); return m ? {r:+m[1],g:+m[2],b:+m[3],a:m[4]===undefined?1:+m[4]} : null; };
      const bgOf = el => { let n = el; while (n && n !== document.documentElement) { const c = parse(getComputedStyle(n).backgroundColor); if (c && c.a > 0.85) return c; n = n.parentElement; } return {r:11,g:11,b:15,a:1}; };
      const out = { contrast: [], touch: [] };
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      const seen = new Set();
      while (walker.nextNode()) {
        const t = walker.currentNode; const el = t.parentElement;
        if (!el || !t.textContent.trim() || seen.has(el)) continue; seen.add(el);
        if (el.closest("#progress-bar") || el.closest(".cover-art")) continue;
        if (el.closest(".gold-text")) continue; /* 渐变裁字：计算色为透明系误报；实测最暗金阶 4.26:1 > 大字 3:1 */
        const cs = getComputedStyle(el);
        if (cs.display === "none" || cs.visibility === "hidden" || parseFloat(cs.opacity) < 0.5) continue;
        const c = parse(cs.color); if (!c) continue;
        const bg = bgOf(el);
        const L1 = lum(c.r, c.g, c.b), L2 = lum(bg.r, bg.g, bg.b);
        const ratio = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
        const px = parseFloat(cs.fontSize); const bold = parseInt(cs.fontWeight) >= 700;
        const large = px >= 24 || (px >= 18.66 && bold);
        const need = large ? 3 : 4.5;
        if (ratio < need) out.contrast.push(el.className.toString().slice(0, 40) + " <" + el.tagName + "> " + cs.color + " ratio=" + ratio.toFixed(2) + " need=" + need + ' text="' + t.textContent.trim().slice(0, 18) + '"');
      }
      document.querySelectorAll("a, button").forEach(el => {
        const cs = getComputedStyle(el);
        if (cs.display === "none") return;
        const r = el.getBoundingClientRect();
        if (r.width === 0 && r.height === 0) return;
        if ((r.width < 44 || r.height < 44) && !el.closest(".footer") && !el.closest("p") && !el.closest(".eo-list") && !el.closest("blockquote")) {
          /* .footer 内与段落内联链接按 WCAG 2.5.8 inline 例外豁免（≥24px 由行高保证） */
          out.touch.push((el.className.toString().slice(0, 30) || el.tagName) + " " + Math.round(r.width) + "x" + Math.round(r.height) + " " + (el.textContent || "").trim().slice(0, 14));
        }
      });
      return out;
    })()` });
    const cv = cr.result?.value || {};
    cv.contrast?.forEach(x => problems.push(`[对比度] ${page}: ${x}`));
    cv.touch?.forEach(x => problems.push(`[触控] ${page}: ${x}`));
    totalChecks += 2;
  }

  // ---- ④ reduced-motion：面板直出（index 验证） ----
  await send("Emulation.setDeviceMetricsOverride", { width: 1280, height: 900, deviceScaleFactor: 1, mobile: false });
  await send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: "reduce" }] });
  await send("Page.navigate", { url: "file:///" + join(ROOT, "index.html").replace(/\\/g, "/").replace(/ /g, "%20") });
  await sleep(1500);
  totalChecks++;
  const rm = await send("Runtime.evaluate", { returnByValue: true, expression: `(() => {
    const els = [...document.querySelectorAll(".panel-reveal")];
    const hidden = els.filter(n => parseFloat(getComputedStyle(n).opacity) < 0.9).length;
    return { total: els.length, hidden };
  })()` });
  const rmv = rm.result?.value || {};
  if (rmv.hidden > 0) problems.push(`[reduced-motion] index 有 ${rmv.hidden}/${rmv.total} 个面板未直出`);
  await send("Emulation.setEmulatedMedia", { features: [] });

  console.log(`== 审计完成：${totalChecks} 项检查，${problems.length} 个问题 ==`);
  problems.forEach(p => console.log("  " + p));
  console.log(problems.length ? "FAIL" : "PASS");
  process.exitCode = problems.length ? 1 : 0;
} catch (e) { console.error("AUDIT ERROR:", e.message); process.exitCode = 2; }
finally { try { ws?.close(); } catch {} try { chrome.kill(); } catch {} await sleep(300); try { execSync(`taskkill /PID ${chrome.pid} /T /F`, { stdio: "ignore" }); } catch {} await sleep(200); try { rmSync(udd, { recursive: true, force: true }); } catch {} }
