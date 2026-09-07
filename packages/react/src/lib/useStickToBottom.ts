import { useEffect, useRef, useState } from "react";
import { StickToBottomController } from "./StickToBottomController";

export interface UseStickToBottomOptions {
  defaultPinned?: boolean;
  onPinnedChange?: (pinned: boolean) => void;
  /** Pass a new key when swapping transcripts, to re-arm pinning for the fresh viewport. */
  conversationKey?: string | number;
}

export function useStickToBottom({ defaultPinned = true, onPinnedChange, conversationKey }: UseStickToBottomOptions = {}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<StickToBottomController | null>(null);
  if (!controllerRef.current) {
    controllerRef.current = new StickToBottomController({ defaultPinned });
  }
  const [pinned, setPinned] = useState(defaultPinned);

  useEffect(() => {
    const element = containerRef.current;
    const controller = controllerRef.current!;
    controller.setPinned(defaultPinned);
    setPinned(defaultPinned);
    if (!element) return;
    controller.attach(element);
    const unsubscribe = controller.subscribe((next) => {
      setPinned(next);
      onPinnedChange?.(next);
    });
    return () => {
      controller.detach();
      unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationKey]);

  function scrollToBottom(behavior: ScrollBehavior = "auto") {
    controllerRef.current!.scrollToBottom(behavior);
  }

  return { containerRef, pinned, scrollToBottom };
}
