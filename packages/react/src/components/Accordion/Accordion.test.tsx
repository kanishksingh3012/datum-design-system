import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Accordion, AccordionItem, type AccordionProps } from "./Accordion";

function Faq(props: AccordionProps) {
  return (
    <Accordion {...props}>
      <AccordionItem value="one" title="Section one">Content one</AccordionItem>
      <AccordionItem value="two" title="Section two">Content two</AccordionItem>
      <AccordionItem value="three" title="Section three" disabled>Content three</AccordionItem>
    </Accordion>
  );
}

const trigger = (name: string) => screen.getByRole("button", { name });

describe("Accordion", () => {
  it("defaults to type=single and appearance=bordered, all items closed", () => {
    const { container } = render(<Faq />);
    const root = container.firstElementChild!;
    expect(root).toHaveAttribute("data-type", "single");
    expect(root).toHaveAttribute("data-appearance", "bordered");
    expect(trigger("Section one")).toHaveAttribute("aria-expanded", "false");
  });

  it("wraps each trigger in a heading and links it to its panel", () => {
    render(<Faq headingLevel={2} defaultValue="one" />);
    expect(screen.getByRole("heading", { level: 2, name: "Section one" })).toBeInTheDocument();
    const panel = document.getElementById(trigger("Section one").getAttribute("aria-controls")!)!;
    expect(panel).toHaveTextContent("Content one");
    expect(panel).toHaveAttribute("aria-labelledby", trigger("Section one").id);
  });

  it("opens one item at a time with type=single", async () => {
    const user = userEvent.setup();
    render(<Faq />);
    await user.click(trigger("Section one"));
    expect(trigger("Section one")).toHaveAttribute("aria-expanded", "true");
    await user.click(trigger("Section two"));
    expect(trigger("Section two")).toHaveAttribute("aria-expanded", "true");
    expect(trigger("Section one")).toHaveAttribute("aria-expanded", "false");
  });

  it("keeps several items open with type=multiple", async () => {
    const user = userEvent.setup();
    render(<Faq type="multiple" />);
    await user.click(trigger("Section one"));
    await user.click(trigger("Section two"));
    expect(trigger("Section one")).toHaveAttribute("aria-expanded", "true");
    expect(trigger("Section two")).toHaveAttribute("aria-expanded", "true");
  });

  it("closes the open item when collapsible (the default)", async () => {
    const user = userEvent.setup();
    render(<Faq defaultValue="one" />);
    await user.click(trigger("Section one"));
    expect(trigger("Section one")).toHaveAttribute("aria-expanded", "false");
  });

  it("keeps the open item open when collapsible=false, marking it aria-disabled but focusable", async () => {
    const user = userEvent.setup();
    render(<Faq defaultValue="one" collapsible={false} />);
    const one = trigger("Section one");
    expect(one).toHaveAttribute("aria-disabled", "true");
    expect(one).not.toBeDisabled();
    await user.click(one);
    expect(one).toHaveAttribute("aria-expanded", "true");
    await user.click(trigger("Section two"));
    expect(one).toHaveAttribute("aria-expanded", "false");
  });

  it("toggles from the keyboard", async () => {
    const user = userEvent.setup();
    render(<Faq />);
    await user.tab();
    expect(trigger("Section one")).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(trigger("Section one")).toHaveAttribute("aria-expanded", "true");
    await user.keyboard(" ");
    expect(trigger("Section one")).toHaveAttribute("aria-expanded", "false");
  });

  it("disables an item natively", async () => {
    const user = userEvent.setup();
    render(<Faq />);
    const three = trigger("Section three");
    expect(three).toBeDisabled();
    await user.click(three);
    expect(three).toHaveAttribute("aria-expanded", "false");
  });

  it("reports open values and follows a controlled value", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const { rerender } = render(<Faq type="multiple" value={["two"]} onValueChange={onValueChange} />);
    expect(trigger("Section two")).toHaveAttribute("aria-expanded", "true");
    await user.click(trigger("Section one"));
    expect(onValueChange).toHaveBeenLastCalledWith(["two", "one"]);
    expect(trigger("Section one")).toHaveAttribute("aria-expanded", "false");
    rerender(<Faq type="multiple" value={["one"]} onValueChange={onValueChange} />);
    expect(trigger("Section one")).toHaveAttribute("aria-expanded", "true");
    expect(trigger("Section two")).toHaveAttribute("aria-expanded", "false");
  });
});
