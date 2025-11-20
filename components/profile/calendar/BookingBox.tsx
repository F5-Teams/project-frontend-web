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

  const metaStart = data.meta?.startDate ?? null;
  const metaEnd = data.meta?.endDate ?? null;
  const rangeStart = metaStart ?? data.startDate ?? null;
  const rangeEnd = metaEnd ?? data.endDate ?? null;

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
      <button
        className="w-full flex flex-col items-start gap-2 px-3 py-3"
        onClick={() => {
          onToggle?.(data);
          onSelect?.(data);
        }}
      >
        <div className="w-full flex items-center justify-between gap-2">
          <span
            className={cn("inline-block w-2.5 h-2.5 rounded-full", dotClass)}
          />
          <ChevronDown
            className={cn("w-4 h-4 transition-transform", open && "rotate-180")}
          />
        </div>

        <div className="w-full min-w-0 text-left">
          <div className="text-sm font-medium text-gray-900 whitespace-normal wrap-break-words">
            {data.title}
          </div>
          <div ref={bodyRef} className="pt-1 text-xs text-gray-700 space-y-1.5">
            {data.meta?.bookingDate && !data.endDate && (
              <div className="flex flex-col items-start">
                <span className="text-gray-500 text-xs">Ngày:</span>
                <span className="font-poppins-light text-gray-700 mt-0.5">
                  {formatDMY(new Date(data.meta.bookingDate))}
                </span>
              </div>
            )}
            {hasExplicitRange && rangeStart && rangeEnd && (
              <div className="flex justify-between">
                <span className="text-gray-500">Ngày:</span>
                <span className="font-poppins-light ml-1">
                  {formatDMY(new Date(rangeStart))}–
                  {formatDMY(new Date(rangeEnd))}
                </span>
              </div>
            )}
          </div>
        </div>
      </button>

      <div
        style={{ height }}
        className="transition-[height] duration-300 ease-out"
      >
        <div
          ref={bodyRef}
          className="px-4 pb-4 pt-1 text-xs text-gray-700 space-y-1.5"
        >
          Boss yêu của Sen:{" "}
          <span className="font-poppins-semibold text-primary">
            {data.pet?.name}
          </span>
        </div>
      </div>
    </div>
  );
}
