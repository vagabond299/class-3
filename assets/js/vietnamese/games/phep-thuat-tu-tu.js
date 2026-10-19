/* Epsilon Edu | Tiếng Việt 3 | Phép thuật Tu từ | 50+ thử thách riêng.
 * Module độc lập. Dữ liệu tĩnh là PUBLIC; không có API riêng hoặc quyền do client cấp.
 * v2026.10.19: bản làm lại học liệu + gameplay. */
(() => {
  'use strict';
  const ID = 'phep-thuat-tu-tu';
  const TITLE = "🎭 Phép thuật Tu từ";
  const ICON = '🎭';
  const DATA = [["Mặt trời đỏ như quả cầu lửa.","So sánh","Từ “như” đối chiếu mặt trời với quả cầu lửa."],["Tiếng suối trong như tiếng hát.","So sánh","Tiếng suối được so sánh với tiếng hát."],["Cánh đồng vàng như tấm thảm.","So sánh","Cánh đồng được ví với tấm thảm vàng."],["Mây trắng tựa bông gòn.","So sánh","Mây được ví với bông gòn mềm và trắng."],["Đôi mắt bé sáng như sao.","So sánh","Ánh mắt được so sánh với ánh sao."],["Mái tóc bà trắng như cước.","So sánh","Màu tóc được ví với sợi cước trắng."],["Dòng sông uốn lượn như dải lụa.","So sánh","Dáng sông được ví với dải lụa mềm."],["Lá bàng đỏ như ngọn lửa.","So sánh","Màu lá được so sánh với ngọn lửa."],["Mặt hồ phẳng như tấm gương.","So sánh","Mặt hồ yên ả được so sánh với gương."],["Tiếng mưa rơi tựa tiếng đàn.","So sánh","Âm thanh mưa được ví với tiếng đàn."],["Bàn tay mẹ ấm như nắng sớm.","So sánh","Hơi ấm của tay mẹ được ví với nắng sớm."],["Con đường quanh co như nét vẽ.","So sánh","Hình dáng con đường được ví với nét vẽ."],["Hoa phượng đỏ rực như đốm lửa.","So sánh","Hoa phượng được ví với đốm lửa đỏ."],["Đám mây bồng bềnh như chiếc gối.","So sánh","Dáng mây được ví với chiếc gối mềm."],["Cánh diều bay như cánh chim.","So sánh","Cách bay của diều được so sánh với chim."],["Giọt sương long lanh như hạt ngọc.","So sánh","Giọt sương được ví với hạt ngọc."],["Vầng trăng tròn như chiếc đĩa bạc.","So sánh","Vầng trăng tròn được ví với chiếc đĩa."],["Hàng tre thẳng như những người lính.","So sánh","Dáng tre được so sánh với đội hình người lính."],["Bãi cát trắng như đường bột.","So sánh","Màu cát được ví với màu đường bột."],["Sóng biển cuộn trào như những dải lụa.","So sánh","Dáng sóng được ví với những dải lụa."],["Tiếng cười giòn như tiếng chuông.","So sánh","Âm thanh tiếng cười được ví với tiếng chuông."],["Búp măng nhọn như chiếc bút chì.","So sánh","Hình dáng búp măng được ví với đầu bút chì."],["Cánh hoa mỏng tựa tờ giấy.","So sánh","Độ mỏng của hoa được so sánh với giấy."],["Bầu trời xanh như tấm lụa lớn.","So sánh","Màu trời được ví với tấm lụa xanh."],["Đường làng mềm mại như dải khăn.","So sánh","Đường làng được ví với dải khăn mềm."],["Chị gió vuốt ve cành lá.","Nhân hóa","Gió được gọi là chị và có hành động vuốt ve."],["Ông trăng mỉm cười với bé.","Nhân hóa","Trăng được gọi là ông và biết mỉm cười."],["Bác đồng hồ chăm chỉ làm việc.","Nhân hóa","Đồng hồ được gọi là bác và có tính chăm chỉ."],["Hàng cây dang tay đón gió.","Nhân hóa","Cây được tả như người biết dang tay."],["Những chú sóng nô đùa ngoài biển.","Nhân hóa","Sóng được gọi là chú và biết nô đùa."],["Bé nắng chạy nhảy trên sân.","Nhân hóa","Nắng được gọi là bé và biết chạy nhảy."],["Cô mưa gõ cửa tí tách.","Nhân hóa","Mưa được gọi là cô và biết gõ cửa."],["Chú bút nằm nghỉ trong hộp.","Nhân hóa","Bút được gọi là chú và biết nằm nghỉ."],["Cây bàng giơ tay vẫy chào.","Nhân hóa","Cây được tả như người vẫy chào."],["Mặt trời thức dậy sau dãy núi.","Nhân hóa","Mặt trời được tả như người thức dậy."],["Những bông hoa nghiêng đầu trò chuyện.","Nhân hóa","Hoa được tả như người đang trò chuyện."],["Chú dế kéo đàn dưới bụi cỏ.","Nhân hóa","Dế được tả như người nghệ sĩ kéo đàn."],["Lá non reo vui trong gió.","Nhân hóa","Lá được tả như người biết reo vui."],["Đàn kiến cần mẫn xây nhà.","Nhân hóa","Kiến được tả như người làm việc xây nhà."],["Bác trống trường gọi học sinh vào lớp.","Nhân hóa","Trống được gọi là bác và biết gọi học sinh."],["Cô suối hát khúc ca trong trẻo.","Nhân hóa","Suối được gọi là cô và biết hát."],["Ngọn đèn thức cùng em học bài.","Nhân hóa","Đèn được tả như người thức cùng em."],["Đám mây lười biếng nằm trên đỉnh núi.","Nhân hóa","Mây được tả có tính lười biếng và biết nằm nghỉ."],["Bé hoa hướng dương mỉm cười.","Nhân hóa","Hoa được gọi là bé và biết mỉm cười."],["Chú gió thì thầm bên cửa.","Nhân hóa","Gió được tả như người biết thì thầm."],["Những bông lúa cúi đầu chào gió.","Nhân hóa","Lúa được tả như người biết cúi chào."],["Chị sông ôm lấy xóm làng.","Nhân hóa","Sông được gọi là chị và biết ôm."],["Bác núi trầm ngâm nhìn mây.","Nhân hóa","Núi được gọi là bác và biết trầm ngâm."],["Cậu bút chì nhảy múa trên trang giấy.","Nhân hóa","Bút chì được gọi là cậu và biết nhảy múa."],["Bác gió rong chơi khắp cánh đồng.","Nhân hóa","Gió được gọi là bác và có hành động rong chơi."]] ;
  const TOTAL = DATA.length;
  const MATCH_SIZE = 10;
  const shuffle = input => {
    const a=input.slice();
    for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}
    return a;
  };
  const styleText = `
  .ee3g{box-sizing:border-box;width:100%;max-width:1060px;margin:14px auto;padding:24px;background:linear-gradient(130deg,#fff8fe 0%,#f2f9ff 100%);border:1px solid #dfd0fa;border-radius:24px;box-shadow:0 12px 28px rgba(100,70,140,.06);font-family:inherit;color:#51345f}
  .ee3g *{box-sizing:border-box}.ee3g .top{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap}
  .ee3g h3{font-size:26px;color:#752a8b;margin:0;line-height:1.35;font-weight:900}
  .ee3g h4{font-size:23px;color:#703083;margin:10px 0;line-height:1.45}
  .ee3g .eyebrow{color:#704d85;font-size:16px;font-weight:800;letter-spacing:.01em}
  .ee3g .stats{margin:14px 0 8px;display:flex;gap:8px 18px;flex-wrap:wrap;font-size:18px;font-weight:850}
  .ee3g .meter{height:11px;border-radius:20px;background:#e9ddf2;overflow:hidden;margin:9px 0 22px}
  .ee3g .meter>span{display:block;height:100%;background:linear-gradient(90deg,#f472b6,#8b5cf6);transition:width .2s}
  .ee3g p{line-height:1.6;font-size:19px;margin:12px 0}
  .ee3g .challenge{font-size:24px;line-height:1.55;font-weight:850;color:#642c7b;white-space:pre-line;margin:10px 0 22px}
  .ee3g .panel{background:#fff;border:1px solid #e8d7f5;border-radius:17px;padding:20px;margin:14px 0}
  .ee3g .card{background:linear-gradient(135deg,#fff,#f8f3ff);border:2px solid #ddc7f7;border-radius:18px;padding:16px}
  .ee3g .toolbar,.ee3g .options,.ee3g .chips{display:flex;flex-wrap:wrap;gap:11px;align-items:center;justify-content:center;margin:16px 0}
  .ee3g button{cursor:pointer;font-family:inherit;font-size:19px;font-weight:800;line-height:1.4;color:#642887;border:1.5px solid #c9b1ef;background:#fff;border-radius:15px;padding:12px 16px;min-height:49px;touch-action:manipulation;transition:background .16s,transform .16s,border-color .16s}
  .ee3g button:hover:not(:disabled){background:#f3e8ff;transform:translateY(-2px)}
  .ee3g button:focus-visible{outline:3px solid #d946ef;outline-offset:3px}
  .ee3g button:disabled{opacity:.55;cursor:default;transform:none}
  .ee3g .primary{background:linear-gradient(108deg,#ec4899,#8557f5);color:#fff;border-color:transparent}
  .ee3g .primary:hover:not(:disabled){background:linear-gradient(108deg,#db2777,#7c3aed)}
  .ee3g .selected{background:#e8d6ff;border-color:#a855f7}
  .ee3g .danger{background:#fff4ec;border-color:#fb923c;color:#a64c14}
  .ee3g .good{background:#e6faf1!important;border-color:#34b983!important;color:#087453!important}
  .ee3g .answers{display:flex;flex-wrap:wrap;justify-content:center;align-items:stretch;gap:12px;margin:20px 0}
  .ee3g .answers button{flex:1 1 160px;max-width:100%;white-space:normal;min-height:64px}
  .ee3g .feedback{font-size:19px;font-weight:800;line-height:1.6;padding:12px 16px;min-height:44px;border-radius:12px;color:#15764e;white-space:pre-line}
  .ee3g .feedback.bad{background:#fff3e6;color:#a44b1b}.ee3g .feedback.good{background:#e6faf1;color:#137151}
  .ee3g .lesson{font-size:18px;color:#755980;line-height:1.6}
  .ee3g .slot{min-height:74px;padding:15px;border:2px dashed #a78bfa;border-radius:15px;background:#faf7ff;display:flex;align-items:center;justify-content:center;gap:9px;flex-wrap:wrap;font-size:22px;font-weight:850;color:#682f7d}
  .ee3g .slot.active{background:#f5eaff;border-color:#7c3aed}
  .ee3g .zone-row{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin:18px 0}
  .ee3g .chest-row{grid-template-columns:repeat(2,minmax(0,1fr))}.ee3g .zone{border:2px dashed #bda5e4;border-radius:20px;min-height:118px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:9px;background:rgba(255,255,255,.83);padding:14px;text-align:center;font-size:20px;font-weight:900;cursor:pointer}
  .ee3g .zone:focus-visible{outline:3px solid #d946ef}.ee3g .zone.over{background:#ede1ff;border-color:#8b5cf6}
  .ee3g .piece{border:2px solid #c4b5fd;background:#fff;border-radius:15px;padding:12px 18px;user-select:none;touch-action:manipulation;font-size:21px;font-weight:900}
  .ee3g .passage{font-size:21px;line-height:1.9;letter-spacing:.005em;color:#3e405f;background:#fff;padding:23px;border-left:5px solid #c084fc;border-radius:14px}
  .ee3g mark{background:#fde68a;color:#623d11;border-radius:4px;padding:0 2px}
  .ee3g .speech{padding:17px 20px;background:#fff;border:2px solid #d3bdf4;border-radius:18px;font-size:21px;line-height:1.6}
  .ee3g .speech .speaker{display:block;font-size:16px;font-weight:850;color:#9450b0;margin-bottom:6px}
  .ee3g .dialog-options{display:grid;grid-template-columns:1fr;gap:12px;margin:18px 0}
  .ee3g .dialog-options button{text-align:left;font-size:20px;padding:16px 20px;border-radius:20px 20px 20px 5px}
  .ee3g .lake{position:relative;overflow:hidden;border-radius:22px;padding:20px 15px 35px;background:linear-gradient(#ddf7ff 0%,#b6eaff 38%,#4ec5dd 38%,#d4f5fc 100%);border:2px solid #b5e1ed;margin:20px 0}
  .ee3g .lake:before{content:'🎣';font-size:42px;display:block;text-align:left;margin-bottom:5px}
  .ee3g .fish-list{display:flex;flex-wrap:wrap;justify-content:space-around;gap:16px;align-items:center;min-height:165px}
  .ee3g .fish-list button{border-radius:60px;background:rgba(255,255,255,.9);box-shadow:0 8px 0 rgba(13,124,158,.16);min-width:180px;max-width:290px;padding:14px}
  .ee3g .fish-list button span:first-child{animation:ee3-swim 2.6s ease-in-out infinite}.ee3g .fish-list button:nth-child(2) span:first-child{animation-delay:-.8s}.ee3g .fish-list button:nth-child(3) span:first-child{animation-delay:-1.4s}
  .ee3g .fish-list button span{display:block;font-size:32px}.ee3g .fish-list button.caught span:first-child{animation:none}.ee3g .fish-list .caught{background:#d1fae5;border-color:#10b981}
  .ee3g .maze-board{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:7px;max-width:460px;margin:20px auto;padding:14px;background:#eef8f4;border:3px solid #b9e5d8;border-radius:22px}.ee3g .maze-board div{aspect-ratio:1;display:flex;align-items:center;justify-content:center;font-size:27px;background:#fff;border-radius:12px;border:1px solid #ddd4ef}.ee3g .maze-board .wall{background:#d9f5e4}.ee3g .maze-board .corridor{background:#fff8e4;color:#c9b087}.ee3g .maze-board .cleared{background:#bbf7d0;color:#15803d;font-weight:900}.ee3g .maze-board .player{background:#fce7f3;border:3px solid #d946ef;box-shadow:0 0 0 3px #fbcfe8}
  .ee3g .maze-path{display:grid;grid-template-columns:repeat(10,minmax(0,1fr));gap:5px;margin:20px 0;padding:12px;background:#f3e8ff;border:1px solid #dfcafa;border-radius:16px}
  .ee3g .maze-path span{display:flex;align-items:center;justify-content:center;aspect-ratio:1/1;background:#fff;border-radius:9px;border:1px solid #d8c7ed;font-size:19px}
  .ee3g .maze-path .here{background:#fce7f3;border:2px solid #d946ef}.ee3g .maze-path .passed{background:#d1fae5}
  .ee3g .doors{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px;margin:16px 0}
  .ee3g .doors button{background:linear-gradient(135deg,#f3e8ff,#fff);border-width:3px;min-height:115px;font-size:19px}
  .ee3g .doors .door-emoji{display:block;font-size:33px;margin-bottom:6px}
  .ee3g .spellcard{max-width:590px;margin:14px auto;min-height:142px;display:flex;align-items:center;justify-content:center;text-align:center;padding:21px 26px;border:2px solid #c084fc;border-radius:21px;background:linear-gradient(125deg,#faf5ff,#fff7ed);font-size:23px;font-weight:850;line-height:1.55;color:#642c7b;cursor:pointer;user-select:none}
  .ee3g .spellcard.flipped{background:#fff;border-color:#a78bfa}
  .ee3g .spellzones{display:grid;grid-template-columns:1fr 1fr;gap:14px}
  .ee3g .spellzones button{min-height:110px;padding:15px;border:2px dashed #b794df;background:#fff7ff;font-size:21px}
  .ee3g .honey{display:grid;grid-template-columns:repeat(3, minmax(0,1fr));gap:12px;margin:22px 0}
  .ee3g .honey button{min-height:106px;background:linear-gradient(135deg,#fff7dc,#fbe9f8);border:2px solid #f2c966;clip-path:polygon(14% 0%,86% 0%,100% 50%,86% 100%,14% 100%,0% 50%);border-radius:0;padding:13px 18px}
  .ee3g .countdown{font-size:21px;font-weight:950;text-align:center;color:#7751ac}
  .ee3g .train-track{background:repeating-linear-gradient(90deg,#e9e2f1 0 5px,transparent 5px 45px),linear-gradient(#eee3ee,#eee3ee);background-size:100% 10px,100% 3px;background-position:center bottom 10px,center bottom 13px;background-repeat:no-repeat;padding:13px 10px 26px;border-radius:17px}
  .ee3g .train-track .wagon{display:inline-flex;align-items:center;background:#fff;border:2px solid #bd9bec;border-radius:15px;padding:10px 14px;font-size:21px;font-weight:900;min-height:58px;margin:5px}
  @keyframes ee3-swim{0%,100%{transform:translateY(-4px)}50%{transform:translateY(8px)}}
  @media(max-width:640px){.ee3g{padding:14px;border-radius:18px}.ee3g h3{font-size:23px}.ee3g h4{font-size:21px}.ee3g .challenge{font-size:21px}.ee3g .panel{padding:14px}.ee3g button{font-size:18px;padding:12px}.ee3g .passage{font-size:19px;padding:16px}.ee3g .zone-row,.ee3g .chest-row,.ee3g .honey,.ee3g .doors{grid-template-columns:1fr}.ee3g .zone{min-height:72px}.ee3g .honey button{clip-path:none;border-radius:15px;min-height:62px}.ee3g .maze-board{gap:4px;padding:7px}.ee3g .maze-board div{font-size:22px}.ee3g .maze-path{gap:2px;padding:6px}.ee3g .maze-path span{font-size:13px}.ee3g .spellzones{gap:7px}.ee3g .spellzones button{font-size:18px}}
  @media(prefers-reduced-motion:reduce){.ee3g button,.ee3g .fish-list button span:first-child{transition:none;animation:none}}
  `;
  const make=(tag,txt,cls)=>{const n=document.createElement(tag);if(txt!==undefined)n.textContent=txt;if(cls)n.className=cls;return n;};
  const button=(label,fn,cls)=>{const n=make('button',label,cls);n.type='button';n.addEventListener('click',fn);return n;};
  function mount(p){
    if(!p || !p.host || typeof p.onQuit!=='function')throw new Error('Mini game thiếu vùng hiển thị hoặc điều hướng.');
    const host=p.host;
    let alive=true,locked=false,index=0,score=0,wrong=0,items=[],pool=shuffle(DATA),timers=[],untimed=false;
    const style=document.createElement('style');style.textContent=styleText;document.head.appendChild(style);
    const timersClear=()=>{for(const t of timers){clearTimeout(t);clearInterval(t);}timers=[];};
    const later=(cb,ms)=>{const id=setTimeout(cb,ms);timers.push(id);return id;};
    function cleanView(){timersClear();try{p.stopAudio?.();}catch(_){}host.replaceChildren();}
    function destroy(){if(!alive)return;alive=false;cleanView();style.remove();}
    const newMatch=()=>{if(pool.length<MATCH_SIZE)pool=shuffle(DATA);items=pool.splice(0,MATCH_SIZE);index=0;score=0;};
    const quit=()=>{if(alive)p.onQuit();};
    function finish(){
      if(!alive)return;cleanView();
      const root=make('section',undefined,'ee3g');
      const title=make('h3','🏆 Hoàn thành một lượt chơi!');
      const text=make('p',`Bé được ${score}/${MATCH_SIZE} sao. Đã luyện ${TOTAL-pool.length} / ${TOTAL} thử thách của kho hiện tại.`);
      const explain=make('p','Hãy luyện tiếp 10 thử thách mới hoặc chơi lại để nhớ kiến thức lâu hơn.','lesson');
      root.append(title,text,explain,button('🎲 Lượt mới – 10 thử thách',()=>{newMatch();render();},'primary'),document.createTextNode(' '),button('← Trở về Mini games',quit));
      host.appendChild(root);
    }
    function render(){
      if(!alive)return;
      if(index>=items.length){finish();return;}
      cleanView();locked=false;wrong=0;
      const row=items[index];
      const root=make('section',undefined,'ee3g');host.appendChild(root);
      const top=make('div',undefined,'top');top.append(make('h3',TITLE),button('← Trở về',quit,'ee3g-nav'));root.appendChild(top);
      const stats=make('div',undefined,'stats');const sc=make('span',`⭐ ${score} điểm`);stats.append(sc,make('span',`Lượt ${index+1}/${MATCH_SIZE}`),make('span',`Kho ${TOTAL} thử thách · còn ${pool.length} chưa gặp`));root.append(stats);
      const meter=make('div',undefined,'meter');const fill=make('span');fill.style.width=(index/MATCH_SIZE*100)+'%';meter.append(fill);root.append(meter);
      const area=make('div',undefined,'activity');root.append(area);
      const msg=make('div','', 'feedback');msg.setAttribute('role','status');msg.setAttribute('aria-live','polite');root.append(msg);
      const tools=make('div',undefined,'toolbar');root.append(tools);
      let explanation='';
      let hintText='Con xem kỹ yêu cầu rồi thử thêm một lần nhé!';
      const setHint=t=>{hintText=t;};
      const clue=()=>{if(locked)return;wrong++;msg.className='feedback bad';msg.textContent='💡 '+hintText;};
      function fail(t){if(locked)return;wrong++;msg.className='feedback bad';msg.textContent='🌱 Chưa chính xác. '+(t||hintText)+' Con thử lại nhé!';}
      function complete(correct,description){
        if(locked)return;
        locked=true;timersClear();try{p.stopAudio?.();}catch(_){}
        if(correct&&wrong===0)score++;
        sc.textContent=`⭐ ${score} điểm`;
        msg.className='feedback '+(correct?'good':'bad');
        msg.textContent=(correct?(wrong===0?'🌟 Chính xác! ':'🌱 Con đã tự sửa đúng rồi! '):'📖 Cùng ghi nhớ nhé! ')+(description||explanation);
        root.querySelectorAll('button').forEach(b=>{if(!b.classList.contains('ee3g-nav'))b.disabled=true;});
        tools.replaceChildren(button(index===MATCH_SIZE-1?'Xem kết quả 🏆':'Tiếp theo →',()=>{index++;render();},'primary ee3g-nav'));
      }
      const baseTools=(hint,answer)=>{
        hintText=hint;
        tools.append(button('💡 Gợi ý',clue),button('📖 Xem lời giải',()=>complete(false,answer)));
      };
      function speak(text){if(typeof p.speak==='function'){
        const speakBtn=button('🔊 Nghe đề',()=>{if(!locked)Promise.resolve(p.speak(text)).catch(()=>{});});
        speakBtn.classList.add('ee3g-nav');tools.prepend(speakBtn);
      }}
      const question=(txt)=>{const n=make('div',txt,'challenge');area.appendChild(n);return n;};
      const opt=(list,correct,why,{cls='',onRight=null,onWrong=null}={})=>{
        const wrapper=make('div',undefined,cls||'answers');area.appendChild(wrapper);
        shuffle(list).forEach(value=>{
          const b=button(value,()=>{
            if(locked||b.disabled)return;
            if(value===correct){b.classList.add('good');if(onRight)onRight(b);complete(true,why);}
            else{b.classList.add('danger');b.disabled=true;if(onWrong)onWrong(b);fail();}
          });wrapper.appendChild(b);
        });return wrapper;
      };
      function drag(buttonNode,payload){buttonNode.draggable=true;buttonNode.addEventListener('dragstart',e=>{if(locked)return;e.dataTransfer.setData('text/plain',payload);e.dataTransfer.effectAllowed='move';});}
      function drop(zone,callback){zone.addEventListener('dragover',e=>{if(locked)return;e.preventDefault();zone.classList.add('over');});zone.addEventListener('dragleave',()=>zone.classList.remove('over'));zone.addEventListener('drop',e=>{if(locked)return;e.preventDefault();zone.classList.remove('over');callback(e.dataTransfer.getData('text/plain'));});}
      // Each game's distinct activity renderer is inserted here by the offline content build.
      question('🎭 Lật thẻ phép thuật rồi ghép với đúng cuốn sách!');
      const spell=make('div','🎴 Chạm để lật thẻ bí mật','spellcard');spell.tabIndex=0;spell.setAttribute('role','button');spell.setAttribute('aria-label','Lật thẻ câu văn');
      area.append(spell);
      let flipped=false;
      const open=()=>{if(locked||flipped)return;flipped=true;spell.classList.add('flipped');spell.textContent='📜 '+row[0];};
      spell.addEventListener('click',open);
      spell.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open();}});
      const zones=make('div',undefined,'spellzones');area.append(zones);
      [['So sánh','⚖️'],['Nhân hóa','🪄']].forEach(([label,emoji])=>{
        const book=button(emoji+'  '+label,()=>choose(label,book),'zone');zones.append(book);
        function choose(value,node){
          if(!flipped){msg.className='feedback bad';msg.textContent='💡 Bé hãy lật thẻ để đọc câu trước nhé!';return;}
          if(locked)return;
          if(value===row[1]){node.classList.add('good');complete(true,row[2]);}
          else {node.disabled=true;node.classList.add('danger');fail('Con tìm dấu hiệu ví von hoặc cách gọi/tả sự vật như con người nhé.');}
        }
        drop(book,s=>{if(s==='spell')choose(label,book);});
      });
      drag(spell,'spell');
      speak('Phân biệt so sánh và nhân hóa. '+row[0]);
      baseTools('So sánh đối chiếu sự vật (thường có “như”, “tựa”); nhân hóa gọi, tả vật như người.',row[1]+': '+row[2]);
    }
    newMatch();render();
    return Object.freeze({destroy});
  }
  window.CLASS3_TV3_GAMES=window.CLASS3_TV3_GAMES||{};
  window.CLASS3_TV3_GAMES[ID]=Object.freeze({mount,challengeCount:TOTAL});
})();
