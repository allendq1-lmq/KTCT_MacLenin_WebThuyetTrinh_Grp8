// js/app.js - Điều hướng chuyển đổi 3 Tabs chính, Fullscreen & Chuyển tiếp phím vào Bảo tàng 3D
document.addEventListener("DOMContentLoaded", () => {
  const tabButtons = document.querySelectorAll(".nav-tab");
  const tabContents = document.querySelectorAll(".tab-content");
  const mainContainer = document.getElementById("main-container");
  const btnFullscreen = document.getElementById("btn-fullscreen-museum");
  const labelFullscreen = document.getElementById("label-fullscreen-btn");
  const museumWrapper = document.getElementById("museum-wrapper");

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

    // Nếu đang bật Fullscreen của phần tử con (ví dụ khung Bảo tàng 3D), tự động thoát trước để không che khuất bảng QR
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

    if (mainContainer) {
      if (targetTab === "idea2") {
        mainContainer.classList.add("museum-mode-main");
      } else {
        mainContainer.classList.remove("museum-mode-main");
      }
    }

    if (btnFullscreen) {
      btnFullscreen.style.display = targetTab === "idea2" ? "flex" : "none";
    }

    // Khi bấm Tab 3D, tự động điều chỉnh khung hình và gán focus vào iframe
    if (targetTab === "idea2") {
      setTimeout(() => {
        const iframe = document.getElementById("museum-frame");
        if (iframe && iframe.contentWindow) {
          if (
            iframe.contentWindow.MuseumEngine &&
            iframe.contentWindow.MuseumEngine.onWindowResize
          ) {
            iframe.contentWindow.MuseumEngine.onWindowResize();
          } else {
            iframe.contentWindow.dispatchEvent(new Event("resize"));
          }
          iframe.contentWindow.focus();
        }
      }, 60);
    }
  }

  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () =>
      switchTab(btn.getAttribute("data-tab")),
    );
  });

  // Xử lý Toàn màn hình (Fullscreen) để trình chiếu trên lớp
  function toggleMuseumFullscreen() {
    const targetEl = museumWrapper || document.documentElement;
    if (!document.fullscreenElement) {
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

  document.addEventListener("fullscreenchange", () => {
    const isFs = !!document.fullscreenElement;
    if (labelFullscreen) {
      labelFullscreen.textContent = isFs ? "Thoát Fullscreen" : "Toàn Màn Hình";
    }
    const iframe = document.getElementById("museum-frame");
    if (iframe && iframe.contentWindow) {
      setTimeout(() => {
        if (
          iframe.contentWindow.MuseumEngine &&
          iframe.contentWindow.MuseumEngine.onWindowResize
        ) {
          iframe.contentWindow.MuseumEngine.onWindowResize();
        }
        iframe.contentWindow.focus();
      }, 100);
    }
  });

  // Cho phép iframe gọi hàm toggleMuseumFullscreen
  window.toggleMuseumFullscreen = toggleMuseumFullscreen;

  // Tự động chuyển tiếp các phím W-A-S-D, Mũi tên, Space, Shift từ trang ngoài vào iframe 3D
  window.addEventListener("keydown", (e) => {
    if (isQrModalOpen()) {
      if (e.key === "Escape") {
        e.preventDefault();
        closeQrModal();
      }
      return;
    }

    const idea2 = document.getElementById("section-idea2");
    if (idea2 && !idea2.classList.contains("hidden")) {
      const k = e.key.toLowerCase();
      if (k === "f" && !e.ctrlKey && !e.metaKey && !e.altKey) {
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
        const iframe = document.getElementById("museum-frame");
        if (iframe && iframe.contentWindow) {
          iframe.contentWindow.dispatchEvent(
            new KeyboardEvent("keydown", { key: e.key, code: e.code }),
          );
        }
      }
    }
  });

  window.addEventListener("keyup", (e) => {
    const idea2 = document.getElementById("section-idea2");
    if (idea2 && !idea2.classList.contains("hidden")) {
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
        const iframe = document.getElementById("museum-frame");
        if (iframe && iframe.contentWindow) {
          iframe.contentWindow.dispatchEvent(
            new KeyboardEvent("keyup", { key: e.key, code: e.code }),
          );
        }
      }
    }
  });

  // Mặc định mở tab Bảo Tàng 3D (idea2)
  switchTab("idea2");

  // Khởi động module Game Thể Chế
  if (typeof ReignsGame !== "undefined" && ReignsGame.init) {
    ReignsGame.init();
  }
});
