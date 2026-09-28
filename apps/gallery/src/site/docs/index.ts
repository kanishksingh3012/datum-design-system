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
  "card": lazy(() => import("./Card")),
  "badge": lazy(() => import("./Badge")),
  "avatar": lazy(() => import("./Avatar")),
  "separator": lazy(() => import("./Separator")),
  "accordion": lazy(() => import("./Accordion")),
  "carousel": lazy(() => import("./Carousel")),
  "alert": lazy(() => import("./Alert")),
  "toast": lazy(() => import("./Toast")),
  "spinner": lazy(() => import("./Spinner")),
  "progress-bar": lazy(() => import("./ProgressBar")),
  "skeleton": lazy(() => import("./Skeleton")),
};
