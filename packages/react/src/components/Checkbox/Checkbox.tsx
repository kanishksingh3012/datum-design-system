import { createContext, forwardRef, useContext, useId, type HTMLAttributes, type InputHTMLAttributes, type ReactNode, type Ref } from "react";
import { mergeProps, useCheckbox, useCheckboxGroup, useCheckboxGroupItem, useObjectRef } from "react-aria";
import { useCheckboxGroupState, useToggleState, type CheckboxGroupState } from "react-stately";
import { CheckIcon, DashIcon } from "../../lib/formIcons";
import { useControllableState } from "../../lib/useControllableState";
import { FieldFrame, type FieldProps } from "../Field/Field";
import styles from "./Checkbox.module.css";

export type CheckboxSize = "sm" | "md";
export type CheckedState = boolean | "indeterminate";

export interface CheckboxOwnProps {
  /** Text beside the box; pressing it toggles the box. */
  label: ReactNode;
  /** A second line under the label, one type step down. */
  description?: ReactNode;
  /** 16 / 20px box. Inside a CheckboxGroup, defaults to the group's size. @default "md" */
  size?: CheckboxSize;
  /** Checked state (controlled). `"indeterminate"` shows a dash — for a parent of partly checked children. */
  checked?: CheckedState;
  /** Starting state (uncontrolled). @default false */
  defaultChecked?: CheckedState;
  /** Called with the new state. A press always lands on true or false, never indeterminate. */
  onCheckedChange?: (checked: boolean) => void;
  /** Inside a CheckboxGroup, the value it adds to the group's value. */
  value?: string;
  /** @default false */
  disabled?: boolean;
  /** Draws the box in the danger color and sets aria-invalid. @default false */
  invalid?: boolean;
  /** @default false */
  required?: boolean;
}

/** `className` goes on the `<label>` row; `ref` and every other prop go on the native `<input type="checkbox">`. */
export type CheckboxProps = CheckboxOwnProps &
  Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size" | "checked" | "defaultChecked" | "value" | "children">;

interface GroupContextValue {
  state: CheckboxGroupState;
  size: CheckboxSize;
  invalid: boolean;
}
const CheckboxGroupContext = createContext<GroupContextValue | null>(null);

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(props, ref) {
  const group = useContext(CheckboxGroupContext);
  return group ? <GroupCheckbox {...props} group={group} forwardedRef={ref} /> : <StandaloneCheckbox {...props} forwardedRef={ref} />;
});

Checkbox.displayName = "Checkbox";

type InnerProps = CheckboxProps & { forwardedRef: Ref<HTMLInputElement> };

function StandaloneCheckbox({ checked: checkedProp, defaultChecked = false, onCheckedChange, forwardedRef, ...props }: InnerProps) {
  const ref = useObjectRef(forwardedRef);
  const descriptionId = useId();
  const labelId = useId();
  const [checked, setChecked] = useControllableState<CheckedState>(checkedProp, defaultChecked, onCheckedChange as (value: CheckedState) => void);
  const toggle = useToggleState({ isSelected: checked === true, onChange: setChecked });
  const { inputProps, labelProps } = useCheckbox(
    {
      children: props.label,
      value: props.value,
      name: props.name,
      isIndeterminate: checked === "indeterminate",
      isDisabled: props.disabled,
      isInvalid: props.invalid,
      isRequired: props.required,
      validationBehavior: "native",
      "aria-labelledby": props.description ? labelId : undefined,
      "aria-describedby": props.description ? descriptionId : undefined,
    },
    toggle,
    ref
  );
  return <CheckboxView {...props} state={checked} inputProps={inputProps} labelProps={labelProps} inputRef={ref} descriptionId={descriptionId} labelId={labelId} />;
}

function GroupCheckbox({ group, forwardedRef, checked: _c, defaultChecked: _d, onCheckedChange: _o, ...props }: InnerProps & { group: GroupContextValue }) {
  const ref = useObjectRef(forwardedRef);
  const descriptionId = useId();
  const labelId = useId();
  const { inputProps, labelProps } = useCheckboxGroupItem(
    {
      children: props.label,
      value: props.value ?? "",
      isDisabled: props.disabled,
      "aria-labelledby": props.description ? labelId : undefined,
      "aria-describedby": props.description ? descriptionId : undefined,
    },
    group.state,
    ref
  );
  const state = group.state.isSelected(props.value ?? "");
  return (
    <CheckboxView
      {...props}
      size={props.size ?? group.size}
      invalid={props.invalid || group.invalid}
      disabled={props.disabled || group.state.isDisabled}
      state={state}
      inputProps={inputProps}
      labelProps={labelProps}
      inputRef={ref}
      descriptionId={descriptionId}
      labelId={labelId}
    />
  );
}

function CheckboxView({
  label,
  description,
  size = "md",
  disabled,
  invalid,
  state,
  inputProps,
  labelProps,
  inputRef,
  descriptionId,
  labelId,
  className,
  style,
  // consumed by the hooks above
  value: _value,
  required: _required,
  name: _name,
  ...rest
}: CheckboxProps & {
  state: CheckedState;
  inputProps: InputHTMLAttributes<HTMLInputElement>;
  labelProps: HTMLAttributes<HTMLLabelElement>;
  inputRef: Ref<HTMLInputElement>;
  descriptionId: string;
  labelId: string;
}) {
  return (
    <label
      {...labelProps}
      className={[styles.root, className].filter(Boolean).join(" ")}
      style={style}
      data-size={size}
      data-state={state === "indeterminate" ? "indeterminate" : state ? "checked" : "unchecked"}
      data-disabled={disabled || undefined}
      data-invalid={invalid || undefined}
    >
      <input {...mergeProps(rest, inputProps)} ref={inputRef} className={styles.input} />
      <span className={styles.box} data-control="" aria-hidden="true">
        <CheckIcon className={`${styles.mark} ${styles.check}`} />
        <DashIcon className={`${styles.mark} ${styles.dash}`} />
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
}

export type CheckboxGroupOrientation = "vertical" | "horizontal";

export interface CheckboxGroupOwnProps extends FieldProps {
  /** @default "vertical" */
  orientation?: CheckboxGroupOrientation;
  /** Size of every Checkbox inside. @default "md" */
  size?: CheckboxSize;
  /** The checked values (controlled). */
  value?: string[];
  /** The starting values (uncontrolled). @default [] */
  defaultValue?: string[];
  /** Called with every checked value after a change. */
  onValueChange?: (value: string[]) => void;
  /** Form field name shared by every checkbox. */
  name?: string;
  children: ReactNode;
}

export type CheckboxGroupProps = CheckboxGroupOwnProps & Omit<HTMLAttributes<HTMLDivElement>, "children" | "defaultValue" | "onChange">;

/** A labelled set of Checkboxes that share one value (an array), help text and error text. */
export const CheckboxGroup = forwardRef<HTMLDivElement, CheckboxGroupProps>(function CheckboxGroup(
  {
    label,
    helpText,
    errorText,
    required = false,
    disabled = false,
    readOnly = false,
    orientation = "vertical",
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
    value,
    defaultValue,
    onChange: onValueChange,
    name,
  };
  const state = useCheckboxGroupState(groupProps);
  const { groupProps: aria, labelProps, descriptionProps, errorMessageProps } = useCheckboxGroup(groupProps, state);

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
      rootProps={mergeProps(rest, aria)}
      className={className}
    >
      <div className={styles.options} data-orientation={orientation}>
        <CheckboxGroupContext.Provider value={{ state, size, invalid }}>{children}</CheckboxGroupContext.Provider>
      </div>
    </FieldFrame>
  );
});

CheckboxGroup.displayName = "CheckboxGroup";
