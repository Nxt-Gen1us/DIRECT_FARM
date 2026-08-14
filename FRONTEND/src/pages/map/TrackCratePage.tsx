import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Marker } from "react-leaflet";
import { useTranslation } from "react-i18next";
import { useMapDesk } from "../../app/providers/MapProvider";
import { routeByOrder } from "../../data/geo";
import { MapCanvas } from "../../components/map/MapCanvas";
import { MapRoute } from "../../components/map/MapRoute";
import { LiveTrackCard } from "../../components/map/LiveTrackCard";
import { pinIcon } from "../../components/map/pinIcon";
import { OrderTimeline } from "../../components/orders/OrderTimeline";
import { useOrders } from "../../app/providers/OrdersProvider";
import { Card } from "../../components/ui/Card";

export function TrackCratePage() {
  const { orderId } = useParams();
  const { t } = useTranslation();
  const { pings, live, watchOrder } = useMapDesk();
  const { getOrder } = useOrders();
  const route = routeByOrder(orderId ?? "");
  const order = getOrder(orderId ?? "");

  useEffect(() => {
    if (orderId) watchOrder(orderId);
  }, [orderId, watchOrder]);

  if (!route) {
    return <div className="container-app py-20 text-center text-ink-soft">{t("atlas.noRoute")}</div>;
  }

  const ping = pings[route.orderId];
  const last = ping?.position ?? route.lastKnown;
  const fit = [route.origin, route.destination, ...(last ? [last] : []), ...route.waypoints];

  return (
    <div className="container-app py-6">
      <Link to="/map/live" className="text-xs text-primary">
        ← {t("atlas.liveTitle")}
      </Link>
      <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wider text-secondary">{t("atlas.followCrate")}</p>
          <h1 className="font-display text-4xl text-ink">{route.orderId}</h1>
        </div>
        <Link to={`/orders/${route.orderId}`} className="text-sm text-primary">
          {t("atlas.openOrder")} →
        </Link>
      </div>
      <div className="mt-5 grid gap-4 lg:grid-cols-[340px_1fr]">
        <div className="space-y-4">
          <LiveTrackCard route={route} ping={ping} live={live} />
          {order && (
            <Card className="p-5">
              <h2 className="mb-3 font-display text-2xl">{t("flow.track")}</h2>
              <OrderTimeline order={order} />
            </Card>
          )}
        </div>
        <div className="h-[520px] overflow-hidden rounded-[1.35rem] border border-line">
          <MapCanvas fit={fit}>
            <MapRoute route={route} live={ping?.position} accent />
            <Marker position={[route.origin.lat, route.origin.lng]} icon={pinIcon("farm")} />
            <Marker position={[route.destination.lat, route.destination.lng]} icon={pinIcon("customer")} />
            {last && <Marker position={[last.lat, last.lng]} icon={pinIcon("vehicle", true)} />}
          </MapCanvas>
        </div>
      </div>
    </div>
  );
}
