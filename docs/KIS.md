# KIS - Knowledge & Implementation Summary (Tài liệu Tổng kết Dự án)

> **Dự án:** PySphere - Nền tảng tự học lập trình Python thực chiến và trực quan  
> **Vai trò:** Senior Full-Stack Developer & Cloud Architect  
> **Mã nguồn GitHub:** [https://github.com/tenki1612/PySphere](https://github.com/tenki1612/PySphere) (Nhánh: `main`)  
> **Cập nhật lần cuối:** 16/10/2026  

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

### I. Xác thực Người dùng & Phân quyền Vai trò (User vs Admin Role-Based Access)
- **Cơ sở dữ liệu & API Backend:**
  - Thêm trường `is_superuser` và computed property `role` ("admin" nếu `is_superuser == True`, ngược lại "user") trong schema `UserResponse`.
  - Endpoint `/api/v1/auth/me` trả về đầy đủ vai trò của người dùng.
  - Bảo vệ API tạo bài học mới (`POST /api/v1/lessons`), yêu cầu quyền `is_superuser` (trả về 403 Forbidden nếu không đủ quyền).
- **Trang Đăng nhập & Đăng ký chuyên dụng:**
  - `frontend/src/app/login/page.tsx`: Giao diện đăng nhập hiện đại, xử lý query parameter `redirect` để tự động quay lại bài học đang làm, bọc `<Suspense>` chuẩn Next.js App Router.
  - `frontend/src/app/register/page.tsx`: Giao diện đăng ký học viên mới, tạo JWT token và điều hướng trực tiếp.
- **Auth Gate tại Không gian Thực hành (`/learn/[day]`):**
  - Người dùng chưa đăng nhập sẽ thấy màn hình Auth Guard che phủ khung soạn thảo với các nút điều hướng "Đăng nhập ngay" và "Đăng ký tài khoản".
  - Chặn các thao tác "Chạy code", "Nộp bài", và đồng bộ bản nháp nếu chưa xác thực, tự động điều hướng sang trang login.
- **Phân quyền Admin trong Giao diện:**
  - Navbar hiển thị huy hiệu phân quyền: **Admin** (tím) hoặc **Học viên** (xanh ngọc) cùng avatar và nút Đăng xuất.
  - Chế độ Admin tại trang học tập hiển thị nút **"Đáp án (Admin)"**, cho phép Quản trị viên xem trước giải pháp mẫu (`solution_code`) mà không cần nộp bài hoàn thành trước.

---

### II. Làm giàu Nội dung Ngày 01: Cú pháp Cơ bản Python
Nội dung bài học `curriculum/stage_1_basics/day_01_variables/README.md` được bổ sung chi tiết:
1. **Lệnh in và xuất dữ liệu (`print`)**: Cú pháp gọi hàm `print()`, in chuỗi ký tự, số nguyên, biểu thức toán học.
2. **Quy tắc Thụt lề (Indentation)**: Giải thích cấu trúc khối lệnh bằng 4 khoảng trắng (4 spaces chuẩn PEP 8) thay vì ngoặc nhọn `{}`.
3. **Chú thích mã nguồn (Comments)**: Chú thích đơn dòng `#` và Docstrings đa dòng `"""..."""`.
4. **Khai báo Biến & Quy ước đặt tên**: Dynamic Typing, quy tắc đặt tên biến chuẩn PEP 8 (`snake_case`), tính phân biệt hoa/thường (Case-sensitive), các từ khóa cấm.
5. **4 Kiểu Dữ liệu Nguyên thủy**: `int`, `float`, `str`, `bool` và hàm kiểm tra `type()`.
6. **Ép kiểu dữ liệu (Type Casting)**: `int()`, `float()`, `str()`, `bool()` và bài toán chuyển đổi dữ liệu đầu vào.
7. **Bộ bài tập & Test Cases chuẩn**: Đề bài hàm `format_user_profile` kiểm tra toàn diện khả năng ép kiểu, chuỗi định dạng và kiểm tra logic boolean.

---

### III. Trực quan hóa Thuật toán Theo Điều kiện Bài học (Conditional Visualizer)
- Trước đây, tab "Algorithm Visualizer" luôn xuất hiện ở mọi bài học dù bài học đó không liên quan đến giải thuật trực quan.
- **Nâng cấp:**
  - Thêm trường `has_visualizer: bool` và `visualizer_type: Optional[str]` vào CSDL (`Lesson`), Pydantic schemas (`LessonResponse`, `LessonListItem`), và script Seeder (`seed.py`).
  - Phân loại rõ: Chỉ những bài học về vòng lặp, duyệt mảng, sắp xếp, tìm kiếm, đệ quy (như Ngày 5, 6, 15, 17, 19, 20, 30, 50) mới kích hoạt `has_visualizer = True`.
  - Các bài lý thuyết cơ bản (như Ngày 01, 02) có `has_visualizer = False`.
  - Giao diện `/learn/[day]` tự động kiểm tra `lesson.has_visualizer`: Nếu là `false`, tab "Algorithm Visualizer" sẽ được ẩn hoàn toàn, tập trung 100% không gian hiển thị cho **Console & Kết quả Chấm điểm**.

---

### IV. Chuyển đổi Giao diện Tối / Sáng (Dark / Light Theme Switcher)
- **Quản lý State & Lưu trữ:**
  - Trạng thái giao diện (`theme: "dark" | "light"`) được lưu trong Zustand store `useLessonStore` và đồng bộ vào `localStorage` (`pysphere_theme`).
  - Thẻ `<html>` tự động toggle class `.dark`.
- **Nút chuyển Theme tại Navbar:**
  - Nút biểu tượng Mặt trời (Sun) / Mặt trăng (Moon) chuyển đổi mượt mà 1-click.
- **Thích ứng Động cho Monaco Editor:**
  - Monaco Editor tự động đổi theme `vs-dark` khi ở chế độ Dark và `light` khi ở chế độ Light.
- **Biến CSS & Bảng màu Toàn diện:**
  - Cấu hình biến CSS `--background`, `--foreground` trong `globals.css` cho cả `:root` và `.dark`.
  - Cập nhật toàn bộ các trang (`/`, `/login`, `/register`, `/learn/[day]`, `Navbar`) hỗ trợ đầy đủ class Tailwind cả chế độ sáng (nền trắng/xám nhạt, chữ tối tương phản cao) và chế độ tối (nền đen/xám đậm, chữ sáng dịu mắt).

---

## 🔍 3. KẾT QUẢ KIỂM THỬ & CHẤT LƯỢNG (EVIDENCE)

### Kiểm thử Backend (Pytest):
```text
============================= test session starts =============================
tests/test_auth_api.py::test_register_and_login_flow PASSED              [ 12%]
tests/test_auth_api.py::test_admin_user_role PASSED                      [ 25%]
tests/test_health.py::test_health_check PASSED                           [ 37%]
tests/test_lessons_api.py::test_lessons_and_progress_flow PASSED         [ 50%]
tests/test_lessons_api.py::test_create_lesson_requires_superuser PASSED  [ 62%]
tests/test_lessons_api.py::test_submit_nonexistent_lesson_returns_404 PASSED [ 75%]
tests/test_lessons_api.py::test_streak_updated_on_repeat_submission_yesterday PASSED [ 87%]
tests/test_seed.py::test_seed_and_fetch_lessons PASSED                   [100%]
============================== 8 passed in 3.31s ==============================
```
- **8/8 test suites đạt 100% PASS**.

### Kiểm thử Frontend (ESLint & Next.js Build):
- **ESLint:** `npm run lint` -> `✔ No ESLint warnings or errors`.
- **Next.js Production Build:** `npm run build` -> Biên dịch thành công 100% 6 routes:
  - `/` (Static)
  - `/_not-found` (Static)
  - `/learn/[day]` (Dynamic SSR)
  - `/login` (Static với Suspense boundary)
  - `/register` (Static với Suspense boundary)

---

## 🚀 4. HƯỚNG DẪN KHỞI CHẠY (QUICK START)

### Cách 1: Docker Compose (Khuyên dùng)
```bash
docker compose up --build
```
- Frontend: `http://localhost:3000`
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
