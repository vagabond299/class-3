/* Mini Game 02 — Bingo: independent Class 3 English game. */
(() => {
  'use strict';
  window.CLASS3_ENGLISH_MINIGAMES.register('bingo',c=>{
    const {uniq,norm,choosePool,shuffle,pick,esc,roundBase,narrate,showRound,finish,question}=c;
    let s;const bind=()=>{s=c.s;};
    function begin(level,requested,source){
      const items=choosePool(uniq(source.filter(v=>v.word.length<=18),v=>norm(v.word)),requested);
      if(items.length<requested){c.emit(`Nhóm từ này chưa đủ ${requested} ô Bingo. Bé chọn nhóm khác hoặc mức độ thấp hơn nhé.`);c.showIntro();return false;}
      s.tiles=shuffle(items);s.marked=new Set();s.currentCall=null;s.lines=0;
      s.nextCall=pick(s.tiles,1)[0];s.callsLeft=shuffle(s.tiles.filter(v=>v!==s.nextCall));return true;
    }
    function render(){
      const size=Math.sqrt(s.tiles.length);
      const grid=`<div class="ta3g-bingo" style="--ta3g-cols:${size}">${s.tiles.map((v,i)=>`<button type="button" data-gact="bingo-cell" data-n="${i}" class="${s.marked.has(i)?'marked':''}" ${s.marked.has(i)||s.locked?'disabled':''}>${s.marked.has(i)?'✅ ':''}${esc(v.word)}</button>`).join('')}</div>`;
      const targetLines=c.LEVELS.bingo[s.level][2];
      roundBase(`<h4>🎱 Bingo — ${size}×${size}</h4><p class="ta3g-prompt">🎧 Nghe từ tiếng Anh, sau đó đánh dấu ô đúng.</p><div class="ta3g-bingo-status"><b>Hàng Bingo: ${s.lines}/${targetLines}</b><button type="button" class="ta3g-control emphasis" data-gact="bingo-listen">🔊 Nghe từ được gọi</button></div>${grid}`,{listen:'',hint:false,reset:true});
    }
    function bingoLines(){
      const size=Math.sqrt(s.tiles.length);let lines=0;
      for(let r=0;r<size;r++)if(Array.from({length:size},(_,col)=>r*size+col).every(i=>s.marked.has(i)))lines++;
      for(let col=0;col<size;col++)if(Array.from({length:size},(_,r)=>r*size+col).every(i=>s.marked.has(i)))lines++;
      if(Array.from({length:size},(_,i)=>i*size+i).every(i=>s.marked.has(i)))lines++;
      if(Array.from({length:size},(_,i)=>i*size+(size-i-1)).every(i=>s.marked.has(i)))lines++;
      return lines;
    }
    function cell(index){
      if(c.phase!=='playing'||s.locked||!Number.isInteger(index)||index<0||index>=s.tiles.length||s.marked.has(index)||!s.nextCall)return;
      const tile=s.tiles[index];
      if(norm(tile.word)!==norm(s.nextCall.word)){s.wrong++;s.feedback='🌱 Đây chưa phải từ vừa nghe. Bé bấm Nghe lại nhé!';s.success=false;showRound();return;}
      s.marked.add(index);s.points+=10;s.completed++;s.lines=bingoLines();s.feedback='✅ Đúng rồi: '+tile.word;s.success=true;
      if(s.lines>=c.LEVELS.bingo[s.level][2]||s.marked.size===s.tiles.length){finish();return;}
      s.nextCall=s.callsLeft.pop()||null;if(s.nextCall)s.at=s.marked.size;showRound();
    }
    function action(a,n){if(a==='bingo-listen')narrate(s.nextCall?.word);if(a==='bingo-cell')cell(n);}
    return {bind,begin,render,action,listen:()=>narrate(s.nextCall?.word)};
  });
})();
