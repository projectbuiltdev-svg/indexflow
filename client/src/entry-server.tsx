import { renderToPipeableStream } from "react-dom/server";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { AppRoutes } from "./App";
import { Router } from "wouter";
import { memoryLocation } from "wouter/memory-location";
import type { Writable } from "stream";

export function render(
  url: string,
  options: {
    onAllReady: () => void;
    onShellReady: () => void;
    onShellError: (err: unknown) => void;
    onError: (err: unknown) => void;
  },
): { pipe: (dest: Writable) => Writable; abort: () => void } {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        enabled: false,
        staleTime: Infinity,
        retry: false,
      },
    },
  });

  const { hook } = memoryLocation({ path: url, static: true });

  const stream = renderToPipeableStream(
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router hook={hook}>
          <AppRoutes />
        </Router>
      </TooltipProvider>
    </QueryClientProvider>,
    {
      onAllReady: options.onAllReady,
      onShellReady: options.onShellReady,
      onShellError: options.onShellError,
      onError: options.onError,
    },
  );

  return stream;
}
