// museum/controls.js - Điều khiển Chế độ Thuyết trình Toàn màn hình & Camera 3D Shift-Lock chuẩn Roblox (PC + Mobile đa chạm)
window.MuseumControls = (() => {
  let raycaster, mouse;
  let isInitialized = false;
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
        b.classList.remove("text-slate-300", "text-slate-700");
      } else {
        b.classList.remove("active");
        if (b.closest("#pres-top-bar")) {
          b.classList.add("text-slate-700");
        } else {
          b.classList.add("text-slate-300");
        }
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
        `<p class="text-slate-800 leading-relaxed">${data.desc || ""}</p>`;
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

  // Render danh sách thẻ ý chính nổi bật cho giao diện trình chiếu nền sáng cố định
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

    // Hiển thị các thẻ ý chính (key points) rõ ràng trên nền sáng độ tương phản cao
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

    // Cân đối tỷ lệ cột ngang cho Bảng so sánh 6 tiêu chí (r3-table) và các slide tiêu chuẩn để tuyệt đối không cuộn dọc
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
    }
    syncRoomButtons(slide.room);
    renderExploreQuickNav(slide.room);

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
      selectEl.blur();
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
    if (isInitialized) return;
    isInitialized = true;

    raycaster = window.THREE ? new THREE.Raycaster() : null;
    mouse = window.THREE ? new THREE.Vector2() : { x: 0, y: 0 };
    domElement =
      domElement ||
      document.getElementById("webgl-container") ||
      document.body;
    keys = keys || { w: false, a: false, s: false, d: false };

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

      if (document.pointerLockElement === domElement) {
        const dx = e.movementX || 0;
        const dy = e.movementY || 0;
        if (window.MuseumEngine && window.MuseumEngine.rotateCamera) {
          window.MuseumEngine.rotateCamera(dx * 0.0032, -dy * 0.0032);
        }
        return;
      }

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

      const rect = domElement.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0 && raycaster && camera) {
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

      if (totalMouseDragDist < 6 && e.button === 0) {
        onItemClicked(e, camera);
      }
    });

    // Mobile đa chạm trong chế độ Khám phá 3D: Nửa màn hình bên phải chạm và vuốt để xoay góc nhìn
    domElement.addEventListener(
      "touchstart",
      (e) => {
        if (currentMode !== "explore") return;
        const rect = domElement.getBoundingClientRect();
        for (let i = 0; i < e.changedTouches.length; i++) {
          const t = e.changedTouches[i];
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

    // Vuốt ngang (touchstart / touchend) trên #presentation-panel để chuyển slide trên điện thoại/màn hình cảm ứng
    const presPanel = document.getElementById("presentation-panel");
    let presTouchStartX = 0;
    let presTouchStartY = 0;

    if (presPanel) {
      presPanel.addEventListener(
        "touchstart",
        (e) => {
          if (currentMode !== "presentation" || !e.changedTouches.length)
            return;
          presTouchStartX = e.changedTouches[0].clientX;
          presTouchStartY = e.changedTouches[0].clientY;
        },
        { passive: true },
      );

      presPanel.addEventListener(
        "touchend",
        (e) => {
          if (currentMode !== "presentation" || !e.changedTouches.length)
            return;
          const dx = e.changedTouches[0].clientX - presTouchStartX;
          const dy = e.changedTouches[0].clientY - presTouchStartY;
          if (Math.abs(dx) >= 45 && Math.abs(dx) > Math.abs(dy)) {
            if (dx < 0) {
              focusExhibitByIndex(currentSlideIndex + 1);
            } else {
              focusExhibitByIndex(currentSlideIndex - 1);
            }
          }
        },
        { passive: true },
      );
    }

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
        // Bỏ qua khi đang mở / focus vào dropdown chọn slide
        const activeTag =
          document.activeElement && document.activeElement.tagName
            ? document.activeElement.tagName.toUpperCase()
            : "";
        if (activeTag === "SELECT") {
          return;
        }

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
    onItemClicked,
    updateHUD,
    openDetailDrawer,
    closeDetailDrawer,
    focusExhibitByIndex,
    setMode,
    getCurrentMode: () => currentMode,
    getCurrentSlideIndex: () => currentSlideIndex,
  };
})();

if (typeof window.THREE === "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      if (window.MuseumControls) window.MuseumControls.init();
    });
  } else if (window.MuseumControls) {
    window.MuseumControls.init();
  }
}
