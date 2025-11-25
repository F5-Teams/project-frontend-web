import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const roleHome: Record<string, string> = {
  ADMIN: "/admin",
  STAFF: "/staff",
  GROOMER: "/groomer/dashboard",
  CUSTOMER: "/",
};

const guards: Array<{ prefix: string; allow: string[] }> = [
  { prefix: "/admin", allow: ["ADMIN"] },
  { prefix: "/staff", allow: ["STAFF", "ADMIN"] },
  { prefix: "/groomer/dashboard", allow: ["GROOMER", "ADMIN"] },
];

const publicPrefixes = [
  "/login",
  "/register",
  "/_next",
  "/images",
  "/models", // Allow 3D model files to be accessed without authentication
  "/icons",
  "/logo",
  "/sound",
  "/favicon.ico",
  "/about-us",
  // Allow viewing spa & hotel pages without authentication
  "/spa",
  "/hotel",
];

// Paths (or prefixes) that should still require authentication even when their
// parent pages (like /hotel or /spa) are public. We check these BEFORE the
// publicPrefixes check so they can't be accidentally bypassed.
const bookingProtectedPrefixes = [
  "/bookings",
  "/checkout",
  "/orders",
  // Keep generic booking-related API or UI routes protected
  "/api/bookings",
];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const token = req.cookies.get("accessToken")?.value ?? null;
  const role = req.cookies.get("role")?.value?.toUpperCase() ?? null;

  // If the request targets one of the booking-protected prefixes, require auth.
  // e.g. /bookings/bulk, /bookings/..., /checkout, /orders/...
  if (
    bookingProtectedPrefixes.some(
      (p) =>
        pathname === p ||
        pathname.startsWith(p + "/") ||
        pathname.includes(p + "/")
    )
  ) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  if (pathname === "/") {
    if (token && role && ["ADMIN", "STAFF", "GROOMER"].includes(role)) {
      const destination = roleHome[role] ?? "/";
      return NextResponse.redirect(new URL(destination, req.url));
    }
    return NextResponse.next();
  }

  if (publicPrefixes.some((p) => pathname === p || pathname.startsWith(p))) {
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  for (const g of guards) {
    if (pathname.startsWith(g.prefix)) {
      if (!role || !g.allow.includes(role)) {
        const back = roleHome[role ?? ""] ?? "/";
        return NextResponse.redirect(new URL(back, req.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
