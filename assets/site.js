/* AVNI One website - the shared engine for every page.
   1. The header gets a line under it once the reader scrolls.
   2. The small-screen menu button opens and closes the menu.
   3. Anything marked .reveal fades in when it comes on the screen.
   4. Scroll stages: every element with [data-stage] gets --p = 0..1 (how far the reader has scrolled through it).
      Its .step children switch on one by one, and the page's own scene listens to the 'stage' event to move its pictures.
   No library, no tracking, no cookies, nothing sent anywhere. */
(function () {
  'use strict';
  var doc = document.documentElement;
  doc.classList.remove('no-js');
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 1. header line
  var top = document.querySelector('.top');
  function onScrollHeader() { if (top) top.classList.toggle('scrolled', window.scrollY > 8); }

  // 2. small-screen menu
  var btn = document.querySelector('.menu-btn');
  var nav = document.querySelector('.top .nav');
  if (btn && nav) {
    btn.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.addEventListener('click', function (e) { if (e.target.tagName === 'A') nav.classList.remove('open'); });
  }

  // 3. reveal on scroll
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduced) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('in'); });
  }

  // 4. scroll stages
  var stages = Array.prototype.slice.call(document.querySelectorAll('[data-stage]'));
  function stageProgress(el) {
    var r = el.getBoundingClientRect();
    var span = r.height - window.innerHeight;
    if (span <= 0) return r.top < window.innerHeight ? 1 : 0;
    return Math.min(1, Math.max(0, -r.top / span));
  }
  function updateStages() {
    stages.forEach(function (el) {
      var p = reduced ? 1 : stageProgress(el);
      if (el._p === p) return;
      el._p = p;
      el.style.setProperty('--p', p.toFixed(4));
      var steps = el.querySelectorAll('.step');
      var dots = el.querySelectorAll('.progress-rail i');
      var n = steps.length;
      if (n) {
        var idx = Math.min(n - 1, Math.floor(p * n * 0.999));
        if (reduced) idx = -1; // every step is shown as normal text
        steps.forEach(function (s, i) { s.classList.toggle('on', reduced || i === idx); });
        dots.forEach(function (d, i) { d.classList.toggle('on', i <= idx); });
      }
      el.dispatchEvent(new CustomEvent('stage', { detail: { p: p } }));
    });
  }

  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () { ticking = false; onScrollHeader(); updateStages(); });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  window.AvniOne = { reduced: reduced, refresh: function () { stages.forEach(function (s) { s._p = -1; }); updateStages(); } };
  onScrollHeader();
  updateStages();

  // the year in the footer
  var y = document.querySelectorAll('[data-year]');
  y.forEach(function (el) { el.textContent = String(new Date().getFullYear()); });
})();
