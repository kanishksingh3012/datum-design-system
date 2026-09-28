import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FileUpload, acceptsFile } from "./FileUpload";

const file = (name: string, type: string, size = 10) => new File(["x".repeat(size)], name, { type });
const input = () => document.querySelector('input[type="file"]') as HTMLInputElement;

describe("FileUpload", () => {
  it("labels its button with the field and passes accept, multiple and name to the input", () => {
    render(<FileUpload label="Attachments" multiple accept="image/*,.pdf" name="files" helpText="Up to 3." />);
    const button = screen.getByRole("button", { name: "Choose files Attachments" });
    expect(button).toHaveAccessibleDescription("Up to 3.");
    expect(input()).toHaveAttribute("accept", "image/*,.pdf");
    expect(input()).toHaveAttribute("name", "files");
    expect(input()).toHaveAttribute("tabindex", "-1");
  });

  it("lists chosen files and removes them", async () => {
    const onValueChange = vi.fn();
    render(<FileUpload label="Attachments" multiple onValueChange={onValueChange} />);
    await userEvent.upload(input(), [file("a.png", "image/png", 2048), file("b.pdf", "application/pdf")]);
    expect(onValueChange).toHaveBeenLastCalledWith([expect.objectContaining({ name: "a.png" }), expect.objectContaining({ name: "b.pdf" })]);
    expect(screen.getByRole("list", { name: "Attachments: chosen files" })).toHaveTextContent("a.png");
    expect(screen.getByText("2 kB")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Remove a.png" }));
    expect(onValueChange).toHaveBeenLastCalledWith([expect.objectContaining({ name: "b.pdf" })]);
    expect(screen.getByRole("button", { name: /Choose files/ })).toHaveFocus();
  });

  it("turns away files by type, size and count, with a message and onReject", async () => {
    const onReject = vi.fn();
    render(<FileUpload label="Photo" accept="image/*" maxSize={100} onReject={onReject} />);
    fireEvent.change(input(), { target: { files: [file("notes.txt", "text/plain")] } });
    expect(onReject).toHaveBeenLastCalledWith([expect.objectContaining({ reason: "type" })]);
    expect(screen.getByText("“notes.txt” isn’t an accepted file type.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Choose file/ })).toHaveAttribute("aria-invalid", "true");
    fireEvent.change(input(), { target: { files: [file("big.png", "image/png", 500)] } });
    expect(onReject).toHaveBeenLastCalledWith([expect.objectContaining({ reason: "size" })]);
    expect(screen.getByText(/is larger than 100 byte/)).toBeInTheDocument();
  });

  it("caps the list at maxFiles", () => {
    const onReject = vi.fn();
    render(<FileUpload label="Photos" multiple maxFiles={1} onReject={onReject} />);
    fireEvent.change(input(), { target: { files: [file("a.png", "image/png"), file("b.png", "image/png")] } });
    expect(onReject).toHaveBeenLastCalledWith([expect.objectContaining({ reason: "count" })]);
    expect(screen.getByText("You can add up to 1 file.")).toBeInTheDocument();
  });

  it("is controlled by value, shows errorText, and disables", () => {
    const { rerender } = render(<FileUpload label="Resume" value={[file("cv.pdf", "application/pdf")]} errorText="Upload failed." />);
    expect(screen.getByText("cv.pdf")).toBeInTheDocument();
    expect(screen.getByText("Upload failed.")).toBeInTheDocument();
    rerender(<FileUpload label="Resume" value={[]} disabled />);
    expect(screen.queryByText("cv.pdf")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Choose file/ })).toBeDisabled();
    expect(input()).toBeDisabled();
  });

  it("matches accept rules", () => {
    expect(acceptsFile(file("a.PDF", ""), ".pdf")).toBe(true);
    expect(acceptsFile(file("a.png", "image/png"), "image/*")).toBe(true);
    expect(acceptsFile(file("a.png", "image/png"), "application/pdf")).toBe(false);
  });
});

describe("FileUpload drop", () => {
  it("takes dropped files through useDrop", async () => {
    const onValueChange = vi.fn();
    render(<FileUpload label="Photos" multiple onValueChange={onValueChange} />);
    const zone = screen.getByRole("button", { name: /Choose files/ }).closest(`[data-size="md"]`)!;
    const dropped = file("drop.png", "image/png");
    const dataTransfer = {
      types: ["Files"],
      items: [{ kind: "file", type: "image/png", getAsFile: () => dropped }],
      files: [dropped],
      effectAllowed: "all",
      dropEffect: "none",
      getData: () => "",
    };
    fireEvent.dragEnter(zone, { dataTransfer, clientX: 1, clientY: 1 });
    expect(zone).toHaveAttribute("data-drop-target", "true");
    fireEvent.dragOver(zone, { dataTransfer, clientX: 2, clientY: 2 });
    fireEvent.drop(zone, { dataTransfer, clientX: 2, clientY: 2 });
    await waitFor(() => expect(onValueChange).toHaveBeenLastCalledWith([dropped]));
  });
});
