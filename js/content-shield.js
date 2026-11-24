/**
 * js/content-shield.js — Hệ thống Bảo vệ Nội dung 3 Lớp (Nhóm 8 - UIT - KTCT Mác - Lênin)
 * - Lớp 1: Kiểm tra môi trường tự động/bot & Giải mã dữ liệu theo tương tác người thật (Human-Interaction Hydration)
 * - Lớp 2: Phân mảnh văn bản DOM bằng CSS order + thẻ nhiễu ẩn, chặn sao chép & Inspect nhẹ nhàng
 * - Lớp 3: Lớp phủ SVG Micro-Grid siêu mảnh (pointer-events: none) chống OCR
 */
(function (root, factory) {
  const api = factory();
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
  if (root) {
    root.ContentShield = api;
  }
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";

  const SHIELD_KEY = "KTCT8-UIT-SS008R12-2026-SHIELD";
  const SESSION_FLAG = "ktct8_human_ok";
  const TOAST_MESSAGE = "Nội dung trình chiếu được bảo vệ bởi Nhóm 8";
  const DECOY_TOKENS = [
    "[UIT-KTCT8]",
    "•",
    "Nhóm8",
    "[SS008.R12]",
    "§",
    "[BảnQuyền]",
  ];

  const hasWindow = typeof window !== "undefined" && typeof document !== "undefined";

  let shieldMode = "gate";
  let gateTitle = "Nội dung thuyết trình được bảo vệ bởi Nhóm 8";
  let gateSubtitle = "Di chuyển chuột, chạm màn hình hoặc bấm nút bên dưới để mở nội dung";
  let gateButtonLabel = "Mở nội dung thuyết trình";

  if (hasWindow) {
    const currentScript = document.currentScript;
    if (currentScript) {
      shieldMode = currentScript.getAttribute("data-shield-mode") || shieldMode;
      gateButtonLabel =
        currentScript.getAttribute("data-shield-button-label") || gateButtonLabel;
      gateTitle = currentScript.getAttribute("data-shield-title") || gateTitle;
    }
    if (window.CONTENT_SHIELD_CONFIG) {
      const cfg = window.CONTENT_SHIELD_CONFIG;
      if (cfg.mode) shieldMode = cfg.mode;
      if (cfg.buttonLabel) gateButtonLabel = cfg.buttonLabel;
      if (cfg.title) gateTitle = cfg.title;
      if (cfg.subtitle) gateSubtitle = cfg.subtitle;
    }
  }

  let verified = shieldMode === "passive";
  let runtimeInitialized = false;
  let lastToastAt = 0;
  let toastHideTimer = null;
  const verifiedCallbacks = [];

  // ================= LỚP 1A: MÃ HÓA / GIẢI MÃ UNICODE XOR + BASE64 =================

  function getKeyBytes() {
    if (typeof TextEncoder !== "undefined") {
      return new TextEncoder().encode(SHIELD_KEY);
    }
    const bytes = new Uint8Array(SHIELD_KEY.length);
    for (let i = 0; i < SHIELD_KEY.length; i++) {
      bytes[i] = SHIELD_KEY.charCodeAt(i) & 0xff;
    }
    return bytes;
  }

  function bytesToBase64(bytes) {
    if (typeof Buffer !== "undefined" && typeof btoa === "undefined") {
      return Buffer.from(bytes).toString("base64");
    }
    let binary = "";
    const chunkSize = 8192;
    for (let i = 0; i < bytes.length; i += chunkSize) {
      const slice = bytes.subarray(i, i + chunkSize);
      binary += String.fromCharCode.apply(null, slice);
    }
    return btoa(binary);
  }

  function base64ToBytes(base64) {
    if (typeof Buffer !== "undefined" && typeof atob === "undefined") {
      return new Uint8Array(Buffer.from(base64, "base64"));
    }
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  }

  function xorTransform(bytes, keyBytes) {
    const out = new Uint8Array(bytes.length);
    const kLen = keyBytes.length;
    for (let i = 0; i < bytes.length; i++) {
      out[i] = bytes[i] ^ keyBytes[i % kLen] ^ ((i * 31 + 17) & 0xff);
    }
    return out;
  }

  function encodePayload(data) {
    const json = typeof data === "string" ? data : JSON.stringify(data);
    const rawBytes =
      typeof TextEncoder !== "undefined"
        ? new TextEncoder().encode(json)
        : new Uint8Array(Buffer.from(json, "utf8"));
    const xored = xorTransform(rawBytes, getKeyBytes());
    return bytesToBase64(xored);
  }

  function decodePayload(encodedStr) {
    if (!encodedStr || typeof encodedStr !== "string") return null;
    const xored = base64ToBytes(encodedStr);
    const rawBytes = xorTransform(xored, getKeyBytes());
    const json =
      typeof TextDecoder !== "undefined"
        ? new TextDecoder("utf-8").decode(rawBytes)
        : Buffer.from(rawBytes).toString("utf8");
    return JSON.parse(json);
  }

  // ================= LỚP 1B: PHÁT HIỆN BOT & HUMAN-INTERACTION HYDRATION =================

  function isInIframe() {
    if (!hasWindow) return false;
    try {
      return window.self !== window.top;
    } catch (_) {
      return true;
    }
  }

  function isLikelyAutomatedBrowser() {
    if (!hasWindow) return true;
    const nav = window.navigator || {};
    if (nav.webdriver === true) return true;

    const ua = String(nav.userAgent || "");
    if (
      /HeadlessChrome|Puppeteer|Playwright|Selenium|PhantomJS|GPTBot|OAI-SearchBot|ChatGPT-User|Google-Extended|ClaudeBot|Claude-Web|anthropic-ai|PerplexityBot|CCBot|Bytespider|Amazonbot|Meta-ExternalAgent|Diffbot|curl|wget|python-requests/i.test(
        ua,
      )
    ) {
      return true;
    }

    if ((window.innerWidth || 0) <= 0 || (window.innerHeight || 0) <= 0) {
      return true;
    }

    return false;
  }

  function flushVerifiedCallbacks() {
    while (verifiedCallbacks.length > 0) {
      const cb = verifiedCallbacks.shift();
      if (typeof cb === "function") {
        try {
          cb();
        } catch (err) {
          if (typeof console !== "undefined" && console.error) {
            console.error("[ContentShield] Hydration callback error:", err);
          }
        }
      }
    }
  }

  function notifyChildFramesUnlock() {
    if (!hasWindow) return;
    const frames = document.querySelectorAll("iframe");
    frames.forEach((frame) => {
      try {
        if (frame.contentWindow) {
          frame.contentWindow.postMessage({ type: "CONTENT_SHIELD_UNLOCK" }, "*");
        }
      } catch (_) {}
    });
  }

  function removeGateOverlay() {
    if (!hasWindow) return;
    const gate = document.getElementById("cs-human-gate");
    if (gate && gate.parentNode) {
      gate.parentNode.removeChild(gate);
    }
    if (document.body) {
      document.body.classList.remove("cs-gate-locked");
    }
  }

  function unlock(reason) {
    if (!hasWindow) {
      verified = true;
      flushVerifiedCallbacks();
      return;
    }

    if (!verified) {
      verified = true;
      try {
        window.sessionStorage.setItem(SESSION_FLAG, "1");
      } catch (_) {}
      removeGateOverlay();
      detachHumanListeners();
      flushVerifiedCallbacks();
    }

    notifyChildFramesUnlock();

    if (reason !== "parent-sync" && isInIframe()) {
      try {
        window.parent.postMessage({ type: "CONTENT_SHIELD_UNLOCK" }, "*");
      } catch (_) {}
    }
  }

  function onHumanVerified(cb) {
    if (typeof cb !== "function") return;
    if (verified) {
      try {
        cb();
      } catch (err) {
        if (typeof console !== "undefined" && console.error) {
          console.error("[ContentShield] Hydration callback error:", err);
        }
      }
      return;
    }
    verifiedCallbacks.push(cb);
  }

  const HUMAN_EVENTS = [
    "pointermove",
    "mousemove",
    "touchstart",
    "keydown",
    "wheel",
    "pointerdown",
  ];

  function handleHumanEvent(e) {
    if (verified) return;
    if (e && e.isTrusted === false) return;
    if (isLikelyAutomatedBrowser()) return;
    unlock("human-interaction");
  }

  function attachHumanListeners() {
    if (!hasWindow || verified) return;
    HUMAN_EVENTS.forEach((evt) => {
      window.addEventListener(evt, handleHumanEvent, {
        capture: true,
        passive: true,
      });
    });
  }

  function detachHumanListeners() {
    if (!hasWindow) return;
    HUMAN_EVENTS.forEach((evt) => {
      window.removeEventListener(evt, handleHumanEvent, {
        capture: true,
        passive: true,
      });
    });
  }

  // ================= LỚP 2: PHÂN MẢNH VĂN BẢN DOM & CHỐNG SAO CHÉP =================

  function renderProtectedText(container, text) {
    if (!hasWindow || !container) return;
    const raw = String(text == null ? "" : text).trim();
    if (!raw) {
      container.textContent = "";
      return;
    }

    const words = raw.split(/\s+/);
    const groupSize = words.length > 14 ? 2 : 1;
    const pieces = [];
    for (let i = 0; i < words.length; i += groupSize) {
      pieces.push({
        idx: pieces.length,
        text: words.slice(i, i + groupSize).join(" "),
      });
    }

    if (pieces.length <= 1) {
      container.textContent = raw;
      return;
    }

    // Hoán vị thứ tự DOM xác định sao cho DOM không theo thứ tự đọc tuyến tính
    const scrambled = pieces.slice();
    for (let i = scrambled.length - 1; i > 0; i--) {
      const swapIdx = (i * 7 + 3) % (i + 1);
      const tmp = scrambled[i];
      scrambled[i] = scrambled[swapIdx];
      scrambled[swapIdx] = tmp;
    }
    if (scrambled.length >= 2 && scrambled[0].idx === 0 && scrambled[1].idx === 1) {
      const tmp = scrambled[0];
      scrambled[0] = scrambled[scrambled.length - 1];
      scrambled[scrambled.length - 1] = tmp;
    }

    const wrap = document.createElement("span");
    wrap.className = "cs-frag-wrap";
    try {
      const align = window.getComputedStyle(container).textAlign;
      if (align === "center") {
        wrap.classList.add("is-center");
      } else if (align === "right" || align === "end") {
        wrap.classList.add("is-end");
      }
    } catch (_) {}

    const frag = document.createDocumentFragment();
    scrambled.forEach((piece, pos) => {
      const span = document.createElement("span");
      span.className = "cs-frag-piece";
      span.style.order = String(piece.idx * 2);
      span.textContent = piece.text;
      frag.appendChild(span);

      if (pos % 2 === 0 && pos < scrambled.length - 1) {
        const decoy = document.createElement("span");
        decoy.className = "cs-decoy";
        decoy.setAttribute("aria-hidden", "true");
        decoy.textContent = DECOY_TOKENS[(pos + piece.idx) % DECOY_TOKENS.length];
        frag.appendChild(decoy);
      }
    });

    wrap.appendChild(frag);
    container.textContent = "";
    container.appendChild(wrap);
  }

  function protectElementTexts(rootEl, selector) {
    if (!hasWindow || !rootEl) return;
    const targets = rootEl.querySelectorAll(
      selector || "h1, h2, h3, h4, p, .hero-cq-main, .slide-title, .slide-desc",
    );
    targets.forEach((el) => {
      if (
        !el ||
        el.dataset.csProtected === "1" ||
        el.closest("#cs-human-gate, #cs-toast, .cs-skip-frag, .select-all") ||
        el.children.length > 0
      ) {
        return;
      }
      const txt = (el.textContent || "").trim();
      if (txt.length < 6) return;
      el.dataset.csProtected = "1";
      renderProtectedText(el, txt);
    });
  }

  function isEditableTarget(target) {
    if (!target || !target.closest) return false;
    return Boolean(
      target.closest(
        'input, textarea, select, [contenteditable="true"], .select-all',
      ),
    );
  }

  function showProtectedToast(customMsg) {
    if (!hasWindow || !document.body) return;
    const now = Date.now();
    if (now - lastToastAt < 1200) return;
    lastToastAt = now;

    let toast = document.getElementById("cs-toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "cs-toast";
      toast.setAttribute("role", "status");
      toast.setAttribute("aria-live", "polite");
      document.body.appendChild(toast);
    }

    toast.textContent = customMsg || TOAST_MESSAGE;
    toast.classList.add("is-visible");

    if (toastHideTimer) clearTimeout(toastHideTimer);
    toastHideTimer = setTimeout(() => {
      if (toast) toast.classList.remove("is-visible");
    }, 2200);
  }

  function installDeterrenceListeners() {
    if (!hasWindow) return;

    document.addEventListener(
      "contextmenu",
      (e) => {
        if (isEditableTarget(e.target)) return;
        e.preventDefault();
        showProtectedToast();
      },
      true,
    );

    ["copy", "cut"].forEach((evtName) => {
      document.addEventListener(
        evtName,
        (e) => {
          if (isEditableTarget(e.target)) return;
          e.preventDefault();
          showProtectedToast();
        },
        true,
      );
    });

    document.addEventListener(
      "keydown",
      (e) => {
        const key = String(e.key || "");
        const lower = key.toLowerCase();
        const mod = e.ctrlKey || e.metaKey;

        // Tuyệt đối không chặn phím điều hướng, game (Space, mũi tên) hoặc điều khiển 3D (WASD, V, E, F, T, Shift)
        if (
          key === "F12" ||
          (mod && lower === "u") ||
          (mod && lower === "s") ||
          (mod && e.shiftKey && (lower === "i" || lower === "j" || lower === "c"))
        ) {
          e.preventDefault();
          e.stopPropagation();
          showProtectedToast();
          return;
        }

        if (mod && (lower === "c" || lower === "a" || lower === "x")) {
          if (isEditableTarget(e.target)) return;
          e.preventDefault();
          e.stopPropagation();
          showProtectedToast();
        }
      },
      true,
    );
  }

  // ================= LỚP 3: CSS, MICRO-GRID & GATE UI =================

  function buildMicroGridSvgDataUri() {
    const svg =
      '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">' +
      '<path d="M16 0L0 16M-4 4L4 -4M12 20L20 12M0 8H16M8 0V16" stroke="#64748b" stroke-width="0.65" fill="none"/>' +
      '<circle cx="4" cy="4" r="0.55" fill="#d97706"/>' +
      '<circle cx="12" cy="12" r="0.55" fill="#64748b"/>' +
      "</svg>";
    return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
  }

  function injectShieldStylesAndOverlays() {
    if (!hasWindow || document.getElementById("cs-shield-styles")) return;

    const gridUri = buildMicroGridSvgDataUri();

    const style = document.createElement("style");
    style.id = "cs-shield-styles";
    style.textContent = `
      html, body, body *:not(input):not(textarea):not(select):not([contenteditable="true"]):not(.select-all) {
        -webkit-user-select: none;
        user-select: none;
      }
      input, textarea, select, [contenteditable="true"], .select-all, .select-all * {
        -webkit-user-select: text !important;
        user-select: text !important;
      }
      .cs-frag-wrap {
        position: relative;
        display: inline-flex;
        flex-wrap: wrap;
        align-items: baseline;
        column-gap: 0.27em;
        row-gap: 0;
        max-width: 100%;
      }
      .cs-frag-wrap.is-center {
        justify-content: center;
      }
      .cs-frag-wrap.is-end {
        justify-content: flex-end;
      }
      .cs-frag-piece {
        display: inline-block;
        white-space: normal;
      }
      .cs-decoy {
        position: absolute !important;
        width: 0 !important;
        height: 0 !important;
        overflow: hidden !important;
        opacity: 0 !important;
        pointer-events: none !important;
        margin: 0 !important;
        padding: 0 !important;
        font-size: 0 !important;
        line-height: 0 !important;
      }
      #cs-micro-grid {
        position: fixed;
        inset: 0;
        z-index: 9990;
        pointer-events: none;
        opacity: 0.028;
        background-image: ${gridUri};
        background-repeat: repeat;
        background-size: 16px 16px;
      }
      body.cs-overlay-suspended #cs-micro-grid {
        display: none;
      }
      #cs-toast {
        position: fixed;
        left: 50%;
        bottom: 24px;
        transform: translate(-50%, 14px);
        z-index: 10020;
        pointer-events: none;
        opacity: 0;
        padding: 10px 18px;
        border-radius: 9999px;
        background: rgba(15, 23, 42, 0.94);
        color: #fef3c7;
        border: 1px solid rgba(245, 158, 11, 0.45);
        font-family: system-ui, -apple-system, sans-serif;
        font-size: 13px;
        font-weight: 700;
        letter-spacing: 0.01em;
        box-shadow: 0 12px 28px rgba(0, 0, 0, 0.28);
        white-space: nowrap;
        max-width: calc(100vw - 32px);
        overflow: hidden;
        text-overflow: ellipsis;
        transition: opacity 0.18s ease, transform 0.18s ease;
      }
      #cs-toast.is-visible {
        opacity: 1;
        transform: translate(-50%, 0);
      }
      #cs-human-gate {
        position: fixed;
        inset: 0;
        z-index: 10010;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
        background: radial-gradient(circle at 50% 25%, rgba(30, 41, 59, 0.96), rgba(9, 13, 22, 0.98));
        color: #f8fafc;
        font-family: system-ui, -apple-system, sans-serif;
      }
      .cs-gate-card {
        width: min(100%, 460px);
        border-radius: 24px;
        padding: 28px 24px;
        background: linear-gradient(160deg, rgba(30, 41, 59, 0.96), rgba(15, 23, 42, 0.98));
        border: 1px solid rgba(245, 158, 11, 0.35);
        box-shadow: 0 24px 54px rgba(0, 0, 0, 0.48);
        text-align: center;
      }
      .cs-gate-badge {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 48px;
        height: 48px;
        border-radius: 14px;
        background: #df7a28;
        color: #ffffff;
        font-weight: 900;
        font-size: 20px;
        margin-bottom: 14px;
        border: 1px solid #f59e0b;
      }
      .cs-gate-title {
        margin: 0 0 8px;
        font-size: 18px;
        font-weight: 800;
        line-height: 1.35;
        color: #ffffff;
      }
      .cs-gate-desc {
        margin: 0 0 20px;
        font-size: 13.5px;
        line-height: 1.55;
        color: #cbd5e1;
      }
      .cs-gate-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-height: 46px;
        padding: 10px 22px;
        border-radius: 14px;
        border: none;
        background: linear-gradient(135deg, #f59e0b, #df7a28);
        color: #ffffff;
        font-size: 14px;
        font-weight: 800;
        cursor: pointer;
        box-shadow: 0 8px 22px rgba(223, 122, 40, 0.35);
        transition: transform 0.15s ease, filter 0.15s ease;
      }
      .cs-gate-btn:hover {
        filter: brightness(1.06);
        transform: translateY(-1px);
      }
      .cs-gate-btn:active {
        transform: translateY(0);
      }
    `;
    document.head.appendChild(style);

    const mountOverlays = () => {
      if (!document.body) return;
      if (!document.getElementById("cs-micro-grid")) {
        const grid = document.createElement("div");
        grid.id = "cs-micro-grid";
        grid.setAttribute("aria-hidden", "true");
        document.body.appendChild(grid);
      }
      if (!verified && shieldMode !== "passive" && !isInIframe()) {
        mountHumanGateOverlay();
      }
    };

    if (document.body) {
      mountOverlays();
    } else {
      document.addEventListener("DOMContentLoaded", mountOverlays, { once: true });
    }
  }

  function mountHumanGateOverlay() {
    if (!hasWindow || verified || !document.body) return;
    if (document.getElementById("cs-human-gate")) return;

    document.body.classList.add("cs-gate-locked");
    const gate = document.createElement("div");
    gate.id = "cs-human-gate";
    gate.setAttribute("role", "dialog");
    gate.setAttribute("aria-modal", "true");
    gate.setAttribute("aria-label", gateTitle);

    const card = document.createElement("div");
    card.className = "cs-gate-card";

    const badge = document.createElement("div");
    badge.className = "cs-gate-badge";
    badge.textContent = "8";

    const title = document.createElement("h2");
    title.className = "cs-gate-title";
    title.textContent = gateTitle;

    const desc = document.createElement("p");
    desc.className = "cs-gate-desc";
    desc.textContent = gateSubtitle;

    const btn = document.createElement("button");
    btn.id = "cs-gate-unlock-btn";
    btn.type = "button";
    btn.className = "cs-gate-btn";
    btn.textContent = gateButtonLabel;
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      unlock("button");
    });

    card.appendChild(badge);
    card.appendChild(title);
    card.appendChild(desc);
    card.appendChild(btn);
    gate.appendChild(card);
    document.body.appendChild(gate);
  }

  function initRuntime() {
    if (!hasWindow || runtimeInitialized) return;
    runtimeInitialized = true;

    injectShieldStylesAndOverlays();
    installDeterrenceListeners();

    window.addEventListener("message", (e) => {
      if (!e || !e.data || e.data.type !== "CONTENT_SHIELD_UNLOCK") return;
      unlock("parent-sync");
    });

    if (shieldMode === "passive") {
      verified = true;
      flushVerifiedCallbacks();
      return;
    }

    if (shieldMode === "auto-human" && !isLikelyAutomatedBrowser()) {
      unlock("auto-human");
      return;
    }

    if (isInIframe()) {
      try {
        if (
          window.parent &&
          window.parent.ContentShield &&
          typeof window.parent.ContentShield.isVerified === "function" &&
          window.parent.ContentShield.isVerified()
        ) {
          unlock("parent-sync");
          return;
        }
      } catch (_) {}
    }

    let hasSessionFlag = false;
    try {
      hasSessionFlag = window.sessionStorage.getItem(SESSION_FLAG) === "1";
    } catch (_) {}

    if (hasSessionFlag && !isLikelyAutomatedBrowser()) {
      unlock("session");
      return;
    }

    attachHumanListeners();
  }

  if (hasWindow) {
    initRuntime();
  }

  return {
    encodePayload,
    decodePayload,
    isLikelyAutomatedBrowser,
    isVerified: () => verified,
    onHumanVerified,
    unlock,
    renderProtectedText,
    protectElementTexts,
    showProtectedToast,
    setOverlaySuspended: (suspended) => {
      if (!hasWindow || !document.body) return;
      document.body.classList.toggle("cs-overlay-suspended", Boolean(suspended));
    },
  };
});
