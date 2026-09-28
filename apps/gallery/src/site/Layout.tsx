import type { MouseEvent } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Link, Navbar, Sidebar } from "@datum-design/react";
import { ThemeSwitch } from "./ThemeSwitch";
import { docsSections } from "./nav";

const GITHUB = "https://github.com/kanishksingh3012/datum-design-system";

const navLinks = [
  { label: "Docs", href: "/docs" },
  { label: "Blocks", href: "/blocks" },
  { label: "GitHub", href: GITHUB },
];

/** Datum's Navbar and Sidebar render plain anchors; route same-origin clicks through the router. */
function useSpaLinks() {
  const navigate = useNavigate();
  return (e: MouseEvent) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = (e.target as HTMLElement).closest("a");
    if (!a || a.target || a.origin !== location.origin || a.hasAttribute("download")) return;
    if (a.pathname === location.pathname && a.hash) return;
    e.preventDefault();
    navigate(a.pathname + a.search + a.hash);
  };
}

export function Layout() {
  const { pathname } = useLocation();
  const onClick = useSpaLinks();
  const inDocs = pathname.startsWith("/docs");
  const activeTop = navLinks.find((l) => l.href !== GITHUB && pathname.startsWith(l.href))?.href;

  return (
    <div className="site" onClick={onClick}>
      <Navbar
        position="sticky"
        appearance="blur"
        maxWidth="full"
        links={navLinks}
        activeHref={activeTop}
        logo={<Link href="/" className="site-logo">Datum</Link>}
        actions={<ThemeSwitch />}
      />
      {inDocs ? (
        <div className="site-docs">
          <Sidebar className="site-sidebar" label="Documentation" sections={docsSections} activeHref={pathname} />
          <main className="site-main" key={pathname}>
            <Outlet />
          </main>
        </div>
      ) : (
        <main className="site-page">
          <Outlet />
        </main>
      )}
    </div>
  );
}
