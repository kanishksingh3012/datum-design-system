import { useId, useState, type ChangeEvent } from "react";
import styles from "./ColorPicker.module.css";

const HEX_PATTERN = /^#[0-9a-fA-F]{6}$/;

export interface ColorPickerOwnProps {
  /** Never substitute with placeholder - placeholder-as-label is banned. */
  label: string;
  /** A 6-digit hex color, e.g. "#3366ff". */
  value: string;
  onChange: (hex: string) => void;
  disabled?: boolean;
}

export type ColorPickerProps = ColorPickerOwnProps;

/**
 * input type="color" alone isn't reliably accessible: it can't be
 * keyboard-focused at all in Safari, and screen readers announce its role
 * inconsistently across browsers (text input / button / color chooser /
 * color well). The fix isn't a custom-built widget - it's pairing the
 * native swatch with a real, always-focusable hex text input on the same
 * value, so there's a working keyboard path regardless of the swatch's
 * platform quirks.
 */
export function ColorPicker({ label, value, onChange, disabled }: ColorPickerProps) {
  const swatchId = useId();
  const hexId = useId();
  const [draft, setDraft] = useState(value);

  function commitIfValid(next: string) {
    setDraft(next);
    if (HEX_PATTERN.test(next)) onChange(next);
  }

  function handleSwatchChange(event: ChangeEvent<HTMLInputElement>) {
    const next = event.currentTarget.value;
    setDraft(next);
    onChange(next);
  }

  return (
    <div className={styles.root}>
      <span className={styles.label}>{label}</span>
      <div className={styles.controls}>
        <label className={styles.swatchLabel} htmlFor={swatchId}>
          <span className={styles.visuallyHidden}>{label} swatch</span>
          <input
            id={swatchId}
            type="color"
            value={HEX_PATTERN.test(draft) ? draft : value}
            disabled={disabled}
            className={styles.swatch}
            onChange={handleSwatchChange}
          />
        </label>
        <label className={styles.hexLabel} htmlFor={hexId}>
          <span className={styles.visuallyHidden}>{label} hex value</span>
          <input
            id={hexId}
            type="text"
            inputMode="text"
            spellCheck={false}
            value={draft}
            disabled={disabled}
            className={styles.hexInput}
            onChange={(event) => commitIfValid(event.currentTarget.value)}
            onBlur={() => setDraft(HEX_PATTERN.test(draft) ? draft : value)}
          />
        </label>
      </div>
    </div>
  );
}
