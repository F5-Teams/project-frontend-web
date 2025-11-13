/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useState } from "react";
import api from "@/config/axios";
import type { Booking, Groomer } from "@/components/models/booking";
import { Loader2, CheckCircle2, UserCheck, Search, X } from "lucide-react";

export default function GroomerConfirmedPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [groomers, setGroomers] = useState<Groomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  // Trạng thái edit từng booking (true = đang sửa)
  const [editing, setEditing] = useState<Record<number, boolean>>({});
  // Lưu lựa chọn groomer tạm thời khi đang sửa
  const [selection, setSelection] = useState<Record<number, number | "">>({});
  // Booking đang thực hiện gọi API phân công (để disable nút lưu)
  const [assigningId, setAssigningId] = useState<number | null>(null);

  // 1. Danh sách những đơn đã xác nhận
  async function fetchConfirmedBookings() {
    const res = await api.get<Booking[]>("/bookings/staff/confirmed", {
      headers: { "Cache-Control": "no-cache" },
    });
    return (res.data ?? []).filter((b) => b.status === "CONFIRMED");
  }

  const translateStatus = (s?: string | null) => {
    if (!s) return "—";
    switch (s) {
      case "CONFIRMED":
        return "Đã xác nhận";
    }
  };

  // 2. Danh sách Groomers
  async function fetchGroomers() {
    const res = await api.get<Groomer[]>("/bookings/groomers", {
      headers: { "Cache-Control": "no-cache" },
    });
    return res.data ?? [];
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
        mounted && setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // 3. Phân công Groomer
  async function assignGroomer(bookingId: number) {
    const groomerId = selection[bookingId];
    if (!groomerId || typeof groomerId !== "number")
      return alert("Hãy chọn groomer.");

    try {
      setAssigningId(bookingId);

      await api.put(`/bookings/${bookingId}/assign`, { groomerId });

      const assigned = groomers.find((g) => g.id === groomerId) || null;

      // 4. CRUD Groomer cho Booking
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, groomer: assigned } : b))
      );

      setEditing((prev) => ({ ...prev, [bookingId]: false }));

      setSelection((prev) => {
        const next = { ...prev };
        delete next[bookingId];
        return next;
      });
    } catch (e: any) {
      alert(e?.response?.data?.message || e?.message || "Phân công thất bại");
    } finally {
      setAssigningId(null);
    }
  }

  // 5. Format hiển thị tên groomer hoặc customer
  const displayName = (p?: { firstName?: string; lastName?: string } | null) =>
    p ? `${p.firstName ?? ""} ${p.lastName ?? ""}`.trim() : "—";

  const normalize = (s: string) =>
    (s || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .replace(/\s+/g, " ")
      .trim();

  // 6. Lọc danh sách theo tên
  const filteredBookings = useMemo(() => {
    if (!search) return bookings;
    const q = normalize(search);
    return bookings.filter((b) =>
      normalize(displayName(b.customer)).includes(q)
    );
  }, [bookings, search]);

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800 tracking-tight">
          Phân công nhân viên
        </h1>
      </header>

      <div className="relative w-full sm:max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Tìm theo tên khách hàng…"
          className="w-full rounded-lg border border-gray-300 bg-white text-gray-900 pl-9 pr-8 py-2 text-sm
               focus:outline-none transition"
        />

        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500 hover:text-red-600 transition"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {loading && (
        <div className="flex items-center gap-2 p-4 rounded-lg border bg-white text-gray-600">
          <Loader2 className="w-4 h-4 animate-spin" /> Đang tải dữ liệu...
        </div>
      )}

      {error && (
        <div className="p-4 rounded-lg border bg-red-50 text-red-700 text-sm">
          Lỗi tải dữ liệu: {error}
        </div>
      )}

      {!loading && !error && (
        <div className="rounded-xl border bg-white shadow-md overflow-hidden">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 text-gray-800">
              <tr>
                <th className="px-4 py-3 text-left w-[80px]">ID</th>
                <th className="px-4 py-3 text-left">Thú cưng</th>
                <th className="px-4 py-3 text-left">Khách hàng</th>
                <th className="px-4 py-3 text-left">Dịch vụ</th>
                <th className="px-4 py-3 text-center">Trạng thái</th>
                <th className="px-4 py-3 text-left w-[160px]">Groomer</th>
                <th className="px-4 py-3 text-center w-[200px]">Thao tác</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {filteredBookings.map((b) => {
                const isEditing = editing[b.id];
                const hasGroomer = Boolean(b.groomer);

                return (
                  <tr key={b.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium"># {b.id}</td>
                    <td className="px-4 py-3">{b.pet?.name ?? "—"}</td>
                    <td className="px-4 py-3">{displayName(b.customer)}</td>

                    <td className="px-4 py-3 text-gray-700">
                      {[b.combo?.name, b.Room?.name]
                        .filter(Boolean)
                        .join(" • ") || "—"}
                    </td>

                    <td className="px-4 py-3 text-center">
                      <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                        <CheckCircle2 className="w-3.5 h-3.5" />{" "}
                        {translateStatus(b.status)}
                      </span>
                    </td>

                    {/* Cột Groomer */}
                    <td className="px-4 py-3">
                      {isEditing ? (
                        <select
                          className="w-full rounded-md border px-2 py-1 text-sm focus:ring-2 focus:ring-pink-300"
                          value={selection[b.id] ?? b.groomer?.id ?? ""}
                          onChange={(e) =>
                            setSelection((prev) => ({
                              ...prev,
                              [b.id]: Number(e.target.value),
                            }))
                          }
                        >
                          <option value="">—Nhân viên—</option>
                          {groomers.map((g) => (
                            <option key={g.id} value={g.id}>
                              {displayName(g)}
                            </option>
                          ))}
                        </select>
                      ) : hasGroomer ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                          <UserCheck className="w-3.5 h-3.5" />{" "}
                          {displayName(b.groomer)}
                        </span>
                      ) : (
                        <span className="text-gray-400 italic">
                          Chưa phân công
                        </span>
                      )}
                    </td>

                    {/* Cột Thao tác */}
                    <td className="px-4 py-3 text-center">
                      {isEditing ? (
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => assignGroomer(b.id)}
                            disabled={!selection[b.id] || assigningId === b.id}
                            className="rounded-lg bg-pink-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-pink-700 disabled:opacity-50"
                          >
                            {assigningId === b.id ? "Đang lưu..." : "Lưu"}
                          </button>

                          <button
                            onClick={() => {
                              setEditing((prev) => ({
                                ...prev,
                                [b.id]: false,
                              }));
                              setSelection((prev) => {
                                const next = { ...prev };
                                delete next[b.id];
                                return next;
                              });
                            }}
                            className="rounded-lg border px-3 py-1.5 text-xs hover:bg-gray-200"
                          >
                            Hủy
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setEditing((prev) => ({ ...prev, [b.id]: true }));
                            setSelection((prev) => ({
                              ...prev,
                              [b.id]: b.groomer?.id ?? "",
                            }));
                          }}
                          className="rounded-lg bg-pink-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-pink-600"
                        >
                          {hasGroomer ? "Đổi groomer" : "Phân công"}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}

              {!filteredBookings.length && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    {bookings.length
                      ? "Không có đơn nào khớp với từ khóa."
                      : "Không có đơn đã xác nhận."}
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
