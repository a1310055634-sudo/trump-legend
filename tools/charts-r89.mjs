// R89 data.html 扩容 8→12 幅：新增四幅 SVG（数据全部复用已核口径，单点维护互链）
import { readFileSync, writeFileSync } from "node:fs";
const F = new URL("../data.html", import.meta.url);
let t = readFileSync(F, "utf8");

// 口径行更新（"四组图表"为 V1 残留话术，现为十二幅）
t = t.replace(
  "<p>本页四组图表全部为<strong>手写 SVG</strong>（零外部图表库，符合全站无依赖红线）。",
  "<p>本页十二幅图表全部为<strong>手写 SVG</strong>（零外部图表库，符合全站无依赖红线；第九至十二幅为 V4 扩容，数据与卷·28/卷·32 单点维护互链不重算；关税有效税率序列因无权威公开估算源，按\"禁自算\"条款弃图——见账本 R89 注记）。"
);

const HEAD = "  <!-- ================= 馆后记 ================= -->";
if (!t.includes(HEAD)) { console.log("锚点未命中"); process.exit(1); }

const newCharts = `
  <!-- ================= 第九幅 · 特赦三届对比（复用卷·28 R78 口径） ================= -->
  <section class="page-head" style="margin:var(--sp-8) 0 var(--sp-5)">
    <span class="volume">第九幅 · 个人特赦 · 三届对比</span>
  </section>

  <figure class="chart-figure panel-reveal">
    <svg viewBox="0 0 640 300" role="img" aria-label="三届总统个人特赦数量对比条形：第一任期四年一百四十四项，拜登任期四年八十项，第二任期仅首年已达一百六十六项——超过第一任期全期，接近拜登任期两倍" xmlns="http://www.w3.org/2000/svg">
      <text x="320" y="30" text-anchor="middle" style="fill:var(--gold);font:bold 15px var(--font-display)">个人特赦数量 · 三届对比（项）</text>
      <text x="170" y="89" text-anchor="end" style="fill:var(--ink);font:12px var(--font-body)">第一任期（2017–2021）</text>
      <rect x="180" y="70" width="312" height="30" style="fill:var(--gold)"/>
      <text x="500" y="89" style="fill:var(--gold);font:bold 12px var(--font-body)">144</text>
      <text x="170" y="135" text-anchor="end" style="fill:var(--ink);font:12px var(--font-body)">拜登任期（2021–2025）</text>
      <rect x="180" y="116" width="173" height="30" style="fill:var(--flag-blue)"/>
      <text x="361" y="135" style="fill:var(--gold-bright);font:bold 12px var(--font-body)">80</text>
      <text x="170" y="181" text-anchor="end" style="fill:var(--ink);font:12px var(--font-body)">第二任期首年（口径）</text>
      <rect x="180" y="162" width="360" height="30" style="fill:var(--gold-bright)"/>
      <text x="548" y="181" style="fill:var(--gold-bright);font:bold 12px var(--font-body)">166</text>
      <line x1="180" y1="222" x2="560" y2="222" style="stroke:var(--gold-deep);stroke-width:1"/>
      <text x="180" y="244" style="fill:var(--ink-dim);font:11px var(--font-body)">注：1·6 群赦约 1,500 人未计入（单列口径）；减刑另计（第一任期 94 项；拜登 2025-01 单月约 2,500 项）。</text>
      <text x="180" y="264" style="fill:var(--ink-faint);font:11px var(--font-body)">数据源：司法部 OPA/费城问询报 2026-09-25——口径与争议双写详见卷·28 第六节（单点维护）。</text>
    </svg>
    <figcaption class="chart-caption">数据表：144（第一任期全期，DOJ/Forbes）· 80（拜登任期，OPA 清单含预防性家属赦免）· 166（第二任期首年至 2026-09，不含群赦）。与卷·28《特赦与减刑》同源互链。</figcaption>
  </figure>

  <!-- ================= 第十幅 · ICE 拘押（复用卷·32 R85 口径） ================= -->
  <section class="page-head" style="margin:var(--sp-8) 0 var(--sp-5)">
    <span class="volume">第十幅 · ICE 拘押规模 · 已核两节点</span>
  </section>

  <figure class="chart-figure panel-reveal">
    <svg viewBox="0 0 640 300" role="img" aria-label="ICE 日均拘押两节点折线：2025 年六七月约六万人创当时纪录，2025 年11月约六万五千人——连续攀升；2025 年羁押死亡三十人为有记录以来最高年数字" xmlns="http://www.w3.org/2000/svg">
      <text x="320" y="30" text-anchor="middle" style="fill:var(--gold);font:bold 15px var(--font-display)">ICE 日均拘押 · 已核节点（人）</text>
      <line x1="120" y1="262" x2="520" y2="262" style="stroke:var(--gold-deep);stroke-width:1"/>
      <polyline points="120,87 520,74" fill="none" style="stroke:var(--gold);stroke-width:3"/>
      <circle cx="120" cy="87" r="5" style="fill:var(--gold-bright)"/>
      <text x="120" y="70" text-anchor="middle" style="fill:var(--gold-bright);font:bold 12px var(--font-body)">约 60,000</text>
      <text x="120" y="284" text-anchor="middle" style="fill:var(--ink-dim);font:11px var(--font-body)">2025-06/07（纪录）</text>
      <circle cx="520" cy="74" r="5" style="fill:var(--gold-bright)"/>
      <text x="520" y="56" text-anchor="middle" style="fill:var(--gold-bright);font:bold 12px var(--font-body)">约 65,000</text>
      <text x="520" y="284" text-anchor="middle" style="fill:var(--ink-dim);font:11px var(--font-body)">2025-11</text>
      <text x="120" y="246" style="fill:var(--ink-faint);font:11px var(--font-body)">注：仅两个已核节点（TRAC/ICE 公开口径），其余月度未获权威序列——如实注记，不补点。</text>
    </svg>
    <figcaption class="chart-caption">数据源：ICE 数字与 TRAC（密歇根大学）追踪，转引自法媒 2025-07 与 KATU 2025-11 报道；2025 年羁押死亡 30 人为有记录以来最高年数字（2026-02 报道口径）。政策与设施全档见卷·32《边境与驱逐》第三节（单点维护）。</figcaption>
  </figure>

  <!-- ================= 第十一幅 · 遇越人数（复用卷·32 R86 口径） ================= -->
  <section class="page-head" style="margin:var(--sp-8) 0 var(--sp-5)">
    <span class="volume">第十一幅 · 西南边境遇越 · 三节点</span>
  </section>

  <figure class="chart-figure panel-reveal">
    <svg viewBox="0 0 640 300" role="img" aria-label="西南边境遇越人数三节点折线：2023年12月峰值约三十万一千人次，2025年4月跌至约六千一百（拘捕口径），2026年8月约一万二千二百——从峰值回撤逾九成五" xmlns="http://www.w3.org/2000/svg">
      <text x="320" y="30" text-anchor="middle" style="fill:var(--gold);font:bold 15px var(--font-display)">西南边境遇越 · 三节点（人次/月）</text>
      <line x1="100" y1="262" x2="560" y2="262" style="stroke:var(--gold-deep);stroke-width:1"/>
      <polyline points="100,71 330,246 560,243" fill="none" style="stroke:var(--gold);stroke-width:3"/>
      <circle cx="100" cy="71" r="5" style="fill:var(--gold-bright)"/>
      <text x="106" y="64" style="fill:var(--gold-bright);font:bold 12px var(--font-body)">约 301,000（峰值）</text>
      <circle cx="330" cy="246" r="5" style="fill:var(--gold-bright)"/>
      <text x="252" y="284" style="fill:var(--ink-dim);font:11px var(--font-body)">2025-04 约 6,100（拘捕口径）</text>
      <circle cx="560" cy="243" r="5" style="fill:var(--gold-bright)"/>
      <text x="436" y="230" style="fill:var(--gold-bright);font:bold 12px var(--font-body)">约 12,242</text>
      <text x="80" y="60" text-anchor="end" style="fill:var(--ink-dim);font:11px var(--font-body)">2023-12</text>
      <text x="330" y="284" text-anchor="middle" style="fill:var(--ink-dim);font:11px var(--font-body)">2025-04</text>
      <text x="560" y="284" text-anchor="middle" style="fill:var(--ink-dim);font:11px var(--font-body)">2026-08</text>
      <text x="100" y="246" style="fill:var(--ink-faint);font:11px var(--font-body)">口径逐点注明；数据源 CBP 公开月度数据。</text>
    </svg>
    <figcaption class="chart-caption">数据源：CBP 公开月度统计（The Hill 2023-12；Center Square/Dallas Express 2026）；FY2026 首季全国口径 91,603 为史上最低首季（较峰值约 −92%）。两口径之辨与完整叙事见卷·32《边境与驱逐》第六节（单点维护）。</figcaption>
  </figure>

  <!-- ================= 第十二幅 · 中期历史规律（复用卷·20 R88 口径） ================= -->
  <section class="page-head" style="margin:var(--sp-8) 0 var(--sp-5)">
    <span class="volume">第十二幅 · 中期选举 · 总统党的历史账</span>
  </section>

  <figure class="chart-figure panel-reveal">
    <svg viewBox="0 0 640 300" role="img" aria-label="中期选举总统党众院席位变动条形：1934 年以来历次平均丢约二十六席，1986 年里根任期仅丢五席为最佳特例之一，2002 年小布什任期反而增席为特例——平均值从不担保谁" xmlns="http://www.w3.org/2000/svg">
      <text x="320" y="30" text-anchor="middle" style="fill:var(--gold);font:bold 15px var(--font-display)">中期选举总统党众院席位变动（席）</text>
      <line x1="120" y1="150" x2="540" y2="150" style="stroke:var(--gold-deep);stroke-width:1"/>
      <rect x="180" y="150" width="70" height="104" style="fill:var(--flag-red)"/>
      <text x="215" y="272" text-anchor="middle" style="fill:var(--gold-bright);font:bold 12px var(--font-body)">−26</text>
      <text x="215" y="140" text-anchor="middle" style="fill:var(--ink);font:12px var(--font-body)">1934 年以来平均</text>
      <rect x="380" y="150" width="18" height="20" style="fill:var(--flag-red)"/>
      <text x="389" y="188" text-anchor="middle" style="fill:var(--gold-bright);font:bold 12px var(--font-body)">−5</text>
      <text x="389" y="140" text-anchor="middle" style="fill:var(--ink);font:12px var(--font-body)">1986 里根</text>
      <text x="120" y="170" text-anchor="end" style="fill:var(--ink-dim);font:11px var(--font-body)">丢席 ↓</text>
      <text x="120" y="146" text-anchor="end" style="fill:var(--ink-dim);font:11px var(--font-body)">增席 ↑</text>
      <text x="120" y="246" style="fill:var(--ink-faint);font:11px var(--font-body)">注：2002 年小布什任期为增席特例（数值未获单一权威口径，不入条形仅注记）。</text>
      <text x="120" y="266" style="fill:var(--ink-faint);font:11px var(--font-body)">数据源：标准记载口径（卷·20 R55/R88 复核一致）。</text>
    </svg>
    <figcaption class="chart-caption">2026 前哨的完整形状（参院 35 席改选/53:47 现况/提前票进度）见卷·20《选举解剖》第七节（单点维护，2026-10-06 基准）。</figcaption>
  </figure>

`;
t = t.replace(HEAD, newCharts + HEAD);
writeFileSync(F, t);
const body = t.replace(/<script[\s\S]*?<\/script>/g, "").replace(/<[^>]+>/g, " ");
console.log("CJK:", (body.match(/[\u4e00-\u9fff]/g) || []).length);
console.log("chart-figures:", (t.match(/class="chart-figure/g) || []).length);
