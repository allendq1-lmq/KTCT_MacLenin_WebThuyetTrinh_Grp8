// museum/room1.js - Phòng 1: Tổng quan về KTTT ĐHXHCN ở Việt Nam (8 hiện vật: 1.1a, 1.1b, 1.2a, 1.2b, 1.2c, 1.3, 1.4a, 1.4b)
window.MuseumRoom1 = (() => {
  function build(scene) {
    window.MuseumEngine.createArchitecturalRoom(18, 14, 4.4);
    window.MuseumEngine.createBench(-2.5, 1.2);
    window.MuseumEngine.createBench(2.5, 1.2);

    // Hàng cọc chắn dây nhung bảo vệ dọc khu vực trưng bày tranh (A4)
    if (window.MuseumEngine.createStanchionBarrier) {
      window.MuseumEngine.createStanchionBarrier(
        [
          { x1: -7.95, z1: -3.6, x2: -7.95, z2: 0 },
          { x1: -7.95, z1: 0, x2: -7.95, z2: 3.6 },
          { x1: -6.8, z1: -5.95, x2: -2.8, z2: -5.95 },
          { x1: -2.8, z1: -5.95, x2: 2.8, z2: -5.95 },
          { x1: 2.8, z1: -5.95, x2: 6.8, z2: -5.95 },
          { x1: 7.95, z1: -4.2, x2: 7.95, z2: 0.2 },
          { x1: 7.95, z1: 0.2, x2: 7.95, z2: 4.4 },
        ],
        scene,
      );
    }

    if (window.MuseumData && window.MuseumData.room1) {
      window.MuseumData.room1.exhibits.forEach((ex) => {
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
          2.6,
          1.65,
          artTex,
          placardTex,
          {
            id: ex.id,
            room: 1,
            sectionCode: ex.sectionCode,
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

        // Ánh sáng rọi tranh dịu mắt, góc tỏa mềm chống lóa trắng (A1)
        const spot = new THREE.SpotLight(
          0xfff3d6,
          1.35,
          9.5,
          Math.PI / 3.2,
          0.68,
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
