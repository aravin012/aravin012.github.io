/**
 * main.js – Aravindan P Resume Website
 * Features: theme toggle, typewriter, counter animation,
 *           smooth scroll, nav highlight, scroll animations,
 *           mobile menu, back-to-top, footer year.
 */

'use strict';

// ── DOM refs ────────────────────────────────────────────────────
const html         = document.documentElement;
const navbar       = document.getElementById('navbar');
const navToggle    = document.getElementById('navToggle');
const navMenu      = document.getElementById('navMenu');
const navLinks     = document.querySelectorAll('.nav-link');
const themeToggle  = document.getElementById('themeToggle');
const themeIcon    = document.getElementById('themeIcon');
const backToTop    = document.getElementById('backToTop');
const typedEl      = document.getElementById('typedTitle');
const footerYear   = document.getElementById('footerYear');

// ── Footer year ──────────────────────────────────────────────────
if (footerYear) footerYear.textContent = new Date().getFullYear();

// ── Theme toggle ─────────────────────────────────────────────────
const THEME_KEY = 'ap-resume-theme';

function applyTheme(theme) {
  html.setAttribute('data-theme', theme);
  if (themeIcon) {
    themeIcon.className = theme === 'dark' ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
  }
  localStorage.setItem(THEME_KEY, theme);
}

(function initTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  const preferred = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  applyTheme(saved || preferred);
})();

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    applyTheme(current === 'dark' ? 'light' : 'dark');
  });
}

// ── Typewriter effect ────────────────────────────────────────────
const titles = [
  'Software Engineer III @ Zinnia',
  'Java & Spring Boot Developer',
  'Apache Karaf / OSGi Specialist',
  'React Frontend Developer',
  'Module Lead',
];

let titleIdx  = 0;
let charIdx   = 0;
let isDeleting = false;
let typingTimer;

function typeNext() {
  if (!typedEl) return;
  const current = titles[titleIdx];

  if (isDeleting) {
    charIdx--;
  } else {
    charIdx++;
  }

  typedEl.textContent = current.substring(0, charIdx);

  let delay = isDeleting ? 60 : 100;

  if (!isDeleting && charIdx === current.length) {
    delay = 2000; // pause at end
    isDeleting = true;
  } else if (isDeleting && charIdx === 0) {
    isDeleting = false;
    titleIdx = (titleIdx + 1) % titles.length;
    delay = 400;
  }

  typingTimer = setTimeout(typeNext, delay);
}

if (typedEl) {
  setTimeout(typeNext, 800);
}

// ── Counter animation ────────────────────────────────────────────
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1600;
  const startTime = performance.now();

  function update(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // ease-out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target;
  }

  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-number[data-target]').forEach(el => {
  counterObserver.observe(el);
});

// ── Scroll-triggered animations ─────────────────────────────────
const animObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // stagger siblings inside the same parent
      const siblings = entry.target.parentElement.querySelectorAll('[data-animate]');
      let delay = 0;
      siblings.forEach(sib => {
        if (!sib.classList.contains('in-view')) {
          setTimeout(() => sib.classList.add('in-view'), delay);
          delay += 80;
        }
      });
      animObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('[data-animate]').forEach(el => animObserver.observe(el));

// ── Navbar: scroll shadow + active link highlight ────────────────
const sections = Array.from(document.querySelectorAll('section[id], header[id]'));

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
      });
    }
  });
}, { rootMargin: `-${64}px 0px -60% 0px`, threshold: 0 });

sections.forEach(s => navObserver.observe(s));

window.addEventListener('scroll', () => {
  const scrolled = window.scrollY > 20;
  navbar?.classList.toggle('scrolled', scrolled);
  backToTop?.classList.toggle('visible', window.scrollY > 400);
}, { passive: true });

// ── Mobile nav toggle ────────────────────────────────────────────
if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    const open = navMenu.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(open));

    // animate hamburger lines
    const bars = navToggle.querySelectorAll('.hamburger');
    if (open) {
      bars[0].style.transform = 'translateY(7px) rotate(45deg)';
      bars[1].style.opacity   = '0';
      bars[2].style.transform = 'translateY(-7px) rotate(-45deg)';
    } else {
      bars.forEach(b => { b.style.transform = ''; b.style.opacity = ''; });
    }
  });

  // Close on link click
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.querySelectorAll('.hamburger').forEach(b => { b.style.transform = ''; b.style.opacity = ''; });
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target) && navMenu.classList.contains('open')) {
      navMenu.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.querySelectorAll('.hamburger').forEach(b => { b.style.transform = ''; b.style.opacity = ''; });
    }
  });
}

// ── Smooth scroll (fallback for browsers without CSS scroll-behavior) ──
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - 64;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});
