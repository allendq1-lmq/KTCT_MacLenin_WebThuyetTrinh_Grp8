// presentation/slides-data.js - Dữ liệu 11 Slides Thuyết trình Kinh tế chính trị Mác - Lênin (Nhóm 8 - SS008.R12)
window.PresentationData = (() => {
  const roomNames = {
    1: "Chặng 1 & 2: Bối cảnh & Đường lối",
    2: "Chặng 3: Thực hiện đường lối",
    3: "Chặng 4 & 5: Kết quả & Phán quyết",
  };

  const comparisonTableRows = [
    {
      criteria: "Mục đích sản xuất tối thượng",
      capitalist:
        "Tối đa hóa giá trị thặng dư và lợi nhuận cho giai cấp tư bản, tập đoàn độc quyền.",
      socialist:
        "“Dân giàu, nước mạnh, dân chủ, công bằng, văn minh”; nâng cao đời sống nhân dân.",
    },
    {
      criteria: "Cơ sở sở hữu chủ đạo",
      capitalist:
        "Chiếm hữu tư nhân tư bản chủ nghĩa về tư liệu sản xuất giữ vai trò thống trị.",
      socialist:
        "Đa dạng hình thức sở hữu; kinh tế nhà nước giữ vai trò chủ đạo, kinh tế tư nhân là động lực quan trọng.",
    },
    {
      criteria: "Cơ chế quản lý nền kinh tế",
      capitalist:
        "Nhà nước tư sản can thiệp nhưng chịu sự chi phối của các tập đoàn tư bản, tài phiệt.",
      socialist:
        "Nhà nước pháp quyền xã hội chủ nghĩa quản lý dưới sự lãnh đạo của Đảng Cộng sản Việt Nam.",
    },
    {
      criteria: "Quan hệ phân phối",
      capitalist:
        "Chủ yếu theo quy mô vốn và tài sản sở hữu, làm sâu sắc phân hóa giàu nghèo.",
      socialist:
        "Phân phối theo lao động, hiệu quả kinh tế, theo mức đóng góp vốn và qua phúc lợi xã hội.",
    },
    {
      criteria: "Tăng trưởng và công bằng xã hội",
      capitalist:
        "Đặt tăng trưởng và lợi nhuận lên trên; công bằng xã hội chỉ xử lý bị động ở phía sau.",
      socialist:
        "Gắn tăng trưởng kinh tế với tiến bộ, công bằng xã hội và bảo vệ môi trường trong từng chính sách.",
    },
    {
      criteria: "Hệ quả môi trường và xã hội",
      capitalist:
        "Dễ gây khủng hoảng chu kỳ, lãng phí tài nguyên, suy thoái môi trường và xung đột.",
      socialist:
        "Chủ động khắc phục khuyết tật thị trường, giữ ổn định vĩ mô, phát triển bền vững và bao trùm.",
    },
  ];

  const comparisonTableHtml = `
    <div class="matrix-scroll-guard">
      <table class="pres-comp-table">
        <thead>
          <tr>
            <th class="th-criteria">Tiêu chí so sánh</th>
            <th class="th-cap">Kinh tế thị trường tư bản chủ nghĩa</th>
            <th class="th-soc">Kinh tế thị trường định hướng xã hội chủ nghĩa</th>
          </tr>
        </thead>
        <tbody>
          ${comparisonTableRows
            .map(
              (r) => `
            <tr>
              <td class="td-criteria">${r.criteria}</td>
              <td class="td-cap">${r.capitalist}</td>
              <td class="td-soc">${r.socialist}</td>
            </tr>
          `,
            )
            .join("")}
        </tbody>
      </table>
    </div>
  `;

  const slides = [
    // ================= SLIDE 01: MỞ ĐẦU & CÂU HỎI TRỌNG TÂM =================
    {
      id: "intro-cq",
      room: 1,
      badge: "Kinh Tế Chính Trị Mác - Lênin • Lớp SS008.R12",
      title:
        "“Kinh tế thị trường định hướng xã hội chủ nghĩa có giải quyết được những giới hạn lịch sử của chủ nghĩa tư bản không?”",
      subtitle: "Câu hỏi trọng tâm (CQ)",
      color: "#f59e0b",
      lines: [
        "Học phần: Kinh tế chính trị Mác - Lênin",
        "Lớp học phần: SS008.R12",
        "Nhóm thực hiện: Nhóm 8",
        "Giảng viên hướng dẫn: Nguyễn Anh Khoa",
      ],
      desc: "Mạch lập luận của bài thuyết trình đi qua 5 chặng: Bối cảnh (năm giới hạn lịch sử của chủ nghĩa tư bản) → Đường lối (khái niệm và vai trò lãnh đạo của Đảng, quản lý của Nhà nước) → Thực hiện (năm trụ cột và bảng đối chiếu) → Kết quả (bốn hạn chế và bốn giải pháp) → Phán quyết cuối cùng.",
      fullHtml: `
        <div class="pres-detail-stack">
          <div class="pres-subcard is-sky">
            <h4>Thông tin Nhóm thực hiện &amp; Câu hỏi trọng tâm</h4>
            <p>
              <strong>Nhóm thực hiện:</strong> Nhóm 8 — Lớp <strong>SS008.R12</strong> — Giảng viên hướng dẫn: <strong>Nguyễn Anh Khoa</strong>.<br/>
              <strong>Câu hỏi trọng tâm (CQ):</strong> “Kinh tế thị trường định hướng xã hội chủ nghĩa có giải quyết được những giới hạn lịch sử của chủ nghĩa tư bản không?”
            </p>
          </div>
          <div class="pres-subcard is-amber">
            <h4>Cấu trúc lập luận 5 chặng</h4>
            <p>
              <strong>Chặng 1:</strong> Nhận diện năm giới hạn lịch sử cố hữu của chủ nghĩa tư bản.<br/>
              <strong>Chặng 2:</strong> Xác lập khái niệm và vai trò lãnh đạo của Đảng Cộng sản Việt Nam, quản lý của Nhà nước pháp quyền xã hội chủ nghĩa.<br/>
              <strong>Chặng 3:</strong> Phân tích năm phương diện thực hiện đường lối tại Việt Nam và đối chiếu hai mô hình.<br/>
              <strong>Chặng 4:</strong> Nhìn thẳng bốn hạn chế hiện nay và đề xuất bốn giải pháp khắc phục.<br/>
              <strong>Chặng 5:</strong> Đưa ra phán quyết khoa học trả lời câu hỏi trọng tâm.
            </p>
          </div>
        </div>
      `,
    },

    // ================= SLIDE 02: CHẶNG 1 — NĂM GIỚI HẠN LỊCH SỬ CỦA CHỦ NGHĨA TƯ BẢN =================
    {
      id: "r3-1",
      room: 1,
      badge: "Chặng 1: Bối Cảnh Lịch Sử • Năm Giới Hạn Cố Hữu",
      title: "Năm Giới Hạn Lịch Sử Của Chủ Nghĩa Tư Bản",
      subtitle: "Những khuyết tật bắt nguồn từ chế độ chiếm hữu tư nhân tư bản chủ nghĩa",
      color: "#dc2626",
      lines: [
        "Mục tiêu phát triển: Tối đa hóa lợi nhuận cho thiểu số tư bản; gây xung đột, chiến tranh.",
        "Quan hệ sở hữu: Chiếm hữu tư nhân tư bản chủ nghĩa mâu thuẫn với lực lượng sản xuất xã hội hóa.",
        "Quản lý kinh tế: Khủng hoảng chu kỳ ('sản xuất thừa') và ngoại ứng tiêu cực lên môi trường.",
        "Quan hệ phân phối: Tập trung tài sản vào nhóm độc quyền, làm sâu sắc phân hóa giàu nghèo.",
        "Tăng trưởng và công bằng: Khai thác cạn kiệt tài nguyên thiên nhiên, xử lý công bằng xã hội bị động.",
      ],
      desc: "Dù thúc đẩy mạnh mẽ lực lượng sản xuất và khoa học – kỹ thuật, chủ nghĩa tư bản bộc lộ năm giới hạn cố hữu không thể tự khắc phục trên năm phương diện: mục tiêu, sở hữu, quản lý, phân phối và công bằng xã hội.",
      fullHtml: `
        <div class="pres-detail-stack">
          <div class="pres-detail-grid">
            <div class="pres-subcard is-rose">
              <strong>Về mục tiêu phát triển:</strong>
              Tập trung tối đa hóa giá trị thặng dư, lợi nhuận độc quyền cho thiểu số giai cấp tư bản; khuynh hướng bành trướng gây chiến tranh, tranh giành địa chính trị – kinh tế toàn cầu.
            </div>
            <div class="pres-subcard is-rose">
              <strong>Về quan hệ sở hữu và thành phần kinh tế:</strong>
              Dựa trên chế độ chiếm hữu tư nhân tư bản chủ nghĩa về tư liệu sản xuất, mâu thuẫn gay gắt với tính chất xã hội hóa ngày càng cao của lực lượng sản xuất.
            </div>
            <div class="pres-subcard is-rose">
              <strong>Về quan hệ quản lý nền kinh tế:</strong>
              Mất cân đối vĩ mô gây khủng hoảng chu kỳ (sản xuất dư thừa so với sức mua của xã hội), lãng phí nguồn lực và không tự xử lý được ngoại ứng tiêu cực sinh thái.
            </div>
            <div class="pres-subcard is-rose">
              <strong>Về quan hệ phân phối:</strong>
              Quy luật giá trị thặng dư và tích lũy tư bản làm tài sản tập trung vào nhóm nhỏ độc quyền, người lao động bị bóc lột, gia tăng khoảng cách giàu nghèo.
            </div>
            <div class="pres-subcard is-rose is-span-2">
              <strong>Về gắn tăng trưởng kinh tế với công bằng xã hội:</strong>
              Phân hóa giàu nghèo sâu sắc; động cơ lợi nhuận ngắn hạn dẫn tới khai thác kiệt quệ tài nguyên thiên nhiên và xả thải gây ô nhiễm môi trường nghiêm trọng.
            </div>
          </div>
        </div>
      `,
    },

    // ================= SLIDE 03: CHẶNG 2 — KHÁI NIỆM =================
    {
      id: "r1-1b",
      room: 1,
      badge: "Chặng 2: Đường Lối • Cơ Sở Lý Luận Và Hiến Định",
      title: "Khái Niệm Kinh Tế Thị Trường Định Hướng Xã Hội Chủ Nghĩa",
      subtitle: "Văn kiện Đại hội XIII (2021) và Điều 51 Hiến pháp năm 2013",
      color: "#d97706",
      lines: [
        "Mô hình kinh tế tổng quát của Việt Nam trong thời kỳ quá độ lên chủ nghĩa xã hội.",
        "Vận hành đầy đủ, đồng bộ theo các quy luật khách quan của thị trường hiện đại.",
        "Nhà nước pháp quyền xã hội chủ nghĩa quản lý, Đảng Cộng sản Việt Nam lãnh đạo.",
        "Hướng tới mục tiêu “dân giàu, nước mạnh, dân chủ, công bằng, văn minh”.",
      ],
      desc: "Kinh tế thị trường định hướng xã hội chủ nghĩa vừa tuân thủ các quy luật khách quan của kinh tế thị trường hiện đại, hội nhập quốc tế, vừa được dẫn dắt bởi bản chất và mục tiêu của chủ nghĩa xã hội theo Điều 51 Hiến pháp năm 2013.",
      fullHtml: `
        <div class="pres-detail-stack">
          <div class="pres-detail-grid">
            <div class="pres-subcard is-amber">
              <h4>Bản chất kết hợp hai yếu tố</h4>
              <p>
                <strong>Tính phổ biến:</strong> Vận hành đầy đủ, đồng bộ theo quy luật giá trị, cung – cầu, cạnh tranh của kinh tế thị trường hiện đại.<br/>
                <strong>Tính đặc thù:</strong> Được Nhà nước pháp quyền xã hội chủ nghĩa định hướng, điều tiết dưới sự lãnh đạo của Đảng Cộng sản Việt Nam.
              </p>
            </div>
            <div class="pres-subcard is-emerald">
              <h4>Hiến định tại Điều 51 Hiến pháp năm 2013</h4>
              <p>
                Xác định nền kinh tế Việt Nam là nền kinh tế thị trường định hướng xã hội chủ nghĩa với <strong>nhiều hình thức sở hữu, nhiều thành phần kinh tế</strong>; trong đó <strong>kinh tế nhà nước giữ vai trò chủ đạo</strong>.
              </p>
            </div>
          </div>
          <div class="pres-subcard is-sky">
            <h4>Quan niệm chính thức tại Văn kiện Đại hội XIII (2021):</h4>
            <blockquote class="pres-quote">
              “Kinh tế thị trường định hướng xã hội chủ nghĩa là nền kinh tế thị trường hiện đại, hội nhập quốc tế, vận hành đầy đủ, đồng bộ theo các quy luật của kinh tế thị trường, có sự quản lý của Nhà nước pháp quyền xã hội chủ nghĩa, do Đảng Cộng sản Việt Nam lãnh đạo; việc phát triển nền kinh tế này phải bảo đảm định hướng xã hội chủ nghĩa vì mục tiêu <strong>‘dân giàu, nước mạnh, dân chủ, công bằng, văn minh’</strong>, phù hợp với từng giai đoạn phát triển của đất nước.”
            </blockquote>
          </div>
        </div>
      `,
    },

    // ================= SLIDE 04: CHẶNG 2 — VAI TRÒ CỦA ĐẢNG VÀ NHÀ NƯỚC =================
    {
      id: "r2-role",
      room: 1,
      badge: "Chặng 2: Đường Lối • Chủ Thể Lãnh Đạo Và Điều Tiết",
      title: "Vai Trò Lãnh Đạo Của Đảng Và Quản Lý Của Nhà Nước",
      subtitle: "Cơ chế bảo đảm thị trường vận hành hiệu quả nhưng không chệch hướng xã hội chủ nghĩa",
      color: "#eab308",
      lines: [
        "Đảng đề ra chiến lược phát triển, giữ vững định hướng và mục tiêu xã hội chủ nghĩa.",
        "Đảng lãnh đạo thể chế hóa pháp luật; kiểm tra, phòng chống tham nhũng, tiêu cực.",
        "Nhà nước hoàn thiện pháp luật, giữ ổn định kinh tế vĩ mô và cạnh tranh lành mạnh.",
        "Nhà nước đa phương hóa hội nhập, xây dựng phòng vệ bảo vệ thị trường nội địa.",
      ],
      desc: "Sự kết hợp giữa vai trò lãnh đạo toàn diện của Đảng Cộng sản Việt Nam và quản lý, điều tiết của Nhà nước pháp quyền xã hội chủ nghĩa là nhân tố quyết định giúp khắc phục tính tự phát của thị trường.",
      fullHtml: `
        <div class="pres-detail-stack">
          <div class="pres-subcard is-amber">
            <h4>Vai trò lãnh đạo toàn diện của Đảng Cộng sản Việt Nam</h4>
            <p>
              <strong>Đề ra đường lối, chiến lược:</strong> Hoạch định cương lĩnh phát triển kinh tế luôn đi liền với tiến bộ và công bằng xã hội.<br/>
              <strong>Giữ vững mục tiêu xã hội chủ nghĩa:</strong> Ngăn ngừa tính tự phát, chạy theo lợi nhuận thuần túy, bảo đảm mục tiêu <em>“dân giàu, nước mạnh, dân chủ, công bằng, văn minh”</em>.<br/>
              <strong>Lãnh đạo hoàn thiện thể chế:</strong> Thể chế hóa quan điểm chính trị thành hệ thống pháp luật đồng bộ, minh bạch.<br/>
              <strong>Kiểm tra, giám sát và chỉnh đốn:</strong> Phòng chống tham nhũng, lãng phí, tiêu cực trong lĩnh vực kinh tế – tài chính.
            </p>
          </div>
          <div class="pres-subcard is-sky">
            <h4>Vai trò quản lý, điều tiết của Nhà nước pháp quyền xã hội chủ nghĩa</h4>
            <p>
              Hoàn thiện hệ thống pháp luật phù hợp cam kết quốc tế; bảo đảm <strong>ổn định kinh tế vĩ mô</strong>, cạnh tranh lành mạnh, giữ vững các cân đối lớn và an ninh kinh tế. Đẩy mạnh <strong>đa phương hóa, đa dạng hóa</strong> tránh lệ thuộc một thị trường và hoàn thiện <strong>hệ thống phòng vệ</strong> bảo vệ doanh nghiệp nội địa.
            </p>
          </div>
        </div>
      `,
    },

    // ================= SLIDE 05: CHẶNG 3 — MỤC TIÊU VÀ QUAN HỆ SỞ HỮU =================
    {
      id: "r2-b1",
      room: 2,
      badge: "Chặng 3: Thực Hiện Đường Lối • Mục Tiêu Và Sở Hữu",
      title: "Mục Tiêu Phát Triển Và Quan Hệ Sở Hữu",
      subtitle: "Giải quyết giới hạn về lợi ích thiểu số và độc tôn chiếm hữu tư nhân tư bản chủ nghĩa",
      color: "#059669",
      lines: [
        "Mục tiêu phát triển: Phát triển lực lượng sản xuất đi đôi với quan hệ sản xuất tiến bộ.",
        "Quan hệ sở hữu: Đa dạng hình thức sở hữu, nhiều thành phần kinh tế bình đẳng.",
        "Kinh tế nhà nước giữ vai trò chủ đạo; kinh tế tư nhân là một động lực quan trọng.",
        "Thực tiễn Việt Nam: Giảm nghèo từ trên 58% xuống dưới 3%; phát triển hạ tầng chiến lược.",
      ],
      desc: "Khắc phục chế độ độc tôn chiếm hữu tư nhân tư bản chủ nghĩa, Việt Nam phát triển kinh tế nhiều thành phần với kinh tế nhà nước giữ vai trò chủ đạo và kinh tế tư nhân là động lực quan trọng để phục vụ số đông nhân dân.",
      fullHtml: `
        <div class="pres-detail-stack">
          <div class="pres-subcard is-emerald">
            <h4>Về mục tiêu phát triển vì con người</h4>
            <p>
              Hướng tới mục tiêu “Dân giàu, nước mạnh, dân chủ, công bằng, văn minh”; phát triển lực lượng sản xuất hiện đại đi đôi với quan hệ sản xuất tiến bộ.
              <strong>Thực tiễn Việt Nam:</strong> Tỷ lệ hộ nghèo giảm từ <strong>trên 58% (năm 1993) xuống còn dưới 3% hiện nay</strong>; chỉ số phát triển con người liên tục được cải thiện.
            </p>
          </div>
          <div class="pres-subcard is-sky">
            <h4>Về quan hệ sở hữu và các thành phần kinh tế</h4>
            <p>
              Đa dạng hóa hình thức sở hữu; <strong>kinh tế nhà nước</strong> giữ vai trò chủ đạo nắm giữ ngành then chốt; <strong>kinh tế tập thể</strong> củng cố làm nền tảng; <strong>kinh tế tư nhân</strong> là một động lực quan trọng.
              <strong>Thực tiễn Việt Nam:</strong> Doanh nghiệp nhà nước đảm nhận hạ tầng chiến lược (năng lượng, viễn thông, giao thông trọng điểm); các tập đoàn tư nhân lớn như <strong>Vingroup, FPT, Thaco</strong> đóng góp lớn vào ngân sách và tạo việc làm.
            </p>
          </div>
        </div>
      `,
    },

    // ================= SLIDE 06: CHẶNG 3 — QUẢN LÝ KINH TẾ VÀ QUAN HỆ PHÂN PHỐI =================
    {
      id: "r2-b4",
      room: 2,
      badge: "Chặng 3: Thực Hiện Đường Lối • Quản Lý Và Phân Phối",
      title: "Quản Lý Nền Kinh Tế Và Quan Hệ Phân Phối",
      subtitle: "Giải quyết giới hạn về khủng hoảng chu kỳ và phân cực tài sản xã hội",
      color: "#0284c7",
      lines: [
        "Quản lý kinh tế: Nhà nước pháp quyền xã hội chủ nghĩa điều tiết vĩ mô, chống độc quyền.",
        "Phân phối đầu vào: Bảo đảm công bằng cơ hội tiếp cận nguồn lực phát triển.",
        "Phân phối đầu ra: Theo lao động, hiệu quả kinh tế, vốn đóng góp và phúc lợi xã hội.",
        "Thực tiễn Việt Nam: Kiểm soát lạm phát, bình ổn giá; Bảo hiểm y tế bao phủ hơn 93% dân số.",
      ],
      desc: "Nhà nước pháp quyền xã hội chủ nghĩa sửa chữa thất bại thị trường, ngăn chặn độc quyền bất chính và phân phối lại thành quả tăng trưởng thông qua lao động và mạng lưới an sinh toàn dân.",
      fullHtml: `
        <div class="pres-detail-stack">
          <div class="pres-subcard is-sky">
            <h4>Về quan hệ quản lý nền kinh tế</h4>
            <p>
              Nhà nước pháp quyền xã hội chủ nghĩa quản lý bằng pháp luật, chiến lược, quy hoạch và công cụ kinh tế vĩ mô trên cơ sở tôn trọng quy luật thị trường, chống thao túng của độc quyền và lợi ích nhóm.
              <strong>Thực tiễn Việt Nam:</strong> Duy trì ổn định vĩ mô, kiểm soát lạm phát, điều tiết giá các mặt hàng thiết yếu (điện, y tế, giáo dục) qua các đợt biến động toàn cầu.
            </p>
          </div>
          <div class="pres-subcard is-emerald">
            <h4>Về quan hệ phân phối</h4>
            <p>
              Phân phối công bằng yếu tố đầu vào; phân phối đầu ra chủ yếu theo kết quả lao động, hiệu quả kinh tế, mức đóng góp vốn và thông qua hệ thống an sinh, phúc lợi xã hội.
              <strong>Thực tiễn Việt Nam:</strong> <strong>Bảo hiểm y tế toàn dân bao phủ hơn 93% dân số</strong>, mở rộng bảo hiểm xã hội, triển khai Chương trình giảm nghèo bền vững và xây dựng nông thôn mới.
            </p>
          </div>
        </div>
      `,
    },

    // ================= SLIDE 07: CHẶNG 3 — GẮN TĂNG TRƯỞNG VỚI CÔNG BẰNG XÃ HỘI =================
    {
      id: "r2-b5",
      room: 2,
      badge: "Chặng 3: Thực Hiện Đường Lối • Phát Triển Bền Vững",
      title: "Gắn Tăng Trưởng Kinh Tế Với Công Bằng Xã Hội",
      subtitle: "Giải quyết giới hạn về bất bình đẳng xã hội và suy thoái môi trường",
      color: "#7c3aed",
      lines: [
        "Công bằng xã hội được thực hiện ngay trong từng bước và từng chính sách phát triển.",
        "Không đợi kinh tế phát triển cao mới chia; không hy sinh môi trường lấy tăng trưởng.",
        "Bảo đảm cơ hội bình đẳng tiếp cận giáo dục, y tế và việc làm cho mọi người dân.",
        "Thực tiễn Việt Nam: Cam kết phát thải ròng bằng không năm 2050, Luật Bảo vệ môi trường 2020.",
      ],
      desc: "Khác với chủ nghĩa tư bản xử lý công bằng xã hội bị động ở giai đoạn sau, Việt Nam gắn kết tăng trưởng kinh tế với tiến bộ xã hội và bảo vệ môi trường ngay trong từng chính sách phát triển.",
      fullHtml: `
        <div class="pres-detail-stack">
          <div class="pres-subcard is-amber">
            <h4>Gắn kết ngay từ đầu — Không “tăng trưởng trước, công bằng sau”</h4>
            <p>
              Thực hiện tiến bộ và công bằng xã hội ngay trong từng chính sách, chiến lược, quy hoạch; tạo điều kiện bình đẳng cho mọi người dân tiếp cận dịch vụ cơ bản (giáo dục, y tế, việc làm) để tự cải thiện đời sống.
            </p>
          </div>
          <div class="pres-subcard is-emerald">
            <h4>Không đánh đổi môi trường lấy tăng trưởng thuần túy</h4>
            <p>
              <strong>Thực tiễn Việt Nam:</strong> Việt Nam cam kết mạnh mẽ đạt mức phát thải ròng bằng không (<strong>Net Zero</strong>) vào năm <strong>2050</strong> tại Hội nghị <strong>COP26</strong>, ban hành <strong>Luật Bảo vệ môi trường năm 2020</strong>, đẩy mạnh chuyển đổi năng lượng xanh và kinh tế tuần hoàn.
            </p>
          </div>
        </div>
      `,
    },

    // ================= SLIDE 08: CHẶNG 3 — BẢNG SO SÁNH ĐỐI CHIẾU =================
    {
      id: "r3-table",
      room: 2,
      badge: "Chặng 3: Đối Chiếu Hệ Thống • So Sánh Sáu Tiêu Chí",
      title: "Bảng So Sánh Hai Mô Hình Kinh Tế Thị Trường",
      subtitle: "Đối chiếu trực diện giữa kinh tế thị trường tư bản chủ nghĩa và định hướng xã hội chủ nghĩa",
      color: "#f59e0b",
      lines: [
        "Mục đích sản xuất: Lợi nhuận tư bản đối lập với dân giàu, nước mạnh, văn minh.",
        "Sở hữu: Tư nhân tư bản chủ nghĩa thống trị đối lập với đa sở hữu (kinh tế nhà nước chủ đạo).",
        "Quản lý: Tập đoàn tài phiệt chi phối đối lập với Nhà nước pháp quyền xã hội chủ nghĩa.",
        "Phân phối và bền vững: Phân hóa giàu nghèo đối lập với an sinh bao trùm và bảo vệ sinh thái.",
      ],
      desc: "Tổng hợp đối chiếu sáu tiêu chí bản chất giữa kinh tế thị trường tư bản chủ nghĩa và kinh tế thị trường định hướng xã hội chủ nghĩa ở Việt Nam.",
      fullHtml: `
        <div class="pres-detail-stack">
          ${comparisonTableHtml}
        </div>
      `,
    },

    // ================= SLIDE 09: CHẶNG 4 — BỐN HẠN CHẾ HIỆN NAY =================
    {
      id: "r3-3a",
      room: 3,
      badge: "Chặng 4: Kết Quả Và Phản Biện • Thực Tiễn Khách Quan",
      title: "Bốn Hạn Chế Còn Đọng Lại Hiện Nay Ở Việt Nam",
      subtitle: "Nhìn thẳng thực tiễn thời kỳ quá độ để đánh giá khách quan câu hỏi trọng tâm",
      color: "#e11d48",
      lines: [
        "Yếu tố xã hội chủ nghĩa như hợp tác xã còn yếu; kẽ hở hàng giả, đa cấp, ô nhiễm.",
        "Thể chế và quản lý thuế chưa theo kịp kinh tế số và công nghệ công nghiệp 4.0.",
        "Tiếp cận vốn, đất đai chưa thật bình đẳng; một số doanh nghiệp nhà nước kém hiệu quả.",
        "Khoảng cách giàu nghèo thành thị – nông thôn còn lớn; tham nhũng, lợi ích nhóm.",
      ],
      desc: "Bên cạnh thành tựu nổi bật, thực tiễn vận hành kinh tế thị trường định hướng xã hội chủ nghĩa ở Việt Nam vẫn còn bốn nhóm hạn chế lớn cần thẳng thắn nhìn nhận.",
      fullHtml: `
        <div class="pres-detail-stack">
          <div class="pres-detail-grid">
            <div class="pres-subcard is-rose">
              <h4>Yếu tố xã hội chủ nghĩa chưa phát huy như mong muốn</h4>
              <p>
                Một số mô hình hợp tác xã còn yếu kém, chưa thu hút nông dân. Quản lý Nhà nước còn hạn chế dẫn tới lũng đoạn thị trường, gian lận thương mại, hàng giả, ô nhiễm môi trường và kinh doanh đa cấp biến tướng.
              </p>
            </div>
            <div class="pres-subcard is-rose">
              <h4>Thể chế chưa theo kịp kinh tế số và công nghệ 4.0</h4>
              <p>
                Hoạt động kinh doanh trực tuyến trên mạng xã hội và nền tảng số phát triển nhanh khiến quy định pháp luật và quản lý thuế có thời điểm chưa theo kịp thực tiễn.
              </p>
            </div>
            <div class="pres-subcard is-rose">
              <h4>Môi trường kinh doanh chưa thực sự bình đẳng</h4>
              <p>
                Doanh nghiệp tư nhân còn khó tiếp cận vốn, đất đai, thông tin và đấu thầu; trong khi một số doanh nghiệp nhà nước được ưu tiên nguồn lực nhưng sử dụng vốn kém hiệu quả, thua lỗ, thất thoát.
              </p>
            </div>
            <div class="pres-subcard is-rose">
              <h4>Bất bình đẳng xã hội và quản lý kinh tế còn bất cập</h4>
              <p>
                Khoảng cách giàu nghèo giữa thành thị và nông thôn có xu hướng gia tăng (thu nhập nông dân còn thấp). Tình trạng quan liêu, tham nhũng, lãng phí và lợi ích nhóm chưa bị ngăn chặn triệt để.
              </p>
            </div>
          </div>
        </div>
      `,
    },

    // ================= SLIDE 10: CHẶNG 4 — BỐN GIẢI PHÁP KHẮC PHỤC =================
    {
      id: "r3-3b",
      room: 3,
      badge: "Chặng 4: Kết Quả Và Phản Biện • Hướng Hoàn Thiện",
      title: "Bốn Giải Pháp Khắc Phục Những Hạn Chế",
      subtitle: "Hoàn thiện đồng bộ thể chế để phát huy tính ưu việt của mô hình",
      color: "#0284c7",
      lines: [
        "Tăng cường giám sát thị trường và đổi mới hợp tác xã theo hướng tự chủ, hiệu quả.",
        "Bổ sung pháp luật và quản lý thuế phù hợp với nền tảng số, kinh tế công nghiệp 4.0.",
        "Bình đẳng hóa tiếp cận vốn, đất đai cho doanh nghiệp tư nhân; minh bạch doanh nghiệp nhà nước.",
        "Đẩy mạnh an sinh nông thôn bền vững; quyết liệt phòng chống tham nhũng, lợi ích nhóm.",
      ],
      desc: "Bốn giải pháp trọng tâm nhằm tháo gỡ bốn điểm nghẽn hiện nay, nâng cao hiệu lực quản lý của Nhà nước và bảo đảm công bằng xã hội.",
      fullHtml: `
        <div class="pres-detail-stack">
          <div class="pres-detail-grid">
            <div class="pres-subcard is-sky">
              <h4>Nâng cao quản lý Nhà nước và phát huy yếu tố xã hội chủ nghĩa</h4>
              <p>
                Giám sát chặt thị trường, xử lý nghiêm gian lận thương mại, hàng giả, đa cấp trái phép; đổi mới hợp tác xã theo hướng tự chủ, hiệu quả, gắn với nhu cầu thực tế.
              </p>
            </div>
            <div class="pres-subcard is-sky">
              <h4>Xây dựng thể chế phù hợp khoa học – công nghệ</h4>
              <p>
                Bổ sung quy định pháp luật cho kinh doanh nền tảng số, mạng xã hội; hoàn thiện quản lý thuế, kiểm soát giao dịch trực tuyến và bảo vệ quyền lợi người tiêu dùng.
              </p>
            </div>
            <div class="pres-subcard is-sky">
              <h4>Bảo đảm cạnh tranh bình đẳng giữa các thành phần kinh tế</h4>
              <p>
                Tạo điều kiện để doanh nghiệp tư nhân tiếp cận công bằng vốn, đất đai, thông tin và đầu tư. Nâng cao quản trị doanh nghiệp nhà nước, công khai tài chính và xử lý nghiêm dự án thất thoát.
              </p>
            </div>
            <div class="pres-subcard is-sky">
              <h4>Gắn kinh tế với công bằng xã hội và chống tham nhũng</h4>
              <p>
                Đẩy mạnh an sinh, giảm nghèo bền vững, nâng cao thu nhập nông thôn; quyết liệt phòng chống tham nhũng, quan liêu, lãng phí và lợi ích nhóm.
              </p>
            </div>
          </div>
        </div>
      `,
    },

    // ================= SLIDE 11: CHẶNG 5 — PHÁN QUYẾT CUỐI CÙNG (SLIDE ĐỘC LẬP) =================
    {
      id: "r3-verdict",
      room: 3,
      badge: "Chặng 5: Phán Quyết Cuối Cùng • Kết Luận Khoa Học",
      title: "Phán Quyết Cuối Cùng Về Câu Hỏi Trọng Tâm",
      subtitle: "“Kinh tế thị trường định hướng xã hội chủ nghĩa có giải quyết được những giới hạn lịch sử của chủ nghĩa tư bản không?”",
      color: "#d97706",
      lines: [
        "Đã khắc phục và hạn chế một phần căn bản những giới hạn lịch sử của chủ nghĩa tư bản.",
        "Cơ chế: Đa dạng hóa sở hữu, điều tiết của Nhà nước, gắn tăng trưởng với an sinh xã hội.",
        "Chưa thể giải quyết hoàn toàn vì vẫn còn bốn hạn chế trong thực tiễn vận hành.",
        "Cần tiếp tục hoàn thiện thể chế và kiểm chứng qua thực tiễn phát triển đất nước.",
      ],
      desc: "Phán quyết cuối cùng: Kinh tế thị trường định hướng xã hội chủ nghĩa ở Việt Nam đã góp phần hạn chế và khắc phục một phần những giới hạn lịch sử của chủ nghĩa tư bản, nhưng chưa thể giải quyết hoàn toàn và cần tiếp tục hoàn thiện, kiểm chứng qua thực tiễn phát triển.",
      fullHtml: `
        <div class="pres-detail-stack">
          <div class="pres-subcard is-amber">
            <h4>Kết luận trả lời Câu hỏi trọng tâm (CQ):</h4>
            <p>
              <strong>Trả lời:</strong> Kinh tế thị trường định hướng xã hội chủ nghĩa ở Việt Nam <strong>đã xây dựng những cơ chế nhằm khắc phục và hạn chế một phần những giới hạn của chủ nghĩa tư bản</strong> (thông qua đa dạng hóa sở hữu, phát huy vai trò quản lý – điều tiết của Nhà nước, gắn tăng trưởng với tiến bộ, công bằng xã hội và phúc lợi). Tuy nhiên, trong thực tiễn vẫn còn đối mặt với khoảng cách giàu nghèo, bất bình đẳng tiếp cận nguồn lực và hiệu quả vốn nhà nước chưa cao.<br/>
              <strong>Vì vậy:</strong> Mô hình đã góp phần hạn chế và khắc phục <strong>một phần</strong> những giới hạn lịch sử của chủ nghĩa tư bản, <strong>nhưng chưa thể giải quyết hoàn toàn</strong>; khả năng khắc phục cần tiếp tục được đánh giá và kiểm chứng qua thực tiễn phát triển.
            </p>
          </div>
          <div class="pres-subcard is-neutral">
            <h4>Nguồn tài liệu tham khảo chính thống (10 nguồn):</h4>
            <ol class="pres-ref-list">
              <li><strong>Bộ Giáo dục và Đào tạo (2021)</strong>, <em>Giáo trình Kinh tế chính trị Mác – Lênin</em>, Nhà xuất bản Chính trị quốc gia Sự thật (Chương 5, tr. 155–171).</li>
              <li><strong>Đảng Cộng sản Việt Nam (2016)</strong>, <em>Văn kiện Đại hội đại biểu toàn quốc lần thứ XII</em>, Nhà xuất bản Chính trị quốc gia Sự thật.</li>
              <li><strong>Đảng Cộng sản Việt Nam (2021)</strong>, <em>Văn kiện Đại hội đại biểu toàn quốc lần thứ XIII</em>, Tập 1, Nhà xuất bản Chính trị quốc gia Sự thật.</li>
              <li><strong>Nghị quyết số 11-NQ/TW (03/6/2017)</strong> Hội nghị Trung ương 5 khóa XII về Hoàn thiện thể chế kinh tế thị trường định hướng xã hội chủ nghĩa.</li>
              <li><strong>Hiến pháp nước Cộng hòa xã hội chủ nghĩa Việt Nam năm 2013</strong> (Điều 51).</li>
              <li><strong>Mai Thúc Hiệp (2025)</strong>, “Sự phát triển tư duy của Đảng về kinh tế thị trường định hướng xã hội chủ nghĩa qua 40 năm đổi mới”, <em>Tạp chí Khoa học và Công nghệ Đại học Thái Nguyên</em>, 230(11).</li>
              <li><strong>Nguyễn Thế Vinh (2024)</strong>, “Tiếp tục phát triển kinh tế thị trường định hướng xã hội chủ nghĩa ở Việt Nam trong kỷ nguyên mới”, <em>Tạp chí Quản lý nhà nước</em>.</li>
              <li><strong>Trương Minh Hòa (2022)</strong>, “Tư duy lý luận về nền kinh tế thị trường định hướng xã hội chủ nghĩa ở Việt Nam”, <em>Tạp chí Quản lý nhà nước</em>.</li>
              <li><strong>Hoàng Thị Quyên (2026)</strong>, “Phát triển kinh tế đất nước theo Nghị quyết Đại hội XIV của Đảng”, <em>Tạp chí Quản lý nhà nước</em>.</li>
              <li><strong>Minh Anh (2025)</strong>, “Bộ Chính trị ban hành Nghị quyết phát triển kinh tế tư nhân”, <em>Tạp chí Luật sư Việt Nam</em>.</li>
            </ol>
          </div>
        </div>
      `,
    },
  ];

  return {
    roomNames,
    comparisonTableRows,
    comparisonTableHtml,
    slides,
    playlist: slides,
  };
})();