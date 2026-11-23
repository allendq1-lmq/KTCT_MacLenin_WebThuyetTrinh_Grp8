// museum/room3.js - Phòng 3: Không gian trầm tĩnh hài hòa, Đại cảnh Bảng đối chiếu 6 tiêu chí & Đài Phán quyết trung tâm
window.MuseumRoom3 = (() => {
  function createWingNiche(ex, isDarkWing, scene) {
    const niche = new THREE.Group();
    niche.position.set(ex.x, ex.y, ex.z);
    niche.rotation.y = ex.rotY;

    const panel = new THREE.Mesh(
      new THREE.BoxGeometry(4.1, 2.9, 0.04),
      new THREE.MeshStandardMaterial({
        color: isDarkWing ? 0x13151d : 0x10151b,
        roughness: 0.88,
        metalness: 0.1,
      }),
    );
    panel.position.set(0, -0.08, -0.105);
    niche.add(panel);

    const trimMat = new THREE.MeshStandardMaterial({
      color: 0x1b202c,
      roughness: 0.5,
      metalness: 0.35,
    });

    [-2.06, 2.06].forEach((ox) => {
      const col = new THREE.Mesh(
        new THREE.BoxGeometry(0.12, 3.05, 0.095),
        trimMat,
      );
      col.position.set(ox, -0.08, -0.065);
      niche.add(col);
    });

    scene.add(niche);
  }

  function buildWingAtmosphere(scene) {
    // Ánh sáng bổ trợ dịu nhẹ cho hai cánh (loại bỏ hoàn toàn ánh sáng đỏ/xanh neon gắt gây ám màu tường)
    const leftWarmLight = new THREE.PointLight(0xd4a373, 0.38, 13.0, 1.8);
    leftWarmLight.position.set(-6.2, 3.1, 0);
    scene.add(leftWarmLight);

    const rightSoftLight = new THREE.PointLight(0xdfece6, 0.38, 13.0, 1.8);
    rightSoftLight.position.set(6.2, 3.1, 0);
    scene.add(rightSoftLight);

    // Trục dẫn sàn trung tâm trầm tĩnh hướng về Bảng đối chiếu 6 tiêu chí
    const axisMat = new THREE.MeshStandardMaterial({
      color: 0x161b26,
      roughness: 0.65,
      metalness: 0.2,
    });
    const centerRunway = new THREE.Mesh(
      new THREE.PlaneGeometry(1.8, 10.6),
      axisMat,
    );
    centerRunway.rotation.x = -Math.PI / 2;
    centerRunway.position.set(0, 0.008, -0.5);
    centerRunway.receiveShadow = true;
    scene.add(centerRunway);

    const lineMat = new THREE.MeshStandardMaterial({
      color: 0x7a6030,
      roughness: 0.45,
      metalness: 0.65,
    });

    const centerBrassLineL = new THREE.Mesh(
      new THREE.PlaneGeometry(0.035, 10.6),
      lineMat,
    );
    centerBrassLineL.rotation.x = -Math.PI / 2;
    centerBrassLineL.position.set(-0.88, 0.011, -0.5);
    scene.add(centerBrassLineL);

    const centerBrassLineR = new THREE.Mesh(
      new THREE.PlaneGeometry(0.035, 10.6),
      lineMat,
    );
    centerBrassLineR.rotation.x = -Math.PI / 2;
    centerBrassLineR.position.set(0.88, 0.011, -0.5);
    scene.add(centerBrassLineR);
  }

  function buildComparisonPortal(ex, scene) {
    const portal = new THREE.Group();
    portal.position.set(ex.x, 0, ex.z);

    const darkMarbleMat = new THREE.MeshStandardMaterial({
      color: 0x121620,
      roughness: 0.35,
      metalness: 0.3,
    });
    const brassMat = new THREE.MeshStandardMaterial({
      color: 0xb0863a,
      roughness: 0.34,
      metalness: 0.8,
    });

    // Bậc thềm đá thấp dưới bảng đối chiếu
    const step = new THREE.Mesh(
      new THREE.BoxGeometry(7.0, 0.14, 0.72),
      darkMarbleMat,
    );
    step.position.set(0, 0.07, 0.14);
    step.receiveShadow = true;
    portal.add(step);

    // 2 trụ đá cẩm thạch đen đối xứng hai bên bảng 6 tiêu chí
    [-3.22, 3.22].forEach((px) => {
      const col = new THREE.Mesh(
        new THREE.BoxGeometry(0.3, 4.3, 0.24),
        darkMarbleMat,
      );
      col.position.set(px, 2.15, -0.02);
      portal.add(col);
    });

    // Dầm đỉnh kiến trúc
    const lintel = new THREE.Mesh(
      new THREE.BoxGeometry(6.8, 0.2, 0.28),
      darkMarbleMat,
    );
    lintel.position.set(0, 4.3, 0);
    portal.add(lintel);

    const lintelBrass = new THREE.Mesh(
      new THREE.BoxGeometry(6.6, 0.028, 0.3),
      brassMat,
    );
    lintelBrass.position.set(0, 4.19, 0.01);
    portal.add(lintelBrass);

    scene.add(portal);
  }

  function build(scene) {
    window.MuseumEngine.createArchitecturalRoom(20, 14, 4.5);
    buildWingAtmosphere(scene);

    window.MuseumEngine.createBench(-3.2, 0.2);
    window.MuseumEngine.createBench(3.2, 0.2);

    // Hệ thống cọc chắn và dây bảo vệ quanh bảng đối chiếu, tranh tường và Đài Phán quyết
    if (window.MuseumEngine.createStanchionBarrier) {
      const r3Segments = [
        { x1: -8.9, z1: -4.2, x2: -8.9, z2: 0 },
        { x1: -8.9, z1: 0, x2: -8.9, z2: 4.2 },
        { x1: 8.9, z1: -4.2, x2: 8.9, z2: 0 },
        { x1: 8.9, z1: 0, x2: 8.9, z2: 4.2 },
        { x1: -3.2, z1: -5.85, x2: 0, z2: -5.85 },
        { x1: 0, z1: -5.85, x2: 3.2, z2: -5.85 },
      ];
      const verdictSides = 8;
      const verdictRadius = 1.62;
      for (let i = 0; i < verdictSides; i++) {
        const a1 = (i * 2 * Math.PI) / verdictSides;
        const a2 = ((i + 1) * 2 * Math.PI) / verdictSides;
        r3Segments.push({
          x1: Math.cos(a1) * verdictRadius,
          z1: 1.6 + Math.sin(a1) * verdictRadius,
          x2: Math.cos(a2) * verdictRadius,
          z2: 1.6 + Math.sin(a2) * verdictRadius,
        });
      }
      window.MuseumEngine.createStanchionBarrier(r3Segments, scene);
    }

    if (!window.MuseumData || !window.MuseumData.room3) return;

    const exhibits = window.MuseumData.room3.exhibits;

    exhibits.forEach((ex) => {
      const userData = {
        id: ex.id,
        room: 3,
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
      };

      if (ex.id === "r3-table") {
        buildComparisonPortal(ex, scene);

        const boardTex = window.MuseumEngine.createArtworkTexture(
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
          5.6,
        );
        const frame = window.MuseumEngine.createGalleryFrame(
          5.6,
          2.95,
          boardTex,
          placardTex,
          userData,
        );
        frame.position.set(ex.x, 2.48, ex.z);
        frame.rotation.y = ex.rotY;
        scene.add(frame);

        const spotCenter = new THREE.SpotLight(
          0xfff2dc,
          1.48,
          12.0,
          Math.PI / 2.8,
          0.72,
          1.5,
        );
        spotCenter.position.set(0, 4.3, -2.5);
        spotCenter.target = frame;
        scene.add(spotCenter);
      } else if (ex.id === "r3-verdict") {
        // Đài Phán quyết trung tâm tĩnh tại, trang nghiêm (không cột đèn cầu và vòng neon)
        const verdictGroup = new THREE.Group();
        verdictGroup.position.set(ex.x, 0, ex.z);

        const marblePedMat = new THREE.MeshStandardMaterial({
          color: 0x131722,
          roughness: 0.34,
          metalness: 0.3,
        });
        const brassMat = new THREE.MeshStandardMaterial({
          color: 0xb8862d,
          roughness: 0.3,
          metalness: 0.82,
        });

        const step1 = new THREE.Mesh(
          new THREE.CylinderGeometry(1.36, 1.48, 0.22, 36),
          marblePedMat,
        );
        step1.position.y = 0.11;
        step1.castShadow = true;
        step1.receiveShadow = true;
        verdictGroup.add(step1);

        const step2 = new THREE.Mesh(
          new THREE.CylinderGeometry(1.06, 1.16, 0.28, 36),
          marblePedMat,
        );
        step2.position.y = 0.36;
        step2.castShadow = true;
        verdictGroup.add(step2);

        const brassTrim = new THREE.Mesh(
          new THREE.TorusGeometry(1.08, 0.02, 12, 48),
          brassMat,
        );
        brassTrim.rotation.x = Math.PI / 2;
        brassTrim.position.y = 0.505;
        verdictGroup.add(brassTrim);

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
          2.5,
        );
        const frame = window.MuseumEngine.createGalleryFrame(
          2.5,
          1.55,
          artTex,
          placardTex,
          userData,
        );
        frame.position.set(0, 2.06, 0);
        verdictGroup.add(frame);

        step1.userData = userData;
        step2.userData = userData;
        window.MuseumEngine.interactableObjects.push(step1);
        window.MuseumEngine.interactableObjects.push(step2);
        scene.add(verdictGroup);

        const spotVerdict = new THREE.SpotLight(
          0xfff2dc,
          1.38,
          9.8,
          Math.PI / 3.1,
          0.72,
          1.5,
        );
        spotVerdict.position.set(0, 4.25, ex.z + 2.8);
        spotVerdict.target = verdictGroup;
        scene.add(spotVerdict);
      } else {
        // Tranh hai cánh: ánh sáng rọi bảo tàng ấm tự nhiên
        const isDarkWing = ex.x < 0;
        createWingNiche(ex, isDarkWing, scene);

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
          3.4,
        );
        const frame = window.MuseumEngine.createGalleryFrame(
          3.4,
          2.1,
          artTex,
          placardTex,
          userData,
        );
        frame.position.set(ex.x, ex.y, ex.z);
        frame.rotation.y = ex.rotY;
        scene.add(frame);

        const spot = new THREE.SpotLight(
          0xfff2dc,
          1.4,
          10.8,
          Math.PI / 3.0,
          0.72,
          1.5,
        );
        spot.position.set(ex.x > 0 ? ex.x - 2.8 : ex.x + 2.8, 4.2, ex.z);
        spot.target = frame;
        scene.add(spot);
      }
    });
  }

  return { build };
})();
