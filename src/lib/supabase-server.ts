import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function supabaseServer() {
  const store = await cookies();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error("Supabase environment variables are missing.");
  }

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return store.getAll();
      },
      setAll(values: { name: string; value: string; options: CookieOptions }[]) {
        try {
          values.forEach(({ name, value, options }) => {
            store.set(name, value, options);
          });
        } catch {
          // Server Components cannot always write cookies; middleware handles refreshes.
        }
      },
    },
  });
}

export async function requireOwner() {
  const { hasAdminSession } = await import("@/lib/admin-session");
  if (!(await hasAdminSession())) return null;
  const supabase = await supabaseServer();
  return { supabase, user: { email: process.env.ADMIN_EMAIL || "narsingbeesetti006@gmail.com" } };
}
