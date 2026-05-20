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
    '.topic-card, .inspire-card, .resource-card, .info-card, .about-photo, .about-info, .stat-item, .telegraph-text, .telegraph-svg-wrap, .video-wrap, .inspire-quote, .further-reading, .section-label, .section-title, .section-desc, .course-block, .courses-empty'
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

// ============================================================
// COURSES & RESOURCES FEATURE
// ============================================================

// ---- Data layer (localStorage) ----
const STORAGE_KEY = 'joel_courses_v1';

function loadCourses() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch { return []; }
}

function saveCourses(courses) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(courses));
}

// ---- Toast notifications ----
function showToast(msg, type = 'success') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = msg;
  container.appendChild(toast);
  requestAnimationFrame(() => {
    requestAnimationFrame(() => toast.classList.add('show'));
  });
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 350);
  }, 3000);
}

// ---- Icon helpers ----
function typeIcon(type) {
  const map = {
    pdf: 'fa-file-pdf', link: 'fa-link', doc: 'fa-file-word',
    video: 'fa-video', image: 'fa-image', file: 'fa-file'
  };
  return map[type] || 'fa-file';
}

function resourceTypeLabel(type) {
  const map = {
    pdf: 'PDF', link: 'Link', doc: 'Document',
    video: 'Video', image: 'Image', file: 'File'
  };
  return map[type] || 'File';
}

// ---- Render the courses list ----
function renderCourses() {
  const courses = loadCourses();
  const list = document.getElementById('courses-list');
  const empty = document.getElementById('courses-empty');

  list.innerHTML = '';
  if (courses.length === 0) {
    empty.style.display = 'block';
    list.style.display = 'none';
    return;
  }
  empty.style.display = 'none';
  list.style.display = 'flex';

  courses.forEach((course, ci) => {
    const block = document.createElement('div');
    block.className = 'course-block reveal';
    block.dataset.courseId = course.id;

    const count = course.resources ? course.resources.length : 0;
    const countLabel = count === 1 ? '1 resource' : `${count} resources`;

    block.innerHTML = `
      <div class="course-block-header" data-ci="${ci}">
        <div class="course-block-title-row">
          <div class="course-icon-badge"><i class="fas fa-folder"></i></div>
          <div>
            <div class="course-name">${escHtml(course.name)}</div>
            ${course.code ? `<div class="course-code">${escHtml(course.code)}</div>` : ''}
          </div>
        </div>
        <div class="course-block-meta">
          <span class="course-resource-count">${countLabel}</span>
          <div class="course-block-actions">
            <button class="btn-icon delete" title="Delete Course" data-action="delete-course" data-ci="${ci}">
              <i class="fas fa-trash-alt"></i>
            </button>
            <button class="btn-icon chevron" title="Toggle" data-action="toggle" data-ci="${ci}">
              <i class="fas fa-chevron-down"></i>
            </button>
          </div>
        </div>
      </div>
      <div class="course-body" data-body="${ci}">
        ${course.description ? `<p style="font-size:0.88rem;color:var(--gray);margin-bottom:1rem;">${escHtml(course.description)}</p>` : ''}
        <div class="resources-list-inner" data-resources="${ci}">
          ${renderResourceRows(course.resources || [], ci)}
        </div>
        <button class="btn-add-resource" data-action="add-resource" data-ci="${ci}">
          <i class="fas fa-plus"></i> Add Resource
        </button>
      </div>
    `;
    list.appendChild(block);
  });

  // Add reveal animation
  document.querySelectorAll('.course-block.reveal').forEach(el => {
    el.classList.add('visible');
  });

  // Bind events
  list.querySelectorAll('[data-action]').forEach(el => {
    el.addEventListener('click', handleCourseAction);
  });

  // Header toggle
  list.querySelectorAll('.course-block-header').forEach(header => {
    header.addEventListener('click', (e) => {
      if (e.target.closest('[data-action]')) return;
      const ci = header.dataset.ci;
      toggleCourseBody(ci, header);
    });
  });
}

function renderResourceRows(resources, ci) {
  if (!resources.length) return `<p style="font-size:0.82rem;color:var(--gray);text-align:center;padding:0.75rem 0;">No resources yet — add one below.</p>`;
  return resources.map((r, ri) => `
    <div class="resource-row" data-ri="${ri}">
      <div class="resource-type-icon ${r.type}"><i class="fas ${typeIcon(r.type)}"></i></div>
      <div class="resource-info">
        <div class="resource-title-text">${escHtml(r.title)}</div>
        ${r.description ? `<div class="resource-desc-text">${escHtml(r.description)}</div>` : `<div class="resource-desc-text">${resourceTypeLabel(r.type)}</div>`}
      </div>
      <div class="resource-row-actions">
        ${r.url ? `<a href="${escHtml(r.url)}" target="_blank" rel="noopener noreferrer" class="btn-resource-action btn-resource-view"><i class="fas fa-eye"></i> View</a>` : ''}
        ${r.url ? `<a href="${escHtml(r.url)}" download class="btn-resource-action btn-resource-download"><i class="fas fa-download"></i> Download</a>` : ''}
        <button class="btn-resource-action btn-resource-delete" data-action="delete-resource" data-ci="${ci}" data-ri="${ri}"><i class="fas fa-times"></i></button>
      </div>
    </div>
  `).join('');
}

function toggleCourseBody(ci, header) {
  const body = document.querySelector(`[data-body="${ci}"]`);
  const chevron = header ? header.querySelector('.btn-icon.chevron') : document.querySelector(`[data-action="toggle"][data-ci="${ci}"]`);
  if (!body) return;
  const isOpen = body.classList.toggle('open');
  if (chevron) chevron.classList.toggle('open', isOpen);
}

function handleCourseAction(e) {
  const action = e.currentTarget.dataset.action;
  const ci = parseInt(e.currentTarget.dataset.ci);
  const ri = e.currentTarget.dataset.ri !== undefined ? parseInt(e.currentTarget.dataset.ri) : null;

  if (action === 'toggle') {
    e.stopPropagation();
    const header = document.querySelector(`.course-block-header[data-ci="${ci}"]`);
    toggleCourseBody(ci, header);
    return;
  }

  if (action === 'delete-course') {
    e.stopPropagation();
    const courses = loadCourses();
    if (confirm(`Delete course "${courses[ci].name}" and all its resources?`)) {
      courses.splice(ci, 1);
      saveCourses(courses);
      renderCourses();
      showToast('Course deleted.', 'error');
    }
    return;
  }

  if (action === 'add-resource') {
    currentCourseIndex = ci;
    // Open body first
    const body = document.querySelector(`[data-body="${ci}"]`);
    const header = document.querySelector(`.course-block-header[data-ci="${ci}"]`);
    if (body && !body.classList.contains('open')) toggleCourseBody(ci, header);
    openAddResourceModal();
    return;
  }

  if (action === 'delete-resource') {
    e.stopPropagation();
    const courses = loadCourses();
    courses[ci].resources.splice(ri, 1);
    saveCourses(courses);
    renderCourses();
    // Re-open that course
    setTimeout(() => {
      const header = document.querySelector(`.course-block-header[data-ci="${ci}"]`);
      const body = document.querySelector(`[data-body="${ci}"]`);
      if (body && !body.classList.contains('open')) toggleCourseBody(ci, header);
    }, 50);
    showToast('Resource removed.');
  }
}

// ---- Escape HTML helper ----
function escHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// ---- Modal: Add Course ----
function openAddCourseModal() {
  document.getElementById('course-name-input').value = '';
  document.getElementById('course-code-input').value = '';
  document.getElementById('course-desc-input').value = '';
  openModal('modal-add-course');
  setTimeout(() => document.getElementById('course-name-input').focus(), 300);
}

document.getElementById('btn-open-add-course').addEventListener('click', openAddCourseModal);
document.getElementById('btn-cancel-course').addEventListener('click', () => closeModal('modal-add-course'));
document.getElementById('btn-close-course-modal').addEventListener('click', () => closeModal('modal-add-course'));

document.getElementById('btn-save-course').addEventListener('click', () => {
  const name = document.getElementById('course-name-input').value.trim();
  if (!name) {
    document.getElementById('course-name-input').focus();
    showToast('Please enter a course name.', 'error');
    return;
  }
  const courses = loadCourses();
  courses.push({
    id: Date.now().toString(),
    name,
    code: document.getElementById('course-code-input').value.trim(),
    description: document.getElementById('course-desc-input').value.trim(),
    resources: []
  });
  saveCourses(courses);
  renderCourses();
  closeModal('modal-add-course');
  showToast(`"${name}" added!`);
  // Auto-open the new course
  setTimeout(() => {
    const ci = courses.length - 1;
    const header = document.querySelector(`.course-block-header[data-ci="${ci}"]`);
    const body = document.querySelector(`[data-body="${ci}"]`);
    if (body && !body.classList.contains('open')) toggleCourseBody(ci, header);
  }, 100);
});

// ---- Modal: Add Resource ----
let currentCourseIndex = null;
let selectedResourceType = 'link';
let selectedFileDataURL = null;
let selectedFileName = null;

function openAddResourceModal() {
  document.getElementById('resource-title-input').value = '';
  document.getElementById('resource-desc-input').value = '';
  document.getElementById('resource-url-input').value = '';
  document.getElementById('resource-file-input').value = '';
  document.getElementById('file-chosen-name').style.display = 'none';
  document.getElementById('file-chosen-name').textContent = '';
  selectedFileDataURL = null;
  selectedFileName = null;

  // Reset type tab to link
  setResourceType('link');
  openModal('modal-add-resource');
  setTimeout(() => document.getElementById('resource-title-input').focus(), 300);
}

function setResourceType(type) {
  selectedResourceType = type;
  document.querySelectorAll('.resource-type-tab').forEach(tab => {
    tab.classList.toggle('active', tab.dataset.type === type);
  });
  const urlGroup = document.getElementById('resource-url-group');
  const fileGroup = document.getElementById('resource-file-group');
  const isFile = ['pdf', 'doc', 'image', 'file'].includes(type);
  urlGroup.style.display = isFile ? 'none' : 'flex';
  fileGroup.style.display = isFile ? 'flex' : 'none';

  // Adjust url placeholder
  const urlInput = document.getElementById('resource-url-input');
  urlInput.placeholder = type === 'video' ? 'https://youtube.com/watch?v=...' : 'https://...';
}

document.querySelectorAll('.resource-type-tab').forEach(tab => {
  tab.addEventListener('click', () => setResourceType(tab.dataset.type));
});

// File drop zone
const dropZone = document.getElementById('file-drop-zone');
const fileInput = document.getElementById('resource-file-input');

dropZone.addEventListener('click', () => fileInput.click());
dropZone.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.classList.add('dragover'); });
dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
dropZone.addEventListener('drop', (e) => {
  e.preventDefault();
  dropZone.classList.remove('dragover');
  if (e.dataTransfer.files.length) handleFileSelect(e.dataTransfer.files[0]);
});
fileInput.addEventListener('change', () => {
  if (fileInput.files.length) handleFileSelect(fileInput.files[0]);
});

function handleFileSelect(file) {
  selectedFileName = file.name;
  const nameEl = document.getElementById('file-chosen-name');
  nameEl.textContent = '📎 ' + file.name;
  nameEl.style.display = 'block';
  if (!document.getElementById('resource-title-input').value) {
    document.getElementById('resource-title-input').value = file.name.replace(/\.[^.]+$/, '');
  }
  // Read as data URL so it can be stored and downloaded
  const reader = new FileReader();
  reader.onload = (e) => { selectedFileDataURL = e.target.result; };
  reader.readAsDataURL(file);
}

document.getElementById('btn-cancel-resource').addEventListener('click', () => closeModal('modal-add-resource'));
document.getElementById('btn-close-resource-modal').addEventListener('click', () => closeModal('modal-add-resource'));

document.getElementById('btn-save-resource').addEventListener('click', () => {
  const title = document.getElementById('resource-title-input').value.trim();
  if (!title) {
    document.getElementById('resource-title-input').focus();
    showToast('Please enter a resource title.', 'error');
    return;
  }
  const isFile = ['pdf', 'doc', 'image', 'file'].includes(selectedResourceType);
  let url = '';
  if (isFile) {
    if (!selectedFileDataURL) {
      showToast('Please select a file to upload.', 'error');
      return;
    }
    url = selectedFileDataURL;
  } else {
    url = document.getElementById('resource-url-input').value.trim();
    if (!url) {
      document.getElementById('resource-url-input').focus();
      showToast('Please enter a URL.', 'error');
      return;
    }
    // Prepend https:// if missing
    if (!url.startsWith('http://') && !url.startsWith('https://')) url = 'https://' + url;
  }

  const courses = loadCourses();
  if (currentCourseIndex === null || !courses[currentCourseIndex]) {
    showToast('Something went wrong. Please try again.', 'error');
    return;
  }
  if (!courses[currentCourseIndex].resources) courses[currentCourseIndex].resources = [];
  courses[currentCourseIndex].resources.push({
    id: Date.now().toString(),
    type: selectedResourceType,
    title,
    description: document.getElementById('resource-desc-input').value.trim(),
    url,
    fileName: selectedFileName || null
  });
  saveCourses(courses);
  renderCourses();
  closeModal('modal-add-resource');
  showToast(`Resource "${title}" added!`);
  // Re-open course body
  const ci = currentCourseIndex;
  setTimeout(() => {
    const header = document.querySelector(`.course-block-header[data-ci="${ci}"]`);
    const body = document.querySelector(`[data-body="${ci}"]`);
    if (body && !body.classList.contains('open')) toggleCourseBody(ci, header);
  }, 100);
});

// ---- Modal open/close helpers ----
function openModal(id) {
  const overlay = document.getElementById(id);
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeModal(id) {
  const overlay = document.getElementById(id);
  overlay.classList.remove('open');
  document.body.style.overflow = '';
}

// Close on overlay click
document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal(overlay.id);
  });
});

// Close on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.open').forEach(o => closeModal(o.id));
  }
});

// ---- Init ----
document.addEventListener('DOMContentLoaded', () => {
  renderCourses();
});
