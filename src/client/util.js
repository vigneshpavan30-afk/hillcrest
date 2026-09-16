// Small shared helpers for the client bundle.
export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

export const PHONE = '(909) 927-5333';
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const PHONE_RE = /(\D*\d){7}/; // at least 7 digits

export const prefersReducedMotion = () => !document.documentElement.classList.contains('motion');

export async function postJson(url, data) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(data),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok || !body.ok) {
    const err = new Error(body.message || 'Request failed');
    err.errors = body.errors || {};
    throw err;
  }
  return body;
}

export function formValues(form) {
  const out = {};
  $$('input, textarea, select', form).forEach((el) => { if (el.name) out[el.name] = el.value.trim(); });
  return out;
}

export function markInvalid(el, invalid) {
  if (!el) return;
  el.classList.toggle('field-error', invalid);
  el.setAttribute('aria-invalid', invalid ? 'true' : 'false');
}
