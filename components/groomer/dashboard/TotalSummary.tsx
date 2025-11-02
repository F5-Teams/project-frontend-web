/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useMemo } from "react";
import useCountUp from "@/utils/useCountUp";
import { useConfirmedBookings } from "@/services/groomer/booking/hooks";
import { Booking } from "@/services/groomer/booking/type";

type Props = {
  bookings?: Booking[];
};

function parseBookingDate(raw?: string | null) {
  if (!raw) return null;
  // preserve previous behavior for plain date strings but return timestamp (ms)
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
    return Date.parse(raw + "T00:00:00Z"); // treat date-only as UTC midnight
  }
  return Date.parse(raw); // returns ms since epoch (handles ISO with timezone)
}

export default function TotalSummary({ bookings: propBookings }: Props) {
  const { data: confirmedBookings } = useConfirmedBookings();

  const source = propBookings ?? confirmedBookings ?? [];

  const now = new Date();
  const year = now.getUTCFullYear();
  const month = now.getUTCMonth(); // use UTC month to match UTC timestamps from API

  // UTC boundaries (ms)
  const monthStartUTC = Date.UTC(year, month, 1, 0, 0, 0, 0);
  const monthEndUTC = Date.UTC(year, month + 1, 1, 0, 0, 0, 0);

  const bookingsThisMonth = useMemo(() => {
    const arr = source.filter((b) => {
      if (!b.bookingDate) return false;
      const t = parseBookingDate(String(b.bookingDate));
      if (!t || Number.isNaN(t)) return false;
      return t >= monthStartUTC && t < monthEndUTC;
    });

    // detailed debug: show parsed timestamps and inclusion decision per booking
    const debugItems = (source || []).map((b) => {
      const t = parseBookingDate(String(b?.bookingDate));
      return {
        id: b?.id ?? null,
        bookingDateRaw: b?.bookingDate ?? null,
        parsedTimestamp: t ?? null,
        parsedISO: t && !Number.isNaN(t) ? new Date(t).toISOString() : null,
        included:
          typeof t === "number" && !Number.isNaN(t)
            ? t >= monthStartUTC && t < monthEndUTC
            : false,
      };
    });

    console.debug("TotalSummary debug", {
      sourceCount: source?.length ?? 0,
      bookingsThisMonth: arr.length,
      monthStartUTC: new Date(monthStartUTC).toISOString(),
      monthEndUTC: new Date(monthEndUTC).toISOString(),
      nowUTC: new Date().toISOString(),
      items: debugItems,
    });
    return arr;
  }, [source, monthStartUTC, monthEndUTC]);

  const totalThisMonth = bookingsThisMonth.length;

  const confirmedCount = bookingsThisMonth.filter(
    (b) => b.status === "CONFIRMED"
  ).length;

  const onServiceCount = bookingsThisMonth.filter((b) =>
    /ON[_]?SERVICE/i.test(String(b.status))
  ).length;

  const animatedTotal = useCountUp(totalThisMonth);
  const animatedConfirmed = useCountUp(confirmedCount);
  const animatedOnService = useCountUp(onServiceCount);

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
      <div className="text-sm text-muted-foreground">
        Tổng số lượt đặt trong tháng
      </div>

      <div className="text-3xl font-semibold mt-2">{animatedTotal}</div>

      <div className="mt-4 space-y-2 text-sm">
        <div className="flex justify-between items-center">
          <span>Đã xác nhận</span>
          <span className="font-semibold">{animatedConfirmed}</span>
        </div>

        <div className="flex justify-between items-center">
          <span>Đang phục vụ</span>
          <span className="font-semibold">{animatedOnService}</span>
        </div>
      </div>
    </div>
  );
}
