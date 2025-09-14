"use client";
import React from "react";
import Image from "next/image";
import {
  LucideFacebook,
  LucideInstagram,
  LucideTwitter,
  LucideMail,
} from "lucide-react";
import logoImg from "@/public/images/care.jpg"; // thay logo của bạn
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-pink-500 to-indigo-500 flex items-center justify-center text-white font-bold shadow-md">
                  P
                </div>
              </Link>
            </div>
            <span className="text-2xl font-bold">Pet Care Center</span>
          </div>
          <p className="text-slate-300 text-sm">
            Chăm sóc thú cưng toàn diện từ khách sạn, spa, huấn luyện đến y tế.
            Nơi mang đến niềm vui và sự an tâm cho thú cưng và chủ nhân.
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-4">Dịch vụ</h3>
          <ul className="space-y-2 text-slate-300 text-sm">
            <li>Spa & Grooming</li>
            <li>Khách sạn & Boarding</li>
            <li>Chăm sóc ban ngày</li>
            <li>Huấn luyện</li>
            <li>Khám & Tiêm chủng</li>
            <li>Đón & Trả tận nơi</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-4">Liên kết nhanh</h3>
          <ul className="space-y-2 text-slate-300 text-sm">
            <li>Trang chủ</li>
            <li>Dịch vụ</li>
            <li>Khách sạn thú cưng</li>
            <li>Giới thiệu</li>
            <li>Liên hệ</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-4">Theo dõi chúng tôi</h3>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-pink-500 transition">
              <LucideFacebook size={24} />
            </a>
            <a href="#" className="hover:text-pink-500 transition">
              <LucideInstagram size={24} />
            </a>
            <a href="#" className="hover:text-pink-500 transition">
              <LucideTwitter size={24} />
            </a>
            <a href="#" className="hover:text-pink-500 transition">
              <LucideMail size={24} />
            </a>
          </div>
        </div>
      </div>

      <div className="mt-12 border-t border-slate-700 pt-6 text-center text-sm text-slate-400">
        &copy; {new Date().getFullYear()} Pet Care Center. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
