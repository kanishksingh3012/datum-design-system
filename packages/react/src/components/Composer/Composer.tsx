import { useId, type FormEvent, type KeyboardEvent } from "react";
import styles from "./Composer.module.css";

export interface ComposerOwnProps {
  /** Never substitute with placeholder - placeholder-as-label is banned. */
  label: string;
  value: string;
  onChange: (value: string) => void;
  onSubmit: (value: string) => void;
  /** True while the assistant is responding - disables the input and swaps the send button for real status text. */
  thinking?: boolean;
  disabled?: boolean;
}

export type ComposerProps = ComposerOwnProps;

/**
 * CSS field-sizing: content grows the textarea with its own content - no
 * scroll-height measuring in JS. Enter submits, Shift+Enter inserts a
 * real newline (the universal chat-input convention). While thinking,
 * the input disables and the button becomes real status text
 * ("Thinking...") rather than just a disabled icon, so a screen reader
 * user knows why they can't type.
 */
export function Composer({ label, value, onChange, onSubmit, thinking = false, disabled = false }: ComposerProps) {
  const inputId = useId();
  const isDisabled = disabled || thinking;

  function submit() {
    const trimmed = value.trim();
    if (trimmed && !isDisabled) onSubmit(trimmed);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      submit();
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    submit();
  }

  return (
    <form className={styles.root} onSubmit={handleSubmit}>
      <label htmlFor={inputId} className={styles.visuallyHidden}>
        {label}
      </label>
      <textarea
        id={inputId}
        rows={1}
        className={styles.textarea}
        value={value}
        disabled={isDisabled}
        onChange={(event) => onChange(event.currentTarget.value)}
        onKeyDown={handleKeyDown}
      />
      {thinking ? (
        <span role="status" className={styles.thinking}>
          Thinking...
        </span>
      ) : (
        <button type="submit" className={styles.send} disabled={isDisabled || !value.trim()}>
          Send
        </button>
      )}
    </form>
  );
}
