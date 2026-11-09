import { NextResponse } from "next/server";
import { hasAdminSession, OWNER_EMAIL } from "@/lib/admin-session";

export const dynamic = "force-dynamic";
export async function GET() {
  if (!(await hasAdminSession())) return NextResponse.json({ authenticated: false }, { status: 401 });
  return NextResponse.json({ authenticated: true, email: OWNER_EMAIL });
}
