import { forwardRef, type HTMLAttributes } from "react";
import styles from "./Footer.module.css";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface FooterOwnProps {}

export type FooterProps = FooterOwnProps & HTMLAttributes<HTMLElement>;

export const Footer = forwardRef<HTMLElement, FooterProps>(function Footer({ className, ...rest }, ref) {
  return <footer ref={ref} className={[styles.root, className].filter(Boolean).join(" ")} {...rest} />;
});

Footer.displayName = "Footer";
