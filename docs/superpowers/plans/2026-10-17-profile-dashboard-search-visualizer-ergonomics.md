# Plan: User Profile Dashboard, Search Visualizers, Workspace Shortcuts & Curriculum Enrichment

> **Goal:** Continue perfecting and upgrading PySphere based on `docs/KIS.md`:
> 1. Build a rich User Profile & Progress Dashboard at `/profile` with level metrics, stage progress, and submissions history.
> 2. Expand Algorithm Visualizer with Linear Search and Binary Search algorithms with pointers.
> 3. Add workspace developer ergonomics: `Ctrl+Enter` run shortcut, `Ctrl+S` save shortcut, and download `.py` file.
> 4. Enrich Day 02 curriculum (Operators & Expressions) and update Navbar navigation.

## Tasks:

- [ ] **Task 1: Build User Profile & Progress Dashboard (`/profile`)**
  - Create `frontend/src/app/profile/page.tsx`.
  - Connect with `api.getProgressSummary()`, `api.getLessons()`, `api.getSubmissionHistory()`.
  - Render Level & XP progress bar, 3-Stage breakdown, completed lesson badges, and submission history table.
  - Update `Navbar.tsx` to link to `/profile`.

- [ ] **Task 2: Expand Algorithm Visualizer with Linear & Binary Search**
  - Update `frontend/src/components/visualizer/AlgorithmVisualizer.tsx`.
  - Add search algorithms: `linear_search` and `binary_search`.
  - Add target search input field.
  - In Binary Search: visualize `low`, `mid`, `high` pointers and elimination of half-spaces.

- [ ] **Task 3: Workspace Developer Ergonomics**
  - Update `frontend/src/app/learn/[day]/page.tsx`:
    - Add `Ctrl+Enter` shortcut to run code.
    - Add `Ctrl+S` shortcut to save draft with visual toast/badge.
    - Add "Tải mã (.py)" button to export code locally.

- [ ] **Task 4: Day 02 Curriculum Enrichment**
  - Enrich `curriculum/stage_1_basics/day_02_operators/README.md` with complete theory on Python operators and expressions.
  - Update `starter.py`, `solution.py`, and `test_cases.json` for Day 02.

- [ ] **Task 5: Verification & Documentation**
  - Run `npm run lint` and `npm run build` on frontend.
  - Run `pytest` on backend.
  - Update `docs/KIS.md`.
  - Git commit & push.
