import { SEGMENTS, QUIZ, generateCoupon, CONFIG, randomAward } from "./data.js";
import { burst } from "./confetti.js";

/* ===== Setup ruota ===== */
const SLICE = 360 / SEGMENTS.length;
const BASE_OFFSET = -90;

// Palette viva auto: un colore per spicchio, distribuiti sull’intero cerchio HSL
const COLORS = Array.from({length: SEGMENTS.length}, (_, i) => {
  const hue = (i * (360 / SEGMENTS.length) + 200) % 360; // shift per stare nel blu/viola/ciano
  return `hsl(${hue} 85% 60%)`;
});


let wheel, spinBtn, modal, modalTitle, modalBody, modalActions, closeModal;
let spinning = false, currentRotation = 0;
// --- chiusura modale a prova di race/ricreazioni ---
function closeModalSafely(){
  if (!modal) return;
  modal.classList.remove('show');
  modal.setAttribute('aria-hidden', 'true');
  if (closeModal) closeModal.style.display = ''; // ripristina l'X di default se l'avevi nascosta
}


export function initWheel(){
  wheel        = document.getElementById('wheel');
  spinBtn      = document.getElementById('spinBtn');
  modal        = document.getElementById('modal');
  modalTitle   = document.getElementById('modalTitle');
  modalBody    = document.getElementById('modalBody');
  modalActions = document.getElementById('modalActions');
  closeModal   = document.getElementById('closeModal');

  // Chiudi modale su click di QUALSIASI elemento con data-close-modal, anche se creato dopo
document.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-close-modal]');
  if (!btn) return;
  e.preventDefault();
  closeModalSafely();
  if (closeModal) closeModal.style.display = ''; // ripristina la "X" di default
});

// Chiudi con ESC
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModalSafely();
});


  // Delegation: chiudi la modale se clicco il bottone dentro modalActions
if (modalActions) {
  modalActions.addEventListener('click', (e)=>{
    if (e.target.closest('#modalCloseOnce')) {
      closeModalSafely();
      if (closeModal) closeModal.style.display = ''; // ripristina l'X di default
    }
  });
}


  if(!wheel || !spinBtn) return;
  drawWheel();
  spinBtn.addEventListener('click', spin);
  if(closeModal) closeModal.addEventListener('click', closeModalSafely);
  if(modal) modal.addEventListener('click', (e)=>{ if(e.target===modal) closeModalSafely(); });
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

function showQuiz(idx){
  const seg = SEGMENTS[idx];                  // {label, topic}
  const bank = (QUIZ[seg.topic] && QUIZ[seg.topic].length)
    ? QUIZ[seg.topic]
    : QUIZ.misc;

  const q = bank[Math.floor(Math.random() * bank.length)];

  modalTitle.textContent = seg.label;         // titolo = macro-tema
  modalBody.innerHTML = `
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


function showPrize(){
  const code  = generateCoupon();
  const award = randomAward();
  burst();

  // UI del premio (grossa e leggibile)
  modalTitle.textContent = "🎉 Coupon vinto!";
  modalBody.innerHTML = `
    <div class="coupon">
      <div style="border:1px dashed rgba(255,255,255,.16); border-radius:14px; padding:18px; text-align:center;">
        <div class="tiny muted" style="letter-spacing:.2px; margin-bottom:6px">
          Brindisi con l’Ingegnere Bellissimo
        </div>

        <div style="display:flex; align-items:baseline; justify-content:center; gap:14px; margin:4px 0 2px">
          <div style="font-size:64px; font-weight:900; line-height:1;
                      background:linear-gradient(90deg,#22d3ee,#a78bfa);
                      -webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;">
            ${award.minuti}<span style="font-size:.55em; margin-left:2px">’</span>
          </div>
          <div style="text-align:left">
            <div style="font-weight:900; font-size:20px; letter-spacing:.2px; text-transform:uppercase">
              ${award.tipo}
            </div>
            <div class="tiny muted" style="margin-top:2px">durata del premio</div>
          </div>
        </div>

        <div class="coupon-code" style="margin:12px auto 0">${code}</div>
        <p class="coupon-hint" style="margin-top:10px">Salva uno screenshot <em>oppure</em> scarica il PDF qui sotto.</p>
      </div>
    </div>
  `;
if (closeModal) closeModal.style.display = 'none';

  // azioni: un solo "Chiudi" dentro il footer della modale
  const pdfBlob = generatePrettyPdfBlob(code, award);
  const url     = URL.createObjectURL(pdfBlob);

  modalActions.innerHTML = `
  <a class="btn" href="${url}" download="coupon-${code}.pdf">Scarica PDF</a>
  <button class="btn ghost" data-close-modal>Chiudi</button>
`;
if (closeModal) closeModal.style.display = 'none';

  // Nascondi l'eventuale bottone chiudi "di base" (se present

  modal.classList.add('show');
  modal.setAttribute('aria-hidden','false');
}


// Utility: testi PDF “puliti” (niente accenti/emdash)
function sanitizePdfText(s){
  // rimuove diacritici + em/en dash → "-"
  return String(s)
    .normalize('NFD').replace(/\p{Diacritic}/gu,'')
    .replace(/[—–]/g, '-')
    .replace(/\\/g,'\\\\').replace(/\(/g,'\\(').replace(/\)/g,'\\)');
}

/* ===== PDF A4 “pretty” (senza librerie) =====
   - Titolo COUPON + codice
   - Minuti grandi a sx, tipo premio a dx
   - Box codice scuro
*/
function generatePrettyPdfBlob(code, award){
  const W = 595.28, H = 841.89; // A4 pt
  const padL = 72, padT = 96;

  const title     = "COUPON";
  const minutes   = String(award.minuti);
  const prizeType = award.tipo.toUpperCase();

  // stream di contenuto
  let cs = "";

  // Colori (approx): accent grad = uso uno solo nei PDF semplici
  const dark = "0 0 0 rg";             // fill nero
  const gray = "0.15 0.2 0.28 rg";     // fill grigio blu
  const text = "0 0 0 rg";             // testo nero
  const accent = "0.13 0.83 0.93 rg";  // ciano (#22d3ee approx)

  // Titolo COUPON + codice
  cs += "BT /F1 26 Tf " + padL + " " + (H - padT) + " Td " + text +
        " (" + sanitizePdfText(title) + ") Tj ET\n";
  // accent underline
  cs += accent + ` ${padL} ${H - (padT + 8)} ${220} 2 re f\n`;

  // Codice a lato del titolo
  const codeX = padL + 130;
  cs += "BT /F1 18 Tf " + codeX + " " + (H - padT) + " Td " + text +
        " (" + sanitizePdfText(code) + ") Tj ET\n";

  // Minuti enormi a sinistra
  const minutesY = H - (padT + 70);
  cs += "BT /F1 64 Tf " + padL + " " + minutesY + " Td " + text +
        " (" + sanitizePdfText(minutes) + ") Tj ET\n";
  // apostrofo minuto
  cs += "BT /F1 36 Tf " + (padL + 52 + (minutes.length>1 ? 34 : 0)) + " " + (minutesY + 10) + " Td " +
        text + " (') Tj ET\n";

  // Tipo premio a destra (una riga grande)
  const typeX = padL + 170;
  cs += "BT /F1 26 Tf " + typeX + " " + (minutesY + 12) + " Td " + text +
        " (" + sanitizePdfText(prizeType) + ") Tj ET\n";

  // Riga descrittiva
  const desc = "HAI VINTO " + prizeType + " DI " + minutes + " MINUTI";
  cs += "BT /F1 12 Tf " + padL + " " + (minutesY - 48) + " Td " + text +
        " (" + sanitizePdfText(desc) + ") Tj ET\n";

  // Sottotitolo “con Ing. Dott. Di Liberti”
  cs += "BT /F1 12 Tf " + padL + " " + (minutesY - 68) + " Td " + text +
        " (" + sanitizePdfText("con Ing. Dott. Di Liberti") + ") Tj ET\n";

  // Box codice scuro grande
  const boxY = minutesY - 120, boxH = 44, boxW = W - padL*2;
  cs += gray + ` ${padL} ${boxY} ${boxW} ${boxH} re f\n`;
  // Testo codice in bianco (uso “stroking color” per il bianco simulato → 1 1 1 rg)
  cs += "BT /F1 18 Tf " + (padL + 20) + " " + (boxY + 14) + " Td 1 1 1 rg " +
        " (" + sanitizePdfText(code) + ") Tj ET\n";

  // Nota finale
  cs += "BT /F1 12 Tf " + padL + " " + (boxY - 36) + " Td " + text +
        " (" + sanitizePdfText("Mostra questo coupon per il riscatto." ) + ") Tj ET\n";

  // Assemblaggio PDF
  const parts = [];
  const add = s => { xref.push(pdf.length); pdf += s; };

  let pdf = "%PDF-1.4\n";
  const xref = [];

  add(`1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj\n`);
  add(`2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj\n`);
  add(`3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 ${W} ${H}] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >> endobj\n`);
  add(`4 0 obj << /Length ${cs.length} >> stream\n${cs}\nendstream endobj\n`);
  // Helvetica (Type1 WinAnsi)
  add(`5 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj\n`);

  const xrefPos = pdf.length;
  pdf += `xref\n0 6\n0000000000 65535 f \n`;
  for(const off of xref){ pdf += String(off).padStart(10,'0') + " 00000 n \n"; }
  pdf += `trailer << /Size 6 /Root 1 0 R >>\nstartxref\n${xrefPos}\n%%EOF`;

  return new Blob([pdf], { type: 'application/pdf' });
}
