"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Terminal, Lock, Mail, User as UserIcon, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import { api, setToken } from "@/lib/api";
import { useLessonStore } from "@/store/useLessonStore";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/learn/1";

  const { setUser } = useLessonStore();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const data = await api.register({ email, username, password });
      setToken(data.access_token);
      setUser(data.user);
      router.push(redirectUrl);
    } catch (err: any) {
      setError(err.message || "Đăng ký thất bại. Vui lòng kiểm tra lại thông tin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 dark:border-brand-border bg-white/95 dark:bg-brand-card/90 p-8 shadow-xl dark:shadow-2xl backdrop-blur transition-colors">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 mb-4">
            <Terminal className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Đăng ký Học viên mới</h1>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1.5">
            Bắt đầu hành trình 60 ngày chinh phục Python thực chiến cùng PySphere
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 flex items-center gap-2 rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-700 dark:text-rose-300">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-500 dark:text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Register Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              Tên tài khoản (Username)
            </label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="pycoder"
                className="w-full rounded-lg border border-gray-300 dark:border-brand-border bg-gray-50 dark:bg-brand-dark px-9 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              Email đăng ký
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400 dark:text-gray-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="w-full rounded-lg border border-gray-300 dark:border-brand-border bg-gray-50 dark:bg-brand-dark px-9 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              Mật khẩu
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400 dark:text-gray-500" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Tối thiểu 6 ký tự"
                className="w-full rounded-lg border border-gray-300 dark:border-brand-border bg-gray-50 dark:bg-brand-dark px-9 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-emerald-600 dark:bg-emerald-500 py-2.5 font-semibold text-sm text-white shadow-lg hover:bg-emerald-500 dark:hover:bg-emerald-400 disabled:opacity-50 transition"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Đang tạo tài khoản...
              </>
            ) : (
              <>
                Hoàn tất đăng ký <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer switch to login */}
        <div className="mt-6 border-t border-gray-200 dark:border-brand-border/60 pt-4 text-center text-xs text-gray-600 dark:text-gray-400">
          Đã có tài khoản?{" "}
          <Link
            href={`/login?redirect=${encodeURIComponent(redirectUrl)}`}
            className="font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 underline underline-offset-4"
          >
            Đăng nhập ngay
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="flex-1 flex items-center justify-center p-4">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}
