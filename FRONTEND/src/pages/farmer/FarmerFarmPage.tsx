import { useTranslation } from "react-i18next";
import { CheckCircle2, MapPin, Leaf, ShieldCheck, Camera, BadgeCheck } from "lucide-react";
import { farmers } from "../../data/farmers";
import { FARMER_ID } from "../../data/farmerDesk";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";

export function FarmerFarmPage() {
  const { t } = useTranslation();
  const farmer = farmers.find((f) => f.id === FARMER_ID) ?? farmers[0];

  return (
    <div className="space-y-6 sm:space-y-8 max-w-4xl">
      <h1 className="text-2xl sm:text-3xl font-display text-ink">{t("farmerProfile.title")}</h1>

      {/* Profile Header */}
      <Card className="p-6 sm:p-8 flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
        <div className="relative group">
          <img 
            src={farmer.avatar || "/images/avatar-ramesh.jpg"} 
            alt={farmer.name}
            className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover shadow-sm border-4 border-canvas"
          />
          <button className="absolute inset-0 bg-ink/50 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
            <Camera size={24} />
          </button>
        </div>
        
        <div className="flex-1 space-y-3">
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            <h2 className="text-3xl font-display">{farmer.name}</h2>
            {farmer.certifications.length > 0 && (
              <span className="inline-flex items-center gap-1 text-sm font-medium text-nature bg-nature/10 px-3 py-1 rounded-full">
                <CheckCircle2 size={16} />
                {t("farmerProfile.verifiedBadge")}
              </span>
            )}
          </div>
          <p className="flex items-center justify-center md:justify-start gap-1.5 text-muted">
            <MapPin size={18} /> {farmer.village}, {farmer.district}
          </p>
          <p className="flex items-center justify-center md:justify-start gap-1.5 text-muted">
            <Leaf size={18} /> {farmer.specialty}
          </p>
        </div>
        
        <div>
          <Button variant="ghost">{t("farmerProfile.edit")}</Button>
        </div>
      </Card>

      {/* Farm Details */}
      <div className="grid sm:grid-cols-2 gap-6">
        <Card className="p-6 space-y-4">
          <h3 className="text-xl font-display">{t("farmerProfile.description")}</h3>
          <p className="text-ink-soft leading-relaxed">
            {farmer.bio || t("farmerProfile.bioFallback")}
          </p>
          <div className="pt-4 border-t border-line/70 flex flex-wrap gap-2">
            {farmer.certifications?.map((p: string) => (
              <span key={p} className="px-3 py-1 bg-canvas-soft rounded-lg text-sm text-ink-soft">
                {p}
              </span>
            ))}
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2 text-nature mb-2">
            <ShieldCheck size={24} />
            <h3 className="text-xl font-display text-ink">{t("farmerProfile.certifications")}</h3>
          </div>
          {farmer.certifications && farmer.certifications.length > 0 ? (
            <ul className="space-y-3">
              {farmer.certifications.map(cert => (
                <li key={cert} className="flex items-center gap-3 bg-canvas-soft p-3 rounded-xl">
                  <div className="w-10 h-10 rounded-full bg-nature/20 flex items-center justify-center text-nature">
                    <BadgeCheck size={18} />
                  </div>
                  <span className="font-medium text-ink">{cert}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted text-sm">{t("farmerProfile.noCertifications")}</p>
          )}
          <Button variant="ghost" className="w-full mt-4">{t("farmerProfile.addCertification")}</Button>
        </Card>
      </div>
    </div>
  );
}
