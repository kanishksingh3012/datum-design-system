import { FileUpload } from "@datum-design/react";
import { A11y, Demo, PropRow, PropsTable, Usage } from "./kit";

const fileUploadProps: PropRow[] = [
  ["label / helpText / errorText", "string", "—", "As every field; a turned-away file shows its reason as the error."],
  ["value / defaultValue / onValueChange", "File[]", "[]", "The chosen files."],
  ["onReject", "(rejections) => void", "—", "Files turned away, each with a reason: type, size or count."],
  ["accept", "string", "—", "As a native file input: \"image/*,.pdf\"."],
  ["multiple / maxFiles / maxSize", "boolean / number / bytes", "false", "With multiple, new files are added to the list."],
  ["hint", "string", "—", "A short line under the prompt."],
  ["size", "sm | md", "md", "A tall drop area, or one row."],
  ["disabled / required / name", "boolean / string", "—", "As every field."],
];

export default function FileUploadDoc() {
  return (
    <>
    <section className="component-doc" id="file-upload">
      <h1>File Upload</h1>
      <p className="dek">A drop area with a Choose files button, and the chosen files listed with a remove button each. Dropping runs on React Aria's <span className='prop-values'>useDrop</span>; the button opens the native dialog, so nobody has to drag. Files that break <b>accept</b>, <b>maxSize</b> or <b>maxFiles</b> are turned away with a message.</p>

      <Demo box="example" style={{ display: "block" }}>
        <FileUpload label="Attachments" multiple maxSize={5_000_000} hint="Up to 5 MB each." style={{ maxWidth: 480, margin: "0 auto" }} />
      </Demo>

      <div className="doc-section">
        <h2>Compact</h2>
        <p className="lead"><b>size='sm'</b> is one row, for forms.</p>
        <Demo className="demo-on-page">
          <FileUpload label="Resume" size="sm" accept=".pdf" hint="PDF only." style={{ maxWidth: 480 }} />
        </Demo>
      </div>

      <div className="doc-section">
        <h2>Surface and states</h2>
        <p className="lead">The drop area sits on the <b>raised</b> step (white in light) with a dashed <b>border.strong</b> edge and neutral content. Hover and drag-over turn it <b>bg.accentSubtle</b> with an accent edge; an error keeps its danger edge until a file is dragged over. File rows use the same raised fill with a border. It fills its parent's width, so size it with the layout around it.</p>
        <Demo className="demo-on-page">
          <div className="form-grid">
            <FileUpload label="With files" multiple defaultValue={[new File([new Uint8Array(248000)], "brief.pdf", { type: "application/pdf", lastModified: 0 })]} />
            <FileUpload label="With an error" multiple errorText="“scan.tiff” isn’t an accepted file type." hint="PNG or JPG, up to 5 MB." />
          </div>
        </Demo>
      </div>

      <div className="doc-section">
        <h2>Properties</h2>
        <PropsTable rows={fileUploadProps} />
      </div>

      <div className="doc-section">
        <h2>Usage guidelines</h2>
        <Usage
          dos={["Say what is accepted in hint.", "Handle onReject if you need more than the built-in message."]}
          donts={["Make dragging the only way in.", "Upload before the person has chosen to."]}
        />
      </div>
      <A11y items={[
          ["Button", "Opens the native file dialog; it's the keyboard path, so drag and drop is never required."],
          ["Drop zone", "Announces when files are dropped or rejected. Hover and drag-over change the fill and the edge, not color alone."],
        ]} />
    </section>

    </>
  );
}
