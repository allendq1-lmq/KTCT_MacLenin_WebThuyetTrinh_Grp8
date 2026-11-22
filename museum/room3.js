// museum/room3.js - Phòng 3: Tương phản Mảng Tối (Hổ phách/Đỏ trầm) vs Mảng Sáng (Ngọc lục bảo/Vàng ấm), Đại cảnh Đối chiếu & Đài Phán quyết
window.MuseumRoom3 = (() => {
  function createWingNiche(ex, isDarkWing, scene) {
    const niche = new THREE.Group();
    niche.position.set(ex.x, ex.y, ex.z);
    niche.rotation.y = ex.rotY;

    const accentColor = isDarkWing ? 0xd94826 : 0x10b981;
    const panel = new THREE.Mesh(
      new THREE.BoxGeometry(4.1, 2.9, 0.04),
      new THREE.MeshStandardMaterial({
        color: isDarkWing ? 0x170d0e : 0x0b1614,
        roughness: 0.85,
        metalness: 0.15,
      }),
    );
    panel.position.set(0, -0.08, -0.105);
    niche.add(panel);

    const trimMat = new THREE.MeshStandardMaterial({
      color: isDarkWing ? 0x7c2d12 : 0x065f46,
      roughness: 0.4,
      metalness: 0.55,
    });
    const ledMat = new THREE.MeshBasicMaterial({ color: accentColor });

    [-2.06, 2.06].forEach((ox) => {
      const col = new THREE.Mesh(
        new THREE.BoxGeometry(0.12, 3.05, 0.1),
        trimMat,
      );
      col.position.set(ox, -0.08, -0.065);
      niche.add(col);

      const led = new THREE.Mesh(
        new THREE.BoxGeometry(0.024, 2.78, 0.02),
        ledMat,
      );
      led.position.set(ox > 0 ? ox - 0.09 : ox + 0.09, -0.08, -0.018);
      niche.add(led);
    });

    scene.add(niche);
  }

  function buildWingAtmosphere(scene) {
    // Đèn khu vực tạo tương phản không gian giữa Cánh Trái (Mảng Tối) và Cánh Phải (Mảng Sáng)
    const leftAmberLight = new THREE.PointLight(0xdc3522, 0.95, 13.5, 1.6);
    leftAmberLight.position.set(-6.2, 3.1, 0);
    scene.add(leftAmberLight);

    const rightEmeraldLight = new THREE.PointLight(0x10b981, 0.95, 13.5, 1.6);
    rightEmeraldLight.position.set(6.2, 3.1, 0);
    scene.add(rightEmeraldLight);

    // Dải đèn dẫn sàn phân tách hai cánh không gian
    const leftStrip = new THREE.Mesh(
      new THREE.PlaneGeometry(0.14, 11.4),
      new THREE.MeshBasicMaterial({
        color: 0xd94826,
        transparent: true,
        opacity: 0.68,
      }),
    );
    leftStrip.rotation.x = -Math.PI / 2;
    leftStrip.position.set(-8.65, 0.01, 0);
    scene.add(leftStrip);

    const rightStrip = new THREE.Mesh(
      new THREE.PlaneGeometry(0.14, 11.4),
      new THREE.MeshBasicMaterial({
        color: 0x10b981,
        transparent: true,
        opacity: 0.68,
      }),
    );
    rightStrip.rotation.x = -Math.PI / 2;
    rightStrip.position.set(8.65, 0.01, 0);
    scene.add(rightStrip);

    // Trục dẫn sàn trung tâm hướng về Bảng đối chiếu 6 tiêu chí
    const axisMat = new THREE.MeshStandardMaterial({
      color: 0x161b26,
      roughness: 0.35,
      metalness: 0.5,
    });
    const centerRunway = new THREE.Mesh(
      new THREE.PlaneGeometry(1.8, 10.6),
      axisMat,
    );
    centerRunway.rotation.x = -Math.PI / 2;
    centerRunway.position.set(0, 0.008, -0.5);
    centerRunway.receiveShadow = true;
    scene.add(centerRunway);

    const centerBrassLineL = new THREE.Mesh(
      new THREE.PlaneGeometry(0.06, 10.6),
      new THREE.MeshBasicMaterial({ color: 0xf59e0b }),
    );
    centerBrassLineL.rotation.x = -Math.PI / 2;
    centerBrassLineL.position.set(-0.88, 0.011, -0.5);
    scene.add(centerBrassLineL);

    const centerBrassLineR = new THREE.Mesh(
      new THREE.PlaneGeometry(0.06, 10.6),
      new THREE.MeshBasicMaterial({ color: 0xf59e0b }),
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
      roughness: 0.25,
      metalness: 0.42,
    });
    const brassMat = new THREE.MeshStandardMaterial({
      color: 0xd4a038,
      roughness: 0.24,
      metalness: 0.88,
    });

    // Bậc thềm đá dưới bảng đối chiếu
    const step = new THREE.Mesh(
      new THREE.BoxGeometry(7.0, 0.18, 0.72),
      darkMarbleMat,
    );
    step.position.set(0, 0.09, 0.14);
    step.receiveShadow = true;
    portal.add(step);

    // 2 trụ đá cẩm thạch đen & chỉ đồng đối xứng hai bên bảng 6 tiêu chí
    [-3.22, 3.22].forEach((px, idx) => {
      const col = new THREE.Mesh(
        new THREE.BoxGeometry(0.32, 4.18, 0.24),
        darkMarbleMat,
      );
      col.position.set(px, 2.09, -0.02);
      portal.add(col);

      const accent = new THREE.Mesh(
        new THREE.BoxGeometry(0.05, 4.0, 0.26),
        new THREE.MeshBasicMaterial({
          color: idx === 0 ? 0xf97316 : 0x10b981,
        }),
      );
      accent.position.set(px > 0 ? px - 0.16 : px + 0.16, 2.09, -0.01);
      portal.add(accent);
    });

    // Dầm đỉnh có dải LED vàng hắt xuống
    const lintel = new THREE.Mesh(
      new THREE.BoxGeometry(6.8, 0.24, 0.28),
      darkMarbleMat,
    );
    lintel.position.set(0, 4.18, 0);
    portal.add(lintel);

    const lintelBrass = new THREE.Mesh(
      new THREE.BoxGeometry(6.6, 0.035, 0.3),
      brassMat,
    );
    lintelBrass.position.set(0, 4.05, 0.01);
    portal.add(lintelBrass);

    const topLed = new THREE.Mesh(
      new THREE.BoxGeometry(5.6, 0.025, 0.04),
      new THREE.MeshBasicMaterial({ color: 0xffe099 }),
    );
    topLed.position.set(0, 4.02, 0.08);
    portal.add(topLed);

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
          3.3,
          boardTex,
          placardTex,
          userData,
        );
        frame.position.set(ex.x, ex.y, ex.z);
        frame.rotation.y = ex.rotY;
        scene.add(frame);

        const spotCenter = new THREE.SpotLight(
          0xfff3d6,
          1.6,
          12.0,
          Math.PI / 2.8,
          0.7,
          1.5,
        );
        spotCenter.position.set(0, 4.3, -2.5);
        spotCenter.target = frame;
        scene.add(spotCenter);
      } else if (ex.id === "r3-verdict") {
        // Đài Phán quyết trung tâm nâng cấp: 2 bậc đá cẩm thạch đen + viền đồng thau + vòng hào quang quay
        const verdictGroup = new THREE.Group();
        verdictGroup.position.set(ex.x, 0, ex.z);

        const marblePedMat = new THREE.MeshStandardMaterial({
          color: 0x131722,
          roughness: 0.24,
          metalness: 0.45,
        });
        const brassMat = new THREE.MeshStandardMaterial({
          color: 0xd4a038,
          roughness: 0.22,
          metalness: 0.88,
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
          new THREE.TorusGeometry(1.08, 0.025, 12, 48),
          brassMat,
        );
        brassTrim.rotation.x = Math.PI / 2;
        brassTrim.position.y = 0.505;
        verdictGroup.add(brassTrim);

        const verdictHalo = new THREE.Mesh(
          new THREE.TorusGeometry(1.42, 0.02, 10, 48),
          new THREE.MeshBasicMaterial({ color: 0xfbbf24 }),
        );
        verdictHalo.rotation.x = Math.PI / 2;
        verdictHalo.position.y = 0.02;
        verdictGroup.add(verdictHalo);

        // 2 trụ đèn kiến trúc nhỏ hai bên đài phán quyết
        [-1.12, 1.12].forEach((lx) => {
          const post = new THREE.Mesh(
            new THREE.CylinderGeometry(0.04, 0.055, 0.92, 16),
            brassMat,
          );
          post.position.set(lx, 0.68, 0);
          verdictGroup.add(post);

          const orb = new THREE.Mesh(
            new THREE.SphereGeometry(0.07, 16, 16),
            new THREE.MeshBasicMaterial({ color: 0xffe6a3 }),
          );
          orb.position.set(lx, 1.18, 0);
          verdictGroup.add(orb);
        });

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
        frame.position.set(0, 1.94, 0);
        verdictGroup.add(frame);

        step1.userData = userData;
        step2.userData = userData;
        window.MuseumEngine.interactableObjects.push(step1);
        window.MuseumEngine.interactableObjects.push(step2);
        scene.add(verdictGroup);

        if (window.MuseumEngine && window.MuseumEngine.registerRoomUpdater) {
          window.MuseumEngine.registerRoomUpdater((dt, elapsed) => {
            verdictHalo.rotation.z += dt * 0.35;
            verdictHalo.scale.setScalar(1 + Math.sin(elapsed * 1.8) * 0.015);
          });
        }

        const spotVerdict = new THREE.SpotLight(
          0xfff1cc,
          1.45,
          9.8,
          Math.PI / 3.1,
          0.68,
          1.5,
        );
        spotVerdict.position.set(0, 4.25, ex.z + 2.8);
        spotVerdict.target = verdictGroup;
        scene.add(spotVerdict);
      } else {
        // Tranh Mảng tối (Tường trái: x < 0) & Mảng sáng (Tường phải: x > 0)
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

        const spotColor = isDarkWing ? 0xff9d76 : 0xa7f3d0;
        const spot = new THREE.SpotLight(
          spotColor,
          1.48,
          10.8,
          Math.PI / 3.0,
          0.68,
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
