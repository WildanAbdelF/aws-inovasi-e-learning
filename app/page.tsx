import HeroSection from "../components/HeroSection";
import FeaturedCourses from "../components/FeaturedCourses";
import LearningModels from "../components/LearningModels";
import Testimonials from "../components/Testimonials";
import CTASection from "../components/CTASection";
import Footer from "../components/Footer";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedCourses />
      <LearningModels />
      <Testimonials />
      <CTASection />
    </>
  );
}
