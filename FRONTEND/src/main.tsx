import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./i18n";
import App from "./App.tsx";
import { AppProviders } from "./app/providers/AppProviders";
import { InventoryProvider } from "./app/providers/InventoryProvider";
import { OrdersProvider } from "./app/providers/OrdersProvider";
import { ChatProvider } from "./app/providers/ChatProvider";
import { MapProvider } from "./app/providers/MapProvider";
import { ShopProvider } from "./app/providers/ShopProvider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppProviders>
      <InventoryProvider>
        <OrdersProvider>
          <ChatProvider>
            <MapProvider>
              <ShopProvider>
                <App />
              </ShopProvider>
            </MapProvider>
          </ChatProvider>
        </OrdersProvider>
      </InventoryProvider>
    </AppProviders>
  </StrictMode>,
);
