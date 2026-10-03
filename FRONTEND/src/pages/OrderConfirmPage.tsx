import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { CheckCircle2 } from "lucide-react";
import { useOrders } from "../app/providers/OrdersProvider";
import { inr } from "../lib/format";
import { Button } from "../components/ui";
import { Card } from "../components/ui/Card";
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
    <div className="container-app max-w-3xl py-10 sm:py-14">
      <Card className="overflow-hidden p-0">
        <div className="bg-primary-soft px-5 py-6 text-center sm:px-8">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white text-primary shadow-sm">
            <CheckCircle2 size={32} />
          </div>
          <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-primary sm:text-xs">{order.id}</p>
          <h1 className="mt-2 font-display text-3xl text-ink sm:text-4xl">{t("flow.confirmTitle")}</h1>
          <p className="mt-3 text-sm text-ink-soft">{t("flow.confirmBody")}</p>
          <p className="mt-4 font-display text-2xl text-primary sm:text-3xl">{inr(order.total)}</p>
          {order.payChannel === "razorpay" && (
            <p className="mt-3 text-xs text-muted">{t("flow.verifyHold")}</p>
          )}
        </div>

        <div className="p-5 sm:p-6">
          <div className="mx-auto max-w-md text-left">
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
      </Card>
    </div>
  );
}
