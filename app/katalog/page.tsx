"use client";

import CourseCatalog from "@/components/CourseCatalog";
import { useInView } from "@/lib/useInView";

function AnimatedWrapper({ children }: { children: React.ReactNode }) {
  const { ref, inView } = useInView({ threshold: 0.2 });

  return (
    <div
      ref={ref}
      className={`transition-all duration-400 ease-out transform ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      {children}
    </div>
  );
}

export default function Page() {
  return (
    <AnimatedWrapper>
      <CourseCatalog />
    </AnimatedWrapper>
  );
}
