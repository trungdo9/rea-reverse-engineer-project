const I1 = '387e3d5f-edf7-4cf8-b510-f81078903435', I2 = 'fda17aaf-c32e-4955-9120-539a487eadba';
const D = { pid: '5f89ec69-bd46-4313-908c-1d9462938d32' };
const mk = async (label, owner_type, owner_id, number) => {
  for (const a of [{ owner_type, owner_id, number, barcode_type: 'code128' }, { owner_type, owner_id, number }]) {
    const r = await api('POST', 'barcodes', { data: { type: 'barcodes', attributes: a } });
    log(label.padEnd(30), Object.keys(a).join(','), JSON.stringify(short(r)), r.body?.data?.attributes?.number || '');
    if (r.status < 300) return r.body.data;
  }
};
await mk('barcode MC-001', 'stock_items', I1, 'MC001');
await mk('barcode MC-002', 'stock_items', I2, 'MC002');
await mk('barcode Loa D (product)', 'products', D.pid, 'LOAD');
await mk('barcode khách A', 'customers', CUST, 'KHA');
await mk('barcode trùng MC001', 'products', D.pid, 'MC001');
const s = await api('GET', `barcodes?filter[number]=MC001&include=owner`);
log('lookup MC001', JSON.stringify(short(s)), s.body?.data?.map(b => `${b.attributes.owner_type}:${b.attributes.owner_id}`));
