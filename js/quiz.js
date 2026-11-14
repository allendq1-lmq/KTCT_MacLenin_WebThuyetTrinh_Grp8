/**
 * js/quiz.js - Engine Trắc nghiệm tương tác (5 câu mẫu, không bảng xếp hạng)
 * Dữ liệu câu hỏi lấy từ `window.QUIZ_QUESTIONS` trong `js/quiz-data.js`.
 */
window.InteractiveQuiz = (() => {
  const OPTION_LETTERS = ["A", "B", "C", "D"];

  // Nguồn âm thanh công cộng (Google Actions Sound Library - thân thiện CORS)
  // kèm cơ chế tự động fallback sang Web Audio API nếu trình duyệt chặn / ngoại tuyến
  const QUIZ_SOUND_URLS = {
    correct:
      "https://actions.google.com/sounds/v1/cartoon/cartoon_cowbell.ogg",
    wrong: "https://actions.google.com/sounds/v1/cartoon/cartoon_boing.ogg",
    complete:
      "https://actions.google.com/sounds/v1/crowds/battle_crowd_celebrate_stutter.ogg",
  };

  const SOUND_ON_SVG =
    '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5L6 9H2v6h4l5 4V5zM15.54 8.46a5 5 0 010 7.07M19.07 4.93a10 10 0 010 14.14"></path></svg>';
  const SOUND_OFF_SVG =
    '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5L6 9H2v6h4l5 4V5zM23 9l-6 6m0-6l6 6"></path></svg>';

  let soundEnabled = true;
  let audioContext = null;
  let activeAudios = {};
  let cardAnimTimer = null;
  let confettiAnimId = null;
  let confettiTimerId = null;
  let confettiParticles = [];
  let isInitialized = false;

  let currentIndex = 0;
  let score = 0;
  let answers = [];

  function getQuestions() {
    return Array.isArray(window.QUIZ_QUESTIONS) ? window.QUIZ_QUESTIONS : [];
  }

  function ensureAudioElements() {
    if (typeof Audio !== "function") return activeAudios;
    Object.keys(QUIZ_SOUND_URLS).forEach((key) => {
      if (!activeAudios[key]) {
        const aud = new Audio(QUIZ_SOUND_URLS[key]);
        aud.preload = "auto";
        aud.crossOrigin = "anonymous";
        activeAudios[key] = aud;
      }
    });
    return activeAudios;
  }

  function getAudioContext() {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return null;
    if (!audioContext) {
      audioContext = new AudioCtx();
    }
    if (
      audioContext &&
      audioContext.state === "suspended" &&
      typeof audioContext.resume === "function"
    ) {
      audioContext.resume().catch(() => {});
    }
    return audioContext;
  }

  // Fallback tổng hợp âm thanh vui nhộn bằng Web Audio API
  function synthesizeQuizTone(type) {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime || 0;
    const playStep = (freq, startOffset, duration, waveType, peakGain, slideToFreq) => {
      try {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = waveType || "sine";
        osc.frequency.setValueAtTime(freq, now + startOffset);
        if (slideToFreq) {
          osc.frequency.exponentialRampToValueAtTime(
            slideToFreq,
            now + startOffset + duration,
          );
        }
        gain.gain.setValueAtTime(0.001, now + startOffset);
        gain.gain.exponentialRampToValueAtTime(
          peakGain || 0.16,
          now + startOffset + 0.02,
        );
        gain.gain.exponentialRampToValueAtTime(
          0.001,
          now + startOffset + duration,
        );
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + startOffset);
        osc.stop(now + startOffset + duration + 0.02);
      } catch (_) {}
    };

    if (type === "correct") {
      // Tiếng chuông vui nhộn tăng dần (C5 - E5 - G5 - C6)
      playStep(523.25, 0, 0.11, "triangle", 0.16);
      playStep(659.25, 0.08, 0.12, "triangle", 0.17);
      playStep(783.99, 0.16, 0.13, "triangle", 0.18);
      playStep(1046.5, 0.24, 0.24, "sine", 0.2);
    } else if (type === "wrong") {
      // Tiếng "boing / kèn buồn hài hước" đi xuống
      playStep(311.13, 0, 0.16, "sawtooth", 0.11, 246.94);
      playStep(261.63, 0.17, 0.28, "sawtooth", 0.11, 164.81);
    } else if (type === "complete") {
      // Fanfare chúc mừng hoàn thành bài
      playStep(523.25, 0, 0.14, "triangle", 0.17);
      playStep(659.25, 0.12, 0.14, "triangle", 0.17);
      playStep(783.99, 0.24, 0.14, "triangle", 0.18);
      playStep(1046.5, 0.36, 0.35, "triangle", 0.22);
      playStep(1318.51, 0.52, 0.42, "sine", 0.18);
    }
  }

  function stopAllSounds() {
    Object.values(activeAudios).forEach((aud) => {
      try {
        aud.pause();
        aud.currentTime = 0;
      } catch (_) {}
    });
  }

  function playQuizSound(type) {
    if (!soundEnabled) return;
    stopAllSounds();

    const audios = ensureAudioElements();
    const aud = audios[type];
    if (!aud) {
      synthesizeQuizTone(type);
      return;
    }

    let fallbackFired = false;
    const triggerFallback = () => {
      if (fallbackFired) return;
      fallbackFired = true;
      synthesizeQuizTone(type);
    };

    try {
      aud.currentTime = 0;
      const playPromise = aud.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(triggerFallback);
      }
    } catch (_) {
      triggerFallback();
    }
  }

  function syncSoundButtonUI() {
    const btn = document.getElementById("btn-quiz-sound-toggle");
    const icon = document.getElementById("quiz-sound-icon");
    const label = document.getElementById("quiz-sound-label");
    if (btn) btn.setAttribute("aria-pressed", String(soundEnabled));
    if (icon) icon.innerHTML = soundEnabled ? SOUND_ON_SVG : SOUND_OFF_SVG;
    if (label) {
      label.textContent = soundEnabled ? "Âm thanh: BẬT" : "Âm thanh: TẮT";
    }
  }

  function toggleSound() {
    soundEnabled = !soundEnabled;
    if (!soundEnabled) {
      stopAllSounds();
    }
    syncSoundButtonUI();
    return soundEnabled;
  }

  function isSoundEnabled() {
    return soundEnabled;
  }

  // Hiệu ứng Pháo giấy (mini burst khi đúng từng câu, toàn màn hình khi 5/5)
  function stopConfetti() {
    if (confettiAnimId) {
      cancelAnimationFrame(confettiAnimId);
      confettiAnimId = null;
    }
    if (confettiTimerId) {
      clearTimeout(confettiTimerId);
      confettiTimerId = null;
    }
    confettiParticles = [];
    const canvas = document.getElementById("quiz-confetti-canvas");
    if (canvas) {
      const ctx = canvas.getContext ? canvas.getContext("2d") : null;
      if (ctx) ctx.clearRect(0, 0, canvas.width || 0, canvas.height || 0);
      canvas.classList.add("hidden");
    }
  }

  function runConfettiLoop(continuous) {
    const canvas = document.getElementById("quiz-confetti-canvas");
    if (!canvas) return;
    canvas.classList.remove("hidden");
    canvas.width = window.innerWidth || 1024;
    canvas.height = window.innerHeight || 768;
    const ctx = canvas.getContext ? canvas.getContext("2d") : null;
    if (!ctx) return;

    function frame() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let aliveCount = 0;

      confettiParticles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.angle += p.spin;

        if (continuous && p.y > canvas.height + 20) {
          p.y = -15;
          p.x = Math.random() * canvas.width;
          p.vy = 2.5 + Math.random() * 4.5;
        }

        if (continuous || p.y <= canvas.height + 30) {
          aliveCount++;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.angle);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
          ctx.restore();
        }
      });

      if (continuous || aliveCount > 0) {
        confettiAnimId = requestAnimationFrame(frame);
      } else {
        stopConfetti();
      }
    }

    frame();
  }

  function triggerMiniConfetti() {
    stopConfetti();
    const w = window.innerWidth || 1024;
    const h = window.innerHeight || 768;
    const colors = ["#10b981", "#f59e0b", "#3b82f6", "#ec4899", "#eab308"];
    const originX = w * 0.5;
    const originY = h * 0.42;

    confettiParticles = Array.from({ length: 48 }, () => {
      const angle = Math.random() * Math.PI * 2;
      const speed = 3 + Math.random() * 7;
      return {
        x: originX,
        y: originY,
        w: 7 + Math.random() * 6,
        h: 5 + Math.random() * 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 4,
        gravity: 0.24,
        angle: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.25,
      };
    });

    runConfettiLoop(false);
    confettiTimerId = setTimeout(stopConfetti, 1500);
  }

  function startFullConfetti() {
    stopConfetti();
    const w = window.innerWidth || 1024;
    const h = window.innerHeight || 768;
    const colors = [
      "#f59e0b",
      "#10b981",
      "#3b82f6",
      "#ec4899",
      "#8b5cf6",
      "#f43f5e",
      "#eab308",
    ];

    confettiParticles = Array.from({ length: 140 }, () => ({
      x: Math.random() * w,
      y: Math.random() * -h,
      w: 8 + Math.random() * 8,
      h: 6 + Math.random() * 6,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 4,
      vy: 2.5 + Math.random() * 4.5,
      gravity: 0,
      angle: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.2,
    }));

    runConfettiLoop(true);
  }

  // Nhận xét phân tầng theo điểm số (0/5 đến 5/5)
  function getFeedbackForScore(finalScore, totalQuestions) {
    const total = typeof totalQuestions === "number" && totalQuestions > 0 ? totalQuestions : 5;
    const numericScore = Math.max(0, Math.min(total, Number(finalScore) || 0));

    if (numericScore === 0) {
      return {
        tier: "0",
        badge: "Mốc 0/5 • Làm Nóng Động Cơ",
        title: "Chưa Trúng Câu Nào — Khởi Động Nhẹ Nhàng Thôi!",
        message:
          "Suýt chút nữa thì trúng hết rồi! Xem như bạn vừa 'khởi động nhẹ' làm quen mặt chữ. Hãy dạo lại một vòng Bảo Tàng 3D để nạp thêm lý luận rồi quay lại phục thù ngay nhé!",
        badgeTone: "bg-slate-100 text-slate-700 border-slate-300",
        scoreTone: "text-slate-700",
      };
    }

    if (numericScore <= 2) {
      return {
        tier: "1-2",
        badge: `Mốc ${numericScore}/${total} • Tân Binh KTCT`,
        title: "Có Khởi Đầu Rồi Đó — Cố Thêm Chút Nữa!",
        message:
          "Bạn đã nắm được những ý nền tảng ban đầu rồi! Chỉ cần ghé tham quan thêm vài gian trưng bày trong Bảo Tàng 3D là điểm số sẽ bật tăng vù vù ngay.",
        badgeTone: "bg-amber-100 text-amber-800 border-amber-300",
        scoreTone: "text-amber-600",
      };
    }

    if (numericScore <= 4) {
      return {
        tier: "3-4",
        badge: `Mốc ${numericScore}/${total} • Chuyên Gia Triển Vọng`,
        title: "Rất Tốt! Nắm Vững Kiến Thức Cốt Lõi!",
        message:
          "Phong độ rất ấn tượng — bạn đã hiểu chắc nội dung trọng tâm của bài thuyết trình, chỉ hơi sẩy chân nhẹ một chút xíu thôi. Thử lại lần nữa để chạm đỉnh tuyệt đối nhé!",
        badgeTone: "bg-sky-100 text-sky-800 border-sky-300",
        scoreTone: "text-sky-600",
      };
    }

    return {
      tier: "5",
      badge: `Danh Hiệu • Thủ khoa Kinh tế Chính trị Nhóm 8`,
      title: "Xuất Sắc Tuyệt Đối 5/5 — Thủ Khoa Kinh Tế Chính Trị Nhóm 8!",
      message:
        "Xin chúc mừng! Bạn đã chinh phục trọn vẹn cả 5/5 câu hỏi với kiến thức lý luận sắc bén không tì vết. Xứng đáng nhận tràng pháo tay và danh hiệu Thủ khoa Kinh tế Chính trị Nhóm 8!",
      badgeTone: "bg-emerald-100 text-emerald-800 border-emerald-300",
      scoreTone: "text-emerald-600",
    };
  }

  function clearCardAnimationClasses() {
    const card = document.getElementById("quiz-question-card");
    if (!card) return;
    if (cardAnimTimer) {
      clearTimeout(cardAnimTimer);
      cardAnimTimer = null;
    }
    card.classList.remove("quiz-card-correct-bounce", "quiz-card-wrong-shake");
  }

  function renderStepIndicators() {
    const container = document.getElementById("quiz-step-indicators");
    if (!container) return;
    const questions = getQuestions();
    container.innerHTML = "";

    questions.forEach((_q, idx) => {
      const dot = document.createElement("span");
      const ans = answers[idx];
      let cls =
        "inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold border transition-all ";

      if (ans) {
        cls += ans.isCorrect
          ? "bg-emerald-500 text-white border-emerald-600 shadow-sm"
          : "bg-rose-500 text-white border-rose-600 shadow-sm";
      } else if (idx === currentIndex) {
        cls += "bg-amber-500 text-slate-950 border-amber-600 ring-2 ring-amber-300";
      } else {
        cls += "bg-slate-100 text-slate-500 border-slate-300";
      }

      dot.className = cls;
      dot.textContent = String(idx + 1);
      container.appendChild(dot);
    });
  }

  function applyAnsweredVisuals(question, answer) {
    const optionsList = document.getElementById("quiz-options-list");
    const feedbackBanner = document.getElementById("quiz-feedback-banner");
    const explanationBox = document.getElementById("quiz-explanation-box");
    const explanationText = document.getElementById("quiz-explanation-text");
    const nextBtn = document.getElementById("btn-quiz-next");

    if (optionsList) {
      const buttons = optionsList.querySelectorAll(".quiz-option-btn");
      buttons.forEach((btn, idx) => {
        btn.disabled = true;
        btn.setAttribute("aria-disabled", "true");
        btn.classList.remove("hover:border-amber-400", "hover:bg-amber-50/70");

        if (idx === question.correctIndex) {
          btn.classList.add("quiz-option-correct");
        } else if (idx === answer.selectedIndex && !answer.isCorrect) {
          btn.classList.add("quiz-option-wrong");
        } else {
          btn.classList.add("opacity-65");
        }
      });
    }

    if (feedbackBanner) {
      feedbackBanner.classList.remove("hidden");
      if (answer.isCorrect) {
        feedbackBanner.className =
          "mb-4 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold border bg-emerald-50 text-emerald-800 border-emerald-300 flex items-center gap-2";
        feedbackBanner.textContent =
          "Chính xác! +1 điểm — Lý luận quá chuẩn xác!";
      } else {
        feedbackBanner.className =
          "mb-4 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold border bg-rose-50 text-rose-800 border-rose-300 flex items-center gap-2";
        feedbackBanner.textContent =
          "Úi chà, chưa chính xác rồi! Xem đáp án đúng và giải thích ngay bên dưới nhé.";
      }
    }

    if (explanationText) {
      explanationText.textContent = question.explanation || "";
    }
    if (explanationBox) {
      explanationBox.classList.remove("hidden");
    }

    if (nextBtn) {
      const questions = getQuestions();
      const isLast = currentIndex >= questions.length - 1;
      nextBtn.textContent = isLast
        ? "Xem kết quả tổng kết →"
        : "Câu tiếp theo →";
    }
  }

  function renderQuestion() {
    const questions = getQuestions();
    if (!questions.length) return;

    const question = questions[currentIndex];
    const total = questions.length;
    const existingAnswer = answers[currentIndex] || null;

    clearCardAnimationClasses();

    const summaryCard = document.getElementById("quiz-summary-card");
    const questionCard = document.getElementById("quiz-question-card");
    if (summaryCard) summaryCard.classList.add("hidden");
    if (questionCard) questionCard.classList.remove("hidden");

    const progressLabel = document.getElementById("quiz-progress-label");
    const scoreBadge = document.getElementById("quiz-score-badge");
    const progressBar = document.getElementById("quiz-progress-bar");
    const sectionBadge = document.getElementById("quiz-section-badge");
    const questionText = document.getElementById("quiz-question-text");
    const feedbackBanner = document.getElementById("quiz-feedback-banner");
    const explanationBox = document.getElementById("quiz-explanation-box");
    const optionsList = document.getElementById("quiz-options-list");

    if (progressLabel) {
      progressLabel.textContent = `Câu ${currentIndex + 1} / ${total}`;
    }
    if (scoreBadge) {
      scoreBadge.textContent = `Điểm: ${score} / ${total}`;
    }
    if (progressBar) {
      const pct = Math.round(((currentIndex + (existingAnswer ? 1 : 0)) / total) * 100);
      progressBar.style.width = `${Math.max(10, pct)}%`;
    }
    if (sectionBadge) {
      sectionBadge.textContent = question.sectionCode || `Câu ${currentIndex + 1}`;
    }
    if (questionText) {
      questionText.textContent = question.question || "";
    }
    if (feedbackBanner && !existingAnswer) {
      feedbackBanner.className = "hidden";
      feedbackBanner.textContent = "";
    }
    if (explanationBox && !existingAnswer) {
      explanationBox.classList.add("hidden");
    }

    if (optionsList) {
      optionsList.innerHTML = "";
      (question.options || []).forEach((optText, idx) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className =
          "quiz-option-btn w-full text-left p-3.5 sm:p-4 rounded-xl border-2 border-slate-200 bg-white hover:border-amber-400 hover:bg-amber-50/70 transition-all flex items-start gap-3 text-sm sm:text-base font-medium text-slate-800 cursor-pointer";
        btn.setAttribute("data-option-index", String(idx));

        const letterSpan = document.createElement("span");
        letterSpan.className =
          "quiz-option-letter w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-slate-100 border border-slate-300 text-slate-800 font-extrabold text-xs sm:text-sm flex items-center justify-center shrink-0 mt-0.5";
        letterSpan.textContent = OPTION_LETTERS[idx] || String(idx + 1);

        const textSpan = document.createElement("span");
        textSpan.className = "flex-1 leading-relaxed";
        textSpan.textContent = optText;

        btn.appendChild(letterSpan);
        btn.appendChild(textSpan);
        btn.addEventListener("click", () => selectOption(idx));
        optionsList.appendChild(btn);
      });
    }

    renderStepIndicators();

    if (existingAnswer) {
      applyAnsweredVisuals(question, existingAnswer);
    }
  }

  function selectOption(optionIndex) {
    const questions = getQuestions();
    const question = questions[currentIndex];
    if (!question) return false;

    // Khóa câu đã trả lời — không cho chọn lại sau khi chấm
    if (answers[currentIndex]) return false;

    const options = question.options || [];
    if (optionIndex < 0 || optionIndex >= options.length) return false;

    const isCorrect = optionIndex === question.correctIndex;
    const answerRecord = { selectedIndex: optionIndex, isCorrect };
    answers[currentIndex] = answerRecord;

    if (isCorrect) {
      score += 1;
    }

    const scoreBadge = document.getElementById("quiz-score-badge");
    if (scoreBadge) {
      scoreBadge.textContent = `Điểm: ${score} / ${questions.length}`;
    }

    const progressBar = document.getElementById("quiz-progress-bar");
    if (progressBar) {
      progressBar.style.width = `${Math.round(((currentIndex + 1) / questions.length) * 100)}%`;
    }

    applyAnsweredVisuals(question, answerRecord);
    renderStepIndicators();

    const card = document.getElementById("quiz-question-card");
    if (card) {
      clearCardAnimationClasses();
      void card.offsetWidth;
      if (isCorrect) {
        card.classList.add("quiz-card-correct-bounce");
      } else {
        card.classList.add("quiz-card-wrong-shake");
      }
      cardAnimTimer = setTimeout(() => {
        card.classList.remove("quiz-card-correct-bounce", "quiz-card-wrong-shake");
      }, 650);
    }

    if (isCorrect) {
      triggerMiniConfetti();
      playQuizSound("correct");
    } else {
      playQuizSound("wrong");
    }

    return true;
  }

  function showSummary() {
    const questions = getQuestions();
    const total = questions.length;
    const tier = getFeedbackForScore(score, total);

    clearCardAnimationClasses();

    const questionCard = document.getElementById("quiz-question-card");
    const summaryCard = document.getElementById("quiz-summary-card");
    if (questionCard) questionCard.classList.add("hidden");
    if (summaryCard) summaryCard.classList.remove("hidden");

    const badge = document.getElementById("quiz-summary-badge");
    const scoreEl = document.getElementById("quiz-summary-score");
    const titleEl = document.getElementById("quiz-summary-title");
    const msgEl = document.getElementById("quiz-summary-message");
    const breakdownEl = document.getElementById("quiz-summary-breakdown");

    if (badge) {
      badge.className = `inline-block text-xs sm:text-sm font-extrabold uppercase tracking-wider px-3.5 py-1 rounded-full border ${tier.badgeTone}`;
      badge.textContent = tier.badge;
    }
    if (scoreEl) {
      scoreEl.className = `text-4xl sm:text-5xl font-black tracking-tight my-2 ${tier.scoreTone}`;
      scoreEl.textContent = `${score} / ${total}`;
    }
    if (titleEl) {
      titleEl.textContent = tier.title;
    }
    if (msgEl) {
      msgEl.textContent = tier.message;
    }

    if (breakdownEl) {
      breakdownEl.innerHTML = "";
      questions.forEach((q, idx) => {
        const ans = answers[idx];
        const ok = ans && ans.isCorrect;
        const pill = document.createElement("div");
        pill.className = `px-3 py-2 rounded-xl border text-xs sm:text-sm font-bold flex items-center justify-between gap-2 ${
          ok
            ? "bg-emerald-50 border-emerald-200 text-emerald-800"
            : "bg-rose-50 border-rose-200 text-rose-800"
        }`;
        const label = document.createElement("span");
        label.textContent = `Câu ${idx + 1} (${q.sectionCode || ""})`;
        const status = document.createElement("span");
        status.textContent = ok ? "Đúng" : "Chưa đúng";
        pill.appendChild(label);
        pill.appendChild(status);
        breakdownEl.appendChild(pill);
      });
    }

    if (score === total) {
      startFullConfetti();
    }
    playQuizSound("complete");
  }

  function nextQuestion() {
    const questions = getQuestions();
    if (!questions.length) return;
    if (currentIndex < questions.length - 1) {
      currentIndex += 1;
      renderQuestion();
    } else {
      showSummary();
    }
  }

  function restartQuiz() {
    stopAllSounds();
    stopConfetti();
    currentIndex = 0;
    score = 0;
    answers = [];
    renderQuestion();
  }

  function init() {
    if (isInitialized) return;
    isInitialized = true;

    const soundBtn = document.getElementById("btn-quiz-sound-toggle");
    const nextBtn = document.getElementById("btn-quiz-next");
    const restartBtn = document.getElementById("btn-quiz-restart");
    const backMuseumBtn = document.getElementById("btn-quiz-back-museum");

    if (soundBtn) {
      soundBtn.addEventListener("click", toggleSound);
    }
    if (nextBtn) {
      nextBtn.addEventListener("click", nextQuestion);
    }
    if (restartBtn) {
      restartBtn.addEventListener("click", restartQuiz);
    }
    if (backMuseumBtn) {
      backMuseumBtn.addEventListener("click", () => {
        if (typeof window.switchAppTab === "function") {
          window.switchAppTab("idea2");
        }
      });
    }

    syncSoundButtonUI();
    renderQuestion();
  }

  return {
    init,
    selectOption,
    nextQuestion,
    restartQuiz,
    getFeedbackForScore,
    toggleSound,
    isSoundEnabled,
    playQuizSound,
    stopAllSounds,
    stopConfetti,
    getState: () => ({
      currentIndex,
      score,
      total: getQuestions().length,
      answers: answers.slice(),
    }),
  };
})();
