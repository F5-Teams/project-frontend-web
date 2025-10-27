"use client";

import React from "react";
import { useIsCartOpen } from "@/stores/cart.store";

interface PushLayoutProps {
  children: React.ReactNode;
}

/**
 * PushLayout - Layout wrapper that pushes content to the left when cart is open
 *
 * Usage:
 * ```tsx
 * import { PushLayout } from "@/components/cart/PushLayout";
 *
 * export default function MyPage() {
 *   return (
 *     <PushLayout>
 *       <div>Your page content here</div>
 *     </PushLayout>
 *   );
 * }
 * ```
 */
export const PushLayout: React.FC<PushLayoutProps> = ({ children }) => {
  const isCartOpen = useIsCartOpen();

  return (
    <div
      className={`min-h-screen w-full transition-all duration-300 ease-in-out ${
        isCartOpen ? "-translate-x-96" : "translate-x-0"
      }`}
    >
      {children}
    </div>
  );
};

export default PushLayout;
