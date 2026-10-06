import { forwardRef, useEffect, type HTMLAttributes, type ReactNode } from "react";
import { useControlledState } from "react-stately/useControlledState";
import { Badge } from "../Badge/Badge";
import { Button } from "../Button/Button";
import { DialogBody, DialogHeader } from "../Dialog/Dialog";
import { Sheet } from "../Sheet/Sheet";
import styles from "./Sidebar.module.css";

export type SidebarSize = "sm" | "md";
export type SidebarBreakpoint = "sm" | "md" | "lg";

export interface SidebarLink {
  label: string;
  href: string;
  icon?: ReactNode;
  /** A short count or tag after the label. */
  badge?: ReactNode;
  /** Marks it current without `activeHref`. */
  active?: boolean;
}

export interface SidebarSection {
  /** A small heading over the group; leave it off for the first, untitled group. */
  title?: string;
  links: SidebarLink[];
}

export interface SidebarOwnProps {
  sections: SidebarSection[];
  /** The current URL: the link holding it is marked with aria-current="page". */
  activeHref?: string;
  /** Names the navigation landmark and the mobile menu. @default "Sidebar" */
  label?: string;
  /** Top slot: a logo or workspace switcher. It also stays in the bar on small screens. */
  header?: ReactNode;
  /** Bottom slot: an account row, settings. */
  footer?: ReactNode;
  /** 240 / 288px wide. @default "md" */
  size?: SidebarSize;
  /** Below it (640 / 768 / 1024px) the sidebar folds into a bar with a menu button that opens a Sheet. @default "md" */
  mobileBreakpoint?: SidebarBreakpoint;
  /** The mobile menu's open state (controlled). */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

/** `ref`, `className` and every other prop go on the root. */
export type SidebarProps = SidebarOwnProps & HTMLAttributes<HTMLDivElement>;

const BREAKPOINTS: Record<SidebarBreakpoint, number> = { sm: 640, md: 768, lg: 1024 };
const MenuIcon = (
  <svg viewBox="0 0 24 24" focusable="false">
    <path d="M4 7h16M4 12h16M4 17h16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

/**
 * App navigation down the side of the page: grouped links with the current
 * page marked, a header and a footer. Below `mobileBreakpoint` it folds into a
 * bar holding the header and a menu button, which opens the same links in a
 * modal Sheet from the left — the Navbar's pattern.
 */
export const Sidebar = forwardRef<HTMLDivElement, SidebarProps>(function Sidebar(
  {
    sections,
    activeHref,
    label = "Sidebar",
    header,
    footer,
    size = "md",
    mobileBreakpoint = "md",
    open,
    defaultOpen,
    onOpenChange,
    className,
    ...rest
  },
  ref
) {
  const [menuOpen, setMenuOpen] = useControlledState(open, defaultOpen ?? false, onOpenChange);

  // the mobile menu has no place above the breakpoint: close it when the window grows past it
  useEffect(() => {
    if (!menuOpen || typeof matchMedia !== "function") return;
    const query = matchMedia(`(min-width: ${BREAKPOINTS[mobileBreakpoint]}px)`);
    const onChange = () => query.matches && setMenuOpen(false);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, [menuOpen, mobileBreakpoint, setMenuOpen]);

  return (
    <div
      ref={ref}
      className={[styles.root, className].filter(Boolean).join(" ")}
      data-size={size}
      data-breakpoint={mobileBreakpoint}
      {...rest}
    >
      {header ? <div className={styles.header}>{header}</div> : null}
      <div className={styles.panel}>
        <Nav sections={sections} activeHref={activeHref} label={label} />
      </div>
      {footer ? <div className={styles.footer}>{footer}</div> : null}
      <span className={styles.menu}>
        <Sheet
          side="left"
          size="sm"
          open={menuOpen}
          onOpenChange={setMenuOpen}
          trigger={
            <Button intent="neutral" appearance="ghost" iconOnly label="Menu">
              {MenuIcon}
            </Button>
          }
        >
          {(close) => (
            <>
              <DialogHeader>{label}</DialogHeader>
              <DialogBody>
                <Nav sections={sections} activeHref={activeHref} label={label} onNavigate={close} />
                {footer ? <div className={styles.sheetFooter}>{footer}</div> : null}
              </DialogBody>
            </>
          )}
        </Sheet>
      </span>
    </div>
  );
});

Sidebar.displayName = "Sidebar";

function Nav({ sections, activeHref, label, onNavigate }: { sections: SidebarSection[]; activeHref?: string; label: string; onNavigate?: () => void }) {
  return (
    <nav aria-label={label} className={styles.nav}>
      {sections.map((section, i) => (
        <div key={section.title ?? i} className={styles.section}>
          {section.title ? <p className={styles.title}>{section.title}</p> : null}
          <ul className={styles.list}>
            {section.links.map((link) => {
              const active = link.active ?? (activeHref !== undefined && link.href === activeHref);
              return (
                <li key={link.href + link.label}>
                  <a
                    href={link.href}
                    className={styles.link}
                    data-active={active || undefined}
                    aria-current={active ? "page" : undefined}
                    onClick={onNavigate}
                  >
                    {link.icon ? <span className={styles.icon} aria-hidden="true">{link.icon}</span> : null}
                    <span className={styles.label}>{link.label}</span>
                    {link.badge !== undefined ? (
                      <Badge size="sm" intent="neutral" appearance={active ? "solid" : "soft"} className={styles.badge}>
                        {link.badge}
                      </Badge>
                    ) : null}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
