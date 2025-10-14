"use client";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { adminMenu } from "@/components/dashboard/menus";

export default function AdminHome() {
  const userName = "Admin";

  return (
    <DashboardLayout
      sidebarTitle="Admin Menu"
      sidebarItems={adminMenu}
      pageTitle="Bảng điều khiển — Admin"
      userName={userName}
    >
      <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border bg-white p-4 shadow-sm">
          <div className="text-sm text-muted-foreground">Tổng doanh thu</div>
          <div className="text-2xl font-semibold">₫128,500,000</div>
        </div>
        <div className="rounded-2xl border bg-white p-4 shadow-sm">
          <div className="text-sm text-muted-foreground">Đơn hôm nay</div>
          <div className="text-2xl font-semibold">42</div>
        </div>
        <div className="rounded-2xl border bg-white p-4 shadow-sm">
          <div className="text-sm text-muted-foreground">Khách mới</div>
          <div className="text-2xl font-semibold">19</div>
        </div>
        <div className="rounded-2xl border bg-white p-4 shadow-sm">
          <div className="text-sm text-muted-foreground">Tỷ lệ hoàn thành</div>
          <div className="text-2xl font-semibold">97%</div>
        </div>
      </section>

      <section className="rounded-2xl border bg-white p-4 shadow-sm">
        <h3 className="font-semibold mb-2">Đơn gần đây</h3>
        <div className="text-sm text-muted-foreground">
          Bảng/Chart tuỳ bạn tích hợp
        </div>
      </section>
    </DashboardLayout>
  );
}
