"use client";

import Sidebar from "@/components/profile/Sidebar";
import { useState } from "react";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex min-h-screen bg-gradient-to-b from-pink-100 via-white to-yellow-100">
      <Sidebar open={open} onToggle={() => setOpen((v) => !v)} />
      <main className="flex-1 overflow-auto">
        <div className="p-4 md:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
