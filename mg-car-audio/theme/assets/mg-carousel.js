/*
 * <mg-carousel>: scroll-snap carousel with previous/next buttons (MG design system v3).
 * Loaded as a module by snippets/mg-carousel-script.liquid (modules run once per page).
 * Contract (docs/DESIGN.md §5):
 *   track:   [data-mg-carousel-track] or .mg-carousel__track (the scrolling element)
 *   buttons: [data-mg-carousel-prev] / [data-mg-carousel-next] anywhere inside the element
 *   state:   data-overflow on the element when the track can scroll; buttons get `disabled`
 *            at either end. Slides with the `hidden` attribute are skipped.
 *   API:     element.refresh() re-measures (call after showing or hiding slides);
 *            element.reset() scrolls back to the first slide.
 *   focus:   a slide that takes keyboard focus is scrolled fully into view, and an arrow that
 *            becomes disabled while focused hands focus to the other arrow (or the track).
 * Without JavaScript the track still scrolls and snaps; the buttons stay hidden (CSS).
 *
 * Also here, for every page that loads this module: a chip in a scrolling .mg-chips row that
 * takes keyboard focus is scrolled out from under the row's edge fade.
 */

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const scrollBehavior = () => (reducedMotion.matches ? 'instant' : 'smooth');

/** Pixels of scroll-padding at the start of a scroller (0 when 'auto'). */
function scrollPaddingStart(scroller) {
  const value = parseFloat(getComputedStyle(scroller).scrollPaddingInlineStart);
  return Number.isFinite(value) ? value : 0;
}

class MgCarousel extends HTMLElement {
  connectedCallback() {
    this.track = this.querySelector('[data-mg-carousel-track]') || this.querySelector('.mg-carousel__track');
    if (!this.track) return;

    this.prevButton = this.querySelector('[data-mg-carousel-prev]');
    this.nextButton = this.querySelector('[data-mg-carousel-next]');
    if (!this.track.id) this.track.id = `mg-carousel-${Math.random().toString(36).slice(2, 9)}`;

    this.onPrev = () => this.go(-1);
    this.onNext = () => this.go(1);
    this.onScroll = () => {
      if (this.frame) return;
      this.frame = requestAnimationFrame(() => {
        this.frame = 0;
        this.update();
      });
    };

    for (const [button, handler] of [
      [this.prevButton, this.onPrev],
      [this.nextButton, this.onNext],
    ]) {
      if (!button) continue;
      button.setAttribute('aria-controls', this.track.id);
      button.addEventListener('click', handler);
    }

    /* Scroll snapping can cancel the browser's own scroll-into-view on focus, which leaves a
       focused card half off-screen. Bring the slide in, aligned to its snap point. */
    this.onFocusIn = (event) => {
      const slide = this.slides.find((item) => item.contains(event.target));
      if (!slide) return;
      requestAnimationFrame(() => {
        const box = this.track.getBoundingClientRect();
        const rect = slide.getBoundingClientRect();
        const start = box.left + scrollPaddingStart(this.track);
        if (rect.left >= start - 1 && rect.right <= box.right + 1) return;
        this.track.scrollBy({ left: rect.left - start, behavior: scrollBehavior() });
      });
    };

    this.track.addEventListener('focusin', this.onFocusIn);
    this.track.addEventListener('scroll', this.onScroll, { passive: true });
    this.resizeObserver = new ResizeObserver(this.onScroll);
    this.resizeObserver.observe(this.track);
    this.mutationObserver = new MutationObserver(this.onScroll);
    this.mutationObserver.observe(this.track, { childList: true, subtree: true, attributes: true, attributeFilter: ['hidden'] });
    this.update();
  }

  disconnectedCallback() {
    if (!this.track) return;
    this.prevButton?.removeEventListener('click', this.onPrev);
    this.nextButton?.removeEventListener('click', this.onNext);
    this.track.removeEventListener('scroll', this.onScroll);
    this.track.removeEventListener('focusin', this.onFocusIn);
    this.resizeObserver?.disconnect();
    this.mutationObserver?.disconnect();
    cancelAnimationFrame(this.frame);
  }

  get slides() {
    return [...this.track.children].filter((slide) => !slide.hidden && slide.getClientRects().length > 0);
  }

  /** Width of one slide plus the gap: the distance between two snap points. */
  step() {
    const [first, second] = this.slides;
    if (!first) return this.track.clientWidth;
    if (second) return Math.abs(second.getBoundingClientRect().left - first.getBoundingClientRect().left);
    return first.getBoundingClientRect().width;
  }

  go(direction) {
    const step = this.step();
    const perPage = Math.max(1, Math.floor((this.track.clientWidth + 1) / step));
    const sign = getComputedStyle(this.track).direction === 'rtl' ? -1 : 1;
    this.track.scrollBy({ left: direction * sign * step * perPage, behavior: reducedMotion.matches ? 'auto' : 'smooth' });
  }

  update() {
    const max = this.track.scrollWidth - this.track.clientWidth;
    const position = Math.abs(this.track.scrollLeft);
    const overflow = max > 2;
    this.toggleAttribute('data-overflow', overflow);
    const prevOff = !overflow || position <= 2;
    const nextOff = !overflow || position >= max - 2;
    /* A disabled button drops focus to <body>: hand it to the other arrow, or to the track */
    const active = document.activeElement;
    if (active && ((active === this.prevButton && prevOff) || (active === this.nextButton && nextOff))) {
      const other = active === this.prevButton ? this.nextButton : this.prevButton;
      const otherOff = active === this.prevButton ? nextOff : prevOff;
      (other && !otherOff ? other : this.track).focus({ preventScroll: true });
    }
    if (this.prevButton) this.prevButton.disabled = prevOff;
    if (this.nextButton) this.nextButton.disabled = nextOff;
  }

  refresh() {
    this.update();
  }

  reset() {
    this.track.scrollTo({ left: 0, behavior: 'auto' });
    this.update();
  }
}

if (!customElements.get('mg-carousel')) customElements.define('mg-carousel', MgCarousel);

/* Chip rows: keep a keyboard-focused chip clear of the 24-32px edge fade. Tab rows scroll
   themselves when a tab is selected (mg-services-grid), so they are left alone. */
if (!window.mgChipsFocusBound) {
  window.mgChipsFocusBound = true;
  const FADE = 40;
  document.addEventListener('focusin', (event) => {
    const chip = event.target instanceof Element ? event.target.closest('.mg-chips > *') : null;
    const row = chip?.parentElement;
    if (!row || row.matches('.mg-chips--wrap, [role="tablist"]') || row.scrollWidth <= row.clientWidth + 2) return;
    /* After the browser's own scroll-into-view for the focus, which lands on the row's edge.
       The row snaps (proximity), so move to the nearest snap point (a chip's start) that shows
       the whole chip clear of the fade; a small nudge would only snap back. */
    requestAnimationFrame(() => {
      const box = row.getBoundingClientRect();
      const toScroll = (el) => el.getBoundingClientRect().left - box.left + row.scrollLeft;
      const left = toScroll(chip);
      const right = left + chip.getBoundingClientRect().width;
      const current = row.scrollLeft;
      const max = row.scrollWidth - row.clientWidth;
      const fits = (x) => (x <= 1 || left - x >= FADE) && (x >= max - 1 || right - x <= row.clientWidth - FADE);
      if (fits(current)) return;
      const pad = scrollPaddingStart(row);
      const points = [0, max, ...[...row.children].map((item) => Math.min(max, Math.max(0, toScroll(item) - pad)))];
      const target = points.filter(fits).sort((a, b) => Math.abs(a - current) - Math.abs(b - current))[0] ?? Math.max(0, left - pad);
      row.scrollTo({ left: target, behavior: scrollBehavior() });
    });
  });
}
