/* Epsilon Edu - English 3 - Mini Game 11: Feeling Detective.
 * Grade 3 cumulative learning: M12 emotions + M10.4 adjectives + M10.5 pronouns/to be.
 * Easy: investigate; Medium: + build sentence; Hard: + evidence reading.
 */
(() => {
  'use strict';
  window.CLASS3_ENGLISH_MINIGAMES.register('feeling-detective', c => {
    const {esc,norm,shuffle,choosePool,question,roundBase,showRound,narrate,accept,reject}=c;
    // [name, pronoun, scene icon, English scenario, Vietnamese scaffold, English evidence, Vietnamese evidence]
    // Every pronoun agrees with the subject in its OWN story; do not randomize a separate subject.
    const CASES=Object.freeze({
      happy:[
        ['Mai','She','🐱','Mai finds her lost kitten. She smiles and hugs it.','Mai tìm lại được mèo con bị lạc. Bạn ấy mỉm cười và ôm nó.','She finds her lost kitten.','Bạn ấy tìm lại được mèo con.'],
        ['The children','They','🎁','The children get nice presents at school. They smile.','Các bạn nhỏ nhận quà ở trường và mỉm cười.','They get nice presents.','Các bạn được nhận quà.']],
      sad:[
        ['An','He','😢','An sees his best friend move to another town. He cries.','An thấy bạn thân chuyển đến một thành phố khác. Bạn ấy bật khóc.','His best friend moves away.','Bạn thân của bạn ấy chuyển đi nơi khác.'],
        ['Lan','She','🧸','Lan cannot find her favourite teddy bear. She cries.','Lan không tìm thấy gấu bông yêu thích. Bạn ấy khóc.','She loses her favourite teddy bear.','Bạn ấy mất gấu bông yêu thích.']],
      angry:[
        ['Nam','He','📕','A boy tears Nam\'s new book. Nam frowns and speaks loudly.','Một bạn làm rách sách mới của Nam. Nam cau mày và nói to.','Someone tears his new book.','Có người làm rách sách mới của bạn ấy.'],
        ['Hoa','She','🧩','Someone breaks Hoa\'s puzzle on purpose. Hoa clenches her fists.','Có người cố ý phá bộ xếp hình của Hoa. Hoa nắm chặt tay.','Someone breaks her puzzle on purpose.','Có người cố ý phá bộ xếp hình của bạn ấy.']],
      scared:[
        ['Linh','She','🌩️','Linh hears loud thunder at night. She hides under her blanket.','Linh nghe tiếng sấm lớn ban đêm và trùm chăn lại.','She hears loud thunder at night.','Bạn ấy nghe tiếng sấm lớn vào ban đêm.'],
        ['Binh','He','🐕','A big dog runs towards Binh and barks loudly. He steps back.','Một con chó lớn chạy đến và sủa to. Bình lùi lại.','A big dog barks at him.','Một con chó lớn sủa về phía bạn ấy.']],
      surprised:[
        ['Hoa','She','🎂','Hoa opens the door. Her friends have a surprise party! Her eyes open wide.','Hoa mở cửa và bất ngờ thấy các bạn tổ chức sinh nhật. Mắt bạn ấy mở to.','Her friends organise an unexpected party.','Các bạn tổ chức một bữa tiệc bất ngờ.'],
        ['Minh','He','🎈','Minh opens a box and sees a giant balloon inside. He says Wow!','Minh mở hộp thấy quả bóng bay khổng lồ và thốt lên Ôi!','He finds a giant balloon in a box.','Bạn ấy tìm thấy một quả bóng bay khổng lồ trong hộp.']],
      excited:[
        ['Mai','She','🚌','Mai cannot wait for her school trip tomorrow. She jumps up and down.','Mai háo hức chờ chuyến tham quan ngày mai và nhảy lên vui sướng.','She will go on a school trip tomorrow.','Ngày mai bạn ấy sẽ đi tham quan.'],
        ['The boys','They','⚽','The boys are going to play in a big football match. They cannot sit still.','Các bạn nam sắp thi đấu bóng đá và không thể ngồi yên.','They are going to play a big match.','Các bạn sắp thi đấu một trận lớn.']],
      tired:[
        ['An','He','🏃','An runs for a long time. His legs feel heavy, and he needs a rest.','An chạy một quãng đường dài. Chân bạn ấy mỏi và cần nghỉ.','He runs for a long time.','Bạn ấy đã chạy một quãng đường dài.'],
        ['The girls','They','⛹️','The girls play basketball all afternoon. Now they need to sit down.','Các bạn nữ chơi bóng rổ cả buổi chiều nên cần ngồi nghỉ.','They play basketball all afternoon.','Các bạn chơi bóng rổ suốt buổi chiều.']],
      hungry:[
        ['Nam','He','🍽️','Nam has not eaten since breakfast. His stomach makes a noise.','Nam chưa ăn gì từ bữa sáng. Bụng bạn ấy réo lên.','He has not eaten since breakfast.','Bạn ấy chưa ăn gì từ bữa sáng.'],
        ['Lan','She','🥪','Lan skips lunch. She looks at a sandwich and wants to eat.','Lan bỏ bữa trưa. Bạn ấy nhìn bánh mì và muốn ăn.','She misses lunch.','Bạn ấy bỏ lỡ bữa trưa.']],
      thirsty:[
        ['Minh','He','💧','Minh runs in the hot sun. He wants a big glass of water.','Minh chạy dưới trời nắng và muốn uống một cốc nước lớn.','He wants some water after running.','Bạn ấy muốn uống nước sau khi chạy.'],
        ['Hoa','She','🥤','Hoa plays outside in the heat. Her mouth feels dry.','Hoa chơi ngoài trời nóng, miệng bạn ấy khô.','She plays outside in the heat.','Bạn ấy chơi ngoài trời nóng.']],
      bored:[
        ['Ba','He','🪑','Ba has nothing to do. He looks at the clock again and again.','Ba không có việc gì để làm và nhìn đồng hồ liên tục.','He has nothing to do.','Bạn ấy không có việc gì để làm.'],
        ['The children','They','🕰️','The children wait quietly for a long time with no games to play.','Các bạn nhỏ phải chờ rất lâu mà không có trò gì để chơi.','They have no games to play.','Các bạn không có trò chơi nào.']],
      confused:[
        ['Mai','She','❓','Mai reads new instructions, but she does not know what to do next.','Mai đọc hướng dẫn mới nhưng không biết phải làm gì tiếp theo.','She cannot understand the instructions.','Bạn ấy chưa hiểu hướng dẫn.'],
        ['An','He','🗺️','An looks at two different maps. He cannot decide which way to go.','An nhìn hai bản đồ khác nhau nhưng không biết đi hướng nào.','He cannot decide which map to follow.','Bạn ấy không biết nên theo bản đồ nào.']],
      shy:[
        ['Linh','She','👧','Linh meets new classmates. She looks down and speaks very quietly.','Linh gặp các bạn mới, cúi đầu và nói rất nhỏ.','She meets new classmates.','Bạn ấy gặp các bạn mới.'],
        ['Nam','He','🎙️','Nam has to speak in front of the class. He hides his face.','Nam phải nói trước lớp và lấy tay che mặt.','He must speak in front of the class.','Bạn ấy phải nói trước lớp.']],
      proud:[
        ['Minh','He','🏅','Minh practises every day and wins his first medal. He holds it high.','Minh luyện tập mỗi ngày và giành huy chương đầu tiên. Bạn ấy giơ huy chương lên cao.','He works hard and wins a medal.','Bạn ấy chăm chỉ và giành huy chương.'],
        ['Mai','She','🏆','Mai finishes a difficult school project by herself. She shows it to her parents.','Mai tự hoàn thành dự án khó ở trường rồi khoe với bố mẹ.','She finishes a difficult project by herself.','Bạn ấy tự hoàn thành một dự án khó.']],
      worried:[
        ['Nam','He','🎒','Nam cannot find his school bag before the school bus arrives. He keeps looking.','Nam không tìm được cặp khi xe đưa đón sắp tới. Bạn ấy tìm mãi.','He cannot find his school bag in time.','Bạn ấy không tìm thấy cặp trước giờ đi học.'],
        ['Hoa','She','📋','Hoa thinks she has lost her homework. She checks her bag again.','Hoa nghĩ mình làm mất bài tập về nhà và kiểm tra cặp liên tục.','She thinks her homework is lost.','Bạn ấy nghĩ mình làm mất bài tập.']],
      fine:[
        ['Lan','She','🙂','The teacher asks Lan how she feels. Lan smiles and says everything is okay.','Cô giáo hỏi thăm Lan. Lan mỉm cười và nói mọi thứ đều ổn.','She feels well today.','Hôm nay bạn ấy thấy khỏe.'],
        ['An','He','👍','An has had a good rest. He feels well and goes to class.','An nghỉ ngơi đầy đủ, cảm thấy khỏe và đi học.','He has had a good rest.','Bạn ấy đã nghỉ ngơi đầy đủ.']],
      grateful:[
        ['An','He','🙏','A friend helps An carry his heavy books. An says Thank you so much!','Một người bạn giúp An mang sách nặng. An cảm ơn bạn rất nhiều.','His friend helps him carry books.','Bạn giúp bạn ấy mang sách.'],
        ['The girls','They','🌷','Their teacher helps the girls with a hard lesson. They give her a thank-you card.','Cô giáo giúp các bạn nữ học bài khó. Các bạn tặng cô một tấm thiệp cảm ơn.','Their teacher helps them learn.','Cô giáo giúp các bạn học bài.']]
    });
    const faces=Object.freeze({happy:'😊',sad:'😢',angry:'😠',scared:'😨',surprised:'😮',excited:'🤩',
      tired:'🥱',hungry:'🍽️',thirsty:'🥤',bored:'😐',confused:'😕',shy:'☺️',proud:'🏆',worried:'😟',fine:'🙂',grateful:'🙏'});
    const subjects=['He','She','They'];
    const beFor=p=>p==='They'?'are':p==='I'?'am':'is';
    let s;
    const bind=()=>{s=c.s;};
    function setup(){
      const key=norm(question().word),entries=CASES[key];
      s.caseData=entries[Math.floor(Math.random()*entries.length)];
      s.detectStage='feeling';s.detectAt=s.at;s.subjectSelected='';s.beSelected='';s.showVietnamese=s.level===0;
      const distractors=shuffle(c.pool.filter(x=>CASES[norm(x.word)]&&norm(x.word)!==key));
      s.moodOptions=shuffle([question(),...distractors.slice(0,s.optionCount-1)]);
      const wrongReasons=shuffle(Object.entries(CASES).filter(([other])=>other!==key)
        .map(([,array])=>array[0][5]).filter(x=>x!==s.caseData[5]));
      s.reasonOptions=shuffle([s.caseData[5],...wrongReasons.slice(0,s.optionCount-1)]);
    }
    function begin(level,requested){
      const eligible=c.pool.filter(q=>CASES[norm(q.word)]);
      s.run=choosePool(eligible,requested);if(s.run.length!==requested)return false;
      setup();return true;
    }
    function render(){
      if(s.detectAt!==s.at)setup();
      const q=question(),key=norm(q.word),scene=s.caseData;
      const [who,pronoun,icon,en,vi,cause,causeVi]=scene;
      const steps=s.level===0?['feeling']:s.level===1?['feeling','sentence']:['feeling','sentence','evidence'];
      const progress=`<div class="ta3g-skill-steps">${steps.map((step,i)=>`<span class="${s.locked||steps.indexOf(s.detectStage)>i?'done':step===s.detectStage?'current':''}">${i+1}. ${esc(({feeling:'Tìm cảm xúc',sentence:'Ghép câu',evidence:'Tìm bằng chứng'})[step])}</span>`).join('')}</div>`;
      const sceneBox=`<div class="ta3g-case ta3g-detective-case"><div class="ta3g-detective-scene"><span>${icon}</span><div><b>📁 Hồ sơ tình huống · Case file</b><p>${esc(en)}</p></div></div>${s.showVietnamese?`<p class="ta3g-case-vi">🇻🇳 ${esc(vi)}</p>`:''}${!s.showVietnamese?`<button type="button" class="ta3g-control" data-gact="toggle-vi">🇻🇳 Xem gợi ý tiếng Việt</button>`:''}</div>`;
      let exercise='';
      if(s.detectStage==='feeling'){
        exercise=`<p class="ta3g-prompt">Bạn nhỏ cảm thấy thế nào? · ${pronoun==='They'?'How do':'How does'} ${esc(pronoun==='They'?who.toLowerCase():who)} feel?</p>
          <div class="ta3g-mood-grid ${s.optionCount===4?'ta3g-mood-grid-four':''}">${s.moodOptions.map((x,i)=>`<button type="button" class="ta3g-mood-card" data-gact="pick" data-n="${i}" ${s.locked?'disabled':''}><span>${faces[norm(x.word)]}</span><b>${esc(x.word)}</b><small>${esc(x.vietnamese)}</small></button>`).join('')}</div>`;
      }else if(s.detectStage==='sentence'){
        const subjectButtons=subjects.map(v=>`<button type="button" class="ta3g-chip ${s.subjectSelected===v?'chosen':''}" data-gact="subject" data-value="${esc(v)}" ${s.locked?'disabled':''}>${esc(v)}</button>`).join('');
        const beButtons=['am','is','are'].map(v=>`<button type="button" class="ta3g-chip ${s.beSelected===v?'chosen':''}" data-gact="be" data-value="${esc(v)}" ${s.locked?'disabled':''}>${v}</button>`).join('');
        exercise=`<p class="ta3g-prompt">Chọn đại từ và động từ to be để diễn đạt cảm xúc.</p><p class="ta3g-detective-sentence">${esc(s.subjectSelected||'___')} ${esc(s.beSelected||'___')} <strong>${esc(key)}</strong>.</p><p><b>1. Đại từ · Pronoun</b></p><div class="ta3g-chip-row">${subjectButtons}</div><p><b>2. To be</b></p><div class="ta3g-chip-row">${beButtons}</div><button type="button" class="ta3g-control primary" data-gact="check-sentence" ${(!s.subjectSelected||!s.beSelected||s.locked)?'disabled':''}>✅ Kiểm tra câu · Check</button>`;
      }else{
        exercise=`<p class="ta3g-prompt">Bằng chứng nào giải thích đúng cảm xúc trong câu chuyện?</p><div class="ta3g-choices ta3g-reason-options">${s.reasonOptions.map((v,i)=>`<button type="button" class="ta3g-choice" data-gact="pick" data-n="${i}" ${s.locked?'disabled':''}>🔎 ${esc(v)}</button>`).join('')}</div>`;
      }
      const solved=s.locked?`<div class="ta3g-solution">✅ ${esc(pronoun+' '+beFor(pronoun)+' '+key+'.')} <small>🇻🇳 ${esc(who)}: ${esc(q.vietnamese)}</small><small>🔍 ${esc(cause)} — ${esc(causeVi)}</small></div>`:'';
      roundBase(`<h4>🕵️ Feeling Detective · Thám tử cảm xúc</h4>${progress}${sceneBox}${exercise}${solved}`,{listen:en,next:s.locked});
    }
    function advance(stage,message){s.detectStage=stage;s.success=true;s.feedback=message;showRound();}
    function answerPick(i){if(s.locked)return;
      if(s.detectStage==='feeling'){
        const selected=s.moodOptions?.[i];if(!selected)return;
        if(norm(selected.word)!==norm(question().word)){reject('Em hãy đọc hành động của nhân vật và suy nghĩ xem bạn ấy đang cảm thấy thế nào.');return;}
        if(s.level===0){narrate(s.caseData[1]+' '+beFor(s.caseData[1])+' '+norm(question().word)+'.');accept('🔍 Chính xác! Em đã nhận biết cảm xúc từ tình huống.');}
        else advance('sentence','✅ Em đã hiểu đúng cảm xúc! Hãy ghép thành một câu tiếng Anh.');
      }else if(s.detectStage==='evidence'){
        const selected=s.reasonOptions?.[i];if(selected==null)return;
        if(selected===s.caseData[5]){narrate(s.caseData[1]+' '+beFor(s.caseData[1])+' '+norm(question().word)+'.');accept('🏅 Thám tử giỏi! Em tìm đúng cảm xúc, ngữ pháp và bằng chứng.');}
        else reject('Hãy đọc lại hồ sơ: bằng chứng phải đúng với sự việc đã xảy ra.');
      }
    }
    function action(name,n,button){if(s.locked)return;
      if(name==='toggle-vi'){s.showVietnamese=true;s.feedback='';showRound();return;}
      if(s.detectStage!=='sentence')return;
      if(name==='subject'&&subjects.includes(button.dataset.value)){s.subjectSelected=button.dataset.value;s.feedback='';showRound();return;}
      if(name==='be'&&['am','is','are'].includes(button.dataset.value)){s.beSelected=button.dataset.value;s.feedback='';showRound();return;}
      if(name==='check-sentence'){
        if(!s.subjectSelected||!s.beSelected)return;
        if(s.subjectSelected!==s.caseData[1]||s.beSelected!==beFor(s.caseData[1])){
          reject('Quan sát tên nhân vật trong tình huống. He/She đi với is; They đi với are.');return;
        }
        if(s.level===1){narrate(s.subjectSelected+' '+s.beSelected+' '+norm(question().word)+'.');accept('✅ Câu của em đúng ngữ pháp và đúng nhân vật!');}
        else advance('evidence','✅ Câu tiếng Anh đã đúng! Em hãy tìm bằng chứng trong câu chuyện.');
      }
    }
    function hint(){s.feedback=s.detectStage==='feeling'?'💡 Chú ý điều vừa xảy ra và phản ứng của nhân vật (mỉm cười, khóc, lo lắng...).':
      s.detectStage==='sentence'?'💡 Em đang nói về một bạn nam, một bạn nữ hay nhiều bạn? He/She is; They are.':
        '💡 So sánh từng bằng chứng với chi tiết thật trong hồ sơ tình huống.';}
    return {bind,begin,render,pick:answerPick,action,hint,onNext:setup,listen:()=>narrate(s.caseData?.[3])};
  });
})();
