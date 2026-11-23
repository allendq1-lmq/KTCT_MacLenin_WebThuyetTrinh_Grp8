// museum/visuals.js - Kết hợp Cách 1 (Infographic & Biểu đồ Canvas độ phân giải cao) + Cách 2 (Nạp ảnh tư liệu CORS-friendly có ưu tiên ảnh local & dự phòng tự động)
window.MuseumVisuals = (() => {
  const imageCache = new Map();
  const remoteUrlCache = new Map();
  const MAX_CONCURRENT_LOADS = 2;
  const REMOTE_STAGGER_MS = 120;
  let activeLoads = 0;
  const loadQueue = [];
  let localManifestPromise = null;

  function getLocalManifest() {
    if (localManifestPromise) return localManifestPromise;
    localManifestPromise = (async () => {
      const files = new Set();
      if (
        typeof fetch !== "function" ||
        typeof window === "undefined" ||
        !window.location ||
        window.location.protocol === "file:"
      ) {
        return files;
      }
      try {
        const res = await fetch("images/manifest.json", { cache: "no-cache" });
        if (res && res.ok) {
          const json = await res.json();
          const list = Array.isArray(json && json.files) ? json.files : [];
          list.forEach((item) => {
            const norm = String(item || "").trim();
            if (!norm) return;
            files.add(norm);
            files.add(norm.replace(/^images\//i, ""));
          });
        }
      } catch (_) {}
      return files;
    })();
    return localManifestPromise;
  }

  function manifestContains(manifestSet, localPath) {
    if (!manifestSet || manifestSet.size === 0 || !localPath) return false;
    const raw = String(localPath).trim();
    const base = raw.replace(/^images\//i, "");
    return manifestSet.has(raw) || manifestSet.has(base);
  }

  // ================= CÁC HÀM VẼ CANVAS DÙNG CHUNG =================
  function roundedRectPath(ctx, x, y, w, h, r) {
    const radius = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + w - radius, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
    ctx.lineTo(x + w, y + h - radius);
    ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
    ctx.lineTo(x + radius, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }

  function fillCard(
    ctx,
    x,
    y,
    w,
    h,
    r = 10,
    fill = "rgba(15, 23, 42, 0.85)",
    stroke = "rgba(148, 163, 184, 0.35)",
    lineWidth = 1.5,
  ) {
    ctx.save();
    roundedRectPath(ctx, x, y, w, h, r);
    ctx.fillStyle = fill;
    ctx.fill();
    if (stroke && lineWidth > 0) {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = lineWidth;
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawCenterLines(
    ctx,
    text,
    cx,
    cy,
    maxW,
    lineH,
    font = "bold 13px 'Segoe UI', Tahoma, sans-serif",
    color = "#f8fafc",
    maxLines = 3,
  ) {
    ctx.save();
    ctx.font = font;
    ctx.fillStyle = color;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const words = String(text || "").split(" ");
    const lines = [];
    let current = "";
    for (let i = 0; i < words.length; i++) {
      const test = current ? `${current} ${words[i]}` : words[i];
      if (ctx.measureText(test).width > maxW && current) {
        lines.push(current);
        current = words[i];
        if (lines.length >= maxLines - 1) {
          const rest = [current, ...words.slice(i + 1)].join(" ");
          let truncated = rest;
          while (
            truncated.length > 3 &&
            ctx.measureText(truncated + "…").width > maxW
          ) {
            truncated = truncated.slice(0, -1).trim();
          }
          lines.push(
            truncated !== rest ? `${truncated}…` : truncated,
          );
          current = "";
          break;
        }
      } else {
        current = test;
      }
    }
    if (current) lines.push(current);

    const totalH = (lines.length - 1) * lineH;
    const startY = cy - totalH / 2;
    lines.forEach((ln, idx) => {
      ctx.fillText(ln, cx, startY + idx * lineH);
    });
    ctx.restore();
  }

  function drawArrowLine(ctx, x1, y1, x2, y2, color = "#f59e0b", width = 2) {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    const angle = Math.atan2(y2 - y1, x2 - x1);
    const headLen = 7;
    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(
      x2 - headLen * Math.cos(angle - Math.PI / 6),
      y2 - headLen * Math.sin(angle - Math.PI / 6),
    );
    ctx.lineTo(
      x2 - headLen * Math.cos(angle + Math.PI / 6),
      y2 - headLen * Math.sin(angle + Math.PI / 6),
    );
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  function drawBlueprintGrid(ctx, x, y, w, h, accent = "#f59e0b") {
    ctx.save();
    roundedRectPath(ctx, x, y, w, h, 12);
    ctx.clip();

    const grad = ctx.createLinearGradient(x, y, x, y + h);
    grad.addColorStop(0, "#0b1325");
    grad.addColorStop(1, "#070c17");
    ctx.fillStyle = grad;
    ctx.fillRect(x, y, w, h);

    ctx.strokeStyle = "rgba(148, 163, 184, 0.08)";
    ctx.lineWidth = 1;
    for (let gx = x; gx <= x + w; gx += 24) {
      ctx.beginPath();
      ctx.moveTo(gx, y);
      ctx.lineTo(gx, y + h);
      ctx.stroke();
    }
    for (let gy = y; gy <= y + h; gy += 24) {
      ctx.beginPath();
      ctx.moveTo(x, gy);
      ctx.lineTo(x + w, gy);
      ctx.stroke();
    }

    const glow = ctx.createRadialGradient(
      x + w * 0.5,
      y + h * 0.45,
      10,
      x + w * 0.5,
      y + h * 0.45,
      w * 0.65,
    );
    glow.addColorStop(0, "rgba(245, 158, 11, 0.09)");
    glow.addColorStop(1, "rgba(15, 23, 42, 0)");
    ctx.fillStyle = glow;
    ctx.fillRect(x, y, w, h);

    ctx.restore();

    ctx.save();
    roundedRectPath(ctx, x, y, w, h, 12);
    ctx.strokeStyle = accent ? `${accent}66` : "rgba(245, 158, 11, 0.35)";
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.restore();
  }

  function drawFourQuadrantCards(ctx, items, centerLabel, accent, W, H) {
    const cx = W / 2;
    const cy = H / 2 - 6;
    const cardW = (W - 34) / 2;
    const cardH = 98;
    const topY = 18;
    const botY = H - cardH - 36;
    const coords = [
      { x: 10, y: topY },
      { x: W - cardW - 10, y: topY },
      { x: 10, y: botY },
      { x: W - cardW - 10, y: botY },
    ];

    coords.forEach((pos, idx) => {
      const it = items[idx] || { title: "", sub: "", color: accent };
      const c = it.color || accent;
      ctx.strokeStyle = `${c}99`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(pos.x + cardW / 2, pos.y + cardH / 2);
      ctx.lineTo(cx, cy);
      ctx.stroke();

      fillCard(ctx, pos.x, pos.y, cardW, cardH, 10, "#111c33", c, 1.8);
      fillCard(ctx, pos.x + 8, pos.y + 8, 24, 22, 6, c, null, 0);
      drawCenterLines(
        ctx,
        String(idx + 1),
        pos.x + 20,
        pos.y + 19,
        20,
        14,
        "bold 13px 'Segoe UI', sans-serif",
        "#0f172a",
        1,
      );
      drawCenterLines(
        ctx,
        it.title,
        pos.x + cardW / 2 + 12,
        pos.y + 23,
        cardW - 46,
        15,
        "bold 13px 'Segoe UI', sans-serif",
        "#f8fafc",
        2,
      );
      drawCenterLines(
        ctx,
        it.sub,
        pos.x + cardW / 2,
        pos.y + 67,
        cardW - 18,
        15,
        "12px 'Segoe UI', sans-serif",
        "#cbd5e1",
        3,
      );
    });

    fillCard(ctx, cx - 54, cy - 26, 108, 52, 26, "#0f172a", accent, 2.5);
    drawCenterLines(
      ctx,
      centerLabel,
      cx,
      cy,
      94,
      15,
      "bold 12px 'Segoe UI', sans-serif",
      "#fde68a",
      2,
    );
  }

  function drawMilestoneFlow(ctx, steps, W, H, footerNote) {
    const count = steps.length;
    const padX = 12;
    const cardW = W - padX * 2;
    const gap = 14;
    const startY = 16;
    const availH = H - (footerNote ? 54 : 28) - startY;
    const cardH = Math.min(82, (availH - gap * (count - 1)) / count);

    steps.forEach((st, idx) => {
      const y = startY + idx * (cardH + gap);
      const c = st.color || "#f59e0b";
      fillCard(ctx, padX, y, cardW, cardH, 10, "#101b30", `${c}aa`, 1.8);
      fillCard(ctx, padX + 10, y + 11, 86, cardH - 22, 8, c, null, 0);
      drawCenterLines(
        ctx,
        st.year,
        padX + 53,
        y + cardH / 2,
        80,
        15,
        "bold 12px 'Segoe UI', sans-serif",
        "#0f172a",
        2,
      );

      ctx.save();
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#f8fafc";
      ctx.font = "bold 13.5px 'Segoe UI', sans-serif";
      ctx.fillText(st.title, padX + 110, y + cardH * 0.34);
      ctx.fillStyle = "#cbd5e1";
      ctx.font = "12px 'Segoe UI', sans-serif";
      ctx.fillText(st.sub, padX + 110, y + cardH * 0.68);
      ctx.restore();

      if (idx < count - 1) {
        drawArrowLine(
          ctx,
          W / 2,
          y + cardH + 1,
          W / 2,
          y + cardH + gap - 1,
          "#94a3b8",
          2,
        );
      }
    });

    if (footerNote) {
      fillCard(ctx, padX, H - 36, cardW, 28, 7, "#1e293b", "#475569", 1);
      drawCenterLines(
        ctx,
        footerNote,
        W / 2,
        H - 22,
        cardW - 16,
        14,
        "bold 12px 'Segoe UI', sans-serif",
        "#fde68a",
        1,
      );
    }
  }

  // ================= HỆ THỐNG RENDER 20 INFOGRAPHIC CHUYÊN BIỆT =================
  const INFOGRAPHIC_RENDERERS = {
    "r1-1a": (ctx, W, H, accent) => {
      drawFourQuadrantCards(
        ctx,
        [
          {
            title: "Quy luật Giá trị",
            sub: "Sản xuất & trao đổi theo hao phí LĐXH cần thiết",
            color: "#38bdf8",
          },
          {
            title: "Cung – Cầu",
            sub: "Điều tiết giá cả & quy mô sản xuất thị trường",
            color: "#fbbf24",
          },
          {
            title: "Lưu thông Tiền tệ",
            sub: "Bảo đảm cân đối lượng tiền & chống lạm phát",
            color: "#34d399",
          },
          {
            title: "Cạnh tranh",
            sub: "Động lực đổi mới công nghệ & tăng năng suất",
            color: "#a78bfa",
          },
        ],
        "4 QUY LUẬT\nKTTT",
        accent,
        W,
        H,
      );
      fillCard(ctx, 16, H - 32, W - 32, 24, 6, "#1e293b", "#38bdf866", 1);
      drawCenterLines(
        ctx,
        "Thành tựu văn minh nhân loại • Mô hình đa dạng (Mỹ, Đức, Nhật, TQ)",
        W / 2,
        H - 20,
        W - 44,
        13,
        "bold 11.5px 'Segoe UI', sans-serif",
        "#7dd3fc",
        1,
      );
    },

    "r1-1b": (ctx, W, H) => {
      // Mái đền Lý luận KTTT ĐHXHCN Việt Nam
      fillCard(ctx, 20, 14, W - 40, 42, 10, "#7c2d12", "#f59e0b", 2);
      drawCenterLines(
        ctx,
        "ĐẢNG CỘNG SẢN VIỆT NAM LÃNH ĐẠO",
        W / 2,
        35,
        W - 60,
        15,
        "bold 13px 'Segoe UI', sans-serif",
        "#fef3c7",
        1,
      );

      fillCard(ctx, 28, 66, W - 56, 38, 8, "#0c4a6e", "#38bdf8", 1.8);
      drawCenterLines(
        ctx,
        "NHÀ NƯỚC PHÁP QUYỀN XHCN QUẢN LÝ",
        W / 2,
        85,
        W - 72,
        15,
        "bold 12.5px 'Segoe UI', sans-serif",
        "#e0f2fe",
        1,
      );

      const pillars = ["DÂN\nGIÀU", "NƯỚC\nMẠNH", "DÂN\nCHỦ", "CÔNG\nBẰNG", "VĂN\nMINH"];
      const pGap = 8;
      const pW = (W - 56 - pGap * 4) / 5;
      pillars.forEach((txt, idx) => {
        const px = 28 + idx * (pW + pGap);
        fillCard(ctx, px, 116, pW, 132, 8, "#1e293b", "#f59e0b99", 1.6);
        fillCard(ctx, px + 6, 122, pW - 12, 10, 4, "#f59e0b", null, 0);
        drawCenterLines(
          ctx,
          txt,
          px + pW / 2,
          184,
          pW - 8,
          18,
          "bold 13px 'Segoe UI', sans-serif",
          "#fde68a",
          2,
        );
      });

      fillCard(ctx, 16, 260, W - 32, 46, 10, "#064e3b", "#10b981", 2);
      drawCenterLines(
        ctx,
        "QUY LUẬT KTTT HIỆN ĐẠI • HỘI NHẬP QUỐC TẾ\n(Văn kiện Đại hội XIII & Điều 51 Hiến pháp 2013)",
        W / 2,
        283,
        W - 44,
        16,
        "bold 11.5px 'Segoe UI', sans-serif",
        "#d1fae5",
        2,
      );

      fillCard(ctx, 16, H - 36, W - 32, 26, 7, "#0f172a", "#f59e0b66", 1);
      drawCenterLines(
        ctx,
        "Kinh tế nhà nước giữ vai trò chủ đạo • Kinh tế nhiều thành phần",
        W / 2,
        H - 23,
        W - 44,
        13,
        "bold 11.5px 'Segoe UI', sans-serif",
        "#fcd34d",
        1,
      );
    },

    "r1-2a": (ctx, W, H) => {
      drawMilestoneFlow(
        ctx,
        [
          {
            year: "8/1979\nHNTW 6 IV",
            title: "Làm cho sản xuất 'Bung ra'",
            sub: "Tháo gỡ trói buộc hành chính, thừa nhận SX ngoài kế hoạch",
            color: "#94a3b8",
          },
          {
            year: "1/1981\nCHỈ THỊ 100",
            title: "Khoán sản phẩm trong nông nghiệp",
            sub: "Gắn lợi ích trực tiếp của nông dân với năng suất lao động",
            color: "#fbbf24",
          },
          {
            year: "6/1985\nHNTW 8 V",
            title: "Chủ trương xóa bỏ bao cấp",
            sub: "Xóa cơ chế Giá - Lương - Tiền quan liêu, chuyển hạch toán XHCN",
            color: "#f97316",
          },
        ],
        W,
        H,
        "Tiền đề lý luận & thực tiễn tất yếu dẫn tới Đại hội VI (1986)",
      );
    },

    "r1-2b": (ctx, W, H) => {
      drawMilestoneFlow(
        ctx,
        [
          {
            year: "12/1986\nĐẠI HỘI VI",
            title: "Bước ngoặt Đổi mới toàn diện",
            sub: "Đổi mới tư duy KT; khôi phục KT nhiều thành phần & tiền tệ",
            color: "#f97316",
          },
          {
            year: "1991\nĐẠI HỘI VII",
            title: "Cương lĩnh thời kỳ quá độ",
            sub: "Kinh tế hàng hóa nhiều thành phần theo cơ chế TT có QL NN",
            color: "#38bdf8",
          },
          {
            year: "1996\nĐẠI HỘI VIII",
            title: "Đẩy mạnh CNH, HĐH đất nước",
            sub: "Khẳng định: Sản xuất hàng hóa KHÔNG đối lập với CNXH",
            color: "#10b981",
          },
        ],
        W,
        H,
        "Giai đoạn 1986–2000: Thừa nhận KTTT như công cụ quản lý kinh tế",
      );
    },

    "r1-2c": (ctx, W, H) => {
      drawMilestoneFlow(
        ctx,
        [
          {
            year: "2001\nĐẠI HỘI IX",
            title: "Xác lập mô hình tổng quát KTTT ĐHXHCN",
            sub: "Bước nhảy vọt lý luận thời kỳ quá độ lên CNXH",
            color: "#fbbf24",
          },
          {
            year: "2006–2017\nĐH X – XII",
            title: "Hoàn thiện thể chế & NQ TW5 (11-NQ/TW)",
            sub: "KTTT hiện đại, hội nhập; KTTN là một động lực quan trọng",
            color: "#38bdf8",
          },
          {
            year: "2021\nĐẠI HỘI XIII",
            title: "Nhà nước + Thị trường + Nhân tố xã hội",
            sub: "Xác định rõ vai trò chủ thể từng thành phần kinh tế",
            color: "#34d399",
          },
          {
            year: "2025–2026\nNQ 68 & ĐH XIV",
            title: "KTTN là động lực quan trọng nhất (2030)",
            sub: "4 Nghị quyết chiến lược & vận hành thông suốt thể chế mới",
            color: "#f43f5e",
          },
        ],
        W,
        H,
      );
    },

    "r1-3": (ctx, W, H) => {
      fillCard(ctx, 12, 12, W - 24, 34, 8, "#064e3b", "#10b981", 1.6);
      drawCenterLines(
        ctx,
        "MINH CHỨNG THỰC TIỄN NĂM 2024 – VIỆT NAM",
        W / 2,
        29,
        W - 40,
        14,
        "bold 13px 'Segoe UI', sans-serif",
        "#6ee7b7",
        1,
      );

      const kpis = [
        { val: "476,3 TỶ $", label: "Quy mô GDP 2024 (Hạng 33 TG)", pct: 0.92, col: "#f59e0b" },
        { val: "~4.700 $", label: "GDP bình quân đầu người", pct: 0.72, col: "#10b981" },
        { val: "17 FTA", label: "Hiệp định > 60 đối tác toàn cầu", pct: 0.84, col: "#38bdf8" },
        { val: "73 NƯỚC", label: "Công nhận VN là nền KTTT", pct: 0.88, col: "#a78bfa" },
      ];

      let cy = 58;
      const rowH = 56;
      kpis.forEach((k) => {
        fillCard(ctx, 12, cy, W - 24, rowH - 6, 8, "#0f172a", "#334155", 1);
        ctx.save();
        ctx.textAlign = "left";
        ctx.fillStyle = k.col;
        ctx.font = "bold 17px 'Segoe UI', sans-serif";
        ctx.fillText(k.val, 24, cy + 22);
        ctx.fillStyle = "#e2e8f0";
        ctx.font = "12px 'Segoe UI', sans-serif";
        ctx.fillText(k.label, 145, cy + 21);
        ctx.restore();

        // Thanh biểu đồ tiến độ trực quan
        fillCard(ctx, 24, cy + 32, W - 48, 10, 5, "#1e293b", null, 0);
        fillCard(ctx, 24, cy + 32, (W - 48) * k.pct, 10, 5, k.col, null, 0);
        cy += rowH;
      });

      fillCard(ctx, 12, H - 68, W - 24, 56, 8, "#172554", "#38bdf888", 1.4);
      drawCenterLines(
        ctx,
        "3 CĂN CỨ TẤT YẾU:\n1. Quy luật 'Khâu trung gian'  •  2. Thúc đẩy LLSX  •  3. Vì con người",
        W / 2,
        H - 40,
        W - 40,
        17,
        "bold 12px 'Segoe UI', sans-serif",
        "#bae6fd",
        2,
      );
    },

    "r1-4a": (ctx, W, H, accent) => {
      drawFourQuadrantCards(
        ctx,
        [
          {
            title: "Pháp luật đồng bộ",
            sub: "Tương thích chuẩn mực & cam kết quốc tế",
            color: "#38bdf8",
          },
          {
            title: "Ổn định vĩ mô",
            sub: "Giữ cân đối lớn, kiểm soát lạm phát & cạnh tranh",
            color: "#fbbf24",
          },
          {
            title: "Kiến tạo sáng tạo",
            sub: "Thúc đẩy khởi nghiệp, chuyển đổi số, KTTT mới",
            color: "#34d399",
          },
          {
            title: "An ninh kinh tế",
            sub: "Đa phương hóa thị trường & phòng vệ thương mại",
            color: "#f472b6",
          },
        ],
        "QUẢN LÝ\nNHÀ NƯỚC",
        accent,
        W,
        H,
      );
      fillCard(ctx, 16, H - 32, W - 32, 24, 6, "#1e293b", "#38bdf866", 1);
      drawCenterLines(
        ctx,
        "Nhà nước pháp quyền XHCN khắc phục khuyết tật tự phát của thị trường",
        W / 2,
        H - 20,
        W - 44,
        13,
        "bold 11.5px 'Segoe UI', sans-serif",
        "#bae6fd",
        1,
      );
    },

    "r1-4b": (ctx, W, H, accent) => {
      drawFourQuadrantCards(
        ctx,
        [
          {
            title: "a. Lý luận & Đường lối",
            sub: "Đúc kết thực tiễn, đề ra cương lĩnh, chiến lược",
            color: "#a78bfa",
          },
          {
            title: "b. Định hướng XHCN",
            sub: "Ngăn ngừa chệch hướng, gắn tăng trưởng & công bằng",
            color: "#34d399",
          },
          {
            title: "c. Xây dựng Thể chế",
            sub: "Thể chế hóa quan điểm thành pháp luật đồng bộ",
            color: "#38bdf8",
          },
          {
            title: "d. Cán bộ & Giám sát",
            sub: "Kiểm soát quyền lực, chống tham nhũng, lợi ích nhóm",
            color: "#fbbf24",
          },
        ],
        "ĐẢNG CSVN\nLÃNH ĐẠO",
        accent,
        W,
        H,
      );
      fillCard(ctx, 16, H - 32, W - 32, 24, 6, "#2e1065", "#a78bfa88", 1);
      drawCenterLines(
        ctx,
        "Nhân tố quyết định bảo đảm định hướng XHCN của nền kinh tế",
        W / 2,
        H - 20,
        W - 44,
        13,
        "bold 11.5px 'Segoe UI', sans-serif",
        "#ddd6fe",
        1,
      );
    },

    "r2-a": (ctx, W, H, accent) => {
      drawFourQuadrantCards(
        ctx,
        [
          {
            title: "Chủ thể độc lập",
            sub: "Tự chủ quyết định sản xuất, kinh doanh",
            color: "#fbbf24",
          },
          {
            title: "Giá cả & Cạnh tranh",
            sub: "Giá theo cung – cầu; cạnh tranh là động lực",
            color: "#38bdf8",
          },
          {
            title: "Thị trường đồng bộ",
            sub: "Hàng hóa, vốn, lao động, KH-CN, đất đai, mở",
            color: "#34d399",
          },
          {
            title: "Điều tiết vĩ mô",
            sub: "Nhà nước sửa chữa thất bại & khuyết tật TT",
            color: "#f97316",
          },
        ],
        "ĐẶC ĐIỂM\nCHUNG KTTT",
        accent,
        W,
        H,
      );
      fillCard(ctx, 16, H - 32, W - 32, 24, 6, "#451a03", "#f59e0b88", 1);
      drawCenterLines(
        ctx,
        "Đặc thù VN: Đi lên từ SX nhỏ → Tất yếu tiếp tục hoàn thiện thể chế",
        W / 2,
        H - 20,
        W - 44,
        13,
        "bold 11.5px 'Segoe UI', sans-serif",
        "#fde68a",
        1,
      );
    },

    "r2-b1": (ctx, W, H) => {
      fillCard(ctx, 16, 18, W - 32, 74, 10, "#0c4a6e", "#38bdf8", 1.8);
      drawCenterLines(
        ctx,
        "PHÁT TRIỂN LỰC LƯỢNG SẢN XUẤT HIỆN ĐẠI\nXây dựng cơ sở vật chất – kỹ thuật của CNXH",
        W / 2,
        55,
        W - 48,
        20,
        "bold 13px 'Segoe UI', sans-serif",
        "#e0f2fe",
        2,
      );

      drawArrowLine(ctx, W / 2, 94, W / 2, 118, "#fbbf24", 2.5);

      fillCard(ctx, 16, 122, W - 32, 74, 10, "#064e3b", "#10b981", 1.8);
      drawCenterLines(
        ctx,
        "XÂY DỰNG QUAN HỆ SẢN XUẤT TIẾN BỘ, PHÙ HỢP\nPhản ánh mục tiêu chính trị – xã hội dưới sự lãnh đạo của Đảng",
        W / 2,
        159,
        W - 48,
        20,
        "bold 13px 'Segoe UI', sans-serif",
        "#d1fae5",
        2,
      );

      drawArrowLine(ctx, W / 2, 198, W / 2, 224, "#fbbf24", 2.5);

      fillCard(ctx, 14, 228, W - 28, 104, 12, "#78350f", "#f59e0b", 2.2);
      drawCenterLines(
        ctx,
        "MỤC TIÊU TỐI THƯỢNG\n“Dân giàu, nước mạnh, dân chủ,\ncông bằng, văn minh”",
        W / 2,
        280,
        W - 44,
        22,
        "bold 15px 'Segoe UI', sans-serif",
        "#fef3c7",
        3,
      );
    },

    "r2-b2": (ctx, W, H) => {
      fillCard(ctx, 14, 14, W - 28, 72, 10, "#0f172a", "#38bdf888", 1.5);
      drawCenterLines(
        ctx,
        "HAI MẶT CỦA SỞ HỮU\nNội dung Kinh tế (lợi ích)  +  Nội dung Pháp lý (quyền, nghĩa vụ)",
        W / 2,
        50,
        W - 44,
        20,
        "bold 12.5px 'Segoe UI', sans-serif",
        "#bae6fd",
        2,
      );

      const bars = [
        { name: "Kinh tế Nhà nước", role: "GIỮ VAI TRÒ CHỦ ĐẠO", pct: 0.9, col: "#dc2626" },
        { name: "Kinh tế Tư nhân", role: "ĐỘNG LỰC QUAN TRỌNG", pct: 0.85, col: "#f59e0b" },
        { name: "KT Tập thể + FDI", role: "HỢP TÁC • CẠNH TRANH BÌNH ĐẲNG", pct: 0.72, col: "#38bdf8" },
      ];
      let y = 100;
      bars.forEach((b) => {
        fillCard(ctx, 14, y, W - 28, 56, 8, "#111c33", `${b.col}aa`, 1.5);
        ctx.save();
        ctx.textAlign = "left";
        ctx.fillStyle = "#f8fafc";
        ctx.font = "bold 13.5px 'Segoe UI', sans-serif";
        ctx.fillText(b.name, 26, y + 20);
        ctx.textAlign = "right";
        ctx.fillStyle = b.col;
        ctx.font = "bold 11.5px 'Segoe UI', sans-serif";
        ctx.fillText(b.role, W - 26, y + 20);
        ctx.restore();
        fillCard(ctx, 26, y + 34, W - 52, 10, 5, "#1e293b", null, 0);
        fillCard(ctx, 26, y + 34, (W - 52) * b.pct, 10, 5, b.col, null, 0);
        y += 64;
      });

      fillCard(ctx, 14, H - 56, W - 28, 44, 8, "#064e3b", "#10b981", 1.6);
      drawCenterLines(
        ctx,
        "NÒNG CỐT ĐỘC LẬP, TỰ CHỦ:\nKT Nhà nước + KT Tập thể + KT Tư nhân",
        W / 2,
        H - 34,
        W - 44,
        16,
        "bold 12px 'Segoe UI', sans-serif",
        "#d1fae5",
        2,
      );
    },

    "r2-b3": (ctx, W, H) => {
      // Tam giác quản lý 3 cực: Đảng -> Nhà nước <-> Nhân dân
      fillCard(ctx, 56, 18, W - 112, 68, 12, "#7f1d1d", "#ef4444", 2);
      drawCenterLines(
        ctx,
        "ĐẢNG CỘNG SẢN VIỆT NAM\nLãnh đạo qua Cương lĩnh, Đường lối",
        W / 2,
        52,
        W - 130,
        18,
        "bold 13px 'Segoe UI', sans-serif",
        "#fee2e2",
        2,
      );

      drawArrowLine(ctx, W / 2, 88, W / 2, 124, "#fbbf24", 2.5);

      fillCard(ctx, 26, 128, W - 52, 76, 12, "#0c4a6e", "#38bdf8", 2);
      drawCenterLines(
        ctx,
        "NHÀ NƯỚC PHÁP QUYỀN XHCN\nQuản lý bằng Pháp luật, Quy hoạch, Chính sách\ntrên cơ sở tôn trọng quy luật thị trường",
        W / 2,
        166,
        W - 72,
        18,
        "bold 12.5px 'Segoe UI', sans-serif",
        "#e0f2fe",
        3,
      );

      drawArrowLine(ctx, W / 2, 240, W / 2, 206, "#34d399", 2.5);

      fillCard(ctx, 26, 242, W - 52, 68, 12, "#064e3b", "#10b981", 2);
      drawCenterLines(
        ctx,
        "NHÂN DÂN LÀM CHỦ & GIÁM SÁT\nNhà nước CỦA dân, DO dân, VÌ dân",
        W / 2,
        276,
        W - 72,
        18,
        "bold 13px 'Segoe UI', sans-serif",
        "#d1fae5",
        2,
      );

      fillCard(ctx, 18, H - 36, W - 36, 26, 6, "#1e293b", "#f59e0b66", 1);
      drawCenterLines(
        ctx,
        "Khắc phục khuyết tật thị trường gắn với dân chủ XHCN",
        W / 2,
        H - 23,
        W - 50,
        13,
        "bold 11.5px 'Segoe UI', sans-serif",
        "#fde68a",
        1,
      );
    },

    "r2-b4": (ctx, W, H) => {
      fillCard(ctx, 16, 16, W - 32, 92, 10, "#064e3b", "#10b981", 2);
      drawCenterLines(
        ctx,
        "1. PHÂN PHỐI ĐẦU VÀO (CƠ HỘI)\nCông bằng tiếp cận các yếu tố sản xuất,\nnguồn lực và cơ hội phát triển cho mọi chủ thể",
        W / 2,
        62,
        W - 52,
        20,
        "bold 12.5px 'Segoe UI', sans-serif",
        "#d1fae5",
        3,
      );

      drawArrowLine(ctx, W / 2, 110, W / 2, 134, "#fbbf24", 2.5);

      fillCard(ctx, 16, 138, W - 32, 126, 10, "#1e293b", "#f59e0b", 1.8);
      drawCenterLines(
        ctx,
        "2. PHÂN PHỐI ĐẦU RA (KẾT QUẢ)",
        W / 2,
        156,
        W - 52,
        16,
        "bold 13px 'Segoe UI', sans-serif",
        "#fde68a",
        1,
      );

      const channels = [
        { lbl: "Theo kết quả Lao động & Hiệu quả KT (Chủ yếu)", col: "#10b981" },
        { lbl: "Theo mức đóng góp Vốn & Nguồn lực khác", col: "#38bdf8" },
        { lbl: "Qua hệ thống An sinh & Phúc lợi xã hội", col: "#a78bfa" },
      ];
      channels.forEach((ch, idx) => {
        const cy = 172 + idx * 29;
        fillCard(ctx, 26, cy, W - 52, 23, 6, "#0f172a", `${ch.col}99`, 1);
        drawCenterLines(
          ctx,
          ch.lbl,
          W / 2,
          cy + 11.5,
          W - 64,
          13,
          "bold 11px 'Segoe UI', sans-serif",
          "#f8fafc",
          1,
        );
      });

      fillCard(ctx, 16, H - 72, W - 32, 58, 10, "#0c4a6e", "#38bdf8", 1.6);
      drawCenterLines(
        ctx,
        "BẢN CHẤT ĐỊNH HƯỚNG XHCN:\nPhân phối theo lao động & phúc lợi xã hội giữ vai trò cốt lõi",
        W / 2,
        H - 43,
        W - 48,
        17,
        "bold 12px 'Segoe UI', sans-serif",
        "#bae6fd",
        2,
      );
    },

    "r2-b5": (ctx, W, H) => {
      // Cán cân Tăng trưởng <-> Công bằng
      ctx.save();
      ctx.strokeStyle = "#f59e0b";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(W / 2, 76);
      ctx.lineTo(W / 2, 184);
      ctx.moveTo(W / 2 - 48, 184);
      ctx.lineTo(W / 2 + 48, 184);
      ctx.stroke();

      ctx.strokeStyle = "#fde68a";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(52, 76);
      ctx.lineTo(W - 52, 76);
      ctx.stroke();
      ctx.restore();

      fillCard(ctx, 14, 24, (W - 44) / 2, 86, 10, "#0c4a6e", "#38bdf8", 2);
      drawCenterLines(
        ctx,
        "TĂNG TRƯỞNG\nKINH TẾ\nHiện đại • Hiệu quả",
        14 + (W - 44) / 4,
        67,
        (W - 44) / 2 - 14,
        18,
        "bold 12.5px 'Segoe UI', sans-serif",
        "#e0f2fe",
        3,
      );

      fillCard(
        ctx,
        W / 2 + 8,
        24,
        (W - 44) / 2,
        86,
        10,
        "#2e1065",
        "#a78bfa",
        2,
      );
      drawCenterLines(
        ctx,
        "CÔNG BẰNG &\nTIẾN BỘ XH\nNgay từ đầu chính sách",
        W / 2 + 8 + (W - 44) / 4,
        67,
        (W - 44) / 2 - 14,
        18,
        "bold 12.5px 'Segoe UI', sans-serif",
        "#ede9fe",
        3,
      );

      fillCard(ctx, 16, 198, W - 32, 136, 10, "#0f172a", "#a78bfa88", 1.6);
      drawCenterLines(
        ctx,
        "CƠ HỘI TIẾP CẬN BÌNH ĐẲNG DỊCH VỤ CƠ BẢN:\n• Giáo dục & đào tạo nhân lực\n• Chăm sóc y tế & BHYT toàn dân\n• Việc làm & an sinh ngay trong từng bước phát triển",
        W / 2,
        266,
        W - 48,
        22,
        "bold 12.5px 'Segoe UI', sans-serif",
        "#e2e8f0",
        4,
      );
    },

    "r3-1": (ctx, W, H) => {
      const limits = [
        { num: "01", txt: "Vì lợi ích thiểu số tư bản độc quyền" },
        { num: "02", txt: "Khủng hoảng kinh tế chu kỳ ('thừa')" },
        { num: "03", txt: "Phân hóa giàu nghèo & bất bình đẳng" },
        { num: "04", txt: "Suy thoái môi trường, cạn tài nguyên" },
        { num: "05", txt: "Xung đột lợi ích, chiến tranh thương mại" },
      ];
      let y = 14;
      limits.forEach((lm) => {
        fillCard(ctx, 14, y, W - 28, 52, 8, "#1f0d16", "#f43f5e", 1.6);
        fillCard(ctx, 22, y + 9, 42, 34, 7, "#e11d48", null, 0);
        drawCenterLines(
          ctx,
          lm.num,
          43,
          y + 26,
          36,
          14,
          "bold 14px 'Segoe UI', sans-serif",
          "#ffffff",
          1,
        );
        ctx.save();
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "#ffe4e6";
        ctx.font = "bold 13.5px 'Segoe UI', sans-serif";
        ctx.fillText(lm.txt, 76, y + 26);
        ctx.restore();
        y += 60;
      });
      fillCard(ctx, 14, H - 40, W - 28, 28, 7, "#450a0a", "#ef4444", 1.2);
      drawCenterLines(
        ctx,
        "Khuyết tật cố hữu từ chế độ chiếm hữu tư nhân TBCN",
        W / 2,
        H - 26,
        W - 44,
        14,
        "bold 12px 'Segoe UI', sans-serif",
        "#fca5a5",
        1,
      );
    },

    "r3-2": (ctx, W, H) => {
      fillCard(ctx, 12, 12, W - 24, 34, 8, "#064e3b", "#10b981", 1.6);
      drawCenterLines(
        ctx,
        "THỰC TIỄN KHẮC PHỤC TẠI VIỆT NAM",
        W / 2,
        29,
        W - 40,
        14,
        "bold 13px 'Segoe UI', sans-serif",
        "#a7f3d0",
        1,
      );

      // So sánh giảm hộ nghèo 58% -> <3%
      fillCard(ctx, 12, 56, W - 24, 96, 10, "#0f172a", "#10b98188", 1.4);
      ctx.save();
      ctx.textAlign = "left";
      ctx.fillStyle = "#f8fafc";
      ctx.font = "bold 12.5px 'Segoe UI', sans-serif";
      ctx.fillText("1. Tỷ lệ hộ nghèo giảm mạnh:", 24, 76);
      ctx.restore();

      fillCard(ctx, 24, 88, 120, 14, 5, "#475569", null, 0);
      fillCard(ctx, 24, 88, 120 * 0.78, 14, 5, "#f43f5e", null, 0);
      ctx.save();
      ctx.fillStyle = "#fda4af";
      ctx.font = "bold 12px 'Segoe UI', sans-serif";
      ctx.fillText("1993: >58%", 154, 99);
      ctx.restore();

      fillCard(ctx, 24, 114, 120, 14, 5, "#475569", null, 0);
      fillCard(ctx, 24, 114, 14, 14, 5, "#10b981", null, 0);
      ctx.save();
      ctx.fillStyle = "#6ee7b7";
      ctx.font = "bold 12px 'Segoe UI', sans-serif";
      ctx.fillText("Hiện nay: <3%  (HDI tăng liên tục)", 154, 125);
      ctx.restore();

      // BHYT > 93%
      fillCard(ctx, 12, 162, W - 24, 62, 10, "#0f172a", "#38bdf888", 1.4);
      ctx.save();
      ctx.fillStyle = "#e0f2fe";
      ctx.font = "bold 12.5px 'Segoe UI', sans-serif";
      ctx.fillText("2. Bao phủ BHYT toàn dân:", 24, 184);
      ctx.fillStyle = "#38bdf8";
      ctx.font = "bold 15px 'Segoe UI', sans-serif";
      ctx.fillText("> 93% dân số", W - 128, 185);
      ctx.restore();
      fillCard(ctx, 24, 198, W - 48, 12, 5, "#1e293b", null, 0);
      fillCard(ctx, 24, 198, (W - 48) * 0.93, 12, 5, "#38bdf8", null, 0);

      // Net Zero & Đa dạng sở hữu
      fillCard(ctx, 12, 234, W - 24, 56, 10, "#052e16", "#22c55e", 1.5);
      drawCenterLines(
        ctx,
        "3. Môi trường: Cam kết NET ZERO 2050 (COP26)\nKinh tế tuần hoàn & Luật BVMT 2020",
        W / 2,
        262,
        W - 44,
        18,
        "bold 12px 'Segoe UI', sans-serif",
        "#bbf7d0",
        2,
      );

      fillCard(ctx, 12, H - 56, W - 24, 42, 8, "#1e293b", "#f59e0b88", 1.2);
      drawCenterLines(
        ctx,
        "DNNN giữ hạ tầng chiến lược + Vingroup, FPT, Thaco lớn mạnh",
        W / 2,
        H - 35,
        W - 44,
        15,
        "bold 11.5px 'Segoe UI', sans-serif",
        "#fde68a",
        1,
      );
    },

    "r3-table": (ctx, W, H) => {
      fillCard(ctx, 12, 12, W - 24, 34, 8, "#1e293b", "#f59e0b", 1.5);
      drawCenterLines(
        ctx,
        "ĐỐI CHIẾU 6 TIÊU CHÍ: KTTT TBCN  vs.  KTTT ĐHXHCN",
        W / 2,
        29,
        W - 40,
        14,
        "bold 12px 'Segoe UI', sans-serif",
        "#fde68a",
        1,
      );

      const pairs = [
        ["1. Mục đích", "Lợi nhuận tư bản", "Dân giàu, nước mạnh"],
        ["2. Sở hữu", "Tư nhân thống trị", "Đa dạng (KTNN chủ đạo)"],
        ["3. Quản lý", "Tài phiệt chi phối", "Nhà nước pháp quyền XHCN"],
        ["4. Phân phối", "Chủ yếu theo vốn", "Lao động, vốn & an sinh"],
        ["5. Công bằng", "Xử lý bị động sau", "Gắn ngay từ từng chính sách"],
        ["6. Hệ quả", "Khủng hoảng chu kỳ", "Ổn định vĩ mô & bền vững"],
      ];
      let y = 56;
      pairs.forEach((row) => {
        fillCard(ctx, 12, y, W - 24, 44, 7, "#0f172a", "#334155", 1);
        ctx.save();
        ctx.font = "bold 11px 'Segoe UI', sans-serif";
        ctx.fillStyle = "#fbbf24";
        ctx.fillText(row[0], 20, y + 17);
        ctx.fillStyle = "#fda4af";
        ctx.font = "11px 'Segoe UI', sans-serif";
        ctx.fillText("TBCN: " + row[1], 20, y + 34);
        ctx.fillStyle = "#6ee7b7";
        ctx.font = "bold 11px 'Segoe UI', sans-serif";
        ctx.fillText("XHCN: " + row[2], W / 2 + 4, y + 26);
        ctx.restore();
        y += 50;
      });
    },

    "r3-3a": (ctx, W, H) => {
      const items = [
        { t: "1. Yếu tố XHCN & thị trường", s: "HTX chưa thu hút; còn hàng giả, đa cấp biến tướng" },
        { t: "2. Thể chế chậm hơn công nghệ 4.0", s: "Quản lý kinh doanh online & thuế nền tảng số chưa kịp" },
        { t: "3. Tiếp cận nguồn lực chưa bình đẳng", s: "DNTN khó tiếp cận vốn/đất; một số DNNN thất thoát" },
        { t: "4. Giàu nghèo & lợi ích nhóm", s: "Chênh lệch thành thị - nông thôn; tệ tham nhũng, quan liêu" },
      ];
      let y = 16;
      items.forEach((it) => {
        fillCard(ctx, 14, y, W - 28, 74, 10, "#1f0d16", "#e11d48", 1.6);
        ctx.save();
        ctx.textAlign = "left";
        ctx.fillStyle = "#fda4af";
        ctx.font = "bold 13.5px 'Segoe UI', sans-serif";
        ctx.fillText(it.t, 26, y + 26);
        ctx.fillStyle = "#e2e8f0";
        ctx.font = "12px 'Segoe UI', sans-serif";
        ctx.fillText(it.s, 26, y + 51);
        ctx.restore();
        y += 82;
      });
    },

    "r3-3b": (ctx, W, H) => {
      const items = [
        { t: "1. Giám sát TT & Đổi mới HTX", s: "Xử lý nghiêm hàng giả; nâng hiệu quả HTX tự chủ" },
        { t: "2. Pháp lý & Thuế Kinh tế số", s: "Bổ sung luật giao dịch nền tảng số, bảo vệ người tiêu dùng" },
        { t: "3. Bình đẳng nguồn lực & DNNN", s: "Minh bạch hóa tài chính DNNN; mở cơ hội vốn/đất cho DNTN" },
        { t: "4. An sinh nông thôn & Chống tham nhũng", s: "Nâng thu nhập nông dân; quyết liệt bài trừ lợi ích nhóm" },
      ];
      let y = 16;
      items.forEach((it) => {
        fillCard(ctx, 14, y, W - 28, 74, 10, "#082f49", "#0284c7", 1.8);
        ctx.save();
        ctx.textAlign = "left";
        ctx.fillStyle = "#7dd3fc";
        ctx.font = "bold 13.5px 'Segoe UI', sans-serif";
        ctx.fillText(it.t, 26, y + 26);
        ctx.fillStyle = "#e2e8f0";
        ctx.font = "12px 'Segoe UI', sans-serif";
        ctx.fillText(it.s, 26, y + 51);
        ctx.restore();
        y += 82;
      });
    },

    "r3-verdict": (ctx, W, H) => {
      fillCard(ctx, 14, 16, W - 28, 102, 12, "#064e3b", "#10b981", 2);
      drawCenterLines(
        ctx,
        "ĐÃ KHẮC PHỤC MỘT PHẦN QUAN TRỌNG\nĐa dạng sở hữu • Điều tiết Nhà nước •\nGắn tăng trưởng với công bằng xã hội",
        W / 2,
        67,
        W - 48,
        22,
        "bold 13px 'Segoe UI', sans-serif",
        "#d1fae5",
        3,
      );

      fillCard(ctx, 14, 130, W - 28, 96, 12, "#78350f", "#f59e0b", 2);
      drawCenterLines(
        ctx,
        "CHƯA THỂ GIẢI QUYẾT HOÀN TOÀN NGAY\nCòn khoảng cách giàu nghèo, bất cập DNNN–DNTN\n& yêu cầu hoàn thiện thể chế kiểm chứng thực tiễn",
        W / 2,
        178,
        W - 48,
        21,
        "bold 12.5px 'Segoe UI', sans-serif",
        "#fef3c7",
        3,
      );

      fillCard(ctx, 14, 240, W - 28, 94, 12, "#0f172a", "#38bdf8", 1.6);
      drawCenterLines(
        ctx,
        "HỆ THỐNG CĂN CỨ CHÍNH THỐNG\n10 Nguồn Tài Liệu Tham Khảo:\nGiáo trình Bộ GD&ĐT • Văn kiện ĐH XII, XIII, XIV\nHiến pháp 2013 • NQ 11-NQ/TW & NQ 68-NQ/TW",
        W / 2,
        287,
        W - 48,
        18,
        "bold 11.5px 'Segoe UI', sans-serif",
        "#bae6fd",
        4,
      );
    },
  };

  function drawExhibitInfographic(ctx, visualType, rect, accentColor) {
    const r = rect || { x: 0, y: 0, w: 400, h: 360 };
    drawBlueprintGrid(ctx, r.x, r.y, r.w, r.h, accentColor);

    const baseW = 400;
    const baseH = 360;
    const scale = Math.min(r.w / baseW, r.h / baseH);
    const drawW = baseW * scale;
    const drawH = baseH * scale;
    const offsetX = r.x + (r.w - drawW) / 2;
    const offsetY = r.y + (r.h - drawH) / 2;

    ctx.save();
    ctx.translate(offsetX, offsetY);
    ctx.scale(scale, scale);

    const renderer =
      INFOGRAPHIC_RENDERERS[visualType] || INFOGRAPHIC_RENDERERS["r1-1a"];
    renderer(ctx, baseW, baseH, accentColor || "#f59e0b");
    ctx.restore();
  }

  const COMPACT_HIGHLIGHTS = {
    "r1-1a": ["4 Quy luật KTTT", "Giá trị • Cung-Cầu", "Cạnh tranh • Tiền tệ"],
    "r1-1b": ["ĐH XIII & HP 2013", "KTNN vai trò chủ đạo", "Dân giàu • Công bằng"],
    "r1-2a": ["8/1979: Bung ra", "1981: Chỉ thị 100", "1985: HNTW 8 khóa V"],
    "r1-2b": ["12/1986: Đại hội VI", "1991: Cơ chế thị trường", "1996: SXHH ≠ CNTB"],
    "r1-2c": ["ĐH IX: Mô hình TQ", "NQ 68: KTTN động lực", "ĐH XIV (2026): Đồng bộ"],
    "r1-3": ["GDP 2024: 476,3 tỷ $", "17 FTA (>60 đối tác)", "73 Nước công nhận"],
    "r1-4a": ["Pháp luật đồng bộ", "Giữ ổn định vĩ mô", "Phòng vệ thương mại"],
    "r1-4b": ["Tư duy lý luận", "Giữ định hướng XHCN", "Chống tham nhũng"],
    "r2-a": ["Chủ thể tự chủ", "Giá theo cung - cầu", "Hoàn thiện từ SX nhỏ"],
    "r2-b1": ["LLSX hiện đại", "QHSX tiến bộ phù hợp", "Vì hạnh phúc nhân dân"],
    "r2-b2": ["KT Nhà nước: Chủ đạo", "KT Tư nhân: Động lực", "Nòng cốt tự chủ"],
    "r2-b3": ["Đảng CSVN lãnh đạo", "Nhà nước pháp quyền", "Nhân dân giám sát"],
    "r2-b4": ["Đầu vào: Công bằng", "Đầu ra: Theo lao động", "Tái phân phối an sinh"],
    "r2-b5": ["Gắn ngay từ chính sách", "Giáo dục & Y tế", "Việc làm bền vững"],
    "r3-1": ["Thiểu số tư bản", "Khủng hoảng chu kỳ", "Môi trường & Xung đột"],
    "r3-2": ["Nghèo: >58% ↘ <3%", "BHYT > 93% dân số", "COP26: Net Zero 2050"],
    "r3-table": ["6 Tiêu chí bản chất", "TBCN: Lợi nhuận", "XHCN: Vì con người"],
    "r3-3a": ["HTX còn yếu, hàng giả", "Thể chế chậm hơn 4.0", "Khoảng cách vùng miền"],
    "r3-3b": ["Quản lý kinh tế số", "Minh bạch hóa DNNN", "Chống lợi ích nhóm"],
    "r3-verdict": ["Khắc phục một phần", "Tiếp tục hoàn thiện", "10 Nguồn chính thống"],
  };

  function drawLoadedPhotoInFrame(
    ctx,
    img,
    src,
    rect,
    visualType,
    accentColor,
    caption,
  ) {
    const r = rect || { x: 28, y: 28, w: 968, h: 644 };
    ctx.save();
    roundedRectPath(ctx, r.x, r.y, r.w, r.h, 2);
    ctx.clip();
    ctx.fillStyle = "#161822";
    ctx.fillRect(r.x, r.y, r.w, r.h);

    const iw = img.naturalWidth || img.width || 1280;
    const ih = img.naturalHeight || img.height || 850;
    const scale = Math.max(r.w / iw, r.h / ih);
    const dw = iw * scale;
    const dh = ih * scale;
    const dx = r.x + (r.w - dw) / 2;
    const dy = r.y + (r.h - dh) / 2;
    ctx.drawImage(img, dx, dy, dw, dh);

    // Warm Museum Color Grading: phủ lớp cân bằng tông ấm rất nhẹ để 20 bức tranh hài hòa ánh sáng bảo tàng
    ctx.fillStyle = "rgba(255, 238, 206, 0.045)";
    ctx.fillRect(r.x, r.y, r.w, r.h);

    // Warm Archival Vignette nhẹ ở 4 góc ảnh
    const cx = r.x + r.w / 2;
    const cy = r.y + r.h / 2;
    const maxR = Math.hypot(r.w / 2, r.h / 2);
    const vig = ctx.createRadialGradient(cx, cy, maxR * 0.56, cx, cy, maxR);
    const edgeAlpha = visualType === "r3-table" ? 0.12 : 0.24;
    vig.addColorStop(0, "rgba(0, 0, 0, 0)");
    vig.addColorStop(1, `rgba(10, 11, 16, ${edgeAlpha})`);
    ctx.fillStyle = vig;
    ctx.fillRect(r.x, r.y, r.w, r.h);
    ctx.restore();

    // Đường chỉ vàng đồng mảnh ngăn cách giữa bo giấy mỹ thuật và bức ảnh
    ctx.save();
    ctx.strokeStyle = "rgba(212, 160, 56, 0.35)";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(r.x - 0.5, r.y - 0.5, r.w + 1, r.h + 1);
    ctx.restore();
  }

  function renderInfographicDataUrl(exhibit) {
    if (typeof document === "undefined") return "";
    const canvas = document.createElement("canvas");
    canvas.width = 480;
    canvas.height = 360;
    const ctx = canvas.getContext("2d");
    if (!ctx) return "";
    ctx.fillStyle = "#090f1d";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const visualId =
      (exhibit && (exhibit.visualType || exhibit.id)) || "r1-1a";
    const accent = (exhibit && exhibit.color) || "#f59e0b";
    drawExhibitInfographic(
      ctx,
      visualId,
      { x: 8, y: 8, w: 464, h: 344 },
      accent,
    );
    try {
      return canvas.toDataURL("image/png");
    } catch (_) {
      return "";
    }
  }

  // ================= HỆ THỐNG NẠP ẢNH BẤT ĐỒNG BỘ AN TOÀN CORS (CÁCH 2) =================
  function tryLoadSingleImage(src, timeoutMs = 4000, isRemote = true) {
    return new Promise((resolve, reject) => {
      if (!src || typeof Image === "undefined") {
        reject(new Error("Invalid image source or Image unavailable"));
        return;
      }

      const img = new Image();
      if (isRemote && /^https?:\/\//i.test(src)) {
        img.crossOrigin = "anonymous";
      }

      let settled = false;
      const timer = setTimeout(() => {
        if (settled) return;
        settled = true;
        cleanup();
        reject(new Error("Image load timeout: " + src));
      }, timeoutMs);

      function cleanup() {
        clearTimeout(timer);
        img.onload = null;
        img.onerror = null;
      }

      img.onload = () => {
        if (settled) return;
        settled = true;
        cleanup();
        const finish = () => {
          if ((img.naturalWidth || img.width) > 0) {
            resolve({ img, src });
          } else {
            reject(new Error("Loaded image has zero width"));
          }
        };
        if (typeof img.decode === "function") {
          img.decode().then(finish, finish);
        } else {
          finish();
        }
      };

      img.onerror = () => {
        if (settled) return;
        settled = true;
        cleanup();
        reject(new Error("Image failed or blocked by CORS: " + src));
      };

      img.src = src;
    });
  }

  function enqueueRemoteLoad(taskFn) {
    return new Promise((resolve, reject) => {
      const run = () => {
        activeLoads++;
        Promise.resolve()
          .then(taskFn)
          .then(resolve, reject)
          .finally(() => {
            activeLoads = Math.max(0, activeLoads - 1);
            if (loadQueue.length > 0) {
              const next = loadQueue.shift();
              setTimeout(next, REMOTE_STAGGER_MS);
            }
          });
      };
      if (activeLoads < MAX_CONCURRENT_LOADS) {
        run();
      } else {
        loadQueue.push(run);
      }
    });
  }

  function loadExhibitImageWithFallback(exhibit, options = {}) {
    if (!exhibit) {
      return Promise.resolve({ ok: false, reason: "missing-exhibit" });
    }
    const cacheKey =
      exhibit.id || exhibit.localImagePath || exhibit.imageUrl || "";
    if (cacheKey && imageCache.has(cacheKey)) {
      return imageCache.get(cacheKey);
    }

    const localTimeoutMs =
      typeof options.localTimeoutMs === "number" ? options.localTimeoutMs : 8000;
    const remoteTimeoutMs =
      typeof options.remoteTimeoutMs === "number"
        ? options.remoteTimeoutMs
        : 4000;

    const promise = (async () => {
      // Bước 1: Ưu tiên nạp thẳng ảnh local ngay lập tức nếu có khai báo localImagePath (không qua hàng đợi & không fetch images/manifest.json)
      if (exhibit.localImagePath) {
        try {
          const localRes = await tryLoadSingleImage(
            exhibit.localImagePath,
            localTimeoutMs,
            false,
          );
          return {
            ok: true,
            sourceType: "local",
            img: localRes.img,
            src: localRes.src,
          };
        } catch (_) {
          // Fallback sang URL dự phòng từ Wikimedia nếu ảnh local không nạp được
        }
      }

      // Bước 2: Nạp ảnh tư liệu nguồn mở CORS-friendly có xếp hàng + tái sử dụng URL giống nhau
      if (exhibit.imageUrl) {
        try {
          let remotePromise = remoteUrlCache.get(exhibit.imageUrl);
          if (!remotePromise) {
            remotePromise = enqueueRemoteLoad(() =>
              tryLoadSingleImage(exhibit.imageUrl, remoteTimeoutMs, true),
            );
            remoteUrlCache.set(exhibit.imageUrl, remotePromise);
          }
          const remoteRes = await remotePromise;
          return {
            ok: true,
            sourceType: "remote",
            img: remoteRes.img,
            src: remoteRes.src,
          };
        } catch (err) {
          remoteUrlCache.delete(exhibit.imageUrl);
          return {
            ok: false,
            reason: err && err.message ? err.message : "load-failed",
          };
        }
      }

      return { ok: false, reason: "no-image-configured" };
    })();

    if (cacheKey) {
      imageCache.set(cacheKey, promise);
      promise.then(
        (res) => {
          if (!res || !res.ok) {
            imageCache.delete(cacheKey);
          }
        },
        () => {
          imageCache.delete(cacheKey);
        },
      );
    }
    return promise;
  }

  function clearImageCache() {
    imageCache.clear();
    remoteUrlCache.clear();
    localManifestPromise = null;
  }

  return {
    roundedRectPath,
    fillCard,
    drawCenterLines,
    drawBlueprintGrid,
    drawExhibitInfographic,
    drawLoadedPhotoInFrame,
    renderInfographicDataUrl,
    loadExhibitImageWithFallback,
    clearImageCache,
    INFOGRAPHIC_RENDERERS,
  };
})();
