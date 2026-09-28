import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { TodoItem, TodoList } from "./TodoList";

describe("TodoList", () => {
  it("counts done items and is open by default", () => {
    render(
      <TodoList>
        <TodoItem status="done">Read</TodoItem>
        <TodoItem status="active">Write</TodoItem>
        <TodoItem>Ship</TodoItem>
      </TodoList>
    );
    expect(screen.getByRole("button")).toHaveTextContent("1 of 3 done");
    expect(screen.getByRole("button")).toHaveAttribute("aria-expanded", "true");
  });

  it("says each item's state in words", () => {
    render(
      <TodoList>
        <TodoItem status="error" metadata="Timed out">Deploy</TodoItem>
      </TodoList>
    );
    expect(screen.getByRole("listitem")).toHaveTextContent("Deploy (failed)Timed out");
  });
});
