import { describe, expect, it } from "vitest";
import { createRef } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { Avatar, AvatarGroup } from "./Avatar";

describe("Avatar", () => {
  it("defaults to size=md and shape=circle", () => {
    render(<Avatar name="Ada Lovelace" />);
    const avatar = screen.getByRole("img", { name: "Ada Lovelace" });
    expect(avatar).toHaveAttribute("data-size", "md");
    expect(avatar).toHaveAttribute("data-shape", "circle");
  });

  it("shows the image, named by the avatar rather than the img", () => {
    const { container } = render(<Avatar name="Ada Lovelace" src="/ada.jpg" />);
    expect(screen.getByRole("img", { name: "Ada Lovelace" })).toBeInTheDocument();
    expect(container.querySelector("img")).toHaveAttribute("alt", "");
  });

  it("falls back to initials when the image fails, then to an icon without a name", () => {
    const { container, rerender } = render(<Avatar name="Ada Lovelace" src="/broken.jpg" />);
    fireEvent.error(container.querySelector("img")!);
    const avatar = screen.getByRole("img", { name: "Ada Lovelace" });
    expect(avatar).toHaveAttribute("data-fallback", "initials");
    expect(avatar).toHaveTextContent("AL");

    rerender(<Avatar />);
    const icon = container.firstElementChild!;
    expect(icon).toHaveAttribute("data-fallback", "icon");
    expect(icon).toHaveAttribute("aria-hidden", "true");
    expect(icon.querySelector("svg")).toBeInTheDocument();
  });

  it("uses one initial for a one-word name", () => {
    render(<Avatar name="datum" />);
    expect(screen.getByRole("img", { name: "datum" })).toHaveTextContent(/^D$/);
  });

  it("adds the presence status to the accessible name", () => {
    render(<Avatar name="Ada Lovelace" status="away" size="xl" shape="square" />);
    const avatar = screen.getByRole("img", { name: "Ada Lovelace, away" });
    expect(avatar).toHaveAttribute("data-status", "away");
    expect(avatar).toHaveAttribute("data-size", "xl");
    expect(avatar).toHaveAttribute("data-shape", "square");
  });

  it("forwards its ref and merges className", () => {
    const ref = createRef<HTMLSpanElement>();
    render(<Avatar ref={ref} name="Ada" className="custom" />);
    expect(ref.current).toBe(screen.getByRole("img", { name: "Ada" }));
    expect(ref.current?.className).toContain("custom");
  });
});

describe("AvatarGroup", () => {
  const people = ["Ada Lovelace", "Grace Hopper", "Alan Turing", "Katherine Johnson", "Edsger Dijkstra"];

  it("shows up to max avatars and collapses the rest into +N", () => {
    render(
      <AvatarGroup max={3} aria-label="Members">
        {people.map((p) => <Avatar key={p} name={p} />)}
      </AvatarGroup>
    );
    expect(screen.getByRole("group", { name: "Members" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Alan Turing" })).toBeInTheDocument();
    expect(screen.queryByRole("img", { name: "Katherine Johnson" })).toBeNull();
    expect(screen.getByRole("img", { name: "2 more" })).toHaveTextContent("+2");
  });

  it("shows everyone when max is unset, and passes size down unless an avatar sets its own", () => {
    render(
      <AvatarGroup size="sm">
        <Avatar name="Ada Lovelace" />
        <Avatar name="Grace Hopper" size="lg" />
      </AvatarGroup>
    );
    expect(screen.getByRole("img", { name: "Ada Lovelace" })).toHaveAttribute("data-size", "sm");
    expect(screen.getByRole("img", { name: "Grace Hopper" })).toHaveAttribute("data-size", "lg");
    expect(screen.queryByRole("img", { name: /more/ })).toBeNull();
  });
});
