import { forwardRef, useId, useRef, useState, type HTMLAttributes } from "react";
import { isFileDropItem, useDrop, useLocale } from "react-aria";
import { useControlledState } from "react-stately/useControlledState";
import { Button } from "../Button/Button";
import { FieldFrame, useFieldWiring, type FieldProps } from "../Field/Field";
import styles from "./FileUpload.module.css";

export type FileUploadSize = "sm" | "md";
export type FileUploadRejectReason = "type" | "size" | "count";

export interface FileUploadRejection {
  file: File;
  reason: FileUploadRejectReason;
}

export interface FileUploadOwnProps extends Omit<FieldProps, "readOnly"> {
  /** The chosen files (controlled). */
  value?: File[];
  /** The starting files (uncontrolled). @default [] */
  defaultValue?: File[];
  /** Called with the whole new list when files are added or removed. */
  onValueChange?: (files: File[]) => void;
  /** Called with the files that were turned away, and why. */
  onReject?: (rejections: FileUploadRejection[]) => void;
  /** Accepted types, as for a native file input: "image/*,.pdf". */
  accept?: string;
  /** More than one file; new files are added to the list. @default false */
  multiple?: boolean;
  /** The largest file, in bytes. */
  maxSize?: number;
  /** The most files the list holds (with `multiple`). */
  maxFiles?: number;
  /** A short line under the prompt, e.g. "PNG or JPG, up to 5 MB". */
  hint?: string;
  /** `md` is a tall drop area; `sm` is one row. @default "md" */
  size?: FileUploadSize;
  /** Submitted with a form. */
  name?: string;
}

/** `ref`, `className` and every other prop go on the field root. */
export type FileUploadProps = FileUploadOwnProps & Omit<HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange">;

const UploadIcon = (
  <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
    <path d="M12 16V4m0 0L7 9m5-5l5 5M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const FileIcon = (
  <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
    <path d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8zm0 0v5h5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
  </svg>
);
const CloseIcon = (
  <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
    <path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

/** Whether a file matches an `accept` list of MIME types, wildcards and extensions. */
export function acceptsFile(file: File, accept?: string) {
  if (!accept) return true;
  const name = file.name.toLowerCase();
  const type = file.type.toLowerCase();
  return accept.split(",").some((raw) => {
    const rule = raw.trim().toLowerCase();
    if (!rule) return false;
    if (rule.startsWith(".")) return name.endsWith(rule);
    if (rule.endsWith("/*")) return type.startsWith(rule.slice(0, -1));
    return type === rule;
  });
}

const sameFile = (a: File, b: File) => a.name === b.name && a.size === b.size && a.lastModified === b.lastModified;

function useFormatBytes() {
  const { locale } = useLocale();
  return (bytes: number) => {
    const units = ["byte", "kilobyte", "megabyte", "gigabyte"] as const;
    const i = Math.min(units.length - 1, bytes > 0 ? Math.floor(Math.log(bytes) / Math.log(1000)) : 0);
    return new Intl.NumberFormat(locale, { style: "unit", unit: units[i], unitDisplay: "short", maximumFractionDigits: i ? 1 : 0 }).format(bytes / 1000 ** i);
  };
}

/**
 * A drop area with a "Choose files" button, and the chosen files listed below
 * with a remove button each. Dropping runs on React Aria's `useDrop`; the
 * button opens the native file dialog, so keyboard and screen reader users
 * never need to drag. Files that break `accept`, `maxSize` or `maxFiles` are
 * turned away with a message in the field's error slot and `onReject`.
 */
export const FileUpload = forwardRef<HTMLDivElement, FileUploadProps>(function FileUpload(
  {
    label,
    helpText,
    errorText,
    required = false,
    disabled = false,
    value,
    defaultValue,
    onValueChange,
    onReject,
    accept,
    multiple = false,
    maxSize,
    maxFiles,
    hint,
    size = "md",
    name,
    className,
    ...rest
  },
  ref
) {
  const [files, setFiles] = useControlledState(value, defaultValue ?? [], onValueChange);
  const [rejected, setRejected] = useState<string>();
  const formatBytes = useFormatBytes();
  const shownError = errorText ?? rejected;
  const { labelProps, control, descriptionProps, errorMessageProps } = useFieldWiring({ label, helpText, errorText: shownError, required, disabled });
  const inputRef = useRef<HTMLInputElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const zoneRef = useRef<HTMLDivElement>(null);
  const buttonId = useId();

  const add = (incoming: File[]) => {
    const rejections: FileUploadRejection[] = [];
    let next = multiple ? [...files] : [];
    for (const file of incoming) {
      if (!acceptsFile(file, accept)) rejections.push({ file, reason: "type" });
      else if (maxSize !== undefined && file.size > maxSize) rejections.push({ file, reason: "size" });
      else if (!multiple && next.length) rejections.push({ file, reason: "count" });
      else if (maxFiles !== undefined && next.length >= maxFiles) rejections.push({ file, reason: "count" });
      else if (!next.some((f) => sameFile(f, file))) next = [...next, file];
    }
    const first = rejections[0];
    setRejected(
      !first
        ? undefined
        : first.reason === "type"
          ? `“${first.file.name}” isn’t an accepted file type.`
          : first.reason === "size"
            ? `“${first.file.name}” is larger than ${formatBytes(maxSize!)}.`
            : multiple
              ? `You can add up to ${maxFiles} ${maxFiles === 1 ? "file" : "files"}.`
              : "Choose one file."
    );
    if (rejections.length) onReject?.(rejections);
    if (next.length !== files.length || next.some((f, i) => f !== files[i])) setFiles(next);
  };

  const { dropProps, isDropTarget } = useDrop({
    ref: zoneRef,
    isDisabled: disabled,
    // drag types are MIME types (never "Files"), and extensions can't be known until the drop: accept is checked then
    getDropOperation: () => "copy",
    onDrop: async (e) => add(await Promise.all(e.items.filter(isFileDropItem).map((item) => item.getFile()))),
  });

  const remove = (file: File) => {
    setRejected(undefined);
    setFiles(files.filter((f) => f !== file));
    buttonRef.current?.focus();
  };
  const choose = () => inputRef.current?.click();

  return (
    <FieldFrame
      ref={ref}
      label={label}
      labelAs="span"
      labelProps={labelProps}
      helpText={helpText}
      errorText={shownError}
      required={required}
      disabled={disabled}
      descriptionProps={descriptionProps}
      errorMessageProps={errorMessageProps}
      rootProps={rest}
      className={[styles.root, className].filter(Boolean).join(" ")}
    >
      <div
        {...dropProps}
        ref={zoneRef}
        className={styles.zone}
        data-size={size}
        data-drop-target={isDropTarget || undefined}
        data-invalid={shownError ? true : undefined}
        data-disabled={disabled || undefined}
        // a click anywhere on the area opens the dialog too; the button is the keyboard path
        onClick={(e) => {
          if (!disabled && !(e.target as Element).closest("button")) choose();
        }}
      >
        {size === "md" ? <span className={styles.icon}>{UploadIcon}</span> : null}
        <div className={styles.prompt}>
          <Button
            ref={buttonRef}
            id={buttonId}
            intent="neutral"
            appearance="outline"
            size="sm"
            disabled={disabled}
            onClick={choose}
            aria-labelledby={`${buttonId} ${labelProps.id}`}
            aria-describedby={control["aria-describedby"]}
            aria-invalid={control["aria-invalid"]}
          >
            {multiple ? "Choose files" : "Choose file"}
          </Button>
          <span className={styles.or}>or drag {multiple ? "them" : "it"} here</span>
        </div>
        {hint ? <span className={styles.hint}>{hint}</span> : null}
        <input
          ref={inputRef}
          type="file"
          className={styles.input}
          tabIndex={-1}
          aria-hidden="true"
          accept={accept}
          multiple={multiple}
          name={name}
          disabled={disabled}
          onChange={(e) => {
            add(Array.from(e.currentTarget.files ?? []));
            e.currentTarget.value = "";
          }}
        />
      </div>
      {files.length ? (
        <ul className={styles.list} aria-label={`${label}: chosen files`}>
          {files.map((file) => (
            <li key={`${file.name}-${file.size}-${file.lastModified}`} className={styles.file}>
              <span className={styles.fileIcon}>{FileIcon}</span>
              <span className={styles.fileName}>{file.name}</span>
              <span className={styles.fileSize}>{formatBytes(file.size)}</span>
              <Button intent="neutral" appearance="ghost" size="sm" iconOnly label={`Remove ${file.name}`} disabled={disabled} onClick={() => remove(file)}>
                {CloseIcon}
              </Button>
            </li>
          ))}
        </ul>
      ) : null}
    </FieldFrame>
  );
});

FileUpload.displayName = "FileUpload";
