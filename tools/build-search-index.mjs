// R68: build-search-index.mjs — scan all HTML pages, generate assets/search-index.js
// Zero-dependency: outputs a plain JS file setting window.TRUMP_SEARCH_INDEX.
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const pages = readdirSync(ROOT).filter(f => f.endsWith('.html') && !f.startsWith('_')).sort();

function stripTags(html) {
  return html.replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ').trim();
}

function extractText(html, selector) {
  const re = new RegExp('<' + selector + '[^>]*>([\\s\\S]*?)</' + selector + '>', 'i');
  const m = html.match(re);
  return m ? stripTags(m[1]).slice(0, 300) : '';
}

const index = [];
for (const page of pages) {
  const html = readFileSync(join(ROOT, page), 'utf8');
  const titleM = html.match(/<title>(.*?)<\/title>/);
  const title = titleM ? titleM[1].replace(/\s*—\s*川流不息.*$/, '').trim() : page;
  const h1M = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
  const h1 = h1M ? stripTags(h1M[1]) : '';
  // Full body text for content search
  const bodyM = html.match(/<main[^>]*>([\s\S]*?)<\/main>/);
  const body = bodyM ? stripTags(bodyM[1]).slice(0, 8000) : '';
  index.push({ file: page.replace(/\.html$/, ''), title, h1, body });
}

const out = `/* 川流不息 · 全站检索索引（R68 自动生成，请勿手工编辑） */\nwindow.TRUMP_SEARCH_INDEX=${JSON.stringify(index)};\n`;
writeFileSync(join(ROOT, 'assets', 'search-index.js'), out, 'utf8');
console.log(`search-index.js: ${index.length} pages, ${(out.length / 1024).toFixed(0)}KB`);
