import { forwardRef, useLayoutEffect, useRef, useState, type HTMLAttributes, type KeyboardEvent } from "react";
import { mergeProps, useButton, useFocusRing, useObjectRef, useTag, useTagGroup, type AriaTagProps } from "react-aria";
import { Item, useListState, type ListState } from "react-stately";
import { useControllableState } from "../../lib/useControllableState";
import { Badge } from "../Badge/Badge";
import { FieldFrame, type FieldProps } from "../Field/Field";
import parts from "../../lib/fieldParts.module.css";
import styles from "./TagInput.module.css";

export type TagInputSize = "sm" | "md" | "lg";

export interface TagInputOwnProps extends FieldProps {
  /** 32 / 40 / 48px tall on one line, +4px on touch screens; grows as tags wrap. @default "md" */
  size?: TagInputSize;
  /** The tags (controlled). */
  value?: string[];
  /** @default [] */
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  /** Shown in the input while it's empty. */
  placeholder?: string;
  /** At this many tags the input stops taking more, and a counter shows. */
  maxTags?: number;
  /** Form field name; each tag is submitted as a hidden input. */
  name?: string;
}

/** `className` and other props go on the field's root; `ref` goes on the input. */
export type TagInputProps = TagInputOwnProps &
  Omit<HTMLAttributes<HTMLDivElement>, "children" | "defaultValue" | "onChange" | "placeholder">;

/**
 * Tags in a field box with a text input after them. Enter or a comma adds
 * the typed text as a tag; Backspace in an empty input removes the last one.
 * The tags are a React Aria tag group: arrows move between them, and
 * Backspace or Delete removes the focused tag.
 */
export const TagInput = forwardRef<HTMLInputElement, TagInputProps>(function TagInput(
  {
    label,
    helpText,
    errorText,
    required = false,
    disabled = false,
    readOnly = false,
    size = "md",
    value: valueProp,
    defaultValue = [],
    onValueChange,
    placeholder,
    maxTags,
    name,
    className,
    ...rest
  },
  forwardedRef
) {
  const inputRef = useObjectRef(forwardedRef);
  const boxRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [tags, setTags] = useControllableState<string[]>(valueProp, defaultValue, onValueChange);
  const [draft, setDraft] = useState("");
  const [multiline, setMultiline] = useState(false);
  const editable = !disabled && !readOnly;
  const full = maxTags != null && tags.length >= maxTags;

  const state = useListState({ children: tags.map((t) => <Item key={t}>{t}</Item>) });
  const remove = (keys: Set<unknown>) => {
    setTags(tags.filter((t) => !keys.has(t)));
    inputRef.current?.focus();
  };
  const { gridProps, labelProps, descriptionProps, errorMessageProps } = useTagGroup(
    {
      label,
      description: errorText ? undefined : helpText,
      errorMessage: errorText,
      onRemove: editable ? remove : undefined,
    },
    state,
    gridRef
  );

  const add = () => {
    const text = draft.trim();
    if (!text || full) return;
    if (!tags.some((t) => t.toLowerCase() === text.toLowerCase())) setTags([...tags, text]);
    setDraft("");
  };
  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    const atStart = e.currentTarget.selectionStart === 0 && e.currentTarget.selectionEnd === 0;
    if (e.key === "Enter" || e.key === ",") {
      if (draft.trim()) e.preventDefault();
      add();
    } else if (e.key === "Backspace" && atStart && tags.length) {
      e.preventDefault();
      setTags(tags.slice(0, -1));
    } else if (e.key === "ArrowLeft" && atStart && tags.length) {
      e.preventDefault();
      gridRef.current?.querySelector<HTMLElement>('[role="row"]:last-child')?.focus();
    }
  };

  // one line is a pill; once tags wrap, the box is tall and takes the card radius
  useLayoutEffect(() => {
    const box = boxRef.current;
    if (!box || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => {
      const line = parseFloat(getComputedStyle(box).minHeight) || 0;
      setMultiline(box.offsetHeight > line + 1);
    });
    ro.observe(box);
    return () => ro.disconnect();
  }, []);

  const describedBy = [errorText ? errorMessageProps.id : helpText ? descriptionProps.id : undefined].filter(Boolean).join(" ") || undefined;

  return (
    <FieldFrame
      label={label}
      labelAs="span"
      labelProps={labelProps}
      helpText={helpText}
      errorText={errorText}
      required={required}
      disabled={disabled}
      readOnly={readOnly}
      descriptionProps={descriptionProps}
      errorMessageProps={errorMessageProps}
      aside={
        maxTags != null ? (
          <span className={styles.counter} aria-live="polite">
            {tags.length} / {maxTags}
          </span>
        ) : undefined
      }
      rootProps={rest}
      className={className}
    >
      <div
        ref={boxRef}
        className={styles.box}
        data-control=""
        data-size={size}
        data-disabled={disabled || undefined}
        data-readonly={readOnly || undefined}
        data-invalid={errorText ? true : undefined}
        data-multiline={multiline || undefined}
        onClick={(e) => {
          if (e.target === e.currentTarget) inputRef.current?.focus();
        }}
      >
        {tags.length > 0 && (
          <div {...gridProps} ref={gridRef} className={styles.tags}>
            {[...state.collection].map((item) => (
              <Tag key={item.key} item={item} state={state} size={size} />
            ))}
          </div>
        )}
        <input
          ref={inputRef}
          className={parts.input}
          value={draft}
          placeholder={full ? undefined : placeholder}
          aria-labelledby={labelProps.id}
          aria-describedby={describedBy}
          aria-invalid={errorText ? true : undefined}
          required={required && tags.length === 0}
          disabled={disabled}
          readOnly={readOnly || full}
          onChange={(e) => {
            const next = e.target.value;
            // a pasted "a, b, c" becomes three tags
            if (next.includes(",")) {
              const pieces = next.split(",").map((p) => p.trim());
              const last = pieces.pop() ?? "";
              const added = pieces.filter(Boolean).filter((p, i, all) => all.findIndex((q) => q.toLowerCase() === p.toLowerCase()) === i);
              const fresh = added.filter((p) => !tags.some((t) => t.toLowerCase() === p.toLowerCase()));
              setTags([...tags, ...fresh].slice(0, maxTags ?? Infinity));
              setDraft(last);
            } else setDraft(next);
          }}
          onKeyDown={onKeyDown}
          onBlur={add}
        />
      </div>
      {name && tags.map((t) => <input key={t} type="hidden" name={name} value={t} />)}
    </FieldFrame>
  );
});

TagInput.displayName = "TagInput";

function Tag({ item, state, size }: AriaTagProps<unknown> & { state: ListState<unknown>; size: TagInputSize }) {
  const ref = useRef<HTMLSpanElement>(null);
  const removeRef = useRef<HTMLButtonElement>(null);
  const { rowProps, gridCellProps, removeButtonProps, allowsRemoving } = useTag({ item }, state, ref);
  const { focusProps, isFocusVisible } = useFocusRing({ within: false });
  const { buttonProps } = useButton(removeButtonProps, removeRef);
  return (
    <Badge
      {...mergeProps(rowProps, focusProps)}
      ref={ref}
      className={styles.tag}
      size={size === "lg" ? "md" : "sm"}
      data-focus-visible={isFocusVisible || undefined}
    >
      <span {...gridCellProps} className={styles.tagCell}>
        {item.rendered}
        {allowsRemoving && (
          <button
            // focused directly (a click, script), it becomes the grid's focused item first — otherwise the grid pulls focus back to the row
            {...mergeProps(buttonProps, { onFocus: () => state.selectionManager.setFocusedKey(item.key) })}
            ref={removeRef} className={styles.remove}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" aria-hidden="true">
              <path d="M7 7l10 10M17 7L7 17" />
            </svg>
          </button>
        )}
      </span>
    </Badge>
  );
}
