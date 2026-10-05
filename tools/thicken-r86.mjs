// R86 immigration.html 增厚：新增四节+ref-list 增补+馆后记更新+打戳 R86
import { readFileSync, writeFileSync } from "node:fs";
const F = new URL("../immigration.html", import.meta.url);
let t = readFileSync(F, "utf8");

const HEAD = "  <!-- ================= 馆后记 ================= -->";
if (!t.includes(HEAD)) { console.log("馆后记锚点未命中"); process.exit(1); }

const newSections = `
  <!-- ================= 第六节 · 遇越人数曲线 ================= -->
  <section class="page-head" style="margin:var(--sp-8) 0 var(--sp-5)">
    <span class="volume">第六节 · 遇越人数曲线 · 一条坠落的线</span>
  </section>

  <section class="panel panel-reveal">
    <p>边境遇越数据有<strong>两个口径</strong>，本页曲线写死用其一并逐点注记："encounters（遇越）"含口岸与边境两部分，"apprehensions（拘捕）"仅边境巡逻拘捕——两口径图形差异大，混用即失真。取西南边境口径的三个节点（CBP 公开数据）：2023 年 12 月的历史峰值约 <strong>30.1 万</strong>人次；2025 年 4 月跌至约 <strong>6,100</strong>（此点为拘捕口径）；2026 年 8 月约 <strong>1.2 万</strong>——从峰值算起，回撤逾九成五。补充两个季度级锚点：2025-05/06 报道称越境数"近乎归零"，2026 财年第一季度（2025-10 至 12）全国总遇越 <strong>91,603</strong> 人次，为有记录以来最低的首季（较拜登期峰值低约 92%，CBP/媒体口径）。官方将这条坠落曲线归因于 2025-01-20 的"入侵宣言"公告与执法转向（联邦公报 2026-09 文件口径）；分析者亦提醒需计入墨西哥政府配合度变化等多因（公开报道转述口径）——曲线本身没有争论，争论在于怎么读它。</p>
    <figure class="chart-figure" role="img" aria-label="折线图：西南边境遇越人数三个节点——2023年12月峰值约30.1万，2025年4月约6100，2026年8月约1.2万；曲线从峰值急坠后低位企稳。">
      <svg viewBox="0 0 640 340" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:var(--font-body)">
        <text x="320" y="26" text-anchor="middle" style="fill:var(--gold);font:bold 15px var(--font-display)">西南边境遇越人数 · 三节点（人次/月）</text>
        <line x1="90" y1="266" x2="560" y2="266" style="stroke:var(--gold-deep);stroke-width:1"/>
        <polyline points="90,66 325,256 560,252" fill="none" style="stroke:var(--gold);stroke-width:3"/>
        <circle cx="90" cy="66" r="5" style="fill:var(--gold-bright)"/>
        <text x="96" y="60" style="fill:var(--gold-bright);font:bold 12px var(--font-body)">约 301,000（历史峰值）</text>
        <circle cx="325" cy="256" r="5" style="fill:var(--gold-bright)"/>
        <text x="240" y="286" style="fill:var(--ink-dim);font:11px var(--font-body)">2025-04 约 6,100（拘捕口径）</text>
        <circle cx="560" cy="252" r="5" style="fill:var(--gold-bright)"/>
        <text x="424" y="240" style="fill:var(--gold-bright);font:bold 12px var(--font-body)">约 12,242</text>
        <text x="60" y="60" text-anchor="end" style="fill:var(--ink-dim);font:11px var(--font-body)">2023-12</text>
        <text x="325" y="306" text-anchor="middle" style="fill:var(--ink-dim);font:11px var(--font-body)">2025-04</text>
        <text x="560" y="306" text-anchor="middle" style="fill:var(--ink-dim);font:11px var(--font-body)">2026-08</text>
        <text x="90" y="326" style="fill:var(--ink-faint);font:11px var(--font-body)">口径：encounters（2023-12、2026-08）与 apprehensions（2025-04）逐点注明；数据源 CBP 公开月度数据。</text>
      </svg>
      <figcaption class="chart-caption">数据源：CBP 公开月度统计（The Hill 2023-12、Center Square/Dallas Express 2026 报道转引）；节点式画法沿用卷·18 支持率图先例；FY2026 首季全国口径 91,603 见数据表（正文）。</figcaption>
    </figure>
  </section>

  <!-- ================= 第七节 · 诉讼台账 ================= -->
  <section class="page-head" style="margin:var(--sp-8) 0 var(--sp-5)">
    <span class="volume">第七节 · 诉讼台账 · 谁在法院里</span>
  </section>

  <section class="panel panel-reveal">
    <ol class="eo-list">
      <li><span class="eo-num">01</span><span class="eo-title">出生公民权 · Trump v. CASA → Trump v. Barbara → Nathan v. Trump<em>CASA（2025-06-27）限普遍禁令；Barbara（No. 25-365，2026-06-30）裁定 14160 号令违宪；政府 2026-08-06 再签新令后，ACLU 等 2026-09-28 在哥伦比亚特区联邦法院提起 Nathan v. Trump（"出生公民权第二部"），三个家庭同日提起全国集体诉讼——至基准日均未决。</em></span></li>
      <li><span class="eo-num">02</span><span class="eo-title">国民警卫队部署 · 加州与俄勒冈两线<em>洛杉矶部署被联邦法官裁定违反联邦法（2025-12 终止归还控制权）；俄勒冈线由法官伊默古特阻止调兵（2025-10）——本馆第四节已录，此处入台账索引。</em></span></li>
      <li><span class="eo-num">03</span><span class="eo-title">Alligator Alcatraz · Earthjustice 环境诉讼<em>促成该设施 2026-06-25 停止拘押运营（本馆第四节）——单点维护，此处仅入索引。</em></span></li>
      <li><span class="eo-num">04</span><span class="eo-title">庇护公告相关诉讼 · RAICES v. Mullin 等<em>庇护限制公告的挑战案在册（媒体检索口径），案号与进展待下一轮复核补全。</em></span></li>
    </ol>
    <p>台账读法：五线之中，出生公民权线已到最高法院终局又起新章，警卫队与设施线各有阶段性结果，庇护线仍在中游——<strong>这条战线的相当一部分，不在边境上，在法院里</strong>。</p>
  </section>

  <!-- ================= 第八节 · 287(g) 与地方配合度 ================= -->
  <section class="page-head" style="margin:var(--sp-8) 0 var(--sp-5)">
    <span class="volume">第八节 · 287(g) · 地方配合度光谱</span>
  </section>

  <section class="panel panel-reveal">
    <p>287(g)（联邦授权地方执法机构执行移民法）在第二任期扩到创纪录规模（OBBBA 全额资助——本馆第二节）：州级样本（2026 年公开报道口径）——<strong>佛罗里达与得克萨斯</strong>以州法要求全部县治安官加入（WVXU 2026-05）；<strong>堪萨斯</strong> 36 县＋10 市＋州调查局入约（2026-09）；<strong>印第安纳</strong> 45 份协议涉 42 个州地机构（2026-09-05）；<strong>马里兰</strong> 8 县在约、州议会出现终止议案。全国协议总数的单一权威口径至基准日未获（ICE 官方页滚动更新，如实注记）；国会山则有"终止 287(g) 协议法案"的反制立法被提出。配合度的光谱从"全州强制"到"议会提案退出"——地方与联邦的这一层关系，是拒入境与驱逐之外的第三本账。</p>
  </section>

  <!-- ================= 第九节 · 劳动力争议双写 ================= -->
  <section class="page-head" style="margin:var(--sp-8) 0 var(--sp-5)">
    <span class="volume">第九节 · 劳动力争议 · 双写</span>
  </section>

  <section class="panel panel-reveal">
    <p><strong>行业与研究侧</strong>：SHRM 2026-05-21 引述的新研究发现，执法加强冲击的不只是移民工——<strong>美国本土工人的就业前景同受影响</strong>，且未见工资上升补偿（研究口径）；科罗拉多州 2026-09 的调查称约 <strong>29%</strong> 受访企业报告劳动力供给受到执法行动直接或间接影响；农业线出现"结构性短缺→自动化加速→工资上涨"的连锁报道，农场突袭波及缅因等多州雇主（2026-03 起报道口径）。<strong>执法方口径</strong>：政府主张执法即执行法律、优先保障本土劳动者就业（白宫通行口径，转述）；对劳动力影响的因果归因，政府与行业调查各执一词，本馆并陈不裁决。农业与酒店业的个案声音一律匿名化（活人边界条款）。</p>
  </section>

`;
t = t.replace(HEAD, newSections + HEAD);

// ref-list 增补
const refAnchor = "<li>国民警卫队线：2025-06 联邦化约 4,000–5,000 人赴洛杉矶（加州诉讼与联邦法官违法裁定）；2025-10 伊默古特法官阻止调往俄勒冈；2025-12 终止洛杉矶部署归还控制权——法院记录与多家媒体报道口径。</li>";
if (!t.includes(refAnchor)) { console.log("ref 锚点未命中"); process.exit(1); }
t = t.replace(refAnchor, refAnchor + `
      <li>遇越人数曲线：CBP 公开月度统计（The Hill 2023-12 峰值约 30.1 万；Center Square/Dallas Express 2026——2025-04 约 6,100 拘捕口径、2026-08 约 12,242、FY2026 首季全国 91,603 为史上最低）；"入侵宣言"归因见联邦公报 2026-09-21 文件（govinfo.gov）。</li>
      <li>诉讼台账：Nathan v. Trump 与三家庭全国集体诉讼（2026-09-28，D.D.C.，ACLU 公告在案）；RAICES v. Mullin（媒体检索口径）；CASA 与 Barbara 案号见本馆第一节来源。</li>
      <li>287(g) 州级样本：WVXU 2026-05（佛/德全州强制）、堪萨斯 36 县＋10 市（2026-09）、印第安纳 45 份协议（2026-09-05）、马里兰 8 县与终止议案——公开报道口径；全国总数未获单一权威口径（如实注记）。</li>
      <li>劳动力双写：SHRM 2026-05-21（本土工人就业同受影响且无工资补偿）；科罗拉多 2026-09 调查（约 29% 企业受影响）；农业自动化与农场突袭报道（2026-03 起）——研究与行业口径归属见正文。</li>`);

// 馆后记更新
t = t.replace(
  "本馆收录 <strong>3 条政策线 + 1 条钱线 + 3 本执法数字 + 2 个设施/部署标本 + 1 节双写框架</strong>",
  "本馆收录 <strong>3 条政策线 + 1 条钱线 + 3 本执法数字 + 2 个设施/部署标本 + 遇越曲线/诉讼台账/287(g)/劳动力双写四节</strong>"
);
t = t.replace(/v4\.0\.0-dev-R85/g, "v4.0.0-dev-R86");
writeFileSync(F, t);
const body = t.replace(/<script[\s\S]*?<\/script>/g, "").replace(/<[^>]+>/g, " ");
console.log("CJK:", (body.match(/[\u4e00-\u9fff]/g) || []).length);
console.log("R86 stamps:", (t.match(/v4\.0\.0-dev-R86/g) || []).length);
