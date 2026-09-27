import {
  createContext,
  forwardRef,
  useContext,
  useEffect,
  useId,
  useState,
  useRef,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
} from "react";
import {
  Overlay,
  useButton,
  useDialog,
  useModalOverlay,
  useObjectRef,
  useOverlayTrigger,
  type AriaButtonProps,
} from "react-aria";
import { useOverlayTriggerState, type OverlayTriggerState } from "react-stately";
import { cloneTrigger } from "../../lib/cloneTrigger";
import { Button } from "../Button/Button";
import styles from "./Dialog.module.css";

export type DialogSize = "sm" | "md" | "lg" | "full";
export type DialogRole = "dialog" | "alertdialog";
export type DialogChildren = ReactNode | ((close: () => void) => ReactNode);

/** Open state and trigger — shared by Dialog and Sheet. */
export interface ModalControlProps {
  /** Controlled open state. Pair with `onOpenChange`. */
  open?: boolean;
  /** Uncontrolled initial open state. @default false */
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /**
   * Element that opens it (usually a Button). Optional: without one, drive
   * `open` yourself. Focus returns to whatever opened it on close.
   */
  trigger?: ReactElement;
}

export interface DialogOwnProps extends ModalControlProps {
  /** 400 / 560 / 720px wide, or the whole viewport. @default "md" */
  size?: DialogSize;
  /** `alertdialog` for destructive confirmations. @default "dialog" */
  role?: DialogRole;
  /** Escape and a click on the scrim close it, and DialogHeader shows a close button. @default true */
  dismissible?: boolean;
  /** DialogHeader, DialogBody, DialogFooter — or a function that receives `close`. */
  children?: DialogChildren;
}

export type DialogProps = DialogOwnProps & Omit<HTMLAttributes<HTMLElement>, "role" | "children">;

interface SlotContextValue {
  dismissible: boolean;
  titleProps: HTMLAttributes<HTMLElement>;
  close: () => void;
  setDescriptionId: (id: string | undefined) => void;
}

const SlotContext = createContext<SlotContextValue>({
  dismissible: false,
  titleProps: {},
  close: () => {},
  setDescriptionId: () => {},
});

const cx = (...names: (string | false | undefined)[]) => names.filter(Boolean).join(" ");

const ModalStateContext = createContext<OverlayTriggerState | null>(null);

/** @internal Open state, optional trigger, scrim and modal layer. Used by Dialog and Sheet. */
export function ModalFrame({
  open,
  defaultOpen,
  onOpenChange,
  trigger,
  dismissible,
  overlayClassName,
  children,
}: ModalControlProps & { dismissible: boolean; overlayClassName: string; children: ReactNode }) {
  const state = useOverlayTriggerState({ isOpen: open, defaultOpen, onOpenChange });
  const triggerRef = useRef<HTMLElement>(null);
  const { triggerProps, overlayProps } = useOverlayTrigger({ type: "dialog" }, state, triggerRef);
  const { buttonProps } = useButton(triggerProps as AriaButtonProps, triggerRef);
  return (
    <>
      {trigger ? cloneTrigger(trigger, buttonProps, triggerRef) : null}
      {state.isOpen ? (
        <Overlay>
          <ModalLayer state={state} dismissible={dismissible} className={overlayClassName} overlayProps={overlayProps}>
            {children}
          </ModalLayer>
        </Overlay>
      ) : null}
    </>
  );
}

function ModalLayer({
  state,
  dismissible,
  className,
  overlayProps,
  children,
}: {
  state: OverlayTriggerState;
  dismissible: boolean;
  className: string;
  overlayProps: HTMLAttributes<HTMLElement>;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { modalProps, underlayProps } = useModalOverlay(
    { isDismissable: dismissible, isKeyboardDismissDisabled: !dismissible },
    state,
    ref
  );
  return (
    <div {...underlayProps} className={className}>
      <div {...modalProps} {...overlayProps} ref={ref} className={styles.modal}>
        <ModalStateContext.Provider value={state}>{children}</ModalStateContext.Provider>
      </div>
    </div>
  );
}

/** @internal The labelled dialog element that the slots live in. Used by Dialog and Sheet. */
export const ModalPanel = forwardRef<
  HTMLElement,
  Omit<HTMLAttributes<HTMLElement>, "role" | "children"> & {
    dismissible: boolean;
    role?: DialogRole;
    children?: DialogChildren;
    [data: `data-${string}`]: string | undefined;
  }
>(function ModalPanel({ dismissible, role = "dialog", children, ...rest }, forwardedRef) {
  const ref = useObjectRef(forwardedRef);
  const state = useContext(ModalStateContext);
  const [descriptionId, setDescriptionId] = useState<string>();
  const { dialogProps, titleProps } = useDialog({ role, "aria-label": rest["aria-label"], "aria-labelledby": rest["aria-labelledby"] }, ref);
  const close = () => state?.close();
  return (
    <section {...rest} {...dialogProps} ref={ref} aria-describedby={rest["aria-describedby"] ?? descriptionId}>
      <SlotContext.Provider value={{ dismissible, titleProps, close, setDescriptionId }}>
        {typeof children === "function" ? children(close) : children}
      </SlotContext.Provider>
    </section>
  );
});

/**
 * A focused task that blocks the page. Built on React Aria's hooks: focus is
 * trapped inside and returns to the trigger on close, the page behind is
 * hidden from assistive tech and can't scroll, and the title from
 * DialogHeader becomes the accessible name.
 */
export const Dialog = forwardRef<HTMLElement, DialogProps>(function Dialog(
  { open, defaultOpen, onOpenChange, trigger, size = "md", role = "dialog", dismissible = true, className, children, ...rest },
  ref
) {
  return (
    <ModalFrame
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      trigger={trigger}
      dismissible={dismissible}
      overlayClassName={cx(styles.overlay, size === "full" && styles.overlayFull)}
    >
      <ModalPanel
        ref={ref}
        role={role}
        dismissible={dismissible}
        className={cx(styles.root, className)}
        data-size={size}
        {...rest}
      >
        {children}
      </ModalPanel>
    </ModalFrame>
  );
});

Dialog.displayName = "Dialog";

export interface DialogHeaderOwnProps {
  /** The title. It names the dialog for screen readers. */
  children: ReactNode;
  /** Supporting line under the title, linked as the dialog's description. */
  description?: ReactNode;
}

export type DialogHeaderProps = DialogHeaderOwnProps & Omit<HTMLAttributes<HTMLDivElement>, "children">;

export const DialogHeader = forwardRef<HTMLDivElement, DialogHeaderProps>(function DialogHeader(
  { children, description, className, ...rest },
  ref
) {
  const { dismissible, titleProps, close, setDescriptionId } = useContext(SlotContext);
  const descriptionId = useId();
  const hasDescription = description != null && description !== false;

  useEffect(() => {
    if (!hasDescription) return;
    setDescriptionId(descriptionId);
    return () => setDescriptionId(undefined);
  }, [hasDescription, descriptionId, setDescriptionId]);

  return (
    <div ref={ref} className={cx(styles.header, className)} {...rest}>
      <div className={styles.headings}>
        <h2 {...titleProps} className={styles.title}>
          {children}
        </h2>
        {hasDescription ? (
          <p id={descriptionId} className={styles.description}>
            {description}
          </p>
        ) : null}
      </div>
      {dismissible ? (
        <Button iconOnly label="Close" intent="neutral" appearance="ghost" size="sm" onClick={close}>
          <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
            <path d="M4 4l8 8M12 4l-8 8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </Button>
      ) : null}
    </div>
  );
});

DialogHeader.displayName = "DialogHeader";

export type DialogBodyProps = HTMLAttributes<HTMLDivElement>;

/** The content. Scrolls on its own when the dialog reaches the viewport height. */
export const DialogBody = forwardRef<HTMLDivElement, DialogBodyProps>(function DialogBody({ className, ...rest }, ref) {
  return <div ref={ref} className={cx(styles.body, className)} {...rest} />;
});

DialogBody.displayName = "DialogBody";

export type DialogFooterProps = HTMLAttributes<HTMLDivElement>;

/** Actions, right-aligned. Put the primary action last. */
export const DialogFooter = forwardRef<HTMLDivElement, DialogFooterProps>(function DialogFooter({ className, ...rest }, ref) {
  return <div ref={ref} className={cx(styles.footer, className)} {...rest} />;
});

DialogFooter.displayName = "DialogFooter";
