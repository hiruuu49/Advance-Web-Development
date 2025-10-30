const body = document.body;
const themeToggle = document.getElementById('themeToggle');
const mobileToggle = document.getElementById('mobileToggle');
const mobileMenu = document.getElementById('mobileMenu');
const header = document.getElementById('site-header');
const navLinks = document.querySelectorAll('a[href^="#"]');
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

// --- Restore theme from localStorage ---
const saved = localStorage.getItem('theme');
if (saved === 'light') {
  body.classList.add('light');
  themeToggle.textContent = '☀️';
  themeToggle.setAttribute('aria-pressed','true');
} else {
  themeToggle.textContent = '🌙';
  themeToggle.setAttribute('aria-pressed','false');
}

// Toggle theme
themeToggle.addEventListener('click', () => {
  const isLight = body.classList.toggle('light');
  themeToggle.textContent = isLight ? '☀️' : '🌙';
  themeToggle.setAttribute('aria-pressed', String(isLight));
  localStorage.setItem('theme', isLight ? 'light' : 'dark');
});

// --- Mobile menu toggle ---
mobileToggle.addEventListener('click', () => {
  const exp = mobileToggle.getAttribute('aria-expanded') === 'true';
  mobileToggle.setAttribute('aria-expanded', String(!exp));
  if (!exp) {
    mobileMenu.hidden = false;
    mobileMenu.style.maxHeight = mobileMenu.scrollHeight + 'px';
  } else {
    mobileMenu.style.maxHeight = 0;
    setTimeout(() => mobileMenu.hidden = true, 300);
  }
});

// Close mobile menu on link click
mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  if (mobileToggle.getAttribute('aria-expanded') === 'true') mobileToggle.click();
}));

// Smooth scroll with sticky header offset
function smoothHashScroll(e) {
  if (!this.hash) return;
  e.preventDefault();
  const target = document.querySelector(this.hash);
  if (!target) return;
  const headerHeight = header ? header.offsetHeight : 0;
  const top = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 12;
  window.scrollTo({ top, behavior: 'smooth' });
}
navLinks.forEach(link => link.addEventListener('click', smoothHashScroll));

// Contact form: simple front-end validation (no backend)
contactForm.addEventListener('submit', function(e) {
  e.preventDefault();
  // clear errors
  document.getElementById('err-name').textContent = '';
  document.getElementById('err-email').textContent = '';
  document.getElementById('err-message').textContent = '';
  formStatus.textContent = '';

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();
  let ok = true;

  if (name.length < 2) {
    document.getElementById('err-name').textContent = 'Enter your name.';
    ok = false;
  }
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    document.getElementById('err-email').textContent = 'Enter a valid email.';
    ok = false;
  }
  if (message.length < 8) {
    document.getElementById('err-message').textContent = 'Message is too short.';
    ok = false;
  }
  if (!ok) return;

  // success UI
  formStatus.textContent = 'Message ready to send (UI-only) ✔';
  formStatus.style.color = '#9ee7b7';

  setTimeout(() => {
    contactForm.reset();
    formStatus.textContent = 'Thanks! Form cleared.';
    formStatus.style.color = '';
  }, 1400);
});