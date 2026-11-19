// museum/avatar.js - Nhân vật Minecraft Steve dạng khối hộp (Voxel) với Pixel Art Texture sắc nét & khớp xoay chuẩn
window.MuseumAvatar = (() => {
  let avatarGroup = null;
  let headGroup = null;
  let torsoMesh = null;
  let leftArmGroup = null;
  let rightArmGroup = null;
  let leftLegGroup = null;
  let rightLegGroup = null;
  let walkCycle = 0;

  // Quy đổi tỷ lệ pixel gốc của Steve (32 px tổng chiều cao = 1.80 đơn vị khớp chiều cao cũ & Camera Shift-Lock)
  const TOTAL_HEIGHT = 1.8;
  const PIXEL_SCALE = TOTAL_HEIGHT / 32; // 0.05625 đơn vị / pixel

  const DIMENSIONS = Object.freeze({
    totalHeight: TOTAL_HEIGHT,
    pixelScale: PIXEL_SCALE,
    head: Object.freeze([8, 8, 8]),
    torso: Object.freeze([8, 12, 4]),
    arm: Object.freeze([4, 12, 4]),
    leg: Object.freeze([4, 12, 4]),
  });

  const moveSpeedPerSecond = 5.7;
  const MAX_DELTA_TIME = 0.05; // Kẹp deltaTime tối đa <= 0.05s chống nhảy bước/xuyên tường khi rớt FPS hoặc chuyển tab (C1)
  const DEFAULT_DELTA_TIME = 1 / 60;
  const CANVAS_TEX_SIZE = 64;

  // Giới hạn di chuyển của nhân vật bên trong 4 bức tường từng phòng
  const roomBounds = {
    1: { minX: -8.0, maxX: 8.0, minZ: -6.0, maxZ: 6.0 },
    2: { minX: -8.0, maxX: 8.0, minZ: -6.5, maxZ: 6.5 },
    3: { minX: -9.0, maxX: 9.0, minZ: -6.0, maxZ: 6.0 },
  };

  // Bảng màu Pixel Art chuẩn Minecraft Steve
  const STEVE_PALETTE = {
    H: "#3b2719", // Tóc nâu đậm cơ bản
    h: "#442d1d", // Tóc nâu sáng
    d: "#2e1e12", // Tóc nâu tối
    S: "#b88464", // Da rám nắng cơ bản
    s: "#c6906e", // Da sáng
    a: "#a97555", // Da tối nhẹ
    W: "#ffffff", // Lòng trắng mắt
    E: "#453886", // Con ngươi xanh dương đậm
    N: "#966347", // Sống mũi
    B: "#5e3824", // Râu quai nón
    M: "#7a4c32", // Miệng
    T: "#009999", // Áo thun xanh ngọc (cyan/teal)
    t: "#00a8a8", // Áo xanh ngọc sáng
    c: "#008787", // Áo xanh ngọc tối (cổ/gấu áo)
    J: "#2b2d78", // Quần jean xanh chàm
    j: "#33368b", // Quần jean sáng
    p: "#232566", // Quần jean tối
    G: "#52565a", // Giày xám
    g: "#3f4347", // Đế giày xám đậm
  };

  // Dữ liệu lưới pixel từng mặt của Steve (BoxGeometry material order: [+X, -X, +Y, -Y, +Z (Back), -Z (Front)])
  const HEAD_FRONT_GRID = [
    "HhHHdHHh",
    "HHHHHHHH",
    "HSSssSSH",
    "SssSSssS",
    "SWEssEWS",
    "SSaNNaSS",
    "SSBMmBSS",
    "SSBBBBSS",
  ];

  const HEAD_BACK_GRID = [
    "HhHHdHHh",
    "HHHHHHHH",
    "dHHhHHHd",
    "HHHHHHHH",
    "HhHHdHHh",
    "dHHHHHHd",
    "HSSSSSSH",
    "aSSSSSSa",
  ];

  // Mặt +X (bên phải đầu): +Z (gáy) ở bên trái (col 0..4), -Z (mặt) ở bên phải (col 5..7)
  const HEAD_RIGHT_SIDE_GRID = [
    "HhHHdHHh",
    "HHHHHHHH",
    "dHHhHHHh",
    "HHHHHSSS",
    "HHHHSSsS",
    "HHHHaSSS",
    "HSSSSaSS",
    "SSSSSSSS",
  ];

  // Mặt -X (bên trái đầu): -Z (mặt) ở bên trái (col 0..2), +Z (gáy) ở bên phải (col 3..7)
  const HEAD_LEFT_SIDE_GRID = [
    "hHHdHHhH",
    "HHHHHHHH",
    "hHHHhHHd",
    "SSSHHHHH",
    "SsSSHHHH",
    "SSSaHHHH",
    "SSaSSSSH",
    "SSSSSSSS",
  ];

  const HEAD_TOP_GRID = [
    "HhHHdHHh",
    "HHHHHHHH",
    "dHHhHHHd",
    "HHHHHHHH",
    "HhHHhHHd",
    "dHHHHHHh",
    "HHHHHHHH",
    "hHHdHHHh",
  ];

  const HEAD_BOTTOM_GRID = [
    "aSSSSSSa",
    "SSSSSSSS",
    "SSsSSsSS",
    "SSSSSSSS",
    "SSSSSSSS",
    "SSsSSsSS",
    "aSSSSSSa",
    "SSSSSSSS",
  ];

  const TORSO_FRONT_GRID = [
    "TcSSSScT",
    "TTcSScTT",
    "TtTccTtT",
    "TTTTTTTT",
    "cTTTTTTc",
    "TTtTTtTT",
    "TTTTTTTT",
    "tTTTTTTt",
    "TTTTTTTT",
    "cTTttTTc",
    "TTTTTTTT",
    "ccTccTcc",
  ];

  const TORSO_BACK_GRID = [
    "TccTTccT",
    "TTTTTTTT",
    "tTTTTTTt",
    "TTTTTTTT",
    "cTTTTTTc",
    "TTtTTtTT",
    "TTTTTTTT",
    "tTTTTTTt",
    "TTTTTTTT",
    "cTTttTTc",
    "TTTTTTTT",
    "ccTccTcc",
  ];

  const TORSO_SIDE_GRID = [
    "cTTc",
    "TTTT",
    "tTTt",
    "TTTT",
    "cTTc",
    "TTTT",
    "tTTt",
    "TTTT",
    "cTTc",
    "TTTT",
    "TTTT",
    "cccc",
  ];

  const TORSO_TOP_GRID = [
    "TcTTTTcT",
    "TTTssTTT",
    "TTTssTTT",
    "TccTTccT",
  ];

  const TORSO_BOTTOM_GRID = [
    "cTTTTTTc",
    "TTTTTTTT",
    "TTTTTTTT",
    "cTTTTTTc",
  ];

  const ARM_SIDE_GRID = [
    "TttT",
    "TTTT",
    "tTTt",
    "cTTc",
    "SSsS",
    "SSSS",
    "aSSa",
    "SSSS",
    "SSsS",
    "SSSS",
    "aSSa",
    "SSaS",
  ];

  const ARM_TOP_GRID = [
    "TttT",
    "TTTT",
    "TtTT",
    "cTTc",
  ];

  const ARM_BOTTOM_GRID = [
    "aSSa",
    "SSSS",
    "SSsS",
    "aSSa",
  ];

  const LEG_SIDE_GRID = [
    "JppJ",
    "JJjJ",
    "JJJJ",
    "pJJp",
    "JJJJ",
    "JjJJ",
    "pJJp",
    "JJJJ",
    "JJjJ",
    "pJJp",
    "GGGG",
    "gGGg",
  ];

  const LEG_TOP_GRID = [
    "pJJp",
    "JJjJ",
    "JJJJ",
    "pJJp",
  ];

  const LEG_BOTTOM_GRID = [
    "gggg",
    "gGGg",
    "gGGg",
    "gggg",
  ];

  // Bộ nhớ đệm tài nguyên dùng chung giữa các phòng và các chi đối xứng (B2, B3)
  const resourceCache = {
    geometries: null, // { headGeo, torsoGeo, limbGeo }
    materials: new Map(),
    textures: new Map(),
    partMaterials: null, // { headMaterials, torsoMaterials, armMaterials, legMaterials }
  };

  function clampDeltaTime(deltaTime) {
    if (typeof deltaTime !== "number" || !Number.isFinite(deltaTime)) {
      return DEFAULT_DELTA_TIME;
    }
    if (deltaTime <= 0) {
      return 0;
    }
    return Math.min(deltaTime, MAX_DELTA_TIME);
  }

  function configurePixelArtTexture(tex) {
    tex.magFilter = THREE.NearestFilter;
    tex.minFilter = THREE.NearestFilter;
    tex.generateMipmaps = false;
    if (THREE.SRGBColorSpace && "colorSpace" in tex) {
      tex.colorSpace = THREE.SRGBColorSpace;
    } else if (THREE.sRGBEncoding) {
      tex.encoding = THREE.sRGBEncoding;
    }
    tex.needsUpdate = true;
    tex.userData = tex.userData || {};
    tex.userData.isShared = true;
    return tex;
  }

  function createPixelTexture(gridRows, cols, rows) {
    const key = `${cols}x${rows}:${gridRows.join("|")}`;
    if (resourceCache.textures.has(key)) {
      return resourceCache.textures.get(key);
    }

    const canvas = document.createElement("canvas");
    canvas.width = CANVAS_TEX_SIZE;
    canvas.height = CANVAS_TEX_SIZE;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.imageSmoothingEnabled = false;
      for (let r = 0; r < rows; r++) {
        const y0 = Math.round((r * CANVAS_TEX_SIZE) / rows);
        const y1 = Math.round(((r + 1) * CANVAS_TEX_SIZE) / rows);
        const rowStr = gridRows[r] || "";
        for (let c = 0; c < cols; c++) {
          const x0 = Math.round((c * CANVAS_TEX_SIZE) / cols);
          const x1 = Math.round(((c + 1) * CANVAS_TEX_SIZE) / cols);
          const code = rowStr[c] || "S";
          ctx.fillStyle = STEVE_PALETTE[code] || "#b88464";
          ctx.fillRect(x0, y0, x1 - x0, y1 - y0);
        }
      }
    }

    const tex = configurePixelArtTexture(new THREE.CanvasTexture(canvas));
    resourceCache.textures.set(key, tex);
    return tex;
  }

  function getPixelMaterial(gridRows, cols, rows) {
    const key = `${cols}x${rows}:${gridRows.join("|")}`;
    if (resourceCache.materials.has(key)) {
      return resourceCache.materials.get(key);
    }

    const mapTex = createPixelTexture(gridRows, cols, rows);
    const mat = new THREE.MeshStandardMaterial({
      map: mapTex,
      roughness: 0.9,
      metalness: 0.0,
    });
    mat.userData = mat.userData || {};
    mat.userData.isShared = true;
    resourceCache.materials.set(key, mat);
    return mat;
  }

  function ensureSharedResources() {
    if (!resourceCache.geometries) {
      const headSize = 8 * PIXEL_SCALE; // 0.45
      const torsoW = 8 * PIXEL_SCALE; // 0.45
      const torsoH = 12 * PIXEL_SCALE; // 0.675
      const torsoD = 4 * PIXEL_SCALE; // 0.225
      const limbW = 4 * PIXEL_SCALE; // 0.225
      const limbH = 12 * PIXEL_SCALE; // 0.675
      const limbD = 4 * PIXEL_SCALE; // 0.225

      const headGeo = new THREE.BoxGeometry(headSize, headSize, headSize);
      const torsoGeo = new THREE.BoxGeometry(torsoW, torsoH, torsoD);
      const limbGeo = new THREE.BoxGeometry(limbW, limbH, limbD);

      [headGeo, torsoGeo, limbGeo].forEach((geo) => {
        geo.userData = geo.userData || {};
        geo.userData.isShared = true;
      });

      resourceCache.geometries = { headGeo, torsoGeo, limbGeo };
    }

    if (!resourceCache.partMaterials) {
      // Thứ tự mặt BoxGeometry: [+X (Right), -X (Left), +Y (Top), -Y (Bottom), +Z (Back), -Z (Front)]
      const headMaterials = [
        getPixelMaterial(HEAD_RIGHT_SIDE_GRID, 8, 8),
        getPixelMaterial(HEAD_LEFT_SIDE_GRID, 8, 8),
        getPixelMaterial(HEAD_TOP_GRID, 8, 8),
        getPixelMaterial(HEAD_BOTTOM_GRID, 8, 8),
        getPixelMaterial(HEAD_BACK_GRID, 8, 8),
        getPixelMaterial(HEAD_FRONT_GRID, 8, 8),
      ];

      const torsoMaterials = [
        getPixelMaterial(TORSO_SIDE_GRID, 4, 12),
        getPixelMaterial(TORSO_SIDE_GRID, 4, 12),
        getPixelMaterial(TORSO_TOP_GRID, 8, 4),
        getPixelMaterial(TORSO_BOTTOM_GRID, 8, 4),
        getPixelMaterial(TORSO_BACK_GRID, 8, 12),
        getPixelMaterial(TORSO_FRONT_GRID, 8, 12),
      ];

      const armSideMat = getPixelMaterial(ARM_SIDE_GRID, 4, 12);
      const armMaterials = [
        armSideMat,
        armSideMat,
        getPixelMaterial(ARM_TOP_GRID, 4, 4),
        getPixelMaterial(ARM_BOTTOM_GRID, 4, 4),
        armSideMat,
        armSideMat,
      ];

      const legSideMat = getPixelMaterial(LEG_SIDE_GRID, 4, 12);
      const legMaterials = [
        legSideMat,
        legSideMat,
        getPixelMaterial(LEG_TOP_GRID, 4, 4),
        getPixelMaterial(LEG_BOTTOM_GRID, 4, 4),
        legSideMat,
        legSideMat,
      ];

      resourceCache.partMaterials = {
        headMaterials,
        torsoMaterials,
        armMaterials,
        legMaterials,
      };
    }

    return resourceCache;
  }

  function create() {
    const { geometries, partMaterials } = ensureSharedResources();
    const avatar = new THREE.Group();
    avatar.name = "MinecraftSteveAvatar";

    const headSize = 8 * PIXEL_SCALE; // 0.45
    const torsoH = 12 * PIXEL_SCALE; // 0.675
    const limbH = 12 * PIXEL_SCALE; // 0.675

    // 1. Đầu (8x8x8) - tâm xoay tại cổ (y = 1.35), đỉnh đầu chạm y = 1.80
    headGroup = new THREE.Group();
    headGroup.position.set(0, limbH + torsoH, 0); // y = 1.35
    const headMesh = new THREE.Mesh(
      geometries.headGeo,
      partMaterials.headMaterials,
    );
    headMesh.position.set(0, headSize * 0.5, 0); // +0.225
    headMesh.castShadow = true;
    headGroup.add(headMesh);
    avatar.add(headGroup);

    // 2. Thân (8x12x4) - từ y = 0.675 đến y = 1.35
    torsoMesh = new THREE.Mesh(
      geometries.torsoGeo,
      partMaterials.torsoMaterials,
    );
    torsoMesh.position.set(0, limbH + torsoH * 0.5, 0); // y = 1.0125
    torsoMesh.castShadow = true;
    avatar.add(torsoMesh);

    // 3. Tay trái (-X, 4x12x4) - tâm xoay đặt tại khớp vai (-0.3375, 1.35, 0)
    leftArmGroup = new THREE.Group();
    leftArmGroup.position.set(-6 * PIXEL_SCALE, limbH + torsoH, 0); // (-0.3375, 1.35, 0)
    const leftArmMesh = new THREE.Mesh(
      geometries.limbGeo,
      partMaterials.armMaterials,
    );
    leftArmMesh.position.set(0, -limbH * 0.5, 0); // -0.3375
    leftArmMesh.castShadow = true;
    leftArmGroup.add(leftArmMesh);
    avatar.add(leftArmGroup);

    // 4. Tay phải (+X, 4x12x4) - tâm xoay đặt tại khớp vai (+0.3375, 1.35, 0)
    rightArmGroup = new THREE.Group();
    rightArmGroup.position.set(6 * PIXEL_SCALE, limbH + torsoH, 0); // (+0.3375, 1.35, 0)
    const rightArmMesh = new THREE.Mesh(
      geometries.limbGeo,
      partMaterials.armMaterials,
    );
    rightArmMesh.position.set(0, -limbH * 0.5, 0); // -0.3375
    rightArmMesh.castShadow = true;
    rightArmGroup.add(rightArmMesh);
    avatar.add(rightArmGroup);

    // 5. Chân trái (-X, 4x12x4) - tâm xoay đặt tại khớp hông (-0.1125, 0.675, 0), bàn chân chạm y = 0
    leftLegGroup = new THREE.Group();
    leftLegGroup.position.set(-2 * PIXEL_SCALE, limbH, 0); // (-0.1125, 0.675, 0)
    const leftLegMesh = new THREE.Mesh(
      geometries.limbGeo,
      partMaterials.legMaterials,
    );
    leftLegMesh.position.set(0, -limbH * 0.5, 0); // -0.3375
    leftLegMesh.castShadow = true;
    leftLegGroup.add(leftLegMesh);
    avatar.add(leftLegGroup);

    // 6. Chân phải (+X, 4x12x4) - tâm xoay đặt tại khớp hông (+0.1125, 0.675, 0), bàn chân chạm y = 0
    rightLegGroup = new THREE.Group();
    rightLegGroup.position.set(2 * PIXEL_SCALE, limbH, 0); // (+0.1125, 0.675, 0)
    const rightLegMesh = new THREE.Mesh(
      geometries.limbGeo,
      partMaterials.legMaterials,
    );
    rightLegMesh.position.set(0, -limbH * 0.5, 0); // -0.3375
    rightLegMesh.castShadow = true;
    rightLegGroup.add(rightLegMesh);
    avatar.add(rightLegGroup);

    walkCycle = 0;
    avatar.position.set(0, 0, 2.2);
    avatarGroup = avatar;
    return avatar;
  }

  // Cập nhật hoạt ảnh vung tay/chân Steve theo deltaTime, trạng thái di chuyển & tốc độ
  function update(deltaTime, isMoving, speed = 1, stepDir = 1) {
    if (!avatarGroup) return;

    const dt = clampDeltaTime(deltaTime);
    const speedScale =
      typeof speed === "number" && Number.isFinite(speed) ? speed : 1;

    if (isMoving && dt > 0 && speedScale > 0) {
      walkCycle += 13.2 * dt * speedScale * stepDir;
      const legAngle = Math.sin(walkCycle) * 0.55;
      const armAngle = -Math.sin(walkCycle) * 0.5;

      if (leftLegGroup) leftLegGroup.rotation.x = legAngle;
      if (rightLegGroup) rightLegGroup.rotation.x = -legAngle;
      if (leftArmGroup) leftArmGroup.rotation.x = armAngle;
      if (rightArmGroup) rightArmGroup.rotation.x = -armAngle;
    } else {
      const damping = dt > 0 ? Math.exp(-16 * dt) : 0.72;
      const dampJoint = (group) => {
        if (!group) return;
        group.rotation.x *= damping;
        if (Math.abs(group.rotation.x) < 0.001) {
          group.rotation.x = 0;
        }
      };
      dampJoint(leftLegGroup);
      dampJoint(rightLegGroup);
      dampJoint(leftArmGroup);
      dampJoint(rightArmGroup);
      if (
        (!leftLegGroup || leftLegGroup.rotation.x === 0) &&
        (!leftArmGroup || leftArmGroup.rotation.x === 0)
      ) {
        walkCycle = 0;
      }
    }
  }

  function updateWalking(yaw, keys, currentRoom, deltaTime) {
    if (!avatarGroup) return;

    const dt = clampDeltaTime(deltaTime);
    const stepDistance = moveSpeedPerSecond * dt;
    const bounds = roomBounds[currentRoom] || roomBounds[1];

    // Nhân vật luôn xoay lưng về phía camera và hướng mặt theo góc nhìn ngang (yaw)
    avatarGroup.rotation.y = -yaw;

    // Vector hướng trước mặt nhân vật (forward) và hướng ngang bên phải (right) theo góc yaw
    const forwardX = Math.sin(yaw);
    const forwardZ = -Math.cos(yaw);
    const rightX = Math.cos(yaw);
    const rightZ = Math.sin(yaw);

    let moveX = 0;
    let moveZ = 0;
    let isMoving = false;

    if (keys && keys.w) {
      moveX += forwardX;
      moveZ += forwardZ;
      isMoving = true;
    }
    if (keys && keys.s) {
      moveX -= forwardX;
      moveZ -= forwardZ;
      isMoving = true;
    }
    if (keys && keys.a) {
      moveX -= rightX;
      moveZ -= rightZ;
      isMoving = true;
    }
    if (keys && keys.d) {
      moveX += rightX;
      moveZ += rightZ;
      isMoving = true;
    }

    let actuallyMoved = false;
    if (isMoving && stepDistance > 0) {
      const len = Math.hypot(moveX, moveZ);
      if (len > 0.0001) {
        moveX = (moveX / len) * stepDistance;
        moveZ = (moveZ / len) * stepDistance;
        actuallyMoved = true;
      }

      if (actuallyMoved) {
        let nextX = THREE.MathUtils.clamp(
          avatarGroup.position.x + moveX,
          bounds.minX,
          bounds.maxX,
        );
        let nextZ = THREE.MathUtils.clamp(
          avatarGroup.position.z + moveZ,
          bounds.minZ,
          bounds.maxZ,
        );

        // Tránh đi xuyên bệ trưng bày trung tâm ở Phòng 2 và Phòng 3
        if (currentRoom === 2) {
          const dx = nextX - 0;
          const dz = nextZ - -0.8;
          const dist = Math.hypot(dx, dz);
          if (dist < 1.65 && dist > 0.001) {
            nextX = (dx / dist) * 1.65;
            nextZ = -0.8 + (dz / dist) * 1.65;
          }
        } else if (currentRoom === 3) {
          const dx = nextX - 0;
          const dz = nextZ - 1.6;
          const dist = Math.hypot(dx, dz);
          if (dist < 1.45 && dist > 0.001) {
            nextX = (dx / dist) * 1.45;
            nextZ = 1.6 + (dz / dist) * 1.45;
          }
        }

        avatarGroup.position.x = THREE.MathUtils.clamp(
          nextX,
          bounds.minX,
          bounds.maxX,
        );
        avatarGroup.position.z = THREE.MathUtils.clamp(
          nextZ,
          bounds.minZ,
          bounds.maxZ,
        );
      }
    }

    const stepDir = keys && keys.s && !keys.w ? -1 : 1;
    update(dt, actuallyMoved, 1, stepDir);
  }

  // Giải phóng toàn bộ Geometry, Material và CanvasTexture của Steve khỏi WebGL/VRAM
  function dispose() {
    if (resourceCache.geometries) {
      Object.values(resourceCache.geometries).forEach((geo) => {
        if (geo && typeof geo.dispose === "function") {
          geo.dispose();
        }
      });
      resourceCache.geometries = null;
    }

    resourceCache.materials.forEach((mat) => {
      if (mat && typeof mat.dispose === "function") {
        mat.dispose();
      }
    });
    resourceCache.materials.clear();

    resourceCache.textures.forEach((tex) => {
      if (tex && typeof tex.dispose === "function") {
        tex.dispose();
      }
    });
    resourceCache.textures.clear();

    resourceCache.partMaterials = null;
    avatarGroup = null;
    headGroup = null;
    torsoMesh = null;
    leftArmGroup = null;
    rightArmGroup = null;
    leftLegGroup = null;
    rightLegGroup = null;
    walkCycle = 0;
  }

  function getAvatar() {
    return avatarGroup;
  }

  function getParts() {
    return {
      headGroup,
      torsoMesh,
      leftArmGroup,
      rightArmGroup,
      leftLegGroup,
      rightLegGroup,
    };
  }

  function getDimensions() {
    return DIMENSIONS;
  }

  function getRoomBounds(roomNumber) {
    return roomBounds[roomNumber] || roomBounds[1];
  }

  return {
    create,
    update,
    updateWalking,
    dispose,
    getAvatar,
    getParts,
    getDimensions,
    getRoomBounds,
    clampDeltaTime,
    MAX_DELTA_TIME,
  };
})();
