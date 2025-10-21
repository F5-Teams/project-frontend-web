"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { IconKey, ICONS } from "./Icons";
import Image from "next/image";
import Logo from "@/public/logo/HappyPaws Logo.svg";

export type SidebarItem = {
  href: string;
  label: string;
  icon: IconKey;
  exact?: boolean;
};

export function Sidebar({ items }: { items: SidebarItem[] }) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "w-64 h-screen text-pink-600 border-r border-pink-100 sticky top-0 flex flex-col shadow-[4px_0_15px_-5px_rgba(0,0,0,0.05)]",
        "bg-gradient-to-b from-[#FFE5EC] via-[#FFF4E0] to-[#FFD6E0]",
        "animate-gradient"
      )}
    >
      {/* Logo */}
      <div className="px-6 py-6 text-lg font-bold flex items-center gap-3">
        <Image
          alt="Logo"
          src={Logo}
          className="object-contain"
          width={55}
          height={55}
          style={{ maxHeight: "56px" }}
        />
        <span className="tracking-wide">HappyPaws</span>
      </div>

      {/* Nav items */}
      <nav
        aria-label="Main navigation"
        className="px-3 space-y-2 mt-2 overflow-y-auto flex-1"
      >
        {items.map((it) => {
          const Icon = ICONS[it.icon];
          const active = it.exact
            ? pathname === it.href
            : pathname === it.href || pathname?.startsWith(it.href + "/");

          return (
            <Link
              key={it.href}
              href={it.href}
              className={cn(
                "flex items-center gap-3 px-5 py-3 rounded-2xl transition-all duration-300 ease-out font-medium group",
                active
                  ? "bg-gradient-to-r from-pink-500 to-pink-400 text-white shadow-md scale-[1.02]"
                  : "hover:bg-pink-100 hover:text-pink-700"
              )}
              role="link"
              aria-current={active ? "page" : undefined}
            >
              <Icon
                className={cn(
                  "size-5 transition-all duration-300 transform group-hover:scale-110",
                  active ? "text-white" : "text-pink-500"
                )}
              />
              <span className="text-sm">{it.label}</span>

              {active && (
                <span
                  className="ml-auto w-2 h-2 rounded-full bg-white shadow-sm"
                  aria-hidden
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer nhỏ */}
      <div className="mt-auto w-full flex justify-center text-xs text-pink-500 font-medium py-4 opacity-80 hover:opacity-100 transition">
        <span>Made with ♥ by HappyPaws</span>
      </div>
    </aside>
  );
}
