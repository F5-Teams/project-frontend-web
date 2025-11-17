"use client";

import React, { PropsWithChildren, useMemo } from "react";
import { cn } from "@/lib/utils";

export type BookingBlockProps = {
  start: Date | string;
  durationMinutes: number;
  dayStartHour: number;
  rowHeight: number;
  insetX?: number;
  colorClass?: string;
  className?: string;
  onClick?: () => void;
  allowOverflow?: boolean;
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
  allowOverflow,
  children,
}) => {
  const s = useMemo(() => toDateLocal(start), [start]);
  const e = useMemo(() => addMinutes(s, durationMinutes), [s, durationMinutes]);

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
        overflow: allowOverflow ? "visible" : "hidden",
      }}
      aria-label={`Booking from ${fmtHM(s)} to ${fmtHM(e)}`}
    >
      {children ? (
        children
      ) : (
        <>
          <div className="text-xs font-semibold text-gray-900 leading-tight"></div>
          <div className="text-xs text-gray-600">
            {fmtHM(s)} – {fmtHM(e)}
          </div>
        </>
      )}
    </div>
  );
};
