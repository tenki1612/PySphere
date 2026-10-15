# PySphere (Interactive Python Platform)

> **Nền tảng tự học lập trình Python thực chiến và trực quan**
> *"Vừa học - vừa gõ code - vừa thấy kết quả ngay mà không cần cài đặt môi trường phức tạp."*

---

## 🌟 Tầm nhìn & Tính năng cốt lõi

1. **Interactive Learning (WebAssembly Python):**
   - Biên dịch và thực thi Python 100% phía trình duyệt thông qua **Pyodide (WebAssembly)** chạy trên nền **Web Worker**.
   - Zero-delay, cô lập hoàn toàn sandbox trên client, bảo vệ server và không giới hạn lượt chạy của học viên.
2. **Algorithm Visualizer (HTML5 Canvas & D3.js):**
   - Trực quan hóa từng bước chuyển động của thuật toán (Bubble Sort, Selection Sort, Quick Sort, Binary Search).
   - Thanh điều khiển tương tác: Tua bước (step-by-step), Play/Pause, Tốc độ (Speed Slider).
3. **User & Progress Management:**
   - Xác thực người dùng qua JWT.
   - Tự động lưu bản nháp code (Draft State Persistence vào `localStorage` & đồng bộ Backend).
   - Tiến trình học theo thời gian thực và lịch sử bài nộp (Submissions History).
4. **Gamification & Engagement:**
   - Hệ thống tính điểm kinh nghiệm (XP) thưởng sau mỗi bài tập hoàn thành.
   - Chuỗi ngày học liên tục (Streak Counter) thúc đẩy học tập đều đặn.

---

## 🏛️ Kiến trúc Hệ thống (Decoupled Modular Services)

```text
               +-------------------------------------------------------+
               |                  Client Browser                       |
               |  Next.js Frontend (Monaco Editor + Algorithm Canvas)  |
               |                            |                          |
               |                [Web Worker: Pyodide WASM]             |
               |             (Client-Side Python Execution)            |
               +---------------------------+---------------------------+
                                           | REST API (JWT)
                                           v
               +-------------------------------------------------------+
               |                  FastAPI Backend                      |
               |   - Auth & Users (JWT, Passlib)                       |
               |   - Curriculum & Lessons API                          |
               |   - Progress & State Persistence                      |
               |   - Gamification (XP & Streak tracking)               |
               +---------------------------+---------------------------+
                                           | Async SQLAlchemy (AsyncPG)
                                           v
               +-------------------------------------------------------+
               |                  Database Layer                       |
               |           PostgreSQL (Neon Serverless / Docker)       |
               +-------------------------------------------------------+
```

---

## 🗂️ Cấu trúc Dự án

```text
interactive-python-platform/
├── .github/workflows/         # CI/CD pipelines (GitHub Actions)
├── docs/                      # Tài liệu thiết kế hệ thống (PlantUML, diagrams)
├── frontend/                  # Next.js 14+ (App Router, Monaco, Pyodide, Tailwind)
│   ├── src/
│   │   ├── app/               # Next.js App Router (layout, routes)
│   │   ├── components/        # UI, MonacoEditor, AlgorithmVisualizer
│   │   ├── lib/               # Pyodide Web Worker setup, API clients
│   │   └── store/             # State management (Zustand)
│   └── package.json
├── backend/                   # FastAPI App (Modular clean architecture)
│   ├── app/
│   │   ├── api/               # API Routers (auth, lessons, progress, submissions)
│   │   ├── core/              # Config, Security, Database session
│   │   ├── models/            # SQLAlchemy 2.0 Async Models
│   │   └── schemas/           # Pydantic v2 Schemas
│   ├── Dockerfile
│   └── requirements.txt
├── curriculum/                # Lộ trình học 60 ngày thực chiến
│   ├── stage_1_basics/        # Ngày 1-20: Nền tảng Python
│   ├── stage_2_functions/     # Ngày 21-40: Lập trình hàm & Xử lý lỗi
│   └── stage_3_advanced/      # Ngày 41-60: OOP, Dữ liệu & Ứng dụng Web
├── docker-compose.yml         # Local development multi-container orchestration
└── README.md
```

---

## 🚀 Hướng dẫn Cài đặt & Chạy cục bộ (Quick Start)

### Cách 1: Chạy bằng Docker Compose (Khuyên dùng)
```bash
# 1. Sao chép biến môi trường
cp .env.example .env

# 2. Khởi động toàn bộ cụm dịch vụ (PostgreSQL, FastAPI Backend, Next.js Frontend)
docker compose up --build
```
- Frontend: `http://localhost:3000`
- Backend API Docs (Swagger): `http://localhost:8000/docs`
- PostgreSQL: `localhost:5432`

---

### Cách 2: Chạy trực tiếp từng service (Development)

#### Backend (FastAPI):
```bash
cd backend
python -m venv .venv
# Trên Windows:
.venv\Scripts\activate
# Trên Linux/macOS:
source .venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

#### Frontend (Next.js):
```bash
cd frontend
npm install
npm run dev
```

---

## 📅 Lộ trình 60 Ngày (Curriculum Overview)

- **Giai đoạn 1 (Ngày 1-20): Nền tảng Python**
  - Biến số, Toán tử, Kiểu dữ liệu, Chuỗi, Lists, Tuples, Sets, Dictionaries, Cấu trúc điều kiện và Vòng lặp.
- **Giai đoạn 2 (Ngày 21-40): Lập trình hàm & Xử lý lỗi**
  - Hàm, Modules, List Comprehensions, Higher-order functions, Datetime, Exception handling, Regex, Thao tác File, Package Manager.
- **Giai đoạn 3 (Ngày 41-60): OOP, Xử lý Dữ liệu & Web**
  - Lập trình hướng đối tượng (Classes/Objects), Web Scraping, Thống kê, Pandas, FastAPI Web, MongoDB & REST API.

---

## 📜 Giấy phép & Đóng góp
Dự án phát triển với giấy phép mã nguồn mở MIT.
Mọi đóng góp cho chương trình giảng dạy và hệ thống visualizer luôn được hoan nghênh qua Pull Requests!

