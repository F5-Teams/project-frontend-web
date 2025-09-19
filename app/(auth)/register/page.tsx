/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { RegisterFormData } from "@/components/models/register";
import api from "@/config/axios";

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState<RegisterFormData>({
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    phoneNumber: "",
    address: "",
  });

  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await api.post("auth/sign-up", formData);

      if (response.status === 200 || response.status === 201) {
        alert("Đăng ký thành công!");
        router.push("/login");
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Đăng ký thất bại. Vui lòng thử lại."
      );
      console.error("Registration error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left side - image */}
      <div className="relative hidden lg:block">
        <img
          src="https://i.pinimg.com/736x/3e/aa/78/3eaa7833921c825e33569b47da38a37e.jpg"
          alt="Pet background"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>

      {/* Right side - form */}
      <div className="flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-pink-50 px-6 py-12">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-3xl font-poppins-medium text-center text-gray-900 mb-6">
            Đăng ký Tài khoản
          </h2>

          {error && (
            <div className="mb-4 text-sm text-red-700 bg-red-50 p-3 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-poppins-medium mb-1">
                  Họ
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2"
                  disabled={isLoading}
                  required
                  placeholder="Họ"
                />
              </div>
              <div>
                <label className="block text-sm font-poppins-medium mb-1">
                  Tên
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2"
                  disabled={isLoading}
                  required
                  placeholder="Tên"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-poppins-medium mb-1">
                Tên đăng nhập
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
                disabled={isLoading}
                required
                placeholder="Tên đăng nhập"
              />
            </div>

            <div>
              <label className="block text-sm font-poppins-medium mb-1">
                Mật khẩu
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
                disabled={isLoading}
                required
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-sm font-poppins-medium mb-1">
                Số điện thoại
              </label>
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                pattern="[0-9]{10,11}"
                maxLength={11}
                className="w-full border rounded-lg px-3 py-2"
                disabled={isLoading}
                required
                placeholder="0123456789"
              />
            </div>

            <div>
              <label className="block text-sm font-poppins-medium mb-1">
                Địa chỉ
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
                disabled={isLoading}
                required
                placeholder="Địa chỉ"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-2 rounded-lg text-white font-poppins-semibold ${
                isLoading ? "bg-primary" : "bg-pink-500 hover:bg-pink-600"
              }`}
            >
              {isLoading ? "Đăng ký..." : "Đăng ký"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Bạn đã có tài khoản?{" "}
            <Link
              href="/login"
              className="text-primary font-poppins-semibold hover:underline"
            >
              Đăng nhập
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
