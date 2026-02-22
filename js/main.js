// ==============================================
// 삼성FENG v3 — Clean & Animated
// ==============================================
document.addEventListener('DOMContentLoaded', () => {

  /* ---- Scroll progress + navbar + back-to-top ---- */
  const prog = document.getElementById('scrollProgress');
  const nav = document.getElementById('navbar');
  const btt = document.getElementById('btt');

  function onScroll() {
    const y = window.scrollY;
    const h = document.documentElement.scrollHeight - window.innerHeight;
    prog.style.width = h > 0 ? (y / h * 100) + '%' : '0';
    nav.classList.toggle('scrolled', y > 50);
    btt.classList.toggle('show', y > 500);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ---- Mobile menu ---- */
  const toggle = document.getElementById('navToggle');
  const menu = document.getElementById('navMenu');
  toggle.addEventListener('click', () => { toggle.classList.toggle('open'); menu.classList.toggle('open'); });
  document.querySelectorAll('.nav-link').forEach(l => l.addEventListener('click', () => { toggle.classList.remove('open'); menu.classList.remove('open'); }));

  /* ---- Active nav ---- */
  const secs = document.querySelectorAll('section[id]');
  function activeNav() {
    const y = window.scrollY + 160;
    secs.forEach(s => {
      const link = document.querySelector(`.nav-link[href="#${s.id}"]`);
      if (link) link.classList.toggle('active', y >= s.offsetTop && y < s.offsetTop + s.offsetHeight);
    });
  }
  window.addEventListener('scroll', activeNav, { passive: true });

  /* ---- Reveal (IntersectionObserver) ---- */
  const revealEls = document.querySelectorAll('.reveal,.reveal-left,.reveal-right');
  const rObs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('vis'); rObs.unobserve(e.target); } });
  }, { threshold: 0.08, rootMargin: '0px 0px -20px 0px' });
  revealEls.forEach(el => rObs.observe(el));

  /* ---- Counter ---- */
  const counters = document.querySelectorAll('.counter');
  const cObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { animateNum(e.target, +e.target.dataset.to); cObs.unobserve(e.target); }
    });
  }, { threshold: 0.6 });
  counters.forEach(el => cObs.observe(el));

  function animateNum(el, to) {
    const dur = 1600, start = performance.now();
    function tick(now) {
      const p = Math.min((now - start) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(ease * to);
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  /* ---- Particles ---- */
  const pCont = document.getElementById('particles');
  if (pCont) {
    for (let i = 0; i < 25; i++) {
      const d = document.createElement('div');
      d.className = 'particle';
      const s = Math.random() * 3 + 1;
      d.style.cssText = `width:${s}px;height:${s}px;left:${Math.random()*100}%;bottom:-5%;animation-duration:${Math.random()*7+5}s;animation-delay:${Math.random()*4}s;`;
      pCont.appendChild(d);
    }
  }

  /* ---- Gallery lightbox ---- */
  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lbImg');
  const lbCap = document.getElementById('lbCap');
  const lbCur = document.getElementById('lbCur');
  const lbTot = document.getElementById('lbTot');
  const gItems = document.querySelectorAll('.g-item');
  let idx = 0;
  const gData = Array.from(gItems).map(i => ({ src: i.querySelector('img').src, cap: i.dataset.cap || '' }));
  lbTot.textContent = gData.length;

  gItems.forEach((item, i) => item.addEventListener('click', () => { idx = i; openLb(); }));

  function openLb() {
    lbImg.src = gData[idx].src; lbCap.textContent = gData[idx].cap; lbCur.textContent = idx + 1;
    lb.classList.add('open'); document.body.style.overflow = 'hidden';
  }
  function closeLb() { lb.classList.remove('open'); document.body.style.overflow = ''; }

  lb.querySelector('.lb-close').addEventListener('click', closeLb);
  lb.querySelector('.lb-prev').addEventListener('click', () => { idx = (idx - 1 + gData.length) % gData.length; openLb(); });
  lb.querySelector('.lb-next').addEventListener('click', () => { idx = (idx + 1) % gData.length; openLb(); });
  lb.addEventListener('click', e => { if (e.target.classList.contains('lb-bg')) closeLb(); });
  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') closeLb();
    if (e.key === 'ArrowLeft') { idx = (idx - 1 + gData.length) % gData.length; openLb(); }
    if (e.key === 'ArrowRight') { idx = (idx + 1) % gData.length; openLb(); }
  });

  /* ---- Patent Timeline animations ---- */
  const tl = document.getElementById('patentTimeline');
  if (tl) {
    const tlItems = tl.querySelectorAll('.tl-item');

    // Animate center line when timeline enters viewport
    const tlLineObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { tl.classList.add('tl-animate'); tlLineObs.unobserve(tl); }
      });
    }, { threshold: 0.05 });
    tlLineObs.observe(tl);

    // Staggered reveal for each item
    const tlItemObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('tl-vis');
          tlItemObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    tlItems.forEach((item, i) => {
      item.style.transitionDelay = (i * 0.08) + 's';
      tlItemObs.observe(item);
    });
  }

  /* ---- Smooth anchor scroll ---- */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      const t = document.querySelector(this.getAttribute('href'));
      if (t) { const off = nav.offsetHeight + 10; window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - off, behavior: 'smooth' }); }
    });
  });

});
