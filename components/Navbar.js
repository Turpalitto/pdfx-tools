"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

export default function Navbar() {
  const { isAuthenticated, loading, isPro, signInWithGoogle, signOutUser, firebaseEnabled } = useAuth();

  const handleSignIn = async () => {
    const result = await signInWithGoogle();
    if (!result.ok && result.error) {
      alert(result.error);
    }
  };

  return (
    <header className="sticky top-0 z-50">
      <div className="mx-auto max-w-[1100px] px-4 pt-3 sm:px-5">
        <div className="rounded-2xl border border-[#253047] bg-[rgba(8,10,16,0.76)] backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.35)]">
          <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-5">
            <Link href="/" className="flex items-center gap-2">
              <div className="text-xl font-black tracking-tight flex items-center gap-1.5">
                <span className="text-[#ece8df]">PDF</span>
                <span className="rounded-md bg-[#ffcf48] px-2 py-0.5 text-[#07080b]">X</span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
              <Link href="/" className="text-[#acb4c1] hover:text-[#ece8df] transition-colors">
                Инструменты
              </Link>
              <Link href="/blog" className="text-[#acb4c1] hover:text-[#ece8df] transition-colors">
                Блог
              </Link>
              <Link href="/pricing" className="text-[#acb4c1] hover:text-[#ece8df] transition-colors">
                Цены
              </Link>
            </nav>

            <div className="flex items-center gap-2">
              <span
                className={`rounded-lg border px-2 py-1 text-[10px] font-semibold ${
                  isPro
                    ? "border-[#f8d458] bg-[rgba(248,212,88,0.15)] text-[#ffe7a0]"
                    : "border-[#3a4868] bg-[rgba(58,72,104,0.15)] text-[#adb7cb]"
                }`}
              >
                {loading ? "..." : isPro ? "PRO" : "FREE"}
              </span>

              {isAuthenticated ? (
                <button
                  type="button"
                  onClick={signOutUser}
                  className="rounded-xl border border-[#3f4a63] px-3 py-1.5 text-xs font-bold text-[#cfd7e5] hover:border-[#5b6b8e] transition-colors"
                >
                  Выйти
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSignIn}
                  disabled={!firebaseEnabled}
                  className="rounded-xl bg-gradient-to-r from-[#ffcf48] to-[#ff8e3c] px-3.5 py-1.5 text-xs font-black text-[#07080b] shadow-[0_8px_26px_rgba(255,166,67,0.35)] hover:brightness-110 transition-all disabled:cursor-not-allowed disabled:opacity-60"
                  title={firebaseEnabled ? "Войти через Google" : "Настрой Firebase переменные окружения"}
                >
                  Войти
                </button>
              )}
            </div>
          </div>

          <nav className="md:hidden border-t border-[#1b2233] px-4 py-2.5 flex items-center gap-4 text-xs">
            <Link href="/" className="text-[#9ca6b6] hover:text-[#ece8df] transition-colors">
              Инструменты
            </Link>
            <Link href="/blog" className="text-[#9ca6b6] hover:text-[#ece8df] transition-colors">
              Блог
            </Link>
            <Link href="/pricing" className="text-[#9ca6b6] hover:text-[#ece8df] transition-colors">
              Цены
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}

