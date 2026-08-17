(()=>{ 
  const getC=()=>window.creditsGet?creditsGet():(typeof credits!=='undefined'?credits:null);
  const setC=v=>{if(window.creditsSet)creditsSet(v);else if(typeof credits!=='undefined')credits=v;};
  let prev=getC();
  setInterval(()=>{ const c=getC(); if(c===null)return;
    if(c!==prev){prev=c;ASTRA.setCarried(c);}                    // наиграл в игре → видно на сайте
    else if(ASTRA.save.carried!==c){setC(ASTRA.save.carried);prev=c;} // перевёл с сайта → в игру
  },400);
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