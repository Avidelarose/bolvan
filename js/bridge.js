const ASTRA_KEY='astra_save_v1';
const ASTRA=(()=>{ 
  const def={bank:500,carried:0,inv:[],death:null,lastBonus:null};
  let save=Object.assign({},def,JSON.parse(localStorage.getItem(ASTRA_KEY)||'{}'));
  const emit=()=>window.dispatchEvent(new Event('astra-sync'));
  const commit=()=>{localStorage.setItem(ASTRA_KEY,JSON.stringify(save));emit();};
  addEventListener('storage',e=>{if(e.key===ASTRA_KEY){save=Object.assign({},def,JSON.parse(e.newValue||'{}'));emit();}});
  return{
    get save(){return save}, commit,
    mut(fn){fn(save);commit();},
    earn(n){save.bank+=n;commit();},                      // заработано в игре → в банк сайта
    pay(n){if(save.bank<n)return false;save.bank-=n;commit();return true;},
    transfer(n){n=Math.max(0,Math.min(n,save.bank));save.bank-=n;save.carried+=n;commit();return n;}, // сайт → игра
    setCarried(n){if(save.carried!==n){save.carried=n;commit();}},
    onDeath(pos,items){                                   // смерть: монеты в банк, вещи в маяк
      save.bank+=save.carried; save.carried=0;
      save.death={x:pos.x,y:pos.y,items:items||[],ts:Date.now()};
      commit();
    },
    recover(){const d=save.death;save.death=null;commit();return d;} // дошёл до маяка → вернул вещи
  };
})();