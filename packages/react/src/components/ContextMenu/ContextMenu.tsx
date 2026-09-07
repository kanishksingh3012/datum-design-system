import { useEffect, useId, useRef, useState, type KeyboardEvent, type MouseEvent, type ReactNode } from "react";
import { useRovingMenu } from "../../lib/useRovingMenu";
import styles from "./ContextMenu.module.css";

export interface ContextMenuItemDef {
  label: string;
  onSelect: () => void;
  disabled?: boolean;
}

export interface ContextMenuOwnProps {
  children: ReactNode;
  items: ContextMenuItemDef[];
}

export type ContextMenuProps = ContextMenuOwnProps;

/**
 * Right-click at cursor position is the primary trigger. Shift+F10 is the
 * real Windows/Linux keyboard equivalent for "open the context menu here"
 * - macOS has no native keyboard equivalent for right-click at all, which
 * is a real platform gap this can't paper over, not something to fake.
 */
export function ContextMenu({ children, items }: ContextMenuOwnProps) {
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const menuId = useId();
  const anchorRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const { itemRefs, focusIndex, handleKeyDown } = useRovingMenu(items.length);
  const open = position !== null;

  function close() {
    setPosition(null);
    anchorRef.current?.focus();
  }

  useEffect(() => {
    if (!open) return;
    focusIndex(0);
    function handlePointerDown(event: globalThis.MouseEvent) {
      if (menuRef.current?.contains(event.target as Node)) return;
      close();
    }
    function handleKeyDownGlobal(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") close();
    }
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDownGlobal);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDownGlobal);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function openAt(x: number, y: number) {
    setPosition({ x, y });
  }

  function handleContextMenu(event: MouseEvent<HTMLDivElement>) {
    event.preventDefault();
    openAt(event.clientX, event.clientY);
  }

  function handleAnchorKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.shiftKey && event.key === "F10") {
      event.preventDefault();
      const rect = event.currentTarget.getBoundingClientRect();
      openAt(rect.left, rect.bottom);
    }
  }

  function handleMenuKeyDown(event: KeyboardEvent<HTMLElement>, index: number) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      const item = items[index];
      if (!item.disabled) {
        item.onSelect();
        close();
      }
      return;
    }
    handleKeyDown(event, index);
  }

  return (
    <div
      ref={anchorRef}
      className={styles.anchor}
      onContextMenu={handleContextMenu}
      onKeyDown={handleAnchorKeyDown}
    >
      {children}
      {open ? (
        <div
          ref={menuRef}
          id={menuId}
          role="menu"
          className={styles.menu}
          style={{ left: position.x, top: position.y }}
        >
          {items.map((item, index) => (
            <button
              key={item.label}
              ref={(node) => {
                itemRefs.current[index] = node;
              }}
              type="button"
              role="menuitem"
              disabled={item.disabled}
              tabIndex={-1}
              className={styles.item}
              onClick={() => {
                if (item.disabled) return;
                item.onSelect();
                close();
              }}
              onKeyDown={(event) => handleMenuKeyDown(event, index)}
            >
              {item.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
