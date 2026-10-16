# Enhance Auth, Day 1 Syntax, Conditional Visualizer & Theme Toggle Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement 4 core user requirements:
1. Gated access to exercise workspace with user registration/login and role-based authorization (User vs Admin).
2. Deep enrichment of Day 01 curriculum to comprehensively introduce Python basic syntax (Indentation, comments, print, PEP 8, types).
3. Conditional Algorithm Visualizer displayed only on lessons that require algorithm visualization.
4. Dark / Light theme toggle with local persistence and dynamic Monaco Editor theme adaptation.

**Architecture:**
- Frontend: Next.js App Router, Tailwind CSS dark mode classes, React hooks, Zustand store with auth state, Monaco Editor theme switching.
- Backend: FastAPI, SQLAlchemy 2.0 Async, Pydantic schemas extended with `has_visualizer` and `role` attributes.

## Global Constraints
- Python: 3.10+ (FastAPI + SQLAlchemy Async + Pytest)
- Node: Next.js 14 App Router, TypeScript
- Maintain 100% green test suite on backend and zero ESLint errors on frontend

---

### Task 1: Authentication & Role-Based Access Control on Exercise Workspace

**Files:**
- Modify: `backend/app/schemas/user.py`
- Modify: `backend/app/models/user.py`
- Create: `frontend/src/app/login/page.tsx`
- Create: `frontend/src/app/register/page.tsx`
- Modify: `frontend/src/store/useLessonStore.ts`
- Modify: `frontend/src/components/layout/Navbar.tsx`
- Modify: `frontend/src/app/learn/[day]/page.tsx`
- Test: `backend/tests/test_auth_api.py`

- [ ] **Step 1: Write backend tests for user roles**
Verify `UserResponse` includes `is_superuser` and `role` string ("admin" if is_superuser else "user").

- [ ] **Step 2: Update Backend User schema & model**
Expose `role` property in `UserResponse` based on `is_superuser`.

- [ ] **Step 3: Create Login and Register pages in Frontend**
Build modern, responsive login and register forms at `frontend/src/app/login/page.tsx` and `frontend/src/app/register/page.tsx` with error handling, JWT persistence, and redirect back to previous page or `/learn/1`.

- [ ] **Step 4: Add Auth Gate to `/learn/[day]` Workspace**
If unauthenticated user visits `/learn/[day]`:
Display an interactive Login Required modal / banner with "Đăng nhập để làm bài tập" and "Đăng ký tài khoản mới" buttons, preventing code execution or submission until authenticated.

- [ ] **Step 5: Update Navbar with User Profile, Role Badge, and Logout**
Display "Admin" badge if `user.is_superuser` or "Học viên", with Logout button.

---

### Task 2: Enrich Day 01 Curriculum with Core Python Syntax

**Files:**
- Modify: `curriculum/stage_1_basics/day_01_variables/README.md`
- Modify: `curriculum/stage_1_basics/day_01_variables/starter.py`
- Modify: `curriculum/stage_1_basics/day_01_variables/solution.py`
- Modify: `curriculum/stage_1_basics/day_01_variables/test_cases.json`

- [ ] **Step 1: Rewrite Day 01 README.md with comprehensive syntax theory**
Cover:
1. Lời chào đầu tiên: `print("Hello, PySphere!")`.
2. Quy tắc Thụt lề (Indentation - 4 spaces).
3. Chú thích mã nguồn (Comments với `#` và docstring đa dòng `"""..."""`).
4. Khai báo biến và Quy ước đặt tên PEP 8 (snake_case, phân biệt hoa/thường).
5. 4 Kiểu dữ liệu nguyên thủy: `int`, `float`, `str`, `bool`.
6. Ép kiểu dữ liệu (`int()`, `float()`, `str()`, `bool()`) và hàm kiểm tra `type()`.
7. Đề bài thực hành rõ ràng kết hợp cả in ra màn hình, ép kiểu và định dạng chuỗi.

- [ ] **Step 2: Update starter, solution, and test cases**
Align test assertions with the enriched lesson.

---

### Task 3: Conditional Algorithm Visualizer (Only on Algorithm Lessons)

**Files:**
- Modify: `backend/app/models/lesson.py`
- Modify: `backend/app/schemas/lesson.py`
- Modify: `backend/app/seed.py`
- Modify: `backend/app/scaffold_curriculum.py`
- Modify: `frontend/src/app/learn/[day]/page.tsx`
- Test: `backend/tests/test_lessons_api.py`

- [ ] **Step 1: Write backend test for `has_visualizer` flag**
Verify `GET /api/v1/lessons/{id}` returns `has_visualizer: bool` and `visualizer_type: Optional[str]`.

- [ ] **Step 2: Add `has_visualizer` to Lesson model and schemas**
In `Lesson`:
- `has_visualizer = Column(Boolean, default=False)`
- `visualizer_type = Column(String(50), nullable=True)`

- [ ] **Step 3: Update `seed.py` to tag algorithm lessons**
Set `has_visualizer = True` for lessons covering sorting, searching, recursion, and algorithms (e.g. Day 17-20 loops, Day 30 recursion, Day 50 algorithms).

- [ ] **Step 4: Update Frontend Workspace (`/learn/[day]/page.tsx`)**
Only render the "Algorithm Visualizer" tab button if `lesson?.has_visualizer === true`. If false, only display the Console & Test Runner without unnecessary tab switching.

---

### Task 4: Dark Mode / Light Mode Theme Switcher

**Files:**
- Modify: `frontend/src/app/globals.css`
- Modify: `frontend/src/components/layout/Navbar.tsx`
- Modify: `frontend/src/components/editor/MonacoEditor.tsx`
- Modify: `frontend/src/app/learn/[day]/page.tsx`
- Modify: `frontend/src/app/page.tsx`

- [ ] **Step 1: Configure CSS theme variables in `globals.css`**
Define `--background`, `--foreground`, `--card-bg`, `--border-color` for both `.dark` and `:root` (light).

- [ ] **Step 2: Implement Theme Toggle in `Navbar.tsx`**
Add Sun/Moon icon toggle button that switches between `dark` and `light` classes on `document.documentElement` and persists to `localStorage.getItem('pysphere_theme')`.

- [ ] **Step 3: Dynamic Theme for Monaco Editor**
Pass current theme (`vs-dark` when dark, `light` when light) to Monaco Editor component.

---

### Task 5: End-to-End Verification & Commit

- [ ] **Step 1: Run Backend Tests**
Verify all pytest suites pass (`pytest tests -v`).

- [ ] **Step 2: Run Frontend Lint & Build**
Verify `npm run lint` and `npm run build` succeed with zero errors.

- [ ] **Step 3: Update `docs/KIS.md`**
Document all new features and fixes.

- [ ] **Step 4: Git Commit & Push to GitHub**
Commit and push to `origin main`.

