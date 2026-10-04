// R45 harvester: fetch trumpstruth.org posts just before a given UTC timestamp
// cursor = base64({"status_created_at":"YYYY-MM-DD HH:MM:SS","_pointsToNextItems":true})
import { writeFileSync } from 'node:fs';

const UA = 'Mozilla/5.0 (compatible; ChuanLiuBuXi-editor/3.0; research archive reading)';

function makeCursor(beforeUtc) {
  const obj = { status_created_at: beforeUtc, _pointsToNextItems: true };
  return Buffer.from(JSON.stringify(obj), 'utf8').toString('base64');
}

async function fetchPage(beforeUtc, perPage) {
  const url = `https://www.trumpstruth.org/?sort=desc&per_page=${perPage}&cursor=${encodeURIComponent(makeCursor(beforeUtc))}`;
  const res = await fetch(url, { headers: { 'User-Agent': UA, Accept: 'text/html' }, signal: AbortSignal.timeout(45000) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.text();
}

function parseStatuses(html) {
  const out = [];
  const re = /<div class="status" data-status-url="([^"]+)">([\s\S]*?)<\/div>\s*<\/div>\s*(?=<div class="status"|<nav|<footer|$)/g;
  for (const m of html.matchAll(re)) {
    const archiveUrl = m[1];
    const block = m[2];
    const t = block.match(/<time datetime="([^"]+)"/);
    const orig = block.match(/href="(https:\/\/truthsocial\.com\/@realDonaldTrump\/\d+)"/);
    const body = block.match(/<div class="status__content"[^>]*>([\s\S]*?)<\/div>/);
    let text = '';
    if (body) {
      text = body[1]
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<\/p>/gi, '\n')
        .replace(/<[^>]+>/g, '')
        .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&nbsp;/g, ' ')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
    }
    out.push({ at: t ? t[1] : null, archive: archiveUrl, original: orig ? orig[1] : null, text });
  }
  return out;
}

const [beforeUtc, perPageArg, outFile] = process.argv.slice(2);
const perPage = Number(perPageArg) || 10;
let html;
try {
  html = await fetchPage(beforeUtc, perPage);
} catch (e) {
  if (perPage > 10) {
    console.error(`per_page=${perPage} failed (${e.message}), retrying per_page=10`);
    html = await fetchPage(beforeUtc, 10);
  } else throw e;
}
const posts = parseStatuses(html);
const times = posts.map(p => p.at).filter(Boolean);
console.error(`window before=${beforeUtc} per_page=${perPage}: got ${posts.length} posts, range ${times[times.length - 1] || '?'} .. ${times[0] || '?'}`);
if (outFile) writeFileSync(outFile, JSON.stringify(posts, null, 2), 'utf8');
else console.log(JSON.stringify(posts, null, 2));
