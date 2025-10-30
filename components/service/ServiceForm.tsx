/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import api from "@/config/axios";
import { Service } from "@/components/models/service";
import { toast } from "sonner";
import { X } from "lucide-react";

interface Props {
  editing?: Service | null;
  onClose: () => void;
}

export default function ServiceForm({ editing, onClose }: Props) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState<number>();
  const [duration, setDuration] = useState<number>();
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editing) {
      setName(editing.name);
      setPrice(editing.price);
      setDuration(editing.duration);
      setDescription(editing.description);
      setIsActive(editing.isActive);
      setImageUrl(editing.images?.[0]?.imageUrl || "");
    }
  }, [editing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const currentImages = editing?.images ?? [];
    const currentFirstUrl = currentImages[0]?.imageUrl || "";
    const newUrl = imageUrl?.trim();

    const base: any = {
      name,
      price: typeof price === "number" ? Math.trunc(price) : undefined,
      duration: typeof duration === "number" ? Math.trunc(duration) : undefined,
      description,
      isActive,
    };
    Object.keys(base).forEach((k) => {
      const v = base[k];
      if (v === undefined) delete base[k];
      if (typeof v === "string" && v.trim() === "") delete base[k];
    });

    if (editing && newUrl && newUrl !== currentFirstUrl) {
      const removeImageIds = currentImages
        .map((img) => img.id)
        .filter((id) => Number.isFinite(id));

      const rest = currentImages
        .map((img) => img.imageUrl)
        .filter((u) => !!u && u !== newUrl);

      const addImages = [
        { imageUrl: newUrl },
        ...rest.map((u) => ({ imageUrl: u })),
      ];

      base.removeImageIds = removeImageIds;
      base.addImages = addImages;
    }

    try {
      setLoading(true);
      if (editing) {
        await api.patch(`/services/${editing.id}`, base, {
          headers: { "Content-Type": "application/json" },
        });
        toast.success("Cập nhật dịch vụ thành công!");
      } else {
        const createPayload = {
          ...base,
          images: newUrl ? [{ imageUrl: newUrl }] : [],
        };
        await api.post("/services", createPayload, {
          headers: { "Content-Type": "application/json" },
        });
        toast.success("Thêm dịch vụ mới thành công!");
      }
      onClose();
    } catch (err: any) {
      const serverMsg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Không rõ nguyên nhân";
      toast.error(`Không thể lưu dịch vụ: ${serverMsg}`);
      console.error("Service save error:", err?.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
      <div
        className="relative bg-white p-6 rounded-3xl shadow-xl border border-pink-100
               w-[92%] sm:w-[380px] md:w-[420px] animate-fadeIn"
      >
        {/* Nút đóng */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-pink-500 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-bold text-center mb-5 text-pink-600">
          {editing ? " Cập nhật dịch vụ" : " Thêm dịch vụ mới"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Tên dịch vụ
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tên dịch vụ..."
              className="w-full border border-pink-200 rounded-xl p-2.5 focus:ring-2 focus:ring-pink-300 focus:outline-none text-sm transition"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Giá (VNĐ)
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              placeholder="Nhập giá..."
              className="w-full border border-pink-200 rounded-xl p-2.5 focus:ring-2 focus:ring-yellow-300 focus:outline-none text-sm transition"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Thời lượng (phút)
            </label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              placeholder="VD: 30"
              className="w-full border border-pink-200 rounded-xl p-2.5 focus:ring-2 focus:ring-yellow-300 focus:outline-none text-sm transition"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Mô tả
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Nhập mô tả..."
              className="w-full border border-pink-200 rounded-xl p-2.5 h-20 resize-none focus:ring-2 focus:ring-pink-300 focus:outline-none text-sm transition"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              URL ảnh dịch vụ
            </label>
            <input
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Dán link ảnh..."
              className="w-full border border-pink-200 rounded-xl p-2.5 focus:ring-2 focus:ring-pink-300 focus:outline-none text-sm transition"
              required
            />
          </div>

          {imageUrl && (
            <div className="mt-2 flex justify-center">
              <img
                src={imageUrl}
                alt="Preview"
                className="w-24 h-24 object-cover rounded-xl border border-pink-200 shadow-sm"
              />
            </div>
          )}

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              id="isActive"
              className="w-4 h-4 accent-pink-500"
            />
            <label htmlFor="isActive" className="text-gray-700 text-sm">
              Kích hoạt dịch vụ
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="outline"
              type="button"
              onClick={onClose}
              className="rounded-lg border-pink-300 hover:bg-pink-50 text-pink-600 text-sm px-4"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              className="rounded-lg bg-gradient-to-r from-pink-500 via-pink-400 to-yellow-300 hover:opacity-90 text-white text-sm px-4"
            >
              {editing ? "Cập nhật" : "Thêm mới"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
