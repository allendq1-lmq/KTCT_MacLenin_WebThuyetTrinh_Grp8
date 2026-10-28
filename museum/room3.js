// museum/room3.js - Dựng Phòng 3
window.MuseumRoom3 = (() => {
  function build(scene) {
    window.MuseumEngine.createArchitecturalRoom(18, 12, 4.2);
    window.MuseumEngine.createBench(0, 0.5);

    if (window.MuseumData && window.MuseumData.room3) {
      const darkTableTex = window.MuseumEngine.createTableTexture(
        "Mảng Tối: 5 Hạn Chế Thể Chế Kinh Tế Hiện Nay",
        ["STT", "Bất Cập Thể Chế", "Biểu Hiện Thực Tiễn"],
        window.MuseumData.room3.darkRows,
      );

      const darkBoardGeo = new THREE.PlaneGeometry(5.2, 3.4);
      const darkBoardMat = new THREE.MeshStandardMaterial({
        map: darkTableTex,
        roughness: 0.3,
      });
      const darkBoard = new THREE.Mesh(darkBoardGeo, darkBoardMat);
      darkBoard.position.set(-8.85, 2.1, 0);
      darkBoard.rotation.y = Math.PI / 2;
      darkBoard.userData = {
        title: "Mảng Tối: 5 Hạn Chế Thể Chế Cần Giải Quyết",
        desc: "Năm điểm nghẽn thể chế cốt lõi đang kìm hãm nguồn lực phát triển: pháp luật chồng chéo, rào cản tự do kinh doanh, thị trường sơ khai, phân hóa giàu nghèo và năng lực điều hành nhà nước chưa đồng bộ.",
        camPos: { x: -5.8, y: 1.8, z: 0 },
        lookPos: { x: -8.85, y: 2.1, z: 0 },
      };
      scene.add(darkBoard);
      window.MuseumEngine.interactableObjects.push(darkBoard);

      const spotDark = new THREE.SpotLight(0xfffbeb, 2.6, 9, Math.PI / 4, 0.3);
      spotDark.position.set(-6.2, 4.0, 0);
      spotDark.target = darkBoard;
      scene.add(spotDark);

      window.MuseumData.room3.solutions.forEach((s) => {
        const artTex = window.MuseumEngine.createArtworkTexture(
          s.title,
          s.subtitle,
          s.badge,
          s.color,
          s.lines,
        );
        const placardTex = window.MuseumEngine.createPlacardTexture(
          s.title,
          s.subtitle,
        );
        const frame = window.MuseumEngine.createGalleryFrame(
          2.2,
          1.4,
          artTex,
          placardTex,
          {
            title: s.title,
            desc: s.desc,
            camPos: { x: 5.8, y: 1.8, z: s.z },
            lookPos: { x: 8.85, y: 2.1, z: s.z },
          },
        );
        frame.position.set(8.85, 2.1, s.z);
        frame.rotation.y = -Math.PI / 2;
        scene.add(frame);

        const spot = new THREE.SpotLight(0xfffbeb, 2.2, 8, Math.PI / 4, 0.3);
        spot.position.set(6.4, 3.9, s.z);
        spot.target = frame;
        scene.add(spot);
      });
    }
  }

  return { build };
})();
