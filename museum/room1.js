// museum/room1.js - Phòng 1: Tổng quan về KTTT ĐHXHCN ở Việt Nam (Kiến trúc Vòm, Thảm dẫn hướng trầm thanh lịch & Hốc trưng bày)
window.MuseumRoom1 = (() => {
  function createExhibitionRunnerTexture() {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 1024;
    const ctx = canvas.getContext("2d");

    // Thảm dẫn hướng tông xám than trầm thanh lịch, làm nổi bật các khung tranh
    const grad = ctx.createLinearGradient(0, 0, 512, 0);
    grad.addColorStop(0, "#151820");
    grad.addColorStop(0.14, "#1b1e26");
    grad.addColorStop(0.5, "#232732");
    grad.addColorStop(0.86, "#1b1e26");
    grad.addColorStop(1, "#151820");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 1024);

    // Đường vân dệt mảnh tạo chất liệu thảm bảo tàng
    ctx.fillStyle = "rgba(0, 0, 0, 0.14)";
    for (let y = 0; y < 1024; y += 6) {
      ctx.fillRect(0, y, 512, 2);
    }

    // Viền chỉ đồng dịu hai bên và hai đầu thảm
    ctx.fillStyle = "rgba(196, 154, 72, 0.52)";
    ctx.fillRect(24, 0, 7, 1024);
    ctx.fillRect(481, 0, 7, 1024);

    ctx.fillStyle = "rgba(196, 154, 72, 0.28)";
    ctx.fillRect(40, 0, 3, 1024);
    ctx.fillRect(469, 0, 3, 1024);

    ctx.fillStyle = "rgba(196, 154, 72, 0.52)";
    ctx.fillRect(24, 14, 464, 7);
    ctx.fillRect(24, 1003, 464, 7);

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
        color: 0x10131b,
        roughness: 0.88,
        metalness: 0.1,
      }),
    );
    const backPanel = new THREE.Mesh(backPanelGeo, backPanelMat);
    backPanel.position.set(0, -0.08, -0.105);
    nicheGroup.add(backPanel);

    const sidePillarGeo = getGeo("r1-niche-pillar", () =>
      new THREE.BoxGeometry(0.11, 2.65, 0.095),
    );
    const sidePillarMat = getMat("r1-niche-pillar-mat", () =>
      new THREE.MeshStandardMaterial({
        color: 0x1b202c,
        roughness: 0.52,
        metalness: 0.35,
      }),
    );
    [-1.68, 1.68].forEach((ox) => {
      const p = new THREE.Mesh(sidePillarGeo, sidePillarMat);
      p.position.set(ox, -0.08, -0.065);
      nicheGroup.add(p);
    });

    scene.add(nicheGroup);
  }

  function buildCeilingArches(scene) {
    const archGroup = new THREE.Group();
    const darkMetalMat = new THREE.MeshStandardMaterial({
      color: 0x161b26,
      roughness: 0.48,
      metalness: 0.55,
    });
    const brassMat = new THREE.MeshStandardMaterial({
      color: 0xb0863a,
      roughness: 0.36,
      metalness: 0.78,
    });

    [-3.8, 0, 3.8].forEach((zPos) => {
      const rib = new THREE.Mesh(
        new THREE.BoxGeometry(17.6, 0.16, 0.22),
        darkMetalMat,
      );
      rib.position.set(0, 4.24, zPos);
      archGroup.add(rib);

      const brassUnder = new THREE.Mesh(
        new THREE.BoxGeometry(17.4, 0.024, 0.09),
        brassMat,
      );
      brassUnder.position.set(0, 4.148, zPos);
      archGroup.add(brassUnder);
    });

    scene.add(archGroup);
  }

  function build(scene) {
    window.MuseumEngine.createArchitecturalRoom(18, 14, 4.4);

    // Thảm dẫn hướng trung tâm thoáng đãng (Exhibition Runner)
    const runnerTex = createExhibitionRunnerTexture();
    const runnerMat = new THREE.MeshStandardMaterial({
      map: runnerTex,
      roughness: 0.9,
      metalness: 0.02,
    });
    const runner = new THREE.Mesh(
      new THREE.PlaneGeometry(2.6, 10.4),
      runnerMat,
    );
    runner.rotation.x = -Math.PI / 2;
    runner.position.set(0, 0.008, -0.2);
    runner.receiveShadow = true;
    scene.add(runner);

    buildCeilingArches(scene);

    // Hai ghế nghỉ bảo tàng đặt cân đối hai bên sảnh trung tâm thoáng đãng
    window.MuseumEngine.createBench(-2.8, 0.8);
    window.MuseumEngine.createBench(2.8, 0.8);

    // Hàng cọc chắn dây nhung bảo vệ dọc khu vực trưng bày tranh
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
      });
    }
  }

  return { build };
})();
