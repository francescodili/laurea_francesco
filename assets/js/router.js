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
  { id:"thanks",  title:"Ringraziamenti",      file:"pages/thanks.html",  after: null },
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

  // Messaggi seed (carini ma brevi)
  const seed = [
    { who:'me',  text:'Ho 20 min: come spiego la complessità di binary search?', t:'ora' },
    { who:'bot', text:'Parti da “indovina un numero”: ogni tentativo dimezza lo spazio. Nei log2 passi arrivi al bersaglio. Poi formalizzi.', t:'ora' },
    { who:'me',  text:'Refactor di questa funzione spaghetti?', t:'ieri' },
    { who:'bot', text:'Estraggo il parsing, rendo pure la logica, nomi chiari, test veloci. Così capisci cosa rompere prima di romperlo 😄', t:'ieri' }
  ];

  const msgEl = ({who,text,t})=>{
    const wrap = document.createElement('div');
    wrap.className = `msg ${who==='me'?'user':'bot'}`;
    wrap.innerHTML = `
      <div class="avatar">${who==='me'?'👨‍🎓':'🤖'}</div>
      <div class="bubble">${text}<span class="time">${t}</span></div>
    `;
    return wrap;
  };

  seed.forEach(m=>thread.appendChild(msgEl(m)));

  // Prompt veloci → aggiungono una coppia Q/A simpatica
  const replies = {
    spiega:  'Immagina gli array come scaffali: metti le etichette in ordine e trovi le cose a colpo d’occhio.',
    refactor:'Piccoli passi: nomi che raccontano, funzioni pure, side-effect confinati. Il futuro te ringrazia.',
    bug:     'Riproduci, isola, osserva. Poi logga come un poeta: poche righe che dicono tutto.',
    slide:   '“AI + Trasparenza: modelli veloci, motivazioni chiare.” Minimal, punchy, tuo.'
  };
  document.querySelectorAll('.qp').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const key = btn.dataset.key;
      thread.appendChild(msgEl({who:'me', text: btn.textContent, t:'adesso'}));
      thread.appendChild(msgEl({who:'bot', text: replies[key] || 'Done ✅', t:'adesso'}));
      thread.scrollTop = thread.scrollHeight;
    });
  });

  // Piccola galleria “Io + ChatGPT” (usa la stessa di Foto se vuoi)
  const gal = document.getElementById('galleryChatGPT');
  if(gal){
    gal.innerHTML = `
      <figure class="ph"><img src="assets/img/studio.png" alt="studio"></figure>
      <figure class="ph"><img src="assets/img/pub.png" alt="negroni"></figure>
      <figure class="ph"><img src="assets/img/mare.png" alt="mare"></figure>
      <figure class="ph"><img src="assets/img/birra.png" alt="birra"></figure>
    `;
  }
}
