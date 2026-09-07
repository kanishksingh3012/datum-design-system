import { useState } from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TagInput } from "./TagInput";

function Harness({ initial = [] as string[] }) {
  const [tags, setTags] = useState<string[]>(initial);
  return <TagInput label="Skills" value={tags} onChange={setTags} />;
}

describe("TagInput", () => {
  it("commits freeform text into a discrete, removable tag on Enter", async () => {
    const user = userEvent.setup();
    render(<Harness />);
    const input = screen.getByLabelText("Skills");
    await user.type(input, "React{Enter}");
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(input).toHaveValue("");
  });

  it("removes a tag when its remove button is clicked", async () => {
    const user = userEvent.setup();
    render(<Harness initial={["React", "TypeScript"]} />);
    await user.click(screen.getByRole("button", { name: "Remove React" }));
    expect(screen.queryByText("React")).not.toBeInTheDocument();
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
  });

  it("removes the last tag on Backspace from an empty input", async () => {
    const user = userEvent.setup();
    render(<Harness initial={["React", "TypeScript"]} />);
    const input = screen.getByLabelText("Skills");
    input.focus();
    await user.keyboard("{Backspace}");
    expect(screen.queryByText("TypeScript")).not.toBeInTheDocument();
    expect(screen.getByText("React")).toBeInTheDocument();
  });

  it("does not commit a duplicate tag", async () => {
    const user = userEvent.setup();
    render(<Harness initial={["React"]} />);
    await user.type(screen.getByLabelText("Skills"), "React{Enter}");
    expect(screen.getAllByText("React")).toHaveLength(1);
  });
});
