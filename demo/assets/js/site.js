/* Page behaviour.
   All motion comes from one idea — measurement. Rules draw themselves, a gauge
   sweeps the stat band, photography drifts against the scroll, content settles.
   Everything here no-ops under prefers-reduced-motion. */
(function(){
  'use strict';
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasIO   = 'IntersectionObserver' in window;

  /* ---------- generic reveals ---------- */
  var reveals = document.querySelectorAll('.rv');
  if (reduced || !hasIO){
    Array.prototype.forEach.call(reveals, function(el){ el.classList.add('in'); });
  } else {
    var rIO = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if (e.isIntersecting){ e.target.classList.add('in'); rIO.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.06 });
    Array.prototype.forEach.call(reveals, function(el){ rIO.observe(el); });
  }

  /* ---------- chapters: reveal copy, draw the rule, drift the image ---------- */
  var chapters = Array.prototype.slice.call(document.querySelectorAll('.chapter'));
  var onscreen = [];

  if (reduced || !hasIO){
    chapters.forEach(function(c){ c.classList.add('ch-in'); });
  } else {
    var cIO = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if (e.isIntersecting) e.target.classList.add('ch-in');
        var img = e.target.querySelector('picture img');
        if (!img) return;
        var i = onscreen.indexOf(e.target);
        if (e.isIntersecting && i === -1) onscreen.push(e.target);
        else if (!e.isIntersecting && i !== -1){ onscreen.splice(i,1); img.style.transform = ''; }
      });
    }, { rootMargin: '10% 0px 10% 0px', threshold: [0, 0.02, 0.2] });
    chapters.forEach(function(c){ cIO.observe(c); });
  }

  /* ---------- stat band: draw the scale, sweep the gauge, count up ---------- */
  function renderStat(el, value){
    var body = el.dataset.plain ? el.dataset.original
                                : value.toLocaleString('en-US') + (el.dataset.suffix || '');
    el.innerHTML = body;
    if (el.dataset.sup){
      var sup = document.createElement('span');
      sup.className = 'vf'; sup.title = el.dataset.sup; sup.textContent = '°';
      el.appendChild(sup);
    }
  }

  var stats = Array.prototype.slice.call(document.querySelectorAll('.stat'));
  stats.forEach(function(st){
    var b = st.querySelector('b');
    if (b) b.dataset.original = b.textContent.trim();
  });

  function runStat(st){
    st.classList.add('on');
    var b = st.querySelector('b');
    if (!b) return;
    var end = parseInt(b.dataset.count || '0', 10);
    if (reduced || !end || b.dataset.plain){ renderStat(b, end); return; }
    var t0 = null, dur = 1250;
    (function tick(ts){
      if (t0 === null) t0 = ts;
      var k = Math.min(1, (ts - t0) / dur);
      renderStat(b, Math.round(end * (1 - Math.pow(1 - k, 3))));
      if (k < 1) requestAnimationFrame(tick);
    })(performance.now());
  }

  if (hasIO && !reduced){
    var sIO = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if (e.isIntersecting){
          var delay = stats.indexOf(e.target) * 110;
          setTimeout(function(){ runStat(e.target); }, delay);
          sIO.unobserve(e.target);
        }
      });
    }, { threshold: 0.45 });
    stats.forEach(function(st){ sIO.observe(st); });
  } else {
    stats.forEach(function(st){
      st.classList.add('on');
      var b = st.querySelector('b');
      if (b) renderStat(b, parseInt(b.dataset.count || '0', 10));
    });
  }

  /* ---------- the spine, the nav, and the parallax all share one scroll frame ---------- */
  var spine = document.querySelector('.spine');
  var mark  = document.querySelector('.spine-mark');
  var trail = document.querySelector('.spine-trail');
  var num   = document.querySelector('.spine-num');
  var nav   = document.querySelector('.nav');
  var queued = false;

  function frame(){
    queued = false;
    var vh = window.innerHeight;

    if (spine && mark){
      var max = document.documentElement.scrollHeight - vh;
      var p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      var travel = spine.clientHeight - 3;
      var y = p * travel;
      mark.style.top = y + 'px';
      if (num) num.style.top = y + 'px';
      if (trail) trail.style.height = y + 'px';
    }

    if (nav) nav.classList.toggle('condensed', window.scrollY > 120);

    if (!reduced){
      for (var i = 0; i < onscreen.length; i++){
        var ch = onscreen[i], img = ch.querySelector('picture img');
        if (!img) continue;
        var r = ch.getBoundingClientRect();
        // -0.5 when the chapter sits below the fold, +0.5 once it has passed above
        var q = (vh / 2 - (r.top + r.height / 2)) / (vh + r.height);
        img.style.transform = 'translate3d(0,' + (q * 54).toFixed(2) + 'px,0)';
      }
    }
  }

  function onScroll(){ if (!queued){ queued = true; requestAnimationFrame(frame); } }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  frame();

  /* which chapter number the spine is showing */
  if (spine && hasIO){
    var marked = Array.prototype.slice.call(document.querySelectorAll('[data-ch]'));
    var seen = {};
    var nIO = new IntersectionObserver(function(entries){
      entries.forEach(function(e){ seen[e.target.dataset.ch] = e.isIntersecting ? e.intersectionRatio : 0; });
      var best = null, val = 0;
      Object.keys(seen).forEach(function(k){ if (seen[k] > val){ val = seen[k]; best = k; } });
      if (best && num) num.textContent = best;
    }, { rootMargin: '-15% 0px -45% 0px', threshold: [0, 0.1, 0.4, 0.8] });
    marked.forEach(function(el){ nIO.observe(el); });
  }

  /* ---------- prototype form ---------- */
  var form = document.getElementById('rfq-form');
  if (form) form.addEventListener('submit', function(e){
    e.preventDefault();
    var note = document.getElementById('rfq-note');
    if (note) note.textContent = 'Prototype only — this form is not wired to an inbox or CRM yet.';
  });
})();
