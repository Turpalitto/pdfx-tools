import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import Stripe from "stripe";
import { getAdminDb, getAdminStatus } from "@/lib/firebase-admin";
import { getOptionalEnv, makeError } from "@/lib/env";

export const runtime = "nodejs";

const ACTIVE_STATUSES = new Set(["active", "trialing"]);

function isProSubscription(status) {
  return ACTIVE_STATUSES.has(status || "");
}

function toDateOrNull(unixTs) {
  if (!unixTs) return null;
  return new Date(unixTs * 1000);
}

async function resolveUidByCustomer(db, customerId) {
  if (!customerId) return null;
  const query = await db.collection("users").where("stripeCustomerId", "==", customerId).limit(1).get();
  if (query.empty) return null;
  return query.docs[0].id;
}

async function upsertUserFromSubscription(db, uid, patch) {
  const now = FieldValue.serverTimestamp();
  const ref = db.collection("users").doc(uid);
  await ref.set(
    {
      plan: "free",
      subscriptionStatus: "none",
      updatedAt: now,
      ...patch,
    },
    { merge: true }
  );
}

async function processEvent({ event, db, stripe }) {
  const now = FieldValue.serverTimestamp();
  const type = event.type;

  if (type === "checkout.session.completed") {
    const session = event.data.object;
    const uid = session.metadata?.uid;

    if (!uid) return { uid: null, status: "skipped_no_uid" };

    let subscriptionStatus = "active";
    let currentPeriodEnd = null;

    if (session.subscription) {
      const sub = await stripe.subscriptions.retrieve(String(session.subscription));
      subscriptionStatus = sub.status;
      currentPeriodEnd = toDateOrNull(sub.current_period_end);
    }

    await upsertUserFromSubscription(db, uid, {
      plan: isProSubscription(subscriptionStatus) ? "pro" : "free",
      subscriptionStatus,
      stripeCustomerId: session.customer || null,
      stripeSubscriptionId: session.subscription || null,
      currentPeriodEnd,
      updatedAt: now,
    });

    return { uid, status: subscriptionStatus };
  }

  if (
    type === "customer.subscription.updated" ||
    type === "customer.subscription.deleted" ||
    type === "invoice.paid" ||
    type === "invoice.payment_failed"
  ) {
    let subscription = null;
    let customerId = null;

    if (type.startsWith("customer.subscription.")) {
      subscription = event.data.object;
      customerId = subscription.customer;
    } else {
      const invoice = event.data.object;
      customerId = invoice.customer;
      if (invoice.subscription) {
        subscription = await stripe.subscriptions.retrieve(String(invoice.subscription));
      }
    }

    const uidFromMetadata = subscription?.metadata?.uid || null;
    const uid = uidFromMetadata || (await resolveUidByCustomer(db, customerId));

    if (!uid) return { uid: null, status: "skipped_no_uid" };

    const subscriptionStatus = subscription?.status || (type === "invoice.paid" ? "active" : "past_due");
    const shouldBePro = isProSubscription(subscriptionStatus) && type !== "customer.subscription.deleted";

    await upsertUserFromSubscription(db, uid, {
      plan: shouldBePro ? "pro" : "free",
      subscriptionStatus,
      stripeCustomerId: customerId || null,
      stripeSubscriptionId: subscription?.id || null,
      currentPeriodEnd: toDateOrNull(subscription?.current_period_end),
      updatedAt: now,
    });

    return { uid, status: subscriptionStatus };
  }

  return { uid: null, status: "ignored_event_type" };
}

export async function POST(req) {
  const secretKey = getOptionalEnv("STRIPE_SECRET_KEY");
  const webhookSecret = getOptionalEnv("STRIPE_WEBHOOK_SECRET");
  const adminStatus = getAdminStatus();

  if (!secretKey || !webhookSecret) {
    return NextResponse.json(
      { error: makeError("STRIPE_NOT_CONFIGURED", "Stripe webhook не настроен.") },
      { status: 500 }
    );
  }

  if (!adminStatus.enabled) {
    return NextResponse.json(
      { error: makeError("ADMIN_NOT_CONFIGURED", "Firebase Admin не настроен.", adminStatus.reason) },
      { status: 500 }
    );
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: makeError("MISSING_SIGNATURE", "Stripe signature header is required.") }, { status: 400 });
  }

  const stripe = new Stripe(secretKey);
  const payload = await req.text();
  let event;

  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (error) {
    const details = error instanceof Error ? error.message : "Invalid signature";
    return NextResponse.json({ error: makeError("INVALID_SIGNATURE", "Stripe webhook signature is invalid.", details) }, { status: 400 });
  }

  const db = getAdminDb();
  const eventRef = db.collection("stripe_events").doc(event.id);
  const eventSnap = await eventRef.get();
  if (eventSnap.exists) {
    return NextResponse.json({ received: true, duplicate: true });
  }

  try {
    const processed = await processEvent({ event, db, stripe });
    await eventRef.set({
      eventId: event.id,
      type: event.type,
      uid: processed.uid,
      status: processed.status,
      createdAt: FieldValue.serverTimestamp(),
    });

    if (process.env.NODE_ENV !== "production") {
      console.log("[stripe:webhook]", {
        eventId: event.id,
        type: event.type,
        uid: processed.uid,
        status: processed.status,
      });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    const details = error instanceof Error ? error.message : "Unknown webhook error";
    await eventRef.set({
      eventId: event.id,
      type: event.type,
      status: "failed",
      error: details,
      createdAt: FieldValue.serverTimestamp(),
    });
    return NextResponse.json(
      { error: makeError("WEBHOOK_PROCESSING_FAILED", "Не удалось обработать Stripe webhook.", details) },
      { status: 500 }
    );
  }
}
