import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Text } from "./Text";

describe("Text", () => {
  it("defaults to a <p> with variant body-md and tone primary, no weight override or truncation", () => {
    render(<Text>Hello</Text>);
    const el = screen.getByText("Hello");
    expect(el.tagName).toBe("P");
    expect(el).toHaveAttribute("data-variant", "body-md");
    expect(el).toHaveAttribute("data-tone", "primary");
    expect(el).not.toHaveAttribute("data-weight");
    expect(el).not.toHaveAttribute("data-truncate");
  });

  it("reflects every variant", () => {
    const variants = [
      "body-lg", "body-md", "body-sm", "paragraph-lg", "paragraph-md", "label",
      "caption", "overline", "numeric-lg", "numeric-md", "numeric-sm", "code",
    ] as const;
    for (const variant of variants) {
      render(<Text variant={variant}>{variant}</Text>);
      expect(screen.getByText(variant)).toHaveAttribute("data-variant", variant);
    }
  });

  it("reflects tone and weight", () => {
    render(
      <Text tone="danger" weight="semibold">
        Failed
      </Text>
    );
    const el = screen.getByText("Failed");
    expect(el).toHaveAttribute("data-tone", "danger");
    expect(el).toHaveAttribute("data-weight", "semibold");
  });

  it("truncates to one line with true (or 1) and clamps to N lines with a number", () => {
    render(<Text truncate>One</Text>);
    expect(screen.getByText("One")).toHaveAttribute("data-truncate", "line");
    render(<Text truncate={1}>Single</Text>);
    expect(screen.getByText("Single")).toHaveAttribute("data-truncate", "line");
    render(<Text truncate={3}>Three</Text>);
    const three = screen.getByText("Three");
    expect(three).toHaveAttribute("data-truncate", "lines");
    expect(three.style.getPropertyValue("--_lines")).toBe("3");
  });

  it("renders as span, div or label, passing htmlFor to a label", () => {
    render(
      <>
        <Text as="span">Span</Text>
        <Text as="div">Div</Text>
        <Text as="label" variant="label" htmlFor="email">
          Email
        </Text>
        <input id="email" />
      </>
    );
    expect(screen.getByText("Span").tagName).toBe("SPAN");
    expect(screen.getByText("Div").tagName).toBe("DIV");
    expect(screen.getByLabelText("Email").tagName).toBe("INPUT");
  });

  it("forwards its ref, merges className and keeps the consumer's style", () => {
    const ref = createRef<HTMLElement>();
    render(
      <Text ref={ref} className="extra" truncate={2} style={{ maxWidth: 200 }}>
        Clamp
      </Text>
    );
    const el = screen.getByText("Clamp");
    expect(ref.current).toBe(el);
    expect(el.className).toContain("extra");
    expect(el.style.maxWidth).toBe("200px");
    expect(el.style.getPropertyValue("--_lines")).toBe("2");
  });
});
