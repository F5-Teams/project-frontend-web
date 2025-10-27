"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
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
import { CalendarIcon, Clock, Plus, Minus, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { CustomComboCartItem } from "@/types/cart";
// Helper functions to replace mock data functions
const calculateCustomComboPrice = (
  serviceIds: string[],
  services: any[]
): number => {
  return serviceIds.reduce((total, serviceId) => {
    const service = services.find((s) => s.id === serviceId);
    return total + (service?.price || 0);
  }, 0);
};

interface CustomComboBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (
    item: Omit<CustomComboCartItem, "id" | "createdAt" | "deposit">
  ) => void;
  selectedPetIds: string[];
}

export const CustomComboBookingModal: React.FC<
  CustomComboBookingModalProps
> = ({ isOpen, onClose, onConfirm, selectedPetIds }) => {
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedGroomerId, setSelectedGroomerId] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [errors, setErrors] = useState<string[]>([]);

  // Get services that allow custom combos
  const availableServices = mockServices.filter(
    (service) => service.allowCustomCombo
  );
  const selectedServices = selectedServiceIds
    .map((id) => getServiceById(id))
    .filter(Boolean);
  const totalPrice = calculateCustomComboPrice(selectedServiceIds);

  // Get available groomers for selected services
  const getAvailableGroomers = () => {
    if (selectedServiceIds.length === 0) return [];

    const allGroomerIds = new Set<string>();
    selectedServiceIds.forEach((serviceId) => {
      const service = getServiceById(serviceId);
      if (service) {
        service.groomerIds.forEach((id) => allGroomerIds.add(id));
      }
    });

    return mockGroomers.filter((groomer) => allGroomerIds.has(groomer.id));
  };

  const availableGroomers = getAvailableGroomers();

  // Get available time slots for selected date and groomer
  const getAvailableTimeSlots = () => {
    if (!selectedDate || !selectedGroomerId) return [];

    const dateStr = format(selectedDate, "yyyy-MM-dd");
    const groomer = getGroomerById(selectedGroomerId);

    if (!groomer) return [];

    return groomer.availableSlots
      .filter((slot) => slot.date === dateStr && slot.isAvailable)
      .map((slot) => slot.time);
  };

  const availableTimeSlots = getAvailableTimeSlots();

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedServiceIds([]);
      setSelectedDate(undefined);
      setSelectedTime("");
      setSelectedGroomerId("");
      setNotes("");
      setErrors([]);
    }
  }, [isOpen]);

  const handleServiceToggle = (serviceId: string) => {
    setSelectedServiceIds((prev) => {
      const isSelected = prev.includes(serviceId);
      if (isSelected) {
        return prev.filter((id) => id !== serviceId);
      } else {
        return [...prev, serviceId];
      }
    });
  };

  const handleConfirm = () => {
    const validationErrors: string[] = [];

    if (selectedServiceIds.length === 0) {
      validationErrors.push("Please select at least one service");
    }

    if (!selectedDate) {
      validationErrors.push("Please select a date");
    }

    if (!selectedTime) {
      validationErrors.push("Please select a time");
    }

    if (!selectedGroomerId) {
      validationErrors.push("Please select a groomer");
    }

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    const appointmentTime = new Date(selectedDate);
    const [hours, minutes] = selectedTime.split(":");
    appointmentTime.setHours(parseInt(hours), parseInt(minutes));

    const cartItem: Omit<CustomComboCartItem, "id" | "createdAt" | "deposit"> =
      {
        type: "custom",
        petIds: selectedPetIds,
        price: totalPrice,
        status: "draft",
        payload: {
          selectedServiceIds,
          groomerId: selectedGroomerId,
          appointmentTime: appointmentTime.toISOString(),
          notes: notes.trim() || undefined,
        },
      };

    onConfirm(cartItem);
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

  const calculateTotalDuration = () => {
    return selectedServices.reduce(
      (total, service) => total + (service?.duration || 0),
      0
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Create Custom Combo
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Service Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Select Services</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availableServices.map((service) => {
                  const isSelected = selectedServiceIds.includes(service.id);

                  return (
                    <Card
                      key={service.id}
                      className={`cursor-pointer transition-all duration-200 ${
                        isSelected
                          ? "ring-2 ring-blue-500 bg-blue-50"
                          : "hover:shadow-md hover:ring-1 hover:ring-gray-300"
                      }`}
                      onClick={() => handleServiceToggle(service.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                          <Checkbox
                            checked={isSelected}
                            onChange={() => handleServiceToggle(service.id)}
                            className="mt-1"
                          />

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-medium text-gray-900">
                                {service.name}
                              </h3>
                              <Badge variant="secondary">
                                {service.category}
                              </Badge>
                            </div>

                            <p className="text-sm text-gray-600 mb-2">
                              {service.description}
                            </p>

                            <div className="flex items-center justify-between text-sm">
                              <div className="flex items-center space-x-1 text-gray-500">
                                <Clock className="h-4 w-4" />
                                <span>{formatDuration(service.duration)}</span>
                              </div>
                              <div className="font-medium text-green-600">
                                ${service.price}
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Selected Services Summary */}
          {selectedServices.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Selected Services</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {selectedServices.map((service, index) => (
                    <div
                      key={service?.id}
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

                {/* Total calculation */}
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-blue-800">
                      Total Duration:
                    </span>
                    <span className="font-medium text-blue-600">
                      {formatDuration(calculateTotalDuration())}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="font-bold text-blue-800">
                      Total Price:
                    </span>
                    <span className="font-bold text-xl text-blue-600">
                      ${totalPrice}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

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

          {/* Groomer Selection */}
          {selectedServices.length > 0 && (
            <div className="space-y-3">
              <Label className="text-base font-medium">Select Groomer</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {availableGroomers.map((groomer) => (
                  <Card
                    key={groomer.id}
                    className={`cursor-pointer transition-all duration-200 ${
                      selectedGroomerId === groomer.id
                        ? "ring-2 ring-blue-500 bg-blue-50"
                        : "hover:shadow-md hover:ring-1 hover:ring-gray-300"
                    }`}
                    onClick={() => setSelectedGroomerId(groomer.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{groomer.name}</span>
                        <div className="flex items-center space-x-1">
                          <span className="text-sm font-medium">
                            {groomer.rating}
                          </span>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">
                        <p className="mb-1">Specialties:</p>
                        <div className="flex flex-wrap gap-1">
                          {groomer.specialties.map((specialty, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs"
                            >
                              {specialty}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

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
          {selectedDate && selectedGroomerId && (
            <div className="space-y-3">
              <Label className="text-base font-medium">Select Time</Label>
              <Select value={selectedTime} onValueChange={setSelectedTime}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a time slot" />
                </SelectTrigger>
                <SelectContent>
                  {availableTimeSlots.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {availableTimeSlots.length === 0 && (
                <p className="text-sm text-gray-500">
                  No available time slots for this date and groomer.
                </p>
              )}
            </div>
          )}

          {/* Notes */}
          <div className="space-y-3">
            <Label htmlFor="notes" className="text-base font-medium">
              Additional Notes (Optional)
            </Label>
            <Textarea
              id="notes"
              placeholder="Any special instructions or notes for the groomer..."
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
                selectedServiceIds.length === 0 ||
                !selectedDate ||
                !selectedTime ||
                !selectedGroomerId
              }
              className="min-w-[120px]"
            >
              Add to Cart
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CustomComboBookingModal;
