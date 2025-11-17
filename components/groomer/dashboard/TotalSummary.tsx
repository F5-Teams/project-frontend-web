/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useEffect, useMemo } from "react";
import useCountUp from "@/utils/useCountUp";
import { useMyBookingsLive } from "@/services/groomer/booking/hooks";
import { Booking } from "@/services/groomer/booking/type";

type Props = {
  bookings?: Booking[];
};

function parseBookingDate(raw?: string | null) {
  if (!raw) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
    return Date.parse(raw + "T00:00:00Z");
  }
  return Date.parse(raw);
}

export default function TotalSummary({ bookings: propBookings }: Props) {
  // Auto refresh every 30s (runs in background too)
  const { data: myBookings, refetch } = useMyBookingsLive(30_000);

  const source = propBookings ?? myBookings ?? [];

  const now = new Date();
  const year = now.getUTCFullYear();
  const month = now.getUTCMonth();

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

    if (process.env.NODE_ENV === "development") {
      console.debug("TotalSummary debug", {
        sourceCount: source?.length ?? 0,
        bookingsThisMonth: arr.length,
        monthStartUTC: new Date(monthStartUTC).toISOString(),
        monthEndUTC: new Date(monthEndUTC).toISOString(),
        nowUTC: new Date().toISOString(),
        items: debugItems,
      });
    }
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

  // Ensure data refreshes when user returns to the tab or window regains focus
  useEffect(() => {
    const onFocus = () => {
      refetch();
    };
    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        refetch();
      }
    };
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [refetch]);

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
