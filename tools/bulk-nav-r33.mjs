// R33 批量重构：全站 20 页刊头导航三组化 + 版本戳 v2.0.0-dev-R33 + 六页参见行
// 守卫：每页 nav/meta/footer 各恰好 1 处替换，参见 6 页各 1 处插入；任一不满足即中止不写盘
import { readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
const ROOT = resolve(import.meta.dirname, "..");

const PAGES = ["index.html","timeline.html","empire.html","stage.html","whitehouse.html","downfall.html",
  "comeback.html","act47.html","quotes.html","about.html","posts.html","speeches.html","orders.html",
  "documents.html","books.html","family.html","circle.html","rivals.html","culture.html","data.html"];
const VER = "v2.0.0-dev-R33";
const DATE = "2026-10-04";

const SEE = {
  "timeline.html": "参见：<a href=\"posts.html\">09 社媒馆</a>（名帖原声）· <a href=\"speeches.html\">10 讲台馆</a>（演说全文）· <a href=\"orders.html\">11 令旨馆</a>（行政令名录）· <a href=\"books.html\">13 书页间</a>（他署名的书）。",
  "empire.html": "参见：<a href=\"documents.html\">12 白纸黑字</a>（财务文书与判罚）· <a href=\"books.html\">13 书页间</a>（《交易的艺术》原章）· <a href=\"data.html\">18 数字卷</a>（行政令逐年）。",
  "stage.html": "参见：<a href=\"books.html\">13 书页间</a>（《交易的艺术》逐章精读）· <a href=\"culture.html\">17 荧幕与梗</a>（\"You're fired!\"的文化后传）。",
  "whitehouse.html": "参见：<a href=\"circle.html\">15 幕僚走马灯</a>（第一任期班底台账）· <a href=\"data.html\">18 数字卷</a>（支持率与选举人票）。",
  "downfall.html": "参见：<a href=\"documents.html\">12 白纸黑字</a>（判词原文与在案照）· <a href=\"rivals.html\">16 对手们</a>（2020 对决对写）。",
  "comeback.html": "参见：<a href=\"rivals.html\">16 对手们</a>（2024 对决对写）· <a href=\"posts.html\">09 社媒馆</a>（巴特勒自述原帖）。"
};

const LI = (cur) => {
  const a = (href, label) => `<li><a href="${href}"${href === cur ? ' aria-current="page"' : ""}>${label}</a></li>`;
  return `<nav class="nav" id="mainnav" aria-label="站点目录">
      <ul class="nav__list">
        <li class="nav__head">特辑</li>
        ${a("index.html","封面")}
        ${a("timeline.html","01 生平全录")}
        ${a("empire.html","02 商业帝国")}
        ${a("stage.html","03 舞台")}
        ${a("whitehouse.html","04 白宫岁月")}
        ${a("downfall.html","05 至暗时刻")}
        ${a("comeback.html","06 翻盘")}
        ${a("act47.html","07 第二任期")}
        ${a("quotes.html","08 台词馆")}
        <li class="nav__head">第一手档案馆</li>
        ${a("posts.html","09 社媒馆")}
        ${a("speeches.html","10 讲台馆")}
        ${a("orders.html","11 令旨馆")}
        ${a("documents.html","12 白纸黑字")}
        ${a("books.html","13 书页间")}
        ${a("family.html","14 家族谱")}
        ${a("circle.html","15 幕僚走马灯")}
        ${a("rivals.html","16 对手们")}
        ${a("culture.html","17 荧幕与梗")}
        ${a("data.html","18 数字卷")}
        <li class="nav__head">编辑部</li>
        ${a("about.html","关于本刊")}
      </ul>
    </nav>`;
};

let failures = [];
for (const p of PAGES) {
  const path = join(ROOT, p);
  const before = readFileSync(path, "utf8");
  let t = before;
  const navRe = /<nav class="nav" id="mainnav"[\s\S]*?<\/nav>/;
  if (!navRe.test(t)) { failures.push(`${p}: nav!=1`); continue; }
  t = t.replace(navRe, LI(p));
  const metaRe = /(<meta name="site-version" content=")[^"]*(")/;
  if (!metaRe.test(t)) { failures.push(`${p}: meta!=1`); continue; }
  t = t.replace(metaRe, `$1${VER}$2`);
  const footRe = /(<span id="site-version">)[^<]*(<\/span> · )[0-9-]+/;
  if (!footRe.test(t)) { failures.push(`${p}: footer!=1`); continue; }
  t = t.replace(footRe, `$1${VER}$2${DATE}`);
  if (SEE[p]) {
    const anchor = "  <!-- ================= 未完待续 =================";
    if (!t.includes(anchor) || t.includes("see-also")) { failures.push(`${p}: see-also anchor`); continue; }
    t = t.replace(anchor, `  <p class="see-also">${SEE[p]}</p>\n\n${anchor}`);
  }
  if (t === before) { failures.push(`${p}: no change`); continue; }
  writeFileSync(path, t);
}
if (failures.length) { console.error("ABORT:", failures.join(" | ")); process.exit(1); }
console.log(`OK: ${PAGES.length} pages nav+stamps; see-also on ${Object.keys(SEE).length}`);
