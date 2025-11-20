"use client";

import React from "react";
import { useMyBookings } from "@/services/groomer/list/hooks";
import type { Booking } from "@/services/groomer/list/type";
import Image from "next/image";
import { gsap } from "gsap";

type Props = {
  onSelectBooking?: (b: Booking | null) => void;
  selectedBooking?: Booking | null;
};

export default function BookingsWithImagesList({
  onSelectBooking,
  selectedBooking,
}: Props) {
  const { data: bookings, isLoading, isError } = useMyBookings();
  const [typeFilter, setTypeFilter] = React.useState<"ALL" | "SPA" | "HOTEL">(
    "ALL"
  );
  const filterRef = React.useRef<HTMLDivElement | null>(null);

  const itemsBase: Booking[] = (bookings ?? []).filter((b) => {
    const hasImages = Array.isArray(b.Image) && b.Image.length > 0;
    const isOnService = b.status === "ON_SERVICE";
    return hasImages || isOnService;
  });

  const items: Booking[] = React.useMemo(() => {
    if (typeFilter === "ALL") return itemsBase;
    const target = typeFilter;
    return itemsBase.filter(
      (b) => String(b.type ?? "").toUpperCase() === target
    );
  }, [itemsBase, typeFilter]);

  React.useEffect(() => {
    if (!filterRef.current) return;
    const active = filterRef.current.querySelector<HTMLButtonElement>(
      `button[data-opt="${typeFilter}"]`
    );
    if (!active) return;
    gsap.fromTo(
      active,
      { scale: 0.96 },
      { scale: 1, duration: 0.18, ease: "power2.out" }
    );
  }, [typeFilter]);

  function onBtnEnter(e: React.MouseEvent<HTMLButtonElement>) {
    gsap.to(e.currentTarget, {
      scale: 1.05,
      y: -1,
      boxShadow: "0 6px 18px rgba(99,102,241,0.22)",
      duration: 0.18,
      ease: "power2.out",
    });
  }

  function onBtnLeave(e: React.MouseEvent<HTMLButtonElement>) {
    gsap.to(e.currentTarget, {
      scale: 1,
      y: 0,
      boxShadow: "0 0 0 rgba(0,0,0,0)",
      duration: 0.2,
      ease: "power2.inOut",
    });
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 mb-3">
        <span className="text-[16px] font-poppins-regular text-muted-foreground">
          Lọc:
        </span>
        <div
          ref={filterRef}
          className="inline-flex rounded-full border bg-white p-2 text-xs shadow-sm backdrop-blur supports-backdrop-filter:bg-white/80"
        >
          {(["ALL", "SPA", "HOTEL"] as const).map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => setTypeFilter(opt)}
              onMouseEnter={onBtnEnter}
              onMouseLeave={onBtnLeave}
              data-opt={opt}
              aria-pressed={typeFilter === opt}
              className={
                "relative px-4 py-1.5 rounded-full font-poppins-regular text-sm transition-all will-change-transform " +
                (typeFilter === opt
                  ? "bg-pink-500/95 text-white shadow-md ring-1 ring-indigo-300"
                  : "text-slate-700 hover:bg-slate-50")
              }
            >
              <span className="inline-block translate-y-[0.5px]">
                {opt === "ALL" ? "Tất cả" : opt}
              </span>
            </button>
          ))}
        </div>
      </div>
      {isLoading && <div className="p-4">Đang tải...</div>}
      {isError && <div className="p-4 text-red-600">Lỗi khi tải dữ liệu</div>}
      {!isLoading && !isError && items.length === 0 && (
        <div className="p-4 text-sm font-poppins-regular text-muted-foreground">
          Không có đơn hàng có hình ảnh hoặc đang thực hiện.
        </div>
      )}
      {!isLoading &&
        !isError &&
        items.map((b) => {
          const isSelected = selectedBooking?.id === b.id;
          return (
            <div
              key={b.id}
              role="button"
              tabIndex={0}
              aria-pressed={isSelected}
              onClick={() => {
                const isAlreadySelected = selectedBooking?.id === b.id;
                onSelectBooking?.(isAlreadySelected ? null : b);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  const isAlreadySelected = selectedBooking?.id === b.id;
                  onSelectBooking?.(isAlreadySelected ? null : b);
                }
              }}
              className={
                "bg-white p-3 rounded-xl shadow-sm border cursor-pointer focus:outline-none transition-all duration-200 ease-out " +
                "hover:shadow-lg hover:border-indigo-300 hover:bg-indigo-50/40 " +
                "hover:ring-2 hover:ring-indigo-300/60 " +
                (isSelected ? "border-indigo-500 ring-1 ring-indigo-200" : "")
              }
            >
              <div className="flex justify-between items-start gap-4">
                <div>
                  <div className="text-sm mb-2 font-poppins-light text-muted-foreground">
                    Booking #{b.id}
                  </div>
                  <div className="font-poppins-regular">
                    {b.customer?.firstName || ""} {b.customer?.lastName || ""} —{" "}
                    {b.bookingDate
                      ? new Date(b.bookingDate).toLocaleString()
                      : "—"}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Trạng thái: {b.status}
                    {(!Array.isArray(b.Image) || b.Image.length === 0) &&
                      b.status === "ON_SERVICE" && (
                        <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-amber-700 border border-amber-200">
                          Chưa có ảnh
                        </span>
                      )}
                  </div>
                </div>

                <div className="flex gap-2 items-center">
                  {(() => {
                    const firstImg = (b.pet?.images ?? [])[0];
                    if (firstImg) {
                      return (
                        <Image
                          key={firstImg.id}
                          src={firstImg.imageUrl}
                          alt={`pet-${b.id}-img-${firstImg.id}`}
                          width={100}
                          height={100}
                          className="object-cover rounded-md border"
                        />
                      );
                    }
                    return (
                      <div className="w-16 h-16 bg-slate-50 rounded-md flex items-center justify-center text-xs text-muted-foreground border">
                        Không có ảnh
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
}
