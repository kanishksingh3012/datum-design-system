import { useState } from "react";
import { Avatar, AvatarGroup, Stack, Text } from "@datum-design/react";
import { A11y, Demo, PropRow, PropsTable, Usage } from "./kit";

const people = ["Ada Lovelace", "Grace Hopper", "Alan Turing", "Katherine Johnson", "Edsger Dijkstra", "Barbara Liskov"];
const avatarProps: PropRow[] = [
  ["size", "xs | sm | md | lg | xl", "md", "24 / 32 / 40 / 48 / 64px."],
  ["shape", "circle | square", "circle", "Square uses radius.subtle."],
  ["src / name", "string", "—", "Falls back to initials from name, then an icon. name is the accessible name."],
  ["status", "online | away | busy | offline", "—", "Presence dot; added to the accessible name."],
  ["AvatarGroup", "max, size, shape", "—", "Overlapping stack with \"+N\"."],
];

export default function AvatarDoc() {
  const [align, setAlign] = useState("Left");
  return (
    <>
    <section className="component-doc" id="avatar">
      <h1>Avatar</h1>
      <p className="dek">A person or an entity. Shows the image, falls back to initials from <span className="prop-values">name</span> when the image is missing or fails, then to an icon.</p>

      <Demo box="example">
        <Stack direction="horizontal" gap="md" align="center">
          <Avatar size="xl" name="Ada Lovelace" status="online" />
          <AvatarGroup max={3} aria-label="Project members">
            {people.map((name) => <Avatar key={name} name={name} />)}
          </AvatarGroup>
        </Stack>
      </Demo>

      <div className="doc-section">
        <h2>Sizes</h2>
        <p className="lead"><b>xs</b> 24, <b>sm</b> 32, <b>md</b> 40, <b>lg</b> 48, <b>xl</b> 64px. The initials step up a type role with each size.</p>
        <Demo>
          {(["xs", "sm", "md", "lg", "xl"] as const).map((size) => <Avatar key={size} size={size} name="Grace Hopper" />)}
        </Demo>
      </div>

      <div className="doc-section">
        <h2>Shape and fallback</h2>
        <p className="lead"><b>circle</b> for people, <b>square</b> (<b>radius.subtle</b>) for teams, companies and projects. Initials use the accent tint; with no name the avatar shows an icon and is hidden from screen readers.</p>
        <Demo>
          <Avatar size="lg" name="Ada Lovelace" />
          <Avatar size="lg" shape="square" name="Datum" />
          <Avatar size="lg" name="Broken image" src="/missing.jpg" />
          <Avatar size="lg" />
        </Demo>
      </div>

      <div className="doc-section">
        <h2>Status</h2>
        <p className="lead">A presence dot with no ring; offline is a neutral grey dot. The status is added to the accessible name, e.g. "Ada Lovelace, busy".</p>
        <Demo>
          {(["online", "away", "busy", "offline"] as const).map((status) => (
            <Stack key={status} gap="xs" align="center">
              <Avatar size="lg" name="Ada Lovelace" status={status} />
              <Text variant="caption" tone="secondary">{status}</Text>
            </Stack>
          ))}
        </Demo>
      </div>

      <div className="doc-section">
        <h2>AvatarGroup</h2>
        <p className="lead">An overlapping stack with no rings; later avatars sit on top. <b>max</b> collapses the rest into a neutral "+N" (read as "N more"); <b>size</b> and <b>shape</b> pass down to every avatar. Give the group an <b>aria-label</b>.</p>
        <Demo className="stack">
          {(["sm", "md", "lg"] as const).map((size) => (
            <AvatarGroup key={size} size={size} max={4} aria-label="Reviewers">
              {people.map((name) => <Avatar key={name} name={name} />)}
            </AvatarGroup>
          ))}
        </Demo>
      </div>

      <div className="doc-section">
        <h2>Properties</h2>
        <PropsTable rows={avatarProps} />
      </div>

      <div className="doc-section">
        <h2>Usage guidelines</h2>
        <Usage
          dos={["Always pass the real name, even with an image — it is the accessible name and the fallback.", "Use square for anything that isn't a person."]}
          donts={["Use a generic name like \"avatar\" or \"user\".", "Show status without a way to read it elsewhere when it matters."]}
        />
      </div>
      <A11y items={[
          ["label", "The accessible name (the person's name). The image and initials are decorative; without label the avatar is hidden from assistive tech."],
          ["Status", "The status dot is decorative; say the status in text when it matters."],
        ]} />
    </section>

    </>
  );
}
