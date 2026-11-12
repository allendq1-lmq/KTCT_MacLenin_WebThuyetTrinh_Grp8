# Phân công & Hướng dẫn kỹ thuật đề tài KTCT Mác - Lênin

---

## 1. Baseline & Hiện trạng mã nguồn hiện tại

- **Nền tảng trang web chính (`index.html`, `style.css`, `js/app.js`):**
  - Giao diện còn **3 Tab chính**: **Bảo Tàng 3D** (mặc định mở ngay khi vào trang), **Game Thể Chế**, và **Nhóm Tác Giả** (16 thành viên Nhóm 8).
  - Hỗ trợ nút **Toàn Màn Hình (Fullscreen / phím F)** phục vụ trình chiếu trực tiếp trên lớp và cơ chế chuyển tiếp phím tắt (`W-A-S-D`, mũi tên, `Space`, `Shift`, `Esc`) từ trang ngoài vào `iframe` 3D.
- **Không gian Bảo tàng 3D & Chế độ Thuyết trình (`museum/`):**
  - **Chế độ Thuyết trình toàn màn hình (`#presentation-panel`):** Che phủ toàn bộ vùng nhìn, hỗ trợ chuyển nhanh **Nền Tối / Nền Sáng** tương phản cao cho máy chiếu, điều khiển tuyến tính qua **20 slides** thuộc 3 phòng trưng bày, có thanh tiến độ, menu chọn nhanh slide, phím tắt `←` / `→` / `Space` và tự động đồng bộ vị trí nhân vật/camera 3D ở chế độ ngầm.
  - **Chế độ Khám phá tự do 3D:** Chạy trên Three.js r128 với duy nhất **Camera góc nhìn thứ ba Shift-Lock chuẩn Roblox** (khóa phía sau vai phải nhân vật sinh viên UIT, chống xuyên tường, giữ chuột kéo hoặc nhấn `Shift` khóa trỏ để xoay góc nhìn trên PC; hỗ trợ đa chạm D-pad + vuốt xoay trên Mobile). Nhấp vào 20 hiện vật để xem thông tin chi tiết trên thẻ HUD.
- **Game Thể Chế (`js/game.js` & `assets/sounds/`):**
  - Chế độ chơi duy nhất **NGẪU NHIÊN** (trộn ngẫu nhiên 10 năm nhiệm kỳ từ bộ **30 thẻ tình huống** thuộc 6 nhóm chủ đề), có khung giải thích luật chơi, cảnh báo chỉ số vùng nguy hiểm (`< 20` hoặc `> 80`), hiệu ứng hình ảnh (phát sáng xanh, rung viền đỏ, chớp đỏ khi thua, pháo giấy khi thắng) kèm 4 hiệu ứng âm thanh trong `assets/sounds/`.

---

## 2. Quy ước phân vùng & Trách nhiệm thành viên

Dự án được chia thành **2 mảng trách nhiệm rõ ràng** để cả 4 thành viên phối hợp trên GitHub mà không gây xung đột mã nguồn:

### A. Nhóm trưởng (Lê Minh Quân — Leader): Phụ trách nền tảng, Không gian 3D & Game Thể Chế

- **Phạm vi file sở hữu:**
  - Thư mục gốc & tài nguyên ngoài: `index.html`, `style.css`, `README.md`, `.gitignore`, `assets/`
  - Thư mục `js/`: `app.js`, `game.js`
  - Lõi 3D trong `museum/`: `engine.js`, `avatar.js`, `room1.js`, `room2.js`, `room3.js` cùng toàn bộ phần giao diện và logic của **Chế độ Khám phá tự do 3D** (camera Shift-Lock, D-pad, HUD hiện vật) trong `museum/index.html`, `museum/museum.css`, `museum/controls.js`.
- **Công việc:**
  - Duy trì khung giao diện tổng thể, bố cục responsive PC/Mobile, chế độ Fullscreen và cầu nối phím tắt vào `iframe`.
  - Quản lý toàn bộ không gian 3D, chuyển động nhân vật sinh viên UIT, cơ chế camera Shift-Lock và hiệu ứng/âm thanh của Game Thể Chế.
  - Review Pull Request, kiểm tra diff trên GitHub và tiến hành merge nhánh vào `main`.

### B. Các thành viên: Phụ trách toàn bộ Chế độ Thuyết trình

- **Thành viên phụ trách:** Nguyễn Anh Đức, Ngô Trí Dũng, Trần Thanh Duy.
- **Phạm vi phụ trách:** Toàn bộ giao diện, nội dung và luồng điều khiển của **Chế độ Thuyết trình (`#presentation-panel`)** nằm trong các tệp sau:
  - `museum/data.js`: Biên tập, rà soát nội dung 20 slides, tiêu đề, luận điểm trọng tâm, phân tích lý luận, dẫn chứng thực tiễn, bảng so sánh đối chiếu 6 tiêu chí và tài liệu tham khảo.
  - `museum/index.html`: Cấu trúc HTML bên trong `#presentation-panel` (thanh tiêu đề trên, vùng nội dung chính ở giữa, thanh điều khiển slide dưới cùng).
  - `museum/museum.css`: Kiểu dáng, cỡ chữ, khoảng cách, giao diện **Nền Tối / Nền Sáng** và responsive của `#presentation-panel`.
  - `museum/controls.js`: Logic điều khiển chuyển slide (`Slide trước`, `Tiếp theo`), menu chọn nhanh slide, phím tắt trình chiếu (`←`, `→`, `Space`) và nút chuyển đổi Nền Tối / Nền Sáng.
- **Quy tắc bắt buộc để tránh xung đột code:**
  1. **Không sửa tệp ngoài phạm vi:** Tuyệt đối không chỉnh sửa `index.html`, `style.css`, `js/`, `assets/`, `museum/engine.js`, `museum/avatar.js`, `museum/room1.js`, `museum/room2.js`, `museum/room3.js`.
  2. **Giữ nguyên cấu trúc dữ liệu 3D trong `museum/data.js`:** Khi chỉnh sửa nội dung thuyết trình, chỉ sửa các trường văn bản hiển thị (`title`, `subtitle`, `badge`, `lines`, `desc`, nội dung chi tiết/bảng so sánh); **không xóa hoặc đổi tên** các trường định danh và tọa độ (`id`, `room`, `camPos`, `lookPos`...) vì lõi 3D dùng các trường này để dựng tranh và đồng bộ vị trí nhân vật.
  3. **Tách biệt vùng sửa trong `museum/index.html`, `museum/museum.css`, `museum/controls.js`:** Chỉ thao tác bên trong `#presentation-panel` và các hàm điều khiển slide trình chiếu; không sửa `#webgl-container`, `#virtual-dpad`, `#museum-hud` hay logic camera Shift-Lock.

---

## 3. Hướng dẫn Test & Quy trình phối hợp trên Git

### Quy tắc bắt buộc cho tất cả thành viên

- Mỗi khi mở VS Code bắt đầu làm việc, luôn chạy lệnh cập nhật code mới nhất trước:
  ```bash
  git pull origin main
  ```
