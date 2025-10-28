/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { RegisterFormData } from "@/components/models/register";
import api from "@/config/axios";
import { Eye, EyeOff } from "lucide-react";

import Image1 from "@/public/images/login_image.svg";
import Image from "next/image";

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState<RegisterFormData>({
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    phoneNumber: "",
    address: "",
    gender: "",
    avatar: "",
  });

  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
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

    let genderBoolean: boolean = false;
    if (formData.gender === "MALE") genderBoolean = true;
    else if (formData.gender === "FEMALE" || formData.gender === "OTHER")
      genderBoolean = false;

    const submitData = {
      ...formData,
      gender: genderBoolean,
    };

    try {
      const response = await api.post("auth/sign-up", submitData);

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
        <Image
          src={Image1}
          alt="Image1"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>

      {/* Right side - form */}
      <div className="flex items-center justify-center bg-linear-to-br from-blue-50 via-white to-pink-50 p-8">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl shadow-pink-300 py-2 md:py-4 px-4 md:px-8">
          <h2 className="text-2xl font-poppins-regular text-center text-gray-900 mb-6">
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
                <label className="block text-md font-poppins-regular mb-1">
                  Họ
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full text-sm font-poppins-light border border-ring rounded-lg px-3 py-2"
                  disabled={isLoading}
                  required
                  placeholder="Họ"
                />
              </div>
              <div>
                <label className="block text-md font-poppins-regular mb-1">
                  Tên
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full border border-ring text-sm font-poppins-light rounded-lg px-3 py-2"
                  disabled={isLoading}
                  required
                  placeholder="Tên"
                />
              </div>
            </div>

            <div>
              <label className="block text-md font-poppins-regular mb-1">
                Tên đăng nhập
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full text-sm font-poppins-light border border-ring rounded-lg px-3 py-2"
                disabled={isLoading}
                required
                placeholder="Tên đăng nhập"
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
                  className="w-full px-3 py-2 pr-10 text-sm font-poppins-light rounded-lg border border-ring bg-popover text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:outline-none"
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

            <div>
              <label className="block text-md font-poppins-regular mb-1">
                Giới tính
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full border text-sm font-poppins-light border-ring rounded-lg px-3 py-2"
                disabled={isLoading}
                required
              >
                <option value="">-- Chọn giới tính --</option>
                <option value="MALE">Nam</option>
                <option value="FEMALE">Nữ</option>
                <option value="OTHER">Khác</option>
              </select>
            </div>

            <div>
              <label className="block text-md font-poppins-regular mb-1">
                Số điện thoại
              </label>
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                pattern="[0-9]{10,11}"
                maxLength={11}
                className="w-full text-sm font-poppins-light border border-ring rounded-lg px-3 py-2"
                disabled={isLoading}
                required
                placeholder="vd: 0912345678"
              />
            </div>

            <div>
              <label className="block text-md font-poppins-regular mb-1">
                Địa chỉ
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full text-sm font-poppins-light border border-ring rounded-lg px-3 py-2"
                disabled={isLoading}
                required
                placeholder="vd: 123 Đường ABC, Quận XYZ, TP.HCM"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-2 rounded-lg text-white font-poppins-regular ${
                isLoading ? "bg-primary" : "bg-pink-500 hover:bg-pink-600"
              }`}
            >
              {isLoading ? "Đăng ký..." : "Đăng ký"}
            </button>
          </form>

          <p className="mt-4 text-center font-poppins-light text-sm text-gray-600">
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
