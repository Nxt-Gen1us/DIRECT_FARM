import { useTranslation } from "react-i18next";
import {
  CalendarRange,
  FileSignature,
  Gavel,
  Snowflake,
  Tractor,
  UserRound,
  Users,
  Warehouse,
} from "lucide-react";
import { PremiumShell } from "../../components/premium/PremiumShell";
import { ModuleCard } from "../../components/premium/ModuleCard";
import { auctions, contracts, experts, machines, storeBays } from "../../data/premium";

export function PremiumHubPage() {
  const { t } = useTranslation();
  const liveLots = auctions.filter((a) => a.status === "live").length;
  const coldFree = storeBays.filter((s) => s.kind === "cold").reduce((s, b) => s + b.freeT, 0);

  const doors = [
    { to: "/premium/auction", icon: Gavel, title: t("plus.auction"), body: t("plus.auctionLede"), stat: `${liveLots} ${t("plus.liveNow")}` },
    { to: "/premium/community", icon: Users, title: t("plus.circle"), body: t("plus.circleLede") },
    { to: "/premium/experts", icon: UserRound, title: t("plus.experts"), body: t("plus.expertsLede"), stat: String(experts.length) },
    { to: "/premium/forecast", icon: CalendarRange, title: t("plus.forecast"), body: t("plus.forecastLede") },
    { to: "/premium/contracts", icon: FileSignature, title: t("plus.contracts"), body: t("plus.contractsLede"), stat: String(contracts.length) },
    { to: "/premium/equipment", icon: Tractor, title: t("plus.equipment"), body: t("plus.equipLede"), stat: String(machines.filter((m) => m.available).length) },
    { to: "/premium/warehouse", icon: Warehouse, title: t("plus.warehouse"), body: t("plus.whLede") },
    { to: "/premium/cold", icon: Snowflake, title: t("plus.cold"), body: t("plus.coldLede"), stat: `${coldFree} t` },
  ];

  return (
    <PremiumShell title={t("plus.title")} lede={t("plus.lede")}>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {doors.map((d) => (
          <ModuleCard key={d.to} {...d} />
        ))}
      </div>
    </PremiumShell>
  );
}
