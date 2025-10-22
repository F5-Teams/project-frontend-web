"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { IconKey, ICONS } from "./Icons";
import Image from "next/image";
import Logo from "@/public/logo/HappyPaws Logo.svg";
import { ChevronDown, ChevronRight } from "lucide-react";
import * as React from "react";

export type SidebarItem = {
  label: string;
  icon: IconKey;
  href?: string;
  exact?: boolean;
  children?: SidebarItem[];
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
        {items.map((it) => (
          <div key={(it.href ?? it.label) + "_node"}>
            {it.children?.length ? (
              <CollapsibleGroup parent={it} pathname={pathname} />
            ) : (
              <NavLinkItem item={it} pathname={pathname} />
            )}
          </div>
        ))}
      </nav>

      {/* Footer nhỏ */}
      <div className="mt-auto w-full flex justify-center text-xs text-pink-500 font-medium py-4 opacity-80 hover:opacity-100 transition">
        <span>Made with ♥ by HappyPaws</span>
      </div>
    </aside>
  );
}

function NavLinkItem({
  item,
  pathname,
}: {
  item: SidebarItem;
  pathname: string;
}) {
  const Icon = ICONS[item.icon];
  const active = item.href
    ? item.exact
      ? pathname === item.href
      : pathname === item.href || pathname?.startsWith(item.href + "/")
    : false;

  return (
    <Link
      href={item.href ?? "#"}
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
      <span className="text-sm">{item.label}</span>
      {active && (
        <span
          className="ml-auto w-2 h-2 rounded-full bg-white shadow-sm"
          aria-hidden
        />
      )}
    </Link>
  );
}

function CollapsibleGroup({
  parent,
  pathname,
}: {
  parent: SidebarItem;
  pathname: string;
}) {
  const Icon = ICONS[parent.icon];
  const someChildActive = (parent.children ?? []).some(
    (c) => c.href && (pathname === c.href || pathname.startsWith(c.href + "/"))
  );
  const [open, setOpen] = React.useState<boolean>(someChildActive);

  React.useEffect(() => {
    if (someChildActive) setOpen(true);
  }, [someChildActive]);

  const parentClasses = cn(
    "flex w-full items-center gap-3 px-5 py-3 rounded-2xl transition-all duration-300 ease-out font-medium",
    open || someChildActive
      ? "bg-pink-100/70 text-pink-700"
      : "hover:bg-pink-100 hover:text-pink-700"
  );

  return (
    <div>
      <button
        className={parentClasses}
        aria-expanded={open}
        aria-controls={`${parent.label}-submenu`}
        onClick={() => setOpen((v) => !v)}
      >
        <Icon
          className={cn(
            "size-5",
            open || someChildActive ? "text-pink-600" : "text-pink-500"
          )}
        />
        <span className="text-sm">{parent.label}</span>
        <span className="ml-auto inline-flex items-center" aria-hidden>
          {open ? (
            <ChevronDown className="size-4" />
          ) : (
            <ChevronRight className="size-4" />
          )}
        </span>
      </button>

      {open && (
        <ul id={`${parent.label}-submenu`} className="mt-1 space-y-1 pl-6">
          {(parent.children ?? []).map((child) => (
            <li key={child.href ?? child.label}>
              <NavLinkItem item={{ ...child }} pathname={pathname} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
