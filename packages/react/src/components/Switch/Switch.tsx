import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from "react";
import { mergeProps, useObjectRef, useSwitch } from "react-aria";
import { useToggleState } from "react-stately";
import styles from "./Switch.module.css";

export type SwitchSize = "sm" | "md";
export type SwitchLabelPosition = "start" | "end";

export interface SwitchOwnProps {
  /** Names the setting; pressing it flips the switch. */
  label: ReactNode;
  /** A second line under the label, one type step down. */
  description?: ReactNode;
  /** 32 × 20 / 40 × 24px track. @default "md" */
  size?: SwitchSize;
  /** Which side of the switch the label sits on. `start` puts the switch at the end of the row. @default "end" */
  labelPosition?: SwitchLabelPosition;
  /** On (controlled). */
  checked?: boolean;
  /** Starting state (uncontrolled). @default false */
  defaultChecked?: boolean;
  /** Called with the new state. A switch applies at once — no Save step. */
  onCheckedChange?: (checked: boolean) => void;
  /** @default false */
  disabled?: boolean;
}

/** `className` goes on the `<label>` row; `ref` and every other prop go on the native `<input role="switch">`. */
export type SwitchProps = SwitchOwnProps &
  Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "role" | "size" | "checked" | "defaultChecked" | "children">;

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(function Switch(
  {
    label,
    description,
    size = "md",
    labelPosition = "end",
    checked,
    defaultChecked,
    onCheckedChange,
    disabled = false,
    className,
    style,
    ...rest
  },
  forwardedRef
) {
  const ref = useObjectRef(forwardedRef);
  const descriptionId = useId();
  const labelId = useId();
  const state = useToggleState({ isSelected: checked, defaultSelected: defaultChecked, onChange: onCheckedChange });
  const { inputProps, labelProps } = useSwitch(
    {
      children: label,
      isDisabled: disabled,
      value: typeof rest.value === "string" ? rest.value : undefined,
      name: rest.name,
      "aria-labelledby": description ? labelId : undefined,
      "aria-describedby": description ? descriptionId : undefined,
    },
    state,
    ref
  );

  return (
    <label
      {...labelProps}
      className={[styles.root, className].filter(Boolean).join(" ")}
      style={style}
      data-size={size}
      data-label-position={labelPosition}
      data-state={state.isSelected ? "checked" : "unchecked"}
      data-disabled={disabled || undefined}
    >
      <input {...mergeProps(rest, inputProps)} ref={ref} className={styles.input} />
      <span className={styles.track} data-control="" aria-hidden="true">
        <span className={styles.thumb} />
      </span>
      <span className={styles.text}>
        <span id={labelId}>{label}</span>
        {description && (
          <span id={descriptionId} className={styles.description}>
            {description}
          </span>
        )}
      </span>
    </label>
  );
});

Switch.displayName = "Switch";
