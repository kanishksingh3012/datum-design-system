import { forwardRef, type LabelHTMLAttributes } from "react";
import styles from "./Label.module.css";

export interface LabelOwnProps {
  /**
   * Adds the required indicator (a `*` hidden from assistive tech — the
   * control itself carries `required`, which is what gets announced). @default false
   */
  required?: boolean;
  /**
   * `span` names a group (a set of checkboxes or radios, a custom widget)
   * that a `<label>` can't point at; wire it with `id` + `aria-labelledby`. @default "label"
   */
  as?: "label" | "span";
}

export type LabelProps = LabelOwnProps & LabelHTMLAttributes<HTMLLabelElement>;

export const Label = forwardRef<HTMLLabelElement, LabelProps>(function Label(
  { required = false, as: Element = "label", className, children, ...rest },
  ref
) {
  return (
    <Element ref={ref} className={[styles.root, className].filter(Boolean).join(" ")} {...rest}>
      {children}
      {required && (
        <span className={styles.required} aria-hidden="true">
          *
        </span>
      )}
    </Element>
  );
});

Label.displayName = "Label";
