import { forwardRef, useMemo, type HTMLAttributes } from "react";
import { HiddenSelect, useButton, useObjectRef, useSelect } from "react-aria";
import { useSelectState } from "react-stately";
import { ChevronDownIcon } from "../../lib/formIcons";
import { ListBox, ListPopover, listChildren, type ListOption } from "../../lib/ListBox";
import { useControllableState } from "../../lib/useControllableState";
import { FieldFrame, type FieldProps } from "../Field/Field";
import styles from "./Select.module.css";

export type SelectSize = "sm" | "md" | "lg";

export type SelectOption = ListOption;

export interface SelectOwnProps extends FieldProps {
  /** 32 / 40 / 48px tall with a precise pointer, +4px on touch screens. @default "md" */
  size?: SelectSize;
  options: SelectOption[];
  /** Shown while nothing is selected. @default "Select…" */
  placeholder?: string;
  /** The selected value (controlled); null for none. */
  value?: string | null;
  /** The starting value (uncontrolled). @default null */
  defaultValue?: string | null;
  /** Called with the newly selected value. */
  onValueChange?: (value: string) => void;
  /** Whether the list is open (controlled). */
  open?: boolean;
  /** @default false */
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Form field name, submitted through a hidden native <select>. */
  name?: string;
}

/** `className` and other props go on the field's root; `ref` goes on the trigger button. */
export type SelectProps = SelectOwnProps & Omit<HTMLAttributes<HTMLDivElement>, "children" | "defaultValue" | "onChange" | "placeholder">;

export const Select = forwardRef<HTMLButtonElement, SelectProps>(function Select(
  {
    label,
    helpText,
    errorText,
    required = false,
    disabled = false,
    readOnly = false,
    size = "md",
    options,
    placeholder = "Select…",
    value: valueProp,
    defaultValue = null,
    onValueChange,
    open,
    defaultOpen,
    onOpenChange,
    name,
    className,
    ...rest
  },
  forwardedRef
) {
  const triggerRef = useObjectRef(forwardedRef);
  const [value, setValue] = useControllableState<string | null>(valueProp, defaultValue, onValueChange as (value: string | null) => void);
  const byValue = useMemo(() => new Map(options.map((o) => [o.value, o])), [options]);
  const selectProps = {
    label,
    placeholder,
    description: errorText ? undefined : helpText,
    errorMessage: errorText,
    isInvalid: Boolean(errorText),
    isDisabled: disabled,
    isRequired: required,
    disabledKeys: options.filter((o) => o.disabled).map((o) => o.value),
    selectedKey: value,
    // read-only: focusable, but it never opens and never changes
    onSelectionChange: (key: unknown) => {
      if (!readOnly && key != null) setValue(String(key));
    },
    isOpen: open,
    defaultOpen,
    onOpenChange,
    name,
    children: listChildren(options),
  };
  const state = useSelectState(selectProps);
  const { labelProps, triggerProps, valueProps, menuProps, descriptionProps, errorMessageProps } = useSelect(selectProps, state, triggerRef);
  // read-only: still focusable and announced, but pressing or typing does nothing
  const { buttonProps } = useButton(
    readOnly ? { ...triggerProps, onPress: undefined, onPressStart: undefined, onPressUp: undefined, onKeyDown: undefined, onKeyUp: undefined } : triggerProps,
    triggerRef
  );
  const selected = value != null ? byValue.get(value) : undefined;

  return (
    <FieldFrame
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
      rootProps={rest}
      className={className}
    >
      <HiddenSelect state={state} triggerRef={triggerRef} label={label} name={name} isDisabled={disabled} />
      <button
        {...buttonProps}
        ref={triggerRef}
        className={styles.trigger}
        data-control=""
        data-size={size}
        data-disabled={disabled || undefined}
        data-readonly={readOnly || undefined}
        data-invalid={errorText ? true : undefined}
        data-open={state.isOpen || undefined}
        aria-readonly={readOnly || undefined}
      >
        <span {...valueProps} className={styles.value} data-placeholder={selected ? undefined : ""}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDownIcon className={styles.chevron} />
      </button>
      {state.isOpen && (
        <ListPopover state={state} triggerRef={triggerRef}>
          <ListBox listProps={menuProps} state={state} byValue={byValue} size={size} />
        </ListPopover>
      )}
    </FieldFrame>
  );
});

Select.displayName = "Select";
