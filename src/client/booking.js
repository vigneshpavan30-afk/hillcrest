// Four-step appointment request flow.
import { $, $$, postJson, formValues, markInvalid, PHONE, PHONE_RE, EMAIL_RE } from './util.js';

const DOWS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const pad = (n) => String(n).padStart(2, '0');
const isoDate = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

// The next eight weekdays, starting tomorrow.
function nextWeekdays(count = 8) {
  const out = [];
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  while (out.length < count) {
    d.setDate(d.getDate() + 1);
    if (d.getDay() >= 1 && d.getDay() <= 5) out.push(new Date(d));
  }
  return out;
}

export function initBooking({ animateStep } = {}) {
  const form = $('[data-booking]');
  if (!form) return;
  const f = form.elements;
  const state = { step: 1, dayLabel: '' };

  const daysWrap = $('[data-bk-days]', form);
  for (const d of nextWeekdays()) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'day';
    b.dataset.bkDay = isoDate(d);
    b.dataset.bkDayLabel = `${DOWS[d.getDay()]} ${MONS[d.getMonth()]} ${d.getDate()}`;
    b.setAttribute('aria-pressed', 'false');
    b.setAttribute('aria-label', d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }));
    b.innerHTML = `<span class="day-dow">${DOWS[d.getDay()]}</span><span class="day-num">${d.getDate()}</span><span class="day-mon">${MONS[d.getMonth()]}</span>`;
    daysWrap.appendChild(b);
  }

  const selectPill = (attr, value) => {
    $$(`[${attr}]`, form).forEach((b) => {
      const on = b.getAttribute(attr) === value;
      b.classList.toggle('is-on', on);
      b.setAttribute('aria-pressed', String(on));
    });
  };

  const bar = $('[data-bk-bar]');
  function go(step) {
    const from = state.step;
    state.step = step;
    const panes = $$('[data-bk-step]', form);
    const next = panes.find((p) => Number(p.dataset.bkStep) === step);
    panes.forEach((p) => { p.hidden = p !== next; });
    $$('[data-bk-indicator]').forEach((li) => {
      const n = Number(li.dataset.bkIndicator);
      li.classList.toggle('is-active', step >= n);
      if (n === step) li.setAttribute('aria-current', 'step'); else li.removeAttribute('aria-current');
    });
    if (bar) bar.style.transform = `scaleX(${step / 4})`;
    animateStep?.(next, step >= from ? 1 : -1);
    $('h2', next)?.focus({ preventScroll: true });
    const top = form.getBoundingClientRect().top;
    if (top < 0) window.scrollBy({ top: top - 120, behavior: 'smooth' });
  }

  form.addEventListener('click', (e) => {
    const t = e.target.closest('button');
    if (!t || !form.contains(t)) return;
    if (t.dataset.bkReason !== undefined) {
      f.reason.value = t.dataset.bkReason;
      selectPill('data-bk-reason', f.reason.value);
      go(2);
    } else if (t.dataset.bkDay !== undefined) {
      f.day.value = t.dataset.bkDay;
      state.dayLabel = t.dataset.bkDayLabel;
      selectPill('data-bk-day', f.day.value);
    } else if (t.dataset.bkTime !== undefined) {
      f.time.value = t.dataset.bkTime;
      selectPill('data-bk-time', f.time.value);
    } else if (t.hasAttribute('data-bk-next')) {
      go(Math.min(4, state.step + 1));
    } else if (t.hasAttribute('data-bk-back')) {
      go(Math.max(1, state.step - 1));
    } else if (t.hasAttribute('data-bk-reset')) {
      form.reset();
      f.reason.value = f.day.value = f.time.value = '';
      state.dayLabel = '';
      ['data-bk-reason', 'data-bk-day', 'data-bk-time'].forEach((a) => selectPill(a, null));
      go(1);
    }
  });

  const errorBox = $('[data-bk-error]', form);
  const submit = $('[data-bk-submit]', form);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (state.step !== 3) return;
    const data = formValues(form);
    const phoneOk = PHONE_RE.test(data.phone);
    const emailOk = !data.email || EMAIL_RE.test(data.email);
    markInvalid(f.name, !data.name);
    markInvalid(f.phone, !phoneOk);
    markInvalid(f.email, !emailOk);
    const problems = [];
    if (!data.name) problems.push('your name');
    if (!phoneOk) problems.push('a phone number we can call');
    if (!emailOk) problems.push('a valid email (or leave it blank)');
    if (problems.length) {
      errorBox.textContent = `Please add ${problems.join(', ')}.`;
      errorBox.hidden = false;
      return;
    }
    errorBox.hidden = true;
    submit.disabled = true;
    try {
      await postJson('/api/appointments', data);
      $('[data-bk-out="name"]', form).textContent = data.name || 'friend';
      $('[data-bk-out="phone"]', form).textContent = data.phone || 'the number you gave us';
      $('[data-bk-summary="reason"]', form).textContent = data.reason || 'Not specified';
      $('[data-bk-summary="day"]', form).textContent = state.dayLabel || 'First available';
      $('[data-bk-summary="time"]', form).textContent = data.time || 'Any';
      $('[data-bk-summary="insurance"]', form).textContent = data.insurance || 'To confirm';
      go(4);
    } catch (err) {
      Object.keys(err.errors || {}).forEach((k) => markInvalid(f[k], true));
      errorBox.textContent = err.message && err.message !== 'Request failed' ? err.message : `Sorry, your request didn’t go through. Please call ${PHONE}.`;
      errorBox.hidden = false;
    } finally {
      submit.disabled = false;
    }
  });
}
