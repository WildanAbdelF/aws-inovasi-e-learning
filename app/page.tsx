import HeroSection from "@/components/home/HeroSection";
import FeaturedCourses from "@/components/home/FeaturedCourses";
import Testimonials from "@/components/home/Testimonials";
import CTASection from "@/components/home/CTASection";
import FAQSection from "@/components/home/FAQSection";

export default function HomePage() {
  return (
    <>
      <div data-aos="fade-up" data-aos-duration="500">
        <HeroSection />
      </div>
      <div data-aos="fade-up" data-aos-duration="500" data-aos-delay="350">
        <FAQSection />
      </div>  
      <div data-aos="fade-up" data-aos-duration="500" data-aos-delay="100">
        <FeaturedCourses />
      </div>
      <div data-aos="fade-up" data-aos-duration="500" data-aos-delay="400">
        <CTASection />
      </div>      
      <div data-aos="fade-up" data-aos-duration="500" data-aos-delay="300">
        <Testimonials />
      </div>    
    </>
  );
}
