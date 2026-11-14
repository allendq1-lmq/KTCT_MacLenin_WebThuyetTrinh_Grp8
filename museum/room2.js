// museum/room2.js - Phòng 2: Năm đặc trưng cơ bản của KTTT ĐHXHCN ở Việt Nam (Bệ trung tâm 2.a + 5 Cột trụ 2.b)
window.MuseumRoom2 = (() => {
  function build(scene) {
    window.MuseumEngine.createArchitecturalRoom(18, 15, 4.6);
    window.MuseumEngine.createBench(0, 4.2);

    const centerData =
      window.MuseumData && window.MuseumData.room2
        ? window.MuseumData.room2.center
        : null;

    // Bệ trung tâm trình bày phần 2.a) Những đặc điểm chung với các nền kinh tế thị trường
    const centerGroup = new THREE.Group();
    centerGroup.position.set(0, 0, -0.8);

    const centerPedestalGeo = new THREE.CylinderGeometry(1.35, 1.5, 0.55, 32);
    const centerPedestalMat = new THREE.MeshStandardMaterial({
      color: 0x27272a,
      roughness: 0.3,
      metalness: 0.4,
    });
    const centerPedestal = new THREE.Mesh(centerPedestalGeo, centerPedestalMat);
    centerPedestal.position.y = 0.275;
    centerGroup.add(centerPedestal);

    const ringGeo = new THREE.CylinderGeometry(1.05, 1.05, 0.14, 32);
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.85,
      roughness: 0.2,
      emissive: 0xd97706,
      emissiveIntensity: 0.35,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.position.y = 0.62;
    centerGroup.add(ring);

    if (centerData) {
      const centerArtTex = window.MuseumEngine.createArtworkTexture(
        centerData.title,
        centerData.subtitle,
        centerData.badge,
        centerData.color,
        centerData.lines,
      );
      const centerPlacardTex = window.MuseumEngine.createPlacardTexture(
        centerData.title,
        centerData.subtitle,
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
          badge: centerData.badge,
          title: centerData.title,
          subtitle: centerData.subtitle,
          desc: centerData.desc,
          fullHtml: centerData.fullHtml,
          camPos: centerData.camPos,
          lookPos: centerData.lookPos,
        },
      );
      centerFrame.position.set(0, 1.65, 0);
      centerGroup.add(centerFrame);

      centerPedestal.userData = centerFrame.userData;
      ring.userData = centerFrame.userData;
      window.MuseumEngine.interactableObjects.push(centerPedestal);
      window.MuseumEngine.interactableObjects.push(ring);
    }

    scene.add(centerGroup);

    // Hàng rào cọc chắn bát giác bảo vệ quanh bệ trưng bày trung tâm Phòng 2 (A4)
    if (window.MuseumEngine.createStanchionBarrier) {
      const centerRingSegments = [];
      const sides = 8;
      const barrierRadius = 1.6;
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

    const centerSpot = new THREE.SpotLight(
      0xfff3d6,
      1.45,
      9.5,
      Math.PI / 3,
      0.68,
      1.5,
    );
    centerSpot.position.set(0, 4.3, 1.8);
    centerSpot.target = centerGroup;
    scene.add(centerSpot);

    // 5 Cột trụ xung quanh trình bày phần 2.b) Năm đặc trưng cơ bản — gom bằng InstancedMesh để giảm Draw Calls (B3)
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

      const baseGeo = getGeo("room2_pillar_base_geo", () =>
        new THREE.BoxGeometry(1.7, 0.4, 1.7),
      );
      const shaftGeo = getGeo("room2_pillar_shaft_geo", () =>
        new THREE.CylinderGeometry(0.58, 0.64, 3.7, 24),
      );
      const capGeo = getGeo("room2_pillar_cap_geo", () =>
        new THREE.BoxGeometry(1.6, 0.3, 1.6),
      );

      const baseMat = getMat("room2_pillar_base_mat", () =>
        new THREE.MeshStandardMaterial({
          color: 0x3f3f46,
          roughness: 0.55,
          metalness: 0.15,
        }),
      );
      const shaftMat = getMat("room2_pillar_shaft_mat", () =>
        new THREE.MeshStandardMaterial({
          color: 0xe4e0d8,
          roughness: 0.65,
          metalness: 0.05,
        }),
      );

      const useInstanced =
        typeof THREE.InstancedMesh === "function" && pCount > 0;
      const basesInstanced = useInstanced
        ? new THREE.InstancedMesh(baseGeo, baseMat, pCount)
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
          dummy.position.set(x, 0.2, z);
          dummy.rotation.copy
            ? dummy.rotation.copy(pillarGroup.rotation)
            : dummy.rotation.set(
                pillarGroup.rotation.x,
                pillarGroup.rotation.y,
                pillarGroup.rotation.z,
              );
          dummy.scale.set(1, 1, 1);
          dummy.updateMatrix();
          basesInstanced.setMatrixAt(idx, dummy.matrix);

          dummy.position.set(x, 2.25, z);
          dummy.updateMatrix();
          shaftsInstanced.setMatrixAt(idx, dummy.matrix);

          dummy.position.set(x, 4.25, z);
          dummy.updateMatrix();
          capsInstanced.setMatrixAt(idx, dummy.matrix);
        } else {
          const base = new THREE.Mesh(baseGeo, baseMat);
          base.position.y = 0.2;
          base.castShadow = true;
          pillarGroup.add(base);

          const shaft = new THREE.Mesh(shaftGeo, shaftMat);
          shaft.position.y = 2.25;
          shaft.castShadow = true;
          pillarGroup.add(shaft);

          const cap = new THREE.Mesh(capGeo, baseMat);
          cap.position.y = 4.25;
          pillarGroup.add(cap);
        }

        const artTex = window.MuseumEngine.createArtworkTexture(
          p.title,
          p.subtitle,
          p.badge,
          p.color,
          p.lines,
        );
        const placardTex = window.MuseumEngine.createPlacardTexture(
          p.title,
          p.subtitle,
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
            badge: p.badge,
            title: p.title,
            subtitle: p.subtitle,
            desc: p.desc,
            fullHtml: p.fullHtml,
            camPos: p.camPos,
            lookPos: p.lookPos,
          },
        );
        frame.position.set(0, 2.2, 0.78);
        pillarGroup.add(frame);

        const spotTarget = new THREE.Object3D();
        spotTarget.position.set(0, 2.25, 0);
        pillarGroup.add(spotTarget);

        scene.add(pillarGroup);

        const spot = new THREE.SpotLight(
          0xfff3d6,
          1.38,
          8.5,
          Math.PI / 3.2,
          0.68,
          1.5,
        );
        spot.position.set(x * 0.55, 4.3, z * 0.55);
        spot.target = spotTarget;
        scene.add(spot);
      });

      if (useInstanced) {
        basesInstanced.castShadow = true;
        shaftsInstanced.castShadow = true;
        basesInstanced.instanceMatrix.needsUpdate = true;
        shaftsInstanced.instanceMatrix.needsUpdate = true;
        capsInstanced.instanceMatrix.needsUpdate = true;
        scene.add(basesInstanced);
        scene.add(shaftsInstanced);
        scene.add(capsInstanced);
      }
    }
  }

  return { build };
})();
