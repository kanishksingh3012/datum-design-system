import { groups } from "../../../../docs/component-plan.json";
import type { SidebarSection } from "@datum-design/react";

export const slugify = (name: string) =>
  name.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export interface NavComponent { name: string; slug: string; group: string; why: string }

export const components: NavComponent[] = groups.flatMap((g) =>
  g.items.map((i) => ({ name: i.n, slug: slugify(i.n), group: g.name, why: i.why }))
);

export const docsSections: SidebarSection[] = [
  {
    title: "Getting started",
    links: [
      { label: "Introduction", href: "/docs" },
      { label: "Theming", href: "/docs/theming" },
    ],
  },
  ...groups.map((g) => ({
    title: g.name,
    links: g.items.map((i) => ({ label: i.n, href: `/docs/components/${slugify(i.n)}` })),
  })),
];
