/**
 * =============================================================================
 * TỆP DỮ LIỆU CÂU HỎI TRẮC NGHIỆM (30 CÂU TỪ NGÂN HÀNG CÂU HỎI NHÓM 8)
 * =============================================================================
 * - Gồm 2 câu hỏi Đúng / Sai (options 2 phần tử) và 28 câu hỏi Trắc nghiệm 4 đáp án.
 * - Mỗi phần tử gồm: id, sectionCode, question, options, correctIndex, explanation.
 * =============================================================================
 */
(function (root) {
  const QUIZ_QUESTIONS = [
    {
      id: "q1",
      sectionCode: "Đúng / Sai • Câu 1",
      question: "Kinh tế thị trường không mâu thuẫn với chủ nghĩa xã hội.",
      options: ["Đúng", "Sai"],
      correctIndex: 0,
      explanation:
        "Kinh tế thị trường là thành tựu chung của văn minh nhân loại, không phải sản phẩm riêng có của chủ nghĩa tư bản. Đây là phương thức tổ chức và vận hành nền kinh tế, có thể được sử dụng để thúc đẩy lực lượng sản xuất phát triển và tạo cơ sở vật chất cho chủ nghĩa xã hội. Vì vậy, Việt Nam phát triển kinh tế thị trường nhưng đặt dưới sự lãnh đạo của Đảng, sự quản lý của Nhà nước và định hướng theo mục tiêu xã hội chủ nghĩa.",
    },
    {
      id: "q2",
      sectionCode: "Đúng / Sai • Câu 2",
      question:
        "Đa dạng các hình thức sở hữu là đặc trưng của kinh tế thị trường định hướng xã hội chủ nghĩa.",
      options: ["Đúng", "Sai"],
      correctIndex: 0,
      explanation:
        "Nền kinh tế Việt Nam có nhiều hình thức sở hữu và nhiều thành phần kinh tế cùng tồn tại, phát triển. Trong đó, kinh tế nhà nước giữ vai trò chủ đạo, kinh tế tư nhân là một động lực quan trọng. Các thành phần kinh tế bình đẳng, hợp tác và cạnh tranh theo quy định của pháp luật.",
    },
    {
      id: "q3",
      sectionCode: "Mục 1.1b",
      question:
        "Điền từ ngữ thích hợp vào chỗ trống: Kinh tế thị trường định hướng xã hội chủ nghĩa là nền kinh tế vận hành theo các ...(1)... của thị trường, đồng thời góp phần hướng tới từng bước xác lập một xã hội mà ở đó dân giàu, nước mạnh, ...(2)..., văn minh; có sự điều tiết của Nhà nước do Đảng Cộng sản Việt Nam ...(3)...",
      options: [
        "(1) nguyên tắc; (2) công bằng, dân chủ; (3) lãnh đạo.",
        "(1) quy luật; (2) công bằng, dân chủ; (3) quản lí.",
        "(1) quy luật; (2) dân chủ, công bằng; (3) lãnh đạo.",
        "(1) nguyên tắc; (2) dân chủ, công bằng; (3) lãnh đạo.",
      ],
      correctIndex: 2,
      explanation:
        "Kinh tế thị trường định hướng xã hội chủ nghĩa là nền kinh tế vận hành theo các quy luật của thị trường, đồng thời góp phần hướng tới từng bước xác lập một xã hội mà ở đó dân giàu, nước mạnh, dân chủ, công bằng, văn minh; có sự điều tiết của Nhà nước do Đảng Cộng sản Việt Nam lãnh đạo.",
    },
    {
      id: "q4",
      sectionCode: "Mục 1.1a",
      question:
        "Nền kinh tế thị trường có ưu thế gì đối với hoạt động sản xuất kinh doanh. Chọn ý trả lời sai?",
      options: [
        "Khắc phục những hiện tượng phân hóa sâu sắc trong xã hội.",
        "Tạo thị trường tiêu thụ sản phẩm thỏa mãn nhu cầu tối đa của con người.",
        "Kích thích tính năng động, sáng tạo.",
        "Phát huy tốt các tiềm năng của mọi chủ thể, vùng miền.",
      ],
      correctIndex: 0,
      explanation:
        "Kinh tế thị trường thúc đẩy tính năng động, sáng tạo, đổi mới công nghệ, nâng cao năng suất và chất lượng sản phẩm; đồng thời giúp phân bổ nguồn lực, khai thác tiềm năng của các chủ thể và vùng miền. Tuy nhiên, kinh tế thị trường không tự khắc phục được tình trạng phân hóa giàu nghèo và bất bình đẳng xã hội.",
    },
    {
      id: "q5",
      sectionCode: "Mục 2",
      question:
        "Khẳng định nào dưới đây là đúng khi nói về đặc trưng của nền kinh tế thị trường định hướng xã hội chủ nghĩa ở Việt Nam?",
      options: [
        "Mang các đặc trưng chung vốn có của kinh tế thị trường nói chung, không bao hàm các đặc trưng riêng của Việt Nam.",
        "Vừa bao hàm đầy đủ các đặc trưng chung vốn có của kinh tế thị trường nói chung, vừa có những đặc trưng riêng của Việt Nam.",
        "Không bao hàm đầy đủ các đặc trưng chung vốn có của kinh tế thị trường mà có những đặc trưng riêng của Việt Nam.",
        "Chỉ bao hàm các đặc trưng của nền kinh tế thị trường định hướng xã hội.",
      ],
      correctIndex: 1,
      explanation:
        "Nền kinh tế thị trường định hướng xã hội chủ nghĩa ở Việt Nam vừa mang đầy đủ những đặc trưng chung của kinh tế thị trường như các chủ thể kinh tế độc lập, giá cả theo cung cầu và cạnh tranh; vừa có những đặc trưng riêng phù hợp với định hướng xã hội chủ nghĩa ở Việt Nam, thể hiện qua vai trò quản lý của Nhà nước, đa dạng hình thức sở hữu và gắn tăng trưởng kinh tế với tiến bộ, công bằng xã hội.",
    },
    {
      id: "q6",
      sectionCode: "Mục 1.2c",
      question:
        "Đảng khẳng định: Kinh tế thị trường định hướng xã hội chủ nghĩa ở Việt Nam là mô hình kinh tế tổng quát của thời kỳ quá độ lên chủ nghĩa xã hội ở nước ta tại Đại hội đại biểu toàn quốc lần thứ mấy?",
      options: [
        "Đại hội đại biểu toàn quốc lần thứ VII.",
        "Đại hội đại biểu toàn quốc lần thứ IX.",
        "Đại hội đại biểu toàn quốc lần thứ X.",
        "Đại hội đại biểu toàn quốc lần thứ XI.",
      ],
      correctIndex: 1,
      explanation:
        "Đại hội IX (năm 2001) đánh dấu bước đột phá quan trọng: lần đầu tiên Đảng chính thức xác định kinh tế thị trường định hướng xã hội chủ nghĩa là mô hình kinh tế tổng quát của nước ta trong thời kỳ quá độ lên chủ nghĩa xã hội. Đại hội làm rõ mục đích, chế độ sở hữu, cơ chế vận hành và chế độ phân phối của mô hình này.",
    },
    {
      id: "q7",
      sectionCode: "Mục 1.2b",
      question:
        "Đại hội VI của Đảng (1986) xác định nền kinh tế nước ta có đặc trưng như thế nào?",
      options: [
        "Nền kinh tế kế hoạch hóa tập trung",
        "Nền kinh tế bao cấp",
        "Nền kinh tế tri thức",
        "Nền kinh tế nhiều thành phần",
      ],
      correctIndex: 3,
      explanation:
        "Đại hội VI của Đảng (tháng 12/1986) mở đầu công cuộc đổi mới toàn diện, trong đó đổi mới tư duy kinh tế là trọng tâm. Đại hội chủ trương khôi phục nền kinh tế nhiều thành phần, sử dụng đúng đắn quan hệ hàng hóa – tiền tệ, kiên quyết xóa bỏ cơ chế tập trung quan liêu, bao cấp để chuyển sang hạch toán kinh doanh xã hội chủ nghĩa.",
    },
    {
      id: "q8",
      sectionCode: "Mục 2 • Mục tiêu",
      question:
        "Kinh tế thị trường định hướng xã hội chủ nghĩa hướng tới phát triển lực lượng sản xuất, xây dựng cơ sở vật chất – kỹ thuật của chủ nghĩa xã hội; nâng cao đời sống nhân dân, thực hiện mục tiêu “dân giàu, nước mạnh, dân chủ, công bằng, văn minh”. Đây là nội dung thể hiện đặc trưng nào của kinh tế thị trường định hướng xã hội chủ nghĩa ở Việt Nam?",
      options: [
        "Về quan hệ sở hữu.",
        "Về quan hệ quản lí.",
        "Về mục tiêu.",
        "Về quan hệ phân phối.",
      ],
      correctIndex: 2,
      explanation:
        "Kinh tế thị trường định hướng xã hội chủ nghĩa ở Việt Nam không chỉ hướng đến phát triển kinh tế mà còn nhằm thực hiện những mục tiêu xã hội chủ nghĩa. Cụ thể, nền kinh tế tập trung phát triển lực lượng sản xuất, xây dựng cơ sở vật chất, kỹ thuật cho chủ nghĩa xã hội, đồng thời nâng cao đời sống vật chất và tinh thần của nhân dân. Tất cả những mục tiêu này đều hướng đến xây dựng một xã hội dân giàu, nước mạnh, dân chủ, công bằng, văn minh.",
    },
    {
      id: "q9",
      sectionCode: "Mục 2 • Sở hữu",
      question:
        "Kinh tế thị trường định hướng xã hội chủ nghĩa ở Việt Nam là nền kinh tế có đặc điểm nào sau đây?",
      options: [
        "Có nhiều hình thức sở hữu, nhiều thành phần kinh tế.",
        "Có một hình thức sở hữu, nhiều thành phần kinh tế.",
        "Có nhiều hình thức sở hữu, một thành phần kinh tế.",
        "Có hai hình thức sở hữu, hai thành phần kinh tế.",
      ],
      correctIndex: 0,
      explanation:
        "Kinh tế thị trường định hướng xã hội chủ nghĩa ở Việt Nam là nền kinh tế có nhiều hình thức sở hữu và nhiều thành phần kinh tế cùng tồn tại, phát triển. Các hình thức sở hữu bao gồm sở hữu nhà nước, sở hữu tập thể và sở hữu tư nhân. Tương ứng với đó là các thành phần kinh tế như kinh tế nhà nước, kinh tế tập thể, kinh tế tư nhân và kinh tế có vốn đầu tư nước ngoài. Các thành phần kinh tế đều là bộ phận cấu thành của nền kinh tế quốc dân, bình đẳng trước pháp luật, hợp tác và cạnh tranh lành mạnh để cùng phát triển.",
    },
    {
      id: "q10",
      sectionCode: "Mục 2 • Quản lý",
      question:
        "Nhà nước quản lí và thực hiện cơ chế quản lí là Nhà nước pháp quyền xã hội chủ nghĩa của nhân dân, do nhân dân, vì nhân dân dưới sự lãnh đạo của Đảng Cộng sản, chịu sự làm chủ và giám sát của nhân dân là nội dung thể hiện đặc trưng nào của nền kinh tế thị trường định hướng xã hội chủ nghĩa ở Việt Nam?",
      options: [
        "Về mục tiêu.",
        "Về quan hệ sở hữu và thành phần kinh tế.",
        "Về quan hệ quản lí nền kinh tế.",
        "Về quan hệ phân phối.",
      ],
      correctIndex: 2,
      explanation:
        "Nhà nước quản lí và thực hiện cơ chế quản lí là Nhà nước pháp quyền xã hội chủ nghĩa của nhân dân, do nhân dân, vì nhân dân, dưới sự lãnh đạo của Đảng Cộng sản và chịu sự làm chủ, giám sát của nhân dân. Đây chính là đặc trưng về quan hệ quản lí nền kinh tế, thể hiện vai trò của Nhà nước trong việc điều tiết và định hướng hoạt động kinh tế.",
    },
    {
      id: "q11",
      sectionCode: "Mục 1.4a",
      question:
        "Trong điều kiện nền kinh tế thị trường hiện nay, Nhà nước thông qua cơ chế, chính sách và các công cụ quản lí kinh tế để tác động vào thị trường không nhằm mục đích nào dưới đây?",
      options: [
        "Bảo đảm tính bền vững của các cân đối kinh tế vĩ mô.",
        "Khắc phục những khuyết tật của kinh tế thị trường.",
        "Điều tiết nền kinh tế theo cơ chế kế hoạch hóa tập trung.",
        "Hỗ trợ thị trường trong nước khi cần thiết.",
      ],
      correctIndex: 2,
      explanation:
        "Nhà nước sử dụng pháp luật, chiến lược, kế hoạch, quy hoạch, cơ chế, chính sách và các công cụ kinh tế để tác động vào thị trường, nhằm bảo đảm tính bền vững của các cân đối kinh tế vĩ mô, khắc phục những khuyết tật của kinh tế thị trường và hỗ trợ thị trường trong nước khi cần thiết.",
    },
    {
      id: "q12",
      sectionCode: "Mục 1.4b",
      question:
        "Đảng Cộng sản Việt Nam lãnh đạo nền kinh tế thị trường định hướng xã hội chủ nghĩa thông qua:",
      options: [
        "Pháp luật, chiến lược, kế hoạch và các chủ trương, quyết sách lớn.",
        "Cương lĩnh, đường lối phát triển kinh tế – xã hội và các chủ trương, quyết sách lớn.",
        "Cương lĩnh, pháp luật, chiến lược, kế hoạch và các chủ trương, quyết sách lớn.",
        "Pháp luật, chiến lược, quy hoạch và cơ chế, chính sách và các công cụ kinh tế.",
      ],
      correctIndex: 1,
      explanation:
        "Đảng Cộng sản Việt Nam lãnh đạo nền kinh tế thị trường định hướng xã hội chủ nghĩa thông qua cương lĩnh, đường lối phát triển kinh tế – xã hội và các chủ trương, quyết sách lớn trong từng thời kỳ phát triển của đất nước.",
    },
    {
      id: "q13",
      sectionCode: "Mục 2 • Phân phối",
      question:
        "Nền kinh tế thị trường định hướng xã hội chủ nghĩa thực hiện nhiều hình thức phân phối khác nhau, thực chất là:",
      options: [
        "Thực hiện các lợi ích kinh tế.",
        "Điều chỉnh quan hệ sở hữu.",
        "Thực hiện trách nhiệm kinh tế.",
        "Thực hiện lợi ích xã hội.",
      ],
      correctIndex: 0,
      explanation:
        "Nền kinh tế thị trường định hướng xã hội chủ nghĩa có nhiều hình thức sở hữu khác nhau nên cũng tồn tại nhiều hình thức phân phối tương ứng. Việc thực hiện các hình thức phân phối khác nhau là nhằm giải quyết quan hệ lợi ích kinh tế giữa các chủ thể, bảo đảm lợi ích của người lao động, người góp vốn và toàn xã hội.",
    },
    {
      id: "q14",
      sectionCode: "Mục 1.1a",
      question: "Quan niệm nào không đúng về kinh tế thị trường?",
      options: [
        "Kinh tế thị trường là sản phẩm của Chủ nghĩa tư bản.",
        "Không có nền kinh tế thị trường chung cho mọi quốc gia.",
        "Kinh tế thị trường là hình thức phát triển cao của nền kinh tế hàng hóa.",
        "Kinh tế thị trường là kết quả phát triển lâu dài của lực lượng sản xuất và xã hội hóa các quan hệ kinh tế.",
      ],
      correctIndex: 0,
      explanation:
        "Kinh tế thị trường không phải là sản phẩm riêng có của chủ nghĩa tư bản mà là thành tựu chung của văn minh nhân loại. Nó hình thành từ quá trình phát triển của sản xuất hàng hóa khi phân công lao động xã hội và sự tách biệt về kinh tế giữa các chủ thể sản xuất đạt đến một trình độ nhất định.",
    },
    {
      id: "q15",
      sectionCode: "Mục 1.4",
      question:
        "Nền kinh tế thị trường định hướng xã hội chủ nghĩa ở Việt Nam, để đạt được hệ giá trị toàn diện gồm cả dân giàu, nước mạnh, xã hội dân chủ, công bằng, văn minh thì cần yếu tố nào?",
      options: [
        "Trong xã hội không còn mâu thuẫn giữa các tầng lớp dân cư.",
        "Sự hợp tác và hỗ trợ từ các nước trong hệ thống Chủ nghĩa xã hội.",
        "Vai trò điều tiết của nhà nước dưới sự lãnh đạo của Đảng cộng sản.",
        "Ngân sách Nhà Nước phải đủ mạnh để thực hiện các chính sách phúc lợi.",
      ],
      correctIndex: 2,
      explanation:
        "Để đạt được hệ giá trị toàn diện “dân giàu, nước mạnh, dân chủ, công bằng, văn minh”, nền kinh tế thị trường định hướng xã hội chủ nghĩa ở Việt Nam cần có sự quản lý, điều tiết của Nhà nước dưới sự lãnh đạo của Đảng Cộng sản Việt Nam. Nhà nước sử dụng pháp luật, chiến lược và các chính sách kinh tế để định hướng hoạt động của thị trường, hạn chế những mặt trái như phân hóa giàu nghèo, đồng thời bảo đảm tăng trưởng kinh tế gắn liền với tiến bộ và công bằng xã hội.",
    },
    {
      id: "q16",
      sectionCode: "Mục 1.1a",
      question: "Khẳng định nào dưới đây về kinh tế thị trường là đúng?",
      options: [
        "Kinh tế thị trường là nền kinh tế của chủ nghĩa tư bản.",
        "Kinh tế thị trường là nền kinh tế hàng hóa phát triển ở trình độ cao.",
        "Kinh tế thị trường là mô hình kinh tế mà mọi quốc gia buộc phải tuân theo.",
        "Kinh tế thị trường phản ánh sự phát triển bền vững của xã hội.",
      ],
      correctIndex: 1,
      explanation:
        "Kinh tế thị trường là giai đoạn phát triển cao của nền kinh tế hàng hóa, hình thành khi phân công lao động xã hội và sự tách biệt về kinh tế giữa các chủ thể sản xuất phát triển đến một trình độ nhất định.",
    },
    {
      id: "q17",
      sectionCode: "Mục 2 • Tổng quan",
      question:
        "Kinh tế thị trường định hướng xã hội chủ nghĩa có mấy đặc trưng?",
      options: ["3 đặc trưng", "4 đặc trưng", "5 đặc trưng", "6 đặc trưng"],
      correctIndex: 2,
      explanation:
        "Kinh tế thị trường định hướng xã hội chủ nghĩa ở Việt Nam có 5 đặc trưng cơ bản, gồm: Về mục tiêu phát triển; Về quan hệ sở hữu và thành phần kinh tế; Về quan hệ quản lý nền kinh tế; Về quan hệ phân phối; Về quan hệ giữa gắn tăng trưởng kinh tế với công bằng xã hội.",
    },
    {
      id: "q18",
      sectionCode: "Mục 2 • Công bằng",
      question:
        "Yếu tố nào vừa là điều kiện bảo đảm cho sự phát triển bền vững của nền kinh tế, vừa là mục tiêu thể hiện bản chất tốt đẹp của chế độ xã hội chủ nghĩa?",
      options: [
        "Tiến bộ và công bằng xã hội",
        "Vai trò lãnh đạo của Đảng Cộng sản Việt Nam",
        "Sự quản lý của Nhà nước pháp quyền xã hội chủ nghĩa",
        "Vai trò chủ đạo của thành phần kinh tế nhà nước",
      ],
      correctIndex: 0,
      explanation:
        "Tiến bộ và công bằng xã hội vừa là điều kiện bảo đảm nền kinh tế phát triển ổn định, bền vững, vừa là mục tiêu thể hiện bản chất tốt đẹp của chế độ xã hội chủ nghĩa. Phát triển kinh tế phải luôn đi đôi với nâng cao đời sống nhân dân, thu hẹp bất bình đẳng và bảo đảm mọi người có cơ hội phát triển.",
    },
    {
      id: "q19",
      sectionCode: "Mục 2",
      question:
        "Chọn phương án ĐÚNG về mô hình kinh tế thị trường định hướng xã hội chủ nghĩa ở Việt Nam?",
      options: [
        "Là mô hình kinh tế có đầy đủ các đặc trưng của nền kinh tế thị trường tư bản chủ nghĩa hiện nay",
        "Vừa bao hàm đầy đủ các đặc trưng vốn có của nền kinh tế thị trường nói chung vừa có những đặc trưng riêng của Việt Nam",
        "Là mô hình kinh tế có những đặc trưng riêng của Việt Nam, phù hợp với sự phát triển của lực lượng sản xuất đồng đều giữa các khu vực",
        "Vừa bao hàm các yếu tố tích cực, vừa bao hàm các yếu tố tiêu cực do tác động của độc quyền và cạnh tranh.",
      ],
      correctIndex: 1,
      explanation:
        "Kinh tế thị trường định hướng xã hội chủ nghĩa ở Việt Nam vừa mang những đặc điểm chung của mọi nền kinh tế thị trường, vừa có những đặc trưng riêng. Các đặc trưng riêng thể hiện ở năm mặt: mục tiêu, quan hệ sở hữu và thành phần kinh tế, quan hệ quản lý, quan hệ phân phối, quan hệ giữa tăng trưởng kinh tế với công bằng xã hội.",
    },
    {
      id: "q20",
      sectionCode: "Mục 1.2a",
      question:
        "Tại sao Việt Nam phải phát triển kinh tế thị trường định hướng xã hội chủ nghĩa?",
      options: [
        "Phát triển kinh tế thị trường định hướng xã hội chủ nghĩa là phù hợp với xu hướng phát triển khách quan của Việt Nam trong bối cảnh thế giới hiện nay",
        "Do tính ưu việt của kinh tế thị trường trong thúc đẩy phát triển Việt Nam theo định hướng xã hội chủ nghĩa",
        "Kinh tế thị trường định hướng xã hội chủ nghĩa phù hợp với nguyện vọng dân giàu, nước mạnh, dân chủ, công bằng, văn minh của người dân Việt Nam",
        "Cả A, B và C",
      ],
      correctIndex: 3,
      explanation:
        "Việt Nam phát triển kinh tế thị trường định hướng xã hội chủ nghĩa vì mô hình này phù hợp với xu hướng phát triển khách quan và hội nhập quốc tế, đồng thời phát huy được những ưu thế của kinh tế thị trường trong việc thúc đẩy sản xuất, phát triển kinh tế. Bên cạnh đó, mô hình còn phù hợp với mục tiêu xây dựng chủ nghĩa xã hội và nguyện vọng của nhân dân về một xã hội dân giàu, nước mạnh, dân chủ, công bằng, văn minh.",
    },
    {
      id: "q21",
      sectionCode: "Mục 2 • Quản lý",
      question:
        "Điểm khác biệt về vai trò quản lý của Nhà nước trong nền kinh tế thị trường định hướng xã hội chủ nghĩa ở Việt Nam với những nền kinh tế thị trường trên thế giới?",
      options: [
        "Nhà nước quản lý nền kinh tế bằng chính sách, pháp luật, các công cụ kinh tế",
        "Đảng lãnh đạo, Nhà nước quản lý, nhân dân làm chủ và giám sát",
        "Nhà nước điều tiết nền kinh tế nhằm khắc phục khuyết tật thị trường",
        "Thực hiện chính sách về an sinh xã hội, giảm phân hóa giàu nghèo",
      ],
      correctIndex: 1,
      explanation:
        "Điểm khác biệt của Việt Nam là cơ chế quản lý nền kinh tế theo nguyên tắc Đảng lãnh đạo, Nhà nước quản lý, nhân dân làm chủ và giám sát. Đảng định hướng thông qua cương lĩnh, đường lối và chủ trương phát triển kinh tế – xã hội; Nhà nước quản lý bằng pháp luật, chiến lược, kế hoạch, chính sách và các công cụ kinh tế; nhân dân thực hiện quyền làm chủ và giám sát hoạt động quản lý.",
    },
    {
      id: "q22",
      sectionCode: "Mục 1.4a",
      question:
        "Trình độ, năng lực tổ chức và quản lý nền kinh tế thị trường của nhà nước thực hiện chủ yếu ở khía cạnh nào?",
      options: [
        "Lãnh đạo nền kinh tế phát triển theo chiều rộng",
        "Năng lực xây dựng và thực thi thể chế",
        "Hạn chế thành phần kinh tế tư nhân phát triển",
        "Mức thu nhập, địa vị của con người",
      ],
      correctIndex: 1,
      explanation:
        "Trình độ và năng lực tổ chức, quản lý nền kinh tế thị trường của Nhà nước được thể hiện chủ yếu ở khả năng xây dựng và thực thi thể chế. Nhà nước có vai trò xây dựng, hoàn thiện hệ thống pháp luật, cơ chế, chính sách và bảo đảm chúng được thực hiện hiệu quả trong thực tế, nhằm giúp thị trường vận hành đồng bộ, phát huy mặt tích cực và khắc phục những hạn chế của thị trường.",
    },
    {
      id: "q23",
      sectionCode: "Mục 1.1a",
      question: "Điều kiện ra đời kinh tế thị trường?",
      options: [
        "Lực lượng sản xuất phát triển và xã hội hóa các quan hệ kinh tế",
        "Sự ra đời của tiền tệ làm cho sản xuất hàng hóa phát triển",
        "Nhu cầu trao đổi hàng hóa giữa các quốc gia với nhau",
        "Các chính sách của nhà nước để thúc đẩy nền kinh tế phát triển",
      ],
      correctIndex: 0,
      explanation:
        "Kinh tế thị trường ra đời trên cơ sở sự phát triển của lực lượng sản xuất và quá trình xã hội hóa các quan hệ kinh tế. Khi phân công lao động xã hội ngày càng phát triển, các chủ thể sản xuất trở nên độc lập tương đối về kinh tế, dẫn đến nhu cầu trao đổi hàng hóa thông qua thị trường.",
    },
    {
      id: "q24",
      sectionCode: "Mục 1.1a",
      question:
        "Điền từ thích hợp vào chỗ trống: Kinh tế thị trường là _____, thị trường trong nước quan hệ mật thiết với thị trường quốc tế.",
      options: [
        "Nền kinh tế quy mô nhỏ",
        "Nền kinh tế tập trung",
        "Nền kinh tế khép kín",
        "Nền kinh tế mở",
      ],
      correctIndex: 3,
      explanation:
        "Kinh tế thị trường là nền kinh tế mở, trong đó thị trường trong nước có mối quan hệ mật thiết với thị trường quốc tế thông qua hoạt động xuất nhập khẩu, đầu tư và hội nhập kinh tế. Điều này giúp mở rộng thị trường tiêu thụ, thu hút nguồn lực và thúc đẩy phát triển kinh tế.",
    },
    {
      id: "q25",
      sectionCode: "Mục 1.2b",
      question:
        "Trong giai đoạn trước năm 1986, Hội nghị Trung ương 8 khóa V (năm 1985) đã đề ra chủ trương đột phá nào nhằm tạo tiền đề cho công cuộc đổi mới kinh tế ở Việt Nam?",
      options: [
        "Khẳng định sản xuất hàng hóa tồn tại khách quan và không đối lập với chủ nghĩa xã hội.",
        "Chủ trương khắc phục những khuyết điểm trong quản lý kinh tế nhằm thúc đẩy sản xuất phát triển.",
        "Thực hiện khoán sản phẩm đến nhóm và người lao động trong nông nghiệp.",
        "Xóa bỏ cơ chế tập trung quan liêu, bao cấp, chuyển sang hạch toán kinh doanh.",
      ],
      correctIndex: 3,
      explanation:
        "Hội nghị Trung ương 8 khóa V (năm 1985) chủ trương đổi mới cơ chế quản lý kinh tế, từng bước xóa bỏ cơ chế tập trung quan liêu, bao cấp, chuyển sang hạch toán kinh doanh xã hội chủ nghĩa. Đây là một bước đột phá quan trọng, tạo tiền đề cho đường lối đổi mới được đề ra tại Đại hội VI (năm 1986).",
    },
    {
      id: "q26",
      sectionCode: "Mục 3.1",
      question:
        "Nguyên nhân sâu xa dẫn đến các cuộc khủng hoảng kinh tế chu kỳ và tình trạng lãng phí nguồn lực xã hội trong chủ nghĩa tư bản là gì?",
      options: [
        "Tốc độ phát triển khoa học – kỹ thuật chậm chạp, làm suy giảm năng suất lao động.",
        "Sự can thiệp quá mức của Nhà nước tư sản vào quy luật cung – cầu trên thị trường.",
        "Việc mở rộng hệ thống phúc lợi xã hội làm giảm tỷ suất lợi nhuận của các tập đoàn.",
        "Mâu thuẫn giữa tính xã hội hóa của lực lượng sản xuất với chế độ chiếm hữu tư nhân tư bản chủ nghĩa.",
      ],
      correctIndex: 3,
      explanation:
        "Nguyên nhân sâu xa là mâu thuẫn giữa tính xã hội hóa của lực lượng sản xuất với chế độ chiếm hữu tư nhân tư bản chủ nghĩa. Trong đó, sản xuất ngày càng mang tính xã hội, có sự tham gia của nhiều người và nhiều nguồn lực, nhưng tư liệu sản xuất và kết quả sản xuất chủ yếu thuộc quyền sở hữu tư nhân của các nhà tư bản. Mâu thuẫn này góp phần dẫn đến tình trạng mất cân đối trong sản xuất, khủng hoảng kinh tế chu kỳ và lãng phí nguồn lực xã hội.",
    },
    {
      id: "q27",
      sectionCode: "Mục 2 • Công bằng",
      question:
        "Việc Nhà nước hỗ trợ người nghèo tiếp cận giáo dục, y tế và việc làm thể hiện đặc trưng nào?",
      options: [
        "Về quan hệ sở hữu và thành phần kinh tế.",
        "Về quan hệ quản lý nền kinh tế.",
        "Về quan hệ phân phối.",
        "Về quan hệ giữa gắn tăng trưởng kinh tế với công bằng xã hội.",
      ],
      correctIndex: 3,
      explanation:
        "Thực hiện công bằng xã hội ở nước ta không chỉ dựa vào chính sách điều tiết thu nhập, an sinh xã hội và phúc lợi xã hội mà còn phải tạo ra những điều kiện cần thiết để đảm bảo cho mọi người dân đều có cơ hội như nhau trong việc tiếp cận các dịch vụ xã hội cơ bản như: giáo dục, y tế, việc làm….",
    },
    {
      id: "q28",
      sectionCode: "Mục 1.2c",
      question:
        "Đại hội IX của Đảng Cộng sản Việt Nam (2001) đã có sự phát triển nhận thức về kinh tế thị trường như thế nào?",
      options: [
        "Kinh tế thị trường là sản phẩm riêng có của chủ nghĩa tư bản, do vậy, nước ta không phát triển kinh tế thị trường",
        "Nền kinh tế thị trường là nền kinh tế hàng hóa phát triển ở trình độ cao, do vậy, chỉ phát triển kinh tế thị trường ở khu vực thành thị",
        "Kinh tế thị trường định hướng xã hội chủ nghĩa là mô hình kinh tế tổng quát của thời kì quá độ lên chủ nghĩa xã hội ở nước ta",
        "Kinh tế thị trường chỉ tồn tại ở các cường quốc đế quốc tư bản chủ nghĩa, không phù hợp với nền kinh tế Việt Nam",
      ],
      correctIndex: 2,
      explanation:
        "Đại hội IX của Đảng (năm 2001) đánh dấu bước phát triển quan trọng trong nhận thức về kinh tế thị trường. Lần đầu tiên, Đảng chính thức xác định kinh tế thị trường định hướng xã hội chủ nghĩa là mô hình kinh tế tổng quát trong thời kỳ quá độ lên chủ nghĩa xã hội ở Việt Nam. Qua đó, kinh tế thị trường không còn chỉ được xem là một công cụ hay cơ chế quản lý kinh tế mà được xác định là mô hình kinh tế tổng quát của nước ta.",
    },
    {
      id: "q29",
      sectionCode: "Mục 3.1",
      question:
        "Mâu thuẫn cơ bản nào của chủ nghĩa tư bản là nguyên nhân dẫn đến khủng hoảng kinh tế chu kỳ và lãng phí nguồn lực xã hội?",
      options: [
        "Giữa tính chất xã hội hóa ngày càng cao của lực lượng sản xuất với quan hệ chiếm hữu tư nhân tư bản chủ nghĩa về tư liệu sản xuất.",
        "Giữa vai trò chủ đạo của kinh tế nhà nước với sự phát triển tự phát của kinh tế tập thể và kinh tế tư nhân.",
        "Giữa cung và cầu trên thị trường lao động do xu hướng tập trung hóa tư bản vào các tập đoàn tài phiệt độc quyền.",
        "Giữa tốc độ phát triển chậm của sản xuất nông nghiệp với yêu cầu mở rộng quy mô của sản xuất công nghiệp hiện đại.",
      ],
      correctIndex: 0,
      explanation:
        "Trong chủ nghĩa tư bản, lực lượng sản xuất ngày càng phát triển và mang tính xã hội hóa cao, tức là quá trình sản xuất có sự tham gia và phối hợp của nhiều người, nhiều tổ chức. Tuy nhiên, tư liệu sản xuất chủ yếu vẫn thuộc quyền chiếm hữu tư nhân của các nhà tư bản. Mâu thuẫn này là nguyên nhân sâu xa dẫn đến các cuộc khủng hoảng kinh tế chu kỳ và tình trạng lãng phí nguồn lực xã hội.",
    },
    {
      id: "q30",
      sectionCode: "Mục 3.3 • Kết luận",
      question:
        "Đâu là kết luận chính xác và toàn diện nhất về khả năng giải quyết những giới hạn lịch sử của chủ nghĩa tư bản ở mô hình kinh tế thị trường định hướng xã hội chủ nghĩa của Việt Nam hiện nay?",
      options: [
        "Đã giải quyết triệt để và hoàn toàn mọi giới hạn lịch sử của chủ nghĩa tư bản ngay từ khi thiết lập thành công hệ thống thể chế kinh tế thị trường đồng bộ và hiện đại ở nước ta.",
        "Đã góp phần hạn chế và khắc phục được một phần những giới hạn lịch sử của chủ nghĩa tư bản thông qua việc đa dạng hóa sở hữu, phát huy vai trò điều tiết của Nhà nước và gắn tăng trưởng với công bằng xã hội, nhưng trong thực tiễn vẫn chưa thể giải quyết hoàn toàn.",
        "Hoàn toàn không có khả năng khắc phục bất kỳ khuyết tật hay giới hạn cố hữu nào của chủ nghĩa tư bản do nền kinh tế vẫn phải vận hành tuân theo các quy luật khách quan của cơ chế thị trường.",
        "Đã loại bỏ hoàn toàn mọi khoảng cách giàu nghèo, bất bình đẳng trong tiếp cận nguồn lực và các yếu tố tiêu cực phát sinh từ cơ chế thị trường thông qua hệ thống an sinh xã hội toàn dân.",
      ],
      correctIndex: 1,
      explanation:
        "Mô hình kinh tế thị trường định hướng xã hội chủ nghĩa ở Việt Nam đã xây dựng các cơ chế đa dạng hóa sở hữu, Nhà nước quản lý điều tiết, gắn tăng trưởng kinh tế với tiến bộ và công bằng xã hội nhằm khắc phục và hạn chế một phần các giới hạn của chủ nghĩa tư bản. Tuy nhiên, do thực tiễn vẫn còn tồn tại nhiều hạn chế khoảng cách giàu nghèo, bất bình đẳng tiếp cận nguồn lực, hiệu quả sử dụng vốn nhà nước và chất lượng tăng trưởng chưa cao nên mô hình này chưa thể giải quyết hoàn toàn các giới hạn lịch sử đó.",
    },
  ];

  if (root) {
    root.QUIZ_QUESTIONS = QUIZ_QUESTIONS;
  }
  if (typeof module !== "undefined" && module.exports) {
    module.exports = QUIZ_QUESTIONS;
  }
})(typeof window !== "undefined" ? window : globalThis);
