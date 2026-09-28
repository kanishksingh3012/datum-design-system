import { Children, Fragment, isValidElement, type CSSProperties, type ReactNode } from "react";
import { CodeBlock, Tabs } from "@datum-design/react";

/*
 * The shape of a component doc file (src/site/docs/<Component>.tsx):
 *   <section className="component-doc"> h1 + p.dek
 *     <Demo box="example"> hero example </Demo>
 *     .doc-section blocks: h2, p.lead, <Demo> per example
 *     Properties → <PropsTable rows />
 *     Usage guidelines → <Usage dos donts />
 *     Keyboard and accessibility → <A11y items />
 * Demo shows Preview / Code tabs; the code is generated from its JSX children.
 */

export type PropRow = [string, string, string, string];

const indent = (s: string) => s.split("\n").map((l) => "  " + l).join("\n");

function typeName(type: unknown): string {
  if (typeof type === "string") return type;
  if (type === Fragment) return "";
  const t = type as { displayName?: string; name?: string; render?: { name?: string }; type?: { name?: string } };
  return t.displayName || t.name || t.render?.name || t.type?.name || "Component";
}

function propValue(v: unknown): string | null {
  if (v === true) return "";
  if (v === false || v == null) return null;
  if (typeof v === "string") return `"${v}"`;
  if (typeof v === "number") return `{${v}}`;
  if (typeof v === "function") return "{() => …}";
  if (isValidElement(v)) return `{${toJsx(v)}}`;
  return `{${JSON.stringify(v)}}`;
}

export function toJsx(node: ReactNode): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node).trim();
  if (Array.isArray(node)) return node.map(toJsx).filter(Boolean).join("\n");
  if (!isValidElement(node)) return "";
  const { children, ...props } = node.props as Record<string, unknown> & { children?: ReactNode };
  const name = typeName(node.type);
  const attrs = Object.entries(props)
    .map(([k, v]) => { const pv = propValue(v); return pv === null ? null : pv === "" ? k : `${k}=${pv}`; })
    .filter(Boolean)
    .join(" ");
  const open = name + (attrs ? " " + attrs : "");
  const inner = Children.toArray(children).map(toJsx).filter(Boolean);
  if (!inner.length) return name ? `<${open} />` : "";
  if (inner.length === 1 && !inner[0].includes("\n") && (open + inner[0]).length < 70) return `<${open}>${inner[0]}</${name}>`;
  return `<${open}>\n${indent(inner.join("\n"))}\n</${name}>`;
}

export function Demo({ box = "sample", className, style, children }: {
  box?: "sample" | "example"; className?: string; style?: CSSProperties; children: ReactNode;
}) {
  const preview = <div className={[`${box}-box`, className].filter(Boolean).join(" ")} style={style}>{children}</div>;
  return (
    <div className="site-demo">
      <Tabs
        size="sm"
        defaultValue="preview"
        items={[
          { value: "preview", label: "Preview", content: preview },
          { value: "code", label: "Code", content: <CodeBlock code={toJsx(children)} language="tsx" copyable /> },
        ]}
      />
    </div>
  );
}

export function PropsTable({ rows }: { rows: PropRow[] }) {
  return (
    <table className="props-table">
      <thead>
        <tr><th scope="col">Prop</th><th scope="col">Values</th><th scope="col">Default</th><th scope="col">Notes</th></tr>
      </thead>
      <tbody>
        {rows.map(([prop, values, def, note]) => (
          <tr key={prop}>
            <th scope="row"><code>{prop}</code></th>
            <td><code>{values}</code></td>
            <td><code>{def}</code></td>
            <td>{note}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function Usage({ dos, donts }: { dos: string[]; donts: string[] }) {
  return (
    <div className="usage-grid">
      <div>
        <h3>Do</h3>
        <ul>{dos.map((d) => <li key={d}>{d}</li>)}</ul>
      </div>
      <div>
        <h3>Don't</h3>
        <ul>{donts.map((d) => <li key={d}>{d}</li>)}</ul>
      </div>
    </div>
  );
}

/** Keyboard and accessibility notes: [key or topic, what happens]. */
export function A11y({ items }: { items: [string, ReactNode][] }) {
  return (
    <div className="doc-section">
      <h2>Keyboard and accessibility</h2>
      <table className="props-table">
        <tbody>
          {items.map(([k, v]) => (
            <tr key={k}><th scope="row">{k}</th><td>{v}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
