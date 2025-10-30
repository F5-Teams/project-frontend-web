import { DashboardShell } from "@/components/dashboard/shell";
import { SidebarItem } from "@/components/dashboard/sidebar";

const adminItems: SidebarItem[] = [
  { href: "/admin", label: "Dashboard", icon: "dashboard", exact: true },
  { href: "/admin/customers", label: "Người dùng", icon: "customers" },
  { href: "/admin/products", label: "Sản phẩm", icon: "product" },
  { href: "/admin/orders", label: "Đơn hàng", icon: "order" },
  { href: "/admin/delivery", label: "Giao hàng", icon: "delivery" },

  {
    label: "Dịch vụ",
    icon: "services",
    children: [
      { href: "/admin/services/hotel", label: "Hotel", icon: "hotel" },
      { href: "/admin/services/spa", label: "Spa", icon: "spa" },
    ],
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardShell items={adminItems}>{children}</DashboardShell>;
}
