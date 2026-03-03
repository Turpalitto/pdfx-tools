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
        <div className="rounded-2xl border border-[#d7dfeb] bg-[rgba(255,255,255,0.9)] backdrop-blur-xl shadow-[0_16px_40px_rgba(46,72,109,0.14)]">
          <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-5">
            <Link href="/" className="flex items-center gap-2">
              <div className="text-xl font-black tracking-tight flex items-center gap-1.5">
                <span className="text-[#162035]">PDF</span>
                <span className="rounded-md bg-[#ffcf48] px-2 py-0.5 text-[#07080b]">X</span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
              <Link href="/" className="text-[#5e6e86] hover:text-[#162035] transition-colors">
                Инструменты
              </Link>
              <Link href="/blog" className="text-[#5e6e86] hover:text-[#162035] transition-colors">
                Блог
              </Link>
              <Link href="/pricing" className="text-[#5e6e86] hover:text-[#162035] transition-colors">
                Цены
              </Link>
            </nav>

            <div className="flex items-center gap-2">
              <span
                className={`rounded-lg border px-2 py-1 text-[10px] font-semibold ${
                  isPro
                    ? "border-[#f8d458] bg-[rgba(248,212,88,0.2)] text-[#8a5a03]"
                    : "border-[#ced7e6] bg-[#f3f7fc] text-[#5f708a]"
                }`}
              >
                {loading ? "..." : isPro ? "PRO" : "FREE"}
              </span>

              {isAuthenticated ? (
                <button
                  type="button"
                  onClick={signOutUser}
                  className="rounded-xl border border-[#c7d3e4] bg-[#f7fafe] px-3 py-1.5 text-xs font-bold text-[#2e3b52] hover:border-[#9fb1ca] transition-colors"
                >
                  Выйти
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSignIn}
                  disabled={!firebaseEnabled}
                  className="rounded-xl bg-gradient-to-r from-[#ffcc4f] to-[#ff9c4d] px-3.5 py-1.5 text-xs font-black text-[#271a00] shadow-[0_10px_24px_rgba(255,166,67,0.32)] hover:brightness-105 transition-all disabled:cursor-not-allowed disabled:opacity-60"
                  title={firebaseEnabled ? "Войти через Google" : "Настрой Firebase переменные окружения"}
                >
                  Войти
                </button>
              )}
            </div>
          </div>

          <nav className="md:hidden border-t border-[#dbe3ef] px-4 py-2.5 flex items-center gap-4 text-xs">
            <Link href="/" className="text-[#607089] hover:text-[#162035] transition-colors">
              Инструменты
            </Link>
            <Link href="/blog" className="text-[#607089] hover:text-[#162035] transition-colors">
              Блог
            </Link>
            <Link href="/pricing" className="text-[#607089] hover:text-[#162035] transition-colors">
              Цены
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
