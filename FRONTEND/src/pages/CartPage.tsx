import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useApp } from "../app/providers/AppProviders";
import { productById } from "../data/products";
import { deliveryFee } from "../lib/orderFlow";
import { inr } from "../lib/format";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { EmptyState } from "../components/ui/EmptyState";
import { SmartHints } from "../components/marketplace/SmartHints";
import { RecentlyViewed } from "../components/marketplace/RecentlyViewed";

export function CartPage() {
  const { t } = useTranslation();
  const { cart, setQty, removeFromCart, cartTotal } = useApp();
  const navigate = useNavigate();
  const delivery = deliveryFee(cartTotal);

  return (
    <div className="container-app py-10">
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-secondary">{t("nav.market")}</p>
      <h1 className="mt-1 font-display text-4xl">{t("flow.cart")}</h1>
      {cart.length === 0 ? (
        <EmptyState
          title={t("flow.cartEmpty")}
          action={
            <Link to="/market">
              <Button>{t("flow.shop")}</Button>
            </Link>
          }
        />
      ) : (
        <div className="mt-8 grid gap-6 lg:grid-cols-5">
          <div className="space-y-3 lg:col-span-3">
            {cart.map((item) => {
              const p = productById(item.productId);
              if (!p) return null;
              return (
                <Card key={p.id} className="flex items-center gap-4 p-3">
                  <img src={p.image} alt="" className="h-20 w-20 rounded-xl object-cover" />
                  <div className="min-w-0 flex-1">
                    <Link to={`/market/${p.id}`} className="font-medium hover:text-primary">
                      {p.name}
                    </Link>
                    <p className="text-xs text-muted">
                      {inr(p.price)} / {p.unit}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        type="button"
                        className="grid h-7 w-7 place-items-center rounded-full bg-cream-deep"
                        onClick={() => setQty(p.id, item.qty - 1)}
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-8 text-center text-sm">
                        {item.qty} {p.unit}
                      </span>
                      <button
                        type="button"
                        className="grid h-7 w-7 place-items-center rounded-full bg-cream-deep"
                        onClick={() => setQty(p.id, item.qty + 1)}
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-lg">{inr(p.price * item.qty)}</p>
                    <button
                      type="button"
                      className="mt-2 text-xs text-primary"
                      onClick={() => removeFromCart(p.id)}
                    >
                      <Trash2 size={12} className="mr-1 inline" />
                      {t("flow.remove")}
                    </button>
                  </div>
                </Card>
              );
            })}
          </div>
          <Card className="h-fit p-5 lg:col-span-2">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>{t("flow.subtotal")}</span>
                <span>{inr(cartTotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>{t("flow.delivery")}</span>
                <span>{delivery === 0 ? t("flow.free") : inr(delivery)}</span>
              </div>
              <div className="flex justify-between border-t border-line pt-2 font-medium">
                <span>{t("flow.total")}</span>
                <span className="font-display text-xl text-primary">{inr(cartTotal + delivery)}</span>
              </div>
            </div>
            <Button className="mt-5 w-full" onClick={() => navigate("/checkout")}>
              {t("flow.checkout")}
            </Button>
            <Link to="/box" className="mt-3 block text-center text-xs text-primary">
              {t("shop.tryBox")}
            </Link>
            <SmartHints />
          </Card>
        </div>
      )}
      <RecentlyViewed />
    </div>
  );
}
