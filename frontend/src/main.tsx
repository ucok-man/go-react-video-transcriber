import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { Toaster } from "./components/ui/toaster.tsx";
import TranscribeProvider from "./context/trasncribe-provider.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TranscribeProvider>
      <App />
      <Toaster />
    </TranscribeProvider>
  </StrictMode>
);
