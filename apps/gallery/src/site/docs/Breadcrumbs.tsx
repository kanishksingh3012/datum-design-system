import { BreadcrumbItem, Breadcrumbs } from "@datum-design/react";
import { A11y, Demo, PropRow, PropsTable, Usage } from "./kit";

const breadcrumbsProps: PropRow[] = [
  ["separator", "chevron | slash", "chevron", "Drawn between items, hidden from screen readers."],
  ["size", "sm | md", "md", "body-sm / body-md."],
  ["maxItems", "number", "—", "Collapses the middle into a … button that shows the rest."],
  ["BreadcrumbItem current", "boolean", "false", "The current page: plain text with aria-current=\"page\"."],
];

export default function BreadcrumbsDoc() {
  return (
    <>
    <section className="component-doc" id="breadcrumbs">
      <h1>Breadcrumbs</h1>
      <p className="dek">
        Where you are in a hierarchy: a labelled <span className="prop-values">nav</span> with an ordered list. Links are{" "}
        <b>text.secondary</b> and step up to primary on hover; the current page is text with{" "}
        <span className="prop-values">aria-current="page"</span>.
      </p>

      <Demo box="example">
        <Breadcrumbs>
          <BreadcrumbItem href="#breadcrumbs">Home</BreadcrumbItem>
          <BreadcrumbItem href="#breadcrumbs">Docs</BreadcrumbItem>
          <BreadcrumbItem href="#breadcrumbs">Components</BreadcrumbItem>
          <BreadcrumbItem current>Breadcrumbs</BreadcrumbItem>
        </Breadcrumbs>
      </Demo>

      <div className="doc-section">
        <h2>Separators and sizes</h2>
        <p className="lead">A chevron or a slash, hidden from screen readers; body-md or body-sm.</p>
        <Demo className="column">
          {(["chevron", "slash"] as const).map((separator) => (
            <Breadcrumbs key={separator} separator={separator} size="sm">
              <BreadcrumbItem href="#breadcrumbs">Home</BreadcrumbItem>
              <BreadcrumbItem href="#breadcrumbs">Docs</BreadcrumbItem>
              <BreadcrumbItem current>{separator}</BreadcrumbItem>
            </Breadcrumbs>
          ))}
        </Demo>
      </div>

      <div className="doc-section">
        <h2>Collapsed</h2>
        <p className="lead">With <b>maxItems</b>, the middle folds into a … button; the first item and the last ones stay.</p>
        <Demo>
          <Breadcrumbs maxItems={3}>
            {["Home", "Docs", "Components", "Navigation"].map((x) => <BreadcrumbItem key={x} href="#breadcrumbs">{x}</BreadcrumbItem>)}
            <BreadcrumbItem current>Breadcrumbs</BreadcrumbItem>
          </Breadcrumbs>
        </Demo>
      </div>

      <div className="doc-section">
        <h2>Properties</h2>
        <PropsTable rows={breadcrumbsProps} />
      </div>

      <div className="doc-section">
        <h2>Usage guidelines</h2>
        <Usage
          dos={["Start at the site's root.", "End with the current page, not a link to it."]}
          donts={["Use breadcrumbs for a flat site.", "Use them as a history of pages visited."]}
        />
      </div>
      <A11y items={[
          ["Semantics", "A nav landmark named \"Breadcrumbs\" around an ordered list."],
          ["Current page", "The item with current renders as text with aria-current=\"page\", not a link."],
        ]} />
    </section>

    </>
  );
}
