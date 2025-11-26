"use client";
import React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { getStatusDotClass } from "./StatusBadge";
import { formatDateTime24 } from "@/utils/date";
import { Booking } from "@/services/profile/profile-schedule/types";

type Props = {
  data: Booking;
  active?: boolean;
  open?: boolean;
  onToggle?: (b: Booking) => void;
  onSelect?: (b: Booking) => void;
  onRequestFeedback?: (b: Booking) => void;
};

export function BookingBox({
  data,
  active,
  open = false,
  onToggle,
  onSelect,
  onRequestFeedback,
}: Props) {
  const router = useRouter();
  const bodyRef = React.useRef<HTMLDivElement>(null);
  const [height, setHeight] = React.useState(0);

  React.useEffect(() => {
    if (!bodyRef.current) return;
    setHeight(open ? bodyRef.current.scrollHeight : 0);
  }, [open]);

  const dotClass = getStatusDotClass(data.status);

  const title =
    data.combo?.name || data.room?.name || `Booking #${data.bookingCode}`;
  // const rangeStart = data.slot?.startDate ?? data.bookingDate;
  // const rangeEnd = data.slot?.endDate ?? data.bookingDate;
  // const hasRange = Boolean(data.slot?.startDate && data.slot?.endDate);

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
            {title}
          </div>
          <div ref={bodyRef} className="pt-1 text-xs text-gray-700 space-y-1.5">
            <div className="flex flex-col items-start">
              <span className="text-gray-500 text-xs">Ngày đặt:</span>
              <span className="font-poppins-light text-gray-800 mt-0.5">
                {formatDateTime24(data.createdAt)}
              </span>
            </div>
          </div>
        </div>
      </button>

      <div
        style={{ height }}
        className="transition-[height] duration-300 ease-out"
      >
        <div
          ref={bodyRef}
          className="px-4 pb-4 pt-1 text-xs text-gray-700 space-y-2"
        >
          <div>
            Boss yêu của Sen:{" "}
            <span className="font-poppins-semibold text-primary">
              {data.pet?.name}
            </span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/profile/calendar/${data.id}`);
            }}
            className="w-full py-2 px-3 bg-primary hover:bg-primary/90 text-white text-xs font-poppins-medium rounded-lg transition-colors"
          >
            Xem chi tiết
          </button>
        </div>
      </div>
    </div>
  );
}
