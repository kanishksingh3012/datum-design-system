import { createContext, forwardRef, useContext, useId, type HTMLAttributes, type InputHTMLAttributes, type ReactNode } from "react";
import { mergeProps, useObjectRef, useRadio, useRadioGroup } from "react-aria";
import { useRadioGroupState, type RadioGroupState } from "react-stately";
import { FieldFrame, type FieldProps } from "../Field/Field";
import styles from "./Radio.module.css";

export type RadioSize = "sm" | "md";
export type RadioGroupOrientation = "vertical" | "horizontal";
export type RadioGroupAppearance = "default" | "card";

interface GroupContextValue {
  state: RadioGroupState;
  size: RadioSize;
  appearance: RadioGroupAppearance;
  invalid: boolean;
}
const RadioGroupContext = createContext<GroupContextValue | null>(null);

export interface RadioGroupOwnProps extends FieldProps {
  /** @default "vertical" */
  orientation?: RadioGroupOrientation;
  /** `card` makes every option a large selectable tile (e.g. pricing plans). @default "default" */
  appearance?: RadioGroupAppearance;
  /** Size of every Radio inside. @default "md" */
  size?: RadioSize;
  /** The selected value (controlled); null for none. */
  value?: string | null;
  /** The starting value (uncontrolled). */
  defaultValue?: string | null;
  /** Called with the newly selected value. */
  onValueChange?: (value: string) => void;
  /** Form field name; generated when omitted. */
  name?: string;
  children: ReactNode;
}

export type RadioGroupProps = RadioGroupOwnProps & Omit<HTMLAttributes<HTMLDivElement>, "children" | "defaultValue" | "onChange">;

/** One choice from a small set. Arrow keys move the selection; Tab enters and leaves the group. */
export const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(function RadioGroup(
  {
    label,
    helpText,
    errorText,
    required = false,
    disabled = false,
    readOnly = false,
    orientation = "vertical",
    appearance = "default",
    size = "md",
    value,
    defaultValue,
    onValueChange,
    name,
    className,
    children,
    ...rest
  },
  ref
) {
  const invalid = Boolean(errorText);
  const groupProps = {
    label,
    description: errorText ? undefined : helpText,
    errorMessage: errorText,
    isInvalid: invalid,
    isDisabled: disabled,
    isReadOnly: readOnly,
    isRequired: required,
    orientation,
    value,
    defaultValue,
    onChange: onValueChange,
    name,
  };
  const state = useRadioGroupState(groupProps);
  const { radioGroupProps, labelProps, descriptionProps, errorMessageProps } = useRadioGroup(groupProps, state);

  return (
    <FieldFrame
      ref={ref}
      label={label}
      labelAs="span"
      labelProps={labelProps}
      helpText={helpText}
      errorText={errorText}
      required={required}
      disabled={disabled}
      readOnly={readOnly}
      descriptionProps={descriptionProps}
      errorMessageProps={errorMessageProps}
      rootProps={mergeProps(rest, radioGroupProps)}
      className={className}
    >
      <div className={styles.options} data-orientation={orientation} data-appearance={appearance}>
        <RadioGroupContext.Provider value={{ state, size, appearance, invalid }}>{children}</RadioGroupContext.Provider>
      </div>
    </FieldFrame>
  );
});

RadioGroup.displayName = "RadioGroup";

export interface RadioOwnProps {
  /** The value this option gives the group. */
  value: string;
  /** Text beside the circle (the title of a card). */
  label: ReactNode;
  /** A second line under the label, one type step down. */
  description?: ReactNode;
  /** Defaults to the group's size. */
  size?: RadioSize;
  /** @default false */
  disabled?: boolean;
  /** Extra content under the description — card appearance only (e.g. a price). */
  children?: ReactNode;
}

/** `className` goes on the `<label>`; `ref` and every other prop go on the native `<input type="radio">`. Must be inside a RadioGroup. */
export type RadioProps = RadioOwnProps & Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size" | "value" | "children">;

export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio(
  { value, label, description, size: sizeProp, disabled = false, className, style, children, ...rest },
  forwardedRef
) {
  const group = useContext(RadioGroupContext);
  if (!group) throw new Error("Radio must be used inside a RadioGroup.");
  const ref = useObjectRef(forwardedRef);
  const descriptionId = useId();
  const labelId = useId();
  const { inputProps, labelProps, isSelected } = useRadio(
    {
      value,
      children: label,
      isDisabled: disabled,
      "aria-labelledby": description ? labelId : undefined,
      "aria-describedby": description ? descriptionId : undefined,
    },
    group.state,
    ref
  );
  const card = group.appearance === "card";

  return (
    <label
      {...labelProps}
      className={[styles.root, className].filter(Boolean).join(" ")}
      style={style}
      data-size={sizeProp ?? group.size}
      data-appearance={group.appearance}
      data-state={isSelected ? "checked" : "unchecked"}
      data-disabled={disabled || group.state.isDisabled || undefined}
      data-readonly={group.state.isReadOnly || undefined}
      data-invalid={group.invalid || undefined}
      data-control={card ? "" : undefined}
    >
      <input {...mergeProps(rest, inputProps)} ref={ref} className={styles.input} />
      <span className={styles.circle} data-control={card ? undefined : ""} aria-hidden="true" />
      <span className={styles.text}>
        <span id={labelId} className={styles.label}>{label}</span>
        {description && (
          <span id={descriptionId} className={styles.description}>
            {description}
          </span>
        )}
        {card && children}
      </span>
    </label>
  );
});

Radio.displayName = "Radio";
