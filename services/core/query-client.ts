"use client";

import { QueryClient } from "@tanstack/react-query";

export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60_000, // 1 phút
        gcTime: 5 * 60_000, // 5 phút
        refetchOnWindowFocus: false,
        retry: (failureCount, error: any) => {
          // Ví dụ: không retry nếu 4xx
          if (error?.status && error.status < 500) return false;
          return failureCount < 2;
        },
      },
      mutations: {
        retry: 0,
      },
    },
  });
}
