import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useApp } from "../app/providers/AppProviders";
import { productById } from "../data/products";
import { deliveryFee } from "../lib/orderFlow";
import { formatUnit, inr } from "../lib/format";
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
    <div className="container-app py-8 sm:py-10">
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-secondary sm:text-xs">DIRECT FARM</p>
      <h1 className="mt-1 font-display text-2xl text-ink sm:text-3xl md:text-4xl">{t("flow.cart")}</h1>

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
        <div className="mt-6 grid gap-5 sm:mt-8 sm:gap-6 lg:grid-cols-5">
          <div className="space-y-3 lg:col-span-3">
            {cart.map((item) => {
              const p = productById(item.productId);
              if (!p) return null;
              return (
                <Card key={p.id} className="flex items-center gap-3 p-3 sm:gap-4 sm:p-4">
                  <img src={p.image} alt="" className="h-20 w-20 rounded-xl object-cover sm:h-24 sm:w-24" />
                  <div className="min-w-0 flex-1">
                    <Link to={`/market/${p.id}`} className="text-sm font-medium text-ink hover:text-primary sm:text-base">
                      {p.name}
                    </Link>
                    <p className="mt-1 text-[10px] text-muted sm:text-xs">
                      {inr(p.price)} / {formatUnit(p.unit)}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        type="button"
                        className="grid h-7 w-7 place-items-center rounded-full bg-canvas text-ink-soft transition hover:bg-canvas-soft"
                        onClick={() => setQty(p.id, item.qty - 1)}
                      >
                        <Minus size={11} />
                      </button>
                      <span className="w-8 text-center text-xs font-medium text-ink sm:text-sm">
                        {item.qty} {formatUnit(p.unit)}
                      </span>
                      <button
                        type="button"
                        className="grid h-7 w-7 place-items-center rounded-full bg-canvas text-ink-soft transition hover:bg-canvas-soft"
                        onClick={() => setQty(p.id, item.qty + 1)}
                      >
                        <Plus size={11} />
                      </button>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-display text-base text-primary sm:text-lg">{inr(p.price * item.qty)}</p>
                    <button
                      type="button"
                      className="mt-2 inline-flex items-center gap-1 text-[10px] text-primary sm:text-xs"
                      onClick={() => removeFromCart(p.id)}
                    >
                      <Trash2 size={11} />
                      {t("flow.remove")}
                    </button>
                  </div>
                </Card>
              );
            })}
          </div>

          <Card className="h-fit p-4 sm:p-5 lg:col-span-2">
            <div className="space-y-2 text-xs sm:text-sm">
              <div className="flex justify-between text-ink-soft">
                <span>{t("flow.subtotal")}</span>
                <span>{inr(cartTotal)}</span>
              </div>
              <div className="flex justify-between text-ink-soft">
                <span>{t("flow.delivery")}</span>
                <span>{delivery === 0 ? t("flow.free") : inr(delivery)}</span>
              </div>
              <div className="flex justify-between border-t border-line pt-2 font-medium text-ink">
                <span>{t("flow.total")}</span>
                <span className="font-display text-lg text-primary sm:text-xl">{inr(cartTotal + delivery)}</span>
              </div>
            </div>
            <Button className="mt-4 w-full" onClick={() => navigate("/checkout")}>
              {t("flow.checkout")}
            </Button>
            <Link to="/box" className="mt-3 block text-center text-[10px] text-primary sm:text-xs">
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
