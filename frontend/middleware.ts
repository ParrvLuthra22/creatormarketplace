import { NextRequest, NextResponse } from "next/server";

/**
 * Edge-level route guard. Only checks for the PRESENCE of the `token` cookie —
 * it cannot safely decode/verify the JWT here (no access to JWT_SECRET at the
 * edge), so role correctness (Brand vs Creator vs admin) is re-checked
 * client-side after hydration via `refreshUser()` in each dashboard layout.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasToken = Boolean(request.cookies.get("token")?.value);

  if (hasToken) return NextResponse.next();

  if (pathname.startsWith("/dashboard/brand")) {
    return NextResponse.redirect(new URL("/login/brand", request.url));
  }

  if (pathname.startsWith("/dashboard/creator")) {
    return NextResponse.redirect(new URL("/login/creator", request.url));
  }

  if (pathname.startsWith("/dashboard/admin")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (pathname.startsWith("/onboarding")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/brand/:path*",
    "/dashboard/creator/:path*",
    "/dashboard/admin/:path*",
    "/onboarding",
  ],
};
