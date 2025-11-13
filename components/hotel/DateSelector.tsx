"use client";
import { useState } from "react";
import { Calendar } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DateSelectorProps {
  onDateChange: (checkInDate: Date | null, checkOutDate: Date | null) => void;
}

export const DateSelector = ({ onDateChange }: DateSelectorProps) => {
  const [checkInDate, setCheckInDate] = useState<Date | null>(null);
  const [checkOutDate, setCheckOutDate] = useState<Date | null>(null);

  const handleCheckInChange = (date: Date | undefined) => {
    const newCheckIn = date || null;
    setCheckInDate(newCheckIn);

    // If checkout is before new checkin, reset checkout
    if (newCheckIn && checkOutDate && checkOutDate <= newCheckIn) {
      setCheckOutDate(null);
      onDateChange(newCheckIn, null);
    } else {
      onDateChange(newCheckIn, checkOutDate);
    }
  };

  const handleCheckOutChange = (date: Date | undefined) => {
    const newCheckOut = date || null;
    setCheckOutDate(newCheckOut);
    onDateChange(checkInDate, newCheckOut);
  };

  const handleClearDates = () => {
    setCheckInDate(null);
    setCheckOutDate(null);
    onDateChange(null, null);
  };

  return (
    <div className="w-full bg-white rounded-2xl shadow-lg p-6 mb-8">
      <div className="flex flex-col gap-6">
        <div className="text-center">
          <h2 className="text-2xl font-poppins-medium text-slate-800 mb-2">
            Chọn ngày đặt phòng
          </h2>
          <p className="text-slate-600 font-poppins-regular">
            Chọn ngày nhận phòng và trả phòng để xem phòng có sẵn
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Check-in Date */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-poppins-medium text-slate-700">
              Ngày nhận phòng
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <button
                  className={cn(
                    "w-full px-4 py-3 border rounded-lg flex items-center gap-3 justify-between font-poppins-regular transition-all",
                    checkInDate
                      ? "border-pink-500 bg-pink-50 text-slate-800"
                      : "border-gray-300 bg-white text-slate-500 hover:border-pink-300"
                  )}
                >
                  <span>
                    {checkInDate
                      ? format(checkInDate, "dd/MM/yyyy", { locale: vi })
                      : "Chọn ngày nhận phòng"}
                  </span>
                  <Calendar className="w-5 h-5" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={checkInDate || undefined}
                  onSelect={handleCheckInChange}
                  disabled={(date) =>
                    date < new Date(new Date().setHours(0, 0, 0, 0))
                  }
                  initialFocus
                  locale={vi}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Check-out Date */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-poppins-medium text-slate-700">
              Ngày trả phòng
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <button
                  className={cn(
                    "w-full px-4 py-3 border rounded-lg flex items-center gap-3 justify-between font-poppins-regular transition-all",
                    checkOutDate
                      ? "border-pink-500 bg-pink-50 text-slate-800"
                      : "border-gray-300 bg-white text-slate-500 hover:border-pink-300",
                    !checkInDate && "opacity-50 cursor-not-allowed"
                  )}
                  disabled={!checkInDate}
                >
                  <span>
                    {checkOutDate
                      ? format(checkOutDate, "dd/MM/yyyy", { locale: vi })
                      : "Chọn ngày trả phòng"}
                  </span>
                  <Calendar className="w-5 h-5" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={checkOutDate || undefined}
                  onSelect={handleCheckOutChange}
                  disabled={(date) => {
                    if (!checkInDate) return true;
                    const minCheckOut = new Date(checkInDate);
                    minCheckOut.setDate(minCheckOut.getDate() + 1);
                    return date <= checkInDate;
                  }}
                  initialFocus
                  locale={vi}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-center">
          {(checkInDate || checkOutDate) && (
            <button
              onClick={handleClearDates}
              className="px-6 py-2.5 border border-gray-300 text-slate-700 rounded-lg hover:bg-gray-50 transition font-poppins-regular"
            >
              Xóa lựa chọn
            </button>
          )}
          {checkInDate && checkOutDate && (
            <div className="flex items-center gap-2 px-6 py-2.5 bg-green-50 border border-green-200 rounded-lg">
              <span className="text-green-700 font-poppins-regular">
                {Math.ceil(
                  (checkOutDate.getTime() - checkInDate.getTime()) /
                    (1000 * 60 * 60 * 24)
                )}{" "}
                đêm
              </span>
            </div>
          )}
        </div>

        {/* Info message */}
        {!checkInDate && !checkOutDate && (
          <div className="text-center p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-700 font-poppins-regular">
              � Vui lòng chọn cả ngày nhận phòng và trả phòng để xem danh sách
              phòng có sẵn
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
