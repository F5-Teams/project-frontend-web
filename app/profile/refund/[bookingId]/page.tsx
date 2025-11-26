/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import api from "@/config/axios";
import { toast } from "sonner";
import { uploadFile } from "@/utils/uploadFIle";

export default function RefundRequestPage() {
  const params = useParams();
  const router = useRouter();
  const bookingId = params?.bookingId ? Number(params.bookingId) : null;

  const [reason, setReason] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingId) return;

    setLoading(true);

    try {
      // upload files first (if any) and collect URLs
      let uploadedUrls: string[] = [];
      if (files.length > 0) {
        const uploaded = await Promise.all(
          files.map(async (f) => {
            const r = await uploadFile(f as any);
            return r.url;
          })
        );
        uploadedUrls = uploaded;
      }

      const payload = {
        bookingId,
        reason,
        imageUrls: uploadedUrls,
      };

      const res = await api.post(`/refunds/request`, payload);

      if (res.status < 200 || res.status >= 300) {
        throw new Error(res.data?.message || "Yêu cầu khiếu nại thất bại");
      }

      setSuccess(true);
      toast.success("Yêu cầu hoàn tiền đã được gửi thành công!");

      setTimeout(() => {
        router.push(`/profile/calendar/${bookingId}`);
      }, 1200);
    } catch (err: any) {
      const message =
        err?.response?.data?.message || err?.message || "Lỗi khi gửi yêu cầu";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 flex justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg border border-gray-200 p-8 animate-fadeIn">
        <h1 className="text-2xl font-poppins-semibold text-gray-900 mb-2">
          Yêu cầu hoàn tiền
        </h1>

        <p className="text-gray-600 mb-6">
          Vui lòng cung cấp lý do khiếu nại và hình ảnh minh chứng nếu có.
        </p>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Booking Id */}
          <div className="flex flex-col">
            <label className="text-sm text-gray-700 mb-1 font-medium">
              Mã booking
            </label>
            <div className="bg-gray-100 px-4 py-2 rounded-md text-gray-900 font-medium border">
              {bookingId}
            </div>
          </div>

          {/* Lý do */}
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

          {/* Hình ảnh (upload) */}
          <div className="flex flex-col">
            <label className="text-sm text-gray-700 mb-1 font-medium">
              Hình ảnh (tuỳ chọn)
            </label>

            {/* Upload Box */}
            <div
              className="
      flex flex-col items-center justify-center 
      border-2 border-dashed border-gray-300 
      rounded-xl p-6 cursor-pointer bg-gray-50
      hover:border-blue-400 hover:bg-gray-100
      transition
    "
              onClick={() => document.getElementById("refund-upload")?.click()}
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
                Kéo & thả ảnh vào đây hoặc nhấn để chọn
              </span>

              <input
                id="refund-upload"
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

            {/* Preview Images */}
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

                    {/* Delete button */}
                    <button
                      type="button"
                      onClick={() => {
                        setFiles((prev) => prev.filter((_, idx) => idx !== i));
                        setPreviewUrls((prev) =>
                          prev.filter((_, idx) => idx !== i)
                        );
                      }}
                      className="
              absolute top-1 right-1 
              bg-black/60 backdrop-blur text-white 
              text-xs px-2 py-1 rounded opacity-0 
              group-hover:opacity-100 transition
            "
                    >
                      X
                    </button>

                    {/* Overlay on hover */}
                    <div
                      className="
              absolute inset-0 bg-black/10 opacity-0 
              group-hover:opacity-100 transition
            "
                    ></div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              type="submit"
              disabled={loading || success}
              className="px-6 py-2 rounded-xl"
            >
              {loading ? "Đang gửi..." : "Gửi yêu cầu"}
            </Button>

            <Button
              type="button"
              variant="outline"
              className="px-6 py-2 rounded-xl"
              onClick={() => router.back()}
            >
              Hủy
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
