/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function RefundRequestPage() {
  const params = useParams();
  const router = useRouter();
  const bookingId = params?.bookingId ? Number(params.bookingId) : null;

  const [reason, setReason] = useState("");
  const [images, setImages] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingId) return;
    setLoading(true);
    setError(null);
    try {
      const payload = {
        bookingId,
        reason,
        imageUrls: images
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s.length > 0),
      };

      const res = await fetch(`/refunds/request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Yêu cầu khiếu nại thất bại");
      }

      setSuccess(true);
      // Redirect back to booking detail after short delay
      setTimeout(() => {
        router.push(`/profile/calendar/${bookingId}`);
      }, 1200);
    } catch (err: any) {
      setError(err?.message || "Lỗi khi gửi yêu cầu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white/40 backdrop-blur shadow-lg rounded-2xl p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-xl font-poppins-semibold mb-4">
          Yêu cầu hoàn tiền
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 bg-white p-6 rounded-2xl border border-gray-100"
        >
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Mã booking
            </label>
            <div className="text-gray-900 font-poppins-medium">{bookingId}</div>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Lý do</label>
            <textarea
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={5}
              className="w-full p-2 border rounded-md"
              placeholder="Mô tả lý do khiếu nại"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">
              URL hình ảnh (phân tách bằng dấu phẩy)
            </label>
            <input
              value={images}
              onChange={(e) => setImages(e.target.value)}
              className="w-full p-2 border rounded-md"
              placeholder="https://example.com/img1.jpg, https://example.com/img2.jpg"
            />
          </div>

          {error && <div className="text-red-600">{error}</div>}
          {success && (
            <div className="text-green-600">
              Yêu cầu đã gửi thành công — chuyển hướng...
            </div>
          )}

          <div className="flex items-center gap-2">
            <Button type="submit" disabled={loading || success}>
              {loading ? "Đang gửi..." : "Gửi yêu cầu"}
            </Button>
            <Button type="button" variant="ghost" onClick={() => router.back()}>
              Huỷ
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
