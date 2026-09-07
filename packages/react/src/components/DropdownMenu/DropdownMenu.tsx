import {
  cloneElement,
  isValidElement,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactElement,
} from "react";
import { useRovingMenu } from "../../lib/useRovingMenu";
import styles from "./DropdownMenu.module.css";

export interface MenuItemDef {
  label: string;
  onSelect: () => void;
  disabled?: boolean;
}

export interface DropdownMenuOwnProps {
  trigger: ReactElement;
  items: MenuItemDef[];
}

export type DropdownMenuProps = DropdownMenuOwnProps;

export function DropdownMenu({ trigger, items }: DropdownMenuProps) {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const triggerRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const { itemRefs, focusIndex, handleKeyDown } = useRovingMenu(items.length);

  function close(returnFocus: boolean) {
    setOpen(false);
    if (returnFocus) triggerRef.current?.focus();
  }

  useEffect(() => {
    if (!open) return;
    focusIndex(0);
    function handlePointerDown(event: MouseEvent) {
      const target = event.target as Node;
      if (menuRef.current?.contains(target) || triggerRef.current?.contains(target)) return;
      close(false);
    }
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function handleTriggerKeyDown(event: ReactKeyboardEvent) {
    if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setOpen(true);
    }
  }

  function handleMenuKeyDown(event: ReactKeyboardEvent<HTMLElement>, index: number) {
    if (event.key === "Escape") {
      event.preventDefault();
      close(true);
      return;
    }
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      const item = items[index];
      if (!item.disabled) {
        item.onSelect();
        close(true);
      }
      return;
    }
    handleKeyDown(event, index);
  }

  const clonedTrigger = isValidElement(trigger)
    ? cloneElement(trigger, {
        ref: triggerRef,
        onClick: () => setOpen((value) => !value),
        onKeyDown: handleTriggerKeyDown,
        "aria-haspopup": "menu",
        "aria-expanded": open,
        "aria-controls": open ? menuId : undefined,
      } as never)
    : trigger;

  return (
    <span className={styles.root}>
      {clonedTrigger}
      {open ? (
        <div ref={menuRef} id={menuId} role="menu" className={styles.menu}>
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
                close(true);
              }}
              onKeyDown={(event) => handleMenuKeyDown(event, index)}
            >
              {item.label}
            </button>
          ))}
        </div>
      ) : null}
    </span>
  );
}
