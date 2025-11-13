"use client";

import { useGetWallet } from "@/services/wallets/hooks";
import { Wallet as WalletIcon, Download, RefreshCw } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import Link from "next/link";
import Header from "@/components/shared/Header";

export default function WalletPage() {
  const { data: wallet, isLoading, refetch } = useGetWallet();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-primary/10 flex items-center justify-center">
        <Header />
        <div className="animate-spin">
          <RefreshCw className="w-8 h-8 text-primary" />
        </div>
      </div>
    );
  }

  if (!wallet) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-primary/10 flex items-center justify-center">
        <Header />
        <div className="text-center">
          <p className="text-gray-600 mb-4">Không tìm thấy ví của bạn</p>
          <Link href="/" className="btn-primary">
            Quay lại trang chủ
          </Link>
        </div>
      </div>
    );
  }

  const formatCurrency = (amount: string) => {
    return parseInt(amount).toLocaleString("vi-VN");
  };

  const getTransactionTypeLabel = (type: string) => {
    const typeMap: Record<string, { label: string; color: string }> = {
      PAYMENT: { label: "Thanh toán", color: "text-red-500" },
      REFUND: { label: "Hoàn tiền", color: "text-green-500" },
      TOP_UP: { label: "Nạp tiền", color: "text-blue-500" },
      WITHDRAWAL: { label: "Rút tiền", color: "text-orange-500" },
    };
    return typeMap[type] || { label: type, color: "text-gray-500" };
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<
      string,
      { label: string; bgColor: string; textColor: string }
    > = {
      PENDING: {
        label: "Đang xử lý",
        bgColor: "bg-yellow-100",
        textColor: "text-yellow-800",
      },
      SUCCESS: {
        label: "Thành công",
        bgColor: "bg-green-100",
        textColor: "text-green-800",
      },
      FAILED: {
        label: "Thất bại",
        bgColor: "bg-red-100",
        textColor: "text-red-800",
      },
      CANCELLED: {
        label: "Đã hủy",
        bgColor: "bg-gray-100",
        textColor: "text-gray-800",
      },
    };
    return (
      statusMap[status] || {
        label: status,
        bgColor: "bg-gray-100",
        textColor: "text-gray-800",
      }
    );
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-primary/5 to-primary/10 pt-24 px-4 md:px-8 flex flex-col">
        <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col">
          {/* Header */}
          <div className="mb-8 mt-4">
            <h1 className="font-poppins-regular text-3xl md:text-4xl font-bold text-gray-800 flex items-center gap-3">
              <div className="bg-primary/20 p-3 rounded-lg">
                <WalletIcon className="w-8 h-8 text-primary" />
              </div>
              Ví của tôi
            </h1>
          </div>

          {/* Content Wrapper - Rounded top with white background */}
          <div className="rounded-t-3xl bg-white overflow-hidden flex-1 flex flex-col">
            {/* Balance Card */}
            <div className="bg-gradient-to-br from-primary to-primary/80 rounded-t-3xl p-8 text-white">
              <div className="flex items-start justify-between mb-12">
                <div>
                  <p className="font-poppins-light text-white/80 text-sm mb-2">
                    Số dư hiện tại
                  </p>
                  <h2 className="font-poppins-regular text-4xl md:text-5xl font-bold">
                    {formatCurrency(wallet.balance)} ₫
                  </h2>
                </div>
              </div>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 bg-white/10 backdrop-blur rounded-lg p-4">
                  <p className="text-white/70 text-xs font-poppins-light mb-1">
                    Trạng thái
                  </p>
                  <p className="font-poppins-regular font-semibold">
                    {wallet.status === "ACTIVE" ? "Hoạt động" : wallet.status}
                  </p>
                </div>
                <div className="flex-1 bg-white/10 backdrop-blur rounded-lg p-4">
                  <p className="text-white/70 text-xs font-poppins-light mb-1">
                    Ngày tạo
                  </p>
                  <p className="font-poppins-regular font-semibold">
                    {new Date(wallet.createdAt).toLocaleDateString("vi-VN")}
                  </p>
                </div>
              </div>
            </div>

            {/* Transactions */}
            <div className="bg-white overflow-hidden flex-1 flex flex-col">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <h3 className="font-poppins-regular text-xl font-bold text-gray-800 flex items-center gap-2">
                  <Download className="w-5 h-5 text-primary" />
                  Lịch sử giao dịch
                </h3>
                <button
                  onClick={() => refetch()}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Tải lại"
                >
                  <RefreshCw className="w-5 h-5 text-primary hover:text-primary/80 transition-colors" />
                </button>
              </div>

              {wallet.transactions && wallet.transactions.length > 0 ? (
                <div className="divide-y divide-gray-200 flex-1 overflow-y-auto">
                  {wallet.transactions.map((transaction) => {
                    const typeInfo = getTransactionTypeLabel(transaction.type);
                    const statusInfo = getStatusBadge(transaction.status);

                    return (
                      <div
                        key={transaction.id}
                        className="p-6 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-4 flex-1">
                            <div className="bg-primary/10 p-3 rounded-lg">
                              <Download
                                className={`w-5 h-5 ${typeInfo.color}`}
                              />
                            </div>
                            <div className="flex-1">
                              <p className="font-poppins-regular font-semibold text-gray-800">
                                {typeInfo.label}
                              </p>
                              <p className="font-poppins-light text-sm text-gray-500">
                                {formatDistanceToNow(
                                  new Date(transaction.createdAt),
                                  {
                                    addSuffix: true,
                                    locale: vi,
                                  }
                                )}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p
                              className={`font-poppins-regular font-bold text-lg ${typeInfo.color}`}
                            >
                              {transaction.type === "PAYMENT" ||
                              transaction.type === "WITHDRAWAL"
                                ? "-"
                                : "+"}
                              {formatCurrency(transaction.amount)} ₫
                            </p>
                            <p className="font-poppins-light text-xs text-gray-500 mt-1">
                              Số dư: {formatCurrency(transaction.balanceAfter)}{" "}
                              ₫
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div />
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-poppins-regular font-semibold ${statusInfo.bgColor} ${statusInfo.textColor}`}
                          >
                            {statusInfo.label}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-12 text-center">
                  <WalletIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="font-poppins-light text-gray-500">
                    Không có giao dịch nào
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
