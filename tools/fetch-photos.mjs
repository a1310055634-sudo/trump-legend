// R01b 真人照片抓取：Wikimedia Commons 自由许可（PD/CC0/CC BY/CC BY-SA）
// 用法: node tools/fetch-photos.mjs
// 输出: assets/photos/<slot>.jpg + tools/photos-meta.json（供 CREDITS.md 人工誊写）
import { writeFile, mkdir, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");
const OUT = join(ROOT, "assets", "photos");
const UA = "TrumpLegendEditor/1.0 (local static site builder)";
const ALLOW = /public domain|cc0|cc by/i;

const SLOTS = [
  { slot: "hero-2025",      w: 1200, prefer: "Official Portrait of President Donald J. Trump (2025).jpg", search: "Donald Trump official portrait 2025" },
  { slot: "portrait-2017",  w: 900,  prefer: "Official White House Portrait of Donald Trump (2017).jpg",  search: "Donald Trump official portrait 2017" },
  { slot: "reagan-1987",    w: 900,  prefer: "Ronald Reagan and Donald Trump 1987.jpg",                   search: "Donald Trump Ronald Reagan" },
  { slot: "trump-tower",    w: 900,  prefer: "Trump Tower, Manhattan (33409788418).jpg",                  search: "Trump Tower Fifth Avenue facade" },
  { slot: "walk-star",      w: 900,  prefer: "Donald Trump's star on the Hollywood Walk of Fame.jpg",     search: "Donald Trump Hollywood Walk of Fame star" },
  { slot: "speech-2016",    w: 900,  prefer: "Donald Trump speaking with supporters at a campaign rally at the Phoenix Convention Center.jpg", search: "Donald Trump speaking with supporters at a rally" },
  { slot: "summit-2018",    w: 900,  prefer: "Kim and Trump shaking hands at the red carpet during the DPRK–USA Singapore Summit.jpg", search: "Trump Kim summit Singapore" },
  { slot: "farewell-2021",  w: 900,  prefer: "President Trump and the First Lady Depart for Florida (50800212937).jpg", search: "Donald Trump departs White House January 2021" },
  { slot: "rally-2024",     w: 900,  prefer: "Butler Farm Show Airport Trump Rally 2024 07.jpg",          search: "Donald Trump rally 2024" },
  { slot: "inaug-2025",     w: 900,  prefer: "Donald Trump takes the oath of office (2025).jpg",          search: "Donald Trump inauguration 2025" },
];

async function api(params) {
  const u = new URL("https://commons.wikimedia.org/w/api.php");
  Object.entries(params).forEach(([k, v]) => u.searchParams.set(k, String(v)));
  const r = await fetch(u, { headers: { "User-Agent": UA } });
  if (!r.ok) throw new Error("API " + r.status + " " + u.searchParams.get("action"));
  return r.json();
}
const stripTags = (s) => (s || "").replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();

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
async function search(q) {
  try {
    const j = await api({ action: "query", generator: "search", gsrsearch: q, gsrnamespace: 6, gsrlimit: 8,
      prop: "imageinfo", iiprop: "url|extmetadata|size|mime", format: "json" });
    const pages = Object.values(j?.query?.pages || {});
    pages.sort((a, b) => (a.index || 99) - (b.index || 99));
    for (const p of pages) {
      if (p.missing !== undefined || !p.imageinfo?.length) continue;
      const ii = p.imageinfo[0];
      if (!/^image\/(jpeg|png)$/.test(ii.mime || "")) continue;
      if ((ii.width || 0) < 600) continue;
      const title = p.title.replace(/^File:/, "");
      if (/\bmap\b|logo|coat of arms|seal|diagram|chart/i.test(title)) continue;
      const meta = norm(title, ii);
      if (!ALLOW.test(meta.license)) continue;
      return meta;
    }
    return null;
  } catch { return null; }
}
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
async function download(meta, width, dest) {
  // 用 Special:FilePath 取缩放版（跟随 302 到 upload.wikimedia.org）
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
  if (!meta) meta = await search(s.search);
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
await writeFile(join(ROOT, "tools", "photos-meta.json"), JSON.stringify(report, null, 2));
console.log("\n== 汇总 ==");
report.forEach(r => console.log(`${r.error ? "ERR" : "OK "} ${r.slot}${r.error ? " — " + r.error : ""}`));
