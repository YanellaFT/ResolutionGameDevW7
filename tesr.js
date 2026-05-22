const canvas = document.getElementById('c');
const ctx = canvas.getContext('2d');
const W = 400, H = 580;
canvas.width = W;
canvas.height = H;

let state = 'home';
let player, flakes, score, misses, spawnTimer, gameSpeed, frameCount;
const MAX_MISS = 5;

// function initGame() {
//   player = { 
//     x: W / 2 - 28, 
//     y: H - 80, 
//     w: 56, 
//     h: 70, 
//     dx: 0 };
//   flakes = [];
//   score = 0;
//   misses = 0;
  spawnTimer = 0;
//   gameSpeed = 1;
  frameCount = 0;
}

// function mkFlake() { --> makeSnowflake
//   const speed = (1.2 + Math.random() * 1.2) * gameSpeed;
//   return {
//     x: 20 + Math.random() * (W - 40),
//     y: -15,
//     r: 7 + Math.random() * 5,
//     dy: speed,
//     rot: Math.random() * Math.PI * 2,
//     spin: (Math.random() - .5) * .06
//   };
// }

function drawBG() {
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, '#07101f');
  grad.addColorStop(.6, '#0f2340');
  grad.addColorStop(1, '#1a3358');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = 'rgba(255,255,255,0.55)';
  const stars = [
    [30,40],[80,70],[150,30],[220,55],[310,20],[360,65],
    [70,130],[180,110],[290,90],[380,140],[50,200],
    [130,180],[250,160],[340,200]
  ];
  stars.forEach(([sx, sy]) => {
    ctx.beginPath();
    ctx.arc(sx, sy, 1, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.fillStyle = '#d6ecff';
  ctx.beginPath();
  ctx.ellipse(W / 2, H + 10, W * .65, 38, 0, Math.PI, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#eaf5ff';
  ctx.beginPath();
  ctx.ellipse(W / 2, H + 4, W * .55, 24, 0, Math.PI, Math.PI * 2);
  ctx.fill();
}

function drawSnowman(x, y, w, h) {
  const cx = x + w / 2;

  ctx.fillStyle = 'rgba(0,0,0,.18)';
  ctx.beginPath();
  ctx.ellipse(cx, y + h + 2, w * .4, 7, 0, 0, Math.PI * 2);
  ctx.fill();

  const r1 = w * .28, r2 = w * .22;

  ctx.fillStyle = '#eaf5ff';
  ctx.beginPath();
  ctx.arc(cx, y + h - r1, r1, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#b8d8f0';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(cx, y + h - r1, r1, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = '#f5faff';
  ctx.beginPath();
  ctx.arc(cx, y + h - r1 * 2 - r2 + 2, r2, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#b8d8f0';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(cx, y + h - r1 * 2 - r2 + 2, r2, 0, Math.PI * 2);
  ctx.stroke();

  const sy2 = y + h - r1 * 2 - r2 + 2 + r2 * .55;
  ctx.fillStyle = '#e84040';
  ctx.fillRect(cx - r2 - .5, sy2 - 4, (r2 + .5) * 2, 7);
  ctx.fillStyle = '#c82020';
  ctx.fillRect(cx - r2 - .5, sy2 - 4, (r2 + .5) * 2, 2);

  ctx.fillStyle = '#1a3358';
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.arc(cx, y + h - r1 * .7 + i * (r1 * .3) - r1 * .2, 2.5, 0, Math.PI * 2);
    ctx.fill();
  }

  const hy = y + h - r1 * 2 - r2 + 2;
  ctx.fillStyle = '#1a2a3a';
  ctx.beginPath();
  ctx.arc(cx - r2 * .35, hy - r2 * .2, 2.8, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cx + r2 * .35, hy - r2 * .2, 2.8, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#ff8c00';
  ctx.beginPath();
  ctx.moveTo(cx, hy + 1);
  ctx.lineTo(cx + r2 * .55, hy + 1.5);
  ctx.lineTo(cx, hy + 4);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = '#1a2a3a';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(cx, hy + r2 * .3, r2 * .35, .2, Math.PI - .2);
  ctx.stroke();

  ctx.fillStyle = '#1a2a3a';
  ctx.fillRect(cx - r2 * .7, hy - r2 - 2, r2 * 1.4, r2 * .7);
  ctx.fillRect(cx - r2 * .9, hy - r2 + r2 * .7 - 2, r2 * 1.8, 5);
  ctx.fillStyle = '#4fc3f7';
  ctx.fillRect(cx - r2 * .7, hy - r2 + r2 * .5 - 2, r2 * 1.4, 4);

  ctx.strokeStyle = '#8b5e3c';
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(cx - r2, hy + r2 * .3);
  ctx.lineTo(cx - r2 - 14, hy + r2 * .3 - 10);
  ctx.lineTo(cx - r2 - 18, hy + r2 * .3 - 5);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx + r2, hy + r2 * .3);
  ctx.lineTo(cx + r2 + 14, hy + r2 * .3 - 10);
  ctx.lineTo(cx + r2 + 18, hy + r2 * .3 - 5);
  ctx.stroke();
}

function drawSnowflake(f) {
  ctx.save();
  ctx.translate(f.x, f.y);
  ctx.rotate(f.rot);
  // ctx.strokeStyle = 'rgba(200,235,255,0.92)';
  // ctx.lineWidth = 1.8;
  // for (let i = 0; i < 6; i++) {
  //   ctx.save();
  //   ctx.rotate(i * Math.PI / 3);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, f.r);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, f.r * .5);
    ctx.lineTo(f.r * .3, f.r * .75);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, f.r * .5);
    ctx.lineTo(-f.r * .3, f.r * .75);
    ctx.stroke();
    ctx.restore();
  }
  ctx.restore();
}

// function drawHUD() { --> drawScore
  ctx.font = 'bold 18px "Fredoka One", cursive';
  ctx.fillStyle = '#fff';
//   ctx.fillText('❄ ' + score, 14, 34);
//   for (let i = 0; i < MAX_MISS; i++) {
//     ctx.font = '17px serif';
//     ctx.fillStyle = i < (MAX_MISS - misses) ? '#ff6b6b' : 'rgba(255,255,255,.2)';
//     ctx.fillText('♥', W - 14 - i * 22, 34);
//   }
// }

function updateGame() {
  frameCount++;
  gameSpeed = 1 + score * 0.045;

  spawnTimer++;
  const spawnRate = Math.max(28, 70 - score * 1.5);
  if (spawnTimer >= spawnRate) { flakes.push(mkFlake()); spawnTimer = 0; }

  player.x += player.dx;
  player.x = Math.max(0, Math.min(W - player.w, player.x));

  for (let i = flakes.length - 1; i >= 0; i--) {
    const f = flakes[i];
    f.y += f.dy * gameSpeed;
    f.rot += f.spin;

    const px = player.x, py = player.y, pw = player.w;
    if (f.x > px - f.r && f.x < px + pw + f.r && f.y > py && f.y < py + 20) {
      flakes.splice(i, 1);
      score++;
      continue;
    }
    if (f.y > H + 10) { flakes.splice(i, 1); misses++; }
  }

  if (misses >= MAX_MISS) showLose();
}

function showLose() {
  state = 'lose';
  document.getElementById('finalScore').textContent = score;
  let h = '';
  for (let i = 0; i < MAX_MISS; i++) h += '🖤';
  document.getElementById('loseHearts').textContent = h;
  document.getElementById('loseScreen').style.display = 'flex';
}

function loop() {
  if (state !== 'playing') { requestAnimationFrame(loop); return; }
  ctx.clearRect(0, 0, W, H);
  drawBG();
  flakes.forEach(drawSnowflake);
  drawSnowman(player.x, player.y - 10, player.w, player.h);
  drawHUD();
  updateGame();
  requestAnimationFrame(loop);
}

// Keyboard controls
const keys = {};
document.addEventListener('keydown', e => {
  if (e.key === 'ArrowLeft' || e.key === 'a') { player.dx = -5; keys.left = true; }
  if (e.key === 'ArrowRight' || e.key === 'd') { player.dx = 5; keys.right = true; }
});
document.addEventListener('keyup', e => {
  if (e.key === 'ArrowLeft' || e.key === 'a') keys.left = false;
  if (e.key === 'ArrowRight' || e.key === 'd') keys.right = false;
  if (!keys.left && !keys.right) player.dx = 0;
});

// Touch controls
let touchStartX = null;
canvas.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; e.preventDefault(); }, { passive: false });
canvas.addEventListener('touchmove', e => {
  if (touchStartX === null) return;
  const tx = e.touches[0].clientX;
  const rect = canvas.getBoundingClientRect();
  const scale = W / rect.width;
  const targetX = (tx - rect.left) * scale - player.w / 2;
  player.x = Math.max(0, Math.min(W - player.w, targetX));
  e.preventDefault();
}, { passive: false });
canvas.addEventListener('touchend', () => { touchStartX = null; }, { passive: false });

// Buttons
document.getElementById('playBtn').onclick = () => {
  document.getElementById('homeScreen').style.display = 'none';
  state = 'playing';
  initGame();
};
document.getElementById('replayBtn').onclick = () => {
  document.getElementById('loseScreen').style.display = 'none';
  state = 'playing';
  initGame();
};

// Draw initial home BG
(function drawHomeBG() {
  ctx.clearRect(0, 0, W, H);
  drawBG();
  drawSnowman(W / 2 - 28, H - 160, 56, 70);
})();

loop();