import { useMemo, useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { ImagePicker, VideoPicker } from "./MediaPicker";
import { LotQr } from "./LotQr";
import { Button, Checkbox, Field, Input, Select, Textarea } from "../ui";
import {
  PACK_IDS,
  UNITS,
  defaultPackFor,
  freshnessOf,
  makeQrCode,
  validateDraft,
  type DraftErrors,
  type PackId,
  type ProductDraft,
} from "../../lib/inventory";
import type { ProductCategory } from "../../lib/types";
import { categoryIds } from "../../lib/market";
import { cn } from "../../lib/cn";
import { formatUnit } from "../../lib/format";

export function ProductForm({
  initial,
  submitLabel,
  onSubmit,
}: {
  initial: ProductDraft;
  submitLabel: string;
  onSubmit: (draft: ProductDraft) => void;
}) {
  const { t } = useTranslation();
  const [draft, setDraft] = useState<ProductDraft>(initial);
  const [errors, setErrors] = useState<DraftErrors>({});

  const patch = (partial: Partial<ProductDraft>) => {
    setDraft((d) => ({ ...d, ...partial }));
  };

  const previewQr = useMemo(
    () => makeQrCode(draft.name || "LOT", draft.harvestedOn),
    [draft.name, draft.harvestedOn],
  );
  const fresh = freshnessOf({ harvestedOn: draft.harvestedOn || "2026-04-13" });

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const next = validateDraft(draft);
    setErrors(next);
    if (Object.keys(next).length) return;
    onSubmit(draft);
  };

  const err = (key: keyof ProductDraft) =>
    errors[key] ? t(`manage.errors.${errors[key]}`) : undefined;

  return (
    <form className="grid gap-8 lg:grid-cols-[1fr_280px]" onSubmit={submit} noValidate>
      <div className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={t("manage.name")} error={err("name")}>
            <Input
              value={draft.name}
              onChange={(e) => patch({ name: e.target.value })}
              required
              minLength={3}
              aria-invalid={Boolean(errors.name)}
            />
          </Field>
          <Field label={t("manage.variety")} error={err("variety")}>
            <Input
              value={draft.variety}
              onChange={(e) => patch({ variety: e.target.value })}
              required
              aria-invalid={Boolean(errors.variety)}
            />
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={t("manage.category")}>
            <Select
              value={draft.category}
              onChange={(e) => {
                const category = e.target.value as ProductCategory;
                patch({ category, packaging: defaultPackFor(category) });
              }}
            >
              {categoryIds.map((c) => (
                <option key={c} value={c}>
                  {t(`categories.${c}`)}
                </option>
              ))}
            </Select>
          </Field>
          <Field label={t("manage.origin")} error={err("origin")}>
            <Input
              value={draft.origin}
              onChange={(e) => patch({ origin: e.target.value })}
              required
            />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Field label={t("manage.price")} error={err("price")}>
            <Input
              type="number"
              min={1}
              step={1}
              value={draft.price}
              onChange={(e) => patch({ price: e.target.value })}
              required
            />
          </Field>
          <Field label={t("manage.unit")}>
            <Select value={draft.unit} onChange={(e) => patch({ unit: e.target.value })}>
              {UNITS.map((u) => (
                <option key={u} value={u}>
                  {formatUnit(u)}
                </option>
              ))}
            </Select>
          </Field>
          <Field label={t("manage.qty")} error={err("stock")}>
            <Input
              type="number"
              min={0}
              value={draft.stock}
              onChange={(e) => patch({ stock: e.target.value })}
              required
            />
          </Field>
          <Field label={t("manage.minQty")} error={err("minQty")}>
            <Input
              type="number"
              min={1}
              value={draft.minQty}
              onChange={(e) => patch({ minQty: e.target.value })}
              required
            />
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={t("manage.harvest")} error={err("harvestedOn")}>
            <Input
              type="date"
              value={draft.harvestedOn}
              onChange={(e) => patch({ harvestedOn: e.target.value })}
              required
            />
          </Field>
          <Field label={t("manage.freshness")}>
            <div className="rounded-2xl border border-line bg-canvas px-4 py-2.5 text-sm">
              {t(`market.freshness.${fresh}`)}
            </div>
          </Field>
        </div>

        <Field label={t("manage.packaging")}>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {PACK_IDS.map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => patch({ packaging: id as PackId })}
                className={cn(
                  "rounded-2xl border px-3 py-2 text-left text-sm",
                  draft.packaging === id
                    ? "border-primary bg-primary-soft text-primary"
                    : "border-line bg-canvas",
                )}
              >
                {t(`detail.pack.${id}`)}
              </button>
            ))}
          </div>
        </Field>

        <Checkbox
          label={t("common.organic")}
          checked={draft.organic}
          onChange={(e) => patch({ organic: e.target.checked })}
        />

        <Field label={t("manage.description")} error={err("description")}>
          <Textarea
            value={draft.description}
            onChange={(e) => patch({ description: e.target.value })}
            rows={4}
            required
          />
        </Field>

        <ImagePicker
          value={draft.image}
          extras={draft.images}
          onChange={(image, extras) => patch({ image, images: extras })}
        />
        <VideoPicker value={draft.video} onChange={(video) => patch({ video })} />
      </div>

      <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-[1.25rem] border border-line/70 bg-card p-5 text-center">
          <p className="text-xs font-medium uppercase tracking-wider text-muted">
            {t("manage.qr")}
          </p>
          <div className="mt-3 flex justify-center">
            <LotQr code={previewQr} />
          </div>
          <p className="mt-2 text-[11px] text-muted">{t("manage.qrHint")}</p>
        </div>
        <Button type="submit" className="w-full">
          {submitLabel}
        </Button>
      </aside>
    </form>
  );
}
