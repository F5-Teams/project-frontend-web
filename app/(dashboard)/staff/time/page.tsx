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

interface PickupInfo {
  pickupPersonName: string;
  pickupPersonPhone: string;
  pickupPersonRelationship: string;
  verificationNotes: string;
}

export default function HotelBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<number | null>(null);

  // modal nhập thông tin người đón khi check-out
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [checkoutBookingId, setCheckoutBookingId] = useState<number | null>(
    null
  );
  const [pickupInfo, setPickupInfo] = useState<PickupInfo>({
    pickupPersonName: "",
    pickupPersonPhone: "",
    pickupPersonRelationship: "",
    verificationNotes: "",
  });

  // modal xem chi tiết
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailBooking, setDetailBooking] = useState<Booking | null>(null);

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
      alert("Check-in thành công!");
      fetchBookings();
    } catch (error) {
      console.error("Check-in failed:", error);
      alert("Lỗi khi check-in!");
    } finally {
      setUpdating(null);
    }
  };

  // mở modal nhập người đón trước khi check-out
  const openCheckoutModal = (booking: Booking) => {
    setCheckoutBookingId(booking.id);
    setPickupInfo({
      pickupPersonName: booking.pickupPersonName || "",
      pickupPersonPhone: booking.pickupPersonPhone || "",
      pickupPersonRelationship: booking.pickupPersonRelationship || "",
      verificationNotes: booking.verificationNotes || "",
    });
    setShowCheckoutModal(true);
  };

  const closeCheckoutModal = () => {
    setShowCheckoutModal(false);
    setCheckoutBookingId(null);
  };

  const handleConfirmCheckout = async () => {
    if (!checkoutBookingId) return;

    // có thể thêm validate ở đây (bắt buộc nhập tên, sđt, ...)
    try {
      setUpdating(checkoutBookingId);
      await api.put(`/bookings/${checkoutBookingId}/dates`, {
        checkOutDate: new Date().toISOString(),
        status: "COMPLETED",
        pickupPersonName: pickupInfo.pickupPersonName,
        pickupPersonPhone: pickupInfo.pickupPersonPhone,
        pickupPersonRelationship: pickupInfo.pickupPersonRelationship,
        verificationNotes: pickupInfo.verificationNotes,
      });
      alert("Check-out thành công!");
      closeCheckoutModal();
      fetchBookings();
    } catch (error) {
      console.error("Check-out failed:", error);
      alert("Lỗi khi check-out!");
    } finally {
      setUpdating(null);
    }
  };

  // xem chi tiết booking (bao gồm người đón, sđt, quan hệ, notes)
  const openDetailModal = (booking: Booking) => {
    setDetailBooking(booking);
    setShowDetailModal(true);
  };

  const closeDetailModal = () => {
    setShowDetailModal(false);
    setDetailBooking(null);
  };

  return (
    <div className="p-8 min-h-screen bg-gradient-to-b from-pink-50 to-white">
      <h1 className="text-3xl font-medium mb-8 text-black-700 tracking-wide flex items-center gap-3">
        Check in / Check out phòng khách sạn
      </h1>

      {loading ? (
        <div className="flex items-center justify-center py-10 text-gray-500">
          <Loader2 className="animate-spin w-6 h-6 mr-2" />
          Đang tải dữ liệu...
        </div>
      ) : (
        <div className="overflow-x-auto shadow-lg rounded-2xl border border-pink-100 bg-white">
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
                    <div className="flex flex-col items-center gap-2">
                      <button
                        onClick={() => handleCheckIn(b.id)}
                        disabled={updating === b.id}
                        className="w-28 flex gap-1 items-center justify-center bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-xl text-xs font-semibold shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Check-in
                      </button>
                      <button
                        onClick={() => openCheckoutModal(b)}
                        disabled={updating === b.id}
                        className="w-28 flex gap-1 items-center justify-center bg-blue-400 hover:bg-blue-500 text-white px-3 py-1.5 rounded-xl text-xs font-semibold shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Check-out
                      </button>
                      <button
                        onClick={() => openDetailModal(b)}
                        className="w-28 flex gap-1 items-center justify-center border border-pink-300 text-pink-700 px-3 py-1.5 rounded-xl text-xs font-medium hover:bg-pink-100 transition"
                      >
                        Xem chi tiết
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

      {/* Modal nhập thông tin người đón trước khi check-out */}
      {showCheckoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 border border-pink-200 animate-fadeIn">
            <h2 className="text-xl font-medium text-black-600 mb-6 flex items-center gap-2">
              Thông tin người đón thú cưng
            </h2>

            <div className="space-y-4 text-sm text-gray-700">
              <div>
                <label className="block font-medium text-black-600 mb-1">
                  Tên người đón
                </label>
                <input
                  type="text"
                  className="w-full border border-pink-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400 bg-pink-50/30"
                  value={pickupInfo.pickupPersonName}
                  placeholder="Nhập họ và tên"
                  onChange={(e) =>
                    setPickupInfo((prev) => ({
                      ...prev,
                      pickupPersonName: e.target.value,
                    }))
                  }
                />
              </div>

              <div>
                <label className="block font-medium text-black-600 mb-1">
                  Số điện thoại người đón
                </label>
                <input
                  type="tel"
                  className="w-full border border-pink-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400 bg-pink-50/30"
                  value={pickupInfo.pickupPersonPhone}
                  placeholder="VD: 09xxxxxxxx"
                  onChange={(e) =>
                    setPickupInfo((prev) => ({
                      ...prev,
                      pickupPersonPhone: e.target.value,
                    }))
                  }
                />
              </div>

              <div>
                <label className="block font-medium text-black-600 mb-1">
                  Mối quan hệ với chủ
                </label>
                <input
                  type="text"
                  className="w-full border border-pink-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400 bg-pink-50/30"
                  value={pickupInfo.pickupPersonRelationship}
                  placeholder="VD: Chủ, Người nhà, Bạn bè..."
                  onChange={(e) =>
                    setPickupInfo((prev) => ({
                      ...prev,
                      pickupPersonRelationship: e.target.value,
                    }))
                  }
                />
              </div>

              <div>
                <label className="block font-medium text-black-600 mb-1">
                  Ghi chú xác minh
                </label>
                <textarea
                  className="w-full border border-pink-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400 bg-pink-50/30"
                  rows={3}
                  value={pickupInfo.verificationNotes}
                  placeholder="VD: Đã kiểm tra CMND/CCCD, giống thông tin trong hệ thống..."
                  onChange={(e) =>
                    setPickupInfo((prev) => ({
                      ...prev,
                      verificationNotes: e.target.value,
                    }))
                  }
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <button
                onClick={closeCheckoutModal}
                className="px-5 py-2 rounded-xl border border-pink-400 text-pink-700 font-semibold hover:bg-pink-100 transition shadow-sm"
              >
                Hủy
              </button>

              <button
                onClick={handleConfirmCheckout}
                disabled={updating === checkoutBookingId}
                className="px-5 py-2 rounded-xl bg-pink-500 text-white font-semibold hover:bg-pink-600 transition shadow disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {updating === checkoutBookingId
                  ? " Đang xử lý..."
                  : " Xác nhận check-out"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal xem chi tiết booking */}
      {showDetailModal && detailBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-8 border border-pink-200 animate-fadeIn">
            <h2 className="text-2xl font-bold text-pink-700 mb-6">
              Chi tiết booking
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-5 gap-x-10 text-gray-700 text-sm">
              {/* Pet */}
              <div>
                <p className="font-semibold text-pink-600"> Thú cưng</p>
                <p className="mt-1">{detailBooking.pet?.name ?? "-"}</p>
              </div>

              {/* Customer */}
              <div>
                <p className="font-semibold text-pink-600"> Khách hàng</p>
                <p className="mt-1">
                  {detailBooking.customer
                    ? `${detailBooking.customer.firstName} ${detailBooking.customer.lastName}`
                    : "-"}
                </p>
              </div>

              {/* Status */}
              <div>
                <p className="font-semibold text-pink-600"> Trạng thái</p>
                <span className="inline-block px-3 py-1 mt-1 rounded-lg text-xs font-bold bg-pink-100 text-pink-700">
                  {detailBooking.status ?? "-"}
                </span>
              </div>

              {/* Check-in */}
              <div>
                <p className="font-semibold text-pink-600"> Check-in</p>
                <p className="mt-1">
                  {formatDateTime(detailBooking.checkInDate)}
                </p>
              </div>

              {/* Check-out */}
              <div>
                <p className="font-semibold text-pink-600"> Check-out</p>
                <p className="mt-1">
                  {formatDateTime(detailBooking.checkOutDate)}
                </p>
              </div>

              {/* Pickup Person */}
              <div>
                <p className="font-semibold text-pink-600"> Người đón</p>
                <p className="mt-1">{detailBooking.pickupPersonName || "-"}</p>
              </div>

              <div>
                <p className="font-semibold text-pink-600"> SĐT người đón</p>
                <p className="mt-1">{detailBooking.pickupPersonPhone || "-"}</p>
              </div>

              {/* Relationship */}
              <div className="md:col-span-2">
                <p className="font-semibold text-pink-600"> Mối quan hệ</p>
                <p className="mt-1">
                  {detailBooking.pickupPersonRelationship || "-"}
                </p>
              </div>

              {/* Verify Note */}
              <div className="md:col-span-2">
                <p className="font-semibold text-pink-600">Ghi chú xác minh</p>
                <p className="mt-1 whitespace-pre-line">
                  {detailBooking.verificationNotes || "Không có"}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 flex justify-end">
              <button
                onClick={closeDetailModal}
                className="px-6 py-2 rounded-xl border border-pink-400 text-pink-700 font-semibold hover:bg-pink-100 transition shadow-sm"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
