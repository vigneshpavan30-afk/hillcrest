// Scroll-driven and pointer-driven animation: smooth scroll, reveals, parallax, 3D tilt, magnetic buttons, counters.
// Only loaded when the visitor has not asked for reduced motion.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { $, $$ } from './util.js';

gsap.registerPlugin(ScrollTrigger);
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const EASE = 'expo.out';

export function initMotion() {
  document.documentElement.classList.add('motion-ready');
  initSmoothScroll();
  initIntro();
  initSectionEntrances();
  initReveals();
  initParallax();
  initCounters();
  if (finePointer) {
    initTilt();
    initMagnetic();
    initCursorGlow();
  }
  initFloatingMarks();
  // Fonts and lazy images change layout; keep trigger positions accurate.
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
  window.addEventListener('load', () => ScrollTrigger.refresh());
}

function initSmoothScroll() {
  if (!finePointer) return; // native momentum scrolling is better on touch devices
  const lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 0.95 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a || a.getAttribute('href').length < 2) return;
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    lenis.scrollTo(target, { offset: -100 });
    target.focus?.({ preventScroll: true });
  });
  const obs = new MutationObserver(() => (document.documentElement.classList.contains('menu-open') ? lenis.stop() : lenis.start()));
  obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
}

const words = (el) => $$('.line > span', el);

function initIntro() {
  const hero = $('[data-hero]');
  const tl = gsap.timeline({ defaults: { ease: EASE } });
  if (hero) {
    const title = $('h1[data-split]', hero);
    const fades = $$('.intro-fade', hero);
    tl.to(words(title), { y: 0, duration: 1.4, stagger: 0.06 }, 0.15)
      .fromTo(fades, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1.2, stagger: 0.12 }, 0.35);
    title.dataset.done = '1';
  }
}

// Framer Motion-style 3D entrances: each section's content tilts up, scales in and fades in,
// scrubbed to scroll position so it reverses when scrolling back. Strongest on the homepage.
function initSectionEntrances() {
  const home = document.body.dataset.page === 'home';
  const narrow = window.matchMedia('(max-width: 700px)').matches;
  const strength = (home ? 1 : 0.65) * (narrow ? 0.6 : 1);
  const sections = $$('main > section, main > article > section, body > section')
    .filter((s) => !s.matches('[data-hero], .page-hero'));

  sections.forEach((section) => {
    const content = $(':scope > .container', section) || section.firstElementChild;
    if (!content) return;
    gsap.fromTo(content, {
      rotationX: 14 * strength,
      scale: 1 - 0.08 * strength,
      y: 90 * strength,
      opacity: 0.25,
      transformPerspective: 1400,
      transformOrigin: '50% 0%',
    }, {
      rotationX: 0, scale: 1, y: 0, opacity: 1, ease: 'none',
      scrollTrigger: { trigger: section, start: 'top 98%', end: 'top 40%', scrub: 0.6 },
    });
  });
}

function initReveals() {
  // Headlines rise word by word.
  $$('[data-split]').forEach((el) => {
    if (el.dataset.done) return;
    gsap.to(words(el), {
      y: 0, duration: 1.2, ease: EASE, stagger: 0.045,
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    });
  });

  // Elements inside a [data-stagger] group enter in sequence; others individually.
  // No clearProps: these elements have CSS start states (see site.css) that would come back.
  const animateIn = (els, trigger) => gsap.to(els, {
    opacity: 1, x: 0, y: 0, scale: 1, rotateX: 0, duration: 1.3, ease: EASE, stagger: 0.09,
    scrollTrigger: { trigger, start: 'top 90%', once: true },
  });
  const grouped = new Set();
  $$('[data-stagger]').forEach((group) => {
    const kids = $$(':scope > [data-reveal], :scope > * > [data-reveal]', group);
    kids.forEach((k) => grouped.add(k));
    if (kids.length) animateIn(kids, group);
  });
  $$('[data-reveal]').forEach((el) => { if (!grouped.has(el)) animateIn(el, el); });
}

function initParallax() {
  $$('[data-parallax]').forEach((img) => {
    gsap.fromTo(img, { yPercent: -6 }, {
      yPercent: 6, ease: 'none',
      scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
    });
  });
  const hero = $('[data-hero]');
  if (hero) {
    gsap.to($('.hero-copy', hero), {
      yPercent: -12, opacity: 0.25, ease: 'none',
      scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true },
    });
    $$('[data-depth]', hero).forEach((chip) => {
      gsap.to(chip, { y: -120 * Number(chip.dataset.depth), ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
    });
  }
}

export function refreshLayout() { ScrollTrigger.refresh(); }

export function animateStep(pane, dir) {
  if (!pane) return;
  gsap.fromTo(pane, { opacity: 0, x: 40 * dir, rotateY: 6 * dir, transformPerspective: 1200 },
    { opacity: 1, x: 0, rotateY: 0, duration: 0.8, ease: EASE, clearProps: 'transform' });
  gsap.fromTo($$('.option, .day, .time, .field, .deflist > div', pane), { opacity: 0, y: 18 },
    { opacity: 1, y: 0, duration: 0.7, ease: EASE, stagger: 0.035, delay: 0.08 });
}

export function animateMenu(menu) {
  gsap.fromTo($$('.m-link, .m-actions > *', menu), { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: EASE, stagger: 0.05 });
}

export function animateCards(cards) {
  gsap.fromTo(cards, { opacity: 0, y: 30, scale: 0.97 }, { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: EASE, stagger: 0.05 });
  ScrollTrigger.refresh();
}

function initCounters() {
  $$('[data-count]').forEach((el) => {
    const end = Number(el.dataset.count);
    const decimals = Number(el.dataset.decimals || 0);
    const obj = { v: 0 };
    el.textContent = (0).toFixed(decimals);
    gsap.to(obj, {
      v: end, duration: 2.2, ease: 'power3.out',
      onUpdate: () => { el.textContent = obj.v.toFixed(decimals); },
      scrollTrigger: { trigger: el, start: 'top 92%', once: true },
    });
  });
}

function initTilt() {
  $$('.tilt').forEach((card) => {
    const rx = gsap.quickTo(card, 'rotationX', { duration: 0.8, ease: 'power3.out' });
    const ry = gsap.quickTo(card, 'rotationY', { duration: 0.8, ease: 'power3.out' });
    gsap.set(card, { transformPerspective: 1000 });
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      card.style.setProperty('--mx', `${px * 100}%`);
      card.style.setProperty('--my', `${py * 100}%`);
      rx((0.5 - py) * 8);
      ry((px - 0.5) * 10);
    });
    card.addEventListener('pointerleave', () => { rx(0); ry(0); });
  });
}

function initMagnetic() {
  $$('[data-magnetic]').forEach((el) => {
    const x = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3.out' });
    const y = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3.out' });
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      x((e.clientX - (r.left + r.width / 2)) * 0.25);
      y((e.clientY - (r.top + r.height / 2)) * 0.35);
    });
    el.addEventListener('pointerleave', () => { x(0); y(0); });
  });
}

function initCursorGlow() {
  const glow = $('[data-cursor-glow]');
  if (!glow) return;
  const x = gsap.quickTo(glow, 'x', { duration: 1.2, ease: 'power3.out' });
  const y = gsap.quickTo(glow, 'y', { duration: 1.2, ease: 'power3.out' });
  window.addEventListener('pointermove', (e) => { x(e.clientX); y(e.clientY); }, { passive: true });
}

function initFloatingMarks() {
  $$('[data-float]').forEach((el) => {
    gsap.fromTo(el, { opacity: 0, rotate: -8, scale: 0.9 }, { opacity: 0.5, rotate: 0, scale: 1, duration: 2, ease: EASE, delay: 0.2 });
    gsap.to(el, { yPercent: -10, rotate: 6, ease: 'none', scrollTrigger: { trigger: el.parentElement, start: 'top top', end: 'bottom top', scrub: true } });
  });
}
