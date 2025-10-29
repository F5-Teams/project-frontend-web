"use client";

import React from "react";
import { useBookings } from "@/services/profile/profile-schedule/hooks";
import { mapApiListToCalendar } from "@/components/profile/calendar/mapApiToCalendar";
import { CalendarBooking } from "@/types/calendarType"; // import type from central file
import { WeeklyGrid } from "@/components/profile/calendar/WeeklyGrid";
import { BookingDetailPanel } from "@/components/profile/calendar/BookingDetailPanel";
import { MonthRangeCalendar } from "@/components/profile/calendar/MonthRangeCalendar";

export default function ScheduleDetailPage() {
  const { data, isLoading, error } = useBookings();
  const list: CalendarBooking[] = React.useMemo(
    () => (data ? mapApiListToCalendar(data) : []),
    [data]
  );

  const [selected, setSelected] = React.useState<CalendarBooking | null>(null);
  const [month, setMonth] = React.useState<Date>(new Date());

  if (isLoading) return <div className="p-6">Đang tải lịch…</div>;
  if (error) return <div className="p-6 text-red-600">Lỗi tải lịch.</div>;

  return (
    <div className="mx-auto w-full sm:max-w-5xl lg:max-w-7xl p-4 md:p-6 space-y-6">
      <WeeklyGrid
        data={list}
        selectedId={selected?.id}
        onSelect={(b) => {
          setSelected(b);

          setMonth(new Date(b.startDate ?? Date.now()));
        }}
        tzLabel={Intl.DateTimeFormat().resolvedOptions().timeZone}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        <div>
          <BookingDetailPanel booking={selected} />
        </div>

        <div className="bg-white rounded-2xl p-4 max-h-[60vh] overflow-auto">
          <div className="text-sm font-semibold text-gray-900 mb-2">
            Lịch tháng
          </div>
          <MonthRangeCalendar
            month={month}
            booking={selected}
            onMonthChange={setMonth}
          />
        </div>
      </div>
    </div>
  );
}
