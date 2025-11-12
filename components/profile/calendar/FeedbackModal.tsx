"use client";

import React from "react";
import { X, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCreateBookingFeedback } from "@/services/profile/feedback/hooks";
import { toast } from "sonner";
import {
  modalBackdropVariants,
  modalCardVariants,
  ratingStarHover,
  ratingStarTap,
} from "@/components/profile/calendar/anim-utils";

type Props = {
  open: boolean;
  bookingId: number | null;
  onClose: () => void;
  onSubmitted?: () => void;
};

export default function FeedbackModal({
  open,
  bookingId,
  onClose,
  onSubmitted,
}: Props) {
  const [rating, setRating] = React.useState<number>(0);
  const [hover, setHover] = React.useState<number>(0);
  const [comment, setComment] = React.useState<string>("");

  const mutation = useCreateBookingFeedback();

  React.useEffect(() => {
    if (!open) {
      setRating(0);
      setHover(0);
      setComment("");
    }
  }, [open]);

  const effective = hover || rating;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!bookingId) return;
    if (rating < 1 || rating > 5) {
      toast.error("Vui lòng chọn số sao (1-5)");
      return;
    }
    try {
      await mutation.mutateAsync({ bookingId, payload: { rating, comment } });
      toast.success("Đã gửi đánh giá");
      onSubmitted?.();
      onClose();
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <motion.div
            className="absolute inset-0 bg-black/40"
            onClick={onClose}
            variants={modalBackdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          />
          <motion.div
            className="relative bg-white w-full max-w-md rounded-2xl shadow-lg border border-slate-200 p-4"
            variants={modalCardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="font-poppins-regular text-lg">
                Đánh giá dịch vụ
              </div>
              <button
                onClick={onClose}
                aria-label="Đóng"
                className="text-slate-500 hover:text-slate-700"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <div className="text-[16px] font-poppins-regular justify-between text-center text-black mb-2">
                  Chọn số sao
                </div>
                <div className="flex items-center justify-between px-10">
                  {Array.from({ length: 5 }).map((_, i) => {
                    const idx = i + 1;
                    const active = idx <= effective;
                    return (
                      <motion.button
                        key={idx}
                        type="button"
                        className="p-1"
                        onMouseEnter={() => setHover(idx)}
                        onMouseLeave={() => setHover(0)}
                        onClick={() => setRating(idx)}
                        aria-label={`${idx} sao`}
                        whileHover={ratingStarHover}
                        whileTap={ratingStarTap}
                      >
                        <Star
                          size={26}
                          className={
                            active
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-slate-300"
                          }
                        />
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              <div>
                <div className="text-[16px] text-center font-poppins-regular mb-2">
                  Nhận xét
                </div>
                <textarea
                  className="w-full min-h-[100px] text-sm rounded-lg font-poppins-light border border-slate-200 p-2 outline-none focus:ring-2 focus:ring-primary/30"
                  placeholder="Viết cảm nhận của bạn ..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3 py-2 rounded-lg border hover:bg-slate-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={
                    !bookingId || rating < 1 || mutation.status === "pending"
                  }
                  className="px-3 py-2 font-poppins-light rounded-lg bg-primary text-white disabled:opacity-60"
                >
                  {mutation.status === "pending"
                    ? "Đang gửi..."
                    : "Gửi đánh giá"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
