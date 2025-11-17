"use client";

import React, { useState } from "react";
import { CustomModal } from "@/components/ui/custom-modal";
import { Button } from "@/components/ui/button";
import { Check, Clock, Tag } from "lucide-react";
import Image from "next/image";

interface Service {
  id: number;
  name: string;
  price: string;
  duration: number;
  description: string;
  isActive: boolean;
  images: Array<{
    id: number;
    imageUrl: string;
  }>;
}

interface ServiceLink {
  id: number;
  comboId: number;
  serviceId: number;
  service: Service;
}

interface Combo {
  id: number;
  name: string;
  price: string;
  duration: number;
  description: string;
  isActive: boolean;
  serviceLinks: ServiceLink[];
}

interface ComboDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  combo: Combo | null;
  onBook: () => void;
}

export const ComboDetailModal: React.FC<ComboDetailModalProps> = ({
  isOpen,
  onClose,
  combo,
  onBook,
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (!combo) return null;

  // Get all images from all services in the combo
  const allImages = combo.serviceLinks.flatMap(
    (link) => link.service.images || []
  );

  const currentImage =
    allImages.length > 0 ? allImages[selectedImageIndex] : null;

  return (
    <CustomModal
      open={isOpen}
      onClose={onClose}
      title={combo.name}
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
                  alt={combo.name}
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
                      alt={`${combo.name} - ${index + 1}`}
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

        {/* Combo Info */}
        <div className="space-y-4">
          {/* Price and Duration */}
          <div className="flex items-center gap-6 pb-4 border-b">
            <div className="flex items-center gap-2">
              <Tag className="w-5 h-5 text-pink-500" />
              <div>
                <p className="text-xs text-gray-500">Giá combo</p>
                <p className="text-2xl font-poppins-semibold text-pink-600">
                  {parseInt(combo.price).toLocaleString("vi-VN")}đ
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-xs text-gray-500">Thời gian</p>
                <p className="text-lg font-poppins-medium text-gray-800">
                  {combo.duration} phút
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
              {combo.description}
            </p>
          </div>

          {/* Included Services */}
          <div>
            <h3 className="font-poppins-medium text-lg text-gray-800 mb-3">
              Dịch vụ bao gồm
            </h3>
            <div className="space-y-3">
              {combo.serviceLinks.map((serviceLink) => (
                <div
                  key={serviceLink.id}
                  className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                      <Check className="w-4 h-4 text-green-600" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className="font-poppins-medium text-gray-800">
                        {serviceLink.service.name}
                      </h4>
                      <span className="text-sm font-poppins-regular text-pink-600 flex-shrink-0">
                        {parseInt(serviceLink.service.price).toLocaleString(
                          "vi-VN"
                        )}
                        đ
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 font-poppins-regular mb-1">
                      {serviceLink.service.description}
                    </p>
                    <p className="text-xs text-gray-500">
                      ⏱️ {serviceLink.service.duration} phút
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Total Savings */}
          {combo.serviceLinks.length > 0 && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-poppins-medium text-gray-700">
                    Tổng giá trị dịch vụ lẻ
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Tiết kiệm khi đặt combo
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-poppins-semibold text-gray-800 line-through">
                    {combo.serviceLinks
                      .reduce(
                        (sum, link) => sum + parseInt(link.service.price),
                        0
                      )
                      .toLocaleString("vi-VN")}
                    đ
                  </p>
                  <p className="text-sm font-poppins-medium text-green-600">
                    Giảm{" "}
                    {(
                      combo.serviceLinks.reduce(
                        (sum, link) => sum + parseInt(link.service.price),
                        0
                      ) - parseInt(combo.price)
                    ).toLocaleString("vi-VN")}
                    đ
                  </p>
                </div>
              </div>
            </div>
          )}
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
            disabled={!combo.isActive}
            className="flex-1 bg-pink-500 hover:bg-pink-600 text-white"
          >
            {combo.isActive ? "Đặt ngay" : "Hết chỗ"}
          </Button>
        </div>
      </div>
    </CustomModal>
  );
};

export default ComboDetailModal;
