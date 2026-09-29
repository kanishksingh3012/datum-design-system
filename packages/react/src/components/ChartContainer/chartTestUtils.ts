import { vi } from "vitest";

/**
 * jsdom has no layout: give ResponsiveContainer a 400×240 box so Recharts draws
 * its SVG in tests, and stub matchMedia for the reduced-motion hook.
 */
export function setupChartDom({ reducedMotion = false } = {}) {
  class RO {
    constructor(private cb: ResizeObserverCallback) {}
    observe(target: Element) {
      this.cb([{ target, contentRect: { width: 400, height: 240 } } as unknown as ResizeObserverEntry], this as unknown as ResizeObserver);
    }
    unobserve() {}
    disconnect() {}
  }
  vi.stubGlobal("ResizeObserver", RO);
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({ width: 400, height: 240, top: 0, left: 0, right: 400, bottom: 240, x: 0, y: 0, toJSON() {} } as DOMRect);
  Object.defineProperty(HTMLElement.prototype, "clientWidth", { configurable: true, get: () => 400 });
  Object.defineProperty(HTMLElement.prototype, "clientHeight", { configurable: true, get: () => 240 });
  vi.stubGlobal("matchMedia", (query: string) => ({
    matches: reducedMotion && query.includes("reduced-motion"),
    media: query,
    addEventListener() {},
    removeEventListener() {},
  }));
}
