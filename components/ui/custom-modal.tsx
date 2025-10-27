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
      document.body.style.overflow = "hidden";
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          onClose();
        }
      };
      document.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = "";
        document.removeEventListener("keydown", handleKeyDown);
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
    <div className="fixed inset-0 z-[9999] bg-black/40 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={onClose} />
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        className="absolute inset-0 flex items-center justify-center p-4"
      >
        <div
          className={cn(
            "w-full max-w-2xl rounded-xl bg-white shadow-xl",
            className
          )}
        >
          {title && (
            <div className="flex items-center justify-between border-b px-6 py-4">
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
          <div className="px-6 py-5">{children}</div>
        </div>
      </div>
    </div>,
    document.body
  );
};
