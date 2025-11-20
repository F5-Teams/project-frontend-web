"use client";

import { useState, useMemo } from "react";
import { toast } from "sonner";
import {
  useGetPendingFeedingSchedules,
  useMarkFeedingScheduleAsFed,
} from "@/services/groomer/meal/hooks";
import { useGetUser } from "@/services/users/hooks";
import { format } from "date-fns";
import {
  MealManagementHeader,
  MealScheduleList,
} from "@/components/groomer/meal";

export default function MealManagementPage() {
  const [date, setDate] = useState<Date>(new Date());
  const [expandedBookingIds, setExpandedBookingIds] = useState<Set<number>>(
    new Set()
  );

  const selectedDate = format(date, "yyyy-MM-dd");

  const { data: user } = useGetUser();
  const { data: schedules, isLoading } = useGetPendingFeedingSchedules({
    date: selectedDate,
  });
  const { mutateAsync: markAsFed, isPending: isMarking } =
    useMarkFeedingScheduleAsFed();

  const filteredSchedules = useMemo(() => {
    if (!schedules) return [];
    return schedules;
  }, [schedules]);

  const groupedByBooking = useMemo(() => {
    const groups = new Map<number, typeof filteredSchedules>();
    filteredSchedules.forEach((schedule) => {
      const bookingId = schedule.bookingId;
      if (!groups.has(bookingId)) {
        groups.set(bookingId, []);
      }
      groups.get(bookingId)!.push(schedule);
    });
    return groups;
  }, [filteredSchedules]);

  const toggleBooking = (bookingId: number) => {
    setExpandedBookingIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(bookingId)) {
        newSet.delete(bookingId);
      } else {
        newSet.add(bookingId);
      }
      return newSet;
    });
  };

  const expandAll = () => {
    setExpandedBookingIds(new Set(Array.from(groupedByBooking.keys())));
  };

  const collapseAll = () => {
    setExpandedBookingIds(new Set());
  };

  const handleMarkAsFed = async (
    scheduleId: number,
    quantity: string,
    notes?: string
  ) => {
    if (!user?.id) {
      return;
    }

    try {
      await markAsFed({
        id: scheduleId,
        groomerId: user.id,
        quantity,
        notes,
      });

      toast.success("Đã đánh dấu hoàn thành cho ăn");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <MealManagementHeader date={date} onDateChange={setDate} />

      <div className="grid gap-4">
        <MealScheduleList
          schedules={filteredSchedules}
          groupedByBooking={groupedByBooking}
          expandedBookingIds={expandedBookingIds}
          onToggleBooking={toggleBooking}
          onExpandAll={expandAll}
          onCollapseAll={collapseAll}
          onMarkAsFed={handleMarkAsFed}
          isMarking={isMarking}
          isLoading={isLoading}
          selectedDate={selectedDate}
        />
      </div>
    </div>
  );
}
