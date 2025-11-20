"use client";
import React from "react";
import Image from "next/image";
import {
  LucideFacebook,
  LucideInstagram,
  LucideTwitter,
  LucideMail,
} from "lucide-react";
import Logo from "@/public/logo/HappyPaws only Logo.svg";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="relative z-10 bg-gradient-to-br from-yellow-500 to-pink-400 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-3">
                <Image
                  alt="Logo"
                  src={Logo}
                  width={48}
                  height={48}
                  className="object-contain"
                />
              </Link>
            </div>
            <span className="text-2xl font-bold">HappyPaws</span>
          </div>
          <p className="text-white font-poppins-light text-sm">
            Chăm sóc thú cưng toàn diện từ khách sạn, spa. Nơi mang đến niềm vui
            và sự an tâm cho thú cưng và chủ nhân.
          </p>
        </div>

        <div>
          <h3 className="text-white font-poppins-regular text-lg mb-4">
            Dịch vụ
          </h3>
          <ul className="space-y-2 text-white font-poppins-regular text-sm">
            <li>Spa & Grooming</li>
            <li>Khách sạn thú cưng</li>
            <li>Sản phẩm cho thú cưng</li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-poppins-regular text-lg mb-4">
            Liên kết nhanh
          </h3>
          <ul className="space-y-2 text-white font-poppins-regular text-sm">
            <li>Trang chủ</li>
            <li>Dịch vụ</li>
            <li>Về chúng tôi</li>
            <li>Chính sách</li>
            <li>Liên hệ</li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-poppins-regular text-lg mb-4">
            Theo dõi chúng tôi
          </h3>
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

      <div className="mt-12 border-t border-slate-700 pt-6 text-center text-sm text-white font-poppins-regular">
        &copy; {new Date().getFullYear()} HappyPaws. Bản quyền thuộc về
        HappyPaws.
      </div>
    </footer>
  );
};

export default Footer;
