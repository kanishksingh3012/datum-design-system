import { forwardRef, type HTMLAttributes } from "react";
import styles from "./Sidebar.module.css";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface SidebarOwnProps {}

export type SidebarProps = SidebarOwnProps & HTMLAttributes<HTMLElement>;

export const Sidebar = forwardRef<HTMLElement, SidebarProps>(function Sidebar({ className, ...rest }, ref) {
  return <aside ref={ref} className={[styles.root, className].filter(Boolean).join(" ")} {...rest} />;
});

Sidebar.displayName = "Sidebar";
