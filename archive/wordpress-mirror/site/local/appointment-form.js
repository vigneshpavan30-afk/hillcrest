// Client-side replacement for Gravity Forms submission on /appointments/.
// Reproduces Gravity Forms' legacy validation markup so the original CSS styles errors identically.
(function () {
  var form = document.getElementById('gform_1');
  if (!form) return;
  var wrapper = document.getElementById('gform_wrapper_1');
  var button = document.getElementById('gform_submit_button_1');

  var REQUIRED_MSG = 'This field is required.';
  var EMAIL_MSG = 'The email address entered is invalid, please check the formatting (e.g. email@domain.com).';
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  var FIELDS = [
    { id: 1, required: true },
    { id: 2, required: true },
    { id: 3, required: true, email: true },
    { id: 7, required: true }
  ];

  function clearErrors() {
    wrapper.classList.remove('gform_validation_error');
    var summary = document.getElementById('gform_1_validation_container');
    if (summary) summary.remove();
    form.querySelectorAll('.gfield_error').forEach(function (li) {
      li.classList.remove('gfield_error');
      var msg = li.querySelector('.validation_message');
      if (msg) msg.remove();
      var input = li.querySelector('[aria-invalid]');
      if (input) input.setAttribute('aria-invalid', 'false');
    });
  }

  function showErrors(errors, summaryText) {
    wrapper.classList.add('gform_validation_error');
    var summary = document.createElement('div');
    summary.className = 'gform_validation_errors validation_error';
    summary.id = 'gform_1_validation_container';
    summary.setAttribute('data-js', 'gform-focus-validation-error');
    summary.innerHTML = '<h2 class="gform_submission_error hide_summary">' +
      (summaryText || 'There was a problem with your submission. Please review the fields below.') + '</h2>';
    form.parentNode.insertBefore(summary, form);

    Object.keys(errors).forEach(function (id) {
      var li = document.getElementById('field_1_' + id);
      if (!li) return;
      li.classList.add('gfield_error');
      var input = document.getElementById('input_1_' + id);
      if (input) input.setAttribute('aria-invalid', 'true');
      var msg = document.createElement('div');
      msg.className = 'gfield_description validation_message gfield_validation_message';
      msg.textContent = errors[id];
      li.appendChild(msg);
    });
    summary.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function validate() {
    var errors = {};
    FIELDS.forEach(function (f) {
      var el = document.getElementById('input_1_' + f.id);
      var value = el ? el.value.trim() : '';
      if (f.required && !value) errors[f.id] = REQUIRED_MSG;
      else if (f.email && value && !EMAIL_RE.test(value)) errors[f.id] = EMAIL_MSG;
    });
    return errors;
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    event.stopImmediatePropagation();
    clearErrors();

    var errors = validate();
    if (Object.keys(errors).length) {
      showErrors(errors);
      return;
    }

    button.disabled = true;
    var body = new URLSearchParams(new FormData(form));
    fetch(form.action, {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: body
    })
      .then(function (res) {
        return res.json().then(function (data) { return { ok: res.ok, data: data }; });
      })
      .then(function (result) {
        if (result.ok && result.data.ok) {
          window.location.href = result.data.redirect || '/thank-you/';
          return;
        }
        showErrors(result.data.errors || {}, result.data.message);
        button.disabled = false;
      })
      .catch(function () {
        showErrors({}, 'Sorry, your request could not be sent. Please call us at (909) 927-5333.');
        button.disabled = false;
      });
  }, true);
})();
