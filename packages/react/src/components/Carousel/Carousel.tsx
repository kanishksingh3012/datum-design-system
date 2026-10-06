import { forwardRef, useEffect, useRef, useState, type HTMLAttributes, type ReactNode } from "react";
import { mergeProps, useFocusVisible, useFocusWithin, useHover, useMove } from "react-aria";
import { useControlledState } from "react-stately/useControlledState";
import { Button } from "../Button/Button";
import styles from "./Carousel.module.css";

export interface CarouselSlide {
  /** Stable key; falls back to the index. */
  id?: string;
  /** Names the slide for screen readers, after "2 of 5". */
  label?: string;
  content: ReactNode;
}

export interface CarouselOwnProps {
  /** Names the carousel, e.g. "Featured stories". */
  label: string;
  slides: CarouselSlide[];
  /** The index of the slide shown (controlled). */
  value?: number;
  /** The first slide shown (uncontrolled). @default 0 */
  defaultValue?: number;
  /** Called with the new index when the slide changes. */
  onValueChange?: (index: number) => void;
  /** Advances on its own every this many ms, with a pause button. Never under reduced motion. */
  autoplay?: number;
  /** Wraps from the last slide to the first. @default true */
  loop?: boolean;
}

/** `ref`, `className` and every other prop go on the root. */
export type CarouselProps = CarouselOwnProps & Omit<HTMLAttributes<HTMLElement>, "defaultValue" | "onChange">;

const Arrow = ({ back }: { back?: boolean }) => (
  <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
    <path d={back ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6"} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const PauseIcon = (
  <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
    <path d="M9 6v12M15 6v12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);
const PlayIcon = (
  <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
    <path d="M8 5.5v13l10-6.5z" fill="currentColor" />
  </svg>
);

/** Live: turning reduced motion on mid-rotation stops it. */
function useReducedMotion() {
  const query = "(prefers-reduced-motion: reduce)";
  const [reduced, setReduced] = useState(() => typeof matchMedia === "function" && matchMedia(query).matches);
  useEffect(() => {
    if (typeof matchMedia !== "function") return;
    const list = matchMedia(query);
    const onChange = () => setReduced(list.matches);
    onChange();
    list.addEventListener?.("change", onChange);
    return () => list.removeEventListener?.("change", onChange);
  }, []);
  return reduced;
}

/**
 * One slide at a time, with previous / next buttons and a row of slide
 * buttons below — the APG carousel pattern. Slides move by `transform`
 * (motion.normal; instant under reduced motion) and can be swiped. Hidden
 * slides are inert, so their links are out of the tab order. Autoplay is
 * opt-in, has a pause button first in the tab order, pauses while the
 * pointer is over a slide or keyboard focus is inside, and never runs under
 * reduced motion. Pressing Start rotates again whatever is hovered or focused.
 */
export const Carousel = forwardRef<HTMLElement, CarouselProps>(function Carousel(
  { label, slides, value, defaultValue = 0, onValueChange, autoplay, loop = true, className, ...rest },
  ref
) {
  const count = slides.length;
  const [index, setIndex] = useControlledState(value, defaultValue, onValueChange);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focusWithin, setFocusWithin] = useState(false);
  // keyboard focus only: a mouse click leaves focus on the button it hit, which must not stop rotation for good
  const { isFocusVisible } = useFocusVisible();
  const focused = focusWithin && isFocusVisible;
  const reduced = useReducedMotion();
  const rotating = autoplay !== undefined && !reduced && !paused;
  // Start was pressed: rotate even though focus (and likely the pointer) is still inside
  const [resumed, setResumed] = useState(false);
  const running = rotating && (resumed || (!hovered && !focused));

  const go = (next: number) => {
    const target = loop ? (next + count) % count : Math.min(count - 1, Math.max(0, next));
    if (target !== index) setIndex(target);
  };
  const latest = useRef(go);
  latest.current = go;

  useEffect(() => {
    if (!running || count < 2) return;
    const timer = setInterval(() => latest.current(index + 1), autoplay);
    return () => clearInterval(timer);
  }, [running, autoplay, index, count]);

  const { hoverProps } = useHover({ onHoverChange: setHovered });
  const { focusWithinProps } = useFocusWithin({ onFocusWithinChange: setFocusWithin });
  // a horizontal swipe of a quarter of the slide turns it
  const swipe = useRef(0);
  const viewport = useRef<HTMLDivElement>(null);
  const { moveProps } = useMove({
    onMoveStart: () => {
      swipe.current = 0;
    },
    onMove: (e) => {
      if (e.pointerType !== "keyboard") swipe.current += e.deltaX;
    },
    onMoveEnd: () => {
      const width = viewport.current?.offsetWidth ?? 0;
      if (Math.abs(swipe.current) > width / 4) go(index + (swipe.current < 0 ? 1 : -1));
    },
  });
  // useMove would also take arrow keys on the viewport; keep only pointer handling
  const { onKeyDown: _keys, ...pointerProps } = moveProps;
  const atStart = !loop && index === 0;
  const atEnd = !loop && index === count - 1;

  return (
    <section
      {...mergeProps(rest, focusWithinProps)}
      ref={ref}
      className={[styles.root, className].filter(Boolean).join(" ")}
      aria-roledescription="carousel"
      aria-label={label}
    >
      <div ref={viewport} className={styles.viewport} {...mergeProps(pointerProps, hoverProps)}>
        <div
          className={styles.track}
          style={{ transform: `translateX(${-index * 100}%)` }}
          aria-live={rotating ? "off" : "polite"}
        >
          {slides.map((slide, i) => (
            <div
              key={slide.id ?? i}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${count}${slide.label ? `: ${slide.label}` : ""}`}
              className={styles.slide}
              aria-hidden={i === index ? undefined : true}
              {...(i === index ? {} : { inert: "" })}
            >
              {slide.content}
            </div>
          ))}
        </div>
      </div>
      <div className={styles.controls}>
        {autoplay !== undefined && !reduced ? (
          <Button
            intent="neutral"
            appearance="ghost"
            size="sm"
            iconOnly
            label={paused ? "Start slide rotation" : "Stop slide rotation"}
            onClick={() => {
              setResumed(paused);
              setPaused(!paused);
            }}
            className={styles.pause}
          >
            {paused ? PlayIcon : PauseIcon}
          </Button>
        ) : null}
        <div className={styles.nav}>
        <Button intent="neutral" appearance="outline" size="sm" iconOnly label="Previous slide" disabled={atStart} onClick={() => go(index - 1)}>
          <Arrow back />
        </Button>
        <div className={styles.dots}>
          {slides.map((slide, i) => (
            <button
              key={slide.id ?? i}
              type="button"
              className={styles.dot}
              aria-label={`Slide ${i + 1}${slide.label ? `: ${slide.label}` : ""}`}
              aria-current={i === index ? "true" : undefined}
              onClick={() => go(i)}
            />
          ))}
        </div>
        <Button intent="neutral" appearance="outline" size="sm" iconOnly label="Next slide" disabled={atEnd} onClick={() => go(index + 1)}>
          <Arrow />
        </Button>
        </div>
      </div>
    </section>
  );
});

Carousel.displayName = "Carousel";
