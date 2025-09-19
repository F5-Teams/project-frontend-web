"use client";
import Link from "next/link";
import Image from "next/image";
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

export default function Header() {
  const router = useRouter();
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
                2xl:text-[18px] text-foreground text-center leading-[24px] 
                tracking-[0.048px] hover:text-primary hover:bg-transparent transition-colors cursor-pointer"
              >
                <p
                  className="cursor-pointer
                "
                  onClick={() => router.push("/")}
                >
                  DỊCH VỤ
                </p>
              </NavigationMenuTrigger>
              <NavigationMenuContent className="p-3 absolute left-1/2 -translate-x-1/2  min-w-[280px]">
                <ul className=" font-light grid gap-4">
                  <li>
                    <Link
                      className="cursor-pointer"
                      href="/spa"
                      legacyBehavior
                      passHref
                    >
                      <NavigationMenuLink className="flex items-start gap-3 p-3 rounded-lg hover:bg-primary/10 transition-all duration-200 hover:translate-x-1">
                        <div>
                          <div className="flex gap-2 items-center text-primary">
                            <Bath className="w-5 h-5 text-primary " />
                            <p className="font-poppins-regular">
                              Spa & Grooming
                            </p>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Tắm rửa, cắt tỉa lông và chăm sóc sắc đẹp cho thú
                            cưng.
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
                          <p className="text-sm text-muted-foreground">
                            Dịch vụ lưu trú tiện nghi và an toàn cho thú cưng
                            của bạn.
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
                          <p className="text-sm text-muted-foreground">
                            Thức ăn, phụ kiện và đồ chơi chất lượng cho thú
                            cưng.
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

      <div className="inline-flex items-start gap-[8px] p-4 ml-auto">
        <Link href="/login">
          <button className="btn-primary ">Đăng nhập</button>
        </Link>
        <Link href="/register">
          <button className="btn-default">Đăng ký</button>
        </Link>
      </div>
    </nav>
  );
}
