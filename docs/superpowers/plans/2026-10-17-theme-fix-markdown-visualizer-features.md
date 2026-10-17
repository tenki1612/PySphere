# Full Light/Dark Theme Overhaul & Core Features Expansion Plan

> **Goal:** 
> 1. Fix entire UI so that when switching to Light Mode, all backgrounds, surfaces, scrollbars, text, code blocks, and canvas visualizers cleanly switch to light mode with proper high-contrast text and styling.
> 2. Implement core next-step features from `docs/KIS.md`:
>    - Markdown Theory Viewer with syntax highlighting & clean light/dark typography.
>    - Expansion of Algorithm Visualizer with Insertion Sort.
>    - Submission History modal / drawer in workspace to review past code submissions & scores.

## Tasks:

- [ ] **Task 1: Root Layout & Global Theme Fixes**
  - Fix `frontend/src/app/layout.tsx`: Remove hardcoded `bg-brand-darker text-gray-200` on `<body>`, replace with `bg-background text-foreground transition-colors`.
  - Fix `frontend/src/app/globals.css`: Update scrollbars to adapt to light and dark modes, verify `--background` and `--foreground` CSS variables.
  - Verify `Navbar.tsx` background, border, text contrast in both light and dark.

- [ ] **Task 2: Algorithm Visualizer Theme & Insertion Sort Expansion**
  - In `frontend/src/components/visualizer/AlgorithmVisualizer.tsx`:
    - Hook into `useLessonStore` theme (`theme === "dark"` vs `"light"`).
    - Adapt Canvas drawing:
      - Light: canvas bg `#f8fafc`, bar text `#0f172a`, indices `#64748b`.
      - Dark: canvas bg `#111827`, bar text `#ffffff`, indices `#9ca3af`.
    - Adapt UI controls (select, buttons, cards, speed slider, legend) for light mode.
    - Implement Insertion Sort animation generator (`algo === "insertion"`).

- [ ] **Task 3: Markdown Lesson Theory Viewer Component**
  - Create `frontend/src/components/curriculum/MarkdownViewer.tsx` to render markdown properly:
    - Headings (H1, H2, H3) with emerald accents and appropriate font sizes.
    - Code blocks with copy-to-clipboard button and syntax formatting.
    - Inline code with subtle badges.
    - Bullet points, numbered lists, blockquotes, and tables.
    - Full light mode (`prose-neutral text-slate-800 bg-white`) and dark mode (`dark:prose-invert dark:text-gray-200 dark:bg-transparent`) styling.

- [ ] **Task 4: Submission History Feature in Workspace**
  - Add API client endpoint or state in `frontend/src/lib/api.ts` to fetch user submissions for current lesson if authenticated.
  - Add a "Lịch sử nộp bài" modal/popover in `frontend/src/app/learn/[day]/page.tsx` displaying previous submission logs, test pass counts, execution time, and timestamps.
  - Fix all remaining light/dark styling in `learn/[day]/page.tsx` (console pre, test case cards, solution preview, auth overlay).

- [ ] **Task 5: Verification & Documentation**
  - Run `npm run lint` and `npm run build` on frontend.
  - Run `pytest` on backend.
  - Update `docs/KIS.md`.
  - Git commit & push.

