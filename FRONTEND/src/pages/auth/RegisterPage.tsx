import { useMemo, useState, type FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FileText, ShieldAlert, Trash2 } from "lucide-react";
import {
  AuthShell,
  PasswordField,
  PasswordMeter,
  PathSelect,
  StepBar,
  type StepDef,
} from "../../components/auth";
import { Button, Field, Input, Select } from "../../components/ui";
import { useApp } from "../../app/providers/AppProviders";
import { roleHome } from "../../config/roles";
import {
  emptyDraft,
  submitRegistration,
  validateAccountStep,
  validateDocsStep,
  validateFarmStep,
  validatePlaceStep,
  type RegisterDraft,
  type RegisterPath,
} from "../../lib/register";
import {
  allowedDocTypes,
  maxDocBytes,
  validateFile,
  type FieldErrorKey,
  type FieldErrors,
  type RegisterDoc,
} from "../../lib/validation";
import { cn } from "../../lib/cn";

const STATES = ["GJ", "MH", "PB", "TN", "MP", "AP", "KA", "RJ", "UP", "KL", "HR", "WB", "OTHER"] as const;
const CROPS = ["vegetables", "fruits", "grains", "spices", "dairy", "pulses"] as const;
const DOC_KINDS: RegisterDoc["kind"][] = ["id", "land", "organic", "other"];

function errLabel(t: (k: string) => string, key?: FieldErrorKey) {
  return key ? t(`register.errors.${key}`) : undefined;
}

export function RegisterPage() {
  const { t } = useTranslation();
  const { login } = useApp();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const startPath: RegisterPath = params.get("role") === "farmer" ? "farmer" : "customer";
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<RegisterDraft>(() => emptyDraft(startPath));
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState("");
  const [pending, setPending] = useState(false);

  const steps: StepDef[] = useMemo(() => {
    const base: StepDef[] = [
      { id: "path", labelKey: "register.steps.path" },
      { id: "account", labelKey: "register.steps.account" },
      { id: "place", labelKey: "register.steps.place" },
    ];
    if (draft.path === "farmer") {
      base.push(
        { id: "farm", labelKey: "register.steps.farm" },
        { id: "docs", labelKey: "register.steps.docs" },
      );
    }
    base.push({ id: "review", labelKey: "register.steps.review" });
    return base;
  }, [draft.path]);

  const patch = (partial: Partial<RegisterDraft>) => setDraft((d) => ({ ...d, ...partial }));

  const clearField = (key: string) => {
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const validateCurrent = (): FieldErrors => {
    const id = steps[step]?.id;
    if (id === "account") return validateAccountStep(draft);
    if (id === "place") return validatePlaceStep(draft);
    if (id === "farm") return validateFarmStep(draft);
    if (id === "docs") return validateDocsStep(draft);
    return {};
  };

  const goNext = () => {
    setFormError("");
    const nextErrors = validateCurrent();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    setStep((s) => Math.min(s + 1, steps.length - 1));
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (steps[step]?.id !== "review") {
      goNext();
      return;
    }
    setFormError("");
    setPending(true);
    const result = await submitRegistration(draft);
    setPending(false);
    if (!result.ok) {
      setErrors(result.errors);
      setFormError(
        result.errors.email === "emailTaken"
          ? t("register.errors.emailTaken")
          : t("register.reviewBody"),
      );
      if (result.errors.email || result.errors.password || result.errors.name) setStep(1);
      else if (result.errors.location || result.errors.state) setStep(2);
      else if (result.errors.farmName || result.errors.crops) setStep(3);
      else if (result.errors.documents || result.errors.idDoc || result.errors.organicDoc) {
        setStep(draft.path === "farmer" ? 4 : 2);
      }
      return;
    }
    login(result.user, true);
    navigate(roleHome[result.user.role], { replace: true });
  };

  const toggleCrop = (crop: string) => {
    patch({
      crops: draft.crops.includes(crop)
        ? draft.crops.filter((c) => c !== crop)
        : [...draft.crops, crop],
    });
    clearField("crops");
  };

  const addFiles = (kind: RegisterDoc["kind"], list: FileList | null) => {
    if (!list?.length) return;
    const incoming: RegisterDoc[] = [];
    for (const file of Array.from(list)) {
      const fileErr = validateFile(file);
      if (fileErr) {
        setErrors((prev) => ({ ...prev, documents: fileErr }));
        return;
      }
      incoming.push({
        id: `${kind}-${file.name}-${file.size}-${Date.now()}`,
        kind,
        name: file.name,
        size: file.size,
        type: file.type,
      });
    }
    patch({ documents: [...draft.documents, ...incoming] });
    clearField("documents");
  };

  const current = steps[step]?.id;
  const last = step === steps.length - 1;

  return (
    <AuthShell role={draft.path}>
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-secondary">
        {t("register.kicker")}
      </p>
      <h1 className="mt-2 font-display text-4xl text-ink">{t("register.title")}</h1>
      <p className="mt-2 text-sm leading-relaxed text-ink-soft">{t("register.subtitle")}</p>
      <div className="mt-6">
        <StepBar steps={steps} current={step} />
      </div>

      <form className="space-y-4" onSubmit={onSubmit} noValidate>
        {current === "path" && (
          <PathSelect
            value={draft.path}
            onChange={(path) => {
              setDraft((d) => ({
                ...emptyDraft(path),
                name: d.name,
                email: d.email,
                phone: d.phone,
                password: d.password,
                confirm: d.confirm,
              }));
              setErrors({});
              setStep(0);
            }}
          />
        )}

        {current === "account" && (
          <>
            <Field label={t("auth.name")} error={errLabel(t, errors.name)}>
              <Input
                name="name"
                value={draft.name}
                onChange={(e) => {
                  patch({ name: e.target.value });
                  clearField("name");
                }}
                autoComplete="name"
                required
                minLength={3}
                maxLength={25}
                aria-invalid={Boolean(errors.name)}
              />
            </Field>
            <Field label={t("auth.email")} error={errLabel(t, errors.email)}>
              <Input
                type="email"
                name="email"
                autoComplete="email"
                value={draft.email}
                onChange={(e) => {
                  patch({ email: e.target.value });
                  clearField("email");
                }}
                placeholder={t("auth.emailPh")}
                required
                aria-invalid={Boolean(errors.email)}
              />
            </Field>
            <Field
              label={t("register.phone")}
              optional={draft.path === "farmer"}
              hint={t("register.phoneHint")}
              error={errLabel(t, errors.phone)}
            >
              <Input
                type="tel"
                name="tel"
                inputMode="tel"
                autoComplete="tel"
                value={draft.phone}
                onChange={(e) => {
                  patch({ phone: e.target.value });
                  clearField("phone");
                }}
                placeholder={t("register.phonePh")}
                required={draft.path === "customer"}
                pattern="(?:\+91[\s-]?|0)?[6-9]\d{9}"
                aria-invalid={Boolean(errors.phone)}
              />
            </Field>
            <PasswordField
              id="reg-password"
              name="new-password"
              label={t("auth.password")}
              value={draft.password}
              onChange={(v) => {
                patch({ password: v });
                clearField("password");
              }}
              autoComplete="new-password"
              required
              minLength={8}
              error={errLabel(t, errors.password)}
            />
            <PasswordMeter value={draft.password} />
            <PasswordField
              id="reg-confirm"
              name="confirm-password"
              label={t("auth.confirm")}
              value={draft.confirm}
              onChange={(v) => {
                patch({ confirm: v });
                clearField("confirm");
              }}
              autoComplete="new-password"
              required
              error={errLabel(t, errors.confirm)}
            />
          </>
        )}

        {current === "place" && (
          <>
            <Field label={t("register.state")} error={errLabel(t, errors.state)}>
              <Select
                value={draft.state}
                onChange={(e) => {
                  patch({ state: e.target.value });
                  clearField("state");
                }}
                required
                aria-invalid={Boolean(errors.state)}
              >
                <option value="">{t("register.statePh")}</option>
                {STATES.map((s) => (
                  <option key={s} value={s}>
                    {t(`register.states.${s}`)}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label={t("register.location")} error={errLabel(t, errors.location)}>
              <Input
                value={draft.location}
                onChange={(e) => {
                  patch({ location: e.target.value });
                  clearField("location");
                }}
                placeholder={t("register.locationPh")}
                required
                minLength={3}
                maxLength={60}
                aria-invalid={Boolean(errors.location)}
              />
            </Field>
          </>
        )}

        {current === "farm" && (
          <>
            <Field label={t("auth.farmName")} error={errLabel(t, errors.farmName)}>
              <Input
                value={draft.farmName}
                onChange={(e) => {
                  patch({ farmName: e.target.value });
                  clearField("farmName");
                }}
                required
                minLength={3}
                maxLength={60}
                aria-invalid={Boolean(errors.farmName)}
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label={t("register.farmSize")} error={errLabel(t, errors.farmSize)}>
                <Input
                  type="number"
                  min={0.1}
                  max={5000}
                  step={0.1}
                  value={draft.farmSize}
                  onChange={(e) => {
                    patch({ farmSize: e.target.value });
                    clearField("farmSize");
                  }}
                  required
                  aria-invalid={Boolean(errors.farmSize)}
                />
              </Field>
              <Field label={t("register.experience")} error={errLabel(t, errors.experience)}>
                <Input
                  type="number"
                  min={0}
                  max={80}
                  step={1}
                  value={draft.experience}
                  onChange={(e) => {
                    patch({ experience: e.target.value });
                    clearField("experience");
                  }}
                  required
                  aria-invalid={Boolean(errors.experience)}
                />
              </Field>
            </div>
            <Field label={t("register.crops")} error={errLabel(t, errors.crops)}>
              <div className="flex flex-wrap gap-2">
                {CROPS.map((crop) => {
                  const on = draft.crops.includes(crop);
                  return (
                    <button
                      key={crop}
                      type="button"
                      onClick={() => toggleCrop(crop)}
                      className={cn(
                        "rounded-full px-3 py-1.5 text-xs font-medium",
                        on ? "bg-nature text-accent" : "border border-line bg-canvas text-ink-soft",
                      )}
                    >
                      {t(`register.cropOpts.${crop}`)}
                    </button>
                  );
                })}
              </div>
            </Field>
            <Field label={t("register.organic")}>
              <div className="grid grid-cols-3 gap-2">
                {(["yes", "no", "progress"] as const).map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => {
                      patch({ organic: opt });
                      clearField("certNumber");
                    }}
                    className={cn(
                      "rounded-2xl border px-2 py-2 text-xs",
                      draft.organic === opt
                        ? "border-primary bg-primary-soft text-primary"
                        : "border-line bg-canvas text-ink-soft",
                    )}
                  >
                    {t(
                      opt === "yes"
                        ? "register.organicYes"
                        : opt === "no"
                          ? "register.organicNo"
                          : "register.organicProgress",
                    )}
                  </button>
                ))}
              </div>
            </Field>
            {draft.organic === "yes" && (
              <Field label={t("register.certNumber")} error={errLabel(t, errors.certNumber)}>
                <Input
                  value={draft.certNumber}
                  onChange={(e) => {
                    patch({ certNumber: e.target.value });
                    clearField("certNumber");
                  }}
                  placeholder={t("register.certPh")}
                  required
                  aria-invalid={Boolean(errors.certNumber)}
                />
              </Field>
            )}
          </>
        )}

        {current === "docs" && (
          <>
            <p className="text-sm text-ink-soft">{t("register.docsHint")}</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {DOC_KINDS.map((kind) => (
                <label
                  key={kind}
                  className="cursor-pointer rounded-2xl border border-dashed border-line bg-canvas p-3 text-sm hover:border-secondary/50"
                >
                  <p className="font-medium text-ink">
                    {t(
                      kind === "id"
                        ? "register.idProof"
                        : kind === "land"
                          ? "register.landProof"
                          : kind === "organic"
                            ? "register.organicProof"
                            : "register.otherDoc",
                    )}
                  </p>
                  <p className="mt-1 text-xs text-muted">{t("register.addFile")}</p>
                  <input
                    type="file"
                    accept={allowedDocTypes.join(",")}
                    className="sr-only"
                    onChange={(e) => {
                      addFiles(kind, e.target.files);
                      e.target.value = "";
                    }}
                  />
                </label>
              ))}
            </div>
            {draft.documents.length > 0 && (
              <ul className="space-y-2">
                {draft.documents.map((doc) => (
                  <li
                    key={doc.id}
                    className="flex items-center justify-between gap-3 rounded-2xl border border-line bg-canvas px-3 py-2 text-sm"
                  >
                    <span className="flex min-w-0 items-center gap-2">
                      <FileText size={14} className="shrink-0 text-secondary" />
                      <span className="truncate">{doc.name}</span>
                      <span className="text-[10px] uppercase text-muted">
                        {doc.kind} · {(doc.size / 1024).toFixed(0)} KB
                      </span>
                    </span>
                    <button
                      type="button"
                      onClick={() => patch({ documents: draft.documents.filter((d) => d.id !== doc.id) })}
                      className="text-primary"
                    >
                      <Trash2 size={14} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
            {errors.documents && (
              <p className="text-xs text-primary" role="alert">
                {errLabel(t, errors.documents)}
              </p>
            )}
            <p className="text-[11px] text-muted">
              Max {Math.round(maxDocBytes / (1024 * 1024))} MB · PDF / JPG / PNG / WebP
            </p>
          </>
        )}

        {current === "review" && (
          <div className="space-y-3 rounded-[1.25rem] border border-line bg-canvas p-4 text-sm">
            <p className="font-display text-2xl text-ink">{t("register.reviewTitle")}</p>
            <p className="text-ink-soft">{t("register.reviewBody")}</p>
            <dl className="grid grid-cols-2 gap-2 text-xs">
              {[
                [t(`roles.${draft.path}`), t(`register.path${draft.path === "farmer" ? "Farmer" : "Customer"}`)],
                [t("auth.name"), draft.name],
                [t("auth.email"), draft.email],
                [t("register.phone"), draft.phone || "—"],
                [t("register.state"), draft.state ? t(`register.states.${draft.state}`) : "—"],
                [t("register.location"), draft.location],
                ...(draft.path === "farmer"
                  ? ([
                      [t("auth.farmName"), draft.farmName],
                      [t("register.farmSize"), `${draft.farmSize} ac`],
                      [t("register.experience"), draft.experience],
                      [t("register.crops"), draft.crops.map((c) => t(`register.cropOpts.${c}`)).join(", ")],
                      [
                        t("register.organic"),
                        t(
                          `register.organic${draft.organic === "yes" ? "Yes" : draft.organic === "no" ? "No" : "Progress"}`,
                        ),
                      ],
                      [t("register.documents"), String(draft.documents.length)],
                    ] as [string, string][])
                  : []),
              ].map(([k, v]) => (
                <div key={String(k)} className="rounded-xl bg-cream px-3 py-2">
                  <dt className="text-[10px] uppercase tracking-wider text-muted">{k}</dt>
                  <dd className="mt-0.5 font-medium text-ink">{v}</dd>
                </div>
              ))}
            </dl>
            <p className="text-[11px] leading-relaxed text-muted">{t("register.serverNote")}</p>
          </div>
        )}

        {formError && (
          <p className="flex items-start gap-2 rounded-2xl bg-primary-soft px-3 py-2 text-sm text-primary">
            <ShieldAlert size={16} className="mt-0.5 shrink-0" /> {formError}
          </p>
        )}

        <div className="flex gap-3 pt-2">
          {step > 0 && (
            <Button
              type="button"
              variant="ghost"
              className="flex-1"
              onClick={() => {
                setFormError("");
                setErrors({});
                setStep((s) => Math.max(s - 1, 0));
              }}
              disabled={pending}
            >
              {t("register.back")}
            </Button>
          )}
          <Button type="submit" className="flex-1" disabled={pending}>
            {pending ? t("register.submitting") : last ? t("register.submit") : t("register.next")}
          </Button>
        </div>
      </form>

      <p className="mt-6 text-center text-sm text-ink-soft">
        {t("auth.hasAccount")}{" "}
        <Link to={`/login?role=${draft.path}`} className="font-medium text-primary hover:underline">
          {t("auth.login")}
        </Link>
      </p>
    </AuthShell>
  );
}
