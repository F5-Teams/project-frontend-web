"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle, XCircle, Loader } from "lucide-react";
import Link from "next/link";
import Header from "@/components/shared/Header";
import { useCartStore } from "@/stores/cart.store";
import { useQueryClient } from "@tanstack/react-query";

export default function PaymentReturnPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { clearCart } = useCartStore();
  const queryClient = useQueryClient();

  const [status, setStatus] = useState<"loading" | "success" | "failed">(
    "loading"
  );

  const [message, setMessage] = useState("");
  const [details, setDetails] = useState<Record<string, string>>({});

  const formatCurrency = (value?: string | null) => {
    if (!value) return "";
    const num = Number(value);
    if (!Number.isFinite(num)) return value;
    return num.toLocaleString("vi-VN") + "đ";
  };

  useEffect(() => {
    // Snapshot all params for display
    const paramsObject: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      paramsObject[key] = value;
    });
    setDetails(paramsObject);

    const paymentStatus =
      searchParams.get("payment_status") || searchParams.get("status");

    const orderId =
      searchParams.get("id") ||
      searchParams.get("orderId") ||
      searchParams.get("orderBookingId");

    const depositAmount = searchParams.get("amount");

    if (!paymentStatus && orderId) {
      setStatus("success");
      setMessage(
        searchParams.get("message") ||
          `Thanh toán MOMO thành công! Mã đơn: ${orderId}`
      );

      clearCart();

      queryClient.invalidateQueries({
        predicate: (query) => {
          const queryKey = query.queryKey as string[];
          return queryKey[0] === "hotel" || queryKey[0] === "rooms";
        },
        refetchType: "active",
      });

      if (typeof window !== "undefined") {
        const checkIn = localStorage.getItem("pendingHotelCheckIn");
        const checkOut = localStorage.getItem("pendingHotelCheckOut");
        if (checkIn && checkOut) {
          window.dispatchEvent(
            new CustomEvent("hotelBookingSuccess", {
              detail: { checkIn, checkOut },
            })
          );
        }
      }

      localStorage.removeItem("pendingPayment");
      localStorage.removeItem("pendingOrderId");
      localStorage.removeItem("pendingHotelCheckIn");
      localStorage.removeItem("pendingHotelCheckOut");

      setTimeout(() => {
        router.push("/");
      }, 5000);

      return;
    }

    if (!paymentStatus || !orderId) {
      setStatus("failed");
      setMessage(
        searchParams.get("message") || "Không tìm thấy thông tin giao dịch"
      );
      return;
    }

    const isSuccess =
      paymentStatus === "success" ||
      paymentStatus === "ok" ||
      paymentStatus === "00" ||
      paymentStatus === "0";

    if (isSuccess) {
      setStatus("success");
      setMessage(
        searchParams.get("message") ||
          `Thanh toán thành công! Mã đơn: ${orderId}`
      );

      // Xóa cart sau khi thanh toán thành công
      clearCart();

      // Invalidate hotel rooms cache to refresh room status
      queryClient.invalidateQueries({
        predicate: (query) => {
          const queryKey = query.queryKey as string[];
          return queryKey[0] === "hotel" || queryKey[0] === "rooms";
        },
        refetchType: "active",
      });

      // Trigger custom event to notify hotel page to refetch with saved dates
      if (typeof window !== "undefined") {
        const checkIn = localStorage.getItem("pendingHotelCheckIn");
        const checkOut = localStorage.getItem("pendingHotelCheckOut");
        if (checkIn && checkOut) {
          window.dispatchEvent(
            new CustomEvent("hotelBookingSuccess", {
              detail: { checkIn, checkOut },
            })
          );
        }
      }

      localStorage.removeItem("depositTxnRef");
      localStorage.removeItem("pendingBookingId");
      localStorage.removeItem("pendingPaymentMethod");
      localStorage.removeItem("pendingHotelCheckIn");
      localStorage.removeItem("pendingHotelCheckOut");

      setTimeout(() => {
        router.push("/");
      }, 5000);
    } else {
      setStatus("failed");
      setMessage(
        searchParams.get("message") ||
          "Thanh toán thất bại. Vui lòng thử lại."
      );
    }
  }, [searchParams, router]);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-primary/5 to-primary/10 pt-24 px-4 md:px-8 flex items-center justify-center">
        <div className="max-w-md w-full">
          {status === "loading" && (
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <Loader className="w-16 h-16 text-primary mx-auto mb-4 animate-spin" />
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                Đang xử lý...
              </h1>
              <p className="text-gray-600">Vui lòng chờ xác nhận giao dịch</p>
            </div>
          )}

          {status === "success" && (
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                Thanh toán thành công!
              </h1>
              <p className="text-gray-600 mb-6">{message}</p>
              <div className="text-left bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4 space-y-2">
                {[
                  { key: "type", label: "Loại giao dịch" },
                  { key: "id", label: "Booking ID" },
                  { key: "orderId", label: "Mã đơn" },
                  { key: "orderBookingId", label: "Mã đơn" },
                  { key: "requestId", label: "Request ID" },
                  { key: "transId", label: "Transaction ID" },
                  {
                    key: "amount",
                    label: "Số tiền",
                    render: (v: string) => formatCurrency(v),
                  },
                  { key: "orderInfo", label: "Nội dung" },
                  { key: "message", label: "Thông báo" },
                  { key: "status", label: "Trạng thái" },
                ].map((field) => {
                  const value = details[field.key];
                  if (!value) return null;
                  return (
                    <div
                      key={field.key}
                      className="flex items-start justify-between text-sm text-gray-700"
                    >
                      <span className="font-medium">{field.label}</span>
                      <span className="text-gray-600 text-right">
                        {field.render ? field.render(value) : value}
                      </span>
                    </div>
                  );
                })}
              </div>
              <p className="text-sm text-gray-500">
                Tự động quay lại trang chủ trong 5 giây...
              </p>
              <Link
                href="/"
                className="inline-block mt-4 px-6 py-2 bg-primary text-white rounded-lg"
              >
                Quay lại trang chủ
              </Link>
            </div>
          )}

          {status === "failed" && (
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <div className="bg-red-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <XCircle className="w-12 h-12 text-red-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                Thanh toán thất bại
              </h1>
              <p className="text-gray-600 mb-6">{message}</p>
              <div className="flex gap-3">
                <Link
                  href="/"
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg"
                >
                  Về trang chủ
                </Link>
                <Link
                  href="/profile/calendar"
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg"
                >
                  Xem lịch đặt
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
