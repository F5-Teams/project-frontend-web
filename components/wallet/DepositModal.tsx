"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { createDepositUrl } from "@/services/wallets/deposit";

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DepositModal({ isOpen, onClose }: DepositModalProps) {
  const [amount, setAmount] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const depositAmounts = [50000, 100000, 200000, 500000, 1000000];

  const handleDeposit = async (depositAmount: number) => {
    setIsLoading(true);
    setError("");

    try {
      // Get current protocol and host
      const protocol =
        typeof window !== "undefined" ? window.location.protocol : "http:";
      const host =
        typeof window !== "undefined" ? window.location.host : "localhost:3000";
      const returnUrl = `${protocol}//${host}/success`;

      const response = await createDepositUrl(depositAmount);
      // Store transaction info and return URL for later status check
      localStorage.setItem("depositTxnRef", response.vnpTxnRef);
      localStorage.setItem("depositReturnUrl", returnUrl);
      // Redirect to VNPay
      window.location.href = response.paymentUrl;
    } catch (err) {
      setError("Có lỗi xảy ra. Vui lòng thử lại.");
      console.error("Deposit error:", err);
      setIsLoading(false);
    }
  };

  const handleCustomDeposit = async () => {
    if (!amount || parseInt(amount) < 10000) {
      setError("Số tiền phải tối thiểu 10.000 ₫");
      return;
    }

    await handleDeposit(parseInt(amount));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-poppins-regular text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Plus className="w-6 h-6 text-primary" />
            Nạp tiền vào ví
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg">
            <p className="text-red-700 text-sm font-poppins-light">{error}</p>
          </div>
        )}

        {/* Quick Amount Selection */}
        <div className="mb-6">
          <p className="font-poppins-light text-sm text-gray-600 mb-3">
            Chọn số tiền nạp
          </p>
          <div className="grid grid-cols-2 gap-3">
            {depositAmounts.map((amt) => (
              <button
                key={amt}
                onClick={() => {
                  setAmount(amt.toString());
                  setError("");
                }}
                disabled={isLoading}
                className="p-3 bg-gradient-to-br from-primary/10 to-primary/5 hover:from-primary/20 hover:to-primary/10 border border-primary/20 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <p className="font-poppins-regular font-semibold text-primary">
                  {amt.toLocaleString("vi-VN")} ₫
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Custom Amount */}
        <div className="mb-6">
          <label className="font-poppins-light text-sm text-gray-600 block mb-2">
            Nhập số tiền khác
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={amount ? parseInt(amount).toLocaleString("vi-VN") : ""}
              onChange={(e) => {
                // Remove formatting and store only numbers
                const numericValue = e.target.value.replace(/\D/g, "");
                setAmount(numericValue);
                setError("");
              }}
              placeholder="VD: 100000"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 font-poppins-light"
            />
            <button
              onClick={handleCustomDeposit}
              disabled={isLoading || !amount}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-poppins-regular font-semibold"
            >
              {isLoading ? "Đang xử lý..." : "Nạp"}
            </button>
          </div>
        </div>

        <p className="text-xs text-gray-500 text-center font-poppins-light">
          Số tiền tối thiểu: 10.000 ₫
        </p>
      </div>
    </div>
  );
}
