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

### I. Khắc phục Toàn diện Giao diện Sáng / Tối (Full Light & Dark Theme Overhaul)
- **Sửa triệt để Root Layout & Body:**
  - Loại bỏ hoàn toàn class cố định nền tối `bg-brand-darker text-gray-200` tại thẻ `<body>` trong `frontend/src/app/layout.tsx`.
  - Chuyển sang sử dụng biến hệ thống chuẩn `bg-background text-foreground transition-colors`, giúp khi chuyển sang Giao diện Sáng (Light Mode), **toàn bộ 100% trang web chuyển sang nền sáng thanh lịch (`#f8fafc`) và chữ tối tương phản cao (`#0f172a`)**.
- **Thanh cuộn thông minh (Adaptive Scrollbars):**
  - Cập nhật `globals.css` để thanh cuộn tự động đổi màu: Ở Light Mode, track nền màu xám sáng (`#f1f5f9`), thumb màu xám nhạt (`#cbd5e1`); ở Dark Mode, track màu tối (`#161b22`) và thumb (`#30363d`).
- **Thích ứng Sáng / Tối cho Algorithm Visualizer (Canvas 2D):**
  - Đồng bộ `theme` từ Zustand store `useLessonStore`.
  - Khi ở chế độ Sáng:
    - Nền Canvas chuyển sang `#f8fafc` (thay vì cố định đen `#111827`).
    - Giá trị số trên các cột chuyển sang chữ đen đậm `#0f172a` (rõ nét, không bị chìm).
    - Chỉ số mảng bên dưới chuyển sang `#64748b`.
    - Thẻ chứa, hộp chọn thuật toán, nút đổi mảng, thanh trượt tốc độ và chú thích đều hỗ trợ đầy đủ bộ màu sáng/tối.
- **Thích ứng Workspace Học tập (`/learn/[day]`):**
  - Khung lý thuyết bài giảng, khung bài tập, bảng kết quả và modal xác thực đều chuyển nền trắng sáng (`bg-white`) kèm màu chữ đen than (`text-slate-900`) chuẩn công thái học thị giác.

---

### II. Trang Hồ sơ & Tiến độ Học tập (`/profile`)
- **Xây dựng Dashboard Cá nhân hóa toàn diện tại `frontend/src/app/profile/page.tsx`:**
  - **Thông tin Học viên & Huy hiệu Vai trò:** Hiển thị tên, email, ngày tham gia và huy hiệu `Quản trị viên (Admin)` hoặc `Học viên (Member)`.
  - **Hệ thống Cấp độ Gamification (XP Level Progression):** Tính toán cấp độ (Level 1 đến Level 5 - Bậc thầy Python) cùng thanh tiến trình phần trăm kinh nghiệm đến cấp tiếp theo.
  - **Thẻ Chỉ số Nổi bật (Metric Cards):**
    - Chuỗi ngày học liên tục (Streak Counter) kèm biểu tượng ngọn lửa rực rỡ.
    - Tổng điểm kinh nghiệm tích lũy (Total XP).
    - Tỷ lệ hoàn thành lộ trình 60 ngày.
  - **Phân rã Tiến độ theo 3 Giai đoạn (Stage Breakdown):**
    - *Giai đoạn 1: Nền tảng Python (Ngày 1 - 20)*
    - *Giai đoạn 2: Hàm, Module & Xử lý lỗi (Ngày 21 - 40)*
    - *Giai đoạn 3: OOP & Ứng dụng Web (Ngày 41 - 60)*
  - **Bảng Lịch sử Nộp bài Toàn diện (Submissions Activity):**
    - Hỗ trợ lọc nhanh theo trạng thái: "Tất cả", "Đạt" (Passed) và "Chưa đạt" (Failed).
    - Hiển thị ngày nộp, bài học, thời gian thực thi (ms), số test case vượt qua và nút 1-click **"Đến bài học"** giúp quay lại ôn tập ngay lập tức.
  - **Tích hợp Điều hướng:** Bổ sung mục "Hồ sơ & Tiến độ" trên thanh điều hướng `Navbar` và biến avatar người dùng thành liên kết trực tiếp vào trang hồ sơ.

---

### III. Mở rộng Bộ mô phỏng Thuật toán: Tìm kiếm & Sắp xếp (Search & Sort Visualizer)
- **Bổ sung Thuật toán Sắp xếp (Sorting):**
  - Bubble Sort (Sắp xếp nổi bọt).
  - Selection Sort (Sắp xếp chọn).
  - **Insertion Sort (Sắp xếp chèn):** Mô phỏng chi tiết việc lấy `key`, so sánh lùi và chèn vào vị trí chính xác.
- **Bổ sung Thuật toán Tìm kiếm (Searching):**
  - **Linear Search (Tìm kiếm tuyến tính):** Quét tuần tự từng phần tử từ trái sang phải, làm nổi bật phần tử đang xét và đánh dấu thành công (xanh) hoặc thất bại nếu không tìm thấy.
  - **Binary Search (Tìm kiếm nhị phân):**
    - Tự động sắp xếp mảng tăng dần trước khi thực hiện.
    - Hiển thị con trỏ trực quan `LEFT`, `MID`, `RIGHT` với huy hiệu nổi trên đầu các cột trên Canvas 2D.
    - Tự động làm mờ (dimmed) các phần tử nằm ngoài phạm vi tìm kiếm sau mỗi bước chia đôi khoảng.
  - **Bộ điều khiển Tìm kiếm:** Cho phép người học tự nhập giá trị mục tiêu (Target) để tìm kiếm trực tiếp trên mảng trực quan.

---

### IV. Công thái học Lập trình tại Không gian Làm việc (Workspace Ergonomics)
- **Phím tắt Bàn phím Chuyên nghiệp:**
  - `Ctrl + Enter` (hoặc `Cmd + Enter` trên macOS): Chạy mã nguồn Python ngay lập tức qua Pyodide WebAssembly.
  - `Ctrl + S` (hoặc `Cmd + S` trên macOS): Lưu nháp thủ công vào cơ sở dữ liệu và LocalStorage, ngăn chặn việc mở menu lưu mặc định của trình duyệt và hiển thị huy hiệu `Đã lưu nháp!` tức thì.
- **Tính năng Tải Mã nguồn (.py):**
  - Bổ sung nút **"Tải .py"** trên thanh công cụ Workspace.
  - Tự động xuất file mã nguồn Python chuẩn UTF-8 (`day_XX_solution.py`) về máy tính người dùng chỉ với 1 click.
- **Nâng cấp Hiển thị Markdown (`MarkdownViewer`):**
  - Render chuẩn xác các cấp tiêu đề (`#`, `##`, `###`), danh sách, khối chú thích (Blockquotes), và inline code badge.
  - Syntax highlighting cho các khối code kèm nút **"Sao chép" (Copy)** tiện lợi.
- **Tính năng Lịch sử Nộp bài (Submission History Modal):**
  - Nút **"Lịch sử"** mở danh sách các lần nộp bài của bài học hiện tại kèm nút **"Nạp mã nguồn lần nộp này vào Editor"**.

---

### V. Làm giàu Chương trình Học tập: Ngày 01 & Ngày 02
- **Ngày 01: Biến số, Kiểu dữ liệu & Cú pháp cơ bản:**
  - Lý thuyết chi tiết về hàm `print()`, thụt đầu dòng (Indentation 4 spaces), chú thích (Comments), quy chuẩn đặt tên PEP 8 (`snake_case`), các kiểu dữ liệu nguyên thủy (`int`, `float`, `str`, `bool`) và kỹ thuật ép kiểu (Type Casting).
- **Ngày 02: Toán tử & Biểu thức (Operators & Expressions):**
  - Phân tích chi tiết 5 nhóm toán tử: Toán tử số học (`+`, `-`, `*`, `/`, `//`, `%`, `**`), toán tử gán, toán tử so sánh, toán tử logic (`and`, `or`, `not` kèm cơ chế Short-circuit evaluation), và toán tử thành viên (`in`, `not in`).
  - Quy tắc thứ tự ưu tiên toán học **PEMDAS**.
  - Đề bài thực hành tính tiền chiết khấu thương mại điện tử `calculate_discounted_price` có ưu đãi VIP, kèm bộ test case và lời giải mẫu.

---

### VI. Xác thực & Phân quyền Bảo mật (Role-Based Access Control)
- Đăng ký tài khoản (`/register`), Đăng nhập nhận JWT (`/login`).
- Phân quyền rõ ràng giữa `Học viên (User)` và `Quản trị viên (Admin)`.
- Auth Guard bảo vệ workspace và trình biên tập mã: Người dùng chưa đăng nhập sẽ nhận thông báo mời đăng nhập/đăng ký.
- Quản trị viên (Admin) có huy hiệu Admin và quyền xem trước mã giải mẫu (`solution_code`).

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

============================== 8 passed in 2.90s ==============================
```
- **8/8 test suites đạt 100% PASS**.

### Kiểm thử Frontend (ESLint & Next.js Build):
- **ESLint:** `npm run lint` -> `✔ No ESLint warnings or errors`.
- **Next.js Production Build:** `npm run build` -> Biên dịch thành công 100% 7 routes tĩnh & SSR với kích thước bundle tối ưu:
  - `/` (Trang chủ & Lộ trình 60 ngày)
  - `/_not-found` (Trang 404 tùy biến)
  - `/learn/[day]` (Không gian thực hành đa khung giao diện)
  - `/login` (Đăng nhập tài khoản)
  - `/profile` (Hồ sơ học viên & Tiến độ học tập)
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
