"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

interface CustomModalProps {
  open: boolean;
  title?: string;
  onClose(): void;
  children: React.ReactNode;
  className?: string;
}

export const CustomModal = ({
  open,
  title,
  onClose,
  children,
  className,
}: CustomModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      // Save original styles
      const originalOverflow = document.body.style.overflow;
      const originalPosition = document.body.style.position;
      const originalTop = document.body.style.top;
      const originalWidth = document.body.style.width;
      const scrollY = window.scrollY;

      // Lock scroll - use multiple methods for better compatibility
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          onClose();
        }
      };

      // Prevent wheel/touch events on background
      const preventScroll = (e: Event) => {
        e.preventDefault();
      };

      document.addEventListener("keydown", handleKeyDown);
      document.addEventListener("wheel", preventScroll, { passive: false });
      document.addEventListener("touchmove", preventScroll, { passive: false });

      return () => {
        // Restore original styles
        document.body.style.overflow = originalOverflow;
        document.body.style.position = originalPosition;
        document.body.style.top = originalTop;
        document.body.style.width = originalWidth;

        // Restore scroll position
        window.scrollTo(0, scrollY);

        document.removeEventListener("keydown", handleKeyDown);
        document.removeEventListener("wheel", preventScroll);
        document.removeEventListener("touchmove", preventScroll);
      };
    }
  }, [open, onClose]);

  useEffect(() => {
    if (open && modalRef.current) {
      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[
        focusableElements.length - 1
      ] as HTMLElement;

      const handleTabKey = (event: KeyboardEvent) => {
        if (event.key === "Tab") {
          if (event.shiftKey) {
            if (document.activeElement === firstElement) {
              event.preventDefault();
              lastElement.focus();
            }
          } else {
            if (document.activeElement === lastElement) {
              event.preventDefault();
              firstElement.focus();
            }
          }
        }
      };

      modalRef.current.addEventListener("keydown", handleTabKey);
      return () => {
        modalRef.current?.removeEventListener("keydown", handleTabKey);
      };
    }
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] bg-black/40 backdrop-blur-sm overflow-hidden">
      <div
        className="absolute inset-0"
        onClick={onClose}
        onWheel={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
      />
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        className="absolute inset-0 flex items-center justify-center p-4 overflow-hidden"
      >
        <div
          className={cn(
            "w-full max-w-2xl rounded-xl bg-white shadow-xl max-h-[90vh] flex flex-col",
            className
          )}
          onClick={(e) => e.stopPropagation()}
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
        >
          {title && (
            <div className="flex items-center justify-between border-b px-6 py-4 flex-shrink-0">
              <span className="text-lg font-semibold">{title}</span>
              <button
                onClick={onClose}
                className="text-sm text-gray-500 hover:text-gray-900"
                aria-label="Đóng modal"
              >
                Đóng
              </button>
            </div>
          )}
          <div className="px-6 py-5 overflow-y-auto">{children}</div>
        </div>
      </div>
    </div>,
    document.body
  );
};
