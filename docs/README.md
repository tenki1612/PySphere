# PySphere System Architecture Documentation

Tài liệu này mô tả chi tiết thiết kế kỹ thuật, quyết định kiến trúc và sơ đồ hệ thống của nền tảng **PySphere** (Interactive Python Learning Platform).

---

## 1. Tổng quan Kiến trúc (Decoupled Modular Architecture)

Sơ đồ PlantUML: [`docs/architecture/system_overview.puml`](./architecture/system_overview.puml)

Hệ thống được thiết kế theo mô hình phân tách hoàn toàn giữa **Tầng Thực thi Client-Side** và **Tầng Dịch vụ Cloud Backend**:
- **Client Tier:** Next.js (TypeScript) + Tailwind CSS + Monaco Editor.
- **Client Execution Engine:** Pyodide WebAssembly (chạy trong isolated Web Worker).
- **Backend API Tier:** FastAPI với kiến trúc module hóa hướng miền (Domain-driven), bảo mật JWT.
- **Data Tier:** PostgreSQL (kết nối qua SQLAlchemy 2.0 AsyncIO với asyncpg).

```
+-------------------------------------------------------------------------+
| Client-Side WebAssembly (Pyodide in Web Worker)                         |
| - Hoàn toàn độc lập, 0% CPU tải cho server khi người dùng chạy code.   |
| - Sandbox an toàn, không nguy cơ độc hại (DDoS, Fork bomb, RCE).       |
+-------------------------------------------------------------------------+
                                   ▲
                                   │ REST API (Bearer JWT)
                                   ▼
+-------------------------------------------------------------------------+
| FastAPI Cloud Backend                                                   |
| - Auth & Users (JWT, Bcrypt)                                            |
| - Curriculum & Lessons Service                                          |
| - User Progress & Offline-Draft Synchronization                         |
| - Submissions & Gamification Engine (XP, Streak)                        |
+-------------------------------------------------------------------------+
                                   ▲
                                   │ SQLAlchemy 2.0 Async
                                   ▼
+-------------------------------------------------------------------------+
| PostgreSQL (Neon Serverless / Local Container)                          |
| - Tables: users, lessons, user_progress, submissions                    |
+-------------------------------------------------------------------------+
```

---

## 2. Đánh giá Trade-offs Kiến trúc Thực thi Python

| Tiêu chí | Server-side Docker Execution (Judge0 / Piston) | Client-side WASM Execution (Pyodide Web Worker) [Lựa chọn của PySphere] |
| :--- | :--- | :--- |
| **Chi phí máy chủ (Cost)** | Rất cao khi mở rộng (cần CPU/RAM lớn cho Docker sandboxes). | **Gần như bằng 0 (Zero compute cost)** vì chạy trên tài nguyên CPU trình duyệt của học viên. |
| **Độ trễ (Latency)** | Phụ thuộc vào network round-trip và thời gian khởi động container (300ms - 1500ms). | **Tức thì (Instant < 50ms)** sau khi WASM khởi tạo. |
| **Bảo mật Sandbox (Security)** | Nguy cơ bị tấn công RCE, Fork bomb, Memory exhaustion nếu cấu hình sandbox hở. | **An toàn tuyệt đối** trong Web Worker sandbox của trình duyệt. |
| **Khả năng Offline** | Không thể chạy khi mất mạng. | **Chạy mượt mà offline** sau khi trình duyệt đã cache Pyodide runtime. |
| **Hạn chế** | Hỗ trợ full network socket, native C bindings. | Không hỗ trợ raw TCP socket trực tiếp, gói C-extension cần biên dịch qua Emscripten. (Phù hợp hoàn hảo cho 60 ngày học Python nền tảng, thuật toán & dữ liệu). |

---

## 3. Thiết kế Cơ sở Dữ liệu (ERD)

Sơ đồ PlantUML: [`docs/architecture/erd_database.puml`](./architecture/erd_database.puml)

- **`users`**: Quản lý thông tin định danh, mật khẩu băm (bcrypt), điểm kinh nghiệm (XP tích lũy), và số ngày streak.
- **`lessons`**: Lưu trữ 60 bài học thực chiến, bao gồm lý thuyết Markdown, mã khởi đầu (starter_code), lời giải mẫu (solution_code), và bộ test case chấm điểm (JSONB).
- **`user_progress`**: Lưu tiến trình từng bài học của học viên, trạng thái hoàn thành (`is_completed`), và bản nháp code chưa nộp (`draft_code`).
- **`submissions`**: Ghi nhận toàn bộ lịch sử nộp bài, thời gian thực thi (ms), số lượng test passed, và thông báo lỗi.

---

## 4. Luồng Xử lý Thực thi Pyodide Web Worker

Sơ đồ PlantUML: [`docs/architecture/pyodide_execution_flow.puml`](./architecture/pyodide_execution_flow.puml)

1. Học viên gõ code trên giao diện **Monaco Editor**.
2. Khi nhấn nút **"Chạy Code"** hoặc **"Nộp bài"**:
   - Giao diện gửi thông điệp `postMessage({ type: 'EXECUTE', code, testCases })` sang Web Worker.
   - Web Worker chuyển hướng luồng `sys.stdout` và `sys.stderr` vào buffer bộ nhớ riêng biệt.
   - Pyodide thực thi bất đồng bộ `runPythonAsync`.
   - Chạy hàm kiểm thử tự động với dữ liệu đầu vào.
   - Worker phản hồi thông điệp `SUCCESS` kèm kết quả đầu ra và thời gian thực thi (ms) về Main Thread.
3. Trong lúc gõ code, hệ thống tự động debounce (1.5 giây) để lưu bản nháp vào `localStorage` của trình duyệt, đồng thời gửi tín hiệu bất đồng bộ nhẹ lên backend để học viên có thể học tiếp tục trên máy khác.
