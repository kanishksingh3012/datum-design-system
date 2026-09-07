import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FileUpload } from "./FileUpload";

function makeFile(name: string, sizeBytes: number) {
  const file = new File(["x".repeat(sizeBytes)], name, { type: "text/plain" });
  return file;
}

describe("FileUpload", () => {
  it("renders a real <input type=file> behind a labeled dropzone", () => {
    render(<FileUpload label="Drop files here" />);
    expect(screen.getByLabelText("Drop files here")).toHaveAttribute("type", "file");
  });

  it("calls onFilesSelected with picked files", async () => {
    const user = userEvent.setup();
    const onFilesSelected = vi.fn();
    render(<FileUpload label="Drop files here" onFilesSelected={onFilesSelected} />);
    const file = makeFile("photo.png", 10);
    await user.upload(screen.getByLabelText("Drop files here"), file);
    expect(onFilesSelected).toHaveBeenCalledWith([file]);
  });

  it("fires onError with type=max-size when a file exceeds the limit", async () => {
    const user = userEvent.setup();
    const onError = vi.fn();
    const onFilesSelected = vi.fn();
    render(
      <FileUpload label="Drop files here" maxSizeBytes={5} onError={onError} onFilesSelected={onFilesSelected} />
    );
    const file = makeFile("big.png", 100);
    await user.upload(screen.getByLabelText("Drop files here"), file);
    expect(onError).toHaveBeenCalledWith({ type: "max-size" });
    expect(onFilesSelected).not.toHaveBeenCalled();
  });
});
