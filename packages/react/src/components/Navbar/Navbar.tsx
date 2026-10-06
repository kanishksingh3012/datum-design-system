import { forwardRef, useEffect, useRef, useState, type HTMLAttributes, type ReactNode, type Ref } from "react";
import { mergeRefs } from "react-aria";
import { useControlledState } from "react-stately/useControlledState";
import { Accordion, AccordionItem } from "../Accordion/Accordion";
import { Badge } from "../Badge/Badge";
import { Button } from "../Button/Button";
import { Container, type ContainerSize } from "../Container/Container";
import { DialogBody, DialogHeader } from "../Dialog/Dialog";
import { DropdownMenu, type DropdownMenuItem } from "../DropdownMenu/DropdownMenu";
import { Sheet } from "../Sheet/Sheet";
import styles from "./Navbar.module.css";

export type NavbarLayout = "standard" | "start" | "centered";
export type NavbarAppearance = "solid" | "blur" | "transparent" | "inverse";
export type NavbarPosition = "static" | "sticky" | "fixed";
export type NavbarSize = "compact" | "default";
export type NavbarBreakpoint = "sm" | "md" | "lg";

/** A link inside a dropdown or mega menu. */
export interface NavbarMenuLink {
  label: string;
  href: string;
  /** A line under the label — used in mega menus. */
  description?: string;
  icon?: ReactNode;
}

/** A column of a mega menu. */
export interface NavbarMenuColumn {
  title: string;
  items: NavbarMenuLink[];
}

export interface NavbarLink {
  label: string;
  /** Where the link goes. Not needed when it opens a menu. */
  href?: string;
  icon?: ReactNode;
  /** A count or tag after the label; a string or number becomes a small Badge. */
  badge?: ReactNode;
  /** Marks the current page. Worked out from `activeHref` when unset. */
  active?: boolean;
  /** Turns the link into a dropdown: a simple menu of links. */
  items?: NavbarMenuLink[];
  /** Turns the link into a mega menu: a column per group, with descriptions. */
  columns?: NavbarMenuColumn[];
}

export interface NavbarOwnProps {
  /** standard: logo left, links center, actions right · start: logo and links left · centered: logo in the middle. @default "standard" */
  layout?: NavbarLayout;
  /** transparent sits over a hero and turns solid on scroll · inverse is an ink band. @default "solid" */
  appearance?: NavbarAppearance;
  /** @default "sticky" */
  position?: NavbarPosition;
  /** Slides away scrolling down, returns scrolling up (or as soon as it takes focus). @default false */
  hideOnScroll?: boolean;
  /** 56 / 64px tall. @default "default" */
  size?: NavbarSize;
  /** A hairline under the bar. @default true */
  bordered?: boolean;
  links?: NavbarLink[];
  /** The current URL: the link (or menu) holding it is marked with aria-current="page". */
  activeHref?: string;
  logo?: ReactNode;
  search?: ReactNode;
  actions?: ReactNode;
  /** A thin bar above the navbar. */
  announcement?: ReactNode;
  /** When the bar is narrower than this (640 / 768 / 1024px), links move into a Sheet with accordion groups. It measures the bar, not the screen. @default "md" */
  mobileBreakpoint?: NavbarBreakpoint;
  /** Keeps the bar aligned with page content: a Container size. @default "xl" */
  maxWidth?: ContainerSize;
  /** The mobile menu's open state (controlled). */
  open?: boolean;
  /** Whether the mobile menu starts open (uncontrolled). */
  defaultOpen?: boolean;
  /** Called whenever the mobile menu opens or closes. */
  onOpenChange?: (open: boolean) => void;
}

export type NavbarProps = NavbarOwnProps & HTMLAttributes<HTMLElement>;

const BREAKPOINTS: Record<NavbarBreakpoint, number> = { sm: 640, md: 768, lg: 1024 };

const Chevron = (
  <svg viewBox="0 0 16 16" focusable="false" className={styles.chevron} aria-hidden="true">
    <path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const MenuIcon = (
  <svg viewBox="0 0 24 24" focusable="false">
    <path d="M4 7h16M4 12h16M4 17h16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const subLinks = (link: NavbarLink) => [...(link.items ?? []), ...(link.columns ?? []).flatMap((c) => c.items)];
const isGroup = (link: NavbarLink) => Boolean(link.items?.length || link.columns?.length);
const isActive = (link: NavbarLink, activeHref?: string) =>
  link.active ?? (activeHref !== undefined && (link.href === activeHref || subLinks(link).some((l) => l.href === activeHref)));
const toMenuItem = (l: NavbarMenuLink) => ({ label: l.label, href: l.href, description: l.description, icon: l.icon });

function LinkContent({ link }: { link: NavbarLink }) {
  return (
    <>
      {link.icon ? (
        <span className={styles.icon} aria-hidden="true">
          {link.icon}
        </span>
      ) : null}
      {link.label}
      {link.badge === undefined ? null : typeof link.badge === "string" || typeof link.badge === "number" ? (
        <Badge size="sm">{link.badge}</Badge>
      ) : (
        link.badge
      )}
    </>
  );
}

/**
 * One site header for every website layout. Built from Container, Button,
 * DropdownMenu and Sheet, so it inherits their keyboard and focus behavior:
 * menus are React Aria menus, and the mobile menu is a modal Sheet.
 */
export const Navbar = forwardRef<HTMLElement, NavbarProps>(function Navbar(
  {
    layout = "standard",
    appearance = "solid",
    position = "sticky",
    hideOnScroll = false,
    size = "default",
    bordered = true,
    links = [],
    activeHref,
    logo,
    search,
    actions,
    announcement,
    mobileBreakpoint = "md",
    maxWidth = "xl",
    open,
    defaultOpen,
    onOpenChange,
    className,
    onFocus,
    ...rest
  },
  ref
) {
  const rootRef = useRef<HTMLElement>(null);
  const [menuOpen, setMenuOpen] = useControlledState(open, defaultOpen ?? false, onOpenChange);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const tracksScroll = appearance === "transparent" || (hideOnScroll && position !== "static");

  useEffect(() => {
    if (!tracksScroll) return;
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 0);
      if (hideOnScroll) setHidden(y > last && y > (rootRef.current?.offsetHeight ?? 0));
      last = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [tracksScroll, hideOnScroll]);

  // the mobile menu has no place on a wide bar: close it when the bar grows past the breakpoint
  useEffect(() => {
    const root = rootRef.current;
    if (!menuOpen || !root || typeof ResizeObserver !== "function") return;
    const observer = new ResizeObserver(() => {
      if (root.offsetWidth >= BREAKPOINTS[mobileBreakpoint]) setMenuOpen(false);
    });
    observer.observe(root);
    return () => observer.disconnect();
  }, [menuOpen, mobileBreakpoint, setMenuOpen]);

  return (
    <header
      ref={mergeRefs(ref, rootRef) as Ref<HTMLElement>}
      className={[styles.root, className].filter(Boolean).join(" ")}
      data-layout={layout}
      data-appearance={appearance}
      data-position={position}
      data-size={size}
      data-bordered={bordered || undefined}
      data-breakpoint={mobileBreakpoint}
      data-scrolled={scrolled || undefined}
      data-hidden={hidden || undefined}
      // a keyboard user tabbing into a hidden bar brings it back
      onFocus={(event) => {
        setHidden(false);
        onFocus?.(event);
      }}
      {...rest}
    >
      {announcement ? <div className={styles.announcement}>{announcement}</div> : null}
      <div className={styles.band}>
        <Container size={maxWidth} className={styles.bar}>
          {logo ? <div className={styles.logo}>{logo}</div> : null}
          {links.length ? (
            <nav aria-label="Main" className={styles.nav}>
              <ul className={styles.links}>
                {links.map((link) => {
                  const active = isActive(link, activeHref);
                  return (
                    <li key={link.label}>
                      {isGroup(link) ? (
                        <DropdownMenu
                          columns={link.columns?.length}
                          items={
                            link.columns?.length
                              ? link.columns.map<DropdownMenuItem>((c) => ({ type: "section", label: c.title, items: c.items.map(toMenuItem) }))
                              : link.items!.map(toMenuItem)
                          }
                          trigger={
                            <button type="button" className={styles.link} data-active={active || undefined}>
                              <LinkContent link={link} />
                              {Chevron}
                            </button>
                          }
                        />
                      ) : (
                        <a
                          href={link.href}
                          className={styles.link}
                          data-active={active || undefined}
                          aria-current={active ? "page" : undefined}
                        >
                          <LinkContent link={link} />
                        </a>
                      )}
                    </li>
                  );
                })}
              </ul>
            </nav>
          ) : null}
          <div className={styles.end}>
            {search}
            {actions}
            {links.length ? (
              <span className={styles.menu}>
                <Sheet
                  side="right"
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
                      <DialogHeader>Menu</DialogHeader>
                      <DialogBody>
                        <MobileLinks links={links} activeHref={activeHref} onNavigate={close} />
                      </DialogBody>
                    </>
                  )}
                </Sheet>
              </span>
            ) : null}
          </div>
        </Container>
      </div>
    </header>
  );
});

Navbar.displayName = "Navbar";

function MobileLinks({ links, activeHref, onNavigate }: { links: NavbarLink[]; activeHref?: string; onNavigate: () => void }) {
  const row = (l: NavbarMenuLink | NavbarLink, active: boolean) => (
    <a
      href={l.href}
      className={styles.mobileLink}
      data-active={active || undefined}
      aria-current={active ? "page" : undefined}
      onClick={onNavigate}
    >
      <LinkContent link={l} />
    </a>
  );
  const list = (items: NavbarMenuLink[]) => (
    <ul className={styles.mobileList}>
      {items.map((l) => (
        <li key={l.href + l.label}>{row(l, l.href === activeHref)}</li>
      ))}
    </ul>
  );
  const groups = links.filter(isGroup);
  const open = groups.filter((link) => isActive(link, activeHref)).map((link) => link.label);
  return (
    <nav aria-label="Main" className={styles.mobileNav}>
      <ul className={styles.mobileList}>
        {links.map((link) => (
          <li key={link.label}>
            {isGroup(link) ? (
              <Accordion appearance="plain" defaultValue={open} headingLevel={2}>
                <AccordionItem value={link.label} title={<LinkContent link={{ ...link, href: undefined }} />}>
                  {link.columns?.length
                    ? link.columns.map((c) => (
                        <div key={c.title} className={styles.mobileGroup}>
                          <p className={styles.mobileGroupTitle}>{c.title}</p>
                          {list(c.items)}
                        </div>
                      ))
                    : list(link.items!)}
                </AccordionItem>
              </Accordion>
            ) : (
              row(link, isActive(link, activeHref))
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
