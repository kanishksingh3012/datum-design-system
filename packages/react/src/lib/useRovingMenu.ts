import { useRef, type KeyboardEvent } from "react";

/**
 * Shared keyboard behavior for the APG Menu pattern: arrow keys move real
 * focus between menuitems (roving tabindex, not aria-activedescendant -
 * a menu's items really are separately focusable), Home/End jump to the
 * ends, and first-character typeahead jumps to the next item starting
 * with that letter. Escape and closing are left to the caller, since
 * DropdownMenu and ContextMenu each restore focus to a different place.
 */
export function useRovingMenu(itemCount: number) {
  const itemRefs = useRef<Array<HTMLElement | null>>([]);

  function focusIndex(index: number) {
    const clamped = (index + itemCount) % itemCount;
    itemRefs.current[clamped]?.focus();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLElement>, currentIndex: number) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      focusIndex(currentIndex + 1);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      focusIndex(currentIndex - 1);
    } else if (event.key === "Home") {
      event.preventDefault();
      focusIndex(0);
    } else if (event.key === "End") {
      event.preventDefault();
      focusIndex(itemCount - 1);
    } else if (event.key.length === 1 && /\S/.test(event.key)) {
      const letter = event.key.toLowerCase();
      for (let offset = 1; offset <= itemCount; offset++) {
        const index = (currentIndex + offset) % itemCount;
        const label = itemRefs.current[index]?.textContent?.trim().toLowerCase() ?? "";
        if (label.startsWith(letter)) {
          focusIndex(index);
          break;
        }
      }
    }
  }

  return { itemRefs, focusIndex, handleKeyDown };
}
