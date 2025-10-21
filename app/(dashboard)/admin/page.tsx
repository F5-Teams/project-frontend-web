"use client";

import { ICONS } from "@/components/dashboard/Icons";
import { StatCard } from "@/components/dashboard/stat-card";
import Image from "next/image";

export default function Page() {
  const People = ICONS.customers;
  const Folder = ICONS.projects;
  const Bag = ICONS.orders;

  const rows = [
    {
      title: "Thiết kế UI/UX",
      dept: "UI Team",
      status: "đánh giá",
      dot: "bg-purple-600",
    },
    {
      title: "Web bán hàng",
      dept: "Frontend",
      status: "đang làm",
      dot: "bg-pink-600",
    },
    {
      title: "Ushop app",
      dept: "Mobile Team",
      status: "chờ duyệt",
      dot: "bg-orange-500",
    },
    {
      title: "Landing marketing",
      dept: "Frontend",
      status: "đang làm",
      dot: "bg-pink-600",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Thống kê nhanh */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          value={54}
          label="Khách hàng"
          icon={
            <span className="inline-grid place-content-center w-10 h-10 rounded-xl bg-pink-50 text-pink-600 border">
              <People className="size-5" />
            </span>
          }
        />
        <StatCard
          value={79}
          label="Dự án"
          icon={
            <span className="inline-grid place-content-center w-10 h-10 rounded-xl bg-pink-50 text-pink-600 border">
              <Folder className="size-5" />
            </span>
          }
        />
        <StatCard
          value={124}
          label="Đơn hàng"
          icon={
            <span className="inline-grid place-content-center w-10 h-10 rounded-xl bg-pink-50 text-pink-600 border">
              <Bag className="size-5" />
            </span>
          }
        />
        <StatCard value="$6k" label="Doanh thu" />
      </section>

      {/* Bảng & danh sách bên phải */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bảng dự án gần đây */}
        <div className="lg:col-span-2 bg-white rounded-2xl border shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b bg-slate-50">
            <h2 className="font-semibold">Dự án gần đây</h2>
            <button className="text-xs md:text-sm bg-pink-600 hover:bg-pink-700 text-white px-3 py-1.5 rounded-lg transition">
              Xem tất cả →
            </button>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted-foreground border-b">
                <th className="px-6 py-3">Tiêu đề</th>
                <th className="px-6 py-3">Phòng ban</th>
                <th className="px-6 py-3">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {rows.map((r, i) => (
                <tr key={i}>
                  <td className="px-6 py-3">{r.title}</td>
                  <td className="px-6 py-3">{r.dept}</td>
                  <td className="px-6 py-3">
                    <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full border text-xs">
                      <span
                        className={`inline-block w-2 h-2 rounded-full ${r.dot}`}
                      />
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Khách hàng mới */}
        <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b bg-slate-50">
            <h2 className="font-semibold">Khách hàng mới</h2>
            <button className="text-xs md:text-sm bg-pink-600 hover:bg-pink-700 text-white px-3 py-1.5 rounded-lg transition">
              Xem tất cả →
            </button>
          </div>
          <ul className="p-4 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <li key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Image
                    src={`https://i.pravatar.cc/40?img=${i + 1}`}
                    alt="avatar"
                    width={40}
                    height={40}
                    className="w-9 h-9 rounded-full object-cover"
                    sizes="40px"
                  />
                  <div className="leading-tight">
                    <div className="text-sm font-medium">
                      Lewis S. Cunningham
                    </div>
                    <div className="text-xs text-muted-foreground">
                      CEO Excerpt
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span className="w-6 h-6 rounded-full border grid place-content-center text-[11px]">
                    i
                  </span>
                  <span className="w-6 h-6 rounded-full border grid place-content-center text-[11px]">
                    @
                  </span>
                  <span className="w-6 h-6 rounded-full border grid place-content-center text-[11px]">
                    ☎
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
