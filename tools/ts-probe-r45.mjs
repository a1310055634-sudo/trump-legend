// R45 probe: inspect trumpstruth.org pagination structure (cursor format, posts per page)
import { writeFileSync } from 'node:fs';

const UA = 'Mozilla/5.0 (compatible; ChuanLiuBuXi-editor/3.0; research archive reading)';

async function fetchPage(url) {
  const res = await fetch(url, {
    headers: { 'User-Agent': UA, 'Accept': 'text/html' },
    signal: AbortSignal.timeout(30000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.text();
}

const html = await fetchPage('https://trumpstruth.org/');
writeFileSync('tools/ts-page1-raw.html', html, 'utf8');

// Extract pagination links (any href containing page/cursor/max_id/before params)
const hrefs = [...html.matchAll(/href="([^"]*)"/g)].map(m => m[1]);
const pagination = hrefs.filter(h => /(page|cursor|max_id|before|after|per_page|=)/i.test(h) && !/^#/.test(h) && !/\.(css|js|ico|png|jpg|svg)/i.test(h));
console.log('=== pagination-ish links (dedup, first 30) ===');
console.log([...new Set(pagination)].slice(0, 30).join('\n'));

// Extract post timestamps: look for <time> tags or datetime attributes
const times = [...html.matchAll(/<time[^>]*datetime="([^"]+)"/g)].map(m => m[1]);
console.log('\n=== <time datetime> count:', times.length);
console.log('first:', times[0], ' last:', times[times.length - 1]);

// Look for any date-like text patterns
const dateTexts = [...html.matchAll(/(\d{4}-\d{2}-\d{2})[T ](\d{2}:\d{2})/g)].map(m => m[0]);
console.log('\n=== raw date-like strings count:', dateTexts.length);
console.log([...new Set(dateTexts)].slice(0, 8).join('\n'));

// Post count heuristic: count links to truthsocial.com posts
const tsLinks = [...html.matchAll(/href="(https?:\/\/truthsocial\.com\/@[^"]+\/posts\/[^"]+)"/g)].map(m => m[1]);
console.log('\n=== truthsocial post links:', new Set(tsLinks).size);

// Any nav/archive/search forms?
const forms = [...html.matchAll(/<form[^>]*>[\s\S]*?<\/form>/g)].map(m => m[0].slice(0, 300));
console.log('\n=== forms:', forms.length, forms.slice(0, 3));
const monthLinks = hrefs.filter(h => /\/(20\d\d)[/-](\d\d?)/.test(h));
console.log('=== month-archive-like links:', [...new Set(monthLinks)].slice(0, 10));
