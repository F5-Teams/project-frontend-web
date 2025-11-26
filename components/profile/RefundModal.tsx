/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import api from "@/config/axios";
import { toast } from "sonner";
import { uploadFile } from "@/utils/uploadFIle";

type Props = {
  bookingId: number | null;
  canRequestRefund: boolean;
  reasonLabel: string;
};

export default function RefundModal({
  bookingId,
  canRequestRefund,
  reasonLabel,
}: Props) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // --- Xử lý submit form ---
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!bookingId) return;

    setLoading(true);

    try {
      // --- Upload ảnh nếu có ---
      let uploadedUrls: string[] = [];
      if (files.length > 0) {
        uploadedUrls = await Promise.all(
          files.map(async (f) => (await uploadFile(f as any)).url)
        );
      }

      // --- Payload gửi API ---
      const payload = {
        bookingId,
        reason,
        imageUrls: uploadedUrls,
      };

      const res = await api.post(`/refunds/request`, payload);

      if (res.status < 200 || res.status >= 300) {
        throw new Error("Yêu cầu khiếu nại thất bại");
      }

      setSuccess(true);
      setSubmitted(true);
      toast.success("Yêu cầu hoàn tiền đã được gửi thành công!");

      setTimeout(() => {
        setOpen(false);
        setReason("");
        setFiles([]);
        setPreviewUrls([]);
        setSuccess(false);

        try {
          router.refresh();
        } catch (err) {}
      }, 1200);
    } catch (err: any) {
      toast.error("Yêu cầu đã được gửi trước đó");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* --- Button mở modal / thông báo không được phép --- */}
      {!submitted ? (
        <>
          <Button
            type="button"
            onClick={() => setOpen(true)}
            className={`w-full px-4 py-2 mb-2 rounded-lg text-white shadow-sm ${
              canRequestRefund
                ? "bg-pink-600 hover:bg-pink-700"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
            disabled={!canRequestRefund}
          >
            Yêu cầu hoàn tiền
          </Button>
          {!canRequestRefund && (
            <div className="text-xs text-gray-500 mt-1">
              Lý do: {reasonLabel}
            </div>
          )}
        </>
      ) : (
        <div className="text-sm text-green-600 font-medium mb-2">
          Yêu cầu hoàn tiền đã gửi
        </div>
      )}

      {/* --- Modal --- */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Overlay nền đen */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />

          {/* Nội dung modal */}
          <div className="relative w-full max-w-3xl mx-4 bg-white rounded-2xl shadow-lg border p-6 z-10">
            <h2 className="text-lg font-poppins-semibold mb-2">
              Yêu cầu hoàn tiền
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Vui lòng cung cấp lý do khiếu nại và hình ảnh minh chứng nếu có.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Mã booking */}
              <div className="flex flex-col">
                <label className="text-sm text-gray-700 mb-1 font-medium">
                  Mã booking
                </label>
                <div className="bg-gray-100 px-4 py-2 rounded-md text-gray-900 font-medium border">
                  {bookingId}
                </div>
              </div>

              {/* Lý do khiếu nại */}
              <div className="flex flex-col">
                <label className="text-sm text-gray-700 mb-1 font-medium">
                  Lý do khiếu nại <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={5}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition bg-gray-50"
                  placeholder="Vui lòng mô tả rõ lý do hoàn tiền..."
                />
              </div>

              {/* Upload ảnh */}
              <div>
                <label className="text-sm text-gray-700 mb-1 font-medium">
                  Hình ảnh (tuỳ chọn)
                </label>
                <div
                  className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-6 cursor-pointer bg-gray-50 hover:border-blue-400 hover:bg-gray-100 transition"
                  onClick={() =>
                    document.getElementById("refund-upload-modal")?.click()
                  }
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const dropped = Array.from(e.dataTransfer.files);
                    setFiles((prev) => [...prev, ...dropped]);
                    setPreviewUrls((prev) => [
                      ...prev,
                      ...dropped.map((f) => URL.createObjectURL(f)),
                    ]);
                  }}
                >
                  <span className="text-gray-500 text-sm">
                    Nhấn để chọn ảnh
                  </span>
                  <input
                    id="refund-upload-modal"
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                      const selected = e.target.files
                        ? Array.from(e.target.files)
                        : [];
                      setFiles((prev) => [...prev, ...selected]);
                      setPreviewUrls((prev) => [
                        ...prev,
                        ...selected.map((f) => URL.createObjectURL(f)),
                      ]);
                    }}
                  />
                </div>

                {/* Preview ảnh */}
                {previewUrls.length > 0 && (
                  <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-52 overflow-y-auto pr-1">
                    {previewUrls.map((src, i) => (
                      <div
                        key={i}
                        className="relative group rounded-xl overflow-hidden border border-gray-200 shadow-sm"
                      >
                        <img
                          src={src}
                          className="w-full h-28 object-cover transition group-hover:scale-105"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setFiles((prev) =>
                              prev.filter((_, idx) => idx !== i)
                            );
                            setPreviewUrls((prev) =>
                              prev.filter((_, idx) => idx !== i)
                            );
                          }}
                          className="absolute top-1 right-1 bg-black/60 backdrop-blur text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition"
                        >
                          X
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Nút Hủy và Gửi */}
              <div className="flex gap-3 pt-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  className="px-4 py-2 rounded-xl"
                  onClick={() => setOpen(false)}
                  disabled={loading}
                >
                  Hủy
                </Button>
                <Button
                  type="submit"
                  className="px-4 py-2 rounded-xl"
                  disabled={loading || success}
                >
                  {loading ? "Đang gửi..." : "Gửi yêu cầu"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
