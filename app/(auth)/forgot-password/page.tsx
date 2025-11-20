"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/config/axios";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await api.post("/auth/forgot-password", { email });
      console.log("forgot-password response:", res.data);

      toast("Đã gửi mã OTP đến email của bạn. Vui lòng kiểm tra email.");
      setStep(2);
    } catch (err) {
      console.error("Forgot password error:", err);
      const error = err as {
        response?: {
          data?: { message?: string; error?: string };
          status?: number;
        };
        message?: string;
      };

      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Gửi OTP thất bại. Vui lòng thử lại.";

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await api.post("/auth/reset-password", {
        email,
        otp,
        newPassword,
      });
      console.log("reset-password response:", res.data);

      toast("Đổi mật khẩu thành công!");
      router.replace("/login");
    } catch (err) {
      console.error("Reset password error:", err);
      const error = err as {
        response?: {
          data?: { message?: string; error?: string };
          status?: number;
        };
        message?: string;
      };

      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Reset mật khẩu thất bại. Vui lòng kiểm tra lại OTP.";

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="w-full max-w-md bg-popover rounded-2xl shadow-pink-300 shadow-2xl p-8">
        <h1 className="text-2xl font-poppins-regular text-center text-foreground mb-4">
          Quên mật khẩu
        </h1>

        {error && (
          <div className="mb-3 text-sm text-error bg-error-foreground/10 px-3 py-2 rounded">
            {error}
          </div>
        )}

        {step === 1 && (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-md font-poppins-regular mb-1 text-foreground">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-lg font-poppins-light text-sm border border-ring bg-popover text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:outline-none"
                placeholder="nhapemail@domain.com"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 rounded-lg text-white font-poppins-regular bg-pink-500 hover:bg-pink-600 transition-colors disabled:opacity-60"
            >
              {loading ? "Đang gửi..." : "Gửi mã OTP"}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="block text-md font-poppins-regular mb-1 text-foreground">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-lg font-poppins-light text-sm border border-ring bg-popover text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:outline-none"
                placeholder="nhapemail@domain.com"
              />
            </div>

            <div>
              <label className="block text-md font-poppins-regular mb-1 text-foreground">
                Mã OTP
              </label>
              <input
                type="text"
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-3 py-2 rounded-lg font-poppins-light text-sm border border-ring bg-popover text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:outline-none"
                placeholder="Nhập mã OTP"
              />
            </div>

            <div>
              <label className="block text-md font-poppins-regular mb-1 text-foreground">
                Mật khẩu mới
              </label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-lg font-poppins-light text-sm border border-ring bg-popover text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:outline-none"
                placeholder="Nhập mật khẩu mới"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 rounded-lg text-white font-poppins-regular bg-pink-500 hover:bg-pink-600 transition-colors disabled:opacity-60"
            >
              {loading ? "Đang xử lý..." : "Đổi mật khẩu"}
            </button>
          </form>
        )}

        <p className="mt-6 text-center font-poppins-light text-sm text-muted-foreground">
          Nhớ lại mật khẩu?{" "}
          <Link
            href="/login"
            className="text-primary font-poppins-semibold hover:underline"
          >
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
}
