// R17 QA：断链与资产完整性（href/src 全量解析 → 本地文件存在性）
import { readFile, readdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, dirname, resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "..");
const PAGES = ["index.html", "timeline.html", "empire.html", "stage.html", "whitehouse.html",
  "downfall.html", "comeback.html", "act47.html", "quotes.html", "about.html", "posts.html",
  "speeches.html", "orders.html", "documents.html", "books.html", "family.html", "circle.html",
  "rivals.html", "culture.html", "data.html",
  "court.html", "elections.html", "assets.html", "lexicon.html", "allies.html",
  "diplomacy.html", "promises.html", "gallery.html", "cabinet.html", "pardons.html", "crypto.html", "media.html", "renovation.html", "immigration.html"];
const problems = [];

for (const page of PAGES) {
  const s = await readFile(join(ROOT, page), "utf8");
  const refs = [...s.matchAll(/(?:href|src)="([^"#]+)(#[^"]*)?"/g)].map(m => m[1]);
  for (const ref of refs) {
    if (/^(https?:|mailto:|data:)/.test(ref)) continue; // 外链与 data URI 跳过（页脚禁外链另查）
    const target = join(ROOT, ref.split("?")[0]);
    if (!existsSync(target)) problems.push(`${page} -> ${ref} (文件不存在)`);
  }
}

// 外链清点（应只有 CREDITS 相关说明/无 <img src=http）——只警告不判失败
let externalImg = 0;
for (const page of PAGES) {
  const s = await readFile(join(ROOT, page), "utf8");
  const ext = [...s.matchAll(/<img[^>]+src="(https?:[^"]+)"/g)];
  externalImg += ext.length;
  ext.forEach(m => problems.push(`${page} 外链图片: ${m[1]}`));
}

console.log(`== 断链审计：34 页 href/src 全量，外链图片 ${externalImg} ==`);
console.log(problems.length ? problems.map(p => "  " + p).join("\n") + "\nFAIL" : "PASS（零断链、零外链图片）");
process.exitCode = problems.length ? 1 : 0;
