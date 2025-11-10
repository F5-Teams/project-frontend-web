import api from "@/config/axios";

export function getImageUrl(path?: string) {
  if (!path) return "";

  // Xóa / thừa tránh BUG
  const base = (api.defaults.baseURL || "").replace(/\/+$/, "");
  const cleanPath = path.replace(/^\/+/, "");

  return `${base}/${cleanPath}`;
}
