import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { farmerOrders } from "../../data/farmerDesk";
import { formatUnit, inr } from "../../lib/format";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import type { OrderStatus } from "../../lib/types";
import { MapPin, CheckCircle2 } from "lucide-react";

export function FarmerOrdersPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<OrderStatus>("pending");

  const filteredOrders = useMemo(() => {
    return farmerOrders.filter(o => {
      if (activeTab === "pending") return o.status === "pending";
      if (activeTab === "confirmed") return o.status === "confirmed";
      if (activeTab === "shipped") return o.status === "shipped";
      if (activeTab === "delivered") return o.status === "delivered";
      return false;
    });
  }, [activeTab]);

  return (
    <div className="space-y-6 sm:space-y-8">
      <h1 className="text-2xl sm:text-3xl font-display text-ink">{t("farmerNav.orders")}</h1>

      <Card className="p-4 sm:p-6 min-h-[500px]">
        {/* Tabs */}
        <div className="flex overflow-x-auto gap-4 border-b border-line/70 pb-4 mb-6">
          <TabButton 
            active={activeTab === "pending"} 
            onClick={() => setActiveTab("pending")} 
            label={t("farmerOrders.tabNew")} 
            count={farmerOrders.filter(o => o.status === "pending").length} 
          />
          <TabButton 
            active={activeTab === "confirmed"} 
            onClick={() => setActiveTab("confirmed")} 
            label={t("farmerOrders.tabPrepare")} 
            count={farmerOrders.filter(o => o.status === "confirmed").length} 
          />
          <TabButton 
            active={activeTab === "shipped"} 
            onClick={() => setActiveTab("shipped")} 
            label={t("farmerOrders.tabTransit")} 
            count={farmerOrders.filter(o => o.status === "shipped").length} 
          />
          <TabButton 
            active={activeTab === "delivered"} 
            onClick={() => setActiveTab("delivered")} 
            label={t("farmerOrders.tabCompleted")} 
            count={farmerOrders.filter(o => o.status === "delivered").length} 
          />
        </div>

        {/* List */}
        {filteredOrders.length === 0 ? (
          <div className="text-center text-muted py-12">
            {t("farmerOrders.noOrdersInSection")}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map(o => (
              <div key={o.id} className="border border-line/70 rounded-2xl p-4 sm:p-6 hover:border-primary/30 transition-colors">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <div>
                    <h3 className="font-display text-xl mb-1">{o.items[0]?.name || t("farmerOrders.orderFallback")}</h3>
                    <div className="text-sm text-ink-soft space-y-1">
                      <p>
                        <span className="font-medium text-ink">{t("farmerOrders.quantity")}:</span> {o.items[0]?.qty} {o.items[0]?.unit && formatUnit(o.items[0].unit)}
                      </p>
                      <p>
                        <span className="font-medium text-ink">{t("farmerOrders.customer")}:</span> {o.buyerName}
                      </p>
                      <p className="flex items-center gap-1 text-muted">
                        <MapPin size={14} /> {t("farmerOrders.awayKm", { distance: Math.floor(Math.random() * 10) + 1 })}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col md:items-end gap-2">
                    <span className="font-display text-2xl text-primary">{inr(o.total)}</span>
                    <Badge tone={activeTab === "pending" ? "secondary" : "nature"}>
                      {t(`orders.status.${o.status}`)}
                    </Badge>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-line/50">
                  {activeTab === "pending" && (
                    <Button>{t("farmerOrders.acceptPrepare")}</Button>
                  )}
                  {activeTab === "confirmed" && (
                    <Button variant="primary">{t("farmerOrders.readyDispatch")}</Button>
                  )}
                  <Link to={`/farmer/orders/${o.id}`}>
                    <Button variant="ghost">{t("farmerOrders.viewDetails")}</Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

function TabButton({ active, onClick, label, count }: { active: boolean, onClick: () => void, label: string, count: number }) {
  return (
    <button 
      onClick={onClick}
      className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 ${
        active ? "bg-primary text-accent" : "text-ink-soft hover:bg-canvas-soft"
      }`}
    >
      {label}
      <span className={`px-2 py-0.5 rounded-full text-xs ${active ? "bg-accent/20" : "bg-line"}`}>
        {count}
      </span>
    </button>
  );
}
