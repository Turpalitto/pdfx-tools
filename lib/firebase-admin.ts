import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getAuth, type Auth } from "firebase-admin/auth";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { getOptionalEnv } from "./env";

type AdminStatus = {
  enabled: boolean;
  reason?: string;
};

type VerifyResult =
  | {
      ok: true;
      uid: string;
      email?: string;
      token: string;
    }
  | {
      ok: false;
      status: number;
      code: string;
      message: string;
    };

function getAdminConfig() {
  const projectId = getOptionalEnv("FIREBASE_PROJECT_ID");
  const clientEmail = getOptionalEnv("FIREBASE_CLIENT_EMAIL");
  const privateKey = getOptionalEnv("FIREBASE_PRIVATE_KEY")?.replace(/\\n/g, "\n");

  return { projectId, clientEmail, privateKey };
}

export function getAdminStatus(): AdminStatus {
  const { projectId, clientEmail, privateKey } = getAdminConfig();

  if (!projectId || !clientEmail || !privateKey) {
    return {
      enabled: false,
      reason: "Firebase Admin is not configured (FIREBASE_PROJECT_ID/FIREBASE_CLIENT_EMAIL/FIREBASE_PRIVATE_KEY).",
    };
  }

  return { enabled: true };
}

function getOrInitApp(): App {
  const existing = getApps()[0];
  if (existing) return existing;

  const status = getAdminStatus();
  if (!status.enabled) {
    throw new Error(status.reason ?? "Firebase Admin is not configured.");
  }

  const { projectId, clientEmail, privateKey } = getAdminConfig();
  return initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      privateKey,
    }),
  });
}

export function getAdminAuth(): Auth {
  return getAuth(getOrInitApp());
}

export function getAdminDb(): Firestore {
  return getFirestore(getOrInitApp());
}

export function getBearerToken(req: Request): string | null {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) return null;
  if (!authHeader.toLowerCase().startsWith("bearer ")) return null;
  return authHeader.slice(7).trim();
}

export async function verifyAuthFromRequest(req: Request): Promise<VerifyResult> {
  const token = getBearerToken(req);
  if (!token) {
    return {
      ok: false,
      status: 401,
      code: "AUTH_REQUIRED",
      message: "Authorization Bearer token is required.",
    };
  }

  const status = getAdminStatus();
  if (!status.enabled) {
    return {
      ok: false,
      status: 500,
      code: "ADMIN_NOT_CONFIGURED",
      message: status.reason ?? "Firebase Admin is not configured.",
    };
  }

  try {
    const decoded = await getAdminAuth().verifyIdToken(token);
    return {
      ok: true,
      uid: decoded.uid,
      email: decoded.email,
      token,
    };
  } catch {
    return {
      ok: false,
      status: 401,
      code: "INVALID_AUTH_TOKEN",
      message: "Failed to verify Firebase auth token.",
    };
  }
}

export function getDateKeyUTC(date = new Date()): string {
  return date.toISOString().slice(0, 10);
}

