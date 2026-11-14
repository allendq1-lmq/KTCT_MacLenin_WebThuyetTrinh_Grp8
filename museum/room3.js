// museum/room3.js - Phòng 3: Giới hạn CNTB, Khả năng khắc phục, Bảng đối chiếu 6 tiêu chí, Hạn chế/Giải pháp & Phán quyết
window.MuseumRoom3 = (() => {
  function build(scene) {
    window.MuseumEngine.createArchitecturalRoom(20, 14, 4.5);
    window.MuseumEngine.createBench(-3.2, 0.2);
    window.MuseumEngine.createBench(3.2, 0.2);

    // Hệ thống cọc chắn và dây bảo vệ quanh bảng đối chiếu, tranh tường và bệ tổng kết Phòng 3 (A4)
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
      const verdictRadius = 1.4;
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
    const tableRows = window.MuseumData.room3.comparisonTableRows;

    exhibits.forEach((ex) => {
      const userData = {
        id: ex.id,
        room: 3,
        sectionCode: ex.sectionCode,
        badge: ex.badge,
        title: ex.title,
        subtitle: ex.subtitle,
        desc: ex.desc,
        fullHtml: ex.fullHtml,
        camPos: ex.camPos,
        lookPos: ex.lookPos,
      };

      if (ex.id === "r3-table") {
        // Bảng so sánh đối chiếu 6 tiêu chí kích thước lớn ở chính giữa tường sau
        const boardTex = window.MuseumEngine.createComparisonBoardTexture(
          "BẢNG SO SÁNH ĐỐI CHIẾU 6 TIÊU CHÍ: KTTT TBCN VS. KTTT ĐHXHCN VIỆT NAM",
          tableRows,
        );
        const placardTex = window.MuseumEngine.createPlacardTexture(
          ex.title,
          ex.subtitle,
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
          1.52,
          11.5,
          Math.PI / 2.8,
          0.7,
          1.5,
        );
        spotCenter.position.set(0, 4.3, -2.5);
        spotCenter.target = frame;
        scene.add(spotCenter);
      } else if (ex.id === "r3-verdict") {
        // Bệ tổng kết trung tâm: Phán quyết cuối cùng & Nguồn tài liệu tham khảo
        const verdictGroup = new THREE.Group();
        verdictGroup.position.set(ex.x, 0, ex.z);

        const pedGeo = new THREE.CylinderGeometry(1.15, 1.3, 0.45, 32);
        const pedMat = new THREE.MeshStandardMaterial({
          color: 0x1e293b,
          roughness: 0.35,
          metalness: 0.5,
        });
        const ped = new THREE.Mesh(pedGeo, pedMat);
        ped.position.y = 0.225;
        verdictGroup.add(ped);

        const artTex = window.MuseumEngine.createArtworkTexture(
          ex.title,
          ex.subtitle,
          ex.badge,
          ex.color,
          ex.lines,
        );
        const placardTex = window.MuseumEngine.createPlacardTexture(
          ex.title,
          ex.subtitle,
        );
        const frame = window.MuseumEngine.createGalleryFrame(
          2.5,
          1.55,
          artTex,
          placardTex,
          userData,
        );
        frame.position.set(0, 1.5, 0);
        verdictGroup.add(frame);

        ped.userData = userData;
        window.MuseumEngine.interactableObjects.push(ped);
        scene.add(verdictGroup);

        const spotVerdict = new THREE.SpotLight(
          0xfff3d6,
          1.38,
          9.5,
          Math.PI / 3.2,
          0.68,
          1.5,
        );
        spotVerdict.position.set(0, 4.2, ex.z + 2.8);
        spotVerdict.target = verdictGroup;
        scene.add(spotVerdict);
      } else {
        // Tranh Mảng tối (Tường trái: 3.1, 3.3a) & Mảng sáng (Tường phải: 3.2, 3.3b)
        const artTex = window.MuseumEngine.createArtworkTexture(
          ex.title,
          ex.subtitle,
          ex.badge,
          ex.color,
          ex.lines,
        );
        const placardTex = window.MuseumEngine.createPlacardTexture(
          ex.title,
          ex.subtitle,
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
          0xfff3d6,
          1.42,
          10.5,
          Math.PI / 3.1,
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
