import { Home, Users, ClipboardList, Settings, Package, Calendar, PawPrint } from "lucide-react";
import type { SidebarItem } from "./Sidebar";


export const adminMenu: SidebarItem[] = [
{ href: "/admin", label: "Tổng quan", icon: Home },
{ href: "/admin/users", label: "Người dùng", icon: Users },
{ href: "/admin/services", label: "Dịch vụ", icon: PawPrint },
{ href: "/admin/orders", label: "Đơn/Booking", icon: ClipboardList },
{ href: "/admin/inventory", label: "Kho hàng", icon: Package },
{ href: "/admin/schedule", label: "Lịch làm", icon: Calendar },
{ href: "/admin/settings", label: "Cài đặt", icon: Settings },
];


export const staffMenu: SidebarItem[] = [
{ href: "/staff", label: "Bảng việc", icon: Home },
{ href: "/staff/orders", label: "Đơn được giao", icon: ClipboardList },
{ href: "/staff/schedule", label: "Lịch cá nhân", icon: Calendar },
{ href: "/staff/settings", label: "Cài đặt", icon: Settings },
];