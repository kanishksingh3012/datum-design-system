import { useCallback, useRef, useState } from "react";

/**
 * The state trio in one hook: pass the current value to control it, or leave
 * it undefined and the hook holds `defaultValue`. `onChange` fires either way,
 * only when the value actually changes.
 */
export function useControllableState<T>(
  value: T | undefined,
  defaultValue: T,
  onChange?: (value: T) => void
): [T, (next: T) => void] {
  const [internal, setInternal] = useState(defaultValue);
  const isControlled = value !== undefined;
  const current = isControlled ? value : internal;
  const latest = useRef(current);
  latest.current = current;

  const set = useCallback(
    (next: T) => {
      if (Object.is(next, latest.current)) return;
      latest.current = next;
      if (!isControlled) setInternal(next);
      onChange?.(next);
    },
    [isControlled, onChange]
  );

  return [current, set];
}
