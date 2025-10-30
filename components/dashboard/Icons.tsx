"use client";
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  ShoppingCart,
  Package2,
  Wallet,
  ClipboardList,
  Settings,
  LifeBuoy,
  UserCircle2,
  LogOut,
  MessageSquare,
  Bell,
  LucideIcon,
  SquareBottomDashedScissors,
  Bath,
  Hotel,
  Package,
  ShoppingBag,
  Truck,
} from "lucide-react";

export type IconKey =
  | "dashboard"
  | "customers"
  | "projects"
  | "orders"
  | "inventory"
  | "accounts"
  | "tasks"
  | "settings"
  | "support"
  | "profile"
  | "logout"
  | "messages"
  | "services"
  | "spa"
  | "hotel"
  | "bell"
  | "product"
  | "order"
  | "delivery";

export const ICONS: Record<IconKey, LucideIcon> = {
  dashboard: LayoutDashboard,
  customers: Users,
  projects: FolderKanban,
  orders: ShoppingCart,
  inventory: Package2,
  accounts: Wallet,
  tasks: ClipboardList,
  settings: Settings,
  support: LifeBuoy,
  profile: UserCircle2,
  logout: LogOut,
  messages: MessageSquare,
  bell: Bell,
  services: SquareBottomDashedScissors,
  spa: Bath,
  hotel: Hotel,
  product: Package,
  order: ShoppingBag,
  delivery: Truck,
};
