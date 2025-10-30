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

  const firstWeekday =
    (new Date(base.getFullYear(), base.getMonth(), 1).getDay() + 6) % 7;
  const today = startOfDay(new Date());

  return (
    <div className={className}>
      <div className="bg-[#1849A9] text-white rounded-2xl p-4 shadow-lg overflow-hidden">
        {/* inner dashed border */}
        <div className="rounded-xl border-2 border-dashed border-white/25 p-3">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-xs text-white/70 uppercase tracking-wider">
                Tháng
              </div>
              <div className="text-sm font-poppins-medium">
                {formatDMY(base).slice(3)}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onMonthChange?.(addDays(base, -1))}
                className="w-9 h-9 rounded-full flex items-center justify-center text-[#1849A9] bg-white/90 shadow-sm border border-white/30 hover:opacity-95 transition"
                aria-label="Tháng trước"
                title="Tháng trước"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => onMonthChange?.(addDays(base, 32))}
                className="w-9 h-9 rounded-full flex items-center justify-center text-[#1849A9] bg-white/90 shadow-sm border border-white/30 hover:opacity-95 transition"
                aria-label="Tháng sau"
                title="Tháng sau"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-xs text-white/70 mb-2">
            {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((x) => (
              <div key={x} className="py-1">
                {x}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: firstWeekday }).map((_, i) => (
              <div key={"pad-" + i} />
            ))}

            {Array.from({ length: total }).map((_, i) => {
              const d = new Date(base.getFullYear(), base.getMonth(), i + 1);
              const dayStart = startOfDay(d);

              const inRange =
                s &&
                e &&
                dayStart >= startOfDay(s) &&
                dayStart <= startOfDay(e);

              const isToday = dayStart.getTime() === today.getTime();

              return (
                <div
                  key={i}
                  className="relative h-10 rounded-lg flex items-center justify-center text-sm"
                >
                  {inRange && (
                    <span className="absolute inset-0 rounded-lg bg-white/20" />
                  )}
                  <button
                    className={`relative z-10 w-8 h-8 flex items-center justify-center rounded-full transition ${
                      isToday
                        ? "bg-white text-[#1849A9] font-semibold"
                        : "text-white/90 hover:bg-white/10"
                    }`}
                    aria-label={`Ngày ${i + 1}`}
                    title={formatDMY(d)}
                  >
                    {i + 1}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
