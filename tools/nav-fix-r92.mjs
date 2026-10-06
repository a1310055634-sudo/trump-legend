// R92 QA 一：全站刊头导航一致性收口（两阶段：先全量校验计算缺失，后统一写盘）
// 标准导航模板 = immigration.html（V4 最全，含 26–32 全部新馆）
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
const ROOT = join(import.meta.dirname, "..");

const std = readFileSync(join(ROOT, "immigration.html"), "utf8");
// 从标准页提取 nav__list 内全部 li（href → 整行）
const stdNav = std.slice(std.indexOf('<ul class="nav__list">'), std.indexOf("</ul>"));
const stdItems = [...stdNav.matchAll(/<li><a href="([a-z]+\.html)">([^<]+)<\/a><\/li>/g)]
  .map(m => ({ href: m[1], label: m[2], line: m[0] }));
console.log("标准导航项数:", stdItems.length);

// 标准顺序里的新馆段（26 起）
const NEW_ONES = stdItems.filter(i => /^0?[2-3][0-9] |^2[6-9] |^3[0-2] /.test(i.label) ||
  ["gallery.html","cabinet.html","pardons.html","crypto.html","media.html","renovation.html","immigration.html"].includes(i.href));
const NEW_HREFS = NEW_ONES.map(i => i.href);
console.log("需核查的新馆项:", NEW_HREFS.join(", "));

const pages = readdirSync(ROOT).filter(f => f.endsWith(".html") && f !== "immigration.html");
const plan = [];
const problems = [];
for (const p of pages) {
  const t = readFileSync(join(ROOT, p), "utf8");
  if (!t.includes('<ul class="nav__list">')) { problems.push(p + " 无 nav__list"); continue; }
  const navEnd = t.indexOf('<li class="nav__head">编辑部</li>');
  if (navEnd < 0) { problems.push(p + " 无编辑部锚"); continue; }
  const missing = NEW_ONES.filter(i => !t.includes(`href="${i.href}"`));
  if (missing.length) plan.push({ page: p, missing, navEnd });
}
console.log("\n== 缺失清点 ==");
plan.forEach(p => console.log(`${p.page}: 缺 ${p.missing.map(m => m.label).join(" / ")}`));
if (problems.length) { console.log("\n结构异常（不写盘）:\n" + problems.join("\n")); process.exit(1); }

// 统一写盘：缺失项按标准顺序逐个插在 编辑部 头之前
let written = 0;
for (const p of plan) {
  let t = readFileSync(join(ROOT, p.page), "utf8");
  for (const m of p.missing) {
    const li = `<li><a href="${m.href}">${m.label}</a></li>\n        `;
    const insAt = t.indexOf('<li class="nav__head">编辑部</li>');
    t = t.slice(0, insAt) + li + t.slice(insAt);
    written++;
  }
  writeFileSync(join(ROOT, p.page), t);
}
console.log(`\n== 写盘 ==\n${plan.length} 页补齐，共插入 ${written} 项`);
