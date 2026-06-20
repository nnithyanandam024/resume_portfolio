/* ============================================================
   NAV: mobile toggle + close on link click
   ============================================================ */
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ============================================================
   THEME TOGGLE (dark / light), persisted for this session
   ============================================================ */
const themeToggle = document.getElementById('themeToggle');
const root = document.documentElement;

function applyTheme(theme) {
  root.setAttribute('data-theme', theme);
  if (themeToggle) {
    var iconEl = themeToggle.querySelector('span');
    iconEl.textContent = theme === 'dark' ? '\u2600' : '\u263E';
  }
}

let savedTheme = 'dark';
try {
  savedTheme = sessionStorage.getItem('theme') || 'dark';
} catch (e) {
  console.warn('sessionStorage is not accessible:', e);
}
applyTheme(savedTheme);

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    try {
      sessionStorage.setItem('theme', next);
    } catch (e) {
      console.warn('sessionStorage is not accessible:', e);
    }
  });
}

/* ============================================================
   SCROLL REVEAL (IntersectionObserver)
   ============================================================ */
const revealEls = document.querySelectorAll('.reveal');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (revealEls.length) {
  if (prefersReducedMotion) {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    const revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  }
}

/* ============================================================
   SKILL BARS - animate fill when section enters view
   ============================================================ */
const skillsGrid = document.querySelector('.skills-grid');
if (skillsGrid) {
  if (prefersReducedMotion) {
    skillsGrid.classList.add('is-visible');
  } else {
    const skillObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            skillObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );
    skillObserver.observe(skillsGrid);
  }
}

/* ============================================================
   PROJECT CARD HOVER TILT (CSS 3D, capped to a subtle angle)
   ============================================================ */
const TILT_MAX_DEG = 7;

document.querySelectorAll('.project-card').forEach(function (card) {
  if (prefersReducedMotion) return;

  card.addEventListener('mousemove', function (e) {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    const rx = (-y * TILT_MAX_DEG).toFixed(2);
    const ry = (x * TILT_MAX_DEG).toFixed(2);
    card.style.transform =
      'perspective(700px) rotateX(' + rx + 'deg) rotateY(' + ry + 'deg) translateY(-4px)';
  });

  card.addEventListener('mouseleave', function () {
    card.style.transform = '';
  });
});

/* ============================================================
   CONTACT FORM - static-site friendly fallback.
   Opens the visitor's email client with the message pre-filled.
   Swap this out for Formspree / EmailJS / your own backend if you
   want submissions to land somewhere without opening a mail client.
   ============================================================ */
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

// TODO: replace with your real email address
const CONTACT_EMAIL = 'nnithyanandam024@gmail.com';

if (contactForm) {
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const data = new FormData(contactForm);
    const name = data.get('name');
    const email = data.get('email');
    const message = data.get('message');

    const subject = encodeURIComponent('Portfolio message from ' + name);
    const body = encodeURIComponent(message + '\n\n\u2014 ' + name + ' (' + email + ')');
    window.location.href = 'mailto:' + CONTACT_EMAIL + '?subject=' + subject + '&body=' + body;

    if (formStatus) {
      formStatus.textContent = 'Opening your email client \u2014 thanks for reaching out!';
    }
    contactForm.reset();
  });
}

/* ============================================================
   HERO SCROLL PROGRESS - exposed for crane.js to read
   (avoids duplicate scroll listeners across files)
   ============================================================ */
const heroEl = document.getElementById('hero');
window.__heroScrollProgress = 0;

function updateHeroScrollProgress() {
  if (!heroEl) return;
  const rect = heroEl.getBoundingClientRect();
  const total = rect.height || window.innerHeight;
  const progress = Math.min(Math.max(-rect.top / total, 0), 1);
  window.__heroScrollProgress = progress;
}

window.addEventListener('scroll', updateHeroScrollProgress, { passive: true });
updateHeroScrollProgress();
