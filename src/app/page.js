import HeroSection from "@/components/home/HeroSection/HeroSection";
import BrandStatement from "@/components/home/BrandStatement/BrandStatement";
import AboutSection from "@/components/home/AboutSection/AboutSection";
import ServicesSection from "@/components/home/ServicesSection/ServicesSection";
import TechnologySection from "@/components/home/TechnologySection/TechnologySection";
import ProductsSection from "@/components/home/ProductsSection/ProductsSection";
import PortfolioSection from "@/components/home/PortfolioSection/PortfolioSection";
import InnovationSection from "@/components/home/InnovationSection/InnovationSection";
import WhyChooseUs from "@/components/home/WhyChooseUs/WhyChooseUs";
import ProcessSection from "@/components/home/ProcessSection/ProcessSection";
import TestimonialsSection from "@/components/home/TestimonialsSection/TestimonialsSection";
import CTASection from "@/components/home/CTASection/CTASection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <BrandStatement />
      <AboutSection />
      <ServicesSection />
      <TechnologySection />
      <ProductsSection />
      <PortfolioSection />
      <InnovationSection />
      <WhyChooseUs />
      <ProcessSection />
      <TestimonialsSection />
      <CTASection />
    </>
  );
}
