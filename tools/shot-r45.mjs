// R45 screenshot: posts.html full page @1280 into tools/shots/R45/
import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const PORT = 9333;
const OUT = join(ROOT, 'tools', 'shots', 'R45');
mkdirSync(OUT, { recursive: true });

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const chrome = spawn(CHROME, [
  '--headless=new', `--remote-debugging-port=${PORT}`,
  `--user-data-dir=${join(ROOT, 'tools', '.chrome-r45')}`,
  '--no-first-run', '--disable-gpu', 'about:blank',
], { stdio: 'ignore' });

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// wait for CDP
let version = null;
for (let i = 0; i < 30; i++) {
  try {
    const res = await fetch(`http://127.0.0.1:${PORT}/json/version`);
    version = await res.json();
    break;
  } catch { await sleep(500); }
}
if (!version) { console.error('CDP not reachable'); chrome.kill(); process.exit(1); }

const res = await fetch(`http://127.0.0.1:${PORT}/json/new?file:///${'D:/vibe coding/trump-legend/posts.html'.replace(/\\/g, '/')}`, { method: 'PUT' });
const target = await res.json();
await sleep(2500);

const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise(r => { ws.onopen = r; });
function send(id, method, params = {}) {
  return new Promise(resolve => {
    function onmsg(ev) {
      const m = JSON.parse(ev.data);
      if (m.id === id) { ws.removeEventListener('message', onmsg); resolve(m.result); }
    }
    ws.addEventListener('message', onmsg);
    ws.send(JSON.stringify({ id, method, params }));
  });
}

await send(1, 'Runtime.evaluate', { expression: `document.querySelectorAll('.panel-reveal').forEach(e=>e.classList.add('is-in'))` });
await send(2, 'Emulation.setDeviceMetricsOverride', { width: 1280, height: 900, deviceScaleFactor: 1, mobile: false });
await sleep(1800);
const shot = await send(3, 'Page.captureScreenshot', { format: 'png', captureBeyondViewport: true });
writeFileSync(join(OUT, 'posts-1280.png'), Buffer.from(shot.data, 'base64'));
console.log('saved', join(OUT, 'posts-1280.png'));
ws.close();
chrome.kill();
