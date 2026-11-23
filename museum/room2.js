// museum/room2.js - Phòng 2: Năm đặc trưng cơ bản của KTTT ĐHXHCN ở Việt Nam (Đài trưng bày đa tầng tĩnh tại + 5 Cột rãnh đá thanh lịch)
window.MuseumRoom2 = (() => {
  function createFlutedColumnTexture() {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#dfd9ce";
    ctx.fillRect(0, 0, 512, 512);

    const flutes = 24;
    const step = 512 / flutes;
    for (let i = 0; i < flutes; i++) {
      const x = i * step;
      const g = ctx.createLinearGradient(x, 0, x + step, 0);
      g.addColorStop(0, "#b9b0a1");
      g.addColorStop(0.25, "#eee9df");
      g.addColorStop(0.55, "#dfd8cb");
      g.addColorStop(0.85, "#c2b9aa");
      g.addColorStop(1, "#ada495");
      ctx.fillStyle = g;
      ctx.fillRect(x, 0, step + 0.5, 512);
    }

    // Dải hoa văn chỉ đồng mảnh trầm ở phần trên & dưới thân cột
    ctx.fillStyle = "rgba(180, 135, 56, 0.35)";
    ctx.fillRect(0, 18, 512, 6);
    ctx.fillRect(0, 488, 512, 6);

    const tex = new THREE.CanvasTexture(canvas);
    if (THREE.SRGBColorSpace && "colorSpace" in tex) {
      tex.colorSpace = THREE.SRGBColorSpace;
    } else if (THREE.sRGBEncoding) {
      tex.encoding = THREE.sRGBEncoding;
    }
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    tex.needsUpdate = true;
    return tex;
  }

  function build(scene) {
    window.MuseumEngine.createArchitecturalRoom(18, 15, 4.6);
    window.MuseumEngine.createBench(0, 4.2);

    const centerData =
      window.MuseumData && window.MuseumData.room2
        ? window.MuseumData.room2.center
        : null;

    // Đài trưng bày đá cẩm thạch đa tầng 2.a tĩnh tại, trang trọng
    const centerGroup = new THREE.Group();
    centerGroup.position.set(0, 0, -0.8);

    const marblePedMat = new THREE.MeshStandardMaterial({
      color: 0x151922,
      roughness: 0.34,
      metalness: 0.25,
    });
    const brassMat = new THREE.MeshStandardMaterial({
      color: 0xb8862d,
      metalness: 0.82,
      roughness: 0.3,
    });

    const tier1 = new THREE.Mesh(
      new THREE.CylinderGeometry(1.56, 1.72, 0.2, 36),
      marblePedMat,
    );
    tier1.position.y = 0.1;
    tier1.castShadow = true;
    tier1.receiveShadow = true;
    centerGroup.add(tier1);

    const tier2 = new THREE.Mesh(
      new THREE.CylinderGeometry(1.28, 1.4, 0.22, 36),
      marblePedMat,
    );
    tier2.position.y = 0.31;
    tier2.castShadow = true;
    centerGroup.add(tier2);

    const tier3 = new THREE.Mesh(
      new THREE.CylinderGeometry(1.02, 1.1, 0.22, 36),
      marblePedMat,
    );
    tier3.position.y = 0.53;
    tier3.castShadow = true;
    centerGroup.add(tier3);

    const midBrassRing = new THREE.Mesh(
      new THREE.TorusGeometry(1.31, 0.022, 12, 48),
      brassMat,
    );
    midBrassRing.rotation.x = Math.PI / 2;
    midBrassRing.position.y = 0.42;
    centerGroup.add(midBrassRing);

    const topBrassRing = new THREE.Mesh(
      new THREE.TorusGeometry(1.03, 0.018, 12, 48),
      brassMat,
    );
    topBrassRing.rotation.x = Math.PI / 2;
    topBrassRing.position.y = 0.64;
    centerGroup.add(topBrassRing);

    if (centerData) {
      const centerArtTex = window.MuseumEngine.createArtworkTexture(
        centerData.title,
        centerData.subtitle,
        centerData.badge,
        centerData.color,
        centerData.lines,
        centerData,
      );
      const centerPlacardTex = window.MuseumEngine.createPlacardTexture(
        centerData.title,
        centerData.subtitle,
        centerData,
        2.3,
      );
      const centerFrame = window.MuseumEngine.createGalleryFrame(
        2.3,
        1.45,
        centerArtTex,
        centerPlacardTex,
        {
          id: centerData.id,
          room: 2,
          sectionCode: centerData.sectionCode,
          visualType: centerData.visualType,
          localImagePath: centerData.localImagePath,
          preferLocal: centerData.preferLocal,
          plaqueTitle: centerData.plaqueTitle,
          imageUrl: centerData.imageUrl,
          imageCaption: centerData.imageCaption,
          badge: centerData.badge,
          title: centerData.title,
          subtitle: centerData.subtitle,
          desc: centerData.desc,
          fullHtml: centerData.fullHtml,
          camPos: centerData.camPos,
          lookPos: centerData.lookPos,
        },
      );
      centerFrame.position.set(0, 2.18, 0);
      centerGroup.add(centerFrame);

      tier1.userData = centerFrame.userData;
      tier2.userData = centerFrame.userData;
      tier3.userData = centerFrame.userData;
      midBrassRing.userData = centerFrame.userData;
      window.MuseumEngine.interactableObjects.push(tier1);
      window.MuseumEngine.interactableObjects.push(tier3);
    }

    scene.add(centerGroup);

    // Hàng rào cọc chắn bát giác bảo vệ quanh bệ trưng bày trung tâm Phòng 2
    if (window.MuseumEngine.createStanchionBarrier) {
      const centerRingSegments = [];
      const sides = 8;
      const barrierRadius = 1.85;
      for (let i = 0; i < sides; i++) {
        const a1 = (i * 2 * Math.PI) / sides;
        const a2 = ((i + 1) * 2 * Math.PI) / sides;
        centerRingSegments.push({
          x1: Math.cos(a1) * barrierRadius,
          z1: -0.8 + Math.sin(a1) * barrierRadius,
          x2: Math.cos(a2) * barrierRadius,
          z2: -0.8 + Math.sin(a2) * barrierRadius,
        });
      }
      window.MuseumEngine.createStanchionBarrier(centerRingSegments, scene);
    }

    // 5 Cột trụ rãnh đá thanh lịch (InstancedMesh, không vòng neon phát sáng)
    const radius = 5.4;
    if (
      window.MuseumData &&
      window.MuseumData.room2 &&
      Array.isArray(window.MuseumData.room2.pillars)
    ) {
      const pillars = window.MuseumData.room2.pillars;
      const pCount = pillars.length;

      const getGeo =
        window.MuseumEngine.getSharedGeometry || ((_, fn) => fn());
      const getMat =
        window.MuseumEngine.getSharedMaterial || ((_, fn) => fn());

      const fluteTex = createFlutedColumnTexture();

      const baseGeo = getGeo("room2_pillar_base_geo", () =>
        new THREE.BoxGeometry(1.78, 0.36, 1.78),
      );
      const plinthGeo = getGeo("room2_pillar_plinth_geo", () =>
        new THREE.BoxGeometry(1.48, 0.16, 1.48),
      );
      const shaftGeo = getGeo("room2_pillar_shaft_geo", () =>
        new THREE.CylinderGeometry(0.56, 0.64, 3.58, 28),
      );
      const capGeo = getGeo("room2_pillar_cap_geo", () =>
        new THREE.BoxGeometry(1.66, 0.28, 1.66),
      );

      const baseMat = getMat("room2_pillar_base_mat", () =>
        new THREE.MeshStandardMaterial({
          color: 0x161a24,
          roughness: 0.4,
          metalness: 0.32,
        }),
      );
      const shaftMat = getMat("room2_pillar_shaft_mat", () =>
        new THREE.MeshStandardMaterial({
          map: fluteTex,
          roughness: 0.56,
          metalness: 0.06,
        }),
      );

      const useInstanced =
        typeof THREE.InstancedMesh === "function" && pCount > 0;
      const basesInstanced = useInstanced
        ? new THREE.InstancedMesh(baseGeo, baseMat, pCount)
        : null;
      const plinthsInstanced = useInstanced
        ? new THREE.InstancedMesh(plinthGeo, baseMat, pCount)
        : null;
      const shaftsInstanced = useInstanced
        ? new THREE.InstancedMesh(shaftGeo, shaftMat, pCount)
        : null;
      const capsInstanced = useInstanced
        ? new THREE.InstancedMesh(capGeo, baseMat, pCount)
        : null;
      const dummy = new THREE.Object3D();

      pillars.forEach((p, idx) => {
        const rad = (p.angleDeg * Math.PI) / 180;
        const x = Math.cos(rad) * radius;
        const z = Math.sin(rad) * radius - 0.8;

        const pillarGroup = new THREE.Group();
        pillarGroup.position.set(x, 0, z);
        pillarGroup.lookAt(0, 0, -0.8);

        if (useInstanced) {
          dummy.rotation.copy(pillarGroup.rotation);
          dummy.scale.set(1, 1, 1);

          dummy.position.set(x, 0.18, z);
          dummy.updateMatrix();
          basesInstanced.setMatrixAt(idx, dummy.matrix);

          dummy.position.set(x, 0.44, z);
          dummy.updateMatrix();
          plinthsInstanced.setMatrixAt(idx, dummy.matrix);

          dummy.position.set(x, 2.31, z);
          dummy.updateMatrix();
          shaftsInstanced.setMatrixAt(idx, dummy.matrix);

          dummy.position.set(x, 4.24, z);
          dummy.updateMatrix();
          capsInstanced.setMatrixAt(idx, dummy.matrix);
        } else {
          const base = new THREE.Mesh(baseGeo, baseMat);
          base.position.y = 0.18;
          pillarGroup.add(base);

          const shaft = new THREE.Mesh(shaftGeo, shaftMat);
          shaft.position.y = 2.31;
          pillarGroup.add(shaft);

          const cap = new THREE.Mesh(capGeo, baseMat);
          cap.position.y = 4.24;
          pillarGroup.add(cap);
        }

        const artTex = window.MuseumEngine.createArtworkTexture(
          p.title,
          p.subtitle,
          p.badge,
          p.color,
          p.lines,
          p,
        );
        const placardTex = window.MuseumEngine.createPlacardTexture(
          p.title,
          p.subtitle,
          p,
          2.1,
        );

        const frame = window.MuseumEngine.createGalleryFrame(
          2.1,
          1.35,
          artTex,
          placardTex,
          {
            id: p.id,
            room: 2,
            sectionCode: p.sectionCode,
            visualType: p.visualType,
            localImagePath: p.localImagePath,
            preferLocal: p.preferLocal,
            plaqueTitle: p.plaqueTitle,
            imageUrl: p.imageUrl,
            imageCaption: p.imageCaption,
            badge: p.badge,
            title: p.title,
            subtitle: p.subtitle,
            desc: p.desc,
            fullHtml: p.fullHtml,
            camPos: p.camPos,
            lookPos: p.lookPos,
          },
        );
        frame.position.set(0, 2.25, 0.78);
        pillarGroup.add(frame);

        scene.add(pillarGroup);
      });

      if (useInstanced) {
        basesInstanced.castShadow = true;
        shaftsInstanced.castShadow = true;
        basesInstanced.instanceMatrix.needsUpdate = true;
        plinthsInstanced.instanceMatrix.needsUpdate = true;
        shaftsInstanced.instanceMatrix.needsUpdate = true;
        capsInstanced.instanceMatrix.needsUpdate = true;
        scene.add(basesInstanced);
        scene.add(plinthsInstanced);
        scene.add(shaftsInstanced);
        scene.add(capsInstanced);
      }
    }
  }

  return { build };
})();
