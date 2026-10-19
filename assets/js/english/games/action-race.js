/* Epsilon Edu - English 3 - Mini Game 09: Action Race.
 * Curriculum: Grammar 10.3 (actions, I + base verb, She + -s/-es/-ies).
 * Easy: meaning -> correct verb; Medium: + subject lane; Hard: + spelling rule.
 */
(() => {
  'use strict';
  window.CLASS3_ENGLISH_MINIGAMES.register('action-race', c => {
    const {esc, norm, shuffle, choosePool, qText, qAnswer, qSentence, question,
      roundBase, showRound, narrate, accept, reject} = c;
    const ACTIONS = Object.freeze({
      play:['⚽','chơi'], read:['📚','đọc'], write:['✍️','viết'], sing:['🎤','hát'],
      draw:['🎨','vẽ'], fly:['🪁','thả diều'], ride:['🚲','đạp xe'], kick:['⚽','đá bóng'],
      brush:['🪥','đánh răng'], wash:['🧼','rửa'], open:['📖','mở'], close:['🚪','đóng'],
      feed:['🐱','cho ăn'], hug:['🤗','ôm'], paint:['🖌️','tô màu'], eat:['🍎','ăn'],
      drink:['🥤','uống'], build:['🧱','xây'], clap:['👏','vỗ tay'], jump:['🤸','nhảy'],
      watch:['🔭','quan sát'], count:['🔢','đếm'], carry:['🎒','mang'],
      touch:['☝️','chạm'], help:['🤝','giúp đỡ']
    });
    const allKeys=Object.keys(ACTIONS);
    const baseOf=value=>{
      const a=norm(value).replace(/[^a-z]/g,'');
      if(ACTIONS[a])return a;
      if(a.endsWith('ies')&&ACTIONS[a.slice(0,-3)+'y'])return a.slice(0,-3)+'y';
      if(a.endsWith('es')&&ACTIONS[a.slice(0,-2)])return a.slice(0,-2);
      if(a.endsWith('es')&&ACTIONS[a.slice(0,-1)])return a.slice(0,-1);
      if(a.endsWith('s')&&ACTIONS[a.slice(0,-1)])return a.slice(0,-1);
      return '';
    };
    const grammaticalSubject=q=>/^\s*I\s+_{2,}/i.test(qText(q))?'base':/^\s*She\s+_{2,}/i.test(qText(q))?'third':'';
    const endRule=q=>{
      const answer=norm(qAnswer(q)),base=baseOf(answer);
      if(answer===base)return 'base';
      if(answer===base.slice(0,-1)+'ies')return 'ies';
      if(answer===base+'es')return 'es';
      if(answer===base+'s')return 's';
      return '';
    };
    const ENDINGS=[['base','Giữ nguyên','I + play'],['s','Thêm -s','She + plays'],
      ['es','Thêm -es','She + washes'],['ies','Đổi y thành -ies','She + flies']];
    let s;
    const bind=()=>{s=c.s;};
    const stages=()=>s.level===0?['action','form']:s.level===1?['action','subject','form']:['action','subject','ending','form'];
    function setup(){
      const q=question(),key=baseOf(qAnswer(q));
      s.raceAt=s.at;s.raceStage=0;s.raceAction=key;
      s.raceOptions=shuffle([key,...shuffle(allKeys.filter(k=>k!==key)).slice(0,s.optionCount-1)]);
      s.raceForms=c.makeOptions(q.options,qAnswer(q),s.optionCount);
      s.raceRule=shuffle(ENDINGS);
    }
    function begin(level,requested){
      const eligible=c.pool.filter(q=>baseOf(qAnswer(q))&&grammaticalSubject(q)&&endRule(q)
        &&String(q.completed_sentence_vi||'').trim()&&Array.isArray(q.options)&&q.options.includes(qAnswer(q)));
      s.run=choosePool(eligible,requested);
      if(s.run.length!==requested)return false;
      setup();return true;
    }
    const choiceButton=(label,i,icon='🏎️')=>`<button type="button" class="ta3g-action-card" data-gact="pick" data-n="${i}" ${s.locked?'disabled':''}><span>${icon}</span><b>${esc(label)}</b></button>`;
    function render(){
      if(s.raceAt!==s.at)setup();
      const q=question(),stage=stages()[s.raceStage],total=stages().length;
      const progress=s.locked?100:Math.round(s.raceStage/total*90);
      const track=`<div class="ta3g-race-track" aria-label="Đường đua đã hoàn thành ${progress}%"><span>🏎️</span><div class="ta3g-race-bar"><i style="width:${progress}%"></i></div><span>🏁</span></div>`;
      const steps=`<div class="ta3g-skill-steps">${stages().map((k,i)=>`<span class="${s.locked||i<s.raceStage?'done':i===s.raceStage?'current':''}">${i+1}. ${esc(({action:'Hành động',subject:'Chủ ngữ',ending:'Quy tắc',form:'Chia động từ'})[k])}</span>`).join('')}</div>`;
      let body='';
      if(stage==='action'){
        body=`<p class="ta3g-prompt">Nhìn nghĩa tiếng Việt, chọn <strong>hành động</strong> đúng.</p><div class="ta3g-action-grid ${s.optionCount===4?'ta3g-race-four':''}">${s.raceOptions.map((key,i)=>choiceButton(key,i,ACTIONS[key][0])).join('')}</div>`;
      }else if(stage==='subject'){
        body=`<div class="ta3g-context">${esc(qText(q))}</div><p class="ta3g-prompt">Chủ ngữ trong câu thuộc làn đường nào?</p><div class="ta3g-action-grid">${shuffle(['base','third']).map((key,i)=>choiceButton(key==='base'?'I · động từ giữ nguyên':'She · động từ thêm đuôi',i,key==='base'?'🙋':'👧').replace('data-n="'+i+'"','data-n="'+(key==='base'?0:1)+'"')).join('')}</div>`;
      }else if(stage==='ending'){
        body=`<div class="ta3g-context">${esc(qText(q))}</div><p class="ta3g-prompt">Động từ <b>${esc(s.raceAction)}</b> cần biến đổi thế nào?</p><div class="ta3g-action-grid ta3g-race-four">${s.raceRule.map((o,i)=>`<button type="button" class="ta3g-action-card ta3g-rule-card" data-gact="pick" data-n="${i}" ${s.locked?'disabled':''}><b>${esc(o[1])}</b><small>${esc(o[2])}</small></button>`).join('')}</div>`;
      }else{
        body=`<div class="ta3g-context">${esc(qText(q))}</div><p class="ta3g-prompt">Về đích: chọn dạng động từ để hoàn thành câu.</p><div class="ta3g-action-grid ${s.optionCount===4?'ta3g-race-four':''}">${s.raceForms.map((v,i)=>choiceButton(v,i,'⚡')).join('')}</div>`;
      }
      const rule=endRule(q),meaning=rule==='base'?'Với I, động từ giữ nguyên.':rule==='ies'?'Với She, động từ tận cùng phụ âm + y đổi thành -ies.':rule==='es'?'Với She, động từ này thêm -es.':'Với She, động từ này thêm -s.';
      const solved=s.locked?`<div class="ta3g-solution">✅ ${esc(qSentence(q))}<small>🇻🇳 ${esc(q.completed_sentence_vi)}</small><small>💡 ${esc(rule==='base'?'I + '+s.raceAction:rule==='ies'?s.raceAction+' → '+qAnswer(q):s.raceAction+' + '+rule+' → '+qAnswer(q))}. ${esc(rule==='base'?'Động từ nguyên mẫu.':meaning)}</small></div>`:'';
      roundBase(`<h4>🏎️ Action Race · Đua xe động từ</h4>${track}${steps}<div class="ta3g-context">🇻🇳 ${esc(q.completed_sentence_vi)}</div>${body}${solved}`,
        {listen:stage==='action'?'':qText(q).replace(/_{2,}/g,'blank'),next:s.locked});
    }
    function advance(message){s.raceStage++;s.success=true;s.feedback=message;showRound();}
    function answerPick(i){
      if(s.locked)return;
      const q=question(),stage=stages()[s.raceStage],key=s.raceAction;
      if(stage==='action'){
        const got=s.raceOptions?.[i];if(!got)return;
        if(got===key)advance('✅ Đúng hành động! Tiếp tục đến trạm kế tiếp.');
        else reject('Hãy tìm hành động tương ứng với nghĩa câu, không chỉ nhìn biểu tượng.');
      }else if(stage==='subject'){
        if(i!==0&&i!==1)return;
        if((i===0?'base':'third')===grammaticalSubject(q))advance('✅ Đã chọn đúng nhóm chủ ngữ.');
        else reject('Quan sát đầu câu: I dùng động từ gốc; She dùng động từ thêm đuôi.');
      }else if(stage==='ending'){
        const v=s.raceRule?.[i]?.[0];if(!v)return;
        if(v===endRule(q))advance('✅ Chính xác! Em đã hiểu cách biến đổi động từ.');
        else reject('Động từ cần giữ nguyên, thêm -s, -es hay đổi y thành -ies?');
      }else{
        const v=s.raceForms?.[i];if(v==null)return;
        if(norm(v)===norm(qAnswer(q))){narrate(qSentence(q));accept('🏁 Về đích! Bé đã hiểu nghĩa và dùng đúng dạng động từ.');}
        else reject('Nhìn chủ ngữ và cách thêm đuôi động từ trước khi chọn.');
      }
    }
    function hint(){const q=question(),stage=stages()[s.raceStage];
      s.feedback=stage==='action'?'💡 Đọc câu tiếng Việt, chú ý việc bạn nhỏ đang làm.':
        stage==='subject'?'💡 I + verb gốc · She + verb-(s/es/ies).':
        stage==='ending'?'💡 She + play → plays; wash → washes; fly → flies. Với I thì không thêm đuôi.':
        '💡 '+(q.hint||'Hãy quan sát chủ ngữ và động từ trước khi quyết định.');}
    function listen(){if(stages()[s.raceStage]==='action')narrate(qSentence(question()));
      else narrate(qText(question()).replace(/_{2,}/g,'blank'));}
    return {bind,begin,render,pick:answerPick,hint,onNext:setup,listen};
  });
})();
