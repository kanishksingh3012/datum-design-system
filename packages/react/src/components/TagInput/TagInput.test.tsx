import { describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TagInput, type TagInputProps } from "./TagInput";

const Topics = (props: Partial<TagInputProps>) => <TagInput label="Topics" {...props} />;
const input = () => screen.getByRole("textbox", { name: "Topics" });
const tags = () => screen.queryAllByRole("row").map((r) => within(r).getByRole("gridcell").firstChild?.textContent);

describe("TagInput", () => {
  it("labels the tag group and the input, size md", () => {
    render(<Topics defaultValue={["design"]} helpText="Press Enter to add." />);
    expect(screen.getByRole("grid", { name: "Topics" })).toBeInTheDocument();
    expect(input()).toHaveAccessibleDescription("Press Enter to add.");
    expect(input().closest("[data-control]")).toHaveAttribute("data-size", "md");
  });

  it("adds tags with Enter and comma, trimmed and without duplicates", async () => {
    const onValueChange = vi.fn();
    render(<Topics onValueChange={onValueChange} />);
    await userEvent.type(input(), " react {Enter}aria,React{Enter}");
    expect(tags()).toEqual(["react", "aria"]);
    expect(onValueChange).toHaveBeenLastCalledWith(["react", "aria"]);
    expect(input()).toHaveValue("");
  });

  it("removes the last tag with Backspace in an empty input", async () => {
    render(<Topics defaultValue={["a", "b", "c"]} />);
    await userEvent.click(input());
    await userEvent.keyboard("{Backspace}");
    expect(tags()).toEqual(["a", "b"]);
    await userEvent.type(input(), "x{Backspace}");
    expect(tags()).toEqual(["a", "b"]);
  });

  it("removes a tag with its button, and moves between tags with arrows", async () => {
    render(<Topics defaultValue={["a", "b", "c"]} />);
    await userEvent.click(screen.getAllByRole("button", { name: /Remove/ })[1]);
    expect(tags()).toEqual(["a", "c"]);
    await userEvent.click(input());
    await userEvent.keyboard("{ArrowLeft}");
    expect(screen.getAllByRole("row")[1]).toHaveFocus();
    await userEvent.keyboard("{ArrowLeft}");
    expect(screen.getAllByRole("row")[0]).toHaveFocus();
    await userEvent.keyboard("{Delete}");
    expect(tags()).toEqual(["c"]);
  });

  it("stops at maxTags and shows a counter", async () => {
    render(<Topics defaultValue={["a", "b"]} maxTags={2} />);
    expect(screen.getByText("2 / 2")).toBeInTheDocument();
    expect(input()).toHaveAttribute("readonly");
    await userEvent.type(input(), "c{Enter}");
    expect(tags()).toEqual(["a", "b"]);
  });

  it("is controlled, invalid, read-only or disabled", async () => {
    const { rerender } = render(<Topics value={["a"]} errorText="Add a topic." />);
    expect(input()).toHaveAttribute("aria-invalid", "true");
    expect(input()).toHaveAccessibleDescription("Add a topic.");
    await userEvent.type(input(), "b{Enter}");
    expect(tags()).toEqual(["a"]);
    rerender(<Topics value={["a"]} readOnly />);
    expect(screen.queryByRole("button", { name: /Remove/ })).not.toBeInTheDocument();
    rerender(<Topics value={["a"]} disabled />);
    expect(input()).toBeDisabled();
  });
});
