// presentation/presentation.js - Bộ điều khiển trình chiếu Reveal.js (embedded: true, 20 Slides, fragments & cách ly SPA)
window.PresentationApp = (() => {
  let isInitialized = false;
  let isActiveState = true;
  let isSyncingReveal = false;
  let currentSlideIndex = 0;
  let fragmentCursor = -1; // -1 = hiển thị đầy đủ tất cả luận điểm; >= 0 = đang nhấn mạnh từng ý tuần tự
  let revealInstance = null;
  let touchStartX = 0;
  let touchStartY = 0;
  let slideIdxAtTouchStart = 0;

  const defaultRoomNames = {
    1: "Phòng 1: Tổng quan KTTT ĐHXHCN",
    2: "Phòng 2: 5 Đặc trưng cơ bản",
    3: "Phòng 3: Giới hạn CNTB & Giải pháp",
  };

  const ROLE_TO_ID = {
    "title-banner": "pres-title-banner",
    "slide-badge": "pres-slide-badge",
    "slide-subtitle": "pres-slide-subtitle",
    "slide-title": "pres-slide-title",
    "content-grid": "pres-content-grid",
    "summary-col": "pres-summary-col",
    "key-points": "pres-key-points",
    "summary-desc-box": "pres-summary-desc-box",
    "slide-desc": "pres-slide-desc",
    "detail-col": "pres-detail-col",
    "slide-body": "pres-slide-body",
  };

  function getSlides() {
    if (window.PresentationData && Array.isArray(window.PresentationData.slides)) {
      return window.PresentationData.slides;
    }
    return [];
  }

  function getRoomNames() {
    return (
      (window.PresentationData && window.PresentationData.roomNames) ||
      defaultRoomNames
    );
  }

  function decorateFullHtmlWithFragments(slide) {
    const rawHtml = slide.fullHtml || `<p>${slide.desc || ""}</p>`;
    const wrapper = document.createElement("div");
    wrapper.innerHTML = rawHtml;

    const lineCount = Array.isArray(slide.lines) && slide.lines.length ? slide.lines.length : 4;
    const maxIdx = Math.max(0, lineCount - 1);

    if (slide.id === "r3-table") {
      const tableRows = wrapper.querySelectorAll(".pres-comp-table tbody tr");
      tableRows.forEach((row, idx) => {
        row.classList.add("fragment", "fade-up", "visible");
        row.setAttribute("data-fragment-index", String(Math.min(idx, maxIdx)));
      });
    } else {
      const subcards = wrapper.querySelectorAll(".pres-subcard");
      subcards.forEach((card, idx) => {
        card.classList.add("fragment", "fade-up", "visible");
        card.setAttribute("data-fragment-index", String(Math.min(idx, maxIdx)));
      });
    }

    return wrapper.innerHTML;
  }

  function buildSlideSectionHtml(slide, idx, totalSlides) {
    const isTableSlide = slide.id === "r3-table";
    const summaryColClass = isTableSlide
      ? "pres-summary-col lg:col-span-3 bg-white border border-slate-300 rounded-xl shadow-sm flex flex-col justify-between"
      : "pres-summary-col lg:col-span-4 bg-white border border-slate-300 rounded-xl shadow-sm flex flex-col justify-between";
    const detailColClass = isTableSlide
      ? "pres-detail-col lg:col-span-9 bg-white border-2 border-amber-500 rounded-xl shadow-sm flex flex-col min-h-0"
      : "pres-detail-col lg:col-span-8 bg-white border border-slate-300 rounded-xl shadow-sm flex flex-col min-h-0";

    const lines = Array.isArray(slide.lines) ? slide.lines : [];
    const keyCardsHtml = lines
      .map((line, i) => {
        const cleanText = String(line).replace(/^[•\-\s]+/, "");
        return `
          <div class="pres-key-card fragment fade-up visible flex items-start gap-2.5 shadow-sm" data-fragment-index="${i}">
            <span class="w-6 h-6 rounded-md bg-amber-600 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
              ${i + 1}
            </span>
            <p class="font-semibold text-slate-900">
              ${cleanText}
            </p>
          </div>
        `;
      })
      .join("");

    const decoratedBodyHtml = decorateFullHtmlWithFragments(slide);
    const sectionStateClass = idx === 0 ? "present" : "future";
    const badgeText = slide.badge || `Mục ${slide.sectionCode}`;

    return `
      <section
        class="pres-slide-section ${sectionStateClass}"
        data-slide-index="${idx}"
        data-slide-id="${slide.id}"
        data-room="${slide.room}"
        data-transition="slide"
        aria-hidden="${idx === 0 ? "false" : "true"}"
      >
        <div class="pres-slide-stage max-w-[1680px] w-full mx-auto">
          <div
            data-pres-role="title-banner"
            class="pres-title-banner rounded-xl bg-white border border-slate-300 border-l-[6px] border-l-amber-600 shadow-sm shrink-0 flex flex-col md:flex-row md:items-center md:justify-between gap-1.5"
          >
            <div class="min-w-0">
              <div class="flex flex-wrap items-center gap-2 mb-0.5">
                <span
                  data-pres-role="slide-badge"
                  class="pres-slide-badge text-[11px] sm:text-xs font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-sky-50 text-sky-800 border border-sky-200 whitespace-nowrap"
                >
                  ${badgeText}
                </span>
                <p
                  data-pres-role="slide-subtitle"
                  class="pres-slide-subtitle text-xs sm:text-sm md:text-base text-amber-700 font-bold truncate"
                >
                  ${slide.subtitle || ""}
                </p>
              </div>
              <h2
                data-pres-role="slide-title"
                class="pres-slide-title font-black text-slate-950 leading-tight tracking-tight"
              >
                ${slide.title || ""}
              </h2>
            </div>

            <div
              class="hidden lg:flex items-center gap-2 shrink-0 text-[11px] font-semibold text-slate-500 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg"
            >
              <span>Slide ${idx + 1}/${totalSlides}</span>
              <kbd class="px-1.5 py-0.5 rounded bg-white border border-slate-300 text-slate-800 font-mono">←</kbd>
              <kbd class="px-1.5 py-0.5 rounded bg-white border border-slate-300 text-slate-800 font-mono">→</kbd>
              <kbd class="px-1.5 py-0.5 rounded bg-white border border-slate-300 text-slate-800 font-mono">Space</kbd>
            </div>
          </div>

          <div
            data-pres-role="content-grid"
            class="pres-content-grid grid grid-cols-1 lg:grid-cols-12 items-stretch"
          >
            <div
              data-pres-role="summary-col"
              class="${summaryColClass}"
            >
              <div class="flex flex-col min-h-0">
                <div
                  class="flex items-center justify-between border-b border-slate-200 pb-1.5 mb-2 shrink-0"
                >
                  <h3
                    class="pres-col-heading font-extrabold uppercase tracking-wider text-amber-700 flex items-center gap-1.5"
                  >
                    <svg
                      class="w-4 h-4 shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      ></path>
                    </svg>
                    <span>Trọng Tâm Luận Điểm</span>
                  </h3>
                  <span
                    class="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200"
                  >${lines.length} Ý Chính</span>
                </div>
                <div data-pres-role="key-points" class="pres-key-points-list">
                  ${keyCardsHtml}
                </div>
              </div>

              <div
                data-pres-role="summary-desc-box"
                class="pres-summary-desc-box rounded-lg bg-slate-50 border border-slate-300 text-slate-800 mt-2 shrink-0"
              >
                <span
                  class="text-[11px] font-extrabold uppercase tracking-wider text-sky-700 block mb-0.5"
                >Khái quát nội dung:</span>
                <p data-pres-role="slide-desc" class="pres-slide-desc text-slate-700">${slide.desc || ""}</p>
              </div>
            </div>

            <div
              data-pres-role="detail-col"
              class="${detailColClass}"
            >
              <div
                class="flex items-center justify-between border-b border-slate-200 pb-1.5 mb-2 shrink-0"
              >
                <h3
                  class="pres-col-heading font-extrabold uppercase tracking-wider text-sky-700 flex items-center gap-1.5"
                >
                  <svg
                    class="w-4 h-4 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    ></path>
                  </svg>
                  <span>Phân Tích Lý Luận &amp; Dẫn Chứng Thực Tiễn</span>
                </h3>
                <span
                  class="text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-300 px-2.5 py-0.5 rounded-full hidden sm:inline-flex items-center gap-1"
                >
                  <span>${totalSlides} Chuyên đề Lý luận &amp; Thực tiễn</span>
                </span>
              </div>
              <div
                data-pres-role="slide-body"
                class="pres-slide-body pres-projector-content text-slate-800 flex-1 min-h-0 flex flex-col justify-center"
              >
                ${decoratedBodyHtml}
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  function renderAllSlideSections() {
    const slidesContainer = document.getElementById("pres-reveal-slides");
    const slides = getSlides();
    if (!slidesContainer || !slides.length) return;
    slidesContainer.innerHTML = slides
      .map((slide, idx) => buildSlideSectionHtml(slide, idx, slides.length))
      .join("");
  }

  function getActiveSection() {
    const sections = document.querySelectorAll("#pres-reveal-slides > section");
    return sections[currentSlideIndex] || null;
  }

  function getFragmentMaxIndex(section) {
    if (!section) return 3;
    let maxIndex = 0;
    const fragments = section.querySelectorAll(".fragment");
    fragments.forEach((frag) => {
      const idx = parseInt(frag.getAttribute("data-fragment-index") || "0", 10);
      if (!isNaN(idx) && idx > maxIndex) {
        maxIndex = idx;
      }
    });
    return maxIndex;
  }

  function updateFragmentStatusLabel(section) {
    const statusEl = document.getElementById("pres-fragment-status");
    const totalSteps = getFragmentMaxIndex(section) + 1;
    if (!statusEl) return;
    const shownCount =
      fragmentCursor < 0 ? totalSteps : Math.min(totalSteps, fragmentCursor + 1);
    statusEl.textContent = `Luận điểm: ${shownCount} / ${totalSteps}`;
  }

  function applyFragmentState() {
    const activeSection = getActiveSection();
    if (!activeSection) return;
    const fragments = activeSection.querySelectorAll(".fragment");

    fragments.forEach((frag) => {
      const idx = parseInt(frag.getAttribute("data-fragment-index") || "0", 10);
      if (fragmentCursor < 0) {
        frag.classList.add("visible");
        frag.classList.remove("current-fragment");
      } else if (idx <= fragmentCursor) {
        frag.classList.add("visible");
        if (idx === fragmentCursor) {
          frag.classList.add("current-fragment");
        } else {
          frag.classList.remove("current-fragment");
        }
      } else {
        frag.classList.remove("visible", "current-fragment");
      }
    });

    updateFragmentStatusLabel(activeSection);
  }

  function syncActiveSectionIds(activeIdx) {
    const sections = document.querySelectorAll("#pres-reveal-slides > section");
    sections.forEach((sec, idx) => {
      const isCurrent = idx === activeIdx;
      sec.classList.toggle("present", isCurrent);
      sec.classList.toggle("past", idx < activeIdx);
      sec.classList.toggle("future", idx > activeIdx);
      sec.setAttribute("aria-hidden", isCurrent ? "false" : "true");

      Object.entries(ROLE_TO_ID).forEach(([role, id]) => {
        const el = sec.querySelector(`[data-pres-role="${role}"]`);
        if (!el) return;
        if (isCurrent) {
          el.setAttribute("id", id);
        } else if (el.getAttribute("id") === id) {
          el.removeAttribute("id");
        }
      });

      if (isCurrent) {
        sec.scrollTop = 0;
        const bodyEl = sec.querySelector('[data-pres-role="slide-body"]');
        if (bodyEl) bodyEl.scrollTop = 0;
      }
    });
  }

  function syncRoomButtons(roomNumber) {
    const roomButtons = document.querySelectorAll(".room-btn");
    roomButtons.forEach((btn) => {
      const r = parseInt(btn.getAttribute("data-room"), 10);
      if (r === roomNumber) {
        btn.classList.add("active");
        btn.classList.remove("text-slate-700");
      } else {
        btn.classList.remove("active");
        btn.classList.add("text-slate-700");
      }
    });
  }

  function syncToolbarUI(slide, clampedIdx, totalSlides) {
    const roomTagEl = document.getElementById("pres-room-tag");
    const counterEl = document.getElementById("slide-counter-badge");
    const counterBottomEl = document.getElementById("slide-counter-bottom");
    const selectEl = document.getElementById("slide-select-dropdown");
    const progressEl = document.getElementById("pres-progress-bar");
    const roomNames = getRoomNames();

    if (roomTagEl) {
      roomTagEl.textContent = roomNames[slide.room] || "";
    }
    const counterLabel = `Slide ${clampedIdx + 1} / ${totalSlides}`;
    if (counterEl) {
      counterEl.textContent = counterLabel;
    }
    if (counterBottomEl) {
      counterBottomEl.textContent = counterLabel;
    }
    if (selectEl) {
      selectEl.value = String(clampedIdx);
    }
    if (progressEl && totalSlides > 0) {
      progressEl.style.width = `${((clampedIdx + 1) / totalSlides) * 100}%`;
    }
  }

  function syncSlideState(idx, options = {}) {
    const slides = getSlides();
    if (!slides.length) return;
    const clampedIdx = ((idx % slides.length) + slides.length) % slides.length;
    currentSlideIndex = clampedIdx;
    fragmentCursor = -1;
    const slide = slides[clampedIdx];

    if (
      !options.skipRevealSlide &&
      revealInstance &&
      typeof revealInstance.slide === "function"
    ) {
      isSyncingReveal = true;
      try {
        revealInstance.slide(clampedIdx, 0);
      } catch (_) {}
      isSyncingReveal = false;
    }

    syncActiveSectionIds(clampedIdx);
    applyFragmentState();
    syncRoomButtons(slide.room);
    syncToolbarUI(slide, clampedIdx, slides.length);
  }

  function goToSlide(idx) {
    syncSlideState(idx);
  }

  function nextSlide() {
    goToSlide(currentSlideIndex + 1);
  }

  function prevSlide() {
    goToSlide(currentSlideIndex - 1);
  }

  function nextFragment() {
    const activeSection = getActiveSection();
    if (!activeSection) {
      nextSlide();
      return;
    }
    const maxIndex = getFragmentMaxIndex(activeSection);
    if (fragmentCursor < 0) {
      fragmentCursor = 0;
      applyFragmentState();
      return;
    }
    if (fragmentCursor < maxIndex) {
      fragmentCursor++;
      applyFragmentState();
      return;
    }
    nextSlide();
  }

  function prevFragment() {
    if (fragmentCursor > 0) {
      fragmentCursor--;
      applyFragmentState();
      return;
    }
    prevSlide();
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
    const btn = document.getElementById("btn-pres-fullscreen");
    const label = document.getElementById("label-pres-fullscreen");
    const iconEnter = document.getElementById("icon-pres-fullscreen-enter");
    const iconExit = document.getElementById("icon-pres-fullscreen-exit");

    if (btn) {
      btn.setAttribute("aria-pressed", isFs ? "true" : "false");
      btn.title = isFs
        ? "Thoát Toàn màn hình (Phím F / Esc)"
        : "Toàn màn hình trình chiếu (Phím F)";
    }
    if (label) {
      label.textContent = isFs ? "Thu nhỏ" : "Toàn màn hình";
    }
    if (iconEnter) {
      iconEnter.classList.toggle("hidden", isFs);
    }
    if (iconExit) {
      iconExit.classList.toggle("hidden", !isFs);
    }
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
      if (rootEl && rootEl.requestFullscreen) {
        rootEl.requestFullscreen().catch(() => {});
      } else if (rootEl && rootEl.webkitRequestFullscreen) {
        rootEl.webkitRequestFullscreen();
      }
    } else if (document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }

  function setActive(active) {
    isActiveState = Boolean(active);

    if (revealInstance && typeof revealInstance.configure === "function") {
      try {
        if (isActiveState) {
          revealInstance.configure({
            keyboard: true,
            keyboardCondition: "focused",
          });
          if (typeof revealInstance.layout === "function") {
            revealInstance.layout();
          }
        } else {
          revealInstance.configure({ keyboard: false });
        }
      } catch (_) {}
    }

    if (!isActiveState) {
      const revealEl = document.getElementById("pres-reveal");
      if (
        revealEl &&
        document.activeElement &&
        (document.activeElement === revealEl ||
          (revealEl.contains && revealEl.contains(document.activeElement))) &&
        typeof document.activeElement.blur === "function"
      ) {
        document.activeElement.blur();
      }
    }
  }

  function isActive() {
    return isActiveState;
  }

  function initRevealDeck() {
    const revealEl = document.getElementById("pres-reveal");
    if (!revealEl || typeof window.Reveal === "undefined") {
      return;
    }

    const config = {
      embedded: true,
      keyboard: isActiveState,
      keyboardCondition: "focused",
      transition: "slide",
      transitionSpeed: "default",
      fragments: true,
      touch: true,
      controls: false,
      progress: false,
      slideNumber: false,
      center: false,
      disableLayout: true,
      hash: false,
      history: false,
      overview: false,
      help: false,
      pause: false,
      loop: true,
      autoAnimate: false,
    };

    try {
      if (typeof window.Reveal === "function") {
        revealInstance = new window.Reveal(revealEl, config);
        const maybePromise = revealInstance.initialize(config);
        if (maybePromise && typeof maybePromise.then === "function") {
          maybePromise.then(() => {
            syncActiveSectionIds(currentSlideIndex);
            applyFragmentState();
          });
        }
      } else if (window.Reveal && typeof window.Reveal.initialize === "function") {
        revealInstance = window.Reveal;
        revealInstance.initialize(config);
      }

      if (revealInstance && typeof revealInstance.on === "function") {
        revealInstance.on("slidechanged", (evt) => {
          if (isSyncingReveal) return;
          const nextIdx =
            evt && typeof evt.indexh === "number" ? evt.indexh : currentSlideIndex;
          if (nextIdx !== currentSlideIndex) {
            syncSlideState(nextIdx, { skipRevealSlide: true });
          } else {
            applyFragmentState();
          }
        });
      }
    } catch (_) {
      revealInstance = null;
    }
  }

  function populateSlideDropdown() {
    const selectEl = document.getElementById("slide-select-dropdown");
    if (!selectEl) return;
    const slides = getSlides();
    selectEl.innerHTML = slides
      .map(
        (item, idx) =>
          `<option value="${idx}">Slide ${idx + 1}/${slides.length} [P.${item.room}] ${item.title}</option>`,
      )
      .join("");
    selectEl.addEventListener("change", () => {
      const idx = parseInt(selectEl.value, 10);
      if (!isNaN(idx)) {
        goToSlide(idx);
      }
      selectEl.blur();
    });
  }

  function handleKeyDown(e) {
    if (!isActiveState) return;

    const activeTag =
      document.activeElement && document.activeElement.tagName
        ? document.activeElement.tagName.toUpperCase()
        : "";
    if (["SELECT", "INPUT", "TEXTAREA"].includes(activeTag)) {
      return;
    }

    const k = (e.key || "").toLowerCase();
    // Cho phép Space kích hoạt đúng nút đang được focus qua phím Tab
    if (activeTag === "BUTTON" && k === " ") {
      return;
    }
    if (k === "f" && !e.ctrlKey && !e.metaKey && !e.altKey) {
      e.preventDefault();
      if (e.stopPropagation) e.stopPropagation();
      toggleFullscreen();
      return;
    }

    if (k === "arrowright" || k === "pagedown") {
      e.preventDefault();
      if (e.stopPropagation) e.stopPropagation();
      nextSlide();
      return;
    }
    if (k === "arrowleft" || k === "pageup") {
      e.preventDefault();
      if (e.stopPropagation) e.stopPropagation();
      prevSlide();
      return;
    }
    if (k === " " || k === "arrowdown") {
      e.preventDefault();
      if (e.stopPropagation) e.stopPropagation();
      nextFragment();
      return;
    }
    if (k === "arrowup") {
      e.preventDefault();
      if (e.stopPropagation) e.stopPropagation();
      prevFragment();
      return;
    }
    if (k === "home") {
      e.preventDefault();
      if (e.stopPropagation) e.stopPropagation();
      goToSlide(0);
      return;
    }
    if (k === "end") {
      e.preventDefault();
      if (e.stopPropagation) e.stopPropagation();
      const slides = getSlides();
      if (slides.length) goToSlide(slides.length - 1);
    }
  }

  function bindClickAction(el, action) {
    if (!el) return;
    el.addEventListener("click", (e) => {
      action(e);
      if (e && e.detail > 0 && typeof el.blur === "function") {
        el.blur();
      }
    });
  }

  function bindToolbarControls() {
    const roomButtons = document.querySelectorAll(".room-btn");
    roomButtons.forEach((btn) => {
      bindClickAction(btn, () => {
        const room = parseInt(btn.getAttribute("data-room"), 10);
        const firstIdx = getSlides().findIndex((item) => item.room === room);
        if (firstIdx !== -1) {
          goToSlide(firstIdx);
        }
      });
    });

    bindClickAction(document.getElementById("btn-slide-prev"), prevSlide);
    bindClickAction(document.getElementById("btn-slide-next"), nextSlide);
    bindClickAction(document.getElementById("btn-fragment-next"), nextFragment);
    bindClickAction(document.getElementById("btn-fragment-step"), nextFragment);
    bindClickAction(document.getElementById("btn-pres-fullscreen"), toggleFullscreen);

    ["fullscreenchange", "webkitfullscreenchange"].forEach((evt) => {
      document.addEventListener(evt, () => syncFullscreenButtonState());
      try {
        if (window.parent && window.parent !== window && window.parent.document) {
          window.parent.document.addEventListener(evt, () =>
            syncFullscreenButtonState(),
          );
        }
      } catch (_) {}
    });
  }

  function bindTouchSwipe() {
    const presPanel = document.getElementById("presentation-panel");
    if (!presPanel) return;

    let ignoreSwipeGesture = false;

    presPanel.addEventListener(
      "touchstart",
      (e) => {
        if (!e.changedTouches || !e.changedTouches.length) return;
        touchStartX = e.changedTouches[0].clientX;
        touchStartY = e.changedTouches[0].clientY;
        slideIdxAtTouchStart = currentSlideIndex;
        ignoreSwipeGesture = false;

        if (e.target && typeof e.target.closest === "function") {
          const scrollableTable = e.target.closest(".overflow-x-auto");
          if (
            scrollableTable &&
            scrollableTable.scrollWidth > scrollableTable.clientWidth
          ) {
            ignoreSwipeGesture = true;
          }
        }
      },
      { passive: true },
    );

    presPanel.addEventListener(
      "touchend",
      (e) => {
        if (
          ignoreSwipeGesture ||
          !isActiveState ||
          !e.changedTouches ||
          !e.changedTouches.length
        ) {
          return;
        }
        // Tránh nhảy 2 slide nếu Reveal.js touch module đã tự chuyển trang
        if (currentSlideIndex !== slideIdxAtTouchStart) return;

        const dx = e.changedTouches[0].clientX - touchStartX;
        const dy = e.changedTouches[0].clientY - touchStartY;
        if (Math.abs(dx) >= 45 && Math.abs(dx) > Math.abs(dy)) {
          if (dx < 0) {
            nextSlide();
          } else {
            prevSlide();
          }
        }
      },
      { passive: true },
    );
  }

  function init() {
    if (isInitialized) return;
    isInitialized = true;

    renderAllSlideSections();
    populateSlideDropdown();
    bindToolbarControls();
    bindTouchSwipe();
    initRevealDeck();

    // Bắt phím ở capture phase khi đang active để không xung đột trình duyệt/Reveal
    window.addEventListener("keydown", handleKeyDown, true);

    window.addEventListener("message", (e) => {
      if (!e || !e.data) return;
      if (e.data.type === "PRESENTATION_SET_ACTIVE") {
        setActive(Boolean(e.data.active));
        return;
      }
      if (e.data.type === "FULLSCREEN_CHANGED") {
        syncFullscreenButtonState(Boolean(e.data.isFullscreen));
        return;
      }
      if (e.data.type === "PARENT_KEY_EVENT") {
        if (!isActiveState) return;
        handleKeyDown({
          key: e.data.key,
          code: e.data.code,
          ctrlKey: Boolean(e.data.ctrlKey),
          metaKey: Boolean(e.data.metaKey),
          altKey: Boolean(e.data.altKey),
          preventDefault() {},
          stopPropagation() {},
        });
      }
    });

    syncSlideState(0);
    syncFullscreenButtonState();
  }

  return {
    init,
    goToSlide,
    nextSlide,
    prevSlide,
    nextFragment,
    prevFragment,
    setActive,
    isActive,
    toggleFullscreen,
    getCurrentSlideIndex: () => currentSlideIndex,
    getTotalSlides: () => getSlides().length,
    getRevealInstance: () => revealInstance,
  };
})();

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    window.PresentationApp.init();
  });
} else {
  window.PresentationApp.init();
}
