"use client";

import { useEffect, useState } from "react";
import { AtSign, Phone, MapPin, User as UserIcon } from "lucide-react";

type User = {
  id: number;
  userName: string;
  phoneNumber?: string | null;
  address?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  createdAt?: string;
  isActive?: boolean;
  roleId?: number;
  avatar?: string | null;
};

export default function InfoPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const raw = localStorage.getItem("user");
      if (raw) {
        setUser(JSON.parse(raw));
        console.log("InfoPage user:", JSON.parse(raw));
      }
    } catch (e) {
      console.error("Cannot parse user from localStorage", e);
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        <h1 className="text-xl font-semibold">Thông tin cá nhân</h1>
        {/* skeleton */}
        <div className="grid sm:grid-cols-2 gap-4">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-16 rounded-xl bg-white/50 dark:bg-white/10 animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="space-y-3">
        <h1 className="text-xl font-semibold">Thông tin cá nhân</h1>
        <p className="text-muted-foreground">
          Chưa tìm thấy dữ liệu người dùng. Vui lòng đăng nhập lại.
        </p>
      </div>
    );
  }

  const display = (v?: string | null) => (v && v.trim() ? v : "Chưa cập nhật");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">
          Thông tin cá nhân
        </h1>
        <p className="text-sm text-muted-foreground">
          Quản lý và cập nhật thông tin tài khoản của bạn.
        </p>
      </div>

      {/* Card thông tin kiểu kính */}
      <section
        className="
          relative overflow-hidden rounded-2xl
          bg-white/55 dark:bg-white/10 backdrop-blur-xl
          border border-white/25 dark:border-white/10
          shadow-[0_6px_24px_rgba(0,0,0,0.06)]
        "
      >
        <div className="relative p-4 sm:p-6 lg:p-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InfoRow
              icon={<AtSign className="h-5 w-5" />}
              label="Username"
              value={display(user.userName)}
              highlight
            />
            <InfoRow
              icon={<UserIcon className="h-5 w-5" />}
              label="Họ"
              value={display(user.lastName)}
            />
            <InfoRow
              icon={<UserIcon className="h-5 w-5" />}
              label="Tên"
              value={display(user.firstName)}
            />
            <InfoRow
              icon={<Phone className="h-5 w-5" />}
              label="Số điện thoại"
              value={display(user.phoneNumber)}
            />
            <InfoRow
              icon={<MapPin className="h-5 w-5" />}
              label="Địa chỉ"
              value={display(user.address)}
              className="sm:col-span-2"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
  className,
  highlight = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  className?: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={[
        "flex items-start gap-3 rounded-xl px-4 py-3 ring-1 ring-inset",
        "bg-white/60 dark:bg-white/5",
        "ring-white/20 dark:ring-white/10",
        "transition-colors",
        highlight ? "shadow-sm" : "",
        className || "",
      ].join(" ")}
    >
      <div className="mt-0.5 text-primary">{icon}</div>
      <div className="min-w-0">
        <div className="text-xs uppercase tracking-wide text-muted-foreground">
          {label}
        </div>
        <div className="font-medium text-foreground truncate">{value}</div>
      </div>
    </div>
  );
}
