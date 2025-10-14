"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { type LucideIcon } from "lucide-react";

export type SidebarItem = {
  href: string;
  label: string;
  icon?: LucideIcon;
};

export default function Sidebar({
  title,
  items,
}: {
  title: string;
  items: SidebarItem[];
}) {
  const pathname = usePathname();

  return (
    <aside className="w-64 shrink-0 h-full bg-white/70 backdrop-blur border-r rounded-2xl p-4 shadow-lg hidden md:flex md:flex-col">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-xs text-muted-foreground">Quản trị hệ thống</p>
      </div>
      <nav className="flex flex-col gap-1">
        {items.map((item) => {
          const active =
            pathname === item.href || pathname?.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition",
                active ? "bg-primary/10 text-primary" : "hover:bg-muted"
              )}
            >
              {Icon ? <Icon className="w-4 h-4" /> : null}
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
