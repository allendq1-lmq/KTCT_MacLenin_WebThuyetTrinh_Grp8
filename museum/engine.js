// museum/engine.js - Quản lý Three.js Engine & Chuyển động Camera mượt mà
window.MuseumEngine = (() => {
  let container, renderer, scene, camera, controls;
  let currentRoom = 1;
  let animId = null;
  const interactableObjects = [];
  const keys = { w: false, a: false, s: false, d: false };

  let isTransitioning = false;
  let transitionProgress = 0;
  const transitionDuration = 45;
  const startCamPos = new THREE.Vector3();
  const startTargetPos = new THREE.Vector3();
  const destCamPos = new THREE.Vector3();
  const destTargetPos = new THREE.Vector3();

  const cameraPresets = {
    room1: {
      cam: new THREE.Vector3(0, 1.8, 5.0),
      target: new THREE.Vector3(0, 1.8, 0),
    },
    room2: {
      cam: new THREE.Vector3(0, 2.0, 5.2),
      target: new THREE.Vector3(0, 1.6, -1.0),
    },
    room3: {
      cam: new THREE.Vector3(0, 1.8, 5.0),
      target: new THREE.Vector3(0, 1.8, 0),
    },
  };

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
    bgGrad.addColorStop(0, "#161b26");
    bgGrad.addColorStop(1, "#0d1117");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 2048, 1400);

    ctx.fillStyle = "rgba(255, 255, 255, 0.03)";
    ctx.fillRect(40, 40, 1968, 1320);

    ctx.fillStyle = tagColor || "#d97706";
    ctx.fillRect(100, 100, 20, 140);

    ctx.fillStyle = tagColor || "#f59e0b";
    ctx.font = "bold 44px 'Segoe UI', Tahoma, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText((badgeText || "CHỦ ĐỀ LÝ LUẬN").toUpperCase(), 150, 145);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 76px 'Segoe UI', Tahoma, sans-serif";
    ctx.fillText(title, 150, 225);

    ctx.fillStyle = "#94a3b8";
    ctx.font = "italic 44px 'Segoe UI', Tahoma, sans-serif";
    ctx.fillText(subtitle, 150, 310);

    ctx.strokeStyle = "rgba(217, 119, 6, 0.4)";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(150, 360);
    ctx.lineTo(1900, 360);
    ctx.stroke();

    ctx.fillStyle = "#e2e8f0";
    ctx.font = "500 52px 'Segoe UI', Tahoma, sans-serif";
    const startY = 480;
    const lineHeight = 80;

    if (Array.isArray(descLines)) {
      descLines.forEach((line, idx) => {
        ctx.fillText(line, 150, startY + idx * lineHeight);
      });
    }

    ctx.strokeStyle = "rgba(255,255,255,0.15)";
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
    ctx.font = "bold 52px 'Segoe UI', Tahoma, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(title, 512, 130);

    ctx.fillStyle = "#64748b";
    ctx.font = "40px 'Segoe UI', Tahoma, sans-serif";
    ctx.fillText(subtitle, 512, 220);

    ctx.fillStyle = "#d97706";
    ctx.font = "bold 32px 'Segoe UI', Tahoma, sans-serif";
    ctx.fillText("NHẤP ĐỂ TẬP TRUNG GÓC NHÌN", 512, 290);

    const tex = new THREE.CanvasTexture(canvas);
    tex.anisotropy = 4;
    return tex;
  }

  function createTableTexture(title, headers, rows) {
    const canvas = document.createElement("canvas");
    canvas.width = 2048;
    canvas.height = 1350;
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#111827";
    ctx.fillRect(0, 0, 2048, 1350);
    ctx.fillStyle = "#991b1b";
    ctx.fillRect(0, 0, 2048, 140);
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 64px 'Segoe UI', Tahoma, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(title.toUpperCase(), 1024, 95);

    const startX = 80;
    const startY = 200;
    const colWidths = [180, 580, 1120];
    const rowHeight = 190;

    ctx.fillStyle = "#1f2937";
    ctx.fillRect(startX, startY, 1880, 90);
    ctx.fillStyle = "#f3f4f6";
    ctx.font = "bold 44px 'Segoe UI', Tahoma, sans-serif";
    ctx.textAlign = "left";

    let curX = startX + 30;
    headers.forEach((h, idx) => {
      ctx.fillText(h, curX, startY + 60);
      curX += colWidths[idx];
    });

    rows.forEach((r, rIdx) => {
      const y = startY + 110 + rIdx * rowHeight;
      ctx.fillStyle =
        rIdx % 2 === 0 ? "rgba(31, 41, 55, 0.45)" : "rgba(17, 24, 39, 0.75)";
      ctx.fillRect(startX, y, 1880, rowHeight - 16);

      ctx.fillStyle = "#f59e0b";
      ctx.font = "bold 48px 'Segoe UI', Tahoma, sans-serif";
      ctx.fillText(r.stt, startX + 45, y + 105);

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 44px 'Segoe UI', Tahoma, sans-serif";
      ctx.fillText(r.name, startX + colWidths[0] + 20, y + 80);

      ctx.fillStyle = "#cbd5e1";
      ctx.font = "40px 'Segoe UI', Tahoma, sans-serif";
      ctx.fillText(r.desc, startX + colWidths[0] + colWidths[1] + 20, y + 70);
      if (r.desc2) {
        ctx.fillText(
          r.desc2,
          startX + colWidths[0] + colWidths[1] + 20,
          y + 125,
        );
      }
    });

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

    const placardGeo = new THREE.PlaneGeometry(0.75, 0.28);
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

    const backWall = new THREE.Mesh(
      new THREE.PlaneGeometry(width, height),
      wallMat,
    );
    backWall.position.set(0, height / 2, -depth / 2);
    backWall.receiveShadow = true;
    room.add(backWall);

    const leftWall = new THREE.Mesh(
      new THREE.PlaneGeometry(depth, height),
      wallMat,
    );
    leftWall.position.set(-width / 2, height / 2, 0);
    leftWall.rotation.y = Math.PI / 2;
    leftWall.receiveShadow = true;
    room.add(leftWall);

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

  function clearScene() {
    interactableObjects.length = 0;
    while (scene.children.length > 0) {
      const obj = scene.children[0];
      scene.remove(obj);
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) {
        if (Array.isArray(obj.material))
          obj.material.forEach((m) => m.dispose());
        else obj.material.dispose();
      }
    }
  }

  function setRoom(roomNumber) {
    currentRoom = roomNumber;
    clearScene();
    loadRoom(roomNumber);
  }

  function loadRoom(roomNumber) {
    const hemiLight = new THREE.HemisphereLight(0xfff6ea, 0x1e222d, 0.75);
    scene.add(hemiLight);

    const ambLight = new THREE.AmbientLight(0xfff5eb, 0.35);
    scene.add(ambLight);

    if (window.MuseumAvatar && window.MuseumAvatar.create) {
      const avatar = window.MuseumAvatar.create();
      scene.add(avatar);
    }

    const preset = cameraPresets[`room${roomNumber}`];
    focusTarget(
      preset.cam.x,
      preset.cam.y,
      preset.cam.z,
      preset.target.x,
      preset.target.y,
      preset.target.z,
      true,
    );

    if (roomNumber === 1 && window.MuseumRoom1) window.MuseumRoom1.build(scene);
    else if (roomNumber === 2 && window.MuseumRoom2)
      window.MuseumRoom2.build(scene);
    else if (roomNumber === 3 && window.MuseumRoom3)
      window.MuseumRoom3.build(scene);
  }

  function focusTarget(
    camX,
    camY,
    camZ,
    lookX,
    lookY,
    lookZ,
    immediate = false,
  ) {
    if (immediate) {
      camera.position.set(camX, camY, camZ);
      controls.target.set(lookX, lookY, lookZ);
      controls.update();
      isTransitioning = false;
      return;
    }

    startCamPos.copy(camera.position);
    startTargetPos.copy(controls.target);
    destCamPos.set(camX, camY, camZ);
    destTargetPos.set(lookX, lookY, lookZ);

    transitionProgress = 0;
    isTransitioning = true;
  }

  function cancelTransition() {
    isTransitioning = false;
  }

  function resetCamera() {
    const preset = cameraPresets[`room${currentRoom}`];
    focusTarget(
      preset.cam.x,
      preset.cam.y,
      preset.cam.z,
      preset.target.x,
      preset.target.y,
      preset.target.z,
    );

    if (window.MuseumAvatar) {
      const avatar = window.MuseumAvatar.getAvatar();
      if (avatar) {
        avatar.position.set(0, 0, 1.5);
        avatar.rotation.set(0, 0, 0);
      }
    }
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
      window.MuseumAvatar.updateWalking(camera, controls, keys, currentRoom);
    }

    if (isTransitioning) {
      transitionProgress += 1 / transitionDuration;
      const t = Math.min(1, transitionProgress);
      const ease = t * t * (3 - 2 * t);

      camera.position.lerpVectors(startCamPos, destCamPos, ease);
      controls.target.lerpVectors(startTargetPos, destTargetPos, ease);
      controls.update();

      if (t >= 1) {
        isTransitioning = false;
      }
    } else {
      controls.update();
    }

    renderer.render(scene, camera);
  }

  function init() {
    if (renderer) {
      onWindowResize();
      return;
    }

    if (
      typeof THREE === "undefined" ||
      typeof THREE.OrbitControls === "undefined"
    ) {
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

    camera = new THREE.PerspectiveCamera(52, width / height, 0.1, 100);

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

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.maxDistance = 12;
    controls.minDistance = 1.0;
    controls.maxPolarAngle = Math.PI / 2 - 0.03;

    window.addEventListener("resize", onWindowResize);

    if (window.MuseumControls && window.MuseumControls.init) {
      window.MuseumControls.init(camera, renderer.domElement, keys);
    }

    loadRoom(1);
    animate();
  }

  return {
    init,
    setRoom,
    resetCamera,
    focusTarget,
    cancelTransition,
    onWindowResize,
    getScene: () => scene,
    getRenderer: () => renderer,
    interactableObjects,
    createArtworkTexture,
    createPlacardTexture,
    createTableTexture,
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
