// usage: node cdp-api.mjs PORT TARGET SCENARIO.js [--nav]
// SCENARIO.js is the body of an async function with helpers in scope:
//   api(method, path, body?) -> {status, body}; log(...); short(resp) ; sleep(ms)
import { readFileSync } from 'node:fs';
const [port, target, file, flag] = process.argv.slice(2);
const code = readFileSync(file, 'utf8');
const ws = new WebSocket(`ws://127.0.0.1:${port}/devtools/page/${target}`);
let id = 0; const pending = new Map();
const send = (method, params = {}) => new Promise(r => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
ws.onmessage = e => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); } };
const prelude = String.raw`
const __out = [];
const log = (...a) => __out.push(a.map(x => typeof x === 'string' ? x : JSON.stringify(x)).join(' '));
const sleep = ms => new Promise(r => setTimeout(r, ms));
const csrf = () => document.querySelector('meta[name="csrf-token"]')?.content || '';
async function api(method, path, body) {
  const r = await fetch(path.startsWith('http') ? path : '/api/boomerang/' + path.replace(/^\//, ''), { method, credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest', 'X-CSRF-Token': csrf() },
    body: body ? JSON.stringify(body) : undefined });
  let j = null; try { j = await r.json(); } catch {}
  return { status: r.status, body: j };
}
const errs = r => (r.body?.errors || []).map(e => ({ code: e.code, detail: e.detail, src: e.source?.pointer, meta: e.meta?.blocking ? { blocking: e.meta.blocking.map(b => ({ reason: b.reason, stock: b.stock_count, reserved: b.reserved, needed: b.needed, shortage: b.shortage, orders: (b.orders||[]).length, downtimes: (b.downtimes||[]).length })), warning: e.meta.warning } : undefined }));
const short = r => r.status >= 400 ? { status: r.status, errors: errs(r) } : { status: r.status };
`;
ws.onopen = async () => {
  if (flag === '--nav') { await send('Page.navigate', { url: 'https://ghiencafe.booqable.com/dashboard' }); await new Promise(r => setTimeout(r, 7000)); }
  const expr = `(async () => { ${prelude}\n try { ${code}\n } catch (e) { log('EXCEPTION', String(e && e.stack || e)); } return __out.join(String.fromCharCode(10)); })()`;
  if (process.env.DUMP) (await import('node:fs')).writeFileSync(process.env.DUMP, expr);
  const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true, timeout: 600000 });
  console.log(r.result?.result?.value ?? JSON.stringify(r.result?.exceptionDetails || r));
  ws.close(); setTimeout(() => process.exit(0), 200);
};
