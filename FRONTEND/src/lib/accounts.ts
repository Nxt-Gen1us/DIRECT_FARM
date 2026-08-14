import type { Role } from "./types";

export type StoredAccount = {
  email: string;
  password: string;
  role: Role;
  name: string;
  phone: string;
  location?: string;
  state?: string;
  farmName?: string;
  farmSize?: string;
  crops?: string[];
  experience?: string;
  organic?: string;
};

const REGISTERED_KEY = "fc-registered";

export function listRegistered(): StoredAccount[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(REGISTERED_KEY);
    return raw ? (JSON.parse(raw) as StoredAccount[]) : [];
  } catch {
    return [];
  }
}

export function saveRegistered(account: StoredAccount) {
  const next = listRegistered().filter(
    (a) => a.email.toLowerCase() !== account.email.toLowerCase(),
  );
  next.push(account);
  window.localStorage.setItem(REGISTERED_KEY, JSON.stringify(next));
}

export function findRegistered(email: string) {
  return listRegistered().find((a) => a.email.toLowerCase() === email.trim().toLowerCase());
}
