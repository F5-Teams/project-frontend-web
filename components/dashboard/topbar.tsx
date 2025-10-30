"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import type { User } from "@/components/models/register";
import { ICONS } from "./Icons";

export function Topbar() {
  const Bell = ICONS.bell;
  const [me, setMe] = useState<User | null>(null);

  useEffect(() => {
    try {
      const raw =
        typeof window !== "undefined" ? localStorage.getItem("user") : null;
      if (!raw) return;
      const parsed = JSON.parse(raw) as User;
      setMe(parsed);
    } catch {
      // ignore
    }
  }, []);

  const fullName = (() => {
    const fn = (me?.firstName || "").trim();
    const ln = (me?.lastName || "").trim();
    const name = `${fn} ${ln}`.trim();
    return name || me?.userName || "User";
  })();

  // Ưu tiên avatar từ BE; nếu rỗng dùng avatar tạo từ tên
  const avatarUrl =
    (me?.avatar && me.avatar.trim()) ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      fullName
    )}&background=FF66A3&color=fff`;

  return (
    <header className="h-16 border-b border-pink-100 bg-gradient-to-b from-[#FFE5EC] via-[#FFF4E0] to-[#FFD6E0] text-pink-600 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
        <h1 className="text-lg font-semibold" />
        <div className="flex items-center gap-3">
          {/* <button className="relative rounded-full p-2 border border-transparent hover:border-pink-200">
            <Bell className="size-5 text-pink-600" />
            <span className="absolute -top-1 -right-1 w-4 h-4 text-[10px] bg-pink-600 text-white rounded-full grid place-content-center">
              3
            </span>
          </button> */}

          <div className="flex items-center gap-3">
            <div className="leading-tight">
              <div className="text-sm font-medium text-pink-700">
                {fullName}
              </div>
            </div>
            <Image
              src={avatarUrl}
              alt="avatar"
              width={40}
              height={40}
              className="w-10 h-10 rounded-full object-cover"
              unoptimized
            />
          </div>
        </div>
      </div>
    </header>
  );
}
