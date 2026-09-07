import { useId, useMemo, useRef, useState, type KeyboardEvent } from "react";
import styles from "./Combobox.module.css";

export interface ComboboxOption {
  value: string;
  label: string;
}

export interface ComboboxOwnProps {
  /** Never substitute with placeholder - placeholder-as-label is banned. */
  label: string;
  options: ComboboxOption[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export type ComboboxProps = ComboboxOwnProps;

/**
 * The APG Combobox pattern: focus never leaves the text input (the user
 * needs to keep typing while moving through options), so the highlighted
 * option is tracked virtually via aria-activedescendant instead of real
 * DOM focus - unlike Menu, where items really are separately focusable.
 */
export function Combobox({ label, options, value, onChange, disabled }: ComboboxProps) {
  const inputId = useId();
  const listId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const selected = options.find((option) => option.value === value);
  const [query, setQuery] = useState(selected?.label ?? "");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const filtered = useMemo(
    () => options.filter((option) => option.label.toLowerCase().includes(query.toLowerCase())),
    [options, query]
  );

  function commit(option: ComboboxOption) {
    onChange(option.value);
    setQuery(option.label);
    setOpen(false);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setOpen(true);
      setActiveIndex((index) => Math.min(index + 1, filtered.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => Math.max(index - 1, 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      const option = filtered[activeIndex];
      if (option) commit(option);
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  }

  const activeOption = filtered[activeIndex];

  return (
    <div className={styles.root}>
      <label className={styles.label} htmlFor={inputId}>
        {label}
      </label>
      <div className={styles.wrap}>
        <input
          ref={inputRef}
          id={inputId}
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={open && activeOption ? `${listId}-${activeOption.value}` : undefined}
          disabled={disabled}
          className={styles.input}
          value={query}
          onChange={(event) => {
            setQuery(event.currentTarget.value);
            setOpen(true);
            setActiveIndex(0);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
          onKeyDown={handleKeyDown}
        />
        {open && filtered.length > 0 ? (
          <ul id={listId} role="listbox" className={styles.listbox}>
            {filtered.map((option, index) => (
              <li
                key={option.value}
                id={`${listId}-${option.value}`}
                role="option"
                aria-selected={index === activeIndex}
                className={[styles.option, index === activeIndex ? styles.optionActive : ""]
                  .filter(Boolean)
                  .join(" ")}
                // onMouseDown (not onClick) fires before the input's onBlur closes the list.
                onMouseDown={(event) => {
                  event.preventDefault();
                  commit(option);
                }}
              >
                {option.label}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}
