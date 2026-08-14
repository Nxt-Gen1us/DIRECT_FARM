import type { Role } from "../lib/types";

export const roles: Role[] = ["customer", "farmer", "admin"];

export const roleHome: Record<Role, string> = {
  customer: "/",
  farmer: "/farmer",
  admin: "/admin",
};

export const roleLabelKey: Record<Role, string> = {
  customer: "roles.customer",
  farmer: "roles.farmer",
  admin: "roles.admin",
};
