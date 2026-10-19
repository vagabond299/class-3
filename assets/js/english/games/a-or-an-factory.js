/* Mini Game 10 — Sentence Factory | Epsilon Edu Class 3.
   M10.1 a/an/some and M10.8 there is/are applied to countable vocabulary in M12. */
(() => {
  'use strict';
  window.CLASS3_ENGLISH_MINIGAMES.register('a-or-an-factory',c=>{
    const {esc,norm,shuffle,choosePool,question,roundBase,showRound,narrate,accept,reject,isAn}=c;
    const IRREGULAR=new Set(['child','children','person','man','woman','mouse','tooth','foot','goose','ox','sheep','deer','fish','police officer','firefighter','hairdresser','loaf','series','species']);
    const plural=word=>{
      const w=norm(word);if(IRREGULAR.has(w)||!/^[a-z]+$/.test(w))return '';
      if(/[^aeiou]y$/.test(w))return w.slice(0,-1)+'ies';
      if(/(?:s|sh|ch|x|z)$/.test(w))return w+'es';
      return w+'s';
    };
    let s;
    const bind=()=>{s=c.s;};
    function setup(){
      const q=question();s.factoryCount=s.level===0?1:Math.random()<.55?1:2+Math.floor(Math.random()*3);
      s.factoryStage=s.level===2?'be':'article';
      s.factoryArticle=s.factoryCount>1?'some':isAn(q.word)?'an':'a';
      s.factoryIs=s.factoryCount>1?'are':'is';
    }
    function begin(level,requested){
      const base=c.pool.filter(v=>/^[a-z]+$/i.test(v.word)&&(!level||plural(v.word)));
      s.run=choosePool(base,requested);
      if(s.run.length!==requested)return false;
      setup();return true;
    }
    function render(){
      const q=question(),count=s.factoryCount,single=count===1;
      const noun=single?norm(q.word):plural(q.word);
      const sample=single?'1':String(count);
      const text=s.level===2?'There ___  '+(single?'___ ':'___ ')+noun+'.':
        single?'There is ___ '+noun+'.':'There are ___ '+noun+'.';
      const options=s.factoryStage==='be'?['is','are']:(s.level===0?['a','an']:['a','an','some']);
      roundBase(`<h4>🏭 Sentence Factory · Nhà máy tạo câu</h4>
        <div class="ta3g-factory-products"><b>📦 × ${sample}</b><strong>${esc(noun)}</strong><small>${esc(q.vietnamese)}</small></div>
        <p class="ta3g-prompt">${esc(text)}</p>
        <p><b>${s.factoryStage==='be'?'Chọn is / are theo số lượng':'Chọn a / an / some để hoàn thành câu'}</b></p>
        <div class="ta3g-gates ta3g-gates-flex">${options.map((option,i)=>`<button type="button" data-gact="pick" data-n="${i}" ${s.locked?'disabled':''}>📦 <b>${esc(option.toUpperCase())}</b></button>`).join('')}</div>
        ${s.locked?`<p class="ta3g-solution">✅ There ${s.factoryIs} ${s.factoryArticle} ${esc(noun)}.</p>`:''}`,{listen:q.word,next:s.locked});
    }
    function answerPick(i){
      const options=s.factoryStage==='be'?['is','are']:(s.level===0?['a','an']:['a','an','some']);
      const selected=options[i];if(selected==null)return;
      const expected=s.factoryStage==='be'?s.factoryIs:s.factoryArticle;
      if(selected!==expected){reject(s.factoryStage==='be'?'🌱 Một vật dùng is, từ hai vật trở lên dùng are.':'🌱 Một vật dùng a/an theo âm đầu; nhiều vật có thể dùng some.');return;}
      if(s.factoryStage==='be'){
        s.factoryStage='article';s.feedback='✅ Đúng is/are! Giờ chọn a/an/some nhé.';s.success=true;showRound();
      }else{
        const noun=s.factoryCount===1?norm(question().word):plural(question().word);
        narrate(`There ${s.factoryIs} ${s.factoryArticle} ${noun}.`);
        accept('🏭 Đóng gói thành công! Câu đúng cả số lượng và mạo từ.');
      }
    }
    function hint(){s.feedback=s.factoryStage==='be'?'💡 There is + 1 vật; There are + nhiều vật.':'💡 a trước âm phụ âm, an trước âm nguyên âm; some dùng với danh từ số nhiều trong câu khẳng định.';}
    return {bind,begin,render,pick:answerPick,hint,onNext:setup,listen:()=>narrate(question()?.word)};
  });
})();
