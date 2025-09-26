import { CONFIG } from "./data.js";

let slidesTimer = null;
const shuffle = (arr)=>{ for(let i=arr.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [arr[i],arr[j]]=[arr[j],arr[i]]; } return arr; };

export async function initGallery(){
  const grid   = document.getElementById('gallery');
  const status = document.getElementById('galleryStatus');
  const album  = document.getElementById('openAlbum');
  const upload = document.getElementById('uploadLink');
  if(album) album.href = CONFIG.UPLOAD_LINK;
  if(upload) upload.href = CONFIG.UPLOAD_LINK;

  let photos = [];
  try{
    const res = await fetch(CONFIG.PHOTOS_API, { cache:'no-store' });
    if(!res.ok) throw new Error('HTTP '+res.status);
    photos = await res.json();                // [{id, name, url, thumb}, …]
  }catch(e){
    status.textContent = "Impossibile leggere l'album online. Riprova più tardi.";
    console.error(e);
    return;
  }
  if(!Array.isArray(photos) || photos.length===0){
    status.textContent = "Nessuna foto trovata nella cartella condivisa.";
    return;
  }

  shuffle(photos);
  photos = photos.slice(0, CONFIG.PHOTOS_LIMIT || photos.length);

  grid.innerHTML = photos.map((p,i)=>`
    <figure class="ph">
      <img loading="lazy" src="${p.thumb}" data-full="${p.url}" alt="${p.name || ('Ricordo '+(i+1))}">
      <figcaption class="cap">${p.name || ('Ricordo #'+(i+1))}</figcaption>
    </figure>
  `).join('');
  status.textContent = `Mostro ${photos.length} foto dalla cartella condivisa.`;

  // Lightbox
  const lightbox = document.getElementById('lightbox');
  const lightImg = document.getElementById('lightImg');
  grid.querySelectorAll('img').forEach(img=>{
    img.addEventListener('click', ()=>{
      lightImg.src = img.getAttribute('data-full') || img.src;
      lightbox.classList.add('show'); lightbox.setAttribute('aria-hidden','false');
    });
  });
  lightbox.addEventListener('click', (e)=>{ if(e.target===lightbox) { lightbox.classList.remove('show'); lightbox.setAttribute('aria-hidden','true'); } });

  // Azioni
  document.getElementById('shuffleBtn')?.addEventListener('click', ()=> initGallery());

  const slideshowBtn = document.getElementById('slideshowBtn');
  slideshowBtn?.addEventListener('click', ()=>{
    const running = slideshowBtn.getAttribute('aria-pressed') === 'true';
    if(running){
      clearInterval(slidesTimer); slidesTimer=null;
      slideshowBtn.setAttribute('aria-pressed','false'); slideshowBtn.textContent='Slideshow';
    } else {
      const imgs = Array.from(grid.querySelectorAll('img'));
      let idx = 0;
      const open = ()=>{ if(imgs.length===0) return; lightImg.src = imgs[idx%imgs.length].getAttribute('data-full') || imgs[idx%imgs.length].src; lightbox.classList.add('show'); lightbox.setAttribute('aria-hidden','false'); idx++; };
      open();
      slidesTimer = setInterval(open, 2500);
      slideshowBtn.setAttribute('aria-pressed','true'); slideshowBtn.textContent='Stop slideshow';
    }
  });
}
