// R94 收官：全站 34 页版本守卫式收拢 v4.0.0（先全量断言后写盘，R45/R73 先例）
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
const ROOT = join(import.meta.dirname, "..");
const pages = readdirSync(ROOT).filter(f => f.endsWith(".html"));
console.log("页数:", pages.length);

// 阶段一：全量读取与计数断言
const plans = [];
let devCount = 0, v3Count = 0;
for (const p of pages) {
  const t = readFileSync(join(ROOT, p), "utf8");
  const dev = (t.match(/v4\.0\.0-dev-R\d+/g) || []).length;
  const v3 = (t.match(/v3\.0\.0/g) || []).length;
  const meta = (t.match(/name="site-version"/g) || []).length;
  const foot = (t.match(/id="site-version"/g) || []).length;
  if (meta !== 1 || foot !== 1) { console.log("ABORT:", p, "meta=" + meta, "foot=" + foot); process.exit(1); }
  devCount += dev; v3Count += v3;
  if (dev || v3) plans.push({ p, t, dev, v3 });
}
console.log("dev 戳:", devCount, "处；v3.0.0 戳:", v3Count, "处；待收拢页:", plans.length);

// 阶段二：统一写盘
for (const { p, t } of plans) {
  writeFileSync(join(ROOT, p), t.replace(/v4\.0\.0-dev-R\d+/g, "v4.0.0").replace(/v3\.0\.0/g, "v4.0.0"));
}

// 阶段三：终态断言
let final = 0, residue = 0;
for (const p of pages) {
  const t = readFileSync(join(ROOT, p), "utf8");
  final += (t.match(/v4\.0\.0/g) || []).length;
  if (/v3\.0\.0|v4\.0\.0-dev/.test(t)) { residue++; console.log("残留:", p); }
}
console.log("终态 v4.0.0 总数:", final, "（预期", pages.length * 2, "）；残留页:", residue);
if (final !== pages.length * 2 || residue !== 0) { console.log("ABORT: 终态断言失败"); process.exit(1); }
console.log("== 收拢完成 ==");
