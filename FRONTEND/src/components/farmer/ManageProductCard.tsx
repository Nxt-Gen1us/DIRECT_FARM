import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Pencil, QrCode, Trash2 } from "lucide-react";
import type { ManagedProduct } from "../../lib/inventory";
import { freshnessOf } from "../../lib/inventory";
import { formatDate, formatUnit, inr } from "../../lib/format";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";

export function ManageProductCard({
  product,
  onDelete,
  onToggle,
}: {
  product: ManagedProduct;
  onDelete: () => void;
  onToggle: () => void;
}) {
  const { t } = useTranslation();
  const fresh = freshnessOf(product);

  return (
    <article className="overflow-hidden rounded-[1.25rem] border border-line/70 bg-card shadow-[0_10px_30px_-16px_rgb(36_22_16_/_0.16)]">
      <div className="relative">
        <img src={product.image} alt="" className="h-36 w-full object-cover" />
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          <Badge tone={product.active ? "nature" : "muted"}>
            {product.active ? t("manage.live") : t("manage.hidden")}
          </Badge>
          <Badge tone="secondary">{t(`market.freshness.${fresh}`)}</Badge>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-display text-xl leading-snug">{product.name}</h3>
        <p className="text-xs text-muted">
          {product.variety} · {t(`detail.pack.${product.packaging}`)}
        </p>
        <div className="mt-3 flex items-end justify-between">
          <div>
            <p className="font-display text-2xl text-primary">{inr(product.price)}</p>
            <p className="text-[11px] text-muted">
              {product.stock} {formatUnit(product.unit)} · {t("manage.harvest")} {formatDate(product.harvestedOn)}
            </p>
          </div>
          <p className="font-mono text-[10px] text-ink-soft">
            <QrCode size={10} className="mr-1 inline" />
            {product.qrCode}
          </p>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link to={`/farmer/products/${product.id}/edit`}>
            <Button size="sm" variant="ghost">
              <Pencil size={12} /> {t("manage.edit")}
            </Button>
          </Link>
          <Button size="sm" variant="cream" onClick={onToggle}>
            {product.active ? t("manage.hide") : t("manage.show")}
          </Button>
          <Button size="sm" variant="ghost" className="text-primary" onClick={onDelete}>
            <Trash2 size={12} /> {t("manage.delete")}
          </Button>
        </div>
      </div>
    </article>
  );
}
