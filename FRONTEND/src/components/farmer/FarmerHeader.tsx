import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Search } from "lucide-react";
import { LanguageSwitcher } from "../layout/LanguageSwitcher";
import { NoticeBell } from "../chat/NoticeBell";
import { useApp } from "../../app/providers/AppProviders";

export function FarmerHeader() {
  const { t } = useTranslation();
  const { user } = useApp();

  return (
    <header className="h-16 flex items-center justify-between px-4 sm:px-6 md:px-8 border-b border-line/70 bg-cream">
      
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={20} />
          <input 
            type="text" 
            placeholder={t("farmerHeader.searchPlaceholder")}
            className="w-full bg-canvas border border-line rounded-xl pl-10 pr-4 py-2 text-sm text-ink outline-none focus:ring-2 focus:ring-primary/30 transition-all placeholder:text-muted"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4 lg:gap-6 ml-4 shrink-0">
        <LanguageSwitcher />
        <NoticeBell />
        <Link
          to="/farmer/profile"
          className="flex items-center gap-2 rounded-full hover:bg-canvas-soft p-1 pr-3 transition-colors border border-transparent hover:border-line"
          aria-label={t("nav.account")}
        >
          <img 
            src={user?.avatar || "/images/avatar-ramesh.jpg"} 
            alt={user?.name || "Farmer"} 
            className="h-8 w-8 rounded-full object-cover border-2 border-primary/10" 
          />
          <span className="hidden sm:block text-sm font-medium text-ink truncate max-w-[120px]">
            {user?.name || "Farmer"}
          </span>
        </Link>
      </div>
    </header>
  );
}
