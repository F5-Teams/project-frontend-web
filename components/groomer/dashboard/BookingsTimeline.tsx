"use client";

import React, { useEffect, useState } from "react";
import {
  useConfirmedBookings,
  useStartOnService,
} from "@/services/groomer/booking/hooks";
import { Booking } from "@/services/groomer/booking/type";
import { formatDMY } from "@/utils/date";
import StartServicePanel from "@/components/groomer/dashboard/StartServicePanel";
import { toast } from "sonner";

type Props = {
  onSelect?: (id: number) => void;
};

export default function BookingsTimeline({ onSelect }: Props) {
  const { data: bookings, isLoading, isError } = useConfirmedBookings();
  // Disable immediate invalidation so booking stays visible to upload BEFORE photo
  const startMutation = useStartOnService({ invalidateOnSuccess: false });

  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [showStartPanelBookingId, setShowStartPanelBookingId] = useState<
    number | null
  >(null);
  // Sau khi gọi API bắt đầu (ON_SERVICE) thì hiển thị nút đăng ảnh BEFORE
  const [awaitingBeforePhotoBookingId, setAwaitingBeforePhotoBookingId] =
    useState<number | null>(null);

  // Restore awaiting state if user changed tab / remounted component
  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(
      "groomer.awaitingBeforePhotoBookingId"
    );
    if (stored) {
      const idNum = Number(stored);
      if (!Number.isNaN(idNum)) {
        setAwaitingBeforePhotoBookingId(idNum);
      }
    }
  }, []);

  // react-query mutation uses 'status' (idle | pending | success | error)
  const isStarting = startMutation.status === "pending";

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
        <h4 className="font-medium mb-4">Bookings</h4>
        <div className="space-y-3">
          <div className="animate-pulse h-12 bg-slate-100 rounded" />
          <div className="animate-pulse h-12 bg-slate-100 rounded" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
        <h4 className="font-medium mb-4">Bookings</h4>
        <div className="text-sm text-rose-600">Không có dữ liệu</div>
      </div>
    );
  }

  if (!bookings || bookings.length === 0) {
    return (
      <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
        <h4 className="font-medium mb-4">Bookings</h4>
        <div className="text-sm text-muted-foreground">
          Không có booking nào
        </div>
      </div>
    );
  }

  async function handleStart(bookingId: number) {
    try {
      await startMutation.mutateAsync(bookingId);
      toast.success("Đã chuyển sang trạng thái đang thực hiện.");
      setAwaitingBeforePhotoBookingId(bookingId);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(
          "groomer.awaitingBeforePhotoBookingId",
          String(bookingId)
        );
      }
    } catch (err) {
      console.error(err);
      toast.error("Không thể bắt đầu thực hiện");
    }
  }

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
      <h4 className="font-medium mb-4">Bookings</h4>

      <div className="space-y-3">
        {bookings.map((b: Booking) => {
          const isExpanded = expandedId === b.id;
          return (
            <div
              key={b.id}
              className="rounded-lg overflow-hidden border border-slate-100"
            >
              <button
                onClick={() => {
                  setExpandedId((prev) => (prev === b.id ? null : b.id));
                  onSelect?.(b.id);
                }}
                className="w-full text-left flex items-center justify-between p-3 hover:bg-slate-50"
                type="button"
              >
                <div className="flex items-start gap-3">
                  <div className="w-3 h-3 rounded-full mt-1 bg-rose-500" />
                  <div>
                    <div className="font-poppins-medium">
                      {b.pet?.name ?? `Booking #${b.id}`}
                    </div>
                    <div className="text-sm font-poppins-regular text-muted-foreground">
                      Khách hàng:{" "}
                      {b.customer
                        ? `${b.customer.firstName ?? ""} ${
                            b.customer.lastName ?? ""
                          }`.trim()
                        : "—"}
                    </div>
                    <div className="text-xs font-poppins-regular text-muted-foreground">
                      Dịch vụ / Combo:{" "}
                      {b.combo?.name ?? b.servicePrice ?? b.comboPrice ?? "—"}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm font-poppins-regular text-black">
                    Ngày đặt:{" "}
                    {b.bookingDate ? formatDMY(new Date(b.bookingDate)) : "-"}
                  </div>
                  <div className="text-xs mt-1 font-medium">
                    {b.dropDownSlot ?? "-"}
                  </div>
                </div>
              </button>

              {isExpanded && (
                <div className="px-3 py-2 pt-0 bg-white/70 backdrop-blur-sm border-t border-slate-100">
                  <div className="flex py-2 items-center justify-between gap-3">
                    <div className=" font-poppins-regular text-sm text-black">
                      Thao tác
                    </div>

                    {b.status === "CONFIRMED" &&
                      awaitingBeforePhotoBookingId !== b.id && (
                        <button
                          type="button"
                          onClick={() => handleStart(b.id)}
                          disabled={isStarting}
                          className="px-3 py-2 bg-primary text-white rounded-2xl font-poppins-light text-sm disabled:opacity-50"
                        >
                          {isStarting ? "Đang xử lý..." : "Bắt đầu thực hiện"}
                        </button>
                      )}

                    {(b.status === "ON_SERVICE" ||
                      awaitingBeforePhotoBookingId === b.id) && (
                      <button
                        type="button"
                        onClick={() => setShowStartPanelBookingId(b.id)}
                        className="px-3 py-2 bg-amber-500 text-white rounded-2xl font-poppins-light text-sm"
                      >
                        Đăng ảnh trước khi thực hiện
                      </button>
                    )}

                    {b.status !== "CONFIRMED" &&
                      b.status !== "ON_SERVICE" &&
                      awaitingBeforePhotoBookingId !== b.id && (
                        <div className="text-xs text-muted-foreground">
                          Không thể bắt đầu: status ≠ CONFIRMED
                        </div>
                      )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {showStartPanelBookingId && (
        <StartServicePanel
          bookingId={showStartPanelBookingId}
          onCancel={() => setShowStartPanelBookingId(null)}
          onDone={() => {
            setShowStartPanelBookingId(null);
            setAwaitingBeforePhotoBookingId(null);
            if (typeof window !== "undefined") {
              window.localStorage.removeItem(
                "groomer.awaitingBeforePhotoBookingId"
              );
            }
            toast.success("Ảnh đã được tải lên");
            // After successful upload, now refresh bookings to reflect possible status or images
            // Manually trigger invalidation
            // (lazy import to avoid circular) - we rely on query client via mutation hook pattern; simplest: reload page or refetch via window location
          }}
        />
      )}
    </div>
  );
}
