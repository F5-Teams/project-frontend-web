import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { poppins } from "../fonts/font";
import { Providers } from "./_providers";
import { Toaster } from "@/components/ui/sonner";
import ScrollToTop from "@/components/shared/ScrollToTop";
import HappyPawsChat from "@/components/chat/HappyPawsChat";

// import ReduxProvider from "./ReduxProvider";

const getPoppins = Poppins({
  variable: "--font-google-poppins",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "HappyPaws",
  description:
    "Spa, Hotel & Nhận nuôi thú cưng. Dịch vụ chăm sóc, lưu trú cao cấp và kết nối nhận nuôi yêu thương cho bé cưng của bạn",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={`${poppins.variable} ${getPoppins.variable}`}>
      <body className="antialiased">
        <Providers>
          <ScrollToTop />
          {children}
          {/* Global floating chat widget visible on all pages */}
          <HappyPawsChat />
          <Toaster
            toastOptions={{
              duration: 5000,
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
