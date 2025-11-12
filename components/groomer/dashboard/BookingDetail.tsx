"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useConfirmedBookings } from "@/services/groomer/booking/hooks";
import { Booking } from "@/services/groomer/booking/type";
import { formatDMY } from "@/utils/date";
import { X } from "lucide-react";
import AnimatedPetName from "@/components/groomer/AnimatedPetName";
import { toast } from "sonner";
import StartServicePanel from "@/components/groomer/dashboard/StartServicePanel";

type Props = {
  bookingId: number | null;
  onClose?: () => void;
  className?: string;
};

export default function BookingDetail({
  bookingId,
  onClose,
  className,
}: Props) {
  const { data: bookings, isLoading } = useConfirmedBookings();
  const [showStartPanel, setShowStartPanel] = useState(false);

  if (!bookingId) return null;

  if (isLoading) {
    return (
      <div
        className={`bg-white rounded-xl p-4 shadow-sm border border-slate-100 ${
          className ?? ""
        }`}
      >
        <div className="animate-pulse h-6 bg-slate-100 rounded mb-4" />
        <div className="space-y-2">
          <div className="animate-pulse h-4 bg-slate-100 rounded" />
          <div className="animate-pulse h-4 bg-slate-100 rounded" />
          <div className="animate-pulse h-4 bg-slate-100 rounded" />
        </div>
      </div>
    );
  }

  const booking: Booking | undefined = bookings?.find(
    (b) => b.id === bookingId
  );

  if (!booking) {
    return (
      <div
        className={`bg-white rounded-xl p-4 shadow-sm border border-slate-100 ${
          className ?? ""
        }`}
      >
        <div className="text-sm text-rose-600">Không tìm thấy booking nào</div>
        <div className="mt-3">
          <button
            onClick={onClose}
            className="text-xs text-sky-600 hover:underline"
          >
            Đóng
          </button>
        </div>
      </div>
    );
  }

  const petImage = booking.pet?.images?.[0]?.imageUrl ?? null;
  const petName = booking.pet?.name ?? `#${booking.petId ?? booking.id}`;
  const customerName = booking.customer
    ? `${booking.customer.firstName ?? ""} ${
        booking.customer.lastName ?? ""
      }`.trim()
    : "—";
  const customerPhone = booking.customer?.phoneNumber ?? "—";
  const comboName = booking.combo?.name ?? null;
  const serviceInfo = comboName ?? "Khách sạn thú cưng";

  const SLOT_LABELS: Record<string, string> = {
    MORNING: "Sáng (7:30 - 11:30)",
    AFTERNOON: "Trưa (12:30 - 16:30)",
    EVENING: "Chiều (17:00 - 19:00)",
  };
  const formatSlot = (raw?: string | null) => {
    if (!raw) return "—";
    const key = raw.trim().toUpperCase();
    return SLOT_LABELS[key] ?? raw;
  };

  return (
    <div className={className ?? ""}>
      <div className="flex items-start justify-between">
        <div>
          <h4 className="font-semibold text-lg">
            <span className="relative inline-block group">
              <AnimatedPetName name={petName} />
              {/* tooltip unchanged */}
              <div
                role="tooltip"
                className="pointer-events-none opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-150 absolute left-0 top-full mt-2 w-64 bg-white border border-slate-200 rounded-lg shadow-lg p-3 text-xs text-slate-700 z-20"
              >
                {/* pet info shown on hover */}
                <div className="grid grid-cols-2 gap-1 text-[12px] text-muted-foreground">
                  <div>Tuổi</div>
                  <div className="text-right">{booking.pet?.age ?? "—"}</div>

                  <div>Species</div>
                  <div className="text-right">
                    {booking.pet?.species ?? "—"}
                  </div>

                  <div>Breed</div>
                  <div className="text-right">{booking.pet?.breed ?? "—"}</div>

                  <div>Height</div>
                  <div className="text-right">{booking.pet?.height ?? "—"}</div>

                  <div>Weight</div>
                  <div className="text-right">{booking.pet?.weight ?? "—"}</div>
                </div>

                <div className="mt-2 text-[12px]">
                  <div className="text-xs text-muted-foreground">Note</div>
                  <div className="truncate">{booking.pet?.note ?? "—"}</div>
                </div>
              </div>
            </span>
          </h4>

          <div className="text-xs text-muted-foreground mt-1">
            Booking #{booking.id}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onClose && (
            <button
              onClick={onClose}
              aria-label="Close"
              className="text-xs text-sky-600 hover:underline"
            >
              <X size={16} className="text-gray-600" />
            </button>
          )}
        </div>
      </div>

      {/* rest of booking detail unchanged (dates, customer, etc) */}
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <div className="text-xs mb-1 text-muted-foreground">Ngày đặt</div>
          <div className="font-poppins-regular">
            {booking.bookingDate
              ? formatDMY(new Date(booking.bookingDate))
              : "—"}
          </div>
        </div>

        <div>
          <div className="text-xs mb-1 font-poppins-regular text-gray-500">
            Khung giờ
          </div>
          <div className="font-poppins-regular text-[15px]">
            {formatSlot(booking.dropDownSlot)}
          </div>
        </div>

        <div>
          <div className="text-xs mb-1 font-poppins-regular text-gray-500">
            Khách hàng
          </div>
          <div className="font-poppins-regular mb-1">{customerName}</div>
          <div className="text-xs mb-1 font-poppins-regular text-gray-500">
            Số điện thoại:{" "}
            <span className="text-black text-sm">{customerPhone}</span>
          </div>
        </div>

        <div>
          <div className="text-xs font-poppins-regular text-gray-500">
            Dịch vụ
          </div>
          <div className="font-poppins-regular">{serviceInfo}</div>
        </div>
      </div>

      <div className="mt-4">
        <div className="text-xs font-poppins-regular text-gray-500">
          Ghi chú
        </div>
        <div className="font-poppins-regular text-sm">
          {booking.note && booking.note.trim() !== ""
            ? booking.note
            : "Không có ghi chú"}
        </div>
      </div>

      <div className="mt-4 flex items-center gap-3">
        {petImage ? (
          <div className="w-20 h-20 rounded overflow-hidden bg-slate-100">
            <Image
              src={petImage}
              alt={petName}
              width={80}
              height={80}
              className="object-cover w-full h-full"
            />
          </div>
        ) : (
          <div className="w-20 h-20 rounded bg-slate-100 flex items-center justify-center text-sm">
            No image
          </div>
        )}
      </div>

      {/* Modal panel shown after startSuccessful => mandatory upload BEFORE */}
      {showStartPanel && (
        <StartServicePanel
          bookingId={bookingId}
          onDone={() => {
            setShowStartPanel(false);
            toast.success("Quá trình bắt đầu hoàn tất");
          }}
        />
      )}
    </div>
  );
}
