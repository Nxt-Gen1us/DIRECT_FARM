import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  loadInventory,
  productFromDraft,
  saveInventory,
  type ManagedProduct,
  type ProductDraft,
} from "../../lib/inventory";

type InventoryContextValue = {
  listings: ManagedProduct[];
  getListing: (id: string) => ManagedProduct | undefined;
  createListing: (draft: ProductDraft) => ManagedProduct;
  updateListing: (id: string, draft: ProductDraft) => ManagedProduct | null;
  deleteListing: (id: string) => void;
  toggleActive: (id: string) => void;
};

const InventoryContext = createContext<InventoryContextValue | null>(null);

export function InventoryProvider({ children }: { children: ReactNode }) {
  const [listings, setListings] = useState<ManagedProduct[]>(loadInventory);

  const persist = useCallback((next: ManagedProduct[]) => {
    setListings(next);
    saveInventory(next);
  }, []);

  const getListing = useCallback(
    (id: string) => listings.find((p) => p.id === id),
    [listings],
  );

  const createListing = useCallback(
    (draft: ProductDraft) => {
      const created = productFromDraft(draft);
      persist([created, ...listings]);
      return created;
    },
    [listings, persist],
  );

  const updateListing = useCallback(
    (id: string, draft: ProductDraft) => {
      const current = listings.find((p) => p.id === id);
      if (!current) return null;
      const updated = productFromDraft(draft, current);
      persist(listings.map((p) => (p.id === id ? updated : p)));
      return updated;
    },
    [listings, persist],
  );

  const deleteListing = useCallback(
    (id: string) => {
      persist(listings.filter((p) => p.id !== id));
    },
    [listings, persist],
  );

  const toggleActive = useCallback(
    (id: string) => {
      persist(
        listings.map((p) => (p.id === id ? { ...p, active: !p.active } : p)),
      );
    },
    [listings, persist],
  );

  const value = useMemo(
    () => ({
      listings,
      getListing,
      createListing,
      updateListing,
      deleteListing,
      toggleActive,
    }),
    [listings, getListing, createListing, updateListing, deleteListing, toggleActive],
  );

  return <InventoryContext.Provider value={value}>{children}</InventoryContext.Provider>;
}

export function useInventory() {
  const ctx = useContext(InventoryContext);
  if (!ctx) throw new Error("useInventory must be used within InventoryProvider");
  return ctx;
}
