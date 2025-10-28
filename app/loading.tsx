import React from "react";
import { Spinner } from "@/components/ui/spinner";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/75">
      <div className="flex flex-col items-center gap-4 bg-popover/90 p-6 rounded-lg shadow-lg">
        <Spinner className="h-12 w-12 text-pink-500" />
      </div>
    </div>
  );
}
