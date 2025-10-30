/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { formatDMY, formatRangeDMY } from "@/utils/date";
import { addDays, startOfDay } from "@/utils/scheduleUtils";

type Props = {
  weekStart: Date;
  weekEnd: Date;
  today: Date;
  tz?: string;
  highlightDate?: Date | null;
};

export const WeekHeader: React.FC<Props> = ({
  weekStart,
  weekEnd,
  today,
  tz,
  highlightDate,
}) => {
  const weekdayLabels = [
    "Thứ 2",
    "Thứ 3",
    "Thứ 4",
    "Thứ 5",
    "Thứ 6",
    "Thứ 7",
    "Chủ Nhật",
  ];

  const weekLabel = React.useMemo(
    () => formatRangeDMY(weekStart, addDays(weekEnd, -1)),
    [weekStart, weekEnd]
  );
  const todayLabel = React.useMemo(() => formatDMY(today), [today]);

  return (
    <>
      {/* tiêu đề + range tuần + hôm nay */}
      <div className="mb-3">
        <div className="text-xl font-poppins-medium text-gray-900 mb-2">
          Lịch tuần hôm nay{" "}
          <span className="font-poppins-light">(Tuần: {weekLabel})</span>
        </div>
      </div>

      {/* hàng tiêu đề ngày/thu */}
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
    </>
  );
};
