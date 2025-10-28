"use client";

import {
  Bell,
  Users,
  Calendar,
  ClipboardList,
  Settings,
  Info,
  Menu,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Logo from "@/public/logo/HappyPaws only Logo.svg";

export type SidebarProps = {
  open: boolean;
  onToggle: () => void;
};

export default function Sidebar({ open, onToggle }: SidebarProps) {
  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={onToggle}
        className="lg:hidden fixed top-4 left-4 z-50 w-12 h-12 bg-primary/50 text-white rounded-xl flex items-center justify-center shadow-lg"
      >
        {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <div
        className={[
          "fixed lg:relative inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out",
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          "w-20 lg:w-[100px] bg-white/40 backdrop-blur shadow-lg rounded-none lg:rounded-3xl lg:m-4 flex flex-col items-center py-8 space-y-6 lg:space-y-8",
        ].join(" ")}
      >
        <div className="flex items-center justify-center">
          <Link href="/" className="cursor-pointer">
            <Image
              alt="Logo"
              src={Logo}
              className="object-contain"
              width={50}
              height={50}
              style={{ maxHeight: "56px" }}
            />
          </Link>
        </div>

        <div className="flex flex-col space-y-4 lg:space-y-6 flex-1">
          <button className="w-10 h-10 lg:w-12 lg:h-12 text-primary bg-primary/20 rounded-xl flex items-center justify-center">
            <Users className="w-5 h-5 lg:w-6 lg:h-6" />
          </button>
          <button className="w-10 h-10 lg:w-12 lg:h-12 text-primary hover:bg-pink-200 rounded-xl flex items-center justify-center transition-colors">
            <ClipboardList className="w-5 h-5 lg:w-6 lg:h-6" />
          </button>

          <button className="w-10 h-10 lg:w-12 lg:h-12 text-primary hover:bg-pink-200 rounded-xl flex items-center justify-center transition-colors">
            <Calendar className="w-5 h-5 lg:w-6 lg:h-6" />
          </button>

          <button className="w-10 h-10 lg:w-12 lg:h-12 text-primary hover:bg-pink-200 rounded-xl flex items-center justify-center transition-colors relative">
            <Bell className="w-5 h-5 lg:w-6 lg:h-6" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-green-400 rounded-full" />
          </button>
        </div>

        <div className="flex flex-col space-y-4 lg:space-y-6">
          <button className="w-10 h-10 lg:w-12 lg:h-12 text-primary hover:bg-pink-200 rounded-xl flex items-center justify-center transition-colors">
            <Settings className="w-5 h-5 lg:w-6 lg:h-6" />
          </button>
          <button className="w-10 h-10 lg:w-12 lg:h-12 text-primary hover:bg-pink-200 rounded-xl flex items-center justify-center transition-colors">
            <Info className="w-5 h-5 lg:w-6 lg:h-6" />
          </button>
        </div>
      </div>

      {/* Overlay for mobile */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={onToggle}
        />
      )}
    </>
  );
}
