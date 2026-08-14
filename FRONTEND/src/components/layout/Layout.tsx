import { Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Header } from "./Header";
import { Footer } from "./Footer";

export function Layout() {
  const { t } = useTranslation();
  return (
    <div className="flex min-h-screen flex-col grain">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-full focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:text-accent"
      >
        {t("common.skip")}
      </a>
      <Header />
      <main id="main" className="flex-1" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
