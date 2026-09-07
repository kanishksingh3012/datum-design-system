import { forwardRef, type HTMLAttributes } from "react";
import styles from "./Header.module.css";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface HeaderOwnProps {}

export type HeaderProps = HeaderOwnProps & HTMLAttributes<HTMLElement>;

export const Header = forwardRef<HTMLElement, HeaderProps>(function Header({ className, ...rest }, ref) {
  return <header ref={ref} className={[styles.root, className].filter(Boolean).join(" ")} {...rest} />;
});

Header.displayName = "Header";
