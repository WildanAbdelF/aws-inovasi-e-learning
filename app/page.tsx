"use client";

import HeroSection from "@/components/home/HeroSection";
import FeaturedCourses from "@/components/home/FeaturedCourses";
import LearningModels from "@/components/home/LearningModels";
import Testimonials from "@/components/home/Testimonials";
import CTASection from "@/components/home/CTASection";
import { useInView } from "@/lib/hooks";

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

function HeroAnimatedOnce({ children }: { children: React.ReactNode }) {
  const { ref, inView } = useInView({ threshold: 0.1 });

  return (
    <div
      ref={ref}
      className={`transition-opacity transition-transform duration-500 ease-out ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      {children}
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      <HeroAnimatedOnce>
        <HeroSection />
      </HeroAnimatedOnce>
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
