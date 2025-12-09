"use client";

import { useEffect, useRef, useState } from "react";

export function useInView(options?: IntersectionObserverInit) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const disableAnimation =
      typeof window !== "undefined" ? window.innerWidth <= 1024 : false;

    if (
      typeof window === "undefined" ||
      !("IntersectionObserver" in window) ||
      disableAnimation
    ) {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
      },
      options ?? { threshold: 0.2 }
    );

    observer.observe(node);
    return () => {
      observer.unobserve(node);
      observer.disconnect();
    };
  }, [options]);

  return { ref, inView };
}
