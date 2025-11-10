"use client";

import React, { useEffect, useState } from "react";
import { uploadFile } from "@/utils/uploadFIle";
import { useCompleteBooking } from "@/services/groomer/booking/hooks";
import type { CompleteBookingPayload } from "@/services/groomer/booking/api";
import { toast } from "sonner";
import Image from "next/image";
import { UploadCloud, X } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { GROOMER_CONFIRMED_BOOKINGS_KEY } from "@/services/groomer/booking/hooks";

type ImageType = "AFTER";

type Props = {
  bookingId: number;
  imageType?: ImageType;
  title?: string;
  submitLabel?: string;
  onDone?: () => void;
  onCancel?: () => void;
};

export default function ModalUpload({
  bookingId,
  imageType = "AFTER",
  title,
  submitLabel,
  onDone,
  onCancel,
}: Props) {
  const [files, setFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [note, setNote] = useState("");
  const completeMutation = useCompleteBooking();
  const qc = useQueryClient();

  useEffect(() => {
    const urls = files.map((f) => URL.createObjectURL(f));
    setPreviewUrls(urls);
    return () => {
      urls.forEach((u) => URL.revokeObjectURL(u));
    };
  }, [files]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;
    const newFiles = Array.from(e.target.files);
    setFiles((prev) => [...prev, ...newFiles]);
  }

  function removeImage(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit() {
    if (files.length === 0) {
      toast.error("Vui lòng chọn ít nhất 1 ảnh trước khi gửi");
      return;
    }

    setUploading(true);
    try {
      const uploadedUrls: string[] = [];
      for (const f of files) {
        const res = await uploadFile(f);
        uploadedUrls.push(res.url);
      }

      const payload: CompleteBookingPayload = {
        imageUrls: uploadedUrls,
        imageType: imageType,
        note: note || undefined,
      };

      await completeMutation.mutateAsync({ bookingId, payload });
      // Explicitly refetch bookings so List + Detail update instantly
      qc.invalidateQueries({ queryKey: GROOMER_CONFIRMED_BOOKINGS_KEY });
      toast.success("Đã hoàn tất dịch vụ và lưu ảnh");
      onDone?.();
    } catch (err) {
      console.error(err);
      toast.error("Lỗi khi upload ảnh");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      aria-modal="true"
      role="dialog"
    >
      <div className="absolute rounded-2xl inset-0 bg-black/40" />

      <div className="relative z-10 w-[min(800px,96%)] bg-white rounded-xl p-6 shadow-lg border">
        {/* Close button */}
        <button
          type="button"
          onClick={() => onCancel?.()}
          className="absolute top-3 right-3 rounded-full p-2 hover:bg-gray-100"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center justify-center gap-2 mb-2">
          <h3 className="text-center text-2xl font-poppins-regular">
            {title ?? "Ảnh minh chứng sau khi thực hiện"}
          </h3>
        </div>

        <p className="text-sm text-rose-600 mb-4 text-center">
          Vui lòng chụp ảnh pet sau khi hoàn thành dịch vụ (rõ mặt, đủ sáng)
        </p>

        <section className="mb-4">
          <label className="flex cursor-pointer items-center gap-2 w-fit rounded-lg border border-dashed border-pink-300 bg-pink-50 px-4 py-2 text-pink-600 text-sm font-medium hover:bg-pink-100 transition">
            <UploadCloud className="w-4 h-4" />
            <span>Chọn ảnh</span>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>

          <div className="text-xs font-poppins-light text-muted-foreground mt-2">
            Hỗ trợ nhiều ảnh. Ảnh sẽ được upload lên server và gắn nhãn AFTER.
          </div>
        </section>

        {previewUrls.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-3">
              {previewUrls.map((url, idx) => (
                <div
                  key={idx}
                  className="relative w-28 h-28 rounded-lg overflow-hidden border border-gray-200"
                >
                  <Image
                    src={url}
                    alt={`preview-${idx}`}
                    width={112}
                    height={112}
                    className="object-cover w-full h-full"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-1 right-1 bg-white/90 rounded-full p-1 text-xs shadow"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mb-4">
          <label className="block font-poppins-medium text-sm text-black mb-2">
            Ghi chú (tuỳ chọn)
          </label>
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full border border-popover-foreground rounded-xl px-3 py-2 text-sm font-poppins-light focus:outline-none focus:ring-1 focus:ring-pink-200"
            placeholder="Ghi chú cho ảnh..."
          />
        </div>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={uploading}
            className="px-3 py-2 bg-pink-600 text-white rounded-md font-poppins-light text-sm disabled:opacity-50"
          >
            {uploading ? "Đang gửi..." : submitLabel ?? "Hoàn tất dịch vụ"}
          </button>
        </div>
      </div>
    </div>
  );
}
