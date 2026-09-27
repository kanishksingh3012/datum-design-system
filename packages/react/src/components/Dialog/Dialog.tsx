import {
  createContext,
  forwardRef,
  useContext,
  useEffect,
  useId,
  useState,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
} from "react";
import {
  Dialog as AriaDialog,
  DialogTrigger,
  Heading,
  Modal,
  ModalOverlay,
  Pressable,
} from "react-aria-components";
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
  close: () => void;
  setDescriptionId: (id: string | undefined) => void;
}

const SlotContext = createContext<SlotContextValue>({
  dismissible: false,
  close: () => {},
  setDescriptionId: () => {},
});

const cx = (...names: (string | false | undefined)[]) => names.filter(Boolean).join(" ");

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
  const overlay = (
    <ModalOverlay
      className={overlayClassName}
      isDismissable={dismissible}
      isKeyboardDismissDisabled={!dismissible}
      // With a trigger, DialogTrigger owns the state; without one, the overlay does.
      {...(trigger ? {} : { isOpen: open, defaultOpen, onOpenChange })}
    >
      <Modal className={styles.modal}>{children}</Modal>
    </ModalOverlay>
  );
  if (!trigger) return overlay;
  return (
    <DialogTrigger isOpen={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      <Pressable>{trigger as never}</Pressable>
      {overlay}
    </DialogTrigger>
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
>(function ModalPanel({ dismissible, children, ...rest }, ref) {
  const [descriptionId, setDescriptionId] = useState<string>();
  return (
    <AriaDialog ref={ref} aria-describedby={descriptionId} {...(rest as Record<string, unknown>)}>
      {({ close }) => (
        <SlotContext.Provider value={{ dismissible, close, setDescriptionId }}>
          {typeof children === "function" ? children(close) : children}
        </SlotContext.Provider>
      )}
    </AriaDialog>
  );
});

/**
 * A focused task that blocks the page. Built on React Aria: focus is
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
  const { dismissible, close, setDescriptionId } = useContext(SlotContext);
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
        <Heading slot="title" className={styles.title}>
          {children}
        </Heading>
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
