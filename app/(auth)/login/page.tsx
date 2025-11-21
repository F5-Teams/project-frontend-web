"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import api from "@/config/axios";
import { LoginFormData, AuthResponse } from "@/components/models/login";
import { toast } from "sonner";
import Image1 from "@/public/images/login_image.svg";
import LogoGoogle from "@/public/icons/google-color-svgrepo-com.svg";

const ROLE_BY_ID: Record<number, "admin" | "staff" | "groomer" | "customer"> = {
  1: "admin",
  2: "staff",
  3: "groomer",
  4: "customer",
};

const ROLE_HOME: Record<string, string> = {
  admin: "/admin",
  staff: "/staff",
  groomer: "/groomer/dashboard",
  customer: "/",
};

/* --------------------------------------------------
   2. Hàm tiện ích: Set / Get cookie
-------------------------------------------------- */
function setCookie(name: string, value: string, maxAgeSeconds: number) {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  document.cookie = `${name}=${encodeURIComponent(
    value
  )}; Path=/; Max-Age=${maxAgeSeconds}; SameSite=Lax${secure}`;
}

/* --------------------------------------------------
   3. Component chính: Trang Đăng Nhập
-------------------------------------------------- */
export default function LoginPage() {
  const router = useRouter();

  // State lưu dữ liệu form & lỗi
  const [formData, setFormData] = useState<LoginFormData>({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // OTP verification state
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

  /* ---------------------------------------------
     4. Handle thay đổi input
  --------------------------------------------- */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  /* ---------------------------------------------
     5. Handle submit form đăng nhập
  --------------------------------------------- */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    try {
      // (1) Gọi API login
      const res = await api.post<AuthResponse>("/auth/sign-in", formData);

      // (2) Lấy access token từ nhiều format có thể có
      let token =
        res.data?.access_token ||
        res.data?.token ||
        res.data?.data?.accessToken;

      if (!token) {
        console.error("Token not found in response:", res.data);
        setError("Không nhận được token từ server.");
        return;
      }

      // Nếu token trả về đã chứa tiền tố "Bearer ", loại bỏ để tránh bị gửi "Bearer Bearer ..."
      if (
        typeof token === "string" &&
        token.toLowerCase().startsWith("bearer ")
      ) {
        token = token.slice(7).trim();
      }

      console.log("Token received:", token.substring(0, 20) + "...");

      // Lưu token vào localStorage trước khi gọi /users/me để interceptor có thể sử dụng
      try {
        localStorage.setItem("accessToken", token);
      } catch (e) {
        console.warn("Could not write token to localStorage:", e);
      }

      // (3) Gọi API lấy thông tin người dùng
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const meRes = await api.get("/users/me");
      const me = meRes.data;

      // (4) Xác định role từ dữ liệu backend (dạng linh hoạt)
      const roleIdRaw = me?.role?.id ?? me?.roleId ?? me?.roleID;
      const roleNameRaw = me?.role?.name ?? me?.roleName ?? me?.role;

      let roleLower: "admin" | "staff" | "groomer" | "customer" = "customer";

      const roleId = Number(roleIdRaw);
      if (!Number.isNaN(roleId) && ROLE_BY_ID[roleId]) {
        roleLower = ROLE_BY_ID[roleId];
      } else if (typeof roleNameRaw === "string") {
        const rn = roleNameRaw.toLowerCase();
        if (["admin", "staff", "groomer", "customer"].includes(rn)) {
          roleLower = rn as typeof roleLower;
        }
      }

      const roleUpper = roleLower.toUpperCase();

      // (5) Lưu thông tin vào localStorage
      localStorage.setItem("accessToken", token);
      localStorage.setItem("user", JSON.stringify(me));
      localStorage.setItem("role", roleUpper);

      // Dispatch custom event để các component khác cập nhật
      window.dispatchEvent(new Event("auth-changed"));

      // (6) Set cookie để middleware đọc (Next.js middleware)
      const oneDay = 60 * 60 * 24;
      setCookie("accessToken", token, oneDay);
      setCookie("role", roleUpper, oneDay);

      // (7) Điều hướng về trang home của từng role
      console.log(
        "Login successful, redirecting to:",
        ROLE_HOME[roleLower] ?? "/"
      );
      router.replace(ROLE_HOME[roleLower] ?? "/");
    } catch (err) {
      console.error("Login error:", err);
      const error = err as {
        response?: {
          data?: { message?: string; error?: string; email?: string };
          status?: number;
        };
        message?: string;
      };
      console.error("Error response:", error?.response?.data);
      console.error("Error status:", error?.response?.status);

      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.";

      // Check if error indicates unverified account (only for 403 status)
      if (error?.response?.status === 403) {
        // Try to get email from error response, otherwise leave empty for user to fill
        const email = error?.response?.data?.email || "";
        setUserEmail(email);
        setShowOtpForm(true);
        toast.info(
          "Tài khoản chưa được xác thực. Vui lòng nhập email và mã OTP."
        );
      } else {
        setError(errorMessage);
      }
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!userEmail.trim()) {
      setOtpError("Vui lòng nhập email.");
      return;
    }

    if (!otp.trim()) {
      setOtpError("Vui lòng nhập mã OTP.");
      return;
    }

    setIsVerifyingOtp(true);
    setOtpError("");

    try {
      await api.post("auth/verify-otp", {
        email: userEmail.trim(),
        otp: otp.trim(),
      });

      toast.success("Xác thực thành công! Vui lòng đăng nhập lại.");

      // Reset to login form
      setShowOtpForm(false);
      setOtp("");
      setUserEmail("");
      setError("");
    } catch (err: unknown) {
      const error = err as {
        response?: { data?: { message?: string } };
      };
      const message =
        error?.response?.data?.message ||
        "Mã OTP không đúng. Vui lòng thử lại.";
      toast.error(message);
      setOtpError(message);
      console.error("OTP verification error:", err);
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleResendOtp = async () => {
    if (!userEmail.trim()) {
      toast.error("Vui lòng nhập email trước.");
      return;
    }

    try {
      await api.post("auth/resend-otp", { email: userEmail.trim() });
      toast.success("Mã OTP mới đã được gửi đến email của bạn.");
    } catch (err: unknown) {
      const error = err as {
        response?: { data?: { message?: string } };
      };
      toast.error(
        error?.response?.data?.message ||
          "Không thể gửi lại mã OTP. Vui lòng thử lại."
      );
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `http://localhost:8080/auth/google`;
  };
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Bên trái: Hình ảnh */}
      <div className="relative hidden lg:block">
        <Image
          src={Image1}
          alt="Login Illustration"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>

      {/* Bên phải: Form đăng nhập */}
      <div className="flex items-center justify-center bg-background px-6 py-12">
        <div className="w-full max-w-md lg:max-w-lg">
          {/* Mobile-only illustration above the card */}
          <div className="block lg:hidden mb-6">
            <Image
              src={Image1}
              alt="Login Illustration"
              width={420}
              height={220}
              className="mx-auto object-contain"
            />
          </div>

          <div className="w-full bg-popover rounded-2xl shadow-pink-300 shadow-2xl p-6 lg:p-8">
            {!showOtpForm ? (
              <>
                <h2 className="text-2xl lg:text-3xl font-poppins-regular text-center text-foreground mb-6">
                  Đăng nhập
                </h2>

                {/* Hiển thị lỗi nếu có */}
                {error && (
                  <div className="mb-4 text-sm text-error bg-error-foreground/10 p-3 rounded-lg">
                    {error}
                  </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                  {/* Username */}
                  <div>
                    <label className="block text-md font-poppins-regular mb-1 text-foreground">
                      Tên đăng nhập
                    </label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded-lg font-poppins-light text-sm border border-ring bg-popover text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:outline-none"
                      placeholder="Nhập tên đăng nhập"
                      autoComplete="username"
                    />
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-md font-poppins-regular mb-1 text-foreground">
                      Mật khẩu
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full px-3 py-2 pr-10 font-poppins-light text-sm rounded-lg border border-ring bg-popover text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:outline-none"
                        placeholder="Nhập mật khẩu"
                        autoComplete="current-password"
                      />
                      {/* Icon ẩn/hiện mật khẩu */}
                      <button
                        type="button"
                        onClick={() => setShowPassword((p) => !p)}
                        className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Link quên mật khẩu */}
                  <div className="mt-2 text-right">
                    <Link
                      href="/forgot-password"
                      className="text-sm font-poppins-regular text-primary hover:underline"
                    >
                      Quên mật khẩu?
                    </Link>
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    className="w-full py-3 rounded-lg text-white font-poppins-regular bg-pink-500 hover:bg-pink-600 transition-colors text-sm lg:text-base"
                  >
                    Đăng nhập
                  </button>
                </form>

                {/* Divider with centered label */}
                <div className="my-4 flex items-center gap-3">
                  <div className="h-px flex-1 bg-gray-200" />
                  <span className="text-xs font-poppins-regular text-muted-foreground">
                    Hoặc
                  </span>
                  <div className="h-px flex-1 bg-gray-200" />
                </div>

                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="w-full cursor-pointer flex items-center justify-center gap-3 border border-gray-300 
                         bg-white text-gray-700 py-2.5 rounded-lg hover:bg-gray-50 transition-all"
                >
                  <Image
                    src={LogoGoogle}
                    alt="Google Logo"
                    width={20}
                    height={20}
                    className="object-contain"
                  />
                  <span className="font-poppins-regular text-sm lg:text-[15px]">
                    Đăng nhập với Google
                  </span>
                </button>

                {/* Link đăng ký */}
                <p className="mt-6 text-center font-poppins-light text-sm text-muted-foreground">
                  Bạn chưa có tài khoản?{" "}
                  <Link
                    href="/register"
                    className="text-primary font-poppins-semibold hover:underline"
                  >
                    Đăng ký ngay
                  </Link>
                </p>
              </>
            ) : (
              <>
                <h2 className="text-2xl lg:text-3xl font-poppins-regular text-center text-foreground mb-4">
                  Xác thực tài khoản
                </h2>

                <p className="text-sm text-gray-600 mb-4 text-center">
                  Tài khoản của bạn chưa được xác thực. Vui lòng nhập email và
                  mã OTP để xác thực.
                </p>

                {otpError && (
                  <div className="mb-4 text-sm text-red-700 bg-red-50 p-3 rounded-lg">
                    {otpError}
                  </div>
                )}

                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div>
                    <label className="block text-md font-poppins-regular mb-1 text-foreground">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      className="w-full text-sm font-poppins-light border border-ring rounded-lg px-3 py-2 bg-popover text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:outline-none"
                      disabled={isVerifyingOtp}
                      required
                      placeholder="Nhập email đã đăng ký"
                      autoComplete="email"
                    />
                  </div>

                  <div>
                    <label className="block text-md font-poppins-regular mb-1 text-foreground">
                      Mã OTP
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      name="otp"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="w-full text-center text-2xl font-poppins-medium tracking-widest border border-ring rounded-lg px-3 py-3 bg-popover"
                      disabled={isVerifyingOtp}
                      required
                      placeholder="000000"
                      maxLength={6}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isVerifyingOtp}
                    className={`w-full py-3 rounded-lg text-white font-poppins-regular ${
                      isVerifyingOtp
                        ? "bg-pink-500 opacity-80"
                        : "bg-pink-500 hover:bg-pink-600"
                    } transition-colors`}
                  >
                    {isVerifyingOtp ? "Đang xác thực..." : "Xác thực"}
                  </button>
                </form>

                <div className="mt-4 text-center">
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    className="text-sm text-primary hover:underline font-poppins-regular"
                  >
                    Gửi lại mã OTP
                  </button>
                </div>

                <button
                  onClick={() => {
                    setShowOtpForm(false);
                    setOtp("");
                    setOtpError("");
                    setUserEmail("");
                  }}
                  className="mt-4 w-full text-sm text-gray-600 hover:text-gray-900 font-poppins-light"
                >
                  ← Quay lại đăng nhập
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
