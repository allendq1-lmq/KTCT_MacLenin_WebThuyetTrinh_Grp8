// presentation/presentation.js - Bộ điều khiển trình chiếu Canva Presentation (6 kiến trúc bố cục) + Reveal.js
window.PresentationApp = (() => {
  let isInitialized = false;
  let isActiveState = true;
  let isSyncingReveal = false;
  let currentSlideIndex = 0;
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

  const HERO_COVER_IDS = new Set(["r1-1a", "r2-a", "r3-1"]);
  const GRID_SLIDE_IDS = new Set([
    "r1-3",
    "r1-4a",
    "r1-4b",
    "r2-b2",
    "r3-2",
    "r3-3a",
    "r3-3b",
  ]);
  const FEATURE_PILLAR_IDS = new Set(["r2-b1", "r2-b4", "r2-b5"]);

  const SUBCARD_ICON_PATHS = [
    '<path d="M3 17l6-6 4 4 8-8M14 7h7v7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
    '<path d="M12 3l8 4v5c0 5.25-3.4 9.74-8 11-4.6-1.26-8-5.75-8-11V7l8-4z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>',
    '<path d="M12 3v18M5 21h14M6 7l6-2 6 2M4 13l2-6 2 6a2.5 2.5 0 01-4 0zm12 0l2-6 2 6a2.5 2.5 0 01-4 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
    '<path d="M11 20A7 7 0 019.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>',
    '<path d="M12 3l2.4 5 5.6.8-4 3.9.9 5.5-4.9-2.6-4.9 2.6.9-5.5-4-3.9 5.6-.8L12 3z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>',
  ];

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

  function classifySlideLayout(slide) {
    if (!slide) return "split-timeline";
    if (slide.id === "r3-table") return "comparison-matrix";
    if (slide.id === "r3-verdict") return "citation-grid";
    if (HERO_COVER_IDS.has(slide.id)) return "hero-cover";
    if (GRID_SLIDE_IDS.has(slide.id)) return "card-grid";
    if (FEATURE_PILLAR_IDS.has(slide.id)) return "feature-pillars";
    return "split-timeline";
  }

  function getSlidePalette(slide) {
    const color = String((slide && slide.color) || "").toLowerCase();
    if (color === "#0284c7") {
      return {
        accent: "#0284c7",
        soft: "#f0f9ff",
        border: "#bae6fd",
        ink: "#075985",
      };
    }
    if (color === "#059669") {
      return {
        accent: "#059669",
        soft: "#ecfdf5",
        border: "#a7f3d0",
        ink: "#065f46",
      };
    }
    if (color === "#dc2626" || color === "#e11d48") {
      return {
        accent: "#e11d48",
        soft: "#fff1f2",
        border: "#fecdd3",
        ink: "#9f1239",
      };
    }
    if (color === "#7c3aed") {
      return {
        accent: "#7c3aed",
        soft: "#f5f3ff",
        border: "#ddd6fe",
        ink: "#5b21b6",
      };
    }
    if (color === "#64748b") {
      return {
        accent: "#475569",
        soft: "#f8fafc",
        border: "#cbd5e1",
        ink: "#1e293b",
      };
    }
    return {
      accent: "#d97706",
      soft: "#fffbeb",
      border: "#fde68a",
      ink: "#92400e",
    };
  }

  function getSubcardIconSvg(idx, slideId) {
    const offset = slideId === "r3-2" ? 3 : 0;
    const pathD = SUBCARD_ICON_PATHS[(idx + offset) % SUBCARD_ICON_PATHS.length];
    return `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">${pathD}</svg>`;
  }

  function getSlideThemeSvg(slide, layoutType) {
    const id = (slide && slide.id) || "";
    const room = (slide && slide.room) || 1;

    if (layoutType === "hero-cover") {
      if (room === 1) {
        return `
          <svg class="canva-hero-illustration" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <rect x="6" y="6" width="84" height="84" rx="22" fill="#EFF6FF" stroke="#BAE6FD" stroke-width="2" />
            <path d="M22 64L38 48L50 56L72 30" stroke="#0284C7" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M60 30H72V42" stroke="#0284C7" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round" />
            <circle cx="38" cy="48" r="5" fill="#F59E0B" stroke="#FFFFFF" stroke-width="2" />
            <circle cx="50" cy="56" r="5" fill="#059669" stroke="#FFFFFF" stroke-width="2" />
            <rect x="22" y="70" width="52" height="5" rx="2.5" fill="#CBD5E1" />
          </svg>
        `;
      }
      if (room === 2) {
        return `
          <svg class="canva-hero-illustration" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <rect x="6" y="6" width="84" height="84" rx="22" fill="#FFFBEB" stroke="#FDE68A" stroke-width="2" />
            <polygon points="48,18 57,36 77,39 62,53 66,73 48,63 30,73 34,53 19,39 39,36" fill="#F59E0B" fill-opacity="0.22" stroke="#D97706" stroke-width="3.5" stroke-linejoin="round" />
            <circle cx="48" cy="48" r="9" fill="#D97706" />
          </svg>
        `;
      }
      return `
        <svg class="canva-hero-illustration" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <rect x="6" y="6" width="84" height="84" rx="22" fill="#FFF1F2" stroke="#FECDD3" stroke-width="2" />
          <path d="M48 20L72 30V48C72 63 61 73 48 78C35 73 24 63 24 48V30L48 20Z" fill="#E11D48" fill-opacity="0.14" stroke="#E11D48" stroke-width="3.5" stroke-linejoin="round" />
          <path d="M48 36V50M48 58H48.02" stroke="#E11D48" stroke-width="4.5" stroke-linecap="round" />
        </svg>
      `;
    }

    let innerPath = SUBCARD_ICON_PATHS[4];
    if (id === "r1-3") innerPath = SUBCARD_ICON_PATHS[0];
    else if (id === "r3-table" || id === "r2-b4" || id === "r2-b2") innerPath = SUBCARD_ICON_PATHS[2];
    else if (id === "r3-2" || id === "r2-b5") innerPath = SUBCARD_ICON_PATHS[3];
    else if (id === "r1-1b" || id === "r1-4a" || id === "r2-b3" || id === "r3-verdict") innerPath = SUBCARD_ICON_PATHS[1];
    else if (id === "r1-2a" || id === "r1-2b" || id === "r1-2c") {
      innerPath = '<circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2.1"/><path d="M12 7v5l3.5 2" stroke="currentColor" stroke-width="2.1" stroke-linecap="round"/>';
    } else if (id === "r3-3a") {
      innerPath = '<path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>';
    }

    return `
      <span class="canva-theme-badge-box" aria-hidden="true">
        <svg class="canva-theme-svg" viewBox="0 0 24 24" fill="none">${innerPath}</svg>
      </span>
    `;
  }

  function escapeHtmlText(str) {
    return String(str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function highlightPlainTextSegment(text) {
    const metricPattern =
      /(Thực tiễn VN:)|(476,3 tỷ USD|476,3 tỷ \$|~4\.700 \$|17 FTA|73 quốc gia|73 Nước|Hạng 33 TG|hạng 33 thế giới|trên 58% \(1993\)|>58%|dưới 3%|<3%|>93% dân số|>93%|Net Zero 2050|Nghị quyết 68-NQ\/TW|NQ 68-NQ\/TW|Nghị quyết 11-NQ\/TW|Điều 51 Hiến pháp 2013|Hiến pháp 2013 \(Điều 51\)|Đại hội XIV|COP26|Luật Bảo vệ Môi trường 2020)([.,;:!?%)]*)/g;
    let out = "";
    let lastIdx = 0;
    const raw = String(text || "");
    let match;
    while ((match = metricPattern.exec(raw))) {
      if (match.index > lastIdx) {
        out += escapeHtmlText(raw.slice(lastIdx, match.index));
      }
      if (match[1]) {
        out += `<span class="canva-vn-tag">${escapeHtmlText(match[1])}</span>`;
      } else {
        const core = match[2];
        const punct = match[3] || "";
        const pill = `<span class="canva-kpi-pill">${escapeHtmlText(core)}</span>`;
        out += punct
          ? `<span class="canva-kpi-wrap">${pill}${escapeHtmlText(punct)}</span>`
          : pill;
      }
      lastIdx = match.index + match[0].length;
    }
    if (lastIdx < raw.length) {
      out += escapeHtmlText(raw.slice(lastIdx));
    }
    return out;
  }

  function highlightKpiMetricsInHtml(html, isPlainText = false) {
    const raw = String(html || "");
    if (isPlainText) {
      return highlightPlainTextSegment(raw);
    }
    const joined = raw
      .split(/(<\/?[a-zA-Z!][^>]*>)/g)
      .map((part, idx) => (idx % 2 === 1 ? part : highlightPlainTextSegment(part)))
      .join("");
    return joined.replace(
      /(<(?:strong|b|em)><span class="canva-kpi-pill">[^<]+<\/span><\/(?:strong|b|em)>)([.,;:!?)]+)/g,
      '<span class="canva-kpi-wrap">$1$2</span>',
    );
  }

  function wrapVietnamPracticeCallout(card) {
    const nodes = Array.from(card.childNodes || card.children || []);
    const vnIdx = nodes.findIndex(
      (n) =>
        n.tagName === "SPAN" &&
        n.textContent &&
        n.textContent.includes("Thực tiễn VN:"),
    );
    if (vnIdx === -1) return;

    const callout = document.createElement("div");
    callout.className = "canva-vn-callout";
    nodes.slice(vnIdx).forEach((node) => {
      callout.appendChild(node);
    });
    card.appendChild(callout);
  }

  function decorateFullHtmlWithFragments(slide, layoutType) {
    const rawHtml = slide.fullHtml || `<p>${slide.desc || ""}</p>`;
    const highlightedHtml = highlightKpiMetricsInHtml(rawHtml);
    const wrapper = document.createElement("div");
    wrapper.innerHTML = highlightedHtml;

    if (layoutType === "comparison-matrix") {
      return wrapper.innerHTML;
    }

    const subcards = wrapper.querySelectorAll(".pres-subcard");
    subcards.forEach((card, idx) => {
      if (layoutType === "citation-grid") {
        if (idx === 0) card.classList.add("canva-verdict-box");
        return;
      }

      wrapVietnamPracticeCallout(card);

      const head = document.createElement("div");
      head.className = "canva-subcard-head";
      head.setAttribute("aria-hidden", "true");
      head.innerHTML = `<span class="canva-subcard-index" data-subcard-num="${String(
        idx + 1,
      ).padStart(2, "0")}"></span><span class="canva-subcard-icon">${getSubcardIconSvg(
        idx,
        slide.id,
      )}</span>`;
      card.insertBefore(head, card.firstChild);
    });

    if (layoutType === "split-timeline") {
      const stack = wrapper.querySelector(".pres-detail-stack");
      if (stack) stack.classList.add("canva-timeline-rail");
    }

    if (layoutType === "citation-grid") {
      const refItems = wrapper.querySelectorAll(".pres-ref-list li");
      refItems.forEach((li, idx) => {
        li.classList.add("canva-citation-card");
        const numBadge = `#${String(idx + 1).padStart(2, "0")}`;
        const originalInner = li.innerHTML;
        li.innerHTML = `<span class="canva-citation-num" data-cite-num="${numBadge}" aria-hidden="true"></span><span class="canva-citation-body">${originalInner}</span>`;
      });
    }

    return wrapper.innerHTML;
  }

  function renderTitleBannerHtml(slide, themeVisualHtml, extraClass = "") {
    const badgeText = escapeHtmlText(slide.badge || `Mục ${slide.sectionCode}`);
    return `
      <div data-pres-role="title-banner" class="pres-title-banner ${extraClass}">
        <div class="canva-banner-main">
          <div class="canva-banner-meta">
            <span data-pres-role="slide-badge" class="pres-slide-badge">${badgeText}</span>
            <p data-pres-role="slide-subtitle" class="pres-slide-subtitle">${escapeHtmlText(
              slide.subtitle || "",
            )}</p>
          </div>
          <h2 data-pres-role="slide-title" class="pres-slide-title">${escapeHtmlText(
            slide.title || "",
          )}</h2>
        </div>
        ${themeVisualHtml ? `<div class="canva-banner-visual">${themeVisualHtml}</div>` : ""}
      </div>
    `;
  }

  function renderKeyPointsListHtml(slide) {
    const lines = Array.isArray(slide.lines) ? slide.lines : [];
    return lines
      .map((line, i) => {
        const cleanText = highlightKpiMetricsInHtml(
          String(line).replace(/^[•\-\s]+/, ""),
          true,
        );
        return `
          <div class="pres-key-card">
            <span>${i + 1}</span>
            <p>${cleanText}</p>
          </div>
        `;
      })
      .join("");
  }

  function renderQuoteBoxHtml(decoratedDesc, extraClass = "") {
    return `
      <div data-pres-role="summary-desc-box" class="pres-summary-desc-box ${extraClass}">
        <span class="canva-quote-label">Khái quát nội dung</span>
        <p data-pres-role="slide-desc" class="pres-slide-desc">${decoratedDesc}</p>
      </div>
    `;
  }

  function buildHeroCoverBody(slide, _idx, _totalSlides, ctx) {
    return `
      <div data-pres-role="content-grid" class="canva-layout-hero">
        <div class="canva-hero-poster">
          ${renderTitleBannerHtml(slide, "", "")}
          <div class="canva-hero-visual-stage">
            <div>
              <span class="canva-room-watermark" aria-hidden="true">PHÒNG 0${slide.room}</span>
            </div>
            ${ctx.themeVisualHtml}
          </div>
          ${renderQuoteBoxHtml(ctx.decoratedDesc, "canva-quote-card")}
        </div>

        <div class="canva-hero-right">
          <div data-pres-role="summary-col" class="pres-summary-col">
            <div class="canva-panel-head">
              <h3 class="pres-col-heading">Trọng Tâm Luận Điểm</h3>
            </div>
            <div data-pres-role="key-points" class="pres-key-points-list">
              ${ctx.keyCardsHtml}
            </div>
          </div>

          <div data-pres-role="detail-col" class="pres-detail-col">
            <div class="canva-panel-head">
              <h3 class="pres-col-heading">Phân Tích Nền Tảng</h3>
            </div>
            <div data-pres-role="slide-body" class="pres-slide-body pres-projector-content">
              ${ctx.decoratedBodyHtml}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function buildStackedFullCanvasBody(slide, _idx, _totalSlides, ctx, wrapperClass, panelHeading, chipLabel) {
    return `
      <div class="${wrapperClass}">
        <div class="canva-grid-header-row">
          ${renderTitleBannerHtml(slide, ctx.themeVisualHtml, "")}
          ${renderQuoteBoxHtml(ctx.decoratedDesc, "")}
        </div>
        <div data-pres-role="content-grid" class="flex-1 min-h-0 flex flex-col gap-2">
          <div data-pres-role="summary-col" class="pres-summary-col canva-grid-strip">
            <div data-pres-role="key-points" class="pres-key-points-list">
              ${ctx.keyCardsHtml}
            </div>
          </div>
          <div data-pres-role="detail-col" class="pres-detail-col canva-grid-canvas">
            <div class="canva-panel-head">
              <h3 class="pres-col-heading">${panelHeading}</h3>
              ${chipLabel ? `<span class="canva-topic-chip">${chipLabel}</span>` : ""}
            </div>
            <div data-pres-role="slide-body" class="pres-slide-body pres-projector-content">
              ${ctx.decoratedBodyHtml}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function buildSplitTimelineBody(slide, _idx, _totalSlides, ctx) {
    return `
      <div class="canva-layout-timeline">
        ${renderTitleBannerHtml(slide, ctx.themeVisualHtml, "")}
        <div data-pres-role="content-grid" class="pres-content-grid grid grid-cols-1 lg:grid-cols-12 items-stretch">
          <div data-pres-role="summary-col" class="pres-summary-col lg:col-span-4 flex flex-col justify-between">
            <div class="flex flex-col min-h-0">
              <div class="canva-panel-head">
                <h3 class="pres-col-heading">Trọng Tâm Luận Điểm</h3>
              </div>
              <div data-pres-role="key-points" class="pres-key-points-list">
                ${ctx.keyCardsHtml}
              </div>
            </div>
            ${renderQuoteBoxHtml(ctx.decoratedDesc, "canva-quote-card mt-2")}
          </div>

          <div data-pres-role="detail-col" class="pres-detail-col lg:col-span-8 flex flex-col min-h-0">
            <div class="canva-panel-head">
              <h3 class="pres-col-heading">Diễn Tiến &amp; Luận Giải Chi Tiết</h3>
            </div>
            <div data-pres-role="slide-body" class="pres-slide-body pres-projector-content flex-1 min-h-0 flex flex-col justify-center">
              ${ctx.decoratedBodyHtml}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function buildFeaturePillarsBody(slide, _idx, _totalSlides, ctx) {
    return `
      <div class="canva-layout-pillars">
        ${renderTitleBannerHtml(slide, ctx.themeVisualHtml, "")}
        <div data-pres-role="content-grid" class="pres-content-grid grid grid-cols-1 lg:grid-cols-12 items-stretch">
          <div data-pres-role="detail-col" class="pres-detail-col canva-pillars-showcase lg:col-span-8 flex flex-col min-h-0">
            <div class="canva-panel-head">
              <h3 class="pres-col-heading">Trụ Cột Lý Luận &amp; Phân Tích</h3>
            </div>
            <div data-pres-role="slide-body" class="pres-slide-body pres-projector-content flex-1 min-h-0 flex flex-col justify-center">
              ${ctx.decoratedBodyHtml}
            </div>
          </div>

          <div data-pres-role="summary-col" class="pres-summary-col canva-pillars-sidebar lg:col-span-4 flex flex-col justify-between">
            ${renderQuoteBoxHtml(ctx.decoratedDesc, "canva-quote-card mb-2")}
            <div class="flex flex-col min-h-0">
              <div class="canva-panel-head">
                <h3 class="pres-col-heading">Điểm Nhớ Nhanh</h3>
              </div>
              <div data-pres-role="key-points" class="pres-key-points-list">
                ${ctx.keyCardsHtml}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function buildSlideSectionHtml(slide, idx, totalSlides) {
    const layoutType = classifySlideLayout(slide, idx);
    const palette = getSlidePalette(slide);
    const lines = Array.isArray(slide.lines) ? slide.lines : [];
    const ctx = {
      lineCount: lines.length,
      themeVisualHtml: getSlideThemeSvg(slide, layoutType),
      keyCardsHtml: renderKeyPointsListHtml(slide),
      decoratedDesc: highlightKpiMetricsInHtml(slide.desc || "", true),
      decoratedBodyHtml: decorateFullHtmlWithFragments(slide, layoutType),
    };

    let stageInnerHtml = "";
    if (layoutType === "hero-cover") {
      stageInnerHtml = buildHeroCoverBody(slide, idx, totalSlides, ctx);
    } else if (layoutType === "card-grid") {
      stageInnerHtml = buildStackedFullCanvasBody(
        slide,
        idx,
        totalSlides,
        ctx,
        "canva-layout-grid",
        "Phân Tích Lý Luận &amp; Dẫn Chứng Thực Tiễn",
        "",
      );
    } else if (layoutType === "feature-pillars") {
      stageInnerHtml = buildFeaturePillarsBody(slide, idx, totalSlides, ctx);
    } else if (layoutType === "comparison-matrix") {
      stageInnerHtml = buildStackedFullCanvasBody(
        slide,
        idx,
        totalSlides,
        ctx,
        "canva-layout-matrix",
        "Ma Trận So Sánh 6 Tiêu Chí Bản Chất",
        "Đối chiếu trực diện",
      );
    } else if (layoutType === "citation-grid") {
      stageInnerHtml = buildStackedFullCanvasBody(
        slide,
        idx,
        totalSlides,
        ctx,
        "canva-layout-citations",
        "Phán Quyết Cuối Cùng &amp; 10 Nguồn Tài Liệu Tham Khảo",
        "Tổng kết học thuật",
      );
    } else {
      stageInnerHtml = buildSplitTimelineBody(slide, idx, totalSlides, ctx);
    }

    const sectionStateClass = idx === 0 ? "present" : "future";
    const styleVars = `--slide-accent:${palette.accent};--slide-accent-soft:${palette.soft};--slide-accent-border:${palette.border};--slide-accent-ink:${palette.ink};`;

    return `
      <section
        class="pres-slide-section ${sectionStateClass}"
        data-slide-index="${idx}"
        data-slide-id="${slide.id}"
        data-room="${slide.room}"
        data-layout="${layoutType}"
        data-transition="slide"
        style="${styleVars}"
        aria-hidden="${idx === 0 ? "false" : "true"}"
      >
        <div class="pres-slide-stage max-w-[1640px] w-full mx-auto">
          ${stageInnerHtml}
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

  function applyFragmentState() {
    // Không ẩn/dim từng luận điểm; toàn bộ nội dung trên slide luôn hiển thị ngay.
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
      btn.classList.toggle("active", r === roomNumber);
    });
  }

  function syncToolbarUI(slide, clampedIdx, totalSlides) {
    const roomTagEl = document.getElementById("pres-room-tag");
    const counterEl = document.getElementById("slide-counter-badge");
    const selectEl = document.getElementById("slide-select-dropdown");
    const progressEl = document.getElementById("pres-progress-bar");
    const roomNames = getRoomNames();

    if (roomTagEl) {
      roomTagEl.textContent = roomNames[slide.room] || "";
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
  }

  function syncSlideState(idx, options = {}) {
    const slides = getSlides();
    if (!slides.length) return;
    const clampedIdx = ((idx % slides.length) + slides.length) % slides.length;
    currentSlideIndex = clampedIdx;
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
    nextSlide();
  }

  function prevFragment() {
    prevSlide();
  }

  function getParentFullscreenFlag() {
    try {
      if (window.parent && window.parent !== window && window.parent.document) {
        const parentFs = !!(
          window.parent.document.fullscreenElement ||
          window.parent.document.webkitFullscreenElement
        );
        if (!parentFs) return false;
        if (typeof window.parent.getCurrentActiveTab === "function") {
          return window.parent.getCurrentActiveTab() === "content";
        }
        return true;
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
    const exitOverlayBtn = document.getElementById("btn-exit-pres-fullscreen");
    const btn = document.getElementById("btn-pres-fullscreen");
    const label = document.getElementById("label-pres-fullscreen");
    const iconEnter = document.getElementById("icon-pres-fullscreen-enter");
    const iconExit = document.getElementById("icon-pres-fullscreen-exit");

    if (panel) {
      panel.classList.toggle("pres-fullscreen-active", isFs);
    }
    if (exitOverlayBtn) {
      exitOverlayBtn.classList.toggle("hidden", !isFs);
    }

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

    if (document.fullscreenElement || document.webkitFullscreenElement) {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    } else if (window.parent && window.parent !== window) {
      window.parent.postMessage({ type: "EXIT_FULLSCREEN" }, "*");
    } else {
      syncFullscreenButtonState(false);
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
      fragments: false,
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
          `<option value="${idx}">${idx + 1}. [P.${item.room}] ${item.title}</option>`,
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
    if (activeTag === "BUTTON" && k === " ") {
      return;
    }
    if (k === "f" && !e.ctrlKey && !e.metaKey && !e.altKey) {
      e.preventDefault();
      if (e.stopPropagation) e.stopPropagation();
      toggleFullscreen();
      return;
    }

    if (k === "arrowright" || k === "pagedown" || k === " " || k === "arrowdown") {
      e.preventDefault();
      if (e.stopPropagation) e.stopPropagation();
      nextSlide();
      return;
    }
    if (k === "arrowleft" || k === "pageup" || k === "arrowup") {
      e.preventDefault();
      if (e.stopPropagation) e.stopPropagation();
      prevSlide();
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
    bindClickAction(document.getElementById("btn-pres-fullscreen"), toggleFullscreen);
    bindClickAction(
      document.getElementById("btn-exit-pres-fullscreen"),
      exitFullscreenMode,
    );

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
    classifySlideLayout,
    getSlideThemeSvg,
    getSubcardIconSvg,
    highlightKpiMetricsInHtml,
    goToSlide,
    nextSlide,
    prevSlide,
    nextFragment,
    prevFragment,
    setActive,
    isActive,
    toggleFullscreen,
    exitFullscreen: exitFullscreenMode,
    setFullscreenState: syncFullscreenButtonState,
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
