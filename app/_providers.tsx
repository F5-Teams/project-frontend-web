"use client";

import { ReactNode, useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createQueryClient } from "@/services/core/query-client";

export default function Providers({ children }: { children: ReactNode }) {
  const [qc] = useState(() => createQueryClient());
  return (
    <QueryClientProvider client={qc}>
      {children}
      {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}
