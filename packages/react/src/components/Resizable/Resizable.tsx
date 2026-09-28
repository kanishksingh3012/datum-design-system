import { forwardRef, useRef, type HTMLAttributes, type ReactNode, type Ref } from "react";
import { mergeProps, mergeRefs, useNumberFormatter, useSlider, useSliderThumb } from "react-aria";
import { useSliderState } from "react-stately";
import { useControlledState } from "react-stately/useControlledState";
import styles from "./Resizable.module.css";

export type ResizableOrientation = "horizontal" | "vertical";

export interface ResizableOwnProps {
  /** The first panel: left, or top when vertical. */
  first: ReactNode;
  /** The second panel: right, or bottom when vertical. */
  second: ReactNode;
  /** `horizontal` puts the panels side by side; `vertical` stacks them. @default "horizontal" */
  orientation?: ResizableOrientation;
  /** The first panel's share of the space, 0–100 (controlled). */
  value?: number;
  /** The first panel's starting share (uncontrolled). @default 50 */
  defaultValue?: number;
  /** Called with the first panel's new share as the handle moves. */
  onValueChange?: (value: number) => void;
  /** Called once a drag or key press ends — for saving the layout. */
  onValueCommit?: (value: number) => void;
  /** The smallest share the first panel can have. @default 10 */
  min?: number;
  /** The largest share the first panel can have. @default 90 */
  max?: number;
  /** How far one arrow key press moves the handle, in percent. @default 1 */
  step?: number;
  /** Names the handle. @default "Resize panels" */
  handleLabel?: string;
  /** @default false */
  disabled?: boolean;
}

/** `ref`, `className` and every other prop go on the root. */
export type ResizableProps = ResizableOwnProps & Omit<HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange">;

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/**
 * Two panels with a handle between them that resizes them. The handle is a
 * slider thumb on React Aria's `useSlider` and `useSliderThumb`: drag it, or
 * focus it and use the arrow keys (Home and End jump to the limits). Its native
 * range input carries the name and the value, announced as the first panel's
 * share. The line is 1px; the grab area around it is 44px.
 */
export const Resizable = forwardRef<HTMLDivElement, ResizableProps>(function Resizable(
  {
    first,
    second,
    orientation = "horizontal",
    value,
    defaultValue = 50,
    onValueChange,
    onValueCommit,
    min = 10,
    max = 90,
    step = 1,
    handleLabel = "Resize panels",
    disabled = false,
    className,
    style,
    ...rest
  },
  ref
) {
  const vertical = orientation === "vertical";
  const [split, setSplit] = useControlledState(value, clamp(defaultValue, min, max), onValueChange);
  // A vertical slider grows upward, so it holds the bottom panel's share: the keys and the drag then
  // move the handle the way they point. The track is the whole root, so a drag maps 1:1 to the pointer.
  const flip = (v: number) => (vertical ? 100 - v : v);
  const numberFormatter = useNumberFormatter();
  const props = {
    "aria-label": handleLabel,
    orientation,
    value: [flip(split)],
    onChange: (v: number[]) => setSplit(clamp(flip(v[0]), min, max)),
    onChangeEnd: onValueCommit && ((v: number[]) => onValueCommit(clamp(flip(v[0]), min, max))),
    minValue: 0,
    maxValue: 100,
    step,
    isDisabled: disabled,
  };
  const state = useSliderState({ ...props, numberFormatter });
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  useSlider(props, state, rootRef);
  const { thumbProps, inputProps, isDragging } = useSliderThumb({ index: 0, trackRef: rootRef, inputRef, "aria-label": handleLabel, orientation, isDisabled: disabled }, state);
  const { style: _position, ...handleProps } = thumbProps;
  const tracks = `minmax(0, ${split}fr) auto minmax(0, ${100 - split}fr)`;

  return (
    <div
      {...rest}
      ref={mergeRefs(ref, rootRef) as Ref<HTMLDivElement>}
      className={[styles.root, className].filter(Boolean).join(" ")}
      style={{ ...(vertical ? { gridTemplateRows: tracks } : { gridTemplateColumns: tracks }), ...style }}
      data-orientation={orientation}
      data-dragging={isDragging || undefined}
      data-disabled={disabled || undefined}
    >
      <div className={styles.panel}>{first}</div>
      <div {...handleProps} className={styles.handle} data-control="" data-dragging={isDragging || undefined}>
        <span className={styles.grip} aria-hidden="true" />
        <input
          {...mergeProps(inputProps, {
            // the real limits and the first panel's share, whichever way the slider runs
            min: vertical ? 100 - max : min,
            max: vertical ? 100 - min : max,
            "aria-valuetext": `${Math.round(split)}%`,
          })}
          ref={inputRef}
          className={styles.input}
        />
      </div>
      <div className={styles.panel}>{second}</div>
    </div>
  );
});

Resizable.displayName = "Resizable";
