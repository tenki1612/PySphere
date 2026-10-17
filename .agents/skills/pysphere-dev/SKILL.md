---
name: pysphere-dev
description: Comprehensive development and architecture guidelines for PySphere — a 60-day interactive Python e-learning platform running 100% in-browser via Pyodide WebAssembly with FastAPI backend and Next.js frontend.
---

# PySphere Development & Architecture Skill

This skill defines the development standards, architecture patterns, and verification runbooks for **PySphere** (`d:\PySphere`).

---

## 🏛️ 1. Architecture Overview

PySphere uses a **Decoupled Modular Architecture** designed for zero-server-compute code execution and high scalability:

1. **Client-side Execution Sandbox (Pyodide WebAssembly):**
   - Located at `frontend/src/lib/pyodide/`.
   - Runs in a dedicated background `worker.ts` via WebAssembly (Pyodide 0.26+).
   - 100% in-browser execution: eliminates RCE risks, saves server CPU, and features a 10s watchdog timeout for infinite loops.
   - Evaluates test cases via `runCodeAsync(code, testCases)` returning typed execution results.

2. **Frontend Cloud (Next.js 14 App Router):**
   - Located at `frontend/`.
   - Built with Next.js 14 (App Router), TypeScript, Tailwind CSS, Monaco Editor, and HTML5 Canvas 2D.
   - Theme system: Strict High-Contrast Light & Dark mode support via CSS variables (`bg-background text-foreground`). Never hardcode dark background classes on `body`.

3. **Backend Cloud (FastAPI & Clean Architecture):**
   - Located at `backend/`.
   - FastAPI with async SQLAlchemy 2.0 (PostgreSQL with SQLite local fallback).
   - JWT authentication (`/api/v1/auth/login`, `/api/v1/auth/register`), role-based access control (`admin` vs `member`), draft sync (`/api/v1/lessons/{id}/draft`), and gamification progress (`/api/v1/lessons/progress`).

4. **Curriculum Repository (60-Day Roadmap):**
   - Located at `curriculum/`.
   - 3 Stages:
     - `stage_1_basics`: Days 01 - 20 (Syntax, Data types, Loops, Conditionals)
     - `stage_2_functions_modules`: Days 21 - 40 (Functions, Modules, File I/O, Regex)
     - `stage_3_advanced_web`: Days 41 - 60 (OOP, Web Scraping, REST APIs)

---

## 📂 2. Curriculum Lesson Standards

Every curriculum day folder (e.g., `curriculum/stage_1_basics/day_02_operators/`) must follow this exact contract:

- `README.md`: Comprehensive theory in Vietnamese with clear formatting, tables, PEMDAS rules, code blocks, alerts (`[!NOTE]`, `[!TIP]`), and detailed practice problem description with examples.
- `starter.py`: Clean boilerplate with docstrings and `# TODO:` markers.
- `solution.py`: Canonical reference solution (accessible to Admins).
- `test_cases.json`: Array of automated test cases with `name`, `call`, and `expected`.

### Automated Seeder:
To populate or refresh lessons into the database:
```powershell
cd d:\PySphere\backend
.venv\Scripts\activate
python -m app.seed
```

---

## 🎨 3. UX/UI & Visualizer Standards

- **Theme Consistency:** All UI components, modals, inputs, and canvas elements must dynamically adapt to `.dark` and light mode.
- **Canvas 2D Visualizer:** Located in `frontend/src/components/visualizer/AlgorithmVisualizer.tsx`.
  - Light mode: Canvas background `#f8fafc`, bar text `#0f172a`, axis labels `#64748b`.
  - Dark mode: Canvas background `#111827`, bar text `#ffffff`, axis labels `#94a3b8`.
  - Pointers: Dynamic badges for `LEFT`, `MID`, `RIGHT` (Binary Search) or `KEY` / `SWAP` (Sorting).

---

## 🧪 4. Quality & Verification Runbook

Before claiming any task complete, always execute and confirm the full verification suite:

### 1. Backend Verification (Pytest):
```powershell
cd d:\PySphere\backend
.venv\Scripts\pytest -v
```
*Requirement:* 8/8 tests must pass 100%.

### 2. Frontend Lint & Build:
```powershell
cd d:\PySphere\frontend
npm run lint
npm run build
```
*Requirement:* Zero ESLint warnings or errors, all routes compile cleanly.

