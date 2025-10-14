"use client";

import Sidebar, { SidebarItem } from "./Sidebar";

export default function DashboardLayout({
  children,
  sidebarTitle,
  sidebarItems,
}: {
  children: React.ReactNode;
  sidebarTitle: string;
  sidebarItems: SidebarItem[];
  pageTitle: string;
  userName: string;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-3 md:p-6">
      <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-[16rem_1fr] gap-4">
        {/* Sidebar desktop */}
        <div className="hidden md:block">
          <Sidebar title={sidebarTitle} items={sidebarItems} />
        </div>

        {/* Nội dung */}
        <div className="flex flex-col gap-4">
          <main className="grid gap-4">{children}</main>
        </div>
      </div>
    </div>
  );
}
