// app/layout.tsx

import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { poppins } from "../fonts/font";
import { Providers } from "./_providers";

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
    <html lang="vi">
      <body
        className={`${poppins.variable} ${getPoppins.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
