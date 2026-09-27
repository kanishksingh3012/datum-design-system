import { forwardRef, type HTMLAttributes, type ReactElement, type ReactNode } from "react";
import {
  Header,
  Keyboard,
  Menu,
  MenuItem,
  MenuSection,
  MenuTrigger,
  Popover,
  Pressable,
  Separator,
  Text,
  type Selection,
} from "react-aria-components";
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
type Keyed<T> = T & { key: string };

const isSelectable = (item: DropdownMenuItem): item is Selectable => item.type === "checkbox" || item.type === "radio";

function renderItem(item: Keyed<DropdownMenuLeafItem>) {
  if (item.type === "separator") return <Separator key={item.key} className={styles.separator} />;
  const intent = item.type === "action" || item.type === undefined ? (item.intent ?? "neutral") : "neutral";
  return (
    <MenuItem
      key={item.key}
      id={item.key}
      textValue={item.label}
      isDisabled={item.disabled}
      onAction={item.type === "action" || item.type === undefined ? item.onSelect : undefined}
      className={styles.item}
      data-intent={intent}
    >
      {({ isSelected, selectionMode }) => (
        <>
          {selectionMode !== "none" ? (
            <span className={styles.indicator} aria-hidden="true">
              {isSelected ? (
                selectionMode === "single" ? (
                  <svg viewBox="0 0 16 16" focusable="false">
                    <circle cx="8" cy="8" r="3" fill="currentColor" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 16 16" focusable="false">
                    <path d="M3.5 8.5l3 3 6-7" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )
              ) : null}
            </span>
          ) : null}
          {item.icon ? (
            <span className={styles.icon} aria-hidden="true">
              {item.icon}
            </span>
          ) : null}
          <Text slot="label" className={styles.label}>
            {item.label}
          </Text>
          {item.shortcut ? <Keyboard className={styles.shortcut}>{item.shortcut}</Keyboard> : null}
        </>
      )}
    </MenuItem>
  );
}

/** A section — explicit, or an implicit one wrapping a run of checkboxes or radios. */
function renderSection(key: string, items: Keyed<DropdownMenuLeafItem>[], label?: string) {
  const selectable = items.filter(isSelectable) as Keyed<Selectable>[];
  const mode = selectable.some((i) => i.type === "radio") ? "radio" : selectable.length ? "checkbox" : null;

  function handleSelectionChange(keys: Selection) {
    for (const item of selectable) {
      const now = keys === "all" || keys.has(item.key);
      if (now === item.checked) continue;
      if (item.type === "checkbox") item.onCheckedChange(now);
      else if (now) item.onSelect();
    }
  }

  return (
    <MenuSection
      key={key}
      id={key}
      className={styles.section}
      aria-label={label}
      {...(mode
        ? {
            selectionMode: mode === "radio" ? "single" : "multiple",
            disallowEmptySelection: mode === "radio",
            selectedKeys: selectable.filter((i) => i.checked).map((i) => i.key),
            onSelectionChange: handleSelectionChange,
          }
        : {})}
    >
      {label ? <Header className={styles.sectionLabel}>{label}</Header> : null}
      {items.map(renderItem)}
    </MenuSection>
  );
}

function renderItems(items: DropdownMenuItem[]) {
  const out: ReactNode[] = [];
  let run: Keyed<Selectable>[] = [];
  const flush = () => {
    if (run.length) out.push(renderSection(`group-${run[0].key}`, run));
    run = [];
  };
  items.forEach((item, index) => {
    const key = ("id" in item && item.id) || String(index);
    if (item.type === "section") {
      flush();
      out.push(
        renderSection(
          `section-${key}`,
          item.items.map((child, i) => ({ ...child, key: ("id" in child && child.id) || `${key}.${i}` })),
          item.label
        )
      );
    } else if (isSelectable(item)) {
      // a run of one kind groups together; a different kind starts a new group
      if (run.length && run[0].type !== item.type) flush();
      run.push({ ...item, key });
    } else {
      flush();
      out.push(renderItem({ ...item, key }));
    }
  });
  flush();
  return out;
}

const toAriaPlacement = (placement: DropdownMenuPlacement) => placement.replace("-", " ") as "bottom start";

/**
 * Actions behind a trigger. Built on React Aria's menu: arrow keys, Home
 * and End, typeahead, Escape to close and focus back to the trigger.
 * Checkbox and radio items are exposed as menuitemcheckbox / menuitemradio.
 */
export const DropdownMenu = forwardRef<HTMLDivElement, DropdownMenuProps>(function DropdownMenu(
  { trigger, items, placement = "bottom-start", size = "md", open, defaultOpen, onOpenChange, className, ...rest },
  ref
) {
  return (
    <MenuTrigger isOpen={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      <Pressable>{trigger as never}</Pressable>
      <Popover placement={toAriaPlacement(placement)} offset={4} className={styles.popover}>
        <Menu
          ref={ref}
          className={[styles.root, className].filter(Boolean).join(" ")}
          data-size={size}
          {...(rest as Record<string, unknown>)}
        >
          {renderItems(items)}
        </Menu>
      </Popover>
    </MenuTrigger>
  );
});

DropdownMenu.displayName = "DropdownMenu";
