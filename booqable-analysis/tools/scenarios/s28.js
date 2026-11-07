const ids = {};
for (const n of [3, 4, 26, 60]) { const r = await api('GET', `orders?filter[number]=${n}`); ids['order' + n] = r.body?.data?.[0]?.id; }
const b = await api('GET', 'bundles'); ids.bundle = b.body?.data?.[0]?.id;
const d = await api('GET', 'downtimes'); ids.downtime = d.body?.data?.[0]?.id;
log(JSON.stringify(ids));
for (const p of ['/bundles', '/collections', '/downtimes', '/product_groups/d99f656f-2513-4ba9-9748-4fbb2b0f8667/pricing', '/product_groups/d99f656f-2513-4ba9-9748-4fbb2b0f8667/settings', '/product_groups/d99f656f-2513-4ba9-9748-4fbb2b0f8667/variations', '/product_groups/d99f656f-2513-4ba9-9748-4fbb2b0f8667/downtimes', '/product_groups/d99f656f-2513-4ba9-9748-4fbb2b0f8667/cross_sell', '/product_groups/d99f656f-2513-4ba9-9748-4fbb2b0f8667/stock_items', '/customers/1c0e12de-aaa7-4beb-870f-110469a4c938']) {
  const r = await fetch(p, { credentials: 'same-origin' }); log(p, r.status, r.url.replace(location.origin, ''));
}
