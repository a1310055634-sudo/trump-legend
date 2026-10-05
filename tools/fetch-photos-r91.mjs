// R91 gallery 2020s 扩容采集：Commons 白名单三关（intitle 限定+extmetadata+魔数），候选池允许可用不足
import { writeFile, mkdir, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");
const OUT = join(ROOT, "assets", "photos");
const UA = "TrumpLegendEditor/1.0 (local static site builder)";
const ALLOW = /public domain|cc0|cc by/i;

const SLOTS = [
  { slot: "gallery-2026-sotu2026",  w: 900, search: "intitle:\"Trump\" State of the Union 2026" },
  { slot: "gallery-2026-parade",    w: 900, search: "Trump military parade Washington June 2025" },
  { slot: "gallery-2026-cabinet",   w: 900, search: "intitle:\"Trump\" cabinet meeting 2025" },
  { slot: "gallery-2026-zelensky",  w: 900, search: "Trump Zelensky Oval Office 2025" },
  { slot: "gallery-2026-wh-exterior", w: 900, search: "intitle:\"White House\" 2025 Washington exterior" },
  { slot: "gallery-2026-sharm",     w: 900, search: "intitle:\"Sharm\" summit peace 2025 Trump" },
  { slot: "gallery-2026-speech",    w: 900, search: "Trump speech 2026 Congress" },
  { slot: "gallery-2026-kirk",      w: 900, search: "intitle:\"Trump\" Charlie Kirk memorial 2025" },
];

async function api(params) {
  const u = new URL("https://commons.wikimedia.org/w/api.php");
  Object.entries(params).forEach(([k, v]) => u.searchParams.set(k, String(v)));
  const r = await fetch(u, { headers: { "User-Agent": UA } });
  if (!r.ok) throw new Error("API " + r.status);
  return r.json();
}
const stripTags = (s) => (s || "").replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
function norm(title, ii) {
  const md = ii.extmetadata || {};
  return {
    title,
    license: stripTags(md.LicenseShortName?.value) || "unknown",
    artist: stripTags(md.Artist?.value) || "unknown",
    date: stripTags(md.DateTimeOriginal?.value || "").slice(0, 10),
    width: ii.width, height: ii.height,
  };
}
async function search(q) {
  try {
    const j = await api({ action: "query", generator: "search", gsrsearch: q, gsrnamespace: 6, gsrlimit: 10,
      prop: "imageinfo", iiprop: "url|extmetadata|size|mime", format: "json" });
    const pages = Object.values(j?.query?.pages || {});
    pages.sort((a, b) => (a.index || 99) - (b.index || 99));
    for (const p of pages) {
      if (p.missing !== undefined || !p.imageinfo?.length) continue;
      const ii = p.imageinfo[0];
      if (!/^image\/jpeg$/.test(ii.mime || "")) continue;
      if ((ii.width || 0) < 700) continue;
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
  if (!r.ok) throw new Error("DL " + r.status);
  const buf = Buffer.from(await r.arrayBuffer());
  if (buf.length < 12000 || buf[0] !== 0xff || buf[1] !== 0xd8) throw new Error("非有效 JPEG");
  await writeFile(dest, buf);
  return buf.length;
}

await mkdir(OUT, { recursive: true });
const report = [];
for (const s of SLOTS) {
  const dest = join(OUT, s.slot + ".jpg");
  if (existsSync(dest)) { report.push({ slot: s.slot, skipped: "exists" }); continue; }
  const meta = await search(s.search);
  if (!meta) { report.push({ slot: s.slot, error: "NO CANDIDATE" }); console.log(`--  ${s.slot}: 无候选（允许，不硬凑）`); continue; }
  try {
    const bytes = await download(meta, s.w, dest);
    const size = (await stat(dest)).size;
    report.push({ slot: s.slot, ...meta, bytes });
    console.log(`OK  ${s.slot}  <-  ${meta.title}  [${meta.license}]  ${(size / 1024).toFixed(0)}KB`);
  } catch (e) {
    report.push({ slot: s.slot, error: e.message });
    console.log(`ERR ${s.slot}: ${e.message}`);
  }
}
await writeFile(join(ROOT, "tools", "photos-meta-r91.json"), JSON.stringify(report, null, 2));
console.log("\n== 汇总 ==");
report.forEach(r => console.log(`${r.error ? (r.error === "NO CANDIDATE" ? "-- " : "ERR") : "OK "} ${r.slot}`));
