"use client";

import { ICONS } from "@/components/dashboard/Icons";
import { StatCard } from "@/components/dashboard/stat-card";

export default function Page() {
  const Bag = ICONS.orders;
  const Clipboard = ICONS.tasks;
  const Users = ICONS.customers;
  return (
    <div className="space-y-6">
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          value={32}
          label="Open Orders"
          icon={<Bag className="size-6" />}
        />
        <StatCard
          value={12}
          label="My Tasks"
          icon={<Clipboard className="size-6" />}
        />
        <StatCard
          value={8}
          label="New Customers"
          icon={<Users className="size-6" />}
        />
      </section>

      <div className="bg-white rounded-xl border shadow-sm">
        <div className="px-6 py-4 border-b font-semibold">Today</div>
        <ul className="divide-y">
          {[
            { t: "Confirm order #A123", time: "09:00" },
            { t: "Pack shipment #B455", time: "10:30" },
            { t: "Call customer (refund)", time: "15:00" },
          ].map((x, i) => (
            <li key={i} className="px-6 py-3 flex items-center justify-between">
              <span className="text-sm">{x.t}</span>
              <span className="text-xs text-muted-foreground">{x.time}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
