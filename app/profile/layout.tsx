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
    <div className="flex min-h-screen bg-linear-to-b from-pink-100 via-white to-yellow-100">
      <Sidebar open={open} onToggle={() => setOpen((v) => !v)} />
      <main className="flex-1 overflow-auto lg:ml-0">
        <div className="container mx-auto md:py-2 lg:py-4">{children}</div>
      </main>
    </div>
  );
}
