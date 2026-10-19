(() => {
  "use strict";

  // Điền URL Web App của Apps Script Lớp 3 sau khi deploy backend riêng của Lớp 3.
  // Tuyệt đối không dùng endpoint của Lớp 1/Lớp 2.
  window.CLASS3_DATA = Object.freeze({
    API_URL: "https://script.google.com/macros/s/AKfycbzRpcCMKK2ScUQcYOmOWWiT-3snztW3i2WgC5Ty5Bwl2NIvI0Kzwd4eNhdS4ySEsyIx/exec",
    TOKEN_STORAGE_KEY: "epsilon_class3_session_v1",
    API_TIMEOUT_MS: 60000,
    INSTALL_FLAG_KEY: "epsilon_class3_pwa_installed_v1",

    GREETINGS: Object.freeze([
      "Chào {name}! Cô Ong Vàng rất vui được gặp bé. Mình cùng bắt đầu nhé!",
      "Xin chào {name}! Cô Ong Vàng chúc bé một buổi học thật vui và nhiều khám phá nhé!",
      "Chào {name}! Cô Ong Vàng đang chờ bé cùng khám phá những điều mới đấy!",
      "Xin chào {name}! Cô Ong Vàng sẽ đồng hành cùng bé hôm nay. Mình bắt đầu nhé!",
      "Chào {name}! Cô Ong Vàng tin rằng mỗi ngày bé sẽ tiến bộ thêm một chút!",
      "Xin chào {name}! Cô Ong Vàng cùng bé học vui, hiểu kỹ và thật tự tin nhé!",
      "Chào {name}! Cô Ong Vàng mời bé chọn điều mình muốn khám phá hôm nay nhé!",
      "Xin chào {name}! Cô Ong Vàng rất vui vì bé đã đến. Cùng học thật vui nào!",
      "Chào {name}! Cô Ong Vàng chúc bé hôm nay có thật nhiều niềm vui và điều mới mẻ!",
      "Xin chào {name}! Cô Ong Vàng cùng bé tiến bộ từng ngày nhé!"
    ]),

    HOME_TABS: [
      { id: "class3", label: "Lớp 3", icon: "🎒", tone: "purple" },
      { id: "epsilon", label: "Epsilon Edu", icon: "🌐", tone: "pink" },
      { id: "games", label: "Games", icon: "🎮", tone: "blue" },
      { id: "tools", label: "Tools", icon: "🧰", tone: "green" },
      { id: "contact", label: "Liên hệ", icon: "💌", tone: "amber" }
    ],

    ADMIN_HOME_TAB: { id: "admin", label: "Quản lý", icon: "🛠️", tone: "indigo" },

    SUBJECTS: [
      {
        id: "math",
        apiId: "toan",
        label: "Toán",
        fullLabel: "Toán 3",
        icon: "🧮",
        tone: "blue",
        description: "Không gian học Toán của bé."
      },
      {
        id: "vietnamese",
        apiId: "tv",
        label: "Tiếng Việt",
        fullLabel: "Tiếng Việt 3",
        icon: "📚",
        tone: "pink",
        description: "Không gian học Tiếng Việt của bé."
      },
      {
        id: "english",
        apiId: "ta",
        label: "Tiếng Anh",
        fullLabel: "Tiếng Anh 3",
        icon: "🔤",
        tone: "green",
        description: "Không gian học Tiếng Anh của bé."
      }
    ],

    SUBJECT_TABS: [
      { id: "discover", label: "Khám phá", icon: "🧭", tone: "purple" },
      { id: "lessons", label: "Bài học", icon: "📖", tone: "pink" },
      { id: "exercises", label: "Bài tập", icon: "✏️", tone: "blue" },
      { id: "review", label: "Ôn tập", icon: "🧠", tone: "amber" },
      { id: "exams", label: "Đề thi", icon: "🏆", tone: "green" },
      { id: "games", label: "Mini games", icon: "🎮", tone: "indigo" }
    ],

    AVATARS: [
      "🐝","🐼","🐯","🦊","🐨","🐸","🐧","🦁","🐱","🐶","🐵","🦄",
      "🐹","🐭","🐻","🐮","🐷","🐔","🐤","🦆","🦉","🐺","🐴","🦓",
      "🦒","🐘","🦏","🦛","🐢","🐬","🐠","🐡","🐙","🦀","🦋","🐰",
      "🐞","🐌","🌟","⭐","🚀","🛸","🎨","📚","⚽","🏀","🏸","🎵",
      "🎧","🌈","🍀","🌻","🌸","🌺","🍎","🍓","🍉","🍒","🧁","🍦",
      "🎈","🎁","👑","💎","🧩","🎯","🏆","🪁","🛼","🚲","⛵","🌞"
    ],

    PREVIEW_TONES: ["pink", "purple", "blue", "green", "teal", "amber"],

    EE_CLASS_SITES: Object.freeze({
      1: "https://epsilon-class-1.pages.dev/",
      2: "https://epsilon-class-2.pages.dev/",
      3: "https://epsilon-class-3.pages.dev/"
    })
  });
})();
