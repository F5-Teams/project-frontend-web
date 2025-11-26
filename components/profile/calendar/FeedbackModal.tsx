"use client";

import React from "react";

import { Star } from "lucide-react";
import { motion } from "framer-motion";
import { useCreateBookingFeedback } from "@/services/profile/feedback/hooks";
import { toast } from "sonner";
import {
  ratingStarHover,
  ratingStarTap,
} from "@/components/profile/calendar/anim-utils";

type Props = {
  bookingId: number | null;
  onSubmitted?: () => void;
};

export default function FeedbackForm({ bookingId, onSubmitted }: Props) {
  const [rating, setRating] = React.useState<number>(0);
  const [hover, setHover] = React.useState<number>(0);
  const [comment, setComment] = React.useState<string>("");

  const mutation = useCreateBookingFeedback();

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
      setRating(0);
      setComment("");
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 py-4 px-6">
      <h3 className="text-lg font-poppins-regular text-gray-900 mb-2">
        Đánh giá dịch vụ
      </h3>

      <form onSubmit={handleSubmit} className="space-y-2">
        <div>
          <div className="text-sm font-poppins-light text-gray-600 mb-2">
            Chọn số sao
          </div>
          <div className="flex items-center gap-2">
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
                    size={24}
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
          <div className="text-sm font-poppins-light text-gray-600 mb-2">
            Nhận xét
          </div>
          <textarea
            className="w-full min-h-[100px] text-sm rounded-lg font-poppins-light border border-slate-200 p-3 outline-none focus:ring-2 focus:ring-primary/30"
            placeholder="Viết cảm nhận của bạn ..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>

        <div className="flex items-center justify-end gap-2">
          <button
            type="submit"
            disabled={!bookingId || rating < 1 || mutation.status === "pending"}
            className="px-4 py-2 text-sm font-poppins-light rounded-lg bg-primary text-white disabled:opacity-60 hover:bg-primary/90 transition-colors"
          >
            {mutation.status === "pending" ? "Đang gửi..." : "Gửi đánh giá"}
          </button>
        </div>
      </form>
    </div>
  );
}
