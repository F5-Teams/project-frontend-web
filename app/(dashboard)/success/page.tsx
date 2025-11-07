"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle, XCircle, Loader } from "lucide-react";
import Link from "next/link";
import Header from "@/components/shared/Header";

export default function VNPayReturnPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "failed">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Get parameters from URL
    const paymentStatus = searchParams.get("status");
    const userId = searchParams.get("userId");
    const depositAmount = searchParams.get("amount");

    if (!paymentStatus || !userId) {
      setStatus("failed");
      setMessage("Không tìm thấy thông tin giao dịch");
      return;
    }

    // Process based on status
    if (paymentStatus === "success") {
      setStatus("success");
      setMessage(`Nạp tiền thành công! Số tiền: ${depositAmount ? parseInt(depositAmount).toLocaleString('vi-VN') : '0'} ₫`);
      // Clear deposit transaction ref
      localStorage.removeItem("depositTxnRef");
      // Redirect to wallet after 3 seconds
      setTimeout(() => {
        router.push("/wallet");
      }, 3000);
    } else if (paymentStatus === "failed") {
      setStatus("failed");
      setMessage("Nạp tiền thất bại. Vui lòng thử lại.");
    } else {
      setStatus("failed");
      setMessage("Trạng thái giao dịch không rõ. Vui lòng thử lại.");
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
              <h1 className="font-poppins-regular text-2xl font-bold text-gray-800 mb-2">
                Đang xử lý...
              </h1>
              <p className="font-poppins-light text-gray-600">
                Vui lòng chờ trong khi chúng tôi xác nhận giao dịch của bạn
              </p>
            </div>
          )}

          {status === "success" && (
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              <h1 className="font-poppins-regular text-2xl font-bold text-gray-800 mb-2">
                Nạp tiền thành công!
              </h1>
              <p className="font-poppins-light text-gray-600 mb-6">
                {message}
              </p>
              <p className="text-sm text-gray-500 font-poppins-light">
                Tự động quay lại trang ví trong 3 giây...
              </p>
              <Link
                href="/wallet"
                className="inline-block mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-poppins-regular font-semibold"
              >
                Quay lại ví
              </Link>
            </div>
          )}

          {status === "failed" && (
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <div className="bg-red-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <XCircle className="w-12 h-12 text-red-600" />
              </div>
              <h1 className="font-poppins-regular text-2xl font-bold text-gray-800 mb-2">
                Nạp tiền thất bại
              </h1>
              <p className="font-poppins-light text-gray-600 mb-6">
                {message}
              </p>
              <div className="flex gap-3">
                <Link
                  href="/wallet"
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-poppins-regular font-semibold"
                >
                  Quay lại ví
                </Link>
                <Link
                  href="/wallet"
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-poppins-regular font-semibold"
                >
                  Thử lại
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
