import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Marker } from "react-leaflet";
import { useOrders } from "../app/providers/OrdersProvider";
import { routeByOrder } from "../data/geo";
import { formatDate, inr } from "../lib/format";
import { Badge, Button } from "../components/ui";
import { Card } from "../components/ui/Card";
import { OrderTimeline } from "../components/orders/OrderTimeline";
import { MapCanvas } from "../components/map/MapCanvas";
import { MapRoute } from "../components/map/MapRoute";
import { pinIcon } from "../components/map/pinIcon";

export function OrderTrackingPage() {
  const { id } = useParams();
  const { t } = useTranslation();
  const { getOrder } = useOrders();
  const order = getOrder(id ?? "");
  const route = routeByOrder(id ?? "");

  if (!order) {
    return <div className="container-app py-20 text-center text-ink-soft">{t("flow.none")}</div>;
  }

  return (
    <div className="container-app max-w-3xl py-10">
      <Link to={`/orders/${order.id}`} className="text-xs text-primary">
        ← {order.id}
      </Link>
      <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wider text-muted">{t("flow.track")}</p>
          <h1 className="font-display text-4xl">{order.id}</h1>
          <p className="text-sm text-ink-soft">
            {order.farmerName} · {t("flow.eta")} {order.eta}
          </p>
        </div>
        <Badge>{t(`flow.status.${order.status}`)}</Badge>
      </div>
      <Card className="mt-8 p-6">
        <OrderTimeline order={order} />
      </Card>
      {route && (
        <div className="mt-4 overflow-hidden rounded-[1.25rem] border border-line">
          <div className="flex items-center justify-between px-4 py-3">
            <p className="text-sm font-medium">{t("atlas.followCrate")}</p>
            <Link to={`/map/track/${order.id}`}>
              <Button size="sm" variant="ghost">
                {t("atlas.open")}
              </Button>
            </Link>
          </div>
          <div className="h-64">
            <MapCanvas fit={[route.origin, route.destination, ...route.waypoints]}>
              <MapRoute route={route} accent={route.status === "out"} />
              <Marker position={[route.origin.lat, route.origin.lng]} icon={pinIcon("farm")} />
              <Marker position={[route.destination.lat, route.destination.lng]} icon={pinIcon("customer")} />
            </MapCanvas>
          </div>
        </div>
      )}
      <Card className="mt-4 p-5 text-sm">
        <p className="text-xs uppercase tracking-wider text-muted">{t("flow.shipTo")}</p>
        <p className="mt-1 font-medium">{order.shipping?.name ?? order.buyerName}</p>
        <p className="text-ink-soft">{order.address}</p>
        <p className="mt-3 font-display text-xl text-primary">{inr(order.total)}</p>
        <p className="text-xs text-muted">{formatDate(order.placedAt)}</p>
      </Card>
    </div>
  );
}
