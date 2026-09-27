import { forwardRef, useMemo, useRef, type HTMLAttributes, type ReactNode, type RefObject } from "react";
import {
  DismissButton,
  HiddenSelect,
  Overlay,
  mergeProps,
  useButton,
  useListBox,
  useListBoxSection,
  useObjectRef,
  useOption,
  usePopover,
  useSelect,
} from "react-aria";
import { Item, Section, useSelectState, type Node, type SelectState } from "react-stately";
import { CheckIcon, ChevronDownIcon } from "../../lib/formIcons";
import { useControllableState } from "../../lib/useControllableState";
import { FieldFrame, type FieldProps } from "../Field/Field";
import styles from "./Select.module.css";

export type SelectSize = "sm" | "md" | "lg";

export interface SelectOption {
  value: string;
  label: string;
  /** A second line under the label. */
  description?: string;
  disabled?: boolean;
  /** Options with the same group are listed together under that heading, with a divider between groups. */
  group?: string;
}

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

/** Options in first-appearance order of their group; ungrouped options form an untitled section. */
function toSections(options: SelectOption[]) {
  const sections = new Map<string, SelectOption[]>();
  for (const option of options) {
    const key = option.group ?? "";
    sections.set(key, [...(sections.get(key) ?? []), option]);
  }
  return [...sections];
}

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
  const sections = useMemo(() => toSections(options), [options]);
  const grouped = sections.length > 1 || sections[0]?.[0] !== "";

  const children = sections.map(([group, items], i) => {
    const rows = items.map((o) => (
      <Item key={o.value} textValue={o.label}>
        {o.label}
      </Item>
    ));
    return grouped ? (
      <Section key={`section-${i}`} title={group || undefined} aria-label={group || "Options"}>
        {rows}
      </Section>
    ) : (
      rows
    );
  });

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
    children: children.flat(),
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
        <Popover state={state} triggerRef={triggerRef}>
          <ListBox menuProps={menuProps} state={state} byValue={byValue} size={size} />
        </Popover>
      )}
    </FieldFrame>
  );
});

Select.displayName = "Select";

function Popover({ state, triggerRef, children }: { state: SelectState<unknown>; triggerRef: RefObject<HTMLButtonElement | null>; children: ReactNode }) {
  const popoverRef = useRef<HTMLDivElement>(null);
  const { popoverProps } = usePopover({ triggerRef, popoverRef, placement: "bottom start", offset: 4 }, state);
  return (
    <Overlay>
      <div
        {...popoverProps}
        ref={popoverRef}
        className={styles.popover}
        style={{ ...popoverProps.style, minWidth: triggerRef.current?.offsetWidth }}
      >
        <DismissButton onDismiss={state.close} />
        {children}
        <DismissButton onDismiss={state.close} />
      </div>
    </Overlay>
  );
}

interface ListBoxProps {
  menuProps: object;
  state: SelectState<unknown>;
  byValue: Map<string, SelectOption>;
  size: SelectSize;
}

function ListBox({ menuProps, state, byValue, size }: ListBoxProps) {
  const ref = useRef<HTMLUListElement>(null);
  const { listBoxProps } = useListBox(menuProps, state, ref);
  const nodes = [...state.collection];
  return (
    <ul {...listBoxProps} ref={ref} className={styles.listbox} data-size={size}>
      {nodes.map((node, i) =>
        node.type === "section" ? (
          <ListSection key={node.key} section={node} state={state} byValue={byValue} divider={i > 0} />
        ) : (
          <Option key={node.key} item={node} state={state} option={byValue.get(String(node.key))} />
        )
      )}
    </ul>
  );
}

function ListSection({ section, state, byValue, divider }: { section: Node<unknown>; state: SelectState<unknown>; byValue: Map<string, SelectOption>; divider: boolean }) {
  const { itemProps, headingProps, groupProps } = useListBoxSection({ heading: section.rendered, "aria-label": section["aria-label"] });
  return (
    <>
      {divider && <li role="presentation" className={styles.divider} />}
      <li {...itemProps}>
        {section.rendered && (
          <span {...headingProps} className={styles.heading}>
            {section.rendered}
          </span>
        )}
        <ul {...groupProps} className={styles.group}>
          {[...state.collection.getChildren!(section.key)].map((node) => (
            <Option key={node.key} item={node} state={state} option={byValue.get(String(node.key))} />
          ))}
        </ul>
      </li>
    </>
  );
}

function Option({ item, state, option }: { item: Node<unknown>; state: SelectState<unknown>; option?: SelectOption }) {
  const ref = useRef<HTMLLIElement>(null);
  const { optionProps, labelProps, descriptionProps, isSelected, isFocused, isFocusVisible, isDisabled } = useOption({ key: item.key }, state, ref);
  return (
    <li
      {...mergeProps(optionProps)}
      ref={ref}
      className={styles.option}
      data-selected={isSelected || undefined}
      data-focused={isFocused || undefined}
      data-focus-visible={isFocusVisible || undefined}
      data-disabled={isDisabled || undefined}
      data-description={option?.description ? "" : undefined}
    >
      <span className={styles.optionText}>
        <span {...labelProps}>{item.rendered}</span>
        {option?.description && (
          <span {...descriptionProps} className={styles.optionDescription}>
            {option.description}
          </span>
        )}
      </span>
      {isSelected && <CheckIcon className={styles.check} />}
    </li>
  );
}
