import { ApiBooking } from "@/services/profile/profile-schedule/types";
import { Booking } from "@/types/scheduleType";

const toDate = (iso: string) => new Date(iso);
const startOfDay = (d: Date) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
const endOfDay = (d: Date) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
const addDays = (d: Date, n: number) =>
  new Date(
    d.getFullYear(),
    d.getMonth(),
    d.getDate() + n,
    d.getHours(),
    d.getMinutes(),
    d.getSeconds(),
    d.getMilliseconds()
  );

/** cắt 1 khoảng thời gian thành các đoạn theo từng ngày, rồi clamp theo khung giờ lưới */
function splitMultiDay(
  start: Date,
  end: Date,
  dayStartHour: number,
  dayEndHour: number
): Array<{ start: Date; end: Date }> {
  const parts: Array<{ start: Date; end: Date }> = [];
  if (end <= start) return parts;

  let cur = new Date(start);
  while (cur < end) {
    const dayStart = new Date(
      cur.getFullYear(),
      cur.getMonth(),
      cur.getDate(),
      dayStartHour,
      0,
      0,
      0
    );
    const dayEnd = new Date(
      cur.getFullYear(),
      cur.getMonth(),
      cur.getDate(),
      dayEndHour,
      0,
      0,
      0
    );

    // đoạn thuộc ngày này (không clamp):
    const rawStart = cur;
    const rawEnd = new Date(Math.min(end.getTime(), endOfDay(cur).getTime()));

    // clamp theo lưới
    const segStart = new Date(Math.max(rawStart.getTime(), dayStart.getTime()));
    const segEnd = new Date(Math.min(rawEnd.getTime(), dayEnd.getTime()));
    if (segEnd > segStart) parts.push({ start: segStart, end: segEnd });

    // sang ngày tiếp theo (00:00 của ngày sau hoặc end)
    const nextDay = startOfDay(addDays(cur, 1));
    cur = nextDay;
  }
  return parts;
}

/** Map màu/nhãn nhanh */
function colorFor(b: ApiBooking): string {
  if (b.slot) return "bg-yellow-50 border-yellow-400"; // Lưu trú/phòng
  if (b.combo) return "bg-teal-50 border-teal-400"; // Dịch vụ/combo
  return "bg-blue-50 border-blue-400"; // Mặc định
}

function typeFor(b: ApiBooking): string {
  if (b.slot) return b.Room?.name ? `Room • ${b.Room.name}` : "Room";
  if (b.combo) return b.combo.name || "Service";
  return "Booking";
}

/** API -> Booking[] (phục vụ WeeklySchedule) */
export function mapApiToBookings(
  data: ApiBooking[],
  opts?: {
    defaultDuration?: number;
    dayStartHour?: number;
    dayEndHour?: number;
  }
): Booking[] {
  const defaultDuration = opts?.defaultDuration ?? 60;
  const dayStartHour = opts?.dayStartHour ?? 7;
  const dayEndHour = opts?.dayEndHour ?? 18;

  const out: Booking[] = [];

  for (const b of data) {
    // luôn lưu bookingDate vào meta.bookingDate để dùng cho nhãn hiển thị
    const bookingDateIso = b.bookingDate;

    // 1) Lịch dịch vụ 1 buổi -> b.bookingDate + duration (từ combo.duration hoặc default)
    if (b.bookingDate && !b.slot) {
      const start = toDate(b.bookingDate);
      const durationMinutes = b.combo?.duration ?? defaultDuration;
      out.push({
        id: `B-${b.id}-book`,
        type: typeFor(b),
        start,
        durationMinutes,
        colorClass: colorFor(b),
        meta: {
          bookingDate: bookingDateIso,
          status: b.status,
          pet: b.pet?.name ?? null,
          price: b.comboPrice || b.servicePrice || null,
        },
      });
    }

    // 2) Slot (lưu trú/phòng) -> tạo segment để render trên grid nhưng nhãn vẫn dùng bookingDate
    if (b.slot?.startDate && b.slot?.endDate) {
      const slotStart = toDate(b.slot.startDate);
      const slotEnd = toDate(b.slot.endDate);

      const segments = splitMultiDay(
        slotStart,
        slotEnd,
        dayStartHour,
        dayEndHour
      );
      segments.forEach((seg, idx) => {
        const durationMinutes = Math.round(
          (seg.end.getTime() - seg.start.getTime()) / 60000
        );
        out.push({
          id: `B-${b.id}-slot-${idx}`,
          type: typeFor(b),
          // position trên calendar theo segment (để hiển thị nhiều ngày)
          start: seg.start,
          durationMinutes,
          colorClass: colorFor(b),
          meta: {
            bookingDate: bookingDateIso,
            pet: b.pet?.name ?? null,
            room: b.Room?.name ?? null,
            stay: 1,
            slotStart: slotStart.toISOString(),
            slotEnd: slotEnd.toISOString(),
          },
        });
      });
    }
  }

  return out;
}
