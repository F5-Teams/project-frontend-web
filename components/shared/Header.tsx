import Link from "next/link";
import Image from "next/image";
import Logo from "@/public/logo/HappyPaws Logo.svg";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "../ui/navigation-menu";
export default function Header() {
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
