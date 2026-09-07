import { useRef, type HTMLAttributes, type KeyboardEvent } from "react";
import styles from "./Tabs.module.css";

export interface TabItem {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface TabsOwnProps {
  items: TabItem[];
  /** @default items[0].value */
  active?: string;
  onChange: (value: string) => void;
}

export type TabsProps = TabsOwnProps & Omit<HTMLAttributes<HTMLDivElement>, "onChange">;

export function Tabs({ items, active, onChange, className, ...rest }: TabsProps) {
  const activeValue = active ?? items[0]?.value;
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  function focusTab(index: number) {
    const enabled = items
      .map((item, i) => ({ item, i }))
      .filter(({ item }) => !item.disabled);
    if (enabled.length === 0) return;
    const pos = enabled.findIndex(({ i }) => i === index);
    const wrapped = enabled[(pos + enabled.length) % enabled.length] ?? enabled[0];
    tabRefs.current[wrapped.i]?.focus();
    onChange(items[wrapped.i].value);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      focusNext(index, 1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      focusNext(index, -1);
    } else if (event.key === "Home") {
      event.preventDefault();
      focusTab(0);
    } else if (event.key === "End") {
      event.preventDefault();
      focusTab(items.length - 1);
    }
  }

  function focusNext(from: number, direction: 1 | -1) {
    let index = from;
    for (let step = 0; step < items.length; step++) {
      index = (index + direction + items.length) % items.length;
      if (!items[index].disabled) {
        tabRefs.current[index]?.focus();
        onChange(items[index].value);
        return;
      }
    }
  }

  return (
    <div role="tablist" className={[styles.root, className].filter(Boolean).join(" ")} {...rest}>
      {items.map((item, index) => (
        <button
          key={item.value}
          ref={(el) => {
            tabRefs.current[index] = el;
          }}
          role="tab"
          type="button"
          aria-selected={item.value === activeValue}
          tabIndex={item.value === activeValue ? 0 : -1}
          disabled={item.disabled}
          className={styles.tab}
          data-active={item.value === activeValue || undefined}
          onClick={() => onChange(item.value)}
          onKeyDown={(event) => handleKeyDown(event, index)}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
