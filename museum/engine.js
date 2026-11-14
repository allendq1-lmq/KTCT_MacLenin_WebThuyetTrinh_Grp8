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
    ctx.fillStyle = "#5c4033";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const plankW = 128;
    const plankH = 32;
    const colors = ["#5e412f", "#513728", "#684936", "#4a3123", "#614331"];
    for (let y = 0; y < canvas.height; y += plankH) {
      const rowOffset = ((y / plankH) % 2) * (plankW / 2);
      for (let x = -plankW; x < canvas.width; x += plankW) {
        const px = x + rowOffset;
        ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
        ctx.fillRect(px, y, plankW - 2, plankH - 2);
        ctx.fillStyle = "rgba(0,0,0,0.18)";
        ctx.fillRect(px, y + plankH - 2, plankW, 2);
        ctx.fillRect(px + plankW - 2, y, 2, plankH);
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

    // Tông màu tường phòng trưng bày ấm dịu (warm gallery taupe/greige) chống chói mắt
    const wallGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    wallGrad.addColorStop(0, "#cfc7ba");
    wallGrad.addColorStop(0.76, "#d6cfc2");
    wallGrad.addColorStop(0.77, "#b8afa0");
    wallGrad.addColorStop(1, "#bdb4a5");
    ctx.fillStyle = wallGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < 2400; i++) {
      ctx.fillStyle =
        Math.random() > 0.5 ? "rgba(0,0,0,0.018)" : "rgba(255,255,255,0.018)";
      ctx.fillRect(
        Math.random() * canvas.width,
        Math.random() * canvas.height,
        2,
        2,
      );
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(4, 1);
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
    bgGrad.addColorStop(0, "#111827");
    bgGrad.addColorStop(1, "#090d16");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 2048, 1400);

    // Lớp bo passepartout chống lóa tạo chiều sâu cho tranh
    ctx.fillStyle = "rgba(255, 255, 255, 0.025)";
    ctx.fillRect(44, 44, 1960, 1312);
    ctx.strokeStyle = "rgba(245, 158, 11, 0.28)";
    ctx.lineWidth = 4;
    ctx.strokeRect(56, 56, 1936, 1288);

    ctx.fillStyle = tagColor || "#d97706";
    ctx.fillRect(96, 92, 22, 210);

    ctx.fillStyle = tagColor || "#f59e0b";
    ctx.font = "bold 42px 'Segoe UI', Tahoma, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText((badgeText || "CHỦ ĐỀ LÝ LUẬN").toUpperCase(), 145, 138);

    ctx.fillStyle = "#f8fafc";
    ctx.font = "bold 66px 'Segoe UI', Tahoma, sans-serif";
    wrapCanvasText(ctx, title, 145, 218, 1780, 76, 1);

    ctx.fillStyle = "#cbd5e1";
    ctx.font = "italic 40px 'Segoe UI', Tahoma, sans-serif";
    wrapCanvasText(ctx, subtitle, 145, 295, 1780, 52, 1);

    ctx.strokeStyle = tagColor || "rgba(217, 119, 6, 0.65)";
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

    ctx.fillStyle = "rgba(251, 191, 36, 0.95)";
    ctx.font = "bold 34px 'Segoe UI', Tahoma, sans-serif";
    ctx.fillText(
      "NHẤP VÀO TRANH ĐỂ MỞ BẢNG THÔNG TIN HIỆN VẬT",
      145,
      1305,
    );

    ctx.strokeStyle = "rgba(255,255,255,0.14)";
    ctx.lineWidth = 10;
    ctx.strokeRect(22, 22, 2004, 1356);

    const tex = new THREE.CanvasTexture(canvas);
    tex.anisotropy = 4;
    return tex;
  }

  function createPlacardTexture(title, subtitle) {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 360;
    const ctx = canvas.getContext("2d");

    // Nền bảng chú thích tối dịu (dark gallery plaque) chống cháy sáng, tương phản chữ cao
    const bgGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    bgGrad.addColorStop(0, "#161f30");
    bgGrad.addColorStop(1, "#0f172a");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "#d97706";
    ctx.lineWidth = 8;
    ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);

    ctx.strokeStyle = "rgba(251, 191, 36, 0.35)";
    ctx.lineWidth = 3;
    ctx.strokeRect(24, 24, canvas.width - 48, canvas.height - 48);

    ctx.fillStyle = "#f8fafc";
    ctx.font = "bold 42px 'Segoe UI', Tahoma, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(String(title).slice(0, 44), canvas.width / 2, 122);

    ctx.fillStyle = "#cbd5e1";
    ctx.font = "32px 'Segoe UI', Tahoma, sans-serif";
    ctx.fillText(String(subtitle).slice(0, 56), canvas.width / 2, 205);

    ctx.fillStyle = "#fbbf24";
    ctx.font = "bold 28px 'Segoe UI', Tahoma, sans-serif";
    ctx.fillText("◆ NHẤP ĐỂ MỞ BẢNG THÔNG TIN ◆", canvas.width / 2, 294);

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

    ctx.fillStyle = "#f8fafc";
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
        idx % 2 === 0 ? "rgba(30, 41, 59, 0.82)" : "rgba(15, 23, 42, 0.94)";
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
    tex.anisotropy = 4;
    return tex;
  }

  function createGalleryFrame(width, height, artTexture, placardTexture, data) {
    const group = new THREE.Group();

    // Khung viền ngoài có chiều sâu kiến trúc
    const outerFrameGeo = new THREE.BoxGeometry(
      width + 0.2,
      height + 0.2,
      0.085,
    );
    const outerFrameMat = new THREE.MeshStandardMaterial({
      color: 0x1c2026,
      roughness: 0.48,
      metalness: 0.55,
    });
    const outerFrame = new THREE.Mesh(outerFrameGeo, outerFrameMat);
    outerFrame.castShadow = true;
    outerFrame.receiveShadow = true;
    group.add(outerFrame);

    // Viền chỉ vàng đồng bên trong (inner bevel liner) tạo chiều sâu cho khung tranh
    const innerBevelGeo = new THREE.BoxGeometry(
      width + 0.06,
      height + 0.06,
      0.092,
    );
    const innerBevelMat = new THREE.MeshStandardMaterial({
      color: 0xb45309,
      roughness: 0.55,
      metalness: 0.35,
    });
    const innerBevel = new THREE.Mesh(innerBevelGeo, innerBevelMat);
    innerBevel.position.z = 0.002;
    group.add(innerBevel);

    // Lớp nền passepartout tối nhám chống phản xạ
    const matBoardGeo = new THREE.PlaneGeometry(width + 0.02, height + 0.02);
    const matBoardMat = new THREE.MeshStandardMaterial({
      color: 0x0b0f19,
      roughness: 0.96,
      metalness: 0.0,
    });
    const matBoard = new THREE.Mesh(matBoardGeo, matBoardMat);
    matBoard.position.z = 0.049;
    group.add(matBoard);

    // Bề mặt tranh phủ lớp nhám chống lóa (matte anti-glare coating: roughness cao, metalness = 0)
    const canvasGeo = new THREE.PlaneGeometry(width, height);
    const canvasMat = new THREE.MeshStandardMaterial({
      map: artTexture,
      roughness: 0.92,
      metalness: 0.0,
    });
    const canvasMesh = new THREE.Mesh(canvasGeo, canvasMat);
    canvasMesh.position.z = 0.052;
    group.add(canvasMesh);

    // Đế bảng chú thích 3D nổi có độ dày và góc nghiêng nhẹ chống chói
    const placardY = -(height / 2 + 0.29);
    const placardBaseGeo = new THREE.BoxGeometry(0.94, 0.34, 0.036);
    const placardBaseMat = new THREE.MeshStandardMaterial({
      color: 0x27272a,
      roughness: 0.55,
      metalness: 0.4,
    });
    const placardBase = new THREE.Mesh(placardBaseGeo, placardBaseMat);
    placardBase.position.set(0, placardY, 0.038);
    placardBase.rotation.x = -0.06;
    placardBase.castShadow = true;
    group.add(placardBase);

    // Mặt bảng chú thích 3D nhám hoàn toàn, chữ sắc nét tương phản cao
    const placardGeo = new THREE.PlaneGeometry(0.88, 0.29);
    const placardMat = new THREE.MeshStandardMaterial({
      map: placardTexture,
      roughness: 0.94,
      metalness: 0.0,
    });
    const placardMesh = new THREE.Mesh(placardGeo, placardMat);
    placardMesh.position.set(0, placardY, 0.058);
    placardMesh.rotation.x = -0.06;
    group.add(placardMesh);

    canvasMesh.userData = data;
    outerFrame.userData = data;
    innerBevel.userData = data;
    placardBase.userData = data;
    placardMesh.userData = data;
    group.userData = data;

    interactableObjects.push(canvasMesh);
    interactableObjects.push(placardMesh);

    return group;
  }

  function createBench(x, z) {
    const bench = new THREE.Group();
    bench.position.set(x, 0, z);

    const seatGeo = new THREE.BoxGeometry(2.4, 0.1, 0.85);
    const seatMat = new THREE.MeshStandardMaterial({
      color: 0x27272a,
      roughness: 0.65,
      metalness: 0.1,
    });
    const seat = new THREE.Mesh(seatGeo, seatMat);
    seat.position.y = 0.46;
    seat.castShadow = true;
    seat.receiveShadow = true;
    bench.add(seat);

    const cushionGeo = new THREE.BoxGeometry(2.28, 0.05, 0.76);
    const cushionMat = new THREE.MeshStandardMaterial({
      color: 0x451a03,
      roughness: 0.8,
      metalness: 0.05,
    });
    const cushion = new THREE.Mesh(cushionGeo, cushionMat);
    cushion.position.y = 0.525;
    bench.add(cushion);

    const legGeo = new THREE.BoxGeometry(0.09, 0.42, 0.75);
    const legMat = new THREE.MeshStandardMaterial({
      color: 0x71717a,
      metalness: 0.75,
      roughness: 0.35,
    });

    const leg1 = new THREE.Mesh(legGeo, legMat);
    leg1.position.set(-0.95, 0.21, 0);
    leg1.castShadow = true;
    bench.add(leg1);

    const leg2 = new THREE.Mesh(legGeo, legMat);
    leg2.position.set(0.95, 0.21, 0);
    leg2.castShadow = true;
    bench.add(leg2);

    scene.add(bench);
  }

  // Hệ thống đèn rọi ray trần (Ceiling Track Lighting System - A4)
  function createCeilingLights(width, depth, height, targetGroup) {
    const parent = targetGroup || scene;
    if (!parent) return null;

    const lightsGroup = new THREE.Group();
    lightsGroup.name = "ceiling-lights-system";

    const railMat = new THREE.MeshStandardMaterial({
      color: 0x18181b,
      roughness: 0.5,
      metalness: 0.7,
    });
    const fixtureMat = new THREE.MeshStandardMaterial({
      color: 0x27272a,
      roughness: 0.4,
      metalness: 0.75,
    });
    const bulbMat = new THREE.MeshBasicMaterial({
      color: 0xfff3d1,
    });

    const trackOffsetX = Math.max(2.6, width * 0.32);
    const trackLenZ = Math.max(4.0, depth - 3.2);
    const trackLenX = Math.max(4.0, width - 5.2);
    const railY = height - 0.05;

    // 3 thanh ray đèn trần (Trái, Phải, Sau)
    const leftRail = new THREE.Mesh(
      new THREE.BoxGeometry(0.07, 0.04, trackLenZ),
      railMat,
    );
    leftRail.position.set(-trackOffsetX, railY, 0);
    lightsGroup.add(leftRail);

    const rightRail = new THREE.Mesh(
      new THREE.BoxGeometry(0.07, 0.04, trackLenZ),
      railMat,
    );
    rightRail.position.set(trackOffsetX, railY, 0);
    lightsGroup.add(rightRail);

    const backRail = new THREE.Mesh(
      new THREE.BoxGeometry(trackLenX, 0.04, 0.07),
      railMat,
    );
    backRail.position.set(0, railY, -depth / 2 + 2.2);
    lightsGroup.add(backRail);

    const fixturePositions = [
      { x: -trackOffsetX, z: -trackLenZ * 0.35 },
      { x: -trackOffsetX, z: 0 },
      { x: -trackOffsetX, z: trackLenZ * 0.35 },
      { x: trackOffsetX, z: -trackLenZ * 0.35 },
      { x: trackOffsetX, z: 0 },
      { x: trackOffsetX, z: trackLenZ * 0.35 },
      { x: -trackLenX * 0.32, z: -depth / 2 + 2.2 },
      { x: 0, z: -depth / 2 + 2.2 },
      { x: trackLenX * 0.32, z: -depth / 2 + 2.2 },
    ];

    const housingGeo = new THREE.CylinderGeometry(0.08, 0.11, 0.18, 12);
    const lensGeo = new THREE.CylinderGeometry(0.09, 0.09, 0.02, 12);

    fixturePositions.forEach((pos) => {
      const housing = new THREE.Mesh(housingGeo, fixtureMat);
      housing.position.set(pos.x, height - 0.14, pos.z);
      lightsGroup.add(housing);

      const lens = new THREE.Mesh(lensGeo, bulbMat);
      lens.position.set(pos.x, height - 0.23, pos.z);
      lightsGroup.add(lens);
    });

    parent.add(lightsGroup);
    return lightsGroup;
  }

  // Hệ thống cọc chắn & dây nhung bảo vệ hiện vật (Stanchion & Velvet Rope Barrier - A4)
  function createStanchionBarrier(segments, targetGroup) {
    const parent = targetGroup || scene;
    if (!parent || !Array.isArray(segments) || segments.length === 0) return null;

    const barrierGroup = new THREE.Group();
    barrierGroup.name = "stanchion-barrier-group";

    const postMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      roughness: 0.32,
      metalness: 0.78,
    });
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x1f242d,
      roughness: 0.45,
      metalness: 0.65,
    });
    const ropeMat = new THREE.MeshStandardMaterial({
      color: 0x881337,
      roughness: 0.85,
      metalness: 0.05,
    });

    const baseGeo = new THREE.CylinderGeometry(0.15, 0.17, 0.04, 16);
    const poleGeo = new THREE.CylinderGeometry(0.028, 0.028, 0.82, 12);
    const ballGeo = new THREE.SphereGeometry(0.048, 12, 12);

    const placedPosts = new Map();
    const addPostIfMissing = (x, z) => {
      const key = `${x.toFixed(2)},${z.toFixed(2)}`;
      if (placedPosts.has(key)) return;
      placedPosts.set(key, { x, z });

      const base = new THREE.Mesh(baseGeo, baseMat);
      base.position.set(x, 0.02, z);
      barrierGroup.add(base);

      const pole = new THREE.Mesh(poleGeo, postMat);
      pole.position.set(x, 0.43, z);
      pole.castShadow = true;
      barrierGroup.add(pole);

      const finial = new THREE.Mesh(ballGeo, postMat);
      finial.position.set(x, 0.86, z);
      barrierGroup.add(finial);
    };

    segments.forEach((seg) => {
      if (!seg) return;
      addPostIfMissing(seg.x1, seg.z1);
      addPostIfMissing(seg.x2, seg.z2);

      const dx = seg.x2 - seg.x1;
      const dz = seg.z2 - seg.z1;
      const len = Math.hypot(dx, dz);
      if (len > 0.05) {
        const ropeGeo = new THREE.CylinderGeometry(0.018, 0.018, len, 10);
        const rope = new THREE.Mesh(ropeGeo, ropeMat);
        rope.position.set((seg.x1 + seg.x2) / 2, 0.72, (seg.z1 + seg.z2) / 2);
        rope.rotation.z = Math.PI / 2;
        rope.rotation.y = -Math.atan2(dz, dx);
        barrierGroup.add(rope);
      }
    });

    parent.add(barrierGroup);
    return barrierGroup;
  }

  function createArchitecturalRoom(width, depth, height) {
    const room = new THREE.Group();

    const parquetTex = createParquetTexture();
    const floorGeo = new THREE.PlaneGeometry(width, depth);
    const floorMat = new THREE.MeshStandardMaterial({
      map: parquetTex,
      roughness: 0.65,
      metalness: 0.05,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    room.add(floor);

    const ceilingGeo = new THREE.PlaneGeometry(width, depth);
    const ceilingMat = new THREE.MeshStandardMaterial({
      color: 0x141821,
      roughness: 0.95,
      metalness: 0.02,
    });
    const ceiling = new THREE.Mesh(ceilingGeo, ceilingMat);
    ceiling.position.y = height;
    ceiling.rotation.x = Math.PI / 2;
    room.add(ceiling);

    const wallTex = createWallTexture();
    const wallMat = new THREE.MeshStandardMaterial({
      map: wallTex,
      roughness: 0.92,
      metalness: 0.0,
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

    // Hệ phào chỉ chân tường (Baseboard), phào lưng tường (Dado rail) và phào trần (Crown molding)
    const trimMat = new THREE.MeshStandardMaterial({
      color: 0x262933,
      roughness: 0.55,
      metalness: 0.15,
    });
    const accentTrimMat = new THREE.MeshStandardMaterial({
      color: 0x78350f,
      roughness: 0.6,
      metalness: 0.25,
    });

    const addWallMoldings = (len, x, z, rotY) => {
      const wallMoldingGroup = new THREE.Group();
      wallMoldingGroup.position.set(x, 0, z);
      wallMoldingGroup.rotation.y = rotY;

      // Phào chỉ chân tường (Baseboard)
      const baseBoard = new THREE.Mesh(
        new THREE.BoxGeometry(len, 0.18, 0.05),
        trimMat,
      );
      baseBoard.position.set(0, 0.09, 0.025);
      wallMoldingGroup.add(baseBoard);

      // Nẹp chỉ lưng tường (Dado / Wainscoting rail)
      const dadoRail = new THREE.Mesh(
        new THREE.BoxGeometry(len, 0.045, 0.035),
        accentTrimMat,
      );
      dadoRail.position.set(0, 0.96, 0.018);
      wallMoldingGroup.add(dadoRail);

      // Phào chỉ trần (Crown molding)
      const crownMolding = new THREE.Mesh(
        new THREE.BoxGeometry(len, 0.14, 0.06),
        trimMat,
      );
      crownMolding.position.set(0, height - 0.07, 0.03);
      wallMoldingGroup.add(crownMolding);

      room.add(wallMoldingGroup);
    };

    addWallMoldings(width, 0, -depth / 2, 0);
    addWallMoldings(width, 0, depth / 2, Math.PI);
    addWallMoldings(depth, -width / 2, 0, Math.PI / 2);
    addWallMoldings(depth, width / 2, 0, -Math.PI / 2);

    // Bổ sung hệ đèn trần cho căn phòng
    createCeilingLights(width, depth, height, room);

    scene.add(room);
    return room;
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
    // Hệ ánh sáng phòng trưng bày dịu mắt, có chiều sâu, chống chói lóa (A1)
    const hemiLight = new THREE.HemisphereLight(0xf3e8d2, 0x1b202b, 0.56);
    scene.add(hemiLight);

    const ambLight = new THREE.AmbientLight(0xfff1dc, 0.26);
    scene.add(ambLight);

    const dirLight = new THREE.DirectionalLight(0xfff5e4, 0.34);
    dirLight.position.set(3.5, 6.5, 4.0);
    scene.add(dirLight);

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
    scene.background = new THREE.Color(0x12161f);
    // Sương mù nhẹ tạo chiều sâu không gian bảo tàng (A4)
    if (THREE.FogExp2) {
      scene.fog = new THREE.FogExp2(0x12161f, 0.018);
    }

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
    renderer.toneMappingExposure = 0.96;
    if (THREE.SRGBColorSpace && "outputColorSpace" in renderer) {
      renderer.outputColorSpace = THREE.SRGBColorSpace;
    } else if (THREE.sRGBEncoding) {
      renderer.outputEncoding = THREE.sRGBEncoding;
    }

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
    createCeilingLights,
    createStanchionBarrier,
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
