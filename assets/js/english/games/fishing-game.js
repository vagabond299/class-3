/* Mini Game 04 — Fishing Game: independent Class 3 English game. */
(() => {
  'use strict';
  window.CLASS3_ENGLISH_MINIGAMES.register('fishing-game',c=>{
    const {esc,norm,pick,shuffle,choosePool,uniq,roundBase,question,narrate,accept,reject}=c;
    let s;const bind=()=>{s=c.s;};
    function begin(level,requested,source){s.run=choosePool(uniq(source.filter(x=>/^[a-z][a-z ]{2,20}$/i.test(x.word)),x=>norm(x.word)),requested);return true;}
    function render(){
      const q=question();if(s.fishOptionsAt!==s.at){s.fishOptionsAt=s.at;const opts=pick(s.source.filter(v=>norm(v.word)!==norm(q.word)&&norm(v.vietnamese)!==norm(q.vietnamese)&&/^[a-z][a-z ]{2,20}$/i.test(v.word)),s.optionCount-1);s.fishOptions=shuffle([q,...opts]);}
      roundBase(`<h4>🎣 Fishing Game</h4><p class="ta3g-prompt">Câu con cá có nghĩa: <strong>${esc(q.vietnamese)}</strong></p><div class="ta3g-pond">${s.fishOptions.map((fish,i)=>`<button type="button" class="ta3g-fish" data-gact="pick" data-n="${i}" ${s.locked?'disabled':''}><span>🐟</span><b>${esc(fish.word)}</b></button>`).join('')}</div>`,{listen:q.word,next:s.locked});
    }
    function answerPick(i){const chosen=s.fishOptions?.[i];if(!chosen)return;
      if(norm(chosen.word)===norm(question().word)){narrate(chosen.word);accept('🎣 Câu được cá đúng! '+chosen.word);}else reject('🌱 Sai loại cá rồi, bé xem lại nghĩa nhé.');
    }
    return {bind,begin,render,pick:answerPick,listen:()=>narrate(question()?.word)};
  });
})();
