/**
 * =============================================================================
 * TỆP DỮ LIỆU CÂU HỎI TRẮC NGHIỆM (TÁCH RIÊNG KHỎI CODE GIAO DIỆN)
 * =============================================================================
 * HƯỚNG DẪN CHỈNH SỬA / THAY THẾ BỘ CÂU HỎI CHÍNH THỨC CHO NHÓM:
 * - Bạn chỉ cần chỉnh sửa hoặc thay mới các phần tử trong mảng `QUIZ_QUESTIONS`
 *   ngay bên dưới mà không cần đụng vào `index.html` hay `js/quiz.js`.
 * - Mỗi câu hỏi gồm đúng 5–6 trường dữ liệu:
 *   + id           : Mã định danh duy nhất (vd: "q1", "q2", ...)
 *   + sectionCode  : Mục kiến thức tương ứng trong Bảo Tàng 3D (tùy chọn hiển thị)
 *   + question     : Nội dung câu hỏi trắc nghiệm
 *   + options      : Mảng đúng 4 phương án trả lời [A, B, C, D]
 *   + correctIndex : Chỉ số đáp án đúng tính từ 0 (0 = A, 1 = B, 2 = C, 3 = D)
 *   + explanation  : Giải thích ngắn gọn lý do đáp án đó đúng (hiện ngay sau khi chọn)
 * =============================================================================
 */
(function (root) {
  const QUIZ_QUESTIONS = [
    {
      id: "q1",
      sectionCode: "Mục 1.1a",
      question:
        "Theo nội dung trưng bày Mục 1.1a trong Bảo Tàng 3D, nhận định nào phản ánh ĐÚNG nhất bản chất và nguồn gốc của kinh tế thị trường nói chung?",
      options: [
        "Là sản phẩm riêng có của chủ nghĩa tư bản, không thể tồn tại ở các chế độ xã hội khác",
        "Là giai đoạn phát triển cao của kinh tế hàng hóa và là thành tựu chung của văn minh nhân loại",
        "Vận hành hoàn toàn theo mệnh lệnh hành chính thay cho các quy luật giá trị và cung – cầu",
        "Chỉ có duy nhất một mô hình tự do kiểu Hoa Kỳ áp dụng chung cho mọi quốc gia trên thế giới",
      ],
      correctIndex: 1,
      explanation:
        "Theo Mục 1.1a, kinh tế thị trường là giai đoạn phát triển cao của kinh tế hàng hóa, vận hành bởi các quy luật giá trị, cung – cầu, cạnh tranh, lưu thông tiền tệ và là thành tựu chung của văn minh nhân loại chứ không phải sản phẩm riêng của chủ nghĩa tư bản.",
    },
    {
      id: "q2",
      sectionCode: "Mục 1.1b",
      question:
        "Theo Văn kiện Đại hội XIII (2021) và Điều 51 Hiến pháp 2013 (Mục 1.1b), nền kinh tế thị trường định hướng xã hội chủ nghĩa ở Việt Nam có đặc điểm cốt lõi nào sau đây?",
      options: [
        "Xóa bỏ hoàn toàn khu vực kinh tế tư nhân để tập trung duy nhất thành phần kinh tế nhà nước",
        "Tách rời hoàn toàn khỏi các quy luật thị trường và hội nhập kinh tế quốc tế",
        "Vận hành đầy đủ theo quy luật thị trường, có sự quản lý của Nhà nước pháp quyền XHCN dưới sự lãnh đạo của Đảng vì mục tiêu 'dân giàu, nước mạnh, dân chủ, công bằng, văn minh'",
        "Ưu tiên tối đa hóa lợi nhuận của các tập đoàn độc quyền trước mọi vấn đề an sinh xã hội",
      ],
      correctIndex: 2,
      explanation:
        "Mục 1.1b nêu rõ: KTTT định hướng XHCN ở Việt Nam vừa vận hành đầy đủ, đồng bộ theo các quy luật thị trường, vừa có sự quản lý của Nhà nước pháp quyền XHCN do Đảng Cộng sản Việt Nam lãnh đạo, trong đó kinh tế nhà nước giữ vai trò chủ đạo.",
    },
    {
      id: "q3",
      sectionCode: "Mục 1.2b – 1.2c",
      question:
        "Cột mốc lịch sử nào trong tư duy lý luận của Đảng (Mục 1.2c) lần đầu tiên chính thức xác định 'Kinh tế thị trường định hướng xã hội chủ nghĩa' là mô hình kinh tế tổng quát của Việt Nam trong thời kỳ quá độ lên CNXH?",
      options: [
        "Đại hội VI của Đảng (năm 1986)",
        "Đại hội IX của Đảng (năm 2001)",
        "Chỉ thị 100-CT/TW (năm 1981)",
        "Hội nghị Trung ương 8 khóa V (năm 1985)",
      ],
      correctIndex: 1,
      explanation:
        "Nếu Đại hội VI (1986) mở đầu Đổi mới và thừa nhận kinh tế hàng hóa nhiều thành phần, thì tại Đại hội IX (2001), Đảng ta mới chính thức xác lập KTTT định hướng XHCN là mô hình kinh tế tổng quát của nước ta trong thời kỳ quá độ lên CNXH (Mục 1.2c).",
    },
    {
      id: "q4",
      sectionCode: "Mục 1.3",
      question:
        "Minh chứng thực tiễn nào năm 2024 được trưng bày ở Mục 1.3 khẳng định tính ưu việt thúc đẩy lực lượng sản xuất của mô hình KTTT định hướng XHCN tại Việt Nam?",
      options: [
        "Quy mô GDP đạt ~476,3 tỷ USD (xếp hạng 33 thế giới), ký kết 17 FTA và được 73 quốc gia công nhận là nền kinh tế thị trường",
        "Nền kinh tế đóng cửa tự cung tự cấp hoàn toàn để tránh mọi biến động thương mại toàn cầu",
        "Chỉ tham gia 1 hiệp định thương mại song phương và giữ GDP bình quân dưới 1.000 USD/người",
        "Không áp dụng cơ chế 'khâu trung gian' và quay lại cơ chế bao cấp hiện vật trước năm 1986",
      ],
      correctIndex: 0,
      explanation:
        "Theo số liệu trưng bày năm 2024 tại Mục 1.3, Việt Nam đạt quy mô GDP ~476,3 tỷ USD (hạng 33 thế giới), GDP bình quân đầu người ~4.700 USD, đã ký 17 FTA với hơn 60 đối tác và được 73 quốc gia công nhận là nền kinh tế thị trường.",
    },
    {
      id: "q5",
      sectionCode: "Mục 1.4a – 1.4b",
      question:
        "Trong cơ chế vận hành KTTT định hướng XHCN (Mục 1.4a & 1.4b), nội dung nào KHÔNG thuộc vai trò quản lý vĩ mô của Nhà nước pháp quyền XHCN và sự lãnh đạo của Đảng?",
      options: [
        "Hoàn thiện hệ thống pháp luật tương thích cam kết quốc tế và giữ vững các cân đối lớn, an ninh kinh tế",
        "Kiến tạo môi trường thuận lợi cho doanh nghiệp, khuyến khích khởi nghiệp và đổi mới sáng tạo",
        "Thay thế hoàn toàn vai trò của thị trường bằng cách định giá cứng mọi mặt hàng tiêu dùng hàng ngày",
        "Định hướng giữ vững mục tiêu XHCN, gắn tăng trưởng kinh tế với công bằng xã hội và phòng chống tham nhũng",
      ],
      correctIndex: 2,
      explanation:
        "Theo Mục 1.4a và 1.4b, Nhà nước pháp quyền XHCN quản lý vĩ mô bằng pháp luật, ổn định kinh tế, kiến tạo đổi mới sáng tạo và đa phương hóa kinh tế đối ngoại; không dùng mệnh lệnh hành chính áp đặt giá thay thế hoàn toàn quy luật thị trường.",
    },
  ];

  if (root) {
    root.QUIZ_QUESTIONS = QUIZ_QUESTIONS;
  }
  if (typeof module !== "undefined" && module.exports) {
    module.exports = QUIZ_QUESTIONS;
  }
})(typeof window !== "undefined" ? window : globalThis);
