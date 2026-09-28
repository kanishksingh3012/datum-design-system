import { forwardRef, type HTMLAttributes, type ReactElement } from "react";
import { useControlledState } from "react-stately/useControlledState";
import { Button } from "../Button/Button";
import styles from "./Pagination.module.css";

export type PaginationSize = "sm" | "md";

export interface PaginationOwnProps {
  /** How many pages there are. */
  pageCount: number;
  /** The current page, from 1 (controlled). */
  value?: number;
  /** The page shown at first (uncontrolled). @default 1 */
  defaultValue?: number;
  /** Called with the new page whenever it changes. */
  onValueChange?: (page: number) => void;
  /** 32 / 40px buttons, +4px on touch screens. @default "md" */
  size?: PaginationSize;
  /** Page numbers either side of the current one. @default 1 */
  siblings?: number;
  /** "Page 3 of 12" between the arrows, with no page numbers. @default false */
  compact?: boolean;
  /** Renders every page as a link to this URL (so pages can be crawled and opened in a new tab). */
  getHref?: (page: number) => string;
}

export type PaginationProps = PaginationOwnProps & Omit<HTMLAttributes<HTMLElement>, "defaultValue">;

const seq = (from: number, to: number) => Array.from({ length: to - from + 1 }, (_, i) => from + i);

/** The pages to show, with "…" standing for a gap. Always the same length once there are enough pages. */
export function pageRange(pageCount: number, page: number, siblings = 1): (number | "…")[] {
  const edge = siblings * 2 + 3;
  if (pageCount <= edge + 2) return seq(1, pageCount);
  const left = Math.max(page - siblings, 1);
  const right = Math.min(page + siblings, pageCount);
  if (left <= 3) return [...seq(1, edge), "…", pageCount];
  if (right >= pageCount - 2) return [1, "…", ...seq(pageCount - edge + 1, pageCount)];
  return [1, "…", ...seq(left, right), "…", pageCount];
}

const Arrow = ({ flip }: { flip?: boolean }) => (
  <svg viewBox="0 0 16 16" focusable="false" style={flip ? { transform: "scaleX(-1)" } : undefined}>
    <path d="M10 3.5L5.5 8l4.5 4.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/**
 * Move through pages of results. Built from Buttons, so every page
 * inherits Button's hover, press, focus and touch-target rules; the
 * current page is ink and carries aria-current="page".
 */
export const Pagination = forwardRef<HTMLElement, PaginationProps>(function Pagination(
  {
    pageCount,
    value,
    defaultValue = 1,
    onValueChange,
    size = "md",
    siblings = 1,
    compact = false,
    getHref,
    className,
    "aria-label": ariaLabel = "Pagination",
    ...rest
  },
  ref
) {
  const [current, setCurrent] = useControlledState(value, defaultValue, onValueChange);
  const page = Math.min(Math.max(current, 1), Math.max(pageCount, 1));
  const go = (next: number) => {
    if (next !== page) setCurrent(next);
  };
  const link = (target: number) =>
    getHref ? (props: Record<string, unknown>) => (<a {...props} href={getHref(target)} />) as ReactElement : undefined;

  const step = (dir: -1 | 1) => {
    const target = page + dir;
    const disabled = target < 1 || target > pageCount;
    return (
      <li>
        <Button
          intent="neutral"
          appearance="ghost"
          size={size}
          iconOnly
          label={dir < 0 ? "Previous page" : "Next page"}
          disabled={disabled}
          onClick={() => go(target)}
          render={disabled ? undefined : link(target)}
        >
          <Arrow flip={dir > 0} />
        </Button>
      </li>
    );
  };

  return (
    <nav
      ref={ref}
      aria-label={ariaLabel}
      className={[styles.root, className].filter(Boolean).join(" ")}
      data-size={size}
      data-compact={compact || undefined}
      {...rest}
    >
      <ol className={styles.list}>
        {step(-1)}
        {compact ? (
          <li className={styles.status}>
            Page {page} of {pageCount}
          </li>
        ) : (
          pageRange(pageCount, page, siblings).map((n, i) =>
            n === "…" ? (
              <li key={`gap-${i}`} className={styles.gap} aria-hidden="true">
                …
              </li>
            ) : (
              <li key={n}>
                <Button
                  intent="neutral"
                  appearance={n === page ? "solid" : "ghost"}
                  size={size}
                  className={styles.page}
                  aria-current={n === page ? "page" : undefined}
                  aria-label={`Page ${n}`}
                  onClick={() => go(n)}
                  render={link(n)}
                >
                  {n}
                </Button>
              </li>
            )
          )
        )}
        {step(1)}
      </ol>
    </nav>
  );
});

Pagination.displayName = "Pagination";
