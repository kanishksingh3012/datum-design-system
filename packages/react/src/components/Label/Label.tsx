import { forwardRef, type LabelHTMLAttributes } from "react";
import styles from "./Label.module.css";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface LabelOwnProps {}

export type LabelProps = LabelOwnProps & LabelHTMLAttributes<HTMLLabelElement>;

export const Label = forwardRef<HTMLLabelElement, LabelProps>(function Label(
  { className, ...rest },
  ref
) {
  return <label ref={ref} className={[styles.root, className].filter(Boolean).join(" ")} {...rest} />;
});

Label.displayName = "Label";
