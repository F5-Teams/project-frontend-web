"use client";

import Image from "next/image";
import { ICONS } from "./Icons";

export function Topbar() {
  const Bell = ICONS.bell;
  return (
    <header className="h-16 border-b bg-white sticky top-0 z-40">
      <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
        <h1 className="text-lg font-semibold"></h1>
        <div className="flex items-center gap-3">
          <div className="relative"></div>
          <button className="relative rounded-full p-2 border">
            <Bell className="size-5" />
            <span className="absolute -top-1 -right-1 w-4 h-4 text-[10px] bg-pink-600 text-white rounded-full grid place-content-center">
              3
            </span>
          </button>
          <div className="flex items-center gap-3">
            <Image
              src="https://i.pravatar.cc/40"
              alt="avatar"
              width={50}
              height={50}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="leading-tight">
              <div className="text-sm font-medium">John Doe</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
