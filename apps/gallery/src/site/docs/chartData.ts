export const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((month, i) => ({ month, desktop: 186 + i * 24 + ((i * 37) % 50), mobile: 80 + i * 20, tablet: 40 + ((i * 13) % 30) }));
export const devices = [
  { key: "desktop", label: "Desktop" },
  { key: "mobile", label: "Mobile" },
  { key: "tablet", label: "Tablet" },
];
export const browsers = [
  { browser: "chrome", visitors: 4200 },
  { browser: "safari", visitors: 2600 },
  { browser: "edge", visitors: 1100 },
  { browser: "other", visitors: 500 },
];
export const browserSeries = [
  { key: "chrome", label: "Chrome" },
  { key: "safari", label: "Safari" },
  { key: "edge", label: "Edge" },
  { key: "other", label: "Other", color: "neutral" as const },
];
