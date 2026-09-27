import { createContext, forwardRef, useContext, useId, useRef, type HTMLAttributes, type ReactNode } from "react";
import { mergeProps, useButton, useDisclosure } from "react-aria";
import { useDisclosureGroupState, useDisclosureState, type DisclosureGroupState } from "react-stately";
import styles from "./Accordion.module.css";

export type AccordionType = "single" | "multiple";
export type AccordionAppearance = "plain" | "bordered" | "separated";

interface AccordionContextValue {
  group: DisclosureGroupState;
  collapsible: boolean;
  headingLevel: 2 | 3 | 4 | 5 | 6;
}

const AccordionContext = createContext<AccordionContextValue | null>(null);

export interface AccordionOwnProps {
  /** One item open at a time, or any number. @default "single" */
  type?: AccordionType;
  /** Dividers between items / one bordered box / a card per item. @default "bordered" */
  appearance?: AccordionAppearance;
  /** With `type="single"`: whether the open item can be closed again, leaving none open. @default true */
  collapsible?: boolean;
  /** The open items' `value`s (controlled). */
  value?: string | string[];
  /** The items open at first (uncontrolled). */
  defaultValue?: string | string[];
  /** Called with every open item's `value` whenever one opens or closes. */
  onValueChange?: (value: string[]) => void;
  /** Disables every item. @default false */
  disabled?: boolean;
  /** Heading level that wraps each item's trigger, to fit the page outline. @default 3 */
  headingLevel?: 2 | 3 | 4 | 5 | 6;
}

export type AccordionProps = AccordionOwnProps & Omit<HTMLAttributes<HTMLDivElement>, "defaultValue">;

const toKeys = (value?: string | string[]) =>
  value === undefined ? undefined : new Set(Array.isArray(value) ? value : [value]);

export const Accordion = forwardRef<HTMLDivElement, AccordionProps>(function Accordion(
  {
    type = "single",
    appearance = "bordered",
    collapsible = true,
    value,
    defaultValue,
    onValueChange,
    disabled = false,
    headingLevel = 3,
    className,
    children,
    ...rest
  },
  ref
) {
  const group = useDisclosureGroupState({
    allowsMultipleExpanded: type === "multiple",
    isDisabled: disabled,
    expandedKeys: toKeys(value),
    defaultExpandedKeys: toKeys(defaultValue),
    onExpandedChange: (keys) => onValueChange?.([...keys].map(String)),
  });

  return (
    <div
      ref={ref}
      data-type={type}
      data-appearance={appearance}
      className={[styles.root, className].filter(Boolean).join(" ")}
      {...rest}
    >
      <AccordionContext.Provider value={{ group, collapsible, headingLevel }}>{children}</AccordionContext.Provider>
    </div>
  );
});

Accordion.displayName = "Accordion";

export interface AccordionItemOwnProps {
  /** The trigger's label. */
  title: ReactNode;
  /** Identifies the item for `value` / `defaultValue`. Generated when unset. */
  value?: string;
  /** @default false */
  disabled?: boolean;
  children?: ReactNode;
}

export type AccordionItemProps = AccordionItemOwnProps & Omit<HTMLAttributes<HTMLDivElement>, "title">;

export const AccordionItem = forwardRef<HTMLDivElement, AccordionItemProps>(function AccordionItem(
  { title, value, disabled = false, children, className, ...rest },
  ref
) {
  const ctx = useContext(AccordionContext);
  if (!ctx) throw new Error("AccordionItem must be used inside an Accordion.");
  const { group, collapsible, headingLevel } = ctx;
  const generated = useId();
  const key = value ?? generated;
  const isExpanded = group.expandedKeys.has(key);
  // A non-collapsible single accordion keeps its open item open: it closes only when another opens.
  const locked = isExpanded && !collapsible && !group.allowsMultipleExpanded;
  const isDisabled = disabled || group.isDisabled;

  const state = useDisclosureState({
    isExpanded,
    onExpandedChange: () => {
      if (!locked) group.toggleKey(key);
    },
  });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const { buttonProps: disclosureProps, panelProps } = useDisclosure({ isExpanded, isDisabled }, state, panelRef);
  const { buttonProps } = useButton(disclosureProps, triggerRef);
  const Heading = `h${headingLevel}` as const;

  return (
    <div
      ref={ref}
      data-expanded={isExpanded || undefined}
      data-disabled={isDisabled || undefined}
      className={[styles.item, className].filter(Boolean).join(" ")}
      {...rest}
    >
      <Heading className={styles.heading}>
        <button
          ref={triggerRef}
          className={styles.trigger}
          {...mergeProps(buttonProps, { "aria-disabled": locked || undefined })}
        >
          <span className={styles.title}>{title}</span>
          <svg className={styles.chevron} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </Heading>
      <div ref={panelRef} className={styles.panel} {...panelProps}>
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
});

AccordionItem.displayName = "AccordionItem";
