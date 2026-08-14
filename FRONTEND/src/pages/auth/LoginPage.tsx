import { useMemo, useState, type FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ShieldAlert } from "lucide-react";
import { AuthDivider, AuthShell, PasswordField, RoleSwitch, SocialAuth } from "../../components/auth";
import { Button, Checkbox, Field, Input } from "../../components/ui";
import { useApp } from "../../app/providers/AppProviders";
import { authenticate, demoAccounts, DEMO_PASSWORD } from "../../lib/auth";
import { roleHome } from "../../config/roles";
import type { Role } from "../../lib/types";

export function LoginPage() {
  const { t } = useTranslation();
  const { login } = useApp();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const preset = params.get("role");
  const [role, setRole] = useState<Role>(
    preset === "farmer" || preset === "admin" || preset === "customer" ? preset : "customer",
  );
  const [email, setEmail] = useState(demoAccounts[role].email);
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [pending, setPending] = useState(false);

  const demo = useMemo(() => demoAccounts[role], [role]);

  const switchRole = (next: Role) => {
    setRole(next);
    setEmail(demoAccounts[next].email);
    setError("");
    setNotice("");
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setNotice("");
    setPending(true);
    window.setTimeout(() => {
      const result = authenticate(email, password, role);
      setPending(false);
      if (!result.ok) {
        setError(t(`auth.errors.${result.error}`));
        return;
      }
      login(result.user, remember);
      navigate(roleHome[result.user.role], { replace: true });
    }, 420);
  };

  return (
    <AuthShell role={role}>
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-secondary">{t("auth.as")}</p>
      <h1 className="mt-2 font-display text-4xl text-ink">{t("auth.loginTitle")}</h1>
      <p className="mt-2 text-sm leading-relaxed text-ink-soft">{t("auth.loginSubtitle")}</p>

      <div className="mt-6">
        <RoleSwitch value={role} onChange={switchRole} />
      </div>

      <form className="mt-6 space-y-4" onSubmit={submit}>
        <Field label={t("auth.email")}>
          <Input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("auth.emailPh")}
            required
          />
        </Field>
        <PasswordField
          id="login-password"
          label={t("auth.password")}
          value={password}
          onChange={setPassword}
        />

        <div className="flex items-center justify-between gap-3">
          <Checkbox
            label={t("auth.remember")}
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
          />
          <Link to={`/forgot-password?role=${role}`} className="text-sm font-medium text-primary hover:underline">
            {t("auth.forgot")}
          </Link>
        </div>

        {error && (
          <p className="flex items-start gap-2 rounded-2xl bg-primary-soft px-3 py-2 text-sm text-primary">
            <ShieldAlert size={16} className="mt-0.5 shrink-0" /> {error}
          </p>
        )}
        {notice && <p className="rounded-2xl bg-nature-soft px-3 py-2 text-sm text-nature-dark">{notice}</p>}

        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? t("auth.signing") : t("auth.login")}
        </Button>
      </form>

      <div className="mt-5 space-y-4">
        <AuthDivider />
        <SocialAuth
          pending={pending}
          onGoogle={() => setNotice(t("auth.googleSoon"))}
        />
      </div>

      <p className="mt-6 text-center text-sm text-ink-soft">
        {t("auth.noAccount")}{" "}
        <Link to={`/register?role=${role}`} className="font-medium text-primary hover:underline">
          {t("auth.create")}
        </Link>
      </p>

      <button
        type="button"
        onClick={() => {
          setEmail(demo.email);
          setPassword(DEMO_PASSWORD);
        }}
        className="mt-6 w-full rounded-2xl border border-dashed border-line bg-canvas px-4 py-3 text-left"
      >
        <p className="text-[10px] uppercase tracking-[0.16em] text-muted">{t("auth.demo")}</p>
        <p className="mt-1 text-sm text-ink">
          {demo.name} · {demo.email}
        </p>
        <p className="text-xs text-muted">{t("auth.demoHint")}</p>
      </button>
    </AuthShell>
  );
}
