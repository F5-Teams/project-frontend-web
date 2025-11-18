"use client";

import React, { useState, useEffect } from "react";
import { CustomModal } from "@/components/ui/custom-modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Clock, AlertCircle, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { BookingDraft } from "@/types/cart";
import { generateTempId } from "@/utils/booking";
import { generateTimeSlots } from "@/utils/timeSlots";
import api from "@/config/axios";

interface SingleServiceBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (bookingDrafts: BookingDraft[]) => void;
  serviceId: string;
  selectedPetIds: string[];
  service?: any; // Optional service data to avoid duplicate API calls
}

export const SingleServiceBookingModal: React.FC<
  SingleServiceBookingModalProps
> = ({ isOpen, onClose, onConfirm, serviceId, selectedPetIds, service }) => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [errors, setErrors] = useState<string[]>([]);
  const [serviceData, setServiceData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Fetch service data from API or use provided service prop
  useEffect(() => {
    const fetchService = async () => {
      if (!serviceId || !isOpen) return;

      setLoading(true);
      try {
        // Use provided service prop if available, otherwise fetch from API
        if (service) {
          setServiceData(service);
          setLoading(false);
          return;
        }

        // Try to get combo from spa combos API first
        const response = await api.get("/combos/available");
        const combos = response.data || [];
        const foundService = combos.find(
          (combo: any) => combo.id.toString() === serviceId
        );

        if (foundService) {
          setServiceData(foundService);
        } else {
          // Fallback: create a basic service object
          setServiceData({
            id: parseInt(serviceId),
            name: "Spa Service",
            description: "Professional spa service for your pet",
            price: "250000",
            duration: 60,
            isActive: true,
            serviceLinks: [],
          });
        }
      } catch (error) {
        console.error("Error fetching service:", error);
        // Fallback service
        setService({
          id: parseInt(serviceId),
          name: "Spa Service",
          description: "Professional spa service for your pet",
          price: "250000",
          duration: 60,
          isActive: true,
          serviceLinks: [],
        });
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [serviceId, isOpen]);

  // Get available time slots for selected date
  const getAvailableTimeSlots = () => {
    if (!selectedDate) return [];

    return generateTimeSlots();
  };

  const availableTimeSlots = getAvailableTimeSlots();

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedDate(undefined);
      setSelectedTime("");
      setNotes("");
      setErrors([]);
    }
  }, [isOpen]);

  const handleConfirm = () => {
    const validationErrors: string[] = [];

    if (!selectedDate) {
      validationErrors.push("Please select a date");
    }

    if (!selectedTime) {
      validationErrors.push("Please select a time");
    }

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    // selectedTime giờ đã là period (MORNING/AFTERNOON/EVENING)
    const dropDownSlot = selectedTime as "MORNING" | "AFTERNOON" | "EVENING";

    // Tạo booking draft cho mỗi pet được chọn
    const bookingDrafts: BookingDraft[] = selectedPetIds.map((petId) => ({
      tempId: generateTempId(),
      petId: parseInt(petId),
      bookingDate: format(selectedDate!, "yyyy-MM-dd"),
      dropDownSlot,
      note: notes.trim() || undefined,
      comboId: parseInt(serviceId), // Đây là combo ID, không phải service ID
      customName: serviceData?.name, // Lưu tên combo để hiển thị
    }));

    onConfirm(bookingDrafts);
    onClose();
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  if (!service && loading) {
    return (
      <CustomModal
        open={isOpen}
        onClose={onClose}
        title="Đặt dịch vụ SPA"
        className="max-w-4xl"
      >
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          <span className="ml-2 text-gray-600">
            Đang tải thông tin dịch vụ...
          </span>
        </div>
      </CustomModal>
    );
  }

  if (!service) {
    return null;
  }

  return (
    <CustomModal
      open={isOpen}
      onClose={onClose}
      title="Đặt dịch vụ SPA"
      className="max-w-4xl"
    >
      <div className="space-y-6 max-h-[80vh] overflow-y-auto">
        {/* Service Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>
                {loading
                  ? "Đang tải thông tin dịch vụ..."
                  : serviceData?.name || "Không tìm thấy dịch vụ"}
              </span>
              <Badge variant="secondary">Combo SPA</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="flex flex-col items-center gap-2">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  <p className="text-sm text-gray-500">
                    Đang tải thông tin dịch vụ...
                  </p>
                </div>
              </div>
            ) : (
              <>
                <p className="text-gray-600">
                  {serviceData?.description || "Mô tả dịch vụ hiện chưa có."}
                </p>

                {/* Display included services */}
                {serviceData?.serviceLinks &&
                  serviceData.serviceLinks.length > 0 && (
                    <div className="mt-3">
                      <p className="text-sm font-semibold text-gray-700 mb-2">
                        Bao gồm các dịch vụ:
                      </p>
                      <div className="space-y-1">
                        {serviceData.serviceLinks.map((serviceLink: any) => (
                          <div
                            key={serviceLink.id}
                            className="flex items-center gap-2"
                          >
                            <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                            <span className="text-sm text-gray-600">
                              {serviceLink.service.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>
                      Thời lượng: {formatDuration(serviceData?.duration || 0)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="font-medium text-lg text-green-600">
                      {parseInt(serviceData?.price || "0").toLocaleString(
                        "vi-VN"
                      )}
                      đ
                    </span>
                  </div>
                </div>
              </>
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
                  {error === "Please select a date"
                    ? "Vui lòng chọn ngày"
                    : error === "Please select a time"
                    ? "Vui lòng chọn khung giờ"
                    : error}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Date and Time Selection - Same Row */}
        <div className="grid grid-cols-2 gap-4">
          {/* Date Selection */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Chọn ngày</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP") : "Chọn ngày"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Time Selection */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Chọn khung giờ</Label>
            <Select
              value={selectedTime}
              onValueChange={setSelectedTime}
              disabled={!selectedDate}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn khung giờ" />
              </SelectTrigger>
              <SelectContent>
                {availableTimeSlots.map((slot) => (
                  <SelectItem key={slot.value} value={slot.value}>
                    {slot.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedDate && availableTimeSlots.length === 0 && (
              <p className="text-sm text-gray-500">
                Không còn khung giờ nào khả dụng cho ngày này.
              </p>
            )}
          </div>
        </div>

        {/* Notes */}
        <div className="space-y-3">
          <Label htmlFor="notes" className="text-base font-medium">
            Ghi chú thêm
          </Label>
          <Textarea
            id="notes"
            placeholder="Bạn có yêu cầu hoặc ghi chú nào cho dịch vụ này không..."
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
            disabled={!selectedDate || !selectedTime}
            className="min-w-[120px]"
          >
            Thêm vào giỏ
          </Button>
        </div>
      </div>
    </CustomModal>
  );
};

export default SingleServiceBookingModal;
