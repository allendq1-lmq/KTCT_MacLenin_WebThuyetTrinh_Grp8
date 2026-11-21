// presentation/presentation.js - Bộ điều khiển Keynote Obsidian Cinema (11 Slides hoàn chỉnh)
window.PresentationApp = (() => {
  let isInitialized = false;
  let isActiveState = true;
  let currentSlideIndex = 0;
  let touchStartX = 0;
  let touchStartY = 0;
  let hudIdleTimer = null;
  let isHudHovered = false;

  // Đồng hồ sân khấu 15 phút (12:00 - 15:00 xanh tối ưu, >= 14:15 cảnh báo đỏ)
  let elapsedSeconds = 0;
  let timerRunning = false;
  let timerInterval = null;

  const SHORT_THESIS = {
    "r3-1": "Chiếm hữu tư nhân tư bản chủ nghĩa tạo ra năm khuyết tật cố hữu mà thị trường tự do không tự chữa lành.",
    "r1-1b": "Kinh tế thị trường là phương tiện chung; định hướng xã hội chủ nghĩa quyết định mục tiêu vì con người.",
    "r2-role": "Đảng định hướng chiến lược; Nhà nước thể chế hóa pháp luật, điều tiết vĩ mô và phòng vệ hội nhập.",
    "r2-b1": "Kinh tế nhà nước giữ vai trò chủ đạo ổn định vĩ mô; kinh tế tư nhân là động lực quan trọng giải phóng sức sản xuất.",
    "r2-b4": "Nhà nước điều tiết vĩ mô và phân phối lại thành quả thông qua mạng lưới an sinh toàn dân.",
    "r2-b5": "Gắn tăng trưởng với công bằng và bảo vệ sinh thái ngay từ đầu, không đợi kinh tế phát triển cao mới chia.",
    "r3-table": "Đối chiếu trực diện sáu tiêu chí bản chất giữa hai mô hình kinh tế thị trường.",
    "r3-3a": "Nhìn thẳng bốn điểm nghẽn thực tiễn trong thời kỳ quá độ để đánh giá khách quan.",
    "r3-3b": "Hoàn thiện đồng bộ thể chế pháp luật, minh bạch nguồn lực và siết chặt kỷ cương quản lý.",
    "r3-verdict": "Đã khắc phục một phần căn bản giới hạn chủ nghĩa tư bản, nhưng chưa hoàn toàn và cần tiếp tục hoàn thiện.",
  };

  // Tranh minh họa vector đa lớp + hoạt họa lặp liên tục cho tất cả các slide nội dung
  const SLIDE_VISUALS = {
    "r3-1": {
      svg: `
        <svg viewBox="0 0 480 280" fill="none" preserveAspectRatio="xMidYMid meet">
          <defs>
            <clipPath id="clipSlide2">
              <rect x="10" y="10" width="460" height="260" rx="18"/>
            </clipPath>
            <linearGradient id="skyDanger" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#4c0519" stop-opacity="0.72"/>
              <stop offset="100%" stop-color="#0f172a" stop-opacity="0.12"/>
            </linearGradient>
            <linearGradient id="towerGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#fb7185"/>
              <stop offset="100%" stop-color="#881337"/>
            </linearGradient>
          </defs>

          <g clip-path="url(#clipSlide2)">
            <rect x="10" y="10" width="460" height="260" rx="18" fill="url(#skyDanger)"/>
            <path d="M10 224 Q140 202 240 224 T470 218 L470 270 L10 270 Z" fill="rgba(244,63,94,0.2)"/>

            <g class="svg-float">
              <rect x="196" y="62" width="88" height="164" rx="8" fill="url(#towerGrad)" stroke="#fda4af" stroke-width="1.5"/>
              <rect x="212" y="80" width="16" height="18" rx="3" fill="#ffe4e6" fill-opacity="0.85"/>
              <rect x="252" y="80" width="16" height="18" rx="3" fill="#ffe4e6" fill-opacity="0.85"/>
              <rect x="212" y="112" width="16" height="18" rx="3" fill="#ffe4e6" fill-opacity="0.85"/>
              <rect x="252" y="112" width="16" height="18" rx="3" fill="#ffe4e6" fill-opacity="0.85"/>
              <circle cx="240" cy="44" r="18" fill="#fbbf24" stroke="#fef3c7" stroke-width="2" class="svg-pulse-soft"/>
              <text x="240" y="49" text-anchor="middle" fill="#78350f" font-size="15" font-weight="900">$</text>
              <circle cx="168" cy="82" r="14" fill="rgba(148,163,184,0.34)" class="svg-float-alt"/>
              <circle cx="150" cy="58" r="18" fill="rgba(148,163,184,0.22)" class="svg-float"/>
              <rect x="162" y="98" width="16" height="128" rx="4" fill="#475569"/>
            </g>

            <g class="svg-float-alt">
              <rect x="20" y="28" width="154" height="32" rx="16" fill="rgba(15,23,42,0.88)" stroke="#fb7185"/>
              <text x="97" y="48" text-anchor="middle" fill="#fda4af" font-size="11.5" font-weight="800">Lợi ích thiểu số</text>
            </g>
            <g class="svg-float">
              <rect x="304" y="28" width="156" height="32" rx="16" fill="rgba(15,23,42,0.88)" stroke="#fb7185"/>
              <text x="382" y="48" text-anchor="middle" fill="#fda4af" font-size="11.5" font-weight="800">Tư hữu tư liệu SX</text>
            </g>
            <g class="svg-float">
              <rect x="18" y="138" width="158" height="32" rx="16" fill="rgba(15,23,42,0.88)" stroke="#fb7185"/>
              <text x="97" y="158" text-anchor="middle" fill="#fda4af" font-size="11.5" font-weight="800">Ô nhiễm môi trường</text>
            </g>
            <g class="svg-float-alt">
              <rect x="304" y="108" width="156" height="32" rx="16" fill="rgba(15,23,42,0.88)" stroke="#fb7185"/>
              <text x="382" y="128" text-anchor="middle" fill="#fda4af" font-size="11.5" font-weight="800">Khủng hoảng chu kỳ</text>
            </g>
            <g class="svg-float">
              <rect x="304" y="180" width="156" height="32" rx="16" fill="rgba(15,23,42,0.88)" stroke="#fb7185"/>
              <text x="382" y="200" text-anchor="middle" fill="#fda4af" font-size="11.5" font-weight="800">Phân hóa giàu nghèo</text>
            </g>

            <text x="240" y="251" text-anchor="middle" fill="#fecdd3" font-size="12" font-weight="800">Mâu thuẫn cố hữu từ chiếm hữu tư nhân tư bản chủ nghĩa</text>
          </g>

          <rect x="10" y="10" width="460" height="260" rx="18" stroke="rgba(251,113,133,0.38)" stroke-width="1.5"/>
        </svg>
      `,
      metrics: [
        { val: "5 Giới hạn", lbl: "Khuyết tật cố hữu", color: "#fb7185" },
        { val: "Tư hữu", lbl: "Nguồn gốc mâu thuẫn", color: "#f43f5e" },
        { val: "Bối cảnh", lbl: "Đặt ra câu hỏi trọng tâm", color: "#fbbf24" },
      ],
    },
    "r1-1b": {
      svg: `
        <svg viewBox="0 0 480 280" fill="none" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="bridgeSky" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="#0c4a6e" stop-opacity="0.55"/>
              <stop offset="100%" stop-color="#064e3b" stop-opacity="0.5"/>
            </linearGradient>
          </defs>
          <rect x="10" y="10" width="460" height="260" rx="18" fill="url(#bridgeSky)" stroke="rgba(56,189,248,0.32)"/>

          <circle cx="240" cy="80" r="46" stroke="rgba(251,191,36,0.45)" stroke-width="1.5" stroke-dasharray="6 5" class="svg-spin-slow"/>
          <circle cx="240" cy="80" r="33" fill="rgba(245,158,11,0.24)" stroke="#fbbf24" stroke-width="2" class="svg-pulse-soft"/>
          <polygon points="240,55 246,73 265,73 250,84 256,102 240,91 224,102 230,84 215,73 234,73" fill="#fbbf24"/>

          <path d="M40 182 Q240 116 440 182" stroke="rgba(52,211,153,0.3)" stroke-width="4" fill="none"/>
          <path class="svg-dash-flow" d="M40 182 Q240 116 440 182" stroke="#34d399" stroke-width="4" stroke-dasharray="14 10" fill="none"/>
          <line x1="40" y1="184" x2="440" y2="184" stroke="#f8fafc" stroke-width="3"/>
          <line x1="135" y1="154" x2="135" y2="184" stroke="#94a3b8" stroke-width="2"/>
          <line x1="240" y1="148" x2="240" y2="184" stroke="#94a3b8" stroke-width="2"/>
          <line x1="345" y1="154" x2="345" y2="184" stroke="#94a3b8" stroke-width="2"/>

          <g class="svg-float">
            <rect x="20" y="194" width="210" height="58" rx="12" fill="rgba(14,165,233,0.24)" stroke="#38bdf8" stroke-width="1.8"/>
            <text x="125" y="218" text-anchor="middle" fill="#7dd3fc" font-size="11.5" font-weight="800">QUY LUẬT THỊ TRƯỜNG</text>
            <text x="125" y="238" text-anchor="middle" fill="#ffffff" font-size="11" font-weight="600">Giá trị • Cung cầu • Cạnh tranh</text>
          </g>

          <g class="svg-float-alt">
            <rect x="250" y="194" width="210" height="58" rx="12" fill="rgba(16,185,129,0.24)" stroke="#10b981" stroke-width="1.8"/>
            <text x="355" y="218" text-anchor="middle" fill="#6ee7b7" font-size="11.5" font-weight="800">ĐỊNH HƯỚNG XÃ HỘI</text>
            <text x="355" y="238" text-anchor="middle" fill="#ffffff" font-size="11" font-weight="600">Dân giàu, nước mạnh, công bằng</text>
          </g>
        </svg>
      `,
      metrics: [
        { val: "2 Yếu tố", lbl: "Thị trường + Định hướng", color: "#38bdf8" },
        { val: "Điều 51", lbl: "Hiến pháp năm 2013", color: "#10b981" },
        { val: "Đại hội XIII", lbl: "Mô hình kinh tế tổng quát", color: "#fbbf24" },
      ],
    },
    "r2-role": {
      svg: `
        <svg viewBox="0 0 500 280" fill="none" preserveAspectRatio="xMidYMid meet">
          <rect x="10" y="10" width="480" height="260" rx="18" fill="rgba(15,23,42,0.58)" stroke="rgba(245,158,11,0.3)"/>
          <g class="svg-float">
            <rect x="20" y="24" width="220" height="232" rx="14" fill="rgba(245,158,11,0.15)" stroke="#f59e0b" stroke-width="2"/>
            <circle cx="130" cy="56" r="18" fill="#b91c1c" stroke="#fbbf24" stroke-width="2" class="svg-pulse-soft"/>
            <polygon points="130,44 133,52 142,52 135,57 137,66 130,61 123,66 125,57 118,52 127,52" fill="#fbbf24"/>
            <text x="130" y="94" text-anchor="middle" fill="#fbbf24" font-size="11.5" font-weight="900">ĐẢNG CỘNG SẢN VIỆT NAM</text>
            <line x1="36" y1="106" x2="224" y2="106" stroke="rgba(245,158,11,0.35)"/>
            <text x="34" y="132" fill="#fef3c7" font-size="11" font-weight="700">• Đề ra cương lĩnh, chiến lược</text>
            <text x="34" y="160" fill="#fef3c7" font-size="11" font-weight="700">• Giữ vững định hướng mục tiêu</text>
            <text x="34" y="188" fill="#fef3c7" font-size="11" font-weight="700">• Lãnh đạo thể chế hóa pháp luật</text>
            <text x="34" y="216" fill="#fef3c7" font-size="11" font-weight="700">• Chống tham nhũng, tiêu cực</text>
          </g>

          <g class="svg-float-alt">
            <rect x="260" y="24" width="220" height="232" rx="14" fill="rgba(56,189,248,0.15)" stroke="#38bdf8" stroke-width="2"/>
            <circle cx="370" cy="56" r="18" fill="#0369a1" stroke="#7dd3fc" stroke-width="2" class="svg-pulse-soft"/>
            <path d="M360 62 L380 62 M370 45 L370 62 M362 50 L378 50" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round"/>
            <text x="370" y="94" text-anchor="middle" fill="#38bdf8" font-size="11.5" font-weight="900">NHÀ NƯỚC PHÁP QUYỀN</text>
            <line x1="276" y1="106" x2="464" y2="106" stroke="rgba(56,189,248,0.35)"/>
            <text x="274" y="132" fill="#e0f2fe" font-size="11" font-weight="700">• Hoàn thiện hệ thống pháp luật</text>
            <text x="274" y="160" fill="#e0f2fe" font-size="11" font-weight="700">• Giữ ổn định kinh tế vĩ mô</text>
            <text x="274" y="188" fill="#e0f2fe" font-size="11" font-weight="700">• Đa phương hóa hội nhập</text>
            <text x="274" y="216" fill="#e0f2fe" font-size="11" font-weight="700">• Phòng vệ thị trường nội địa</text>
          </g>
          <path class="svg-dash-flow" d="M240 140 L260 140" stroke="#10b981" stroke-width="4" stroke-dasharray="5 4" stroke-linecap="round"/>
        </svg>
      `,
      metrics: [
        { val: "Đảng lãnh đạo", lbl: "Giữ định hướng chiến lược", color: "#fbbf24" },
        { val: "Nhà nước", lbl: "Điều tiết vĩ mô & pháp luật", color: "#38bdf8" },
        { val: "Phòng vệ", lbl: "Bảo vệ doanh nghiệp nội", color: "#10b981" },
      ],
    },
    "r2-b1": {
      svg: `
        <svg viewBox="0 0 480 280" fill="none" preserveAspectRatio="xMidYMid meet">
          <defs>
            <clipPath id="clipSlide5">
              <rect x="10" y="10" width="460" height="260" rx="18"/>
            </clipPath>
            <linearGradient id="areaGreen" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#10b981" stop-opacity="0.45"/>
              <stop offset="100%" stop-color="#10b981" stop-opacity="0.04"/>
            </linearGradient>
          </defs>

          <g clip-path="url(#clipSlide5)">
            <rect x="10" y="10" width="460" height="260" rx="18" fill="rgba(6,78,59,0.32)"/>

            <!-- Cụm hạ tầng & doanh nghiệp đặt tách biệt ở góc trên bên phải -->
            <g class="svg-float-alt">
              <rect x="292" y="34" width="24" height="62" rx="4" fill="rgba(56,189,248,0.24)" stroke="#38bdf8"/>
              <rect x="324" y="22" width="30" height="74" rx="4" fill="rgba(16,185,129,0.26)" stroke="#34d399"/>
              <rect x="362" y="42" width="26" height="54" rx="4" fill="rgba(245,158,11,0.24)" stroke="#fbbf24"/>
              <rect x="232" y="102" width="222" height="26" rx="13" fill="rgba(15,23,42,0.85)" stroke="rgba(52,211,153,0.45)"/>
              <text x="343" y="119" text-anchor="middle" fill="#a7f3d0" font-size="11" font-weight="700">Hạ tầng &amp; Doanh nghiệp phát triển</text>
            </g>

            <!-- Đường biểu đồ giảm nghèo hạ thấp mượt mà, hoàn toàn không chạm chữ -->
            <line x1="52" y1="224" x2="432" y2="224" stroke="rgba(255,255,255,0.28)" stroke-width="1.5"/>
            <path d="M68,74 C135,148 238,196 412,210 L412,224 L68,224 Z" fill="url(#areaGreen)"/>
            <path d="M68,74 C135,148 238,196 412,210" stroke="#10b981" stroke-width="4" stroke-linecap="round"/>
            <path class="svg-dash-flow" d="M68,74 C135,148 238,196 412,210" stroke="#a7f3d0" stroke-width="2.5" stroke-dasharray="12 12" stroke-linecap="round"/>

            <!-- Nhãn mốc 1993 -->
            <circle cx="68" cy="74" r="7" fill="#fb7185" stroke="#ffffff" stroke-width="2" class="svg-pulse-soft"/>
            <rect x="82" y="42" width="138" height="32" rx="8" fill="rgba(244,63,94,0.3)" stroke="#fb7185"/>
            <text x="151" y="62" text-anchor="middle" fill="#fda4af" font-size="12.5" font-weight="800">Trên 58% (1993)</text>

            <!-- Nhãn mốc hiện nay đặt gọn phía trên điểm cuối -->
            <circle cx="412" cy="210" r="8" fill="#10b981" stroke="#ffffff" stroke-width="2.5" class="svg-pulse-soft"/>
            <rect x="294" y="156" width="146" height="32" rx="8" fill="rgba(16,185,129,0.32)" stroke="#10b981"/>
            <text x="367" y="176" text-anchor="middle" fill="#6ee7b7" font-size="13" font-weight="900">Dưới 3% Hiện nay</text>

            <text x="240" y="251" text-anchor="middle" fill="#d1fae5" font-size="12" font-weight="700">Thành tựu giảm nghèo gắn với đa dạng hóa sở hữu tại Việt Nam</text>
          </g>

          <rect x="10" y="10" width="460" height="260" rx="18" stroke="rgba(16,185,129,0.35)" stroke-width="1.5"/>
        </svg>
      `,
      metrics: [
        { val: ">58% → <3%", lbl: "Giảm tỷ lệ hộ nghèo", color: "#10b981" },
        { val: "Nhà nước", lbl: "Chủ đạo hạ tầng chiến lược", color: "#38bdf8" },
        { val: "Tư nhân", lbl: "Động lực tăng trưởng", color: "#fbbf24" },
      ],
    },
    "r2-b4": {
      svg: `
        <svg viewBox="0 0 480 280" fill="none" preserveAspectRatio="xMidYMid meet">
          <rect x="10" y="10" width="460" height="260" rx="18" fill="rgba(12,74,110,0.32)" stroke="rgba(56,189,248,0.3)"/>
          <circle cx="152" cy="140" r="94" stroke="rgba(52,211,153,0.3)" stroke-width="1.5" stroke-dasharray="8 6" class="svg-spin-slow"/>
          <circle cx="152" cy="140" r="80" stroke="rgba(255,255,255,0.12)" stroke-width="15"/>
          <circle cx="152" cy="140" r="80" stroke="#10b981" stroke-width="15" stroke-linecap="round"
            stroke-dasharray="468 502" transform="rotate(-90 152 140)" class="svg-pulse-soft"/>
          <path d="M152 90 L172 99 V117 C172 130 163 140 152 144 C141 140 132 130 132 117 V99 Z" fill="rgba(16,185,129,0.28)" stroke="#6ee7b7" stroke-width="2"/>
          <path d="M152 107 V125 M143 116 H161" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round"/>
          <text x="152" y="170" text-anchor="middle" fill="#ffffff" font-size="24" font-weight="900">&gt;93%</text>
          <text x="152" y="188" text-anchor="middle" fill="#6ee7b7" font-size="11" font-weight="800">BẢO HIỂM Y TẾ</text>

          <g class="svg-float">
            <rect x="266" y="38" width="186" height="56" rx="12" fill="rgba(56,189,248,0.2)" stroke="#38bdf8" stroke-width="1.8"/>
            <text x="359" y="62" text-anchor="middle" fill="#38bdf8" font-size="12" font-weight="800">ĐIỀU TIẾT VĨ MÔ</text>
            <text x="359" y="81" text-anchor="middle" fill="#ffffff" font-size="12" font-weight="700">Kiểm soát lạm phát</text>
          </g>

          <g class="svg-float-alt">
            <rect x="266" y="112" width="186" height="56" rx="12" fill="rgba(245,158,11,0.2)" stroke="#f59e0b" stroke-width="1.8"/>
            <text x="359" y="136" text-anchor="middle" fill="#fbbf24" font-size="12" font-weight="800">BÌNH ỔN GIÁ CẢ</text>
            <text x="359" y="155" text-anchor="middle" fill="#ffffff" font-size="12" font-weight="700">Điện, y tế, giáo dục</text>
          </g>

          <g class="svg-float">
            <rect x="266" y="186" width="186" height="56" rx="12" fill="rgba(16,185,129,0.2)" stroke="#10b981" stroke-width="1.8"/>
            <text x="359" y="210" text-anchor="middle" fill="#6ee7b7" font-size="12" font-weight="800">ĐA KÊNH PHÂN PHỐI</text>
            <text x="359" y="229" text-anchor="middle" fill="#ffffff" font-size="12" font-weight="700">Lao động và phúc lợi</text>
          </g>
        </svg>
      `,
      metrics: [
        { val: ">93%", lbl: "Dân số có bảo hiểm y tế", color: "#10b981" },
        { val: "Bình ổn", lbl: "Mặt hàng thiết yếu", color: "#38bdf8" },
        { val: "An sinh", lbl: "Phân phối lại công bằng", color: "#fbbf24" },
      ],
    },
    "r2-b5": {
      svg: `
        <svg viewBox="0 0 480 280" fill="none" preserveAspectRatio="xMidYMid meet">
          <defs>
            <clipPath id="clipSlide7">
              <rect x="10" y="10" width="460" height="260" rx="18"/>
            </clipPath>
          </defs>
          <g clip-path="url(#clipSlide7)">
            <rect x="10" y="10" width="460" height="260" rx="18" fill="rgba(6,78,59,0.34)"/>
            <path d="M10 218 Q150 174 275 210 T470 198 L470 270 L10 270 Z" fill="rgba(16,185,129,0.28)"/>

            <line x1="76" y1="112" x2="76" y2="202" stroke="#e2e8f0" stroke-width="3"/>
            <g class="svg-turbine-spin">
              <path d="M76 112 L60 86 M76 112 L104 108 M76 112 L70 140" stroke="#38bdf8" stroke-width="3.2" stroke-linecap="round"/>
              <circle cx="76" cy="112" r="4" fill="#ffffff"/>
            </g>

            <rect x="400" y="166" width="8" height="38" fill="#92400e"/>
            <g class="svg-sway">
              <circle cx="404" cy="150" r="24" fill="#10b981" fill-opacity="0.88"/>
              <circle cx="388" cy="160" r="16" fill="#34d399" fill-opacity="0.88"/>
              <circle cx="420" cy="160" r="16" fill="#059669" fill-opacity="0.92"/>
            </g>

            <!-- Mở rộng vòng tròn trung tâm để chữ NET ZERO 2050 nằm lọt hẳn vào trong -->
            <circle cx="240" cy="118" r="88" stroke="#34d399" stroke-width="2" stroke-dasharray="7 5" class="svg-spin-slow"/>
            <circle cx="240" cy="118" r="72" fill="rgba(6,95,70,0.9)" stroke="#6ee7b7" stroke-width="2.5" class="svg-pulse-soft"/>
            <text x="240" y="109" text-anchor="middle" fill="#a7f3d0" font-size="11.5" font-weight="800">CAM KẾT COP26</text>
            <text x="240" y="133" text-anchor="middle" fill="#ffffff" font-size="17" font-weight="900">NET ZERO 2050</text>

            <!-- Mở rộng viên thuốc phía dưới lên 364px để ôm trọn dòng chữ -->
            <rect x="58" y="222" width="364" height="34" rx="17" fill="rgba(15,23,42,0.88)" stroke="#34d399" stroke-width="1.5"/>
            <text x="240" y="243" text-anchor="middle" fill="#ecfdf5" font-size="11.5" font-weight="800">Luật Bảo vệ môi trường 2020 &amp; Kinh tế tuần hoàn</text>
          </g>
          <rect x="10" y="10" width="460" height="260" rx="18" stroke="rgba(52,211,153,0.35)" stroke-width="1.5"/>
        </svg>
      `,
      metrics: [
        { val: "Net Zero", lbl: "Phát thải ròng 2050", color: "#10b981" },
        { val: "Luật 2020", lbl: "Bảo vệ môi trường", color: "#38bdf8" },
        { val: "Ngay từ đầu", lbl: "Tăng trưởng + Công bằng", color: "#a78bfa" },
      ],
    },
    "r3-table": {
      svg: `
        <svg viewBox="0 0 360 330" fill="none" preserveAspectRatio="xMidYMid meet">
          <rect x="10" y="10" width="340" height="310" rx="18" fill="rgba(15,23,42,0.62)" stroke="rgba(251,191,36,0.32)"/>

          <circle cx="180" cy="70" r="36" stroke="rgba(251,191,36,0.4)" stroke-width="1.5" stroke-dasharray="6 5" class="svg-spin-slow"/>
          <circle cx="180" cy="70" r="24" fill="rgba(245,158,11,0.22)" stroke="#fbbf24" stroke-width="2" class="svg-pulse-soft"/>
          <text x="180" y="75" text-anchor="middle" fill="#fbbf24" font-size="13" font-weight="900">VS</text>

          <g class="svg-float">
            <rect x="24" y="122" width="144" height="140" rx="14" fill="rgba(244,63,94,0.16)" stroke="#fb7185" stroke-width="1.8"/>
            <text x="96" y="149" text-anchor="middle" fill="#fda4af" font-size="11.5" font-weight="900">KTTT TƯ BẢN</text>
            <line x1="38" y1="160" x2="154" y2="160" stroke="rgba(251,113,133,0.35)"/>
            <text x="96" y="184" text-anchor="middle" fill="#ffe4e6" font-size="11" font-weight="700">Lợi nhuận thiểu số</text>
            <text x="96" y="209" text-anchor="middle" fill="#ffe4e6" font-size="11" font-weight="700">Tư hữu thống trị</text>
            <text x="96" y="234" text-anchor="middle" fill="#ffe4e6" font-size="11" font-weight="700">Phân hóa giàu nghèo</text>
          </g>

          <g class="svg-float-alt">
            <rect x="192" y="122" width="144" height="140" rx="14" fill="rgba(16,185,129,0.16)" stroke="#34d399" stroke-width="1.8"/>
            <text x="264" y="149" text-anchor="middle" fill="#6ee7b7" font-size="11.5" font-weight="900">ĐỊNH HƯỚNG XHCN</text>
            <line x1="206" y1="160" x2="322" y2="160" stroke="rgba(52,211,153,0.35)"/>
            <text x="264" y="184" text-anchor="middle" fill="#ecfdf5" font-size="11" font-weight="700">Vì hạnh phúc nhân dân</text>
            <text x="264" y="209" text-anchor="middle" fill="#ecfdf5" font-size="11" font-weight="700">Đa dạng hình thức sở hữu</text>
            <text x="264" y="234" text-anchor="middle" fill="#ecfdf5" font-size="11" font-weight="700">Công bằng &amp; Bền vững</text>
          </g>

          <rect x="34" y="276" width="292" height="30" rx="15" fill="rgba(245,158,11,0.2)" stroke="rgba(251,191,36,0.45)"/>
          <text x="180" y="295" text-anchor="middle" fill="#fde68a" font-size="11.5" font-weight="800">Đối chiếu bản chất trên 6 phương diện cốt lõi</text>
        </svg>
      `,
      metrics: [
        { val: "6 Tiêu chí", lbl: "So sánh toàn diện", color: "#fbbf24" },
        { val: "Khác biệt", lbl: "Mục tiêu & Sở hữu", color: "#fb7185" },
        { val: "Ưu việt", lbl: "Định hướng nhân văn", color: "#10b981" },
      ],
    },
    "r3-3a": {
      svg: `
        <svg viewBox="0 0 480 280" fill="none" preserveAspectRatio="xMidYMid meet">
          <rect x="10" y="10" width="460" height="260" rx="18" fill="rgba(76,5,25,0.34)" stroke="rgba(251,113,133,0.3)"/>
          <g class="svg-float">
            <rect x="22" y="24" width="210" height="108" rx="14" fill="rgba(15,23,42,0.82)" stroke="#fb7185" stroke-width="1.8"/>
            <text x="38" y="51" fill="#fda4af" font-size="10.8" font-weight="800">YẾU TỐ XÃ HỘI CHỦ NGHĨA</text>
            <text x="38" y="76" fill="#ffffff" font-size="13.5" font-weight="800">Hợp tác xã còn yếu</text>
            <text x="38" y="100" fill="#cbd5e1" font-size="11.2">Hàng giả, đa cấp, ô nhiễm</text>
          </g>

          <g class="svg-float-alt">
            <rect x="248" y="24" width="210" height="108" rx="14" fill="rgba(15,23,42,0.82)" stroke="#fb7185" stroke-width="1.8"/>
            <text x="264" y="51" fill="#fda4af" font-size="10.8" font-weight="800">KINH TẾ SỐ CÔNG NGHỆ 4.0</text>
            <text x="264" y="76" fill="#ffffff" font-size="13.5" font-weight="800">Thể chế chưa theo kịp</text>
            <text x="264" y="100" fill="#cbd5e1" font-size="11.2">Quản lý thuế nền tảng số</text>
          </g>

          <g class="svg-float-alt">
            <rect x="22" y="148" width="210" height="108" rx="14" fill="rgba(15,23,42,0.82)" stroke="#fb7185" stroke-width="1.8"/>
            <text x="38" y="175" fill="#fda4af" font-size="10.8" font-weight="800">TIẾP CẬN NGUỒN LỰC</text>
            <text x="38" y="200" fill="#ffffff" font-size="13.5" font-weight="800">Chưa thật bình đẳng</text>
            <text x="38" y="224" fill="#cbd5e1" font-size="11.2">Khó vốn; thất thoát vốn công</text>
          </g>

          <g class="svg-float">
            <rect x="248" y="148" width="210" height="108" rx="14" fill="rgba(15,23,42,0.82)" stroke="#fb7185" stroke-width="1.8"/>
            <text x="264" y="175" fill="#fda4af" font-size="10.8" font-weight="800">XÃ HỘI VÀ QUẢN LÝ</text>
            <text x="264" y="200" fill="#ffffff" font-size="13.5" font-weight="800">Phân hóa &amp; Lợi ích nhóm</text>
            <text x="264" y="224" fill="#cbd5e1" font-size="11.2">Chênh lệch đô thị – nông thôn</text>
          </g>
        </svg>
      `,
      metrics: [
        { val: "4 Hạn chế", lbl: "Bất cập thực tiễn hiện nay", color: "#fb7185" },
        { val: "Kinh tế số", lbl: "Áp lực quản lý thuế 4.0", color: "#f43f5e" },
        { val: "Quá độ", lbl: "Cần tiếp tục hoàn thiện", color: "#fbbf24" },
      ],
    },
    "r3-3b": {
      svg: `
        <svg viewBox="0 0 480 280" fill="none" preserveAspectRatio="xMidYMid meet">
          <rect x="10" y="10" width="460" height="260" rx="18" fill="rgba(12,74,110,0.34)" stroke="rgba(56,189,248,0.3)"/>
          <rect x="26" y="22" width="428" height="42" rx="12" fill="rgba(56,189,248,0.26)" stroke="#38bdf8" stroke-width="1.8" class="svg-pulse-soft"/>
          <text x="240" y="48" text-anchor="middle" fill="#ffffff" font-size="14" font-weight="900">BỐN NHÓM GIẢI PHÁP KHẮC PHỤC ĐỒNG BỘ</text>

          <g class="svg-float">
            <rect x="26" y="82" width="98" height="168" rx="12" fill="rgba(15,23,42,0.8)" stroke="#38bdf8" stroke-width="1.8"/>
            <circle cx="75" cy="114" r="16" fill="rgba(56,189,248,0.25)"/>
            <text x="75" y="119" text-anchor="middle" fill="#38bdf8" font-size="14.5" font-weight="900">I</text>
            <text x="75" y="152" text-anchor="middle" fill="#ffffff" font-size="12" font-weight="800">Giám sát</text>
            <text x="75" y="170" text-anchor="middle" fill="#ffffff" font-size="12" font-weight="800">thị trường</text>
            <text x="75" y="194" text-anchor="middle" fill="#bae6fd" font-size="11.2" font-weight="700">Đổi mới</text>
            <text x="75" y="211" text-anchor="middle" fill="#bae6fd" font-size="11.2" font-weight="700">hợp tác xã</text>
          </g>

          <g class="svg-float-alt">
            <rect x="136" y="82" width="98" height="168" rx="12" fill="rgba(15,23,42,0.8)" stroke="#10b981" stroke-width="1.8"/>
            <circle cx="185" cy="114" r="16" fill="rgba(16,185,129,0.25)"/>
            <text x="185" y="119" text-anchor="middle" fill="#10b981" font-size="14.5" font-weight="900">II</text>
            <text x="185" y="152" text-anchor="middle" fill="#ffffff" font-size="12" font-weight="800">Pháp luật</text>
            <text x="185" y="170" text-anchor="middle" fill="#ffffff" font-size="12" font-weight="800">&amp; Thuế số</text>
            <text x="185" y="194" text-anchor="middle" fill="#6ee7b7" font-size="11.2" font-weight="700">Kinh tế</text>
            <text x="185" y="211" text-anchor="middle" fill="#6ee7b7" font-size="11.2" font-weight="700">nền tảng 4.0</text>
          </g>

          <g class="svg-float">
            <rect x="246" y="82" width="98" height="168" rx="12" fill="rgba(15,23,42,0.8)" stroke="#f59e0b" stroke-width="1.8"/>
            <circle cx="295" cy="114" r="16" fill="rgba(245,158,11,0.25)"/>
            <text x="295" y="119" text-anchor="middle" fill="#fbbf24" font-size="14.5" font-weight="900">III</text>
            <text x="295" y="152" text-anchor="middle" fill="#ffffff" font-size="12" font-weight="800">Bình đẳng</text>
            <text x="295" y="170" text-anchor="middle" fill="#ffffff" font-size="12" font-weight="800">nguồn lực</text>
            <text x="295" y="194" text-anchor="middle" fill="#fde68a" font-size="11.2" font-weight="700">Minh bạch</text>
            <text x="295" y="211" text-anchor="middle" fill="#fde68a" font-size="11.2" font-weight="700">vốn công</text>
          </g>

          <g class="svg-float-alt">
            <rect x="356" y="82" width="98" height="168" rx="12" fill="rgba(15,23,42,0.8)" stroke="#a78bfa" stroke-width="1.8"/>
            <circle cx="405" cy="114" r="16" fill="rgba(167,139,250,0.25)"/>
            <text x="405" y="119" text-anchor="middle" fill="#a78bfa" font-size="14.5" font-weight="900">IV</text>
            <text x="405" y="152" text-anchor="middle" fill="#ffffff" font-size="12" font-weight="800">An sinh</text>
            <text x="405" y="170" text-anchor="middle" fill="#ffffff" font-size="12" font-weight="800">bền vững</text>
            <text x="405" y="194" text-anchor="middle" fill="#ddd6fe" font-size="11.2" font-weight="700">Chống tham</text>
            <text x="405" y="211" text-anchor="middle" fill="#ddd6fe" font-size="11.2" font-weight="700">nhũng triệt để</text>
          </g>
        </svg>
      `,
      metrics: [
        { val: "4 Giải pháp", lbl: "Khắc phục trực diện", color: "#38bdf8" },
        { val: "Minh bạch", lbl: "Quản trị nguồn lực", color: "#10b981" },
        { val: "Kỷ cương", lbl: "Chống lợi ích nhóm", color: "#fbbf24" },
      ],
    },
  };

  function getSlides() {
    return (window.PresentationData && window.PresentationData.slides) || [];
  }

  function getRoomNames() {
    return (window.PresentationData && window.PresentationData.roomNames) || {};
  }

  function getStageFromIndex(idx) {
    if (idx === 0) return 0;
    if (idx === 1) return 1;
    if (idx === 2 || idx === 3) return 2;
    if (idx >= 4 && idx <= 7) return 3;
    if (idx === 8 || idx === 9) return 4;
    return 5;
  }

  function updateStepperGlider(activeStage) {
    const glider = document.getElementById("stepper-glider");
    const pills = document.querySelectorAll(".step-pill");
    let activePill = null;

    pills.forEach((pill) => {
      const st = parseInt(pill.getAttribute("data-step-stage"), 10);
      const isMatch = st === activeStage;
      pill.classList.toggle("active", isMatch);
      if (isMatch) activePill = pill;
    });

    if (glider && activePill) {
      glider.style.width = `${activePill.offsetWidth}px`;
      glider.style.transform = `translateX(${activePill.offsetLeft}px)`;
    }
  }

  // Slide 01: Trang bìa mở đầu
  function buildIntroSceneMarkup(slide, animClass) {
    return `
      <article class="slide-scene intro-hero-scene is-current ${animClass}">
        <div class="intro-orbital-backdrop" aria-hidden="true">
          <svg viewBox="0 0 1000 1000" fill="none" preserveAspectRatio="xMidYMid slice">
            <defs>
              <radialGradient id="introCoreAura" cx="50%" cy="46%" r="50%">
                <stop offset="0%" stop-color="#f59e0b" stop-opacity="0.38"/>
                <stop offset="55%" stop-color="#10b981" stop-opacity="0.16"/>
                <stop offset="100%" stop-color="#050811" stop-opacity="0"/>
              </radialGradient>
              <linearGradient id="beamGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#fbbf24" stop-opacity="0"/>
                <stop offset="50%" stop-color="#fbbf24" stop-opacity="0.22"/>
                <stop offset="100%" stop-color="#10b981" stop-opacity="0"/>
              </linearGradient>
            </defs>

            <circle cx="500" cy="470" r="450" fill="url(#introCoreAura)" class="svg-pulse-soft"/>
            <rect x="210" y="40" width="2" height="920" fill="url(#beamGrad)"/>
            <rect x="500" y="20" width="2.5" height="960" fill="url(#beamGrad)"/>
            <rect x="790" y="40" width="2" height="920" fill="url(#beamGrad)"/>

            <g class="svg-spin-slow">
              <circle cx="500" cy="480" r="390" stroke="rgba(245,158,11,0.32)" stroke-width="2" stroke-dasharray="16 12"/>
              <circle cx="500" cy="90" r="8" fill="#fbbf24"/>
              <circle cx="890" cy="480" r="7" fill="#38bdf8"/>
              <circle cx="110" cy="480" r="7" fill="#10b981"/>
            </g>
            <g class="svg-spin-reverse">
              <circle cx="500" cy="480" r="285" stroke="rgba(52,211,153,0.28)" stroke-width="1.8" stroke-dasharray="10 10"/>
              <circle cx="702" cy="278" r="6" fill="#fbbf24"/>
              <circle cx="298" cy="682" r="6" fill="#38bdf8"/>
            </g>

            <g opacity="0.3" class="svg-float">
              <rect x="140" y="750" width="54" height="210" rx="8" fill="#38bdf8"/>
              <rect x="212" y="690" width="66" height="270" rx="8" fill="#10b981"/>
              <rect x="296" y="775" width="48" height="185" rx="8" fill="#f59e0b"/>
              <rect x="656" y="765" width="52" height="195" rx="8" fill="#f59e0b"/>
              <rect x="726" y="685" width="68" height="275" rx="8" fill="#10b981"/>
              <rect x="812" y="745" width="54" height="215" rx="8" fill="#38bdf8"/>
              <path d="M80 955 Q500 885 920 955" stroke="#fbbf24" stroke-width="3" fill="none"/>
            </g>
          </svg>
        </div>

        <div class="intro-center-content">
          <div class="intro-course-ribbon">
            <span class="ribbon-pulse-dot"></span>
            <span>Kinh tế chính trị Mác - Lênin • Lớp SS008.R12</span>
          </div>

          <div class="intro-cq-card">
            <span id="pres-slide-subtitle" class="intro-cq-tag">Câu Hỏi Trọng Tâm (CQ)</span>
            <h2 id="pres-slide-title" class="intro-cq-question">
              “<span class="hl-amber">Kinh tế thị trường định hướng xã hội chủ nghĩa</span> có giải quyết được những <span class="hl-emerald">giới hạn lịch sử của chủ nghĩa tư bản</span> không?”
            </h2>
          </div>

          <div class="intro-meta-grid">
            <div class="intro-meta-card">
              <div class="meta-icon-box" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <div>
                <span class="meta-card-kicker">Nhóm thực hiện</span>
                <div class="meta-card-value">Nhóm 8</div>
              </div>
            </div>

            <div class="intro-meta-card">
              <div class="meta-icon-box is-emerald" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                </svg>
              </div>
              <div>
                <span class="meta-card-kicker">Học phần và Lớp</span>
                <div class="meta-card-value">Kinh tế chính trị Mác - Lênin • SS008.R12</div>
              </div>
            </div>

            <div class="intro-meta-card">
              <div class="meta-icon-box is-sky" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                  <path d="M6 12v5c3 3 9 3 12 0v-5"/>
                </svg>
              </div>
              <div>
                <span class="meta-card-kicker">Giảng viên hướng dẫn</span>
                <div class="meta-card-value">Nguyễn Anh Khoa</div>
              </div>
            </div>
          </div>

          <div class="intro-roadmap-strip" aria-label="Sơ đồ 5 chặng lập luận">
            <button type="button" class="roadmap-node is-rose" onclick="window.PresentationApp.goToSlide(1)">
              <span class="rm-step">01</span>
              <span class="rm-text">Bối cảnh CNTB</span>
            </button>
            <span class="roadmap-connector" aria-hidden="true"></span>
            <button type="button" class="roadmap-node is-amber" onclick="window.PresentationApp.goToSlide(2)">
              <span class="rm-step">02</span>
              <span class="rm-text">Đường lối ĐHQG</span>
            </button>
            <span class="roadmap-connector" aria-hidden="true"></span>
            <button type="button" class="roadmap-node is-emerald" onclick="window.PresentationApp.goToSlide(4)">
              <span class="rm-step">03</span>
              <span class="rm-text">Thực hiện 5 trụ cột</span>
            </button>
            <span class="roadmap-connector" aria-hidden="true"></span>
            <button type="button" class="roadmap-node is-sky" onclick="window.PresentationApp.goToSlide(8)">
              <span class="rm-step">04</span>
              <span class="rm-text">Kết quả &amp; Giải pháp</span>
            </button>
            <span class="roadmap-connector" aria-hidden="true"></span>
            <button type="button" class="roadmap-node is-gold" onclick="window.PresentationApp.goToSlide(10)">
              <span class="rm-step">05</span>
              <span class="rm-text">Phán quyết CQ</span>
            </button>
          </div>
        </div>

        <span id="pres-slide-badge" class="sr-only">${slide.badge || ""}</span>
        <div id="pres-key-points" class="sr-only"></div>
        <p id="pres-slide-desc" class="sr-only">${slide.desc || ""}</p>
        <div id="pres-slide-body" class="sr-only"></div>
      </article>
    `;
  }

  // Slide 11: Slide Phán quyết cuối cùng độc lập & Lời cảm ơn
  function buildVerdictSceneMarkup(slide, animClass) {
    return `
      <article class="slide-scene verdict-hero-scene is-current ${animClass}">
        <div class="intro-orbital-backdrop" aria-hidden="true">
          <svg viewBox="0 0 1000 1000" fill="none" preserveAspectRatio="xMidYMid slice">
            <defs>
              <radialGradient id="verdictAura" cx="50%" cy="46%" r="50%">
                <stop offset="0%" stop-color="#10b981" stop-opacity="0.34"/>
                <stop offset="52%" stop-color="#f59e0b" stop-opacity="0.22"/>
                <stop offset="100%" stop-color="#050811" stop-opacity="0"/>
              </radialGradient>
            </defs>
            <circle cx="500" cy="480" r="460" fill="url(#verdictAura)" class="svg-pulse-soft"/>

            <g class="svg-spin-slow">
              <circle cx="500" cy="490" r="405" stroke="rgba(251,191,36,0.28)" stroke-width="2" stroke-dasharray="14 12"/>
              <circle cx="500" cy="85" r="8" fill="#10b981"/>
              <circle cx="905" cy="490" r="8" fill="#fbbf24"/>
              <circle cx="95" cy="490" r="8" fill="#38bdf8"/>
            </g>
            <g class="svg-spin-reverse">
              <circle cx="500" cy="490" r="300" stroke="rgba(16,185,129,0.26)" stroke-width="1.8" stroke-dasharray="10 10"/>
            </g>

            <g opacity="0.25" class="svg-float">
              <line x1="500" y1="220" x2="500" y2="820" stroke="#fbbf24" stroke-width="4"/>
              <path d="M230 330 Q500 285 770 330" stroke="#34d399" stroke-width="4" fill="none"/>
              <circle cx="500" cy="306" r="14" fill="#fbbf24"/>
            </g>
          </svg>
        </div>

        <div class="verdict-center-content">
          <div class="intro-course-ribbon">
            <span class="ribbon-pulse-dot"></span>
            <span id="pres-slide-badge">${slide.badge || ""}</span>
          </div>

          <div class="verdict-cq-banner">
            <span id="pres-slide-subtitle" class="verdict-cq-label">Câu hỏi trọng tâm (CQ)</span>
            <p class="verdict-cq-text">
              “Kinh tế thị trường định hướng xã hội chủ nghĩa có giải quyết được những giới hạn lịch sử của chủ nghĩa tư bản không?”
            </p>
          </div>

          <h2 id="pres-slide-title" class="verdict-main-heading">
            Phán Quyết Cuối Cùng: <span class="hl-emerald">Khắc Phục Một Phần Căn Bản</span>, <span class="hl-amber">Chưa Giải Quyết Hoàn Toàn</span>
          </h2>

          <div class="verdict-pillars-grid">
            <div class="verdict-pillar-card is-emerald svg-float">
              <div class="verdict-pillar-head">
                <span class="verdict-pillar-badge">✓ Thành tựu đã đạt</span>
              </div>
              <h3 class="verdict-pillar-title">Hạn chế một phần căn bản</h3>
              <p class="verdict-pillar-desc">
                Đã xây dựng cơ chế đa dạng sở hữu, điều tiết vĩ mô của Nhà nước và gắn tăng trưởng với an sinh, giảm nghèo, bảo hiểm y tế toàn dân.
              </p>
            </div>

            <div class="verdict-pillar-card is-amber svg-float-alt">
              <div class="verdict-pillar-head">
                <span class="verdict-pillar-badge">⟳ Giới hạn thực tiễn</span>
              </div>
              <h3 class="verdict-pillar-title">Chưa giải quyết hoàn toàn</h3>
              <p class="verdict-pillar-desc">
                Vẫn còn khoảng cách giàu nghèo, bất bình đẳng tiếp cận nguồn lực, thể chế kinh tế số chưa đồng bộ và tham nhũng, lợi ích nhóm.
              </p>
            </div>

            <div class="verdict-pillar-card is-sky svg-float">
              <div class="verdict-pillar-head">
                <span class="verdict-pillar-badge">★ Kết luận khoa học</span>
              </div>
              <h3 class="verdict-pillar-title">Tiếp tục hoàn thiện và kiểm chứng</h3>
              <p class="verdict-pillar-desc">
                Tính ưu việt của mô hình không tự động có sẵn mà phải được tiếp tục hoàn thiện thể chế và kiểm chứng qua thực tiễn phát triển đất nước.
              </p>
            </div>
          </div>

          <div class="verdict-thanks-card">
            <div class="thanks-emblem" aria-hidden="true">
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                <circle cx="18" cy="18" r="16" fill="rgba(245,158,11,0.22)" stroke="#fbbf24" stroke-width="1.6"/>
                <polygon points="18,7 21.1,13.6 28.4,14.5 23,19.6 24.4,26.8 18,23.3 11.6,26.8 13,19.6 7.6,14.5 14.9,13.6" fill="#fbbf24"/>
              </svg>
            </div>
            <div class="thanks-copy">
              <div class="thanks-headline">Cảm ơn Thầy và các bạn đã chú ý lắng nghe!</div>
              <div class="thanks-subline">Nhóm 8 • Học phần Kinh tế chính trị Mác - Lênin (SS008.R12) • Trân trọng kính chào</div>
            </div>
          </div>
        </div>

        <div id="pres-key-points" class="sr-only"></div>
        <p id="pres-slide-desc" class="sr-only">${slide.desc || ""}</p>
        <div id="pres-slide-body" class="sr-only"></div>
      </article>
    `;
  }

  function buildSceneMarkup(slide, animClass) {
    if (slide.id === "intro-cq") {
      return buildIntroSceneMarkup(slide, animClass);
    }
    if (slide.id === "r3-verdict") {
      return buildVerdictSceneMarkup(slide, animClass);
    }

    const lines = Array.isArray(slide.lines) ? slide.lines : [];
    const keywordsHtml = lines
      .map((line, i) => {
        const clean = String(line).replace(/^[•\-\s]+/, "");
        return `
          <div class="kw-card">
            <span class="kw-index">${i + 1}</span>
            <p class="kw-label">${clean}</p>
          </div>
        `;
      })
      .join("");

    const shortDesc = SHORT_THESIS[slide.id] || slide.desc || "";
    const isMatrix = slide.id === "r3-table";
    const visual = SLIDE_VISUALS[slide.id];

    const metricsHtml = visual
      ? visual.metrics
          .map(
            (m) => `
            <div class="metric-chip" style="--chip-color:${m.color}">
              <div class="metric-chip-val">${m.val}</div>
              <div class="metric-chip-lbl">${m.lbl}</div>
            </div>
          `,
          )
          .join("")
      : "";

    let leftColumnHtml = `
      <div id="pres-key-points" class="keyword-list">${keywordsHtml}</div>
      <div class="thesis-strip">
        <span class="thesis-dot"></span>
        <p id="pres-slide-desc" class="thesis-line">${shortDesc}</p>
      </div>
    `;

    let rightColumnHtml = "";
    if (isMatrix) {
      // Slide 08: Bảng so sánh lớn trải dài toàn bộ chiều cao bên trái + minh họa động bên phải
      leftColumnHtml = `
        <div class="dark-matrix-wrap">
          ${(window.PresentationData && window.PresentationData.comparisonTableHtml) || ""}
        </div>
        <div id="pres-key-points" class="sr-only">${keywordsHtml}</div>
        <p id="pres-slide-desc" class="sr-only">${shortDesc}</p>
      `;
      rightColumnHtml = `
        <div class="art-stage-box">${visual.svg}</div>
        <div class="visual-metrics-row">${metricsHtml}</div>
      `;
    } else if (visual) {
      rightColumnHtml = `
        <div class="art-stage-box">${visual.svg}</div>
        <div class="visual-metrics-row">${metricsHtml}</div>
      `;
    } else {
      rightColumnHtml = slide.fullHtml || "";
    }

    return `
      <article class="slide-scene is-current ${animClass}">
        <div class="scene-header">
          <div class="scene-meta">
            <span id="pres-slide-badge" class="scene-badge">${slide.badge || ""}</span>
            <span id="pres-slide-subtitle" class="scene-subtitle">${slide.subtitle || ""}</span>
          </div>
          <h2 id="pres-slide-title" class="scene-title">${slide.title || ""}</h2>
        </div>

        <div id="slide-stage-grid" class="scene-grid ${isMatrix ? "is-matrix-split" : ""}">
          <div class="scene-keywords-col">
            ${leftColumnHtml}
          </div>

          <div class="scene-visual-col">
            <div id="pres-slide-body" class="visual-canvas">${rightColumnHtml}</div>
          </div>
        </div>
      </article>
    `;
  }

  function renderSlide(idx, animateDirection = 0) {
    const slides = getSlides();
    if (!slides.length) return;

    const clampedIdx = ((idx % slides.length) + slides.length) % slides.length;
    const prevIdx = currentSlideIndex;
    currentSlideIndex = clampedIdx;
    const slide = slides[clampedIdx];

    if (clampedIdx > 0 && !timerRunning && elapsedSeconds === 0) {
      startTimer();
    }

    const panel = document.getElementById("presentation-panel");
    const accent = slide.color || "#f59e0b";
    if (panel) {
      panel.classList.toggle("is-intro-active", slide.id === "intro-cq" || slide.id === "r3-verdict");
      panel.style.setProperty("--accent-main", accent);
      panel.style.setProperty("--accent-glow", `${accent}48`);
      panel.style.setProperty("--accent-soft", `${accent}24`);
    }

    const host = document.getElementById("pres-slides-host");
    if (host) {
      const oldScene = host.querySelector(".slide-scene.is-current");
      let enterClass = "";
      let exitClass = "";

      if (oldScene && prevIdx !== clampedIdx) {
        if ((prevIdx === 0 && clampedIdx > 0) || clampedIdx === slides.length - 1) {
          enterClass = "enter-zoom-portal";
          exitClass = "exit-zoom-portal";
        } else if (prevIdx > 0 && clampedIdx === 0) {
          enterClass = "enter-zoom-reverse";
          exitClass = "exit-zoom-reverse";
        } else if (animateDirection > 0 || (animateDirection === 0 && clampedIdx > prevIdx)) {
          enterClass = "enter-from-right";
          exitClass = "exit-to-left";
        } else {
          enterClass = "enter-from-left";
          exitClass = "exit-to-right";
        }
      }

      if (oldScene && exitClass) {
        oldScene.classList.remove(
          "is-current",
          "enter-from-right",
          "enter-from-left",
          "enter-zoom-portal",
          "enter-zoom-reverse",
        );
        oldScene.removeAttribute("id");
        oldScene.querySelectorAll("[id]").forEach((el) => el.removeAttribute("id"));
        oldScene.classList.add(exitClass);
        setTimeout(() => {
          if (oldScene.parentNode) oldScene.remove();
        }, 620);
      } else if (oldScene) {
        oldScene.remove();
      }

      host.insertAdjacentHTML("beforeend", buildSceneMarkup(slide, enterClass));
    }

    const drawerTitle = document.getElementById("drawer-title");
    const drawerBody = document.getElementById("drawer-body");
    if (drawerTitle) drawerTitle.textContent = slide.title || "Chi tiết luận điểm";
    if (drawerBody) {
      drawerBody.innerHTML = `
        <div class="drawer-full-desc"><strong>Tóm tắt lập luận:</strong> ${slide.desc || ""}</div>
        ${slide.fullHtml || ""}
      `;
    }

    const activeStage = getStageFromIndex(clampedIdx);
    requestAnimationFrame(() => updateStepperGlider(activeStage));

    const roomTagEl = document.getElementById("pres-room-tag");
    const counterEl = document.getElementById("slide-counter-badge");
    const selectEl = document.getElementById("slide-select-dropdown");
    const progressEl = document.getElementById("pres-progress-bar");
    const roomNames = getRoomNames();

    if (roomTagEl) roomTagEl.textContent = roomNames[slide.room] || "";
    if (counterEl) {
      const curStr = String(clampedIdx + 1).padStart(2, "0");
      const totStr = String(slides.length).padStart(2, "0");
      counterEl.textContent = `${curStr} / ${totStr}`;
    }
    if (selectEl) selectEl.value = String(clampedIdx);
    if (progressEl) {
      progressEl.style.width = `${((clampedIdx + 1) / slides.length) * 100}%`;
    }

    wakeHudBriefly();
  }

  function goToSlide(idx) {
    const dir = idx > currentSlideIndex ? 1 : idx < currentSlideIndex ? -1 : 0;
    renderSlide(idx, dir);
  }

  function nextSlide() {
    renderSlide(currentSlideIndex + 1, 1);
  }

  function prevSlide() {
    renderSlide(currentSlideIndex - 1, -1);
  }

  function wakeHudBriefly() {
    const hud = document.getElementById("pres-dock-shell");
    if (!hud) return;
    hud.classList.add("is-visible");
    clearTimeout(hudIdleTimer);
    hudIdleTimer = setTimeout(() => {
      if (!isHudHovered) {
        hud.classList.remove("is-visible");
      }
    }, 3500);
  }

  function formatTime(sec) {
    const m = String(Math.floor(sec / 60)).padStart(2, "0");
    const s = String(sec % 60).padStart(2, "0");
    return `${m}:${s}`;
  }

  function updateTimerUI() {
    const btn = document.getElementById("pres-timer-btn");
    const display = document.getElementById("pres-timer-display");
    if (!btn || !display) return;

    display.textContent = formatTime(elapsedSeconds);
    btn.classList.toggle("is-running", timerRunning);
    btn.classList.toggle("is-optimal", elapsedSeconds >= 720 && elapsedSeconds < 855);
    btn.classList.toggle("is-danger", elapsedSeconds >= 855);
  }

  function startTimer() {
    if (timerRunning) return;
    timerRunning = true;
    updateTimerUI();
    timerInterval = setInterval(() => {
      elapsedSeconds += 1;
      updateTimerUI();
    }, 1000);
  }

  function toggleTimer() {
    if (timerRunning) {
      timerRunning = false;
      clearInterval(timerInterval);
      updateTimerUI();
    } else {
      startTimer();
    }
  }

  function resetTimer() {
    timerRunning = false;
    clearInterval(timerInterval);
    elapsedSeconds = 0;
    updateTimerUI();
  }

  function toggleDrawer(forceState) {
    const drawer = document.getElementById("pres-detail-drawer");
    if (!drawer) return;
    const nextState =
      typeof forceState === "boolean"
        ? forceState
        : !drawer.classList.contains("is-open");
    drawer.classList.toggle("is-open", nextState);
    drawer.setAttribute("aria-hidden", nextState ? "false" : "true");
    wakeHudBriefly();
  }

  function getParentFullscreenFlag() {
    try {
      if (window.parent && window.parent !== window && window.parent.document) {
        return !!(
          window.parent.document.fullscreenElement ||
          window.parent.document.webkitFullscreenElement
        );
      }
    } catch (_) {}
    return false;
  }

  function isFullscreenActive() {
    return !!(
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      getParentFullscreenFlag()
    );
  }

  function syncFullscreenButtonState(explicitState) {
    const isFs =
      typeof explicitState === "boolean" ? explicitState : isFullscreenActive();
    const panel = document.getElementById("presentation-panel");
    const exitBtn = document.getElementById("btn-exit-pres-fullscreen");
    if (panel) panel.classList.toggle("pres-fullscreen-active", isFs);
    if (exitBtn) exitBtn.classList.toggle("hidden", !isFs);
    requestAnimationFrame(() => updateStepperGlider(getStageFromIndex(currentSlideIndex)));
  }

  function toggleFullscreen() {
    try {
      if (
        window.parent &&
        window.parent !== window &&
        typeof window.parent.toggleMuseumFullscreen === "function"
      ) {
        window.parent.toggleMuseumFullscreen();
        return;
      }
    } catch (_) {
      if (window.parent && window.parent !== window) {
        window.parent.postMessage({ type: "TOGGLE_FULLSCREEN" }, "*");
        return;
      }
    }

    const rootEl = document.documentElement;
    if (!document.fullscreenElement && !document.webkitFullscreenElement) {
      if (rootEl.requestFullscreen) rootEl.requestFullscreen().catch(() => {});
    } else if (document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
    }
  }

  function exitFullscreenMode() {
    try {
      if (
        window.parent &&
        window.parent !== window &&
        typeof window.parent.exitMuseumFullscreen === "function"
      ) {
        window.parent.exitMuseumFullscreen();
        return;
      }
    } catch (_) {
      if (window.parent && window.parent !== window) {
        window.parent.postMessage({ type: "EXIT_FULLSCREEN" }, "*");
        return;
      }
    }
    if (document.exitFullscreen) document.exitFullscreen().catch(() => {});
  }

  function populateSlideDropdown() {
    const selectEl = document.getElementById("slide-select-dropdown");
    if (!selectEl) return;
    const slides = getSlides();
    selectEl.innerHTML = slides
      .map((item, idx) => `<option value="${idx}">${idx + 1}. ${item.title}</option>`)
      .join("");
  }

  function handleKeyDown(e) {
    if (!isActiveState) return;
    const tag = (document.activeElement && document.activeElement.tagName) || "";
    if (["SELECT", "INPUT", "TEXTAREA"].includes(tag)) return;

    const k = (e.key || "").toLowerCase();
    if (k === "escape") {
      toggleDrawer(false);
      return;
    }
    if (k === "d" && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      toggleDrawer();
      return;
    }
    if (k === "t" && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      toggleTimer();
      return;
    }
    if (k === "f" && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      toggleFullscreen();
      return;
    }
    if (k === "arrowright" || k === "pagedown" || k === " ") {
      if (tag === "BUTTON" && k === " ") return;
      e.preventDefault();
      nextSlide();
      return;
    }
    if (k === "arrowleft" || k === "pageup") {
      e.preventDefault();
      prevSlide();
      return;
    }
    if (k === "home" || k === "0") {
      e.preventDefault();
      goToSlide(0);
      return;
    }
    if (k === "end") {
      e.preventDefault();
      goToSlide(getSlides().length - 1);
      return;
    }
    if (/^[1-9]$/.test(k) && !e.ctrlKey && !e.metaKey && !e.altKey) {
      const targetIdx = parseInt(k, 10);
      if (targetIdx < getSlides().length) {
        e.preventDefault();
        goToSlide(targetIdx);
      }
    }
  }

  function init() {
    if (isInitialized) return;
    isInitialized = true;

    populateSlideDropdown();

    document.querySelectorAll(".step-pill").forEach((pill) => {
      pill.addEventListener("click", () => {
        const target = parseInt(pill.getAttribute("data-target-slide"), 10);
        if (!isNaN(target)) goToSlide(target);
      });
    });

    const exitFsBtn = document.getElementById("btn-exit-pres-fullscreen");
    const closeDrawerBtn = document.getElementById("btn-close-drawer");
    const drawerBackdrop = document.getElementById("drawer-backdrop");
    const timerBtn = document.getElementById("pres-timer-btn");
    const prevBtn = document.getElementById("btn-hud-prev");
    const nextBtn = document.getElementById("btn-hud-next");
    const drawerHudBtn = document.getElementById("btn-hud-drawer");
    const dockShell = document.getElementById("pres-dock-shell");

    if (exitFsBtn) exitFsBtn.addEventListener("click", exitFullscreenMode);
    if (closeDrawerBtn) closeDrawerBtn.addEventListener("click", () => toggleDrawer(false));
    if (drawerBackdrop) drawerBackdrop.addEventListener("click", () => toggleDrawer(false));
    if (prevBtn) prevBtn.addEventListener("click", prevSlide);
    if (nextBtn) nextBtn.addEventListener("click", nextSlide);
    if (drawerHudBtn) drawerHudBtn.addEventListener("click", () => toggleDrawer());
    if (timerBtn) {
      timerBtn.addEventListener("click", toggleTimer);
      timerBtn.addEventListener("dblclick", resetTimer);
    }

    if (dockShell) {
      dockShell.addEventListener("mouseenter", () => {
        isHudHovered = true;
        dockShell.classList.add("is-visible");
        clearTimeout(hudIdleTimer);
      });
      dockShell.addEventListener("mouseleave", () => {
        isHudHovered = false;
        wakeHudBriefly();
      });
    }

    const panel = document.getElementById("presentation-panel");
    if (panel) {
      panel.addEventListener(
        "touchstart",
        (e) => {
          if (!e.changedTouches.length) return;
          touchStartX = e.changedTouches[0].clientX;
          touchStartY = e.changedTouches[0].clientY;
        },
        { passive: true },
      );
      panel.addEventListener(
        "touchend",
        (e) => {
          if (!isActiveState || !e.changedTouches.length) return;
          const dx = e.changedTouches[0].clientX - touchStartX;
          const dy = e.changedTouches[0].clientY - touchStartY;
          if (Math.abs(dx) >= 42 && Math.abs(dx) > Math.abs(dy)) {
            dx < 0 ? nextSlide() : prevSlide();
          }
        },
        { passive: true },
      );
    }

    window.addEventListener("resize", () => updateStepperGlider(getStageFromIndex(currentSlideIndex)));
    ["fullscreenchange", "webkitfullscreenchange"].forEach((evt) => {
      document.addEventListener(evt, () => syncFullscreenButtonState());
    });

    window.addEventListener("keydown", handleKeyDown, true);
    window.addEventListener("message", (e) => {
      if (!e || !e.data) return;
      if (e.data.type === "PRESENTATION_SET_ACTIVE") {
        isActiveState = Boolean(e.data.active);
        if (isActiveState) {
          requestAnimationFrame(() => updateStepperGlider(getStageFromIndex(currentSlideIndex)));
          wakeHudBriefly();
        }
      } else if (e.data.type === "FULLSCREEN_CHANGED") {
        syncFullscreenButtonState(Boolean(e.data.isFullscreen));
      } else if (e.data.type === "PARENT_KEY_EVENT" && isActiveState) {
        handleKeyDown({
          key: e.data.key,
          ctrlKey: Boolean(e.data.ctrlKey),
          metaKey: Boolean(e.data.metaKey),
          preventDefault() {},
        });
      }
    });

    renderSlide(0, 0);
    syncFullscreenButtonState();
  }

  return {
    init,
    goToSlide,
    nextSlide,
    prevSlide,
    toggleDrawer,
    setActive: (active) => { isActiveState = Boolean(active); },
    isActive: () => isActiveState,
    toggleFullscreen,
    exitFullscreen: exitFullscreenMode,
    setFullscreenState: syncFullscreenButtonState,
    getCurrentSlideIndex: () => currentSlideIndex,
    getTotalSlides: () => getSlides().length,
  };
})();

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => window.PresentationApp.init());
} else {
  window.PresentationApp.init();
}