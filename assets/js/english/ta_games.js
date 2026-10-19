/* Epsilon Edu | Class 3 English Mini Games Engine v20261019. */
(() => {
  'use strict';
  if (window.CLASS3_ENGLISH_MINIGAMES?.version === '20261019.2') return;
  const KEYS = Object.freeze([
    'word-search','bingo','word-scramble','fishing-game',
    'sentence-train','qa-bridge','sentence-doctor','grammar-river',
    'action-race','a-or-an-factory','feeling-detective','teacher-says'
  ]);
  const META = Object.freeze({
    'word-search':['Word Search','\u0054\u00ec\u006d \u0074\u1eeb \u0074\u0072\u006f\u006e\u0067 \u0062\u1ea3\u006e\u0067 \u0063\u0068\u1eef','vocab'],
    'bingo':['Bingo','\u004e\u0067\u0068\u0065 \u0076\u00e0 \u0111\u00e1\u006e\u0068 \u0064\u1ea5\u0075 \u0074\u1eeb','vocab'],
    'word-scramble':['Word Scramble','\u0058\u1ebf\u0070 \u0063\u0068\u1eef \u0074\u0068\u00e0\u006e\u0068 \u0074\u1eeb','vocab'],
    'fishing-game':['Fishing Game','\u0043\u00e2\u0075 \u0074\u1eeb \u0074\u0068\u0065\u006f \u006e\u0067\u0068\u0129\u0061','vocab'],
    'sentence-train':['Sentence Train','Ghép cả câu theo nghĩa tiếng Việt','grammar'],
    'qa-bridge':['Q&A Bridge','Ghép câu hỏi với câu trả lời đúng','grammar'],
    'sentence-doctor':['Sentence Doctor','Bắt bệnh và chữa một lỗi thật trong câu','grammar'],
    'grammar-river':['Grammar River','Vượt nhiều hòn đá kiến thức để sang sông','grammar'],
    'action-race':['Action Race','Nhận biết hành động, dùng đúng động từ','grammar'],
    'a-or-an-factory':['Sentence Factory','Tạo câu a/an/some + there is/are','vocab'],
    'feeling-detective':['Feeling Detective','Đọc tình huống, diễn đạt cảm xúc thành câu','vocab'],
    'teacher-says':['Teacher Says','Nghe hiệu lệnh, chọn hành động hoặc đứng yên','grammar']
  });
  const LEVELS = Object.freeze({
    'word-search':[[5,8,0],[7,10,0],[9,12,0]],
    'bingo':[[9,3,1],[16,4,2],[25,5,3]],
    'word-scramble':[[8,0,0],[10,0,0],[12,0,0]],
    'fishing-game':[[8,0,0],[10,0,0],[12,0,0]],
    'sentence-train':[[8,0,0],[10,0,0],[12,0,0]],
    'qa-bridge':[[8,0,0],[10,0,0],[12,0,0]],
    'sentence-doctor':[[8,0,0],[10,0,0],[12,0,0]],
    'grammar-river':[[8,0,0],[10,0,0],[12,0,0]],
    'action-race':[[8,0,0],[10,0,0],[12,0,0]],
    'a-or-an-factory':[[8,0,0],[10,0,0],[12,0,0]],
    'feeling-detective':[[6,0,0],[8,0,0],[10,0,0]],
    'teacher-says':[[8,0,0],[10,0,0],[12,0,0]]
  });
  const V='?v=class3-ta-games-20261019-r2';
  const VOWEL_SOUND=/^[aeiou]/i;
  const AN_EXCEPTIONS=new Set(['hour','honest','honour','honor','heir','herb']);
  const A_EXCEPTIONS=new Set(['uniform','university','unicorn','user','unit','useful','unique','union','european','euro','one','once']);
  const FEELING_WORDS=new Set(['happy','sad','angry','scared','surprised','tired','hungry','thirsty','bored','shy','proud','fine','excited','worried','confused','grateful']);
  // Only singular countable nouns are suitable for A/An Factory.
  // A category is not a part-of-speech tag (e.g. M12 also has glue, scissors, open).
  const COUNTABLE_NOUNS=Object.freeze({
    '2':new Set('book|pencil|pen|eraser|ruler|bag|desk|chair|board|crayon|notebook|backpack|globe|map|computer|marker|sharpener|school|classroom|teacher|student|blackboard|calculator|art room|computer room|gym|library|music room|playground|pencil case|school bag'.split('|')),
    '4':new Set('apple|banana|grape|strawberry|watermelon|pineapple|mango|pear|cherry|peach|kiwi|lemon|coconut|avocado|plum|pomegranate|raspberry|blueberry|lime|carrot|potato|tomato|onion|cabbage|cucumber|mushroom|pepper|pumpkin|eggplant|zucchini|green bean|radish|cauliflower|sweet potato|bean|egg|fish'.split('|')),
    '6':new Set('mother|father|sister|brother|grandmother|grandfather|uncle|aunt|cousin|son|daughter|baby|family|teacher|doctor|nurse|police officer|firefighter|chef|pilot|driver|farmer|singer|dancer|artist|engineer|scientist|student|baker|dentist|vet|hairdresser|builder|cook|job|worker'.split('|')),
    '8':new Set('car|bus|bicycle|motorcycle|train|airplane|boat|ship|truck|taxi|subway|helicopter|ambulance|fire truck|police car'.split('|')),
    '9':new Set('shirt|dress|skirt|jacket|coat|sweater|t-shirt|hat|scarf|belt|tie|watch|bag'.split('|')),
    '11':new Set('bathroom|bedroom|house|kitchen|lamp|living room|table|bed|door|room|window'.split('|')),
    '12':new Set('bus|car|kite|plane|ship|teddy bear|toy|train|truck'.split('|'))
  });
  const isCountableNoun=item=>{
    const id=txt(item?.__topic),word=norm(item?.word);
    return id==='1'&&/^[a-z][a-z ]*$/i.test(word)||!!COUNTABLE_NOUNS[id]?.has(word);
  };
  const COMMAND_WORDS=new Set(['open','close','stand','sit','listen','look','read','write','raise','point','touch','show','put','come','go','turn','stop','draw','colour','color','say','repeat','ask','work','jump','clap','walk','run']);
  const ACTION_FOR_RACE=new Set('play read write sing draw fly ride kick jump run walk dance swim listen watch cook eat drink climb skate skip paint go stand'.split(' '));
  const modules=new Map(),pendingScripts=new Map();
  const txt=v=>String(v==null?'':v),norm=v=>txt(v).normalize('NFC').trim().replace(/\s+/g,' ').toLowerCase();
  const esc=v=>txt(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const shuffle=arr=>{const a=[...(Array.isArray(arr)?arr:[])];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
  const uniq=(items,key)=>{const seen=new Set();return (Array.isArray(items)?items:[]).filter(x=>{const k=key?key(x):norm(x?.id||x?.word||JSON.stringify(x));if(!k||seen.has(k))return false;seen.add(k);return true;});};
  const pick=(items,n)=>shuffle(items).slice(0,Math.max(0,Math.floor(Number(n)||0)));
  const choosePool=(items,n)=>pick(uniq(items,x=>norm(x.id||x.word+'|'+x.vietnamese)),n);
  const words=v=>txt(v).trim().split(/\s+/).filter(Boolean);
  const qText=q=>txt(q?.question_text||q?.prompt||q?.question||'');
  const qAnswer=q=>txt(q?.answer||q?.word||'');
  const qSentence=q=>txt(q?.completed_sentence||(qText(q).replace(/_{2,}/g,qAnswer(q))));
  const getWordsByLength=(min,max,source)=>uniq((Array.isArray(source)?source:[]).filter(x=>/^[a-z]+$/i.test(txt(x.word))&&x.word.length>=min&&x.word.length<=max),x=>norm(x.word));
  const isAn=word=>{const w=norm(word).split(' ')[0];if(AN_EXCEPTIONS.has(w))return true;if(A_EXCEPTIONS.has(w))return false;return VOWEL_SOUND.test(w);};
  const makeOptions=(options,answer,count=4)=>{
    const result=uniq([answer,...(Array.isArray(options)?options:[])].filter(x=>txt(x).trim()),x=>norm(x));
    return shuffle(result.slice(0,Math.max(2,count)));
  };
  function register(key,factory){if(!KEYS.includes(key)||typeof factory!=='function')throw new Error('Mini Game khong hop le.');modules.set(key,factory);}
  function ensureScript(key){
    if(modules.has(key))return Promise.resolve();
    if(!KEYS.includes(key))return Promise.reject(new Error('Game is not supported.'));
    if(pendingScripts.has(key))return pendingScripts.get(key);
    const promise=new Promise((resolve,reject)=>{
      const node=document.createElement('script');
      node.src='assets/js/english/games/'+key+'.js'+V;
      node.async=true;node.dataset.class3EnglishGame=key;
      node.onload=()=>modules.has(key)?resolve():reject(new Error('Chua khoi tao Mini Game: '+key));
      node.onerror=()=>reject(new Error('Thieu file Mini Game: '+key+'.js'));
      document.head.append(node);
    }).catch(e=>{pendingScripts.delete(key);throw e;});
    pendingScripts.set(key,promise);return promise;
  }
  function ensureStyle(){
    if(document.getElementById('class3-en-games-style'))return;
    const style=document.createElement('style');style.id='class3-en-games-style';style.textContent=CSS;document.head.append(style);
  }
  function create(host,services){
    if(!(host instanceof HTMLElement))throw new Error('Missing mini game host.');
    ensureStyle();
    let destroyed=false,phase='loading',gameKey='',handler=null,s=null,pool=[],groups=[],chosen=new Set(),kind='',fixed=false,feedbackIntro='',token=0;
    const lang=['Easy / D\u1ec5','Medium / V\u1eeba','Hard / Kh\u00f3'];
    const e=(s)=>esc(s),message=(t)=>{feedbackIntro=txt(t);if(phase==='intro')showIntro();services.toast?.(t);};
    const speak=text=>{if(destroyed||!txt(text).trim())return;services.speak?.(txt(text).slice(0,360));};
    const score=()=>services.onScore?.(Number(s?.completed||0),Number(s?.wrong||0));
    const makeButton=(action,text,variant='',attrs='')=>`<button type="button" class="ta3g-control ${variant}" data-gact="${action}" ${attrs}>${esc(text)}</button>`;
    function showIntro(){
      if(destroyed||phase!=='intro')return;
      const topics=groups.map(g=>`<button type="button" class="ta3g-topic ${chosen.has(g.id)?'selected':''}" data-gact="topic" data-id="${esc(g.id)}" aria-pressed="${chosen.has(g.id)}" ${fixed?'disabled':''}>
        <span class="ta3g-topic-check">${chosen.has(g.id)?'\u2713':''}</span><span class="ta3g-topic-text">${esc(g.name)}<small>${esc(g.vi||'')}</small></span><b>${g.count}</b></button>`).join('');
      host.innerHTML=`<section class="ta3g-shell"><header class="ta3g-head"><h2>\uD83C\uDFAE ${esc(META[gameKey][0])}</h2><p>${esc(META[gameKey][1])}</p></header>
      <p class="ta3g-guide">${['a-or-an-factory','feeling-detective'].includes(gameKey)?'📚 Từ vựng Mục 12 · Ngữ pháp Mục 10':kind==='vocab'?'📚 Vocabulary · Mục 12':'🧠 Grammar · Mục 10'} \u00b7 ${fixed?'Ch\u1ee7 \u0111\u1ec1 ph\u00f9 h\u1ee3p v\u1edbi tr\u00f2 ch\u01a1i':'Ch\u1ecdn t\u1eeb 1 \u0111\u1ebfn 3 ch\u1ee7 \u0111\u1ec1'}.</p>
      <div class="ta3g-topics">${topics}</div><div class="ta3g-levels">${lang.map((v,i)=>makeButton('level',`\u2B50 ${v} \u00b7 ${LEVELS[gameKey][i][0]} ${gameKey==='word-search'?'t\u1eeb':gameKey==='bingo'?'\u00f4':'c\u00e2u'}`,'level',`data-n="${i}"`)).join('')}</div>
      ${feedbackIntro?`<p class="ta3g-feedback warning">${esc(feedbackIntro)}</p>`:''}<nav class="ta3g-nav">${makeButton('exit','\u2190 Mini Games')}</nav></section>`;
    }
    function poolForSelection(){
      const selected=pool.filter(x=>chosen.has(x.__topic));
      if(gameKey==='feeling-detective')return uniq(selected.filter(x=>FEELING_WORDS.has(norm(x.word))),x=>norm(x.word));
      if(gameKey==='a-or-an-factory')return uniq(selected.filter(x=>isCountableNoun(x)),x=>norm(x.word));
      if(gameKey==='teacher-says')return uniq(selected.filter(x=>{const v=norm(qSentence(x).replace(/^(please[, ]+|don't |do not )/i,'').split(/\s+/)[0]);return COMMAND_WORDS.has(v)&&words(qSentence(x)).length>=2;}),x=>norm(qSentence(x)));
      if(gameKey==='sentence-train')return uniq(selected.filter(x=>words(qSentence(x)).length>=3&&words(qSentence(x)).length<=15&&!/[—–]/.test(qSentence(x))),x=>norm(qSentence(x)));
      if(gameKey==='sentence-doctor')return selected.filter(x=>/_{2,}/.test(qText(x))&&!/[—–]/.test(qSentence(x))&&Array.isArray(x.options)&&x.options.some(o=>norm(o)!==norm(x.answer)));
      if(gameKey==='qa-bridge')return selected.filter(x=>/^.+\?.*[—–].+/.test(qSentence(x)));
      if(gameKey==='action-race')return selected.filter(x=>{let w=norm(qAnswer(x));if(w.endsWith('ies'))w=w.slice(0,-3)+'y';else if(w.endsWith('es')&&!ACTION_FOR_RACE.has(w))w=w.slice(0,-2);else if(w.endsWith('s')&&!ACTION_FOR_RACE.has(w))w=w.slice(0,-1);return ACTION_FOR_RACE.has(w)&&txt(x.completed_sentence_vi).trim();});
      if(kind==='grammar')return selected.filter(x=>Array.isArray(x.options)&&x.options.length>=2&&x.options.includes(x.answer));
      return selected;
    }
    function roundBase(html,props={}){
      if(destroyed||phase!=='playing')return;
      const special=gameKey==='word-search'||gameKey==='bingo';
      const current=Number(s.at||0)+1;
      const feedback=s.feedback?`<p class="ta3g-feedback ${s.success?'success':'warning'}" role="status">${esc(s.feedback)}</p>`:'';
      const tools=[props.listen||handler?.listen?makeButton('listen','\uD83D\uDD0A Listen'):null,props.hint!==false&&handler?.hint?makeButton('hint','\uD83D\uDCA1 G\u1ee3i \u00fd'):null,makeButton('reset','\uD83D\uDD04 Ch\u01a1i l\u1ea1i')].filter(Boolean).join('');
      host.innerHTML=`<section class="ta3g-shell"><header class="ta3g-game-head"><div><strong>${esc(META[gameKey][0])}</strong><small>${lang[s.level]} \u00b7 ${esc(META[gameKey][1])}</small></div><span class="ta3g-counter">${special?s.completed+'/'+s.rounds:Math.min(current,s.rounds)+'/'+s.rounds} \u00b7 \u2b50 ${s.points}</span></header>
      <div class="ta3g-game-body">${html}${feedback}</div><nav class="ta3g-nav"><div class="ta3g-nav-actions">${tools}</div><div class="ta3g-nav-actions">${!special?makeButton('next',current>=s.rounds?'\uD83C\uDFC1 Finish':'Next \u2192','primary',s.locked?'':'disabled'):''}${makeButton('exit','\u2190 Mini Games')}</div></nav></section>`;
      score();
    }
    const context={
      get s(){return s;},get pool(){return s?.source||[];},get phase(){return phase;},LEVELS,
      esc,txt,norm,shuffle,uniq,pick,choosePool,getWordsByLength,makeOptions,words,qText,qAnswer,qSentence,isAn,
      question:()=>s?.run?.[s.at],
      narrate:speak,emit:message,
      roundBase,btn:makeButton,
      choices:(cls,options)=>`<div class="ta3g-choices ${esc(cls)}">${(options||[]).map((o,i)=>`<button type="button" class="ta3g-choice" data-gact="pick" data-n="${i}" ${s?.locked?'disabled':''}><b>${String.fromCharCode(65+i)}.</b> ${esc(o)}</button>`).join('')}</div>`,
      showRound:()=>showRound(),finish:()=>finish(),showIntro:()=>{phase='intro';showIntro();},
      accept:text=>{if(!s||s.locked||phase!=='playing')return;s.locked=true;s.completed++;s.points+=10;s.success=true;s.feedback=txt(text);showRound();},
      reject:text=>{if(!s||s.locked||phase!=='playing')return;s.wrong++;s.success=false;s.feedback=txt(text);showRound();}
    };
    function showRound(){if(destroyed||phase!=='playing')return;try{handler?.render();}catch(err){message('Game gap loi trong khi hien thi.');showGameError(err);}}
    function showGameError(err){phase='intro';feedbackIntro='Khong the mo cau hoi. '+txt(err?.message||'');showIntro();}
    function finish(){if(destroyed||!s)return;phase='done';score();host.innerHTML=`<section class="ta3g-shell ta3g-finish"><div class="ta3g-trophy">\uD83C\uDFC6</div><h2>Excellent! \u00b7 Ho\u00e0n th\u00e0nh!</h2><p>${esc(META[gameKey][0])}</p><div class="ta3g-results"><span>\u2705 Correct: <b>${s.completed}</b></span><span>\uD83C\uDFAF Wrong: <b>${s.wrong}</b></span><span>\u2B50 ${s.points} points</span></div><nav class="ta3g-nav">${makeButton('retry','\uD83D\uDD04 Ch\u01a1i l\u1ea1i','primary')}${makeButton('exit','\u2190 Mini Games')}</nav></section>`;}
    function next(){if(phase!=='playing'||!s?.locked)return;if(s.at>=s.rounds-1){finish();return;}s.at++;s.locked=false;s.feedback='';s.success=false;handler?.onNext?.();showRound();}
    async function startLevel(level){
      if(phase!=='intro'||!Number.isInteger(level)||level<0||level>2)return;
      const requestPool=poolForSelection(),rounds=LEVELS[gameKey][level][0];
      const distinct=gameKey==='word-search'||gameKey==='word-scramble'||gameKey==='bingo'||gameKey==='a-or-an-factory'||gameKey==='feeling-detective'
        ?uniq(requestPool,x=>norm(x.word)):uniq(requestPool,x=>norm(x.id||x.question_text));
      const required=gameKey==='word-search'?rounds:rounds;
      if(!chosen.size||distinct.length<required){feedbackIntro='Nh\u00f3m n\u00e0y ch\u01b0a \u0111\u1ee7 '+required+' '+(kind==='vocab'?'t\u1eeb':'c\u00e2u')+' ph\u00f9 h\u1ee3p. B\u00e9 h\u00e3y ch\u1ecdn th\u00eam ch\u1ee7 \u0111\u1ec1 ho\u1eb7c m\u1ee9c d\u1ec5 h\u01a1n.';showIntro();return;}
      s={game:gameKey,level,rounds,at:0,completed:0,wrong:0,points:0,locked:false,feedback:'',success:false,source:distinct,run:[],optionCount:level===0?3:4};
      handler=modules.get(gameKey)(context);handler?.bind?.();
      phase='playing';const ok=handler?.begin?.(level,rounds,distinct);
      if(ok===false){phase='intro';showIntro();return;}
      if(!Array.isArray(s.run)||!(['word-search','bingo'].includes(gameKey))&&s.run.length<rounds){phase='intro';feedbackIntro='H\u1ecdc li\u1ec7u ch\u01b0a \u0111\u1ee7 cho m\u1ee9c n\u00e0y.';showIntro();return;}
      score();showRound();
    }
    async function start(key){
      if(destroyed||!KEYS.includes(key))throw new Error('Game khong hop le.');
      const current=++token;gameKey=key;kind=META[key][2];phase='loading';
      host.innerHTML='<section class="ta3g-shell ta3g-loading"><i></i><p>\u0110ang t\u1ea3i Mini Game...</p></section>';
      await ensureScript(key);if(destroyed||current!==token)return;
      const raw=kind==='vocab'?await services.getVocab():await services.getGrammar();if(destroyed||current!==token)return;
      if(kind==='vocab'){
        const data=Array.isArray(raw)?raw:raw?.words||[];
        pool=data.filter(w=>w&&txt(w.word).trim()&&txt(w.vietnamese).trim()).map((w,i)=>({...w,id:txt(w.id||'v_'+i),__topic:txt(w.group_id||w.groupId)}));
        groups=uniq(pool,x=>x.__topic).map(w=>({id:w.__topic,name:txt(w.topic_name||w.group_name||'Vocabulary'),vi:txt(w.topic_name_vi||''),count:pool.filter(x=>x.__topic===w.__topic).length}));
        if(key==='feeling-detective')groups=groups.filter(g=>pool.some(w=>w.__topic===g.id&&FEELING_WORDS.has(norm(w.word))));
        if(key==='a-or-an-factory')groups=groups.filter(g=>['1','2','4','6','8','9','11','12'].includes(g.id));
      }else{
        const sections=raw?.sections||{};
        const names=raw?.section_names||{},vis=raw?.section_names_vi||{};
        pool=Object.entries(sections).filter(([id,x])=>/^section_10\.(?:[1-9]|1[01])$/.test(id)&&Array.isArray(x)).flatMap(([id,rows])=>rows.filter(q=>q&&txt(q.question_text).includes('___')&&Array.isArray(q.options)&&q.options.includes(q.answer)&&txt(q.completed_sentence)).map((q,i)=>({...q,id:txt(q.id||id+'_'+i),__topic:id,question_text:txt(q.question_text),answer:txt(q.answer)})));
        groups=uniq(pool,x=>x.__topic).map(w=>({id:w.__topic,name:names[w.__topic]||w.__topic.replace('section_','Grammar '),vi:vis[w.__topic]||'',count:pool.filter(x=>x.__topic===w.__topic).length}));
        const fix={ 'qa-bridge':['section_10.9'],'action-race':['section_10.3'],'teacher-says':['section_10.10'] }[key];
        if(fix)groups=groups.filter(g=>fix.includes(g.id));
      }
      if(!pool.length||!groups.length)throw new Error('Chua co hoc lieu dung cho Mini Game.');
      fixed=key==='feeling-detective'||key==='qa-bridge'||key==='action-race'||key==='teacher-says';
      chosen=new Set(groups.slice(0,Math.min(3,groups.length)).map(g=>g.id));
      phase='intro';feedbackIntro='';showIntro();
    }
    function handleClick(evt){
      const b=evt.target?.closest?.('button[data-gact]');if(!b||!host.contains(b)||b.disabled||destroyed)return;
      const action=b.dataset.gact,n=Number(b.dataset.n);
      if(action==='exit'){services.stopAudio?.();services.onExit?.();return;}
      if(action==='retry'){phase='intro';showIntro();return;}
      if(action==='topic'&&phase==='intro'&&!fixed){const id=b.dataset.id;if(!groups.some(g=>g.id===id))return; if(chosen.has(id))chosen.delete(id);else if(chosen.size<3)chosen.add(id);else{feedbackIntro='Ch\u1ecdn t\u1ed1i \u0111a 3 ch\u1ee7 \u0111\u1ec1 nh\u00e9!';}showIntro();return;}
      if(action==='level'&&phase==='intro'){void startLevel(n).catch(err=>showGameError(err));return;}
      if(phase!=='playing')return;
      if(action==='next'){next();return;}
      if(action==='reset'){services.stopAudio?.();phase='intro';showIntro();return;}
      if(action==='listen'){handler?.listen?.();return;}
      if(action==='hint'){handler?.hint?.();showRound();return;}
      if(action==='pick'){handler?.pick?.(n);return;}
      if(action==='cell'&&s?.suppressCellClickUntil>Date.now())return;
      handler?.action?.(action,n,b);
    }
    const pointerDown=evt=>{if(phase==='playing')handler?.pointerDown?.(evt,host);};
    const pointerMove=evt=>{if(phase==='playing')handler?.pointerMove?.(evt,host);};
    const pointerUp=evt=>{if(phase==='playing')handler?.pointerUp?.(evt,host);};
    const pointerCancel=()=>handler?.pointerCancel?.();
    host.addEventListener('click',handleClick);
    host.addEventListener('pointerdown',pointerDown);
    host.addEventListener('pointermove',pointerMove);
    host.addEventListener('pointerup',pointerUp);
    host.addEventListener('pointercancel',pointerCancel);
    return {start,destroy(){if(destroyed)return;destroyed=true;token++;handler?.destroy?.();services.stopAudio?.();host.removeEventListener('click',handleClick);host.removeEventListener('pointerdown',pointerDown);host.removeEventListener('pointermove',pointerMove);host.removeEventListener('pointerup',pointerUp);host.removeEventListener('pointercancel',pointerCancel);host.replaceChildren();},getSnapshot(){return {phase,gameKey,level:s?.level??null,rounds:s?.rounds||0,at:s?.at||0,completed:s?.completed||0,wrong:s?.wrong||0,selected:[...chosen]};}};
  }
  window.CLASS3_ENGLISH_MINIGAMES=Object.freeze({version:'20261019.2',keys:KEYS,register,create});
  const CSS = `
  .ta3g-host{width:100%;max-width:82rem;margin:auto;color:#334155;font:800 16px/1.4 'Nunito',system-ui,sans-serif}
  .ta3g-host *{box-sizing:border-box}.ta3g-shell{width:100%;background:linear-gradient(140deg,#fffafd,#f8f7ff);border:1.5px solid #e9d5ff;border-radius:22px;padding:20px;box-shadow:0 5px 17px rgba(108,40,217,.05)}
  .ta3g-head{text-align:center}.ta3g-head h2{margin:0;font-size:27px;font-weight:950;color:#6d28d9}.ta3g-head p{font-size:17px;color:#64748b;margin:5px 0 0}
  .ta3g-guide{text-align:center;margin:12px 0;font-size:16px;color:#475569}.ta3g-topics{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin-top:12px}
  .ta3g-topic{border:1.5px solid #e9d5ff;background:#fff;border-radius:15px;min-height:68px;display:flex;align-items:center;gap:9px;text-align:left;padding:9px 11px;color:#334155;font:900 15px/1.3 'Nunito',system-ui,sans-serif;cursor:pointer;min-width:0}
  .ta3g-topic.selected{border-color:#a855f7;background:#f6efff;box-shadow:0 0 0 1px #ddd6fe}.ta3g-topic:disabled{cursor:default}.ta3g-topic-check{width:27px;height:27px;flex:0 0 27px;border:2px solid #c4b5fd;border-radius:9px;display:flex;align-items:center;justify-content:center;color:white;font-size:18px;font-weight:950}.ta3g-topic.selected .ta3g-topic-check{background:#7c3aed;border-color:#7c3aed}.ta3g-topic-text{min-width:0;flex:1;font-weight:950;overflow-wrap:anywhere}.ta3g-topic-text small{display:block;color:#64748b;font-size:13px;line-height:1.3;margin-top:4px}.ta3g-topic>b{font-size:13px;color:#7c3aed}
  .ta3g-levels{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:11px;margin:21px 0 14px}.ta3g-control{min-height:42px;padding:10px 15px;border-radius:13px;border:1.5px solid #d8b4fe;background:#fff;color:#7e22ce;font:900 15px/1.2 'Nunito',system-ui,sans-serif;cursor:pointer}.ta3g-control:hover:not(:disabled){background:#f5f3ff;border-color:#a855f7}.ta3g-control:focus-visible,.ta3g-choice:focus-visible,.ta3g-tile:focus-visible,.ta3g-topic:focus-visible{outline:3px solid #a78bfa;outline-offset:2px}.ta3g-control.level{border-color:#e9d5ff;background:#f5f3ff}.ta3g-control.primary,.ta3g-control.emphasis{background:linear-gradient(105deg,#ec4899,#8b5cf6);border-color:#a855f7;color:#fff}.ta3g-control:disabled{opacity:.43;cursor:not-allowed}
  .ta3g-game-head{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;border-bottom:1px solid #e9d5ff;padding-bottom:12px;margin-bottom:15px}.ta3g-game-head strong{font-size:22px;font-weight:950;color:#6d28d9}.ta3g-game-head small{display:block;font-size:14px;color:#64748b;font-weight:800}.ta3g-counter{padding:7px 11px;border-radius:12px;background:#f3e8ff;color:#7c3aed;font-size:16px;font-weight:950}
  .ta3g-game-body{min-height:225px;text-align:center}.ta3g-game-body h4{font-size:22px;font-weight:950;margin:5px 0 13px;color:#6d28d9}.ta3g-game-body p{margin:10px 0;font-size:16px}.ta3g-prompt{font-size:clamp(19px,2.3vw,25px)!important;font-weight:950;line-height:1.45;white-space:pre-line;overflow-wrap:anywhere;color:#1e293b}.ta3g-choices{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin:16px 0}.ta3g-choice{border:1.5px solid #ddd6fe;background:#fff;border-radius:15px;min-height:62px;padding:11px 14px;color:#4c1d95;text-align:left;font:900 18px/1.4 'Nunito',system-ui,sans-serif;cursor:pointer;overflow-wrap:anywhere}.ta3g-choice:hover:not(:disabled){border-color:#a855f7;background:#f5f3ff}.ta3g-choice:disabled{opacity:.64}.ta3g-choice b{color:#e11d48;margin-right:6px}.ta3g-feedback{padding:11px 15px;border-radius:12px;font-size:16px;line-height:1.35;font-weight:850;margin:12px auto}.ta3g-feedback.success{background:#ecfdf5;color:#047857;border:1px solid #86efac}.ta3g-feedback.warning{background:#fff7ed;color:#9a3412;border:1px solid #fdba74}
  .ta3g-nav{margin-top:15px;display:flex;gap:12px;justify-content:space-between;flex-wrap:wrap;align-items:center}.ta3g-nav-actions{display:flex;flex-wrap:wrap;gap:9px}.ta3g-finish{text-align:center;padding:35px}.ta3g-trophy{font-size:72px}.ta3g-finish h2{font-size:27px;color:#6d28d9}.ta3g-results{display:flex;gap:15px;justify-content:center;flex-wrap:wrap;margin:18px}.ta3g-results span{background:#f5f3ff;border:1px solid #e9d5ff;border-radius:13px;padding:13px;font-size:18px}.ta3g-loading{text-align:center;padding:38px}.ta3g-loading i{display:inline-block;width:30px;height:30px;border-radius:50%;border:4px solid #e9d5ff;border-top-color:#a855f7;animation:ta3g-spin .8s linear infinite}@keyframes ta3g-spin{to{transform:rotate(360deg)}}
  .ta3g-tiles{display:flex;justify-content:center;flex-wrap:wrap;gap:8px;margin:16px auto}.ta3g-tile{border:1.5px solid #d8b4fe;background:#f5f3ff;border-radius:10px;padding:11px 14px;min-width:44px;min-height:45px;color:#6d28d9;font:950 20px 'Nunito',system-ui,sans-serif;cursor:pointer}.ta3g-tile:disabled{opacity:.45}.ta3g-built{font-size:clamp(24px,3vw,32px);font-weight:950;letter-spacing:3px;color:#be185d;min-height:43px;overflow-wrap:anywhere}.ta3g-actions{display:flex;gap:9px;justify-content:center;flex-wrap:wrap;margin:15px auto}
  .ta3g-pond{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;padding:19px;border-radius:23px;background:linear-gradient(#c6efff,#dbeafe);border:2px solid #7dd3fc;margin:16px 0}.ta3g-fish{border:1.5px solid #7dd3fc;border-radius:16px;min-height:100px;display:grid;place-content:center;gap:3px;background:#fff;color:#0369a1;font-size:17px;font-weight:950;cursor:pointer;overflow-wrap:anywhere}.ta3g-fish span{font-size:38px}
  .ta3g-train,.ta3g-tokens{display:flex;align-items:center;justify-content:center;gap:7px;flex-wrap:wrap;margin:17px auto}.ta3g-wagon{padding:10px 12px;border:1px solid #f9a8d4;background:#fff1f2;border-radius:11px;color:#9d174d;font-size:17px;font-weight:900}.ta3g-empty-wagon{min-width:36px;padding:10px;border:2px dashed #d8b4fe;border-radius:10px;color:#c4b5fd;font-size:18px}.ta3g-error-tile{background:#ffe4e6;border-color:#fb7185;color:#be123c}
  .ta3g-bridge,.ta3g-river,.ta3g-track{display:flex;gap:4px;flex-wrap:wrap;justify-content:center;align-items:center;border:1px solid #bae6fd;border-radius:18px;background:#f0f9ff;padding:17px;margin:12px}.ta3g-bridge span,.ta3g-river span,.ta3g-track span{font-size:25px}.ta3g-bridge span.built{filter:drop-shadow(0 0 4px #34d399)}
  .ta3g-conveyor{margin:15px auto;max-width:500px;background:#e0f2fe;border-radius:16px;padding:18px;overflow:hidden}.ta3g-package{font-size:25px}.ta3g-belt{height:12px;margin:16px auto 3px;background:repeating-linear-gradient(90deg,#64748b 0,#64748b 16px,#cbd5e1 16px,#cbd5e1 30px);border-radius:9px}.ta3g-gates{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:17px}.ta3g-gates button{background:#f5f3ff;border:2px solid #c4b5fd;border-radius:17px;min-height:110px;font-size:29px;font-weight:950;color:#6d28d9;cursor:pointer}.ta3g-gates small{display:block;font-size:15px;color:#64748b}.ta3g-emblem{font-size:84px;margin:12px}.ta3g-teacher{border-radius:16px;border:2px solid #ddd6fe;padding:20px;margin:16px 0;background:#f5f3ff;font-size:23px;color:#6d28d9}.ta3g-freeze{background:#e0f2fe}
  .ta3g-bingo{display:grid;grid-template-columns:repeat(var(--ta3g-cols),minmax(0,1fr));gap:6px;max-width:720px;margin:14px auto}.ta3g-bingo button{min-height:60px;background:#fff;border:1.5px solid #d8b4fe;border-radius:12px;font-weight:900;color:#6d28d9;font-size:15px;overflow-wrap:anywhere}.ta3g-bingo button.marked{background:#dcfce7;border-color:#86efac;color:#047857}.ta3g-bingo-status{display:flex;flex-wrap:wrap;gap:10px;align-items:center;justify-content:center}
  .ta3g-search-wrap{display:grid;grid-template-columns:minmax(0,1fr) 210px;gap:15px;max-width:900px;margin:auto;text-align:left}.ta3g-search-grid{display:grid;grid-template-columns:repeat(var(--ta3g-cols),minmax(0,1fr));gap:3px;touch-action:none}.ta3g-search-grid button{aspect-ratio:1;border-radius:6px;border:1px solid #e9d5ff;background:#fff;font:950 clamp(11px,1.45vw,19px)/1.1 'Nunito',system-ui,sans-serif;color:#6d28d9;min-width:0;padding:0}.ta3g-search-grid button.found{background:#dcfce7;color:#047857;border-color:#86efac}.ta3g-search-grid button.selected{background:#dbeafe;border-color:#38bdf8}.ta3g-search-words{padding:11px;background:#f5f3ff;border-radius:14px;line-height:1.75}.ta3g-search-words .solved{color:#047857;text-decoration:line-through}
  @media(max-width:850px){.ta3g-topics{grid-template-columns:repeat(2,minmax(0,1fr))}.ta3g-pond{grid-template-columns:repeat(3,minmax(0,1fr))}}@media(max-width:600px){.ta3g-shell{padding:12px 9px;border-radius:15px}.ta3g-head h2{font-size:23px}.ta3g-topics{grid-template-columns:1fr}.ta3g-topic{min-height:61px}.ta3g-levels{grid-template-columns:1fr}.ta3g-choices{grid-template-columns:1fr}.ta3g-choice{font-size:17px;min-height:57px}.ta3g-pond{grid-template-columns:repeat(2,minmax(0,1fr));padding:8px;gap:8px}.ta3g-search-wrap{grid-template-columns:1fr}.ta3g-search-grid button{font-size:clamp(10px,3vw,17px)}.ta3g-search-words{display:flex;gap:7px;flex-wrap:wrap}.ta3g-bingo button{min-height:48px;font-size:11px}.ta3g-game-head strong{font-size:19px}.ta3g-nav{gap:8px}.ta3g-control{font-size:14px;padding:9px}.ta3g-gates button{font-size:25px;min-height:90px}}
  /* Grade 3 rebuilt Games 05-12: actual manipulation, bilingual cues, tactile targets */
  .ta3g-context{font-size:17px!important;color:#475569;line-height:1.5;padding:11px 13px;background:#fff;border:1px solid #e9d5ff;border-radius:13px}
  .ta3g-solution{font-size:19px!important;color:#047857;font-weight:950;background:#dcfce7;padding:10px 14px;border-radius:12px;line-height:1.45}
  .ta3g-dialogue-question,.ta3g-dialogue-answer{text-align:left;max-width:750px;margin:13px auto;padding:17px 20px;border-radius:20px;background:#f3e8ff;border:1.5px solid #c4b5fd}
  .ta3g-dialogue-question small,.ta3g-dialogue-question span,.ta3g-dialogue-answer span{display:block;color:#64748b;font-size:15px;margin-top:5px;font-weight:800}
  .ta3g-dialogue-question strong{display:block;font-size:clamp(20px,2.4vw,25px);color:#5b21b6;line-height:1.35}
  .ta3g-dialogue-answer{background:#ecfdf5;border-color:#86efac;font-size:18px;color:#047857}
  .ta3g-reply-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:11px;max-width:880px;margin:18px auto}
  .ta3g-reply{min-height:75px;padding:14px 16px;text-align:left;background:#fff;border:1.5px solid #d8b4fe;border-radius:16px;font-size:18px;line-height:1.42;font-weight:900;color:#4c1d95;overflow-wrap:anywhere;cursor:pointer}
  .ta3g-reply:disabled{opacity:.60}
  .ta3g-patient{display:flex;flex-wrap:wrap;justify-content:center;gap:9px;margin:22px auto}
  .ta3g-patient-word{min-height:52px;padding:11px 13px;border-radius:13px;border:1.5px solid #e9d5ff;background:#fff;font:900 19px/1.4 'Nunito',system-ui,sans-serif;color:#334155;cursor:pointer}
  .ta3g-patient-word.identified{background:#ffe4e6;color:#be123c;border-color:#fb7185}
  .ta3g-river-steps{display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:10px;background:linear-gradient(120deg,#effaff,#dbeafe);border:1.5px solid #7dd3fc;border-radius:20px;padding:23px 15px;margin:15px 0}
  .ta3g-stone{display:inline-flex;justify-content:center;align-items:center;width:64px;height:54px;background:#fff;border:2px solid #93c5fd;color:#0369a1;font-size:24px;border-radius:50%;font-weight:900}
  .ta3g-stone.current{border-color:#a855f7;background:#f3e8ff}.ta3g-stone.crossed{background:#dcfce7;border-color:#4ade80}
  .ta3g-bank{font-size:34px}.ta3g-stone-choices .ta3g-choice{background:#f0f9ff;border-color:#7dd3fc}
  .ta3g-race-track{display:flex;align-items:center;gap:11px;margin:19px auto;max-width:840px;font-size:29px}
  .ta3g-race-bar{height:24px;flex:1;background:repeating-linear-gradient(90deg,#ddd6fe 0,#ddd6fe 37px,#ede9fe 37px,#ede9fe 50px);border:2px solid #c4b5fd;border-radius:15px;overflow:hidden}
  .ta3g-race-bar i{display:block;height:100%;border-radius:15px;background:linear-gradient(90deg,#f472b6,#8b5cf6);transition:width .3s}
  .ta3g-action-grid,.ta3g-mood-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:11px;max-width:800px;margin:16px auto}
  .ta3g-action-card,.ta3g-mood-card{display:flex;flex-direction:column;gap:5px;align-items:center;justify-content:center;min-height:112px;background:#fff;border:1.5px solid #ddd6fe;border-radius:16px;color:#4c1d95;font:900 17px/1.35 'Nunito',system-ui,sans-serif;cursor:pointer;overflow-wrap:anywhere;padding:10px}
  .ta3g-action-card span,.ta3g-mood-card span{font-size:39px}.ta3g-action-card:disabled,.ta3g-mood-card:disabled{opacity:.62}
  .ta3g-action-card.freeze{background:#e0f2fe;border-color:#7dd3fc}.ta3g-action-card:focus-visible,.ta3g-mood-card:focus-visible,.ta3g-reply:focus-visible,.ta3g-patient-word:focus-visible{outline:3px solid #a78bfa;outline-offset:2px}
  .ta3g-case{background:#fff;border:1.5px solid #e9d5ff;border-radius:16px;padding:15px;text-align:left;max-width:830px;margin:14px auto}
  .ta3g-case>b{color:#7c3aed}.ta3g-case>p{font-size:20px!important;font-weight:950;color:#1e293b;margin:6px 0!important}.ta3g-case>small{font-size:16px;color:#64748b;font-weight:850}
  .ta3g-be-line{font-size:clamp(24px,3vw,32px);font-weight:950;color:#4c1d95;margin:20px auto}.ta3g-be-line b{color:#be185d}
  .ta3g-factory-products{display:grid;place-items:center;gap:3px;margin:12px auto;padding:16px;border:1.5px solid #7dd3fc;background:#f0f9ff;border-radius:19px;max-width:480px}
  .ta3g-factory-products b{font-size:29px}.ta3g-factory-products strong{font-size:26px;color:#0369a1}.ta3g-factory-products small{color:#475569;font-size:16px}
  .ta3g-gates-flex{grid-template-columns:repeat(auto-fit,minmax(130px,1fr));max-width:700px;margin-inline:auto}
  @media(max-width:600px){.ta3g-reply-grid{grid-template-columns:1fr}.ta3g-dialogue-question,.ta3g-dialogue-answer{padding:12px 14px}.ta3g-patient-word{font-size:16px;min-height:48px;padding:8px 11px}.ta3g-stone{width:47px;height:43px;font-size:20px}.ta3g-river-steps{gap:5px;padding:13px 5px}.ta3g-bank{font-size:25px}.ta3g-action-grid,.ta3g-mood-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.ta3g-action-card,.ta3g-mood-card{min-height:100px;font-size:16px}.ta3g-action-card span,.ta3g-mood-card span{font-size:33px}.ta3g-case>p{font-size:18px!important}.ta3g-context{font-size:16px!important}}
  @media(prefers-reduced-motion:reduce){.ta3g-host *, .ta3g-host *:before{transition:none!important;animation:none!important}}
  `;
})();
