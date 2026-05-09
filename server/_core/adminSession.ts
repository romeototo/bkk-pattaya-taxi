import crypto from "node:crypto";
import type { Request } from "express";

export type AdminSessionPayload = {
  adminId: number;
  username: string;
  authenticated: true;
  expiresAt: number;
};

const SESSION_TTL_MS = 24 * 60 * 60 * 1000;

function getSessionSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (secret) return secret;

  if (process.env.NODE_ENV === "production") {
    throw new Error("ADMIN_SESSION_SECRET is required in production");
  }

  return "dev-only-admin-session-secret";
}

function signPayload(payload: string) {
  return crypto.createHmac("sha256", getSessionSecret()).update(payload).digest("base64url");
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) return false;
  return crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

export function createAdminSessionCookie(admin: { id: number; username: string }) {
  const payload: AdminSessionPayload = {
    adminId: admin.id,
    username: admin.username,
    authenticated: true,
    expiresAt: Date.now() + SESSION_TTL_MS,
  };
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = signPayload(encodedPayload);

  return `${encodedPayload}.${signature}`;
}

export function verifyAdminSessionCookie(value: unknown): AdminSessionPayload | null {
  if (typeof value !== "string") return null;

  const [encodedPayload, signature] = value.split(".");
  if (!encodedPayload || !signature) return null;

  const expectedSignature = signPayload(encodedPayload);
  if (!safeEqual(signature, expectedSignature)) return null;

  try {
    const payload = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf8")) as AdminSessionPayload;

    if (payload.authenticated !== true) return null;
    if (!payload.adminId || !payload.username || !payload.expiresAt) return null;
    if (payload.expiresAt <= Date.now()) return null;

    return payload;
  } catch {
    return null;
  }
}

export function isSecureRequest(req: Request) {
  return req.protocol === "https";
}
