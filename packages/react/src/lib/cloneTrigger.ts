import { cloneElement, type ReactElement, type Ref, type RefObject } from "react";
import { mergeProps } from "react-aria";

/**
 * Hands an overlay's trigger props and ref to a trigger element the caller
 * passed in (usually a Button), keeping the element's own props and ref.
 * Event handlers are chained, so the element's onClick still runs.
 */
export function cloneTrigger(element: ReactElement, props: object, ref: RefObject<HTMLElement | null>) {
  const ownRef = (element as ReactElement & { ref?: Ref<HTMLElement> }).ref;
  const setRef = (node: HTMLElement | null) => {
    (ref as { current: HTMLElement | null }).current = node;
    if (typeof ownRef === "function") ownRef(node);
    else if (ownRef) (ownRef as { current: HTMLElement | null }).current = node;
  };
  return cloneElement(element, { ...mergeProps(props, element.props as object), ref: setRef } as object);
}
