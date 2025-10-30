import React from "react";
import { Spinner } from "@/components/ui/spinner";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/20">
      <Spinner className=" text-pink-500" />
    </div>
  );
}
