import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Accordion, AccordionItem } from "./Accordion";

describe("Accordion", () => {
  it("renders each item as a real <details>/<summary> disclosure", () => {
    render(
      <Accordion>
        <AccordionItem title="Section one">Content one</AccordionItem>
        <AccordionItem title="Section two">Content two</AccordionItem>
      </Accordion>
    );
    expect(screen.getByText("Section one").closest("details")).toBeInTheDocument();
  });

  it("respects defaultOpen", () => {
    render(
      <Accordion>
        <AccordionItem title="Section one" defaultOpen>
          Content one
        </AccordionItem>
      </Accordion>
    );
    expect(screen.getByText("Section one").closest("details")).toHaveAttribute("open");
  });

  it("toggles open on clicking the summary", async () => {
    const user = userEvent.setup();
    render(
      <Accordion>
        <AccordionItem title="Section one">Content one</AccordionItem>
      </Accordion>
    );
    const details = screen.getByText("Section one").closest("details")!;
    expect(details).not.toHaveAttribute("open");
    await user.click(screen.getByText("Section one"));
    expect(details).toHaveAttribute("open");
  });

  it("gives sibling items the same name, for native exclusive-open grouping", () => {
    render(
      <Accordion>
        <AccordionItem title="Section one">Content one</AccordionItem>
        <AccordionItem title="Section two">Content two</AccordionItem>
      </Accordion>
    );
    const first = screen.getByText("Section one").closest("details")!;
    const second = screen.getByText("Section two").closest("details")!;
    expect(first.getAttribute("name")).toBe(second.getAttribute("name"));
    expect(first.getAttribute("name")).toBeTruthy();
  });
});
