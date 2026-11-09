import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, createAdminSession, verifyAdminPassword } from "@/lib/admin-session";

export const runtime = "nodejs";
export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) {
    return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  }
  const body = await request.json().catch(() => null);
  if (!body || typeof body.email !== "string" || typeof body.password !== "string") {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  }
  if (!verifyAdminPassword(body.email, body.password)) {
    return NextResponse.json({ error: "Invalid owner email or password." }, { status: 401 });
  }
  try {
    const session = createAdminSession();
    const response = NextResponse.json({ success: true, email: body.email.trim().toLowerCase() });
    response.cookies.set(ADMIN_SESSION_COOKIE, session.value, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: session.maxAge,
    });
    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Admin login is not configured.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
