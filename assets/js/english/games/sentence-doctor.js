/* Mini Game 07 — Sentence Doctor | Epsilon Edu Class 3.
   Diagnose a genuinely wrong completed sentence, then replace only the wrong part. */
(() => {
  'use strict';
  window.CLASS3_ENGLISH_MINIGAMES.register('sentence-doctor',c=>{
    const {esc,norm,shuffle,choosePool,question,qText,qAnswer,qSentence,roundBase,choices,showRound,accept,reject,narrate,words}=c;
    let s;
    const bind=()=>{s=c.s;};
    const eligible=q=>/_{2,}/.test(qText(q))&&Array.isArray(q.options)&&q.options.some(x=>norm(x)!==norm(qAnswer(q)))&&!/[—–]/.test(qSentence(q));
    function setup(){
      const q=question(),incorrect=shuffle(q.options.filter(x=>norm(x)!==norm(qAnswer(q))))[0];
      const parts=qText(q).split(/_{2,}/),before=words(parts[0]),after=words(parts.slice(1).join('___'));
      s.doctorTokens=[...before.map(t=>({text:t,bad:false})),{text:incorrect,bad:true},...after.map(t=>({text:t,bad:false}))];
      s.doctorWrong=incorrect;s.doctorPhase='diagnose';
      s.doctorOptions=shuffle([qAnswer(q),...q.options.filter(x=>norm(x)!==norm(qAnswer(q)))]).slice(0,s.optionCount);
      if(!s.doctorOptions.some(x=>norm(x)===norm(qAnswer(q))))s.doctorOptions[0]=qAnswer(q);
      s.doctorOptions=shuffle(s.doctorOptions);
    }
    function begin(level,requested){
      const lenLimit=[14,19,28][level];
      const rows=c.pool.filter(q=>eligible(q)&&words(qSentence(q)).length<=lenLimit);
      s.run=choosePool(rows.length>=requested?rows:c.pool.filter(eligible),requested);
      if(s.run.length!==requested)return false;
      setup();return true;
    }
    function render(){
      const q=question();
      roundBase(`<h4>🩺 Sentence Doctor · Bác sĩ ngữ pháp</h4><p>🔎 Có <strong>một chỗ sai</strong>. Bé chạm vào từ/cụm từ sai, sau đó thay bằng phần đúng.</p>
        <div class="ta3g-patient">${s.doctorTokens.map((t,i)=>`<button type="button" class="ta3g-patient-word ${s.doctorPhase==='cure'&&t.bad?'identified':''}" data-gact="diagnose" data-n="${i}" ${s.doctorPhase==='cure'||s.locked?'disabled':''}>${esc(t.text)}</button>`).join('')}</div>
        ${s.doctorPhase==='cure'?`<p>💊 <b>Choose the correct word · Chọn từ chữa lỗi:</b></p>${choices('ta3g-option-grid',s.doctorOptions)}`:''}
        ${s.locked?`<p class="ta3g-solution">✅ ${esc(qSentence(q))}</p><p class="ta3g-context">${esc(q.explanation||q.completed_sentence_vi||'')}</p>`:''}`,{listen:s.locked?qSentence(q):'',next:s.locked});
    }
    function answerPick(i){if(s.doctorPhase!=='cure')return;const answer=s.doctorOptions?.[i];if(answer==null)return;
      if(norm(answer)===norm(qAnswer(question()))){narrate(qSentence(question()));accept('🩺 Chữa đúng rồi! Bé xem lại câu hoàn chỉnh và lời giải nhé.');}
      else reject('🌱 Từ thay thế chưa đúng. Hãy xét chủ ngữ, số lượng hoặc ý nghĩa của câu.');
    }
    function action(a,n){if(a!=='diagnose'||s.doctorPhase!=='diagnose'||s.locked)return;
      const token=s.doctorTokens[n];if(!token)return;
      if(token.bad){s.doctorPhase='cure';s.feedback='✅ Bé tìm được chỗ sai rồi. Bây giờ hãy chữa câu nhé!';s.success=true;showRound();}
      else reject('🌱 Từ này không sai. Hãy thử đọc cả câu và tìm chỗ không đúng ngữ pháp.');
    }
    function hint(){s.feedback='💡 '+(question().hint||'Kiểm tra sự phù hợp giữa chủ ngữ và động từ, hoặc mạo từ trong câu.');}
    function listen(){if(s.locked)narrate(qSentence(question()));else{s.feedback='💡 Bé hãy tìm lỗi trước, rồi cô sẽ đọc mẫu câu đúng.';s.success=false;showRound();}}
    return {bind,begin,render,pick:answerPick,action,hint,onNext:setup,listen};
  });
})();
