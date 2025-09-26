let canvas, ctx, W, H, particles = [];
const COLORS = ['#22d3ee','#a78bfa','#38bdf8','#f472b6','#34d399','#fbbf24','#60a5fa','#c084fc'];

export function initConfetti(){
  canvas = document.getElementById('confetti');
  if(!canvas) return;
  ctx = canvas.getContext('2d');
  const resize = ()=>{ W = canvas.width = innerWidth; H = canvas.height = innerHeight; };
  addEventListener('resize', resize); resize();
  tick();
}

export function burst(){
  if(!ctx) return;
  const n = 140;
  for(let i=0;i<n;i++){
    particles.push({
      x: W/2, y: 80, r: 2+Math.random()*4,
      vx: (Math.random()-0.5)*6, vy: (Math.random()*-6)-2,
      g: 0.15 + Math.random()*0.2,
      life: 120 + Math.random()*60,
      color: COLORS[Math.floor(Math.random()*COLORS.length)]
    });
  }
}

function tick(){
  if(!ctx) return requestAnimationFrame(tick);
  ctx.clearRect(0,0,W,H);
  particles = particles.filter(p=>p.life>0);
  for(const p of particles){
    p.life--; p.vx *= 0.995; p.vy += p.g; p.x += p.vx; p.y += p.vy;
    ctx.fillStyle = p.color; ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill();
  }
  requestAnimationFrame(tick);
}
