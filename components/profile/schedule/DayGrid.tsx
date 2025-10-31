"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Booking } from "@/types/scheduleType";
import { addMinutes, fmtHM, toDateLocal } from "@/utils/scheduleUtils";
import { BookingBlock } from "./BookingBlock";

type WithPos = Booking & { _sMin: number; _eMin: number };
const minutesFromDayStart = (d: Date, startHour: number) =>
  (d.getHours() - startHour) * 60 + d.getMinutes();

function groupOverlaps(items: WithPos[]): WithPos[][] {
  const groups: WithPos[][] = [];
  let cur: WithPos[] = [];
  let curEnd = -Infinity;

  items.forEach((it) => {
    if (!cur.length) {
      cur = [it];
      curEnd = it._eMin;
      groups.push(cur);
    } else if (it._sMin < curEnd) {
      cur.push(it);
      curEnd = Math.max(curEnd, it._eMin);
    } else {
      cur = [it];
      curEnd = it._eMin;
      groups.push(cur);
    }
  });
  return groups;
}

type Props = {
  dayStartHour: number;
  slots: string[];
  rowHeight: number;
  bookings: Booking[];
  dayDate: Date;
};

export const DayGrid: React.FC<Props> = ({
  slots,
  rowHeight,
  bookings,
  dayDate,
  dayStartHour,
}) => {
  // lọc & tính vị trí theo ngày
  const dayBookings = React.useMemo<WithPos[]>(() => {
    const arr: WithPos[] = [];
    bookings.forEach((b) => {
      const s = toDateLocal(b.start);
      if (
        s.getFullYear() === dayDate.getFullYear() &&
        s.getMonth() === dayDate.getMonth() &&
        s.getDate() === dayDate.getDate()
      ) {
        const sm = minutesFromDayStart(s, dayStartHour);
        arr.push({ ...b, _sMin: sm, _eMin: sm + b.durationMinutes });
      }
    });
    arr.sort((a, b) =>
      a._sMin === b._sMin ? a._eMin - b._eMin : a._sMin - b._sMin
    );
    return arr;
  }, [bookings, dayDate, dayStartHour]);

  const groups = React.useMemo(() => groupOverlaps(dayBookings), [dayBookings]);

  type GroupState = { open: boolean; activeId?: Booking["id"] };
  const [groupState, setGroupState] = React.useState<
    Record<number, GroupState>
  >({});

  React.useEffect(() => {
    setGroupState((prev) => {
      const next = { ...prev };
      groups.forEach((g, idx) => {
        if (!next[idx]) next[idx] = { open: false, activeId: g[0]?.id };
      });
      return next;
    });
  }, [groups]);

  // text thời gian
  const renderTimeText = (bk: Booking) => {
    const isSlot = !!bk.meta?.slotStart && !!bk.meta?.slotEnd;
    const displayDate = toDateLocal(bk.meta?.bookingDate ?? bk.start);
    if (isSlot) {
      const s = toDateLocal(bk.meta!.slotStart as string);
      const e = toDateLocal(bk.meta!.slotEnd as string);
      if (s && e) return `${fmtHM(s)}–${fmtHM(e)}`;
    }
    const e = addMinutes(displayDate, bk.durationMinutes);
    return `${fmtHM(displayDate)}–${fmtHM(e)}`;
  };

  return (
    <div
      className="relative border-l border-gray-200"
      style={{ height: (slots.length - 1) * rowHeight }}
    >
      {slots.map((_, i) => (
        <div
          key={i}
          className="absolute w-full border-t border-gray-100"
          style={{ top: `${i * rowHeight}px` }}
        />
      ))}

      {groups.map((g, gi) => {
        if (g.length === 1) {
          const b = g[0];
          const petName = (b.meta?.pet as string) ?? "Pet";
          return (
            <BookingBlock
              key={`${gi}-${b.id}`}
              start={b.start}
              durationMinutes={b.durationMinutes}
              dayStartHour={dayStartHour}
              rowHeight={rowHeight}
              colorClass={b.colorClass ?? "bg-teal-50 border-teal-400"}
              allowOverflow={true}
            >
              <div className="text-xs font-poppins-medium text-gray-900 leading-tight">
                {b.type}
              </div>
              <div className="text-[11px] text-gray-600 line-clamp-2">
                {petName} <br /> {renderTimeText(b)}
              </div>
              {b.meta?.items && (
                <div className="text-[11px] text-gray-600">
                  ({b.meta.items} items)
                </div>
              )}
            </BookingBlock>
          );
        }

        // nhóm overlap có nhiều booking
        const state = groupState[gi] ?? { open: false, activeId: g[0]?.id };
        const active = g.find((x) => x.id === state.activeId) ?? g[0];
        const petName = (active.meta?.pet as string) ?? "Pet";
        const t = renderTimeText(active);
        const more = g.length - 1;

        return (
          <React.Fragment key={`grp-${gi}`}>
            <BookingBlock
              start={active.start}
              durationMinutes={active.durationMinutes}
              dayStartHour={dayStartHour}
              rowHeight={rowHeight}
              colorClass={active.colorClass ?? "bg-teal-50 border-teal-400"}
              allowOverflow={true}
            >
              <div className="relative pt-4">
                <div className="min-w-0">
                  <div className="text-xs font-poppins-medium text-gray-900 leading-tight">
                    {active.type}
                  </div>
                  <div className="text-[11px] text-gray-600">
                    {petName} <br /> {t}
                  </div>
                </div>

                <Popover
                  open={state.open}
                  onOpenChange={(v) =>
                    setGroupState((s) => ({
                      ...s,
                      [gi]: { ...state, open: v },
                    }))
                  }
                >
                  <PopoverTrigger asChild>
                    <button
                      className="absolute top-0 right-1 z-10 -translate-y-1/2 translate-x-1/2 rounded-full h-6 px-2 py-1 text-[12px] bg-primary text-primary-foreground backdrop-blur-sm ring-1 ring-black/5 hover:bg-primary/80 transition-colors"
                      title={`Xem ${more} booking khác`}
                    >
                      +{more}
                    </button>
                  </PopoverTrigger>

                  <PopoverContent className="w-80 p-2 bg-white/50 backdrop-blur overflow-x-hidden">
                    <div className="text-sm font-poppins-regular text-black text-center px-1 pb-1">
                      Có {g.length} bookings trùng giờ
                    </div>
                    <div className="max-h-56 overflow-y-auto overflow-x-hidden thin-scroll pe-1">
                      {g.map((item) => {
                        const tt = renderTimeText(item);
                        const petN = (item.meta?.pet as string) ?? "Pet";
                        const isActive = item.id === state.activeId;
                        return (
                          <button
                            key={String(item.id)}
                            onClick={() =>
                              setGroupState((s) => ({
                                ...s,
                                [gi]: { open: false, activeId: item.id },
                              }))
                            }
                            className={cn(
                              "w-full text-left rounded-md px-2 py-2 mb-1 text-xs hover:bg-primary/10 transition-all duration-200 hover:translate-x-1",
                              isActive && "text-primary font-poppins-medium"
                            )}
                          >
                            <div className="text-sm font-poppins-medium truncate">
                              {item.type}
                            </div>
                            <div className="text-xs font-poppins-regular text-black">
                              {petN} • {tt}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </BookingBlock>

            {g.slice(1, 4).map((b, i) => (
              <div
                key={`ghost-${gi}-${b.id}`}
                className="absolute rounded-lg border border-dashed border-gray-300 pointer-events-none"
                style={{
                  top: (b._sMin / 60) * rowHeight,
                  height: ((b._eMin - b._sMin) / 60) * rowHeight,
                  left: 4 + (i + 1) * 8,
                  right: 4,
                  opacity: 0.2,
                }}
              />
            ))}
          </React.Fragment>
        );
      })}
    </div>
  );
};
