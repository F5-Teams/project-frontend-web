// fonts/font.ts
import localFont from "next/font/local";

export const poppins = localFont({
  src: [
    { path: "./FZ Poppins-Thin.ttf", weight: "100", style: "normal" },
    { path: "./FZ Poppins-ThinItalic.ttf", weight: "100", style: "italic" },

    { path: "./FZ Poppins-ExtraLight.ttf", weight: "200", style: "normal" },
    {
      path: "./FZ Poppins-ExtraLightItalic.ttf",
      weight: "200",
      style: "italic",
    },

    { path: "./FZ Poppins-Light.ttf", weight: "300", style: "normal" },
    { path: "./FZ Poppins-LightItalic.ttf", weight: "300", style: "italic" },

    { path: "./FZ Poppins-Regular.ttf", weight: "400", style: "normal" },
    { path: "./FZ Poppins-Italic.ttf", weight: "400", style: "italic" },

    { path: "./FZ Poppins-Medium.ttf", weight: "500", style: "normal" },
    { path: "./FZ Poppins-MediumItalic.ttf", weight: "500", style: "italic" },

    { path: "./FZ Poppins-SemiBold.ttf", weight: "600", style: "normal" },
    { path: "./FZ Poppins-SemiBoldItalic.ttf", weight: "600", style: "italic" },

    { path: "./FZ Poppins-Bold.ttf", weight: "700", style: "normal" },
    { path: "./FZ Poppins-BoldItalic.ttf", weight: "700", style: "italic" },

    { path: "./FZ Poppins-ExtraBold.ttf", weight: "800", style: "normal" },
    {
      path: "./FZ Poppins-ExtraBoldItalic.ttf",
      weight: "800",
      style: "italic",
    },

    { path: "./FZ Poppins-Black.ttf", weight: "900", style: "normal" },
    { path: "./FZ Poppins-BlackItalic.ttf", weight: "900", style: "italic" },
  ],
  variable: "--font-poppins",
  display: "swap",
});
