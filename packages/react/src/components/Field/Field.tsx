import { cloneElement, forwardRef, isValidElement, type DOMAttributes, type HTMLAttributes, type ReactElement, type ReactNode } from "react";
import { mergeProps, useField } from "react-aria";
import { StatusIcon } from "../../lib/statusIcons";
import { Label } from "../Label/Label";
import styles from "./Field.module.css";

/** The props every form control shares. TextField, Textarea and Select take them directly. */
export interface FieldProps {
  /** Visible label — never replaced by a placeholder. */
  label: string;
  /** Shown below the control; replaced by `errorText` when present. */
  helpText?: string;
  /** Marks the control invalid (aria-invalid, data-invalid) and describes it. */
  errorText?: string;
  /** Adds the required indicator and `required` on the control. @default false */
  required?: boolean;
  /** Dims the whole field and disables the control. @default false */
  disabled?: boolean;
  /** Focusable and readable but not editable; drawn with a dashed edge, never dimmed. @default false */
  readOnly?: boolean;
}

/** What Field hands to its control so the label, help and error text are wired to it. */
export interface FieldControlProps {
  id: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
  "aria-invalid"?: true;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
}

export interface FieldOwnProps extends FieldProps {
  /**
   * The control. A function receives the props to spread onto it; a single
   * element has them merged in.
   */
  children: ReactElement | ((control: FieldControlProps) => ReactNode);
}

export type FieldRootProps = Omit<HTMLAttributes<HTMLDivElement>, "children">;
export type FieldComponentProps = FieldOwnProps & FieldRootProps;

interface FieldFrameProps extends Omit<FieldProps, "label"> {
  label: string;
  /** `span` for groups and widgets a <label> can't point at. */
  labelAs?: "label" | "span";
  labelProps: DOMAttributes<HTMLElement> & { id?: string; htmlFor?: string };
  descriptionProps: DOMAttributes<HTMLElement>;
  errorMessageProps: DOMAttributes<HTMLElement>;
  /** Extra content at the end of the message row, e.g. a character counter. */
  aside?: ReactNode;
  rootProps?: HTMLAttributes<HTMLDivElement>;
  className?: string;
  children: ReactNode;
}

/** Internal: the shared layout of every field — label, control, then help or error text. */
export const FieldFrame = forwardRef<HTMLDivElement, FieldFrameProps>(function FieldFrame(
  { label, labelAs = "label", labelProps, helpText, errorText, required, disabled, readOnly, descriptionProps, errorMessageProps, aside, rootProps, className, children },
  ref
) {
  return (
    <div
      ref={ref}
      {...rootProps}
      className={[styles.root, className].filter(Boolean).join(" ")}
      data-disabled={disabled || undefined}
      data-readonly={readOnly || undefined}
      data-invalid={errorText ? true : undefined}
    >
      <Label as={labelAs} required={required} {...(labelProps as object)}>
        {label}
      </Label>
      {children}
      {(errorText || helpText || aside) && (
        <div className={styles.messages}>
          {errorText ? (
            <p className={styles.error} {...errorMessageProps}>
              <StatusIcon intent="danger" className={styles.errorIcon} />
              {errorText}
            </p>
          ) : helpText ? (
            <p className={styles.help} {...descriptionProps}>
              {helpText}
            </p>
          ) : null}
          {aside}
        </div>
      )}
    </div>
  );
});

/** Internal: wires label, help and error text to one control through React Aria's useField. */
export function useFieldWiring({ label, helpText, errorText, required, disabled, readOnly }: FieldProps) {
  const { labelProps, fieldProps, descriptionProps, errorMessageProps } = useField({
    label,
    description: errorText ? undefined : helpText,
    errorMessage: errorText,
    isInvalid: Boolean(errorText),
  });
  const control: FieldControlProps = {
    ...(fieldProps as { id: string }),
    "aria-invalid": errorText ? true : undefined,
    required: required || undefined,
    disabled: disabled || undefined,
    readOnly: readOnly || undefined,
  };
  return { labelProps, control, descriptionProps, errorMessageProps };
}

/**
 * Wires a label, help text and error text to any control — Datum's own or a
 * custom one — so every form field reads and behaves the same.
 */
export const Field = forwardRef<HTMLDivElement, FieldComponentProps>(function Field(
  { label, helpText, errorText, required = false, disabled = false, readOnly = false, children, className, ...rest },
  ref
) {
  const { labelProps, control, descriptionProps, errorMessageProps } = useFieldWiring({ label, helpText, errorText, required, disabled, readOnly });
  const content =
    typeof children === "function"
      ? children(control)
      : isValidElement(children)
        ? cloneElement(children, mergeProps(children.props as object, control))
        : children;

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
      className={className}
    >
      {content}
    </FieldFrame>
  );
});

Field.displayName = "Field";
