import { Card, CardBody, Skeleton, Stack, Text } from "@datum-design/react";
import { A11y, Demo, PropRow, PropsTable, Usage } from "./kit";

const skeletonProps: PropRow[] = [
  ["shape", "text | rect | circle", "text", "A text line / a block such as an image / an avatar."],
  ["lines", "number", "1", "Text only; the last of several lines is shorter."],
  ["animated", "boolean", "true", "Pulses the fill; always off under reduced motion."],
  ["width / height", "CSS length", "100% / 120px", "Width is also a circle's diameter (default 40px); height is for rect."],
];

export default function SkeletonDoc() {
  return (
    <>
    <section className="component-doc" id="skeleton">
      <h1>Skeleton</h1>
      <p className="dek">A placeholder in the shape of the content that is on its way, so the layout doesn't jump when it arrives. Skeletons are hidden from assistive tech; mark the loading region with <span className="prop-values">aria-busy</span>.</p>

      <Demo box="example" style={{ display: "block" }}>
        <Stack direction="horizontal" gap="md" align="start" style={{ maxWidth: 420, margin: "0 auto" }} aria-busy="true">
          <Skeleton shape="circle" />
          <Stack gap="sm" style={{ flex: 1 }}>
            <Skeleton width="40%" />
            <Skeleton lines={3} />
          </Stack>
        </Stack>
      </Demo>

      <div className="doc-section">
        <h2>Shape</h2>
        <p className="lead"><b>text</b> draws one bar per line, spaced like body text, with a shorter last line. <b>rect</b> is a block with <b>radius.card</b>, for images and media. <b>circle</b> is an avatar. The fill is <b>bg.tertiary</b>, so it shows on the page and on surfaces. It pulses by fading the fill toward the text color; <b>animated</b> turns that off, and reduced motion always does.</p>
        <Demo className="demo-on-page">
          <Card style={{ width: 280 }}>
            <CardBody>
              <Stack gap="md">
                <Skeleton shape="rect" height={140} />
                <Stack direction="horizontal" gap="sm" align="center">
                  <Skeleton shape="circle" width={32} />
                  <Skeleton width="50%" />
                </Stack>
                <Skeleton lines={2} animated={false} />
              </Stack>
            </CardBody>
          </Card>
        </Demo>
      </div>

      <div className="doc-section">
        <h2>Properties</h2>
        <PropsTable rows={skeletonProps} />
      </div>

      <div className="doc-section">
        <h2>Usage guidelines</h2>
        <Usage
          dos={["Match the real layout closely, so nothing moves when content arrives.", "Set aria-busy on the region that is loading."]}
          donts={["Use a skeleton for a wait under a few hundred milliseconds.", "Mix skeletons and spinners for the same content."]}
        />
      </div>
      <A11y items={[
          ["Semantics", "aria-hidden: placeholders are silent. Mark the loading region aria-busy, or show a Spinner with a label, so the wait is announced."],
        ]} />
    </section>
    </>
  );
}
