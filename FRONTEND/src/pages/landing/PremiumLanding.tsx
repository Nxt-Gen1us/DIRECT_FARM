import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight, BadgeCheck, Check, ChevronDown, CircleCheck, Leaf, Menu, QrCode, ShieldCheck, ShoppingBasket, Sprout, Truck, Users, X } from "lucide-react";
import { useEffect, useState } from "react";
import "./premium-landing.css";

const iconSet = [BanknoteIcon, Users, ShoppingBasket, CircleCheck, Sprout, BadgeCheck];
function BanknoteIcon(props: { size?: number }) { return <span className="rupee-icon" aria-hidden="true">₹</span>; }

export function PremiumLanding() {
  const { t, i18n } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  useEffect(() => {
    document.title = i18n.resolvedLanguage?.startsWith("gu")
      ? "ડાયરેક્ટ ફાર્મ — ખેડૂતથી સીધો ગ્રાહક સુધી"
      : i18n.resolvedLanguage?.startsWith("hi")
        ? "डायरेक्ट फार्म — किसान से सीधे ग्राहक तक"
        : "DIRECT FARM — From farmer to customer";
  }, [i18n.resolvedLanguage]);
  const nav = [
    ["landing.nav.home", "#home"], ["landing.nav.about", "#about"], ["landing.nav.farmers", "#farmers"], ["landing.nav.customers", "#customers"], ["landing.nav.how", "#how"]
  ];
  const heroTrust = t("landing.hero.trust", { returnObjects: true }) as string[];
  const howSteps = t("landing.how.steps", { returnObjects: true }) as string[][];
  const benefitCards = t("landing.benefits.cards", { returnObjects: true }) as string[][];
  const passportSteps = t("landing.passport.steps", { returnObjects: true }) as string[];
  const customerCards = t("landing.customer.cards", { returnObjects: true }) as string[][];
  const switchLanguage = (language: "gu" | "hi" | "en") => { void i18n.changeLanguage(language); setLanguageOpen(false); setMenuOpen(false); };
  const currentLanguage = i18n.resolvedLanguage?.startsWith("gu") ? "ગુજરાતી" : i18n.resolvedLanguage?.startsWith("hi") ? "हिन्दी" : "English";

  return <div className="premium-landing">
    <header className="premium-header">
      <div className="premium-container header-inner">
        <Link to="/" className="brand-mark" aria-label="DIRECT FARM"><span className="brand-icon"><Sprout size={19} /></span><span>DIRECT FARM</span></Link>
        <nav className="desktop-nav" aria-label={t("landing.nav.home")}>{nav.map(([label, href]) => <a key={href} href={href}>{t(label)}</a>)}</nav>
        <div className="header-actions">
          <div className="language-picker">
            <button className="language-button" onClick={() => setLanguageOpen(!languageOpen)} aria-expanded={languageOpen}>{currentLanguage}<ChevronDown size={15} /></button>
            {languageOpen && <div className="language-menu">{[["gu", "ગુજરાતી"], ["hi", "हिन्दी"], ["en", "English"]].map(([code, label]) => <button key={code} onClick={() => switchLanguage(code as "gu" | "hi" | "en")}>{label}</button>)}</div>}
          </div>
          <Link to="/login" className="login-link">{t("landing.nav.login")}</Link>
          <Link to="/register" className="button button-small">{t("landing.nav.start")}</Link>
        </div>
        <button className="mobile-menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label={t("landing.nav.menu")} aria-expanded={menuOpen}>{menuOpen ? <X /> : <Menu />}</button>
      </div>
      {menuOpen && <div className="mobile-menu"><div className="premium-container">{nav.map(([label, href]) => <a key={href} href={href} onClick={() => setMenuOpen(false)}>{t(label)}</a>)}<div className="mobile-menu-actions"><div className="mobile-languages">{[["gu", "ગુજરાતી"], ["hi", "हिन्दी"], ["en", "English"]].map(([code, label]) => <button key={code} onClick={() => switchLanguage(code as "gu" | "hi" | "en")}>{label}</button>)}</div><Link to="/login" className="button button-outline">{t("landing.nav.login")}</Link><Link to="/register" className="button">{t("landing.nav.start")}</Link></div></div></div>}
    </header>

    <main>
      <section id="home" className="hero-section"><div className="premium-container hero-grid"><div className="hero-copy"><p className="eyebrow"><span className="eyebrow-dot" />{t("landing.hero.eyebrow")}</p><h1>{t("landing.hero.title")}</h1><p className="hero-body">{t("landing.hero.body")}</p><div className="hero-actions"><Link to="/register?role=farmer" className="button">{t("landing.hero.sell")}<ArrowRight size={17} /></Link><Link to="/market" className="button button-outline">{t("landing.hero.buy")}</Link></div><div className="hero-trust">{heroTrust.map((item) => <span key={item}><Check size={14} />{item}</span>)}</div></div><div className="hero-visual"><img src="/images/hero-farm.jpg" alt={t("landing.hero.imageAlt")} fetchPriority="high" /><div className="hero-visual-caption"><div className="caption-line"><span className="caption-node"><Users size={15} />{t("landing.hero.farmer")}</span><span className="caption-connector" /><span className="caption-node caption-brand"><Leaf size={15} />DIRECT FARM</span><span className="caption-connector" /><span className="caption-node"><ShoppingBasket size={15} />{t("landing.hero.customer")}</span></div><p>{t("landing.hero.bridgeBody")}</p></div></div></div></section>

      <section id="about" className="value-section section"><div className="premium-container"><div className="section-heading centered"><p className="eyebrow">{t("landing.value.eyebrow")}</p><h2>{t("landing.value.title")}</h2><p>{t("landing.value.body")}</p></div><div className="flow-grid"><FlowCard icon={<Users />} title={t("landing.value.farmer")} body={t("landing.value.farmerBody")} /><div className="flow-arrow"><ArrowRight /></div><FlowCard icon={<Sprout />} title="DIRECT FARM" body={t("landing.value.platformBody")} featured /><div className="flow-arrow"><ArrowRight /></div><FlowCard icon={<ShoppingBasket />} title={t("landing.value.customer")} body={t("landing.value.customerBody")} /></div></div></section>

      <section id="how" className="section soft-section"><div className="premium-container"><div className="section-heading"><p className="eyebrow">{t("landing.how.eyebrow")}</p><h2>{t("landing.how.title")}</h2></div><div className="steps-grid">{howSteps.map(([number, title, body]) => <article className="step-card" key={number}><span className="step-number">{number}</span><div className="step-icon"><Sprout size={20} /></div><h3>{title}</h3><p>{body}</p></article>)}</div></div></section>

      <section id="farmers" className="section benefits-section"><div className="premium-container"><div className="section-heading centered"><p className="eyebrow">{t("landing.benefits.eyebrow")}</p><h2>{t("landing.benefits.title")}</h2><p>{t("landing.benefits.body")}</p></div><div className="benefits-grid">{benefitCards.map(([title, body], index) => { const Icon = iconSet[index]; return <article className="benefit-card" key={title}><span className="benefit-icon"><Icon size={19} /></span><h3>{title}</h3><p>{body}</p></article>; })}</div></div></section>

      <section className="story-section section"><div className="premium-container story-grid"><div className="story-image"><img src="/images/farmer-portrait.jpg" alt={t("landing.story.imageAlt")} loading="lazy" /><div className="sample-label"><span>{t("landing.story.demo")}</span><strong>{t("landing.story.farmer")}</strong><small>{t("landing.story.place")}</small></div></div><div className="story-copy"><p className="eyebrow">{t("landing.story.eyebrow")}</p><h2>{t("landing.story.title")}</h2><p>{t("landing.story.body")}</p><div className="profile-details"><span><MapPinIcon />{t("landing.story.place")}</span><span><Sprout size={16} />{t("landing.story.farm")}</span><span><Leaf size={16} />{t("landing.story.crops")}</span><span className="verified"><BadgeCheck size={16} />{t("landing.story.badge")}</span></div><a href="#customers" className="text-link">{t("landing.story.cta")}<ArrowRight size={16} /></a></div></div></section>

      <section className="passport-section section"><div className="premium-container passport-grid"><div><p className="eyebrow light">{t("landing.passport.eyebrow")}</p><h2>{t("landing.passport.title")}</h2><p className="passport-body">{t("landing.passport.body")}</p><div className="passport-timeline">{passportSteps.map((step, index) => <div key={step} className="passport-step"><span>{String(index + 1).padStart(2, "0")}</span><p>{step}</p></div>)}</div><p className="passport-qr-note"><QrCode size={18} />{t("landing.passport.qr")}</p><Link to="/passport" className="button button-light">{t("landing.passport.cta")}<ArrowRight size={17} /></Link></div><div className="qr-card"><div className="qr-visual" aria-hidden="true"><QrCode size={122} strokeWidth={1.1} /></div><span>DIRECT FARM</span></div></div></section>

      <section id="customers" className="section customer-section"><div className="premium-container customer-grid"><div className="customer-image"><img src="/images/vegetables.jpg" alt={t("landing.customer.imageAlt")} loading="lazy" /><div className="image-tag"><Leaf size={15} />{t("landing.customer.cards.0.0", { returnObjects: false })}</div></div><div><p className="eyebrow">{t("landing.customer.eyebrow")}</p><h2>{t("landing.customer.title")}</h2><p className="customer-body">{t("landing.customer.body")}</p><div className="customer-cards">{customerCards.map(([title, body]) => <article key={title}><span><CircleCheck size={17} /></span><div><h3>{title}</h3><p>{body}</p></div></article>)}</div><Link to="/market" className="button">{t("landing.customer.cta")}<ArrowRight size={17} /></Link></div></div></section>

      <section className="final-section"><div className="premium-container final-inner"><div><p className="eyebrow light">DIRECT FARM</p><h2>{t("landing.final.title")}</h2><p>{t("landing.final.body")}</p></div><div className="final-actions"><Link to="/register?role=farmer" className="button button-light">{t("landing.final.farmer")}</Link><Link to="/register?role=customer" className="button button-ghost">{t("landing.final.customer")}</Link></div></div></section>
    </main>
    <footer className="premium-footer"><div className="premium-container footer-grid"><div><Link to="/" className="brand-mark footer-brand"><span className="brand-icon"><Sprout size={18} /></span><span>DIRECT FARM</span></Link><p>{t("landing.footer.tagline")}</p></div><div><strong>{t("landing.footer.explore")}</strong><a href="#farmers">{t("landing.footer.farmers")}</a><a href="#customers">{t("landing.footer.customers")}</a><a href="#how">{t("landing.footer.how")}</a></div><div><strong>{t("landing.footer.legal")}</strong><a href="#">{t("landing.footer.contact")}</a><a href="#">{t("landing.footer.privacy")}</a><a href="#">{t("landing.footer.terms")}</a></div></div><div className="premium-container footer-bottom"><span>{t("landing.footer.copyright")}</span><span>DIRECT FARM</span></div></footer>
  </div>;
}

function FlowCard({ icon, title, body, featured = false }: { icon: React.ReactNode; title: string; body: string; featured?: boolean }) { return <article className={`flow-card ${featured ? "featured" : ""}`}><span className="flow-icon">{icon}</span><h3>{title}</h3><p>{body}</p></article>; }
function MapPinIcon() { return <span className="pin-icon" aria-hidden="true" />; }
