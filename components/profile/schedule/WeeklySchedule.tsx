"use client";

import React, { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils"; // nếu bạn chưa có, thay bằng className join thủ công
import { Button } from "@/components/ui/button";
import { BookingBlock } from "./BookingBlock";
import { CustomeScrolling } from "@/components/shared/CustomeScrolling";

export type BookingType =
  | "Consultation"
  | "Analysis"
  | "Operation"
  | "Rehabilitation"
  | string;

export interface Booking {
  id: string | number;
  type: BookingType;
  start: string | Date;
  durationMinutes: number;
  colorClass?: string;
  meta?: Record<string, null | string | number>;
}

export interface WeeklyScheduleProps {
  timeZone?: string;
  anchorDate?: Date | string;
  dayStartHour?: number;
  dayEndHour?: number;
  slotMinutes?: number;
  enableWeekNav?: boolean;
  onWeekChange?: (viewStart: Date, viewEnd: Date, offsetWeeks: number) => void;
  bookings?: Booking[];
  showTimeColumn?: boolean;
  className?: string;
}

function getBrowserTZ() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return "UTC";
  }
}

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
}

function addDays(d: Date, n: number) {
  const c = new Date(d);
  c.setDate(c.getDate() + n);
  return c;
}

function addMinutes(d: Date, n: number) {
  const c = new Date(d);
  c.setMinutes(c.getMinutes() + n);
  return c;
}

function startOfWeek(date: Date) {
  const day = (date.getDay() + 6) % 7;
  return startOfDay(addDays(date, -day));
}

function fmtHM(d: Date) {
  const hh = d.getHours().toString().padStart(2, "0");
  const mm = d.getMinutes().toString().padStart(2, "0");
  return `${hh}:${mm}`;
}

function toDateLocal(x: Date | string | undefined | null): Date | null {
  if (!x) return null;
  if (x instanceof Date) return x;
  const d = new Date(x);
  return isNaN(d.getTime()) ? null : d;
}

function buildTimeSlots(
  dayStartHour: number,
  dayEndHour: number,
  slotMinutes: number
) {
  const slots: string[] = [];
  let cur = new Date(2000, 0, 1, dayStartHour, 0, 0, 0);
  const end = new Date(2000, 0, 1, dayEndHour, 0, 0, 0);
  while (cur <= end) {
    slots.push(fmtHM(cur));
    cur = addMinutes(cur, slotMinutes);
  }
  return slots;
}
const WeekHeader: React.FC<{
  weekStart: Date;
  highlightDate?: Date | null;
}> = ({ weekStart, highlightDate }) => {
  const weekdayLabels = [
    "Thứ 2",
    "Thứ 3",
    "Thứ 4",
    "Thứ 5",
    "Thứ 6",
    "Thứ 7",
    "Chủ Nhật",
  ];
  return (
    <div className="grid grid-cols-[60px_repeat(7,1fr)] gap-0 mb-2">
      <div />
      {Array.from({ length: 7 }).map((_, i) => {
        const d = addDays(weekStart, i);
        const isToday = highlightDate
          ? startOfDay(d).getTime() === startOfDay(highlightDate).getTime()
          : false;
        return (
          <div key={i} className="text-center">
            <div
              className={cn(
                "text-xl font-poppins-regular mb-1",
                isToday ? "text-primary" : "text-gray-900"
              )}
            >
              {d.getDate()}
            </div>
            <div className="text-xs font-poppins-light text-gray-500">
              {weekdayLabels[i]}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const TimeColumn: React.FC<{ slots: string[]; rowHeight: number }> = ({
  slots,
  rowHeight,
}) => {
  return (
    <div
      className="relative"
      style={{ height: (slots.length - 1) * rowHeight }}
    >
      {slots.slice(0, -1).map((time, i) => (
        <div
          key={time}
          className="absolute text-sm font-poppins-light text-gray-500"
          style={{ top: `${i * rowHeight - 6}px` }}
        >
          {time}
        </div>
      ))}
    </div>
  );
};

const DayGrid: React.FC<{
  dayStartHour: number;
  slots: string[];
  rowHeight: number;
  bookings: Booking[];
  dayDate: Date;
}> = ({ slots, rowHeight, bookings, dayDate, dayStartHour }) => {
  return (
    <div
      className="relative border-l border-gray-200"
      style={{ height: (slots.length - 1) * rowHeight }}
    >
      {slots.map((_, i) => (
        <div
          key={i}
          className="absolute w-full border-t border-gray-100"
          style={{ top: `${i * rowHeight}px` }}
        />
      ))}

      {bookings.map((bk) => {
        const start = new Date(bk.start);

        const sameDay =
          start.getFullYear() === dayDate.getFullYear() &&
          start.getMonth() === dayDate.getMonth() &&
          start.getDate() === dayDate.getDate();

        if (!sameDay) return null;

        return (
          <BookingBlock
            key={bk.id}
            start={bk.start}
            durationMinutes={bk.durationMinutes}
            dayStartHour={dayStartHour}
            rowHeight={rowHeight}
            colorClass={bk.colorClass ?? "bg-teal-50 border-teal-400"}
          >
            <div className="text-xs font-semibold text-gray-900 leading-tight truncate">
              {bk.type}
            </div>
            <div className="text-[11px] text-gray-600">
              {start.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
              {" – "}
              {new Date(
                start.getTime() + bk.durationMinutes * 60000
              ).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </div>
            {/* Ví dụ hiển thị meta như (6 items) hay +3 nurses nếu có */}
            {bk.meta?.items && (
              <div className="text-[11px] text-gray-600">
                ({bk.meta.items} items)
              </div>
            )}
            {!!bk.meta?.nurses && (
              <div className="text-[11px] text-yellow-600 mt-0.5">
                +{bk.meta.nurses} nurses
              </div>
            )}
          </BookingBlock>
        );
      })}
    </div>
  );
};

const BookingList: React.FC<{
  bookings: Booking[];
  title?: string;
}> = ({ bookings, title = "Bookings" }) => {
  const sorted = useMemo(
    () =>
      [...bookings].sort((a, b) => {
        const ta = toDateLocal(a.start)!.getTime();
        const tb = toDateLocal(b.start)!.getTime();
        return ta - tb;
      }),
    [bookings]
  );

  return (
    <div className="bg-white rounded-2xl p-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
        <span className="text-xs text-gray-500">{sorted.length}</span>
      </div>

      <CustomeScrolling axis="y" className="max-h-[360px]">
        <div className="space-y-2">
          {sorted.map((b) => {
            const s = toDateLocal(b.start)!;
            const e = addMinutes(s, b.durationMinutes);
            return (
              <div key={b.id} className="flex items-start gap-2">
                <div
                  className={cn(
                    "w-2 h-2 mt-2 rounded-full",
                    b.colorClass?.includes("teal")
                      ? "bg-teal-400"
                      : b.colorClass?.includes("yellow")
                      ? "bg-yellow-400"
                      : b.colorClass?.includes("blue")
                      ? "bg-blue-400"
                      : "bg-gray-400"
                  )}
                />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-gray-900 truncate">
                    {b.type}
                  </div>
                  <div className="text-[11px] text-gray-600">
                    {s.toLocaleDateString()} • {fmtHM(s)}–{fmtHM(e)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CustomeScrolling>
    </div>
  );
};

/* =======================
 * Main WeeklySchedule
 * ======================= */

export const WeeklySchedule: React.FC<WeeklyScheduleProps> = ({
  timeZone,
  anchorDate,
  dayStartHour = 8,
  dayEndHour = 16,
  slotMinutes = 60,
  enableWeekNav = false,
  onWeekChange,
  bookings = [],
  showTimeColumn = true,
  className,
}) => {
  const tz = timeZone || getBrowserTZ();

  // Lấy today & anchor theo TZ (đơn giản hoá: dùng local JS)
  const initialAnchor = useMemo(
    () => toDateLocal(anchorDate) ?? new Date(),
    [anchorDate]
  );

  const [offsetWeeks, setOffsetWeeks] = useState(0);
  const effectiveAnchor = useMemo(
    () => addDays(initialAnchor, offsetWeeks * 7),
    [initialAnchor, offsetWeeks]
  );

  const weekStart = useMemo(
    () => startOfWeek(effectiveAnchor),
    [effectiveAnchor]
  );
  const weekEnd = useMemo(() => addDays(weekStart, 7), [weekStart]);

  // Highlight "today" nếu nó nằm trong tuần
  const today = useMemo(() => startOfDay(new Date()), []);
  const inRangeToday =
    startOfDay(today).getTime() >= startOfDay(weekStart).getTime() &&
    startOfDay(today).getTime() < startOfDay(weekEnd).getTime()
      ? today
      : null;

  const slots = useMemo(
    () => buildTimeSlots(dayStartHour, dayEndHour, slotMinutes),
    [dayStartHour, dayEndHour, slotMinutes]
  );
  const rowHeight = 56 * (slotMinutes / 60); // scale chiều cao theo slot

  // Lọc booking theo tuần đang xem
  const weekBookings = useMemo(() => {
    return bookings.filter((b) => {
      const s = toDateLocal(b.start);
      if (!s) return false;
      return s >= weekStart && s < weekEnd;
    });
  }, [bookings, weekStart, weekEnd]);

  useEffect(() => {
    onWeekChange?.(weekStart, weekEnd, offsetWeeks);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offsetWeeks, weekStart.getTime(), weekEnd.getTime()]);

  // Gom booking theo từng ngày (Mon..Sun)
  const bookingsByDay = useMemo(() => {
    const map: Record<number, Booking[]> = {};
    for (let i = 0; i < 7; i++) map[i] = [];
    weekBookings.forEach((bk) => {
      const d = toDateLocal(bk.start)!;
      // index 0..6 ứng với Mon..Sun
      const idx = (d.getDay() + 6) % 7;
      map[idx].push(bk);
    });
    return map;
  }, [weekBookings]);

  return (
    <div className={cn("bg-white rounded-2xl p-4 md:p-6", className)}>
      {/* Header + Nav */}
      <div className="flex items-center justify-between mb-4">
        <div className="text-base font-semibold text-gray-900">
          {weekStart.toLocaleDateString()} –{" "}
          {addDays(weekEnd, -1).toLocaleDateString()} ({tz})
        </div>
        {enableWeekNav && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setOffsetWeeks((x) => x - 1)}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setOffsetWeeks(0)}
            >
              This week
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setOffsetWeeks((x) => x + 1)}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Day Headers */}
      <CustomeScrolling axis="x" className="-mx-4 md:mx-0">
        <div className="min-w-[900px] px-4 md:px-0">
          <WeekHeader weekStart={weekStart} highlightDate={inRangeToday} />

          {/* Grid */}
          <div className="grid grid-cols-[60px_repeat(7,1fr)] gap-0">
            {/* Time Column */}
            {showTimeColumn ? (
              <TimeColumn slots={slots} rowHeight={rowHeight} />
            ) : (
              <div />
            )}

            {/* Day Columns */}
            {Array.from({ length: 7 }).map((_, i) => {
              const d = addDays(weekStart, i);
              return (
                <DayGrid
                  key={i}
                  slots={slots}
                  rowHeight={rowHeight}
                  dayDate={d}
                  dayStartHour={dayStartHour}
                  bookings={bookingsByDay[i] ?? []}
                />
              );
            })}
          </div>
        </div>
      </CustomeScrolling>
    </div>
  );
};

export { BookingList };
