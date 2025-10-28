/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/config/axios";
import { LoginFormData, AuthResponse } from "@/components/models/login";
import { Eye, EyeOff } from "lucide-react";

import Image1 from "@/public/images/login_image.svg";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();

  const [formData, setFormData] = useState<LoginFormData>({
    username: "",
    password: "",
  });
  const [error, setError] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post<AuthResponse>("auth/sign-in", formData);
      const token = res.data.access_token;

      localStorage.setItem("accessToken", token);

      const meRes = await api.get("user/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (meRes.data) {
        localStorage.setItem("user", JSON.stringify(meRes.data));
      }

      router.replace("/");
    } catch (err: any) {
      const serverMsg = "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.";
      setError(serverMsg);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left side */}
      <div className="relative hidden lg:block">
        <Image
          src={Image1}
          alt="Image1"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>

      {/* Right side */}
      <div className="flex items-center justify-center bg-background px-6 py-12">
        <div className="w-full max-w-md bg-popover rounded-2xl shadow-pink-300 shadow-2xl p-8">
          <h2 className="text-2xl font-poppins-regular text-center text-foreground mb-6">
            Đăng nhập
          </h2>

          {error && (
            <div className="mb-4 text-sm text-error bg-error-foreground/10 p-3 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
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

            <button
              type="submit"
              className="w-full py-2 rounded-lg text-white font-poppins-regular bg-pink-500 hover:bg-pink-600"
            >
              Đăng nhập
            </button>
          </form>

          <p className="mt-6 text-center font-poppins-light text-sm text-muted-foreground">
            Bạn chưa có tài khoản?{" "}
            <Link
              href="/register"
              className="text-primary font-poppins-semibold hover:underline"
            >
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
