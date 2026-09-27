import { forwardRef, useCallback, useLayoutEffect, useMemo, useRef, useState, type HTMLAttributes, type Ref } from "react";
import { ButtonGroupContext } from "../../lib/buttonGroupContext";
import type { ButtonAppearance, ButtonIntent, ButtonSize } from "../Button/Button";
import styles from "./ButtonGroup.module.css";

export type ButtonGroupOrientation = "horizontal" | "vertical";

export interface ButtonGroupOwnProps {
  /** @default "horizontal" */
  orientation?: ButtonGroupOrientation;
  /**
   * Joins the buttons into one track: no borders between segments, and a
   * raised thumb slides to the pressed segment (use `pressed` on each Button
   * for a view switcher). Without it, the buttons are simply spaced. @default false
   */
  attached?: boolean;
  /** Passed down to every Button; a Button's own prop wins. */
  size?: ButtonSize;
  /** Passed down to every Button in a spaced group; a Button's own prop wins. */
  intent?: ButtonIntent;
  /** Passed down to every Button in a spaced group; a Button's own prop wins. */
  appearance?: ButtonAppearance;
}

export type ButtonGroupProps = ButtonGroupOwnProps & HTMLAttributes<HTMLDivElement>;

interface ThumbRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Tracks the pressed segment of an attached group so one thumb can slide
 * between segments. Re-measures on resize and whenever aria-pressed changes.
 */
function useThumb(enabled: boolean) {
  const [node, setNode] = useState<HTMLDivElement | null>(null);
  const [rect, setRect] = useState<ThumbRect | null>(null);

  const measure = useCallback(() => {
    const pressed = node?.querySelector<HTMLElement>(':scope > [aria-pressed="true"]');
    const next = pressed
      ? { x: pressed.offsetLeft, y: pressed.offsetTop, width: pressed.offsetWidth, height: pressed.offsetHeight }
      : null;
    setRect((prev) =>
      prev && next && prev.x === next.x && prev.y === next.y && prev.width === next.width && prev.height === next.height
        ? prev
        : next
    );
  }, [node]);

  useLayoutEffect(() => {
    if (!enabled || !node) return;
    measure();
    const mutations = new MutationObserver(measure);
    mutations.observe(node, { subtree: true, childList: true, attributes: true, attributeFilter: ["aria-pressed"] });
    const resize = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(measure);
    resize?.observe(node);
    return () => {
      mutations.disconnect();
      resize?.disconnect();
    };
  }, [enabled, node, measure]);

  return { setNode, rect: enabled ? rect : null };
}

function assignRef<T>(ref: Ref<T> | undefined, value: T) {
  if (typeof ref === "function") ref(value);
  else if (ref) (ref as { current: T }).current = value;
}

/**
 * Related actions as one unit. Vertical groups are as wide as their widest
 * button, and every button shares that width.
 */
export const ButtonGroup = forwardRef<HTMLDivElement, ButtonGroupProps>(function ButtonGroup(
  { orientation = "horizontal", attached = false, size, intent, appearance, role = "group", className, children, ...rest },
  ref
) {
  const context = useMemo(() => ({ size, intent, appearance, attached }), [size, intent, appearance, attached]);
  const { setNode, rect } = useThumb(attached);
  const hasMounted = useRef(false);
  const setRefs = useCallback(
    (el: HTMLDivElement | null) => {
      setNode(el);
      assignRef(ref, el);
    },
    [ref, setNode]
  );

  // The first placement jumps into position; later ones slide.
  const animate = hasMounted.current;
  if (rect) hasMounted.current = true;

  return (
    <ButtonGroupContext.Provider value={context}>
      <div
        ref={setRefs}
        role={role}
        data-orientation={orientation}
        data-attached={attached || undefined}
        className={[styles.root, className].filter(Boolean).join(" ")}
        {...rest}
      >
        {rect && (
          <span
            aria-hidden="true"
            className={styles.thumb}
            data-animate={animate || undefined}
            style={{
              width: rect.width,
              height: rect.height,
              transform: `translate(${rect.x}px, ${rect.y}px)`,
            }}
          />
        )}
        {children}
      </div>
    </ButtonGroupContext.Provider>
  );
});

ButtonGroup.displayName = "ButtonGroup";
