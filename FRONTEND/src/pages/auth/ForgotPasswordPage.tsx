import { useState, type FormEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ShieldAlert } from "lucide-react";
import { AuthShell, RoleSwitch } from "../../components/auth";
import { Button, Field, Input } from "../../components/ui";
import { isValidEmail } from "../../lib/auth";
import type { Role } from "../../lib/types";

export function ForgotPasswordPage() {
  const { t } = useTranslation();
  const [params] = useSearchParams();
  const preset = params.get("role");
  const [role, setRole] = useState<Role>(
    preset === "farmer" || preset === "admin" || preset === "customer" ? preset : "customer",
  );
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [pending, setPending] = useState(false);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (!isValidEmail(email)) return setError(t("auth.errors.email"));
    setPending(true);
    window.setTimeout(() => {
      setPending(false);
      setSent(true);
    }, 420);
  };

  return (
    <AuthShell role={role}>
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-secondary">{t("auth.forgot")}</p>
      <h1 className="mt-2 font-display text-4xl text-ink">{t("auth.forgotTitle")}</h1>
      <p className="mt-2 text-sm leading-relaxed text-ink-soft">{t("auth.forgotSubtitle")}</p>

      <div className="mt-6">
        <RoleSwitch value={role} onChange={setRole} />
      </div>

      {sent ? (
        <div className="mt-6 rounded-2xl border border-line bg-nature-soft p-5 text-sm text-nature-dark">
          <p className="font-medium">{t("auth.resetSent")}</p>
          <p className="mt-2">{t("auth.resetNote")}</p>
          <Link to={`/login?role=${role}`} className="mt-4 inline-block font-medium text-primary hover:underline">
            {t("auth.backLogin")}
          </Link>
        </div>
      ) : (
        <form className="mt-6 space-y-4" onSubmit={submit}>
          <Field label={t("auth.email")}>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("auth.emailPh")}
              required
            />
          </Field>
          {error && (
            <p className="flex items-start gap-2 rounded-2xl bg-primary-soft px-3 py-2 text-sm text-primary">
              <ShieldAlert size={16} className="mt-0.5 shrink-0" /> {error}
            </p>
          )}
          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? t("auth.sending") : t("auth.sendReset")}
          </Button>
        </form>
      )}

      <p className="mt-6 text-center text-sm text-ink-soft">
        <Link to={`/login?role=${role}`} className="font-medium text-primary hover:underline">
          {t("auth.backLogin")}
        </Link>
      </p>
    </AuthShell>
  );
}
