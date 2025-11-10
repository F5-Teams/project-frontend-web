"use client";

import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { Booking } from "@/services/groomer/list/type";
import { formatCurrency } from "@/utils/currency";
import Image from "next/image";
import ModalUpload from "./ModalUpload";

type Props = {
  booking?: Booking | null;
};

export default function ListDetail({ booking }: Props) {
  const [showModal, setShowModal] = useState(false);
  const [beforeIndex, setBeforeIndex] = useState(0);
  const [afterIndex, setAfterIndex] = useState(0);

  const [beforeDir, setBeforeDir] = useState<"left" | "right">("right");
  const [afterDir, setAfterDir] = useState<"left" | "right">("right");
  const [lightbox, setLightbox] = useState<{
    open: boolean;
    images: { id: number; imageUrl: string }[];
    index: number;
    title?: string;
  }>({ open: false, images: [], index: 0 });
  const [lightboxDir, setLightboxDir] = useState<"left" | "right">("right");

  const beforeImagesAll = useMemo(
    () =>
      (booking?.Image ?? []).filter(
        (img) => img.type === "BEFORE" && !!img.imageUrl
      ),
    [booking]
  );
  const afterImagesAll = useMemo(
    () =>
      (booking?.Image ?? []).filter(
        (img) => img.type === "AFTER" && !!img.imageUrl
      ),
    [booking]
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        if (beforeImagesAll.length > 1) {
          setBeforeDir("left");
          setBeforeIndex(
            (i) => (i - 1 + beforeImagesAll.length) % beforeImagesAll.length
          );
        }
        if (afterImagesAll.length > 1) {
          setAfterDir("left");
          setAfterIndex(
            (i) => (i - 1 + afterImagesAll.length) % afterImagesAll.length
          );
        }
      } else if (e.key === "ArrowRight") {
        if (beforeImagesAll.length > 1) {
          setBeforeDir("right");
          setBeforeIndex((i) => (i + 1) % beforeImagesAll.length);
        }
        if (afterImagesAll.length > 1) {
          setAfterDir("right");
          setAfterIndex((i) => (i + 1) % afterImagesAll.length);
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [beforeImagesAll, afterImagesAll]);

  if (!booking) {
    return (
      <div className="p-6 bg-white rounded-md shadow-sm border h-full">
        <div className="text-sm font-poppins-regular text-muted-foreground">
          Chọn một đơn để xem chi tiết
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white rounded-xl shadow-sm border h-full flex flex-col gap-4">
      <div>
        <div className="text-lg font-poppins-regular">
          Khách hàng: {booking.customer?.firstName ?? ""}{" "}
          {booking.customer?.lastName ?? ""}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm h-full">
        <div className="md:col-span-2 flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-xs text-muted-foreground mb-1">Buổi</div>
              <div className=" font-poppins-light">
                {booking.dropDownSlot ?? "—"}
              </div>
            </div>

            <div>
              <div className="text-xs text-muted-foreground mb-1">
                Dịch vụ / Combo
              </div>
              <div className=" font-poppins-light">
                {booking.combo
                  ? booking.combo.name
                  : booking.servicePrice ?? "—"}
              </div>
            </div>

            <div>
              <div className="text-[14px] font-poppins-light text-blackd">
                Giá:{" "}
                {(() => {
                  const raw = booking.comboPrice ?? booking.servicePrice;
                  if (!raw) return "—";
                  const numeric = Number(raw);
                  if (isNaN(numeric)) return raw;
                  return formatCurrency(numeric);
                })()}
              </div>
            </div>

            <div>{/* empty cell to keep grid shape if needed */}</div>
          </div>

          {/* BEFORE + AFTER + PET side-by-side (clean reimplementation) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* BEFORE */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-poppins-light text-muted-foreground">
                  Hình ảnh (Trước dịch vụ)
                </div>
              </div>
              {(() => {
                const beforeImages = beforeImagesAll;
                if (beforeImages.length === 0) {
                  return (
                    <div className="text-sm font-poppins-light text-black">
                      Chưa có ảnh
                    </div>
                  );
                }
                const current = beforeImages[beforeIndex];
                return (
                  <div className="flex items-center gap-1">
                    {beforeImages.length >= 1 && (
                      <button
                        type="button"
                        aria-label="Previous image"
                        className="bg-white/90 hover:bg-white p-1 rounded-full shadow border"
                        onClick={(e) => {
                          e.stopPropagation();
                          setBeforeDir("left");
                          setBeforeIndex(
                            (i) =>
                              (i - 1 + beforeImages.length) %
                              beforeImages.length
                          );
                        }}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                    )}
                    <div className="relative inline-block">
                      <div
                        className="w-30 h-30 relative overflow-hidden border rounded-md cursor-zoom-in"
                        onClick={() =>
                          setLightbox({
                            open: true,
                            images: beforeImages,
                            index: beforeIndex,
                            title: "Ảnh trước dịch vụ",
                          })
                        }
                      >
                        <AnimatePresence initial={false} custom={beforeDir}>
                          <motion.div
                            key={current.id}
                            custom={beforeDir}
                            initial={{
                              opacity: 0,
                              x: beforeDir === "right" ? 24 : -24,
                            }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{
                              opacity: 0,
                              x: beforeDir === "right" ? -24 : 24,
                            }}
                            transition={{ duration: 0.25, ease: "easeOut" }}
                            className="absolute inset-0"
                          >
                            <Image
                              src={current.imageUrl}
                              alt={`before-${current.id}`}
                              fill
                              sizes="200px"
                              className="object-cover"
                            />
                          </motion.div>
                        </AnimatePresence>
                      </div>
                    </div>
                    {beforeImages.length >= 1 && (
                      <button
                        type="button"
                        aria-label="Next image"
                        className="bg-white/90 hover:bg-white p-1 rounded-full shadow border"
                        onClick={(e) => {
                          e.stopPropagation();
                          setBeforeDir("right");
                          setBeforeIndex((i) => (i + 1) % beforeImages.length);
                        }}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                );
              })()}
            </div>
            {/* AFTER */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-poppins-light text-black">
                  Hình ảnh (Sau dịch vụ)
                </div>
              </div>
              {(() => {
                const afterImages = afterImagesAll;
                if (afterImages.length === 0) {
                  return (
                    <div className="text-sm font-poppins-light text-muted-foreground">
                      Chưa có ảnh
                    </div>
                  );
                }
                const current = afterImages[afterIndex];
                return (
                  <div className="flex items-center gap-2">
                    {afterImages.length >= 3 && (
                      <button
                        type="button"
                        aria-label="Previous image"
                        className="bg-white/90 hover:bg-white p-1 rounded-full shadow border"
                        onClick={(e) => {
                          e.stopPropagation();
                          setAfterDir("left");
                          setAfterIndex(
                            (i) =>
                              (i - 1 + afterImages.length) % afterImages.length
                          );
                        }}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                    )}
                    <div className="relative inline-block">
                      <div
                        className="w-30 h-30 relative overflow-hidden border rounded-md cursor-zoom-in"
                        onClick={() =>
                          setLightbox({
                            open: true,
                            images: afterImages,
                            index: afterIndex,
                            title: "Ảnh sau dịch vụ",
                          })
                        }
                      >
                        <AnimatePresence initial={false} custom={afterDir}>
                          <motion.div
                            key={current.id}
                            custom={afterDir}
                            initial={{
                              opacity: 0,
                              x: afterDir === "right" ? 24 : -24,
                            }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{
                              opacity: 0,
                              x: afterDir === "right" ? -24 : 24,
                            }}
                            transition={{ duration: 0.25, ease: "easeOut" }}
                            className="absolute inset-0"
                          >
                            <Image
                              src={current.imageUrl}
                              alt={`after-${current.id}`}
                              fill
                              sizes="200px"
                              className="object-cover"
                            />
                          </motion.div>
                        </AnimatePresence>
                      </div>
                    </div>
                    {afterImages.length >= 3 && (
                      <button
                        type="button"
                        aria-label="Next image"
                        className="bg-white/90 hover:bg-white p-1 rounded-full shadow border"
                        onClick={(e) => {
                          e.stopPropagation();
                          setAfterDir("right");
                          setAfterIndex((i) => (i + 1) % afterImages.length);
                        }}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                );
              })()}
            </div>

            {/* PET */}
            <div className="flex flex-col items-stretch justify-start h-full">
              <div className="w-full h-full min-h-60 rounded-md overflow-hidden border relative">
                {booking.pet?.images &&
                booking.pet.images.length > 0 &&
                booking.pet.images[0].imageUrl ? (
                  <Image
                    src={booking.pet.images[0].imageUrl}
                    alt={booking.pet?.name ?? "pet"}
                    fill
                    sizes="(max-width: 768px) 100vw, 300px"
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-poppins-regular text-xs text-muted-foreground">
                    Không có ảnh
                  </div>
                )}
              </div>
              <div className="mt-2 text-center">
                <div className="font-poppins-regular text-[16px]">
                  Bé {booking.pet?.name ?? "—"}
                </div>
                <div className="text-sm font-poppins-light text-black">
                  {booking.pet?.species ?? ""}{" "}
                  {booking.pet?.breed ? `• ${booking.pet.breed}` : ""}
                </div>
                <div className="text-sm font-poppins-light text-black">
                  {booking.pet?.age ?? "—"} tuổi
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-auto font-poppins-light text-xs text-muted-foreground">
        Đặt ngày:{" "}
        {booking.createdAt ? new Date(booking.createdAt).toLocaleString() : "—"}
        {afterImagesAll.length === 0 && booking.status === "ON_SERVICE" && (
          <div className="flex justify-end mb-3">
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="text-sm bg-pink-600 text-white px-3 py-1 rounded-md hover:bg-pink-700"
            >
              Gửi ảnh
            </button>
          </div>
        )}
      </div>

      {showModal && (
        <ModalUpload
          bookingId={booking.id}
          imageType="AFTER"
          onCancel={() => setShowModal(false)}
          onDone={() => setShowModal(false)}
        />
      )}

      {lightbox.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute rounded-2xl inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setLightbox({ open: false, images: [], index: 0 })}
          />
          <div className="relative w-full max-w-2xl mx-auto p-4">
            <div className=" rounded-lg shadow-lg p-4 flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <h2 className="text-sm text-white font-poppins-light">
                  {lightbox.title}
                </h2>
                <button
                  aria-label="Close"
                  onClick={() =>
                    setLightbox({ open: false, images: [], index: 0 })
                  }
                  className="p-1 rounded-2xl hover:bg-black/20"
                >
                  <X className="h-5 w-5 text-white" />
                </button>
              </div>
              {lightbox.images.length > 0 ? (
                <div className="relative w-full aspect-4/3 overflow-hidden rounded-md border">
                  <AnimatePresence initial={false} custom={lightboxDir}>
                    <motion.div
                      key={lightbox.images[lightbox.index]?.id ?? "no-img"}
                      custom={lightboxDir}
                      initial={{
                        opacity: 0,
                        x: lightboxDir === "right" ? 32 : -32,
                      }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{
                        opacity: 0,
                        x: lightboxDir === "right" ? -32 : 32,
                      }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="absolute inset-0"
                    >
                      <Image
                        src={lightbox.images[lightbox.index].imageUrl}
                        alt={`large-${lightbox.images[lightbox.index].id}`}
                        fill
                        sizes="1200px"
                        className="object-cover"
                      />
                    </motion.div>
                  </AnimatePresence>
                  {lightbox.images.length >= 2 && (
                    <>
                      <button
                        aria-label="Previous"
                        onClick={() => {
                          setLightboxDir("left");
                          setLightbox((s) => ({
                            ...s,
                            index:
                              (s.index - 1 + s.images.length) % s.images.length,
                          }));
                        }}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      <button
                        aria-label="Next"
                        onClick={() => {
                          setLightboxDir("right");
                          setLightbox((s) => ({
                            ...s,
                            index: (s.index + 1) % s.images.length,
                          }));
                        }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </>
                  )}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">
                  Không có ảnh.
                </div>
              )}
              <div className="text-center text-white text-xs">
                {lightbox.index + 1} / {lightbox.images.length}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
