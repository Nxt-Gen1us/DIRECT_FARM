import { useApp } from "../app/providers/AppProviders";

export function useRole() {
  return useApp();
}
