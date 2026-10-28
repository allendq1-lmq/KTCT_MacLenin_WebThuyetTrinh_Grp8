// js/game.js - Engine Game Thể Chế (Reigns)
window.ReignsGame = (() => {
  const reignsDeck = [
    {
      speakerTitle: "Tập Đoàn Bán Lẻ Độc Quyền",
      speakerName: "Trịnh Bá Khôi",
      dialogue:
        "Chúng tôi muốn mua lại toàn bộ chuỗi siêu thị và đầu mối nông sản để tối ưu hóa logistics, giảm 5% giá thành hàng hóa.",
      left: {
        label: "Cho Phép Sáp Nhập",
        effects: { growth: +15, equity: -20, environment: 0, stability: -10 },
      },
      right: {
        label: "Kích Hoạt Luật Chống Độc Quyền",
        effects: { growth: -10, equity: +15, environment: 0, stability: +10 },
      },
    },
    {
      speakerTitle: "Hiệp Hội Năng Lượng Than Đá",
      speakerName: "Lê Hoàng Quân",
      dialogue:
        "Chi phí xử lý xỉ than và khí thải đang làm giảm một nửa biên lợi nhuận. Đề xuất cho phép du di tiêu chuẩn xả thải để giữ giá điện thấp.",
      left: {
        label: "Du Di Xả Thải",
        effects: { growth: +15, equity: -10, environment: -25, stability: 0 },
      },
      right: {
        label: "Phạt Nặng Và Bắt Lắp Bộ Lọc",
        effects: { growth: -10, equity: +10, environment: +20, stability: +5 },
      },
    },
    {
      speakerTitle: "Hiệp Hội Thép & Vật Liệu",
      speakerName: "Đặng Quốc Cường",
      dialogue:
        "Khủng hoảng thừa toàn cầu! Hàng triệu tấn thép tồn kho ế ẩm, giá chạm đáy. Nếu ngài không cứu, 20.000 công nhân sẽ mất việc.",
      left: {
        label: "Mặc Thị Trường Tự Đào Thải",
        effects: { growth: -20, equity: -15, environment: +5, stability: -20 },
      },
      right: {
        label: "Kích Hoạt Đầu Tư Công Hạ Tầng",
        effects: { growth: +10, equity: +10, environment: -5, stability: +15 },
      },
    },
    {
      speakerTitle: "Quỹ Đầu Tư Y Tế Quốc Tế",
      speakerName: "Arthur Sterling",
      dialogue:
        "Chúng tôi muốn tư nhân hóa toàn bộ hệ thống bệnh viện công. Dịch vụ y tế sẽ cao cấp hơn và Nhà nước không tốn một đồng ngân sách.",
      left: {
        label: "Cổ Phần Hóa Toàn Diện",
        effects: { growth: +15, equity: -25, environment: 0, stability: -15 },
      },
      right: {
        label: "Bảo Vệ Y Tế Công Lập Toàn Dân",
        effects: { growth: -5, equity: +25, environment: 0, stability: +10 },
      },
    },
    {
      speakerTitle: "Công Ty Khai Thác Bauxite",
      speakerName: "Vũ Đình Toàn",
      dialogue:
        "Phát hiện trữ lượng quặng khổng lồ dưới cánh rừng đầu nguồn. Cho phép đào mỏ sẽ mang về hàng tỷ USD tiền thuế mỗi năm.",
      left: {
        label: "Cấp Phép Khai Thác",
        effects: { growth: +25, equity: 0, environment: -30, stability: -5 },
      },
      right: {
        label: "Bảo Tồn Rừng Đầu Nguồn",
        effects: { growth: -10, equity: +5, environment: +25, stability: +5 },
      },
    },
    {
      speakerTitle: "Tập Đoàn Đầu Cơ Bất Động Sản",
      speakerName: "Phạm Tấn Đạt",
      dialogue:
        "Giá đất đang tăng phi mã gấp 4 lần. Hãy thả nổi tín dụng để thổi bùng cơn sốt địa ốc, GDP đô thị sẽ tăng kỷ lục!",
      left: {
        label: "Nới Lỏng Tín Dụng Đầu Cơ",
        effects: { growth: +20, equity: -25, environment: -10, stability: -25 },
      },
      right: {
        label: "Đánh Thuế Nhà Thứ Hai & Xây Nhà Xã Hội",
        effects: { growth: -10, equity: +20, environment: 0, stability: +15 },
      },
    },
    {
      speakerTitle: "Tổng Liên Đoàn Lao Động",
      speakerName: "Nguyễn Thị Mai",
      dialogue:
        "Công nhân kiệt sức vì làm thêm 60 giờ một tuần. Chúng tôi yêu cầu giảm giờ làm tiêu chuẩn xuống 40 giờ và tăng 12% lương tối thiểu.",
      left: {
        label: "Bác Bỏ Để Giữ Chân Vốn FDI",
        effects: { growth: +15, equity: -20, environment: 0, stability: -10 },
      },
      right: {
        label: "Phê Chuẩn Chuẩn Mực Phúc Lợi",
        effects: { growth: -10, equity: +20, environment: 0, stability: +10 },
      },
    },
    {
      speakerTitle: "Tập Đoàn Công Nghệ Tự Động Hóa",
      speakerName: "Lý Kiến Quốc",
      dialogue:
        "Chúng tôi đã hoàn thiện AI thay thế 40% nhân viên văn phòng. Các doanh nghiệp yêu cầu được quyền sa thải tự do ngay trong quý này.",
      left: {
        label: "Tự Do Sa Thải Theo Thị Trường",
        effects: { growth: +20, equity: -25, environment: 0, stability: -15 },
      },
      right: {
        label: "Thuế Tự Động Hóa & Quỹ Đào Tạo Nghề",
        effects: { growth: -5, equity: +15, environment: 0, stability: +10 },
      },
    },
    {
      speakerTitle: "Khối Ngân Hàng Thương Mại Cổ Phần",
      speakerName: "Hoàng Minh Trí",
      dialogue:
        "Ba ngân hàng đầu tư mạo hiểm vỡ nợ, người gửi tiền hoảng loạn xếp hàng rút sạch tiền mặt. Khủng hoảng tài chính đang lan rộng!",
      left: {
        label: "Để Tự Phá Sản Theo Luật Thị Trường",
        effects: { growth: -25, equity: -10, environment: 0, stability: -35 },
      },
      right: {
        label: "Ngân Hàng Nhà Nước Mua Lại Bắt Buộc",
        effects: { growth: -5, equity: +10, environment: 0, stability: +25 },
      },
    },
    {
      speakerTitle: "Bộ Nông Nghiệp Và Phát Triển Nông Thôn",
      speakerName: "Đỗ Doãn Hoàng",
      dialogue:
        "Mất mùa do hạn mặn lịch sử. Các thương lái tư nhân đang găm giữ gạo, đẩy giá tăng gấp 3 lần bình thường.",
      left: {
        label: "Để Giá Vận Hành Theo Cung Cầu Tự Do",
        effects: { growth: +5, equity: -30, environment: -10, stability: -25 },
      },
      right: {
        label: "Mở Kho Dự Trữ Quốc Gia & Bình Ổn Giá",
        effects: { growth: -5, equity: +30, environment: 0, stability: +20 },
      },
    },
    {
      speakerTitle: "Khu Chế Xuất Công Nghiệp Nặng",
      speakerName: "Vương Khắc Định",
      dialogue:
        "Mực nước ngầm sụt lún nghiêm trọng vì các nhà máy khoan hút vô tội vạ. Đề nghị đánh thuế tài nguyên nước thật cao.",
      left: {
        label: "Ưu Tiên Sản Xuất, Không Đánh Thuế",
        effects: { growth: +15, equity: -5, environment: -30, stability: -10 },
      },
      right: {
        label: "Thuế Tài Nguyên & Lắp Đo Lưu Lượng",
        effects: { growth: -10, equity: +5, environment: +25, stability: +5 },
      },
    },
    {
      speakerTitle: "Thanh Tra An Toàn Thực Phẩm",
      speakerName: "Trương Mỹ Linh",
      dialogue:
        "Phát hiện hàng loạt doanh nghiệp chế biến dùng hóa chất công nghiệp độc hại kéo dài hạn sử dụng thịt cá giá rẻ bán cho công nhân.",
      left: {
        label: "Phạt Hành Chính Nhẹ Tránh Ảnh Hưởng Cung Ứng",
        effects: { growth: +10, equity: -20, environment: -15, stability: -10 },
      },
      right: {
        label: "Đình Chỉ & Truy Tố Hình Sự Nghiêm Minh",
        effects: { growth: -5, equity: +20, environment: +10, stability: +10 },
      },
    },
  ];

  let currentYear = 1;
  const maxYears = 10;
  let reignsStats = { growth: 50, equity: 50, environment: 50, stability: 50 };
  let currentCardIndex = 0;
  let isGameOver = false;
  let deck = [];

  function shuffleDeck() {
    const copy = [...reignsDeck];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    deck = copy.slice(0, maxYears);
  }

  function updateHUDStats() {
    ["growth", "equity", "environment", "stability"].forEach((k) => {
      const val = reignsStats[k];
      const bar = document.getElementById(`stat-bar-${k}`);
      const text = document.getElementById(`stat-val-${k}`);
      const clamped = Math.max(0, Math.min(100, val));
      if (bar) bar.style.width = `${clamped}%`;
      if (text) text.textContent = clamped;
    });
  }

  function renderCard() {
    if (isGameOver) return;
    const cardData = deck[currentCardIndex];
    document.getElementById("card-speaker-title").textContent =
      cardData.speakerTitle;
    document.getElementById("card-speaker-name").textContent =
      cardData.speakerName;
    document.getElementById("card-dialogue").textContent = cardData.dialogue;
    document.getElementById("btn-label-left").textContent = cardData.left.label;
    document.getElementById("btn-label-right").textContent =
      cardData.right.label;
    document.getElementById("choice-pill-left").textContent =
      cardData.left.label;
    document.getElementById("choice-pill-right").textContent =
      cardData.right.label;
    document.getElementById("game-year-display").textContent =
      `Năm thứ ${currentYear} / ${maxYears}`;

    const card = document.getElementById("reigns-card");
    card.style.transform = "translate(0px, 0px) rotate(0deg)";
    document.getElementById("choice-pill-left").style.opacity = "0";
    document.getElementById("choice-pill-right").style.opacity = "0";
    clearStatDots();
  }

  function showStatDots(effects) {
    clearStatDots();
    ["growth", "equity", "environment", "stability"].forEach((k) => {
      if (effects[k] && effects[k] !== 0) {
        const hud = document.querySelector(
          `.stat-hud[data-stat="${k}"] .stat-dot`,
        );
        if (hud) hud.classList.add("active");
      }
    });
  }

  function clearStatDots() {
    document
      .querySelectorAll(".stat-dot")
      .forEach((d) => d.classList.remove("active"));
  }

  function checkGameOver() {
    const reasons = {
      growth_low:
        "Chỉ số Tăng Trưởng rơi về mức 0: Nền kinh tế đình trệ hoàn toàn, doanh nghiệp giải thể hàng loạt, thất nghiệp tràn lan khiến thể chế mất hoàn toàn nguồn thu ngân sách.",
      growth_high:
        "Chỉ số Tăng Trưởng vượt quá 100: Nền kinh tế phát triển quá nóng sinh ra siêu bong bóng đầu cơ tài chính. Lạm phát phi mã làm đồng tiền mất giá hoàn toàn, gây khủng hoảng tiền tệ nghiêm trọng.",
      equity_low:
        "Chỉ số Công Bằng rơi về mức 0: Bất bình đẳng thu nhập và phân hóa giàu nghèo tột độ. Người lao động cùng quẫn bùng nổ làn sóng tổng bãi công làm tê liệt bộ máy quản lý.",
      equity_high:
        "Chỉ số Công Bằng chạm mức 100: Chủ nghĩa cào bằng bình quân tuyệt đối triệt tiêu hoàn toàn động lực lao động và sáng tạo. Xã hội rơi vào trì trệ bao cấp xơ cứng.",
      environment_low:
        "Chỉ số Môi Trường rơi về mức 0: Ô nhiễm không khí, cạn kiệt tài nguyên và nguồn nước nhiễm độc làm bùng phát thảm họa y tế công cộng diện rộng, đời sống xã hội bị hủy hoại.",
      environment_high:
        "Chỉ số Môi Trường chạm mức 100: Đình chỉ cực đoan mọi hoạt động sản xuất công nghiệp và khai thác, khiến xã hội thiếu thốn nhu yếu phẩm trầm trọng, kinh tế suy sụp.",
      stability_low:
        "Chỉ số Ổn Định rơi về mức 0: Khủng hoảng chu kỳ tài chính bùng nổ dây chuyền, hệ thống ngân hàng phá sản, thị trường mất kiểm soát dẫn đến sụp đổ thể chế.",
      stability_high:
        "Chỉ số Ổn Định chạm mức 100: Can thiệp mệnh lệnh hành chính quá mức làm thị trường đông cứng tuyệt đối, nền kinh tế tê liệt khả năng ứng phó với các biến động thế giới.",
    };

    let failureKey = null;
    if (reignsStats.growth <= 0) failureKey = "growth_low";
    else if (reignsStats.growth >= 100) failureKey = "growth_high";
    else if (reignsStats.equity <= 0) failureKey = "equity_low";
    else if (reignsStats.equity >= 100) failureKey = "equity_high";
    else if (reignsStats.environment <= 0) failureKey = "environment_low";
    else if (reignsStats.environment >= 100) failureKey = "environment_high";
    else if (reignsStats.stability <= 0) failureKey = "stability_low";
    else if (reignsStats.stability >= 100) failureKey = "stability_high";

    if (failureKey) {
      isGameOver = true;
      document.getElementById("game-play-area").classList.add("hidden");
      document.getElementById("gameover-cause").textContent =
        reasons[failureKey];
      document.getElementById("gameover-years").textContent =
        `${currentYear} năm`;
      document
        .getElementById("reigns-gameover-modal")
        .classList.remove("hidden");
      return true;
    }

    if (currentYear >= maxYears) {
      isGameOver = true;
      document.getElementById("game-play-area").classList.add("hidden");
      document
        .getElementById("reigns-victory-modal")
        .classList.remove("hidden");
      return true;
    }

    return false;
  }

  function applyChoice(side) {
    if (isGameOver) return;
    const cardData = deck[currentCardIndex];
    const decision = side === "left" ? cardData.left : cardData.right;

    ["growth", "equity", "environment", "stability"].forEach((k) => {
      reignsStats[k] += decision.effects[k] || 0;
    });

    updateHUDStats();

    if (!checkGameOver()) {
      currentYear++;
      currentCardIndex++;
      renderCard();
    }
  }

  function resetGame() {
    currentYear = 1;
    currentCardIndex = 0;
    reignsStats = { growth: 50, equity: 50, environment: 50, stability: 50 };
    isGameOver = false;
    document.getElementById("reigns-gameover-modal").classList.add("hidden");
    document.getElementById("reigns-victory-modal").classList.add("hidden");
    document.getElementById("game-play-area").classList.remove("hidden");
    shuffleDeck();
    updateHUDStats();
    renderCard();
  }

  function init() {
    const card = document.getElementById("reigns-card");
    const btnLeft = document.getElementById("btn-reigns-left");
    const btnRight = document.getElementById("btn-reigns-right");
    const pillLeft = document.getElementById("choice-pill-left");
    const pillRight = document.getElementById("choice-pill-right");

    btnLeft.addEventListener("click", () => applyChoice("left"));
    btnRight.addEventListener("click", () => applyChoice("right"));

    btnLeft.addEventListener("mouseenter", () => {
      if (!isGameOver) showStatDots(deck[currentCardIndex].left.effects);
    });
    btnLeft.addEventListener("mouseleave", clearStatDots);

    btnRight.addEventListener("mouseenter", () => {
      if (!isGameOver) showStatDots(deck[currentCardIndex].right.effects);
    });
    btnRight.addEventListener("mouseleave", clearStatDots);

    let isDragging = false;
    let startX = 0;
    let currentX = 0;

    function onDragStart(e) {
      if (isGameOver) return;
      isDragging = true;
      currentX = 0;
      startX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      card.classList.add("swiping");
      card.classList.remove("reset-anim");
    }

    function onDragMove(e) {
      if (!isDragging) return;
      currentX =
        (e.clientX || (e.touches && e.touches[0].clientX) || 0) - startX;
      const rot = currentX * 0.08;
      card.style.transform = `translate(${currentX}px, ${Math.abs(currentX) * 0.1}px) rotate(${rot}deg)`;

      const cardData = deck[currentCardIndex];
      if (currentX < -30) {
        pillLeft.style.opacity = Math.min(
          1,
          Math.abs(currentX) / 100,
        ).toString();
        pillRight.style.opacity = "0";
        showStatDots(cardData.left.effects);
      } else if (currentX > 30) {
        pillRight.style.opacity = Math.min(
          1,
          Math.abs(currentX) / 100,
        ).toString();
        pillLeft.style.opacity = "0";
        showStatDots(cardData.right.effects);
      } else {
        pillLeft.style.opacity = "0";
        pillRight.style.opacity = "0";
        clearStatDots();
      }
    }

    function onDragEnd() {
      if (!isDragging) return;
      isDragging = false;
      card.classList.remove("swiping");

      if (currentX < -110) {
        applyChoice("left");
      } else if (currentX > 110) {
        applyChoice("right");
      } else {
        card.classList.add("reset-anim");
        card.style.transform = "translate(0px, 0px) rotate(0deg)";
        pillLeft.style.opacity = "0";
        pillRight.style.opacity = "0";
        clearStatDots();
      }
    }

    card.addEventListener("mousedown", onDragStart);
    window.addEventListener("mousemove", onDragMove);
    window.addEventListener("mouseup", onDragEnd);

    card.addEventListener("touchstart", onDragStart, { passive: true });
    window.addEventListener("touchmove", onDragMove, { passive: true });
    window.addEventListener("touchend", onDragEnd);

    window.addEventListener("keydown", (e) => {
      const gameSection = document.getElementById("section-game");
      if (
        gameSection &&
        !gameSection.classList.contains("hidden") &&
        !isGameOver
      ) {
        if (e.key === "ArrowLeft") applyChoice("left");
        else if (e.key === "ArrowRight") applyChoice("right");
      }
    });

    document
      .getElementById("btn-reigns-retry")
      .addEventListener("click", resetGame);
    document
      .getElementById("btn-reigns-win-restart")
      .addEventListener("click", resetGame);

    shuffleDeck();
    updateHUDStats();
    renderCard();
  }

  return { init, resetGame };
})();
