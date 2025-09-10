"use client";

import axios from "axios";
import { env } from "@/lib/env"; // zod-guard như bạn đã có
import { normalizeHttpError } from "./errors";

export const http = axios.create({
  baseURL: env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true, // nếu backend xài cookie
  timeout: 15000,
});

// Interceptors (client-only). Lưu ý: không dùng localStorage trên server.
http.interceptors.request.use((config) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (token) {
    config.headers = {
      ...(config.headers || {}),
      Authorization: `Bearer ${token}`,
    };
  }
  return config;
});

http.interceptors.response.use(
  (r) => r,
  (error) => Promise.reject(normalizeHttpError(error))
);
