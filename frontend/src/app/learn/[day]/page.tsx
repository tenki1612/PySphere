"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import confetti from "canvas-confetti";
import {
  Play,
  Send,
  RotateCcw,
  CheckCircle,
  XCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  Terminal as TerminalIcon,
  Activity,
  Sparkles,
  Loader2,
  Lock,
  LogIn,
  UserPlus,
  ShieldCheck,
  Eye,
  EyeOff,
  History,
  X,
  FileCode,
  Calendar,
  Download,
  Save,
  Layers,
  BookOpen,
  Maximize2,
  Minimize2,
  Search,
  Copy,
  Check,
} from "lucide-react";
import { MonacoEditor } from "@/components/editor/MonacoEditor";
import { AlgorithmVisualizer } from "@/components/visualizer/AlgorithmVisualizer";
import { MarkdownViewer } from "@/components/curriculum/MarkdownViewer";
import { usePyodide } from "@/lib/pyodide/usePyodide";
import { api, getToken } from "@/lib/api";
import { useLessonStore } from "@/store/useLessonStore";

export default function LearnWorkspacePage() {
  const params = useParams();
  const router = useRouter();
  const dayStr = Array.isArray(params.day) ? params.day[0] : params.day;
  const dayNumber = parseInt(dayStr || "1", 10);

  const [lesson, setLesson] = useState<any>(null);
  const [code, setCode] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"console" | "visualizer">("console");
  const [submitting, setSubmitting] = useState(false);
  const [submissionFeedback, setSubmissionFeedback] = useState<any>(null);
  const [mounted, setMounted] = useState(false);
  const [showAdminSolution, setShowAdminSolution] = useState(false);

  // Submission History modal state
  const [showHistory, setShowHistory] = useState(false);
  const [historyList, setHistoryList] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [savedStatus, setSavedStatus] = useState<string | null>(null);

  // Zen Mode (Focus Mode)
  const [isZenMode, setIsZenMode] = useState(false);

  // Monaco Editor Font Size
  const [editorFontSize, setEditorFontSize] = useState<number>(14);

  // Quick Curriculum Navigator Modal
  const [showCurriculumModal, setShowCurriculumModal] = useState(false);
  const [allLessons, setAllLessons] = useState<any[]>([]);
  const [curriculumSearch, setCurriculumSearch] = useState("");
  const [curriculumStage, setCurriculumStage] = useState<number | "all">("all");

  // Python Quick Cheatsheet Drawer
  const [showCheatsheet, setShowCheatsheet] = useState(false);
  const [cheatsheetSearch, setCheatsheetSearch] = useState("");
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);

  // Clear stdout state
  const [isConsoleCleared, setIsConsoleCleared] = useState(false);

  const { isReady, isRunning, output, runCode, runCodeAsync } = usePyodide();
  const { user, updateXpAndStreak } = useLessonStore();

  useEffect(() => {
    setMounted(true);
    const savedSize = localStorage.getItem("pysphere_editor_font_size");
    if (savedSize) {
      const parsed = parseInt(savedSize, 10);
      if (!isNaN(parsed) && parsed >= 12 && parsed <= 24) {
        setEditorFontSize(parsed);
      }
    }

    api
      .getLessons()
      .then((data) => {
        if (data && Array.isArray(data)) {
          setAllLessons(data);
        }
      })
      .catch(() => {});
  }, []);

  const handleFontSizeChange = (delta: number) => {
    const newSize = Math.min(22, Math.max(12, editorFontSize + delta));
    setEditorFontSize(newSize);
    localStorage.setItem("pysphere_editor_font_size", String(newSize));
  };

  const handleCopySnippet = (snippet: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(snippet);
      setCopiedSnippet(snippet);
      setTimeout(() => setCopiedSnippet(null), 2000);
    }
  };

  const token = typeof window !== "undefined" ? getToken() : null;
  const isAuthenticated = mounted ? Boolean(user || token) : true;
  const isAdmin = user?.role === "admin" || user?.is_superuser === true;

  // Load lesson details and draft
  useEffect(() => {
    async function fetchLesson() {
      try {
        const data = await api.getLesson(String(dayNumber));
        setLesson(data);

        // Check local storage draft first
        const localDraft = localStorage.getItem(`pysphere_draft_day_${dayNumber}`);
        if (localDraft) {
          setCode(localDraft);
        } else if (data.draft_code) {
          setCode(data.draft_code);
        } else {
          setCode(data.starter_code || "");
        }
      } catch {
        // Fallback placeholder lesson if backend is offline
        const fallback = {
          id: dayNumber,
          day_number: dayNumber,
          stage: 1,
          title: `Ngày ${dayNumber < 10 ? "0" + dayNumber : dayNumber}: Biến số & Kiểu dữ liệu`,
          topic: "Nền tảng Python",
          description_md: `# Ngày ${dayNumber}: Biến số và Kiểu dữ liệu nguyên thủy\n\n## Đề bài thực hành:\nViết hàm \`format_user_profile(name, age, height, is_active)\` trả về chuỗi định dạng:\n\`"[Tên] | Tuổi: [Tuổi] | Cao: [Chiều cao]m | Trạng thái: [Hoạt động/Tạm dừng]"\``,
          starter_code: `def format_user_profile(name: str, age, height: float, is_active: bool) -> str:\n    # TODO: Ép kiểu age thành số nguyên (int)\n    # TODO: Trả về chuỗi định dạng chính xác\n    age_int = int(age)\n    status_str = "Hoạt động" if is_active else "Tạm dừng"\n    return f"{name} | Tuổi: {age_int} | Cao: {height}m | Trạng thái: {status_str}"`,
          test_cases: [
            {
              name: "Test cơ bản",
              call: "format_user_profile('Nguyen Van A', '20', 1.72, True)",
              expected: "Nguyen Van A | Tuổi: 20 | Cao: 1.72m | Trạng thái: Hoạt động",
            },
          ],
          xp_reward: 50,
          has_visualizer: false,
        };
        setLesson(fallback);
        setCode(fallback.starter_code);
      }
    }
    fetchLesson();
  }, [dayNumber]);

  // Ensure active tab switches to console if lesson has no visualizer
  useEffect(() => {
    if (lesson && !lesson.has_visualizer && activeTab === "visualizer") {
      setActiveTab("console");
    }
  }, [lesson, activeTab]);

  // Debounced Autosave to localStorage & Backend (only if authenticated)
  useEffect(() => {
    if (!code || !dayNumber || !isAuthenticated) return;
    localStorage.setItem(`pysphere_draft_day_${dayNumber}`, code);

    const timer = setTimeout(() => {
      api.syncDraft(dayNumber, code).catch(() => {});
    }, 1500);

    return () => clearTimeout(timer);
  }, [code, dayNumber, isAuthenticated]);

  // Open Submission History Modal
  const openHistoryModal = async () => {
    setShowHistory(true);
    if (!isAuthenticated) return;
    setLoadingHistory(true);
    try {
      const list = await api.getSubmissionHistory(lesson?.id || dayNumber);
      setHistoryList(list);
    } catch {
      setHistoryList([]);
    } finally {
      setLoadingHistory(false);
    }
  };

  // Manual Draft Save (Ctrl+S)
  const handleManualSave = useCallback(async () => {
    if (!isAuthenticated || !dayNumber) return;
    localStorage.setItem(`pysphere_draft_day_${dayNumber}`, code);
    setSavedStatus("Đang lưu...");
    try {
      await api.syncDraft(dayNumber, code);
      setSavedStatus("Đã lưu nháp!");
    } catch {
      setSavedStatus("Đã lưu offline");
    }
    setTimeout(() => setSavedStatus(null), 2500);
  }, [code, dayNumber, isAuthenticated]);

  // Download Code as .py file
  const handleDownloadCode = () => {
    const blob = new Blob([code], { type: "text/x-python;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `day_${dayNumber < 10 ? "0" + dayNumber : dayNumber}_solution.py`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Handle Run Code (Client-Side WASM)
  const handleRunCode = useCallback(() => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=/learn/${dayNumber}`);
      return;
    }
    setActiveTab("console");
    setIsConsoleCleared(false);
    runCode(code, lesson?.test_cases || []);
  }, [code, dayNumber, isAuthenticated, lesson, router, runCode]);

  // Keyboard Shortcuts (Ctrl+Enter to Run, Ctrl+S to Save)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+Enter or Cmd+Enter -> Run Code
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        if (!isRunning && isReady) {
          handleRunCode();
        }
      }
      // Ctrl+S or Cmd+S -> Save Draft
      if ((e.ctrlKey || e.metaKey) && (e.key === "s" || e.key === "S")) {
        e.preventDefault();
        handleManualSave();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleManualSave, handleRunCode, isReady, isRunning]);

  // Handle Submit Solution (Promise-based, zero race condition)
  const handleSubmit = async () => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=/learn/${dayNumber}`);
      return;
    }
    setActiveTab("console");
    setSubmitting(true);
    setSubmissionFeedback(null);

    try {
      // 1. Run and evaluate code directly via Promise
      const evalResult = await runCodeAsync(code, lesson?.test_cases || []);

      // 2. Check if all test cases passed
      const passedAll =
        evalResult.testResults.length > 0 &&
        evalResult.testResults.every((t) => t.passed);

      const status = passedAll ? "PASSED" : "FAILED";
      const result = await api.submitSolution({
        lesson_id: lesson?.id || dayNumber,
        submitted_code: code,
        status,
        execution_time_ms: evalResult.executionTimeMs || 30,
        tests_passed: evalResult.testResults.filter((t) => t.passed).length,
        tests_total: evalResult.testResults.length,
      });

      setSubmissionFeedback(result);

      if (passedAll) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
        updateXpAndStreak(result.xp_earned || 50, result.current_streak || 1);
      }
    } catch (err: any) {
      setSubmissionFeedback({
        status: "FAILED",
        error_message: err.message || "Lỗi khi nộp bài",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Reset code to starter template
  const handleResetCode = () => {
    if (confirm("Bạn có chắc chắn muốn đặt lại mã nguồn về ban đầu?")) {
      setCode(lesson?.starter_code || "");
      localStorage.removeItem(`pysphere_draft_day_${dayNumber}`);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-3.5rem)] overflow-hidden bg-background text-foreground transition-colors">
      {/* Top Workspace Toolbar */}
      <div className="flex h-12 w-full items-center justify-between border-b border-gray-200 dark:border-brand-border bg-white dark:bg-brand-dark px-4 transition-colors">
        {/* Navigation & Lesson Title */}
        <div className="flex items-center gap-3 truncate">
          <button
            onClick={() => router.push(`/learn/${Math.max(1, dayNumber - 1)}`)}
            disabled={dayNumber <= 1}
            className="rounded p-1 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-brand-border/40 hover:text-gray-900 dark:hover:text-white disabled:opacity-30 transition"
            title="Bài trước"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="font-semibold text-sm text-gray-900 dark:text-white truncate">
            {lesson?.title || `Ngày ${dayNumber}`}
          </span>
          <button
            onClick={() => router.push(`/learn/${Math.min(60, dayNumber + 1)}`)}
            disabled={dayNumber >= 60}
            className="rounded p-1 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-brand-border/40 hover:text-gray-900 dark:hover:text-white disabled:opacity-30 transition"
            title="Bài kế tiếp"
          >
            <ChevronRight className="h-4 w-4" />
          </button>

          {/* Admin Role Badge */}
          {isAdmin && (
            <span className="hidden md:inline-flex items-center gap-1 rounded-full bg-purple-500/10 border border-purple-500/30 px-2 py-0.5 text-[11px] font-bold text-purple-700 dark:text-purple-400">
              <ShieldCheck className="h-3 w-3" /> Admin Mode
            </span>
          )}

          {/* Quick Curriculum Drawer Button */}
          <button
            onClick={() => setShowCurriculumModal(true)}
            className="flex items-center gap-1 rounded-md border border-gray-200 dark:border-brand-border bg-gray-50 dark:bg-brand-darker px-2.5 py-1 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition"
            title="Mở danh sách lộ trình 60 ngày học"
          >
            <Layers className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="hidden sm:inline">Lộ trình 60 Ngày</span>
          </button>

          {/* Quick Cheatsheet Button */}
          <button
            onClick={() => setShowCheatsheet(true)}
            className="flex items-center gap-1 rounded-md border border-gray-200 dark:border-brand-border bg-gray-50 dark:bg-brand-darker px-2.5 py-1 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:text-sky-600 dark:hover:text-sky-400 transition"
            title="Tra cứu nhanh cú pháp & hàm Python"
          >
            <BookOpen className="h-3.5 w-3.5 text-sky-600 dark:text-sky-400" />
            <span className="hidden sm:inline">Cú pháp</span>
          </button>

          {/* Zen / Focus Mode Toggle */}
          <button
            onClick={() => setIsZenMode(!isZenMode)}
            className={`flex items-center gap-1 rounded-md border px-2.5 py-1 text-xs font-semibold transition ${
              isZenMode
                ? "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                : "border-gray-200 dark:border-brand-border bg-gray-50 dark:bg-brand-darker text-gray-700 dark:text-gray-300 hover:text-gray-950 dark:hover:text-white"
            }`}
            title={isZenMode ? "Thoát chế độ tập trung" : "Chế độ tập trung (ẩn lý thuyết)"}
          >
            {isZenMode ? (
              <Minimize2 className="h-3.5 w-3.5" />
            ) : (
              <Maximize2 className="h-3.5 w-3.5" />
            )}
            <span className="hidden md:inline">{isZenMode ? "Thu nhỏ" : "Tập trung"}</span>
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Save Status Notification */}
          {savedStatus && (
            <span className="flex items-center gap-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 animate-fadeIn">
              <Save className="h-3 w-3" />
              {savedStatus}
            </span>
          )}

          {/* Submission History Button */}
          <button
            onClick={openHistoryModal}
            className="flex items-center gap-1.5 rounded-md border border-gray-200 dark:border-brand-border bg-gray-50 dark:bg-brand-darker px-2.5 py-1 text-xs text-gray-700 dark:text-gray-300 hover:text-gray-950 dark:hover:text-white transition"
            title="Xem lịch sử nộp bài của bài học này"
          >
            <History className="h-3.5 w-3.5 text-gray-500 dark:text-gray-400" />
            <span className="hidden sm:inline">Lịch sử</span>
          </button>

          {/* Download .py Button */}
          <button
            onClick={handleDownloadCode}
            className="flex items-center gap-1.5 rounded-md border border-gray-200 dark:border-brand-border bg-gray-50 dark:bg-brand-darker px-2.5 py-1 text-xs text-gray-700 dark:text-gray-300 hover:text-gray-950 dark:hover:text-white transition"
            title="Tải mã nguồn (.py) về máy tính"
          >
            <Download className="h-3.5 w-3.5 text-gray-500 dark:text-gray-400" />
            <span className="hidden sm:inline">Tải .py</span>
          </button>

          {/* Admin View Solution Button */}
          {isAdmin && lesson?.solution_code && (
            <button
              onClick={() => setShowAdminSolution(!showAdminSolution)}
              className="flex items-center gap-1 rounded-md border border-purple-500/30 bg-purple-500/10 px-2.5 py-1 text-xs font-semibold text-purple-700 dark:text-purple-300 hover:bg-purple-500/20 transition"
              title="Xem đáp án tham khảo (Chỉ dành cho Admin)"
            >
              {showAdminSolution ? (
                <>
                  <EyeOff className="h-3.5 w-3.5" /> Ẩn đáp án
                </>
              ) : (
                <>
                  <Eye className="h-3.5 w-3.5" /> Đáp án (Admin)
                </>
              )}
            </button>
          )}

          <button
            onClick={handleResetCode}
            className="flex items-center gap-1.5 rounded-md border border-gray-200 dark:border-brand-border bg-gray-50 dark:bg-brand-darker px-2.5 py-1 text-xs text-gray-700 dark:text-gray-400 hover:text-gray-950 dark:hover:text-white transition"
            title="Khôi phục mã ban đầu"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Khôi phục</span>
          </button>

          <button
            onClick={handleRunCode}
            disabled={isRunning || !isReady}
            title="Chạy code (Ctrl + Enter)"
            className="flex items-center gap-1.5 rounded-md bg-sky-600 px-3.5 py-1 text-xs font-semibold text-white shadow-sm hover:bg-sky-500 disabled:opacity-50 transition"
          >
            {isRunning ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" /> Chạy code...
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5" /> Chạy code
              </>
            )}
          </button>

          <button
            onClick={handleSubmit}
            disabled={submitting || !isReady}
            className="flex items-center gap-1.5 rounded-md bg-emerald-600 px-4 py-1 text-xs font-semibold text-white shadow-sm hover:bg-emerald-500 disabled:opacity-50 transition"
          >
            {submitting ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" /> Đang chấm...
              </>
            ) : (
              <>
                <Send className="h-3.5 w-3.5" /> Nộp bài
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main 3-Pane Responsive Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* Left Pane: Theory & Requirements */}
        {!isZenMode && (
          <div className="hidden lg:flex lg:col-span-4 flex-col border-r border-gray-200 dark:border-brand-border bg-white dark:bg-brand-darker/60 overflow-y-auto p-6 transition-colors">
            <div className="space-y-4">
              <MarkdownViewer content={lesson?.description_md || ""} />

              {/* Test Cases Preview */}
              {lesson?.test_cases && (
                <div className="mt-6 rounded-lg border border-gray-200 dark:border-brand-border bg-slate-50 dark:bg-brand-dark/90 p-3 shadow-sm transition-colors">
                  <div className="text-xs font-bold text-gray-900 dark:text-gray-200 mb-2">
                    Bộ kiểm thử mẫu (Test Cases):
                  </div>
                  <div className="space-y-2">
                    {lesson.test_cases.map((tc: any, i: number) => (
                      <div
                        key={i}
                        className="rounded border border-gray-200 dark:border-brand-border/40 bg-white dark:bg-black/40 p-2.5 text-[11px] font-mono text-gray-800 dark:text-gray-300"
                      >
                        <div className="text-gray-500 dark:text-gray-400 font-sans font-medium mb-1">
                          {tc.name}
                        </div>
                        <div className="text-emerald-700 dark:text-emerald-400 font-semibold">
                          Gọi: {tc.call}
                        </div>
                        <div className="text-gray-600 dark:text-gray-400">
                          Kỳ vọng: {JSON.stringify(tc.expected)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Center Pane: Monaco Code Editor with Auth Overlay */}
        <div
          className={`relative col-span-1 ${
            isZenMode ? "lg:col-span-7" : "lg:col-span-4"
          } flex flex-col border-r border-gray-200 dark:border-brand-border bg-white dark:bg-brand-dark overflow-hidden p-2 transition-colors`}
        >
          <div className="flex items-center justify-between px-2 py-1 text-xs text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <span className="font-mono font-medium">solution.py</span>
              {/* Font Size controls */}
              <div className="flex items-center gap-1 rounded border border-gray-200 dark:border-brand-border bg-gray-50 dark:bg-brand-darker px-1.5 py-0.5">
                <button
                  onClick={() => handleFontSizeChange(-1)}
                  disabled={editorFontSize <= 12}
                  className="px-1 text-[10px] font-bold text-gray-600 dark:text-gray-300 hover:text-gray-950 dark:hover:text-white disabled:opacity-30 transition"
                  title="Giảm cỡ chữ"
                >
                  A-
                </button>
                <span className="text-[10px] font-mono font-semibold text-gray-600 dark:text-gray-300">
                  {editorFontSize}px
                </span>
                <button
                  onClick={() => handleFontSizeChange(1)}
                  disabled={editorFontSize >= 22}
                  className="px-1 text-[10px] font-bold text-gray-600 dark:text-gray-300 hover:text-gray-950 dark:hover:text-white disabled:opacity-30 transition"
                  title="Tăng cỡ chữ"
                >
                  A+
                </button>
              </div>
            </div>
            <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
              {isReady ? "Pyodide WASM Ready" : "Khởi tạo Pyodide..."}
            </span>
          </div>

          <div className="flex-1 overflow-hidden relative">
            <MonacoEditor value={code} onChange={setCode} fontSize={editorFontSize} />

            {/* Auth Gate Blocking Overlay when unauthenticated */}
            {mounted && !isAuthenticated && (
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-900/50 dark:bg-gray-950/80 backdrop-blur-sm p-6 text-center rounded-lg animate-fadeIn">
                <div className="max-w-xs sm:max-w-sm rounded-xl border border-gray-200 dark:border-brand-border bg-white dark:bg-brand-card/95 p-6 shadow-2xl text-gray-900 dark:text-white transition-colors">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                    <Lock className="h-6 w-6" />
                  </div>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white">
                    Yêu cầu Đăng nhập
                  </h3>
                  <p className="mt-2 text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                    Vui lòng đăng nhập hoặc đăng ký tài khoản để viết mã, chạy thử nghiệm với WebAssembly, lưu bản nháp và tích lũy XP.
                  </p>
                  <div className="mt-5 flex flex-col sm:flex-row items-center justify-center gap-2.5">
                    <Link
                      href={`/login?redirect=/learn/${dayNumber}`}
                      className="w-full sm:w-auto flex items-center justify-center gap-1.5 rounded-lg bg-emerald-600 dark:bg-emerald-500 px-4 py-2 text-xs font-semibold text-white shadow hover:bg-emerald-500 dark:hover:bg-emerald-400 transition"
                    >
                      <LogIn className="h-3.5 w-3.5" /> Đăng nhập
                    </Link>
                    <Link
                      href={`/register?redirect=/learn/${dayNumber}`}
                      className="w-full sm:w-auto flex items-center justify-center gap-1.5 rounded-lg border border-gray-300 dark:border-brand-border bg-gray-50 dark:bg-brand-dark px-4 py-2 text-xs font-semibold text-gray-700 dark:text-gray-200 hover:text-gray-950 dark:hover:text-white transition"
                    >
                      <UserPlus className="h-3.5 w-3.5" /> Đăng ký
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Admin Solution Code Panel Toggle */}
          {isAdmin && showAdminSolution && lesson?.solution_code && (
            <div className="mt-2 rounded-lg border border-purple-300 dark:border-purple-500/30 bg-purple-50 dark:bg-purple-950/20 p-3 max-h-48 overflow-y-auto">
              <div className="text-[11px] font-bold text-purple-700 dark:text-purple-400 mb-1 flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5" /> Mã giải pháp mẫu (Admin Preview):
              </div>
              <pre className="text-xs font-mono text-purple-950 dark:text-purple-200 whitespace-pre-wrap">
                {lesson.solution_code}
              </pre>
            </div>
          )}
        </div>

        {/* Right Pane: Console & Conditional Algorithm Visualizer */}
        <div
          className={`col-span-1 ${
            isZenMode ? "lg:col-span-5" : "lg:col-span-4"
          } flex flex-col bg-white dark:bg-brand-darker overflow-hidden transition-colors`}
        >
          {/* Tab Header (Only shows Visualizer tab if lesson.has_visualizer is true) */}
          <div className="flex h-10 w-full items-center justify-between border-b border-gray-200 dark:border-brand-border bg-gray-50 dark:bg-brand-dark px-3 transition-colors">
            {lesson?.has_visualizer ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab("console")}
                  className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md transition ${
                    activeTab === "console"
                      ? "bg-white dark:bg-brand-border/40 text-emerald-700 dark:text-emerald-400 shadow-sm border border-gray-200 dark:border-transparent"
                      : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
                  }`}
                >
                  <TerminalIcon className="h-3.5 w-3.5" />
                  Console & Chấm điểm
                </button>
                <button
                  onClick={() => setActiveTab("visualizer")}
                  className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md transition ${
                    activeTab === "visualizer"
                      ? "bg-white dark:bg-brand-border/40 text-sky-700 dark:text-sky-400 shadow-sm border border-gray-200 dark:border-transparent"
                      : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
                  }`}
                >
                  <Activity className="h-3.5 w-3.5" />
                  Algorithm Visualizer
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-800 dark:text-gray-300">
                <TerminalIcon className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                Console & Kết quả Chấm điểm
              </div>
            )}
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {lesson?.has_visualizer && activeTab === "visualizer" ? (
              <AlgorithmVisualizer />
            ) : (
              <div className="space-y-4">
                {/* Submission Banner (if exists) */}
                {submissionFeedback && (
                  <div
                    className={`rounded-lg border p-3 flex items-center justify-between text-xs ${
                      submissionFeedback.status === "PASSED"
                        ? "border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-300"
                        : "border-rose-500/30 bg-rose-50 dark:bg-rose-500/10 text-rose-800 dark:text-rose-300"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {submissionFeedback.status === "PASSED" ? (
                        <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <XCircle className="h-4 w-4 text-rose-600 dark:text-rose-400" />
                      )}
                      <span>
                        {submissionFeedback.status === "PASSED"
                          ? "Chúc mừng! Bạn đã hoàn thành xuất sắc bài tập."
                          : "Chưa vượt qua tất cả kiểm thử. Hãy kiểm tra lại logic nhé!"}
                      </span>
                    </div>
                    {submissionFeedback.xp_earned > 0 && (
                      <span className="flex items-center gap-1 font-bold text-amber-600 dark:text-amber-400">
                        <Sparkles className="h-3.5 w-3.5" /> +
                        {submissionFeedback.xp_earned} XP
                      </span>
                    )}
                  </div>
                )}

                {/* Test Results Badges */}
                {output.testResults.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-xs font-bold text-gray-800 dark:text-gray-300">
                      Kết quả Kiểm thử ({output.testResults.filter((t) => t.passed).length}/
                      {output.testResults.length}):
                    </div>
                    {output.testResults.map((tr, idx) => (
                      <div
                        key={idx}
                        className={`rounded-md border p-2.5 text-xs ${
                          tr.passed
                            ? "border-emerald-300 dark:border-emerald-500/30 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-900 dark:text-emerald-300"
                            : "border-rose-300 dark:border-rose-500/30 bg-rose-50 dark:bg-rose-950/20 text-rose-900 dark:text-rose-300"
                        }`}
                      >
                        <div className="flex items-center justify-between font-semibold">
                          <span className="flex items-center gap-1.5">
                            {tr.passed ? (
                              <CheckCircle className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                            ) : (
                              <XCircle className="h-3.5 w-3.5 text-rose-600 dark:text-rose-400" />
                            )}
                            {tr.name}
                          </span>
                          <span className="text-[10px] font-bold">
                            {tr.passed ? "ĐẠT" : "KHÔNG ĐẠT"}
                          </span>
                        </div>
                        {!tr.passed && (
                          <div className="mt-1.5 space-y-0.5 font-mono text-[11px] text-gray-700 dark:text-gray-400">
                            <div>Kỳ vọng: {JSON.stringify(tcExpected(tr.expected))}</div>
                            <div>Thực tế: {JSON.stringify(tr.actual || tr.error)}</div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Standard Output (stdout) */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-gray-700 dark:text-gray-300 font-semibold">
                    <span>Đầu ra tiêu chuẩn (stdout):</span>
                    <div className="flex items-center gap-3">
                      {output.executionTimeMs > 0 && (
                        <span className="flex items-center gap-1 text-[11px] text-gray-500">
                          <Clock className="h-3 w-3" /> {output.executionTimeMs} ms
                        </span>
                      )}
                      <button
                        onClick={() => setIsConsoleCleared(true)}
                        className="text-[11px] text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition"
                      >
                        Xóa output
                      </button>
                    </div>
                  </div>
                  <pre className="min-h-[120px] rounded-md border border-slate-700 dark:border-brand-border/60 bg-slate-900 p-3 font-mono text-xs text-slate-100 whitespace-pre-wrap overflow-x-auto shadow-sm">
                    {isConsoleCleared ? (
                      <span className="text-gray-500 italic">Console đã được xóa.</span>
                    ) : output.stdout ? (
                      output.stdout
                    ) : (
                      <span className="text-gray-400 italic">
                        Kết quả `print()` sẽ hiển thị tại đây khi bạn bấm &quot;Chạy code&quot;...
                      </span>
                    )}
                  </pre>
                </div>

                {/* Error / Traceback */}
                {output.error && (
                  <div className="space-y-1.5">
                    <div className="text-xs text-rose-600 dark:text-rose-400 font-semibold">
                      Thông báo lỗi (stderr / Traceback):
                    </div>
                    <pre className="rounded-md border border-rose-300 dark:border-rose-500/30 bg-rose-50 dark:bg-rose-950/30 p-3 font-mono text-xs text-rose-900 dark:text-rose-300 whitespace-pre-wrap overflow-x-auto">
                      {output.error}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Submission History Modal */}
      {showHistory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="w-full max-w-lg rounded-2xl border border-gray-200 dark:border-brand-border bg-white dark:bg-brand-card p-6 shadow-2xl transition-colors">
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-brand-border/60 pb-3">
              <div className="flex items-center gap-2">
                <History className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                <h3 className="font-bold text-base text-gray-900 dark:text-white">
                  Lịch sử Nộp bài (Ngày {dayNumber})
                </h3>
              </div>
              <button
                onClick={() => setShowHistory(false)}
                className="rounded-lg p-1 text-gray-400 hover:text-gray-900 dark:hover:text-white transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 max-h-[350px] overflow-y-auto space-y-2.5">
              {!isAuthenticated ? (
                <div className="p-4 text-center text-xs text-gray-500">
                  Vui lòng đăng nhập để xem lịch sử nộp bài cá nhân.
                </div>
              ) : loadingHistory ? (
                <div className="p-8 flex items-center justify-center text-xs text-gray-400 gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-emerald-500" /> Đang tải lịch sử...
                </div>
              ) : historyList.length === 0 ? (
                <div className="p-8 text-center text-xs text-gray-500">
                  Chưa có lần nộp bài nào cho bài học này.
                </div>
              ) : (
                historyList.map((item, idx) => (
                  <div
                    key={item.id || idx}
                    className="rounded-xl border border-gray-200 dark:border-brand-border/60 bg-gray-50 dark:bg-brand-dark/70 p-3 text-xs flex flex-col gap-2"
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-bold text-[10px] ${
                          item.status === "PASSED"
                            ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20"
                            : "bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/20"
                        }`}
                      >
                        {item.status === "PASSED" ? (
                          <CheckCircle className="h-3 w-3" />
                        ) : (
                          <XCircle className="h-3 w-3" />
                        )}
                        {item.status === "PASSED" ? "ĐẠT (PASSED)" : "CHƯA ĐẠT"}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] text-gray-500">
                        <Calendar className="h-3 w-3" />
                        {new Date(item.created_at).toLocaleString("vi-VN")}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-gray-600 dark:text-gray-400">
                      <span>Kiểm thử: {item.tests_passed}/{item.tests_total} đạt</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {item.execution_time_ms} ms
                      </span>
                    </div>

                    {item.submitted_code && (
                      <button
                        onClick={() => {
                          setCode(item.submitted_code);
                          setShowHistory(false);
                        }}
                        className="mt-1 flex items-center justify-center gap-1.5 rounded-md border border-gray-300 dark:border-brand-border bg-white dark:bg-brand-darker py-1 text-[11px] font-medium text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition"
                      >
                        <FileCode className="h-3 w-3" /> Nạp mã nguồn lần nộp này vào Editor
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Curriculum 60-Day Quick Navigator Modal */}
      {showCurriculumModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="w-full max-w-3xl max-h-[85vh] flex flex-col rounded-2xl border border-gray-200 dark:border-brand-border bg-white dark:bg-brand-card shadow-2xl overflow-hidden transition-colors">
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-brand-border/60 p-4">
              <div className="flex items-center gap-2">
                <Layers className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                <div>
                  <h3 className="font-bold text-base text-gray-900 dark:text-white">
                    Lộ trình Huấn luyện 60 Ngày
                  </h3>
                  <p className="text-[11px] text-gray-500">Chuyển đổi bài học nhanh chóng</p>
                </div>
              </div>
              <button
                onClick={() => setShowCurriculumModal(false)}
                className="rounded-lg p-1 text-gray-400 hover:text-gray-900 dark:hover:text-white transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Stage tabs and search filter */}
            <div className="p-4 border-b border-gray-100 dark:border-brand-border/40 flex flex-col sm:flex-row items-center justify-between gap-3 bg-gray-50/50 dark:bg-brand-dark/40">
              <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
                <button
                  onClick={() => setCurriculumStage("all")}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                    curriculumStage === "all"
                      ? "bg-emerald-600 text-white"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  Tất cả
                </button>
                <button
                  onClick={() => setCurriculumStage(1)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                    curriculumStage === 1
                      ? "bg-emerald-600 text-white"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  GĐ 1 (1-20)
                </button>
                <button
                  onClick={() => setCurriculumStage(2)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                    curriculumStage === 2
                      ? "bg-emerald-600 text-white"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  GĐ 2 (21-40)
                </button>
                <button
                  onClick={() => setCurriculumStage(3)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                    curriculumStage === 3
                      ? "bg-emerald-600 text-white"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  GĐ 3 (41-60)
                </button>
              </div>

              <div className="relative w-full sm:w-60">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm theo ngày hoặc từ khóa..."
                  value={curriculumSearch}
                  onChange={(e) => setCurriculumSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1 rounded-lg border border-gray-200 dark:border-brand-border bg-white dark:bg-brand-dark text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* List of lessons */}
            <div className="flex-1 overflow-y-auto p-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {(allLessons.length > 0
                ? allLessons
                : Array.from({ length: 60 }, (_, i) => ({
                    id: i + 1,
                    day_number: i + 1,
                    stage: i < 20 ? 1 : i < 40 ? 2 : 3,
                    title: `Ngày ${i + 1 < 10 ? "0" + (i + 1) : i + 1}: Bài học Python`,
                    has_visualizer: [5, 6, 15, 16, 17, 18, 19, 20].includes(i + 1),
                    is_completed: i + 1 === 1,
                  }))
              )
                .filter((l) => {
                  if (curriculumStage !== "all" && l.stage !== curriculumStage) return false;
                  if (curriculumSearch.trim()) {
                    const q = curriculumSearch.toLowerCase();
                    return l.title?.toLowerCase().includes(q) || String(l.day_number) === q;
                  }
                  return true;
                })
                .map((l) => {
                  const isCurrent = l.day_number === dayNumber;
                  return (
                    <button
                      key={l.id || l.day_number}
                      onClick={() => {
                        router.push(`/learn/${l.day_number}`);
                        setShowCurriculumModal(false);
                      }}
                      className={`flex items-center justify-between rounded-xl p-3 text-left border text-xs transition ${
                        isCurrent
                          ? "border-emerald-500 bg-emerald-500/10 text-emerald-900 dark:text-emerald-300 font-bold"
                          : "border-gray-200 dark:border-brand-border/60 bg-gray-50/50 dark:bg-brand-dark/50 text-gray-700 dark:text-gray-200 hover:border-emerald-500/50 hover:bg-white dark:hover:bg-brand-dark"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <span className="font-mono font-bold text-gray-500 dark:text-gray-400 shrink-0">
                          #{l.day_number < 10 ? "0" + l.day_number : l.day_number}
                        </span>
                        <span className="truncate">{l.title}</span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0 ml-2">
                        {l.has_visualizer && (
                          <span className="rounded bg-sky-500/15 text-sky-700 dark:text-sky-400 px-1.5 py-0.5 text-[9px] font-bold">
                            2D
                          </span>
                        )}
                        {isCurrent ? (
                          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                            Đang học
                          </span>
                        ) : l.is_completed ? (
                          <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                        ) : null}
                      </div>
                    </button>
                  );
                })}
            </div>
          </div>
        </div>
      )}

      {/* Python Quick Cheatsheet Drawer/Modal */}
      {showCheatsheet && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="w-full max-w-2xl max-h-[85vh] flex flex-col rounded-2xl border border-gray-200 dark:border-brand-border bg-white dark:bg-brand-card shadow-2xl overflow-hidden transition-colors">
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-brand-border/60 p-4">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-sky-600 dark:text-sky-400" />
                <div>
                  <h3 className="font-bold text-base text-gray-900 dark:text-white">
                    Sổ tay Cú pháp Python Nhanh (Cheatsheet)
                  </h3>
                  <p className="text-[11px] text-gray-500">Bấm nút sao chép để dán vào trình soạn thảo</p>
                </div>
              </div>
              <button
                onClick={() => setShowCheatsheet(false)}
                className="rounded-lg p-1 text-gray-400 hover:text-gray-900 dark:hover:text-white transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-3 border-b border-gray-100 dark:border-brand-border/40 bg-gray-50/50 dark:bg-brand-dark/40">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm cú pháp (vd: print, range, list, f-string, dict)..."
                  value={cheatsheetSearch}
                  onChange={(e) => setCheatsheetSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-gray-200 dark:border-brand-border bg-white dark:bg-brand-dark text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>
            </div>

            {/* Cheatsheet Snippets list */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {[
                { title: "In ra màn hình (print)", code: 'print("Xin chào", end="\\n")', desc: "In dữ liệu kèm ký tự kết thúc tùy chỉnh." },
                { title: "Định dạng chuỗi (F-string)", code: 'name = "Python"\nf"Học {name} rất vui!"', desc: "Định dạng chuỗi biểu thức nội suy tốc độ cao." },
                { title: "Độ dài phần tử (len)", code: "total = len(items_list)", desc: "Lấy số lượng phần tử chuỗi, list, tuple, dict." },
                { title: "Dãy số (range)", code: "for i in range(1, 10, 2):  # 1, 3, 5, 7, 9\n    print(i)", desc: "Sinh dãy số nguyên (bắt đầu, kết thúc, bước nhảy)." },
                { title: "Lặp kèm chỉ số (enumerate)", code: "for idx, item in enumerate(my_list):\n    print(idx, item)", desc: "Lấy đồng thời vị trí chỉ số index và giá trị item." },
                { title: "Thêm phần tử vào List (append)", code: "my_list.append(new_item)", desc: "Thêm một phần tử vào cuối danh sách." },
                { title: "Sắp xếp List tại chỗ (sort)", code: "numbers.sort(reverse=False)", desc: "Sắp xếp danh sách theo thứ tự tăng dần hoặc giảm dần." },
                { title: "Lấy giá trị Dict an toàn (get)", code: 'value = user.get("age", 18)', desc: "Lấy giá trị theo khóa, trả về giá trị mặc định nếu không tồn tại." },
                { title: "Toán tử 3 ngôi (Ternary)", code: 'result = "Đỗ" if score >= 5.0 else "Trượt"', desc: "Viết biểu thức điều kiện if-else trên một dòng." },
                { title: "Xử lý ngoại lệ (try-except)", code: "try:\n    res = 10 / divisor\nexcept ZeroDivisionError:\n    res = 0", desc: "Bắt lỗi và xử lý ngoại lệ trong lúc chạy chương trình." },
              ]
                .filter((item) => {
                  if (!cheatsheetSearch.trim()) return true;
                  const q = cheatsheetSearch.toLowerCase();
                  return item.title.toLowerCase().includes(q) || item.code.toLowerCase().includes(q) || item.desc.toLowerCase().includes(q);
                })
                .map((item, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-gray-200 dark:border-brand-border bg-gray-50/50 dark:bg-brand-dark/60 p-3 flex flex-col gap-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-gray-900 dark:text-white">
                        {item.title}
                      </span>
                      <button
                        onClick={() => handleCopySnippet(item.code)}
                        className="flex items-center gap-1 rounded bg-white dark:bg-brand-darker border border-gray-200 dark:border-brand-border px-2 py-0.5 text-[10px] font-semibold text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition"
                      >
                        {copiedSnippet === item.code ? (
                          <>
                            <Check className="h-3 w-3 text-emerald-500" /> Đã sao chép!
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3" /> Sao chép
                          </>
                        )}
                      </button>
                    </div>
                    <pre className="rounded bg-slate-900 p-2 font-mono text-[11px] text-emerald-300 overflow-x-auto whitespace-pre">
                      {item.code}
                    </pre>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400">
                      {item.desc}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function tcExpected(expected: any) {
  return expected;
}
