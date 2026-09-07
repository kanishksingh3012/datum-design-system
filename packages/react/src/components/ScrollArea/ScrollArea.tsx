import { forwardRef, type HTMLAttributes } from "react";
import styles from "./ScrollArea.module.css";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ScrollAreaOwnProps {}

export type ScrollAreaProps = ScrollAreaOwnProps & HTMLAttributes<HTMLDivElement>;

/**
 * Native overflow:auto scrolling with scrollbar-gutter:stable so content
 * doesn't shift when a scrollbar appears - custom scrollbar styling
 * (::-webkit-scrollbar / scrollbar-color) is an enhancement layered on
 * top of real, always-functional scrolling, not a replacement for it.
 */
export const ScrollArea = forwardRef<HTMLDivElement, ScrollAreaProps>(function ScrollArea(
  { className, ...rest },
  ref
) {
  return <div ref={ref} className={[styles.root, className].filter(Boolean).join(" ")} {...rest} />;
});

ScrollArea.displayName = "ScrollArea";
