import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Camera, Image as ImageIcon, CheckCircle2 } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { useInventory } from "../../app/providers/InventoryProvider";
import { draftFromProduct, emptyDraft, type ProductDraft } from "../../lib/inventory";
import { clsx } from "clsx";
import { formatUnit } from "../../lib/format";

const units = [
  { value: "KG", key: "farmerProductWizard.units.kg" },
  { value: "Tonne", key: "farmerProductWizard.units.tonne" },
  { value: "Quintal", key: "farmerProductWizard.units.quintal" },
  { value: "Piece", key: "farmerProductWizard.units.piece" },
  { value: "Dozen", key: "farmerProductWizard.units.dozen" },
] as const;

const harvestOptions = [
  { value: "Today", key: "farmerProductWizard.harvestOptions.today" },
  { value: "Yesterday", key: "farmerProductWizard.harvestOptions.yesterday" },
  { value: "2 Days Ago", key: "farmerProductWizard.harvestOptions.twoDays" },
  { value: "This Week", key: "farmerProductWizard.harvestOptions.week" },
] as const;

export function ProductEditorPage() {
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { getListing, createListing, updateListing } = useInventory();
  
  const existing = id && id !== "new" ? getListing(id) : undefined;
  const isEdit = Boolean(existing);
  
  const [step, setStep] = useState(1);
  const totalSteps = 7;
  const [draft, setDraft] = useState<ProductDraft>(
    existing ? draftFromProduct(existing) : emptyDraft()
  );
  
  const [deliveryMethod, setDeliveryMethod] = useState<string>("self");

  const nextStep = () => setStep((s) => Math.min(s + 1, totalSteps));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));
  
  const handleSave = async () => {
    // Append delivery to origin or handle appropriately based on true ProductDraft capabilities
    const finalDraft = {
      ...draft,
      origin: `${draft.origin} | ${t("farmerProductWizard.deliveryField")}: ${t(`farmerProductWizard.deliveryOptions.${deliveryMethod}`)}`,
    };
    
    if (existing) {
      await updateListing(existing.id, finalDraft);
    } else {
      await createListing(finalDraft);
    }
    navigate("/farmer/products");
  };

  const updateField = (field: keyof ProductDraft, value: any) => {
    setDraft((prev) => ({ ...prev, [field]: value }));
  };

  if (id && id !== "new" && !existing) {
    return <div className="p-8 text-center text-ink-soft">{t("manage.missing")}</div>;
  }

  return (
    <div className="max-w-3xl mx-auto py-4 sm:py-8">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex justify-between text-sm font-medium text-ink-soft mb-2">
          <span>{t(`farmerProductWizard.step${Math.min(step, 6)}Title`)}</span>
          <span>{step} / {totalSteps}</span>
        </div>
        <div className="h-2 bg-canvas-soft rounded-full overflow-hidden flex">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div 
              key={i} 
              className={clsx(
                "h-full flex-1 border-r border-canvas last:border-0 transition-colors duration-300",
                i < step ? "bg-primary" : "bg-transparent"
              )}
            />
          ))}
        </div>
      </div>

      <Card className="p-6 sm:p-10 min-h-[400px] flex flex-col">
        {/* Step 1: Photo */}
        {step === 1 && (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <h2 className="text-2xl sm:text-3xl font-display mb-8">{t("farmerProductWizard.step1Question")}</h2>
            
            {draft.image ? (
              <div className="relative group">
                <img src={draft.image} alt={t("farmerProductWizard.cropAlt")} className="w-48 h-48 object-cover rounded-2xl shadow-sm" />
                <button 
                  onClick={() => updateField("image", "")}
                  className="absolute inset-0 bg-ink/50 text-white rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                >
                  {t("farmerProductWizard.change")}
                </button>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  variant="ghost" 
                  className="h-32 w-32 flex-col gap-2 border-2 border-line hover:border-primary/50"
                  onClick={() => updateField("image", "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&q=80&w=800")}
                >
                  <Camera size={32} />
                  <span>{t("farmerProductWizard.camera")}</span>
                </Button>
                <Button 
                  size="lg" 
                  variant="ghost" 
                  className="h-32 w-32 flex-col gap-2 border-2 border-line hover:border-primary/50"
                  onClick={() => updateField("image", "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&q=80&w=800")}
                >
                  <ImageIcon size={32} />
                  <span>{t("farmerProductWizard.gallery")}</span>
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Product Name */}
        {step === 2 && (
          <div className="flex-1 flex flex-col justify-center">
            <h2 className="text-2xl sm:text-3xl font-display mb-8 text-center">{t("farmerProductWizard.step2Question")}</h2>
            <input 
              type="text" 
              value={draft.name}
              onChange={(e) => updateField("name", e.target.value)}
              placeholder={t("farmerProductWizard.productPlaceholder")}
              className="w-full text-center text-3xl sm:text-4xl font-display bg-transparent border-b-2 border-line focus:border-primary outline-none py-4 transition-colors"
              autoFocus
            />
          </div>
        )}

        {/* Step 3: Quantity */}
        {step === 3 && (
          <div className="flex-1 flex flex-col justify-center">
            <h2 className="text-2xl sm:text-3xl font-display mb-8 text-center">{t("farmerProductWizard.step3Question")}</h2>
            <div className="flex items-center justify-center gap-4">
              <input 
                type="number" 
                value={draft.stock || ""}
                onChange={(e) => updateField("stock", parseInt(e.target.value) || 0)}
                placeholder="0"
                className="w-32 text-center text-4xl sm:text-5xl font-display bg-transparent border-b-2 border-line focus:border-primary outline-none py-4 transition-colors"
                autoFocus
              />
              <select 
                value={draft.unit}
                onChange={(e) => updateField("unit", e.target.value)}
                className="text-2xl sm:text-3xl font-display bg-transparent border-b-2 border-line focus:border-primary outline-none py-4 text-primary cursor-pointer"
              >
                {units.map((unit) => <option key={unit.value} value={unit.value}>{t(unit.key)}</option>)}
              </select>
            </div>
          </div>
        )}

        {/* Step 4: Price */}
        {step === 4 && (
          <div className="flex-1 flex flex-col justify-center items-center">
            <h2 className="text-2xl sm:text-3xl font-display mb-8 text-center">{t("farmerProductWizard.step4Question")}</h2>
            
            <div className="flex items-center justify-center gap-2 mb-8">
              <span className="text-4xl sm:text-5xl font-display text-ink-soft">₹</span>
              <input 
                type="number" 
                value={draft.price || ""}
                onChange={(e) => updateField("price", parseInt(e.target.value) || 0)}
                placeholder="0"
                className="w-40 text-center text-4xl sm:text-5xl font-display bg-transparent border-b-2 border-line focus:border-primary outline-none py-4 transition-colors"
                autoFocus
              />
              <span className="text-2xl font-display text-ink-soft mt-4">/ {formatUnit(draft.unit)}</span>
            </div>
            
          </div>
        )}

        {/* Step 5: Harvest Date */}
        {step === 5 && (
          <div className="flex-1 flex flex-col justify-center">
            <h2 className="text-2xl sm:text-3xl font-display mb-8 text-center">{t("farmerProductWizard.step5Question")}</h2>
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
              {harvestOptions.map(({ value, key }) => (
                <Button 
                  key={value}
                  variant={draft.origin === value ? "primary" : "ghost"}
                  size="lg"
                  onClick={() => updateField("origin", value)}
                  className={`h-16 text-lg border-2 ${draft.origin === value ? 'border-primary' : 'border-line hover:border-primary/50'}`}
                >
                  {t(key)}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Step 6: Delivery */}
        {step === 6 && (
          <div className="flex-1 flex flex-col justify-center">
            <h2 className="text-2xl sm:text-3xl font-display mb-8 text-center">{t("farmerProductWizard.step6Question")}</h2>
            <div className="flex flex-col gap-4 max-w-md mx-auto w-full">
              {[
                { id: "self", label: t("farmerProductWizard.deliverySelf") },
                { id: "pickup", label: t("farmerProductWizard.deliveryPickup") },
                { id: "service", label: t("farmerProductWizard.deliveryService") },
              ].map((opt) => (
                <Button 
                  key={opt.id}
                  variant={deliveryMethod === opt.id ? "primary" : "ghost"}
                  size="lg"
                  onClick={() => setDeliveryMethod(opt.id)}
                  className={`h-16 text-lg justify-start px-6 border-2 ${deliveryMethod === opt.id ? 'border-primary' : 'border-line hover:border-primary/50'}`}
                >
                  {opt.label}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Step 7: Preview & Confirm */}
        {step === 7 && (
          <div className="flex-1 flex flex-col">
            <h2 className="text-2xl sm:text-3xl font-display mb-8 text-center">{t("farmerProductWizard.step7Title")}</h2>
            
            <div className="bg-canvas rounded-2xl p-6 border border-line shadow-sm max-w-md mx-auto w-full">
              <div className="flex gap-4 items-center mb-6">
                <img src={draft.image || "/images/placeholder.jpg"} alt={t("farmerProductWizard.previewAlt")} className="w-24 h-24 rounded-xl object-cover" />
                <div>
                  <h3 className="font-display text-xl">{draft.name || t("farmerProductWizard.unnamed")}</h3>
                  <p className="text-primary font-bold text-lg mt-1">₹{draft.price} / {formatUnit(draft.unit)}</p>
                </div>
              </div>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between border-b border-line pb-2">
                  <span className="text-muted">{t("farmerProductWizard.quantityAvailable")}</span>
                  <span className="font-medium">{draft.stock} {formatUnit(draft.unit)}</span>
                </div>
                <div className="flex justify-between border-b border-line pb-2">
                  <span className="text-muted">{t("farmerProductWizard.harvested")}</span>
                  <span className="font-medium">
                    {harvestOptions.find((option) => option.value === draft.origin)
                      ? t(harvestOptions.find((option) => option.value === draft.origin)!.key)
                      : draft.origin || t("farmerProductWizard.notSpecified")}
                  </span>
                </div>
                <div className="flex justify-between pb-2">
                  <span className="text-muted">{t("farmerProductWizard.delivery")}</span>
                  <span className="font-medium">{t(`farmerProductWizard.deliveryOptions.${deliveryMethod}`)}</span>
                </div>
              </div>
            </div>
            
            <div className="mt-8 flex items-center justify-center gap-2 text-nature font-medium">
              <CheckCircle2 size={20} />
              {t("farmerProductWizard.readyToSell")}
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="mt-8 flex justify-between pt-6 border-t border-line/70">
          {step > 1 ? (
            <Button variant="ghost" onClick={prevStep}>
              {t("farmerProductWizard.back")}
            </Button>
          ) : (
            <Button variant="ghost" onClick={() => navigate("/farmer/products")}>
              {t("farmerProductWizard.cancel")}
            </Button>
          )}
          
          {step < totalSteps ? (
            <Button onClick={nextStep} disabled={
              (step === 1 && !draft.image) ||
              (step === 2 && !draft.name) ||
              (step === 3 && !draft.stock) ||
              (step === 4 && !draft.price) ||
              (step === 5 && !draft.origin) ||
              (step === 6 && !deliveryMethod)
            }>
              {t("farmerProductWizard.next")}
            </Button>
          ) : (
            <Button onClick={handleSave}>
              {t("farmerProductWizard.putForSale")}
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
