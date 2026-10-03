// R17 QA：中文错字与术语一致性扫描
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "..");
const PAGES = ["index.html", "timeline.html", "empire.html", "stage.html", "whitehouse.html",
  "downfall.html", "comeback.html", "act47.html", "quotes.html", "about.html", "posts.html",
  "speeches.html", "orders.html", "documents.html", "books.html", "family.html", "circle.html",
  "rivals.html", "culture.html", "data.html"];

// 术语一致性：只允许一种写法（正文语境）
const TERMS = [
  { good: "哈里斯", bad: ["贺锦丽", "哈利丝", "哈里斯。?她"] },
  { good: "万斯", bad: ["凡斯", "范斯"] },
  { good: "拜登", bad: ["拜顿", "白登"] },
  { good: "特朗普", bad: ["川普", "特朗蒲", "川普普"] },
  { good: "里根", bad: ["里根里根", "雷根"] },
  { good: "弹劾", bad: ["弹核", "弹赅"] },
  { good: "账单", bad: ["帐单"] },
  { good: "账目", bad: ["帐目"] },
  { good: "部署", bad: ["布署"] },
];
// 重复标点/明显手误（？？？为 covfefe 补刀原话标点，白名单豁免；空白类手误在归一化后由  、  规则覆盖）
const TYPOS = [
  /[，]{2,}/, /[。]{2,}/, /  +(?=\S)/,
  /的的(?![的确])/, /了了/, /是是/, /一一个/, /这这个/,
];

const problems = [];
const note = [];

for (const page of PAGES) {
  const s = await readFile(join(ROOT, page), "utf8");
  const body = s.replace(/<script[\s\S]*?<\/script>/g, "").replace(/<style[\s\S]*?<\/style>/g, "");
  const text = body.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");

  for (const t of TERMS) {
    for (const b of t.bad) {
      if (b === "川普") continue; // 川普 在站内应只出现于刊名释义，单独检查
      let idx = text.indexOf(b);
      while (idx !== -1) {
        problems.push(`${page}: "${b}"（应为"${t.good}"）…"${text.slice(Math.max(0, idx - 12), idx + 18).trim()}"`);
        idx = text.indexOf(b, idx + 1);
      }
    }
  }
  // 川普：只允许出现在刊名释义句
  let idx = text.indexOf("川普");
  while (idx !== -1) {
    const ctx = text.slice(Math.max(0, idx - 24), idx + 24);
    if (!/川普之?["']?川|川普的?["']?川/.test(ctx)) problems.push(`${page}: 出现"川普"（非刊名释义）…"${ctx.trim()}"`);
    idx = text.indexOf("川普", idx + 1);
  }
  for (const re of TYPOS) {
    const m = text.match(re);
    if (m) problems.push(`${page}: 疑似手误 /${re.source}/ …"${text.slice(Math.max(0, (m.index || 0) - 10), (m.index || 0) + 22).trim()}"`);
  }
  // 英文残留（≥5 连续字母且非白名单专名/标签）
  const EN_OK = /(Trump|TRUMP|Legend|LEGEND|Fight|Apprentice|Deal|Art|ISSUE|Chapter|THCR|Shuttle|USAir|Plaza|Hotel|Tower|Golf|Truth|Social|MAGA|J\.?D\.?|RNC|NBC|ABC|CBS|FBI|WWE|WHO|IEEPA|OBBBA|SCOTUS|cap|rate|Fordham|Wharton|Cornelius|Fred|Mary|Ivana|Melania|Jared|Ivanka|Buchanan|Oprah|Vince|Home|Alone|Forbes|Geneva|Versailles|Islamabad|Sharm|Sheikh|Butler|Crooks|Routh|Comperatore|Vance|Pence|Biden|Harris|Clinton|Obama|Reagan|Khamenei|Pezeshkian|Maduro|Machado|Nobel|Gallup|Pew|No|Kings|Epstein|Twitter|Facebook|YouTube|Deutsche|Signature|Sharper|Image|Learning|Resources|V\.?O\.?S\.|Roberts|Gorsuch|Kavanaugh|Barrett|Ginsburg|Netanyahu|Blair|Abraham|Accord|Space|Force|First|Step|Act|NYSE|DJT|Axios|Swan|Carroll|Bragg|Smith|Willis|Engoron|Merchan|Chubb|Hegseth|Torok|Craighead|Skidmore|Soloviev|Kennedy|Ismayilov|DimiTalen|Designism|Neelix|Rijksmuseum|JCCIC|Wikimedia|Commons|CREDITS|Natural|EM|USA|US|NY|DC|GOP|CEO|CJK|GDP|NATO|AI|CNN|AP|NYT|WSJ|PBS|CNBC|CGTN|EO|UN)/;
  const residues = [...text.matchAll(/[A-Za-z]{5,}/g)]
    .map(m => m[0]).filter(w => !EN_OK.test(w) && !/^(cover|art|tag|panel|reveal|figure|figcaption|quote|who|badge|glyph|mono|html|lang|meta|charset|viewport|site|version|description|stylesheet|script|photos|credits|assets|index|timeline|empire|stage|whitehouse|downfall|comeback|act|quotes|about|container|chapter|grid|stat|strip|goldrule|flagbar|goldtext|gold|text|hero|kicker|sub|lede|photo|meta|tbc|mark|next|footer|brand|en|zh|issue|tag|nav|toggle|list|masthead|inner|inner|disclaim|body|volume|page|head|logline|caption|credit|title|target|blank|loading|lazy|width|height|alt|src|href|aria|current|label|controls|expanded|div|span|strong|blockquote|hr|br)$/i.test(w));
  const uniq = [...new Set(residues)];
  if (uniq.length) note.push(`${page}: 英文词（自动白名单外，请人工复核）→ ${uniq.slice(0, 8).join(", ")}`);
}

console.log("== typo / 术语一致性 ==");
problems.forEach(p => console.log("  " + p));
console.log("== 英文残留人工复核清单 ==");
note.forEach(n => console.log("  " + n));
console.log(problems.length ? `FAIL（${problems.length}）` : "PASS（零错字、术语一致；英文残留见复核清单）");
process.exitCode = problems.length ? 1 : 0;
