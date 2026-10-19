(function () {
  'use strict';
  const ROOT_ID = 'game-play-container';
  const META = {"title": "Đường đua Toán 3", "icon": "🏎️", "skill": "Tổng hợp · Toán 3", "rule": "Chuyển làn xe để đi qua cổng có kết quả đúng trước khi cổng lao tới vạch đích."};
  const state = { level: 1, score: 0, streak: 0, round: 0, total: 10, seconds: 0, clock: null, locked: false, disposers: [] };
  function root(){ return document.getElementById(ROOT_ID); }
  function rand(min,max){ return Math.floor(Math.random()*(max-min+1))+min; }
  function pick(a){ return a[rand(0,a.length-1)]; }
  function shuffle(a){ const b=a.slice(); for(let i=b.length-1;i>0;i--){ const j=rand(0,i); [b[i],b[j]]=[b[j],b[i]]; } return b; }
  function fmt(n){ return Number(n).toLocaleString('vi-VN').replace(/\./g,' '); }
  function esc(v){ return String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
  function clamp(v,a,b){ return Math.max(a,Math.min(b,v)); }
  function addDisposer(fn){ state.disposers.push(fn); }
  function later(fn,ms){ const id=setTimeout(fn,ms); addDisposer(()=>clearTimeout(id)); return id; }
  function every(fn,ms){ const id=setInterval(fn,ms); addDisposer(()=>clearInterval(id)); return id; }
  function on(el,ev,fn,opts){ if(!el)return; el.addEventListener(ev,fn,opts); addDisposer(()=>el.removeEventListener(ev,fn,opts)); }
  function disposeRound(){ while(state.disposers.length){ try{ state.disposers.pop()(); }catch(_){ } } }
  function injectStyle(){
    const id='t3i-style-math-race'; if(document.getElementById(id))return;
    const s=document.createElement('style'); s.id=id; s.textContent=`
      .t3i{width:100%;max-width:1120px;margin:0 auto;font-family:inherit;color:#334155}
      .t3i *{box-sizing:border-box}.t3i button,.t3i input{font:inherit}
      .t3i-head{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:12px;align-items:center;padding:12px 14px;border:2px solid #e9d5ff;border-radius:22px;background:linear-gradient(135deg,#fff,#faf5ff 55%,#fdf2f8)}
      .t3i-title{display:flex;align-items:center;gap:10px}.t3i-title>span{font-size:38px}.t3i-title h3{font-size:22px;line-height:1.1;font-weight:950;color:#6d28d9}.t3i-title p{font-size:13px;font-weight:850;color:#64748b;margin-top:3px}
      .t3i-levels{display:flex;gap:7px;flex-wrap:wrap;margin-top:9px}.t3i-level,.t3i-soft,.t3i-primary{min-height:44px;border-radius:13px;padding:8px 13px;font-weight:950;border:2px solid #ddd6fe;background:#fff;color:#6d28d9;cursor:pointer}
      .t3i-level.on,.t3i-primary{background:linear-gradient(135deg,#ec4899,#7c3aed);border-color:#a855f7;color:#fff}.t3i-soft:hover,.t3i-level:hover{background:#faf5ff}
      .t3i-stats{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px;margin:9px 0}.t3i-stat{background:#fff;border:1px solid #e2e8f0;border-radius:14px;padding:7px;text-align:center;font-size:12px;font-weight:900;color:#64748b}.t3i-stat b{display:block;font-size:18px;color:#7c3aed;margin-top:1px}
      .t3i-card{position:relative;overflow:hidden;border:2px solid #fce7f3;border-radius:24px;background:#fff;padding:14px;min-height:420px}.t3i-skill{text-align:center;font-size:12px;font-weight:950;color:#7c3aed}.t3i-prompt{font-size:clamp(20px,2.7vw,29px);font-weight:950;text-align:center;line-height:1.25;margin:7px auto 9px;max-width:900px}.t3i-sub{text-align:center;color:#64748b;font-size:13px;font-weight:800;margin-top:-3px;margin-bottom:8px}
      .t3i-feedback{min-height:48px;margin:10px auto 0;max-width:900px;border-radius:15px;padding:9px 12px;text-align:center;font-size:14px;font-weight:900;background:#f8fafc;color:#64748b}.t3i-feedback.ok{background:#ecfdf5;color:#047857}.t3i-feedback.no{background:#fff7ed;color:#c2410c}
      .t3i-bottom{display:flex;justify-content:center;gap:8px;flex-wrap:wrap;margin-top:10px}.t3i-progress{height:8px;background:#f1f5f9;border-radius:99px;overflow:hidden;margin-top:10px}.t3i-progress i{display:block;height:100%;background:linear-gradient(90deg,#ec4899,#8b5cf6);transition:width .3s}
      .t3i-pop{animation:t3iPop .32s ease}.t3i-shake{animation:t3iShake .28s ease}.t3i-glow{animation:t3iGlow .7s ease}
      @keyframes t3iPop{0%{transform:scale(.6);opacity:.2}70%{transform:scale(1.08)}100%{transform:scale(1);opacity:1}}@keyframes t3iShake{25%{transform:translateX(-8px)}50%{transform:translateX(7px)}75%{transform:translateX(-4px)}}@keyframes t3iGlow{50%{filter:drop-shadow(0 0 16px #f59e0b);transform:scale(1.04)}}
      /* 12. Race */
      .race-wrap{max-width:760px;margin:8px auto}.road{height:350px;border-radius:22px;overflow:hidden;position:relative;background:#374151;border:7px solid #d1d5db}.road:before{content:'';position:absolute;inset:-120px 0 0;background:repeating-linear-gradient(0deg,transparent 0 44px,#fff 44px 68px,transparent 68px 112px);background-size:6px 112px;background-repeat:repeat-y;left:33%;width:3px;box-shadow:calc(33vw) 0 0 #fff;opacity:.45;animation:roadMove .8s linear infinite}@keyframes roadMove{to{transform:translateY(112px)}}
      .lane-lines{position:absolute;inset:0;display:grid;grid-template-columns:repeat(3,1fr);pointer-events:none}.lane-lines i{border-right:2px dashed rgba(255,255,255,.35)}.lane-lines i:last-child{border:0}.car{position:absolute;bottom:18px;left:calc((var(--lane) + .5) * 33.333%);transform:translateX(-50%);font-size:55px;z-index:5;transition:left .18s}.gates{position:absolute;left:0;right:0;top:0;display:grid;grid-template-columns:repeat(3,1fr);transform:translateY(var(--gy));z-index:4}.gate{margin:0 8px;height:70px;border:5px solid #fbbf24;border-bottom:0;border-radius:18px 18px 0 0;color:#fff;font-size:21px;font-weight:950;display:flex;align-items:center;justify-content:center;background:rgba(15,23,42,.76)}.race-controls{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-top:9px}.race-controls button{height:50px;border:2px solid #cbd5e1;border-radius:14px;background:#fff;font-size:22px;font-weight:950}.lap{font-weight:950;color:#0f766e;text-align:center}
      .finish{text-align:center;padding:30px 10px}.finish .big{font-size:70px}.finish h3{font-size:27px;font-weight:950;color:#6d28d9}.finish p{font-weight:850;color:#64748b;margin:6px}.finish-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;max-width:650px;margin:16px auto}.finish-grid div{border:1px solid #e2e8f0;border-radius:14px;padding:9px;font-weight:850}.finish-grid b{display:block;font-size:22px;color:#7c3aed}
      @media(max-width:700px){.t3i-head{grid-template-columns:1fr}.t3i-stats{grid-template-columns:repeat(2,1fr)}.t3i-card{min-height:390px;padding:10px}.builder,.clock-game,.shop-scene{grid-template-columns:1fr}.build-canvas{height:210px}.clock-face{width:min(290px,82vw)}.clock-face .num{transform:translate(-50%,-50%) rotate(var(--a)) translateY(-118px) rotate(calc(-1 * var(--a)))}.train{transform:scale(.82);transform-origin:center}.train.run{transform:translateX(115%) scale(.82)}.wagon{width:95px}.loco{font-size:58px}.factory-line{grid-template-columns:1fr}.pipe{transform:rotate(90deg)}.data-chart{gap:8px}.bar-col{width:22%}.finish-grid{grid-template-columns:1fr}.hunt-orb{width:74px;height:74px;font-size:16px}.race-controls button{font-size:18px}}
      @media(prefers-reduced-motion:reduce){.t3i *{animation-duration:.001ms!important;animation-iteration-count:1!important;transition-duration:.001ms!important}}
    `; document.head.appendChild(s);
  }
  function setFeedback(msg,kind){ const el=document.getElementById('t3i-feedback'); if(!el)return; el.className='t3i-feedback'+(kind?' '+kind:''); el.textContent=msg; }
  function updateStats(){ const m={round:'t3i-round',score:'t3i-score',streak:'t3i-streak'}; for(const k of Object.keys(m)){ const e=document.getElementById(m[k]); if(e)e.textContent=k==='round'?`${Math.min(state.round+1,state.total)}/${state.total}`:state[k]; } const p=document.getElementById('t3i-progress'); if(p)p.style.width=`${Math.round((state.round/state.total)*100)}%`; }
  function speak(text){ if(typeof speakVietnamese==='function'){ try{speakVietnamese(text,.9);}catch(_){ } } }
  function celebrate(small){ if(typeof confetti==='function'){ try{confetti({particleCount:small?35:95,spread:small?55:80,origin:{y:.7}});}catch(_){ } } }
  function correct(msg){ if(state.locked)return; state.locked=true; state.score+=10; state.streak+=1; updateStats(); setFeedback(msg||'Chính xác! Tuyệt lắm!','ok'); celebrate(true); later(()=>{ state.round+=1; if(state.round>=state.total)finish(); else startRound(); },800); }
  function wrong(msg){ state.streak=0; updateStats(); setFeedback(msg||'Chưa đúng, thử lại nhé!','no'); }
  function renderShell(){
    injectStyle(); const r=root(); if(!r)return;
    r.innerHTML=`<div class="t3i"><section class="t3i-head"><div><div class="t3i-title"><span>${META.icon}</span><div><h3>${META.title}</h3><p>${META.rule}</p></div></div><div class="t3i-levels">${[1,2,3].map(n=>`<button type="button" class="t3i-level ${state.level===n?'on':''}" data-level="${n}">Cấp ${n} · ${n===1?'Cơ bản':n===2?'Vận dụng':'Thử thách'}</button>`).join('')}</div></div><button type="button" id="t3i-speak" class="t3i-soft">🔊 Nghe luật</button></section><div class="t3i-stats"><div class="t3i-stat">Lượt<b id="t3i-round">1/${state.total}</b></div><div class="t3i-stat">Điểm<b id="t3i-score">0</b></div><div class="t3i-stat">Chuỗi đúng<b id="t3i-streak">0</b></div><div class="t3i-stat">Thời gian<b id="t3i-time">00:00</b></div></div><section class="t3i-card"><div class="t3i-skill">${META.skill}</div><div id="t3i-stage"></div><div id="t3i-feedback" class="t3i-feedback">Sẵn sàng nhé!</div><div class="t3i-progress"><i id="t3i-progress" style="width:0%"></i></div><div class="t3i-bottom"><button type="button" id="t3i-new" class="t3i-soft">🔄 Ván mới</button></div></section></div>`;
    document.querySelectorAll('.t3i-level').forEach(b=>on(b,'click',()=>{state.level=Number(b.dataset.level);startGame();}));
    on(document.getElementById('t3i-speak'),'click',()=>speak(`${META.title}. ${META.rule}`));
    on(document.getElementById('t3i-new'),'click',startGame); updateStats();
  }
  function startClock(){ if(state.clock)clearInterval(state.clock); state.seconds=0; state.clock=setInterval(()=>{state.seconds++;const e=document.getElementById('t3i-time');if(e)e.textContent=`${String(Math.floor(state.seconds/60)).padStart(2,'0')}:${String(state.seconds%60).padStart(2,'0')}`;},1000); }
  function stopClock(){ if(state.clock)clearInterval(state.clock); state.clock=null; }
  function finish(){ disposeRound(); stopClock(); const r=root(); if(!r)return; const pct=Math.round(state.score/(state.total*10)*100); r.innerHTML=`<div class="t3i"><section class="t3i-card finish"><div class="big">${pct>=90?'🏆':pct>=70?'🌟':'🐝'}</div><h3>Hoàn thành ${META.title}</h3><p>${pct>=90?'Xuất sắc! Con phản xạ và tính toán rất chắc.':pct>=70?'Rất tốt! Chơi thêm một ván để phá kỷ lục nhé.':'Con đã hoàn thành. Thử lại ở cấp phù hợp để tiến bộ thêm nhé.'}</p><div class="finish-grid"><div>Điểm<b>${state.score}/${state.total*10}</b></div><div>Độ chính xác<b>${pct}%</b></div><div>Thời gian<b>${String(Math.floor(state.seconds/60)).padStart(2,'0')}:${String(state.seconds%60).padStart(2,'0')}</b></div></div><div class="t3i-bottom"><button type="button" id="t3i-replay" class="t3i-primary">🚀 Chơi lại</button><button type="button" id="t3i-hub" class="t3i-soft">🎮 Chọn game khác</button></div></section></div>`; celebrate(false); on(document.getElementById('t3i-replay'),'click',startGame); on(document.getElementById('t3i-hub'),'click',()=>{if(typeof openMiniGameHub==='function')openMiniGameHub();}); }
  function stage(html){ const e=document.getElementById('t3i-stage'); if(e)e.innerHTML=html; }

/* ---------- 12. ĐƯỜNG ĐUA ---------- */
  function raceQuestion(){const pool=['mul','div','expr','measure','money'];const t=pick(pool);let p,a;if(t==='mul'){const x=rand(state.level===1?2:12,state.level===1?9:99),y=rand(2,9);a=x*y;p=`${x} × ${y} = ?`;}else if(t==='div'){const a0=rand(2,9),q=rand(3,state.level===1?12:60);a=q;p=`${a0*q} : ${a0} = ?`;}else if(t==='expr'){const x=rand(10,50),y=rand(2,9),z=rand(2,8);a=x+y*z;p=`${x} + ${y} × ${z} = ?`;}else if(t==='measure'){const x=rand(2,9);a=x*100;p=`${x} m = ? cm`;}else{const price=pick([4000,5000,8000]),q=rand(2,4);a=price*q;p=`${q} món × ${fmt(price)}đ = ?`;}return {p,a};}
  function raceRound(){
    const q=raceQuestion(),answers=shuffle([q.a,q.a+pick([1,5,10,100,1000]),Math.max(1,q.a-pick([1,5,10,100,1000]))]);let lane=1,y=-80,raf=0,last=0;const duration=state.level===1?6500:state.level===2?5200:4200;
    stage(`<div class="t3i-prompt">${esc(q.p)}</div><div class="lap">🏁 Chuyển làn để đi qua cổng đúng</div><div class="race-wrap"><div class="road" id="road"><div class="lane-lines"><i></i><i></i><i></i></div><div class="gates" id="gates" style="--gy:-80px">${answers.map(v=>`<div class="gate">${fmt(v)}</div>`).join('')}</div><div class="car" id="car" style="--lane:1">🏎️</div></div><div class="race-controls"><button id="race-left">⬅️ Trái</button><button id="race-mid">⬆️ Giữa</button><button id="race-right">➡️ Phải</button></div></div>`);
    const gates=document.getElementById('gates'),car=document.getElementById('car');function setLane(n){lane=clamp(n,0,2);car.style.setProperty('--lane',lane);}on(document.getElementById('race-left'),'click',()=>setLane(lane-1));on(document.getElementById('race-mid'),'click',()=>setLane(1));on(document.getElementById('race-right'),'click',()=>setLane(lane+1));
    const key=e=>{if(e.key==='ArrowLeft'){e.preventDefault();setLane(lane-1);}if(e.key==='ArrowRight'){e.preventDefault();setLane(lane+1);}};on(document,'keydown',key);
    function tick(ts){if(state.locked)return;if(!last)last=ts;const t=clamp((ts-last)/duration,0,1);y=-80+t*315;gates.style.setProperty('--gy',`${y}px`);if(t>=1){cancelAnimationFrame(raf);if(answers[lane]===q.a){car.classList.add('t3i-glow');correct('Vượt cổng chính xác! Xe tăng tốc! 🏎️💨');}else{car.classList.add('t3i-shake');wrong(`Cổng đúng là ${fmt(q.a)}. Chặng tiếp theo cố lên!`);state.locked=true;later(()=>{state.round++;if(state.round>=state.total)finish();else startRound();},900);}return;}raf=requestAnimationFrame(tick);}raf=requestAnimationFrame(tick);addDisposer(()=>cancelAnimationFrame(raf));
  }

  function startRound(){ disposeRound(); state.locked=false; updateStats(); setFeedback('Bắt đầu lượt mới!',''); raceRound(); }
  function startGame(){ disposeRound(); stopClock(); state.score=0; state.streak=0; state.round=0; state.locked=false; state.total=10; renderShell(); startClock(); startRound(); }
  function stopGame(){ disposeRound(); stopClock(); }
  window.startMathRaceGame=startGame;
  window.stopMathRaceGame=stopGame;
})();
