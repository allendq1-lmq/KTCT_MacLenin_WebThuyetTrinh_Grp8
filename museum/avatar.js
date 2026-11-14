// museum/avatar.js - Mô hình Sinh viên UIT & Điều khiển di chuyển khóa hướng nhìn Shift-Lock chuẩn Roblox
window.MuseumAvatar = (() => {
  let avatarGroup = null;
  let leftArmGroup, rightArmGroup, leftLegGroup, rightLegGroup;
  let walkCycle = 0;
  const moveSpeed = 0.095; // Tốc độ di chuyển tiêu chuẩn ở 60FPS (~5.7 đơn vị/giây)
  const moveSpeedPerSecond = 5.7;
  const MAX_DELTA_TIME = 0.05; // Kẹp deltaTime tối đa <= 0.05s chống nhảy bước/xuyên tường khi rớt FPS hoặc chuyển tab (C1)
  const DEFAULT_DELTA_TIME = 1 / 60;

  function clampDeltaTime(deltaTime) {
    if (typeof deltaTime !== "number" || !Number.isFinite(deltaTime)) {
      return DEFAULT_DELTA_TIME;
    }
    if (deltaTime <= 0) {
      return 0;
    }
    return Math.min(deltaTime, MAX_DELTA_TIME);
  }

  // Giới hạn di chuyển của nhân vật bên trong 4 bức tường từng phòng
  const roomBounds = {
    1: { minX: -8.0, maxX: 8.0, minZ: -6.0, maxZ: 6.0 },
    2: { minX: -8.0, maxX: 8.0, minZ: -6.5, maxZ: 6.5 },
    3: { minX: -9.0, maxX: 9.0, minZ: -6.0, maxZ: 6.0 },
  };

  let cachedFrontShirtTex = null;
  let cachedBackShirtTex = null;

  function configureShirtTexture(tex) {
    tex.generateMipmaps = true;
    tex.minFilter = THREE.LinearMipmapLinearFilter || THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.userData = tex.userData || {};
    tex.userData.isShared = true;
    return tex;
  }

  function createUITFrontShirtTexture() {
    if (cachedFrontShirtTex) return cachedFrontShirtTex;
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#005baa";
    ctx.fillRect(0, 0, 512, 512);

    // Cổ áo trắng phía trước ngực
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.moveTo(180, 0);
    ctx.lineTo(256, 110);
    ctx.lineTo(332, 0);
    ctx.closePath();
    ctx.fill();

    // Dây đeo thẻ sinh viên UIT
    ctx.strokeStyle = "#38bdf8";
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
    ctx.font = "bold 82px Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("UIT", 256, 390);

    cachedFrontShirtTex = configureShirtTexture(new THREE.CanvasTexture(canvas));
    canvas.width = 0;
    canvas.height = 0;
    return cachedFrontShirtTex;
  }

  function createUITBackShirtTexture() {
    if (cachedBackShirtTex) return cachedBackShirtTex;
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#005baa";
    ctx.fillRect(0, 0, 512, 512);

    // Cổ áo polo trắng phía sau gáy
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(150, 0, 212, 34);

    // Viền vai thể thao
    ctx.fillStyle = "#0284c7";
    ctx.fillRect(0, 48, 512, 14);

    // Dòng chữ sau lưng áo sinh viên UIT (hiển thị rõ trước camera Shift-Lock)
    ctx.fillStyle = "#ffffff";
    ctx.font = "900 108px Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("UIT", 256, 195);

    ctx.fillStyle = "#bae6fd";
    ctx.font = "bold 36px Arial, sans-serif";
    ctx.fillText("SINH VIÊN ĐHQG-HCM", 256, 285);

    ctx.fillStyle = "#fbbf24";
    ctx.fillRect(156, 325, 200, 8);

    cachedBackShirtTex = configureShirtTexture(new THREE.CanvasTexture(canvas));
    canvas.width = 0;
    canvas.height = 0;
    return cachedBackShirtTex;
  }

  function create() {
    const avatar = new THREE.Group();

    const torsoGeo = new THREE.BoxGeometry(0.56, 0.72, 0.32);
    const frontShirtTex = createUITFrontShirtTexture();
    const backShirtTex = createUITBackShirtTexture();
    const sideShirtMat = new THREE.MeshStandardMaterial({
      color: 0x005baa,
      roughness: 0.5,
      metalness: 0.1,
    });
    const frontShirtMat = new THREE.MeshStandardMaterial({
      map: frontShirtTex,
      roughness: 0.5,
      metalness: 0.1,
    });
    const backShirtMat = new THREE.MeshStandardMaterial({
      map: backShirtTex,
      roughness: 0.5,
      metalness: 0.1,
    });

    // Trong hệ tọa độ local của nhân vật:
    // -Z là mặt trước (hướng nhìn của nhân vật), +Z là sau lưng (quay về phía camera Shift-Lock)
    const torsoMaterials = [
      sideShirtMat, // +X (Vai phải)
      sideShirtMat, // -X (Vai trái)
      sideShirtMat, // +Y (Trên)
      sideShirtMat, // -Y (Dưới)
      backShirtMat, // +Z (Lưng áo - quay về phía camera)
      frontShirtMat, // -Z (Ngực áo có thẻ SV - hướng về phía trước)
    ];

    const torso = new THREE.Mesh(torsoGeo, torsoMaterials);
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

    const hairMat = new THREE.MeshStandardMaterial({
      color: 0x1e1b18,
      roughness: 0.9,
    });

    // Tóc đỉnh đầu
    const topHairGeo = new THREE.BoxGeometry(0.35, 0.13, 0.35);
    const topHair = new THREE.Mesh(topHairGeo, hairMat);
    topHair.position.set(0, 1.76, 0);
    avatar.add(topHair);

    // Tóc sau gáy (+Z) để nhìn từ phía sau thấy rõ nhân vật đang quay lưng lại
    const backHairGeo = new THREE.BoxGeometry(0.34, 0.24, 0.08);
    const backHair = new THREE.Mesh(backHairGeo, hairMat);
    backHair.position.set(0, 1.63, 0.14);
    avatar.add(backHair);

    // Tóc mai hai bên
    const sideHairGeo = new THREE.BoxGeometry(0.35, 0.14, 0.22);
    const sideHair = new THREE.Mesh(sideHairGeo, hairMat);
    sideHair.position.set(0, 1.68, 0.04);
    avatar.add(sideHair);

    // Mắt ở mặt trước (-Z)
    const eyeMat = new THREE.MeshStandardMaterial({ color: 0x0f172a });
    const eyeGeo = new THREE.BoxGeometry(0.045, 0.045, 0.02);
    const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
    leftEye.position.set(-0.07, 1.63, -0.162);
    const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
    rightEye.position.set(0.07, 1.63, -0.162);
    avatar.add(leftEye);
    avatar.add(rightEye);

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

    // Tay trái (-X)
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

    // Tay phải (+X)
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

    // Chân trái (-X) - Mũi giày hướng về phía trước (-Z)
    leftLegGroup = new THREE.Group();
    leftLegGroup.position.set(-0.16, 0.7, 0);
    const legGeo = new THREE.BoxGeometry(0.18, 0.65, 0.18);
    const leftLeg = new THREE.Mesh(legGeo, pantsMat);
    leftLeg.position.y = -0.32;
    leftLeg.castShadow = true;
    leftLegGroup.add(leftLeg);
    const shoeGeo = new THREE.BoxGeometry(0.19, 0.12, 0.28);
    const leftShoe = new THREE.Mesh(shoeGeo, shoesMat);
    leftShoe.position.set(0, -0.65, -0.045);
    leftShoe.castShadow = true;
    leftLegGroup.add(leftShoe);
    avatar.add(leftLegGroup);

    // Chân phải (+X) - Mũi giày hướng về phía trước (-Z)
    rightLegGroup = new THREE.Group();
    rightLegGroup.position.set(0.16, 0.7, 0);
    const rightLeg = new THREE.Mesh(legGeo, pantsMat);
    rightLeg.position.y = -0.32;
    rightLeg.castShadow = true;
    rightLegGroup.add(rightLeg);
    const rightShoe = new THREE.Mesh(shoeGeo, shoesMat);
    rightShoe.position.set(0, -0.65, -0.045);
    rightShoe.castShadow = true;
    rightLegGroup.add(rightShoe);
    avatar.add(rightLegGroup);

    avatar.position.set(0, 0, 2.2);
    avatarGroup = avatar;
    return avatar;
  }

  function updateWalking(yaw, keys, currentRoom, deltaTime) {
    if (!avatarGroup) return;

    const dt = clampDeltaTime(deltaTime);
    const stepDistance = moveSpeedPerSecond * dt;
    const bounds = roomBounds[currentRoom] || roomBounds[1];

    // Nhân vật sinh viên UIT LUÔN xoay lưng về phía camera và hướng mặt theo đúng góc nhìn ngang (yaw) của camera
    avatarGroup.rotation.y = -yaw;

    // Vector hướng trước mặt nhân vật (forward) và hướng ngang bên phải (right) theo góc yaw
    const forwardX = Math.sin(yaw);
    const forwardZ = -Math.cos(yaw);
    const rightX = Math.cos(yaw);
    const rightZ = Math.sin(yaw);

    let moveX = 0;
    let moveZ = 0;
    let isMoving = false;

    // W: đi thẳng về phía trước mặt camera
    if (keys && keys.w) {
      moveX += forwardX;
      moveZ += forwardZ;
      isMoving = true;
    }
    // S: đi lùi (vẫn giữ hướng mặt về phía trước)
    if (keys && keys.s) {
      moveX -= forwardX;
      moveZ -= forwardZ;
      isMoving = true;
    }
    // A: đi ngang sang trái (strafe left)
    if (keys && keys.a) {
      moveX -= rightX;
      moveZ -= rightZ;
      isMoving = true;
    }
    // D: đi ngang sang phải (strafe right)
    if (keys && keys.d) {
      moveX += rightX;
      moveZ += rightZ;
      isMoving = true;
    }

    if (isMoving && stepDistance > 0) {
      const len = Math.hypot(moveX, moveZ);
      if (len > 0.0001) {
        moveX = (moveX / len) * stepDistance;
        moveZ = (moveZ / len) * stepDistance;
      }

      let nextX = THREE.MathUtils.clamp(
        avatarGroup.position.x + moveX,
        bounds.minX,
        bounds.maxX,
      );
      let nextZ = THREE.MathUtils.clamp(
        avatarGroup.position.z + moveZ,
        bounds.minZ,
        bounds.maxZ,
      );

      // Tránh đi xuyên bệ trưng bày trung tâm ở Phòng 2 và Phòng 3
      if (currentRoom === 2) {
        const dx = nextX - 0;
        const dz = nextZ - -0.8;
        const dist = Math.hypot(dx, dz);
        if (dist < 1.65 && dist > 0.001) {
          nextX = (dx / dist) * 1.65;
          nextZ = -0.8 + (dz / dist) * 1.65;
        }
      } else if (currentRoom === 3) {
        const dx = nextX - 0;
        const dz = nextZ - 1.6;
        const dist = Math.hypot(dx, dz);
        if (dist < 1.45 && dist > 0.001) {
          nextX = (dx / dist) * 1.45;
          nextZ = 1.6 + (dz / dist) * 1.45;
        }
      }

      avatarGroup.position.x = THREE.MathUtils.clamp(
        nextX,
        bounds.minX,
        bounds.maxX,
      );
      avatarGroup.position.z = THREE.MathUtils.clamp(
        nextZ,
        bounds.minZ,
        bounds.maxZ,
      );

      // Hoạt ảnh vung tay chân theo nhịp bước (nếu chỉ đi lùi thì đảo nhịp bước tự nhiên)
      const stepDir = keys.s && !keys.w ? -1 : 1;
      walkCycle += 13.2 * dt * stepDir;
      const legAngle = Math.sin(walkCycle) * 0.45;
      const armAngle = -Math.sin(walkCycle) * 0.4;

      if (leftLegGroup) leftLegGroup.rotation.x = legAngle;
      if (rightLegGroup) rightLegGroup.rotation.x = -legAngle;
      if (leftArmGroup) leftArmGroup.rotation.x = armAngle;
      if (rightArmGroup) rightArmGroup.rotation.x = -armAngle;
    } else {
      // Đứng yên: đưa tay chân về tư thế đứng thẳng
      if (leftLegGroup) leftLegGroup.rotation.x *= 0.7;
      if (rightLegGroup) rightLegGroup.rotation.x *= 0.7;
      if (leftArmGroup) leftArmGroup.rotation.x *= 0.7;
      if (rightArmGroup) rightArmGroup.rotation.x *= 0.7;
    }
  }

  function getAvatar() {
    return avatarGroup;
  }

  function getRoomBounds(roomNumber) {
    return roomBounds[roomNumber] || roomBounds[1];
  }

  return {
    create,
    updateWalking,
    getAvatar,
    getRoomBounds,
    clampDeltaTime,
    MAX_DELTA_TIME,
  };
})();
