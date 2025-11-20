"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle, XCircle, Loader } from "lucide-react";
import Link from "next/link";
import Header from "@/components/shared/Header";

export default function PaymentReturnPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [status, setStatus] = useState<"loading" | "success" | "failed">(
    "loading"
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    const paymentStatus = searchParams.get("status"); // VNPay
    const orderId =
      searchParams.get("orderId") || searchParams.get("orderBookingId"); // VNPay + Momo
    const depositAmount = searchParams.get("amount");

    // ============================
    // 🔥 1. CASE MOMO
    // Momo chỉ trả orderId, không có status
    // ============================
    if (!paymentStatus && orderId) {
      setStatus("success");
      setMessage(`Thanh toán MOMO thành công! Mã đơn: ${orderId}`);

      // Xóa cache
      localStorage.removeItem("pendingPayment");
      localStorage.removeItem("pendingOrderId");

      setTimeout(() => {
        router.push("/");
      }, 3000);

      return;
    }

    // ============================
    // 🔥 2. CASE VNPAY
    // Có status → VNPay
    // ============================
    if (!paymentStatus || !orderId) {
      setStatus("failed");
      setMessage("Không tìm thấy thông tin giao dịch");
      return;
    }

    if (paymentStatus === "success") {
      setStatus("success");
      setMessage(`Thanh toán thành công! Mã đơn: ${orderId}`);

      localStorage.removeItem("depositTxnRef");
      localStorage.removeItem("pendingBookingId");
      localStorage.removeItem("pendingPaymentMethod");

      setTimeout(() => {
        router.push("/");
      }, 3000);
    } else {
      setStatus("failed");
      setMessage("Thanh toán thất bại. Vui lòng thử lại.");
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
              <p className="text-sm text-gray-500">
                Tự động quay lại trang chủ trong 3 giây...
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
