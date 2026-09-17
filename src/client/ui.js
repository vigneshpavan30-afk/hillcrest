// Header, menus, message forms and the patient-library filter.
import { $, $$, postJson, formValues, markInvalid, PHONE, PHONE_RE } from './util.js';

export function initHeader() {
  const header = $('[data-header]');
  if (!header) return;
  // The header stays fixed and visible; scrolling only adds a soft shadow.
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 24);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

export function initDropdowns() {
  $$('[data-dropdown]').forEach((dd) => {
    const trigger = dd.querySelector('[aria-haspopup]');
    const sync = (open) => trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
    dd.addEventListener('mouseenter', () => { dd.classList.remove('is-closed'); sync(true); });
    dd.addEventListener('mouseleave', () => sync(false));
    dd.addEventListener('focusin', () => { dd.classList.remove('is-closed'); sync(true); });
    dd.addEventListener('focusout', (e) => { if (!dd.contains(e.relatedTarget)) sync(false); });
    dd.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape') return;
      dd.classList.add('is-closed');
      sync(false);
      trigger.focus();
    });
  });
}

export function initMobileMenu({ onOpen, onClose } = {}) {
  const toggle = $('[data-mobile-toggle]');
  const menu = $('#mobile-menu');
  if (!toggle || !menu) return;
  const set = (open) => {
    menu.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
    document.documentElement.classList.toggle('menu-open', open);
    (open ? onOpen : onClose)?.(menu);
  };
  toggle.addEventListener('click', () => set(menu.hidden));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !menu.hidden) { set(false); toggle.focus(); } });
  window.matchMedia('(min-width: 1081px)').addEventListener('change', (e) => { if (e.matches) set(false); });
}

export function initLeadForms() {
  $$('[data-lead-form]').forEach((form) => {
    const msg = $('[data-form-msg]', form);
    const button = $('button[type="submit"]', form);
    const show = (text, ok) => {
      msg.textContent = text;
      msg.className = `form-msg ${ok ? 'is-ok' : 'is-error'}`;
      msg.hidden = false;
    };

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const data = formValues(form);
      const { name, phone, note } = form.elements;
      const phoneOk = PHONE_RE.test(data.phone);
      const noteOk = !note.required || !!data.note;
      markInvalid(name, !data.name);
      markInvalid(phone, !phoneOk);
      markInvalid(note, !noteOk);
      if (!data.name || !phoneOk || !noteOk) {
        show(!data.name || !data.phone ? 'Please add your name and a phone number.' : 'Please check the highlighted fields.', false);
        return;
      }
      data.page = location.pathname;
      button.disabled = true;
      try {
        await postJson('/api/messages', data);
        form.reset();
        show(form.dataset.success, true);
      } catch (err) {
        Object.keys(err.errors || {}).forEach((k) => markInvalid(form.elements[k], true));
        show(err.message && err.message !== 'Request failed' ? err.message : `Sorry, that didn’t send. Please call ${PHONE}.`, false);
      } finally {
        button.disabled = false;
      }
    });
  });
}

export function initLibraryFilter({ onChange } = {}) {
  const buttons = $$('[data-topic]');
  if (!buttons.length) return;
  const cards = $$('[data-post-topic]');
  const setTopic = (topic, updateUrl) => {
    if (!buttons.some((b) => b.dataset.topic === topic)) topic = 'All';
    buttons.forEach((b) => {
      const on = b.dataset.topic === topic;
      b.classList.toggle('is-on', on);
      b.setAttribute('aria-pressed', String(on));
    });
    const shown = [];
    cards.forEach((c) => {
      c.hidden = topic !== 'All' && c.dataset.postTopic !== topic;
      if (!c.hidden) shown.push(c);
    });
    if (updateUrl) history.replaceState(null, '', topic === 'All' ? location.pathname : `${location.pathname}?topic=${encodeURIComponent(topic)}`);
    onChange?.(shown);
  };
  buttons.forEach((b) => b.addEventListener('click', () => setTopic(b.dataset.topic, true)));
  const initial = new URLSearchParams(location.search).get('topic');
  if (initial) setTopic(initial, false);
}
