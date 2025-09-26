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
  /* Non serve JS, è una hero statica. */
}
function initRuota(){
  initWheel();
  const con = document.getElementById('console');
  typeLines(['> build project --status success','> deploy graduate.exe','> cheers.exe'], con);
}
function initTesi(){ /* opzionale */ }
function initFoto(){ /* opzionale */ }
