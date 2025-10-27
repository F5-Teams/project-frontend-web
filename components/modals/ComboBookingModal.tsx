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
import { CalendarIcon, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { BookingDraft } from "@/types/cart";
import { generateTempId } from "@/utils/booking";
import { generateTimeSlots } from "@/utils/timeSlots";

// Helper functions to replace mock data functions
const getComboById = (id: string): any => {
  // This should be replaced with actual API call
  return {
    id,
    name: "Spa Combo",
    description: "Professional spa combo service",
    price: 500000,
    duration: 90,
    benefits: ["20% discount", "Free aromatherapy", "Priority booking"],
    services: [],
  };
};

const getServiceById = (id: string): any => {
  // This should be replaced with actual API call
  return {
    id,
    name: "Spa Service",
    description: "Professional spa service",
    price: 250000,
    duration: 60,
  };
};

interface ComboBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (bookingDrafts: BookingDraft[]) => void;
  comboId: string;
  selectedPetIds: string[];
}

export const ComboBookingModal: React.FC<ComboBookingModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  comboId,
  selectedPetIds,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [errors, setErrors] = useState<string[]>([]);

  const combo = getComboById(comboId);
  const comboServices = combo
    ? combo.serviceIds.map((id) => getServiceById(id)).filter(Boolean)
    : [];

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

    // For spa combos, require date and time
    if (combo?.category === "spa") {
      if (!selectedDate) {
        validationErrors.push("Please select a date");
      }
      if (!selectedTime) {
        validationErrors.push("Please select a time");
      }
    }

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    // selectedTime giờ đã là period (MORNING/AFTERNOON/EVENING)
    let dropDownSlot: "MORNING" | "AFTERNOON" | "EVENING" = "MORNING";
    if (selectedTime) {
      dropDownSlot = selectedTime as "MORNING" | "AFTERNOON" | "EVENING";
    }

    // Create BookingDraft for each service in the combo
    const bookingDrafts: BookingDraft[] =
      combo?.serviceIds.map((serviceId) => ({
        tempId: generateTempId(),
        petId: parseInt(selectedPetIds[0]), // Assuming single pet for now
        bookingDate: selectedDate ? format(selectedDate, "yyyy-MM-dd") : "",
        dropDownSlot,
        note: notes.trim() || undefined,
        customName: combo.name, // Group combo services together
        serviceIds: [parseInt(serviceId)],
      })) || [];

    onConfirm(bookingDrafts);
    onClose();
  };

  const calculateTotalDuration = () => {
    return comboServices.reduce(
      (total, service) => total + (service?.duration || 0),
      0
    );
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  if (!combo) {
    return null;
  }

  return (
    <CustomModal
      open={isOpen}
      onClose={onClose}
      title="Book Combo Package"
      className="max-w-4xl"
    >
      <div className="space-y-6 max-h-[80vh] overflow-y-auto">
        {/* Combo Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{combo.name}</span>
              <Badge variant="secondary">{combo.category}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{formatDuration(calculateTotalDuration())}</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="font-medium text-lg text-green-600">
                  ${combo.price}
                </span>
              </div>
            </div>

            {/* Benefits */}
            <div>
              <h4 className="font-medium text-gray-900 mb-2">
                Package Benefits:
              </h4>
              <div className="flex flex-wrap gap-2">
                {combo.benefits.map((benefit, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="text-green-700 border-green-300"
                  >
                    <CheckCircle className="h-3 w-3 mr-1" />
                    {benefit}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Services in Combo */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Services Included</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {comboServices.map((service, index) => (
                <div
                  key={service?.id || index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="font-medium">{service?.name}</h4>
                      <p className="text-sm text-gray-600">
                        {service?.description}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">
                      {formatDuration(service?.duration || 0)}
                    </div>
                    <div className="font-medium text-gray-900">
                      ${service?.price}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Price comparison */}
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  Individual services total:
                </span>
                <span className="text-sm text-gray-500 line-through">
                  $
                  {comboServices.reduce(
                    (sum, service) => sum + (service?.price || 0),
                    0
                  )}
                </span>
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="font-medium text-green-800">Combo price:</span>
                <span className="font-bold text-lg text-green-600">
                  ${combo.price}
                </span>
              </div>
              <div className="text-xs text-green-700 mt-1">
                You save $
                {comboServices.reduce(
                  (sum, service) => sum + (service?.price || 0),
                  0
                ) - combo.price}
                !
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Validation errors */}
        {errors.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <span className="font-medium text-red-800">
                Please fix the following errors:
              </span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-sm text-red-700">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Date and Time Selection (for spa combos) */}
        {combo.category === "spa" && (
          <>
            {/* Date Selection */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Select Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
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
            {selectedDate && (
              <div className="space-y-3">
                <Label className="text-base font-medium">Select Time</Label>
                <Select value={selectedTime} onValueChange={setSelectedTime}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a time slot" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTimeSlots.map((slot) => (
                      <SelectItem key={slot.value} value={slot.value}>
                        {slot.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {availableTimeSlots.length === 0 && (
                  <p className="text-sm text-gray-500">
                    No available time slots for this date.
                  </p>
                )}
              </div>
            )}
          </>
        )}

        {/* Notes */}
        <div className="space-y-3">
          <Label htmlFor="notes" className="text-base font-medium">
            Additional Notes (Optional)
          </Label>
          <Textarea
            id="notes"
            placeholder="Any special instructions or notes..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
          />
        </div>

        {/* Action buttons */}
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={
              combo.category === "spa" && (!selectedDate || !selectedTime)
            }
            className="min-w-[120px]"
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </CustomModal>
  );
};

export default ComboBookingModal;
