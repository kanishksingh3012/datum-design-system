import type { ReactNode } from "react";
import {
  Button,
  ButtonGroup,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  DropdownMenu,
  Link,
  Sheet,
  Tooltip,
} from "@datum-design/react";
import { AlignCenter, AlignLeft, AlignRight, Copy, Pencil, Plus, Trash2 } from "lucide-react";

const intents = ["accent", "neutral", "danger"] as const;
const appearances = ["solid", "soft", "outline", "ghost"] as const;
const sizes = ["sm", "md", "lg"] as const;
const noop = () => {};

/** Every state the combo checker renders, keyed by component name. */
export const fixtures: Record<string, () => ReactNode> = {
  Button: () => (
    <>
      {intents.map((intent) =>
        appearances.map((appearance) => (
          <div className="row" key={`${intent}-${appearance}`}>
            {sizes.map((size) => (
              <Button key={size} intent={intent} appearance={appearance} size={size}>
                {`${intent} ${appearance} ${size}`}
              </Button>
            ))}
            <Button intent={intent} appearance={appearance} iconOnly label={`${intent} ${appearance} icon`}>
              <Plus />
            </Button>
            <Button intent={intent} appearance={appearance} loading>
              Loading
            </Button>
            <Button intent={intent} appearance={appearance} pressed={false} onPressedChange={noop}>
              Off
            </Button>
            <Button intent={intent} appearance={appearance} pressed onPressedChange={noop}>
              On
            </Button>
            <Button intent={intent} appearance={appearance} disabled>
              Disabled
            </Button>
          </div>
        ))
      )}
      <div className="row">
        <Button floating iconOnly label="Floating icon">
          <Plus />
        </Button>
        <Button floating prefix={<Plus />}>
          Floating
        </Button>
        <Button intent="neutral" floating>
          Floating ink
        </Button>
      </div>
      <div className="row">
        <Button fullWidth>Full width</Button>
      </div>
      <div className="row">
        <Button render={(props) => <a href="#check" {...props} />}>Rendered as link</Button>
      </div>
    </>
  ),
  ButtonGroup: () => (
    <>
      {(["horizontal", "vertical", "on-surface"] as const).map((variant) => {
        const orientation = variant === "vertical" ? "vertical" : "horizontal";
        return (
        <div className="row" key={variant} style={variant === "on-surface" ? { background: "var(--color-bg-surface)" } : undefined}>
          {sizes.map((size) => (
            <ButtonGroup key={size} attached orientation={orientation} size={size} aria-label={`attached ${orientation} ${size}`}>
              <Button pressed={false} onPressedChange={noop}>{`Day ${size}`}</Button>
              <Button pressed onPressedChange={noop}>{`Week ${size}`}</Button>
              <Button pressed={false} onPressedChange={noop} disabled>
                Month
              </Button>
            </ButtonGroup>
          ))}
          <ButtonGroup attached orientation={orientation} aria-label="attached icons">
            <Button iconOnly label="Left" pressed onPressedChange={noop}>
              <AlignLeft />
            </Button>
            <Button iconOnly label="Center" pressed={false} onPressedChange={noop}>
              <AlignCenter />
            </Button>
            <Button iconOnly label="Right" pressed={false} onPressedChange={noop}>
              <AlignRight />
            </Button>
          </ButtonGroup>
          {appearances.map((appearance) => (
            <ButtonGroup key={appearance} orientation={orientation} intent="neutral" appearance={appearance}>
              <Button>{`Spaced ${appearance}`}</Button>
              <Button intent="accent" appearance="solid">
                Save
              </Button>
            </ButtonGroup>
          ))}
        </div>
        );
      })}
    </>
  ),
  Link: () => (
    <>
      {([undefined, "var(--color-bg-surface)", "var(--color-bg-accentSubtle)"] as const).map((background) => (
        <div className="row" key={background ?? "page"} style={background ? { background } : undefined}>
          {(["accent", "neutral", "inherit"] as const).map((tone) =>
            (["always", "hover", "none"] as const).map((underline) => (
              <p key={`${tone}-${underline}`} style={{ margin: 0, color: "var(--color-text-secondary)" }}>
                Text with a{" "}
                <Link href="#check" tone={tone} underline={underline}>
                  {`${tone} ${underline}`}
                </Link>
              </p>
            ))
          )}
          <Link href="#check" size="sm">
            Small
          </Link>
          <Link href="#check" size="md" tone="neutral">
            Medium
          </Link>
          <Link href="https://example.com" external>
            External
          </Link>
          <Link href="#check" size="sm" underline="hover">
            Standalone sm
          </Link>
          <Link href="#check" tone="neutral" underline="none">
            Standalone
          </Link>
        </div>
      ))}
    </>
  ),
  // Overlays: one open at a time (a modal hides everything behind it), held
  // open so focusing the trigger can't close it mid-measurement.
  Dialog: () => (
    <Dialog open onOpenChange={noop} trigger={<Button>Open dialog</Button>}>
      <DialogHeader description="Supporting text in text.secondary.">Dialog title</DialogHeader>
      <DialogBody>
        Body copy with a <Link href="#check">link</Link> inside.
      </DialogBody>
      <DialogFooter>
        <Button intent="neutral" appearance="outline">Cancel</Button>
        <Button intent="danger">Delete</Button>
      </DialogFooter>
    </Dialog>
  ),
  Sheet: () => (
    <Sheet open onOpenChange={noop} trigger={<Button>Open sheet</Button>}>
      <DialogHeader description="Narrow the results.">Filters</DialogHeader>
      <DialogBody>
        <Button intent="neutral" appearance="soft">Reset</Button>
      </DialogBody>
      <DialogFooter>
        <Button fullWidth>Show results</Button>
      </DialogFooter>
    </Sheet>
  ),
  DropdownMenu: () => (
    <DropdownMenu
      open
      onOpenChange={noop}
      trigger={<Button intent="neutral" appearance="outline">Options</Button>}
      items={[
        { label: "Edit", icon: <Pencil />, shortcut: "⌘E" },
        { label: "Duplicate", icon: <Copy />, shortcut: "⌘D" },
        { label: "Archive", disabled: true },
        { type: "separator" },
        { type: "checkbox", label: "Show grid", checked: true, onCheckedChange: noop },
        { type: "checkbox", label: "Snap to grid", checked: false, onCheckedChange: noop },
        {
          type: "section",
          label: "Sort by",
          items: [
            { type: "radio", label: "Name", checked: true, onSelect: noop },
            { type: "radio", label: "Date", checked: false, onSelect: noop },
          ],
        },
        { type: "separator" },
        { label: "Delete", intent: "danger", icon: <Trash2 />, shortcut: "⌫" },
      ]}
    />
  ),
  Tooltip: () => (
    <div className="row" style={{ padding: "48px 0" }}>
      <Tooltip content="Top tooltip" open onOpenChange={noop}>
        <Button intent="neutral" appearance="outline">Top</Button>
      </Tooltip>
      <Tooltip content="Bottom tooltip that wraps onto a second line when it runs long" placement="bottom" open onOpenChange={noop}>
        <Button intent="neutral" appearance="outline">Bottom</Button>
      </Tooltip>
    </div>
  ),
};
