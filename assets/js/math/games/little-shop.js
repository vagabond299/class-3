(function () {
  'use strict';
  const ROOT_ID = 'game-play-container';
  const META = {"title": "Siêu thị Toán 3", "icon": "🛒", "skill": "C5 · Toán thực tế", "rule": "Chạm các tờ tiền để bỏ vào khay thanh toán. Chạm tờ tiền trong khay để lấy ra."};
  const state = { level: 1, score: 0, streak: 0, round: 0, total: 8, seconds: 0, clock: null, locked: false, disposers: [] };
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
    const id='t3i-style-little-shop'; if(document.getElementById(id))return;
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
      /* 9. Shop */
      .shop-scene{display:grid;grid-template-columns:minmax(230px,.9fr) minmax(300px,1.2fr);gap:14px;max-width:920px;margin:10px auto}.receipt,.cash-area{border:2px solid #e2e8f0;border-radius:20px;padding:13px;background:#fff}.items{display:grid;gap:8px}.item{display:flex;justify-content:space-between;gap:8px;border-bottom:1px dashed #cbd5e1;padding:7px 2px;font-weight:900}.cash-tray{min-height:100px;border:3px dashed #c4b5fd;border-radius:18px;background:#faf5ff;padding:10px;display:flex;gap:7px;flex-wrap:wrap;align-content:flex-start}.money-bank{display:flex;gap:7px;flex-wrap:wrap;margin-top:10px}.note{min-width:92px;height:47px;border:2px solid #15803d;border-radius:9px;background:#dcfce7;color:#166534;font-weight:950;cursor:pointer;position:relative;overflow:hidden}.note:before{content:'₫';position:absolute;left:6px;top:2px;opacity:.35;font-size:25px}.cash-tray .note{animation:cashDrop .3s ease}@keyframes cashDrop{from{transform:translateY(-15px) rotate(-6deg);opacity:.2}}
      .shop-total{text-align:center;font-size:25px;font-weight:950;color:#b45309;margin:8px}
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

/* ---------- 9. SIÊU THỊ ---------- */
  function shopRound(){
    const notes=[1000,2000,5000,10000,20000,50000];let target,items=[],mode='pay';
    if(state.level===1){const p=pick([4000,5000,6000,8000,10000,12000]),q=rand(1,3);target=p*q;items=[['📒 Vở',q,p]];}
    else if(state.level===2){const p1=pick([5000,8000,12000]),p2=pick([3000,6000,9000]),q1=rand(1,3),q2=rand(1,2);target=p1*q1+p2*q2;items=[['✏️ Bút',q1,p1],['📐 Thước',q2,p2]];}
    else{mode='change';const price=pick([12000,15000,18000,22000,27000,32000]);const paid=price<=18000?20000:50000;target=paid-price;items=[['🧸 Món hàng',1,price],['💵 Khách đưa',1,paid]];}
    let selected=[];
    stage(`<div class="t3i-prompt">${mode==='pay'?`Hãy trả đúng <b>${fmt(target)} đồng</b>`:`Hãy trả lại đúng <b>${fmt(target)} đồng</b> tiền thừa`}</div><div class="shop-scene"><div class="receipt"><h4 style="font-weight:950;text-align:center;margin-bottom:6px">🧾 HÓA ĐƠN</h4><div class="items">${items.map(x=>`<div class="item"><span>${x[0]} ${x[1]>1?'× '+x[1]:''}</span><b>${fmt(x[2]*x[1])}đ</b></div>`).join('')}</div><div class="shop-total">Mục tiêu: ${fmt(target)}đ</div></div><div class="cash-area"><h4 style="font-weight:950">Khay thanh toán: <span id="cash-sum">0đ</span></h4><div class="cash-tray" id="cash-tray"><span style="color:#94a3b8;font-weight:850">Chạm tờ tiền bên dưới để thêm vào</span></div><div class="money-bank">${notes.map(v=>`<button type="button" class="note" data-note="${v}">${fmt(v)}đ</button>`).join('')}</div><div class="t3i-bottom"><button id="cash-check" class="t3i-primary">💰 Thanh toán</button><button id="cash-clear" class="t3i-soft">Xóa khay</button></div></div></div>`);
    const tray=document.getElementById('cash-tray'),sum=document.getElementById('cash-sum');
    function draw(){const total=selected.reduce((a,b)=>a+b,0);sum.textContent=`${fmt(total)}đ`;tray.innerHTML=selected.length?selected.map((v,i)=>`<button type="button" class="note" data-remove="${i}">${fmt(v)}đ</button>`).join(''):'<span style="color:#94a3b8;font-weight:850">Khay đang trống</span>';tray.querySelectorAll('[data-remove]').forEach(b=>on(b,'click',()=>{selected.splice(Number(b.dataset.remove),1);draw();}));}
    document.querySelectorAll('[data-note]').forEach(b=>on(b,'click',()=>{if(selected.length<12){selected.push(Number(b.dataset.note));draw();}}));on(document.getElementById('cash-clear'),'click',()=>{selected=[];draw();});on(document.getElementById('cash-check'),'click',()=>{const total=selected.reduce((a,b)=>a+b,0);if(total===target){tray.classList.add('t3i-glow');correct('Thanh toán chính xác! 🛒💵');}else wrong(total<target?`Còn thiếu ${fmt(target-total)}đ.`:`Đang thừa ${fmt(total-target)}đ. Bớt tiền khỏi khay nhé.`);});draw();
  }

  function startRound(){ disposeRound(); state.locked=false; updateStats(); setFeedback('Bắt đầu lượt mới!',''); shopRound(); }
  function startGame(){ disposeRound(); stopClock(); state.score=0; state.streak=0; state.round=0; state.locked=false; state.total=8; renderShell(); startClock(); startRound(); }
  function stopGame(){ disposeRound(); stopClock(); }
  window.startLittleShopGame=startGame;
  window.stopLittleShopGame=stopGame;
})();
