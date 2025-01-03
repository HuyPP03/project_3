import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { EthersProvider } from "./context/EthersProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <EthersProvider>
      <App />
    </EthersProvider>
  </StrictMode>
);
