/**
 * Utility functions for time slot management
 */

export interface TimeSlot {
  value: string;
  label: string;
  period: "MORNING" | "AFTERNOON" | "EVENING";
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
}

/**
 * Tạo danh sách time slots cố định theo yêu cầu:
 * - Sáng: 7h - 11h30
 * - Trưa: 12h30 - 16h30
 * - Chiều: 17h - 19h
 */
export const generateTimeSlots = (): TimeSlot[] => {
  return [
    {
      value: "MORNING",
      label: "Sáng (7:00 - 11:30)",
      period: "MORNING",
      startHour: 7,
      startMinute: 0,
      endHour: 11,
      endMinute: 30,
    },
    {
      value: "AFTERNOON",
      label: "Trưa (12:30 - 16:30)",
      period: "AFTERNOON",
      startHour: 12,
      startMinute: 30,
      endHour: 16,
      endMinute: 30,
    },
    {
      value: "EVENING",
      label: "Chiều (17:00 - 19:00)",
      period: "EVENING",
      startHour: 17,
      startMinute: 0,
      endHour: 19,
      endMinute: 0,
    },
  ];
};

/**
 * Kiểm tra xem time slot đã qua giờ chưa
 * @param slot - Time slot cần kiểm tra
 * @param selectedDate - Ngày được chọn
 * @returns true nếu khung giờ đã qua, false nếu còn khả dụng
 */
export const isTimeSlotPassed = (
  slot: TimeSlot,
  selectedDate?: Date
): boolean => {
  if (!selectedDate) return false;

  const now = new Date();
  const selected = new Date(selectedDate);

  // Reset time to compare only dates
  const todayDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const selectedDateOnly = new Date(
    selected.getFullYear(),
    selected.getMonth(),
    selected.getDate()
  );

  // If selected date is in the future, all slots are available
  if (selectedDateOnly > todayDate) {
    return false;
  }

  // If selected date is in the past, all slots are passed
  if (selectedDateOnly < todayDate) {
    return true;
  }

  // If selected date is today, check if the time slot has passed
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentTimeInMinutes = currentHour * 60 + currentMinute;
  const slotEndTimeInMinutes = slot.endHour * 60 + slot.endMinute;

  // Time slot is passed if current time is past the end time of the slot
  return currentTimeInMinutes >= slotEndTimeInMinutes;
};

/**
 * Lấy time slots theo period
 */
export const getTimeSlotsByPeriod = (
  period: "MORNING" | "AFTERNOON" | "EVENING"
): TimeSlot[] => {
  return generateTimeSlots().filter((slot) => slot.period === period);
};

/**
 * Chuyển đổi time thành period (không cần thiết nữa vì value đã là period)
 */
export const getTimePeriod = (
  time: string
): "MORNING" | "AFTERNOON" | "EVENING" => {
  // Vì value giờ đã là period (MORNING/AFTERNOON/EVENING)
  return time as "MORNING" | "AFTERNOON" | "EVENING";
};

/**
 * Format time để hiển thị
 */
export const formatTimeDisplay = (time: string): string => {
  const [hours, minutes] = time.split(":");
  const hour = parseInt(hours);
  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;

  return `${displayHour}:${minutes} ${period}`;
};
