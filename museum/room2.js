// museum/room2.js - Dựng Phòng 2
window.MuseumRoom2 = (() => {
  function build(scene) {
    window.MuseumEngine.createArchitecturalRoom(16, 14, 4.5);
    window.MuseumEngine.createBench(0, 3.5);

    const centerPedestalGeo = new THREE.CylinderGeometry(1.2, 1.3, 0.6, 32);
    const centerPedestalMat = new THREE.MeshStandardMaterial({
      color: 0x27272a,
      roughness: 0.3,
    });
    const centerPedestal = new THREE.Mesh(centerPedestalGeo, centerPedestalMat);
    centerPedestal.position.set(0, 0.3, -1.0);
    scene.add(centerPedestal);

    const emblemGeo = new THREE.CylinderGeometry(0.8, 0.8, 0.2, 32);
    const emblemMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.8,
      roughness: 0.2,
      emissive: 0xd97706,
      emissiveIntensity: 0.3,
    });
    const emblem = new THREE.Mesh(emblemGeo, emblemMat);
    emblem.position.set(0, 0.7, -1.0);
    emblem.userData = {
      title: "Trung Tâm Thể Chế KTTT Định Hướng XHCN",
      desc: "Nền tảng kiến trúc thể chế kinh tế Việt Nam gồm 5 trụ cột vững chắc, kết hợp hài hòa sức mạnh thị trường với vai trò định hướng của Nhà nước pháp quyền xã hội chủ nghĩa.",
      camPos: { x: 0, y: 1.8, z: 1.8 },
      lookPos: { x: 0, y: 0.7, z: -1.0 },
    };
    scene.add(emblem);
    window.MuseumEngine.interactableObjects.push(emblem);

    const radius = 5.2;
    if (window.MuseumData && window.MuseumData.room2) {
      window.MuseumData.room2.pillars.forEach((p) => {
        const rad = (p.angleDeg * Math.PI) / 180;
        const x = Math.cos(rad) * radius;
        const z = Math.sin(rad) * radius - 1.0;

        const pillarGroup = new THREE.Group();
        pillarGroup.position.set(x, 0, z);

        const baseGeo = new THREE.BoxGeometry(1.6, 0.4, 1.6);
        const baseMat = new THREE.MeshStandardMaterial({
          color: 0x3f3f46,
          roughness: 0.4,
        });
        const base = new THREE.Mesh(baseGeo, baseMat);
        base.position.y = 0.2;
        base.castShadow = true;
        pillarGroup.add(base);

        const shaftGeo = new THREE.CylinderGeometry(0.55, 0.6, 3.6, 24);
        const shaftMat = new THREE.MeshStandardMaterial({
          color: 0xf4f4f5,
          roughness: 0.3,
        });
        const shaft = new THREE.Mesh(shaftGeo, shaftMat);
        shaft.position.y = 2.2;
        shaft.castShadow = true;
        pillarGroup.add(shaft);

        const capGeo = new THREE.BoxGeometry(1.5, 0.3, 1.5);
        const cap = new THREE.Mesh(capGeo, baseMat);
        cap.position.y = 4.15;
        pillarGroup.add(cap);

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
          1.8,
          1.2,
          artTex,
          placardTex,
          {
            title: p.title,
            desc: p.desc,
            camPos: { x: x * 0.65, y: 1.8, z: z * 0.65 },
            lookPos: { x: x, y: 2.2, z: z },
          },
        );
        frame.position.set(0, 2.2, 0.75);
        pillarGroup.add(frame);

        pillarGroup.lookAt(0, 0, -1.0);
        scene.add(pillarGroup);

        const spot = new THREE.SpotLight(0xfffbeb, 2.4, 7, Math.PI / 4, 0.3);
        spot.position.set(x * 0.6, 4.2, z * 0.6);
        spot.target = shaft;
        scene.add(spot);
      });
    }
  }

  return { build };
})();
