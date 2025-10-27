"use client";

import React, { useEffect } from "react";
import { useIsCartOpen } from "@/stores/cart.store";

interface PushLayoutProps {
  children: React.ReactNode;
}

/**
 * PushLayout - Layout wrapper with responsive cart drawer behavior
 * - On desktop (lg+): Reduces content width to calc(100% - 384px), cart slides into the created space
 * - On mobile/tablet: Cart overlays full width (body scroll locked to prevent background scroll)
 *
 * How it works:
 * - Content container width changes from 100% to calc(100% - 384px) on desktop
 * - Cart (position: fixed) stays at right: 0 and slides into the space
 * - This creates a true "push" effect where content shrinks and cart fills the gap
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

  // Manage body overflow for cart behavior
  useEffect(() => {
    if (isCartOpen) {
      // Only lock scroll on mobile/tablet (< lg breakpoint)
      const mediaQuery = window.matchMedia("(max-width: 1023px)");

      if (mediaQuery.matches) {
        // Mobile: lock vertical scroll only if no modal is open
        const hasOpenModal =
          document.querySelector('[data-slot="dialog-overlay"]') ||
          document.querySelector('[role="dialog"]');
        if (!hasOpenModal) {
          document.body.style.overflow = "hidden";
        }
      } else {
        // Desktop: hide horizontal overflow to prevent white space
        document.body.style.overflowX = "hidden";
        document.body.style.overflowY = "auto";
      }

      // Listen for resize
      const handleResize = () => {
        const hasOpenModal =
          document.querySelector('[data-slot="dialog-overlay"]') ||
          document.querySelector('[role="dialog"]');
        if (mediaQuery.matches && !hasOpenModal) {
          document.body.style.overflow = "hidden";
        } else if (!mediaQuery.matches) {
          document.body.style.overflowX = "hidden";
          document.body.style.overflowY = "auto";
        }
      };

      mediaQuery.addEventListener("change", handleResize);

      return () => {
        // Only restore if no modal is open
        const hasOpenModal =
          document.querySelector('[data-slot="dialog-overlay"]') ||
          document.querySelector('[role="dialog"]');
        if (!hasOpenModal) {
          document.body.style.overflow = "unset";
          document.body.style.overflowX = "unset";
          document.body.style.overflowY = "unset";
        }
        mediaQuery.removeEventListener("change", handleResize);
      };
    } else {
      // Only restore if no modal is open
      const hasOpenModal =
        document.querySelector('[data-slot="dialog-overlay"]') ||
        document.querySelector('[role="dialog"]');
      if (!hasOpenModal) {
        document.body.style.overflow = "unset";
        document.body.style.overflowX = "unset";
        document.body.style.overflowY = "unset";
      }
    }
  }, [isCartOpen]);

  return (
    <div
      className={`min-h-screen transition-all duration-300 ease-in-out overflow-x-hidden ${
        // Push on large screens (desktop) by reducing width, overlay on mobile/tablet
        isCartOpen ? "w-full lg:w-[calc(100%-384px)]" : "w-full"
      }`}
    >
      {children}
    </div>
  );
};

export default PushLayout;
