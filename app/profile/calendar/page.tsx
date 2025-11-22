"use client";

import React from "react";
import { useBookings } from "@/services/profile/profile-schedule/hooks";
import { Booking } from "@/services/profile/profile-schedule/types";
import { BookingDetailPanel } from "@/components/profile/calendar/BookingDetailPanel";
import { MonthRangeCalendar } from "@/components/profile/calendar/MonthRangeCalendar";
import { BookingSearch } from "@/components/profile/calendar/BookingSearch";
import FeedbackModal from "@/components/profile/calendar/FeedbackModal";

export default function ScheduleDetailPage() {
  const { data, isLoading, error } = useBookings();

  const [selected, setSelected] = React.useState<Booking | null>(null);
  const [month, setMonth] = React.useState<Date>(new Date());
  const [feedbackBooking, setFeedbackBooking] = React.useState<Booking | null>(
    null
  );

  const feedbackBookingId: number | null = React.useMemo(() => {
    if (!feedbackBooking) return null;
    return feedbackBooking.id;
  }, [feedbackBooking]);

  if (isLoading) return <div className="p-6">Đang tải lịch…</div>;
  if (error) return <div className="p-6 text-red-600">Lỗi tải lịch.</div>;

  return (
    <>
      <div className="mx-auto w-full sm:max-w-5xl lg:max-w-7xl p-2 space-y-6">
        <BookingSearch
          selectedId={selected?.id}
          onSelect={(b) => {
            setSelected(b);
            setMonth(
              new Date(b.slot?.startDate ?? b.bookingDate ?? Date.now())
            );
          }}
          tzLabel={Intl.DateTimeFormat().resolvedOptions().timeZone}
          defaultData={data}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <div>
            <BookingDetailPanel
              booking={selected}
              onRequestFeedback={(b) => setFeedbackBooking(b)}
            />
          </div>

          <div className="bg-white rounded-2xl max-h-[60vh] overflow-auto">
            <MonthRangeCalendar
              month={month}
              booking={selected}
              onMonthChange={setMonth}
            />
          </div>
        </div>
      </div>
      <FeedbackModal
        open={Boolean(feedbackBooking)}
        bookingId={feedbackBookingId}
        onClose={() => setFeedbackBooking(null)}
      />
    </>
  );
}
