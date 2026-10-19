/* Epsilon Edu - Tiếng Việt 3 - Hiệp sĩ Chính tả (Săn Quái Chữ)
 * Port of the TV3 standalone arcade concept. No global account, DOM or game state.
 * Source questions supplied by the parent TV3 module from official Topic 1 JSON.
 */
(() => {
  'use strict';
  window.CLASS3_TV3_GAMES=window.CLASS3_TV3_GAMES||{};
  if(window.CLASS3_TV3_GAMES.spellingKnight)return;
  const MODES=[
    {id:'mixed',label:'Đại chiến tổng hợp',icon:'⚔️',regex:null,gates:null},
    {id:'chtr',label:'ch / tr',icon:'🛡️',regex:/ch\s*\/\s*tr/i,gates:['ch','tr']},
    {id:'sx',label:'s / x',icon:'🌟',regex:/s\s*\/\s*x/i,gates:['s','x']},
    {id:'ln',label:'l / n',icon:'🍀',regex:/l\s*\/\s*n/i,gates:['l','n']},
    {id:'rdgi',label:'r / d / gi',icon:'🔥',regex:/r\s*\/\s*d\s*\/\s*gi|d\s*\/\s*r\s*\/\s*gi/i,gates:['r','d','gi']},
    {id:'rules',label:'ng/ngh · g/gh · c/k',icon:'🏰',regex:/ng\s*\/\s*ngh|g\s*\/\s*gh|c\s*\/\s*k|quy tắc chính tả/i,gates:['ng','ngh','g','gh','c','k']}
  ];

  // Bộ bổ sung r/d/gi dành riêng cho TV3; không phụ thuộc subtopic JSON.
  const RDGI_WORDS=['rừng','rổ','rùa','rễ','rực rỡ','rộn ràng','rì rào','rộng rãi','rèn luyện','rặng tre','dòng sông','dũng cảm','dịu dàng','dạo chơi','dạy học','dọn dẹp','dấu chân','dồi dào','dành dụm','dẻo dai','gia đình','giọt nước','giữ gìn','giúp đỡ','giảng bài','giấc ngủ','giỏ quà','giữa sân','giàu có','giận dữ'];
  const RDGI_BANK=RDGI_WORDS.map((word,i)=>{
    const correct=word.startsWith('gi')?'gi':word[0];
    return {id:'rdgi-local-'+i,sub:'r / d / gi',answer:word,correct,blank:word.slice(correct.length),gates:['r','d','gi']};
  });
  const h=(v)=>String(v==null?'':v).replace(/[&<>"']/g,s=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[s]));
  function shuffled(values){const a=values.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
  function buildChallenge(q){
    const sub=String(q.sub||''),answer=String(q.a||'').trim();
    if(!answer)return null;
    let gates=null;
    if(/ch\s*\/\s*tr/i.test(sub))gates=['ch','tr'];
    else if(/s\s*\/\s*x/i.test(sub))gates=['s','x'];
    else if(/l\s*\/\s*n/i.test(sub))gates=['l','n'];
    else if(/r\s*\/\s*d\s*\/\s*gi|d\s*\/\s*r\s*\/\s*gi/i.test(sub))gates=['r','d','gi'];
    else if(/ng\s*\/\s*ngh|g\s*\/\s*gh|c\s*\/\s*k|quy tắc chính tả/i.test(sub))gates=['ng','ngh','g','gh','c','k'];
    if(!gates)return null;
    const lower=answer.toLocaleLowerCase('vi'),matches=gates.slice().sort((a,b)=>b.length-a.length);
    const correct=matches.find(g=>lower.startsWith(g));if(!correct)return null;
    if(gates.length>3){
      if(['c','k'].includes(correct))gates=['c','k'];
      else if(['g','gh'].includes(correct))gates=['g','gh'];
      else if(['ng','ngh'].includes(correct))gates=['ng','ngh'];
      else return null;
    }
    let blank=answer.slice(correct.length),spokenAnswer=answer;
    if(!blank.trim()){
      // In the original TV3 bank, several "fill the first letter" questions
      // encode the answer as only s/x or l/n. Recover the missing word from
      // the quoted ellipsis in the prompt; never invent a word from choices.
      const prompt=String(q.q||'');
      const m=prompt.match(/['“‘"](?:\.{2,}|…|_{2,})\s*([^'“”‘’"\n]+)['”’"]?/u);
      if(!m)return null;
      blank=m[1].trim();
      if(!blank)return null;
      spokenAnswer=correct+blank;
    }
    return {id:String(q.id),sub,answer:spokenAnswer,correct,blank,gates};
  }
  function mount(props){
    const host=props?.host;
    if(!host)throw new Error('MINIGAME_HOST_MISSING');
    const all=[...(Array.isArray(props.questions)?props.questions:[]).map(buildChallenge).filter(Boolean),...RDGI_BANK];
    let active=true,mode=MODES[0],pool=[],round=0,lives=3,score=0,streak=0,bestStreak=0;
    let current=null,ended=false,deadline=0,tick=null,nextTimeout=null,knightLane=0,enemyGates=[];
    host.classList.add('tv3-knight-root');
    const one=(s)=>host.querySelector(s);
    const many=(s)=>host.querySelectorAll(s);
    function cancel(){if(tick!==null){clearInterval(tick);tick=null;}if(nextTimeout!==null){clearTimeout(nextTimeout);nextTimeout=null;}}
    function menu(){
      cancel();props.stopAudio?.();if(!active)return;
      host.innerHTML=`<section class="tv3-knight-menu"><div class="tv3-knight-title">⚔️👾</div><h3>Hiệp sĩ Chính tả: Săn Quái Chữ</h3><p>Chọn chữ còn thiếu trước khi quái tiến tới phòng tuyến. Bé có 3 lá chắn!</p><div class="tv3-knight-modes">${MODES.map(m=>{
        const size=all.filter(c=>!m.regex||m.regex.test(c.sub)).length;
        return `<button data-mode="${h(m.id)}" ${size?'':'disabled'}><span>${h(m.icon)}</span><strong>${h(m.label)}</strong><small>${size} thử thách</small></button>`;
      }).join('')}</div><button class="tv3-knight-quit" data-quit>← Quay lại Mini games</button></section>`;
      many('[data-mode]').forEach(b=>b.addEventListener('click',()=>start(b.dataset.mode)));
      one('[data-quit]')?.addEventListener('click',()=>props.onQuit?.());
    }
    function start(id){
      mode=MODES.find(m=>m.id===id)||MODES[0];
      const seen=new Set();const eligible=shuffled(all.filter(c=>!mode.regex||mode.regex.test(c.sub))).filter(c=>{
        const key=c.answer+'|'+c.correct;if(seen.has(key))return false;seen.add(key);return true;
      });
      if(!eligible.length){menu();return;}
      pool=eligible.slice(0,Math.min(12,eligible.length));round=0;lives=3;score=0;streak=0;bestStreak=0;knightLane=0;
      drawRound();
    }
    function updateHud(){
      const el=one('[data-score]');if(el)el.textContent=`⭐ ${score}`;
      const l=one('[data-lives]');if(l)l.textContent='🛡️'.repeat(lives)+'▫️'.repeat(3-lives);
      const s=one('[data-streak]');if(s)s.textContent=`🔥 ${streak}`;
    }
    function setLane(lane){
      knightLane=Math.min(Math.max(lane,0),enemyGates.length-1);
      const player=one('[data-knight]');if(player)player.style.left=enemyGates.length===2?(knightLane? '68%':'32%'):(20+30*knightLane)+'%';
    }
    function drawRound(){
      cancel();props.stopAudio?.();if(!active)return;
      if(round>=pool.length||lives<=0){finish();return;}
      current=pool[round];enemyGates=shuffled(current.gates);ended=false;
      const ms=Math.max(4800,7600-round*160-Math.min(streak,4)*140);
      deadline=Date.now()+ms;
      const centers=enemyGates.length===2?[32,68]:[20,50,80];
      host.innerHTML=`<div class="tv3-knight-arena"><div class="tv3-knight-head"><b>${h(mode.icon)} ${h(mode.label)}</b><b data-streak></b><b data-score></b><b data-lives></b></div>
        <div class="tv3-knight-prompt"><small>Lượt ${round+1}/${pool.length} · Chữ nào còn thiếu?</small><strong>_ ${h(current.blank)}</strong><button data-listen>🔊 Nghe từ</button></div>
        <div class="tv3-knight-timer">⏱️ <span data-clock>${(ms/1000).toFixed(1)}</span>s</div>
        <div class="tv3-knight-battle" data-battle><div class="tv3-knight-castle">🏰</div>
        ${enemyGates.map((gate,i)=>`<button class="tv3-knight-enemy" data-lane="${i}" data-gate="${h(gate)}" style="left:${centers[i]}%;--fall:${ms}ms"><span>👾</span><strong>${h(gate.toUpperCase())}</strong></button>`).join('')}
        <div class="tv3-knight-danger"></div><div class="tv3-knight-player" data-knight>🧙‍♂️⚔️</div></div>
        <div class="tv3-knight-feedback" data-feedback>Chạm vào quái đúng hoặc dùng nút điều khiển!</div>
        <div class="tv3-knight-controls"><button data-left>◀</button><button data-hit>⚔️ CHÉM</button><button data-right>▶</button><button data-menu>Chọn màn</button></div></div>`;
      updateHud();setLane(Math.min(knightLane,enemyGates.length-1));
      many('[data-gate]').forEach(button=>button.addEventListener('click',()=>{if(!ended){setLane(Number(button.dataset.lane));attack(button.dataset.gate);}}));
      one('[data-listen]')?.addEventListener('click',()=>{if(active)void props.speak?.(current.answer);});
      one('[data-left]')?.addEventListener('click',()=>setLane(knightLane-1));
      one('[data-right]')?.addEventListener('click',()=>setLane(knightLane+1));
      one('[data-hit]')?.addEventListener('click',()=>attack(enemyGates[knightLane]));
      one('[data-menu]')?.addEventListener('click',menu);
      tick=setInterval(()=>{
        if(!active||ended)return;
        const msLeft=Math.max(0,deadline-Date.now());const el=one('[data-clock]');if(el)el.textContent=(msLeft/1000).toFixed(1);
        if(!msLeft)resolve(false,null,true);
      },90);
    }
    function attack(gate){
      if(!active||ended)return;
      const isRight=String(gate).toLocaleLowerCase('vi')===current.correct.toLocaleLowerCase('vi');
      resolve(isRight,gate,false);
    }
    function resolve(isRight,gate,timedOut){
      if(ended||!active)return;
      ended=true;if(tick!==null){clearInterval(tick);tick=null;}
      many('[data-gate]').forEach(button=>{
        button.disabled=true;button.style.animationPlayState='paused';
        if(button.dataset.gate===current.correct)button.classList.add('is-right');
        else if(button.dataset.gate===gate)button.classList.add('is-wrong');
      });
      const fb=one('[data-feedback]');if(isRight){
        streak++;bestStreak=Math.max(streak,bestStreak);
        const speed=Math.max(0,Math.round((deadline-Date.now())/350));score+=10+speed+Math.min(15,(streak-1)*3);
        if(fb){fb.classList.add('good');fb.textContent=`✨ Chính xác! ${current.correct.toUpperCase()} + ${current.blank} = ${current.answer}`;}
      }else {
        lives--;streak=0;
        if(fb){fb.classList.add('bad');fb.textContent=`${timedOut?'⏰ Hết giờ!':'💥 Chưa chính xác!'} Chữ đúng: ${current.correct.toUpperCase()} → ${current.answer}`;}
      }
      updateHud();nextTimeout=setTimeout(()=>{round++;drawRound();},1300);
    }
    function finish(){
      cancel();if(!active)return;
      const won=lives>0&&round>=pool.length;
      host.innerHTML=`<section class="tv3-knight-menu"><div class="tv3-knight-title">${won?'🏆':'🌱'}</div><h3>${won?'Bảo vệ thành công!':'Luyện tập thêm nhé!'}</h3>
        <p>Con hoàn thành ${Math.min(round,pool.length)}/${pool.length} đợt quái · <strong>${score} điểm</strong> · chuỗi đúng cao nhất ${bestStreak}.</p>
        <div class="tv3-knight-controls"><button data-again>⚔️ Chơi lại</button><button data-menu>🗺️ Chọn màn</button><button data-quit>← Quay lại</button></div></section>`;
      one('[data-again]')?.addEventListener('click',()=>start(mode.id));
      one('[data-menu]')?.addEventListener('click',menu);
      one('[data-quit]')?.addEventListener('click',()=>props.onQuit?.());
    }
    function destroy(){active=false;cancel();props.stopAudio?.();host.replaceChildren();host.classList.remove('tv3-knight-root');}
    menu();return Object.freeze({destroy});
  }
  if(!document.getElementById('class3-tv-knight-css')){
    const s=document.createElement('style');s.id='class3-tv-knight-css';s.textContent=`
.tv3-knight-root *{box-sizing:border-box}
.tv3-knight-root button{font:inherit;cursor:pointer}
.tv3-knight-root button:disabled{opacity:.55;cursor:not-allowed}
.tv3-knight-menu{border:1.5px solid #86efac;border-radius:24px;background:linear-gradient(135deg,#eff6ff,#fff,#ecfdf5);padding:24px;text-align:center;color:#475467}
.tv3-knight-title{font-size:68px;line-height:1.15}
.tv3-knight-menu h3{font-size:26px;font-weight:950;color:#047857;margin:10px}
.tv3-knight-menu p{font-weight:750;font-size:18px;line-height:1.55}
.tv3-knight-modes{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:11px;margin:18px auto;max-width:860px}
.tv3-knight-modes button{min-height:125px;border:1.5px solid #c4b5fd;border-radius:17px;background:#faf5ff;color:#6d28d9;display:flex;flex-direction:column;justify-content:center;align-items:center;gap:7px;box-shadow:0 3px 9px rgba(76,29,149,.08)}
.tv3-knight-modes button:hover{border-color:#8b5cf6;box-shadow:0 0 11px rgba(139,92,246,.18)}
.tv3-knight-modes button span{font-size:32px}.tv3-knight-modes button strong{font-size:20px}.tv3-knight-modes button small{font-size:17px}
.tv3-knight-quit,.tv3-knight-controls button{border:1px solid #c4b5fd;border-radius:12px;padding:9px 14px;color:#6d28d9;background:#fff;font-weight:950;min-height:43px}
.tv3-knight-arena{min-height:550px;border:2px solid #7dd3fc;border-radius:24px;position:relative;overflow:hidden;background:linear-gradient(#bde9fd 0%,#e0f2fe 50%,#dcfce7 50%,#bbf7d0 73%,#d6d3d1 73%)}
.tv3-knight-head{position:relative;z-index:5;display:flex;flex-wrap:wrap;justify-content:space-between;gap:7px;padding:11px 12px;font-size:14px;color:#047857}
.tv3-knight-head b{border-radius:99px;background:#ffffffdc;border:1px solid #a7f3d0;padding:6px 10px}
.tv3-knight-prompt{position:relative;z-index:5;margin:8px auto 0;padding:11px 16px;max-width:570px;width:90%;border:2px solid #fcd34d;background:#fffbebee;border-radius:18px;text-align:center;display:flex;align-items:center;flex-direction:column;gap:7px}
.tv3-knight-prompt small{font-weight:900;color:#b45309}.tv3-knight-prompt strong{font-size:30px;color:#be185d}.tv3-knight-prompt button{border:1px solid #f9a8d4;border-radius:9px;background:#fff;color:#be185d;padding:5px 12px;font-weight:900}
.tv3-knight-timer{position:relative;z-index:5;margin:10px;padding:5px 12px;border-radius:99px;background:#fff;width:max-content;font-weight:950;color:#0369a1}
.tv3-knight-battle{position:absolute;inset:0}.tv3-knight-castle{position:absolute;top:48%;left:50%;font-size:105px;opacity:.15;transform:translate(-50%,-50%)}
.tv3-knight-enemy{position:absolute;top:30%;z-index:4;min-width:93px;min-height:99px;padding:10px 11px;transform:translateX(-50%);border:3px solid #fff;border-radius:50%;background:linear-gradient(145deg,#c084fc,#7c3aed);box-shadow:0 8px 20px #1e293b36;color:#fff;display:flex;flex-direction:column;align-items:center;gap:4px;animation:tv3-enemy-fall var(--fall) linear forwards}
.tv3-knight-enemy span{font-size:30px}.tv3-knight-enemy strong{font-size:25px}.tv3-knight-enemy:nth-of-type(2){background:linear-gradient(145deg,#38bdf8,#2563eb)}
.tv3-knight-enemy:nth-of-type(3){background:linear-gradient(145deg,#fbbf24,#ea580c)}
.tv3-knight-enemy.is-right{border-color:#16a34a;box-shadow:0 0 0 5px #86efac}.tv3-knight-enemy.is-wrong{border-color:#be123c;box-shadow:0 0 0 5px #fda4af}
.tv3-knight-danger{position:absolute;top:75%;left:0;right:0;border-top:5px dashed #fb7185;opacity:.75}
.tv3-knight-player{position:absolute;bottom:10%;left:32%;transform:translateX(-50%);font-size:67px;z-index:7;transition:left .18s}
.tv3-knight-feedback{position:absolute;left:50%;bottom:70px;transform:translateX(-50%);z-index:8;max-width:92%;text-align:center;border:1px solid #e2e8f0;border-radius:99px;background:#fffe;padding:7px 13px;color:#475467;font-size:14px;font-weight:900}
.tv3-knight-feedback.good{background:#dcfce7;border-color:#86efac;color:#047857}.tv3-knight-feedback.bad{background:#fff1f2;border-color:#fda4af;color:#be123c}
.tv3-knight-controls{position:relative;z-index:10;display:flex;justify-content:center;gap:8px;margin:13px;flex-wrap:wrap}
.tv3-knight-arena .tv3-knight-controls{position:absolute;bottom:0;width:100%;margin:0;padding:9px}
.tv3-knight-controls button:nth-child(2){background:linear-gradient(90deg,#ec4899,#8b5cf6);color:white;border:0}
@keyframes tv3-enemy-fall{from{top:29%}to{top:68%}}
@media(max-width:767px){.tv3-knight-modes{grid-template-columns:repeat(2,minmax(0,1fr))}.tv3-knight-enemy{min-width:75px;min-height:80px}.tv3-knight-enemy span{font-size:24px}.tv3-knight-enemy strong{font-size:21px}.tv3-knight-player{font-size:51px}.tv3-knight-prompt strong{font-size:24px}.tv3-knight-feedback{font-size:12px;border-radius:13px}}
@media(prefers-reduced-motion:reduce){.tv3-knight-enemy{animation:none!important;top:53%!important}}
`;document.head.appendChild(s);
  }
  window.CLASS3_TV3_GAMES.spellingKnight=Object.freeze({mount});
})();
