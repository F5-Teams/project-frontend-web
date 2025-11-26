/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import api from "@/config/axios";
import type { Booking } from "@/components/models/booking";
import { toast } from "sonner";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { Loader2 } from "lucide-react";

/* ---------------------- DayJS config ---------------------- */
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("Asia/Ho_Chi_Minh");

/* ---------------------- Format helpers ---------------------- */
const formatDateTime = (date: string | null | undefined) => {
  if (!date) return "-";
  return dayjs(date).tz().format("DD/MM/YYYY HH:mm");
};

const formatDate = (date: string | null | undefined) => {
  if (!date) return "-";
  return dayjs(date).tz().format("DD/MM/YYYY");
};

/* ---------------------- Avatar helpers ---------------------- */
function getInitials(firstName?: string, lastName?: string) {
  const f = firstName?.trim() ?? "";
  const l = lastName?.trim() ?? "";
  if (!f && !l) return "?";
  return `${f[0]?.toUpperCase() || ""}${l[0]?.toUpperCase() || ""}`;
}

function CustomerAvatar({
  customer,
  size = 56,
}: {
  customer?: {
    firstName?: string;
    lastName?: string;
    avatar?: string | null;
  } | null;
  size?: number;
}) {
  const [imgError, setImgError] = useState(false);
  const initials = getInitials(customer?.firstName, customer?.lastName);

  if (customer?.avatar && !imgError) {
    return (
      <img
        src={customer.avatar}
        alt="avatar"
        onError={() => setImgError(true)}
        className="rounded-full object-cover border-2 border-pink-100 shadow-sm"
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div
      className="flex items-center justify-center rounded-full bg-pink-50 border-2 border-pink-100 font-semibold text-pink-700 shadow-sm"
      style={{ width: size, height: size }}
    >
      {initials}
    </div>
  );
}

/*  CHECK-IN: Không cho phép trước ngày bắt đầu */
const canCheckIn = (b: Booking) => {
  if (b.status === "PENDING" || b.checkInDate) return false;
  const today = dayjs().startOf("day");
  const start = dayjs(b.slot?.startDate).startOf("day");
  return today.isSame(start) || today.isAfter(start);
};

/* CHECK-OUT: Chỉ khi đã check-in */
const canCheckOut = (b: Booking) => !!b.checkInDate && !b.checkOutDate;

export default function HotelBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<number | null>(null);

  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [checkoutBookingId, setCheckoutBookingId] = useState<number | null>(
    null
  );

  const [pickupInfo, setPickupInfo] = useState({
    pickupPersonName: "",
    pickupPersonPhone: "",
    pickupPersonRelationship: "",
    verificationNotes: "",
  });

  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailBooking, setDetailBooking] = useState<Booking | null>(null);

  /* ---------------------- FETCH DATA ---------------------- */
  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await api.get("/bookings/staff/confirmed");
      const filtered = res.data.filter(
        (b: Booking) => b.status !== "CANCELLED"
      );
      setBookings(filtered);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------------- HANDLE CHECK-IN ---------------------- */
  const handleCheckIn = async (id: number) => {
    const booking = bookings.find((b) => b.id === id);
    if (!booking) {
      toast("Không tìm thấy đơn.");
      return;
    }

    if (!canCheckIn(booking)) {
      toast("Chưa đến ngày bắt đầu, không thể check-in.");
      return;
    }

    try {
      setUpdating(id);
      await api.put(`/bookings/${id}/dates`, {
        checkInDate: new Date().toISOString(),
      });
      toast("Check-in thành công!");
      fetchBookings();
    } catch {
      toast("Lỗi khi check-in!");
    } finally {
      setUpdating(null);
    }
  };

  /* ---------------------- HANDLE QUICK CHECK-OUT ---------------------- */
  const handleQuickCheckout = async (id: number) => {
    const booking = bookings.find((b) => b.id === id);
    if (!booking) {
      toast("Không tìm thấy đơn.");
      return;
    }

    if (!canCheckOut(booking)) {
      toast("Chưa check-in nên không thể check-out.");
      return;
    }

    try {
      setUpdating(id);
      await api.put(`/bookings/${id}/dates`, {
        checkOutDate: new Date().toISOString(),
      });
      toast("Check-out thành công!");
      fetchBookings();
    } catch {
      toast("Lỗi khi check-out!");
    } finally {
      setUpdating(null);
    }
  };

  /* ---------------------- OPEN MODAL CHECK-OUT CÓ NGƯỜI ĐÓN ---------------------- */
  const openCheckoutModal = (booking: Booking) => {
    if (!canCheckOut(booking)) {
      toast("Chưa check-in nên không thể nhập thông tin người đón.");
      return;
    }

    setCheckoutBookingId(booking.id);
    setPickupInfo({
      pickupPersonName: booking.pickupPersonName || "",
      pickupPersonPhone: booking.pickupPersonPhone || "",
      pickupPersonRelationship: booking.pickupPersonRelationship || "",
      verificationNotes: booking.verificationNotes || "",
    });

    setShowCheckoutModal(true);
  };

  const handleConfirmCheckout = async () => {
    if (!checkoutBookingId) return;

    try {
      setUpdating(checkoutBookingId);
      await api.put(`/bookings/${checkoutBookingId}/dates`, {
        checkOutDate: new Date().toISOString(),
        ...pickupInfo,
      });

      toast("Check-out thành công!");
      setShowCheckoutModal(false);
      fetchBookings();
    } catch {
      toast("Lỗi khi check-out!");
    } finally {
      setUpdating(null);
    }
  };

  /* ---------------------- DETAIL MODAL ---------------------- */
  const openDetailModal = (booking: Booking) => {
    setDetailBooking(booking);
    setShowDetailModal(true);
  };

  /* ---------------------- RENDER UI ---------------------- */
  return (
    <div className="p-8 min-h-screen bg-gradient-to-b from-pink-50 to-white">
      <h1 className="text-3xl font-medium mb-8">Check in / Check out</h1>

      {loading ? (
        <div className="flex items-center justify-center py-10 text-gray-500">
          <Loader2 className="animate-spin w-6 h-6 mr-2" /> Đang tải dữ liệu...
        </div>
      ) : (
        <div className="overflow-x-auto shadow-lg rounded-2xl border border-pink-100 bg-white">
          <table className="w-full text-sm text-gray-700">
            <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
              <tr>
                <th className="p-3 text-left">Slot ID</th>
                <th className="p-3 text-left">Thú cưng</th>
                <th className="p-3 text-left">Khách hàng</th>
                <th className="p-3 text-left">Bắt đầu</th>
                <th className="p-3 text-left">Kết thúc</th>
                <th className="p-3 text-left">Check-in</th>
                <th className="p-3 text-left">Check-out</th>
                <th className="p-3 text-center">Hành động</th>
              </tr>
            </thead>

            <tbody>
              {bookings.map((b, idx) => (
                <tr
                  key={b.id}
                  className={`border-t ${
                    idx % 2 ? "bg-gray-50" : "bg-white"
                  } hover:bg-pink-50`}
                >
                  <td className="p-3 font-medium">{b.slotId ?? "-"}</td>
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

                  {/* ACTION BUTTONS */}
                  <td className="p-3 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <button
                        onClick={() => handleCheckIn(b.id)}
                        disabled={!canCheckIn(b) || updating === b.id}
                        className="w-28 bg-green-500 text-white px-3 py-1.5 rounded-xl text-xs font-semibold disabled:opacity-50 hover:bg-green-600"
                      >
                        Check-in
                      </button>

                      <button
                        onClick={() => handleQuickCheckout(b.id)}
                        disabled={!canCheckOut(b) || updating === b.id}
                        className="w-28 bg-blue-400 text-white px-3 py-1.5 rounded-xl text-xs font-semibold disabled:opacity-50 hover:bg-blue-600"
                      >
                        Check-out
                      </button>

                      <button
                        onClick={() => openCheckoutModal(b)}
                        disabled={!canCheckOut(b) || updating === b.id}
                        className="w-28 border border-pink-300 text-pink-700 px-3 py-1.5 rounded-xl text-xs hover:bg-gray-200"
                      >
                        Nhập người đón
                      </button>

                      <button
                        onClick={() => openDetailModal(b)}
                        className="w-28 border border-pink-300 text-pink-700 px-3 py-1.5 rounded-xl text-xs hover:bg-gray-200"
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
                    className="text-center py-6 text-gray-500 italic"
                  >
                    Không có dữ liệu đặt phòng nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* MODAL CHECKOUT WITH PICKUP INFO */}
      {showCheckoutModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md border border-pink-200 shadow-xl">
            <h2 className="text-xl font-medium mb-6">
              Thông tin người đón thú cưng
            </h2>

            <div className="space-y-4 text-sm">
              {[
                { field: "pickupPersonName", label: "Tên người đón" },
                {
                  field: "pickupPersonPhone",
                  label: "Số điện thoại người đón",
                },
                {
                  field: "pickupPersonRelationship",
                  label: "Mối quan hệ với thú cưng",
                },
              ].map(({ field, label }, i) => (
                <div key={i}>
                  <label className="font-medium">{label}</label>
                  <input
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-xl bg-pink-50/30 focus:ring-2 focus:ring-pink-300 focus:border-pink-500 outline-none transition"
                    value={(pickupInfo as any)[field]}
                    onChange={(e) =>
                      setPickupInfo((p) => ({
                        ...p,
                        [field]: e.target.value,
                      }))
                    }
                  />
                </div>
              ))}

              <div>
                <label className="font-medium">Ghi chú xác minh</label>
                <textarea
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-xl bg-pink-50/30 focus:ring-2 focus:ring-pink-300 focus:border-pink-500 outline-none transition"
                  rows={3}
                  value={pickupInfo.verificationNotes}
                  onChange={(e) =>
                    setPickupInfo((p) => ({
                      ...p,
                      verificationNotes: e.target.value,
                    }))
                  }
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <button
                onClick={() => setShowCheckoutModal(false)}
                className="px-5 py-2 border rounded-xl text-pink-700"
              >
                Hủy
              </button>

              <button
                onClick={handleConfirmCheckout}
                disabled={updating === checkoutBookingId}
                className="px-5 py-2 bg-pink-500 text-white rounded-xl"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DETAIL */}
      {showDetailModal && detailBooking && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 w-full max-w-2xl border border-pink-200 shadow-xl">
            <div className="flex items-center gap-4 mb-6">
              <CustomerAvatar customer={detailBooking.customer} size={64} />
              <div>
                <h2 className="text-2xl font-bold text-pink-700">
                  {detailBooking.pet?.name}
                </h2>
                <p className="text-gray-600">
                  {detailBooking.customer
                    ? `${detailBooking.customer.firstName} ${detailBooking.customer.lastName}`
                    : "-"}
                </p>
                <p className="text-sm text-gray-500">
                  {detailBooking.customer?.phoneNumber ?? "-"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-700">
              <div>
                <p className="font-semibold text-pink-600">Check-in</p>
                <p>{formatDateTime(detailBooking.checkInDate)}</p>
              </div>

              <div>
                <p className="font-semibold text-pink-600">Check-out</p>
                <p>{formatDateTime(detailBooking.checkOutDate)}</p>
              </div>

              <div className="flex gap-2">
                <span className="font-semibold text-pink-600">Dịch vụ:</span>
                <span>
                  {detailBooking.Room || detailBooking.roomId
                    ? `${
                        detailBooking.Room?.name
                          ? `  ${detailBooking.Room.name}`
                          : ""
                      }`
                    : detailBooking.combo || detailBooking.comboId
                    ? detailBooking.combo?.serviceLinks &&
                      detailBooking.combo.serviceLinks.length > 0
                      ? detailBooking.combo.serviceLinks[0].service.name
                      : detailBooking.combo?.name ?? ""
                    : "-"}
                </span>
              </div>

              <div>
                <p className="font-semibold text-pink-600">Ghi chú của chủ:</p>
                <p>{detailBooking.note}</p>
              </div>

              <div>
                <p className="font-semibold text-pink-600">Người đón</p>
                <p>{detailBooking.pickupPersonName || "-"}</p>
              </div>

              <div>
                <p className="font-semibold text-pink-600">SĐT người đón</p>
                <p>{detailBooking.pickupPersonPhone || "-"}</p>
              </div>

              <div className="md:col-span-2">
                <p className="font-semibold text-pink-600">Mối quan hệ</p>
                <p>{detailBooking.pickupPersonRelationship || "-"}</p>
              </div>

              <div className="md:col-span-2">
                <p className="font-semibold text-pink-600">Ghi chú xác minh</p>
                <p className="whitespace-pre-line">
                  {detailBooking.verificationNotes || "Không có"}
                </p>
              </div>
            </div>

            <div className="flex justify-end mt-8">
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-6 py-2 border rounded-xl text-pink-700"
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
