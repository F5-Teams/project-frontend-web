import { DashboardShell } from "@/components/dashboard/shell";
import { SidebarItem } from "@/components/dashboard/sidebar";

const adminItems: SidebarItem[] = [
  {
    href: "/groomer/dashboard",
    label: "Booking chờ thực hiện",
    icon: "groomerCheck",
    exact: true,
  },
  {
    href: "/groomer/progress-reports",
    label: "Báo cáo tiến trình",
    icon: "tasks",
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardShell items={adminItems}>{children}</DashboardShell>;
}
