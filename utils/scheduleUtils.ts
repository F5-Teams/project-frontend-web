export function getBrowserTZ() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return "UTC";
  }
}

export function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
}

export function addDays(d: Date, n: number) {
  const c = new Date(d);
  c.setDate(c.getDate() + n);
  return c;
}

export function addMinutes(d: Date, n: number) {
  const c = new Date(d);
  c.setMinutes(c.getMinutes() + n);
  return c;
}

export function startOfWeek(date: Date) {
  const day = (date.getDay() + 6) % 7;
  return startOfDay(addDays(date, -day));
}

export function fmtHM(d: Date) {
  const hh = d.getHours().toString().padStart(2, "0");
  const mm = d.getMinutes().toString().padStart(2, "0");
  return `${hh}:${mm}`;
}

export const toDateLocal = (x: Date | string) =>
  x instanceof Date ? x : new Date(x);

export function buildTimeSlots(
  dayStartHour: number,
  dayEndHour: number,
  slotMinutes: number
) {
  const slots: string[] = [];
  let cur = new Date(2000, 0, 1, dayStartHour, 0, 0, 0);
  const end = new Date(2000, 0, 1, dayEndHour, 0, 0, 0);
  while (cur <= end) {
    slots.push(fmtHM(cur));
    cur = addMinutes(cur, slotMinutes);
  }
  return slots;
}
