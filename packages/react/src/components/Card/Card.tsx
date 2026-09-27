import { forwardRef, type HTMLAttributes, type ReactElement, type Ref } from "react";
import styles from "./Card.module.css";

export type CardAppearance = "elevated" | "outline" | "soft";
export type CardPadding = "sm" | "md" | "lg";

export interface CardOwnProps {
  /** Surface shadow / border only / surface fill. @default "elevated" */
  appearance?: CardAppearance;
  /** 16 / 24 / 32px inside the card. @default "md" */
  padding?: CardPadding;
  /**
   * The whole card is one click target: it lifts on hover and shows the
   * focus ring. Renders an `<a>` when `href` is set, a `<button>` otherwise
   * (or whatever `render` returns). Keep other controls out of an
   * interactive card — a link can't contain a link. @default false
   */
  interactive?: boolean;
  /** With `interactive`, makes the card a link. */
  href?: string;
  /**
   * With `interactive`, renders as a different element (e.g. a router Link).
   * Receives the fully computed DOM props to spread onto that element.
   */
  render?: (props: Record<string, unknown>) => ReactElement;
}

export type CardProps = CardOwnProps & HTMLAttributes<HTMLElement>;

export const Card = forwardRef<HTMLElement, CardProps>(function Card(
  { appearance = "elevated", padding = "md", interactive = false, href, render, className, ...rest },
  ref
) {
  const props = {
    className: [styles.root, className].filter(Boolean).join(" "),
    "data-appearance": appearance,
    "data-padding": padding,
    "data-interactive": interactive || undefined,
    ...rest,
  };

  if (!interactive) return <div {...props} ref={ref as Ref<HTMLDivElement>} />;
  if (render) return render({ ...props, ref, href });
  if (href) return <a {...props} ref={ref as Ref<HTMLAnchorElement>} href={href} />;
  return <button type="button" {...props} ref={ref as Ref<HTMLButtonElement>} />;
});

Card.displayName = "Card";

type SlotProps = HTMLAttributes<HTMLDivElement>;

function slot(name: string, className: string) {
  const Slot = forwardRef<HTMLDivElement, SlotProps>(function Slot({ className: extra, ...rest }, ref) {
    return <div ref={ref} className={[className, extra].filter(Boolean).join(" ")} {...rest} />;
  });
  Slot.displayName = name;
  return Slot;
}

/** Title row: a heading, and optionally a badge or an action at the end. */
export const CardHeader = slot("CardHeader", styles.header);
/** An image or video that bleeds to the card's edges when it comes first or last. */
export const CardMedia = slot("CardMedia", styles.media);
/** The card's main content. Grows, so footers line up across a row of cards. */
export const CardBody = slot("CardBody", styles.body);
/** Actions or metadata, pinned to the bottom. */
export const CardFooter = slot("CardFooter", styles.footer);

export type CardHeaderProps = SlotProps;
export type CardMediaProps = SlotProps;
export type CardBodyProps = SlotProps;
export type CardFooterProps = SlotProps;
