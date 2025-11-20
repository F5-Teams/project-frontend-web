"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Booking, WeeklyScheduleProps } from "@/types/scheduleType";
import {
  addDays,
  buildTimeSlots,
  getBrowserTZ,
  startOfDay,
  startOfWeek,
  toDateLocal,
} from "@/utils/scheduleUtils";
import { CustomeScrolling } from "@/components/shared/CustomeScrolling";
import { WeekHeader } from "./WeekHeader";
import { TimeColumn } from "./TimeColumn";
import { DayGrid } from "./DayGrid";

export const WeeklySchedule: React.FC<WeeklyScheduleProps> = ({
  timeZone,
  anchorDate,
  dayStartHour = 7,
  dayEndHour = 16,
  slotMinutes = 120,
  enableWeekNav = false,
  onWeekChange,
  bookings = [],
  showTimeColumn = true,
  className,
}) => {
  const tz = timeZone || getBrowserTZ();

  const initialAnchor = React.useMemo(
    () => toDateLocal(anchorDate ?? new Date()),
    [anchorDate]
  );

  const [offsetWeeks, setOffsetWeeks] = React.useState(0);
  const effectiveAnchor = React.useMemo(
    () => addDays(initialAnchor, offsetWeeks * 7),
    [initialAnchor, offsetWeeks]
  );

  const weekStart = React.useMemo(
    () => startOfWeek(effectiveAnchor),
    [effectiveAnchor]
  );
  const weekEnd = React.useMemo(() => addDays(weekStart, 7), [weekStart]);

  const today = React.useMemo(() => startOfDay(new Date()), []);
  const inRangeToday =
    startOfDay(today).getTime() >= startOfDay(weekStart).getTime() &&
    startOfDay(today).getTime() < startOfDay(weekEnd).getTime()
      ? today
      : null;

  const slots = React.useMemo(
    () => buildTimeSlots(dayStartHour, dayEndHour, slotMinutes),
    [dayStartHour, dayEndHour, slotMinutes]
  );

  const rowHeight = 90 * (slotMinutes / 60);

  const weekBookings = React.useMemo(() => {
    return bookings.filter((b) => {
      const s = toDateLocal(b.start);
      return s >= weekStart && s < weekEnd;
    });
  }, [bookings, weekStart, weekEnd]);

  React.useEffect(() => {
    onWeekChange?.(weekStart, weekEnd, offsetWeeks);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offsetWeeks, weekStart.getTime(), weekEnd.getTime()]);

  const bookingsByDay = React.useMemo(() => {
    const map: Record<number, Booking[]> = {};
    for (let i = 0; i < 7; i++) map[i] = [];
    weekBookings.forEach((bk) => {
      const d = toDateLocal(bk.start)!;
      const idx = (d.getDay() + 6) % 7;
      map[idx].push(bk);
    });
    return map;
  }, [weekBookings]);

  return (
    <div className={cn("bg-white rounded-2xl p-4 md:p-6", className)}>
      {enableWeekNav && (
        <div className="flex justify-end mb-2">
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
        </div>
      )}

      <CustomeScrolling axis="x" className="-mx-4 md:mx-0">
        <div className="min-w-[900px] px-4 md:px-0">
          <WeekHeader
            weekStart={weekStart}
            weekEnd={weekEnd}
            today={today}
            tz={tz}
            highlightDate={inRangeToday}
          />

          <div className="grid grid-cols-[60px_repeat(7,1fr)] gap-0">
            {showTimeColumn ? (
              <TimeColumn slots={slots} rowHeight={rowHeight} />
            ) : (
              <div />
            )}

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
