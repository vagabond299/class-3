/* Epsilon Edu | Tiếng Việt 3 | Đại sứ Giao tiếp | 50+ thử thách riêng.
 * Module độc lập. Dữ liệu tĩnh là PUBLIC; không có API riêng hoặc quyền do client cấp.
 * v2026.10.19: bản làm lại học liệu + gameplay. */
(() => {
  'use strict';
  const ID = 'dai-su-giao-tiep';
  const TITLE = "💌 Đại sứ Giao tiếp";
  const ICON = '💌';
  const DATA = [["Bạn giúp em nhặt sách rơi. Em nói gì?","Cảm ơn bạn đã giúp mình!","Không cần đâu!","Đừng nhặt nữa!","Nói lời cảm ơn khi được giúp đỡ."],["Em vô tình làm rơi bút của bạn. Em nói gì?","Mình xin lỗi, để mình nhặt giúp bạn nhé!","Bút của bạn tự rơi đấy!","Mặc kệ!","Nhận lỗi và chủ động sửa sai."],["Muốn mượn thước của bạn, em nói gì?","Bạn cho mình mượn thước một lát nhé?","Đưa thước đây!","Mình lấy luôn nhé!","Lời đề nghị cần lịch sự và tôn trọng bạn."],["Gặp cô giáo ở cổng trường, em nói gì?","Em chào cô ạ!","Chào nhé!","Này, cô kia!","Chào hỏi lễ phép với thầy cô."],["Muốn phát biểu khi cô đang giảng, em nên làm gì?","Giơ tay xin phép cô.","Nói chen thật to.","Quay xuống bàn tán.","Giơ tay giúp giữ trật tự và tôn trọng người nói."],["Bạn đạt giải trong cuộc thi. Em nói gì?","Chúc mừng bạn, bạn giỏi lắm!","Có gì đâu mà vui!","Mình không quan tâm.","Chúc mừng thể hiện sự vui cùng thành công của bạn."],["Bạn đang buồn vì làm sai bài. Em nói gì?","Mình cùng xem lại bài nhé!","Bạn kém quá!","Đừng học nữa!","Lời động viên khích lệ người khác cố gắng."],["Em đến lớp muộn vì xe bị hỏng. Em nói gì?","Em xin lỗi cô, em xin phép vào lớp ạ.","Cho em vào ngay!","Có gì đâu ạ!","Xin phép và giải thích ngắn gọn, lễ phép."],["Thấy người lớn tuổi lên xe buýt, em nói gì?","Cháu mời bác ngồi ghế này ạ!","Bác đứng đi!","Cháu không thấy ai cả.","Nhường ghế cho người cần là hành động lịch sự."],["Muốn hỏi đường tới thư viện, em nói gì?","Bác cho cháu hỏi thư viện ở đâu ạ?","Thư viện đâu?","Nói nhanh lên!","Mở lời và hỏi bằng câu đầy đủ, lễ phép."],["Bạn cho mượn sách và đã đến ngày trả. Em nói gì?","Mình cảm ơn, mình gửi lại sách nhé!","Sách này mình giữ luôn!","Bạn lấy sau đi!","Biết giữ lời hứa và trả đồ đã mượn."],["Bố đang bận làm việc, em muốn nhờ giúp. Em nói gì?","Khi nào bố rảnh, bố giúp con một chút nhé ạ?","Bố phải giúp con ngay!","Bố làm việc chán quá!","Biết lựa thời điểm và nói lời đề nghị phù hợp."],["Em thấy bạn làm rơi ví. Em nói gì?","Bạn ơi, hình như bạn làm rơi ví này!","Mình lấy ví nhé!","Không liên quan đến mình.","Thông báo để trả lại đồ cho đúng người."],["Cô thủ thư nhắc nói nhỏ. Em trả lời gì?","Dạ, em xin lỗi, em sẽ nói nhỏ ạ.","Em không thích!","Ai cũng nói to mà!","Lắng nghe nhắc nhở và điều chỉnh hành vi."],["Bạn mời em dự sinh nhật nhưng em không đến được. Em nói gì?","Cảm ơn bạn, mình tiếc là không đến được.","Mình không đi, khỏi hỏi!","Sinh nhật chẳng vui đâu!","Từ chối lịch sự và bày tỏ sự trân trọng."],["Bạn lỡ giẫm lên chân em. Em có thể nói gì?","Không sao, lần sau bạn cẩn thận nhé!","Mình sẽ giẫm lại!","Bạn thật đáng ghét!","Tha thứ và nhắc bạn nhẹ nhàng."],["Muốn xin thêm giấy trong giờ học, em nói gì?","Thưa cô, cô cho em xin thêm giấy ạ.","Cô đưa giấy đây!","Em hết giấy thì sao!","Lời xin phép cần rõ ràng, lễ phép."],["Thấy bạn mới chuyển lớp đang ngồi một mình. Em nói gì?","Bạn cùng chơi với chúng mình nhé!","Bạn cứ ngồi đấy!","Lớp này khó lắm!","Lời mời thân thiện giúp bạn hòa nhập."],["Em được cô giáo nhận xét tiến bộ. Em nói gì?","Em cảm ơn cô, em sẽ tiếp tục cố gắng ạ.","Em biết mình giỏi rồi!","Cô phải khen em nữa!","Đón nhận lời khen khiêm tốn và biết ơn."],["Một bạn bị ngã ngoài sân. Em nên nói gì?","Bạn có đau không? Mình gọi cô giúp nhé!","Dậy ngay đi!","Thật buồn cười!","Hỏi thăm và tìm người lớn giúp khi cần."],["Muốn nhờ bạn nói lại vì em nghe chưa rõ. Em nói gì?","Bạn có thể nói lại giúp mình không?","Nói gì chẳng hiểu!","Thôi khỏi nói!","Đề nghị nhắc lại bằng lời lịch sự."],["Bạn đang kể chuyện, em muốn góp ý. Em nên làm gì?","Chờ bạn nói xong rồi góp ý nhẹ nhàng.","Ngắt lời bạn ngay.","Cười chê trước lớp.","Biết lắng nghe trước khi phát biểu."],["Cả nhóm có ý kiến khác nhau. Em nói gì?","Mình nghe từng ý kiến rồi cùng chọn nhé!","Chỉ làm theo ý mình!","Không ai được góp ý!","Trao đổi tôn trọng giúp nhóm hợp tác."],["Bạn mượn đồ nhưng em đang cần dùng. Em nói gì?","Mình đang dùng, lát nữa mình cho bạn mượn nhé.","Không bao giờ cho mượn!","Đi chỗ khác!","Có thể từ chối hoặc hẹn lại một cách lịch sự."],["Bạn báo đã khỏi ốm và đi học lại. Em nói gì?","Mừng bạn khỏe rồi, chúng mình học cùng nhé!","Ốm có gì đâu!","Sao bạn nghỉ lâu thế!","Lời hỏi thăm thể hiện quan tâm."],["Thấy lớp có rác sau giờ sinh hoạt, em nói gì?","Chúng mình cùng nhặt rác cho sạch nhé!","Kệ đi!","Cứ để cô dọn!","Đề xuất việc làm tích cực với tập thể."],["Em làm hỏng món đồ mượn của bạn. Em nói gì?","Mình xin lỗi, mình sẽ cùng bạn tìm cách sửa nhé!","Đồ của bạn kém chất lượng!","Đừng nói với ai nhé!","Trung thực nhận trách nhiệm và tìm cách khắc phục."],["Em muốn xin phép ra ngoài uống nước. Em nói gì?","Thưa cô, em xin phép ra ngoài uống nước ạ.","Em đi đây!","Em thích thì em đi!","Xin phép trước khi rời lớp."],["Cô giáo đang nói chuyện với phụ huynh, em muốn hỏi. Em nên làm gì?","Đợi đến lượt rồi xin phép được hỏi.","Chen ngang ngay lập tức.","Kéo tay cô liên tục.","Chờ đúng lượt là cách tôn trọng người khác."],["Em được bạn gửi lời chúc sinh nhật. Em nói gì?","Cảm ơn bạn, lời chúc dễ thương quá!","Biết rồi!","Chỉ thế thôi à?","Đáp lại lời chúc bằng sự cảm kích."],["Bà nhờ em lấy kính, em trả lời gì?","Dạ, cháu lấy ngay cho bà ạ.","Bà tự lấy đi!","Cháu không thích!","Trả lời lễ phép và giúp đỡ người thân."],["Bạn góp ý bài văn của em. Em nói gì?","Cảm ơn bạn, mình sẽ xem lại chỗ này.","Bạn biết gì mà nói!","Đừng đọc bài mình!","Lắng nghe góp ý để tiến bộ."],["Em phát hiện nhặt được một chiếc thẻ học sinh. Em nên nói gì với cô?","Thưa cô, em nhặt được thẻ, nhờ cô tìm bạn đánh rơi ạ.","Em giữ làm kỉ niệm!","Chẳng phải việc của em!","Nhờ người lớn trả đồ thất lạc."],["Bạn hỏi bài khi em đang làm xong. Em nói gì?","Mình giải thích cách làm cho bạn nhé!","Cứ chép bài mình đi!","Tự lo đi!","Giúp bạn hiểu cách làm thay vì chỉ chép đáp án."],["Thấy bạn tranh cãi to, em nói gì?","Các bạn bình tĩnh, mình cùng nói chuyện nhé!","Cãi to lên nữa đi!","Mình đứng xem thôi!","Gợi ý cách giải quyết bình tĩnh."],["Muốn nhắc bạn xếp hàng, em nói gì?","Chúng mình xếp hàng theo thứ tự nhé!","Đi ra cuối hàng ngay!","Bạn thật vô ý thức!","Nhắc bạn bằng giọng hòa nhã, tôn trọng."],["Em muốn mời khách uống nước. Em nói gì?","Cháu mời bác uống nước ạ!","Có nước thì uống đi!","Bác tự lấy nhé!","Lời mời cần lễ phép."],["Thấy em nhỏ lạc bố mẹ ở công viên. Em nên nói gì?","Em đứng gần đây nhé, chị gọi cô bảo vệ giúp em.","Em tự đi tìm đi!","Chị đưa em đến chỗ lạ nhé!","Trấn an và tìm người phụ trách hỗ trợ an toàn."],["Bạn làm rách tranh nhóm. Em nói gì?","Không sao, chúng mình cùng sửa nhé!","Bạn phá hỏng hết rồi!","Mình không làm nữa!","Khích lệ và cùng tìm cách sửa."],["Khi muốn hỏi cô về điểm chưa hiểu, em nói gì?","Thưa cô, cô giải thích lại chỗ này giúp em ạ.","Cô dạy khó hiểu quá!","Em chẳng muốn nghe nữa!","Mạnh dạn hỏi với thái độ tôn trọng."],["Trong nhóm, có bạn ít nói. Em nói gì?","Bạn có ý tưởng gì không? Chúng mình muốn nghe bạn.","Bạn im lặng luôn đi!","Bạn không biết gì đâu!","Khuyến khích mọi người cùng tham gia."],["Em phải trả lời thư mời tham quan, câu nào phù hợp?","Cảm ơn lời mời, em rất mong được tham gia!","Đi thì đi!","Thế thôi à?","Lời hồi đáp thể hiện thái độ trân trọng."],["Bạn quên mang bút. Em nói gì?","Mình có bút dự phòng, bạn dùng tạm nhé!","Lần nào cũng quên!","Đáng đời nhé!","Chia sẻ đồ dùng giúp bạn trong khả năng."],["Thầy giáo trao phần thưởng cho em. Em nói gì?","Em cảm ơn thầy ạ!","Em phải được nhiều hơn!","Em biết rồi!","Biết cảm ơn khi nhận phần thưởng."],["Bạn muốn em giữ kín bí mật nguy hiểm cho bạn. Em nên nói gì?","Mình lo cho bạn, chúng mình nên báo người lớn đáng tin nhé.","Mình sẽ giấu mọi chuyện.","Bạn tự giải quyết đi!","Vấn đề an toàn cần sự giúp đỡ của người lớn tin cậy."],["Em cần xin lỗi vì đã đến muộn buổi họp nhóm. Em nói gì?","Mình xin lỗi vì đến muộn, các bạn chờ lâu chưa?","Kệ mình đến muộn!","Ai bảo các bạn đến sớm!","Xin lỗi và quan tâm thời gian của người khác."],["Bạn trình bày bài thuyết trình xong. Em nói gì?","Cảm ơn bạn, mình thích ví dụ bạn đưa ra!","Bạn nói lâu quá!","Mình không nghe đâu!","Nhận xét tích cực và có căn cứ cụ thể."],["Em muốn xin phép nghỉ buổi luyện văn nghệ vì bị ốm. Em nói gì?","Thưa cô, hôm nay em bị ốm, xin phép được nghỉ tập ạ.","Em không đi tập đâu!","Tập chán quá!","Xin phép và nêu lý do ngắn gọn."],["Bạn đang đọc sách, em muốn rủ chơi. Em nói gì?","Khi nào bạn đọc xong, chúng mình chơi nhé!","Đừng đọc nữa, đi chơi ngay!","Cất sách đi!","Tôn trọng việc người khác đang làm."],["Bạn hỏi em có muốn tham gia trò chơi không. Em trả lời gì?","Có chứ, cảm ơn bạn đã rủ mình nhé!","Hỏi gì nhiều thế!","Mình tự quyết!","Đáp lời mời thân thiện và rõ ý."]] ;
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
      question('💌 Đại sứ giao tiếp – chọn lời nói phù hợp nhất!');
      const context=make('div',undefined,'speech');
      context.append(make('span','👥 Tình huống','speaker'),make('span',row[0]));area.append(context);
      const intro=make('p','Con sẽ nói hoặc làm gì để thể hiện sự tôn trọng và thân thiện?','lesson');area.append(intro);
      const conversations=make('div',undefined,'dialog-options');area.append(conversations);
      shuffle(row.slice(1,4)).forEach(text=>{
        const b=button('💬 '+text,()=>{
          if(locked||b.disabled)return;
          if(text===row[1]){b.classList.add('good');complete(true,row[4]);}
          else {b.classList.add('danger');b.disabled=true;fail('Con nghĩ xem cách nói này có lịch sự, trung thực và giúp ích cho người nghe không nhé.');}
        });conversations.append(b);
      });
      speak(row[0]);
      baseTools('Lời đáp tốt thường lễ phép, biết cảm ơn/xin lỗi đúng lúc và quan tâm đến cảm xúc người khác.',row[4]+' Lời phù hợp: “'+row[1]+'”.');
    }
    newMatch();render();
    return Object.freeze({destroy});
  }
  window.CLASS3_TV3_GAMES=window.CLASS3_TV3_GAMES||{};
  window.CLASS3_TV3_GAMES[ID]=Object.freeze({mount,challengeCount:TOTAL});
})();
