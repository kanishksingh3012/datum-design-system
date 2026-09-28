import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Message, MessageList } from "./Message";
import { MessageScroller } from "../MessageScroller/MessageScroller";

describe("Message", () => {
  it("renders list items with articles and a header", () => {
    render(
      <MessageList>
        <Message author="user" name="Ada" metadata="2:41 PM">Hi</Message>
        <Message author="assistant" name="Datum" grouped>Hello</Message>
      </MessageList>
    );
    expect(screen.getAllByRole("article")).toHaveLength(2);
    expect(screen.getByText("Ada")).toBeInTheDocument();
    expect(screen.queryByText("Datum")).toBeNull();
    expect(screen.getByRole("article", { name: "Datum" })).toBeInTheDocument();
  });

  it("is busy while streaming and hides actions until done", () => {
    const { rerender } = render(<Message author="assistant" name="Datum" streaming actions={<button>Copy</button>}>Hel</Message>);
    const article = screen.getByRole("article");
    expect(article).toHaveAttribute("aria-busy", "true");
    expect(article).toHaveAttribute("aria-live", "polite");
    expect(screen.queryByRole("button")).toBeNull();
    rerender(<Message author="assistant" name="Datum" actions={<button>Copy</button>}>Hello</Message>);
    expect(article).not.toHaveAttribute("aria-busy");
    expect(screen.getByRole("button", { name: "Copy" })).toBeInTheDocument();
  });

  it("leaves announcing to the log inside a MessageScroller", () => {
    render(
      <MessageScroller>
        <MessageList>
          <Message author="assistant" name="Datum" streaming>Hel</Message>
        </MessageList>
      </MessageScroller>
    );
    expect(screen.getByRole("article")).not.toHaveAttribute("aria-live");
    expect(screen.getByRole("article")).toHaveAttribute("aria-busy", "true");
  });
});
