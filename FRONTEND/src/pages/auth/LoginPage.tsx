import { useState, type FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ShieldAlert } from "lucide-react";
import { AuthDivider, AuthShell, PasswordField, RoleSwitch, SocialAuth } from "../../components/auth";
import { Button, Checkbox, Field, Input } from "../../components/ui";
import { useApp } from "../../app/providers/AppProviders";
import { authenticate } from "../../lib/auth";
import { loginApi } from "../../lib/api/auth";
import { apiConfigured } from "../../lib/api";
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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [pending, setPending] = useState(false);

  const switchRole = (next: Role) => {
    setRole(next);
    setEmail("");
    setPassword("");
    setError("");
    setNotice("");
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setNotice("");
    setPending(true);

    try {
      if (apiConfigured()) {
        try {
          const result = await loginApi(email, password);
          login(result.user, remember);
          navigate(roleHome[result.user.role], { replace: true });
          return;
        } catch (err: any) {
          // If backend throws an error, show it
          setError(err.message || t("auth.errors.credentials"));
          setPending(false);
          return;
        }
      }

      // Fallback to demo auth if API is not configured
      const result = authenticate(email, password, role);
      if (!result.ok) {
        setError(t(`auth.errors.${result.error}`));
        setPending(false);
        return;
      }
      login(result.user, remember);
      navigate(roleHome[result.user.role], { replace: true });
    } finally {
      setPending(false);
    }
  };

  return (
    <AuthShell role={role}>
      <p className="text-[10px] sm:text-xs font-medium uppercase tracking-[0.2em] text-secondary">{t("auth.as")}</p>
      <h1 className="mt-2 font-display text-2xl sm:text-3xl md:text-4xl text-ink">{t("auth.loginTitle")}</h1>
      <p className="mt-2 text-xs sm:text-sm leading-relaxed text-ink-soft">{t("auth.loginSubtitle")}</p>

      <div className="mt-5 sm:mt-6">
        <RoleSwitch value={role} onChange={switchRole} />
      </div>

      <form className="mt-5 sm:mt-6 space-y-3 sm:space-y-4" onSubmit={submit}>
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

        <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-2 xs:gap-3">
          <Checkbox
            label={t("auth.remember")}
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
          />
          <Link to={`/forgot-password?role=${role}`} className="text-xs sm:text-sm font-medium text-primary hover:underline">
            {t("auth.forgot")}
          </Link>
        </div>

        {error && (
          <p className="flex items-start gap-1.5 sm:gap-2 rounded-xl sm:rounded-2xl bg-primary-soft px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-primary">
            <ShieldAlert size={14} className="mt-0.5 shrink-0 sm:hidden" />
            <ShieldAlert size={16} className="mt-0.5 shrink-0 hidden sm:block" /> {error}
          </p>
        )}
        {notice && <p className="rounded-xl sm:rounded-2xl bg-nature-soft px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-nature-dark">{notice}</p>}

        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? t("auth.signing") : t("auth.login")}
        </Button>
      </form>

      <div className="mt-4 sm:mt-5 space-y-3 sm:space-y-4">
        <AuthDivider />
        <SocialAuth
          pending={pending}
          onGoogle={() => setNotice(t("auth.googleSoon"))}
        />
      </div>

      <p className="mt-5 sm:mt-6 text-center text-xs sm:text-sm text-ink-soft">
        {t("auth.noAccount")}{" "}
        <Link to={`/register?role=${role}`} className="font-medium text-primary hover:underline">
          {t("auth.create")}
        </Link>
      </p>

    </AuthShell>
  );
}
