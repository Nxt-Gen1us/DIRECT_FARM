import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, BadgeCheck, ChevronRight, Leaf, Search, ShieldCheck, Truck } from "lucide-react";
import { products, categories } from "../data/products";
import { ProductCard } from "../components/marketplace/ProductCard";
import { Button } from "../components/ui/Button";
import { SectionHead } from "../components/ui/Card";

export function HomePage() {
  const featured = products.slice(0, 8);
  return (
    <div className="storefront">
      <section className="store-hero relative overflow-hidden">
        <img src="/images/hero-farm.jpg" alt="Fresh produce growing on a farm" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#102319]/90 via-[#102319]/60 to-transparent" />
        <div className="container-app relative grid items-center gap-10 py-20 md:grid-cols-12 md:py-28">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="md:col-span-7">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-yellow-200 backdrop-blur-sm"><Leaf size={13} /> Fresh from local farms</p>
            <h1 className="font-display text-4xl leading-[1.08] text-white sm:text-5xl lg:text-7xl">Better food starts <span className="text-yellow-300">closer to home.</span></h1>
            <p className="mt-5 max-w-xl text-sm leading-relaxed text-white/80 md:text-base">Shop seasonal produce, pantry staples, and thoughtful farm goods delivered from people who grow them.</p>
            <div className="mt-8 flex flex-wrap gap-3"><Link to="/market"><Button variant="cream" className="rounded-full px-6">Shop the harvest <ArrowRight size={16} /></Button></Link><Link to="/market" className="inline-flex items-center gap-2 rounded-full border border-white/30 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-white/10"><Search size={16} /> Browse all products</Link></div>
            <div className="mt-10 grid max-w-md grid-cols-3 gap-3">{[{ n: "642", l: "partner farms" }, { n: "4.8/5", l: "happy customers" }, { n: "36 hrs", l: "average delivery" }].map((s) => <div key={s.l} className="rounded-2xl border border-white/15 bg-white/10 p-3 backdrop-blur-sm"><p className="font-display text-2xl text-yellow-200">{s.n}</p><p className="mt-1 text-[11px] text-white/65">{s.l}</p></div>)}</div>
          </motion.div>
        </div>
      </section>
      <section className="container-app py-14">
        <div className="mb-6 flex items-end justify-between"><SectionHead kicker="Shop by" title="What are you looking for?" /><Link to="/market" className="hidden items-center gap-1 text-sm font-medium text-primary sm:flex">View all <ChevronRight size={16} /></Link></div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">{categories.map((c) => <Link key={c.id} to={`/market?cat=${c.id}`} className="group relative overflow-hidden rounded-2xl"><img src={c.image} alt={c.id} className="h-36 w-full object-cover transition duration-500 group-hover:scale-105" /><div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent" /><p className="absolute bottom-3 left-3 font-display text-lg text-white">{c.id}</p></Link>)}</div>
      </section>
      <section className="container-app pb-16"><SectionHead kicker="Picked for you" title="Popular this week" action={<Link to="/market" className="flex items-center gap-1 text-sm font-medium text-primary">View all products <ChevronRight size={16} /></Link>} /><div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{featured.map((p) => <ProductCard key={p.id} product={p} />)}</div></section>
      <section className="store-benefits"><div className="container-app py-14"><p className="text-xs uppercase tracking-[0.2em] text-yellow-300">Why shop Direct Farm</p><h2 className="mt-2 max-w-xl font-display text-4xl text-white">Good food, good people, no detours.</h2><div className="mt-8 grid gap-4 sm:grid-cols-3">{[{ icon: Truck, title: "Fast, careful delivery", body: "From our farms to your door, in peak condition." }, { icon: ShieldCheck, title: "Quality you can trust", body: "Every item is selected and packed with care." }, { icon: BadgeCheck, title: "Fair for farmers", body: "Your order helps independent growers thrive." }].map(({ icon: Icon, title, body }) => <div key={title} className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-sm"><Icon size={22} className="text-yellow-300" /><h3 className="mt-4 font-display text-xl text-white">{title}</h3><p className="mt-2 text-sm leading-relaxed text-white/70">{body}</p></div>)}</div></div></section>
    </div>
  );
}
