import { forwardRef, type HTMLAttributes } from "react";
import styles from "./Alert.module.css";

export type AlertVariant = "danger" | "warning" | "success";

export interface AlertOwnProps {
  variant: AlertVariant;
  title: string;
  body?: string;
}

export type AlertProps = AlertOwnProps & Omit<HTMLAttributes<HTMLDivElement>, "role" | "title">;

export const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  { variant, title, body, className, ...rest },
  ref
) {
  return (
    <div
      ref={ref}
      data-variant={variant}
      role={variant === "danger" ? "alert" : "status"}
      className={[styles.root, className].filter(Boolean).join(" ")}
      {...rest}
    >
      <p className={styles.title}>{title}</p>
      {body ? <p className={styles.body}>{body}</p> : null}
    </div>
  );
});

Alert.displayName = "Alert";
