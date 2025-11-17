"use client";
import { ReactNode, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SocketProvider } from "@/contexts/SocketContext";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: unknown) => {
        // Don't retry on 401 errors
        if (
          error &&
          typeof error === "object" &&
          "response" in error &&
          typeof (error as { response?: { status?: number } }).response ===
            "object" &&
          (error as { response?: { status?: number } }).response?.status === 401
        ) {
          return false;
        }
        return failureCount < 2;
      },
      refetchOnWindowFocus: false,
    },
  },
});

// Expose queryClient globally for logout function
if (typeof window !== "undefined") {
  (window as { __REACT_QUERY_CLIENT__?: QueryClient }).__REACT_QUERY_CLIENT__ =
    queryClient;
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <SocketProvider>{children}</SocketProvider>
    </QueryClientProvider>
  );
}
