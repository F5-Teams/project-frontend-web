"use client";

import React, { useState, useEffect } from "react";
import { CustomModal } from "@/components/ui/custom-modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  CalendarIcon,
  Users,
  Star,
  AlertCircle,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { BookingDraft } from "@/types/cart";
import { generateTempId } from "@/utils/booking";
import { HotelRoom } from "@/services/hotel";

// Helper functions
const calculateRoomPrice = (pricePerNight: number, nights: number): number => {
  return pricePerNight * nights;
};

const applyWeekendSurcharge = (
  price: number,
  isWeekend: boolean = false
): number => {
  return isWeekend ? Math.round(price * 1.1) : price;
};

interface RoomBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (bookingDrafts: BookingDraft[]) => void;
  roomId: string;
  selectedPetIds: string[];
  room?: HotelRoom; // Room data to avoid duplicate API calls
}

export const RoomBookingModal: React.FC<RoomBookingModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  roomId,
  selectedPetIds,
  room,
}) => {
  const [loading, setLoading] = useState(false);
  const [checkInDate, setCheckInDate] = useState<Date>();
  const [checkOutDate, setCheckOutDate] = useState<Date>();
  const [notes, setNotes] = useState<string>("");
  const [errors, setErrors] = useState<string[]>([]);

  const nights =
    checkInDate && checkOutDate
      ? differenceInDays(checkOutDate, checkInDate)
      : 0;

  const pricePerNight = room ? parseInt(room.price) : 0;
  const basePrice = calculateRoomPrice(pricePerNight, nights);
  const finalPrice =
    checkInDate && room
      ? applyWeekendSurcharge(
          basePrice,
          checkInDate.getDay() === 0 || checkInDate.getDay() === 6
        )
      : basePrice;

  const isWeekendStay =
    checkInDate && (checkInDate.getDay() === 0 || checkInDate.getDay() === 6);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setCheckInDate(undefined);
      setCheckOutDate(undefined);
      setNotes("");
      setErrors([]);
    }
  }, [isOpen]);

  const handleConfirm = () => {
    const validationErrors: string[] = [];

    if (!checkInDate) {
      validationErrors.push("Please select check-in date");
    }

    if (!checkOutDate) {
      validationErrors.push("Please select check-out date");
    }

    if (checkInDate && checkOutDate) {
      if (checkOutDate <= checkInDate) {
        validationErrors.push("Check-out date must be after check-in date");
      }

      if (nights < 1) {
        validationErrors.push("Minimum 1 night stay required");
      }

      // Check room availability from the room data passed as prop
      // Note: If room.isAvailable is undefined, we assume it's available
      // since it came from the available rooms API
      if (room && room.isAvailable === false) {
        validationErrors.push("Room is currently not available");
      }
    }

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Tạo booking draft cho mỗi pet được chọn
    const bookingDrafts: BookingDraft[] = selectedPetIds.map((petId) => ({
      tempId: generateTempId(),
      petId: parseInt(petId),
      bookingDate: format(checkInDate!, "yyyy-MM-dd"),
      dropDownSlot: "MORNING", // Default check-in slot for hotel
      note: notes.trim() || undefined,
      roomId: parseInt(roomId),
      startDate: format(checkInDate!, "yyyy-MM-dd"),
      endDate: format(checkOutDate!, "yyyy-MM-dd"),
    }));

    onConfirm(bookingDrafts);
    onClose();
  };

  if (!room) {
    return (
      <CustomModal open={isOpen} onClose={onClose} title="Room Not Found">
        <div className="text-center py-8">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600">Room not found or data not available</p>
        </div>
      </CustomModal>
    );
  }

  return (
    <CustomModal
      open={isOpen}
      onClose={onClose}
      title="Đặt phòng khách sạn"
      className="max-w-4xl"
    >
      <div className="space-y-6 max-h-[80vh] overflow-y-auto">
        {/* Room Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{room.name}</span>
              <Badge variant="secondary">Phòng</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <Users className="h-4 w-4" />
                <span>Hạng phòng: {room.class}</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="font-medium text-lg text-green-600">
                  {parseInt(room.price).toLocaleString()}đ/night
                </span>
              </div>
            </div>

            {/* Description */}
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Mô tả:</h4>
              <p className="text-gray-600 text-sm">{room.description}</p>
            </div>

            {/* Amenities */}
            {room.amenities && room.amenities.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">
                  Tiện ích phòng:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {room.amenities.map((amenity, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="text-green-700 border-green-300"
                    >
                      <CheckCircle className="h-3 w-3 mr-1" />
                      {amenity}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Room Images */}
            {room.images && room.images.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">
                  Hình ảnh phòng:
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {room.images.slice(0, 4).map((image, index) => (
                    <div
                      key={image.id}
                      className="aspect-video rounded-lg overflow-hidden"
                    >
                      <img
                        src={image.imageUrl}
                        alt={`${room.name} - Image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Validation errors */}
        {errors.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <span className="font-medium text-red-800">
                Vui lòng kiểm tra các lỗi sau:
              </span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-sm text-red-700">
              {errors.map((error, index) => (
                <li key={index}>
                  {error === "Please select check-in date"
                    ? "Vui lòng chọn ngày nhận phòng"
                    : error === "Please select check-out date"
                    ? "Vui lòng chọn ngày trả phòng"
                    : error === "Check-out date must be after check-in date"
                    ? "Ngày trả phòng phải sau ngày nhận phòng"
                    : error === "Minimum 1 night stay required"
                    ? "Bạn cần đặt ít nhất 1 đêm!"
                    : error === "Room is currently not available"
                    ? "Phòng này hiện không còn khả dụng!"
                    : error}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Date Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Check-in Date */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Ngày nhận phòng</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {checkInDate
                    ? format(checkInDate, "PPP")
                    : "Select check-in date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={checkInDate}
                  onSelect={setCheckInDate}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Check-out Date */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Ngày trả phòng</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {checkOutDate
                    ? format(checkOutDate, "PPP")
                    : "Select check-out date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={checkOutDate}
                  onSelect={setCheckOutDate}
                  disabled={(date) => date <= (checkInDate || new Date())}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Booking Summary */}
        {checkInDate && checkOutDate && nights > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tóm tắt đặt phòng</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Phòng:</span>
                <span className="font-medium">{room.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Nhận phòng:</span>
                <span className="font-medium">
                  {format(checkInDate, "PPP")}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Trả phòng:</span>
                <span className="font-medium">
                  {format(checkOutDate, "PPP")}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Số đêm:</span>
                <span className="font-medium">{nights} đêm</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Giá gốc:</span>
                <span className="font-medium">
                  {basePrice.toLocaleString()}đ
                </span>
              </div>
              {isWeekendStay && (
                <div className="flex justify-between text-sm text-orange-600">
                  <span>Phụ thu cuối tuần (+10%):</span>
                  <span className="font-medium">
                    +{(finalPrice - basePrice).toLocaleString()}đ
                  </span>
                </div>
              )}
              <div className="border-t pt-3">
                <div className="flex justify-between font-bold text-lg">
                  <span>Tổng cộng:</span>
                  <span className="text-green-600">
                    {finalPrice.toLocaleString()}đ
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Notes */}
        <div className="space-y-3">
          <Label htmlFor="notes" className="text-base font-medium">
            Ghi chú thêm
          </Label>
          <Textarea
            id="notes"
            placeholder="Bạn có yêu cầu hoặc ghi chú gì cho kỳ lưu trú này không..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
          />
        </div>

        {/* Action buttons */}
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!checkInDate || !checkOutDate || nights < 1}
            className="min-w-[120px]"
          >
            Thêm vào giỏ
          </Button>
        </div>
      </div>
    </CustomModal>
  );
};

export default RoomBookingModal;
