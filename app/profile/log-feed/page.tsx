"use client";

import React, { useState } from "react";
import { useGetFeedingLogsByBooking } from "@/services/profile/feeding-logs/hooks";
import { useFilteredBookings } from "@/services/profile/profile-schedule/hooks";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatDMY } from "@/utils/date";
import { formatCurrency } from "@/utils/currency";
import { Clock, User, Utensils } from "lucide-react";
import Image from "next/image";

export default function LogFeedPage() {
  const [selectedBookingId, setSelectedBookingId] = useState<number>(0);

  const today = new Date();
  const oneYearAgo = new Date(today);
  oneYearAgo.setFullYear(today.getFullYear() - 1);
  const oneYearLater = new Date(today);
  oneYearLater.setFullYear(today.getFullYear() + 1);

  const fromDate = oneYearAgo.toISOString().split("T")[0];
  const toDate = oneYearLater.toISOString().split("T")[0];

  const { data: hotelBookings, isLoading: isLoadingBookings } =
    useFilteredBookings({
      fromDate,
      toDate,
      type: "HOTEL",
    });

  const { data: feedingLogs, isLoading: isLoadingLogs } =
    useGetFeedingLogsByBooking(selectedBookingId);

  if (isLoadingBookings) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-12 bg-gray-200 rounded"></div>
          <div className="space-y-3">
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto sm:max-w-5xl lg:max-w-7xl p-2 space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="space-y-4">
          <div>
            <Select
              value={
                selectedBookingId > 0 ? selectedBookingId.toString() : undefined
              }
              onValueChange={(value) => setSelectedBookingId(Number(value))}
            >
              <SelectTrigger className="w-full h-auto min-h-[60px] p-4 font-poppins-light border-2 border-gray-200 hover:border-pink-300 rounded-2xl transition-colors bg-linear-to-r from-white to-pink-50/30 shadow-sm hover:shadow-md">
                <SelectValue placeholder="Chọn booking khách sạn..." />
              </SelectTrigger>
              <SelectContent className="w-full">
                {!hotelBookings || hotelBookings.length === 0 ? (
                  <div className="p-6 text-center">
                    <Utensils className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500 font-poppins-light">
                      Không có booking khách sạn nào
                    </p>
                  </div>
                ) : (
                  hotelBookings.map((booking) => (
                    <SelectItem
                      key={booking.id}
                      value={booking.id.toString()}
                      className="font-poppins-light p-3 cursor-pointer hover:bg-pink-50 focus:bg-pink-50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center shrink-0">
                          <Utensils className="w-5 h-5 text-pink-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-poppins-semibold text-gray-900">
                            Booking #{booking.id} - Bé {booking.pet?.name}
                          </div>
                          <div className="text-xs text-gray-500 font-poppins-light mt-0.5">
                            {booking.room?.name || "N/A"} •{" "}
                            {booking.checkInDate
                              ? formatDMY(new Date(booking.checkInDate))
                              : "Chưa check-in"}{" "}
                            -{" "}
                            {booking.checkOutDate
                              ? formatDMY(new Date(booking.checkOutDate))
                              : "Chưa check-out"}
                          </div>
                        </div>
                      </div>
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {selectedBookingId > 0 && (
            <div className="mt-6">
              {isLoadingLogs ? (
                <div className="space-y-3">
                  <div className="animate-pulse h-40 bg-gray-100 rounded-xl"></div>
                  <div className="animate-pulse h-40 bg-gray-100 rounded-xl"></div>
                </div>
              ) : !feedingLogs || feedingLogs.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-xl">
                  <Utensils className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 font-poppins-light">
                    Chưa có lịch sử cho ăn cho booking này
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <h2 className="text-lg font-poppins-regular text-gray-800">
                    Lịch sử ({feedingLogs.length} lần cho ăn)
                  </h2>
                  {feedingLogs.map((log) => (
                    <div
                      key={log.id}
                      className="bg-linear-to-br from-white to-pink-50/30 rounded-xl p-5 shadow-sm border border-pink-100 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                            <Utensils className="w-6 h-6 text-pink-600" />
                          </div>
                          <div>
                            <h3 className="font-poppins-semibold text-gray-900">
                              Bé {log.pet.name}
                            </h3>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center font-poppins-regular gap-1 text-md text-gray-600">
                            <Clock className="w-4 h-4" />
                            {formatDMY(new Date(log.fedAt))}
                          </div>
                          <div className="text-sm font-poppins-light text-gray-500 mt-1">
                            Cho ăn vào lúc:{" "}
                            <span className="text-black font-poppins-medium">
                              {new Date(log.fedAt).toLocaleTimeString("vi-VN", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="bg-white rounded-lg p-4 border border-pink-100">
                          <div className="flex items-start gap-3">
                            {log.foodItem.images &&
                            log.foodItem.images.length > 0 ? (
                              <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0">
                                <Image
                                  src={log.foodItem.images[0].url}
                                  alt={log.foodItem.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            ) : (
                              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                                <Utensils className="w-8 h-8 text-gray-400" />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <h4 className="font-poppins-medium text-gray-900">
                                {log.foodItem.name}
                              </h4>
                              <p className="text-sm text-gray-600 line-clamp-2">
                                {log.foodItem.description}
                              </p>
                              <div className="flex items-center gap-2 mt-2">
                                <span className="px-2 py-1 bg-pink-100 text-pink-700 text-xs rounded-full font-poppins-medium">
                                  {log.foodItem.category.replace(/_/g, " ")}
                                </span>
                                {log.foodItem.price &&
                                  Number(log.foodItem.price) > 0 && (
                                    <span className="text-sm text-gray-600">
                                      {formatCurrency(
                                        Number(log.foodItem.price)
                                      )}
                                    </span>
                                  )}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="bg-white font-poppins-light rounded-lg p-3 border border-gray-100">
                            <p className="text-xs text-gray-500 mb-1">
                              Số lượng
                            </p>
                            <p className="font-poppins-regular text-gray-900">
                              {log.quantity}
                            </p>
                          </div>

                          <div className="bg-white rounded-lg p-3 border border-gray-100">
                            <p className="text-xs text-gray-500 font-poppins-light mb-1 flex items-center gap-1">
                              <User className="w-3 h-3" />
                              Người cho ăn
                            </p>
                            <p className="font-poppins-regular text-gray-900">
                              {log.fedByGroomer.firstName}{" "}
                              {log.fedByGroomer.lastName}
                            </p>
                          </div>
                        </div>

                        {log.notes && (
                          <div className="bg-amber-50 rounded-lg p-3 border border-amber-100">
                            <p className="text-xs text-amber-700 font-poppins-medium mb-1">
                              Ghi chú
                            </p>
                            <p className="text-sm text-amber-900">
                              {log.notes}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
