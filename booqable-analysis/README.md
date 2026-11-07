# Booqable (ghiencafe) — bộ tham chiếu để mô phỏng và thiết kế lại

Toàn bộ màn hình, hộp thoại và luồng nghiệp vụ của Booqable được chụp từ tài khoản trial `ghiencafe` ngày 06–07/11/2026, kèm báo cáo phân tích nghiệp vụ và bằng chứng REA. Dữ liệu trong ảnh là dữ liệu thử có tiền tố `[TEST]`.

> Vị trí: `E:\Projects\booqable-analysis` (đặt ngoài repo REA `E:\Projects\rental` vì chứa ảnh nhị phân). Muốn đưa vào repo dự án cho thuê, sao chép nguyên thư mục.

## Cấu trúc

| Thư mục | Nội dung | Số lượng |
| --- | --- | --- |
| `report/` | Báo cáo phân tích nghiệp vụ (`.md` bản đầy đủ nhất, `.pdf`, sơ đồ vòng đời đơn) | 3 file |
| `screens/back-office/` | Màn hình nhân viên, chụp toàn trang 1440px + file `.txt` (URL + nội dung chữ) | 93 màn hình |
| `screens/dialogs/` | Hộp thoại nghiệp vụ: giao/nhận hàng, thanh toán, thiếu hàng, giữ cọc, nhập kho, lịch, tạo đơn | 20 màn hình |
| `screens/storefront/` | Luồng khách đặt online: chọn chi nhánh → ngày giờ → giỏ → checkout → thành công; 4 ảnh mobile 390px | 17 màn hình |
| `screens/flow-captures-earlier/` | Ảnh từng bước của các luồng đã chạy thật ở các phiên trước (JPG) | 70 ảnh |
| `screens/INDEX.md` | Chỉ mục: ảnh ↔ route ↔ mục đích nghiệp vụ | 130 dòng |
| `rea-evidence/` | Bằng chứng REA: bundle, ảnh REA, kiểm kê route | xem dưới |
| `tools/` | Script chụp lại (CDP driver, kịch bản, REA helper) | |

## Bằng chứng REA (`rea-evidence/`)

- `rea-evidence-bundle.json`: Evidence bundle xuất bằng `export_evidence_bundle` (13 bản ghi, gồm `capture_web_screenshot` của 9 màn hình chính và `analyze_web_bundle` của back-office).
- `screens/01..09-*.png` + `records/*.evidence.json`: ảnh viewport do REA chụp (có SHA-256 trong record) — dashboard, danh sách đơn, đơn có cọc, đơn POS, lịch Gantt, sản phẩm serial, giá bậc thang, cài đặt thời gian thuê, trang sản phẩm storefront.
- `back-office-routes.txt`: **87 route** của SPA back-office do REA trích từ 48 file JavaScript (`analyze_web_bundle` → view `javascript-routes`). Dùng làm sitemap khi dựng lại.
- `records/back-office-routes.view.json`: bản đầy đủ của danh sách route (nguồn, vị trí).

Giới hạn: route là ứng viên tĩnh, chưa chứng minh tất cả đều truy cập được (4 route đoán thêm cho thấy trang trống và đã bị loại). Công cụ `capture_browser_scenario` ở chế độ connect lỗi trong phiên này, nên ảnh toàn trang được chụp bằng driver CDP trong `tools/`.

## Cách chụp

- Chrome riêng với profile tạm, điều khiển qua Chrome DevTools Protocol; đăng nhập bằng `tools/cdp-login.mjs` (đọc `BQ_EMAIL`, `BQ_PASS` từ biến môi trường).
- `tools/cdp-run.mjs` chạy kịch bản JSON: `nav`, `click`, `fill`, `type`, `scan` (giả lập máy quét), `full` (ảnh toàn trang + text), `eval`.
- Ảnh toàn trang: mở rộng khung nhìn theo vùng cuộn cao nhất (tối đa 7000px), ẩn bong bóng Intercom; storefront mobile dùng `width: 390, mobile: true`.
- Ảnh Subscribe iCal đã che đường link bí mật.

## Ghi chú dữ liệu

- Hộp thoại được mở rồi hủy, không lưu. Riêng lần chụp hộp thoại thiếu hàng đầu tiên đã vô tình Reserve thành công đơn Draft #2; đơn này đã được revert về Draft ngay sau đó.
- Mở `/orders/new` luôn tạo hoặc mở lại một đơn trạng thái “new”; các đơn “new” rỗng phát sinh đã được chuyển sang Draft.

## Màn hình chưa có

- Thanh toán thẻ / payment link / Tap to Pay (cần kết nối Stripe), giao hàng tận nơi (cần cài app), Website builder khi đã cài theme, app di động.
