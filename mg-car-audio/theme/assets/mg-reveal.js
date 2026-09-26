/*
 * MG motion helpers (docs/DESIGN.md §5.14). Loaded once as a module by snippets/mg-reveal-script.liquid.
 *
 * - [data-mg-reveal]: fades and lifts in once when it scrolls into view.
 * - [data-mg-reveal-stagger]: the same for each direct child, 70ms apart.
 * - [data-mg-pause-offscreen]: gets [data-mg-offscreen] while out of view, so CSS can pause
 *   its animations (hero slideshow, car-make marquee).
 * - [data-mg-motion-toggle]: a pause button (aria-pressed) for the element named by its
 *   aria-controls, which gets [data-mg-user-paused]. Hidden until this runs; stays hidden
 *   under reduced motion, where nothing moves.
 * - [data-mg-parallax]: its <img> drifts a few percent against the scroll. CSS scroll-driven
 *   animations do this where supported (mg-theme.css); this file is the fallback, on
 *   fine-pointer devices only.
 *
 * Progressive enhancement: nothing is hidden until this runs and adds .mg-reveal-on to <html>.
 * Elements already on screen at that moment are marked revealed first, so nothing flashes.
 * Does nothing under prefers-reduced-motion or in the theme editor. No scroll listeners:
 * IntersectionObserver, plus a rAF loop that only runs while a parallax image is on screen.
 */

const root = document.documentElement;
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const designMode = Boolean(window.Shopify && window.Shopify.designMode);
const STAGGER_STEPS = 8;
const REVEAL_MS = 560;
const STAGGER_MS = 70;

function markDone(el, delay) {
  window.setTimeout(() => el.classList.add('mg-reveal-done'), REVEAL_MS + delay + 60);
}

function initReveal() {
  if (reduced || designMode || !('IntersectionObserver' in window)) return;
  const els = [...document.querySelectorAll('[data-mg-reveal], [data-mg-reveal-stagger]')];
  if (!els.length) return;

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const el = entry.target;
        io.unobserve(el);
        el.classList.add('is-revealed');
        const steps = el.hasAttribute('data-mg-reveal-stagger') ? Math.min(el.children.length - 1, STAGGER_STEPS) : 0;
        markDone(el, Math.max(steps, 0) * STAGGER_MS);
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0 }
  );

  // Read every position first, then write, so this costs one layout.
  const viewH = window.innerHeight;
  const onScreen = els.map((el) => {
    const r = el.getBoundingClientRect();
    return r.top < viewH && r.bottom > 0;
  });

  els.forEach((el, i) => {
    if (onScreen[i]) {
      el.classList.add('is-revealed', 'mg-reveal-done');
      return;
    }
    if (el.hasAttribute('data-mg-reveal-stagger')) {
      [...el.children].forEach((child, j) => child.style.setProperty('--mg-i', String(Math.min(j, STAGGER_STEPS))));
    }
    io.observe(el);
  });

  root.classList.add('mg-reveal-on');
}

function initOffscreenPause() {
  if (!('IntersectionObserver' in window)) return;
  const els = document.querySelectorAll('[data-mg-pause-offscreen]');
  if (!els.length) return;
  const io = new IntersectionObserver((entries) => {
    for (const entry of entries) entry.target.toggleAttribute('data-mg-offscreen', !entry.isIntersecting);
  });
  els.forEach((el) => io.observe(el));
}

function initParallax() {
  if (reduced || !('IntersectionObserver' in window)) return;
  if (window.CSS && CSS.supports('animation-timeline: view()')) return;
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  const els = [...document.querySelectorAll('[data-mg-parallax]')];
  if (!els.length) return;

  const visible = new Set();
  let frame = 0;

  const tick = () => {
    frame = 0;
    const viewH = window.innerHeight;
    for (const el of visible) {
      const img = el.querySelector('img');
      if (!img) continue;
      const r = el.getBoundingClientRect();
      const progress = Math.max(-1, Math.min(1, (r.top + r.height / 2 - viewH / 2) / (viewH / 2 + r.height / 2)));
      img.style.transform = `translate3d(0, ${(progress * -5).toFixed(2)}%, 0) scale(1.12)`;
    }
    if (visible.size) frame = window.requestAnimationFrame(tick);
  };

  const io = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) visible.add(entry.target);
      else visible.delete(entry.target);
    }
    if (visible.size && !frame) frame = window.requestAnimationFrame(tick);
  });
  els.forEach((el) => {
    el.setAttribute('data-mg-parallax-js', '');
    io.observe(el);
  });
}

function initMotionToggles() {
  if (reduced) return;
  document.querySelectorAll('[data-mg-motion-toggle]').forEach((btn) => {
    const target = document.getElementById(btn.getAttribute('aria-controls') || '');
    if (!target) return;
    btn.hidden = false;
    btn.addEventListener('click', () => {
      const paused = btn.getAttribute('aria-pressed') !== 'true';
      btn.setAttribute('aria-pressed', String(paused));
      target.toggleAttribute('data-mg-user-paused', paused);
    });
  });
}

initReveal();
initOffscreenPause();
initMotionToggles();
initParallax();
