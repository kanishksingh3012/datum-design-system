#!/usr/bin/env python3
"""Move a section of the legacy one-page gallery into a routed doc file.

usage: migrate-section.py <Name> <slug> <src> <start>:<end> [<start>:<end> ...]
  src: App.tsx (or another file under apps/gallery/src); ranges are 1-indexed inclusive line ranges.
Copies the JSX (the legacy page keeps working until M5), swaps sample-box / example-box
divs for <Demo>, and pulls in the imports, top-level consts and useState lines it uses.
Delete this script in M5.
"""
import re, sys, pathlib

root = pathlib.Path(__file__).resolve().parents[1]
src_dir = root / "src"
repo = root.parents[1]
name, slug, src = sys.argv[1], sys.argv[2], sys.argv[3]
text = (src_dir / src).read_text()
lines = text.split("\n")

body = []
for r in sys.argv[4:]:
    a, b = map(int, r.split(":"))
    body += lines[a - 1 : b]

# find the component function (App / XSection) to split top-level from its state
fn_start = next((i for i, l in enumerate(lines) if re.match(r"export function \w+\(", l)), len(lines))

# sample-box / example-box → Demo
out = []
closers = []
for l in body:
    m = re.match(r'^(\s*)<div className="(sample|example)-box ?([^"]*)"( style=\{\{.*\}\})?>$', l)
    if m:
        ind, box, cls, style = m.groups()
        attrs = (f' box="example"' if box == "example" else "") + (f' className="{cls}"' if cls else "") + (style or "")
        out.append(f"{ind}<Demo{attrs}>")
        closers.append(ind)
        continue
    if closers and l == f"{closers[-1]}</div>":
        out.append(f"{closers.pop()}</Demo>")
        continue
    out.append(l)
jsx = "\n".join(l for l in out if not re.match(r"\s*\{/\* =+ .* =+ \*/\}$", l))

# top-level declarations before the component function
decls = {}
i = 0
while i < fn_start:
    m = re.match(r"^(?:export )?(?:const|function|type|interface) (\w+)", lines[i])
    if m and not lines[i].startswith("import"):
        j = i + 1
        if re.match(r"^(export )?function ", lines[i]) and not lines[i].rstrip().endswith("}"):
            while j < fn_start and lines[j] != "}":
                j += 1
            j += 1
        else:
            while j < fn_start and lines[j].strip() and not re.match(r"^(const|function|type|interface|export|import)\b", lines[j]):
                j += 1
        decls[m.group(1)] = "\n".join(lines[i:j])
        i = j
    else:
        i += 1
kit = {"Demo", "PropsTable", "Usage", "A11y", "PropRow"}
for k in kit:
    decls.pop(k, None)

# state in the component function
states = {}
for l in lines[fn_start:]:
    m = re.match(r"\s*const \[(\w+), (\w+)\] = useState", l)
    if m:
        states[m.group(1)] = l.strip()
        states[m.group(2)] = l.strip()
    m = re.match(r"  {1,2}const (\w+)(?::[^=]+)? = ", l)
    if m and "useState" not in l and m.group(1) not in states and l.rstrip().endswith(";"):
        states[m.group(1)] = l.strip()

for k in ("theme", "setTheme", "mode", "setMode"):
    states.pop(k, None)
idre = re.compile(r"\b[A-Za-z_]\w*\b")
datum = set()
for block in re.findall(r"export (?:type )?\{([^}]*)\}", (repo / "packages/react/src/index.ts").read_text()):
    datum |= set(idre.findall(block)) - {"type", "as"}
lucide = set()
for m in re.finditer(r"import \{([^}]*)\} from \"lucide-react\"", text):
    lucide |= set(idre.findall(m.group(1)))
other_imports = {}
for m in re.finditer(r"import \{([^}]*)\} from \"([^.\"][^\"]*)\"", text):
    if m.group(2) in ("react", "@datum-design/react", "lucide-react"):
        continue
    for n in idre.findall(m.group(1)):
        if n != "type":
            other_imports[n] = m.group(2)
local_imports = {}
for m in re.finditer(r"import \{([^}]*)\} from \"\./(\w+)\"", text):
    for n in idre.findall(m.group(1)):
        local_imports[n] = m.group(2)

used_decls, used_state, seen = [], [], set()
def scan(s):
    for tok in idre.findall(s):
        if tok in seen:
            continue
        seen.add(tok)
        if tok in decls:
            scan(decls[tok])
            used_decls.append(tok)
        elif tok in states and states[tok] not in used_state:
            used_state.append(states[tok])
            scan(states[tok])
def code_only(s):
    buf, depth = [], 0
    for ch in s:
        if ch == "{": depth += 1
        elif ch == "}": depth -= 1
        elif depth > 0: buf.append(ch)
        if ch == "}": buf.append(" ")
    return "".join(buf) + " " + " ".join(re.findall(r"</?([A-Z]\w*)", s))
scan(code_only(jsx))
order = {l.strip(): i for i, l in enumerate(lines)}
used_state.sort(key=lambda l: order.get(l, 0))

allsrc = "\n".join([code_only(jsx), *(decls[d] for d in used_decls), *used_state])
toks = set(idre.findall(allsrc))
react = sorted({"useState", "useRef", "useEffect", "Fragment", "useMemo", "useCallback"} & toks)
if "ReactNode" in toks: react.append("type ReactNode")
imp = []
if react:
    imp.append(f'import {{ {", ".join(react)} }} from "react";')
d = sorted((toks & datum) - set(used_decls))
if d:
    imp.append(f'import {{ {", ".join(d)} }} from "@datum-design/react";')
lu = sorted(toks & lucide)
if lu:
    imp.append(f'import {{ {", ".join(lu)} }} from "lucide-react";')
for mod in sorted({other_imports[t] for t in toks if t in other_imports}):
    names = sorted(t for t in toks if other_imports.get(t) == mod)
    imp.append(f'import {{ {", ".join(names)} }} from "{mod}";')
for mod in sorted({local_imports[t] for t in toks if t in local_imports}):
    names = sorted(t for t in toks if local_imports.get(t) == mod)
    imp.append(f'import {{ {", ".join(names)} }} from "../../{mod}";')
k = sorted(toks & kit)
imp.append(f'import {{ {", ".join(k)} }} from "./kit";' if k else "")

# dedent JSX to 4 spaces
base = min((len(l) - len(l.lstrip()) for l in jsx.split("\n") if l.strip()), default=0)
jsx = "\n".join(("    " + l[base:]) if l.strip() else "" for l in jsx.split("\n"))

file = "\n".join(filter(None, imp)) + "\n\n"
file += "\n".join(decls[d] for d in used_decls) + ("\n\n" if used_decls else "")
file += f"export default function {name}Doc() {{\n"
file += "".join(f"  {s}\n" for s in used_state)
file += f"  return (\n    <>\n{jsx}\n    </>\n  );\n}}\n"
(root / "src/site/docs" / f"{name}.tsx").write_text(file)

reg = root / "src/site/docs/index.ts"
r = reg.read_text()
if f'"{slug}"' not in r:
    r = r.replace("= {\n", "= {\n", 1) if "= {\n" in r else r.replace("= {};", "= {\n};")
    r = r.replace("\n};", f'\n  "{slug}": lazy(() => import("./{name}")),\n}};', 1)
    reg.write_text(r)
print(f"wrote docs/{name}.tsx: {len(used_decls)} decls, {len(used_state)} state lines")
