import { CONFIG } from "./data.js";
import { initWheel } from "./wheel.js";
import { initConfetti } from "./confetti.js";
import { typeLines } from "./typing.js";

const routes = [
  { id:"home",    title:"Home",                file:"pages/home.html",    after: initHome },
  { id:"ruota",   title:"Ruota",               file:"pages/ruota.html",   after: initRuota },
  { id:"tesi",    title:"Tesi",                file:"pages/tesi.html",    after: initTesi },
  { id:"foto",    title:"Foto",                file:"pages/foto.html",    after: initFoto },
  { id:"chatgpt", title:"ChatGPT",             file:"pages/chatgpt.html", after: null },
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


function initFoto(){ /* opzionale */ }
