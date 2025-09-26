import { SEGMENTS } from "./data.js";
import { burst } from "./confetti.js";

const SLICE = 360 / SEGMENTS.length;
const COLORS = ['#22d3ee','#a78bfa','#38bdf8','#f472b6','#34d399','#fbbf24','#60a5fa','#c084fc'];
const BASE_OFFSET = -90;  // puntatore in alto

let wheel, spinBtn, modal, resultTitle, resultText, closeModal;
let spinning = false, currentRotation = 0;

export function initWheel(){
  // Query elementi presenti nella pagina ruota
  wheel       = document.getElementById('wheel');
  spinBtn     = document.getElementById('spinBtn');
  modal       = document.getElementById('modal');
  resultTitle = document.getElementById('resultTitle');
  resultText  = document.getElementById('resultText');
  closeModal  = document.getElementById('closeModal');

  if(!wheel || !spinBtn) return;

  drawWheel();
  spinBtn.addEventListener('click', spin);
  if(closeModal) closeModal.addEventListener('click', hideModal);
  if(modal) modal.addEventListener('click', (e)=>{ if(e.target===modal) hideModal(); });
}

function drawWheel(){
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

function animate(from, to, duration){
  return new Promise(res=>{
    const start = performance.now();
    (function frame(now){
      const t = Math.min(1, (now - start)/duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const val = from + (to - from)*eased;
      wheel.style.transform = `rotate(${val}deg)`;
      if(t < 1) requestAnimationFrame(frame); else res();
    })(start);
  });
}

async function spin(){
  if(spinning) return;
  spinning = true;
  spinBtn.disabled = true;
  wheel.style.filter = 'brightness(1.05)';

  const extraTurns = 4 + Math.floor(Math.random()*3);
  const target = Math.floor(Math.random()*SEGMENTS.length);

  let center = BASE_OFFSET - (target*SLICE + SLICE/2);
  center = (center % 360 + 360) % 360;

  const targetRotation = extraTurns*360 + center;
  await animate(currentRotation, currentRotation + targetRotation, 2300 + Math.random()*1200);
  currentRotation = (currentRotation + targetRotation) % 360;
  wheel.style.filter = 'none';
  showResult(target);
  spinning = false; spinBtn.disabled = false;
}

function showResult(idx){
  const {label, msg} = SEGMENTS[idx];
  if(resultTitle) resultTitle.textContent = label;
  if(resultText)  resultText.textContent  = msg;
  if(modal){
    modal.classList.add('show');
    modal.setAttribute('aria-hidden','false');
  }
  burst();
}
function hideModal(){
  modal.classList.remove('show');
  modal.setAttribute('aria-hidden','true');
}
