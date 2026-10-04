// R52 unlock script: (1) insert court nav item on every page lacking it, (2) stamp all
// pages v3.0.0-dev-R52 (meta+footer), (3) footer date -> 2026-10-05. Guarded per page.
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const NAV_NEW = '        <li><a href="court.html">19 法庭全记</a></li>\n';
const NAV_ANCHOR = '        <li><a href="data.html">18 数字卷</a></li>\n';
const pages = readdirSync(ROOT).filter(f => f.endsWith('.html')).sort();

let failures = [];
for (const page of pages) {
  const p = join(ROOT, page);
  let html = readFileSync(p, 'utf8');
  let log = [];

  // (1) nav insert — skip pages that already link court.html (court.html itself)
  if (!html.includes('href="court.html"')) {
    if (!html.includes(NAV_ANCHOR)) { failures.push(`${page}: nav anchor missing`); continue; }
    if ((html.match(/href="court\.html"/g) || []).length !== 0) { failures.push(`${page}: unexpected court link`); continue; }
    html = html.replace(NAV_ANCHOR, NAV_ANCHOR + NAV_NEW);
    log.push('nav+1');
  }

  // (2) stamp: any existing version value -> v3.0.0-dev-R52, exactly 2 per page
  const stampRe = /v2\.0\.0(?:\d{2})?|v3\.0\.0-dev-R\d+|v3\.0\.0-rc/g;
  const stamps = html.match(stampRe) || [];
  if (stamps.length !== 2) { failures.push(`${page}: expected 2 stamps, found ${stamps.length} (${stamps.join(',')})`); continue; }
  html = html.replace(stampRe, 'v3.0.0-dev-R52');
  log.push('stamp x2');

  // (3) footer date -> 2026-10-05
  const dateRe = /· 版本 <span id="site-version">[^<]*<\/span> · \d{4}-\d{2}-\d{2}</;
  if (!dateRe.test(html)) { failures.push(`${page}: footer meta line not found`); continue; }
  html = html.replace(dateRe, '· 版本 <span id="site-version">v3.0.0-dev-R52</span> · 2026-10-05<');
  log.push('date');

  writeFileSync(p, html, 'utf8');
  console.log(`OK  ${page}: ${log.join(', ')}`);
}
if (failures.length) { console.error('ABORT:\n' + failures.join('\n')); process.exit(1); }
console.log('done: nav unlocked + stamped v3.0.0-dev-R52 on all pages');
