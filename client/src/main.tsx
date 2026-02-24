import { hydrateRoot, createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

const rootEl = document.getElementById("root")!;

if (rootEl.innerHTML.trim()) {
  hydrateRoot(rootEl, <App />);
} else {
  createRoot(rootEl).render(<App />);
}
