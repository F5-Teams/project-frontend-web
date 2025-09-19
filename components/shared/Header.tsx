"use client";

import Link from "next/link";
import Image from "next/image";
import Logo from "@/public/logo/HappyPaws Logo.svg";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { useEffect, useState } from "react";

export default function Header() {
  const [auth, setAuth] = useState<{ token: string | null; user: any | null }>({
    token: null,
    user: null,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("accessToken");
    const userRaw = localStorage.getItem("user");
    setAuth({
      token,
      user: userRaw ? JSON.parse(userRaw) : null,
    });
  }, []);

  return (
    <nav
      className="flex w-full items-center justify-between px-16 py-4 relative"
      style={{ zIndex: 50, position: "relative" }}
    >
      <div
        className="absolute left-16 top-4 z-50 inline-flex items-center gap-[60px] px-6 py-2
      bg-white/70 backdrop-blur shadow-lg rounded-2xl"
        style={{ height: "72px" }}
      >
        <Link href="/">
          <Image
            alt="Logo"
            src={Logo}
            className="object-contain cursor-pointer"
            width={100}
            height={100}
            style={{ maxHeight: "56px" }}
          />
        </Link>
        <NavigationMenu>
          <NavigationMenuList className="inline-flex items-start gap-8 relative">
            <NavigationMenuItem>
              <NavigationMenuLink
                href="#about"
                className="relative w-fit mt-[-1.00px] font-poppins-light text-[14px] sm:text-[15px] md:text-[16px] 2xl:text-[18px] text-foreground text-center leading-[24px] tracking-[0.048px] hover:text-primary hover:bg-transparent transition-colors"
              >
                VỀ CHÚNG TÔI
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink
                href="#dịch-vụ"
                className="relative w-fit mt-[-1.00px] font-poppins-light text-[14px] sm:text-[15px] md:text-[16px] 2xl:text-[18px] text-foreground text-center leading-[24px] tracking-[0.048px] hover:text-primary hover:bg-transparent transition-colors"
              >
                DỊCH VỤ
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink
                href="#nhận-nuôi"
                className="relative w-fit mt-[-1.00px] font-poppins-light text-[14px] sm:text-[15px] md:text-[16px] 2xl:text-[18px] text-foreground text-center leading-[24px] tracking-[0.048px] hover:text-primary hover:bg-transparent transition-colors"
              >
                NHẬN NUÔI
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink
                href="#liên-hệ"
                className="relative w-fit mt-[-1.00px] font-poppins-light text-[14px] sm:text-[15px] md:text-[16px] 2xl:text-[18px] text-foreground text-center leading-[24px] tracking-[0.048px] hover:text-primary hover:bg-transparent transition-colors"
              >
                LIÊN HỆ
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      <div className="inline-flex items-center gap-3 p-4 ml-auto">
        {auth.token ? (
          <Link
            href="/profile"
            className="flex items-center gap-2 group"
            style={{ position: "relative", zIndex: 60 }}
          >
            <span className="hidden sm:inline-block font-poppins-light text-sm group-hover:text-primary transition-colors">
              {auth.user?.userName || "thaoxinhdep"}
            </span>
            <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-pink-400 to-yellow-300 flex items-center justify-center text-white font-semibold uppercase">
              {auth.user?.avatar ? (
                <Image
                  src={auth.user.avatar}
                  alt="Avatar"
                  fill
                  className="object-cover"
                />
              ) : (
                auth.user?.userName?.[0] || "T"
              )}
            </div>
          </Link>
        ) : (
          <>
            <Link href="/login" className="btn-primary cursor-pointer">
              Đăng nhập
            </Link>
            <Link href="/register" className="btn-default cursor-pointer">
              Đăng ký
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
