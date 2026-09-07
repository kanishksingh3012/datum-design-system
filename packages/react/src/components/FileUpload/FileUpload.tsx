import { forwardRef, useId, useRef, useState, type DragEvent, type InputHTMLAttributes } from "react";
import styles from "./FileUpload.module.css";

export type FileUploadErrorType = "accept" | "max-size" | "max-files";

export interface FileUploadOwnProps {
  /** Never substitute with placeholder - placeholder-as-label is banned. */
  label: string;
  onFilesSelected?: (files: File[]) => void;
  onError?: (error: { type: FileUploadErrorType }) => void;
  maxSizeBytes?: number;
  maxFiles?: number;
}

export type FileUploadProps = FileUploadOwnProps &
  Omit<InputHTMLAttributes<HTMLInputElement>, "id" | "type" | "onChange" | "onError">;

export const FileUpload = forwardRef<HTMLInputElement, FileUploadProps>(function FileUpload(
  { label, onFilesSelected, onError, maxSizeBytes, maxFiles, accept, multiple, className, ...rest },
  ref
) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [dragOver, setDragOver] = useState(false);

  function processFiles(fileList: FileList | null) {
    if (!fileList) return;
    const files = Array.from(fileList);

    if (maxFiles !== undefined && files.length > maxFiles) {
      onError?.({ type: "max-files" });
      return;
    }
    if (maxSizeBytes !== undefined) {
      const oversized = files.some((file) => file.size > maxSizeBytes);
      if (oversized) {
        onError?.({ type: "max-size" });
        return;
      }
    }
    onFilesSelected?.(files);
  }

  function handleDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setDragOver(false);
    processFiles(event.dataTransfer.files);
  }

  return (
    <div className={styles.root}>
      <label
        htmlFor={inputId}
        className={[styles.dropzone, dragOver ? styles.dragOver : ""].filter(Boolean).join(" ")}
        onDragOver={(event) => {
          event.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        {label}
      </label>
      <input
        ref={(node) => {
          inputRef.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) (ref as { current: HTMLInputElement | null }).current = node;
        }}
        id={inputId}
        type="file"
        accept={accept}
        multiple={multiple}
        className={[styles.input, className].filter(Boolean).join(" ")}
        onChange={(event) => processFiles(event.currentTarget.files)}
        {...rest}
      />
    </div>
  );
});

FileUpload.displayName = "FileUpload";
