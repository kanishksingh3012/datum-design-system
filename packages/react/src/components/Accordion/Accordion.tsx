import { createContext, useContext, useId, useRef, type HTMLAttributes, type ReactNode } from "react";
import styles from "./Accordion.module.css";

const AccordionNameContext = createContext<string | undefined>(undefined);

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface AccordionOwnProps {}

export type AccordionProps = AccordionOwnProps & HTMLAttributes<HTMLDivElement>;

/**
 * Wraps AccordionItem children in a shared `name`, so opening one native
 * <details> closes the others - free exclusive-open behavior, no JS.
 */
export function Accordion({ children, className, ...rest }: AccordionProps) {
  const name = useId();
  return (
    <div className={[styles.root, className].filter(Boolean).join(" ")} {...rest}>
      <AccordionNameContext.Provider value={name}>{children}</AccordionNameContext.Provider>
    </div>
  );
}

export interface AccordionItemOwnProps {
  title: string;
  defaultOpen?: boolean;
  children?: ReactNode;
}

export type AccordionItemProps = AccordionItemOwnProps & Omit<HTMLAttributes<HTMLDetailsElement>, "title">;

export function AccordionItem({ title, defaultOpen = false, children, className, ...rest }: AccordionItemProps) {
  const name = useContext(AccordionNameContext);
  const detailsRef = useRef<HTMLDetailsElement>(null);

  return (
    <details
      ref={detailsRef}
      name={name}
      open={defaultOpen}
      className={[styles.item, className].filter(Boolean).join(" ")}
      {...rest}
    >
      <summary className={styles.summary}>{title}</summary>
      <div className={styles.content}>{children}</div>
    </details>
  );
}

AccordionItem.displayName = "AccordionItem";
