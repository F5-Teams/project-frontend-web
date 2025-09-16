// fonts/font.ts
import localFont from "next/font/local";

export const poppins = localFont({
  src: [
    { path: "./FZ Poppins-Light.ttf", weight: "200", style: "normal" },
    { path: "./FZ Poppins-Regular.ttf", weight: "300", style: "normal" },
    { path: "./FZ Poppins-Medium.ttf", weight: "400", style: "normal" },
    { path: "./FZ Poppins-SemiBold.ttf", weight: "500", style: "normal" },
  ],
  variable: "--font-poppins",
  display: "swap",
});
