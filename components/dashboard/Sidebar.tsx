"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/utils/auth";
import { cn } from "@/lib/utils";
import { IconKey, ICONS } from "./Icons";
import Image from "next/image";
import Logo from "@/public/logo/HappyPaws only Logo.svg";
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
  const [showLogoutConfirm, setShowLogoutConfirm] = React.useState(false);

  const handleLogout = () => {
    if (!showLogoutConfirm) {
      setShowLogoutConfirm(true);
      return;
    }
    logout("/");
  };

  return (
    <aside
      className={cn(
        "fixed top-0 left-0 w-56 h-screen text-pink-600 border-r border-pink-100 flex flex-col shadow-[4px_0_15px_-5px_rgba(0,0,0,0.05)]",
        "bg-linear-to-b from-[#FFE5EC] via-[#FFF4E0] to-[#FFD6E0]",
        "animate-gradien z-50"
      )}
    >
      {/* Logo */}
      <div className="px-4 py-5 flex items-center gap-3">
        <Image
          alt="Logo"
          src={Logo}
          width={40}
          height={40}
          className="object-contain"
        />
        <span className="text-xl font-bold text-pink-700 whitespace-nowrap">
          Happy Paws
        </span>
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

      {/* Footer */}
      <div className="mt-auto w-full px-4 py-4 space-y-2">
        <button
          onClick={handleLogout}
          className={cn(
            "w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all",
            showLogoutConfirm
              ? "bg-red-500 text-white hover:bg-red-600"
              : "bg-pink-50 text-pink-600 hover:bg-pink-100"
          )}
        >
          {showLogoutConfirm ? "Xác nhận đăng xuất?" : "Đăng xuất"}
        </button>
        <div className="text-center text-xs text-primary font-medium opacity-80">
          Made with ♥ by HappyPaws
        </div>
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
          ? "bg-linear-to-r from-pink-500 to-pink-400 text-white shadow-md scale-[1.02]"
          : " hover:text-pink-700"
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
      : "hover:text-pink-700"
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
