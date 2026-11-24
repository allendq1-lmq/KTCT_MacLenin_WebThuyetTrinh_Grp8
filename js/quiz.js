/**
 * js/quiz.js - Engine Trắc nghiệm tương tác (bốc ngẫu nhiên 5 câu từ ngân hàng 30 câu, hỗ trợ 2 & 4 đáp án)
 * Dữ liệu câu hỏi lấy từ `window.QUIZ_QUESTIONS` trong `js/quiz-data.js`.
 */
window.InteractiveQuiz = (() => {
  const OPTION_LETTERS = ["A", "B", "C", "D"];
  const QUIZ_ROUND_SIZE = 5;

  let cardAnimTimer = null;
  let confettiAnimId = null;
  let confettiTimerId = null;
  let confettiParticles = [];
  let isInitialized = false;

  let currentIndex = 0;
  let score = 0;
  let answers = [];
  let activeQuestions = [];

  function getQuestionBank() {
    return Array.isArray(window.QUIZ_QUESTIONS) ? window.QUIZ_QUESTIONS : [];
  }

  function shuffleQuestions(arr) {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function buildQuizRound() {
    const bank = getQuestionBank();
    activeQuestions = shuffleQuestions(bank).slice(0, QUIZ_ROUND_SIZE);
    return activeQuestions;
  }

  function getQuestions() {
    if (!activeQuestions.length) {
      buildQuizRound();
    }
    return activeQuestions;
  }

  // Hiệu ứng Pháo giấy (mini burst khi đúng từng câu, toàn màn hình khi đạt từ 90% trở lên)
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

  function isReducedMotionPreferred() {
    return (
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
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
      const targetW = window.innerWidth || 1024;
      const targetH = window.innerHeight || 768;
      if (canvas.width !== targetW || canvas.height !== targetH) {
        canvas.width = targetW;
        canvas.height = targetH;
      }
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
    if (isReducedMotionPreferred()) return;
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
    if (isReducedMotionPreferred()) return;
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
    confettiTimerId = setTimeout(stopConfetti, 6000);
  }

  // Nhận xét phân tầng theo tỷ lệ % điểm số
  function getFeedbackForScore(finalScore, totalQuestions) {
    const total =
      typeof totalQuestions === "number" && totalQuestions > 0
        ? totalQuestions
        : getQuestions().length || QUIZ_ROUND_SIZE;
    const numericScore = Math.max(0, Math.min(total, Number(finalScore) || 0));
    const pct = total > 0 ? numericScore / total : 0;

    if (numericScore === 0) {
      return {
        tier: "0",
        badge: `Mốc 0/${total} • Cần ôn tập lại từ đầu`,
        title: "Chưa Trúng Câu Nào — Hãy Khởi Động Lại Nhé!",
        message:
          "Bạn chưa trả lời đúng câu hỏi nào. Hãy xem lại các phòng trưng bày trong Bảo Tàng 3D và hệ thống slide thuyết trình để nắm vững kiến thức cốt lõi rồi thử lại nhé!",
        badgeTone: "bg-rose-50 text-rose-700 border-rose-200",
        scoreTone: "text-rose-700",
      };
    }

    if (pct < 0.5) {
      return {
        tier: "low",
        badge: `Mốc ${numericScore}/${total} • Cần cố gắng thêm`,
        title: "Bước Đầu Làm Quen — Ôn Tập Thêm Chút Nữa!",
        message:
          "Bạn đã nắm được một phần kiến thức nền tảng nhưng vẫn còn nhầm lẫn ở một số khái niệm trọng tâm. Hãy đọc kỹ phần giải thích chi tiết và xem lại nội dung thuyết trình để cải thiện điểm số!",
        badgeTone: "bg-amber-100 text-amber-800 border-amber-300",
        scoreTone: "text-amber-600",
      };
    }

    if (pct < 0.9) {
      return {
        tier: "mid",
        badge: `Mốc ${numericScore}/${total} • Nắm vững kiến thức`,
        title: "Rất Tốt! Nắm Chắc Kiến Thức Trọng Tâm!",
        message:
          "Kết quả rất ấn tượng — bạn đã nắm khá vững bản chất Kinh tế thị trường định hướng xã hội chủ nghĩa và giới hạn lịch sử của chủ nghĩa tư bản. Chỉ còn vài chi tiết nhỏ cần lưu ý thêm!",
        badgeTone: "bg-emerald-100 text-emerald-800 border-emerald-300",
        scoreTone: "text-emerald-600",
      };
    }

    return {
      tier: "high",
      badge: `Mốc ${numericScore}/${total} • Thủ khoa Kinh tế Chính trị Nhóm 8`,
      title: `Xuất Sắc Toàn Diện (${numericScore}/${total})!`,
      message:
        "Xin chúc mừng! Bạn đã làm chủ xuất sắc hệ thống lý luận và thực tiễn của đề tài Kinh tế chính trị Mác - Lênin Nhóm 8!",
      badgeTone: "bg-amber-100 text-amber-900 border-amber-400",
      scoreTone: "text-amber-600",
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
        "inline-flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-full text-[10px] sm:text-[11px] font-bold border transition-all shrink-0 ";

      if (ans) {
        cls += ans.isCorrect
          ? "bg-emerald-500 text-white border-emerald-600 shadow-sm"
          : "bg-rose-500 text-white border-rose-600 shadow-sm";
      } else if (idx === currentIndex) {
        cls += "bg-[#df7a28] text-white border-[#c4661b]";
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
    const feedbackDock = document.getElementById("quiz-feedback-dock");
    const feedbackBanner = document.getElementById("quiz-feedback-banner");
    const explanationPlaceholder = document.getElementById(
      "quiz-explanation-placeholder",
    );
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
          "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-[11px] sm:text-xs font-extrabold border bg-emerald-100/90 text-emerald-900 border-emerald-300";
        feedbackBanner.textContent = "Chính xác! +1 điểm";
      } else {
        feedbackBanner.className =
          "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-[11px] sm:text-xs font-extrabold border bg-rose-100/90 text-rose-900 border-rose-300";
        feedbackBanner.textContent = "Chưa chính xác!";
      }
    }

    if (explanationText) {
      const expStr = question.explanation || "";
      if (
        window.ContentShield &&
        typeof window.ContentShield.renderProtectedText === "function"
      ) {
        window.ContentShield.renderProtectedText(explanationText, expStr);
      } else {
        explanationText.textContent = expStr;
      }
    }
    if (explanationPlaceholder) {
      explanationPlaceholder.classList.add("hidden");
    }
    if (feedbackDock) {
      feedbackDock.classList.remove("hidden");
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
    if (!questions.length) {
      const questionText = document.getElementById("quiz-question-text");
      const optionsList = document.getElementById("quiz-options-list");
      if (questionText) {
        questionText.textContent =
          "Không thể tải dữ liệu câu hỏi trắc nghiệm do kết nối mạng gián đoạn.";
      }
      if (optionsList) {
        optionsList.className = "w-full flex justify-start";
        optionsList.innerHTML = "";
        const reloadBtn = document.createElement("button");
        reloadBtn.type = "button";
        reloadBtn.className =
          "min-h-[44px] px-4 py-2 rounded-xl bg-[#df7a28] hover:bg-[#c4661b] text-white text-sm font-bold cursor-pointer";
        reloadBtn.textContent = "Tải lại trang";
        reloadBtn.addEventListener("click", () => window.location.reload());
        optionsList.appendChild(reloadBtn);
      }
      return;
    }

    const question = questions[currentIndex];
    const total = questions.length;
    const existingAnswer = answers[currentIndex] || null;
    const optionCount = Array.isArray(question.options) ? question.options.length : 4;

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
    const feedbackDock = document.getElementById("quiz-feedback-dock");
    const feedbackBanner = document.getElementById("quiz-feedback-banner");
    const explanationPlaceholder = document.getElementById(
      "quiz-explanation-placeholder",
    );
    const explanationBox = document.getElementById("quiz-explanation-box");
    const optionsList = document.getElementById("quiz-options-list");

    if (progressLabel) {
      progressLabel.textContent = `Câu ${currentIndex + 1} / ${total}`;
    }
    if (scoreBadge) {
      scoreBadge.textContent = `${score} / ${total} đúng`;
    }
    if (progressBar) {
      const pct = Math.round(((currentIndex + (existingAnswer ? 1 : 0)) / total) * 100);
      progressBar.style.width = `${Math.max(3, pct)}%`;
    }
    if (sectionBadge) {
      sectionBadge.textContent = question.sectionCode || `Câu ${currentIndex + 1}`;
    }
    if (questionText) {
      const qStr = question.question || "";
      if (
        window.ContentShield &&
        typeof window.ContentShield.renderProtectedText === "function"
      ) {
        window.ContentShield.renderProtectedText(questionText, qStr);
      } else {
        questionText.textContent = qStr;
      }
    }
    if (feedbackDock && !existingAnswer) {
      feedbackDock.classList.add("hidden");
    }
    if (feedbackBanner && !existingAnswer) {
      feedbackBanner.className = "hidden";
      feedbackBanner.textContent = "";
    }
    if (explanationPlaceholder) {
      explanationPlaceholder.classList.add("hidden");
    }
    if (explanationBox && !existingAnswer) {
      explanationBox.classList.add("hidden");
    }

    if (optionsList) {
      optionsList.className =
        optionCount === 2
          ? "w-full grid grid-cols-1 sm:grid-cols-2 gap-3"
          : "w-full grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-2.5 md:gap-3";
      optionsList.innerHTML = "";
      (question.options || []).forEach((optText, idx) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className =
          "quiz-option-btn w-full h-auto text-left rounded-xl border-2 border-slate-200 bg-white hover:border-amber-400 hover:bg-amber-50/70 transition-all flex items-start gap-2 sm:gap-2.5 font-medium text-slate-800 cursor-pointer";
        btn.setAttribute("data-option-index", String(idx));

        const letterSpan = document.createElement("span");
        letterSpan.className =
          "quiz-option-letter w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-slate-100 border border-slate-300 text-slate-800 font-extrabold text-[11px] sm:text-xs flex items-center justify-center shrink-0 mt-0.5";
        letterSpan.textContent = OPTION_LETTERS[idx] || String(idx + 1);

        const textSpan = document.createElement("span");
        textSpan.className = "quiz-option-text flex-1";
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
      scoreBadge.textContent = `${score} / ${questions.length} đúng`;
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
        pill.className = `px-2.5 py-1.5 rounded-lg border text-xs font-bold flex items-center justify-between gap-1.5 ${
          ok
            ? "bg-emerald-50 border-emerald-200 text-emerald-800"
            : "bg-rose-50 border-rose-200 text-rose-800"
        }`;
        const label = document.createElement("span");
        label.className = "truncate";
        label.textContent = `Câu ${idx + 1} • ${q.sectionCode || ""}`;
        const status = document.createElement("span");
        status.className = "shrink-0";
        status.textContent = ok ? "Đúng" : "Sai";
        pill.appendChild(label);
        pill.appendChild(status);
        breakdownEl.appendChild(pill);
      });
    }

    if (total > 0 && score / total >= 0.9) {
      startFullConfetti();
    }
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
    stopConfetti();
    currentIndex = 0;
    score = 0;
    answers = [];
    buildQuizRound();
    renderQuestion();
  }

  function init() {
    if (isInitialized) return;
    isInitialized = true;

    const nextBtn = document.getElementById("btn-quiz-next");
    const restartBtn = document.getElementById("btn-quiz-restart");
    const backMuseumBtn = document.getElementById("btn-quiz-back-museum");

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

    buildQuizRound();
    renderQuestion();
  }

  return {
    init,
    selectOption,
    nextQuestion,
    restartQuiz,
    getFeedbackForScore,
    stopConfetti,
    getState: () => {
      const questions = getQuestions();
      return {
        currentIndex,
        score,
        total: questions.length,
        questionIds: questions.map((q) => q.id),
        answers: answers.slice(),
      };
    },
  };
})();
