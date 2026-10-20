/* Epsilon Edu - LOP 3 - Tieng Viet module.
 * Eight independent TV3 JSON sources; Class 2 is visual reference only.
 * Class 3 shell owns login, entitlement and admin; Class 3 GAS owns official grades.
 */
(() => {
  'use strict';
  if (window.CLASS3_SUBJECT_MODULES?.vietnamese) return;

  const SUBJECT = 'tv', ROOT_ID = 'class3-vietnamese-runtime';
  const DATA_ROOT = 'assets/data/vietnamese/';
  const DATA_FILES = Object.freeze({
    discover1:'kham_pha_tieng_viet_3_part1.json',
    discover2:'kham_pha_tieng_viet_3_part2.json',
    lessons:'bai_hoc_tieng_viet_3.json',
    exercise1:'bai_tap_tieng_viet_3_hk1.json',
    exercise2:'bai_tap_tieng_viet_3_hk2.json',
    review:'on_tap_tieng_viet_3.json',
    exams:'de_thi_tieng_viet_3.json',
    stories:'truyen_co_tich.json'
  });
  const TAB_NAMES = Object.freeze({discover:'Khám phá',lessons:'Bài học',exercises:'Bài tập',review:'Ôn tập',exams:'Đề thi',games:'Mini games'});
  const TOPIC_ICONS = ['🛡️','🌈','🌷','🌿','💎','🪄','🧩','💬','📖','👑','📋','📚'];
  const SKILLS = Object.freeze({TV3_C1:'Chính tả & Viết hoa',TV3_C2:'Biện pháp tu từ',TV3_C3:'Từ vựng & Từ loại',TV3_C4:'Cú pháp & Dấu câu',TV3_C5:'Đọc hiểu & Vận dụng',TV3_C6:'Tư duy logic (IQ)'});
  const EXAM_GROUPS = [
    {key:'Giữa học kỳ 1',label:'Giữa học kỳ 1',icon:'🌼',desc:'Ôn tập tuần 1–8'},
    {key:'Học kỳ 1',label:'Học kỳ 1',icon:'🌸',desc:'Đề kiểm tra cuối học kỳ 1'},
    {key:'Giữa học kỳ 2',label:'Giữa học kỳ 2',icon:'🌻',desc:'Ôn tập tuần 19–26'},
    {key:'Học kỳ 2',label:'Học kỳ 2',icon:'⭐',desc:'Đề kiểm tra cuối học kỳ 2'},
    {key:'Học sinh giỏi',label:'Học sinh giỏi',icon:'🏆',desc:'Đề nâng cao, chỉ chấm điểm'}
  ];
  const GAMES = [
    ['Hiệp sĩ Chính tả','⚔️','Săn Quái Chữ · thử thách chính tả',true],
    ['Kho báu âm vần','💎','Ghép âm đầu, vần và thanh',true],
    ['Khu vườn từ loại','🌳','Phân loại sự vật, hoạt động và đặc điểm',true],
    ['Đoàn tàu ghép câu','🚂','Xếp từ thành câu hoàn chỉnh',true],
    ['Bác sĩ dấu câu','🩺','Tìm và chữa dấu câu chưa đúng',true],
    ['Phép thuật Tu từ','🎭','So sánh và nhân hóa thật sinh động',true],
    ['Câu cá từ vựng','🎣','Câu đúng từ theo từng chủ đề',true],
    ['Thám tử đọc hiểu','🕵️','Truy tìm chi tiết trong đoạn đọc',true],
    ['Đấu trường câu đố','🏆','Giải đố dân gian và IQ ngôn ngữ',true],
    ['Đại sứ Giao tiếp','💌','Chọn lời nói và văn bản phù hợp',true],
    ['Mê cung từ ngữ','🌀','Tìm đường qua các từ đúng',true],
    ['Cô Ong ra lệnh','🐝','Phản xạ đọc hiểu thật nhanh',true]
  ];
  const cache = new Map();
  let catalog = null, catalogBySrc = null;
  let ctx = null, root = null, current = {tab:'discover',view:'hub'};
  let live = false, nonce = 0, quiz = null, progress = null;
  let selectedSemester = 1, selectedExerciseSemester = 1, selectedReviewSemester = 1;
  let lessonIndex = 0, lessonAnswers = {}, readingMode = 'read';
  let activeStory = null, storySection = 'vietnam', storyCategory = '', storyAnswers = {};
  // Navigation labels derive only from the current public learning content.
  const discoverTopicNames = new Map(), discoverSubNumbers = new Map();
  const storyRootLabel = '12. Truyện dân gian & cổ tích';
  let storyRegionLabel = '', storyCategoryLabel = '';
  let gameInstance = null, gameLoader = null;
  let activeAudio = null, speechNonce = 0, examTicker = null;
  let audioWaitResolve = null, synthWaitResolve = null;
  let clickHandler = null, inputHandler = null;
  let learningQueue = [], learningInFlight = null;
  const text = (value) => String(value == null ? '' : value);
  const arr = (value) => Array.isArray(value) ? value : [];
  const escapeHtml = (value) => text(value).replace(/[&<>"']/g, s=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[s]));
  const x = escapeHtml;
  const shuffle = (list) => { const a=arr(list).slice(); for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]];} return a; };
  const $ = (selector) => root?.querySelector(selector) || null;
  const logged = () => !!(ctx?.isAuthenticated && ctx?.user?.userId);
  const premium = () => logged() && ['vip','trial','admin'].includes(text(ctx?.accessType).toLowerCase());
  const toast = (msg) => ctx?.hooks?.showToast?.(text(msg));
  const notify = (msg) => ctx?.hooks?.showDialog?.({title:'Tiếng Việt 3',message:text(msg),icon:'🐝'});
  const setDetail = (detail) => {
    const hooks = ctx?.hooks;
    if (typeof hooks?.setDetail !== 'function') return;
    if (detail && typeof detail === 'object') {
      hooks.setDetail(hooks.supportsStructuredDetail === true ? detail : text(detail.title));
    } else hooks.setDetail(text(detail));
  };
  const clearDetail = () => ctx?.hooks?.clearDetail?.();
  function premiumGate(name) {if(premium())return true;ctx?.requestPremiumAccess?.(name || 'nội dung Tiếng Việt 3');return false;}
  const currentSemester = (num) => Number(num)===2 ? 'hk2' : 'hk1';
  function api(action,payload={}) {
    if(!logged()) return Promise.reject(new Error('NEED_LOGIN'));
    return ctx.apiRequest(action,Object.assign({subjectId:SUBJECT},payload));
  }
  async function load(key) {
    if(!Object.prototype.hasOwnProperty.call(DATA_FILES,key))throw new Error('File học liệu không được hỗ trợ.');
    if(cache.has(key))return cache.get(key);
    const promise=fetch(DATA_ROOT+DATA_FILES[key],{cache:'default',credentials:'omit'}).then(async response=>{
      if(!response.ok)throw new Error('Không tải được '+DATA_FILES[key]);
      const data=await response.json();if(!data||typeof data!=='object')throw new Error('Học liệu không hợp lệ.');return data;
    }).catch(err=>{cache.delete(key);throw err;});
    cache.set(key,promise);return promise;
  }
  async function loadCatalog() {
    if(catalogBySrc)return catalog;
    try {
      const response=await fetch('assets/data/shared_image_catalog.json',{cache:'default',credentials:'omit'});
      if(!response.ok)return null;
      const data=await response.json();const indexed=new Map();
      for(const [id,item] of Object.entries(data.images||{})) {
        if(item&&typeof item.src==='string'&&item.src.startsWith('assets/images/')&&!item.src.includes('..')&&!/[\x00-\x1f]/.test(item.src))indexed.set(item.src,{...item,imageId:id});
      }
      catalog=data;catalogBySrc=indexed;return data;
    } catch (_) {return null;}
  }
  async function picture(raw,alt='Minh họa bài học',allowText=false) {
    if(!raw)return '';
    await loadCatalog();
    const id=typeof raw==='object'?text(raw.imageId||raw.image_id||''):text(raw);
    const entry=catalog?.images?.[id] || catalogBySrc?.get(id);
    // Reading pages and finished stories can show approved labelled art;
    // assessment/practice questions still suppress labelled art to avoid answer leaks.
    if(!entry || (entry.has_text&&!allowText) || !entry.src?.startsWith('assets/images/'))return '';
    return `<figure class="tv3-picture"><img loading="lazy" decoding="async" src="${x(entry.src)}" alt="${x(entry.alt_vi||alt)}"><figcaption>${x(entry.name_vi||alt)}</figcaption></figure>`;
  }
  function stopSpeech() {
    speechNonce++;
    // Explicitly settle pending media promises: pause/cancel may not emit ended/error.
    const settleAudio=audioWaitResolve, settleSynth=synthWaitResolve;
    audioWaitResolve=null;synthWaitResolve=null;
    if(settleAudio)settleAudio(false);
    if(settleSynth)settleSynth();
    if(activeAudio){try{activeAudio.pause();activeAudio.removeAttribute('src');activeAudio.load();}catch(_){}activeAudio=null;}
    try{window.speechSynthesis?.cancel?.();}catch(_){}
  }
  function splitSpeech(input) {
    const s=text(input).replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim();if(!s)return [];
    const parts=s.match(/.{1,150}(?:[.!?;,:](?=\s|$)|(?=\s)|$)/g) || [];
    return parts.length?parts.map(v=>v.trim()).filter(Boolean):[s.slice(0,150)];
  }
  async function say(input) {
    stopSpeech();const token=speechNonce, parts=splitSpeech(input).slice(0,70);
    for(const part of parts) {
      if(!live||token!==speechNonce)break;
      let success=false;
      try {
        success=await new Promise(resolve=>{
          const a=new Audio();activeAudio=a;a.referrerPolicy='no-referrer';a.preload='none';
          let done=false;
          const finish=(value)=>{
            if(done)return;done=true;
            if(audioWaitResolve===finish)audioWaitResolve=null;
            if(activeAudio===a)activeAudio=null;
            try{a.pause();a.removeAttribute('src');a.load();}catch(_){}
            resolve(value);
          };
          audioWaitResolve=finish;
          a.src='https://translate.google.com/translate_tts?ie=UTF-8&tl=vi&client=tw-ob&q='+encodeURIComponent(part);
          a.playbackRate=.9;a.onended=()=>finish(true);a.onerror=()=>finish(false);
          Promise.resolve(a.play()).catch(()=>finish(false));
        });
      }catch(_){success=false;}
      if(!live||token!==speechNonce)break;
      if(!success && 'speechSynthesis' in window)await new Promise(resolve=>{
        let done=false;
        const finish=()=>{if(done)return;done=true;if(synthWaitResolve===finish)synthWaitResolve=null;resolve();};
        synthWaitResolve=finish;
        try {
          const u=new SpeechSynthesisUtterance(part);u.lang='vi-VN';u.rate=.9;
          u.onend=finish;u.onerror=finish;
          window.speechSynthesis.speak(u);
        }catch(_){finish();}
      });
    }
  }
  function stopClock(){if(examTicker){clearInterval(examTicker);examTicker=null;}}
  function stopGame(){if(gameInstance){try{gameInstance.destroy();}catch(_){}gameInstance=null;}}
  function clearView(){stopSpeech();stopClock();stopGame();quiz=null;ctx?.hooks?.setScore?.(0,0);}
  function setCurrent(tab,view,extras={}) {
    current={tab,view,...extras};
    if(view==='hub'){clearDetail();return;}
    if(tab!=='discover'){setDetail(extras.title||TAB_NAMES[tab]||'Tiếng Việt 3');return;}

    // The shell displays separate, clickable levels. Every Explore path starts here.
    const items=[{title:'Khám phá',action:()=>{void hub('discover');}}];
    const topicId=Number(current.topicId);
    if(Number.isInteger(topicId)&&topicId>=1&&topicId<=11){
      const topicName=discoverTopicNames.get(topicId)||text(extras.topicTitle||extras.title);
      items.push({title:`${topicId}. ${topicName}`,
        action:view==='topic'?null:()=>{void showTopic(topicId);}});
      if(view==='quiz'||view==='result'){
        const subName=text(extras.subTitle||extras.title).trim();
        if(subName){
          const localNo=discoverSubNumbers.get(topicId)?.get(subName);
          items.push({title:`${localNo ? localNo+'. ' : ''}${subName}`,
            action:view==='result'?()=>{void openSubtopic(topicId,subName);}:null});
        }
      }
    }else if(['stories-home','stories-region','stories-category','story'].includes(view)){
      items.push({title:storyRootLabel,
        action:view==='stories-home'?null:()=>{void storyHome();}});
      if(view!=='stories-home'){
        const region=storySection;
        const regionName=storyRegionLabel||(region==='vietnam'?'Truyện dân gian Việt Nam':'Truyện cổ tích thế giới');
        items.push({title:regionName,
          action:view==='stories-region'?null:()=>{void storyRegion(region);}});
        if(view==='stories-category'||view==='story'){
          const category=storyCategory;
          items.push({title:storyCategoryLabel||text(extras.title),
            action:view==='stories-category'?null:()=>{void storyCategoryView(category);}});
          if(view==='story')items.push({title:text(extras.title)});
        }
      }
    }else{setDetail(extras.title||TAB_NAMES[tab]);return;}
    setDetail({title:items.map(item=>item.title).join(' › '),items});
  }
  function still(requestNonce){return live && nonce===requestNonce && root?.isConnected;}
  function loading(){if(root)root.innerHTML='<div class="tv3-loading"><span class="tv3-spinner"></span>Đang tải học liệu Tiếng Việt 3…</div>';}
  function fail(err){if(root)root.innerHTML=`<div class="tv3-empty"><strong>Chưa mở được nội dung.</strong><span>${x(err?.message||'Anh/chị thử lại sau nhé.')}</span><button class="tv3-mini" data-action="hub">Về danh sách</button></div>`;}
  function heading(title,subtitle='',back=true){return `<div class="tv3-heading"><div><h2>${x(title)}</h2>${subtitle?`<p>${x(subtitle)}</p>`:''}</div>${back?'<button class="tv3-back" data-action="back">← Quay lại</button>':''}</div>`;}
  function folder(name,desc,icon,action,attrs='',foot='Mở nội dung',i=0,locked=false) {
    return `<button class="tv3-folder ${locked?'tv3-locked':''}" data-tone="${i%6}" data-action="${x(action)}" ${attrs} ${locked?'aria-disabled="true"':''}>
      <span class="tv3-folder-head"><span class="tv3-icon" aria-hidden="true">${x(icon)}</span><span class="tv3-folder-copy"><strong>${x(name)}</strong><small>${x(desc)}</small></span></span>
      <span class="tv3-folder-foot"><span>${x(foot)}</span><b>${locked?'🔒':'➜'}</b></span></button>`;
  }
  const grid = (cards,variant='')=>`<div class="tv3-folder-grid${variant?' tv3-'+variant:''}">${cards.join('')}</div>`;
  // Display-only learning catalogue; all IDs and original JSON titles remain unchanged.
  const DISCOVER_DESCS = Object.freeze({
    1:'Phân biệt âm, vần khó và luyện viết hoa đúng.',2:'Nhận biết sự vật, từ ngữ và cách so sánh.',
    3:'Nhận ra cách nhân hóa sự vật trong câu văn.',4:'Danh từ, động từ, tính từ và quan hệ nghĩa.',
    5:'Mở rộng vốn từ theo gia đình, trường học và cuộc sống.',6:'Chọn và sử dụng dấu câu đúng ngữ cảnh.',
    7:'Đặt câu và nhận biết các kiểu câu hỏi.',8:'Chọn lời nói, cách ứng xử phù hợp.',
    9:'Đọc văn bản, tìm chi tiết và hiểu ý chính.',10:'Suy luận ngôn ngữ và sắp xếp đoạn văn.',
    11:'Làm quen đơn từ và phiếu đọc sách.'
  });
  const SUB_ICONS = Object.freeze([
    '🔤','✍️','📝','🗣️','🔎','📖','🧠','💡','🎯','🔠','🌱','📌','🧩','💬','🎨','📋'
  ]);
  function subDescription(topicId,sub){
    const n=text(sub).toLocaleLowerCase('vi-VN');
    if(n.includes('ch/tr')||n.includes('s/x')||n.includes('l/n'))return 'Nghe, phân biệt và chọn đúng âm đầu trong từ.';
    if(n.includes('viết hoa')||n.includes('tên riêng'))return 'Nhận biết tên riêng và áp dụng quy tắc viết hoa.';
    if(n.includes('chính tả')||n.includes('vần khó'))return 'Luyện chọn chữ và viết đúng các âm, vần dễ nhầm.';
    if(n.includes('so sánh'))return 'Xác định sự vật, từ so sánh và hình ảnh trong câu.';
    if(n.includes('nhân hóa'))return 'Tìm từ ngữ và nhận biết cách nhân hóa sự vật.';
    if(n.includes('danh từ'))return 'Nhận biết từ gọi tên sự vật trong câu.';
    if(n.includes('động từ'))return 'Nhận biết từ chỉ hoạt động hoặc trạng thái.';
    if(n.includes('tính từ'))return 'Tìm từ chỉ đặc điểm, tính chất.';
    if(n.includes('đồng nghĩa'))return 'Tìm những từ khác nhau nhưng gần nghĩa.';
    if(n.includes('trái nghĩa'))return 'Nhận biết các cặp từ có nghĩa trái ngược.';
    if(n.includes('chủ đề')||n.includes('vốn từ'))return 'Nhận biết và vận dụng từ ngữ theo chủ điểm.';
    if(n.includes('dấu'))return 'Chọn và sử dụng dấu câu phù hợp với ý câu.';
    if(n.includes('câu hỏi'))return 'Đọc ngữ cảnh và chọn câu trả lời phù hợp.';
    if(n.includes('kiểu câu')||n.includes('đặt câu'))return 'Nhận biết cấu trúc và cách diễn đạt câu.';
    if(n.includes('giao tiếp'))return 'Lựa chọn cách nói lịch sự trong tình huống.';
    if(n.includes('đọc hiểu'))return 'Đọc văn bản và trả lời câu hỏi theo nội dung.';
    if(n.includes('sắp xếp'))return 'Sắp xếp các câu thành đoạn văn mạch lạc.';
    if(n.includes('iq')||n.includes('trạng nguyên'))return 'Suy luận và giải thử thách tư duy ngôn ngữ.';
    if(n.includes('phiếu')||n.includes('đơn từ'))return 'Đọc, hiểu và hoàn thành văn bản thực tế.';
    return DISCOVER_DESCS[Number(topicId)]||'Luyện tập kiến thức Tiếng Việt lớp 3.';
  }
  function nav(index,length,prefix='question'){
    return `<div class="tv3-nav"><button data-action="${x(prefix)}-prev" ${index<=0?'disabled':''}>← ${prefix==='lesson'?'Trang trước':'Câu trước'}</button><span>${index+1}/${length}</span><button class="primary" data-action="${x(prefix)}-next" ${index>=length-1?'disabled':''}>${prefix==='lesson'?'Trang sau':'Câu sau'} →</button></div>`;
  }
  function semesterTabs(selected,action){return `<div class="tv3-switch"><button data-action="${x(action)}" data-sem="1" class="${selected===1?'on':''}">Học kỳ 1</button><button data-action="${x(action)}" data-sem="2" class="${selected===2?'on':''}">Học kỳ 2</button></div>`;}
  function normalizeQuestion(q,exam=false){return {
    id:text(exam?q.question_id:q.id),prompt:text(exam?q.question_text:q.q),options:arr(exam?q.options:q.o).map(text),
    answer:text(exam?q.answer:q.a),hint:text(exam?(q.explanation||q.hint):q.h),
    skill:text(q.skill_tag||q.competency||''),image:q.img||q.image_url||'',emoji:text(q.emoji||''),
    points:exam?Number(q.score||0):1,passage:text(q.reading_passage||''),readingTitle:text(q.reading_title||'')
  };}
  function observe(question,correct,location){
    if(!logged()||!question)return;
    const skill=/^TV3_C[1-6]$/.test(text(question.skill))?question.skill:'TV3_MISC';
    const origin=text(location).replace(/[^A-Za-z0-9]/g,'').slice(0,14)||'practice';
    learningQueue.push({t:Date.now(),q:text(question.id).slice(0,64),s:`${skill}.${origin}`,o:correct?'c':'w',e:origin,u:0,l:1,tp:0});
    if(learningQueue.length>=10)void flushLearning();
  }
  async function flushLearning(){
    if(!logged()||learningInFlight||!learningQueue.length)return;
    const events=learningQueue.splice(0,20),call=ctx.apiRequest;
    learningInFlight=Promise.resolve(call('learningProfileSaveBatch',{subjectId:SUBJECT,events}))
      .catch(()=>{/* Telemetry is never evidence for unlocking or official marks. */})
      .finally(()=>{learningInFlight=null;if(learningQueue.length>=10)void flushLearning();});
    return learningInFlight;
  }
  async function getTopics(){
    const [a,b]=await Promise.all([load('discover1'),load('discover2')]);
    const topics=arr(a.topics).concat(arr(b.topics)).sort((p,q)=>Number(p.id)-Number(q.id));
    for(const topic of topics){
      const id=Number(topic.id);
      discoverTopicNames.set(id,text(topic.name));
      const subs=[...new Set(arr(topic.qs).map(q=>text(q.sub)))];
      discoverSubNumbers.set(id,new Map(subs.map((name,index)=>[name,index+1])));
    }
    return topics;
  }
  async function hub(tab='discover'){
    const request=++nonce;clearView();setCurrent(tab,'hub');loading();
    try {
      if(tab==='discover'){
        const topics=await getTopics();if(!still(request))return;
        root.innerHTML=heading('Khám phá Tiếng Việt 3','11 chuyên đề kiến thức và thư viện truyện dân gian, cổ tích',false)+grid(topics.map((t,i)=>folder(`${t.id}. ${t.name}`,DISCOVER_DESCS[Number(t.id)]||t.desc,TOPIC_ICONS[i]||'📚','topic',`data-topic="${Number(t.id)}"`,`${arr(t.qs).length} câu · ${new Set(arr(t.qs).map(q=>q.sub)).size} mục nhánh`,i)).concat(folder('12. Truyện dân gian & cổ tích','Đọc truyện Việt Nam và thế giới, luyện đọc hiểu.','📚','story-home','','240 truyện · 3 câu đọc hiểu/truyện',11)),'discover-home');
      } else if(tab==='lessons')await lessonList(request);
      else if(tab==='exercises')await exerciseList(request);
      else if(tab==='review')await reviewList(request);
      else if(tab==='exams')await examGroups(request);
      else if(tab==='games'){
        root.innerHTML=heading('Mini games Tiếng Việt 3','12 trò chơi rèn tư duy ngôn ngữ · chọn game để bắt đầu',false)+grid(GAMES.map((g,i)=>folder(g[0],g[2],g[1],g[3]?'game-open':'game-pending',`data-game="${i}"`,g[3]?'Chơi ngay':'Chưa triển khai',i,!g[3])));
      }
    }catch(err){if(still(request))fail(err);}
  }
  async function showTopic(topicId){
    const request=++nonce;stopSpeech();loading();
    try{
      const topic=(await getTopics()).find(t=>Number(t.id)===Number(topicId));if(!still(request))return;
      if(!topic)throw new Error('Không tìm thấy chuyên đề.');
      setCurrent('discover','topic',{topicId:Number(topic.id),title:topic.name});
      const groups=[...new Map(arr(topic.qs).map(q=>[text(q.sub),true])).keys()];
      const illustration=await picture(topic.illustration,'Chợ Tết truyền thống');if(!still(request))return;
      root.innerHTML=heading(topic.name,topic.desc)+`<section class="tv3-note tv3-topic-note"><strong>💡 Cùng tìm hiểu</strong><p>${x(topic.l_content||topic.desc)}</p><button class="tv3-mini" data-action="read-topic">🔊 Nghe hướng dẫn</button></section>${illustration}`+
        grid(groups.map((g,i)=>{
          const size=topic.qs.filter(q=>text(q.sub)===g).length;
          return folder(`${i+1}. ${g}`,subDescription(topic.id,g),SUB_ICONS[(i+Number(topic.id)*3)%SUB_ICONS.length],'topic-sub',`data-topic="${Number(topic.id)}" data-sub="${x(g)}"`,`${size} câu luyện tập`,i);
        }),'discover-sub');
    }catch(err){if(still(request))fail(err);}
  }
  async function openSubtopic(topicId,sub){
    const request=++nonce;loading();
    try{
      const topic=(await getTopics()).find(t=>Number(t.id)===Number(topicId));if(!still(request))return;
      const questions=arr(topic?.qs).filter(q=>text(q.sub)===sub).map(q=>normalizeQuestion(q));
      if(!questions.length)throw new Error('Nhóm câu hỏi đang trống.');
      startPractice(questions,'discover',sub,'topic',`Chuyên đề ${topicId} · ${topic?.name||''}`,{topicId:Number(topicId)});
    }catch(err){if(still(request))fail(err);}
  }

  async function lessonList(request){
    const d=await load('lessons');if(!still(request))return;
    const entries=arr(d.bai_hoc).filter(p=>Number(p.semester)===selectedSemester);
    root.innerHTML=heading('Bài học Tiếng Việt 3','62 bài đọc theo SGK Kết nối tri thức · mỗi bài 3 trang',false)+semesterTabs(selectedSemester,'lesson-sem')+
      grid(entries.map((l,i)=>folder(`Bài ${l.bai}. ${l.source_title}`,`${l.theme||'Tiếng Việt 3'} · Tuần ${l.source_week||''}`,'📖','lesson-open',`data-id="${x(l.lesson_id)}"`,'Đọc · Hiểu · Ghi nhớ',i)));
  }
  async function showLesson(id,pageNo=0){
    if(!premiumGate('Bài học'))return;
    const request=++nonce;stopSpeech();loading();
    try{
      const d=await load('lessons'),item=arr(d.bai_hoc).find(p=>text(p.lesson_id)===id);if(!still(request))return;
      if(!item)throw new Error('Không tìm thấy bài học.');
      lessonIndex=Math.min(Math.max(Number(pageNo)||0,0),Math.max(0,arr(item.pages).length-1));
      const p=item.pages[lessonIndex];setCurrent('lessons','lesson',{id,title:`Bài ${item.bai}. ${item.source_title}`});
      let body='';
      if(p.page_type==='reading'){
        const material=p.material||{};
        const image=await picture(p.image,item.source_title,true);if(!still(request))return;
        body=`<p class="tv3-lead">${x(p.intro||'Cùng luyện đọc và hiểu bài nhé!')}</p>`+image+
          `<h3 class="tv3-reading-title">${x(material.title||item.source_title)}</h3>`+
          (arr(material.paragraphs).length?`<div class="tv3-reading">${material.paragraphs.map(v=>`<p>${x(v)}</p>`).join('')}</div>`:'')+
          (arr(material.lines).length?`<div class="tv3-poem">${material.lines.map(v=>v?`<div>${x(v)}</div>`:'<div class="tv3-poem-gap"></div>').join('')}</div>`:'')+
          (arr(p.words).length?`<div class="tv3-words"><h4>📘 Từ ngữ cần hiểu</h4>${p.words.map(w=>`<p><strong>${x(w.word)}</strong> — ${x(w.meaning)}</p>`).join('')}</div>`:'');
      } else if(p.page_type==='questions'){
        body=`<p class="tv3-lead">${x(p.recall||'Hãy đọc bài và trả lời câu hỏi nhé!')}</p>`+
          arr(p.items).map((item,i)=>{
            const key=`${id}_${i}`,chosen=lessonAnswers[key];
            const chosenIndex=Number.isInteger(chosen)?chosen:-1,correct=chosenIndex===Number(item.answer);
            let extra='';
            if(item.type==='choice'){
              extra=`<div class="tv3-options">${arr(item.options).map((option,j)=>`<button class="tv3-choice ${chosenIndex===j?'chosen':''} ${chosenIndex>=0 && correct && chosenIndex===j?'right':''}" data-action="lesson-answer" data-index="${i}" data-choice="${j}"><span>${String.fromCharCode(65+j)}</span>${x(option)}</button>`).join('')}</div>`+
                (chosenIndex>=0?`<p class="${correct?'tv3-good':'tv3-warning'}">${correct?'✅ Con đã chọn đúng.':'🌱 Hãy đọc kĩ chi tiết trong bài và chọn lại nhé!'}</p>`:'');
            } else extra='<p class="tv3-answer-note">💬 Hãy nói câu trả lời thành lời, dựa vào chi tiết trong bài đọc. Con có thể nhờ người lớn nghe và góp ý.</p>';
            return `<article class="tv3-lesson-question"><strong>Câu ${i+1}. ${x(item.prompt||'')}</strong>${extra}</article>`;
          }).join('')+
          (arr(p.extra_examples).length?`<div class="tv3-note"><h4>Gợi ý cách làm</h4><ul>${p.extra_examples.map(t=>`<li>${x(t)}</li>`).join('')}</ul></div>`:'');
      } else {
        body=`<h3>🌟 Ghi nhớ điều đã học</h3><ul class="tv3-keypoints">${arr(p.key_points).map(v=>`<li>${x(v)}</li>`).join('')}</ul>`+
          (arr(p.words).length?`<div class="tv3-words"><h4>📘 Từ ngữ</h4>${p.words.map(w=>`<p><strong>${x(w.word)}</strong> — ${x(w.meaning)}</p>`).join('')}</div>`:'')+
          (arr(p.connections).length?`<h3>🌿 Liên hệ thực tế</h3><ul>${p.connections.map(v=>`<li>${x(v)}</li>`).join('')}</ul>`:'')+
          `<div class="tv3-note">${x(p.finish_prompt||'Con kể lại điều mình nhớ nhất nhé!')}</div>`;
      }
      if(!still(request))return;
      root.innerHTML=heading(`Bài ${item.bai}. ${item.source_title}`,`Trang ${lessonIndex+1}/${item.pages.length} · ${item.theme||''}`)+
        `<section class="tv3-paper"><div class="tv3-page-tabs">${arr(item.pages).map((v,j)=>`<button class="tv3-mini ${j===lessonIndex?'selected':''}" data-action="lesson-page" data-index="${j}">${x(v.title||'Trang '+(j+1))}</button>`).join('')}</div>`+
        `<div class="tv3-lesson-toolbar"><button class="tv3-mini" data-action="lesson-speak">🔊 Nghe nội dung</button><button class="tv3-mini" data-action="stop-speak">🔇 Dừng đọc</button></div>`+
        `<div class="tv3-lesson-text">${body}</div>${nav(lessonIndex,item.pages.length,'lesson')}</section>`;
    }catch(err){if(still(request))fail(err);}
  }
  function speakLesson(){
    if(current.view!=='lesson')return;
    load('lessons').then(d=>{
      if(!live||current.view!=='lesson')return;
      const item=arr(d.bai_hoc).find(p=>p.lesson_id===current.id),p=arr(item?.pages)[lessonIndex];if(!p)return;
      const m=p.material||{};
      const words=p.page_type==='reading'?[p.intro||'',m.title||'',...arr(m.paragraphs),...arr(m.lines)]:
        p.page_type==='questions'?[p.recall||'',...arr(p.items).map(v=>v.prompt)]:[...arr(p.key_points),...arr(p.connections),p.finish_prompt||''];
      void say(words.join(' '));
    }).catch(()=>toast('Chưa đọc được nội dung.'));
  }
  async function exerciseList(request){
    const key=selectedExerciseSemester===1?'exercise1':'exercise2';
    const d=await load(key);if(!still(request))return;
    let gateText='Bài 1 mở sẵn; đạt ít nhất 80% để mở bài kế tiếp.';
    if(premium()) {
      try{progress=await api('assessmentProgressGet');}catch(_){progress=null;gateText='Chưa tải được tiến độ từ máy chủ.';}
      if(!still(request))return;
    }
    const unlocked=Number(progress?.unlockedBai||1),passed=new Set(arr(progress?.passedBai).map(Number));
    root.innerHTML=heading('Bài tập Tiếng Việt 3','20 câu/lượt · kết quả chính thức và mở khóa do máy chủ quản lý',false)+
      semesterTabs(selectedExerciseSemester,'exercise-sem')+
      `<p class="tv3-note">🔐 ${x(gateText)}</p>`+
      (premium()?`<button class="tv3-mini" data-action="history" data-kind="baitap" data-sem="hk${selectedExerciseSemester}">📋 Lịch sử Bài tập HK${selectedExerciseSemester}</button>`:'')+
      grid(arr(d.bai_tap).map((item,i)=>{
        const locked=!premium()||Number(item.bai)>unlocked;
        const status=passed.has(Number(item.bai))?'✅ Đã đạt':locked?'🔒 Chưa mở':'✏️ Luyện 20 câu';
        return folder(`Bài ${item.bai}. ${item.title}`,`${item.theme} · ${arr(item.sub_names).slice(0,2).join(' · ')}`,'📝','exercise-open',`data-bai="${Number(item.bai)}" data-sem="${selectedExerciseSemester}"`,status,i,locked);
      }));
  }
  async function reviewList(request){
    const d=await load('review');if(!still(request))return;
    root.innerHTML=heading('Ôn tập Tiếng Việt 3','Ôn kiến thức đúng học kỳ · có gợi ý sau khi trả lời',false)+
      `<p class="tv3-note">Các lượt Ôn tập giúp củng cố kiến thức, không tự mở khóa Bài tập chính thức.</p>`+
      grid(arr(d.sections).map((s,i)=>folder(s.name,`${arr(s.qs).length} câu từ kho Ôn tập · thử lại để luyện thêm`,'📘','review-open',`data-review="${x(s.id)}"`,'Luyện 20 câu/lượt',i,!premium())));
  }
  async function examGroups(request){
    const d=await load('exams');if(!still(request))return;
    root.innerHTML=heading('Đề thi Tiếng Việt 3','105 đề · mỗi đề 13 câu · 40 phút · chấm điểm trên máy chủ',false)+
      `<p class="tv3-note">Sáu năng lực chỉ được đánh giá khi đủ câu phù hợp. Đề Học sinh giỏi chỉ chấm điểm.</p>`+
      grid(EXAM_GROUPS.map((g,i)=>{
        const count=arr(d.exams).filter(v=>text(v.exam_category)===g.key).length;
        return folder(g.label,g.desc,g.icon,'exam-category',`data-group="${x(g.key)}"`,`${count} đề`,i,!premium());
      }));
  }
  async function examCategory(group){
    if(!premiumGate('Đề thi'))return;
    const request=++nonce;loading();
    try{
      const d=await load('exams');if(!still(request))return;
      const listExams=arr(d.exams).filter(v=>text(v.exam_category)===group);
      setCurrent('exams','category',{group,title:group});
      const sem=group==='Học sinh giỏi'?'hsg':group.includes('1')?'hk1':'hk2';
      root.innerHTML=heading(group,`${listExams.length} đề · 40 phút / đề`)+
        `<p class="tv3-note">Trong khi làm đề, hệ thống không hiển thị gợi ý hay đáp án. Kết quả chính thức được trả về sau khi nộp.</p>`+
        `<button class="tv3-mini" data-action="history" data-kind="baithi" data-sem="${sem}">📋 Lịch sử đề thi</button>`+
        grid(listExams.map((item,i)=>folder(item.exam_name,`${item.question_count||13} câu · ${item.total_score||10} điểm`,'📄','exam-open',`data-id="${x(item.exam_id)}"`,'Bắt đầu làm đề',i)));
    }catch(err){if(still(request))fail(err);}
  }
  async function showHistory(kind,semester){
    if(!premiumGate('Lịch sử học tập'))return;
    const request=++nonce;loading();
    try{
      const data=await api('assessmentHistoryGet',{kind,semester});if(!still(request))return;
      setCurrent(kind==='baitap'?'exercises':'exams','history',{kind,semester,title:'Lịch sử học'});
      const records=arr(data.history).slice(0,100);
      root.innerHTML=heading('Lịch sử '+(kind==='baitap'?'Bài tập':'Đề thi'),semester.toUpperCase())+
        (records.length?`<div class="tv3-history">${records.map(r=>`<article><strong>${x(r.BaiId||r.DeId||'Lượt làm bài')}</strong><small>${x(r.Timestamp||'')}</small><p>${x(r.SoCauDung||0)}/${x(r.TongCauHoi||0)} câu đúng ${r.DiemSo!==undefined?'· '+x(r.DiemSo)+' điểm':''}</p></article>`).join('')}</div>`:
          '<div class="tv3-note">Chưa có kết quả chính thức nào được lưu trong học kỳ này.</div>');
    }catch(err){if(still(request))fail(err);}
  }
  function startPractice(questions,tab,title,backView,subtitle='',extra={}){
    clearView();const sorted=shuffle(arr(questions)).slice(0,20);
    if(!sorted.length){notify('Nhóm câu hỏi này chưa có dữ liệu.');return;}
    quiz={mode:'practice',tab,title,backView,questions:sorted,answers:{},index:0,judged:new Set(),...extra};
    setCurrent(tab,'quiz',{title,...extra});void showQuiz();
  }
  async function startReview(section){
    if(!premiumGate('Ôn tập'))return;
    const request=++nonce;loading();
    try{
      const d=await load('review'),item=arr(d.sections).find(s=>s.id===section);if(!still(request))return;
      if(!item)throw new Error('Không tìm thấy học liệu ôn tập.');
      startPractice(arr(item.qs).map(q=>normalizeQuestion(q)),'review',item.name,'hub','Ôn tập');
    }catch(err){if(still(request))fail(err);}
  }
  function exercisePool(entry,data){
    const valid=new Set(arr(entry.sub_names).map(text));
    const topics=new Set(arr(entry.topic_ids).map(Number));
    // Match EXACT topic + subtopic filters; never fall back to an unrelated grade/course bank.
    const result=[];const seen=new Set();
    for(const topic of arr(data?.question_bank?.topics)) {
      if(!topics.has(Number(topic.id)))continue;
      for(const raw of arr(topic.qs)){
        if(!valid.has(text(raw.sub)))continue;
        const q=normalizeQuestion(raw);if(!q.id||seen.has(q.id))continue;
        seen.add(q.id);result.push(q);
      }
    }
    return result;
  }
  async function startOfficial(kind,semester,contentId){
    if(!premiumGate(kind==='baitap'?'Bài tập':'Đề thi'))return;
    const request=++nonce;clearView();loading();
    try{
      let questions=[],title='',source=null;
      if(kind==='baitap'){
        const d=await load(semester==='hk2'?'exercise2':'exercise1');if(!still(request))return;
        source=arr(d.bai_tap).find(v=>text(v.source_exercise_id)===contentId);
        if(!source)throw new Error('Bài tập không tồn tại.');
        questions=exercisePool(source,d);title=`Bài ${source.bai}. ${source.title}`;
      } else {
        const d=await load('exams');if(!still(request))return;
        source=arr(d.exams).find(v=>text(v.exam_id)===contentId);
        if(!source)throw new Error('Đề thi không tồn tại.');
        questions=arr(source.questions).map(q=>normalizeQuestion(q,true));title=source.exam_name;
      }
      if(kind==='baitap'&&questions.length<20)throw new Error('Ngân hàng của bài chưa đủ 20 câu phù hợp.');
      // The server returns the authoritative question-ID sequence and ticket. Browser
      // answers/scores/passed flags are NEVER used as official assessment evidence.
      const ticket=await api('assessmentAttemptStart',{kind,semester,contentId});if(!still(request))return;
      const map=new Map(questions.map(q=>[q.id,q]));
      const ordered=arr(ticket.questionIds).map(id=>map.get(text(id)));
      if(!ordered.length||ordered.some(q=>!q))throw new Error('Học liệu vừa được cập nhật. Vui lòng thử lại.');
      const limit=kind==='baithi'?Math.max(60,Number(ticket.timeLimitSeconds)||2400)*1000:0;
      quiz={mode:'official',tab:kind==='baitap'?'exercises':'exams',title,kind,semester,contentId,attemptId:text(ticket.attemptId),questions:ordered,
        answers:{},index:0,deadline:limit?Date.now()+limit:0,submitting:false};
      setCurrent(quiz.tab,'quiz',{title});void showQuiz();
      if(limit)startClock();
    }catch(err){if(still(request)){fail(err);toast('Chưa bắt đầu được lượt làm bài chính thức.');}}
  }
  function startClock(){
    stopClock();examTicker=window.setInterval(()=>{
      if(!live||!quiz||quiz.mode!=='official'||!quiz.deadline){stopClock();return;}
      const remaining=Math.max(0,Math.ceil((quiz.deadline-Date.now())/1000));
      const slot=$('[data-exam-clock]');if(slot)slot.textContent=`⏱️ ${String(Math.floor(remaining/60)).padStart(2,'0')}:${String(remaining%60).padStart(2,'0')}`;
      if(!remaining){stopClock();void submitOfficial();}
    },500);
  }
  async function showQuiz(){
    if(!quiz)return;
    const qz=quiz,request=++nonce,question=qz.questions[qz.index];
    const official=qz.mode==='official',selected=qz.answers[question.id];
    let visual=await picture(question.image,'Minh họa câu hỏi');if(!still(request)||quiz!==qz)return;
    if(!visual&&question.emoji)visual=`<div class="tv3-emoji-picture" aria-hidden="true">${x(question.emoji)}</div>`;
    const explanation=!official&&selected!==undefined;
    const isRight=selected===question.answer;
    const reading=question.passage?`<div class="tv3-passage"><strong>📖 ${x(question.readingTitle||'Ngữ liệu đọc hiểu')}</strong>${question.passage.split(/\n+/).map(v=>`<p>${x(v)}</p>`).join('')}</div>`:'';
    const opts=question.options.map((option,j)=>{
      const picked=selected===option;
      const feedback=explanation&&picked?(isRight?'right':'wrong'):'';
      return `<button class="tv3-choice ${picked?'chosen':''} ${feedback}" data-action="choose" data-index="${j}" ${official&&qz.submitting?'disabled':''}><span>${String.fromCharCode(65+j)}</span>${x(option)}</button>`;
    }).join('');
    root.innerHTML=heading(qz.title,`${official?'Bài làm chính thức':'Luyện tập có hướng dẫn'} · ${qz.index+1}/${qz.questions.length} câu`)+
      `<section class="tv3-paper"><div class="tv3-quiz-top"><strong>Câu ${qz.index+1} / ${qz.questions.length}</strong>`+
      (official&&qz.deadline?'<strong class="tv3-clock" data-exam-clock></strong>':'<span>🌼 Học từng bước</span>')+`</div>`+
      `<div class="tv3-question-layout ${visual?'has-picture':''}">${visual||reading?`<div>${visual}${reading}</div>`:''}`+
      `<div class="tv3-question-side"><h3 class="tv3-question-text">${x(question.prompt)}</h3><div class="tv3-options">${opts}</div>`+
      (explanation?`<div class="${isRight?'tv3-good':'tv3-warning'}">${isRight?'✅ Chính xác!':'🌱 Chưa đúng, con thử lại nhé!'}${!isRight&&question.hint?`<div><strong>Gợi ý:</strong> ${x(question.hint)}</div>`:''}</div>`:'')+
      `${!official?'<div class="tv3-mini-actions"><button class="tv3-mini" data-action="speak-question">🔊 Nghe câu hỏi</button></div>':''}</div></div>`+
      nav(qz.index,qz.questions.length)+
      `<div class="tv3-quiz-footer"><span>Đã chọn ${Object.keys(qz.answers).length}/${qz.questions.length} câu</span><button class="tv3-submit" data-action="submit" ${qz.submitting?'disabled':''}>${qz.submitting?'⏳ Đang chấm…':official?'📤 Nộp bài':'🏆 Xem kết quả'}</button></div></section>`;
    if(qz.deadline){const remain=Math.max(0,Math.ceil((qz.deadline-Date.now())/1000));const slot=$('[data-exam-clock]');if(slot)slot.textContent=`⏱️ ${String(Math.floor(remain/60)).padStart(2,'0')}:${String(remain%60).padStart(2,'0')}`;}
  }
  function choose(index){
    if(!quiz||quiz.submitting)return;
    const item=quiz.questions[quiz.index],opt=item?.options?.[index];if(opt===undefined)return;
    const prior=quiz.answers[item.id];quiz.answers[item.id]=opt;
    if(quiz.mode==='practice'&&!quiz.judged.has(item.id)){
      quiz.judged.add(item.id);observe(item,opt===item.answer,quiz.tab);
    }
    if(prior!==opt)void showQuiz();
  }
  function endPractice(){
    if(!quiz||quiz.mode!=='practice')return;
    const q=quiz,correct=q.questions.reduce((n,item)=>n+(q.answers[item.id]===item.answer?1:0),0);
    quiz=null;stopClock();setCurrent(q.tab,'result',{title:'Kết quả luyện tập',topicId:q.topicId||0,subTitle:q.title});
    root.innerHTML=heading('Kết quả luyện tập',q.title)+`<section class="tv3-result"><div class="tv3-medal">${correct>=q.questions.length*.8?'🏆':'🌱'}</div>`+
      `<h3>${correct}/${q.questions.length} câu đúng</h3><p>Hãy tiếp tục luyện tập để hiểu bài. Kết quả này không mở khóa Bài tập chính thức.</p>`+
      `<button class="tv3-submit" data-action="hub">Quay lại chuyên mục</button></section>`;
    ctx?.hooks?.setScore?.(correct,q.questions.length-correct);
  }
  async function submitOfficial(){
    if(!quiz||quiz.mode!=='official'||quiz.submitting)return;
    const q=quiz;q.submitting=true;stopClock();void showQuiz();
    const answers=q.questions.map(item=>({id:item.id,choice:q.answers[item.id]||''}));
    try{
      const result=await api('assessmentAttemptSubmit',{kind:q.kind,semester:q.semester,attemptId:q.attemptId,answers});
      if(!live||quiz!==q)return;
      quiz=null;
      const resultViewNonce=nonce;
      if(q.kind==='baitap'){progress=null;try{progress=await api('assessmentProgressGet');}catch(_){/* next hub can retry */}}
      // A profile refresh can resolve after a learner has changed tab or subject.
      if(!still(resultViewNonce)||current.view!=='quiz'||current.tab!==q.tab)return;
      setCurrent(q.tab,'result',{title:'Kết quả chính thức'});
      const skills=Object.entries(result.competencies||{}).map(([key,s])=>`<li><strong>${x(SKILLS[key]||key)}</strong> — ${x(s.status||'Chưa đánh giá')}${s.status==='Đã đánh giá'?` · ${Number(s.percent)||0}%`:''}</li>`).join('');
      const wrong=arr(result.wrongQuestions).map(v=>`<li>${x(v.id)} · Đáp án đúng: <strong>${x(v.answer||'')}</strong>${v.hint?` · ${x(v.hint)}`:''}</li>`).join('');
      root.innerHTML=heading('Kết quả chính thức',q.title)+`<section class="tv3-result"><div class="tv3-medal">${result.passed?'🏆':'🌱'}</div>`+
        `<h3>${Number(result.correct)||0}/${Number(result.totalQuestions)||0} câu đúng · ${Number(result.percent)||0}%`+
        (q.kind==='baithi'?` · ${Number(result.score)||0}/${Number(result.maxScore)||0} điểm`:'')+`</h3>`+
        `<p>${x(result.message||'Bé đã hoàn thành lượt làm bài.')}</p>`+
        (skills?`<h4>📊 Đánh giá năng lực</h4><ul>${skills}</ul>`:'')+
        (wrong?`<h4>📖 Những câu cần xem lại</h4><ul>${wrong}</ul>`:'')+
        `<button class="tv3-submit" data-action="hub">Quay lại danh sách</button></section>`;
      ctx?.hooks?.setScore?.(Number(result.correct)||0,(Number(result.totalQuestions)||0)-(Number(result.correct)||0));
    }catch(_){
      if(!live||quiz!==q)return;
      q.submitting=false;toast('Chưa lưu được kết quả trên máy chủ. Hãy bấm Nộp bài lại, không cần làm lại câu hỏi.');
      void showQuiz(); // Keep same server ticket for safe/idempotent retries.
    }
  }

  async function storyHome(){
    const request=++nonce;clearView();loading();
    try{
      const data=await load('stories');if(!still(request))return;
      setCurrent('discover','stories-home',{title:'Truyện dân gian & cổ tích'});
      root.innerHTML=heading('Truyện dân gian & cổ tích','240 truyện kể · có đọc/nghe truyện và 3 câu đọc hiểu')+
        grid([folder('Truyện dân gian Việt Nam',`${arr(data.vietnam?.stories).length} truyện · truyền thuyết, cổ tích, Trạng Quỳnh`,'🇻🇳','story-region','data-region="vietnam"','Khám phá truyện Việt Nam',0),
          folder('Truyện cổ tích thế giới',`${arr(data.world?.stories).length} truyện · Grimm, Andersen, ngụ ngôn`,'🌍','story-region','data-region="world"','Khám phá truyện thế giới',1)]);
    }catch(err){if(still(request))fail(err);}
  }
  async function storyRegion(region){
    if(!['vietnam','world'].includes(region))return;
    const request=++nonce;stopSpeech();loading();
    try{
      const data=await load('stories');if(!still(request))return;
      storySection=region;const section=data[region];storyRegionLabel=text(section?.meta?.title||(region==='vietnam'?'Truyện dân gian Việt Nam':'Truyện cổ tích thế giới'));
      setCurrent('discover','stories-region',{region,title:section?.meta?.title||'Thư viện truyện'});
      root.innerHTML=heading(section?.meta?.title||'Truyện cổ tích',`${arr(section?.stories).length} truyện · Chọn nhóm truyện`)+
        grid(arr(section?.categories).map((g,i)=>folder(g.name,g.description||'',i%2?'📜':'📚','story-category',`data-category="${x(g.id)}"`,`${g.story_count||arr(g.story_ids).length} truyện`,i)));
    }catch(err){if(still(request))fail(err);}
  }
  async function storyCategoryView(category){
    const request=++nonce;stopSpeech();loading();
    try{
      const d=await load('stories'),section=d[storySection];if(!still(request))return;
      const c=arr(section?.categories).find(g=>g.id===category);
      if(!c)throw new Error('Không tìm thấy nhóm truyện.');
      storyCategory=category;storyCategoryLabel=text(c.name);
      const stories=arr(section?.stories).filter(s=>s.category_id===category);
      setCurrent('discover','stories-category',{title:c.name,region:storySection,category});
      root.innerHTML=heading(c.name,`${stories.length} truyện · bấm để nghe hoặc đọc`)+
        grid(stories.map((story,i)=>folder(story.title,story.theme||'',i%3?'📖':'📜','story-open',`data-story="${x(story.id)}"`,'Đọc và nghe truyện',i)));
    }catch(err){if(still(request))fail(err);}
  }
  async function showStory(id){
    const request=++nonce;stopSpeech();loading();
    try{
      const d=await load('stories'),section=d[storySection];if(!still(request))return;
      const story=arr(section?.stories).find(s=>s.id===id);if(!story)throw new Error('Không tìm thấy truyện.');
      activeStory=story;
      setCurrent('discover','story',{title:story.title});
      const illustration=await picture(story.image,story.title,true);if(!still(request))return;
      const paras=text(story.content).split(/\n+/).filter(Boolean);
      root.innerHTML=heading(story.title,`${story.country||''} · ${story.theme||''}`)+
        `<section class="tv3-paper"><div class="tv3-story-tools"><button class="tv3-mini" data-action="story-listen">🔊 Nghe kể chuyện</button><button class="tv3-mini" data-action="stop-speak">🔇 Dừng đọc</button></div>`+
        (illustration||`<div class="tv3-story-emoji" aria-hidden="true">${storySection==='vietnam'?'🌸📜':'🌍📚'}</div>`)+
        `<div class="tv3-story-text">${paras.map(t=>`<p>${x(t)}</p>`).join('')}</div>`+
        `<div class="tv3-story-questions"><h3>🎯 Ba câu hỏi đọc hiểu</h3>${arr(story.questions).map((q,i)=>{
          const chosen=storyAnswers[`${storySection}|${story.id}`]?.[i];
          return `<article><strong>Câu ${i+1}. ${x(q.q)}</strong><div class="tv3-options">${arr(q.o).map((o,j)=>{
            const selected=chosen===j,correct=selected&&o===q.a;
            return `<button class="tv3-choice ${selected?(correct?'right':'wrong'):''}" data-action="story-answer" data-question="${i}" data-choice="${j}"><span>${String.fromCharCode(65+j)}</span>${x(o)}</button>`;
          }).join('')}</div>${chosen!==undefined?`<p class="${q.o[chosen]===q.a?'tv3-good':'tv3-warning'}">${q.o[chosen]===q.a?'✅ Chính xác!':'🌱 Con đọc lại đoạn liên quan và thử nhé!'}</p>`:''}</article>`;
        }).join('')}</div></section>`;
    }catch(err){if(still(request))fail(err);}
  }
  async function openGame(gameIndex=0){
    if(!premiumGate('Mini games'))return;
    const request=++nonce;clearView();loading();
    try{
      let t=null;if(gameIndex===0){t=(await getTopics()).find(v=>Number(v.id)===1);if(!still(request))return;if(!t)throw new Error('Chưa tìm thấy kho Hiệp sĩ Chính tả.');}
      const gameFiles=['hiep-si-chinh-ta','kho-bau-am-van','khu-vuon-tu-loai','doan-tau-ghep-cau','bac-si-dau-cau','phep-thuat-tu-tu','cau-ca-tu-vung','tham-tu-doc-hieu','dau-truong-cau-do','dai-su-giao-tiep','me-cung-tu-ngu','co-ong-ra-lenh'];
      const name=gameFiles[gameIndex];if(!name)throw new Error('Không tìm thấy game.');
      if(!window.CLASS3_TV3_GAMES?.[gameIndex===0?'spellingKnight':name]){
        const gamePromise=new Promise((resolve,reject)=>{
          const script=document.createElement('script');script.async=true;
          script.src='assets/js/vietnamese/games/'+name+'.js?v=class3-tv-20261019-3';
          script.onload=()=>window.CLASS3_TV3_GAMES?.[gameIndex===0?'spellingKnight':name]?resolve(window.CLASS3_TV3_GAMES[gameIndex===0?'spellingKnight':name]):reject(new Error('Chưa đăng ký được mini game.'));
          script.onerror=()=>reject(new Error('Không tải được trò chơi.'));
          document.head.appendChild(script);
        });
        await gamePromise;
      }
      if(!still(request))return;
      const game=window.CLASS3_TV3_GAMES[gameIndex===0?'spellingKnight':name];
      setCurrent('games','game',{title:GAMES[gameIndex][0]});
      root.innerHTML=heading(GAMES[gameIndex][0],GAMES[gameIndex][2])+'<div class="tv3-game-stage" data-game-stage></div>';
      gameInstance=game.mount({host:$('[data-game-stage]'),questions:arr(t?.qs),speak:say,stopAudio:stopSpeech,onQuit:()=>{stopGame();void hub('games');}});
    }catch(err){if(still(request))fail(err);}
  }
  function back(){
    if(!current||current.view==='hub')return;
    const {tab,view,topicId,region,category,group}=current;
    stopSpeech();stopClock();
    if(view==='quiz'){
      if(quiz?.backView==='topic'&&quiz?.topicId){void showTopic(quiz.topicId);return;}
      void hub(tab);return;
    }
    if(view==='result'&&tab==='discover'&&topicId){void showTopic(topicId);return;}
    if(view==='lesson'||view==='result'||view==='history'||view==='category'||view==='game'){void hub(tab);return;}
    if(view==='topic'||view==='stories-home'){void hub('discover');return;}
    if(view==='story'){void storyCategoryView(storyCategory);return;}
    if(view==='stories-category'){void storyRegion(storySection);return;}
    if(view==='stories-region'){void storyHome();return;}
    if(view==='quiz-story'){void storyCategoryView(storyCategory);return;}
    if(view==='topic-sub'){void showTopic(topicId);return;}
    void hub(tab);
  }
  async function handleClick(event){
    const button=event.target?.closest?.('button[data-action]');
    if(!button||!root||!root.contains(button)||button.disabled)return;
    const action=button.dataset.action,sem=Number(button.dataset.sem||1);
    switch(action){
      case 'hub':if(current.view==='result'&&current.tab==='discover'&&current.topicId)await showTopic(current.topicId);else await hub(current.tab);break;
      case 'back':back();break;
      case 'topic':await showTopic(Number(button.dataset.topic));break;
      case 'topic-sub':await openSubtopic(Number(button.dataset.topic),text(button.dataset.sub));break;
      case 'read-topic':{
        const requestNonce=nonce, topicId=current.topicId;
        const t=(await getTopics()).find(v=>Number(v.id)===Number(topicId));
        if(still(requestNonce)&&current.view==='topic'&&t)void say(t.l_audio||t.l_content);break;
      }
      case 'lesson-sem':selectedSemester=sem;await hub('lessons');break;
      case 'exercise-sem':selectedExerciseSemester=sem;progress=null;await hub('exercises');break;
      case 'lesson-open':await showLesson(text(button.dataset.id),0);break;
      case 'lesson-page':if(current.view==='lesson')await showLesson(current.id,Number(button.dataset.index));break;
      case 'lesson-prev':if(current.view==='lesson')await showLesson(current.id,lessonIndex-1);break;
      case 'lesson-next':if(current.view==='lesson')await showLesson(current.id,lessonIndex+1);break;
      case 'lesson-speak':speakLesson();break;
      case 'stop-speak':stopSpeech();break;
      case 'lesson-answer':{
        if(current.view!=='lesson')break;
        lessonAnswers[`${current.id}_${button.dataset.index}`]=Number(button.dataset.choice);
        await showLesson(current.id,lessonIndex);break;
      }
      case 'exercise-open':{
        const bai=Number(button.dataset.bai);const eId=`TV3_BT${String(bai).padStart(2,'0')}`;
        await startOfficial('baitap',currentSemester(button.dataset.sem),eId);break;
      }
      case 'review-open':await startReview(text(button.dataset.review));break;
      case 'exam-category':await examCategory(text(button.dataset.group));break;
      case 'exam-open':{
        const id=text(button.dataset.id),d=await load('exams'),entry=arr(d.exams).find(q=>text(q.exam_id)===id);
        if(!entry)break;
        const semester=text(entry.semester)==='full'?'hsg':currentSemester(entry.semester);
        await startOfficial('baithi',semester,id);break;
      }
      case 'history':await showHistory(text(button.dataset.kind),text(button.dataset.sem));break;
      case 'choose':choose(Number(button.dataset.index));break;
      case 'question-prev':if(quiz&&quiz.index>0){quiz.index--;void showQuiz();}break;
      case 'question-next':if(quiz&&quiz.index<quiz.questions.length-1){quiz.index++;void showQuiz();}break;
      case 'speak-question':if(quiz)void say(quiz.questions[quiz.index].prompt);break;
      case 'submit':if(quiz?.mode==='official')await submitOfficial();else endPractice();break;
      case 'story-home':await storyHome();break;
      case 'story-region':await storyRegion(text(button.dataset.region));break;
      case 'story-category':await storyCategoryView(text(button.dataset.category));break;
      case 'story-open':await showStory(text(button.dataset.story));break;
      case 'story-listen':if(activeStory)void say(activeStory.content);break;
      case 'story-answer':{
        if(!activeStory)break;
        const storyKey=`${storySection}|${activeStory.id}`;
        if(!storyAnswers[storyKey])storyAnswers[storyKey]={};
        storyAnswers[storyKey][Number(button.dataset.question)]=Number(button.dataset.choice);
        await showStory(activeStory.id);break;
      }
      case 'game-open':await openGame(Number(button.dataset.game||0));break;
      case 'game-pending':toast('Game này chưa có source riêng của Tiếng Việt 3.');break;
      default:break;
    }
  }
  function applyStyle(){
    if(document.getElementById('class3-vietnamese-module-style'))return;
    const s=document.createElement('style');s.id='class3-vietnamese-module-style';s.textContent=STYLES;document.head.appendChild(s);
  }
  function destroy(){
    live=false;nonce++;stopClock();stopSpeech();stopGame();
    if(learningQueue.length)void flushLearning();
    try{if(root&&clickHandler)root.removeEventListener('click',clickHandler);}catch(_){}
    try{root?.remove();}catch(_){}
    root=null;ctx?.hooks?.clearDetail?.();ctx=null;quiz=null;progress=null;
    activeStory=null;storyAnswers={};lessonAnswers={};learningQueue=[];
  }
  async function render(nextCtx){
    const next=nextCtx||{};const oldUser=ctx?.user?.userId||'',newUser=next.user?.userId||'';
    if(root&&(root.parentElement!==next.host||!root.isConnected))destroy();
    if(oldUser!==newUser){progress=null;learningQueue=[];activeStory=null;storyAnswers={};lessonAnswers={};}
    ctx=next;live=true;applyStyle();
    if(!root){root=document.createElement('section');root.id=ROOT_ID;root.setAttribute('aria-label','Tiếng Việt 3');ctx.host.replaceChildren(root);
      clickHandler=(event)=>{void handleClick(event).catch(err=>{console.error('[Class3 TV3 action]',err);notify('Chưa thực hiện được thao tác này. Bé thử lại nhé!');});};
      root.addEventListener('click',clickHandler);
    }
    const tab=Object.prototype.hasOwnProperty.call(TAB_NAMES,next.tabId)?next.tabId:'discover';
    await hub(tab);
  }
  window.CLASS3_SUBJECT_MODULES=window.CLASS3_SUBJECT_MODULES||{};
  window.CLASS3_SUBJECT_MODULES.vietnamese=Object.freeze({render,destroy});

  const STYLES = `
#class3-vietnamese-runtime{max-width:82rem;margin:0 auto;color:#344054;font-family:"Nunito","Segoe UI",Arial,sans-serif}
#class3-vietnamese-runtime *{box-sizing:border-box}
#class3-vietnamese-runtime button{font:inherit;cursor:pointer}
#class3-vietnamese-runtime button:disabled{opacity:.5;cursor:not-allowed}
#class3-vietnamese-runtime h2,#class3-vietnamese-runtime h3,#class3-vietnamese-runtime h4{color:#612063;line-height:1.25}
#class3-vietnamese-runtime p,#class3-vietnamese-runtime li{line-height:1.6}
#class3-vietnamese-runtime .tv3-heading{display:flex;justify-content:space-between;align-items:flex-start;gap:14px;margin:4px 0 15px}
#class3-vietnamese-runtime .tv3-heading h2{font-size:clamp(22px,2.4vw,29px);font-weight:950;margin:0}
#class3-vietnamese-runtime .tv3-heading p{font-size:16px;color:#667085;margin:5px 0 0;font-weight:750}
#class3-vietnamese-runtime .tv3-back,#class3-vietnamese-runtime .tv3-submit{border:0;border-radius:14px;background:linear-gradient(105deg,#ec4899,#8b5cf6);color:#fff;font-weight:950;padding:10px 16px;min-height:44px;box-shadow:0 5px 12px rgba(139,92,246,.15)}
#class3-vietnamese-runtime .tv3-back{white-space:nowrap}
#class3-vietnamese-runtime .tv3-folder-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(275px,1fr));gap:11px}
#class3-vietnamese-runtime .tv3-folder{--color:#7c3aed;--bg:#f5f3ff;--br:#c4b5fd;--icon-bg:#ede9fe;width:100%;min-width:0;min-height:132px;padding:13px 14px;border:1.5px solid var(--br);border-radius:18px;background:var(--bg);box-shadow:0 3px 9px rgba(76,29,149,.065);color:#344054;text-align:left;display:flex;flex-direction:column;justify-content:space-between;gap:11px;transition:border-color .17s ease,box-shadow .17s ease,filter .17s ease}
#class3-vietnamese-runtime .tv3-folder[data-tone="0"]{--color:#be185d;--bg:#fff1f7;--br:#f9a8d4;--icon-bg:#fce7f3}
#class3-vietnamese-runtime .tv3-folder[data-tone="1"]{--color:#047857;--bg:#ecfdf5;--br:#86efac;--icon-bg:#d1fae5}
#class3-vietnamese-runtime .tv3-folder[data-tone="2"]{--color:#6d28d9;--bg:#f5f3ff;--br:#c4b5fd;--icon-bg:#ede9fe}
#class3-vietnamese-runtime .tv3-folder[data-tone="3"]{--color:#b45309;--bg:#fffbeb;--br:#fcd34d;--icon-bg:#fef3c7}
#class3-vietnamese-runtime .tv3-folder[data-tone="4"]{--color:#0369a1;--bg:#eff8ff;--br:#7dd3fc;--icon-bg:#e0f2fe}
#class3-vietnamese-runtime .tv3-folder[data-tone="5"]{--color:#be123c;--bg:#fff1f2;--br:#fda4af;--icon-bg:#ffe4e6}
#class3-vietnamese-runtime .tv3-folder:hover,#class3-vietnamese-runtime .tv3-folder:focus-visible{translate:0 0!important;border-color:var(--color);box-shadow:0 0 0 2px color-mix(in srgb,var(--color) 13%,transparent),0 7px 16px rgba(109,40,217,.1);filter:brightness(1.012);transform:none}
#class3-vietnamese-runtime .tv3-folder-head{display:flex;align-items:flex-start;gap:12px}
#class3-vietnamese-runtime .tv3-icon{width:60px;height:60px;flex:0 0 60px;display:flex;align-items:center;justify-content:center;border-radius:17px;background:var(--icon-bg);border:2px solid var(--br);font-size:36px;line-height:1;box-shadow:0 3px 9px rgba(109,40,217,.1),inset 0 1px 2px #fff;transition:transform .17s ease,box-shadow .17s ease}
#class3-vietnamese-runtime .tv3-folder:is(:hover,:focus-visible) .tv3-icon{transform:scale(1.1);box-shadow:0 5px 12px rgba(109,40,217,.18),inset 0 1px 2px #fff}
#class3-vietnamese-runtime .tv3-folder-copy{flex:1;min-width:0}
#class3-vietnamese-runtime .tv3-folder-copy strong{display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;overflow:hidden;color:var(--color);font-size:18px;font-weight:950;line-height:1.25}
#class3-vietnamese-runtime .tv3-folder-copy small{display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;overflow:hidden;color:#475467;font-size:15px;line-height:1.38;margin-top:6px;font-weight:750}
#class3-vietnamese-runtime .tv3-folder-foot{display:flex;justify-content:space-between;align-items:center;gap:5px;border-top:1px solid rgba(124,58,237,.11);padding-top:7px;font-size:14px;font-weight:900;color:var(--color)}
/* Explore: 12 topic cards in four columns; inner groups in three. */
#class3-vietnamese-runtime .tv3-folder-grid.tv3-discover-home{grid-template-columns:repeat(4,minmax(0,1fr))}
#class3-vietnamese-runtime .tv3-folder-grid.tv3-discover-sub{grid-template-columns:repeat(3,minmax(0,1fr))}
#class3-vietnamese-runtime .tv3-folder-grid:is(.tv3-discover-home,.tv3-discover-sub) .tv3-folder{min-height:174px;gap:10px}
#class3-vietnamese-runtime .tv3-folder-grid:is(.tv3-discover-home,.tv3-discover-sub) .tv3-folder-head{display:flex;flex-direction:row;align-items:flex-start;gap:10px}
#class3-vietnamese-runtime .tv3-folder-grid:is(.tv3-discover-home,.tv3-discover-sub) .tv3-folder-copy strong{display:block;overflow:visible;line-height:1.27;font-size:17px;overflow-wrap:break-word}
#class3-vietnamese-runtime .tv3-folder-grid:is(.tv3-discover-home,.tv3-discover-sub) .tv3-folder-copy small{display:block;overflow:visible;font-size:14px;line-height:1.4;margin-top:7px}
#class3-vietnamese-runtime .tv3-folder-grid:is(.tv3-discover-home,.tv3-discover-sub) .tv3-icon{width:53px;height:53px;flex:0 0 53px;font-size:31px}
@media(min-width:768px) and (max-width:1080px){#class3-vietnamese-runtime .tv3-folder-grid.tv3-discover-home{grid-template-columns:repeat(3,minmax(0,1fr))}}
@media(min-width:768px) and (max-width:820px){#class3-vietnamese-runtime .tv3-folder-grid.tv3-discover-sub{grid-template-columns:repeat(2,minmax(0,1fr))}}
#class3-vietnamese-runtime .tv3-locked{background:#f8fafc!important;border-color:#cbd5e1!important;opacity:.82}
#class3-vietnamese-runtime .tv3-locked .tv3-icon{filter:grayscale(.35)}
#class3-vietnamese-runtime .tv3-switch,#class3-vietnamese-runtime .tv3-page-tabs,#class3-vietnamese-runtime .tv3-story-tools{display:flex;flex-wrap:wrap;gap:12px;margin:12px 0 16px}
#class3-vietnamese-runtime .tv3-switch button,#class3-vietnamese-runtime .tv3-mini{min-height:39px;padding:8px 14px;border-radius:12px;border:1.5px solid #c4b5fd;background:#faf5ff;color:#6d28d9;font-size:17px;font-weight:950}
#class3-vietnamese-runtime .tv3-switch button.on,#class3-vietnamese-runtime .tv3-mini.selected{background:linear-gradient(105deg,#ec4899,#8b5cf6);color:#fff;border-color:#8b5cf6;box-shadow:0 4px 10px rgba(139,92,246,.15)}
#class3-vietnamese-runtime .tv3-paper,#class3-vietnamese-runtime .tv3-result{padding:clamp(14px,2vw,24px);border:1px solid #e9d5ff;border-radius:21px;background:#fff;box-shadow:0 4px 15px rgba(76,29,149,.055)}
#class3-vietnamese-runtime .tv3-note,#class3-vietnamese-runtime .tv3-words{background:#fffbeb;color:#92400e;padding:12px 15px;border:1px solid #fcd34d;border-radius:14px;margin:12px 0;font-size:16px;font-weight:800}
#class3-vietnamese-runtime .tv3-topic-note p{margin:5px 0 9px}
#class3-vietnamese-runtime .tv3-lead{font-size:19px;font-weight:850;color:#475467}
#class3-vietnamese-runtime .tv3-reading-title{text-align:center;font-size:25px;margin:20px 0}
#class3-vietnamese-runtime .tv3-reading p,#class3-vietnamese-runtime .tv3-story-text p{font-size:19px;line-height:1.95;margin:0 0 16px;text-align:justify}
#class3-vietnamese-runtime .tv3-poem{margin:15px auto;max-width:580px;white-space:pre-wrap;font-size:19px;line-height:1.9;font-weight:750;color:#475467}
#class3-vietnamese-runtime .tv3-poem-gap{height:17px}
#class3-vietnamese-runtime .tv3-lesson-text{line-height:1.8}
#class3-vietnamese-runtime .tv3-lesson-text li{margin:9px 0;font-size:18px}
#class3-vietnamese-runtime .tv3-lesson-toolbar{display:flex;justify-content:flex-end;flex-wrap:wrap;gap:9px}
#class3-vietnamese-runtime .tv3-lesson-question,#class3-vietnamese-runtime .tv3-story-questions article{padding:17px;margin:12px 0;border:1px solid #ddd6fe;background:#faf5ff;border-radius:16px}
#class3-vietnamese-runtime .tv3-lesson-question strong,#class3-vietnamese-runtime .tv3-story-questions strong{font-size:18px}
#class3-vietnamese-runtime .tv3-answer-note{color:#7c3aed;font-size:16px;font-weight:750}
#class3-vietnamese-runtime .tv3-quiz-top,#class3-vietnamese-runtime .tv3-quiz-footer{display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;color:#7c3aed;font-size:16px;font-weight:950}
#class3-vietnamese-runtime .tv3-quiz-footer{border-top:1px solid #f3e8ff;padding-top:13px}
#class3-vietnamese-runtime .tv3-question-layout.has-picture{display:grid;grid-template-columns:minmax(220px,.88fr) minmax(0,1.12fr);gap:18px;align-items:start}
#class3-vietnamese-runtime .tv3-question-layout .tv3-passage{max-height:420px;overflow-y:auto;padding:15px;border:1px solid #e9d5ff;border-radius:15px;background:#faf5ff}
#class3-vietnamese-runtime .tv3-passage p{font-size:16px}
#class3-vietnamese-runtime .tv3-question-text{font-size:clamp(20px,2.2vw,26px);font-weight:950;text-align:center;line-height:1.45;margin:18px 0;color:#5b216e}
#class3-vietnamese-runtime .tv3-options{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin:15px 0}
#class3-vietnamese-runtime .tv3-choice{min-height:61px;text-align:left;display:flex;gap:12px;align-items:center;padding:12px 13px;border:1.5px solid #c4b5fd;border-radius:15px;background:#f5f3ff;color:#344054;font-size:17px;font-weight:850;transition:border-color .17s ease,box-shadow .17s ease,filter .17s ease}
#class3-vietnamese-runtime .tv3-choice:nth-child(4n+1){background:#fff1f7;border-color:#f9a8d4}
#class3-vietnamese-runtime .tv3-choice:nth-child(4n+2){background:#ecfdf5;border-color:#86efac}
#class3-vietnamese-runtime .tv3-choice:nth-child(4n+3){background:#f5f3ff;border-color:#c4b5fd}
#class3-vietnamese-runtime .tv3-choice:nth-child(4n+4){background:#eff8ff;border-color:#93c5fd}
#class3-vietnamese-runtime .tv3-choice span{width:30px;height:30px;flex:0 0 30px;display:flex;align-items:center;justify-content:center;border-radius:9px;background:#fff;color:#7c3aed;font-size:16px;font-weight:950}
#class3-vietnamese-runtime .tv3-choice:hover,#class3-vietnamese-runtime .tv3-choice.chosen{border-color:#8b5cf6;box-shadow:0 0 0 2px rgba(139,92,246,.13);filter:brightness(1.01)}
#class3-vietnamese-runtime .tv3-choice.right{border-color:#10b981!important;background:#dcfce7!important;color:#047857}
#class3-vietnamese-runtime .tv3-choice.wrong{border-color:#fb7185!important;background:#fff1f2!important;color:#be123c}
#class3-vietnamese-runtime .tv3-nav{display:grid;grid-template-columns:minmax(0,1fr) 90px minmax(0,1fr);gap:10px;margin:20px 0}
#class3-vietnamese-runtime .tv3-nav button,#class3-vietnamese-runtime .tv3-nav span{min-height:46px;padding:9px 12px;display:flex;align-items:center;justify-content:center;border:1.5px solid #ddd6fe;border-radius:13px;background:#faf5ff;color:#6d28d9;font-size:16px;font-weight:950;text-align:center}
#class3-vietnamese-runtime .tv3-nav button.primary{background:linear-gradient(105deg,#ec4899,#8b5cf6);border-color:transparent;color:#fff}
#class3-vietnamese-runtime .tv3-nav span{background:#fff}
#class3-vietnamese-runtime .tv3-good,#class3-vietnamese-runtime .tv3-warning{padding:10px 13px;border-radius:13px;font-size:16px;line-height:1.5;font-weight:850}
#class3-vietnamese-runtime .tv3-good{background:#ecfdf5;color:#047857;border:1px solid #86efac}
#class3-vietnamese-runtime .tv3-warning{background:#fff1f2;color:#be123c;border:1px solid #fda4af}
#class3-vietnamese-runtime .tv3-mini-actions{margin-top:10px}
#class3-vietnamese-runtime .tv3-picture{margin:12px auto;max-width:580px;text-align:center}
#class3-vietnamese-runtime .tv3-picture img{display:block;max-width:100%;width:100%;max-height:380px;object-fit:contain;margin:0 auto;border:1px solid #e9d5ff;border-radius:17px}
#class3-vietnamese-runtime .tv3-picture figcaption{font-size:14px;color:#667085;margin:5px 0}
#class3-vietnamese-runtime .tv3-story-emoji{text-align:center;font-size:64px;margin:10px 0}
#class3-vietnamese-runtime .tv3-emoji-picture{text-align:center;font-size:65px}
#class3-vietnamese-runtime .tv3-result{text-align:center;max-width:860px;margin:0 auto}
#class3-vietnamese-runtime .tv3-result h3{font-size:25px}
#class3-vietnamese-runtime .tv3-result ul{text-align:left;line-height:1.8}
#class3-vietnamese-runtime .tv3-medal{font-size:65px}
#class3-vietnamese-runtime .tv3-history{display:grid;gap:9px;margin:12px 0}
#class3-vietnamese-runtime .tv3-history article{padding:12px 15px;border:1px solid #ddd6fe;border-radius:15px;background:#fff}
#class3-vietnamese-runtime .tv3-history article small{margin-left:10px;color:#667085}
#class3-vietnamese-runtime .tv3-history article p{margin:5px 0 0}
#class3-vietnamese-runtime .tv3-clock{color:#be185d}
#class3-vietnamese-runtime .tv3-loading,#class3-vietnamese-runtime .tv3-empty{min-height:220px;padding:25px;display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:12px;background:#fff;border:1px dashed #c4b5fd;border-radius:20px;color:#7c3aed;font-size:18px;font-weight:850;text-align:center}
#class3-vietnamese-runtime .tv3-empty{flex-direction:column}
#class3-vietnamese-runtime .tv3-spinner{width:24px;height:24px;border-radius:50%;border:3px solid #ddd6fe;border-top-color:#8b5cf6;animation:tv3spin .8s linear infinite}
@keyframes tv3spin{to{transform:rotate(360deg)}}
@media(max-width:767px){
 #class3-vietnamese-runtime .tv3-folder-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}
 #class3-vietnamese-runtime .tv3-folder-grid.tv3-discover-home{grid-template-columns:repeat(2,minmax(0,1fr))}
 #class3-vietnamese-runtime .tv3-folder-grid.tv3-discover-sub{grid-template-columns:1fr}
 #class3-vietnamese-runtime .tv3-folder-grid:is(.tv3-discover-home,.tv3-discover-sub) .tv3-folder{min-height:155px}
 #class3-vietnamese-runtime .tv3-folder-grid:is(.tv3-discover-home,.tv3-discover-sub) .tv3-folder-head{flex-direction:row;gap:8px}
 #class3-vietnamese-runtime .tv3-folder-grid:is(.tv3-discover-home,.tv3-discover-sub) .tv3-icon{width:44px;height:44px;flex:0 0 44px;font-size:25px}
 #class3-vietnamese-runtime .tv3-folder-grid:is(.tv3-discover-home,.tv3-discover-sub) .tv3-folder-copy strong{font-size:16px}
 #class3-vietnamese-runtime .tv3-folder-grid:is(.tv3-discover-home,.tv3-discover-sub) .tv3-folder-copy small{font-size:13px}
 #class3-vietnamese-runtime .tv3-folder{padding:10px;min-height:148px;border-radius:16px}
 #class3-vietnamese-runtime .tv3-folder-head{flex-direction:column;gap:7px}
 #class3-vietnamese-runtime .tv3-icon{width:52px;height:52px;flex:0 0 52px;font-size:31px}
 #class3-vietnamese-runtime .tv3-folder-copy strong{font-size:16px}
 #class3-vietnamese-runtime .tv3-folder-copy small{font-size:13px}
 #class3-vietnamese-runtime .tv3-heading{flex-direction:column}
 #class3-vietnamese-runtime .tv3-question-layout.has-picture{grid-template-columns:1fr;gap:8px}
 #class3-vietnamese-runtime .tv3-options{grid-template-columns:1fr}
 #class3-vietnamese-runtime .tv3-choice{min-height:56px;font-size:16px}
 #class3-vietnamese-runtime .tv3-nav{grid-template-columns:minmax(0,1fr) 68px minmax(0,1fr);gap:5px}
 #class3-vietnamese-runtime .tv3-nav button,#class3-vietnamese-runtime .tv3-nav span{font-size:13px;padding:7px 5px}
 #class3-vietnamese-runtime .tv3-reading p,#class3-vietnamese-runtime .tv3-story-text p{font-size:17px}
}
@media(prefers-reduced-motion:reduce){#class3-vietnamese-runtime *{transition:none!important;animation:none!important}#class3-vietnamese-runtime .tv3-folder:hover .tv3-icon{transform:none!important}}
`;
})();
