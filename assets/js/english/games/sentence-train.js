/* Mini Game 05 — Sentence Train | Epsilon Edu Class 3.
   Build complete English sentences from Grammar Point 10, not missing-word multiple choice. */
(() => {
  'use strict';
  window.CLASS3_ENGLISH_MINIGAMES.register('sentence-train', c => {
    const {esc,words,shuffle,choosePool,question,qSentence,roundBase,btn,showRound,norm,narrate,accept,reject}=c;
    let s;
    const bind=()=>{s=c.s;};
    const eligible=q=>{
      const text=qSentence(q), length=words(text).length;
      return length>=3&&length<=15&&!/[—–]/.test(text)&&!/_\s*_/.test(text);
    };
    function setup(){
      const text=qSentence(question());
      s.trainTiles=shuffle(words(text).map((word,id)=>({id,word})));
      s.trainPicked=[];
    }
    function begin(level,requested){
      const ceiling=[8,11,15][level];
      const suitable=c.pool.filter(q=>eligible(q)&&words(qSentence(q)).length<=ceiling);
      const fallback=c.pool.filter(eligible);
      s.run=choosePool(suitable.length>=requested?suitable:fallback,requested);
      if(s.run.length!==requested)return false;
      setup();return true;
    }
    function render(){
      const q=question(),tiles=s.trainTiles,chosen=s.trainPicked;
      const filled=chosen.map((id,i)=>`<button type="button" class="ta3g-wagon" data-gact="remove-tile" data-n="${i}" ${s.locked?'disabled':''}>${esc(tiles[id].word)} <span aria-hidden="true">×</span></button>`).join('');
      const empty=Array.from({length:Math.max(0,tiles.length-chosen.length)},()=>'<span class="ta3g-empty-wagon">?</span>').join('');
      roundBase(`<h4>🚂 Sentence Train · Đoàn tàu câu đúng</h4>
        <p class="ta3g-context">🇻🇳 ${esc(q.completed_sentence_vi||'Sắp xếp các từ thành câu tiếng Anh đúng.')}</p>
        <p>Chạm lần lượt các toa từ để ghép một <strong>câu hoàn chỉnh</strong>.</p>
        <div class="ta3g-train">🚂 ${filled}${empty}</div>
        <div class="ta3g-tiles">${tiles.map((t,i)=>`<button type="button" class="ta3g-tile" data-gact="tile" data-n="${i}" ${chosen.includes(i)||s.locked?'disabled':''}>${esc(t.word)}</button>`).join('')}</div>
        <div class="ta3g-actions">${btn('undo','↩️ Undo')}${btn('clear','🔄 Xếp lại')}${btn('check','✅ Check','emphasis')}</div>
        ${s.locked?`<p class="ta3g-solution">✅ ${esc(qSentence(q))}</p>`:''}`,{listen:'',next:s.locked});
    }
    function action(a,n){
      if(s.locked)return;
      if(a==='tile'&&n>=0&&n<s.trainTiles.length&&!s.trainPicked.includes(n)){s.trainPicked.push(n);s.feedback='';showRound();}
      else if(a==='remove-tile'&&n>=0&&n<s.trainPicked.length){s.trainPicked.splice(n,1);showRound();}
      else if(a==='undo'){s.trainPicked.pop();showRound();}
      else if(a==='clear'){s.trainPicked=[];showRound();}
      else if(a==='check'){
        if(s.trainPicked.length!==s.trainTiles.length){s.feedback='🌱 Bé ghép đủ các toa rồi hãy kiểm tra nhé!';s.success=false;showRound();return;}
        const entered=s.trainPicked.map(i=>s.trainTiles[i].word).join(' ');
        if(norm(entered)===norm(words(qSentence(question())).join(' '))){narrate(qSentence(question()));accept('✅ Đúng thứ tự rồi! Hãy nghe lại cả câu nhé.');}
        else reject('🌱 Chú ý chủ ngữ, động từ và vị trí của các từ. Bé thử đổi thứ tự các toa nhé!');
      }
    }
    function hint(){
      const q=question();s.feedback=`💡 Từ đầu câu là “${words(qSentence(q))[0]}”. Hãy đặt từ này vào đầu đoàn tàu.`;
    }
    function listen(){
      if(s.locked)narrate(qSentence(question()));
      else{s.feedback='🔊 Bé hãy ghép xong rồi nghe câu hoàn chỉnh để tự kiểm tra nhé.';s.success=false;showRound();}
    }
    return {bind,begin,render,action,hint,onNext:setup,listen};
  });
})();
