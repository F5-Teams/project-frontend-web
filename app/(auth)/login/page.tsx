/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/config/axios";
import { LoginFormData, AuthResponse } from "@/components/models/login";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  const [formData, setFormData] = useState<LoginFormData>({
    username: "",
    password: "",
  });
  const [error, setError] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await api.post<AuthResponse>("auth/sign-in", formData);
      const data = res.data;

      const token = data.access_token || data.accessToken || data.token || null;

      if (!token) {
        setError("Đăng nhập thất bại: server không trả token.");
        return;
      }

      localStorage.setItem("accessToken", token);
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      router.replace("/");
    } catch (err: any) {
      const serverMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Đăng nhập thất bại. Vui lòng thử lại.";
      setError(serverMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left side */}
      <div className="relative hidden lg:block">
        <img
          src="https://i.pinimg.com/736x/3e/aa/78/3eaa7833921c825e33569b47da38a37e.jpg"
          alt="Pet background"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>

      {/* Right side */}
      <div className="flex items-center justify-center bg-background px-6 py-12">
        <div className="w-full max-w-md bg-popover rounded-2xl shadow-2xl p-8">
          <h2 className="text-2xl font-poppins-medium text-center text-foreground mb-6">
            Đăng nhập
          </h2>

          {error && (
            <div className="mb-4 text-sm text-error bg-error-foreground/10 p-3 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div>
              <label className="block text-sm font-medium mb-1 text-foreground">
                Tên đăng nhập
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-border bg-popover text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:outline-none"
                placeholder="Nhập tên đăng nhập"
                autoComplete="username"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-foreground">
                Mật khẩu
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-3 py-2 pr-10 rounded-lg border border-border bg-popover text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:outline-none"
                  placeholder="Nhập mật khẩu"
                  autoComplete="current-password"
                  disabled={isLoading}
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
              disabled={isLoading}
              className={`w-full py-2 rounded-lg text-white font-semibold ${
                isLoading ? "bg-primary" : "bg-pink-500 hover:bg-pink-600"
              }`}
            >
              {isLoading ? "Đăng nhập..." : "Đăng nhập"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Bạn chưa có tài khoản?{" "}
            <Link
              href="/register"
              className="text-primary font-semibold hover:underline"
            >
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
