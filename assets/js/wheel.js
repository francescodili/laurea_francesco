import { SEGMENTS, QUIZ, generateCoupon, CONFIG } from "./data.js";
import { burst } from "./confetti.js";

const SLICE = 360 / SEGMENTS.length;
const COLORS = ['#22d3ee','#a78bfa','#38bdf8','#f472b6','#34d399','#fbbf24','#60a5fa','#c084fc'];
const BASE_OFFSET = -90;

let wheel, spinBtn, modal, modalTitle, modalBody, modalActions, closeModal;
let spinning = false, currentRotation = 0;

export function initWheel(){
  wheel        = document.getElementById('wheel');
  spinBtn      = document.getElementById('spinBtn');
  modal        = document.getElementById('modal');
  modalTitle   = document.getElementById('modalTitle');
  modalBody    = document.getElementById('modalBody');
  modalActions = document.getElementById('modalActions');
  closeModal   = document.getElementById('closeModal');

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

  showQuiz(target);
  spinning = false; spinBtn.disabled = false;
}

function showQuiz(idx){
  const seg = SEGMENTS[idx];
  const q = QUIZ[Math.floor(Math.random()*QUIZ.length)];

  modalTitle.textContent = seg.label;
  modalBody.innerHTML = `
    <p class="result-text">${seg.msg}</p>
    <div class="card" style="margin-top:8px">
      <h3 style="margin:0 0 6px">Quesito</h3>
      <p class="tiny muted">${q.q}</p>
      <input id="quizInput" class="btn ghost" style="width:100%; background:#0a0f1b; color:#e5e7eb; padding:10px; border-radius:10px; border:1px solid var(--stroke)" placeholder="Scrivi la risposta..." />
      <p id="quizFeedback" class="tiny" style="color:var(--warn); display:none; margin-top:6px">Risposta errata, riprova 🤏</p>
    </div>
  `;
  modalActions.innerHTML = `<button class="btn" id="submitQuiz">Invia risposta</button>`;
  modal.classList.add('show'); modal.setAttribute('aria-hidden','false');

  document.getElementById('submitQuiz').onclick = ()=>{
    const val = (document.getElementById('quizInput').value || '').trim().toLowerCase();
    const ok = q.a.some(ans => val === ans.toLowerCase());
    if(ok){ showCoupon(); } else {
      const fb = document.getElementById('quizFeedback');
      fb.style.display = 'block';
    }
  };
}

function showCoupon(){
  const code = generateCoupon();
  burst();

  modalTitle.textContent = "🎉 Coupon vinto!";
  modalBody.innerHTML = `
    <div class="coupon">
      <h3>Brindisi con l’Ingegnere Bellissimo</h3>
      <p class="tiny muted">Mostra questo coupon per riscattare il premio.</p>
      <div class="coupon-code" id="couponCode">${code}</div>
      <p class="coupon-hint">Suggerimento: fai uno <strong>screenshot</strong> ora, oppure scarica il PDF.</p>
    </div>
  `;
  modalActions.innerHTML = `
    <a class="btn" href="${CONFIG.COUPON_PDF}" download target="_blank" rel="noopener">Scarica PDF</a>
  `;
}

function hideModal(){
  modal.classList.remove('show');
  modal.setAttribute('aria-hidden','true');
}
