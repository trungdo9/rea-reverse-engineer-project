const S1 = 'aaf8b1a0-aac4-4b96-8db8-09a78bfa05cd', pid = '2941f917-2bc1-4a2f-93d0-92380ce119a2', I1 = '387e3d5f-edf7-4cf8-b510-f81078903435';
const p = (await api('GET', `plannings?filter[order_id]=${S1}`)).body.data[0];
await step('S1 return MC-001 (stop_stock_items)', fulfil(S1, [{ action: 'stop_stock_items', planning_id: p.id, product_id: pid, stock_item_ids: [I1] }]));
log('S1', await getOrder(S1));
