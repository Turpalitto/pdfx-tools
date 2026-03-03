import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { FREE_OPS_PER_DAY } from "@/lib/tools-config";
import { getAdminDb, getAdminStatus, getDateKeyUTC, verifyAuthFromRequest } from "@/lib/firebase-admin";
import { makeError } from "@/lib/env";

export const runtime = "nodejs";

export async function POST(req) {
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

  let toolId;
  try {
    const body = await req.json();
    toolId = body?.toolId;
  } catch {
    return NextResponse.json({ error: makeError("BAD_REQUEST", "Некорректный JSON в запросе.") }, { status: 400 });
  }

  if (!toolId || typeof toolId !== "string") {
    return NextResponse.json(
      { error: makeError("VALIDATION_ERROR", "Поле toolId обязательно и должно быть строкой.") },
      { status: 400 }
    );
  }

  try {
    const db = getAdminDb();
    const dateKey = getDateKeyUTC();
    const userRef = db.collection("users").doc(verified.uid);
    const usageRef = db.collection("daily_usage").doc(`${verified.uid}_${dateKey}`);

    const result = await db.runTransaction(async (tx) => {
      const userSnap = await tx.get(userRef);
      const now = FieldValue.serverTimestamp();
      const userData = userSnap.exists ? userSnap.data() : null;

      if (!userSnap.exists) {
        tx.set(
          userRef,
          {
            plan: "free",
            subscriptionStatus: "none",
            email: verified.email || "",
            createdAt: now,
            updatedAt: now,
          },
          { merge: true }
        );
      }

      const plan = userData?.plan === "pro" ? "pro" : "free";
      if (plan === "pro") {
        return {
          allowed: true,
          reason: "ok",
          remainingToday: Number.MAX_SAFE_INTEGER,
          plan,
          usedToday: 0,
        };
      }

      const usageSnap = await tx.get(usageRef);
      const currentCount = Number(usageSnap.data()?.count || 0);

      if (currentCount >= FREE_OPS_PER_DAY) {
        return {
          allowed: false,
          reason: "limit_exceeded",
          remainingToday: 0,
          plan,
          usedToday: currentCount,
        };
      }

      const nextCount = currentCount + 1;
      tx.set(
        usageRef,
        {
          uid: verified.uid,
          date: dateKey,
          count: nextCount,
          limit: FREE_OPS_PER_DAY,
          updatedAt: now,
        },
        { merge: true }
      );

      tx.set(
        userRef,
        {
          updatedAt: now,
          email: verified.email || userData?.email || "",
        },
        { merge: true }
      );

      return {
        allowed: true,
        reason: "ok",
        remainingToday: Math.max(0, FREE_OPS_PER_DAY - nextCount),
        plan,
        usedToday: nextCount,
      };
    });

    return NextResponse.json(result);
  } catch (error) {
    const details = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: makeError("USAGE_CONSUME_FAILED", "Не удалось обновить дневной лимит.", details) },
      { status: 500 }
    );
  }
}
