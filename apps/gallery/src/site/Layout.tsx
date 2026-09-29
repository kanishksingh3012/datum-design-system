import type { MouseEvent } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Footer, Link, Navbar, Sidebar, Toaster } from "@datum-design/react";
import { ThemeSwitch } from "./ThemeSwitch";
import { docsSections } from "./nav";
import { Toc } from "./Toc";

const GITHUB = "https://github.com/kanishksingh3012/datum-design-system";

const navLinks = [
  { label: "Docs", href: "/docs" },
  { label: "Components", href: "/docs/components/button" },
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
  const activeTop = pathname.startsWith("/docs/components") ? "/docs/components/button"
    : navLinks.find((l) => l.href !== GITHUB && pathname.startsWith(l.href))?.href;

  return (
    <div className="site" onClick={onClick}>
      <Navbar
        position="sticky"
        appearance="blur"
        maxWidth="full"
        links={navLinks}
        activeHref={activeTop}
        logo={<Link href="/" className="site-logo" underline="none" tone="neutral"><span className="site-mark" aria-hidden="true" />Datum</Link>}
        actions={<ThemeSwitch />}
      />
      {/* The Toast page mounts its own Toaster to demo positions. */}
      {pathname !== "/docs/components/toast" && <Toaster />}
      {inDocs ? (
        <div className="site-docs">
          <Sidebar className="site-sidebar" label="Documentation" sections={docsSections} activeHref={pathname} />
          <main className="site-main">
            <div className="site-article" key={pathname}>
              <Outlet />
            </div>
            <Toc />
          </main>
        </div>
      ) : (
        <>
          <main className="site-page">
            <Outlet />
          </main>
          <Footer
            tone="muted"
            columns={[
              { title: "Docs", links: [{ label: "Introduction", href: "/docs" }, { label: "Theming", href: "/docs/theming" }, { label: "Components", href: "/docs/components/button" }] },
              { title: "Build", links: [{ label: "Blocks", href: "/blocks" }, { label: "AI primitives", href: "/docs/components/message" }] },
              { title: "Project", links: [{ label: "GitHub", href: GITHUB }, { label: "npm", href: "https://www.npmjs.com/package/@datum-design/react" }] },
            ]}
            bottom="Datum · MIT licensed"
          />
        </>
      )}
    </div>
  );
}
