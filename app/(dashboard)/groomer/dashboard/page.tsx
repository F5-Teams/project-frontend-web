"use client";

import BookingsTimeline from "@/components/groomer/dashboard/BookingsTimeline";
import TotalSummary from "@/components/groomer/dashboard/TotalSummary";
import BookingDetail from "@/components/groomer/dashboard/BookingDetail";
import WeekCalendar from "@/components/groomer/dashboard/WeekCalendar";
import React, { useState } from "react";
import { useConfirmedBookings } from "@/services/groomer/booking/hooks";

export default function GroomerDashboardPage() {
  const [selectedBookingId, setSelectedBookingId] = useState<number | null>(
    null
  );
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const { data: allBookings = [] } = useConfirmedBookings();

  return (
    <div
      className=" mx-auto w-full
      sm:max-w-screen-sm md:max-w-4xl
      lg:max-w-6xl xl:max-w-8xl"
    >
      <div className="flex-1">
        {/* Page content */}
        <main>
          <div className="grid lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 space-y-6">
              <WeekCalendar
                bookings={allBookings}
                selected={selectedDate}
                onSelect={(d) => setSelectedDate(d)}
                onClear={() => setSelectedDate(null)}
              />

              <BookingsTimeline
                filterDate={selectedDate ?? undefined}
                onSelect={(id) => setSelectedBookingId(id)}
              />
            </div>

            <aside className="space-y-6">
              <TotalSummary />

              {/* Booking detail dưới TotalSummary */}
              <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
                <div className="flex items-center justify-between mb-3">
                  <div className="font-poppins-regular">Chi tiết booking</div>
                </div>

                <div>
                  {selectedBookingId ? (
                    <BookingDetail
                      bookingId={selectedBookingId}
                      onClose={() => setSelectedBookingId(null)}
                    />
                  ) : (
                    <div className="text-sm text-muted-foreground p-3">
                      Chọn một booking để xem chi tiết
                    </div>
                  )}
                </div>
              </div>
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
}
