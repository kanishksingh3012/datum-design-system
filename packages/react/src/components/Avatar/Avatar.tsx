import {
  Children,
  createContext,
  forwardRef,
  isValidElement,
  useContext,
  useState,
  type HTMLAttributes,
} from "react";
import styles from "./Avatar.module.css";

export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";
export type AvatarShape = "circle" | "square";
export type AvatarStatus = "online" | "away" | "busy" | "offline";

/** What an AvatarGroup passes down to every Avatar inside it. An Avatar's own props win. */
const AvatarGroupContext = createContext<{ size: AvatarSize; shape?: AvatarShape } | null>(null);

export interface AvatarOwnProps {
  /** 24 / 32 / 40 / 48 / 64px. @default "md" */
  size?: AvatarSize;
  /** @default "circle" */
  shape?: AvatarShape;
  /** Image URL. If it is missing or fails to load, the avatar falls back to initials, then an icon. */
  src?: string;
  /**
   * The person's or entity's real name. It is the avatar's accessible name and
   * the source of the initials. Without it the avatar is decorative.
   */
  name?: string;
  /** Optional presence dot. Added to the accessible name, e.g. "Ada Lovelace, online". */
  status?: AvatarStatus;
}

export type AvatarProps = AvatarOwnProps & Omit<HTMLAttributes<HTMLSpanElement>, "children">;

/** "Ada Lovelace" → "AL", "Datum" → "D". */
function initialsOf(name: string) {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (!words.length) return "";
  const first = words[0][0];
  const last = words.length > 1 ? words[words.length - 1][0] : "";
  return (first + last).toUpperCase();
}

function PersonIcon() {
  return (
    <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" strokeLinecap="round" />
    </svg>
  );
}

export const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(function Avatar(
  { size: sizeProp, shape: shapeProp, src, name, status, className, ...rest },
  ref
) {
  const group = useContext(AvatarGroupContext);
  const size = sizeProp ?? group?.size ?? "md";
  const shape = shapeProp ?? group?.shape ?? "circle";
  // Remember which src failed, so a new src gets a fresh try.
  const [failedSrc, setFailedSrc] = useState<string>();
  const showImage = src && failedSrc !== src;
  const initials = name ? initialsOf(name) : "";
  const label = name && status ? `${name}, ${status}` : name;

  return (
    <span
      ref={ref}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      data-size={size}
      data-shape={shape}
      data-status={status}
      data-fallback={showImage ? undefined : initials ? "initials" : "icon"}
      className={[styles.root, className].filter(Boolean).join(" ")}
      {...rest}
    >
      {showImage ? (
        <img className={styles.image} src={src} alt="" onError={() => setFailedSrc(src)} />
      ) : initials ? (
        <span className={styles.initials} aria-hidden="true">{initials}</span>
      ) : (
        <PersonIcon />
      )}
      {status && <span className={styles.status} aria-hidden="true" />}
    </span>
  );
});

Avatar.displayName = "Avatar";

export interface AvatarGroupOwnProps {
  /** How many avatars to show before collapsing the rest into "+N". Shows all when unset. */
  max?: number;
  /** Size for every avatar in the stack. @default "md" */
  size?: AvatarSize;
  /** Shape for every avatar in the stack. @default "circle" */
  shape?: AvatarShape;
}

export type AvatarGroupProps = AvatarGroupOwnProps & HTMLAttributes<HTMLDivElement>;

/** An overlapping stack of Avatars. Give it an aria-label, e.g. "Project members". */
export const AvatarGroup = forwardRef<HTMLDivElement, AvatarGroupProps>(function AvatarGroup(
  { max, size = "md", shape, className, children, ...rest },
  ref
) {
  const items = Children.toArray(children).filter(isValidElement);
  const shown = max !== undefined && items.length > max ? items.slice(0, Math.max(max, 0)) : items;
  const extra = items.length - shown.length;

  return (
    <div
      ref={ref}
      role="group"
      data-size={size}
      className={[styles.group, className].filter(Boolean).join(" ")}
      {...rest}
    >
      <AvatarGroupContext.Provider value={{ size, shape }}>
        {shown}
        {extra > 0 && (
          <span
            role="img"
            aria-label={`${extra} more`}
            data-size={size}
            data-shape={shape ?? "circle"}
            data-overflow=""
            className={styles.root}
          >
            <span className={styles.initials} aria-hidden="true">{`+${extra}`}</span>
          </span>
        )}
      </AvatarGroupContext.Provider>
    </div>
  );
});

AvatarGroup.displayName = "AvatarGroup";
