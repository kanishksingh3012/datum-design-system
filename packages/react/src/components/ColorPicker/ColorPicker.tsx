import { forwardRef, useId, useRef, type HTMLAttributes } from "react";
import { useColorArea, useColorField, useColorSlider, useColorSwatch, useLocale } from "react-aria";
import {
  parseColor,
  useColorAreaState,
  useColorFieldState,
  useColorPickerState,
  useColorSliderState,
  type Color,
  type ColorPickerState,
} from "react-stately";
import { FieldFrame, useFieldWiring, type FieldProps } from "../Field/Field";
import { Popover, type PopoverPlacement } from "../Popover/Popover";
import styles from "./ColorPicker.module.css";

export type ColorPickerSize = "sm" | "md" | "lg";

export interface ColorPickerOwnProps extends FieldProps {
  /** The color (controlled): any CSS color string, e.g. "#FC6E20". */
  value?: string;
  /** The starting color (uncontrolled). @default "#000000" */
  defaultValue?: string;
  /** Called with the new color as a 6-digit hex string. */
  onValueChange?: (hex: string) => void;
  /** Preset colors shown under the picker, as CSS color strings. */
  swatches?: string[];
  /** 32 / 40 / 48px trigger, like the other fields. @default "md" */
  size?: ColorPickerSize;
  /** Where the panel opens; flips when there is no room. @default "bottom-start" */
  placement?: PopoverPlacement;
  /** The panel's open state (controlled). */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Submitted with a form as the hex value. */
  name?: string;
}

/** `ref`, `className` and every other prop go on the field root. */
export type ColorPickerProps = ColorPickerOwnProps & Omit<HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange">;

const hex = (color: Color) => color.toString("hex");

/**
 * A field whose trigger shows the color and its hex value; it opens a panel
 * with a saturation × brightness area, a hue slider, a hex field and optional
 * swatches. Built on React Aria's color hooks (`useColorArea`,
 * `useColorSlider`, `useColorField`, `useColorSwatch`) with
 * `useColorPickerState`, and the panel is a Popover. The colors it shows are
 * the user's data, so they are set inline; everything around them is tokens.
 */
export const ColorPicker = forwardRef<HTMLDivElement, ColorPickerProps>(function ColorPicker(
  {
    label,
    helpText,
    errorText,
    required,
    disabled = false,
    readOnly = false,
    value,
    defaultValue,
    onValueChange,
    swatches,
    size = "md",
    placement = "bottom-start",
    open,
    defaultOpen,
    onOpenChange,
    name,
    className,
    ...rest
  },
  ref
) {
  const state = useColorPickerState({ value, defaultValue, onChange: onValueChange && ((c) => onValueChange(hex(c))) });
  const { labelProps, control, descriptionProps, errorMessageProps } = useFieldWiring({ label, helpText, errorText, required, disabled, readOnly });
  const { required: _required, readOnly: _readOnly, ...buttonControl } = control;
  const valueId = useId();
  const labelledBy = `${labelProps.id} ${valueId}`;
  const trigger = (
    <button
      type="button"
      {...buttonControl}
      aria-labelledby={labelledBy}
      className={styles.trigger}
      data-size={size}
      data-invalid={errorText ? true : undefined}
      data-disabled={disabled || undefined}
      data-readonly={readOnly || undefined}
      disabled={disabled || readOnly}
    >
      <span className={styles.chip} style={{ background: state.color.toString("css") }} aria-hidden="true" />
      <span id={valueId} className={styles.value}>
        {hex(state.color)}
      </span>
    </button>
  );

  return (
    <FieldFrame
      ref={ref}
      label={label}
      labelProps={labelProps}
      helpText={helpText}
      errorText={errorText}
      required={required}
      disabled={disabled}
      readOnly={readOnly}
      descriptionProps={descriptionProps}
      errorMessageProps={errorMessageProps}
      rootProps={rest}
      className={[styles.root, className].filter(Boolean).join(" ")}
    >
      <Popover
        trigger={trigger}
        placement={placement}
        open={open}
        defaultOpen={defaultOpen}
        onOpenChange={onOpenChange}
        aria-label={label}
        className={styles.panel}
      >
        <Area state={state} />
        <HueSlider state={state} />
        <HexField state={state} />
        {swatches?.length ? (
          <div className={styles.swatches} role="group" aria-label="Swatches">
            {swatches.map((s) => (
              <Swatch key={s} color={s} state={state} />
            ))}
          </div>
        ) : null}
      </Popover>
      {name ? <input type="hidden" name={name} value={hex(state.color)} /> : null}
    </FieldFrame>
  );
});

ColorPicker.displayName = "ColorPicker";

type PartProps = { state: ColorPickerState };
// position from React Aria; the centering transform lives in the CSS so press can scale it
const place = (style: object | undefined, color: Color) => {
  const { transform: _t, ...position } = (style ?? {}) as Record<string, unknown>;
  return { ...position, background: color.toString("css") };
};

/** Saturation across, brightness up: one thumb, two keyboard axes. */
function Area({ state }: PartProps) {
  const areaState = useColorAreaState({ value: state.color, onChange: state.setColor, xChannel: "saturation", yChannel: "brightness", colorSpace: "hsb" });
  const containerRef = useRef<HTMLDivElement>(null);
  const inputXRef = useRef<HTMLInputElement>(null);
  const inputYRef = useRef<HTMLInputElement>(null);
  const { colorAreaProps, thumbProps, xInputProps, yInputProps } = useColorArea(
    { containerRef, inputXRef, inputYRef, xChannel: "saturation", yChannel: "brightness", colorSpace: "hsb" },
    areaState
  );
  return (
    <div {...colorAreaProps} ref={containerRef} className={styles.area}>
      <div {...thumbProps} style={place(thumbProps.style, areaState.getDisplayColor())} className={styles.thumb} data-dragging={areaState.isDragging || undefined}>
        <input {...xInputProps} ref={inputXRef} />
        <input {...yInputProps} ref={inputYRef} />
      </div>
    </div>
  );
}

function HueSlider({ state }: PartProps) {
  const { locale } = useLocale();
  const sliderState = useColorSliderState({ channel: "hue", value: state.color, onChange: state.setColor, colorSpace: "hsb", locale });
  const trackRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { trackProps, thumbProps, inputProps } = useColorSlider({ channel: "hue", colorSpace: "hsb", trackRef, inputRef }, sliderState);
  return (
    <div {...trackProps} ref={trackRef} className={styles.hue}>
      <div {...thumbProps} style={place(thumbProps.style, sliderState.getDisplayColor())} className={styles.thumb} data-dragging={sliderState.isThumbDragging(0) || undefined}>
        <input {...inputProps} ref={inputRef} />
      </div>
    </div>
  );
}

function HexField({ state }: PartProps) {
  const fieldState = useColorFieldState({ value: state.color, onChange: (c) => c && state.setColor(c) });
  const inputRef = useRef<HTMLInputElement>(null);
  const { labelProps, inputProps } = useColorField({ label: "Hex" }, fieldState, inputRef);
  return (
    <div className={styles.hexRow}>
      <label {...labelProps} className={styles.hexLabel}>
        Hex
      </label>
      <div className={styles.hexBox} data-control="" data-size="sm">
        <input {...inputProps} ref={inputRef} className={styles.hexInput} />
      </div>
    </div>
  );
}

function Swatch({ color, state }: PartProps & { color: string }) {
  const parsed = parseColor(color);
  const { colorSwatchProps } = useColorSwatch({ color: parsed });
  const selected = hex(parsed) === hex(state.color);
  return (
    <button
      type="button"
      onClick={() => state.setColor(parsed)}
      aria-label={colorSwatchProps["aria-label"]}
      aria-pressed={selected}
      className={styles.swatch}
    >
      <span className={styles.swatchColor} style={{ background: parsed.toString("css") }} />
    </button>
  );
}
