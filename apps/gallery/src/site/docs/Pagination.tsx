import { Pagination } from "@datum-design/react";
import { A11y, Demo, PropRow, PropsTable, Usage } from "./kit";

const paginationProps: PropRow[] = [
  ["pageCount", "number", "—", "How many pages there are."],
  ["value / defaultValue / onValueChange", "number / number / (page) => void", "1", "The current page."],
  ["size", "sm | md", "md", "32 / 40px Buttons; +4px on touch screens."],
  ["siblings", "number", "1", "Page numbers either side of the current one."],
  ["compact", "boolean", "false", "\"Page 3 of 12\" with arrows only."],
  ["getHref", "(page) => string", "—", "Renders pages as links, so they can be crawled and opened in a new tab."],
];

export default function PaginationDoc() {
  return (
    <>
    <section className="component-doc" id="pagination">
      <h1>Pagination</h1>
      <p className="dek">
        Move through pages of results. Built from Buttons, so pages inherit their hover, press, focus and touch rules. The current
        page is ink with <span className="prop-values">aria-current="page"</span>; the first and last pages always show.
      </p>

      <Demo box="example">
        <Pagination pageCount={12} defaultValue={6} />
      </Demo>

      <div className="doc-section">
        <h2>Siblings</h2>
        <p className="lead">How many pages either side of the current one. The list keeps its length as you move, so the arrows don't jump.</p>
        <Demo className="column">
          <Pagination pageCount={20} defaultValue={10} siblings={2} />
        </Demo>
      </div>

      <div className="doc-section">
        <h2>Compact and small</h2>
        <p className="lead">"Page 3 of 12" between the arrows for tight spaces; 32px buttons with size sm.</p>
        <Demo className="column">
          <Pagination pageCount={12} defaultValue={3} compact />
          <Pagination pageCount={12} defaultValue={3} size="sm" />
        </Demo>
      </div>

      <div className="doc-section">
        <h2>Properties</h2>
        <PropsTable rows={paginationProps} />
      </div>

      <div className="doc-section">
        <h2>Usage guidelines</h2>
        <Usage
          dos={["Use getHref on websites, so every page has a URL.", "Put it under the results it pages through."]}
          donts={["Paginate a list short enough to show whole.", "Use it for steps in a form."]}
        />
      </div>
      <A11y items={[
          ["Semantics", "A nav landmark; the current page has aria-current=\"page\"."],
          ["Buttons", "Previous / next have accessible names and are disabled at the ends."],
        ]} />
    </section>

    </>
  );
}
