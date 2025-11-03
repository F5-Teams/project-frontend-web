"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, Calendar, Users, MessageSquare, CreditCard } from "lucide-react";
import Topbar from "@/components/groomer/Topbar";

type Props = { children: React.ReactNode };

export default function GroomerLayout({ children }: Props) {
  const pathname = usePathname() ?? "/";
  const router = useRouter();

  const navLinks = [
    { label: "Booking chờ thực hiện", href: "/groomer/dashboard", icon: Home },
    {
      label: "Báo cáo tiến trình",
      href: "/groomer/progress-reports",
      icon: Calendar,
    },
  ];

  // Logout handler: clear storage + cookies then redirect to login
  function handleLogout() {
    try {
      // Clear localStorage
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      localStorage.removeItem("role");

      // Clear cookies used by middleware
      const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
      document.cookie = `accessToken=; Path=/; Max-Age=0; SameSite=Lax${secure}`;
      document.cookie = `role=; Path=/; Max-Age=0; SameSite=Lax${secure}`;

      // Redirect to login
      router.replace("/login");
    } catch (err) {
      // silent fail
      console.error("Logout error", err);
      router.replace("/login");
    }
  }

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col justify-between">
        <div>
          <div className="px-6 py-6 flex items-center gap-3 border-b border-slate-100">
            <div className="text-2xl font-poppins-medium text-primary">
              HappyPaws
            </div>
            <span className="text-sm text-muted-foreground">Dashboard</span>
          </div>

          <nav className="px-4 py-6 space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname === link.href ||
                    pathname.startsWith(link.href + "/") ||
                    pathname.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={
                    "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors " +
                    (isActive
                      ? "bg-slate-100 text-slate-800"
                      : "text-slate-700 hover:bg-slate-100")
                  }
                >
                  <Icon className="w-5 h-5" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 justify-center px-3 py-2 border border-slate-200 rounded-md text-sm bg-white hover:bg-slate-50"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1">
        {/* Topbar moved to component */}
        <Topbar />

        {/* Content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
