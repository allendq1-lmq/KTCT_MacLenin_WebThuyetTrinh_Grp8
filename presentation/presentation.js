// presentation/presentation.js - Bộ điều khiển độc lập cho trang Nội Dung Thuyết Trình (20 Slides)
window.PresentationApp = (() => {
  let isInitialized = false;
  let currentSlideIndex = 0;

  const defaultRoomNames = {
    1: "Phòng 1: Tổng quan KTTT ĐHXHCN",
    2: "Phòng 2: 5 Đặc trưng cơ bản",
    3: "Phòng 3: Giới hạn CNTB & Giải pháp",
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

  function renderSlideUI(slide, clampedIdx, totalSlides) {
    const badgeEl = document.getElementById("pres-slide-badge");
    const roomTagEl = document.getElementById("pres-room-tag");
    const titleEl = document.getElementById("pres-slide-title");
    const subtitleEl = document.getElementById("pres-slide-subtitle");
    const descEl = document.getElementById("pres-slide-desc");
    const keyPointsEl = document.getElementById("pres-key-points");
    const bodyEl = document.getElementById("pres-slide-body");
    const counterEl = document.getElementById("slide-counter-badge");
    const selectEl = document.getElementById("slide-select-dropdown");
    const progressEl = document.getElementById("pres-progress-bar");
    const mainScrollEl = document.getElementById("pres-main-scroll");
    const summaryCol = document.getElementById("pres-summary-col");
    const detailCol = document.getElementById("pres-detail-col");
    const roomNames = getRoomNames();

    if (badgeEl) {
      badgeEl.textContent = slide.badge || `Mục ${slide.sectionCode}`;
    }
    if (roomTagEl) {
      roomTagEl.textContent = roomNames[slide.room] || "";
    }
    if (titleEl) {
      titleEl.textContent = slide.title || "";
    }
    if (subtitleEl) {
      subtitleEl.textContent = slide.subtitle || "";
    }
    if (descEl) {
      descEl.textContent = slide.desc || "";
    }

    if (counterEl) {
      counterEl.textContent = `Slide ${clampedIdx + 1} / ${totalSlides}`;
    }
    if (selectEl) {
      selectEl.value = String(clampedIdx);
    }
    if (progressEl && totalSlides > 0) {
      progressEl.style.width = `${((clampedIdx + 1) / totalSlides) * 100}%`;
    }

    if (keyPointsEl) {
      const lines = Array.isArray(slide.lines) ? slide.lines : [];
      keyPointsEl.innerHTML = lines
        .map((line, i) => {
          const cleanText = String(line).replace(/^[•\-\s]+/, "");
          return `
            <div class="pres-key-card flex items-start gap-2.5 shadow-sm">
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
    }

    if (summaryCol && detailCol) {
      if (slide.id === "r3-table") {
        summaryCol.className =
          "lg:col-span-3 bg-white border border-slate-300 rounded-xl shadow-sm flex flex-col justify-between";
        detailCol.className =
          "lg:col-span-9 bg-white border-2 border-amber-500 rounded-xl shadow-sm flex flex-col min-h-0";
      } else {
        summaryCol.className =
          "lg:col-span-4 bg-white border border-slate-300 rounded-xl shadow-sm flex flex-col justify-between";
        detailCol.className =
          "lg:col-span-8 bg-white border border-slate-300 rounded-xl shadow-sm flex flex-col min-h-0";
      }
    }

    if (bodyEl) {
      bodyEl.innerHTML = slide.fullHtml || `<p>${slide.desc || ""}</p>`;
      bodyEl.scrollTop = 0;
    }

    if (mainScrollEl) {
      mainScrollEl.scrollTop = 0;
    }
  }

  function goToSlide(idx) {
    const slides = getSlides();
    if (!slides.length) return;
    const clampedIdx = (idx + slides.length) % slides.length;
    currentSlideIndex = clampedIdx;
    const slide = slides[clampedIdx];

    syncRoomButtons(slide.room);
    renderSlideUI(slide, clampedIdx, slides.length);
  }

  function nextSlide() {
    goToSlide(currentSlideIndex + 1);
  }

  function prevSlide() {
    goToSlide(currentSlideIndex - 1);
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

  function init() {
    if (isInitialized) return;
    isInitialized = true;

    populateSlideDropdown();

    const roomButtons = document.querySelectorAll(".room-btn");
    roomButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const room = parseInt(btn.getAttribute("data-room"), 10);
        const firstIdx = getSlides().findIndex((item) => item.room === room);
        if (firstIdx !== -1) {
          goToSlide(firstIdx);
        }
      });
    });

    const presPanel = document.getElementById("presentation-panel");
    let touchStartX = 0;
    let touchStartY = 0;

    if (presPanel) {
      presPanel.addEventListener(
        "touchstart",
        (e) => {
          if (!e.changedTouches.length) return;
          touchStartX = e.changedTouches[0].clientX;
          touchStartY = e.changedTouches[0].clientY;
        },
        { passive: true },
      );

      presPanel.addEventListener(
        "touchend",
        (e) => {
          if (!e.changedTouches.length) return;
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

    window.addEventListener("keydown", (e) => {
      const activeTag =
        document.activeElement && document.activeElement.tagName
          ? document.activeElement.tagName.toUpperCase()
          : "";
      if (activeTag === "SELECT") {
        return;
      }

      const k = e.key.toLowerCase();
      if (k === "f" && !e.ctrlKey && !e.metaKey && !e.altKey) {
        try {
          if (
            window.parent &&
            window.parent !== window &&
            typeof window.parent.toggleMuseumFullscreen === "function"
          ) {
            e.preventDefault();
            window.parent.toggleMuseumFullscreen();
            return;
          }
        } catch (_) {
          if (window.parent && window.parent !== window) {
            e.preventDefault();
            window.parent.postMessage({ type: "TOGGLE_FULLSCREEN" }, "*");
            return;
          }
        }
      }

      if (k === "arrowright" || k === " ") {
        e.preventDefault();
        nextSlide();
        return;
      }
      if (k === "arrowleft") {
        e.preventDefault();
        prevSlide();
      }
    });

    window.addEventListener("message", (e) => {
      if (e.data && e.data.type === "PARENT_KEY_EVENT") {
        window.dispatchEvent(
          new KeyboardEvent(e.data.eventType || "keydown", {
            key: e.data.key,
            code: e.data.code,
          }),
        );
      }
    });

    goToSlide(0);
  }

  return {
    init,
    goToSlide,
    nextSlide,
    prevSlide,
    getCurrentSlideIndex: () => currentSlideIndex,
  };
})();

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    window.PresentationApp.init();
  });
} else {
  window.PresentationApp.init();
}
