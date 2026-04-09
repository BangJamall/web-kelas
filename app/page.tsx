import Navbar from "@/components/Navbar";
import HeroSection from "@/components/sections/HeroSection";
import ScheduleSection from "@/components/sections/ScheduleSection";
import GallerySection from "@/components/sections/GallerySection";
import AboutSection from "@/components/sections/AboutSection";
import QuoteSection from "@/components/sections/QuoteSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <ScheduleSection />
        <GallerySection />
        <AboutSection />
        <QuoteSection />
      </main>
      <Footer />
    </>
  );
}
