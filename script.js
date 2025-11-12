// Simple interactive behaviors: nav toggle, skill animation on scroll, portfolio modal,
// set copyright year
document.addEventListener('DOMContentLoaded', function () {
  // Year
  document.getElementById('year').textContent = new Date().getFullYear();

  // Mobile nav toggle
  const navToggle = document.getElementById('navToggle');
  const navList = document.getElementById('navList');
  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    navList.classList.toggle('show');
  });

  // Close nav when click a link
  navList.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navList.classList.remove('show');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Skills animation using IntersectionObserver
  const skillSections = document.querySelectorAll('.skill-progress');
  const skillPercents = document.querySelectorAll('.skill-percent');

  if ('IntersectionObserver' in window) {
    const skillObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const percent = parseInt(el.dataset.percent, 10) || 0;
          el.style.width = percent + '%';

          // animate counter for the matching .skill-percent
          const parent = el.closest('.skill');
          if (parent) {
            const counter = parent.querySelector('.skill-percent');
            animateCounter(counter, percent);
          }

          skillObserver.unobserve(el);
        }
      });
    }, {threshold:0.25});

    skillSections.forEach(s => skillObserver.observe(s));
  } else {
    // Fallback: set widths immediately
    skillSections.forEach(s => {
      const percent = parseInt(s.dataset.percent, 10) || 0;
      s.style.width = percent + '%';
    });
    skillPercents.forEach(p => {
      p.textContent = p.dataset.target + '%';
    });
  }

  function animateCounter(el, target) {
    if (!el) return;
    const start = 0;
    const duration = 900;
    const startTime = performance.now();
    function tick(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const value = Math.floor(progress * (target - start) + start);
      el.textContent = value + '%';
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  // Portfolio modal
  const modal = document.getElementById('portfolioModal');
  const modalImg = document.getElementById('modalImg');
  const modalTitle = document.getElementById('modalTitle');
  const modalDesc = document.getElementById('modalDesc');
  const modalLink = document.getElementById('modalLink');
  const modalClose = document.getElementById('modalClose');

  function openModal(data) {
    modalImg.src = data.img;
    modalImg.alt = data.title;
    modalTitle.textContent = data.title;
    modalDesc.textContent = data.desc;
    modalLink.href = data.link || '#';
    modal.setAttribute('aria-hidden', 'false');
  }

  function closeModal() {
    modal.setAttribute('aria-hidden', 'true');
    // clear content for a11y / cleanup
    modalImg.src = '';
    modalTitle.textContent = '';
    modalDesc.textContent = '';
    modalLink.href = '#';
  }

  document.querySelectorAll('.portfolio-item').forEach(item => {
    const data = {
      title: item.dataset.title,
      img: item.dataset.img,
      desc: item.dataset.desc,
      link: item.dataset.link
    };
    item.addEventListener('click', () => openModal(data));
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal(data);
      }
    });
  });

  modalClose.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') {
      closeModal();
    }
  });

  // Smooth scrolling for internal links
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href.length > 1) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) target.scrollIntoView({behavior:'smooth', block:'start'});
      }
    });
  });
});