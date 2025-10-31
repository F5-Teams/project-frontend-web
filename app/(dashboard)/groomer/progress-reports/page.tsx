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

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Đơn có hình ảnh</h2>

      <div className="grid grid-cols-12 gap-4">
        {/* Left: list */}
        <div className="col-span-12 md:col-span-5">
          <BookingsWithImagesList
            onSelectBooking={setSelectedBooking}
            selectedBooking={selectedBooking}
            onRequestUpload={(bookingId, imageType) =>
              setUploadModal({ open: true, bookingId, imageType })
            }
          />
        </div>

        {/* Right: detail */}
        <div className="col-span-12 md:col-span-7">
          <ListDetail booking={selectedBooking} />
        </div>
      </div>

      {uploadModal.open && uploadModal.bookingId != null && (
        <StartServicePanel
          bookingId={uploadModal.bookingId}
          imageType={uploadModal.imageType ?? "BEFORE"}
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
