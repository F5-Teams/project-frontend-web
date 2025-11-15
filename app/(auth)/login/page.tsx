/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import api from "@/config/axios";
import { LoginFormData, AuthResponse } from "@/components/models/login";
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

function getCookie(name: string) {
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${name}=([^;]+)`));
  return match ? decodeURIComponent(match[1]) : "";
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
      const res = await api.post<AuthResponse>("auth/sign-in", formData);

      // (2) Lấy access token từ nhiều format có thể có
      const token =
        res.data?.access_token ||
        res.data?.token ||
        res.data?.data?.accessToken;

      if (!token) {
        setError("Không nhận được token từ server.");
        return;
      }

      // (3) Gọi API lấy thông tin người dùng
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const meRes = await api.get("/user/me");
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

      // (6) Set cookie để middleware đọc (Next.js middleware)
      const oneDay = 60 * 60 * 24;
      setCookie("accessToken", token, oneDay);
      setCookie("role", roleUpper, oneDay);

      // (7) Điều hướng về trang home của từng role
      router.replace(ROLE_HOME[roleLower] ?? "/");
    } catch (err) {
      console.error(err);
      setError("Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.");
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
        <div className="w-full max-w-md bg-popover rounded-2xl shadow-pink-300 shadow-2xl p-8">
          <h2 className="text-2xl font-poppins-regular text-center text-foreground mb-6">
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

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-2 rounded-lg text-white font-poppins-regular bg-pink-500 hover:bg-pink-600 transition-colors"
            >
              Đăng nhập
            </button>
          </form>

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
            className="w-full cursor-pointer flex items-center justify-center gap-2 border border-gray-300 
                         bg-white text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-all"
          >
            <Image src={LogoGoogle} alt="Google Logo" className="h-5 w-5" />
            <span className="font-poppins-regular text-[15px]">
              Đăng nhập với Google
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
