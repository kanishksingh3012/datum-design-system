import { forwardRef, useMemo, useRef, type HTMLAttributes, type Key, type ReactElement, type ReactNode, type RefObject } from "react";
import {
  DismissButton,
  Overlay,
  mergeProps,
  useButton,
  useMenu,
  useMenuItem,
  useMenuSection,
  useMenuTrigger,
  useObjectRef,
  usePopover,
  useSeparator,
  type AriaButtonProps,
  type AriaMenuProps,
} from "react-aria";
import { Item, Section, useMenuTriggerState, useTreeState, type MenuTriggerState, type Node, type TreeState } from "react-stately";
import { cloneTrigger } from "../../lib/cloneTrigger";
import styles from "./DropdownMenu.module.css";

export type DropdownMenuPlacement = "bottom-start" | "bottom-end" | "top-start" | "top-end";
export type DropdownMenuSize = "sm" | "md";

interface ItemBase {
  /** Stable key. Defaults to the item's position. */
  id?: string;
  label: string;
  /** Icon before the label. */
  icon?: ReactNode;
  /** Keyboard shortcut shown after the label, e.g. "⌘D". Display only — bind the key yourself. */
  shortcut?: string;
  disabled?: boolean;
}

export interface DropdownMenuActionItem extends ItemBase {
  type?: "action";
  /** `danger` for destructive actions. @default "neutral" */
  intent?: "neutral" | "danger";
  onSelect?: () => void;
}

export interface DropdownMenuCheckboxItem extends ItemBase {
  type: "checkbox";
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

/** Consecutive radio items (or the radios in one section) form one group: exactly one is checked. */
export interface DropdownMenuRadioItem extends ItemBase {
  type: "radio";
  checked: boolean;
  onSelect: () => void;
}

export interface DropdownMenuSeparatorItem {
  type: "separator";
}

export interface DropdownMenuSectionItem {
  type: "section";
  /** Heading shown above the section and used as its accessible name. */
  label?: string;
  /** One kind of selectable item per section: actions, checkboxes or radios. */
  items: DropdownMenuLeafItem[];
}

export type DropdownMenuLeafItem =
  | DropdownMenuActionItem
  | DropdownMenuCheckboxItem
  | DropdownMenuRadioItem
  | DropdownMenuSeparatorItem;

export type DropdownMenuItem = DropdownMenuLeafItem | DropdownMenuSectionItem;

export interface DropdownMenuOwnProps {
  /** The element that opens the menu, usually a Button. */
  trigger: ReactElement;
  items: DropdownMenuItem[];
  /** @default "bottom-start" */
  placement?: DropdownMenuPlacement;
  /** 32 / 40px items, 44px on touch screens. @default "md" */
  size?: DropdownMenuSize;
  /** Controlled open state. */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export type DropdownMenuProps = DropdownMenuOwnProps & Omit<HTMLAttributes<HTMLDivElement>, "children">;

type Selectable = DropdownMenuCheckboxItem | DropdownMenuRadioItem;
type Leaf = Exclude<DropdownMenuLeafItem, DropdownMenuSeparatorItem>;

const isSelectable = (item: DropdownMenuItem): item is Selectable => item.type === "checkbox" || item.type === "radio";

interface Model {
  /** Collection children for useTreeState: plain items, and sections for runs of checkboxes or radios and explicit sections. */
  children: ReactElement[];
  /** Every item by key. */
  items: Map<string, Leaf>;
  /** Sections by key. */
  sections: Map<string, { label?: string }>;
  /** Keys of nodes (item, section or item inside a section) that a separator comes before. */
  separatorBefore: Set<string>;
  disabledKeys: string[];
}

/**
 * Turns the items prop into a React Stately collection. Separators aren't
 * collection nodes, so they are recorded against the node that follows them
 * and drawn at render time; arrow keys never land on them.
 */
function buildModel(list: DropdownMenuItem[]): Model {
  const model: Model = { children: [], items: new Map(), sections: new Map(), separatorBefore: new Set(), disabledKeys: [] };
  let pendingSeparator = false;

  const leaf = (item: Leaf, key: string) => {
    model.items.set(key, item);
    if (item.disabled) model.disabledKeys.push(key);
    if (pendingSeparator) model.separatorBefore.add(key);
    pendingSeparator = false;
    return (
      <Item key={key} textValue={item.label}>
        {item.label}
      </Item>
    );
  };
  const section = (key: string, children: ReactElement[], label?: string, separatorFirst = false) => {
    model.sections.set(key, { label });
    if (separatorFirst) model.separatorBefore.add(key);
    return (
      <Section key={key} title={label} aria-label={label}>
        {children}
      </Section>
    );
  };

  let run: { key: string; item: Selectable }[] = [];
  let runSeparator = false;
  const flush = () => {
    if (!run.length) return;
    const saved = pendingSeparator;
    pendingSeparator = false;
    model.children.push(section(`group-${run[0].key}`, run.map(({ item, key }) => leaf(item, key)), undefined, runSeparator));
    pendingSeparator = saved;
    run = [];
  };

  list.forEach((item, index) => {
    const key = ("id" in item && item.id) || String(index);
    if (item.type === "separator") {
      flush();
      pendingSeparator = true;
    } else if (item.type === "section") {
      flush();
      const separatorFirst = pendingSeparator;
      pendingSeparator = false;
      const children: ReactElement[] = [];
      item.items.forEach((child, i) => {
        if (child.type === "separator") pendingSeparator = true;
        else children.push(leaf(child, ("id" in child && child.id) || `${key}.${i}`));
      });
      pendingSeparator = false;
      model.children.push(section(`section-${key}`, children, item.label, separatorFirst));
    } else if (isSelectable(item)) {
      // a run of one kind groups together; a different kind starts a new group
      if (run.length && run[0].item.type !== item.type) flush();
      if (!run.length) {
        runSeparator = pendingSeparator;
        pendingSeparator = false;
      }
      run.push({ key, item });
    } else {
      flush();
      model.children.push(leaf(item, key));
    }
  });
  flush();
  return model;
}

const toAriaPlacement = (placement: DropdownMenuPlacement) => placement.replace("-", " ") as "bottom start";

/**
 * Actions behind a trigger. Built on React Aria's menu hooks: arrow keys,
 * Home and End, typeahead, Escape to close and focus back to the trigger.
 * Checkbox and radio items are exposed as menuitemcheckbox / menuitemradio.
 */
export const DropdownMenu = forwardRef<HTMLDivElement, DropdownMenuProps>(function DropdownMenu(
  { trigger, items, placement = "bottom-start", size = "md", open, defaultOpen, onOpenChange, ...rest },
  ref
) {
  const state = useMenuTriggerState({ isOpen: open, defaultOpen, onOpenChange });
  const triggerRef = useRef<HTMLElement>(null);
  const { menuTriggerProps, menuProps } = useMenuTrigger({}, state, triggerRef);
  const { buttonProps } = useButton(menuTriggerProps as AriaButtonProps, triggerRef);
  const model = useMemo(() => buildModel(items), [items]);
  return (
    <>
      {cloneTrigger(trigger, buttonProps, triggerRef)}
      {state.isOpen ? (
        <MenuPopover state={state} triggerRef={triggerRef} placement={placement}>
          <MenuList ref={ref} menuProps={menuProps} model={model} size={size} {...rest} />
        </MenuPopover>
      ) : null}
    </>
  );
});

DropdownMenu.displayName = "DropdownMenu";

function MenuPopover({
  state,
  triggerRef,
  placement,
  children,
}: {
  state: MenuTriggerState;
  triggerRef: RefObject<HTMLElement | null>;
  placement: DropdownMenuPlacement;
  children: ReactNode;
}) {
  const popoverRef = useRef<HTMLDivElement>(null);
  const { popoverProps } = usePopover({ triggerRef, popoverRef, placement: toAriaPlacement(placement), offset: 4 }, state);
  return (
    <Overlay>
      <div
        {...popoverProps}
        ref={popoverRef}
        className={styles.popover}
        style={{ ...popoverProps.style, ["--trigger-width" as string]: `${triggerRef.current?.offsetWidth ?? 0}px` }}
      >
        <DismissButton onDismiss={state.close} />
        {children}
        <DismissButton onDismiss={state.close} />
      </div>
    </Overlay>
  );
}

interface MenuListProps extends HTMLAttributes<HTMLDivElement> {
  menuProps: object;
  model: Model;
  size: DropdownMenuSize;
}

const MenuList = forwardRef<HTMLDivElement, MenuListProps>(function MenuList({ menuProps, model, size, className, ...rest }, forwardedRef) {
  const ref = useObjectRef(forwardedRef);
  const onAction = (key: Key) => {
    const item = model.items.get(String(key));
    if (!item) return;
    if (item.type === "checkbox") item.onCheckedChange(!item.checked);
    else if (item.type === "radio") {
      if (!item.checked) item.onSelect();
    } else item.onSelect?.();
  };
  const menu = { ...menuProps, children: model.children, disabledKeys: model.disabledKeys, onAction } as AriaMenuProps<object>;
  const tree = useTreeState(menu);
  const { menuProps: listProps } = useMenu(menu, tree, ref);
  return (
    <div
      {...mergeProps(listProps, rest)}
      ref={ref}
      className={[styles.root, className].filter(Boolean).join(" ")}
      data-size={size}
    >
      {[...tree.collection].map((node) =>
        node.type === "section" ? (
          <MenuSection key={node.key} section={node} tree={tree} model={model} />
        ) : (
          <MenuRow key={node.key} node={node} tree={tree} model={model} />
        )
      )}
    </div>
  );
});

function Separator() {
  const { separatorProps } = useSeparator({ elementType: "div" });
  return <div {...separatorProps} className={styles.separator} />;
}

function MenuSection({ section, tree, model }: { section: Node<object>; tree: TreeState<object>; model: Model }) {
  const label = model.sections.get(String(section.key))?.label;
  const { itemProps, headingProps, groupProps } = useMenuSection({ heading: label, "aria-label": label });
  return (
    <>
      {model.separatorBefore.has(String(section.key)) ? <Separator /> : null}
      <div {...itemProps} className={styles.section}>
        {label ? (
          <span {...headingProps} className={styles.sectionLabel}>
            {label}
          </span>
        ) : null}
        <div {...groupProps} className={styles.section}>
          {[...section.childNodes].map((node) => (
            <MenuRow key={node.key} node={node} tree={tree} model={model} />
          ))}
        </div>
      </div>
    </>
  );
}

const CheckMark = (
  <svg viewBox="0 0 16 16" focusable="false">
    <path d="M3.5 8.5l3 3 6-7" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const RadioDot = (
  <svg viewBox="0 0 16 16" focusable="false">
    <circle cx="8" cy="8" r="3" fill="currentColor" />
  </svg>
);

function MenuRow({ node, tree, model }: { node: Node<object>; tree: TreeState<object>; model: Model }) {
  const ref = useRef<HTMLDivElement>(null);
  const item = model.items.get(String(node.key))!;
  const selectable = isSelectable(item) ? item : null;
  // a checkbox toggles in place; everything else closes the menu
  const { menuItemProps, labelProps, keyboardShortcutProps, isFocused, isPressed, isDisabled } = useMenuItem(
    { key: node.key, closeOnSelect: item.type !== "checkbox" },
    tree,
    ref
  );
  const intent = selectable ? "neutral" : ((item as DropdownMenuActionItem).intent ?? "neutral");
  return (
    <>
      {model.separatorBefore.has(String(node.key)) ? <Separator /> : null}
      <div
        {...menuItemProps}
        // the tree has no selection of its own: each checkbox or radio reports its `checked` prop
        role={selectable ? (selectable.type === "checkbox" ? "menuitemcheckbox" : "menuitemradio") : "menuitem"}
        aria-checked={selectable ? selectable.checked : undefined}
        ref={ref}
        className={styles.item}
        data-intent={intent}
        data-focused={isFocused || undefined}
        data-pressed={isPressed || undefined}
        data-disabled={isDisabled || undefined}
      >
        {selectable ? (
          <span className={styles.indicator} aria-hidden="true">
            {selectable.checked ? (selectable.type === "radio" ? RadioDot : CheckMark) : null}
          </span>
        ) : null}
        {item.icon ? (
          <span className={styles.icon} aria-hidden="true">
            {item.icon}
          </span>
        ) : null}
        <span {...labelProps} className={styles.label}>
          {item.label}
        </span>
        {item.shortcut ? (
          <kbd {...keyboardShortcutProps} className={styles.shortcut}>
            {item.shortcut}
          </kbd>
        ) : null}
      </div>
    </>
  );
}
