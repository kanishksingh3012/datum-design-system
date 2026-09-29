import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

interface Entry { id: string; text: string; level: number }

const toId = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

/** "On this page": the article's h2s (and any h1 after the first), with the one in view marked. */
export function Toc() {
  const { pathname } = useLocation();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [active, setActive] = useState("");

  useEffect(() => {
    const article = document.querySelector(".site-article");
    if (!article) return;
    let spy: IntersectionObserver | undefined;
    const collect = () => {
      const heads = [...article.querySelectorAll<HTMLElement>("h1, h2")].slice(1);
      const seen = new Set<string>();
      const next = heads.map((h) => {
        let id = h.id || toId(h.textContent ?? "");
        while (seen.has(id)) id += "-2";
        seen.add(id);
        h.id = id;
        return { id, text: h.textContent ?? "", level: h.tagName === "H1" ? 1 : 2 };
      });
      setEntries(next);
      spy?.disconnect();
      spy = new IntersectionObserver(
        (items) => {
          const top = items.filter((i) => i.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
          if (top) setActive(top.target.id);
        },
        { rootMargin: "-80px 0px -70% 0px" }
      );
      heads.forEach((h) => spy!.observe(h));
    };
    collect();
    const mo = new MutationObserver(collect);
    mo.observe(article, { childList: true, subtree: true });
    return () => { mo.disconnect(); spy?.disconnect(); };
  }, [pathname]);

  if (entries.length < 2) return <aside className="site-toc" />;
  return (
    <aside className="site-toc" aria-label="On this page">
      <p className="site-toc-title">On this page</p>
      <ul>
        {entries.map((e) => (
          <li key={e.id} data-level={e.level}>
            <a href={`#${e.id}`} aria-current={active === e.id ? "location" : undefined}>{e.text}</a>
          </li>
        ))}
      </ul>
    </aside>
  );
}
