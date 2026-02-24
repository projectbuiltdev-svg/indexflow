import { renderToPipeableStream } from "react-dom/server";
import { Router } from "wouter";
import App from "./App";
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
  const stream = renderToPipeableStream(
    <Router ssrPath={url}>
      <App />
    </Router>,
    {
      onAllReady: options.onAllReady,
      onShellReady: options.onShellReady,
      onShellError: options.onShellError,
      onError: options.onError,
    },
  );

  return stream;
}
