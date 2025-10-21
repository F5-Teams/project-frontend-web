import { DashboardShell } from "@/components/dashboard/shell";
import { SidebarItem } from "@/components/dashboard/sidebar";

const adminItems: SidebarItem[] = [
  { href: "/admin", label: "Dashboard", icon: "dashboard", exact: true },
  { href: "/admin/customers", label: "Người dùng", icon: "customers" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardShell items={adminItems}>{children}</DashboardShell>;
}
