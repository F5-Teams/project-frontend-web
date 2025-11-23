"use client";

import React from "react";
import { useBookings } from "@/services/profile/profile-schedule/hooks";
import { BookingSearch } from "@/components/profile/calendar/BookingSearch";

export default function ScheduleDetailPage() {
  const { data, isLoading, error } = useBookings();

  if (isLoading) return <div className="p-6">Đang tải lịch…</div>;
  if (error) return <div className="p-6 text-red-600">Lỗi tải lịch.</div>;

  return (
    <div className="mx-auto w-full sm:max-w-5xl lg:max-w-7xl p-2 space-y-6">
      <BookingSearch
        tzLabel={Intl.DateTimeFormat().resolvedOptions().timeZone}
        defaultData={data}
      />
    </div>
  );
}
