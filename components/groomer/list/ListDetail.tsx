"use client";

import React from "react";
import type { Booking } from "@/services/groomer/list/type";
import Image from "next/image";

type Props = {
  booking?: Booking | null;
};

export default function ListDetail({ booking }: Props) {
  if (!booking) {
    return (
      <div className="p-6 bg-white rounded-md shadow-sm border h-full">
        <div className="text-sm text-muted-foreground">
          Chọn một đơn để xem chi tiết
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-md shadow-sm border h-full flex flex-col gap-4">
      <div>
        <div className="text-xs text-muted-foreground">
          Booking #{booking.id}
        </div>
        <div className="text-lg font-medium">
          {booking.customer?.firstName ?? ""} {booking.customer?.lastName ?? ""}
        </div>
        <div className="text-sm text-muted-foreground">
          {booking.bookingDate
            ? new Date(booking.bookingDate).toLocaleString()
            : "—"}
        </div>
      </div>

      {/* REPLACE existing grid with a 2-column layout:
          - left: Booking header -> Status/Slot/Service/Price (spans 2 cols)
          - right: Pet image fills the right area (spans 1 col) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm h-full">
        {/* Left: booking info (spans 2 cols on md+) */}
        <div className="md:col-span-2 flex flex-col gap-4">
          <div>
            <div className="text-xs text-muted-foreground">Status</div>
            <div className="font-medium">{booking.status ?? "—"}</div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-xs text-muted-foreground">Slot</div>
              <div className="font-medium">{booking.dropDownSlot ?? "—"}</div>
            </div>

            <div>
              <div className="text-xs text-muted-foreground">
                Service / Combo
              </div>
              <div className="font-medium">
                {booking.combo
                  ? booking.combo.name
                  : booking.servicePrice ?? "—"}
              </div>
            </div>

            <div>
              <div className="text-xs text-muted-foreground">Giá</div>
              <div className="font-medium">
                {booking.comboPrice ?? booking.servicePrice ?? "—"}
              </div>
            </div>

            <div>{/* empty cell to keep grid shape if needed */}</div>
          </div>

          <div>
            <div className="text-xs text-muted-foreground mb-2">
              Hình ảnh (Trước)
            </div>
            <div className="flex gap-2 flex-wrap">
              {(booking.Image ?? []).map((img) => (
                <div
                  key={img.id}
                  className="w-30 h-30 relative overflow-hidden border"
                >
                  {img.imageUrl ? (
                    <Image
                      src={img.imageUrl}
                      alt={`img-${img.id}`}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                      No image
                    </div>
                  )}
                </div>
              ))}
              {(booking.Image ?? []).length === 0 && (
                <div className="text-sm text-muted-foreground">
                  Không có hình ảnh.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: pet image area fills entire right column */}
        <div className="md:col-span-1 flex flex-col items-stretch justify-start h-full">
          <div className="w-full h-full min-h-[240px] rounded-md overflow-hidden border relative">
            {booking.pet?.images &&
            booking.pet.images.length > 0 &&
            booking.pet.images[0].imageUrl ? (
              <Image
                src={booking.pet.images[0].imageUrl}
                alt={booking.pet?.name ?? "pet"}
                fill
                sizes="(max-width: 768px) 100vw, 300px"
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                No pet image
              </div>
            )}
          </div>

          <div className="mt-3 text-center">
            <div className="font-medium">{booking.pet?.name ?? "—"}</div>
            <div className="text-xs text-muted-foreground">
              {booking.pet?.species ?? ""}{" "}
              {booking.pet?.breed ? `• ${booking.pet.breed}` : ""}
            </div>
            <div className="text-xs text-muted-foreground">
              Tuổi: {booking.pet?.age ?? "—"}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-auto text-xs text-muted-foreground">
        Đặt ngày:{" "}
        {booking.createdAt ? new Date(booking.createdAt).toLocaleString() : "—"}
      </div>
    </div>
  );
}
