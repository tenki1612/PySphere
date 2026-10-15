"use client";

import Link from "next/link";
import { useLessonStore } from "@/store/useLessonStore";
import { Flame, Sparkles, Terminal, BookOpen, Layers } from "lucide-react";

export function Navbar() {
  const { user } = useLessonStore();

  return (
    <header className="sticky top-0 z-50 flex h-14 w-full items-center justify-between border-b border-brand-border bg-brand-dark/95 px-6 backdrop-blur">
      {/* Brand Logo */}
      <div className="flex items-center gap-3">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/20 group-hover:border-emerald-500/40 transition">
            <Terminal className="h-4 w-4 text-emerald-400" />
          </div>
          <span className="font-bold text-lg text-white tracking-tight">
            Py<span className="text-emerald-400">Sphere</span>
          </span>
        </Link>
        <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-400 border border-emerald-500/20">
          60 Days Bootcamp
        </span>
      </div>

      {/* Navigation Links */}
      <nav className="hidden md:flex items-center gap-6 text-sm">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-gray-300 hover:text-white transition"
        >
          <BookOpen className="h-4 w-4 text-gray-400" />
          Lộ trình 60 Ngày
        </Link>
        <Link
          href="/learn/1"
          className="flex items-center gap-1.5 text-gray-300 hover:text-white transition"
        >
          <Layers className="h-4 w-4 text-gray-400" />
          Workspace Thực hành
        </Link>
      </nav>

      {/* Gamification Stats: Streak & XP */}
      <div className="flex items-center gap-4">
        {/* Streak Counter */}
        <div className="flex items-center gap-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 px-3 py-1 text-xs font-semibold text-orange-400">
          <Flame className="h-4 w-4 fill-orange-500 text-orange-500 animate-pulse" />
          <span>{user?.streak_count || 1} ngày streak</span>
        </div>

        {/* XP Points */}
        <div className="flex items-center gap-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 px-3 py-1 text-xs font-semibold text-amber-400">
          <Sparkles className="h-4 w-4 fill-amber-400 text-amber-400" />
          <span>{user?.xp || 0} XP</span>
        </div>

        {/* User avatar indicator */}
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-emerald-600 to-teal-400 text-xs font-bold text-white shadow-sm">
          {user?.username ? user.username.slice(0, 2).toUpperCase() : "PY"}
        </div>
      </div>
    </header>
  );
}

