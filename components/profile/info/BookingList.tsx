"use client";

import { useMemo, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { getBookingTitle } from "@/services/profile/profile-schedule/hooks";
import { Booking } from "@/services/profile/profile-schedule/types";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
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
    <div className="bg-white rounded-2xl p-4 md:p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg lg:text-xl font-poppins-medium text-gray-900">
          Lịch đặt của bạn
        </h2>
        <div className="flex gap-2">
          <Button
            variant={typeFilter === "ALL" ? "default" : "outline"}
            size="sm"
            onClick={() => setTypeFilter("ALL")}
          >
            Tất cả
          </Button>
          <Button
            variant={typeFilter === "SPA" ? "default" : "outline"}
            size="sm"
            onClick={() => setTypeFilter("SPA")}
          >
            SPA
          </Button>
          <Button
            variant={typeFilter === "HOTEL" ? "default" : "outline"}
            size="sm"
            onClick={() => setTypeFilter("HOTEL")}
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
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium text-white ${
                          booking.type === "HOTEL"
                            ? "bg-violet-500"
                            : "bg-teal-500"
                        }`}
                      >
                        {booking.type}
                      </span>
                      <span className="text-sm font-poppins-medium text-gray-900">
                        {getBookingTitle(booking)}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div>
                        <span className="font-medium">Pet:</span>{" "}
                        {booking.pet?.name || "N/A"}
                      </div>
                      <div>
                        <span className="font-medium">Mã booking:</span>{" "}
                        {booking.bookingCode}
                      </div>
                      {booking.slot?.startDate && booking.slot?.endDate && (
                        <div>
                          <span className="font-medium">Thời gian:</span>{" "}
                          {format(
                            new Date(booking.slot.startDate),
                            "dd/MM/yyyy HH:mm",
                            { locale: vi }
                          )}{" "}
                          -{" "}
                          {format(
                            new Date(booking.slot.endDate),
                            "dd/MM/yyyy HH:mm",
                            { locale: vi }
                          )}
                        </div>
                      )}
                      {booking.bookingDate && (
                        <div>
                          <span className="font-medium">Ngày:</span>{" "}
                          {format(new Date(booking.bookingDate), "dd/MM/yyyy", {
                            locale: vi,
                          })}
                        </div>
                      )}
                      <div>
                        <span className="font-medium">Trạng thái:</span>{" "}
                        <span
                          className={`${
                            booking.status === "COMPLETED"
                              ? "text-green-600"
                              : booking.status === "CANCELLED"
                              ? "text-red-600"
                              : "text-blue-600"
                          }`}
                        >
                          {booking.status}
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
