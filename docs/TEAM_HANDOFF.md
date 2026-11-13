# Phân công & Hướng dẫn kỹ thuật đề tài KTCT Mác - Lênin

---

## 1. Baseline & Hiện trạng mã nguồn hiện tại

- **Nền tảng trang web chính (`index.html`, `style.css`, `js/app.js`):**
  - Giao diện thanh điều hướng chính gồm **4 Tab theo thứ tự từ trái sang phải**:
    1. **Nội Dung** (`data-tab="content"`, mở mặc định ngay khi vào trang): Nhúng trang thuyết trình độc lập `presentation/index.html` qua `#presentation-frame` với chiều cao toàn vùng nhìn `calc(100vh - 5rem)`.
    2. **Bảo Tàng 3D** (`data-tab="idea2"`): Nhúng không gian khám phá tự do 3D `museum/index.html` qua `#museum-frame` với chiều cao toàn vùng nhìn `calc(100vh - 5rem)`.
    3. **Game Thể Chế** (`data-tab="game"`): Mô phỏng hoạch định thể chế vĩ mô qua 10 năm nhiệm kỳ.
    4. **Nhóm Tác Giả** (`data-tab="members"`): Danh sách và bảng phân công nhiệm vụ của 16 thành viên Nhóm 8.
  - Hỗ trợ nút **Mã QR (`#btn-qr-modal`)** mở hộp thoại toàn màn hình tự động sinh mã QR theo URL thực tế của trang web và cho phép sao chép nhanh đường dẫn để khán giả trong lớp quét truy cập trực tiếp.
  - Hỗ trợ nút **Toàn Màn Hình (Fullscreen / phím tắt `F`)** hiển thị trên cả 2 tab **Nội Dung** và **Bảo Tàng 3D**, cùng cầu nối tự động chuyển tiếp phím tắt từ cửa sổ ngoài vào đúng `iframe` đang mở (`ArrowLeft`, `ArrowRight`, `Space` cho tab Nội Dung; `W`, `A`, `S`, `D`, phím mũi tên, `Shift`, `Esc` cho tab Bảo Tàng 3D).

- **Trang Nội Dung Thuyết Trình độc lập (`presentation/`):**
  - Được tách riêng 100% khỏi mã nguồn 3D vào thư mục `presentation/` gồm 4 tệp độc lập: `presentation/index.html`, `presentation/presentation.css`, `presentation/presentation.js` và `presentation/slides-data.js`.
  - **Giao diện Nền Sáng cố định độ tương phản cao:** Tối ưu cho màn chiếu lớp học, không sử dụng nút đổi giao diện Sáng/Tối và không có thanh điều hướng dưới cùng hay nút chuyển sang 3D nội bộ.
  - **Bố cục vừa khít 1 màn hình máy tính (Zero Vertical Scroll):** Gồm thanh công cụ trên cùng 1 hàng duy nhất (`48px` chứa cụm nút chọn `Phòng 1`, `Phòng 2`, `Phòng 3`, bộ đếm tiến độ `Slide X / 20`, nhãn tên phòng và menu thả xuống chọn nhanh 20 slides), biểu ngữ tiêu đề và lưới nội dung 2 cột (Cột trái: 4 luận điểm trọng tâm + khái quát nội dung; Cột phải: phân tích lý luận, dẫn chứng thực tiễn, bảng so sánh đối chiếu 6 tiêu chí ở Slide 17 và phán quyết cuối cùng kèm 10 nguồn tài liệu tham khảo chính thống ở Slide 20).
  - **Điều khiển chuyển slide:** Sử dụng phím mũi tên Trái/Phải (`ArrowLeft` / `ArrowRight`) hoặc phím `Space` trên máy tính; vuốt ngang bằng ngón tay (trái/phải) trên điện thoại và máy tính bảng; hoặc chọn trực tiếp trên thanh công cụ.

- **Không gian Bảo Tàng 3D — Khám phá tự do (`museum/`):**
  - Đã gỡ bỏ hoàn toàn giao diện thuyết trình khỏi `museum/` để thư mục này chỉ phục vụ duy nhất chế độ **Khám phá tự do 3D**.
  - Khi mở tab **Bảo Tàng 3D** (hoặc mở trực tiếp `museum/index.html`), người dùng vào thẳng không gian triển lãm 3D chạy trên Three.js r128 với **Camera góc nhìn thứ ba qua vai chuẩn Shift-Lock** (khóa sau vai phải nhân vật sinh viên UIT, chống xuyên tường, giữ chuột kéo hoặc nhấn `Shift` khóa trỏ chuột để xoay góc nhìn trên PC; hỗ trợ đa chạm cụm phím ảo D-pad + vuốt xoay góc nhìn trên Mobile).
  - Bao gồm thanh chọn nhanh Phòng 1 / Phòng 2 / Phòng 3 trên cùng, dải nút nhảy nhanh tới từng hiện vật trong phòng (`#explore-quick-nav`), thẻ HUD góc dưới phải (`#museum-hud`) và hộp thoại xem toàn văn nội dung hiện vật (`#detail-drawer-modal`) khi nhấp chuột vào tranh 3D trên tường.

- **Game Thể Chế (`js/game.js` & `assets/sounds/`):**
  - Chế độ chơi duy nhất **NGẪU NHIÊN** (trộn ngẫu nhiên 10 năm nhiệm kỳ từ bộ **30 thẻ tình huống** thuộc 6 nhóm chủ đề), có khung giải thích luật chơi, cảnh báo chỉ số vùng nguy hiểm (`< 20` hoặc `> 80`), hiệu ứng hình ảnh (phát sáng xanh, rung viền đỏ, chớp đỏ khi thua, pháo giấy khi thắng) kèm 4 hiệu ứng âm thanh trong `assets/sounds/`.

---

## 2. Quy ước phân vùng & Trách nhiệm thành viên

Dự án được chia thành **2 phân vùng thư mục độc lập hoàn toàn** để cả 4 thành viên nhóm Web phối hợp trên GitHub mà không xảy ra xung đột mã nguồn (merge conflict):

### A. Nhóm trưởng (Lê Minh Quân — Leader): Phụ trách Trang chính, Bảo Tàng 3D & Game Thể Chế

- **Phạm vi tệp sở hữu:**
  - Thư mục gốc & tài nguyên chung: `index.html`, `style.css`, `README.md`, `.gitignore`, `assets/`, `docs/`
  - Thư mục `js/`: `js/app.js`, `js/game.js`
  - Toàn bộ thư mục `museum/`: `museum/index.html`, `museum/museum.css`, `museum/controls.js`, `museum/engine.js`, `museum/avatar.js`, `museum/data.js`, `museum/room1.js`, `museum/room2.js`, `museum/room3.js`
- **Công việc cụ thể:**
  - Duy trì khung giao diện tổng thể 4 tab, tính năng Mã QR, chế độ Toàn Màn Hình (Fullscreen) và cầu nối chuyển tiếp phím tắt vào cả 2 `iframe`.
  - Quản lý toàn bộ không gian 3D, nhân vật sinh viên UIT, cơ chế camera Shift-Lock, tương tác hiện vật 3D và toàn bộ logic/âm thanh của Game Thể Chế.
  - Kiểm tra Pull Request, rà soát thay đổi (diff) trên GitHub và hợp nhất (merge) nhánh vào `main`.

### B. 3 Thành viên phụ trách Nội Dung Thuyết Trình (Nguyễn Anh Đức, Ngô Trí Dũng, Trần Thanh Duy)

- **Phạm vi tệp làm việc độc quyền (100% nằm trong thư mục `presentation/`):**
  - `presentation/slides-data.js`: Chứa toàn bộ dữ liệu của 20 slides thuyết trình (`roomNames`, `comparisonTableRows`, `comparisonTableHtml`, `slides`), bao gồm tiêu đề, phụ đề, nhãn mục, 4 luận điểm chính (`lines`), đoạn khái quát (`desc`), nội dung phân tích chi tiết (`fullHtml`), bảng đối chiếu 6 tiêu chí và 10 nguồn tài liệu tham khảo. Tệp này đã loại bỏ hoàn toàn các tọa độ 3D để các thành viên biên tập nội dung an toàn.
  - `presentation/index.html`: Cấu trúc HTML của trang thuyết trình (thanh công cụ trên cùng `#pres-top-bar`, khối tiêu đề `#pres-title-banner`, lưới nội dung 2 cột `#pres-content-grid`).
  - `presentation/presentation.css`: Toàn bộ quy tắc định kiểu giao diện nền sáng, tỷ lệ chữ co giãn tự động (`clamp`), bố cục lưới vừa khít 1 màn hình máy tính không cuộn dọc (`@media (min-width: 1024px)`) và giao diện cuộn mượt trên thiết bị di động (`@media (max-width: 1023px)`).
  - `presentation/presentation.js`: Logic hiển thị slide (`window.PresentationApp`), bộ lọc chọn Phòng 1/2/3, menu chọn nhanh 20 slides, điều hướng bàn phím (`ArrowLeft`, `ArrowRight`, `Space`), phím tắt Toàn màn hình (`F`) và cử chỉ vuốt ngang trên màn hình cảm ứng.
- **Quy tắc bắt buộc để tránh xung đột mã nguồn:**
  1. **Chỉ chỉnh sửa bên trong thư mục `presentation/`:** Ba thành viên phụ trách thuyết trình tuyệt đối không chỉnh sửa bất kỳ tệp nào trong `museum/`, `js/`, `assets/` hoặc các tệp ở thư mục gốc (`index.html`, `style.css`).
  2. **Đảm bảo nguyên tắc 1 màn hình không cuộn dọc trên PC:** Khi cập nhật văn bản trong `presentation/slides-data.js` hoặc chỉnh sửa CSS trong `presentation/presentation.css`, cần giữ độ dài câu chữ cô đọng để toàn bộ 20 slides luôn hiển thị trọn vẹn trong một khung nhìn máy tính (`1920x1080` và `1366x768`) mà không phát sinh thanh cuộn dọc.
  3. **Giữ định danh cấu trúc DOM cốt lõi trong `presentation/index.html`:** Không xóa hoặc đổi `id` của các phần tử gắn với `presentation.js` (`#presentation-panel`, `#pres-top-bar`, `#slide-counter-badge`, `#pres-room-tag`, `#slide-select-dropdown`, `#pres-progress-bar`, `#pres-slide-badge`, `#pres-slide-subtitle`, `#pres-slide-title`, `#pres-key-points`, `#pres-slide-desc`, `#pres-slide-body`).

---

## 3. Hướng dẫn Test & Quy trình phối hợp trên Git

### 3.1. Cập nhật mã nguồn mới nhất trước khi làm việc

Mỗi khi mở VS Code bắt đầu phiên làm việc, tất cả thành viên luôn chạy lệnh kéo mã nguồn mới nhất từ nhánh `main`:

```bash
git checkout main
git pull origin main
```

### 3.2. Cách chạy thử và kiểm tra giao diện Thuyết trình bằng Live Server

Ba thành viên phụ trách thuyết trình có thể kiểm thử theo 2 cách:

1. **Chạy thử độc lập riêng trang Thuyết trình:**
   - Trong VS Code, nhấp chuột phải vào tệp `presentation/index.html` và chọn **Open with Live Server**.
   - Kiểm tra trực tiếp cả 20 slides bằng phím `ArrowLeft`, `ArrowRight`, `Space`, các nút `Phòng 1`, `Phòng 2`, `Phòng 3` và menu chọn nhanh slide.
2. **Chạy thử trong khung trang chính:**
   - Nhấp chuột phải vào tệp `index.html` ở thư mục gốc và chọn **Open with Live Server**.
   - Xác nhận tab **Nội Dung** mở mặc định, bấm thử nút **Toàn Màn Hình** (hoặc phím `F`) và kiểm tra chuyển slide ngay từ trang chính.

### 3.3. Quy trình tạo nhánh, Commit và gửi Pull Request (Dành cho 3 thành viên Thuyết trình)

1. **Tạo hoặc chuyển sang nhánh làm việc riêng cho phần thuyết trình:**
   ```bash
   git checkout -b feat/presentation-mode
   ```
   *(Nếu nhánh `feat/presentation-mode` đã tồn tại trên máy, dùng lệnh `git checkout feat/presentation-mode` rồi chạy `git merge main` để đồng bộ).*

2. **Kiểm tra danh sách tệp đã thay đổi (đảm bảo chỉ có các tệp trong `presentation/`):**
   ```bash
   git status
   ```

3. **Đưa các tệp trong thư mục `presentation/` vào vùng chuẩn bị commit (Staging):**
   ```bash
   git add presentation/
   ```
   *(Lưu ý: Không dùng `git add .` nếu vô tình chạm vào tệp ngoài thư mục `presentation/`).*

4. **Tạo bản ghi commit theo chuẩn rõ ràng:**
   ```bash
   git commit -m "feat(presentation): cap nhat noi dung va bo cuc 20 slides thuyet trinh"
   ```

5. **Đẩy nhánh lên kho lưu trữ GitHub:**
   ```bash
   git push -u origin feat/presentation-mode
   ```

6. **Tạo Pull Request trên GitHub:**
   - Mở kho lưu trữ dự án trên GitHub, chọn **Compare & pull request** từ nhánh `feat/presentation-mode` vào nhánh `main`.
   - Ghi tóm tắt các mục đã chỉnh sửa trong phần mô tả và báo cho Nhóm trưởng (Lê Minh Quân) kiểm tra, hợp nhất.

---

## 4. Tiêu chuẩn nghiệm thu (Acceptance Criteria)

Trước khi gửi Pull Request hoặc báo cáo hoàn thành, cần kiểm tra đạt đủ các tiêu chí sau:

1. **Thanh điều hướng 4 Tab chuẩn xác:**
   - Mở `index.html` hiển thị đúng 4 tab theo thứ tự từ trái sang phải: **Nội Dung** (mở mặc định) -> **Bảo Tàng 3D** -> **Game Thể Chế** -> **Nhóm Tác Giả**.
   - Nút **Mã QR** mở và đóng hộp thoại mã QR toàn màn hình mượt mà trên mọi tab.
   - Nút **Toàn Màn Hình (phím F)** hiển thị và hoạt động chính xác trên cả 2 tab **Nội Dung** và **Bảo Tàng 3D**, tự động ẩn khi chuyển sang tab **Game Thể Chế** hoặc **Nhóm Tác Giả**.
2. **Tab Nội Dung (`presentation/`) cô lập và hiển thị chuẩn trên mọi thiết bị:**
   - Hoạt động hoàn toàn độc lập, không phụ thuộc bất kỳ tệp nào trong `museum/` hay thư viện Three.js.
   - Hiển thị đầy đủ 20 slides thuộc 3 phòng trưng bày, bảng so sánh đối chiếu 6 tiêu chí (Slide 17) và phán quyết cuối cùng kèm 10 nguồn tài liệu tham khảo (Slide 20).
   - Trên màn hình máy tính (`1920x1080` và `1366x768`), toàn bộ 20 slides vừa khít trong 1 khung nhìn duy nhất, không xuất hiện thanh cuộn dọc.
   - Chuyển slide nhạy bằng phím `ArrowLeft`, `ArrowRight`, `Space` trên máy tính và thao tác vuốt ngang trên màn hình điện thoại (`390x844`).
3. **Tab Bảo Tàng 3D (`museum/`) thuần không gian Khám phá tự do:**
   - Mở thẳng vào không gian 3D với nhân vật sinh viên UIT và camera góc nhìn thứ ba Shift-Lock, không còn bất kỳ phần tử HTML/CSS/JS nào của chế độ thuyết trình cũ.
   - Chọn phòng (Phòng 1, Phòng 2, Phòng 3), nhảy nhanh tới từng hiện vật trên thanh `#explore-quick-nav`, di chuyển bằng `W-A-S-D` / D-pad ảo và nhấp vào hiện vật để mở hộp thoại xem chi tiết hoạt động ổn định.
4. **Không lỗi Console & Không xung đột tệp:**
   - Mở công cụ DevTools (`F12` -> tab `Console`) không phát sinh lỗi JavaScript khi chuyển đổi qua lại giữa 4 tab.
   - Khi kiểm tra `git diff` trên nhánh của nhóm thuyết trình, chỉ có thay đổi bên trong thư mục `presentation/`.
