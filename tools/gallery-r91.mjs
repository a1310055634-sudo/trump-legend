// R91 gallery.html 2020s 节插入 7 张新照 + about 计数/致谢同步 + 打戳
import { readFileSync, writeFileSync } from "node:fs";
const G = new URL("../gallery.html", import.meta.url);
let g = readFileSync(G, "utf8");

const anchor = `    <figcaption>2025 · 横须贺海军基地，与日本首相高市早苗同框——第二任期亚洲外交的一帧 <span class="credit">｜内阁官房 · CC BY 4.0</span></figcaption>
  </figure>`;
if (!g.includes(anchor)) { console.log("gallery 锚点未命中"); process.exit(1); }

const fig = (src, alt, cap, credit) => `  <figure class="figure panel-reveal">
    <img src="assets/photos/${src}" alt="${alt}">
    <figcaption>${cap} <span class="credit">｜${credit}</span></figcaption>
  </figure>`;

const add = "\n" + [
  fig("gallery-2026-parade.jpg", "2025 年 6 月 14 日华盛顿陆军 250 周年大阅兵",
    "2025-06-14 · 陆军 250 周年华盛顿大阅兵——恰逢他 79 岁生日，第二任期最盛大的一场仪式",
    "白宫 · 公有领域"),
  fig("gallery-2026-zelensky.jpg", "2025 年 2 月 28 日椭圆办公室会晤泽连斯基",
    "2025-02-28 · 椭圆办公室会晤乌克兰总统泽连斯基——矿产协议未签、镜头前不欢而散的那一幕（图注按事实中性表述）",
    "白宫 · 公有领域"),
  fig("gallery-2026-cabinet.jpg", "2025 年 10 月 17 日内阁室会见泽连斯基",
    "2025-10-17 · 内阁室再会泽连斯基——八个月后的第二次握手，联合国安理会框架下的停火讨论已有不同气氛",
    "白宫 · 公有领域"),
  fig("gallery-2026-kirk.jpg", "2025 年 9 月 21 日出席柯克纪念仪式",
    "2025-09-21 · 出席柯克纪念仪式——亚利桑那州体育场内十万人的葬礼，九天后成为 Kimmel 风波的引线（卷·30 第六节）",
    "白宫 · 公有领域"),
  fig("gallery-2026-sotu2026.jpg", "2025 年与欧盟委员会主席冯德莱恩会晤",
    "2025 · 与欧盟委员会主席冯德莱恩会晤——\"解放日\"关税战后对欧谈判的框架协议一线（卷·24）",
    "Fred Guerdin / 欧盟委员会 · CC BY 4.0（须署名）"),
  fig("gallery-2026-sharm.jpg", "2025 年 10 月 13 日沙姆沙伊赫和平峰会第二帧",
    "2025-10-13 · 沙姆沙伊赫和平峰会——与 sharm-2025 为同系列 04/05 两帧，20 点方案签署日的另一次快门",
    "Roman Ismayilov（埃及官方摄影）· CC BY 4.0（须署名）"),
  fig("gallery-2026-wh-exterior.jpg", "白宫屋顶的太阳能板",
    "白宫屋顶的太阳能板——历届能源政策在这座屋顶上的层积（卷·31 改造记的能源注脚）",
    "白宫 · 公有领域"),
].join("\n");

g = g.replace(anchor, anchor + add);
// 打戳
g = g.replace(/v3\.0\.0/g, "v4.0.0-dev-R91");
writeFileSync(G, g);
console.log("gallery figures:", (g.match(/<figure class="figure/g) || []).length);

// about 同步：46→53 与致谢
const A = new URL("../about.html", import.meta.url);
let a = readFileSync(A, "utf8");
a = a.replace("全部 <strong>46 张照片</strong>", "全部 <strong>53 张照片</strong>");
const ackAnchor = "<p>V4 改造记阶段新增致谢：Nminow（白宫北草坪横构图）、白宫摄影团队（玫瑰园草坪时代官方照）、Harrison Keely（东翼外观档案照）——全站照片 43→46 张，逐张登记于 CREDITS.md。</p>";
if (!a.includes(ackAnchor)) { console.log("about 锚点未命中"); process.exit(1); }
a = a.replace(ackAnchor, ackAnchor + "\n    <p>V4 影像盘整阶段新增致谢：白宫摄影团队（陆军 250 周年阅兵、内阁室会见、柯克纪念仪式与屋顶太阳能板等官方照）、欧盟委员会视听服务（Fred Guerdin，冯德莱恩会晤）、Roman Ismayilov（沙姆沙伊赫峰会第二帧）——全站照片 46→53 张，逐张登记于 CREDITS.md。</p>");
a = a.replace(/v4\.0\.0-dev-R83/g, "v4.0.0-dev-R91");
writeFileSync(A, a);
console.log("about updated:", a.includes("53 张照片"));
