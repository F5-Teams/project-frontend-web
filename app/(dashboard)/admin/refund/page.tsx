"use client";

import { useEffect, useState } from "react";
import api from "@/config/axios";
import { RefundItem } from "@/components/models/refund";
import Image from "next/image";

export default function AdminRefundPage() {
  const [refunds, setRefunds] = useState<RefundItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<RefundItem | null>(null);
  const [processing, setProcessing] = useState(false);
  const [refundAmount, setRefundAmount] = useState<string>("");
  const [adminNote, setAdminNote] = useState<string>("");

  useEffect(() => {
    fetchRefunds();
  }, []);

  // --- Ngăn scroll body khi modal mở ---
  useEffect(() => {
    if (typeof window === "undefined") return;

    const originalOverflow = document.body.style.overflow;
    if (selected) {
      document.body.style.overflow = "hidden"; // khi modal mở
    } else {
      document.body.style.overflow = originalOverflow; // khi modal đóng
    }

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [selected]);

  async function fetchRefunds() {
    setLoading(true);
    setError(null);

    try {
      const res = await api.get<RefundItem[]>("/refunds");
      setRefunds(res.data || []);
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }

  // --- Mở modal chi tiết khiếu nại ---
  function openDetails(refund: RefundItem) {
    setSelected(refund);
    setRefundAmount(refund.refundedAmount ?? refund.amount ?? "");
    setAdminNote(refund.adminNote ?? "");
  }

  // --- Đóng modal ---
  function closeDetails() {
    setSelected(null);
    setRefundAmount("");
    setAdminNote("");
  }

  /*Xử lý duyệt khiếu nại*/
  async function review(status: "APPROVED" | "REJECTED") {
    if (!selected) return;

    // Kiểm tra số tiền khi duyệt
    if (status === "APPROVED") {
      const amountNum = Number(refundAmount);
      if (isNaN(amountNum) || amountNum <= 0) {
        setError("Số tiền hoàn phải là số lớn hơn 0");
        return;
      }
    }

    setProcessing(true);

    try {
      const payload: any = { status };
      if (status === "APPROVED") payload.refundAmount = Number(refundAmount);
      if (adminNote.trim().length > 0) payload.adminNote = adminNote.trim();

      const res = await api.patch(`/refunds/${selected.id}/review`, payload);
      if (res.status < 200 || res.status >= 300) {
        throw new Error(res.data?.message || "Yêu cầu thất bại");
      }

      // Refresh lại danh sách
      await fetchRefunds();
      closeDetails();
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message);
    } finally {
      setProcessing(false);
    }
  }

  const statusLabelVN = (status: string) => {
    switch (status) {
      case "PENDING":
        return "Chờ duyệt";
      case "APPROVED":
        return "Đã chấp nhận";
      case "REJECTED":
        return "Đã từ chối";
      default:
        return status;
    }
  };

  const badge = (status: string) => {
    const style =
      status === "PENDING"
        ? "bg-yellow-100 text-yellow-700 border border-yellow-300"
        : status === "APPROVED"
        ? "bg-green-100 text-green-700 border border-green-300"
        : "bg-red-100 text-red-700 border border-red-300";

    return (
      <span className={`px-3 py-1 text-xs rounded-full font-medium ${style}`}>
        {statusLabelVN(status)}
      </span>
    );
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-5">Quản lý đơn khiếu nại</h1>

      {/* Loading và Error */}
      {loading && (
        <div className="text-gray-600 text-sm">Đang tải dữ liệu...</div>
      )}
      {error && <div className="text-red-600 text-sm mb-3">{error}</div>}

      {/* Bảng danh sách khiếu nại */}
      <div className="overflow-hidden border border-gray-200 rounded-xl bg-white shadow">
        <table className="min-w-full">
          <thead className="bg-gray-100 border-b">
            <tr className="text-gray-600 text-sm">
              <th className="px-4 py-3 text-left font-semibold">ID</th>
              <th className="px-4 py-3 text-left font-semibold">Khách hàng</th>
              <th className="px-4 py-3 text-left font-semibold">Mã Booking</th>
              <th className="px-4 py-3 text-left font-semibold">Số tiền</th>
              <th className="px-4 py-3 text-left font-semibold">Trạng thái</th>
              <th className="px-4 py-3 text-left font-semibold">Ngày tạo</th>
              <th className="px-4 py-3 text-left font-semibold">Hành động</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {refunds.map((r) => (
              <tr key={r.id} className="hover:bg-gray-50 transition">
                <td className="px-4 py-3 text-sm">{r.id}</td>
                <td className="px-4 py-3 text-sm">
                  {r.customer?.firstName} {r.customer?.lastName}
                </td>
                <td className="px-4 py-3 text-sm">{r.booking?.bookingCode}</td>
                <td className="px-4 py-3 text-sm font-medium text-blue-600">
                  {r.amount?.toLocaleString()}₫
                </td>
                <td className="px-4 py-3 text-sm">{badge(r.status)}</td>
                <td className="px-4 py-3 text-sm">
                  {new Date(r.createdAt).toLocaleString()}
                </td>
                <td className="px-4 py-3 text-sm">
                  <button
                    onClick={() => openDetails(r)}
                    className="px-4 py-1.5 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700 transition shadow-sm"
                  >
                    Xem chi tiết
                  </button>
                </td>
              </tr>
            ))}

            {!loading && refunds.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="text-center py-6 text-gray-500 text-sm"
                >
                  Không có đơn khiếu nại nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal slide-over chi tiết */}
      {selected && (
        <div className="fixed inset-0 z-50 flex">
          {/* overlay */}
          <div
            className="fixed inset-0 bg-black/40 z-40"
            onClick={closeDetails}
            aria-hidden
          />

          {/* panel */}
          <aside className="ml-auto w-full sm:w-[520px] max-w-full h-full bg-white shadow-xl border-l border-gray-100 overflow-auto z-50">
            <div className="flex flex-col h-full">
              {/* Header */}
              <header className="flex items-start justify-between p-6 border-b">
                <div>
                  <h3 className="text-xl font-semibold text-pink-600">
                    Chi tiết khiếu nại
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    ID #{selected.id} ·{" "}
                    {new Date(selected.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="ml-4 flex items-center gap-2">
                  <button
                    onClick={closeDetails}
                    aria-label="Close panel"
                    className="text-gray-500 hover:text-gray-800"
                  >
                    ✕
                  </button>
                </div>
              </header>

              {/* Body */}
              <div className="p-6 flex-1">
                <div className="grid grid-cols-1 gap-4">
                  {/* Thông tin cơ bản */}
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="text-gray-600">Khách hàng:</div>
                    <div className="font-medium text-gray-800">
                      {selected.customer?.firstName}{" "}
                      {selected.customer?.lastName}
                    </div>

                    <div className="text-gray-600">Mã Booking:</div>
                    <div className="font-medium text-gray-800">
                      {selected.booking?.bookingCode}
                    </div>

                    <div className="text-gray-600">Số tiền:</div>
                    <div className="font-medium text-pink-600">
                      {Number(selected.amount).toLocaleString()} VNĐ
                    </div>

                    <div className="text-gray-600">Số tiền đã hoàn:</div>
                    <div className="font-medium text-pink-600">
                      {Number(selected.refundedAmount).toLocaleString()} VNĐ
                    </div>

                    <div className="text-gray-600">Trạng thái:</div>
                    <div>{badge(selected.status)}</div>

                    <div className="text-gray-600">Lý do khiếu nại:</div>
                    <div className="font-medium text-gray-800">
                      {selected.reason || "-"}
                    </div>
                  </div>

                  {/* Hình ảnh minh chứng */}
                  <div>
                    <div className="text-sm text-gray-600 mb-2">
                      Hình ảnh minh chứng
                    </div>
                    <div className="flex flex-wrap gap-3 max-h-48 overflow-y-auto">
                      {selected.images?.length ? (
                        selected.images.map((img) => (
                          <div
                            key={img.id}
                            className="w-[120px] h-[120px] rounded-md overflow-hidden border"
                          >
                            <Image
                              src={img.imageUrl}
                              width={120}
                              height={120}
                              alt="refund"
                              className="object-cover w-full h-full"
                            />
                          </div>
                        ))
                      ) : (
                        <div className="text-sm text-gray-500">
                          Không có ảnh
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Số tiền hoàn & Ghi chú */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Số tiền hoàn (VNĐ)
                    </label>
                    <input
                      type="number"
                      className="border-2 border-pink-300 rounded-lg px-3 py-2 w-48 mb-2 focus:outline-none focus:ring-2 focus:ring-pink-300"
                      value={refundAmount}
                      onChange={(e) => setRefundAmount(e.target.value)}
                    />
                    <div className="text-xs text-gray-500">
                      Nhập số tiền sẽ hoàn cho khách hàng.
                    </div>

                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ghi chú (gửi cho khách hàng)
                      </label>
                      <textarea
                        value={adminNote}
                        onChange={(e) => setAdminNote(e.target.value)}
                        placeholder="Nhập nội dung từ chối ...."
                        className="w-full min-h-[86px] rounded-lg border-2 border-pink-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <footer className="p-6 border-t flex gap-3">
                <button
                  onClick={() => review("APPROVED")}
                  disabled={processing}
                  className="flex-1 px-4 py-2 rounded-lg bg-pink-600 text-white hover:bg-pink-700 disabled:opacity-60"
                >
                  {processing ? "Đang xử lý..." : "Chấp nhận"}
                </button>

                <button
                  onClick={() => review("REJECTED")}
                  disabled={processing}
                  className="flex-1 px-4 py-2 rounded-lg bg-white text-pink-600 border border-pink-200 hover:bg-pink-50 disabled:opacity-60"
                >
                  {processing ? "Đang xử lý..." : "Từ chối"}
                </button>

                <button
                  onClick={closeDetails}
                  className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200"
                >
                  Đóng
                </button>
              </footer>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
