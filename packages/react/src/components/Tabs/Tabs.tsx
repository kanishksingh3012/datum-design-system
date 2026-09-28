import { forwardRef, useRef, type HTMLAttributes, type Key, type ReactNode } from "react";
import { useObjectRef, useTab, useTabList, useTabPanel } from "react-aria";
import { Item, useTabListState, type Node, type TabListState } from "react-stately";
import styles from "./Tabs.module.css";

export type TabsAppearance = "underline" | "pill" | "segmented";
export type TabsSize = "sm" | "md";
export type TabsOrientation = "horizontal" | "vertical";

export interface TabItem {
  value: string;
  label: ReactNode;
  /** Icon before the label. */
  icon?: ReactNode;
  disabled?: boolean;
  /** The panel shown while this tab is selected, wired with aria-controls. Leave it out to render the view yourself. */
  content?: ReactNode;
}

export interface TabsOwnProps {
  items: TabItem[];
  /** The selected tab's `value` (controlled). */
  value?: string;
  /** The tab selected at first (uncontrolled). @default the first enabled tab */
  defaultValue?: string;
  /** Called with the new `value` whenever the selection changes. */
  onValueChange?: (value: string) => void;
  /** A line under the row with an accent indicator / an ink pill / a raised thumb on a track. @default "underline" */
  appearance?: TabsAppearance;
  /** 32 / 40px tabs, +4px on touch screens. @default "md" */
  size?: TabsSize;
  /** Vertical stacks the tabs beside the panel; arrow keys follow. @default "horizontal" */
  orientation?: TabsOrientation;
  /** Tabs share the full width of the row. @default false */
  fullWidth?: boolean;
}

export type TabsProps = TabsOwnProps & Omit<HTMLAttributes<HTMLDivElement>, "defaultValue">;

/**
 * Switch between views in the same place. React Aria's tab hooks: arrow
 * keys move and select, Home/End jump, disabled tabs are skipped.
 */
export const Tabs = forwardRef<HTMLDivElement, TabsProps>(function Tabs(
  {
    items,
    value,
    defaultValue,
    onValueChange,
    appearance = "underline",
    size = "md",
    orientation = "horizontal",
    fullWidth = false,
    className,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledby,
    ...rest
  },
  ref
) {
  const listRef = useRef<HTMLDivElement>(null);
  const props = {
    orientation,
    selectedKey: value,
    defaultSelectedKey: defaultValue,
    onSelectionChange: (key: Key) => onValueChange?.(String(key)),
    disabledKeys: items.filter((item) => item.disabled).map((item) => item.value),
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledby,
    children: items.map((item) => (
      <Item key={item.value} textValue={typeof item.label === "string" ? item.label : item.value}>
        {item.label}
      </Item>
    )),
  };
  const state = useTabListState(props);
  const { tabListProps } = useTabList(props, state, listRef);
  const selected = items.find((item) => item.value === state.selectedKey);
  return (
    <div
      ref={ref}
      className={[styles.root, className].filter(Boolean).join(" ")}
      data-appearance={appearance}
      data-size={size}
      data-orientation={orientation}
      data-full-width={fullWidth || undefined}
      {...rest}
    >
      <div {...tabListProps} ref={listRef} className={styles.list}>
        {[...state.collection].map((node) => (
          <Tab key={node.key} node={node} state={state} icon={items.find((item) => item.value === node.key)?.icon} />
        ))}
      </div>
      {selected?.content !== undefined ? (
        <TabPanel key={state.selectedKey} state={state}>
          {selected.content}
        </TabPanel>
      ) : null}
    </div>
  );
});

Tabs.displayName = "Tabs";

function Tab({ node, state, icon }: { node: Node<object>; state: TabListState<object>; icon?: ReactNode }) {
  const ref = useRef<HTMLButtonElement>(null);
  const { tabProps, isSelected, isDisabled } = useTab({ key: node.key }, state, ref);
  return (
    <button
      {...tabProps}
      ref={ref}
      type="button"
      className={styles.tab}
      data-selected={isSelected || undefined}
      data-disabled={isDisabled || undefined}
    >
      {icon ? (
        <span className={styles.icon} aria-hidden="true">
          {icon}
        </span>
      ) : null}
      {node.rendered}
    </button>
  );
}

const TabPanel = forwardRef<HTMLDivElement, { state: TabListState<object>; children: ReactNode }>(function TabPanel(
  { state, children },
  forwardedRef
) {
  const ref = useObjectRef(forwardedRef);
  const { tabPanelProps } = useTabPanel({}, state, ref);
  return (
    <div {...tabPanelProps} ref={ref} className={styles.panel}>
      {children}
    </div>
  );
});
