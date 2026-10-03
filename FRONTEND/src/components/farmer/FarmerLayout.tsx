import { Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FarmerHeader } from "./FarmerHeader";
import { FarmerSidebar } from "./FarmerSidebar";
import { useApp } from "../../app/providers/AppProviders";

export function FarmerLayout() {
  const { t } = useTranslation();
  return (
    <div className="workspace-redesign flex h-screen overflow-hidden bg-canvas grain">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-full focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:text-accent"
      >
        {t("common.skip")}
      </a>
      <FarmerSidebar />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <FarmerHeader />
        <main id="main" className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8" tabIndex={-1}>
          <div className="mx-auto max-w-[1600px]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
