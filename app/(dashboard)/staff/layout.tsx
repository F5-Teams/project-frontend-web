import { DashboardShell } from "@/components/dashboard/shell";
import type { SidebarItem } from "@/components/dashboard/sidebar";

const staffItems: SidebarItem[] = [
  { href: "/staff", label: "Dashboard", icon: "dashboard", exact: true },
  { href: "/staff/orders", label: "Đơn/Booking", icon: "orders" },
];

export default function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardShell items={staffItems}>{children}</DashboardShell>;
}
