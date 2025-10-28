"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type Props = React.HTMLAttributes<HTMLDivElement> & {
  /**
   * "x" => overflow-x-auto, "y" => overflow-y-auto, default auto cho cả hai
   */
  axis?: "x" | "y" | "both";
  /** chừa 1 chút padding bên phải/ dưới để thumb không che nội dung */
  gutter?: boolean;
};

export function CustomeScrolling({
  axis = "both",
  gutter = true,
  className,
  children,
  ...rest
}: Props) {
  const overflow =
    axis === "x"
      ? "overflow-x-auto overflow-y-hidden"
      : axis === "y"
      ? "overflow-y-auto overflow-x-hidden"
      : "overflow-auto";

  // gutter: pe-1 cho dọc, pb-1 cho ngang, cả hai thì pe-1 pb-1
  const gutterClass =
    gutter && axis === "y"
      ? "pe-1"
      : gutter && axis === "x"
      ? "pb-1"
      : gutter
      ? "pe-1 pb-1"
      : "";

  return (
    <div
      className={cn("thin-scroll", overflow, gutterClass, className)}
      {...rest}
    >
      {children}
    </div>
  );
}
