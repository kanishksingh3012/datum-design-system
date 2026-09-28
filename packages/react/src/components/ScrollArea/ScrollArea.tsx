import { forwardRef, useCallback, useEffect, useRef, useState, type HTMLAttributes } from "react";
import styles from "./ScrollArea.module.css";

export type ScrollAreaOrientation = "vertical" | "horizontal" | "both";
export type ScrollAreaPadding = "none" | "sm" | "md";

export interface ScrollAreaOwnProps {
  /** Which way the content scrolls. @default "vertical" */
  orientation?: ScrollAreaOrientation;
  /** The largest the area grows before it scrolls, e.g. 320 or "50vh". Or size it with `style`. */
  maxHeight?: number | string;
  /** Space between the box's edges and the region the content scrolls in, on all four sides: 0 / 12 / 16px. @default "md" */
  padding?: ScrollAreaPadding;
  /** Fades the content out at an edge while more of it is hidden past that edge. @default true */
  fade?: boolean;
  /** Names the scrolling region for screen readers. Without it, pass `aria-label` or `aria-labelledby` if it needs a name. */
  label?: string;
}

/** `ref`, `className`, `style` and every other prop go on the outer box; the label and tab stop go on the scrolling region. */
export type ScrollAreaProps = ScrollAreaOwnProps & HTMLAttributes<HTMLDivElement>;

type Edge = "top" | "bottom" | "start" | "end";

/**
 * A box whose content scrolls inside an inset region: the box's padding
 * surrounds a viewport, so content scrolls under the viewport's edge, never
 * into the box's. While more content is hidden past an edge, it fades out
 * there. Scrolling is native, with thin `border.strong` scrollbars. While the
 * content overflows, the viewport is a tab stop, so keyboard users can focus
 * it and scroll with the arrow keys.
 */
export const ScrollArea = forwardRef<HTMLDivElement, ScrollAreaProps>(function ScrollArea(
  {
    orientation = "vertical",
    maxHeight,
    padding = "md",
    fade = true,
    label,
    className,
    style,
    tabIndex,
    children,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledby,
    ...rest
  },
  ref
) {
  const viewport = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  // which edges have content hidden past them, as a space-separated list ("" when it all fits)
  const [hidden, setHidden] = useState("");

  const update = useCallback(() => {
    const el = viewport.current;
    if (!el) return;
    const y = orientation !== "horizontal";
    const x = orientation !== "vertical";
    const left = Math.abs(el.scrollLeft); // negative in right-to-left
    const edges: [Edge, boolean][] = [
      ["top", y && el.scrollTop > 1],
      ["bottom", y && el.scrollTop + el.clientHeight < el.scrollHeight - 1],
      ["start", x && left > 1],
      ["end", x && left + el.clientWidth < el.scrollWidth - 1],
    ];
    setHidden(edges.filter(([, on]) => on).map(([edge]) => edge).join(" "));
  }, [orientation]);

  useEffect(() => {
    update();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(update);
    if (viewport.current) observer.observe(viewport.current);
    if (content.current) observer.observe(content.current);
    return () => observer.disconnect();
  }, [update]);

  return (
    <div
      ref={ref}
      className={[styles.root, className].filter(Boolean).join(" ")}
      data-orientation={orientation}
      data-padding={padding}
      data-fade={fade ? hidden || undefined : undefined}
      style={maxHeight !== undefined ? { maxHeight, ...style } : style}
      {...rest}
    >
      <div
        ref={viewport}
        className={styles.viewport}
        role={label || ariaLabel || ariaLabelledby ? "region" : undefined}
        aria-label={label ?? ariaLabel}
        aria-labelledby={ariaLabelledby}
        tabIndex={tabIndex ?? (hidden ? 0 : undefined)}
        onScroll={update}
      >
        <div ref={content} className={styles.content}>
          {children}
        </div>
      </div>
    </div>
  );
});

ScrollArea.displayName = "ScrollArea";
