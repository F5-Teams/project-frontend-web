export const toDate = (v?: string | Date | null) =>
  !v ? undefined : v instanceof Date ? v : new Date(v);

export const startOfDay = (d: Date) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate());

export const addDays = (d: Date, n: number) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);

export const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

export const startOfWeek = (d: Date) => {
  const day = (d.getDay() + 6) % 7; // Mon=0
  const s = startOfDay(d);
  s.setDate(s.getDate() - day);
  return s;
};

export const inRange = (x: Date, s: Date, e: Date) => s <= x && x <= e;

export const formatDMY = (d: Date) =>
  `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(
    2,
    "0"
  )}/${d.getFullYear()}`;

export const formatRangeDMY = (s: Date, e: Date) =>
  `${formatDMY(s)} – ${formatDMY(e)}`;

export const expandDates = (s: Date, e: Date) => {
  const out: Date[] = [];
  let cur = startOfDay(s);
  const end = startOfDay(e);
  while (cur <= end) {
    out.push(cur);
    cur = addDays(cur, 1);
  }
  return out;
};

/** NEW: ensure we always return a Date (fallback to given fallback or today) */
export const ensureDate = (v?: string | Date | null, fallback?: Date) =>
  toDate(v) ?? fallback ?? new Date();
