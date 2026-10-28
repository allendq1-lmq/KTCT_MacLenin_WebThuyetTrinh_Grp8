// museum/avatar.js - Mô hình & chuyển động mượt mà của Sinh viên UIT
window.MuseumAvatar = (() => {
  let avatarGroup = null;
  let leftArmGroup, rightArmGroup, leftLegGroup, rightLegGroup;
  let walkCycle = 0;
  const moveSpeed = 0.09; // Tốc độ di chuyển tiêu chuẩn

  const roomBounds = {
    1: { minX: -6.8, maxX: 6.8, minZ: -4.8, maxZ: 4.8 },
    2: { minX: -6.8, maxX: 6.8, minZ: -5.8, maxZ: 5.8 },
    3: { minX: -7.8, maxX: 7.8, minZ: -4.8, maxZ: 4.8 },
  };

  function createUITShirtTexture() {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#005baa";
    ctx.fillRect(0, 0, 512, 512);

    // Cổ áo trắng
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.moveTo(180, 0);
    ctx.lineTo(256, 110);
    ctx.lineTo(332, 0);
    ctx.closePath();
    ctx.fill();

    // Dây đeo thẻ sinh viên UIT
    ctx.strokeStyle = "#0284c7";
    ctx.lineWidth = 14;
    ctx.beginPath();
    ctx.moveTo(210, 0);
    ctx.lineTo(256, 260);
    ctx.lineTo(302, 0);
    ctx.stroke();

    // Thẻ sinh viên
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(230, 250, 52, 70);
    ctx.strokeStyle = "#94a3b8";
    ctx.lineWidth = 2;
    ctx.strokeRect(230, 250, 52, 70);
    ctx.fillStyle = "#005baa";
    ctx.fillRect(234, 254, 44, 16);

    // Logo chữ UIT ngực áo
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 88px Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("UIT", 256, 380);

    return new THREE.CanvasTexture(canvas);
  }

  function create() {
    const avatar = new THREE.Group();

    const torsoGeo = new THREE.BoxGeometry(0.56, 0.72, 0.32);
    const shirtTex = createUITShirtTexture();
    const torsoMat = new THREE.MeshStandardMaterial({
      map: shirtTex,
      roughness: 0.5,
      metalness: 0.1,
    });
    const torso = new THREE.Mesh(torsoGeo, torsoMat);
    torso.position.y = 1.05;
    torso.castShadow = true;
    avatar.add(torso);

    const headGeo = new THREE.BoxGeometry(0.32, 0.34, 0.32);
    const skinMat = new THREE.MeshStandardMaterial({
      color: 0xfbd0b0,
      roughness: 0.7,
    });
    const head = new THREE.Mesh(headGeo, skinMat);
    head.position.y = 1.62;
    head.castShadow = true;
    avatar.add(head);

    const hairGeo = new THREE.BoxGeometry(0.35, 0.14, 0.35);
    const hairMat = new THREE.MeshStandardMaterial({
      color: 0x1e1b18,
      roughness: 0.9,
    });
    const hair = new THREE.Mesh(hairGeo, hairMat);
    hair.position.y = 1.76;
    avatar.add(hair);

    const limbMat = new THREE.MeshStandardMaterial({
      color: 0x005baa,
      roughness: 0.5,
    });
    const skinHandMat = new THREE.MeshStandardMaterial({
      color: 0xfbd0b0,
      roughness: 0.7,
    });
    const pantsMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.6,
    });
    const shoesMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.3,
    });

    // Tay trái
    leftArmGroup = new THREE.Group();
    leftArmGroup.position.set(-0.36, 1.35, 0);
    const armGeo = new THREE.BoxGeometry(0.14, 0.55, 0.14);
    const leftArm = new THREE.Mesh(armGeo, limbMat);
    leftArm.position.y = -0.25;
    leftArm.castShadow = true;
    leftArmGroup.add(leftArm);
    const handGeo = new THREE.BoxGeometry(0.12, 0.12, 0.12);
    const leftHand = new THREE.Mesh(handGeo, skinHandMat);
    leftHand.position.y = -0.56;
    leftArmGroup.add(leftHand);
    avatar.add(leftArmGroup);

    // Tay phải
    rightArmGroup = new THREE.Group();
    rightArmGroup.position.set(0.36, 1.35, 0);
    const rightArm = new THREE.Mesh(armGeo, limbMat);
    rightArm.position.y = -0.25;
    rightArm.castShadow = true;
    rightArmGroup.add(rightArm);
    const rightHand = new THREE.Mesh(handGeo, skinHandMat);
    rightHand.position.y = -0.56;
    rightArmGroup.add(rightHand);
    avatar.add(rightArmGroup);

    // Chân trái
    leftLegGroup = new THREE.Group();
    leftLegGroup.position.set(-0.16, 0.7, 0);
    const legGeo = new THREE.BoxGeometry(0.18, 0.65, 0.18);
    const leftLeg = new THREE.Mesh(legGeo, pantsMat);
    leftLeg.position.y = -0.32;
    leftLeg.castShadow = true;
    leftLegGroup.add(leftLeg);
    const shoeGeo = new THREE.BoxGeometry(0.19, 0.12, 0.28);
    const leftShoe = new THREE.Mesh(shoeGeo, shoesMat);
    leftShoe.position.set(0, -0.65, 0.04);
    leftShoe.castShadow = true;
    leftLegGroup.add(leftShoe);
    avatar.add(leftLegGroup);

    // Chân phải
    rightLegGroup = new THREE.Group();
    rightLegGroup.position.set(0.16, 0.7, 0);
    const rightLeg = new THREE.Mesh(legGeo, pantsMat);
    rightLeg.position.y = -0.32;
    rightLeg.castShadow = true;
    rightLegGroup.add(rightLeg);
    const rightShoe = new THREE.Mesh(shoeGeo, shoesMat);
    rightShoe.position.set(0, -0.65, 0.04);
    rightShoe.castShadow = true;
    rightLegGroup.add(rightShoe);
    avatar.add(rightLegGroup);

    avatar.position.set(0, 0, 1.5);
    avatarGroup = avatar;
    return avatar;
  }

  function updateWalking(camera, controls, keys, currentRoom) {
    if (!controls || !camera || !avatarGroup) return;

    // Khi người dùng bấm di chuyển, ngắt ngay tiến trình lia camera tự động để tránh giật
    if (keys.w || keys.a || keys.s || keys.d) {
      if (window.MuseumEngine && window.MuseumEngine.cancelTransition) {
        window.MuseumEngine.cancelTransition();
      }
    }

    const bounds = roomBounds[currentRoom] || {
      minX: -6.5,
      maxX: 6.5,
      minZ: -4.5,
      maxZ: 4.5,
    };

    // Hướng nhìn ngang mặt sàn của Camera
    const forward = new THREE.Vector3();
    camera.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();

    const right = new THREE.Vector3();
    right.crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize();

    let moved = false;
    const moveDelta = new THREE.Vector3();

    if (keys.w) {
      moveDelta.addScaledVector(forward, moveSpeed);
      moved = true;
    }
    if (keys.s) {
      moveDelta.addScaledVector(forward, -moveSpeed);
      moved = true;
    }
    if (keys.a) {
      moveDelta.addScaledVector(right, -moveSpeed);
      moved = true;
    }
    if (keys.d) {
      moveDelta.addScaledVector(right, moveSpeed);
      moved = true;
    }

    if (moved) {
      const nextX = THREE.MathUtils.clamp(
        avatarGroup.position.x + moveDelta.x,
        bounds.minX,
        bounds.maxX,
      );
      const nextZ = THREE.MathUtils.clamp(
        avatarGroup.position.z + moveDelta.z,
        bounds.minZ,
        bounds.maxZ,
      );

      const actualDeltaX = nextX - avatarGroup.position.x;
      const actualDeltaZ = nextZ - avatarGroup.position.z;

      avatarGroup.position.x = nextX;
      avatarGroup.position.z = nextZ;

      // Xoay nhân vật mượt mà theo góc di chuyển
      const targetAngle = Math.atan2(moveDelta.x, moveDelta.z);
      let diff = targetAngle - avatarGroup.rotation.y;
      while (diff < -Math.PI) diff += Math.PI * 2;
      while (diff > Math.PI) diff -= Math.PI * 2;
      avatarGroup.rotation.y += diff * 0.25;

      // Vung tay chân theo nhịp bước
      walkCycle += 0.22;
      const legAngle = Math.sin(walkCycle) * 0.45;
      const armAngle = -Math.sin(walkCycle) * 0.4;

      if (leftLegGroup) leftLegGroup.rotation.x = legAngle;
      if (rightLegGroup) rightLegGroup.rotation.x = -legAngle;
      if (leftArmGroup) leftArmGroup.rotation.x = armAngle;
      if (rightArmGroup) rightArmGroup.rotation.x = -armAngle;

      // Camera bám theo bước đi của nhân vật
      camera.position.x += actualDeltaX;
      camera.position.z += actualDeltaZ;
      controls.target.x += actualDeltaX;
      controls.target.z += actualDeltaZ;
    } else {
      // Dừng lại thì đứng thẳng
      if (leftLegGroup) leftLegGroup.rotation.x = 0;
      if (rightLegGroup) rightLegGroup.rotation.x = 0;
      if (leftArmGroup) leftArmGroup.rotation.x = 0;
      if (rightArmGroup) rightArmGroup.rotation.x = 0;
    }
  }

  function getAvatar() {
    return avatarGroup;
  }

  return { create, updateWalking, getAvatar };
})();
