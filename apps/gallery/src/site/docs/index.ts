import { lazy, type ComponentType } from "react";

/** slug → doc page. Add one entry per migrated component. */
export const docPages: Record<string, ComponentType> = {
  "button": lazy(() => import("./Button")),
  "button-group": lazy(() => import("./ButtonGroup")),
  "link": lazy(() => import("./Link")),
};
