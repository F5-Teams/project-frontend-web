import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  loading?: boolean;
  showInfo?: boolean;
}

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  loading = false,
  showInfo = true,
}: PaginationProps) {
  const handlePrev = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (page: number) => {
    onPageChange(page);
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage > 3) {
        pages.push("...");
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push("...");
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
      {/* Info */}
      {showInfo && (
        <div className="text-sm text-gray-600">
          Hiển thị{" "}
          <span className="font-semibold text-gray-800">
            {startItem} - {endItem}
          </span>{" "}
          trong tổng số{" "}
          <span className="font-semibold text-gray-800">{totalItems}</span> kết
          quả
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex items-center gap-2">
        {/* Previous Button */}
        <button
          onClick={handlePrev}
          disabled={currentPage === 1 || loading}
          className="p-2 rounded-lg border border-gray-300 hover:bg-pink-50 
                     disabled:opacity-50 disabled:cursor-not-allowed transition"
          aria-label="Previous page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1">
          {getPageNumbers().map((page, index) => {
            if (page === "...") {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="px-3 py-2 text-gray-400"
                >
                  ...
                </span>
              );
            }

            const isActive = page === currentPage;
            return (
              <button
                key={page}
                onClick={() => handlePageClick(page as number)}
                disabled={loading}
                className={`min-w-[40px] px-3 py-2 rounded-lg text-sm font-medium transition
                  ${
                    isActive
                      ? "bg-pink-500 text-white shadow-sm"
                      : "text-gray-700 hover:bg-gray-100 border border-gray-300"
                  }
                  disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {page}
              </button>
            );
          })}
        </div>

        {/* Next Button */}
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages || loading}
          className="p-2 rounded-lg border border-gray-300 hover:bg-pink-50 
                     disabled:opacity-50 disabled:cursor-not-allowed transition"
          aria-label="Next page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
