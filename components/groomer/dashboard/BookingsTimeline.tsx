"use client";

import React, { useState } from "react";
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
  const startMutation = useStartOnService();

  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [showStartPanelBookingId, setShowStartPanelBookingId] = useState<
    number | null
  >(null);

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
      toast.success("Bắt đầu thực hiện. Vui lòng upload ảnh");
      setShowStartPanelBookingId(bookingId);
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
                    <div className="font-medium">
                      {b.pet?.name ?? `Booking #${b.id}`}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Khách hàng:{" "}
                      {b.customer
                        ? `${b.customer.firstName ?? ""} ${
                            b.customer.lastName ?? ""
                          }`.trim()
                        : "—"}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Dịch vụ / Combo:{" "}
                      {b.combo?.name ?? b.servicePrice ?? b.comboPrice ?? "—"}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm text-muted-foreground">
                    Ngày đặt:{" "}
                    {b.bookingDate ? formatDMY(new Date(b.bookingDate)) : "-"}
                  </div>
                  <div className="text-xs mt-1 font-medium">
                    {b.dropDownSlot ?? "-"}
                  </div>
                  <div className="text-xs text-slate-600 mt-1">{b.status}</div>
                </div>
              </button>

              {isExpanded && (
                <div className="px-3 pb-3 pt-0 bg-slate-50 border-t border-slate-100">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-sm text-muted-foreground">
                      Bạn có muốn bắt đầu thực hiện booking này?
                    </div>

                    {b.status === "CONFIRMED" ? (
                      <button
                        type="button"
                        onClick={() => handleStart(b.id)}
                        disabled={isStarting}
                        className="px-3 py-1 bg-amber-500 text-white rounded text-sm disabled:opacity-50"
                      >
                        {isStarting ? "Đang xử lý..." : "Bắt đầu thực hiện"}
                      </button>
                    ) : (
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
          onDone={() => {
            setShowStartPanelBookingId(null);
            setExpandedId(null);
            toast.success("Ảnh BEFORE đã gửi, bắt đầu thực hiện hoàn tất");
          }}
        />
      )}
    </div>
  );
}
