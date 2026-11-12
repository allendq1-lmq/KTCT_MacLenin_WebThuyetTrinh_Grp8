// museum/data.js - Toàn bộ dữ liệu lý luận & thực tiễn KTCT Mác - Lênin từ PHÒNG TRIỂN LÃM 3D
window.MuseumData = (() => {
  const comparisonTableRows = [
    {
      criteria: "1. Mục đích sản xuất tối thượng",
      capitalist:
        "Tối đa hóa giá trị thặng dư và lợi nhuận cho giai cấp tư bản / tập đoàn độc quyền.",
      socialist:
        '"Dân giàu, nước mạnh, dân chủ, công bằng, văn minh"; nâng cao đời sống vật chất và tinh thần của nhân dân.',
    },
    {
      criteria: "2. Cơ sở sở hữu chủ đạo",
      capitalist:
        "Chiếm hữu tư nhân tư bản chủ nghĩa về tư liệu sản xuất giữ vai trò thống trị.",
      socialist:
        "Đa dạng hình thức sở hữu; Kinh tế nhà nước giữ vai trò chủ đạo, Kinh tế tư nhân là động lực quan trọng.",
    },
    {
      criteria: "3. Cơ chế quản lý nền kinh tế",
      capitalist:
        "Nhà nước tư sản can thiệp chịu sự chi phối của các tập đoàn tư bản / tài phiệt.",
      socialist:
        "Nhà nước pháp quyền XHCN của nhân dân, do nhân dân, vì nhân dân dưới sự lãnh đạo của Đảng Cộng sản Việt Nam.",
    },
    {
      criteria: "4. Quan hệ phân phối",
      capitalist:
        "Chủ yếu theo quy mô vốn / tài sản sở hữu, làm sâu sắc phân hóa giàu nghèo.",
      socialist:
        "Phân phối theo lao động, hiệu quả kinh tế, theo vốn đóng góp và qua hệ thống an sinh / phúc lợi xã hội.",
    },
    {
      criteria: "5. Tăng trưởng & Công bằng xã hội",
      capitalist:
        "Đặt tăng trưởng và lợi nhuận lên trên; công bằng xã hội xử lý bị động / sau cùng.",
      socialist:
        "Gắn tăng trưởng kinh tế với tiến bộ, công bằng xã hội và bảo vệ môi trường ngay trong từng chính sách.",
    },
    {
      criteria: "6. Hệ quả đối với môi trường & xã hội",
      capitalist:
        "Dễ dẫn đến khủng hoảng chu kỳ, lãng phí tài nguyên, tàn phá môi trường, chiến tranh / xung đột.",
      socialist:
        "Chủ động khắc phục khuyết tật thị trường, duy trì ổn định vĩ mô, phát triển bền vững và bao trùm.",
    },
  ];

  const comparisonTableHtml = `
    <div class="overflow-x-auto rounded-xl border border-slate-700/80 shadow-inner my-3">
      <table class="w-full text-left border-collapse text-sm sm:text-base">
        <thead>
          <tr class="bg-slate-800 text-amber-400 border-b border-slate-700">
            <th class="p-3 sm:p-4 font-bold w-1/4">Tiêu chí so sánh</th>
            <th class="p-3 sm:p-4 font-bold w-[37.5%] text-rose-300 border-l border-slate-700/70">Kinh tế thị trường Tư bản chủ nghĩa</th>
            <th class="p-3 sm:p-4 font-bold w-[37.5%] text-emerald-300 border-l border-slate-700/70">Kinh tế thị trường định hướng XHCN Việt Nam</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-800 bg-slate-900/90 text-slate-200">
          ${comparisonTableRows
            .map(
              (r) => `
            <tr class="hover:bg-slate-800/60 transition-colors">
              <td class="p-3 sm:p-4 font-bold text-amber-300 align-top">${r.criteria}</td>
              <td class="p-3 sm:p-4 text-slate-300 border-l border-slate-800 align-top">${r.capitalist}</td>
              <td class="p-3 sm:p-4 text-emerald-100 font-medium border-l border-slate-800 align-top bg-emerald-950/20">${r.socialist}</td>
            </tr>
          `,
            )
            .join("")}
        </tbody>
      </table>
    </div>
  `;

  // ================= PHÒNG 1: TỔNG QUAN VỀ KTTT ĐHXHCN Ở VIỆT NAM =================
  const room1Exhibits = [
    {
      id: "r1-1a",
      room: 1,
      wall: "left",
      x: -8.85,
      y: 2.15,
      z: 2.4,
      rotY: Math.PI / 2,
      camPos: { x: -5.4, y: 1.85, z: 2.4 },
      lookPos: { x: -8.85, y: 2.15, z: 2.4 },
      sectionCode: "1.1a",
      badge: "Mục 1.1a • Khái Niệm Nền Tảng",
      title: "1.1a. Kinh Tế Thị Trường Nói Chung",
      subtitle: "Thành tựu phát triển chung của văn minh nhân loại",
      color: "#0284c7",
      lines: [
        "• Quan hệ SX, trao đổi, phân phối, tiêu dùng đều qua thị trường.",
        "• Vận hành bởi quy luật giá trị, cung – cầu, cạnh tranh, tiền tệ.",
        "• Là thành tựu văn minh nhân loại, không riêng có của CNTB.",
        "• Nhiều mô hình đa dạng (Mỹ, Đức, Nhật Bản, Trung Quốc...).",
      ],
      desc: "Kinh tế thị trường là giai đoạn phát triển cao của kinh tế hàng hóa, là thành tựu chung của văn minh nhân loại chứ không phải sản phẩm riêng có của chủ nghĩa tư bản. Mỗi quốc gia lựa chọn mô hình phù hợp với điều kiện lịch sử của mình.",
      fullHtml: `
        <div class="space-y-4">
          <div class="p-4 rounded-xl bg-sky-950/40 border border-sky-700/50">
            <h4 class="text-amber-400 font-bold text-base sm:text-lg mb-1">Bản chất của Kinh tế thị trường (KTTT)</h4>
            <p class="text-slate-200 leading-relaxed">
              <strong>Kinh tế thị trường</strong> là nền kinh tế trong đó các quan hệ sản xuất, trao đổi, phân phối và tiêu dùng đều được thực hiện thông qua thị trường. Ba vấn đề cơ bản của mọi nền kinh tế (<em>sản xuất cái gì, sản xuất như thế nào, sản xuất cho ai</em>) chủ yếu do cơ chế thị trường quyết định thông qua sự tác động của các quy luật:
            </p>
            <ul class="list-disc list-inside mt-2 space-y-1 text-sky-200 font-medium">
              <li>Quy luật giá trị</li>
              <li>Quy luật cung – cầu</li>
              <li>Quy luật cạnh tranh</li>
              <li>Quy luật lưu thông tiền tệ</li>
            </ul>
          </div>
          <div class="space-y-2 text-slate-200 leading-relaxed">
            <p>
              <strong>Nguồn gốc hình thành:</strong> KTTT là giai đoạn phát triển cao của kinh tế hàng hóa, hình thành khi phân công lao động xã hội và sự tách biệt về kinh tế giữa các chủ thể sản xuất phát triển đến trình độ nhất định.
            </p>
            <p>
              <strong>Thành tựu văn minh nhân loại:</strong> KTTT <em>không phải là sản phẩm riêng có của chủ nghĩa tư bản</em>. Chủ nghĩa tư bản chỉ là chế độ xã hội đã sử dụng và đưa KTTT lên trình độ phát triển cao.
            </p>
          </div>
          <div class="p-4 rounded-xl bg-slate-800/80 border border-slate-700">
            <h4 class="text-white font-bold mb-2">Sự đa dạng mô hình KTTT trên thế giới:</h4>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-sm sm:text-base">
              <div class="p-2.5 rounded-lg bg-slate-900/80 border border-slate-700/60">
                <span class="text-amber-400 font-bold">• Hoa Kỳ:</span> Mô hình kinh tế thị trường tự do.
              </div>
              <div class="p-2.5 rounded-lg bg-slate-900/80 border border-slate-700/60">
                <span class="text-amber-400 font-bold">• CHLB Đức:</span> Mô hình kinh tế thị trường xã hội.
              </div>
              <div class="p-2.5 rounded-lg bg-slate-900/80 border border-slate-700/60">
                <span class="text-amber-400 font-bold">• Nhật Bản, Hàn Quốc:</span> KTTT gắn với vai trò điều phối mạnh của Nhà nước.
              </div>
              <div class="p-2.5 rounded-lg bg-slate-900/80 border border-slate-700/60">
                <span class="text-amber-400 font-bold">• Trung Quốc:</span> KTTT xã hội chủ nghĩa mang đặc sắc Trung Quốc.
              </div>
            </div>
            <p class="mt-2.5 text-xs sm:text-sm text-slate-300 italic">
              ⇒ Không có một mô hình KTTT chung cho mọi quốc gia; mỗi nước phải lựa chọn mô hình phù hợp với điều kiện, mục tiêu và trình độ phát triển của mình.
            </p>
          </div>
        </div>
      `,
    },
    {
      id: "r1-1b",
      room: 1,
      wall: "left",
      x: -8.85,
      y: 2.15,
      z: -2.4,
      rotY: Math.PI / 2,
      camPos: { x: -5.4, y: 1.85, z: -2.4 },
      lookPos: { x: -8.85, y: 2.15, z: -2.4 },
      sectionCode: "1.1b",
      badge: "Mục 1.1b • Mô Hình Tổng Quát",
      title: "1.1b. Khái Niệm KTTT Định Hướng XHCN Việt Nam",
      subtitle: "Văn kiện Đại hội XIII (2021) & Điều 51 Hiến pháp 2013",
      color: "#d97706",
      lines: [
        "• Mô hình kinh tế tổng quát thời kỳ quá độ lên CNXH.",
        "• KTTT hiện đại, hội nhập, vận hành đầy đủ theo quy luật thị trường.",
        "• Nhà nước pháp quyền XHCN quản lý, Đảng CSVN lãnh đạo.",
        "• Hiến pháp 2013 (Điều 51): Kinh tế nhà nước giữ vai trò chủ đạo.",
      ],
      desc: "Theo Văn kiện Đại hội XIII (2021), KTTT định hướng XHCN là nền kinh tế thị trường hiện đại, hội nhập quốc tế, vận hành đầy đủ, đồng bộ theo quy luật thị trường, có sự quản lý của Nhà nước pháp quyền XHCN dưới sự lãnh đạo của Đảng vì mục tiêu 'Dân giàu, nước mạnh, dân chủ, công bằng, văn minh'.",
      fullHtml: `
        <div class="space-y-4">
          <div class="p-4 rounded-xl bg-amber-950/40 border border-amber-600/50">
            <h4 class="text-amber-400 font-bold text-base sm:text-lg mb-1">Định nghĩa cốt lõi</h4>
            <p class="text-slate-100 leading-relaxed">
              <strong>Kinh tế thị trường định hướng xã hội chủ nghĩa</strong> là mô hình kinh tế tổng quát của Việt Nam trong thời kỳ quá độ lên chủ nghĩa xã hội. Đó là nền kinh tế mà sự vận hành tuân theo các quy luật vốn có của kinh tế thị trường; song được Nhà nước định hướng và điều tiết, dưới sự lãnh đạo của Đảng Cộng sản Việt Nam.
            </p>
          </div>
          <div class="p-4 rounded-xl bg-slate-800/90 border border-slate-700 space-y-2">
            <h4 class="text-sky-400 font-bold text-base sm:text-lg">Quan niệm chính thức tại Văn kiện Đại hội XIII (2021):</h4>
            <blockquote class="border-l-4 border-amber-500 pl-3.5 py-1 text-slate-200 italic leading-relaxed">
              “Kinh tế thị trường định hướng xã hội chủ nghĩa là nền kinh tế thị trường hiện đại, hội nhập quốc tế, vận hành đầy đủ, đồng bộ theo các quy luật của kinh tế thị trường, có sự quản lý của Nhà nước pháp quyền xã hội chủ nghĩa, do Đảng Cộng sản Việt Nam lãnh đạo; việc phát triển nền kinh tế này phải bảo đảm định hướng xã hội chủ nghĩa vì mục tiêu <strong>‘dân giàu, nước mạnh, dân chủ, công bằng, văn minh’</strong>, phù hợp với từng giai đoạn phát triển của đất nước.”
            </blockquote>
          </div>
          <div class="p-4 rounded-xl bg-emerald-950/30 border border-emerald-700/50">
            <h4 class="text-emerald-400 font-bold mb-1">Hiến định tại Điều 51 Hiến pháp năm 2013:</h4>
            <p class="text-slate-200 leading-relaxed">
              Xác định nền kinh tế Việt Nam là nền kinh tế thị trường định hướng xã hội chủ nghĩa với <strong>nhiều hình thức sở hữu và nhiều thành phần kinh tế</strong>; kinh tế nhà nước giữ vai trò chủ đạo. Vừa dựa trên nguyên tắc thị trường, vừa được dẫn dắt bởi bản chất ưu việt của chủ nghĩa xã hội.
            </p>
          </div>
        </div>
      `,
    },
    {
      id: "r1-2a",
      room: 1,
      wall: "back",
      x: -5.6,
      y: 2.15,
      z: -6.85,
      rotY: 0,
      camPos: { x: -5.6, y: 1.85, z: -3.5 },
      lookPos: { x: -5.6, y: 2.15, z: -6.85 },
      sectionCode: "1.2a",
      badge: "Mục 1.2a • Trước Năm 1986",
      title: "1.2a. Giai Đoạn Trước Đổi Mới (Trước 1986)",
      subtitle: "Cơ chế kế hoạch hóa tập trung, bao cấp & các bước tìm tòi",
      color: "#64748b",
      lines: [
        "• Kế hoạch hóa tập trung, bao cấp; coi KTTT đối lập CNXH.",
        "• Sau 1975: Triệt tiêu động lực, đình đốn, khủng hoảng KT-XH.",
        "• Đột phá tiền đề: HNTW 6 khóa IV (1979) làm sản xuất 'bung ra'.",
        "• Chỉ thị 100 (1981) khoán nông nghiệp; HNTW 8 khóa V (1985).",
      ],
      desc: "Trước năm 1986, nền kinh tế vận hành theo cơ chế kế hoạch hóa tập trung, quan liêu, bao cấp. Trước khủng hoảng KT-XH sau năm 1975, Đảng đã có những bước tìm tòi đột phá (HNTW 6 khóa IV năm 1979, Chỉ thị 100 năm 1981, HNTW 8 khóa V năm 1985) chuẩn bị tiền đề cho Đổi mới.",
      fullHtml: `
        <div class="space-y-4">
          <div class="p-4 rounded-xl bg-slate-800/90 border border-slate-700">
            <h4 class="text-amber-400 font-bold text-base sm:text-lg mb-1">Đặc trưng cơ chế kế hoạch hóa tập trung, quan liêu, bao cấp</h4>
            <ul class="list-disc list-inside space-y-1.5 text-slate-200 leading-relaxed">
              <li>Kinh tế thị trường bị coi là sản phẩm riêng có của chủ nghĩa tư bản; sản xuất hàng hóa và cơ chế thị trường không được thừa nhận tồn tại khách quan trong thời kỳ quá độ.</li>
              <li>Kế hoạch hóa tập trung được xem là đặc trưng tuyệt đối, thị trường chỉ giữ vai trò thứ yếu.</li>
              <li>Từng phát huy tác dụng tập trung nguồn lực cho tiền tuyến trong chiến tranh, nhưng sau năm 1975 bộc lộ hạn chế nghiêm trọng: <strong>triệt tiêu động lực người lao động, sản xuất đình đốn, lạm phát tăng cao, đất nước lâm vào khủng hoảng kinh tế – xã hội</strong>.</li>
            </ul>
          </div>
          <div class="p-4 rounded-xl bg-amber-950/30 border border-amber-700/50 space-y-2.5">
            <h4 class="text-amber-300 font-bold text-base sm:text-lg">Ba bước tìm tòi, thử nghiệm tiền đề cho Đổi mới:</h4>
            <div class="space-y-2 text-slate-200">
              <div class="p-2.5 rounded-lg bg-slate-900/70 border border-slate-700/60">
                <strong class="text-amber-400">1. Hội nghị Trung ương 6 khóa IV (1979):</strong> Chủ trương khắc phục khuyết điểm trong quản lý kinh tế, làm cho sản xuất <em>“bung ra”</em>.
              </div>
              <div class="p-2.5 rounded-lg bg-slate-900/70 border border-slate-700/60">
                <strong class="text-amber-400">2. Chỉ thị 100-CT/TW của Ban Bí thư (1981):</strong> Thực hiện <em>khoán sản phẩm</em> cuối cùng đến nhóm và người lao động trong hợp tác xã nông nghiệp.
              </div>
              <div class="p-2.5 rounded-lg bg-slate-900/70 border border-slate-700/60">
                <strong class="text-amber-400">3. Hội nghị Trung ương 8 khóa V (1985):</strong> Chủ trương dứt khoát xóa bỏ cơ chế tập trung quan liêu, bao cấp, chuyển sang hạch toán kinh doanh xã hội chủ nghĩa.
              </div>
            </div>
          </div>
        </div>
      `,
    },
    {
      id: "r1-2b",
      room: 1,
      wall: "back",
      x: 0,
      y: 2.15,
      z: -6.85,
      rotY: 0,
      camPos: { x: 0, y: 1.85, z: -3.5 },
      lookPos: { x: 0, y: 2.15, z: -6.85 },
      sectionCode: "1.2b",
      badge: "Mục 1.2b • Giai Đoạn 1986 – 2000",
      title: "1.2b. Từ Đại Hội VI Đến Đại Hội VIII (1986–2000)",
      subtitle: "Đổi mới tư duy kinh tế & thừa nhận sản xuất hàng hóa",
      color: "#ea580c",
      lines: [
        "• Đại hội VI (12/1986): Đổi mới toàn diện, kinh tế nhiều thành phần.",
        "• Đại hội VII (1991): Cương lĩnh quá độ, cơ chế thị trường có quản lý.",
        "• Đại hội VIII (1996): SX hàng hóa không đối lập với CNXH.",
        "• Nhìn nhận KTTT như một cơ chế, công cụ quản lý kinh tế.",
      ],
      desc: "Từ Đại hội VI (1986) đến Đại hội VIII (1996), Đảng khởi xướng công cuộc Đổi mới toàn diện, xóa bỏ cơ chế bao cấp, thừa nhận kinh tế hàng hóa nhiều thành phần vận hành theo cơ chế thị trường có sự quản lý của Nhà nước và khẳng định sản xuất hàng hóa không đối lập với CNXH.",
      fullHtml: `
        <div class="space-y-3.5">
          <div class="p-3.5 rounded-xl bg-slate-800/90 border border-slate-700">
            <h4 class="text-amber-400 font-bold text-base sm:text-lg">1. Đại hội VI (tháng 12/1986) & Hội nghị TW 6 khóa VI (3/1989)</h4>
            <p class="text-slate-200 mt-1 leading-relaxed">
              Mở đầu công cuộc Đổi mới toàn diện, lấy <strong>đổi mới tư duy kinh tế làm trọng tâm</strong>. Chủ trương khôi phục nền kinh tế nhiều thành phần, sử dụng đúng đắn quan hệ hàng hóa – tiền tệ, xóa bỏ cơ chế tập trung quan liêu, bao cấp. Hội nghị TW 6 khóa VI tiếp tục cụ thể hóa phát triển kinh tế nhiều thành phần, giải phóng mọi năng lực sản xuất.
            </p>
          </div>
          <div class="p-3.5 rounded-xl bg-slate-800/90 border border-slate-700">
            <h4 class="text-sky-400 font-bold text-base sm:text-lg">2. Đại hội VII (năm 1991) – Cương lĩnh xây dựng đất nước</h4>
            <p class="text-slate-200 mt-1 leading-relaxed">
              Xác định chủ trương chiến lược lâu dài trong suốt thời kỳ quá độ: phát triển <strong>nền kinh tế hàng hóa nhiều thành phần theo định hướng xã hội chủ nghĩa, vận hành theo cơ chế thị trường có sự quản lý của Nhà nước</strong>.
            </p>
          </div>
          <div class="p-3.5 rounded-xl bg-slate-800/90 border border-slate-700">
            <h4 class="text-emerald-400 font-bold text-base sm:text-lg">3. Đại hội VIII (năm 1996) – Bước tiến nhận thức mới</h4>
            <p class="text-slate-200 mt-1 leading-relaxed">
              Khẳng định <strong>sản xuất hàng hóa không đối lập với chủ nghĩa xã hội</strong>, mà là thành tựu của văn minh nhân loại, tồn tại khách quan và cần thiết cho công cuộc xây dựng CNXH.
            </p>
            <p class="text-amber-300/90 text-xs sm:text-sm italic mt-2">
              * Đánh giá giai đoạn 1986–2000: Đã thừa nhận kinh tế hàng hóa nhiều thành phần và cơ chế thị trường, nhưng KTTT chủ yếu vẫn được nhìn nhận như một cơ chế/công cụ quản lý, chưa được xác định là mô hình kinh tế tổng quát.
            </p>
          </div>
        </div>
      `,
    },
    {
      id: "r1-2c",
      room: 1,
      wall: "back",
      x: 5.6,
      y: 2.15,
      z: -6.85,
      rotY: 0,
      camPos: { x: 5.6, y: 1.85, z: -3.5 },
      lookPos: { x: 5.6, y: 2.15, z: -6.85 },
      sectionCode: "1.2c",
      badge: "Mục 1.2c • Giai Đoạn 2001 – Nay (ĐH XIV)",
      title: "1.2c. Từ Đại Hội IX (2001) Đến Đại Hội XIV (2026)",
      subtitle: "Xác lập mô hình tổng quát, NQ 68-NQ/TW & Đại hội XIV",
      color: "#dc2626",
      lines: [
        "• ĐH IX (2001): Chính thức xác lập mô hình tổng quát KTTT ĐHXHCN.",
        "• ĐH X – XIII (2006–2021): Hoàn thiện thể chế hiện đại, hội nhập.",
        "• NQ 68-NQ/TW (2025): Đến 2030 KTTN là động lực quan trọng nhất.",
        "• Đại hội XIV (01/2026): Hoàn thiện đồng bộ, vận hành thông suốt.",
      ],
      desc: "Từ Đại hội IX (2001) xác lập KTTT ĐHXHCN là mô hình tổng quát, qua các kỳ Đại hội X, XI, XII, XIII đến 4 Nghị quyết chiến lược (57, 59, 66, 68-NQ/TW) và Đại hội XIV (tháng 01/2026), tư duy lý luận về thể chế KTTT ĐHXHCN ngày càng hoàn chỉnh, hiện đại.",
      fullHtml: `
        <div class="space-y-3">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-sm sm:text-base">
            <div class="p-3 rounded-xl bg-slate-800/90 border border-slate-700">
              <span class="text-amber-400 font-bold block">• Đại hội IX (2001):</span>
              Lần đầu tiên chính thức xác định KTTT ĐHXHCN là <strong>mô hình kinh tế tổng quát</strong> của nước ta trong thời kỳ quá độ lên CNXH.
            </div>
            <div class="p-3 rounded-xl bg-slate-800/90 border border-slate-700">
              <span class="text-amber-400 font-bold block">• Đại hội X (2006) & XI (2011):</span>
              Làm rõ mục tiêu dân giàu, nước mạnh, dân chủ, công bằng, văn minh; Cương lĩnh 2011 khẳng định các thành phần kinh tế bình đẳng trước pháp luật.
            </div>
            <div class="p-3 rounded-xl bg-slate-800/90 border border-slate-700">
              <span class="text-amber-400 font-bold block">• Đại hội XII (2016) & NQ TW5 (2017):</span>
              Nêu quan niệm toàn diện về KTTT hiện đại, hội nhập quốc tế; xác định <strong>kinh tế tư nhân là một động lực quan trọng</strong>.
            </div>
            <div class="p-3 rounded-xl bg-slate-800/90 border border-slate-700">
              <span class="text-amber-400 font-bold block">• Đại hội XIII (2021):</span>
              Xác định rõ vai trò từng thành phần kinh tế; bổ sung <strong>nhân tố xã hội</strong> bên cạnh Nhà nước và thị trường trong vận hành kinh tế.
            </div>
          </div>
          <div class="p-3.5 rounded-xl bg-rose-950/40 border border-rose-600/50 space-y-2">
            <h4 class="text-amber-300 font-bold text-base sm:text-lg">Bước ngoặt chiến lược 2024 – 2026:</h4>
            <p class="text-slate-200 leading-relaxed">
              • <strong>Bốn Nghị quyết chiến lược của Bộ Chính trị (số 57, 59, 66 và 68):</strong> Đặc biệt, <strong>Nghị quyết số 68-NQ/TW</strong> đặt mục tiêu đến năm 2030 <em>kinh tế tư nhân là một động lực quan trọng nhất của nền kinh tế quốc gia</em>.
            </p>
            <p class="text-slate-200 leading-relaxed">
              • <strong>Đại hội XIV của Đảng (tháng 01/2026):</strong> Khẳng định yêu cầu hoàn thiện đồng bộ thể chế KTTT ĐHXHCN, bảo đảm thị trường vận hành đầy đủ, thông suốt, đồng thời giữ vững định hướng XHCN thông qua vai trò quản lý của Nhà nước và sự lãnh đạo của Đảng.
            </p>
          </div>
        </div>
      `,
    },
    {
      id: "r1-3",
      room: 1,
      wall: "right",
      x: 8.85,
      y: 2.15,
      z: -3.2,
      rotY: -Math.PI / 2,
      camPos: { x: 5.4, y: 1.85, z: -3.2 },
      lookPos: { x: 8.85, y: 2.15, z: -3.2 },
      sectionCode: "1.3",
      badge: "Mục 1.3 • Ba Luận Điểm & Số Liệu 2024",
      title: "1.3. Tính Tất Yếu Khách Quan Của KTTT ĐHXHCN",
      subtitle: "Quy luật lịch sử, thực tiễn GDP 476,3 tỷ USD & mục tiêu XHCN",
      color: "#059669",
      lines: [
        "• 1. Phù hợp quy luật khách quan & lý luận 'khâu trung gian'.",
        "• 2. Ưu việt thực tiễn (2024): GDP ~476,3 tỷ USD, hạng 33 thế giới.",
        "• Đã ký 17 FTA (>60 đối tác), 73 quốc gia công nhận KTTT.",
        "• 3. Phù hợp nguyện vọng nhân dân, đặt con người làm trung tâm.",
      ],
      desc: "Lựa chọn KTTT ĐHXHCN là tất yếu khách quan dựa trên 3 căn cứ: (1) Phù hợp quy luật phát triển sản xuất hàng hóa và hội nhập; (2) Tính ưu việt thúc đẩy LLSX đã được kiểm nghiệm (năm 2024 GDP đạt ~476,3 tỷ USD, hạng 33 thế giới, 17 FTA, 73 nước công nhận); (3) Phù hợp mục tiêu XHCN và nguyện vọng nhân dân.",
      fullHtml: `
        <div class="space-y-3.5">
          <div class="p-3.5 rounded-xl bg-slate-800/90 border border-slate-700">
            <h4 class="text-amber-400 font-bold text-base sm:text-lg">Thứ nhất: Phù hợp quy luật và xu thế phát triển khách quan</h4>
            <p class="text-slate-200 mt-1 leading-relaxed">
              Chừng nào còn phân công lao động xã hội và sự tách biệt kinh tế giữa các chủ thể thì KTTT còn tồn tại khách quan. Việt Nam quá độ lên CNXH bỏ qua chế độ TBCN nhưng kế thừa thành tựu KTTT nhân loại — bổ sung lý luận về <strong>“khâu trung gian”</strong> phù hợp quá trình lịch sử – tự nhiên và phân công lao động quốc tế.
            </p>
          </div>
          <div class="p-4 rounded-xl bg-emerald-950/40 border border-emerald-600/50">
            <h4 class="text-emerald-400 font-bold text-base sm:text-lg mb-2">Thứ hai: Tính ưu việt thúc đẩy LLSX & Minh chứng thực tiễn năm 2024</h4>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center my-2">
              <div class="p-2.5 rounded-lg bg-slate-900/90 border border-emerald-700/50">
                <span class="text-xl sm:text-2xl font-black text-amber-400 block">476,3 tỷ $</span>
                <span class="text-xs text-slate-300">Quy mô GDP 2024 (Hạng 33 thế giới)</span>
              </div>
              <div class="p-2.5 rounded-lg bg-slate-900/90 border border-emerald-700/50">
                <span class="text-xl sm:text-2xl font-black text-emerald-400 block">~4.700 $</span>
                <span class="text-xs text-slate-300">GDP bình quân đầu người 2024</span>
              </div>
              <div class="p-2.5 rounded-lg bg-slate-900/90 border border-emerald-700/50">
                <span class="text-xl sm:text-2xl font-black text-sky-400 block">17 FTA</span>
                <span class="text-xs text-slate-300">Với hơn 60 đối tác toàn cầu</span>
              </div>
              <div class="p-2.5 rounded-lg bg-slate-900/90 border border-emerald-700/50">
                <span class="text-xl sm:text-2xl font-black text-purple-400 block">73 Nước</span>
                <span class="text-xs text-slate-300">Công nhận VN là nền KTTT</span>
              </div>
            </div>
          </div>
          <div class="p-3.5 rounded-xl bg-slate-800/90 border border-slate-700">
            <h4 class="text-sky-400 font-bold text-base sm:text-lg">Thứ ba: Phù hợp mục tiêu XHCN và nguyện vọng nhân dân</h4>
            <p class="text-slate-200 mt-1 leading-relaxed">
              Khắc phục mặt trái tự phát của KTTT TBCN (khủng hoảng, bất bình đẳng, ô nhiễm môi trường). Đặt thị trường dưới sự lãnh đạo của Đảng và quản lý của Nhà nước pháp quyền XHCN; lấy con người làm trung tâm, gắn tăng trưởng với tiến bộ và công bằng xã hội.
            </p>
          </div>
        </div>
      `,
    },
    {
      id: "r1-4a",
      room: 1,
      wall: "right",
      x: 8.85,
      y: 2.15,
      z: 0.2,
      rotY: -Math.PI / 2,
      camPos: { x: 5.4, y: 1.85, z: 0.2 },
      lookPos: { x: 8.85, y: 2.15, z: 0.2 },
      sectionCode: "1.4a",
      badge: "Mục 1.4a • Quản Trị Quốc Gia",
      title: "1.4a. Vai Trò Quản Lý Vĩ Mô Của Nhà Nước",
      subtitle: "Kiến tạo phát triển, giữ vững cân đối lớn & an ninh kinh tế",
      color: "#0284c7",
      lines: [
        "• Hoàn thiện hệ thống pháp luật tương thích cam kết quốc tế.",
        "• Bảo đảm ổn định vĩ mô, cạnh tranh lành mạnh & cân đối lớn.",
        "• Thúc đẩy khởi nghiệp, đổi mới sáng tạo & mô hình kinh doanh mới.",
        "• Đa phương hóa quan hệ kinh tế, chủ động phòng vệ thương mại.",
      ],
      desc: "Nhà nước pháp quyền XHCN chủ động hoàn thiện pháp luật, giữ vững ổn định kinh tế vĩ mô, khuyến khích khởi nghiệp đổi mới sáng tạo, phát huy vai trò các tổ chức xã hội, đa phương hóa kinh tế quốc tế và bảo vệ an ninh kinh tế.",
      fullHtml: `
        <div class="space-y-3.5">
          <div class="p-4 rounded-xl bg-sky-950/40 border border-sky-700/50">
            <h4 class="text-amber-400 font-bold text-base sm:text-lg mb-2">Chức năng quản lý vĩ mô của Nhà nước trong KTTT ĐHXHCN:</h4>
            <ul class="space-y-2.5 text-slate-200 leading-relaxed">
              <li><strong class="text-sky-300">1. Hoàn thiện thể chế pháp luật & ổn định vĩ mô:</strong> Chủ động hoàn thiện hệ thống pháp luật phù hợp các cam kết quốc tế; bảo đảm ổn định kinh tế vĩ mô, bảo vệ cạnh tranh lành mạnh, giữ vững các cân đối lớn và an ninh kinh tế.</li>
              <li><strong class="text-sky-300">2. Kiến tạo môi trường kinh doanh & đổi mới sáng tạo:</strong> Nâng cao chất lượng, hiệu quả quản trị quốc gia; tạo môi trường thuận lợi thúc đẩy doanh nghiệp, khuyến khích khởi nghiệp, đổi mới sáng tạo và các mô hình kinh doanh mới.</li>
              <li><strong class="text-sky-300">3. Phát huy vai trò xã hội:</strong> Phát huy vai trò của các tổ chức xã hội, nghề nghiệp trong tham gia hình thành và điều tiết các quan hệ kinh tế thị trường.</li>
              <li><strong class="text-sky-300">4. Hội nhập chủ động & phòng vệ thương mại:</strong> Đẩy mạnh đa phương hóa, đa dạng hóa quan hệ kinh tế quốc tế, tránh lệ thuộc vào một thị trường hay một đối tác; nâng cao khả năng chống chịu trước biến động thế giới và hoàn thiện hệ thống phòng vệ bảo vệ thị trường trong nước.</li>
            </ul>
          </div>
        </div>
      `,
    },
    {
      id: "r1-4b",
      room: 1,
      wall: "right",
      x: 8.85,
      y: 2.15,
      z: 3.6,
      rotY: -Math.PI / 2,
      camPos: { x: 5.4, y: 1.85, z: 3.6 },
      lookPos: { x: 8.85, y: 2.15, z: 3.6 },
      sectionCode: "1.4b",
      badge: "Mục 1.4b • Hạt Nhân Lãnh Đạo",
      title: "1.4b. Bốn Vai Trò Lãnh Đạo Của Đảng CSVN",
      subtitle: "Lãnh đạo toàn diện, định hướng lý luận & kiểm soát quyền lực",
      color: "#7c3aed",
      lines: [
        "• a. Phát triển tư duy lý luận & đề ra đường lối, chiến lược.",
        "• b. Định hướng giữ vững mục tiêu XHCN, gắn tăng trưởng & công bằng.",
        "• c. Lãnh đạo xây dựng và hoàn thiện đồng bộ thể chế kinh tế.",
        "• d. Công tác cán bộ, kiểm tra, giám sát & phòng chống tham nhũng.",
      ],
      desc: "Đảng Cộng sản Việt Nam giữ vai trò lãnh đạo toàn diện đối với nền KTTT định hướng XHCN thông qua 4 nội dung cốt lõi: phát triển lý luận chiến lược, giữ vững mục tiêu XHCN, lãnh đạo hoàn thiện thể chế và tăng cường kiểm tra, giám sát, phòng chống tham nhũng.",
      fullHtml: `
        <div class="space-y-3">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div class="p-3.5 rounded-xl bg-slate-800/90 border border-purple-700/50">
              <h4 class="text-amber-400 font-bold mb-1">a. Phát triển tư duy lý luận & đề ra đường lối, chiến lược</h4>
              <p class="text-slate-200 text-sm sm:text-base leading-relaxed">
                Đảng là lực lượng tiên phong đúc kết thực tiễn, chuyển từ cơ chế mệnh lệnh hành chính sang KTTT ĐHXHCN; đề ra cương lĩnh, chiến lược phát triển KT-XH qua các kỳ Đại hội.
              </p>
            </div>
            <div class="p-3.5 rounded-xl bg-slate-800/90 border border-purple-700/50">
              <h4 class="text-amber-400 font-bold mb-1">b. Định hướng và giữ vững mục tiêu XHCN</h4>
              <p class="text-slate-200 text-sm sm:text-base leading-relaxed">
                Ngăn ngừa tự phát, chệch hướng sang TBCN; bảo đảm tăng trưởng kinh tế luôn đi đôi với tiến bộ, công bằng xã hội, văn hóa, giáo dục, y tế và bảo vệ môi trường.
              </p>
            </div>
            <div class="p-3.5 rounded-xl bg-slate-800/90 border border-purple-700/50">
              <h4 class="text-amber-400 font-bold mb-1">c. Lãnh đạo xây dựng & hoàn thiện thể chế</h4>
              <p class="text-slate-200 text-sm sm:text-base leading-relaxed">
                Lãnh đạo Nhà nước thể chế hóa quan điểm chính trị thành pháp luật, chính sách đồng bộ; xác định rõ KT nhà nước chủ đạo, KT tư nhân là động lực quan trọng, cạnh tranh bình đẳng.
              </p>
            </div>
            <div class="p-3.5 rounded-xl bg-slate-800/90 border border-purple-700/50">
              <h4 class="text-amber-400 font-bold mb-1">d. Công tác cán bộ, kiểm tra, giám sát & chỉnh đốn Đảng</h4>
              <p class="text-slate-200 text-sm sm:text-base leading-relaxed">
                Bố trí cán bộ đủ phẩm chất và năng lực vào vị trí trọng yếu; tăng cường kiểm tra, giám sát, phòng chống tham nhũng, lãng phí, tiêu cực trong lĩnh vực kinh tế – tài chính.
              </p>
            </div>
          </div>
        </div>
      `,
    },
  ];

  // ================= PHÒNG 2: NĂM ĐẶC TRƯNG CƠ BẢN CỦA KTTT ĐHXHCN =================
  const room2Center = {
    id: "r2-a",
    room: 2,
    x: 0,
    y: 1.5,
    z: -0.8,
    camPos: { x: 0, y: 1.85, z: 2.5 },
    lookPos: { x: 0, y: 1.35, z: -0.8 },
    sectionCode: "2.a",
    badge: "Phòng 2 • Bệ Trung Tâm (Mục 2.a)",
    title: "2.a. Những Đặc Điểm Chung Với Các Nền KTTT",
    subtitle: "Tính phổ biến của kinh tế thị trường và đặc điểm giai đoạn Việt Nam",
    color: "#f59e0b",
    lines: [
      "• Chủ thể kinh tế độc lập, tự chủ trong sản xuất kinh doanh.",
      "• Giá cả cơ bản do cung – cầu quyết định; cạnh tranh là động lực.",
      "• Hệ thống thị trường đồng bộ; nền kinh tế mở hội nhập quốc tế.",
      "• Nhà nước quản lý vĩ mô khắc phục các khuyết tật thị trường.",
    ],
    desc: "Như mọi nền KTTT hiện đại, nền kinh tế Việt Nam có các chủ thể độc lập tự chủ, giá cả do cung – cầu quyết định, cạnh tranh là động lực, hệ thống thị trường mở hội nhập quốc tế và Nhà nước quản lý vĩ mô. Do xuất phát từ sản xuất nhỏ nên việc tiếp tục hoàn thiện đồng bộ thể chế là yêu cầu tất yếu.",
    fullHtml: `
      <div class="space-y-4">
        <div class="p-4 rounded-xl bg-amber-950/40 border border-amber-600/50">
          <h4 class="text-amber-400 font-bold text-base sm:text-lg mb-2">a) Những đặc điểm chung với các nền kinh tế thị trường thế giới</h4>
          <ul class="list-disc list-inside space-y-2 text-slate-200 leading-relaxed">
            <li><strong>Chủ thể kinh tế độc lập, tự chủ:</strong> Tự chủ trong quyết định sản xuất, kinh doanh.</li>
            <li><strong>Cơ chế giá cả & cạnh tranh:</strong> Giá cả về cơ bản do quan hệ cung – cầu trên thị trường quyết định; cạnh tranh là động lực thúc đẩy đổi mới công nghệ, nâng cao năng suất và hiệu quả.</li>
            <li><strong>Hệ thống thị trường đồng bộ & mở cửa:</strong> Từng bước hình thành đồng bộ thị trường hàng hóa, dịch vụ, vốn, lao động, khoa học – công nghệ, bất động sản; nền kinh tế mở gắn với hội nhập quốc tế.</li>
            <li><strong>Vai trò điều tiết vĩ mô:</strong> Nhà nước thực hiện chức năng quản lý vĩ mô nhằm khắc phục những khuyết tật của thị trường.</li>
          </ul>
        </div>
        <div class="p-4 rounded-xl bg-slate-800/90 border border-slate-700">
          <h4 class="text-sky-400 font-bold mb-1">Đặc điểm mang tính giai đoạn ở Việt Nam:</h4>
          <p class="text-slate-200 leading-relaxed">
            Xuất phát từ một nền kinh tế chủ yếu là sản xuất nhỏ, trình độ phát triển còn thấp, một số loại thị trường chưa được hình thành đầy đủ, đồng bộ. Đây là đặc điểm mang tính giai đoạn, đặt ra yêu cầu phải tiếp tục hoàn thiện thể chế KTTT định hướng XHCN.
          </p>
        </div>
      </div>
    `,
  };

  const room2Pillars = [
    {
      id: "r2-b1",
      room: 2,
      angleDeg: 180,
      sectionCode: "2.b.1",
      badge: "Cột Trụ 01 • Đặc Trưng Mục Tiêu",
      title: "Đặc Trưng 1: Về Mục Tiêu Phát Triển",
      subtitle: "Dân giàu, nước mạnh, dân chủ, công bằng, văn minh",
      color: "#d97706",
      lines: [
        "• Phát triển LLSX, xây dựng cơ sở vật chất – kỹ thuật CNXH.",
        "• Nâng cao đời sống nhân dân: Dân giàu, nước mạnh, văn minh.",
        "• Phản ánh mục tiêu chính trị - xã hội dưới sự lãnh đạo của Đảng.",
        "• Gắn phát triển LLSX hiện đại với xây dựng QHSX tiến bộ.",
      ],
      desc: "Đặc trưng 1 - Về mục tiêu: Hướng tới phát triển lực lượng sản xuất, xây dựng cơ sở vật chất – kỹ thuật của CNXH; nâng cao đời sống nhân dân, thực hiện 'dân giàu, nước mạnh, dân chủ, công bằng, văn minh', gắn liền với xây dựng quan hệ sản xuất tiến bộ, phù hợp.",
      fullHtml: `
        <div class="space-y-3.5 text-slate-200 leading-relaxed">
          <div class="p-4 rounded-xl bg-amber-950/40 border border-amber-600/50">
            <h4 class="text-amber-400 font-bold text-base sm:text-lg mb-1">1. Về mục tiêu của KTTT định hướng XHCN</h4>
            <p>
              Kinh tế thị trường định hướng XHCN hướng tới <strong>phát triển lực lượng sản xuất, xây dựng cơ sở vật chất – kỹ thuật của chủ nghĩa xã hội; nâng cao đời sống nhân dân, thực hiện “dân giàu, nước mạnh, dân chủ, công bằng, văn minh”</strong>.
            </p>
          </div>
          <p>
            • Mục tiêu đó bắt nguồn từ cơ sở kinh tế – xã hội của thời kỳ quá độ lên chủ nghĩa xã hội và là sự phản ánh mục tiêu chính trị – xã hội mà nhân dân ta đang phấn đấu dưới sự lãnh đạo của Đảng Cộng sản Việt Nam.
          </p>
          <p>
            • Đi đôi với việc phát triển lực lượng sản xuất hiện đại, quá trình phát triển kinh tế thị trường ở Việt Nam còn gắn với <strong>xây dựng quan hệ sản xuất tiến bộ, phù hợp</strong> nhằm ngày càng hoàn thiện cơ sở kinh tế – xã hội của chủ nghĩa xã hội.
          </p>
        </div>
      `,
    },
    {
      id: "r2-b2",
      room: 2,
      angleDeg: 225,
      sectionCode: "2.b.2",
      badge: "Cột Trụ 02 • Sở Hữu & Thành Phần KT",
      title: "Đặc Trưng 2: Quan Hệ Sở Hữu & Thành Phần KT",
      subtitle: "Nội dung kinh tế - pháp lý; KT nhà nước chủ đạo, KT tư nhân động lực",
      color: "#0284c7",
      lines: [
        "• Sở hữu gồm hai mặt: Nội dung kinh tế & Nội dung pháp lý.",
        "• Đa dạng hình thức sở hữu, nhiều thành phần kinh tế bình đẳng.",
        "• KT nhà nước giữ vai trò chủ đạo; KT tư nhân là động lực quan trọng.",
        "• KT nhà nước + tập thể + tư nhân là nòng cốt độc lập, tự chủ.",
      ],
      desc: "Đặc trưng 2 - Về quan hệ sở hữu và thành phần kinh tế: Sở hữu bao hàm nội dung kinh tế và nội dung pháp lý. Việt Nam phát triển nhiều hình thức sở hữu, nhiều thành phần kinh tế bình đẳng trước pháp luật; trong đó KT nhà nước giữ vai trò chủ đạo, KT tư nhân là động lực quan trọng.",
      fullHtml: `
        <div class="space-y-3.5 text-slate-200 leading-relaxed">
          <div class="p-4 rounded-xl bg-sky-950/40 border border-sky-700/50 space-y-2">
            <h4 class="text-sky-300 font-bold text-base sm:text-lg">a) Bản chất của Sở hữu (Kinh tế & Pháp lý)</h4>
            <p>
              <strong>Sở hữu</strong> là quan hệ giữa người với người trong quá trình sản xuất và tái sản xuất xã hội trên cơ sở chiếm hữu nguồn lực và kết quả lao động tương ứng (bao gồm: <em>chủ thể sở hữu, đối tượng sở hữu, lợi ích từ đối tượng sở hữu</em>).
            </p>
            <ul class="list-disc list-inside space-y-1 text-slate-200">
              <li><strong class="text-amber-400">Về nội dung kinh tế:</strong> Sở hữu là điều kiện của sản xuất, là lợi ích kinh tế mà chủ thể sở hữu được thụ hưởng.</li>
              <li><strong class="text-amber-400">Về nội dung pháp lý:</strong> Thể hiện những quy định mang tính pháp luật về quyền hạn và nghĩa vụ của chủ thể sở hữu.</li>
            </ul>
          </div>
          <div class="p-4 rounded-xl bg-slate-800/90 border border-slate-700 space-y-2">
            <h4 class="text-amber-400 font-bold text-base sm:text-lg">b) Cơ cấu kinh tế nhiều thành phần ở Việt Nam</h4>
            <ul class="list-disc list-inside space-y-1.5">
              <li><strong>Kinh tế nhà nước</strong> giữ vai trò <strong>chủ đạo</strong>.</li>
              <li><strong>Kinh tế tư nhân</strong> là một <strong>động lực quan trọng</strong>.</li>
              <li><strong>Kinh tế nhà nước, kinh tế tập thể cùng với kinh tế tư nhân</strong> là <strong>nòng cốt</strong> để phát triển một nền kinh tế độc lập, tự chủ.</li>
              <li>Các chủ thể thuộc các thành phần kinh tế <strong>bình đẳng, hợp tác, cạnh tranh</strong> cùng phát triển theo pháp luật.</li>
            </ul>
          </div>
        </div>
      `,
    },
    {
      id: "r2-b3",
      room: 2,
      angleDeg: 270,
      sectionCode: "2.b.3",
      badge: "Cột Trụ 03 • Quan Hệ Quản Lý",
      title: "Đặc Trưng 3: Quan Hệ Quản Lý Nền Kinh Tế",
      subtitle: "Nhà nước pháp quyền XHCN dưới sự lãnh đạo của Đảng CSVN",
      color: "#dc2626",
      lines: [
        "• Nhà nước pháp quyền XHCN của dân, do dân, vì dân quản lý.",
        "• Đặt dưới sự lãnh đạo của Đảng và sự giám sát của nhân dân.",
        "• Đảng lãnh đạo qua cương lĩnh, đường lối, quyết sách lớn.",
        "• Nhà nước quản lý bằng pháp luật, quy hoạch, tôn trọng thị trường.",
      ],
      desc: "Đặc trưng 3 - Về quan hệ quản lý: Nhà nước quản lý nền kinh tế là Nhà nước pháp quyền XHCN của nhân dân, do nhân dân, vì nhân dân dưới sự lãnh đạo của Đảng Cộng sản và chịu sự làm chủ, giám sát của nhân dân; quản lý bằng pháp luật, chiến lược, quy hoạch trên cơ sở tôn trọng nguyên tắc thị trường.",
      fullHtml: `
        <div class="space-y-3.5 text-slate-200 leading-relaxed">
          <div class="p-4 rounded-xl bg-rose-950/40 border border-rose-700/50">
            <h4 class="text-rose-300 font-bold text-base sm:text-lg mb-1">Bản chất đặc trưng trong cơ chế quản lý ở Việt Nam</h4>
            <p>
              Ở mọi quốc gia hiện đại, nhà nước đều can thiệp để khắc phục khuyết tật thị trường. Đặc trưng riêng của Việt Nam là: <strong>Nhà nước quản lý và thực hành cơ chế quản lý là Nhà nước pháp quyền xã hội chủ nghĩa của nhân dân, do nhân dân, vì nhân dân dưới sự lãnh đạo của Đảng Cộng sản, chịu sự làm chủ và giám sát của nhân dân.</strong>
            </p>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div class="p-3.5 rounded-xl bg-slate-800/90 border border-slate-700">
              <h5 class="text-amber-400 font-bold mb-1">Vai trò của Đảng Cộng sản</h5>
              <p class="text-sm sm:text-base">
                Lãnh đạo nền KTTT định hướng XHCN thông qua cương lĩnh, đường lối phát triển KT-XH và các chủ trương, quyết sách lớn trong từng thời kỳ phát triển.
              </p>
            </div>
            <div class="p-3.5 rounded-xl bg-slate-800/90 border border-slate-700">
              <h5 class="text-sky-400 font-bold mb-1">Vai trò của Nhà nước pháp quyền</h5>
              <p class="text-sm sm:text-base">
                Quản lý thông qua pháp luật, chiến lược, kế hoạch, quy hoạch, cơ chế chính sách và công cụ kinh tế trên cơ sở tôn trọng nguyên tắc thị trường.
              </p>
            </div>
          </div>
        </div>
      `,
    },
    {
      id: "r2-b4",
      room: 2,
      angleDeg: 315,
      sectionCode: "2.b.4",
      badge: "Cột Trụ 04 • Quan Hệ Phân Phối",
      title: "Đặc Trưng 4: Quan Hệ Phân Phối (Đầu Vào & Đầu Ra)",
      subtitle: "Công bằng cơ hội tiếp cận nguồn lực & đa dạng hình thức phân phối",
      color: "#059669",
      lines: [
        "• Đầu vào: Phân phối công bằng yếu tố sản xuất & cơ hội phát triển.",
        "• Đầu ra chủ yếu: Theo kết quả lao động và hiệu quả kinh tế.",
        "• Kết hợp phân phối theo mức đóng góp vốn và nguồn lực khác.",
        "• Tái phân phối thông qua hệ thống an sinh và phúc lợi xã hội.",
      ],
      desc: "Đặc trưng 4 - Về quan hệ phân phối: Thực hiện phân phối công bằng các yếu tố sản xuất đầu vào (cơ hội tiếp cận nguồn lực) và phân phối kết quả đầu ra chủ yếu theo lao động, hiệu quả kinh tế, mức đóng góp vốn cùng hệ thống an sinh, phúc lợi xã hội.",
      fullHtml: `
        <div class="space-y-3.5 text-slate-200 leading-relaxed">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div class="p-4 rounded-xl bg-emerald-950/40 border border-emerald-700/50">
              <h4 class="text-emerald-400 font-bold text-base sm:text-lg mb-1">1. Phân phối đầu vào</h4>
              <p>
                Thực hiện <strong>phân phối công bằng các yếu tố sản xuất</strong>, bảo đảm quyền tiếp cận và sử dụng các cơ hội, điều kiện phát triển của mọi chủ thể kinh tế để tiến tới xây dựng xã hội mọi người đều giàu có.
              </p>
            </div>
            <div class="p-4 rounded-xl bg-amber-950/40 border border-amber-700/50">
              <h4 class="text-amber-400 font-bold text-base sm:text-lg mb-1">2. Phân phối đầu ra</h4>
              <p>
                Phân phối kết quả làm ra chủ yếu theo <strong>kết quả lao động, hiệu quả kinh tế</strong>, đồng thời theo <strong>mức đóng góp vốn cùng các nguồn lực khác</strong> và thông qua <strong>hệ thống an sinh xã hội, phúc lợi xã hội</strong>.
              </p>
            </div>
          </div>
          <div class="p-3.5 rounded-xl bg-slate-800/90 border border-slate-700">
            <p class="text-amber-300 font-medium">
              ★ Trong đó, <strong>phân phối theo lao động và hiệu quả kinh tế</strong> cùng <strong>phân phối theo phúc lợi</strong> là những hình thức phân phối phản ánh rõ nét bản chất định hướng xã hội chủ nghĩa của nền kinh tế thị trường.
            </p>
          </div>
        </div>
      `,
    },
    {
      id: "r2-b5",
      room: 2,
      angleDeg: 360,
      sectionCode: "2.b.5",
      badge: "Cột Trụ 05 • Tăng Trưởng & Công Bằng",
      title: "Đặc Trưng 5: Gắn Tăng Trưởng Với Công Bằng Xã Hội",
      subtitle: "Thực hiện tiến bộ & công bằng ngay trong từng bước, từng chính sách",
      color: "#7c3aed",
      lines: [
        "• Gắn tăng trưởng kinh tế với phát triển văn hóa – xã hội.",
        "• Thực hiện tiến bộ, công bằng ngay trong từng bước, từng chính sách.",
        "• Không chỉ điều tiết thu nhập và an sinh phúc lợi xã hội.",
        "• Đảm bảo cơ hội bình đẳng tiếp cận giáo dục, y tế, việc làm.",
      ],
      desc: "Đặc trưng 5 - Gắn tăng trưởng kinh tế với công bằng xã hội: Thực hiện tiến bộ và công bằng xã hội ngay trong từng chính sách, chiến lược, quy hoạch và từng giai đoạn phát triển; bảo đảm mọi người dân đều có cơ hội bình đẳng tiếp cận các dịch vụ xã hội cơ bản (giáo dục, y tế, việc làm).",
      fullHtml: `
        <div class="space-y-3.5 text-slate-200 leading-relaxed">
          <div class="p-4 rounded-xl bg-purple-950/40 border border-purple-700/50">
            <h4 class="text-purple-300 font-bold text-base sm:text-lg mb-1">Nguyên tắc xuyên suốt trong phát triển</h4>
            <p>
              Nền KTTT định hướng XHCN ở Việt Nam thực hiện <strong>gắn tăng trưởng kinh tế với công bằng xã hội; phát triển kinh tế đi đôi với phát triển văn hóa – xã hội; thực hiện tiến bộ và công bằng xã hội ngay trong từng chính sách, chiến lược, quy hoạch, kế hoạch và từng giai đoạn phát triển</strong>.
            </p>
          </div>
          <div class="p-4 rounded-xl bg-slate-800/90 border border-slate-700">
            <h4 class="text-amber-400 font-bold mb-1">Cơ hội tiếp cận bình đẳng các dịch vụ cơ bản:</h4>
            <p>
              Thực hiện công bằng xã hội ngày nay không chỉ dựa vào chính sách điều tiết thu nhập, an sinh xã hội và phúc lợi xã hội, mà còn phải tạo ra những điều kiện, tiền đề cần thiết để bảo đảm mọi người dân đều có <strong>cơ hội như nhau trong việc tiếp cận các dịch vụ xã hội cơ bản như: giáo dục, y tế, việc làm…</strong> để tự cải thiện đời sống bản thân, gia đình và đóng góp xây dựng đất nước.
            </p>
          </div>
        </div>
      `,
    },
  ];

  // ================= PHÒNG 3: GIỚI HẠN CNTB, KHẢ NĂNG KHẮC PHỤC & HẠN CHẾ/GIẢI PHÁP =================
  const room3Exhibits = [
    {
      id: "r3-1",
      room: 3,
      side: "dark",
      x: -9.85,
      y: 2.2,
      z: -2.8,
      rotY: Math.PI / 2,
      camPos: { x: -5.8, y: 1.9, z: -2.8 },
      lookPos: { x: -9.85, y: 2.2, z: -2.8 },
      sectionCode: "3.1",
      badge: "Mảng Tối • Mục 3.1 (Giới Hạn CNTB)",
      title: "3.1. Năm Giới Hạn Lịch Sử Của Chủ Nghĩa Tư Bản",
      subtitle: "Những khuyết tật cố hữu từ chế độ chiếm hữu tư nhân TBCN",
      color: "#dc2626",
      lines: [
        "• 1. Mục đích sản xuất tập trung vì lợi ích thiểu số tư bản.",
        "• 2. Khủng hoảng kinh tế chu kỳ ('thừa') & lãng phí nguồn lực.",
        "• 3. Phân hóa giàu nghèo sâu sắc & bất bình đẳng gia tăng.",
        "• 4. Suy thoái môi trường, cạn kiệt tài nguyên; 5. Xung đột, chiến tranh.",
      ],
      desc: "Dù có vai trò lịch sử thúc đẩy LLSX, CNTB bộc lộ 5 giới hạn cố hữu không thể tự khắc phục: (1) Vì lợi ích thiểu số tư bản; (2) Khủng hoảng chu kỳ & lãng phí nguồn lực; (3) Phân hóa giàu nghèo sâu sắc; (4) Suy thoái môi trường sinh thái; (5) Gây chiến tranh, xung đột địa chính trị.",
      fullHtml: `
        <div class="space-y-3 text-slate-200 leading-relaxed">
          <p class="text-sm sm:text-base text-slate-300">
            Chủ nghĩa tư bản (CNTB) có vai trò lịch sử thúc đẩy LLSX và khoa học – kỹ thuật, nhưng bản chất chiếm hữu tư nhân TBCN và thị trường tự do bộc lộ <strong>5 giới hạn lịch sử không thể tự khắc phục</strong>:
          </p>
          <div class="space-y-2.5">
            <div class="p-3 rounded-xl bg-rose-950/40 border border-rose-800/60">
              <strong class="text-rose-400">1. Mục đích sản xuất vì thiểu số giai cấp tư bản:</strong> Dựa trên chiếm hữu tư nhân TBCN về TLSX; mục đích tối thượng là tối đa hóa giá trị thặng dư và lợi nhuận độc quyền cho tài phiệt, không xuất phát từ lợi ích quần chúng lao động.
            </div>
            <div class="p-3 rounded-xl bg-rose-950/40 border border-rose-800/60">
              <strong class="text-rose-400">2. Nguy cơ khủng hoảng kinh tế chu kỳ & lãng phí nguồn lực:</strong> Mâu thuẫn cơ bản giữa tính chất xã hội hóa cao của LLSX với chiếm hữu tư nhân TBCN dẫn tới khủng hoảng "thừa" so với sức mua thanh toán.
            </div>
            <div class="p-3 rounded-xl bg-rose-950/40 border border-rose-800/60">
              <strong class="text-rose-400">3. Phân hóa giàu nghèo sâu sắc & bất bình đẳng gia tăng:</strong> Quy luật giá trị thặng dư và tích lũy tư bản làm tài sản tập trung vào thiểu số tư bản độc quyền.
            </div>
            <div class="p-3 rounded-xl bg-rose-950/40 border border-rose-800/60">
              <strong class="text-rose-400">4. Suy thoái môi trường & cạn kiệt tài nguyên:</strong> Động cơ lợi nhuận tối đa ngắn hạn dẫn tới khai thác kiệt quệ tài nguyên, không tự giải quyết được "ngoại ứng tiêu cực" sinh thái.
            </div>
            <div class="p-3 rounded-xl bg-rose-950/40 border border-rose-800/60">
              <strong class="text-rose-400">5. Gây chiến tranh, xung đột & tranh giành địa chính trị – kinh tế:</strong> Khuynh hướng bành trướng của tư bản độc quyền, tư bản tài chính dẫn đến phân chia thị trường, nguyên liệu, chiến tranh thương mại và áp đặt lệ thuộc.
            </div>
          </div>
        </div>
      `,
    },
    {
      id: "r3-2",
      room: 3,
      side: "light",
      x: 9.85,
      y: 2.2,
      z: -2.8,
      rotY: -Math.PI / 2,
      camPos: { x: 5.8, y: 1.9, z: -2.8 },
      lookPos: { x: 9.85, y: 2.2, z: -2.8 },
      sectionCode: "3.2",
      badge: "Mảng Sáng • Mục 3.2 (Khả Năng Khắc Phục)",
      title: "3.2. Năm Trụ Cột Khắc Phục Của KTTT ĐHXHCN Việt Nam",
      subtitle: "Giải pháp lý luận gắn liền minh chứng thực tiễn sinh động tại Việt Nam",
      color: "#059669",
      lines: [
        "• 1. Mục tiêu vì con người: Hộ nghèo từ >58% (1993) xuống <3%.",
        "• 2. Đa dạng sở hữu: DNNN giữ hạ tầng chiến lược; DNTN lớn mạnh.",
        "• 3. Nhà nước pháp quyền quản lý vĩ mô; 4. BHYT bao phủ >93% dân số.",
        "• 5. Tăng trưởng xanh & công bằng: Cam kết Net Zero 2050 (COP26).",
      ],
      desc: "Mô hình KTTT ĐHXHCN Việt Nam chủ động khắc phục các giới hạn của CNTB qua 5 trụ cột kèm minh chứng thực tiễn: giảm nghèo từ >58% xuống <3%, phát triển hài hòa DNNN & tập đoàn tư nhân (Vingroup, FPT, Thaco...), bao phủ BHYT >93% dân số và cam kết Net Zero 2050.",
      fullHtml: `
        <div class="space-y-2.5 text-slate-200 leading-relaxed">
          <div class="p-3 rounded-xl bg-emerald-950/40 border border-emerald-700/60">
            <strong class="text-emerald-400">1. Về mục tiêu phát triển:</strong> Hướng tới "Dân giàu, nước mạnh, dân chủ, công bằng, văn minh".<br/>
            <span class="text-amber-300 text-sm">★ Thực tiễn VN:</span> Tỷ lệ hộ nghèo giảm từ <strong>trên 58% (1993) xuống dưới 3% hiện nay</strong>; chỉ số HDI liên tục cải thiện.
          </div>
          <div class="p-3 rounded-xl bg-emerald-950/40 border border-emerald-700/60">
            <strong class="text-emerald-400">2. Về quan hệ sở hữu & thành phần kinh tế:</strong> Đa dạng hóa sở hữu; KTNN chủ đạo, KTTN là động lực quan trọng.<br/>
            <span class="text-amber-300 text-sm">★ Thực tiễn VN:</span> DNNN giữ hạ tầng chiến lược (năng lượng, viễn thông, giao thông); các tập đoàn tư nhân (<strong>Vingroup, FPT, Thaco...</strong>) và Viettel phát triển mạnh, đóng góp lớn cho ngân sách.
          </div>
          <div class="p-3 rounded-xl bg-emerald-950/40 border border-emerald-700/60">
            <strong class="text-emerald-400">3. Về quan hệ quản lý & vai trò Nhà nước:</strong> Nhà nước pháp quyền XHCN dưới sự lãnh đạo của Đảng sửa chữa "thất bại thị trường", chống độc quyền và lợi ích nhóm.<br/>
            <span class="text-amber-300 text-sm">★ Thực tiễn VN:</span> Duy trì ổn định vĩ mô, kiểm soát lạm phát, điều tiết giá mặt hàng thiết yếu (điện, y tế, giáo dục), bảo vệ nền kinh tế trước khủng hoảng và đại dịch.
          </div>
          <div class="p-3 rounded-xl bg-emerald-950/40 border border-emerald-700/60">
            <strong class="text-emerald-400">4. Về quan hệ phân phối & giải quyết bất bình đẳng:</strong> Kết hợp phân phối theo lao động, vốn và an sinh xã hội.<br/>
            <span class="text-amber-300 text-sm">★ Thực tiễn VN:</span> <strong>Bảo hiểm y tế toàn dân bao phủ hơn 93% dân số</strong>, Chương trình mục tiêu quốc gia Xóa đói giảm nghèo bền vững & Xây dựng nông thôn mới.
          </div>
          <div class="p-3 rounded-xl bg-emerald-950/40 border border-emerald-700/60">
            <strong class="text-emerald-400">5. Gắn tăng trưởng với tiến bộ, công bằng & môi trường:</strong> Không hy sinh công bằng xã hội và môi trường để chạy theo tăng trưởng thuần túy.<br/>
            <span class="text-amber-300 text-sm">★ Thực tiễn VN:</span> Cam kết đạt mức phát thải ròng bằng "0" (<strong>Net Zero</strong>) vào năm 2050 tại COP26, Luật Bảo vệ Môi trường 2020, kinh tế tuần hoàn.
          </div>
        </div>
      `,
    },
    {
      id: "r3-table",
      room: 3,
      side: "center",
      x: 0,
      y: 2.25,
      z: -6.85,
      rotY: 0,
      camPos: { x: 0, y: 1.95, z: -2.6 },
      lookPos: { x: 0, y: 2.25, z: -6.85 },
      sectionCode: "3.BẢNG",
      badge: "Trung Tâm Phòng 3 • Bảng Đối Chiếu 6 Tiêu Chí",
      title: "Bảng So Sánh Đối Chiếu: KTTT TBCN vs. KTTT ĐHXHCN",
      subtitle: "Đối chiếu trực diện 6 tiêu chí bản chất giữa hai mô hình kinh tế thị trường",
      color: "#f59e0b",
      lines: [
        "• 1. Mục đích SX: Lợi nhuận tư bản vs. Dân giàu, nước mạnh, văn minh.",
        "• 2. Sở hữu: Tư nhân TBCN thống trị vs. Đa dạng (KTNN chủ đạo).",
        "• 3. Quản lý: Tài phiệt chi phối vs. Nhà nước pháp quyền XHCN (Đảng lãnh đạo).",
        "• 4–6. Phân phối, Công bằng & Hệ quả: Bất bình đẳng vs. Bao trùm, bền vững.",
      ],
      desc: "Bảng so sánh đối chiếu 6 tiêu chí cốt lõi giữa Kinh tế thị trường Tư bản chủ nghĩa và Kinh tế thị trường định hướng XHCN Việt Nam: Mục đích sản xuất, Cơ sở sở hữu, Cơ chế quản lý, Quan hệ phân phối, Tăng trưởng & Công bằng xã hội, và Hệ quả đối với môi trường & xã hội.",
      fullHtml: `
        <div class="space-y-3">
          <p class="text-slate-200 leading-relaxed">
            Bảng tổng hợp đối chiếu trực diện <strong>6 tiêu chí cốt lõi</strong> giữa mô hình Kinh tế thị trường Tư bản chủ nghĩa và Kinh tế thị trường định hướng XHCN ở Việt Nam:
          </p>
          ${comparisonTableHtml}
        </div>
      `,
    },
    {
      id: "r3-3a",
      room: 3,
      side: "dark",
      x: -9.85,
      y: 2.2,
      z: 2.8,
      rotY: Math.PI / 2,
      camPos: { x: -5.8, y: 1.9, z: 2.8 },
      lookPos: { x: -9.85, y: 2.2, z: 2.8 },
      sectionCode: "3.3a",
      badge: "Mảng Tối • Mục 3.3a (Hạn Chế Hiện Nay)",
      title: "3.3a. Bốn Hạn Chế Còn Đọng Lại Hiện Nay Ở Việt Nam",
      subtitle: "Nhìn thẳng vào sự thật những bất cập trong thực tiễn vận hành",
      color: "#e11d48",
      lines: [
        "• 1. Yếu tố XHCN (như HTX) còn yếu; kẽ hở hàng giả, đa cấp, ô nhiễm.",
        "• 2. Thể chế & quản lý thuế chưa theo kịp kinh tế số, công nghệ 4.0.",
        "• 3. Môi trường kinh doanh chưa bình đẳng (vốn, đất đai, hiệu quả DNNN).",
        "• 4. Khoảng cách giàu nghèo thành thị - nông thôn; tham nhũng, lợi ích nhóm.",
      ],
      desc: "Bốn hạn chế còn tồn tại hiện nay ở Việt Nam: (1) Một số yếu tố XHCN như hợp tác xã chưa hiệu quả, còn lũng đoạn, hàng giả, đa cấp biến tướng; (2) Thể chế chưa theo kịp công nghệ 4.0 & nền tảng số; (3) Tiếp cận nguồn lực giữa DNTN và DNNN chưa thật bình đẳng; (4) Khoảng cách giàu nghèo thành thị - nông thôn và tệ quan liêu, tham nhũng, lợi ích nhóm.",
      fullHtml: `
        <div class="space-y-3 text-slate-200 leading-relaxed">
          <div class="p-3.5 rounded-xl bg-rose-950/40 border border-rose-800/60">
            <h4 class="text-rose-400 font-bold mb-1">1. Các yếu tố XHCN chưa thể hiện rõ nét và phát huy hiệu quả như mong muốn</h4>
            <p class="text-sm sm:text-base">
              Một số mô hình kinh tế hợp tác xã vẫn còn yếu kém, chưa thu hút nông dân. Công tác quản lý Nhà nước còn hạn chế, dẫn tới lũng đoạn thị trường, gian lận thương mại, hàng giả, hàng nhái, ô nhiễm môi trường và đa cấp biến tướng gây thiệt hại cho người dân.
            </p>
          </div>
          <div class="p-3.5 rounded-xl bg-rose-950/40 border border-rose-800/60">
            <h4 class="text-rose-400 font-bold mb-1">2. Hệ thống thể chế chưa theo kịp sự phát triển của kinh tế và công nghệ 4.0</h4>
            <p class="text-sm sm:text-base">
              Sự xuất hiện nhanh của kinh doanh trực tuyến trên mạng xã hội và nền tảng số khiến quy định pháp luật và cơ chế quản lý (đặc biệt là quản lý thuế) có thời điểm chưa theo kịp thực tiễn.
            </p>
          </div>
          <div class="p-3.5 rounded-xl bg-rose-950/40 border border-rose-800/60">
            <h4 class="text-rose-400 font-bold mb-1">3. Môi trường kinh doanh chưa thực sự bình đẳng giữa các thành phần kinh tế</h4>
            <p class="text-sm sm:text-base">
              Doanh nghiệp tư nhân vẫn gặp khó khăn khi tiếp cận vốn, đất đai, thông tin và cơ hội đấu thầu; trong khi một số doanh nghiệp nhà nước được ưu tiên nguồn lực nhưng sử dụng vốn chưa hiệu quả, dẫn đến thua lỗ, thất thoát và lãng phí tài sản công.
            </p>
          </div>
          <div class="p-3.5 rounded-xl bg-rose-950/40 border border-rose-800/60">
            <h4 class="text-rose-400 font-bold mb-1">4. Bất bình đẳng xã hội và các vấn đề trong quản lý kinh tế vẫn còn tồn tại</h4>
            <p class="text-sm sm:text-base">
              Khoảng cách giàu nghèo có xu hướng gia tăng, đặc biệt giữa thành thị và nông thôn (thu nhập nông dân còn thấp). Tình trạng quan liêu, tham nhũng, lãng phí và "lợi ích nhóm" chưa được ngăn chặn triệt để.
            </p>
          </div>
        </div>
      `,
    },
    {
      id: "r3-3b",
      room: 3,
      side: "light",
      x: 9.85,
      y: 2.2,
      z: 2.8,
      rotY: -Math.PI / 2,
      camPos: { x: 5.8, y: 1.9, z: 2.8 },
      lookPos: { x: 9.85, y: 2.2, z: 2.8 },
      sectionCode: "3.3b",
      badge: "Mảng Sáng • Mục 3.3b (Bốn Giải Pháp)",
      title: "3.3b. Bốn Giải Pháp Khắc Phục Hạn Chế Hiện Nay",
      subtitle: "Phương hướng hoàn thiện đồng bộ thể chế KTTT ĐHXHCN Việt Nam",
      color: "#0284c7",
      lines: [
        "• 1. Nâng cao hiệu quả quản lý Nhà nước & đổi mới hợp tác xã.",
        "• 2. Xây dựng thể chế pháp luật & thuế theo kịp kinh tế số, KH-CN.",
        "• 3. Bảo đảm cạnh tranh bình đẳng vốn/đất đai; minh bạch hóa DNNN.",
        "• 4. Gắn kinh tế với công bằng xã hội; chống tham nhũng, lợi ích nhóm.",
      ],
      desc: "Bốn nhóm giải pháp trọng tâm: (1) Nâng cao hiệu quả quản lý thị trường & đổi mới hợp tác xã; (2) Hoàn thiện khung pháp lý và thuế cho kinh tế số; (3) Bảo đảm cạnh tranh bình đẳng tiếp cận nguồn lực cho tư nhân và minh bạch hóa DNNN; (4) Gắn kinh tế với an sinh nông thôn, quyết liệt chống tham nhũng và lợi ích nhóm.",
      fullHtml: `
        <div class="space-y-3 text-slate-200 leading-relaxed">
          <div class="p-3.5 rounded-xl bg-sky-950/40 border border-sky-700/60">
            <h4 class="text-sky-300 font-bold mb-1">1. Nâng cao hiệu quả quản lý của Nhà nước và phát huy các yếu tố XHCN</h4>
            <p class="text-sm sm:text-base">
              Tăng cường năng lực quản lý, giám sát thị trường; xử lý nghiêm gian lận thương mại, hàng giả, kinh doanh đa cấp trái phép. Đổi mới hoạt động của các hợp tác xã theo hướng hiệu quả, tự chủ, gắn với nhu cầu thực tế của người dân và doanh nghiệp.
            </p>
          </div>
          <div class="p-3.5 rounded-xl bg-sky-950/40 border border-sky-700/60">
            <h4 class="text-sky-300 font-bold mb-1">2. Xây dựng thể chế phù hợp với sự phát triển của khoa học – công nghệ</h4>
            <p class="text-sm sm:text-base">
              Chủ động bổ sung quy định pháp luật đối với những mô hình kinh doanh mới trên nền tảng số và mạng xã hội; hoàn thiện cơ chế quản lý thuế, kiểm soát giao dịch trực tuyến và bảo vệ quyền lợi người tiêu dùng.
            </p>
          </div>
          <div class="p-3.5 rounded-xl bg-sky-950/40 border border-sky-700/60">
            <h4 class="text-sky-300 font-bold mb-1">3. Bảo đảm cạnh tranh bình đẳng giữa các thành phần kinh tế</h4>
            <p class="text-sm sm:text-base">
              Tạo điều kiện để doanh nghiệp tư nhân tiếp cận công bằng các nguồn lực (vốn, đất đai, thông tin, cơ hội đầu tư). Nâng cao hiệu quả quản trị DNNN, công khai tài chính, kiểm soát sử dụng vốn và xử lý nghiêm các dự án gây thất thoát, lãng phí.
            </p>
          </div>
          <div class="p-3.5 rounded-xl bg-sky-950/40 border border-sky-700/60">
            <h4 class="text-sky-300 font-bold mb-1">4. Gắn phát triển kinh tế với tiến bộ và công bằng xã hội</h4>
            <p class="text-sm sm:text-base">
              Thực hiện tốt an sinh xã hội, giảm nghèo bền vững, tạo việc làm và nâng cao thu nhập cho người dân nông thôn. Tăng cường phòng chống tham nhũng, quan liêu, lãng phí và lợi ích nhóm, bảo đảm chính sách kinh tế hướng đến lợi ích chung của nhân dân.
            </p>
          </div>
        </div>
      `,
    },
    {
      id: "r3-verdict",
      room: 3,
      side: "center",
      x: 0,
      y: 1.5,
      z: 1.6,
      rotY: 0,
      camPos: { x: 0, y: 1.9, z: 4.8 },
      lookPos: { x: 0, y: 1.35, z: 1.6 },
      sectionCode: "3.KẾT",
      badge: "Tổng Kết • Phán Quyết & Tài Liệu Tham Khảo",
      title: "Phán Quyết Cuối Cùng & Nguồn Tài Liệu Tham Khảo",
      subtitle: "KTTT định hướng XHCN có giải quyết được giới hạn lịch sử của CNTB không?",
      color: "#d97706",
      lines: [
        "• Đã xây dựng cơ chế khắc phục và hạn chế một phần giới hạn CNTB.",
        "• Phát huy đa dạng sở hữu, điều tiết Nhà nước & an sinh phúc lợi.",
        "• Chưa thể giải quyết hoàn toàn ngay lập tức vì còn hạn chế thực tiễn.",
        "• Cần tiếp tục hoàn thiện thể chế và kiểm chứng qua thực tiễn phát triển.",
      ],
      desc: "Phán quyết cuối cùng: KTTT định hướng XHCN ở Việt Nam đã góp phần hạn chế và khắc phục một phần những giới hạn lịch sử của CNTB (qua đa dạng hóa sở hữu, điều tiết của Nhà nước và gắn tăng trưởng với công bằng xã hội), nhưng chưa thể giải quyết hoàn toàn và cần tiếp tục hoàn thiện, kiểm chứng qua thực tiễn phát triển.",
      fullHtml: `
        <div class="space-y-4 text-slate-200 leading-relaxed">
          <div class="p-4 rounded-xl bg-amber-950/50 border-2 border-amber-500/60 shadow-lg">
            <h4 class="text-amber-400 font-bold text-base sm:text-lg mb-2">
              ⚖️ Phán quyết cuối cùng: KTTT định hướng XHCN có giải quyết được những giới hạn lịch sử của CNTB không?
            </h4>
            <p class="mb-2.5">
              <strong>Trả lời:</strong> Kinh tế thị trường định hướng xã hội chủ nghĩa ở Việt Nam <strong>đã xây dựng những cơ chế nhằm khắc phục và hạn chế một số giới hạn của chủ nghĩa tư bản</strong>, thông qua việc đa dạng hóa các hình thức sở hữu, phát huy vai trò quản lý và điều tiết của Nhà nước, đồng thời gắn tăng trưởng kinh tế với tiến bộ, công bằng xã hội và phúc lợi cho người dân. Tuy nhiên, trong thực tiễn, mô hình vẫn còn đối mặt với nhiều hạn chế như khoảng cách giàu nghèo, bất bình đẳng trong tiếp cận nguồn lực, hiệu quả sử dụng vốn nhà nước và chất lượng tăng trưởng chưa cao.
            </p>
            <p class="p-3 rounded-lg bg-slate-900/90 border border-amber-500/40 text-amber-200 font-medium">
              ⇒ Vì vậy, KTTT định hướng XHCN <strong>đã góp phần hạn chế và khắc phục một phần những giới hạn lịch sử của CNTB, nhưng chưa thể giải quyết hoàn toàn</strong>. Khả năng khắc phục những giới hạn này cần tiếp tục được đánh giá và kiểm chứng thông qua thực tiễn phát triển, đặc biệt là hiệu quả quản lý kinh tế, công bằng xã hội và chất lượng đời sống nhân dân.
            </p>
          </div>
          <div class="p-4 rounded-xl bg-slate-800/90 border border-slate-700">
            <h4 class="text-sky-400 font-bold text-base mb-2">📚 Nguồn tài liệu tham khảo chính thống:</h4>
            <ol class="list-decimal list-inside space-y-1.5 text-xs sm:text-sm text-slate-300">
              <li><strong>Bộ Giáo dục và Đào tạo (2021)</strong>, <em>Giáo trình Kinh tế chính trị Mác – Lênin</em> (Dành cho bậc đại học hệ không chuyên lý luận chính trị), NXB Chính trị quốc gia Sự thật, Hà Nội (Chương 5, tr. 155–171).</li>
              <li><strong>Đảng Cộng sản Việt Nam (2016)</strong>, <em>Văn kiện Đại hội đại biểu toàn quốc lần thứ XII</em>, NXB Chính trị quốc gia Sự thật, Hà Nội.</li>
              <li><strong>Đảng Cộng sản Việt Nam (2021)</strong>, <em>Văn kiện Đại hội đại biểu toàn quốc lần thứ XIII</em>, Tập 1, NXB Chính trị quốc gia Sự thật, Hà Nội.</li>
              <li><strong>Nghị quyết số 11-NQ/TW ngày 03/6/2017</strong> của Hội nghị lần thứ năm Ban Chấp hành Trung ương Đảng khóa XII về Hoàn thiện thể chế kinh tế thị trường định hướng xã hội chủ nghĩa.</li>
              <li><strong>Hiến pháp nước Cộng hòa xã hội chủ nghĩa Việt Nam năm 2013</strong> (Điều 51).</li>
              <li><strong>Mai Thúc Hiệp (2025)</strong>, “Sự phát triển tư duy của Đảng về kinh tế thị trường định hướng xã hội chủ nghĩa qua 40 năm đổi mới”, <em>Tạp chí Khoa học và Công nghệ – Đại học Thái Nguyên</em>, tập 230, số 11, tr. 259–265.</li>
              <li><strong>Nguyễn Thế Vinh (2024)</strong>, “Tiếp tục phát triển kinh tế thị trường định hướng xã hội chủ nghĩa ở Việt Nam trong kỷ nguyên mới”, <em>Tạp chí Quản lý nhà nước</em>, 17/10/2024.</li>
              <li><strong>Trương Minh Hòa (2022)</strong>, “Tư duy lý luận về nền kinh tế thị trường định hướng xã hội chủ nghĩa ở Việt Nam”, <em>Tạp chí Quản lý nhà nước</em>, 13/10/2022.</li>
              <li><strong>Hoàng Thị Quyên (2026)</strong>, “Phát triển kinh tế đất nước theo Nghị quyết Đại hội XIV của Đảng”, <em>Tạp chí Quản lý nhà nước</em>, 25/02/2026.</li>
              <li><strong>Minh Anh (2025)</strong>, “Bộ Chính trị ban hành Nghị quyết phát triển kinh tế tư nhân”, <em>Tạp chí Luật sư Việt Nam</em>, 05/5/2025.</li>
            </ol>
          </div>
        </div>
      `,
    },
  ];

  // Tính toán sẵn camPos & lookPos cho 5 cột trụ ở Phòng 2 để Playlist truy cập đồng nhất
  const radiusR2 = 5.4;
  const centerZR2 = -0.8;
  room2Pillars.forEach((p) => {
    const rad = (p.angleDeg * Math.PI) / 180;
    const x = Math.cos(rad) * radiusR2;
    const z = Math.sin(rad) * radiusR2 + centerZR2;
    p.x = x;
    p.z = z;
    p.camPos = { x: x * 0.56, y: 1.9, z: z * 0.56 - 0.2 };
    p.lookPos = { x: x, y: 2.2, z: z };
  });

  // Danh sách tuyến tính (Playlist 20 slides) phục vụ Chế độ Thuyết trình từ Phòng 1 -> Phòng 2 -> Phòng 3
  const playlist = [
    ...room1Exhibits,
    room2Center,
    ...room2Pillars,
    ...room3Exhibits,
  ];

  return {
    room1: {
      exhibits: room1Exhibits,
    },
    room2: {
      center: room2Center,
      pillars: room2Pillars,
    },
    room3: {
      exhibits: room3Exhibits,
      comparisonTableRows,
      comparisonTableHtml,
    },
    playlist,
  };
})();
