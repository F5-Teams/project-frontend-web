"use client";

import { useEffect } from "react";
import { Footer, Header } from "@/components/shared";
import { PushLayout } from "@/components/cart/PushLayout";
import api from "@/config/axios";

const ROLE_BY_ID: Record<number, "admin" | "staff" | "groomer" | "customer"> = {
  1: "admin",
  2: "staff",
  3: "groomer",
  4: "customer",
};

// Hàm tiện ích lưu cookie
function setCookie(name: string, value: string, maxAgeSeconds: number) {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  document.cookie = `${name}=${encodeURIComponent(
    value
  )}; Path=/; Max-Age=${maxAgeSeconds}; SameSite=Lax${secure}`;
}

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    // 🔹 Lấy token và user từ query string Google login
    const token = params.get("access_token");
    const userRaw = params.get("user");

    if (token && userRaw) {
      try {
        const user = JSON.parse(decodeURIComponent(userRaw));
        const oneDay = 60 * 60 * 24;

        // 🔹 Lưu vào localStorage
        localStorage.setItem("accessToken", token);
        localStorage.setItem("user", JSON.stringify(user));

        // 🔹 Xác định role
        let roleName: "admin" | "staff" | "groomer" | "customer" = "customer";
        if (user?.roleId && ROLE_BY_ID[user.roleId]) {
          roleName = ROLE_BY_ID[user.roleId];
        } else if (user?.roleName) {
          const rn = user.roleName.toLowerCase();
          if (["admin", "staff", "groomer", "customer"].includes(rn)) {
            roleName = rn as typeof roleName;
          }
        }
        const roleUpper = roleName.toUpperCase();
        localStorage.setItem("role", roleUpper);

        // 🔹 Lưu cookie nếu cần
        setCookie("accessToken", token, oneDay);
        setCookie("role", roleUpper, oneDay);

        // 🔹 Set Authorization mặc định cho API
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        // 🔹 Xóa query string khỏi URL cho gọn
        window.history.replaceState({}, "", window.location.pathname);
      } catch (err) {
        console.error("❌ Lỗi xử lý user Google login:", err);
      }
    }
  }, []);

  return (
    <PushLayout>
      <div className="bg-linear-to-b from-pink-100 via-white to-yellow-100 min-h-screen flex flex-col overflow-x-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden pt-24">{children}</main>
        <Footer />
      </div>
    </PushLayout>
  );
}
