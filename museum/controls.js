// museum/controls.js - Điều khiển Chế độ Thuyết trình Toàn màn hình & Camera 3D Shift-Lock chuẩn Roblox (PC + Mobile đa chạm)
window.MuseumControls = (() => {
  let raycaster, mouse;
  let currentMode = "presentation"; // "presentation" | "explore"
  let currentSlideIndex = 0;
  let currentExhibitData = null;

  // Trạng thái xoay góc nhìn chuột PC (Shift-Lock / Kéo chuột trái-phải)
  let isMouseDragging = false;
  let lastMousePos = { x: 0, y: 0 };
  let totalMouseDragDist = 0;

  // Trạng thái xoay góc nhìn đa chạm Mobile (nửa phải màn hình)
  let activeLookTouchId = null;
  let lastTouchPos = { x: 0, y: 0 };
  let totalTouchDragDist = 0;

  const roomNames = {
    1: "Phòng 1: Tổng quan KTTT ĐHXHCN",
    2: "Phòng 2: 5 Đặc trưng cơ bản",
    3: "Phòng 3: Giới hạn CNTB & Giải pháp",
  };

  function getPlaylist() {
    return (window.MuseumData && window.MuseumData.playlist) || [];
  }

  function syncRoomButtons(roomNumber) {
    const roomButtons = document.querySelectorAll(".room-btn");
    roomButtons.forEach((b) => {
      const r = parseInt(b.getAttribute("data-room"), 10);
      if (r === roomNumber) {
        b.classList.add("active");
        b.classList.remove("text-slate-300");
      } else {
        b.classList.remove("active");
        b.classList.add("text-slate-300");
      }
    });
  }

  function updateHUD(exhibit) {
    if (!exhibit) return;
    currentExhibitData = exhibit;

    const hudBadge = document.getElementById("hud-badge");
    const hudTitle = document.getElementById("hud-title");
    const hudDesc = document.getElementById("hud-desc");
    const hudBody = document.getElementById("hud-content-body");
    const hudToggleBtn = document.getElementById("hud-toggle-btn");

    if (hudBadge)
      hudBadge.textContent = exhibit.badge || "Hiện vật triển lãm";
    if (hudTitle) hudTitle.textContent = exhibit.title || "";
    if (hudDesc) hudDesc.textContent = exhibit.desc || "";

    if (hudBody && hudBody.classList.contains("hidden")) {
      hudBody.classList.remove("hidden");
      if (hudToggleBtn) hudToggleBtn.textContent = "−";
    }
  }

  function openDetailDrawer(exhibit) {
    const data = exhibit || currentExhibitData;
    if (!data) return;

    if (document.pointerLockElement && document.exitPointerLock) {
      document.exitPointerLock();
    }

    const modal = document.getElementById("detail-drawer-modal");
    const badge = document.getElementById("drawer-badge");
    const title = document.getElementById("drawer-title");
    const subtitle = document.getElementById("drawer-subtitle");
    const body = document.getElementById("drawer-body");

    if (badge) badge.textContent = data.badge || roomNames[data.room] || "";
    if (title) title.textContent = data.title || "";
    if (subtitle) subtitle.textContent = data.subtitle || "";
    if (body) {
      body.innerHTML =
        data.fullHtml ||
        `<p class="text-slate-200 leading-relaxed">${data.desc || ""}</p>`;
      body.scrollTop = 0;
    }
    if (modal) modal.classList.remove("hidden");
  }

  function closeDetailDrawer() {
    const modal = document.getElementById("detail-drawer-modal");
    if (modal) modal.classList.add("hidden");
  }

  function renderExploreQuickNav(roomNumber) {
    const container = document.getElementById("explore-quick-nav");
    if (!container) return;
    const list = getPlaylist().filter((item) => item.room === roomNumber);
    container.innerHTML = list
      .map(
        (item) => `
      <button
        type="button"
        data-exhibit-id="${item.id}"
        class="explore-jump-btn pointer-events-auto px-2.5 py-1.5 text-xs font-bold rounded-lg border border-slate-700 bg-slate-900/90 text-slate-200 hover:border-amber-400 hover:text-amber-300 transition shadow"
      >
        ${item.sectionCode}: ${item.title.replace(/^[0-9a-z.]+\s*/i, "").slice(0, 22)}
      </button>
    `,
      )
      .join("");

    container.querySelectorAll(".explore-jump-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-exhibit-id");
        const idx = getPlaylist().findIndex((x) => x.id === id);
        if (idx !== -1) {
          focusExhibitByIndex(idx);
        }
      });
    });
  }

  // Render danh sách thẻ ý chính nổi bật cho giao diện trình chiếu toàn màn hình
  function renderPresentationSlideUI(slide, clampedIdx, totalSlides) {
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

    if (badgeEl)
      badgeEl.textContent = slide.badge || `Mục ${slide.sectionCode}`;
    if (roomTagEl) roomTagEl.textContent = roomNames[slide.room] || "";
    if (titleEl) titleEl.textContent = slide.title || "";
    if (subtitleEl) subtitleEl.textContent = slide.subtitle || "";
    if (descEl) descEl.textContent = slide.desc || "";

    if (counterEl) {
      counterEl.textContent = `Slide ${clampedIdx + 1} / ${totalSlides}`;
    }
    if (selectEl) {
      selectEl.value = String(clampedIdx);
    }
    if (progressEl && totalSlides > 0) {
      progressEl.style.width = `${((clampedIdx + 1) / totalSlides) * 100}%`;
    }

    // Hiển thị các thẻ ý chính (key points) rõ ràng, chữ lớn chuẩn máy chiếu
    if (keyPointsEl) {
      const lines = Array.isArray(slide.lines) ? slide.lines : [];
      keyPointsEl.innerHTML = lines
        .map((line, i) => {
          const cleanText = String(line).replace(/^[•\-\s]+/, "");
          return `
            <div class="pres-key-card flex items-start gap-3.5 p-3.5 sm:p-4 rounded-xl bg-slate-950 border border-slate-800 shadow-sm">
              <span class="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 font-black text-base flex items-center justify-center shrink-0 mt-0.5">
                ${i + 1}
              </span>
              <p class="text-base sm:text-lg md:text-xl font-semibold text-slate-100 leading-snug">
                ${cleanText}
              </p>
            </div>
          `;
        })
        .join("");
    }

    // Nếu là Slide Bảng so sánh 6 tiêu chí ở Phòng 3 (r3-table), mở rộng toàn chiều ngang để bảng 6 tiêu chí hiển thị cực lớn
    if (summaryCol && detailCol) {
      if (slide.id === "r3-table") {
        summaryCol.className =
          "lg:col-span-12 bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-lg space-y-4";
        detailCol.className =
          "lg:col-span-12 bg-slate-900 border-2 border-amber-500/50 rounded-2xl p-5 sm:p-7 shadow-xl";
      } else {
        summaryCol.className =
          "lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-lg space-y-4";
        detailCol.className =
          "lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-7 shadow-lg";
      }
    }

    if (bodyEl) {
      let htmlContent = slide.fullHtml || `<p>${slide.desc || ""}</p>`;

      // Ở các slide thuộc Phòng 3 (ngoài r3-table), đính kèm nút mở nhanh hoặc hiển thị Bảng đối chiếu 6 tiêu chí
      if (
        slide.room === 3 &&
        slide.id !== "r3-table" &&
        window.MuseumData &&
        window.MuseumData.room3 &&
        window.MuseumData.room3.comparisonTableHtml
      ) {
        htmlContent += `
          <div class="mt-6 pt-5 border-t border-slate-800">
            <div class="flex flex-wrap items-center justify-between gap-2 mb-3">
              <h4 class="text-amber-400 font-extrabold text-lg sm:text-xl">
                📊 Bảng So Sánh Đối Chiếu 6 Tiêu Chí (KTTT TBCN vs. KTTT ĐHXHCN Việt Nam)
              </h4>
              <span class="text-xs font-bold uppercase px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                Tổng hợp Phòng 3
              </span>
            </div>
            ${window.MuseumData.room3.comparisonTableHtml}
          </div>
        `;
      }

      bodyEl.innerHTML = htmlContent;
    }

    if (mainScrollEl) {
      mainScrollEl.scrollTop = 0;
    }
  }

  // Đồng bộ vị trí nhân vật sinh viên UIT & camera Shift-Lock ở chế độ ngầm khi chuyển slide
  function focusExhibitByIndex(idx) {
    const playlist = getPlaylist();
    if (!playlist.length) return;
    const clampedIdx = (idx + playlist.length) % playlist.length;
    currentSlideIndex = clampedIdx;
    const slide = playlist[clampedIdx];
    currentExhibitData = slide;

    if (
      window.MuseumEngine &&
      window.MuseumEngine.getCurrentRoom() !== slide.room
    ) {
      window.MuseumEngine.setRoom(slide.room);
      syncRoomButtons(slide.room);
      renderExploreQuickNav(slide.room);
    }

    // Đồng bộ ngầm nhân vật sinh viên UIT và camera Shift-Lock tới đúng hiện vật tương ứng trong 3D
    if (slide.camPos && slide.lookPos && window.MuseumEngine) {
      window.MuseumEngine.syncAvatarToExhibit(
        slide.camPos.x,
        slide.camPos.y,
        slide.camPos.z,
        slide.lookPos.x,
        slide.lookPos.y,
        slide.lookPos.z,
      );
    }

    renderPresentationSlideUI(slide, clampedIdx, playlist.length);
    updateHUD(slide);
  }

  function setMode(mode) {
    currentMode = mode;
    const btnPres = document.getElementById("mode-btn-presentation");
    const btnExplore = document.getElementById("mode-btn-explore");
    const presPanel = document.getElementById("presentation-panel");
    const hud = document.getElementById("museum-hud");
    const quickNav = document.getElementById("explore-quick-nav");
    const dpad = document.getElementById("virtual-dpad");

    if (mode === "presentation") {
      if (document.pointerLockElement && document.exitPointerLock) {
        document.exitPointerLock();
      }
      if (btnPres) {
        btnPres.classList.add("active");
        btnPres.classList.remove("text-slate-300");
      }
      if (btnExplore) {
        btnExplore.classList.remove("active");
        btnExplore.classList.add("text-slate-300");
      }
      if (presPanel) presPanel.classList.remove("hidden");
      if (hud) hud.classList.add("hidden");
      if (quickNav) quickNav.classList.add("hidden");
      if (dpad) dpad.style.display = "none";
      closeDetailDrawer();
      focusExhibitByIndex(currentSlideIndex);
    } else {
      if (btnExplore) {
        btnExplore.classList.add("active");
        btnExplore.classList.remove("text-slate-300");
      }
      if (btnPres) {
        btnPres.classList.remove("active");
        btnPres.classList.add("text-slate-300");
      }
      if (presPanel) presPanel.classList.add("hidden");
      if (hud) hud.classList.remove("hidden");
      if (quickNav) quickNav.classList.remove("hidden");
      if (dpad) dpad.style.display = "flex";
      const room = window.MuseumEngine
        ? window.MuseumEngine.getCurrentRoom()
        : 1;
      renderExploreQuickNav(room);
      if (!currentExhibitData && getPlaylist().length > 0) {
        updateHUD(getPlaylist()[currentSlideIndex]);
      }
      if (window.MuseumEngine && window.MuseumEngine.onWindowResize) {
        window.MuseumEngine.onWindowResize();
      }
    }
  }

  // Khi bấm chuột / chạm vào tranh trên tường: CHỈ mở bảng thông tin hiện vật, KHÔNG làm bay camera khỏi nhân vật
  function onItemClicked(e, camera) {
    const renderer =
      window.MuseumEngine && window.MuseumEngine.getRenderer
        ? window.MuseumEngine.getRenderer()
        : null;
    if (!renderer) return;
    const dom = renderer.domElement;
    const rect = dom.getBoundingClientRect();

    if (document.pointerLockElement === dom) {
      mouse.x = 0;
      mouse.y = 0;
    } else {
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    }

    raycaster.setFromCamera(mouse, camera);
    const objects = window.MuseumEngine.interactableObjects || [];
    const intersects = raycaster.intersectObjects(objects, true);

    if (intersects.length > 0) {
      let selected = intersects[0].object;
      while (
        selected.parent &&
        (!selected.userData || !selected.userData.title) &&
        selected.parent !== window.MuseumEngine.getScene()
      ) {
        selected = selected.parent;
      }
      if (selected.userData && selected.userData.title) {
        const playlist = getPlaylist();
        const foundIdx = playlist.findIndex(
          (item) => item.id === selected.userData.id,
        );
        const exhibitData =
          foundIdx !== -1 ? playlist[foundIdx] : selected.userData;

        if (foundIdx !== -1) {
          currentSlideIndex = foundIdx;
          renderPresentationSlideUI(exhibitData, foundIdx, playlist.length);
        }
        // Chỉ cập nhật HUD và mở bảng chi tiết hiện vật, giữ nguyên vị trí camera Shift-Lock trên vai nhân vật
        updateHUD(exhibitData);
        openDetailDrawer(exhibitData);
      }
    }
  }

  // Hỗ trợ Mobile đa chạm: Nửa trái màn hình là cụm phím ảo D-pad (W/A/S/D)
  function setupMobileControls(keys) {
    if (document.getElementById("virtual-dpad")) return;
    const container = document.getElementById("webgl-container");
    if (!container) return;

    const dpad = document.createElement("div");
    dpad.id = "virtual-dpad";
    dpad.className = "virtual-dpad-container";
    dpad.innerHTML = `
      <div class="dpad-row">
        <button type="button" class="dpad-btn" data-key="w" title="Đi thẳng (W)">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="pointer-events: none;"><path d="M12 5L4 19h16z"/></svg>
        </button>
      </div>
      <div class="dpad-row">
        <button type="button" class="dpad-btn" data-key="a" title="Sang trái (A)">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="pointer-events: none;"><path d="M5 12l14 8V4z"/></svg>
        </button>
        <button type="button" class="dpad-btn" data-key="s" title="Đi lùi (S)">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="pointer-events: none;"><path d="M12 19L20 5H4z"/></svg>
        </button>
        <button type="button" class="dpad-btn" data-key="d" title="Sang phải (D)">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="pointer-events: none;"><path d="M19 12L5 4v16z"/></svg>
        </button>
      </div>
    `;
    container.appendChild(dpad);

    const setKeyState = (btn, key, state) => {
      if (keys[key] !== undefined) keys[key] = state;
      if (btn) {
        if (state) btn.classList.add("dpad-active");
        else btn.classList.remove("dpad-active");
      }
    };

    dpad.querySelectorAll(".dpad-btn").forEach((btn) => {
      const k = btn.getAttribute("data-key");
      btn.addEventListener(
        "touchstart",
        (e) => {
          e.preventDefault();
          e.stopPropagation();
          setKeyState(btn, k, true);
        },
        { passive: false },
      );
      btn.addEventListener(
        "touchend",
        (e) => {
          e.preventDefault();
          e.stopPropagation();
          setKeyState(btn, k, false);
        },
        { passive: false },
      );
      btn.addEventListener(
        "touchcancel",
        (e) => {
          e.preventDefault();
          e.stopPropagation();
          setKeyState(btn, k, false);
        },
        { passive: false },
      );
      btn.addEventListener("mousedown", (e) => {
        e.preventDefault();
        e.stopPropagation();
        setKeyState(btn, k, true);
      });
      btn.addEventListener("mouseup", (e) => {
        e.preventDefault();
        e.stopPropagation();
        setKeyState(btn, k, false);
      });
      btn.addEventListener("mouseleave", () => setKeyState(btn, k, false));
    });
  }

  function populateSlideDropdown() {
    const selectEl = document.getElementById("slide-select-dropdown");
    if (!selectEl) return;
    const playlist = getPlaylist();
    selectEl.innerHTML = playlist
      .map(
        (item, idx) =>
          `<option value="${idx}">Slide ${idx + 1}/${playlist.length} [P.${item.room}] ${item.title}</option>`,
      )
      .join("");
    selectEl.addEventListener("change", () => {
      const idx = parseInt(selectEl.value, 10);
      if (!isNaN(idx)) focusExhibitByIndex(idx);
    });
  }

  function togglePointerLock(domElement) {
    if (!domElement || currentMode !== "explore") return;
    if (document.pointerLockElement === domElement) {
      if (document.exitPointerLock) document.exitPointerLock();
    } else {
      if (domElement.requestPointerLock) {
        try {
          domElement.requestPointerLock();
        } catch (_) {}
      }
    }
  }

  function init(camera, domElement, keys) {
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    setupMobileControls(keys);
    populateSlideDropdown();

    // Chặn menu chuột phải trên canvas để kéo chuột phải xoay góc nhìn mượt như Roblox
    domElement.addEventListener("contextmenu", (e) => e.preventDefault());

    // PC: Nhấn giữ chuột trái hoặc chuột phải và kéo để xoay góc nhìn (yaw & pitch)
    domElement.addEventListener("mousedown", (e) => {
      window.focus();
      if (document.pointerLockElement === domElement) {
        if (e.button === 0) {
          onItemClicked(e, camera);
        }
        return;
      }
      if (e.button === 0 || e.button === 2) {
        isMouseDragging = true;
        lastMousePos.x = e.clientX;
        lastMousePos.y = e.clientY;
        totalMouseDragDist = 0;
        domElement.style.cursor = "grabbing";
      }
    });

    window.addEventListener("mousemove", (e) => {
      if (currentMode !== "explore") return;

      // Nếu đang bật khóa trỏ chuột (Pointer Lock bằng phím Shift)
      if (document.pointerLockElement === domElement) {
        const dx = e.movementX || 0;
        const dy = e.movementY || 0;
        if (window.MuseumEngine && window.MuseumEngine.rotateCamera) {
          window.MuseumEngine.rotateCamera(dx * 0.0032, -dy * 0.0032);
        }
        return;
      }

      // Nếu đang nhấn giữ chuột trái hoặc phải để kéo xoay camera
      if (isMouseDragging) {
        const dx = e.clientX - lastMousePos.x;
        const dy = e.clientY - lastMousePos.y;
        totalMouseDragDist += Math.hypot(dx, dy);
        lastMousePos.x = e.clientX;
        lastMousePos.y = e.clientY;

        if (window.MuseumEngine && window.MuseumEngine.rotateCamera) {
          window.MuseumEngine.rotateCamera(dx * 0.0048, -dy * 0.0048);
        }
        return;
      }

      // Đổi con trỏ chuột khi trỏ vào tranh
      const rect = domElement.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);
        const objects =
          (window.MuseumEngine && window.MuseumEngine.interactableObjects) ||
          [];
        const intersects = raycaster.intersectObjects(objects, true);
        domElement.style.cursor = intersects.length > 0 ? "pointer" : "grab";
      }
    });

    window.addEventListener("mouseup", (e) => {
      if (!isMouseDragging) return;
      isMouseDragging = false;
      domElement.style.cursor = "grab";

      // Nếu chỉ bấm chuột trái vào tranh (không kéo xoay góc nhìn) -> mở bảng thông tin hiện vật
      if (totalMouseDragDist < 6 && e.button === 0) {
        onItemClicked(e, camera);
      }
    });

    // Mobile đa chạm: Nửa màn hình bên phải chạm và vuốt để xoay góc nhìn đồng thời khi đang bấm D-pad bên trái
    domElement.addEventListener(
      "touchstart",
      (e) => {
        if (currentMode !== "explore") return;
        const rect = domElement.getBoundingClientRect();
        for (let i = 0; i < e.changedTouches.length; i++) {
          const t = e.changedTouches[i];
          // Ưu tiên nửa phải màn hình cho xoay camera (hoặc bất kỳ điểm chạm nào trên canvas ngoài cụm D-pad)
          const isRightHalf = t.clientX >= rect.left + rect.width * 0.4;
          if (
            activeLookTouchId === null &&
            (isRightHalf || e.touches.length === 1)
          ) {
            activeLookTouchId = t.identifier;
            lastTouchPos.x = t.clientX;
            lastTouchPos.y = t.clientY;
            totalTouchDragDist = 0;
            break;
          }
        }
      },
      { passive: true },
    );

    window.addEventListener(
      "touchmove",
      (e) => {
        if (currentMode !== "explore" || activeLookTouchId === null) return;
        for (let i = 0; i < e.changedTouches.length; i++) {
          const t = e.changedTouches[i];
          if (t.identifier === activeLookTouchId) {
            const dx = t.clientX - lastTouchPos.x;
            const dy = t.clientY - lastTouchPos.y;
            totalTouchDragDist += Math.hypot(dx, dy);
            lastTouchPos.x = t.clientX;
            lastTouchPos.y = t.clientY;

            if (window.MuseumEngine && window.MuseumEngine.rotateCamera) {
              window.MuseumEngine.rotateCamera(dx * 0.0055, -dy * 0.0055);
            }
            break;
          }
        }
      },
      { passive: true },
    );

    const handleTouchEndOrCancel = (e) => {
      if (activeLookTouchId === null) return;
      for (let i = 0; i < e.changedTouches.length; i++) {
        const t = e.changedTouches[i];
        if (t.identifier === activeLookTouchId) {
          if (totalTouchDragDist < 10 && currentMode === "explore") {
            onItemClicked({ clientX: t.clientX, clientY: t.clientY }, camera);
          }
          activeLookTouchId = null;
          break;
        }
      }
    };

    window.addEventListener("touchend", handleTouchEndOrCancel, {
      passive: true,
    });
    window.addEventListener("touchcancel", handleTouchEndOrCancel, {
      passive: true,
    });

    // Cập nhật giao diện khi bật/tắt khóa trỏ chuột Shift-Lock
    const shiftLockBtn = document.getElementById("btn-shiftlock-status");
    const shiftLockLabel = document.getElementById("shiftlock-state-label");
    const crosshair = document.getElementById("shiftlock-crosshair");

    if (shiftLockBtn) {
      shiftLockBtn.addEventListener("click", () =>
        togglePointerLock(domElement),
      );
    }

    document.addEventListener("pointerlockchange", () => {
      const isLocked = document.pointerLockElement === domElement;
      if (shiftLockLabel) {
        shiftLockLabel.textContent = isLocked
          ? "ĐANG KHÓA CHUỘT (Bấm Shift để mở)"
          : "Giữ chuột / Phím Shift";
      }
      if (crosshair) {
        if (isLocked && currentMode === "explore") {
          crosshair.classList.remove("hidden");
        } else {
          crosshair.classList.add("hidden");
        }
      }
    });

    // Nút chuyển chế độ Thuyết trình / Khám phá tự do
    const btnPres = document.getElementById("mode-btn-presentation");
    const btnExplore = document.getElementById("mode-btn-explore");
    const btnPresToExplore = document.getElementById("btn-pres-to-explore");

    if (btnPres)
      btnPres.addEventListener("click", () => setMode("presentation"));
    if (btnExplore)
      btnExplore.addEventListener("click", () => setMode("explore"));
    if (btnPresToExplore)
      btnPresToExplore.addEventListener("click", () => setMode("explore"));

    // Nút đổi Nền Tối / Nền Sáng có độ tương phản cao trong chế độ thuyết trình
    const btnThemeToggle = document.getElementById("btn-pres-theme-toggle");
    const presPanel = document.getElementById("presentation-panel");
    const themeIcon = document.getElementById("pres-theme-icon");
    const themeLabel = document.getElementById("pres-theme-label");

    if (btnThemeToggle && presPanel) {
      btnThemeToggle.addEventListener("click", () => {
        const isLight = presPanel.classList.toggle("pres-light-theme");
        if (themeIcon) themeIcon.textContent = isLight ? "🌙" : "☀️";
        if (themeLabel)
          themeLabel.textContent = isLight ? "Nền Tối" : "Nền Sáng";
      });
    }

    // Nút điều hướng Slide trước / Tiếp theo
    const btnPrevSlide = document.getElementById("btn-prev-slide");
    const btnNextSlide = document.getElementById("btn-next-slide");
    if (btnPrevSlide) {
      btnPrevSlide.addEventListener("click", () =>
        focusExhibitByIndex(currentSlideIndex - 1),
      );
    }
    if (btnNextSlide) {
      btnNextSlide.addEventListener("click", () =>
        focusExhibitByIndex(currentSlideIndex + 1),
      );
    }

    // Chuyển phòng trên Header
    const roomButtons = document.querySelectorAll(".room-btn");
    roomButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const room = parseInt(btn.getAttribute("data-room"), 10);
        syncRoomButtons(room);
        if (window.MuseumEngine) window.MuseumEngine.setRoom(room);
        renderExploreQuickNav(room);

        const firstSlideOfRoom = getPlaylist().findIndex(
          (item) => item.room === room,
        );
        if (currentMode === "presentation" && firstSlideOfRoom !== -1) {
          focusExhibitByIndex(firstSlideOfRoom);
        } else if (firstSlideOfRoom !== -1) {
          currentSlideIndex = firstSlideOfRoom;
          updateHUD(getPlaylist()[firstSlideOfRoom]);
        }
      });
    });

    // Nút Góc Chuẩn
    const btnResetCam = document.getElementById("btn-reset-cam");
    if (btnResetCam) {
      btnResetCam.addEventListener("click", () => {
        if (window.MuseumEngine) window.MuseumEngine.resetCamera();
      });
    }

    // Nút thu gọn / mở rộng HUD góc phải (Chế độ Khám phá)
    const hudToggleBtn = document.getElementById("hud-toggle-btn");
    const hudBody = document.getElementById("hud-content-body");
    if (hudToggleBtn && hudBody) {
      hudToggleBtn.addEventListener("click", () => {
        if (hudBody.classList.contains("hidden")) {
          hudBody.classList.remove("hidden");
          hudToggleBtn.textContent = "−";
        } else {
          hudBody.classList.add("hidden");
          hudToggleBtn.textContent = "+";
        }
      });
    }

    // Nút Xem đầy đủ nội dung (Ngăn kéo / Modal)
    const btnOpenDrawer = document.getElementById("btn-open-detail-drawer");
    const btnCloseDrawer = document.getElementById("btn-close-detail-drawer");
    const drawerModal = document.getElementById("detail-drawer-modal");

    if (btnOpenDrawer) {
      btnOpenDrawer.addEventListener("click", () =>
        openDetailDrawer(currentExhibitData),
      );
    }
    if (btnCloseDrawer) {
      btnCloseDrawer.addEventListener("click", closeDetailDrawer);
    }
    if (drawerModal) {
      drawerModal.addEventListener("click", (e) => {
        if (e.target === drawerModal) closeDetailDrawer();
      });
    }

    // Sự kiện bàn phím: Phím tắt thuyết trình (ArrowLeft, ArrowRight, Space), Shift-Lock & Di chuyển (W, A, S, D)
    window.addEventListener("keydown", (e) => {
      const k = e.key.toLowerCase();

      if (k === "escape") {
        closeDetailDrawer();
        return;
      }

      if (currentMode === "presentation") {
        if (k === "arrowright" || k === " ") {
          e.preventDefault();
          focusExhibitByIndex(currentSlideIndex + 1);
          return;
        }
        if (k === "arrowleft") {
          e.preventDefault();
          focusExhibitByIndex(currentSlideIndex - 1);
          return;
        }
      }

      // Phím Shift bật/tắt khóa trỏ chuột (Pointer Lock) trong chế độ Khám phá tự do
      if (currentMode === "explore" && e.key === "Shift" && !e.repeat) {
        togglePointerLock(domElement);
        return;
      }

      if (k === "w" || (currentMode === "explore" && k === "arrowup"))
        keys.w = true;
      if (k === "a" || (currentMode === "explore" && k === "arrowleft"))
        keys.a = true;
      if (k === "s" || (currentMode === "explore" && k === "arrowdown"))
        keys.s = true;
      if (k === "d" || (currentMode === "explore" && k === "arrowright"))
        keys.d = true;
    });

    window.addEventListener("keyup", (e) => {
      const k = e.key.toLowerCase();
      if (k === "w" || k === "arrowup") keys.w = false;
      if (k === "a" || k === "arrowleft") keys.a = false;
      if (k === "s" || k === "arrowdown") keys.s = false;
      if (k === "d" || k === "arrowright") keys.d = false;
    });

    // Khởi tạo mặc định ở Chế độ Thuyết trình Toàn màn hình
    setMode("presentation");
  }

  return {
    init,
    setMode,
    focusExhibitByIndex,
    updateHUD,
    openDetailDrawer,
    closeDetailDrawer,
  };
})();
