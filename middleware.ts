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
  "/favicon.ico",
  "/about-us",
];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const token = req.cookies.get("accessToken")?.value ?? null;
  const role = req.cookies.get("role")?.value?.toUpperCase() ?? null;

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
