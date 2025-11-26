"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  XCircle,
  Loader,
  AlertTriangle,
  Home,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
} from "lucide-react";
import Link from "next/link";

export default function PaymentFailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [status, setStatus] = useState<"loading" | "failed">("loading");
  const [message, setMessage] = useState("");
  const [details, setDetails] = useState<Record<string, string>>({});
  const [showAllDetails, setShowAllDetails] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(5);

  const formatCurrency = (value?: string | null) => {
    if (!value) return "";
    const num = Number(value);
    if (!Number.isFinite(num)) return value;
    return num.toLocaleString("vi-VN") + "đ";
  };

  const copyToClipboard = (text: string, fieldKey: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldKey);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Define field configuration with priority levels
  const fieldConfig = [
    {
      key: "amount",
      label: "Số tiền",
      render: (v: string) => formatCurrency(v),
      priority: "high",
    },
    { key: "orderId", label: "Mã đơn hàng", priority: "high" },
    { key: "orderBookingId", label: "Mã đặt chỗ", priority: "high" },
    { key: "id", label: "Booking ID", priority: "high" },
    { key: "resultCode", label: "Mã lỗi", priority: "high" },
    { key: "type", label: "Loại giao dịch", priority: "medium" },
    { key: "transId", label: "Transaction ID", priority: "medium" },
    { key: "requestId", label: "Request ID", priority: "low" },
    { key: "orderInfo", label: "Nội dung", priority: "low" },
    { key: "status", label: "Trạng thái", priority: "low" },
  ];

  const visibleFields = fieldConfig.filter((field) => details[field.key]);
  const primaryFields = visibleFields.filter((f) => f.priority === "high");
  const secondaryFields = visibleFields.filter((f) => f.priority !== "high");

  useEffect(() => {
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

    if (!paymentStatus && !orderId) {
      setStatus("failed");
      setMessage(
        searchParams.get("message") || "Không tìm thấy thông tin giao dịch"
      );
      return;
    }

    setStatus("failed");
    setMessage(
      searchParams.get("message") ||
        searchParams.get("orderInfo") ||
        "Thanh toán thất bại. Vui lòng thử lại."
    );

    localStorage.removeItem("depositTxnRef");
    localStorage.removeItem("pendingBookingId");
    localStorage.removeItem("pendingPaymentMethod");
    localStorage.removeItem("pendingPayment");
    localStorage.removeItem("pendingOrderId");
    localStorage.removeItem("pendingHotelCheckIn");
    localStorage.removeItem("pendingHotelCheckOut");
  }, [searchParams]);

  useEffect(() => {
    if (status === "failed") {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            router.push("/");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [status, router]);

  return (
    <>
      <main className="min-h-screen bg-gradient-to-br from-primary/5 to-primary/10 pt-24 px-4 md:px-8 flex items-center justify-center">
        <div className="max-w-lg w-full">
          {status === "loading" && (
            <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-10 text-center">
              <div className="relative mx-auto w-20 h-20 mb-6">
                <div className="absolute inset-0 rounded-full bg-red-100 animate-ping opacity-30" />
                <div className="relative rounded-full bg-red-50 w-full h-full flex items-center justify-center">
                  <Loader className="w-10 h-10 text-red-500 animate-spin" />
                </div>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Đang xử lý...
              </h1>
              <p className="text-gray-500">Vui lòng chờ xác nhận giao dịch</p>
            </div>
          )}

          {status === "failed" && (
            <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 overflow-hidden">
              {/* Hero Error Section - Strong Visual Focus */}
              <div className="bg-gradient-to-br from-red-500 to-red-600 px-8 pt-10 pb-12 text-center text-white relative overflow-hidden">
                {/* Decorative circles */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

                <div className="relative">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm mb-5 ring-4 ring-white/10">
                    <XCircle
                      className="w-12 h-12 text-white"
                      strokeWidth={1.5}
                    />
                  </div>
                  <h1 className="text-2xl md:text-3xl font-bold mb-2 text-balance">
                    Thanh toán thất bại
                  </h1>
                  <p className="text-red-100 text-sm md:text-base max-w-xs mx-auto leading-relaxed">
                    {message}
                  </p>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-6 md:p-8 space-y-6">
                {/* Primary Transaction Details - Most Important Info */}
                {primaryFields.length > 0 && (
                  <div className="space-y-1">
                    <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
                      Thông tin giao dịch
                    </h2>
                    <div className="bg-gray-50 rounded-2xl divide-y divide-gray-100 overflow-hidden">
                      {primaryFields.map((field) => {
                        const value = details[field.key];
                        const displayValue = field.render
                          ? field.render(value)
                          : value;
                        const isAmount = field.key === "amount";

                        return (
                          <div
                            key={field.key}
                            className={`flex items-center justify-between px-4 py-3.5 group ${
                              isAmount ? "bg-red-50" : ""
                            }`}
                          >
                            <span className="text-sm text-gray-500">
                              {field.label}
                            </span>
                            <div className="flex items-center gap-2">
                              <span
                                className={`text-right ${
                                  isAmount
                                    ? "text-2xl font-bold text-red-600"
                                    : "font-medium text-gray-900"
                                }`}
                              >
                                {displayValue}
                              </span>
                              {!isAmount && (
                                <button
                                  onClick={() =>
                                    copyToClipboard(value, field.key)
                                  }
                                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-200 rounded"
                                  aria-label={`Copy ${field.label}`}
                                >
                                  {copiedField === field.key ? (
                                    <Check className="w-3.5 h-3.5 text-green-600" />
                                  ) : (
                                    <Copy className="w-3.5 h-3.5 text-gray-400" />
                                  )}
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Secondary Details - Expandable */}
                {secondaryFields.length > 0 && (
                  <div>
                    <button
                      onClick={() => setShowAllDetails(!showAllDetails)}
                      className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors w-full justify-center py-2"
                    >
                      <span>
                        {showAllDetails ? "Ẩn chi tiết" : "Xem thêm chi tiết"}
                      </span>
                      {showAllDetails ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>

                    {showAllDetails && (
                      <div className="mt-3 bg-gray-50 rounded-2xl divide-y divide-gray-100 overflow-hidden animate-in slide-in-from-top-2 duration-200">
                        {secondaryFields.map((field) => {
                          const value = details[field.key];
                          const displayValue = field.render
                            ? field.render(value)
                            : value;

                          return (
                            <div
                              key={field.key}
                              className="flex items-center justify-between px-4 py-3 text-sm group"
                            >
                              <span className="text-gray-500">
                                {field.label}
                              </span>
                              <div className="flex items-center gap-2">
                                <span className="text-gray-700 text-right max-w-[200px] truncate">
                                  {displayValue}
                                </span>
                                <button
                                  onClick={() =>
                                    copyToClipboard(value, field.key)
                                  }
                                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-200 rounded"
                                  aria-label={`Copy ${field.label}`}
                                >
                                  {copiedField === field.key ? (
                                    <Check className="w-3.5 h-3.5 text-green-600" />
                                  ) : (
                                    <Copy className="w-3.5 h-3.5 text-gray-400" />
                                  )}
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* Warning Notice - Subtle but Visible */}
                <div className="flex gap-3 p-4 bg-amber-50 border border-amber-100 rounded-xl">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                  </div>
                  <div className="text-sm">
                    <p className="font-medium text-amber-800 mb-0.5">
                      Giao dịch không thành công
                    </p>
                    <p className="text-amber-700 leading-relaxed">
                      Nếu số tiền đã bị trừ, vui lòng liên hệ bộ phận hỗ trợ
                      hoặc thử lại sau ít phút.
                    </p>
                  </div>
                </div>

                {/* Action Button with Countdown */}
                <div className="pt-2">
                  <Link
                    href="/"
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-all shadow-lg shadow-red-500/25 hover:shadow-red-500/40 hover:-translate-y-0.5 text-sm"
                  >
                    <Home className="w-4 h-4" />
                    <span>Về trang chủ ({countdown}s)</span>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
