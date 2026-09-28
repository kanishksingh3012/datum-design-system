import { useParams } from "react-router-dom";
import { Badge, Heading, Link, Text } from "@datum-design/react";
import { components } from "./nav";
import { docPages } from "./docs";

export function Placeholder({ title, children }: { title: string; children?: string }) {
  return (
    <div className="site-prose">
      <Heading level={1}>{title}</Heading>
      <Text as="p" tone="secondary">{children ?? "This page is being written."}</Text>
    </div>
  );
}

export function ComponentPage() {
  const { slug = "" } = useParams();
  const meta = components.find((c) => c.slug === slug);
  const Doc = docPages[slug];
  if (Doc) return <Doc />;
  if (!meta) {
    return (
      <Placeholder title="Not found">
        No component by that name.
      </Placeholder>
    );
  }
  return (
    <div className="site-prose">
      <Text variant="overline" tone="secondary">{meta.group}</Text>
      <Heading level={1}>{meta.name}</Heading>
      <Text as="p" variant="body-lg" tone="secondary">{meta.why}</Text>
      <Badge intent="neutral">Docs coming soon</Badge>
      <Text as="p" tone="secondary">
        Until this page moves over, the full reference lives in the <Link href="/gallery">legacy gallery</Link>.
      </Text>
    </div>
  );
}
