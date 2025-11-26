"use client";

import { useEffect, useState, useMemo } from "react";
import api from "@/config/axios";
import type { Booking } from "@/components/models/booking";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  X,
} from "lucide-react";

// Badge màu theo trạng thái
const StatusBadge = ({ status }: { status: string }) => {
  const color: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-700 border-yellow-300",
    CONFIRMED: "bg-blue-100 text-blue-700 border-blue-300",
    ON_SERVICE: "bg-purple-100 text-purple-700 border-purple-300",
    COMPLETED: "bg-green-100 text-green-700 border-green-300",
    CANCELLED: "bg-red-100 text-red-700 border-red-300",
  };

  return (
    <span
      className={`px-3 py-1 text-xs rounded-full border font-medium ${
        color[status] ?? "bg-gray-100 text-gray-700 border-gray-300"
      }`}
    >
      {status}
    </span>
  );
};

export default function BookingListPage() {
  const [allBookings, setAllBookings] = useState<Booking[]>([]);

  // Search & Filter
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Sort ID
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Pagination
  const [page, setPage] = useState(1);
  const pageSize = 8;
  const [totalPages, setTotalPages] = useState(1);

  // Modal
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      // Fetch all bookings for filtering
      const res = await api.get("/bookings", {
        params: { page: 1, limit: 1000 },
      });
      const data = res.data?.data || res.data || [];
      setAllBookings(data);
    } catch (err) {
      console.log(err);
    }
  };

  // FILTER + SEARCH + SORT (Frontend filtering)
  const filteredData = useMemo(() => {
    let data = [...allBookings];

    if (searchText.trim() !== "") {
      const text = searchText.toLowerCase();
      data = data.filter((item) => {
        const petName = item.pet?.name ?? "";
        const customerName = `${item.customer?.firstName ?? ""} ${
          item.customer?.lastName ?? ""
        }`.trim();

        return (
          petName.toLowerCase().includes(text) ||
          customerName.toLowerCase().includes(text)
        );
      });
    }

    if (statusFilter !== "") {
      data = data.filter((item) => item.status === statusFilter);
    }

    data.sort((a, b) => (sortOrder === "asc" ? a.id - b.id : b.id - a.id));

    return data;
  }, [allBookings, searchText, statusFilter, sortOrder]);

  // Update pagination based on filtered data
  useEffect(() => {
    const total = filteredData.length;
    const totalPagesCalculated = Math.ceil(total / pageSize);
    setTotalPages(totalPagesCalculated);

    // Reset to page 1 if current page exceeds total pages
    if (page > totalPagesCalculated && totalPagesCalculated > 0) {
      setPage(1);
    }
  }, [filteredData, page, pageSize]);

  const paginatedData = filteredData.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const toggleSort = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Quản lý Booking</h1>

      {/* Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="p-6 rounded-xl border bg-pink-50 shadow-sm">
          <div className="text-sm text-pink-700">Tổng đơn hàng</div>
          <div className="text-3xl font-bold text-pink-700">
            {allBookings.length}
          </div>
        </div>

        <div className="p-6 rounded-xl border bg-yellow-50 shadow-sm">
          <div className="text-sm text-yellow-700">Pending</div>
          <div className="text-3xl font-bold text-yellow-700">
            {allBookings.filter((b) => b.status === "PENDING").length}
          </div>
        </div>

        <div className="p-6 rounded-xl border bg-blue-50 shadow-sm">
          <div className="text-sm text-blue-700">Confirmed</div>
          <div className="text-3xl font-bold text-blue-700">
            {allBookings.filter((b) => b.status === "CONFIRMED").length}
          </div>
        </div>

        <div className="p-6 rounded-xl border bg-green-50 shadow-sm">
          <div className="text-sm text-green-700">Completed</div>
          <div className="text-3xl font-bold text-green-700">
            {allBookings.filter((b) => b.status === "COMPLETED").length}
          </div>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 border rounded-xl px-3 py-2 bg-white w-72">
          <Search className="w-4 h-4 text-gray-500" />
          <input
            className="outline-none w-full text-sm"
            placeholder="Tìm thú cưng hoặc khách hàng..."
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
              setPage(1);
            }}
          />
        </div>

        <select
          className="border rounded-xl bg-white px-4 py-2 text-sm"
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
        >
          <option value="">Tất cả trạng thái</option>
          <option value="PENDING">PENDING</option>
          <option value="CONFIRMED">CONFIRMED</option>
          <option value="ON_SERVICE">ON_SERVICE</option>
          <option value="COMPLETED">COMPLETED</option>
          <option value="CANCELLED">CANCELLED</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-pink-50 text-pink-700">
              <th className="p-3 text-left cursor-pointer" onClick={toggleSort}>
                <div className="flex items-center gap-1">
                  ID <ArrowUpDown className="w-4 h-4" />
                </div>
              </th>
              <th className="p-3 text-left">Thú cưng</th>
              <th className="p-3 text-left">Dịch vụ</th>
              <th className="p-3 text-left">Khách hàng</th>
              <th className="p-3 text-left">Ngày đặt</th>
              <th className="p-3 text-left">Trạng thái</th>
              <th className="p-3 text-left">Hành động</th>
            </tr>
          </thead>

          <tbody>
            {paginatedData.map((item) => (
              <tr key={item.id} className="border-t hover:bg-pink-50/50">
                <td className="p-3">{item.id}</td>
                <td className="p-3">{item.pet?.name ?? "-"}</td>
                <td className="p-3">
                  {item.Room || item.roomId
                    ? "Hotel"
                    : item.combo || item.comboId
                    ? "Spa"
                    : "-"}
                </td>
                <td className="p-3">
                  {`${item.customer?.firstName ?? ""} ${
                    item.customer?.lastName ?? ""
                  }`.trim() || "-"}
                </td>
                <td className="p-3">
                  {new Date(item.bookingDate).toLocaleDateString("vi-VN")}
                </td>
                <td className="p-3">
                  <StatusBadge status={item.status} />
                </td>
                <td className="p-3">
                  <button
                    onClick={() => setSelectedBooking(item)}
                    className="px-3 py-1 bg-pink-600 text-white rounded-lg text-xs hover:bg-pink-700"
                  >
                    Xem chi tiết
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex items-center justify-center gap-3 mt-4">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="p-2 rounded-lg border bg-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft />
        </button>

        <span className="px-4 py-2 rounded-lg bg-pink-100 text-pink-700 font-semibold">
          {page} / {totalPages || 1}
        </span>

        <button
          disabled={page === totalPages || totalPages === 0}
          onClick={() => setPage((p) => p + 1)}
          className="p-2 rounded-lg border bg-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRight />
        </button>
      </div>

      {/* MODAL CHI TIẾT */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
          {/* Modal */}
          <div className="bg-white w-[600px] rounded-2xl shadow-2xl overflow-hidden animate-scaleIn relative">
            {/* HEADER */}
            <div className="bg-gradient-to-r from-pink-500 to-pink-600 text-white px-6 py-4 flex justify-between items-center">
              <h2 className="text-lg font-semibold">Chi tiết Booking</h2>
              <button
                onClick={() => setSelectedBooking(null)}
                className="hover:bg-white/20 p-1 rounded-full transition"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>

            {/* CONTENT */}
            <div className="p-6 space-y-4">
              {/* GRID 2 CỘT */}
              <div className="grid grid-cols-2 gap-4">
                {/* Cột trái */}
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <span className="font-semibold text-gray-600">
                      Thú cưng:
                    </span>
                    <span>{selectedBooking.pet?.name ?? "-"}</span>
                  </div>

                  <div className="flex gap-2">
                    <span className="font-semibold text-gray-600">
                      Khách hàng:
                    </span>
                    <span>
                      {`${selectedBooking.customer?.firstName ?? ""} ${
                        selectedBooking.customer?.lastName ?? ""
                      }`}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <span className="font-semibold text-gray-600">
                      Ngày đặt:
                    </span>
                    <span>
                      {new Date(selectedBooking.bookingDate).toLocaleDateString(
                        "vi-VN",
                        { timeZone: "Asia/Ho_Chi_Minh" }
                      )}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <span className="font-semibold text-gray-600">
                      Dịch vụ:
                    </span>
                    <span>
                      {selectedBooking.Room || selectedBooking.roomId
                        ? `Hotel${
                            selectedBooking.Room?.name
                              ? ` — ${selectedBooking.Room.name}`
                              : ""
                          }`
                        : selectedBooking.combo || selectedBooking.comboId
                        ? selectedBooking.combo?.serviceLinks &&
                          selectedBooking.combo.serviceLinks.length > 0
                          ? selectedBooking.combo.serviceLinks[0].service.name
                          : selectedBooking.combo?.name ?? "Spa"
                        : "-"}
                    </span>
                  </div>
                </div>

                {/* Cột phải */}
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <span className="font-semibold text-gray-600">
                      Trạng thái:
                    </span>
                    <StatusBadge status={selectedBooking.status} />
                  </div>

                  <div className="flex gap-2">
                    <span className="font-semibold text-gray-600">
                      Nhân viên:
                    </span>
                    <span>
                      {selectedBooking.groomer
                        ? `${selectedBooking.groomer.firstName} ${selectedBooking.groomer.lastName}`
                        : "Chưa có"}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <span className="font-semibold text-gray-600">
                      Ghi chú:
                    </span>
                    <span>{selectedBooking.note || "Không có"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* FOOTER */}
            <div className="px-6 py-3 bg-gray-50 flex justify-end">
              <button
                onClick={() => setSelectedBooking(null)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition"
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
