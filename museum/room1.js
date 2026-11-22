// museum/room1.js - Phòng 1: Tổng quan về KTTT ĐHXHCN ở Việt Nam (Kiến trúc Vòm, Thảm dẫn hướng, Tượng đài trung tâm & Hốc trưng bày)
window.MuseumRoom1 = (() => {
  function createExhibitionRunnerTexture() {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 1024;
    const ctx = canvas.getContext("2d");

    const grad = ctx.createLinearGradient(0, 0, 512, 0);
    grad.addColorStop(0, "#310d17");
    grad.addColorStop(0.14, "#4b1222");
    grad.addColorStop(0.5, "#5c172a");
    grad.addColorStop(0.86, "#4b1222");
    grad.addColorStop(1, "#310d17");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 1024);

    // Đường vân dệt chéo nhẹ tạo chất liệu thảm nhung
    ctx.fillStyle = "rgba(0, 0, 0, 0.14)";
    for (let y = 0; y < 1024; y += 6) {
      ctx.fillRect(0, y, 512, 2);
    }

    // Viền kép vàng đồng hai bên thảm dẫn hướng
    ctx.fillStyle = "#d4a038";
    ctx.fillRect(22, 0, 10, 1024);
    ctx.fillRect(480, 0, 10, 1024);

    ctx.fillStyle = "rgba(253, 230, 138, 0.65)";
    ctx.fillRect(42, 0, 4, 1024);
    ctx.fillRect(466, 0, 4, 1024);

    // Viền đầu và cuối thảm
    ctx.fillStyle = "#d4a038";
    ctx.fillRect(22, 14, 468, 10);
    ctx.fillRect(22, 1000, 468, 10);

    const tex = new THREE.CanvasTexture(canvas);
    if (THREE.SRGBColorSpace && "colorSpace" in tex) {
      tex.colorSpace = THREE.SRGBColorSpace;
    } else if (THREE.sRGBEncoding) {
      tex.encoding = THREE.sRGBEncoding;
    }
    tex.needsUpdate = true;
    return tex;
  }

  function createDisplayNiche(ex, scene) {
    const nicheGroup = new THREE.Group();
    nicheGroup.position.set(ex.x, ex.y, ex.z);
    nicheGroup.rotation.y = ex.rotY;

    const getGeo =
      window.MuseumEngine.getSharedGeometry || ((_, fn) => fn());
    const getMat =
      window.MuseumEngine.getSharedMaterial || ((_, fn) => fn());

    const backPanelGeo = getGeo("r1-niche-back", () =>
      new THREE.BoxGeometry(3.3, 2.55, 0.04),
    );
    const backPanelMat = getMat("r1-niche-back-mat", () =>
      new THREE.MeshStandardMaterial({
        color: 0x0f131c,
        roughness: 0.85,
        metalness: 0.15,
      }),
    );
    const backPanel = new THREE.Mesh(backPanelGeo, backPanelMat);
    backPanel.position.set(0, -0.08, -0.105);
    nicheGroup.add(backPanel);

    const sidePillarGeo = getGeo("r1-niche-pillar", () =>
      new THREE.BoxGeometry(0.11, 2.65, 0.1),
    );
    const sidePillarMat = getMat("r1-niche-pillar-mat", () =>
      new THREE.MeshStandardMaterial({
        color: 0x1b202c,
        roughness: 0.45,
        metalness: 0.45,
      }),
    );
    [-1.68, 1.68].forEach((ox) => {
      const p = new THREE.Mesh(sidePillarGeo, sidePillarMat);
      p.position.set(ox, -0.08, -0.065);
      nicheGroup.add(p);
    });

    const ledStripGeo = getGeo("r1-niche-led", () =>
      new THREE.BoxGeometry(0.022, 2.38, 0.02),
    );
    const ledStripMat = getMat("r1-niche-led-mat", () =>
      new THREE.MeshBasicMaterial({
        color: 0xffcf7d,
      }),
    );
    [-1.58, 1.58].forEach((ox) => {
      const strip = new THREE.Mesh(ledStripGeo, ledStripMat);
      strip.position.set(ox, -0.08, -0.015);
      nicheGroup.add(strip);
    });

    scene.add(nicheGroup);
  }

  function buildCenterMonument(scene) {
    const monument = new THREE.Group();
    monument.position.set(0, 0, -1.2);

    const marbleMat = new THREE.MeshStandardMaterial({
      color: 0x141822,
      roughness: 0.25,
      metalness: 0.35,
    });
    const brassMat = new THREE.MeshStandardMaterial({
      color: 0xd4a038,
      roughness: 0.24,
      metalness: 0.88,
    });

    const tier1 = new THREE.Mesh(
      new THREE.CylinderGeometry(1.18, 1.32, 0.24, 32),
      marbleMat,
    );
    tier1.position.y = 0.12;
    tier1.castShadow = true;
    tier1.receiveShadow = true;
    monument.add(tier1);

    const tier2 = new THREE.Mesh(
      new THREE.CylinderGeometry(0.84, 0.96, 0.34, 32),
      marbleMat,
    );
    tier2.position.y = 0.41;
    tier2.castShadow = true;
    monument.add(tier2);

    const collar = new THREE.Mesh(
      new THREE.TorusGeometry(0.86, 0.03, 12, 40),
      brassMat,
    );
    collar.rotation.x = Math.PI / 2;
    collar.position.y = 0.58;
    monument.add(collar);

    const halo = new THREE.Mesh(
      new THREE.TorusGeometry(1.22, 0.018, 10, 48),
      new THREE.MeshBasicMaterial({ color: 0xfbbf24 }),
    );
    halo.rotation.x = Math.PI / 2;
    halo.position.y = 0.02;
    monument.add(halo);

    // Cụm biểu tượng vòng đồng thau lồng nhau & lõi tinh thể vàng xoay nhẹ
    const kineticGroup = new THREE.Group();
    kineticGroup.position.set(0, 1.28, 0);

    const outerRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.56, 0.028, 16, 48),
      brassMat,
    );
    kineticGroup.add(outerRing);

    const innerRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.41, 0.022, 16, 48),
      brassMat,
    );
    innerRing.rotation.x = Math.PI / 3;
    kineticGroup.add(innerRing);

    const coreCrystal = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.17, 0),
      new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        emissive: 0xd97706,
        emissiveIntensity: 0.45,
        metalness: 0.65,
        roughness: 0.2,
      }),
    );
    kineticGroup.add(coreCrystal);

    monument.add(kineticGroup);
    scene.add(monument);

    if (window.MuseumEngine && window.MuseumEngine.registerRoomUpdater) {
      window.MuseumEngine.registerRoomUpdater((dt, elapsed) => {
        outerRing.rotation.y += dt * 0.45;
        outerRing.rotation.z = Math.sin(elapsed * 0.6) * 0.18;
        innerRing.rotation.y -= dt * 0.65;
        innerRing.rotation.x += dt * 0.28;
        coreCrystal.rotation.y += dt * 0.8;
        coreCrystal.position.y = Math.sin(elapsed * 1.6) * 0.04;
      });
    }
  }

  function buildCeilingArches(scene) {
    const archGroup = new THREE.Group();
    const darkMetalMat = new THREE.MeshStandardMaterial({
      color: 0x161b26,
      roughness: 0.4,
      metalness: 0.65,
    });
    const brassMat = new THREE.MeshStandardMaterial({
      color: 0xc8963e,
      roughness: 0.28,
      metalness: 0.85,
    });

    [-3.8, 0, 3.8].forEach((zPos) => {
      const rib = new THREE.Mesh(
        new THREE.BoxGeometry(17.6, 0.16, 0.22),
        darkMetalMat,
      );
      rib.position.set(0, 4.24, zPos);
      archGroup.add(rib);

      const brassUnder = new THREE.Mesh(
        new THREE.BoxGeometry(17.4, 0.028, 0.1),
        brassMat,
      );
      brassUnder.position.set(0, 4.145, zPos);
      archGroup.add(brassUnder);
    });

    scene.add(archGroup);
  }

  function build(scene) {
    window.MuseumEngine.createArchitecturalRoom(18, 14, 4.4);

    // Thảm dẫn hướng trung tâm (Exhibition Runner)
    const runnerTex = createExhibitionRunnerTexture();
    const runnerMat = new THREE.MeshStandardMaterial({
      map: runnerTex,
      roughness: 0.88,
      metalness: 0.04,
    });
    const runner = new THREE.Mesh(
      new THREE.PlaneGeometry(2.5, 10.2),
      runnerMat,
    );
    runner.rotation.x = -Math.PI / 2;
    runner.position.set(0, 0.008, -0.3);
    runner.receiveShadow = true;
    scene.add(runner);

    buildCeilingArches(scene);
    buildCenterMonument(scene);

    // Hai ghế nghỉ bảo tàng đặt cân đối hai bên hành lang trung tâm
    window.MuseumEngine.createBench(-3.2, 1.5);
    window.MuseumEngine.createBench(3.2, 1.5);

    // Hàng cọc chắn dây nhung bảo vệ dọc khu vực trưng bày tranh và tượng đài trung tâm
    if (window.MuseumEngine.createStanchionBarrier) {
      const segments = [
        { x1: -7.95, z1: -3.6, x2: -7.95, z2: 0 },
        { x1: -7.95, z1: 0, x2: -7.95, z2: 3.6 },
        { x1: -6.8, z1: -5.95, x2: -2.8, z2: -5.95 },
        { x1: -2.8, z1: -5.95, x2: 2.8, z2: -5.95 },
        { x1: 2.8, z1: -5.95, x2: 6.8, z2: -5.95 },
        { x1: 7.95, z1: -4.2, x2: 7.95, z2: 0.2 },
        { x1: 7.95, z1: 0.2, x2: 7.95, z2: 4.4 },
      ];
      const sides = 6;
      const r = 1.48;
      for (let i = 0; i < sides; i++) {
        const a1 = (i * 2 * Math.PI) / sides;
        const a2 = ((i + 1) * 2 * Math.PI) / sides;
        segments.push({
          x1: Math.cos(a1) * r,
          z1: -1.2 + Math.sin(a1) * r,
          x2: Math.cos(a2) * r,
          z2: -1.2 + Math.sin(a2) * r,
        });
      }
      window.MuseumEngine.createStanchionBarrier(segments, scene);
    }

    if (window.MuseumData && window.MuseumData.room1) {
      window.MuseumData.room1.exhibits.forEach((ex) => {
        createDisplayNiche(ex, scene);

        const artTex = window.MuseumEngine.createArtworkTexture(
          ex.title,
          ex.subtitle,
          ex.badge,
          ex.color,
          ex.lines,
          ex,
        );
        const placardTex = window.MuseumEngine.createPlacardTexture(
          ex.title,
          ex.subtitle,
          ex,
          2.6,
        );
        const frame = window.MuseumEngine.createGalleryFrame(
          2.6,
          1.65,
          artTex,
          placardTex,
          {
            id: ex.id,
            room: 1,
            sectionCode: ex.sectionCode,
            visualType: ex.visualType,
            localImagePath: ex.localImagePath,
            preferLocal: ex.preferLocal,
            plaqueTitle: ex.plaqueTitle,
            imageUrl: ex.imageUrl,
            imageCaption: ex.imageCaption,
            badge: ex.badge,
            title: ex.title,
            subtitle: ex.subtitle,
            desc: ex.desc,
            fullHtml: ex.fullHtml,
            camPos: ex.camPos,
            lookPos: ex.lookPos,
          },
        );
        frame.position.set(ex.x, ex.y, ex.z);
        frame.rotation.y = ex.rotY;
        scene.add(frame);

        // Đèn rọi tranh ấm áp, dịu mắt
        const spot = new THREE.SpotLight(
          0xfff1d0,
          1.4,
          9.8,
          Math.PI / 3.1,
          0.7,
          1.5,
        );
        if (ex.wall === "back") {
          spot.position.set(ex.x, 4.15, ex.z + 2.6);
        } else if (ex.wall === "left") {
          spot.position.set(ex.x + 2.6, 4.15, ex.z);
        } else {
          spot.position.set(ex.x - 2.6, 4.15, ex.z);
        }
        spot.target = frame;
        scene.add(spot);
      });
    }
  }

  return { build };
})();
