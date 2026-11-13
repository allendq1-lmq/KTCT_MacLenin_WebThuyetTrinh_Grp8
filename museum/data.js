// museum/data.js - Toàn bộ dữ liệu hiện vật & nội dung trưng bày cho không gian Khám phá Bảo Tàng 3D
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
    <div class="overflow-x-auto rounded-xl border border-slate-300 bg-white shadow-sm">
      <table class="pres-comp-table w-full text-left border-collapse">
        <thead>
          <tr class="bg-slate-900 text-white border-b border-slate-300">
            <th class="font-extrabold text-amber-400 w-[22%]">Tiêu chí so sánh</th>
            <th class="font-extrabold text-rose-300 w-[39%] border-l border-slate-700">Kinh tế thị trường Tư bản chủ nghĩa</th>
            <th class="font-extrabold text-emerald-300 w-[39%] border-l border-slate-700">Kinh tế thị trường định hướng XHCN Việt Nam</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-200 bg-white text-slate-800">
          ${comparisonTableRows
            .map(
              (r) => `
            <tr class="hover:bg-slate-50 transition-colors">
              <td class="font-bold text-slate-900 align-top bg-amber-50/40">${r.criteria}</td>
              <td class="text-slate-700 border-l border-slate-200 align-top bg-rose-50/25">${r.capitalist}</td>
              <td class="text-slate-900 font-semibold border-l border-slate-200 align-top bg-emerald-50/40">${r.socialist}</td>
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
        <div class="pres-detail-stack">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            <div class="pres-subcard bg-sky-50/70 border border-sky-200">
              <h4 class="text-sky-800 font-bold">Bản chất của Kinh tế thị trường (KTTT)</h4>
              <p class="text-slate-800">
                <strong>Kinh tế thị trường</strong> là nền kinh tế trong đó các quan hệ sản xuất, trao đổi, phân phối và tiêu dùng đều thực hiện qua thị trường. Ba vấn đề cơ bản (<em>sản xuất cái gì, như thế nào, cho ai</em>) do thị trường quyết định qua 4 quy luật: <strong>Giá trị, Cung – cầu, Cạnh tranh, Lưu thông tiền tệ</strong>.
              </p>
            </div>
            <div class="pres-subcard bg-amber-50/70 border border-amber-200">
              <h4 class="text-amber-800 font-bold">Nguồn gốc & Giá trị văn minh nhân loại</h4>
              <p class="text-slate-800">
                <strong>Nguồn gốc:</strong> Là giai đoạn phát triển cao của kinh tế hàng hóa khi phân công lao động xã hội và tách biệt kinh tế phát triển.<br/>
                <strong>Thành tựu chung:</strong> KTTT <em>không phải sản phẩm riêng của CNTB</em>; CNTB chỉ là chế độ đã sử dụng và đưa KTTT lên trình độ cao.
              </p>
            </div>
          </div>
          <div class="pres-subcard bg-slate-50 border border-slate-300">
            <h4 class="text-slate-900 font-bold">Sự đa dạng các mô hình KTTT trên thế giới:</h4>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1.5">
              <div class="p-2 rounded-lg bg-white border border-slate-200">
                <span class="text-amber-700 font-bold">1. Hoa Kỳ:</span> Mô hình kinh tế thị trường tự do.
              </div>
              <div class="p-2 rounded-lg bg-white border border-slate-200">
                <span class="text-amber-700 font-bold">2. CHLB Đức:</span> Mô hình kinh tế thị trường xã hội.
              </div>
              <div class="p-2 rounded-lg bg-white border border-slate-200">
                <span class="text-amber-700 font-bold">3. Nhật Bản, Hàn Quốc:</span> KTTT gắn với vai trò điều phối mạnh của Nhà nước.
              </div>
              <div class="p-2 rounded-lg bg-white border border-slate-200">
                <span class="text-amber-700 font-bold">4. Trung Quốc:</span> KTTT xã hội chủ nghĩa mang đặc sắc Trung Quốc.
              </div>
            </div>
            <p class="mt-1.5 text-slate-600 italic">
              Kết luận: Không có một mô hình KTTT chung cho mọi quốc gia; mỗi nước phải lựa chọn mô hình phù hợp với điều kiện lịch sử và mục tiêu phát triển.
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
        <div class="pres-detail-stack">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            <div class="pres-subcard bg-amber-50/70 border border-amber-200">
              <h4 class="text-amber-800 font-bold">Định nghĩa cốt lõi</h4>
              <p class="text-slate-800">
                <strong>Kinh tế thị trường định hướng xã hội chủ nghĩa</strong> là mô hình kinh tế tổng quát của Việt Nam trong thời kỳ quá độ lên CNXH. Vận hành tuân theo các quy luật vốn có của KTTT; đồng thời được Nhà nước định hướng, điều tiết dưới sự lãnh đạo của Đảng Cộng sản Việt Nam.
              </p>
            </div>
            <div class="pres-subcard bg-emerald-50/70 border border-emerald-200">
              <h4 class="text-emerald-800 font-bold">Hiến định tại Điều 51 Hiến pháp 2013</h4>
              <p class="text-slate-800">
                Xác định nền kinh tế Việt Nam là nền KTTT định hướng XHCN với <strong>nhiều hình thức sở hữu và nhiều thành phần kinh tế</strong>; kinh tế nhà nước giữ vai trò chủ đạo. Vừa dựa trên nguyên tắc thị trường, vừa dẫn dắt bởi bản chất ưu việt của CNXH.
              </p>
            </div>
          </div>
          <div class="pres-subcard bg-sky-50/70 border border-sky-200">
            <h4 class="text-sky-800 font-bold">Quan niệm chính thức tại Văn kiện Đại hội XIII (2021):</h4>
            <blockquote class="border-l-4 border-amber-600 pl-3 py-1 mt-1 text-slate-800 italic">
              “Kinh tế thị trường định hướng xã hội chủ nghĩa là nền kinh tế thị trường hiện đại, hội nhập quốc tế, vận hành đầy đủ, đồng bộ theo các quy luật của kinh tế thị trường, có sự quản lý của Nhà nước pháp quyền xã hội chủ nghĩa, do Đảng Cộng sản Việt Nam lãnh đạo; việc phát triển nền kinh tế này phải bảo đảm định hướng xã hội chủ nghĩa vì mục tiêu <strong>‘dân giàu, nước mạnh, dân chủ, công bằng, văn minh’</strong>, phù hợp với từng giai đoạn phát triển của đất nước.”
            </blockquote>
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
        <div class="pres-detail-stack">
          <div class="pres-subcard bg-slate-50 border border-slate-300">
            <h4 class="text-slate-900 font-bold">Đặc trưng cơ chế kế hoạch hóa tập trung, quan liêu, bao cấp</h4>
            <ul class="list-disc list-inside space-y-1 text-slate-800 mt-1">
              <li>Coi KTTT là sản phẩm riêng của CNTB; không thừa nhận sản xuất hàng hóa và cơ chế thị trường tồn tại khách quan trong thời kỳ quá độ.</li>
              <li>Kế hoạch hóa tập trung được xem là đặc trưng tuyệt đối, thị trường chỉ giữ vai trò thứ yếu.</li>
              <li>Từng phát huy tác dụng tập trung nguồn lực trong chiến tranh, nhưng sau 1975 bộc lộ hạn chế nghiêm trọng: <strong>triệt tiêu động lực lao động, sản xuất đình đốn, lạm phát phi mã, khủng hoảng KT-XH</strong>.</li>
            </ul>
          </div>
          <div class="pres-subcard bg-amber-50/70 border border-amber-200">
            <h4 class="text-amber-800 font-bold">Ba bước tìm tòi, thử nghiệm tiền đề cho Đổi mới:</h4>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-2 mt-1.5">
              <div class="p-2.5 rounded-lg bg-white border border-amber-200">
                <strong class="text-amber-800 block">1. HNTW 6 khóa IV (1979):</strong>
                Chủ trương khắc phục khuyết điểm quản lý kinh tế, làm cho sản xuất <em>“bung ra”</em>.
              </div>
              <div class="p-2.5 rounded-lg bg-white border border-amber-200">
                <strong class="text-amber-800 block">2. Chỉ thị 100-CT/TW (1981):</strong>
                Thực hiện <em>khoán sản phẩm</em> cuối cùng đến nhóm và người lao động trong HTX nông nghiệp.
              </div>
              <div class="p-2.5 rounded-lg bg-white border border-amber-200">
                <strong class="text-amber-800 block">3. HNTW 8 khóa V (1985):</strong>
                Dứt khoát xóa bỏ cơ chế tập trung quan liêu, bao cấp, chuyển sang hạch toán kinh doanh XHCN.
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
        <div class="pres-detail-stack">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-2.5">
            <div class="pres-subcard bg-amber-50/70 border border-amber-200">
              <h4 class="text-amber-800 font-bold">1. Đại hội VI (12/1986) & HNTW 6 (1989)</h4>
              <p class="text-slate-800 mt-1">
                Mở đầu Đổi mới toàn diện, lấy <strong>đổi mới tư duy kinh tế làm trọng tâm</strong>. Khôi phục kinh tế nhiều thành phần, sử dụng quan hệ hàng hóa – tiền tệ, xóa bỏ cơ chế bao cấp, giải phóng mọi năng lực sản xuất.
              </p>
            </div>
            <div class="pres-subcard bg-sky-50/70 border border-sky-200">
              <h4 class="text-sky-800 font-bold">2. Đại hội VII (1991) – Cương lĩnh</h4>
              <p class="text-slate-800 mt-1">
                Xác định chủ trương chiến lược lâu dài trong suốt thời kỳ quá độ: phát triển <strong>nền kinh tế hàng hóa nhiều thành phần theo định hướng XHCN, vận hành theo cơ chế thị trường có sự quản lý của Nhà nước</strong>.
              </p>
            </div>
            <div class="pres-subcard bg-emerald-50/70 border border-emerald-200">
              <h4 class="text-emerald-800 font-bold">3. Đại hội VIII (1996) – Nhận thức mới</h4>
              <p class="text-slate-800 mt-1">
                Khẳng định <strong>sản xuất hàng hóa không đối lập với CNXH</strong>, mà là thành tựu của văn minh nhân loại, tồn tại khách quan và cần thiết cho công cuộc xây dựng CNXH.
              </p>
            </div>
          </div>
          <div class="pres-subcard bg-slate-50 border border-slate-300">
            <strong class="text-slate-900">Đánh giá tổng kết giai đoạn 1986–2000:</strong>
            <span class="text-slate-700">Đã thừa nhận kinh tế hàng hóa nhiều thành phần và cơ chế thị trường, nhưng KTTT chủ yếu vẫn được nhìn nhận như một cơ chế/công cụ quản lý, chưa được xác định là mô hình kinh tế tổng quát.</span>
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
        <div class="pres-detail-stack">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div class="pres-subcard bg-white border border-slate-300">
              <span class="text-amber-700 font-bold block">1. Đại hội IX (2001):</span>
              Lần đầu tiên chính thức xác định KTTT ĐHXHCN là <strong>mô hình kinh tế tổng quát</strong> của nước ta trong thời kỳ quá độ lên CNXH.
            </div>
            <div class="pres-subcard bg-white border border-slate-300">
              <span class="text-amber-700 font-bold block">2. Đại hội X (2006) & XI (2011):</span>
              Làm rõ mục tiêu dân giàu, nước mạnh, dân chủ, công bằng, văn minh; Cương lĩnh 2011 khẳng định các thành phần kinh tế bình đẳng trước pháp luật.
            </div>
            <div class="pres-subcard bg-white border border-slate-300">
              <span class="text-amber-700 font-bold block">3. Đại hội XII (2016) & NQ TW5 (2017):</span>
              Nêu quan niệm toàn diện về KTTT hiện đại, hội nhập quốc tế; xác định <strong>kinh tế tư nhân là một động lực quan trọng</strong>.
            </div>
            <div class="pres-subcard bg-white border border-slate-300">
              <span class="text-amber-700 font-bold block">4. Đại hội XIII (2021):</span>
              Xác định rõ vai trò từng thành phần kinh tế; bổ sung <strong>nhân tố xã hội</strong> bên cạnh Nhà nước và thị trường trong vận hành kinh tế.
            </div>
          </div>
          <div class="pres-subcard bg-amber-50/80 border border-amber-300">
            <h4 class="text-amber-900 font-bold">Bước ngoặt chiến lược 2024 – 2026:</h4>
            <p class="text-slate-800 mt-1">
              • <strong>Bốn Nghị quyết chiến lược của Bộ Chính trị (57, 59, 66 và 68-NQ/TW):</strong> Đặc biệt, <strong>Nghị quyết 68-NQ/TW</strong> đặt mục tiêu đến năm 2030 <em>kinh tế tư nhân là một động lực quan trọng nhất của nền kinh tế quốc gia</em>.<br/>
              • <strong>Đại hội XIV của Đảng (tháng 01/2026):</strong> Khẳng định hoàn thiện đồng bộ thể chế KTTT ĐHXHCN, bảo đảm thị trường vận hành thông suốt, giữ vững định hướng XHCN dưới sự quản lý của Nhà nước và lãnh đạo của Đảng.
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
        <div class="pres-detail-stack">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            <div class="pres-subcard bg-amber-50/70 border border-amber-200">
              <h4 class="text-amber-800 font-bold">1. Phù hợp quy luật và xu thế khách quan</h4>
              <p class="text-slate-800 mt-1">
                Chừng nào còn phân công lao động xã hội và sự tách biệt kinh tế thì KTTT còn tồn tại khách quan. Việt Nam quá độ lên CNXH bỏ qua chế độ TBCN nhưng kế thừa thành tựu KTTT nhân loại — bổ sung lý luận về <strong>“khâu trung gian”</strong> phù hợp tiến trình lịch sử – tự nhiên.
              </p>
            </div>
            <div class="pres-subcard bg-sky-50/70 border border-sky-200">
              <h4 class="text-sky-800 font-bold">3. Phù hợp mục tiêu XHCN & nguyện vọng nhân dân</h4>
              <p class="text-slate-800 mt-1">
                Khắc phục mặt trái tự phát của KTTT TBCN (khủng hoảng, bất bình đẳng, ô nhiễm). Đặt thị trường dưới sự lãnh đạo của Đảng và quản lý của Nhà nước pháp quyền XHCN; lấy con người làm trung tâm, gắn tăng trưởng với công bằng xã hội.
              </p>
            </div>
          </div>
          <div class="pres-subcard bg-emerald-50/70 border border-emerald-200">
            <h4 class="text-emerald-800 font-bold mb-1.5">2. Tính ưu việt thúc đẩy LLSX & Minh chứng thực tiễn năm 2024:</h4>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
              <div class="p-2 rounded-lg bg-white border border-emerald-200 shadow-sm">
                <span class="text-lg sm:text-xl font-black text-amber-700 block">476,3 tỷ $</span>
                <span class="text-xs text-slate-600 font-medium">Quy mô GDP 2024 (Hạng 33 TG)</span>
              </div>
              <div class="p-2 rounded-lg bg-white border border-emerald-200 shadow-sm">
                <span class="text-lg sm:text-xl font-black text-emerald-700 block">~4.700 $</span>
                <span class="text-xs text-slate-600 font-medium">GDP bình quân đầu người 2024</span>
              </div>
              <div class="p-2 rounded-lg bg-white border border-emerald-200 shadow-sm">
                <span class="text-lg sm:text-xl font-black text-sky-700 block">17 FTA</span>
                <span class="text-xs text-slate-600 font-medium">Với hơn 60 đối tác toàn cầu</span>
              </div>
              <div class="p-2 rounded-lg bg-white border border-emerald-200 shadow-sm">
                <span class="text-lg sm:text-xl font-black text-slate-900 block">73 Nước</span>
                <span class="text-xs text-slate-600 font-medium">Công nhận VN là nền KTTT</span>
              </div>
            </div>
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
        <div class="pres-detail-stack">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div class="pres-subcard bg-sky-50/70 border border-sky-200">
              <h4 class="text-sky-800 font-bold">1. Hoàn thiện pháp luật & ổn định vĩ mô</h4>
              <p class="text-slate-800 mt-1">
                Chủ động hoàn thiện hệ thống pháp luật phù hợp các cam kết quốc tế; bảo đảm ổn định kinh tế vĩ mô, bảo vệ cạnh tranh lành mạnh, giữ vững các cân đối lớn và an ninh kinh tế.
              </p>
            </div>
            <div class="pres-subcard bg-amber-50/70 border border-amber-200">
              <h4 class="text-amber-800 font-bold">2. Kiến tạo môi trường & đổi mới sáng tạo</h4>
              <p class="text-slate-800 mt-1">
                Nâng cao chất lượng, hiệu quả quản trị quốc gia; tạo môi trường thuận lợi thúc đẩy doanh nghiệp, khuyến khích khởi nghiệp, đổi mới sáng tạo và các mô hình kinh doanh mới.
              </p>
            </div>
            <div class="pres-subcard bg-emerald-50/70 border border-emerald-200">
              <h4 class="text-emerald-800 font-bold">3. Phát huy vai trò các tổ chức xã hội</h4>
              <p class="text-slate-800 mt-1">
                Phát huy vai trò của các tổ chức xã hội, hiệp hội nghề nghiệp trong tham gia hình thành, giám sát và điều tiết các quan hệ kinh tế thị trường minh bạch, lành mạnh.
              </p>
            </div>
            <div class="pres-subcard bg-slate-50 border border-slate-300">
              <h4 class="text-slate-900 font-bold">4. Hội nhập chủ động & phòng vệ thương mại</h4>
              <p class="text-slate-800 mt-1">
                Đẩy mạnh đa phương hóa, đa dạng hóa kinh tế quốc tế, tránh lệ thuộc vào một thị trường; nâng cao sức chống chịu trước biến động thế giới và hoàn thiện phòng vệ thương mại.
              </p>
            </div>
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
        <div class="pres-detail-stack">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div class="pres-subcard bg-amber-50/70 border border-amber-200">
              <h4 class="text-amber-800 font-bold">a. Phát triển lý luận & đề ra đường lối</h4>
              <p class="text-slate-800 mt-1">
                Đảng là lực lượng tiên phong đúc kết thực tiễn, chuyển từ cơ chế mệnh lệnh hành chính sang KTTT ĐHXHCN; đề ra cương lĩnh, chiến lược phát triển KT-XH qua các kỳ Đại hội.
              </p>
            </div>
            <div class="pres-subcard bg-emerald-50/70 border border-emerald-200">
              <h4 class="text-emerald-800 font-bold">b. Định hướng & giữ vững mục tiêu XHCN</h4>
              <p class="text-slate-800 mt-1">
                Ngăn ngừa tự phát, chệch hướng sang TBCN; bảo đảm tăng trưởng kinh tế luôn đi đôi với tiến bộ, công bằng xã hội, văn hóa, giáo dục, y tế và bảo vệ môi trường.
              </p>
            </div>
            <div class="pres-subcard bg-sky-50/70 border border-sky-200">
              <h4 class="text-sky-800 font-bold">c. Lãnh đạo xây dựng & hoàn thiện thể chế</h4>
              <p class="text-slate-800 mt-1">
                Lãnh đạo Nhà nước thể chế hóa quan điểm chính trị thành pháp luật, chính sách đồng bộ; xác định rõ KT nhà nước chủ đạo, KT tư nhân là động lực quan trọng, cạnh tranh bình đẳng.
              </p>
            </div>
            <div class="pres-subcard bg-slate-50 border border-slate-300">
              <h4 class="text-slate-900 font-bold">d. Công tác cán bộ, kiểm tra & giám sát</h4>
              <p class="text-slate-800 mt-1">
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
      <div class="pres-detail-stack">
        <div class="pres-subcard bg-amber-50/70 border border-amber-200">
          <h4 class="text-amber-800 font-bold mb-1.5">a) Những đặc điểm chung với các nền kinh tế thị trường thế giới</h4>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-800">
            <div class="p-2 rounded-lg bg-white border border-amber-200">
              <strong>1. Chủ thể độc lập, tự chủ:</strong> Các chủ thể kinh tế có quyền tự chủ trong quyết định sản xuất, kinh doanh.
            </div>
            <div class="p-2 rounded-lg bg-white border border-amber-200">
              <strong>2. Cơ chế giá cả & cạnh tranh:</strong> Giá cả do cung – cầu quyết định; cạnh tranh thúc đẩy đổi mới công nghệ, năng suất.
            </div>
            <div class="p-2 rounded-lg bg-white border border-amber-200">
              <strong>3. Hệ thống thị trường đồng bộ & mở:</strong> Hàng hóa, dịch vụ, vốn, lao động, KH-CN, bất động sản gắn với hội nhập quốc tế.
            </div>
            <div class="p-2 rounded-lg bg-white border border-amber-200">
              <strong>4. Vai trò điều tiết vĩ mô:</strong> Nhà nước quản lý vĩ mô nhằm khắc phục những khuyết tật tự phát của thị trường.
            </div>
          </div>
        </div>
        <div class="pres-subcard bg-sky-50/70 border border-sky-200">
          <h4 class="text-sky-800 font-bold">Đặc điểm mang tính giai đoạn ở Việt Nam:</h4>
          <p class="text-slate-800 mt-1">
            Xuất phát từ một nền kinh tế chủ yếu là sản xuất nhỏ, trình độ phát triển còn thấp, một số loại thị trường chưa hình thành đầy đủ, đồng bộ. Đây là đặc điểm mang tính giai đoạn, đặt ra yêu cầu tất yếu phải tiếp tục hoàn thiện thể chế KTTT định hướng XHCN.
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
        <div class="pres-detail-stack">
          <div class="pres-subcard bg-amber-50/80 border border-amber-300">
            <h4 class="text-amber-900 font-bold">1. Về mục tiêu tối thượng của KTTT định hướng XHCN</h4>
            <p class="text-slate-800 mt-1">
              Kinh tế thị trường định hướng XHCN hướng tới <strong>phát triển lực lượng sản xuất, xây dựng cơ sở vật chất – kỹ thuật của chủ nghĩa xã hội; nâng cao đời sống nhân dân, thực hiện “dân giàu, nước mạnh, dân chủ, công bằng, văn minh”</strong>.
            </p>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            <div class="pres-subcard bg-sky-50/70 border border-sky-200">
              <h4 class="text-sky-800 font-bold">Cơ sở chính trị – xã hội</h4>
              <p class="text-slate-800 mt-1">
                Mục tiêu đó bắt nguồn từ cơ sở kinh tế – xã hội của thời kỳ quá độ lên CNXH và là sự phản ánh mục tiêu chính trị – xã hội mà nhân dân ta đang phấn đấu dưới sự lãnh đạo của Đảng Cộng sản Việt Nam.
              </p>
            </div>
            <div class="pres-subcard bg-emerald-50/70 border border-emerald-200">
              <h4 class="text-emerald-800 font-bold">Gắn kết LLSX và QHSX</h4>
              <p class="text-slate-800 mt-1">
                Đi đôi với phát triển lực lượng sản xuất hiện đại, quá trình phát triển KTTT ở Việt Nam gắn liền với <strong>xây dựng quan hệ sản xuất tiến bộ, phù hợp</strong> nhằm hoàn thiện cơ sở kinh tế – xã hội của CNXH.
              </p>
            </div>
          </div>
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
        <div class="pres-detail-stack">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            <div class="pres-subcard bg-sky-50/70 border border-sky-200">
              <h4 class="text-sky-800 font-bold">a) Bản chất của Sở hữu (Kinh tế & Pháp lý)</h4>
              <p class="text-slate-800 mt-1">
                <strong>Sở hữu</strong> là quan hệ giữa người với người trong sản xuất và tái sản xuất xã hội trên cơ sở chiếm hữu nguồn lực và kết quả lao động (gồm: <em>chủ thể, đối tượng, lợi ích</em>).
              </p>
              <ul class="list-disc list-inside space-y-1 text-slate-800 mt-1.5">
                <li><strong class="text-amber-800">Nội dung kinh tế:</strong> Sở hữu là điều kiện của sản xuất, là lợi ích kinh tế mà chủ thể sở hữu được thụ hưởng.</li>
                <li><strong class="text-amber-800">Nội dung pháp lý:</strong> Thể hiện những quy định pháp luật về quyền hạn và nghĩa vụ của chủ thể sở hữu.</li>
              </ul>
            </div>
            <div class="pres-subcard bg-amber-50/70 border border-amber-200">
              <h4 class="text-amber-800 font-bold">b) Cơ cấu kinh tế nhiều thành phần ở Việt Nam</h4>
              <ul class="list-disc list-inside space-y-1.5 text-slate-800 mt-1.5">
                <li><strong>Kinh tế nhà nước</strong> giữ vai trò <strong>chủ đạo</strong>.</li>
                <li><strong>Kinh tế tư nhân</strong> là một <strong>động lực quan trọng</strong>.</li>
                <li><strong>Kinh tế nhà nước, kinh tế tập thể cùng với kinh tế tư nhân</strong> là <strong>nòng cốt</strong> để phát triển nền kinh tế độc lập, tự chủ.</li>
                <li>Các chủ thể thuộc các thành phần kinh tế <strong>bình đẳng, hợp tác, cạnh tranh</strong> cùng phát triển theo pháp luật.</li>
              </ul>
            </div>
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
        <div class="pres-detail-stack">
          <div class="pres-subcard bg-amber-50/80 border border-amber-300">
            <h4 class="text-amber-900 font-bold">Bản chất đặc trưng trong cơ chế quản lý ở Việt Nam</h4>
            <p class="text-slate-800 mt-1">
              Ở mọi quốc gia hiện đại, nhà nước đều can thiệp để khắc phục khuyết tật thị trường. Đặc trưng riêng của Việt Nam là: <strong>Nhà nước quản lý và thực hành cơ chế quản lý là Nhà nước pháp quyền xã hội chủ nghĩa của nhân dân, do nhân dân, vì nhân dân dưới sự lãnh đạo của Đảng Cộng sản, chịu sự làm chủ và giám sát của nhân dân.</strong>
            </p>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div class="pres-subcard bg-sky-50/70 border border-sky-200">
              <h4 class="text-sky-800 font-bold">Vai trò của Đảng Cộng sản Việt Nam</h4>
              <p class="text-slate-800 mt-1">
                Lãnh đạo nền KTTT định hướng XHCN thông qua cương lĩnh, đường lối phát triển KT-XH và các chủ trương, quyết sách lớn trong từng thời kỳ phát triển của đất nước.
              </p>
            </div>
            <div class="pres-subcard bg-emerald-50/70 border border-emerald-200">
              <h4 class="text-emerald-800 font-bold">Vai trò của Nhà nước pháp quyền XHCN</h4>
              <p class="text-slate-800 mt-1">
                Quản lý nền kinh tế thông qua pháp luật, chiến lược, kế hoạch, quy hoạch, cơ chế chính sách và các công cụ kinh tế trên cơ sở tôn trọng nguyên tắc thị trường.
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
        <div class="pres-detail-stack">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div class="pres-subcard bg-emerald-50/70 border border-emerald-200">
              <h4 class="text-emerald-800 font-bold">1. Phân phối đầu vào</h4>
              <p class="text-slate-800 mt-1">
                Thực hiện <strong>phân phối công bằng các yếu tố sản xuất</strong>, bảo đảm quyền tiếp cận và sử dụng các cơ hội, điều kiện phát triển của mọi chủ thể kinh tế để tiến tới xây dựng xã hội mọi người đều giàu có.
              </p>
            </div>
            <div class="pres-subcard bg-amber-50/70 border border-amber-200">
              <h4 class="text-amber-800 font-bold">2. Phân phối đầu ra</h4>
              <p class="text-slate-800 mt-1">
                Phân phối kết quả làm ra chủ yếu theo <strong>kết quả lao động, hiệu quả kinh tế</strong>, đồng thời theo <strong>mức đóng góp vốn cùng các nguồn lực khác</strong> và thông qua <strong>hệ thống an sinh xã hội, phúc lợi xã hội</strong>.
              </p>
            </div>
          </div>
          <div class="pres-subcard bg-sky-50/70 border border-sky-200">
            <p class="text-slate-800 font-medium">
              <strong class="text-sky-800">Điểm cốt lõi:</strong> Trong các hình thức trên, <strong>phân phối theo lao động và hiệu quả kinh tế</strong> cùng <strong>phân phối theo phúc lợi xã hội</strong> là những hình thức phân phối phản ánh rõ nét bản chất định hướng xã hội chủ nghĩa của nền kinh tế thị trường.
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
        <div class="pres-detail-stack">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            <div class="pres-subcard bg-amber-50/70 border border-amber-200">
              <h4 class="text-amber-800 font-bold">Nguyên tắc xuyên suốt trong phát triển</h4>
              <p class="text-slate-800 mt-1">
                Nền KTTT định hướng XHCN ở Việt Nam thực hiện <strong>gắn tăng trưởng kinh tế với công bằng xã hội; phát triển kinh tế đi đôi với phát triển văn hóa – xã hội; thực hiện tiến bộ và công bằng xã hội ngay trong từng chính sách, chiến lược, quy hoạch, kế hoạch và từng giai đoạn phát triển</strong>.
              </p>
            </div>
            <div class="pres-subcard bg-sky-50/70 border border-sky-200">
              <h4 class="text-sky-800 font-bold">Cơ hội tiếp cận bình đẳng dịch vụ cơ bản</h4>
              <p class="text-slate-800 mt-1">
                Thực hiện công bằng xã hội không chỉ dựa vào điều tiết thu nhập và an sinh phúc lợi, mà còn tạo điều kiện để mọi người dân đều có <strong>cơ hội bình đẳng tiếp cận các dịch vụ xã hội cơ bản (giáo dục, y tế, việc làm…)</strong> để tự cải thiện đời sống và đóng góp cho đất nước.
              </p>
            </div>
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
        <div class="pres-detail-stack">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div class="pres-subcard bg-rose-50/70 border border-rose-200">
              <strong class="text-rose-800 block">1. Mục đích sản xuất vì thiểu số tư bản:</strong>
              Dựa trên chiếm hữu tư nhân TBCN về TLSX; mục đích tối thượng là tối đa hóa giá trị thặng dư và lợi nhuận độc quyền cho tài phiệt.
            </div>
            <div class="pres-subcard bg-rose-50/70 border border-rose-200">
              <strong class="text-rose-800 block">2. Khủng hoảng chu kỳ & lãng phí nguồn lực:</strong>
              Mâu thuẫn cơ bản giữa tính chất xã hội hóa cao của LLSX với chiếm hữu tư nhân TBCN dẫn tới khủng hoảng "thừa" so với sức mua.
            </div>
            <div class="pres-subcard bg-rose-50/70 border border-rose-200">
              <strong class="text-rose-800 block">3. Phân hóa giàu nghèo & bất bình đẳng:</strong>
              Quy luật giá trị thặng dư và tích lũy tư bản làm tài sản tập trung vào thiểu số tư bản độc quyền, đào sâu hố ngăn cách xã hội.
            </div>
            <div class="pres-subcard bg-rose-50/70 border border-rose-200">
              <strong class="text-rose-800 block">4. Suy thoái môi trường & cạn kiệt tài nguyên:</strong>
              Động cơ lợi nhuận tối đa ngắn hạn dẫn tới khai thác kiệt quệ tài nguyên, không tự giải quyết được "ngoại ứng tiêu cực" sinh thái.
            </div>
            <div class="pres-subcard bg-rose-50/70 border border-rose-200 md:col-span-2">
              <strong class="text-rose-800 block">5. Gây chiến tranh, xung đột & tranh giành địa chính trị – kinh tế:</strong>
              Khuynh hướng bành trướng của tư bản độc quyền, tư bản tài chính dẫn đến phân chia thị trường, nguyên liệu, chiến tranh thương mại và áp đặt lệ thuộc.
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
        <div class="pres-detail-stack">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div class="pres-subcard bg-emerald-50/70 border border-emerald-200">
              <strong class="text-emerald-800 block">1. Về mục tiêu phát triển vì con người:</strong>
              Hướng tới "Dân giàu, nước mạnh, dân chủ, công bằng, văn minh". <span class="text-amber-800 font-semibold">Thực tiễn VN:</span> Tỷ lệ hộ nghèo giảm từ <strong>trên 58% (1993) xuống dưới 3% hiện nay</strong>; HDI liên tục tăng.
            </div>
            <div class="pres-subcard bg-emerald-50/70 border border-emerald-200">
              <strong class="text-emerald-800 block">2. Về sở hữu & thành phần kinh tế:</strong>
              KTNN chủ đạo, KTTN là động lực quan trọng. <span class="text-amber-800 font-semibold">Thực tiễn VN:</span> DNNN giữ hạ tầng chiến lược; tập đoàn tư nhân (<strong>Vingroup, FPT, Thaco...</strong>) và Viettel lớn mạnh.
            </div>
            <div class="pres-subcard bg-emerald-50/70 border border-emerald-200">
              <strong class="text-emerald-800 block">3. Về quản lý & vai trò Nhà nước:</strong>
              Nhà nước pháp quyền XHCN sửa chữa "thất bại thị trường". <span class="text-amber-800 font-semibold">Thực tiễn VN:</span> Giữ ổn định vĩ mô, kiểm soát lạm phát, bình ổn giá điện, y tế, giáo dục trước khủng hoảng.
            </div>
            <div class="pres-subcard bg-emerald-50/70 border border-emerald-200">
              <strong class="text-emerald-800 block">4. Về phân phối & an sinh xã hội:</strong>
              Kết hợp phân phối theo lao động, vốn và phúc lợi. <span class="text-amber-800 font-semibold">Thực tiễn VN:</span> <strong>BHYT toàn dân bao phủ >93% dân số</strong>, Chương trình Giảm nghèo bền vững & Nông thôn mới.
            </div>
            <div class="pres-subcard bg-emerald-50/70 border border-emerald-200 md:col-span-2">
              <strong class="text-emerald-800 block">5. Gắn tăng trưởng với công bằng & bảo vệ môi trường:</strong>
              Không hy sinh công bằng và môi trường để chạy theo tăng trưởng đơn thuần. <span class="text-amber-800 font-semibold">Thực tiễn VN:</span> Cam kết phát thải ròng bằng "0" (<strong>Net Zero 2050</strong>) tại COP26, Luật Bảo vệ Môi trường 2020, kinh tế tuần hoàn.
            </div>
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
        <div class="pres-detail-stack">
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
        <div class="pres-detail-stack">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            <div class="pres-subcard bg-rose-50/70 border border-rose-200">
              <h4 class="text-rose-800 font-bold">1. Yếu tố XHCN chưa phát huy như mong muốn</h4>
              <p class="text-slate-800 mt-1">
                Một số mô hình kinh tế hợp tác xã còn yếu kém, chưa thu hút nông dân. Quản lý Nhà nước còn kẽ hở dẫn tới lũng đoạn thị trường, gian lận thương mại, hàng giả, ô nhiễm môi trường và đa cấp biến tướng.
              </p>
            </div>
            <div class="pres-subcard bg-rose-50/70 border border-rose-200">
              <h4 class="text-rose-800 font-bold">2. Thể chế chưa theo kịp kinh tế số & công nghệ 4.0</h4>
              <p class="text-slate-800 mt-1">
                Sự bùng nổ nhanh của kinh doanh trực tuyến trên mạng xã hội và nền tảng số xuyên biên giới khiến quy định pháp luật và cơ chế quản lý (đặc biệt là quản lý thuế) có thời điểm chưa theo kịp thực tiễn.
              </p>
            </div>
            <div class="pres-subcard bg-rose-50/70 border border-rose-200">
              <h4 class="text-rose-800 font-bold">3. Môi trường kinh doanh chưa thực sự bình đẳng</h4>
              <p class="text-slate-800 mt-1">
                Doanh nghiệp tư nhân vẫn gặp khó khăn khi tiếp cận vốn, đất đai, thông tin và đấu thầu; trong khi một số DNNN được ưu tiên nguồn lực nhưng sử dụng vốn kém hiệu quả, gây thất thoát, lãng phí.
              </p>
            </div>
            <div class="pres-subcard bg-rose-50/70 border border-rose-200">
              <h4 class="text-rose-800 font-bold">4. Khoảng cách giàu nghèo & tệ tham nhũng, lợi ích nhóm</h4>
              <p class="text-slate-800 mt-1">
                Khoảng cách giàu nghèo có xu hướng tăng, nhất là giữa thành thị và nông thôn (thu nhập nông dân còn thấp). Tình trạng quan liêu, tham nhũng, lãng phí và "lợi ích nhóm" chưa được ngăn chặn triệt để.
              </p>
            </div>
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
        <div class="pres-detail-stack">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            <div class="pres-subcard bg-sky-50/70 border border-sky-200">
              <h4 class="text-sky-800 font-bold">1. Nâng cao hiệu quả quản lý & phát huy yếu tố XHCN</h4>
              <p class="text-slate-800 mt-1">
                Tăng cường năng lực giám sát thị trường; xử lý nghiêm gian lận thương mại, hàng giả, đa cấp trái phép. Đổi mới hoạt động hợp tác xã theo hướng hiệu quả, tự chủ, gắn với nhu cầu thực tế của nông dân.
              </p>
            </div>
            <div class="pres-subcard bg-sky-50/70 border border-sky-200">
              <h4 class="text-sky-800 font-bold">2. Hoàn thiện thể chế theo kịp KH-CN & kinh tế số</h4>
              <p class="text-slate-800 mt-1">
                Chủ động bổ sung quy định pháp luật đối với mô hình kinh doanh mới trên nền tảng số và mạng xã hội; hoàn thiện cơ chế quản lý thuế, kiểm soát giao dịch trực tuyến và bảo vệ người tiêu dùng.
              </p>
            </div>
            <div class="pres-subcard bg-sky-50/70 border border-sky-200">
              <h4 class="text-sky-800 font-bold">3. Bảo đảm cạnh tranh bình đẳng giữa các thành phần</h4>
              <p class="text-slate-800 mt-1">
                Tạo điều kiện để DNTN tiếp cận công bằng vốn, đất đai, thông tin, cơ hội đầu tư. Nâng cao quản trị DNNN, công khai tài chính, kiểm soát vốn và xử lý nghiêm các dự án thất thoát, lãng phí.
              </p>
            </div>
            <div class="pres-subcard bg-sky-50/70 border border-sky-200">
              <h4 class="text-sky-800 font-bold">4. Gắn kinh tế với công bằng xã hội & chống tham nhũng</h4>
              <p class="text-slate-800 mt-1">
                Thực hiện tốt an sinh xã hội, giảm nghèo bền vững, nâng cao thu nhập nông thôn. Quyết liệt phòng chống tham nhũng, quan liêu, lãng phí và lợi ích nhóm vì lợi ích chung của nhân dân.
              </p>
            </div>
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
        <div class="pres-detail-stack">
          <div class="pres-subcard bg-amber-50/80 border-2 border-amber-400">
            <h4 class="text-amber-900 font-bold">
              Phán quyết cuối cùng: KTTT định hướng XHCN có giải quyết được những giới hạn lịch sử của CNTB không?
            </h4>
            <p class="text-slate-800 mt-1">
              <strong>Trả lời:</strong> KTTT định hướng XHCN ở Việt Nam <strong>đã xây dựng những cơ chế nhằm khắc phục và hạn chế một phần những giới hạn lịch sử của CNTB</strong> (đa dạng hóa sở hữu, phát huy vai trò điều tiết của Nhà nước, gắn tăng trưởng với tiến bộ và công bằng xã hội), <strong>nhưng chưa thể giải quyết hoàn toàn</strong> do vẫn còn khoảng cách giàu nghèo, bất bình đẳng tiếp cận nguồn lực và hiệu quả vốn nhà nước chưa cao. Khả năng khắc phục cần tiếp tục được hoàn thiện và kiểm chứng qua thực tiễn phát triển.
            </p>
          </div>
          <div class="pres-subcard bg-slate-50 border border-slate-300">
            <h4 class="text-sky-800 font-bold mb-1">Nguồn tài liệu tham khảo chính thống (10 nguồn):</h4>
            <ol class="list-decimal list-inside grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1 text-slate-700 pres-ref-list">
              <li><strong>Bộ GD&ĐT (2021)</strong>, <em>Giáo trình Kinh tế chính trị Mác – Lênin</em>, NXB CTQG Sự thật (Chương 5, tr. 155–171).</li>
              <li><strong>Đảng CSVN (2016)</strong>, <em>Văn kiện Đại hội đại biểu toàn quốc lần thứ XII</em>, NXB CTQG Sự thật.</li>
              <li><strong>Đảng CSVN (2021)</strong>, <em>Văn kiện Đại hội đại biểu toàn quốc lần thứ XIII</em>, Tập 1, NXB CTQG Sự thật.</li>
              <li><strong>Nghị quyết 11-NQ/TW (03/6/2017)</strong> HNTW 5 khóa XII về Hoàn thiện thể chế KTTT ĐHXHCN.</li>
              <li><strong>Hiến pháp nước CHXHCN Việt Nam năm 2013</strong> (Điều 51).</li>
              <li><strong>Mai Thúc Hiệp (2025)</strong>, “Sự phát triển tư duy của Đảng về KTTT ĐHXHCN qua 40 năm đổi mới”, <em>TC KH&CN ĐH Thái Nguyên</em>, 230(11).</li>
              <li><strong>Nguyễn Thế Vinh (2024)</strong>, “Tiếp tục phát triển KTTT ĐHXHCN ở Việt Nam trong kỷ nguyên mới”, <em>TC Quản lý nhà nước</em>.</li>
              <li><strong>Trương Minh Hòa (2022)</strong>, “Tư duy lý luận về nền KTTT ĐHXHCN ở Việt Nam”, <em>TC Quản lý nhà nước</em>.</li>
              <li><strong>Hoàng Thị Quyên (2026)</strong>, “Phát triển kinh tế đất nước theo Nghị quyết Đại hội XIV của Đảng”, <em>TC Quản lý nhà nước</em>.</li>
              <li><strong>Minh Anh (2025)</strong>, “Bộ Chính trị ban hành Nghị quyết phát triển kinh tế tư nhân”, <em>TC Luật sư Việt Nam</em>.</li>
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

  // Danh sách tuyến tính (Playlist 20 hiện vật) phục vụ điều hướng nhảy nhanh trong Bảo Tàng 3D từ Phòng 1 -> Phòng 2 -> Phòng 3
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
