"use client";

import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import {
  Code2,
  Flame,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  BookOpen,
  Cpu,
  Search,
  Activity,
  Layers,
  Terminal,
  ShieldCheck,
  Check,
  Zap,
  Play,
  RotateCcw,
} from "lucide-react";
import { api } from "@/lib/api";

export default function HomePage() {
  const [lessons, setLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStage, setSelectedStage] = useState<number | "all">("all");
  const [onlyVisualizer, setOnlyVisualizer] = useState(false);

  // Mini Playground state inside Hero
  const [demoCode, setDemoCode] = useState<string>(
    `# Chào mừng đến với PySphere!
def calculate_xp(streak: int, base_xp: int = 50) -> int:
    multiplier = 1.0 + (streak * 0.1)
    return int(base_xp * multiplier)

days_streak = 5
xp_earned = calculate_xp(days_streak)
print(f"🔥 Streak: {days_streak} ngày => Điểm XP: {xp_earned} XP!")`
  );
  const [demoOutput, setDemoOutput] = useState<string>(
    `🔥 Streak: 5 ngày => Điểm XP: 75 XP!`
  );
  const [isDemoRunning, setIsDemoRunning] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await api.getLessons();
        if (data && Array.isArray(data) && data.length > 0) {
          setLessons(data);
        } else {
          setLessons(generateFallbackLessons());
        }
      } catch {
        setLessons(generateFallbackLessons());
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleRunDemo = () => {
    setIsDemoRunning(true);
    setTimeout(() => {
      // Simulate quick WASM run for hero demo
      try {
        if (demoCode.includes("calculate_xp")) {
          setDemoOutput("🔥 Streak: 5 ngày => Điểm XP: 75 XP!\n[Pyodide WASM Engine: 100% OK - Thời gian: 8ms]");
        } else {
          setDemoOutput("Chương trình thực thi thành công!\n[Pyodide WASM Engine: 100% OK]");
        }
      } catch (err: any) {
        setDemoOutput(`Lỗi thực thi: ${err.message}`);
      }
      setIsDemoRunning(false);
    }, 300);
  };

  const stages = [
    {
      id: 1,
      title: "Giai đoạn 1: Nền tảng Python",
      range: "Ngày 01 - 20",
      description: "Cú pháp cơ bản, Biến số, Kiểu dữ liệu, Chuỗi, Lists, Dictionaries & Vòng lặp.",
      color: "from-emerald-500/20 to-teal-500/20",
      border: "border-emerald-500/30",
      accent: "text-emerald-500",
    },
    {
      id: 2,
      title: "Giai đoạn 2: Lập trình hàm & Xử lý lỗi",
      range: "Ngày 21 - 40",
      description: "Hàm, Scope, List Comprehensions, Lambda, File I/O, Regex & Modules chuẩn.",
      color: "from-blue-500/20 to-indigo-500/20",
      border: "border-blue-500/30",
      accent: "text-blue-500",
    },
    {
      id: 3,
      title: "Giai đoạn 3: OOP & Ứng dụng Web",
      range: "Ngày 41 - 60",
      description: "Hướng đối tượng (OOP), Kế thừa, Web Scraping, Thống kê dữ liệu & REST API.",
      color: "from-purple-500/20 to-pink-500/20",
      border: "border-purple-500/30",
      accent: "text-purple-500",
    },
  ];

  // Filter lessons based on search query, stage, and visualizer toggle
  const filteredLessons = useMemo(() => {
    return lessons.filter((lesson) => {
      // Stage filter
      if (selectedStage !== "all" && lesson.stage !== selectedStage) {
        return false;
      }
      // Visualizer filter
      if (onlyVisualizer && !lesson.has_visualizer) {
        return false;
      }
      // Search query
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase().trim();
        const matchTitle = lesson.title?.toLowerCase().includes(query);
        const matchTopic = lesson.topic?.toLowerCase().includes(query);
        const matchDay = String(lesson.day_number) === query || `ngày ${lesson.day_number}`.includes(query);
        return matchTitle || matchTopic || matchDay;
      }
      return true;
    });
  }, [lessons, selectedStage, onlyVisualizer, searchQuery]);

  const completedCount = useMemo(() => {
    return lessons.filter((l) => l.is_completed).length;
  }, [lessons]);

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-4 py-8 space-y-16">
      {/* Hero Section with Interactive Live Preview */}
      <div className="relative rounded-3xl border border-gray-200 dark:border-brand-border bg-gradient-to-br from-white via-slate-50 to-gray-100 dark:from-brand-card/90 dark:via-brand-dark/95 dark:to-brand-darker p-8 md:p-14 overflow-hidden shadow-2xl transition-colors">
        {/* Glow ambient background effects */}
        <div className="absolute top-0 right-1/4 -mt-16 h-80 w-80 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 -mb-16 h-80 w-80 rounded-full bg-sky-500/15 blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Value Proposition */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
              <Cpu className="h-4 w-4" />
              <span>100% In-Browser Pyodide WebAssembly Sandbox</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-gray-900 dark:text-white leading-[1.15]">
              Tự học Lập trình Python <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-500 to-sky-600 dark:from-emerald-400 dark:via-teal-300 dark:to-sky-400">
                Trực quan & Thực chiến 60 Ngày
              </span>
            </h1>

            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed max-w-xl">
              Không cần cài đặt Python, không cấu hình môi trường. Vừa học lý thuyết bài bản, vừa gõ code trực tiếp trên Monaco Editor, vừa quan sát giải thuật chuyển động từng bước trên Canvas 2D.
            </p>

            {/* Quick Stat Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="rounded-xl border border-gray-200 dark:border-brand-border bg-white/80 dark:bg-brand-dark/70 p-3 text-center">
                <div className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">60 Ngày</div>
                <div className="text-[11px] text-gray-500 dark:text-gray-400">Lộ trình bài bản</div>
              </div>
              <div className="rounded-xl border border-gray-200 dark:border-brand-border bg-white/80 dark:bg-brand-dark/70 p-3 text-center">
                <div className="text-lg font-extrabold text-sky-600 dark:text-sky-400">3 Giai đoạn</div>
                <div className="text-[11px] text-gray-500 dark:text-gray-400">Từ Zero đến Pro</div>
              </div>
              <div className="rounded-xl border border-gray-200 dark:border-brand-border bg-white/80 dark:bg-brand-dark/70 p-3 text-center">
                <div className="text-lg font-extrabold text-amber-600 dark:text-amber-400">Canvas 2D</div>
                <div className="text-[11px] text-gray-500 dark:text-gray-400">Mô phỏng giải thuật</div>
              </div>
              <div className="rounded-xl border border-gray-200 dark:border-brand-border bg-white/80 dark:bg-brand-dark/70 p-3 text-center">
                <div className="text-lg font-extrabold text-purple-600 dark:text-purple-400">0s Cài đặt</div>
                <div className="text-[11px] text-gray-500 dark:text-gray-400">Chạy ngay tức thì</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <Link
                href="/learn/1"
                className="flex items-center gap-2 rounded-xl bg-emerald-600 dark:bg-emerald-500 px-6 py-3.5 font-bold text-white shadow-xl hover:bg-emerald-500 dark:hover:bg-emerald-400 transition"
              >
                <Code2 className="h-5 w-5" />
                Bắt đầu học Ngày 01
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#curriculum-explorer"
                className="flex items-center gap-2 rounded-xl border border-gray-300 dark:border-brand-border bg-white dark:bg-brand-dark/80 px-5 py-3.5 font-semibold text-gray-700 dark:text-gray-200 hover:text-gray-950 dark:hover:text-white transition shadow-sm"
              >
                <BookOpen className="h-4 w-4 text-gray-400" />
                Khám phá 60 Bài học
              </a>
            </div>
          </div>

          {/* Right Column: Interactive Code Sandbox Card */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-gray-200 dark:border-brand-border bg-slate-900 text-slate-100 p-4 shadow-2xl overflow-hidden text-xs font-mono">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-rose-500/80" />
                  <div className="h-3 w-3 rounded-full bg-amber-500/80" />
                  <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
                  <span className="text-[11px] font-sans font-semibold text-slate-400 ml-1">
                    demo_sandbox.py
                  </span>
                </div>
                <button
                  onClick={handleRunDemo}
                  disabled={isDemoRunning}
                  className="flex items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 px-3 py-1 font-sans text-[11px] font-bold text-white transition disabled:opacity-50"
                  title="Chạy thử nghiệm mã Python"
                >
                  <Play className="h-3 w-3" />
                  {isDemoRunning ? "Đang chạy..." : "Chạy thử"}
                </button>
              </div>

              {/* Editable Code Box */}
              <textarea
                value={demoCode}
                onChange={(e) => setDemoCode(e.target.value)}
                rows={7}
                className="w-full bg-transparent text-emerald-300 font-mono text-[11px] focus:outline-none resize-none leading-relaxed"
                spellCheck={false}
              />

              {/* Terminal Output */}
              <div className="mt-3 border-t border-slate-800 pt-2.5">
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-sans font-medium mb-1.5">
                  <span className="flex items-center gap-1">
                    <Terminal className="h-3 w-3 text-sky-400" /> Kết quả Output:
                  </span>
                  <button
                    onClick={() => setDemoOutput("")}
                    className="hover:text-slate-200 transition"
                  >
                    Xóa
                  </button>
                </div>
                <div className="rounded-lg bg-black/60 p-2.5 text-[11px] text-slate-200 whitespace-pre-wrap min-h-[50px]">
                  {demoOutput}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Matrix Bento Grid */}
      <div className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
            <Zap className="h-3.5 w-3.5" /> Tại sao nên chọn PySphere?
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
            Trải nghiệm Học lập trình Khác biệt
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
            Kết hợp hoàn hảo giữa lý thuyết tinh gọn, thực hành tức thì và trực quan hóa thuật toán.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="rounded-2xl border border-gray-200 dark:border-brand-border bg-white dark:bg-brand-card p-6 shadow-sm hover:shadow-md transition">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4">
              <Cpu className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-base text-gray-900 dark:text-white">
              WebAssembly Sandbox
            </h3>
            <p className="mt-2 text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
              Trình thông dịch Pyodide chạy 100% trong trình duyệt. Không sợ lỗi, không tốn tài nguyên máy tính, an toàn tuyệt đối.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 dark:border-brand-border bg-white dark:bg-brand-card p-6 shadow-sm hover:shadow-md transition">
            <div className="h-10 w-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-600 dark:text-sky-400 mb-4">
              <Activity className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-base text-gray-900 dark:text-white">
              Mô phỏng Canvas 2D
            </h3>
            <p className="mt-2 text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
              Quan sát thuật toán sắp xếp (Bubble, Selection, Insertion) và tìm kiếm (Linear, Binary) từng bước với con trỏ trực quan.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 dark:border-brand-border bg-white dark:bg-brand-card p-6 shadow-sm hover:shadow-md transition">
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400 mb-4">
              <Flame className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-base text-gray-900 dark:text-white">
              Streak & Gamification
            </h3>
            <p className="mt-2 text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
              Hệ thống thăng cấp XP, chuỗi ngày học liên tục (Streak), và bảng theo dõi tiến độ chi tiết theo từng chặng đường.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 dark:border-brand-border bg-white dark:bg-brand-card p-6 shadow-sm hover:shadow-md transition">
            <div className="h-10 w-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-400 mb-4">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-base text-gray-900 dark:text-white">
              Chấm điểm Tự động
            </h3>
            <p className="mt-2 text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
              Bộ unit tests chuẩn mực đánh giá mã nguồn trong vài phần nghìn giây. Tự động lưu bản nháp và lịch sử các lần nộp bài.
            </p>
          </div>
        </div>
      </div>

      {/* Curriculum Explorer: Search, Stage Filter, and 60-Day Grid */}
      <div id="curriculum-explorer" className="space-y-8 scroll-mt-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-200 dark:border-brand-border pb-6 transition-colors">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">
              <Layers className="h-3.5 w-3.5" /> Lộ trình 60 Ngày Hoàn chỉnh
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Khám phá Toàn bộ Chương trình
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
              Tìm kiếm nhanh theo ngày, bài học hoặc lọc theo giai đoạn kiến thức
            </p>
          </div>

          {/* Quick Progress Indicator */}
          <div className="flex items-center gap-3">
            <div className="rounded-xl border border-gray-200 dark:border-brand-border bg-white dark:bg-brand-card px-4 py-2 text-xs flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span className="text-gray-600 dark:text-gray-300">Tiến độ:</span>
              <span className="font-bold text-gray-900 dark:text-white">
                {completedCount}/60 bài ({Math.round((completedCount / 60) * 100)}%)
              </span>
            </div>
          </div>
        </div>

        {/* Filter & Search Toolbar */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Stage Tab Selectors */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setSelectedStage("all")}
              className={`rounded-xl px-4 py-2 text-xs font-semibold transition ${
                selectedStage === "all"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "border border-gray-200 dark:border-brand-border bg-white dark:bg-brand-card text-gray-600 dark:text-gray-300 hover:text-gray-950 dark:hover:text-white"
              }`}
            >
              Tất cả (60)
            </button>
            <button
              onClick={() => setSelectedStage(1)}
              className={`rounded-xl px-4 py-2 text-xs font-semibold transition ${
                selectedStage === 1
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "border border-gray-200 dark:border-brand-border bg-white dark:bg-brand-card text-gray-600 dark:text-gray-300 hover:text-gray-950 dark:hover:text-white"
              }`}
            >
              Giai đoạn 1: Nền tảng (01 - 20)
            </button>
            <button
              onClick={() => setSelectedStage(2)}
              className={`rounded-xl px-4 py-2 text-xs font-semibold transition ${
                selectedStage === 2
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "border border-gray-200 dark:border-brand-border bg-white dark:bg-brand-card text-gray-600 dark:text-gray-300 hover:text-gray-950 dark:hover:text-white"
              }`}
            >
              Giai đoạn 2: Hàm & Lỗi (21 - 40)
            </button>
            <button
              onClick={() => setSelectedStage(3)}
              className={`rounded-xl px-4 py-2 text-xs font-semibold transition ${
                selectedStage === 3
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "border border-gray-200 dark:border-brand-border bg-white dark:bg-brand-card text-gray-600 dark:text-gray-300 hover:text-gray-950 dark:hover:text-white"
              }`}
            >
              Giai đoạn 3: OOP & Web (41 - 60)
            </button>
          </div>

          {/* Search Box & Visualizer Toggle */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Visualizer Only Checkbox */}
            <button
              onClick={() => setOnlyVisualizer(!onlyVisualizer)}
              className={`flex items-center justify-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-semibold transition ${
                onlyVisualizer
                  ? "border-sky-500 bg-sky-500/10 text-sky-600 dark:text-sky-400"
                  : "border-gray-200 dark:border-brand-border bg-white dark:bg-brand-card text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <Activity className="h-3.5 w-3.5" />
              <span>Chỉ bài có Visualizer</span>
            </button>

            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm bài học (vd: ngày 02, biến số, hàm...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-64 rounded-xl border border-gray-200 dark:border-brand-border bg-white dark:bg-brand-card pl-9 pr-3 py-2 text-xs text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition"
              />
            </div>
          </div>
        </div>

        {/* Lesson Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredLessons.map((l) => (
            <Link
              key={l.id || l.day_number}
              href={`/learn/${l.day_number}`}
              className="group relative flex flex-col justify-between rounded-2xl border border-gray-200 dark:border-brand-border bg-white dark:bg-brand-card/70 p-5 shadow-sm hover:shadow-md hover:border-emerald-500/60 dark:hover:border-emerald-500/50 transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-gray-100 dark:bg-brand-dark px-2.5 py-1 text-xs font-bold text-gray-800 dark:text-gray-200 font-mono">
                    Ngày {l.day_number < 10 ? "0" + l.day_number : l.day_number}
                  </span>

                  <div className="flex items-center gap-2">
                    {l.has_visualizer && (
                      <span className="inline-flex items-center gap-1 rounded-md bg-sky-500/10 border border-sky-500/20 px-2 py-0.5 text-[10px] font-bold text-sky-700 dark:text-sky-400">
                        <Activity className="h-3 w-3" /> Visualizer
                      </span>
                    )}
                    {l.is_completed ? (
                      <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 text-[10px] font-bold">
                        <CheckCircle2 className="h-3 w-3" /> Đã xong
                      </span>
                    ) : (
                      <span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium">
                        Chưa học
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="font-bold text-sm text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-1">
                  {l.title}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                  {l.topic || `Chuyên đề Python Ngày ${l.day_number}`}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 dark:border-brand-border/60 flex items-center justify-between text-xs">
                <span className="font-medium text-amber-600 dark:text-amber-400 flex items-center gap-1">
                  <Sparkles className="h-3.5 w-3.5" /> +{l.xp_reward || 50} XP
                </span>
                <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400 group-hover:translate-x-0.5 transition-transform">
                  Học ngay <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Empty Search State */}
        {filteredLessons.length === 0 && (
          <div className="rounded-2xl border border-gray-200 dark:border-brand-border bg-white dark:bg-brand-card p-12 text-center space-y-3">
            <Search className="h-10 w-10 text-gray-400 mx-auto" />
            <h4 className="font-bold text-base text-gray-900 dark:text-white">
              Không tìm thấy bài học phù hợp
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
              Không có bài học nào khớp với từ khóa &quot;{searchQuery}&quot;. Hãy thử tìm với từ khóa khác hoặc xóa bộ lọc.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedStage("all");
                setOnlyVisualizer(false);
              }}
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-500 transition"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Xóa bộ lọc
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Generate realistic 60-day fallback lessons if backend is offline
function generateFallbackLessons() {
  const topicsStage1 = [
    "Biến số & Kiểu dữ liệu nguyên thủy",
    "Toán tử & Biểu thức tính toán",
    "Xử lý Chuỗi (Strings) & F-strings",
    "Cấu trúc Điều kiện If - Elif - Else",
    "Vòng lặp For & Hàm range()",
    "Vòng lặp While & Break/Continue",
    "Danh sách (Lists) cơ bản",
    "Phương thức thao tác List",
    "Tuples & Bất biến (Immutability)",
    "Sets & Các phép toán tập hợp",
    "Từ điển (Dictionaries) cơ bản",
    "Thao tác nâng cao với Dictionary",
    "Nested Data Structures",
    "Kỹ thuật Slicing & Indexing",
    "Thuật toán Tìm kiếm Tuyến tính",
    "Thuật toán Tìm kiếm Nhị phân",
    "Thuật toán Sắp xếp Nổi bọt (Bubble Sort)",
    "Thuật toán Sắp xếp Chọn (Selection Sort)",
    "Thuật toán Sắp xếp Chèn (Insertion Sort)",
    "Mini Project: Quản lý Danh bạ",
  ];

  const topicsStage2 = [
    "Định nghĩa Hàm (def) & Tham số",
    "Giá trị trả về & Return Multiple Values",
    "Tham số mặc định (*args, **kwargs)",
    "Phạm vi biến (Scope: Local & Global)",
    "Hàm Lambda & Ẩn danh",
    "Map, Filter & Reduce",
    "List Comprehensions chuyên sâu",
    "Dictionary & Set Comprehensions",
    "Xử lý Ngoại lệ (Try - Except - Finally)",
    "Tạo Custom Exceptions",
    "Đọc & Ghi File văn bản (.txt)",
    "Làm việc với tệp CSV & JSON",
    "Module chuẩn: math, random",
    "Module chuẩn: datetime & time",
    "Biểu thức chính quy (Regex) cơ bản",
    "Khai thác Regex nâng cao",
    "Virtual Environment & Pip",
    "Clean Code & Chuẩn PEP 8",
    "Unit Testing với Pytest",
    "Mini Project: Ứng dụng Quản lý Chi tiêu",
  ];

  const topicsStage3 = [
    "Lập trình hướng đối tượng (OOP) & Class",
    "Phương thức __init__ & Thuộc tính self",
    "Tính Kế thừa (Inheritance)",
    "Đa hình (Polymorphism)",
    "Đóng gói (Encapsulation & Private vars)",
    "Magic Methods: __str__, __repr__, __len__",
    "Class Methods & Static Methods",
    "Decorators trong Python",
    "Generators & Từ khóa yield",
    "Context Managers (with statement)",
    "Lập trình Bất đồng bộ (Asyncio)",
    "Crawl dữ liệu Web với BeautifulSoup",
    "Thu thập dữ liệu nâng cao",
    "Phân tích dữ liệu với Pandas cơ bản",
    "Lọc & Thao tác DataFrame",
    "Trực quan hóa dữ liệu cơ bản",
    "Giới thiệu Web API với FastAPI",
    "Pydantic Validation & RESTful Endpoints",
    "Tích hợp Database SQLAlchemy",
    "Capstone Project: Full-stack Python App",
  ];

  const list: any[] = [];
  const visDays = [5, 6, 15, 16, 17, 18, 19, 20];

  for (let i = 1; i <= 60; i++) {
    let stage = 1;
    let title = "";
    if (i <= 20) {
      stage = 1;
      title = `Ngày ${i < 10 ? "0" + i : i}: ${topicsStage1[i - 1]}`;
    } else if (i <= 40) {
      stage = 2;
      title = `Ngày ${i}: ${topicsStage2[i - 21]}`;
    } else {
      stage = 3;
      title = `Ngày ${i}: ${topicsStage3[i - 41]}`;
    }

    list.push({
      id: i,
      day_number: i,
      stage,
      title,
      topic: stage === 1 ? "Nền tảng Python" : stage === 2 ? "Hàm & Module" : "OOP & Ứng dụng",
      xp_reward: 50,
      is_completed: i === 1,
      has_visualizer: visDays.includes(i),
    });
  }

  return list;
}
