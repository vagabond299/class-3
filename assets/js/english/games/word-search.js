/* Mini Game 01 — Word Search: independent game implementation for Class 3 English. */
(() => {
  'use strict';
  window.CLASS3_ENGLISH_MINIGAMES.register('word-search',c=>{
    const {esc,shuffle,choosePool,getWordsByLength,emit,roundBase,showRound,finish}=c;
    const DIRS=[[0,1],[1,0],[1,1],[-1,1],[0,-1],[-1,0],[-1,-1],[1,-1]];
    let s,pointer=null;
    const bind=()=>{s=c.s;pointer=null;};
    function makeWordBoard(candidates,size,count,dirs){
      const grid=Array.from({length:size},()=>Array(size).fill('')),placements=[],placedSet=new Set();
      for(const word of shuffle(candidates)){
        if(placements.length>=count)break;
        if(!word||placedSet.has(word)||word.length>size)continue;
        let placed=false;
        for(let attempt=0;attempt<180&&!placed;attempt++){
          const [dr,dc]=dirs[Math.floor(Math.random()*dirs.length)],r=Math.floor(Math.random()*size),cc=Math.floor(Math.random()*size);
          const er=r+dr*(word.length-1),ec=cc+dc*(word.length-1);
          if(er<0||ec<0||er>=size||ec>=size)continue;
          let ok=true;for(let j=0;j<word.length;j++){const cur=grid[r+dr*j][cc+dc*j];if(cur&&cur!==word[j]){ok=false;break;}}
          if(!ok)continue;
          for(let j=0;j<word.length;j++)grid[r+dr*j][cc+dc*j]=word[j];
          placements.push({word,r,c:cc,er,ec,dr,dc});placedSet.add(word);placed=true;
        }
      }
      for(const row of grid)for(let i=0;i<row.length;i++)if(!row[i])row[i]=String.fromCharCode(65+Math.floor(Math.random()*26));
      return {size,grid,placements,foundCells:new Set()};
    }
    function begin(level,requested,source){
      const size=c.LEVELS['word-search'][level][1],vocab=getWordsByLength(3,Math.min(size-1,level===0?6:8),source);
      s.wordPool=choosePool(vocab,Math.max(requested*2,20));
      if(s.wordPool.length<requested){emit(`Nhóm này chỉ có ${s.wordPool.length} từ phù hợp. Bé hãy chọn nhóm khác hoặc mức Dễ.`);c.showIntro();return false;}
      // Retry with a fresh layout if random collisions block placement.
      for(let attempt=0;attempt<7;attempt++){
        s.board=makeWordBoard(s.wordPool.map(v=>v.word.toUpperCase()),size,requested,level===0?DIRS.slice(0,2):DIRS);
        if(s.board.placements.length===requested)break;
      }
      if(s.board.placements.length!==requested){emit('Không dựng được bảng chữ. Bé chọn lại độ khó nhé.');c.showIntro();return false;}
      s.rounds=requested;s.found=new Set();s.selected=[];s.origin=null;
      return true;
    }
    function render(){
      const board=s.board,selected=s.selected||[];
      roundBase(`<h4>🔎 Word Search — ${board.size}×${board.size}</h4><p>Chạm chữ đầu và chữ cuối của từ, hoặc kéo qua các chữ. Tìm đủ ${s.rounds} từ.</p><div class="ta3g-search-wrap"><div class="ta3g-search-grid" style="--ta3g-cols:${board.size}">${board.grid.map((row,r)=>row.map((ch,col)=>{const id=r+'_'+col;return `<button type="button" data-gact="cell" data-r="${r}" data-c="${col}" class="${board.foundCells.has(id)?'found':''} ${selected.some(p=>p[0]===r&&p[1]===col)?'selected':''}">${esc(ch)}</button>`;}).join('')).join('')}</div><aside class="ta3g-search-words"><b>🎯 Find the words</b>${board.placements.map(o=>`<div class="${s.found.has(o.word)?'solved':''}">${s.found.has(o.word)?'✅':'🔍'} ${esc(o.word)}</div>`).join('')}<p>${s.found.size}/${s.rounds} từ</p></aside></div>`,{listen:'',hint:true,reset:true});
    }
    function selectWord(r,col){
      if(c.phase!=='playing'||s.locked)return;
      if(!Number.isInteger(r)||!Number.isInteger(col)||r<0||col<0||r>=s.board.size||col>=s.board.size)return;
      if(!s.origin){s.origin=[r,col];s.selected=[[r,col]];showRound();return;}
      const [sr,sc]=s.origin;s.origin=null;s.selected=[];
      const word=s.board.placements.find(p=>!s.found.has(p.word)&&((p.r===sr&&p.c===sc&&p.er===r&&p.ec===col)||(p.r===r&&p.c===col&&p.er===sr&&p.ec===sc)));
      if(word){s.found.add(word.word);s.at=s.found.size;s.points+=10;s.completed++;for(let j=0;j<word.word.length;j++)s.board.foundCells.add((word.r+word.dr*j)+'_'+(word.c+word.dc*j));s.feedback='✅ Found: '+word.word;s.success=true;}
      else{s.wrong++;s.feedback='🌱 Hãy thử chọn lại hai đầu của một từ nhé!';s.success=false;}
      if(s.found.size===s.rounds){finish();return;}showRound();
    }
    function hint(){
      const p=s.board.placements.find(p=>!s.found.has(p.word));
      if(p){s.origin=[p.r,p.c];s.selected=[[p.r,p.c]];s.feedback='💡 Chữ đầu của từ '+p.word+' đã được đánh dấu!';}
      else s.feedback='Tìm hết rồi!';
    }
    function action(a,n,button){if(a==='cell')selectWord(Number(button.dataset.r),Number(button.dataset.c));}
    function pointerDown(e,host){const b=e.target?.closest?.('button[data-gact="cell"]');if(!b||!host.contains(b))return;pointer={r:Number(b.dataset.r),c:Number(b.dataset.c),endR:Number(b.dataset.r),endC:Number(b.dataset.c),wasDrag:false};}
    function pointerMove(e,host){if(!pointer)return;const b=document.elementFromPoint(e.clientX,e.clientY)?.closest?.('button[data-gact="cell"]');if(!b||!host.contains(b))return;const r=Number(b.dataset.r),col=Number(b.dataset.c);if(r!==pointer.r||col!==pointer.c){pointer.endR=r;pointer.endC=col;pointer.wasDrag=true;}}
    function pointerUp(){if(!pointer)return;const p=pointer;pointer=null;if(p.wasDrag){s.suppressCellClickUntil=Date.now()+400;s.origin=[p.r,p.c];selectWord(p.endR,p.endC);}}
    function pointerCancel(){pointer=null;}
    return {bind,begin,render,hint,action,pointerDown,pointerMove,pointerUp,pointerCancel,destroy:pointerCancel};
  });
})();
