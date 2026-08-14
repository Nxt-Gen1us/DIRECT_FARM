import type { Role } from "../../lib/types";

export type AppRoute = {
  path: string;
  name: string;
  module:
    | "home"
    | "system"
    | "marketplace"
    | "orders"
    | "payments"
    | "chat"
    | "map"
    | "ai"
    | "passport"
    | "weather"
    | "sustainability"
    | "farmer"
    | "admin"
    | "account"
    | "auth"
    | "premium";
  roles: Role[] | "all";
  placeholder: boolean;
};

/**
 * Reserved application routes. Business pages are not mounted yet —
 * each reserved path renders the foundation placeholder.
 */
export const appRoutes: AppRoute[] = [
  { path: "/", name: "Home", module: "home", roles: "all", placeholder: true },
  { path: "/system", name: "Design system", module: "system", roles: "all", placeholder: false },
  { path: "/market", name: "Marketplace", module: "marketplace", roles: "all", placeholder: false },
  { path: "/market/:id", name: "Product", module: "marketplace", roles: "all", placeholder: false },
  { path: "/wishlist", name: "Saved lots", module: "marketplace", roles: ["customer"], placeholder: false },
  { path: "/compare", name: "Compare lots", module: "marketplace", roles: ["customer"], placeholder: false },
  { path: "/box", name: "Vegetable crate", module: "marketplace", roles: ["customer"], placeholder: false },
  { path: "/cart", name: "Basket", module: "orders", roles: ["customer"], placeholder: false },
  { path: "/checkout", name: "Checkout", module: "orders", roles: ["customer"], placeholder: false },
  { path: "/orders", name: "Orders", module: "orders", roles: "all", placeholder: false },
  { path: "/orders/:id", name: "Order detail", module: "orders", roles: "all", placeholder: false },
  { path: "/orders/:id/confirm", name: "Order confirmation", module: "orders", roles: "all", placeholder: false },
  { path: "/orders/:id/invoice", name: "Invoice", module: "orders", roles: "all", placeholder: false },
  { path: "/orders/:id/track", name: "Track crate", module: "orders", roles: "all", placeholder: false },
  { path: "/payments", name: "Payments", module: "payments", roles: "all", placeholder: false },
  { path: "/chat", name: "Field radio", module: "chat", roles: "all", placeholder: false },
  { path: "/chat/:threadId", name: "Thread", module: "chat", roles: "all", placeholder: false },
  { path: "/notices", name: "Notices", module: "chat", roles: "all", placeholder: false },
  { path: "/map", name: "Smart map", module: "map", roles: "all", placeholder: false },
  { path: "/map/farmers", name: "Nearby farmers", module: "map", roles: "all", placeholder: false },
  { path: "/map/customers", name: "Nearby kitchens", module: "map", roles: "all", placeholder: false },
  { path: "/map/farms", name: "Farm locations", module: "map", roles: "all", placeholder: false },
  { path: "/map/lots", name: "Lot locations", module: "map", roles: "all", placeholder: false },
  { path: "/map/routes", name: "Delivery routes", module: "map", roles: "all", placeholder: false },
  { path: "/map/live", name: "Live crates", module: "map", roles: "all", placeholder: false },
  { path: "/map/track/:orderId", name: "Track crate", module: "map", roles: "all", placeholder: false },
  { path: "/ai", name: "AI Agriculture", module: "ai", roles: "all", placeholder: false },
  { path: "/passport", name: "Crop Passport", module: "passport", roles: "all", placeholder: false },
  { path: "/passport/:id", name: "Passport detail", module: "passport", roles: "all", placeholder: false },
  { path: "/intel", name: "Field intel", module: "weather", roles: "all", placeholder: false },
  { path: "/weather", name: "Weather", module: "weather", roles: "all", placeholder: false },
  { path: "/weather/alerts", name: "Rain alerts", module: "weather", roles: "all", placeholder: false },
  { path: "/calendar", name: "Crop calendar", module: "weather", roles: "all", placeholder: false },
  { path: "/reminders", name: "Reminders", module: "weather", roles: "all", placeholder: false },
  { path: "/schemes", name: "Schemes", module: "weather", roles: "all", placeholder: false },
  { path: "/sustainability", name: "Sustainability", module: "sustainability", roles: "all", placeholder: false },
  { path: "/premium", name: "Premium desk", module: "premium", roles: "all", placeholder: false },
  { path: "/premium/auction", name: "Live auction", module: "premium", roles: "all", placeholder: false },
  { path: "/premium/community", name: "Farmer circle", module: "premium", roles: "all", placeholder: false },
  { path: "/premium/experts", name: "Experts", module: "premium", roles: "all", placeholder: false },
  { path: "/premium/forecast", name: "Season forecast", module: "premium", roles: "all", placeholder: false },
  { path: "/premium/contracts", name: "Contracts", module: "premium", roles: "all", placeholder: false },
  { path: "/premium/equipment", name: "Machines", module: "premium", roles: "all", placeholder: false },
  { path: "/premium/warehouse", name: "Warehouse", module: "premium", roles: "all", placeholder: false },
  { path: "/premium/cold", name: "Cold store", module: "premium", roles: "all", placeholder: false },
  { path: "/farmer", name: "Farmer desk", module: "farmer", roles: ["farmer", "admin"], placeholder: false },
  { path: "/farmer/products", name: "Lot book", module: "farmer", roles: ["farmer", "admin"], placeholder: false },
  { path: "/farmer/products/new", name: "Add lot", module: "farmer", roles: ["farmer", "admin"], placeholder: false },
  { path: "/farmer/products/:id/edit", name: "Edit lot", module: "farmer", roles: ["farmer", "admin"], placeholder: false },
  { path: "/farmers", name: "Farm directory", module: "farmer", roles: "all", placeholder: false },
  { path: "/farmers/:id", name: "Farm profile", module: "farmer", roles: "all", placeholder: false },
  { path: "/admin", name: "Admin desk", module: "admin", roles: ["admin"], placeholder: false },
  { path: "/admin/users", name: "Users", module: "admin", roles: ["admin"], placeholder: false },
  { path: "/admin/farmers", name: "Farmers", module: "admin", roles: ["admin"], placeholder: false },
  { path: "/admin/customers", name: "Kitchens", module: "admin", roles: ["admin"], placeholder: false },
  { path: "/admin/products", name: "Lots", module: "admin", roles: ["admin"], placeholder: false },
  { path: "/admin/orders", name: "Orders desk", module: "admin", roles: ["admin"], placeholder: false },
  { path: "/admin/payments", name: "Payments desk", module: "admin", roles: ["admin"], placeholder: false },
  { path: "/admin/verify", name: "Verification", module: "admin", roles: ["admin"], placeholder: false },
  { path: "/admin/complaints", name: "Complaints", module: "admin", roles: ["admin"], placeholder: false },
  { path: "/admin/reports", name: "Reports", module: "admin", roles: ["admin"], placeholder: false },
  { path: "/admin/ai", name: "AI use", module: "admin", roles: ["admin"], placeholder: false },
  { path: "/admin/sustain", name: "Earth ledger", module: "admin", roles: ["admin"], placeholder: false },
  { path: "/account", name: "Account", module: "account", roles: "all", placeholder: false },
  { path: "/login", name: "Sign in", module: "auth", roles: "all", placeholder: false },
  { path: "/register", name: "Register", module: "auth", roles: "all", placeholder: false },
  { path: "/forgot-password", name: "Forgot password", module: "auth", roles: "all", placeholder: false },
];
