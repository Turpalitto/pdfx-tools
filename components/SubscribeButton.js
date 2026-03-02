"use client";

import { useState } from "react";

export default function SubscribeButton() {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/checkout", { method: "POST" });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Checkout is unavailable");
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      alert(error.message || "Checkout is unavailable right now.");
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