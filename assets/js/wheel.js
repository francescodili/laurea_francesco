import { SEGMENTS, QUIZ, generateCoupon, CONFIG, randomAward } from "./data.js";
import { burst } from "./confetti.js";

/* ===== Setup ruota ===== */
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
  // Colori degli spicchi
  const stops = SEGMENTS.map((_, i) => {
    const c = COLORS[i % COLORS.length];
    const a0 = i * SLICE, a1 = (i + 1) * SLICE;
    return `${c} ${a0}deg ${a1}deg`;
  }).join(', ');
  wheel.style.background = `conic-gradient(${stops})`;

  // Pulisci vecchie etichette
  wheel.querySelectorAll('.segment-label').forEach(el => el.remove());

  // ====== distanza fissa dal centro (PX) ======
  // Puoi cambiarla qui, oppure via CSS var --wheel-label-gap-center
  const cssGap = parseInt(
    getComputedStyle(document.documentElement)
      .getPropertyValue('--wheel-label-gap-center')
  );
  const GAP_FROM_CENTER = Number.isFinite(cssGap) && cssGap > 64 ? cssGap : 90; 

  // per sicurezza: non superare il bordo
  const RADIUS_LIMIT = (wheel.offsetWidth || wheel.clientWidth) / 2 - 24;
  const radiusPx = Math.min(GAP_FROM_CENTER, RADIUS_LIMIT);

  // Etichette a raggiera
  SEGMENTS.forEach((s, i) => {
    const angle = i * SLICE + SLICE / 2;        // centro dello spicchio
    const onLeft = angle > 90 && angle < 270;   // emisfero sinistro

    const label = document.createElement('div');
    label.className = 'segment-label';
    // centro -> ruota -> esci lungo il raggio di "radiusPx" -> ribalta sul lato sinistro
    label.style.transform =
      `translate(-50%,-50%) rotate(${angle}deg) translateX(${radiusPx}px) ${onLeft ? 'rotate(180deg)' : ''}`;

    const span = document.createElement('span');
    span.className = 'label-text';
    span.textContent = s.label.toUpperCase();

    label.appendChild(span);
    wheel.appendChild(label);
  });
}

/* Animazione spin */
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

/* ===== Quiz a risposta multipla ===== */
function showQuiz(idx){
  const seg = SEGMENTS[idx];
  const q = QUIZ[Math.floor(Math.random()*QUIZ.length)];

  modalTitle.textContent = seg.label;
  modalBody.innerHTML = `
    <p class="result-text">${seg.msg}</p>
    <div class="card" style="margin-top:8px">
      <h3 style="margin:0 0 6px">Quesito</h3>
      <p class="tiny muted" style="margin-bottom:8px">${q.q}</p>
      <div id="quizOptions"></div>
      <p id="quizFeedback" class="tiny" style="color:var(--warn); display:none; margin-top:8px">Risposta errata, riprova 🤏</p>
    </div>
  `;
  modalActions.innerHTML = ``;
  modal.classList.add('show'); modal.setAttribute('aria-hidden','false');

  const opts = document.getElementById('quizOptions');
  opts.innerHTML = q.options.map((opt, i)=>`
    <button class="btn ghost" data-i="${i}" style="width:100%; text-align:left; margin-top:8px">${String.fromCharCode(65+i)}. ${opt}</button>
  `).join('');

  opts.querySelectorAll('button').forEach(b=>{
    b.onclick = ()=>{
      const i = Number(b.dataset.i);
      if(i === q.correctIndex){ showPrize(); }
      else document.getElementById('quizFeedback').style.display = 'block';
    };
  });
}

/* ===== Premio: coupon + PDF generato al volo ===== */
function showPrize(){
  const code = generateCoupon();
  const award = randomAward();
  burst();

  const text = `HAI VINTO ${award.tipo.toUpperCase()} DI ${award.minuti} MINUTI\n\n` +
               `con l'Ing. Dott. Di Liberti.\n` +
               `Codice: ${code}\n` +
               `Mostra questo coupon per il riscatto.`;

  const blob = generateSimplePdfBlob(`Coupon — ${code}`, text);
  const url  = URL.createObjectURL(blob);

  modalTitle.textContent = "🎉 Coupon vinto!";
  modalBody.innerHTML = `
    <div class="coupon">
      <h3>Brindisi con l’Ingegnere Bellissimo</h3>
      <p class="tiny muted">Hai vinto <strong>${award.tipo}</strong> di <strong>${award.minuti} minuti</strong>.</p>
      <div class="coupon-code">${code}</div>
      <p class="coupon-hint">Salva uno screenshot <em>oppure</em> scarica il PDF qui sotto.</p>
    </div>
  `;
  modalActions.innerHTML = `
    <a class="btn" href="${url}" download="coupon-${code}.pdf">Scarica PDF</a>
  `;
}

/* ===== PDF minimalista (senza librerie esterne) =====
   Genera un PDF A4 con un blocco di testo mono (semplice ma valido). */
function generateSimplePdfBlob(title, bodyText){
  // PDF minimal (una pagina) — encoding molto semplice (Latin-1 friendly)
  const esc = s => s.replace(/\\/g,'\\\\').replace(/\(/g,'\\(').replace(/\)/g,'\\)');
  const text = `${title}\n\n${bodyText}`;
  const contentStream =
    `BT /F1 16 Tf 72 770 Td (${esc(title)}) Tj\n` +
    `0 -28 Td /F1 12 Tf (${esc(bodyText.split('\n')[0]||'')}) Tj\n` +
    bodyText.split('\n').slice(1).map((line,i)=>`0 -18 Td (${esc(line)}) Tj`).join('\n') +
    `\nET`;

  const objects = [];
  const xref = [];
  const w = 595.28, h = 841.89; // A4 in punti
  const add = (s)=>{ xref.push(pdf.length); pdf += s; };

  let pdf = `%PDF-1.4\n`;
  add(`1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj\n`);
  add(`2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj\n`);
  add(`3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 ${w} ${h}] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >> endobj\n`);
  add(`4 0 obj << /Length ${contentStream.length} >> stream\n${contentStream}\nendstream endobj\n`);
  add(`5 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj\n`);

  const xrefPos = pdf.length;
  pdf += `xref\n0 6\n0000000000 65535 f \n`;
  for(const off of xref){ pdf += String(off).padStart(10,'0') + ` 00000 n \n`; }
  pdf += `trailer << /Size 6 /Root 1 0 R >>\nstartxref\n${xrefPos}\n%%EOF`;

  return new Blob([pdf], {type:'application/pdf'});
}

function hideModal(){
  modal.classList.remove('show');
  modal.setAttribute('aria-hidden','true');
}
