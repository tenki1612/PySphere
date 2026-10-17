# Kế hoạch Triển khai: Toàn diện UX/UI & Nâng cấp Tính năng PySphere

> **Dành cho Agentic Workers:** REQUIRED SUB-SKILL: Sử dụng superpowers:executing-plans để triển khai kế hoạch này theo từng task. Các bước sử dụng cú pháp checkbox (`- [ ]`) để theo dõi.

---

## 🎯 Mục tiêu Dự án
Thực hiện cuộc đại tu toàn diện UX/UI và bổ sung các tính năng đột phá trên toàn bộ nền tảng PySphere theo yêu cầu người dùng:
1. **Trang chủ & Bộ khám phá Lộ trình 60 ngày (Homepage & Curriculum Explorer Revamp):**
   - Hero tương tác có sandbox chạy thử code Python mẫu trực tiếp.
   - Bộ tìm kiếm và lọc thời gian thực toàn bộ 60 ngày học theo Stage, từ khóa, và bài có mô phỏng Visualizer.
   - Ma trận tính năng "Tại sao chọn PySphere" (Bento grid).
2. **Không gian Thực hành Lập trình (Learn Workspace Ergonomics & UX/UI Overhaul):**
   - Modal/Drawer "Lộ trình 60 ngày" (Quick Curriculum Navigator) giúp chuyển bài nhanh trong 1 click.
   - Sổ tay tra cứu cú pháp nhanh (Python Quick Cheatsheet Drawer).
   - Tùy chỉnh kích thước font chữ Monaco Editor (12px, 14px, 16px, 18px).
   - Chế độ Tập trung (Zen / Focus Mode) mở rộng trình soạn thảo toàn màn hình.
3. **Hệ thống Huy hiệu Thành tích & Gamification Nâng cao (`/profile`):**
   - 6 huy hiệu thành tích (Achievements) với trạng thái Đã mở khóa / Đang thực hiện.
   - Bảng cài đặt cá nhân hóa học tập (Preferences) lưu cấu hình LocalStorage.
4. **Kiểm thử chất lượng, Cập nhật tài liệu KIS & Git Push:**
   - 100% green tests backend & frontend build.
   - Cập nhật `docs/KIS.md` và push GitHub `origin main`.

---

## 📋 Danh sách Task Triển khai

### Task 1: Đại tu Trang chủ & Bộ khám phá Lộ trình 60 Ngày (`frontend/src/app/page.tsx`)
- [ ] **Bước 1.1:** Tích hợp Hero Section hiện đại với thẻ demo code tương tác (Live Preview Card) chạy thử mã Python trực tiếp trên trình duyệt.
- [ ] **Bước 1.2:** Xây dựng thanh công cụ tìm kiếm và bộ lọc đa năng:
  - Ô tìm kiếm theo số ngày, tên bài, chủ đề.
  - Tabs phân loại theo 3 giai đoạn: `Tất cả (60)`, `Giai đoạn 1 (1-20)`, `Giai đoạn 2 (21-40)`, `Giai đoạn 3 (41-60)`.
  - Nút lọc "Chỉ bài có Visualizer Canvas".
- [ ] **Bước 1.3:** Hiển thị lưới bài học (Curriculum Grid) thiết kế theo thẻ hiện đại với huy hiệu Stage, trạng thái Hoàn thành, thẻ `Visualizer 2D` và điểm XP.
- [ ] **Bước 1.4:** Bổ sung Bento Grid giới thiệu các ưu thế cốt lõi của PySphere (Zero-server WebAssembly, Canvas 2D Step-by-Step, Chấm điểm tức thì, Gamification).
- [ ] **Bước 1.5:** Kiểm tra độ tương thích Sáng / Tối trên trang chủ và chạy `npm run lint`.

### Task 2: Nâng cấp Không gian Thực hành Lập trình (`frontend/src/app/learn/[day]/page.tsx` & `MonacoEditor.tsx`)
- [ ] **Bước 2.1:** Cập nhật `MonacoEditor.tsx` hỗ trợ prop `fontSize` linh hoạt (12, 14, 16, 18px).
- [ ] **Bước 2.2:** Xây dựng **Curriculum Navigator Drawer/Modal** trong Workspace:
  - Cho phép học viên mở danh sách 60 ngày học bất kỳ lúc nào mà không cần thoát trang.
  - Hiển thị trực quan trạng thái hoàn thành và chuyển bài với 1 click.
- [ ] **Bước 2.3:** Xây dựng **Python Quick Cheatsheet Panel** tích hợp sẵn:
  - Tra cứu nhanh cú pháp các hàm cơ bản (`print`, `len`, `range`, `enumerate`, `int/float/str`), cấu trúc điều khiển, và các phương thức List/Dict phổ biến.
- [ ] **Bước 2.4:** Thêm nút chuyển đổi **Chế độ Tập trung (Zen / Focus Mode)**:
  - Cho phép ẩn/hiện cột lý thuyết bên trái để mở rộng Monaco Editor và Console.
- [ ] **Bước 2.5:** Thêm bộ chọn cỡ chữ Editor (`A-` / `A+`) lưu trữ cấu hình vào LocalStorage.

### Task 3: Hệ thống Huy hiệu Thành tích & Cài đặt Cá nhân hóa (`frontend/src/app/profile/page.tsx`)
- [ ] **Bước 3.1:** Thiết kế và tích hợp Hệ thống 6 Huy hiệu Thành tích (Achievements / Badges):
  1. *Bước chân Đầu tiên*: Hoàn thành Ngày 01.
  2. *Chiến binh Bền bỉ*: Đạt chuỗi Streak >= 3 ngày.
  3. *Tốc độ Thần tốc*: Bài nộp đạt kết quả với thời gian dưới 50ms.
  4. *Bậc thầy Giải thuật*: Hoàn thành bài học có Algorithm Visualizer.
  5. *Nhà thám hiểm Python*: Tích lũy trên 200 XP.
  6. *Kỹ sư Xuất sắc*: Vượt qua toàn bộ bài học Giai đoạn 1.
- [ ] **Bước 3.2:** Tích hợp Bảng Tùy chỉnh (Learning Preferences):
  - Kích thước font mặc định của Editor.
  - Bật/tắt hiệu ứng pháo hoa Confetti chúc mừng.
  - Tự động lưu nháp.

### Task 4: Kiểm thử, Cập nhật Tài liệu KIS & Đồng bộ Git
- [ ] **Bước 4.1:** Chạy kiểm thử Backend (`pytest -v`) đảm bảo 8/8 tests pass.
- [ ] **Bước 4.2:** Chạy kiểm thử Frontend (`npm run lint` & `npm run build`) đảm bảo 0 lỗi.
- [ ] **Bước 4.3:** Cập nhật tài liệu [docs/KIS.md](file:///d:/PySphere/docs/KIS.md).
- [ ] **Bước 4.4:** Commit và push toàn bộ lên GitHub `origin main`.
