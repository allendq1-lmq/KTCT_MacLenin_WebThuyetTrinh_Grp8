// museum/controls.js - Điều khiển Không gian Khám phá tự do 3D & Camera Shift-Lock chuẩn Roblox (PC + Mobile đa chạm)
window.MuseumControls = (() => {
  let raycaster, mouse;
  let isInitialized = false;
  let currentExhibitIndex = 0;
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

  // Đưa nhân vật sinh viên UIT & camera Shift-Lock tới hiện vật được chọn
  function focusExhibitByIndex(idx) {
    const playlist = getPlaylist();
    if (!playlist.length) return;
    const clampedIdx = (idx + playlist.length) % playlist.length;
    currentExhibitIndex = clampedIdx;
    const exhibit = playlist[clampedIdx];
    currentExhibitData = exhibit;

    if (
      window.MuseumEngine &&
      window.MuseumEngine.getCurrentRoom() !== exhibit.room
    ) {
      window.MuseumEngine.setRoom(exhibit.room);
    }
    syncRoomButtons(exhibit.room);
    renderExploreQuickNav(exhibit.room);

    if (exhibit.camPos && exhibit.lookPos && window.MuseumEngine) {
      window.MuseumEngine.syncAvatarToExhibit(
        exhibit.camPos.x,
        exhibit.camPos.y,
        exhibit.camPos.z,
        exhibit.lookPos.x,
        exhibit.lookPos.y,
        exhibit.lookPos.z,
      );
    }

    updateHUD(exhibit);
  }

  // Khi bấm chuột / chạm vào tranh trên tường: mở bảng thông tin hiện vật, không làm bay camera khỏi nhân vật
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
          currentExhibitIndex = foundIdx;
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

  function togglePointerLock(domElement) {
    if (!domElement) return;
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
        if (activeLookTouchId === null) return;
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
          if (totalTouchDragDist < 10) {
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
        if (isLocked) {
          crosshair.classList.remove("hidden");
        } else {
          crosshair.classList.add("hidden");
        }
      }
    });

    // Chuyển phòng trên Header
    const roomButtons = document.querySelectorAll(".room-btn");
    roomButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const room = parseInt(btn.getAttribute("data-room"), 10);
        syncRoomButtons(room);
        if (window.MuseumEngine) window.MuseumEngine.setRoom(room);
        renderExploreQuickNav(room);

        const firstExhibitOfRoom = getPlaylist().findIndex(
          (item) => item.room === room,
        );
        if (firstExhibitOfRoom !== -1) {
          currentExhibitIndex = firstExhibitOfRoom;
          updateHUD(getPlaylist()[firstExhibitOfRoom]);
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

    // Nút thu gọn / mở rộng HUD góc phải
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

    // Sự kiện bàn phím: Shift-Lock & Di chuyển (W, A, S, D / Mũi tên)
    window.addEventListener("keydown", (e) => {
      const k = e.key.toLowerCase();

      if (k === "escape") {
        closeDetailDrawer();
        return;
      }

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

      // Phím Shift bật/tắt khóa trỏ chuột (Pointer Lock)
      if (e.key === "Shift" && !e.repeat) {
        togglePointerLock(domElement);
        return;
      }

      if (k === "w" || k === "arrowup") keys.w = true;
      if (k === "a" || k === "arrowleft") keys.a = true;
      if (k === "s" || k === "arrowdown") keys.s = true;
      if (k === "d" || k === "arrowright") keys.d = true;
    });

    window.addEventListener("keyup", (e) => {
      const k = e.key.toLowerCase();
      if (k === "w" || k === "arrowup") keys.w = false;
      if (k === "a" || k === "arrowleft") keys.a = false;
      if (k === "s" || k === "arrowdown") keys.s = false;
      if (k === "d" || k === "arrowright") keys.d = false;
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

    // Khởi tạo trực tiếp vào chế độ Khám phá tự do 3D ở Phòng 1
    const initialRoom = window.MuseumEngine
      ? window.MuseumEngine.getCurrentRoom()
      : 1;
    syncRoomButtons(initialRoom);
    renderExploreQuickNav(initialRoom);
    if (getPlaylist().length > 0) {
      updateHUD(getPlaylist()[0]);
    }
  }

  return {
    init,
    onItemClicked,
    updateHUD,
    openDetailDrawer,
    closeDetailDrawer,
    focusExhibitByIndex,
    getCurrentExhibitIndex: () => currentExhibitIndex,
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
