import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const ADMIN_SESSION_COOKIE = "meh_admin_session";
export const OWNER_EMAIL = (process.env.ADMIN_EMAIL || "narsingbeesetti006@gmail.com").toLowerCase();
const SESSION_SECONDS = 60 * 60 * 24 * 7;

function signature(expiresAt: string, secret: string) {
  return createHmac("sha256", secret).update(`${OWNER_EMAIL}:${expiresAt}`).digest("hex");
}

function safeEqual(left: string, right: string) {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  return a.length === b.length && timingSafeEqual(a, b);
}

export function verifyAdminPassword(email: string, password: string) {
  const expectedPassword = process.env.ADMIN_PASSWORD;
  if (!expectedPassword || !process.env.ADMIN_SESSION_SECRET) return false;
  return safeEqual(email.trim().toLowerCase(), OWNER_EMAIL) && safeEqual(password, expectedPassword);
}

export function createAdminSession() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 32) throw new Error("ADMIN_SESSION_SECRET must contain at least 32 characters.");
  const expiresAt = String(Math.floor(Date.now() / 1000) + SESSION_SECONDS);
  return { value: `${expiresAt}.${signature(expiresAt, secret)}`, maxAge: SESSION_SECONDS };
}

export async function hasAdminSession() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 32) return false;
  const value = (await cookies()).get(ADMIN_SESSION_COOKIE)?.value;
  if (!value) return false;
  const [expiresAt, suppliedSignature, extra] = value.split(".");
  if (!expiresAt || !suppliedSignature || extra || !/^\d+$/.test(expiresAt)) return false;
  if (Number(expiresAt) <= Math.floor(Date.now() / 1000)) return false;
  return safeEqual(suppliedSignature, signature(expiresAt, secret));
}
