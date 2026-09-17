// Entry point: core interactions everywhere, motion when allowed, the 3D hero when the device can handle it.
import { $, prefersReducedMotion } from './util.js';
import { initHeader, initDropdowns, initMobileMenu, initLeadForms, initLibraryFilter } from './ui.js';
import { initBooking } from './booking.js';

const reduced = prefersReducedMotion();
let motion = null;

initHeader();
initDropdowns();
initLeadForms();

(async () => {
  if (!reduced) {
    try {
      motion = await import('./motion.js');
      motion.initMotion();
    } catch (err) {
      console.warn('Motion unavailable', err);
      document.documentElement.classList.remove('motion');
    }
  }
  initMobileMenu({ onOpen: (menu) => motion?.animateMenu(menu) });
  initLibraryFilter({ onChange: (cards) => motion?.animateCards(cards) });
  initBooking({ animateStep: (pane, dir) => motion?.animateStep(pane, dir) });
  initHero3d();
})();

function canRender3d() {
  if (reduced) return false;
  if (navigator.connection?.saveData) return false;
  if (navigator.deviceMemory && navigator.deviceMemory < 4) return false;
  if (new URLSearchParams(location.search).has('no3d')) return false;
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}

function initHero3d() {
  const container = $('[data-hero-3d]');
  if (!container || !canRender3d()) return;
  const canvas = $('canvas', container);
  const load = () => import('./hero3d.js')
    .then(({ mountHero }) => mountHero(container, canvas))
    .catch((err) => console.warn('3D hero unavailable, showing poster', err));
  // Let the page paint and the intro start before loading three.js.
  if ('requestIdleCallback' in window) requestIdleCallback(load, { timeout: 1200 });
  else setTimeout(load, 400);
}
