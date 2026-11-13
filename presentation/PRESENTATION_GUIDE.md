# Phân công & Hướng dẫn kỹ thuật — Nhóm Nội Dung Thuyết Trình (3 thành viên)

**Phụ trách điều phối:** Trần Thanh Duy
**Thành viên:** Nguyễn Anh Đức, Ngô Trí Dũng, Trần Thanh Duy
**Deadline:** 5 ngày kể từ ngày nhận phân công

---

## 1. Baseline & Hiện trạng thư mục `presentation/`

- Thư mục `presentation/` gồm 4 tệp, **chỉ nhóm này được sửa**:
  - `presentation/index.html` — khung giao diện (top bar, khối tiêu đề, lưới 2 cột)
  - `presentation/presentation.css` — toàn bộ định kiểu, co giãn chữ, quy tắc không cuộn dọc trên PC
  - `presentation/presentation.js` — logic hiển thị slide, chọn phòng, điều hướng bàn phím/vuốt
  - `presentation/slides-data.js` — **tệp duy nhất cả 3 người thực sự chỉnh sửa nội dung**
- Dữ liệu hiện có **20 slides**, chia theo 3 phòng:

| Phòng | Số slide | Chủ đề |
|---|---|---|
| Phòng 1 | 8 (slide 1–8) | Tổng quan KTTT ĐHXHCN |
| Phòng 2 | 6 (slide 9–14) | 5 Đặc trưng cơ bản |
| Phòng 3 | 6 (slide 15–20) | Giới hạn CNTB, bảng so sánh, giải pháp, phán quyết |

- Mỗi slide trong `slides-data.js` có cấu trúc cố định: `id`, `room`, `sectionCode`, `badge`, `title`, `subtitle`, `lines` (4 luận điểm), `desc` (khái quát), `fullHtml` (phân tích chi tiết). Slide `r3-table` (slide 17) và slide `r3-verdict` (slide 20) có bố cục đặc biệt (bảng so sánh, danh sách 10 nguồn tham khảo) — **không đổi `id` của 2 slide này**.

---

## 2. Quy ước phân vùng & Trách nhiệm thành viên

Để tránh xung đột mã nguồn (merge conflict) khi cả 3 người cùng sửa `slides-data.js`, mỗi người **chỉ sửa đúng khối slide của phòng mình phụ trách**, không chạm vào khối của người khác trong cùng tệp.

### A. Nguyễn Anh Đức — Phụ trách Phòng 1

- **Phạm vi:** 8 slide từ `r1-1a` đến `r1-4b` (slide 1–8) trong `slides-data.js`.
- **Công việc cụ thể:**
  - Rà soát nội dung lý luận, đối chiếu giáo trình và văn kiện Đảng được trích dẫn.
  - Kiểm tra mốc thời gian (giai đoạn trước 1986, 1986–2000, 2001–2026) có nhất quán với các slide khác không.
  - Áp dụng quy tắc "4 dòng, 1 ý" ở mục 3 bên dưới cho toàn bộ 8 slide.

### B. Ngô Trí Dũng — Phụ trách Phòng 2

- **Phạm vi:** 6 slide từ `r2-a` đến `r2-b5` (slide 9–14) trong `slides-data.js`.
- **Công việc cụ thể:**
  - Rà soát 5 đặc trưng cơ bản, đảm bảo mỗi đặc trưng trình bày nhất quán về cấu trúc với 4 đặc trưng còn lại.
  - Kiểm tra số liệu dẫn chứng thực tiễn (GDP, tỷ lệ hộ nghèo, BHYT, cam kết Net Zero…) và ghi rõ nguồn nếu thay đổi.
  - Áp dụng quy tắc "4 dòng, 1 ý" cho toàn bộ 6 slide.

### C. Trần Thanh Duy — Phụ trách Phòng 3 & Tổng duyệt

- **Phạm vi:** 6 slide từ `r3-1` đến `r3-verdict` (slide 15–20) trong `slides-data.js`, bao gồm bảng so sánh 6 tiêu chí (`comparisonTableRows`, slide 17) và 10 nguồn tham khảo (slide 20).
- **Công việc cụ thể:**
  - Rà soát 5 giới hạn lịch sử của CNTB, 5 trụ cột khắc phục, 4 hạn chế và 4 giải pháp — đảm bảo không trùng số thứ tự với số do giao diện tự sinh (xem mục 3).
  - Kiểm tra bảng so sánh 6 tiêu chí hiển thị đúng, không vỡ bố cục khi rút gọn câu chữ.
  - Xác minh lại 10 nguồn tài liệu tham khảo (đặc biệt các nguồn năm 2025–2026) trước khi chốt.
  - **Tổng duyệt toàn bộ 20 slide** sau khi Đức và Dũng hoàn thành phần của mình, trước khi gửi Pull Request cuối lên Nhóm trưởng.

---

## 3. Quy tắc bắt buộc khi chỉnh sửa `slides-data.js`

1. **Chỉ chỉnh sửa bên trong thư mục `presentation/`:** không chạm vào `museum/`, `js/`, `assets/` hoặc các tệp ở thư mục gốc (`index.html`, `style.css`) — các tệp này thuộc Nhóm trưởng.
2. **Đúng 4 dòng trong `lines`, mỗi dòng đúng 1 ý:** Giao diện tự động đánh số thứ tự 1–4 trước mỗi dòng, vì vậy **không tự đánh số trong nội dung** (không viết "1. ...", "2–6. ..." bên trong dòng). Một số slide hiện tại đang vi phạm (ví dụ slide 15–16, 17, 19) và cần sửa lại trong đợt này.
3. **Đảm bảo nguyên tắc 1 màn hình không cuộn dọc trên PC:** khi sửa `desc` hoặc `fullHtml`, giữ câu chữ cô đọng để slide hiển thị trọn vẹn trên `1920x1080` và `1366x768`, không phát sinh thanh cuộn dọc.
4. **Giữ nguyên `id` của từng slide**, đặc biệt `r3-table` và `r3-verdict`, vì `presentation.js` dựa vào các `id` này để đổi bố cục lưới.
5. **Chỉ dùng các thẻ HTML đơn giản trong `fullHtml`:** `<h4>`, `<p>`, `<strong>`, `<em>`, `<ul>`, `<li>`, `<div class="pres-subcard ...">`. Luôn đóng thẻ đầy đủ — thẻ sai sẽ làm vỡ bố cục toàn slide.
6. **Không sửa số liệu, mốc thời gian hoặc nguồn tham khảo mà không kiểm tra lại**, vì đề tài có nhiều con số và năm cụ thể (GDP, tỷ lệ hộ nghèo, các văn kiện Đại hội).

---

## 4. Hướng dẫn Test & Quy trình phối hợp trên Git

### 4.1. Trước khi bắt đầu mỗi buổi làm việc

```bash
git checkout main
git pull origin main
```

### 4.2. Cách chạy thử bằng Live Server

- Nhấp chuột phải vào `presentation/index.html` trong VS Code, chọn **Open with Live Server**.
- Kiểm tra đúng slide của phòng mình bằng nút **Phòng 1/2/3** và menu chọn nhanh, dùng phím `ArrowLeft`, `ArrowRight`, `Space`.
- Mở DevTools (`F12` → tab **Console**) khi chuyển slide, đảm bảo không có lỗi JavaScript.

### 4.3. Quy trình nhánh, Commit và Pull Request

Mỗi người làm việc trên **nhánh riêng** để tránh ba người cùng sửa một nhánh:

```bash
git checkout -b feat/presentation-<ten>
# vi du: feat/presentation-duc, feat/presentation-dung, feat/presentation-duy
```

1. Kiểm tra chỉ có thay đổi trong `presentation/`:
   ```bash
   git status
   ```
2. Đưa đúng tệp đã sửa vào staging (không dùng `git add .`):
   ```bash
   git add presentation/slides-data.js
   ```
3. Commit rõ ràng, ghi rõ slide đã sửa:
   ```bash
   git commit -m "feat(presentation): cap nhat noi dung slide 1-8 phong 1"
   ```
4. Đẩy nhánh lên GitHub:
   ```bash
   git push -u origin feat/presentation-<ten>
   ```
5. Tạo Pull Request vào `main`, báo cho Duy rà soát trước khi Duy gộp và báo lại Nhóm trưởng.

**Thứ tự merge đề xuất:** Đức → Dũng → Duy, mỗi lần merge xong thì người tiếp theo chạy `git pull origin main` trước khi tiếp tục, để giảm xung đột trong `slides-data.js`.

---

## 5. Tiêu chuẩn nghiệm thu (Acceptance Criteria)

Trước khi Duy gửi Pull Request cuối cùng cho Nhóm trưởng, cần đạt đủ:

1. **Nội dung đầy đủ và chính xác:**
   - Đủ 20 slide thuộc 3 phòng, không thiếu, không trùng `id`.
   - Mỗi slide đúng 4 dòng luận điểm, không tự đánh số trong nội dung.
   - Số liệu, mốc thời gian và 10 nguồn tham khảo ở slide 20 đã được xác minh lại.
2. **Hiển thị chuẩn trên mọi thiết bị:**
   - Trên `1920x1080` và `1366x768`: toàn bộ 20 slide vừa khít 1 khung nhìn, không có thanh cuộn dọc.
   - Trên điện thoại (`390x844`): cuộn mượt, vuốt ngang chuyển slide hoạt động.
   - Bảng so sánh 6 tiêu chí (slide 17) hiển thị đúng bố cục mở rộng, không vỡ dòng.
3. **Không lỗi Console:** mở DevTools, chuyển qua lại cả 20 slide bằng phím và bằng menu chọn nhanh, không phát sinh lỗi JavaScript.
4. **Không xung đột tệp ngoài phạm vi:** `git diff` trên từng nhánh chỉ có thay đổi trong `presentation/`.
