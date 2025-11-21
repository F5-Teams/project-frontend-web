"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cart.store";

export default function PaymentCallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { clearCart } = useCartStore();
  const [status, setStatus] = useState<"processing" | "success" | "failed">(
    "processing"
  );
  const [message, setMessage] = useState("Đang xử lý thanh toán...");

  useEffect(() => {
    // Get payment result from URL params
    const responseCode =
      searchParams.get("vnp_ResponseCode") || searchParams.get("resultCode");
    const orderBookingId =
      searchParams.get("vnp_TxnRef") || searchParams.get("orderId");
    const paymentMethod = localStorage.getItem("pendingPaymentMethod");

    // Process payment result
    const processPayment = async () => {
      try {
        // VNPay: responseCode = "00" means success
        // MoMo: resultCode = "0" means success
        const isSuccess = responseCode === "00" || responseCode === "0";

        if (isSuccess) {
          setStatus("success");
          setMessage(
            `Thanh toán qua ${paymentMethod} thành công! Đơn đặt của bạn đã được xác nhận.`
          );

          // Clear cart after successful payment
          clearCart();

          // Clear pending booking info
          localStorage.removeItem("pendingBookingId");
          localStorage.removeItem("pendingPaymentMethod");

          // Redirect to booking history after 3 seconds
          setTimeout(() => {
            router.push("/profile/calendar");
          }, 3000);
        } else {
          setStatus("failed");
          const failedMsg = `Thanh toán qua ${paymentMethod} không thành công. Vui lòng thử lại hoặc chọn phương thức thanh toán khác.`;
          setMessage(failedMsg);

          // Clear pending booking info
          localStorage.removeItem("pendingBookingId");
          localStorage.removeItem("pendingPaymentMethod");
        }
      } catch (error) {
        console.error("Payment callback error:", error);
        setStatus("failed");
        setMessage(
          "Đã có lỗi xảy ra khi xử lý thanh toán. Vui lòng liên hệ hỗ trợ."
        );
      }
    };

    processPayment();
  }, [searchParams, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Kết quả thanh toán</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center justify-center space-y-4">
            {status === "processing" && (
              <>
                <Loader2 className="h-16 w-16 animate-spin text-blue-500" />
                <p className="text-center text-gray-600">{message}</p>
              </>
            )}

            {status === "success" && (
              <>
                <CheckCircle className="h-16 w-16 text-green-500" />
                <p className="text-center text-gray-600">{message}</p>
                <p className="text-sm text-gray-500">
                  Bạn sẽ được chuyển hướng đến lịch sử đặt lịch...
                </p>
              </>
            )}

            {status === "failed" && (
              <>
                <XCircle className="h-16 w-16 text-red-500" />
                <p className="text-center text-gray-600">{message}</p>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => router.push("/")}>
                    Về trang chủ
                  </Button>
                  <Button onClick={() => router.push("/profile/calendar")}>
                    Xem lịch đặt
                  </Button>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
