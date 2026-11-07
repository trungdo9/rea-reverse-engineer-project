const r = await api('GET', 'https://ghiencafe.booqable.com/api/1/calendar/products?period=month&per=50&page=1&from=2026-11-01T00:00:00.000Z&till=2027-01-31T23:59:59.999Z');
log('status', r.status, 'top keys', Object.keys(r.body || {}).join(','));
const list = r.body?.products || r.body?.data || r.body;
const arr = Array.isArray(list) ? list : [];
log('products', arr.length, 'item keys', arr[0] ? Object.keys(arr[0]).join(',') : '');
for (const p of arr.filter(p => /Loa C|Máy chiếu|Loa B/.test(p.name || p.title || ''))) {
  log('==', p.name || p.title);
  const evs = p.plannings || p.events || p.items || [];
  log('  event keys', evs[0] ? Object.keys(evs[0]).join(',') : JSON.stringify(p).slice(0, 400));
  for (const e of evs.slice(0, 12)) log('  ', JSON.stringify(e).slice(0, 260));
  if (p.downtimes) log('  downtimes', JSON.stringify(p.downtimes).slice(0, 300));
}
