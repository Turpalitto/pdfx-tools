"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

export default function SubscribeButton() {
  const [loading, setLoading] = useState(false);
  const { isAuthenticated, signInWithGoogle, getIdToken } = useAuth();

  const handleCheckout = async () => {
    try {
      setLoading(true);

      if (!isAuthenticated) {
        const authResult = await signInWithGoogle();
        if (!authResult.ok) {
          throw new Error(authResult.error || "Требуется вход через Google.");
        }
      }

      const token = await getIdToken();
      if (!token) {
        throw new Error("Не удалось получить токен авторизации. Попробуйте снова.");
      }

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();

      if (!res.ok) {
        const msg = data?.error?.message || data?.error || "Checkout недоступен.";
        throw new Error(msg);
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Checkout недоступен.";
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      disabled={loading}
      onClick={handleCheckout}
      className="w-full mt-6 bg-gradient-to-r from-[#ffdc50] to-[#ff8c42] text-[#070809] font-black py-3 rounded-lg disabled:opacity-70"
    >
      {loading ? "Переход к оплате..." : "Подписаться"}
    </button>
  );
}

