import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./i18n";
import App from "./App.tsx";
import { AppProviders } from "./app/providers/AppProviders";
import { InventoryProvider } from "./app/providers/InventoryProvider";
import { OrdersProvider } from "./app/providers/OrdersProvider";
import { ChatProvider } from "./app/providers/ChatProvider";
import { ShopProvider } from "./app/providers/ShopProvider";

const apiBase = (import.meta.env.VITE_API_URL as string | undefined) ?? "";
const socketBase = (import.meta.env.VITE_WS_URL as string | undefined) ?? "";

if (import.meta.env.PROD) {
  const issues: string[] = [];
  if (!apiBase || !apiBase.startsWith("http")) issues.push("VITE_API_URL");
  if (!socketBase || !socketBase.startsWith("http")) issues.push("VITE_WS_URL");
  if (issues.length) {
    throw new Error(`Production frontend config is incomplete: ${issues.join(", ")}. Set live backend and websocket URLs before deploying.`);
  }
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppProviders>
      <InventoryProvider>
        <OrdersProvider>
          <ChatProvider>
            <ShopProvider>
              <App />
            </ShopProvider>
          </ChatProvider>
        </OrdersProvider>
      </InventoryProvider>
    </AppProviders>
  </StrictMode>,
);
