"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, Clock } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { Room } from "@/components/models/room";
import api from "@/config/axios";
import RoomForm from "@/components/room/RoomForm";

export default function HotelPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [openForm, setOpenForm] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const res = await api.get("/rooms");
      setRooms(res.data);
    } catch {
      toast.error("Không thể tải danh sách phòng!");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number | undefined) => {
    if (!id) return;
    if (!confirm("Bạn có chắc muốn xóa phòng này?")) return;

    try {
      await api.delete(`/rooms/${id}`);
      toast.success("Đã xóa phòng thành công!");
      fetchRooms();
    } catch {
      toast.error("Không thể xóa phòng!");
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const formatPrice = (value: number) =>
    value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
          Quản lý phòng khách sạn
        </h1>
        <Button
          onClick={() => {
            setSelectedRoom(null);
            setOpenForm(true);
          }}
          className="rounded-full bg-gradient-to-r from-pink-400 to-pink-600 hover:opacity-90 text-white px-6 py-2 shadow-md transition-all"
        >
          <Plus className="mr-2 h-4 w-4" /> Thêm phòng
        </Button>
      </div>

      {/* Loading */}
      {loading && (
        <p className="text-center text-gray-500 italic">Đang tải dữ liệu...</p>
      )}

      {/* Danh sách phòng */}
      {!loading && rooms.length === 0 ? (
        <p className="text-center text-gray-600 italic">
          Chưa có phòng nào được thêm.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {rooms.map((room) => (
            <div
              key={room.id}
              className="group bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-pink-100/50 overflow-hidden"
            >
              {/* Image Container */}
              <div className="relative h-48 w-full overflow-hidden">
                <Image
                  src={room.images?.[0]?.imageUrl || "/placeholder.png"}
                  alt={room.name}
                  className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
                  fill
                />
                <div className="absolute top-3 right-3">
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-medium ${
                      room.status === "AVAILABLE"
                        ? "bg-green-500/90 text-white"
                        : room.status === "OCCUPIED"
                        ? "bg-yellow-500/90 text-white"
                        : room.status === "MAINTENANCE"
                        ? "bg-blue-500/90 text-white"
                        : "bg-gray-500/90 text-white"
                    }`}
                  >
                    {room.status === "AVAILABLE"
                      ? "Còn trống"
                      : room.status === "OCCUPIED"
                      ? "Đang sử dụng"
                      : room.status === "MAINTENANCE"
                      ? "Bảo trì"
                      : "Ngưng hoạt động"}
                  </span>
                </div>
              </div>

              {/* Content Container */}
              <div className="p-4">
                <h2 className="font-semibold text-xl text-gray-800 mb-2 line-clamp-1">
                  {room.name}
                </h2>
                <p className="text-gray-500 text-sm mb-2">
                  Hạng phòng:{" "}
                  <span className="font-medium text-pink-500">
                    {room.class}
                  </span>
                </p>

                {/* Price */}
                <div className="flex items-center justify-between mb-4 border-t border-gray-100 pt-4">
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">Giá phòng</span>
                    <span className="text-lg font-semibold text-pink-500">
                      {formatPrice(room.price)} VNĐ
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-2 items-center">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-yellow-500 text-yellow-500 hover:bg-yellow-50 transition-all"
                    onClick={() => {
                      setSelectedRoom(room);
                      setOpenForm(true);
                    }}
                  >
                    <Pencil className="h-4 w-4 mr-1" /> Sửa
                  </Button>

                  <Button
                    size="sm"
                    className="bg-red-100 text-red-600 hover:bg-red-600 hover:text-white rounded-md transition-all"
                    onClick={() => handleDelete(room.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" /> Xóa
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form thêm / sửa phòng */}
      {openForm && (
        <RoomForm
          open={openForm}
          onClose={() => setOpenForm(false)}
          onSuccess={fetchRooms}
          editData={selectedRoom}
        />
      )}
    </div>
  );
}
