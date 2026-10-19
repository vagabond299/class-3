/* Mini Game 06 — Q&A Bridge | Epsilon Edu Class 3.
   Match meaningful questions and replies directly from Grammar 10.9's dialogue pairs. */
(() => {
  'use strict';
  window.CLASS3_ENGLISH_MINIGAMES.register('qa-bridge',c=>{
    const {esc,shuffle,choosePool,question,roundBase,showRound,narrate,accept,reject,norm}=c;
    let s;
    const bind=()=>{s=c.s;};
    const dialogue=q=>{
      const lines=String(q.completed_sentence||'').split(/\s*[—–]\s*/);
      if(lines.length!==2)return null;
      const ask=lines[0].trim(),reply=lines[1].trim();
      if(!ask.includes('?')||!reply)return null;
      const lower=ask.toLowerCase();
      let intent=/^how many\b/.test(lower)?'quantity':/^how old\b/.test(lower)?'age':
        /\bcolou?r\b/.test(lower)?'colour':/\bname\b/.test(lower)?'name':
        /\bjob\b/.test(lower)?'job':/^where\b/.test(lower)?'place':
        /^who\b/.test(lower)?'person':/^how\b/.test(lower)?'how':
        /^what\b/.test(lower)?'thing':/^(is|are|do|does|can)\b/.test(lower)?'yes-no':'other';
      const vi=String(q.completed_sentence_vi||'').split(/\s*[—–]\s*/);
      return {...q,ask,reply,intent,askVi:vi[0]||'',replyVi:vi[1]||''};
    };
    function begin(level,requested){
      const all=c.pool.map(dialogue).filter(Boolean);
      const withAlternatives=all.filter(row=>new Set(all.filter(x=>x.intent!==row.intent).map(x=>norm(x.reply))).size>=3);
      s.run=choosePool(withAlternatives,requested);
      return s.run.length===requested;
    }
    function setup(){
      const q=question();
      const others=shuffle(c.pool.map(dialogue).filter(x=>x&&x.intent!==q.intent&&norm(x.reply)!==norm(q.reply)));
      const distractors=[],seen=new Set([norm(q.reply)]);
      for(const row of others){if(!seen.has(norm(row.reply))){distractors.push(row.reply);seen.add(norm(row.reply));}if(distractors.length>=s.optionCount-1)break;}
      s.bridgeOptions=shuffle([q.reply,...distractors]);
      s.bridgeAt=s.at;
    }
    function render(){
      const q=question();if(s.bridgeAt!==s.at)setup();
      roundBase(`<h4>🌉 Q&A Bridge · Xây cầu hội thoại</h4>
        <div class="ta3g-bridge">${Array.from({length:s.rounds},(_,i)=>`<span class="${i<s.completed?'built':''}">${i<s.completed?'🪵':'▫️'}</span>`).join('')}</div>
        <div class="ta3g-dialogue-question"><small>🧒 A asks · Bạn A hỏi:</small><strong>${esc(q.ask)}</strong>${s.level===0&&q.askVi?`<span>${esc(q.askVi)}</span>`:''}</div>
        <p>💬 Bé chọn <strong>câu trả lời phù hợp</strong> để đặt một nhịp cầu.</p>
        <div class="ta3g-reply-grid">${s.bridgeOptions.map((answer,i)=>`<button type="button" class="ta3g-reply" data-gact="pick" data-n="${i}" ${s.locked?'disabled':''}>💬 ${esc(answer)}</button>`).join('')}</div>
        ${s.locked?`<div class="ta3g-dialogue-answer"><b>✅ B replies:</b> ${esc(q.reply)}${q.replyVi?`<span>${esc(q.replyVi)}</span>`:''}</div>`:''}`,{listen:q.ask,next:s.locked});
    }
    function answerPick(i){const answer=s.bridgeOptions?.[i];if(answer==null)return;
      if(norm(answer)===norm(question().reply)){narrate(question().ask+' '+question().reply);accept('🌉 Câu hỏi và câu trả lời đã nối đúng!');}
      else reject('🌱 Đọc kỹ từ hỏi: What (gì), Who (ai), Where (ở đâu), How old (bao nhiêu tuổi), How many (bao nhiêu).');
    }
    function hint(){s.feedback='💡 '+({place:'Where hỏi nơi chốn; câu trả lời thường chỉ địa điểm.',person:'Who hỏi người; câu trả lời giới thiệu một người.',age:'How old hỏi tuổi; câu trả lời có số tuổi.',quantity:'How many hỏi số lượng; câu trả lời nêu số đồ vật.',name:'Hãy chọn câu trả lời giới thiệu tên.',colour:'Câu trả lời cần có màu sắc.',job:'Câu trả lời cần nhắc đến nghề nghiệp.'}[question().intent]||'Hãy tìm câu trả lời đúng loại thông tin được hỏi.');}
    return {bind,begin,render,pick:answerPick,hint,onNext:()=>{s.bridgeAt=-1;},listen:()=>narrate(question()?.ask)};
  });
})();
