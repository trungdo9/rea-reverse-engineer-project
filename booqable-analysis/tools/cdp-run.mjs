// usage: node cdp-run.mjs PORT TARGET OUTDIR NAME STEPS.json
// steps: {nav:url} {click:"text"|{css}} {fill:{css|label, value}} {key:"Enter"} {wait:ms} {shot:name} {eval:js} {text:true}
import { appendFileSync, writeFileSync, readFileSync, mkdirSync } from 'node:fs';
const [port, target, outDir, name, stepsFile] = process.argv.slice(2);
const steps = JSON.parse(readFileSync(stepsFile, 'utf8'));
mkdirSync(outDir, { recursive: true });
const netFile = `${outDir}/${name}.net.jsonl`; writeFileSync(netFile, '');
const ws = new WebSocket(`ws://127.0.0.1:${port}/devtools/page/${target}`);
let id = 0; const pending = new Map(); const reqs = new Map(); let cur = '';
const send = (method, params = {}) => new Promise(r => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
const sleep = ms => new Promise(r => setTimeout(r, ms));
const ev = async (expr) => { const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true }); return r.result?.exceptionDetails ? 'ERR ' + r.result.exceptionDetails.exception?.description : r.result?.result?.value; };
const noise = /google|segment|intercom|bing|facebook|doubleclick|cloudflare|sentry|birdie|typekit|cdn-cgi|locales\/|whats_new|push_authentications|counts\/current|billing_plans|setup_chat/;
ws.onmessage = async e => {
  const m = JSON.parse(e.data);
  if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); return; }
  const p = m.params;
  if (m.method === 'Page.javascriptDialogOpening') { console.log('[JS DIALOG]', p.type, JSON.stringify(p.message)); send('Page.handleJavaScriptDialog', { accept: false }); return; }
  if (m.method === 'Network.requestWillBeSent' && ['XHR', 'Fetch', 'Document'].includes(p.type) && !noise.test(p.request.url))
    reqs.set(p.requestId, { step: cur, method: p.request.method, url: p.request.url.replace(/^https:\/\/ghiencafe\.booqable(shop)?\.com/, (x) => x.includes('shop') ? 'SHOP' : 'BO'), body: p.request.postData?.slice(0, 3000) });
  else if (m.method === 'Network.responseReceived' && reqs.has(p.requestId)) Object.assign(reqs.get(p.requestId), { status: p.response.status, mime: p.response.mimeType });
  else if ((m.method === 'Network.loadingFinished' || m.method === 'Network.loadingFailed') && reqs.has(p.requestId)) {
    const rec = reqs.get(p.requestId); reqs.delete(p.requestId);
    if (rec.method !== 'GET' && (rec.mime || '').includes('json')) { const b = (await send('Network.getResponseBody', { requestId: p.requestId })).result; if (b) rec.resp = (b.base64Encoded ? Buffer.from(b.body, 'base64').toString() : b.body).slice(0, 4000); }
    appendFileSync(netFile, JSON.stringify(rec) + '\n');
  }
};
const helpers = String.raw`
window.__all = (sel, root = document) => { const out = [...root.querySelectorAll(sel)]; for (const h of root.querySelectorAll('*')) if (h.shadowRoot) out.push(...__all(sel, h.shadowRoot)); return out; };
window.__text = (root = document.body) => { let s = ''; const walk = n => { if (n.nodeType === 3) s += n.textContent; if (n.shadowRoot) walk(n.shadowRoot); for (const c of n.childNodes || []) walk(c); if (n.nodeType === 1 && /^(DIV|P|LI|BUTTON|H\d|TR|LABEL|A)$/.test(n.tagName)) s += '\n'; }; walk(root); return s.replace(/[ \t]+/g,' ').replace(/\n\s*\n+/g,'\n'); };
window.__q = (t) => { const norm = s => (s||'').replace(/\s+/g,' ').trim().toLowerCase(); t = norm(t);
  const els = __all('button,a,[role=button],[role=menuitem],[role=option],[role=tab],label,li,span,div,td,h1,h2,h3,p').filter(e => e.offsetParent !== null || e.getClientRects().length);
  return els.find(e => norm(e.innerText) === t && ['BUTTON','A'].includes(e.tagName)) || els.find(e => norm(e.innerText) === t) || els.find(e => norm(e.getAttribute('aria-label')) === t) || els.find(e => norm(e.innerText).startsWith(t) && e.children.length < 4); };
window.__field = (l) => { if (l.css) return document.querySelector(l.css); const norm = s => (s||'').replace(/\s+/g,' ').trim().toLowerCase(); const t = norm(l.label);
  const lab = [...document.querySelectorAll('label')].find(x => norm(x.innerText).replace(/\*$/,'').trim() === t || norm(x.innerText).startsWith(t));
  if (lab) { if (lab.htmlFor && document.getElementById(lab.htmlFor)) return document.getElementById(lab.htmlFor); const i = lab.querySelector('input,textarea,select') || lab.parentElement.querySelector('input,textarea,select'); if (i) return i; }
  return document.querySelector('[placeholder="'+l.label+'"],[aria-label="'+l.label+'"],[name="'+l.label+'"]'); };`;
async function clickEl(expr) {
  const box = await ev(`(() => { ${helpers}; const e = ${expr}; if (!e) return null; { const r0 = e.getBoundingClientRect(); if (r0.top < 0 || r0.bottom > innerHeight) e.scrollIntoView({block:'center'}); } const r = e.getBoundingClientRect(); return {x:r.x+r.width/2, y:r.y+r.height/2, tag:e.tagName, txt:(e.innerText||'').slice(0,40)}; })()`);
  if (!box) return 'NOT FOUND';
  for (const type of ['mouseMoved', 'mousePressed', 'mouseReleased']) await send('Input.dispatchMouseEvent', { type, x: box.x, y: box.y, button: 'left', clickCount: 1 });
  return box.tag + ':' + box.txt;
}
ws.onopen = async () => {
  await send('Network.enable', { maxResourceBufferSize: 20e6, maxTotalBufferSize: 100e6 }); await send('Page.enable');

  let n = 0;
  for (const s of steps) {
    cur = `${++n}:${JSON.stringify(s).slice(0, 70)}`; let out = '';
    if (s.nav) { await send('Page.navigate', { url: s.nav }); await sleep(s.ms ?? 6000); }
    else if (s.click) { out = await clickEl(typeof s.click === 'string' ? `__q(${JSON.stringify(s.click)})` : s.click.js ? `(${s.click.js})` : `document.querySelector(${JSON.stringify(s.click.css)})`); await sleep(s.ms ?? 2500); }
    else if (s.fill) {
      out = await ev(`(() => { ${helpers}; const e = __field(${JSON.stringify(s.fill)}); if (!e) return 'NOT FOUND'; e.focus(); e.scrollIntoView({block:'center'}); if (e.select) e.select(); return e.tagName + '#' + (e.name||e.id); })()`);
      if (out !== 'NOT FOUND') { await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'a', modifiers: 2 }); await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'a', modifiers: 2 }); await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Backspace', windowsVirtualKeyCode: 8 }); await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Backspace', windowsVirtualKeyCode: 8 }); await send('Input.insertText', { text: String(s.fill.value) }); }
      await sleep(s.ms ?? 800);
    }
    else if (s.key) { const codes = { Enter: 13, Tab: 9, Escape: 27, ArrowDown: 40 }; for (const type of ['keyDown', 'keyUp']) await send('Input.dispatchKeyEvent', { type, key: s.key, code: s.key, windowsVirtualKeyCode: codes[s.key], text: s.key === 'Enter' && type === 'keyDown' ? '\r' : undefined }); await sleep(s.ms ?? 1500); }
    else if (s.type) { await send('Input.insertText', { text: s.type }); await sleep(s.ms ?? 800); }
    else if (s.scan) { for (const c of s.scan) { const code = c.toUpperCase().charCodeAt(0); await send('Input.dispatchKeyEvent', { type: 'keyDown', key: c, code: /[0-9]/.test(c) ? 'Digit' + c : 'Key' + c.toUpperCase(), windowsVirtualKeyCode: code, text: c }); await send('Input.dispatchKeyEvent', { type: 'keyUp', key: c, windowsVirtualKeyCode: code }); await sleep(15); } for (const type of ['keyDown', 'keyUp']) await send('Input.dispatchKeyEvent', { type, key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13, text: type === 'keyDown' ? String.fromCharCode(13) : undefined }); await sleep(s.ms ?? 3000); }
    else if (s.wait) await sleep(s.wait);
    else if (s.eval) out = await ev(helpers + ";" + s.eval);
    else if (s.full) {
      // Full-page capture: grow the viewport to the tallest scroll container, save PNG + visible text.
      const h = await ev(`(() => { if (!document.getElementById('__hide_chat')) { const st = document.createElement('style'); st.id = '__hide_chat'; st.textContent = '.intercom-lightweight-app,#intercom-container,.intercom-launcher,iframe[name^=intercom]{display:none!important}'; document.head.appendChild(st); } let m = document.documentElement.scrollHeight; for (const e of document.querySelectorAll('*')) { const cs = getComputedStyle(e); if (/(auto|scroll)/.test(cs.overflowY) && e.scrollHeight > e.clientHeight + 4) m = Math.max(m, e.scrollHeight + e.getBoundingClientRect().top + 40); } return Math.min(Math.ceil(m), 7000); })()`);
      const height = Math.max(900, typeof h === 'number' ? h : 900);
      await send('Emulation.setDeviceMetricsOverride', { width: s.width || 1440, height, deviceScaleFactor: 1, mobile: !!s.mobile });
      await sleep(s.settle ?? 1500);
      const r = await send('Page.captureScreenshot', { format: 'png' });
      writeFileSync(`${outDir}/${s.full}.png`, Buffer.from(r.result.data, 'base64'));
      const txt = await ev(`location.href + String.fromCharCode(10,10) + document.body.innerText`);
      writeFileSync(`${outDir}/${s.full}.txt`, typeof txt === 'string' ? txt : '');
      if (!s.keep) { await send('Emulation.setDeviceMetricsOverride', { width: s.width || 1440, height: s.mobile ? 844 : 900, deviceScaleFactor: 1, mobile: !!s.mobile }); await sleep(400); }
      out = `${s.full}.png ${height}px`;
    }
    else if (s.shot) { const r = await send('Page.captureScreenshot', { format: 'jpeg', quality: 60 }); writeFileSync(`${outDir}/${s.shot}.jpg`, Buffer.from(r.result.data, 'base64')); out = `${outDir}/${s.shot}.jpg`; }
    else if (s.text) out = await ev(`(() => { const d = [...document.querySelectorAll('[role=dialog],.modal,[class*=Modal],[class*=Drawer]')].filter(e => e.getClientRects().length).pop(); return d || document.querySelector(${JSON.stringify(s.sel || 'main, #content, [class*=PageContent]')}) || document.body; })()` + String.raw`.innerText.replace(/\n{2,}/g,'\n').slice(0, ` + (s.max ?? 2500) + ')');
    console.log(`[${cur}] ${typeof out === 'string' ? out : JSON.stringify(out)}`);
  }
  await sleep(1500); ws.close(); setTimeout(() => process.exit(0), 300);
};
