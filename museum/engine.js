// museum/engine.js - Quản lý Three.js Engine & Hệ thống Camera 3D Shift-Lock chuẩn Roblox (Góc nhìn thứ ba qua vai phải)
window.MuseumEngine = (() => {
  let container, renderer, scene, camera;
  let currentRoom = 1;
  let animId = null;
  const interactableObjects = [];
  const keys = { w: false, a: false, s: false, d: false };

  // Thông số chuẩn Camera Shift-Lock (Roblox Over-The-Shoulder)
  const CAM_DISTANCE = 3.2; // Khoảng cách cố định phía sau nhân vật (3.2 đơn vị)
  const CAM_RIGHT_OFFSET = 0.45; // Lệch sang vai phải nhân vật (0.45 đơn vị)
  const CAM_PIVOT_Y = 1.62; // Độ cao ngang vai/đầu sinh viên UIT
  const MIN_PITCH = THREE.MathUtils.degToRad(-35); // Giới hạn góc cúi/ngẩng (-35 độ)
  const MAX_PITCH = THREE.MathUtils.degToRad(55); // Giới hạn góc ngẩng/cúi (+55 độ)

  let camYaw = 0; // Góc xoay ngang (radian), 0 = hướng về -Z
  let camPitch = 0.04; // Góc ngẩng/cúi (radian)

  // Giới hạn chống xuyên tường cho Camera trong 4 bức tường từng phòng
  const roomCameraBounds = {
    1: {
      minX: -8.55,
      maxX: 8.55,
      minZ: -6.55,
      maxZ: 6.55,
      minY: 0.35,
      maxY: 4.05,
    },
    2: {
      minX: -8.55,
      maxX: 8.55,
      minZ: -7.05,
      maxZ: 7.05,
      minY: 0.35,
      maxY: 4.25,
    },
    3: {
      minX: -9.55,
      maxX: 9.55,
      minZ: -6.55,
      maxZ: 6.55,
      minY: 0.35,
      maxY: 4.15,
    },
  };

  // Vị trí đứng mặc định của nhân vật ở từng phòng
  const roomSpawnPresets = {
    1: { x: 0, z: 2.4, yaw: 0, pitch: 0.04 },
    2: { x: 0, z: 3.0, yaw: 0, pitch: 0.04 },
    3: { x: 0, z: 4.4, yaw: 0, pitch: 0.04 },
  };

  function wrapCanvasText(ctx, text, x, y, maxWidth, lineHeight, maxLines = 2) {
    const words = String(text || "").split(" ");
    let line = "";
    let linesDrawn = 0;
    let curY = y;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + " ";
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && n > 0) {
        linesDrawn++;
        if (linesDrawn >= maxLines) {
          ctx.fillText(line.trim() + "…", x, curY);
          return curY + lineHeight;
        }
        ctx.fillText(line.trim(), x, curY);
        line = words[n] + " ";
        curY += lineHeight;
      } else {
        line = testLine;
      }
    }
    if (line.trim()) {
      ctx.fillText(line.trim(), x, curY);
      curY += lineHeight;
    }
    return curY;
  }

  function createParquetTexture() {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#8d6e63";
    ctx.fillRect(0, 0, 1024, 1024);

    const plankW = 128;
    const plankH = 32;
    const colors = ["#825d48", "#744f3b", "#8e6750", "#6d4734", "#7e5641"];
    for (let y = 0; y < 1024; y += plankH) {
      for (let x = 0; x < 1024; x += plankW) {
        ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
        ctx.fillRect(x, y, plankW - 2, plankH - 2);
        ctx.fillStyle = "rgba(0,0,0,0.12)";
        ctx.fillRect(x, y + plankH - 2, plankW, 2);
        ctx.fillRect(x + plankW - 2, y, 2, plankH);
      }
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(6, 6);
    return tex;
  }

  function createWallTexture() {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#f1ece4";
    ctx.fillRect(0, 0, 512, 512);

    for (let i = 0; i < 3000; i++) {
      ctx.fillStyle =
        Math.random() > 0.5 ? "rgba(0,0,0,0.015)" : "rgba(255,255,255,0.03)";
      ctx.fillRect(Math.random() * 512, Math.random() * 512, 2, 2);
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(4, 2);
    return tex;
  }

  function createArtworkTexture(
    title,
    subtitle,
    badgeText,
    tagColor,
    descLines,
  ) {
    const canvas = document.createElement("canvas");
    canvas.width = 2048;
    canvas.height = 1400;
    const ctx = canvas.getContext("2d");

    const bgGrad = ctx.createLinearGradient(0, 0, 2048, 1400);
    bgGrad.addColorStop(0, "#131824");
    bgGrad.addColorStop(1, "#0b0f17");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 2048, 1400);

    ctx.fillStyle = "rgba(255, 255, 255, 0.03)";
    ctx.fillRect(40, 40, 1968, 1320);

    ctx.fillStyle = tagColor || "#d97706";
    ctx.fillRect(96, 92, 22, 210);

    ctx.fillStyle = tagColor || "#f59e0b";
    ctx.font = "bold 42px 'Segoe UI', Tahoma, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText((badgeText || "CHỦ ĐỀ LÝ LUẬN").toUpperCase(), 145, 138);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 66px 'Segoe UI', Tahoma, sans-serif";
    wrapCanvasText(ctx, title, 145, 218, 1780, 76, 1);

    ctx.fillStyle = "#94a3b8";
    ctx.font = "italic 40px 'Segoe UI', Tahoma, sans-serif";
    wrapCanvasText(ctx, subtitle, 145, 295, 1780, 52, 1);

    ctx.strokeStyle = tagColor || "rgba(217, 119, 6, 0.55)";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(145, 345);
    ctx.lineTo(1920, 345);
    ctx.stroke();

    ctx.fillStyle = "#f1f5f9";
    ctx.font = "500 48px 'Segoe UI', Tahoma, sans-serif";
    let curY = 445;

    if (Array.isArray(descLines)) {
      descLines.slice(0, 4).forEach((line) => {
        curY = wrapCanvasText(ctx, line, 145, curY, 1760, 66, 2);
        curY += 26;
      });
    }

    ctx.fillStyle = "rgba(245, 158, 11, 0.9)";
    ctx.font = "bold 34px 'Segoe UI', Tahoma, sans-serif";
    ctx.fillText(
      "NHẤP VÀO TRANH ĐỂ MỞ BẢNG THÔNG TIN HIỆN VẬT (HOẶC BẬT CHẾ ĐỘ THUYẾT TRÌNH)",
      145,
      1310,
    );

    ctx.strokeStyle = "rgba(255,255,255,0.16)";
    ctx.lineWidth = 12;
    ctx.strokeRect(20, 20, 2008, 1360);

    const tex = new THREE.CanvasTexture(canvas);
    tex.anisotropy = 8;
    return tex;
  }

  function createPlacardTexture(title, subtitle) {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 360;
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, 1024, 360);
    ctx.strokeStyle = "#cbd5e1";
    ctx.lineWidth = 8;
    ctx.strokeRect(8, 8, 1008, 344);

    ctx.fillStyle = "#0f172a";
    ctx.font = "bold 44px 'Segoe UI', Tahoma, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(String(title).slice(0, 42), 512, 125);

    ctx.fillStyle = "#475569";
    ctx.font = "34px 'Segoe UI', Tahoma, sans-serif";
    ctx.fillText(String(subtitle).slice(0, 54), 512, 210);

    ctx.fillStyle = "#d97706";
    ctx.font = "bold 30px 'Segoe UI', Tahoma, sans-serif";
    ctx.fillText("NHẤP ĐỂ MỞ BẢNG THÔNG TIN", 512, 292);

    const tex = new THREE.CanvasTexture(canvas);
    tex.anisotropy = 4;
    return tex;
  }

  function createComparisonBoardTexture(title, rows) {
    const canvas = document.createElement("canvas");
    canvas.width = 2400;
    canvas.height = 1500;
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, 2400, 1500);

    const grad = ctx.createLinearGradient(0, 0, 2400, 0);
    grad.addColorStop(0, "#7c2d12");
    grad.addColorStop(0.5, "#b45309");
    grad.addColorStop(1, "#065f46");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 2400, 140);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 54px 'Segoe UI', Tahoma, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(title.toUpperCase(), 1200, 92);

    const startX = 60;
    const startY = 175;
    const colWidths = [480, 880, 920];
    const rowHeight = 195;

    ctx.fillStyle = "#1e293b";
    ctx.fillRect(startX, startY, 2280, 88);
    ctx.font = "bold 40px 'Segoe UI', Tahoma, sans-serif";
    ctx.textAlign = "left";

    ctx.fillStyle = "#fbbf24";
    ctx.fillText("TIÊU CHÍ SO SÁNH", startX + 24, startY + 58);
    ctx.fillStyle = "#fda4af";
    ctx.fillText(
      "KTTT TƯ BẢN CHỦ NGHĨA",
      startX + colWidths[0] + 24,
      startY + 58,
    );
    ctx.fillStyle = "#6ee7b7";
    ctx.fillText(
      "KTTT ĐỊNH HƯỚNG XHCN VIỆT NAM",
      startX + colWidths[0] + colWidths[1] + 24,
      startY + 58,
    );

    rows.forEach((r, idx) => {
      const y = startY + 102 + idx * rowHeight;
      ctx.fillStyle =
        idx % 2 === 0 ? "rgba(30, 41, 59, 0.75)" : "rgba(15, 23, 42, 0.9)";
      ctx.fillRect(startX, y, 2280, rowHeight - 12);

      ctx.fillStyle = "#fbbf24";
      ctx.font = "bold 36px 'Segoe UI', Tahoma, sans-serif";
      wrapCanvasText(
        ctx,
        r.criteria,
        startX + 24,
        y + 65,
        colWidths[0] - 40,
        46,
        2,
      );

      ctx.fillStyle = "#fecdd3";
      ctx.font = "34px 'Segoe UI', Tahoma, sans-serif";
      wrapCanvasText(
        ctx,
        r.capitalist,
        startX + colWidths[0] + 24,
        y + 62,
        colWidths[1] - 44,
        46,
        3,
      );

      ctx.fillStyle = "#d1fae5";
      ctx.font = "bold 34px 'Segoe UI', Tahoma, sans-serif";
      wrapCanvasText(
        ctx,
        r.socialist,
        startX + colWidths[0] + colWidths[1] + 24,
        y + 62,
        colWidths[2] - 44,
        46,
        3,
      );
    });

    ctx.strokeStyle = "rgba(245, 158, 11, 0.5)";
    ctx.lineWidth = 10;
    ctx.strokeRect(16, 16, 2368, 1468);

    const tex = new THREE.CanvasTexture(canvas);
    tex.anisotropy = 8;
    return tex;
  }

  function createGalleryFrame(width, height, artTexture, placardTexture, data) {
    const group = new THREE.Group();

    const outerFrameGeo = new THREE.BoxGeometry(
      width + 0.16,
      height + 0.16,
      0.08,
    );
    const outerFrameMat = new THREE.MeshStandardMaterial({
      color: 0x1f242d,
      roughness: 0.35,
      metalness: 0.8,
    });
    const outerFrame = new THREE.Mesh(outerFrameGeo, outerFrameMat);
    outerFrame.castShadow = true;
    group.add(outerFrame);

    const canvasGeo = new THREE.PlaneGeometry(width, height);
    const canvasMat = new THREE.MeshStandardMaterial({
      map: artTexture,
      roughness: 0.4,
      metalness: 0.05,
    });
    const canvasMesh = new THREE.Mesh(canvasGeo, canvasMat);
    canvasMesh.position.z = 0.042;
    group.add(canvasMesh);

    const placardGeo = new THREE.PlaneGeometry(0.85, 0.3);
    const placardMat = new THREE.MeshStandardMaterial({
      map: placardTexture,
      roughness: 0.5,
    });
    const placardMesh = new THREE.Mesh(placardGeo, placardMat);
    placardMesh.position.set(0, -(height / 2 + 0.28), 0.042);
    group.add(placardMesh);

    canvasMesh.userData = data;
    outerFrame.userData = data;
    placardMesh.userData = data;
    group.userData = data;

    interactableObjects.push(canvasMesh);
    interactableObjects.push(placardMesh);

    return group;
  }

  function createBench(x, z) {
    const bench = new THREE.Group();
    bench.position.set(x, 0, z);

    const seatGeo = new THREE.BoxGeometry(2.4, 0.08, 0.85);
    const seatMat = new THREE.MeshStandardMaterial({
      color: 0x27272a,
      roughness: 0.5,
    });
    const seat = new THREE.Mesh(seatGeo, seatMat);
    seat.position.y = 0.45;
    seat.castShadow = true;
    bench.add(seat);

    const legGeo = new THREE.BoxGeometry(0.08, 0.4, 0.75);
    const legMat = new THREE.MeshStandardMaterial({
      color: 0xa1a1aa,
      metalness: 0.9,
      roughness: 0.2,
    });

    const leg1 = new THREE.Mesh(legGeo, legMat);
    leg1.position.set(-0.95, 0.2, 0);
    leg1.castShadow = true;
    bench.add(leg1);

    const leg2 = new THREE.Mesh(legGeo, legMat);
    leg2.position.set(0.95, 0.2, 0);
    leg2.castShadow = true;
    bench.add(leg2);

    scene.add(bench);
  }

  function createArchitecturalRoom(width, depth, height) {
    const room = new THREE.Group();

    const parquetTex = createParquetTexture();
    const floorGeo = new THREE.PlaneGeometry(width, depth);
    const floorMat = new THREE.MeshStandardMaterial({
      map: parquetTex,
      roughness: 0.4,
      metalness: 0.1,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    room.add(floor);

    const ceilingGeo = new THREE.PlaneGeometry(width, depth);
    const ceilingMat = new THREE.MeshStandardMaterial({
      color: 0x18181b,
      roughness: 0.95,
    });
    const ceiling = new THREE.Mesh(ceilingGeo, ceilingMat);
    ceiling.position.y = height;
    ceiling.rotation.x = Math.PI / 2;
    room.add(ceiling);

    const wallTex = createWallTexture();
    const wallMat = new THREE.MeshStandardMaterial({
      map: wallTex,
      roughness: 0.85,
      metalness: 0.02,
    });

    // Tường sau (-Z)
    const backWall = new THREE.Mesh(
      new THREE.PlaneGeometry(width, height),
      wallMat,
    );
    backWall.position.set(0, height / 2, -depth / 2);
    backWall.receiveShadow = true;
    room.add(backWall);

    // Tường trước (+Z) khép kín 4 bức tường bảo tàng
    const frontWall = new THREE.Mesh(
      new THREE.PlaneGeometry(width, height),
      wallMat,
    );
    frontWall.position.set(0, height / 2, depth / 2);
    frontWall.rotation.y = Math.PI;
    frontWall.receiveShadow = true;
    room.add(frontWall);

    // Tường trái (-X)
    const leftWall = new THREE.Mesh(
      new THREE.PlaneGeometry(depth, height),
      wallMat,
    );
    leftWall.position.set(-width / 2, height / 2, 0);
    leftWall.rotation.y = Math.PI / 2;
    leftWall.receiveShadow = true;
    room.add(leftWall);

    // Tường phải (+X)
    const rightWall = new THREE.Mesh(
      new THREE.PlaneGeometry(depth, height),
      wallMat,
    );
    rightWall.position.set(width / 2, height / 2, 0);
    rightWall.rotation.y = -Math.PI / 2;
    rightWall.receiveShadow = true;
    room.add(rightWall);

    const trimMat = new THREE.MeshStandardMaterial({
      color: 0x27272a,
      roughness: 0.4,
    });
    const backTrim = new THREE.Mesh(
      new THREE.BoxGeometry(width, 0.15, 0.04),
      trimMat,
    );
    backTrim.position.set(0, 0.075, -depth / 2 + 0.02);
    room.add(backTrim);

    const frontTrim = new THREE.Mesh(
      new THREE.BoxGeometry(width, 0.15, 0.04),
      trimMat,
    );
    frontTrim.position.set(0, 0.075, depth / 2 - 0.02);
    room.add(frontTrim);

    const leftTrim = new THREE.Mesh(
      new THREE.BoxGeometry(depth, 0.15, 0.04),
      trimMat,
    );
    leftTrim.position.set(-width / 2 + 0.02, 0.075, 0);
    leftTrim.rotation.y = Math.PI / 2;
    room.add(leftTrim);

    const rightTrim = new THREE.Mesh(
      new THREE.BoxGeometry(depth, 0.15, 0.04),
      trimMat,
    );
    rightTrim.position.set(width / 2 - 0.02, 0.075, 0);
    rightTrim.rotation.y = -Math.PI / 2;
    room.add(rightTrim);

    scene.add(room);
  }

  // Giải phóng đầy đủ texture và material để tránh rò rỉ bộ nhớ GPU/WebGL khi chuyển phòng
  function disposeMaterial(mat) {
    if (!mat) return;
    const textureSlots = [
      "map",
      "lightMap",
      "bumpMap",
      "normalMap",
      "emissiveMap",
      "roughnessMap",
      "metalnessMap",
      "alphaMap",
      "aoMap",
      "specularMap",
      "envMap",
    ];
    textureSlots.forEach((slot) => {
      if (mat[slot] && typeof mat[slot].dispose === "function") {
        mat[slot].dispose();
      }
    });
    if (typeof mat.dispose === "function") {
      mat.dispose();
    }
  }

  function clearScene() {
    interactableObjects.length = 0;
    while (scene.children.length > 0) {
      const obj = scene.children[0];
      scene.remove(obj);
      if (typeof obj.traverse === "function") {
        obj.traverse((child) => {
          if (child.geometry && typeof child.geometry.dispose === "function") {
            child.geometry.dispose();
          }
          if (child.material) {
            if (Array.isArray(child.material)) {
              child.material.forEach(disposeMaterial);
            } else {
              disposeMaterial(child.material);
            }
          }
        });
      }
    }
  }

  function setRoom(roomNumber) {
    if (currentRoom === roomNumber && scene && scene.children.length > 0) {
      return;
    }
    currentRoom = roomNumber;
    clearScene();
    loadRoom(roomNumber);
  }

  function getCurrentRoom() {
    return currentRoom;
  }

  // Cập nhật tọa độ và hướng nhìn Camera Shift-Lock (luôn khóa sau lưng lệch vai phải nhân vật + chống xuyên tường)
  function updateShiftLockCamera() {
    if (!camera || !window.MuseumAvatar) return;
    const avatar = window.MuseumAvatar.getAvatar();
    if (!avatar) return;

    const bounds = roomCameraBounds[currentRoom] || roomCameraBounds[1];

    // Nhân vật luôn xoay lưng về phía camera và hướng mặt theo góc nhìn ngang (camYaw)
    avatar.rotation.y = -camYaw;

    // Vector ngang bên phải nhân vật
    const rightX = Math.cos(camYaw);
    const rightZ = Math.sin(camYaw);

    // Điểm tựa vai phải của sinh viên UIT (lệch phải 0.45 đơn vị, cao 1.62 đơn vị)
    const pivotX = THREE.MathUtils.clamp(
      avatar.position.x + rightX * CAM_RIGHT_OFFSET,
      bounds.minX + 0.2,
      bounds.maxX - 0.2,
    );
    const pivotY = avatar.position.y + CAM_PIVOT_Y;
    const pivotZ = THREE.MathUtils.clamp(
      avatar.position.z + rightZ * CAM_RIGHT_OFFSET,
      bounds.minZ + 0.2,
      bounds.maxZ - 0.2,
    );

    // Hướng nhìn 3D của camera theo (camYaw, camPitch)
    const cosPitch = Math.cos(camPitch);
    const lookDirX = Math.sin(camYaw) * cosPitch;
    const lookDirY = Math.sin(camPitch);
    const lookDirZ = -Math.cos(camYaw) * cosPitch;

    // Vị trí mong muốn của camera ở phía sau vai phải 3.2 đơn vị
    const offsetX = -lookDirX * CAM_DISTANCE;
    const offsetY = -lookDirY * CAM_DISTANCE;
    const offsetZ = -lookDirZ * CAM_DISTANCE;

    // Chống xuyên tường: thu ngắn khoảng cách tia camera nếu chạm vào 4 bức tường / sàn / trần
    let maxScale = 1.0;
    if (offsetX < -0.0001 && pivotX + offsetX < bounds.minX) {
      maxScale = Math.min(maxScale, (bounds.minX - pivotX) / offsetX);
    } else if (offsetX > 0.0001 && pivotX + offsetX > bounds.maxX) {
      maxScale = Math.min(maxScale, (bounds.maxX - pivotX) / offsetX);
    }

    if (offsetZ < -0.0001 && pivotZ + offsetZ < bounds.minZ) {
      maxScale = Math.min(maxScale, (bounds.minZ - pivotZ) / offsetZ);
    } else if (offsetZ > 0.0001 && pivotZ + offsetZ > bounds.maxZ) {
      maxScale = Math.min(maxScale, (bounds.maxZ - pivotZ) / offsetZ);
    }

    if (offsetY < -0.0001 && pivotY + offsetY < bounds.minY) {
      maxScale = Math.min(maxScale, (bounds.minY - pivotY) / offsetY);
    } else if (offsetY > 0.0001 && pivotY + offsetY > bounds.maxY) {
      maxScale = Math.min(maxScale, (bounds.maxY - pivotY) / offsetY);
    }

    maxScale = THREE.MathUtils.clamp(maxScale, 0.15, 1.0);

    const finalCamX = THREE.MathUtils.clamp(
      pivotX + offsetX * maxScale,
      bounds.minX,
      bounds.maxX,
    );
    const finalCamY = THREE.MathUtils.clamp(
      pivotY + offsetY * maxScale,
      bounds.minY,
      bounds.maxY,
    );
    const finalCamZ = THREE.MathUtils.clamp(
      pivotZ + offsetZ * maxScale,
      bounds.minZ,
      bounds.maxZ,
    );

    camera.position.set(finalCamX, finalCamY, finalCamZ);
    camera.lookAt(
      finalCamX + lookDirX * 10,
      finalCamY + lookDirY * 10,
      finalCamZ + lookDirZ * 10,
    );
  }

  function rotateCamera(deltaYaw, deltaPitch) {
    camYaw += deltaYaw;
    camPitch = THREE.MathUtils.clamp(
      camPitch + deltaPitch,
      MIN_PITCH,
      MAX_PITCH,
    );
    updateShiftLockCamera();
  }

  function setCameraAngles(yaw, pitch) {
    camYaw = yaw;
    if (typeof pitch === "number") {
      camPitch = THREE.MathUtils.clamp(pitch, MIN_PITCH, MAX_PITCH);
    }
    updateShiftLockCamera();
  }

  function getCameraAngles() {
    return { yaw: camYaw, pitch: camPitch };
  }

  // Đồng bộ vị trí sinh viên UIT và góc nhìn Shift-Lock tới trước một hiện vật
  function syncAvatarToExhibit(camX, camY, camZ, lookX, lookY, lookZ) {
    if (!window.MuseumAvatar) return;
    const avatar = window.MuseumAvatar.getAvatar();
    if (!avatar) return;

    const dirX = lookX - camX;
    const dirZ = lookZ - camZ;
    const len = Math.hypot(dirX, dirZ) || 1;
    const unitDirX = dirX / len;
    const unitDirZ = dirZ / len;

    // Đặt nhân vật đứng trước hiện vật khoảng 2.6 đơn vị (nằm gọn trong giới hạn phòng)
    const avatarBounds = window.MuseumAvatar.getRoomBounds(currentRoom);
    const targetAvatarX = THREE.MathUtils.clamp(
      lookX - unitDirX * 2.6,
      avatarBounds.minX,
      avatarBounds.maxX,
    );
    const targetAvatarZ = THREE.MathUtils.clamp(
      lookZ - unitDirZ * 2.6,
      avatarBounds.minZ,
      avatarBounds.maxZ,
    );

    avatar.position.set(targetAvatarX, 0, targetAvatarZ);

    // Tính góc yaw để mặt nhân vật và camera hướng thẳng vào hiện vật
    camYaw = Math.atan2(unitDirX, -unitDirZ);
    camPitch = 0.05;
    updateShiftLockCamera();
  }

  // Giữ tương thích hàm focusTarget: đồng bộ trực tiếp nhân vật & camera Shift-Lock
  function focusTarget(camX, camY, camZ, lookX, lookY, lookZ) {
    syncAvatarToExhibit(camX, camY, camZ, lookX, lookY, lookZ);
  }

  function cancelTransition() {
    // Không còn dùng hiệu ứng bay camera tách rời
  }

  function resetCamera() {
    const preset = roomSpawnPresets[currentRoom] || roomSpawnPresets[1];
    if (window.MuseumAvatar) {
      const avatar = window.MuseumAvatar.getAvatar();
      if (avatar) {
        avatar.position.set(preset.x, 0, preset.z);
      }
    }
    camYaw = preset.yaw;
    camPitch = preset.pitch;
    updateShiftLockCamera();
  }

  function loadRoom(roomNumber) {
    const hemiLight = new THREE.HemisphereLight(0xfff6ea, 0x1e222d, 0.8);
    scene.add(hemiLight);

    const ambLight = new THREE.AmbientLight(0xfff5eb, 0.4);
    scene.add(ambLight);

    if (window.MuseumAvatar && window.MuseumAvatar.create) {
      const avatar = window.MuseumAvatar.create();
      scene.add(avatar);
    }

    if (roomNumber === 1 && window.MuseumRoom1) window.MuseumRoom1.build(scene);
    else if (roomNumber === 2 && window.MuseumRoom2)
      window.MuseumRoom2.build(scene);
    else if (roomNumber === 3 && window.MuseumRoom3)
      window.MuseumRoom3.build(scene);

    resetCamera();
  }

  function onWindowResize() {
    if (!container || !camera || !renderer) return;
    const width =
      container.clientWidth > 0 ? container.clientWidth : window.innerWidth;
    const height =
      container.clientHeight > 0 ? container.clientHeight : window.innerHeight;
    if (width === 0 || height === 0) return;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }

  function animate() {
    animId = requestAnimationFrame(animate);

    if (window.MuseumAvatar && window.MuseumAvatar.updateWalking) {
      window.MuseumAvatar.updateWalking(camYaw, keys, currentRoom);
    }

    updateShiftLockCamera();
    renderer.render(scene, camera);
  }

  function init() {
    if (renderer) {
      onWindowResize();
      return;
    }

    if (typeof THREE === "undefined") {
      setTimeout(init, 50);
      return;
    }

    container = document.getElementById("webgl-container");
    if (!container) return;

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0c10);

    const width =
      container.clientWidth > 0 ? container.clientWidth : window.innerWidth;
    const height =
      container.clientHeight > 0 ? container.clientHeight : window.innerHeight;

    camera = new THREE.PerspectiveCamera(54, width / height, 0.1, 100);

    renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2.0));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    if (THREE.sRGBEncoding) renderer.outputEncoding = THREE.sRGBEncoding;

    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    window.addEventListener("resize", onWindowResize);

    loadRoom(1);

    if (window.MuseumControls && window.MuseumControls.init) {
      window.MuseumControls.init(camera, renderer.domElement, keys);
    }

    animate();
  }

  return {
    init,
    setRoom,
    getCurrentRoom,
    resetCamera,
    focusTarget,
    syncAvatarToExhibit,
    rotateCamera,
    setCameraAngles,
    getCameraAngles,
    cancelTransition,
    onWindowResize,
    getScene: () => scene,
    getRenderer: () => renderer,
    interactableObjects,
    createArtworkTexture,
    createPlacardTexture,
    createComparisonBoardTexture,
    createGalleryFrame,
    createBench,
    createArchitecturalRoom,
  };
})();

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () =>
    window.MuseumEngine.init(),
  );
} else {
  window.MuseumEngine.init();
}
