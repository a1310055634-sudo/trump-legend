// R66 gallery photo harvester: find PD/CC photos of Trump by decade via Commons categories.
// Output: downloads to assets/photos/gallery-<year>-<n>.jpg + gallery-manifest.json (CREDITS rows).
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { execSync } from 'node:child_process';

const UA = 'Mozilla/5.0 (compatible; ChuanLiuBuXi-editor/3.0; research archive reading)';
const OUT_DIR = 'assets/photos';

const DECADES = [
  { tag: '1990s', cats: ['Category:Donald Trump in the 1990s', 'Category:Donald Trump in 1990s', 'Category:Donald Trump, 1990s'], years: '1990s', search: 'intitle:"Trump" 1990' },
  { tag: '2000s', cats: ['Category:Donald Trump in the 2000s', 'Category:Donald Trump in 2000s'], years: '2000s', search: 'intitle:"Donald Trump" 2005 OR 2006 OR 2007' },
  { tag: '2010s', cats: ['Category:Donald Trump in 2015', 'Category:Donald Trump in 2016'], years: '2010s' },
  { tag: '2020s', cats: ['Category:Donald Trump in 2025'], years: '2020s' },
];

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function api(params) {
  for (let attempt = 1; attempt <= 4; attempt++) {
    try {
      const url = 'https://commons.wikimedia.org/w/api.php?' + new URLSearchParams({ format: 'json', ...params });
      const r = await fetch(url, { headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(30000) });
      const text = await r.text();
      if (text.includes('too many requests')) { console.log(`  rate-limited, wait ${attempt * 3}s...`); await sleep(attempt * 3000); continue; }
      return JSON.parse(text);
    } catch (e) {
      console.log(`  api retry ${attempt}: ${e.message}`);
      await sleep(attempt * 2500);
    }
  }
  return {};
}

const OK_LIC = /public domain|cc0|cc by(?!-nc)|cc by-sa/i;
const BAD = /gfdl|fair use|non-free/i;

async function apiRetry(params) {
  for (let attempt = 1; attempt <= 4; attempt++) {
    try {
      const url = 'https://commons.wikimedia.org/w/api.php?' + new URLSearchParams({ format: 'json', ...params });
      const r = await fetch(url, { headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(30000) });
      const text = await r.text();
      if (text.includes('too many requests')) { console.log(`  rate-limited, wait ${attempt * 3}s...`); await sleep(attempt * 3000); continue; }
      return JSON.parse(text);
    } catch (e) {
      console.log(`  api retry ${attempt}: ${e.message}`);
      await sleep(attempt * 2500);
    }
  }
  return {};
}

async function catFiles(cat) {
  const j = await apiRetry({ action: 'query', list: 'categorymembers', cmtitle: cat, cmtype: 'file', cmlimit: '50' });
  return (j.query?.categorymembers || []).map(m => m.title);
}

async function searchFiles(q) {
  const j = await apiRetry({ action: 'query', list: 'search', srsearch: q, srnamespace: '6', srlimit: '30' });
  return (j.query?.search || []).map(m => m.title);
}

async function meta(title) {
  const j = await api({
    action: 'query', prop: 'imageinfo', iiprop: 'extmetadata|url|size', titles: title,
    iiurlwidth: '900',
  });
  const pages = Object.values(j.query?.pages || {});
  const ii = pages[0]?.imageinfo?.[0];
  if (!ii) return null;
  const em = ii.extmetadata || {};
  const lic = em.LicenseShortName?.value || '';
  return {
    title, lic,
    artist: String(em.Artist?.value || '').replace(/<[^>]+>/g, '').trim().slice(0, 80),
    width: ii.width, height: ii.height,
    thumburl: ii.thumburl, url: ii.url,
    date: String(em.DateTimeOriginal?.value || '').slice(0, 10),
  };
}

function slug(t) {
  return t.replace(/^File:/, '').replace(/\.[a-z]+$/i, '').replace(/[^\w\-]+/g, '-').slice(0, 48);
}

const manifestPath = 'tools/gallery-manifest.json';
const manifest = existsSync(manifestPath) ? JSON.parse(readFileSync(manifestPath, 'utf8')) : [];
const doneFiles = new Set(manifest.map(m => m.file));

for (const dec of DECADES) {
  const tag = dec.tag.replace(/[^0-9a-z]/gi, '');
  if (manifest.some(m => m.file.startsWith(`gallery-${tag}-`) && m.decade === dec.tag)) {
    const have = manifest.filter(m => m.file.startsWith(`gallery-${tag}-`)).length;
    if (have >= 4) { console.log(`\n== ${dec.tag}: already have ${have}, skip`); continue; }
  }
  const seen = new Set();
  let candidates = [];
  for (const cat of dec.cats) {
    const files = await catFiles(cat);
    await sleep(1200);
    for (const f of files) if (!seen.has(f)) { seen.add(f); candidates.push(f); }
  }
  if (candidates.length < 10 && dec.search) {
    await sleep(1200);
    const sf = await searchFiles(dec.search);
    for (const f of sf) if (!seen.has(f)) { seen.add(f); candidates.push(f); }
  }
  console.log(`\n== ${dec.tag}: ${candidates.length} candidates`);
  let picked = manifest.filter(m => m.decade === dec.tag).length;
  for (const f of candidates) {
    if (picked >= 6) break;
    if (/logo|icon|map|diagram|signature|meme|cartoon|protest|sign|impersonat/i.test(f)) continue;
    const slugName = slug(f);
    const fname = `gallery-${tag}-${slugName}.jpg`;
    if (doneFiles.has(fname) || existsSync(`${OUT_DIR}/${fname}`)) { continue; }
    await sleep(1200);
    const m = await meta(f);
    if (!m) continue;
    if (!OK_LIC.test(m.lic) || BAD.test(m.lic)) continue;
    if (m.width < 500) continue;
    picked++;
    const url = m.thumburl || m.url;
    try {
      execSync(`curl -sL -A "${UA}" "${url}" -o "${OUT_DIR}/${fname}"`, { timeout: 60000 });
      const buf = readFileSync(`${OUT_DIR}/${fname}`);
      if (buf[0] !== 0xff || buf[1] !== 0xd8) { console.log(`  SKIP(badmagic) ${f}`); picked--; continue; }
      const kb = Math.round(buf.length / 1024);
      manifest.push({
        file: fname, source: `https://commons.wikimedia.org/wiki/${f.replace(/ /g, '_')}`,
        artist: m.artist, license: m.lic, kb,
        decade: dec.tag, origTitle: f.replace(/^File:/, ''),
      });
      console.log(`  OK ${fname} (${kb}KB) ${m.lic}`);
    } catch (e) { console.log(`  ERR ${f}: ${e.message}`); picked--; }
  }
  if (picked === 0) console.log('  (none picked)');
  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
}

mkdirSync('tools', { recursive: true });
console.log(`\nTOTAL: ${manifest.length} photos. Manifest at tools/gallery-manifest.json`);
