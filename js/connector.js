(()=>{
const V=Object.assign({player:'player',inv:'inventory',credits:'credits',beacons:'beacons'},window.ASTRA_VARS||{});
const G=n=>{try{if(typeof window[n]!=='undefined')return window[n];return (0,eval)(n);}catch(e){return undefined;}};
const setG=(n,v)=>{try{if(typeof window[n]!=='undefined')window[n]=v;else (0,eval)(n+'='+v);}catch(e){}};
const vis=el=>{const r=el.getBoundingClientRect();return r.width>0&&r.height>0;};

/* 1) кредиты в игре ⇄ сайт */
let prev=G(V.credits);
setInterval(()=>{
  const c=G(V.credits); if(typeof c!=='number')return;
  if(c!==prev){prev=c;ASTRA.setCarried(c);}
  else if(ASTRA.save.carried!==c){setG(V.credits,ASTRA.save.carried);prev=ASTRA.save.carried;}
},400);

/* 2) смерть: монеты в банк, вещи в точку смерти */
let deathMarked=false;
setInterval(()=>{
  const dead=[...document.querySelectorAll('*')].some(el=>el.childElementCount===0&&/ПОГИБ/.test(el.textContent||'')&&vis(el));
  if(dead&&!deathMarked&&!ASTRA.save.death){
    deathMarked=true;
    const p=G(V.player),inv=G(V.inv);
    ASTRA.onDeath(p?{x:p.x|0,y:p.y|0}:{x:0,y:0},Array.isArray(inv)?inv.slice():[]);
    if(Array.isArray(inv))inv.length=0;
    msg('💀 Груз остался в точке гибели — ищи маяк');
  }
  if(dead) injectSiteBtn(); else {deathMarked=false; removeSiteBtn();}
},500);

/* 2.5) кнопка выхода на сайт на экране смерти */
function injectSiteBtn(){
  if(document.getElementById('astraSiteBtn'))return;
  const cands=[...document.querySelectorAll('*')].filter(el=>(el.textContent||'').includes('ВОЗРОДИТЬСЯ')&&vis(el));
  if(!cands.length)return;
  const smallest=cands.sort((a,b)=>a.textContent.length-b.textContent.length)[0];
  const anchor=smallest.closest('button,[onclick],a')||smallest;
  const b=document.createElement('button');
  b.id='astraSiteBtn';
  b.innerHTML='🌐 ВЕРНУТЬСЯ НА САЙТ';
  b.style.cssText='display:block;margin:12px auto 0;padding:12px 28px;background:rgba(10,16,32,.85);border:1px solid #4de3ff88;border-radius:10px;color:#9fdcff;font:700 14px monospace;letter-spacing:.12em;cursor:pointer;box-shadow:0 0 14px #4de3ff33';
  b.onclick=e=>{e.stopPropagation();location.href='index.html';};
  anchor.insertAdjacentElement('afterend',b);
}
function removeSiteBtn(){const b=document.getElementById('astraSiteBtn');if(b)b.remove();}

/* 3) респавн: случайная точка + маяк смерти */
document.addEventListener('click',e=>{
  const t=e.target.closest('button,div');
  if(t&&/ВОЗРОДИТЬСЯ/.test(t.textContent||''))setTimeout(()=>{
    const p=G(V.player);
    if(p){p.x=Math.round((Math.random()*2-1)*10000);p.y=Math.round((Math.random()*2-1)*10000);}
    const d=ASTRA.save.death,b=G(V.beacons);
    if(d&&Array.isArray(b)&&!b.some(x=>x.death))b.push({x:d.x,y:d.y,label:'💀 МЕСТО ГИБЕЛИ',death:true});
    msg('🛸 Респаун в случайной точке. На карте — маяк смерти');
  },100);
},true);

/* 4) долетел до маяка → вернул вещи */
setInterval(()=>{
  const d=ASTRA.save.death,p=G(V.player); if(!d||!p)return;
  if(Math.hypot(p.x-d.x,p.y-d.y)<80){
    const rec=ASTRA.recover(),inv=G(V.inv),b=G(V.beacons);
    if(rec&&Array.isArray(inv))rec.items.forEach(i=>inv.push(i));
    if(Array.isArray(b)){const i=b.findIndex(x=>x.death);if(i>-1)b.splice(i,1);}
    msg('📦 Груз возвращён!');
  }
},300);

/* 5) F10 — перевод из банка + табличка */
addEventListener('keydown',e=>{if(e.key==='F10'){const n=ASTRA.transfer(100);if(n)msg('💠 Банк → борт: +'+n+' ✦');}});
const tag=document.createElement('div');
tag.style.cssText='position:fixed;left:12px;bottom:12px;z-index:99;background:#0a1020cc;border:1px solid #4de3ff55;border-radius:10px;padding:8px 12px;font:12px monospace;color:#9fdcff';
document.body.appendChild(tag);
const paint=()=>tag.innerHTML='🏦 Банк: <b>'+ASTRA.save.bank+' ✦</b> · F10 — перевод 100';
addEventListener('astra-sync',paint);paint();

function msg(t){const d=document.createElement('div');d.textContent=t;
  d.style.cssText='position:fixed;top:18%;left:50%;transform:translateX(-50%);z-index:99;color:#ffc24d;font:700 18px monospace;text-shadow:0 0 12px #000';
  document.body.appendChild(d);setTimeout(()=>d.remove(),2500);}
})();
