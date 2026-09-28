import { forwardRef, useEffect, useMemo, useRef, type HTMLAttributes, type ReactNode } from "react";
import { useButton, useComboBox, useFilter, useObjectRef } from "react-aria";
import { useComboBoxState } from "react-stately";
import { ChevronDownIcon } from "../../lib/formIcons";
import { ListBox, ListPopover, listChildren, type ListOption } from "../../lib/ListBox";
import { useControllableState } from "../../lib/useControllableState";
import { FieldFrame, type FieldProps } from "../Field/Field";
import parts from "../../lib/fieldParts.module.css";
import styles from "./Combobox.module.css";

export type ComboboxSize = "sm" | "md" | "lg";
export type ComboboxOption = ListOption;

export interface ComboboxOwnProps extends FieldProps {
  /** 32 / 40 / 48px tall with a precise pointer, +4px on touch screens. @default "md" */
  size?: ComboboxSize;
  /** The same shape as Select's: value, label, description, disabled, group. */
  options: ComboboxOption[];
  placeholder?: string;
  /** The selected value (controlled); null for none. */
  value?: string | null;
  /** @default null */
  defaultValue?: string | null;
  onValueChange?: (value: string | null) => void;
  /** The text in the input (controlled). */
  inputValue?: string;
  /** @default the selected option's label, or "" */
  defaultInputValue?: string;
  onInputChange?: (inputValue: string) => void;
  /** Whether the list is open (controlled). */
  open?: boolean;
  /** @default false */
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Shown in the list when nothing matches. @default "No results" */
  emptyState?: ReactNode;
  /** Form field name; the input's text is submitted. */
  name?: string;
}

/** `className` and other props go on the field's root; `ref` goes on the input. */
export type ComboboxProps = ComboboxOwnProps &
  Omit<HTMLAttributes<HTMLDivElement>, "children" | "defaultValue" | "onChange" | "placeholder">;

/**
 * A text input that filters a list of options. Focus stays in the input while
 * arrows move through the list (aria-activedescendant); Enter picks, Escape
 * closes. The field and list are Select's, so the two read as siblings.
 */
export const Combobox = forwardRef<HTMLInputElement, ComboboxProps>(function Combobox(
  {
    label,
    helpText,
    errorText,
    required = false,
    disabled = false,
    readOnly = false,
    size = "md",
    options,
    placeholder,
    value: valueProp,
    defaultValue = null,
    onValueChange,
    inputValue,
    defaultInputValue,
    onInputChange,
    open,
    defaultOpen = false,
    onOpenChange,
    emptyState = "No results",
    name,
    className,
    ...rest
  },
  forwardedRef
) {
  const inputRef = useObjectRef(forwardedRef);
  const boxRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listBoxRef = useRef<HTMLUListElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const [value, setValue] = useControllableState<string | null>(valueProp, defaultValue, onValueChange);
  const byValue = useMemo(() => new Map(options.map((o) => [o.value, o])), [options]);
  const { contains } = useFilter({ sensitivity: "base" });

  const comboProps = {
    label,
    placeholder,
    description: errorText ? undefined : helpText,
    errorMessage: errorText,
    isInvalid: Boolean(errorText),
    isDisabled: disabled,
    isReadOnly: readOnly,
    isRequired: required,
    disabledKeys: options.filter((o) => o.disabled).map((o) => o.value),
    selectedKey: value,
    onSelectionChange: (key: unknown) => setValue(key == null ? null : String(key)),
    inputValue,
    defaultInputValue,
    onInputChange,
    onOpenChange: (isOpen: boolean) => onOpenChange?.(isOpen),
    defaultFilter: contains,
    allowsEmptyCollection: true,
    name,
    children: listChildren(options),
  };
  const state = useComboBoxState(comboProps);
  const { buttonProps, inputProps, listBoxProps, labelProps, descriptionProps, errorMessageProps } = useComboBox(
    { ...comboProps, inputRef, buttonRef, listBoxRef, popoverRef },
    state
  );
  const { buttonProps: chevronProps } = useButton(buttonProps, buttonRef);

  // useComboBoxState has no controlled open, so `open` / `defaultOpen` drive it. The list
  // is filtered by the typed text, unless the text is just the selection (then all show).
  const openList = () => state.open(null, state.selectedItem?.textValue === state.inputValue ? "manual" : "input");
  const wanted = open ?? undefined;
  useEffect(() => {
    if (wanted === undefined || wanted === state.isOpen) return;
    if (wanted) openList();
    else state.close();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wanted, state.isOpen]);
  useEffect(() => {
    if (defaultOpen && open === undefined) openList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <FieldFrame
      label={label}
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
      <div
        ref={boxRef}
        className={styles.box}
        data-control=""
        data-size={size}
        data-disabled={disabled || undefined}
        data-readonly={readOnly || undefined}
        data-invalid={errorText ? true : undefined}
        data-open={state.isOpen || undefined}
        onClick={(e) => {
          if (e.target === e.currentTarget) inputRef.current?.focus();
        }}
      >
        <input {...inputProps} ref={inputRef} className={parts.input} />
        <button {...chevronProps} ref={buttonRef} className={parts.button}>
          <ChevronDownIcon data-chevron="" />
        </button>
      </div>
      {state.isOpen && (
        <ListPopover state={state} triggerRef={boxRef} popoverRef={popoverRef} isNonModal>
          <ListBox listProps={listBoxProps} state={state} byValue={byValue} size={size} listBoxRef={listBoxRef} emptyState={emptyState} />
        </ListPopover>
      )}
    </FieldFrame>
  );
});

Combobox.displayName = "Combobox";
