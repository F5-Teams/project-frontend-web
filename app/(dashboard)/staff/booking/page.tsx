/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, Fragment, useMemo } from "react";
import { useRouter } from "next/navigation";
import api from "@/config/axios";
import type { Booking } from "@/components/models/booking";
import { toast } from "sonner";
import {
  Loader2,
  ChevronDown,
  ChevronUp,
  Check,
  X,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BookingPendingPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [confirmingId, setConfirmingId] = useState<number | null>(null);
  const [cancelingId, setCancelingId] = useState<number | null>(null);

  const [search, setSearch] = useState("");

  const router = useRouter();

  // Format tiền tệ
  const formatMoney = (v: string | number | null | undefined) =>
    v == null ? "—" : `${Intl.NumberFormat("vi-VN").format(Number(v))}₫`;

  const fetchPendingBookings = async () => {
    const res = await api.get<Booking[]>("/bookings/staff/pending", {
      headers: { "Cache-Control": "no-cache" },
    });

    const pendingList = (res.data ?? []).filter((b) => b.status === "PENDING");
    setBookings(pendingList);
  };

  /**
   * Fetch khi load page
   */
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        setError(null);
        await fetchPendingBookings();
      } catch (e: any) {
        if (mounted) setError(e?.response?.data?.message || e.message);
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

      const booking = bookings.find((b) => b.id === id);
      const paymentId = booking?.payments?.[0]?.id ?? null;

      // Cập nhật thanh toán nếu có
      if (paymentId) {
        try {
          await api.put(`/bookings/payments/${paymentId}/status`, {
            status: "PAID",
          });
        } catch (e: any) {
          console.warn("Payment update failed:", e);
          toast(
            e?.response?.data?.message ||
              e.message ||
              "Cập nhật trạng thái thanh toán thất bại"
          );
        }
      }

      // Cập nhật trạng thái booking
      await api.put(`/bookings/${id}/status`, { status: "CONFIRMED" });

      // Xóa khỏi list tạm + đóng detail
      setBookings((prev) => prev.filter((b) => b.id !== id));
      if (expandedId === id) setExpandedId(null);

      await fetchPendingBookings();

      router.push("/staff/groomer");
    } catch (e: any) {
      toast(e?.response?.data?.message || "Xác nhận thất bại");
      await fetchPendingBookings();
    } finally {
      setConfirmingId(null);
    }
  }

  async function handleCancelBooking(id: number) {
    try {
      setCancelingId(id);
      await api.put(`/bookings/${id}/status`, { status: "CANCELLED" });

      setBookings((prev) => prev.filter((b) => b.id !== id));
      if (expandedId === id) setExpandedId(null);

      toast("Hủy đơn thành công");
      await fetchPendingBookings();
    } catch (e: any) {
      toast(e?.response?.data?.message || "Hủy đơn thất bại");
      await fetchPendingBookings();
    } finally {
      setCancelingId(null);
    }
  }

  /**
   * =============================
   *  SEARCH: không phân biệt dấu
   * =============================
   */
  const normalize = (s: string) =>
    (s || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .trim();

  const filteredBookings = useMemo(() => {
    if (!search) return bookings;

    const q = normalize(search);
    return bookings.filter((b) => {
      const fullName = normalize(
        `${b.customer?.firstName ?? ""} ${b.customer?.lastName ?? ""}`
      );
      return fullName.includes(q);
    });
  }, [bookings, search]);

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Đơn chờ xác nhận</h1>
      </header>

      {/* SEARCH BOX */}
      <div className="relative w-full sm:max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Tìm theo tên khách hàng…"
          className="w-full rounded-lg border bg-white pl-9 pr-9 py-2 text-sm focus:outline-none"
        />

        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* LOADING STATE */}
      {loading && (
        <div className="flex items-center gap-2 p-4 border rounded-lg bg-white text-gray-600">
          <Loader2 className="w-4 h-4 animate-spin" /> Đang tải danh sách...
        </div>
      )}

      {/* ERROR */}
      {error && (
        <div className="p-4 rounded-lg border bg-red-50 text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* TABLE */}
      {!loading && !error && (
        <div className="rounded-lg overflow-hidden border bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-3 font-medium text-left">ID</th>
                <th className="px-4 py-3 font-medium text-left">Thú cưng</th>
                <th className="px-4 py-3 font-medium text-left">Khách hàng</th>
                <th className="px-4 py-3 font-medium text-left">Dịch vụ</th>
                <th className="px-4 py-3 font-medium text-center">Thao tác</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {filteredBookings.map((b) => {
                const services =
                  [b.combo?.name, b.Room?.name].filter(Boolean).join(" • ") ||
                  "—";

                const totalPrice =
                  Number(b.comboPrice ?? 0) + Number(b.Room?.price ?? 0);

                return (
                  <Fragment key={b.id}>
                    {/* ROW */}
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">#{b.id}</td>
                      <td className="px-4 py-3">{b.pet?.name || "—"}</td>
                      <td className="px-4 py-3">
                        {`${b.customer?.firstName ?? ""} ${
                          b.customer?.lastName ?? ""
                        }`.trim()}
                      </td>
                      <td className="px-4 py-3">{services}</td>

                      <td className="px-4 py-3 text-center">
                        <div className="flex flex-col items-center justify-center gap-2">
                          {/* Toggle Detail */}
                          <Button
                            size="sm"
                            className="bg-pink-500 hover:bg-pink-600 text-white w-28"
                            onClick={() =>
                              setExpandedId(expandedId === b.id ? null : b.id)
                            }
                          >
                            {expandedId === b.id ? (
                              <>
                                Ẩn chi tiết{" "}
                                <ChevronUp className="w-4 h-4 ml-1" />
                              </>
                            ) : (
                              <>
                                Chi tiết{" "}
                                <ChevronDown className="w-4 h-4 ml-1" />
                              </>
                            )}
                          </Button>

                          {/* CANCEL */}
                          <Button
                            size="sm"
                            className="bg-red-500 hover:bg-red-600 text-white w-28"
                            onClick={() => handleCancelBooking(b.id)}
                            disabled={cancelingId === b.id}
                          >
                            {cancelingId === b.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              "Hủy đơn"
                            )}
                          </Button>
                        </div>
                      </td>
                    </tr>

                    {/* DETAILS */}
                    {expandedId === b.id && (
                      <tr className="bg-gray-50/60">
                        <td colSpan={5} className="p-6">
                          <div className="space-y-2 text-sm text-gray-700">
                            <p>
                              <strong>Dịch vụ:</strong> {services}
                            </p>
                            <p>
                              <strong>Khách hàng:</strong>{" "}
                              {b.customer?.firstName} {b.customer?.lastName}
                            </p>
                            <p>
                              <strong>SĐT:</strong>{" "}
                              {b.customer?.phoneNumber || "—"}
                            </p>
                            <p>
                              <strong>Thú cưng:</strong> {b.pet?.name || "—"}
                            </p>
                            <p>
                              <strong>Tổng tiền:</strong>{" "}
                              {formatMoney(totalPrice)}
                            </p>
                            <p>
                              <strong>Ghi chú:</strong>{" "}
                              {b.note?.trim() || "Không có ghi chú"}
                            </p>
                          </div>

                          <Button
                            onClick={() => handleConfirmBooking(b.id)}
                            disabled={confirmingId === b.id}
                            className="mt-4 bg-green-600 hover:bg-green-700 text-white"
                          >
                            {confirmingId === b.id ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                                Đang xác nhận...
                              </>
                            ) : (
                              <>
                                <Check className="w-4 h-4 mr-1" /> Xác nhận đơn
                              </>
                            )}
                          </Button>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}

              {/* EMPTY STATE */}
              {!filteredBookings.length && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-500">
                    {bookings.length
                      ? "Không có đơn nào khớp với từ khóa."
                      : "Không có đơn chờ xác nhận."}
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
