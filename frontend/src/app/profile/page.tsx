"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Flame,
  Sparkles,
  Trophy,
  BookOpen,
  CheckCircle2,
  Clock,
  Calendar,
  Layers,
  ArrowRight,
  ShieldCheck,
  UserCheck,
  Loader2,
  Lock,
  LogIn,
  UserPlus,
  History,
  TrendingUp,
  Award,
  Zap,
  Brain,
  Compass,
  Star,
  Settings,
  Check,
  Sliders,
} from "lucide-react";
import { api, getToken } from "@/lib/api";
import { useLessonStore } from "@/store/useLessonStore";

function calculateLevel(xp: number) {
  if (xp < 150) return { level: 1, title: "Tân thủ Python", nextXp: 150, currentBase: 0 };
  if (xp < 500) return { level: 2, title: "Tập sự Lập trình", nextXp: 500, currentBase: 150 };
  if (xp < 1200) return { level: 3, title: "Chiến binh Code", nextXp: 1200, currentBase: 500 };
  if (xp < 2500) return { level: 4, title: "Chuyên gia Python", nextXp: 2500, currentBase: 1200 };
  return { level: 5, title: "Huyền thoại PySphere", nextXp: xp, currentBase: 2500 };
}

export default function ProfilePage() {
  const router = useRouter();
  const { user } = useLessonStore();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<any>(null);
  const [lessons, setLessons] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [subFilter, setSubFilter] = useState<"ALL" | "PASSED" | "FAILED">("ALL");

  // User Preferences
  const [prefFontSize, setPrefFontSize] = useState<number>(14);
  const [prefConfetti, setPrefConfetti] = useState<boolean>(true);
  const [prefAutosave, setPrefAutosave] = useState<string>("1500");
  const [savedPrefNotice, setSavedPrefNotice] = useState(false);

  useEffect(() => {
    setMounted(true);
    const fs = localStorage.getItem("pysphere_editor_font_size");
    if (fs) setPrefFontSize(parseInt(fs, 10));
    const cf = localStorage.getItem("pysphere_confetti_enabled");
    if (cf !== null) setPrefConfetti(cf === "true");
    const as = localStorage.getItem("pysphere_autosave_interval");
    if (as) setPrefAutosave(as);
  }, []);

  const handleSavePref = (fontSize: number, confetti: boolean, autosave: string) => {
    setPrefFontSize(fontSize);
    setPrefConfetti(confetti);
    setPrefAutosave(autosave);
    localStorage.setItem("pysphere_editor_font_size", String(fontSize));
    localStorage.setItem("pysphere_confetti_enabled", String(confetti));
    localStorage.setItem("pysphere_autosave_interval", autosave);
    setSavedPrefNotice(true);
    setTimeout(() => setSavedPrefNotice(false), 2000);
  };

  const token = typeof window !== "undefined" ? getToken() : null;
  const isAuthenticated = mounted ? Boolean(user || token) : true;

  useEffect(() => {
    if (!isAuthenticated && mounted) {
      setLoading(false);
      return;
    }

    async function loadProfileData() {
      try {
        const [sumData, lesData, subData] = await Promise.all([
          api.getProgressSummary().catch(() => null),
          api.getLessons().catch(() => []),
          api.getSubmissionHistory().catch(() => []),
        ]);
        setSummary(sumData);
        setLessons(lesData);
        setSubmissions(subData);
      } catch (err) {
        console.error("Failed to load profile data", err);
      } finally {
        setLoading(false);
      }
    }

    if (mounted) {
      loadProfileData();
    }
  }, [isAuthenticated, mounted]);

  if (!mounted || loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-2xl border border-gray-200 dark:border-brand-border bg-white dark:bg-brand-card p-8 text-center shadow-xl transition-colors">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
            <Lock className="h-7 w-7" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Hồ sơ & Tiến độ Học tập
          </h2>
          <p className="mt-2 text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
            Vui lòng đăng nhập hoặc đăng ký tài khoản để theo dõi chuỗi ngày streak, điểm kinh nghiệm XP, tỷ lệ hoàn thành lộ trình 60 ngày và lịch sử nộp bài.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/login?redirect=/profile"
              className="w-full sm:w-auto flex items-center justify-center gap-1.5 rounded-lg bg-emerald-600 dark:bg-emerald-500 px-5 py-2.5 text-xs font-semibold text-white shadow hover:bg-emerald-500 dark:hover:bg-emerald-400 transition"
            >
              <LogIn className="h-4 w-4" /> Đăng nhập
            </Link>
            <Link
              href="/register?redirect=/profile"
              className="w-full sm:w-auto flex items-center justify-center gap-1.5 rounded-lg border border-gray-300 dark:border-brand-border bg-gray-50 dark:bg-brand-dark px-5 py-2.5 text-xs font-semibold text-gray-700 dark:text-gray-200 hover:text-gray-950 dark:hover:text-white transition"
            >
              <UserPlus className="h-4 w-4" /> Đăng ký học viên
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const currentXp = user?.xp || summary?.total_xp || 0;
  const streak = user?.streak_count ?? summary?.current_streak ?? 0;
  const levelInfo = calculateLevel(currentXp);
  const xpInCurrentLevel = currentXp - levelInfo.currentBase;
  const xpNeededForLevel = Math.max(1, levelInfo.nextXp - levelInfo.currentBase);
  const levelProgressPercent = Math.min(100, Math.round((xpInCurrentLevel / xpNeededForLevel) * 100));

  const totalLessons = summary?.total_lessons || 60;
  const completedLessonsCount = summary?.total_completed || lessons.filter((l) => l.is_completed).length;
  const completionRate = summary?.completion_rate_percentage ?? (totalLessons > 0 ? Math.round((completedLessonsCount / totalLessons) * 100) : 0);

  // Stage breakdown
  const stage1Lessons = lessons.filter((l) => l.stage === 1);
  const stage2Lessons = lessons.filter((l) => l.stage === 2);
  const stage3Lessons = lessons.filter((l) => l.stage === 3);

  const stage1Completed = stage1Lessons.filter((l) => l.is_completed).length;
  const stage2Completed = stage2Lessons.filter((l) => l.is_completed).length;
  const stage3Completed = stage3Lessons.filter((l) => l.is_completed).length;

  // Filtered submissions
  const filteredSubmissions = submissions.filter((s) => {
    if (subFilter === "ALL") return true;
    return s.status === subFilter;
  });

  // Gamification 6 Core Achievements
  const achievements = [
    {
      id: "first_step",
      title: "Bước chân Đầu tiên",
      desc: "Hoàn thành bài tập Ngày 01",
      icon: Star,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
      borderColor: "border-amber-500/30",
      isUnlocked: completedLessonsCount >= 1,
      progressText: completedLessonsCount >= 1 ? "1/1 Hoàn thành" : "0/1 Hoàn thành",
      percent: completedLessonsCount >= 1 ? 100 : 0,
    },
    {
      id: "streak_warrior",
      title: "Chiến binh Bền bỉ",
      desc: "Duy trì chuỗi Streak học tập liên tục từ 3 ngày",
      icon: Flame,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
      borderColor: "border-orange-500/30",
      isUnlocked: streak >= 3,
      progressText: `${Math.min(3, streak)}/3 ngày`,
      percent: Math.min(100, Math.round((streak / 3) * 100)),
    },
    {
      id: "speed_demon",
      title: "Tốc độ Thần tốc",
      desc: "Có ít nhất một bài nộp đạt dưới 50ms",
      icon: Zap,
      color: "text-sky-500",
      bgColor: "bg-sky-500/10",
      borderColor: "border-sky-500/30",
      isUnlocked: submissions.some((s) => s.status === "PASSED" && s.execution_time_ms < 50),
      progressText: submissions.some((s) => s.status === "PASSED" && s.execution_time_ms < 50)
        ? "Đã đạt"
        : "Chưa đạt",
      percent: submissions.some((s) => s.status === "PASSED" && s.execution_time_ms < 50) ? 100 : 0,
    },
    {
      id: "algo_master",
      title: "Bậc thầy Giải thuật",
      desc: "Hoàn thành bài học có mô phỏng Visualizer 2D",
      icon: Brain,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/30",
      isUnlocked: submissions.some(
        (s) => s.status === "PASSED" && [5, 6, 15, 16, 17, 18, 19, 20].includes(s.lesson_id)
      ),
      progressText: submissions.some(
        (s) => s.status === "PASSED" && [5, 6, 15, 16, 17, 18, 19, 20].includes(s.lesson_id)
      )
        ? "1/1 Bài"
        : "0/1 Bài",
      percent: submissions.some(
        (s) => s.status === "PASSED" && [5, 6, 15, 16, 17, 18, 19, 20].includes(s.lesson_id)
      )
        ? 100
        : 0,
    },
    {
      id: "xp_explorer",
      title: "Nhà thám hiểm Python",
      desc: "Tích lũy đạt mốc 200 điểm kinh nghiệm XP",
      icon: Compass,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/30",
      isUnlocked: currentXp >= 200,
      progressText: `${Math.min(200, currentXp)}/200 XP`,
      percent: Math.min(100, Math.round((currentXp / 200) * 100)),
    },
    {
      id: "stage1_master",
      title: "Kỹ sư Nền tảng",
      desc: "Chinh phục toàn bộ 20 bài học Giai đoạn 1",
      icon: Award,
      color: "text-indigo-500",
      bgColor: "bg-indigo-500/10",
      borderColor: "border-indigo-500/30",
      isUnlocked: stage1Completed >= 20,
      progressText: `${stage1Completed}/20 bài`,
      percent: Math.min(100, Math.round((stage1Completed / 20) * 100)),
    },
  ];

  return (
    <div className="flex-1 w-full max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Profile Header Banner */}
      <div className="rounded-2xl border border-gray-200 dark:border-brand-border bg-white dark:bg-brand-card/90 p-6 md:p-8 shadow-sm dark:shadow-xl transition-colors">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-sky-500 text-xl font-extrabold text-white shadow-lg">
              {user?.username ? user.username.slice(0, 2).toUpperCase() : "PY"}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                  {user?.username || "Học viên PySphere"}
                </h1>
                {user?.role === "admin" || user?.is_superuser ? (
                  <span className="flex items-center gap-1 rounded-full bg-purple-500/10 border border-purple-500/30 px-2.5 py-0.5 text-xs font-bold text-purple-700 dark:text-purple-400">
                    <ShieldCheck className="h-3.5 w-3.5" /> Quản trị viên
                  </span>
                ) : (
                  <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                    <UserCheck className="h-3.5 w-3.5" /> Học viên chính thức
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {user?.email || "Chưa có email"} • Lộ trình 60 ngày thực chiến
              </p>
            </div>
          </div>

          <Link
            href={`/learn/${Math.min(60, Math.max(1, completedLessonsCount + 1))}`}
            className="self-start md:self-auto flex items-center gap-2 rounded-xl bg-emerald-600 dark:bg-emerald-500 px-5 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-emerald-500 dark:hover:bg-emerald-400 transition"
          >
            Tiếp tục bài học gần nhất <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Level & XP Progress Card */}
        <div className="mt-8 rounded-xl border border-gray-200 dark:border-brand-border/60 bg-gray-50 dark:bg-brand-dark/60 p-4 transition-colors">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-amber-500" />
              <span className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                Cấp {levelInfo.level}: {levelInfo.title}
              </span>
            </div>
            <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
              {currentXp} XP {levelInfo.level < 5 && `(${xpInCurrentLevel} / ${xpNeededForLevel} XP lên cấp tiếp theo)`}
            </span>
          </div>
          <div className="h-2.5 w-full rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
              style={{ width: `${levelProgressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="rounded-2xl border border-gray-200 dark:border-brand-border bg-white dark:bg-brand-card p-6 shadow-sm transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Chuỗi Streak
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-500">
              <Flame className="h-4 w-4 fill-orange-500" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-gray-900 dark:text-white">
              {streak}
            </span>
            <span className="text-xs font-medium text-gray-500">ngày liên tục</span>
          </div>
          <p className="mt-2 text-[11px] text-gray-500">
            Học mỗi ngày để giữ vững chuỗi streak và rèn luyện thói quen viết mã.
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 dark:border-brand-border bg-white dark:bg-brand-card p-6 shadow-sm transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Điểm kinh nghiệm
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-500">
              <Sparkles className="h-4 w-4 fill-amber-500" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-gray-900 dark:text-white">
              {currentXp}
            </span>
            <span className="text-xs font-medium text-gray-500">XP</span>
          </div>
          <p className="mt-2 text-[11px] text-gray-500">
            Tích lũy 50 XP cho mỗi bài học bạn giải quyết thành công các test cases.
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 dark:border-brand-border bg-white dark:bg-brand-card p-6 shadow-sm transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Tiến độ 60 Ngày
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-gray-900 dark:text-white">
              {completionRate}%
            </span>
            <span className="text-xs font-medium text-gray-500">
              ({completedLessonsCount}/{totalLessons} bài)
            </span>
          </div>
          <p className="mt-2 text-[11px] text-gray-500">
            Tiếp tục hoàn thành từng bài để làm chủ trọn vẹn lập trình Python.
          </p>
        </div>
      </div>

      {/* 3 Stages Progress Breakdown */}
      <div className="rounded-2xl border border-gray-200 dark:border-brand-border bg-white dark:bg-brand-card p-6 md:p-8 shadow-sm transition-colors space-y-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
            <Layers className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            Tiến độ Theo Giai đoạn
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Tổng kết chi tiết tỷ lệ bài học đã hoàn thành qua từng giai đoạn huấn luyện
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Stage 1 */}
          <div className="rounded-xl border border-gray-200 dark:border-brand-border/60 bg-gray-50 dark:bg-brand-dark/40 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase">
                Giai đoạn 1 (Ngày 1-20)
              </span>
              <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                {stage1Completed}/20
              </span>
            </div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">Nền tảng Python</h3>
            <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                style={{ width: `${(stage1Completed / 20) * 100}%` }}
              />
            </div>
            <p className="text-[11px] text-gray-500 leading-relaxed">
              Biến số, toán tử, chuỗi, lists, tuples, sets, từ điển, rẽ nhánh và vòng lặp.
            </p>
          </div>

          {/* Stage 2 */}
          <div className="rounded-xl border border-gray-200 dark:border-brand-border/60 bg-gray-50 dark:bg-brand-dark/40 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-sky-700 dark:text-sky-400 uppercase">
                Giai đoạn 2 (Ngày 21-40)
              </span>
              <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                {stage2Completed}/20
              </span>
            </div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">Hàm & Xử lý lỗi</h3>
            <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden">
              <div
                className="h-full bg-sky-500 rounded-full transition-all duration-300"
                style={{ width: `${(stage2Completed / 20) * 100}%` }}
              />
            </div>
            <p className="text-[11px] text-gray-500 leading-relaxed">
              Hàm, module, list comprehension, map/filter, ngoại lệ, regex và file I/O.
            </p>
          </div>

          {/* Stage 3 */}
          <div className="rounded-xl border border-gray-200 dark:border-brand-border/60 bg-gray-50 dark:bg-brand-dark/40 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-700 dark:text-purple-400 uppercase">
                Giai đoạn 3 (Ngày 41-60)
              </span>
              <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                {stage3Completed}/20
              </span>
            </div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">OOP & Ứng dụng Web</h3>
            <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden">
              <div
                className="h-full bg-purple-500 rounded-full transition-all duration-300"
                style={{ width: `${(stage3Completed / 20) * 100}%` }}
              />
            </div>
            <p className="text-[11px] text-gray-500 leading-relaxed">
              OOP, BeautifulSoup, NumPy, Pandas, NoSQL MongoDB, FastAPI và REST API.
            </p>
          </div>
        </div>
      </div>

      {/* Achievements & Badges Grid */}
      <div className="rounded-2xl border border-gray-200 dark:border-brand-border bg-white dark:bg-brand-card p-6 md:p-8 shadow-sm transition-colors space-y-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
            <Trophy className="h-5 w-5 text-amber-500" />
            Huy hiệu & Thành tích ({achievements.filter((a) => a.isUnlocked).length}/{achievements.length})
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Bộ sưu tập các cột mốc danh giá ghi nhận nỗ lực rèn luyện của bạn trên hành trình PySphere
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((ach) => {
            const IconComponent = ach.icon;
            return (
              <div
                key={ach.id}
                className={`relative rounded-xl border p-4 flex flex-col justify-between transition ${
                  ach.isUnlocked
                    ? `border-amber-500/40 bg-gradient-to-br from-amber-500/5 to-yellow-500/10 shadow-sm`
                    : "border-gray-200 dark:border-brand-border/40 bg-gray-50/50 dark:bg-brand-dark/30 opacity-70"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className={`h-10 w-10 rounded-xl flex items-center justify-center ${
                        ach.isUnlocked
                          ? `${ach.bgColor} ${ach.color} shadow-sm border ${ach.borderColor}`
                          : "bg-gray-200 dark:bg-gray-800 text-gray-400"
                      }`}
                    >
                      <IconComponent className="h-5 w-5" />
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        ach.isUnlocked
                          ? "bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-400"
                      }`}
                    >
                      {ach.isUnlocked ? "Đã mở khóa" : "Đang thực hiện"}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                    {ach.title}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                    {ach.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 dark:border-brand-border/40 space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] text-gray-500 dark:text-gray-400 font-medium">
                    <span>Tiến độ:</span>
                    <span>{ach.progressText}</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        ach.isUnlocked ? "bg-amber-500" : "bg-gray-400"
                      }`}
                      style={{ width: `${ach.percent}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Submission History Section */}
      <div className="rounded-2xl border border-gray-200 dark:border-brand-border bg-white dark:bg-brand-card p-6 md:p-8 shadow-sm transition-colors space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
              <History className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              Lịch sử Hoạt động & Nộp bài ({submissions.length})
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Nhật ký các lần nộp bài chấm điểm trên hệ thống PySphere
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSubFilter("ALL")}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${
                subFilter === "ALL"
                  ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
                  : "bg-gray-100 dark:bg-brand-dark text-gray-600 dark:text-gray-400"
              }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setSubFilter("PASSED")}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${
                subFilter === "PASSED"
                  ? "bg-emerald-600 text-white"
                  : "bg-gray-100 dark:bg-brand-dark text-gray-600 dark:text-gray-400"
              }`}
            >
              Đạt (Passed)
            </button>
            <button
              onClick={() => setSubFilter("FAILED")}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${
                subFilter === "FAILED"
                  ? "bg-rose-600 text-white"
                  : "bg-gray-100 dark:bg-brand-dark text-gray-600 dark:text-gray-400"
              }`}
            >
              Chưa đạt
            </button>
          </div>
        </div>

        {filteredSubmissions.length === 0 ? (
          <div className="py-12 text-center text-xs text-gray-500">
            Chưa có lượt nộp bài nào phù hợp bộ lọc.
          </div>
        ) : (
          <div className="space-y-3">
            {filteredSubmissions.slice(0, 15).map((sub, idx) => (
              <div
                key={sub.id || idx}
                className="rounded-xl border border-gray-200 dark:border-brand-border/60 bg-gray-50/70 dark:bg-brand-dark/40 p-4 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-bold text-[10px] ${
                      sub.status === "PASSED"
                        ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20"
                        : "bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/20"
                    }`}
                  >
                    {sub.status === "PASSED" ? (
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    ) : (
                      <Clock className="h-3.5 w-3.5" />
                    )}
                    {sub.status === "PASSED" ? "ĐẠT" : "CHƯA ĐẠT"}
                  </span>
                  <div>
                    <span className="font-bold text-gray-900 dark:text-white">
                      Bài {sub.lesson_id}
                    </span>
                    <span className="text-gray-500 ml-2">
                      ({sub.tests_passed}/{sub.tests_total} kiểm thử passed)
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-gray-500">
                  <span className="flex items-center gap-1 text-[11px]">
                    <Clock className="h-3 w-3" /> {sub.execution_time_ms} ms
                  </span>
                  <span className="flex items-center gap-1 text-[11px]">
                    <Calendar className="h-3 w-3" />
                    {new Date(sub.created_at).toLocaleString("vi-VN")}
                  </span>
                  <Link
                    href={`/learn/${sub.lesson_id}`}
                    className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline"
                  >
                    Vào bài →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Learning Preferences Panel */}
      <div className="rounded-2xl border border-gray-200 dark:border-brand-border bg-white dark:bg-brand-card p-6 md:p-8 shadow-sm transition-colors space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
              <Sliders className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              Cài đặt Cá nhân hóa Học tập
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Tùy chỉnh trải nghiệm không gian gõ code và trình biên tập theo thói quen của bạn
            </p>
          </div>
          {savedPrefNotice && (
            <span className="flex items-center gap-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 animate-fadeIn">
              <Check className="h-3.5 w-3.5" /> Đã lưu cài đặt!
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {/* Option 1: Font size */}
          <div className="rounded-xl border border-gray-200 dark:border-brand-border/60 bg-gray-50/50 dark:bg-brand-dark/40 p-4 space-y-3">
            <span className="text-xs font-bold text-gray-800 dark:text-gray-200">
              Cỡ chữ Editor mặc định
            </span>
            <div className="flex items-center gap-2">
              {[12, 14, 16, 18].map((size) => (
                <button
                  key={size}
                  onClick={() => handleSavePref(size, prefConfetti, prefAutosave)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border transition ${
                    prefFontSize === size
                      ? "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-bold"
                      : "border-gray-200 dark:border-brand-border bg-white dark:bg-brand-dark text-gray-600 dark:text-gray-400"
                  }`}
                >
                  {size}px
                </button>
              ))}
            </div>
            <p className="text-[11px] text-gray-500">Kích thước hiển thị mã nguồn trong Monaco Editor.</p>
          </div>

          {/* Option 2: Confetti */}
          <div className="rounded-xl border border-gray-200 dark:border-brand-border/60 bg-gray-50/50 dark:bg-brand-dark/40 p-4 space-y-3">
            <span className="text-xs font-bold text-gray-800 dark:text-gray-200">
              Hiệu ứng Chúc mừng (Confetti)
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleSavePref(prefFontSize, true, prefAutosave)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border transition ${
                  prefConfetti
                    ? "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-bold"
                    : "border-gray-200 dark:border-brand-border bg-white dark:bg-brand-dark text-gray-600 dark:text-gray-400"
                }`}
              >
                Bật hiệu ứng
              </button>
              <button
                onClick={() => handleSavePref(prefFontSize, false, prefAutosave)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border transition ${
                  !prefConfetti
                    ? "border-rose-500 bg-rose-500/10 text-rose-700 dark:text-rose-300 font-bold"
                    : "border-gray-200 dark:border-brand-border bg-white dark:bg-brand-dark text-gray-600 dark:text-gray-400"
                }`}
              >
                Tắt
              </button>
            </div>
            <p className="text-[11px] text-gray-500">Phun pháo hoa khi nộp bài đạt 100% test cases.</p>
          </div>

          {/* Option 3: Autosave */}
          <div className="rounded-xl border border-gray-200 dark:border-brand-border/60 bg-gray-50/50 dark:bg-brand-dark/40 p-4 space-y-3">
            <span className="text-xs font-bold text-gray-800 dark:text-gray-200">
              Tự động lưu bản nháp
            </span>
            <div className="flex items-center gap-2">
              {[
                { label: "1.5 giây", val: "1500" },
                { label: "3.0 giây", val: "3000" },
                { label: "Thủ công", val: "manual" },
              ].map((item) => (
                <button
                  key={item.val}
                  onClick={() => handleSavePref(prefFontSize, prefConfetti, item.val)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border transition ${
                    prefAutosave === item.val
                      ? "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-bold"
                      : "border-gray-200 dark:border-brand-border bg-white dark:bg-brand-dark text-gray-600 dark:text-gray-400"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-gray-500">Thời gian tự động đồng bộ code lên Cloud.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

