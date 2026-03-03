import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { FREE_OPS_PER_DAY } from "@/lib/tools-config";
import { getAdminDb, getAdminStatus, getBearerToken, getDateKeyUTC, verifyAuthFromRequest } from "@/lib/firebase-admin";
import { makeError } from "@/lib/env";

export const runtime = "nodejs";

function guestEntitlements() {
  return {
    authenticated: false,
    plan: "free",
    isPro: false,
    dailyLimit: FREE_OPS_PER_DAY,
    usedToday: 0,
    remainingToday: FREE_OPS_PER_DAY,
  };
}

export async function GET(req) {
  const token = getBearerToken(req);
  if (!token) {
    return NextResponse.json(guestEntitlements());
  }

  const verified = await verifyAuthFromRequest(req);
  if (!verified.ok) {
    return NextResponse.json({ error: makeError(verified.code, verified.message) }, { status: verified.status });
  }

  const adminStatus = getAdminStatus();
  if (!adminStatus.enabled) {
    return NextResponse.json(
      { error: makeError("ADMIN_NOT_CONFIGURED", "Firebase Admin не настроен.", adminStatus.reason) },
      { status: 500 }
    );
  }

  try {
    const db = getAdminDb();
    const userRef = db.collection("users").doc(verified.uid);
    const userSnap = await userRef.get();

    const now = FieldValue.serverTimestamp();
    const userData = userSnap.exists ? userSnap.data() : null;

    if (!userSnap.exists) {
      await userRef.set(
        {
          plan: "free",
          subscriptionStatus: "none",
          email: verified.email || "",
          createdAt: now,
          updatedAt: now,
        },
        { merge: true }
      );
    } else if (verified.email && userData?.email !== verified.email) {
      await userRef.set(
        {
          email: verified.email,
          updatedAt: now,
        },
        { merge: true }
      );
    }

    const plan = userData?.plan === "pro" ? "pro" : "free";
    const isPro = plan === "pro";

    const dateKey = getDateKeyUTC();
    const usageRef = db.collection("daily_usage").doc(`${verified.uid}_${dateKey}`);
    const usageSnap = await usageRef.get();
    const usedToday = Number(usageSnap.data()?.count || 0);
    const remainingToday = isPro ? Number.MAX_SAFE_INTEGER : Math.max(0, FREE_OPS_PER_DAY - usedToday);

    return NextResponse.json({
      authenticated: true,
      plan,
      isPro,
      dailyLimit: FREE_OPS_PER_DAY,
      usedToday,
      remainingToday,
    });
  } catch (error) {
    const details = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: makeError("ENTITLEMENTS_FETCH_FAILED", "Не удалось получить состояние подписки.", details) },
      { status: 500 }
    );
  }
}
