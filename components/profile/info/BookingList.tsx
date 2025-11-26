"use client";

import { useMemo, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  getBookingTitle,
  getBookingStatusText,
  getBookingStatusColor,
} from "@/services/profile/profile-schedule/hooks";
import { Booking } from "@/services/profile/profile-schedule/types";
import { formatDateTime24 } from "@/utils/date";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface BookingListProps {
  bookings: Booking[];
  isLoading?: boolean;
}

export const BookingList: React.FC<BookingListProps> = ({
  bookings,
  isLoading = false,
}) => {
  const [typeFilter, setTypeFilter] = useState<"ALL" | "SPA" | "HOTEL">("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const filteredBookings = useMemo(() => {
    if (typeFilter === "ALL") return bookings;
    return bookings.filter((b) => b.type === typeFilter);
  }, [bookings, typeFilter]);

  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const paginatedBookings = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredBookings.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredBookings, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [typeFilter]);

  return (
    <div className="bg-white/40 backdrop-blur shadow-lg rounded-2xl p-4 md:p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg lg:text-xl font-poppins-medium text-gray-900">
          Lịch đặt của bạn
        </h2>
        <div className="flex gap-2">
          <Button
            variant={typeFilter === "ALL" ? "default" : "outline"}
            size="sm"
            onClick={() => setTypeFilter("ALL")}
            className="font-poppins-light"
          >
            Tất cả
          </Button>
          <Button
            variant={typeFilter === "SPA" ? "default" : "outline"}
            size="sm"
            onClick={() => setTypeFilter("SPA")}
            className="font-poppins-light"
          >
            Spa
          </Button>
          <Button
            variant={typeFilter === "HOTEL" ? "default" : "outline"}
            size="sm"
            onClick={() => setTypeFilter("HOTEL")}
            className="font-poppins-light"
          >
            Khách sạn
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-8 text-gray-500">Đang tải...</div>
      ) : filteredBookings.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Không có lịch đặt nào
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {paginatedBookings.map((booking) => (
              <div
                key={booking.id}
                className="border border-gray-200 rounded-2xl p-4 hover:shadow-md transition-shadow"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-1 rounded text-xs font-poppins-light text-white ${
                        booking.type === "HOTEL" ? "bg-primary" : "bg-secondary"
                      }`}
                    >
                      {booking.type}
                    </span>
                    <span className="text-sm font-poppins-medium text-gray-900">
                      {getBookingTitle(booking)}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm text-black">
                    <div className="space-y-1">
                      <div>
                        <span className="font-poppins-medium">Pet:</span>{" "}
                        <span className="font-poppins-light">
                          {booking.pet?.name || "N/A"}
                        </span>
                      </div>
                      <div>
                        <span className="font-poppins-medium">Mã booking:</span>{" "}
                        <span className="font-poppins-light">
                          {booking.bookingCode}
                        </span>
                      </div>
                      {booking.bookingDate && (
                        <div>
                          <span className="font-poppins-medium">Ngày đặt:</span>{" "}
                          <span className="font-poppins-light">
                            {formatDateTime24(booking.createdAt)}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-1">
                      {booking.slot?.startDate && booking.slot?.endDate && (
                        <div>
                          <span className="font-poppins-medium">
                            Thời gian:
                          </span>{" "}
                          <span className="font-poppins-light">
                            {formatDateTime24(booking.slot.startDate)} -{" "}
                            {formatDateTime24(booking.slot.endDate)}
                          </span>
                        </div>
                      )}
                      <div>
                        <span className="font-poppins-medium">Trạng thái:</span>{" "}
                        <span className={getBookingStatusColor(booking.status)}>
                          <span className="font-poppins-light">
                            {getBookingStatusText(booking.status)}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <Pagination className="mt-4">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className={
                      currentPage === 1
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => setCurrentPage(page)}
                        isActive={currentPage === page}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  )
                )}

                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    className={
                      currentPage === totalPages
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}
    </div>
  );
};
