import { Sidebar, SidebarItem } from "./Sidebar";
import Topbar from "./topbar";

export function DashboardShell({
  items,
  children,
}: {
  items: SidebarItem[];
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#fffafc] flex">
      <Sidebar items={items} />
      <div className="flex-1 ml-64 flex flex-col">
        <Topbar />
        <main className="flex-1 bg-[#fffafc] min-h-screen overflow-y-auto">
          <div className="max-w-7xl mx-auto space-y-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
