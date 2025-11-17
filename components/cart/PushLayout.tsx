"use client";

import React, { useEffect } from "react";
import { useIsCartOpen } from "@/stores/cart.store";

interface PushLayoutProps {
  children: React.ReactNode;
}

/**
 * PushLayout - Layout wrapper for cart drawer behavior
 * - Always use overlay mode. The cart drawer floats above content and does NOT push or shrink the page.
 * - Lock background scroll when the drawer is open on all breakpoints.
 *
 * Why: The previous implementation reduced page width on desktop to create a
 * "push" effect, which caused the whole page to shift. This version removes
 * width changes entirely for a stable layout.
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

  // Manage body overflow for overlay drawer (no layout push)
  useEffect(() => {
    const hasOpenModal =
      document.querySelector('[data-slot="dialog-overlay"]') ||
      document.querySelector('[role="dialog"]');

    if (isCartOpen && !hasOpenModal) {
      // Lock vertical scroll for background when drawer is open
      document.body.style.overflow = "hidden";
    } else if (!isCartOpen && !hasOpenModal) {
      // Restore when drawer closes and no other modal is present
      document.body.style.overflow = "unset";
      document.body.style.overflowX = "unset";
      document.body.style.overflowY = "unset";
    }
  }, [isCartOpen]);

  return (
    <div className="min-h-screen w-full overflow-x-hidden">{children}</div>
  );
};

export default PushLayout;
