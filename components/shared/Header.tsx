"use client";

import Link from "next/link";

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
import { Bath, Hotel, PawPrint, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { useCartSummary, useIsCartOpen } from "@/stores/cart.store";
import { BagDrawer } from "../shopping/BagDrawer";
import { useProductCartStore } from "@/stores/productCart.store";
import { useGetUser } from "@/services/users/hooks";

export default function Header() {
  const router = useRouter();
  const cartSummary = useCartSummary();
  const isCartOpen = useIsCartOpen();
  const { items } = useProductCartStore();
  const { data: user } = useGetUser();
  const [auth, setAuth] = useState<{
    token: string | null;
    user: { userName?: string; avatar?: string } | null;
  }>({
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
      className={`fixed top-0 left-0 flex items-center justify-between px-16 py-4 z-100 transition-all duration-300 ease-in-out ${
        isCartOpen ? "w-full lg:w-[calc(100%-560px)]" : "w-full"
      }`}
    >
      <div
        className="inline-flex items-center gap-[60px] px-6 py-2 bg-white/70 backdrop-blur shadow-lg rounded-2xl"
        style={{ height: "72px" }}
      >
        <Link href="/" className="cursor-pointer">
          <Image
            alt="Logo"
            src={Logo}
            className="object-contain"
            width={100}
            height={100}
            style={{ maxHeight: "56px" }}
          />
        </Link>
        <NavigationMenu>
          <NavigationMenuList className="inline-flex items-start gap-8 relative">
            <NavigationMenuItem>
              <NavigationMenuTrigger
                className="font-poppins-light font-light text-[14px] sm:text-[15px] md:text-[16px] 
                2xl:text-[18px] text-center leading-6 
                tracking-[0.048px] hover:text-primary hover:bg-transparent transition-colors cursor-pointer"
              >
                <p className="cursor-pointer ">DỊCH VỤ</p>
              </NavigationMenuTrigger>
              <NavigationMenuContent className="p-3 absolute left-1/2 -translate-x-1/2 border-none min-w-[280px] z-100 bg-white/90 backdrop-blur shadow-lg rounded-xl">
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
                href="/about-us"
                className="relative w-fit -mt-px font-poppins-light text-[14px] sm:text-[15px] md:text-[16px] 2xl:text-[18px] text-foreground text-center leading-6 tracking-[0.048px] hover:text-primary hover:bg-transparent transition-colors"
              >
                VỀ CHÚNG TÔI
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink
                href="#nhận-nuôi"
                className="relative w-fit -mt-px font-poppins-light text-[14px] sm:text-[15px] md:text-[16px] 2xl:text-[18px] text-foreground text-center leading-6 tracking-[0.048px] hover:text-primary hover:bg-transparent transition-colors"
              >
                NHẬN NUÔI
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink
                href="#liên-hệ"
                className="relative w-fit -mt-px font-poppins-light text-[14px] sm:text-[15px] md:text-[16px] 2xl:text-[18px] text-foreground text-center leading-6 tracking-[0.048px] hover:text-primary hover:bg-transparent transition-colors"
              >
                LIÊN HỆ
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      <div className="inline-flex items-center gap-3 p-4 ml-auto">
        {/* Cart Icon */}
        <CartDrawer>
          <button className="relative cursor-pointer p-2 rounded-full hover:bg-gray-100 transition-colors group">
            <ShoppingCart className="h-6 w-6 text-gray-600 group-hover:text-primary transition-colors" />
            {cartSummary.totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                {cartSummary.totalItems}
              </span>
            )}
          </button>
        </CartDrawer>

        <BagDrawer>
          <button className="relative cursor-pointer p-2 rounded-full hover:bg-gray-100 transition-colors group">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              className="h-6 w-6 text-gray-600 group-hover:text-primary transition-colors"
              aria-hidden="true"
            >
              <path
                d="M5.174 3h5.652a1.5 1.5 0 0 1 1.49 1.328l.808 7A1.5 1.5 0 0 1 11.634 13H4.366a1.5 1.5 0 0 1-1.49-1.672l.808-7A1.5 1.5 0 0 1 5.174 3m-2.98 1.156A3 3 0 0 1 5.174 1.5h5.652a3 3 0 0 1 2.98 2.656l.808 7a3 3 0 0 1-2.98 3.344H4.366a3 3 0 0 1-2.98-3.344zM5 5.25a.75.75 0 0 1 1.5 0v.25a1.5 1.5 0 1 0 3 0v-.25a.75.75 0 0 1 1.5 0v.25a3 3 0 0 1-6 0z"
                fill="currentColor"
                fillRule="evenodd"
                clipRule="evenodd"
                strokeWidth="0.5"
              />
            </svg>

            {items.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                {items.length}
              </span>
            )}
          </button>
        </BagDrawer>

        {auth.token ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 group cursor-pointer">
                <span className="hidden sm:inline-block font-poppins-light text-sm group-hover:text-primary transition-colors">
                  {auth.user?.userName || "thaoxinhdep"}
                </span>
                <div className="w-12 h-12 rounded-full overflow-hidden bg-linear-to-br from-pink-400 to-yellow-300 flex items-center justify-center text-white font-semibold uppercase">
                  {auth.user?.avatar ? (
                    <Image
                      src={auth.user.avatar}
                      alt="Avatar"
                      width={48}
                      height={48}
                      className="w-14 h-14 object-cover rounded-full"
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
                  Thông tin cá nhân
                </DropdownMenuItem>
              </Link>
              <Link href="/profile-pet">
                <DropdownMenuItem className="font-poppins-light text-[14px] focus:text-primary transition-all duration-200 hover:translate-x-1">
                  Thông tin thú cưng
                </DropdownMenuItem>
              </Link>
              {user?.role.id === 4 && (
                <Link href="/history-order">
                  <DropdownMenuItem className="font-poppins-light text-[14px] focus:text-primary transition-all duration-200 hover:translate-x-1">
                    Lịch sử đơn hàng
                  </DropdownMenuItem>
                </Link>
              )}
              <DropdownMenuItem
                onClick={handleLogout}
                className="font-poppins-regular text-error text-[14px] transition-all duration-200 hover:translate-x-1 hover:text-error"
              >
                Đăng xuất
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
