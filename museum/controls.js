// museum/controls.js - Tương tác chuột, Teleport nhân vật và D-pad đồng bộ icon SVG
window.MuseumControls = (() => {
  let raycaster, mouse;
  let pointerDownPos = { x: 0, y: 0 };
  let isPointerDown = false;
  let currentReasonIndex = 0;

  const timelineMilestones = [
    {
      cam: { x: -5.7, y: 1.8, z: -3.6 },
      look: { x: -5.7, y: 2.1, z: -5.85 },
      title: "Trước 1986: Cơ Chế Kế Hoạch Hóa Tập Trung",
      desc: "Nhà nước bao cấp toàn bộ nguồn lực và chỉ tiêu qua tem phiếu, triệt tiêu động lực sáng tạo, nền kinh tế rơi vào khủng hoảng trầm trọng.",
    },
    {
      cam: { x: -1.9, y: 1.8, z: -3.6 },
      look: { x: -1.9, y: 2.1, z: -5.85 },
      title: "Đại Hội VI (12/1986): Khởi Xướng Đổi Mới",
      desc: "Đột phá lý luận của Đảng: chính thức thừa nhận sản xuất hàng hóa nhiều thành phần, mở đường giải phóng mạnh mẽ sức sản xuất xã hội.",
    },
    {
      cam: { x: 1.9, y: 1.8, z: -3.6 },
      look: { x: 1.9, y: 2.1, z: -5.85 },
      title: "Đại Hội IX (4/2001): Xác Lập Khái Niệm",
      desc: "Khẳng định: Kinh tế thị trường định hướng XHCN là mô hình kinh tế tổng quát của nước ta trong thời kỳ quá độ lên CNXH.",
    },
    {
      cam: { x: 5.7, y: 1.8, z: -3.6 },
      look: { x: 5.7, y: 2.1, z: -5.85 },
      title: "Đại Hội XII, XIII: Hoàn Thiện Thể Chế",
      desc: "Mô hình kinh tế thị trường hiện đại, hội nhập quốc tế, vận hành theo quy luật khách quan có sự quản lý của Nhà nước pháp quyền.",
    },
  ];

  const reasonsCycle = [
    {
      cam: { x: -5.2, y: 1.8, z: -2.6 },
      look: { x: -7.85, y: 2.1, z: -2.6 },
      title: "Lý Do Tất Yếu 1: Xu Hướng Khách Quan",
      desc: "Kinh tế thị trường là phương thức phổ biến của nhân loại. Không quốc gia nào có thể phát triển khép kín, biệt lập; việc chuyển sang KTTT là quy luật tất yếu.",
      label: "3 Lý Do Tất Yếu (1/3)",
    },
    {
      cam: { x: -5.2, y: 1.8, z: 0.8 },
      look: { x: -7.85, y: 2.1, z: 0.8 },
      title: "Lý Do Tất Yếu 2: Tính Ưu Việt Lực Lượng Sản Xuất",
      desc: "Cơ chế thị trường kích thích cải tiến khoa học công nghệ, phân bổ nguồn lực năng động và tối ưu hóa năng suất lao động xã hội.",
      label: "3 Lý Do Tất Yếu (2/3)",
    },
    {
      cam: { x: -5.2, y: 1.8, z: 4.2 },
      look: { x: -7.85, y: 2.1, z: 4.2 },
      title: "Lý Do Tất Yếu 3: Nguyện Vọng Của Nhân Dân",
      desc: "Mô hình đáp ứng trực tiếp mục tiêu cốt lõi: thoát khỏi đói nghèo, vươn lên giàu mạnh chính đáng, xây dựng đất nước 'Dân giàu, nước mạnh, dân chủ, công bằng, văn minh'.",
      label: "3 Lý Do Tất Yếu (3/3)",
    },
  ];

  function teleportAvatarToExhibit(camX, camZ, lookX, lookZ) {
    if (window.MuseumAvatar) {
      const avatar = window.MuseumAvatar.getAvatar();
      if (avatar) {
        const dirX = lookX - camX;
        const dirZ = lookZ - camZ;
        const len = Math.hypot(dirX, dirZ) || 1;
        avatar.position.set(
          camX + (dirX / len) * 0.8,
          0,
          camZ + (dirZ / len) * 0.8,
        );
        avatar.lookAt(lookX, 0, lookZ);
      }
    }
  }

  function updateHUD(title, desc) {
    const hudTitle = document.getElementById("hud-title");
    const hudDesc = document.getElementById("hud-desc");
    const hudBody = document.getElementById("hud-content-body");
    const hudToggleBtn = document.getElementById("hud-toggle-btn");

    if (hudTitle) hudTitle.textContent = title;
    if (hudDesc) hudDesc.textContent = desc;

    if (hudBody && hudBody.classList.contains("hidden")) {
      hudBody.classList.remove("hidden");
      if (hudToggleBtn) hudToggleBtn.textContent = "−";
    }
  }

  function onItemClicked(e, camera) {
    const renderer = window.MuseumEngine.getRenderer();
    if (!renderer) return;
    const dom = renderer.domElement;
    const rect = dom.getBoundingClientRect();
    mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const objects = window.MuseumEngine.interactableObjects || [];
    const intersects = raycaster.intersectObjects(objects, true);

    if (intersects.length > 0) {
      let selected = intersects[0].object;
      while (
        selected.parent &&
        !selected.userData.title &&
        selected.parent !== window.MuseumEngine.getScene()
      ) {
        selected = selected.parent;
      }
      if (selected.userData && selected.userData.title) {
        updateHUD(selected.userData.title, selected.userData.desc);

        if (selected.userData.camPos && selected.userData.lookPos) {
          window.MuseumEngine.focusTarget(
            selected.userData.camPos.x,
            selected.userData.camPos.y,
            selected.userData.camPos.z,
            selected.userData.lookPos.x,
            selected.userData.lookPos.y,
            selected.userData.lookPos.z,
          );
          teleportAvatarToExhibit(
            selected.userData.camPos.x,
            selected.userData.camPos.z,
            selected.userData.lookPos.x,
            selected.userData.lookPos.z,
          );
        }
      }
    }
  }

  // Cụm D-pad đồng bộ 4 icon tam giác SVG màu trắng phẳng
  function setupMobileControls(keys) {
    if (document.getElementById("virtual-dpad")) return;
    const container = document.getElementById("webgl-container");
    if (!container) return;

    const dpad = document.createElement("div");
    dpad.id = "virtual-dpad";
    dpad.className = "virtual-dpad-container";
    dpad.innerHTML = `
      <div class="dpad-row">
        <button class="dpad-btn" data-key="w" title="Đi lên">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" style="pointer-events: none;"><path d="M12 5L4 19h16z"/></svg>
        </button>
      </div>
      <div class="dpad-row">
        <button class="dpad-btn" data-key="a" title="Sang trái">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" style="pointer-events: none;"><path d="M5 12l14 8V4z"/></svg>
        </button>
        <button class="dpad-btn" data-key="s" title="Đi xuống">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" style="pointer-events: none;"><path d="M12 19L20 5H4z"/></svg>
        </button>
        <button class="dpad-btn" data-key="d" title="Sang phải">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" style="pointer-events: none;"><path d="M19 12L5 4v16z"/></svg>
        </button>
      </div>
    `;
    container.appendChild(dpad);

    const handlePress = (key, state) => {
      if (keys[key] !== undefined) keys[key] = state;
    };

    dpad.querySelectorAll(".dpad-btn").forEach((btn) => {
      const k = btn.getAttribute("data-key");
      btn.addEventListener("touchstart", (e) => {
        e.preventDefault();
        handlePress(k, true);
      });
      btn.addEventListener("touchend", (e) => {
        e.preventDefault();
        handlePress(k, false);
      });
      btn.addEventListener("mousedown", (e) => {
        e.preventDefault();
        handlePress(k, true);
      });
      btn.addEventListener("mouseup", (e) => {
        e.preventDefault();
        handlePress(k, false);
      });
      btn.addEventListener("mouseleave", () => handlePress(k, false));
    });
  }

  function init(camera, domElement, keys) {
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    domElement.addEventListener("pointerdown", (e) => {
      window.focus();
      isPointerDown = true;
      pointerDownPos.x = e.clientX;
      pointerDownPos.y = e.clientY;
    });

    domElement.addEventListener("pointermove", (e) => {
      const rect = domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const objects =
        (window.MuseumEngine && window.MuseumEngine.interactableObjects) || [];
      const intersects = raycaster.intersectObjects(objects, true);
      domElement.style.cursor =
        intersects.length > 0
          ? "pointer"
          : isPointerDown
            ? "grabbing"
            : "default";
    });

    domElement.addEventListener("pointerup", (e) => {
      isPointerDown = false;
      const dist = Math.hypot(
        e.clientX - pointerDownPos.x,
        e.clientY - pointerDownPos.y,
      );
      if (dist < 6) {
        onItemClicked(e, camera);
      }
    });

    // 1. Chuyển phòng
    const roomButtons = document.querySelectorAll(".room-btn");
    roomButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        roomButtons.forEach((b) => b.classList.remove("active", "text-white"));
        btn.classList.add("active", "text-white");

        const room = parseInt(btn.getAttribute("data-room"), 10);
        if (window.MuseumEngine) window.MuseumEngine.setRoom(room);

        const r1Ctrl = document.getElementById("room1-controls");
        const r3Ctrl = document.getElementById("room3-controls");
        if (room === 1) {
          if (r1Ctrl) r1Ctrl.classList.remove("hidden");
          if (r3Ctrl) r3Ctrl.classList.add("hidden");
          updateHUD(
            "Phòng 1: Tiến Trình Nhận Thức & Tính Tất Yếu",
            "Dùng phím W-A-S-D hoặc phím ảo cảm ứng để sinh viên UIT bước đi. Bấm các nút mốc thời gian để ống kính tự động áp sát từng tác phẩm.",
          );
        } else if (room === 2) {
          if (r1Ctrl) r1Ctrl.classList.add("hidden");
          if (r3Ctrl) r3Ctrl.classList.add("hidden");
          updateHUD(
            "Phòng 2: Căn Phòng 5 Cột Trụ Đặc Trưng",
            "5 cột trụ kiến trúc tương ứng 5 đặc trưng thể chế. Bấm vào từng cột trụ để xem khái niệm và cơ chế hoạt động.",
          );
        } else if (room === 3) {
          if (r1Ctrl) r1Ctrl.classList.add("hidden");
          if (r3Ctrl) r3Ctrl.classList.remove("hidden");
          updateHUD(
            "Phòng 3: Sảnh Thể Chế & Giải Pháp Hoàn Thiện",
            "Đối lập biện chứng giữa Bảng 5 hạn chế thể chế (bên trái) và 4 nhóm giải pháp hoàn thiện (bên phải).",
          );
        }
      });
    });

    // 2. Nút mốc thời gian Phòng 1
    const r1NavButtons = document.querySelectorAll(".r1-nav-btn");
    const btnR1Reasons = document.getElementById("btn-r1-reasons");

    r1NavButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const idx = parseInt(btn.getAttribute("data-target"), 10);
        if (idx < 4) {
          const item = timelineMilestones[idx];
          window.MuseumEngine.focusTarget(
            item.cam.x,
            item.cam.y,
            item.cam.z,
            item.look.x,
            item.look.y,
            item.look.z,
          );
          teleportAvatarToExhibit(
            item.cam.x,
            item.cam.z,
            item.look.x,
            item.look.z,
          );
          updateHUD(item.title, item.desc);
        } else if (idx === 4) {
          const r = reasonsCycle[currentReasonIndex];
          window.MuseumEngine.focusTarget(
            r.cam.x,
            r.cam.y,
            r.cam.z,
            r.look.x,
            r.look.y,
            r.look.z,
          );
          teleportAvatarToExhibit(r.cam.x, r.cam.z, r.look.x, r.look.z);
          updateHUD(r.title, r.desc);
          if (btnR1Reasons) btnR1Reasons.textContent = r.label;
          currentReasonIndex = (currentReasonIndex + 1) % 3;
        }
      });
    });

    // 3. Nút Phòng 3
    const btnViewDark = document.getElementById("btn-view-dark");
    const btnViewLight = document.getElementById("btn-view-light");
    if (btnViewDark) {
      btnViewDark.addEventListener("click", () => {
        window.MuseumEngine.focusTarget(-5.6, 1.8, 0, -8.85, 2.1, 0);
        teleportAvatarToExhibit(-5.6, 0, -8.85, 0);
        updateHUD(
          "Mảng Tối: 5 Hạn Chế Thể Chế Cần Giải Quyết",
          "Luật pháp chồng chéo, rào cản tự do kinh doanh, thị trường sơ khai, phân hóa giàu nghèo và năng lực điều hành nhà nước chưa đồng bộ.",
        );
      });
    }
    if (btnViewLight) {
      btnViewLight.addEventListener("click", () => {
        window.MuseumEngine.focusTarget(5.6, 1.8, -1.3, 8.85, 2.1, -1.3);
        teleportAvatarToExhibit(5.6, -1.3, 8.85, -1.3);
        updateHUD(
          "Mảng Sáng: 4 Nhóm Giải Pháp Hoàn Thiện Thể Chế",
          "(1) Hoàn thiện thể chế sở hữu; (2) Phát triển đồng bộ các loại thị trường; (3) Hội nhập kinh tế quốc tế; (4) Nâng cao năng lực lãnh đạo của Đảng.",
        );
      });
    }

    // 4. Nút Reset góc chuẩn
    const btnResetCam = document.getElementById("btn-reset-cam");
    if (btnResetCam) {
      btnResetCam.addEventListener("click", () => {
        currentReasonIndex = 0;
        if (btnR1Reasons) btnR1Reasons.textContent = "3 Lý Do Tất Yếu (1/3)";
        window.MuseumEngine.resetCamera();
      });
    }

    // Thu nhỏ / mở rộng HUD
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

    // Bắt sự kiện bàn phím
    window.addEventListener("keydown", (e) => {
      const k = e.key.toLowerCase();
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

    setupMobileControls(keys);
  }

  return { init, updateHUD, teleportAvatarToExhibit };
})();
