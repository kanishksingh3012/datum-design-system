import { describe, expect, it } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Avatar } from "./Avatar";

describe("Avatar", () => {
  it("renders initials when there is no src", () => {
    render(<Avatar name="Jane Doe" initials="JD" />);
    expect(screen.getByRole("img", { name: "Jane Doe" })).toHaveTextContent("JD");
  });

  it("renders a real img with the person's name as alt text when src is set", () => {
    render(<Avatar name="Jane Doe" initials="JD" src="/jane.png" />);
    const img = screen.getByRole("img", { name: "Jane Doe" });
    expect(img.tagName).toBe("IMG");
    expect(img).toHaveAttribute("src", "/jane.png");
  });

  it("falls back to initials if the image fails to load", () => {
    render(<Avatar name="Jane Doe" initials="JD" src="/broken.png" />);
    fireEvent.error(screen.getByRole("img", { name: "Jane Doe" }));
    expect(screen.getByText("JD")).toBeInTheDocument();
  });
});
