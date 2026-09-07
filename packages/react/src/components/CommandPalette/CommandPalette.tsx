import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from "react";
import styles from "./CommandPalette.module.css";

export interface CommandPaletteItem {
  id: string;
  label: string;
  onSelect: () => void;
}

export interface CommandPaletteOwnProps {
  open: boolean;
  onClose: () => void;
  items: CommandPaletteItem[];
  /** Never substitute with placeholder - placeholder-as-label is banned. */
  label: string;
}

export type CommandPaletteProps = CommandPaletteOwnProps;

/**
 * Built on native <dialog>/.showModal() for the same reason Dialog is -
 * free focus trap, Escape-to-close, and top-layer stacking. The search
 * input inside is the same ARIA combobox pattern as Combobox: focus
 * stays in the input, the highlighted result is tracked via
 * aria-activedescendant rather than real focus moving onto list items.
 */
export function CommandPalette({ open, onClose, items, label }: CommandPaletteProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<Element | null>(null);
  const listId = useId();
  const inputId = useId();
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const filtered = useMemo(
    () => items.filter((item) => item.label.toLowerCase().includes(query.toLowerCase())),
    [items, query]
  );

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      triggerRef.current = document.activeElement;
      setQuery("");
      setActiveIndex(0);
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    function handleClose() {
      onClose();
      const trigger = triggerRef.current;
      if (trigger instanceof HTMLElement) trigger.focus();
    }
    dialog.addEventListener("close", handleClose);
    return () => dialog.removeEventListener("close", handleClose);
  }, [onClose]);

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => Math.min(index + 1, filtered.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => Math.max(index - 1, 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      const item = filtered[activeIndex];
      if (item) {
        item.onSelect();
        dialogRef.current?.close();
      }
    }
  }

  const activeItem = filtered[activeIndex];

  return (
    <dialog ref={dialogRef} className={styles.root} aria-label={label}>
      <input
        id={inputId}
        type="text"
        role="combobox"
        aria-expanded={filtered.length > 0}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={activeItem ? `${listId}-${activeItem.id}` : undefined}
        aria-label={label}
        autoFocus
        className={styles.input}
        value={query}
        onChange={(event) => {
          setQuery(event.currentTarget.value);
          setActiveIndex(0);
        }}
        onKeyDown={handleKeyDown}
      />
      <ul id={listId} role="listbox" className={styles.listbox}>
        {filtered.map((item, index) => (
          <li
            key={item.id}
            id={`${listId}-${item.id}`}
            role="option"
            aria-selected={index === activeIndex}
            className={[styles.option, index === activeIndex ? styles.optionActive : ""].filter(Boolean).join(" ")}
            onMouseDown={(event) => {
              event.preventDefault();
              item.onSelect();
              dialogRef.current?.close();
            }}
          >
            {item.label}
          </li>
        ))}
      </ul>
    </dialog>
  );
}
