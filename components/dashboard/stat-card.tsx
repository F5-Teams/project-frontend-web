import { ReactNode } from "react";

export function StatCard({
  value,
  label,
  icon,
  highlight,
}: {
  value: string | number;
  label: string;
  icon?: ReactNode;
  highlight?: boolean;
}) {
  return (
    <div
      className={
        highlight
          ? "bg-pink-600 text-white rounded-xl p-6 shadow"
          : "bg-white rounded-xl p-6 border shadow-sm"
      }
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="text-2xl font-semibold">{value}</div>
          <div className="text-sm opacity-70">{label}</div>
        </div>
        {icon}
      </div>
    </div>
  );
}
