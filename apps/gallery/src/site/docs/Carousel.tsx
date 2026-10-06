import { useState } from "react";
import { Carousel, Text } from "@datum-design/react";
import { A11y, Demo, PropRow, PropsTable, Usage } from "./kit";

const demoSlide = (title: string, accent = false) => (
  <div style={{ padding: "var(--space-section)", minHeight: 140, background: accent ? "var(--color-bg-accentSubtle)" : "var(--color-bg-surface)" }}>
    <h3 style={{ margin: 0 }}>{title}</h3>
    <Text tone="secondary">Swipe, or use the buttons below.</Text>
  </div>
);
const demoSlides = [
  { label: "Launch", content: demoSlide("Datum 2 is out", true) },
  { label: "Themes", content: demoSlide("Two themes, four combos") },
  { label: "Forms", content: demoSlide("Forms that read the same") },
];
const carouselProps: PropRow[] = [
  ["label", "string", "—", "Names the carousel."],
  ["slides", "{ id?, label?, content }[]", "—", "Each slide's label follows “2 of 5”."],
  ["value / defaultValue / onValueChange", "number", "0", "The index of the slide shown."],
  ["autoplay", "number (ms)", "—", "Advances on its own, with a pause button; never under reduced motion."],
  ["loop", "boolean", "true", "Wraps from the last slide to the first."],
];
const people = ["Ada Lovelace", "Grace Hopper", "Alan Turing", "Katherine Johnson", "Edsger Dijkstra", "Barbara Liskov"];

export default function CarouselDoc() {
  const [section, setSection] = useState("Overview");
  return (
    <>
    <section className="component-doc" id="carousel">
      <h1>Carousel</h1>
      <p className="dek">One slide at a time with previous, next and slide buttons — the APG carousel. Slides move by transform, can be swiped, and hidden slides are inert. <b>autoplay</b> adds a pause button, pauses while a slide is hovered or keyboard focus is inside, and never runs under reduced motion.</p>

      <Demo box="example" style={{ display: "block" }}>
        <Carousel label="Featured" slides={demoSlides} style={{ maxWidth: 520, margin: "0 auto" }} />
      </Demo>

      <div className="doc-section">
        <h2>Autoplay</h2>
        <p className="lead">Rotation is opt-in. The pause button comes first in the tab order and sits at the slide's start edge; the arrows and dots stay centred. Hovering a slide or tabbing into the carousel pauses it; a mouse click on a control does not. Pressing Start rotates again whatever is hovered or focused.</p>
        <Demo className="demo-on-page">
          <Carousel label="Announcements" slides={demoSlides} autoplay={5000} style={{ maxWidth: 520 }} />
        </Demo>
      </div>

      <div className="doc-section">
        <h2>Properties</h2>
        <PropsTable rows={carouselProps} />
      </div>

      <div className="doc-section">
        <h2>Usage guidelines</h2>
        <Usage
          dos={["Give each slide a label.", "Keep every slide reachable some other way."]}
          donts={["Autoplay slides people need to read.", "Put the key message only on a later slide."]}
        />
      </div>
      <A11y items={[
          ["Tab", "Reaches the previous / next buttons, the slide buttons and slide content. Slide buttons are 44px targets on touch screens."],
          ["Swipe", "Drag or swipe past a quarter of the width to change slide; arrow keys are left to the page."],
          ["autoplay", "Rotation comes with a Stop / Start button, pauses while a slide is hovered or keyboard focus is inside, never runs under reduced motion, and silences the live region while rotating."],
          ["Slides", "Each slide is announced as \"n of total\" with its label; hidden slides are aria-hidden."],
        ]} />
    </section>
    </>
  );
}
