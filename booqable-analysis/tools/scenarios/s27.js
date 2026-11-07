const cal = await api('GET', 'https://ghiencafe.booqable.com/api/1/calendar/products?period=month&per=50&page=1&from=2026-11-01T00:00:00.000Z&till=2026-11-30T23:59:59.999Z');
const prods = cal.body.products.map(p => ({ id: p.id, name: p.name }));
const q = prods.map(p => 'ids[]=' + p.id).join('&');
const r = await api('GET', `https://ghiencafe.booqable.com/api/1/calendar/products/available?from=2026-11-08T00:00:00.000Z&till=2026-11-14T23:59:59.999Z&${q}`);
log('status', r.status, 'shape', JSON.stringify(r.body).slice(0, 300));
const data = r.body?.products || r.body?.data || r.body;
const name = id => (prods.find(p => p.id === id) || {}).name || id;
if (Array.isArray(data)) for (const x of data) log(name(x.id || x.product_id), JSON.stringify(x).slice(0, 200));
else if (data && typeof data === 'object') for (const [k, v] of Object.entries(data)) log(name(k), JSON.stringify(v).slice(0, 200));
