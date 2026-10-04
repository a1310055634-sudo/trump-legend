// R45 顺修: restore mangled site-version stamps (v2.0.0NN -> v2.0.0) on the 19 pages
// not touched this round. Guarded: exactly 2 replacements per page, else abort that page list.
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const pages = readdirSync(ROOT).filter(f => f.endsWith('.html') && f !== 'posts.html').sort();

const re = /v2\.0\.0\d{2}/g; // matches v2.0.033, v2.0.041 ... (the mangled stamps)
let failures = [];
for (const page of pages) {
  const p = join(ROOT, page);
  const html = readFileSync(p, 'utf8');
  const matches = html.match(re) || [];
  if (matches.length === 0) { console.log(`SKIP  ${page}: no mangled stamp`); continue; }
  if (matches.length !== 2) {
    failures.push(`${page}: expected 2 mangled stamps, found ${matches.length} (${matches.join(',')})`);
    continue;
  }
  writeFileSync(p, html.replace(re, 'v2.0.0'), 'utf8');
  console.log(`FIX   ${page}: ${matches.join(',')} -> v2.0.0 x2`);
}
if (failures.length) {
  console.error('ABORT — guard failures:\n' + failures.join('\n'));
  process.exit(1);
}
console.log('done: all mangled stamps restored to v2.0.0');
