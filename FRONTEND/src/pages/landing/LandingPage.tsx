import { Hero } from "./sections/Hero";
import { TrustBar } from "./sections/TrustBar";
import { HowItWorks } from "./sections/HowItWorks";
import { FeaturedFarmers } from "./sections/FeaturedFarmers";
import { FreshHarvest } from "./sections/FreshHarvest";
import { CropPassport } from "./sections/CropPassport";
import { AiAgriculture } from "./sections/AiAgriculture";
import { Sustainability } from "./sections/Sustainability";
import { Testimonials } from "./sections/Testimonials";
import { FinalCta } from "./sections/FinalCta";

export function LandingPage() {
  return (
    <div>
      <Hero />
      <TrustBar />
      <HowItWorks />
      <FeaturedFarmers />
      <FreshHarvest />
      <CropPassport />
      <AiAgriculture />
      <Sustainability />
      <Testimonials />
      <FinalCta />
    </div>
  );
}
