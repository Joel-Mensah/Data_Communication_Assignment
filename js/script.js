// ============================================================
// SCROLL PROGRESS BAR
// ============================================================
const progressBar = document.getElementById('progress-bar');
function updateProgress() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  if (progressBar) progressBar.style.width = progress + '%';
}

// ============================================================
// NAVBAR — scroll class + mobile toggle
// ============================================================
const nav = document.querySelector('nav');
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

function updateNav() {
  if (window.scrollY > 40) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
}

if (navToggle) {
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', isOpen);
  });
}

// Close mobile nav when a link is clicked
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// ============================================================
// ACTIVE NAV LINK ON SCROLL
// ============================================================
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

function updateActiveLink() {
  let current = '';
  const offset = 100;

  sections.forEach(section => {
    const top = section.offsetTop - offset;
    if (window.scrollY >= top) {
      current = section.id;
    }
  });

  navAnchors.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current);
  });
}

// ============================================================
// SMOOTH SCROLL for nav links
// ============================================================
navAnchors.forEach(link => {
  link.addEventListener('click', function (e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    const target = document.querySelector(targetId);
    if (target) {
      const navHeight = parseInt(getComputedStyle(document.documentElement)
        .getPropertyValue('--nav-height')) || 68;
      const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top: targetTop, behavior: 'smooth' });
    }
  });
});

// ============================================================
// BACK TO TOP BUTTON
// ============================================================
const backToTop = document.getElementById('back-to-top');
function updateBackToTop() {
  if (!backToTop) return;
  if (window.scrollY > 400) {
    backToTop.classList.add('visible');
  } else {
    backToTop.classList.remove('visible');
  }
}

if (backToTop) {
  backToTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ============================================================
// SCROLL REVEAL ANIMATIONS
// ============================================================
function setupReveal() {
  const revealEls = document.querySelectorAll(
    '.topic-card, .inspire-card, .resource-card, .info-card, .about-photo, .about-info, .stat-item, .telegraph-text, .telegraph-svg-wrap, .video-wrap, .inspire-quote, .further-reading, .section-label, .section-title, .section-desc'
  );

  revealEls.forEach((el, i) => {
    el.classList.add('reveal');
    // Stagger cards in grids
    const parent = el.parentElement;
    if (parent && (parent.classList.contains('topics-grid') ||
        parent.classList.contains('inspire-grid') ||
        parent.classList.contains('resources-grid') ||
        parent.classList.contains('stats-inner') ||
        parent.classList.contains('info-row'))) {
      const siblings = Array.from(parent.children);
      const idx = siblings.indexOf(el);
      el.style.transitionDelay = (idx * 0.08) + 's';
    }
  });

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => io.observe(el));
}

// ============================================================
// ANIMATED STAT NUMBERS
// ============================================================
function animateStats() {
  const statNums = document.querySelectorAll('.stat-num[data-target]');
  
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseFloat(el.dataset.target);
      const suffix = el.dataset.suffix || '';
      const prefix = el.dataset.prefix || '';
      const isFloat = el.dataset.float === 'true';
      const duration = 1800;
      const start = performance.now();

      function tick(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        const value = target * ease;
        el.textContent = prefix + (isFloat ? value.toFixed(1) : Math.floor(value)) + suffix;
        if (progress < 1) requestAnimationFrame(tick);
        else el.textContent = prefix + (isFloat ? target.toFixed(1) : target) + suffix;
      }

      requestAnimationFrame(tick);
      io.unobserve(el);
    });
  }, { threshold: 0.5 });

  statNums.forEach(el => io.observe(el));
}

// ============================================================
// TOPIC CARD — flip icon on hover hint
// ============================================================
function setupTopicCards() {
  document.querySelectorAll('.topic-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.querySelector('.topic-icon i')?.classList.add('fa-spin');
      setTimeout(() => card.querySelector('.topic-icon i')?.classList.remove('fa-spin'), 600);
    });
  });
}

// ============================================================
// INIT ALL ON SCROLL
// ============================================================
window.addEventListener('scroll', () => {
  updateProgress();
  updateNav();
  updateActiveLink();
  updateBackToTop();
}, { passive: true });

// Initial state
updateNav();
updateActiveLink();

document.addEventListener('DOMContentLoaded', () => {
  setupReveal();
  animateStats();
  setupTopicCards();
  updateBackToTop();
});
