/* ===========================
   Tabs & routing semplice
   =========================== */
const tabs = [
  { btn: 'btn-ruota',   panel: 'tab-ruota'   },
  { btn: 'btn-tesi',    panel: 'tab-tesi'    },
  { btn: 'btn-foto',    panel: 'tab-foto'    },
  { btn: 'btn-chatgpt', panel: 'tab-chatgpt' },
  { btn: 'btn-extra',   panel: 'tab-extra'   },
];

function activateTab(idBtn){
  tabs.forEach(({btn, panel})=>{
    const b = document.getElementById(btn);
    const p = document.getElementById(panel);
    const active = btn === idBtn;
    if(b){ b.classList.toggle('active', active); b.setAttribute('aria-selected', active ? 'true' : 'false'); }
    if(p){ p.classList.toggle('active', active); }
  });
  const entry = tabs.find(t=>t.btn===idBtn);
  if(entry) history.replaceState(null, '', `#${entry.panel.replace('tab-','')}`);
}

tabs.forEach(({btn})=>{
  const el = document.getElementById(btn);
  if(el) el.addEventListener('click', ()=>activateTab(btn));
});

(function initFromHash(){
  const hash = location.hash.replace('#','');
  if(['ruota','tesi','foto','chatgpt','extra'].includes(hash)) activateTab(`btn-${hash}`);
  else activateTab('btn-ruota');
})();

/* ===========================
   Ruota: segmenti e disegno
   =========================== */
const SEGMENTS = [
  { label: "Cheers.exe",  msg: "Compilazione completata! Esecuzione brindisi avviata. 🥂" },
  { label: "No Bug",      msg: "Nessun bug oggi: solo feature non documentate. 😎" },
  { label: "printf",      msg: 'printf("Grazie per esserci!");' },
  { label: "99.9% Uptime",msg: "Affidabilità da datacenter, ma con cuore umano. ❤️" },
  { label: "Hot Reload",  msg: "Refill automatico del bicchiere abilitato." },
  { label: "Merge",       msg: "PR #2025: Laurea merged su main con approvazione di tutti. ✔️" },
  { label: "Unit Test",   msg: "Test superati: amicizia, pazienza, supporto. ✅" },
  { label: "Garbage Free",msg: "GC completata: solo ricordi belli in memoria. ✨" },
];

const wheel = document.getElementById('wheel');
const spinBtn = document.getElementById('spinBtn');
const modal = document.getElementById('modal');
const resultTitle = document.getElementById('resultTitle');
const resultText  = document.getElementById('resultText');
const closeModal  = document.getElementById('closeModal');

const N = SEGMENTS.length;
const SLICE = 360 / N;
const COLORS = ['#22d3ee','#a78bfa','#38bdf8','#f472b6','#34d399','#fbbf24','#60a5fa','#c084fc'];
const BASE_OFFSET = -90; // puntatore in alto

function drawWheel(){
  if(!wheel) return;
  const stops = SEGMENTS.map((_,i)=>{
    const c = COLORS[i % COLORS.length];
    const a0 = i*SLICE, a1 = (i+1)*SLICE;
    return `${c} ${a0}deg ${a1}deg`;
  }).join(', ');
  wheel.style.background = `conic-gradient(${stops})`;
  wheel.querySelectorAll('.segment-label').forEach(el=>el.remove());
  SEGMENTS.forEach((s,i)=>{
    const label = document.createElement('div');
    label.className = 'segment-label';
    label.textContent = s.label;
    const angle = i*SLICE + SLICE/2;
    label.style.transform = `translate(-50%,-50%) rotate(${angle}deg)`;
    wheel.appendChild(label);
  });
}
drawWheel();

/* ===========================
   Console: typing effect
   =========================== */
const con  = document.getElementById('console');
const con2 = document.getElementById('console2');

const bootLines = [
  '> build project --status success',
  '> deploy graduate.exe',
  '> cheers.exe'
];

function type(text, el){
  return new Promise(res=>{
    let i=0;
    const iv = setInterval(()=>{
      el.append(text[i++] || '');
      if(i===text.length){ clearInterval(iv); res(); }
    }, 18);
  });
}
async function typeLines(lines, el){
  if(!el) return;
  el.textContent = '';
  for(const line of lines){
    await type(line, el);
    el.appendChild(document.createElement('br'));
  }
  const cursor = document.createElement('span');
  cursor.className = 'cursor';
  el.appendChild(cursor);
}
typeLines(bootLines, con);
typeLines(['> init extra','> printf("Grazie!")'], con2);

/* ===========================
   Spin: animazione e risultato
   =========================== */
let spinning = false;
let currentRotation = 0;

function animateSpin(from, to, duration){
  return new Promise(res=>{
    const start = performance.now();
    (function frame(now){
      const t = Math.min(1, (now - start)/duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const val = from + (to - from)*eased;
      if(wheel) wheel.style.transform = `rotate(${val}deg)`;
      if(t < 1) requestAnimationFrame(frame); else res();
    })(start);
  });
}

function showResult(idx){
  const {label, msg} = SEGMENTS[idx];
  if(resultTitle) resultTitle.textContent = label;
  if(resultText)  resultText.textContent  = msg;
  if(modal){
    modal.classList.add('show');
    modal.setAttribute('aria-hidden','false');
  }
  confettiBurst();
}
if(closeModal){
  closeModal.addEventListener('click', ()=>{
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden','true');
  });
}
if(modal){
  modal.addEventListener('click', (e)=>{
    if(e.target===modal){ modal.classList.remove('show'); modal.setAttribute('aria-hidden','true'); }
  });
}

async function spin(){
  if(spinning || !wheel) return;
  spinning = true;
  if(spinBtn) spinBtn.disabled = true;
  wheel.style.filter = 'brightness(1.05)';

  const extraTurns = 4 + Math.floor(Math.random()*3);
  const target = Math.floor(Math.random()*N);

  let segmentCenterDeg = BASE_OFFSET - (target*SLICE + SLICE/2);
  segmentCenterDeg = (segmentCenterDeg % 360 + 360) % 360;

  const targetRotation = extraTurns*360 + segmentCenterDeg;

  await animateSpin(currentRotation, currentRotation + targetRotation, 2300 + Math.random()*1200);
  currentRotation = (currentRotation + targetRotation) % 360;
  wheel.style.filter = 'none';
  showResult(target);
  spinning = false;
  if(spinBtn) spinBtn.disabled = false;
}
if(spinBtn) spinBtn.addEventListener('click', spin);

/* ===========================
   Confetti minimal
   =========================== */
const canvas = document.getElementById('confetti');
const ctx = canvas ? canvas.getContext('2d') : null;
let W, H;
function resize(){ if(!canvas) return; W = canvas.width = innerWidth; H = canvas.height = innerHeight; }
addEventListener('resize', resize); resize();
let confetti = [];
function confettiBurst(){
  if(!ctx) return;
  const n = 140;
  for(let i=0;i<n;i++){
    confetti.push({
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
  confetti = confetti.filter(p=>p.life>0);
  for(const p of confetti){
    p.life--;
    p.vx *= 0.995; p.vy += p.g;
    p.x += p.vx; p.y += p.vy;
    ctx.fillStyle = p.color;
    ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill();
  }
  requestAnimationFrame(tick);
}
tick();
