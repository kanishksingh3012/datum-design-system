// Stroke icons for form controls, drawn in currentColor on a 24px grid.
type IconProps = { className?: string; "data-chevron"?: string };

const icon = (d: string, strokeWidth = 2) =>
  function Icon({ className, ...data }: IconProps) {
    return (
      <svg {...data} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d={d} />
      </svg>
    );
  };

export const CheckIcon = icon("M5 12.5l4.5 4.5L19 7.5", 3);
export const DashIcon = icon("M6 12h12", 3);
export const ChevronDownIcon = icon("M6 9l6 6 6-6");
export const EyeIcon = icon("M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z");
export const EyeOffIcon = icon(
  "M9.9 4.2A9.6 9.6 0 0 1 12 4c6.5 0 10 8 10 8a17 17 0 0 1-2.2 3.2 M6.6 6.6A17 17 0 0 0 2 12s3.5 8 10 8a9.7 9.7 0 0 0 5.4-1.6 M9.9 9.9a3 3 0 0 0 4.2 4.2 M2 2l20 20"
);
export const MinusIcon = icon("M5 12h14");
export const PlusIcon = icon("M12 5v14 M5 12h14");
export const SearchIcon = icon("M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z M20 20l-4-4");
export const ChevronLeftIcon = icon("M15 6l-6 6 6 6");
export const ChevronRightIcon = icon("M9 6l6 6-6 6");
export const CalendarIcon = icon("M8 3v4 M16 3v4 M4 10h16 M6 5h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z");
