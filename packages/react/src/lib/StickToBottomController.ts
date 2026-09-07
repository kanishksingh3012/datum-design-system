/**
 * Whether a scroll container is "pinned" to its bottom edge answers a
 * question only the DOM knows - so it's derived from real scroll
 * position, not held as a prop the caller sets. This controller flags
 * its own programmatic scrolls (from scrollToBottom) so they're never
 * misread as the reader scrolling away.
 */
export class StickToBottomController {
  private element: HTMLElement | null = null;
  private pinned: boolean;
  private programmaticScroll = false;
  private listeners = new Set<(pinned: boolean) => void>();
  private threshold: number;

  constructor(options: { defaultPinned?: boolean; threshold?: number } = {}) {
    this.pinned = options.defaultPinned ?? true;
    this.threshold = options.threshold ?? 24;
  }

  attach(element: HTMLElement) {
    this.element = element;
    element.addEventListener("scroll", this.handleScroll);
  }

  detach() {
    this.element?.removeEventListener("scroll", this.handleScroll);
    this.element = null;
  }

  private handleScroll = () => {
    if (this.programmaticScroll) {
      this.programmaticScroll = false;
      return;
    }
    const element = this.element;
    if (!element) return;
    const distanceFromBottom = element.scrollHeight - element.scrollTop - element.clientHeight;
    this.setPinned(distanceFromBottom <= this.threshold);
  };

  setPinned(pinned: boolean) {
    if (pinned === this.pinned) return;
    this.pinned = pinned;
    this.listeners.forEach((listener) => listener(pinned));
  }

  isPinned() {
    return this.pinned;
  }

  scrollToBottom(behavior: ScrollBehavior = "auto") {
    const element = this.element;
    if (!element) return;
    this.programmaticScroll = true;
    element.scrollTo?.({ top: element.scrollHeight, behavior });
  }

  subscribe(listener: (pinned: boolean) => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
}
