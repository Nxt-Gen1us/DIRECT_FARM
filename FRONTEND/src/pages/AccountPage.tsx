import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LogOut, MapPin, Sparkles } from "lucide-react";
import { farmers } from "../data/farmers";
import { useApp } from "../app/providers/AppProviders";
import { useLanguage } from "../hooks/useLanguage";
import type { Language, Role } from "../lib/types";
import { Button } from "../components/ui";
import { Card, SectionHead } from "../components/ui/Card";

export function AccountPage() {
  const { t } = useTranslation();
  const { role, setRole, user: session, logout } = useApp();
  const { language, setLanguage } = useLanguage();
  const navigate = useNavigate();
  const user = session;

  return (
    <div className="container-app max-w-5xl py-8 sm:py-10">
      <SectionHead kicker={t("nav.account")} title={t("account.title")} />
      <p className="-mt-4 mb-6 text-sm text-ink-soft">{t("account.subtitle")}</p>

      <Card className="overflow-hidden p-0">
        <div className="bg-primary-soft p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              {user ? (
                <img src={user.avatar} alt="" className="h-20 w-20 rounded-2xl object-cover shadow-sm ring-4 ring-white" />
              ) : (
                <span className="grid h-20 w-20 place-items-center rounded-2xl bg-white font-display text-2xl text-primary shadow-sm ring-4 ring-white">
                  {t("account.guest").slice(0, 1)}
                </span>
              )}

              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-secondary sm:text-xs">DIRECT FARM</p>
                <h2 className="mt-1 font-display text-2xl text-ink sm:text-3xl">
                  {user?.name ?? t("account.guest")}
                </h2>
                <p className="mt-1 text-sm text-ink-soft">
                  {user ? `${user.email} · ${user.phone}` : t(`roles.${role}`)}
                </p>
                {!user && (
                  <Link to="/login" className="mt-2 inline-block text-sm font-medium text-primary">
                    {t("nav.login")}
                  </Link>
                )}
              </div>
            </div>

            {user && (
              <Button
                variant="ghost"
                onClick={() => {
                  logout();
                  navigate("/");
                }}
              >
                <LogOut size={16} />
                {t("nav.logout")}
              </Button>
            )}
          </div>
        </div>
      </Card>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Card className="p-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-secondary">{t("account.role")}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {(["customer", "farmer", "admin"] as Role[]).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`rounded-full px-4 py-2 text-sm transition ${
                  role === r ? "bg-primary text-accent shadow-[0_10px_24px_-12px_rgb(139_38_38_/_0.55)]" : "border border-line bg-canvas text-ink-soft"
                }`}
              >
                {t(`roles.${r}`)}
              </button>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-secondary">{t("account.language")}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {(["en", "hi", "gu"] as Language[]).map((lng) => (
              <button
                key={lng}
                type="button"
                onClick={() => setLanguage(lng)}
                className={`rounded-full px-4 py-2 text-sm transition ${
                  language === lng ? "bg-secondary text-white shadow-[0_10px_24px_-12px_rgb(239_105_5_/_0.5)]" : "border border-line bg-canvas text-ink-soft"
                }`}
              >
                {t(`lang.${lng}`)}
              </button>
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-8 flex items-center justify-between gap-2">
        <h3 className="font-display text-2xl text-ink">{t("account.saved")}</h3>
        <div className="flex items-center gap-1 text-xs font-medium uppercase tracking-[0.15em] text-muted">
          <Sparkles size={12} />
          {t("account.greeting")}
        </div>
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {farmers.slice(0, 4).map((f) => (
          <Card key={f.id} className="flex items-center gap-3 p-3 transition hover:border-primary/40 hover:shadow-[0_12px_28px_-18px_rgb(139_38_38_/_0.45)]">
            <img src={f.cover} alt="" className="h-14 w-20 rounded-xl object-cover" />
            <div className="min-w-0 flex-1">
              <p className="font-medium text-ink">{f.farmName}</p>
              <div className="mt-1 flex items-center gap-1 text-xs text-muted">
                <MapPin size={12} />
                <span>{f.district}, {f.state}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
