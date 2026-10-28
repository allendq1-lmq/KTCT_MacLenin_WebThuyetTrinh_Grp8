# Phân công & Hướng dẫn kỹ thuật đề tài KTCT Mác - Lênin

Tài liệu bàn giao nội bộ dành cho nhóm 4 thành viên thuộc mảng **Code Web & Thuyết trình** (Nhóm 8).

---

## 1. Baseline & Hiện trạng mã nguồn đã xác minh

- **Nền tảng trang web chính (Leader):**
  - Khung HTML responsive, Tailwind CSS, hệ thống tab chuyển đổi mượt mà giữa 5 khu vực: Bàn cân so sánh, Bảo tàng 3D, Tòa án lý luận, Game thể chế và Danh sách nhóm tác giả.
  - **Tòa án lý luận:** Thẩm tra tuần tự 3 hồ sơ A, B, C và nút đóng dấu xác nhận phán quyết lịch sử hoạt động chính xác.
  - **Game thể chế (Reigns):** Cơ chế kéo thả thẻ bài hai chiều, điều khiển bằng phím mũi tên `←` / `→`, thuật toán tính toán 4 chỉ số (Tăng trưởng, Công bằng, Môi trường, Ổn định) với các điều kiện Game Over / Chiến thắng đạt chuẩn đề cương.
- **Không gian Bảo tàng 3D (Tổ 3D):**
  - Chạy theo kiến trúc module độc lập qua thẻ `iframe` (`museum/index.html`).
  - Đã tích hợp Tone Mapping điện ảnh (`ACESFilmicToneMapping`), chống chói sáng, sàn gỗ bảo tàng, tường gallery và chiếu sáng spotlight ấm.
  - Camera OrbitControls xoay tự do 360 độ mượt mà, phân tách rõ ràng giữa thao tác xoay chuột và thao tác nhấp chuột xem tranh.
  - Sinh viên UIT di chuyển bằng phím WASD / cụm phím ảo D-pad; cơ chế tự động chuyển tiếp phím từ trang mẹ vào iframe đã hoàn thiện.
  - Nút chuyển mốc thời gian, lý do tất yếu và mảng tối/sáng tự động đồng bộ cả góc lia camera và dịch chuyển vị trí nhân vật đứng trước tác phẩm.

---

## 2. Quy ước phân vùng & Trách nhiệm thành viên

Toàn bộ project được chia thành **2 phân vùng độc lập tuyệt đối** để cả 4 người cùng làm việc trên GitHub mà không bao giờ gặp xung đột mã nguồn:

### A. Nhóm trưởng (Leader) — Quản trị nền tảng & Logic nghiệp vụ ngoài

- **Phạm vi file sở hữu độc quyền:**
  - Thư mục gốc: `index.html`, `style.css`
  - Thư mục `js/`: `app.js`, `court.js`, `game.js`
- **Công việc:**
  - Giữ vững khung giao diện tổng thể, căn chỉnh CSS toàn trang, bố cục responsive máy tính và điện thoại.
  - Chịu trách nhiệm nội dung trực quan cho **Ý tưởng 1: Bàn Cân So Sánh 5 Trụ Cột** và **Danh sách 16 thành viên Nhóm 8**.
  - Duy trì logic của **Tòa Án Lý Luận** và cân bằng độ khó của 12 thẻ bài trong **Game Thể Chế**.
  - Quản lý cầu nối kỹ thuật (`bridge`) giữa trang chính và iframe 3D.
  - Tiếp nhận Pull Request, review code và tiến hành merge nhánh vào `main`.

### B. Tổ Bảo Tàng 3D (3 Thành viên còn lại cùng phụ trách)

- **Phạm vi file sở hữu độc quyền:** Toàn bộ thư mục `museum/`:
- **Công việc chung của 3 thành viên:**
  1. Cả 3 bạn cùng toàn quyền chỉnh sửa, nâng cấp, làm đẹp không gian và bổ sung bài học trong thư mục `museum/`.
  2. Kiểm tra và trau chuốt nội dung lý luận KTCT trong file `data.js` để bám sát bài báo cáo của nhóm nội dung.
  3. Tối ưu mỹ thuật không gian: trang trí thêm chi tiết cho phòng triển lãm, tinh chỉnh độ bóng của sàn, góc chiếu đèn, hoặc vẽ thêm chi tiết trên áo sinh viên UIT.
- **Quy tắc:** Tổ 3D **tuyệt đối không chạm vào thư mục `js/`, file `index.html` hoặc `style.css` ở thư mục gốc**. Mọi việc cần hiển thị bên trong 3D đều tự giải quyết trọn vẹn trong `museum/`.

---

## 3. Hướng dẫn Test & Quy trình phối hợp trên Git

### Cách test độc lập dành cho 3 thành viên làm 3D

- Các bạn không cần quan tâm đến web chính. Khi mở VS Code, chỉ cần:
  1. Mở file `museum/index.html`.
  2. Chuột phải chọn **Open with Live Server**
  3. Tại đây, toàn bộ không gian 3D, nhân vật, nút bấm và xoay chuột hoạt động 100%. Mọi thay đổi trong `museum/` sẽ cập nhật ngay lập tức.

### Quy trình đẩy code lên GitHub

1. **Tạo nhánh:**
   - Tổ 3D tạo một nhánh chung: `git checkout -b feat/3d-museum`.
2. **Commit đúng vùng phụ trách:**
   - Khi commit, chỉ add thư mục `museum/`:
     ```
     git add museum/
     git commit -m "feat(museum): (nội dung update)"
     git push origin feat/3d-museum
     ```
3. **Merge nhánh:**
   - Trưởng nhóm kiểm tra diff trên GitHub: Nếu chỉ có thay đổi trong thư mục `museum/`, nếu được trưởng nhóm sẽ Merge, không tự ý Merge.

---

## 4. Tiêu chuẩn nghiệm thu trước buổi báo cáo

- Web mở được mượt mà trên trình duyệt.
- Chuyển đổi qua lại giữa 5 Tab không bị vỡ layout, không bị giật lag.
- Tab Bảo tàng 3D xoay 360 độ êm ái, phím WASD di chuyển nhân vật bám sát camera, nhấp vào mọi hiện vật đều bung thông tin HUD chính xác.
- Game thể chế hoàn thành đủ 10 năm với đầy đủ hiệu ứng âm thanh/hình ảnh khi thắng hoặc thua.
- Kiểm tra font chữ, chính tả các thuật ngữ chính trị.
