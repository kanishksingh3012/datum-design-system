// Stroke icons shared by Alert and Toast, drawn in currentColor on a 24px grid.
export type StatusIntent = "info" | "success" | "warning" | "danger" | "neutral";

const paths: Record<StatusIntent, string> = {
  info: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z M12 16v-4 M12 8h.01",
  neutral: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z M12 16v-4 M12 8h.01",
  success: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z M8.5 12.5l2.5 2.5 4.5-5",
  warning: "M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z M12 9v4 M12 17h.01",
  danger: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z M15 9l-6 6 M9 9l6 6",
};

export function StatusIcon({ intent, className }: { intent: StatusIntent; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={paths[intent]} />
    </svg>
  );
}

export function CloseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 6 6 18 M6 6l12 12" />
    </svg>
  );
}
