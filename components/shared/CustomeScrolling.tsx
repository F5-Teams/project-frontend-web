"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type Props = React.HTMLAttributes<HTMLDivElement> & {
  axis?: "x" | "y" | "both";
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
