"use client";

import HeroSection from "../components/HeroSection";
import FeaturedCourses from "../components/FeaturedCourses";
import LearningModels from "../components/LearningModels";
import Testimonials from "../components/Testimonials";
import CTASection from "../components/CTASection";
import { useInView } from "@/lib/useInView";

function AnimatedSection({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  const { ref, inView } = useInView({ threshold: 0.2 });

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-400 ease-out transform ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      {children}
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <AnimatedSection delay={100}>
        <FeaturedCourses />
      </AnimatedSection>
      <AnimatedSection delay={200}>
        <LearningModels />
      </AnimatedSection>
      <AnimatedSection delay={300}>
        <Testimonials />
      </AnimatedSection>
      <AnimatedSection delay={400}>
        <CTASection />
      </AnimatedSection>
    </>
  );
}
