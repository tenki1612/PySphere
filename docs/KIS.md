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

### II. Nâng cấp Bộ hiển thị Bài giảng Markdown Chuyên nghiệp (`MarkdownViewer`)
- Xây dựng component `frontend/src/components/curriculum/MarkdownViewer.tsx`:
  - Phân tích và render chuẩn các cấp tiêu đề (`#`, `##`, `###`) với màu sắc nhận diện PySphere (Emerald).
  - Khối mã nguồn (Code fences) hiển thị chuyên nghiệp với syntax highlight nền tối và nút **"Sao chép" (Copy)** tiện lợi.
  - Các phần tử danh sách gạch đầu dòng, danh sách đánh số, trích dẫn (Blockquotes) và inline code badge đều tự động chuyển đổi màu sắc hài hòa theo chế độ Sáng / Tối.

---

### III. Mở rộng Bộ mô phỏng Thuật toán: Bổ sung Insertion Sort (Sắp xếp chèn)
- Mở rộng `AlgorithmVisualizer`:
  - Ngoài Bubble Sort và Selection Sort, đã triển khai hoàn chỉnh thuật toán **Insertion Sort (Sắp xếp chèn)**.
  - Sinh chuỗi các bước mô phỏng chi tiết: Chọn phần tử `key`, so sánh với các phần tử trong đoạn đã sắp xếp, dịch chuyển phần tử lớn hơn sang phải, và chèn `key` vào vị trí chính xác.
  - Cho phép người học quan sát trực quan sự khác biệt về số phép so sánh/dịch chuyển giữa 3 thuật toán sắp xếp kinh điển.

---

### IV. Tính năng Lịch sử Nộp bài (Submission History Modal)
- Bổ sung hàm API `getSubmissionHistory(lessonId)` trong `frontend/src/lib/api.ts`.
- Thêm nút **"Lịch sử"** trên thanh công cụ của Workspace làm bài:
  - Hiển thị danh sách các lần nộp bài trước đó của học viên kèm trạng thái ĐẠT (xanh) / CHƯA ĐẠT (đỏ), số lượng test vượt qua, thời gian thực thi (ms) và mốc thời gian chi tiết.
  - Tích hợp nút **"Nạp mã nguồn lần nộp này vào Editor"** giúp học viên nhanh chóng khôi phục lại giải pháp đã nộp trước đó chỉ với 1 click.

---

### V. Các Tính năng Đã Hoàn thành Trước đó:
- **Xác thực & Phân quyền User / Admin:** Trang `/login`, `/register`, Auth Guard bảo vệ workspace, huy hiệu Admin và tính năng xem đáp án mẫu (`solution_code`) cho Admin.
- **Làm giàu Ngày 01:** Lý thuyết cú pháp Python đầy đủ (print, indentation 4 spaces, comments, PEP 8 snake_case, kiểu dữ liệu, ép kiểu).
- **Conditional Visualizer:** Tự động ẩn tab visualizer ở các bài học cơ bản, chỉ hiển thị ở bài học giải thuật (loops, arrays, sorting, recursion).

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
tests/test_streak_updated_on_repeat_submission_yesterday PASSED [ 87%]
tests/test_seed.py::test_seed_and_fetch_lessons PASSED                   [100%]
============================== 8 passed in 5.37s ==============================
```
- **8/8 test suites đạt 100% PASS**.

### Kiểm thử Frontend (ESLint & Next.js Build):
- **ESLint:** `npm run lint` -> `✔ No ESLint warnings or errors`.
- **Next.js Production Build:** `npm run build` -> Biên dịch thành công 100% 6 routes tĩnh & SSR với kích thước tối ưu.

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
