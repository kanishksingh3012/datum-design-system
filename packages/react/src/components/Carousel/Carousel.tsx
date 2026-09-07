import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import styles from "./Carousel.module.css";

export interface CarouselSlideDef {
  id: string;
  label: string;
  content: ReactNode;
}

export interface CarouselOwnProps {
  label: string;
  slides: CarouselSlideDef[];
  /** ms between auto-advances. Omit to disable auto-rotation entirely. */
  autoRotateMs?: number;
}

export type CarouselProps = CarouselOwnProps;

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Native CSS scroll-snap does the actual sliding - no JS scroll
 * animation to get wrong. Auto-rotation is opt-in via autoRotateMs, is
 * always off when the OS is set to reduced motion (checked live, not
 * just on mount), pauses on hover/focus, and the Pause control sits in
 * the DOM before the slides per the APG carousel example.
 */
export function Carousel({ label, slides, autoRotateMs }: CarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<Array<HTMLDivElement | null>>([]);
  const groupId = useId();
  const [activeIndex, setActiveIndex] = useState(0);
  const [manuallyPaused, setManuallyPaused] = useState(false);
  const [hovering, setHovering] = useState(false);

  const autoRotateEnabled = autoRotateMs !== undefined && !manuallyPaused && !hovering;

  useEffect(() => {
    if (!autoRotateEnabled) return;
    if (prefersReducedMotion()) return;
    const timer = setInterval(() => {
      setActiveIndex((index) => (index + 1) % slides.length);
    }, autoRotateMs);
    return () => clearInterval(timer);
  }, [autoRotateEnabled, autoRotateMs, slides.length]);

  useEffect(() => {
    slideRefs.current[activeIndex]?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
  }, [activeIndex]);

  function goTo(index: number) {
    setActiveIndex((index + slides.length) % slides.length);
  }

  return (
    <div
      className={styles.root}
      aria-roledescription="carousel"
      aria-label={label}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onFocus={() => setHovering(true)}
      onBlur={() => setHovering(false)}
    >
      <div className={styles.controls}>
        {autoRotateMs !== undefined ? (
          <button
            type="button"
            className={styles.control}
            aria-pressed={manuallyPaused}
            onClick={() => setManuallyPaused((value) => !value)}
          >
            {manuallyPaused ? "Play" : "Pause"}
          </button>
        ) : null}
        <button type="button" aria-label="Previous slide" className={styles.control} onClick={() => goTo(activeIndex - 1)}>
          &#8249;
        </button>
        <button type="button" aria-label="Next slide" className={styles.control} onClick={() => goTo(activeIndex + 1)}>
          &#8250;
        </button>
      </div>
      <div ref={trackRef} className={styles.track}>
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            ref={(node) => {
              slideRefs.current[index] = node;
            }}
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${slides.length}: ${slide.label}`}
            className={styles.slide}
          >
            {slide.content}
          </div>
        ))}
      </div>
      <div role="tablist" aria-label={`${label} slides`} className={styles.dots}>
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            role="tab"
            id={`${groupId}-${slide.id}`}
            aria-selected={index === activeIndex}
            aria-label={`Go to slide ${index + 1}`}
            className={styles.dot}
            data-active={index === activeIndex || undefined}
            onClick={() => goTo(index)}
          />
        ))}
      </div>
    </div>
  );
}
