// R60 unlock script (atomic): validate ALL pages, then write once.
// (1) insert allies nav item on every page lacking it, (2) stamp all v3.0.0-dev-R60, (3) footer date.
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const NAV_NEW = '        <li><a href="allies.html">23 盟友群像</a></li>\n';
const pages = readdirSync(ROOT).filter(f => f.endsWith('.html')).sort();

const jobs = [];
let failures = [];
for (const page of pages) {
  const p = join(ROOT, page);
  const html = readFileSync(p, 'utf8');
  let out = html;
  const log = [];

  if (!html.includes('href="allies.html"')) {
    const a1 = '        <li><a href="lexicon.html">22 语汇词典</a></li>\n';
    const a2 = '        <li><a href="lexicon.html" aria-current="page">22 语汇词典</a></li>\n';
    if (html.includes(a1)) out = out.replace(a1, a1 + NAV_NEW);
    else if (html.includes(a2)) out = out.replace(a2, a2 + NAV_NEW);
    else { failures.push(`${page}: no nav anchor`); continue; }
    log.push('nav+1');
  }

  const stampRe = /v3\.0\.0-dev-R5[0-9]|v3\.0\.0-dev-R6[0-9]|v3\.0\.0-rc|v2\.0\.0/g;
  const stamps = out.match(stampRe) || [];
  if (stamps.length !== 2) { failures.push(`${page}: expected 2 stamps, got ${stamps.length} (${stamps.join(',')})`); continue; }
  out = out.replace(stampRe, 'v3.0.0-dev-R60');
  log.push('stamp x2');

  const dRe = /· 版本 <span id="site-version">[^<]*<\/span> · \d{4}-\d{2}-\d{2}</;
  if (!dRe.test(out)) { failures.push(`${page}: footer line missing`); continue; }
  out = out.replace(dRe, '· 版本 <span id="site-version">v3.0.0-dev-R60</span> · 2026-10-05<');
  log.push('date');

  jobs.push([p, out, log]);
}
if (failures.length) { console.error('ABORT (nothing written):\n' + failures.join('\n')); process.exit(1); }
for (const [p, out, log] of jobs) { writeFileSync(p, out, 'utf8'); console.log(`OK  ${p}: ${log.join(', ')}`); }
console.log(`done: ${jobs.length} pages unlocked & stamped v3.0.0-dev-R60`);
