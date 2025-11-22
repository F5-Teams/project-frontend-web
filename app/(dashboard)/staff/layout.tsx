import { DashboardShell } from "@/components/dashboard/shell";
import { SidebarItem } from "@/components/dashboard/Sidebar";

const staffItems: SidebarItem[] = [
  { href: "/staff", label: "Dashboard", icon: "dashboard", exact: true },
  { href: "/staff/booking", label: "Đơn chờ", icon: "orders" },
  { href: "/staff/groomer", label: "Phân công nhân viên", icon: "groomer" },
  { href: "/staff/time", label: "Check in-out", icon: "clock" },
  { href: "/staff/orders", label: "Đơn hàng", icon: "order" },
  { href: "/staff/sessions", label: "Yêu cầu tư vấn", icon: "chat" },
  { href: "/staff/in-progress", label: "Chat đang xử lý", icon: "chat" },
];

export default function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardShell items={staffItems}>{children}</DashboardShell>;
}
