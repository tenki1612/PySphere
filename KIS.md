# KIS - Knowledge & Implementation Summary (Tài liệu Tổng kết Phiên làm việc)

> **Dự án:** PySphere - Nền tảng tự học lập trình Python thực chiến và trực quan  
> **Vai trò:** Senior Full-Stack Developer & Cloud Architect  
> **Mã nguồn GitHub:** [https://github.com/tenki1612/PySphere](https://github.com/tenki1612/PySphere) (Nhánh: `main`)  
> **Ngày thực hiện:** 16/10/2026  

---

## 📌 1. TỔNG QUAN MỤC TIÊU PHIÊN LÀM VIỆC

Phiên làm việc tập trung giải quyết bài toán: **Xây dựng hoàn chỉnh bộ khung (scaffolding) và kiến trúc nền tảng cho hệ thống PySphere** theo mô hình phân tách độc lập (Decoupled Modular Architecture):
- **Client-side Execution:** Biên dịch và chạy mã Python 100% trong trình duyệt qua **Pyodide (WebAssembly)** chạy trên nền **Web Worker**, đảm bảo 0% chi phí CPU server và triệt tiêu nguy cơ RCE.
- **Frontend Cloud:** Next.js 14+ (App Router, TypeScript, Tailwind CSS), Monaco Editor và Algorithm Visualizer (Canvas 2D).
- **Backend Cloud:** FastAPI (Python), kiến trúc hướng module (Auth, Lessons, Progress, Submissions), bảo mật JWT.
- **Database Cloud:** PostgreSQL với SQLAlchemy 2.0 AsyncIO, hỗ trợ fallback SQLite cho môi trường dev cục bộ.
- **Curriculum:** Thiết kế và sinh toàn bộ cấu trúc bài học 60 ngày thực chiến chia làm 3 giai đoạn.

---

## 🛠️ 2. CHI TIẾT CÁC CÔNG VIỆC ĐÃ HOÀN THÀNH

### I. Khởi tạo Dự án & Hạ tầng DevOps
- [x] Khởi tạo Git repository và cấu hình `.gitignore` chuẩn cho Node.js, Python, Next.js và Database.
- [x] Soạn thảo `docker-compose.yml` điều phối 3 dịch vụ container:
  - `db`: PostgreSQL 16 Alpine với volume lưu trữ bền vững `pgdata`.
  - `backend`: FastAPI Python 3.11 container kết nối Postgres qua mạng nội bộ.
  - `frontend`: Next.js production container (`node:20-alpine`, build `standalone`).
- [x] Cấu hình mẫu biến môi trường `.env.example` và tài liệu hướng dẫn tổng quan `README.md`.
- [x] Thiết lập GitHub Actions CI/CD (`.github/workflows/ci.yml`) tự động chạy test Backend và kiểm tra build Frontend trên mọi Pull Request / Push.

### II. Tài liệu Thiết kế Hệ thống & Sơ đồ PlantUML
Tạo bộ tài liệu đặc tả kiến trúc chuyên sâu tại thư mục `docs/`:
- [x] `docs/architecture/system_overview.puml`: Sơ đồ tổng quan phân tách giữa Browser Sandbox và Cloud Services.
- [x] `docs/architecture/erd_database.puml`: Sơ đồ thực thể cơ sở dữ liệu (ERD) chi tiết cho 4 bảng (`users`, `lessons`, `user_progress`, `submissions`).
- [x] `docs/architecture/pyodide_execution_flow.puml`: Sơ đồ tuần tự (Sequence Diagram) mô tả luồng thực thi Python WebAssembly, chặn stdout/stderr và chấm điểm test cases.
- [x] `docs/README.md`: Báo cáo đánh giá Trade-offs kiến trúc (so sánh Client-side WASM vs Server-side Sandboxes như Judge0/Piston).

### III. Backend FastAPI (Clean Modular Architecture)
- [x] **Cấu hình & Kết nối CSDL:**
  - `app/core/config.py`: Quản lý cấu hình bằng `pydantic-settings` với tính năng parse linh hoạt danh sách CORS Origins.
  - `app/core/database.py`: Async engine hỗ trợ đồng thời PostgreSQL (`asyncpg`) và SQLite (`aiosqlite`).
  - `app/core/security.py`: Mã hóa mật khẩu bằng thư viện gốc `bcrypt` (bảo đảm an toàn và không bị lỗi tương thích trên các phiên bản Python mới), tạo và giải mã JWT token.
- [x] **Database Models (SQLAlchemy 2.0):**
  - `User`: Quản lý tài khoản, mật khẩu băm, XP tích lũy, streak ngày liên tục, ngày hoạt động cuối cùng.
  - `Lesson`: Lưu trữ bài học 60 ngày, lý thuyết Markdown, code mẫu, code khởi đầu, bộ test cases dạng JSON.
  - `UserProgress`: Theo dõi tiến độ từng học viên, trạng thái hoàn thành và lưu nháp code (`draft_code`).
  - `Submission`: Lịch sử nộp bài, thời gian chạy (ms), số lượng test passed, thông báo lỗi.
- [x] **Pydantic Schemas:** Thiết lập đầy đủ validation models cho Request/Response tại `app/schemas/`.
- [x] **API Endpoints (`app/api/v1/endpoints/`):**
  - `/auth`: Đăng ký (`/register`), Đăng nhập (`/login`), Lấy hồ sơ cá nhân (`/me`).
  - `/lessons`: Danh sách bài học theo giai đoạn, chi tiết bài học (ẩn code giải mẫu cho học viên chưa làm bài, bảo vệ phân quyền admin).
  - `/progress`: Đồng bộ bản nháp ngầm (`/sync-draft`), tóm tắt tiến độ & tỷ lệ hoàn thành (`/summary`).
  - `/submissions`: Nộp bài chấm điểm, cập nhật streak ngày theo chuẩn UTC, thưởng XP khi pass bài lần đầu.

### IV. Frontend Next.js (App Router & WebAssembly Engine)
- [x] **Thực thi Code Python trong Trình duyệt (Pyodide Worker):**
  - Xây dựng `frontend/src/lib/pyodide/usePyodide.ts` và Web Worker chạy nền.
  - Cơ chế Promise-based (`runCodeAsync`) giúp gọi code và nhận kết quả bất đồng bộ trực tiếp, không phụ thuộc timeout.
  - Cơ chế Watchdog Timeout 10 giây tự động ngắt nếu code học viên dính vòng lặp vô tận (`while True:`).
  - Tự động chuyển đổi kiểu dữ liệu `dict` từ Python sang JavaScript Object (`dict_converter: Object.fromEntries`).
- [x] **Trình soạn thảo Code Monaco:**
  - Tích hợp `@monaco-editor/react` với theme `vs-dark`, font `Fira Code`.
  - Tự động lưu bản nháp tức thì vào `localStorage` (`pysphere_draft_day_X`) và debounce 1.5s gửi lên backend.
- [x] **Bộ Trực quan hóa Thuật toán (Algorithm Visualizer):**
  - Canvas 2D mô phỏng thuật toán sắp xếp (Bubble Sort, Selection Sort).
  - Mã màu trực quan: Đang so sánh (vàng), Hoán đổi (đỏ), Đã sắp xếp (xanh ngọc).
  - Bảng điều khiển đầy đủ: Tự động chạy (Play/Pause), Tiến/Lùi từng bước (Step Navigation), Thanh điều chỉnh tốc độ (Speed Slider), Đổi mảng ngẫu nhiên.
- [x] **Giao diện Không gian Học tập (`/learn/[day]`):**
  - Thiết kế 3 cột responsive: Lý thuyết & Đề bài -> Monaco Editor -> Console Terminal & Visualizer.
  - Hiệu ứng pháo hoa (Confetti) chúc mừng khi vượt qua toàn bộ test cases.

### V. Lộ trình Huấn luyện 60 Ngày (Curriculum)
- [x] Tạo `curriculum/README.md` quy hoạch chi tiết 60 ngày chia làm 3 giai đoạn:
  - **Giai đoạn 1 (Ngày 1-20):** Nền tảng Python (Biến, Toán tử, Chuỗi, Cấu trúc dữ liệu, Điều kiện, Vòng lặp).
  - **Giai đoạn 2 (Ngày 21-40):** Lập trình hàm, Modules, Comprehensions, Regex, File I/O, Package Manager.
  - **Giai đoạn 3 (Ngày 41-60):** Lập trình Hướng đối tượng (OOP), Web Scraping, Thống kê, Pandas, REST API.
- [x] Viết nội dung mẫu chuẩn mực cho các ngày đại diện (Ngày 01, 02, 21, 41) kèm test cases JSON.
- [x] Viết công cụ sinh tự động `backend/app/scaffold_curriculum.py` hoàn thiện cấu trúc cho toàn bộ 60 ngày bài học.
- [x] Viết script seeder `backend/app/seed.py` tự động nạp toàn bộ 60 bài học vào database.

---

## 🔍 3. KẾT QUẢ ĐÁNH GIÁ CHẤT LƯỢNG (CODE REVIEW & TDD)

Trong quá trình thực hiện, một đợt Senior Code Review độc lập đã được thực hiện và phát hiện các điểm cần tối ưu:
1. **Lỗi Race Condition tại `handleSubmit`:** Đã khắc phục triệt để bằng cách chuyển sang Promise-based `runCodeAsync`.
2. **Lỗi Docker Build Frontend:** Đã bổ sung `output: "standalone"` trong `next.config.mjs` và tạo thư mục `frontend/public/`.
3. **Bảo mật Endpoint Tạo bài học:** Bổ sung kiểm tra quyền `is_superuser` tại `POST /api/v1/lessons`.
4. **Bảo vệ Đáp án bài tập:** Ẩn `solution_code` ở API lấy bài học cho đến khi học viên nộp bài thành công.
5. **Logic Tính Streak:** Tách biệt cập nhật chuỗi streak ra khỏi điều kiện hoàn thành lần đầu, cho phép học viên ôn luyện bài cũ vẫn duy trì chuỗi học.

### Kết quả Kiểm thử Tự động:
- **Backend:** `pytest tests/ -v` -> **7/7 test suites PASSED (100%)**
- **Frontend:** `npm run lint` -> **0 lỗi / 0 cảnh báo (ESLint clean)**
- **Next.js Production Build:** `npm run build` -> **4/4 trang tĩnh & động biên dịch thành công**

---

## 🚀 4. HƯỚNG DẪN KHỞI CHẠY (QUICK START)

### Cách 1: Docker Compose (Toàn bộ hệ thống)
```bash
docker compose up --build
```
- Frontend Web App: `http://localhost:3000`
- Không gian Thực hành: `http://localhost:3000/learn/1`
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

---

## 🔮 5. CÁC BƯỚC ĐỀ XUẤT TIẾP THEO (NEXT STEPS)

1. **Nâng cấp Hiển thị Markdown:** Tích hợp `react-markdown` và plugin `@tailwindcss/typography` để hiển thị bài giảng với code blocks highlight đẹp mắt.
2. **Mở rộng Visualizer:** Bổ sung mô phỏng các cấu trúc dữ liệu nâng cao (Linked List, Binary Search Tree, Graph BFS/DFS).
3. **Mở rộng OAuth2:** Tích hợp đăng nhập nhanh qua tài khoản GitHub và Google.
4. **Triển khai Cloud Production:**
   - Database: Neon Serverless PostgreSQL.
   - Backend: Container deploy lên AWS ECS / Render / Railway / Google Cloud Run.
   - Frontend: Vercel.

