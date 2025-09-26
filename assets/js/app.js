import { getRoutes, loadRoute } from "./router.js";

const tabsEl = document.getElementById('tabs');
const routes = getRoutes();

tabsEl.innerHTML = routes.map((r,i)=>`
  <button class="tab ${i===0?'active':''}" role="tab" aria-selected="${i===0}" data-route="${r.id}">
    ${r.title}
  </button>
`).join('');

tabsEl.querySelectorAll('.tab').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    tabsEl.querySelectorAll('.tab').forEach(b=>{ b.classList.remove('active'); b.setAttribute('aria-selected','false'); });
    btn.classList.add('active'); btn.setAttribute('aria-selected','true');
    loadRoute(btn.dataset.route);
  });
});

// Deep link
const hash = location.hash.replace('#','');
const first = routes.some(r=>r.id===hash) ? hash : routes[0].id;
loadRoute(first);
