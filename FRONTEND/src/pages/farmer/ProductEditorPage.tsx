import { Link, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useInventory } from "../../app/providers/InventoryProvider";
import { ProductForm } from "../../components/farmer/ProductForm";
import { draftFromProduct, emptyDraft } from "../../lib/inventory";

export function ProductEditorPage() {
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { getListing, createListing, updateListing } = useInventory();
  const existing = id && id !== "new" ? getListing(id) : undefined;
  const isEdit = Boolean(existing);

  if (id && id !== "new" && !existing) {
    return (
      <div className="container-app py-20 text-center text-ink-soft">{t("manage.missing")}</div>
    );
  }

  return (
    <div>
      <section className="border-b border-line bg-canvas">
        <div className="container-app py-8">
          <Link to="/farmer/products" className="text-xs text-primary">
            ← {t("manage.title")}
          </Link>
          <h1 className="mt-2 font-display text-4xl text-ink">
            {isEdit ? t("manage.editTitle") : t("manage.addTitle")}
          </h1>
          <p className="mt-2 text-sm text-ink-soft">
            {isEdit ? existing?.name : t("manage.addHint")}
          </p>
        </div>
      </section>
      <div className="container-app py-8">
        <ProductForm
          initial={existing ? draftFromProduct(existing) : emptyDraft()}
          submitLabel={isEdit ? t("manage.save") : t("manage.create")}
          onSubmit={(draft) => {
            if (existing) updateListing(existing.id, draft);
            else createListing(draft);
            navigate("/farmer/products");
          }}
        />
      </div>
    </div>
  );
}
