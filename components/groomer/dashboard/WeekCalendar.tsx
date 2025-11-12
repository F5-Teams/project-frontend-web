"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";
import { motion } from "framer-motion";

type BookingLike = { bookingDate?: string | Date | null };

function startOfWeek(d: Date) {
  const s = new Date(d);
  s.setHours(0, 0, 0, 0);
  const day = s.getDay();
  const offset = (day + 6) % 7;
  s.setDate(s.getDate() - offset);
  return s;
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export default function WeekCalendar({
  bookings,
  selected,
  onSelect,
  onClear,
}: {
  bookings: BookingLike[];
  selected: Date | null;
  onSelect: (d: Date) => void;
  onClear: () => void;
}) {
  const [anchor, setAnchor] = React.useState<Date>(startOfWeek(new Date()));
  const weekDays = React.useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(anchor);
      d.setDate(anchor.getDate() + i);
      return d;
    });
  }, [anchor]);

  const countFor = (d: Date) =>
    bookings.reduce((acc, b) => {
      if (!b.bookingDate) return acc;
      const bd = new Date(b.bookingDate);
      return acc + (isSameDay(bd, d) ? 1 : 0);
    }, 0);

  // Count bookings within a given week range starting from a Monday
  const countWeekStarting = React.useCallback(
    (start: Date) => {
      const startDay = new Date(start);
      startDay.setHours(0, 0, 0, 0);
      const endDay = new Date(startDay);
      endDay.setDate(endDay.getDate() + 6);
      endDay.setHours(23, 59, 59, 999);

      return bookings.reduce((acc, b) => {
        if (!b.bookingDate) return acc;
        const bd = new Date(b.bookingDate);
        return bd >= startDay && bd <= endDay ? acc + 1 : acc;
      }, 0);
    },
    [bookings]
  );

  const prevWeekCount = React.useMemo(() => {
    const prevStart = new Date(anchor);
    prevStart.setDate(prevStart.getDate() - 7);
    return countWeekStarting(prevStart);
  }, [anchor, countWeekStarting]);

  const nextWeekCount = React.useMemo(() => {
    const nextStart = new Date(anchor);
    nextStart.setDate(nextStart.getDate() + 7);
    return countWeekStarting(nextStart);
  }, [anchor, countWeekStarting]);

  const monthLabel = React.useMemo(() => {
    const s = anchor.toLocaleDateString("vi-VN", {
      month: "long",
      year: "numeric",
    });
    return s.charAt(0).toUpperCase() + s.slice(1);
  }, [anchor]);

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
      <div className="flex items-center justify-between mb-4">
        <div className="font-poppins-regular">Lịch tuần</div>
        <div className="font-poppins-light text-sm text-black min-w-[90px] text-center">
          {monthLabel}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            className="relative text-xs px-1 py-1 rounded-2xl border hover:bg-slate-50"
            onClick={() =>
              setAnchor(
                (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate() - 7)
              )
            }
          >
            <div className="text-muted-foreground">
              <ChevronLeft />
            </div>
            {prevWeekCount > 0 && (
              <span
                className="absolute -top-1 -right-1 min-w-4 h-4 px-[3px] text-[10px] leading-4 bg-rose-500 text-white rounded-full flex items-center justify-center z-20"
                aria-label={`Tuần trước có ${prevWeekCount} lịch`}
              >
                {prevWeekCount > 99 ? "99+" : prevWeekCount}
              </span>
            )}
          </button>
          <button
            type="button"
            className="text-xs px-2 py-1 rounded-2xl border transition-all duration-200 ease-in-out transform hover:bg-primary-card/10 hover:-translate-y-1 hover:shadow-sm"
            onClick={() => {
              const today = new Date();
              setAnchor(startOfWeek(today));
              onSelect(today);
            }}
          >
            Hôm nay
          </button>

          <button
            type="button"
            className="relative text-xs px-1 py-1 rounded-2xl border hover:bg-slate-50"
            onClick={() =>
              setAnchor(
                (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + 7)
              )
            }
          >
            <div className="text-muted-foreground">
              <ChevronRight />
            </div>
            {nextWeekCount > 0 && (
              <span
                className="absolute -top-1 -right-1 min-w-4 h-4 px-[3px] text-[10px] leading-4 bg-rose-500 text-white rounded-full flex items-center justify-center z-20"
                aria-label={`Tuần sau có ${nextWeekCount} lịch`}
              >
                {nextWeekCount > 99 ? "99+" : nextWeekCount}
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 text-center text-sm">
        {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((label, i) => {
          const dayDate = weekDays[i];
          const isSelected = selected && isSameDay(selected, dayDate);
          const count = countFor(dayDate);
          return (
            <div key={label + i} className="py-1 rounded-lg">
              <div className="text-xs text-muted-foreground">{label}</div>
              <button
                type="button"
                onClick={() => onSelect(dayDate)}
                className={`relative mt-2 inline-flex items-center justify-center w-9 h-9 rounded-full border transition-colors duration-200 font-poppins-medium ${
                  isSelected ? "text-white" : "text-black hover:bg-slate-50"
                } ${isSelected ? "" : "hover:scale-105 transition-transform"}`}
                aria-pressed={isSelected ? true : undefined}
              >
                {isSelected && (
                  <motion.span
                    layoutId="dayHighlight"
                    className="absolute inset-0 rounded-full bg-primary/40"
                    transition={{ type: "spring", stiffness: 400, damping: 28 }}
                    style={{ zIndex: 1 }}
                  />
                )}
                <span className="relative z-10">{dayDate.getDate()}</span>
                {count > 0 && (
                  <motion.span
                    initial={{ scale: 0.9, opacity: 0.85 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="absolute -right-1 -top-1 min-w-[18px] h-[18px] px-1 text-[10px] leading-[18px] bg-rose-500 text-white rounded-full flex items-center justify-center z-20"
                  >
                    {count}
                  </motion.span>
                )}
              </button>
            </div>
          );
        })}
      </div>

      <div className="mt-3 flex justify-end">
        <button
          type="button"
          onClick={onClear}
          className="text-xs px-2 py-1 rounded-md border hover:bg-slate-50"
        >
          Xem tất cả
        </button>
      </div>
    </div>
  );
}
