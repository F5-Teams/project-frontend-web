"use client";
import React, { useState } from "react";
import BookingsWithImagesList from "@/components/groomer/list/BookingsWithImagesList";
import ListDetail from "@/components/groomer/list/ListDetail";
import StartServicePanel from "@/components/groomer/dashboard/StartServicePanel";
import type { Booking } from "@/services/groomer/list/type";

type UploadModalState = {
  open: boolean;
  bookingId?: number | null;
  imageType?: "BEFORE" | "DURING" | "AFTER";
};

export default function OnServiceListPage() {
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [uploadModal, setUploadModal] = useState<UploadModalState>({
    open: false,
  });
  const detailOpen = !!selectedBooking;

  return (
    <div>
      <div className="relative flex gap-4">
        {/* List panel: full width by default, shrinks when detail opens */}
        <div
          className={
            "transition-[width] duration-300 ease-in-out w-full " +
            (detailOpen ? "md:w-5/12" : "md:w-full")
          }
        >
          {/* Optional toolbar to collapse detail when open */}
          {detailOpen && (
            <div className="flex justify-end mb-2">
              <button
                type="button"
                onClick={() => setSelectedBooking(null)}
                className="text-xs rounded-md border px-2 py-1 hover:bg-slate-50"
              >
                Thu gọn chi tiết
              </button>
            </div>
          )}
          <BookingsWithImagesList
            onSelectBooking={setSelectedBooking}
            selectedBooking={selectedBooking}
          />
        </div>

        {/* Detail panel: slides in from the right */}
        <div
          className={
            "relative overflow-hidden transition-all duration-300 ease-in-out " +
            (detailOpen ? "md:w-7/12 w-full" : "w-0 md:w-0")
          }
          aria-hidden={!detailOpen}
        >
          <div
            className={
              "h-full transform transition-transform duration-300 " +
              (detailOpen ? "translate-x-0" : "translate-x-full")
            }
          >
            <ListDetail booking={selectedBooking} />
          </div>
        </div>
      </div>

      {uploadModal.open && uploadModal.bookingId != null && (
        <StartServicePanel
          bookingId={uploadModal.bookingId}
          // Force BEFORE for this panel since AFTER upload handled elsewhere
          imageType={"BEFORE"}
          onDone={() => setUploadModal({ open: false })}
          onCancel={() => setUploadModal({ open: false })}
          title={
            uploadModal.imageType === "AFTER"
              ? "Upload ảnh sau khi thực hiện dịch vụ"
              : undefined
          }
          submitLabel={
            uploadModal.imageType === "AFTER" ? "Tải ảnh" : undefined
          }
        />
      )}
    </div>
  );
}
