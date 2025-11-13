import { DashboardShell } from "@/components/dashboard/shell";
import { SidebarItem } from "@/components/dashboard/sidebar";

const staffItems: SidebarItem[] = [
  { href: "/staff", label: "Dashboard", icon: "dashboard", exact: true },
  { href: "/staff/booking", label: "Đơn chờ", icon: "orders" },
  { href: "/staff/groomer", label: "NV nhân viên", icon: "groomer" },
  { href: "/staff/orders", label: "Đơn hàng", icon: "order" },
  { href: "/staff/delivery", label: "Giao hàng", icon: "delivery" },
  { href: "/staff/chat", label: "Chat Tư Vấn", icon: "messages" },
];

export default function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardShell items={staffItems}>{children}</DashboardShell>;
}
