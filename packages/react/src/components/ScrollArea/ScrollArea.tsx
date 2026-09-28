import { forwardRef, useEffect, useRef, useState, type HTMLAttributes, type Ref } from "react";
import { mergeRefs } from "react-aria";
import styles from "./ScrollArea.module.css";

export type ScrollAreaOrientation = "vertical" | "horizontal" | "both";
export type ScrollAreaPadding = "none" | "sm" | "md";

export interface ScrollAreaOwnProps {
  /** Which way the content scrolls. @default "vertical" */
  orientation?: ScrollAreaOrientation;
  /** The largest the area grows before it scrolls, e.g. 320 or "50vh". Or size it with `style`. */
  maxHeight?: number | string;
  /** Space between the content and all four edges, which scrolls with the content: 0 / 12 / 16px. @default "md" */
  padding?: ScrollAreaPadding;
  /** Names the area as a region for screen readers. Without it, pass `aria-label` or `aria-labelledby` if it needs a name. */
  label?: string;
}

/** `ref`, `className` and every other prop go on the scrolling element. */
export type ScrollAreaProps = ScrollAreaOwnProps & HTMLAttributes<HTMLDivElement>;

/**
 * A box that scrolls its content natively, with thin scrollbars drawn in
 * `border.strong` (3:1 against the surface). While the content overflows the
 * area is in the tab order, so keyboard users can focus it and scroll with the
 * arrow keys; when it fits, it isn't a tab stop. The padding sits on an inner
 * wrapper, so content never runs into an edge, even scrolled to the end. `scrollbar-gutter: stable`
 * keeps content from shifting when a scrollbar appears.
 */
export const ScrollArea = forwardRef<HTMLDivElement, ScrollAreaProps>(function ScrollArea(
  { orientation = "vertical", maxHeight, padding = "md", label, className, style, tabIndex, children, ...rest },
  ref
) {
  const own = useRef<HTMLDivElement>(null);
  const [overflows, setOverflows] = useState(false);

  useEffect(() => {
    const el = own.current;
    if (!el) return;
    const measure = () =>
      setOverflows(
        (orientation !== "horizontal" && el.scrollHeight > el.clientHeight) ||
          (orientation !== "vertical" && el.scrollWidth > el.clientWidth)
      );
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    [...el.children].forEach((child) => observer.observe(child));
    return () => observer.disconnect();
  }, [orientation]);

  return (
    <div
      ref={mergeRefs(ref, own) as Ref<HTMLDivElement>}
      role={label ? "region" : undefined}
      aria-label={label}
      tabIndex={tabIndex ?? (overflows ? 0 : undefined)}
      className={[styles.root, className].filter(Boolean).join(" ")}
      data-orientation={orientation}
      data-padding={padding}
      style={maxHeight !== undefined ? { maxHeight, ...style } : style}
      {...rest}
    >
      <div className={styles.content}>{children}</div>
    </div>
  );
});

ScrollArea.displayName = "ScrollArea";
