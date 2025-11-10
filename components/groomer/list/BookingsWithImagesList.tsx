"use client";

import React from "react";
import { useMyBookings } from "@/services/groomer/list/hooks";
import type { Booking } from "@/services/groomer/list/type";
import Image from "next/image";
// Note: ImageType removed here as it's not yet used within this list component

type Props = {
  onSelectBooking?: (b: Booking | null) => void;
  selectedBooking?: Booking | null;
  // Removed onRequestUpload for now (was unused); can be reintroduced when upload actions added here.
};

export default function BookingsWithImagesList({
  onSelectBooking,
  selectedBooking,
}: Props) {
  const { data: bookings, isLoading, isError } = useMyBookings();
  // Removed unused local state (openMenuFor) after simplifying UI

  if (isLoading) return <div className="p-4">Đang tải...</div>;
  if (isError)
    return <div className="p-4 text-red-600">Lỗi khi tải dữ liệu</div>;

  // Show bookings that already have images OR are currently ON_SERVICE (even if no images yet)
  const items: Booking[] = (bookings ?? []).filter((b) => {
    const hasImages = Array.isArray(b.Image) && b.Image.length > 0;
    const isOnService = b.status === "ON_SERVICE";
    return hasImages || isOnService;
  });

  if (items.length === 0) {
    return (
      <div className="p-4 text-sm font-poppins-regular text-muted-foreground">
        Không có đơn hàng có hình ảnh hoặc đang thực hiện.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((b) => {
        const isSelected = selectedBooking?.id === b.id;
        return (
          <div
            key={b.id}
            role="button"
            tabIndex={0}
            aria-pressed={isSelected}
            onClick={() => {
              // Toggle selection: clicking the same booking collapses the detail panel
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
