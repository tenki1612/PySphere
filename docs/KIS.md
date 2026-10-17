# KIS - Knowledge & Implementation Summary (Tài liệu Tổng kết Dự án)

> **Dự án:** PySphere - Nền tảng tự học lập trình Python thực chiến và trực quan  
> **Vai trò:** Senior Full-Stack Developer & Cloud Architect  
> **Mã nguồn GitHub:** [https://github.com/tenki1612/PySphere](https://github.com/tenki1612/PySphere) (Nhánh: `main`)  
> **Cập nhật lần cuối:** 17/10/2026  

---

## 📌 1. TỔNG QUAN DỰ ÁN & KIẾN TRÚC HỆ THỐNG

PySphere là nền tảng e-learning tự học lập trình Python thực chiến với triết lý: **"Vừa học - vừa gõ code - vừa thấy kết quả ngay"** mà không cần cài đặt môi trường máy tính phức tạp.

### Kiến trúc phân tách độc lập (Decoupled Modular Architecture):
- **Client-side Execution Sandbox:** Chạy 100% Python trực tiếp trong trình duyệt người học bằng **Pyodide (WebAssembly)** chạy trong Web Worker đa luồng.
  - Ngăn ngừa hoàn toàn nguy cơ Remote Code Execution (RCE) trên server.
  - 0% chi phí tính toán CPU backend khi người dùng chạy code lặp lại.
  - Cơ chế Watchdog Timeout 10s tự động ngắt các vòng lặp vô tận.
- **Frontend Cloud:** Next.js 14+ (App Router, TypeScript, Tailwind CSS), Monaco Code Editor, Canvas 2D Algorithm Visualizer.
- **Backend Cloud:** FastAPI (Python), kiến trúc Clean Modular, xác thực bảo mật JWT, phân quyền vai trò (User vs Admin).
- **Database Cloud:** PostgreSQL với SQLAlchemy 2.0 AsyncIO, hỗ trợ fallback SQLite cho môi trường phát triển cục bộ.
- **Curriculum:** Lộ trình 60 ngày thực chiến chia 3 giai đoạn từ số 0 đến lập trình viên ứng dụng.

---

## 🛠️ 2. CÁC TÍNH NĂNG & NÂNG CẤP ĐÃ HOÀN THÀNH

### I. Đại tu Toàn diện Trang chủ & Bộ Khám phá Lộ trình 60 Ngày (Homepage & Curriculum Explorer)
- **Hero Section Hiện đại & Trực quan:**
  - Tích hợp **Interactive Live Code Sandbox** ngay trên Hero: Cho phép học viên gõ và chạy thử code Python mẫu trực tiếp trên trình duyệt mà không cần đăng nhập hay chuyển trang.
  - Hệ thống 4 thẻ chỉ số nổi bật: *60 Ngày Lộ trình*, *3 Giai đoạn chuyên sâu*, *Mô phỏng Canvas 2D*, và *0s Cài đặt môi trường*.
- **Ma trận Tính năng Bento Grid:**
  - 4 khối thẻ trực quan làm nổi bật giá trị cốt lõi: WebAssembly Sandbox an toàn, Mô phỏng Canvas 2D từng bước, Gamification & Streak, Chấm điểm tự động siêu tốc.
- **Bộ Khám phá Lộ trình 60 Ngày Đa năng (`Curriculum Explorer`):**
  - **Tabs Giai đoạn:** Lọc linh hoạt `Tất cả (60)`, `Giai đoạn 1: Nền tảng (01-20)`, `Giai đoạn 2: Hàm & Lỗi (21-40)`, `Giai đoạn 3: OOP & Web (41-60)`.
  - **Tìm kiếm Thời gian thực (Live Search):** Tìm tức thì theo số ngày, tên bài học, chuyên đề.
  - **Lọc bài tập Visualizer:** Nút chuyển đổi lọc riêng các bài học có tích hợp mô phỏng Canvas 2D.
  - **Lưới bài học (Curriculum Grid):** Mỗi thẻ bài học hiển thị rõ số ngày, huy hiệu Giai đoạn, thẻ `Visualizer 2D`, trạng thái hoàn thành và điểm thưởng XP.

---

### II. Nâng cấp Không gian Lập trình (Learn Workspace Ergonomics, Zen Mode & Cheatsheet)
- **Bộ điều hướng Nhanh 60 Ngày (Curriculum Navigator Modal):**
  - Bổ sung nút **"Lộ trình 60 Ngày"** trên thanh công cụ: Mở modal tra cứu toàn bộ 60 bài học với bộ lọc Giai đoạn và ô tìm kiếm nhanh, giúp học viên chuyển đổi bài học trong 1 click mà không cần quay lại trang chủ.
- **Sổ tay Tra cứu Cú pháp Nhanh (Python Quick Cheatsheet Modal):**
  - Nút **"Cú pháp"** trên thanh công cụ mở sổ tay tra cứu các cú pháp Python kinh điển: `print()`, `len()`, `range()`, `enumerate()`, định dạng `F-string`, các phương thức List/Dict, toán tử 3 ngôi, và xử lý ngoại lệ `try-except`.
  - Tích hợp nút **"Sao chép" (Copy)** kèm phản hồi trực quan giúp dán nhanh mã nguồn vào editor.
- **Chế độ Tập trung (Zen / Focus Mode):**
  - Nút **"Tập trung"** cho phép ẩn/hiện cột lý thuyết bên trái để mở rộng Monaco Editor và Console, tối ưu diện tích màn hình cho các bài tập dài.
- **Tùy chỉnh Kích thước Font chữ Editor:**
  - Cung cấp nút `A-` / `A+` (12px đến 22px) trực tiếp trên thanh tiêu đề Editor kèm lưu trữ `localStorage`.
- **Nút Xóa Đầu ra Console:**
  - Thêm nút **"Xóa output"** giúp làm sạch màn hình kết quả trước mỗi lần chạy thử nghiệm mới.

---

### III. Hệ thống Huy hiệu Thành tích & Cài đặt Cá nhân hóa (`/profile`)
- **Bảng Huy hiệu Thành tích (Achievements / Badges):**
  - 🌟 **Bước chân Đầu tiên:** Hoàn thành bài học Ngày 01.
  - 🔥 **Chiến binh Bền bỉ:** Duy trì chuỗi Streak học tập liên tục từ 3 ngày.
  - ⚡ **Tốc độ Thần tốc:** Nộp bài đạt chuẩn với thời gian thực thi dưới 50ms.
  - 🧠 **Bậc thầy Giải thuật:** Hoàn thành bài học có tích hợp Algorithm Visualizer 2D.
  - 💎 **Nhà thám hiểm Python:** Tích lũy đạt mốc 200 điểm kinh nghiệm XP.
  - 🏆 **Kỹ sư Nền tảng:** Chinh phục trọn vẹn 20 bài học Giai đoạn 1.
  - Trạng thái trực quan: Huy hiệu phát sáng khi mở khóa kèm thanh phần trăm tiến độ cụ thể.
- **Bảng Cài đặt Cá nhân hóa Học tập (Learning Preferences):**
  - Cỡ chữ Editor mặc định (12px, 14px, 16px, 18px).
  - Bật/tắt hiệu ứng pháo hoa chúc mừng Confetti.
  - Cấu hình tần suất tự động đồng bộ bản nháp lên Cloud (1.5s, 3.0s, hoặc Thủ công).

---

### IV. Khắc phục Toàn diện Giao diện Sáng / Tối (Full Light & Dark Theme Overhaul)
- **Sửa triệt để Root Layout & Body:** Sử dụng biến hệ thống chuẩn `bg-background text-foreground transition-colors`, giúp khi chuyển sang Giao diện Sáng (Light Mode), **toàn bộ 100% trang web chuyển sang nền sáng thanh lịch (`#f8fafc`) và chữ tối tương phản cao (`#0f172a`)**.
- **Thanh cuộn thông minh (Adaptive Scrollbars):** Tự động chuyển đổi màu track và thumb theo Light/Dark mode.
- **Thích ứng Sáng / Tối cho Algorithm Visualizer (Canvas 2D):** Nền Canvas chuyển `#f8fafc` (Sáng) / `#111827` (Tối), chữ giá trị số cột chuyển `#0f172a` (Sáng) / `#ffffff` (Tối).

---

### V. Mở rộng Bộ mô phỏng Thuật toán: Tìm kiếm & Sắp xếp (Search & Sort Visualizer)
- **Thuật toán Sắp xếp (Sorting):** Bubble Sort, Selection Sort, và **Insertion Sort (Sắp xếp chèn)**.
- **Thuật toán Tìm kiếm (Searching):**
  - **Linear Search (Tìm kiếm tuyến tính):** Quét tuần tự và đổi màu phần tử.
  - **Binary Search (Tìm kiếm nhị phân):** Tự động sắp xếp mảng, hiển thị con trỏ trực quan `LEFT`, `MID`, `RIGHT` ngay trên đầu các cột Canvas và làm mờ các phần tử nằm ngoài khoảng xét.
  - **Bộ điều khiển Tìm kiếm:** Cho phép nhập giá trị mục tiêu (Target) để tìm kiếm trực tiếp trên Canvas 2D.

---

### VI. Làm giàu Chương trình Học tập: Ngày 01 & Ngày 02
- **Ngày 01:** Lý thuyết cú pháp Python đầy đủ (print, indentation 4 spaces, comments, PEP 8 snake_case, kiểu dữ liệu, ép kiểu).
- **Ngày 02:** Lý thuyết toàn diện về 5 nhóm toán tử, thứ tự ưu tiên **PEMDAS**, bài tập tính chiết khấu `calculate_discounted_price` có ưu đãi VIP và làm tròn số.

---

### VII. Thiết lập Bộ Skill Dự án (`.agents/skills/pysphere-dev/SKILL.md`)
- Đã khởi tạo và đưa vào quản lý phiên bản bộ skill chuẩn hóa toàn bộ kiến trúc, tiêu chuẩn bài giảng 60 ngày, và quy trình kiểm thử bắt buộc cho dự án PySphere.

---

## 🔍 3. KẾT QUẢ KIỂM THỬ & CHẤT LƯỢNG (EVIDENCE)

### Kiểm thử Backend (Pytest):
```text
============================= test session starts =============================
platform win32 -- Python 3.14.8, pytest-9.1.1, pluggy-1.7.0 -- D:\PySphere\backend\.venv\Scripts\python.exe
cachedir: .pytest_cache
rootdir: D:\PySphere\backend
configfile: pytest.ini
testpaths: tests
plugins: anyio-4.15.1, asyncio-1.4.0
asyncio: mode=Mode.AUTO, debug=False, asyncio_default_fixture_loop_scope=None, asyncio_default_test_loop_scope=function
collecting ... collected 8 items

tests/test_auth_api.py::test_register_and_login_flow PASSED              [ 12%]
tests/test_auth_api.py::test_admin_user_role PASSED                      [ 25%]
tests/test_health.py::test_health_check PASSED                           [ 37%]
tests/test_lessons_api.py::test_lessons_and_progress_flow PASSED         [ 50%]
tests/test_lessons_api.py::test_create_lesson_requires_superuser PASSED  [ 62%]
tests/test_lessons_api.py::test_submit_nonexistent_lesson_returns_404 PASSED [ 75%]
tests/test_streak_updated_on_repeat_submission_yesterday PASSED [ 87%]
tests/test_seed.py::test_seed_and_fetch_lessons PASSED                   [100%]

============================== 8 passed in 3.82s ==============================
```
- **8/8 test suites đạt 100% PASS**.

### Kiểm thử Frontend (ESLint & Next.js Build):
- **ESLint:** `npm run lint` -> `✔ No ESLint warnings or errors`.
- **Next.js Production Build:** `npm run build` -> Biên dịch thành công 100% 7 routes tĩnh & SSR với kích thước bundle tối ưu:
  - `/` (Trang chủ & Lộ trình 60 ngày - 8.09 kB)
  - `/_not-found` (Trang 404 tùy biến)
  - `/learn/[day]` (Không gian thực hành đa khung giao diện - 27 kB)
  - `/login` (Đăng nhập tài khoản)
  - `/profile` (Hồ sơ học viên & Tiến độ học tập - 10.2 kB)
  - `/register` (Đăng ký tài khoản)

---

## 🚀 4. HƯỚNG DẪN KHỞI CHẠY (QUICK START)

### Cách 1: Docker Compose (Khuyên dùng)
```bash
docker compose up --build
```
- Frontend: `http://localhost:3000`
- Hồ sơ học viên: `http://localhost:3000/profile`
- Workspace Thực hành: `http://localhost:3000/learn/1`
- Đăng nhập: `http://localhost:3000/login`
- Đăng ký: `http://localhost:3000/register`
- Backend API Docs (Swagger): `http://localhost:8000/docs`

### Cách 2: Chạy trực tiếp (Local Development)
**Backend:**
```powershell
cd backend
.venv\Scripts\activate
uvicorn app.main:app --reload --port 8000
```

**Frontend:**
```powershell
cd frontend
npm run dev
```
Truy cập trình duyệt tại `http://localhost:3000`.
