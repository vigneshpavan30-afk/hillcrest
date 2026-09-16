// Interactions for the Hillcrest Dental Studio site: menus, booking flow, message forms, library filters.
(function () {
  'use strict';

  var PHONE = '(909) 927-5333';
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  var PHONE_RE = /\d.*\d.*\d.*\d.*\d.*\d.*\d/; // at least 7 digits

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  function postJson(url, data) {
    return fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(data)
    }).then(function (res) {
      return res.json().catch(function () { return {}; }).then(function (body) {
        if (!res.ok || !body.ok) {
          var err = new Error(body.message || 'Request failed');
          err.errors = body.errors || {};
          throw err;
        }
        return body;
      });
    });
  }

  function formData(form) {
    var out = {};
    $$('input, textarea, select', form).forEach(function (el) {
      if (el.name) out[el.name] = el.value.trim();
    });
    return out;
  }

  function markInvalid(el, invalid) {
    if (!el) return;
    el.classList.toggle('field-error', invalid);
    el.setAttribute('aria-invalid', invalid ? 'true' : 'false');
  }

  // --- Header dropdowns ---------------------------------------------------------------
  $$('[data-dropdown]').forEach(function (dd) {
    var trigger = dd.querySelector('[aria-haspopup]');
    function sync(open) { trigger.setAttribute('aria-expanded', open ? 'true' : 'false'); }
    dd.addEventListener('mouseenter', function () { dd.classList.remove('is-closed'); sync(true); });
    dd.addEventListener('mouseleave', function () { sync(false); });
    dd.addEventListener('focusin', function () { dd.classList.remove('is-closed'); sync(true); });
    dd.addEventListener('focusout', function (e) { if (!dd.contains(e.relatedTarget)) sync(false); });
    dd.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        dd.classList.add('is-closed');
        sync(false);
        trigger.focus();
      }
    });
  });

  // --- Mobile menu ------------------------------------------------------------------
  var toggle = $('[data-mobile-toggle]');
  var mobileMenu = $('#mobile-menu');
  if (toggle && mobileMenu) {
    toggle.addEventListener('click', function () {
      var open = mobileMenu.hasAttribute('hidden');
      if (open) mobileMenu.removeAttribute('hidden'); else mobileMenu.setAttribute('hidden', '');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.textContent = open ? '✕' : '☰';
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !mobileMenu.hasAttribute('hidden')) toggle.click();
    });
  }

  // --- Callback / contact forms --------------------------------------------------------
  $$('[data-lead-form]').forEach(function (form) {
    var msg = $('[data-form-msg]', form);
    var button = $('button[type="submit"]', form);

    function show(text, ok) {
      msg.textContent = text;
      msg.className = 'form-msg ' + (ok ? 'is-ok' : 'is-error');
      msg.removeAttribute('hidden');
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var data = formData(form);
      var name = form.elements.name, phone = form.elements.phone, note = form.elements.note;
      var bad = false;
      markInvalid(name, !data.name); bad = bad || !data.name;
      markInvalid(phone, !PHONE_RE.test(data.phone)); bad = bad || !PHONE_RE.test(data.phone);
      if (note.required) { markInvalid(note, !data.note); bad = bad || !data.note; }
      if (bad) {
        show(!data.name || !data.phone ? 'Please add your name and a phone number.' : 'Please check the highlighted fields.', false);
        return;
      }

      data.page = location.pathname;
      button.disabled = true;
      postJson('/api/messages', data)
        .then(function () {
          form.reset();
          show(form.getAttribute('data-success'), true);
        })
        .catch(function (err) {
          Object.keys(err.errors || {}).forEach(function (k) { markInvalid(form.elements[k], true); });
          show(err.message && err.message !== 'Request failed' ? err.message : 'Sorry, that didn’t send. Please call ' + PHONE + '.', false);
        })
        .then(function () { button.disabled = false; });
    });
  });

  // --- Patient library topic filter -------------------------------------------------------
  var topicButtons = $$('[data-topic]');
  if (topicButtons.length) {
    var cards = $$('[data-post-topic]');
    var setTopic = function (topic, push) {
      if (!topicButtons.some(function (b) { return b.getAttribute('data-topic') === topic; })) topic = 'All';
      topicButtons.forEach(function (b) {
        var on = b.getAttribute('data-topic') === topic;
        b.classList.toggle('is-on', on);
        b.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      cards.forEach(function (c) {
        c.hidden = topic !== 'All' && c.getAttribute('data-post-topic') !== topic;
      });
      if (push) {
        var url = topic === 'All' ? location.pathname : location.pathname + '?topic=' + encodeURIComponent(topic);
        history.replaceState(null, '', url);
      }
    };
    topicButtons.forEach(function (b) {
      b.addEventListener('click', function () { setTopic(b.getAttribute('data-topic'), true); });
    });
    var initial = new URLSearchParams(location.search).get('topic');
    if (initial) setTopic(initial, false);
  }

  // --- Appointment booking flow ---------------------------------------------------------
  var booking = $('[data-booking]');
  if (booking) {
    var DOWS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    var MONS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var state = { step: 1 };
    var f = booking.elements;

    var pad = function (n) { return (n < 10 ? '0' : '') + n; };
    var isoDate = function (d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); };

    // Next eight weekdays, starting tomorrow.
    var daysWrap = $('[data-bk-days]', booking);
    var d = new Date();
    d.setHours(12, 0, 0, 0);
    var count = 0;
    while (count < 8) {
      d.setDate(d.getDate() + 1);
      var dow = d.getDay();
      if (dow < 1 || dow > 5) continue;
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'pill hv-border';
      btn.setAttribute('data-bk-day', isoDate(d));
      btn.setAttribute('data-bk-day-label', DOWS[dow] + ' ' + MONS[d.getMonth()] + ' ' + d.getDate());
      btn.setAttribute('aria-pressed', 'false');
      btn.setAttribute('aria-label', d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }));
      btn.style.cssText = 'border:1px solid #D8E3EC;background:#FCFDFE;padding:12px 14px;cursor:pointer;min-width:74px;';
      btn.innerHTML =
        '<div style="font:500 11.5px/1 \'IBM Plex Mono\',monospace;letter-spacing:0.1em;text-transform:uppercase;color:#4C6980;">' + DOWS[dow] + '</div>' +
        '<div style="font:400 19px/1 \'IBM Plex Sans\',system-ui,sans-serif;color:#08405F;margin-top:7px;">' + d.getDate() + '</div>' +
        '<div style="font:400 12px/1 \'IBM Plex Mono\',monospace;color:#4C6980;margin-top:6px;">' + MONS[d.getMonth()] + '</div>';
      daysWrap.appendChild(btn);
      count++;
    }

    function selectPill(attr, value) {
      $$('[' + attr + ']', booking).forEach(function (b) {
        var on = b.getAttribute(attr) === value;
        b.classList.toggle('is-on', on);
        b.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
    }

    function go(step) {
      state.step = step;
      $$('[data-bk-step]', booking).forEach(function (pane) {
        pane.hidden = Number(pane.getAttribute('data-bk-step')) !== step;
      });
      $$('[data-bk-indicator]').forEach(function (li) {
        var n = Number(li.getAttribute('data-bk-indicator'));
        var active = step >= n;
        var dot = li.firstElementChild;
        dot.style.background = active ? '#0B5C8A' : 'transparent';
        dot.style.color = active ? '#fff' : '#0B5C8A';
        li.querySelector('[data-bk-label]').style.color = active ? '#08405F' : '#4C6980';
        if (n === step) li.setAttribute('aria-current', 'step'); else li.removeAttribute('aria-current');
      });
      var heading = $('[data-bk-step="' + step + '"] h2', booking);
      if (heading) heading.focus({ preventScroll: true });
      var top = booking.getBoundingClientRect().top;
      if (top < 0) window.scrollBy({ top: top - 120, behavior: 'smooth' });
    }

    booking.addEventListener('click', function (e) {
      var t = e.target.closest('button');
      if (!t || !booking.contains(t)) return;
      if (t.hasAttribute('data-bk-reason')) {
        f.reason.value = t.getAttribute('data-bk-reason');
        selectPill('data-bk-reason', f.reason.value);
        go(2);
      } else if (t.hasAttribute('data-bk-day')) {
        f.day.value = t.getAttribute('data-bk-day');
        state.dayLabel = t.getAttribute('data-bk-day-label');
        selectPill('data-bk-day', f.day.value);
      } else if (t.hasAttribute('data-bk-time')) {
        f.time.value = t.getAttribute('data-bk-time');
        selectPill('data-bk-time', f.time.value);
      } else if (t.hasAttribute('data-bk-next')) {
        go(Math.min(4, state.step + 1));
      } else if (t.hasAttribute('data-bk-back')) {
        go(Math.max(1, state.step - 1));
      } else if (t.hasAttribute('data-bk-reset')) {
        booking.reset();
        f.reason.value = f.day.value = f.time.value = '';
        state.dayLabel = '';
        ['data-bk-reason', 'data-bk-day', 'data-bk-time'].forEach(function (a) { selectPill(a, null); });
        go(1);
      }
    });

    var errorBox = $('[data-bk-error]', booking);
    var submit = $('[data-bk-submit]', booking);

    booking.addEventListener('submit', function (e) {
      e.preventDefault();
      if (state.step !== 3) return;
      var data = formData(booking);
      var problems = [];
      markInvalid(f.name, !data.name);
      markInvalid(f.phone, !PHONE_RE.test(data.phone));
      markInvalid(f.email, !!data.email && !EMAIL_RE.test(data.email));
      if (!data.name) problems.push('your name');
      if (!PHONE_RE.test(data.phone)) problems.push('a phone number we can call');
      if (data.email && !EMAIL_RE.test(data.email)) problems.push('a valid email (or leave it blank)');
      if (problems.length) {
        errorBox.textContent = 'Please add ' + problems.join(', ') + '.';
        errorBox.hidden = false;
        return;
      }
      errorBox.hidden = true;
      submit.disabled = true;

      postJson('/api/appointments', data)
        .then(function () {
          $('[data-bk-out="name"]', booking).textContent = data.name || 'friend';
          $('[data-bk-out="phone"]', booking).textContent = data.phone || 'the number you gave us';
          $('[data-bk-summary="reason"]', booking).textContent = data.reason || 'Not specified';
          $('[data-bk-summary="day"]', booking).textContent = state.dayLabel || 'First available';
          $('[data-bk-summary="time"]', booking).textContent = data.time || 'Any';
          $('[data-bk-summary="insurance"]', booking).textContent = data.insurance || 'To confirm';
          go(4);
        })
        .catch(function (err) {
          Object.keys(err.errors || {}).forEach(function (k) { markInvalid(f[k], true); });
          errorBox.textContent = err.message && err.message !== 'Request failed'
            ? err.message
            : 'Sorry, your request didn’t go through. Please call ' + PHONE + '.';
          errorBox.hidden = false;
        })
        .then(function () { submit.disabled = false; });
    });
  }
})();
