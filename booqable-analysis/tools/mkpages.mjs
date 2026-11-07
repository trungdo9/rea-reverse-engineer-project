import { writeFileSync } from 'node:fs';
const B = 'https://ghiencafe.booqable.com';
const PG = 'd99f656f-2513-4ba9-9748-4fbb2b0f8667'; // Máy chiếu (serial)
const PGV = 'b0836f13-a224-4b8b-bd5d-e318a9953634'; // Váy cưới (biến thể)
const PGC = 'c917bb4f-c8e9-4e64-ae95-0180fd343050'; // Xe (giá bậc thang)
const pages = [
  ['01-dashboard', '/dashboard'], ['02-setup-checklist', '/setup'],
  ['10-orders-list', '/orders'],
  ['11-order-returned-paid', '/orders/8907f10b-b60e-4f00-b2f2-bfc11842df14'],
  ['12-order-reserved', '/orders/dab7dad1-c565-4b4f-bda4-7d4ad0d930b5'],
  ['13-order-draft-shortage', '/orders/92f3c284-b692-40da-83a1-2ddd9a3e6ce3'],
  ['14-order-webshop', '/orders/44f5ca95-23dd-4671-92f4-902197b603eb'],
  ['15-order-pos-picked-up', '/orders/222f8c85-b4ac-4658-b1ac-12e347162b11'],
  ['16-order-deposit-held-refunded', '/orders/9ca4b7f3-ba9f-4c0c-bfd7-330d2e1fc119'],
  ['17-order-bundle', '/orders/60e105c1-41d8-4fae-a784-49dc11881db5'],
  ['18-order-serial-stock-items', '/orders/aaf8b1a0-aac4-4b96-8db8-09a78bfa05cd'],
  ['20-calendar-month', '/calendar/products'],
  ['30-customers-list', '/customers'],
  ['31-customer-detail', '/customers/1c0e12de-aaa7-4beb-870f-110469a4c938'],
  ['32-customer-edit', '/customers/1c0e12de-aaa7-4beb-870f-110469a4c938/edit'],
  ['33-customer-new', '/customers/new'],
  ['40-inventory-products', '/product_groups'],
  ['41-inventory-bundles', '/bundles'],
  ['42-inventory-collections', '/collections'],
  ['43-inventory-downtimes', '/downtimes'],
  ['44-product-new', '/product_groups/new'],
  ['45-product-serial-overview', `/product_groups/${PG}`],
  ['46-product-serial-inventory', `/product_groups/${PG}/inventory`],
  ['47-product-serial-stock-items', `/product_groups/${PG}/stock_items`],
  ['48-product-serial-pricing', `/product_groups/${PG}/pricing`],
  ['49-product-serial-settings', `/product_groups/${PG}/settings`],
  ['50-product-serial-online-store', `/product_groups/${PG}/online_store`],
  ['51-product-serial-downtimes', `/product_groups/${PG}/downtimes`],
  ['52-product-serial-cross-sell', `/product_groups/${PG}/cross_sell`],
  ['53-product-serial-history', `/product_groups/${PG}/activity_logs`],
  ['54-product-variants-inventory', `/product_groups/${PGV}/inventory`],
  ['55-product-variants-variations', `/product_groups/${PGV}/variations`],
  ['56-product-tiered-pricing', `/product_groups/${PGC}/pricing`],
  ['57-bundle-detail', '/bundles/ceeb5623-35aa-4933-bcd1-1d575b93f4fc'],
  ['60-coupons-list', '/coupons'], ['61-coupon-edit', '/coupons/38dabd22-c7d7-44a7-b8dd-b4700cd6de6c/edit'], ['62-coupon-new', '/coupons/new'],
  ['65-documents-invoices', '/reports/documents/invoices'], ['66-documents-quotes', '/reports/documents/quotes'], ['67-documents-contracts', '/reports/documents/contracts'],
  ['70-reports', '/reports'], ['71-report-company-performance', '/reports/company_performance'], ['72-report-rentals', '/reports/rentals'],
  ['73-report-availability', '/reports/availability'], ['74-report-pickups', '/reports/pickups'], ['75-report-customers', '/reports/customers'],
  ['76-report-coupons', '/reports/coupons'], ['77-report-activity-logs', '/reports/activity_logs'],
  ['80-app-store', '/app-store'],
  ['85-user-settings', '/employees/current'], ['86-team-invite', '/employees/new'],
];
const settings = ['general', 'prices', 'taxes', 'rental-period', 'payments', 'custom_fields', 'locations', 'emails', 'documents', 'locale', 'security', 'account',
  'online-bookings', 'booking-page', 'website-builder', 'website-integration', 'cross-sell', 'online-reservations', 'pickup-and-delivery', 'checkout', 'seo'];
settings.forEach((s, i) => pages.push([`9${String(i).padStart(2, '0')}-settings-${s}`, `/settings/${s}`]));
const steps = [];
for (const [name, path] of pages) { steps.push({ nav: B + path, ms: 7500 }); steps.push({ full: name }); }
writeFileSync(process.argv[2], JSON.stringify(steps));
console.log(pages.length, 'pages');
