import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { MessageList, Message, MessageBubble } from "./Message";

describe("Message", () => {
  it("renders a real <ol> of <li> wrapping <article>, so a screen reader can jump message to message", () => {
    render(
      <MessageList>
        <Message author="user" name="You">
          Hello
        </Message>
        <Message author="assistant" name="Datum">
          Hi there
        </Message>
      </MessageList>
    );
    const list = screen.getByRole("list");
    expect(list.tagName).toBe("OL");
    expect(screen.getByText("Hello").closest("article")).toBeInTheDocument();
  });

  it("omits the header (name/avatar/metadata) when grouped with the previous message", () => {
    render(
      <MessageList>
        <Message author="user" name="You" metadata="2:41 PM">
          First
        </Message>
        <Message author="user" name="You" metadata="2:41 PM" grouped>
          Second
        </Message>
      </MessageList>
    );
    expect(screen.getAllByText("You")).toHaveLength(1);
  });

  it("only applies the enter animation class when animateOnMount is true", () => {
    const { rerender } = render(
      <MessageList>
        <Message author="assistant" name="Datum">
          Existing message
        </Message>
      </MessageList>
    );
    const withoutFlag = screen.getByText("Existing message").closest("article")!;
    expect(withoutFlag.className).not.toMatch(/animateOnMount/);

    rerender(
      <MessageList>
        <Message author="assistant" name="Datum" animateOnMount>
          New message
        </Message>
      </MessageList>
    );
    const withFlag = screen.getByText("New message").closest("article")!;
    expect(withFlag.className).toMatch(/animateOnMount/);
  });
});

describe("MessageBubble", () => {
  it("renders plain content by default", () => {
    render(<MessageBubble>Plain reply</MessageBubble>);
    expect(screen.getByText("Plain reply")).toBeInTheDocument();
    expect(screen.queryByRole("group")).not.toBeInTheDocument();
  });

  it("renders as a real, operable <details> when expandable, not a max-height clamp", () => {
    render(
      <MessageBubble expandable expandLabel="Show full response">
        Long content
      </MessageBubble>
    );
    const details = screen.getByText("Long content").closest("details")!;
    expect(details).not.toHaveAttribute("open");
    expect(screen.getByText("Show full response").tagName).toBe("SUMMARY");
  });
});
