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
import { Bath, Hotel, PawPrint, ShoppingCart, Wallet } from "lucide-react";
import { useLayoutEffect, useRef } from "react";
import { logout } from "@/utils/auth";
import Image from "next/image";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { useCartSummary, useIsCartOpen } from "@/stores/cart.store";
import { BagDrawer } from "../shopping/BagDrawer";
import { useProductCartStore } from "@/stores/productCart.store";
import { useGetUser } from "@/services/users/hooks";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import NotificationBell from "@/components/notification/NotificationBell";

gsap.registerPlugin(ScrollTrigger);

export default function Header() {
  const cartSummary = useCartSummary();
  const isCartOpen = useIsCartOpen();
  const { items } = useProductCartStore();
  const { data: user } = useGetUser();

  const navRef = useRef<HTMLElement | null>(null);
  const leftPillRef = useRef<HTMLDivElement | null>(null);
  const bgRef = useRef<HTMLDivElement | null>(null);

  const handleLogout = () => {
    logout("/");
  };

  useLayoutEffect(() => {
    const navEl = navRef.current;
    const pillEl = leftPillRef.current;
    const bgEl = bgRef.current;
    if (!navEl || !pillEl || !bgEl) return;

    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

    const setInitial = () => {
      const navRect = navEl.getBoundingClientRect();
      const pillRect = pillEl.getBoundingClientRect();

      const x = pillRect.left - navRect.left;
      const y = pillRect.top - navRect.top;

      const navW = navRect.width;
      const navH = navRect.height;
      const pillW = pillRect.width;
      const pillH = pillRect.height;

      const EXPAND_DISTANCE = 220;
      const currentScroll =
        typeof window !== "undefined"
          ? window.scrollY || document.documentElement.scrollTop || 0
          : 0;
      const progress = Math.max(
        0,
        Math.min(currentScroll / EXPAND_DISTANCE, 1)
      );

      const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

      const targetX = lerp(x, 0, progress);
      const targetY = lerp(y, 0, progress);
      const targetHeight = lerp(pillH, navH, progress);
      const targetScaleX = lerp(pillW / navW, 1, progress);

      gsap.set(bgEl, {
        x: targetX,
        y: targetY,
        height: targetHeight,
        transformOrigin: "left center",
        scaleX: targetScaleX,
        borderRadius: progress >= 0.98 ? 0 : 9999,
        backgroundColor:
          progress >= 0.98 ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.7)",
        boxShadow:
          progress >= 0.98
            ? "0 10px 30px rgba(0,0,0,0.10)"
            : "0 10px 25px rgba(0,0,0,0.08)",
        backdropFilter: progress >= 0.98 ? "blur(10px)" : "blur(6px)",
        zIndex: 0,
      });
    };

    setInitial();

    const ctx = gsap.context(() => {
      if (reduce) {
        const navRect = navEl.getBoundingClientRect();
        const viewportW =
          typeof window !== "undefined" ? window.innerWidth : navRect.width;
        gsap.set(bgEl, {
          x: 0,
          y: 0,
          width: viewportW,
          height: navRect.height,
          scaleX: 1,
          borderRadius: 0,
          backgroundColor: "rgba(255,255,255,0.9)",
          backdropFilter: "blur(10px)",
          boxShadow: "0 10px 30px rgba(0,0,0,0.10)",
        });
        return;
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: document.documentElement,
          start: "top top",
          end: "+=220",
          scrub: 0.6,
        },
        defaults: { ease: "power2.out" },
      });

      tl.to(bgEl, {
        scaleX: 1,
        borderRadius: 0,
        height: () => navRef.current?.getBoundingClientRect().height || 72,
        backgroundColor: "rgba(255,255,255,0.9)",
        backdropFilter: "blur(10px)",
        boxShadow: "0 10px 30px rgba(0,0,0,0.10)",
        x: 0,
        y: 0,
      });

      const onResize = () => {
        ScrollTrigger.refresh();
        setInitial();
      };
      window.addEventListener("resize", onResize);
      ScrollTrigger.addEventListener("refreshInit", setInitial);

      return () => {
        window.removeEventListener("resize", onResize);
        ScrollTrigger.removeEventListener("refreshInit", setInitial);
      };
    });

    return () => ctx.revert();
  }, [isCartOpen]);

  return (
    <nav
      ref={navRef}
      className={
        "fixed top-0 inset-x-0 flex items-center justify-between px-16 py-4 z-100 transition-all duration-300 ease-in-out"
      }
    >
      <div
        ref={bgRef}
        className="pointer-events-none fixed inset-x-0 top-0"
        aria-hidden
      />

      <div
        ref={leftPillRef}
        className="relative z-10 inline-flex items-center gap-[60px] px-6 py-2 rounded-full bg-transparent"
        style={{ height: "72px" }}
      >
        <Link href="/" className="cursor-pointer">
          <Image
            alt="Logo"
            src={Logo}
            className="object-contain"
            style={{ height: "56px", width: "auto" }}
          />
        </Link>

        <NavigationMenu>
          <NavigationMenuList className="inline-flex items-start gap-8 relative">
            <NavigationMenuItem>
              <NavigationMenuTrigger className="font-poppins-light font-light text-[14px] sm:text-[15px] md:text-[16px] 2xl:text-[18px] text-center leading-6 tracking-[0.048px] hover:text-primary hover:bg-transparent transition-colors cursor-pointer">
                <p className="cursor-pointer">DỊCH VỤ</p>
              </NavigationMenuTrigger>
              <NavigationMenuContent className="p-3 absolute left-1/2 -translate-x-1/2 border-none min-w-[280px] z-100 bg-white/90 backdrop-blur shadow-lg rounded-xl">
                <ul className="font-light grid gap-4">
                  <li>
                    <NavigationMenuLink asChild>
                      <Link
                        className="flex items-start gap-3 px-3 py-2 rounded-lg hover:bg-primary/10 transition-all duration-200 hover:translate-x-1 cursor-pointer"
                        href="/spa"
                      >
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
                      </Link>
                    </NavigationMenuLink>
                  </li>

                  <li>
                    <NavigationMenuLink asChild>
                      <Link
                        className="flex items-start gap-3 p-3 rounded-lg hover:bg-primary/10 transition-all duration-200 hover:translate-x-1 cursor-pointer"
                        href="/hotel"
                      >
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
                      </Link>
                    </NavigationMenuLink>
                  </li>

                  <li>
                    <NavigationMenuLink asChild>
                      <Link
                        className="flex items-start gap-3 p-3 rounded-lg hover:bg-primary/10 transition-all duration-200 hover:translate-x-1 cursor-pointer"
                        href="/product"
                      >
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
                      </Link>
                    </NavigationMenuLink>
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
                href="/policy"
                className="relative w-fit -mt-px font-poppins-light text-[14px] sm:text-[15px] md:text-[16px] 2xl:text-[18px] text-foreground text-center leading-6 tracking-[0.048px] hover:text-primary hover:bg-transparent transition-colors"
              >
                CHÍNH SÁCH
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

      {/* KHỐI PHẢI */}
      <div className="relative z-10 inline-flex items-center gap-3 p-4 ml-auto">
        <NotificationBell />
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

        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 group cursor-pointer">
                <span className="hidden sm:inline-block font-poppins-light text-sm group-hover:text-primary transition-colors">
                  {user.userName || "Người dùng"}
                </span>
                <div className="w-12 h-12 rounded-full overflow-hidden bg-linear-to-br from-pink-400 to-yellow-300 flex items-center justify-center text-white font-semibold uppercase">
                  {user.avatar ? (
                    <Image
                      src={user.avatar}
                      alt="Avatar"
                      width={48}
                      height={48}
                      className="object-cover rounded-full"
                    />
                  ) : (
                    user.userName?.[0] || "U"
                  )}
                </div>
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56 pr-2">
              <Link href="/wallet">
                <div className="px-2 py-2 mx-1 my-1 bg-linear-to-r from-primary/10 to-primary/5 rounded-lg border border-primary/20 cursor-pointer hover:bg-linear-to-r hover:from-primary/15 hover:to-primary/10 transition-all">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <p className="font-poppins-light text-xs text-muted-foreground mb-1">
                        Số dư ví
                      </p>
                      <p className="font-poppins-regular text-[14px] text-primary font-semibold">
                        {user.walletBalance?.toLocaleString("vi-VN")} ₫
                      </p>
                    </div>
                    <div className="flex items-center justify-center bg-primary/20 rounded-lg p-2">
                      <Wallet className="w-5 h-5 text-primary" />
                    </div>
                  </div>
                </div>
              </Link>

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

              {user.role?.id === 4 && (
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
            <Link
              href="/register"
              className="btn-default border-primary cursor-pointer"
            >
              Đăng ký
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
