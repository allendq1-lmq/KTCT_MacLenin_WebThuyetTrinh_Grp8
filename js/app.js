// js/app.js - Điều hướng chuyển đổi các Tabs chính & Chuyển tiếp phím WASD
document.addEventListener("DOMContentLoaded", () => {
  const tabButtons = document.querySelectorAll(".nav-tab");
  const tabContents = document.querySelectorAll(".tab-content");

  function switchTab(targetTab) {
    tabButtons.forEach((btn) => {
      if (btn.getAttribute("data-tab") === targetTab) {
        btn.classList.add("active", "text-white");
        btn.classList.remove("text-slate-600");
      } else {
        btn.classList.remove("active", "text-white");
        btn.classList.add("text-slate-600");
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

  // Tự động chuyển tiếp các phím W-A-S-D và Mũi tên từ trang ngoài vào iframe 3D
  window.addEventListener("keydown", (e) => {
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
        ].includes(k)
      ) {
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

  // Khởi động các module Tòa án & Game Reigns
  if (typeof CourtModule !== "undefined" && CourtModule.init) {
    CourtModule.init();
  }
  if (typeof ReignsGame !== "undefined" && ReignsGame.init) {
    ReignsGame.init();
  }
});
