import { forwardRef, useState, type ImgHTMLAttributes, type Ref } from "react";
import styles from "./Avatar.module.css";

export type AvatarSize = "default" | "sm";

export interface AvatarOwnProps {
  /** @default "default" */
  size?: AvatarSize;
  src?: string;
  /** The person's actual name - used as alt text on the image, and as the accessible name of the initials fallback. Never generic text like "avatar". */
  name: string;
  /** Shown when there's no src, or the image fails to load. Typically 1-2 initials. */
  initials?: string;
}

export type AvatarProps = AvatarOwnProps & Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "alt">;

export const Avatar = forwardRef<HTMLElement, AvatarProps>(function Avatar(
  { size = "default", src, name, initials, className, ...rest },
  ref
) {
  const [failed, setFailed] = useState(false);
  const classes = [styles.root, className].filter(Boolean).join(" ");

  if (src && !failed) {
    return (
      <img
        ref={ref as Ref<HTMLImageElement>}
        src={src}
        alt={name}
        data-size={size}
        className={classes}
        onError={() => setFailed(true)}
        {...rest}
      />
    );
  }

  return (
    <span ref={ref as Ref<HTMLSpanElement>} data-size={size} className={classes} role="img" aria-label={name}>
      {initials}
    </span>
  );
});

Avatar.displayName = "Avatar";
