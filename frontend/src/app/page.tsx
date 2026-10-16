"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Code2,
  Flame,
  Sparkles,
  CheckCircle2,
  Lock,
  ArrowRight,
  BookOpen,
  Cpu,
} from "lucide-react";
import { api } from "@/lib/api";

export default function HomePage() {
  const [lessons, setLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await api.getLessons();
        setLessons(data);
      } catch {
        // Fallback demo lessons if backend not yet running
        setLessons([
          { id: 1, day_number: 1, stage: 1, title: "Ngày 01: Biến số & Kiểu dữ liệu nguyên thủy", topic: "Nền tảng Python", xp_reward: 50, is_completed: true },
          { id: 2, day_number: 2, stage: 1, title: "Ngày 02: Toán tử & Biểu thức tính toán", topic: "Nền tảng Python", xp_reward: 50, is_completed: false },
          { id: 3, day_number: 21, stage: 2, title: "Ngày 21: Lập trình Hàm & Scope", topic: "Hàm & Xử lý lỗi", xp_reward: 50, is_completed: false },
          { id: 4, day_number: 41, stage: 3, title: "Ngày 41: Lớp & Đối tượng (OOP)", topic: "OOP & Web", xp_reward: 50, is_completed: false },
        ]);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const stages = [
    {
      id: 1,
      title: "Giai đoạn 1: Nền tảng Python",
      range: "Ngày 01 - 20",
      description: "Biến số, Kiểu dữ liệu, Chuỗi, Lists, Tuples, Sets, Dictionaries, Điều kiện & Vòng lặp.",
      color: "from-emerald-500/20 to-teal-500/20",
      border: "border-emerald-500/30",
    },
    {
      id: 2,
      title: "Giai đoạn 2: Lập trình hàm & Xử lý lỗi",
      range: "Ngày 21 - 40",
      description: "Hàm, Modules, List Comprehensions, Higher-order functions, Datetime, Regex & File I/O.",
      color: "from-blue-500/20 to-indigo-500/20",
      border: "border-blue-500/30",
    },
    {
      id: 3,
      title: "Giai đoạn 3: OOP, Dữ liệu & Web",
      range: "Ngày 41 - 60",
      description: "Lập trình hướng đối tượng (OOP), Web Scraping, Thống kê, Pandas & Xây dựng REST API.",
      color: "from-purple-500/20 to-pink-500/20",
      border: "border-purple-500/30",
    },
  ];

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-4 py-8 space-y-12">
      {/* Hero Section */}
      <div className="rounded-2xl border border-gray-200 dark:border-brand-border bg-gradient-to-b from-white via-gray-50 to-gray-100 dark:from-brand-card/90 dark:to-brand-dark/90 p-8 md:p-12 text-center relative overflow-hidden shadow-xl dark:shadow-2xl transition-colors">
        <div className="absolute top-0 right-1/4 -mt-12 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/4 -mb-12 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-6">
          <Cpu className="h-3.5 w-3.5" />
          <span>Zero Server Setup • Chạy 100% WebAssembly Sandbox</span>
        </div>

        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white max-w-3xl mx-auto leading-tight">
          Nền tảng Tự học Lập trình Python <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-500 to-sky-600 dark:from-emerald-400 dark:via-teal-300 dark:to-sky-400">
            Thực chiến & Trực quan
          </span>
        </h1>

        <p className="mt-4 text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Vừa đọc lý thuyết, vừa gõ code trực tiếp trên trình duyệt, vừa thấy chuyển động giải thuật trực quan từng bước mà không cần cài đặt môi trường.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/learn/1"
            className="flex items-center gap-2 rounded-lg bg-emerald-600 dark:bg-emerald-500 px-6 py-3 font-semibold text-white shadow-lg hover:bg-emerald-500 dark:hover:bg-emerald-400 transition"
          >
            <Code2 className="h-5 w-5" />
            Bắt đầu học Ngày 01
            <ArrowRight className="h-4 w-4" />
          </Link>
          <a
            href="#curriculum"
            className="flex items-center gap-2 rounded-lg border border-gray-300 dark:border-brand-border bg-white dark:bg-brand-dark/80 px-6 py-3 font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:border-gray-400 dark:hover:border-gray-600 transition"
          >
            <BookOpen className="h-5 w-5 text-gray-400" />
            Xem Lộ trình 60 Ngày
          </a>
        </div>
      </div>

      {/* Curriculum 3 Stages Overview */}
      <div id="curriculum" className="space-y-6">
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-brand-border pb-4 transition-colors">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Lộ trình Huấn luyện 60 Ngày</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Chia làm 3 giai đoạn tiến cấp từ số 0 đến lập trình viên ứng dụng</p>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-orange-500 dark:text-orange-400">
              <Flame className="h-4 w-4" /> Streak hàng ngày
            </span>
            <span className="flex items-center gap-1.5 text-amber-500 dark:text-amber-400">
              <Sparkles className="h-4 w-4" /> Nhận 50 XP/Bài
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stages.map((stage) => {
            const stageLessons = lessons.filter((l) => l.stage === stage.id);
            return (
              <div
                key={stage.id}
                className={`rounded-xl border ${stage.border} bg-white dark:bg-brand-card/60 p-6 flex flex-col justify-between hover:border-emerald-500/50 shadow-sm transition-colors`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                      {stage.range}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">20 Bài học</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-2">{stage.title}</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-300 mt-2 leading-relaxed">{stage.description}</p>
                </div>

                <div className="mt-6 space-y-2 border-t border-gray-100 dark:border-brand-border/60 pt-4">
                  {stageLessons.map((l) => (
                    <Link
                      key={l.id}
                      href={`/learn/${l.day_number}`}
                      className="group flex items-center justify-between rounded-lg bg-gray-50 dark:bg-brand-dark/70 px-3 py-2 text-xs hover:bg-gray-100 dark:hover:bg-brand-dark transition"
                    >
                      <div className="flex items-center gap-2 truncate">
                        {l.is_completed ? (
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 dark:text-emerald-400 shrink-0" />
                        ) : (
                          <span className="h-2 w-2 rounded-full bg-gray-400 dark:bg-gray-500 shrink-0" />
                        )}
                        <span className="truncate text-gray-700 dark:text-gray-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition">
                          {l.title}
                        </span>
                      </div>
                      <span className="text-[10px] text-amber-500 dark:text-amber-400 shrink-0 font-medium">
                        +{l.xp_reward || 50} XP
                      </span>
                    </Link>
                  ))}
                  {stageLessons.length === 0 && (
                    <div className="text-xs text-gray-400 dark:text-gray-500 italic py-2">
                      Đang đồng bộ danh sách bài học...
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

