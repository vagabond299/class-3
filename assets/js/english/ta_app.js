/* Epsilon Edu - Lop 3 - Tieng Anh 3.
 * Integration contract mirrors Class 3 tv_app.js: CLASS3_SUBJECT_MODULES.english
 * and render(context)/destroy(). The Class 3 shell owns identity, access, API,
 * navigation, score display; the Class 3 GAS verifies official attempts.
 * Source: the seven verified standalone TA3 Global Success JSON files.
 */
(() => {
  'use strict';
  if (window.CLASS3_SUBJECT_MODULES?.english) return;

  const SUBJECT = 'ta', ROOT_ID = 'class3-english-runtime';
  const DATA_ROOT = 'assets/data/english/';
  const FILES = Object.freeze({
    discover1:'kham_pha_tieng_anh_3_part1.json', discover2:'kham_pha_tieng_anh_3_part2.json',
    grammar:'kham_pha_tieng_anh_3_muc_10.json',
    m11:'kham_pha_tieng_anh_3_muc_11.json',
    m12:'kham_pha_tieng_anh_3_muc_12.json',
    lessons:'bai_hoc_tieng_anh_3.json',exercise1:'bai_tap_tieng_anh_3_hk1.json',
    exercise2:'bai_tap_tieng_anh_3_hk2.json',review:'on_tap_tieng_anh_3.json',
    exams:'de_thi_tieng_anh_3.json'
  });
  const TABS = Object.freeze({discover:'Khám phá',lessons:'Bài học',exercises:'Bài tập',review:'Ôn tập',exams:'Đề thi',games:'Mini games'});
  const DISCOVER_NAMES = Object.freeze({
    1:'Alphabet & IPA',2:'Vocabulary Explorer',3:'Word Builder',4:'Spelling Lab',5:'Odd One Out',
    6:'Reading Comprehension',7:'Sentence Builder',8:'Fill Sentence',9:'Q&A Dialogues',
    10:'Grammar Point',11:'Picture & Situation Challenge',12:'Super Vocabulary'
  });
  const DISCOVER_NAMES_VI = Object.freeze({
    1:'Bảng chữ cái và phiên âm',2:'Khám phá từ vựng',3:'Ghép từ',4:'Luyện chính tả',
    5:'Tìm từ khác loại',6:'Đọc hiểu',7:'Sắp xếp câu',
    8:'Điền câu',9:'Hỏi & đáp',10:'Ngữ pháp tích lũy',11:'Khám phá tranh và tình huống',12:'Siêu từ vựng'
  });
  const TOPIC_ICONS = ['🔤','🗣️','🧩','✏️','🎯','📖','🚂','🖼️','💬','🧠','📚','🌟'];
  const SKILLS = Object.freeze({
    ENG_PHO:'Phonics · Ngữ âm',ENG_VOC:'Vocabulary · Từ vựng',ENG_LIS:'Listening · Nghe hiểu',
    ENG_GRA:'Grammar · Ngữ pháp',ENG_SYN:'Sentence building · Cấu trúc câu',ENG_READ:'Reading · Đọc hiểu'
  });
  const MINI_GAMES_FILE = 'assets/js/english/ta_games.js?v=class3-ta-games-20261019-r2';
  const GAME_LIST = Object.freeze([
    ['Word Search','🔎','Tìm từ vựng trong bảng chữ cái',true],
    ['Bingo','🎱','Nghe và đánh dấu đúng từ',true],
    ['Word Scramble','🔡','Sắp xếp chữ thành từ',true],
    ['Fishing Game','🎣','Câu đúng từ theo chủ đề',true],
    ['Sentence Train','🚂','Ghép câu hoàn chỉnh từ các toa từ',true],
    ['Q&A Bridge','🌉','Ghép câu hỏi với câu trả lời',true],
    ['Sentence Doctor','🩺','Tìm và sửa lỗi trong câu',true],
    ['Grammar River','🐸','Vượt từng hòn đá ngữ pháp',true],
    ['Action Race','🏎️','Nhận biết hành động rồi chia động từ',true],
    ['Sentence Factory','🏭','Tạo câu a/an/some và there is/are',true],
    ['Feeling Detective','🕵️','Giải tình huống và viết câu cảm xúc',true],
    ['Teacher Says','👩‍🏫','Nghe lệnh, chọn động tác hoặc đứng yên',true]
  ]);
  const txt=v=>String(v==null?'':v), list=v=>Array.isArray(v)?v:[];
  const esc=v=>txt(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const shuffle=values=>{const a=list(values).slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
  const normalize=v=>txt(v).trim().replace(/\s+/g,' ').toLocaleLowerCase('en-US');
  const cache=new Map();
  let ctx=null,root=null,active=false,nonce=0,view={tab:'discover',page:'hub'};
  let selectedLessonSemester=1,selectedExerciseSemester=1,lessonPage=0,lessonAnswers={};
  let quiz=null,progress=null,examTicker=null,listenQueue=[],listenBusy=null;
  let speechNonce=0,speechRate=.85,audio=null,audioSettle=null,synthSettle=null,mediaTimers=new Set();
  let catalog=null,catalogPromise=null,clickHandler=null,inputHandler=null,changeHandler=null,imageErrorHandler=null;
  let exploreSection='',exploreTopic='',flashIndex=0,flashRevealed=false;
  let phonicsLearnItems=[],phonicsLearnSection='',phonicsLearnIndex=0;
  let phonicsFeedbackAudio=null;
  let m11State=null; // Class 3 only; quiz answers stay in RAM, only random deck IDs/cursor persist.
  const m11DeckCache=new Map();
  let m12State=null; // Per-session, in-memory M12 selection. No cross-grade account or persistence.
  let vocabContext='sgk'; // Existing SGK Vocabulary and the independent Super Vocabulary share the four learning modes.
  const VOCAB_LEVELS=Object.freeze([
    {level:1,name:'Starter',vi:'Khởi đầu',icon:'🌱',tone:'pink'},
    {level:2,name:'Growing',vi:'Tiến bộ',icon:'🌼',tone:'blue'},
    {level:3,name:'Smart',vi:'Tự tin',icon:'🌟',tone:'purple'},
    {level:4,name:'Super',vi:'Thử thách',icon:'🏆',tone:'green'}
  ]);
  let vocabPool=[],vocabIndex=0,vocabLevel=0,vocabMode='flashcard';
  // M3-M5 are derived exclusively from the SGK Vocabulary units of M2.
  let sharedActivity=null,sharedTimer=null,sharedSpeechVersion=0;
  // SGK Discover M6-M9 share the same four Unit ranges as M2-M5.
  const SGK_LEVELED_TOPICS=Object.freeze({
    6:{title:'Reading Comprehension',intro:'Read the passage and answer the two questions.'},
    7:{title:'Sentence Builder',intro:'Tap the words in the correct order to make a sentence.'},
    8:{title:'Fill Sentence',intro:'Choose the correct word to complete the sentence.'},
    9:{title:'Q&A Dialogues',intro:'Choose the best reply.'}
  });
  const sgkLeveledSection=id=>/^section_[6-9]\.[1-4]$/.test(txt(id));
  let vocabCorrect=Object.create(null),vocabTries=Object.create(null),vocabChoices=Object.create(null);
  let vocabRecognizer=null,vocabRecognitionEpoch=0,vocabMicActive=false;
  let vocabAudioContext=null;

  let gameState=null,gameScriptPromise=null,hostUser='';
  const $=selector=>root?.querySelector(selector)||null;
  const isLogged=()=>!!(ctx?.isAuthenticated&&ctx?.user?.userId);
  const premium=()=>isLogged()&&['vip','trial','admin'].includes(txt(ctx?.accessType).toLowerCase());
  const toast=msg=>ctx?.hooks?.showToast?.(txt(msg));
  const dialog=msg=>ctx?.hooks?.showDialog?.({title:'Tiếng Anh 3',message:txt(msg),icon:'📚'});
  // Keep the shared shell in charge of the breadcrumb and its navigation.
  const setDetail=detail=>{
    const hooks=ctx?.hooks;
    if(typeof hooks?.setDetail!=='function')return;
    if(detail&&typeof detail==='object'){
      if(hooks.supportsStructuredDetail===true)hooks.setDetail(detail);
      else hooks.setDetail(txt(detail.title));
    }else hooks.setDetail(txt(detail));
  };
  const clearDetail=()=>ctx?.hooks?.clearDetail?.();
  const api=(action,payload={})=>isLogged() ? ctx.apiRequest(action,{subjectId:SUBJECT,...payload}) : Promise.reject(new Error('NEED_LOGIN'));
  function needPremium(feature){if(premium())return true;ctx?.requestPremiumAccess?.(feature||'Tiếng Anh 3');return false;}
  const semValue=v=>Number(v)===2?'hk2':'hk1';
  function living(n){return active&&nonce===n&&!!root?.isConnected;}
  function setView(tab,page,extra={}){
    view={tab,page,...extra};
    if(page==='hub'){clearDetail();return;}
    if(tab!=='discover'){setDetail(extra.title||TABS[tab]||'Tiếng Anh 3');return;}

    const match=txt(extra.section).match(/^section_(\d+)\.(\d+)$/);
    const group=Number(extra.group||match?.[1]);
    if(!group||!Object.prototype.hasOwnProperty.call(DISCOVER_NAMES,group)){
      setDetail(extra.title||TABS[tab]);return;
    }
    const items=[
      {title:[3,6,7,8,9].includes(group)?'Explore':'Khám phá',action:()=>{void hub('discover');}},
      {title:`${group}. ${DISCOVER_NAMES[group]}`,action:page!=='group'?()=>{void discoverGroup(group);}:null}
    ];
    if(page!=='group'){
      if(match){
        const raw=txt(extra.title).trim();
        const name=raw.replace(/^\d+(?:\.\d+)?\.?\s*/, '').trim();
        // Level 1-4 already identifies the level; omit redundant 6.1/7.1/etc in breadcrumbs.
        const sgkLevelName=SGK_LEVELED_TOPICS[group]&&/^Level\s+[1-4]\b/i.test(name);
        items.push({title:sgkLevelName?name:`${match[1]}.${match[2]} ${name||'Luyện tập'}`,action:page==='result'?()=>{void discoverOpen(extra.section);}:null});
      }else if(extra.title){
        items.push({title:txt(extra.title)});
      }
      if(page==='result')items.push({title:'Kết quả'});
    }
    setDetail({title:items.map(item=>item.title).join(' › '),items});
  }

  async function load(key){
    if(!Object.prototype.hasOwnProperty.call(FILES,key))throw new Error('Nguồn học liệu không được hỗ trợ.');
    if(cache.has(key))return cache.get(key);
    const req=fetch(DATA_ROOT+FILES[key],{credentials:'omit',cache:'default'}).then(async r=>{
      if(!r.ok)throw new Error('Chưa tải được '+FILES[key]);
      const d=await r.json();if(!d||typeof d!=='object'||Array.isArray(d))throw new Error('Học liệu chưa đúng định dạng.');
      return d;
    }).catch(err=>{cache.delete(key);throw err;});
    cache.set(key,req);return req;
  }
  async function loadCatalog(){
    if(catalog)return catalog;
    if(!catalogPromise)catalogPromise=fetch('assets/data/shared_image_catalog.json',{credentials:'omit',cache:'default'})
      .then(r=>{if(!r.ok)throw new Error('CATALOG_UNAVAILABLE');return r.json();})
      .then(d=>{catalog=d&&typeof d.images==='object'?d:null;return catalog;})
      .catch(()=>{catalogPromise=null;return null;});
    return catalogPromise;
  }
  function safeImageEntry(id,url){
    const images=catalog?.images||{};let entry=null;
    if(id&&Object.prototype.hasOwnProperty.call(images,txt(id)))entry=images[txt(id)];
    if(!entry&&url){entry=Object.values(images).find(v=>v?.src===url)||null;}
    if(!entry||typeof entry.src!=='string'||!entry.src.startsWith('assets/images/')||entry.src.includes('..')||/[\x00-\x1F]/.test(entry.src))return null;
    if(url&&entry.src!==url)return null;
    return entry;
  }
  function getVisual(q){
    const ref=q?.visual_ref||q?.visual||{};
    const imageId=txt(q?.image_id||q?.imageId||ref?.image_id||ref?.imageId||'');
    const imageUrl=txt(q?.image_url||ref?.image_url||'');
    return safeImageEntry(imageId,imageUrl);
  }
  function illustration(q,alt='Picture',showCaption=false){
    const entry=getVisual(q);if(!entry)return '';
    // Hide vocabulary answer captions in practice/exams; text-bearing catalog
    // images are allowed because the owner explicitly approved those assets.
    return `<figure class="ta3-picture"><img loading="lazy" decoding="async" src="${esc(entry.src)}" alt="${esc(alt)}">${showCaption?`<figcaption>${esc(entry.name_vi||alt)}</figcaption>`:''}</figure>`;
  }
  function emojiOf(q){
    // SGK Vocabulary has vetted, Unit-specific icons in the learning JSON.
    // Do not override them by a global word map: "old" has different meanings in Units 2 and 14.
    if(q?.vocab_id){
      const s=txt(q?.visual?.fallback_emoji||'');
      return s&&!s.includes('assets/')&&s.length<18?s:'';
    }
    const s=txt(q?.emoji||q?.image||q?.visual?.fallback_emoji||'');
    return s&&!s.includes('assets/')&&s.length<18?s:'';
  }

  function stopVocabRecognition(){
    ++vocabRecognitionEpoch;
    const r=vocabRecognizer;vocabRecognizer=null;vocabMicActive=false;
    if(r){r.onresult=null;r.onerror=null;r.onend=null;r.onnomatch=null;try{r.abort();}catch(_){}}
  }
  function vocabBeep(success){
    try{
      const Context=window.AudioContext||window.webkitAudioContext;
      if(!Context)return;
      if(!vocabAudioContext)vocabAudioContext=new Context();
      if(vocabAudioContext.state==='suspended')void vocabAudioContext.resume();
      const start=vocabAudioContext.currentTime+.01;
      const count=success?1:2;
      for(let i=0;i<count;i++){
        const osc=vocabAudioContext.createOscillator(),gain=vocabAudioContext.createGain();
        const at=start+i*.17;osc.type='sine';osc.frequency.value=success?880:440;
        gain.gain.setValueAtTime(.0001,at);gain.gain.exponentialRampToValueAtTime(.10,at+.016);
        gain.gain.exponentialRampToValueAtTime(.0001,at+.115);
        osc.connect(gain);gain.connect(vocabAudioContext.destination);osc.start(at);osc.stop(at+.13);
      }
    }catch(_){}
  }
  function vocabSpeakRecognition(){
    if(view.page!=='vocab-study'||vocabMode!=='speak')return;
    if(vocabMicActive){stopVocabRecognition();renderVocabStudy();return;}
    const Ctor=window.SpeechRecognition||window.webkitSpeechRecognition;
    if(!Ctor){toast('Trình duyệt chưa hỗ trợ nhận diện giọng nói. Bé có thể dùng Chrome để luyện Speak & Check.');return;}
    const q=vocabPool[vocabIndex];if(!q)return;
    stopVocabRecognition();stopSpeech();const epoch=++vocabRecognitionEpoch;
    try{
      const rec=new Ctor();vocabRecognizer=rec;rec.lang='en-US';rec.interimResults=false;rec.maxAlternatives=3;
      rec.continuous=false;vocabMicActive=true;
      const target=normalize(q.word);
      const feedback=(message,good=false)=>{const box=$('#ta3-vocab-speech-status');if(box){box.textContent=message;box.dataset.status=good?'good':'retry';}};
      rec.onresult=e=>{
        if(epoch!==vocabRecognitionEpoch||view.page!=='vocab-study'||vocabMode!=='speak'||vocabPool[vocabIndex]!==q)return;
        const alternatives=[];
        for(let i=0;i<(e.results?.[0]?.length||0);i++) alternatives.push(normalize(e.results[0][i].transcript).replace(/[.!?]+$/,''));
        if(!alternatives.length){feedback('Cô chưa nghe rõ. Con thử lại nhé!');return;}
        const passed=alternatives.some(t=>t===target);
        vocabBeep(passed);
        if(passed){vocabCorrect[q.vocab_id]={...(vocabCorrect[q.vocab_id]||{}),speak:true};feedback('✅ Tuyệt vời! Con phát âm đúng rồi!',true);}
        else {feedback('🌷 Con thử phát âm lại nhé! Cô sẽ đọc mẫu.');void speak(q.word,'en-US');}
      };
      rec.onerror=()=>{if(epoch===vocabRecognitionEpoch)feedback('Chưa nhận được giọng nói. Con kiểm tra micro và thử lại nhé!');};
      rec.onnomatch=()=>{if(epoch===vocabRecognitionEpoch)feedback('Cô chưa nghe rõ. Con thử lại nhé!');};
      rec.onend=()=>{if(epoch!==vocabRecognitionEpoch)return;vocabMicActive=false;
        const mic=$('#ta3-vocab-microphone');if(mic)mic.classList.remove('listening');};
      rec.start();
      const mic=$('#ta3-vocab-microphone');if(mic)mic.classList.add('listening');
      const box=$('#ta3-vocab-speech-status');if(box){box.dataset.status='listening';box.textContent='🎤 Cô đang lắng nghe con nói...';}
    }catch(_){stopVocabRecognition();toast('Micro chưa sẵn sàng. Bé thử lại sau nhé!');}
  }
  function stopSpeech(){
    speechNonce++;
    const a=audioSettle,s=synthSettle;audioSettle=null;synthSettle=null;
    if(a)a(false);if(s)s(false);
    if(audio){try{audio.pause();audio.removeAttribute('src');audio.load();}catch(_){}audio=null;}
    for(const t of mediaTimers)clearTimeout(t);mediaTimers.clear();
    try{window.speechSynthesis?.cancel?.();}catch(_){}
  }
  function chunks(v){return txt(v).replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim().match(/.{1,150}(?:[.!?;,:](?=\s|$)|(?=\s)|$)/g)||[];}
  const getRate=()=>Math.min(1.3,Math.max(.65,Number($('#ta3-speech-rate')?.value||speechRate)));
  async function speak(text,lang='en-US'){
    stopSpeech();const version=speechNonce,parts=chunks(text).slice(0,30),rate=getRate();
    for(const p of parts){
      if(!active||version!==speechNonce)break;
      let ok=false;
      try{ok=await new Promise(resolve=>{
        const element=new Audio();audio=element;element.preload='none';element.referrerPolicy='no-referrer';
        let done=false;const finish=(success)=>{
          if(done)return;done=true;if(audioSettle===finish)audioSettle=null;if(audio===element)audio=null;
          try{element.pause();element.removeAttribute('src');element.load();}catch(_){}resolve(success);
        };
        audioSettle=finish;element.src='https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl='+encodeURIComponent(lang)+'&q='+encodeURIComponent(p);
        element.playbackRate=rate;element.onended=()=>finish(true);element.onerror=()=>finish(false);
        Promise.resolve(element.play()).catch(()=>finish(false));
      });}catch(_){ok=false;}
      if(!active||version!==speechNonce)break;
      if(!ok&&window.speechSynthesis)await new Promise(resolve=>{
        let done=false;const finish=()=>{if(done)return;done=true;if(synthSettle===finish)synthSettle=null;resolve();};
        synthSettle=finish;
        try{const u=new SpeechSynthesisUtterance(p);u.lang=lang;u.rate=rate;
          const femaleUS=list(window.speechSynthesis.getVoices?.()).find(v=>v.lang?.toLowerCase()==='en-us'&&/female|jenny|aria|samantha|google us english/i.test(v.name));
          if(lang==='en-US'&&femaleUS)u.voice=femaleUS;
          u.onend=finish;u.onerror=finish;window.speechSynthesis.speak(u);
        }catch(_){finish();}
      });
    }
  }
  function stopClock(){if(examTicker){clearInterval(examTicker);examTicker=null;}}
  function stopGame(){if(gameState){try{gameState.destroy();}catch(_){}}gameState=null;}
  function clearCurrent(){stopVocabRecognition();stopSpeech();stopClock();stopGame();quiz=null;ctx?.hooks?.setScore?.(0,0);}
  function loading(){if(root)root.innerHTML='<section class="ta3-loading"><i class="ta3-spinner"></i>Đang tải Tiếng Anh 3…</section>';}
  function errorView(err){if(root)root.innerHTML=`<section class="ta3-empty"><strong>Chưa mở được nội dung.</strong><p>${esc(err?.message||'Vui lòng thử lại.')}</p><button class="ta3-mini" data-action="hub">Quay lại</button></section>`;}
  const heading=(title,desc='',back=true)=>`<div class="ta3-heading"><div><h2>${esc(title)}</h2>${desc?`<p>${esc(desc)}</p>`:''}</div>${back?`<button class="ta3-back" data-action="back">← ${[6,7,8,9].includes(Number(view.group))?'Back':'Quay lại'}</button>`:''}</div>`;
  function folder(title,desc,icon,action,attrs='',foot='Mở nội dung',i=0,locked=false){
    return `<button class="ta3-folder${locked?' ta3-locked':''}" data-tone="${i%6}" data-action="${esc(action)}" ${attrs} ${locked?'aria-disabled="true"':''}>
      <span class="ta3-folder-head"><span class="ta3-icon">${esc(icon)}</span><span class="ta3-folder-copy"><strong>${esc(title)}</strong><small>${esc(desc)}</small></span></span>
      <span class="ta3-folder-foot"><span>${esc(foot)}</span><b>${locked?'🔒':'➜'}</b></span></button>`;
  }
  const grid=cards=>`<div class="ta3-folder-grid">${cards.join('')}</div>`;
  const semesterTabs=(selected,action)=>`<div class="ta3-switch"><button data-action="${esc(action)}" data-sem="1" class="${selected===1?'on':''}">Học kỳ 1</button><button data-action="${esc(action)}" data-sem="2" class="${selected===2?'on':''}">Học kỳ 2</button></div>`;
  function navbar(index,length,mode='question'){
    const lesson=mode==='lesson';return `<div class="ta3-nav"><button data-action="${mode}-prev" ${index===0?'disabled':''}>← ${lesson?'Previous page':'Previous'}</button><span>${index+1}/${length}</span><button class="primary" data-action="${mode}-next" ${index>=length-1?'disabled':''}>${lesson?'Next page':'Next'} →</button></div>`;
  }
  const ttsBar=()=>`<div class="ta3-tts-tools"><span>🇺🇸 English · en-US</span><label>Speed <input id="ta3-speech-rate" aria-label="Tốc độ đọc tiếng Anh" type="range" min=".65" max="1.3" step=".05" value="${speechRate}"></label><button class="ta3-mini" data-action="stop-audio">🔇 Stop</button></div>`;

  async function getSections(){
    const [one,two]=await Promise.all([load('discover1'),load('discover2')]);
    return {one,two,sections:[...Object.entries(one.sections||{}).map(([id,data])=>({id,data,source:one})),...Object.entries(two.sections||{}).map(([id,data])=>({id,data,source:two}))]};
  }
  async function hub(tab='discover'){
    const request=++nonce;sharedCancelSpeech();sharedActivity=null;clearCurrent();setView(tab,'hub');loading();
    try{
      if(tab==='discover'){
        const d=await getSections();if(!living(request))return;
        // M1-M12. M11/M12 use independent JSON sources loaded only after opening each topic.
        const groups=[];for(let i=1;i<=12;i++){
          const subs=[10,11,12].includes(i)?[{id:'section_'+i,data:[]}]:d.sections.filter(s=>s.id.startsWith('section_'+i+'.'));
          const count=i===10?0:[3,4,5].includes(i)?getSgkVocabGroups(d.one).reduce((n,g)=>n+g.words.length,0):subs.reduce((n,s)=>n+(Array.isArray(s.data)?s.data.length: s.source.vocabulary_activity_banks?.[s.id]?.length||0),0);
          groups.push({i,subs,count});
        }
        root.innerHTML=heading('Khám phá Tiếng Anh 3','12 chuyên đề đang có học liệu',false)+
          grid(groups.map(g=>folder(`${g.i}. ${DISCOVER_NAMES[g.i]}`,DISCOVER_NAMES_VI[g.i],TOPIC_ICONS[g.i-1],g.subs.length?'discover-group':'pending','data-group="'+g.i+'"',g.subs.length?(g.i===12?'12 chủ đề · 4 chế độ học · chọn 1–3 nhóm':g.i===11?'2 hoạt động · 3 mức độ · 90 tranh + 90 bài đọc':g.i===10?'11 Grammar topics · cumulative review':[2,3,4,5].includes(g.i)?`4 Levels · ${getSgkVocabGroups(d.one).reduce((n,g)=>n+g.words.length,0)} SGK words`:[6,7,8,9].includes(g.i)?`4 Levels · Units 1–20 · ${g.count} questions`:`${g.subs.length} mục nhánh · ${g.count} hoạt động`):'Chưa có học liệu',g.i-1,!g.subs.length)));
      }else if(tab==='lessons')await lessonHub(request);
      else if(tab==='exercises')await exerciseHub(request);
      else if(tab==='review')await reviewHub(request);
      else if(tab==='exams')await examHub(request);
      else if(tab==='games')await gameHub(request);
    }catch(err){if(living(request))errorView(err);}
  }
  function renderTA2AlphabetMenu(items){
    const specs=[
      ['1.1','\uD83D\uDD20','Alphabet (A-Z)','B\u1EA3ng ch\u1EEF c\u00E1i ti\u1EBFng Anh','26 ch\u1EEF','pink'],
      ['1.2','\uD83D\uDDE3\uFE0F','IPA Sounds','B\u1EA3ng ng\u1EEF \u00E2m IPA','44 \u00E2m','sky'],
      ['1.3','\uD83C\uDFA7','Alphabet Practice','Nghe ch\u1EEF \u00B7 Ch\u1ECDn c\u00E1ch \u0111\u1ECDc \u00B7 \u0110i\u1EC1n ch\u1EEF','78 c\u00E2u','violet'],
      ['1.4','\uD83D\uDD0A','IPA Practice','Luy\u1EC7n k\u00FD hi\u1EC7u \u00E2m \u00B7 T\u1EF1 ch\u1ECDn','44 c\u00E2u','green']
    ];
    const found=new Map(items.map(item=>[item.id.replace('section_',''),item]));
    const cards=specs.filter(s=>found.has(s[0])).map((s,i)=>{
      const count=list(found.get(s[0]).data).length;
      return `<button type="button" class="ta3-ta2-menu-card" data-ta2-tone="${s[5]}" data-action="discover-open" data-section="section_${s[0]}">
        <span class="ta3-ta2-menu-inside"><span class="ta3-ta2-menu-icon" aria-hidden="true">${s[1]}</span>
          <span class="ta3-ta2-menu-copy"><span><b>${i+1}.</b> <strong>${esc(s[2])}</strong></span><small>${s[3]}</small></span></span>
        <span class="ta3-ta2-menu-count">${count} ${s[0]==='1.1'?'ch\u1EEF':s[0]==='1.2'?'\u00E2m':'c\u00E2u'}</span></button>`;
    });
    return `<div class="ta3-ta2-menu-screen">
      <div class="ta3-ta2-menu-lead">B\u00E9 c\u00F3 th\u1EC3 h\u1ECDc b\u1EA3ng ch\u1EEF c\u00E1i tr\u01B0\u1EDBc, r\u1ED3i luy\u1EC7n nghe, ch\u1ECDn c\u00E1ch \u0111\u1ECDc v\u00E0 \u0111i\u1EC1n ch\u1EEF c\u00F2n thi\u1EBFu \u1EDF m\u1EE5c 1.3 nh\u00E9! Ph\u1EA7n IPA \u1EDF m\u1EE5c 1.2 v\u00E0 1.4 d\u00E0nh cho b\u00E9 mu\u1ED1n t\u00ECm hi\u1EC3u th\u00EAm, kh\u00F4ng b\u1EAFt bu\u1ED9c.</div>
      <button class="ta3-ta2-menu-listen" data-action="ta2-alpha-intro-listen">\uD83D\uDD0A Nghe c\u00F4 \u0111\u1ECDc</button>
      <div class="ta3-ta2-menu-grid">${cards.join('')}</div>
      <button class="ta3-ta2-return" data-action="back">\u2190 Kh\u00E1m ph\u00E1</button>
    </div>`;
  }
  async function discoverGroup(number){
    const request=++nonce;sharedCancelSpeech();stopSpeech();loading();
    try{
      if(Number(number)===10){await showGrammarGroup(request);return;}
      if(Number(number)===11){await openM11Hub(request);return;}
      if(Number(number)===12){await openM12Hub(request);return;}
      const d=await getSections();if(!living(request))return;
      const items=d.sections.filter(s=>s.id.startsWith('section_'+number+'.'));
      if(!items.length)throw new Error('Chuy\u00EAn \u0111\u1EC1 n\u00E0y ch\u01B0a c\u00F3 h\u1ECDc li\u1EC7u.');
      setView('discover','group',{group:Number(number),title:`${number}. ${DISCOVER_NAMES[number]||'Explore'}`});
      if(Number(number)===1){root.innerHTML=renderTA2AlphabetMenu(items);return;}
      if(Number(number)===2){await showVocabHub(d.one,request);return;}
      if([3,4,5].includes(Number(number))){renderSharedLevelHub(Number(number),d.one);return;}
      if(SGK_LEVELED_TOPICS[Number(number)]){renderSgkLevelHub(Number(number),d.one,d.two);return;}
      root.innerHTML=heading(`Chuy\u00EAn \u0111\u1EC1 ${number}`,`${items.length} m\u1EE5c h\u1ECDc \u00B7 ch\u1EA1m \u0111\u1EC3 m\u1EDF`)+
        grid(items.map((s,i)=>{
          const code=s.id.replace('section_','');const label=s.source.section_names?.[s.id]||code;
          const length=Array.isArray(s.data)?s.data.length:list(s.source.vocabulary_activity_banks?.[s.id]).length;
          // Level cards are already numbered by their titles; other subtopics retain their section numbers.
          const sgkLevelName=sgkLeveledSection(s.id)&&/^Level\s+[1-4]\b/i.test(label);
          return folder(sgkLevelName?label:`${code}. ${label}`,`${length} th\u1EBB/c\u00E2u \u00B7 luy\u1EC7n theo m\u1EE9c \u0111\u1ED9`,TOPIC_ICONS[(Number(number)+i)%TOPIC_ICONS.length],'discover-open',`data-section="${esc(s.id)}"`,`${length} c\u00E2u`,i);
        }));
    }catch(err){if(living(request))errorView(err);}
  }

  async function discoverOpen(id){
    const request=++nonce;stopSpeech();loading();
    try{
      if(/^section_10\.(?:[1-9]|1[01])$/.test(id)){await openGrammarTopic(id,request);return;}
      const d=await getSections();if(!living(request))return;
      const found=d.sections.find(s=>s.id===id);if(!found)throw new Error('Không tìm thấy nội dung.');
      if(/^section_[345]\./.test(id)){await discoverGroup(Number(id.split('_')[1].split('.')[0]));return;}
      if(sgkLeveledSection(id)){
        const parts=id.replace('section_','').split('.'),topic=Number(parts[0]),level=Number(parts[1]);
        if(!SGK_LEVELED_TOPICS[topic]||level<1||level>4)throw new Error('Unsupported SGK Level.');
      }
      exploreSection=id;const items=Array.isArray(found.data)?found.data:list(found.source.vocabulary_activity_banks?.[id]);
      const name=found.source.section_names?.[id]||id;
      if(/^section_2\.[123]$/.test(id)){await discoverGroup(2);return;}
      if(id==='section_1.1'||id==='section_1.2'){
        phonicsLearnSection=id;phonicsLearnItems=list(items);phonicsLearnIndex=0;
        setView('discover','phonics-learn',{title:name,section:id,group:1});renderPhonicsLearning();
      }else if(id==='section_2.1'){
        flashIndex=0;flashRevealed=false;setView('discover','flash',{title:name,section:id,group:2});
        await showFlash(items,request);
      }else{
        const questions=items.map(normalizeExplore).filter(q=>q.id);
        if(id==='section_1.4'){for(const ipa of list(d.one.sections?.['section_1.2']))if(ipa.ipa&&ipa.soundWord)ipaPracticeSounds.set(ipa.ipa,ipa.soundWord);}
        if(id==='section_1.3'){for(const letter of list(d.one.sections?.['section_1.1']))if(letter.letter&&letter.ipaName)letterIpaReference.set(letter.letter,letter.ipaName);}
        startPractice(questions,'discover',name,{section:id,group:Number(id.match(/_(\d+)\./)?.[1])||1});
      }
    }catch(err){if(living(request))errorView(err);}
  }

  // Grammar Point: Class-2 category names and menu presentation, original Class-3 content.
  // No Level: topic IDs 10.1..10.11 remain stable so later classes can inherit them.
  // Separate JSON is loaded ONLY on entering Grammar Point (not in the Explore hub).
  async function showGrammarGroup(request){
    const data=await load('grammar');if(!living(request))return;
    const ids=Object.keys(data.sections||{}).filter(id=>/^section_10\.(?:[1-9]|1[01])$/.test(id))
      .sort((a,b)=>Number(a.split('.')[1])-Number(b.split('.')[1]));
    if(ids.length!==11)throw new Error('Grammar bank is incomplete. Please update the Mục 10 JSON.');
    setView('discover','group',{group:10,title:'10. Grammar Point'});
    const cards=ids.map((id,i)=>{
      const details=data.topic_details?.[id]||{},title=txt(details.title_en||data.section_names?.[id]||id),
        vi=txt(details.title_vi||data.section_names_vi?.[id]),icon=txt(details.icon||'📖'),
        tone=['pink','violet','blue','amber','teal'].includes(details.tone)?details.tone:'pink',displayNo=i+1;
      return `<button type="button" class="ta3-grammar-topic" data-tone="${tone}" data-action="discover-open" data-section="${esc(id)}">
        <span class="ta3-grammar-icon" aria-hidden="true">${esc(icon)}</span>
        <span class="ta3-grammar-copy"><strong><b>${displayNo}.</b> ${esc(title)}</strong><small>${esc(vi)}</small></span></button>`;
    });
    // The Class 3 shell already shows Explore > Grammar Point in the breadcrumb.
    // Display only the grammar cards; the breadcrumb handles navigation.
    root.innerHTML=`<section class="ta3-grammar-hub">
      <div class="ta3-grammar-grid">${cards.join('')}</div>
    </section>`;
  }
  async function openGrammarTopic(id,request){
    const data=await load('grammar');if(!living(request))return;
    const items=list(data.sections?.[id]),meta=data.topic_details?.[id];
    if(items.length!==50||!meta||!list(meta.learning_rules).length)throw new Error('Grammar topic has missing content. Please update the Mục 10 JSON.');
    const name=txt(data.section_names?.[id]||meta.title_en||id);
    const questions=items.map(normalizeExplore).filter(q=>q.id&&q.options.length===4);
    if(questions.length!==items.length)throw new Error('Grammar topic contains incomplete questions.');
    startPractice(questions,'discover',name,{section:id,group:10,grammar:true,grammarDetails:meta});
  }
  // Randomized Grammar Point sessions: a new question/choice order on every topic launch.
  // Keep the ordered JSON intact for editing and reusing across later grades.
  function shuffleGrammarQuestions(items){
    const buckets=new Map();
    for(const q of shuffle(items)){
      const key=normalize(q.answer);
      if(!buckets.has(key))buckets.set(key,[]);
      buckets.get(key).push({...q,options:shuffle(q.options)});
    }
    const keys=[...buckets.keys()];
    // Spread grammar targets at random while avoiding obvious runs of four equal answers.
    for(let attempt=0;attempt<25;attempt++){
      const pools=new Map(keys.map(key=>[key,shuffle(buckets.get(key))]));
      const ordered=[];
      while(ordered.length<items.length){
        const count=ordered.length;
        const repeated=count>=3&&normalize(ordered[count-1].answer)===normalize(ordered[count-2].answer)
          &&normalize(ordered[count-2].answer)===normalize(ordered[count-3].answer)
          ?normalize(ordered[count-1].answer):null;
        const choices=keys.filter(key=>pools.get(key).length>0&&key!==repeated);
        if(!choices.length)break;
        const weights=choices.map(key=>pools.get(key).length**2);
        let spin=Math.random()*weights.reduce((sum,n)=>sum+n,0),chosen=choices[choices.length-1];
        for(let i=0;i<choices.length;i++){
          spin-=weights[i];if(spin<0){chosen=choices[i];break;}
        }
        ordered.push(pools.get(chosen).pop());
      }
      if(ordered.length===items.length)return ordered;
    }
    // A future, heavily unbalanced bank might not permit the no-streak constraint.
    return shuffle(items).map(q=>({...q,options:shuffle(q.options)}));
  }
  function grammarSentenceHtml(q,solved){
    const source=txt(q.prompt),answer=txt(q.answer);
    const spans=source.split('____');
    if(spans.length!==2)return esc(source);
    return esc(spans[0])+(solved?`<em class="ta3-grammar-answer">${esc(answer)}</em>`:'<em class="ta3-grammar-blank">____</em>')+esc(spans[1]);
  }
  function renderGrammarPractice(){
    if(!quiz?.grammarMode||!root)return;
    const q=quiz.questions[quiz.index],meta=quiz.grammarDetails||{},solved=quiz.grammarSolved.has(q.id),
      wrong=quiz.grammarWrong[q.id]||new Set(),last=quiz.index===quiz.questions.length-1,
      name=txt(meta.title_en||quiz.title),vi=txt(meta.title_vi);
    const rules=list(meta.learning_rules).map(r=>`<article><strong>${esc(r.title_en)}</strong>
      <p>${esc(r.rule_vi)}</p><small>Example: ${esc(r.example_en)}</small></article>`).join('');
    const choices=list(q.options).map((option,i)=>{
      const error=wrong.has(i),right=solved&&isCorrect(q,option);
      return `<button type="button" data-action="grammar-choose" data-index="${i}" class="ta3-grammar-choice${right?' is-correct':error?' is-wrong':''}" ${solved||error?'disabled':''}>
        <b>${String.fromCharCode(65+i)}.</b><span>${esc(option)}</span></button>`;
    }).join('');
    const ruleVisible=quiz.grammarShowRule;
    root.innerHTML=`<section class="ta3-grammar-practice">
      <header class="ta3-grammar-practice-head"><div class="ta3-grammar-unit">Unit ${q.unit} · ${esc(q.unitTitle)}</div>
        <h2>${esc(name)}</h2><p>${esc(vi)}</p>
        <div class="ta3-grammar-instructions">Choose the correct answer.
          <button type="button" data-action="grammar-instruction">🔊 Listen</button>
          <button type="button" data-action="grammar-rule">📖 ${ruleVisible?'Hide rule':'Review the rule'}</button>
        </div></header>
      ${ruleVisible?`<section class="ta3-grammar-rule" aria-label="Grammar explanation">${rules}</section>`:''}
      <div class="ta3-grammar-question"><h3>${grammarSentenceHtml(q,solved)}</h3></div>
      <div class="ta3-grammar-options">${choices}</div>
      ${!solved&&wrong.size?`<p class="ta3-grammar-try">Try again! ${esc(q.hint||'Look at the sentence carefully.')}</p>`:''}
      ${solved?`<section class="ta3-grammar-success"><strong>🌟 Excellent! You completed the sentence.</strong>
        <p>${grammarSentenceHtml(q,true)}</p>
        ${q.completedSentenceVi?`<p class="ta3-grammar-translation" lang="vi">${esc(q.completedSentenceVi)}</p>`:''}
        <div class="ta3-grammar-explanation">${esc(q.explanation||'Well done!')}</div>
        <button type="button" data-action="grammar-listen">🔊 Listen</button></section>`:''}
      <nav class="ta3-grammar-nav"><button type="button" data-action="grammar-prev" ${quiz.index===0?'disabled':''}>← Previous</button>
        <span>${quiz.index+1} / ${quiz.questions.length}</span>
        <button type="button" class="is-primary" data-action="grammar-next">${last?'Finish':'Next →'}</button></nav>
    </section>`;
    if(quiz.grammarLastIndex!==quiz.index){
      quiz.grammarLastIndex=quiz.index;
      // Read the instruction, not the sentence with a blank or the correct choice.
      scheduleTA2Sound('Choose the correct answer.',280);
    }
  }
  function grammarPick(index){
    if(!quiz?.grammarMode||!Number.isInteger(index))return;
    const q=quiz.questions[quiz.index];if(!q||index<0||index>=q.options.length||quiz.grammarSolved.has(q.id))return;
    const wrong=quiz.grammarWrong[q.id]||(quiz.grammarWrong[q.id]=new Set());
    if(wrong.has(index))return; // Same mistaken answer is never counted twice.
    const correct=isCorrect(q,q.options[index]);
    if(correct){quiz.grammarSolved.add(q.id);quiz.answers[q.id]=q.options[index];}
    else wrong.add(index);
    if(!quiz.grammarRecorded.has(q.id)){
      quiz.grammarRecorded.add(q.id);queueObservation(q,correct,'practice');
    }
    ctx?.hooks?.setScore?.(quiz.grammarSolved.size,
      Object.values(quiz.grammarWrong).reduce((total,answers)=>total+answers.size,0));
    playTA2Feedback(correct);
    renderGrammarPractice();
    if(correct)scheduleTA2Sound(q.audio||q.prompt.replace('____',q.answer),230);
  }
  function grammarNavigate(delta){
    if(!quiz?.grammarMode)return;
    if(delta>0&&quiz.index===quiz.questions.length-1){endPractice();return;}
    stopSpeech();quiz.index=Math.max(0,Math.min(quiz.questions.length-1,quiz.index+delta));
    renderGrammarPractice();
  }

  // Port of the TA2 1.1 and 1.2 learning presentation; Class 3 owns the lifecycle.
  function alphabetSpeak(letter){
    const value=txt(letter).toUpperCase();
    if(!/^[A-Z]$/.test(value))return;
    void speak(value==='Z'?'The letter Z. Zee.':`The letter ${value}.`,'en-US');
  }
  function ipaSpeak(item){const sample=txt(item?.soundWord);if(sample)void speak(sample,'en-US');}
  function audioGuideVietnamese(item){const guide=txt(item?.guide);if(guide)void speak(guide,'vi-VN');}
  function renderPhonicsLearning(){
    if(!root||!phonicsLearnItems.length)return;
    const items=phonicsLearnItems,index=Math.min(Math.max(phonicsLearnIndex,0),items.length-1),item=items[index];
    const alphabet=phonicsLearnSection==='section_1.1';
    const back='<button class="ta3-ta2-return" data-action="back">\u2190 1. Alphabet & IPA</button>';
    if(alphabet){
      const words=[item.word1,item.word2,item.word3].filter(Boolean);
      const wordCards=words.map((w,i)=>`<button class="ta3-ta2-word-card" data-action="ta2-alphabet-word" data-index="${i}" type="button">
        <span class="ta3-ta2-word-emoji">${esc(w.emoji)}</span>
        <span class="ta3-ta2-word-name"><strong>${esc(w.en)}</strong><small>${esc(w.pos)}</small></span>
        <span class="ta3-ta2-word-ipa">${esc(w.ipa)}</span><span class="ta3-ta2-word-vi">${esc(w.vi)}</span>
        <span class="ta3-ta2-word-ex">"${esc(w.ex)}"</span><span class="ta3-ta2-word-listen">\uD83D\uDD0A Listen</span>
      </button>`).join('');
      const keyboard=items.map((x,i)=>`<button type="button" class="ta3-ta2-alphabet-key${i===index?' is-active':''}" data-action="phonics-learn-pick" data-index="${i}" aria-pressed="${i===index}">
        <span>${esc(x.letter)}</span><small>${esc(x.ipaName)}</small></button>`).join('');
      root.innerHTML=`<div class="ta3-ta2-alphabet-screen">
        <div class="ta3-ta2-alphabet-heading"><h2>\uD83D\uDD24 ENGLISH ALPHABET & PHONICS (A-Z)</h2>
          <p>B\u1EA5m v\u00E0o ch\u1EEF c\u00E1i ho\u1EB7c t\u1EEB m\u1EABu \u0111\u1EC3 nghe ph\u00E1t \u00E2m:</p>
          <button class="ta3-ta2-alphabet-listen" data-action="phonics-learn-letter">\uD83D\uDD0A Listen to Letter ${esc(item.letter)}</button></div>
        <section class="ta3-ta2-alphabet-word-grid"><div class="ta3-ta2-alphabet-four">
          <button class="ta3-ta2-alphabet-letter-card" data-action="phonics-learn-letter" type="button">
            <span class="ta3-ta2-big-combo">${esc(item.name)}</span><span class="ta3-ta2-letter-read">C\u00E1ch \u0111\u1ECDc: <b>${esc(item.ipaName)}</b></span>
            <small>\uD83D\uDC46 Tap to Listen</small></button>${wordCards}
        </div></section>
        <div class="ta3-ta2-alphabet-keyboard" role="group" aria-label="26 alphabet letters">${keyboard}</div>
        <nav class="ta3-ta2-alphabet-actions" aria-label="Letter navigation">
          <button data-action="phonics-learn-prev" ${index===0?'disabled':''}>\u2190 Previous</button>
          <button class="ta3-ta2-alphabet-quiz" data-action="ta2-alphabet-quiz">\uD83C\uDFAF Phonics Quiz</button>
          <button class="ta3-ta2-alphabet-next" data-action="phonics-learn-next" ${index===items.length-1?'disabled':''}>Next \u2192</button>
        </nav>${back}</div>`;
    }else{
      const words=list(item.words);
      const soundButtons=items.map((x,i)=>`<button type="button" class="ta3-ta2-ipa-key${i===index?' is-active':''}" data-kind="${esc(x.type)}" data-action="phonics-learn-pick" data-index="${i}" aria-pressed="${i===index}">
        <strong>${esc(x.ipa)}</strong><small>${esc(txt(x.name).split(' ')[0])}</small></button>`).join('');
      const examples=words.map((w,i)=>`<button class="ta3-ta2-word-card" data-action="ta2-ipa-word" data-index="${i}" type="button">
        <span class="ta3-ta2-word-emoji">${esc(w.emoji)}</span>
        <span class="ta3-ta2-word-name"><strong>${esc(w.word)}</strong><small>${esc(w.pos)}</small></span>
        <span class="ta3-ta2-word-ipa">${esc(w.ipa)}</span><span class="ta3-ta2-word-vi">${esc(w.vi)}</span>
        <span class="ta3-ta2-word-ex">"${esc(w.ex)}"</span><span class="ta3-ta2-word-listen">\uD83D\uDD0A Listen Word</span>
      </button>`).join('');
      const typeLabel={vowel_mono:'Nguy\u00EAn \u00E2m \u0111\u01A1n (Monophthong)',vowel_di:'Nguy\u00EAn \u00E2m \u0111\u00F4i (Diphthong)',consonant_unvoiced:'Ph\u1EE5 \u00E2m v\u00F4 thanh (Voiceless)',consonant_voiced:'Ph\u1EE5 \u00E2m h\u1EEFu thanh (Voiced)'}[item.type]||'IPA';
      root.innerHTML=`<div class="ta3-ta2-ipa-screen">
        <div class="ta3-ta2-ipa-heading"><span class="ta3-ta2-ipa-count">\u00C2m ${index+1} / ${items.length} IPA</span>
          <h2>\uD83D\uDDE3\uFE0F B\u1EA2NG PHI\u00CAN \u00C2M QU\u1ED0C T\u1EBE IPA \uD83C\uDF99\uFE0F</h2>
          <button class="ta3-ta2-ipa-quiz" data-action="ta2-ipa-quiz">\uD83C\uDFAF IPA Quiz</button></div>
        <p class="ta3-ta2-ipa-hint">B\u1EA5m v\u00E0o b\u1EA5t k\u1EF3 \u00E2m IPA n\u00E0o \u0111\u1EC3 nghe ph\u00E1t \u00E2m chu\u1EA9n v\u00E0 xem h\u01B0\u1EDBng d\u1EABn chi ti\u1EBFt:</p>
        <section class="ta3-ta2-ipa-workspace"><div class="ta3-ta2-ipa-workspace-grid">
          <div class="ta3-ta2-ipa-feature"><div class="ta3-ta2-ipa-top">
            <span class="ta3-ta2-ipa-type" data-kind="${esc(item.type)}">${typeLabel}</span>
            <button class="ta3-ta2-ipa-large" data-action="phonics-learn-sound" type="button"><strong>${esc(item.ipa)}</strong><small>${esc(item.name)}</small></button></div>
            <div class="ta3-ta2-ipa-guide"><b>\uD83D\uDCA1 H\u01B0\u1EDBng d\u1EABn ph\u00E1t \u00E2m chu\u1EA9n:</b><p>${esc(item.guide)}</p></div>
            <div class="ta3-ta2-ipa-buttons"><button data-action="phonics-learn-sound" class="ta3-ta2-ipa-play">\uD83D\uDD0A Nghe \u00E2m ${esc(item.ipa)}</button>
              <button data-action="ta2-ipa-guide" class="ta3-ta2-ipa-guide-listen">\uD83C\uDF10 \u0110\u1ECDc h\u01B0\u1EDBng d\u1EABn</button></div></div>
          <div class="ta3-ta2-ipa-examples"><h3>\u2B50 3 V\u00CD D\u1EE4 T\u1EEA V\u1EF0NG CHU\u1EA8N C\u1EE6A \u00C2M ${esc(item.ipa)}:</h3>
            <div class="ta3-ta2-ipa-examples-grid">${examples}</div>
            <p>\uD83D\uDC46 Ch\u1EA1m v\u00E0o t\u1EEBng th\u1EBB \u0111\u1EC3 nghe ph\u00E1t \u00E2m t\u1EEB v\u1EF1ng v\u00E0 c\u00E2u v\u00ED d\u1EE5 sinh \u0111\u1ED9ng!</p></div>
        </div></section>
        <div class="ta3-ta2-ipa-keyboard" role="group" aria-label="44 IPA sounds">${soundButtons}</div>
        <nav class="ta3-ta2-ipa-actions"><button data-action="phonics-learn-prev" ${index===0?'disabled':''}>\u2190 Previous Sound</button>
          <button class="ta3-ta2-ipa-next" data-action="phonics-learn-next" ${index===items.length-1?'disabled':''}>Next Sound \u2192</button></nav>
        ${back}</div>`;
    }
    // In TA2 changing the focused card automatically reads the letter or the sample word.
    if(alphabet)alphabetSpeak(item.letter);else ipaSpeak(item);
  }

  // Section 2 — SGK Global Success 3, four levels by Unit ranges (five Units each).
  // The legacy 213-word bank remains available to other Explore sections but is NOT shown here.
  function getSgkVocabGroups(data){
    const units=list(data?.sgk_vocabulary_units);
    return VOCAB_LEVELS.map(spec=>{
      const rows=units.filter(u=>Number(u.unit)>=5*(spec.level-1)+1&&Number(u.unit)<=spec.level*5);
      return {...spec,semester:spec.level<=2?1:2,unitFrom:5*(spec.level-1)+1,
        unitTo:spec.level*5,words:rows.flatMap(u=>list(u.words))};
    });
  }
  async function showVocabHub(data,request){
    const groups=getSgkVocabGroups(data),total=groups.reduce((n,g)=>n+g.words.length,0);
    if(!living(request))return;
    if(groups.some(g=>!g.words.length))throw new Error('Chưa có danh sách từ vựng SGK. Hãy cập nhật kham_pha_tieng_anh_3_part1.json cùng với ta_app.js.');
    root.innerHTML=`<section class="ta3-vocab-hub">
      <div class="ta3-vocab-hub-heading"><h2>📚 Vocabulary by 20 Units</h2>
        <p>4 Levels · ${total} lượt học từ theo SGK Global Success 3</p>
        <small>Học kỳ 1: Level 1–2 (Unit 1–10) · Học kỳ 2: Level 3–4 (Unit 11–20)</small></div>
      <div class="ta3-vocab-level-grid">${groups.map(g=>`<button class="ta3-vocab-level" data-tone="${g.tone}" data-action="vocab-level" data-level="${g.level}">
          <span><strong>${g.icon} Level ${g.level} · ${g.name}</strong><small>${g.vi} · HK${g.semester} · Unit ${g.unitFrom}–${g.unitTo}</small></span>
          <b>${g.words.length} words</b></button>`).join('')}</div>
      <div class="ta3-vocab-hub-note">🌷 Bé chọn Level theo đúng các Unit đã học trên lớp.</div>
      <button class="ta3-ta2-return" data-action="back">← Khám phá</button>
    </section>`;
  }
  // Discover 6-9: four Level buttons, aligned with SGK 20 Units (five per level).
  function renderSgkLevelHub(topic,first,second){
    const cfg=SGK_LEVELED_TOPICS[topic];if(!cfg)return;
    const levels=getSgkVocabGroups(first);
    const units=list(first?.sgk_vocabulary_units);
    const count=levels.reduce((total,g)=>total+list(second?.sections?.[`section_${topic}.${g.level}`]).length,0);
    if(levels.some(g=>list(second?.sections?.[`section_${topic}.${g.level}`]).length===0)){
      throw new Error('The Level question bank is missing. Update the SGK Explore Part 2 JSON.');
    }
    root.innerHTML=`<section class="ta3-vocab-hub ta3-sgk-quiz-hub">
      <div class="ta3-vocab-hub-heading"><h2>${esc(cfg.title)} by 20 Units</h2>
        <p>4 Levels · ${topic===6?`${count/2} passages · ${count} questions`:`${count} questions`} · Global Success 3</p>
        <small>Semester 1: Levels 1–2 (Units 1–10) · Semester 2: Levels 3–4 (Units 11–20)</small></div>
      <div class="ta3-vocab-level-grid">${levels.map(g=>{
        const cards=list(second.sections[`section_${topic}.${g.level}`]);
        const themes=units.filter(u=>Number(u.unit)>=g.unitFrom&&Number(u.unit)<=g.unitTo).map(u=>u.title);
        return `<button class="ta3-vocab-level" data-tone="${g.tone}" data-action="discover-open" data-section="section_${topic}.${g.level}">
          <span><strong>${g.icon} Level ${g.level} · ${esc(g.name)}</strong>
          <small>${esc(g.vi)} · Semester ${g.semester} · Units ${g.unitFrom}–${g.unitTo}</small>
          <small class="ta3-sgk-level-topics">${esc(themes.join(' · '))}</small></span>
          <b>${topic===6?`${cards.length/2} passages`:`${cards.length} questions`}</b></button>`;
      }).join('')}</div>
      <button class="ta3-ta2-return" data-action="back">← Explore</button>
    </section>`;
  }
  async function openVocabLevel(level){
    if(!Number.isInteger(level)||level<1||level>4)return;
    const request=++nonce;stopVocabRecognition();stopSpeech();loading();
    try{
      const d=await load('discover1');if(!living(request))return;
      const g=getSgkVocabGroups(d)[level-1];if(!g||g.words.length===0)throw new Error('Level này chưa có học liệu SGK.');
      // Shuffle only on entering Level. Switching tabs NEVER reshuffles or changes current word.
      vocabContext='sgk';vocabPool=shuffle(g.words);vocabIndex=0;vocabLevel=level;vocabMode='flashcard';
      vocabCorrect=Object.create(null);vocabTries=Object.create(null);vocabChoices=Object.create(null);
      await loadCatalog();if(!living(request))return;
      setView('discover','vocab-study',{group:2,title:`Level ${level} · ${g.name}`});
      renderVocabStudy();
    }catch(err){if(living(request))errorView(err);}
  }
  // EXACT CLASS-2 LEARNING PATTERN: level hub -> word-derived interactive practice.
  // No M3-M5 legacy question banks are loaded; they remain untouched as archival data.
  const SHARED_ACTIVITY_CONFIG=Object.freeze({
    3:{icon:'✂️',title:'Remove Letter',vi:'Xóa chữ cái thừa',prompt:'Remove the extra letter(s).',help:'Tap the extra letter(s) to move them below. Tap again to undo.'},
    4:{icon:'✏️',title:'Fill Missing',vi:'Điền chữ còn thiếu',prompt:'Complete the word.',help:'Choose the missing letter to complete the word.'},
    5:{icon:'🧩',title:'Odd One Out',vi:'Tìm từ khác loại',prompt:'Choose the odd word.',help:'Three words belong to the same group. Find the word that is different.'}
  });
  // Explicit concept groups only. Mixing Unit or word length is NOT semantic grouping.
  // The remaining SGK vocabulary is still available in M2, M3 and M4.
  const SHARED_SEMANTIC_SETS=Object.freeze({
    1:{greetings:'bye|fine|goodbye|hello|hi|thank you',people:'friend|Mr|Ms|teacher',body:'ear|eye|face|hair|hand|mouth|nose',hobbies:'cooking|dancing|drawing|painting|running|singing|swimming|walking'},
    2:{school_places:'art room|classroom|computer room|gym|library|music room|playground|school',commands:'close|come in|go out|sit down|speak|stand up',school_things:'book|eraser|notebook|pen|pencil|pencil case|ruler|school bag',colours:'black|blue|brown|green|orange|red|white|yellow',sports:'badminton|basketball|chess|football|table tennis|volleyball|word puzzles'},
    3:{family:'brother|father|mother|sister',numbers:'eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty',jobs:'cook|doctor|driver|farmer|nurse|singer|teacher|worker',rooms:'bathroom|bedroom|house|kitchen|living room',adjectives:'big|new|old|small',food:'bean|bread|chicken|egg|fish|meat|rice'},
    4:{pets:'bird|cat|dog|goldfish|parrot|rabbit',vehicles:'bus|car|plane|ship|train|truck',activities:'dancing|drawing a picture|listening to music|playing basketball|reading|singing|watching TV|writing|cycling|flying a kite|painting|playing badminton|running|skating|skipping|walking|climbing|counting|swinging',zoo_animals:'elephant|horse|monkey|peacock|tiger'}
  });
  const SHARED_SEMANTIC_INDEX=Object.fromEntries(Object.entries(SHARED_SEMANTIC_SETS).map(([level,groups])=>[
    level,Object.fromEntries(Object.entries(groups).flatMap(([group,words])=>words.split('|').map(word=>[normalize(word),group])))
  ]));
  function sharedSemantic(word,level){return SHARED_SEMANTIC_INDEX[level]?.[normalize(word)]||'';}
  function sharedCancelSpeech(){++sharedSpeechVersion;if(sharedTimer!==null){clearTimeout(sharedTimer);sharedTimer=null;}}
  function sharedSpeakAnswer(q){sharedCancelSpeech();const token=sharedSpeechVersion,id=q.id;
    sharedTimer=setTimeout(()=>{sharedTimer=null;if(!active||view.page!=='shared-study'||sharedSpeechVersion!==token||sharedActivity?.questions[sharedActivity.index]?.id!==id)return;
      void speak(q.word,'en-US');},390);
  }
  function sharedFeedback(correct){playTA2Feedback(correct);}
  // Shared local-practice scoreboard for M3-M5. The shell owns the chips.
  // Solved questions count once; the same wrong option/letter counts at most once.
  function sharedUpdatePracticeScore(){
    const state=sharedActivity;
    if(!state||![3,4,5].includes(state.activity))return;
    const correct=state.questions.filter(q=>q.solved).length;
    const wrong=state.questions.reduce((sum,q)=>sum+list(q.wrong).length,0);
    ctx?.hooks?.setScore?.(correct,wrong);
  }
  function sharedReadInstruction(){
    if(view.page!=='shared-study'||![3,4,5].includes(sharedActivity?.activity))return;
    const q=sharedActivity.questions[sharedActivity.index];
    if(!q||q.solved)return;
    sharedCancelSpeech();
    void speak(SHARED_ACTIVITY_CONFIG[sharedActivity.activity].prompt,'en-US');
  }
  function sharedLevelWords(d,level){return getSgkVocabGroups(d)[level-1]?.words||[];}
  function renderSharedLevelHub(activity,d){
    const cfg=SHARED_ACTIVITY_CONFIG[activity];if(!cfg)return;
    const levels=getSgkVocabGroups(d);
    root.innerHTML=`<div class="ta3-shared-hub">
      <div class="ta3-shared-hub-intro"><h2>${esc(cfg.title)} by 20 Units</h2>
        <p>Use the same Vocabulary Explorer · 4 progressive levels</p>
        <small>${esc(cfg.vi)} · Học từ nào, luyện từ đó theo SGK Global Success 3.</small></div>
      <div class="ta3-vocab-level-grid">${levels.map(g=>`<button class="ta3-vocab-level" data-tone="${g.tone}" data-action="shared-level" data-group="${activity}" data-level="${g.level}">
        <span><strong>${g.icon} Level ${g.level} · ${esc(g.name)}</strong>
        <small>${esc(g.vi)} · HK${g.semester} · Unit ${g.unitFrom}–${g.unitTo}</small></span>
        <b>${g.words.length} words</b></button>`).join('')}</div>
      <button class="ta3-ta2-return" data-action="back">← Explore</button></div>`;
  }
  function sharedRandomExtra(word){const available=[...'abcdefghijklmnopqrstuvwxyz'].filter(c=>!normalize(word).includes(c));return available[Math.floor(Math.random()*available.length)]||'z';}
  function sharedRemoveQuestion(v){const word=txt(v.word).trim();if([...word].filter(x=>/[a-z]/i.test(x)).length<2)return null;
    const chars=[...word];const count=Math.min(3,/[a-z]/gi.test(word)&&word.replace(/[^a-z]/gi,'').length>=8?3:word.length>=5?2:1);
    const tokens=chars.map((ch,i)=>({ch,original:true,order:i}));
    for(let j=0;j<count;j++)tokens.splice(Math.floor(Math.random()*(tokens.length+1)),0,{ch:sharedRandomExtra(word),original:false,extraNo:j});
    return {id:'remove_'+v.vocab_id,word,vietnamese:v.vietnamese||'',ipa:v.ipa||'',tokens,extraCount:count,kind:3,selected:[],wrong:[],solved:false};
  }
  function sharedFillQuestion(v){const word=txt(v.word).trim(),arr=[...word],candidates=arr.map((ch,i)=>/[a-z]/i.test(ch)?i:-1).filter(i=>i>=0);if(!candidates.length)return null;
    const index=candidates[Math.floor(Math.random()*candidates.length)],correct=arr[index].toLowerCase();
    const distract=shuffle([...'abcdefghijklmnopqrstuvwxyz'].filter(c=>c!==correct&&!normalize(word).includes(c))).slice(0,3);
    return {id:'fill_'+v.vocab_id,word,vietnamese:v.vietnamese||'',ipa:v.ipa||'',kind:4,missing:index,options:shuffle([correct,...distract]),answer:correct,wrong:[],solved:false};
  }
  function sharedOddQuestions(rows,level){
    const byGroup=new Map();const words=new Map();
    rows.forEach(v=>{const key=normalize(v.word),group=sharedSemantic(v.word,level);if(!group||words.has(key))return;words.set(key,v);if(!byGroup.has(group))byGroup.set(group,[]);byGroup.get(group).push(v);});
    const groups=[...byGroup.keys()].filter(g=>byGroup.get(g).length>=4);if(groups.length<2)return [];
    const result=[];
    for(const v of words.values()){
      const group=sharedSemantic(v.word,level);if(!groups.includes(group))continue;
      const peers=shuffle(byGroup.get(group).filter(w=>normalize(w.word)!==normalize(v.word))).slice(0,3);
      const otherGroup=shuffle(groups.filter(g=>g!==group))[0],other=shuffle(byGroup.get(otherGroup))[0];
      if(peers.length<3||!other)continue;
      const choices=shuffle([...peers,other]);
      result.push({id:'odd_'+v.vocab_id,kind:5,word:v.word,answer:other.word,options:choices.map(w=>({word:w.word,ipa:w.ipa||'',vietnamese:w.vietnamese||''})),wrong:[],solved:false});
    }
    return result;
  }
  async function openSharedLevel(activity,level){
    const cfg=SHARED_ACTIVITY_CONFIG[activity];if(!cfg||!Number.isInteger(level)||level<1||level>4)return;
    const request=++nonce;sharedCancelSpeech();stopSpeech();loading();
    try{const d=await load('discover1');if(!living(request))return;
      const g=getSgkVocabGroups(d)[level-1],pool=sharedLevelWords(d,level);
      const questions=activity===3?pool.map(sharedRemoveQuestion).filter(Boolean):activity===4?pool.map(sharedFillQuestion).filter(Boolean):sharedOddQuestions(pool,level);
      if(!questions.length)throw new Error('Level này chưa đủ nhóm từ phù hợp để tạo bài luyện.');
      sharedActivity={activity,level,group:g,index:0,questions:shuffle(questions)};
      setView('discover','shared-study',{group:activity,title:activity===3?`Level ${level} · ${g.name}`:`Level ${level} · ${g.name} / ${g.vi}`});
      renderSharedStudy();
      sharedUpdatePracticeScore();sharedReadInstruction();
    }catch(err){if(living(request))errorView(err);}
  }
  function sharedResult(q){const ipa=txt(q.ipa).trim().replace(/^\/+|\/+$/g,'');
    return `<div class="ta3-shared-result"><p class="ta3-shared-success">✅ Correct! You completed the word.</p>
      <div class="ta3-shared-answer-line"><strong>${esc(q.word)}</strong>${ipa?`<span>/${esc(ipa)}/</span>`:''}
        ${q.vietnamese?`<em>– ${esc(q.vietnamese)}</em>`:''}<button type="button" data-action="shared-replay">🔊 Listen again</button></div></div>`;
  }
  function renderSharedRemove(q){
    const selected=new Set(q.selected),wrongSelected=q.selected.some(i=>q.tokens[i].original);let line='',chunks=[];
    const flush=()=>{if(line){chunks.push(`<span class="ta3-shared-rl-group">${line}</span>`);line='';}};
    q.tokens.forEach((t,i)=>{if(selected.has(i))return;if(t.ch===' '){flush();chunks.push('<span class="ta3-shared-space"></span>');return;}
      if(!/[a-z]/i.test(t.ch)){line+=`<span class="ta3-shared-mark">${esc(t.ch)}</span>`;return;}
      line+=q.solved?`<span class="ta3-shared-tile is-solved">${esc(t.ch)}</span>`:
        `<button class="ta3-shared-tile" data-action="shared-remove" data-pos="${i}" aria-label="Select letter ${esc(t.ch)}">${esc(t.ch)}</button>`;});flush();
    const moved=q.selected.slice().sort((a,b)=>a-b).map(i=>`<button class="ta3-shared-tile moved ${q.tokens[i].original?'is-wrong':''}" data-action="shared-remove" data-pos="${i}" ${q.solved?'disabled':''} aria-label="Restore letter">${esc(q.tokens[i].ch)}</button>`).join('');
    return `<div class="ta3-shared-rl-screen"><h3>Remove the extra letter(s). <button type="button" class="ta3-shared-prompt-listen" data-action="shared-instruction" aria-label="Listen to the question">🔊 Listen</button></h3>
      <p>${esc(SHARED_ACTIVITY_CONFIG[3].help)}</p>
      <div class="ta3-shared-rl-line">${chunks.join('')}</div><div class="ta3-shared-removed-area"><div class="ta3-shared-removed-label">REMOVED LETTERS</div>
      <div class="ta3-shared-removed-line">${moved||'<span>Selected letters appear here.</span>'}</div></div>
      ${q.solved?sharedResult(q):`<p class="ta3-shared-feedback ${wrongSelected?'bad':''}" role="status">${wrongSelected?'That letter belongs in the word. Tap it again to put it back.':q.selected.length?'Keep looking for the extra letter(s)!':''}</p>`}</div>`;
  }
  function renderSharedFill(q){const letters=[...q.word].map((ch,i)=>i===q.missing?`<span class="ta3-shared-missing ${q.solved?'is-solved':''}">${q.solved?esc(ch):'_'}</span>`:`<span>${esc(ch)}</span>`).join('');
    const options=q.options.map((ch,i)=>`<button class="ta3-shared-fill-option ${q.solved&&ch===q.answer?'correct':q.wrong.includes(i)?'wrong':''}" data-action="shared-fill" data-index="${i}" ${q.solved?'disabled':''}><b>${String.fromCharCode(65+i)}.</b> <strong>${esc(ch.toUpperCase())}</strong></button>`).join('');
    return `<div class="ta3-shared-fm-screen"><h3>Complete the word. <button type="button" class="ta3-shared-prompt-listen" data-action="shared-instruction" aria-label="Listen to the question">🔊 Listen</button></h3>
      <p>${esc(SHARED_ACTIVITY_CONFIG[4].help)}</p>
      <div class="ta3-shared-fm-word" role="group" aria-label="Word with a missing letter">${letters}</div><div class="ta3-shared-fm-options">${options}</div>
      ${q.solved?sharedResult(q):q.wrong.length?'<p class="ta3-shared-feedback bad" role="status">Not quite! Try another letter.</p>':''}</div>`;
  }
  function renderSharedOdd(q){const choices=q.options.map((w,i)=>`<button class="ta3-shared-odd-option ${q.solved&&normalize(w.word)===normalize(q.answer)?'correct':q.wrong.includes(i)?'wrong':''}" data-action="shared-odd" data-index="${i}">
      <strong>${esc(w.word)}</strong>${w.ipa?`<span>/${esc(txt(w.ipa).replace(/^\/+|\/+$/g,''))}/</span>`:''}
      ${q.solved?`<em>${esc(w.vietnamese)}</em>`:''}</button>`).join('');
    return `<div class="ta3-shared-odd-screen"><h3>Choose the odd word. <button type="button" class="ta3-shared-prompt-listen" data-action="shared-instruction" aria-label="Listen to the question">🔊 Listen</button></h3>
      <p>${esc(SHARED_ACTIVITY_CONFIG[5].help)}</p>
      <div class="ta3-shared-odd-options">${choices}</div>${q.solved?'<p class="ta3-shared-success" role="status">⭐ Excellent! You found the odd word.</p>':q.wrong.length?'<p class="ta3-shared-feedback bad" role="status">Try again! Look for three words from the same group.</p>':''}</div>`;
  }
  function renderSharedStudy(){const state=sharedActivity;if(!state||!root||view.page!=='shared-study')return;
    const q=state.questions[state.index];
    const body=state.activity===3?renderSharedRemove(q):state.activity===4?renderSharedFill(q):renderSharedOdd(q);
    root.innerHTML=`<section class="ta3-shared-study">
      <div class="ta3-shared-paper">${body}</div>
      <nav class="ta3-shared-nav"><button data-action="shared-prev" ${state.index===0?'disabled':''}>← Previous</button>
        <span>${state.index+1} / ${state.questions.length}</span><button class="primary" data-action="shared-next">Next →</button></nav></section>`;
  }
  function sharedRemove(index){const q=sharedActivity?.questions[sharedActivity.index];if(q?.kind!==3||q.solved||index<0||index>=q.tokens.length)return;
    const was=q.selected.includes(index),src=!was?$(`[data-action="shared-remove"][data-pos="${index}"]`):null,rect=src?.getBoundingClientRect();
    if(was)q.selected=q.selected.filter(i=>i!==index);else q.selected.push(index);
    const remaining=q.tokens.filter((t,i)=>!q.selected.includes(i)).map(t=>t.ch).join('');
    q.solved=normalize(remaining)===normalize(q.word);
    if(q.solved){sharedFeedback(true);sharedSpeakAnswer(q);}
    else if(!was&&q.tokens[index].original){
      // Do not count the same incorrect letter repeatedly after undo/reselect.
      if(!q.wrong.includes(index)){q.wrong.push(index);sharedFeedback(false);}
    }
    sharedUpdatePracticeScore();
    renderSharedStudy();
    if(!was&&rect?.width&&!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches){
      const dst=$(`[data-action="shared-remove"][data-pos="${index}"]`),target=dst?.getBoundingClientRect();
      if(target&&src){const flyer=document.createElement('span');flyer.className='ta3-shared-flyer';flyer.textContent=q.tokens[index].ch;
        flyer.style.cssText=`position:fixed;left:${rect.left}px;top:${rect.top}px;width:${rect.width}px;height:${rect.height}px;z-index:999;pointer-events:none`;
        document.body.appendChild(flyer);if(flyer.animate){flyer.animate([{transform:'translate(0,0)',opacity:1},{transform:`translate(${target.left-rect.left}px,${target.top-rect.top}px)`,opacity:0}],{duration:300,easing:'ease-out'}).onfinish=()=>flyer.remove();}else flyer.remove();}
      // No animation is required for ordinary immediate correctness.
    }
  }
  function sharedChoose(index){const q=sharedActivity?.questions[sharedActivity.index];if(!q||!Number.isInteger(index)||index<0)return;
    if(q.solved){if(q.kind===5&&q.options[index])void speak(q.options[index].word,'en-US');return;}
    if(q.kind===4){
      if(index>=q.options.length)return;
      const ch=q.options[index];
      if(ch===q.answer){q.solved=true;sharedFeedback(true);sharedSpeakAnswer(q);}
      else if(!q.wrong.includes(index)){q.wrong.push(index);sharedFeedback(false);}
    }else if(q.kind===5){
      if(index>=q.options.length)return;
      const option=q.options[index];void speak(option.word,'en-US');
      if(normalize(option.word)===normalize(q.answer)){q.solved=true;sharedFeedback(true);}
      else if(!q.wrong.includes(index)){q.wrong.push(index);sharedFeedback(false);}
    }
    sharedUpdatePracticeScore();
    renderSharedStudy();
  }
  function sharedMove(delta){const state=sharedActivity;if(!state)return;
    const q=state.questions[state.index];
    if(delta>0&&!q.solved&&state.activity!==3){toast('Find the correct answer before moving on!');return;}
    if(delta<0&&state.index===0)return;
    sharedCancelSpeech();stopSpeech();
    if(delta>0&&state.index===state.questions.length-1){
      const completed=state.questions.filter(v=>v.solved).length;
      // Restart the learning round without changing its vocabulary source.
      state.questions=shuffle(state.questions.map(v=>({...v,selected:[],wrong:[],solved:false})));state.index=0;
      toast(state.activity===3?`🎉 Round complete! ${completed}/${state.questions.length} words correct. Let's practise again!`:`🎉 Round complete! ${completed}/${state.questions.length} correct. Let's practise again!`);
    }else state.index=Math.max(0,state.index+delta);
    renderSharedStudy();
    sharedUpdatePracticeScore();sharedReadInstruction();
  }

  const VOCAB_NUMBER_PICTURES=Object.freeze({eleven:11,twelve:12,thirteen:13,fourteen:14,
    fifteen:15,sixteen:16,seventeen:17,eighteen:18,nineteen:19,twenty:20});
  function vocabMeaningPicture(q){
    // For abstract/ambiguous words, a precise Vietnamese meaning is preferable to a WRONG picture.
    return `<div class="ta3-vocab-meaning-clue" lang="vi"><span>📖 Nghĩa tiếng Việt</span><strong>${esc(q.vietnamese)}</strong></div>`;
  }
  function vocabSimplePicture(q){
    // A pair of school items without matching catalog photos. Original text-free vector icons.
    if(Number(q?.unit)!==8)return '';
    const word=normalize(q.word);
    if(word==='eraser')return `<svg class="ta3-vocab-svg-object" role="img" aria-label="Cục tẩy" viewBox="0 0 280 180" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="142" cy="147" rx="108" ry="13" fill="#ddd6fe" opacity=".6"/>
      <g transform="rotate(-13 141 99)"><rect x="56" y="58" width="172" height="80" rx="24" fill="#c084fc" stroke="#8b5cf6" stroke-width="4"/>
      <path d="M142 58h62a24 24 0 0 1 24 24v32a24 24 0 0 1-24 24h-62z" fill="#fb7185"/>
      <path d="M144 61v74" stroke="#fff" stroke-width="6" opacity=".9"/>
      <path d="M77 74h40" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity=".8"/></g></svg>`;
    if(word==='pencil case')return `<svg class="ta3-vocab-svg-object" role="img" aria-label="Hộp bút" viewBox="0 0 280 180" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="140" cy="151" rx="107" ry="11" fill="#ddd6fe" opacity=".65"/>
      <g transform="translate(0 6)"><rect x="63" y="37" width="17" height="58" rx="5" fill="#f59e0b" transform="rotate(-13 71 67)"/>
      <path d="M65 39l7-16 8 15" fill="#f5deb3"/><rect x="95" y="31" width="17" height="66" rx="5" fill="#fb7185"/>
      <path d="M95 33l8-17 9 17" fill="#f5deb3"/><rect x="131" y="37" width="17" height="59" rx="5" fill="#a78bfa" transform="rotate(9 139 63)"/>
      <rect x="42" y="81" width="197" height="69" rx="25" fill="#38bdf8" stroke="#0284c7" stroke-width="4"/>
      <path d="M60 97h160" stroke="#e0f2fe" stroke-width="8" stroke-linecap="round"/>
      <path d="M100 117h85" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".72"/>
      <circle cx="215" cy="100" r="7" fill="#fef08a"/></g></svg>`;
    return '';
  }
  function vocabImage(q,forQuiz=false){
    // Avoid ambiguous picture questions even when a catalog reference exists.
    if(forQuiz&&!q.has_concrete_picture)return vocabMeaningPicture(q);
    const entry=getVisual(q);
    // Keep the existing safe catalog priority, but never reveal labelled pictures in a quiz.
    if(entry&&(!forQuiz||entry.has_text!==true))
      return `<img loading="lazy" decoding="async" data-fallback-emoji="${esc(emojiOf(q))}" data-fallback-vi="${esc(q.vietnamese)}" src="${esc(entry.src)}" alt="Minh họa từ vựng"/>`;
    const number=VOCAB_NUMBER_PICTURES[normalize(q.word)];
    if(number)return `<span class="ta3-vocab-number-visual" aria-label="Số ${number}">${number}</span>`;
    const simple=vocabSimplePicture(q);
    if(simple)return simple;
    const emoji=emojiOf(q);
    return emoji?`<span class="ta3-vocab-picture-emoji" role="img" aria-label="Minh họa">${esc(emoji)}</span>`:vocabMeaningPicture(q);
  }
  function vocabPictureSignature(q){
    // Avoid two answer options that have indistinguishable visual clues.
    if(!q.has_concrete_picture)return `vi:${normalize(q.vietnamese)}`;
    const entry=getVisual(q);
    if(entry&&entry.has_text!==true)return `photo:${entry.src}`;
    const word=normalize(q.word),number=VOCAB_NUMBER_PICTURES[word];
    if(number)return `number:${number}`;
    if(Number(q.unit)===8&&['eraser','pencil case'].includes(word))return `svg:${word}`;
    return `emoji:${emojiOf(q)}`;
  }
  function vocabSameMeaning(a,b){
    if(normalize(a.vietnamese)===normalize(b.vietnamese))return true;
    const wa=normalize(a.word),wb=normalize(b.word);
    return (['hi','hello'].includes(wa)&&['hi','hello'].includes(wb))
      ||(['bye','goodbye'].includes(wa)&&['bye','goodbye'].includes(wb));
  }
  function vocabOptionPool(q){
    const cacheKey=q.vocab_id+'|'+vocabMode;
    if(vocabChoices[cacheKey])return vocabChoices[cacheKey];
    const distinct=new Set([normalize(q.word)]);
    const visualKey=vocabMode==='picture'?vocabPictureSignature(q):'';
    const rest=shuffle(vocabPool.filter(v=>normalize(v.word)!==normalize(q.word))).filter(v=>{
      const word=normalize(v.word);
      if(distinct.has(word))return false;
      if(vocabMode==='picture'&&(vocabSameMeaning(q,v)||vocabPictureSignature(v)===visualKey))return false;
      distinct.add(word);return true;
    }).slice(0,3);
    // Each tab keeps four stable choices while picture choices remain visually distinguishable.
    return vocabChoices[cacheKey]=shuffle([q,...rest]);
  }
  function vocabResolved(q){return !!vocabCorrect[q.vocab_id]?.[vocabMode];}
  function vocabHighlight(text,word){
    const raw=txt(text),w=txt(word).trim();if(!w)return esc(raw);
    const at=raw.toLocaleLowerCase().indexOf(w.toLocaleLowerCase());
    if(at<0)return esc(raw);
    return esc(raw.slice(0,at))+'<mark>'+esc(raw.slice(at,at+w.length))+'</mark>'+esc(raw.slice(at+w.length));
  }
  function vocabExamples(q){
    const examples=list(q.examples).filter(Boolean).slice(0,3), translations=list(q.examples_vi);
    return `<div class="ta3-vocab-examples"><h3>⭐ EXAMPLE SENTENCES</h3>
      ${examples.length?examples.map((example,i)=>`<div class="ta3-vocab-example"><div class="ta3-vocab-example-text"><p>${vocabHighlight(example,q.word)}</p>
      ${translations[i]?`<small>${esc(translations[i])}</small>`:''}</div><button data-action="vocab-example" data-index="${i}" aria-label="Nghe câu ví dụ ${i+1}" class="ta3-listen-btn ta3-vocab-example-listen">Listen</button></div>`).join(''):'<p>Chưa có câu ví dụ trong học liệu.</p>'}</div>`;
  }
  function vocabChoicesMarkup(q){
    const options=vocabOptionPool(q),success=vocabResolved(q);
    const tries=vocabTries[q.vocab_id]?.[vocabMode]||[];
    return `<div class="ta3-vocab-choices">${options.map((opt,i)=>{
      const chosen=tries.includes(i),correct=normalize(opt.word)===normalize(q.word);
      const cls=success&&correct?' correct':chosen&&!correct?' wrong':'';
      // Always keep solved choices actionable: after grading, a tap replays
      // the English pronunciation without changing correctness/attempts.
      return `<button type="button" data-action="vocab-option" data-index="${i}" class="ta3-vocab-choice${cls}" ${success?`aria-label="Nghe lại từ ${esc(opt.word)}" title="Chạm để nghe lại tiếng Anh"`:''}>
        <b>${String.fromCharCode(65+i)}.</b><span class="ta3-vocab-answer-copy"><strong>${esc(opt.word)}</strong>
        ${opt.ipa?`<small>/${esc(txt(opt.ipa).replace(/^\/+|\/+$/g,''))}/</small>`:''}
        ${success?`<em>(${esc(opt.vietnamese)})</em>`:''}</span>${success||chosen?'<span class="ta3-vocab-choice-replay" aria-hidden="true">🔊</span>':''}</button>`;
    }).join('')}</div>`;
  }
  function renderVocabStudy(){
    if(view.page!=='vocab-study'||!vocabPool.length||!root)return;
    const q=vocabPool[vocabIndex],success=vocabResolved(q);
    const tabs=[['flashcard','🃏','Flashcards'],['picture','🖼️','Word-picture Puzzle'],['listen','🎧','Listen and Choose'],['speak','🎤','Speak & Check']];
    const nav=`<nav class="ta3-vocab-nav"><button data-action="vocab-prev" ${vocabIndex===0?'disabled':''}>← Previous</button><span>${vocabIndex+1} / ${vocabPool.length}</span><button data-action="vocab-next" ${vocabIndex>=vocabPool.length-1?'disabled':''}>Next →</button></nav>`;
    // Word-picture Puzzle: always show the Vietnamese clue below a concrete picture.
    // Abstract words already display their meaning inside vocabMeaningPicture().
    const hasPictureMeaning=vocabMode==='picture'&&!!q.has_concrete_picture;
    const picture=`<div class="ta3-vocab-image${hasPictureMeaning?' ta3-vocab-puzzle-image':''}">${vocabImage(q,vocabMode==='picture')}${hasPictureMeaning?`<p class="ta3-vocab-puzzle-meaning" lang="vi">Nghĩa: ${esc(q.vietnamese)}</p>`:''}</div>`;
    const speakButton=`<button class="ta3-vocab-listen" data-action="vocab-listen">🔊 Listen · Nghe mẫu</button>`;
    const wordPanel=`<section class="ta3-vocab-card">${picture}<div class="ta3-vocab-word-row"><h2>${esc(q.word)}</h2><button data-action="vocab-listen" class="ta3-listen-btn ta3-vocab-word-sound" aria-label="Nghe từ tiếng Anh">Listen</button></div>
      <p class="ta3-vocab-ipa">${q.ipa?'/'+esc(txt(q.ipa).replace(/^\/+|\/+$/g,''))+'/':''}</p>
      <p class="ta3-vocab-vi">${esc(q.vietnamese)}</p></section>`;
    let body='';
    if(vocabMode==='flashcard')body=`<div class="ta3-vocab-columns">${wordPanel}${vocabExamples(q)}</div>`;
    if(vocabMode==='picture')body=`<div class="ta3-vocab-prompt"><span class="ta3-vocab-current-topic">🖼️ ${vocabContext==='super'?'Super Vocabulary':`Level ${vocabLevel}`}</span><h2>Choose the correct English word:</h2><button data-action="vocab-prompt" aria-label="Nghe câu hỏi" class="ta3-listen-btn ta3-vocab-prompt-listen">Listen</button></div>
      <div class="ta3-vocab-columns"><section class="ta3-vocab-picture-panel">${picture}
      </section>
      <section class="ta3-vocab-examples-panel">${success?vocabExamples(q):'<h3 class="ta3-vocab-examples-wait">⭐ EXAMPLE SENTENCES</h3>'}</section></div>${vocabChoicesMarkup(q)}`;
    if(vocabMode==='listen')body=`<div class="ta3-vocab-listening"><h2>Listen and choose.</h2><p>Nghe và chọn từ đúng</p>
      <button class="ta3-listen-btn ta3-vocab-sound" data-action="vocab-listen" aria-label="Nghe từ vựng">Listen</button>${vocabChoicesMarkup(q)}</div>`;
    if(vocabMode==='speak')body=`<div class="ta3-vocab-columns">${wordPanel}<section class="ta3-vocab-speak-panel">
      <h2>🎤 Speak & Check</h2><p>Chạm micro, nói từ tiếng Anh trong tranh</p>
      <button id="ta3-vocab-microphone" class="ta3-vocab-mic" data-action="vocab-mic" aria-label="Bắt đầu luyện nói">🎤</button>
      <div class="ta3-vocab-speech-status" id="ta3-vocab-speech-status" role="status" aria-live="polite" data-status="${success?'good':'idle'}">${success?'✅ Con đã phát âm đúng!':'Chạm micro và nói thật rõ nhé!'}</div>
      ${vocabExamples(q)}</section></div>`;
    const isSuper=vocabContext==='super';
    // Breadcrumb/sub-banner already shows Level (M2) or selected topics (M12).
    root.innerHTML=`<section class="ta3-vocab-study${isSuper?' ta3-super-study':''}">
      <div class="ta3-vocab-tabs" role="group" aria-label="Chọn cách học từ vựng">${tabs.map(t=>`<button data-action="vocab-mode" data-mode="${t[0]}" class="${vocabMode===t[0]?'active':''}" aria-pressed="${vocabMode===t[0]}">${t[1]} ${t[2]}</button>`).join('')}</div>
      ${body}${vocabMode==='listen'&&(success||(vocabTries[q.vocab_id]?.[vocabMode]?.length||0)>0)?`<p class="ta3-vocab-feedback" role="status" aria-live="polite">${success?'✅ Chính xác! Giỏi lắm!':'🌷 Con thử lại nhé!'}</p>`:''}
      ${nav}<button class="ta3-vocab-return" data-action="back">${isSuper?'← Chọn chủ đề':'← 4 Levels'}</button></section>`;
    if(vocabMode==='listen'&&!success){const version=speechNonce;
      const timer=setTimeout(()=>{mediaTimers.delete(timer);if(active&&view.page==='vocab-study'&&vocabMode==='listen'&&vocabPool[vocabIndex]===q&&speechNonce===version)void speak(q.word,'en-US');},200);mediaTimers.add(timer);
    }
  }
  function vocabReplayChoice(word,q,mode,delay=0){
    if(!word)return;
    if(!delay){void speak(word,'en-US');return;}
    // Delay the first pronunciation until the correctness beep has finished;
    // never let an old word play after a tab/question/module change.
    const version=speechNonce;
    const timer=setTimeout(()=>{
      mediaTimers.delete(timer);
      if(active&&view.page==='vocab-study'&&vocabPool[vocabIndex]===q&&vocabMode===mode&&speechNonce===version)
        void speak(word,'en-US');
    },delay);
    mediaTimers.add(timer);
  }
  function vocabPick(optionIndex){
    if(!['picture','listen'].includes(vocabMode)||view.page!=='vocab-study')return;
    const q=vocabPool[vocabIndex];if(!q)return;
    const opts=vocabOptionPool(q);
    if(!Number.isInteger(optionIndex)||optionIndex<0||optionIndex>=opts.length)return;
    const mode=vocabMode,choice=opts[optionIndex],tries=vocabTries[q.vocab_id]||{},seq=tries[mode]||[];
    // Solved answers and previously tried wrong answers are listening-only.
    // They must never increment attempts or replay correctness beeps.
    if(vocabResolved(q)||seq.includes(optionIndex)){
      vocabReplayChoice(choice.word,q,mode);return;
    }
    seq.push(optionIndex);tries[mode]=seq;vocabTries[q.vocab_id]=tries;
    const correct=normalize(choice.word)===normalize(q.word);
    if(correct){vocabBeep(true);vocabCorrect[q.vocab_id]={...(vocabCorrect[q.vocab_id]||{}),[mode]:true};}
    else vocabBeep(false);
    renderVocabStudy();
    vocabReplayChoice(choice.word,q,mode,correct?240:360);
  }
  async function showFlash(items,request=nonce){
    if(!living(request))return;
    await loadCatalog();if(!living(request))return;
    const item=list(items)[flashIndex];if(!item){errorView(new Error('Không có thẻ từ vựng.'));return;}
    const content=illustration(item,'Hình minh họa từ vựng',false)||`<div class="ta3-emoji">${esc(emojiOf(item)||'📚')}</div>`;
    const show=flashRevealed;
    root.innerHTML=heading('2.1 Flashcards Library',`Thẻ ${flashIndex+1}/${items.length} · chạm Lật thẻ để xem nghĩa`)+ttsBar()+
      `<section class="ta3-paper ta3-flash">${content}<h3>${esc(item.word||item.audio)}</h3><p class="ta3-ipa">${esc(item.ipa||'')}</p>`+
      (show?`<p class="ta3-meaning">${esc(item.vietnamese||item.answer)}</p><p>${esc(item.sentence||'')}</p>`:'<p class="ta3-muted">Tap “Lật thẻ” to see the Vietnamese meaning.</p>')+
      `<div class="ta3-center-actions"><button class="ta3-mini" data-action="flash-listen">🔊 Listen</button><button class="ta3-mini" data-action="flash-flip">🔄 Lật thẻ</button></div>`+
      navbar(flashIndex,items.length,'flash')+'</section>';
  }

  async function lessonHub(request){
    const d=await load('lessons');if(!living(request))return;
    const units=list(d.bai_hoc).filter(x=>Number(x.semester)===selectedLessonSemester);
    root.innerHTML=heading('Bài học · Lessons','20 Unit theo SGK Global Success 3 · Learn / Practice / Review',false)+semesterTabs(selectedLessonSemester,'lesson-sem')+
      grid(units.map((u,i)=>folder(`Unit ${u.bai}. ${u.source_title}`,u.source_title_vi||u.theme,'📖','lesson-open',`data-id="${esc(u.lesson_id)}"`,'Learn · Practice · Review',i)));
  }
  async function lessonOpen(id,index=0){
    if(!needPremium('Bài học'))return;
    const request=++nonce;stopSpeech();loading();
    try{
      const d=await load('lessons'),u=list(d.bai_hoc).find(v=>v.lesson_id===id);if(!living(request))return;
      if(!u)throw new Error('Không có Unit này.');
      lessonPage=Math.max(0,Math.min(Number(index)||0,u.pages.length-1));const page=u.pages[lessonPage];
      await loadCatalog();if(!living(request))return;
      setView('lessons','lesson',{id,title:`Unit ${u.bai}. ${u.source_title}`});
      let content='';
      if(page.page_type==='lesson'){
        const vocab=list(page.vocabulary);
        content=`<p class="ta3-lead">${esc(page.intro||'Look, listen and say.')}</p>`+illustration(page,'Minh họa Unit '+u.bai,true)+
          `<div class="ta3-phonics"><strong>🔤 Phonics</strong><div>${list(page.phonics?.focus).map(f=>`<span><b>${esc(f.spelling)}</b> · ${esc(f.sound)} · ${esc(f.word)}</span>`).join('')||esc(page.phonics?.letter||'')}</div></div>`+
          `<div class="ta3-vocab-grid">${vocab.map((w,i)=>{
            const im=illustration(w,'Minh họa từ '+(i+1));
            return `<article class="ta3-vocab">${im||'<div class="ta3-mini-emoji">📚</div>'}<strong>${esc(w.word)}</strong><small class="ta3-ipa">/${esc(txt(w.ipa).replace(/^\/+|\/+$/g,''))}/</small><span>${esc(w.meaning)}</span><button class="ta3-mini" data-action="word-speak" data-text="${esc(w.audio||w.word)}">🔊 Listen</button></article>`;
          }).join('')}</div>`+
          `<div class="ta3-note"><strong>💬 Sentence pattern</strong><p>${esc(page.sentence_pattern||'')}</p>${list(page.mini_dialogue).map(line=>`<p>${esc(line)}</p>`).join('')}</div>`;
      }else if(page.page_type==='questions'){
        content=`<p class="ta3-lead">${esc(page.recall||'Choose and say.')}</p>`+list(page.items).map((item,i)=>{
          const key=id+'_'+i,selected=lessonAnswers[key],chosen=Number.isInteger(selected)?selected:-1,right=chosen===Number(item.answer);
          return `<article class="ta3-task"><strong>${i+1}. ${esc(item.prompt)}</strong>`+
            (item.type==='choice'?`<div class="ta3-options">${list(item.options).map((option,j)=>`<button class="ta3-choice ${chosen===j?'chosen':''} ${chosen===j&&right?'right':''}" data-action="lesson-answer" data-index="${i}" data-choice="${j}"><b>${String.fromCharCode(65+j)}</b>${esc(option)}</button>`).join('')}</div>`+
              (chosen!==-1?`<p class="${right?'ta3-good':'ta3-warning'}">${right?'✅ Well done!':'🌱 Try again and read the sentence carefully.'}</p>`:''):
              `<button class="ta3-mini" data-action="word-speak" data-text="${esc(item.speak_text||'')}">🔊 Listen & repeat</button><p class="ta3-muted">Speak aloud and practise with a grown-up.</p>`)+`</article>`;
        }).join('');
      }else{
        content=`<h3>🌟 What we learned</h3><ul>${list(page.key_points).map(x=>`<li>${esc(x)}</li>`).join('')}</ul><p class="ta3-note">${esc(page.finish_prompt||'Say the key words and sentence.')}</p>`+
          list(page.practice_lines).map(s=>`<p class="ta3-quote">${esc(s)}</p>`).join('');
      }
      root.innerHTML=heading(`Unit ${u.bai}. ${u.source_title}`,`${u.source_title_vi||''} · Page ${lessonPage+1}/${u.pages.length}`)+ttsBar()+
        `<section class="ta3-paper"><div class="ta3-page-tabs">${u.pages.map((p,i)=>`<button class="ta3-mini ${i===lessonPage?'selected':''}" data-action="lesson-page" data-index="${i}">${esc(p.title||'Page '+(i+1))}</button>`).join('')}</div>`+
        `<div class="ta3-lesson-actions"><button class="ta3-mini" data-action="lesson-listen">🔊 Listen to lesson</button></div>${content}${navbar(lessonPage,u.pages.length,'lesson')}</section>`;
    }catch(err){if(living(request))errorView(err);}
  }
  function lessonListen(){
    load('lessons').then(d=>{
      if(!active||view.page!=='lesson')return;
      const page=list(list(d.bai_hoc).find(u=>u.lesson_id===view.id)?.pages)[lessonPage];if(!page)return;
      const english=page.page_type==='lesson'?[page.intro,...list(page.vocabulary).map(w=>w.word),page.sentence_pattern,...list(page.mini_dialogue)]:
        page.page_type==='questions'?[page.recall,...list(page.items).map(q=>q.prompt||q.speak_text)]:list(page.key_points);
      void speak(english.filter(Boolean).join('. '),'en-US');
    }).catch(()=>toast('Chưa đọc được bài học.'));
  }

  async function exerciseHub(request){
    const d=await load(selectedExerciseSemester===2?'exercise2':'exercise1');if(!living(request))return;
    let warning='Mỗi bài 20 câu; đạt tối thiểu 16/20 câu để mở Unit kế tiếp.';
    if(premium())try{progress=await api('assessmentProgressGet');}catch(_){progress=null;warning='Chưa kết nối tiến độ máy chủ. Không thể mở bài chính thức.';}
    if(!living(request))return;
    const passed=new Set(list(progress?.passedBai).map(Number)),unlocked=progress?Number(progress.unlockedBai):0;
    root.innerHTML=heading('Bài tập · Exercises','20 câu/Unit · chấm điểm và mở khóa do máy chủ quản lý',false)+semesterTabs(selectedExerciseSemester,'exercise-sem')+
      `<p class="ta3-note">🔐 ${esc(warning)}</p>`+(premium()?`<button class="ta3-mini" data-action="history" data-kind="baitap" data-sem="hk${selectedExerciseSemester}">📋 Lịch sử bài tập</button>`:'')+
      grid(list(d.bai_tap).map((u,i)=>{
        const locked=!premium()||!progress||Number(u.bai)>unlocked;
        return folder(`Unit ${u.bai}. ${u.title}`,u.title_vi||u.sgk_unit_title,'📝','exercise-open',`data-id="${esc(u.exercise_id)}" data-sem="${selectedExerciseSemester}"`,passed.has(Number(u.bai))?'✅ Đã đạt':locked?'🔒 Chưa mở':'✏️ 20 câu chính thức',i,locked);
      }));
  }
  async function reviewHub(request){
    const d=await load('review');if(!living(request))return;
    root.innerHTML=heading('Ôn tập · Review','Chọn học kỳ để ôn tập tổng hợp hoặc luyện theo Review trong SGK',false)+
      grid([1,2].map((sem,i)=>{
        const count=list(d.sections?.['section_11.'+sem]).length;
        const reviews=list(d.reviews).filter(r=>Number(r.semester)===sem);
        return folder(`Ôn tập học kỳ ${sem}`,`Units ${sem===1?'1–10':'11–20'} · ${count} câu · ${reviews.length} Review`,sem===1?'🌸':'🌻',
          'review-sem',`data-sem="${sem}"`,'Xem nội dung ôn tập',i);
      }));
  }
  async function reviewSemester(semester){
    const sem=Number(semester);
    if(sem!==1&&sem!==2){toast('Không tìm thấy học kỳ ôn tập.');return;}
    const request=++nonce;clearCurrent();loading();
    try{
      const d=await load('review');if(!living(request))return;
      const questions=list(d.sections?.['section_11.'+sem]);
      const reviews=list(d.reviews).filter(r=>Number(r.semester)===sem);
      if(!questions.length||!reviews.length)throw new Error('Chưa có học liệu ôn tập học kỳ này.');
      setView('review','semester',{semester:sem,title:`Ôn tập học kỳ ${sem}`});
      root.innerHTML=heading(`Ôn tập học kỳ ${sem}`,`Units ${sem===1?'1–10':'11–20'} · ${questions.length} câu theo SGK và SBT`)+
        grid([
          folder('Ôn tập tổng hợp',`${questions.length} câu trong kho · ngẫu nhiên 20 câu mỗi lượt`,'🌟',
            'review-all',`data-sem="${sem}"`,'Bắt đầu ôn tập',0,!premium()),
          ...reviews.map((r,i)=>folder(r.title,r.title_vi||`Units ${list(r.sgk_units).join(', ')}`,'📚',
            'review-open',`data-id="${esc(r.review_id)}"`,`${list(r.questions).length} câu · luyện 20 câu/lượt`,i+1,!premium()))
        ]);
    }catch(err){if(living(request))errorView(err);}
  }
  async function examHub(request){
    const d=await load('exams');if(!living(request))return;
    root.innerHTML=heading('Đề thi · Exams','70 đề học kỳ + 20 đề HSG · 13 câu/đề · chấm trên server',false)+
      '<p class="ta3-note">Năng lực chưa đủ câu phù hợp hiển thị “Chưa đủ dữ liệu”, không quy về 0%.</p>'+
      grid([
        folder('Học kỳ 1','Units 1–10','🌸','exam-group','data-group="hk1"',`${d.semester_1_exams?.length||0} đề`,0,!premium()),
        folder('Học kỳ 2','Units 11–20','🌻','exam-group','data-group="hk2"',`${d.semester_2_exams?.length||0} đề`,1,!premium()),
        folder('Học sinh giỏi','Units 1–20 · chỉ chấm điểm, không đánh giá 6 năng lực','🏆','exam-group','data-group="hsg"',`${d.hsg_exams?.length||0} đề`,2,!premium())
      ]);
  }
  function examsByGroup(d,group){return group==='hk1'?list(d.semester_1_exams):group==='hk2'?list(d.semester_2_exams):list(d.hsg_exams);}
  async function examGroup(group){
    if(!needPremium('Đề thi'))return;
    const request=++nonce;loading();
    try{
      const d=await load('exams');if(!living(request))return;
      const items=examsByGroup(d,group);
      setView('exams','exam-group',{title:'Đề thi '+group,group});
      root.innerHTML=heading(group==='hsg'?'Đề Học sinh giỏi':`Đề thi ${group.toUpperCase()}`,`${items.length} đề · chạm để bắt đầu`)+
        `<button class="ta3-mini" data-action="history" data-kind="baithi" data-sem="${group}">📋 Lịch sử đề thi</button>`+
        grid(items.map((u,i)=>folder(u.exam_name,`${u.questions?.length||0} câu · ${u.total_points||10} điểm`,'📄','exam-open',`data-id="${esc(u.exam_id)}" data-sem="${group}"`,'Bắt đầu làm đề',i)));
    }catch(err){if(living(request))errorView(err);}
  }
  async function history(kind,semester){
    if(!needPremium('Lịch sử học tập'))return;
    const request=++nonce;loading();
    try{
      const d=await api('assessmentHistoryGet',{kind,semester});if(!living(request))return;
      setView(kind==='baitap'?'exercises':'exams','history',{title:'Lịch sử học tập',kind,semester});
      const items=list(d.history).slice(0,100);
      root.innerHTML=heading('📋 Lịch sử chính thức',`${items.length} lượt gần nhất · chỉ dữ liệu tài khoản hiện tại`)+
        (items.length?`<div class="ta3-history">${items.map(r=>`<article><strong>${esc(r.BaiId||r.DeId||'Bài làm')}</strong> · ${esc(r.HoTen||'')}<p>Đúng ${esc(r.SoCauDung||0)}/${esc(r.TongCauHoi||0)} · ${esc(kind==='baitap'?(r.PhanTram||0)+'%':(r.DiemSo||0)+'/'+(r.TongDiem||10)+' điểm')}</p></article>`).join('')}</div>`:'<p class="ta3-note">Chưa có lượt làm bài chính thức nào.</p>');
    }catch(err){if(living(request))errorView(err);}
  }

  function normalizeExplore(q){
    return {id:txt(q.question_id||q.id),prompt:txt(q.question_text||q.question||''),promptVi:txt(q.question_text_vi||''),
      options:list(q.options).map(txt),answer:txt(q.answer),accepted:list(q.accepted_answers),type:txt(q.type||'multiple_choice'),
      tokens:list(q.tokens),hint:txt(q.hint||q.hint_vi||''),explanation:txt(q.explanation||''),
      image_id:q.image_id||q.visual_ref?.image_id,image_url:q.image_url||q.visual_ref?.image_url,visual_ref:q.visual_ref,emoji:emojiOf(q),
      audio:txt(q.audio_text||q.audio||q.tts_text||''),audioOnly:!!q.audio_only,ipa:txt(q.ipa||''),skill:txt(q.skill_tag||q.tag||''),points:1,
      phonicsKind:txt(q.phonics_kind||''),letterTarget:txt(q.letter_target||''),
      optionLetters:list(q.option_letters).map(txt),optionsIpa:list(q.options_ipa).map(txt),
      sequenceLetters:list(q.sequence_letters),answerIpa:txt(q.answer_ipa||''),
      soundWord:txt(q.sound_word||''),soundName:txt(q.sound_name||''),
      unit:Number(q.unit_anchor||0),unitTitle:txt(q.unit_title||''),level:Number(q.level||0),
      readingPassage:txt(q.reading_passage||''),readingPassageVi:txt(q.reading_passage_vi||''),
      meaningVi:txt(q.meaning_vi||''),pictureClue:txt(q.picture_clue||''),completedSentence:txt(q.completed_sentence||''),
      completedSentenceVi:txt(q.completed_sentence_vi||''),
      answerVi:txt(q.answer_vi||(txt(q.explanation).includes(' · ')?txt(q.explanation).split(' · ').slice(-1)[0]:''))};
  }
  function normalizeExercise(q){
    return {id:txt(q.question_id),prompt:txt(q.question_text),promptVi:txt(q.question_text_vi||''),
      options:list(q.options).map(txt),answer:txt(q.answer),accepted:list(q.accepted_answers),type:txt(q.question_type||'choice'),tokens:list(q.tokens),
      hint:txt(q.hint||q.hint_vi||''),explanation:txt(q.explanation||''),image_id:q.image_id,image_url:q.image_url,
      visual_ref:q.visual_ref,emoji:emojiOf(q),audio:txt(q.tts_text||''),audioOnly:!!q.audio_only,skill:txt(q.skill_tag||''),points:1};
  }
  function normalizeExam(q){
    return {id:txt(q.question_id),prompt:txt(q.question_text||q.question||''),promptVi:txt(q.question_text_vi||''),
      options:list(q.options).map(txt),answer:txt(q.answer),accepted:[],type:txt(q.question_type||'choice'),tokens:list(q.tokens),
      hint:'',explanation:txt(q.explanation||''),image_id:q.image_id,image_url:q.image_url,
      visual_ref:q.visual_ref,emoji:emojiOf(q),audio:txt(q.audio||q.tts_text||''),audioOnly:!!q.audio_only,
      skill:txt(q.skill_tag||q.competency||''),points:Number(q.points??q.score??0)};
  }
  // Class-2 M6-M9 interaction patterns adapted for Class-3 Global Success 20 Units.
  // No Class-2 runtime, account, backend, token or remote asset is used here.
  const TA2_LEVEL_GUIDES=Object.freeze({
    6:'Read the passage and answer the two questions.',
    7:'Tap the words in the correct order to make a sentence.',
    8:'Choose the correct word to complete the sentence.',
    9:'Choose the best reply.'
  });
  function makeReadingPairs(items){
    const groups=new Map();
    for(const q of items){
      const key=`${q.unit}\u0000${q.readingPassage}`;
      if(!q.unit||!q.readingPassage||!q.id||q.options.length!==4)throw new Error('Reading question is incomplete.');
      if(!groups.has(key))groups.set(key,[]);
      groups.get(key).push(q);
    }
    const pairs=[];
    for(const group of groups.values()){
      if(group.length%2!==0)throw new Error('Each reading passage must have an even number of questions. Please update Part 2 JSON.');
      for(let i=0;i<group.length;i+=2){
        const a=group[i],b=group[i+1];
        pairs.push({id:`${a.id}__${b.id}`,type:'reading_pair',unit:a.unit,unitTitle:a.unitTitle,
          readingPassage:a.readingPassage,readingPassageVi:a.readingPassageVi,questions:[a,b]});
      }
    }
    if(pairs.length*2!==items.length)throw new Error('Reading pairs do not match the question count.');
    return pairs;
  }
  const sgkSolved=q=>!!quiz?.sgkSolved?.has(q?.id);
  function sgkScore(){
    if(!quiz?.sgkLevel)return;
    const wrong=Object.values(quiz.sgkWrong).reduce((n,items)=>n+items.size,0);
    ctx?.hooks?.setScore?.(quiz.sgkSolved.size,wrong);
  }
  function sgkMark(q,correct,attempt){
    if(!quiz||sgkSolved(q))return false;
    const fresh=!quiz.sgkRecorded.has(q.id);
    if(fresh){quiz.sgkRecorded.add(q.id);queueObservation(q,correct,'practice');}
    if(correct){
      quiz.sgkSolved.add(q.id);quiz.answers[q.id]=q.answer;
      delete quiz.sgkLastMiss[q.id];
      playTA2Feedback(true);
    }else{
      const errors=quiz.sgkWrong[q.id]||(quiz.sgkWrong[q.id]=new Set());
      if(errors.has(attempt))return false;
      errors.add(attempt);quiz.sgkLastMiss[q.id]=attempt;
      playTA2Feedback(false);
    }
    sgkScore();
    return true;
  }
  function sgkScheduleVoice(text,delay=190){
    const currentQuiz=quiz,currentQuestion=currentQuiz?.questions?.[currentQuiz.index];
    const value=txt(text);if(!value||!currentQuestion)return;
    const timer=setTimeout(()=>{
      mediaTimers.delete(timer);
      if(active&&quiz===currentQuiz&&view.page==='quiz'&&quiz.questions[quiz.index]===currentQuestion){
        void speak(value,'en-US');
      }
    },delay);mediaTimers.add(timer);
  }
  function sgkOption(q,answer,index,action='sgk-pick',attrs=''){
    const complete=sgkSolved(q);
    const correct=complete&&isCorrect(q,answer);
    const isWrong=!complete&&!!quiz.sgkWrong[q.id]?.has('choice:'+index);
    const buttonClass=correct?' is-correct':isWrong?' is-wrong':'';
    return `<button type="button" class="ta3-l2-option${buttonClass}" data-action="${action}" data-index="${index}" ${attrs} ${isWrong?'disabled':''}>
      <span class="ta3-l2-option-label">${String.fromCharCode(65+index)}.</span><span>${esc(answer)}</span></button>`;
  }
  function sgkReadingDialog(text){
    const lines=txt(text).split('\n').map(s=>s.trim()).filter(Boolean);
    const labeled=lines.filter(s=>/^[\p{L}][\p{L} .'-]{0,30}:\s/u.test(s));
    if(labeled.length>0&&labeled.length===lines.length){
      return lines.map((line,i)=>{
        const pos=line.indexOf(':');return `<div class="ta3-l2-dialog-line"><b class="ta3-l2-speaker" data-tone="${i%2}">${esc(line.slice(0,pos))}</b><span>${esc(line.slice(pos+1).trim())}</span></div>`;
      }).join('');
    }
    return `<p class="ta3-l2-passage-text">${esc(text)}</p>`;
  }
  function renderSgkReading(pair){
    const solved=pair.questions.every(sgkSolved);
    return `<div class="ta3-l2-reading-grid">
      <article class="ta3-l2-reading-passage">
        <div class="ta3-l2-reading-actions"><b>📖 Read the passage</b>
          <button type="button" data-action="sgk-listen-passage">🔊 Listen Passage</button></div>
        <div class="ta3-l2-passage-body">${sgkReadingDialog(pair.readingPassage)}</div>
        ${solved&&pair.readingPassageVi?`<div class="ta3-l2-reading-translation"><strong>🇻🇳 Vietnamese meaning</strong>
          <p>${esc(pair.readingPassageVi)}</p></div>`:''}
      </article>
      <div class="ta3-l2-reading-questions">${pair.questions.map((q,qi)=>{
        const finished=sgkSolved(q);return `<article class="ta3-l2-reading-question">
          <div class="ta3-l2-question-title"><span>${qi+1}</span><h3>${esc(q.prompt)}</h3></div>
          <div class="ta3-l2-choice-grid">${q.options.map((answer,i)=>sgkOption(q,answer,i,'sgk-reading-answer',`data-question="${qi}"`)).join('')}</div>
          ${finished?'<p class="ta3-l2-success">✓ Correct! Well done.</p>':''}
          ${!finished&&quiz.sgkLastMiss[q.id]!=null?'<p class="ta3-l2-retry">Try again! Read the passage for a clue.</p>':''}
        </article>`;
      }).join('')}</div>
    </div>${solved?'<p class="ta3-l2-all-done">🌟 Excellent! Both answers are correct.</p>':''}`;
  }
  function sgkSentenceTokens(q){
    let s=quiz.tiles[q.id];
    if(!s){
      const tokens=txt(q.answer).trim().split(/\s+/).filter(Boolean).map((text,id)=>({id,text}));
      if(tokens.length<2||tokens.length>32)throw new Error('This sentence has an invalid word list.');
      let deck=shuffle(tokens);
      if(tokens.length>2&&deck.every((x,i)=>x.id===i)){[deck[0],deck[1]]=[deck[1],deck[0]];}
      s=quiz.tiles[q.id]={tokens,deck,chosen:[]};
    }
    return s;
  }
  function renderSgkSentence(q){
    const s=sgkSentenceTokens(q),finished=sgkSolved(q);
    const selected=finished?s.tokens.map(x=>x.id):s.chosen;
    const used=new Set(selected);
    const built=selected.length?selected.map(id=>{
      const token=s.tokens[id];return `<button type="button" class="ta3-l2-word is-selected${finished?' is-correct':''}" data-action="sgk-word-undo" data-index="${id}" ${finished?'disabled':''}>${esc(token.text)}</button>`;
    }).join(''):'<span class="ta3-l2-placeholder">Tap the words below to build the sentence…</span>';
    const available=s.deck.filter(t=>!used.has(t.id));
    return `<div class="ta3-l2-building">
      <div class="ta3-l2-assembled" aria-label="Your sentence">${built}</div>
      <div class="ta3-l2-word-feedback" role="status">${finished?'✓ Excellent! The sentence is correct.':quiz.sgkLastMiss[q.id]?'Try another word.':''}</div>
      ${finished?`<div class="ta3-l2-solved-sentence"><strong>${esc(q.answer)}</strong>
        <button data-action="sgk-listen-complete" type="button">🔊 Listen</button></div>`:''}
      ${!finished?`<div class="ta3-l2-word-bank" aria-label="Choose a word in order">
        ${available.map(t=>`<button type="button" class="ta3-l2-word" data-action="sgk-word-pick" data-index="${t.id}">${esc(t.text)}</button>`).join('')}</div>`:''}
      ${finished&&q.meaningVi?`<p class="ta3-l2-meaning"><b>Meaning:</b> ${esc(q.meaningVi)}</p>`:''}
    </div>`;
  }
  function sgkCompletedSentence(q){
    return txt(q.completedSentence||q.prompt.replace(/^Complete the sentence:\s*/i,'')).replace(/_{2,}/,q.answer);
  }
  function renderSgkFillSentence(q){
    const done=sgkSolved(q);
    const body=txt(q.prompt).replace(/^Complete the sentence:\s*/i,'');
    const completed=done?sgkCompletedSentence(q):body;
    let content=esc(completed);
    if(done){const pos=completed.toLocaleLowerCase('en-US').indexOf(q.answer.toLocaleLowerCase('en-US'));
      if(pos>=0)content=esc(completed.slice(0,pos))+`<strong class="ta3-l2-inserted">${esc(completed.slice(pos,pos+q.answer.length))}</strong>`+esc(completed.slice(pos+q.answer.length));
    }else content=content.replace(/_{2,}/g,'<span class="ta3-l2-gap">_____</span>');
    // A pictorial/emoji clue can give away the correct choice. Show only
    // the English context hint; preserve it so the question is answerable.
    const clue=q.pictureClue?`<p class="ta3-l2-context-clue">${esc(q.pictureClue)}</p>`:'';
    return `<div class="ta3-l2-fill">
      <div class="ta3-l2-sentence-card">${clue}<h3>${content}</h3>
        ${done?'<button type="button" data-action="sgk-listen-complete">🔊 Listen</button>':''}
        ${done&&q.completedSentenceVi?`<p class="ta3-l2-meaning">${esc(q.completedSentenceVi)}</p>`:''}</div>
      <div class="ta3-l2-fill-choices">${q.options.map((opt,i)=>{
        const correct=done&&isCorrect(q,opt),wrong=quiz.sgkWrong[q.id]?.has('choice:'+i);
        return `<button type="button" data-action="sgk-pick" data-index="${i}" class="ta3-l2-fill-choice${correct?' is-correct':wrong?' is-wrong':''}" ${wrong&&!done?'disabled':''}>
          <b>${String.fromCharCode(65+i)}.</b><span>${esc(opt)}</span></button>`;
      }).join('')}</div>
      ${done&&q.answerVi?`<p class="ta3-l2-meaning"><b>${esc(q.answer)}</b> — ${esc(q.answerVi)}</p>`:''}
      ${!done&&quiz.sgkLastMiss[q.id]!=null?'<p class="ta3-l2-retry">Try another word.</p>':''}
    </div>`;
  }
  function renderSgkDialogue(q){
    const done=sgkSolved(q);
    const situation=txt(q.prompt).replace(/^Choose the best reply:\s*/i,'').trim();
    return `<div class="ta3-l2-conversation">
      <div class="ta3-l2-situation"><span aria-hidden="true">💬</span><p>${esc(situation)}</p>
        <button type="button" data-action="sgk-listen-question">🔊 Listen</button></div>
      <div class="ta3-l2-choice-grid">${q.options.map((ans,i)=>sgkOption(q,ans,i)).join('')}</div>
      ${done?`<div class="ta3-l2-dialogue-success"><strong>✓ Excellent! That's the correct reply.</strong>
        <p>${esc(q.answer)}</p><button data-action="sgk-listen-complete">🔊 Listen</button>
        ${q.answerVi?`<small>${esc(q.answerVi)}</small>`:''}</div>`:''}
      ${!done&&quiz.sgkLastMiss[q.id]!=null?'<p class="ta3-l2-retry">Think about the conversation. Try again!</p>':''}
    </div>`;
  }
  function sgkReadIntro(q){
    const group=quiz?.sgkTopic;
    return group===9?txt(q.audio||q.prompt).replace(/^Choose the best reply:\s*/i,'') : TA2_LEVEL_GUIDES[group];
  }
  function renderClass2Explore(){
    if(!quiz||!quiz.sgkLevel)return;
    ++nonce;
    const q=quiz.questions[quiz.index];
    if(!q)return;
    const topic=quiz.sgkTopic,reading=topic===6,complete=reading?q.questions.every(sgkSolved):sgkSolved(q),
      instruction=TA2_LEVEL_GUIDES[topic],unit=Number(q.unit)||0,
      isLast=quiz.index===quiz.questions.length-1;
    const title=reading?'Reading Comprehension':topic===7?'Sentence Builder':topic===8?'Fill Sentence':'Q&A Dialogues';
    let workspace='';
    if(topic===6)workspace=renderSgkReading(q);
    else if(topic===7)workspace=renderSgkSentence(q);
    else if(topic===8)workspace=renderSgkFillSentence(q);
    else workspace=renderSgkDialogue(q);
    root.innerHTML=`<section class="ta3-l2-screen ta3-l2-topic-${topic}">
      <header class="ta3-l2-header"><div class="ta3-l2-subtitle">Unit ${unit} · ${esc(q.unitTitle)}</div>
        <h2>${esc(instruction)} <button type="button" data-action="sgk-instruction" aria-label="Listen to the instruction">🔊 Listen</button></h2>
      </header>${workspace}
      <nav class="ta3-l2-navigation" aria-label="Practice navigation">
        <button type="button" data-action="sgk-prev" ${quiz.index===0?'disabled':''}>← Previous</button>
        <span>${quiz.index+1} / ${quiz.questions.length}${reading?' passages':''}</span>
        <button type="button" class="is-primary" data-action="sgk-next" ${reading&&!complete?'disabled':''}>${isLast?'Finish':'Next →'}</button>
      </nav>
    </section>`;
    if(quiz.sgkLastRead!==quiz.index){
      quiz.sgkLastRead=quiz.index;
      sgkScheduleVoice(sgkReadIntro(q),250);
    }
  }
  function handleSgkReadingPick(questionIndex,optionIndex){
    const pair=quiz?.questions?.[quiz.index],q=pair?.questions?.[questionIndex];
    if(!q||!Number.isInteger(optionIndex)||optionIndex<0||optionIndex>=q.options.length)return;
    if(sgkSolved(q)){sgkScheduleVoice(q.options[optionIndex],0);return;}
    const changed=sgkMark(q,isCorrect(q,q.options[optionIndex]),'choice:'+optionIndex);
    if(changed)renderClass2Explore();
  }
  function handleSgkChoice(index){
    const q=quiz?.questions?.[quiz.index];if(!q||!Number.isInteger(index)||index<0||index>=q.options.length)return;
    const opt=q.options[index];
    if(sgkSolved(q)){sgkScheduleVoice(opt,0);return;}
    const changed=sgkMark(q,isCorrect(q,opt),'choice:'+index);
    if(changed){renderClass2Explore();
      if(quiz.sgkTopic===8&&sgkSolved(q))sgkScheduleVoice(sgkCompletedSentence(q),240);
      else if(quiz.sgkTopic===9&&sgkSolved(q))sgkScheduleVoice(q.answer,240);
      else if(quiz.sgkTopic===8&&!sgkSolved(q))sgkScheduleVoice(opt,150);
    }
  }
  function handleSgkWordPick(index){
    const q=quiz?.questions?.[quiz.index];if(!q||sgkSolved(q))return;
    const s=sgkSentenceTokens(q),chosen=s.chosen;
    if(!Number.isInteger(index)||index<0||index>=s.tokens.length||chosen.includes(index))return;
    if(index!==chosen.length){
      const wrong=sgkMark(q,false,'word:'+chosen.length+':'+index);
      if(wrong)renderClass2Explore();return;
    }
    chosen.push(index);delete quiz.sgkLastMiss[q.id];
    if(chosen.length===s.tokens.length){
      sgkMark(q,true,'built');renderClass2Explore();sgkScheduleVoice(q.answer,300);
    }else renderClass2Explore();
  }
  function handleSgkWordUndo(index){
    const q=quiz?.questions?.[quiz.index];if(!q||sgkSolved(q))return;
    const s=sgkSentenceTokens(q),pos=s.chosen.indexOf(index);
    if(pos>=0)s.chosen.splice(pos); // Remove the selected suffix to preserve a valid prefix.
    delete quiz.sgkLastMiss[q.id];renderClass2Explore();
  }
  function sgkNavigate(direction){
    if(!quiz||!quiz.sgkLevel)return;
    const q=quiz.questions[quiz.index];
    if(direction>0&&quiz.sgkTopic===6&&!q.questions.every(sgkSolved))return;
    if(direction>0&&quiz.index>=quiz.questions.length-1){endPractice();return;}
    const next=Math.max(0,Math.min(quiz.questions.length-1,quiz.index+direction));
    if(next===quiz.index)return;
    stopSpeech();quiz.index=next;renderClass2Explore();
  }

  function startPractice(qs,tab,title,extra={}){
    clearCurrent();
    const fullAlphabetIpa=extra.section==='section_1.3'||extra.section==='section_1.4';
    const isSgkLevel=tab==='discover'&&sgkLeveledSection(extra.section);
    const isGrammar=tab==='discover'&&extra.grammar===true;
    const sgkTopic=Number(txt(extra.section).match(/^section_(\d+)\./)?.[1])||0;
    const items=isGrammar?shuffleGrammarQuestions(qs):isSgkLevel&&sgkTopic===6?shuffle(makeReadingPairs(qs)):(fullAlphabetIpa||isSgkLevel)?shuffle(qs):shuffle(qs).slice(0,20);
    if(!items.length){errorView(new Error('Ngân hàng câu hỏi của mục này đang trống.'));return;}
    quiz={mode:'practice',tab,title,questions:items,answers:Object.create(null),index:0,tiles:Object.create(null),submitting:false,extra,
      phonicsLast:Object.create(null),phonicsAttempts:Object.create(null),phonicsWrong:Object.create(null),phonicsRenderedIndex:-1,
      sgkLevel:isSgkLevel,sgkTopic,sgkTotal:isSgkLevel?qs.length:items.length,
      sgkSolved:new Set(),sgkWrong:Object.create(null),sgkLastMiss:Object.create(null),sgkRecorded:new Set(),sgkLastRead:-1,
      grammarMode:isGrammar,grammarDetails:extra.grammarDetails||null,grammarShowRule:true,grammarSolved:new Set(),
      grammarWrong:Object.create(null),grammarRecorded:new Set(),grammarLastIndex:-1};
    setView(tab,'quiz',{title,section:extra.section,group:extra.group,semester:extra.semester});void showQuiz();
  }
  async function openReview(id){
    if(!needPremium('Ôn tập'))return;
    const request=++nonce;loading();
    try{const d=await load('review'),r=list(d.reviews).find(v=>v.review_id===id);if(!living(request))return;
      if(!r)throw new Error('Không có bài ôn tập.');
      startPractice(list(r.questions).map(normalizeExercise),'review',r.title,{semester:Number(r.semester)});
    }catch(err){if(living(request))errorView(err);}
  }
  async function openSemesterReview(semester){
    if(!needPremium('Ôn tập'))return;
    const sem=Number(semester);
    if(sem!==1&&sem!==2){toast('Không tìm thấy học kỳ ôn tập.');return;}
    const request=++nonce;loading();
    try{
      const d=await load('review');if(!living(request))return;
      const questions=list(d.sections?.['section_11.'+sem]);
      if(!questions.length)throw new Error('Chưa có câu hỏi ôn tập học kỳ này.');
      startPractice(questions.map(normalizeExercise),'review',`Ôn tập tổng hợp học kỳ ${sem}`,{semester:sem});
    }catch(err){if(living(request))errorView(err);}
  }
  async function startOfficial(kind,semester,contentId){
    if(!needPremium(kind==='baitap'?'Bài tập':'Đề thi'))return;
    const request=++nonce;clearCurrent();loading();
    try{
      let entry,items,title;
      if(kind==='baitap'){
        const d=await load(semester==='hk2'?'exercise2':'exercise1');if(!living(request))return;
        entry=list(d.bai_tap).find(u=>u.exercise_id===contentId);
        if(!entry)throw new Error('Không có bài tập này.');
        items=list(entry.questions).map(normalizeExercise);title=`Unit ${entry.bai}. ${entry.title}`;
      }else{
        const d=await load('exams');if(!living(request))return;
        entry=examsByGroup(d,semester).find(e=>e.exam_id===contentId);
        if(!entry)throw new Error('Không có đề thi này.');
        items=list(entry.questions).map(normalizeExam);title=entry.exam_name;
      }
      if(items.length!==(kind==='baitap'?20:13))throw new Error('Số câu hỏi chưa hợp lệ.');
      const ticket=await api('assessmentAttemptStart',{kind,semester,contentId});if(!living(request))return;
      const byId=new Map(items.map(q=>[q.id,q]));
      const ordered=list(ticket.questionIds).map(id=>byId.get(txt(id)));
      if(ordered.length!==items.length||ordered.some(q=>!q))throw new Error('Bản học liệu khác với máy chủ. Hãy cập nhật trang.');
      const duration=kind==='baithi'?Math.max(60,Number(ticket.timeLimitSeconds)||2400)*1000:0;
      quiz={mode:'official',kind,semester,contentId,attemptId:txt(ticket.attemptId),tab:kind==='baitap'?'exercises':'exams',
        title,questions:ordered,answers:Object.create(null),tiles:Object.create(null),index:0,submitting:false,
        deadline:duration?Date.now()+duration:0};
      setView(quiz.tab,'quiz',{title});void showQuiz();if(duration)startClock();
    }catch(err){if(living(request)){errorView(err);toast('Chưa bắt đầu được bài chính thức.');}}
  }
  function startClock(){
    stopClock();examTicker=setInterval(()=>{
      if(!active||!quiz||!quiz.deadline||quiz.mode!=='official'){stopClock();return;}
      const left=Math.max(0,Math.ceil((quiz.deadline-Date.now())/1000));
      const e=$('[data-exam-clock]');if(e)e.textContent=`⏱️ ${String(Math.floor(left/60)).padStart(2,'0')}:${String(left%60).padStart(2,'0')}`;
      if(!left){stopClock();void submitOfficial();}
    },500);
  }
  function isCorrect(q,value){return [q.answer,...q.accepted].some(a=>normalize(a)===normalize(value));}
  function renderInteraction(q,chosen,official){
    if(q.options.length){
      const showFeedback=!official&&chosen!==undefined;
      return `<div class="ta3-options">${q.options.map((option,i)=>{
        const picked=chosen===option,right=picked&&showFeedback&&isCorrect(q,option);
        return `<button class="ta3-choice${picked?' chosen':''}${right?' right':''}${picked&&showFeedback&&!right?' wrong':''}" data-action="choose" data-index="${i}" ${official&&quiz?.submitting?'disabled':''}><b>${String.fromCharCode(65+i)}</b><span>${esc(option)}</span></button>`;
      }).join('')}</div>`;
    }
    if(q.type==='reorder_words'&&q.tokens.length){
      if(!quiz.tiles[q.id])quiz.tiles[q.id]={deck:shuffle(q.tokens.map((t,i)=>({text:txt(t),id:i}))),chosen:[]};
      const value=quiz.tiles[q.id];
      return `<div class="ta3-reorder"><strong>Tap the word cards in order:</strong><div class="ta3-reorder-selected">${value.chosen.map(v=>`<span>${esc(v.text)}</span>`).join('')||'<em>Tap a word below</em>'}</div>`+
        `<div class="ta3-reorder-deck">${value.deck.filter(w=>!value.chosen.some(x=>x.id===w.id)).map(w=>`<button data-action="reorder-pick" data-token="${w.id}">${esc(w.text)}</button>`).join('')}</div>`+
        `<button class="ta3-mini" data-action="reorder-undo">↶ Undo</button><button class="ta3-mini" data-action="reorder-reset">🔄 Reset</button></div>`;
    }
    return `<div class="ta3-typed"><label for="ta3-answer-input">Write your answer:</label><input id="ta3-answer-input" data-answer-input="1" type="text" maxlength="160" autocomplete="off" spellcheck="false" value="${esc(chosen||'')}" ${official&&quiz?.submitting?'disabled':''}><span class="ta3-muted">Type the whole word or sentence.</span></div>`;
  }

  function playTA2Feedback(correct){
    try{
      const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;
      if(!phonicsFeedbackAudio)phonicsFeedbackAudio=new AC();
      if(phonicsFeedbackAudio.state==='suspended')void phonicsFeedbackAudio.resume();
      const now=phonicsFeedbackAudio.currentTime;
      const osc=phonicsFeedbackAudio.createOscillator(),gain=phonicsFeedbackAudio.createGain();
      osc.connect(gain);gain.connect(phonicsFeedbackAudio.destination);
      if(correct){osc.type='triangle';osc.frequency.setValueAtTime(523.25,now);
        osc.frequency.exponentialRampToValueAtTime(783.99,now+.12);
        osc.frequency.exponentialRampToValueAtTime(1046.5,now+.25);
        gain.gain.setValueAtTime(.3,now);gain.gain.linearRampToValueAtTime(.01,now+.35);
        osc.start(now);osc.stop(now+.35);
      }else{osc.type='square';osc.frequency.setValueAtTime(300,now);
        gain.gain.setValueAtTime(.001,now);gain.gain.linearRampToValueAtTime(.22,now+.01);
        gain.gain.setValueAtTime(.22,now+.09);gain.gain.linearRampToValueAtTime(.001,now+.10);
        gain.gain.setValueAtTime(.001,now+.14);gain.gain.linearRampToValueAtTime(.22,now+.15);
        gain.gain.setValueAtTime(.22,now+.23);gain.gain.linearRampToValueAtTime(.001,now+.24);
        osc.start(now);osc.stop(now+.25);
      }
    }catch(_){}
  }
  const phonicLetterIpa=letter=>{
    const t=txt(letter).toUpperCase();
    const row=phonicsLearnSection==='section_1.1'?phonicsLearnItems.find(x=>x.letter===t):null;
    return t==='Z'?'/zi\u02D0/':txt(row?.ipaName||letterIpaReference.get(t));
  };
  const letterIpaReference=new Map();
  function renderTA2Practice(){
    if(!quiz)return;
    const q=quiz.questions[quiz.index],kind=q.phonicsKind;
    if(!['letter_listen','letter_name_ipa','letter_sequence','ipa_sound'].includes(kind))return;
    ++nonce;
    const solved=Object.prototype.hasOwnProperty.call(quiz.answers,q.id);
    const selected=quiz.phonicsLast[q.id];
    const wrongs=quiz.phonicsWrong?.[q.id]||[];
    const letterName=kind==='letter_name_ipa',seq=kind==='letter_sequence',listen=kind==='letter_listen';
    const isAlphabet=kind!=='ipa_sound';
    const modes={letter_listen:'\uD83C\uDFA7 Nghe v\u00E0 ch\u1ECDn ch\u1EEF c\u00E1i',letter_name_ipa:'\uD83D\uDD20 Ch\u1ECDn phi\u00EAn \u00E2m t\u00EAn ch\u1EEF',letter_sequence:'\uD83E\uDDE9 \u0110i\u1EC1n ch\u1EEF c\u00F2n thi\u1EBFu',ipa_sound:'\uD83D\uDD0A IPA Practice'};
    const target=letterName?`<div class="ta3-ta2-target-wrap"><div class="ta3-ta2-target-letter">${esc(q.letterTarget)}</div>
      ${solved?`<span class="ta3-ta2-target-ipa">${esc(q.answer)}</span>`:''}</div>`:'';
    const sequence=seq?`<div class="ta3-ta2-sequence" aria-label="Alphabet sequence">${q.sequenceLetters.map(v=>`<span class="${v==null?'ta3-ta2-sequence-missing':''} ${v==null&&solved?'is-solved':''}">${v==null?(solved?esc(q.answer):'?'):esc(v)}</span>`).join('')}</div>`:'';
    const prompt=`<div class="ta3-ta2-practice-prompt${listen?' is-listening':''}">
      ${listen?'<div class="ta3-ta2-listen-emoji">\uD83C\uDFA7 \uD83D\uDC42 \uD83D\uDD22</div>':''}
      <h3>${esc(q.prompt)}</h3>${q.promptVi?`<p>${esc(q.promptVi)}</p>`:''}
      ${letterName?'':`<button data-action="phonics-listen" class="ta3-ta2-practice-listen">\uD83D\uDD0A Listen</button>`}
    </div>`;
    const choices=q.options.map((option,i)=>{
      const correct=solved&&isCorrect(q,option),wrong=wrongs.includes(i);
      const colored=correct?' is-correct':wrong?' is-wrong':'';
      let label=esc(option);
      if(seq)label=`<span class="ta3-ta2-sequence-choice"><strong>${esc(option)}</strong><span>${esc(q.optionsIpa[i]||'')}</span></span>`;
      if(letterName&&solved){const letter=txt(q.optionLetters[i]);if(/^[A-Z]$/.test(letter))label=`<span class="ta3-ta2-ipa-answer">${esc(option)}</span><span class="ta3-ta2-revealed-letter">${esc(letter)} \uD83D\uDD0A</span>`;}
      if(listen&&correct)label=`${esc(option)}<span class="ta3-ta2-correct-ipa">${esc(q.answerIpa||phonicLetterIpa(option))}</span>`;
      const disabled=(!seq&&wrong&&!solved);
      return `<button class="ta3-ta2-practice-choice${colored}" type="button" data-action="phonics-choose" data-index="${i}" ${disabled?'disabled':''} aria-label="Option ${String.fromCharCode(65+i)}">
        <span class="ta3-ta2-choice-label">${String.fromCharCode(65+i)}.</span><span class="ta3-ta2-choice-main">${label}</span>
      </button>`;
    }).join('');
    const count=Object.keys(quiz.answers).length;
    const feedback=selected?`<div class="ta3-ta2-feedback ${selected.correct?'success':'retry'}" role="status">${selected.correct?'\u2705 Great job!':'\uD83C\uDF31 Try again!'}</div>`:'';
    root.innerHTML=`<div class="ta3-ta2-practice-screen">
      <div class="ta3-ta2-practice-head"><span>${esc(modes[kind])}</span><span>${quiz.index+1} / ${quiz.questions.length}</span></div>
      ${letterName?target:''}${seq?sequence:''}${prompt}
      <div class="ta3-ta2-practice-options">${choices}</div>
      ${feedback}${letterName&&solved?'<p class="ta3-ta2-replay-hint">Con ch\u1EA1m t\u1EEBng \u0111\u00E1p \u00E1n \u0111\u1EC3 nghe v\u00E0 ghi nh\u1EDB c\u1EA3 4 ch\u1EEF nh\u00E9!</p>':''}
      <nav class="ta3-ta2-practice-nav"><button data-action="question-prev" ${quiz.index===0?'disabled':''}>\u2039 Previous</button><span>C\u00E2u ${quiz.index+1} / ${quiz.questions.length}</span>
        <button class="ta3-ta2-practice-next" data-action="question-next" ${quiz.index===quiz.questions.length-1?'disabled':''}>Next \u203A</button></nav>
      <div class="ta3-ta2-practice-footer"><span>${count} / ${quiz.questions.length} c\u00E2u \u0111\u00E3 l\u00E0m</span><button data-action="submit">K\u1EBFt th\u00FAc luy\u1EC7n t\u1EADp</button></div>
      <button class="ta3-ta2-return" data-action="back">\u2190 1. Alphabet & IPA</button>
    </div>`;
    if(quiz.phonicsRenderedIndex!==quiz.index){
      quiz.phonicsRenderedIndex=quiz.index;
      const audioTarget=listen||kind==='ipa_sound'?txt(q.audio):'';
      const instruction=txt(q.prompt);
      const say=audioTarget?(instruction+'. '+audioTarget):instruction;
      if(say)void speak(say,'en-US');
    }
  }
  function soundForIPA(ipa,q){
    // Never pass an IPA symbol itself as English orthographic text to TTS.
    const v=txt(ipa);const map=ipaPracticeSounds.get(v);
    return map||txt(q?.soundWord)||'';
  }
  const ipaPracticeSounds=new Map();
  function scheduleTA2Sound(text,delay=0){
    const q=quiz?.questions?.[quiz.index],quizRef=quiz;
    if(!q||!text)return;
    if(!delay){void speak(text,'en-US');return;}
    const id=setTimeout(()=>{
      mediaTimers.delete(id);
      if(active&&quiz===quizRef&&quiz.questions[quiz.index]===q&&view.page==='quiz')void speak(text,'en-US');
    },delay);
    mediaTimers.add(id);
  }
  function answerPhonicsQuestion(index){
    if(!quiz||quiz.submitting)return;
    const q=quiz.questions[quiz.index];if(!q||!Number.isInteger(index)||index<0||index>=q.options.length)return;
    const kind=q.phonicsKind,choice=q.options[index];
    const solved=Object.prototype.hasOwnProperty.call(quiz.answers,q.id);
    const chosenLetter=kind==='letter_name_ipa'?txt(q.optionLetters[index]):txt(choice);
    if(!solved){
      if(!quiz.phonicsWrong)quiz.phonicsWrong=Object.create(null);
      if(kind!=='letter_sequence'&&(quiz.phonicsWrong[q.id]||[]).includes(index))return;
      const right=isCorrect(q,choice);
      quiz.phonicsAttempts[q.id]=(quiz.phonicsAttempts[q.id]||0)+1;
      if(quiz.phonicsAttempts[q.id]===1)queueObservation(q,right,'practice');
      if(!right){const x=quiz.phonicsWrong[q.id]||(quiz.phonicsWrong[q.id]=[]);if(!x.includes(index))x.push(index);}
      quiz.phonicsLast[q.id]={index,correct:right};
      if(right)quiz.answers[q.id]=choice;
      playTA2Feedback(right);
      if(right&&typeof window.confetti==='function')try{window.confetti({particleCount:30,spread:55,origin:{y:.7}});}catch(_){}
      const attempts=Object.values(quiz.phonicsAttempts).reduce((n,v)=>n+Number(v||0),0);
      ctx?.hooks?.setScore?.(Object.keys(quiz.answers).length,Math.max(0,attempts-Object.keys(quiz.answers).length));
      renderTA2Practice();
    }
    const isRight=isCorrect(q,choice);
    if(kind==='letter_sequence'||((kind==='letter_name_ipa'||kind==='letter_listen')&&(solved||isRight))){
      const speech=chosenLetter==='Z'?'The letter Z. Zee.':`The letter ${chosenLetter}.`;
      if(/^[A-Z]$/.test(chosenLetter))scheduleTA2Sound(speech,solved?0:kind==='letter_sequence'?(isRight?380:290):180);
    }else if(kind==='ipa_sound'&&(solved||isRight)){
      const sound=soundForIPA(choice,q);if(sound)scheduleTA2Sound(sound,solved?0:180);
    }
  }

  async function showQuiz(){
    if(!quiz)return;
    if(quiz.mode==='practice'&&quiz.grammarMode){renderGrammarPractice();return;}
    if(quiz.mode==='practice'&&quiz.sgkLevel&&[6,7,8,9].includes(quiz.sgkTopic)){
      renderClass2Explore();return;
    }
    if(quiz.mode==='practice'&&(quiz.extra?.section==='section_1.3'||quiz.extra?.section==='section_1.4')){
      renderTA2Practice();return;
    }
    const thisQuiz=quiz,request=++nonce,q=thisQuiz.questions[thisQuiz.index];
    await loadCatalog();if(!living(request)||quiz!==thisQuiz)return;
    const chosen=thisQuiz.answers[q.id],official=thisQuiz.mode==='official',reveal=!official&&chosen!==undefined;
    const isSgkLevel=!!thisQuiz.sgkLevel;
    const isSgkSolved=isSgkLevel&&thisQuiz.sgkSolved.has(q.id);
    const showExplanation=!isSgkLevel||isSgkSolved;
    const visual=illustration(q,'Minh họa câu hỏi')||(!q.audioOnly&&emojiOf(q)?`<div class="ta3-emoji">${esc(emojiOf(q))}</div>`:'');
    // Reading is a distinct, readable learning pane: do not cram the whole story into the question heading.
    const story=isSgkLevel&&q.readingPassage?`<div class="ta3-sgk-reading-pane"><strong>📖 Read the story</strong>
      <p>${esc(q.readingPassage)}</p><button class="ta3-mini ta3-listen" data-action="listen-audio">🔊 Listen to the story</button></div>`:'';
    const audioButton=q.audio&&!story?`<button class="ta3-mini ta3-listen" data-action="listen-audio">🔊 Listen${q.audioOnly?' to the question':''}</button>`:'';
    const leftVisual=story|| (visual?`<div class="ta3-visual-pane">${visual}</div>`:'');
    const hasAside=!!leftVisual;
    root.innerHTML=heading(thisQuiz.title,official?'Official attempt · results saved by Class 3 server':'Practice · feedback after choosing')+ttsBar()+
      `<section class="ta3-paper"><div class="ta3-quiz-top"><strong>${official?'🔒 Official assessment':'🌼 Learning practice'}</strong>${thisQuiz.deadline?'<strong class="ta3-clock" data-exam-clock></strong>':'<span>Learn at your own pace</span>'}</div>`+
      `<div class="ta3-question-layout${hasAside?' has-picture':''}">${leftVisual}<div class="ta3-question-main">`+
      (isSgkLevel&&q.unit?`<div class="ta3-sgk-unit-tag">Unit ${q.unit} · ${esc(q.unitTitle)}</div>`:'')+
      `<h3 class="ta3-question-text">${thisQuiz.index+1}. ${esc(q.audioOnly?'Listen and choose the answer.':q.prompt)}</h3>`+
      (q.promptVi?`<p class="ta3-question-vi">${esc(q.promptVi)}</p>`:'')+audioButton+renderInteraction(q,chosen,official)+
      (reveal?`<div class="${isCorrect(q,chosen)?'ta3-good':'ta3-warning'}">${isCorrect(q,chosen)?'✅ Great job!':'🌱 Keep trying!'} ${esc(showExplanation?(q.explanation||q.hint||''):(q.hint||'Read carefully and try again.'))}</div>`:'')+
      (!official&&!reveal&&q.hint?`<button class="ta3-mini" data-action="hint">💡 Hint</button>`:'')+
      '</div></div>'+navbar(thisQuiz.index,thisQuiz.questions.length)+
      `<div class="ta3-quiz-footer"><span>${isSgkLevel?thisQuiz.sgkSolved.size:Object.keys(thisQuiz.answers).length}/${thisQuiz.questions.length} ${isSgkLevel?'correct':'answered'}</span>`+
      `<button class="ta3-submit" data-action="submit" ${thisQuiz.submitting?'disabled':''}>${thisQuiz.submitting?'Đang nộp…':official?'Nộp bài chính thức':'Finish practice'}</button></div></section>`;
    const rate=$('#ta3-speech-rate');if(rate)rate.value=txt(speechRate);
    if(thisQuiz.deadline){const left=Math.max(0,Math.ceil((thisQuiz.deadline-Date.now())/1000));const clock=$('[data-exam-clock]');if(clock)clock.textContent=`⏱️ ${String(Math.floor(left/60)).padStart(2,'0')}:${String(left%60).padStart(2,'0')}`;}
    if(isSgkLevel&&thisQuiz.sgkLastRead!==thisQuiz.index){
      thisQuiz.sgkLastRead=thisQuiz.index;
      const group=Number(txt(thisQuiz.extra.section).match(/^section_(\d+)\./)?.[1]);
      const say=SGK_LEVELED_TOPICS[group]?.intro;
      if(say){const timer=setTimeout(()=>{mediaTimers.delete(timer);
        if(active&&quiz===thisQuiz&&view.page==='quiz'&&thisQuiz.questions[thisQuiz.index]===q)void speak(say,'en-US');
      },250);mediaTimers.add(timer);}
    }
  }
  function answerQuestion(choice){
    if(!quiz||quiz.submitting)return;
    const q=quiz.questions[quiz.index];if(!q)return;
    if(quiz.sgkLevel&&quiz.mode==='practice'){
      if(quiz.sgkSolved.has(q.id))return;
      const correct=isCorrect(q,choice);
      if(!correct){
        const wrong=quiz.sgkWrong[q.id]||(quiz.sgkWrong[q.id]=new Set());
        if(wrong.has(choice))return;
        wrong.add(choice);
      }else{quiz.sgkSolved.add(q.id);playTA2Feedback(true);}
      if(!quiz.sgkRecorded.has(q.id)){quiz.sgkRecorded.add(q.id);queueObservation(q,correct,'practice');}
      quiz.answers[q.id]=choice;
      const errors=Object.values(quiz.sgkWrong).reduce((n,s)=>n+s.size,0);
      ctx?.hooks?.setScore?.(quiz.sgkSolved.size,errors);
      void showQuiz();return;
    }
    quiz.answers[q.id]=choice;
    if(quiz.mode==='practice')queueObservation(q,isCorrect(q,choice),'practice');
    void showQuiz();
  }
  async function submitOfficial(){
    if(!quiz||quiz.mode!=='official'||quiz.submitting)return;
    const attempt=quiz;attempt.submitting=true;stopClock();void showQuiz();
    const answers=attempt.questions.map(q=>({id:q.id,choice:txt(attempt.answers[q.id]||'')}));
    try{
      const result=await api('assessmentAttemptSubmit',{kind:attempt.kind,semester:attempt.semester,attemptId:attempt.attemptId,answers});
      if(!active||quiz!==attempt)return;
      quiz=null;const validNonce=nonce;
      if(attempt.kind==='baitap'){progress=null;try{progress=await api('assessmentProgressGet');}catch(_){}}
      if(!living(validNonce)||view.page!=='quiz')return;
      setView(attempt.tab,'result',{title:'Kết quả chính thức'});
      const skills=Object.entries(result.competencies||{}).map(([key,s])=>
        `<li><strong>${esc(SKILLS[key]||key)}</strong>: ${esc(s.status||'Chưa đánh giá')}${s.status==='Đã đánh giá'?` · ${Number(s.percent)||0}%`:''}</li>`).join('');
      const wrong=list(result.wrongQuestions).map(w=>`<li>${esc(w.id)} · Correct: <strong>${esc(w.answer)}</strong>${w.hint?` · ${esc(w.hint)}`:''}</li>`).join('');
      root.innerHTML=heading('Kết quả chính thức',attempt.title)+`<section class="ta3-result"><div class="ta3-medal">${result.passed?'🏆':'🌱'}</div>`+
        `<h3>${Number(result.correct)||0}/${Number(result.totalQuestions)||0} correct · ${Number(result.percent)||0}%`+
        (attempt.kind==='baithi'?` · ${Number(result.score)||0}/${Number(result.maxScore)||0} points`:'')+'</h3>'+
        `<p>${esc(result.message||'Your test is complete.')}</p>`+
        (skills?`<h4>📊 Competencies</h4><ul>${skills}</ul>`:'')+
        (wrong?`<h4>📖 Check these questions</h4><ul>${wrong}</ul>`:'')+
        '<button class="ta3-submit" data-action="hub">Back to lessons</button></section>';
      ctx?.hooks?.setScore?.(Number(result.correct)||0,Math.max(0,(Number(result.totalQuestions)||0)-(Number(result.correct)||0)));
    }catch(_){
      if(!active||quiz!==attempt)return;
      attempt.submitting=false;toast('Chưa lưu được kết quả. Bấm Nộp bài lần nữa, không cần làm lại.');
      void showQuiz();
    }
  }
  function endPractice(){
    if(!quiz||quiz.mode!=='practice')return;
    const q=quiz,correct=q.sgkLevel?q.sgkSolved.size:q.questions.reduce((sum,v)=>sum+(isCorrect(v,q.answers[v.id])?1:0),0);
    const total=q.sgkLevel?q.sgkTotal:q.questions.length;
    const levelWrong=q.sgkLevel?Object.values(q.sgkWrong).reduce((n,s)=>n+s.size,0):q.questions.length-correct;
    quiz=null;stopSpeech();stopClock();setView(q.tab,'result',{title:q.title,section:q.extra?.section,group:q.extra?.group,semester:q.extra?.semester});
    root.innerHTML=heading('Practice result',q.title)+`<section class="ta3-result"><div class="ta3-medal">${correct>=q.questions.length*.8?'🏆':'🌱'}</div>`+
      `<h3>${correct}/${total} correct</h3><p>Keep practising! Practice scores do not unlock official exercises.</p>`+
      (q.tab==='review'&&q.extra?.semester
        ?`<button class="ta3-submit" data-action="review-sem" data-sem="${q.extra.semester}">Quay lại ôn tập học kỳ ${q.extra.semester}</button></section>`
        :q.sgkLevel?'<button class="ta3-submit" data-action="back">Back to Levels</button></section>'
        :'<button class="ta3-submit" data-action="hub">Back</button></section>');
    ctx?.hooks?.setScore?.(correct,levelWrong);
  }

  let telemetry=[],telemetryTask=null;
  function queueObservation(q,correct,origin){
    if(!isLogged())return;
    const skill=Object.prototype.hasOwnProperty.call(SKILLS,q.skill)?q.skill:'ENG_OTHER';
    telemetry.push({t:Date.now(),q:txt(q.id).slice(0,64),s:skill+'.'+origin,o:correct?'c':'w',e:origin,u:0,l:1,tp:0});
    if(telemetry.length>=10)void flushTelemetry();
  }
  async function flushTelemetry(){
    if(!isLogged()||telemetryTask||!telemetry.length)return;
    const events=telemetry.splice(0,20);
    telemetryTask=api('learningProfileSaveBatch',{events}).catch(()=>{}).finally(()=>{telemetryTask=null;});
    return telemetryTask;
  }

  function gameEngineReady(){
    if(window.CLASS3_ENGLISH_MINIGAMES?.version==='20261019.2'&&window.CLASS3_ENGLISH_MINIGAMES?.create)return Promise.resolve(window.CLASS3_ENGLISH_MINIGAMES);
    if(!gameScriptPromise){
      gameScriptPromise=new Promise((resolve,reject)=>{
        const script=document.createElement('script');script.src=MINI_GAMES_FILE;script.async=true;
        script.dataset.class3EnglishGames='';
        script.onload=()=>window.CLASS3_ENGLISH_MINIGAMES?.version==='20261019.2'&&window.CLASS3_ENGLISH_MINIGAMES?.create
          ?resolve(window.CLASS3_ENGLISH_MINIGAMES):reject(new Error('Game engine chưa khởi tạo.'));
        script.onerror=()=>reject(new Error('Không tải được thư viện Mini Games Tiếng Anh 3.'));
        document.head.appendChild(script);
      }).catch(err=>{gameScriptPromise=null;throw err;});
    }
    return gameScriptPromise;
  }
  async function gameHub(request){
    if(!living(request))return;
    root.innerHTML=heading('Mini Games · Tiếng Anh 3','12 trò chơi tương tác · chọn game để vào phần độ khó',false)+
      grid(GAME_LIST.map((g,i)=>folder(`${i+1}. ${g[0]}`,g[2],g[1],'game-open',`data-game="${i}"`,'Play now',i)));
  }
  async function openGame(index){
    if(!needPremium('Mini games'))return;
    const i=Number(index);
    if(!Number.isInteger(i)||i<0||i>=GAME_LIST.length)return;
    const request=++nonce;stopSpeech();stopGame();loading();
    try{
      const engine=await gameEngineReady();if(!living(request))return;
      const gameKey=engine.keys[i];if(!gameKey)throw new Error('Không tìm thấy Mini Game.');
      setView('games','game',{title:GAME_LIST[i][0]});
      root.innerHTML='<div class="ta3g-host" aria-label="Mini Game Tiếng Anh 3"></div>';
      const host=$('.ta3g-host');
      const services={
        // Class 3 vocabulary M12 only, de-duplicated by word + sense.
        getVocab:async()=>{
          const bank=await load('m12');
          const groups=list(bank?.advanced_vocabulary_review?.groups);
          if(bank?.topic_id!==12||groups.length<9)throw new Error('Chua co kho tu vung Muc 12 dung phien ban.');
          return groups.flatMap(group=>list(group.words).map((row,index)=>({...row,topic_name:group.name,topic_name_vi:group.name_vi,group_id:group.id,group_word_index:index}))).filter(m12ValidItem);
        },
        // Grammar M10 is loaded from its own Class 3 JSON; never borrow Class 2 runtime.
        getGrammar:async()=>{
          const bank=await load('grammar');
          if(!bank?.sections||!bank.sections['section_10.1'])throw new Error('Chua co du lieu Grammar Point Muc 10.');
          return bank;
        },
        speak:text=>{if(living(request))void speak(text,'en-US');},
        stopAudio:stopSpeech,
        toast,
        onScore:(correct,wrong)=>{if(living(request))ctx?.hooks?.setScore?.(correct,wrong);},
        onExit:()=>{if(living(request))void hub('games');}
      };
      gameState=engine.create(host,services);
      await gameState.start(gameKey);
      if(!living(request))stopGame();
    }catch(err){if(living(request))errorView(err);}
  }

  // M12 — Super Vocabulary. UI pattern adapted from Class 2 only;
  // the Class 3 module remains self-contained and uses no Class 2 runtime/account/API.
  const M12_MAX_SELECTION=3;
  function m12UniqueWords(groups){
    const seen=new Set(),words=[];
    for(const group of groups)for(let i=0;i<list(group.words).length;i++){
      const row=group.words[i];
      // Keep different senses (chicken = animal / meat, cook = verb / profession).
      const key=normalize(row.word)+'|'+normalize(row.vietnamese);
      if(seen.has(key))continue;
      seen.add(key);words.push({...row,topic_name:group.name,topic_name_vi:group.name_vi,group_id:group.id,group_word_index:i});
    }
    return words;
  }
  function m12ValidItem(row){
    return row&&typeof row.word==='string'&&!!row.word.trim()&&typeof row.vietnamese==='string'&&!!row.vietnamese.trim()&&
      typeof row.ipa==='string'&&row.ipa.length>0&&Array.isArray(row.examples)&&Array.isArray(row.examples_vi)&&
      row.examples.length>0&&row.examples.length===row.examples_vi.length&&
      row.examples.every(x=>typeof x==='string'&&!!x.trim())&&row.examples_vi.every(x=>typeof x==='string'&&!!x.trim());
  }
  async function openM12Hub(request){
    const data=await load('m12');if(!living(request))return;
    const src=data?.advanced_vocabulary_review,groups=list(src?.groups);
    if(data.topic_id!==12||!src||groups.length!==Number(src.group_count)||groups.length<9||groups.some(g=>
      !Number.isInteger(Number(g.id))||!txt(g.name)||!txt(g.name_vi)||!Array.isArray(g.words)||g.words.length<4||
      Number(g.word_count)!==g.words.length||g.words.some(w=>!m12ValidItem(w)))||
      new Set(groups.map(g=>Number(g.id))).size!==groups.length)
      throw new Error('Kho Siêu từ vựng chưa đầy đủ hoặc chưa khớp phiên bản.');
    if(!m12State)m12State={data,selected:new Set(),selectedGroups:[],starting:false};
    else {m12State.data=data;m12State.starting=false;}
    const valid=new Set(groups.map(g=>Number(g.id)));
    for(const id of m12State.selected)if(!valid.has(id))m12State.selected.delete(id);
    setView('discover','m12-hub',{group:12});
    root.innerHTML=`<section class="ta3-super-hub">
      <div class="ta3-super-intro">
        <div class="ta3-super-guide"><strong>Choose 1–3 topics to practise vocabulary.</strong><span>Bé chọn từ 1 đến 3 chủ đề để luyện từ vựng nhé!</span></div>
        <button class="ta3-super-start ta3-super-start-top" type="button" data-action="m12-start" disabled>✨ Start learning</button>
      </div>
      <div class="ta3-super-topic-grid">${groups.map((g,i)=>{
        const on=m12State.selected.has(Number(g.id));
        return `<button type="button" class="ta3-super-topic${on?' is-selected':''}" data-tone="${i%6}" data-action="m12-toggle" data-id="${Number(g.id)}" aria-pressed="${on}" aria-label="${esc(g.name)} / ${esc(g.name_vi)}">
          <span class="ta3-super-icon" aria-hidden="true">${esc(g.icon||'📚')}</span>
          <span class="ta3-super-names"><strong>${esc(g.name)}</strong><span>${esc(g.name_vi)}</span></span>
          <span class="ta3-super-check" aria-hidden="true">✓</span>
          <small class="ta3-super-count">${g.words.length} từ</small>
        </button>`;
      }).join('')}</div>
      <div class="ta3-super-actions"><p class="ta3-super-status" role="status" aria-live="polite"></p>
        <button class="ta3-super-start" type="button" data-action="m12-start" disabled>✨ Choose topics to start · Chọn chủ đề để học</button></div>
    </section>`;
    updateM12Ui();
  }
  function updateM12Ui(){
    if(view.page!=='m12-hub'||!m12State)return;
    const selected=m12State.selected,groups=list(m12State.data?.advanced_vocabulary_review?.groups);
    const chosen=groups.filter(g=>selected.has(Number(g.id)));
    root.querySelectorAll('.ta3-super-topic').forEach(card=>{
      const on=selected.has(Number(card.dataset.id));
      card.classList.toggle('is-selected',on);card.setAttribute('aria-pressed',on?'true':'false');
    });
    const count=m12UniqueWords(chosen).length;
    const status=$('.ta3-super-status'),buttons=root.querySelectorAll('.ta3-super-start');
    if(status)status.textContent=chosen.length?`${chosen.length} / ${M12_MAX_SELECTION} topics selected · ${count} words / Đã chọn ${chosen.length} chủ đề · ${count} từ`:
      `Choose up to 3 topics · Hãy chọn chủ đề để bắt đầu`;
    buttons.forEach(button=>{
      button.disabled=!!m12State.starting||!chosen.length;
      if(m12State.starting)button.innerHTML='<span class="ta3-spinner" aria-hidden="true"></span> Đang tải...';
      else button.textContent=button.classList.contains('ta3-super-start-top')?'✨ Start learning':
        chosen.length?`✨ Start learning · Bắt đầu học (${count} từ)`:'✨ Choose topics to start · Chọn chủ đề để học';
    });
  }
  function toggleM12(id){
    if(!m12State||view.page!=='m12-hub'||m12State.starting)return;
    const gs=list(m12State.data?.advanced_vocabulary_review?.groups);
    if(!Number.isInteger(id)||!gs.some(g=>Number(g.id)===id))return;
    if(m12State.selected.has(id))m12State.selected.delete(id);
    else if(m12State.selected.size>=M12_MAX_SELECTION){toast('🌷 Choose up to 3 topics. Bé chọn tối đa 3 chủ đề mỗi lượt nhé!');return;}
    else m12State.selected.add(id);
    updateM12Ui();
  }
  async function startM12Selection(button){
    if(view.page!=='m12-hub'||!m12State||m12State.starting||button.disabled||m12State.selected.size<1||m12State.selected.size>M12_MAX_SELECTION)return;
    if(!needPremium('Super Vocabulary · Siêu từ vựng'))return;
    m12State.starting=true;
    updateM12Ui();
    const request=++nonce;
    try{
      const selected=list(m12State.data.advanced_vocabulary_review?.groups).filter(g=>m12State.selected.has(Number(g.id)));
      if(selected.length!==m12State.selected.size)throw new Error('Nhóm từ vựng chưa hợp lệ.');
      const words=m12UniqueWords(selected);
      if(words.length<4)throw new Error('Chủ đề này chưa đủ từ để luyện tập.');
      await loadCatalog();if(!living(request)||view.page!=='m12-hub')return;
      const pool=words.map((w,i)=>{
        const image=safeImageEntry(w.image_id,w.image_url);
        const fallback=txt(w.emoji||'');
        const isConcrete=!!(image&&!image.has_text)||!!(fallback&&fallback.length<18)||
          !!VOCAB_NUMBER_PICTURES[normalize(w.word)]||
          (list(w.sgk3_units).includes(8)&&['eraser','pencil case'].includes(normalize(w.word)));
        return {
          ...w,vocab_id:`TA3_SUPER_G${w.group_id}_${w.group_word_index}`,unit:list(w.sgk3_units)[0]||0,
          visual:{image_id:txt(w.image_id||''),image_url:txt(w.image_url||''),fallback_emoji:fallback},
          has_concrete_picture:isConcrete
        };
      });
      m12State.selectedGroups=selected;
      vocabContext='super';vocabPool=shuffle(pool);vocabIndex=0;vocabLevel=0;vocabMode='flashcard';
      vocabCorrect=Object.create(null);vocabTries=Object.create(null);vocabChoices=Object.create(null);
      stopVocabRecognition();stopSpeech();
      setView('discover','vocab-study',{group:12,title:'Super Vocabulary · '+selected.map(g=>g.name).join(' + ')});
      renderVocabStudy();
    }catch(err){if(living(request)){toast('Chưa thể mở bộ từ vựng. Bé thử lại nhé!');}}
    finally{if(living(request)&&m12State){m12State.starting=false;
      if(view.page==='m12-hub')updateM12Ui();}}
  }

  // M11 — Discover / Picture & Situation Challenge.
  // Same learning flow as Class 2 (two branches, 3 levels, image/text left,
  // answer cards right). It intentionally uses Class 3 source, catalog,
  // navigation, Google TTS and subject-level access only.
  const M11_LEVELS=Object.freeze({
    easy:{title:'Easy / Dễ',icon:'🌱',colour:'pink',count:4},
    medium:{title:'Medium / Vừa',icon:'🌼',colour:'blue',count:5},
    hard:{title:'Hard / Khó',icon:'🌟',colour:'purple',count:6}
  });
  const M11_DECK_PREFIX='ee_class3_ta_m11_deck_v1';
  const m11Label=branch=>branch==='reading'?'Situation Reading Challenge':'Look at the Picture & Answer';
  const m11Vi=branch=>branch==='reading'?'Đọc hiểu tình huống':'Nhìn hình trả lời câu hỏi';
  const m11Items=(data,branch)=>list(branch==='reading'?data.advanced_situation_reading?.readings:data.picture_question_review?.pictures);
  const m11Id=(item,branch)=>txt(branch==='reading'?item?.reading_id:item?.picture_id);
  function m11ItemValid(item,branch,level){
    if(!item||item.level!==level||!m11Id(item,branch)||!safeImageEntry(item.image_id,item.image_url)||
      !Array.isArray(item.questions)||item.questions.length!==(branch==='reading'?M11_LEVELS[level].count:3))return false;
    return item.questions.every(q=>q&&txt(q.question_id)&&txt(q.question)&&
      Array.isArray(q.options)&&q.options.length===4&&new Set(q.options).size===4&&
      q.options.filter(x=>x===q.answer).length===1&&txt(q.question_vi)&&txt(q.hint_vi));
  }
  async function loadM11(){
    const [data,available]=await Promise.all([load('m11'),loadCatalog()]);
    if(!available)throw new Error('Chưa tải được catalog ảnh của Lớp 3.');
    if(data?.topic_id!==11||!data.picture_question_review||!data.advanced_situation_reading)
      throw new Error('File học liệu Mục 11 không đúng định dạng.');
    for(const branch of ['picture','reading']){
      const group=m11Items(data,branch);
      if(group.length!==90||new Set(group.map(v=>m11Id(v,branch))).size!==group.length)
        throw new Error('Kho '+m11Vi(branch)+' chưa đủ 90 bài hoặc bị trùng mã.');
      for(const level of Object.keys(M11_LEVELS)){
        const pool=group.filter(r=>r.level===level);
        if(pool.length!==30||pool.some(r=>!m11ItemValid(r,branch,level)))
          throw new Error('Ảnh hoặc đáp án Mục 11 không khớp catalog Lớp 3.');
      }
    }
    return data;
  }
  async function openM11Hub(request){
    const data=await loadM11();if(!living(request))return;
    m11State={data,branch:null,level:null,items:[],index:0,firstIndex:0,deck:null,deckKey:'',round:0,states:new Map(),failedImages:new Set()};
    setView('discover','m11-hub',{group:11,title:'11. Picture & Situation Challenge'});
    root.innerHTML=heading('11. Picture & Situation Challenge','Khám phá tranh và tình huống · học song ngữ · từ dễ đến khó')+
      `<div class="ta3-m11-grid ta3-m11-entry">
         <button data-action="m11-branch" data-branch="picture" class="ta3-m11-card ta3-m11-card-blue"><span class="ta3-m11-icon">🖼️</span><div><strong>1. Look at the Picture & Answer</strong><span>Nhìn hình trả lời câu hỏi</span><small>90 bức tranh · 3 câu hỏi / tranh · 3 mức độ</small></div><b>→</b></button>
         <button data-action="m11-branch" data-branch="reading" class="ta3-m11-card ta3-m11-card-purple"><span class="ta3-m11-icon">📖</span><div><strong>2. Situation Reading Challenge</strong><span>Đọc hiểu tình huống</span><small>30 tình huống theo chủ đề SGK × 3 mức · 4–6 câu hỏi / bài</small></div><b>→</b></button>
       </div><p class="ta3-m11-tip">🌱 Học từ dễ đến khó. Câu trả lời sai sẽ có gợi ý; bé làm đúng rồi mới tiếp tục.</p>`;
  }
  function openM11Levels(branch){
    if(!m11State||!['picture','reading'].includes(branch))return;
    stopSpeech();
    if(m11State.branch!==branch){
      m11State.level=null;m11State.deck=null;m11State.deckKey='';
      m11State.states=new Map();
      m11UpdateScore();
    }
    m11State.branch=branch;
    setView('discover','m11-levels',{group:11,title:m11Label(branch)});
    root.innerHTML=heading(m11Label(branch),m11Vi(branch)+' · chọn mức độ, học ngẫu nhiên không lặp')+
      `<div class="ta3-m11-grid ta3-m11-level-grid">${Object.entries(M11_LEVELS).map(([level,meta])=>{
          const count=30;
          return `<button data-action="m11-level" data-level="${level}" class="ta3-m11-card ta3-m11-card-${esc(meta.colour)}"><span class="ta3-m11-icon">${meta.icon}</span><div><strong>${esc(meta.title)}</strong><span>${level==='easy'?'Nhận biết và tìm thông tin':level==='medium'?'Đọc kỹ và nối các chi tiết':'Đọc dài hơn và tổng hợp thông tin'}</span><small>${count} ${branch==='picture'?'tranh · 3 câu/tranh':'bài · '+meta.count+' câu/bài'} · Ngẫu nhiên</small></div><b>→</b></button>`;
        }).join('')}</div>`;
  }
  // One shuffled 30-item deck per L3 account + branch + level (same behaviour as L2).
  // Persist only PUBLIC lesson IDs, order and next cursor; never persist answers or user data.
  function m11DeckKey(branch,level){
    const userId=txt(ctx?.user?.userId);
    if(!userId)return '';
    let hash=2166136261;
    for(const ch of 'class3:english:'+userId){hash=Math.imul(hash^ch.charCodeAt(0),16777619);}
    return M11_DECK_PREFIX+'_'+(hash>>>0).toString(36)+'_'+branch+'_'+level;
  }
  function m11SaveDeck(key,deck){
    if(!key)return;
    m11DeckCache.set(key,deck);
    try{localStorage.setItem(key,JSON.stringify(deck));}catch(_){/* In-memory fallback for private browsing. */}
  }
  function m11RestoreDeck(branch,level,pool){
    const key=m11DeckKey(branch,level);
    if(!key)throw new Error('Cần đăng nhập để luyện tập Mục 11.');
    const ids=pool.map(item=>m11Id(item,branch));
    const idSet=new Set(ids);
    if(ids.length!==30||ids.some(id=>!id)||idSet.size!==ids.length)throw new Error('Dữ liệu Mục 11 không hợp lệ.');
    const signature=txt(m11State.data?.data_version)+'|'+[...ids].sort().join('|');
    let deck=m11DeckCache.get(key);
    if(!deck){try{deck=JSON.parse(localStorage.getItem(key)||'null');}catch(_){deck=null;}}
    const valid=deck&&deck.signature===signature&&Array.isArray(deck.order)&&
      deck.order.length===ids.length&&new Set(deck.order).size===ids.length&&
      deck.order.every(id=>idSet.has(id))&&Number.isInteger(deck.cursor)&&
      deck.cursor>=0&&deck.cursor<ids.length&&Number.isSafeInteger(deck.rounds)&&deck.rounds>=0;
    if(!valid)deck={signature,order:shuffle(ids),cursor:0,rounds:0};
    m11SaveDeck(key,deck);
    return {key,deck};
  }
  function startM11RandomLevel(branch,level){
    if(!m11State||!['picture','reading'].includes(branch)||!Object.hasOwn(M11_LEVELS,level))return;
    if(!needPremium('11. Picture & Situation Challenge'))return;
    const pool=m11Items(m11State.data,branch).filter(item=>item.level===level);
    if(pool.length!==30){toast('Chưa có đủ bài học ở cấp này.');return;}
    const {key,deck}=m11RestoreDeck(branch,level,pool);
    const byId=new Map(pool.map(item=>[m11Id(item,branch),item]));
    const ordered=deck.order.map(id=>byId.get(id));
    if(ordered.some(item=>!item)){toast('Không tìm thấy bài học phù hợp.');return;}
    stopSpeech();
    m11State.branch=branch;m11State.level=level;m11State.items=ordered;
    m11State.deck=deck;m11State.deckKey=key;m11State.round=deck.rounds;
    m11State.index=deck.cursor;m11State.firstIndex=deck.cursor;
    m11State.states=new Map();m11State.failedImages=new Set();m11UpdateScore();
    openM11Lesson(deck.cursor);
  }
  function m11MarkCompleted(item){
    const state=m11State,deck=state?.deck;
    if(!deck||deck.rounds!==state.round||deck.order[deck.cursor]!==m11Id(item,state.branch))return;
    if(deck.cursor<deck.order.length-1){
      deck.cursor++;
    }else{
      const lastId=m11Id(item,state.branch),next=shuffle(deck.order);
      // The first card of the new round must not be the last card just completed.
      if(next.length>1&&next[0]===lastId){
        const swap=1+Math.floor(Math.random()*(next.length-1));
        [next[0],next[swap]]=[next[swap],next[0]];
      }
      deck.order=next;deck.cursor=0;deck.rounds++;
    }
    m11SaveDeck(state.deckKey,deck);
  }
  function m11AnswerState(item){
    const id=m11Id(item,m11State.branch);
    let st=m11State.states.get(id);
    if(!st){st={correct:Array(item.questions.length).fill(false),chosen:Array(item.questions.length).fill(-1),wrong:Array.from({length:item.questions.length},()=>new Set())};m11State.states.set(id,st);}
    return st;
  }
  function m11Current(){return m11State?.items?.[m11State.index]||null;}
  function openM11Lesson(idx){
    if(!m11State?.items.length)return;
    if(!needPremium('11. Picture & Situation Challenge'))return;
    const i=Number(idx);if(!Number.isInteger(i)||i<0||i>=m11State.items.length)return;
    stopSpeech();m11State.index=i;
    setView('discover','m11-study',{group:11,title:m11Label(m11State.branch)+' · '+M11_LEVELS[m11State.level].title+' · '+(i+1)});
    m11Render();
  }
  function m11UpdateScore(){
    if(!m11State)return;
    let right=0,wrong=0;
    for(const st of m11State.states.values()){
      right+=st.correct.filter(Boolean).length;
      wrong+=st.wrong.reduce((n,v)=>n+v.size,0);
    }
    ctx?.hooks?.setScore?.(right,wrong);
  }
  function m11SpeakPassage(){
    const q=m11Current();if(!q)return;
    if(m11State.branch==='reading')void speak(q.tts_text||q.passage,'en-US');
  }
  function m11SpeakQuestion(index){
    const q=m11Current(),t=q?.questions?.[Number(index)]?.question;
    if(t)void speak(t,'en-US');
  }
  function m11Render(){
    const item=m11Current();if(!item||!root)return;
    const branch=m11State.branch,level=m11State.level,st=m11AnswerState(item),done=st.correct.every(Boolean);
    const meta=M11_LEVELS[level],number=m11State.index+1,count=m11State.items.length;
    const img=safeImageEntry(item.image_id,item.image_url);
    const figure=m11State.failedImages.has(item.image_id)?'<p class="ta3-m11-photo-warning">⚠️ Hình minh họa chưa tải được. Con hãy quay lại sau nhé.</p>':img?`<img class="ta3-m11-photo" src="${esc(img.src)}" alt="${esc(item.image_alt_vi||'Tranh minh họa')}" loading="eager" decoding="async">`:'<p>Chưa tìm thấy hình trong catalog Lớp 3.</p>';
    const left=branch==='reading'?`<section class="ta3-m11-panel"><div class="ta3-m11-panel-head"><div><h3>${esc(item.title)}</h3><p>${esc(item.title_vi)} · Unit ${esc(item.unit_anchor)}</p></div><button class="ta3-listen-btn ta3-m11-speak" data-action="m11-speak" aria-label="Nghe bài đọc tiếng Anh">Listen</button></div>
      <div class="ta3-m11-reading-image">${figure}</div><div class="ta3-m11-passage" lang="en-US">${txt(item.passage).split('\n').map(line=>`<p>${esc(line)}</p>`).join('')}</div>
      ${done?`<div class="ta3-m11-translation"><strong>🇻🇳 Nghĩa tiếng Việt</strong>${txt(item.passage_vi).split('\n').map(line=>`<p>${esc(line)}</p>`).join('')}</div>`:'<p class="ta3-m11-note">Đọc kỹ rồi trả lời từng câu. Hoàn thành tất cả sẽ hiện bản dịch tiếng Việt.</p>'}</section>`
    :`<section class="ta3-m11-panel ta3-m11-picture-panel"><div class="ta3-m11-picture-frame">${figure}</div>
      ${done?`<div class="ta3-m11-caption"><strong>${esc(item.title)}</strong><span>${esc(item.title_vi)}</span></div>`:
       '<p class="ta3-m11-note">👀 Look carefully! Con hãy quan sát thật kỹ từng chi tiết trong tranh nhé.</p>'}</section>`;
    const questions=item.questions.map((q,qi)=>{
      const ok=st.correct[qi],chosen=st.chosen[qi],wrong=st.wrong[qi].size>0;
      return `<article class="ta3-m11-question"><div class="ta3-m11-question-top"><span class="ta3-m11-no">${qi+1}</span><div class="ta3-m11-question-text"><h4>${esc(q.question)}</h4><p lang="vi">${esc(q.question_vi)}</p></div><button data-action="m11-question-tts" data-question="${qi}" aria-label="Nghe câu hỏi ${qi+1}" class="ta3-listen-btn ta3-m11-q-sound">Listen</button></div>
       <div class="ta3-m11-options">${q.options.map((option,oi)=>{
        const right=ok&&option===q.answer,bad=oi===chosen&&!ok;
        return `<button class="ta3-m11-option${right?' correct':bad?' wrong':''}" data-action="m11-choice" data-question="${qi}" data-option="${oi}" ${ok||st.wrong[qi].has(oi)||(branch==='picture'&&m11State.failedImages.has(item.image_id))?'disabled':''}><b>${String.fromCharCode(65+oi)}.</b><span>${esc(option)}</span>${right?'<span class="ta3-m11-check">✓</span>':''}</button>`;
       }).join('')}</div>
       ${ok?`<p class="ta3-m11-feedback correct" role="status">✅ ${esc(q.explanation||'Very good!')}</p>`:wrong?`<p class="ta3-m11-feedback hint" role="status">💡 ${esc(q.hint_vi||'Con đọc lại bài và thử lần nữa nhé!')}</p>`:''}</article>`;
    }).join('');
    root.innerHTML=`<section class="ta3-m11-study">${heading(m11Label(branch),meta.icon+' '+meta.title+' · Bài '+number+' / '+count)}
      <div class="ta3-m11-toolbar"><span>✅ ${st.correct.filter(Boolean).length}/${item.questions.length} câu đúng</span>${branch==='reading'?ttsBar():''}</div>
      <div class="ta3-m11-study-grid">${left}<div class="ta3-m11-question-list">${questions}</div></div>
      ${done?'<p class="ta3-m11-complete" role="status">🎉 Excellent! Con đã hoàn thành tất cả câu hỏi trong bài này!</p>':''}
      <div class="ta3-m11-pagination ta3-m11-footer"><button data-action="m11-prev" ${m11State.index<=m11State.firstIndex?'disabled':''}>← Previous</button><span>${number} / ${count}</span><button class="ta3-m11-primary" data-action="m11-next" ${done?'':'disabled'}>${number===count?'Vòng mới →':'Next →'}</button></div>
    </section>`;
  }
  function m11Choose(questionIndex,optionIndex){
    if(!m11State||view.page!=='m11-study')return;
    if(m11State.branch==='picture'&&m11State.failedImages.has(m11Current()?.image_id))return;
    const q=m11Current(),qi=Number(questionIndex),oi=Number(optionIndex),item=q?.questions?.[qi];
    if(!item||!Number.isInteger(oi)||oi<0||oi>=item.options.length)return;
    const st=m11AnswerState(q);if(st.correct[qi]||st.wrong[qi].has(oi))return;
    st.chosen[qi]=oi;
    const success=item.options[oi]===item.answer;
    if(success){
      st.correct[qi]=true;
      if(st.correct.every(Boolean))m11MarkCompleted(q);
    }else st.wrong[qi].add(oi);
    playTA2Feedback(success);
    m11UpdateScore();m11Render();
  }
  function m11Navigate(delta){
    if(!m11State||view.page!=='m11-study')return;
    const item=m11Current();if(!item)return;
    const idx=m11State.index;
    if(delta>0&&!m11AnswerState(item).correct.every(Boolean))return;
    if(delta>0&&idx===m11State.items.length-1){
      if(!m11State.deck||m11State.deck.rounds===m11State.round)return;
      const {branch,level}=m11State;
      startM11RandomLevel(branch,level);
      toast('🎉 Con đã hoàn thành cả vòng! Các bài được xáo trộn mới.');
      return;
    }
    const to=idx+(delta>0?1:-1);
    if(to<m11State.firstIndex||to>=m11State.items.length)return;
    openM11Lesson(to);
  }

  function back(){
    stopSpeech();stopClock();stopGame();
    if(view.page==='m11-study'){openM11Levels(m11State?.branch);return;}
    if(view.page==='m11-levels'){void discoverGroup(11);return;}
    if(view.page==='m11-hub'){void hub('discover');return;}
    if((view.page==='quiz'||view.page==='result')&&view.tab==='review'&&view.semester){void reviewSemester(view.semester);return;}
    if(view.page==='quiz'||view.page==='result'){if(view.tab==='discover'&&view.group){void discoverGroup(view.group);return;}if(view.page==='quiz'){void hub(view.tab);return;}}
    if(view.page==='semester'&&view.tab==='review'){void hub('review');return;}
    if(view.page==='shared-study'&&sharedActivity){sharedCancelSpeech();ctx?.hooks?.setScore?.(0,0);void discoverGroup(sharedActivity.activity);return;}
    if(view.page==='vocab-study'){void discoverGroup(vocabContext==='super'?12:2);return;}
    if(view.page==='m12-hub'){void hub('discover');return;}
    if(view.page==='flash'){void discoverGroup(2);return;}
    if(view.page==='phonics-learn'){void discoverGroup(1);return;}
    if(view.page==='group'){void hub('discover');return;}
    if(view.page==='exam-group'){void hub('exams');return;}
    void hub(view.tab);
  }
  async function handleClick(event){
    const b=event.target?.closest?.('button[data-action]');if(!b||!root?.contains(b)||b.disabled)return;
    const action=b.dataset.action;
    switch(action){
      case 'hub':await hub(view.tab);break;
      case 'back':back();break;
      case 'stop-audio':stopSpeech();break;
      case 'pending':toast('Chuyên đề này chưa có học liệu.');break;
      case 'discover-group':await discoverGroup(Number(b.dataset.group));break;
      case 'm11-branch':openM11Levels(txt(b.dataset.branch));break;
      case 'm11-level':startM11RandomLevel(m11State?.branch,txt(b.dataset.level));break;
      case 'm11-choice':m11Choose(Number(b.dataset.question),Number(b.dataset.option));break;
      case 'm11-question-tts':m11SpeakQuestion(Number(b.dataset.question));break;
      case 'm11-speak':m11SpeakPassage();break;
      case 'm11-prev':m11Navigate(-1);break;
      case 'm11-next':m11Navigate(1);break;
      case 'm12-toggle':toggleM12(Number(b.dataset.id));break;
      case 'm12-start':await startM12Selection(b);break;
      case 'ta2-alpha-intro-listen':void speak('B\u00E9 c\u00F3 th\u1EC3 h\u1ECDc b\u1EA3ng ch\u1EEF c\u00E1i tr\u01B0\u1EDBc, r\u1ED3i luy\u1EC7n nghe, ch\u1ECDn c\u00E1ch \u0111\u1ECDc v\u00E0 \u0111i\u1EC1n ch\u1EEF c\u00F2n thi\u1EBFu \u1EDF m\u1EE5c 1.3 nh\u00E9! Ph\u1EA7n IPA \u1EDF m\u1EE5c 1.2 v\u00E0 1.4 d\u00E0nh cho b\u00E9 mu\u1ED1n t\u00ECm hi\u1EC3u th\u00EAm, kh\u00F4ng b\u1EAFt bu\u1ED9c.','vi-VN');break;
      case 'ta2-alphabet-word':if(view.page==='phonics-learn'&&phonicsLearnSection==='section_1.1'){
        const item=phonicsLearnItems[phonicsLearnIndex],w=[item?.word1,item?.word2,item?.word3][Number(b.dataset.index)];if(w?.en)void speak(w.en,'en-US');
      }break;
      case 'ta2-ipa-word':if(view.page==='phonics-learn'&&phonicsLearnSection==='section_1.2'){
        const w=list(phonicsLearnItems[phonicsLearnIndex]?.words)[Number(b.dataset.index)];if(w?.word)void speak(w.word,'en-US');
      }break;
      case 'ta2-ipa-guide':if(view.page==='phonics-learn'&&phonicsLearnSection==='section_1.2')audioGuideVietnamese(phonicsLearnItems[phonicsLearnIndex]);break;
      case 'ta2-alphabet-quiz':await discoverOpen('section_1.3');break;
      case 'ta2-ipa-quiz':await discoverOpen('section_1.4');break;
      case 'phonics-learn-pick':if(view.page==='phonics-learn'){
        const n=Number(b.dataset.index);if(Number.isInteger(n)&&n>=0&&n<phonicsLearnItems.length){stopSpeech();phonicsLearnIndex=n;renderPhonicsLearning();}
      }break;
      case 'phonics-learn-prev':case 'phonics-learn-next':if(view.page==='phonics-learn'){
        stopSpeech();phonicsLearnIndex=Math.max(0,Math.min(phonicsLearnItems.length-1,phonicsLearnIndex+(action.endsWith('next')?1:-1)));renderPhonicsLearning();
      }break;
      case 'phonics-learn-letter':if(view.page==='phonics-learn'){
        const letter=phonicsLearnItems[phonicsLearnIndex]?.letter;if(/^[A-Z]$/.test(txt(letter)))alphabetSpeak(letter);
      }break;
      case 'phonics-learn-sound':if(view.page==='phonics-learn'){
        const word=txt(phonicsLearnItems[phonicsLearnIndex]?.soundWord);if(word)void speak(word,'en-US');
      }break;
      case 'phonics-listen':if(quiz){
        const q=quiz.questions[quiz.index];const say=q.phonicsKind==='ipa_sound'?q.audio:q.audio;
        if(say)void speak(say,'en-US');
      }break;
      case 'phonics-choose':answerPhonicsQuestion(Number(b.dataset.index));break;
      case 'discover-open':await discoverOpen(txt(b.dataset.section));break;
      case 'shared-level':await openSharedLevel(Number(b.dataset.group),Number(b.dataset.level));break;
      case 'shared-remove':if(view.page==='shared-study')sharedRemove(Number(b.dataset.pos));break;
      case 'shared-fill':case 'shared-odd':if(view.page==='shared-study')sharedChoose(Number(b.dataset.index));break;
      case 'shared-replay':if(view.page==='shared-study'){const q=sharedActivity?.questions[sharedActivity.index];if(q?.solved)void speak(q.word,'en-US');}break;
      case 'shared-instruction':sharedReadInstruction();break;
      case 'shared-prev':case 'shared-next':if(view.page==='shared-study')sharedMove(action==='shared-next'?1:-1);break;
      case 'vocab-level':await openVocabLevel(Number(b.dataset.level));break;
      case 'vocab-mode':stopVocabRecognition();stopSpeech();vocabMode=txt(b.dataset.mode);renderVocabStudy();break;
      case 'vocab-prev':case 'vocab-next':{
        stopVocabRecognition();stopSpeech();vocabIndex=Math.max(0,Math.min(vocabPool.length-1,vocabIndex+(action==='vocab-next'?1:-1)));
        renderVocabStudy();break;
      }
      case 'vocab-prompt':void speak('Choose the correct English word.','en-US');break;
      case 'vocab-listen':{
        const q=vocabPool[vocabIndex];if(q)void speak(q.word,'en-US');break;
      }
      case 'vocab-example':{
        const q=vocabPool[vocabIndex],ex=list(q?.examples)[Number(b.dataset.index)];if(ex)void speak(ex,'en-US');break;
      }
      case 'vocab-option':vocabPick(Number(b.dataset.index));break;
      case 'vocab-mic':vocabSpeakRecognition();break;
      case 'flash-flip':{
        flashRevealed=!flashRevealed;const d=await load('discover1');if(active&&view.page==='flash')await showFlash(list(d.vocabulary_activity_banks?.['section_2.1']));break;
      }
      case 'flash-prev':case 'flash-next':{
        const d=await load('discover1'),cards=list(d.vocabulary_activity_banks?.['section_2.1']);
        flashIndex=Math.max(0,Math.min(cards.length-1,flashIndex+(action==='flash-next'?1:-1)));flashRevealed=false;
        if(active&&view.page==='flash')await showFlash(cards);break;
      }
      case 'flash-listen':{
        const d=await load('discover1'),c=list(d.vocabulary_activity_banks?.['section_2.1'])[flashIndex];if(c)void speak(c.audio||c.word,'en-US');break;
      }
      case 'lesson-sem':selectedLessonSemester=Number(b.dataset.sem);await hub('lessons');break;
      case 'exercise-sem':selectedExerciseSemester=Number(b.dataset.sem);progress=null;await hub('exercises');break;
      case 'lesson-open':await lessonOpen(txt(b.dataset.id));break;
      case 'lesson-page':if(view.page==='lesson')await lessonOpen(view.id,Number(b.dataset.index));break;
      case 'lesson-prev':case 'lesson-next':if(view.page==='lesson')await lessonOpen(view.id,lessonPage+(action==='lesson-next'?1:-1));break;
      case 'lesson-answer':lessonAnswers[view.id+'_'+b.dataset.index]=Number(b.dataset.choice);await lessonOpen(view.id,lessonPage);break;
      case 'lesson-listen':lessonListen();break;
      case 'word-speak':void speak(b.dataset.text,'en-US');break;
      case 'exercise-open':await startOfficial('baitap',semValue(b.dataset.sem),txt(b.dataset.id));break;
      case 'review-sem':await reviewSemester(Number(b.dataset.sem));break;
      case 'review-all':await openSemesterReview(Number(b.dataset.sem));break;
      case 'review-open':await openReview(txt(b.dataset.id));break;
      case 'exam-group':await examGroup(txt(b.dataset.group));break;
      case 'exam-open':await startOfficial('baithi',txt(b.dataset.sem),txt(b.dataset.id));break;
      case 'history':await history(txt(b.dataset.kind),txt(b.dataset.sem));break;
      // Class-2 style M6-M9: answer-specific interaction, scoped to the Class-3 quiz.
      case 'grammar-rule':if(quiz?.grammarMode){quiz.grammarShowRule=!quiz.grammarShowRule;renderGrammarPractice();}break;
      case 'grammar-instruction':if(quiz?.grammarMode)void speak('Choose the correct answer.','en-US');break;
      case 'grammar-listen':if(quiz?.grammarMode){const q=quiz.questions[quiz.index];if(quiz.grammarSolved.has(q.id))void speak(q.audio||q.prompt.replace('____',q.answer),'en-US');}break;
      case 'grammar-choose':if(quiz?.grammarMode)grammarPick(Number(b.dataset.index));break;
      case 'grammar-prev':if(quiz?.grammarMode)grammarNavigate(-1);break;
      case 'grammar-next':if(quiz?.grammarMode)grammarNavigate(1);break;
      case 'sgk-instruction':if(quiz?.sgkLevel)void speak(TA2_LEVEL_GUIDES[quiz.sgkTopic],'en-US');break;
      case 'sgk-listen-passage':if(quiz?.sgkTopic===6)void speak(quiz.questions[quiz.index]?.readingPassage,'en-US');break;
      case 'sgk-listen-question':if(quiz?.sgkTopic===9)void speak(sgkReadIntro(quiz.questions[quiz.index]),'en-US');break;
      case 'sgk-listen-complete':if(quiz?.sgkLevel){const q=quiz.questions[quiz.index];
        if(quiz.sgkTopic===7&&sgkSolved(q))void speak(q.answer,'en-US');
        else if(quiz.sgkTopic===8&&sgkSolved(q))void speak(sgkCompletedSentence(q),'en-US');
        else if(quiz.sgkTopic===9&&sgkSolved(q))void speak(q.answer,'en-US');
      }break;
      case 'sgk-reading-answer':if(quiz?.sgkTopic===6)handleSgkReadingPick(Number(b.dataset.question),Number(b.dataset.index));break;
      case 'sgk-pick':if(quiz?.sgkTopic===8||quiz?.sgkTopic===9)handleSgkChoice(Number(b.dataset.index));break;
      case 'sgk-word-pick':if(quiz?.sgkTopic===7)handleSgkWordPick(Number(b.dataset.index));break;
      case 'sgk-word-undo':if(quiz?.sgkTopic===7)handleSgkWordUndo(Number(b.dataset.index));break;
      case 'sgk-prev':if(quiz?.sgkLevel)sgkNavigate(-1);break;
      case 'sgk-next':if(quiz?.sgkLevel)sgkNavigate(1);break;
      case 'listen-audio':if(quiz){const q=quiz.questions[quiz.index];void speak(q.audio||q.prompt,'en-US');}break;
      case 'choose':if(quiz){const q=quiz.questions[quiz.index];answerQuestion(q.options[Number(b.dataset.index)]);}break;
      case 'hint':if(quiz?.mode==='practice')toast(quiz.questions[quiz.index].hint||'Look carefully and try again!');break;
      case 'reorder-pick':if(quiz){const q=quiz.questions[quiz.index],st=quiz.tiles[q.id],w=st.deck.find(t=>t.id===Number(b.dataset.token));if(w&&!st.chosen.includes(w)){st.chosen.push(w);quiz.answers[q.id]=st.chosen.map(x=>x.text).join(' ');void showQuiz();}}break;
      case 'reorder-undo':if(quiz){const q=quiz.questions[quiz.index],st=quiz.tiles[q.id];st?.chosen.pop();quiz.answers[q.id]=st?.chosen.map(x=>x.text).join(' ')||'';void showQuiz();}break;
      case 'reorder-reset':if(quiz){const q=quiz.questions[quiz.index],st=quiz.tiles[q.id];if(st)st.chosen=[];quiz.answers[q.id]='';void showQuiz();}break;
      case 'question-prev':case 'question-next':if(quiz){
        if(quiz.extra?.section==='section_1.3'||quiz.extra?.section==='section_1.4'||quiz.sgkLevel)stopSpeech();
        quiz.index=Math.max(0,Math.min(quiz.questions.length-1,quiz.index+(action==='question-next'?1:-1)));void showQuiz();
      }break;
      case 'submit':if(quiz?.mode==='official')await submitOfficial();else endPractice();break;
      case 'game-open':await openGame(Number(b.dataset.game));break;
      default:break;
    }
  }
  function styles(){
    if(document.getElementById('class3-english-module-style'))return;
    const tag=document.createElement('style');tag.id='class3-english-module-style';tag.textContent=CSS;document.head.appendChild(tag);
  }
  function destroy(){
    active=false;nonce++;sharedCancelSpeech();sharedActivity=null;stopVocabRecognition();stopSpeech();stopClock();stopGame();
    if(telemetry.length)void flushTelemetry();
    if(phonicsFeedbackAudio){try{void phonicsFeedbackAudio.close();}catch(_){}phonicsFeedbackAudio=null;}
    if(root){try{root.removeEventListener('click',clickHandler);root.removeEventListener('input',inputHandler);root.removeEventListener('change',changeHandler);root.removeEventListener('error',imageErrorHandler,true);root.remove();}catch(_){}}
    root=null;ctx?.hooks?.clearDetail?.();ctx=null;quiz=null;progress=null;lessonAnswers={};
    telemetry=[];telemetryTask=null;listenQueue=[];hostUser='';
    phonicsLearnItems=[];phonicsLearnSection='';phonicsLearnIndex=0;
    vocabPool=[];vocabIndex=0;vocabLevel=0;vocabMode='flashcard';vocabContext='sgk';m11State=null;m11DeckCache.clear();m12State=null;
    vocabCorrect=Object.create(null);vocabTries=Object.create(null);vocabChoices=Object.create(null);
    if(vocabAudioContext){try{void vocabAudioContext.close();}catch(_){}vocabAudioContext=null;}
  }
  async function render(nextCtx){
    const next=nextCtx||{},nextUser=next.user?.userId||'';
    if(root&&(root.parentElement!==next.host||!root.isConnected))destroy();
    if(hostUser!==nextUser){progress=null;lessonAnswers={};telemetry=[];stopSpeech();}
    ctx=next;active=true;hostUser=nextUser;styles();
    if(!root){
      root=document.createElement('section');root.id=ROOT_ID;root.setAttribute('aria-label','Tiếng Anh 3');next.host.replaceChildren(root);
      clickHandler=e=>{void handleClick(e).catch(err=>{console.error('[Class3 TA3 UI]',err?.name||'Error');dialog('Chưa xử lý được thao tác. Bé thử lại nhé!');});};
      inputHandler=e=>{if(e.target?.matches?.('#ta3-speech-rate')){speechRate=Math.min(1.3,Math.max(.65,Number(e.target.value)||.85));return;}if(e.target?.matches?.('[data-answer-input]')&&quiz&&!quiz.submitting){const q=quiz.questions[quiz.index];quiz.answers[q.id]=e.target.value;}};
      changeHandler=e=>{if(e.target?.matches?.('#ta3-speech-rate'))speechRate=Math.min(1.3,Math.max(.65,Number(e.target.value)||.85));};
      imageErrorHandler=e=>{
        const image=e.target;
        if(!(image instanceof HTMLImageElement))return;
        if(image.matches('.ta3-m11-photo')&&m11State&&view.page==='m11-study'){
          const current=m11Current();if(current){m11State.failedImages.add(current.image_id);m11Render();}
          return;
        }
        if(!image.matches('.ta3-vocab-image img[data-fallback-emoji]'))return;
        const emoji=image.dataset.fallbackEmoji||'';
        const fallback=document.createElement(emoji?'span':'div');
        fallback.className=emoji?'ta3-vocab-picture-emoji':'ta3-vocab-meaning-clue';
        if(emoji){fallback.setAttribute('role','img');fallback.setAttribute('aria-label','Minh họa');fallback.textContent=emoji;}
        else{
          const heading=document.createElement('span'),meaning=document.createElement('strong');
          heading.textContent='📖 Nghĩa tiếng Việt';meaning.textContent=image.dataset.fallbackVi||'';
          fallback.setAttribute('lang','vi');fallback.append(heading,meaning);
        }
        image.replaceWith(fallback);
      };
      root.addEventListener('click',clickHandler);root.addEventListener('input',inputHandler);root.addEventListener('change',changeHandler);
      root.addEventListener('error',imageErrorHandler,true);
    }
    const tab=Object.prototype.hasOwnProperty.call(TABS,next.tabId)?next.tabId:'discover';
    await hub(tab);
  }
  window.CLASS3_SUBJECT_MODULES=window.CLASS3_SUBJECT_MODULES||{};
  window.CLASS3_SUBJECT_MODULES.english=Object.freeze({render,destroy});

  const CSS = `
/* TA2-style Vocabulary Level hub (Class 3 standalone). */
/* Class 2 M3-M5 presentation; uses Class 3 SGK vocabulary without a Class 2 runtime. */
#class3-english-runtime .ta3-shared-hub{max-width:80rem;margin:0 auto;padding:12px 10px 18px}
#class3-english-runtime .ta3-shared-hub-intro{text-align:center;margin:8px auto 21px}
#class3-english-runtime .ta3-shared-hub-intro h2{font-size:22px;font-weight:950;color:#7c3aed;margin:0 0 5px}
#class3-english-runtime .ta3-shared-hub-intro p{font-size:20px;font-weight:850;color:#475569;margin:4px 0}
#class3-english-runtime .ta3-shared-hub-intro small{font-size:20px;font-weight:750;color:#64748b}
#class3-english-runtime .ta3-shared-study{max-width:970px;margin:auto;padding:8px 8px 16px;color:#334155}
#class3-english-runtime .ta3-shared-progress{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:9px;margin:3px auto 10px;font-size:20px;color:#7c3aed;font-weight:900}
#class3-english-runtime .ta3-shared-progress>span{color:#be185d;padding:5px 10px;background:#fff1f7;border:1px solid #fbcfe8;border-radius:99px}
#class3-english-runtime .ta3-shared-paper{background:transparent;border:0;box-shadow:none;min-height:190px}
#class3-english-runtime .ta3-shared-rl-screen,#class3-english-runtime .ta3-shared-fm-screen,#class3-english-runtime .ta3-shared-odd-screen{width:100%;margin:auto;padding:8px 5px 0;text-align:center;background:transparent}
#class3-english-runtime .ta3-shared-paper h3{font-size:clamp(22px,2.8vw,28px);font-weight:950;line-height:1.25;color:#1e293b;margin:6px 0}
#class3-english-runtime .ta3-shared-paper h3+p{font-size:clamp(20px,1.9vw,20px);font-weight:800;color:#64748b;line-height:1.35;margin:5px auto 12px}
#class3-english-runtime .ta3-shared-prompt-listen{display:inline-flex;vertical-align:middle;align-items:center;justify-content:center;min-height:32px;margin-left:8px;padding:4px 10px;border:1px solid #c4b5fd;border-radius:10px;background:#f5f3ff;color:#6d28d9;font-size:20px;font-weight:850;cursor:pointer}
#class3-english-runtime .ta3-shared-prompt-listen:hover{border-color:#8b5cf6;background:#ede9fe} 
#class3-english-runtime .ta3-shared-rl-line{display:flex;flex-wrap:wrap;gap:5px 12px;justify-content:center;align-items:center;margin:21px auto 10px;min-height:72px}
#class3-english-runtime .ta3-shared-rl-group{display:inline-flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:5px;max-width:100%}
#class3-english-runtime .ta3-shared-space{display:inline-block;width:15px;height:1px}
#class3-english-runtime .ta3-shared-tile{display:inline-flex;align-items:center;justify-content:center;flex:0 0 auto;min-width:55px;height:65px;padding:0 6px;border:1px solid #e9a8ff;border-radius:15px;background:#f5eaff;color:#9d00e8;font-size:clamp(31px,3.8vw,41px);font-weight:950;line-height:1;box-shadow:0 2px 5px rgba(109,40,217,.06);transform:none!important;transition:border-color .16s,background .16s,color .16s}
#class3-english-runtime button.ta3-shared-tile:hover{border-color:#a855f7;background:#f0dcff}
#class3-english-runtime button.ta3-shared-tile:focus-visible{outline:3px solid #c084fc;outline-offset:3px}
#class3-english-runtime .ta3-shared-tile.is-wrong{border-color:#fb7185;background:#ffe4e6;color:#be123c}
#class3-english-runtime .ta3-shared-tile.is-solved{border-color:#86efac;background:#ecfdf5;color:#047857;box-shadow:none}
#class3-english-runtime .ta3-shared-tile.moved{background:#f5edff;border-color:#d8b4fe;color:#7e22ce}
#class3-english-runtime .ta3-shared-tile.moved.is-wrong{color:#be123c;border-color:#fda4af;background:#fff1f2}
#class3-english-runtime .ta3-shared-mark{font-size:29px;font-weight:900;color:#8b5cf6}
#class3-english-runtime .ta3-shared-removed-area{padding-top:8px;margin-top:6px;border-top:1px dashed #e9d5ff}
#class3-english-runtime .ta3-shared-removed-label{font-size:20px;font-weight:850;color:#8b5cf6}
#class3-english-runtime .ta3-shared-removed-line{display:flex;flex-wrap:wrap;justify-content:center;align-items:center;gap:8px;min-height:53px;margin-top:4px}
#class3-english-runtime .ta3-shared-removed-line>span{font-size:20px;color:#c4b5fd;font-weight:750}
#class3-english-runtime .ta3-shared-feedback{min-height:27px;margin:8px auto 0;color:#6d28d9;font-size:20px;font-weight:850}
#class3-english-runtime .ta3-shared-feedback.bad{color:#b91c1c}
#class3-english-runtime .ta3-shared-result{display:flex;flex-direction:column;align-items:center;gap:7px;margin:12px auto 0}
#class3-english-runtime .ta3-shared-success{font-size:20px;line-height:1.3;color:#047857;font-weight:950;margin:7px auto}
#class3-english-runtime .ta3-shared-answer-line{display:flex;align-items:center;justify-content:center;gap:8px 12px;flex-wrap:wrap}
#class3-english-runtime .ta3-shared-answer-line strong{font-size:clamp(29px,3.6vw,39px);color:#047857;font-weight:950;line-height:1.18}
#class3-english-runtime .ta3-shared-answer-line span{font-size:clamp(20px,2.4vw,24px);color:#7e22ce;font-weight:850}
#class3-english-runtime .ta3-shared-answer-line em{font-size:clamp(20px,2vw,21px);color:#475569;font-style:normal;font-weight:800}
#class3-english-runtime .ta3-shared-answer-line button{background:#f5edff;border:1px solid #e9d5ff;border-radius:12px;color:#7e22ce;font-size:20px;font-weight:900;min-height:39px;padding:7px 14px}
#class3-english-runtime .ta3-shared-fm-word{display:flex;justify-content:center;align-items:center;flex-wrap:wrap;min-width:0;max-width:100%;margin:19px auto;font-size:clamp(35px,5vw,48px);font-weight:950;letter-spacing:.055em;line-height:1.3;color:#a21caf;overflow-wrap:anywhere}
#class3-english-runtime .ta3-shared-missing{display:inline-flex;justify-content:center;align-items:center;margin:0 3px;min-width:.8em;color:#ec4899;border-bottom:3px solid #f472b6;line-height:1.08}
#class3-english-runtime .ta3-shared-missing.is-solved{color:#047857;border-color:#86efac}
#class3-english-runtime .ta3-shared-fm-options{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;width:100%;max-width:860px;margin:0 auto}
#class3-english-runtime .ta3-shared-fill-option{min-width:0;width:100%;min-height:61px;padding:11px 17px;border:1px solid #f9a8d4;border-radius:17px;background:#fffafc;font-size:25px;box-shadow:0 2px 5px rgba(126,34,206,.05);text-align:left;transform:none!important;color:#be185d}
#class3-english-runtime .ta3-shared-fill-option b{margin-right:12px;font-size:20px;color:#ec4899}
#class3-english-runtime .ta3-shared-fill-option:hover{background:#fff1f7;border-color:#ec4899}
#class3-english-runtime .ta3-shared-fill-option.correct{background:#dcfce7;border-color:#86efac;color:#166534}
#class3-english-runtime .ta3-shared-fill-option.wrong{background:#ffe4e6;border-color:#fda4af;color:#9f1239}
#class3-english-runtime .ta3-shared-odd-options{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px 15px;width:100%;max-width:900px;margin:15px auto}
#class3-english-runtime .ta3-shared-odd-option{border:2px solid #f5d0fe;background:#fff;color:#7c3aed;border-radius:18px;min-height:94px;padding:12px 7px;text-align:center;display:flex;align-items:center;justify-content:center;gap:4px;flex-direction:column;transition:border-color .15s,background .15s;transform:none!important}
#class3-english-runtime .ta3-shared-odd-option:hover{border-color:#e879f9;background:#fdf4ff}
#class3-english-runtime .ta3-shared-odd-option strong{font-size:clamp(20px,2vw,21px);font-weight:950}
#class3-english-runtime .ta3-shared-odd-option span{font-size:clamp(20px,1.65vw,20px);font-weight:800;color:#64748b;line-height:1.3}
#class3-english-runtime .ta3-shared-odd-option em{font-size:clamp(20px,1.75vw,20px);font-style:normal;font-weight:850;color:#c026d3;line-height:1.3}
#class3-english-runtime .ta3-shared-odd-option small{font-size:20px;color:#94a3b8;font-weight:800}
#class3-english-runtime .ta3-shared-odd-option.correct{border-color:#34d399;background:#ecfdf5;color:#047857}
#class3-english-runtime .ta3-shared-odd-option.wrong{border-color:#fb7185;background:#fff1f2;color:#be123c}
#class3-english-runtime .ta3-shared-nav{display:grid;grid-template-columns:minmax(0,1fr) 80px minmax(0,1fr);gap:10px;align-items:center;max-width:850px;margin:22px auto 0}
#class3-english-runtime .ta3-shared-nav button{min-height:44px;padding:8px 12px;border:1px solid #ddd6fe;border-radius:12px;background:#faf5ff;color:#6d28d9;font-size:20px;font-weight:950}
#class3-english-runtime .ta3-shared-nav button.primary{background:#7c3aed;border-color:#7c3aed;color:#fff}
#class3-english-runtime .ta3-shared-nav button:disabled{opacity:.42;cursor:not-allowed}
#class3-english-runtime .ta3-shared-nav span{text-align:center;font-size:20px;color:#64748b;font-weight:900}
#class3-english-runtime .ta3-shared-flyer{display:flex;align-items:center;justify-content:center;border-radius:15px;border:1px solid #e9a8ff;background:#f5eaff;color:#9d00e8;font-size:38px;font-weight:950}
@media(max-width:640px){#class3-english-runtime .ta3-shared-study{padding:5px 3px 11px}#class3-english-runtime .ta3-shared-rl-line{gap:7px 10px;margin:18px auto 9px}#class3-english-runtime .ta3-shared-rl-group{gap:4px}#class3-english-runtime .ta3-shared-space{width:8px}#class3-english-runtime .ta3-shared-tile{min-width:43px;height:55px;padding:0 4px;font-size:31px;border-radius:12px}#class3-english-runtime .ta3-shared-removed-line{min-height:46px}#class3-english-runtime .ta3-shared-fm-word{margin:15px auto 17px;letter-spacing:.025em}#class3-english-runtime .ta3-shared-fill-option{min-height:57px;padding:9px 12px}#class3-english-runtime .ta3-shared-odd-options{gap:8px}#class3-english-runtime .ta3-shared-odd-option{min-height:90px;padding:8px 4px}#class3-english-runtime .ta3-shared-nav{grid-template-columns:minmax(0,1fr) 60px minmax(0,1fr);gap:6px}#class3-english-runtime .ta3-shared-nav button{font-size:20px;padding:7px 5px}}
@media(prefers-reduced-motion:reduce){#class3-english-runtime .ta3-shared-flyer{animation:none!important}}

#class3-english-runtime .ta3-vocab-hub,#class3-english-runtime .ta3-vocab-study{width:100%;max-width:82rem;margin:0 auto;padding:12px 10px 20px}
#class3-english-runtime .ta3-vocab-hub-heading{text-align:center;margin:8px auto 22px}
#class3-english-runtime .ta3-vocab-hub-heading h2{color:#6d28d9;font-size:22px;margin:0 0 7px;font-weight:950}
#class3-english-runtime .ta3-vocab-hub-heading p{font-size:20px;font-weight:850;color:#475467;margin:4px 0}
#class3-english-runtime .ta3-vocab-hub-heading small{color:#64748b;font-size:20px}
#class3-english-runtime .ta3-sgk-quiz-hub .ta3-vocab-level{min-height:114px}
#class3-english-runtime .ta3-sgk-quiz-hub .ta3-vocab-level small.ta3-sgk-level-topics{font-size:20px;line-height:1.35;font-weight:750;color:#64748b}
#class3-english-runtime .ta3-sgk-reading-pane{align-self:start;padding:19px 21px;border-radius:19px;border:1px solid #bfdbfe;background:linear-gradient(140deg,#eff6ff,#f8faff);color:#334155;box-shadow:0 4px 12px rgba(51,65,85,.05)}
#class3-english-runtime .ta3-sgk-reading-pane>strong{display:block;font-size:20px;color:#1d4ed8;font-weight:900;margin:0 0 10px}
#class3-english-runtime .ta3-sgk-reading-pane p{font-size:20px;line-height:1.7;white-space:pre-line;text-align:left;margin:0 0 14px;font-weight:750;overflow-wrap:break-word}
#class3-english-runtime .ta3-sgk-reading-pane .ta3-listen{min-height:39px;color:#1d4ed8;border:1px solid #93c5fd;background:#fff}
@media(max-width:760px){#class3-english-runtime .ta3-sgk-reading-pane{padding:14px 16px}#class3-english-runtime .ta3-sgk-reading-pane p{font-size:20px}}
#class3-english-runtime .ta3-sgk-unit-tag{text-align:center;display:table;margin:8px auto 0;padding:4px 12px;border-radius:99px;border:1px solid #c4b5fd;background:#f5f3ff;color:#6d28d9;font-size:20px;font-weight:850}
#class3-english-runtime .ta3-sgk-unit-tag+.ta3-question-text{white-space:pre-line;margin-top:10px}
#class3-english-runtime .ta3-vocab-level-grid{max-width:1024px;margin:0 auto;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:15px}
#class3-english-runtime .ta3-vocab-level{--c:#db2777;--bg:#fdf2f8;--border:#f9a8d4;display:flex;align-items:center;justify-content:space-between;gap:15px;text-align:left;padding:19px;border-radius:18px;border:1.5px solid var(--border);background:var(--bg);min-height:95px;transition:border-color .15s ease,box-shadow .15s ease}
#class3-english-runtime .ta3-vocab-level[data-tone="blue"]{--c:#0284c7;--bg:#eff8ff;--border:#93c5fd}
#class3-english-runtime .ta3-vocab-level[data-tone="purple"]{--c:#7c3aed;--bg:#f5f3ff;--border:#c4b5fd}
#class3-english-runtime .ta3-vocab-level[data-tone="green"]{--c:#047857;--bg:#ecfdf5;--border:#86efac}
#class3-english-runtime .ta3-vocab-level:hover{border-color:var(--c);box-shadow:0 0 0 1px var(--c),0 0 12px rgba(168,85,247,.11);transform:none}
#class3-english-runtime .ta3-vocab-level>span{display:flex;flex-direction:column;gap:8px;min-width:0}
#class3-english-runtime .ta3-vocab-level strong{font-size:20px;font-weight:950;color:var(--c)}
#class3-english-runtime .ta3-vocab-level small{font-size:20px;color:#64748b;font-weight:850}
#class3-english-runtime .ta3-vocab-level>b{white-space:nowrap;font-size:20px;color:var(--c);background:white;padding:7px 10px;border-radius:99px;border:1px solid var(--border)}
#class3-english-runtime .ta3-vocab-hub-note{text-align:center;color:#64748b;font-weight:800;margin:24px auto}
#class3-english-runtime .ta3-vocab-tabs{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;margin:0 0 14px}
#class3-english-runtime .ta3-vocab-tabs button{min-height:49px;border:1.5px solid #fbcfe8;border-radius:14px;background:#fff;color:#475569;padding:8px 5px;font-size:20px;font-weight:900}
#class3-english-runtime .ta3-vocab-tabs button.active{background:linear-gradient(105deg,#ec4899,#8b5cf6);color:#fff;border-color:#c084fc;box-shadow:0 4px 10px rgba(139,92,246,.16)}
#class3-english-runtime .ta3-vocab-columns{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:15px;align-items:stretch}
#class3-english-runtime .ta3-vocab-card,#class3-english-runtime .ta3-vocab-examples-panel,#class3-english-runtime .ta3-vocab-speak-panel,#class3-english-runtime .ta3-vocab-picture-panel,#class3-english-runtime .ta3-vocab-examples{padding:13px;border-radius:22px;border:2px solid #fbcfe8;background:#fdf2f8;text-align:center;min-width:0}
#class3-english-runtime .ta3-vocab-examples,#class3-english-runtime .ta3-vocab-examples-panel{background:linear-gradient(135deg,#fdf2f8,#fff,#f5f3ff);border-color:#e9d5ff;text-align:left}
#class3-english-runtime .ta3-vocab-examples h3{color:#c026d3;font-weight:950;font-size:20px;margin:0 0 10px}
#class3-english-runtime .ta3-vocab-example{display:flex;align-items:center;gap:10px;background:#fff;border:1px solid #f5d0fe;border-radius:14px;padding:12px;margin-bottom:9px}
#class3-english-runtime .ta3-vocab-example p{margin:0;flex:1;font-weight:850;color:#334155;font-size:20px;line-height:1.4}
#class3-english-runtime .ta3-vocab-example mark{background:#fce7f3;color:#be185d;padding:1px 3px;border-radius:4px}
#class3-english-runtime .ta3-vocab-example button{flex:0 0 auto;background:#e0f2fe;color:#0369a1;border-radius:10px;min-width:42px;min-height:42px}
#class3-english-runtime .ta3-vocab-image{height:clamp(220px,24vw,290px);background:#fff;border:1px solid #fce7f3;border-radius:19px;overflow:hidden;display:flex;align-items:center;justify-content:center;margin:0 auto 12px}
#class3-english-runtime .ta3-vocab-image img{width:100%;height:100%;object-fit:contain}
#class3-english-runtime .ta3-vocab-picture-emoji{font-size:clamp(85px,12vw,130px);line-height:1.1;filter:drop-shadow(0 7px 7px rgba(104,74,163,.11))}
#class3-english-runtime .ta3-vocab-svg-object{display:block;width:min(88%,260px);height:min(85%,180px);margin:auto}
#class3-english-runtime .ta3-vocab-number-visual{display:flex;align-items:center;justify-content:center;width:min(78%,185px);height:170px;border-radius:34px;background:linear-gradient(150deg,#fef3c7,#fce7f3 75%,#ede9fe);border:3px solid #fbcfe8;box-shadow:0 8px 24px rgba(192,132,252,.12);font-size:92px;font-weight:950;line-height:1;color:#7c3aed;font-variant-numeric:lining-nums tabular-nums}
#class3-english-runtime .ta3-vocab-card h2{color:#1e293b;font-weight:950;font-size:31px;margin:5px 0}
#class3-english-runtime .ta3-vocab-ipa{font-weight:400;font-size:20px;color:#111827;margin:5px 0}
#class3-english-runtime .ta3-vocab-vi{font-weight:800;font-size:24px;line-height:1.35;color:#64748b;margin:7px 0}
#class3-english-runtime .ta3-vocab-listen{min-height:43px;padding:9px 15px;border:1.5px solid #bae6fd;background:#e0f2fe;color:#0369a1;border-radius:12px;font-size:20px;font-weight:900;margin:8px 0}
#class3-english-runtime .ta3-vocab-prompt{display:flex;align-items:center;justify-content:center;gap:10px;margin:7px 0 12px}
#class3-english-runtime .ta3-vocab-prompt h2{font-size:23px;color:#1e293b;font-weight:950;margin:0}
#class3-english-runtime .ta3-vocab-prompt button{border-radius:50%;background:#e0f2fe;min-width:38px;min-height:38px}
/* Keep the hint visible before and after solving, inside the picture frame. */
#class3-english-runtime .ta3-vocab-puzzle-image{position:relative;padding-bottom:72px}
#class3-english-runtime .ta3-vocab-puzzle-meaning{position:absolute;bottom:7px;left:10px;right:10px;margin:0;padding:6px 8px;background:#fff;border-radius:9px;color:#111827;font-size:24px;font-weight:900;line-height:1.25;text-align:center;overflow-wrap:anywhere}
#class3-english-runtime .ta3-vocab-picture-panel{border-style:dashed}
#class3-english-runtime .ta3-vocab-safe-placeholder{font-weight:850;color:#94a3b8;font-size:20px;display:block;text-align:center;padding:9px}
#class3-english-runtime .ta3-vocab-choices{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:11px;margin:16px auto 0;width:100%;max-width:100%}
#class3-english-runtime .ta3-vocab-choice{display:flex;align-items:center;gap:12px;text-align:left;min-height:70px;border:2px solid #fbcfe8;border-radius:16px;padding:11px 14px;background:white;color:#334155}
#class3-english-runtime .ta3-vocab-choice>b{font-size:20px;color:#db2777}
#class3-english-runtime .ta3-vocab-answer-copy{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
#class3-english-runtime .ta3-vocab-answer-copy strong{font-size:20px;font-weight:900}
#class3-english-runtime .ta3-vocab-answer-copy small{font-size:20px;font-weight:400;color:#111827}
#class3-english-runtime .ta3-vocab-answer-copy em{font-size:20px;font-weight:750;color:#64748b;font-style:normal}
#class3-english-runtime .ta3-vocab-choice.wrong{background:#fff1f2;border-color:#fb7185}
#class3-english-runtime .ta3-vocab-choice.correct{background:#ecfdf5;border-color:#34d399}
#class3-english-runtime .ta3-vocab-choice-replay{margin-left:auto;flex:0 0 auto;display:inline-flex;align-items:center;justify-content:center;width:32px;height:32px;border:1px solid #bae6fd;border-radius:10px;background:#eff8ff;font-size:18px}
#class3-english-runtime .ta3-vocab-choice:hover{border-color:#c084fc;box-shadow:0 2px 10px rgba(139,92,246,.09)}
#class3-english-runtime .ta3-vocab-choice:focus-visible{outline:3px solid #a78bfa;outline-offset:2px}
#class3-english-runtime .ta3-vocab-listening{text-align:center;width:100%;max-width:100%;margin:0 auto}
#class3-english-runtime .ta3-vocab-listening h2{font-weight:950;font-size:25px;color:#1e293b;margin:10px 0 3px}
#class3-english-runtime .ta3-vocab-listening p{font-size:20px;color:#64748b;font-weight:850}
#class3-english-runtime .ta3-vocab-sound,#class3-english-runtime .ta3-vocab-mic{width:82px;height:82px;border:0;border-radius:50%;background:linear-gradient(135deg,#ec4899,#8b5cf6);color:#fff;font-size:31px;box-shadow:0 7px 17px rgba(139,92,246,.2);margin:12px auto}
#class3-english-runtime .ta3-vocab-speak-panel h2{font-weight:950;color:#6d28d9;font-size:23px}
#class3-english-runtime .ta3-vocab-speak-panel>p{color:#64748b;font-weight:800}
#class3-english-runtime .ta3-vocab-mic.listening{background:linear-gradient(135deg,#f43f5e,#c026d3);box-shadow:0 0 0 9px rgba(244,63,94,.11)}
#class3-english-runtime .ta3-vocab-speech-status{background:#fff;border:1px solid #e9d5ff;border-radius:12px;padding:12px;color:#7e22ce;font-weight:850;min-height:52px;margin:10px auto 12px}
#class3-english-runtime .ta3-vocab-speech-status[data-status="good"]{background:#ecfdf5;border-color:#86efac;color:#047857}
#class3-english-runtime .ta3-vocab-speech-status[data-status="retry"]{background:#fff7ed;border-color:#fed7aa;color:#9a3412}
#class3-english-runtime .ta3-vocab-nav{max-width:520px;margin:22px auto 6px;display:grid;grid-template-columns:1fr 90px 1fr;gap:10px}
#class3-english-runtime .ta3-vocab-nav button,#class3-english-runtime .ta3-vocab-nav span{min-height:44px;padding:8px 10px;border:1.5px solid #ddd6fe;border-radius:14px;background:#faf5ff;color:#6d28d9;font-size:20px;font-weight:950;display:flex;align-items:center;justify-content:center}
#class3-english-runtime .ta3-vocab-nav button:last-child{background:linear-gradient(105deg,#ec4899,#8b5cf6);color:#fff;border:0}
#class3-english-runtime .ta3-vocab-nav span{background:white}
#class3-english-runtime .ta3-vocab-return{display:block;margin:16px auto;padding:9px 12px;color:#7c3aed;font-size:20px;font-weight:850}
@media(max-width:767px){
#class3-english-runtime .ta3-vocab-level-grid,#class3-english-runtime .ta3-vocab-columns{grid-template-columns:1fr}
#class3-english-runtime .ta3-vocab-level strong{font-size:20px}
#class3-english-runtime .ta3-vocab-tabs{grid-template-columns:repeat(2,minmax(0,1fr));gap:7px}
#class3-english-runtime .ta3-vocab-tabs button{font-size:20px;min-height:50px}
#class3-english-runtime .ta3-vocab-choices{grid-template-columns:1fr}
#class3-english-runtime .ta3-vocab-image{height:245px}
#class3-english-runtime .ta3-vocab-prompt h2{font-size:20px}
#class3-english-runtime .ta3-vocab-hub,#class3-english-runtime .ta3-vocab-study{padding:9px 4px 16px}
}
@media(prefers-reduced-motion:reduce){#class3-english-runtime .ta3-vocab-level,#class3-english-runtime .ta3-vocab-tabs button{transition:none!important}}

/* Vocabulary 2: Class 2 visual/interaction parity, Class 3 SGK data only */
#class3-english-runtime .ta3-vocab-tabs{gap:9px;margin-bottom:11px}
#class3-english-runtime .ta3-vocab-tabs button{font-size:20px;min-height:48px}
#class3-english-runtime .ta3-vocab-columns{gap:12px}
#class3-english-runtime .ta3-vocab-card,#class3-english-runtime .ta3-vocab-examples-panel,#class3-english-runtime .ta3-vocab-speak-panel,#class3-english-runtime .ta3-vocab-picture-panel,#class3-english-runtime .ta3-vocab-examples{padding:10px;border-radius:23px}
#class3-english-runtime .ta3-vocab-card{background:rgba(253,242,248,.43);display:flex;flex-direction:column;align-items:center;justify-content:flex-start}
#class3-english-runtime .ta3-vocab-image{height:clamp(220px,23vw,270px);width:100%;margin:0 auto 7px}
#class3-english-runtime .ta3-vocab-word-row{display:flex;align-items:center;justify-content:center;gap:10px;min-height:42px}
#class3-english-runtime .ta3-vocab-word-sound{width:38px;height:38px;border-radius:50%;background:#e0f2fe;color:#0369a1;flex:0 0 auto}
#class3-english-runtime .ta3-vocab-card h2{font-size:27px;margin:2px 0}
#class3-english-runtime .ta3-vocab-examples h3{font-size:20px;margin:0 0 8px}
#class3-english-runtime .ta3-vocab-examples-wait{font-size:20px;color:#c026d3;font-weight:900}
#class3-english-runtime .ta3-vocab-example{padding:10px 12px;gap:8px;min-height:57px}
#class3-english-runtime .ta3-vocab-example-text{flex:1;min-width:0}
#class3-english-runtime .ta3-vocab-example p{font-size:20px;line-height:1.45}
#class3-english-runtime .ta3-vocab-example small{display:block;margin:6px 0 0;color:#64748b;font-size:20px;line-height:1.5;font-weight:750}
#class3-english-runtime .ta3-vocab-example button{min-height:42px;min-width:42px}
#class3-english-runtime .ta3-vocab-choices{gap:10px;margin-top:10px}
#class3-english-runtime .ta3-vocab-choice{min-height:57px;padding:8px 12px;border-width:1.5px}
#class3-english-runtime .ta3-vocab-choice strong{font-size:20px}
#class3-english-runtime .ta3-vocab-choice small{font-size:20px}
#class3-english-runtime .ta3-vocab-meaning-clue{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:13px;color:#111827;padding:15px;text-align:center}
#class3-english-runtime .ta3-vocab-meaning-clue span{font-size:20px;font-weight:700;color:#111827}
#class3-english-runtime .ta3-vocab-meaning-clue strong{font-size:clamp(20px,2vw,27px);color:#1f2937;font-weight:700}
#class3-english-runtime .ta3-vocab-current-topic{padding:4px 8px;border-radius:999px;background:#fdf2f8;color:#be185d;border:1px solid #fbcfe8;font-size:20px;font-weight:850}
#class3-english-runtime .ta3-vocab-speak-panel{background:linear-gradient(125deg,#fff,#f5f3ff)}
#class3-english-runtime .ta3-vocab-speak-panel>.ta3-vocab-examples{width:100%;margin-top:6px;background:transparent;border:0;padding:8px 0 0;border-top:1px solid #f5d0fe}
#class3-english-runtime .ta3-vocab-speak-panel .ta3-vocab-example{background:#fff}
@media(max-width:767px){#class3-english-runtime .ta3-vocab-study{padding:6px 3px 12px}
#class3-english-runtime .ta3-vocab-tabs{grid-template-columns:repeat(2,minmax(0,1fr));gap:7px}
#class3-english-runtime .ta3-vocab-tabs button{font-size:20px;padding:5px 2px;min-height:46px}
#class3-english-runtime .ta3-vocab-choices{grid-template-columns:1fr}
#class3-english-runtime .ta3-vocab-image{height:205px}
#class3-english-runtime .ta3-vocab-card h2{font-size:23px}
#class3-english-runtime .ta3-vocab-vi{font-size:22px}
#class3-english-runtime .ta3-vocab-example p{font-size:20px;line-height:1.42}
#class3-english-runtime .ta3-vocab-example small{font-size:20px;line-height:1.48}
}

#class3-english-runtime{max-width:82rem;margin:0 auto;color:#344054;font-family:"Nunito","Segoe UI",Arial,sans-serif}
#class3-english-runtime *{box-sizing:border-box}
#class3-english-runtime button{font:inherit;cursor:pointer}
#class3-english-runtime button:disabled{opacity:.52;cursor:not-allowed}
#class3-english-runtime h2,#class3-english-runtime h3,#class3-english-runtime h4{color:#612063;line-height:1.25}
#class3-english-runtime p,#class3-english-runtime li{line-height:1.6}
#class3-english-runtime .ta3-heading{display:flex;justify-content:space-between;align-items:flex-start;gap:14px;margin:4px 0 15px}
#class3-english-runtime .ta3-heading h2{font-size:clamp(23px,2.4vw,30px);font-weight:950;margin:0}
#class3-english-runtime .ta3-heading p{font-size:20px;color:#667085;margin:5px 0 0;font-weight:750}
#class3-english-runtime .ta3-back,#class3-english-runtime .ta3-submit{border:0;border-radius:14px;background:linear-gradient(105deg,#ec4899,#8b5cf6);color:#fff;font-weight:950;padding:10px 16px;min-height:44px;box-shadow:0 5px 12px rgba(139,92,246,.15)}
#class3-english-runtime .ta3-folder-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(275px,1fr));gap:11px}
#class3-english-runtime .ta3-folder{--color:#7c3aed;--bg:#f5f3ff;--br:#c4b5fd;--icon-bg:#ede9fe;width:100%;min-width:0;min-height:132px;padding:13px 14px;border:1.5px solid var(--br);border-radius:18px;background:var(--bg);box-shadow:0 3px 9px rgba(76,29,149,.065);color:#344054;text-align:left;display:flex;flex-direction:column;justify-content:space-between;gap:11px;transition:border-color .17s ease,box-shadow .17s ease,filter .17s ease}
#class3-english-runtime .ta3-folder[data-tone="0"]{--color:#be185d;--bg:#fff1f7;--br:#f9a8d4;--icon-bg:#fce7f3}
#class3-english-runtime .ta3-folder[data-tone="1"]{--color:#047857;--bg:#ecfdf5;--br:#86efac;--icon-bg:#d1fae5}
#class3-english-runtime .ta3-folder[data-tone="2"]{--color:#6d28d9;--bg:#f5f3ff;--br:#c4b5fd;--icon-bg:#ede9fe}
#class3-english-runtime .ta3-folder[data-tone="3"]{--color:#b45309;--bg:#fffbeb;--br:#fcd34d;--icon-bg:#fef3c7}
#class3-english-runtime .ta3-folder[data-tone="4"]{--color:#0369a1;--bg:#eff8ff;--br:#7dd3fc;--icon-bg:#e0f2fe}
#class3-english-runtime .ta3-folder[data-tone="5"]{--color:#be123c;--bg:#fff1f2;--br:#fda4af;--icon-bg:#ffe4e6}
#class3-english-runtime .ta3-folder:hover,#class3-english-runtime .ta3-folder:focus-visible{translate:0 0!important;border-color:var(--color);box-shadow:0 0 0 2px color-mix(in srgb,var(--color) 13%,transparent),0 7px 16px rgba(109,40,217,.1);filter:brightness(1.012);transform:none!important}
#class3-english-runtime .ta3-folder-head{display:flex;align-items:flex-start;gap:12px}
#class3-english-runtime .ta3-icon{width:60px;height:60px;flex:0 0 60px;display:flex;align-items:center;justify-content:center;border-radius:17px;background:var(--icon-bg);border:2px solid var(--br);font-size:36px;line-height:1;box-shadow:0 3px 9px rgba(109,40,217,.1),inset 0 1px 2px #fff;transition:transform .17s ease,box-shadow .17s ease}
#class3-english-runtime .ta3-folder:is(:hover,:focus-visible) .ta3-icon{transform:scale(1.1);box-shadow:0 5px 12px rgba(109,40,217,.18),inset 0 1px 2px #fff}
#class3-english-runtime .ta3-folder-copy{flex:1;min-width:0}
#class3-english-runtime .ta3-folder-copy strong{display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;overflow:hidden;color:var(--color);font-size:20px;font-weight:950;line-height:1.25}
#class3-english-runtime .ta3-folder-copy small{display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;overflow:hidden;color:#475467;font-size:20px;line-height:1.38;margin-top:6px;font-weight:750}
#class3-english-runtime .ta3-folder-foot{display:flex;justify-content:space-between;align-items:center;gap:5px;border-top:1px solid rgba(124,58,237,.11);padding-top:7px;font-size:20px;font-weight:900;color:var(--color)}
#class3-english-runtime .ta3-folder[data-action="discover-group"] .ta3-folder-foot{font-size:20px;line-height:1.3}
#class3-english-runtime .ta3-folder[data-action="discover-group"] .ta3-folder-foot span{min-width:0}
#class3-english-runtime .ta3-locked{background:#f8fafc!important;border-color:#cbd5e1!important;opacity:.8}
#class3-english-runtime .ta3-switch,#class3-english-runtime .ta3-page-tabs,#class3-english-runtime .ta3-center-actions{display:flex;flex-wrap:wrap;gap:11px;margin:12px 0 16px}
#class3-english-runtime .ta3-switch button,#class3-english-runtime .ta3-mini{min-height:39px;padding:8px 14px;border-radius:12px;border:1.5px solid #c4b5fd;background:#faf5ff;color:#6d28d9;font-size:20px;font-weight:950}
#class3-english-runtime .ta3-switch button.on,#class3-english-runtime .ta3-mini.selected{background:linear-gradient(105deg,#ec4899,#8b5cf6);color:#fff;border-color:#8b5cf6;box-shadow:0 4px 10px rgba(139,92,246,.15)}
#class3-english-runtime .ta3-tts-tools{display:flex;flex-wrap:wrap;gap:12px;align-items:center;justify-content:space-between;margin:7px 0 12px;padding:8px 12px;background:#eff8ff;border-radius:14px;border:1px solid #bae6fd;font-weight:850;color:#0369a1}
#class3-english-runtime .ta3-tts-tools label{display:flex;gap:8px;align-items:center}
#class3-english-runtime .ta3-tts-tools input{accent-color:#8b5cf6;width:135px}
#class3-english-runtime .ta3-paper,#class3-english-runtime .ta3-result{padding:clamp(14px,2vw,24px);border:1px solid #e9d5ff;border-radius:21px;background:#fff;box-shadow:0 4px 15px rgba(76,29,149,.055)}
#class3-english-runtime .ta3-note{background:#fffbeb;color:#92400e;padding:12px 15px;border:1px solid #fcd34d;border-radius:14px;margin:12px 0;font-size:20px;font-weight:800}
#class3-english-runtime .ta3-note p{margin:6px 0}
#class3-english-runtime .ta3-lead{font-size:20px;font-weight:850;color:#475467}
#class3-english-runtime .ta3-phonics{padding:12px;margin:10px 0;border-radius:14px;background:#f5f3ff;border:1px solid #c4b5fd}
#class3-english-runtime .ta3-phonics>div{display:flex;gap:10px;flex-wrap:wrap;margin-top:9px}
#class3-english-runtime .ta3-phonics span{padding:6px 10px;border:1px solid #ddd6fe;border-radius:9px;background:white}
#class3-english-runtime .ta3-vocab-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:10px;margin:14px 0}
#class3-english-runtime .ta3-vocab{display:flex;flex-direction:column;align-items:center;gap:5px;padding:10px;border:1px solid #f9a8d4;border-radius:14px;background:#fff7fb;text-align:center;min-width:0}
#class3-english-runtime .ta3-vocab strong{font-size:20px;color:#7c3aed;overflow-wrap:anywhere}
#class3-english-runtime .ta3-vocab .ta3-picture{margin:2px;width:100%}
#class3-english-runtime .ta3-vocab .ta3-picture img{height:120px}
#class3-english-runtime .ta3-ipa{font-size:20px;color:#64748b;font-weight:700}
#class3-english-runtime .ta3-mini-emoji{font-size:30px}
#class3-english-runtime .ta3-task{padding:16px;margin:10px 0;border-radius:15px;border:1px solid #ddd6fe;background:#faf5ff}
#class3-english-runtime .ta3-task strong{font-size:20px}
#class3-english-runtime .ta3-quiz-top,#class3-english-runtime .ta3-quiz-footer{display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;color:#7c3aed;font-size:20px;font-weight:950}
#class3-english-runtime .ta3-quiz-footer{padding-top:14px;border-top:1px solid #f3e8ff}
#class3-english-runtime .ta3-question-layout.has-picture{display:grid;grid-template-columns:minmax(220px,.88fr) minmax(0,1.12fr);gap:18px;align-items:start}
#class3-english-runtime .ta3-question-text{font-size:clamp(20px,2.2vw,26px);font-weight:950;line-height:1.45;text-align:center;margin:14px 0;color:#5b216e}
#class3-english-runtime .ta3-question-vi{font-size:20px;color:#667085;text-align:center;margin:0 0 8px}
#class3-english-runtime .ta3-options{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin:15px 0}
#class3-english-runtime .ta3-choice{min-height:61px;text-align:left;display:flex;gap:12px;align-items:center;padding:12px 13px;border:1.5px solid #c4b5fd;border-radius:15px;background:#f5f3ff;color:#344054;font-size:20px;font-weight:850;transition:border-color .17s ease,box-shadow .17s ease,filter .17s ease}
#class3-english-runtime .ta3-choice:nth-child(4n+1){background:#fff1f7;border-color:#f9a8d4}
#class3-english-runtime .ta3-choice:nth-child(4n+2){background:#ecfdf5;border-color:#86efac}
#class3-english-runtime .ta3-choice:nth-child(4n+3){background:#f5f3ff;border-color:#c4b5fd}
#class3-english-runtime .ta3-choice:nth-child(4n+4){background:#eff8ff;border-color:#93c5fd}
#class3-english-runtime .ta3-choice b{width:30px;height:30px;flex:0 0 30px;display:flex;align-items:center;justify-content:center;border-radius:9px;background:#fff;color:#7c3aed;font-size:20px}
#class3-english-runtime .ta3-choice:hover,#class3-english-runtime .ta3-choice.chosen{border-color:#8b5cf6;box-shadow:0 0 0 2px rgba(139,92,246,.13);filter:brightness(1.01)}
#class3-english-runtime .ta3-choice.right{border-color:#10b981!important;background:#dcfce7!important;color:#047857}
#class3-english-runtime .ta3-choice.wrong{border-color:#fb7185!important;background:#fff1f2!important;color:#be123c}
#class3-english-runtime .ta3-typed{display:grid;gap:7px;padding:12px;background:#f5f3ff;border-radius:12px}
#class3-english-runtime .ta3-typed input{width:100%;min-height:49px;padding:10px;border:1.5px solid #c4b5fd;border-radius:11px;font-size:20px;color:#344054}
#class3-english-runtime .ta3-reorder{display:grid;gap:9px}
#class3-english-runtime .ta3-reorder-selected,#class3-english-runtime .ta3-reorder-deck{display:flex;gap:6px;flex-wrap:wrap;min-height:50px;align-items:center;padding:9px;border-radius:13px;border:1px dashed #c4b5fd;background:#faf5ff}
#class3-english-runtime .ta3-reorder-selected span,#class3-english-runtime .ta3-reorder-deck button{padding:8px 11px;border-radius:10px;background:#ede9fe;border:1px solid #a78bfa;font-weight:950;color:#6d28d9}
#class3-english-runtime .ta3-reorder-deck button{background:#fff1f7;border-color:#f9a8d4;color:#be185d}
#class3-english-runtime .ta3-nav{display:grid;grid-template-columns:minmax(0,1fr) 90px minmax(0,1fr);gap:10px;margin:20px 0}
#class3-english-runtime .ta3-nav button,#class3-english-runtime .ta3-nav span{min-height:46px;padding:9px 12px;display:flex;align-items:center;justify-content:center;border:1.5px solid #ddd6fe;border-radius:13px;background:#faf5ff;color:#6d28d9;font-size:20px;font-weight:950;text-align:center}
#class3-english-runtime .ta3-nav button.primary{background:linear-gradient(105deg,#ec4899,#8b5cf6);border-color:transparent;color:#fff}
#class3-english-runtime .ta3-nav span{background:#fff}
#class3-english-runtime .ta3-picture{margin:12px auto;max-width:580px;text-align:center}
#class3-english-runtime .ta3-picture img{display:block;width:100%;max-width:100%;max-height:380px;object-fit:contain;margin:0 auto;border:1px solid #e9d5ff;border-radius:17px}
#class3-english-runtime .ta3-picture figcaption{font-size:20px;color:#667085;margin:5px 0}
#class3-english-runtime .ta3-emoji{text-align:center;font-size:64px;margin:12px auto}
#class3-english-runtime .ta3-good,#class3-english-runtime .ta3-warning{padding:10px 13px;border-radius:13px;font-size:20px;font-weight:850;line-height:1.5}
#class3-english-runtime .ta3-good{background:#ecfdf5;color:#047857;border:1px solid #86efac}
#class3-english-runtime .ta3-warning{background:#fff1f2;color:#be123c;border:1px solid #fda4af}
#class3-english-runtime .ta3-flash{text-align:center}
#class3-english-runtime .ta3-flash h3{font-size:29px;margin:10px 0 0}
#class3-english-runtime .ta3-meaning{font-size:23px;color:#7c3aed;font-weight:950}
#class3-english-runtime .ta3-muted{color:#64748b;font-size:20px;font-weight:750}
#class3-english-runtime .ta3-center-actions{justify-content:center}
#class3-english-runtime .ta3-result{text-align:center;max-width:860px;margin:0 auto}
#class3-english-runtime .ta3-result h3{font-size:25px}
#class3-english-runtime .ta3-result ul{text-align:left;line-height:1.8}
#class3-english-runtime .ta3-medal{font-size:63px}
#class3-english-runtime .ta3-history{display:grid;gap:9px;margin:10px 0}
#class3-english-runtime .ta3-history article{padding:12px 15px;border:1px solid #ddd6fe;border-radius:15px;background:#fff}
#class3-english-runtime .ta3-history article p{margin:5px 0 0}
#class3-english-runtime .ta3-clock{color:#be185d}
#class3-english-runtime .ta3-loading,#class3-english-runtime .ta3-empty{min-height:220px;padding:25px;display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:12px;background:#fff;border:1px dashed #c4b5fd;border-radius:20px;color:#7c3aed;font-size:20px;font-weight:850;text-align:center}
#class3-english-runtime .ta3-empty{flex-direction:column}
#class3-english-runtime .ta3-spinner{width:24px;height:24px;border-radius:50%;border:3px solid #ddd6fe;border-top-color:#8b5cf6;animation:ta3spin .8s linear infinite}
@keyframes ta3spin{to{transform:rotate(360deg)}}
#class3-english-runtime .ta3-game-layout{display:grid;grid-template-columns:minmax(0,1fr) 230px;gap:15px;align-items:start}
#class3-english-runtime .ta3-word-grid{display:grid;grid-template-columns:repeat(11,minmax(0,1fr));gap:2px;max-width:620px}
#class3-english-runtime .ta3-word-grid button{aspect-ratio:1;border:1px solid #c4b5fd;border-radius:5px;background:#f5f3ff;color:#6d28d9;font-size:clamp(20px,2vw,20px);font-weight:950;padding:0}
#class3-english-runtime .ta3-word-grid button.selected{background:#fce7f3;border-color:#ec4899}
#class3-english-runtime .ta3-word-grid button.found{background:#d1fae5;border-color:#10b981;color:#047857}
#class3-english-runtime .ta3-game-words{display:grid;gap:8px}
#class3-english-runtime .ta3-game-words>div{padding:8px;border-radius:10px;border:1px solid #c4b5fd;background:#faf5ff;font-weight:950}
#class3-english-runtime .ta3-game-words>div.found{background:#d1fae5;border-color:#10b981}
@media(max-width:767px){
 #class3-english-runtime .ta3-folder-grid{grid-template-columns:1fr;gap:8px}
 #class3-english-runtime .ta3-folder{padding:10px;min-height:148px;border-radius:16px}
 #class3-english-runtime .ta3-folder-head{flex-direction:row;align-items:flex-start;gap:10px}
 #class3-english-runtime .ta3-icon{width:52px;height:52px;flex:0 0 52px;font-size:31px}
 #class3-english-runtime .ta3-folder-copy strong{font-size:20px}
 #class3-english-runtime .ta3-folder-copy small{font-size:20px}
 #class3-english-runtime .ta3-heading{flex-direction:column}
 #class3-english-runtime .ta3-question-layout.has-picture{grid-template-columns:1fr;gap:8px}
 #class3-english-runtime .ta3-options{grid-template-columns:1fr}
 #class3-english-runtime .ta3-choice{min-height:56px;font-size:20px}
 #class3-english-runtime .ta3-nav{grid-template-columns:minmax(0,1fr) 68px minmax(0,1fr);gap:5px}
 #class3-english-runtime .ta3-nav button,#class3-english-runtime .ta3-nav span{font-size:20px;padding:7px 5px}
 #class3-english-runtime .ta3-game-layout{grid-template-columns:1fr}
}

/* Class 3 Alphabet & IPA: faithful 1.1-1.4 visual port of TA2. No TA2 identity/runtime dependency. */
#class3-english-runtime .ta3-ta2-return{display:block;margin:12px auto 0;border:0;background:none;color:#7e22ce;font-size:20px;font-weight:900;padding:6px 10px;min-height:32px;}
#class3-english-runtime .ta3-ta2-return:hover{text-decoration:underline;}
#class3-english-runtime .ta3-ta2-menu-screen{display:flex;flex-direction:column;align-items:center;gap:10px;padding:6px 0 0;}
#class3-english-runtime .ta3-ta2-menu-lead{width:100%;max-width:900px;text-align:center;color:#475569;font-size:20px;font-weight:800;line-height:1.5;padding:14px;border:2px solid #fce7f3;border-radius:16px;background:rgba(253,242,248,.45);}
#class3-english-runtime .ta3-ta2-menu-listen{border:2px solid #ddd6fe;background:#ede9fe;color:#6d28d9;border-radius:13px;min-height:38px;padding:7px 16px;font-size:20px;font-weight:900;}
#class3-english-runtime .ta3-ta2-menu-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px;width:100%;max-width:1080px;margin:3px auto 0;}
#class3-english-runtime .ta3-ta2-menu-card{--ta2bg:#ffe8f1;--ta2bd:#f9a8d4;--ta2ink:#db2777;--ta2icbg:#fce7f3;--ta2hover:#f472b6;display:flex;align-items:center;justify-content:space-between;min-height:98px;padding:16px;gap:12px;width:100%;min-width:0;text-align:left;border:1.5px solid var(--ta2bd);border-radius:16px;background:var(--ta2bg);box-shadow:none;transition:border-color .18s ease,box-shadow .18s ease;transform:none!important;filter:none!important;color:#334155;}
#class3-english-runtime .ta3-ta2-menu-card[data-ta2-tone=sky]{--ta2bg:#e3f2ff;--ta2bd:#93c5fd;--ta2ink:#0284c7;--ta2icbg:#e0f2fe;--ta2hover:#60a5fa;}
#class3-english-runtime .ta3-ta2-menu-card[data-ta2-tone=violet]{--ta2bg:#eee4ff;--ta2bd:#c4b5fd;--ta2ink:#7c3aed;--ta2icbg:#ede9fe;--ta2hover:#a78bfa;}
#class3-english-runtime .ta3-ta2-menu-card[data-ta2-tone=green]{--ta2bg:#ddf8e9;--ta2bd:#86efac;--ta2ink:#059669;--ta2icbg:#d1fae5;--ta2hover:#34d399;}
#class3-english-runtime .ta3-ta2-menu-card:is(:hover,:focus-visible){background:var(--ta2bg);border-color:var(--ta2hover);box-shadow:0 0 0 1px rgba(148,163,184,.08);transform:none!important;filter:none!important;}
#class3-english-runtime .ta3-ta2-menu-inside{display:flex;gap:12px;align-items:center;min-width:0;}
#class3-english-runtime .ta3-ta2-menu-icon{width:56px;height:56px;flex:0 0 56px;border-radius:16px;border:2px solid var(--ta2bd);display:flex;align-items:center;justify-content:center;background:var(--ta2icbg);font-size:28px;line-height:1;box-shadow:inset 0 1px 3px #fff;transition:transform .18s ease;}
#class3-english-runtime .ta3-ta2-menu-card:hover .ta3-ta2-menu-icon{transform:scale(1.05);}
#class3-english-runtime .ta3-ta2-menu-copy{min-width:0;line-height:1.25;}
#class3-english-runtime .ta3-ta2-menu-copy>span{font-size:20px;font-weight:950;display:flex;gap:6px;align-items:baseline;color:#334155;white-space:nowrap;}
@media(max-width:960px){
 #class3-english-runtime .ta3-ta2-menu-grid{grid-template-columns:1fr;max-width:672px;}
}
#class3-english-runtime .ta3-ta2-menu-copy>span b{color:var(--ta2ink)}
#class3-english-runtime .ta3-ta2-menu-copy>span strong{color:var(--ta2ink);}
#class3-english-runtime .ta3-ta2-menu-copy small{display:block;margin-top:5px;font-size:20px;font-weight:850;color:#64748b;line-height:1.32;}
#class3-english-runtime .ta3-ta2-menu-count{flex:0 0 auto;padding:5px 9px;background:white;border:1px solid var(--ta2bd);border-radius:99px;font-size:20px;font-weight:900;white-space:nowrap;color:var(--ta2ink);}
#class3-english-runtime .ta3-ta2-alphabet-screen{width:100%;max-width:61.6rem;margin:auto;display:flex;flex-direction:column;align-items:center;}
#class3-english-runtime .ta3-ta2-alphabet-heading{text-align:center;margin-bottom:9px;}
#class3-english-runtime .ta3-ta2-alphabet-heading h2{font-size:22px;color:#db2777;font-weight:950;margin:0 0 3px;}
#class3-english-runtime .ta3-ta2-alphabet-heading p{font-size:20px;font-weight:850;color:#64748b;margin:0;line-height:1.3;}
#class3-english-runtime .ta3-ta2-alphabet-listen{display:inline-flex;align-items:center;gap:5px;margin:8px auto 0;background:#fce7f3;border:1px solid #f9a8d4;border-radius:12px;color:#be185d;font-size:20px;font-weight:950;padding:5px 15px;}
#class3-english-runtime .ta3-ta2-alphabet-word-grid{width:100%;background:#fdf2f8;border:2px dashed #f9a8d4;border-radius:16px;padding:13.2px;box-shadow:0 2px 5px rgba(126,34,206,.06);margin-bottom:13px;}
#class3-english-runtime .ta3-ta2-alphabet-four{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:11px;align-items:stretch;}
#class3-english-runtime .ta3-ta2-alphabet-letter-card,#class3-english-runtime .ta3-ta2-word-card{display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;min-width:0;border:2px solid #f0abfc;background:#fff;border-radius:12px;padding:11px;box-shadow:0 2px 5px rgba(76,29,149,.08);}
#class3-english-runtime .ta3-ta2-alphabet-letter-card{border-color:#f472b6;background:linear-gradient(#fff,#fdf2f8);}
#class3-english-runtime .ta3-ta2-alphabet-letter-card:hover{border-color:#ec4899;}
#class3-english-runtime .ta3-ta2-big-combo{font-size:66px;line-height:1.05;font-weight:950;color:#db2777;margin-bottom:5px;white-space:nowrap;}
#class3-english-runtime .ta3-ta2-letter-read{font-size:20px;font-weight:900;color:#475569;margin-bottom:10px;}
#class3-english-runtime .ta3-ta2-letter-read b{font-size:20px;color:#9333ea;}
#class3-english-runtime .ta3-ta2-alphabet-letter-card small{display:block;border:1px solid #fbcfe8;border-radius:99px;background:#fce7f3;color:#be185d;font-size:20px;font-weight:950;padding:4px 9px;white-space:nowrap;}
#class3-english-runtime .ta3-ta2-word-card:hover{border-color:#d946ef;background:#fdf4ff;}
#class3-english-runtime .ta3-ta2-word-emoji{font-size:34px;line-height:1.2;margin-bottom:5px;}
#class3-english-runtime .ta3-ta2-word-name{display:flex;align-items:center;justify-content:center;gap:4px;flex-wrap:wrap;}
#class3-english-runtime .ta3-ta2-word-name strong{font-size:20px;font-weight:950;color:#5b21b6;}
#class3-english-runtime .ta3-ta2-word-name small{font-size:20px;font-weight:850;color:#a21caf;border-radius:5px;padding:2px 5px;background:#fae8ff;}
#class3-english-runtime .ta3-ta2-word-ipa{font-size:20px;color:#c026d3;margin:3px 0;font-weight:800;}
#class3-english-runtime .ta3-ta2-word-vi{font-size:20px;color:#475569;font-weight:900;}
#class3-english-runtime .ta3-ta2-word-ex{font-size:20px;color:#94a3b8;margin:4px 0 7px;font-weight:750;}
#class3-english-runtime .ta3-ta2-word-listen{font-size:20px;color:#a21caf;border:1px solid #f5d0fe;border-radius:8px;background:#fdf4ff;padding:3px 8px;font-weight:950;}
#class3-english-runtime .ta3-ta2-alphabet-keyboard,#class3-english-runtime .ta3-ta2-ipa-keyboard{width:100%;background:#fff;border:1px solid #e5e7eb;border-radius:16px;padding:11px;display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:4.4px;box-shadow:inset 0 2px 5px rgba(0,0,0,.045);margin-bottom:11px;}
#class3-english-runtime .ta3-ta2-alphabet-key{min-width:57px;min-height:57px;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:6.6px;border:1px solid #e5e7eb;border-radius:12px;background:#fff;color:#475569;box-shadow:0 2px 4px rgba(0,0,0,.04);}
#class3-english-runtime .ta3-ta2-alphabet-key:hover{background:#fdf2f8;border-color:#f9a8d4;}
#class3-english-runtime .ta3-ta2-alphabet-key.is-active{border:2px solid #db2777;background:#ec4899;color:#fff;box-shadow:0 0 0 2px #fbcfe8;}
#class3-english-runtime .ta3-ta2-alphabet-key span{font-size:20px;font-weight:950;}
#class3-english-runtime .ta3-ta2-alphabet-key small{font-size:20px;font-weight:850;color:#db2777;}
#class3-english-runtime .ta3-ta2-alphabet-key.is-active small{color:#fff;}
#class3-english-runtime .ta3-ta2-alphabet-actions,#class3-english-runtime .ta3-ta2-ipa-actions{display:flex;align-items:center;justify-content:center;gap:13px;flex-wrap:wrap;margin:4px auto 0;}
#class3-english-runtime .ta3-ta2-alphabet-actions button,#class3-english-runtime .ta3-ta2-ipa-actions button{min-height:41px;border:2px solid #7dd3fc;border-radius:12px;padding:8px 17px;font-size:20px;font-weight:950;color:#0284c7;background:#f0f9ff;}
#class3-english-runtime .ta3-ta2-alphabet-actions .ta3-ta2-alphabet-quiz,#class3-english-runtime .ta3-ta2-ipa-quiz{background:#ddd6fe;border-color:#c4b5fd;color:#5b21b6;}
#class3-english-runtime .ta3-ta2-alphabet-actions .ta3-ta2-alphabet-next{border-color:#ec4899;background:linear-gradient(90deg,#ec4899,#8b5cf6);color:#fff;}
#class3-english-runtime .ta3-ta2-ipa-screen{width:100%;max-width:64rem;margin:0 auto;display:flex;flex-direction:column;align-items:center;}
#class3-english-runtime .ta3-ta2-ipa-heading{width:100%;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:7px;margin-bottom:5px;}
#class3-english-runtime .ta3-ta2-ipa-count{font-size:20px;color:#be185d;font-weight:950;background:#fce7f3;border-radius:11px;padding:6px 12px;}
#class3-english-runtime .ta3-ta2-ipa-heading h2{font-size:22px;color:#db2777;text-align:center;margin:0;font-weight:950;}
#class3-english-runtime .ta3-ta2-ipa-quiz{border-radius:12px;padding:7px 14px;min-height:33px;border:2px solid #c4b5fd;background:#ddd6fe;color:#5b21b6;font-size:20px;font-weight:950;}
#class3-english-runtime .ta3-ta2-ipa-hint{text-align:center;color:#64748b;font-size:20px;font-weight:850;margin:0 0 10px;}
#class3-english-runtime .ta3-ta2-ipa-workspace{border:2px dashed #f9a8d4;border-radius:16px;background:linear-gradient(90deg,#fdf2f8,#fdf4ff,#f5f3ff);padding:15px;width:100%;margin-bottom:12px;}
#class3-english-runtime .ta3-ta2-ipa-workspace-grid{display:grid;grid-template-columns:5fr 7fr;gap:12px;align-items:stretch;}
#class3-english-runtime .ta3-ta2-ipa-feature{background:rgba(255,255,255,.94);border:1px solid #fbcfe8;border-radius:16px;padding:13px;display:flex;flex-direction:column;align-items:center;justify-content:space-between;text-align:center;}
#class3-english-runtime .ta3-ta2-ipa-top{display:flex;flex-direction:column;align-items:center;}
#class3-english-runtime .ta3-ta2-ipa-type{font-size:20px;border:1px solid #f9a8d4;background:#fce7f3;color:#be185d;border-radius:99px;padding:4px 9px;font-weight:950;}
#class3-english-runtime .ta3-ta2-ipa-type[data-kind=vowel_di]{background:#ede9fe;border-color:#c4b5fd;color:#6d28d9;}
#class3-english-runtime .ta3-ta2-ipa-type[data-kind=consonant_unvoiced]{background:#f5f3ff;border-color:#c4b5fd;color:#6d28d9;}
#class3-english-runtime .ta3-ta2-ipa-type[data-kind=consonant_voiced]{background:#fae8ff;border-color:#e9d5ff;color:#a21caf;}
#class3-english-runtime .ta3-ta2-ipa-large{border:0;background:transparent;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:5px;margin:10px auto 0;}
#class3-english-runtime .ta3-ta2-ipa-large strong{font-size:64px;line-height:1;color:#db2777;font-weight:950;}
#class3-english-runtime .ta3-ta2-ipa-large small{font-size:20px;font-weight:950;color:#6d28d9;}
#class3-english-runtime .ta3-ta2-ipa-large:hover{transform:scale(1.05);}
#class3-english-runtime .ta3-ta2-ipa-guide{width:100%;margin:11px 0;padding:11px;background:linear-gradient(145deg,#fdf2f8,#f5f3ff);border:1px solid #ddd6fe;border-radius:12px;text-align:left;}
#class3-english-runtime .ta3-ta2-ipa-guide b{font-size:20px;color:#6d28d9;font-weight:950;}
#class3-english-runtime .ta3-ta2-ipa-guide p{font-size:20px;font-weight:850;color:#475569;line-height:1.55;margin:6px 0 0;}
#class3-english-runtime .ta3-ta2-ipa-buttons{display:flex;gap:8px;width:100%;}
#class3-english-runtime .ta3-ta2-ipa-buttons button{font-size:20px;font-weight:950;border-radius:12px;padding:8px 10px;min-height:38px;}
#class3-english-runtime .ta3-ta2-ipa-play{flex:1;border:1px solid #db2777;background:#ec4899;color:#fff;}
#class3-english-runtime .ta3-ta2-ipa-guide-listen{border:1px solid #c4b5fd;background:#f3e8ff;color:#6d28d9;}
#class3-english-runtime .ta3-ta2-ipa-examples{display:flex;flex-direction:column;justify-content:space-between;min-width:0;gap:8px;}
#class3-english-runtime .ta3-ta2-ipa-examples h3{font-size:20px;font-weight:950;color:#5b21b6;margin:0;}
#class3-english-runtime .ta3-ta2-ipa-examples-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:9px;flex:1;}
#class3-english-runtime .ta3-ta2-ipa-examples .ta3-ta2-word-card{min-width:0;}
#class3-english-runtime .ta3-ta2-ipa-examples>p{font-size:20px;font-weight:850;color:#94a3b8;text-align:center;margin:0;}
#class3-english-runtime .ta3-ta2-ipa-key{min-width:50px;min-height:46px;border:1px solid #fbcfe8;background:#fdf2f8;color:#be185d;display:flex;flex-direction:column;justify-content:center;align-items:center;border-radius:12px;padding:4px;}
#class3-english-runtime .ta3-ta2-ipa-key[data-kind=vowel_di]{background:#faf5ff;color:#6d28d9;border-color:#ddd6fe;}
#class3-english-runtime .ta3-ta2-ipa-key[data-kind^=consonant]{background:#fdf4ff;color:#6d28d9;border-color:#f5d0fe;}
#class3-english-runtime .ta3-ta2-ipa-key.is-active{background:#db2777;color:#fff;border-color:#be185d;box-shadow:0 0 0 2px #fbcfe8;}
#class3-english-runtime .ta3-ta2-ipa-key.is-active[data-kind=vowel_di]{background:#9333ea;border-color:#7e22ce;}
#class3-english-runtime .ta3-ta2-ipa-key.is-active[data-kind^=consonant]{background:#c026d3;border-color:#a21caf;}
#class3-english-runtime .ta3-ta2-ipa-key strong{font-size:20px;font-weight:950;line-height:1.25;}
#class3-english-runtime .ta3-ta2-ipa-key small{font-size:20px;font-weight:750;line-height:1.25;max-width:52px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
#class3-english-runtime .ta3-ta2-ipa-actions .ta3-ta2-ipa-next{background:#ddd6fe;color:#5b21b6;border-color:#c4b5fd;}
#class3-english-runtime .ta3-ta2-practice-screen{width:100%;max-width:82rem;display:flex;flex-direction:column;align-items:center;padding:6px 0 0;}
#class3-english-runtime .ta3-ta2-practice-head{width:100%;max-width:760px;display:flex;align-items:center;justify-content:space-between;gap:12px;font-size:20px;font-weight:950;color:#be185d;}
#class3-english-runtime .ta3-ta2-practice-head span:last-child{color:#7c3aed;white-space:nowrap;}
#class3-english-runtime .ta3-ta2-practice-prompt{text-align:center;display:flex;flex-direction:column;align-items:center;justify-content:center;max-width:768px;width:100%;margin:5px auto 3px;}
#class3-english-runtime .ta3-ta2-practice-prompt.is-listening{background:rgba(253,242,248,.44);border:2px dashed #fbcfe8;border-radius:23px;padding:16px 18px;margin-top:12px;margin-bottom:12px;}
#class3-english-runtime .ta3-ta2-listen-emoji{font-size:34px;line-height:1.2;margin:0 0 10px;}
#class3-english-runtime .ta3-ta2-practice-prompt h3{font-size:23px;color:#9f1239;line-height:1.4;font-weight:950;margin:4px 0;}
#class3-english-runtime .ta3-ta2-practice-prompt p{font-size:20px;color:#475569;line-height:1.5;font-weight:850;margin:5px 0;}
#class3-english-runtime .ta3-ta2-practice-listen{font-size:20px;color:#be185d;background:#fdf2f8;border:1px solid #fbcfe8;border-radius:14px;padding:8px 15px;font-weight:950;margin:8px 0 0;}
#class3-english-runtime .ta3-ta2-target-wrap{display:flex;flex-direction:column;align-items:center;margin:10px 0 3px;gap:6px;}
#class3-english-runtime .ta3-ta2-target-letter{width:96px;height:96px;display:flex;align-items:center;justify-content:center;font-size:60px;line-height:1;font-weight:950;color:#6d28d9;border-radius:16px;border:1px solid #fbcfe8;background:linear-gradient(145deg,#fdf2f8,#faf5ff);}
#class3-english-runtime .ta3-ta2-target-ipa{color:#047857;font-size:20px;font-weight:950;}
#class3-english-runtime .ta3-ta2-sequence{max-width:768px;display:flex;align-items:flex-start;justify-content:center;gap:10px;width:100%;background:rgba(253,242,248,.45);border:1px solid #fbcfe8;border-radius:20px;padding:15px 10px;margin:14px auto 8px;}
#class3-english-runtime .ta3-ta2-sequence span{display:flex;align-items:center;justify-content:center;width:64px;height:72px;min-width:0;border-radius:12px;border:2px solid #fbcfe8;background:#fff;font-size:36px;color:#6d28d9;font-weight:950;}
#class3-english-runtime .ta3-ta2-sequence span.ta3-ta2-sequence-missing{background:#ede9fe;color:#8b5cf6;border-color:#a78bfa;}
#class3-english-runtime .ta3-ta2-sequence span.is-solved{background:#ecfdf5;border-color:#34d399;color:#047857;}
#class3-english-runtime .ta3-ta2-practice-options{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;max-width:768px;width:100%;margin:11px auto 0;}
#class3-english-runtime .ta3-ta2-practice-choice{border:2px solid #fbcfe8;background:rgba(253,242,248,.45);color:#1f2937;border-radius:16px;display:flex;align-items:center;justify-content:space-between;min-height:65px;padding:12px 14px;text-align:left;font-size:20px;font-weight:950;gap:12px;transition:background .17s,border-color .17s;}
#class3-english-runtime .ta3-ta2-practice-choice:hover{background:#fce7f3;border-color:#f9a8d4;}
#class3-english-runtime .ta3-ta2-practice-choice .ta3-ta2-choice-label{color:#db2777;font-size:20px;flex:0 0 auto;}
#class3-english-runtime .ta3-ta2-choice-main{flex:1;min-width:0;display:flex;align-items:center;gap:7px;justify-content:flex-start;}
#class3-english-runtime .ta3-ta2-practice-choice.is-correct{background:#dcfce7;color:#166534;border-color:#4ade80;}
#class3-english-runtime .ta3-ta2-practice-choice.is-wrong{background:#fecaca;color:#991b1b;border-color:#ef4444;}
#class3-english-runtime .ta3-ta2-sequence-choice{display:flex;align-items:center;gap:9px;min-width:0;white-space:nowrap;}
#class3-english-runtime .ta3-ta2-sequence-choice strong{font-size:22px;color:#1f2937;}
#class3-english-runtime .ta3-ta2-sequence-choice span{font-size:20px;font-weight:800;color:#7c3aed;}
#class3-english-runtime .ta3-ta2-ipa-answer{min-width:0;font-weight:950;}
#class3-english-runtime .ta3-ta2-revealed-letter{background:#ede9fe;color:#6d28d9;font-size:20px;font-weight:950;padding:5px 9px;white-space:nowrap;border:1px solid #ddd6fe;border-radius:11px;}
#class3-english-runtime .ta3-ta2-correct-ipa{background:#fff;color:#047857;font-size:20px;font-weight:950;padding:4px 9px;border:1px solid #a7f3d0;border-radius:10px;margin-left:10px;}
#class3-english-runtime .ta3-ta2-feedback{align-self:center;max-width:768px;padding:5px 10px;margin:6px 0 0;font-weight:900;font-size:20px;}
#class3-english-runtime .ta3-ta2-feedback.success{color:#047857;}
#class3-english-runtime .ta3-ta2-feedback.retry{color:#be123c;}
#class3-english-runtime .ta3-ta2-replay-hint{color:#7c3aed;font-size:20px;margin:6px 0;font-weight:800;text-align:center;}
#class3-english-runtime .ta3-ta2-practice-nav{width:100%;max-width:768px;display:flex;align-items:center;justify-content:center;gap:13px;margin:22px 0 0;}
#class3-english-runtime .ta3-ta2-practice-nav button{width:132px;min-height:44px;border:1px solid #e5e7eb;background:#f3f4f6;border-radius:16px;color:#475569;font-size:20px;font-weight:950;}
#class3-english-runtime .ta3-ta2-practice-nav button.ta3-ta2-practice-next{background:linear-gradient(90deg,#ec4899,#f43f5e);color:#fff;border-color:#ec4899;}
#class3-english-runtime .ta3-ta2-practice-nav span{font-size:20px;background:#fdf2f8;border:1px solid #fbcfe8;border-radius:99px;padding:8px 17px;font-weight:950;color:#be185d;white-space:nowrap;}
#class3-english-runtime .ta3-ta2-practice-footer{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;margin-top:20px;border-top:1px solid #fce7f3;padding-top:13px;width:100%;max-width:768px;color:#7c3aed;font-size:20px;font-weight:950;}
#class3-english-runtime .ta3-ta2-practice-footer button{border:0;background:linear-gradient(105deg,#ec4899,#8b5cf6);color:#fff;padding:10px 14px;min-height:40px;border-radius:13px;font-size:20px;font-weight:950;}
@media(max-width:767px){
 #class3-english-runtime .ta3-ta2-menu-grid{grid-template-columns:1fr;gap:9px;}
 #class3-english-runtime .ta3-ta2-menu-card{padding:10px;min-height:96px;gap:7px;}
 #class3-english-runtime .ta3-ta2-menu-icon{width:46px;height:46px;flex-basis:46px;font-size:23px;}
 #class3-english-runtime .ta3-ta2-menu-inside{gap:7px;}
 #class3-english-runtime .ta3-ta2-menu-copy>span{font-size:20px;}
 #class3-english-runtime .ta3-ta2-menu-copy small{font-size:20px;}
 #class3-english-runtime .ta3-ta2-menu-count{font-size:20px;padding:4px 6px;}
 #class3-english-runtime .ta3-ta2-alphabet-four{grid-template-columns:repeat(2,minmax(0,1fr));}
 #class3-english-runtime .ta3-ta2-alphabet-key{min-width:49px;min-height:49px;padding:5px;}
 #class3-english-runtime .ta3-ta2-alphabet-key small{font-size:20px;}
 #class3-english-runtime .ta3-ta2-ipa-workspace-grid{grid-template-columns:1fr;}
 #class3-english-runtime .ta3-ta2-ipa-examples-grid{grid-template-columns:repeat(3,minmax(0,1fr));}
 #class3-english-runtime .ta3-ta2-practice-options{grid-template-columns:1fr;}
 #class3-english-runtime .ta3-ta2-practice-choice{min-height:56px;}
 #class3-english-runtime .ta3-ta2-target-letter{height:82px;width:82px;font-size:53px;}
 #class3-english-runtime .ta3-ta2-sequence{gap:6px;padding:12px 6px;}
 #class3-english-runtime .ta3-ta2-sequence span{width:48px;height:55px;font-size:27px;}
}
@media(max-width:510px){
 #class3-english-runtime .ta3-ta2-menu-grid{grid-template-columns:1fr;}
 #class3-english-runtime .ta3-ta2-menu-card{min-height:92px;padding:12px;}
 #class3-english-runtime .ta3-ta2-menu-icon{width:52px;height:52px;flex-basis:52px;}
 #class3-english-runtime .ta3-ta2-menu-copy>span{font-size:20px;white-space:normal;}
 #class3-english-runtime .ta3-ta2-menu-copy small{font-size:20px;}
 #class3-english-runtime .ta3-ta2-alphabet-heading h2{font-size:20px;}
 #class3-english-runtime .ta3-ta2-alphabet-four{grid-template-columns:1fr 1fr;gap:7px;}
 #class3-english-runtime .ta3-ta2-big-combo{font-size:48px;}
 #class3-english-runtime .ta3-ta2-word-name strong{font-size:20px;}
 #class3-english-runtime .ta3-ta2-word-ipa{font-size:20px;}
 #class3-english-runtime .ta3-ta2-ipa-examples-grid{grid-template-columns:1fr 1fr;}
 #class3-english-runtime .ta3-ta2-ipa-heading{justify-content:center;}
 #class3-english-runtime .ta3-ta2-ipa-heading h2{font-size:20px;}
 #class3-english-runtime .ta3-ta2-ipa-buttons{flex-wrap:wrap;}
 #class3-english-runtime .ta3-ta2-practice-nav{gap:5px;}
 #class3-english-runtime .ta3-ta2-practice-nav button{width:116px;font-size:20px;}
 #class3-english-runtime .ta3-ta2-practice-nav span{font-size:20px;padding:7px 8px;}
 #class3-english-runtime .ta3-ta2-practice-prompt h3{font-size:20px;}
 #class3-english-runtime .ta3-ta2-practice-prompt p{font-size:20px;}
 #class3-english-runtime .ta3-ta2-practice-choice{font-size:20px;padding:10px;}
 #class3-english-runtime .ta3-ta2-sequence-choice span{font-size:20px;}
}
@media(prefers-reduced-motion:reduce){#class3-english-runtime .ta3-ta2-menu-icon{transition:none!important}#class3-english-runtime .ta3-ta2-menu-card:hover .ta3-ta2-menu-icon{transform:none!important}}

/* Class 3 | Explore M6-M9 only: improve Level directory readability.
   Restrict styles to the SGK Level hub; Vocabulary M2 and question screens stay intact. */
#class3-english-runtime .ta3-sgk-quiz-hub .ta3-vocab-hub-heading h2{font-size:24px;line-height:1.3}
#class3-english-runtime .ta3-sgk-quiz-hub .ta3-vocab-hub-heading p{font-size:20px;line-height:1.4}
#class3-english-runtime .ta3-sgk-quiz-hub .ta3-vocab-hub-heading small{display:block;font-size:20px;line-height:1.5}
#class3-english-runtime .ta3-sgk-quiz-hub .ta3-vocab-level{min-height:130px}
#class3-english-runtime .ta3-sgk-quiz-hub .ta3-vocab-level strong{font-size:21px;line-height:1.28}
#class3-english-runtime .ta3-sgk-quiz-hub .ta3-vocab-level small{font-size:20px;line-height:1.38}
#class3-english-runtime .ta3-sgk-quiz-hub .ta3-vocab-level small.ta3-sgk-level-topics{font-size:20px;line-height:1.48;font-weight:750}
#class3-english-runtime .ta3-sgk-quiz-hub .ta3-vocab-level>b{font-size:20px}
@media(max-width:767px){
 #class3-english-runtime .ta3-sgk-quiz-hub .ta3-vocab-hub-heading h2{font-size:23px}
 #class3-english-runtime .ta3-sgk-quiz-hub .ta3-vocab-hub-heading p{font-size:20px}
 #class3-english-runtime .ta3-sgk-quiz-hub .ta3-vocab-hub-heading small{font-size:20px}
 #class3-english-runtime .ta3-sgk-quiz-hub .ta3-vocab-level strong{font-size:20px}
 #class3-english-runtime .ta3-sgk-quiz-hub .ta3-vocab-level small{font-size:20px}
 #class3-english-runtime .ta3-sgk-quiz-hub .ta3-vocab-level>b{font-size:20px}
}

/* Class 3: Class-2 educational presentation for Explore M6-M9 only.
   All selectors are scoped to the English module; no impact on shared shell. */
#class3-english-runtime .ta3-l2-screen{width:100%;max-width:80rem;margin:0 auto;padding:14px 8px 22px;color:#334155;box-sizing:border-box}
#class3-english-runtime .ta3-l2-header{text-align:center;margin:2px auto 19px}
#class3-english-runtime .ta3-l2-subtitle{display:inline-block;padding:5px 14px;background:#f5f3ff;color:#7c3aed;border:1px solid #ddd6fe;border-radius:999px;font-size:20px;font-weight:900;line-height:1.35}
#class3-english-runtime .ta3-l2-header h2{font-size:clamp(22px,2.5vw,28px);font-weight:950;color:#1e293b;line-height:1.3;margin:11px 0 0}
#class3-english-runtime .ta3-l2-header h2 button{vertical-align:middle;display:inline-flex;align-items:center;justify-content:center;gap:5px;min-height:35px;padding:5px 11px;border:1.5px solid #ddd6fe;border-radius:12px;background:#f5f3ff;color:#7c3aed;font-size:20px;font-weight:900;margin-left:9px}
#class3-english-runtime .ta3-l2-header h2 button:hover{background:#ede9fe;border-color:#a78bfa}
#class3-english-runtime .ta3-l2-navigation{width:min(100%,900px);margin:22px auto 0;display:grid;grid-template-columns:minmax(0,1fr) minmax(78px,110px) minmax(0,1fr);align-items:center;gap:11px}
#class3-english-runtime .ta3-l2-navigation button{min-height:45px;padding:10px 13px;border-radius:14px;background:#faf5ff;border:1.5px solid #ddd6fe;color:#6d28d9;font-weight:950;font-size:20px;transition:background .15s,border-color .15s}
#class3-english-runtime .ta3-l2-navigation button:hover:not(:disabled){background:#ede9fe;border-color:#c4b5fd}
#class3-english-runtime .ta3-l2-navigation button.is-primary{color:white;border-color:#7c3aed;background:#7c3aed}
#class3-english-runtime .ta3-l2-navigation button.is-primary:hover:not(:disabled){background:#6d28d9}
#class3-english-runtime .ta3-l2-navigation button:disabled{opacity:.43;cursor:not-allowed}
#class3-english-runtime .ta3-l2-navigation>span{text-align:center;color:#64748b;font-weight:950;font-size:20px}
#class3-english-runtime .ta3-l2-reading-grid{display:grid;grid-template-columns:minmax(0,1.05fr) minmax(0,.95fr);align-items:start;gap:19px}
#class3-english-runtime .ta3-l2-reading-grid>*{min-width:0}
#class3-english-runtime .ta3-l2-reading-passage{padding:17px 18px;border-radius:21px;border:2px dashed #f9a8d4;background:linear-gradient(125deg,#fdf2f8,#faf5ff 65%,#f8fafc);min-height:225px}
#class3-english-runtime .ta3-l2-reading-actions{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:9px;margin-bottom:16px}
#class3-english-runtime .ta3-l2-reading-actions>b{font-size:20px;color:#be185d;font-weight:950}
#class3-english-runtime .ta3-l2-reading-actions button,#class3-english-runtime .ta3-l2-situation button,#class3-english-runtime .ta3-l2-solved-sentence button,#class3-english-runtime .ta3-l2-sentence-card button,#class3-english-runtime .ta3-l2-dialogue-success button{min-height:39px;padding:7px 13px;background:#f5f3ff;border:1.5px solid #ddd6fe;color:#6d28d9;border-radius:12px;font-weight:950;font-size:20px}
#class3-english-runtime .ta3-l2-reading-actions button:hover,#class3-english-runtime .ta3-l2-situation button:hover,#class3-english-runtime .ta3-l2-solved-sentence button:hover,#class3-english-runtime .ta3-l2-dialogue-success button:hover{background:#ede9fe;border-color:#a78bfa}
#class3-english-runtime .ta3-l2-dialog-line{display:flex;align-items:flex-start;gap:9px;margin-bottom:10px}
#class3-english-runtime .ta3-l2-dialog-line:last-child{margin-bottom:0}
#class3-english-runtime .ta3-l2-speaker{display:flex;flex:0 0 auto;justify-content:center;align-items:center;min-width:57px;max-width:100px;min-height:38px;padding:6px 9px;color:#7c3aed;background:#ede9fe;border-radius:11px;font-size:20px;font-weight:950;overflow-wrap:anywhere}
#class3-english-runtime .ta3-l2-speaker[data-tone="1"]{background:#fce7f3;color:#be185d}
#class3-english-runtime .ta3-l2-dialog-line>span{font-weight:850;line-height:1.5;font-size:20px;background:#fff;border:1px solid #fbcfe8;border-radius:14px;padding:8px 11px;flex:1;min-width:0;overflow-wrap:anywhere}
#class3-english-runtime .ta3-l2-passage-text{margin:0;font-size:20px;font-weight:800;line-height:1.8;white-space:pre-line;overflow-wrap:anywhere}
#class3-english-runtime .ta3-l2-reading-translation{background:white;border:1.5px solid #ddd6fe;border-radius:16px;padding:13px;margin-top:15px}
#class3-english-runtime .ta3-l2-reading-translation strong{display:block;font-size:20px;color:#7c3aed;font-weight:950;margin:0 0 6px}
#class3-english-runtime .ta3-l2-reading-translation p{font-size:20px;color:#475569;font-weight:750;line-height:1.6;margin:0;white-space:pre-line}
#class3-english-runtime .ta3-l2-reading-questions{display:flex;flex-direction:column;gap:13px}
#class3-english-runtime .ta3-l2-reading-question{background:#fff;border:1.5px solid #fbcfe8;padding:15px;border-radius:20px}
#class3-english-runtime .ta3-l2-question-title{display:flex;gap:10px;align-items:flex-start;margin-bottom:13px}
#class3-english-runtime .ta3-l2-question-title>span{min-width:31px;height:31px;display:flex;align-items:center;justify-content:center;background:#ec4899;color:white;border-radius:50%;font-size:20px;font-weight:950}
#class3-english-runtime .ta3-l2-question-title>h3{font-size:clamp(20px,1.65vw,20px);font-weight:950;color:#1e293b;line-height:1.35;margin:2px 0}
#class3-english-runtime .ta3-l2-choice-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}
#class3-english-runtime .ta3-l2-option{display:flex;align-items:flex-start;gap:8px;text-align:left;min-height:62px;padding:12px;border:1.5px solid #f9a8d4;border-radius:14px;background:#fff;color:#334155;font-weight:900;font-size:20px;line-height:1.35;transition:background .15s,border-color .15s;overflow-wrap:anywhere}
#class3-english-runtime .ta3-l2-option>span:last-child{flex:1;min-width:0}
#class3-english-runtime .ta3-l2-option-label{color:#db2777;font-size:20px;flex:0 0 auto}
#class3-english-runtime .ta3-l2-option:hover:not(:disabled){border-color:#ec4899;background:#fff1f7}
#class3-english-runtime .ta3-l2-option.is-correct,#class3-english-runtime .ta3-l2-fill-choice.is-correct{border-color:#34d399;background:#ecfdf5;color:#047857}
#class3-english-runtime .ta3-l2-option.is-wrong,#class3-english-runtime .ta3-l2-fill-choice.is-wrong{border-color:#fda4af;background:#fff1f2;color:#be123c;opacity:.7}
#class3-english-runtime .ta3-l2-option:disabled,#class3-english-runtime .ta3-l2-fill-choice:disabled{cursor:not-allowed}
#class3-english-runtime .ta3-l2-success,#class3-english-runtime .ta3-l2-all-done{font-size:20px;font-weight:950;color:#047857;text-align:center;margin:10px 0 0}
#class3-english-runtime .ta3-l2-all-done{font-size:20px;margin-top:16px}
#class3-english-runtime .ta3-l2-retry{color:#be123c;font-size:20px;font-weight:850;text-align:center;margin:9px 0 0}
#class3-english-runtime .ta3-l2-building{max-width:990px;margin:6px auto 0}
#class3-english-runtime .ta3-l2-assembled{min-height:89px;border:2px solid #fbcfe8;background:#fff;border-radius:21px;display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:8px;padding:17px;box-sizing:border-box}
#class3-english-runtime .ta3-l2-placeholder{font-size:20px;font-weight:800;color:#94a3b8;text-align:center}
#class3-english-runtime .ta3-l2-word{min-width:74px;min-height:54px;padding:9px 14px;border:1.5px solid #e9a8ff;background:linear-gradient(180deg,#fff,#fdf2f8);color:#7c3aed;border-radius:14px;font-size:clamp(20px,1.85vw,21px);font-weight:950;line-height:1.22;box-shadow:0 2px 6px rgba(109,40,217,.06)}
#class3-english-runtime .ta3-l2-word:hover:not(:disabled){border-color:#a855f7;background:#f5eaff}
#class3-english-runtime .ta3-l2-word.is-selected{background:#faf5ff}
#class3-english-runtime .ta3-l2-word.is-correct{background:#ecfdf5;color:#047857;border-color:#86efac}
#class3-english-runtime .ta3-l2-word-feedback{text-align:center;min-height:28px;font-size:20px;font-weight:950;color:#b91c1c;margin:9px auto 6px}
#class3-english-runtime .ta3-l2-word-bank{display:flex;justify-content:center;align-items:center;flex-wrap:wrap;gap:11px;margin:11px auto 6px}
#class3-english-runtime .ta3-l2-solved-sentence{display:flex;align-items:center;justify-content:center;gap:11px;flex-wrap:wrap;margin:13px auto 0;font-size:24px;color:#047857}
#class3-english-runtime .ta3-l2-solved-sentence>strong{font-weight:950}
#class3-english-runtime .ta3-l2-fill{max-width:950px;margin:0 auto}
#class3-english-runtime .ta3-l2-sentence-card{background:linear-gradient(135deg,#fdf2f8,#faf5ff);border:2px dashed #f9a8d4;border-radius:22px;min-height:123px;padding:19px 20px;display:flex;flex-direction:column;justify-content:center;align-items:center;gap:12px}
#class3-english-runtime .ta3-l2-context-clue{font-size:clamp(20px,1.6vw,20px);line-height:1.4;color:#64748b;font-weight:800;text-align:center;max-width:720px;margin:0;}
#class3-english-runtime .ta3-l2-sentence-card h3{font-size:clamp(26px,3.3vw,37px);line-height:1.4;font-weight:950;color:#1e293b;text-align:center;white-space:pre-line;overflow-wrap:anywhere;margin:0}
#class3-english-runtime .ta3-l2-gap{color:#ec4899;text-decoration:underline;text-underline-offset:5px}
#class3-english-runtime .ta3-l2-inserted{color:#f43f5e;font-weight:950}
#class3-english-runtime .ta3-l2-fill-choices{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:11px;margin:17px auto 0}
#class3-english-runtime .ta3-l2-fill-choice{display:flex;align-items:center;gap:15px;min-height:67px;text-align:left;padding:13px 18px;border-radius:18px;border:1.5px solid #f9a8d4;background:#fff;color:#7c3aed;font-size:clamp(20px,2.05vw,24px);font-weight:950;line-height:1.25}
#class3-english-runtime .ta3-l2-fill-choice:hover:not(:disabled){border-color:#ec4899;background:#fff1f7}
#class3-english-runtime .ta3-l2-fill-choice>b{font-size:20px;color:#db2777;flex:0 0 auto}
#class3-english-runtime .ta3-l2-meaning{background:white;border:1.5px solid #ddd6fe;padding:10px 16px;border-radius:14px;color:#475569;font-size:20px;font-weight:850;text-align:center;margin:14px auto 0}
#class3-english-runtime .ta3-l2-meaning b{color:#7c3aed}
#class3-english-runtime .ta3-l2-conversation{max-width:1000px;margin:0 auto}
#class3-english-runtime .ta3-l2-situation{display:flex;flex-wrap:wrap;justify-content:center;align-items:center;gap:12px;border:2px dashed #f9a8d4;background:linear-gradient(130deg,#fdf2f8,#faf5ff);border-radius:23px;padding:18px 23px;margin:0 auto 20px}
#class3-english-runtime .ta3-l2-situation>span{font-size:35px;line-height:1}
#class3-english-runtime .ta3-l2-situation>p{flex:1 1 300px;color:#1e293b;font-size:clamp(20px,2.1vw,24px);font-weight:900;line-height:1.52;white-space:pre-line;margin:0;overflow-wrap:anywhere}
#class3-english-runtime .ta3-l2-dialogue-success{display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:8px 13px;background:#ecfdf5;border:1.5px solid #86efac;border-radius:16px;margin-top:17px;padding:13px;color:#047857;font-weight:950}
#class3-english-runtime .ta3-l2-dialogue-success>strong{flex-basis:100%;text-align:center;font-size:20px}
#class3-english-runtime .ta3-l2-dialogue-success>p{margin:0;font-size:21px}
#class3-english-runtime .ta3-l2-dialogue-success>small{flex-basis:100%;text-align:center;font-size:20px;color:#7c3aed}
@media(max-width:860px){
 #class3-english-runtime .ta3-l2-reading-grid{grid-template-columns:1fr;gap:15px}
 #class3-english-runtime .ta3-l2-reading-passage{min-height:0}
}
@media(max-width:600px){
 #class3-english-runtime .ta3-l2-screen{padding:8px 4px 17px}
 #class3-english-runtime .ta3-l2-header{margin-bottom:14px}
 #class3-english-runtime .ta3-l2-header h2{font-size:21px}
 #class3-english-runtime .ta3-l2-reading-passage{padding:13px}
 #class3-english-runtime .ta3-l2-reading-question{padding:12px}
 #class3-english-runtime .ta3-l2-reading-actions>b{font-size:20px}
 #class3-english-runtime .ta3-l2-option{padding:10px 9px;min-height:60px;font-size:20px}
 #class3-english-runtime .ta3-l2-fill-choice{padding:12px 10px;min-height:60px}
 #class3-english-runtime .ta3-l2-assembled{padding:12px;min-height:75px}
 #class3-english-runtime .ta3-l2-word{font-size:20px;min-height:48px;padding:9px 10px;min-width:64px}
 #class3-english-runtime .ta3-l2-sentence-card{padding:15px 10px;min-height:105px}
 #class3-english-runtime .ta3-l2-navigation{grid-template-columns:minmax(0,1fr) 82px minmax(0,1fr);gap:6px}
 #class3-english-runtime .ta3-l2-navigation button{font-size:20px;padding:8px 7px}
 #class3-english-runtime .ta3-l2-navigation>span{font-size:20px}
 #class3-english-runtime .ta3-l2-situation{padding:14px 12px}
}
@media(prefers-reduced-motion:reduce){#class3-english-runtime .ta3-l2-option,#class3-english-runtime .ta3-l2-navigation button{transition:none!important}}


/* English 3 Grammar Point (Topic 10): 82rem, 3-column hub + cumulative practice. */
#class3-english-runtime .ta3-grammar-hub{width:100%;max-width:82rem;margin:0 auto;padding:12px 7px 0}
#class3-english-runtime .ta3-grammar-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}
#class3-english-runtime .ta3-grammar-topic{--g-border:#f9a8d4;--g-bg:#fff1f7;display:grid;grid-template-columns:57px minmax(0,1fr);grid-template-areas:'icon copy';align-items:center;gap:13px;min-width:0;min-height:104px;padding:13px 16px;background:var(--g-bg);border:1.5px solid var(--g-border);border-radius:18px;box-shadow:0 2px 8px rgba(76,29,149,.04);color:#334155;text-align:left;transition:box-shadow .18s,border-color .18s}
#class3-english-runtime .ta3-grammar-topic[data-tone=violet]{--g-bg:#f5f3ff;--g-border:#c4b5fd}
#class3-english-runtime .ta3-grammar-topic[data-tone=blue]{--g-bg:#eff6ff;--g-border:#93c5fd}
#class3-english-runtime .ta3-grammar-topic[data-tone=amber]{--g-bg:#fffbeb;--g-border:#fcd34d}
#class3-english-runtime .ta3-grammar-topic[data-tone=teal]{--g-bg:#f0fdfa;--g-border:#5eead4}
#class3-english-runtime .ta3-grammar-topic:hover,#class3-english-runtime .ta3-grammar-topic:focus-visible{transform:none;border-color:#a855f7;box-shadow:0 0 0 1px #e9d5ff,0 0 10px rgba(124,58,237,.15);outline:none}
#class3-english-runtime .ta3-grammar-icon{grid-area:icon;width:57px;height:57px;border-radius:16px;display:flex;justify-content:center;align-items:center;background:#fff;border:1.5px solid var(--g-border);font-size:31px;line-height:1;transition:transform .15s}
#class3-english-runtime .ta3-grammar-topic:hover .ta3-grammar-icon{transform:scale(1.055)}
#class3-english-runtime .ta3-grammar-copy{grid-area:copy;min-width:0;display:flex;flex-direction:column;gap:6px;line-height:1.25}
#class3-english-runtime .ta3-grammar-copy strong{font-size:20px;font-weight:950;color:#57208c;overflow-wrap:anywhere}
#class3-english-runtime .ta3-grammar-copy strong b{color:#9d174d;margin-right:3px}
#class3-english-runtime .ta3-grammar-copy small{font-size:20px;color:#64748b;font-weight:850;line-height:1.35}
#class3-english-runtime .ta3-grammar-practice{max-width:1010px;margin:0 auto;padding:10px 8px 25px}
#class3-english-runtime .ta3-grammar-practice-head{text-align:center}
#class3-english-runtime .ta3-grammar-unit{display:inline-block;padding:5px 12px;margin:0 0 10px;border-radius:999px;border:1px solid #ddd6fe;background:#f5f3ff;color:#7c3aed;font-size:20px;font-weight:900}
#class3-english-runtime .ta3-grammar-practice-head h2{font-size:clamp(22px,2.5vw,29px);font-weight:950;color:#1e293b;line-height:1.25;margin:0}
#class3-english-runtime .ta3-grammar-practice-head>p{font-size:20px;font-weight:800;color:#64748b;margin:4px 0 11px}
#class3-english-runtime .ta3-grammar-instructions{display:flex;justify-content:center;align-items:center;gap:8px 12px;flex-wrap:wrap;font-size:20px;font-weight:900;color:#7c3aed}
#class3-english-runtime .ta3-grammar-instructions button,#class3-english-runtime .ta3-grammar-success button{border:1px solid #ddd6fe;border-radius:13px;background:#f5f3ff;color:#7c3aed;padding:8px 12px;font-weight:900;font-size:20px}
#class3-english-runtime .ta3-grammar-rule{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:18px auto 16px}
#class3-english-runtime .ta3-grammar-rule article{background:#f8fafc;border:1px solid #e2e8f0;border-radius:16px;padding:12px 15px;line-height:1.5;min-width:0}
#class3-english-runtime .ta3-grammar-rule strong{font-size:20px;font-weight:950;color:#7c3aed}
#class3-english-runtime .ta3-grammar-rule p{font-size:20px;font-weight:800;color:#475569;margin:5px 0}
#class3-english-runtime .ta3-grammar-rule small{font-size:20px;font-weight:850;color:#0369a1}
#class3-english-runtime .ta3-grammar-question{background:linear-gradient(130deg,#fdf2f8,#faf5ff);border:2px dashed #f9a8d4;border-radius:21px;min-height:125px;padding:22px;display:flex;align-items:center;justify-content:center;margin-top:18px}
#class3-english-runtime .ta3-grammar-question h3{text-align:center;font-size:clamp(21px,2.45vw,29px);font-weight:950;line-height:1.45;color:#1e293b;margin:0;white-space:pre-line;overflow-wrap:anywhere}
#class3-english-runtime .ta3-grammar-blank{font-style:normal;color:#ec4899;letter-spacing:1.5px;text-decoration:underline;text-underline-offset:7px}
#class3-english-runtime .ta3-grammar-answer{font-style:normal;color:#e11d48;font-weight:950;text-decoration:underline;text-decoration-color:#fda4af;text-underline-offset:6px}
#class3-english-runtime .ta3-grammar-options{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;margin:14px auto 0}
#class3-english-runtime .ta3-grammar-choice{min-height:66px;display:flex;align-items:center;justify-content:flex-start;gap:10px;text-align:left;padding:12px 14px;border-radius:17px;border:1.5px solid #f9a8d4;background:#fff;color:#7c3aed;font-weight:950;font-size:clamp(20px,1.8vw,22px);overflow-wrap:anywhere;transition:background .15s,border-color .15s}
#class3-english-runtime .ta3-grammar-choice>b{font-size:20px;color:#ec4899;flex:0 0 auto}#class3-english-runtime .ta3-grammar-choice>span{flex:1;min-width:0;text-align:left}
#class3-english-runtime .ta3-grammar-choice:hover:not(:disabled){background:#fdf2f8;border-color:#ec4899}
#class3-english-runtime .ta3-grammar-choice.is-correct{background:#ecfdf5;border-color:#34d399;color:#047857}
#class3-english-runtime .ta3-grammar-choice.is-wrong{background:#fff1f2;border-color:#fda4af;color:#be123c;opacity:.63}
#class3-english-runtime .ta3-grammar-try{font-size:20px;line-height:1.45;color:#b91c1c;font-weight:850;text-align:center;margin:14px auto 0}
#class3-english-runtime .ta3-grammar-success{text-align:center;background:#f0fdf4;border:1px solid #86efac;border-radius:17px;padding:14px;margin:16px auto 0}
#class3-english-runtime .ta3-grammar-success>strong{color:#047857;font-weight:950;font-size:20px}
#class3-english-runtime .ta3-grammar-success>p{font-size:clamp(20px,2.3vw,27px);font-weight:950;color:#047857;line-height:1.42;margin:12px auto 6px;overflow-wrap:anywhere}
#class3-english-runtime .ta3-grammar-success>p.ta3-grammar-translation{font-size:clamp(20px,1.9vw,20px);line-height:1.45;font-weight:800;color:#6d28d9;margin:4px auto 11px;max-width:850px;overflow-wrap:anywhere}
#class3-english-runtime .ta3-grammar-explanation{font-size:20px;line-height:1.5;font-weight:800;color:#475569;margin:9px auto 12px;max-width:780px}
#class3-english-runtime .ta3-grammar-nav{display:grid;grid-template-columns:minmax(0,1fr) 84px minmax(0,1fr);gap:12px;align-items:center;max-width:830px;margin:22px auto 0}
#class3-english-runtime .ta3-grammar-nav button{min-height:47px;border:1.5px solid #ddd6fe;border-radius:14px;color:#6d28d9;background:#f5f3ff;font-size:20px;font-weight:950}
#class3-english-runtime .ta3-grammar-nav button.is-primary{background:linear-gradient(90deg,#a855f7,#7c3aed);border-color:#8b5cf6;color:white}
#class3-english-runtime .ta3-grammar-nav button:disabled{opacity:.45;cursor:not-allowed}
#class3-english-runtime .ta3-grammar-nav>span{text-align:center;color:#64748b;font-size:20px;font-weight:950}
/* Tablet uses the desktop 3-column layout; trim icon and fonts rather than dropping a column. */
@media(min-width:768px) and (max-width:1023px){
 #class3-english-runtime .ta3-grammar-topic{grid-template-columns:45px minmax(0,1fr);padding:11px 10px;gap:9px;min-height:108px}
 #class3-english-runtime .ta3-grammar-icon{width:45px;height:45px;font-size:26px;border-radius:13px}
 #class3-english-runtime .ta3-grammar-copy strong{font-size:20px}
 #class3-english-runtime .ta3-grammar-copy small{font-size:20px}
}
@media(max-width:767px){
 #class3-english-runtime .ta3-grammar-grid{grid-template-columns:1fr}
 #class3-english-runtime .ta3-grammar-topic{grid-template-columns:48px minmax(0,1fr);padding:11px;min-height:94px;gap:9px}
 #class3-english-runtime .ta3-grammar-icon{width:48px;height:48px;font-size:27px}
 #class3-english-runtime .ta3-grammar-copy strong{font-size:20px}
 #class3-english-runtime .ta3-grammar-copy small{font-size:20px}
 #class3-english-runtime .ta3-grammar-rule{grid-template-columns:1fr}
 #class3-english-runtime .ta3-grammar-practice{padding:7px 3px 20px}
 #class3-english-runtime .ta3-grammar-question{padding:17px 10px;min-height:95px}
 #class3-english-runtime .ta3-grammar-options{grid-template-columns:repeat(2,minmax(0,1fr))}
 #class3-english-runtime .ta3-grammar-choice{padding:10px;min-height:58px;font-size:20px;gap:7px}
 #class3-english-runtime .ta3-grammar-nav{grid-template-columns:minmax(0,1fr) 64px minmax(0,1fr);gap:7px}
 #class3-english-runtime .ta3-grammar-nav button{font-size:20px}
}
@media(prefers-reduced-motion:reduce){#class3-english-runtime .ta3-grammar-topic .ta3-grammar-icon{transition:none!important}}



/* Class3 English M12 — Super Vocabulary: multi-topic selection from Class2 form,
   but local Class3 state, JSON, navigation and TTS. */
#class3-english-runtime .ta3-super-hub{width:100%;max-width:82rem;padding:10px 8px 22px;margin:0 auto;color:#334155}
#class3-english-runtime .ta3-super-intro{display:flex;align-items:center;justify-content:space-between;gap:16px;text-align:left;margin:0 0 15px}
#class3-english-runtime .ta3-super-guide{flex:1 1 auto;min-width:0;display:flex;flex-direction:column;gap:4px;align-items:flex-start;text-align:left;padding:4px 8px}
#class3-english-runtime .ta3-super-guide strong{font-size:21px;color:#6d28d9;font-weight:950;line-height:1.32}
#class3-english-runtime .ta3-super-guide span{font-size:20px;color:#475569;font-weight:850;line-height:1.4}
#class3-english-runtime .ta3-super-topic-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:11px}
#class3-english-runtime .ta3-super-topic{--ta3-super-bg:#fdf2f8;--ta3-super-border:#f9a8d4;--ta3-super-strong:#9d174d;position:relative;display:flex;align-items:center;gap:12px;min-width:0;min-height:117px;text-align:left;padding:12px 48px 30px 12px;background:var(--ta3-super-bg);border:1.5px solid var(--ta3-super-border);border-radius:18px;box-shadow:0 2px 8px rgba(76,29,149,.04);transition:border-color .16s,box-shadow .16s}
#class3-english-runtime .ta3-super-topic[data-tone="1"]{--ta3-super-bg:#f0f9ff;--ta3-super-border:#bae6fd;--ta3-super-strong:#075985}
#class3-english-runtime .ta3-super-topic[data-tone="2"]{--ta3-super-bg:#f5f3ff;--ta3-super-border:#ddd6fe;--ta3-super-strong:#6d28d9}
#class3-english-runtime .ta3-super-topic[data-tone="3"]{--ta3-super-bg:#fffbeb;--ta3-super-border:#fde68a;--ta3-super-strong:#92400e}
#class3-english-runtime .ta3-super-topic[data-tone="4"]{--ta3-super-bg:#f0fdf4;--ta3-super-border:#bbf7d0;--ta3-super-strong:#166534}
#class3-english-runtime .ta3-super-topic[data-tone="5"]{--ta3-super-bg:#f0fdfa;--ta3-super-border:#99f6e4;--ta3-super-strong:#115e59}
#class3-english-runtime .ta3-super-topic:hover,#class3-english-runtime .ta3-super-topic:focus-visible{border-color:#a855f7;box-shadow:0 0 0 1px rgba(168,85,247,.17),0 0 12px rgba(168,85,247,.10);transform:none}
#class3-english-runtime .ta3-super-topic:focus-visible{outline:2px solid #7c3aed;outline-offset:2px}
#class3-english-runtime .ta3-super-icon{flex:0 0 58px;width:58px;height:58px;display:flex;align-items:center;justify-content:center;border-radius:16px;border:1.5px solid #d8b4fe;background:#fff;font-size:33px;box-shadow:0 2px 7px rgba(76,29,149,.08);transition:transform .18s}
#class3-english-runtime .ta3-super-topic:hover .ta3-super-icon{transform:scale(1.055)}
#class3-english-runtime .ta3-super-names{min-width:0;display:flex;flex-direction:column;gap:5px;overflow-wrap:anywhere}
#class3-english-runtime .ta3-super-names strong{font-size:20px;font-weight:950;color:var(--ta3-super-strong);line-height:1.27}
#class3-english-runtime .ta3-super-names span{font-size:20px;font-weight:850;color:#475569;line-height:1.3}
#class3-english-runtime .ta3-super-check{position:absolute;right:11px;top:10px;display:flex;align-items:center;justify-content:center;width:34px;height:34px;border-radius:11px;border:2px solid #bda3f7;background:white;color:transparent;font-size:23px;font-weight:950;line-height:1;box-shadow:0 2px 7px rgba(76,29,149,.08)}
#class3-english-runtime .ta3-super-topic.is-selected{border-color:#7c3aed;box-shadow:0 0 0 2px rgba(124,58,237,.17),0 4px 12px rgba(124,58,237,.10)}
#class3-english-runtime .ta3-super-topic.is-selected .ta3-super-check{background:#7c3aed;color:white;border-color:#7c3aed}
#class3-english-runtime .ta3-super-count{position:absolute;bottom:8px;right:11px;border-radius:999px;background:white;border:1px solid var(--ta3-super-border);padding:3px 9px;color:var(--ta3-super-strong);font-size:20px;font-weight:950}
#class3-english-runtime .ta3-super-actions{display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:12px;padding:18px 4px 8px}
#class3-english-runtime .ta3-super-status{font-size:20px;font-weight:950;color:#6d28d9;line-height:1.4;text-align:center}
#class3-english-runtime .ta3-super-start{display:flex;align-items:center;justify-content:center;gap:7px;min-height:47px;padding:10px 17px;border:1.5px solid #8b5cf6;border-radius:13px;background:linear-gradient(125deg,#ec4899,#7c3aed);color:white;font-size:20px;font-weight:950;box-shadow:0 4px 12px rgba(124,58,237,.14)}
#class3-english-runtime .ta3-super-start:disabled{background:#f3f0f7;color:#8f87a1;border-color:#ddd6fe;box-shadow:none;cursor:not-allowed}
#class3-english-runtime .ta3-super-start-top{flex:0 0 auto;min-width:187px;white-space:nowrap}
#class3-english-runtime .ta3-super-start:not(:disabled):hover{filter:brightness(1.05);box-shadow:0 7px 16px rgba(124,58,237,.22)}
#class3-english-runtime .ta3-super-start:focus-visible{outline:3px solid #a5b4fc;outline-offset:3px}
/* 12 topics: 4 x 3 on desktop; preserve readable labels and clear badges. */
@media(min-width:1261px){
 #class3-english-runtime .ta3-super-topic{gap:9px;padding:11px 51px 29px 10px;min-height:120px}
 #class3-english-runtime .ta3-super-icon{flex-basis:52px;width:52px;height:52px;font-size:30px}
 #class3-english-runtime .ta3-super-names strong{font-size:20px;line-height:1.27}
 #class3-english-runtime .ta3-super-names span{font-size:20px;line-height:1.3}
}
/* Tablet landscape keeps four columns; tablet portrait uses two. */
@media(max-width:1260px){#class3-english-runtime .ta3-super-topic-grid{grid-template-columns:repeat(3,minmax(0,1fr))}}
@media(max-width:960px){#class3-english-runtime .ta3-super-topic-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(min-width:900px) and (min-height:560px) and (max-width:1260px) and (orientation:landscape){
 #class3-english-runtime .ta3-super-topic-grid{grid-template-columns:repeat(4,minmax(0,1fr))}
 #class3-english-runtime .ta3-super-topic{gap:7px;padding:10px 41px 29px 9px;min-height:118px}
 #class3-english-runtime .ta3-super-icon{flex-basis:44px;width:44px;height:44px;font-size:27px;border-radius:13px}
 #class3-english-runtime .ta3-super-names{gap:4px}
 #class3-english-runtime .ta3-super-names strong{font-size:20px;line-height:1.23}
 #class3-english-runtime .ta3-super-names span{font-size:20px;line-height:1.25}
 #class3-english-runtime .ta3-super-check{right:8px;top:8px;width:29px;height:29px;border-radius:9px;font-size:20px}
 #class3-english-runtime .ta3-super-count{right:8px;bottom:7px;font-size:20px;padding:2px 7px}
}
@media(min-width:601px) and (max-width:1260px) and (orientation:portrait){
 #class3-english-runtime .ta3-super-topic-grid{grid-template-columns:repeat(2,minmax(0,1fr))}
}
@media(max-width:600px){
 #class3-english-runtime .ta3-super-topic-grid{grid-template-columns:1fr;gap:9px}
 #class3-english-runtime .ta3-super-topic{min-height:98px;padding:10px 46px 26px 10px;gap:10px}
 #class3-english-runtime .ta3-super-icon{flex-basis:52px;width:52px;height:52px;font-size:29px}
 #class3-english-runtime .ta3-super-names strong{font-size:20px}
 #class3-english-runtime .ta3-super-names span{font-size:20px}
 #class3-english-runtime .ta3-super-guide strong{font-size:20px}
 #class3-english-runtime .ta3-super-guide span{font-size:20px}
 #class3-english-runtime .ta3-super-actions{gap:7px}
 #class3-english-runtime .ta3-super-start{width:100%;font-size:20px}
 #class3-english-runtime .ta3-super-intro{flex-wrap:wrap;gap:8px;margin-bottom:12px}
 #class3-english-runtime .ta3-super-guide{flex:1 1 100%;padding:3px 0}
 #class3-english-runtime .ta3-super-start-top{width:auto;min-width:165px;margin-left:auto;min-height:44px;padding:8px 13px}
 #class3-english-runtime .ta3-super-status{font-size:20px}
}
@media(prefers-reduced-motion:reduce){#class3-english-runtime .ta3-super-topic .ta3-super-icon{transform:none!important;transition:none}}

/* Class3 English M11 — layout and interaction adapted from the Class2 module form. */
#class3-english-runtime .ta3-m11-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;max-width:82rem;margin:0 auto}
#class3-english-runtime .ta3-m11-card{display:flex;align-items:center;gap:15px;text-align:left;padding:20px;min-height:122px;background:#f0f9ff;border:1.5px solid #bfdbfe;border-radius:20px;color:#334155;cursor:pointer;box-shadow:none;transition:border-color .16s,box-shadow .16s}
#class3-english-runtime .ta3-m11-card-blue{background:#eff6ff;border-color:#bfdbfe}
#class3-english-runtime .ta3-m11-card-purple{background:#faf5ff;border-color:#ddd6fe}
#class3-english-runtime .ta3-m11-card-pink{background:#fff1f2;border-color:#fbcfe8}
#class3-english-runtime .ta3-m11-card:hover,#class3-english-runtime .ta3-m11-card:focus-visible{border-color:#a855f7;box-shadow:0 0 0 2px rgba(168,85,247,.12)}
#class3-english-runtime .ta3-m11-card .ta3-m11-icon{display:flex;align-items:center;justify-content:center;flex:0 0 66px;height:66px;border-radius:18px;background:#fff;border:1.5px solid #e9d5ff;font-size:37px;transition:transform .18s}
#class3-english-runtime .ta3-m11-card:hover .ta3-m11-icon{transform:scale(1.055)}
#class3-english-runtime .ta3-m11-card div{display:flex;flex-direction:column;gap:5px;min-width:0;flex:1}
#class3-english-runtime .ta3-m11-card strong{font-size:20px;color:#6d28d9;line-height:1.23;font-weight:950}
#class3-english-runtime .ta3-m11-card span:not(.ta3-m11-icon){font-size:20px;color:#475569;line-height:1.3;font-weight:850}
#class3-english-runtime .ta3-m11-card small{font-size:20px;color:#64748b;line-height:1.4;font-weight:800}
#class3-english-runtime .ta3-m11-card>b{font-size:28px;color:#a855f7}
#class3-english-runtime .ta3-m11-level-grid{grid-template-columns:repeat(3,minmax(0,1fr))}
#class3-english-runtime .ta3-m11-level-grid .ta3-m11-card{padding:16px;min-height:116px}
#class3-english-runtime .ta3-m11-level-grid .ta3-m11-card .ta3-m11-icon{height:58px;flex-basis:58px;font-size:32px}
#class3-english-runtime .ta3-m11-level-grid .ta3-m11-card strong{font-size:20px}
#class3-english-runtime .ta3-m11-tip{color:#64748b;font-size:20px;text-align:center;font-weight:800;margin:15px 0}
#class3-english-runtime .ta3-m11-card-list{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:11px}
#class3-english-runtime .ta3-m11-list-card{display:flex;gap:12px;align-items:center;min-height:106px;text-align:left;padding:12px;background:#fff;border:1.5px solid #e9d5ff;border-radius:17px;transition:border-color .18s,box-shadow .18s}
#class3-english-runtime .ta3-m11-list-card:hover{border-color:#a855f7;box-shadow:0 0 0 2px rgba(168,85,247,.09)}
#class3-english-runtime .ta3-m11-list-card img{width:85px;height:77px;object-fit:contain;border-radius:12px;background:#fff;border:1px solid #f5d0fe;flex:0 0 85px}
#class3-english-runtime .ta3-m11-list-card span{min-width:0;flex:1;display:flex;flex-direction:column;gap:5px}
#class3-english-runtime .ta3-m11-list-card strong{font-size:20px;font-weight:950;color:#6d28d9;line-height:1.25}
#class3-english-runtime .ta3-m11-list-card small{font-size:20px;color:#64748b;line-height:1.35;font-weight:800}
#class3-english-runtime .ta3-m11-list-card>b{font-size:24px;color:#a855f7}
#class3-english-runtime .ta3-m11-pagination{display:flex;gap:12px;align-items:center;justify-content:center;flex-wrap:wrap;margin:20px auto 10px}
#class3-english-runtime .ta3-m11-pagination button{min-height:45px;min-width:125px;padding:9px 15px;background:#f5f3ff;border:1.5px solid #c4b5fd;color:#6d28d9;border-radius:14px;font-size:20px;font-weight:950}
#class3-english-runtime .ta3-m11-pagination button:disabled{opacity:.43;cursor:not-allowed}
#class3-english-runtime .ta3-m11-pagination span{font-size:20px;font-weight:950;color:#64748b}
#class3-english-runtime .ta3-m11-pagination .ta3-m11-primary{color:#fff;background:linear-gradient(110deg,#ec4899,#8b5cf6);border-color:#a855f7}
#class3-english-runtime .ta3-m11-study{width:100%;max-width:82rem;margin:0 auto;color:#334155}
#class3-english-runtime .ta3-m11-toolbar{display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;padding:4px 0 12px;font-size:20px;font-weight:950;color:#7c3aed}
#class3-english-runtime .ta3-m11-study-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:19px;align-items:start}
#class3-english-runtime .ta3-m11-panel{background:linear-gradient(150deg,#fff1f7,#faf5ff);border:2px solid #fbcfe8;border-radius:23px;padding:16px;min-width:0}
#class3-english-runtime .ta3-m11-panel-head{display:flex;gap:8px;justify-content:space-between;align-items:flex-start;margin-bottom:14px}
#class3-english-runtime .ta3-m11-panel-head h3{font-size:21px;line-height:1.27;color:#a21caf;font-weight:950;margin:0}
#class3-english-runtime .ta3-m11-panel-head p{font-size:20px;line-height:1.36;color:#64748b;font-weight:850;margin:5px 0}
#class3-english-runtime .ta3-m11-speak,#class3-english-runtime .ta3-m11-q-sound{border:1.5px solid #c4b5fd;background:#fff;color:#7c3aed;border-radius:12px;min-height:40px;padding:6px 11px;font-size:20px;font-weight:900;flex-shrink:0}
#class3-english-runtime .ta3-m11-reading-image,#class3-english-runtime .ta3-m11-picture-frame{display:flex;align-items:center;justify-content:center;min-height:170px;background:#fff;border:1px solid #fbcfe8;border-radius:17px;padding:12px;overflow:hidden}
#class3-english-runtime .ta3-m11-reading-image .ta3-m11-photo{width:100%;max-height:245px;object-fit:contain}
#class3-english-runtime .ta3-m11-picture-frame{min-height:340px}
#class3-english-runtime .ta3-m11-picture-frame .ta3-m11-photo{width:100%;max-height:440px;object-fit:contain}
#class3-english-runtime .ta3-m11-photo{display:block;height:auto}
#class3-english-runtime .ta3-m11-photo-warning{font-size:20px;font-weight:850;color:#92400e;line-height:1.5;text-align:center;padding:24px;background:#fffbeb;border:1px solid #fde68a;border-radius:14px}
#class3-english-runtime .ta3-m11-passage{background:#fff;border:1px solid #fce7f3;border-radius:15px;padding:13px 15px;margin-top:12px}
#class3-english-runtime .ta3-m11-passage p{font-size:20px;line-height:1.6;font-weight:830;color:#1e293b;margin:0 0 9px}
#class3-english-runtime .ta3-m11-passage p:last-child{margin-bottom:0}
#class3-english-runtime .ta3-m11-translation{margin-top:13px;background:#fff;border:1.5px solid #ddd6fe;border-radius:15px;padding:13px}
#class3-english-runtime .ta3-m11-translation strong{font-size:20px;color:#7c3aed;font-weight:950}
#class3-english-runtime .ta3-m11-translation p{font-size:20px;line-height:1.55;color:#475569;font-weight:800;margin:7px 0 0}
#class3-english-runtime .ta3-m11-note{text-align:center;color:#64748b;font-size:20px;line-height:1.45;font-weight:850;margin:14px 0 3px}
#class3-english-runtime .ta3-m11-caption{display:flex;flex-direction:column;gap:6px;text-align:center;margin-top:12px}
#class3-english-runtime .ta3-m11-caption strong{font-size:21px;font-weight:950;color:#6d28d9}
#class3-english-runtime .ta3-m11-caption span{font-size:20px;font-weight:850;color:#475569}
#class3-english-runtime .ta3-m11-question-list{display:flex;flex-direction:column;gap:12px;min-width:0}
#class3-english-runtime .ta3-m11-question{background:#fff;border:1.5px solid #e9d5ff;border-radius:18px;padding:13px;min-width:0}
#class3-english-runtime .ta3-m11-question-top{display:flex;align-items:flex-start;gap:9px;margin-bottom:12px}
#class3-english-runtime .ta3-m11-no{background:linear-gradient(100deg,#ec4899,#8b5cf6);display:flex;align-items:center;justify-content:center;color:#fff;font-size:20px;font-weight:950;border-radius:50%;width:30px;height:30px;flex:0 0 30px}
#class3-english-runtime .ta3-m11-question-text{min-width:0;flex:1}
#class3-english-runtime .ta3-m11-question-text h4{font-size:20px;line-height:1.35;color:#1e293b;font-weight:950;margin:0}
#class3-english-runtime .ta3-m11-question-text p{font-size:20px;line-height:1.35;color:#64748b;font-weight:850;margin:6px 0 0}
#class3-english-runtime .ta3-m11-options{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}
#class3-english-runtime .ta3-m11-option{display:flex;align-items:flex-start;gap:7px;min-height:56px;padding:11px;text-align:left;border:1.5px solid #e9d5ff;border-radius:12px;font-size:20px;line-height:1.4;font-weight:850;color:#334155;background:#fff;overflow-wrap:anywhere;transition:border-color .15s,background .15s}
#class3-english-runtime .ta3-m11-option b{color:#a21caf}
#class3-english-runtime .ta3-m11-option>span:nth-of-type(1){flex:1;min-width:0}
#class3-english-runtime .ta3-m11-option.correct{background:#ecfdf5;border-color:#34d399;color:#065f46}
#class3-english-runtime .ta3-m11-option.wrong{background:#fff1f2;border-color:#fb7185;color:#be123c}
#class3-english-runtime .ta3-m11-option:disabled{cursor:default}
#class3-english-runtime .ta3-m11-check{color:#047857;font-weight:950}
#class3-english-runtime .ta3-m11-feedback{font-size:20px;line-height:1.45;font-weight:850;padding:9px 11px;margin:10px 0 0;border-radius:11px}
#class3-english-runtime .ta3-m11-feedback.correct{background:#ecfdf5;color:#065f46;border:1px solid #a7f3d0}
#class3-english-runtime .ta3-m11-feedback.hint{background:#fffbeb;color:#92400e;border:1px solid #fde68a}
#class3-english-runtime .ta3-m11-complete{text-align:center;color:#047857;font-size:20px;font-weight:950;margin:16px 0}
#class3-english-runtime .ta3-m11-footer{margin:24px auto 4px}
@media(max-width:1023px){
 #class3-english-runtime .ta3-m11-card-list{grid-template-columns:repeat(2,minmax(0,1fr))}
 #class3-english-runtime .ta3-m11-level-grid{grid-template-columns:1fr}
}
@media(max-width:767px){
 #class3-english-runtime .ta3-m11-grid,#class3-english-runtime .ta3-m11-study-grid,#class3-english-runtime .ta3-m11-card-list{grid-template-columns:1fr}
 #class3-english-runtime .ta3-m11-card{min-height:95px;padding:12px;gap:11px}
 #class3-english-runtime .ta3-m11-card .ta3-m11-icon{flex-basis:53px;height:53px;font-size:30px;border-radius:14px}
 #class3-english-runtime .ta3-m11-card strong{font-size:20px}
 #class3-english-runtime .ta3-m11-card span:not(.ta3-m11-icon){font-size:20px}
 #class3-english-runtime .ta3-m11-card small{font-size:20px}
 #class3-english-runtime .ta3-m11-study-grid{gap:12px}
 #class3-english-runtime .ta3-m11-panel{padding:12px}
 #class3-english-runtime .ta3-m11-picture-frame{min-height:245px}
 #class3-english-runtime .ta3-m11-picture-frame .ta3-m11-photo{max-height:325px}
 #class3-english-runtime .ta3-m11-options{grid-template-columns:1fr}
 #class3-english-runtime .ta3-m11-question-text h4{font-size:20px}
 #class3-english-runtime .ta3-m11-option{font-size:20px;min-height:49px}
 #class3-english-runtime .ta3-m11-pagination button{min-width:100px;font-size:20px}
}
@media(prefers-reduced-motion:reduce){#class3-english-runtime .ta3-m11-card .ta3-m11-icon{transition:none;transform:none!important}}


/* 21/10/2026 - consistent L3 learning card hierarchy and accessibility. */
#class3-english-runtime .ta3-folder-head{min-width:0;max-width:100%}
#class3-english-runtime .ta3-folder-copy{width:100%;max-width:100%;min-width:0;overflow-wrap:anywhere}
#class3-english-runtime .ta3-folder-copy strong,#class3-english-runtime .ta3-folder-copy small{overflow-wrap:anywhere;word-break:normal}
@media(max-width:359px){#class3-english-runtime .ta3-folder-grid{grid-template-columns:1fr}}

#class3-english-runtime .ta3-folder-copy strong{font-size:24px;line-height:1.27}
#class3-english-runtime .ta3-folder-copy small{font-size:20px;line-height:1.38}
#class3-english-runtime .ta3-vocab-level strong,#class3-english-runtime .ta3-sgk-quiz-hub .ta3-vocab-level strong{font-size:24px;line-height:1.28}
#class3-english-runtime .ta3-vocab-level small,#class3-english-runtime .ta3-sgk-quiz-hub .ta3-vocab-level small,#class3-english-runtime .ta3-sgk-quiz-hub .ta3-vocab-level small.ta3-sgk-level-topics{font-size:20px;line-height:1.4}
#class3-english-runtime .ta3-folder,#class3-english-runtime .ta3-vocab-level{height:auto}
#class3-english-runtime .ta3-vocab-image{height:242px;max-height:242px;display:flex;align-items:center;justify-content:center}
#class3-english-runtime .ta3-vocab-image img{display:block;width:100%;height:100%;object-fit:contain;object-position:center}
#class3-english-runtime :is(.ta3-back,.ta3-mini,.ta3-submit,.ta3-vocab-tabs button,.ta3-vocab-listen,.ta3-vocab-return){height:auto;min-height:54px;line-height:1.25;white-space:normal}
#class3-english-runtime .ta3-nav{grid-template-columns:minmax(0,1fr) minmax(76px,max-content) minmax(0,1fr)}
#class3-english-runtime .ta3-nav button,#class3-english-runtime .ta3-nav span{height:auto;min-height:56px;font-size:20px;line-height:1.25;padding:9px 7px}
#class3-english-runtime .ta3-vocab-nav button,#class3-english-runtime .ta3-vocab-nav span{height:auto;min-height:56px;font-size:20px;line-height:1.25}
#class3-english-runtime .ta3-shared-nav button,#class3-english-runtime .ta3-shared-nav span{height:auto;min-height:56px;font-size:20px;line-height:1.25}
@media(max-width:767px){
 #class3-english-runtime .ta3-folder-copy strong{font-size:22px}
 #class3-english-runtime .ta3-vocab-level strong,#class3-english-runtime .ta3-sgk-quiz-hub .ta3-vocab-level strong{font-size:22px}
 #class3-english-runtime .ta3-vocab-level small{font-size:20px}
 #class3-english-runtime .ta3-vocab-image{height:clamp(190px,62vw,242px);max-height:none}
 #class3-english-runtime .ta3-vocab-prompt{flex-wrap:wrap}
 #class3-english-runtime .ta3-vocab-prompt button{flex:0 0 auto;margin:6px auto 0}
 #class3-english-runtime .ta3-vocab-prompt h2{width:100%;text-align:center}
 #class3-english-runtime .ta3-tts-tools{justify-content:center}
 #class3-english-runtime .ta3-ta2-menu-listen{display:flex;justify-content:center;margin:10px auto}
 #class3-english-runtime .ta3-nav,#class3-english-runtime .ta3-vocab-nav,#class3-english-runtime .ta3-shared-nav{gap:5px}
}

@media(max-width:767px){
 #class3-english-runtime .ta3-vocab-prompt button{min-width:54px;min-height:54px;height:auto}
 #class3-english-runtime .ta3-vocab-listen{display:block;min-height:54px;margin:8px auto}
 #class3-english-runtime .ta3-vocab-word-row{flex-wrap:wrap}
}

/* 21/10/2026 - blue-green rectangular Listen buttons across English app. */
#class3-english-runtime :is(.ta3-listen-btn,.ta3-shared-prompt-listen,.ta3-vocab-listen,.ta3-ta2-menu-listen,.ta3-ta2-alphabet-listen,.ta3-ta2-practice-listen,.ta3-ta2-ipa-guide-listen,.ta3-m11-speak,.ta3-m11-q-sound,button[data-action="grammar-instruction"],button[data-action="grammar-listen"],button[data-action="sgk-listen-passage"],button[data-action="sgk-listen-question"],button[data-action="sgk-listen-complete"],button[data-action="sgk-instruction"],button[data-action="shared-replay"],button[data-action="shared-instruction"],button[data-action="flash-listen"],button[data-action="lesson-listen"],button[data-action="word-speak"],button[data-action="ta2-alpha-intro-listen"],button[data-action="ta2-ipa-guide"],button[data-action="listen-audio"]){display:inline-flex;align-items:center;justify-content:center;gap:6px;min-height:40px;padding:8px 14px;border:1.5px solid #0f766e;border-radius:12px;background:linear-gradient(135deg,#0ea5e9 0%,#14b8a6 55%,#22c55e 100%);color:#fff;font-size:20px;font-weight:400;line-height:1.2;text-align:center;box-shadow:0 6px 14px rgba(20,184,166,.18);cursor:pointer}
#class3-english-runtime :is(.ta3-listen-btn,.ta3-shared-prompt-listen,.ta3-vocab-listen,.ta3-ta2-menu-listen,.ta3-ta2-alphabet-listen,.ta3-ta2-practice-listen,.ta3-ta2-ipa-guide-listen,.ta3-m11-speak,.ta3-m11-q-sound,button[data-action="grammar-instruction"],button[data-action="grammar-listen"],button[data-action="sgk-listen-passage"],button[data-action="sgk-listen-question"],button[data-action="sgk-listen-complete"],button[data-action="sgk-instruction"],button[data-action="shared-replay"],button[data-action="shared-instruction"],button[data-action="flash-listen"],button[data-action="lesson-listen"],button[data-action="word-speak"],button[data-action="ta2-alpha-intro-listen"],button[data-action="ta2-ipa-guide"],button[data-action="listen-audio"]):hover{filter:brightness(1.03);box-shadow:0 8px 18px rgba(20,184,166,.25)}
#class3-english-runtime :is(.ta3-listen-btn,.ta3-shared-prompt-listen,.ta3-vocab-listen,.ta3-ta2-menu-listen,.ta3-ta2-alphabet-listen,.ta3-ta2-practice-listen,.ta3-ta2-ipa-guide-listen,.ta3-m11-speak,.ta3-m11-q-sound,button[data-action="grammar-instruction"],button[data-action="grammar-listen"],button[data-action="sgk-listen-passage"],button[data-action="sgk-listen-question"],button[data-action="sgk-listen-complete"],button[data-action="sgk-instruction"],button[data-action="shared-replay"],button[data-action="shared-instruction"],button[data-action="flash-listen"],button[data-action="lesson-listen"],button[data-action="word-speak"],button[data-action="ta2-alpha-intro-listen"],button[data-action="ta2-ipa-guide"],button[data-action="listen-audio"]):focus-visible{outline:3px solid #99f6e4;outline-offset:2px}
#class3-english-runtime .ta3-listen-btn::before{content:"🔊";display:inline-block;font-size:14px;line-height:1;transform:translateY(-.5px)}
#class3-english-runtime .ta3-listen-btn{letter-spacing:0}
#class3-english-runtime .ta3-vocab-example button,#class3-english-runtime .ta3-vocab-word-sound,#class3-english-runtime .ta3-vocab-prompt button,#class3-english-runtime .ta3-m11-q-sound{min-width:88px}
#class3-english-runtime .ta3-vocab-listen,#class3-english-runtime .ta3-vocab-sound,#class3-english-runtime .ta3-m11-speak{min-width:112px}
#class3-english-runtime .ta3-vocab-sound{width:auto;height:auto;margin:12px auto}
#class3-english-runtime .ta3-vocab-word-sound{width:auto;height:auto;flex:0 0 auto}
#class3-english-runtime .ta3-vocab-prompt button{min-width:96px;min-height:40px;height:auto;border-radius:12px;background:linear-gradient(135deg,#0ea5e9 0%,#14b8a6 55%,#22c55e 100%)}
#class3-english-runtime .ta3-vocab-example button{min-height:40px}
#class3-english-runtime .ta3-vocab-word-row{gap:12px}
@media(max-width:767px){
 #class3-english-runtime .ta3-vocab-example button,#class3-english-runtime .ta3-vocab-word-sound,#class3-english-runtime .ta3-vocab-prompt button,#class3-english-runtime .ta3-m11-q-sound{min-width:82px;padding:8px 12px;font-size:20px}
 #class3-english-runtime .ta3-vocab-listen,#class3-english-runtime .ta3-vocab-sound,#class3-english-runtime .ta3-m11-speak{min-width:104px}
}

/* Keep long Vietnamese puzzle clues clear of the picture on narrow phones. */
@media(max-width:420px){
  #class3-english-runtime .ta3-vocab-puzzle-image{height:260px;max-height:none;padding-bottom:108px}
}


/* 21/10/2026 - 20px minimum for readable text in the English 3 module. */
#class3-english-runtime{font-size:20px}
#class3-english-runtime :is(button,input,select,textarea,small,summary){font-size:inherit}
/* Long example words must wrap inside the left text column at >=20px. */
#class3-english-runtime .ta3-vocab-example-text{overflow-wrap:anywhere}
/* Puzzle M2/M12: answer row to navigation is 28px = half of Next 56px. */
#class3-english-runtime .ta3-vocab-choices + .ta3-vocab-nav{margin-top:28px}
/* On narrow phones the three-item navigation is 68px high after text wraps. */
@media(max-width:399px){
  #class3-english-runtime .ta3-vocab-choices + .ta3-vocab-nav{margin-top:34px}
}
  `;
})();
