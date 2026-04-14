import HeroSection from "@/components/home/HeroSection";
import FeaturedCourses from "@/components/home/FeaturedCourses";
import LearningModels from "@/components/home/LearningModels";
import Testimonials from "@/components/home/Testimonials";
import CTASection from "@/components/home/CTASection";

export default function HomePage() {
  return (
    <>
      <div data-aos="fade-up" data-aos-duration="500">
        <HeroSection />
      </div>
      <div data-aos="fade-up" data-aos-duration="500" data-aos-delay="100">
        <FeaturedCourses />
      </div>
      <div data-aos="fade-up" data-aos-duration="500" data-aos-delay="200">
        <LearningModels />
      </div>
      <div data-aos="fade-up" data-aos-duration="500" data-aos-delay="300">
        <Testimonials />
      </div>
      <div data-aos="fade-up" data-aos-duration="500" data-aos-delay="400">
        <CTASection />
      </div>
    </>
  );
}
