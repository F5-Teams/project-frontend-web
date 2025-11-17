// components/profile/calendar/StatusBadge.tsx
"use client";
import React from "react";
import { cn } from "@/lib/utils";

// Trạng thái chuẩn (dùng UPPERCASE để map với API)
export type StatusCanonical =
  | "PENDING"
  | "CONFIRMED"
  | "ON_SERVICE"
  | "COMPLETED"
  | "CANCELLED";

function normalizeStatus(s?: string | null): StatusCanonical | undefined {
  const key = (s ?? "").toUpperCase();
  if (["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"].includes(key)) {
    return key as StatusCanonical;
  }
  if (key === "ONSERVICE" || key === "ON_SERVICE") return "ON_SERVICE";
  return undefined;
}

const MAP: Record<StatusCanonical, { label: string; cls: string }> = {
  PENDING: {
    label: "Đang chờ",
    cls: "bg-amber-100 text-amber-700 ring-amber-200",
  },
  CONFIRMED: {
    label: "Đã xác nhận",
    cls: "bg-teal-100 text-teal-700 ring-teal-200",
  },
  ON_SERVICE: {
    label: "Đang phục vụ",
    cls: "bg-blue-100 text-blue-700 ring-blue-200",
  },
  COMPLETED: {
    label: "Đã hoàn thành",
    cls: "bg-emerald-100 text-emerald-700 ring-emerald-200",
  },
  CANCELLED: {
    label: "Đã hủy",
    cls: "bg-rose-100 text-rose-700 ring-rose-200",
  },
};

const DOT_COLORS: Record<StatusCanonical, string> = {
  PENDING: "bg-amber-400",
  CONFIRMED: "bg-green-400",
  ON_SERVICE: "bg-blue-500",
  COMPLETED: "bg-emerald-600",
  CANCELLED: "bg-rose-500",
};

export const STATUS_ORDER: StatusCanonical[] = [
  "PENDING",
  "CONFIRMED",
  "ON_SERVICE",
  "COMPLETED",
  "CANCELLED",
];

export function getStatusLabel(s?: string | null) {
  const key = normalizeStatus(s) ?? "PENDING";
  return MAP[key].label;
}

export function getStatusDotClass(s?: string | null) {
  const key = normalizeStatus(s) ?? "PENDING";
  return DOT_COLORS[key];
}

export function StatusBadge({ status }: { status?: string | null }) {
  const key = normalizeStatus(status) ?? "PENDING";
  const m = MAP[key];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1",
        m.cls
      )}
    >
      {m.label}
    </span>
  );
}
