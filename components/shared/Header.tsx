"use client";

import Link from "next/link";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Logo from "@/public/logo/HappyPaws Logo.svg";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuContent,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Bath, Hotel, PawPrint } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Header() {
  const router = useRouter();
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

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    setAuth({ token: null, user: null });
    router.push("/");
  };

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
        <Image
          alt="Logo"
          src={Logo}
          className="object-contain"
          width={100}
          height={100}
          style={{ maxHeight: "56px" }}
        />
        <NavigationMenu>
          <NavigationMenuList className="inline-flex items-start gap-8 relative">
            <NavigationMenuItem>
              <NavigationMenuTrigger
                className="font-poppins-light font-light text-[14px] sm:text-[15px] md:text-[16px] 
                2xl:text-[18px] text-center leading-[24px] 
                tracking-[0.048px] hover:text-primary hover:bg-transparent transition-colors cursor-pointer"
              >
                <p className="cursor-pointer ">DỊCH VỤ</p>
              </NavigationMenuTrigger>
              <NavigationMenuContent className="p-3 absolute left-1/2 -translate-x-1/2 border-none min-w-[280px]">
                <ul className=" font-light grid gap-4">
                  <li>
                    <Link
                      className="cursor-pointer"
                      href="/spa"
                      legacyBehavior
                      passHref
                    >
                      <NavigationMenuLink className="flex items-start gap-3 px-3 py-2 rounded-lg hover:bg-primary/10 transition-all duration-200 hover:translate-x-1">
                        <div>
                          <div className="flex gap-2 items-center text-primary">
                            <Bath className="w-5 h-5 text-primary " />
                            <p className="font-poppins-regular">
                              Spa & Grooming
                            </p>
                          </div>
                          <p className="font-poppins-light text-[14px] mt-1 text-muted-foreground">
                            Tắm rửa, cắt tỉa lông và chăm sóc sắc đẹp cho thú
                            cưng
                          </p>
                        </div>
                      </NavigationMenuLink>
                    </Link>
                  </li>

                  <li>
                    <Link
                      className="cursor-pointer"
                      href="/hotel"
                      legacyBehavior
                      passHref
                    >
                      <NavigationMenuLink className="flex items-start gap-3 p-3 rounded-lg hover:bg-primary/10 transition-all duration-200 hover:translate-x-1">
                        <div>
                          <div className="flex gap-2 items-center text-primary">
                            <Hotel className="w-5 h-5 text-primary" />
                            <p className="font-poppins-regular">
                              Khách sạn thú cưng
                            </p>
                          </div>
                          <p className="font-poppins-light text-[14px] mt-1 text-muted-foreground">
                            Dịch vụ lưu trú tiện nghi và an toàn cho thú cưng
                            của bạn
                          </p>
                        </div>
                      </NavigationMenuLink>
                    </Link>
                  </li>

                  <li>
                    <Link
                      className="cursor-pointer"
                      href="/product"
                      legacyBehavior
                      passHref
                    >
                      <NavigationMenuLink className="flex items-start gap-3 p-3 rounded-lg hover:bg-primary/10 transition-all duration-200 hover:translate-x-1">
                        <div>
                          <div className="flex gap-2 items-center text-primary">
                            <PawPrint className="w-5 h-5 text-primary" />
                            <p className="font-poppins-regular">
                              Sản phẩm cho thú cưng
                            </p>
                          </div>
                          <p className="font-poppins-light text-[14px] mt-1 text-muted-foreground">
                            Thức ăn, phụ kiện và đồ chơi chất lượng cho thú cưng
                          </p>
                        </div>
                      </NavigationMenuLink>
                    </Link>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 group cursor-pointer">
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
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 pr-2">
              <Link href="/profile">
                <DropdownMenuItem className="font-poppins-light text-[14px] focus:text-primary transition-all duration-200 hover:translate-x-1">
                  Profile
                </DropdownMenuItem>
              </Link>
              <DropdownMenuItem
                onClick={handleLogout}
                className="font-poppins-regular text-error text-[14px] transition-all duration-200 hover:translate-x-1 hover:text-error"
              >
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
