import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { TodoList, TodoItem } from "./TodoList";

describe("TodoList", () => {
  it("renders as a real <details>/<summary> disclosure wrapping a real <ol>", () => {
    render(
      <TodoList title="Migration plan">
        <TodoItem status="done">Read the spec</TodoItem>
        <TodoItem status="active">Write the tests</TodoItem>
      </TodoList>
    );
    expect(screen.getByText("Migration plan").closest("details")).toBeInTheDocument();
    expect(screen.getByText("Read the spec").closest("ol")).toBeInTheDocument();
  });

  it("derives the completion count from direct TodoItem children", () => {
    render(
      <TodoList title="Migration plan">
        <TodoItem status="done">One</TodoItem>
        <TodoItem status="done">Two</TodoItem>
        <TodoItem status="pending">Three</TodoItem>
      </TodoList>
    );
    expect(screen.getByText("2 of 3 done")).toBeInTheDocument();
  });

  it("carries each item's status as real, visually hidden text - never a mark alone", () => {
    render(
      <TodoList>
        <TodoItem status="error">Deploy</TodoItem>
      </TodoList>
    );
    expect(screen.getByText("Deploy").closest("li")).toHaveTextContent("Deploy (Error)");
  });
});
