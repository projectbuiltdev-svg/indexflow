import { hydrateRoot, createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

const rootEl = document.getElementById("root")!;

function reveal() {
  requestAnimationFrame(() => {
    rootEl.classList.add("ready");
  });
}

if (rootEl.innerHTML.trim()) {
  hydrateRoot(rootEl, <App />, { onRecoverableError: () => {} });
  reveal();
} else {
  createRoot(rootEl).render(<App />);
  reveal();
}
