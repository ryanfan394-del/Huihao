// ═══════════════════════════════════════════
//  HUIHAO FAN · 范惠浩 · Interactive Site JS
// ═══════════════════════════════════════════

// ── CURSOR ──
const cursor = document.getElementById('cursor');
const cursorDot = document.getElementById('cursor-dot');
let mx = -100, my = -100, cx = -100, cy = -100;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
function animCursor() {
  cx += (mx - cx) * 0.15;
  cy += (my - cy) * 0.15;
  cursor.style.left = mx + 'px';
  cursor.style.top  = my + 'px';
  cursorDot.style.left = cx + 'px';
  cursorDot.style.top  = cy + 'px';
  requestAnimationFrame(animCursor);
}
animCursor();
document.querySelectorAll('a, button, .hotspot, .s-tab').forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
});

// ── LOADER ──
const loader = document.getElementById('loader');
const loaderFill = document.getElementById('loader-fill');
let prog = 0;
const progInterval = setInterval(() => {
  prog = Math.min(prog + Math.random() * 8 + 2, 100);
  loaderFill.style.width = prog + '%';
  if (prog >= 100) {
    clearInterval(progInterval);
    setTimeout(() => { loader.classList.add('gone'); initAll(); }, 400);
  }
}, 60);

// ── INIT ALL ──
function initAll() {
  initNav();
  initHeroCanvas();
  initMapCanvas();
  initCourtyard();
  initSeasons();
  initJourneyTimeline();
  initReveal();
}

// ── NAV ──
function initNav() {
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  });
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
    });
  });
  const sections = document.querySelectorAll('.sect[id], .hero[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        navLinks.forEach(a => a.classList.remove('active'));
        const a = document.querySelector(`.nav-links a[href="#${en.target.id}"]`);
        if (a) a.classList.add('active');
      }
    });
  }, { threshold: 0.4 });
  sections.forEach(s => io.observe(s));
}

// ── HERO CANVAS — Starfield + floating particles ──
function initHeroCanvas() {
  const canvas = document.getElementById('hero-canvas');
  const ctx = canvas.getContext('2d');
  let W, H, stars = [], particles = [];

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
    buildStars();
  }

  function buildStars() {
    stars = Array.from({ length: 200 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H * 0.65,
      r: Math.random() * 1.2 + 0.2,
      a: Math.random() * 0.6 + 0.1,
      speed: Math.random() * 0.003 + 0.001,
      phase: Math.random() * Math.PI * 2
    }));
    particles = Array.from({ length: 30 }, () => makeParticle());
  }

  function makeParticle() {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.3,
      vy: -Math.random() * 0.5 - 0.1,
      r: Math.random() * 2 + 0.5,
      a: Math.random() * 0.3 + 0.05,
      life: 0, maxLife: Math.random() * 300 + 100
    };
  }

  let t = 0;
  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Sky gradient
    const sky = ctx.createLinearGradient(0, 0, 0, H);
    sky.addColorStop(0, '#05030a');
    sky.addColorStop(0.5, '#100804');
    sky.addColorStop(1, '#1a100a');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, W, H);

    // Moon glow
    const moonX = W * 0.82, moonY = H * 0.18;
    const moonGlow = ctx.createRadialGradient(moonX, moonY, 0, moonX, moonY, 120);
    moonGlow.addColorStop(0, 'rgba(240,200,100,0.12)');
    moonGlow.addColorStop(1, 'transparent');
    ctx.fillStyle = moonGlow;
    ctx.fillRect(0, 0, W, H);
    ctx.beginPath();
    ctx.arc(moonX, moonY, 28, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(240,220,160,0.08)';
    ctx.fill();

    // Stars
    t += 0.01;
    stars.forEach(s => {
      const a = s.a * (0.6 + 0.4 * Math.sin(t * s.speed * 100 + s.phase));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(240,220,160,${a})`;
      ctx.fill();
    });

    // Horizon silhouette
    ctx.beginPath();
    ctx.moveTo(0, H * 0.62);
    for (let x = 0; x <= W; x += 60) {
      const h = H * 0.62 - Math.sin(x * 0.008) * 40 - Math.sin(x * 0.02) * 20;
      ctx.lineTo(x, h);
    }
    ctx.lineTo(W, H);
    ctx.lineTo(0, H);
    ctx.fillStyle = '#08050a';
    ctx.fill();

    // Ground
    const grd = ctx.createLinearGradient(0, H * 0.7, 0, H);
    grd.addColorStop(0, '#100804');
    grd.addColorStop(1, '#06040a');
    ctx.fillStyle = grd;
    ctx.fillRect(0, H * 0.7, W, H);

    // Floating ember particles
    particles.forEach((p, i) => {
      p.life++;
      p.x += p.vx;
      p.y += p.vy;
      if (p.life > p.maxLife || p.y < -10) particles[i] = makeParticle();
      const lifeRatio = p.life / p.maxLife;
      const alpha = p.a * Math.sin(lifeRatio * Math.PI);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200,134,74,${alpha})`;
      ctx.fill();
    });

    // Subtle scanlines
    for (let y = 0; y < H; y += 4) {
      ctx.fillStyle = 'rgba(0,0,0,0.03)';
      ctx.fillRect(0, y, W, 1);
    }

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  resize();
  draw();
}

// ── MAP CANVAS ──
function initMapCanvas() {
  const canvas = document.getElementById('map-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = 380, H = 380;
  canvas.width = W; canvas.height = H;

  // Background
  ctx.fillStyle = '#05030a';
  ctx.fillRect(0, 0, W, H);

  // Grid
  ctx.strokeStyle = 'rgba(200,134,74,0.06)';
  ctx.lineWidth = 0.5;
  for (let x = 0; x <= W; x += 40) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
  }
  for (let y = 0; y <= H; y += 40) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
  }

  // Terrain dots — scattered
  for (let i = 0; i < 120; i++) {
    const x = Math.random() * W;
    const y = Math.random() * H;
    ctx.beginPath();
    ctx.arc(x, y, Math.random() * 1.5 + 0.3, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(200,134,74,${Math.random() * 0.12 + 0.03})`;
    ctx.fill();
  }

  // Rivers (stylized lines)
  ctx.strokeStyle = 'rgba(100,140,180,0.12)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(40, 80); ctx.bezierCurveTo(100, 120, 160, 100, 200, 140);
  ctx.bezierCurveTo(240, 180, 280, 160, 340, 200);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(0, 260); ctx.bezierCurveTo(80, 240, 160, 260, 220, 245);
  ctx.stroke();

  // Hohhot glow
  const hx = 195, hy = 215;
  const glow = ctx.createRadialGradient(hx, hy, 0, hx, hy, 70);
  glow.addColorStop(0, 'rgba(200,134,74,0.28)');
  glow.addColorStop(1, 'transparent');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);

  // Pulse animation
  let pulse = 0;
  function drawPulse() {
    // Redraw dot area only
    ctx.clearRect(hx - 80, hy - 80, 160, 160);
    const gl = ctx.createRadialGradient(hx, hy, 0, hx, hy, 70);
    gl.addColorStop(0, 'rgba(200,134,74,0.28)');
    gl.addColorStop(1, 'transparent');
    ctx.fillStyle = gl;
    ctx.fillRect(hx - 80, hy - 80, 160, 160);

    pulse += 0.04;
    const pr = 8 + Math.sin(pulse) * 6;
    ctx.beginPath();
    ctx.arc(hx, hy, pr, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(200,134,74,${0.4 - Math.sin(pulse) * 0.3})`;
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(hx, hy, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#c8864a';
    ctx.fill();

    requestAnimationFrame(drawPulse);
  }
  drawPulse();

  // Compass
  ctx.strokeStyle = 'rgba(200,134,74,0.3)';
  ctx.lineWidth = 0.5;
  ctx.beginPath();
  ctx.arc(W - 32, 32, 18, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = '#c8864a';
  ctx.font = '9px Crimson Pro';
  ctx.textAlign = 'center';
  ctx.fillText('N', W - 32, 26);
  ctx.beginPath();
  ctx.moveTo(W - 32, 18); ctx.lineTo(W - 32, 28);
  ctx.strokeStyle = '#c8864a'; ctx.lineWidth = 1.5; ctx.stroke();
}

// ── COURTYARD HOTSPOTS ──
const spotData = {
  main: {
    zh: '正房',
    en: 'Main Hall',
    text: `The main hall — the heart of the courtyard. By tradition it faced due south, flooding every winter room with light when the sun was lowest. This is where the family gathered, where elders held court, where the most important conversations happened.`,
    zh2: '正房——院落的核心。依循传统，朝向正南，在冬日太阳最低时将阳光引入每一个房间。这里是全家人聚集之处，是长辈主持大局的地方，是最重要的对话发生的所在。'
  },
  left: {
    zh: '东厢房',
    en: 'East Wing',
    text: `The side wings housed extended family — aunts, uncles, cousins cycling through. In a farming household, space was communal and privacy was rare. Sounds carried through the courtyard: cooking in the morning, animals at dusk.`,
    zh2: '厢房住着亲戚——姑姑、叔叔、表兄弟姐妹轮流居住。在农家，空间是公共的，私密是稀缺的。声音在院落间流传：清晨的烹饪声，黄昏的牲畜声。'
  },
  right: {
    zh: '仓房',
    en: 'Storehouse',
    text: `Grain, tools, the harvest. Inner Mongolia's winters are brutal — temperatures dropping to -20°C — so the storehouse was prepared months in advance. The weight of autumn harvest determined the comfort of winter.`,
    zh2: '粮食、农具、收成。内蒙古的冬天严酷——气温骤降至零下20°C——所以仓房在数月前便已备好。秋收的丰厚，决定了冬日的安适。'
  },
  well: {
    zh: '水井',
    en: 'The Well',
    text: `Before indoor plumbing, the well was the first stop every morning. In winter, a thick rope and patient hands. The water table here runs deep through the loess plains. Drawing water was a meditation.`,
    zh2: '在自来水之前，水井是每个清晨的第一站。冬天，是一根粗绳和耐心的双手。这里的地下水穿过黄土平原，深埋其中。打水，是一种静心的仪式。'
  },
  tree: {
    zh: '院树',
    en: 'The Courtyard Tree',
    text: `Every old courtyard has its tree — planted by a grandparent, grown with the family. In summer its shade was the coolest spot in the yard. In winter its bare branches held snow like brushwork on white paper.`,
    zh2: '每座老院子都有一棵树——由祖辈种下，与家族一同生长。夏日里，它的阴凉是院中最舒适的角落。冬日里，光秃秃的枝桠托着积雪，如白纸上的墨迹。'
  },
  gate: {
    zh: '大门',
    en: 'The Gate',
    text: `The gate separated the world inside from the world outside. In a farming district, it was rarely locked — neighbors came and went freely. But at night, when the two wooden doors swung shut, the courtyard became its own quiet universe.`,
    zh2: '大门将院内与院外分隔开来。在农业社区，它很少上锁——邻居们自由往来。但夜晚，当两扇木门合上，整个院落便成了自己的宁静宇宙。'
  }
};

function initCourtyard() {
  const popup = document.getElementById('cy-popup');
  const popupBody = document.getElementById('cy-popup-body');
  const closeBtn = document.getElementById('cy-close');

  document.querySelectorAll('.hotspot').forEach(hs => {
    hs.addEventListener('click', () => {
      const id = hs.dataset.spot;
      const d = spotData[id];
      if (!d) return;
      popupBody.innerHTML = `
        <h3>${d.zh}</h3>
        <span class="pop-en">${d.en}</span>
        <p>${d.text}</p>
        <p class="pop-zh">${d.zh2}</p>
      `;
      popup.classList.add('open');
    });
  });

  closeBtn.addEventListener('click', () => popup.classList.remove('open'));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') popup.classList.remove('open'); });
}

// ── SEASONS CANVAS ──
const seasonData = {
  spring: {
    zh: '春 · 播种',
    en: 'Spring · Planting Season',
    body: 'The ground thaws in March. By April the fields are tilled and the first seeds are in the earth. The courtyard fills with the smell of turned soil and the sound of the first swallows.',
    zhBody: '三月，大地解冻。四月，田地翻耕，第一批种子入土。院落里弥漫着翻土的气息，第一声燕鸣划破寂静。',
    bg: ['#060d06', '#0d1a0a', '#0a140c'],
    draw: drawSpring
  },
  summer: {
    zh: '夏 · 生长',
    en: 'Summer · Growth',
    body: 'The Inner Mongolian summer is short but fierce. Crops grow fast under relentless sun. Children run barefoot in the courtyard. The well is visited constantly.',
    zhBody: '内蒙古的夏天短暂而炽热。庄稼在烈日下迅速生长。孩子们赤脚在院子里奔跑。水井成了最频繁的去处。',
    bg: ['#0d0d06', '#1a1a06', '#12120a'],
    draw: drawSummer
  },
  autumn: {
    zh: '秋 · 丰收',
    en: 'Autumn · Harvest',
    body: 'Harvest season — the most important time of year. The whole family works the fields together. The storehouse fills. The air smells of dried corn and turned earth.',
    zhBody: '丰收时节——一年中最重要的时光。全家人一起在田间劳作。仓房渐渐充盈。空气中弥漫着晒干的玉米和翻耕土地的气息。',
    bg: ['#0d0806', '#1a1006', '#120e08'],
    draw: drawAutumn
  },
  winter: {
    zh: '冬 · 寒雪',
    en: 'Winter · The Long Cold',
    body: 'Winter in Hohhot is merciless. Temperatures fall to -20°C. Snow blankets the courtyard for months. The family gathers in the main hall around a coal stove. The world outside disappears.',
    zhBody: '呼和浩特的冬天毫不留情。气温骤降至零下20°C。积雪覆盖院落长达数月。全家人围在正房的煤炉旁取暖。外面的世界消失了。',
    bg: ['#060810', '#080c16', '#060a12'],
    draw: drawWinter
  }
};

let seasonCanvas, seasonCtx, currentSeason = 'spring', seasonAnimId;

function initSeasons() {
  seasonCanvas = document.getElementById('s-canvas');
  seasonCtx = seasonCanvas.getContext('2d');
  resizeSeasonCanvas();
  window.addEventListener('resize', resizeSeasonCanvas);

  document.querySelectorAll('.s-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.s-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentSeason = tab.dataset.s;
      cancelAnimationFrame(seasonAnimId);
      runSeason(currentSeason);
    });
  });

  runSeason(currentSeason);
}

function resizeSeasonCanvas() {
  const stage = document.querySelector('.s-stage');
  if (!stage) return;
  seasonCanvas.width = stage.offsetWidth;
  seasonCanvas.height = stage.offsetHeight;
}

function runSeason(s) {
  const d = seasonData[s];
  const textEl = document.getElementById('s-text');
  textEl.innerHTML = `
    <h3>${d.zh}</h3>
    <span class="s-en">${d.en}</span>
    <p>${d.body}</p>
    <span class="s-zh">${d.zhBody}</span>
  `;
  textEl.style.opacity = 0;
  setTimeout(() => textEl.style.opacity = 1, 100);
  d.draw();
}

function drawSpring() {
  const W = seasonCanvas.width, H = seasonCanvas.height;
  const ctx = seasonCtx;
  let t = 0;

  // Generate petals
  const petals = Array.from({ length: 60 }, () => ({
    x: Math.random() * W, y: Math.random() * H,
    vx: (Math.random() - 0.5) * 0.4,
    vy: Math.random() * 0.5 + 0.2,
    r: Math.random() * 4 + 1.5,
    a: Math.random() * Math.PI * 2,
    va: (Math.random() - 0.5) * 0.04,
    col: `hsl(${320 + Math.random() * 40}, 60%, 75%)`
  }));

  const shoots = Array.from({ length: 25 }, () => ({
    x: Math.random() * W,
    baseY: H * 0.75 + Math.random() * H * 0.2,
    h: Math.random() * 60 + 20,
    w: Math.random() * 1.5 + 0.5
  }));

  function frame() {
    t += 0.01;
    ctx.clearRect(0, 0, W, H);

    // Sky
    const sky = ctx.createLinearGradient(0, 0, 0, H);
    sky.addColorStop(0, '#060d06');
    sky.addColorStop(0.5, '#0d1a0a');
    sky.addColorStop(1, '#0a1a0c');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, W, H);

    // Ground
    ctx.fillStyle = '#081008';
    ctx.fillRect(0, H * 0.7, W, H * 0.3);

    // Green shoots
    shoots.forEach(s => {
      ctx.beginPath();
      ctx.moveTo(s.x, s.baseY);
      ctx.quadraticCurveTo(s.x + Math.sin(t + s.x) * 8, s.baseY - s.h * 0.5, s.x + Math.sin(t * 0.5 + s.x) * 4, s.baseY - s.h);
      ctx.strokeStyle = `rgba(60,180,80,${0.3 + Math.sin(t + s.x) * 0.1})`;
      ctx.lineWidth = s.w;
      ctx.stroke();
    });

    // Petals
    petals.forEach(p => {
      p.x += p.vx + Math.sin(t + p.y * 0.01) * 0.3;
      p.y += p.vy;
      p.a += p.va;
      if (p.y > H + 10) { p.y = -10; p.x = Math.random() * W; }

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.a);
      ctx.beginPath();
      ctx.ellipse(0, 0, p.r, p.r * 0.5, 0, 0, Math.PI * 2);
      ctx.fillStyle = p.col;
      ctx.globalAlpha = 0.55;
      ctx.fill();
      ctx.restore();
    });

    // Fog
    const fog = ctx.createLinearGradient(0, H * 0.6, 0, H * 0.8);
    fog.addColorStop(0, 'transparent');
    fog.addColorStop(1, 'rgba(30,60,30,0.2)');
    ctx.fillStyle = fog;
    ctx.fillRect(0, H * 0.6, W, H * 0.2);

    seasonAnimId = requestAnimationFrame(frame);
  }
  frame();
}

function drawSummer() {
  const W = seasonCanvas.width, H = seasonCanvas.height;
  const ctx = seasonCtx;
  let t = 0;

  const heat = Array.from({ length: 12 }, (_, i) => ({
    x: (i / 12) * W + Math.random() * 40,
    phase: Math.random() * Math.PI * 2
  }));

  const birds = Array.from({ length: 8 }, () => ({
    x: Math.random() * W, y: Math.random() * H * 0.4,
    vx: Math.random() * 0.8 + 0.3, vy: (Math.random() - 0.5) * 0.2,
    wing: 0
  }));

  function frame() {
    t += 0.012;
    ctx.clearRect(0, 0, W, H);

    const sky = ctx.createLinearGradient(0, 0, 0, H);
    sky.addColorStop(0, '#0d0d06');
    sky.addColorStop(0.4, '#1c1c08');
    sky.addColorStop(1, '#1a1a06');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, W, H);

    // Sun glow
    const sunX = W * 0.7, sunY = H * 0.2;
    const sunGlow = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, 160);
    sunGlow.addColorStop(0, 'rgba(255,210,80,0.18)');
    sunGlow.addColorStop(1, 'transparent');
    ctx.fillStyle = sunGlow;
    ctx.fillRect(0, 0, W, H);
    ctx.beginPath();
    ctx.arc(sunX, sunY, 22, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,200,60,0.15)';
    ctx.fill();

    // Crop rows
    for (let x = 0; x < W; x += 18) {
      const sway = Math.sin(t * 0.7 + x * 0.05) * 5;
      ctx.strokeStyle = `rgba(80,160,60,${0.2 + Math.abs(Math.sin(x * 0.1)) * 0.1})`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(x, H * 0.75);
      ctx.quadraticCurveTo(x + sway, H * 0.65, x + sway * 0.5, H * 0.55);
      ctx.stroke();
    }

    // Ground
    ctx.fillStyle = '#100e04';
    ctx.fillRect(0, H * 0.75, W, H * 0.25);

    // Heat shimmer
    heat.forEach(h => {
      const shimmer = ctx.createLinearGradient(h.x, H * 0.5, h.x + 20, H * 0.7);
      shimmer.addColorStop(0, 'transparent');
      shimmer.addColorStop(0.5, `rgba(255,200,80,${0.03 + Math.sin(t + h.phase) * 0.02})`);
      shimmer.addColorStop(1, 'transparent');
      ctx.fillStyle = shimmer;
      ctx.fillRect(h.x, H * 0.5, 20, H * 0.2);
    });

    // Birds
    birds.forEach(b => {
      b.x += b.vx;
      b.y += b.vy + Math.sin(t * 2 + b.x * 0.1) * 0.1;
      b.wing += 0.15;
      if (b.x > W + 20) b.x = -20;
      const wy = Math.sin(b.wing) * 5;
      ctx.strokeStyle = 'rgba(200,134,74,0.4)';
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(b.x - 8, b.y + wy);
      ctx.quadraticCurveTo(b.x, b.y, b.x + 8, b.y + wy);
      ctx.stroke();
    });

    seasonAnimId = requestAnimationFrame(frame);
  }
  frame();
}

function drawAutumn() {
  const W = seasonCanvas.width, H = seasonCanvas.height;
  const ctx = seasonCtx;
  let t = 0;

  const leaves = Array.from({ length: 80 }, () => ({
    x: Math.random() * W,
    y: Math.random() * H,
    vx: (Math.random() - 0.5) * 0.6,
    vy: Math.random() * 0.8 + 0.2,
    r: Math.random() * 5 + 2,
    angle: Math.random() * Math.PI * 2,
    va: (Math.random() - 0.5) * 0.05,
    hue: 20 + Math.random() * 30
  }));

  function frame() {
    t += 0.01;
    ctx.clearRect(0, 0, W, H);

    const sky = ctx.createLinearGradient(0, 0, 0, H);
    sky.addColorStop(0, '#0d0806');
    sky.addColorStop(1, '#1a1008');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, W, H);

    // Golden horizon light
    const horiz = ctx.createRadialGradient(W * 0.4, H * 0.65, 0, W * 0.4, H * 0.65, W * 0.5);
    horiz.addColorStop(0, 'rgba(200,120,40,0.15)');
    horiz.addColorStop(1, 'transparent');
    ctx.fillStyle = horiz;
    ctx.fillRect(0, 0, W, H);

    // Harvested stubble
    for (let x = 0; x < W; x += 14) {
      ctx.strokeStyle = `rgba(160,100,30,${0.12 + Math.sin(x) * 0.04})`;
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(x, H * 0.8);
      ctx.lineTo(x + (Math.random() - 0.5) * 4, H * 0.8 - 12 - Math.random() * 10);
      ctx.stroke();
    }

    ctx.fillStyle = '#0e0904';
    ctx.fillRect(0, H * 0.8, W, H * 0.2);

    // Falling leaves
    leaves.forEach(l => {
      l.x += l.vx + Math.sin(t + l.y * 0.02) * 0.5;
      l.y += l.vy;
      l.angle += l.va;
      if (l.y > H + 10) { l.y = -10; l.x = Math.random() * W; }

      ctx.save();
      ctx.translate(l.x, l.y);
      ctx.rotate(l.angle);
      ctx.beginPath();
      ctx.ellipse(0, 0, l.r, l.r * 0.55, 0, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${l.hue}, 70%, 45%, 0.65)`;
      ctx.fill();
      ctx.restore();
    });

    seasonAnimId = requestAnimationFrame(frame);
  }
  frame();
}

function drawWinter() {
  const W = seasonCanvas.width, H = seasonCanvas.height;
  const ctx = seasonCtx;
  let t = 0;

  const flakes = Array.from({ length: 140 }, () => ({
    x: Math.random() * W,
    y: Math.random() * H,
    vy: Math.random() * 0.8 + 0.3,
    vx: (Math.random() - 0.5) * 0.3,
    r: Math.random() * 2 + 0.3,
    a: Math.random() * 0.7 + 0.2
  }));

  // Snow accumulation
  const snowLine = Array.from({ length: W }, (_, x) => H * 0.75 + Math.sin(x * 0.04) * 12 + Math.random() * 8);

  function frame() {
    t += 0.008;
    ctx.clearRect(0, 0, W, H);

    const sky = ctx.createLinearGradient(0, 0, 0, H);
    sky.addColorStop(0, '#060810');
    sky.addColorStop(1, '#0e0c16');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, W, H);

    // Moon through clouds
    const moonX = W * 0.35, moonY = H * 0.22;
    const moonG = ctx.createRadialGradient(moonX, moonY, 0, moonX, moonY, 80);
    moonG.addColorStop(0, 'rgba(180,200,240,0.18)');
    moonG.addColorStop(1, 'transparent');
    ctx.fillStyle = moonG;
    ctx.fillRect(0, 0, W, H);
    ctx.beginPath();
    ctx.arc(moonX, moonY, 20, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(200,210,240,0.15)';
    ctx.fill();

    // Snow on ground
    ctx.beginPath();
    ctx.moveTo(0, snowLine[0]);
    for (let x = 1; x < W; x++) ctx.lineTo(x, snowLine[x] + Math.sin(t * 0.5 + x * 0.1) * 1);
    ctx.lineTo(W, H);
    ctx.lineTo(0, H);
    ctx.fillStyle = 'rgba(200,210,230,0.08)';
    ctx.fill();

    // Ground dark
    ctx.fillStyle = '#050610';
    ctx.fillRect(0, H * 0.85, W, H * 0.15);

    // Snowflakes
    flakes.forEach(f => {
      f.x += f.vx + Math.sin(t + f.y * 0.01) * 0.2;
      f.y += f.vy;
      if (f.y > H + 5) { f.y = -5; f.x = Math.random() * W; }
      if (f.x > W) f.x = 0; if (f.x < 0) f.x = W;
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200,215,240,${f.a})`;
      ctx.fill();
    });

    // Window light (warm glow from buildings)
    for (let i = 0; i < 3; i++) {
      const wx = W * (0.2 + i * 0.28);
      const wy = H * 0.55;
      const wg = ctx.createRadialGradient(wx, wy, 0, wx, wy, 40);
      wg.addColorStop(0, 'rgba(200,120,40,0.12)');
      wg.addColorStop(1, 'transparent');
      ctx.fillStyle = wg;
      ctx.fillRect(wx - 40, wy - 40, 80, 80);
    }

    seasonAnimId = requestAnimationFrame(frame);
  }
  frame();
}

// ── JOURNEY TIMELINE SCROLL REVEAL ──
function initJourneyTimeline() {
  const nodes = document.querySelectorAll('.jt-node');
  const io = new IntersectionObserver(entries => {
    entries.forEach((en, i) => {
      if (en.isIntersecting) {
        setTimeout(() => en.target.classList.add('visible'), i * 120);
        io.unobserve(en.target);
      }
    });
  }, { threshold: 0.2 });
  nodes.forEach(n => io.observe(n));
}

// ── GENERIC REVEAL ──
function initReveal() {
  const els = document.querySelectorAll('.reveal, .pb');
  els.forEach(el => {
    if (!el.classList.contains('reveal')) {
      el.classList.add('reveal');
    }
  });
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        en.target.classList.add('visible');
        io.unobserve(en.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
}
