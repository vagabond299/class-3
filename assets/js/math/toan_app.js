/* Epsilon Edu - LOP 3 - Math subject module.
 * Local Class 3 JSON only. Class 2 provides UI form reference, never runtime dependencies.
 * Assessment progress and official grading are owned by the Class 3 backend.
 */
(() => {
  'use strict';
  if (window.CLASS3_SUBJECT_MODULES?.math) return;

  const DATA = 'assets/data/math/';
  const JSONS = Object.freeze({
    discover1:'kham_pha_toan_3_part1.json', discover2:'kham_pha_toan_3_part2.json',
    lessons:'bai_hoc_toan_3.json', exercise1:'bai_tap_toan_3_hk1.json',
    exercise2:'bai_tap_toan_3_hk2.json', review:'on_tap_toan_3.json',
    exams:'de_thi_toan_3.json', lab:'toan_3_muc12.json'
  });
  const SUBJECT_ID = 'toan';
  const ROOT_ID = 'class3-math-runtime';
  const TOPICS = [
    ['Số học','🔢','Số đến 100 000, làm tròn và số La Mã'],
    ['Phép cộng và trừ','➕','Cộng, trừ trong phạm vi 100 000'],
    ['Phép nhân và chia','✖️','Bảng tính, nhân chia nhiều chữ số'],
    ['Hình học','📐','Hình, góc, chu vi và diện tích'],
    ['Đơn vị đo và thời gian','⏰','Đo lường, xem giờ, tiền Việt Nam'],
    ['Biểu thức & quy luật','🧮','Thứ tự phép tính, dấu ngoặc và dãy số'],
    ['Tìm thành phần chưa biết','❓','Tìm x trong phép cộng, trừ, nhân, chia'],
    ['Một phần mấy & gấp, giảm','🍰','Phân số đơn vị, gấp giảm và so sánh'],
    ['Toán có lời văn','📝','Hai bước tính, rút về đơn vị, mua bán'],
    ['Hình học, dữ liệu & xác suất','📊','Chu vi, diện tích, bảng số liệu, khả năng'],
    ['Toán nâng cao','🌟','Suy luận, tìm quy luật và giải toán sáng tạo'],
    ['Math Lab – Toán tư duy Mỹ','✨','Mô hình, khám phá và nhiều cách giải']
  ];
  // Compact Explore-card labels. Keep the original TOPICS/JSON titles as source data.
  const TOPIC_HOME_TITLES = Object.freeze([
    'Số học', 'Phép cộng và trừ', 'Phép nhân và chia', 'Hình học',
    'Đơn vị đo & thời gian', 'Biểu thức & quy luật', 'Tìm số chưa biết',
    'Phần mấy & gấp, giảm', 'Toán có lời văn', 'Hình học & dữ liệu',
    'Toán nâng cao', 'Math Lab – Tư duy Mỹ'
  ]);
  // Each subtopic has a concise card title, a relevant icon and a factual description.
  // This is UI-only: the original JSON, question IDs, answers and learning scopes do not change.
  const DISCOVER_SUB_UI = Object.freeze({
    '1.1': ['Đọc, viết và cấu tạo số','🔢','Số đến 100.000, giá trị từng hàng'],
    '1.2': ['So sánh, sắp xếp số','⚖️','Lớn hơn, bé hơn, xếp số theo thứ tự'],
    '1.3': ['Làm tròn số','🎯','Làm tròn chục, trăm, nghìn, chục nghìn'],
    '1.4': ['Chữ số La Mã','🏛️','Nhận biết, đọc và viết số I đến XX'],
    '2.1': ['Cộng, trừ đến 10.000','➕','Đặt tính, cộng trừ có nhớ theo hàng'],
    '2.2': ['Cộng, trừ đến 100.000','💯','Tính nhẩm với số có nhiều chữ số'],
    '2.3': ['Tính nhẩm cộng, trừ','⚡','Số tròn chục, trăm, nghìn; tìm x'],
    '3.1': ['Hướng dẫn','📖','Hiểu phép nhân, phép chia qua những nhóm bằng nhau'],
    '3.2': ['Ôn bảng nhân, chia 2 và 5','🔄','Ôn kiến thức nền tảng từ lớp 2'],
    '3.3': ['Các bảng nhân, chia mới','✖️','Sáu bảng: 3, 4, 6, 7, 8, 9'],
    '3.3.1': ['Bảng nhân 3 và bảng chia 3','3️⃣','50 câu · SGK bài 5'],
    '3.3.2': ['Bảng nhân 4 và bảng chia 4','4️⃣','50 câu · SGK bài 6'],
    '3.3.3': ['Bảng nhân 6 và bảng chia 6','6️⃣','50 câu · SGK bài 9'],
    '3.3.4': ['Bảng nhân 7 và bảng chia 7','7️⃣','50 câu · SGK bài 10'],
    '3.3.5': ['Bảng nhân 8 và bảng chia 8','8️⃣','50 câu · SGK bài 11'],
    '3.3.6': ['Bảng nhân 9 và bảng chia 9','9️⃣','50 câu · SGK bài 12'],
    '3.4': ['Nhân số có hai chữ số','✖️','Nhân với số có một chữ số · Bài 23'],
    '3.5': ['Chia hết và chia có dư','➗','Hiểu thương và số dư · Bài 25'],
    '3.6': ['Chia số có hai chữ số','➗','Chia cho số có một chữ số · Bài 26'],
    '3.7': ['Nhân số có ba chữ số','✖️','Nhân với số có một chữ số · Bài 36'],
    '3.8': ['Chia số có ba chữ số','➗','Chia cho số có một chữ số · Bài 37'],
    '3.9': ['Nhân số có bốn chữ số','✖️','Học kỳ II · Bài 56'],
    '3.10': ['Chia số có bốn chữ số','➗','Học kỳ II · Bài 57'],
    '3.11': ['Nhân số có năm chữ số','✖️','Học kỳ II · Bài 70'],
    '3.12': ['Chia số có năm chữ số','➗','Học kỳ II · Bài 71'],
    '4.1': ['Trung điểm đoạn thẳng','📍','Nhận biết và tính nửa đoạn thẳng'],
    '4.2': ['Tâm, bán kính, đường kính','⭕','Nhận biết các yếu tố của hình tròn'],
    '4.3': ['Góc vuông và góc khác','📐','Nhận dạng góc, đếm số góc vuông'],
    '4.4': ['Khối lập phương, hộp chữ nhật','🧊','Đếm mặt, cạnh và đỉnh của khối'],
    '5.1': ['Độ dài và mi-li-mét','📏','Đổi mm, cm và tính độ dài'],
    '5.2': ['Gam, mi-li-lít và tiền','⚖️','Đo khối lượng, dung tích, đổi đơn vị'],
    '5.3': ['Nhiệt kế và nhiệt độ','🌡️','Đọc nhiệt kế và viết nhiệt độ °C'],
    '5.4': ['Đồng hồ và lịch','🕒','Xem giờ, phút; đọc lịch tháng, năm'],
    '6.1': ['Biểu thức không ngoặc','🧮','Nhân, chia trước; cộng, trừ sau'],
    '6.2': ['Biểu thức có ngoặc','🔣','Tính trong ngoặc trước khi tính tiếp'],
    '6.3': ['Quy luật dãy số','🔁','Nhận bước nhảy, điền số còn thiếu'],
    '7.1': ['Tìm x trong cộng, trừ','❔','Tìm số hạng, số bị trừ, số trừ'],
    '7.2': ['Tìm x trong nhân, chia','🧩','Tìm thừa số và số bị chia'],
    '7.3': ['Tìm x qua hai bước','🔐','Làm ngược từng bước để tìm x'],
    '8.1': ['Một phần mấy','🍕','Chia hình, chia số thành phần bằng nhau'],
    '8.2': ['Gấp lên, giảm đi','🚀','Nhân hoặc chia để gấp, giảm nhiều lần'],
    '8.3': ['So sánh gấp mấy lần','🔍','Dùng phép chia để so sánh hai số'],
    '8.4': ['Tìm một phần của số','🍰','Tìm một phần bằng nhau của số lượng'],
    '9.1': ['Toán hai bước tính','📝','Đọc dữ kiện, lập hai phép tính'],
    '9.2': ['Rút về đơn vị','🪜','Tìm một phần trước rồi tính tiếp'],
    '9.3': ['Toán mua bán','🛒','Tính tiền mua hàng và tiền trả lại'],
    '10.1': ['Tính chu vi hình','📐','Cộng các cạnh của hình thường gặp'],
    '10.2': ['Diện tích qua ô vuông','🟦','Đếm ô vuông đơn vị để tính diện tích'],
    '10.3': ['Diện tích vuông, chữ nhật','📏','Vận dụng công thức diện tích'],
    '10.4': ['Kiểm đếm, bảng số liệu','📊','Đọc vạch kiểm đếm và số lượng'],
    '10.5': ['Khả năng xảy ra','🎲','Chắc chắn, có thể hoặc không thể'],
    '11.1': ['Dãy số và quy luật','🔄','Tìm bước tăng, giảm và số tiếp theo'],
    '11.2': ['Tính nhanh và so sánh','⚡','Ghép số, bù trừ để tính thuận tiện'],
    '11.3': ['Tìm chữ số bí mật','🕵️','Dựa vào điều kiện tìm chữ số ẩn'],
    '11.4': ['Suy luận ngược, tìm x','🧠','Lần ngược từng phép tính để tìm x'],
    '11.5': ['Toán nhiều bước, logic','🧩','Phân tích dữ kiện và lập luận'],
    '11.6': ['Hình học nâng cao','📐','Kết hợp nhiều bước tính hình học']
  });
  // Order is tied to the KNTT textbook. The 3.3 tile is a container, not a quiz.
  const TOPIC3_SECTIONS = Object.freeze([
    '3.2','3.3','3.4','3.5','3.6','3.7','3.8','3.9','3.10','3.11','3.12'
  ]);
  const TOPIC3_TABLES = Object.freeze(['3.3.1','3.3.2','3.3.3','3.3.4','3.3.5','3.3.6']);
  const TOPIC3_NODES = Object.freeze(TOPIC3_SECTIONS.filter(code=>code!=='3.3').concat(TOPIC3_TABLES));
  const LAB_HOME_ICONS = Object.freeze(['🔢','🧮','📦','🔍','🍕','⏰','📐','📊','🧠']);
  function discoverSubUi(topic,sub,sourceTitle) {
    const label=DISCOVER_SUB_UI[`${topic}.${sub}`];
    return {title:label?.[0]||sourceTitle,icon:label?.[1]||TOPICS[topic-1]?.[1]||'🧩',desc:label?.[2]||''};
  }
  const GAMES = [
    ['sudoku','Sudoku trí tuệ','🔢','9 cấp độ từ 4×4 đến 9×9','startSudokuGame','stopSudokuGame'],
    ['number-hunt','Săn số 100 000','🎯','Tìm và chạm số phù hợp','startNumberHuntGame','stopNumberHuntGame'],
    ['math-train','Tàu nhân chia','🚂','Kéo kết quả đúng vào toa','startMathTrainGame','stopMathTrainGame'],
    ['target-number','Xưởng biểu thức','⚙️','Thứ tự thực hiện phép tính','startTargetNumberGame','stopTargetNumberGame'],
    ['missing-number','Thợ săn X','⚖️','Tìm thành phần chưa biết','startMissingNumberGame','stopMissingNumberGame'],
    ['number-river','Dòng sông phân số','🐸','Chọn lá sen đúng','startNumberRiverGame','stopNumberRiverGame'],
    ['shape-builder','Kiến trúc sư hình học','🏗️','Thay đổi hình theo yêu cầu','startShapeBuilderGame','stopShapeBuilderGame'],
    ['time-master','Đồng hồ & lịch','🕐','Chỉnh đồng hồ, nhận biết thời gian','startTimeMasterGame','stopTimeMasterGame'],
    ['little-shop','Siêu thị Toán 3','🛒','Mua hàng, ghép tiền thanh toán','startLittleShopGame','stopLittleShopGame'],
    ['math-factory','Trạm đo lường','📏','Thực hành đo và đổi đơn vị','startMathFactoryGame','stopMathFactoryGame'],
    ['pattern-detective','Thám tử dữ liệu','🕵️','Kéo cột biểu đồ đúng','startPatternDetectiveGame','stopPatternDetectiveGame'],
    ['math-race','Đường đua Toán 3','🏎️','Đi qua cổng đúng kết quả','startMathRaceGame','stopMathRaceGame']
  ];
  const LABELS = {discover:'Khám phá',lessons:'Bài học',exercises:'Bài tập',review:'Ôn tập',exams:'Đề thi',games:'Mini games'};
  const cache = new Map();
  const gameScripts = new Map();
  let ctx = null, root = null, page = {tab:'discover',view:'hub'};
  let renderNonce = 0, live = false, gameRunning = null, audio = null, speechNonce = 0;
  let quiz = null, timer = 0, progress = null, catalog = null;
  let lessonPage = 0, lessonChoice = {}, lessonMistakes = {}, practiceState = {}, labChoices = {}, labHintLevel = 0;
  let discoverGuideSource = null;
  const lastDiscoverFirst = new Map(); // Public question IDs only; no account or result data.
  let chosenSemester = 1, chosenExerciseSemester = 1;
  let onClickRef = null, onInputRef = null, currentLab = null, currentJourney = null;
  let learningQueue=[], learningInFlight=null;
  let previousGameHub, previousGameSpeak, gameBridgeActive=false;

  const e = (v) => String(v == null ? '' : v).replace(/[&<>"']/g, (x) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]));
  const arr = (v) => Array.isArray(v) ? v : [];
  const str = (v) => String(v == null ? '' : v);
  const n = (v) => Number(v) || 0;
  const lessonId = (v) => `TOAN3_B${String(v).padStart(2,'0')}`;
  const shuffle = (source) => {const a = source.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
  const find = (selector) => root?.querySelector(selector) || null;
  const premium = () => ['admin','vip','trial'].includes(str(ctx?.accessType).toLowerCase());
  const authenticated = () => !!(ctx?.isAuthenticated && ctx?.user?.userId);
  const notice = (txt) => ctx?.hooks?.showToast?.(str(txt));
  const dialog = (txt) => ctx?.hooks?.showDialog?.({title:'Toán 3 thông báo',message:str(txt),icon:'🐝'});
  // The shared shell owns the breadcrumb UI; use the existing structured-detail hook.
  const detail = (value) => {
    const hooks=ctx?.hooks;
    if(typeof hooks?.setDetail!=='function')return;
    if(value&&typeof value==='object'){
      hooks.setDetail(hooks.supportsStructuredDetail===true?value:str(value.title));
    }else hooks.setDetail(value||'');
  };
  const clearDetail = () => ctx?.hooks?.clearDetail?.();
  const safeName = () => ctx?.user?.name || 'Bé';
  const api = async (action,payload={}) => {
    if (!authenticated()) throw new Error('NEED_LOGIN');
    return ctx.apiRequest(action,Object.assign({subjectId:SUBJECT_ID},payload));
  };
  function requirePremium(name) {
    if (premium() && authenticated()) return true;
    ctx?.requestPremiumAccess?.(name || 'nội dung Toán 3');
    return false;
  }
  async function load(k) {
    if (!(k in JSONS)) throw new Error('Dữ liệu không được hỗ trợ');
    if (cache.has(k)) return cache.get(k);
    const request = fetch(DATA + JSONS[k],{cache:'default',credentials:'omit'}).then(async res => {
      if (!res.ok) throw new Error('Không tải được ' + JSONS[k]);
      return res.json();
    }).catch(err=>{cache.delete(k);throw err;});
    cache.set(k,request);
    return request;
  }
  async function loadCatalog() {
    if (catalog) return catalog;
    try {const response=await fetch('assets/data/shared_image_catalog.json',{credentials:'omit'});if(!response.ok)return null;catalog=await response.json();return catalog;}
    catch(_){return null;}
  }
  async function imageHtml(illustration) {
    // Topic-cover graphics are decorative, not question data. Ignore old cached JSON too.
    if (!illustration || typeof illustration!=='object' || illustration.role==='topic_cover') return '';
    if (illustration.kind === 'emoji') return `<div class="m3-scene-emoji" aria-hidden="true">${e(illustration.emoji)}</div><p class="m3-caption">${e(illustration.caption||'')}</p>`;
    const id=str(illustration.imageId || illustration.image_id);
    if (!id || illustration.kind !== 'catalog_image') return '';
    const c=await loadCatalog(), info=c?.images?.[id];
    if (!info || info.has_text) return '';
    // Trust only paths from the local catalog, not arbitrary URLs coming from a question.
    const src=str(info.src || '');
    if (!src.startsWith('assets/images/') || src.includes('..') || /[\x00-\x1f]/.test(src)) return '';
    return `<figure class="m3-illustration"><img src="${e(src)}" loading="lazy" decoding="async" alt="${e(info.alt_vi||info.name_vi||illustration.alt||'Minh hoạ Toán')}"><figcaption>${e(illustration.caption||'')}</figcaption></figure>`;
  }
  const safeInt=(value,minimum,maximum)=>Math.max(minimum,Math.min(maximum,Math.round(Number(value)||0)));
  function geometrySvg(kind) {
    const points={
      square:'48,28 172,28 172,152 48,152',rectangle:'35,52 205,52 205,139 35,139',
      right_triangle:'48,38 48,160 200,160',triangle:'112,25 35,170 190,170',
      right_trapezoid:'50,50 145,50 205,155 50,155',
      parallelogram:'60,48 175,48 205,152 90,152',
      house:'50,100 130,30 210,100 210,175 50,175'
    };
    const p=points[kind];if(!p)return '';
    return `<svg class="m3-math-svg" viewBox="0 0 250 205" role="img" aria-label="Hình học cần quan sát và đếm góc vuông"><polygon points="${p}" fill="#f0e8ff" stroke="#7041b2" stroke-width="4" stroke-linejoin="round"/></svg>`;
  }
  function gridModel(rows,cols,filled){
    rows=safeInt(rows,1,10);cols=safeInt(cols,1,12);filled=safeInt(filled,0,rows*cols);
    return `<div class="m3-math-grid" style="--m3-cols:${cols}">${Array.from({length:rows*cols},(_,i)=>`<span class="${i<filled?'on':''}" aria-label="${i<filled?'Ô có tô màu':'Ô chưa tô màu'}"></span>`).join('')}</div>`;
  }
  function tallySvg(count){
    count=safeInt(count,0,50);const groups=Math.ceil(count/5),width=Math.max(70,groups*48+12);
    let lines='';for(let k=0;k<count;k++){
      const g=Math.floor(k/5),position=k%5,x=12+g*46+position*8;
      if(position===4)lines+=`<line x1="${12+g*46-3}" y1="26" x2="${12+g*46+29}" y2="3"/>`;
      else lines+=`<line x1="${x}" y1="3" x2="${x}" y2="26"/>`;
    }
    return `<svg class="m3-tally-svg" viewBox="0 0 ${width} 30" style="width:${width}px" aria-label="${count} vạch kiểm đếm">${lines}</svg>`;
  }
  // Adapted from the 3-column arithmetic layout in the provided Toán 2 module.
  // Only the explicitly marked Khám phá operations use this interactive layout.
  function verticalArithmeticHtml(vm, solved=false, answer='') {
    if (!vm || vm.kind!=='vertical_arithmetic') return '';
    const a=Number(vm.a),b=Number(vm.b),op=str(vm.operator);
    if(!Number.isSafeInteger(a)||!Number.isSafeInteger(b)||a<0||b<0||a>99999||b>99999||!['+','-','×'].includes(op))return '';
    const expected=op==='+'?a+b:op==='-'?a-b:a*b;
    if(!Number.isSafeInteger(expected)||expected<0||expected>999999)return '';
    const answerText=str(answer).trim().replace(/\s/g,'');
    const showResult=solved && answerText===String(expected);
    const columns=Math.max(op==='×'?2:4,String(a).length,String(b).length,String(expected).length);
    const digitCells=(num)=>String(num).padStart(columns,' ').split('').map(d=>`<span class="m3-vertical-digit" aria-hidden="true">${d===' '?'&nbsp;':e(d)}</span>`).join('');
    const resultCells=(showResult?String(expected):'?'.repeat(columns)).padStart(columns,' ').split('').map(d=>`<span class="m3-vertical-result${showResult?' is-revealed':''}" aria-hidden="true">${d===' '?'&nbsp;':e(d)}</span>`).join('');
    const operationName=op==='+'?'cộng':op==='-'?'trừ':'nhân';
    const description=showResult?`${a} ${operationName} ${b} bằng ${expected}`:`${a} ${operationName} ${b}, chưa biết kết quả`;
    return `<div class="m3-vertical-arithmetic" style="--m3-vertical-columns:${columns}" role="img" aria-label="${e(description)}">
      <span class="m3-vertical-sign" aria-hidden="true"></span>${digitCells(a)}
      <span class="m3-vertical-sign" aria-hidden="true">${op==='+'?'+':op==='-'?'−':'×'}</span>${digitCells(b)}
      <span class="m3-vertical-line" aria-hidden="true"></span>
      <span class="m3-vertical-sign" aria-hidden="true"></span>${resultCells}
    </div>`;
  }
  function renderMathVisual(vm,solved=false,answer=''){
    if(!vm||typeof vm!=='object')return '';
    const kind=str(vm.kind);let body='';
    if(kind==='vertical_arithmetic')body=verticalArithmeticHtml(vm,solved,answer);
    else if(kind==='geometry_shape')body=geometrySvg(str(vm.shape));
    else if(kind==='fraction_bar'){
      const total=safeInt(vm.parts,2,12),shaded=safeInt(vm.shaded,0,total);
      body=`<div class="m3-fraction-strip" style="--m3-cols:${total}">${Array.from({length:total},(_,i)=>`<span class="${i<shaded?'on':''}"></span>`).join('')}</div><p class="m3-caption">Các phần của thanh bằng nhau.</p>`;
    }else if(kind==='fraction_dots'){
      const total=safeInt(vm.total,1,60),pieces=safeInt(vm.parts,1,12),nEach=total/pieces;
      body=`<div class="m3-math-dots">${Array.from({length:total},(_,i)=>`<span class="${i<nEach?'on':''}"></span>`).join('')}</div><p class="m3-caption">Nhóm tô màu là một trong ${pieces} nhóm bằng nhau.</p>`;
    }else if(kind==='area_grid')body=gridModel(vm.rows,vm.cols,vm.filled);
    else if(kind==='area_compare'){
      const a=safeInt(vm.a,1,30),b=safeInt(vm.b,1,30);
      body=`<div class="m3-visual-pair"><div><strong>Hình A</strong>${gridModel(Math.ceil(a/5),5,a)}</div><div><strong>Hình B</strong>${gridModel(Math.ceil(b/5),5,b)}</div></div>`;
    }else if(kind==='tally_chart'){
      body='<div class="m3-tally-chart"><div class="m3-tally-heading"><strong>Nhóm</strong><strong>Vạch kiểm đếm</strong></div>'+arr(vm.rows).map(x=>`<div class="m3-tally-row"><strong>${e(x.label)}</strong>${tallySvg(x.count)}</div>`).join('')+'</div><p class="m3-caption">Mỗi cụm bốn vạch dọc và một vạch chéo là 5.</p>';
    }else if(kind==='segment_midpoint'){
      body=`<svg class="m3-math-svg" viewBox="0 0 280 120" role="img" aria-label="Đoạn AB có M ở chính giữa"><path d="M 28 58 H 252" stroke="#7041b2" stroke-width="4"/><g fill="#ec4899"><circle cx="28" cy="58" r="6"/><circle cx="140" cy="58" r="6"/><circle cx="252" cy="58" r="6"/></g><g font-size="17" font-weight="800" fill="#6d28d9"><text x="23" y="92">A</text><text x="135" y="92">M</text><text x="246" y="92">B</text><text x="96" y="23">${safeInt(vm.length,1,9999)} cm</text></g></svg>`;
    }else if(kind==='circle_parts'){
      body=`<svg class="m3-math-svg" viewBox="0 0 250 190" role="img" aria-label="Hình tròn tâm O, bán kính OM và đường kính AB"><circle cx="125" cy="92" r="69" fill="#f1eaff" stroke="#7c3aed" stroke-width="3"/><line x1="56" y1="92" x2="194" y2="92" stroke="#ec4899" stroke-width="3"/><line x1="125" y1="92" x2="125" y2="23" stroke="#0d9488" stroke-width="3"/><circle cx="125" cy="92" r="4" fill="#7c3aed"/><g font-size="16" fill="#5b216e"><text x="107" y="110">O</text><text x="46" y="87">A</text><text x="200" y="87">B</text><text x="132" y="24">M</text></g></svg>`;
    }else if(kind==='clock_concept'){
      body=clockSvg(vm.hour,vm.minute);
    }else if(kind==='solid_faces'){
      body=`<svg class="m3-math-svg" viewBox="0 0 300 220" role="img" aria-label="Khối hộp có các mặt, cạnh và đỉnh"><polygon points="66,65 204,65 259,26 119,26" fill="#d8b4fe" stroke="#6d28d9" stroke-width="3"/><polygon points="204,65 259,26 259,160 204,200" fill="#a5b4fc" stroke="#6d28d9" stroke-width="3"/><rect x="66" y="65" width="138" height="135" fill="#e0e7ff" stroke="#6d28d9" stroke-width="3"/></svg><p class="m3-caption">Khối hộp chữ nhật: 6 mặt, 12 cạnh và 8 đỉnh.</p>`;
    }else if(kind==='measurement_concept'){
      body='<div class="m3-concept-icons"><span>📏<strong>mm</strong><small>Độ dài</small></span><span>⚖️<strong>g</strong><small>Khối lượng</small></span><span>🧪<strong>ml</strong><small>Dung tích</small></span><span>🌡️<strong>°C</strong><small>Nhiệt độ</small></span></div>';
    }else if(kind==='roman_numerals'){
      body='<div class="m3-concept-icons"><span>Ⅰ<strong>1</strong></span><span>Ⅴ<strong>5</strong></span><span>Ⅹ<strong>10</strong></span><span>ⅩⅣ<strong>14</strong></span></div>';
    }else if(kind==='place_value'){
      const value=safeInt(vm.value,0,99999),digits=String(value).padStart(5,'0').split('');
      body='<div class="m3-place-value">'+['Chục nghìn','Nghìn','Trăm','Chục','Đơn vị'].map((label,i)=>`<div><strong>${label}</strong><span>${digits[i]}</span></div>`).join('')+'</div>';
    }else if(kind==='math_groups'){
      const rows=safeInt(vm.rows,1,6),cols=safeInt(vm.cols,1,8);
      body=gridModel(rows,cols,rows*cols)+`<p class="m3-caption">${rows} hàng, mỗi hàng ${cols} ô: ${rows} × ${cols} = ${rows*cols} ô.</p>`;
    }else if(kind==='money_concept'){
      body='<div class="m3-concept-icons m3-money-concept"><span>5 000<small>đồng</small></span><span>2 000<small>đồng</small></span><span>1 000<small>đồng</small></span></div><p class="m3-caption">5 000 + 2 000 + 1 000 = 8 000 đồng.</p>';
    }else if(kind==='column_addition'){
      const a=safeInt(vm.a,0,99999),b=safeInt(vm.b,0,99999);
      body=`<div class="m3-column-calc"><div>${a.toLocaleString('vi-VN')}</div><div>+ ${b.toLocaleString('vi-VN')}</div><hr/><strong>${(a+b).toLocaleString('vi-VN')}</strong></div><p class="m3-caption">Viết các hàng cùng tên thẳng cột và tính từ phải sang trái.</p>`;
    }else if(kind==='expression_steps'){
      body='<div class="m3-concept-steps">'+arr(vm.steps).map((step,i)=>`<span>${e(step)}</span>${i<arr(vm.steps).length-1?'<span>↓</span>':''}`).join('')+'</div>';
    }else if(kind==='multiplication_setup'){
      // Direct multiplication only: the vertical result must match the actual answer.
      const a=Number(vm.a),b=Number(vm.b);
      if(Number.isSafeInteger(a)&&Number.isSafeInteger(b)&&a>0&&a<=99999&&b>=1&&b<=9){
        body=verticalArithmeticHtml({kind:'vertical_arithmetic',a,b,operator:'×'},solved,answer);
        if(body)body+='<p class="m3-caption">Nhân lần lượt từ hàng đơn vị; ghi số nhớ nếu có.</p>';
      }
    }else if(kind==='multiplication_two_steps'){
      // An expression a × b + c has TWO operations: never show a × b as its final answer.
      const a=Number(vm.a),b=Number(vm.b),addend=Number(vm.addend);
      if(Number.isSafeInteger(a)&&Number.isSafeInteger(b)&&Number.isSafeInteger(addend)&&a>0&&a<=99999&&b>=1&&b<=9&&addend>=0&&addend<=99999){
        const product=a*b,total=product+addend;
        const done=solved&&str(answer).trim().replace(/\s/g,'')===String(total);
        const first=verticalArithmeticHtml({kind:'vertical_arithmetic',a,b,operator:'×'},done,String(product));
        if(first)body=`<div class="m3-mul-steps"><p><strong>Bước 1:</strong> Thực hiện phép nhân.</p>${first}<p class="m3-mul-next"><strong>Bước 2:</strong> ${done?product:'?'} + ${addend} = <strong class="${done?'m3-mul-answer':''}">${done?total:'?'}</strong></p></div>`;
      }
    }else if(kind==='multiplication_unknown_factor'){
      // The unknown factor is never printed (or put in aria-label) before a correct choice.
      const b=Number(vm.multiplier),product=Number(vm.product);
      if(Number.isSafeInteger(b)&&Number.isSafeInteger(product)&&b>=1&&b<=9&&product>0&&product<=999999&&product%b===0){
        const factor=product/b;
        const done=solved&&str(answer).trim().replace(/\s/g,'')===String(factor);
        body=`<div class="m3-mul-unknown"><p><strong>Tìm thừa số chưa biết</strong></p><div class="m3-mul-equation"><strong class="${done?'m3-mul-answer':''}">${done?factor:'?'}</strong><span>×</span><span>${b}</span><span>=</span><span>${product}</span></div><p class="m3-caption">Muốn tìm thừa số chưa biết, lấy tích chia cho thừa số đã biết.</p></div>`;
        if(done)body+=`<div class="m3-mul-worked"><p><strong>C\u00e1ch t\u00ecm:</strong> ${product} : ${b} = <strong>${factor}</strong></p><p><strong>Ki\u1ec3m tra:</strong> ${factor} \u00d7 ${b} = ${product}</p></div>`;
      }
    }else if(kind==='joined_squares'){
      const side=safeInt(vm.side,1,99);
      body=`<svg class="m3-math-svg" viewBox="0 0 300 190" role="img" aria-label="Hai hình vuông cạnh ${side} cm ghép cạnh nhau"><rect x="34" y="47" width="112" height="112" fill="#ede9fe" stroke="#6d28d9" stroke-width="3"/><rect x="146" y="47" width="112" height="112" fill="#bfdbfe" stroke="#6d28d9" stroke-width="3"/><g fill="#5b216e" font-size="16" font-weight="800"><text x="146" y="31" text-anchor="middle">Hai hình vuông bằng nhau</text><text x="90" y="175" text-anchor="middle">${side} cm</text><text x="203" y="175" text-anchor="middle">${side} cm</text></g></svg>`;
    }else if(kind==='cutout_square'){
      const side=safeInt(vm.side,3,99),cut=safeInt(vm.cut,1,side-1),gap=Math.max(12,Math.min(130,Math.round(150*cut/side))),x=198-gap,y=22+gap;
      body=`<svg class="m3-math-svg" viewBox="0 0 280 224" role="img" aria-label="Hình vuông cạnh ${side} cm bỏ đi hình vuông nhỏ cạnh ${cut} cm ở góc"><path d="M 48 22 H ${x} V ${y} H 198 V 172 H 48 Z" fill="#c4b5fd" stroke="#6d28d9" stroke-width="3" stroke-linejoin="round"/><path d="M ${x} 22 H 198 V ${y}" stroke="#94a3b8" stroke-dasharray="4 4" fill="none" stroke-width="2"/><g fill="#5b216e" font-size="16" font-weight="800"><text x="36" y="100" transform="rotate(-90,36,100)">${side} cm</text><text x="212" y="31">Bỏ</text><text x="212" y="48">${cut} cm</text></g></svg>`;
    }else if(kind==='segment_quarters'){
      const length=safeInt(vm.length,4,9999);
      body=`<svg class="m3-math-svg" viewBox="0 0 310 125" role="img" aria-label="A, N, M, B thẳng hàng; N là trung điểm AM và M là trung điểm AB"><path d="M 30 57 H 280" stroke="#7041b2" stroke-width="4"/><g fill="#db2777"><circle cx="30" cy="57" r="6"/><circle cx="92.5" cy="57" r="6"/><circle cx="155" cy="57" r="6"/><circle cx="280" cy="57" r="6"/></g><g fill="#5b216e" font-size="18" font-weight="800"><text x="24" y="88">A</text><text x="85" y="88">N</text><text x="149" y="88">M</text><text x="274" y="88">B</text><text x="150" y="22" text-anchor="middle">AB = ${length} cm</text></g></svg>`;
    }else if(kind==='rectangle_area'){
      const w=safeInt(vm.width,1,9999),h=safeInt(vm.height,1,9999),width=180,height=Math.max(68,180*h/w);
      body=`<svg class="m3-math-svg" viewBox="0 0 280 215" role="img" aria-label="Hình chữ nhật dài ${w} và rộng ${h} xăng-ti-mét"><rect x="55" y="38" width="${width}" height="${Math.min(130,height)}" fill="#e9d5ff" stroke="#7c3aed" stroke-width="3"/><g fill="#5b216e" font-size="17" font-weight="800"><text x="135" y="25" text-anchor="middle">${w} cm</text><text x="50" y="114" text-anchor="end">${h} cm</text></g></svg>`;
    }
    return body?`<figure class="m3-math-visual">${body}</figure>`:'';
  }
  function scopeBadge(guide){
    const scope=str(guide?.scope||'');return scope?`<span class="m3-scope ${scope==='Nâng cao'?'m3-advanced':''}">${e(scope)}</span>`:'';
  }
  function guideHtml(source,title){
    const guide=source?.find(q=>q?.lesson_intro)?.lesson_intro;if(!guide)return '';
    const ref=arr(guide.sgk_source_lessons).map(x=>`Bài ${safeInt(x,1,81)}`).join(', ');
    return `<div class="m3-guide"><div class="m3-guide-meta">${scopeBadge(guide)}<span>Liên hệ SGK: ${e(ref)}</span></div><div class="m3-guide-grid"><article><span>1</span><h3>👀 Quan sát</h3><p>${e(guide.observe)}</p></article><article><span>2</span><h3>💡 Hiểu bản chất</h3><p>${e(guide.understand)}</p></article><article><span>3</span><h3>✏️ Cô làm mẫu</h3><p>${e(guide.worked_example)}</p></article></div><div class="m3-guide-lower"><section><h3>👣 Con thực hiện</h3><ol>${arr(guide.micro_steps).map(x=>`<li>${e(x)}</li>`).join('')}</ol></section><section><h3>🎯 Tự kiểm</h3><p>${e(guide.self_check)}</p><p class="m3-caution">Lưu ý: ${e(guide.common_mistake)}</p></section></div><div class="m3-guide-ctas"><button class="m3-small" data-action="guide-speak">🔊 Nghe hướng dẫn</button><button class="m3-submit" data-action="discover-begin">Sang luyện tập · ${source.length} câu →</button></div></div>`;
  }

  // Adaptive learning telemetry is separate from official assessments. Events never
  // grant exam scores, subject access, or sequential exercise unlock rights.
  function observeLearning(question,correct,origin) {
    if(!authenticated())return;
    const code=/^TOAN3_C[1-6]$/.test(str(question.skill))?str(question.skill):'TOAN3_MISC';
    const originKey=str(origin).replace(/[^A-Za-z0-9]/g,'').slice(0,12)||'practice';
    learningQueue.push({t:Date.now(),q:str(question.id).slice(0,64),s:`${code}.${originKey}`,o:correct?'c':'w',e:originKey,u:0,l:1,tp:n(page.topic)});
    if(learningQueue.length>=10)void flushLearning();
  }
  async function flushLearning(){
    if(learningInFlight||!learningQueue.length||!authenticated())return;
    const events=learningQueue.splice(0,20),apiFn=ctx.apiRequest;
    learningInFlight=Promise.resolve(apiFn('learningProfileSaveBatch',{subjectId:SUBJECT_ID,events}))
      .catch(()=>{ /* Adaptive telemetry failure must not block a learner's current answer. */ })
      .finally(()=>{learningInFlight=null;if(learningQueue.length>=10)void flushLearning();});
    return learningInFlight;
  }
  function stopSpeech() {
    speechNonce++;
    if (audio) {try{audio.pause();audio.removeAttribute('src');audio.load();}catch(_){}audio=null;}
    try{ctx?.hooks?.stopTTS?.();}catch(_){}
    try{window.speechSynthesis?.cancel?.();}catch(_){}
  }
  async function speak(text) {
    stopSpeech();
    const cleaned=str(text).replace(/<[^>]+>/g,' ').trim().slice(0,420);
    if (!cleaned) return;
    const token=speechNonce;
    try {
      if(typeof ctx?.hooks?.speakVietnamese==='function'){
        await ctx.hooks.speakVietnamese(cleaned);return;
      }
      audio=new Audio(); audio.referrerPolicy='no-referrer';
      audio.src='https://translate.google.com/translate_tts?ie=UTF-8&tl=vi&client=tw-ob&q='+encodeURIComponent(cleaned);
      audio.playbackRate=.92;
      await audio.play();
    } catch (_) {
      if(token===speechNonce)notice('Tạm thời không phát được giọng đọc Google. Bé có thể đọc hướng dẫn trên màn hình nhé.');
    }
  }
  function stopGame() {
    if (!gameRunning && !gameBridgeActive) return;
    const game=GAMES.find(x=>x[0]===gameRunning);
    try{const stop=game && window[game[5]];if(typeof stop==='function')stop();}catch(_){}
    gameRunning=null;
    if(gameBridgeActive){if(previousGameHub===undefined)delete window.openMiniGameHub;else window.openMiniGameHub=previousGameHub;
      if(previousGameSpeak===undefined)delete window.speakVietnamese;else window.speakVietnamese=previousGameSpeak;
      gameBridgeActive=false;}
  }
  function stopTimer() {if(timer){window.clearInterval(timer);timer=0;}}
  function cleanView() {if(learningQueue.length)void flushLearning();stopSpeech();stopTimer();stopGame();quiz=null;labHintLevel=0;ctx?.hooks?.setScore?.(0,0);}
  function setPage(tab,view,other={}) {
    page={tab,view,...other};
    if(view==='hub'){clearDetail();return;}
    if(tab!=='discover'){detail(other.title||LABELS[tab]);return;}
    const topic=n(page.topic);
    if(topic<1||topic>TOPICS.length){detail(other.title||LABELS[tab]);return;}

    // Three native subbanner levels: Explore > main topic > learning subtopic.
    // Parent breadcrumb tabs navigate back through the Math module, not the Home page.
    const items=[
      {title:'Khám phá',action:()=>{void showHub('discover');}},
      {title:`${topic}. ${TOPICS[topic-1][0]}`,
        action:(topic===12?view!=='lab-home':view!=='topic')
          ?()=>{void (topic===12?showLabHome():showDiscoverTopic(topic));}:null}
    ];
    if(topic===3 && (view==='subtopic' || (str(page.node).startsWith('3.3.') && (view==='quiz'||view==='result')))) {
      items.push({title:'3.3. Các bảng nhân, chia mới',
        action:view==='subtopic'?null:()=>{void showDiscoverNestedTopic(3);}});
    }
    if(topic<=11 && page.sub!=null && (view==='quiz'||view==='result'||view==='guide')){
      items.push({title:str(page.title)||`${page.sub}. Mục học`,
        action:view==='result'?()=>{void showDiscoverSub(topic,page.sub,page.node||'');}:null});
    }else if(topic===12 && (view==='lab-track'||view==='lab-activity')){
      const labTitle=str(page.labTitle||currentLab?.title||page.title);
      if(labTitle)items.push({title:labTitle,
        action:view==='lab-activity'?()=>{void showLabTrack(page.code);}:null});
      if(view==='lab-activity'&&page.title)items.push({title:str(page.title)});
    }
    detail({title:items.map(item=>item.title).join(' › '),items});
  }
  function validLive(nonce) {return live && !!root?.isConnected && nonce===renderNonce;}
  function loading() {if(root)root.innerHTML='<div class="m3-loading"><span class="m3-spinner"></span>Đang tải nội dung Toán 3…</div>';}
  function errorView(_err) {if(!root)return;root.innerHTML='<div class="m3-empty">Chưa thể tải nội dung Toán 3. Bé vui lòng thử lại sau nhé.</div>';}
  function head(title,desc='',back='hub') {return `<div class="m3-section-header"><div><h2>${e(title)}</h2>${desc?`<p>${e(desc)}</p>`:''}</div>${back==='home'?'':`<button class="m3-back" data-action="back" data-target="${e(back)}">← Quay lại</button>`}</div>`;}
  function folder(title,desc,icon,action,attributes='',foot='Khám phá ngay',locked=false,extraClass='') {
    return `<button type="button" class="m3-folder${locked?' is-locked':''}${extraClass?' '+e(extraClass):''}" data-action="${e(action)}" ${attributes}>
      <span class="m3-folder-head"><span class="m3-folder-icon" aria-hidden="true">${e(icon)}</span><span class="m3-folder-copy"><strong>${e(title)}</strong><small>${e(desc)}</small></span></span>
      <span class="m3-folder-foot"><span>${e(foot)}</span><span>${locked?'🔒':'➜'}</span></span></button>`;
  }
  function list(items, extraClass='') {return `<div class="m3-folder-grid${extraClass?' '+extraClass:''}">${items.join('')}</div>`;}
  function discoverHomeCard(topic,index) {
    const title=TOPIC_HOME_TITLES[index]||topic[0],count=index===11?'9 Lab · 88 hành trình':'50 câu / mục nhỏ';
    const action=index===11?'lab-home':'discover-topic';
    return `<button type="button" class="m3-folder m3-discover-topic-card" data-action="${action}" data-topic="${index+1}">
      <span class="m3-folder-head"><span class="m3-folder-icon" aria-hidden="true">${e(topic[1])}</span>
        <span class="m3-folder-copy"><strong>${index+1}. ${e(title)}</strong></span></span>
      <span class="m3-topic-description">${e(topic[2])}</span>
      <span class="m3-folder-foot"><span>${e(count)}</span><span aria-hidden="true">➜</span></span></button>`;
  }
  function roleLabel() {return ctx?.accessType==='admin'?'Admin':ctx?.accessType==='vip'?'VIP':ctx?.accessType==='trial'?'Trial':'Regular / Khách';}
  async function showHub(tab) {
    const nonce=++renderNonce;cleanView();setPage(tab,'hub');loading();
    try {
      let html='', title=LABELS[tab]||'Toán 3', subtitle='Lớp 3 · Kết nối tri thức với cuộc sống';
      if(tab==='discover'){
        html=list(TOPICS.map((x,i)=>discoverHomeCard(x,i)),'m3-discover-home-grid');
      } else if(tab==='lessons'){
        const d=await load('lessons');if(!validLive(nonce))return;
        html=`<div class="m3-semesters"><button class="m3-sem ${chosenSemester===2?'':'active'}" data-action="semester" data-sem="1">Học kỳ 1</button><button class="m3-sem ${chosenSemester===2?'active':''}" data-action="semester" data-sem="2">Học kỳ 2</button></div>`;
        const sem=chosenSemester;
        html+=list(arr(d.bai_hoc).filter(b=>n(b.semester)===sem).map((b,i)=>folder(`Bài ${b.source_lesson_no}`,b.source_title||b.title,'📖','lesson',`data-id="${e(b.lesson_id)}"`,`${b.pages?.length||3} trang`)));
      } else if(tab==='exercises'){
        await getProgress().catch(()=>null);
        const [a,b]=await Promise.all([load('exercise1'),load('exercise2')]);if(!validLive(nonce))return;
        html='<p class="m3-note">Mỗi bài 20 câu. Đạt từ 80% được mở bài tiếp theo. Kết quả mở khóa phải do máy chủ xác nhận.</p>';
        html+=`<div class="m3-semesters"><button class="m3-sem ${chosenExerciseSemester===1?'active':''}" data-action="exercise-sem" data-sem="1">Bài tập HK1 · 34 bài</button><button class="m3-sem ${chosenExerciseSemester===2?'active':''}" data-action="exercise-sem" data-sem="2">Bài tập HK2 · 24 bài</button>${authenticated()?`<button class="m3-sem" data-action="history" data-kind="baitap" data-sem="hk${chosenExerciseSemester}">📋 Lịch sử</button>`:''}</div>`;
        const source=chosenExerciseSemester===1?arr(a.bai_tap):arr(b.bai_tap);
        html+=list(source.map(item=>{
          const locked=authenticated()&&premium()?n(item.bai)>n(progress?.unlockedBai||1):false;
          return folder(`Bài ${item.source_lesson_no}`,item.title,'✏️','exercise',`data-id="${e(item.exercise_id)}" data-bai="${n(item.bai)}"`,locked?'Cần hoàn thành bài trước':'20 câu · Đạt ≥80%',locked);
        }));
      } else if(tab==='review'){
        const d=await load('review');if(!validLive(nonce))return;
        html='<p class="m3-note">Các bài Luyện tập chung / Ôn tập theo đúng tiến trình SGK. Luyện tại đây không tự mở khóa Bài tập.</p>';
        html+=list(arr(d.on_tap).map(b=>folder(`Bài ${b.source_lesson_no} · ${b.source_title}`,b.title,'🧠','review',`data-id="${e(b.review_id)}"`,'20 câu / lượt')));
      } else if(tab==='exams'){
        const d=await load('exams');if(!validLive(nonce))return;
        const counts={1:0,2:0,hsg:0};arr(d.exams).forEach(x=>{if(x.exam_type==='hsg_advanced'||x.exam_category==='Học sinh giỏi')counts.hsg++;else if(x.semester===1)counts[1]++;else counts[2]++;});
        html=list([folder('Học kỳ I',`${counts[1]} đề · 40 phút`,'🏆','exam-category','data-sem="1"','Đánh giá theo năng lực'),folder('Học kỳ II',`${counts[2]} đề · 40 phút`,'🏆','exam-category','data-sem="2"','Đánh giá theo năng lực'),folder('Học sinh giỏi',`${counts.hsg} đề nâng cao`,'🌟','exam-category','data-sem="hsg"','Không tính vào 6 năng lực chuẩn')]);
      } else if(tab==='games'){
        html=list(GAMES.map((g,i)=>folder(`${i+1}. ${g[1]}`,g[3],g[2],'game',`data-id="${e(g[0])}"`,'Chơi ngay')));
      }
      if(!validLive(nonce))return;
      root.innerHTML=head(title,subtitle,'home')+html;
    } catch(err){if(validLive(nonce))errorView(err);}
  }
  async function showDiscoverTopic(topic) {
    if(topic===12) return showLabHome();
    const nonce=++renderNonce;cleanView();setPage('discover','topic',{topic,title:`${topic}. ${TOPICS[topic-1][0]}`});loading();
    try {
      const d=topic<=5?await load('discover1'):await load('discover2');if(!validLive(nonce))return;
      const grouped=new Map();arr(d).forEach(q=>{const parts=/^Q_(\d+)_(\d+)_/.exec(str(q.id));if(n(parts?.[1])!==topic)return;const id=parts[2];if(!grouped.has(id))grouped.set(id,{id,name:q.sub,items:[]});grouped.get(id).items.push(q);});
      if(topic===3){
        const counts=new Map();
        arr(d).filter(q=>str(q.id).startsWith('Q_3_')).forEach(q=>{
          if(TOPIC3_NODES.includes(str(q.learning_node))) counts.set(q.learning_node,(counts.get(q.learning_node)||0)+1);
        });
        const complete=TOPIC3_NODES.every(code=>counts.get(code)>=50);
        if(!complete){
          root.innerHTML=head('3. Phép nhân và chia','Cần cập nhật tệp kham_pha_toan_3_part1.json cùng phiên bản với JS.')+
            '<div class="m3-empty">Kho câu hỏi mới chưa đầy đủ. Vui lòng cập nhật JSON Toán 3 rồi tải lại chương trình.</div>';
          return;
        }
        const cards=[folder('3.1. Hướng dẫn','Quan sát · Hiểu · Làm mẫu · Học khi cần','📖',
            'discover-topic-guide','data-topic="3"','Tự chọn, không bắt buộc',false,'m3-discover-guide-card')];
        TOPIC3_SECTIONS.forEach(code=>{
          const ui=discoverSubUi(3,code.slice(2));
          if(code==='3.3'){
            cards.push(folder(`${code}. ${ui.title}`,ui.desc,'✖️',
              'discover-nested-topic','data-topic="3"', '6 mục nhỏ · 300 câu'));
          }else{
            const sub=code.slice(2),count=counts.get(code)||0;
            cards.push(folder(`${code}. ${ui.title}`,ui.desc,ui.icon,
              'discover-sub',`data-topic="3" data-sub="${e(sub)}"`,`${count} câu · Luyện ngay`));
          }
        });
        root.innerHTML=head('3. Phép nhân và chia',
          'Ôn bảng 2, 5 → học bảng 3–9 → nhân/chia hai, ba, bốn, năm chữ số theo SGK.')+
          list(cards,'m3-discover-sub-grid m3-discover-topic-grid');
        return;
      }
      // A single optional introduction is the FIRST sibling learning item,
      // mirroring Class 2's independent introduction tile. All existing
      // quiz sub IDs, JSON question IDs and assessment links stay unchanged.
      const sections=[...grouped.values()];
      const hasGuide=sections.some(item=>item.items.some(q=>q?.lesson_intro));
      const cards=[];
      if(hasGuide){
        cards.push(folder(`${topic}.1. H\u01b0\u1edbng d\u1eabn`,
          `Ki\u1ebfn th\u1ee9c n\u1ec1n t\u1ea3ng \u00b7 Quan s\u00e1t \u00b7 Hi\u1ec3u \u00b7 L\u00e0m m\u1eabu`,
          '\ud83d\udcd6','discover-topic-guide',`data-topic="${topic}"`,
          'H\u1ecdc t\u00f9y ch\u1ecdn',false,'m3-discover-guide-card'));
      }
      sections.forEach((item,index)=>{
        const ui=discoverSubUi(topic,item.id,item.name);
        const attrs=`data-topic="${topic}" data-sub="${e(item.id)}"`;
        const code=`${topic}.${index+(hasGuide?2:1)}`;
        cards.push(folder(`${code}. ${ui.title}`,ui.desc||`${item.items.length} c\u00e2u h\u1ecfi`,
          ui.icon,'discover-sub',attrs,`${item.items.length} c\u00e2u \u00b7 Luy\u1ec7n ngay`));
      });
      root.innerHTML=head(`${topic}. ${TOPICS[topic-1][0]}`,
        'Ch\u1ecdn m\u1ee5c Luy\u1ec7n t\u1eadp \u0111\u1ec3 v\u00e0o th\u1eb3ng c\u00e2u h\u1ecfi. H\u01b0\u1edbng d\u1eabn l\u00e0 m\u1ee5c \u0111\u1ea7u ti\u00ean, kh\u00f4ng b\u1eaft bu\u1ed9c.')+
        list(cards,`m3-discover-sub-grid m3-discover-topic-grid${cards.length<=4?' m3-discover-topic-grid--compact':''}`);
    } catch(err){if(validLive(nonce))errorView(err);}
  }
  // Topic 3.3 opens six independent practice banks; none is mixed into another.
  async function showDiscoverNestedTopic(topic=3){
    if(topic!==3)return showDiscoverTopic(topic);
    const nonce=++renderNonce;cleanView();setPage('discover','subtopic',{
      topic:3,sub:'3',title:'3.3. Các bảng nhân, chia mới'
    });loading();
    try{
      const d=await load('discover1');if(!validLive(nonce))return;
      const cards=TOPIC3_TABLES.map(code=>{
        const ui=discoverSubUi(3,code.slice(2)),count=arr(d).filter(q=>q.learning_node===code).length;
        return folder(`${code}. ${ui.title}`,`Học theo SGK · ${ui.desc}`,ui.icon,
          'discover-leaf',`data-topic="3" data-sub="3" data-node="${e(code)}"`,
          `${count} câu · Luyện ngay`);
      });
      root.innerHTML=head('3.3. Các bảng nhân, chia mới',
          'Chọn riêng từng bảng để luyện; mỗi bảng có 50 câu, không trộn bảng khác.')+
          list(cards,'m3-discover-sub-grid m3-discover-topic-grid');
    }catch(err){if(validLive(nonce))errorView(err);}
  }
  // One independent guide per main topic; old guides remain accessible inside
  // it as optional sections. Switching sections does not enter any quiz.
  async function showDiscoverTopicGuide(topic,sectionId='') {
    const nonce=++renderNonce;
    cleanView();discoverGuideSource=null;
    setPage('discover','guide',{topic,sub:'guide',title:`${topic}.1. H\u01b0\u1edbng d\u1eabn`});
    loading();
    try {
      const d=await load(topic<=5?'discover1':'discover2');
      if(!validLive(nonce))return;
      const grouped=new Map();
      arr(d).forEach(q=>{
        const m=/^Q_(\d+)_(\d+)_/.exec(str(q?.id));
        if(n(m?.[1])!==topic || !q?.lesson_intro)return;
        if(!grouped.has(m[2]))grouped.set(m[2],{sub:m[2],source:[]});
        grouped.get(m[2]).source.push(q);
      });
      const guides=[...grouped.values()];
      if(!guides.length)return dialog('M\u1ee5c n\u00e0y ch\u01b0a c\u00f3 h\u01b0\u1edbng d\u1eabn.');
      const current=guides.find(x=>x.sub===str(sectionId))||guides[0];
      const allQuestions=arr(d).filter(q=>{
        const m=/^Q_(\d+)_(\d+)_/.exec(str(q?.id));
        return n(m?.[1])===topic && str(m?.[2])===current.sub;
      });
      const ui=discoverSubUi(topic,current.sub,allQuestions[0]?.sub);
      discoverGuideSource=allQuestions;
      page.guideSub=current.sub;
      const sectionButtons=guides.map((g,i)=>{
        const item=discoverSubUi(topic,g.sub,g.source[0]?.sub);
        return `<button type="button" class="m3-guide-section-tab${current.sub===g.sub?' active':''}" data-action="discover-guide-section" data-topic="${topic}" data-sub="${e(g.sub)}" aria-pressed="${current.sub===g.sub}">${i+1}. ${e(item.title)}</button>`;
      }).join('');
      root.innerHTML=head(`${topic}.1. H\u01b0\u1edbng d\u1eabn - ${TOPICS[topic-1][0]}`,
          'H\u1ecdc khi c\u1ea7n; c\u00f3 th\u1ec3 ch\u1ecdn th\u1eb3ng b\u00e0i luy\u1ec7n \u1edf danh s\u00e1ch.')+
        `<div class="m3-guide-sections" role="group" aria-label="Ch\u1ecdn n\u1ed9i dung h\u01b0\u1edbng d\u1eabn">${sectionButtons}</div>`+
        `<h3 class="m3-guide-section-heading">${e(ui.title)}</h3>`+
        guideHtml(allQuestions,ui.title);
    }catch(err){if(validLive(nonce))errorView(err);}
  }
  async function showDiscoverSub(topic,sub,node='') {
    if(topic===3 && str(sub)==='3' && !node) return showDiscoverNestedTopic(topic);
    const nonce=++renderNonce;
    const d=topic<=5?await load('discover1'):await load('discover2');
    if(!validLive(nonce))return;
    const nodeKey=topic===3?(node||`3.${sub}`):'';
    if(topic===3 && !TOPIC3_NODES.includes(nodeKey)) return dialog('Mục luyện tập không hợp lệ.');
    const source=arr(d).filter(q=>{
      if(topic===3)return str(q.learning_node)===nodeKey;
      const p=/^Q_(\d+)_(\d+)_/.exec(str(q.id));
      return n(p?.[1])===topic&&str(p?.[2])===str(sub);
    });
    if(topic===3 && source.length<50)return dialog('Kho câu hỏi của mục này chưa đủ 50 câu. Vui lòng cập nhật dữ liệu JSON.');
    if(!source.length)return dialog('Chưa có câu hỏi cho mục này.');
    const code=topic===3?nodeKey:`${topic}.${n(sub)+1}`;
    const ui=topic===3?discoverSubUi(3,code.slice(2)):discoverSubUi(topic,sub,source[0].sub);
    const title=`${code}. ${ui.title}`;
    discoverGuideSource=null;
    startLocalQuiz('discover',source,title,{topic,sub,node:nodeKey});
  }
  // Guard against stale/mismatched JSON: the drawing must solve the SAME question.
  function verifiedMultiplicationVisual(q) {
    const vm=q?.visual_model;
    if(!vm || typeof vm!=='object')return null;
    if(vm.kind==='multiplication_setup'){
      const a=Number(vm.a),b=Number(vm.b),answer=str(q.a).trim().replace(/\s/g,'');
      return Number.isSafeInteger(a)&&a>0&&a<=99999&&Number.isSafeInteger(b)&&b>=1&&b<=9&&a*b<=100000&&String(a*b)===answer
        ?{kind:'multiplication_setup',a,b}:null;
    }
    if(!/^Q_3_1_\d+$/.test(str(q?.id)))return vm;
    const question=str(q.q).trim(),answer=str(q.a).trim().replace(/\s/g,'');
    const unknown=question.match(/\u25a1\s*\u00d7\s*(\d+)\s*=\s*(\d+)\s*\?/);
    if(unknown){
      const b=Number(unknown[1]),product=Number(unknown[2]);
      if(Number.isSafeInteger(b)&&b>=1&&b<=9&&Number.isSafeInteger(product)&&product>0&&product%b===0&&String(product/b)===answer){
        return {kind:'multiplication_unknown_factor',multiplier:b,product};
      }
      return null;
    }
    const two=question.match(/^T\u00ednh theo \u0111\u00fang th\u1ee9 t\u1ef1:\s*(\d+)\s*\u00d7\s*(\d+)\s*\+\s*(\d+)\s*=\s*\?$/);
    if(two){
      const a=Number(two[1]),b=Number(two[2]),addend=Number(two[3]);
      if(Number.isSafeInteger(a)&&a>0&&a<=99999&&Number.isSafeInteger(b)&&b>=1&&b<=9&&Number.isSafeInteger(addend)&&addend>=0&&String(a*b+addend)===answer){
        return {kind:'multiplication_two_steps',a,b,addend};
      }
      return null;
    }
    // Do not present an a x b column when the sought answer is NOT a x b.
    const a=Number(vm.a),b=Number(vm.b);
    return Number.isSafeInteger(a)&&a>0&&a<=99999&&Number.isSafeInteger(b)&&b>=1&&b<=9&&String(a*b)===answer
      ?{kind:'multiplication_setup',a,b}:null;
  }
  function makeQuestion(q,source='generic') {
    if(source==='exam') return {id:str(q.question_id),q:q.question_text,o:q.options,a:q.answer,h:q.hint,skill:q.competency||q.skill_tag,score:n(q.score)};
    return {id:str(q.id),q:q.q,o:q.o,a:q.a,h:q.h,skill:q.competency||q.skill_tag||q.tag,illustration:q.illustration?.role==='topic_cover'?null:q.illustration,visual_model:verifiedMultiplicationVisual(q)};
  }
  // Short mathematical answers can share one row; descriptive answers stay readable.
  // This only chooses a CSS layout and never changes the order or value of answers.
  function choiceLayoutClass(choices) {
    const values=arr(choices).map(x=>str(x).replace(/\s+/g,' ').trim());
    const count=values.length;
    if(count<2||count>4)return 'm3-options m3-options--readable';
    const maxLength=Math.max(...values.map(x=>x.length));
    const averageLength=values.reduce((sum,x)=>sum+x.length,0)/count;
    if(maxLength>30||averageLength>20)return 'm3-options m3-options--readable';
    return `m3-options m3-options--${count===4?'four':count===3?'three':'two'}`;
  }
  // Khám phá: each run mixes all questions while keeping answers/hints/models attached.
  // Remember only the first public question ID per subtopic (also across F5 in this tab).
  function shuffleDiscoverQuestions(source,topic,sub) {
    const ordered=shuffle(source),key=`epsilon-class3-math-discover-first:${topic}.${sub}`;
    if(!ordered.length)return ordered;
    let previousId=lastDiscoverFirst.get(key)||'';
    if(!previousId){try{previousId=window.sessionStorage.getItem(key)||'';}catch(_){}}
    if(previousId&&ordered.length>1){
      const previous=source.find(q=>str(q.id)===previousId);
      const previousText=str(previous?.q).replace(/\s+/g,' ').trim();
      const firstText=str(ordered[0].q).replace(/\s+/g,' ').trim();
      if(str(ordered[0].id)===previousId||(previous&&firstText===previousText)){
        let other=ordered.findIndex((q,i)=>i>0&&str(q.id)!==previousId&&str(q.q).replace(/\s+/g,' ').trim()!==previousText);
        if(other<0)other=ordered.findIndex((q,i)=>i>0&&str(q.id)!==previousId);
        if(other>0)[ordered[0],ordered[other]]=[ordered[other],ordered[0]];
      }
    }
    const firstId=str(ordered[0].id);lastDiscoverFirst.set(key,firstId);
    try{window.sessionStorage.setItem(key,firstId);}catch(_){}
    return ordered;
  }
  function startLocalQuiz(tab,source,title,extra={}) {
    const questions=tab==='discover'?shuffleDiscoverQuestions(source,extra.topic,extra.node||extra.sub):source;
    cleanView();setPage(tab,'quiz',{title,...extra});
    quiz={mode:'local',kind:tab,title,questions:questions.map(q=>makeQuestion(q)),at:0,answers:new Map(),revealed:new Set(),wrongAttempts:new Map(),began:Date.now()};
    renderQuestion();
  }
  async function startOfficial(kind,id) {
    if(!requirePremium(kind==='baitap'?'Bài tập':'Đề thi'))return;
    const nonce=++renderNonce;stopSpeech();loading();
    try {
      const key=kind==='baitap'?(Number(id.slice(-2))<=34?'exercise1':'exercise2'):'exams';
      const data=await load(key);if(!validLive(nonce))return;
      let source=null, questions=[],semester='hk1', label='';
      if(kind==='baitap') {
        source=arr(data.bai_tap).find(x=>str(x.exercise_id)===id);
        if(!source) throw new Error('Không tìm thấy bài tập.');
        semester=source.semester===2?'hk2':'hk1';questions=arr(source.embedded_questions);label=`Bài ${source.source_lesson_no}: ${source.title}`;
      } else {
        source=arr(data.exams).find(x=>str(x.exam_id)===str(id));
        if(!source) throw new Error('Không tìm thấy đề thi.');
        semester=source.exam_type==='hsg_advanced'?'hsg':source.semester===2?'hk2':'hk1';questions=arr(source.questions);label=`${source.exam_category} · ${source.exam_name}`;
      }
      const ticket=await api('assessmentAttemptStart',{kind,semester,contentId:kind==='baitap'?source.exercise_id:String(source.exam_id)});
      if(!validLive(nonce))return;
      const ids=arr(ticket.questionIds).map(str),map=new Map(questions.map(q=>[str(kind==='baitap'?q.id:q.question_id),makeQuestion(q,kind==='baitap'?'generic':'exam')]));
      if(!ticket.attemptId||!ids.length||ids.some(q=>!map.has(q))||new Set(ids).size!==ids.length) throw new Error('Danh sách câu hỏi từ máy chủ không khớp dữ liệu Toán 3.');
      cleanView();setPage(kind==='baitap'?'exercises':'exams','quiz',{title:label});
      quiz={mode:'official',kind,id,semester,title:label,attemptId:ticket.attemptId,questions:ids.map(q=>map.get(q)),at:0,answers:new Map(),revealed:new Set(),began:Date.now(),totalSeconds:n(ticket.timeLimitSeconds)||0};
      renderQuestion();
      if(quiz.totalSeconds) startExamTimer();
    } catch(err){if(validLive(nonce)){errorView(new Error(err?.code==='FORBIDDEN'?'Cần có quyền học Toán 3 còn hiệu lực.':err?.code==='EXERCISE_LOCKED'?'Bé cần đạt 80% ở bài trước.':err?.message||'Chưa thể bắt đầu bài.'));}}
  }
  function startExamTimer() {
    const started=Date.now(),total=quiz.totalSeconds;
    const refresh=()=>{
      if(!quiz||quiz.mode!=='official'||quiz.kind!=='baithi') return stopTimer();
      const left=Math.max(0,total-Math.floor((Date.now()-started)/1000));
      const tag=find('[data-quiz-clock]');if(tag)tag.textContent=`${String(Math.floor(left/60)).padStart(2,'0')}:${String(left%60).padStart(2,'0')}`;
      if(left<=0){stopTimer();void submitOfficial();}
    };
    timer=setInterval(refresh,1000);refresh();
  }
  function countRight() {return !quiz?0:quiz.questions.reduce((s,q)=>s+(quiz.answers.get(q.id)===str(q.a)?1:0),0);}
  function questionSpeech(q) {
    const text=str(q?.q).trim();
    const expr=/^(?:Đặt tính rồi tính:\s*)?(\d{1,5})\s*([+\-×:])\s*(\d{1,5})\s*=\s*\?$/.exec(text);
    if(expr){
      const op={'+':'cộng','-':'trừ','×':'nhân',':':'chia'}[expr[2]];
      return `Bé ơi, ${expr[1]} ${op} ${expr[3]} bằng bao nhiêu?`;
    }
    const remain=/^(\d{1,2})\s*:\s*(\d)\s*=\s*\?\s*\(viết thương và số dư\)$/.exec(text);
    if(remain)return `Bé ơi, ${remain[1]} chia ${remain[2]} được bao nhiêu và dư mấy?`;
    return text;
  }
  function renderQuestion() {
    if(!quiz||!root)return;
    const q=quiz.questions[quiz.at],pos=quiz.at,len=quiz.questions.length;
    const chosen=quiz.answers.get(q.id),reveal=quiz.mode==='local' && quiz.revealed.has(q.id);
    const options=arr(q.o),clock=quiz.totalSeconds?'<span class="m3-clock" data-quiz-clock>40:00</span>':'';
    const mistakes=quiz.wrongAttempts?.get(q.id)||0,showAnswer=reveal&&(chosen===str(q.a)||mistakes>=2);
    const illustration=q.illustration?.role==='topic_cover'?null:q.illustration;
    let html=head(quiz.title,(quiz.kind==='baithi'?'Chế độ thi: không hiển thị đáp án trước khi nộp.':quiz.mode==='official'?'Kết quả sẽ được máy chủ kiểm tra.':'Chọn đáp án, sau đó xem giải thích.'),'hub');
    // Hướng dẫn là một mục học riêng ở danh sách, không chèn vào bài luyện tập.
    html+=`<div class="m3-question-card"><div class="m3-quiz-top"><span>${quiz.kind==='baithi'?'📝 Đề thi':quiz.kind==='exercises'?'✏️ Bài tập':'🔎 Luyện tập'}</span>${clock}<button class="m3-small" data-action="speak" data-text="${e(questionSpeech(q))}" title="Nghe câu hỏi">🔊 Nghe câu hỏi</button></div>
      <div class="m3-question-text">${e(q.q)}</div>${renderMathVisual(q.visual_model,reveal&&chosen===str(q.a),q.a)}${illustration?'<div data-question-illustration></div>':''}<div class="${choiceLayoutClass(options)}">${options.map((v,i)=>{
        const selected=chosen===str(v),correct=showAnswer&&str(v)===str(q.a),wrong=reveal&&selected&&!correct;
        return `<button type="button" class="m3-choice ${selected?'selected':''} ${correct?'correct':''} ${wrong?'wrong':''}" data-action="choose" data-option="${i}" aria-pressed="${selected}"><span>${'ABCD'[i]||i+1}</span>${e(v)}</button>`;
      }).join('')}</div>
      ${reveal?`<div class="m3-explain">${chosen===str(q.a)?'✅ Chính xác! Con hãy nói lại cách làm của mình.':mistakes>=2?`🌱 Con xem thêm đáp án đúng là ${e(q.a)} rồi thử tự giải lại.`:'🌱 Chưa đúng, con xem gợi ý và thử chọn lại nhé.'}${q.h?` <strong>${chosen===str(q.a)?'Cách kiểm tra':'Gợi ý'}:</strong> ${e(q.h)}`:''}</div>`:''}
      <div class="m3-quiz-nav"><button class="m3-nav" data-action="prev" ${pos===0?'disabled':''}>← Câu trước</button><span class="m3-count">${pos+1} / ${len}</span><button class="m3-nav primary" data-action="next" ${pos===len-1?'disabled':''}>Câu sau →</button></div>
      <div class="m3-quiz-footer"><span>Đã chọn: ${quiz.answers.size}/${len} câu</span><button class="m3-submit" data-action="submit">${quiz.mode==='official'?'Nộp bài và chấm điểm':'Xem kết quả'}</button></div></div>`;
    root.innerHTML=html;
    ctx?.hooks?.setScore?.(quiz.mode==='local'?countRight():0,quiz.mode==='local'?quiz.answers.size-countRight():0);
    if(illustration){const id=q.id,at=quiz.at;void imageHtml(illustration).then(html=>{if(quiz?.questions?.[quiz.at]?.id===id&&quiz.at===at){const slot=find('[data-question-illustration]');if(slot)slot.innerHTML=html;}});}
  }
  async function submitOfficial() {
    if(!quiz||quiz.mode!=='official'||quiz.submitting)return;
    const thisQuiz=quiz;quiz.submitting=true;
    stopTimer();find('[data-action="submit"]')?.setAttribute('disabled','');
    const payload={kind:thisQuiz.kind,semester:thisQuiz.semester,attemptId:thisQuiz.attemptId,answers:thisQuiz.questions.map(q=>({id:q.id,choice:thisQuiz.answers.get(q.id)||''}))};
    try {
      const outcome=await api('assessmentAttemptSubmit',payload);
      if(thisQuiz!==quiz||!root?.isConnected)return;
      quiz=null;await getProgress(true).catch(()=>null);
      showResult(thisQuiz,outcome);
    } catch(err){
      if(thisQuiz!==quiz)return;
      thisQuiz.submitting=false;
      dialog('Không lưu được kết quả: '+(err?.code==='UNAUTHORIZED'?'Phiên đã hết hạn, hãy đăng nhập lại.':err?.code==='ATTEMPT_EXPIRED'?'Lượt làm bài đã hết hạn.':err?.code==='ASSESSMENT_CONTENT_UNAVAILABLE'?'Máy chủ chưa truy cập được JSON Toán 3 trên website.':err?.code==='ASSESSMENT_CONTENT_CHANGED'?'Dữ liệu Toán 3 vừa được cập nhật. Bé hãy bắt đầu lượt mới.':'Vui lòng thử lại khi có mạng.'));
      renderQuestion();
    }
  }
  function showResult(previous,result) {
    cleanView();setPage(previous.kind==='baitap'?'exercises':'exams','result',{title:previous.title});
    const total=n(result.totalQuestions),right=n(result.correct),pass=!!result.passed;
    const skill=Object.entries(result.competencies||{}).map(([key,val])=>`<li><strong>${e(key)}</strong>: ${e(val.status||'Chưa đánh giá')}${val.status==='Đã đánh giá'?` · ${n(val.percent)}%`:''}</li>`).join('');
    const incorrect=arr(result.wrongQuestions).map(x=>`<li>${e(x.id)} — <strong>Đáp án:</strong> ${e(x.answer||'')} ${x.hint?` · ${e(x.hint)}`:''}</li>`).join('');
    root.innerHTML=head('Kết quả · '+previous.title,'Kết quả chính thức từ Apps Script')+`<section class="m3-result"><div class="m3-medal">${pass?'🏆':'🌱'}</div><h3>${right}/${total} câu đúng${previous.kind==='baithi'?` · ${n(result.score).toFixed(1)} / ${n(result.maxScore).toFixed(1)} điểm`:` · ${n(result.percent)}%`}</h3><p>${e(result.message|| (pass?'Con đã đạt yêu cầu 80%':'Con có thể luyện lại để tiến bộ.'))}</p>${previous.kind==='baitap'?`<p>${pass?'Bài tập tiếp theo đã được mở khóa trên máy chủ.':'Chưa đạt mức 80%, bé luyện lại nhé.'}</p>`:''}${skill?`<h4>Đánh giá năng lực</h4><ul>${skill}</ul>`:''}${incorrect?`<h4>Câu cần xem lại</h4><ul>${incorrect}</ul>`:''}<button class="m3-submit" data-action="back" data-target="hub">Quay lại danh sách</button></section>`;
    ctx?.hooks?.setScore?.(right,total-right);
  }
  function showLocalResult() {
    if(!quiz)return;
    const q=quiz,score=countRight();
    const location=q.kind==='discover'?{topic:page.topic,sub:page.sub,node:page.node}:{};
    cleanView();setPage(q.kind,'result',{title:q.title,...location});
    root.innerHTML=head('Kết quả luyện tập',q.title)+`<section class="m3-result"><div class="m3-medal">🌟</div><h3>${score} / ${q.questions.length} câu đúng</h3><p>Bé có thể làm lại để hiểu hơn. Kết quả luyện tập này không mở khóa Bài tập chính thức.</p><button class="m3-submit" data-action="back" data-target="hub">Quay lại</button></section>`;
  }
  async function getProgress(force=false) {
    if(!authenticated()||!premium()){progress=null;return null;}
    if(progress&&!force) return progress;
    const d=await api('assessmentProgressGet',{});
    progress=d;return d;
  }
  function practiceFor(id,type){
    if(!practiceState[id]||practiceState[id].type!==type)practiceState[id]={type,mode:type==='shape_drawing'?'square':type==='clock_calendar'?'clock':'',points:[],cells:[],feedback:'',values:{},step:0};
    return practiceState[id];
  }
  function clockSvg(hour=8,minute=35){
    hour=safeInt(hour,1,12);minute=safeInt(minute,0,59);
    const angle=(degrees,length)=>{const r=degrees*Math.PI/180;return [125+length*Math.sin(r),125-length*Math.cos(r)];};
    const H=angle(((hour%12)+minute/60)*30,58),M=angle(minute*6,88);
    const ticks=Array.from({length:12},(_,i)=>{const pos=angle((i+1)*30,103);return `<text x="${pos[0]}" y="${pos[1]+5}" text-anchor="middle" font-weight="800" font-size="16" fill="#5b216e">${i+1}</text>`;}).join('');
    return `<svg class="m3-practical-svg" viewBox="0 0 250 250" role="img" aria-label="Đồng hồ kim chỉ ${hour} giờ ${minute} phút"><circle cx="125" cy="125" r="118" fill="#fff" stroke="#8b5cf6" stroke-width="5"/>${ticks}<line x1="125" y1="125" x2="${H[0]}" y2="${H[1]}" stroke="#ec4899" stroke-width="7" stroke-linecap="round"/><line x1="125" y1="125" x2="${M[0]}" y2="${M[1]}" stroke="#2563eb" stroke-width="4" stroke-linecap="round"/><circle cx="125" cy="125" r="6" fill="#7c3aed"/></svg>`;
  }
  function drawingSvg(state){
    const scale=(v)=>38+safeInt(v,0,6)*36;
    const dots=Array.from({length:49},(_,i)=>{const x=i%7,y=Math.floor(i/7);return `<circle cx="${scale(x)}" cy="${scale(y)}" r="7" fill="#faf5ff" stroke="#a78bfa" stroke-width="2" data-action="practice-point" data-x="${x}" data-y="${y}"/>`;}).join('');
    const pts=arr(state.points),path=pts.map(p=>`${scale(p.x)},${scale(p.y)}`).join(' ');
    let drawing='';
    if(state.mode==='circle'&&pts.length>1){const radius=Math.hypot(pts[0].x-pts[1].x,pts[0].y-pts[1].y)*36;drawing=`<circle cx="${scale(pts[0].x)}" cy="${scale(pts[0].y)}" r="${radius}" fill="#f3e8ff" fill-opacity=".4" stroke="#db2777" stroke-width="3"/>`;}
    else if(pts.length>1)drawing=`<polyline points="${path}${pts.length===4?' '+path.split(' ')[0]:''}" fill="${pts.length===4?'#ede9fe':'none'}" fill-opacity=".65" stroke="#db2777" stroke-width="3" stroke-linejoin="round"/>`;
    return `<svg class="m3-practical-svg" viewBox="0 0 295 295" aria-label="Bảng lưới điểm để dựng hình">${drawing}${dots}</svg>`;
  }
  function practicalHtml(cfg,id){
    const type=str(cfg.type),state=practiceFor(id,type);
    state.instruction=str(cfg.instruction||state.instruction||'Thực hành bằng mô hình trực quan.');
    let content='';
    if(type==='shape_drawing'){
      const mode=state.mode||'square';
      content=`<p>Chọn hình cần vẽ, rồi chạm lần lượt các điểm trên lưới. Với hình tròn, điểm đầu là tâm và điểm thứ hai nằm trên đường tròn.</p><div class="m3-practical-controls">${[['square','Hình vuông'],['rectangle','Hình chữ nhật'],['circle','Hình tròn']].map(([key,label])=>`<button class="m3-sem ${mode===key?'active':''}" data-action="practice-mode" data-mode="${key}">${label}</button>`).join('')}<button class="m3-small" data-action="practice-reset">Xóa nét vẽ</button></div>${drawingSvg(state)}<p>Đã chọn: ${arr(state.points).length}/${mode==='circle'?2:4} điểm</p>`;
    }else if(type==='measurement'){
      const tasks=[['Thước đo','Điều chỉnh thước để chỉ 35 mm',35,'mm',0,100,5],['Cân','Cân được 450 g',450,'g',0,1000,50],['Bình chia vạch','Bình chứa 250 ml',250,'ml',0,500,25],['Nhiệt kế','Nhiệt kế chỉ 28°C',28,'°C',0,50,1]];
      const index=safeInt(state.step,0,3),[tool,prompt,target,unit,min,max,step]=tasks[index];
      const current=state.values.value??min;
      content=`<div class="m3-practical-controls"><strong>${index+1}/4 · ${e(tool)}</strong><span>${e(prompt)}</span></div><div class="m3-practical-symbols">${['📏','⚖️','🧪','🌡️'][index]}</div><input aria-label="Điều chỉnh số đo" data-practice-field="value" type="range" min="${min}" max="${max}" step="${step}" value="${safeInt(current,min,max)}" style="width:100%;accent-color:#8b5cf6"><p>Giá trị con chọn: <strong data-practical-value>${safeInt(current,min,max)} ${e(unit)}</strong></p><div class="m3-practical-controls"><button class="m3-small" data-action="practice-prev-step" ${index===0?'disabled':''}>← Dụng cụ trước</button><button class="m3-small" data-action="practice-next-step" ${index===3?'disabled':''}>Dụng cụ tiếp →</button></div>`;
    }else if(type==='count_area'){
      const selected=new Set(arr(state.cells)),target=12;
      content=`<p>Hãy tô đúng <strong>${target} ô</strong>. Mỗi ô ứng với 1 cm²; tự đếm diện tích vừa tô.</p><div class="m3-practical-grid" style="--m3-cols:5">${Array.from({length:20},(_,i)=>`<button type="button" data-action="practice-cell" data-index="${i}" class="${selected.has(i)?'selected':''}" aria-pressed="${selected.has(i)}" aria-label="Ô số ${i+1}"></button>`).join('')}</div><p>Đã tô <strong>${selected.size}</strong> ô: diện tích <strong>${selected.size} cm²</strong>.</p><button class="m3-small" data-action="practice-reset">Tô lại từ đầu</button>`;
    }else if(type==='build_area'){
      const length=safeInt(state.values.length??3,1,7),width=safeInt(state.values.width??2,1,6);
      content=`<p>Hãy dựng hình chữ nhật <strong>dài 6 ô và rộng 4 ô</strong>. Mỗi ô có diện tích 1 cm².</p><div class="m3-practical-controls"><label>Chiều dài <select class="m3-practical-select" data-practice-field="length">${Array.from({length:7},(_,i)=>`<option value="${i+1}" ${length===i+1?'selected':''}>${i+1} ô</option>`).join('')}</select></label><label>Chiều rộng <select class="m3-practical-select" data-practice-field="width">${Array.from({length:6},(_,i)=>`<option value="${i+1}" ${width===i+1?'selected':''}>${i+1} ô</option>`).join('')}</select></label></div>${gridModel(width,length,width*length)}<p>Diện tích con vừa dựng: ${length} × ${width} = <strong>${length*width} cm²</strong>.</p>`;
    }else if(type==='clock_calendar'){
      const mode=state.mode||'clock';
      content=`<div class="m3-practical-controls"><button class="m3-sem ${mode==='clock'?'active':''}" data-action="practice-mode" data-mode="clock">🕒 Đồng hồ</button><button class="m3-sem ${mode==='calendar'?'active':''}" data-action="practice-mode" data-mode="calendar">📅 Lịch</button></div>`;
      if(mode==='clock'){
        const hour=safeInt(state.values.hour??12,1,12),minute=safeInt(state.values.minute??0,0,59);
        content+=`<p>Con hãy đặt đồng hồ chỉ <strong>8 giờ 35 phút</strong>.</p>${clockSvg(hour,minute)}<div class="m3-practical-controls"><label>Giờ <select class="m3-practical-select" data-practice-field="hour">${Array.from({length:12},(_,i)=>`<option value="${i+1}" ${hour===i+1?'selected':''}>${i+1}</option>`).join('')}</select></label><label>Phút <select class="m3-practical-select" data-practice-field="minute">${Array.from({length:12},(_,i)=>`<option value="${i*5}" ${minute===i*5?'selected':''}>${String(i*5).padStart(2,'0')}</option>`).join('')}</select></label></div>`;
      }else{
        const sel=state.values.day||0;
        content+='<p>Đây là lịch mẫu: ngày 1 là thứ Hai. <strong>Hãy chọn ngày thứ Hai thứ ba của tháng.</strong></p><div class="m3-practical-calendar">'+['T2','T3','T4','T5','T6','T7','CN'].map(x=>`<span><strong>${x}</strong></span>`).join('')+Array.from({length:30},(_,i)=>`<button type="button" data-action="practice-day" data-day="${i+1}" class="${sel===i+1?'selected':''}">${i+1}</button>`).join('')+'</div>';
      }
    }else if(type==='data_survey'){
      const values=state.values,observations=['🔴','🔵','🟡','🔵','🔴','🟡','🔴','🔵','🔴','🟡','🔵','🔴'];
      content=`<p>Quan sát 12 thẻ màu. Con tự đếm từng màu, ghi kết quả vào bảng rồi nhấn kiểm tra.</p><div class="m3-practical-symbols" aria-label="12 thẻ màu">${observations.join(' ')}</div><div class="m3-practical-controls">${[['red','Đỏ'],['blue','Xanh'],['yellow','Vàng']].map(([key,title])=>`<label>${title} <input class="m3-practical-select" aria-label="Số thẻ ${title}" type="number" min="0" max="12" step="1" data-practice-field="${key}" value="${e(values[key]??'')}"></label>`).join('')}</div>`;
    }
    return `<div class="m3-practical"><h3>🧩 Thực hành bằng thao tác</h3><p>${e(cfg.instruction)}</p>${content}<div class="m3-practical-controls"><button class="m3-submit" data-action="practice-check">Kiểm tra hoạt động</button></div>${state.feedback?`<p class="m3-practical-msg" role="status">${e(state.feedback)}</p>`:''}<p class="m3-caption">Đây là phần luyện tự học, không tự ghi điểm hoặc mở khóa trên máy chủ.</p></div>`;
  }
  function practiceRefresh(){
    const dest=find('[data-practical-root]');
    if(!dest||!page?.id)return;
    const source=practiceState[page.id],config=source&&{
      type:source.type,instruction:({shape_drawing:'Vẽ hình bằng cách nối các điểm trên lưới.',measurement:'Quan sát số đo và dụng cụ.',count_area:'Tô đúng các ô diện tích.',build_area:'Dựng hình từ số hàng và số cột.',clock_calendar:'Đặt giờ và xem lịch.',data_survey:'Thu thập và ghi số liệu.'})[source.type]};
    if(config){config.instruction=source.instruction||config.instruction;dest.innerHTML=practicalHtml(config,page.id);}
  }
  function shapeValid(pts,mode){
    if(mode==='circle')return pts.length===2&&Math.hypot(pts[0].x-pts[1].x,pts[0].y-pts[1].y)>0;
    if(pts.length!==4)return false;
    const v=pts.map((p,i)=>({x:pts[(i+1)%4].x-p.x,y:pts[(i+1)%4].y-p.y}));
    if(v.some(p=>!p.x&&!p.y))return false;
    if(!v.every((p,i)=>p.x*v[(i+1)%4].x+p.y*v[(i+1)%4].y===0))return false;
    const l=v.map(p=>p.x*p.x+p.y*p.y);
    return l[0]===l[2]&&l[1]===l[3]&&(mode!=='square'||l[0]===l[1]);
  }
  function practicalCheck(state){
    if(state.type==='shape_drawing')return shapeValid(arr(state.points),state.mode)?'Đúng rồi! Con đã dựng được hình. Hãy thử dùng thước và ê ke hoặc com-pa thật để đối chiếu.':'Con kiểm tra số điểm và các góc vuông. Hình tròn cần tâm và một điểm trên đường tròn.';
    if(state.type==='measurement'){
      const tasks=[35,450,250,28],goal=tasks[safeInt(state.step,0,3)];
      return Number(state.values.value)===goal?'Đúng rồi! Con đã đọc đúng số đo và đơn vị của dụng cụ này.':'Hãy đối chiếu vạch chia và đơn vị của dụng cụ, rồi chỉnh về số đo mà bài yêu cầu.';
    }
    if(state.type==='count_area')return arr(state.cells).length===12?'Chính xác! 12 ô, mỗi ô 1 cm² nên diện tích bằng 12 cm².':'Đếm lại từng ô đã tô, con cần đúng 12 ô.';
    if(state.type==='build_area')return Number(state.values.length)===6&&Number(state.values.width)===4?'Giỏi lắm! 6 cột và 4 hàng tạo 24 ô, diện tích là 24 cm².':'Dài 6 ô và rộng 4 ô. Hãy chọn đúng cả hai kích thước rồi đếm ô.';
    if(state.type==='clock_calendar'){
      if(state.mode==='calendar')return Number(state.values.day)===15?'Đúng rồi! Thứ Hai rơi vào ngày 1, 8 và 15.':'Bắt đầu từ ngày 1 thứ Hai, cứ cộng thêm 7 ngày để tìm thứ Hai tiếp theo.';
      return Number(state.values.hour)===8&&Number(state.values.minute)===35?'Đúng rồi! Kim giờ ở khoảng sau số 8 và kim phút ở số 7.':'Hãy xem lại: kim phút chỉ số 7 tức 35 phút; kim giờ nằm sau số 8.';
    }
    if(state.type==='data_survey')return Number(state.values.red)===5&&Number(state.values.blue)===4&&Number(state.values.yellow)===3?'Đúng rồi! Có 5 thẻ đỏ, 4 thẻ xanh, 3 thẻ vàng; tổng cộng 12 thẻ.':'Con đếm từng loại thẻ từ trái sang phải, rồi kiểm tra tổng ba nhóm bằng 12.';
    return 'Con kiểm tra lại dữ kiện và thử tiếp nhé.';
  }
  function practicalAction(action,button){
    const state=practiceState[page?.id];if(!state)return;
    state.feedback='';
    if(action==='practice-mode'){
      state.mode=button.dataset.mode;state.points=[];
    }else if(action==='practice-reset'){state.points=[];state.cells=[];}
    else if(action==='practice-point'){
      const limit=state.mode==='circle'?2:4;
      if(state.points.length>=limit)state.points=[];
      state.points.push({x:safeInt(button.dataset.x,0,6),y:safeInt(button.dataset.y,0,6)});
    }else if(action==='practice-cell'){
      const id=safeInt(button.dataset.index,0,19),s=new Set(arr(state.cells));s.has(id)?s.delete(id):s.add(id);state.cells=[...s];
    }else if(action==='practice-prev-step'||action==='practice-next-step'){
      state.step=safeInt(state.step+(action==='practice-next-step'?1:-1),0,3);state.values.value='';
    }else if(action==='practice-day')state.values.day=safeInt(button.dataset.day,1,30);
    else if(action==='practice-check')state.feedback=practicalCheck(state);
    practiceRefresh();
  }

  async function showLesson(id,index=0) {
    if(!requirePremium('Bài học'))return;
    const nonce=++renderNonce;stopSpeech();loading();
    try {
      const data=await load('lessons');if(!validLive(nonce))return;
      const lesson=arr(data.bai_hoc).find(x=>str(x.lesson_id)===id);
      if(!lesson) throw new Error('Không tìm thấy bài học.');
      lessonPage=Math.max(0,Math.min(index,arr(lesson.pages).length-1));
      const p=lesson.pages[lessonPage];setPage('lessons','lesson',{id,title:`Bài ${lesson.source_lesson_no} · ${lesson.source_title}`});
      let content='';
      if(p.page_type==='explore'){
        content=`<p class="m3-lead">${e(p.intro||'')}</p><p>${e(p.story||'')}</p>`;
        content+=renderMathVisual(p.lesson_visual);
        if(!p.lesson_visual)content+=await imageHtml(p.illustration);
        if(p.visual_scene) content+=`<p class="m3-note">👀 ${e(p.visual_scene)}</p>`;
        content+=`<div class="m3-knowledge">${arr(p.knowledge_cards).map(x=>`<article><strong>${e(x.title)}</strong><p>${e(x.text)}</p></article>`).join('')}</div>`;
        if(arr(p.worked_examples).length)content+=`<h3>✏️ Ví dụ có hướng dẫn</h3>${arr(p.worked_examples).map(x=>`<p class="m3-example">${e(x)}</p>`).join('')}`;
        if(arr(p.micro_steps).length)content+=`<h3>👣 Từng bước thực hiện</h3><ol>${p.micro_steps.map(x=>`<li>${e(x)}</li>`).join('')}</ol>`;
        if(p.common_mistake) content+=`<p class="m3-note">💡 ${e(p.common_mistake)}</p>`;
        if(p.self_check)content+=`<p class="m3-self-check">🎯 ${e(p.self_check)}</p>`;
      } else if(p.page_type==='practice') {
        content=Array.isArray(p.practice_strategy)?`<div class="m3-note"><strong>Cách làm từng bước:</strong><ol>${p.practice_strategy.map(x=>`<li>${e(x)}</li>`).join('')}</ol></div>`:`<p>${e(p.practice_strategy||'Con hãy chọn đáp án đúng trong các câu sau.')}</p>`;
        if(p.practical_activity)content+=`<section class="m3-practical-root" data-practical-root>${practicalHtml(p.practical_activity,id)}</section>`;
        content+=arr(p.items).map((item,j)=>{const key=`${id}_${j}`,chosen=lessonChoice[key];return `<div class="m3-guided"><strong>${j+1}. ${e(item.prompt)}</strong><div class="${choiceLayoutClass(item.options)}">${arr(item.options).map((o,i)=>`<button class="m3-choice ${chosen===str(o)?'selected':''}" data-action="lesson-choose" data-question="${j}" data-option="${i}">${e(o)}</button>`).join('')}</div>${chosen?`<p class="${chosen===str(item.answer)?'m3-good':'m3-bad'}">${chosen===str(item.answer)?'✅ Đúng rồi! Con hãy tự giải thích nhé.':'🌱 Chưa đúng, con xem gợi ý rồi thử lại nhé!'} ${e(item.hint||'')}</p>`:''}</div>`;}).join('');
        if(arr(p.extra_examples).length) content+=`<h3>Ví dụ mở rộng</h3>${p.extra_examples.map(x=>`<p>${e(x)}</p>`).join('')}`;
        if(p.feedback_on_wrong)content+=`<p class="m3-note">💡 ${e(p.feedback_on_wrong)}</p>`;
      } else {
        content=`<h3>🌟 Ghi nhớ kiến thức</h3><ul>${arr(p.key_points).map(x=>`<li>${e(x)}</li>`).join('')}</ul>`;
        content+=`<p class="m3-note">${e(p.finish_prompt||'Con hãy nói lại điều mình vừa học nhé!')}</p>`;
        if(arr(p.quick_check).length)content+=`<h3>🎯 Tự kiểm tra</h3><ul>${p.quick_check.map(x=>`<li>${e(x)}</li>`).join('')}</ul>`;
        if(arr(p.connections).length)content+=`<h3>🔗 Vận dụng</h3><ul>${p.connections.map(x=>`<li>${e(x)}</li>`).join('')}</ul>`;
      }
      if(!validLive(nonce))return;
      root.innerHTML=head(`Bài ${lesson.source_lesson_no} · ${lesson.source_title}`,`Trang ${lessonPage+1} / ${lesson.pages.length}`)+`<section class="m3-paper"><div class="m3-page-tabs">${arr(lesson.pages).map((x,i)=>`<button class="m3-sem ${i===lessonPage?'active':''}" data-action="lesson-page" data-index="${i}">${e(x.title||`Trang ${i+1}`)}</button>`).join('')}</div><div class="m3-lesson-body"><div class="m3-lab-actions"><button class="m3-small" data-action="lesson-speak">🔊 Nghe bài giảng</button><button class="m3-small" data-action="lesson-stop">🔇 Dừng đọc</button></div>${content}</div><div class="m3-quiz-nav"><button class="m3-nav" data-action="lesson-page" data-index="${lessonPage-1}" ${lessonPage===0?'disabled':''}>← Trang trước</button><span class="m3-count">${lessonPage+1} / ${lesson.pages.length}</span><button class="m3-nav primary" data-action="lesson-page" data-index="${lessonPage+1}" ${lessonPage===lesson.pages.length-1?'disabled':''}>Trang sau →</button></div></section>`;
    } catch(err){if(validLive(nonce))errorView(err);}
  }
  async function showReview(id) {
    if(!requirePremium('Ôn tập'))return;
    const d=await load('review'),item=arr(d.on_tap).find(x=>x.review_id===id);
    if(!item)return dialog('Không tìm thấy bài ôn tập.');
    startLocalQuiz('review',shuffle(arr(item.embedded_questions)).slice(0,20),`Bài ${item.source_lesson_no} · ${item.title}`);
  }
  async function showExamCategory(semester) {
    if(!requirePremium('Đề thi'))return;
    const d=await load('exams');const exam=arr(d.exams).filter(x=>semester==='hsg'?x.exam_type==='hsg_advanced'||x.exam_category==='Học sinh giỏi':x.semester===n(semester)&&x.exam_type!=='hsg_advanced');
    setPage('exams','category',{semester,title:semester==='hsg'?'Học sinh giỏi':`Học kỳ ${semester}`});
    root.innerHTML=head(page.title,'Mỗi đề 13 câu · 40 phút · 10 điểm')+`<p class="m3-note">${semester==='hsg'?'Đề nâng cao không đưa vào sáu năng lực chuẩn.':'Kết quả năng lực chỉ được đánh giá khi có đủ câu hỏi theo năng lực.'}</p>${authenticated()?`<button class="m3-sem" data-action="history" data-kind="baithi" data-sem="${semester==='hsg'?'hsg':'hk'+semester}">📋 Lịch sử đề thi</button>`:''}`+list(exam.map(x=>folder(x.exam_name,`${x.time_limit_minutes} phút · 13 câu`,semester==='hsg'?'🌟':'📝','exam',`data-id="${n(x.exam_id)}"`,'Làm đề')));
  }
  async function showHistory(kind,semester) {
    if(!requirePremium('Lịch sử học'))return;
    const nonce=++renderNonce;loading();
    try {
      const d=await api('assessmentHistoryGet',{kind,semester});if(!validLive(nonce))return;
      const rows=arr(d.history).slice(0,100);
      setPage(kind==='baitap'?'exercises':'exams','history',{title:'Lịch sử học'});
      root.innerHTML=head('Lịch sử '+(kind==='baitap'?'Bài tập':'Đề thi'),semester.toUpperCase())+
        (rows.length?`<div class="m3-history">${rows.map(x=>`<article><strong>${e(x.BaiId||x.DeId||'Bài')}</strong> · ${e(x.Timestamp||'')}<p>${e(x.SoCauDung||0)} / ${e(x.TongCauHoi||0)} đúng ${x.DiemSo!==undefined?'· '+e(x.DiemSo)+' điểm':''}</p></article>`).join('')}</div>`:'<p class="m3-note">Chưa có lượt làm bài được lưu.</p>');
    } catch(err){if(validLive(nonce))errorView(err);}
  }

  // Math Lab uses the canonical 9 labs and 88 journeys. Progress is local exploration
  // telemetry only, never a backend entitlement or an exercise-unlock credential.
  function labKey() {return 'epsilon-class3-math-lab-'+(ctx?.user?.userId||'guest');}
  function labSaved() {try{return JSON.parse(localStorage.getItem(labKey())||'{}')||{};}catch(_){return {};}}
  function markLab(id) {const d=labSaved();d[id]=Date.now();try{localStorage.setItem(labKey(),JSON.stringify(d));}catch(_){} }
  async function showLabHome() {
    const nonce=++renderNonce;stopSpeech();loading();
    try {
      const d=await load('lab');if(!validLive(nonce))return;
      setPage('discover','lab-home',{topic:12,title:'12. Math Lab'});
      root.innerHTML=head('12. Math Lab – Toán tư duy Mỹ','9 Lab · 88 hành trình · 352 hoạt động')+list(arr(d.labs).map(l=>{
        const labNumber=n(/^12\.(\d+)$/.exec(str(l.display_code))?.[1]);
        return folder(l.title,l.subtitle,LAB_HOME_ICONS[labNumber-1]||'✨','lab-track',`data-id="${e(l.display_code)}"`,`${arr(l.journeys).length} hành trình`);
      }),'m3-lab-home-grid');
    } catch(err){if(validLive(nonce))errorView(err);}
  }
  async function showLabTrack(code) {
    // Attempt to obtain verified SGK milestones before displaying a gated journey.
    // A static JSON file is public: the server must separately enforce private entitlements.
    if(authenticated()&&premium()&&!progress)await getProgress().catch(()=>null);
    const d=await load('lab'),lab=arr(d.labs).find(l=>l.display_code===code);if(!lab)return;
    currentLab=lab;setPage('discover','lab-track',{topic:12,code,labTitle:lab.title,title:lab.title});
    const saved=labSaved();
    root.innerHTML=head(lab.title,lab.subtitle||'Các hành trình theo SGK')+list(arr(lab.journeys).map((j,i)=>{
      const done=arr(j.activities).filter(a=>saved[a.id]).length;
      const locked=!!(premium()&&authenticated()&&progress&&n(j.unlock_after_source_lesson)>0&&
        !hasLearnedSourceLesson(n(j.unlock_after_source_lesson)));
      return folder(j.title,j.goal,j.icon||'🧩','lab-journey',`data-index="${i}"`,locked?'Cần học bài SGK tương ứng':`${done}/${arr(j.activities).length} hoạt động`,locked);
    }));
  }
  function hasLearnedSourceLesson(sourceNo) {
    // Gate only uses server-confirmed completed lesson sequence, never local passed=true.
    // Main learning lessons are 1..58, SGK source numbers include separate review lessons.
    const all=progress?.sourceLessonsPassed || [];
    return all.some(x=>n(x)>=sourceNo);
  }
  function getActivity() {return currentJourney?.activities?.[n(page.activity)] || null;}
  function valueOfLab() {return labChoices[getActivity()?.id];}
  function setValueOfLab(val) {const activity=getActivity();if(activity)labChoices[activity.id]=val;}
  function numberField(name,value,min=0,max=99999,step=1) {return `<label class="m3-lab-number">${e(name)}<input type="number" data-lab-field="${e(name)}" min="${min}" max="${max}" step="${step}" value="${e(value??'0')}"></label>`;}
  function labActivityControls(a) {
    const v=valueOfLab();
    if(a.type==='choices'){
      const sel=Array.isArray(v)?v:[v];return `<div class="${choiceLayoutClass(a.choices)}">${arr(a.choices).map((x,i)=>`<button class="m3-choice ${sel.includes(i)?'selected':''}" data-action="lab-choice" data-index="${i}">${e(x)}</button>`).join('')}</div>`;
    }
    if(a.type==='number_input'||a.type==='equal_share')return numberField(a.type==='equal_share'?'Mỗi nhóm có bao nhiêu?':'Nhập kết quả',v??'',-100000,100000,1);
    if(a.type==='place_value_build'){
      const obj=v&&typeof v==='object'&&!Array.isArray(v)?v:{};
      return `<div class="m3-lab-fields">${Object.keys(a.expected||{}).map(k=>numberField(({ten_thousands:'Chục nghìn',thousands:'Nghìn',hundreds:'Trăm',tens:'Chục',ones:'Đơn vị'})[k]||k,obj[k]??0,0,9)).join('')}</div>`;
    }
    if(a.type==='array_build'||a.type==='group_build'){
      const obj=v&&typeof v==='object'&&!Array.isArray(v)?v:{};
      return `<div class="m3-lab-fields">${numberField(a.type==='array_build'?'Số hàng':'Số nhóm',obj.a??1,1,100)}${numberField(a.type==='array_build'?'Số cột':'Mỗi nhóm',obj.b??1,1,100)}</div><div class="m3-model">${'🔵 '.repeat(Math.min(30,Math.max(1,n(obj.a)*n(obj.b))))}</div>`;
    }
    if(a.type==='fraction_model'){
      const sel=arr(v);return `<div class="m3-fraction">${Array.from({length:n(a.denominator)},(_,i)=>`<button class="${sel.includes(i)?'selected':''}" data-action="lab-fraction" data-index="${i}">${sel.includes(i)?'🟪':'⬜'}</button>`).join('')}</div>`;
    }
    if(a.type==='order_numbers'){
      const sel=arr(v);return `<p>Chạm các số theo thứ tự yêu cầu:</p><div class="${choiceLayoutClass(a.numbers)}">${arr(a.numbers).map((x,i)=>`<button class="m3-choice ${sel.includes(i)?'selected':''}" data-action="lab-order" data-index="${i}" ${sel.includes(i)?'disabled':''}>${e(x)}</button>`).join('')}</div><p>Đã chọn: ${sel.map(i=>e(a.numbers[i])).join(' → ')}</p><button class="m3-small" data-action="lab-clear">Làm lại thứ tự</button>`;
    }
    if(a.type==='open_number_line'||a.type==='measure_slider')return `<div class="m3-slider"><input type="range" data-lab-range min="${n(a.min)}" max="${n(a.max)}" step="1" value="${Number.isFinite(Number(v))?Number(v):n(a.min)}"><span data-lab-range-value>${Number.isFinite(Number(v))?Number(v):n(a.min)} ${e(a.unit||'')}</span></div>`;
    if(a.type==='clock_set'){
      const obj=v&&typeof v==='object'?v:{};
      return `<div class="m3-lab-clock">🕒</div><div class="m3-lab-fields">${numberField('Giờ',obj.hour??12,1,12)}${numberField('Phút',obj.minute??0,0,59)}</div>`;
    }
    if(a.type==='calendar_pick'){
      const days=n(a.days_in_month);const start=n(a.start_weekday);
      return `<div class="m3-calendar">${['T2','T3','T4','T5','T6','T7','CN'].map(x=>`<strong>${x}</strong>`).join('')}${Array.from({length:start},()=>'<span></span>').join('')}${Array.from({length:days},(_,i)=>`<button class="${v===i+1?'selected':''}" data-action="lab-day" data-day="${i+1}">${i+1}</button>`).join('')}</div>`;
    }
    if(a.type==='money_build'){
      const obj=v&&typeof v==='object'?v:{};
      const total=arr(a.denominations).reduce((s,d)=>s+d*n(obj[d]),0);
      return `<p>Đã ghép <strong>${total.toLocaleString('vi-VN')} đồng</strong></p><div class="m3-lab-fields">${arr(a.denominations).map(d=>numberField(`${n(d).toLocaleString('vi-VN')}đ`,obj[d]??0,0,30)).join('')}</div>`;
    }
    if(a.type==='data_tally'){
      const obj=v&&typeof v==='object'?v:{};
      return `<div class="m3-lab-fields">${arr(a.labels).map(x=>numberField(x,obj[x]??0,0,100)).join('')}</div>`;
    }
    return '<p class="m3-note">Chưa có bộ điều khiển phù hợp với hoạt động này.</p>';
  }
  function checkActivity(a,v) {
    if(a.type==='choices'){
      if(v===undefined||v===null)return false;
      const indices=arr(a.answer_indices);
      if(indices.length) return JSON.stringify(arr(v).slice().sort((a,b)=>a-b))===JSON.stringify(indices.slice().sort((a,b)=>a-b));
      return n(v)>=0&&str(a.choices?.[n(v)])===str(a.answer);
    }
    if(a.type==='number_input')return v!==undefined&&v!==null&&str(v).trim()!==''&&Number(v)===Number(a.target);
    if(a.type==='equal_share')return v!==undefined&&v!==null&&str(v).trim()!==''&&Number(v)===Number(a.answer_each);
    if(a.type==='place_value_build')return Object.entries(a.expected||{}).every(([k,val])=>n(v?.[k])===n(val));
    if(a.type==='array_build')return n(v?.a)===n(a.expected_rows)&&n(v?.b)===n(a.expected_cols);
    if(a.type==='group_build')return n(v?.a)===n(a.expected_groups)&&n(v?.b)===n(a.expected_per_group);
    if(a.type==='fraction_model')return arr(v).length===n(a.shade_count);
    if(a.type==='order_numbers')return JSON.stringify(arr(v).map(i=>a.numbers[i]))===JSON.stringify(a.answer);
    if(a.type==='open_number_line'||a.type==='measure_slider')return Math.abs(Number(v)-Number(a.target))<=n(a.tolerance);
    if(a.type==='clock_set')return n(v?.hour)===n(a.target_hour)&&n(v?.minute)===n(a.target_minute);
    if(a.type==='calendar_pick')return n(v)===n(a.target_day);
    if(a.type==='money_build')return arr(a.denominations).reduce((sum,d)=>sum+n(d)*n(v?.[d]),0)===n(a.target);
    if(a.type==='data_tally')return arr(a.labels).every((x,i)=>n(v?.[x])===n(a.targets?.[i]));
    return false;
  }
  function showJourney(index,activity=0) {
    if(!currentLab?.journeys?.[index])return;
    currentJourney=currentLab.journeys[index];labHintLevel=0;
    setPage('discover','lab-activity',{topic:12,code:currentLab.display_code,labTitle:currentLab.title,journeyIndex:index,activity,title:currentJourney.title});
    renderLabActivity();
  }
  function renderLabActivity() {
    const a=getActivity();if(!a)return;
    const at=n(page.activity),count=currentJourney.activities.length,done=!!labSaved()[a.id];
    const feedback=labChoices[a.id+'_checked'];
    const wrongHint=arr(a.hints)[Math.min(labHintLevel,arr(a.hints).length-1)]||a.wrong_audio||'Con thử lại nhé.';
    root.innerHTML=head(currentJourney.title,`Hoạt động ${at+1} / ${count}`,'lab-track')+`<section class="m3-paper"><h3>${e(a.teacher||'Cùng khám phá')}</h3><p class="m3-lead">${e(a.prompt||'')}</p><button class="m3-small" data-action="lab-speak">🔊 Nghe hướng dẫn</button>${labActivityControls(a)}${feedback?`<p class="${feedback==='ok'?'m3-good':'m3-bad'}">${e(feedback==='ok'?a.success||'Đúng rồi!':wrongHint)}${feedback==='ok'&&a.reflection_prompt?`<p>${e(a.reflection_prompt)}</p>`:''}</p>`:''}${labHintLevel>0?`<p class="m3-note">💡 ${e(arr(a.hints)[Math.min(labHintLevel-1,arr(a.hints).length-1)]||'')}</p>`:''}<div class="m3-lab-actions"><button class="m3-small" data-action="lab-hint">💡 Gợi ý ${labHintLevel}</button><button class="m3-submit" data-action="lab-check">Kiểm tra</button></div><div class="m3-quiz-nav"><button class="m3-nav" data-action="lab-step" data-diff="-1" ${at===0?'disabled':''}>← Hoạt động trước</button><span class="m3-count">${at+1} / ${count}${done?' ✅':''}</span><button class="m3-nav primary" data-action="lab-step" data-diff="1" ${at===count-1?'disabled':''}>Hoạt động sau →</button></div></section>`;
  }
  function labValueChanged(field,value,kind='number') {
    const a=getActivity();if(!a)return;
    if(kind==='range'){setValueOfLab(n(value));find('[data-lab-range-value]').textContent=str(value)+' '+str(a.unit||'');return;}
    const previous=valueOfLab();
    if(['number_input','equal_share'].includes(a.type)) setValueOfLab(value);
    else {const next=(previous&&typeof previous==='object'&&!Array.isArray(previous))?{...previous}:{};
      let key=field;
      if(a.type==='place_value_build')key=({Nghìn:'thousands',Trăm:'hundreds',Chục:'tens','Đơn vị':'ones','Chục nghìn':'ten_thousands'})[field]||field;
      else if(a.type==='array_build'||a.type==='group_build') key=(field==='Số hàng'||field==='Số nhóm')?'a':'b';
      else if(a.type==='clock_set')key=field==='Giờ'?'hour':'minute';
      else if(a.type==='money_build') key=str(field).replace(/\D/g,'');
      next[key]=Number(value);setValueOfLab(next);
    }
  }
  async function playGame(id) {
    if(!requirePremium('Mini games'))return;
    const game=GAMES.find(x=>x[0]===id);if(!game)return;
    const nonce=++renderNonce;stopGame();stopSpeech();setPage('games','playing',{id,title:game[1]});
    root.innerHTML=head(game[1],game[3])+`<div id="game-play-container" class="m3-game-canvas"><div class="m3-loading"><span class="m3-spinner"></span>Đang tải Mini game…</div></div>`;
    try {
      const src=`assets/js/math/games/${id}.js`;
      if(!gameScripts.has(id)) {
        gameScripts.set(id,new Promise((resolve,reject)=>{
          const script=document.createElement('script');script.src=src;script.async=true;
          script.onload=resolve;script.onerror=()=>reject(new Error('Chưa có '+src));document.head.appendChild(script);
        }).catch(err=>{gameScripts.delete(id);throw err;}));
      }
      await gameScripts.get(id);
      if(!validLive(nonce))return;
      const start=window[game[4]];if(typeof start!=='function') throw new Error('Game chưa có hàm khởi động.');
      if(!gameBridgeActive){previousGameHub=window.openMiniGameHub;previousGameSpeak=window.speakVietnamese;gameBridgeActive=true;
        window.openMiniGameHub=()=>{stopGame();void showHub('games');};
        window.speakVietnamese=(text)=>{void speak(text);};}
      gameRunning=id;start();
    }catch(err){if(validLive(nonce))errorView(err);}
  }

  async function navigateBack() {
    if(!page||page.view==='hub') return showHub(page?.tab||'discover');
    if(page.view==='subtopic' && page.tab==='discover')return showDiscoverTopic(page.topic);
    if((page.view==='quiz'||page.view==='result')&&page.tab==='discover'&&str(page.node).startsWith('3.3.'))return showDiscoverNestedTopic(3);
    if(page.view==='topic'||((page.view==='guide'||page.view==='quiz'||page.view==='result')&&page.tab==='discover')) return page.view==='topic'?showHub('discover'):showDiscoverTopic(page.topic);
    if(page.view==='lab-activity')return showLabTrack(page.code);
    if(page.view==='lab-track')return showLabHome();
    if(page.view==='category')return showHub('exams');
    return showHub(page.tab||'discover');
  }
  async function handleClick(event) {
    const btn=event.target.closest('[data-action]');if(!btn||!root?.contains(btn)||btn.disabled)return;
    const a=btn.dataset.action,id=btn.dataset.id,idx=n(btn.dataset.index);
    if(a==='back')return btn.dataset.target==='home'?showHub(page.tab):navigateBack();
    if(a==='semester'){chosenSemester=n(btn.dataset.sem);return showSemester(page.tab,chosenSemester);}
    if(a==='exercise-sem'){chosenExerciseSemester=n(btn.dataset.sem);return showHub('exercises');}
    if(a==='discover-topic')return showDiscoverTopic(n(btn.dataset.topic));
    if(a==='discover-sub')return showDiscoverSub(n(btn.dataset.topic),btn.dataset.sub);
    if(a==='discover-nested-topic')return showDiscoverNestedTopic(n(btn.dataset.topic));
    if(a==='discover-leaf')return showDiscoverSub(n(btn.dataset.topic),btn.dataset.sub,btn.dataset.node);
    if(a==='discover-topic-guide')return showDiscoverTopicGuide(n(btn.dataset.topic));
    if(a==='discover-guide-section')return showDiscoverTopicGuide(n(btn.dataset.topic),btn.dataset.sub);
    if(a==='discover-begin')return showDiscoverSub(page.topic,page.guideSub);
    if(a==='guide-speak'){const g=discoverGuideSource?.find(q=>q?.lesson_intro)?.lesson_intro;return speak(g?[g.observe,g.understand,g.worked_example,...arr(g.micro_steps),g.common_mistake,g.self_check].join('. '):'');}
    if(a==='lab-home')return showLabHome();
    if(a==='lab-track')return showLabTrack(id);
    if(a==='lab-journey'){
      const j=currentLab?.journeys?.[idx];
      if(j && premium() && authenticated() && progress && !hasLearnedSourceLesson(n(j.unlock_after_source_lesson)))return dialog('Hành trình này chỉ mở sau bài SGK tương ứng.');
      return showJourney(idx,0);
    }
    if(a==='lab-step'){labHintLevel=0;page.activity=Math.max(0,Math.min(n(page.activity)+n(btn.dataset.diff),currentJourney.activities.length-1));return renderLabActivity();}
    if(a==='lab-choice'){
      const activity=getActivity(),isMulti=arr(activity?.answer_indices).length>0;
      const prev=valueOfLab();
      setValueOfLab(isMulti?(arr(prev).includes(idx)?arr(prev).filter(x=>x!==idx):arr(prev).concat(idx)):idx);
      return renderLabActivity();
    }
    if(a==='lab-fraction'){const prev=arr(valueOfLab());setValueOfLab(prev.includes(idx)?prev.filter(x=>x!==idx):prev.concat(idx));return renderLabActivity();}
    if(a==='lab-order'){const prev=arr(valueOfLab());if(!prev.includes(idx))setValueOfLab(prev.concat(idx));return renderLabActivity();}
    if(a==='lab-day'){setValueOfLab(n(btn.dataset.day));return renderLabActivity();}
    if(a==='lab-clear'){setValueOfLab([]);return renderLabActivity();}
    if(a==='lab-hint'){labHintLevel=Math.min(3,labHintLevel+1);return renderLabActivity();}
    if(a==='lab-check') {const act=getActivity();const correct=checkActivity(act,valueOfLab());labChoices[act.id+'_checked']=correct?'ok':'wrong';if(correct)markLab(act.id);return renderLabActivity();}
    if(a==='lab-speak')return speak(getActivity()?.instruction_audio||getActivity()?.prompt||'');
    if(a.startsWith('practice-'))return practicalAction(a,btn);
    if(a==='lesson')return showLesson(id);
    if(a==='lesson-speak'){const data=await load('lessons'),lesson=data.bai_hoc.find(x=>x.lesson_id===page.id);return speak(lesson?.pages?.[lessonPage]?.teacher_script||lesson?.pages?.[lessonPage]?.intro||lesson?.source_title||'');}
    if(a==='lesson-stop')return stopSpeech();
    if(a==='lesson-page')return showLesson(page.id,idx);
    if(a==='lesson-choose'){
      const data=await load('lessons'),lesson=data.bai_hoc.find(x=>x.lesson_id===page.id),item=lesson?.pages?.[lessonPage]?.items?.[n(btn.dataset.question)];
      if(item){const key=`${page.id}_${btn.dataset.question}`,choice=item.options[n(btn.dataset.option)];if(!Object.prototype.hasOwnProperty.call(lessonChoice,key))observeLearning({id:key,skill:item.competency||item.skill_tag},str(choice)===str(item.answer),'lesson');lessonChoice[key]=choice;if(str(choice)!==str(item.answer))lessonMistakes[key]=(lessonMistakes[key]||0)+1;}return showLesson(page.id,lessonPage);
    }
    if(a==='exercise')return startOfficial('baitap',id);
    if(a==='review')return showReview(id);
    if(a==='exam-category')return showExamCategory(btn.dataset.sem);
    if(a==='exam')return startOfficial('baithi',id);
    if(a==='game')return playGame(id);
    if(a==='speak')return speak(btn.dataset.text);
    if(a==='choose'&&quiz){const q=quiz.questions[quiz.at],optionIndex=Number(btn.dataset.option);if(!Number.isInteger(optionIndex)||optionIndex<0||optionIndex>=arr(q.o).length)return;const choice=str(q.o[optionIndex]);quiz.answers.set(q.id,choice);if(quiz.mode==='local'){if(!quiz.revealed.has(q.id))observeLearning(q,choice===str(q.a),quiz.kind);if(choice!==str(q.a))quiz.wrongAttempts.set(q.id,(quiz.wrongAttempts.get(q.id)||0)+1);quiz.revealed.add(q.id);}return renderQuestion();}
    if(a==='prev'&&quiz){quiz.at=Math.max(0,quiz.at-1);stopSpeech();return renderQuestion();}
    if(a==='next'&&quiz){quiz.at=Math.min(quiz.questions.length-1,quiz.at+1);stopSpeech();return renderQuestion();}
    if(a==='submit'){
      if(quiz?.mode==='official')return submitOfficial();
      return showLocalResult();
    }
    if(a==='history')return showHistory(btn.dataset.kind,btn.dataset.sem);
  }
  async function showSemester(tab,sem) {chosenSemester=sem;await showHub(tab);}
  function handleInput(event) {
    const input=event.target;
    if(input.matches('[data-lab-field]'))labValueChanged(input.dataset.labField,input.value);
    else if(input.matches('[data-lab-range]'))labValueChanged('',input.value,'range');
    else if(input.matches('[data-practice-field]')){
      const state=practiceState[page?.id];if(!state)return;
      state.values[input.dataset.practiceField]=input.value;
      if(event.type==='change' && input.tagName==='SELECT')practiceRefresh();
      const display=find('[data-practical-value]');if(display){const u=state.step===0?'mm':state.step===1?'g':state.step===2?'ml':'°C';display.textContent=input.value+' '+u;}
    }
  }
  function bindRoot() {
    onClickRef=(event)=>{void handleClick(event).catch(err=>{console.warn('[Class3 Math] Có lỗi thao tác.');dialog('Chưa thực hiện được thao tác. Bé thử lại nhé!');});};
    onInputRef=handleInput;root.addEventListener('click',onClickRef);root.addEventListener('input',onInputRef);root.addEventListener('change',onInputRef);
  }
  function ensureStyle() {
    if(document.getElementById('class3-math-module-style'))return;
    const style=document.createElement('style');style.id='class3-math-module-style';style.textContent=STYLES;document.head.appendChild(style);
  }
  async function render(nextCtx) {
    const newCtx=nextCtx||{},oldHost=ctx?.host,previousUser=ctx?.user?.userId||'',nextUser=newCtx?.user?.userId||'';
    if(root&&(oldHost!==newCtx.host||!root.isConnected))destroy();
    if(previousUser!==nextUser){learningQueue=[];learningInFlight=null;lessonChoice={};lessonMistakes={};practiceState={};labChoices={};progress=null;}
    ctx=newCtx;live=true;ensureStyle();
    if(!root) {root=document.createElement('section');root.id=ROOT_ID;root.setAttribute('aria-label','Module Toán 3');ctx.host?.replaceChildren(root);bindRoot();}
    const tab=LABELS[nextCtx?.tabId]?nextCtx.tabId:'discover';
    renderNonce++;cleanView();await showHub(tab);
  }
  function destroy() {
    live=false;renderNonce++;cleanView();
    try{root?.removeEventListener('click',onClickRef);root?.removeEventListener('input',onInputRef);root?.removeEventListener('change',onInputRef);}catch(_){}
    try{root?.remove();}catch(_){}
    root=null;ctx?.hooks?.clearDetail?.();ctx=null;progress=null;currentLab=null;currentJourney=null;learningQueue=[];
  }
  window.CLASS3_SUBJECT_MODULES=window.CLASS3_SUBJECT_MODULES||{};
  window.CLASS3_SUBJECT_MODULES.math=Object.freeze({render,destroy});

  const STYLES = `
#class3-math-runtime{--m3-purple:#7c3aed;--m3-pink:#ec4899;--m3-line:#ddd6fe;color:#344054;font-family:"Nunito","Segoe UI",Arial,sans-serif;font-size:16px;max-width:82rem;margin:0 auto}
#class3-math-runtime *{box-sizing:border-box}
#class3-math-runtime button{font:inherit;cursor:pointer}
#class3-math-runtime input,#class3-math-runtime select,#class3-math-runtime textarea{font-family:inherit;font-size:16px}
#class3-math-runtime button:disabled{opacity:.42;cursor:not-allowed}
#class3-math-runtime h2,#class3-math-runtime h3,#class3-math-runtime h4{color:#5b216e;margin:0 0 .55rem;line-height:1.3}
#class3-math-runtime p{line-height:1.6}
#class3-math-runtime .m3-section-header{display:flex;justify-content:space-between;align-items:flex-start;gap:12px;margin:2px 0 14px}
#class3-math-runtime .m3-section-header h2{font-size:clamp(22px,2.4vw,29px);font-weight:950;margin:0}
#class3-math-runtime .m3-section-header p{margin:.25rem 0 0;color:#667085;font-weight:750}
#class3-math-runtime .m3-back,#class3-math-runtime .m3-small{min-height:40px;padding:9px 15px;border:1px solid #c4b5fd;border-radius:13px;color:#6d28d9;background:#faf5ff;font-size:16px;font-weight:900;flex-shrink:0}
#class3-math-runtime .m3-back:hover,#class3-math-runtime .m3-small:hover{background:#f3e8ff;border-color:#8b5cf6}
#class3-math-runtime .m3-folder-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(235px,1fr));gap:12px}
#class3-math-runtime .m3-folder-grid.m3-discover-home-grid{grid-template-columns:repeat(4,minmax(0,1fr));width:100%}
#class3-math-runtime .m3-folder-grid.m3-discover-sub-grid{grid-template-columns:repeat(3,minmax(0,1fr));width:100%}
/* A single guide tile is placed first in each topic, like Class 2.
   3-column topic grids become 2-column when there are at most four tiles. */
#class3-math-runtime .m3-folder-grid.m3-discover-topic-grid--compact{grid-template-columns:repeat(2,minmax(0,1fr))}
#class3-math-runtime .m3-folder.m3-discover-guide-card{--m3-br:#f9a8d4;--m3-icon-bg:#fce7f3;background:linear-gradient(135deg,#fdf2f8,#faf5ff)}
#class3-math-runtime .m3-folder.m3-discover-guide-card .m3-folder-foot{color:#be185d}
@media(min-width:768px) and (max-width:899px){#class3-math-runtime .m3-folder-grid.m3-discover-topic-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(max-width:767px){#class3-math-runtime .m3-folder-grid.m3-discover-topic-grid{grid-template-columns:1fr}#class3-math-runtime .m3-folder-grid.m3-discover-topic-grid--compact{grid-template-columns:1fr}}
#class3-math-runtime .m3-folder-grid.m3-lab-home-grid{grid-template-columns:repeat(3,minmax(0,1fr));width:100%}
#class3-math-runtime .m3-folder{--m3-br:#f9a8d4;--m3-icon-bg:#ffe0ed;min-height:142px;text-align:left;border:1px solid var(--m3-br);background:linear-gradient(135deg,#fff8fc,#fbf4ff);border-radius:20px;padding:14px;display:flex;flex-direction:column;justify-content:space-between;gap:12px;box-shadow:0 4px 14px rgba(76,29,149,.055);transform:none!important;translate:none!important;transition:border-color .18s ease,box-shadow .18s ease,filter .18s ease!important}
#class3-math-runtime .m3-folder:nth-child(6n+2){--m3-br:#86efac;--m3-icon-bg:#dcfce7;background:linear-gradient(135deg,#f7fffc,#ecfdf5)}
#class3-math-runtime .m3-folder:nth-child(6n+3){--m3-br:#c4b5fd;--m3-icon-bg:#ede9fe;background:linear-gradient(135deg,#fdfaff,#f5f3ff)}
#class3-math-runtime .m3-folder:nth-child(6n+4){--m3-br:#fcd34d;--m3-icon-bg:#ffedbf;background:linear-gradient(135deg,#fffcf5,#fffbeb)}
#class3-math-runtime .m3-folder:nth-child(6n+5){--m3-br:#a5b4fc;--m3-icon-bg:#e0e7ff;background:linear-gradient(135deg,#f8faff,#eef2ff)}
#class3-math-runtime .m3-folder:nth-child(6n+6){--m3-br:#5eead4;--m3-icon-bg:#ccfbf1;background:linear-gradient(135deg,#f6fffb,#f0fdfa)}
#class3-math-runtime .m3-folder:is(:hover,:focus-visible){transform:none!important;translate:none!important;filter:brightness(1.035) saturate(1.08)!important;border-color:#a855f7;box-shadow:0 7px 18px rgba(76,29,149,.16)}
#class3-math-runtime .m3-folder:nth-child(6n+1):is(:hover,:focus-visible){border-color:#ec4899}
#class3-math-runtime .m3-folder:nth-child(6n+2):is(:hover,:focus-visible){border-color:#10b981}
#class3-math-runtime .m3-folder:nth-child(6n+4):is(:hover,:focus-visible){border-color:#f59e0b}
#class3-math-runtime .m3-folder:nth-child(6n+5):is(:hover,:focus-visible){border-color:#6366f1}
#class3-math-runtime .m3-folder:nth-child(6n+6):is(:hover,:focus-visible){border-color:#14b8a6}
#class3-math-runtime .m3-folder-head{display:flex;align-items:flex-start;gap:11px;min-width:0}
#class3-math-runtime .m3-folder-icon{display:flex;align-items:center;justify-content:center;flex:0 0 60px;width:60px;height:60px;border:2px solid var(--m3-br);border-radius:17px;background:var(--m3-icon-bg);font-family:'Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji',sans-serif;font-size:36px;font-weight:400;line-height:1;box-shadow:0 3px 9px rgba(109,40,217,.13),inset 0 1px 2px #fff;transition:transform .18s ease,box-shadow .18s ease}
#class3-math-runtime .m3-folder:is(:hover,:focus-visible) .m3-folder-icon{transform:scale(1.07);box-shadow:0 5px 12px rgba(109,40,217,.22),inset 0 1px 2px #fff}
#class3-math-runtime .m3-folder-copy{min-width:0;flex:1}
#class3-math-runtime .m3-folder-copy strong{display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;overflow:hidden;color:#5b216e;font-size:19px;font-weight:950;line-height:1.28}
#class3-math-runtime .m3-folder-copy small{display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;overflow:hidden;color:#475467;font-size:16px;font-weight:750;margin-top:6px;line-height:1.4}
#class3-math-runtime .m3-folder-grid.m3-discover-home-grid .m3-folder{min-height:168px;padding:12px;gap:8px}
#class3-math-runtime .m3-folder-grid.m3-discover-home-grid .m3-folder-head{flex-direction:row;align-items:center;gap:10px;min-width:0}
#class3-math-runtime .m3-folder-grid.m3-discover-home-grid .m3-folder-icon{width:56px;height:56px;flex:0 0 56px;font-size:34px}
#class3-math-runtime .m3-folder-grid.m3-discover-home-grid .m3-folder-copy strong{font-size:18px;line-height:1.24;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;line-clamp:2;overflow:hidden;overflow-wrap:break-word}
#class3-math-runtime .m3-folder-grid.m3-discover-home-grid .m3-topic-description{display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;line-clamp:2;overflow:hidden;min-height:36px;color:#475467;font-size:16px;font-weight:750;line-height:1.3}
#class3-math-runtime .m3-folder-grid.m3-discover-sub-grid .m3-folder{min-height:148px;padding:12px;gap:8px}
#class3-math-runtime .m3-folder-grid.m3-discover-sub-grid .m3-folder-head{align-items:flex-start;gap:10px}
#class3-math-runtime .m3-folder-grid.m3-discover-sub-grid .m3-folder-icon{width:53px;height:53px;flex:0 0 53px;font-size:32px}
#class3-math-runtime .m3-folder-grid.m3-discover-sub-grid .m3-folder-copy strong{font-size:18px;line-height:1.26;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;line-clamp:2;overflow:hidden;overflow-wrap:break-word}
#class3-math-runtime .m3-folder-grid.m3-discover-sub-grid .m3-folder-copy small{font-size:16px;line-height:1.35;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;line-clamp:2;overflow:hidden;overflow-wrap:break-word;margin-top:7px}
#class3-math-runtime .m3-folder-grid.m3-lab-home-grid .m3-folder{min-height:202px}
#class3-math-runtime .m3-folder-grid.m3-lab-home-grid .m3-folder-copy strong{display:block;-webkit-line-clamp:unset;line-clamp:unset;overflow:visible;white-space:normal;overflow-wrap:break-word}
#class3-math-runtime .m3-folder-grid.m3-lab-home-grid .m3-folder-copy small{display:block;-webkit-line-clamp:unset;line-clamp:unset;overflow:visible;white-space:normal;overflow-wrap:break-word}
#class3-math-runtime .m3-folder-foot{display:flex;justify-content:space-between;align-items:center;border-top:1px solid rgba(124,58,237,.12);padding-top:7px;font-size:16px;font-weight:900;color:#7c3aed}
#class3-math-runtime .m3-folder.is-locked{background:#f8fafc;border-color:#cbd5e1}
#class3-math-runtime .m3-question-card,#class3-math-runtime .m3-paper,#class3-math-runtime .m3-result{border:1px solid #e9d5ff;border-radius:20px;padding:clamp(12px,2vw,24px);background:#fff;box-shadow:0 4px 15px rgba(76,29,149,.055)}
#class3-math-runtime .m3-question-text{font-size:clamp(20px,2vw,25px);font-weight:950;color:#5b216e;text-align:center;line-height:1.45;margin:20px 0}
#class3-math-runtime .m3-options{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin:14px 0}
#class3-math-runtime .m3-options.m3-options--four{grid-template-columns:repeat(4,minmax(0,1fr))}
#class3-math-runtime .m3-options.m3-options--three{grid-template-columns:repeat(3,minmax(0,1fr))}
#class3-math-runtime .m3-options.m3-options--two{grid-template-columns:repeat(2,minmax(0,1fr))}
#class3-math-runtime .m3-options.m3-options--readable{grid-template-columns:repeat(2,minmax(0,1fr))}
#class3-math-runtime .m3-choice{min-height:54px;min-width:0;padding:10px 12px;overflow-wrap:break-word;line-height:1.35;border:1px solid #c4b5fd;border-radius:16px;background:#faf5ff;color:#344054;font-size:18px;font-weight:850;text-align:left;display:flex;align-items:center;gap:12px;transition:background .18s,border-color .18s,box-shadow .18s}
#class3-math-runtime .m3-choice:nth-child(4n+1){background:#fff1f7;border-color:#f9a8d4}
#class3-math-runtime .m3-choice:nth-child(4n+2){background:#ecfdf5;border-color:#86efac}
#class3-math-runtime .m3-choice:nth-child(4n+3){background:#f5f3ff;border-color:#c4b5fd}
#class3-math-runtime .m3-choice:nth-child(4n+4){background:#eff6ff;border-color:#93c5fd}
#class3-math-runtime .m3-choice span{width:28px;height:28px;border-radius:9px;background:#fff;flex:0 0 28px;display:flex;align-items:center;justify-content:center;font-weight:950;color:#6d28d9}
#class3-math-runtime .m3-choice:hover,#class3-math-runtime .m3-choice.selected{border-color:#8b5cf6;box-shadow:0 0 0 2px rgba(139,92,246,.14);filter:brightness(1.025)}
#class3-math-runtime .m3-choice.correct{color:#047857;border-color:#10b981;background:#dcfce7}
#class3-math-runtime .m3-choice.wrong{color:#be123c;border-color:#fb7185;background:#fff1f2}
#class3-math-runtime .m3-quiz-top,#class3-math-runtime .m3-quiz-footer{display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;font-weight:900;color:#7c3aed}
#class3-math-runtime .m3-quiz-footer{border-top:1px solid #f3e8ff;padding-top:15px}
#class3-math-runtime .m3-quiz-nav{display:grid;grid-template-columns:minmax(0,1fr) 104px minmax(0,1fr);gap:9px;align-items:center;margin:17px 0}
#class3-math-runtime .m3-nav,#class3-math-runtime .m3-count{min-height:45px;border-radius:13px;padding:8px 10px;display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:950;text-align:center}
#class3-math-runtime .m3-nav{border:1px solid #ddd6fe;background:#faf5ff;color:#6d28d9}
#class3-math-runtime .m3-nav.primary,#class3-math-runtime .m3-submit{border:0;background:linear-gradient(100deg,#ec4899,#8b5cf6);color:#fff;box-shadow:0 5px 12px rgba(139,92,246,.16)}
#class3-math-runtime .m3-count{border:1px solid #e9d5ff;background:#fff;color:#6d28d9}
#class3-math-runtime .m3-submit{min-height:46px;padding:9px 19px;border-radius:14px;font-size:16px;font-weight:950}
#class3-math-runtime .m3-explain,#class3-math-runtime .m3-note{padding:12px 14px;border:1px solid #fcd34d;border-radius:13px;background:#fffbeb;color:#92400e;line-height:1.5;font-weight:750;margin:12px 0}
#class3-math-runtime .m3-good{background:#ecfdf5;border:1px solid #86efac;color:#047857;padding:10px;border-radius:12px;font-weight:900}
#class3-math-runtime .m3-bad{background:#fff1f2;border:1px solid #fda4af;color:#be123c;padding:10px;border-radius:12px;font-weight:900}
#class3-math-runtime .m3-knowledge{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:9px;margin:13px 0}
#class3-math-runtime .m3-knowledge article,#class3-math-runtime .m3-guided{border:1px solid #ddd6fe;border-radius:15px;background:#faf5ff;padding:14px;margin-bottom:12px}
#class3-math-runtime .m3-knowledge strong{color:#6d28d9}
#class3-math-runtime .m3-example{padding:12px;border-left:3px solid #a855f7;background:#fdf4ff;font-weight:800;white-space:pre-wrap}
#class3-math-runtime .m3-self-check{border:1px solid #bae6fd;border-radius:13px;padding:12px;background:#eff6ff;color:#0369a1;font-weight:850}
#class3-math-runtime .m3-lead{font-size:19px;font-weight:850;color:#475467}
#class3-math-runtime .m3-lesson-body{padding:13px 4px;line-height:1.65}
#class3-math-runtime .m3-lesson-body li{margin:8px 0}
#class3-math-runtime .m3-page-tabs,#class3-math-runtime .m3-semesters{display:flex;flex-wrap:wrap;gap:9px;margin:10px 0 16px}
#class3-math-runtime .m3-sem{border:1px solid #c4b5fd;border-radius:13px;background:#faf5ff;color:#6d28d9;font-weight:900;padding:9px 13px}
#class3-math-runtime .m3-sem.active{color:#fff;border-color:#8b5cf6;background:linear-gradient(100deg,#ec4899,#8b5cf6)}
#class3-math-runtime .m3-illustration{max-width:560px;margin:12px auto;text-align:center}
#class3-math-runtime .m3-illustration img{width:100%;max-height:360px;object-fit:contain;border-radius:17px;border:1px solid #e9d5ff}
#class3-math-runtime .m3-caption,#class3-math-runtime .m3-illustration figcaption{text-align:center;color:#667085;font-size:16px}
#class3-math-runtime .m3-scene-emoji{text-align:center;font-size:65px;line-height:1.4}
#class3-math-runtime .m3-result{text-align:center;max-width:850px;margin:0 auto}
#class3-math-runtime .m3-result ul{text-align:left;line-height:1.8}
#class3-math-runtime .m3-result h3{font-size:23px}
#class3-math-runtime .m3-medal{font-size:65px}
#class3-math-runtime .m3-loading,#class3-math-runtime .m3-empty{min-height:220px;display:flex;align-items:center;justify-content:center;gap:12px;background:#fff;border:1px dashed #c4b5fd;border-radius:20px;text-align:center;padding:24px;color:#6d28d9;font-size:18px;font-weight:850}
#class3-math-runtime .m3-spinner{width:24px;height:24px;border:3px solid #ddd6fe;border-top-color:#8b5cf6;border-radius:50%;animation:m3spin .8s linear infinite}
#class3-math-runtime .m3-lab-number{display:flex;flex-direction:column;gap:6px;font-size:16px;font-weight:900;color:#6d28d9;min-width:105px}
#class3-math-runtime .m3-lab-number input{height:45px;border:1px solid #c4b5fd;border-radius:12px;background:#fff;padding:9px;font-size:20px;font-weight:850;color:#344054;width:100%}
#class3-math-runtime .m3-lab-fields{display:flex;flex-wrap:wrap;gap:12px;margin:18px 0}
#class3-math-runtime .m3-lab-actions{display:flex;align-items:center;justify-content:flex-end;gap:12px;flex-wrap:wrap;margin:13px 0}
#class3-math-runtime .m3-model{font-size:24px;letter-spacing:5px;margin:12px 0}
#class3-math-runtime .m3-fraction{display:flex;gap:7px;margin:16px 0}
#class3-math-runtime .m3-fraction button{font-size:30px;flex:1;min-height:70px;border:1px solid #c4b5fd;border-radius:9px;background:#fff}
#class3-math-runtime .m3-fraction button.selected{background:#f3e8ff;border-color:#8b5cf6}
#class3-math-runtime .m3-slider{display:flex;align-items:center;gap:16px;margin:20px 0}
#class3-math-runtime .m3-slider input{flex:1;accent-color:#8b5cf6}
#class3-math-runtime .m3-lab-clock{text-align:center;font-size:67px}
#class3-math-runtime .m3-calendar{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:5px;margin:20px 0;max-width:550px}
#class3-math-runtime .m3-calendar button,#class3-math-runtime .m3-calendar strong{display:flex;align-items:center;justify-content:center;min-height:39px;border:1px solid #ddd6fe;border-radius:9px;background:#fff;font-weight:900}
#class3-math-runtime .m3-calendar button.selected{background:#ede9fe;border-color:#8b5cf6}
#class3-math-runtime .m3-game-canvas{min-height:360px;max-width:76rem;margin:0 auto}
#class3-math-runtime .m3-history{display:grid;gap:8px}
#class3-math-runtime .m3-history article{border:1px solid #ddd6fe;background:#fff;border-radius:14px;padding:12px}
#class3-math-runtime .m3-clock{font-weight:950;color:#be185d}
@keyframes m3spin{to{transform:rotate(360deg)}}
@media(min-width:768px) and (max-width:899px){#class3-math-runtime .m3-folder-grid.m3-discover-home-grid{grid-template-columns:repeat(3,minmax(0,1fr))}}
@media(min-width:768px) and (max-width:899px){#class3-math-runtime .m3-folder-grid.m3-discover-sub-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(min-width:768px) and (max-width:899px){#class3-math-runtime .m3-folder-grid.m3-lab-home-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(max-width:767px){#class3-math-runtime .m3-folder-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}#class3-math-runtime .m3-folder-grid.m3-discover-home-grid{grid-template-columns:repeat(2,minmax(0,1fr))}#class3-math-runtime .m3-folder{padding:10px;min-height:132px;border-radius:16px}#class3-math-runtime .m3-folder-head{flex-direction:column;gap:7px}#class3-math-runtime .m3-folder-icon{width:52px;height:52px;flex:0 0 52px;font-size:31px}#class3-math-runtime .m3-folder-copy strong{font-size:17px}#class3-math-runtime .m3-folder-copy small{font-size:16px}#class3-math-runtime .m3-folder-grid.m3-discover-sub-grid{grid-template-columns:1fr}#class3-math-runtime .m3-folder-grid.m3-discover-sub-grid .m3-folder{min-height:116px}#class3-math-runtime .m3-folder-grid.m3-lab-home-grid{grid-template-columns:1fr}#class3-math-runtime .m3-folder-grid.m3-lab-home-grid .m3-folder{min-height:auto}#class3-math-runtime .m3-section-header{flex-direction:column}#class3-math-runtime .m3-options{grid-template-columns:repeat(2,minmax(0,1fr))}#class3-math-runtime .m3-choice{font-size:17px;min-height:58px}#class3-math-runtime .m3-quiz-nav{grid-template-columns:minmax(0,1fr) 76px minmax(0,1fr);gap:5px}#class3-math-runtime .m3-nav,#class3-math-runtime .m3-count{font-size:16px;padding:7px 5px}}
@media(max-width:767px){
#class3-math-runtime .m3-folder-grid.m3-discover-home-grid .m3-folder{min-height:168px;padding:10px}
#class3-math-runtime .m3-folder-grid.m3-discover-home-grid .m3-folder-head{flex-direction:row;align-items:center;gap:8px}
#class3-math-runtime .m3-folder-grid.m3-discover-home-grid .m3-folder-icon{width:48px;height:48px;flex:0 0 48px;font-size:29px}
#class3-math-runtime .m3-folder-grid.m3-discover-home-grid .m3-folder-copy strong{font-size:16px}
#class3-math-runtime .m3-folder-grid.m3-discover-home-grid .m3-topic-description{font-size:16px}
#class3-math-runtime .m3-folder-grid.m3-discover-sub-grid .m3-folder-head{flex-direction:row;align-items:flex-start}
#class3-math-runtime .m3-folder-grid.m3-discover-sub-grid .m3-folder-icon{width:50px;height:50px;flex:0 0 50px;font-size:30px}
#class3-math-runtime .m3-folder-grid.m3-discover-sub-grid .m3-folder-copy strong{font-size:17px}
}
@media(max-width:479px){
#class3-math-runtime .m3-folder-grid.m3-discover-home-grid .m3-folder-head{flex-direction:column;align-items:flex-start;gap:7px}
#class3-math-runtime .m3-folder-grid.m3-discover-home-grid .m3-folder{min-height:189px}
#class3-math-runtime .m3-folder-grid.m3-discover-home-grid .m3-folder-copy strong{font-size:17px}
}

/* Responsive answer choices respect the actual question card width. */
#class3-math-runtime .m3-question-card,#class3-math-runtime .m3-guided,#class3-math-runtime .m3-paper{container-type:inline-size}
@media(max-width:920px){
#class3-math-runtime .m3-options.m3-options--four,#class3-math-runtime .m3-options.m3-options--three{grid-template-columns:repeat(2,minmax(0,1fr))}
#class3-math-runtime .m3-options.m3-options--readable{grid-template-columns:1fr}
}
@container (max-width:740px){
#class3-math-runtime .m3-options.m3-options--four,#class3-math-runtime .m3-options.m3-options--three{grid-template-columns:repeat(2,minmax(0,1fr))}
}
@container (max-width:550px){
#class3-math-runtime .m3-options.m3-options--readable{grid-template-columns:1fr}
}
@container (max-width:300px){
#class3-math-runtime .m3-options.m3-options--two{grid-template-columns:1fr}
}

#class3-math-runtime .m3-folder.m3-discover-guide-card{--m3-br:#f9a8d4;--m3-icon-bg:#fce7f3;background:linear-gradient(135deg,#fff0f7,#faf5ff)}
#class3-math-runtime .m3-guide-sections{display:flex;flex-wrap:wrap;gap:9px;margin:8px 0 16px}
#class3-math-runtime .m3-guide-section-tab{border:1px solid #ddd6fe;border-radius:12px;background:#faf5ff;color:#6d28d9;font-size:16px;font-weight:850;padding:10px 13px;min-height:44px;text-align:left;cursor:pointer}
#class3-math-runtime .m3-guide-section-tab.active{background:linear-gradient(105deg,#ec4899,#8b5cf6);color:#fff;border-color:#8b5cf6}
#class3-math-runtime .m3-guide-section-tab:focus-visible{outline:3px solid #a78bfa;outline-offset:2px}
#class3-math-runtime .m3-guide-section-heading{font-size:20px;color:#5b216e;margin:8px 0 0}
@media(max-width:479px){#class3-math-runtime .m3-guide-section-tab{width:100%}}
#class3-math-runtime .m3-guide{display:grid;gap:16px}
#class3-math-runtime .m3-guide-meta{display:flex;align-items:center;gap:10px;flex-wrap:wrap;color:#64748b;font-size:16px;font-weight:750}
#class3-math-runtime .m3-scope{background:#dbeafe;color:#1e40af;border:1px solid #93c5fd;padding:5px 12px;border-radius:99px;font-weight:900}
#class3-math-runtime .m3-scope.m3-advanced{color:#92400e;background:#fffbeb;border-color:#fcd34d}
#class3-math-runtime .m3-guide-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:13px}
#class3-math-runtime .m3-guide-grid article{border:1px solid #ddd6fe;border-radius:18px;background:#fff;padding:16px;box-shadow:0 5px 15px rgba(80,40,130,.05)}
#class3-math-runtime .m3-guide-grid article>span{font-size:16px;font-weight:950;display:inline-flex;align-items:center;justify-content:center;width:29px;height:29px;background:#f3e8ff;color:#7c3aed;border-radius:50%;margin-bottom:9px}
#class3-math-runtime .m3-guide-grid article:nth-child(2){background:#f0fdf4;border-color:#bbf7d0}
#class3-math-runtime .m3-guide-grid article:nth-child(3){background:#eff6ff;border-color:#bfdbfe}
#class3-math-runtime .m3-guide-grid h3{font-size:19px;margin:0 0 8px}
#class3-math-runtime .m3-guide-grid p{font-size:17px;margin:0}
#class3-math-runtime .m3-guide-lower{display:grid;grid-template-columns:1fr 1fr;gap:14px}
#class3-math-runtime .m3-guide-lower section{background:#faf5ff;border:1px solid #ddd6fe;border-radius:16px;padding:15px}
#class3-math-runtime .m3-guide-lower h3{font-size:17px}
#class3-math-runtime .m3-guide-lower ol{padding-left:22px;line-height:1.85}
#class3-math-runtime .m3-caution{color:#b45309}
#class3-math-runtime .m3-guide-ctas{display:flex;justify-content:flex-end;gap:12px;align-items:center;flex-wrap:wrap}
#class3-math-runtime .m3-guide-return{margin:-2px 0 10px}
#class3-math-runtime .m3-math-visual{margin:16px auto 18px;padding:14px;border:1px solid #c7d2fe;background:linear-gradient(135deg,#faf5ff,#eff6ff);border-radius:18px;text-align:center;width:min(100%,620px)}
#class3-math-runtime .m3-math-svg{width:100%;height:auto;max-width:360px;max-height:220px;display:block;margin:auto}
#class3-math-runtime .m3-fraction-strip{display:grid;grid-template-columns:repeat(var(--m3-cols),minmax(0,1fr));width:min(100%,460px);height:80px;margin:10px auto;border:2px solid #6d28d9;border-radius:8px;overflow:hidden}
#class3-math-runtime .m3-fraction-strip span{border-right:1px solid #a78bfa;background:#fff}
#class3-math-runtime .m3-fraction-strip span:last-child{border-right:0}
#class3-math-runtime .m3-fraction-strip .on{background:#c084fc}
#class3-math-runtime .m3-math-dots{display:grid;grid-template-columns:repeat(10,minmax(0,1fr));gap:6px;width:min(100%,360px);margin:auto}
#class3-math-runtime .m3-math-dots span{aspect-ratio:1;background:#fff;border:2px solid #a78bfa;border-radius:50%}
#class3-math-runtime .m3-math-dots .on{background:#8b5cf6}
#class3-math-runtime .m3-math-grid{display:grid;grid-template-columns:repeat(var(--m3-cols),minmax(0,1fr));gap:3px;width:max-content;max-width:100%;margin:10px auto}
#class3-math-runtime .m3-math-grid span{width:26px;height:26px;border:1px solid #93c5fd;background:#fff;border-radius:3px}
#class3-math-runtime .m3-math-grid span.on{background:#60a5fa;border-color:#2563eb}
#class3-math-runtime .m3-visual-pair{display:flex;justify-content:center;gap:18px;flex-wrap:wrap}
#class3-math-runtime .m3-tally-chart{max-width:550px;margin:auto;text-align:left;background:#fff;border:1px solid #ddd6fe;border-radius:12px;overflow:hidden}
#class3-math-runtime .m3-tally-heading,#class3-math-runtime .m3-tally-row{display:grid;grid-template-columns:minmax(85px,1fr) minmax(150px,2fr);align-items:center;padding:10px 12px;gap:8px;border-bottom:1px solid #e5e7eb}
#class3-math-runtime .m3-tally-heading{background:#ede9fe;color:#6d28d9}
#class3-math-runtime .m3-tally-row:last-child{border-bottom:0}
#class3-math-runtime .m3-tally-svg{height:30px;max-width:100%;stroke:#6d28d9;stroke-width:2.7;stroke-linecap:round}
#class3-math-runtime .m3-practical-root{background:linear-gradient(135deg,#f0fdf4,#eff6ff);border:1px solid #86efac;border-radius:19px;padding:15px;margin:15px 0 20px}
#class3-math-runtime .m3-practical-root h3{color:#0f766e}
#class3-math-runtime .m3-practical-controls{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin:12px 0}
#class3-math-runtime .m3-practical-select{border:1px solid #93c5fd;background:#fff;padding:9px;border-radius:10px;min-height:40px;font:inherit}
#class3-math-runtime .m3-practical-grid{display:grid;grid-template-columns:repeat(var(--m3-cols),minmax(0,1fr));gap:4px;width:max-content;max-width:100%;margin:15px auto}
#class3-math-runtime .m3-practical-grid button{width:34px;height:34px;border:1px solid #a5b4fc;border-radius:6px;background:#fff}
#class3-math-runtime .m3-practical-grid button.selected{background:#8b5cf6;border-color:#6d28d9}
#class3-math-runtime .m3-practical-msg{padding:11px;border-radius:10px;background:#fff;border:1px solid #bfdbfe;color:#1d4ed8;font-weight:850;margin:10px 0}
#class3-math-runtime .m3-practical-svg{width:min(100%,460px);display:block;margin:10px auto;border:1px solid #ddd6fe;border-radius:12px;background:#fff}
#class3-math-runtime .m3-practical-svg [data-action]{cursor:crosshair}
#class3-math-runtime .m3-practical-symbols{font-size:32px;letter-spacing:4px;line-height:1.7;text-align:center;background:#fff;padding:8px;border:1px solid #ddd6fe;border-radius:14px}
#class3-math-runtime .m3-practical-calendar{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:4px;width:min(100%,410px);margin:12px auto}
#class3-math-runtime .m3-practical-calendar span,#class3-math-runtime .m3-practical-calendar button{display:flex;justify-content:center;align-items:center;min-height:35px;border:1px solid #ddd6fe;background:#fff;border-radius:7px}
#class3-math-runtime .m3-practical-calendar button.selected{background:#d8b4fe;border-color:#8b5cf6}
@media(max-width:767px){#class3-math-runtime .m3-guide-grid{grid-template-columns:1fr}#class3-math-runtime .m3-guide-lower{grid-template-columns:1fr}#class3-math-runtime .m3-guide-grid p{font-size:16px}#class3-math-runtime .m3-guide-ctas button{flex:1}#class3-math-runtime .m3-math-grid span{width:21px;height:21px}#class3-math-runtime .m3-practical-grid button{width:30px;height:30px}}


#class3-math-runtime .m3-place-value{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:5px;max-width:540px;margin:0 auto}
#class3-math-runtime .m3-place-value>div{display:flex;flex-direction:column;border:1px solid #c4b5fd;border-radius:10px;overflow:hidden;background:#fff}
#class3-math-runtime .m3-place-value strong{background:#ede9fe;font-size:16px;min-height:35px;display:flex;align-items:center;justify-content:center;color:#6d28d9;padding:3px}
#class3-math-runtime .m3-place-value span{font-size:30px;font-weight:950;color:#b91c70}
#class3-math-runtime .m3-column-calc{margin:0 auto;font-size:26px;line-height:1.45;max-width:200px;text-align:right;font-family:ui-monospace,Consolas,monospace;font-variant-numeric:tabular-nums}
#class3-math-runtime .m3-column-calc hr{border:0;border-top:3px solid #7c3aed;margin:2px 0}
/* Khám phá cộng/trừ: các chữ số thẳng hàng, dấu hỏi đỏ; 4 hoặc 5 cột tùy kết quả. */
#class3-math-runtime .m3-vertical-arithmetic{display:grid;grid-template-columns:34px repeat(var(--m3-vertical-columns),44px);column-gap:10px;row-gap:8px;width:max-content;max-width:100%;margin:1px auto 3px;justify-items:center;align-items:center;font-family:ui-monospace,SFMono-Regular,Consolas,monospace;font-size:43px;font-weight:900;line-height:1.1;font-variant-numeric:tabular-nums;color:#334155}
#class3-math-runtime .m3-vertical-digit,#class3-math-runtime .m3-vertical-result,#class3-math-runtime .m3-vertical-sign{display:flex;align-items:center;justify-content:center;min-width:0;width:100%;height:49px}
#class3-math-runtime .m3-vertical-sign{color:#ec4899}
#class3-math-runtime .m3-vertical-line{grid-column:1/-1;width:100%;height:3px;margin:0;border-radius:9px;background:#7c3aed}
#class3-math-runtime .m3-vertical-result{color:#dc2626;font-weight:950}
#class3-math-runtime .m3-vertical-result.is-revealed{color:#dc2626}
@media(max-width:520px){#class3-math-runtime .m3-vertical-arithmetic{grid-template-columns:27px repeat(var(--m3-vertical-columns),minmax(0,34px));column-gap:5px;row-gap:6px;font-size:32px}#class3-math-runtime .m3-vertical-digit,#class3-math-runtime .m3-vertical-result,#class3-math-runtime .m3-vertical-sign{height:38px}}

/* Multiplication: distinguish direct products, two-step expressions and hidden factors. */
#class3-math-runtime .m3-mul-steps>p:first-child,#class3-math-runtime .m3-mul-unknown>p:first-child{font-size:17px;color:#5b216e;margin:3px 0 10px}
#class3-math-runtime .m3-mul-next{font-size:22px;font-weight:850;color:#344054;margin:14px auto 4px}
#class3-math-runtime .m3-mul-unknown{display:grid;gap:7px;justify-items:center}
#class3-math-runtime .m3-mul-equation{display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:11px;color:#344054;font-size:30px;font-weight:950;font-variant-numeric:tabular-nums}
#class3-math-runtime .m3-mul-equation>strong{color:#dc2626;min-width:24px;text-align:center}
#class3-math-runtime .m3-mul-answer{color:#dc2626!important}
#class3-math-runtime .m3-mul-worked{display:grid;gap:3px;padding:7px 12px;margin-top:5px;border-radius:12px;background:#f0fdf4;border:1px solid #86efac;color:#065f46;font-weight:800;font-size:17px}
#class3-math-runtime .m3-mul-worked p{margin:1px}
@media(max-width:520px){#class3-math-runtime .m3-mul-next{font-size:19px}#class3-math-runtime .m3-mul-equation{font-size:25px;gap:7px}}

#class3-math-runtime .m3-concept-icons{display:flex;justify-content:center;flex-wrap:wrap;gap:12px}
#class3-math-runtime .m3-concept-icons span{display:flex;flex-direction:column;min-width:86px;align-items:center;justify-content:center;background:#fff;border:1px solid #c4b5fd;border-radius:14px;padding:12px;font-size:28px;font-weight:900;color:#6d28d9}
#class3-math-runtime .m3-concept-icons strong{font-size:20px}
#class3-math-runtime .m3-concept-icons small{font-size:16px;color:#64748b}
#class3-math-runtime .m3-money-concept span{font-size:20px;background:#ecfdf5;border-color:#86efac}
#class3-math-runtime .m3-concept-steps{display:flex;align-items:center;justify-content:center;flex-direction:column;gap:4px;font-size:25px;font-weight:900;color:#6d28d9}

@media(prefers-reduced-motion:reduce){#class3-math-runtime *,#class3-math-runtime *:before{animation:none!important;transition:none!important}#class3-math-runtime .m3-folder:hover .m3-folder-icon{transform:none!important}}
`;
})();
