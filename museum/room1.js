// museum/room1.js - Dựng Phòng 1
window.MuseumRoom1 = (() => {
  function build(scene) {
    window.MuseumEngine.createArchitecturalRoom(16, 12, 4.2);
    window.MuseumEngine.createBench(0, 0.5);

    if (window.MuseumData && window.MuseumData.room1) {
      window.MuseumData.room1.timeline.forEach((ex) => {
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
          2.2,
          1.4,
          artTex,
          placardTex,
          {
            title: ex.title,
            desc: ex.desc,
            camPos: { x: ex.x, y: 1.8, z: -3.8 },
            lookPos: { x: ex.x, y: 2.1, z: -5.85 },
          },
        );
        frame.position.set(ex.x, ex.y, ex.z);
        frame.rotation.y = ex.rotY;
        scene.add(frame);

        const spot = new THREE.SpotLight(0xfffbeb, 2.2, 8, Math.PI / 4, 0.3);
        spot.position.set(ex.x, 3.9, ex.z + 2.2);
        spot.target = frame;
        scene.add(spot);
      });

      window.MuseumData.room1.reasons.forEach((r) => {
        const artTex = window.MuseumEngine.createArtworkTexture(
          r.title,
          r.subtitle,
          r.badge,
          r.color,
          r.lines,
        );
        const placardTex = window.MuseumEngine.createPlacardTexture(
          r.title,
          r.subtitle,
        );
        const frame = window.MuseumEngine.createGalleryFrame(
          2.2,
          1.4,
          artTex,
          placardTex,
          {
            title: r.title,
            desc: r.desc,
            camPos: { x: -5.5, y: 1.8, z: r.z },
            lookPos: { x: -7.85, y: 2.1, z: r.z },
          },
        );
        frame.position.set(-7.85, 2.1, r.z);
        frame.rotation.y = Math.PI / 2;
        scene.add(frame);

        const spot = new THREE.SpotLight(0xfffbeb, 2.0, 8, Math.PI / 4, 0.3);
        spot.position.set(-5.5, 3.9, r.z);
        spot.target = frame;
        scene.add(spot);
      });
    }
  }

  return { build };
})();
