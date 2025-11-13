/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import api from "@/config/axios";
import type { Booking } from "@/components/models/booking";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { Loader2 } from "lucide-react";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("Asia/Ho_Chi_Minh");

const formatDateTime = (date: string | null | undefined) => {
  if (!date) return "-";
  return dayjs(date).tz().format("DD/MM/YYYY HH:mm");
};
const formatDate = (date: string | null | undefined) => {
  if (!date) return "-";
  return dayjs(date).tz().format("DD/MM/YYYY");
};

export default function HotelBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<number | null>(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await api.get("/bookings/staff/hotel");
      setBookings(res.data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async (id: number) => {
    try {
      setUpdating(id);
      await api.put(`/bookings/${id}/dates`, {
        checkInDate: new Date().toISOString(),
        status: "ON_SERVICE",
      });
      alert(" Check-in thành công!");
      fetchBookings();
    } catch (error) {
      console.error("Check-in failed:", error);
      alert(" Lỗi khi check-in!");
    } finally {
      setUpdating(null);
    }
  };

  const handleCheckOut = async (id: number) => {
    try {
      setUpdating(id);
      await api.put(`/bookings/${id}/dates`, {
        checkOutDate: new Date().toISOString(),
        status: "COMPLETED",
      });
      alert(" Check-out thành công!");
      fetchBookings();
    } catch (error) {
      console.error("Check-out failed:", error);
      alert(" Lỗi khi check-out!");
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold mb-6 text-gray-800">
        Hotel Bookings
      </h1>

      {loading ? (
        <div className="flex items-center justify-center py-10 text-gray-500">
          <Loader2 className="animate-spin w-6 h-6 mr-2" />
          Đang tải dữ liệu...
        </div>
      ) : (
        <div className="overflow-x-auto shadow-md rounded-lg border border-gray-200 bg-white">
          <table className="w-full text-sm text-gray-700">
            <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
              <tr>
                <th className="p-3 text-left">Slot ID</th>
                <th className="p-3 text-left">Thú cưng</th>
                <th className="p-3 text-left">Khách hàng</th>
                <th className="p-3 text-left">Ngày bắt đầu</th>
                <th className="p-3 text-left">Ngày kết thúc</th>
                <th className="p-3 text-left">Check-in</th>
                <th className="p-3 text-left">Check-out</th>
                <th className="p-3 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b, index) => (
                <tr
                  key={b.id}
                  className={`border-t ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-pink-50 transition-colors duration-150`}
                >
                  <td className="p-3 font-medium text-gray-800">
                    {b.slotId ?? "-"}
                  </td>
                  <td className="p-3">{b.pet?.name ?? "-"}</td>
                  <td className="p-3">
                    {b.customer
                      ? `${b.customer.firstName} ${b.customer.lastName}`
                      : "-"}
                  </td>
                  <td className="p-3">{formatDate(b.slot?.startDate)}</td>
                  <td className="p-3">{formatDate(b.slot?.endDate)}</td>
                  <td className="p-3">{formatDateTime(b.checkInDate)}</td>
                  <td className="p-3">{formatDateTime(b.checkOutDate)}</td>
                  <td className="p-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleCheckIn(b.id)}
                        disabled={updating === b.id}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-md text-xs font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Check-in
                      </button>
                      <button
                        onClick={() => handleCheckOut(b.id)}
                        disabled={updating === b.id}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-md text-xs font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Check-out
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {bookings.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="text-center text-gray-500 py-6 italic"
                  >
                    Không có dữ liệu đặt phòng nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
