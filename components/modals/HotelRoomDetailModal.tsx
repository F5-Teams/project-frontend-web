"use client";

import React, { useState } from "react";
import { CustomModal } from "@/components/ui/custom-modal";
import { Button } from "@/components/ui/button";
import { Tag, Home, Users, Check } from "lucide-react";
import Image from "next/image";

interface HotelRoomImage {
  id: number;
  imageUrl: string;
}

interface HotelRoom {
  id: string;
  name: string;
  description: string;
  price: number;
  capacity: number;
  isAvailable: boolean;
  totalAvailableRooms: number;
  image?: string;
  images?: HotelRoomImage[];
}

interface HotelRoomDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  room: HotelRoom | null;
  onBook: () => void;
}

export const HotelRoomDetailModal: React.FC<HotelRoomDetailModalProps> = ({
  isOpen,
  onClose,
  room,
  onBook,
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (!room) return null;

  // Get all images (from images array or fallback to single image)
  const allImages =
    room.images && room.images.length > 0
      ? room.images
      : room.image
      ? [{ id: 0, imageUrl: room.image }]
      : [];

  const currentImage =
    allImages.length > 0 ? allImages[selectedImageIndex] : null;

  // Room features/amenities
  const roomFeatures = [
    "Phòng riêng tư, sạch sẽ",
    "Điều hòa nhiệt độ phù hợp",
    "Khu vực vui chơi riêng",
    "Giám sát camera 24/7",
    "Chăm sóc y tế khi cần",
    "Thức ăn theo yêu cầu",
  ];

  return (
    <CustomModal
      open={isOpen}
      onClose={onClose}
      title={room.name}
      className="max-w-4xl"
    >
      <div className="space-y-6">
        {/* Image Gallery */}
        {allImages.length > 0 && (
          <div className="space-y-3">
            {/* Main Image */}
            <div className="relative w-full h-[400px] rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center">
              {currentImage && (
                <Image
                  src={currentImage.imageUrl}
                  alt={room.name}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                />
              )}
            </div>

            {/* Thumbnail Gallery */}
            {allImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {allImages.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImageIndex === index
                        ? "border-pink-500 scale-105"
                        : "border-gray-200 hover:border-pink-300"
                    }`}
                  >
                    <Image
                      src={image.imageUrl}
                      alt={`${room.name} - ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Room Info */}
        <div className="space-y-4">
          {/* Price, Capacity and Availability */}
          <div className="flex items-center gap-6 pb-4 border-b flex-wrap">
            <div className="flex items-center gap-2">
              <Tag className="w-5 h-5 text-pink-500" />
              <div>
                <p className="text-xs text-gray-500">Giá phòng</p>
                <p className="text-2xl font-poppins-semibold text-pink-600">
                  {room.price > 0
                    ? `${room.price.toLocaleString("vi-VN")}đ/đêm`
                    : "Liên hệ"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-xs text-gray-500">Sức chứa</p>
                <p className="text-lg font-poppins-medium text-gray-800">
                  {room.capacity} thú cưng
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Home className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-xs text-gray-500">Tình trạng</p>
                <p
                  className={`text-lg font-poppins-medium ${
                    room.isAvailable && room.totalAvailableRooms > 0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {room.isAvailable && room.totalAvailableRooms > 0
                    ? `Còn ${room.totalAvailableRooms} phòng`
                    : "Hết phòng"}
                </p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="font-poppins-medium text-lg text-gray-800 mb-2">
              Mô tả
            </h3>
            <p className="text-gray-600 font-poppins-regular leading-relaxed">
              {room.description}
            </p>
          </div>

          {/* Room Features */}
          <div>
            <h3 className="font-poppins-medium text-lg text-gray-800 mb-3">
              Tiện nghi & Dịch vụ
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {roomFeatures.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-shrink-0 mt-0.5">
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                      <Check className="w-4 h-4 text-green-600" />
                    </div>
                  </div>
                  <p className="font-poppins-regular text-gray-700 text-sm">
                    {feature}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Important Notes */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-poppins-medium text-gray-800 mb-2 flex items-center gap-2">
              <span className="text-blue-600">ℹ️</span>
              Lưu ý quan trọng
            </h4>
            <ul className="space-y-1 text-sm text-gray-600 font-poppins-regular">
              <li>• Đưa thú cưng đến trước 18:00 để check-in</li>
              <li>• Mang theo sổ tiêm chủng đầy đủ</li>
              <li>• Thông báo trước nếu thú cưng có nhu cầu đặc biệt</li>
              <li>• Liên hệ trước 24h nếu muốn hủy đặt phòng</li>
            </ul>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Đóng
          </Button>
          <Button
            onClick={() => {
              onBook();
              onClose();
            }}
            disabled={!room.isAvailable || room.totalAvailableRooms === 0}
            className="flex-1 bg-pink-500 hover:bg-pink-600 text-white"
          >
            {room.isAvailable && room.totalAvailableRooms > 0
              ? "Đặt phòng ngay"
              : "Hết phòng"}
          </Button>
        </div>
      </div>
    </CustomModal>
  );
};

export default HotelRoomDetailModal;
