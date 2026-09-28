import { forwardRef, type HTMLAttributes } from "react";
import { Button, type ButtonProps } from "../Button/Button";
import styles from "./Suggestion.module.css";

export interface SuggestionOwnProps {
  /** Names the list for assistive tech, e.g. "Suggested prompts". */
  label?: string;
}

export type SuggestionProps = SuggestionOwnProps & Omit<HTMLAttributes<HTMLUListElement>, "role">;

/** Prompt chips that seed the next message: a real list of neutral outline Buttons. */
export const Suggestion = forwardRef<HTMLUListElement, SuggestionProps>(function Suggestion({ label, className, ...rest }, ref) {
  return <ul ref={ref} role="list" aria-label={label} className={[styles.root, className].filter(Boolean).join(" ")} {...rest} />;
});

Suggestion.displayName = "Suggestion";

export type SuggestionItemProps = ButtonProps;

/** One chip. Any Button prop works (`prefix` for an icon, `size`). */
export const SuggestionItem = forwardRef<HTMLButtonElement, SuggestionItemProps>(function SuggestionItem(
  { intent = "neutral", appearance = "outline", size = "sm", ...rest },
  ref
) {
  return (
    <li className={styles.item}>
      <Button ref={ref} type="button" intent={intent} appearance={appearance} size={size} {...rest} />
    </li>
  );
});

SuggestionItem.displayName = "SuggestionItem";
