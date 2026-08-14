import type { Role } from "../lib/types";

export type NavItem = {
  id: string;
  path: string;
  labelKey: string;
  roles: Role[] | "all";
  group: "primary" | "commerce" | "intel" | "desk";
};

export const navigation: NavItem[] = [
  { id: "home", path: "/", labelKey: "nav.home", roles: "all", group: "primary" },
  { id: "system", path: "/system", labelKey: "nav.system", roles: "all", group: "primary" },
  { id: "market", path: "/market", labelKey: "nav.market", roles: "all", group: "commerce" },
  { id: "wishlist", path: "/wishlist", labelKey: "nav.wishlist", roles: ["customer"], group: "commerce" },
  { id: "box", path: "/box", labelKey: "nav.box", roles: ["customer"], group: "commerce" },
  { id: "orders", path: "/orders", labelKey: "nav.orders", roles: ["customer", "farmer", "admin"], group: "commerce" },
  { id: "payments", path: "/payments", labelKey: "nav.payments", roles: ["customer", "farmer", "admin"], group: "commerce" },
  { id: "chat", path: "/chat", labelKey: "nav.chat", roles: ["customer", "farmer"], group: "commerce" },
  { id: "map", path: "/map", labelKey: "nav.map", roles: "all", group: "intel" },
  { id: "ai", path: "/ai", labelKey: "nav.ai", roles: "all", group: "intel" },
  { id: "passport", path: "/passport", labelKey: "nav.passport", roles: "all", group: "intel" },
  { id: "intel", path: "/intel", labelKey: "nav.intel", roles: "all", group: "intel" },
  { id: "weather", path: "/weather", labelKey: "nav.weather", roles: "all", group: "intel" },
  { id: "calendar", path: "/calendar", labelKey: "nav.calendar", roles: "all", group: "intel" },
  { id: "schemes", path: "/schemes", labelKey: "nav.schemes", roles: "all", group: "intel" },
  { id: "sustainability", path: "/sustainability", labelKey: "nav.sustainability", roles: "all", group: "intel" },
  { id: "premium", path: "/premium", labelKey: "nav.premium", roles: "all", group: "intel" },
  { id: "farms", path: "/farmers", labelKey: "nav.farmers", roles: "all", group: "commerce" },
  { id: "farmer", path: "/farmer", labelKey: "nav.farmer", roles: ["farmer", "admin"], group: "desk" },
  { id: "lots", path: "/farmer/products", labelKey: "nav.lots", roles: ["farmer", "admin"], group: "desk" },
  { id: "admin", path: "/admin", labelKey: "nav.admin", roles: ["admin"], group: "desk" },
  { id: "account", path: "/account", labelKey: "nav.account", roles: "all", group: "desk" },
];

export const headerLinks = navigation.filter((item) =>
  ["market", "map", "ai", "premium", "sustainability"].includes(item.id),
);

export const landingAnchors = [
  { id: "how", href: "/#how", labelKey: "nav.how" },
  { id: "farmers", href: "/#farmers", labelKey: "nav.farmers" },
  { id: "harvest", href: "/#harvest", labelKey: "nav.harvest" },
  { id: "passport", href: "/#passport", labelKey: "nav.passport" },
  { id: "ai", href: "/#ai", labelKey: "nav.ai" },
];

export function navForRole(role: Role) {
  return navigation.filter((item) => item.roles === "all" || item.roles.includes(role));
}
