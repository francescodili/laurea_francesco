import { CONFIG } from "./data.js";
import { initWheel } from "./wheel.js";
import { burst, initConfetti } from "./confetti.js";
import { typeLines } from "./typing.js";

const routes = [
  { id:"ruota",   title:"Ruota della fortuna", file:"pages/ruota.html",   after: initRuota },
  { id:"tesi",    title:"Tesi",                file:"pages/tesi.html",    after: initTesi },
  { id:"foto",    title:"Foto",                file:"pages/foto.html",    after: initFoto },
  { id:"chatgpt", title:"ChatGPT",             file:"pages/chatgpt.html", after: null },
  { id:"extra",   title:"Extra",               file:"pages/extra.html",   after: initExtra },
];

export function getRoutes(){ return routes; }

export async function loadRoute(id){
  const route = routes.find(r=>r.id===id) || routes[0];
  const res = await fetch(route.file, {cache:"no-store"});
  const html = await res.text();
  const app = document.getElementById('app');
  app.innerHTML = html;

  // Piccoli binding dinamici
  if(route.id === "tesi"){
    const link = app.querySelector('#downloadTesi');
    if(link) link.href = encodeURI(CONFIG.PDF_NAME);
  }
  if(route.id === "foto"){
    const up = app.querySelector('#uploadLink');
    if(up) up.href = CONFIG.UPLOAD_LINK;
    // galleria base
    const grid = app.querySelector('#gallery');
    if(grid){
      grid.innerHTML = CONFIG.GALLERY.map((src,i)=>(
        `<figure class="ph"><img src="${src}" alt="Ricordo ${i+1}"><figcaption>Ricordo n.${i+1}</figcaption></figure>`
      )).join('');
    }
  }
  if(route.id === "chatgpt"){
    const grid = app.querySelector('#galleryChatGPT');
    if(grid){
      grid.innerHTML = CONFIG.CHATGPT_GALLERY.map((src,i)=>(
        `<figure class="ph"><img src="${src}" alt="Io + ChatGPT ${i+1}"><figcaption>Io + ChatGPT #${i+1}</figcaption></figure>`
      )).join('');
    }
  }

  // After hooks (ruota, console typing, etc.)
  if(typeof route.after === "function") route.after();

  // Confetti init una volta sola
  if(!window.__confettiInit){ initConfetti(); window.__confettiInit = true; }

  // Hash nella URL
  history.replaceState(null, '', `#${route.id}`);
}

/* ======= after-load per singole pagine ======= */
function initRuota(){
  initWheel();
  const con = document.getElementById('console');
  typeLines(['> build project --status success','> deploy graduate.exe','> cheers.exe'], con);
}
function initTesi(){ /* nulla per ora */ }
function initFoto(){  /* nulla per ora */ }
function initExtra(){
  const con2 = document.getElementById('console2');
  typeLines(['> init extra','> printf("Grazie!")'], con2);
}
