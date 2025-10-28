"use client";

import React, { PropsWithChildren, useMemo } from "react";
import { cn } from "@/lib/utils";

export type BookingBlockProps = {
  /** Thời điểm bắt đầu (Date hoặc ISO string) */
  start: Date | string;
  /** Số phút diễn ra */
  durationMinutes: number;
  /** Giờ bắt đầu của lưới trong ngày (vd 8 nghĩa là 08:00) */
  dayStartHour: number;
  /** Chiều cao theo 1 giờ (px), bạn truyền từ WeeklySchedule (rowHeight) */
  rowHeight: number;
  /** Lề trái/phải tuỳ chọn (dùng khi xử lý overlap, nếu cần) */
  insetX?: number; // px
  /** Màu (bg + border) của block */
  colorClass?: string; // vd "bg-teal-50 border-teal-400"
  /** className bổ sung */
  className?: string;
  /** Click handler tuỳ chọn */
  onClick?: () => void;
};

function toDateLocal(x: Date | string) {
  return x instanceof Date ? x : new Date(x);
}

function addMinutes(d: Date, n: number) {
  const c = new Date(d);
  c.setMinutes(c.getMinutes() + n);
  return c;
}

function fmtHM(d: Date) {
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

export const BookingBlock: React.FC<PropsWithChildren<BookingBlockProps>> = ({
  start,
  durationMinutes,
  dayStartHour,
  rowHeight,
  insetX = 4,
  colorClass = "bg-teal-50 border-teal-400",
  className,
  onClick,
  children,
}) => {
  const s = useMemo(() => toDateLocal(start), [start]);
  const e = useMemo(() => addMinutes(s, durationMinutes), [s, durationMinutes]);

  // ví trí top = (giờ float - dayStartHour) * rowHeight
  const top = useMemo(() => {
    const startFloat = s.getHours() + s.getMinutes() / 60;
    return (startFloat - dayStartHour) * rowHeight;
  }, [s, dayStartHour, rowHeight]);

  const height = useMemo(
    () => (durationMinutes / 60) * rowHeight,
    [durationMinutes, rowHeight]
  );

  return (
    <div
      onClick={onClick}
      className={cn(
        "absolute border-l-4 rounded-lg p-2",
        "shadow-[0_1px_2px_rgba(16,24,40,0.06)]",
        "hover:shadow-[0_2px_6px_rgba(16,24,40,0.12)] transition-shadow",
        colorClass,
        className
      )}
      style={{
        top,
        height,
        left: insetX,
        right: insetX,
        overflow: "hidden",
      }}
      aria-label={`Booking from ${fmtHM(s)} to ${fmtHM(e)}`}
    >
      {/* Nếu không truyền children, render mặc định */}
      {children ? (
        children
      ) : (
        <>
          <div className="text-xs font-semibold text-gray-900 leading-tight truncate">
            {/* để bạn truyền title ở ngoài nếu muốn custom */}
          </div>
          <div className="text-[11px] text-gray-600">
            {fmtHM(s)} – {fmtHM(e)}
          </div>
        </>
      )}
    </div>
  );
};
