// museum/controls.js - Điều khiển Không gian Khám phá tự do 3D & Camera Shift-Lock chuẩn Roblox (PC + Mobile đa chạm)
window.MuseumControls = (() => {
  let raycaster, mouse;
  let isInitialized = false;
  let currentExhibitIndex = 0;
  let currentExhibitData = null;
  let boundKeys = { w: false, a: false, s: false, d: false };

  // Ngưỡng chuẩn phân biệt thao tác Chạm (Tap mở hiện vật) và Kéo (Drag xoay góc nhìn) trên Mobile (C4)
  const TAP_MAX_DISTANCE_PX = 12;
  const TAP_MAX_DURATION_MS = 350;
  const DRAG_DEADZONE_PX = 3;

  // Trạng thái xoay góc nhìn chuột PC (Shift-Lock / Kéo chuột trái-phải)
  let isMouseDragging = false;
  let lastMousePos = { x: 0, y: 0 };
  let totalMouseDragDist = 0;

  // Trạng thái xoay góc nhìn đa chạm Mobile (nửa phải màn hình)
  let activeLookTouchId = null;
  let touchStartPos = { x: 0, y: 0 };
  let lastTouchPos = { x: 0, y: 0 };
  let touchStartTime = 0;
  let totalTouchDragDist = 0;

  function getNowMs() {
    return typeof performance !== "undefined" && performance.now
      ? performance.now()
      : Date.now();
  }

  function classifyTouchInteraction(dragDistancePx, durationMs) {
    const dist = typeof dragDistancePx === "number" ? dragDistancePx : Infinity;
    const dur = typeof durationMs === "number" ? durationMs : 0;
    if (dist < TAP_MAX_DISTANCE_PX && dur <= TAP_MAX_DURATION_MS) {
      return "tap";
    }
    return "drag";
  }

  // Reset ngay lập tức toàn bộ trạng thái phím di chuyển & chạm khi mất tiêu điểm / chuyển tab (C1)
  function resetAllKeys() {
    if (boundKeys) {
      boundKeys.w = false;
      boundKeys.a = false;
      boundKeys.s = false;
      boundKeys.d = false;
    }
    isMouseDragging = false;
    activeLookTouchId = null;
    totalTouchDragDist = 0;

    const dpad = document.getElementById("virtual-dpad");
    if (dpad && dpad.querySelectorAll) {
      dpad.querySelectorAll(".dpad-btn").forEach((btn) => {
        if (btn.classList) btn.classList.remove("dpad-active");
      });
    }
  }

  function getKeysState() {
    return {
      w: Boolean(boundKeys && boundKeys.w),
      a: Boolean(boundKeys && boundKeys.a),
      s: Boolean(boundKeys && boundKeys.s),
      d: Boolean(boundKeys && boundKeys.d),
    };
  }

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

  // Khi bấm chuột / chạm vào tranh trên tường: mở thẳng modal thông tin đầy đủ hiện vật, không làm bay camera khỏi nhân vật
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
        currentExhibitData = exhibitData;
        openDetailDrawer(exhibitData);
      }
    }
  }

  // Hỗ trợ Mobile đa chạm: Nửa trái màn hình là cụm phím ảo D-pad (W/A/S/D) hỗ trợ miết ngón tay liên tục (C4)
  function setupMobileControls(keys) {
    if (document.getElementById("virtual-dpad")) return;
    const container = document.getElementById("webgl-container");
    if (!container) return;

    const dpad = document.createElement("div");
    dpad.id = "virtual-dpad";
    dpad.className = "virtual-dpad-container";
    dpad.innerHTML = `
      <div class="dpad-row">
        <button type="button" class="dpad-btn" data-key="w" title="Đi thẳng (W)" aria-label="Đi thẳng">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="pointer-events: none;"><path d="M12 5L4 19h16z"/></svg>
        </button>
      </div>
      <div class="dpad-row">
        <button type="button" class="dpad-btn" data-key="a" title="Sang trái (A)" aria-label="Sang trái">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="pointer-events: none;"><path d="M5 12l14 8V4z"/></svg>
        </button>
        <button type="button" class="dpad-btn" data-key="s" title="Đi lùi (S)" aria-label="Đi lùi">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="pointer-events: none;"><path d="M12 19L20 5H4z"/></svg>
        </button>
        <button type="button" class="dpad-btn" data-key="d" title="Sang phải (D)" aria-label="Sang phải">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="pointer-events: none;"><path d="M19 12L5 4v16z"/></svg>
        </button>
      </div>
    `;
    container.appendChild(dpad);

    const allBtns = Array.from(dpad.querySelectorAll(".dpad-btn") || []);

    const setKeyState = (btn, key, state) => {
      if (keys[key] !== undefined) keys[key] = state;
      if (btn && btn.classList) {
        if (state) btn.classList.add("dpad-active");
        else btn.classList.remove("dpad-active");
      }
    };

    const syncDpadActiveTouches = (touchList) => {
      if (
        !document.elementFromPoint ||
        !touchList ||
        typeof touchList.length !== "number"
      ) {
        return;
      }
      const activeKeysFromTouches = new Set();
      for (let i = 0; i < touchList.length; i++) {
        const t = touchList[i];
        const el = document.elementFromPoint(t.clientX, t.clientY);
        const btn = el && el.closest ? el.closest(".dpad-btn") : el;
        if (btn && btn.getAttribute) {
          const k = btn.getAttribute("data-key");
          if (k) activeKeysFromTouches.add(k);
        }
      }
      allBtns.forEach((btn) => {
        const k = btn.getAttribute("data-key");
        setKeyState(btn, k, activeKeysFromTouches.has(k));
      });
    };

    allBtns.forEach((btn) => {
      const k = btn.getAttribute("data-key");
      btn.addEventListener(
        "touchstart",
        (e) => {
          if (e.preventDefault) e.preventDefault();
          if (e.stopPropagation) e.stopPropagation();
          setKeyState(btn, k, true);
        },
        { passive: false },
      );
      btn.addEventListener(
        "touchmove",
        (e) => {
          if (e.preventDefault) e.preventDefault();
          if (e.stopPropagation) e.stopPropagation();
          syncDpadActiveTouches(e.touches);
        },
        { passive: false },
      );
      btn.addEventListener(
        "touchend",
        (e) => {
          if (e.preventDefault) e.preventDefault();
          if (e.stopPropagation) e.stopPropagation();
          setKeyState(btn, k, false);
          if (e.touches && e.touches.length > 0) {
            syncDpadActiveTouches(e.touches);
          }
        },
        { passive: false },
      );
      btn.addEventListener(
        "touchcancel",
        (e) => {
          if (e.preventDefault) e.preventDefault();
          if (e.stopPropagation) e.stopPropagation();
          setKeyState(btn, k, false);
        },
        { passive: false },
      );
      btn.addEventListener("mousedown", (e) => {
        if (e.preventDefault) e.preventDefault();
        if (e.stopPropagation) e.stopPropagation();
        setKeyState(btn, k, true);
      });
      btn.addEventListener("mouseup", (e) => {
        if (e.preventDefault) e.preventDefault();
        if (e.stopPropagation) e.stopPropagation();
        setKeyState(btn, k, false);
      });
      btn.addEventListener("mouseleave", () => setKeyState(btn, k, false));
    });
  }

  function togglePointerLock(domElement) {
    if (!domElement) return;
    if (document.pointerLockElement === domElement) {
      if (document.exitPointerLock) {
        try {
          const exitRes = document.exitPointerLock();
          if (exitRes && typeof exitRes.catch === "function") {
            exitRes.catch(() => {});
          }
        } catch (_) {}
      }
    } else if (domElement.requestPointerLock) {
      try {
        const lockRes = domElement.requestPointerLock();
        if (lockRes && typeof lockRes.catch === "function") {
          lockRes.catch(() => {});
        }
      } catch (_) {}
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
    boundKeys = keys || boundKeys;
    keys = boundKeys;

    if (domElement && domElement.style) {
      domElement.style.touchAction = "none";
    }

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

      if (totalMouseDragDist < 8 && e.button === 0) {
        onItemClicked(e, camera);
      }
    });

    // Mobile đa chạm trong chế độ Khám phá 3D: tách biệt rõ ngưỡng Tap (<12px, <=350ms) và Drag xoay camera (C4)
    domElement.addEventListener(
      "touchstart",
      (e) => {
        if (e.preventDefault) e.preventDefault();
        const rect = domElement.getBoundingClientRect();
        const changed = e.changedTouches || [];
        const touches = e.touches || changed;
        for (let i = 0; i < changed.length; i++) {
          const t = changed[i];
          const isRightHalf = t.clientX >= rect.left + rect.width * 0.35;
          if (
            activeLookTouchId === null &&
            (isRightHalf || touches.length === 1)
          ) {
            activeLookTouchId = t.identifier;
            touchStartPos.x = t.clientX;
            touchStartPos.y = t.clientY;
            lastTouchPos.x = t.clientX;
            lastTouchPos.y = t.clientY;
            touchStartTime = getNowMs();
            totalTouchDragDist = 0;
            break;
          }
        }
      },
      { passive: false },
    );

    window.addEventListener(
      "touchmove",
      (e) => {
        if (activeLookTouchId === null) return;
        const changed = e.changedTouches || [];
        for (let i = 0; i < changed.length; i++) {
          const t = changed[i];
          if (t.identifier === activeLookTouchId) {
            if (e.preventDefault) e.preventDefault();
            const dx = t.clientX - lastTouchPos.x;
            const dy = t.clientY - lastTouchPos.y;
            totalTouchDragDist += Math.hypot(dx, dy);
            lastTouchPos.x = t.clientX;
            lastTouchPos.y = t.clientY;

            if (
              totalTouchDragDist >= DRAG_DEADZONE_PX &&
              window.MuseumEngine &&
              window.MuseumEngine.rotateCamera
            ) {
              window.MuseumEngine.rotateCamera(dx * 0.0055, -dy * 0.0055);
            }
            break;
          }
        }
      },
      { passive: false },
    );

    const handleTouchEnd = (e, isCancel) => {
      if (activeLookTouchId === null) return;
      const changed = e.changedTouches || [];
      for (let i = 0; i < changed.length; i++) {
        const t = changed[i];
        if (t.identifier === activeLookTouchId) {
          const netDisplacement = Math.hypot(
            t.clientX - touchStartPos.x,
            t.clientY - touchStartPos.y,
          );
          const effectiveDist = Math.max(totalTouchDragDist, netDisplacement);
          const durationMs = Math.max(0, getNowMs() - touchStartTime);

          if (
            !isCancel &&
            classifyTouchInteraction(effectiveDist, durationMs) === "tap"
          ) {
            onItemClicked({ clientX: t.clientX, clientY: t.clientY }, camera);
          }
          activeLookTouchId = null;
          totalTouchDragDist = 0;
          break;
        }
      }
    };

    window.addEventListener(
      "touchend",
      (e) => handleTouchEnd(e, false),
      { passive: true },
    );
    window.addEventListener(
      "touchcancel",
      (e) => handleTouchEnd(e, true),
      { passive: true },
    );

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
        closeDetailDrawer();
        if (window.MuseumEngine) window.MuseumEngine.setRoom(room);

        const firstExhibitOfRoom = getPlaylist().findIndex(
          (item) => item.room === room,
        );
        if (firstExhibitOfRoom !== -1) {
          currentExhibitIndex = firstExhibitOfRoom;
          currentExhibitData = getPlaylist()[firstExhibitOfRoom];
        }
      });
    });

    // Đóng Modal / Ngăn kéo xem đầy đủ nội dung hiện vật
    const btnCloseDrawer = document.getElementById("btn-close-detail-drawer");
    const drawerModal = document.getElementById("detail-drawer-modal");

    if (btnCloseDrawer) {
      btnCloseDrawer.addEventListener("click", closeDetailDrawer);
    }
    if (drawerModal) {
      drawerModal.addEventListener("click", (e) => {
        if (e.target === drawerModal) closeDetailDrawer();
      });
    }

    // Chống tự trôi nhân vật khi mất focus cửa sổ, ẩn tab hoặc chuyển trang (C1)
    window.addEventListener("blur", resetAllKeys);
    window.addEventListener("pagehide", resetAllKeys);
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        resetAllKeys();
      }
    });

    // Sự kiện bàn phím: Shift-Lock & Di chuyển (W, A, S, D / Mũi tên)
    window.addEventListener("keydown", (e) => {
      const k = (e.key || "").toLowerCase();

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
            if (e.preventDefault) e.preventDefault();
            window.parent.toggleMuseumFullscreen();
            return;
          }
        } catch (_) {
          if (window.parent && window.parent !== window) {
            if (e.preventDefault) e.preventDefault();
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
      const k = (e.key || "").toLowerCase();
      if (k === "w" || k === "arrowup") keys.w = false;
      if (k === "a" || k === "arrowleft") keys.a = false;
      if (k === "s" || k === "arrowdown") keys.s = false;
      if (k === "d" || k === "arrowright") keys.d = false;
    });

    window.addEventListener("message", (e) => {
      if (!e || !e.data) return;
      if (e.data.type === "RESET_KEYS") {
        resetAllKeys();
        return;
      }
      if (e.data.type === "MUSEUM_SET_ACTIVE" && !e.data.active) {
        resetAllKeys();
        return;
      }
      if (e.data.type === "PARENT_KEY_EVENT") {
        const evtType = e.data.eventType || "keydown";
        const keyVal = (e.data.key || "").toLowerCase();
        if (evtType === "keydown") {
          if (keyVal === "w" || keyVal === "arrowup") keys.w = true;
          if (keyVal === "a" || keyVal === "arrowleft") keys.a = true;
          if (keyVal === "s" || keyVal === "arrowdown") keys.s = true;
          if (keyVal === "d" || keyVal === "arrowright") keys.d = true;
        } else if (evtType === "keyup") {
          if (keyVal === "w" || keyVal === "arrowup") keys.w = false;
          if (keyVal === "a" || keyVal === "arrowleft") keys.a = false;
          if (keyVal === "s" || keyVal === "arrowdown") keys.s = false;
          if (keyVal === "d" || keyVal === "arrowright") keys.d = false;
        }
        try {
          window.dispatchEvent(
            new KeyboardEvent(evtType, {
              key: e.data.key,
              code: e.data.code,
            }),
          );
        } catch (_) {}
      }
    });

    // Khởi tạo trực tiếp vào chế độ Khám phá tự do 3D ở Phòng 1
    const initialRoom = window.MuseumEngine
      ? window.MuseumEngine.getCurrentRoom()
      : 1;
    syncRoomButtons(initialRoom);
    currentExhibitData = getPlaylist()[0] || null;
  }

  return {
    init,
    onItemClicked,
    openDetailDrawer,
    closeDetailDrawer,
    resetAllKeys,
    getKeysState,
    classifyTouchInteraction,
    TAP_MAX_DISTANCE_PX,
    TAP_MAX_DURATION_MS,
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
