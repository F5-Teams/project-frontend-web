/**
 * Utility functions for time slot management
 */

export interface TimeSlot {
  value: string;
  label: string;
  period: "MORNING" | "AFTERNOON" | "EVENING";
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
    },
    {
      value: "AFTERNOON",
      label: "Trưa (12:30 - 16:30)",
      period: "AFTERNOON",
    },
    {
      value: "EVENING",
      label: "Chiều (17:00 - 19:00)",
      period: "EVENING",
    },
  ];
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
