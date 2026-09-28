import { useEffect, useId, useMemo, useRef, type KeyboardEvent, type ReactElement, type ReactNode } from "react";
import { mergeProps, useFilter, useListBox, useListBoxSection, useOption, type Key } from "react-aria";
import { Item, Section, useListState, type ListState, type Node } from "react-stately";
import { SearchIcon } from "../../lib/formIcons";
import { useControllableState } from "../../lib/useControllableState";
import { ModalFrame, ModalPanel } from "../Dialog/Dialog";
import styles from "./CommandPalette.module.css";

export interface CommandPaletteItem {
  id: string;
  label: string;
  /** A second line under the label. */
  description?: string;
  /** Leading icon, 16px, in the text color. */
  icon?: ReactNode;
  /** Shown at the end of the row, e.g. "⌘N". Display only. */
  shortcut?: string;
  /** Items with the same group are listed together under that heading. */
  group?: string;
  /** Extra words that match the search, e.g. synonyms. */
  keywords?: string[];
  disabled?: boolean;
  /** Runs when the item is chosen; the palette then closes. */
  onSelect?: () => void;
}

export interface CommandPaletteOwnProps {
  items: CommandPaletteItem[];
  /** Also called with the chosen item's id. */
  onAction?: (id: string) => void;
  /** Whether the palette is open (controlled). */
  open?: boolean;
  /** @default false */
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** The search text (controlled). It clears when the palette closes. */
  search?: string;
  /** @default "" */
  defaultSearch?: string;
  onSearchChange?: (search: string) => void;
  /** ⌘K (macOS) or Ctrl+K anywhere on the page toggles it. @default true */
  hotkey?: boolean;
  /** Element that opens it, usually a Button. Optional. */
  trigger?: ReactElement;
  /** The dialog's accessible name. @default "Command palette" */
  label?: string;
  /** The search input's accessible name and placeholder. @default "Search commands" */
  placeholder?: string;
  /** Shown when nothing matches. @default "No results" */
  emptyState?: ReactNode;
}

export type CommandPaletteProps = CommandPaletteOwnProps;

/**
 * A search dialog over the page for jumping to commands. The input keeps
 * focus while arrows move through the list (aria-activedescendant); Enter
 * runs the highlighted command, Escape closes, ⌘K / Ctrl+K toggles.
 */
export function CommandPalette({
  items,
  onAction,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  search: searchProp,
  defaultSearch = "",
  onSearchChange,
  hotkey = true,
  trigger,
  label = "Command palette",
  placeholder = "Search commands",
  emptyState = "No results",
}: CommandPaletteProps) {
  const [open, setOpenState] = useControllableState(openProp, defaultOpen, onOpenChange);
  const [search, setSearch] = useControllableState(searchProp, defaultSearch, onSearchChange);
  const setOpen = (next: boolean) => {
    setOpenState(next);
    if (!next) setSearch("");
  };
  const latest = useRef({ open, setOpen });
  latest.current = { open, setOpen };

  useEffect(() => {
    if (!hotkey) return;
    const onKey = (e: globalThis.KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && !e.altKey && !e.shiftKey && e.key.toLowerCase() === "k") {
        e.preventDefault();
        latest.current.setOpen(!latest.current.open);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [hotkey]);

  return (
    <ModalFrame open={open} onOpenChange={setOpen} trigger={trigger} dismissible overlayClassName={styles.overlay}>
      <ModalPanel dismissible aria-label={label} className={styles.panel}>
        {(close) => <Palette items={items} query={search} setQuery={setSearch} placeholder={placeholder} emptyState={emptyState} onRun={(item) => { close(); item.onSelect?.(); onAction?.(item.id); }} />}
      </ModalPanel>
    </ModalFrame>
  );
}

interface PaletteProps {
  items: CommandPaletteItem[];
  query: string;
  setQuery: (query: string) => void;
  placeholder: string;
  emptyState: ReactNode;
  onRun: (item: CommandPaletteItem) => void;
}

function Palette({ items, query, setQuery, placeholder, emptyState, onRun }: PaletteProps) {
  const { contains } = useFilter({ sensitivity: "base" });
  const listRef = useRef<HTMLUListElement>(null);
  const listId = useId();
  const byId = useMemo(() => new Map(items.map((i) => [i.id, i])), [items]);
  const shown = useMemo(
    () => items.filter((i) => !query.trim() || [i.label, i.group ?? "", ...(i.keywords ?? [])].some((t) => contains(t, query.trim()))),
    [items, query, contains]
  );

  const groups = new Map<string, CommandPaletteItem[]>();
  for (const i of shown) groups.set(i.group ?? "", [...(groups.get(i.group ?? "") ?? []), i]);
  const grouped = groups.size > 1 || !groups.has("");
  const row = (i: CommandPaletteItem) => <Item key={i.id} textValue={i.label}>{i.label}</Item>;
  const children = grouped
    ? [...groups].map(([g, rows], n) => (
        <Section key={`s${n}`} title={g || undefined} aria-label={g || "Commands"}>
          {rows.map(row)}
        </Section>
      ))
    : shown.map(row);

  const state = useListState({ children, disabledKeys: items.filter((i) => i.disabled).map((i) => i.id), selectionMode: "none" });
  const run = (key: Key | null) => {
    const item = key != null ? byId.get(String(key)) : undefined;
    if (item && !item.disabled) onRun(item);
  };
  const { listBoxProps } = useListBox(
    { "aria-label": placeholder, id: listId, shouldUseVirtualFocus: true, shouldFocusOnHover: true, onAction: run },
    state,
    listRef
  );

  // the enabled items in list order; the first one is highlighted as the query changes
  const keys = [...state.collection.getKeys()].filter((k) => state.collection.getItem(k)?.type === "item" && !state.disabledKeys.has(k));
  const focusedKey = state.selectionManager.focusedKey;
  const keysSig = keys.join("\u0000");
  useEffect(() => {
    state.selectionManager.setFocused(true);
    state.selectionManager.setFocusedKey(keys[0] ?? null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keysSig]);
  const optionEl = (key: Key | null) => (key == null ? null : listRef.current?.querySelector<HTMLElement>(`[data-key="${CSS.escape(String(key))}"]`));

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (!keys.length) return;
      const i = focusedKey == null ? -1 : keys.indexOf(focusedKey);
      const next = keys[e.key === "ArrowDown" ? (i + 1) % keys.length : (i <= 0 ? keys.length : i) - 1];
      state.selectionManager.setFocusedKey(next);
      optionEl(next)?.scrollIntoView?.({ block: "nearest" });
    } else if (e.key === "Enter") {
      e.preventDefault();
      run(focusedKey);
    }
  };

  return (
    <>
      <div className={styles.search} data-control="">
        <SearchIcon className={styles.searchIcon} />
        <input
          className={styles.input}
          role="combobox"
          aria-label={placeholder}
          aria-expanded
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={optionEl(focusedKey)?.id}
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          placeholder={`${placeholder}…`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={onKeyDown}
          autoFocus
        />
        <kbd className={styles.kbd}>Esc</kbd>
      </div>
      <div className={styles.results}>
        <ul {...listBoxProps} ref={listRef} className={styles.list}>
          {[...state.collection].map((node, n) =>
            node.type === "section" ? (
              <PaletteSection key={node.key} section={node} state={state} byId={byId} divider={n > 0} />
            ) : (
              <PaletteOption key={node.key} node={node} state={state} item={byId.get(String(node.key))!} />
            )
          )}
        </ul>
        {shown.length === 0 && <p className={styles.empty}>{emptyState}</p>}
      </div>
    </>
  );
}

function PaletteSection({ section, state, byId, divider }: { section: Node<unknown>; state: ListState<unknown>; byId: Map<string, CommandPaletteItem>; divider: boolean }) {
  const { itemProps, headingProps, groupProps } = useListBoxSection({ heading: section.rendered, "aria-label": section["aria-label"] });
  return (
    <>
      {divider && <li role="presentation" className={styles.divider} />}
      <li {...itemProps}>
        {section.rendered && (
          <span {...headingProps} className={styles.heading}>
            {section.rendered}
          </span>
        )}
        <ul {...groupProps} className={styles.list}>
          {[...state.collection.getChildren!(section.key)].map((node) => (
            <PaletteOption key={node.key} node={node} state={state} item={byId.get(String(node.key))!} />
          ))}
        </ul>
      </li>
    </>
  );
}

function PaletteOption({ node, state, item }: { node: Node<unknown>; state: ListState<unknown>; item: CommandPaletteItem }) {
  const ref = useRef<HTMLLIElement>(null);
  const { optionProps, labelProps, descriptionProps, isFocused, isDisabled, isPressed } = useOption({ key: node.key }, state, ref);
  return (
    <li
      {...mergeProps(optionProps)}
      ref={ref}
      className={styles.item}
      data-focused={isFocused || undefined}
      data-pressed={isPressed || undefined}
      data-disabled={isDisabled || undefined}
      data-described={item.description ? "" : undefined}
    >
      {item.icon && <span className={styles.icon} aria-hidden="true">{item.icon}</span>}
      <span className={styles.text}>
        <span {...labelProps}>{node.rendered}</span>
        {item.description && <span {...descriptionProps} className={styles.description}>{item.description}</span>}
      </span>
      {item.shortcut && <kbd className={styles.kbd}>{item.shortcut}</kbd>}
    </li>
  );
}
