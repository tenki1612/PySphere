# Scaffold Interactive Python Platform Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Establish the complete production-grade repository scaffolding, backend FastAPI services, Next.js frontend with Monaco Editor & Pyodide Web Worker runner, algorithm visualizer foundation, 60-day curriculum structure, CI/CD pipelines, and Docker orchestration for the interactive Python learning platform.

**Architecture:** Decoupled modular architecture with client-side WebAssembly execution (Pyodide in Web Worker) for zero-backend Python execution overhead. A FastAPI asynchronous backend manages JWT authentication, user progress, streak/XP gamification, and submission telemetry with PostgreSQL (SQLAlchemy Async). Next.js App Router powers the modern responsive UI with Monaco Editor and HTML5 Canvas / D3 algorithm visualizer.

**Tech Stack:** 
- Frontend: Next.js (App Router, TypeScript), Tailwind CSS, Lucide Icons, Monaco Editor (`@monaco-editor/react`), Pyodide (WASM Web Worker), Zustand state management.
- Backend: FastAPI, Pydantic v2, SQLAlchemy 2.0 (AsyncIO), asyncpg / aiosqlite, PyJWT, Passlib (bcrypt), Uvicorn.
- Curriculum: 60-day roadmap in 3 stages (Markdown theory + exercises + test fixtures).
- DevOps: Docker, Docker Compose, GitHub Actions CI/CD workflows, PlantUML system architecture documentation.

**Spec:** User architecture specification provided in prompt (Decoupled Modular Services, Next.js + FastAPI + PostgreSQL + Pyodide Web Worker + 60-day curriculum).

## Global Constraints

- Root project directory: `d:\PySphere`
- Directory layout matches user's exact specification:
  - `frontend/`: Next.js application
  - `backend/`: FastAPI application (`app/api`, `app/core`, `app/models`, `app/schemas`)
  - `curriculum/`: 60 days organized into `stage_1_basics`, `stage_2_functions`, `stage_3_advanced`
  - `docs/`: Architecture specifications, PlantUML diagrams, and system design docs
  - `.github/workflows/`: CI/CD pipelines for frontend and backend
  - `docker-compose.yml`: Multi-container local orchestration (Postgres, Backend, Frontend)
- Python compatibility: 3.10+ (FastAPI + Pydantic v2 + SQLAlchemy 2.0 Async)
- Node compatibility: Node 18+ (Node 24 available locally)
- Zero mock passwords in production defaults; production secrets configurable via `.env`

## Review Focus

1. **Pyodide Worker Isolation:** Pyodide Web Worker must capture `stdout`, `stderr`, and runtime exceptions without locking the UI main thread.
2. **Async Database Fallback:** Backend models and database session manager must support PostgreSQL `asyncpg` in production and fallback smoothly to `sqlite+aiosqlite` for effortless local developer testing without requiring an immediate running Postgres container.
3. **CORS & Environment Configurations:** Frontend API client and backend CORS middleware must align on origins and credentials.
4. **State Persistence & Offline Drafts:** Code written by the user in Monaco Editor must persist to localStorage per lesson ID and synchronize with the backend progress endpoint.
5. **Curriculum Schema Consistency:** Every day lesson folder in curriculum must have a structured format (README.md theory, starter code, solution, and test cases).

---

### Task 1: Repository Initialization & Global DevOps Configuration

**Files:**
- Create: `.gitignore`
- Create: `docker-compose.yml`
- Create: `.env.example`
- Create: `README.md`
- Create: `.github/workflows/ci.yml`

**Interfaces:**
- Produces: Base git repository, unified docker-compose environment running PostgreSQL (port 5432), FastAPI backend (port 8000), and Next.js frontend (port 3000), along with GitHub Actions pipeline.

- [ ] **Step 1: Initialize Git Repository**
Run `git init` and configure basic git settings.

- [ ] **Step 2: Create Comprehensive `.gitignore`**
Include Node (`node_modules`, `.next`, `dist`), Python (`__pycache__`, `.venv`, `*.pyc`, `.pytest_cache`), environment files (`.env`), and OS files (`.DS_Store`, `Thumbs.db`).

- [ ] **Step 3: Create `docker-compose.yml`**
Define services:
- `db`: postgres:16-alpine with healthcheck and persistent volume `pgdata`.
- `backend`: builds `./backend`, ports `8000:8000`, depends on `db`.
- `frontend`: builds `./frontend`, ports `3000:3000`, depends on `backend`.

- [ ] **Step 4: Create `.env.example` and Root `README.md`**
Document system architecture, quick start commands, and environment variable schema.

- [ ] **Step 5: Create `.github/workflows/ci.yml`**
Automate test and lint jobs for both backend (Python pytest, ruff/flake8) and frontend (npm run lint, npm run build).

- [ ] **Step 6: Verify and Commit**
Verify git status and commit Task 1 files.

---

### Task 2: Architecture Documentation & PlantUML Specifications

**Files:**
- Create: `docs/architecture/system_overview.puml`
- Create: `docs/architecture/erd_database.puml`
- Create: `docs/architecture/pyodide_execution_flow.puml`
- Create: `docs/README.md`

**Interfaces:**
- Produces: Visual diagrams and architectural documentation detailing the decoupled service model, database ERD (Users, Lessons, Submissions, Progress, Streaks), and WebAssembly Pyodide execution lifecycle.

- [ ] **Step 1: Create System Overview PlantUML diagram**
Diagram Next.js client, Pyodide Web Worker, FastAPI backend, Neon PostgreSQL, and authentication flows.

- [ ] **Step 2: Create ERD Database PlantUML diagram**
Map `users`, `lessons`, `user_progress`, `submissions`, `streaks`, and `xp_transactions`.

- [ ] **Step 3: Create Pyodide Sequence Diagram**
Illustrate Monaco Editor code input -> Web Worker message dispatch -> Pyodide sandbox execution -> stdout/stderr interception -> state update.

- [ ] **Step 4: Create `docs/README.md`**
Provide a system architecture guide explaining design trade-offs and deployment topology.

- [ ] **Step 5: Verify and Commit**
Commit documentation files.

---

### Task 3: Backend FastAPI Foundation & Core Architecture

**Files:**
- Create: `backend/requirements.txt`
- Create: `backend/Dockerfile`
- Create: `backend/app/__init__.py`
- Create: `backend/app/main.py`
- Create: `backend/app/core/config.py`
- Create: `backend/app/core/security.py`
- Create: `backend/app/core/database.py`
- Test: `backend/tests/test_health.py`

**Interfaces:**
- Consumes: Environment configuration (`DATABASE_URL`, `SECRET_KEY`, `ALGORITHM`).
- Produces: `get_db` async session generator, `get_current_user` auth dependency, password hashing/verifying helpers, FastAPI application instance with CORS and health endpoints.

- [ ] **Step 1: Write backend dependencies in `backend/requirements.txt`**
FastAPI, uvicorn, pydantic, pydantic-settings, sqlalchemy>=2.0, asyncpg, aiosqlite, pyjwt, passlib[bcrypt], pytest, httpx, pytest-asyncio.

- [ ] **Step 2: Write failing health check test `backend/tests/test_health.py`**
Test that `GET /api/v1/health` returns status `200` and `{"status": "healthy"}`.

- [ ] **Step 3: Implement `backend/app/core/config.py`**
Use Pydantic `BaseSettings` to manage `PROJECT_NAME`, `API_V1_STR`, `SECRET_KEY`, `ACCESS_TOKEN_EXPIRE_MINUTES`, `DATABASE_URL`, and CORS origins.

- [ ] **Step 4: Implement `backend/app/core/security.py` and `database.py`**
- `security.py`: `verify_password`, `get_password_hash`, `create_access_token`, `decode_access_token`.
- `database.py`: Async engine, `AsyncSessionLocal`, and `get_db` dependency with automatic async SQLite fallback if Postgres is not configured.

- [ ] **Step 5: Implement `backend/app/main.py`**
Configure FastAPI app, CORS middleware, API router prefix `/api/v1`, and `/api/v1/health` endpoint.

- [ ] **Step 6: Run backend test and verify pass**
Run `pytest backend/tests/test_health.py -v`.

- [ ] **Step 7: Create `backend/Dockerfile` and commit**
Multi-stage or slim python container for backend.

---

### Task 4: Backend Domain Models, Schemas & API Modules (Auth, Lessons, Progress)

**Files:**
- Create: `backend/app/models/user.py`
- Create: `backend/app/models/lesson.py`
- Create: `backend/app/models/progress.py`
- Create: `backend/app/models/submission.py`
- Create: `backend/app/schemas/user.py`
- Create: `backend/app/schemas/lesson.py`
- Create: `backend/app/schemas/progress.py`
- Create: `backend/app/schemas/submission.py`
- Create: `backend/app/api/v1/endpoints/auth.py`
- Create: `backend/app/api/v1/endpoints/lessons.py`
- Create: `backend/app/api/v1/endpoints/progress.py`
- Create: `backend/app/api/v1/endpoints/submissions.py`
- Create: `backend/app/api/v1/api.py`
- Test: `backend/tests/test_auth_api.py`
- Test: `backend/tests/test_lessons_api.py`

**Interfaces:**
- Produces:
  - Auth endpoints: `POST /api/v1/auth/register`, `POST /api/v1/auth/login`, `GET /api/v1/auth/me`
  - Lessons endpoints: `GET /api/v1/lessons`, `GET /api/v1/lessons/{id}`
  - Progress endpoints: `GET /api/v1/progress/summary`, `POST /api/v1/progress/sync-draft`
  - Submissions endpoints: `POST /api/v1/submissions`, `GET /api/v1/submissions/history`

- [ ] **Step 1: Write failing auth and lesson tests**
Test user registration, token generation, login, and listing lessons.

- [ ] **Step 2: Implement SQLAlchemy Async Models**
Map User (with hashed_password, xp, streak_count), Lesson (id, stage, day, title, description, starter_code, solution_code, test_cases), UserProgress (draft_code, completed, completed_at), Submission (code, status, execution_time_ms).

- [ ] **Step 3: Implement Pydantic Schemas**
Request and response validation models with Pydantic v2 `from_attributes = True`.

- [ ] **Step 4: Implement API Endpoints & Auth Dependency**
Build routers with clean business logic, password hashing, and database transactions.

- [ ] **Step 5: Run tests and verify PASS**
Run `pytest backend/tests/ -v`.

- [ ] **Step 6: Commit Task 4**
Commit backend API models, routers, and passing test suites.

---

### Task 5: 60-Day Curriculum Structure & Seed Content

**Files:**
- Create: `curriculum/README.md`
- Create: `curriculum/stage_1_basics/day_01_variables/README.md`
- Create: `curriculum/stage_1_basics/day_01_variables/starter.py`
- Create: `curriculum/stage_1_basics/day_01_variables/test_cases.json`
- Create: `curriculum/stage_1_basics/day_02_operators/...`
- Create: `curriculum/stage_2_functions/day_21_functions/...`
- Create: `curriculum/stage_3_advanced/day_41_classes/...`
- Create: `backend/app/seed.py` (Script to load curriculum into database)

**Interfaces:**
- Produces: Standardized directory structure for all 60 days, deep exemplar lessons with real interactive exercises and JSON unit-test assertions, and an automated seeder script.

- [ ] **Step 1: Define curriculum taxonomy and directory scaffolding**
Generate structure for `stage_1_basics` (Days 1-20), `stage_2_functions` (Days 21-40), and `stage_3_advanced` (Days 41-60).

- [ ] **Step 2: Create exemplar lessons for each stage with high pedagogical quality**
Include conceptual explanation, interactive problem statement, starter code template, solution, and test case specs.

- [ ] **Step 3: Implement `backend/app/seed.py`**
Automated parsing script that parses curriculum Markdown and JSON files and populates database with initial curriculum records.

- [ ] **Step 4: Test curriculum seed script**
Run `python backend/app/seed.py` against test database.

- [ ] **Step 5: Commit Task 5**
Commit curriculum files and seeder.

---

### Task 6: Frontend Next.js Architecture, Monaco Editor & Pyodide Worker

**Files:**
- Create: `frontend/package.json`
- Create: `frontend/tsconfig.json`
- Create: `frontend/next.config.mjs`
- Create: `frontend/tailwind.config.ts`
- Create: `frontend/postcss.config.mjs`
- Create: `frontend/src/app/layout.tsx`
- Create: `frontend/src/app/page.tsx`
- Create: `frontend/src/app/learn/[day]/page.tsx`
- Create: `frontend/src/components/editor/MonacoEditor.tsx`
- Create: `frontend/src/components/visualizer/AlgorithmVisualizer.tsx`
- Create: `frontend/src/components/layout/Navbar.tsx`
- Create: `frontend/src/lib/pyodide/worker.ts`
- Create: `frontend/src/lib/pyodide/usePyodide.ts`
- Create: `frontend/src/store/useLessonStore.ts`
- Create: `frontend/Dockerfile`

**Interfaces:**
- Produces: Complete Next.js application with dark mode / developer-grade theme, split-screen code editor + interactive console, Pyodide WebAssembly executor, and Algorithm Visualizer component.

- [ ] **Step 1: Set up Next.js configuration and dependencies**
Configure `package.json`, `tsconfig.json`, Tailwind CSS, and Next.js headers required for WebAssembly / SharedArrayBuffer if needed.

- [ ] **Step 2: Implement Pyodide Web Worker & Custom Hook**
Create `worker.ts` to load Pyodide from CDN/WASM, redirect `sys.stdout` and `sys.stderr`, execute Python code safely off the main thread, and return results or exceptions.

- [ ] **Step 3: Implement Monaco Editor Component**
Dark-themed, responsive code editor with Python syntax highlighting, automatic tab formatting, and draft autosave to localStorage.

- [ ] **Step 4: Implement Algorithm Visualizer Component**
Canvas 2D / SVG visualizer featuring sorting (Bubble Sort, Quick Sort) and search animations, step slider, play/pause controls, and speed adjustment.

- [ ] **Step 5: Implement Interactive Learning Workspace Page**
Responsive 3-column / split-view layout:
1. Lesson Roadmap & Theory (Markdown renderer)
2. Monaco Code Editor + Action toolbar (Run Code, Submit Solution, Reset)
3. Output Console / Test Runner & Algorithm Visualizer Tab

- [ ] **Step 6: Implement Gamification & Progress State (`Zustand`)**
Track Streak count, XP, completed lessons, and submission logs.

- [ ] **Step 7: Build & verify Frontend**
Run `npm run build` or typecheck to verify zero build errors.

- [ ] **Step 8: Commit Task 6**
Commit frontend codebase and assets.

---

### Task 7: End-to-End Verification & Docker Compose Validation

**Files:**
- Modify: `docker-compose.yml` (if needed after build checks)
- Verify: Full stack orchestration, frontend compilation, backend test suite.

**Interfaces:**
- Produces: Complete, verified interactive Python learning platform ready for local developer launch and cloud deployment.

- [ ] **Step 1: Run complete backend test suite**
Verify all unit and API integration tests pass (`pytest backend/tests -v`).

- [ ] **Step 2: Verify frontend compilation and linting**
Run `npm run lint` and `npm run build` in `frontend/`.

- [ ] **Step 3: Test Docker Compose configuration syntax**
Verify `docker compose config` is valid without errors.

- [ ] **Step 4: Final project documentation & developer onboarding checklist**
Update `README.md` with step-by-step instructions to run locally and deploy to cloud (Vercel + Docker / Neon).

- [ ] **Step 5: Final Git Commit**
Commit all finalized components.
