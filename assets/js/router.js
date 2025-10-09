import { CONFIG } from "./data.js";
import { initWheel } from "./wheel.js";
import { initConfetti } from "./confetti.js";
import { typeLines } from "./typing.js";
import { initGallery } from "./gallery.js";


const routes = [
  { id:"home",    title:"Home",                file:"pages/home.html",    after: initHome },
  { id:"ruota",   title:"Ruota",               file:"pages/ruota.html",   after: initRuota },
  { id:"tesi",    title:"Tesi",                file:"pages/tesi.html",    after: initTesi },
  { id:"foto",    title:"Foto",                file:"pages/foto.html",    after: initFoto },
  { id:"chatgpt", title:"ChatGPT",             file:"pages/chatgpt.html", after: initChatGPT },
  { id:"thanks",  title:"Ringraziamenti",      file:"pages/thanks.html",  after: initThanks },
];

export function getRoutes(){ return routes; }

export async function loadRoute(id){
  const route = routes.find(r=>r.id===id) || routes[0];
  const res = await fetch(route.file, {cache:"no-store"});
  const html = await res.text();
  const app = document.getElementById('app');
  app.innerHTML = html;

  // Bind dinamici per pagine specifiche
  if(route.id === "tesi"){
    const link = app.querySelector('#downloadTesi');
    if(link) link.href = encodeURI(CONFIG.PDF_NAME);
  }
  if(route.id === "foto"){
    const up = app.querySelector('#uploadLink');
    if(up) up.href = CONFIG.UPLOAD_LINK;
    const grid = app.querySelector('#gallery');
    if(grid){
      // Potresti generare da CONFIG.GALLERY; qui lo facciamo lato pagina (vedi pages/foto.html) se vuoi dinamico, decomenta:
      // grid.innerHTML = CONFIG.GALLERY.map((src,i)=>`<figure class="ph"><img src="${src}" alt="Ricordo ${i+1}"><figcaption>Ricordo n.${i+1}</figcaption></figure>`).join('');
    }
  }

  if(typeof route.after === "function") route.after();
  if(!window.__confettiInit){ initConfetti(); window.__confettiInit = true; }
  history.replaceState(null, '', `#${route.id}`);
}

/* ======= after-load per singole pagine ======= */
function initHome(){
  const homeCon = document.getElementById('console');
  if (homeCon) typeLines(['> build project --status success','> deploy graduate.exe','> cheers.exe'], homeCon);
}

function initRuota(){
  initWheel();
}

function initTesi(){
  // URL assoluto della tesi (gestisce sottocartelle)
  const absUrl = new URL(CONFIG.PDF_NAME, location.href).href;

  // download SOLO da pulsante
  const link = document.getElementById('downloadTesi');
  if (link) link.href = absUrl;

  // iframe verso viewer locale
  const iframe = document.getElementById('pdfIframe');
  const status = document.getElementById('pdfStatus');
  if (!iframe) return;

  // Passiamo il PDF come query ?file=...
  const viewerUrl = new URL('pages/pdf-viewer.html', location.href);
  viewerUrl.searchParams.set('file', absUrl);

  // Test veloce che “sembri” un PDF prima di caricare il viewer (opzionale)
  (async ()=>{
    try{
      const res = await fetch(absUrl, {cache:'no-store'});
      const buf = await res.arrayBuffer();
      const u8  = new Uint8Array(buf);
      const isPdf = u8[0]===0x25 && u8[1]===0x50 && u8[2]===0x44 && u8[3]===0x46 && u8[4]===0x2D; // %PDF-
      if(!isPdf) throw new Error('Non è un PDF valido (header mancante)');

      // Se sembra PDF, montiamo il viewer
      iframe.src = viewerUrl.href;
      if (status) status.textContent = '';
    }catch(err){
      if (status) status.textContent = 'Anteprima non disponibile. Scarica la tesi con il pulsante qui sopra.';
      console.error(err);
    }
  })();
}


function initFoto(){
  initGallery();
}

function initChatGPT(){
  const thread = document.getElementById('chatThread');
  if(!thread) return;

  // ---- helper ----
  const elMsg = ({who, html, t})=>{
    const wrap = document.createElement('div');
    wrap.className = `msg ${who==='me' ? 'user' : 'bot'}`;
    wrap.innerHTML = `
      <div class="avatar">${who==='me' ? '👨‍🎓' : '🤖'}</div>
      <div class="bubble">${html}<span class="time">${t||'adesso'}</span></div>
    `;
    return wrap;
  };
  const push = (who, html, t)=>{
    thread.appendChild(elMsg({who, html, t}));
    thread.scrollTop = thread.scrollHeight;
  };

  // ---- seed: loan vs mortgage (HTML, no markdown) ----
  const seed = [
    { who:'me',  html:'ChatGPT, qual è la differenza tra <em>loan</em> e <em>mortgage</em>?', t:'ora' },
    { who:'bot', html:
      '📘 <strong>Loan</strong> è un prestito generico — può essere per comprare un’auto, finanziare gli studi o un progetto.<br>' +
      '🏠 <strong>Mortgage</strong>, invece, è un prestito garantito da un’ipoteca su un immobile: la casa fa da garanzia.<br><br>' +
      'In breve: ogni <em>mortgage</em> è un <em>loan</em>, ma non ogni <em>loan</em> è un <em>mortgage</em>.',
      t:'ora'
    },
    { who:'me',  html:'Ok, e spiegamelo come se fossi un bimbo di 5 anni!', t:'ora' },
    { who:'bot', html:
      'Immagina che ti presti dei mattoncini LEGO.<br>' +
      '• <em>Loan</em>: te li presto e poi me li ridai piano piano.<br>' +
      '• <em>Mortgage</em>: te li presto <strong>per costruire una casa</strong>; se non me li ridai, la casetta diventa mia. 🧱💸',
      t:'ora'
    }
  ];
  seed.forEach(m=>push(m.who, m.html, m.t));

// ---- risposte dinamiche con random + disclaimer + spiegazioni ----
const jokes = [
  'Sai perché i programmatori odiano la natura? 🌳<br>Troppi bug! 🐞',
  'Perché i programmatori preferiscono il buio? 🌙<br>Perché la luce attira i bug!',
  'Cosa hanno in comune un computer e un condizionatore? 💻❄️<br>Dopo aver aperto Windows, smettono di funzionare.',
  // ✅ Battuta con spiegazione estesa
  'Perché i programmatori confondono Halloween e Natale? 🎃🎄<br>' +
  'Perché Oct 31 = Dec 25.<br>' +
  '<small class="muted">Spiegazione: “Oct” significa base 8 (ottale) e “Dec” base 10 (decimale).<br>' +
  'In base 8, il numero 31 equivale a 3×8 + 1 = 25 in base 10.<br>' +
  'Quindi “Oct 31” e “Dec 25” rappresentano lo stesso valore numerico! 🧮</small>',
  'Sai perché i programmatori bevono tanto caffè? ☕<br>Perché dormire è per chi non ha errori nel codice!'
];

const proverbs = [
  'Un saggio cinese disse:<br>“Uomo che corre davanti a macchina... si stanca.<br>Uomo che corre dietro a macchina... si sfinisce.” 🥢',
  'Antico detto cinese:<br>“Uomo con un solo bastoncino... resta affamato.” 🍜',
  'Saggio cinese disse:<br>“Chi guida come l’inferno... prima o poi ci arriva.” 🚗💨',
  'Un vecchio maestro disse:<br>“Quando il codice non funziona... ringrazia, ti sta insegnando qualcosa.” 🧘‍♂️',
  'Proverbio del monte Huang:<br>“Uomo che copia e incolla bene... non fatica due volte.” 🈶️'
];

function joke() {
  const j = jokes[Math.floor(Math.random() * jokes.length)];
  return j + '<br><small class="muted">DISCLAIMER: generata da ChatGPT, per questo non fa ridere.</small>';
}

function advice() {
  const p = proverbs[Math.floor(Math.random() * proverbs.length)];
  return p + '<br><small class="muted">DISCLAIMER: generata da ChatGPT, per questo non fa ridere.</small>';
}




  const flip = () => {
    const side = Math.random() < 0.5 ? 'Testa' : 'Croce';
    return '“Testa o croce?” — Cosa c’entra, Ingegnere Bellissimo? 🤨<br>Comunque... <strong>'+side+'</strong>! 🪙';
  };

  const pep = () =>
    'Focus per 25 minuti, respiro e via.<br>' +
    '• Fai una cosa piccola ma utile;<br>' +
    '• Scrivi log chiari come se li leggessi domani;<br>' +
    '• La perfezione arriva col refactor, non al primo commit. 💪';

  const handlers = {
    joke:  () => joke(),
    advice: () => advice(),
    flip:  () => flip(),
    pep:   () => pep()
  };

  // bottoni quick prompts
  document.querySelectorAll('.qp').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const key = btn.dataset.key;
      push('me', btn.textContent.trim());
      const reply = (handlers[key] && handlers[key]()) || 'Uh? Proviamo con qualcosa di più tecnico 😅';
      push('bot', reply);
    });
  });

  // easter egg: click su 🤖
  thread.addEventListener('click', (e)=>{
    if(e.target?.classList.contains('avatar') && e.target.textContent === '🤖'){
      push('bot', 'Sto già compilando la tua autostima… done ✅');
    }
  });
}




function initThanks(){
  const sel = document.getElementById('whoSelect');
  const zig = document.querySelector('.zigzag');
  if(!sel || !zig) return;

  // 1) Foto/righe originali (snapshot) e rimozione iniziale → niente righe finché non si sceglie
  const original = Array.from(zig.querySelectorAll('.zz-row'));
  original.forEach(r => r.remove());

  // Messaggio guida
  let hint = document.getElementById('zzHint');
  if(!hint){
    hint = document.createElement('p');
    hint.id = 'zzHint';
    hint.className = 'tiny muted';
    hint.style.margin = '4px 0 0';
    hint.textContent = 'Seleziona chi sei per vedere il tuo ringraziamento in cima 🫶';
    zig.before(hint);
  }

  // Utility: shuffle in-place (Fisher–Yates)
  const shuffle = arr => {
    for(let i=arr.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [arr[i],arr[j]]=[arr[j],arr[i]]; }
    return arr;
  };

  // Mappa dal valore del menù al data-cat reale
  const mapWhoToDataCat = (val)=>{
    const k = String(val||'').trim().toLowerCase();
    if (k==='mamma') return 'Mamma e papà';
    if (k==='papà' || k==='papa') return 'Mamma e papà';
    if (k==='martina') return 'Martina';
    if (k==='claudia') return 'Claudietta';
    if (k==='nonna')   return 'Concy';
    if (k==='amici' || k==='amico' || k==='amica') return 'Amici';
    if (k==='scout' || k==='bohscout') return 'Scout';
    if (k==='kora')    return 'Kora';
    if (k==='altro')   return 'Altro';
    return '';
  };

  function renderFor(cat){
    // Svuota contenitore
    zig.innerHTML = '';

    if(!cat){ // nessuna scelta: solo messaggio
      hint.style.display = 'block';
      return;
    }
    hint.style.display = 'none';

    const match = original.filter(r => r.dataset.cat === cat);
    const rest  = original.filter(r => r.dataset.cat !== cat);

    // Ordine: scelto (se esiste) + resto randomico
    const ordered = [...match, ...shuffle(rest.slice())];

    // Ricostruisci zig-zag e highlight del primo
    ordered.forEach((row, i) => {
      row.classList.remove('odd','even','highlight');
      row.classList.add(i % 2 === 0 ? 'odd' : 'even');
      zig.appendChild(row);
    });
    if (ordered.length) ordered[0].classList.add('highlight');
  }

  // Stato iniziale: nessuna riga visibile
  renderFor('');

  // On change → mostra
  sel.addEventListener('change', ()=>{
    const target = mapWhoToDataCat(sel.value);
    renderFor(target);
  });
}
