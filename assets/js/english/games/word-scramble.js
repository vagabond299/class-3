/* Mini Game 03 — Word Scramble: independent Class 3 English game. */
(() => {
  'use strict';
  window.CLASS3_ENGLISH_MINIGAMES.register('word-scramble',c=>{
    const {esc,choosePool,getWordsByLength,shuffle,roundBase,btn,question,norm,narrate,accept,reject,showRound}=c;
    let s;const bind=()=>{s=c.s;};
    function begin(level,requested,source){s.run=choosePool(getWordsByLength(level===0?3:level===1?4:5,level===0?6:level===1?9:14,source),requested);return true;}
    function render(){
      const q=question(),target=q.word.toUpperCase();
      if(s.scrambleAt!==s.at){s.scrambleAt=s.at;s.letters=shuffle(target.split('').map((letter,id)=>({id,letter})));if(s.letters.map(x=>x.letter).join('')===target&&target.length>1)s.letters.reverse();s.picked=[];}
      roundBase(`<h4>🔡 Word Scramble</h4><p class="ta3g-prompt">${esc(q.vietnamese)} ${esc(q.emoji||'')}</p><div class="ta3g-built">${s.picked.length?s.picked.map(i=>esc(s.letters[i].letter)).join(' '):'_ '.repeat(target.length)}</div><div class="ta3g-tiles">${s.letters.map((t,i)=>`<button type="button" class="ta3g-tile" data-gact="tile" data-n="${i}" ${s.picked.includes(i)||s.locked?'disabled':''}>${esc(t.letter)}</button>`).join('')}</div><div class="ta3g-actions">${btn('undo','↩️ Undo')}${btn('clear','🔄 Xếp lại')}${btn('check','✅ Check','emphasis')}</div>`,{listen:target,next:s.locked});
    }
    function action(a,n){
      if(s.locked)return;
      if(a==='tile'){if(n>=0&&n<s.letters.length&&!s.picked.includes(n)){s.picked.push(n);s.feedback='';showRound();}}
      else if(a==='undo'){s.picked.pop();showRound();}
      else if(a==='clear'){s.picked=[];showRound();}
      else if(a==='check'){
        const chosen=s.picked.map(i=>s.letters[i].letter).join('');
        if(s.picked.length!==s.letters.length){s.feedback='Bé hãy chọn đủ các chữ cái nhé.';s.success=false;showRound();return;}
        if(norm(chosen)===norm(question().word)){narrate(question().word);accept('🔡 Chính xác: '+question().word);}else reject('🌱 Thứ tự chữ chưa đúng, bé thử xếp lại nhé!');
      }
    }
    function hint(){s.feedback='💡 Từ bắt đầu bằng chữ '+question().word.charAt(0).toUpperCase()+'.';}
    return {bind,begin,render,action,hint,listen:()=>narrate(question()?.word)};
  });
})();
