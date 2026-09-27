import { describe, expect, it, vi } from "vitest";
import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Card, CardBody, CardFooter, CardHeader, CardMedia } from "./Card";

describe("Card", () => {
  it("renders a plain div with appearance=elevated and padding=md by default", () => {
    render(<Card data-testid="card">Content</Card>);
    const card = screen.getByTestId("card");
    expect(card.tagName).toBe("DIV");
    expect(card).toHaveAttribute("data-appearance", "elevated");
    expect(card).toHaveAttribute("data-padding", "md");
    expect(card).not.toHaveAttribute("data-interactive");
  });

  it("reflects every appearance and padding via data attributes", () => {
    for (const appearance of ["elevated", "outline", "soft"] as const) {
      for (const padding of ["sm", "md", "lg"] as const) {
        render(<Card appearance={appearance} padding={padding} data-testid={`${appearance}-${padding}`} />);
        const card = screen.getByTestId(`${appearance}-${padding}`);
        expect(card).toHaveAttribute("data-appearance", appearance);
        expect(card).toHaveAttribute("data-padding", padding);
      }
    }
  });

  it("becomes a link when interactive with an href", () => {
    render(<Card interactive href="/pricing">Pricing</Card>);
    const link = screen.getByRole("link", { name: "Pricing" });
    expect(link).toHaveAttribute("href", "/pricing");
    expect(link).toHaveAttribute("data-interactive", "true");
  });

  it("becomes a button when interactive without an href, and handles clicks", async () => {
    const onClick = vi.fn();
    render(<Card interactive onClick={onClick}>Open</Card>);
    const button = screen.getByRole("button", { name: "Open" });
    expect(button).toHaveAttribute("type", "button");
    await userEvent.click(button);
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("renders through render() when interactive, with the computed props", () => {
    render(<Card interactive href="/docs" render={(props) => <a {...props} data-router="" />}>Docs</Card>);
    const link = screen.getByRole("link", { name: "Docs" });
    expect(link).toHaveAttribute("data-router");
    expect(link).toHaveAttribute("href", "/docs");
  });

  it("renders its slots in order", () => {
    render(
      <Card>
        <CardMedia data-testid="media"><img src="x.jpg" alt="" /></CardMedia>
        <CardHeader data-testid="header">Title</CardHeader>
        <CardBody data-testid="body">Body</CardBody>
        <CardFooter data-testid="footer">Footer</CardFooter>
      </Card>
    );
    const order = ["media", "header", "body", "footer"].map((id) => screen.getByTestId(id));
    order.slice(1).forEach((el, i) => {
      expect(order[i].compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    });
  });

  it("forwards its ref and merges className", () => {
    const ref = createRef<HTMLElement>();
    render(<Card ref={ref} className="custom" data-testid="card" />);
    expect(ref.current).toBe(screen.getByTestId("card"));
    expect(ref.current?.className).toContain("custom");
  });
});
