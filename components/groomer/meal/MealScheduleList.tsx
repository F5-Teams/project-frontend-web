import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, ChevronDown, ChevronUp } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { FeedingSchedule } from "@/services/groomer/meal/type";
import { BookingCard } from "./BookingCard";

interface MealScheduleListProps {
  schedules: FeedingSchedule[];
  groupedByBooking: Map<number, FeedingSchedule[]>;
  expandedBookingIds: Set<number>;
  onToggleBooking: (bookingId: number) => void;
  onExpandAll: () => void;
  onCollapseAll: () => void;
  onMarkAsFed: (scheduleId: number, quantity: string, notes?: string) => void;
  isMarking: boolean;
  isLoading: boolean;
  selectedDate: string;
}

export function MealScheduleList({
  schedules,
  groupedByBooking,
  expandedBookingIds,
  onToggleBooking,
  onExpandAll,
  onCollapseAll,
  onMarkAsFed,
  isMarking,
  isLoading,
  selectedDate,
}: MealScheduleListProps) {
  return (
    <div>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            Lịch cho ăn ({schedules.length} bữa ăn - {groupedByBooking.size}{" "}
            booking)
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onExpandAll}
              disabled={expandedBookingIds.size === groupedByBooking.size}
            >
              <ChevronDown className="w-4 h-4 mr-1" />
              Mở tất cả
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onCollapseAll}
              disabled={expandedBookingIds.size === 0}
            >
              <ChevronUp className="w-4 h-4 mr-1" />
              Thu gọn
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8 font-poppins-regular text-gray-500">
            Đang tải dữ liệu...
          </div>
        ) : groupedByBooking.size === 0 ? (
          <div className="text-center font-poppins-light py-8 text-gray-500">
            Không có lịch cho ăn nào trong ngày{" "}
            {format(new Date(selectedDate), "dd/MM/yyyy", { locale: vi })}
          </div>
        ) : (
          <div className="space-y-1">
            {Array.from(groupedByBooking.entries()).map(
              ([bookingId, bookingSchedules]) => (
                <BookingCard
                  key={bookingId}
                  bookingId={bookingId}
                  schedules={bookingSchedules}
                  isExpanded={expandedBookingIds.has(bookingId)}
                  onToggle={() => onToggleBooking(bookingId)}
                  onMarkAsFed={onMarkAsFed}
                  isMarking={isMarking}
                />
              )
            )}
          </div>
        )}
      </CardContent>
    </div>
  );
}
