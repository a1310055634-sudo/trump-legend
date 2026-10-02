// 汇总 10 张照片的完整元数据 → tools/photos-meta.json（供 CREDITS.md 誊写）
import { writeFile } from "node:fs/promises";
const UA = "TrumpLegendEditor/1.0 (local static site builder)";
const TITLES = {
  "hero-2025":      "January 2025 Official Presidential Portrait of Donald J. Trump.jpg",
  "portrait-2017":  "Donald Trump official portrait.jpg",
  "reagan-1987":    "Trump Meets Reagan.jpg",
  "trump-tower":    "Trump Tower main entrance.jpg",
  "walk-star":      "Donald Trump star Hollywood Walk of Fame.JPG",
  "speech-2016":    "Donald Trump speaking with supporters at a campaign rally at the Phoenix Convention Center.jpg",
  "summit-2018":    "Kim and Trump shaking hands at the red carpet during the DPRK–USA Singapore Summit.jpg",
  "farewell-2021":  "President Trump and the First Lady Depart for Florida (50800212937).jpg",
  "rally-2024":     "Butler Farm Show Airport Trump Rally 2024 07.jpg",
  "inaug-2025":     "Donald Trump takes the oath of office (2025).jpg",
};
const strip = (s) => (s || "").replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
const out = [];
for (const [slot, title] of Object.entries(TITLES)) {
  const u = new URL("https://commons.wikimedia.org/w/api.php");
  Object.entries({ action: "query", titles: "File:" + title, prop: "imageinfo",
    iiprop: "extmetadata|size", format: "json" }).forEach(([k, v]) => u.searchParams.set(k, String(v)));
  const j = await (await fetch(u, { headers: { "User-Agent": UA } })).json();
  const p = Object.values(j?.query?.pages || {})[0];
  const md = p?.imageinfo?.[0]?.extmetadata || {};
  out.push({ slot, title, license: strip(md.LicenseShortName?.value) || "unknown",
    artist: strip(md.Artist?.value) || "unknown",
    credit: strip(md.Credit?.value) || "",
    page: "https://commons.wikimedia.org/wiki/File:" + encodeURIComponent(title.replace(/ /g, "_")) });
  console.log(slot.padEnd(14), "|", out.at(-1).license.padEnd(15), "|", out.at(-1).artist.slice(0, 50));
  await new Promise(r => setTimeout(r, 400));
}
await writeFile(new URL("./photos-meta.json", import.meta.url), JSON.stringify(out, null, 2));
console.log("\nsaved -> tools/photos-meta.json");
