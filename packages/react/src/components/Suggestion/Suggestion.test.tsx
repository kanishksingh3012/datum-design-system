import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Suggestion, SuggestionItem } from "./Suggestion";

describe("Suggestion", () => {
  it("is a labelled list of buttons", async () => {
    const onClick = vi.fn();
    render(
      <Suggestion label="Suggested prompts">
        <SuggestionItem onClick={onClick}>Summarise</SuggestionItem>
        <SuggestionItem>Translate</SuggestionItem>
      </Suggestion>
    );
    expect(screen.getByRole("list", { name: "Suggested prompts" })).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
    await userEvent.click(screen.getByRole("button", { name: "Summarise" }));
    expect(onClick).toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "Translate" })).toHaveAttribute("type", "button");
  });
});
