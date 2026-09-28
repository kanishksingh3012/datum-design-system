import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { Container, type ContainerSize } from "../Container/Container";
import styles from "./Footer.module.css";

export type FooterTone = "default" | "muted";

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterColumn {
  /** The column's heading, which also names its list. */
  title: string;
  links: FooterLink[];
}

export interface FooterOwnProps {
  /** Groups of links, one column each. They wrap onto more rows on narrow screens. */
  columns?: FooterColumn[];
  /** The row under the columns: legal links, copyright, social. */
  bottom?: ReactNode;
  /** `muted` sits on `bg.surface`; `default` on the page with a hairline above. @default "muted" */
  tone?: FooterTone;
  /** Keeps the footer aligned with page content: a Container size. Match the Navbar's `maxWidth`. @default "xl" */
  maxWidth?: ContainerSize;
  /** The lead column before the links, e.g. a logo and a line about the site. */
  children?: ReactNode;
}

export type FooterProps = FooterOwnProps & HTMLAttributes<HTMLElement>;

export const Footer = forwardRef<HTMLElement, FooterProps>(function Footer(
  { columns, bottom, tone = "muted", maxWidth = "xl", className, children, ...rest },
  ref
) {
  return (
    <footer ref={ref} className={[styles.root, className].filter(Boolean).join(" ")} data-tone={tone} {...rest}>
      <Container size={maxWidth} className={styles.inner}>
        {children || columns?.length ? (
          <div className={styles.top}>
            {children ? <div className={styles.lead}>{children}</div> : null}
            {columns?.length ? (
              <nav aria-label="Footer" className={styles.columns}>
                {columns.map((column) => (
                  <div key={column.title} className={styles.column}>
                    <h2 className={styles.title}>{column.title}</h2>
                    <ul className={styles.links} aria-label={column.title}>
                      {column.links.map((link) => (
                        <li key={link.href + link.label}>
                          <a href={link.href} className={styles.link}>
                            {link.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </nav>
            ) : null}
          </div>
        ) : null}
        {bottom ? <div className={styles.bottom}>{bottom}</div> : null}
      </Container>
    </footer>
  );
});

Footer.displayName = "Footer";
