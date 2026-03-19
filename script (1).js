/* ── CURSOR ── */
const cursor = document.getElementById('cursor');
const cursorDot = document.getElementById('cursorDot');
let mx = -200, my = -200, cx = -200, cy = -200;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
(function animCursor() {
  cx += (mx - cx) * 0.12;
  cy += (my - cy) * 0.12;
  cursor.style.left = cx + 'px';
  cursor.style.top = cy + 'px';
  cursorDot.style.left = mx + 'px';
  cursorDot.style.top = my + 'px';
  requestAnimationFrame(animCursor);
})();
document.querySelectorAll('a,button,.hs,.tc-btn,.pf').forEach(el => {
  el.addEventListener('mouseenter', () => { cursor.style.width = '60px'; cursor.style.height = '60px'; cursor.style.borderColor = 'var(--red)'; });
  el.addEventListener('mouseleave', () => { cursor.style.width = '40px'; cursor.style.height = '40px'; cursor.style.borderColor = 'var(--gold)'; });
});

/* ── LOADER ── */
const loader = document.getElementById('loader');
const loaderFill = document.getElementById('loaderFill');
const loaderChar = document.getElementById('loaderChar');
const chars = ['范','辉','昊','呼','和','浩','特'];
let charIdx = 0;
const charInterval = setInterval(() => {
  charIdx = (charIdx + 1) % chars.length;
  loaderChar.textContent = chars[charIdx];
}, 200);
let pct = 0;
const fillInterval = setInterval(() => {
  pct += Math.random() * 8 + 2;
  if (pct >= 100) {
    pct = 100;
    clearInterval(fillInterval);
    clearInterval(charInterval);
    setTimeout(() => { loader.classList.add('hidden'); initParticles(); spawnLanterns(); }, 400);
  }
  loaderFill.style.width = pct + '%';
}, 80);

/* ── NAV ── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 60));

const hamburger = document.getElementById('hamburger');
const mobMenu = document.getElementById('mobMenu');
hamburger.addEventListener('click', () => mobMenu.classList.toggle('open'));
document.querySelectorAll('.mob-menu a').forEach(a => a.addEventListener('click', () => mobMenu.classList.remove('open')));

/* ── HERO PARTICLE CANVAS ── */
function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  const ctx = canvas.getContext('2d');
  let W = canvas.width = canvas.offsetWidth;
  let H = canvas.height = canvas.offsetHeight;
  window.addEventListener('resize', () => { W = canvas.width = canvas.offsetWidth; H = canvas.height = canvas.offsetHeight; });
  const particles = Array.from({ length: 80 }, () => ({
    x: Math.random() * W, y: Math.random() * H,
    r: Math.random() * 1.5 + 0.3,
    vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
    a: Math.random()
  }));
  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
      p.a += 0.004;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200,151,58,${0.2 + Math.sin(p.a) * 0.15})`;
      ctx.fill();
    });
    // Draw connecting lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(200,151,58,${0.06 * (1 - dist / 100)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
}

/* ── LANTERNS ── */
function spawnLanterns() {
  const container = document.getElementById('lanterns');
  function createLantern() {
    const l = document.createElement('div');
    l.className = 'lantern';
    l.style.left = (Math.random() * 90 + 5) + '%';
    l.style.bottom = '-60px';
    const dur = 8 + Math.random() * 10;
    l.style.animation = `riseUp ${dur}s linear forwards`;
    const drift = (Math.random() - 0.5) * 60;
    l.style.setProperty('--drift', drift + 'px');
    l.innerHTML = `<div class="ln-flame"></div><div class="ln-body"></div><div class="ln-string"></div>`;
    l.style.opacity = '0';
    container.appendChild(l);
    setTimeout(() => { l.style.opacity = '1'; }, 100);
    setTimeout(() => { l.remove(); }, dur * 1000);
  }
  // Initial burst
  for (let i = 0; i < 6; i++) setTimeout(createLantern, i * 600);
  // Ongoing
  setInterval(() => { if (Math.random() > 0.4) createLantern(); }, 3500);
}

/* ── STARS ── */
const starsEl = document.getElementById('stars');
if (starsEl) {
  for (let i = 0; i < 120; i++) {
    const s = document.createElement('div');
    s.className = 'star';
    s.style.left = Math.random() * 100 + '%';
    s.style.top = Math.random() * 70 + '%';
    const sz = Math.random() * 2 + 1;
    s.style.width = sz + 'px';
    s.style.height = sz + 'px';
    s.style.animationDelay = Math.random() * 3 + 's';
    s.style.animationDuration = (1.5 + Math.random() * 2.5) + 's';
    starsEl.appendChild(s);
  }
}

/* ── PLAZA TIME OF DAY ── */
const sceneWrap = document.getElementById('sceneWrap');
document.querySelectorAll('.tc-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tc-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const t = btn.dataset.t;
    sceneWrap.classList.remove('dusk', 'night');
    if (t !== 'day') sceneWrap.classList.add(t);
  });
});

/* ── SCROLL REVEAL ── */
function revealOnScroll() {
  // Generic reveals
  document.querySelectorAll('.reveal:not(.visible)').forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.88) el.classList.add('visible');
  });
  // Timeline reveals
  document.querySelectorAll('.tl-entry:not(.visible)').forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.85) {
      el.querySelectorAll('.reveal-tl, .tl-box, .tl-node').forEach(c => c.classList.add('visible'));
      el.classList.add('visible');
    }
  });
  // Research grid
  document.querySelectorAll('.reveal-rg:not(.visible)').forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.9) el.classList.add('visible');
  });
  // Publications
  document.querySelectorAll('.pgi:not(.anim-done)').forEach((el, i) => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.92) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = `opacity .5s ease ${i * 0.06}s, transform .5s ease ${i * 0.06}s`;
      requestAnimationFrame(() => { el.style.opacity = '1'; el.style.transform = 'translateY(0)'; });
      el.classList.add('anim-done');
    }
  });
}
window.addEventListener('scroll', revealOnScroll, { passive: true });
revealOnScroll();

// Make tl-box and tl-node also have transition
document.querySelectorAll('.tl-box').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(16px)';
  el.style.transition = 'opacity .6s ease .1s, transform .6s ease .1s';
});
document.querySelectorAll('.tl-box.visible').forEach(el => { el.style.opacity = '1'; el.style.transform = 'none'; });
// Override: just use the reveal-tl class logic
document.querySelectorAll('.tl-entry').forEach(entry => {
  const box = entry.querySelector('.tl-box');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        box.style.opacity = '1';
        box.style.transform = 'translateY(0)';
        obs.unobserve(entry);
      }
    });
  }, { threshold: 0.2 });
  obs.observe(entry);
});

/* ── PUBLICATION FILTER ── */
document.querySelectorAll('.pf').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.pf').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.dataset.f;
    document.querySelectorAll('.pgi').forEach(item => {
      const show = f === 'all' || item.dataset.c === f;
      item.classList.toggle('hidden', !show);
    });
  });
});

/* ── PARALLAX HERO TEXT ── */
window.addEventListener('scroll', () => {
  const heroWrap = document.querySelector('.hero-wrap');
  if (heroWrap) {
    heroWrap.style.transform = `translateY(${window.scrollY * 0.3}px)`;
    heroWrap.style.opacity = 1 - window.scrollY / 500;
  }
}, { passive: true });

/* ── ACTIVE NAV ── */
const sections = document.querySelectorAll('section[id],.origins,.plaza,.journey,.research-s,.works-s');
const navAs = document.querySelectorAll('.nav-ul a');
const ioNav = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navAs.forEach(a => a.classList.remove('active'));
      const a = document.querySelector(`.nav-ul a[href="#${e.target.id}"]`);
      if (a) a.classList.add('active');
    }
  });
}, { threshold: 0.4 });
document.querySelectorAll('[id]').forEach(s => ioNav.observe(s));

/* ── SCROLL PROGRESS BAR ── */
const bar = document.createElement('div');
bar.style.cssText = 'position:fixed;top:0;left:0;height:2px;background:var(--red);z-index:9999;transition:width .1s linear;width:0';
document.body.appendChild(bar);
window.addEventListener('scroll', () => {
  const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight);
  bar.style.width = (pct * 100) + '%';
}, { passive: true });
