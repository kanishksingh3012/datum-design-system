import { useId, useState, type KeyboardEvent } from "react";
import styles from "./TagInput.module.css";

export interface TagInputOwnProps {
  /** Never substitute with placeholder - placeholder-as-label is banned. */
  label: string;
  value: string[];
  onChange: (tags: string[]) => void;
  disabled?: boolean;
}

export type TagInputProps = TagInputOwnProps;

export function TagInput({ label, value, onChange, disabled }: TagInputProps) {
  const inputId = useId();
  const [draft, setDraft] = useState("");

  function commitDraft() {
    const trimmed = draft.trim();
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
    }
    setDraft("");
  }

  function removeTag(tag: string) {
    onChange(value.filter((existing) => existing !== tag));
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      commitDraft();
    } else if (event.key === "Backspace" && draft === "" && value.length > 0) {
      removeTag(value[value.length - 1]);
    }
  }

  return (
    <div className={styles.root}>
      <label htmlFor={inputId} className={styles.label}>
        {label}
      </label>
      <div className={styles.field}>
        <ul className={styles.tags} role="list">
          {value.map((tag) => (
            <li key={tag} className={styles.tag}>
              {tag}
              <button
                type="button"
                aria-label={`Remove ${tag}`}
                className={styles.remove}
                disabled={disabled}
                onClick={() => removeTag(tag)}
              >
                <svg
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M5 5 L15 15 M15 5 L5 15" />
                </svg>
              </button>
            </li>
          ))}
        </ul>
        <input
          id={inputId}
          type="text"
          className={styles.input}
          value={draft}
          disabled={disabled}
          onChange={(event) => setDraft(event.currentTarget.value)}
          onKeyDown={handleKeyDown}
          onBlur={commitDraft}
        />
      </div>
    </div>
  );
}
