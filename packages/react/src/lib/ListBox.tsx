import { useRef, type ReactNode, type RefObject } from "react";
import { DismissButton, Overlay, mergeProps, useListBox, useListBoxSection, useObjectRef, useOption, usePopover, type AriaListBoxOptions } from "react-aria";
import { Item, Section, type ListState, type Node, type OverlayTriggerState } from "react-stately";
import { CheckIcon } from "./formIcons";
import styles from "./listBox.module.css";

/** An option in Select, Combobox and anything else that lists choices. */
export interface ListOption {
  value: string;
  label: string;
  /** A second line under the label. */
  description?: string;
  disabled?: boolean;
  /** Options with the same group are listed together under that heading, with a divider between groups. */
  group?: string;
}

export type ListSize = "sm" | "md" | "lg";

/** Internal: options as react-stately collection children — sections in first-appearance order of their group. */
export function listChildren(options: ListOption[]) {
  const sections = new Map<string, ListOption[]>();
  for (const option of options) {
    const key = option.group ?? "";
    sections.set(key, [...(sections.get(key) ?? []), option]);
  }
  const grouped = sections.size > 1 || !sections.has("");
  return [...sections].flatMap(([group, items], i) => {
    const rows = items.map((o) => (
      <Item key={o.value} textValue={o.label}>
        {o.label}
      </Item>
    ));
    return grouped
      ? [
          <Section key={`section-${i}`} title={group || undefined} aria-label={group || "Options"}>
            {rows}
          </Section>,
        ]
      : rows;
  });
}

interface ListPopoverProps {
  state: OverlayTriggerState;
  /** What the list lines up with and matches the width of. */
  triggerRef: RefObject<HTMLElement | null>;
  popoverRef?: RefObject<HTMLDivElement | null>;
  /** Combobox: focus stays in the input, so the page behind isn't made inert. */
  isNonModal?: boolean;
  children: ReactNode;
}

/** Internal: the lifted surface a list opens in. */
export function ListPopover({ state, triggerRef, popoverRef: popoverRefProp, isNonModal, children }: ListPopoverProps) {
  const popoverRef = useObjectRef(popoverRefProp as RefObject<HTMLDivElement>);
  const { popoverProps } = usePopover({ triggerRef, popoverRef, placement: "bottom start", offset: 4, isNonModal }, state);
  return (
    <Overlay>
      <div {...popoverProps} ref={popoverRef} className={styles.popover} style={{ ...popoverProps.style, minWidth: triggerRef.current?.offsetWidth }}>
        {!isNonModal && <DismissButton onDismiss={state.close} />}
        {children}
        <DismissButton onDismiss={state.close} />
      </div>
    </Overlay>
  );
}

interface ListBoxProps {
  listProps: AriaListBoxOptions<unknown>;
  state: ListState<unknown>;
  byValue: Map<string, ListOption>;
  size: ListSize;
  listBoxRef?: RefObject<HTMLUListElement | null>;
  /** Shown in place of the options when there are none. */
  emptyState?: ReactNode;
}

/** Internal: the option list — pill rows, group headings, dividers between groups. */
export function ListBox({ listProps, state, byValue, size, listBoxRef, emptyState }: ListBoxProps) {
  const ref = useObjectRef(listBoxRef as RefObject<HTMLUListElement>);
  const { listBoxProps } = useListBox(listProps, state, ref);
  const nodes = [...state.collection];
  return (
    <>
      <ul {...listBoxProps} ref={ref} className={styles.listbox} data-size={size}>
        {nodes.map((node, i) =>
          node.type === "section" ? (
            <ListSection key={node.key} section={node} state={state} byValue={byValue} divider={i > 0} />
          ) : (
            <Option key={node.key} item={node} state={state} option={byValue.get(String(node.key))} />
          )
        )}
      </ul>
      {nodes.length === 0 && emptyState != null && (
        <div className={styles.empty} data-size={size}>
          {emptyState}
        </div>
      )}
    </>
  );
}

function ListSection({ section, state, byValue, divider }: { section: Node<unknown>; state: ListState<unknown>; byValue: Map<string, ListOption>; divider: boolean }) {
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

function Option({ item, state, option }: { item: Node<unknown>; state: ListState<unknown>; option?: ListOption }) {
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
