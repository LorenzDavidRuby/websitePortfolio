/* My Email */
const RECIPIENT_EMAIL = 'lorenzdavidruby@gmail.com';

/* Grab all the elements we need */
const form         = document.getElementById('contactForm');
const nameInput    = document.getElementById('name');
const emailInput   = document.getElementById('email');
const subjectInput = document.getElementById('subject');
const msgInput     = document.getElementById('message');
const submitBtn    = document.getElementById('submitBtn');
const charCounter  = document.getElementById('charCounter');
const toast        = document.getElementById('toast');
const toastIcon    = document.getElementById('toastIcon');
const toastTitle   = document.getElementById('toastTitle');
const toastMsg     = document.getElementById('toastMsg');



msgInput.addEventListener('input', function () {
  const len  = this.value.length;
  const max  = parseInt(this.getAttribute('maxlength'), 10);
  const left = max - len;

  charCounter.textContent = `${len} / ${max}`;

  charCounter.classList.remove('char-counter--warn', 'char-counter--over');
  if (left <= 0)       charCounter.classList.add('char-counter--over');
  else if (left <= 80) charCounter.classList.add('char-counter--warn');
});


/* FIELD ERROR HELPERS
   show/hide the error messages under each input */
function setError(inputEl, errorId, show) {
  const errEl = document.getElementById(errorId);
  if (show) {
    inputEl.classList.add('input--invalid');
    errEl.style.display = 'block';
  } else {
    inputEl.classList.remove('input--invalid');
    errEl.style.display = 'none';
  }
}

/* Clear errors while typing so they don't linger */
nameInput.addEventListener('input',  () => setError(nameInput,  'nameError',    false));
emailInput.addEventListener('input', () => setError(emailInput, 'emailError',   false));
msgInput.addEventListener('input',   () => setError(msgInput,   'messageError', false));


/* FORM VALIDATION
   Checks all required fields before we try to send.
   Returns true if everything looks good. */
function validateForm() {
  let valid = true;

  /* Error check: Name is required */
  if (nameInput.value.trim() === '') {
    setError(nameInput, 'nameError', true);
    valid = false;
  }

  /* email: regex check */
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(emailInput.value.trim())) {
    setError(emailInput, 'emailError', true);
    valid = false;
  }

  /* Error check: Message is required */
  if (msgInput.value.trim() === '') {
    setError(msgInput, 'messageError', true);
    valid = false;
  }

  return valid;
}


/* TOAST NOTIFICATIONS
   Success/Error messages */
let toastTimer = null;

function showToast(type, title, msg) {
  toast.className = `toast toast--${type} toast--visible`;
  toastIcon.textContent  = type === 'success' ? '✓' : '✕';
  toastTitle.textContent = title;
  toastMsg.textContent   = msg;

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove('toast--visible');
  }, 5000);
}


/* MAILTO URL BUILDER */
function buildMailtoURL() {
  const senderName  = nameInput.value.trim();
  const senderEmail = emailInput.value.trim();
  const subject     = subjectInput.value.trim() || 'Portfolio Contact Form';
  const message     = msgInput.value.trim();

  const body =
    `Hi Lorenz,\n\n` +
    `You received a new message from your portfolio contact form.\n\n` +
    `--------------------------------------------------\n` +
    `Name:    ${senderName}\n` +
    `Email:   ${senderEmail}\n` +
    `Subject: ${subject}\n` +
    `--------------------------------------------------\n\n` +
    `${message}\n\n` +
    `--------------------------------------------------\n` +
    `(sent via lorenzruby.dev contact form)`;

  return `mailto:${RECIPIENT_EMAIL}` +
         `?subject=${encodeURIComponent(subject)}` +
         `&body=${encodeURIComponent(body)}`;
}


/* FORM SUBMIT HANDLER */
form.addEventListener('submit', function (e) {
  e.preventDefault(); 

  if (!validateForm()) {
    showToast('error', 'Oops!', 'Please fix the fields highlighted above.');
    return;
  }

  submitBtn.textContent = 'Opening mail app';
  submitBtn.classList.add('btn--loading');

  setTimeout(function () {
    const mailtoURL = buildMailtoURL();
    window.location.href = mailtoURL;

    setTimeout(function () {
      submitBtn.textContent = 'Send Message →';
      submitBtn.classList.remove('btn--loading');

      form.reset();
      charCounter.textContent = '0 / 500';
      charCounter.classList.remove('char-counter--warn', 'char-counter--over');

      showToast(
        'success',
        'Email client opened!',
        'Your message is pre-filled — just hit Send in your mail app.'
      );
    }, 800);

  }, 600);
});
