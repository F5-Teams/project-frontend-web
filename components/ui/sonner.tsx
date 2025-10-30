"use client";

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({
  className,
  position,
  toastOptions,
  ...props
}: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      position={position ?? "top-right"}
      offset={16}
      closeButton
      className={`toaster group font-light text-[16px] ${className ?? ""}`}
      toastOptions={{
        classNames: {
          toast: "font-light text-[16px] leading-6",
          title: "font-light text-slate-900",
          description: "font-light text-slate-500",
        },
        ...toastOptions,
      }}
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      style={
        {
          "--border-radius": "var(--radius-xl)",
          "--font-sans":
            "var(--font-poppins), ui-sans-serif, system-ui, sans-serif",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
