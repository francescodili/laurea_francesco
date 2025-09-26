export function type(text, el){
    return new Promise(res=>{
      let i=0; const iv = setInterval(()=>{
        el.append(text[i++] || '');
        if(i===text.length){ clearInterval(iv); res(); }
      }, 18);
    });
  }
  
  export async function typeLines(lines, el){
    if(!el) return;
    el.textContent = '';
    for(const line of lines){
      await type(line, el);
      el.appendChild(document.createElement('br'));
    }
    const cursor = document.createElement('span');
    cursor.className = 'cursor';
    el.appendChild(cursor);
  }
  