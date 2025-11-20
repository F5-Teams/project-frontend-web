import { useQuery } from "@tanstack/react-query";
import { getFeedingLogsByBooking } from "./api";

export const useGetFeedingLogsByBooking = (bookingId: number) => {
  return useQuery({
    queryKey: ["feedingLogs", bookingId],
    queryFn: () => getFeedingLogsByBooking(bookingId),
    enabled: !!bookingId && bookingId > 0,
  });
};
