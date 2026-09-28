import { forwardRef, useRef, type HTMLAttributes, type RefObject } from "react";
import { mergeProps, useNumberFormatter, useSlider, useSliderThumb } from "react-aria";
import { useSliderState, type SliderState } from "react-stately";
import styles from "./Slider.module.css";

export type SliderSize = "sm" | "md";

export interface SliderOwnProps {
  /** Visible label that names the slider (or pass `aria-label` for none). */
  label?: string;
  /** The value (controlled). Two numbers make a range with two thumbs. */
  value?: number | number[];
  /** The starting value (uncontrolled). Two numbers make a range. @default min */
  defaultValue?: number | number[];
  /** Called with the new value as it moves: a number, or an array for a range. */
  onValueChange?: (value: number | number[]) => void;
  /** Called once a drag or key press ends — for work too heavy to run on every move. */
  onValueCommit?: (value: number | number[]) => void;
  /** @default 0 */
  min?: number;
  /** @default 100 */
  max?: number;
  /** @default 1 */
  step?: number;
  /** How the value is shown and announced: currency, percent, units. */
  formatOptions?: Intl.NumberFormatOptions;
  /** Shows the value beside the label. @default true when there is a label */
  showValue?: boolean;
  /** 4 / 6px track with a 16 / 20px thumb; the hit area is 44px either way. @default "md" */
  size?: SliderSize;
  /** @default false */
  disabled?: boolean;
  /** Submitted with a form; a range submits one value per thumb under this name. */
  name?: string;
}

/** `ref`, `className` and every other prop go on the root. */
export type SliderProps = SliderOwnProps & Omit<HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange">;

const toArray = (v: number | number[] | undefined) => (v === undefined ? undefined : Array.isArray(v) ? v : [v]);

/**
 * Picks a number (or a range) by dragging a thumb along a track. Built on
 * React Aria's `useSlider` and `useSliderThumb`: each thumb is a native range
 * input, so arrow keys, Page Up / Down, Home and End work and screen readers
 * announce the formatted value. The filled part uses `text.accent`, like
 * ProgressBar, so it reaches 3:1 against the track.
 */
export const Slider = forwardRef<HTMLDivElement, SliderProps>(function Slider(
  {
    label,
    value,
    defaultValue,
    onValueChange,
    onValueCommit,
    min = 0,
    max = 100,
    step = 1,
    formatOptions,
    showValue = Boolean(label),
    size = "md",
    disabled = false,
    name,
    className,
    ...rest
  },
  ref
) {
  const range = Array.isArray(value ?? defaultValue);
  const unwrap = (v: number[]) => (range ? v : v[0]);
  const numberFormatter = useNumberFormatter(formatOptions);
  const props = {
    label,
    "aria-label": rest["aria-label"],
    "aria-labelledby": rest["aria-labelledby"],
    value: toArray(value),
    defaultValue: toArray(defaultValue) ?? [min],
    onChange: onValueChange && ((v: number[]) => onValueChange(unwrap(v))),
    onChangeEnd: onValueCommit && ((v: number[]) => onValueCommit(unwrap(v))),
    minValue: min,
    maxValue: max,
    step,
    isDisabled: disabled,
  };
  const state = useSliderState({ ...props, numberFormatter });
  const trackRef = useRef<HTMLDivElement>(null);
  const { groupProps, trackProps, labelProps, outputProps } = useSlider(props, state, trackRef);
  const [start, end] = range ? [state.getThumbPercent(0), state.getThumbPercent(1)] : [0, state.getThumbPercent(0)];
  const shown = state.values.map((_, i) => state.getThumbValueLabel(i)).join(" – ");

  return (
    <div
      {...mergeProps(rest, groupProps)}
      ref={ref}
      className={[styles.root, className].filter(Boolean).join(" ")}
      data-size={size}
      data-disabled={disabled || undefined}
    >
      {(label || showValue) && (
        <div className={styles.header}>
          {label && (
            <label {...labelProps} className={styles.label}>
              {label}
            </label>
          )}
          {showValue && (
            <output {...outputProps} className={styles.value}>
              {shown}
            </output>
          )}
        </div>
      )}
      <div {...trackProps} ref={trackRef} className={styles.track}>
        <span className={styles.rail} aria-hidden="true" />
        {/* one value fills from the rail's own start; a range fills between its thumbs */}
        <span className={styles.fill} data-from-start={range ? undefined : ""} style={{ left: range ? `${start * 100}%` : undefined, right: `${(1 - end) * 100}%` }} aria-hidden="true" />
        {state.values.map((_, i) => (
          <Thumb key={i} index={i} state={state} trackRef={trackRef} name={name} disabled={disabled} label={range ? (i === 0 ? "Minimum" : "Maximum") : undefined} />
        ))}
      </div>
    </div>
  );
});

Slider.displayName = "Slider";

interface ThumbProps {
  index: number;
  state: SliderState;
  trackRef: RefObject<HTMLDivElement | null>;
  name?: string;
  disabled: boolean;
  /** Tells a range's two thumbs apart; joined to the slider's own label. */
  label?: string;
}

function Thumb({ index, state, trackRef, name, disabled, label }: ThumbProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { thumbProps, inputProps, isDragging } = useSliderThumb({ index, trackRef, inputRef, name, isDisabled: disabled, "aria-label": label }, state);
  // position from React Aria; the centering transform lives in the CSS so press can scale it
  const { transform: _transform, ...position } = thumbProps.style ?? {};
  return (
    <div
      {...thumbProps}
      style={position}
      className={styles.thumb}
      data-control=""
      data-dragging={isDragging || undefined}
    >
      {/* the native input carries focus and keyboard input; the drawn thumb takes the pointer */}
      <input {...inputProps} ref={inputRef} className={styles.input} />
    </div>
  );
}
