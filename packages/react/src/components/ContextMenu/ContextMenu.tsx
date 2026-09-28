import { forwardRef, useMemo, useRef, useState, type HTMLAttributes, type KeyboardEvent, type MouseEvent, type ReactNode } from "react";
import { mergeProps } from "react-aria";
import { useMenuTriggerState } from "react-stately";
import { MenuList, MenuPopover, buildModel, type DropdownMenuItem, type DropdownMenuSize } from "../DropdownMenu/DropdownMenu";
import styles from "./ContextMenu.module.css";

/** The same item kinds as DropdownMenu: actions, links, checkboxes, radios, separators and sections. */
export type ContextMenuItem = DropdownMenuItem;

export interface ContextMenuOwnProps {
  /** The region that opens the menu when right-clicked. */
  children: ReactNode;
  items: ContextMenuItem[];
  /** 32 / 40px items, 44px on touch screens. @default "md" */
  size?: DropdownMenuSize;
  /** Names the menu for assistive tech. @default "Context menu" */
  menuLabel?: string;
  /** Controlled open state. Opened without a pointer, the menu sits at the region's top-left corner. */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Leaves the browser's own context menu in place. @default false */
  disabled?: boolean;
}

/** `ref` and every other prop go on the region `<div>`. */
export type ContextMenuProps = ContextMenuOwnProps & Omit<HTMLAttributes<HTMLDivElement>, "children">;

/**
 * A menu of actions for a region, opened by right-click at the pointer or by
 * Shift+F10 from anything focused inside it (macOS has no keyboard
 * equivalent, so every action must also be reachable another way).
 * The menu itself is DropdownMenu's: React Aria's menu hooks, positioned
 * against a zero-size point where the menu was asked for.
 */
export const ContextMenu = forwardRef<HTMLDivElement, ContextMenuProps>(function ContextMenu(
  { children, items, size = "md", menuLabel = "Context menu", open, defaultOpen, onOpenChange, disabled = false, className, ...rest },
  ref
) {
  const state = useMenuTriggerState({ isOpen: open, defaultOpen, onOpenChange });
  const regionRef = useRef<HTMLDivElement | null>(null);
  const pointRef = useRef<HTMLSpanElement>(null);
  const [point, setPoint] = useState({ x: 0, y: 0 });
  const model = useMemo(() => buildModel(items), [items]);

  const setRegion = (node: HTMLDivElement | null) => {
    regionRef.current = node;
    if (typeof ref === "function") ref(node);
    else if (ref) ref.current = node;
  };

  // the point is kept relative to the region, so the menu stays put if the page scrolls
  const openAt = (clientX: number, clientY: number) => {
    const box = regionRef.current!.getBoundingClientRect();
    setPoint({ x: clientX - box.left, y: clientY - box.top });
    state.open();
  };
  const openAtElement = (el: Element) => {
    const r = el.getBoundingClientRect();
    openAt(r.left, r.bottom);
  };

  const onContextMenu = (event: MouseEvent<HTMLDivElement>) => {
    if (disabled) return;
    event.preventDefault();
    // the keyboard's context-menu key fires this with no pointer position
    if (event.clientX === 0 && event.clientY === 0) openAtElement(event.target as Element);
    else openAt(event.clientX, event.clientY);
  };
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (disabled || !(event.shiftKey && event.key === "F10")) return;
    event.preventDefault();
    openAtElement(event.target as Element);
  };

  return (
    <div
      {...mergeProps(rest, { onContextMenu, onKeyDown })}
      ref={setRegion}
      className={[styles.region, className].filter(Boolean).join(" ")}
    >
      {children}
      <span ref={pointRef} className={styles.point} style={{ left: point.x, top: point.y }} aria-hidden="true" />
      {state.isOpen ? (
        <MenuPopover state={state} triggerRef={pointRef} placement="bottom-start" offset={2}>
          <MenuList
            menuProps={{ "aria-label": menuLabel, autoFocus: state.focusStrategy ?? "first", onClose: state.close }}
            model={model}
            size={size}
            columns={1}
          />
        </MenuPopover>
      ) : null}
    </div>
  );
});

ContextMenu.displayName = "ContextMenu";
