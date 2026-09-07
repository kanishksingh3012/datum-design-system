import { forwardRef, useId, type InputHTMLAttributes } from "react";
import styles from "./Slider.module.css";

export interface SliderOwnProps {
  /** Never substitute with placeholder - placeholder-as-label is banned. */
  label: string;
}

export type SliderProps = SliderOwnProps & Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "id">;

export const Slider = forwardRef<HTMLInputElement, SliderProps>(function Slider(
  { label, className, ...rest },
  ref
) {
  const inputId = useId();
  return (
    <div className={styles.root}>
      <label className={styles.label} htmlFor={inputId}>
        {label}
      </label>
      <input
        ref={ref}
        id={inputId}
        type="range"
        className={[styles.input, className].filter(Boolean).join(" ")}
        {...rest}
      />
    </div>
  );
});

Slider.displayName = "Slider";
