// js/app.js - Điều hướng chuyển đổi 4 Tabs chính (Nội Dung, Bảo Tàng 3D, Game Thể Chế, Nhóm Tác Giả), Fullscreen & Cầu nối phím tắt
document.addEventListener("DOMContentLoaded", () => {
  const tabButtons = document.querySelectorAll(".nav-tab");
  const tabContents = document.querySelectorAll(".tab-content");
  const mainContainer = document.getElementById("main-container");
  const btnFullscreen = document.getElementById("btn-fullscreen-museum");
  const labelFullscreen = document.getElementById("label-fullscreen-btn");
  const iconFullscreenEnter = document.getElementById("icon-fullscreen-enter");
  const iconFullscreenExit = document.getElementById("icon-fullscreen-exit");
  let currentActiveTab = "content";

  function isDesktopViewport() {
    return window.innerWidth >= 768;
  }

  function getFullscreenElement() {
    return (
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      null
    );
  }

  function isFullscreenSupported() {
    const rootEl = document.documentElement;
    return !!(
      rootEl &&
      (rootEl.requestFullscreen || rootEl.webkitRequestFullscreen)
    );
  }

  function updateFullscreenButtonVisibility() {
    if (!btnFullscreen) return;
    const isFullBleedTab =
      currentActiveTab === "content" || currentActiveTab === "idea2";
    const shouldShow =
      (isFullBleedTab || !!getFullscreenElement()) &&
      isDesktopViewport() &&
      isFullscreenSupported();
    // Không ép inline "flex" để class responsive CSS (`hidden md:flex`) và @media (max-width: 767px) hoạt động chuẩn
    btnFullscreen.style.display = shouldShow ? "" : "none";
  }

  function syncFullscreenButtonState() {
    const isFs = !!getFullscreenElement();
    if (labelFullscreen) {
      labelFullscreen.textContent = isFs
        ? "Thoát Toàn Màn Hình"
        : "Toàn Màn Hình";
    }
    if (btnFullscreen) {
      btnFullscreen.setAttribute("aria-pressed", isFs ? "true" : "false");
      btnFullscreen.title = isFs
        ? "Thoát Toàn Màn Hình (Phím F / Esc)"
        : "Toàn màn hình trình chiếu (Phím F)";
    }
    if (iconFullscreenEnter) {
      iconFullscreenEnter.classList.toggle("hidden", isFs);
    }
    if (iconFullscreenExit) {
      iconFullscreenExit.classList.toggle("hidden", !isFs);
    }
  }

  // Thành phần Modal Mã QR Toàn Màn Hình
  const btnQrModal = document.getElementById("btn-qr-modal");
  const qrModal = document.getElementById("qr-modal");
  const qrContainer = document.getElementById("qr-code-container");
  const btnCloseQrModal = document.getElementById("btn-close-qr-modal");
  const QR_TARGET_URL =
    "https://allendq1-lmq.github.io/KTCT_MacLenin_WebThuyetTrinh_Grp8/";
  let qrRendered = false;

  function renderQrCodeIfNeeded() {
    if (qrRendered || !qrContainer) return;
    if (typeof QRCode !== "undefined") {
      qrContainer.innerHTML = "";
      new QRCode(qrContainer, {
        text: QR_TARGET_URL,
        width: 600,
        height: 600,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H,
      });
      qrRendered = true;
    }
  }

  function isQrModalOpen() {
    return qrModal && !qrModal.classList.contains("hidden");
  }

  async function openQrModal() {
    if (!qrModal) return;

    // Nếu đang bật Fullscreen của phần tử con, tự động thoát trước để không che khuất bảng QR
    if (document.fullscreenElement && document.exitFullscreen) {
      try {
        await document.exitFullscreen();
      } catch (_) {}
    } else if (
      document.webkitFullscreenElement &&
      document.webkitExitFullscreen
    ) {
      try {
        document.webkitExitFullscreen();
      } catch (_) {}
    }

    renderQrCodeIfNeeded();
    qrModal.classList.remove("hidden");
    qrModal.classList.add("flex");
    document.body.style.overflow = "hidden";
    if (btnQrModal) {
      btnQrModal.setAttribute("aria-expanded", "true");
    }
    if (btnCloseQrModal) {
      btnCloseQrModal.focus();
    }
  }

  function closeQrModal() {
    if (!qrModal || qrModal.classList.contains("hidden")) return;
    qrModal.classList.add("hidden");
    qrModal.classList.remove("flex");
    document.body.style.overflow = "";
    if (btnQrModal) {
      btnQrModal.setAttribute("aria-expanded", "false");
      btnQrModal.focus();
    }
  }

  if (btnQrModal) {
    btnQrModal.addEventListener("click", () => {
      if (isQrModalOpen()) {
        closeQrModal();
      } else {
        openQrModal();
      }
    });
  }

  if (btnCloseQrModal) {
    btnCloseQrModal.addEventListener("click", closeQrModal);
  }

  function switchTab(targetTab) {
    currentActiveTab = targetTab;

    tabButtons.forEach((btn) => {
      if (btn.getAttribute("data-tab") === targetTab) {
        btn.classList.add("active");
        btn.classList.remove("text-slate-300");
      } else {
        btn.classList.remove("active");
        btn.classList.add("text-slate-300");
      }
    });

    tabContents.forEach((content) => {
      if (content.id === `section-${targetTab}`) {
        content.classList.remove("hidden");
        content.classList.add("block");
      } else {
        content.classList.add("hidden");
        content.classList.remove("block");
      }
    });

    if (targetTab !== "game" && window.ReignsGame) {
      if (window.ReignsGame.stopAllSounds) window.ReignsGame.stopAllSounds();
      if (window.ReignsGame.stopConfetti) window.ReignsGame.stopConfetti();
    }

    const isFullBleedTab = targetTab === "content" || targetTab === "idea2";

    if (mainContainer) {
      if (isFullBleedTab) {
        mainContainer.classList.add("museum-mode-main");
      } else {
        mainContainer.classList.remove("museum-mode-main");
      }
    }

    updateFullscreenButtonVisibility();

    if (targetTab === "content") {
      setTimeout(() => {
        const iframe = document.getElementById("presentation-frame");
        if (iframe && iframe.contentWindow) {
          try {
            iframe.contentWindow.dispatchEvent(new Event("resize"));
          } catch (_) {}
          try {
            iframe.contentWindow.focus();
          } catch (_) {}
        }
      }, 60);
    } else if (targetTab === "idea2") {
      setTimeout(() => {
        const iframe = document.getElementById("museum-frame");
        if (iframe && iframe.contentWindow) {
          try {
            if (
              iframe.contentWindow.MuseumEngine &&
              iframe.contentWindow.MuseumEngine.onWindowResize
            ) {
              iframe.contentWindow.MuseumEngine.onWindowResize();
            } else {
              iframe.contentWindow.dispatchEvent(new Event("resize"));
            }
          } catch (_) {}
          try {
            iframe.contentWindow.focus();
          } catch (_) {}
        }
      }, 60);
    }
  }

  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () =>
      switchTab(btn.getAttribute("data-tab")),
    );
  });

  // Xử lý Toàn màn hình trên phần tử gốc để giữ nguyên thanh header và nút Thoát Toàn Màn Hình ở đúng vị trí trên desktop
  function toggleMuseumFullscreen() {
    if (!isFullscreenSupported()) return;
    const targetEl = document.documentElement;

    if (!getFullscreenElement()) {
      if (targetEl.requestFullscreen) {
        targetEl.requestFullscreen().catch(() => {});
      } else if (targetEl.webkitRequestFullscreen) {
        targetEl.webkitRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    }
  }

  if (btnFullscreen) {
    btnFullscreen.addEventListener("click", toggleMuseumFullscreen);
  }

  function handleFullscreenChange() {
    syncFullscreenButtonState();
    updateFullscreenButtonVisibility();

    const activeIframe =
      currentActiveTab === "content"
        ? document.getElementById("presentation-frame")
        : document.getElementById("museum-frame");

    if (activeIframe && activeIframe.contentWindow) {
      setTimeout(() => {
        try {
          if (
            activeIframe.contentWindow.MuseumEngine &&
            activeIframe.contentWindow.MuseumEngine.onWindowResize
          ) {
            activeIframe.contentWindow.MuseumEngine.onWindowResize();
          } else {
            activeIframe.contentWindow.dispatchEvent(new Event("resize"));
          }
        } catch (_) {}
        try {
          activeIframe.contentWindow.focus();
        } catch (_) {}
      }, 100);
    }
  }

  ["fullscreenchange", "webkitfullscreenchange"].forEach((evt) => {
    document.addEventListener(evt, handleFullscreenChange);
  });
  window.addEventListener("resize", updateFullscreenButtonVisibility);

  // Cho phép iframe gọi hàm toggleMuseumFullscreen (trực tiếp hoặc qua postMessage)
  window.toggleMuseumFullscreen = toggleMuseumFullscreen;
  window.addEventListener("message", (e) => {
    if (e.data && e.data.type === "TOGGLE_FULLSCREEN") {
      toggleMuseumFullscreen();
    }
  });

  function forwardKeyToIframe(iframeId, eventType, key, code) {
    const iframe = document.getElementById(iframeId);
    if (!iframe || !iframe.contentWindow) return;
    try {
      iframe.contentWindow.dispatchEvent(
        new KeyboardEvent(eventType, { key, code }),
      );
    } catch (_) {
      try {
        iframe.contentWindow.postMessage(
          { type: "PARENT_KEY_EVENT", eventType, key, code },
          "*",
        );
      } catch (__) {}
    }
  }

  // Tự động chuyển tiếp phím tắt từ cửa sổ ngoài vào đúng iframe đang mở
  window.addEventListener("keydown", (e) => {
    if (isQrModalOpen()) {
      if (e.key === "Escape") {
        e.preventDefault();
        closeQrModal();
      }
      return;
    }

    const sectionContent = document.getElementById("section-content");
    if (sectionContent && !sectionContent.classList.contains("hidden")) {
      const k = e.key.toLowerCase();
      if (k === "f" && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        toggleMuseumFullscreen();
        return;
      }
      if (["arrowleft", "arrowright", " "].includes(k)) {
        e.preventDefault();
        forwardKeyToIframe("presentation-frame", "keydown", e.key, e.code);
      }
      return;
    }

    const sectionIdea2 = document.getElementById("section-idea2");
    if (sectionIdea2 && !sectionIdea2.classList.contains("hidden")) {
      const k = e.key.toLowerCase();
      if (k === "f" && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        toggleMuseumFullscreen();
        return;
      }
      if (
        [
          "w",
          "a",
          "s",
          "d",
          "arrowup",
          "arrowdown",
          "arrowleft",
          "arrowright",
          " ",
          "escape",
          "shift",
        ].includes(k)
      ) {
        if (
          ["arrowup", "arrowdown", "arrowleft", "arrowright", " "].includes(k)
        ) {
          e.preventDefault();
        }
        forwardKeyToIframe("museum-frame", "keydown", e.key, e.code);
      }
    }
  });

  window.addEventListener("keyup", (e) => {
    const sectionIdea2 = document.getElementById("section-idea2");
    if (sectionIdea2 && !sectionIdea2.classList.contains("hidden")) {
      const k = e.key.toLowerCase();
      if (
        [
          "w",
          "a",
          "s",
          "d",
          "arrowup",
          "arrowdown",
          "arrowleft",
          "arrowright",
          " ",
          "shift",
        ].includes(k)
      ) {
        forwardKeyToIframe("museum-frame", "keyup", e.key, e.code);
      }
    }
  });

  // Mặc định mở tab Nội Dung (content)
  switchTab("content");

  // Khởi động module Game Thể Chế
  if (typeof ReignsGame !== "undefined" && ReignsGame.init) {
    ReignsGame.init();
  }
});
