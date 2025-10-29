"use client";

import * as React from "react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { vi } from "date-fns/locale";

type MiniCalendarProps = {
  month?: Date;
  onMonthChange: (d: Date) => void;
  selected?: Date;
  onSelect?: (d?: Date) => void;
  timeZone?: string;
  today?: Date;
  className?: string;
  minDate?: Date;
  maxDate?: Date;
};

export function MiniCalendar({
  month,
  onMonthChange,
  selected,
  onSelect,
  timeZone,
  today,
  className,
  minDate,
  maxDate,
}: MiniCalendarProps) {
  const displayMonth = month ?? today ?? new Date();

  const startOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1);
  const clampToBounds = (candidate: Date) => {
    let c = startOfMonth(candidate);
    if (minDate) {
      const m = startOfMonth(minDate);
      if (c < m) c = m;
    }
    if (maxDate) {
      const M = startOfMonth(maxDate);
      if (c > M) c = M;
    }
    return c;
  };

  const goToday = () => {
    const d = today ?? new Date();
    const t0 = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    onMonthChange(new Date(t0.getFullYear(), t0.getMonth(), 1));
    onSelect?.(t0);
  };

  return (
    <div
      className={cn(
        "bg-white rounded-2xl lg:rounded-3xl p-2 lg:p-4 shadow-sm",
        className
      )}
    >
      <div className="flex items-center justify-between mb-2 lg:mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs lg:text-sm font-light text-gray-900 capitalize">
            {displayMonth.toLocaleDateString("vi-VN", {
              month: "long",
              year: "numeric",
            })}
          </span>
        </div>
        <button
          onClick={goToday}
          className="px-3 h-8 text-sm rounded-2xl border whitespace-nowrap inline-flex items-center justify-center transition-all duration-200 ease-in-out transform hover:bg-primary-card/10 hover:-translate-y-1 hover:shadow-sm"
          aria-label="Về hôm nay"
        >
          Hôm nay
        </button>
      </div>

      <div className="w-full grid place-items-center">
        <Calendar
          mode="single"
          captionLayout="dropdown"
          month={month}
          defaultMonth={today}
          onMonthChange={(d) => onMonthChange(clampToBounds(d))}
          selected={selected}
          onSelect={onSelect}
          timeZone={timeZone}
          locale={vi}
          weekStartsOn={1}
          showOutsideDays
          classNames={{
            root: "w-fit mx-auto",
            months: "flex flex-col gap-4 font-light",
            month: "flex flex-col w-full gap-4 font-light",
            weekdays: "flex",
            weekday: "flex-1 text-[0.8rem] text-primary/60 font-light",
            week: "flex w-full mt-2",
            day: "relative w-full h-full p-0 text-center aspect-square select-none",
            button_previous: "p-5",
            button_next: "p-5",
          }}
          className="relative rounded-md border shadow-sm mx-auto mini-calendar [&_select]:font-light [&_select]:text-sm"
        />
        <style>{`.mini-calendar select, .mini-calendar option { font-weight: 300; }`}</style>
      </div>
    </div>
  );
}
