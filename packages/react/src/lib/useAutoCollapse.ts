import { useEffect, useRef } from "react";

const COLLAPSE_DELAY_MS = 600;

/**
 * Shared behavior for a <details> that should stay open while content is
 * streaming in and settle closed shortly after - but only on that edge,
 * and only if the reader hasn't manually toggled it in the meantime. Used
 * by both Reasoning and FileDiff, which follow the identical rule.
 */
export function useAutoCollapse(streaming: boolean, collapseOnComplete: boolean) {
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const userToggledRef = useRef(false);
  const programmaticRef = useRef(false);

  useEffect(() => {
    const details = detailsRef.current;
    if (!details) return;
    function handleToggle() {
      if (programmaticRef.current) {
        programmaticRef.current = false;
        return;
      }
      userToggledRef.current = true;
    }
    details.addEventListener("toggle", handleToggle);
    return () => details.removeEventListener("toggle", handleToggle);
  }, []);

  useEffect(() => {
    const details = detailsRef.current;
    if (!details) return;

    if (streaming) {
      userToggledRef.current = false;
      if (!details.open) {
        programmaticRef.current = true;
        details.open = true;
      }
      return;
    }

    if (!collapseOnComplete) return;
    const timer = setTimeout(() => {
      if (!userToggledRef.current && details.open) {
        programmaticRef.current = true;
        details.open = false;
      }
    }, COLLAPSE_DELAY_MS);
    return () => clearTimeout(timer);
  }, [streaming, collapseOnComplete]);

  return detailsRef;
}
