/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import api from "@/config/axios";
import { Room, RoomClass, RoomStatus } from "@/components/models/room";
import { toast } from "sonner";
import { X } from "lucide-react";

function normalizePrice(v: any) {
  const n = Number(v);
  return Number.isFinite(n) ? Math.trunc(n) : undefined;
}

// Xây dựng payload PATCH: chỉ gửi field có thay đổi //
function buildRoomPatchPayload(form: Room, original?: Room | null) {
  if (!original) return {};

  const payload: any = {};

  // So sánh và chỉ gửi field thay đổi
  if (form.name !== original.name) payload.name = form.name?.trim() ?? "";
  if (form.class !== original.class) payload.class = form.class?.trim() ?? "";

  const nextPrice = normalizePrice(form.price);
  const prevPrice = normalizePrice(original.price);
  if (nextPrice !== prevPrice) payload.price = nextPrice;

  if (form.status !== original.status)
    payload.status = form.status as RoomStatus;

  if (form.description !== original.description)
    payload.description = form.description?.trim() ?? "";

  //Xử lý ảnh //
  const newUrl = form.images?.[0]?.imageUrl?.trim() || "";
  const currentImages = original.images ?? [];
  const currentFirstUrl = currentImages[0]?.imageUrl || "";

  if (newUrl && newUrl !== currentFirstUrl) {
    const removeImageIds = currentImages
      .map((img) => img.id)
      .filter((id) => Number.isFinite(id));

    if (removeImageIds.length > 0) payload.removeImageIds = removeImageIds;

    const restOldUrls = currentImages
      .map((img) => img.imageUrl)
      .filter((u) => !!u && u !== newUrl);

    payload.addImages = [
      { imageUrl: newUrl },
      ...restOldUrls.map((u) => ({ imageUrl: u })),
    ];
  }

  if (!newUrl && currentImages.length > 0) {
    const removeImageIds = currentImages
      .map((img) => img.id)
      .filter((id) => Number.isFinite(id));

    if (removeImageIds.length > 0) payload.removeImageIds = removeImageIds;
  }

  return payload;
}

export default function RoomForm({
  open,
  onClose,
  onSuccess,
  editData,
}: {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editData?: Room | null;
}) {
  const [formData, setFormData] = useState<Room>({
    name: "",
    class: "STANDARD",
    price: 0,
    status: "AVAILABLE",
    description: "",
    images: [],
  });

  useEffect(() => {
    if (editData) setFormData(editData);
  }, [editData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editData) {
        const patchPayload = buildRoomPatchPayload(formData, editData);

        if (Object.keys(patchPayload).length === 0) {
          toast.message("Không có thay đổi nào để cập nhật.");
          return;
        }

        await api.patch(`/rooms/${editData.id}`, patchPayload, {
          headers: { "Content-Type": "application/json" },
        });
        toast.success("Cập nhật phòng thành công!");
      } else {
        const newUrl = formData.images?.[0]?.imageUrl?.trim();
        const createPayload: any = {
          name: formData.name?.trim(),
          class: formData.class?.trim(),
          price: normalizePrice(formData.price) ?? 0,
          status: formData.status,
          description: formData.description?.trim() ?? "",
          images: newUrl ? [{ imageUrl: newUrl }] : [],
        };

        await api.post("/rooms", createPayload, {
          headers: { "Content-Type": "application/json" },
        });
        toast.success("Thêm phòng mới thành công!");
      }
      onClose();
      onSuccess();
    } catch (err: any) {
      console.error("Room save error:", {
        status: err?.response?.status,
        data: err?.response?.data,
        method: err?.config?.method,
        url: err?.config?.url,
      });

      const serverMsg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Không rõ nguyên nhân";
      toast.error(`Lỗi khi lưu dữ liệu: ${serverMsg}`);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-[420px] rounded-2xl shadow-xl p-6 relative animate-in fade-in duration-300"
      >
        {/* Nút đóng */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-pink-500 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Tiêu đề */}
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          {editData ? "Cập nhật phòng" : "Thêm phòng mới"}
        </h2>

        {/* INPUTS */}
        <div className="space-y-4">
          {/* 🔤 Tên phòng */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Tên phòng
            </label>
            <input
              type="text"
              placeholder="Nhập tên phòng..."
              className="w-full border border-pink-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>

          {/* 🏷️ Hạng phòng */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Hạng phòng
            </label>
            <select
              className="w-full border border-pink-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300"
              value={formData.class}
              onChange={(e) =>
                setFormData({ ...formData, class: e.target.value as RoomClass })
              }
              required
            >
              <option value="STANDARD">Standard</option>
              <option value="VIP">VIP</option>
              <option value="PREMIUM">Premium</option>
              <option value="DELUXE">Deluxe</option>
              <option value="EXECUTIVE">Executive</option>
            </select>
          </div>

          {/* 💰 Giá phòng */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Giá phòng (VNĐ)
            </label>
            <input
              type="number"
              placeholder="Nhập giá phòng..."
              className="w-full border border-pink-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: Number(e.target.value) })
              }
              required
            />
          </div>

          {/* 📝 Mô tả */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Mô tả
            </label>
            <textarea
              placeholder="Nhập mô tả ngắn gọn về phòng..."
              rows={3}
              className="w-full border border-pink-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          {/* 🖼️ Ảnh */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Ảnh phòng (URL)
            </label>
            <input
              type="text"
              placeholder="https://..."
              className="w-full border border-pink-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300"
              value={formData.images?.[0]?.imageUrl || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  images: [{ imageUrl: e.target.value }],
                })
              }
            />
          </div>

          {/* 🚦 Trạng thái */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Trạng thái
            </label>
            <select
              className="w-full border border-pink-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-pink-300"
              value={formData.status}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  status: e.target.value as RoomStatus,
                })
              }
            >
              <option value="AVAILABLE">Còn trống</option>
              <option value="OCCUPIED">Đang sử dụng</option>
              <option value="MAINTENANCE">Bảo trì</option>
              <option value="INACTIVE">Ngưng hoạt động</option>
            </select>
          </div>
        </div>

        {/* Nút hành động */}
        <div className="flex justify-end gap-3 mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="border-gray-300 text-gray-600 hover:bg-gray-100 transition-all"
          >
            Hủy
          </Button>
          <Button
            type="submit"
            className="bg-gradient-to-r from-pink-400 to-pink-600 text-white px-5 py-2 rounded-lg shadow hover:opacity-90 transition-all"
          >
            {editData ? "Cập nhật" : "Thêm mới"}
          </Button>
        </div>
      </form>
    </div>
  );
}
