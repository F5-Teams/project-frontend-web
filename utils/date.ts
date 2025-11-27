export function formatDMY(d: Date): string {
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

export function formatRangeDMY(from: Date, to: Date): string {
  return `${formatDMY(from)} – ${formatDMY(to)}`;
}

// Format ngày giờ theo định dạng 24h: dd/MM/yyyy HH:mm
export function formatDateTime24(d: Date | string): string {
  const date = typeof d === "string" ? new Date(d) : d;
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  const HH = String(date.getHours()).padStart(2, "0");
  const MM = String(date.getMinutes()).padStart(2, "0");
  return `${dd}/${mm}/${yyyy} ${HH}:${MM}`;
}
