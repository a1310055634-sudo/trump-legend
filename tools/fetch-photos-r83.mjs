// R83 白宫改造记照片抓取：Wikimedia Commons 自由许可（PD/CC0/CC BY/CC BY-SA），横幅槽强制横构图
// 用法: node tools/fetch-photos-r83.mjs
// 输出: assets/photos/<slot>.jpg + tools/photos-meta-r83.json（供 CREDITS.md 人工誊写）
import { writeFile, mkdir, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");
const OUT = join(ROOT, "assets", "photos");
const UA = "TrumpLegendEditor/1.0 (local static site builder)";
const ALLOW = /public domain|cc0|cc by/i;

const SLOTS = [
  { slot: "wh-north-portico", w: 1200, landscape: true, prefer: "White House north side.jpg", search: "intitle:\"White House\" north lawn" },
  { slot: "wh-rose-garden",   w: 900,  landscape: true, search: "intitle:\"Rose Garden\" White House" },
  { slot: "wh-east-wing",     w: 900,  landscape: true, search: "intitle:\"East Wing\" White House" },
];

async function api(params) {
  const u = new URL("https://commons.wikimedia.org/w/api.php");
  Object.entries(params).forEach(([k, v]) => u.searchParams.set(k, String(v)));
  const r = await fetch(u, { headers: { "User-Agent": UA } });
  if (!r.ok) throw new Error("API " + r.status + " " + u.searchParams.get("action"));
  return r.json();
}
const stripTags = (s) => (s || "").replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();

function norm(title, ii) {
  const md = ii.extmetadata || {};
  return {
    title,
    license: stripTags(md.LicenseShortName?.value) || "unknown",
    artist: stripTags(md.Artist?.value) || "unknown",
    page: "https://commons.wikimedia.org/wiki/File:" + encodeURIComponent(title.replace(/ /g, "_")),
    width: ii.width, height: ii.height, mime: ii.mime,
  };
}
async function infoByTitle(title) {
  try {
    const j = await api({ action: "query", titles: "File:" + title, prop: "imageinfo",
      iiprop: "url|extmetadata|size|mime", format: "json" });
    const pages = j?.query?.pages || {};
    const p = Object.values(pages)[0];
    if (!p || p.missing !== undefined || !p.imageinfo?.length) return null;
    return norm(p.title.replace(/^File:/, ""), p.imageinfo[0]);
  } catch { return null; }
}
async function search(q, landscape) {
  try {
    const j = await api({ action: "query", generator: "search", gsrsearch: q, gsrnamespace: 6, gsrlimit: 10,
      prop: "imageinfo", iiprop: "url|extmetadata|size|mime", format: "json" });
    const pages = Object.values(j?.query?.pages || {});
    pages.sort((a, b) => (a.index || 99) - (b.index || 99));
    for (const p of pages) {
      if (p.missing !== undefined || !p.imageinfo?.length) continue;
      const ii = p.imageinfo[0];
      if (!/^image\/(jpeg|png)$/.test(ii.mime || "")) continue;
      if ((ii.width || 0) < 800) continue;
      if (landscape && (ii.width || 0) <= (ii.height || 1)) continue; // 横幅槽只收横构图
      const title = p.title.replace(/^File:/, "");
      if (/\bmap\b|logo|coat of arms|seal|diagram|chart|plan\b/i.test(title)) continue;
      const meta = norm(title, ii);
      if (!ALLOW.test(meta.license)) continue;
      return meta;
    }
    return null;
  } catch { return null; }
}
async function download(meta, width, dest) {
  const u = "https://commons.wikimedia.org/wiki/Special:FilePath/" +
    encodeURIComponent(meta.title.replace(/ /g, "_")) + "?width=" + width;
  const r = await fetch(u, { headers: { "User-Agent": UA }, redirect: "follow" });
  if (!r.ok) throw new Error("DL " + r.status + " " + meta.title);
  const buf = Buffer.from(await r.arrayBuffer());
  if (buf.length < 12000 || buf[0] !== 0xff || buf[1] !== 0xd8) throw new Error("DL 不是有效 JPEG: " + meta.title);
  await writeFile(dest, buf);
  return buf.length;
}

await mkdir(OUT, { recursive: true });
const report = [];
for (const s of SLOTS) {
  const dest = join(OUT, s.slot + ".jpg");
  if (existsSync(dest)) { report.push({ slot: s.slot, skipped: "exists" }); continue; }
  let meta = s.prefer ? await infoByTitle(s.prefer) : null;
  if (meta && !ALLOW.test(meta.license)) meta = null;
  if (meta && s.landscape && (meta.width || 0) <= (meta.height || 1)) meta = null;
  if (!meta) meta = await search(s.search, s.landscape);
  if (!meta) { report.push({ slot: s.slot, error: "NO CANDIDATE (search: " + s.search + ")" }); continue; }
  try {
    const bytes = await download(meta, s.w, dest);
    const size = (await stat(dest)).size;
    report.push({ slot: s.slot, ...meta, bytes });
    console.log(`OK  ${s.slot}  <-  ${meta.title}  [${meta.license}]  ${(size / 1024).toFixed(0)}KB`);
  } catch (e) {
    report.push({ slot: s.slot, error: e.message, candidate: meta.title });
    console.log(`ERR ${s.slot}: ${e.message}`);
  }
}
await writeFile(join(ROOT, "tools", "photos-meta-r83.json"), JSON.stringify(report, null, 2));
console.log("\n== 汇总 ==");
report.forEach(r => console.log(`${r.error ? "ERR" : "OK "} ${r.slot}${r.error ? " — " + r.error : ""}`));
