import { forwardRef, type AnchorHTMLAttributes, type HTMLAttributes } from "react";
import styles from "./Nav.module.css";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface NavOwnProps {}

export type NavProps = NavOwnProps & HTMLAttributes<HTMLElement>;

export const Nav = forwardRef<HTMLElement, NavProps>(function Nav({ className, children, ...rest }, ref) {
  return (
    <nav ref={ref} className={[styles.root, className].filter(Boolean).join(" ")} {...rest}>
      <ul className={styles.list}>{children}</ul>
    </nav>
  );
});

Nav.displayName = "Nav";

export interface NavLinkOwnProps {
  /** Marks this as the current page - sets aria-current="page", not just a visual style. */
  active?: boolean;
}

export type NavLinkProps = NavLinkOwnProps & AnchorHTMLAttributes<HTMLAnchorElement>;

export const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(function NavLink(
  { active, className, ...rest },
  ref
) {
  return (
    <li className={styles.item}>
      <a
        ref={ref}
        aria-current={active ? "page" : undefined}
        data-active={active || undefined}
        className={[styles.link, className].filter(Boolean).join(" ")}
        {...rest}
      />
    </li>
  );
});

NavLink.displayName = "NavLink";
