import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { farmers } from "../../data/farmers";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { apiConfigured } from "../../lib/api";
import { fetchAdminFarmers, setFarmerVerification, type AdminFarmer } from "../../lib/api/admin";

const KEY = "fc-admin-verify";

function readMap(): Record<string, "approved" | "held"> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Record<string, "approved" | "held">) : {};
  } catch {
    return {};
  }
}

type FarmerQueueItem = {
  id: string;
  farmName: string;
  farmerName: string;
  location: string;
  acres?: number;
  certifications?: string[];
  cover?: string;
  verificationStatus: "pending" | "verified" | "rejected";
  isBackend: boolean;
};

export function AdminVerifyPage() {
  const { t } = useTranslation();
  const [map, setMap] = useState<Record<string, "approved" | "held">>(readMap);
  const [backendFarmers, setBackendFarmers] = useState<AdminFarmer[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    if (!apiConfigured()) {
      setLoading(false);
      return;
    }
    void fetchAdminFarmers("pending")
      .then(setBackendFarmers)
      .catch(() => setBackendFarmers([]))
      .finally(() => setLoading(false));
  }, []);

  const queue: FarmerQueueItem[] = apiConfigured()
    ? backendFarmers.map((f) => ({
        id: f._id,
        farmName: f.farmName,
        farmerName: f.user ? `${f.user.firstName || ""} ${f.user.lastName || ""}`.trim() : t("adminUi.unknown"),
        location: [f.location?.city, f.location?.state].filter(Boolean).join(", ") || t("adminUi.unknownLocation"),
        verificationStatus: f.verificationStatus,
        isBackend: true,
      }))
    : farmers
        .filter((f) => f.certifications.length === 0 || map[f.id])
        .map((f) => ({
          id: f.id,
          farmName: f.farmName,
          farmerName: f.name,
          location: `${f.district}, ${f.state}`,
          acres: f.acres,
          certifications: f.certifications,
          cover: f.cover,
          verificationStatus: map[f.id] === "approved" ? "verified" : map[f.id] === "held" ? "rejected" : "pending",
          isBackend: false,
        }));

  const setState = (id: string, state: "approved" | "held") => {
    const next = { ...map, [id]: state };
    setMap(next);
    window.localStorage.setItem(KEY, JSON.stringify(next));
  };

  const handleVerification = async (farmerId: string, status: "verified" | "rejected") => {
    if (!apiConfigured()) return;
    
    setUpdating(farmerId);
    try {
      await setFarmerVerification(farmerId, status);
      // Remove from list after successful verification
      setBackendFarmers((prev) => prev.filter((f) => f._id !== farmerId));
    } catch (error) {
      console.error("Failed to update verification:", error);
      alert(t("adminUi.verificationUpdateFailed"));
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div>
      <h2 className="font-display text-3xl">{t("desk.verify")}</h2>
      <p className="mt-1 text-sm text-ink-soft">{t("desk.verifyLede")}</p>
      
      {loading && (
        <div className="mt-6 text-center text-ink-soft">{t("desk.loadingFarmers")}</div>
      )}
      
      {!loading && queue.length === 0 && (
        <div className="mt-6 text-center text-ink-soft">{t("desk.noPendingFarmers")}</div>
      )}
      
      <div className="mt-6 space-y-3">
        {queue.map((f) => {
          const decided = f.isBackend ? null : (map[f.id] ?? null);
          const pending = f.verificationStatus === "pending" && !decided;
          const isUpdating = updating === f.id;
          
          return (
            <Card key={f.id} className="flex flex-wrap items-center gap-4 p-4">
              {f.cover && (
                <img src={f.cover} alt="" className="h-16 w-24 rounded-xl object-cover" />
              )}
              <div className="min-w-0 flex-1">
                <p className="font-medium">{f.farmName}</p>
                <p className="text-xs text-muted">
                  {f.farmerName} · {f.location}
                  {f.acres && ` · ${f.acres} ${t("adminUi.acres")}`}
                </p>
                {f.certifications && (
                  <p className="mt-1 text-xs text-ink-soft">{f.certifications.join(" · ")}</p>
                )}
              </div>
              <Badge tone={
                f.verificationStatus === "verified" || decided === "approved" ? "nature" : 
                f.verificationStatus === "rejected" || decided === "held" ? "secondary" : 
                "muted"
              }>
                {t(`desk.vstatus.${f.verificationStatus === "verified" || decided === "approved" ? "approved" : f.verificationStatus === "rejected" || decided === "held" ? "held" : "pending"}`)}
              </Badge>
              
              {f.isBackend ? (
                <>
                  <Button 
                    size="sm" 
                    disabled={!pending || isUpdating} 
                    onClick={() => void handleVerification(f.id, "verified")}
                  >
                    {isUpdating ? "..." : t("desk.approve")}
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    disabled={!pending || isUpdating} 
                    onClick={() => void handleVerification(f.id, "rejected")}
                  >
                    {t("desk.hold")}
                  </Button>
                </>
              ) : (
                <>
                  <Button size="sm" disabled={!pending} onClick={() => setState(f.id, "approved")}>
                    {t("desk.approve")}
                  </Button>
                  <Button size="sm" variant="ghost" disabled={!pending} onClick={() => setState(f.id, "held")}>
                    {t("desk.hold")}
                  </Button>
                </>
              )}
              
              <Link to={`/farmers/${f.id}`} className="text-xs text-primary">
                {t("desk.openFarm")}
              </Link>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
