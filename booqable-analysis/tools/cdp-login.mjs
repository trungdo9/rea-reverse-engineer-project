const [port, targetId] = process.argv.slice(2);
const ws = new WebSocket(`ws://127.0.0.1:${port}/devtools/page/${targetId}`);
let id = 0; const pending = new Map();
const send = (method, params = {}) => new Promise(r => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
ws.onmessage = e => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); } };
const sleep = ms => new Promise(r => setTimeout(r, ms));
const evalJs = async expr => (await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true })).result?.result?.value;
ws.onopen = async () => {
  await send('Page.navigate', { url: 'https://ghiencafe.booqable.com/employees/sign_in' });
  await sleep(6000);
  const email = JSON.stringify(process.env.BQ_EMAIL), pass = JSON.stringify(process.env.BQ_PASS);
  const res = await evalJs(`(() => {
    const set = (el, v) => { const d = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value'); d.set.call(el, v); el.dispatchEvent(new Event('input', {bubbles:true})); el.dispatchEvent(new Event('change', {bubbles:true})); };
    const e = document.querySelector('input[type=email], input[name*=email]'); const p = document.querySelector('input[type=password]');
    if (!e || !p) return 'form-not-found';
    set(e, ${email}); set(p, ${pass});
    const b = [...document.querySelectorAll('button, input[type=submit]')].find(x => /continue|sign in|log in/i.test(x.textContent || x.value));
    (b || p.form).click ? (b ? b.click() : p.form.submit()) : p.form.submit();
    return 'submitted';
  })()`);
  console.log('login:', res);
  await sleep(10000);
  console.log('url:', await evalJs('location.href'));
  console.log('title:', await evalJs('document.title'));
  ws.close();
};
