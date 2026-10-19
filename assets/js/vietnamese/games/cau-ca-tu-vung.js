/* Epsilon Edu | Tiếng Việt 3 | Câu cá từ vựng | 50+ thử thách riêng.
 * Module độc lập. Dữ liệu tĩnh là PUBLIC; không có API riêng hoặc quyền do client cấp.
 * v2026.10.19: bản làm lại học liệu + gameplay. */
(() => {
  'use strict';
  const ID = 'cau-ca-tu-vung';
  const TITLE = "🎣 Câu cá từ vựng";
  const ICON = '🎣';
  const DATA = [["Tìm từ trái nghĩa với “cao”","thấp","dài","rộng","Cao và thấp là hai đặc điểm trái nghĩa."],["Tìm từ trái nghĩa với “nóng”","lạnh","ấm","rực","Nóng đối lập với lạnh về nhiệt độ."],["Tìm từ trái nghĩa với “vui vẻ”","buồn bã","hào hứng","hân hoan","Vui vẻ và buồn bã chỉ trạng thái cảm xúc trái ngược."],["Tìm từ trái nghĩa với “chăm chỉ”","lười biếng","siêng năng","cần cù","Chăm chỉ đối lập với lười biếng."],["Tìm từ trái nghĩa với “sáng”","tối","trắng","xanh","Sáng trái nghĩa với tối."],["Tìm từ trái nghĩa với “nhanh”","chậm","mau","lẹ","Nhanh và chậm là hai đặc điểm đối lập."],["Tìm từ trái nghĩa với “sạch sẽ”","bẩn thỉu","gọn gàng","ngăn nắp","Sạch sẽ đối lập với bẩn thỉu."],["Tìm từ trái nghĩa với “rộng”","hẹp","dài","sâu","Rộng và hẹp chỉ kích thước trái nghĩa."],["Tìm từ trái nghĩa với “dũng cảm”","nhút nhát","gan dạ","can đảm","Dũng cảm và nhút nhát đối lập về thái độ."],["Tìm từ trái nghĩa với “ồn ào”","yên tĩnh","náo nhiệt","rộn ràng","Ồn ào trái nghĩa với yên tĩnh."],["Tìm từ trái nghĩa với “nặng”","nhẹ","to","dày","Nặng và nhẹ đối lập về khối lượng."],["Tìm từ trái nghĩa với “thật thà”","gian dối","trung thực","ngay thẳng","Thật thà đối lập với gian dối."],["Tìm từ trái nghĩa với “cũ”","mới","xưa","cổ","Cũ và mới là hai đặc điểm trái nghĩa."],["Tìm từ trái nghĩa với “sớm”","muộn","trước","đầu","Sớm đối lập với muộn về thời gian."],["Tìm từ trái nghĩa với “khô”","ướt","ráo","hanh","Khô trái nghĩa với ướt."],["Tìm từ đồng nghĩa với “chăm chỉ”","siêng năng","lười biếng","uể oải","Siêng năng và chăm chỉ cùng nói về chịu khó làm việc."],["Tìm từ đồng nghĩa với “dũng cảm”","can đảm","rụt rè","lo lắng","Can đảm gần nghĩa với dũng cảm."],["Tìm từ đồng nghĩa với “vui sướng”","hạnh phúc","đau buồn","thất vọng","Hạnh phúc gần nghĩa với vui sướng."],["Tìm từ đồng nghĩa với “hiền lành”","hiền hậu","hung dữ","cộc cằn","Hiền hậu và hiền lành cùng nói về tính nết tốt."],["Tìm từ đồng nghĩa với “to lớn”","khổng lồ","bé tí","nhỏ nhắn","Khổng lồ gần nghĩa với rất to lớn."],["Tìm từ đồng nghĩa với “nhanh nhẹn”","lanh lẹ","chậm chạp","lề mề","Lanh lẹ gần nghĩa với nhanh nhẹn."],["Tìm từ đồng nghĩa với “trung thực”","thật thà","gian dối","lừa lọc","Trung thực và thật thà gần nghĩa nhau."],["Tìm từ đồng nghĩa với “yên tĩnh”","im ắng","náo nhiệt","ầm ĩ","Im ắng và yên tĩnh gần nghĩa nhau."],["Tìm từ đồng nghĩa với “xinh đẹp”","đẹp đẽ","xấu xí","lem luốc","Đẹp đẽ gần nghĩa với xinh đẹp."],["Tìm từ đồng nghĩa với “rộng lớn”","bao la","chật hẹp","nhỏ bé","Bao la gần nghĩa với rất rộng lớn."],["Tìm từ đồng nghĩa với “bắt đầu”","khởi đầu","kết thúc","dừng lại","Bắt đầu và khởi đầu gần nghĩa nhau."],["Tìm từ đồng nghĩa với “đoàn kết”","gắn bó","chia rẽ","tranh cãi","Gắn bó diễn tả sự gần gũi và cùng nhau."],["Tìm từ đồng nghĩa với “chăm sóc”","quan tâm","bỏ mặc","thờ ơ","Quan tâm gần nghĩa với chăm sóc trong nhiều ngữ cảnh."],["Tìm từ đồng nghĩa với “ngắm nhìn”","quan sát","nhắm mắt","quay lưng","Quan sát là nhìn kỹ để nhận biết."],["Tìm từ đồng nghĩa với “thân thiện”","cởi mở","lạnh lùng","xa cách","Cởi mở là thái độ gần gũi, thân thiện."],["Tìm từ chỉ âm thanh","rì rào","xanh biếc","tròn xoe","Rì rào gợi tiếng gió hoặc tiếng nước."],["Tìm từ chỉ âm thanh","tí tách","thẳng tắp","ngọt lịm","Tí tách gợi những tiếng nhỏ liên tiếp."],["Tìm từ chỉ âm thanh","ầm ầm","mềm mại","lấp lánh","Ầm ầm gợi âm thanh lớn và liên tục."],["Tìm từ chỉ âm thanh","ríu rít","xanh mướt","rộng rãi","Ríu rít gợi tiếng chim hay tiếng trò chuyện vui."],["Tìm từ chỉ âm thanh","lộp bộp","đỏ rực","thơm ngát","Lộp bộp gợi tiếng vật rơi, tiếng mưa hạt to."],["Tìm từ chỉ màu sắc","xanh biếc","tưới cây","ngôi nhà","Xanh biếc là một sắc xanh."],["Tìm từ chỉ màu sắc","đỏ thắm","học bài","con thuyền","Đỏ thắm là sắc đỏ đậm."],["Tìm từ chỉ màu sắc","vàng óng","chạy bộ","cuốn sách","Vàng óng gợi màu vàng có ánh sáng đẹp."],["Tìm từ chỉ màu sắc","tím ngắt","làm bánh","đàn chim","Tím ngắt chỉ màu tím đậm."],["Tìm từ chỉ màu sắc","trắng tinh","lau bàn","đọc thơ","Trắng tinh là màu trắng sạch, đều."],["Tìm từ chỉ hoạt động","nhảy dây","mát mẻ","ngôi trường","Nhảy dây là một hoạt động vận động."],["Tìm từ chỉ hoạt động","quét sân","hiền lành","cây bàng","Quét sân là một hành động."],["Tìm từ chỉ hoạt động","đọc sách","rực rỡ","cái cặp","Đọc sách là một hoạt động học tập."],["Tìm từ chỉ hoạt động","gieo hạt","thơm ngát","dòng sông","Gieo hạt là một hoạt động trồng trọt."],["Tìm từ chỉ hoạt động","vẽ tranh","trong trẻo","cánh diều","Vẽ tranh là một hoạt động nghệ thuật."],["Tìm từ chỉ đặc điểm","mềm mại","viết chữ","quyển vở","Mềm mại là từ tả đặc điểm."],["Tìm từ chỉ đặc điểm","cao vút","đánh đàn","con mèo","Cao vút là từ tả chiều cao."],["Tìm từ chỉ đặc điểm","trong trẻo","đá bóng","bông hoa","Trong trẻo là từ tả tính chất trong và sáng."],["Tìm từ chỉ đặc điểm","dịu dàng","bơi lội","cây cầu","Dịu dàng là từ tả tính cách, cử chỉ."],["Tìm từ chỉ đặc điểm","bền bỉ","tập hát","chiếc bàn","Bền bỉ là từ tả sự kiên trì."]] ;
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
      question('🎣 Thả câu bắt đúng chú cá mang từ cần tìm!');
      const label=make('p',row[0],'challenge');area.append(label);
      const lake=make('div',undefined,'lake');area.append(lake);
      const fishes=make('div',undefined,'fish-list');lake.append(fishes);
      shuffle(row.slice(1,4)).forEach((value,i)=>{
        const fish=button('',()=>{
          if(locked||fish.disabled)return;
          if(value===row[1]){fish.classList.add('caught','good');fish.querySelector('span').textContent='🏆🐟';complete(true,row[4]);}
          else {fish.classList.add('danger');fish.querySelector('span').textContent='🌊';fish.disabled=true;fail('Con đọc kỹ yêu cầu: tìm từ đúng nghĩa hoặc đúng nhóm từ.');}
        });
        const animal=make('span', ['🐟','🐠','🐡'][i]);fish.append(animal,make('strong',value));fishes.append(fish);
      });
      speak(row[0]);
      baseTools('Từ trái nghĩa có ý nghĩa ngược nhau; từ đồng nghĩa gần nghĩa; từ chỉ âm thanh/màu sắc nêu đúng đặc điểm.','Con cá đúng mang từ “'+row[1]+'”. '+row[4]);
    }
    newMatch();render();
    return Object.freeze({destroy});
  }
  window.CLASS3_TV3_GAMES=window.CLASS3_TV3_GAMES||{};
  window.CLASS3_TV3_GAMES[ID]=Object.freeze({mount,challengeCount:TOTAL});
})();
