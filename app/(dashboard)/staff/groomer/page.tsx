/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import api from "@/config/axios";
import type { Booking, Groomer } from "@/components/models/booking";
import { Loader2, CheckCircle2 } from "lucide-react";

export default function GroomerConfirmedPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [groomers, setGroomers] = useState<Groomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editing, setEditing] = useState<Record<number, boolean>>({});
  const [selection, setSelection] = useState<Record<number, number | "">>({});
  const [assigningId, setAssigningId] = useState<number | null>(null);

  async function fetchConfirmedBookings() {
    const res = await api.get<Booking[]>("/bookings/staff/confirmed", {
      headers: { "Cache-Control": "no-cache" },
    });

    return (Array.isArray(res.data) ? res.data : []).filter(
      (b) => b.status === "CONFIRMED"
    );
  }

  async function fetchGroomers() {
    const res = await api.get<Groomer[]>("/bookings/groomers", {
      headers: { "Cache-Control": "no-cache" },
    });
    return Array.isArray(res.data) ? res.data : [];
  }

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const [bookingsData, groomersData] = await Promise.all([
          fetchConfirmedBookings(),
          fetchGroomers(),
        ]);
        if (!mounted) return;
        setBookings(bookingsData);
        setGroomers(groomersData);
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

  const displayGroomerName = (g?: Groomer | null) =>
    g ? `${g.firstName ?? ""} ${g.lastName ?? ""}`.trim() || "—" : "—";

  // Chọn || Đổi Groomer cho booking
  async function assignGroomer(bookingId: number) {
    const groomerId = selection[bookingId];
    if (!groomerId || typeof groomerId !== "number") {
      alert("Vui lòng chọn groomer.");
      return;
    }

    try {
      setAssigningId(bookingId);
      await api.put(`/bookings/${bookingId}/assign`, { groomerId });

      // Cập nhật local state
      const assigned = groomers.find((g) => g.id === groomerId) || null;
      setBookings((prev) =>
        prev.map((b) =>
          b.id === bookingId ? ({ ...b, groomer: assigned } as any) : b
        )
      );

      // Reset trạng thái
      setEditing((s) => ({ ...s, [bookingId]: false }));
      setSelection((s) => {
        const next = { ...s };
        delete next[bookingId];
        return next;
      });
    } catch (e: any) {
      alert(e?.response?.data?.message || e?.message || "Phân công thất bại");
    } finally {
      setAssigningId(null);
    }
  }

  return (
    <div className="space-y-6">
      {/* Tiêu đề trang */}
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">
          Đơn đã được xác nhận
        </h1>
      </header>

      {/* Loading */}
      {loading && (
        <div className="flex items-center gap-2 p-4 rounded-lg border bg-white text-gray-600 shadow-sm">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Đang tải danh sách...</span>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="p-4 rounded-lg border bg-red-50 text-red-700 text-sm">
          Lỗi tải dữ liệu: {error}
        </div>
      )}

      {/* Table hiển thị dữ liệu */}
      {!loading && !error && (
        <div className="overflow-hidden rounded-xl border bg-white shadow-md">
          <table className="min-w-full text-sm">
            <thead className="bg-gradient-to-r from-pink-100 to-pink-50 text-gray-700">
              <tr className="text-left">
                <th className="px-4 py-3 font-semibold w-[80px]">ID</th>
                <th className="px-4 py-3 font-semibold">Thú cưng</th>
                <th className="px-4 py-3 font-semibold">Khách hàng</th>
                <th className="px-4 py-3 font-semibold">Dịch vụ</th>
                <th className="px-4 py-3 font-semibold text-center">
                  Trạng thái
                </th>
                <th className="px-4 py-3 font-semibold">Groomer</th>
                <th className="px-4 py-3 font-semibold w-[200px] text-center">
                  Thao tác
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {bookings.map((b) => {
                const serviceNames =
                  b.combo?.serviceLinks?.map((sl) => sl.service?.name) ?? [];
                const isEditing = !!editing[b.id];
                const hasGroomer = !!b.groomer;

                return (
                  <tr
                    key={b.id}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-4 py-3 font-medium text-gray-800">
                      {b.id}
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
                      {b.combo ? (
                        <span className="line-clamp-1">
                          {b.combo.name}
                          {serviceNames.length
                            ? " • " + serviceNames.join(" • ")
                            : ""}
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>

                    {/* Trạng thái */}
                    <td className="px-4 py-3 text-center">
                      <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {b.status}
                      </span>
                    </td>

                    {/* Groomer */}
                    <td className="px-4 py-3">
                      {isEditing ? (
                        <select
                          className="w-full rounded-md border px-2 py-1 text-sm focus:ring-2 focus:ring-pink-300"
                          value={
                            selection[b.id] ?? (b.groomer as any)?.id ?? ""
                          }
                          onChange={(e) =>
                            setSelection((s) => ({
                              ...s,
                              [b.id]: Number(e.target.value),
                            }))
                          }
                        >
                          <option value="">— Chọn groomer —</option>
                          {groomers.map((g) => (
                            <option key={g.id} value={g.id}>
                              {displayGroomerName(g)}
                            </option>
                          ))}
                        </select>
                      ) : hasGroomer ? (
                        <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-700">
                          {displayGroomerName(b.groomer as any)}
                        </span>
                      ) : (
                        <span className="text-gray-400 italic">
                          Chưa phân công
                        </span>
                      )}
                    </td>

                    {/* Thao tác */}
                    <td className="px-4 py-3 text-center">
                      {isEditing ? (
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => assignGroomer(b.id)}
                            disabled={!selection[b.id] || assigningId === b.id}
                            className="rounded-lg bg-pink-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-pink-700 disabled:opacity-60"
                          >
                            {assigningId === b.id ? "Đang lưu..." : "Lưu"}
                          </button>
                          <button
                            onClick={() => {
                              setEditing((s) => ({ ...s, [b.id]: false }));
                              setSelection((s) => {
                                const next = { ...s };
                                delete next[b.id];
                                return next;
                              });
                            }}
                            className="rounded-lg border px-3 py-1.5 text-xs hover:bg-gray-50"
                          >
                            Hủy
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setEditing((s) => ({ ...s, [b.id]: true }));
                            const currentId = (b.groomer as any)?.id;
                            setSelection((s) => ({
                              ...s,
                              [b.id]: currentId ?? "",
                            }));
                          }}
                          className="rounded-lg border px-3 py-1.5 text-xs hover:bg-gray-50"
                        >
                          {hasGroomer ? "Đổi groomer" : "Phân công"}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}

              {!bookings.length && (
                <tr>
                  <td
                    className="px-4 py-8 text-center text-gray-500"
                    colSpan={7}
                  >
                    Chưa có đơn nào được xác nhận.
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
