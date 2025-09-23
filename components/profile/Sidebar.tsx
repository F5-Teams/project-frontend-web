"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { UserRound, Lock, ShoppingBag } from "lucide-react";

type LinkItem = {
  href: string;
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

const links: LinkItem[] = [
  { href: "/profile/info", label: "Thông tin cá nhân", icon: UserRound },
  { href: "/profile/password", label: "Thông tin bảo mật", icon: Lock },
  { href: "/profile/orders", label: "Lịch sử đơn hàng", icon: ShoppingBag },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full md:w-64">
      <div
        className={cn(
          "relative overflow-hidden rounded-2xl",
          "bg-white/35 dark:bg-neutral-900/25 backdrop-blur-xl",
          "border border-white/25 dark:border-white/10",
          "shadow-[0_8px_30px_rgba(0,0,0,0.08)]"
        )}
      >
        <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-b from-white/50 via-white/10 to-transparent [mask-image:linear-gradient(to_bottom,black,transparent_70%)]" />

        <nav className="relative p-3 space-y-2">
          {links.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + "/");

            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "group flex items-center gap-3 rounded-xl px-3.5 py-2.5 transition-all",
                  "ring-1 ring-inset ring-white/10 dark:ring-white/5",
                  "hover:translate-x-0.5 hover:bg-white/45 dark:hover:bg-white/10",

                  active
                    ? "bg-white/60 dark:bg-white/10 text-primary ring-primary/30 shadow-sm"
                    : "text-foreground/80"
                )}
              >
                <Icon
                  className={cn(
                    "h-5 w-5 shrink-0 transition-colors",
                    active
                      ? "text-primary"
                      : "text-foreground/60 group-hover:text-primary"
                  )}
                  strokeWidth={1.8}
                />
                <span className="font-poppins-light text-[15px]">{label}</span>

                <span
                  className={cn(
                    "ml-auto h-1.5 w-1.5 rounded-full transition-opacity",
                    active
                      ? "bg-primary/80 opacity-100"
                      : "bg-primary/60 opacity-0 group-hover:opacity-60"
                  )}
                />
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
