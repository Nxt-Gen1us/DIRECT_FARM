import {
  createContext,
  useCallback,
  useContext,
  useEffect,
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
import {
  createProduct,
  deleteProduct,
  fetchProducts,
  updateProduct as apiUpdateProduct,
} from "../../lib/api/products";
import { apiConfigured } from "../../lib/api";
import { useApp } from "./AppProviders";

type InventoryContextValue = {
  listings: ManagedProduct[];
  getListing: (id: string) => ManagedProduct | undefined;
  createListing: (draft: ProductDraft) => Promise<ManagedProduct>;
  updateListing: (id: string, draft: ProductDraft) => Promise<ManagedProduct | null>;
  deleteListing: (id: string) => Promise<void>;
  toggleActive: (id: string) => Promise<void>;
};

const InventoryContext = createContext<InventoryContextValue | null>(null);

export function InventoryProvider({ children }: { children: ReactNode }) {
  const { user } = useApp();
  const [listings, setListings] = useState<ManagedProduct[]>([]);
  const [loading, setLoading] = useState(true);

  // Custom fetch function
  const refreshListings = useCallback(async () => {
    if (apiConfigured() && user?.id) {
      try {
        const fetched = await fetchProducts({ farmer: user.id });
        // adapt Product to ManagedProduct format if necessary, for now we map directly
        const managed = fetched.map(p => ({
          ...p,
          packaging: "crate" as const, // Default mock fallback for purely local fields
          video: "",
          qrCode: `FC-LOT-${p.id.slice(-6)}`,
          active: true,
        }));
        setListings(managed);
      } catch (err) {
        console.error("Failed to load inventory:", err);
      } finally {
        setLoading(false);
      }
    } else if (!apiConfigured()) {
      setListings(loadInventory());
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refreshListings();
  }, [refreshListings]);

  const persist = useCallback((next: ManagedProduct[]) => {
    setListings(next);
    if (!apiConfigured()) {
      saveInventory(next);
    }
  }, []);

  const getListing = useCallback(
    (id: string) => listings.find((p) => p.id === id),
    [listings],
  );

  const createListing = useCallback(
    async (draft: ProductDraft) => {
      if (apiConfigured()) {
        const created = await createProduct({
          name: draft.name,
          category: draft.category,
          price: Number(draft.price),
          quantityAvailable: Number(draft.stock),
          description: draft.description,
          isOrganic: draft.organic,
          harvestDate: draft.harvestedOn,
          variety: draft.variety,
          unit: draft.unit,
          minQty: Number(draft.minQty),
          origin: draft.origin,
        });
        const managed = {
          ...created,
          packaging: draft.packaging,
          video: draft.video,
          qrCode: `FC-LOT-${created.id.slice(-6)}`,
          active: true,
        };
        persist([managed, ...listings]);
        return managed;
      }
      
      const created = productFromDraft(draft);
      persist([created, ...listings]);
      return created;
    },
    [listings, persist],
  );

  const updateListing = useCallback(
    async (id: string, draft: ProductDraft) => {
      const current = listings.find((p) => p.id === id);
      if (!current) return null;
      
      if (apiConfigured()) {
        const updated = await apiUpdateProduct(id, {
          name: draft.name,
          category: draft.category,
          price: Number(draft.price),
          quantityAvailable: Number(draft.stock),
          description: draft.description,
          isOrganic: draft.organic,
          harvestDate: draft.harvestedOn,
          variety: draft.variety,
          unit: draft.unit,
          minQty: Number(draft.minQty),
          origin: draft.origin,
        });
        const managed = {
          ...updated,
          packaging: draft.packaging,
          video: draft.video,
          qrCode: current.qrCode,
          active: current.active,
        };
        persist(listings.map((p) => (p.id === id ? managed : p)));
        return managed;
      }

      const updated = productFromDraft(draft, current);
      persist(listings.map((p) => (p.id === id ? updated : p)));
      return updated;
    },
    [listings, persist],
  );

  const deleteListing = useCallback(
    async (id: string) => {
      if (apiConfigured()) {
        await deleteProduct(id);
      }
      persist(listings.filter((p) => p.id !== id));
    },
    [listings, persist],
  );

  const toggleActive = useCallback(
    async (id: string) => {
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
