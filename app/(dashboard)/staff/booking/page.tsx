/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, Fragment } from "react";
import { useRouter } from "next/navigation";
import api from "@/config/axios";
import type { Booking } from "@/components/models/booking";
import { Loader2, ChevronDown, ChevronUp, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BookingPendingPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [confirmingId, setConfirmingId] = useState<number | null>(null);

  const router = useRouter();

  const formatMoney = (v: string | number | null | undefined) =>
    v == null ? "—" : `${Intl.NumberFormat("vi-VN").format(Number(v))}₫`;

  const fetchPendingBookings = async () => {
    const res = await api.get<Booking[]>("/bookings/staff/pending", {
      headers: { "Cache-Control": "no-cache" },
    });
    const onlyPending = (Array.isArray(res.data) ? res.data : []).filter(
      (b) => b.status === "PENDING"
    );
    setBookings(onlyPending);
  };

  /** Tải dữ liệu khi trang được gọi API */
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        await fetchPendingBookings();
      } catch (e: any) {
        if (!mounted) return;
        setError(e?.response?.data?.message || e?.message || "Lỗi tải dữ liệu");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  async function handleConfirmBooking(id: number) {
    try {
      setConfirmingId(id);
      await api.put(`/bookings/${id}/status`, { status: "CONFIRMED" });

      // Cập nhật lại danh sách sau khi xác nhận
      setBookings((prev) => prev.filter((b) => b.id !== id));

      if (expandedId === id) setExpandedId(null);

      await fetchPendingBookings();

      router.push("/staff/groomer");
    } catch (e: any) {
      const msg =
        e?.response?.data?.message || e?.message || "Xác nhận thất bại";
      alert(msg);
      await fetchPendingBookings();
    } finally {
      setConfirmingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold poppins text-gray-800">
          Đơn chờ xác nhận
        </h1>
      </header>

      {loading && (
        <div className="flex items-center gap-2 p-4 border rounded-lg bg-white text-gray-600">
          <Loader2 className="w-4 h-4 animate-spin" />
          Đang tải danh sách...
        </div>
      )}

      {error && (
        <div className="p-4 rounded-lg border bg-red-50 text-red-700 text-sm">
          Lỗi tải dữ liệu: {error}
        </div>
      )}

      {/* Bảng hiển thị danh sách */}
      {!loading && !error && (
        <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
          <table className="min-w-full text-sm">
            <thead className="bg-pink-100/70 text-gray-700">
              <tr className="text-left">
                <th className="px-4 py-3 w-[80px] font-semibold">ID</th>
                <th className="px-4 py-3 font-semibold">Thú cưng</th>
                <th className="px-4 py-3 font-semibold">Khách hàng</th>
                <th className="px-4 py-3 font-semibold">Dịch vụ</th>
                <th className="px-4 py-3 font-semibold w-[150px] text-center">
                  Thao tác
                </th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {bookings.map((b) => {
                const serviceNames =
                  b.combo?.serviceLinks?.map((sl) => sl.service?.name) ?? [];

                return (
                  <Fragment key={b.id}>
                    <tr className="hover:bg-gray-50 transition">
                      <td className="px-4 py-3 font-medium text-gray-800">
                        #{b.id}
                      </td>
                      <td className="px-4 py-3">{b.pet?.name ?? "—"}</td>
                      <td className="px-4 py-3">
                        {b.customer?.lastName
                          ? `${b.customer.firstName ?? ""} ${
                              b.customer.lastName ?? ""
                            }`
                          : b.customer?.firstName ?? "—"}
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        {serviceNames.length ? serviceNames.join(" • ") : "—"}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Button
                          size="sm"
                          variant="default"
                          className="bg-pink-500 hover:bg-pink-600 text-white"
                          onClick={() =>
                            setExpandedId(expandedId === b.id ? null : b.id)
                          }
                        >
                          {expandedId === b.id ? (
                            <>
                              Ẩn chi tiết <ChevronUp className="w-4 h-4 ml-1" />
                            </>
                          ) : (
                            <>
                              Xem chi tiết{" "}
                              <ChevronDown className="w-4 h-4 ml-1" />
                            </>
                          )}
                        </Button>
                      </td>
                    </tr>

                    {/* Chi tiết booking khi mở rộng */}
                    {expandedId === b.id && (
                      <tr className="bg-gray-50/70">
                        <td colSpan={5} className="p-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                            {/* Cột 1 - Thông tin cơ bản */}
                            <div className="space-y-2">
                              <p>
                                <strong>Mã đơn:</strong> #{b.id}
                              </p>
                              <p>
                                <strong>Ngày tạo:</strong>{" "}
                                {new Date(b.createdAt ?? "").toLocaleString(
                                  "vi-VN"
                                )}
                              </p>
                              <p>
                                <strong>Thời gian hẹn:</strong>{" "}
                                {b.bookingDate
                                  ? new Date(b.bookingDate).toLocaleString(
                                      "vi-VN"
                                    )
                                  : "—"}
                              </p>
                              <p>
                                <strong>Trạng thái:</strong>{" "}
                                <span className="text-yellow-600 font-medium">
                                  {b.status === "PENDING"
                                    ? "Đang chờ xác nhận"
                                    : b.status === "CONFIRMED"
                                    ? "Đã xác nhận"
                                    : b.status}
                                </span>
                              </p>
                            </div>

                            {/* Cột 2 - Thông tin khách hàng và thú cưng */}
                            <div className="space-y-2">
                              <p>
                                <strong>Khách hàng:</strong>{" "}
                                {b.customer
                                  ? `${b.customer.firstName ?? ""} ${
                                      b.customer.lastName ?? ""
                                    }`.trim()
                                  : "—"}
                              </p>
                              <p>
                                <strong>Số điện thoại:</strong>{" "}
                                {b.customer?.phoneNumber || "—"}
                              </p>

                              <p>
                                <strong>Thú cưng:</strong>{" "}
                                {b.pet
                                  ? `${b.pet.name} (${b.pet.species})`
                                  : "—"}
                              </p>
                            </div>
                          </div>

                          {/* Dịch vụ */}
                          <div className="mt-4">
                            <strong>Dịch vụ:</strong>{" "}
                            {b.combo?.serviceLinks?.length ? (
                              <ul className="list-disc list-inside text-gray-700 mt-1">
                                {b.combo.serviceLinks.map((sl, idx) => (
                                  <li key={idx}>
                                    {sl.service?.name} —{" "}
                                    {formatMoney(sl.service?.price)}
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-gray-500 italic">
                                Không có dịch vụ
                              </p>
                            )}
                          </div>

                          {/* Tổng tiền + ghi chú + nút xác nhận */}
                          <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                            <div className="space-y-1 text-gray-800">
                              <p>
                                <strong>Tổng tiền:</strong>{" "}
                                {formatMoney(b.comboPrice)}
                              </p>
                              <p>
                                <strong>Ghi chú:</strong>{" "}
                                {b.note?.trim() || "Không có ghi chú"}
                              </p>
                            </div>

                            <Button
                              onClick={() => handleConfirmBooking(b.id)}
                              disabled={confirmingId === b.id}
                              className="mt-3 sm:mt-0 bg-green-600 hover:bg-green-700 text-white"
                            >
                              {confirmingId === b.id ? (
                                <>
                                  <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                                  Đang xác nhận...
                                </>
                              ) : (
                                <>
                                  <Check className="w-4 h-4 mr-1" />
                                  Xác nhận đơn
                                </>
                              )}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}

              {!bookings.length && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    Không có đơn nào đang chờ xác nhận.
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
