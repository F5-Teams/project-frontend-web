"use client";

import React, { useEffect, useState } from "react";
import { uploadFile } from "@/utils/uploadFIle";
import { useUploadBookingPhotos } from "@/services/groomer/booking/hooks";
import type { UploadBookingPhotosPayload } from "@/services/groomer/booking/api";
import { toast } from "sonner";
import Image from "next/image";
import { UploadCloud } from "lucide-react";
import EvidenceNotice from "@/components/groomer/dashboard/EvidenceNotice";

type ImageType = "BEFORE" | "DURING" | "AFTER";

type Props = {
  bookingId: number;
  imageType?: ImageType; // default "BEFORE"
  title?: string;
  submitLabel?: string;
  onDone?: () => void;
  onCancel?: () => void;
};

export default function StartServicePanel({
  bookingId,
  imageType = "BEFORE",
  title,
  submitLabel,
  onDone,
  onCancel,
}: Props) {
  const [files, setFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [note, setNote] = useState("");
  const uploadMutation = useUploadBookingPhotos();

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

      const payload: UploadBookingPhotosPayload = {
        imageUrls: uploadedUrls,
        imageType,
        note: note || undefined,
      };

      await uploadMutation.mutateAsync({ bookingId, payload });
      toast.success("Ảnh đã được lưu vào hồ sơ booking.");
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
      <div className="absolute inset-0 bg-black/40" />

      <div className="relative z-10 w-[min(800px,96%)] bg-white rounded-xl p-6 shadow-lg border">
        <div className="flex items-center justify-center gap-2 mb-2">
          <h3 className="text-center text-2xl font-poppins-regular">
            {title ??
              (imageType === "AFTER"
                ? "Tải ảnh sau khi thực hiện"
                : "Ảnh minh chứng trước khi thực hiện")}
          </h3>
          {/* <EvidenceNotice /> */}
        </div>

        <p className="text-sm text-rose-600 mb-4 text-center">
          {imageType === "AFTER"
            ? "Ảnh sẽ được lưu kèm thời gian và người thực hiện. Vui lòng chọn góc chụp thể hiện rõ công đoạn hiện tại."
            : "Để đảm bảo minh bạch và an toàn dịch vụ, cần chụp ảnh pet (rõ mặt, đủ sáng). Khi ảnh được xác nhận hợp lệ, các thao tác với booking mới được mở."}
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
            Hỗ trợ nhiều ảnh. Ảnh sẽ được upload lên server và gắn nhãn{" "}
            {imageType}.
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
            onClick={() => onCancel?.()}
            className="px-3 py-2 bg-gray-100 text-gray-800 rounded-md text-sm"
            disabled={uploading}
          >
            Huỷ
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={uploading}
            className="px-3 py-2 bg-pink-600 text-white rounded-md font-poppins-light text-sm disabled:opacity-50"
          >
            {uploading
              ? "Đang gửi..."
              : submitLabel ??
                (imageType === "AFTER"
                  ? "Tải ảnh sau khi thực hiện"
                  : "Tải ảnh ngay")}
          </button>
        </div>
      </div>
    </div>
  );
}
