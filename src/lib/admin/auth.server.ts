import { SignJWT, jwtVerify } from "jose";
import { env } from "@/lib/env.server";

const COOKIE_NAME = "admin_session";
const SESSION_TTL_SECONDS = 60 * 60 * 12;

function adminEmail(): string | undefined {
  return env("ADMIN_EMAIL")?.toLowerCase();
}
function adminPassword(): string | undefined {
  return env("ADMIN_PASSWORD");
}

export function adminConfigured(): boolean {
  return Boolean(adminEmail() && adminPassword());
}

function signingKey(): Uint8Array {
  const pw = adminPassword();
  if (!pw) throw new Error("ADMIN_PASSWORD is not set");
  return new TextEncoder().encode(`admin-session:${pw}`);
}

export class AdminUnauthorizedError extends Error {
  readonly status = 401;
  constructor() {
    super("Unauthorized");
    this.name = "AdminUnauthorizedError";
  }
}

export async function adminSignIn(email: string, password: string): Promise<boolean> {
  const expectedEmail = adminEmail();
  const expectedPassword = adminPassword();
  if (!expectedEmail || !expectedPassword) return false;
  if (email.trim().toLowerCase() !== expectedEmail) return false;
  if (password !== expectedPassword) return false;
  const token = await new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_SECONDS}s`)
    .sign(signingKey());
  const { setCookie } = await import("@tanstack/react-start/server");
  setCookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
  return true;
}

export async function adminSignOut(): Promise<void> {
  const { setCookie } = await import("@tanstack/react-start/server");
  setCookie(COOKIE_NAME, "", { path: "/", maxAge: 0 });
}

export async function isAdmin(): Promise<boolean> {
  if (!adminConfigured()) return false;
  const { getCookie } = await import("@tanstack/react-start/server");
  const token = getCookie(COOKIE_NAME);
  if (!token) return false;
  try {
    await jwtVerify(token, signingKey());
    return true;
  } catch {
    return false;
  }
}

export async function requireAdmin(): Promise<void> {
  if (!(await isAdmin())) throw new AdminUnauthorizedError();
}
