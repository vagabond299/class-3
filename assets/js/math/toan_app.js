/* Epsilon Edu - LOP 3 - Math subject module.
 * Local Class 3 JSON only. Class 2 provides UI form reference, never runtime dependencies.
 * Assessment progress and official grading are owned by the Class 3 backend.
 */
(() => {
  'use strict';
  if (window.CLASS3_SUBJECT_MODULES?.math) return;

  const DATA = 'assets/data/math/';
  const JSONS = Object.freeze({
    discover1:'kham_pha_toan_3_part1.json', discover2:'kham_pha_toan_3_part2.json',
    lessons:'bai_hoc_toan_3.json', exercise1:'bai_tap_toan_3_hk1.json',
    exercise2:'bai_tap_toan_3_hk2.json', review:'on_tap_toan_3.json',
    exams:'de_thi_toan_3.json', lab:'toan_3_muc12.json'
  });
  const SUBJECT_ID = 'toan';
  const ROOT_ID = 'class3-math-runtime';
  const TOPICS = [
    ['Số học','🔢','Số đến 100 000, làm tròn và số La Mã'],
    ['Phép cộng và trừ','➕','Cộng, trừ trong phạm vi 100 000'],
    ['Phép nhân và chia','✖️','Bảng tính, nhân chia nhiều chữ số'],
    ['Hình học','📐','Hình, góc, chu vi và diện tích'],
    ['Đơn vị đo và thời gian','⏰','Đo lường, xem giờ, tiền Việt Nam'],
    ['Biểu thức & quy luật','🧮','Thứ tự phép tính, dấu ngoặc và dãy số'],
    ['Tìm thành phần chưa biết','❓','Tìm x trong phép cộng, trừ, nhân, chia'],
    ['Một phần mấy & gấp, giảm','🍰','Phân số đơn vị, gấp giảm và so sánh'],
    ['Toán có lời văn','📝','Hai bước tính, rút về đơn vị, mua bán'],
    ['Hình học, dữ liệu & xác suất','📊','Chu vi, diện tích, bảng số liệu, khả năng'],
    ['Ôn tập Khám phá','📚','Chờ bổ sung ngân hàng câu hỏi mục 11'],
    ['Math Lab – Toán tư duy Mỹ','✨','Mô hình, khám phá và nhiều cách giải']
  ];
  const GAMES = [
    ['sudoku','Sudoku trí tuệ','🔢','9 cấp độ từ 4×4 đến 9×9','startSudokuGame','stopSudokuGame'],
    ['number-hunt','Săn số 100 000','🎯','Tìm và chạm số phù hợp','startNumberHuntGame','stopNumberHuntGame'],
    ['math-train','Tàu nhân chia','🚂','Kéo kết quả đúng vào toa','startMathTrainGame','stopMathTrainGame'],
    ['target-number','Xưởng biểu thức','⚙️','Thứ tự thực hiện phép tính','startTargetNumberGame','stopTargetNumberGame'],
    ['missing-number','Thợ săn X','⚖️','Tìm thành phần chưa biết','startMissingNumberGame','stopMissingNumberGame'],
    ['number-river','Dòng sông phân số','🐸','Chọn lá sen đúng','startNumberRiverGame','stopNumberRiverGame'],
    ['shape-builder','Kiến trúc sư hình học','🏗️','Thay đổi hình theo yêu cầu','startShapeBuilderGame','stopShapeBuilderGame'],
    ['time-master','Đồng hồ & lịch','🕐','Chỉnh đồng hồ, nhận biết thời gian','startTimeMasterGame','stopTimeMasterGame'],
    ['little-shop','Siêu thị Toán 3','🛒','Mua hàng, ghép tiền thanh toán','startLittleShopGame','stopLittleShopGame'],
    ['math-factory','Trạm đo lường','📏','Thực hành đo và đổi đơn vị','startMathFactoryGame','stopMathFactoryGame'],
    ['pattern-detective','Thám tử dữ liệu','🕵️','Kéo cột biểu đồ đúng','startPatternDetectiveGame','stopPatternDetectiveGame'],
    ['math-race','Đường đua Toán 3','🏎️','Đi qua cổng đúng kết quả','startMathRaceGame','stopMathRaceGame']
  ];
  const LABELS = {discover:'Khám phá',lessons:'Bài học',exercises:'Bài tập',review:'Ôn tập',exams:'Đề thi',games:'Mini games'};
  const cache = new Map();
  const gameScripts = new Map();
  let ctx = null, root = null, page = {tab:'discover',view:'hub'};
  let renderNonce = 0, live = false, gameRunning = null, audio = null, speechNonce = 0;
  let quiz = null, timer = 0, progress = null, catalog = null;
  let lessonPage = 0, lessonChoice = {}, labChoices = {}, labHintLevel = 0;
  let chosenSemester = 1, chosenExerciseSemester = 1;
  let onClickRef = null, onInputRef = null, currentLab = null, currentJourney = null;
  let learningQueue=[], learningInFlight=null;
  let previousGameHub, previousGameSpeak, gameBridgeActive=false;

  const e = (v) => String(v == null ? '' : v).replace(/[&<>"']/g, (x) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]));
  const arr = (v) => Array.isArray(v) ? v : [];
  const str = (v) => String(v == null ? '' : v);
  const n = (v) => Number(v) || 0;
  const lessonId = (v) => `TOAN3_B${String(v).padStart(2,'0')}`;
  const shuffle = (source) => {const a = source.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
  const find = (selector) => root?.querySelector(selector) || null;
  const premium = () => ['admin','vip','trial'].includes(str(ctx?.accessType).toLowerCase());
  const authenticated = () => !!(ctx?.isAuthenticated && ctx?.user?.userId);
  const notice = (txt) => ctx?.hooks?.showToast?.(str(txt));
  const dialog = (txt) => ctx?.hooks?.showDialog?.({title:'Toán 3 thông báo',message:str(txt),icon:'🐝'});
  const detail = (title) => ctx?.hooks?.setDetail?.(title || '');
  const clearDetail = () => ctx?.hooks?.clearDetail?.();
  const safeName = () => ctx?.user?.name || 'Bé';
  const api = async (action,payload={}) => {
    if (!authenticated()) throw new Error('NEED_LOGIN');
    return ctx.apiRequest(action,Object.assign({subjectId:SUBJECT_ID},payload));
  };
  function requirePremium(name) {
    if (premium() && authenticated()) return true;
    ctx?.requestPremiumAccess?.(name || 'nội dung Toán 3');
    return false;
  }
  async function load(k) {
    if (!(k in JSONS)) throw new Error('Dữ liệu không được hỗ trợ');
    if (cache.has(k)) return cache.get(k);
    const request = fetch(DATA + JSONS[k],{cache:'default',credentials:'omit'}).then(async res => {
      if (!res.ok) throw new Error('Không tải được ' + JSONS[k]);
      return res.json();
    }).catch(err=>{cache.delete(k);throw err;});
    cache.set(k,request);
    return request;
  }
  async function loadCatalog() {
    if (catalog) return catalog;
    try {const response=await fetch('assets/data/shared_image_catalog.json',{credentials:'omit'});if(!response.ok)return null;catalog=await response.json();return catalog;}
    catch(_){return null;}
  }
  async function imageHtml(illustration) {
    if (!illustration || typeof illustration!=='object') return '';
    if (illustration.kind === 'emoji') return `<div class="m3-scene-emoji" aria-hidden="true">${e(illustration.emoji)}</div><p class="m3-caption">${e(illustration.caption||'')}</p>`;
    const id=str(illustration.imageId || illustration.image_id);
    if (!id || illustration.kind !== 'catalog_image') return '';
    const c=await loadCatalog(), info=c?.images?.[id];
    if (!info || info.has_text) return '';
    // Trust only paths from the local catalog, not arbitrary URLs coming from a question.
    const src=str(info.src || '');
    if (!src.startsWith('assets/images/') || src.includes('..') || /[\x00-\x1f]/.test(src)) return '';
    return `<figure class="m3-illustration"><img src="${e(src)}" loading="lazy" decoding="async" alt="${e(info.alt_vi||info.name_vi||illustration.alt||'Minh hoạ Toán')}"><figcaption>${e(illustration.caption||'')}</figcaption></figure>`;
  }
  // Adaptive learning telemetry is separate from official assessments. Events never
  // grant exam scores, subject access, or sequential exercise unlock rights.
  function observeLearning(question,correct,origin) {
    if(!authenticated())return;
    const code=/^TOAN3_C[1-6]$/.test(str(question.skill))?str(question.skill):'TOAN3_MISC';
    const originKey=str(origin).replace(/[^A-Za-z0-9]/g,'').slice(0,12)||'practice';
    learningQueue.push({t:Date.now(),q:str(question.id).slice(0,64),s:`${code}.${originKey}`,o:correct?'c':'w',e:originKey,u:0,l:1,tp:n(page.topic)});
    if(learningQueue.length>=10)void flushLearning();
  }
  async function flushLearning(){
    if(learningInFlight||!learningQueue.length||!authenticated())return;
    const events=learningQueue.splice(0,20),apiFn=ctx.apiRequest;
    learningInFlight=Promise.resolve(apiFn('learningProfileSaveBatch',{subjectId:SUBJECT_ID,events}))
      .catch(()=>{ /* Adaptive telemetry failure must not block a learner's current answer. */ })
      .finally(()=>{learningInFlight=null;if(learningQueue.length>=10)void flushLearning();});
    return learningInFlight;
  }
  function stopSpeech() {
    speechNonce++;
    if (audio) {try{audio.pause();audio.removeAttribute('src');audio.load();}catch(_){}audio=null;}
    try{window.speechSynthesis?.cancel?.();}catch(_){}
  }
  async function speak(text) {
    stopSpeech();
    const cleaned=str(text).replace(/<[^>]+>/g,' ').trim().slice(0,420);
    if (!cleaned) return;
    const token=speechNonce;
    try {
      audio=new Audio(); audio.referrerPolicy='no-referrer';
      audio.src='https://translate.google.com/translate_tts?ie=UTF-8&tl=vi&client=tw-ob&q='+encodeURIComponent(cleaned);
      audio.playbackRate=.92;
      await audio.play();
    } catch (_) {
      if (token===speechNonce && 'speechSynthesis' in window) {const u=new SpeechSynthesisUtterance(cleaned);u.lang='vi-VN';u.rate=.9;window.speechSynthesis.speak(u);}
    }
  }
  function stopGame() {
    if (!gameRunning && !gameBridgeActive) return;
    const game=GAMES.find(x=>x[0]===gameRunning);
    try{const stop=game && window[game[5]];if(typeof stop==='function')stop();}catch(_){}
    gameRunning=null;
    if(gameBridgeActive){if(previousGameHub===undefined)delete window.openMiniGameHub;else window.openMiniGameHub=previousGameHub;
      if(previousGameSpeak===undefined)delete window.speakVietnamese;else window.speakVietnamese=previousGameSpeak;
      gameBridgeActive=false;}
  }
  function stopTimer() {if(timer){window.clearInterval(timer);timer=0;}}
  function cleanView() {if(learningQueue.length)void flushLearning();stopSpeech();stopTimer();stopGame();quiz=null;labHintLevel=0;ctx?.hooks?.setScore?.(0,0);}
  function setPage(tab,view,other={}) {page={tab,view,...other};detail(view==='hub'?'':(other.title||LABELS[tab]));}
  function validLive(nonce) {return live && !!root?.isConnected && nonce===renderNonce;}
  function loading() {if(root)root.innerHTML='<div class="m3-loading"><span class="m3-spinner"></span>Đang tải nội dung Toán 3…</div>';}
  function errorView(err) {if(!root)return;root.innerHTML=`<div class="m3-empty">Không mở được dữ liệu Toán 3. ${e(err?.message||'Vui lòng thử lại.')}</div>`;}
  function head(title,desc='',back='hub') {return `<div class="m3-section-header"><div><h2>${e(title)}</h2>${desc?`<p>${e(desc)}</p>`:''}</div>${back==='home'?'':`<button class="m3-back" data-action="back" data-target="${e(back)}">← Quay lại</button>`}</div>`;}
  function folder(title,desc,icon,action,attributes='',foot='Khám phá ngay',locked=false) {
    return `<button type="button" class="m3-folder${locked?' is-locked':''}" data-action="${e(action)}" ${attributes}>
      <span class="m3-folder-head"><span class="m3-folder-icon" aria-hidden="true">${e(icon)}</span><span class="m3-folder-copy"><strong>${e(title)}</strong><small>${e(desc)}</small></span></span>
      <span class="m3-folder-foot"><span>${e(foot)}</span><span>${locked?'🔒':'➜'}</span></span></button>`;
  }
  function list(items) {return `<div class="m3-folder-grid">${items.join('')}</div>`;}
  function roleLabel() {return ctx?.accessType==='admin'?'Admin':ctx?.accessType==='vip'?'VIP':ctx?.accessType==='trial'?'Trial':'Regular / Khách';}
  async function showHub(tab) {
    const nonce=++renderNonce;cleanView();setPage(tab,'hub');loading();
    try {
      let html='', title=LABELS[tab]||'Toán 3', subtitle='Lớp 3 · Kết nối tri thức với cuộc sống';
      if(tab==='discover'){
        html=list(TOPICS.map((x,i)=>folder(`${i+1}. ${x[0]}`,x[2],x[1],i===11?'lab-home':'discover-topic',`data-topic="${i+1}"`,i===10?'Chờ cập nhật':i===11?'9 Lab · 88 hành trình':'50 câu / mục nhỏ',i===10)));
      } else if(tab==='lessons'){
        const d=await load('lessons');if(!validLive(nonce))return;
        html=`<div class="m3-semesters"><button class="m3-sem ${chosenSemester===2?'':'active'}" data-action="semester" data-sem="1">Học kỳ 1</button><button class="m3-sem ${chosenSemester===2?'active':''}" data-action="semester" data-sem="2">Học kỳ 2</button></div>`;
        const sem=chosenSemester;
        html+=list(arr(d.bai_hoc).filter(b=>n(b.semester)===sem).map((b,i)=>folder(`Bài ${b.source_lesson_no}`,b.source_title||b.title,'📖','lesson',`data-id="${e(b.lesson_id)}"`,`${b.pages?.length||3} trang`)));
      } else if(tab==='exercises'){
        await getProgress().catch(()=>null);
        const [a,b]=await Promise.all([load('exercise1'),load('exercise2')]);if(!validLive(nonce))return;
        html='<p class="m3-note">Mỗi bài 20 câu. Đạt từ 80% được mở bài tiếp theo. Kết quả mở khóa phải do máy chủ xác nhận.</p>';
        html+=`<div class="m3-semesters"><button class="m3-sem ${chosenExerciseSemester===1?'active':''}" data-action="exercise-sem" data-sem="1">Bài tập HK1 · 34 bài</button><button class="m3-sem ${chosenExerciseSemester===2?'active':''}" data-action="exercise-sem" data-sem="2">Bài tập HK2 · 24 bài</button>${authenticated()?`<button class="m3-sem" data-action="history" data-kind="baitap" data-sem="hk${chosenExerciseSemester}">📋 Lịch sử</button>`:''}</div>`;
        const source=chosenExerciseSemester===1?arr(a.bai_tap):arr(b.bai_tap);
        html+=list(source.map(item=>{
          const locked=authenticated()&&premium()?n(item.bai)>n(progress?.unlockedBai||1):false;
          return folder(`Bài ${item.source_lesson_no}`,item.title,'✏️','exercise',`data-id="${e(item.exercise_id)}" data-bai="${n(item.bai)}"`,locked?'Cần hoàn thành bài trước':'20 câu · Đạt ≥80%',locked);
        }));
      } else if(tab==='review'){
        const d=await load('review');if(!validLive(nonce))return;
        html='<p class="m3-note">Các bài Luyện tập chung / Ôn tập theo đúng tiến trình SGK. Luyện tại đây không tự mở khóa Bài tập.</p>';
        html+=list(arr(d.on_tap).map(b=>folder(`Bài ${b.source_lesson_no} · ${b.source_title}`,b.title,'🧠','review',`data-id="${e(b.review_id)}"`,'20 câu / lượt')));
      } else if(tab==='exams'){
        const d=await load('exams');if(!validLive(nonce))return;
        const counts={1:0,2:0,hsg:0};arr(d.exams).forEach(x=>{if(x.exam_type==='hsg_advanced'||x.exam_category==='Học sinh giỏi')counts.hsg++;else if(x.semester===1)counts[1]++;else counts[2]++;});
        html=list([folder('Học kỳ I',`${counts[1]} đề · 40 phút`,'🏆','exam-category','data-sem="1"','Đánh giá theo năng lực'),folder('Học kỳ II',`${counts[2]} đề · 40 phút`,'🏆','exam-category','data-sem="2"','Đánh giá theo năng lực'),folder('Học sinh giỏi',`${counts.hsg} đề nâng cao`,'🌟','exam-category','data-sem="hsg"','Không tính vào 6 năng lực chuẩn')]);
      } else if(tab==='games'){
        html=list(GAMES.map((g,i)=>folder(`${i+1}. ${g[1]}`,g[3],g[2],'game',`data-id="${e(g[0])}"`,'Chơi ngay')));
      }
      if(!validLive(nonce))return;
      root.innerHTML=head(title,subtitle,'home')+html;
    } catch(err){if(validLive(nonce))errorView(err);}
  }
  async function showDiscoverTopic(topic) {
    if(topic===11) {dialog('Mục 11 Khám phá sẽ được bổ sung sau.');return;}
    if(topic===12) return showLabHome();
    const nonce=++renderNonce;setPage('discover','topic',{topic,title:`${topic}. ${TOPICS[topic-1][0]}`});loading();
    try {
      const d=topic<=5?await load('discover1'):await load('discover2');if(!validLive(nonce))return;
      const grouped=new Map();arr(d).forEach(q=>{const parts=/^Q_(\d+)_(\d+)_/.exec(str(q.id));if(n(parts?.[1])!==topic)return;const id=parts[2];if(!grouped.has(id))grouped.set(id,{id,name:q.sub,items:[]});grouped.get(id).items.push(q);});
      root.innerHTML=head(`${topic}. ${TOPICS[topic-1][0]}`,'Chọn mục nhỏ để học và trả lời từng câu')+list([...grouped.values()].map((item,i)=>folder(`${topic}.${item.id} ${item.name}`,`${item.items.length} câu hỏi`,'📚','discover-sub',`data-topic="${topic}" data-sub="${e(item.id)}"`,'Bắt đầu')));
    } catch(err){if(validLive(nonce))errorView(err);}
  }
  async function showDiscoverSub(topic,sub) {
    const d=topic<=5?await load('discover1'):await load('discover2');
    const source=arr(d).filter(q=>{const p=/^Q_(\d+)_(\d+)_/.exec(str(q.id));return n(p?.[1])===topic&&str(p?.[2])===str(sub);});
    if(!source.length) return dialog('Chưa có câu hỏi cho mục này.');
    startLocalQuiz('discover',source,`${topic}.${sub} ${source[0].sub}`,{topic,sub});
  }
  function makeQuestion(q,source='generic') {
    if(source==='exam') return {id:str(q.question_id),q:q.question_text,o:q.options,a:q.answer,h:q.hint,skill:q.competency||q.skill_tag,score:n(q.score)};
    return {id:str(q.id),q:q.q,o:q.o,a:q.a,h:q.h,skill:q.competency||q.skill_tag,illustration:q.illustration};
  }
  function startLocalQuiz(tab,source,title,extra={}) {
    cleanView();setPage(tab,'quiz',{title,...extra});
    quiz={mode:'local',kind:tab,title,questions:source.map(q=>makeQuestion(q)),at:0,answers:new Map(),revealed:new Set(),began:Date.now()};
    renderQuestion();
  }
  async function startOfficial(kind,id) {
    if(!requirePremium(kind==='baitap'?'Bài tập':'Đề thi'))return;
    const nonce=++renderNonce;stopSpeech();loading();
    try {
      const key=kind==='baitap'?(Number(id.slice(-2))<=34?'exercise1':'exercise2'):'exams';
      const data=await load(key);if(!validLive(nonce))return;
      let source=null, questions=[],semester='hk1', label='';
      if(kind==='baitap') {
        source=arr(data.bai_tap).find(x=>str(x.exercise_id)===id);
        if(!source) throw new Error('Không tìm thấy bài tập.');
        semester=source.semester===2?'hk2':'hk1';questions=arr(source.embedded_questions);label=`Bài ${source.source_lesson_no}: ${source.title}`;
      } else {
        source=arr(data.exams).find(x=>str(x.exam_id)===str(id));
        if(!source) throw new Error('Không tìm thấy đề thi.');
        semester=source.exam_type==='hsg_advanced'?'hsg':source.semester===2?'hk2':'hk1';questions=arr(source.questions);label=`${source.exam_category} · ${source.exam_name}`;
      }
      const ticket=await api('assessmentAttemptStart',{kind,semester,contentId:kind==='baitap'?source.exercise_id:String(source.exam_id)});
      if(!validLive(nonce))return;
      const ids=arr(ticket.questionIds).map(str),map=new Map(questions.map(q=>[str(kind==='baitap'?q.id:q.question_id),makeQuestion(q,kind==='baitap'?'generic':'exam')]));
      if(!ticket.attemptId||!ids.length||ids.some(q=>!map.has(q))||new Set(ids).size!==ids.length) throw new Error('Danh sách câu hỏi từ máy chủ không khớp dữ liệu Toán 3.');
      cleanView();setPage(kind==='baitap'?'exercises':'exams','quiz',{title:label});
      quiz={mode:'official',kind,id,semester,title:label,attemptId:ticket.attemptId,questions:ids.map(q=>map.get(q)),at:0,answers:new Map(),revealed:new Set(),began:Date.now(),totalSeconds:n(ticket.timeLimitSeconds)||0};
      renderQuestion();
      if(quiz.totalSeconds) startExamTimer();
    } catch(err){if(validLive(nonce)){errorView(new Error(err?.code==='FORBIDDEN'?'Cần có quyền học Toán 3 còn hiệu lực.':err?.code==='EXERCISE_LOCKED'?'Bé cần đạt 80% ở bài trước.':err?.message||'Chưa thể bắt đầu bài.'));}}
  }
  function startExamTimer() {
    const started=Date.now(),total=quiz.totalSeconds;
    const refresh=()=>{
      if(!quiz||quiz.mode!=='official'||quiz.kind!=='baithi') return stopTimer();
      const left=Math.max(0,total-Math.floor((Date.now()-started)/1000));
      const tag=find('[data-quiz-clock]');if(tag)tag.textContent=`${String(Math.floor(left/60)).padStart(2,'0')}:${String(left%60).padStart(2,'0')}`;
      if(left<=0){stopTimer();void submitOfficial();}
    };
    timer=setInterval(refresh,1000);refresh();
  }
  function countRight() {return !quiz?0:quiz.questions.reduce((s,q)=>s+(quiz.answers.get(q.id)===str(q.a)?1:0),0);}
  function renderQuestion() {
    if(!quiz||!root)return;
    const q=quiz.questions[quiz.at],pos=quiz.at,len=quiz.questions.length;
    const chosen=quiz.answers.get(q.id),reveal=quiz.mode==='local' && quiz.revealed.has(q.id);
    const options=arr(q.o),clock=quiz.totalSeconds?'<span class="m3-clock" data-quiz-clock>40:00</span>':'';
    let html=head(quiz.title,(quiz.kind==='baithi'?'Chế độ thi: không hiển thị đáp án trước khi nộp.':quiz.mode==='official'?'Kết quả sẽ được máy chủ kiểm tra.':'Chọn đáp án, sau đó xem giải thích.'),'hub');
    html+=`<div class="m3-question-card"><div class="m3-quiz-top"><span>${quiz.kind==='baithi'?'📝 Đề thi':quiz.kind==='exercises'?'✏️ Bài tập':'🔎 Luyện tập'}</span>${clock}<button class="m3-small" data-action="speak" data-text="${e(q.q)}" title="Nghe câu hỏi">🔊 Nghe câu hỏi</button></div>
      <div class="m3-question-text">${e(q.q)}</div><div data-question-illustration></div><div class="m3-options">${options.map((v,i)=>{
        const selected=chosen===str(v),correct=reveal&&str(v)===str(q.a),wrong=reveal&&selected&&!correct;
        return `<button type="button" class="m3-choice ${selected?'selected':''} ${correct?'correct':''} ${wrong?'wrong':''}" data-action="choose" data-option="${i}" aria-pressed="${selected}"><span>${'ABCD'[i]||i+1}</span>${e(v)}</button>`;
      }).join('')}</div>
      ${reveal?`<div class="m3-explain">${chosen===str(q.a)?'✅ Chính xác!':'🌱 Con thử suy nghĩ thêm nhé.'}${q.h?` <strong>Gợi ý:</strong> ${e(q.h)}`:''}</div>`:''}
      <div class="m3-quiz-nav"><button class="m3-nav" data-action="prev" ${pos===0?'disabled':''}>← Câu trước</button><span class="m3-count">${pos+1} / ${len}</span><button class="m3-nav primary" data-action="next" ${pos===len-1?'disabled':''}>Câu sau →</button></div>
      <div class="m3-quiz-footer"><span>Đã chọn: ${quiz.answers.size}/${len} câu</span><button class="m3-submit" data-action="submit">${quiz.mode==='official'?'Nộp bài và chấm điểm':'Xem kết quả'}</button></div></div>`;
    root.innerHTML=html;
    ctx?.hooks?.setScore?.(quiz.mode==='local'?countRight():0,quiz.mode==='local'?quiz.answers.size-countRight():0);
    if(q.illustration){const id=q.id,at=quiz.at;void imageHtml(q.illustration).then(html=>{if(quiz?.questions?.[quiz.at]?.id===id&&quiz.at===at){const slot=find('[data-question-illustration]');if(slot)slot.innerHTML=html;}});}
  }
  async function submitOfficial() {
    if(!quiz||quiz.mode!=='official'||quiz.submitting)return;
    const thisQuiz=quiz;quiz.submitting=true;
    stopTimer();find('[data-action="submit"]')?.setAttribute('disabled','');
    const payload={kind:thisQuiz.kind,semester:thisQuiz.semester,attemptId:thisQuiz.attemptId,answers:thisQuiz.questions.map(q=>({id:q.id,choice:thisQuiz.answers.get(q.id)||''}))};
    try {
      const outcome=await api('assessmentAttemptSubmit',payload);
      if(thisQuiz!==quiz||!root?.isConnected)return;
      quiz=null;await getProgress(true).catch(()=>null);
      showResult(thisQuiz,outcome);
    } catch(err){
      if(thisQuiz!==quiz)return;
      thisQuiz.submitting=false;
      dialog('Không lưu được kết quả: '+(err?.code==='UNAUTHORIZED'?'Phiên đã hết hạn, hãy đăng nhập lại.':err?.code==='ATTEMPT_EXPIRED'?'Lượt làm bài đã hết hạn.':err?.code==='ASSESSMENT_CONTENT_UNAVAILABLE'?'Máy chủ chưa truy cập được JSON Toán 3 trên website.':err?.code==='ASSESSMENT_CONTENT_CHANGED'?'Dữ liệu Toán 3 vừa được cập nhật. Bé hãy bắt đầu lượt mới.':'Vui lòng thử lại khi có mạng.'));
      renderQuestion();
    }
  }
  function showResult(previous,result) {
    cleanView();setPage(previous.kind==='baitap'?'exercises':'exams','result',{title:previous.title});
    const total=n(result.totalQuestions),right=n(result.correct),pass=!!result.passed;
    const skill=Object.entries(result.competencies||{}).map(([key,val])=>`<li><strong>${e(key)}</strong>: ${e(val.status||'Chưa đánh giá')}${val.status==='Đã đánh giá'?` · ${n(val.percent)}%`:''}</li>`).join('');
    const incorrect=arr(result.wrongQuestions).map(x=>`<li>${e(x.id)} — <strong>Đáp án:</strong> ${e(x.answer||'')} ${x.hint?` · ${e(x.hint)}`:''}</li>`).join('');
    root.innerHTML=head('Kết quả · '+previous.title,'Kết quả chính thức từ Apps Script')+`<section class="m3-result"><div class="m3-medal">${pass?'🏆':'🌱'}</div><h3>${right}/${total} câu đúng${previous.kind==='baithi'?` · ${n(result.score).toFixed(1)} / ${n(result.maxScore).toFixed(1)} điểm`:` · ${n(result.percent)}%`}</h3><p>${e(result.message|| (pass?'Con đã đạt yêu cầu 80%':'Con có thể luyện lại để tiến bộ.'))}</p>${previous.kind==='baitap'?`<p>${pass?'Bài tập tiếp theo đã được mở khóa trên máy chủ.':'Chưa đạt mức 80%, bé luyện lại nhé.'}</p>`:''}${skill?`<h4>Đánh giá năng lực</h4><ul>${skill}</ul>`:''}${incorrect?`<h4>Câu cần xem lại</h4><ul>${incorrect}</ul>`:''}<button class="m3-submit" data-action="back" data-target="hub">Quay lại danh sách</button></section>`;
    ctx?.hooks?.setScore?.(right,total-right);
  }
  function showLocalResult() {
    if(!quiz)return;
    const q=quiz,score=countRight();
    cleanView();setPage(q.kind,'result',{title:q.title});
    root.innerHTML=head('Kết quả luyện tập',q.title)+`<section class="m3-result"><div class="m3-medal">🌟</div><h3>${score} / ${q.questions.length} câu đúng</h3><p>Bé có thể làm lại để hiểu hơn. Kết quả luyện tập này không mở khóa Bài tập chính thức.</p><button class="m3-submit" data-action="back" data-target="hub">Quay lại</button></section>`;
  }
  async function getProgress(force=false) {
    if(!authenticated()||!premium()){progress=null;return null;}
    if(progress&&!force) return progress;
    const d=await api('assessmentProgressGet',{});
    progress=d;return d;
  }
  async function showLesson(id,index=0) {
    if(!requirePremium('Bài học'))return;
    const nonce=++renderNonce;stopSpeech();loading();
    try {
      const data=await load('lessons');if(!validLive(nonce))return;
      const lesson=arr(data.bai_hoc).find(x=>str(x.lesson_id)===id);
      if(!lesson) throw new Error('Không tìm thấy bài học.');
      lessonPage=Math.max(0,Math.min(index,arr(lesson.pages).length-1));
      const p=lesson.pages[lessonPage];setPage('lessons','lesson',{id,title:`Bài ${lesson.source_lesson_no} · ${lesson.source_title}`});
      let content='';
      if(p.page_type==='explore'){
        content=`<p class="m3-lead">${e(p.intro||'')}</p><p>${e(p.story||'')}</p>`;
        content+=await imageHtml(p.illustration);
        if(p.visual_scene) content+=`<p class="m3-note">👀 ${e(p.visual_scene)}</p>`;
        content+=`<div class="m3-knowledge">${arr(p.knowledge_cards).map(x=>`<article><strong>${e(x.title)}</strong><p>${e(x.text)}</p></article>`).join('')}</div>`;
        if(arr(p.worked_examples).length)content+=`<h3>✏️ Ví dụ có hướng dẫn</h3>${arr(p.worked_examples).map(x=>`<p class="m3-example">${e(x)}</p>`).join('')}`;
        if(arr(p.micro_steps).length)content+=`<h3>👣 Từng bước thực hiện</h3><ol>${p.micro_steps.map(x=>`<li>${e(x)}</li>`).join('')}</ol>`;
        if(p.common_mistake) content+=`<p class="m3-note">💡 ${e(p.common_mistake)}</p>`;
        if(p.self_check)content+=`<p class="m3-self-check">🎯 ${e(p.self_check)}</p>`;
      } else if(p.page_type==='practice') {
        content=`<p>${e(p.practice_strategy||'Con hãy chọn đáp án đúng trong các câu sau.')}</p>`;
        content+=arr(p.items).map((item,j)=>{const key=`${id}_${j}`,chosen=lessonChoice[key];return `<div class="m3-guided"><strong>${j+1}. ${e(item.prompt)}</strong><div class="m3-options">${arr(item.options).map((o,i)=>`<button class="m3-choice ${chosen===str(o)?'selected':''}" data-action="lesson-choose" data-question="${j}" data-option="${i}">${e(o)}</button>`).join('')}</div>${chosen?`<p class="${chosen===str(item.answer)?'m3-good':'m3-bad'}">${chosen===str(item.answer)?'✅ Đúng rồi!':'🌱 Thử lại nhé!'} ${chosen===str(item.answer)?e(item.hint||''):''}</p>`:''}</div>`;}).join('');
        if(arr(p.extra_examples).length) content+=`<h3>Ví dụ mở rộng</h3>${p.extra_examples.map(x=>`<p>${e(x)}</p>`).join('')}`;
        if(p.feedback_on_wrong)content+=`<p class="m3-note">💡 ${e(p.feedback_on_wrong)}</p>`;
      } else {
        content=`<h3>🌟 Ghi nhớ kiến thức</h3><ul>${arr(p.key_points).map(x=>`<li>${e(x)}</li>`).join('')}</ul>`;
        content+=`<p class="m3-note">${e(p.finish_prompt||'Con hãy nói lại điều mình vừa học nhé!')}</p>`;
        if(arr(p.quick_check).length)content+=`<h3>🎯 Tự kiểm tra</h3><ul>${p.quick_check.map(x=>`<li>${e(x)}</li>`).join('')}</ul>`;
        if(arr(p.connections).length)content+=`<h3>🔗 Vận dụng</h3><ul>${p.connections.map(x=>`<li>${e(x)}</li>`).join('')}</ul>`;
      }
      if(!validLive(nonce))return;
      root.innerHTML=head(`Bài ${lesson.source_lesson_no} · ${lesson.source_title}`,`Trang ${lessonPage+1} / ${lesson.pages.length}`)+`<section class="m3-paper"><div class="m3-page-tabs">${arr(lesson.pages).map((x,i)=>`<button class="m3-sem ${i===lessonPage?'active':''}" data-action="lesson-page" data-index="${i}">${e(x.title||`Trang ${i+1}`)}</button>`).join('')}</div><div class="m3-lesson-body"><div class="m3-lab-actions"><button class="m3-small" data-action="lesson-speak">🔊 Nghe bài giảng</button><button class="m3-small" data-action="lesson-stop">🔇 Dừng đọc</button></div>${content}</div><div class="m3-quiz-nav"><button class="m3-nav" data-action="lesson-page" data-index="${lessonPage-1}" ${lessonPage===0?'disabled':''}>← Trang trước</button><span class="m3-count">${lessonPage+1} / ${lesson.pages.length}</span><button class="m3-nav primary" data-action="lesson-page" data-index="${lessonPage+1}" ${lessonPage===lesson.pages.length-1?'disabled':''}>Trang sau →</button></div></section>`;
    } catch(err){if(validLive(nonce))errorView(err);}
  }
  async function showReview(id) {
    if(!requirePremium('Ôn tập'))return;
    const d=await load('review'),item=arr(d.on_tap).find(x=>x.review_id===id);
    if(!item)return dialog('Không tìm thấy bài ôn tập.');
    startLocalQuiz('review',shuffle(arr(item.embedded_questions)).slice(0,20),`Bài ${item.source_lesson_no} · ${item.title}`);
  }
  async function showExamCategory(semester) {
    if(!requirePremium('Đề thi'))return;
    const d=await load('exams');const exam=arr(d.exams).filter(x=>semester==='hsg'?x.exam_type==='hsg_advanced'||x.exam_category==='Học sinh giỏi':x.semester===n(semester)&&x.exam_type!=='hsg_advanced');
    setPage('exams','category',{semester,title:semester==='hsg'?'Học sinh giỏi':`Học kỳ ${semester}`});
    root.innerHTML=head(page.title,'Mỗi đề 13 câu · 40 phút · 10 điểm')+`<p class="m3-note">${semester==='hsg'?'Đề nâng cao không đưa vào sáu năng lực chuẩn.':'Kết quả năng lực chỉ được đánh giá khi có đủ câu hỏi theo năng lực.'}</p>${authenticated()?`<button class="m3-sem" data-action="history" data-kind="baithi" data-sem="${semester==='hsg'?'hsg':'hk'+semester}">📋 Lịch sử đề thi</button>`:''}`+list(exam.map(x=>folder(x.exam_name,`${x.time_limit_minutes} phút · 13 câu`,semester==='hsg'?'🌟':'📝','exam',`data-id="${n(x.exam_id)}"`,'Làm đề')));
  }
  async function showHistory(kind,semester) {
    if(!requirePremium('Lịch sử học'))return;
    const nonce=++renderNonce;loading();
    try {
      const d=await api('assessmentHistoryGet',{kind,semester});if(!validLive(nonce))return;
      const rows=arr(d.history).slice(0,100);
      setPage(kind==='baitap'?'exercises':'exams','history',{title:'Lịch sử học'});
      root.innerHTML=head('Lịch sử '+(kind==='baitap'?'Bài tập':'Đề thi'),semester.toUpperCase())+
        (rows.length?`<div class="m3-history">${rows.map(x=>`<article><strong>${e(x.BaiId||x.DeId||'Bài')}</strong> · ${e(x.Timestamp||'')}<p>${e(x.SoCauDung||0)} / ${e(x.TongCauHoi||0)} đúng ${x.DiemSo!==undefined?'· '+e(x.DiemSo)+' điểm':''}</p></article>`).join('')}</div>`:'<p class="m3-note">Chưa có lượt làm bài được lưu.</p>');
    } catch(err){if(validLive(nonce))errorView(err);}
  }

  // Math Lab uses the canonical 9 labs and 88 journeys. Progress is local exploration
  // telemetry only, never a backend entitlement or an exercise-unlock credential.
  function labKey() {return 'epsilon-class3-math-lab-'+(ctx?.user?.userId||'guest');}
  function labSaved() {try{return JSON.parse(localStorage.getItem(labKey())||'{}')||{};}catch(_){return {};}}
  function markLab(id) {const d=labSaved();d[id]=Date.now();try{localStorage.setItem(labKey(),JSON.stringify(d));}catch(_){} }
  async function showLabHome() {
    const nonce=++renderNonce;stopSpeech();loading();
    try {
      const d=await load('lab');if(!validLive(nonce))return;
      setPage('discover','lab-home',{title:'12. Math Lab'});
      root.innerHTML=head('12. Math Lab – Toán tư duy Mỹ','9 Lab · 88 hành trình · 352 hoạt động')+list(arr(d.labs).map(l=>folder(l.title,l.subtitle,'✨','lab-track',`data-id="${e(l.display_code)}"`,`${arr(l.journeys).length} hành trình`)));
    } catch(err){if(validLive(nonce))errorView(err);}
  }
  async function showLabTrack(code) {
    const d=await load('lab'),lab=arr(d.labs).find(l=>l.display_code===code);if(!lab)return;
    currentLab=lab;setPage('discover','lab-track',{code,title:lab.title});
    const saved=labSaved();
    root.innerHTML=head(lab.title,lab.subtitle||'Các hành trình theo SGK')+list(arr(lab.journeys).map((j,i)=>{
      const done=arr(j.activities).filter(a=>saved[a.id]).length;
      const locked=!!(premium()&&authenticated()&&progress&&n(j.unlock_after_source_lesson)>0&&
        !hasLearnedSourceLesson(n(j.unlock_after_source_lesson)));
      return folder(j.title,j.goal,j.icon||'🧩','lab-journey',`data-index="${i}"`,locked?'Cần học bài SGK tương ứng':`${done}/${arr(j.activities).length} hoạt động`,locked);
    }));
  }
  function hasLearnedSourceLesson(sourceNo) {
    // Gate only uses server-confirmed completed lesson sequence, never local passed=true.
    // Main learning lessons are 1..58, SGK source numbers include separate review lessons.
    const all=progress?.sourceLessonsPassed || [];
    return all.some(x=>n(x)>=sourceNo);
  }
  function getActivity() {return currentJourney?.activities?.[n(page.activity)] || null;}
  function valueOfLab() {return labChoices[getActivity()?.id];}
  function setValueOfLab(val) {const activity=getActivity();if(activity)labChoices[activity.id]=val;}
  function numberField(name,value,min=0,max=99999,step=1) {return `<label class="m3-lab-number">${e(name)}<input type="number" data-lab-field="${e(name)}" min="${min}" max="${max}" step="${step}" value="${e(value??'0')}"></label>`;}
  function labActivityControls(a) {
    const v=valueOfLab();
    if(a.type==='choices'){
      const sel=Array.isArray(v)?v:[v];return `<div class="m3-options">${arr(a.choices).map((x,i)=>`<button class="m3-choice ${sel.includes(i)?'selected':''}" data-action="lab-choice" data-index="${i}">${e(x)}</button>`).join('')}</div>`;
    }
    if(a.type==='number_input'||a.type==='equal_share')return numberField(a.type==='equal_share'?'Mỗi nhóm có bao nhiêu?':'Nhập kết quả',v??'',-100000,100000,1);
    if(a.type==='place_value_build'){
      const obj=v&&typeof v==='object'&&!Array.isArray(v)?v:{};
      return `<div class="m3-lab-fields">${Object.keys(a.expected||{}).map(k=>numberField(({ten_thousands:'Chục nghìn',thousands:'Nghìn',hundreds:'Trăm',tens:'Chục',ones:'Đơn vị'})[k]||k,obj[k]??0,0,9)).join('')}</div>`;
    }
    if(a.type==='array_build'||a.type==='group_build'){
      const obj=v&&typeof v==='object'&&!Array.isArray(v)?v:{};
      return `<div class="m3-lab-fields">${numberField(a.type==='array_build'?'Số hàng':'Số nhóm',obj.a??1,1,100)}${numberField(a.type==='array_build'?'Số cột':'Mỗi nhóm',obj.b??1,1,100)}</div><div class="m3-model">${'🔵 '.repeat(Math.min(30,Math.max(1,n(obj.a)*n(obj.b))))}</div>`;
    }
    if(a.type==='fraction_model'){
      const sel=arr(v);return `<div class="m3-fraction">${Array.from({length:n(a.denominator)},(_,i)=>`<button class="${sel.includes(i)?'selected':''}" data-action="lab-fraction" data-index="${i}">${sel.includes(i)?'🟪':'⬜'}</button>`).join('')}</div>`;
    }
    if(a.type==='order_numbers'){
      const sel=arr(v);return `<p>Chạm các số theo thứ tự yêu cầu:</p><div class="m3-options">${arr(a.numbers).map((x,i)=>`<button class="m3-choice ${sel.includes(i)?'selected':''}" data-action="lab-order" data-index="${i}" ${sel.includes(i)?'disabled':''}>${e(x)}</button>`).join('')}</div><p>Đã chọn: ${sel.map(i=>e(a.numbers[i])).join(' → ')}</p><button class="m3-small" data-action="lab-clear">Làm lại thứ tự</button>`;
    }
    if(a.type==='open_number_line'||a.type==='measure_slider')return `<div class="m3-slider"><input type="range" data-lab-range min="${n(a.min)}" max="${n(a.max)}" step="1" value="${Number.isFinite(Number(v))?Number(v):n(a.min)}"><span data-lab-range-value>${Number.isFinite(Number(v))?Number(v):n(a.min)} ${e(a.unit||'')}</span></div>`;
    if(a.type==='clock_set'){
      const obj=v&&typeof v==='object'?v:{};
      return `<div class="m3-lab-clock">🕒</div><div class="m3-lab-fields">${numberField('Giờ',obj.hour??12,1,12)}${numberField('Phút',obj.minute??0,0,59)}</div>`;
    }
    if(a.type==='calendar_pick'){
      const days=n(a.days_in_month);const start=n(a.start_weekday);
      return `<div class="m3-calendar">${['T2','T3','T4','T5','T6','T7','CN'].map(x=>`<strong>${x}</strong>`).join('')}${Array.from({length:start},()=>'<span></span>').join('')}${Array.from({length:days},(_,i)=>`<button class="${v===i+1?'selected':''}" data-action="lab-day" data-day="${i+1}">${i+1}</button>`).join('')}</div>`;
    }
    if(a.type==='money_build'){
      const obj=v&&typeof v==='object'?v:{};
      const total=arr(a.denominations).reduce((s,d)=>s+d*n(obj[d]),0);
      return `<p>Đã ghép <strong>${total.toLocaleString('vi-VN')} đồng</strong></p><div class="m3-lab-fields">${arr(a.denominations).map(d=>numberField(`${n(d).toLocaleString('vi-VN')}đ`,obj[d]??0,0,30)).join('')}</div>`;
    }
    if(a.type==='data_tally'){
      const obj=v&&typeof v==='object'?v:{};
      return `<div class="m3-lab-fields">${arr(a.labels).map(x=>numberField(x,obj[x]??0,0,100)).join('')}</div>`;
    }
    return '<p class="m3-note">Chưa có bộ điều khiển phù hợp với hoạt động này.</p>';
  }
  function checkActivity(a,v) {
    if(a.type==='choices'){
      const indices=arr(a.answer_indices);
      if(indices.length) return JSON.stringify(arr(v).slice().sort((a,b)=>a-b))===JSON.stringify(indices.slice().sort((a,b)=>a-b));
      return n(v)>=0&&str(a.choices?.[n(v)])===str(a.answer);
    }
    if(a.type==='number_input')return Number(v)===Number(a.target);
    if(a.type==='equal_share')return Number(v)===Number(a.answer_each);
    if(a.type==='place_value_build')return Object.entries(a.expected||{}).every(([k,val])=>n(v?.[k])===n(val));
    if(a.type==='array_build')return n(v?.a)===n(a.expected_rows)&&n(v?.b)===n(a.expected_cols);
    if(a.type==='group_build')return n(v?.a)===n(a.expected_groups)&&n(v?.b)===n(a.expected_per_group);
    if(a.type==='fraction_model')return arr(v).length===n(a.shade_count);
    if(a.type==='order_numbers')return JSON.stringify(arr(v).map(i=>a.numbers[i]))===JSON.stringify(a.answer);
    if(a.type==='open_number_line'||a.type==='measure_slider')return Math.abs(Number(v)-Number(a.target))<=n(a.tolerance);
    if(a.type==='clock_set')return n(v?.hour)===n(a.target_hour)&&n(v?.minute)===n(a.target_minute);
    if(a.type==='calendar_pick')return n(v)===n(a.target_day);
    if(a.type==='money_build')return arr(a.denominations).reduce((sum,d)=>sum+n(d)*n(v?.[d]),0)===n(a.target);
    if(a.type==='data_tally')return arr(a.labels).every((x,i)=>n(v?.[x])===n(a.targets?.[i]));
    return false;
  }
  function showJourney(index,activity=0) {
    if(!currentLab?.journeys?.[index])return;
    currentJourney=currentLab.journeys[index];labHintLevel=0;
    page={tab:'discover',view:'lab-activity',code:currentLab.display_code,journeyIndex:index,activity,title:currentJourney.title};
    renderLabActivity();
  }
  function renderLabActivity() {
    const a=getActivity();if(!a)return;
    const at=n(page.activity),count=currentJourney.activities.length,done=!!labSaved()[a.id];
    const feedback=labChoices[a.id+'_checked'];
    root.innerHTML=head(currentJourney.title,`Hoạt động ${at+1} / ${count}`,'lab-track')+`<section class="m3-paper"><h3>${e(a.teacher||'Cùng khám phá')}</h3><p class="m3-lead">${e(a.prompt||'')}</p><button class="m3-small" data-action="lab-speak">🔊 Nghe hướng dẫn</button>${labActivityControls(a)}${feedback?`<p class="${feedback==='ok'?'m3-good':'m3-bad'}">${e(feedback==='ok'?a.success||'Đúng rồi!':a.wrong_audio||'Con thử lại nhé.')}</p>`:''}${labHintLevel>0?`<p class="m3-note">💡 ${e(arr(a.hints)[Math.min(labHintLevel-1,arr(a.hints).length-1)]||'')}</p>`:''}<div class="m3-lab-actions"><button class="m3-small" data-action="lab-hint">💡 Gợi ý ${labHintLevel}</button><button class="m3-submit" data-action="lab-check">Kiểm tra</button></div><div class="m3-quiz-nav"><button class="m3-nav" data-action="lab-step" data-diff="-1" ${at===0?'disabled':''}>← Hoạt động trước</button><span class="m3-count">${at+1} / ${count}${done?' ✅':''}</span><button class="m3-nav primary" data-action="lab-step" data-diff="1" ${at===count-1?'disabled':''}>Hoạt động sau →</button></div></section>`;
  }
  function labValueChanged(field,value,kind='number') {
    const a=getActivity();if(!a)return;
    if(kind==='range'){setValueOfLab(n(value));find('[data-lab-range-value]').textContent=str(value)+' '+str(a.unit||'');return;}
    const previous=valueOfLab();
    if(['number_input','equal_share'].includes(a.type)) setValueOfLab(value);
    else {const next=(previous&&typeof previous==='object'&&!Array.isArray(previous))?{...previous}:{};
      let key=field;
      if(a.type==='place_value_build')key=({Nghìn:'thousands',Trăm:'hundreds',Chục:'tens','Đơn vị':'ones','Chục nghìn':'ten_thousands'})[field]||field;
      else if(a.type==='array_build'||a.type==='group_build') key=(field==='Số hàng'||field==='Số nhóm')?'a':'b';
      else if(a.type==='clock_set')key=field==='Giờ'?'hour':'minute';
      else if(a.type==='money_build') key=str(field).replace(/\D/g,'');
      next[key]=Number(value);setValueOfLab(next);
    }
  }
  async function playGame(id) {
    if(!requirePremium('Mini games'))return;
    const game=GAMES.find(x=>x[0]===id);if(!game)return;
    const nonce=++renderNonce;stopGame();stopSpeech();setPage('games','playing',{id,title:game[1]});
    root.innerHTML=head(game[1],game[3])+`<div id="game-play-container" class="m3-game-canvas"><div class="m3-loading"><span class="m3-spinner"></span>Đang tải Mini game…</div></div>`;
    try {
      const src=`assets/js/math/games/${id}.js`;
      if(!gameScripts.has(id)) {
        gameScripts.set(id,new Promise((resolve,reject)=>{
          const script=document.createElement('script');script.src=src;script.async=true;
          script.onload=resolve;script.onerror=()=>reject(new Error('Chưa có '+src));document.head.appendChild(script);
        }).catch(err=>{gameScripts.delete(id);throw err;}));
      }
      await gameScripts.get(id);
      if(!validLive(nonce))return;
      const start=window[game[4]];if(typeof start!=='function') throw new Error('Game chưa có hàm khởi động.');
      if(!gameBridgeActive){previousGameHub=window.openMiniGameHub;previousGameSpeak=window.speakVietnamese;gameBridgeActive=true;
        window.openMiniGameHub=()=>{stopGame();void showHub('games');};
        window.speakVietnamese=(text)=>{void speak(text);};}
      gameRunning=id;start();
    }catch(err){if(validLive(nonce))errorView(err);}
  }

  async function navigateBack() {
    if(!page||page.view==='hub') return showHub(page?.tab||'discover');
    if(page.view==='topic'||(page.view==='quiz'&&page.tab==='discover')) return page.view==='topic'?showHub('discover'):showDiscoverTopic(page.topic);
    if(page.view==='lab-activity')return showLabTrack(page.code);
    if(page.view==='lab-track')return showLabHome();
    if(page.view==='category')return showHub('exams');
    return showHub(page.tab||'discover');
  }
  async function handleClick(event) {
    const btn=event.target.closest('[data-action]');if(!btn||!root?.contains(btn)||btn.disabled)return;
    const a=btn.dataset.action,id=btn.dataset.id,idx=n(btn.dataset.index);
    if(a==='back')return btn.dataset.target==='home'?showHub(page.tab):navigateBack();
    if(a==='semester'){chosenSemester=n(btn.dataset.sem);return showSemester(page.tab,chosenSemester);}
    if(a==='exercise-sem'){chosenExerciseSemester=n(btn.dataset.sem);return showHub('exercises');}
    if(a==='discover-topic')return showDiscoverTopic(n(btn.dataset.topic));
    if(a==='discover-sub')return showDiscoverSub(n(btn.dataset.topic),btn.dataset.sub);
    if(a==='lab-home')return showLabHome();
    if(a==='lab-track')return showLabTrack(id);
    if(a==='lab-journey'){
      const j=currentLab?.journeys?.[idx];
      if(j && premium() && authenticated() && progress && !hasLearnedSourceLesson(n(j.unlock_after_source_lesson)))return dialog('Hành trình này chỉ mở sau bài SGK tương ứng.');
      return showJourney(idx,0);
    }
    if(a==='lab-step'){labHintLevel=0;page.activity=Math.max(0,Math.min(n(page.activity)+n(btn.dataset.diff),currentJourney.activities.length-1));return renderLabActivity();}
    if(a==='lab-choice'){
      const activity=getActivity(),isMulti=arr(activity?.answer_indices).length>0;
      const prev=valueOfLab();
      setValueOfLab(isMulti?(arr(prev).includes(idx)?arr(prev).filter(x=>x!==idx):arr(prev).concat(idx)):idx);
      return renderLabActivity();
    }
    if(a==='lab-fraction'){const prev=arr(valueOfLab());setValueOfLab(prev.includes(idx)?prev.filter(x=>x!==idx):prev.concat(idx));return renderLabActivity();}
    if(a==='lab-order'){const prev=arr(valueOfLab());if(!prev.includes(idx))setValueOfLab(prev.concat(idx));return renderLabActivity();}
    if(a==='lab-day'){setValueOfLab(n(btn.dataset.day));return renderLabActivity();}
    if(a==='lab-clear'){setValueOfLab([]);return renderLabActivity();}
    if(a==='lab-hint'){labHintLevel=Math.min(3,labHintLevel+1);return renderLabActivity();}
    if(a==='lab-check') {const act=getActivity();const correct=checkActivity(act,valueOfLab());labChoices[act.id+'_checked']=correct?'ok':'wrong';if(correct)markLab(act.id);return renderLabActivity();}
    if(a==='lab-speak')return speak(getActivity()?.instruction_audio||getActivity()?.prompt||'');
    if(a==='lesson')return showLesson(id);
    if(a==='lesson-speak'){const data=await load('lessons'),lesson=data.bai_hoc.find(x=>x.lesson_id===page.id);return speak(lesson?.pages?.[lessonPage]?.teacher_script||lesson?.pages?.[lessonPage]?.intro||lesson?.source_title||'');}
    if(a==='lesson-stop')return stopSpeech();
    if(a==='lesson-page')return showLesson(page.id,idx);
    if(a==='lesson-choose'){
      const data=await load('lessons'),lesson=data.bai_hoc.find(x=>x.lesson_id===page.id),item=lesson?.pages?.[lessonPage]?.items?.[n(btn.dataset.question)];
      if(item){const key=`${page.id}_${btn.dataset.question}`,choice=item.options[n(btn.dataset.option)];if(!Object.prototype.hasOwnProperty.call(lessonChoice,key))observeLearning({id:key,skill:item.competency||item.skill_tag},str(choice)===str(item.answer),'lesson');lessonChoice[key]=choice;}return showLesson(page.id,lessonPage);
    }
    if(a==='exercise')return startOfficial('baitap',id);
    if(a==='review')return showReview(id);
    if(a==='exam-category')return showExamCategory(btn.dataset.sem);
    if(a==='exam')return startOfficial('baithi',id);
    if(a==='game')return playGame(id);
    if(a==='speak')return speak(btn.dataset.text);
    if(a==='choose'&&quiz){const q=quiz.questions[quiz.at],choice=str(q.o[idx]);quiz.answers.set(q.id,choice);if(quiz.mode==='local'&&!quiz.revealed.has(q.id))observeLearning(q,choice===str(q.a),quiz.kind);if(quiz.mode==='local')quiz.revealed.add(q.id);return renderQuestion();}
    if(a==='prev'&&quiz){quiz.at=Math.max(0,quiz.at-1);stopSpeech();return renderQuestion();}
    if(a==='next'&&quiz){quiz.at=Math.min(quiz.questions.length-1,quiz.at+1);stopSpeech();return renderQuestion();}
    if(a==='submit'){
      if(quiz?.mode==='official')return submitOfficial();
      return showLocalResult();
    }
    if(a==='history')return showHistory(btn.dataset.kind,btn.dataset.sem);
  }
  async function showSemester(tab,sem) {chosenSemester=sem;await showHub(tab);}
  function handleInput(event) {
    const input=event.target;
    if(input.matches('[data-lab-field]'))labValueChanged(input.dataset.labField,input.value);
    else if(input.matches('[data-lab-range]'))labValueChanged('',input.value,'range');
  }
  function bindRoot() {
    onClickRef=(event)=>{void handleClick(event).catch(err=>{console.error('[Class3 Math action]',err);dialog('Chưa thực hiện được thao tác. Bé thử lại nhé!');});};
    onInputRef=handleInput;root.addEventListener('click',onClickRef);root.addEventListener('input',onInputRef);
  }
  function ensureStyle() {
    if(document.getElementById('class3-math-module-style'))return;
    const style=document.createElement('style');style.id='class3-math-module-style';style.textContent=STYLES;document.head.appendChild(style);
  }
  async function render(nextCtx) {
    const newCtx=nextCtx||{},oldHost=ctx?.host,previousUser=ctx?.user?.userId||'',nextUser=newCtx?.user?.userId||'';
    if(root&&(oldHost!==newCtx.host||!root.isConnected))destroy();
    if(previousUser!==nextUser){learningQueue=[];learningInFlight=null;lessonChoice={};labChoices={};progress=null;}
    ctx=newCtx;live=true;ensureStyle();
    if(!root) {root=document.createElement('section');root.id=ROOT_ID;root.setAttribute('aria-label','Module Toán 3');ctx.host?.replaceChildren(root);bindRoot();}
    const tab=LABELS[nextCtx?.tabId]?nextCtx.tabId:'discover';
    renderNonce++;cleanView();await showHub(tab);
  }
  function destroy() {
    live=false;renderNonce++;cleanView();
    try{root?.removeEventListener('click',onClickRef);root?.removeEventListener('input',onInputRef);}catch(_){}
    try{root?.remove();}catch(_){}
    root=null;ctx?.hooks?.clearDetail?.();ctx=null;progress=null;currentLab=null;currentJourney=null;learningQueue=[];
  }
  window.CLASS3_SUBJECT_MODULES=window.CLASS3_SUBJECT_MODULES||{};
  window.CLASS3_SUBJECT_MODULES.math=Object.freeze({render,destroy});

  const STYLES = `
#class3-math-runtime{--m3-purple:#7c3aed;--m3-pink:#ec4899;--m3-line:#ddd6fe;color:#344054;font-family:"Nunito","Segoe UI",Arial,sans-serif;max-width:82rem;margin:0 auto}
#class3-math-runtime *{box-sizing:border-box}
#class3-math-runtime button{font:inherit;cursor:pointer}
#class3-math-runtime button:disabled{opacity:.42;cursor:not-allowed}
#class3-math-runtime h2,#class3-math-runtime h3,#class3-math-runtime h4{color:#5b216e;margin:0 0 .55rem;line-height:1.3}
#class3-math-runtime p{line-height:1.6}
#class3-math-runtime .m3-section-header{display:flex;justify-content:space-between;align-items:flex-start;gap:12px;margin:2px 0 14px}
#class3-math-runtime .m3-section-header h2{font-size:clamp(22px,2.4vw,29px);font-weight:950;margin:0}
#class3-math-runtime .m3-section-header p{margin:.25rem 0 0;color:#667085;font-weight:750}
#class3-math-runtime .m3-back,#class3-math-runtime .m3-small{min-height:40px;padding:9px 15px;border:1px solid #c4b5fd;border-radius:13px;color:#6d28d9;background:#faf5ff;font-size:15px;font-weight:900;flex-shrink:0}
#class3-math-runtime .m3-back:hover,#class3-math-runtime .m3-small:hover{background:#f3e8ff;border-color:#8b5cf6}
#class3-math-runtime .m3-folder-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(235px,1fr));gap:12px}
#class3-math-runtime .m3-folder{--m3-br:#f9a8d4;--m3-icon-bg:#ffe0ed;min-height:142px;text-align:left;border:1px solid var(--m3-br);background:linear-gradient(135deg,#fff8fc,#fbf4ff);border-radius:20px;padding:14px;display:flex;flex-direction:column;justify-content:space-between;gap:12px;box-shadow:0 4px 14px rgba(76,29,149,.055);transform:none!important;translate:none!important;transition:border-color .18s ease,box-shadow .18s ease,filter .18s ease!important}
#class3-math-runtime .m3-folder:nth-child(6n+2){--m3-br:#86efac;--m3-icon-bg:#dcfce7;background:linear-gradient(135deg,#f7fffc,#ecfdf5)}
#class3-math-runtime .m3-folder:nth-child(6n+3){--m3-br:#c4b5fd;--m3-icon-bg:#ede9fe;background:linear-gradient(135deg,#fdfaff,#f5f3ff)}
#class3-math-runtime .m3-folder:nth-child(6n+4){--m3-br:#fcd34d;--m3-icon-bg:#ffedbf;background:linear-gradient(135deg,#fffcf5,#fffbeb)}
#class3-math-runtime .m3-folder:nth-child(6n+5){--m3-br:#a5b4fc;--m3-icon-bg:#e0e7ff;background:linear-gradient(135deg,#f8faff,#eef2ff)}
#class3-math-runtime .m3-folder:nth-child(6n+6){--m3-br:#5eead4;--m3-icon-bg:#ccfbf1;background:linear-gradient(135deg,#f6fffb,#f0fdfa)}
#class3-math-runtime .m3-folder:is(:hover,:focus-visible){transform:none!important;translate:none!important;filter:brightness(1.035) saturate(1.08)!important;border-color:#a855f7;box-shadow:0 7px 18px rgba(76,29,149,.16)}
#class3-math-runtime .m3-folder:nth-child(6n+1):is(:hover,:focus-visible){border-color:#ec4899}
#class3-math-runtime .m3-folder:nth-child(6n+2):is(:hover,:focus-visible){border-color:#10b981}
#class3-math-runtime .m3-folder:nth-child(6n+4):is(:hover,:focus-visible){border-color:#f59e0b}
#class3-math-runtime .m3-folder:nth-child(6n+5):is(:hover,:focus-visible){border-color:#6366f1}
#class3-math-runtime .m3-folder:nth-child(6n+6):is(:hover,:focus-visible){border-color:#14b8a6}
#class3-math-runtime .m3-folder-head{display:flex;align-items:flex-start;gap:11px;min-width:0}
#class3-math-runtime .m3-folder-icon{display:flex;align-items:center;justify-content:center;flex:0 0 60px;width:60px;height:60px;border:2px solid var(--m3-br);border-radius:17px;background:var(--m3-icon-bg);font-family:'Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji',sans-serif;font-size:36px;font-weight:400;line-height:1;box-shadow:0 3px 9px rgba(109,40,217,.13),inset 0 1px 2px #fff;transition:transform .18s ease,box-shadow .18s ease}
#class3-math-runtime .m3-folder:is(:hover,:focus-visible) .m3-folder-icon{transform:scale(1.07);box-shadow:0 5px 12px rgba(109,40,217,.22),inset 0 1px 2px #fff}
#class3-math-runtime .m3-folder-copy{min-width:0;flex:1}
#class3-math-runtime .m3-folder-copy strong{display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;overflow:hidden;color:#5b216e;font-size:19px;font-weight:950;line-height:1.28}
#class3-math-runtime .m3-folder-copy small{display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;overflow:hidden;color:#475467;font-size:15px;font-weight:750;margin-top:6px;line-height:1.4}
#class3-math-runtime .m3-folder-foot{display:flex;justify-content:space-between;align-items:center;border-top:1px solid rgba(124,58,237,.12);padding-top:7px;font-size:14px;font-weight:900;color:#7c3aed}
#class3-math-runtime .m3-folder.is-locked{background:#f8fafc;border-color:#cbd5e1}
#class3-math-runtime .m3-question-card,#class3-math-runtime .m3-paper,#class3-math-runtime .m3-result{border:1px solid #e9d5ff;border-radius:20px;padding:clamp(12px,2vw,24px);background:#fff;box-shadow:0 4px 15px rgba(76,29,149,.055)}
#class3-math-runtime .m3-question-text{font-size:clamp(20px,2vw,25px);font-weight:950;color:#5b216e;text-align:center;line-height:1.45;margin:20px 0}
#class3-math-runtime .m3-options{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:11px;margin:16px 0}
#class3-math-runtime .m3-choice{min-height:66px;padding:13px 14px;border:1px solid #c4b5fd;border-radius:16px;background:#faf5ff;color:#344054;font-size:18px;font-weight:850;text-align:left;display:flex;align-items:center;gap:12px;transition:background .18s,border-color .18s,box-shadow .18s}
#class3-math-runtime .m3-choice:nth-child(4n+1){background:#fff1f7;border-color:#f9a8d4}
#class3-math-runtime .m3-choice:nth-child(4n+2){background:#ecfdf5;border-color:#86efac}
#class3-math-runtime .m3-choice:nth-child(4n+3){background:#f5f3ff;border-color:#c4b5fd}
#class3-math-runtime .m3-choice:nth-child(4n+4){background:#eff6ff;border-color:#93c5fd}
#class3-math-runtime .m3-choice span{width:28px;height:28px;border-radius:9px;background:#fff;flex:0 0 28px;display:flex;align-items:center;justify-content:center;font-weight:950;color:#6d28d9}
#class3-math-runtime .m3-choice:hover,#class3-math-runtime .m3-choice.selected{border-color:#8b5cf6;box-shadow:0 0 0 2px rgba(139,92,246,.14);filter:brightness(1.025)}
#class3-math-runtime .m3-choice.correct{color:#047857;border-color:#10b981;background:#dcfce7}
#class3-math-runtime .m3-choice.wrong{color:#be123c;border-color:#fb7185;background:#fff1f2}
#class3-math-runtime .m3-quiz-top,#class3-math-runtime .m3-quiz-footer{display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;font-weight:900;color:#7c3aed}
#class3-math-runtime .m3-quiz-footer{border-top:1px solid #f3e8ff;padding-top:15px}
#class3-math-runtime .m3-quiz-nav{display:grid;grid-template-columns:minmax(0,1fr) 104px minmax(0,1fr);gap:9px;align-items:center;margin:17px 0}
#class3-math-runtime .m3-nav,#class3-math-runtime .m3-count{min-height:45px;border-radius:13px;padding:8px 10px;display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:950;text-align:center}
#class3-math-runtime .m3-nav{border:1px solid #ddd6fe;background:#faf5ff;color:#6d28d9}
#class3-math-runtime .m3-nav.primary,#class3-math-runtime .m3-submit{border:0;background:linear-gradient(100deg,#ec4899,#8b5cf6);color:#fff;box-shadow:0 5px 12px rgba(139,92,246,.16)}
#class3-math-runtime .m3-count{border:1px solid #e9d5ff;background:#fff;color:#6d28d9}
#class3-math-runtime .m3-submit{min-height:46px;padding:9px 19px;border-radius:14px;font-size:16px;font-weight:950}
#class3-math-runtime .m3-explain,#class3-math-runtime .m3-note{padding:12px 14px;border:1px solid #fcd34d;border-radius:13px;background:#fffbeb;color:#92400e;line-height:1.5;font-weight:750;margin:12px 0}
#class3-math-runtime .m3-good{background:#ecfdf5;border:1px solid #86efac;color:#047857;padding:10px;border-radius:12px;font-weight:900}
#class3-math-runtime .m3-bad{background:#fff1f2;border:1px solid #fda4af;color:#be123c;padding:10px;border-radius:12px;font-weight:900}
#class3-math-runtime .m3-knowledge{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:9px;margin:13px 0}
#class3-math-runtime .m3-knowledge article,#class3-math-runtime .m3-guided{border:1px solid #ddd6fe;border-radius:15px;background:#faf5ff;padding:14px;margin-bottom:12px}
#class3-math-runtime .m3-knowledge strong{color:#6d28d9}
#class3-math-runtime .m3-example{padding:12px;border-left:3px solid #a855f7;background:#fdf4ff;font-weight:800;white-space:pre-wrap}
#class3-math-runtime .m3-self-check{border:1px solid #bae6fd;border-radius:13px;padding:12px;background:#eff6ff;color:#0369a1;font-weight:850}
#class3-math-runtime .m3-lead{font-size:19px;font-weight:850;color:#475467}
#class3-math-runtime .m3-lesson-body{padding:13px 4px;line-height:1.65}
#class3-math-runtime .m3-lesson-body li{margin:8px 0}
#class3-math-runtime .m3-page-tabs,#class3-math-runtime .m3-semesters{display:flex;flex-wrap:wrap;gap:9px;margin:10px 0 16px}
#class3-math-runtime .m3-sem{border:1px solid #c4b5fd;border-radius:13px;background:#faf5ff;color:#6d28d9;font-weight:900;padding:9px 13px}
#class3-math-runtime .m3-sem.active{color:#fff;border-color:#8b5cf6;background:linear-gradient(100deg,#ec4899,#8b5cf6)}
#class3-math-runtime .m3-illustration{max-width:560px;margin:12px auto;text-align:center}
#class3-math-runtime .m3-illustration img{width:100%;max-height:360px;object-fit:contain;border-radius:17px;border:1px solid #e9d5ff}
#class3-math-runtime .m3-caption,#class3-math-runtime .m3-illustration figcaption{text-align:center;color:#667085;font-size:14px}
#class3-math-runtime .m3-scene-emoji{text-align:center;font-size:65px;line-height:1.4}
#class3-math-runtime .m3-result{text-align:center;max-width:850px;margin:0 auto}
#class3-math-runtime .m3-result ul{text-align:left;line-height:1.8}
#class3-math-runtime .m3-result h3{font-size:23px}
#class3-math-runtime .m3-medal{font-size:65px}
#class3-math-runtime .m3-loading,#class3-math-runtime .m3-empty{min-height:220px;display:flex;align-items:center;justify-content:center;gap:12px;background:#fff;border:1px dashed #c4b5fd;border-radius:20px;text-align:center;padding:24px;color:#6d28d9;font-size:18px;font-weight:850}
#class3-math-runtime .m3-spinner{width:24px;height:24px;border:3px solid #ddd6fe;border-top-color:#8b5cf6;border-radius:50%;animation:m3spin .8s linear infinite}
#class3-math-runtime .m3-lab-number{display:flex;flex-direction:column;gap:6px;font-size:15px;font-weight:900;color:#6d28d9;min-width:105px}
#class3-math-runtime .m3-lab-number input{height:45px;border:1px solid #c4b5fd;border-radius:12px;background:#fff;padding:9px;font-size:20px;font-weight:850;color:#344054;width:100%}
#class3-math-runtime .m3-lab-fields{display:flex;flex-wrap:wrap;gap:12px;margin:18px 0}
#class3-math-runtime .m3-lab-actions{display:flex;align-items:center;justify-content:flex-end;gap:12px;flex-wrap:wrap;margin:13px 0}
#class3-math-runtime .m3-model{font-size:24px;letter-spacing:5px;margin:12px 0}
#class3-math-runtime .m3-fraction{display:flex;gap:7px;margin:16px 0}
#class3-math-runtime .m3-fraction button{font-size:30px;flex:1;min-height:70px;border:1px solid #c4b5fd;border-radius:9px;background:#fff}
#class3-math-runtime .m3-fraction button.selected{background:#f3e8ff;border-color:#8b5cf6}
#class3-math-runtime .m3-slider{display:flex;align-items:center;gap:16px;margin:20px 0}
#class3-math-runtime .m3-slider input{flex:1;accent-color:#8b5cf6}
#class3-math-runtime .m3-lab-clock{text-align:center;font-size:67px}
#class3-math-runtime .m3-calendar{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:5px;margin:20px 0;max-width:550px}
#class3-math-runtime .m3-calendar button,#class3-math-runtime .m3-calendar strong{display:flex;align-items:center;justify-content:center;min-height:39px;border:1px solid #ddd6fe;border-radius:9px;background:#fff;font-weight:900}
#class3-math-runtime .m3-calendar button.selected{background:#ede9fe;border-color:#8b5cf6}
#class3-math-runtime .m3-game-canvas{min-height:360px;max-width:76rem;margin:0 auto}
#class3-math-runtime .m3-history{display:grid;gap:8px}
#class3-math-runtime .m3-history article{border:1px solid #ddd6fe;background:#fff;border-radius:14px;padding:12px}
#class3-math-runtime .m3-clock{font-weight:950;color:#be185d}
@keyframes m3spin{to{transform:rotate(360deg)}}
@media(max-width:767px){#class3-math-runtime .m3-folder-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}#class3-math-runtime .m3-folder{padding:10px;min-height:132px;border-radius:16px}#class3-math-runtime .m3-folder-head{flex-direction:column;gap:7px}#class3-math-runtime .m3-folder-icon{width:52px;height:52px;flex:0 0 52px;font-size:31px}#class3-math-runtime .m3-folder-copy strong{font-size:17px}#class3-math-runtime .m3-folder-copy small{font-size:14px}#class3-math-runtime .m3-section-header{flex-direction:column}#class3-math-runtime .m3-options{grid-template-columns:1fr}#class3-math-runtime .m3-choice{font-size:17px;min-height:58px}#class3-math-runtime .m3-quiz-nav{grid-template-columns:minmax(0,1fr) 76px minmax(0,1fr);gap:5px}#class3-math-runtime .m3-nav,#class3-math-runtime .m3-count{font-size:14px;padding:7px 5px}}
@media(prefers-reduced-motion:reduce){#class3-math-runtime *,#class3-math-runtime *:before{animation:none!important;transition:none!important}#class3-math-runtime .m3-folder:hover .m3-folder-icon{transform:none!important}}
`;
})();
