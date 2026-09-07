import { createContext, useContext, useEffect, useId, useRef, useState, type ReactNode, type RefObject } from "react";
import styles from "./NavigationMenu.module.css";

export interface NavigationMenuOwnProps {
  children: ReactNode;
  /** Required - a page can have more than one navigation menu, so each needs its own accessible name. */
  label: string;
}

/**
 * A real <nav> landmark wrapping a real <ul> - deliberately not
 * role="menu"/"menubar". The APG itself warns against that role for site
 * navigation: it pulls in composite-widget focus management and
 * first-character navigation that a nav bar doesn't need. Confirmed
 * against Kernel UI's own NavigationMenu source (not just its docs
 * summary) before building: same plain nav+ul base, same
 * per-item-context compound API - Kernel wires its mega-menu panel
 * through the native popover attribute, which Datum's DropdownMenu
 * deliberately doesn't rely on (untyped in this @types/react version,
 * unimplemented in jsdom), so this reuses that same controlled-state
 * open/close mechanism instead for consistency with the rest of Datum.
 */
export function NavigationMenu({ children, label }: NavigationMenuOwnProps) {
  return (
    <nav aria-label={label} className={styles.root}>
      <ul className={styles.list}>{children}</ul>
    </nav>
  );
}

interface NavigationMenuItemContextValue {
  contentId: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerRef: RefObject<HTMLButtonElement>;
}

const NavigationMenuItemContext = createContext<NavigationMenuItemContextValue | null>(null);

export interface NavigationMenuItemOwnProps {
  children: ReactNode;
}

/** Wraps one top-level entry, providing the shared open-state and ids so a sibling Trigger/Content pair can coordinate. */
export function NavigationMenuItem({ children }: NavigationMenuItemOwnProps) {
  const contentId = useId();
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const itemRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    if (!open) return;
    function handlePointerDown(event: MouseEvent) {
      if (!itemRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    }
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <NavigationMenuItemContext.Provider value={{ contentId, open, setOpen, triggerRef }}>
      <li ref={itemRef} className={styles.item}>
        {children}
      </li>
    </NavigationMenuItemContext.Provider>
  );
}

export interface NavigationMenuLinkOwnProps {
  href: string;
  children: ReactNode;
  /** Marks this as the current page - sets aria-current="page", same convention as Nav/Breadcrumbs. */
  active?: boolean;
}

/** A plain link, for a top-level entry with no submenu - real destinations stay real links, per the APG's own Disclosure Navigation guidance. */
export function NavigationMenuLink({ href, children, active }: NavigationMenuLinkOwnProps) {
  return (
    <a href={href} aria-current={active ? "page" : undefined} className={styles.link}>
      {children}
    </a>
  );
}

export interface NavigationMenuTriggerOwnProps {
  children: ReactNode;
}

/** The clickable label for an item with a submenu - click-based, not hover-only, so it behaves the same on touch devices. */
export function NavigationMenuTrigger({ children }: NavigationMenuTriggerOwnProps) {
  const context = useContext(NavigationMenuItemContext);
  if (!context) throw new Error("NavigationMenuTrigger must be used inside a NavigationMenuItem");
  const { contentId, open, setOpen, triggerRef } = context;

  return (
    <button
      ref={triggerRef}
      type="button"
      aria-haspopup="true"
      aria-expanded={open}
      aria-controls={open ? contentId : undefined}
      className={styles.trigger}
      onClick={() => setOpen(!open)}
    >
      {children}
      <svg className={styles.chevron} viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

export interface NavigationMenuContentOwnProps {
  children: ReactNode;
}

/** The mega-menu panel for an item - only rendered while its NavigationMenuItem is open. */
export function NavigationMenuContent({ children }: NavigationMenuContentOwnProps) {
  const context = useContext(NavigationMenuItemContext);
  if (!context) throw new Error("NavigationMenuContent must be used inside a NavigationMenuItem");
  const { contentId, open } = context;

  if (!open) return null;

  return (
    <div id={contentId} className={styles.content}>
      {children}
    </div>
  );
}
