import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(req: NextRequest) {
  let res = NextResponse.next({ request: req });

  const supabase = createServerClient(
    process.env.SUPABASE_COS_URL!,
    process.env.SUPABASE_COS_ANON!,
    {
      cookies: {
        getAll: () => req.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) => {
            req.cookies.set(name, value);
            res = NextResponse.next({ request: req });
            res.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !user.email) {
    const url = new URL("/login", req.url);
    return NextResponse.redirect(url);
  }

  // Admin allowlist check via service-role REST call (bypasses RLS).
  const adminCheck = await fetch(
    `${process.env.SUPABASE_COS_URL}/rest/v1/cos_admins?email=eq.${encodeURIComponent(
      user.email
    )}&is_active=eq.true&select=email`,
    {
      headers: {
        apikey: process.env.SUPABASE_COS_SERVICE!,
        Authorization: `Bearer ${process.env.SUPABASE_COS_SERVICE!}`,
      },
      cache: "no-store",
    }
  );

  if (!adminCheck.ok) {
    return NextResponse.redirect(new URL("/login?error=admin_check_failed", req.url));
  }

  const rows = (await adminCheck.json()) as { email: string }[];
  if (!Array.isArray(rows) || rows.length === 0) {
    return NextResponse.redirect(new URL("/login?error=not_authorized", req.url));
  }

  return res;
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
