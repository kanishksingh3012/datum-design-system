import { Suspense } from "react";
import { useParams } from "react-router-dom";
import { Badge, BreadcrumbItem, Breadcrumbs, Card, Heading, Spinner, Text } from "@datum-design/react";
import { ArrowLeft, ArrowRight } from "lucide-react";
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
  if (!meta) {
    return (
      <Placeholder title="Not found">
        No component by that name.
      </Placeholder>
    );
  }
  const i = components.indexOf(meta);
  const prev = components[i - 1];
  const next = components[i + 1];
  return (
    <>
      <Breadcrumbs size="sm" className="site-crumbs">
        <BreadcrumbItem href="/docs">Docs</BreadcrumbItem>
        <BreadcrumbItem href={`/docs/components/${components.find((c) => c.group === meta.group)!.slug}`}>{meta.group}</BreadcrumbItem>
        <BreadcrumbItem current>{meta.name}</BreadcrumbItem>
      </Breadcrumbs>
      {Doc ? (
        <Suspense fallback={<Spinner label="Loading" />}><Doc /></Suspense>
      ) : (
        <div className="site-prose">
          <Heading level={1}>{meta.name}</Heading>
          <Text as="p" variant="body-lg" tone="secondary">{meta.why}</Text>
          <Badge intent="neutral">Docs coming soon</Badge>
        </div>
      )}
      <nav className="site-pager" aria-label="Previous and next component">
        {prev ? (
          <Card appearance="outline" padding="sm" interactive href={`/docs/components/${prev.slug}`}>
            <Text variant="caption" tone="secondary"><ArrowLeft aria-hidden /> Previous</Text>
            <Text weight="semibold">{prev.name}</Text>
          </Card>
        ) : <span />}
        {next && (
          <Card appearance="outline" padding="sm" interactive href={`/docs/components/${next.slug}`} className="site-pager-next">
            <Text variant="caption" tone="secondary">Next <ArrowRight aria-hidden /></Text>
            <Text weight="semibold">{next.name}</Text>
          </Card>
        )}
      </nav>
    </>
  );
}
