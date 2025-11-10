"use client";

import React, { useState } from "react";
import { useMyBookings } from "@/services/groomer/list/hooks";
import type { Booking } from "@/services/groomer/list/type";
import Image from "next/image";

type ImageType = "BEFORE" | "DURING" | "AFTER";

type Props = {
  onSelectBooking?: (b: Booking | null) => void;
  selectedBooking?: Booking | null;
  onRequestUpload?: (bookingId: number, imageType: ImageType) => void;
};

export default function BookingsWithImagesList({
  onSelectBooking,
  selectedBooking,
  onRequestUpload,
}: Props) {
  const { data: bookings, isLoading, isError } = useMyBookings();
  const [openMenuFor, setOpenMenuFor] = useState<number | null>(null);

  if (isLoading) return <div className="p-4">Đang tải...</div>;
  if (isError)
    return <div className="p-4 text-red-600">Lỗi khi tải dữ liệu</div>;

  const items: Booking[] = (bookings ?? []).filter(
    (b) => Array.isArray(b.Image) && b.Image.length > 0
  );

  if (items.length === 0) {
    return (
      <div className="p-4 text-sm text-muted-foreground">
        Không có đơn hàng có hình ảnh.
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
            onClick={() => onSelectBooking?.(b)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") onSelectBooking?.(b);
            }}
            className={
              "bg-white p-3 rounded-md shadow-sm border cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-400 " +
              (isSelected ? "border-indigo-500 ring-1 ring-indigo-200" : "")
            }
          >
            <div className="flex justify-between items-start gap-4">
              <div>
                <div className="text-sm text-muted-foreground">
                  Booking #{b.id}
                </div>
                <div className="font-medium">
                  {b.customer?.firstName || ""} {b.customer?.lastName || ""} —{" "}
                  {b.bookingDate
                    ? new Date(b.bookingDate).toLocaleString()
                    : "—"}
                </div>
                <div className="text-xs text-muted-foreground">
                  Status: {b.status}
                </div>
              </div>

              <div className="flex gap-2 items-center">
                {(b.pet?.images ?? []).slice(0, 4).map((img) => (
                  <Image
                    key={img.id}
                    src={img.imageUrl}
                    alt={`pet-${b.id}-img-${img.id}`}
                    width={64}
                    height={64}
                    className="object-cover rounded-md border"
                  />
                ))}
                {(b.pet?.images ?? []).length === 0 && (
                  <div className="w-16 h-16 bg-slate-50 rounded-md flex items-center justify-center text-xs text-muted-foreground border">
                    No image
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
