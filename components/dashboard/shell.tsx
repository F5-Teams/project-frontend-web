import { SidebarItem } from "./sidebar";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./topbar";

export function DashboardShell({
  items,
  children,
}: {
  items: SidebarItem[];
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex">
        <Sidebar items={items} />
        <main className="flex-1">
          <Topbar />
          <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
