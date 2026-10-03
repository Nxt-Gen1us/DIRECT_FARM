import type { Role, User } from "./types";
import { users } from "../data/farmers";
import { findRegistered } from "./accounts";

export const DEMO_PASSWORD = "harvest26";

export const demoAccounts: Record<
  Role,
  { email: string; name: string; hint: string }
> = {
  customer: { email: "ananya@directfarm.com", name: "Ananya Mehta", hint: "Kitchen buyer" },
  farmer: { email: "ramesh@khedut.farm", name: "Ramesh Patel", hint: "Ode Organic Acres" },
  admin: { email: "priya@directfarm.com", name: "Priya Desai", hint: "Platform desk" },
};

export function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function findUserByEmail(email: string) {
  return users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
}

export function buildSessionUser(email: string, role: Role, name?: string): User {
  const known = findUserByEmail(email);
  if (known) return known;
  const local = email.split("@")[0] || "guest";
  return {
    id: `u-${role}-${Date.now()}`,
    name: name?.trim() || local.replace(/[._-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    email: email.trim().toLowerCase(),
    phone: "",
    role,
    avatar:
      role === "farmer"
        ? "/images/farmer-ramesh.jpg"
        : role === "admin"
          ? "/images/exporter-priya.jpg"
          : "/images/chef-ananya.jpg",
    verified: role === "admin",
    joinedAt: new Date().toISOString().slice(0, 10),
  };
}

export function authenticate(email: string, password: string, role: Role) {
  if (!isValidEmail(email)) return { ok: false as const, error: "email" };
  if (password.length < 8) return { ok: false as const, error: "password" };

  const registered = findRegistered(email);
  if (registered) {
    if (registered.role !== role) return { ok: false as const, error: "role" };
    if (registered.password !== password) return { ok: false as const, error: "credentials" };
    return {
      ok: true as const,
      user: buildSessionUser(registered.email, registered.role, registered.name),
    };
  }

  const known = findUserByEmail(email);
  if (known && known.role !== role) return { ok: false as const, error: "role" };
  if (known && password !== DEMO_PASSWORD) return { ok: false as const, error: "credentials" };
  if (!known) return { ok: false as const, error: "credentials" };

  return { ok: true as const, user: buildSessionUser(email, role) };
}
