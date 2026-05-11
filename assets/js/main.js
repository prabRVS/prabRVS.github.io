/* ================================================================
   PRABHURAM RVS · PORTFOLIO 2026 — interaction layer
   ---------------------------------------------------------------- */
(() => {
  'use strict';

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Page enter ---------------------------------------- */
  window.addEventListener('load', () => {
    requestAnimationFrame(() => {
      setTimeout(() => document.body.dataset.loaded = 'true', 300);
    });
  });

  /* ---------- Year stamp ---------------------------------------- */
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- Nav scroll state ---------------------------------- */
  const nav = document.getElementById('nav');
  const onScroll = () => {
    nav.dataset.scrolled = (window.scrollY > 80) ? 'true' : 'false';
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile nav toggle --------------------------------- */
  const navToggle = nav.querySelector('.nav-toggle');
  if (navToggle) {
    navToggle.addEventListener('click', () => {
      const open = nav.dataset.open === 'true';
      nav.dataset.open = open ? 'false' : 'true';
      navToggle.setAttribute('aria-expanded', String(!open));
    });
    nav.querySelectorAll('.nav-links a').forEach(a => {
      a.addEventListener('click', () => {
        nav.dataset.open = 'false';
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Section observer (active link + reveal) ----------- */
  const sectionMap = {
    hero: { nav: null, idx: 'hero' },
    manifesto: { nav: 'manifesto', idx: 'manifesto' },
    works: { nav: 'works', idx: 'works' },
    archive: { nav: 'archive', idx: 'archive' },
    process: { nav: 'process', idx: 'process' },
    timeline: { nav: 'timeline', idx: 'timeline' },
    contact: { nav: 'contact', idx: 'contact' }
  };
  const navLinks = nav.querySelectorAll('.nav-links a');
  const indexItems = document.querySelectorAll('.section-index li');

  const setActive = (id) => {
    navLinks.forEach(a => a.dataset.active = (a.dataset.link === id) ? 'true' : 'false');
    indexItems.forEach(li => li.dataset.active = (li.dataset.target === id) ? 'true' : 'false');
  };

  // Pick the section closest to viewport's reading line (~28% from top)
  const sectionEls = Object.keys(sectionMap)
    .map(id => document.getElementById(id))
    .filter(Boolean);
  const refLine = () => window.scrollY + window.innerHeight * 0.28;

  const updateActive = () => {
    const r = refLine();
    let best = sectionEls[0]; let bestDist = Infinity;
    sectionEls.forEach(s => {
      const top = s.offsetTop;
      const bottom = top + s.offsetHeight;
      // distance to nearest edge if outside, 0 if inside
      const d = (r >= top && r <= bottom) ? 0 : Math.min(Math.abs(r-top), Math.abs(r-bottom));
      if (d < bestDist) { bestDist = d; best = s; }
    });
    if (best) setActive(best.id);
  };
  let raf = 0;
  const onScrollSection = () => {
    if (raf) return;
    raf = requestAnimationFrame(() => { updateActive(); raf = 0; });
  };
  window.addEventListener('scroll', onScrollSection, { passive: true });
  window.addEventListener('resize', updateActive);
  updateActive();

  /* ---------- Section index click → scroll ---------------------- */
  indexItems.forEach(li => {
    li.addEventListener('click', () => {
      const id = li.dataset.target;
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
    });
  });

  /* ---------- Reveal-on-scroll (decorate then observe) ---------- */
  const revealSelectors = [
    '.manifesto-pull', '.manifesto-body', '.manifesto-card',
    '.project-head', '.project-meta', '.project-hero', '.project-strip',
    '.process-col', '.t-item',
    '.contact-lede', '.contact-card', '.contact-form',
    '.section-header'
  ];
  revealSelectors.forEach(sel => document.querySelectorAll(sel).forEach(el => el.dataset.reveal = ''));

  // Add stagger parents
  document.querySelectorAll('.archive-grid, .adobe-grid, .stack, .method, .data, .hero-stats').forEach(el => {
    el.dataset.revealStagger = '';
  });

  const revealObs = new IntersectionObserver((entries, obs) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.dataset.revealed = 'true';
        obs.unobserve(e.target);
      }
    });
  }, { rootMargin: '0px 0px -40px 0px', threshold: 0 });

  document.querySelectorAll('[data-reveal], [data-reveal-stagger]').forEach(el => revealObs.observe(el));

  /* ---------- Custom cursor ------------------------------------- */
  const cursor = document.querySelector('.cursor');
  const dot = cursor && cursor.querySelector('.cursor-dot');
  const ring = cursor && cursor.querySelector('.cursor-ring');
  let cx = 0, cy = 0, dx = 0, dy = 0, rx = 0, ry = 0;

  if (cursor && !reduced && window.matchMedia('(hover: hover)').matches) {
    document.addEventListener('mousemove', (e) => {
      cx = e.clientX; cy = e.clientY;
      dot.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
    }, { passive: true });

    const tickRing = () => {
      rx += (cx - rx) * 0.18;
      ry += (cy - ry) * 0.18;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      requestAnimationFrame(tickRing);
    };
    requestAnimationFrame(tickRing);

    document.addEventListener('mouseleave', () => cursor.classList.add('hidden'));
    document.addEventListener('mouseenter', () => cursor.classList.remove('hidden'));

    const hoverables = 'a,button,[data-zoom],.card,.chip,.contact-row,.t-card,.scroll-cue';
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(hoverables)) cursor.classList.add('hover');
    });
    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(hoverables)) cursor.classList.remove('hover');
    });
  } else if (cursor) {
    cursor.style.display = 'none';
  }

  /* ---------- Archive filter ----------------------------------- */
  const chips = document.querySelectorAll('.archive-controls .chip');
  const cards = document.querySelectorAll('.archive-grid .card');
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => { c.classList.remove('active'); c.setAttribute('aria-selected', 'false'); });
      chip.classList.add('active');
      chip.setAttribute('aria-selected', 'true');
      const filter = chip.dataset.filter;
      cards.forEach(card => {
        const match = (filter === 'all' || card.dataset.cat === filter);
        card.classList.toggle('is-hidden', !match);
      });
    });
  });

  /* ---------- Lightbox ----------------------------------------- */
  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lbImg');
  const lbCaption = lb.querySelector('.lb-caption');
  const lbCounter = lb.querySelector('.lb-counter');
  const lbClose = lb.querySelector('.lb-close');
  const lbPrev = lb.querySelector('.lb-prev');
  const lbNext = lb.querySelector('.lb-next');
  let lbItems = [];
  let lbIdx = 0;

  const buildItems = (sourceEl) => {
    // For .card with data-pages: show all of those pages
    // For .project-hero / .project-strip figure: show that single image, plus nearby project images
    const list = [];
    const card = sourceEl.closest('.card');
    if (card) {
      const pages = (card.dataset.pages || '').split(',').filter(Boolean);
      const title = card.querySelector('h3')?.textContent || '';
      pages.forEach(n => list.push({ src: `assets/img/p${String(n).padStart(2,'0')}.webp`, caption: title }));
      return list;
    }
    const project = sourceEl.closest('.project');
    if (project) {
      const title = project.querySelector('h2')?.textContent.replace(/\s+/g,' ').trim() || '';
      project.querySelectorAll('img').forEach(img => list.push({ src: img.getAttribute('src'), caption: title }));
      return list;
    }
    // fallback
    const img = sourceEl.querySelector('img') || sourceEl;
    if (img && img.tagName === 'IMG') list.push({ src: img.getAttribute('src'), caption: img.alt || '' });
    return list;
  };

  const openLb = (items, idx = 0) => {
    if (!items.length) return;
    lbItems = items; lbIdx = idx;
    showLb();
    lb.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };
  const showLb = () => {
    const it = lbItems[lbIdx];
    lbImg.src = it.src;
    lbImg.alt = it.caption || '';
    lbCaption.textContent = it.caption || '';
    lbCounter.textContent = `${String(lbIdx+1).padStart(2,'0')} / ${String(lbItems.length).padStart(2,'0')}`;
  };
  const closeLb = () => {
    lb.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };
  const nextLb = () => { lbIdx = (lbIdx + 1) % lbItems.length; showLb(); };
  const prevLb = () => { lbIdx = (lbIdx - 1 + lbItems.length) % lbItems.length; showLb(); };

  lbClose.addEventListener('click', closeLb);
  lbNext.addEventListener('click', nextLb);
  lbPrev.addEventListener('click', prevLb);
  lb.addEventListener('click', (e) => { if (e.target === lb) closeLb(); });
  document.addEventListener('keydown', (e) => {
    if (lb.getAttribute('aria-hidden') === 'true') return;
    if (e.key === 'Escape') closeLb();
    if (e.key === 'ArrowRight') nextLb();
    if (e.key === 'ArrowLeft') prevLb();
  });

  // Wire openers
  document.querySelectorAll('[data-zoom]').forEach(fig => {
    fig.addEventListener('click', () => {
      const items = buildItems(fig);
      // find index of this fig's image
      const src = fig.querySelector('img')?.getAttribute('src');
      const idx = Math.max(0, items.findIndex(i => i.src === src));
      openLb(items, idx);
    });
  });
  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', () => openLb(buildItems(card), 0));
  });

  /* ---------- Hero parallax (subtle) --------------------------- */
  if (!reduced) {
    const heroImg = document.querySelector('.hero-image img');
    if (heroImg) {
      window.addEventListener('scroll', () => {
        const y = Math.min(window.scrollY, 800);
        heroImg.style.transform = `scale(1.03) translateY(${y * 0.04}px)`;
      }, { passive: true });
    }
  }

  /* ---------- Smooth scroll for anchor nav --------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href').slice(1);
      if (!id) return;
      const el = document.getElementById(id);
      if (!el) return;
      e.preventDefault();
      el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
    });
  });

})();
