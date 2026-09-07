import { useCallback, useId, useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode } from "react";
import styles from "./Resizable.module.css";

export interface ResizableOwnProps {
  first: ReactNode;
  second: ReactNode;
  /** 0-100, the first pane's share of the axis. @default 50 */
  defaultSplit?: number;
  /** @default "horizontal" - panes sit side by side, splitter drags left/right */
  orientation?: "horizontal" | "vertical";
  min?: number;
  max?: number;
}

export type ResizableProps = ResizableOwnProps;

export function Resizable({
  first,
  second,
  defaultSplit = 50,
  orientation = "horizontal",
  min = 10,
  max = 90,
}: ResizableProps) {
  const [split, setSplit] = useState(() => clamp(defaultSplit, min, max));
  const containerRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);
  const labelId = useId();

  const updateFromPointer = useCallback(
    (clientX: number, clientY: number) => {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const percent =
        orientation === "horizontal"
          ? ((clientX - rect.left) / rect.width) * 100
          : ((clientY - rect.top) / rect.height) * 100;
      setSplit(clamp(percent, min, max));
    },
    [orientation, min, max]
  );

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    draggingRef.current = true;
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!draggingRef.current) return;
    updateFromPointer(event.clientX, event.clientY);
  }

  function handlePointerUp(event: PointerEvent<HTMLDivElement>) {
    draggingRef.current = false;
    event.currentTarget.releasePointerCapture(event.pointerId);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const step = event.shiftKey ? 10 : 2;
    if (
      (orientation === "horizontal" && event.key === "ArrowLeft") ||
      (orientation === "vertical" && event.key === "ArrowUp")
    ) {
      event.preventDefault();
      setSplit((value) => clamp(value - step, min, max));
    } else if (
      (orientation === "horizontal" && event.key === "ArrowRight") ||
      (orientation === "vertical" && event.key === "ArrowDown")
    ) {
      event.preventDefault();
      setSplit((value) => clamp(value + step, min, max));
    } else if (event.key === "Home") {
      event.preventDefault();
      setSplit(min);
    } else if (event.key === "End") {
      event.preventDefault();
      setSplit(max);
    }
  }

  return (
    <div ref={containerRef} className={styles.root} data-orientation={orientation}>
      <div className={styles.pane} style={{ flexBasis: `${split}%` }} id={labelId}>
        {first}
      </div>
      <div
        role="separator"
        aria-orientation={orientation === "horizontal" ? "vertical" : "horizontal"}
        aria-valuenow={Math.round(split)}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-controls={labelId}
        tabIndex={0}
        className={styles.splitter}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onKeyDown={handleKeyDown}
      />
      <div className={styles.pane} style={{ flexBasis: `${100 - split}%` }}>
        {second}
      </div>
    </div>
  );
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}
