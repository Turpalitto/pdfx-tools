import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import Stripe from "stripe";
import { getAdminDb, getAdminStatus, verifyAuthFromRequest } from "@/lib/firebase-admin";
import { getOptionalEnv, makeError } from "@/lib/env";

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

  const secretKey = getOptionalEnv("STRIPE_SECRET_KEY");
  const priceId = getOptionalEnv("STRIPE_PRICE_ID");
  const appUrl = getOptionalEnv("NEXT_PUBLIC_APP_URL") || "https://pdfx.tools";

  if (!secretKey || !priceId) {
    return NextResponse.json(
      {
        error: makeError(
          "STRIPE_NOT_CONFIGURED",
          "Stripe не настроен. Укажи STRIPE_SECRET_KEY и STRIPE_PRICE_ID."
        ),
      },
      { status: 500 }
    );
  }

  const stripe = new Stripe(secretKey);

  try {
    const db = getAdminDb();
    const userRef = db.collection("users").doc(verified.uid);
    const userSnap = await userRef.get();
    const userData = userSnap.exists ? userSnap.data() : {};

    let stripeCustomerId = userData?.stripeCustomerId;
    const now = FieldValue.serverTimestamp();

    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: verified.email,
        metadata: {
          uid: verified.uid,
        },
      });
      stripeCustomerId = customer.id;
    }

    await userRef.set(
      {
        email: verified.email || userData?.email || "",
        stripeCustomerId,
        updatedAt: now,
        createdAt: userData?.createdAt || now,
        plan: userData?.plan || "free",
      },
      { merge: true }
    );

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: stripeCustomerId,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${appUrl}/pricing?checkout=success`,
      cancel_url: `${appUrl}/pricing?checkout=cancel`,
      allow_promotion_codes: true,
      metadata: {
        uid: verified.uid,
      },
      subscription_data: {
        metadata: {
          uid: verified.uid,
        },
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    const details = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: makeError("CHECKOUT_CREATE_FAILED", "Не удалось создать Stripe Checkout сессию.", details) },
      { status: 500 }
    );
  }
}
