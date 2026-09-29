import { useEffect, useState } from "react";
import { Button, ButtonGroup } from "@datum-design/react";

export function ThemeSwitch() {
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme ?? "orange");
  const [mode, setMode] = useState(() =>
    matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
  );

  // Until the reader picks a mode explicitly, follow the OS: color-scheme is set by
  // themes.css (light dark), so the page already follows it — this just keeps the
  // toggle's pressed state in sync, including if the OS theme changes mid-session.
  useEffect(() => {
    const query = matchMedia("(prefers-color-scheme: dark)");
    const onChange = (e: MediaQueryListEvent) => {
      if (!document.documentElement.style.colorScheme) setMode(e.matches ? "dark" : "light");
    };
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  function switchTheme(next: string) {
    document.documentElement.dataset.theme = next;
    setTheme(next);
  }

  function switchMode(next: string) {
    document.documentElement.style.colorScheme = next;
    setMode(next);
  }

  return (
    <>
      <ButtonGroup attached size="sm" aria-label="Theme">
        {["orange", "navy"].map((t) => (
          <Button key={t} pressed={theme === t} onPressedChange={() => switchTheme(t)}>{t}</Button>
        ))}
      </ButtonGroup>
      <ButtonGroup attached size="sm" aria-label="Mode">
        {["light", "dark"].map((m) => (
          <Button key={m} pressed={mode === m} onPressedChange={() => switchMode(m)}>{m}</Button>
        ))}
      </ButtonGroup>
    </>
  );
}
