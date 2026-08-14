import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useOrders } from "../app/providers/OrdersProvider";
import { inr } from "../lib/format";
import { Button } from "../components/ui";
import { OrderTimeline } from "../components/orders/OrderTimeline";

export function OrderConfirmPage() {
  const { id } = useParams();
  const { t } = useTranslation();
  const { getOrder } = useOrders();
  const order = getOrder(id ?? "");

  if (!order) {
    return (
      <div className="container-app py-20 text-center text-ink-soft">{t("flow.none")}</div>
    );
  }

  return (
    <div className="container-app max-w-2xl py-14 text-center">
      <p className="text-xs uppercase tracking-[0.2em] text-nature">{order.id}</p>
      <h1 className="mt-2 font-display text-4xl text-ink">{t("flow.confirmTitle")}</h1>
      <p className="mt-3 text-sm text-ink-soft">{t("flow.confirmBody")}</p>
      <p className="mt-2 font-display text-2xl text-primary">{inr(order.total)}</p>
      {order.payChannel === "razorpay" && (
        <p className="mt-3 text-xs text-muted">{t("flow.verifyHold")}</p>
      )}
      <div className="mx-auto mt-8 max-w-sm text-left">
        <OrderTimeline order={order} />
      </div>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link to={`/orders/${order.id}`}>
          <Button>{t("flow.viewOrder")}</Button>
        </Link>
        <Link to="/orders">
          <Button variant="ghost">{t("flow.ordersTitle")}</Button>
        </Link>
      </div>
    </div>
  );
}
