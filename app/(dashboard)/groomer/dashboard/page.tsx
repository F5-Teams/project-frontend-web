"use client";

import BookingsTimeline from "@/components/groomer/dashboard/BookingsTimeline";
import TotalSummary from "@/components/groomer/dashboard/TotalSummary";
import BookingDetail from "@/components/groomer/dashboard/BookingDetail";
import React, { useState } from "react";

export default function GroomerDashboardPage() {
  const [selectedBookingId, setSelectedBookingId] = useState<number | null>(
    null
  );

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
              {/* calendar card */}
              <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="font-medium">Calendar</div>
                  <div className="text-sm text-muted-foreground">Jan</div>
                </div>
                <div className="grid grid-cols-7 gap-2 text-center text-sm">
                  {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map(
                    (d, i) => (
                      <div key={d} className="py-3 rounded-lg">
                        <div className="text-xs text-muted-foreground">{d}</div>
                        <div
                          className={`mt-2 inline-flex items-center justify-center w-8 h-8 rounded-full ${
                            i === 3 ? "bg-sky-600 text-white" : "text-slate-700"
                          }`}
                        >
                          {7 + i}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>

              <BookingsTimeline onSelect={(id) => setSelectedBookingId(id)} />
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
