/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useBookingById } from "@/services/profile/profile-schedule/hooks";
import { ArrowLeft, Calendar, Clock, User, CreditCard } from "lucide-react";
import Image from "next/image";
import { formatDateTime24 } from "@/utils/date";
import { formatCurrency } from "@/utils/currency";
import {
  getBookingStatusText,
  getBookingStatusColor,
  getBookingTitle,
} from "@/services/profile/profile-schedule/hooks";
import { Button } from "@/components/ui/button";
import RefundModal from "@/components/profile/RefundModal";
import ServiceTagList from "@/components/profile/calendar/ServiceTagList";
import FeedbackForm from "@/components/profile/calendar/FeedbackModal";
import { useGetBookingFeedback } from "@/services/profile/feedback/hooks";
import { Star } from "lucide-react";
import CancelBookingDialog from "@/components/profile/calendar/CancelBookingDialog";

export default function BookingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const bookingId = params?.id ? Number(params.id) : null;

  const { data: booking, isLoading, error } = useBookingById(bookingId);
  const { data: feedback } = useGetBookingFeedback(bookingId);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg font-poppins-light">
            Không tìm thấy booking
          </p>
          <Button
            onClick={() => router.back()}
            className="mt-4"
            variant="outline"
          >
            Quay lại
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white/40 backdrop-blur shadow-lg rounded-2xl p-4">
      <div className="max-w-6xl mx-2">
        <div className="mb-2">
          <Button
            onClick={() => router.back()}
            variant="ghost"
            className="flex items-center gap-2 mb-2 -ml-2"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-poppins-light">Quay lại</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
          {/* Left Column */}
          <div className="space-y-2">
            {/* Booking Info Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-linear-to-r from-primary/10 to-secondary/10 px-6 py-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-poppins-regular text-gray-900">
                      {getBookingTitle(booking)}
                    </h2>
                    <p className="text-sm text-gray-800 mt-1">
                      Mã booking:{" "}
                      <span className="font-poppins-light">
                        {booking.bookingCode}
                      </span>
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-poppins-medium ${
                        booking.type === "HOTEL"
                          ? "bg-primary text-white"
                          : "bg-secondary text-white"
                      }`}
                    >
                      {booking.type}
                    </span>
                    <span
                      className={`text-sm font-poppins-light ${getBookingStatusColor(
                        booking.status
                      )}`}
                    >
                      {getBookingStatusText(booking.status)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="py-4 px-6 space-y-2">
                {/* Pet Info */}
                <div className="flex items-start gap-4">
                  <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-primary/20 shrink-0">
                    {booking.pet?.imageUrl ? (
                      <Image
                        src={booking.pet.imageUrl}
                        alt={booking.pet.name}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <User className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">
                      Boss yêu của bạn
                    </div>
                    <div className="text-xl font-poppins-semibold text-gray-900">
                      {booking.pet?.name}
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-6 space-y-4">
                  {/* Time Info */}
                  {booking.bookingDate && (
                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <div className="text-sm font-poppins-light text-gray-600">
                          Ngày đặt
                        </div>
                        <div className="font-poppins-regular text-gray-900">
                          {formatDateTime24(booking.createdAt)}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Groomer Info */}
                  {booking.groomer && (
                    <div className="flex items-start gap-3">
                      <User className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <div className="text-sm font-poppins-light text-gray-600">
                          Nhân viên chăm sóc
                        </div>
                        <div className="font-poppins-regular text-gray-900">
                          {booking.groomer.name}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Note */}
                  {booking.note && (
                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <div className="text-sm font-poppins-light text-gray-600">
                          Ghi chú
                        </div>
                        <div className="text-gray-900 font-poppins-regular">
                          {booking.note}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Feedback Section */}
            {booking.status === "COMPLETED" && (
              <>
                {feedback ? (
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-lg font-poppins-regular text-gray-900 mb-4">
                      Đánh giá của bạn
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm font-poppins-light text-gray-600 mb-2">
                          Số sao
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                size={20}
                                className={
                                  i < feedback.rating
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300"
                                }
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-600 font-poppins-light">
                            {feedback.rating}/5
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 font-poppins-light mt-2">
                          Đánh giá vào {formatDateTime24(feedback.createdAt)}
                        </div>
                      </div>
                      {feedback.comment && (
                        <div>
                          <div className="text-sm font-poppins-light text-gray-600 mb-2">
                            Nhận xét
                          </div>
                          <p className="text-gray-900 text-sm font-poppins-regular">
                            {feedback.comment}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  booking.canLeaveFeedback && (
                    <FeedbackForm bookingId={booking.id} />
                  )
                )}
              </>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-2">
            {/* Service Details */}
            {(booking.combo || booking.room) && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-poppins-regular text-gray-900 mb-4">
                  Chi tiết dịch vụ
                </h3>
                {booking.slot?.startDate && booking.slot?.endDate && (
                  <div className="mb-4 pb-4 border-b border-gray-100">
                    <div className="text-sm font-poppins-light text-gray-600 mb-1">
                      Thời gian dịch vụ
                    </div>
                    <div className="font-poppins-regular text-gray-900">
                      {formatDateTime24(booking.slot.startDate)} -{" "}
                      {formatDateTime24(booking.slot.endDate)}
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {booking.combo && (
                    <div className="md:col-span-2">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <div className="text-sm font-poppins-light text-gray-600 mb-2">
                            Gói dịch vụ
                          </div>
                          <div className="font-poppins-regular text-gray-900 mb-3">
                            {booking.combo.name}
                          </div>
                        </div>
                        {booking.combo.services &&
                          booking.combo.services.length > 0 && (
                            <div>
                              <div className="text-sm font-poppins-light text-gray-600 mb-2">
                                Bao gồm
                              </div>
                              <ServiceTagList items={booking.combo.services} />
                            </div>
                          )}
                      </div>
                    </div>
                  )}
                  {booking.room && (
                    <div>
                      <div className="text-sm font-poppins-light text-gray-600 mb-2">
                        Loại phòng:{" "}
                        <span className="text-black text-md">
                          {booking.room.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        {booking.room.imageUrl && (
                          <Image
                            src={booking.room.imageUrl}
                            alt={booking.room.name}
                            width={300}
                            height={300}
                            className="rounded-lg object-cover"
                          />
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Payment Info */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-poppins-regular text-gray-900 mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Thông tin giao dịch
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 font-poppins-light">
                    Tổng tiền
                  </span>
                  <span className="text-lg font-poppins-medium text-gray-900">
                    {formatCurrency(booking.totalPrice)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 font-poppins-light">
                    Trạng thái thanh toán
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-poppins-regular ${
                      booking.isPaid
                        ? "bg-green-100 text-green-700"
                        : "bg-orange-100 text-orange-700"
                    }`}
                  >
                    {booking.isPaid ? "Đã thanh toán" : "Chưa thanh toán"}
                  </span>
                </div>
                {booking.paymentSummary && (
                  <>
                    <div className="border-t border-gray-100 pt-3 mt-3 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 font-poppins-light">
                          Phương thức
                        </span>
                        <span className="font-poppins-regular text-gray-900">
                          {booking.paymentSummary.method === "CASH"
                            ? "Tiền mặt"
                            : booking.paymentSummary.method === "WALLET"
                            ? "Ví nội bộ"
                            : booking.paymentSummary.method === "MOMO"
                            ? "MoMo"
                            : booking.paymentSummary.method === "VNPAY"
                            ? "VNPay"
                            : booking.paymentSummary.method}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm ">
                        <span className="text-gray-600 font-poppins-light">
                          Ngày thanh toán
                        </span>
                        <span className="font-poppins-regular text-gray-900">
                          {formatDateTime24(booking.paymentSummary.date)}
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
            {booking.status === "COMPLETED" &&
              (() => {
                const canRequestRefund = Boolean(bookingId && booking.isPaid);
                let reason = "";
                if (!bookingId) reason = "Không có booking";
                else if (!booking.isPaid) reason = "Chưa thanh toán";

                return (
                  <RefundModal
                    bookingId={bookingId}
                    canRequestRefund={canRequestRefund}
                    reasonLabel={reason}
                  />
                );
              })()}

            {["CONFIRMED", "PENDING", "ON_PROGRESSING"].includes(
              booking.status
            ) &&
              bookingId && <CancelBookingDialog bookingId={bookingId} />}

            {/* Images */}
            {booking.imagesBooking && booking.imagesBooking.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-poppins-semibold text-gray-900 mb-4">
                  Hình ảnh
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {booking.imagesBooking.map((img) => (
                    <div key={img.id} className="relative">
                      <Image
                        src={img.imageUrl}
                        alt={img.type}
                        width={200}
                        height={200}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <span className="absolute top-2 right-2 px-2 py-1 bg-black/60 text-white text-xs rounded">
                        {img.type === "BEFORE" ? "Trước" : "Sau"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
