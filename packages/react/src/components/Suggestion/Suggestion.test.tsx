import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Suggestion, SuggestionItem } from "./Suggestion";

describe("Suggestion", () => {
  it("renders a real list of real buttons", () => {
    render(
      <Suggestion>
        <SuggestionItem>Summarize this</SuggestionItem>
        <SuggestionItem>Explain like I'm five</SuggestionItem>
      </Suggestion>
    );
    expect(screen.getByRole("list")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Summarize this" })).toBeInTheDocument();
  });

  it("fires onClick when a suggestion chip is activated", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Suggestion>
        <SuggestionItem onClick={onClick}>Summarize this</SuggestionItem>
      </Suggestion>
    );
    await user.click(screen.getByRole("button", { name: "Summarize this" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
