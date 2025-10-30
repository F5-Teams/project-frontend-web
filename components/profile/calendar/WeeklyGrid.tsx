"use client";
import React from "react";
import { cn } from "@/lib/utils";

import { BookingBox } from "./BookingBox";
import { formatDMY, startOfWeek, addDays, toDate } from "@/utils/dateRange";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { STATUS_ORDER, getStatusDotClass, getStatusLabel } from "./StatusBadge";
import { CalendarBooking } from "@/types/calendarType";

type Props = {
  data: CalendarBooking[];
  weekAnchor?: Date;
  selectedId?: string | number;
  onSelect?: (b: CalendarBooking) => void;
  tzLabel?: string;
  onWeekChange?: (anchor: Date) => void;
};

type Span = { b: CalendarBooking; startIdx: number; endIdx: number };

export function WeeklyGrid({
  data,
  weekAnchor,
  selectedId,
  onSelect,
  onWeekChange,
}: Props) {
  const [anchor, setAnchor] = React.useState<Date>(() =>
    startOfWeek(weekAnchor ?? new Date())
  );
  const lastSyncedWeekStart = React.useRef<number>(
    startOfWeek(weekAnchor ?? new Date()).getTime()
  );

  React.useEffect(() => {
    if (!weekAnchor) return;
    const ws = startOfWeek(weekAnchor).getTime();
    if (ws !== lastSyncedWeekStart.current) {
      lastSyncedWeekStart.current = ws;
      setAnchor(startOfWeek(weekAnchor));
    }
  }, [weekAnchor]);

  const changeWeek = (deltaDays: number) => {
    setAnchor((prev) => {
      const next = addDays(prev, deltaDays);
      lastSyncedWeekStart.current = startOfWeek(next).getTime();
      onWeekChange?.(next);
      return next;
    });
  };

  const weekStart = React.useMemo(() => startOfWeek(anchor), [anchor]);
  const weekEnd = React.useMemo(() => addDays(weekStart, 6), [weekStart]);

  const spans = React.useMemo<Span[]>(() => {
    const out: Span[] = [];
    data.forEach((b) => {
      const rawS = toDate(
        b.meta?.startDate ?? b.meta?.bookingDate ?? b.startDate
      );
      const rawE = toDate(
        b.meta?.endDate ?? b.meta?.bookingDate ?? b.endDate ?? b.startDate
      );
      if (!rawS || !rawE) return;

      const s = new Date(
        Math.max(weekStart.getTime(), new Date(rawS).setHours(0, 0, 0, 0))
      );
      const e = new Date(
        Math.min(weekEnd.getTime(), new Date(rawE).setHours(0, 0, 0, 0))
      );
      if (e < s) return;

      const startIdx = Math.max(
        0,
        Math.floor((s.getTime() - weekStart.getTime()) / 86400000)
      );
      const endIdx = Math.min(
        6,
        Math.floor((e.getTime() - weekStart.getTime()) / 86400000)
      );
      out.push({ b, startIdx, endIdx });
    });
    out.sort((a, b) => a.startIdx - b.startIdx || a.endIdx - b.endIdx);
    return out;
  }, [data, weekStart, weekEnd]);

  const [openId, setOpenId] = React.useState<string | number | null>(null);

  const weekLabel = React.useMemo(
    () => `${formatDMY(weekStart)} – ${formatDMY(weekEnd)}`,
    [weekStart, weekEnd]
  );

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between gap-6 mb-5">
        <div>
          <div className="text-2xl font-poppins-regular text-gray-900">
            Lịch tuần
          </div>
          <div className="text-sm text-gray-500 mt-1">
            <span className="font-poppins-light text-gray-600">
              {weekLabel}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => changeWeek(-7)}
              className="w-9 h-9 rounded-[9999px] flex items-center justify-center text-gray-600 bg-white border border-gray-100 transition-all duration-200 ease-in-out transform hover:bg-primary-card/10 hover:-translate-y-1 hover:shadow-sm"
              aria-label="Tuần trước"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                const todayStart = startOfWeek(new Date());
                setAnchor(todayStart);
                lastSyncedWeekStart.current = todayStart.getTime();
              }}
              className="px-3 h-9 rounded-2xl text-xs bg-pink-50 text-gray-700 border transition-all duration-200 ease-in-out transform hover:bg-primary-card/10 hover:-translate-y-1 hover:shadow-sm hover:font-poppins-medium"
              aria-label="Hôm nay"
            >
              Hôm nay
            </button>
            <button
              onClick={() => changeWeek(7)}
              className="w-9 h-9 rounded-[9999px] flex items-center justify-center text-gray-600 bg-white transition-all duration-200 ease-in-out transform hover:bg-primary-card/10 hover:-translate-y-1 hover:shadow-sm"
              aria-label="Tuần sau"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="hidden sm:flex items-center gap-4">
            {STATUS_ORDER.map((st) => (
              <div
                key={st}
                className="flex items-center gap-2 text-sm text-gray-600"
              >
                <span
                  className={cn(
                    "inline-block w-3 h-3 rounded-full",
                    getStatusDotClass(st)
                  )}
                />
                <span className="text-xs text-gray-500">
                  {getStatusLabel(st)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-x-4 mb-4 text-center">
        {Array.from({ length: 7 }).map((_, i) => {
          const d = addDays(weekStart, i);
          const isToday = new Date().toDateString() === d.toDateString();
          return (
            <div key={i} className="text-center">
              <div
                className={cn(
                  "text-lg font-medium",
                  isToday ? "text-primary" : "text-gray-800"
                )}
              >
                {d.getDate()}
              </div>
              <div className="text-xs text-gray-400 mt-1">
                {
                  ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "CN"][
                    i
                  ]
                }
              </div>
            </div>
          );
        })}
      </div>

      <div
        className="relative"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to right, transparent 0, transparent calc(100%/7 - 1px), rgba(0,0,0,0.06) calc(100%/7 - 1px), rgba(0,0,0,0.06) calc(100%/7))",
          backgroundSize: "100% 100%",
        }}
      >
        <div
          className="grid gap-y-4 gap-x-4 px-2"
          style={{ gridTemplateColumns: "repeat(7, minmax(0, 1fr))" }}
        >
          {spans.length === 0 ? (
            <div
              key="empty"
              style={{ gridColumn: "1 / 8", gridRow: 1 }}
              className="mx-0.5"
            >
              <div className="min-h-[72px] flex items-center justify-center rounded-lg border border-dashed border-gray-100 bg-white">
                <span className="text-sm text-gray-500">
                  Tuần này không có lịch nào
                </span>
              </div>
            </div>
          ) : (
            spans.map(({ b, startIdx, endIdx }, idx) => (
              <div
                key={`${b.id}-${startIdx}-${endIdx}-${idx}`}
                style={{
                  gridColumn: `${startIdx + 1} / ${endIdx + 2}`,
                  gridRow: idx + 1,
                }}
                className="mx-0.5"
              >
                <BookingBox
                  data={b}
                  active={String(selectedId ?? "") === String(b.id ?? "")}
                  open={openId === b.id}
                  onToggle={(bk) =>
                    setOpenId((cur) => (cur === bk.id ? null : bk.id))
                  }
                  onSelect={onSelect}
                />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
