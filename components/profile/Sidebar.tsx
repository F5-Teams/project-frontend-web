"use client";

import {
  Bell,
  Users,
  Calendar as CalendarIcon,
  ClipboardList,
  Settings,
  Info,
  Menu,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Logo from "@/public/logo/HappyPaws only Logo.svg";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export type SidebarProps = {
  open: boolean;
  onToggle: () => void;
};

type NavItem = {
  href: string;
  icon: React.ElementType;
  label: string;
  badge?: boolean;
};

const mainNav: NavItem[] = [
  { href: "/profile/info", icon: Users, label: "Profile" },
  // { href: "/profile/bookings", icon: ClipboardList, label: "Bookings" },
  { href: "/profile/calendar", icon: CalendarIcon, label: "Calendar" },
  // {
  //   href: "/profile/notifications",
  //   icon: Bell,
  //   label: "Notifications",
  //   badge: true,
  // },
];

const bottomNav: NavItem[] = [
  { href: "/profile/settings", icon: Settings, label: "Settings" },
  { href: "/profile/about", icon: Info, label: "About" },
];

export default function Sidebar({ open, onToggle }: SidebarProps) {
  const pathname = usePathname();

  const NavButton = ({ item }: { item: NavItem }) => {
    const Icon = item.icon;
    const isActive =
      pathname === item.href ||
      (item.href !== "/profile/info" && pathname?.startsWith(item.href));

    return (
      <Link
        href={item.href}
        aria-label={item.label}
        aria-current={isActive ? "page" : undefined}
        onClick={onToggle}
        className={cn(
          "relative w-10 h-10 lg:w-12 lg:h-12 rounded-xl flex items-center justify-center transition-colors",
          isActive
            ? "bg-primary/20 text-primary"
            : "text-primary hover:bg-pink-200"
        )}
        title={item.label}
      >
        <Icon className="w-5 h-5 lg:w-6 lg:h-6" />
        {item.badge && (
          <span className="absolute top-2 right-2 w-2 h-2 bg-green-400 rounded-full" />
        )}
      </Link>
    );
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={onToggle}
        className="lg:hidden fixed top-4 left-4 z-50 w-12 h-12 bg-primary/50 text-white rounded-xl flex items-center justify-center shadow-lg"
        aria-label={open ? "Close menu" : "Open menu"}
      >
        {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:relative inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out",
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          "w-20 lg:w-[100px] bg-white/40 backdrop-blur shadow-lg rounded-none lg:rounded-3xl lg:m-4 flex flex-col items-center py-8 space-y-6 lg:space-y-8"
        )}
      >
        <div className="flex items-center justify-center">
          <Link
            href="/"
            className="cursor-pointer"
            onClick={onToggle}
            aria-label="Home"
          >
            <Image
              alt="Logo"
              src={Logo}
              className="object-contain"
              width={50}
              height={50}
              style={{ maxHeight: "56px" }}
              priority
            />
          </Link>
        </div>

        <nav className="flex flex-col space-y-4 lg:space-y-6 flex-1">
          {mainNav.map((item) => (
            <NavButton key={item.href} item={item} />
          ))}
        </nav>

        <nav className="flex flex-col space-y-4 lg:space-y-6 pb-2">
          {bottomNav.map((item) => (
            <NavButton key={item.href} item={item} />
          ))}
        </nav>
      </aside>

      {/* Overlay for mobile */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={onToggle}
          aria-hidden="true"
        />
      )}
    </>
  );
}
