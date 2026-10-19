/* Mini Game 08 — Grammar River | Epsilon Edu Class 3.
   Cross each river by solving multiple independent grammar stepping stones. */
(() => {
  'use strict';
  window.CLASS3_ENGLISH_MINIGAMES.register('grammar-river',c=>{
    const {esc,shuffle,choosePool,makeOptions,qText,qAnswer,question,roundBase,choices,norm,narrate,accept,reject,showRound}=c;
    let s;
    const bind=()=>{s=c.s;};
    function begin(level,requested){
      s.riverLength=[2,3,4][level];
      const all=choosePool(c.pool,requested*s.riverLength);
      if(all.length!==requested*s.riverLength)return false;
      s.run=Array.from({length:requested},(_,i)=>({riverSteps:all.slice(i*s.riverLength,(i+1)*s.riverLength)}));
      s.riverStep=0;s.riverOptionsAt='';return true;
    }
    const current=()=>question()?.riverSteps?.[s.riverStep];
    function render(){
      const q=current();if(!q)return;
      const key=s.at+'_'+s.riverStep;
      if(s.riverOptionsAt!==key){s.riverOptions=makeOptions(q.options,qAnswer(q),s.optionCount);s.riverOptionsAt=key;}
      const river=`<div class="ta3g-river-steps"><span class="ta3g-bank">🏞️</span>${question().riverSteps.map((_,i)=>`<span class="ta3g-stone ${i<s.riverStep?'crossed':i===s.riverStep?'current':''}">${i<s.riverStep?'✅':i===s.riverStep?'🐸':i+1}</span>`).join('')}<span class="ta3g-bank">🏁</span></div>`;
      roundBase(`<h4>🐸 Grammar River · Vượt sông ngữ pháp</h4>${river}
        <p class="ta3g-context">Bước ${s.riverStep+1}/${s.riverLength} · ${esc(q.grammar_focus||'Grammar Point')}</p>
        <p class="ta3g-prompt">${esc(qText(q))}</p>
        <p>Chọn hòn đá chứa phần đúng để chú ếch sang bờ.</p>
        ${choices('ta3g-stone-choices',s.riverOptions)}
        ${s.locked?`<p class="ta3g-solution">✅ ${esc(q.completed_sentence||qText(q).replace(/_{2,}/g,qAnswer(q)))}</p>`:''}`,{listen:qText(q),next:s.locked});
    }
    function answerPick(i){const chosen=s.riverOptions?.[i];if(chosen==null)return;
      const q=current();if(norm(chosen)!==norm(qAnswer(q))){reject('🌱 Hòn đá này chưa đúng. Hãy đọc cả câu và chọn từ phù hợp ngữ pháp.');return;}
      if(s.riverStep<s.riverLength-1){s.riverStep++;s.feedback='✅ Qua được một hòn đá! Tiếp tục nào!';s.success=true;showRound();}
      else{narrate(q.completed_sentence||qText(q).replace(/_{2,}/g,qAnswer(q)));accept('🐸 Tuyệt vời! Bé đã vượt qua dòng sông.');}
    }
    function hint(){s.feedback='💡 '+(current()?.hint||'Kiểm tra chủ ngữ, số lượng và ngữ cảnh trước khi chọn.');}
    return {bind,begin,render,pick:answerPick,hint,onNext:()=>{s.riverStep=0;s.riverOptionsAt='';},listen:()=>narrate(qText(current()).replace(/_{2,}/g,'blank'))};
  });
})();
