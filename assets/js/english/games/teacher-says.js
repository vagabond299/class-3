/* Epsilon Edu - English 3 - Mini Game 12: Teacher Says.
 * Listening and classroom-response game from Grammar 10.10.
 * Easy: read/listen and act. Medium: act/freeze. Hard: two successive commands,
 * including explicit "Don't" prohibitions. All levels have a text fallback for TTS.
 */
(() => {
  'use strict';
  window.CLASS3_ENGLISH_MINIGAMES.register('teacher-says', c => {
    const {esc,norm,shuffle,choosePool,question,qSentence,roundBase,showRound,narrate,accept,reject}=c;
    const COMMANDS=Object.freeze({
      open:['📖','Mở sách'],close:['📕','Đóng sách'],stand:['🧍','Đứng lên'],sit:['🪑','Ngồi xuống'],
      listen:['👂','Lắng nghe'],write:['✍️','Viết'],look:['👀','Nhìn tranh'],repeat:['🗣️','Nhắc lại'],
      raise:['🙋','Giơ tay'],copy:['📝','Chép từ'],choose:['✅','Chọn đáp án'],count:['🔢','Đếm số'],
      put:['📥','Đặt bút chì'],wash:['🧼','Rửa tay'],throw:['🏐','Ném bóng'],clean:['🧹','Lau dọn'],
      find:['🔍','Tìm bạn'],sing:['🎤','Hát'],take:['🖍️','Lấy bút màu'],read:['📖','Đọc'],
      touch:['☝️','Chạm'],point:['👉','Chỉ vào'],clap:['👏','Vỗ tay'],jump:['🤸','Nhảy'],
      draw:['🎨','Vẽ'],colour:['🖌️','Tô màu'],walk:['🚶','Đi bộ'],run:['🏃','Chạy']
    });
    const NEGATABLE=new Set(['open','close','stand','sit','write','look','raise','put','wash','throw','sing','take','read','touch','clap','jump','draw','run']);
    const getVerb=q=>{
      const first=norm(qSentence(q).replace(/^\s*(?:please\s*,?\s*|don't\s+|do\s+not\s+)/i,'').split(/\s+/)[0].replace(/[^a-z]/gi,''));
      return COMMANDS[first]?first:'';
    };
    function actionInfo(q){
      const verb=getVerb(q),line=norm(qSentence(q));if(!verb)return null;
      const base=COMMANDS[verb];let label=base[1],icon=base[0];
      if(verb==='close'&&line.includes('eyes')){label='Nhắm mắt';icon='🙈';}
      else if(verb==='close'&&line.includes('door')){label='Đóng cửa';icon='🚪';}
      else if(verb==='open'&&line.includes('window')){label='Mở cửa sổ';icon='🪟';}
      else if(verb==='put'&&line.includes('pencils')){label='Đặt bút chì lên bàn';icon='✏️';}
      else if(verb==='write'&&line.includes('name'))label='Viết tên';
      else if(verb==='look'&&line.includes('picture'))label='Nhìn vào bức tranh';
      else if(verb==='clean'&&line.includes('floor'))label='Lau sạch sàn';
      else if(verb==='find'&&line.includes('friend'))label='Tìm bạn';
      else if(verb==='repeat')label='Nhắc lại theo cô';
      else if(verb==='take'&&line.includes('crayon'))label='Lấy bút sáp màu';
      return {verb,icon,label};
    }
    let s;
    const bind=()=>{s=c.s;};
    function begin(level,requested){
      const eligible=c.pool.filter(q=>actionInfo(q)&&!/^\s*(?:may i|let's|would you)/i.test(qSentence(q)));
      s.run=choosePool(eligible,requested);if(s.run.length!==requested)return false;
      setup();return true;
    }
    function makeStep(q,index){
      const info=actionInfo(q);const a=s.level;
      const says=a===0?true:a===1?(s.at+index)%3!==1:(s.at+index)%4!==1;
      const negative=a===2&&says&&(s.at+index)%4===0&&NEGATABLE.has(info.verb)
        &&!/(?:\band\b|:)/i.test(qSentence(q));
      const sentence=qSentence(q).trim();
      const core=negative?'Don\'t '+sentence.charAt(0).toLowerCase()+sentence.slice(1):sentence;
      const spoken=(says?'Teacher says, ':'')+core;
      const distractors=shuffle(c.pool.filter(x=>getVerb(x)&&qSentence(x)!==qSentence(q)&&actionInfo(x).label!==info.label));
      const options=shuffle([info,...distractors.slice(0,s.optionCount-1).map(actionInfo)]);
      return {q,says,negative,spoken,info,options,index};
    }
    function setup(){
      s.teacherAt=s.at;s.teacherStep=0;s.teacherTranscript=s.level===0;
      const first=question();
      const secondary=shuffle(c.pool.filter(q=>getVerb(q)&&qSentence(q)!==qSentence(first)&&getVerb(q)!==getVerb(first)))[0]||first;
      s.teacherEpisodes=[makeStep(first,0)];
      if(s.level===2)s.teacherEpisodes.push(makeStep(secondary,1));
      s.teacherSolved=[];
    }
    function render(){
      if(s.teacherAt!==s.at)setup();
      const e=s.teacherEpisodes[s.teacherStep];
      const stageCount=s.teacherEpisodes.length;
      const progress=`<div class="ta3g-skill-steps">${Array.from({length:stageCount},(_,i)=>`<span class="${s.locked||i<s.teacherStep?'done':i===s.teacherStep?'current':''}">🔔 Lệnh ${i+1}/${stageCount}</span>`).join('')}</div>`;
      const transcript=s.teacherTranscript?`<p class="ta3g-command-text">${esc(e.spoken)}</p>`:
        '<p class="ta3g-command-text ta3g-muted">🎧 Nhấn Nghe để nhận hiệu lệnh.</p>';
      const actionCards=e.options.map((a,i)=>`<button type="button" class="ta3g-action-card" data-gact="pick" data-n="${i}" ${s.locked?'disabled':''}><span>${a.icon}</span><b>${esc(a.label)}</b></button>`).join('');
      const feedback=s.teacherSolved.length?`<div class="ta3g-teacher-history">${s.teacherSolved.map(x=>`<span>✅ ${esc(x)}</span>`).join('')}</div>`:'';
      const solved=s.locked?`<div class="ta3g-solution">🏆 Em nghe và thực hiện đúng tất cả ${stageCount} hiệu lệnh!<small>Teacher says → làm theo; không có Teacher says hoặc có Don't → đứng yên.</small></div>`:'';
      roundBase(`<h4>👩‍🏫 Teacher Says · Nghe lệnh làm đúng</h4>${progress}
        <p class="ta3g-lesson-strip">${s.level===0?'Dễ: nghe và chọn hành động.':s.level===1?'Vừa: có Teacher says mới làm theo.':'Khó: thực hiện đúng cả hai hiệu lệnh, chú ý Don\'t.'}</p>
        <div class="ta3g-teacher ta3g-teacher-audio"><span>👩‍🏫</span><div><small>Cô giáo ra hiệu lệnh</small>${transcript}</div></div>
        <div class="ta3g-actions"><button type="button" class="ta3g-control primary" data-gact="replay-command">🔊 Nghe cô đọc</button>
          ${!s.teacherTranscript?'<button type="button" class="ta3g-control" data-gact="reveal-command">👀 Hiện câu lệnh</button>':''}</div>
        <p class="ta3g-prompt">Bé sẽ làm gì? · What will you do?</p>
        <div class="ta3g-action-grid ta3g-teacher-actions">${actionCards}<button type="button" class="ta3g-action-card freeze" data-gact="freeze" ${s.locked?'disabled':''}><span>🧊</span><b>Đứng yên · Freeze</b></button></div>
        ${feedback}${solved}`,{listen:e.spoken,hint:true,next:s.locked});
    }
    function correctDecision(isFreeze,choice){
      if(s.locked)return;
      const e=s.teacherEpisodes[s.teacherStep],mustFreeze=!e.says||e.negative;
      if(mustFreeze!==isFreeze ||(!mustFreeze&&choice?.label!==e.info.label)){
        reject(mustFreeze?'Hãy nghe từ Teacher says và Don\'t: khi không được ra lệnh làm, bé phải đứng yên.':
          'Cô đã nói Teacher says. Hãy tìm hành động đúng với câu lệnh được nghe.');return;
      }
      const result=mustFreeze?'🧊 Đứng yên · Freeze':e.info.icon+' '+e.info.label;
      s.teacherSolved.push(result);
      if(s.teacherStep<s.teacherEpisodes.length-1){
        s.teacherStep++;s.teacherTranscript=false;s.success=true;
        s.feedback='✅ Lệnh đầu tiên đúng! Hãy nghe lệnh tiếp theo.';
        showRound();
      }else{
        narrate(mustFreeze?'Well done. Freeze.':'Well done. '+qSentence(e.q));
        accept(mustFreeze?'✅ Bé biết khi nào cần đứng yên!':'✅ Bé đã nghe đúng và làm đúng hiệu lệnh!');
      }
    }
    function answerPick(i){const e=s.teacherEpisodes[s.teacherStep],choice=e.options?.[i];if(choice)correctDecision(false,choice);}
    function action(a){
      if(a==='freeze'){correctDecision(true);return;}
      if(a==='replay-command'){listen();return;}
      if(a==='reveal-command'){s.teacherTranscript=true;s.success=false;s.feedback='Bé có thể đọc câu lệnh để tự học khi chưa nghe rõ.';showRound();}
    }
    function hint(){s.feedback='💡 Chỉ làm hành động khi có “Teacher says” và không có “Don\'t”. Nếu không thì đứng yên. Chú ý cả việc cô yêu cầu làm gì.';}
    function listen(){narrate(s.teacherEpisodes?.[s.teacherStep]?.spoken);}
    return {bind,begin,render,pick:answerPick,action,hint,onNext:setup,listen};
  });
})();
