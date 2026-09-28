import { forwardRef, useId, type FormEvent, type HTMLAttributes, type KeyboardEvent } from "react";
import { useControllableState } from "../../lib/useControllableState";
import { Button } from "../Button/Button";
import styles from "./Composer.module.css";

export interface ComposerOwnProps {
  /** Names the field for assistive tech (visually hidden). Never replaced by the placeholder. */
  label: string;
  /** @default "Message…" */
  placeholder?: string;
  /** The draft (controlled). */
  value?: string;
  /** The draft to start with (uncontrolled). @default "" */
  defaultValue?: string;
  /** Called with the new draft on every edit. */
  onValueChange?: (value: string) => void;
  /** Called with the trimmed draft on Enter or Send. An uncontrolled draft then clears. */
  onSubmit: (value: string) => void;
  /** The assistant is responding: Send can't fire (a draft can still be typed). With `onStop`, the button becomes Stop. @default false */
  thinking?: boolean;
  /** Stops the response in progress. */
  onStop?: () => void;
  /** @default false */
  disabled?: boolean;
}

export type ComposerProps = ComposerOwnProps & Omit<HTMLAttributes<HTMLFormElement>, "onSubmit" | "defaultValue">;

const ArrowUp = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 19V5 M5 12l7-7 7 7" />
  </svg>
);
const StopIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <rect x="7" y="7" width="10" height="10" rx="1.5" />
  </svg>
);

/**
 * The chat input: a textarea that grows with its content (CSS field-sizing)
 * in Datum's field box, with Send beside it. Enter sends, Shift+Enter adds a
 * line. While the assistant is thinking, Send shows as loading — or as Stop,
 * given `onStop` — and the field stays editable so the next message can be drafted.
 */
export const Composer = forwardRef<HTMLFormElement, ComposerProps>(function Composer(
  { label, placeholder = "Message…", value, defaultValue = "", onValueChange, onSubmit, thinking = false, onStop, disabled = false, className, ...rest },
  ref
) {
  const id = useId();
  const [draft, setDraft] = useControllableState(value, defaultValue, onValueChange);
  const canSend = !disabled && !thinking && draft.trim() !== "";

  function submit() {
    if (!canSend) return;
    onSubmit(draft.trim());
    if (value === undefined) setDraft("");
  }

  return (
    <form
      ref={ref}
      className={[styles.root, className].filter(Boolean).join(" ")}
      onSubmit={(event: FormEvent) => {
        event.preventDefault();
        submit();
      }}
      {...rest}
    >
      <label htmlFor={id} className={styles.srOnly}>{label}</label>
      <div className={styles.box} data-control="" data-disabled={disabled || undefined}>
        <textarea
          id={id}
          rows={1}
          className={styles.input}
          value={draft}
          placeholder={placeholder}
          disabled={disabled}
          onChange={(event) => setDraft(event.currentTarget.value)}
          onKeyDown={(event: KeyboardEvent<HTMLTextAreaElement>) => {
            if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
              event.preventDefault();
              submit();
            }
          }}
        />
        {thinking && onStop ? (
          <Button type="button" intent="neutral" iconOnly label="Stop" onClick={onStop} disabled={disabled}>
            <StopIcon />
          </Button>
        ) : (
          <Button type="submit" iconOnly label="Send" loading={thinking} disabled={!thinking && !canSend}>
            <ArrowUp />
          </Button>
        )}
      </div>
    </form>
  );
});

Composer.displayName = "Composer";
