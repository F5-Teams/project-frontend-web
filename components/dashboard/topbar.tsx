"use client";

import React from "react";
import Image from "next/image";
import { useMe } from "@/services/profile/hooks";
import NotificationBell from "@/components/notification/NotificationBell";

export default function Topbar() {
  const { data: user } = useMe();

  const name =
    user?.firstName || user?.lastName
      ? `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim()
      : user?.userName ?? "Unknown User";

  const avatar = user?.avatar ?? undefined;

  const initials = String(name)
    .split(" ")
    .map((s) => s?.[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200">
      {/* left: search icon */}
      <div className="flex items-center gap-3 w-full max-w-3xl">
        {/* <button
          aria-label="Search"
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 hover:shadow-sm"
        >
          <Search className="w-5 h-5 text-slate-500" />
          <span className="text-sm text-slate-500 hidden sm:inline">
            Search
          </span>
        </button> */}
      </div>

      {/* right: notifications, settings, avatar */}
      <div className="flex items-center gap-4">
        {/* Only show notification bell for groomer role (role.id = 3) */}
        {user?.role?.id === 3 && <NotificationBell />}

        <div className="flex items-center gap-3">
          {avatar ? (
            <Image
              src={avatar}
              alt={name}
              width={40}
              height={40}
              className="w-10 h-10 rounded-full object-cover bg-slate-200"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-sm font-medium">
              {initials}
            </div>
          )}

          <div className="">
            <div className="font-poppins-medium text-md leading-none mb-2">
              {name}
            </div>
            <div className="font-poppins-light text-xs text-muted-foreground leading-none">
              {user?.userName}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
