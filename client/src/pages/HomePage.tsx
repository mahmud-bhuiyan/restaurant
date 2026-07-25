import PublicLayout from "../components/layout/PublicLayout";
import AboutSection from "../components/home/AboutSection";
import CTASection from "../components/home/CTASection";
import FeaturedMenuSection from "../components/home/FeaturedMenuSection";
import GalleryPreviewSection from "../components/home/GalleryPreviewSection";
import HeroSection from "../components/home/HeroSection";
import TestimonialsPreviewSection from "../components/home/TestimonialsPreviewSection";

export default function HomePage() {
  return (
    <PublicLayout>
      <HeroSection />
      <FeaturedMenuSection />
      <AboutSection />
      <GalleryPreviewSection />
      <TestimonialsPreviewSection />
      <CTASection />
    </PublicLayout>
  );
}
