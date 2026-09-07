import { useId, useRef, type ClipboardEvent, type KeyboardEvent } from "react";
import styles from "./InputOTP.module.css";

export interface InputOTPOwnProps {
  /** Never substitute with placeholder - placeholder-as-label is banned. */
  label: string;
  /** @default 6 */
  length?: number;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export type InputOTPProps = InputOTPOwnProps;

export function InputOTP({ label, length = 6, value, onChange, disabled }: InputOTPProps) {
  const groupId = useId();
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const digits = Array.from({ length }, (_, i) => value[i] ?? "");

  function setDigit(index: number, digit: string) {
    const next = digits.slice();
    next[index] = digit;
    onChange(next.join(""));
  }

  function handleChange(index: number, raw: string) {
    const digit = raw.replace(/\D/g, "").slice(-1);
    setDigit(index, digit);
    if (digit && index < length - 1) inputRefs.current[index + 1]?.focus();
  }

  function handleKeyDown(index: number, event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Backspace" && !digits[index] && index > 0) {
      event.preventDefault();
      inputRefs.current[index - 1]?.focus();
      setDigit(index - 1, "");
    } else if (event.key === "ArrowLeft" && index > 0) {
      event.preventDefault();
      inputRefs.current[index - 1]?.focus();
    } else if (event.key === "ArrowRight" && index < length - 1) {
      event.preventDefault();
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handlePaste(event: ClipboardEvent<HTMLInputElement>) {
    const pasted = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    if (!pasted) return;
    event.preventDefault();
    onChange(pasted.padEnd(length, "").slice(0, length));
    const focusIndex = Math.min(pasted.length, length - 1);
    inputRefs.current[focusIndex]?.focus();
  }

  return (
    <div role="group" aria-labelledby={groupId} className={styles.root}>
      <span id={groupId} className={styles.label}>
        {label}
      </span>
      <div className={styles.digits}>
        {digits.map((digit, index) => (
          <input
            // eslint-disable-next-line react/no-array-index-key
            key={index}
            ref={(node) => {
              inputRefs.current[index] = node;
            }}
            type="text"
            inputMode="numeric"
            autoComplete={index === 0 ? "one-time-code" : "off"}
            maxLength={1}
            value={digit}
            disabled={disabled}
            aria-label={`Digit ${index + 1} of ${length}`}
            className={styles.digit}
            onChange={(event) => handleChange(index, event.currentTarget.value)}
            onKeyDown={(event) => handleKeyDown(index, event)}
            onPaste={handlePaste}
          />
        ))}
      </div>
    </div>
  );
}
