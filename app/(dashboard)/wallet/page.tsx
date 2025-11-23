"use client";

import { useGetWallet, useTransactionHistory } from "@/services/wallets/hooks";
import {
  Wallet as WalletIcon,
  RefreshCw,
  CreditCard,
  TrendingUp,
  TrendingDown,
  Filter,
  ArrowLeft,
  CalendarIcon,
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { vi } from "date-fns/locale";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { TransactionType, PaymentMethod } from "@/services/wallets/type";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function WalletPage() {
  const router = useRouter();
  const { data: wallet, isLoading } = useGetWallet();
  const [page, setPage] = useState(1);
  const [filterType, setFilterType] = useState<TransactionType | undefined>(
    undefined
  );
  const [filterPaymentMethod, setFilterPaymentMethod] = useState<
    PaymentMethod | undefined
  >(undefined);
  const [filterStartDate, setFilterStartDate] = useState<Date | undefined>(
    undefined
  );
  const [filterEndDate, setFilterEndDate] = useState<Date | undefined>(
    undefined
  );

  const {
    data: transactionHistory,
    isLoading: isLoadingTransactions,
    refetch,
  } = useTransactionHistory({
    page,
    limit: 10,
    type: filterType,
    paymentMethod: filterPaymentMethod,
    startDate: filterStartDate
      ? format(filterStartDate, "yyyy-MM-dd")
      : undefined,
    endDate: filterEndDate ? format(filterEndDate, "yyyy-MM-dd") : undefined,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-primary/5 to-primary/10 flex items-center justify-center">
        <div className="animate-spin">
          <RefreshCw className="w-8 h-8 text-primary" />
        </div>
      </div>
    );
  }

  if (!wallet) {
    return (
      <div className="min-h-screen bg-linear-to-br from-primary/5 to-primary/10 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Không tìm thấy ví của bạn</p>
          <Link href="/" className="btn-primary">
            Quay lại trang chủ
          </Link>
        </div>
      </div>
    );
  }

  const formatCurrency = (amount: string | number) => {
    return Number(amount).toLocaleString("vi-VN");
  };

  const getTransactionTypeLabel = (type: string) => {
    const typeMap: Record<
      string,
      { label: string; color: string; icon: "up" | "down" }
    > = {
      WALLET_PAYMENT: {
        label: "Thanh toán từ ví",
        color: "text-red-500",
        icon: "down",
      },
      WALLET_REFUND: {
        label: "Hoàn tiền về ví",
        color: "text-green-500",
        icon: "up",
      },
      WALLET_DEPOSIT: {
        label: "Nạp tiền vào ví",
        color: "text-blue-500",
        icon: "up",
      },
      WALLET_WITHDRAW: {
        label: "Rút tiền từ ví",
        color: "text-orange-500",
        icon: "down",
      },
      BOOKING_PAYMENT: {
        label: "Thanh toán booking",
        color: "text-red-500",
        icon: "down",
      },
      ORDER_PAYMENT: {
        label: "Thanh toán đơn hàng",
        color: "text-red-500",
        icon: "down",
      },
      WITHDRAW: { label: "Rút tiền", color: "text-orange-500", icon: "down" },
    };
    return (
      typeMap[type] || {
        label: type,
        color: "text-gray-500",
        icon: "down" as const,
      }
    );
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
      SUCCEED: {
        label: "Thành công",
        bgColor: "bg-green-100",
        textColor: "text-green-800",
      },
      FAILED: {
        label: "Thất bại",
        bgColor: "bg-red-100",
        textColor: "text-red-800",
      },
      REFUNDED: {
        label: "Đã hoàn tiền",
        bgColor: "bg-blue-100",
        textColor: "text-blue-800",
      },
      PAID: {
        label: "Đã thanh toán",
        bgColor: "bg-green-100",
        textColor: "text-green-800",
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

  const transactionTypes: { value: TransactionType; label: string }[] = [
    { value: "WALLET_DEPOSIT", label: "Nạp tiền vào ví" },
    { value: "WALLET_WITHDRAW", label: "Rút tiền từ ví" },
    { value: "WALLET_PAYMENT", label: "Thanh toán từ ví" },
    { value: "WALLET_REFUND", label: "Hoàn tiền về ví" },
    { value: "BOOKING_PAYMENT", label: "Thanh toán booking" },
    { value: "ORDER_PAYMENT", label: "Thanh toán đơn hàng" },
    { value: "WITHDRAW", label: "Rút tiền" },
  ];

  const paymentMethods: { value: PaymentMethod; label: string }[] = [
    { value: "CASH", label: "Tiền mặt" },
    { value: "BANK_TRANSFER", label: "Chuyển khoản" },
    { value: "WALLET", label: "Ví" },
    { value: "MOMO", label: "MoMo" },
    { value: "VNPAY", label: "VNPay" },
    { value: "PAYOS", label: "PayOS" },
  ];

  return (
    <main className="min-h-screen bg-linear-to-br from-primary/5 to-primary/10 px-2 md:px-4 py-4">
      <div className="max-w-8xl px-4 mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-700 hover:text-primary transition-colors mb-3 font-poppins-light"
        >
          <ArrowLeft className="w-5 h-5" />
          Quay lại
        </button>

        {/* Wallet Card */}
        <div className="mb-6 flex justify-start">
          <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
            <div className="relative">
              <div className="bg-linear-to-br from-primary via-primary/90 to-primary/70 px-8 pt-6 pb-2">
                <div className="mb-2">
                  <div className="flex items-center gap-2 mb-2">
                    <CreditCard className="w-5 h-5 text-white/70" />
                    <p className="font-poppins-light text-white/80 text-sm">
                      Số dư khả dụng
                    </p>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-poppins-regular text-white">
                    {formatCurrency(wallet.balance)} VNĐ
                  </h2>
                </div>
              </div>

              <div className="bg-white px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 font-poppins-light">
                      Trạng thái:
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-poppins-medium ${
                        wallet.status === "ACTIVE"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {wallet.status === "ACTIVE" ? "Hoạt động" : wallet.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 font-poppins-light">
                      Ngày tạo:
                    </span>
                    <span className="text-sm font-poppins-medium text-gray-900">
                      {new Date(wallet.createdAt).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="grid my-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Loại giao dịch */}
          <div>
            <label className="block text-xs font-poppins-light text-gray-600 mb-1.5">
              Loại giao dịch
            </label>
            <select
              value={filterType || "all"}
              onChange={(e) => {
                setFilterType(
                  e.target.value === "all"
                    ? undefined
                    : (e.target.value as TransactionType)
                );
                setPage(1);
              }}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg font-poppins-light text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="all">Tất cả</option>
              {transactionTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Phương thức thanh toán */}
          <div>
            <label className="block text-xs font-poppins-light text-gray-600 mb-1.5">
              Phương thức
            </label>
            <select
              value={filterPaymentMethod || "all"}
              onChange={(e) => {
                setFilterPaymentMethod(
                  e.target.value === "all"
                    ? undefined
                    : (e.target.value as PaymentMethod)
                );
                setPage(1);
              }}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg font-poppins-light text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="all">Tất cả</option>
              {paymentMethods.map((method) => (
                <option key={method.value} value={method.value}>
                  {method.label}
                </option>
              ))}
            </select>
          </div>

          {/* Ngày bắt đầu */}
          <div>
            <label className="block text-xs font-poppins-light text-gray-600 mb-1.5">
              Ngày bắt đầu
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-poppins-light text-sm h-10"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filterStartDate ? (
                    format(filterStartDate, "dd/MM/yyyy")
                  ) : (
                    <span className="text-gray-500">Chọn ngày</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={filterStartDate}
                  onSelect={(date) => {
                    setFilterStartDate(date);
                    setPage(1);
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Ngày kết thúc */}
          <div>
            <label className="block text-xs font-poppins-light text-gray-600 mb-1.5">
              Ngày kết thúc
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-poppins-light text-sm h-10"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filterEndDate ? (
                    format(filterEndDate, "dd/MM/yyyy")
                  ) : (
                    <span className="text-gray-500">Chọn ngày</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={filterEndDate}
                  onSelect={(date) => {
                    setFilterEndDate(date);
                    setPage(1);
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Reset button */}
          <div className="flex items-end">
            <button
              onClick={() => {
                setFilterType(undefined);
                setFilterPaymentMethod(undefined);
                setFilterStartDate(undefined);
                setFilterEndDate(undefined);
                setPage(1);
              }}
              className="w-full h-10 px-4 bg-gray-100 hover:bg-gray-200 rounded-lg font-poppins-light text-sm transition-colors"
            >
              Xóa bộ lọc
            </button>
          </div>
        </div>

        {/* Bottom Row: Transaction List */}
        <div>
          <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="font-poppins-regular text-xl text-gray-800 flex items-center gap-2">
                Lịch sử giao dịch
              </h3>
              <button
                onClick={() => refetch()}
                className="p-2 hover:bg-primary/10 rounded-2xl transition-colors"
                title="Tải lại"
              >
                <RefreshCw className="w-5 h-5 text-primary" />
              </button>
            </div>

            {/* Transactions List */}
            {isLoadingTransactions ? (
              <div className="p-12 text-center">
                <RefreshCw className="w-8 h-8 text-primary animate-spin mx-auto mb-4" />
                <p className="font-poppins-light text-gray-500">Đang tải...</p>
              </div>
            ) : transactionHistory &&
              transactionHistory.transactions.length > 0 ? (
              <>
                <div className="max-h-[600px] px-4 overflow-y-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-40">Loại</TableHead>
                        <TableHead>Mô tả</TableHead>
                        <TableHead className="w-[120px]">Mã booking</TableHead>
                        <TableHead className="w-[120px]">Phương thức</TableHead>
                        <TableHead className="w-[150px]">Thời gian</TableHead>
                        <TableHead className="text-right w-[130px]">
                          Số tiền
                        </TableHead>
                        <TableHead className="text-right w-[130px]">
                          Số dư
                        </TableHead>
                        <TableHead className="text-center w-[120px]">
                          Trạng thái
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transactionHistory.transactions.map((transaction) => {
                        const typeInfo = getTransactionTypeLabel(
                          transaction.type
                        );
                        const statusInfo = getStatusBadge(transaction.status);

                        return (
                          <TableRow key={transaction.id}>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div
                                  className={`p-2 rounded-lg ${
                                    typeInfo.icon === "up"
                                      ? "bg-green-100"
                                      : "bg-red-100"
                                  }`}
                                >
                                  {typeInfo.icon === "up" ? (
                                    <TrendingUp
                                      className={`w-4 h-4 ${typeInfo.color}`}
                                    />
                                  ) : (
                                    <TrendingDown
                                      className={`w-4 h-4 ${typeInfo.color}`}
                                    />
                                  )}
                                </div>
                                <span className="font-poppins-light text-sm">
                                  {typeInfo.label}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="font-poppins-light text-sm">
                              {transaction.description}
                            </TableCell>
                            <TableCell className="font-poppins-light text-sm">
                              {transaction.bookingCode || "-"}
                            </TableCell>
                            <TableCell className="font-poppins-light text-sm">
                              {transaction.paymentMethod
                                ? paymentMethods.find(
                                    (m) => m.value === transaction.paymentMethod
                                  )?.label || transaction.paymentMethod
                                : "-"}
                            </TableCell>
                            <TableCell className="font-poppins-light text-xs text-gray-500">
                              <div>
                                {new Date(transaction.createdAt).toLocaleString(
                                  "vi-VN",
                                  {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }
                                )}
                              </div>
                              <div className="text-gray-400">
                                (
                                {formatDistanceToNow(
                                  new Date(transaction.createdAt),
                                  {
                                    addSuffix: true,
                                    locale: vi,
                                  }
                                )}
                                )
                              </div>
                            </TableCell>
                            <TableCell
                              className={`text-right font-poppins-light ${typeInfo.color}`}
                            >
                              {formatCurrency(transaction.amount)} VNĐ
                            </TableCell>
                            <TableCell className="text-right font-poppins-light text-sm">
                              {transaction.balanceAfter
                                ? `${formatCurrency(
                                    transaction.balanceAfter
                                  )} VNĐ`
                                : "-"}
                            </TableCell>
                            <TableCell className="text-center">
                              <span
                                className={`inline-block px-2 py-1 rounded-full text-xs font-poppins-medium ${statusInfo.bgColor} ${statusInfo.textColor}`}
                              >
                                {statusInfo.label}
                              </span>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                {transactionHistory.totalPages > 1 && (
                  <div className="p-6 border-t border-gray-200 flex items-center justify-between">
                    <p className="text-sm text-gray-600 font-poppins-light">
                      Trang {transactionHistory.page} /{" "}
                      {transactionHistory.totalPages}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-poppins-light text-sm transition-colors"
                      >
                        Trước
                      </button>
                      <button
                        onClick={() =>
                          setPage((p) =>
                            Math.min(transactionHistory.totalPages, p + 1)
                          )
                        }
                        disabled={page === transactionHistory.totalPages}
                        className="px-4 py-2 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-poppins-light text-sm transition-colors"
                      >
                        Sau
                      </button>
                    </div>
                  </div>
                )}
              </>
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
  );
}
