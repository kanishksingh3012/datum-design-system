import { forwardRef, type ButtonHTMLAttributes, type HTMLAttributes } from "react";
import styles from "./Suggestion.module.css";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface SuggestionOwnProps {}

export type SuggestionProps = SuggestionOwnProps & Omit<HTMLAttributes<HTMLUListElement>, "role">;

/** Prompt suggestion chips that seed the next composer message - a real list of real buttons. */
export const Suggestion = forwardRef<HTMLUListElement, SuggestionProps>(function Suggestion(
  { className, ...rest },
  ref
) {
  return <ul ref={ref} role="list" className={[styles.root, className].filter(Boolean).join(" ")} {...rest} />;
});

Suggestion.displayName = "Suggestion";

export type SuggestionItemProps = ButtonHTMLAttributes<HTMLButtonElement>;

export const SuggestionItem = forwardRef<HTMLButtonElement, SuggestionItemProps>(function SuggestionItem(
  { className, type = "button", ...rest },
  ref
) {
  return (
    <li>
      <button ref={ref} type={type} className={[styles.item, className].filter(Boolean).join(" ")} {...rest} />
    </li>
  );
});

SuggestionItem.displayName = "SuggestionItem";
