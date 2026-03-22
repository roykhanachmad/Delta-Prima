/* ============================================================
   DELTA PRIMA — main.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     1. MULTI-PAGE NAVIGATION (SPA style)
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  const pages    = document.querySelectorAll('.page');
  const navLinks = document.querySelectorAll('[data-page]');

  function showPage(pageId) {
    pages.forEach(p => p.classList.remove('active'));
    const target = document.getElementById('page-' + pageId);
    if (target) {
      target.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(initReveal, 100);
    }
    // Update active state in navbar
    navLinks.forEach(l => {
      l.classList.toggle('active', l.dataset.page === pageId);
    });
    // Update browser URL hash without scroll
    history.pushState(null, '', '#' + pageId);
  }

  navLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const pageId = link.dataset.page;
      showPage(pageId);
      // Close mobile nav if open
      document.getElementById('mobileNav').classList.remove('open');
      document.getElementById('hamburger').classList.remove('open');
    });
  });

  // Handle hash on load
  const hash = location.hash.replace('#', '') || 'home';
  showPage(hash);


  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     2. TOPBAR hide + NAVBAR sticky
     - Scroll > topbarHeight  → topbar slides up (.hidden), navbar moves to top:0
     - Scroll ≤ topbarHeight  → topbar visible, navbar back to top:38px (floating)
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  const topbar        = document.getElementById('topbar');
  const navbarWrapper = document.getElementById('navbar-wrapper');
  const TOPBAR_H      = topbar ? topbar.offsetHeight : 38; // 38px

  function updateHeader() {
    if (window.scrollY > TOPBAR_H) {
      // Topbar scrolls away
      topbar.classList.add('hidden');
      // Navbar snaps to top:0 and padding collapses
      navbarWrapper.classList.add('is-sticky');
    } else {
      topbar.classList.remove('hidden');
      navbarWrapper.classList.remove('is-sticky');
    }
  }

  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();


  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     3. HAMBURGER / MOBILE MENU
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');
  const mobileClose = document.getElementById('mobileClose');

  hamburger.addEventListener('click', () => {
    const isOpen = mobileNav.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
  });
  mobileClose.addEventListener('click', () => {
    mobileNav.classList.remove('open');
    hamburger.classList.remove('open');
  });


  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     4. PARALLAX — subtle on hero circles
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  const heroCircles = document.querySelector('.hero-circles');
  if (heroCircles) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      if (scrolled < window.innerHeight) {
        heroCircles.style.transform = `translateY(calc(-50% + ${scrolled * 0.12}px))`;
      }
    }, { passive: true });
  }


  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     5. SCROLL REVEAL ANIMATIONS
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  function initReveal() {
    const revealEls = document.querySelectorAll('.page.active .reveal');
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => obs.observe(el));
  }
  initReveal();


  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     6. COUNTER ANIMATION
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  function animateCounter(el, target, duration = 1800) {
    const isDecimal = target % 1 !== 0;
    const start = performance.now();
    const update = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = eased * target;
      el.textContent = isDecimal
        ? current.toFixed(1)
        : Math.floor(current).toLocaleString('id-ID');
      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = isDecimal
        ? target.toFixed(1)
        : target.toLocaleString('id-ID');
    };
    requestAnimationFrame(update);
  }

  const counterObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        if (el.dataset.counted) return;
        el.dataset.counted = 'true';
        const target = parseFloat(el.dataset.target);
        animateCounter(el, target);
        counterObs.unobserve(el);
      }
    });
  }, { threshold: 0.4 });

  document.querySelectorAll('[data-counter]').forEach(el => counterObs.observe(el));


  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     7. TESTIMONIAL CAROUSEL
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  const track   = document.querySelector('.testi-track');
  const dotsWrap = document.querySelector('.car-dots');
  const prevBtn = document.querySelector('.car-prev');
  const nextBtn = document.querySelector('.car-next');

  if (track) {
    const cards = track.querySelectorAll('.testi-card');
    let current = 0;
    const total = cards.length;
    let cardWidth = 0;
    let perView = 3;
    let autoTimer;

    function getPerView() {
      const w = window.innerWidth;
      if (w < 600) return 1;
      if (w < 960) return 2;
      return 3;
    }

    function buildDots() {
      if (!dotsWrap) return;
      dotsWrap.innerHTML = '';
      const numDots = Math.ceil(total / perView);
      for (let i = 0; i < numDots; i++) {
        const dot = document.createElement('button');
        dot.className = 'car-dot' + (i === 0 ? ' active' : '');
        dot.addEventListener('click', () => goTo(i * perView));
        dotsWrap.appendChild(dot);
      }
    }

    function updateDots() {
      if (!dotsWrap) return;
      dotsWrap.querySelectorAll('.car-dot').forEach((d, i) => {
        d.classList.toggle('active', Math.floor(current / perView) === i);
      });
    }

    function measure() {
      perView = getPerView();
      const gap = 20;
      const container = track.parentElement;
      cardWidth = (container.offsetWidth - gap * (perView - 1)) / perView;
      cards.forEach(c => {
        c.style.minWidth = cardWidth + 'px';
        c.style.maxWidth = cardWidth + 'px';
      });
      buildDots();
      goTo(current, false);
    }

    function goTo(index, animate = true) {
      if (!animate) track.style.transition = 'none';
      else track.style.transition = 'transform .45s cubic-bezier(.4,0,.2,1)';
      current = Math.max(0, Math.min(index, total - perView));
      const offset = current * (cardWidth + 20);
      track.style.transform = `translateX(-${offset}px)`;
      requestAnimationFrame(() => {
        if (!animate) track.style.transition = '';
      });
      updateDots();
    }

    function next() { goTo(current + perView); }
    function prev() { goTo(current - perView); }

    if (nextBtn) nextBtn.addEventListener('click', () => { next(); resetAuto(); });
    if (prevBtn) prevBtn.addEventListener('click', () => { prev(); resetAuto(); });

    function startAuto() {
      autoTimer = setInterval(() => {
        if (current + perView >= total) goTo(0);
        else next();
      }, 4500);
    }
    function resetAuto() {
      clearInterval(autoTimer);
      startAuto();
    }

    measure();
    startAuto();
    window.addEventListener('resize', () => {
      measure();
      clearInterval(autoTimer);
      startAuto();
    });
  }


  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     8. FAQ ACCORDION
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      // Close all in same group
      item.closest('.faq-list')
          .querySelectorAll('.faq-item')
          .forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });


  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     9. FAQ CATEGORY FILTER
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  document.querySelectorAll('.faq-cat-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.faq-cat-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.cat;
      document.querySelectorAll('.faq-group').forEach(group => {
        const show = cat === 'all' || group.dataset.cat === cat;
        group.style.display = show ? '' : 'none';
      });
    });
  });


  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     10. LAYANAN FILTER
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      document.querySelectorAll('.prog-card').forEach(card => {
        const show = filter === 'all' || card.dataset.cat === filter;
        card.style.display = show ? '' : 'none';
        card.style.opacity  = show ? '' : '0';
      });
    });
  });


  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     11. QUICK BAND NAVIGATION
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  document.querySelectorAll('.qb-item[data-page]').forEach(item => {
    item.addEventListener('click', () => showPage(item.dataset.page));
  });

});