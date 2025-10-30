import { DashboardShell } from "@/components/dashboard/shell";
import type { SidebarItem } from "@/components/dashboard/sidebar";

const staffItems: SidebarItem[] = [
  { href: "/staff", label: "Dashboard", icon: "dashboard", exact: true },
  { href: "/staff/booking", label: "Đơn chờ", icon: "orders" },
  { href: "/staff/groomer", label: "NV nhân viên", icon: "groomer" },
];

export default function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardShell items={staffItems}>{children}</DashboardShell>;
}
