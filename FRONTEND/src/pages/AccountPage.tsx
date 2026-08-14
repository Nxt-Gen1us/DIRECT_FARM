import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { farmers } from "../data/farmers";
import { useApp } from "../app/providers/AppProviders";
import { useLanguage } from "../hooks/useLanguage";
import type { Language, Role } from "../lib/types";
import { Card, SectionHead } from "../components/ui/Card";

export function AccountPage() {
  const { t } = useTranslation();
  const { role, setRole, user: session } = useApp();
  const { language, setLanguage } = useLanguage();
  const user = session;

  return (
    <div className="container-app max-w-4xl py-10">
      <SectionHead kicker={t("nav.account")} title={t("account.title")} />
      <p className="-mt-4 mb-8 text-sm text-ink-soft">{t("account.subtitle")}</p>
      <Card className="flex flex-wrap items-center gap-5 p-6">
        {user ? (
          <img src={user.avatar} alt="" className="h-20 w-20 rounded-2xl object-cover" />
        ) : (
          <span className="grid h-20 w-20 place-items-center rounded-2xl bg-primary-soft font-display text-2xl text-primary">
            {t("account.guest").slice(0, 1)}
          </span>
        )}
        <div>
          <p className="text-xs text-muted">{t("account.greeting")}</p>
          <h2 className="font-display text-3xl">{user?.name ?? t("account.guest")}</h2>
          <p className="text-sm text-ink-soft">
            {user ? `${user.email} · ${user.phone}` : t(`roles.${role}`)}
          </p>
          {!user && (
            <Link to="/login" className="mt-2 inline-block text-sm font-medium text-primary">
              {t("nav.login")}
            </Link>
          )}
        </div>
      </Card>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Card className="p-5">
          <p className="text-xs uppercase tracking-widest text-muted">{t("account.role")}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {(["customer", "farmer", "admin"] as Role[]).map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={`rounded-full px-4 py-2 text-sm ${
                  role === r ? "bg-primary text-accent" : "border border-line bg-canvas"
                }`}
              >
                {t(`roles.${r}`)}
              </button>
            ))}
          </div>
        </Card>
        <Card className="p-5">
          <p className="text-xs uppercase tracking-widest text-muted">{t("account.language")}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {(["en", "hi", "gu"] as Language[]).map((lng) => (
              <button
                key={lng}
                type="button"
                onClick={() => setLanguage(lng)}
                className={`rounded-full px-4 py-2 text-sm ${
                  language === lng ? "bg-secondary text-white" : "border border-line bg-canvas"
                }`}
              >
                {t(`lang.${lng}`)}
              </button>
            ))}
          </div>
        </Card>
      </div>

      <h3 className="mt-8 font-display text-2xl">{t("account.saved")}</h3>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {farmers.slice(0, 4).map((f) => (
          <Card key={f.id} className="flex items-center gap-3 p-3">
            <img src={f.cover} alt="" className="h-14 w-20 rounded-xl object-cover" />
            <div>
              <p className="font-medium">{f.farmName}</p>
              <p className="text-xs text-muted">
                {f.district}, {f.state}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
