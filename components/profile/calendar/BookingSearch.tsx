"use client";

import React from "react";
import { useFilteredBookings } from "@/services/profile/profile-schedule/hooks";
import { WeeklyGrid } from "./WeeklyGrid";
import type { ApiFilteredBooking } from "@/services/profile/profile-schedule/types";
import type { CalendarBooking } from "@/types/calendarType";
import { mapApiToCalendar } from "./mapApiToCalendar";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { formatDMY } from "@/utils/date";

function mapFilteredToCalendar(list: ApiFilteredBooking[]): CalendarBooking[] {
  return list.map((b) => mapApiToCalendar(b));
}

function startOfWeekLocal(d: Date) {
  const day = (d.getDay() + 6) % 7;
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() - day);
}

function formatDateLocal(d: Date) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export function BookingSearch(props: {
  selectedId?: string | number | undefined;
  onSelect?: (b: CalendarBooking) => void;
  tzLabel?: string;
  defaultData?: CalendarBooking[];
}) {
  const { selectedId, onSelect, tzLabel, defaultData } = props;

  const [fromDate, setFromDate] = React.useState<string>("");
  const [toDate, setToDate] = React.useState<string>("");
  const [fromOpen, setFromOpen] = React.useState(false);
  const [toOpen, setToOpen] = React.useState(false);
  const [type, setType] = React.useState<string | undefined>(undefined);

  // memoized Date object for the "from" date (used to disable earlier days in "to" calendar)
  const fromDateObj = React.useMemo(
    () => (fromDate ? new Date(fromDate) : undefined),
    [fromDate]
  );

  // if user changes `fromDate` to after the currently selected `toDate`, clear toDate
  React.useEffect(() => {
    if (!fromDateObj || !toDate) return;
    const td = new Date(toDate);
    if (td.getTime() < fromDateObj.getTime()) setToDate("");
  }, [fromDateObj, toDate]);

  const [queryParams, setQueryParams] = React.useState<{
    fromDate: string;
    toDate: string;
    type?: string;
  } | null>(null);

  const resultQuery = useFilteredBookings(
    queryParams ?? { fromDate: "", toDate: "", type: undefined }
  );

  const apiList = resultQuery.data ?? [];
  const mappedApiList = React.useMemo(
    () => mapFilteredToCalendar(apiList),
    [apiList]
  );

  const displayList = React.useMemo<CalendarBooking[]>(
    () => (queryParams ? mappedApiList : defaultData ?? mappedApiList),
    [queryParams, defaultData, mappedApiList]
  );

  const parseDate = React.useCallback((v: unknown): Date | null => {
    if (!v) return null;
    const d = new Date(String(v));
    return isNaN(d.getTime()) ? null : d;
  }, []);

  const earliestSearchStart = React.useMemo(() => {
    if (!queryParams || mappedApiList.length === 0) return null;
    let earliest: Date | null = null;
    for (const b of mappedApiList) {
      const bookingDateField = (b as unknown as Record<string, unknown>)[
        "bookingDate"
      ];
      const s =
        parseDate(b.meta?.startDate ?? b.startDate ?? bookingDateField) ?? null;
      if (!s) continue;
      if (!earliest || s.getTime() < earliest.getTime()) earliest = s;
    }
    return earliest;
  }, [queryParams, mappedApiList, parseDate]);

  React.useEffect(() => {
    if (!queryParams) return;
    if (mappedApiList.length === 0) return;
    if (!earliestSearchStart) {
      onSelect?.(mappedApiList[0]);
      return;
    }
    const match =
      mappedApiList.find((b) => {
        const bookingDateField = (b as unknown as Record<string, unknown>)[
          "bookingDate"
        ];
        const s = parseDate(
          b.meta?.startDate ?? b.startDate ?? bookingDateField
        );
        return !!s && s.getTime() === earliestSearchStart.getTime();
      }) ?? mappedApiList[0];
    onSelect?.(match);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryParams, mappedApiList, earliestSearchStart]);

  const weekAnchor = React.useMemo<Date | undefined>(() => {
    if (!earliestSearchStart) return undefined;
    return startOfWeekLocal(earliestSearchStart);
  }, [earliestSearchStart]);

  const handleClear = React.useCallback(() => {
    setFromDate("");
    setToDate("");
    setType(undefined);
    setQueryParams(null);
  }, []);

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!fromDate || !toDate) return;
          setQueryParams({ fromDate, toDate, type: type || undefined });
        }}
        className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end mb-4"
      >
        <div className="sm:col-span-1">
          <label className="font-poppins-light text-xs text-gray-600 block px-2 mb-1">
            Từ ngày
          </label>

          <div className="relative">
            {/* shadcn popover + calendar for single date */}
            <Popover open={fromOpen} onOpenChange={setFromOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-between text-sm py-2 rounded-2xl border-gray-200 bg-white"
                >
                  <span className="font-poppins-light text-left">
                    {fromDate ? formatDMY(new Date(fromDate)) : "Chọn ngày"}
                  </span>
                  <CalendarIcon className="w-4 h-4 text-gray-400" aria-hidden />
                </Button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-auto p-2">
                <Calendar
                  mode="single"
                  selected={fromDate ? new Date(fromDate) : undefined}
                  onSelect={(d) => {
                    if (!d) return;
                    const ds =
                      d instanceof Date
                        ? d
                        : Array.isArray(d)
                        ? d[0]
                        : undefined;
                    setFromDate(ds ? formatDateLocal(ds) : "");
                    setFromOpen(false);
                  }}
                />
                <div className="font-poppins-light flex gap-2 justify-end mt-2">
                  {fromDate && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setFromDate("")}
                    >
                      Xóa
                    </Button>
                  )}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="sm:col-span-1">
          <label className="font-poppins-light text-xs text-gray-600 block px-2 mb-1">
            Đến ngày
          </label>

          <div className="relative">
            <Popover open={toOpen} onOpenChange={setToOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full font-poppins-light justify-between text-sm py-2 rounded-2xl border-gray-200 bg-white"
                >
                  <span className="text-left font-poppins-light">
                    {toDate ? formatDMY(new Date(toDate)) : "Chọn ngày"}
                  </span>
                  <CalendarIcon className="w-4 h-4 text-gray-400" aria-hidden />
                </Button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-auto p-2">
                <Calendar
                  mode="single"
                  selected={toDate ? new Date(toDate) : undefined}
                  // disable days before the selected "from" date
                  disabled={fromDateObj ? { before: fromDateObj } : undefined}
                  onSelect={(d) => {
                    if (!d) return;
                    const ds =
                      d instanceof Date
                        ? d
                        : Array.isArray(d)
                        ? d[0]
                        : undefined;
                    setToDate(ds ? formatDateLocal(ds) : "");
                    setToOpen(false);
                  }}
                />
                <div className="flex gap-2 justify-end mt-2">
                  {toDate && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setToDate("")}
                    >
                      Xóa
                    </Button>
                  )}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="sm:col-span-1">
          <label className="font-poppins-light text-xs text-gray-600 block px-2 mb-1">
            Loại
          </label>
          <Select
            value={type ?? "ALL"}
            onValueChange={(val) => setType(val === "ALL" ? undefined : val)}
          >
            <SelectTrigger className="w-full font-poppins-light rounded-2xl border border-gray-200 bg-white text-sm">
              <SelectValue placeholder="Tất cả" />
            </SelectTrigger>
            <SelectContent className="text-xs">
              <SelectItem value="ALL">Tất cả</SelectItem>
              <SelectItem value="SPA">Dịch vụ spa</SelectItem>
              <SelectItem value="HOTEL">Khách sạn thú cưng</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="sm:col-span-1 flex gap-2">
          <button
            type="submit"
            className="btn btn-primary font-poppins-light w-full bg-primary hover:bg-primary/50 text-white rounded-2xl py-2"
            disabled={!fromDate || !toDate}
          >
            Tìm
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="btn w-24 font-poppins-light text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-2xl"
          >
            Xóa
          </button>
        </div>
      </form>

      {resultQuery.isLoading ? (
        <div className="p-4 text-sm text-gray-600">Đang tìm…</div>
      ) : resultQuery.isError ? (
        <div className="p-4 text-sm text-red-600">Lỗi khi tìm.</div>
      ) : mappedApiList.length === 0 && queryParams ? (
        <div className="p-6 text-center text-sm text-gray-500">
          Không tìm thấy booking nào cho khoảng thời gian này.
        </div>
      ) : (
        <>
          <div className="px-2 font-poppins-light text-end mb-3 text-xs text-gray-600">
            Sen có {displayList.length} booking
          </div>
          <WeeklyGrid
            data={displayList}
            weekAnchor={weekAnchor}
            selectedId={selectedId}
            onSelect={(b) => onSelect?.(b)}
            tzLabel={tzLabel}
          />
        </>
      )}
    </div>
  );
}
