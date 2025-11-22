"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { CalendarEvent } from "@/services/profile/profile-schedule/types";
import { fmtHM, toDateLocal } from "@/utils/scheduleUtils";
import { CustomeScrolling } from "@/components/shared/CustomeScrolling";

type Props = { bookings: CalendarEvent[]; title?: string };

export const BookingList: React.FC<Props> = ({
  bookings,
  title = "Bookings",
}) => {
  const sorted = React.useMemo(
    () =>
      [...bookings].sort((a, b) => {
        const ta = toDateLocal(a.startDate)!.getTime();
        const tb = toDateLocal(b.startDate)!.getTime();
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
            const s = toDateLocal(b.startDate)!;
            const e = toDateLocal(b.endDate)!;

            const listTimeText = `${s.toLocaleDateString()} • ${fmtHM(
              s
            )}–${fmtHM(e)}`;

            return (
              <div key={b.id} className="flex items-start gap-2">
                <div
                  className={cn(
                    "w-2 h-2 mt-2 rounded-full",
                    b.color.includes("teal")
                      ? "bg-teal-400"
                      : b.color.includes("violet")
                      ? "bg-violet-400"
                      : b.color.includes("blue")
                      ? "bg-blue-400"
                      : "bg-gray-400"
                  )}
                />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-gray-900 truncate">
                    {b.title}
                  </div>
                  <div className="text-[11px] text-gray-600">
                    {listTimeText}
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
