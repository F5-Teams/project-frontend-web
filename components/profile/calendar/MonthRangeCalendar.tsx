"use client";

import { CalendarBooking } from "@/types/calendarType";
import { addDays, formatDMY, startOfDay, toDate } from "@/utils/dateRange";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";

function daysInMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
}

type Props = {
  month?: Date;
  booking?: CalendarBooking | null;
  className?: string;
  onMonthChange?: (d: Date) => void;
};

export function MonthRangeCalendar({
  month = new Date(),
  booking,
  className,
  onMonthChange,
}: Props) {
  const base = new Date(month.getFullYear(), month.getMonth(), 1);
  const total = daysInMonth(base);

  const s = booking
    ? toDate(booking.meta?.startDate) ?? toDate(booking.meta?.bookingDate)!
    : null;
  const e = booking
    ? toDate(booking.meta?.endDate) ?? toDate(booking.meta?.bookingDate)!
    : null;

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-2">
        <div className="font-semibold">{formatDMY(base).slice(3)}</div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onMonthChange?.(addDays(base, -1))}
            className="w-9 h-9 rounded-[9999px] flex items-center justify-center text-gray-600 bg-white border border-gray-100 transition-all duration-200 ease-in-out transform hover:bg-primary-card/10 hover:-translate-y-1 hover:shadow-sm"
            aria-label="Tháng trước"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => onMonthChange?.(addDays(base, 32))}
            className="w-9 h-9 rounded-[9999px] flex items-center justify-center text-gray-600 bg-white border border-gray-100 transition-all duration-200 ease-in-out transform hover:bg-primary-card/10 hover:-translate-y-1 hover:shadow-sm"
            aria-label="Tháng sau"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-500 mb-1">
        {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((x) => (
          <div key={x}>{x}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {Array.from({
          length:
            new Date(base.getFullYear(), base.getMonth(), 1).getDay() || 7 - 1,
        }).map((_, i) => (
          <div key={"e" + i} />
        ))}
        {Array.from({ length: total }).map((_, i) => {
          const d = new Date(base.getFullYear(), base.getMonth(), i + 1);
          const inRange =
            s &&
            e &&
            startOfDay(d) >= startOfDay(s) &&
            startOfDay(d) <= startOfDay(e);
          return (
            <div
              key={i}
              className="relative h-8 rounded-lg flex items-center justify-center text-sm"
            >
              <span
                className={
                  inRange ? "absolute inset-0 rounded-full bg-pink-300/20" : ""
                }
              />
              <span
                className={
                  inRange ? "relative font-semibold text-primary" : "relative"
                }
              >
                {i + 1}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
