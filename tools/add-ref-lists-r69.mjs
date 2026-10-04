// R69: add .ref-list source attribution sections to first-hand archive pages.
// Each .ref-list is inserted before the TBC block with page-specific source entries.
import { readFileSync, writeFileSync } from 'node:fs';

const PAGES = {
  'posts.html': {
    sources: [
      'trumpstruth.org — Truth Social 存档（R45 管线直取，带原始时间戳）',
      'trumptwitterarchive.com — 推特存档（不可达，逐条 WebSearch 核验降级链）',
      'Politico / Sky News / LA Times — 2012-2013 名帖多源核验',
      'NYT / CBS / NPR — 2021-01-06 与 2021-01-08 帖多源核验',
      'NYT / Guardian / ABC — 巴特勒自述帖双源确认',
    ],
  },
  'speeches.html': {
    sources: [
      'whitehouse.gov — 2025 就职演说 transcript 逐句核对',
      'Miller Center — 2025 国会演说 / 2026 SOTU 转录直取',
      'Politico / CNN / Roll Call — 2017 就职演说三关键句核验',
      'American Presidency Project (UCSB) — 大会演说档案',
      'APP / Roll Call / Democracy in Action — 2024 RNC 接受提名演说',
    ],
  },
  'orders.html': {
    sources: [
      'Federal Register API — 行政令官方标题与编号（卷·11 取数）',
      'Federal Register raw text — EO 14160 / EO 14172 条文节选',
    ],
  },
  'documents.html': {
    sources: [
      'PBS / WaPo / FindLaw — Kaplan 卡罗尔案判词',
      'NYT / CNN / Election Law Blog — Merchan 量刑陈述逐字',
      'justice.gov — Smith 终局报告 Volume One 官方 PDF',
      '众议院运输委员会 — 老邮局租约管理审查报告',
      'CBS / NYT — Bornstein 健康信与 Barbabella 备忘录',
    ],
  },
  'books.html': {
    sources: [
      'Archive.org — 《交易的艺术》13 章目录全文本核对',
      'Google Books / 权威书评 — 两本著作要点转引',
      '纽约客 2016-07-25 — 施瓦茨代笔公案',
      '纽约时报 2020-09-27 — 学徒收入约 4.274 亿调查',
    ],
  },
  'court.html': {
    sources: [
      'PBS / NYT / CNN — Merchan 量刑陈述逐字（"unique and remarkable"）',
      'justice.gov — Smith 终局报告 Volume One 官方 PDF',
      'FindLaw / 华盛顿邮报 — Kaplan 卡罗尔案判词',
      'NPR / Courthouse News — Cannon 驳回令 Appointments Clause 主文',
      '路透社 — 封口费案 2026-08-28 联邦移厅再被驳回',
    ],
  },
  'diplomacy.html': {
    sources: [
      '维基/CNN/NPR — 安克雷奇峰会 2025-08-15',
      '维基/纽约时报/卫报 — 泽连斯基白宫八国峰会 2025-08-18',
      'CNN/军控协会/路透 — 战斧导弹 2025-10-31 拒售',
      'eunews 等多源 — 海牙峰会 5% 目标 2025-06-24/25',
      'NPR — 朝鲜遗骸归还 55 具 2018-07-27',
    ],
  },
  'promises.html': {
    sources: [
      'CBP — 边境屏障里程数（标准记载）',
      'whitehouse.gov / 联邦新闻网络 — 返岗备忘录 2025-01-20',
      '白宫文告 / 路透社 — EO 14342 无保释金 2025-08-25',
      '华盛顿邮报 / 时代杂志 — D.C. 警察联邦接管 2025-08-11',
      '卷·04-07/卷·24 — 减税/大法官/退群/关税/和平方案判定底座',
    ],
  },
};

const tbcAnchor = '<!-- ================= 未完待续 ================= -->';

let ok = 0, skip = 0;
for (const [file, { sources }] of Object.entries(PAGES)) {
  let html;
  try { html = readFileSync(file, 'utf8'); } catch { console.log(`SKIP ${file}: not found`); continue; }
  if (html.includes('ref-list')) { console.log(`SKIP ${file}: already has ref-list`); skip++; continue; }
  if (!html.includes(tbcAnchor)) { console.log(`SKIP ${file}: no TBC anchor`); skip++; continue; }

  const items = sources.map((s, i) => `      <li>${s}</li>`).join('\n');
  const block = `\n  <section class="ref-list panel-reveal">\n    <span class="caption">本卷引用来源</span>\n    <ol>\n${items}\n    </ol>\n  </section>\n\n`;

  html = html.replace(tbcAnchor, block + tbcAnchor);
  writeFileSync(file, html, 'utf8');
  console.log(`OK ${file}: ${sources.length} sources`);
  ok++;
}
console.log(`\ndone: ${ok} pages updated, ${skip} skipped`);
