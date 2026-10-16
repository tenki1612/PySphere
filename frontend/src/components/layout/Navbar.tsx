"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useLessonStore } from "@/store/useLessonStore";
import { api, getToken } from "@/lib/api";
import {
  Flame,
  Sparkles,
  Terminal,
  BookOpen,
  Layers,
  Sun,
  Moon,
  LogOut,
  LogIn,
  ShieldCheck,
  UserCheck,
} from "lucide-react";

export function Navbar() {
  const { user, setUser, logout, theme, setTheme } = useLessonStore();

  // Load user profile if token exists on mount
  useEffect(() => {
    const token = getToken();
    if (token && !user) {
      api
        .getMe()
        .then((userData) => {
          setUser(userData);
        })
        .catch(() => {
          logout();
        });
    }

    // Load persisted theme
    const savedTheme = localStorage.getItem("pysphere_theme") as "dark" | "light" | null;
    const initialTheme = savedTheme || "dark";
    setTheme(initialTheme);
    document.documentElement.classList.toggle("dark", initialTheme === "dark");
  }, [setUser, logout, setTheme, user]);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("pysphere_theme", nextTheme);
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
  };

  const isAdmin = user?.role === "admin" || user?.is_superuser === true;

  return (
    <header className="sticky top-0 z-50 flex h-14 w-full items-center justify-between border-b border-gray-200 dark:border-brand-border bg-white/95 dark:bg-brand-dark/95 px-6 backdrop-blur transition-colors">
      {/* Brand Logo */}
      <div className="flex items-center gap-3">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/20 group-hover:border-emerald-500/40 transition">
            <Terminal className="h-4 w-4 text-emerald-500 dark:text-emerald-400" />
          </div>
          <span className="font-bold text-lg text-gray-900 dark:text-white tracking-tight">
            Py<span className="text-emerald-500 dark:text-emerald-400">Sphere</span>
          </span>
        </Link>
        <span className="hidden sm:inline-block rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
          60 Days Bootcamp
        </span>
      </div>

      {/* Navigation Links */}
      <nav className="hidden md:flex items-center gap-6 text-sm">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300 hover:text-emerald-500 dark:hover:text-white transition"
        >
          <BookOpen className="h-4 w-4 text-gray-400" />
          Lộ trình 60 Ngày
        </Link>
        <Link
          href="/learn/1"
          className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300 hover:text-emerald-500 dark:hover:text-white transition"
        >
          <Layers className="h-4 w-4 text-gray-400" />
          Workspace Thực hành
        </Link>
      </nav>

      {/* User Actions & Gamification */}
      <div className="flex items-center gap-3">
        {/* Theme Switcher Toggle */}
        <button
          onClick={toggleTheme}
          className="rounded-lg border border-gray-200 dark:border-brand-border bg-gray-100 dark:bg-brand-card/60 p-1.5 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition"
          title={theme === "dark" ? "Chuyển sang Giao diện Sáng" : "Chuyển sang Giao diện Tối"}
        >
          {theme === "dark" ? (
            <Sun className="h-4 w-4 text-amber-400" />
          ) : (
            <Moon className="h-4 w-4 text-indigo-500" />
          )}
        </button>

        {user ? (
          <>
            {/* Streak Counter */}
            <div className="flex items-center gap-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 px-2.5 py-1 text-xs font-semibold text-orange-500 dark:text-orange-400">
              <Flame className="h-3.5 w-3.5 fill-orange-500 text-orange-500 animate-pulse" />
              <span>{user.streak_count ?? 0} ngày</span>
            </div>

            {/* XP Points */}
            <div className="flex items-center gap-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 text-xs font-semibold text-amber-600 dark:text-amber-400">
              <Sparkles className="h-3.5 w-3.5 fill-amber-400 text-amber-500" />
              <span>{user.xp || 0} XP</span>
            </div>

            {/* Role Badge */}
            {isAdmin ? (
              <span className="flex items-center gap-1 rounded-md bg-purple-500/10 border border-purple-500/30 px-2 py-0.5 text-[11px] font-bold text-purple-600 dark:text-purple-400">
                <ShieldCheck className="h-3 w-3" /> Admin
              </span>
            ) : (
              <span className="flex items-center gap-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                <UserCheck className="h-3 w-3" /> Học viên
              </span>
            )}

            {/* User Avatar & Logout */}
            <div className="flex items-center gap-2">
              <div
                className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-tr from-emerald-600 to-teal-400 text-xs font-bold text-white shadow-sm"
                title={`${user.username} (${user.email})`}
              >
                {user.username ? user.username.slice(0, 2).toUpperCase() : "PY"}
              </div>

              <button
                onClick={logout}
                className="rounded-lg p-1.5 text-gray-500 hover:text-rose-500 transition"
                title="Đăng xuất"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="flex items-center gap-1.5 rounded-lg border border-gray-200 dark:border-brand-border bg-gray-50 dark:bg-brand-dark/50 px-3 py-1.5 text-xs font-semibold text-gray-700 dark:text-gray-200 hover:text-emerald-500 transition"
            >
              <LogIn className="h-3.5 w-3.5" /> Đăng nhập
            </Link>
            <Link
              href="/register"
              className="hidden sm:inline-flex rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-white shadow hover:bg-emerald-400 transition"
            >
              Đăng ký
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
