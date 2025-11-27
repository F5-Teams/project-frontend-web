"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { cancelBooking } from "@/services/profile/profile-schedule/api";
import { BOOKING_DETAIL_QUERY_KEY } from "@/services/profile/profile-schedule/hooks";

type CancelBookingDialogProps = {
  bookingId: number;
};

export default function CancelBookingDialog({
  bookingId,
}: CancelBookingDialogProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);
  const [note, setNote] = useState("");

  const cancelMutation = useMutation({
    mutationFn: (payload: { id: number; note: string }) =>
      cancelBooking(payload.id, payload.note),
    onSuccess: async () => {
      toast.success("Huỷ đặt lịch thành công");
      setOpen(false);
      setNote("");
      await queryClient.invalidateQueries({
        queryKey: [...BOOKING_DETAIL_QUERY_KEY, bookingId],
      });

      try {
        router.refresh();
      } catch (err) {
        // ignore refresh issues
      }
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        "Không thể huỷ đặt lịch, vui lòng thử lại.";
      toast.error(message);
    },
  });

  const handleSubmit = () => {
    cancelMutation.mutate({
      id: bookingId,
      note: note.trim() || "Khách hàng yêu cầu huỷ đặt lịch.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="destructive"
          className="w-full mb-2 bg-red-500 text-white hover:bg-red-600"
          disabled={cancelMutation.isPending}
        >
          Huỷ đặt lịch
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>Xác nhận huỷ đặt lịch</DialogTitle>
          <DialogDescription>
            Vui lòng xác nhận lý do huỷ để chúng tôi hỗ trợ bạn tốt hơn.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <div className="text-sm text-gray-600">
            Mã booking: <span className="font-semibold">{bookingId}</span>
          </div>
          <Textarea
            placeholder="Lý do huỷ (không bắt buộc)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={4}
          />
        </div>

        <DialogFooter className="gap-2 sm:gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={cancelMutation.isPending}
          >
            Đóng
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleSubmit}
            disabled={cancelMutation.isPending}
            className="bg-red-500 text-white hover:bg-red-600"
          >
            {cancelMutation.isPending ? "Đang huỷ..." : "Xác nhận huỷ"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
