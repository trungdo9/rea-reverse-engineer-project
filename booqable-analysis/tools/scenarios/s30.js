for (const [n, id] of [['#4 (pickup/payment dialogs)', 'dab7dad1-c565-4b4f-bda4-7d4ad0d930b5'], ['#57 (return dialog)', '222f8c85-b4ac-4658-b1ac-12e347162b11']]) {
  const o = await getOrder(id); const p = (await api('GET', `payments?filter[order_id]=${id}`)).body.data.length;
  log(n, o.status, JSON.stringify(o.counts), 'pay=', o.pay, 'payments=', p);
}
const s = (await api('GET', 'stock_items?filter[product_id]=2941f917-2bc1-4a2f-93d0-92380ce119a2')).body.data.length;
log('Máy chiếu stock items =', s);
