import { lazy, type ComponentType } from "react";

/** slug → doc page. Add one entry per migrated component. */
export const docPages: Record<string, ComponentType> = {
  "button": lazy(() => import("./Button")),
  "button-group": lazy(() => import("./ButtonGroup")),
  "link": lazy(() => import("./Link")),
  "container": lazy(() => import("./Container")),
  "stack": lazy(() => import("./Stack")),
  "grid": lazy(() => import("./Grid")),
  "section": lazy(() => import("./Section")),
  "scroll-area": lazy(() => import("./ScrollArea")),
  "resizable": lazy(() => import("./Resizable")),
  "heading": lazy(() => import("./Heading")),
  "text": lazy(() => import("./Text")),
};
