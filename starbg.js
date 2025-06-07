const canvas = document.getElementById('starfield');
const ctx = canvas.getContext('2d');
let W, H, stars = [];

// Ajuste la taille du canvas et génère le fond d’étoiles fixes
function resize() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
  stars.length = 0;
  for (let i = 0; i < 200; i++) {
    stars.push({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.2 + 0.3
    });
  }
}
window.addEventListener('resize', resize);
resize();

// Dessine le ciel étoilé de fond
function drawBackground() {
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = '#222';
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = 'rgba(255,255,255,0.8)';
  stars.forEach(s => {
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fill();
  });
}

// Liste des étoiles filantes actives
let shootingStars = [];

// Crée une nouvelle étoile filante
function createShootingStar() {
  // Plage centrée horizontalement (de 25 % à 75 % de W)
  const startX = Math.random() * (W * 0.5) + (W * 0.25);
  const startY = Math.random() * H * 0.3;
  shootingStars.push({
    x: startX,
    y: startY,
    len: Math.random() * 200 + 100,
    angle: Math.PI / 4,
    speed: Math.random() * 6 + 3,
    alpha: 1
  });
}

// Met à jour la position et l’opacité des étoiles filantes
function updateShootingStars() {
  for (let i = shootingStars.length - 1; i >= 0; i--) {
    const s = shootingStars[i];
    s.x     += Math.cos(s.angle) * s.speed;
    s.y     += Math.sin(s.angle) * s.speed;
    s.alpha -= 0.015;
    if (s.alpha <= 0) shootingStars.splice(i, 1);
  }
  // Patience / probabilité de création
  if (Math.random() < 0.015) createShootingStar();
}

// Dessine toutes les étoiles filantes actuelles
function drawShootingStars() {
  shootingStars.forEach(s => {
    const x2 = s.x - Math.cos(s.angle) * s.len;
    const y2 = s.y - Math.sin(s.angle) * s.len;
    const grad = ctx.createLinearGradient(s.x, s.y, x2, y2);
    // Utilisation de la couleur lavender
    grad.addColorStop(0, `rgba(230, 230, 250, ${s.alpha})`);
    grad.addColorStop(1, `rgba(230, 230, 250, 0)`);

    ctx.strokeStyle = grad;
    ctx.lineWidth   = 2;
    ctx.beginPath();
    ctx.moveTo(s.x, s.y);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  });
}

function animate() {
  drawBackground();
  drawShootingStars();
  updateShootingStars();
  requestAnimationFrame(animate);
}

document.addEventListener('DOMContentLoaded', () => {
  const bar = document.getElementById('progress-bar');
  const dot = document.getElementById('progress-dot');
  function updateProgressDot() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress  = docHeight > 0 ? scrollTop / docHeight : 0;
    dot.style.left = `${progress * 100}%`;
  }
  window.addEventListener('scroll',  updateProgressDot);
  window.addEventListener('resize',  updateProgressDot);
  updateProgressDot();
});


animate();