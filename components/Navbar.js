"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

export default function Navbar() {
  const { isAuthenticated, loading, isPro, signInWithGoogle, signOutUser, firebaseEnabled } = useAuth();

  const handleSignIn = async () => {
    const result = await signInWithGoogle();
    if (!result.ok && result.error) alert(result.error);
  };

  return (
    <header className="sticky top-0 z-50">
      <div className="mx-auto max-w-[1280px] px-4 pt-3 sm:px-5">
        <div className="rounded-2xl border border-[#d4dff0] bg-[rgba(255,255,255,0.92)] backdrop-blur-xl shadow-[0_8px_32px_rgba(46,72,109,0.10)]">
          <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-5">

            <Link href="/" className="flex items-center gap-2 group">
              <div className="text-xl font-black tracking-tight flex items-center gap-1.5">
                <span className="text-[#162035] group-hover:text-[#0d1624] transition-colors">PDF</span>
                <span className="rounded-md bg-gradient-to-br from-[#ffcf48] to-[#ffa834] px-2 py-0.5 text-[#07080b] shadow-[0_2px_8px_rgba(255,182,72,0.35)] group-hover:shadow-[0_4px_12px_rgba(255,182,72,0.45)] transition-shadow">
                  X
                </span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
              {[
                { href: "/",        label: "Инструменты" },
                { href: "/blog",    label: "Блог"        },
                { href: "/pricing", label: "Цены"        },
              ].map(({ href, label }) => (
                <Link key={href} href={href} className="text-[#5e6e86] hover:text-[#162035] transition-colors">
                  {label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <span className={`rounded-lg border px-2.5 py-1 text-[10px] font-bold tracking-wide ${
                isPro
                  ? "border-[#f0c030] bg-[rgba(248,212,88,0.15)] text-[#8a5a03]"
                  : "border-[#d0daea] bg-[#f3f7fc] text-[#5f708a]"
              }`}>
                {loading ? "···" : isPro ? "✦ PRO" : "FREE"}
              </span>

              {isAuthenticated ? (
                <button type="button" onClick={signOutUser}
                  className="rounded-xl border border-[#c7d3e4] bg-[#f7fafe] px-3 py-1.5 text-xs font-bold text-[#2e3b52] hover:border-[#9fb1ca] hover:bg-white transition-all">
                  Выйти
                </button>
              ) : (
                <button type="button" onClick={handleSignIn} disabled={!firebaseEnabled}
                  className="rounded-xl bg-gradient-to-r from-[#ffcc4f] to-[#ff9c4d] px-4 py-1.5 text-xs font-black text-[#271a00] shadow-[0_4px_16px_rgba(255,166,67,0.28)] hover:shadow-[0_6px_20px_rgba(255,166,67,0.38)] hover:brightness-105 transition-all disabled:cursor-not-allowed disabled:opacity-60"
                  title={firebaseEnabled ? "Войти через Google" : "Настрой Firebase переменные окружения"}>
                  Войти
                </button>
              )}
            </div>
          </div>

          <nav className="md:hidden border-t border-[#dbe3ef]/70 px-4 py-2.5 flex items-center gap-5 text-xs">
            {[
              { href: "/",        label: "Инструменты" },
              { href: "/blog",    label: "Блог"        },
              { href: "/pricing", label: "Цены"        },
            ].map(({ href, label }) => (
              <Link key={href} href={href} className="text-[#607089] hover:text-[#162035] transition-colors font-medium">
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
