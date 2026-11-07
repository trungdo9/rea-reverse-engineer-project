const p = await mkProduct('[TEST] Loa A (1 cái)', 100000, 1);
log('product', p);
const prod = await api('GET', `products/${p.pid}`);
log('product attrs', Object.entries(prod.body.data.attributes).filter(([k]) => /buffer|shortage|stock|track|lag|lead|type|sku|price|deposit|avail|plann/.test(k)));
log('avail 20-22/11', await avail(p.pgId, '2026-11-20T09:00', '2026-11-22T15:00'));
