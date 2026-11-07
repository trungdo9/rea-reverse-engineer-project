// Build screens/INDEX.md: one table per folder with image link, route and the business purpose.
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
const root = 'E:/Projects/booqable-analysis/screens';
const purpose = {
  '01-dashboard': 'Bảng điều khiển: Going out / Coming back hôm nay, link đơn trễ', '02-setup-checklist': 'Checklist onboarding 11 bước + trợ lý Bo',
  '10-orders-list': 'Danh sách đơn: lọc trạng thái, thanh toán, tag; số liệu tổng', '11-order-returned-paid': 'Đơn đã trả, đã thanh toán (vòng đời hoàn tất)',
  '12-order-reserved': 'Đơn đang giữ hàng (Reserved), chờ Pickup', '13-order-draft-shortage': 'Đơn Draft/báo giá, có dòng thiếu hàng',
  '14-order-webshop': 'Đơn đặt online (tag WEBSHOP, tự Reserved)', '15-order-pos-picked-up': 'Đơn bán tại quầy: quét serial, giao ngay, thu tiền mặt',
  '16-order-deposit-held-refunded': 'Đơn có cọc: giữ 1tr do hư hỏng, hoàn 4tr', '17-order-bundle': 'Đơn có combo (bundle) giảm 10%',
  '18-order-serial-stock-items': 'Đơn gắn serial cụ thể (stock item)', '19-orders-upcoming': 'Đơn sắp tới', '19b-orders-overdue': 'Đơn quá hạn trả',
  '19c-orders-shortage': 'Đơn đang thiếu hàng', '19d-order-packing-slip': 'Phiếu soạn hàng (packing slip)', '19e-order-activity-log': 'Nhật ký thao tác của đơn',
  '20-calendar-month': 'Lịch Gantt theo sản phẩm (tháng)', '30-customers-list': 'Danh sách khách hàng', '32-customer-edit': 'Hồ sơ khách: thông tin, địa chỉ, cọc/giảm giá riêng',
  '33-customer-new': 'Tạo khách mới', '34-customer-orders': 'Lịch sử đơn của khách', '35-customer-accounts': 'Tài khoản đăng nhập storefront của khách',
  '36-customer-creditcards': 'Thẻ đã lưu của khách', '37-customer-activity-log': 'Nhật ký thao tác của khách',
  '40-inventory-products': 'Danh sách sản phẩm', '41-inventory-bundles': 'Danh sách combo', '42-inventory-collections': 'Bộ sưu tập (nhóm sản phẩm trên store)',
  '43-inventory-downtimes': 'Danh sách bảo trì (downtime)', '44-product-new': 'Tạo sản phẩm: loại, cách theo dõi kho, giá, biến thể',
  '45-product-serial-overview': 'Sản phẩm theo serial: tổng quan', '46-product-serial-inventory': 'Kho theo serial: stock item, nhập kho, kho tạm',
  '47-product-serial-edit': 'Sửa sản phẩm: lead/lag time, shortage limit, SKU, cân nặng', '48-product-serial-pricing': 'Thiết lập giá sản phẩm',
  '49-product-serial-history': 'Lịch sử sản phẩm', '50-product-serial-online-store': 'Hiển thị sản phẩm trên storefront (SEO, mô tả, ảnh)',
  '51-product-serial-downtimes': 'Downtime của sản phẩm', '52-product-serial-recommendations': 'Gợi ý bán kèm (cross-sell)', '53-product-serial-history': 'Activity log sản phẩm',
  '54-product-variants-inventory': 'Sản phẩm có biến thể (Size × Màu): kho từng biến thể', '55-product-variants-variations': 'Quản lý biến thể',
  '56-product-tiered-pricing': 'Bảng giá bậc thang (giảm 50% từ ngày 4)', '57-bundle-detail': 'Chi tiết combo',
  '60-coupons-list': 'Danh sách coupon', '61-coupon-edit': 'Luật coupon: thời hạn, số lần, đơn tối thiểu, cộng dồn', '62-coupon-new': 'Tạo coupon',
  '65-documents-invoices': 'Hóa đơn', '66-documents-quotes': 'Báo giá', '67-documents-contracts': 'Hợp đồng',
  '70-reports': 'Danh mục báo cáo', '81-automations': 'Tự động hóa (automation)', '82-automation-new': 'Tạo automation',
  '85-user-settings': 'Hồ sơ người dùng: 2FA, khóa API, lịch sử đăng nhập', '86-team-invite': 'Mời thành viên + 13 quyền', '87-settings-plans': 'Bảng gói cước',
  'd01-pickup-dialog': 'Hộp thoại giao hàng (chọn món, giao một phần, quét barcode)', 'd02-payment-methods': 'Chọn phương thức thanh toán',
  'd03-payment-cash-form': 'Thu tiền mặt/chuyển khoản/thẻ ngoài', 'd04-order-actions-menu': 'Menu đơn: Duplicate, Revert, Cancel',
  'd05-reserve-shortage-error': 'Lỗi thiếu hàng khi Reserve', 'd06-return-dialog-keep-deposit': 'Hộp thoại nhận lại hàng + giữ cọc kèm lý do',
  'd07-add-stock-serial': 'Nhập kho (serial / kho tạm)', 'd08-calendar-actions-menu': 'Menu lịch: Subscribe, Today, Day/Week/Month',
  'd09-calendar-subscribe-ical': 'Đồng bộ lịch iCal (URL đã che)', 'd10-calendar-week': 'Lịch dạng tuần',
  'd11-calendar-check-availability-picker': 'Chọn khoảng thời gian kiểm tra tồn', 'd12-calendar-availability-result': 'Kết quả: cột còn trống/tổng',
  'd13-user-menu': 'Menu người dùng', 'd14-global-scan-barcode': 'Quét barcode toàn cục', 'd20-new-order-empty': 'Tạo đơn mới (trống)',
  'd20-new-order-reopened-unsaved-with-deposit': 'Đơn mới bị mở lại (đơn chưa lưu) có tiền cọc', 'd21-new-order-create-customer': 'Tạo khách ngay trong đơn',
  'd22-new-order-period-picker': 'Chọn thời gian thuê trong đơn', 'd23-new-order-product-search': 'Tìm & thêm sản phẩm (số còn trống)', 'd24-new-order-scan-products': 'Quét barcode thêm sản phẩm',
  '01-home-preview-modal': 'Storefront: thông báo chế độ preview', '02-home-catalog': 'Trang chủ / danh mục', '03-product-variants': 'Sản phẩm có biến thể',
  '04-product-no-period': 'Trang sản phẩm chưa chọn ngày', '05-location-picker': 'Chọn điểm nhận hàng (khi có nhiều chi nhánh)',
  '06-period-picker-calendar': 'Chọn ngày thuê', '07-period-picker-time-slots': 'Chọn giờ (bước 60 phút)', '08-period-picker-filled': 'Khoảng thuê đã chọn',
  '09-product-with-period-availability': 'Giá theo khoảng thuê + số còn trống', '10-product-added-to-cart': 'Đã thêm vào giỏ', '11-cart': 'Giỏ hàng + dịch vụ thêm + coupon',
  '12-checkout-form': 'Checkout: thông tin khách, địa chỉ', '13-checkout-success': 'Đặt hàng thành công', 'm01-home-mobile': 'Mobile: trang chủ',
  'm02-product-mobile': 'Mobile: sản phẩm', 'm03-cart-mobile': 'Mobile: giỏ hàng', 'm04-checkout-mobile': 'Mobile: checkout',
};
const auto = n => n.replace(/^[0-9a-z]+-/, '').replace(/-/g, ' ').replace(/^settings /, 'Settings: ').replace(/^report /, 'Báo cáo: ');
let md = '# Chỉ mục màn hình Booqable (ghiencafe)\n\nẢnh chụp toàn trang 1440px (storefront có thêm bản mobile 390px). Mỗi ảnh có file `.txt` cùng tên chứa URL và nội dung chữ của màn hình.\n';
for (const [dir, title] of [['back-office', 'Back-office (nhân viên)'], ['dialogs', 'Hộp thoại & luồng nghiệp vụ'], ['storefront', 'Storefront (khách đặt online)']]) {
  const files = readdirSync(`${root}/${dir}`).filter(f => f.endsWith('.png')).sort();
  md += `\n## ${title} — ${files.length} màn hình\n\n| Ảnh | Route | Mục đích nghiệp vụ |\n| --- | --- | --- |\n`;
  for (const f of files) {
    const n = f.replace(/\.png$/, '');
    let url = ''; try { url = readFileSync(`${root}/${dir}/${n}.txt`, 'utf8').split('\n')[0].replace(/^https:\/\/ghiencafe\.booqable(shop)?\.com/, '').split('?')[0]; } catch {}
    md += `| [${n}](${dir}/${f}) | \`${url}\` | ${purpose[n] || auto(n)} |\n`;
  }
}
md += '\n## Ảnh luồng từ các phiên kiểm tra trước\n\n`flow-captures-earlier/` (JPG) chứa ảnh từng bước khi chạy thật các luồng: tạo sản phẩm, đơn #1 từ New → Reserved → Paid → Picked up → Mixed → Returned, đơn #2 thiếu hàng, POS quét thẻ khách/serial, đặt hàng online #3, các trang Settings.\n';
writeFileSync(`${root}/INDEX.md`, md);
console.log('ok');
