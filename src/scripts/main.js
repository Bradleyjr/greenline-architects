// ========================================
// Mobile Navigation Toggle
// ========================================
function initNav() {
  const toggle = document.getElementById('nav-toggle');
  const menu = document.getElementById('nav-menu');
  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('is-open');
    toggle.classList.toggle('is-active', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
    toggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close on link click
  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('is-open');
      toggle.classList.remove('is-active');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open menu');
      document.body.style.overflow = '';
    });
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('is-open')) {
      menu.classList.remove('is-open');
      toggle.classList.remove('is-active');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open menu');
      document.body.style.overflow = '';
      toggle.focus();
    }
  });
}

// ========================================
// Scroll-triggered Nav Background
// ========================================
function initNavScroll() {
  const nav = document.getElementById('site-nav');
  if (!nav) return;

  const observer = new IntersectionObserver(
    ([entry]) => {
      nav.classList.toggle('is-scrolled', !entry.isIntersecting);
    },
    { threshold: 0, rootMargin: '-1px 0px 0px 0px' }
  );

  // Observe a sentinel element at the top
  const sentinel = document.createElement('div');
  sentinel.setAttribute('aria-hidden', 'true');
  sentinel.style.cssText = 'position:absolute;top:0;left:0;width:1px;height:1px;pointer-events:none;';
  document.body.prepend(sentinel);
  observer.observe(sentinel);
}

// ========================================
// Scroll-triggered Reveal Animations
// ========================================
function initReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  );

  elements.forEach(el => observer.observe(el));
}

// ========================================
// Project Filter (Projects Page)
// ========================================
function initProjectFilter() {
  const buttons = document.querySelectorAll('[data-filter]');
  const items = document.querySelectorAll('.projects-grid__item');
  const emptyMsg = document.getElementById('projects-empty');
  if (!buttons.length || !items.length) return;

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      // Update active state
      buttons.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');

      // Filter items
      let visibleCount = 0;
      items.forEach(item => {
        const match = filter === 'all' || item.dataset.category === filter;
        item.classList.toggle('is-hidden', !match);
        if (match) visibleCount++;
      });

      // Empty state
      if (emptyMsg) {
        emptyMsg.hidden = visibleCount > 0;
      }
    });
  });
}

// ========================================
// Initialize
// ========================================
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initNavScroll();
  initReveal();
  initProjectFilter();
});
