import { useEffect, useState, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useOrders } from "../app/providers/OrdersProvider";
import { useApp } from "../app/providers/AppProviders";
import { formatDate, inr } from "../lib/format";
import { Badge, Button, Field, Input } from "../components/ui";
import { Card } from "../components/ui/Card";
import { OrderTimeline } from "../components/orders/OrderTimeline";
import { apiConfigured, tokenStore } from "../lib/api";
import { 
  fetchDeliveryTracking, 
  updateDeliveryTracking, 
  addDeliveryEvent,
  type DeliveryTracking 
} from "../lib/api/delivery";
import { DeliverySocket, type DeliveryLocationUpdate, type DeliveryUpdate } from "../lib/realtime/delivery";

export function OrderTrackingPage() {
  const { id } = useParams();
  const { t } = useTranslation();
  const { user } = useApp();
  const { getOrder } = useOrders();
  const order = getOrder(id ?? "");
  const [tracking, setTracking] = useState<DeliveryTracking | null>(null);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [showEventForm, setShowEventForm] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [gpsSharing, setGpsSharing] = useState(false);
  const [liveLocation, setLiveLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [liveConnected, setLiveConnected] = useState(false);
  const deliverySocketRef = useRef<DeliverySocket | null>(null);
  const [updateForm, setUpdateForm] = useState({
    currentStatus: "",
    courier: "",
    trackingNumber: "",
    estimatedDelivery: "",
  });
  const [eventForm, setEventForm] = useState({
    status: "",
    location: "",
  });

  const canUpdate = user?.role === "farmer" || user?.role === "admin";

  const handleShareLocation = () => {
    if (!id || !canUpdate || !navigator.geolocation || !deliverySocketRef.current) return;

    setGpsSharing(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        deliverySocketRef.current?.broadcastGPS(id, lat, lng, position.coords.accuracy ?? undefined);
        setLiveLocation({ lat, lng });
        setGpsSharing(false);
        void deliverySocketRef.current?.broadcastStatus(id, "in_transit", `${lat.toFixed(5)}, ${lng.toFixed(5)}`, "Live GPS shared");
      },
      () => {
        setGpsSharing(false);
        alert(t("tracking.gpsDenied"));
      },
      { enableHighAccuracy: true, timeout: 15000 }
    );
  };

  useEffect(() => {
    if (!id || !apiConfigured()) return;
    void fetchDeliveryTracking(id).then(setTracking).catch(() => setTracking(null));
  }, [id]);

  // Set up real-time delivery tracking
  useEffect(() => {
    if (!id || !apiConfigured()) return;

    const token = tokenStore.getAccess();
    if (!token) return;

    const deliverySocket = new DeliverySocket(
      {
        onConnect: () => setLiveConnected(true),
        onDisconnect: () => setLiveConnected(false),
        onLocation: (update: DeliveryLocationUpdate) => {
          if (update.orderId === id) {
            setLiveLocation({
              lat: update.location.latitude,
              lng: update.location.longitude,
            });
          }
        },
        onUpdate: (update: DeliveryUpdate) => {
          if (update.orderId === id) {
            // Refresh tracking data when status updates arrive
            void fetchDeliveryTracking(id).then(setTracking).catch(() => {});
          }
        },
      },
      token
    );

    deliverySocket.subscribe(id);
    deliverySocketRef.current = deliverySocket;

    return () => {
      deliverySocket.disconnect();
      deliverySocketRef.current = null;
    };
  }, [id]);

  if (!order) {
    return <div className="container-app py-20 text-center text-ink-soft">{t("flow.none")}</div>;
  }

  const handleUpdateDelivery = async () => {
    if (!id || !apiConfigured()) return;
    
    setUpdating(true);
    try {
      const payload: any = {};
      if (updateForm.currentStatus) payload.currentStatus = updateForm.currentStatus;
      if (updateForm.courier) payload.courier = updateForm.courier;
      if (updateForm.trackingNumber) payload.trackingNumber = updateForm.trackingNumber;
      if (updateForm.estimatedDelivery) payload.estimatedDelivery = updateForm.estimatedDelivery;
      
      const updated = await updateDeliveryTracking(id, payload);
      setTracking(updated);
      setShowUpdateForm(false);
      setUpdateForm({ currentStatus: "", courier: "", trackingNumber: "", estimatedDelivery: "" });
    } catch (error) {
      console.error("Failed to update delivery:", error);
      alert(t("tracking.failedUpdate"));
    } finally {
      setUpdating(false);
    }
  };

  const handleAddEvent = async () => {
    if (!id || !apiConfigured() || !eventForm.status) return;
    
    setUpdating(true);
    try {
      const updated = await addDeliveryEvent(id, {
        status: eventForm.status,
        location: eventForm.location || undefined,
      });
      setTracking(updated);
      setShowEventForm(false);
      setEventForm({ status: "", location: "" });
    } catch (error) {
      console.error("Failed to add delivery event:", error);
      alert(t("tracking.failedEvent"));
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="container-app max-w-4xl py-8 sm:py-10">
      <Link to={`/orders/${order.id}`} className="inline-flex items-center gap-1 text-xs font-medium text-primary">
        ← {order.id}
      </Link>

      <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-secondary sm:text-xs">DIRECT FARM</p>
          <h1 className="mt-1 font-display text-2xl text-ink sm:text-3xl">{order.id}</h1>
          <p className="mt-1 text-sm text-ink-soft">
            {order.farmerName} · {t("flow.eta")} {order.eta}
          </p>
        </div>
        <Badge>{t(`flow.status.${order.status}`)}</Badge>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          <Card className="p-5">
            <OrderTimeline order={order} />
          </Card>

          {tracking && (
            <Card className="p-5 text-sm">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-secondary">{t("tracking.liveStatus")}</p>
              <p className="mt-1 font-medium capitalize text-ink">{tracking.currentStatus.replace("_", " ")}</p>
              {tracking.courier && (
                <p className="mt-1 text-ink-soft">
                  {tracking.courier}{tracking.trackingNumber ? ` · ${tracking.trackingNumber}` : ""}
                </p>
              )}
              {tracking.events.length > 0 && (
                <ul className="mt-3 space-y-2 border-t border-line pt-3 text-ink-soft">
                  {tracking.events.slice().reverse().map((event, index) => (
                    <li key={`${event.recordedAt}-${index}`}>
                      <span className="font-medium text-ink">{event.status.replace("_", " ")}</span>
                      {event.location ? ` · ${event.location}` : ""}
                      <span className="ml-2 text-xs text-muted">{formatDate(event.recordedAt)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          )}

          {canUpdate && apiConfigured() && (
            <Card className="p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm font-medium text-ink">{t("tracking.deliveryManagement")}</p>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant="ghost" onClick={() => setShowUpdateForm(!showUpdateForm)}>
                    {t("tracking.updateStatus")}
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setShowEventForm(!showEventForm)}>
                    {t("tracking.addEvent")}
                  </Button>
                </div>
              </div>

              {showUpdateForm && (
                <div className="mt-4 space-y-3 border-t border-line pt-4">
                  <Field label={t("tracking.deliveryStatus")}>
                    <select
                      className="w-full rounded-xl border border-line bg-card px-3 py-2 text-sm"
                      value={updateForm.currentStatus}
                      onChange={(e) => setUpdateForm({ ...updateForm, currentStatus: e.target.value })}
                    >
                      <option value="">{t("tracking.selectStatus")}</option>
                      <option value="pending">{t("tracking.statuses.pending")}</option>
                      <option value="picked">{t("tracking.statuses.picked")}</option>
                      <option value="in_transit">{t("tracking.statuses.in_transit")}</option>
                      <option value="delivered">{t("tracking.statuses.delivered")}</option>
                      <option value="delayed">{t("tracking.statuses.delayed")}</option>
                      <option value="returned">{t("tracking.statuses.returned")}</option>
                    </select>
                  </Field>
                  <Field label={t("tracking.courierName")}>
                    <Input
                      value={updateForm.courier}
                      onChange={(e) => setUpdateForm({ ...updateForm, courier: e.target.value })}
                      placeholder={t("tracking.courierPlaceholder")}
                    />
                  </Field>
                  <Field label={t("tracking.trackingNumber")}>
                    <Input
                      value={updateForm.trackingNumber}
                      onChange={(e) => setUpdateForm({ ...updateForm, trackingNumber: e.target.value })}
                      placeholder={t("tracking.trackingPlaceholder")}
                    />
                  </Field>
                  <Field label={t("tracking.estimatedDelivery")}>
                    <Input
                      type="datetime-local"
                      value={updateForm.estimatedDelivery}
                      onChange={(e) => setUpdateForm({ ...updateForm, estimatedDelivery: e.target.value })}
                    />
                  </Field>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => void handleUpdateDelivery()} disabled={updating}>
                      {updating ? t("tracking.updating") : t("tracking.updateDelivery")}
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setShowUpdateForm(false)} disabled={updating}>
                      {t("tracking.cancel")}
                    </Button>
                  </div>
                </div>
              )}

              {showEventForm && (
                <div className="mt-4 space-y-3 border-t border-line pt-4">
                  <Field label={t("tracking.eventStatus")}>
                    <Input
                      value={eventForm.status}
                      onChange={(e) => setEventForm({ ...eventForm, status: e.target.value })}
                      placeholder={t("tracking.eventPlaceholder")}
                    />
                  </Field>
                  <Field label={t("tracking.location")}>
                    <Input
                      value={eventForm.location}
                      onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                      placeholder={t("tracking.locationPlaceholder")}
                    />
                  </Field>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => void handleAddEvent()} disabled={updating || !eventForm.status}>
                      {updating ? t("tracking.adding") : t("tracking.addEventBtn")}
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setShowEventForm(false)} disabled={updating}>
                      {t("tracking.cancel")}
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          )}
        </div>

        <div className="space-y-4">
          <Card className="p-5 text-sm">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-secondary">{t("flow.shipTo")}</p>
            <p className="mt-2 font-medium text-ink">{order.shipping?.name ?? order.buyerName}</p>
            <p className="text-ink-soft">{order.address}</p>
            <p className="mt-3 font-display text-xl text-primary">{inr(order.total)}</p>
            <p className="mt-1 text-xs text-muted">{formatDate(order.placedAt)}</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
