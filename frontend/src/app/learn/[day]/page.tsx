"use client";

import { useEffect, useState, useRef, useTransition } from "react";
import { useParams, useRouter } from "next/navigation";
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
} from "lucide-react";
import { MonacoEditor } from "@/components/editor/MonacoEditor";
import { AlgorithmVisualizer } from "@/components/visualizer/AlgorithmVisualizer";
import { usePyodide } from "@/lib/pyodide/usePyodide";
import { api } from "@/lib/api";
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

  const { isReady, isRunning, output, runCode, runCodeAsync } = usePyodide();
  const { updateXpAndStreak } = useLessonStore();

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
        };
        setLesson(fallback);
        setCode(fallback.starter_code);
      }
    }
    fetchLesson();
  }, [dayNumber]);

  // Debounced Autosave to localStorage & Backend
  useEffect(() => {
    if (!code || !dayNumber) return;
    localStorage.setItem(`pysphere_draft_day_${dayNumber}`, code);

    const timer = setTimeout(() => {
      api.syncDraft(dayNumber, code).catch(() => {});
    }, 1500);

    return () => clearTimeout(timer);
  }, [code, dayNumber]);

  // Handle Run Code (Client-Side WASM)
  const handleRunCode = () => {
    setActiveTab("console");
    runCode(code, lesson?.test_cases || []);
  };

  // Handle Submit Solution (Promise-based, zero race condition)
  const handleSubmit = async () => {
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
    <div className="flex-1 flex flex-col h-[calc(100vh-3.5rem)] overflow-hidden">
      {/* Top Workspace Toolbar */}
      <div className="flex h-12 w-full items-center justify-between border-b border-brand-border bg-brand-dark px-4">
        {/* Navigation & Lesson Title */}
        <div className="flex items-center gap-3 truncate">
          <button
            onClick={() => router.push(`/learn/${Math.max(1, dayNumber - 1)}`)}
            disabled={dayNumber <= 1}
            className="rounded p-1 text-gray-400 hover:bg-brand-border/40 hover:text-white disabled:opacity-30 transition"
            title="Bài trước"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="font-semibold text-sm text-white truncate">
            {lesson?.title || `Ngày ${dayNumber}`}
          </span>
          <button
            onClick={() => router.push(`/learn/${Math.min(60, dayNumber + 1)}`)}
            disabled={dayNumber >= 60}
            className="rounded p-1 text-gray-400 hover:bg-brand-border/40 hover:text-white disabled:opacity-30 transition"
            title="Bài kế tiếp"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleResetCode}
            className="flex items-center gap-1.5 rounded-md border border-brand-border bg-brand-darker px-2.5 py-1 text-xs text-gray-400 hover:text-white transition"
            title="Khôi phục mã ban đầu"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Khôi phục</span>
          </button>

          <button
            onClick={handleRunCode}
            disabled={isRunning || !isReady}
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
        <div className="hidden lg:flex lg:col-span-4 flex-col border-r border-brand-border bg-brand-darker/60 overflow-y-auto p-6">
          <div className="prose prose-invert prose-sm max-w-none space-y-4">
            <div className="whitespace-pre-wrap font-sans text-xs leading-relaxed text-gray-300">
              {lesson?.description_md || "Đang tải bài giảng..."}
            </div>

            {/* Test Cases Preview */}
            {lesson?.test_cases && (
              <div className="mt-6 rounded-lg border border-brand-border bg-brand-dark/90 p-3">
                <div className="text-xs font-bold text-gray-300 mb-2">
                  Bộ kiểm thử mẫu (Test Cases):
                </div>
                <div className="space-y-2">
                  {lesson.test_cases.map((tc: any, i: number) => (
                    <div
                      key={i}
                      className="rounded border border-brand-border/40 bg-black/40 p-2 text-[11px] font-mono text-gray-300"
                    >
                      <div className="text-gray-400">{tc.name}</div>
                      <div className="text-emerald-400">Gọi: {tc.call}</div>
                      <div className="text-gray-400">
                        Kỳ vọng: {JSON.stringify(tc.expected)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Center Pane: Monaco Code Editor */}
        <div className="col-span-1 lg:col-span-4 flex flex-col border-r border-brand-border bg-brand-dark overflow-hidden p-2">
          <div className="flex items-center justify-between px-2 py-1 text-xs text-gray-400">
            <span>solution.py</span>
            <span className="text-[11px] text-gray-500">
              {isReady ? "Pyodide WASM Ready" : "Khởi tạo Pyodide..."}
            </span>
          </div>
          <div className="flex-1 overflow-hidden">
            <MonacoEditor value={code} onChange={setCode} />
          </div>
        </div>

        {/* Right Pane: Console & Algorithm Visualizer Tabs */}
        <div className="col-span-1 lg:col-span-4 flex flex-col bg-brand-darker overflow-hidden">
          {/* Tab Header */}
          <div className="flex h-10 w-full items-center border-b border-brand-border bg-brand-dark px-3 gap-2">
            <button
              onClick={() => setActiveTab("console")}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md transition ${
                activeTab === "console"
                  ? "bg-brand-border/40 text-emerald-400"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              <TerminalIcon className="h-3.5 w-3.5" />
              Console & Chấm điểm
            </button>
            <button
              onClick={() => setActiveTab("visualizer")}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md transition ${
                activeTab === "visualizer"
                  ? "bg-brand-border/40 text-sky-400"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              <Activity className="h-3.5 w-3.5" />
              Algorithm Visualizer
            </button>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {activeTab === "console" ? (
              <div className="space-y-4">
                {/* Submission Banner (if exists) */}
                {submissionFeedback && (
                  <div
                    className={`rounded-lg border p-3 flex items-center justify-between text-xs ${
                      submissionFeedback.status === "PASSED"
                        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                        : "border-rose-500/30 bg-rose-500/10 text-rose-300"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {submissionFeedback.status === "PASSED" ? (
                        <CheckCircle className="h-4 w-4 text-emerald-400" />
                      ) : (
                        <XCircle className="h-4 w-4 text-rose-400" />
                      )}
                      <span>
                        {submissionFeedback.status === "PASSED"
                          ? "Chúc mừng! Bạn đã hoàn thành xuất sắc bài tập."
                          : "Chưa vượt qua tất cả kiểm thử. Hãy kiểm tra lại logic nhé!"}
                      </span>
                    </div>
                    {submissionFeedback.xp_earned > 0 && (
                      <span className="flex items-center gap-1 font-bold text-amber-400">
                        <Sparkles className="h-3.5 w-3.5" /> +
                        {submissionFeedback.xp_earned} XP
                      </span>
                    )}
                  </div>
                )}

                {/* Test Results Badges */}
                {output.testResults.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-xs font-bold text-gray-300">
                      Kết quả Kiểm thử ({output.testResults.filter((t) => t.passed).length}/
                      {output.testResults.length}):
                    </div>
                    {output.testResults.map((tr, idx) => (
                      <div
                        key={idx}
                        className={`rounded-md border p-2.5 text-xs ${
                          tr.passed
                            ? "border-emerald-500/30 bg-emerald-950/20 text-emerald-300"
                            : "border-rose-500/30 bg-rose-950/20 text-rose-300"
                        }`}
                      >
                        <div className="flex items-center justify-between font-semibold">
                          <span className="flex items-center gap-1.5">
                            {tr.passed ? (
                              <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
                            ) : (
                              <XCircle className="h-3.5 w-3.5 text-rose-400" />
                            )}
                            {tr.name}
                          </span>
                          <span className="text-[10px]">
                            {tr.passed ? "ĐẠT" : "KHÔNG ĐẠT"}
                          </span>
                        </div>
                        {!tr.passed && (
                          <div className="mt-1.5 space-y-0.5 font-mono text-[11px] text-gray-400">
                            <div>Kỳ vọng: {JSON.stringify(tr.expected)}</div>
                            <div>Thực tế: {JSON.stringify(tr.actual || tr.error)}</div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Standard Output (stdout) */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-gray-400 font-semibold">
                    <span>Đầu ra tiêu chuẩn (stdout):</span>
                    {output.executionTimeMs > 0 && (
                      <span className="flex items-center gap-1 text-[11px] text-gray-500">
                        <Clock className="h-3 w-3" /> {output.executionTimeMs} ms
                      </span>
                    )}
                  </div>
                  <pre className="min-h-[120px] rounded-md border border-brand-border/60 bg-black/60 p-3 font-mono text-xs text-gray-200 whitespace-pre-wrap overflow-x-auto">
                    {output.stdout || (
                      <span className="text-gray-500 italic">
                        Kết quả `print()` sẽ hiển thị tại đây khi bạn bấm &quot;Chạy code&quot;...
                      </span>
                    )}
                  </pre>
                </div>

                {/* Error / Traceback */}
                {output.error && (
                  <div className="space-y-1.5">
                    <div className="text-xs text-rose-400 font-semibold">
                      Thông báo lỗi (stderr / Traceback):
                    </div>
                    <pre className="rounded-md border border-rose-500/30 bg-rose-950/30 p-3 font-mono text-xs text-rose-300 whitespace-pre-wrap overflow-x-auto">
                      {output.error}
                    </pre>
                  </div>
                )}
              </div>
            ) : (
              <AlgorithmVisualizer />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

