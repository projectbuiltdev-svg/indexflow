import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

const rootEl = document.getElementById("root")!;

function reveal() {
  requestAnimationFrame(() => {
    rootEl.classList.add("ready");
  });
}

createRoot(rootEl).render(<App />);
reveal();
