import { useState } from "react";
import { Button, ButtonGroup, Link, Message, ToastIntent, ToastPosition, Toaster, toast } from "@datum-design/react";
import { A11y, Demo, PropRow, PropsTable, Usage } from "./kit";

const toastExamples: [ToastIntent, string, string][] = [
  ["neutral", "Link copied", "Anyone with the link can view."],
  ["success", "Invoice sent", "Ada will get it in a minute."],
  ["warning", "Storage almost full", "You've used 90% of your plan."],
  ["danger", "Upload failed", "The file is larger than 25 MB."],
  ["info", "New version available", "Reload to update."],
];
const toastProps: PropRow[] = [
  ["toast(options)", "→ key", "—", "Adds a toast to the queue. toast.close(key) removes it."],
  ["intent", "neutral | success | danger | warning | info", "neutral", "Every intent but neutral shows its icon on the same raised surface."],
  ["title / description", "ReactNode", "—", "Name and description of the toast (aria-labelledby / describedby)."],
  ["action", "{ label, onAction }", "—", "One follow-up, e.g. Undo. Running it also closes the toast."],
  ["duration", "ms | null", "5000", "Pauses while the pointer or focus is on any toast. null stays until closed."],
  ["position", "top-center | top-end | bottom-center | bottom-end", "bottom-end", "On <Toaster>. The newest toast is nearest the edge."],
];

export default function ToastDoc() {
  const [pressed, setPressed] = useState(false);
  const [toastPosition, setToastPosition] = useState<ToastPosition>("bottom-end");
  return (
    <>
    <Toaster position={toastPosition} />
    <section className="component-doc" id="toast">
      <h1>Toast</h1>
      <p className="dek">A brief, non-blocking notification about something that just happened. Call <span className="prop-values">toast()</span> from anywhere; one <span className="prop-values">&lt;Toaster /&gt;</span> near the app root shows the stack. Behaviour comes from React Aria: the stack is a landmark (reachable with F6), each toast is announced, and timers pause while the pointer or keyboard focus is on any toast.</p>

      <Demo box="example">
        <Button onClick={() => toast({ intent: "success", title: "Invoice sent", description: "Ada will get it in a minute." })}>Send invoice</Button>
        <Button intent="neutral" appearance="outline" onClick={() => toast({ title: "Message archived", action: { label: "Undo", onAction: () => toast({ title: "Message restored" }) } })}>Archive with undo</Button>
      </Demo>

      <div className="doc-section">
        <h2>Intent</h2>
        <p className="lead">Every toast is the same raised surface (<b>bg.surfaceRaised</b>, <b>elevation.overlay</b>, <b>radius.card</b>) with <b>text.primary</b>; the intent shows as the icon in its text color. <b>neutral</b> has no icon. Each closes after 5 seconds unless <b>duration</b> says otherwise.</p>
        <Demo>
          {toastExamples.map(([intent, title, description]) => (
            <Button key={intent} size="sm" intent="neutral" appearance="outline" onClick={() => toast({ intent, title, description })}>{intent}</Button>
          ))}
          <Button size="sm" intent="neutral" appearance="outline" onClick={() => toast({ intent: "danger", title: "Sync paused", description: "Stays until you close it.", duration: null })}>duration: null</Button>
        </Demo>
      </div>

      <div className="doc-section">
        <h2>Position</h2>
        <p className="lead">Set on the Toaster. The newest toast sits nearest the edge and slides in from it (<b>motion.normal</b>; no movement under reduced motion). Up to five are visible; the rest wait their turn.</p>
        <Demo>
          <ButtonGroup attached size="sm" intent="neutral">
            {(["top-center", "top-end", "bottom-center", "bottom-end"] as const).map((p) => (
              <Button key={p} pressed={toastPosition === p} onPressedChange={() => setToastPosition(p)}>{p}</Button>
            ))}
          </ButtonGroup>
          <Button size="sm" onClick={() => toast({ title: `Now at ${toastPosition}` })}>Show a toast</Button>
        </Demo>
      </div>

      <div className="doc-section">
        <h2>Properties</h2>
        <PropsTable rows={toastProps} />
      </div>

      <div className="doc-section">
        <h2>Usage guidelines</h2>
        <Usage
          dos={["Confirm what just happened in a few words.", "Offer Undo for destructive actions instead of a confirmation dialog.", "Use duration: null when the toast carries something the person must act on."]}
          donts={["Put the only copy of important information in a toast — it goes away.", "Fire several at once for one action."]}
        />
      </div>
      <A11y items={[
          ["F6", "Jumps to the toast region, a landmark."],
          ["Tab", "Moves through a toast's action and close buttons."],
          ["Timers", "Pause while the pointer or keyboard focus is on any toast."],
          ["Announcements", "Each new toast is announced by screen readers."],
        ]} />
    </section>

    </>
  );
}
