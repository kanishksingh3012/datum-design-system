import { forwardRef, type HTMLAttributes, type Ref } from "react";
import styles from "./Separator.module.css";

export type SeparatorOrientation = "horizontal" | "vertical";
export type SeparatorTone = "subtle" | "default";

export interface SeparatorOwnProps {
  /** @default "horizontal" */
  orientation?: SeparatorOrientation;
  /** border.subtle or border.default. Both are decorative. @default "subtle" */
  tone?: SeparatorTone;
  /** Text in the middle of the line, e.g. "or". Also becomes the separator's accessible name. */
  label?: string;
}

export type SeparatorProps = SeparatorOwnProps & Omit<HTMLAttributes<HTMLElement>, "role" | "children">;

export const Separator = forwardRef<HTMLElement, SeparatorProps>(function Separator(
  { orientation = "horizontal", tone = "subtle", label, className, ...rest },
  ref
) {
  const shared = {
    "data-orientation": orientation,
    "data-tone": tone,
    "aria-orientation": orientation === "vertical" ? ("vertical" as const) : undefined,
    className: [styles.root, className].filter(Boolean).join(" "),
    ...rest,
  };

  // A plain line is a native <hr>. With a label it needs children, which <hr> can't
  // have, so it becomes a div with the separator role and the label as its name.
  if (!label) return <hr ref={ref as Ref<HTMLHRElement>} {...shared} />;
  return (
    <div ref={ref as Ref<HTMLDivElement>} role="separator" aria-label={label} data-labelled="" {...shared}>
      <span className={styles.line} />
      <span className={styles.label} aria-hidden="true">{label}</span>
      <span className={styles.line} />
    </div>
  );
});

Separator.displayName = "Separator";
