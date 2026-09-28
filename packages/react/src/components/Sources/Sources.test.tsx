import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Citation, Source, Sources } from "./Sources";

describe("Sources", () => {
  it("is a labelled section with a heading and a list of links", () => {
    render(
      <Sources headingLevel={4}>
        <Source number={1} title="React docs" description="react.dev" href="https://react.dev" />
      </Sources>
    );
    expect(screen.getByRole("region", { name: "Sources" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 4 })).toHaveTextContent("Sources");
    expect(screen.getByRole("link")).toHaveAccessibleName("React docs react.dev");
    expect(screen.getByRole("listitem")).toHaveAttribute("id", "source-1");
  });

  it("names a citation by its number", () => {
    render(<Citation number={2} href="#source-2" />);
    expect(screen.getByRole("link", { name: "Source 2" })).toHaveAttribute("href", "#source-2");
  });
});
