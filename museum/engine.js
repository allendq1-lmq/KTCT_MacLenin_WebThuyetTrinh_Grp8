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

  let isManualPaused = false;
  let lastFrameTime = 0;
  let sceneEpoch = 0;
  let pmremRenderTarget = null;
  const roomUpdaters = [];
  let elapsedClock = 0;

  function registerRoomUpdater(fn) {
    if (typeof fn === "function") {
      roomUpdaters.push(fn);
    }
  }

  // Bộ nhớ đệm dùng chung Geometry / Material / Texture để giảm cấp phát VRAM & Draw Calls (B2, B3)
  const sharedResources = {
    geometries: new Map(),
    materials: new Map(),
    textures: new Map(),
  };

  function getSharedGeometry(key, factory) {
    if (!sharedResources.geometries.has(key)) {
      const geo = factory();
      geo.userData = geo.userData || {};
      geo.userData.isShared = true;
      sharedResources.geometries.set(key, geo);
    }
    return sharedResources.geometries.get(key);
  }

  function getSharedMaterial(key, factory) {
    if (!sharedResources.materials.has(key)) {
      const mat = factory();
      mat.userData = mat.userData || {};
      mat.userData.isShared = true;
      sharedResources.materials.set(key, mat);
    }
    return sharedResources.materials.get(key);
  }

  function isMobileDevice() {
    return (
      window.innerWidth < 768 ||
      Boolean(
        window.matchMedia && window.matchMedia("(pointer: coarse)").matches,
      ) ||
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        (window.navigator && window.navigator.userAgent) || "",
      )
    );
  }

  // Giới hạn PixelRatio tối đa 1.5 trên Desktop và 1.25 trên Mobile (B1)
  function getOptimalPixelRatio() {
    const dpr = window.devicePixelRatio || 1;
    const maxDpr = isMobileDevice() ? 1.25 : 1.5;
    return Math.min(dpr, maxDpr);
  }

  function configureCanvasTexture(tex, maxAnisotropy = 4) {
    tex.generateMipmaps = true;
    if (THREE.SRGBColorSpace && "colorSpace" in tex) {
      tex.colorSpace = THREE.SRGBColorSpace;
    } else if (THREE.sRGBEncoding) {
      tex.encoding = THREE.sRGBEncoding;
    }
    if (THREE.LinearMipmapLinearFilter) {
      tex.minFilter = THREE.LinearMipmapLinearFilter;
    }
    if (THREE.LinearFilter) {
      tex.magFilter = THREE.LinearFilter;
    }
    const maxSupported =
      renderer &&
      renderer.capabilities &&
      typeof renderer.capabilities.getMaxAnisotropy === "function"
        ? renderer.capabilities.getMaxAnisotropy()
        : maxAnisotropy;
    tex.anisotropy = Math.min(maxAnisotropy, maxSupported || maxAnisotropy);
    tex.needsUpdate = true;
    return tex;
  }

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

  function createProceduralEnvironment(targetRenderer) {
    if (!targetRenderer || typeof THREE.PMREMGenerator !== "function") {
      return null;
    }
    const envScene = new THREE.Scene();
    envScene.background = new THREE.Color(0x0c1018);

    const tempGeos = [];
    const tempMats = [];
    const addPanel = (w, h, colorHex, x, y, z, rx, ry, rz) => {
      const geo = new THREE.PlaneGeometry(w, h);
      const mat = new THREE.MeshBasicMaterial({
        color: colorHex,
        side: THREE.DoubleSide,
      });
      tempGeos.push(geo);
      tempMats.push(mat);
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(x, y, z);
      mesh.rotation.set(rx, ry, rz);
      envScene.add(mesh);
    };

    // 3 tấm skylight trần màu kem ấm
    addPanel(10, 3.2, 0xfff3d8, 0, 8, -3.5, Math.PI / 2, 0, 0);
    addPanel(10, 3.2, 0xfff3d8, 0, 8, 0, Math.PI / 2, 0, 0);
    addPanel(10, 3.2, 0xfff3d8, 0, 8, 3.5, Math.PI / 2, 0, 0);

    // 4 tấm tường hắt sáng ấm/xám trung tính ở 4 hướng +-10
    addPanel(20, 9, 0x2b2824, 0, 2, -10, 0, 0, 0);
    addPanel(20, 9, 0x1e2533, 0, 2, 10, 0, Math.PI, 0);
    addPanel(20, 9, 0x2b2824, -10, 2, 0, 0, Math.PI / 2, 0);
    addPanel(20, 9, 0x1e2533, 10, 2, 0, 0, -Math.PI / 2, 0);

    // 2 dải LED hổ phách hai bên tạo điểm nhấn phản xạ trên kim loại đồng
    addPanel(14, 0.55, 0xf59e0b, -9.6, 4.8, 0, 0, Math.PI / 2, 0);
    addPanel(14, 0.55, 0xf59e0b, 9.6, 4.8, 0, 0, -Math.PI / 2, 0);

    // 1 sàn tối
    addPanel(22, 22, 0x0a0d14, 0, -4, 0, -Math.PI / 2, 0, 0);

    let rt = null;
    const pmremGenerator = new THREE.PMREMGenerator(targetRenderer);
    try {
      rt = pmremGenerator.fromScene(envScene, 0.04);
    } finally {
      pmremGenerator.dispose();
      tempGeos.forEach((g) => g.dispose());
      tempMats.forEach((m) => m.dispose());
    }
    return rt;
  }

  function createMarbleFloorTextures() {
    if (
      sharedResources.textures.has("marble-floor-map") &&
      sharedResources.textures.has("marble-floor-rough")
    ) {
      return {
        map: sharedResources.textures.get("marble-floor-map"),
        roughnessMap: sharedResources.textures.get("marble-floor-rough"),
      };
    }

    const size = 1024;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");

    // Nền đá cẩm thạch đen Nero Marquina sâu
    const baseGrad = ctx.createLinearGradient(0, 0, size, size);
    baseGrad.addColorStop(0, "#0d1017");
    baseGrad.addColorStop(0.5, "#131822");
    baseGrad.addColorStop(1, "#161b26");
    ctx.fillStyle = baseGrad;
    ctx.fillRect(0, 0, size, size);

    // Nhiễu khoáng chất tự nhiên nhẹ
    let seed = 1337;
    const rand = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };

    for (let i = 0; i < 4200; i++) {
      ctx.fillStyle =
        rand() > 0.5 ? "rgba(255,255,255,0.016)" : "rgba(0,0,0,0.03)";
      ctx.fillRect(rand() * size, rand() * size, 3, 3);
    }

    // Các đường vân khoáng chất trắng bạc và vàng đồng chạy chéo hữu cơ
    const drawVein = (startX, startY, angle, steps, color, width, jitter) => {
      ctx.save();
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();
      let x = startX;
      let y = startY;
      ctx.moveTo(x, y);
      let a = angle;
      for (let s = 0; s < steps; s++) {
        a += (rand() - 0.5) * jitter;
        const stepLen = 14 + rand() * 20;
        x += Math.cos(a) * stepLen;
        y += Math.sin(a) * stepLen;
        ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.restore();
    };

    for (let i = 0; i < 22; i++) {
      const sx = rand() * size;
      const sy = rand() * size;
      const alpha = (0.16 + rand() * 0.18).toFixed(2);
      drawVein(
        sx,
        sy,
        0.55 + (rand() - 0.5) * 0.5,
        24,
        `rgba(226, 232, 240, ${alpha})`,
        1.2 + rand() * 2.2,
        0.48,
      );
      if (i % 2 === 0) {
        const gAlpha = (0.14 + rand() * 0.1).toFixed(2);
        drawVein(
          sx + 18,
          sy - 12,
          0.62 + (rand() - 0.5) * 0.4,
          18,
          `rgba(217, 165, 72, ${gAlpha})`,
          0.8 + rand() * 1.1,
          0.42,
        );
      }
    }

    // Lưới chỉ đồng thau sắc nét chia ô gạch lớn 2x2 trên mỗi tile
    const half = size / 2;
    const drawBrassLine = (x1, y1, x2, y2) => {
      ctx.save();
      ctx.strokeStyle = "rgba(8, 10, 15, 0.8)";
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();

      ctx.strokeStyle = "#c8963e";
      ctx.lineWidth = 4.5;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();

      ctx.strokeStyle = "#e8c468";
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      ctx.restore();
    };

    drawBrassLine(0, 2, size, 2);
    drawBrassLine(0, half, size, half);
    drawBrassLine(2, 0, 2, size);
    drawBrassLine(half, 0, half, size);

    const mapTex = configureCanvasTexture(new THREE.CanvasTexture(canvas), 4);
    mapTex.wrapS = THREE.RepeatWrapping;
    mapTex.wrapT = THREE.RepeatWrapping;
    mapTex.repeat.set(5, 4);
    mapTex.userData = { isShared: true };

    // RoughnessMap grayscale 512x512 (không gán sRGB)
    const rSize = 512;
    const rCanvas = document.createElement("canvas");
    rCanvas.width = rSize;
    rCanvas.height = rSize;
    const rCtx = rCanvas.getContext("2d");
    rCtx.fillStyle = "rgb(42, 42, 42)";
    rCtx.fillRect(0, 0, rSize, rSize);

    let rSeed = 4242;
    const rRand = () => {
      rSeed = (rSeed * 16807) % 2147483647;
      return (rSeed - 1) / 2147483646;
    };
    rCtx.strokeStyle = "rgb(88, 88, 88)";
    rCtx.lineWidth = 2;
    for (let i = 0; i < 18; i++) {
      rCtx.beginPath();
      let rx = rRand() * rSize;
      let ry = rRand() * rSize;
      rCtx.moveTo(rx, ry);
      for (let s = 0; s < 14; s++) {
        rx += 12 + (rRand() - 0.3) * 18;
        ry += 8 + (rRand() - 0.4) * 16;
        rCtx.lineTo(rx, ry);
      }
      rCtx.stroke();
    }
    // Chỉ đồng bóng hơn nhẹ
    const rHalf = rSize / 2;
    rCtx.strokeStyle = "rgb(52, 52, 52)";
    rCtx.lineWidth = 4;
    rCtx.beginPath();
    rCtx.moveTo(0, 1);
    rCtx.lineTo(rSize, 1);
    rCtx.moveTo(0, rHalf);
    rCtx.lineTo(rSize, rHalf);
    rCtx.moveTo(1, 0);
    rCtx.lineTo(1, rSize);
    rCtx.moveTo(rHalf, 0);
    rCtx.lineTo(rHalf, rSize);
    rCtx.stroke();

    const roughTex = new THREE.CanvasTexture(rCanvas);
    roughTex.generateMipmaps = true;
    roughTex.minFilter = THREE.LinearMipmapLinearFilter;
    roughTex.magFilter = THREE.LinearFilter;
    roughTex.wrapS = THREE.RepeatWrapping;
    roughTex.wrapT = THREE.RepeatWrapping;
    roughTex.repeat.set(5, 4);
    roughTex.needsUpdate = true;
    roughTex.userData = { isShared: true };

    sharedResources.textures.set("marble-floor-map", mapTex);
    sharedResources.textures.set("marble-floor-rough", roughTex);
    return { map: mapTex, roughnessMap: roughTex };
  }

  function createWallTexture() {
    if (sharedResources.textures.has("wall")) {
      return sharedResources.textures.get("wall");
    }
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");

    // Vữa Venetian Plaster phân tầng cao cấp: phần trên xám-taupe sâu, phần chân tường tối hơn
    const wallGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    wallGrad.addColorStop(0, "#2c303a");
    wallGrad.addColorStop(0.74, "#252932");
    wallGrad.addColorStop(0.76, "#1f232c");
    wallGrad.addColorStop(0.77, "#1a1e27");
    wallGrad.addColorStop(1, "#161922");
    ctx.fillStyle = wallGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Hiệu ứng vân vữa loang mềm đa lớp (Venetian plaster mottling)
    let seed = 9001;
    const rand = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };
    for (let i = 0; i < 65; i++) {
      const cx = rand() * canvas.width;
      const cy = rand() * canvas.height * 0.75;
      const rad = 28 + rand() * 70;
      const g = ctx.createRadialGradient(cx, cy, 2, cx, cy, rad);
      const isLight = rand() > 0.48;
      g.addColorStop(
        0,
        isLight ? "rgba(255, 245, 225, 0.032)" : "rgba(8, 12, 20, 0.045)",
      );
      g.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = g;
      ctx.fillRect(cx - rad, cy - rad, rad * 2, rad * 2);
    }

    for (let i = 0; i < 2200; i++) {
      ctx.fillStyle =
        rand() > 0.5 ? "rgba(255,255,255,0.015)" : "rgba(0,0,0,0.02)";
      ctx.fillRect(rand() * canvas.width, rand() * canvas.height, 2, 2);
    }

    // Đường chỉ phân tách tinh tế tại ~76%
    ctx.fillStyle = "rgba(212, 160, 56, 0.25)";
    ctx.fillRect(0, Math.round(canvas.height * 0.76), canvas.width, 2);

    const tex = configureCanvasTexture(new THREE.CanvasTexture(canvas), 4);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(4, 1);
    tex.userData = { isShared: true };
    sharedResources.textures.set("wall", tex);
    return tex;
  }

  function createWallWashTexture() {
    if (sharedResources.textures.has("wall-wash-halo")) {
      return sharedResources.textures.get("wall-wash-halo");
    }
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");
    const grad = ctx.createRadialGradient(128, 128, 12, 128, 128, 128);
    grad.addColorStop(0, "rgba(255, 232, 180, 1)");
    grad.addColorStop(0.42, "rgba(251, 191, 36, 0.55)");
    grad.addColorStop(0.75, "rgba(217, 119, 6, 0.16)");
    grad.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 256);

    const tex = configureCanvasTexture(new THREE.CanvasTexture(canvas), 2);
    tex.userData = { isShared: true };
    sharedResources.textures.set("wall-wash-halo", tex);
    return tex;
  }

  function createSkylightTexture() {
    if (sharedResources.textures.has("skylight-diffuser")) {
      return sharedResources.textures.get("skylight-diffuser");
    }
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");
    const grad = ctx.createRadialGradient(256, 256, 30, 256, 256, 340);
    grad.addColorStop(0, "#fff8e7");
    grad.addColorStop(0.55, "#f5e3ba");
    grad.addColorStop(1, "#c7a46b");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 512);

    const tex = configureCanvasTexture(new THREE.CanvasTexture(canvas), 2);
    tex.userData = { isShared: true };
    sharedResources.textures.set("skylight-diffuser", tex);
    return tex;
  }

  function resolveExhibitMeta(title, badgeText, exhibitMeta) {
    if (exhibitMeta && typeof exhibitMeta === "object") {
      return exhibitMeta;
    }
    const playlist =
      (window.MuseumData && window.MuseumData.playlist) || [];
    return (
      playlist.find(
        (item) =>
          (title && item.title === title) ||
          (badgeText && item.badge === badgeText),
      ) || {}
    );
  }

  function createArtworkTexture(
    title,
    subtitle,
    badgeText,
    tagColor,
    descLines,
    exhibitMeta,
  ) {
    // Khung tranh lớn chỉ hiển thị duy nhất bức ảnh tư liệu/minh họa phủ kín (cover), tuyệt đối không vẽ chữ hay biểu đồ
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 700;
    const ctx = canvas.getContext("2d");
    const meta = resolveExhibitMeta(title, badgeText, exhibitMeta);
    const accentColor = tagColor || meta.color || "#d97706";
    const visualType = meta.visualType || meta.id || "r1-1a";

    const bgGrad = ctx.createLinearGradient(0, 0, 1024, 700);
    bgGrad.addColorStop(0, "#111827");
    bgGrad.addColorStop(1, "#090d16");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1024, 700);

    const photoRect = { x: 18, y: 18, w: 988, h: 664 };
    ctx.fillStyle = "#0b111e";
    ctx.fillRect(photoRect.x, photoRect.y, photoRect.w, photoRect.h);
    ctx.strokeStyle = "rgba(245, 158, 11, 0.28)";
    ctx.lineWidth = 2;
    ctx.strokeRect(photoRect.x, photoRect.y, photoRect.w, photoRect.h);

    const tex = configureCanvasTexture(new THREE.CanvasTexture(canvas), 4);
    const captureEpoch = sceneEpoch;

    if (
      window.MuseumVisuals &&
      typeof window.MuseumVisuals.loadExhibitImageWithFallback === "function" &&
      (meta.localImagePath || meta.imageUrl)
    ) {
      window.MuseumVisuals.loadExhibitImageWithFallback(meta)
        .then((res) => {
          if (!res || !res.ok || !res.img || captureEpoch !== sceneEpoch) {
            return;
          }
          window.MuseumVisuals.drawLoadedPhotoInFrame(
            ctx,
            res.img,
            res.src,
            photoRect,
            visualType,
            accentColor,
            "",
          );
          tex.needsUpdate = true;
        })
        .catch(() => {});
    }

    return tex;
  }

  const placardRegistry = [];

  function getPlacardDimensions(frameWidth) {
    const w = typeof frameWidth === "number" && frameWidth > 0 ? frameWidth : 2.6;
    const innerH = Math.max(0.36, Math.min(0.56, Number((w * 0.12).toFixed(3))));
    const outerH = Number((innerH + 0.08).toFixed(3));
    return {
      width: w,
      innerH,
      outerH,
      aspectRatio: w / innerH,
    };
  }

  function formatMuseumTitleCase(text) {
    const acronyms = new Set([
      "KTTT",
      "XHCN",
      "ĐHXHCN",
      "CNTB",
      "TBCN",
      "CSVN",
      "CNXH",
      "KT-XH",
      "VN",
      "UIT",
      "GR8",
      "FDI",
      "DNNN",
      "DNTN",
      "GDP",
      "HDI",
      "BHYT",
      "HTX",
    ]);
    return String(text || "")
      .trim()
      .split(/\s+/)
      .map((word) => {
        const clean = word.replace(/^[(["']+|[,.;:)!?"']+$/g, "");
        if (acronyms.has(clean.toUpperCase())) {
          return word.toUpperCase();
        }
        if (/^[0-9]+([.,–-][0-9]+)*[a-zA-Z]?$/.test(clean)) {
          return word;
        }
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join(" ");
  }

  function parsePlacardParts(rawTitle) {
    const raw = String(rawTitle || "").trim();
    const parts = raw.split(/\s*•\s*/);
    if (parts.length >= 2) {
      return {
        kicker: parts[0].trim().toUpperCase(),
        main: formatMuseumTitleCase(parts.slice(1).join(" • ")),
      };
    }
    return {
      kicker: "",
      main: formatMuseumTitleCase(raw),
    };
  }

  function splitBalancedTwoLines(ctx, text, maxW) {
    if (ctx.measureText(text).width <= maxW) {
      return [text];
    }
    const words = text.split(/\s+/).filter(Boolean);
    if (words.length <= 1) return [text];
    let bestLines = null;
    let bestScore = Infinity;
    for (let i = 1; i < words.length; i++) {
      const l1 = words.slice(0, i).join(" ");
      const l2 = words.slice(i).join(" ");
      const w1 = ctx.measureText(l1).width;
      const w2 = ctx.measureText(l2).width;
      const maxLine = Math.max(w1, w2);
      const balanceDiff = Math.abs(w1 - w2);
      const score = (maxLine <= maxW ? 0 : (maxLine - maxW) * 10) + balanceDiff;
      if (score < bestScore) {
        bestScore = score;
        bestLines = [l1, l2];
      }
    }
    return bestLines || [text];
  }

  function drawPlacardCanvas(canvas, title, subtitle, exhibitMeta, frameWidth) {
    const dims = getPlacardDimensions(frameWidth);
    const W = 2048;
    const H = Math.max(128, Math.round(W / dims.aspectRatio));
    if (canvas.width !== W || canvas.height !== H) {
      canvas.width = W;
      canvas.height = H;
    }

    const ctx = canvas.getContext("2d");
    const meta = resolveExhibitMeta(title, null, exhibitMeta);
    const { kicker, main } = parsePlacardParts(meta.plaqueTitle || title || "");

    const bgGrad = ctx.createLinearGradient(0, 0, W, H);
    bgGrad.addColorStop(0, "#17130f");
    bgGrad.addColorStop(0.5, "#110e0b");
    bgGrad.addColorStop(1, "#0b0907");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    // Nét xước đồng đen nằm ngang cực mảnh tạo bề mặt kim loại thật
    ctx.fillStyle = "rgba(255, 224, 150, 0.025)";
    for (let y = 4; y < H; y += 6) {
      ctx.fillRect(0, y, W, 1);
    }

    const outerInset = 10;
    ctx.strokeStyle = "#d4a038";
    ctx.lineWidth = 8;
    ctx.strokeRect(outerInset, outerInset, W - outerInset * 2, H - outerInset * 2);

    const innerInset = 28;
    const innerBoxWidth = W - innerInset * 2;
    const innerBoxHeight = H - innerInset * 2;
    ctx.strokeStyle = "rgba(245, 200, 100, 0.45)";
    ctx.lineWidth = 3;
    ctx.strokeRect(innerInset, innerInset, innerBoxWidth, innerBoxHeight);

    // 4 đinh tán đồng ở 4 góc bảng tên
    const rivetOffset = 48;
    const rivets = [
      [rivetOffset, rivetOffset],
      [W - rivetOffset, rivetOffset],
      [rivetOffset, H - rivetOffset],
      [W - rivetOffset, H - rivetOffset],
    ];
    rivets.forEach(([rx, ry]) => {
      ctx.beginPath();
      ctx.arc(rx, ry, 7, 0, Math.PI * 2);
      ctx.fillStyle = "#d4a038";
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#5c3d11";
      ctx.stroke();
    });

    const safeWidth = innerBoxWidth * 0.86;
    const safeHeight = innerBoxHeight * 0.80;
    const centerX = W / 2;
    const centerY = H / 2;
    const fontFamily = "'Be Vietnam Pro', 'Segoe UI', Tahoma, sans-serif";

    const kickerFontSize = kicker ? Math.max(22, Math.min(34, Math.round(safeHeight * 0.21))) : 0;
    const kickerGap = kicker ? Math.round(kickerFontSize * 0.42) : 0;
    const maxMainHeight = kicker ? safeHeight - kickerFontSize - kickerGap : safeHeight;

    let fontSize = Math.max(26, Math.round(safeHeight * (kicker ? 0.36 : 0.48)));
    let lines = [main];

    while (fontSize >= 22) {
      ctx.font = `700 ${fontSize}px ${fontFamily}`;
      lines = splitBalancedTwoLines(ctx, main, safeWidth);
      const lineHeight = Math.round(fontSize * 1.18);
      const blockHeight = lines.length * lineHeight;
      const maxLineWidth = Math.max(...lines.map((l) => ctx.measureText(l).width));
      if (maxLineWidth <= safeWidth && blockHeight <= maxMainHeight) {
        break;
      }
      fontSize -= 2;
    }

    ctx.font = `700 ${fontSize}px ${fontFamily}`;
    const lineHeight = Math.round(fontSize * 1.18);
    const mainBlockHeight = lines.length * lineHeight;
    const totalBlockHeight = kicker
      ? kickerFontSize + kickerGap + mainBlockHeight
      : mainBlockHeight;

    let currentY = centerY - totalBlockHeight / 2;

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    if (kicker) {
      ctx.font = `700 ${kickerFontSize}px ${fontFamily}`;
      ctx.fillStyle = "#f5c451";
      ctx.fillText(kicker, centerX, currentY + kickerFontSize / 2);
      currentY += kickerFontSize + kickerGap;
    }

    ctx.font = `700 ${fontSize}px ${fontFamily}`;
    ctx.fillStyle = "#fff6d9";
    lines.forEach((ln, idx) => {
      ctx.fillText(ln, centerX, currentY + lineHeight / 2 + idx * lineHeight);
    });

    const maxLineWidth = Math.max(...lines.map((l) => ctx.measureText(l).width));
    canvas._placardMetrics = {
      width: W,
      height: H,
      aspectRatio: W / H,
      meshAspectRatio: dims.aspectRatio,
      safeWidth,
      safeHeight,
      maxLineWidth,
      totalBlockHeight,
      fits: maxLineWidth <= safeWidth + 0.5 && totalBlockHeight <= safeHeight + 0.5,
      title: meta.plaqueTitle || title || "",
    };
  }

  function redrawAllPlacards() {
    for (let i = 0; i < placardRegistry.length; i++) {
      const entry = placardRegistry[i];
      if (!entry || !entry.canvas || !entry.tex) continue;
      drawPlacardCanvas(
        entry.canvas,
        entry.title,
        entry.subtitle,
        entry.exhibitMeta,
        entry.frameWidth,
      );
      entry.tex.needsUpdate = true;
    }
  }

  function createPlacardTexture(title, subtitle, exhibitMeta, frameWidth = 2.6) {
    const canvas = document.createElement("canvas");
    drawPlacardCanvas(canvas, title, subtitle, exhibitMeta, frameWidth);
    const tex = configureCanvasTexture(new THREE.CanvasTexture(canvas), 4);
    placardRegistry.push({ canvas, tex, title, subtitle, exhibitMeta, frameWidth });
    return tex;
  }

  function createComparisonBoardTexture(title, rows) {
    // Tối ưu độ phân giải <= 1024px (1024x640) cho bảng đối chiếu 6 tiêu chí (B2)
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 640;
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, 1024, 640);

    const grad = ctx.createLinearGradient(0, 0, 1024, 0);
    grad.addColorStop(0, "#7c2d12");
    grad.addColorStop(0.5, "#b45309");
    grad.addColorStop(1, "#065f46");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1024, 60);

    ctx.fillStyle = "#f8fafc";
    ctx.font = "bold 23px 'Segoe UI', Tahoma, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(title.toUpperCase(), 512, 39);

    const startX = 26;
    const startY = 74;
    const colWidths = [205, 375, 392];
    const rowHeight = 83;

    ctx.fillStyle = "#1e293b";
    ctx.fillRect(startX, startY, 972, 38);
    ctx.font = "bold 17px 'Segoe UI', Tahoma, sans-serif";
    ctx.textAlign = "left";

    ctx.fillStyle = "#fbbf24";
    ctx.fillText("TIÊU CHÍ SO SÁNH", startX + 10, startY + 25);
    ctx.fillStyle = "#fda4af";
    ctx.fillText(
      "KTTT TƯ BẢN CHỦ NGHĨA",
      startX + colWidths[0] + 10,
      startY + 25,
    );
    ctx.fillStyle = "#6ee7b7";
    ctx.fillText(
      "KTTT ĐỊNH HƯỚNG XHCN VIỆT NAM",
      startX + colWidths[0] + colWidths[1] + 10,
      startY + 25,
    );

    rows.forEach((r, idx) => {
      const y = startY + 44 + idx * rowHeight;
      ctx.fillStyle =
        idx % 2 === 0 ? "rgba(30, 41, 59, 0.82)" : "rgba(15, 23, 42, 0.94)";
      ctx.fillRect(startX, y, 972, rowHeight - 5);

      ctx.fillStyle = "#fbbf24";
      ctx.font = "bold 15px 'Segoe UI', Tahoma, sans-serif";
      wrapCanvasText(
        ctx,
        r.criteria,
        startX + 10,
        y + 28,
        colWidths[0] - 18,
        20,
        2,
      );

      ctx.fillStyle = "#fecdd3";
      ctx.font = "14px 'Segoe UI', Tahoma, sans-serif";
      wrapCanvasText(
        ctx,
        r.capitalist,
        startX + colWidths[0] + 10,
        y + 26,
        colWidths[1] - 18,
        19,
        3,
      );

      ctx.fillStyle = "#d1fae5";
      ctx.font = "bold 14px 'Segoe UI', Tahoma, sans-serif";
      wrapCanvasText(
        ctx,
        r.socialist,
        startX + colWidths[0] + colWidths[1] + 10,
        y + 26,
        colWidths[2] - 18,
        19,
        3,
      );
    });

    ctx.strokeStyle = "rgba(245, 158, 11, 0.5)";
    ctx.lineWidth = 4;
    ctx.strokeRect(7, 7, 1010, 626);

    return configureCanvasTexture(new THREE.CanvasTexture(canvas), 4);
  }

  function createGalleryFrame(width, height, artTexture, placardTexture, data) {
    const group = new THREE.Group();
    const haloTex = createWallWashTexture();

    // Quầng sáng Wall-Wash Halo dịu trên tường phía sau khung tranh
    const wallWashGeo = getSharedGeometry(
      `frame-wallwash-${width}-${height}`,
      () => new THREE.PlaneGeometry(width + 0.72, height + 0.9),
    );
    const wallWashMat = getSharedMaterial(
      "frame-wallwash-mat",
      () =>
        new THREE.MeshBasicMaterial({
          map: haloTex,
          color: 0xffd28a,
          transparent: true,
          opacity: 0.2,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        }),
    );
    const wallWashMesh = new THREE.Mesh(wallWashGeo, wallWashMat);
    wallWashMesh.position.set(0, 0.08, -0.028);
    group.add(wallWashMesh);

    // Tấm đèn hắt lưng tranh (Warm Halo Backlight Strip)
    const backlightGeo = getSharedGeometry(
      `frame-backlight-${width}-${height}`,
      () => new THREE.PlaneGeometry(width + 0.56, height + 0.56),
    );
    const backlightMat = getSharedMaterial(
      "frame-backlight-mat",
      () =>
        new THREE.MeshBasicMaterial({
          map: haloTex,
          color: 0xffb84d,
          transparent: true,
          opacity: 0.34,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        }),
    );
    const backlightMesh = new THREE.Mesh(backlightGeo, backlightMat);
    backlightMesh.position.set(0, 0, -0.024);
    group.add(backlightMesh);

    // Lớp 1 (Ngoài): Brushed Bronze
    const outerFrameGeo = getSharedGeometry(
      `frame-outer-${width}-${height}`,
      () => new THREE.BoxGeometry(width + 0.24, height + 0.24, 0.088),
    );
    const outerFrameMat = getSharedMaterial(
      "frame-outer-mat",
      () =>
        new THREE.MeshStandardMaterial({
          color: 0x6f512c,
          roughness: 0.32,
          metalness: 0.8,
        }),
    );
    const outerFrame = new THREE.Mesh(outerFrameGeo, outerFrameMat);
    outerFrame.castShadow = true;
    outerFrame.receiveShadow = true;
    group.add(outerFrame);

    // Lớp 2 (Giữa): Matte Charcoal tạo rãnh chiều sâu khung
    const midFrameGeo = getSharedGeometry(
      `frame-mid-${width}-${height}`,
      () => new THREE.BoxGeometry(width + 0.14, height + 0.14, 0.102),
    );
    const midFrameMat = getSharedMaterial(
      "frame-mid-mat",
      () =>
        new THREE.MeshStandardMaterial({
          color: 0x151922,
          roughness: 0.65,
          metalness: 0.25,
        }),
    );
    const midFrame = new THREE.Mesh(midFrameGeo, midFrameMat);
    midFrame.position.z = 0.001;
    group.add(midFrame);

    // Lớp 3 (Trong): Gold Bevel Liner phản xạ PBR sắc nét
    const innerBevelGeo = getSharedGeometry(
      `frame-bevel-${width}-${height}`,
      () => new THREE.BoxGeometry(width + 0.055, height + 0.055, 0.11),
    );
    const innerBevelMat = getSharedMaterial(
      "frame-bevel-mat",
      () =>
        new THREE.MeshStandardMaterial({
          color: 0xd4a038,
          roughness: 0.22,
          metalness: 0.88,
        }),
    );
    const innerBevel = new THREE.Mesh(innerBevelGeo, innerBevelMat);
    innerBevel.position.z = 0.002;
    group.add(innerBevel);

    // Thanh đèn rọi tranh gắn đỉnh khung (Picture Light Bar)
    const picLightWidth = Math.min(width * 0.56, 1.4);
    const picArmGeo = getSharedGeometry(
      "frame-piclight-arm",
      () => new THREE.BoxGeometry(0.035, 0.035, 0.22),
    );
    const picBarGeo = getSharedGeometry(
      `frame-piclight-bar-${picLightWidth.toFixed(2)}`,
      () => new THREE.BoxGeometry(picLightWidth, 0.036, 0.052),
    );
    const picStripGeo = getSharedGeometry(
      `frame-piclight-strip-${picLightWidth.toFixed(2)}`,
      () => new THREE.PlaneGeometry(picLightWidth - 0.08, 0.024),
    );
    const picGlowMat = getSharedMaterial(
      "frame-piclight-glow-mat",
      () =>
        new THREE.MeshBasicMaterial({
          color: 0xffe8b0,
          side: THREE.DoubleSide,
        }),
    );
    const picArm = new THREE.Mesh(picArmGeo, innerBevelMat);
    picArm.position.set(0, height / 2 + 0.16, 0.08);
    picArm.rotation.x = 0.25;
    group.add(picArm);

    const picBar = new THREE.Mesh(picBarGeo, outerFrameMat);
    picBar.position.set(0, height / 2 + 0.22, 0.19);
    picBar.rotation.x = 0.45;
    group.add(picBar);

    const picStrip = new THREE.Mesh(picStripGeo, picGlowMat);
    picStrip.position.set(0, height / 2 + 0.205, 0.185);
    picStrip.rotation.x = Math.PI / 2 + 0.45;
    group.add(picStrip);

    // Lớp nền passepartout tối nhám chống phản xạ
    const matBoardGeo = getSharedGeometry(
      `frame-matboard-${width}-${height}`,
      () => new THREE.PlaneGeometry(width + 0.02, height + 0.02),
    );
    const matBoardMat = getSharedMaterial(
      "frame-matboard-mat",
      () =>
        new THREE.MeshStandardMaterial({
          color: 0x0b0f19,
          roughness: 0.96,
          metalness: 0.0,
        }),
    );
    const matBoard = new THREE.Mesh(matBoardGeo, matBoardMat);
    matBoard.position.z = 0.057;
    group.add(matBoard);

    // Bề mặt tranh rõ nét
    const canvasGeo = getSharedGeometry(
      `frame-canvas-${width}-${height}`,
      () => new THREE.PlaneGeometry(width, height),
    );
    const canvasMat = new THREE.MeshStandardMaterial({
      map: artTexture,
      roughness: 0.88,
      metalness: 0.0,
    });
    const canvasMesh = new THREE.Mesh(canvasGeo, canvasMat);
    canvasMesh.position.z = 0.06;
    group.add(canvasMesh);

    // Lớp kính bảo vệ phía trước có độ phản xạ nhẹ (MeshPhysicalMaterial)
    const glassMat = getSharedMaterial(
      "frame-glass-mat",
      () =>
        new THREE.MeshPhysicalMaterial({
          color: 0xffffff,
          transparent: true,
          opacity: 0.085,
          roughness: 0.08,
          metalness: 0.12,
          clearcoat: 1.0,
          clearcoatRoughness: 0.06,
          envMapIntensity: 1.25,
          depthWrite: false,
        }),
    );
    const glassMesh = new THREE.Mesh(canvasGeo, glassMat);
    glassMesh.position.z = 0.068;
    group.add(glassMesh);

    // Đế bảng tên (bottom plaque) bằng đồng đen xước có chiều ngang bằng khung tranh
    const placardDims = getPlacardDimensions(width);
    const placardOuterH = placardDims.outerH;
    const placardInnerH = placardDims.innerH;
    const placardY = -(height / 2 + 0.12 + placardOuterH / 2 + 0.05);
    const placardBaseGeo = getSharedGeometry(
      `placard-base-${width}`,
      () => new THREE.BoxGeometry(width + 0.22, placardOuterH, 0.044),
    );
    const placardBaseMat = getSharedMaterial(
      "placard-base-mat",
      () =>
        new THREE.MeshStandardMaterial({
          color: 0x191612,
          roughness: 0.38,
          metalness: 0.65,
        }),
    );
    const placardBase = new THREE.Mesh(placardBaseGeo, placardBaseMat);
    placardBase.position.set(0, placardY, 0.042);
    placardBase.rotation.x = -0.05;
    placardBase.castShadow = true;
    group.add(placardBase);

    // Mặt bảng tên 3D sắc nét, khớp 100% chiều rộng lọt lòng khung tranh (width)
    const placardGeo = getSharedGeometry(
      `placard-plane-${width}`,
      () => new THREE.PlaneGeometry(width, placardInnerH),
    );
    const placardMat = new THREE.MeshStandardMaterial({
      map: placardTexture,
      roughness: 0.72,
      metalness: 0.15,
    });
    const placardMesh = new THREE.Mesh(placardGeo, placardMat);
    placardMesh.position.set(0, placardY, 0.067);
    placardMesh.rotation.x = -0.05;
    group.add(placardMesh);

    canvasMesh.userData = data;
    glassMesh.userData = data;
    outerFrame.userData = data;
    midFrame.userData = data;
    innerBevel.userData = data;
    placardBase.userData = data;
    placardMesh.userData = data;
    group.userData = data;

    interactableObjects.push(canvasMesh);
    interactableObjects.push(placardMesh);

    return group;
  }

  function createBench(x, z, rotY = 0) {
    const bench = new THREE.Group();
    bench.position.set(x, 0, z);
    bench.rotation.y = rotY;

    // Khung bệ đá/gỗ tối màu thanh lịch
    const plinthGeo = getSharedGeometry(
      "bench-seat-geo",
      () => new THREE.BoxGeometry(2.44, 0.09, 0.88),
    );
    const plinthMat = getSharedMaterial(
      "bench-seat-mat",
      () =>
        new THREE.MeshStandardMaterial({
          color: 0x141822,
          roughness: 0.34,
          metalness: 0.5,
        }),
    );
    const plinth = new THREE.Mesh(plinthGeo, plinthMat);
    plinth.position.y = 0.44;
    plinth.castShadow = true;
    plinth.receiveShadow = true;
    bench.add(plinth);

    // Đệm da than chì khâu rãnh với lớp bóng nhẹ (clearcoat)
    const cushionGeo = getSharedGeometry(
      "bench-cushion-geo",
      () => new THREE.BoxGeometry(2.32, 0.075, 0.8),
    );
    const cushionMat = getSharedMaterial(
      "bench-cushion-mat",
      () =>
        new THREE.MeshPhysicalMaterial({
          color: 0x1f242e,
          roughness: 0.52,
          metalness: 0.05,
          clearcoat: 0.2,
          clearcoatRoughness: 0.45,
        }),
    );
    const cushion = new THREE.Mesh(cushionGeo, cushionMat);
    cushion.position.y = 0.52;
    cushion.castShadow = true;
    bench.add(cushion);

    // Nẹp chỉ đồng thau chạy dọc thân ghế
    const trimGeo = getSharedGeometry(
      "bench-brass-trim-geo",
      () => new THREE.BoxGeometry(2.46, 0.022, 0.9),
    );
    const brassMat = getSharedMaterial(
      "bench-leg-mat",
      () =>
        new THREE.MeshStandardMaterial({
          color: 0xc8963e,
          metalness: 0.82,
          roughness: 0.28,
        }),
    );
    const trim = new THREE.Mesh(trimGeo, brassMat);
    trim.position.y = 0.395;
    bench.add(trim);

    // Chân trượt đồng thau xước hiện đại
    const legGeo = getSharedGeometry(
      "bench-leg-geo",
      () => new THREE.BoxGeometry(0.08, 0.39, 0.76),
    );
    const leg1 = new THREE.Mesh(legGeo, brassMat);
    leg1.position.set(-0.96, 0.195, 0);
    leg1.castShadow = true;
    bench.add(leg1);

    const leg2 = new THREE.Mesh(legGeo, brassMat);
    leg2.position.set(0.96, 0.195, 0);
    leg2.castShadow = true;
    bench.add(leg2);

    // Dải đèn LED ấm dưới gầm ghế
    const ledGeo = getSharedGeometry(
      "bench-led-geo",
      () => new THREE.PlaneGeometry(1.78, 0.16),
    );
    const ledMat = getSharedMaterial(
      "bench-led-mat",
      () =>
        new THREE.MeshBasicMaterial({
          color: 0xf59e0b,
          transparent: true,
          opacity: 0.42,
        }),
    );
    const led = new THREE.Mesh(ledGeo, ledMat);
    led.position.set(0, 0.382, 0);
    led.rotation.x = Math.PI / 2;
    bench.add(led);

    scene.add(bench);
    return bench;
  }

  // Hệ thống đèn rọi ray trần dùng InstancedMesh giảm Draw Calls (A4, B3)
  function createCeilingLights(width, depth, height, targetGroup) {
    const parent = targetGroup || scene;
    if (!parent) return null;

    const lightsGroup = new THREE.Group();
    lightsGroup.name = "ceiling-lights-system";

    const railMat = getSharedMaterial(
      "ceiling-rail-mat",
      () =>
        new THREE.MeshStandardMaterial({
          color: 0x181b24,
          roughness: 0.42,
          metalness: 0.72,
        }),
    );
    const fixtureMat = getSharedMaterial(
      "ceiling-fixture-mat",
      () =>
        new THREE.MeshStandardMaterial({
          color: 0x8a6938,
          roughness: 0.3,
          metalness: 0.82,
        }),
    );
    const bulbMat = getSharedMaterial(
      "ceiling-bulb-mat",
      () =>
        new THREE.MeshBasicMaterial({
          color: 0xfff3d1,
        }),
    );

    const trackOffsetX = Math.max(2.6, width * 0.32);
    const trackLenZ = Math.max(4.0, depth - 3.2);
    const trackLenX = Math.max(4.0, width - 5.2);
    const railY = height - 0.05;

    const sideRailGeo = getSharedGeometry(
      `rail-z-${trackLenZ.toFixed(2)}`,
      () => new THREE.BoxGeometry(0.07, 0.04, trackLenZ),
    );
    const backRailGeo = getSharedGeometry(
      `rail-x-${trackLenX.toFixed(2)}`,
      () => new THREE.BoxGeometry(trackLenX, 0.04, 0.07),
    );

    const leftRail = new THREE.Mesh(sideRailGeo, railMat);
    leftRail.position.set(-trackOffsetX, railY, 0);
    lightsGroup.add(leftRail);

    const rightRail = new THREE.Mesh(sideRailGeo, railMat);
    rightRail.position.set(trackOffsetX, railY, 0);
    lightsGroup.add(rightRail);

    const backRail = new THREE.Mesh(backRailGeo, railMat);
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

    const housingGeo = getSharedGeometry(
      "ceiling-housing-geo",
      () => new THREE.CylinderGeometry(0.08, 0.11, 0.18, 12),
    );
    const lensGeo = getSharedGeometry(
      "ceiling-lens-geo",
      () => new THREE.CylinderGeometry(0.09, 0.09, 0.02, 12),
    );

    const count = fixturePositions.length;
    const housingInstanced = new THREE.InstancedMesh(
      housingGeo,
      fixtureMat,
      count,
    );
    const lensInstanced = new THREE.InstancedMesh(lensGeo, bulbMat, count);
    const dummy = new THREE.Object3D();

    fixturePositions.forEach((pos, idx) => {
      dummy.position.set(pos.x, height - 0.14, pos.z);
      dummy.rotation.set(0, 0, 0);
      dummy.scale.set(1, 1, 1);
      dummy.updateMatrix();
      housingInstanced.setMatrixAt(idx, dummy.matrix);

      dummy.position.set(pos.x, height - 0.23, pos.z);
      dummy.updateMatrix();
      lensInstanced.setMatrixAt(idx, dummy.matrix);
    });

    housingInstanced.instanceMatrix.needsUpdate = true;
    lensInstanced.instanceMatrix.needsUpdate = true;
    lightsGroup.add(housingInstanced);
    lightsGroup.add(lensInstanced);

    parent.add(lightsGroup);
    return lightsGroup;
  }

  // Hệ thống cọc chắn & dây nhung bảo vệ hiện vật dùng InstancedMesh (A4, B3)
  function createStanchionBarrier(segments, targetGroup) {
    const parent = targetGroup || scene;
    if (!parent || !Array.isArray(segments) || segments.length === 0) return null;

    const barrierGroup = new THREE.Group();
    barrierGroup.name = "stanchion-barrier-group";

    const postMat = getSharedMaterial(
      "stanchion-post-mat",
      () =>
        new THREE.MeshStandardMaterial({
          color: 0xc8963e,
          roughness: 0.24,
          metalness: 0.86,
        }),
    );
    const baseMat = getSharedMaterial(
      "stanchion-base-mat",
      () =>
        new THREE.MeshStandardMaterial({
          color: 0x141822,
          roughness: 0.38,
          metalness: 0.6,
        }),
    );
    const ropeMat = getSharedMaterial(
      "stanchion-rope-mat",
      () =>
        new THREE.MeshStandardMaterial({
          color: 0x7f1d2f,
          roughness: 0.82,
          metalness: 0.06,
        }),
    );

    const baseGeo = getSharedGeometry(
      "stanchion-base-geo",
      () => new THREE.CylinderGeometry(0.14, 0.165, 0.04, 18),
    );
    const collarGeo = getSharedGeometry(
      "stanchion-collar-geo",
      () => new THREE.CylinderGeometry(0.055, 0.075, 0.03, 16),
    );
    const poleGeo = getSharedGeometry(
      "stanchion-pole-geo",
      () => new THREE.CylinderGeometry(0.024, 0.026, 0.82, 14),
    );
    const ballGeo = getSharedGeometry(
      "stanchion-ball-geo",
      () => new THREE.CylinderGeometry(0.044, 0.044, 0.028, 16),
    );
    const unitRopeGeo = getSharedGeometry(
      "stanchion-unit-rope-geo",
      () => new THREE.CylinderGeometry(0.017, 0.017, 1.0, 10),
    );

    const placedPosts = new Map();
    const validRopes = [];

    const registerPost = (x, z) => {
      const key = `${x.toFixed(2)},${z.toFixed(2)}`;
      if (!placedPosts.has(key)) {
        placedPosts.set(key, { x, z });
      }
    };

    segments.forEach((seg) => {
      if (!seg) return;
      registerPost(seg.x1, seg.z1);
      registerPost(seg.x2, seg.z2);

      const dx = seg.x2 - seg.x1;
      const dz = seg.z2 - seg.z1;
      const len = Math.hypot(dx, dz);
      if (len > 0.05) {
        validRopes.push({
          mx: (seg.x1 + seg.x2) / 2,
          mz: (seg.z1 + seg.z2) / 2,
          len,
          rotY: -Math.atan2(dz, dx),
        });
      }
    });

    const posts = Array.from(placedPosts.values());
    const dummy = new THREE.Object3D();

    if (posts.length > 0) {
      const baseInstanced = new THREE.InstancedMesh(
        baseGeo,
        baseMat,
        posts.length,
      );
      const collarInstanced = new THREE.InstancedMesh(
        collarGeo,
        postMat,
        posts.length,
      );
      const poleInstanced = new THREE.InstancedMesh(
        poleGeo,
        postMat,
        posts.length,
      );
      const finialInstanced = new THREE.InstancedMesh(
        ballGeo,
        postMat,
        posts.length,
      );
      poleInstanced.castShadow = true;

      posts.forEach((pt, idx) => {
        dummy.rotation.set(0, 0, 0);
        dummy.scale.set(1, 1, 1);

        dummy.position.set(pt.x, 0.02, pt.z);
        dummy.updateMatrix();
        baseInstanced.setMatrixAt(idx, dummy.matrix);

        dummy.position.set(pt.x, 0.055, pt.z);
        dummy.updateMatrix();
        collarInstanced.setMatrixAt(idx, dummy.matrix);

        dummy.position.set(pt.x, 0.45, pt.z);
        dummy.updateMatrix();
        poleInstanced.setMatrixAt(idx, dummy.matrix);

        dummy.position.set(pt.x, 0.87, pt.z);
        dummy.updateMatrix();
        finialInstanced.setMatrixAt(idx, dummy.matrix);
      });

      baseInstanced.instanceMatrix.needsUpdate = true;
      collarInstanced.instanceMatrix.needsUpdate = true;
      poleInstanced.instanceMatrix.needsUpdate = true;
      finialInstanced.instanceMatrix.needsUpdate = true;

      barrierGroup.add(baseInstanced);
      barrierGroup.add(collarInstanced);
      barrierGroup.add(poleInstanced);
      barrierGroup.add(finialInstanced);
    }

    if (validRopes.length > 0) {
      const ropeInstanced = new THREE.InstancedMesh(
        unitRopeGeo,
        ropeMat,
        validRopes.length,
      );
      validRopes.forEach((r, idx) => {
        dummy.position.set(r.mx, 0.72, r.mz);
        dummy.rotation.set(0, r.rotY, Math.PI / 2);
        dummy.scale.set(1, r.len, 1);
        dummy.updateMatrix();
        ropeInstanced.setMatrixAt(idx, dummy.matrix);
      });
      ropeInstanced.instanceMatrix.needsUpdate = true;
      barrierGroup.add(ropeInstanced);
    }

    parent.add(barrierGroup);
    return barrierGroup;
  }

  function createArchitecturalRoom(width, depth, height) {
    const room = new THREE.Group();

    const marbleTex = createMarbleFloorTextures();
    const floorGeo = getSharedGeometry(
      `floor-${width}-${depth}`,
      () => new THREE.PlaneGeometry(width, depth),
    );
    const floorMat = getSharedMaterial("room-floor-mat", () => {
      if (typeof THREE.MeshPhysicalMaterial === "function") {
        return new THREE.MeshPhysicalMaterial({
          map: marbleTex.map,
          roughnessMap: marbleTex.roughnessMap,
          roughness: 0.24,
          metalness: 0.14,
          clearcoat: 0.72,
          clearcoatRoughness: 0.14,
          envMapIntensity: 1.15,
        });
      }
      return new THREE.MeshStandardMaterial({
        map: marbleTex.map,
        roughnessMap: marbleTex.roughnessMap,
        roughness: 0.26,
        metalness: 0.16,
      });
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    room.add(floor);

    const ceilingGeo = getSharedGeometry(
      `ceiling-${width}-${depth}`,
      () => new THREE.PlaneGeometry(width, depth),
    );
    const ceilingMat = getSharedMaterial(
      "room-ceiling-mat",
      () =>
        new THREE.MeshStandardMaterial({
          color: 0x10141d,
          roughness: 0.92,
          metalness: 0.04,
        }),
    );
    const ceiling = new THREE.Mesh(ceilingGeo, ceilingMat);
    ceiling.position.y = height;
    ceiling.rotation.x = Math.PI / 2;
    room.add(ceiling);

    const wallTex = createWallTexture();
    const wallMat = getSharedMaterial(
      "room-wall-mat",
      () =>
        new THREE.MeshStandardMaterial({
          map: wallTex,
          roughness: 0.88,
          metalness: 0.02,
        }),
    );

    const fbWallGeo = getSharedGeometry(
      `wall-fb-${width}-${height}`,
      () => new THREE.PlaneGeometry(width, height),
    );
    const lrWallGeo = getSharedGeometry(
      `wall-lr-${depth}-${height}`,
      () => new THREE.PlaneGeometry(depth, height),
    );

    // Tường sau (-Z)
    const backWall = new THREE.Mesh(fbWallGeo, wallMat);
    backWall.position.set(0, height / 2, -depth / 2);
    backWall.receiveShadow = true;
    room.add(backWall);

    // Tường trước (+Z) khép kín 4 bức tường bảo tàng
    const frontWall = new THREE.Mesh(fbWallGeo, wallMat);
    frontWall.position.set(0, height / 2, depth / 2);
    frontWall.rotation.y = Math.PI;
    frontWall.receiveShadow = true;
    room.add(frontWall);

    // Tường trái (-X)
    const leftWall = new THREE.Mesh(lrWallGeo, wallMat);
    leftWall.position.set(-width / 2, height / 2, 0);
    leftWall.rotation.y = Math.PI / 2;
    leftWall.receiveShadow = true;
    room.add(leftWall);

    // Tường phải (+X)
    const rightWall = new THREE.Mesh(lrWallGeo, wallMat);
    rightWall.position.set(width / 2, height / 2, 0);
    rightWall.rotation.y = -Math.PI / 2;
    rightWall.receiveShadow = true;
    room.add(rightWall);

    // Hệ phào chỉ chân tường đen mờ + chỉ đồng thau, dado đồng xước và phào trần đa cấp kèm LED hắt sáng ấm
    const trimMat = getSharedMaterial(
      "room-trim-mat",
      () =>
        new THREE.MeshStandardMaterial({
          color: 0x161a24,
          roughness: 0.45,
          metalness: 0.35,
        }),
    );
    const accentTrimMat = getSharedMaterial(
      "room-accent-trim-mat",
      () =>
        new THREE.MeshStandardMaterial({
          color: 0xb8862d,
          roughness: 0.28,
          metalness: 0.84,
        }),
    );
    const coveLedMat = getSharedMaterial(
      "room-cove-led-mat",
      () =>
        new THREE.MeshBasicMaterial({
          color: 0xffd591,
        }),
    );

    const addWallMoldings = (len, x, z, rotY) => {
      const wallMoldingGroup = new THREE.Group();
      wallMoldingGroup.position.set(x, 0, z);
      wallMoldingGroup.rotation.y = rotY;

      const baseBoardGeo = getSharedGeometry(
        `molding-base-${len}`,
        () => new THREE.BoxGeometry(len, 0.2, 0.05),
      );
      const baseBoard = new THREE.Mesh(baseBoardGeo, trimMat);
      baseBoard.position.set(0, 0.1, 0.025);
      wallMoldingGroup.add(baseBoard);

      const baseBrassGeo = getSharedGeometry(
        `molding-base-brass-${len}`,
        () => new THREE.BoxGeometry(len, 0.02, 0.056),
      );
      const baseBrass = new THREE.Mesh(baseBrassGeo, accentTrimMat);
      baseBrass.position.set(0, 0.205, 0.028);
      wallMoldingGroup.add(baseBrass);

      const dadoRailGeo = getSharedGeometry(
        `molding-dado-${len}`,
        () => new THREE.BoxGeometry(len, 0.04, 0.036),
      );
      const dadoRail = new THREE.Mesh(dadoRailGeo, accentTrimMat);
      dadoRail.position.set(0, 0.96, 0.018);
      wallMoldingGroup.add(dadoRail);

      // Phào trần đa cấp + khe đèn LED hắt sáng ấm (Cove Lighting)
      const crownGeo = getSharedGeometry(
        `molding-crown-${len}`,
        () => new THREE.BoxGeometry(len, 0.14, 0.09),
      );
      const crownMolding = new THREE.Mesh(crownGeo, trimMat);
      crownMolding.position.set(0, height - 0.07, 0.045);
      wallMoldingGroup.add(crownMolding);

      const crownLowerGeo = getSharedGeometry(
        `molding-crown-lower-${len}`,
        () => new THREE.BoxGeometry(len, 0.06, 0.13),
      );
      const crownLower = new THREE.Mesh(crownLowerGeo, trimMat);
      crownLower.position.set(0, height - 0.17, 0.065);
      wallMoldingGroup.add(crownLower);

      const coveLedGeo = getSharedGeometry(
        `molding-cove-led-${len}`,
        () => new THREE.BoxGeometry(len - 0.6, 0.022, 0.025),
      );
      const coveLed = new THREE.Mesh(coveLedGeo, coveLedMat);
      coveLed.position.set(0, height - 0.135, 0.105);
      wallMoldingGroup.add(coveLed);

      room.add(wallMoldingGroup);
    };

    addWallMoldings(width, 0, -depth / 2, 0);
    addWallMoldings(width, 0, depth / 2, Math.PI);
    addWallMoldings(depth, -width / 2, 0, Math.PI / 2);
    addWallMoldings(depth, width / 2, 0, -Math.PI / 2);

    // Hệ cột trụ kiến trúc âm tường (Architectural Pilasters) dùng InstancedMesh + khe LED ấm
    const pilasterH = height - 0.42;
    const pilasterGeo = getSharedGeometry(
      `pilaster-body-${pilasterH.toFixed(2)}`,
      () => new THREE.BoxGeometry(0.24, pilasterH, 0.065),
    );
    const pilasterLedGeo = getSharedGeometry(
      `pilaster-led-${pilasterH.toFixed(2)}`,
      () => new THREE.BoxGeometry(0.022, pilasterH - 0.18, 0.02),
    );
    const pilasterMat = getSharedMaterial(
      "room-pilaster-mat",
      () =>
        new THREE.MeshStandardMaterial({
          color: 0x1e222d,
          roughness: 0.48,
          metalness: 0.28,
        }),
    );

    const pilasterSpecs = [];
    const fbOffsets = [-(width / 2 - 0.42), -3.75, 3.75, width / 2 - 0.42];
    fbOffsets.forEach((px) => {
      pilasterSpecs.push({ x: px, z: -depth / 2 + 0.032, ry: 0 });
      pilasterSpecs.push({ x: px, z: depth / 2 - 0.032, ry: Math.PI });
    });
    const lrOffsets = [-(depth / 2 - 0.65), depth / 2 - 0.65];
    lrOffsets.forEach((pz) => {
      pilasterSpecs.push({ x: -width / 2 + 0.032, z: pz, ry: Math.PI / 2 });
      pilasterSpecs.push({ x: width / 2 - 0.032, z: pz, ry: -Math.PI / 2 });
    });

    if (pilasterSpecs.length > 0) {
      const pCount = pilasterSpecs.length;
      const pilasterInstanced = new THREE.InstancedMesh(
        pilasterGeo,
        pilasterMat,
        pCount,
      );
      const pilasterLedInstanced = new THREE.InstancedMesh(
        pilasterLedGeo,
        coveLedMat,
        pCount * 2,
      );
      const pDummy = new THREE.Object3D();

      pilasterSpecs.forEach((spec, idx) => {
        pDummy.position.set(spec.x, height / 2 - 0.01, spec.z);
        pDummy.rotation.set(0, spec.ry, 0);
        pDummy.scale.set(1, 1, 1);
        pDummy.updateMatrix();
        pilasterInstanced.setMatrixAt(idx, pDummy.matrix);

        const cosR = Math.cos(spec.ry);
        const sinR = Math.sin(spec.ry);
        [-0.132, 0.132].forEach((sideOffset, sIdx) => {
          pDummy.position.set(
            spec.x + cosR * sideOffset,
            height / 2 - 0.01,
            spec.z - sinR * sideOffset,
          );
          pDummy.rotation.set(0, spec.ry, 0);
          pDummy.updateMatrix();
          pilasterLedInstanced.setMatrixAt(idx * 2 + sIdx, pDummy.matrix);
        });
      });

      pilasterInstanced.instanceMatrix.needsUpdate = true;
      pilasterLedInstanced.instanceMatrix.needsUpdate = true;
      room.add(pilasterInstanced);
      room.add(pilasterLedInstanced);
    }

    // Giếng trời trung tâm (Architectural Coffered Skylight Atrium)
    const skyW = Math.min(8.2, width * 0.44);
    const skyD = Math.min(5.0, depth * 0.36);
    const skylightGroup = new THREE.Group();
    skylightGroup.name = "architectural-skylight-atrium";
    skylightGroup.position.set(0, height - 0.02, -0.35);

    const cofferOuterGeo = getSharedGeometry(
      `skylight-coffer-${skyW.toFixed(1)}-${skyD.toFixed(1)}`,
      () => new THREE.BoxGeometry(skyW + 0.52, 0.14, skyD + 0.52),
    );
    const cofferOuter = new THREE.Mesh(cofferOuterGeo, trimMat);
    cofferOuter.position.y = -0.04;
    skylightGroup.add(cofferOuter);

    const brassBorderGeo = getSharedGeometry(
      `skylight-brass-${skyW.toFixed(1)}-${skyD.toFixed(1)}`,
      () => new THREE.BoxGeometry(skyW + 0.14, 0.16, skyD + 0.14),
    );
    const brassBorder = new THREE.Mesh(brassBorderGeo, accentTrimMat);
    brassBorder.position.y = -0.045;
    skylightGroup.add(brassBorder);

    const skyTex = createSkylightTexture();
    const diffuserGeo = getSharedGeometry(
      `skylight-diffuser-${skyW.toFixed(1)}-${skyD.toFixed(1)}`,
      () => new THREE.PlaneGeometry(skyW, skyD),
    );
    const diffuserMat = getSharedMaterial(
      "skylight-diffuser-mat",
      () =>
        new THREE.MeshBasicMaterial({
          map: skyTex,
          color: 0xfff5dc,
        }),
    );
    const diffuser = new THREE.Mesh(diffuserGeo, diffuserMat);
    diffuser.position.y = -0.128;
    diffuser.rotation.x = Math.PI / 2;
    skylightGroup.add(diffuser);

    // Các thanh đố kiến trúc (mullions) chia ô giếng trời
    const mullionZGeo = getSharedGeometry(
      `skylight-mullion-z-${skyD.toFixed(1)}`,
      () => new THREE.BoxGeometry(0.07, 0.05, skyD),
    );
    [-skyW * 0.25, 0, skyW * 0.25].forEach((mx) => {
      const m = new THREE.Mesh(mullionZGeo, trimMat);
      m.position.set(mx, -0.145, 0);
      skylightGroup.add(m);
    });
    const mullionXGeo = getSharedGeometry(
      `skylight-mullion-x-${skyW.toFixed(1)}`,
      () => new THREE.BoxGeometry(skyW, 0.05, 0.07),
    );
    [-skyD * 0.25, skyD * 0.25].forEach((mz) => {
      const m = new THREE.Mesh(mullionXGeo, trimMat);
      m.position.set(0, -0.145, mz);
      skylightGroup.add(m);
    });

    room.add(skylightGroup);

    // Bổ sung hệ đèn trần cho căn phòng
    createCeilingLights(width, depth, height, room);

    scene.add(room);
    return room;
  }

  // Giải phóng đầy đủ texture và material (bỏ qua tài nguyên dùng chung khi chỉ chuyển phòng)
  function disposeMaterial(mat, forceShared = false) {
    if (!mat) return;
    if (!forceShared && mat.userData && mat.userData.isShared) return;
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
      const tex = mat[slot];
      if (
        tex &&
        typeof tex.dispose === "function" &&
        (forceShared || !tex.userData || !tex.userData.isShared)
      ) {
        tex.dispose();
      }
    });
    if (typeof mat.dispose === "function") {
      mat.dispose();
    }
  }

  function clearScene(forceShared = false) {
    sceneEpoch++;
    interactableObjects.length = 0;
    roomUpdaters.length = 0;
    if (!scene) return;
    while (scene.children.length > 0) {
      const obj = scene.children[0];
      scene.remove(obj);
      if (typeof obj.traverse === "function") {
        obj.traverse((child) => {
          if (
            child.geometry &&
            typeof child.geometry.dispose === "function" &&
            (forceShared ||
              !child.geometry.userData ||
              !child.geometry.userData.isShared)
          ) {
            child.geometry.dispose();
          }
          if (child.material) {
            if (Array.isArray(child.material)) {
              child.material.forEach((m) => disposeMaterial(m, forceShared));
            } else {
              disposeMaterial(child.material, forceShared);
            }
          }
          if (child.isInstancedMesh && typeof child.dispose === "function") {
            child.dispose();
          }
        });
      }
    }
  }

  // Giải phóng toàn bộ bộ nhớ WebGL (bao gồm cả bộ nhớ đệm dùng chung và WebGLRenderer) khi thoát (B2)
  function dispose() {
    pauseRenderLoop();
    clearScene(true);
    sharedResources.geometries.forEach((geo) => {
      if (geo && typeof geo.dispose === "function") geo.dispose();
    });
    sharedResources.geometries.clear();

    sharedResources.materials.forEach((mat) => {
      disposeMaterial(mat, true);
    });
    sharedResources.materials.clear();

    sharedResources.textures.forEach((tex) => {
      if (tex && typeof tex.dispose === "function") tex.dispose();
    });
    sharedResources.textures.clear();

    if (
      window.MuseumAvatar &&
      typeof window.MuseumAvatar.dispose === "function"
    ) {
      window.MuseumAvatar.dispose();
    }

    if (pmremRenderTarget && typeof pmremRenderTarget.dispose === "function") {
      pmremRenderTarget.dispose();
      pmremRenderTarget = null;
    }
    if (scene) {
      scene.environment = null;
    }

    if (renderer && typeof renderer.dispose === "function") {
      renderer.dispose();
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
    placardRegistry.length = 0;
    // Hệ ánh sáng phòng trưng bày PBR có chiều sâu, tôn vật liệu đá & đồng thau
    const hemiLight = new THREE.HemisphereLight(0xf6ebd6, 0x151924, 0.48);
    scene.add(hemiLight);

    const ambLight = new THREE.AmbientLight(0xfff1dc, 0.22);
    scene.add(ambLight);

    const dirLight = new THREE.DirectionalLight(0xfff4e0, 0.42);
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
    renderer.setPixelRatio(getOptimalPixelRatio());
    renderer.setSize(width, height);
  }

  function shouldPauseRender() {
    return Boolean((document && document.hidden) || isManualPaused);
  }

  function pauseRenderLoop() {
    if (animId !== null) {
      cancelAnimationFrame(animId);
      animId = null;
    }
    keys.w = false;
    keys.a = false;
    keys.s = false;
    keys.d = false;
  }

  function resumeRenderLoop() {
    if (shouldPauseRender() || !renderer || !scene || !camera) return;
    if (animId === null) {
      lastFrameTime =
        typeof performance !== "undefined" && performance.now
          ? performance.now()
          : Date.now();
      animId = requestAnimationFrame(animate);
    }
  }

  function setPaused(paused) {
    isManualPaused = Boolean(paused);
    if (shouldPauseRender()) {
      pauseRenderLoop();
    } else {
      resumeRenderLoop();
    }
  }

  function isPaused() {
    return shouldPauseRender() || animId === null;
  }

  function animate(now) {
    if (shouldPauseRender()) {
      animId = null;
      return;
    }

    animId = requestAnimationFrame(animate);

    const currentTime =
      typeof now === "number"
        ? now
        : typeof performance !== "undefined" && performance.now
          ? performance.now()
          : Date.now();
    const rawDt =
      lastFrameTime > 0 ? (currentTime - lastFrameTime) / 1000 : 1 / 60;
    lastFrameTime = currentTime;
    const clampedDt = Math.min(Math.max(rawDt, 0), 0.05);
    elapsedClock += clampedDt;

    if (window.MuseumAvatar && window.MuseumAvatar.updateWalking) {
      window.MuseumAvatar.updateWalking(camYaw, keys, currentRoom, rawDt);
    }

    for (let i = 0; i < roomUpdaters.length; i++) {
      try {
        roomUpdaters[i](clampedDt, elapsedClock);
      } catch (_) {}
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
    renderer.setPixelRatio(getOptimalPixelRatio());
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.06;
    if (THREE.SRGBColorSpace && "outputColorSpace" in renderer) {
      renderer.outputColorSpace = THREE.SRGBColorSpace;
    } else if (THREE.sRGBEncoding) {
      renderer.outputEncoding = THREE.sRGBEncoding;
    }

    pmremRenderTarget = createProceduralEnvironment(renderer);
    if (pmremRenderTarget && pmremRenderTarget.texture) {
      scene.environment = pmremRenderTarget.texture;
    }

    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    window.addEventListener("resize", onWindowResize);

    // Tự động tạm dừng / tiếp tục vòng lặp render khi ẩn/hiện tab hoặc chuyển chế độ (B4)
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        pauseRenderLoop();
      } else {
        resumeRenderLoop();
      }
    });

    window.addEventListener("message", (e) => {
      if (!e || !e.data) return;
      if (e.data.type === "MUSEUM_SET_ACTIVE") {
        setPaused(!e.data.active);
        if (e.data.active) {
          onWindowResize();
        }
      }
    });

    loadRoom(1);

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        redrawAllPlacards();
      });
    }

    if (window.MuseumControls && window.MuseumControls.init) {
      window.MuseumControls.init(camera, renderer.domElement, keys);
    }

    // Đồng bộ trạng thái tạm dừng ban đầu theo tab đang mở ở cửa sổ cha
    try {
      if (
        window.parent &&
        window.parent !== window &&
        typeof window.parent.getCurrentActiveTab === "function" &&
        window.parent.getCurrentActiveTab() !== "idea2"
      ) {
        isManualPaused = true;
      }
    } catch (_) {}

    // Vẽ frame đầu tiên ngay khi khởi tạo, sau đó chạy vòng lặp nếu tab đang hiển thị
    updateShiftLockCamera();
    renderer.render(scene, camera);
    resumeRenderLoop();
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
    setPaused,
    isPaused,
    dispose,
    getOptimalPixelRatio,
    getSharedGeometry,
    getSharedMaterial,
    getScene: () => scene,
    getRenderer: () => renderer,
    interactableObjects,
    createArtworkTexture,
    createPlacardTexture,
    getPlacardDimensions,
    getPlacardMetrics: () =>
      placardRegistry.map((entry) =>
        entry && entry.canvas ? entry.canvas._placardMetrics : null,
      ),
    createComparisonBoardTexture,
    createGalleryFrame,
    createBench,
    createCeilingLights,
    createStanchionBarrier,
    createArchitecturalRoom,
    registerRoomUpdater,
    drawExhibitInfographic: (...args) =>
      window.MuseumVisuals
        ? window.MuseumVisuals.drawExhibitInfographic(...args)
        : null,
    renderInfographicDataUrl: (...args) =>
      window.MuseumVisuals
        ? window.MuseumVisuals.renderInfographicDataUrl(...args)
        : "",
    loadExhibitImageWithFallback: (...args) =>
      window.MuseumVisuals
        ? window.MuseumVisuals.loadExhibitImageWithFallback(...args)
        : Promise.resolve({ ok: false }),
  };
})();

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () =>
    window.MuseumEngine.init(),
  );
} else {
  window.MuseumEngine.init();
}
