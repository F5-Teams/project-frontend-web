"use client";
import React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

import { getStatusDotClass } from "./StatusBadge";
import { formatDMY } from "@/utils/dateRange";
import { CalendarBooking } from "@/types/calendarType";

type Props = {
  data: CalendarBooking;
  active?: boolean;
  open?: boolean;
  onToggle?: (b: CalendarBooking) => void;
  onSelect?: (b: CalendarBooking) => void;
};

export function BookingBox({
  data,
  active,
  open = false,
  onToggle,
  onSelect,
}: Props) {
  const bodyRef = React.useRef<HTMLDivElement>(null);
  const [height, setHeight] = React.useState(0);

  React.useEffect(() => {
    if (!bodyRef.current) return;
    setHeight(open ? bodyRef.current.scrollHeight : 0);
  }, [open]);

  const dotClass = getStatusDotClass(data.status);

  // determine source of start/end for range display
  const metaStart = data.meta?.startDate ?? null;
  const metaEnd = data.meta?.endDate ?? null;
  const rangeStart = metaStart ?? data.startDate ?? null;
  const rangeEnd = metaEnd ?? data.endDate ?? null;
  // only consider a "Khoảng ngày" when there is an explicit start AND end
  const hasExplicitRange = Boolean(
    (metaStart && metaEnd) || (data.startDate && data.endDate)
  );

  return (
    <div
      className={cn(
        "relative rounded-2xl border shadow-sm bg-white overflow-hidden transition-colors",
        "ring-1 ring-black/5",
        active ? "border-primary/60 ring-primary/20" : "border-gray-200"
      )}
    >
      {/* Header */}
      <button
        className="w-full flex items-start gap-3 px-4 py-3"
        onClick={() => {
          onToggle?.(data);
          onSelect?.(data);
        }}
      >
        <span
          className={cn("inline-block w-2.5 h-2.5 mt-1 rounded-full", dotClass)}
        />
        <div className="min-w-0 flex-1 text-left">
          <div className="text-sm font-medium text-gray-900 whitespace-normal wrap-break-words">
            {data.title}
          </div>
          {data.meta?.room && (
            <div className="text-xs text-gray-600 whitespace-normal wrap-break-words mt-0.5">
              {data.meta.room}
            </div>
          )}
        </div>

        <ChevronDown
          className={cn(
            "w-4 h-4 ml-1 shrink-0 transition-transform",
            open && "rotate-180"
          )}
        />
      </button>

      <div
        style={{ height }}
        className="transition-[height] duration-300 ease-out"
      >
        <div
          ref={bodyRef}
          className="px-4 pb-4 pt-1 text-xs text-gray-700 space-y-1.5"
        >
          {data.meta?.bookingDate && !data.endDate && (
            <div className="flex items-center gap-1">
              <span className="text-gray-500">Ngày:</span>
              <span className="font-poppins-regular text-gray-700">
                {formatDMY(new Date(data.meta.bookingDate))}
              </span>
            </div>
          )}
          {hasExplicitRange && rangeStart && rangeEnd && (
            <div className="flex justify-between">
              <span className="text-gray-500">Khoảng ngày:</span>
              <span className="font-medium">
                {formatDMY(new Date(rangeStart))}–
                {formatDMY(new Date(rangeEnd))}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
