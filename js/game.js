// js/game.js - Engine Game Thể Chế (Reigns) - Chế độ NGẪU NHIÊN 10 năm / 30 thẻ bài kèm Hiệu ứng Hình ảnh, Âm thanh & BXH Online
const ReignsGame = (() => {
  const categoryLabels = {
    all: "NGẪU NHIÊN (10 năm / 30 thẻ bài)",
    1: "Nhóm 1: Sở hữu & Thành phần kinh tế",
    2: "Nhóm 2: Quản lý giá cả & Điều tiết vĩ mô",
    3: "Nhóm 3: Lao động, tiền lương & Phân phối",
    4: "Nhóm 4: Môi trường, tài nguyên & Phát triển bền vững",
    5: "Nhóm 5: Khoa học công nghệ & Chuyển đổi số",
    6: "Nhóm 6: Hội nhập kinh tế quốc tế & An ninh kinh tế",
  };

  const reignsDeck = [
    // ================= NHÓM 1: SỞ HỮU VÀ THÀNH PHẦN KINH TẾ =================
    {
      id: "01",
      categoryId: 1,
      categoryName: categoryLabels[1],
      speakerTitle: "Ủy ban Quản lý vốn Nhà nước",
      speakerName: "Trần Đình Nam",
      dialogue:
        "Tổng công ty viễn thông nhà nước chuẩn bị cổ phần hóa. Nhiều quỹ đầu tư quốc tế đề nghị mua đứt 65% cổ phần với giá cao hơn 30% giá khởi điểm, nhưng đòi quyền kiểm soát hạ tầng mạng lõi.",
      left: {
        label: "Bán Chi Phối Thu Ngân Sách",
        effects: { growth: +25, equity: -15, environment: 0, stability: -25 },
        quality: "wrong",
      },
      right: {
        label: "Giữ Cổ Phần Chi Phối Nhà Nước",
        effects: { growth: -10, equity: +15, environment: 0, stability: +20 },
        quality: "correct",
      },
    },
    {
      id: "02",
      categoryId: 1,
      categoryName: categoryLabels[1],
      speakerTitle: "Hiệp hội Bán lẻ Trong nước",
      speakerName: "Vũ Minh Thảo",
      dialogue:
        "Tập đoàn thương mại đa quốc gia đang ồ ạt thâu tóm các chuỗi siêu thị nội địa và ép doanh nghiệp sản xuất trong nước tăng chiết khấu lên 35%, có nguy cơ bóp chết hàng Việt.",
      left: {
        label: "Tôn Trọng Cạnh Tranh Tự Do",
        effects: { growth: +15, equity: -20, environment: -5, stability: -15 },
        quality: "wrong",
      },
      right: {
        label: "Kích Hoạt Luật Chống Độc Quyền",
        effects: { growth: -15, equity: +20, environment: 0, stability: +15 },
        quality: "correct",
      },
    },
    {
      id: "03",
      categoryId: 1,
      categoryName: categoryLabels[1],
      speakerTitle: "Cục Đầu tư Nước ngoài",
      speakerName: "Lê Hoàng Bách",
      dialogue:
        "Một tập đoàn công nghệ toàn cầu đề xuất đầu tư dự án 3 tỷ USD nhưng yêu cầu miễn toàn bộ thuế doanh nghiệp trong 15 năm và miễn tiền thuê đất 30 năm, vượt xa khung ưu đãi thông thường.",
      left: {
        label: "Chấp Thuận Ưu Đãi Ngoại Lệ",
        effects: { growth: +25, equity: -20, environment: -10, stability: -10 },
        quality: "wrong",
      },
      right: {
        label: "Giữ Khung Bình Đẳng Thuế",
        effects: { growth: -15, equity: +20, environment: +5, stability: +15 },
        quality: "correct",
      },
    },
    {
      id: "04",
      categoryId: 1,
      categoryName: categoryLabels[1],
      speakerTitle: "Ban Quản lý Dự án Đô thị",
      speakerName: "Nguyễn Văn Kiên",
      dialogue:
        "Doanh nghiệp bất động sản xin chuyển đổi 150 ha đất nông nghiệp màu mỡ của xã viên sang đất xây dựng khu nghỉ dưỡng sinh thái cao cấp, cam kết nộp ngân sách địa phương hàng nghìn tỷ đồng.",
      left: {
        label: "Thu Hồi Đất Chuyển Đổi Dự Án",
        effects: { growth: +20, equity: -25, environment: -20, stability: -20 },
        quality: "wrong",
      },
      right: {
        label: "Giữ Đất Nông Nghiệp Cho Dân",
        effects: { growth: -10, equity: +20, environment: +15, stability: +10 },
        quality: "correct",
      },
    },
    {
      id: "05",
      categoryId: 1,
      categoryName: categoryLabels[1],
      speakerTitle: "Công ty Quản lý Tài sản (VAMC)",
      speakerName: "Phan Thanh Trúc",
      dialogue:
        "Một tập đoàn tư nhân lớn đang ôm khối nợ xấu hàng chục nghìn tỷ đồng tại hệ thống ngân hàng. Họ đề nghị Nhà nước đứng ra bảo lãnh và mua lại toàn bộ nợ bằng ngân sách công để cứu doanh nghiệp khỏi phá sản.",
      left: {
        label: "Dùng Ngân Sách Mua Lại Nợ",
        effects: { growth: +10, equity: -30, environment: 0, stability: +15 },
        quality: "wrong",
      },
      right: {
        label: "Buộc Siết Nợ & Tự Phá Sản",
        effects: { growth: -20, equity: +20, environment: 0, stability: -15 },
        quality: "correct",
      },
    },

    // ================= NHÓM 2: QUẢN LÝ GIÁ CẢ VÀ ĐIỀU TIẾT VĨ MÔ =================
    {
      id: "06",
      categoryId: 2,
      categoryName: categoryLabels[2],
      speakerTitle: "Cục Quản lý Giá - Bộ Tài chính",
      speakerName: "Đỗ Doãn Hoàng",
      dialogue:
        "Giá xăng dầu thế giới tăng vọt 40% đe dọa đẩy lạm phát trong nước lên cao và đình trệ giao thương. Doanh nghiệp bán lẻ xăng dầu xin phép đóng cửa cây xăng nếu không được tăng giá bán lẻ ngay lập tức.",
      left: {
        label: "Thả Nổi Giá Theo Thị Trường",
        effects: { growth: -10, equity: -20, environment: +5, stability: -20 },
        quality: "wrong",
      },
      right: {
        label: "Xả Quỹ Bình Ổn & Giảm Thuế",
        effects: { growth: +10, equity: +15, environment: -5, stability: +15 },
        quality: "correct",
      },
    },
    {
      id: "07",
      categoryId: 2,
      categoryName: categoryLabels[2],
      speakerTitle: "Tập đoàn Điện lực",
      speakerName: "Hoàng Minh Sơn",
      dialogue:
        "Chi phí nguyên liệu đầu vào tăng cao khiến ngành điện chịu lỗ lớn. Ngành đề xuất tăng ngay giá bán lẻ điện lên 18% để bù đắp thâm hụt và có vốn đầu tư lưới điện mới.",
      left: {
        label: "Phê Duyệt Tăng Giá Điện Ngay",
        effects: { growth: -15, equity: -20, environment: +10, stability: -15 },
        quality: "wrong",
      },
      right: {
        label: "Cấp Bù Lỗ & Giữ Ổn Định Giá",
        effects: { growth: +10, equity: +15, environment: -5, stability: +10 },
        quality: "correct",
      },
    },
    {
      id: "08",
      categoryId: 2,
      categoryName: categoryLabels[2],
      speakerTitle: "Tổng cục Dự trữ Nhà nước",
      speakerName: "Đặng Hữu Tài",
      dialogue:
        "Mất mùa diện rộng khiến giá gạo trên thị trường nội địa tăng 35%, đồng thời giá gạo xuất khẩu chạm đỉnh lịch sử. Thương lái ráo riết thu gom gạo để gom bán ra nước ngoài nhằm kiếm lời khủng.",
      left: {
        label: "Thả Tự Do Xuất Khẩu Gạo",
        effects: { growth: +20, equity: -25, environment: -10, stability: -20 },
        quality: "wrong",
      },
      right: {
        label: "Xả Kho Dự Trữ & Hạn Ngạch Xuất",
        effects: { growth: -10, equity: +25, environment: 0, stability: +20 },
        quality: "correct",
      },
    },
    {
      id: "09",
      categoryId: 2,
      categoryName: categoryLabels[2],
      speakerTitle: "Ngân hàng Nhà nước",
      speakerName: "Phạm Tấn Đạt",
      dialogue:
        "Dòng tiền đầu cơ đang ồ ạt đổ vào đất nền và căn hộ cao cấp, đẩy giá nhà vượt xa thu nhập thực tế. Các chủ đầu tư yêu cầu tiếp tục nới room tín dụng để duy trì tính thanh khoản.",
      left: {
        label: "Nới Room Tín Dụng Địa Ốc",
        effects: { growth: +20, equity: -25, environment: -10, stability: -25 },
        quality: "wrong",
      },
      right: {
        label: "Siết Tín Dụng & Đánh Thuế Lũy Tiến",
        effects: { growth: -15, equity: +20, environment: +5, stability: +20 },
        quality: "correct",
      },
    },
    {
      id: "10",
      categoryId: 2,
      categoryName: categoryLabels[2],
      speakerTitle: "Cục Giám sát Bảo hiểm & Ngân hàng",
      speakerName: "Bùi Tuấn Nghĩa",
      dialogue:
        "Một ngân hàng thương mại cổ phần quy mô vừa bị rút tiền hàng loạt do ban lãnh đạo vi phạm pháp luật. Tin đồn đang lan rộng gây hoang mang cho toàn bộ hệ thống tiền gửi.",
      left: {
        label: "Mặc Kệ Thị Trường Tự Thanh Lọc",
        effects: { growth: -30, equity: -20, environment: 0, stability: -30 },
        quality: "wrong",
      },
      right: {
        label: "Đặt Vào Kiểm Soát Đặc Biệt",
        effects: { growth: -5, equity: +20, environment: 0, stability: +25 },
        quality: "correct",
      },
    },

    // ================= NHÓM 3: LAO ĐỘNG, TIỀN LƯƠNG VÀ PHÂN PHỐI =================
    {
      id: "11",
      categoryId: 3,
      categoryName: categoryLabels[3],
      speakerTitle: "Hiệp Hội Doanh Nghiệp Dệt May Vùng",
      speakerName: "Lương Đức Thịnh",
      dialogue:
        "Chi phí thuê nhà trọ và giá thực phẩm tăng khiến lương tối thiểu vùng không còn đủ sống, nhưng nhiều khách hàng nước ngoài đang chuyển đơn hàng sang quốc gia có lương rẻ hơn. Hiệp hội đề xuất bỏ khung lương tối thiểu cứng để lương theo thỏa thuận thị trường, hoặc tăng nhẹ kèm việc Nhà nước đầu tư nhà ở cho công nhân.",
      left: {
        label: "Để Thị Trường Tự Thỏa Thuận Lương",
        effects: { growth: +25, equity: -20, environment: 0, stability: -5 },
        quality: "wrong",
      },
      right: {
        label: "Tăng 3%, Xây Nhà Ở Cho Công Nhân",
        effects: { growth: +10, equity: +10, environment: 0, stability: -15 },
        quality: "correct",
      },
    },
    {
      id: "12",
      categoryId: 3,
      categoryName: categoryLabels[3],
      speakerTitle: "Bảo Hiểm Xã Hội Tỉnh",
      speakerName: "Tạ Thị Diễm Quyên",
      dialogue:
        "Mỗi năm hàng chục nghìn lao động rút bảo hiểm xã hội một lần vì thu nhập thấp và cần tiền gấp, nhưng khi về già họ sẽ không có lương hưu. Có ý kiến cho rằng đó là tiền của người lao động nên họ tự quyết, nhưng cũng có ý kiến đề nghị siết rút kèm lập quỹ hỗ trợ khẩn cấp.",
      left: {
        label: "Siết Rút Một Lần, Lập Quỹ Hỗ Trợ Khẩn Cấp",
        effects: { growth: -15, equity: +5, environment: 0, stability: +15 },
        quality: "correct",
      },
      right: {
        label: "Cho Rút Tự Do, Tự Chịu Trách Nhiệm Hưu Trí",
        effects: { growth: +15, equity: +10, environment: 0, stability: -20 },
        quality: "wrong",
      },
    },
    {
      id: "13",
      categoryId: 3,
      categoryName: categoryLabels[3],
      speakerTitle: "Hội Tài Xế Và Shipper Công Nghệ",
      speakerName: "Cao Văn Tiến",
      dialogue:
        "Hàng trăm nghìn tài xế bị trừ chiết khấu cao và có thể bị khóa tài khoản bởi thuật toán mà không được giải thích. Nếu bắt buộc ký hợp đồng lao động, các nền tảng có thể giảm số tài xế, và nhiều người đang làm thêm lúc rảnh sẽ mất nguồn thu nhập linh hoạt.",
      left: {
        label: "Bắt Buộc Hợp Đồng Lao Động Cho Tài Xế",
        effects: { growth: -20, equity: +25, environment: 0, stability: -5 },
        quality: "wrong",
      },
      right: {
        label: "Bảo Hiểm Tự Nguyện Có Hỗ Trợ, Giữ Mô Hình Đối Tác",
        effects: { growth: +15, equity: -10, environment: 0, stability: 0 },
        quality: "correct",
      },
    },
    {
      id: "14",
      categoryId: 3,
      categoryName: categoryLabels[3],
      speakerTitle: "Tập Đoàn Sản Xuất Điện Tử",
      speakerName: "Marcus Hellström",
      dialogue:
        "Chúng tôi sẵn sàng đầu tư nhà máy 5 tỷ USD và tuyển 30.000 lao động, với điều kiện được tạm miễn đóng bảo hiểm xã hội 3 năm cho lao động mới và nới giới hạn tăng ca lên 60 giờ mỗi tuần. Nếu phải giữ bảo hiểm cho công nhân, chúng tôi chỉ giữ được một nửa quy mô và cần địa phương bù ưu đãi.",
      left: {
        label: "Chấp Nhận Hết, Công Nhân Chịu Thiệt",
        effects: { growth: +30, equity: -30, environment: 0, stability: -10 },
        quality: "wrong",
      },
      right: {
        label: "Giữ Bảo Hiểm, Nhà Nước Gánh Ưu Đãi",
        effects: { growth: +5, equity: +5, environment: 0, stability: -20 },
        quality: "correct",
      },
    },
    {
      id: "15",
      categoryId: 3,
      categoryName: categoryLabels[3],
      speakerTitle: "Hiệp Hội Chế Biến Thủy Sản",
      speakerName: "Kiều Lương Tâm",
      dialogue:
        "Chúng tôi vừa nhận hợp đồng xuất khẩu 2 tỷ USD, nhưng khách hàng yêu cầu giảm giá thành 25%, nên phải ép giá thu mua cá của nông dân tương ứng. Nếu Nhà nước giữ giá sàn kèm hỗ trợ vốn và tìm thị trường mới, chúng tôi chỉ giữ được một phần hợp đồng.",
      left: {
        label: "Giữ Giá Sàn, Nhà Nước Hỗ Trợ Doanh Nghiệp",
        effects: { growth: -15, equity: +10, environment: +5, stability: -5 },
        quality: "correct",
      },
      right: {
        label: "Cho Ép Giá Thu Mua, Nông Dân Chịu Lỗ",
        effects: { growth: +30, equity: -25, environment: -5, stability: -5 },
        quality: "wrong",
      },
    },

    // ================= NHÓM 4: MÔI TRƯỜNG, TÀI NGUYÊN VÀ PHÁT TRIỂN BỀN VỮNG =================
    {
      id: "16",
      categoryId: 4,
      categoryName: categoryLabels[4],
      speakerTitle: "Ban Quản Lý Nhà Máy Nhiệt Điện Than",
      speakerName: "Vũ Minh Khang",
      dialogue:
        "Mùa nắng nóng phụ tải điện miền Bắc tăng vọt, trong khi điện gió ngoài khơi chưa kịp đưa vào vận hành. Nhà máy 30 năm tuổi thải nhiều khí độc nhưng nếu đóng cửa ngay thì phải nhập điện và đẩy giá điện tăng.",
      left: {
        label: "Gia Hạn 5 Năm, Lắp Thiết Bị Lọc Khí",
        effects: { growth: +15, equity: 0, environment: -20, stability: +10 },
        quality: "wrong",
      },
      right: {
        label: "Đóng Cửa, Đẩy Điện Mái Nhà Và Nhập Điện",
        effects: { growth: -15, equity: +5, environment: +20, stability: -10 },
        quality: "correct",
      },
    },
    {
      id: "17",
      categoryId: 4,
      categoryName: categoryLabels[4],
      speakerTitle: "Ban Chỉ Đạo Cao Tốc Miền Tây",
      speakerName: "Đinh Công Sơn",
      dialogue:
        "Các tuyến cao tốc trọng điểm cần hàng chục triệu mét khối cát san lấp, giá cát tăng vọt và tiến độ bị đe dọa. Nhưng khai thác cát sông đã làm sạt lở bờ, mất đất của nông dân và gây ngập mặn.",
      left: {
        label: "Siết Cấp Phép, Dùng Cát Biển Và Vật Liệu Thay Thế",
        effects: { growth: -15, equity: +5, environment: +20, stability: -10 },
        quality: "correct",
      },
      right: {
        label: "Cấp Thêm Mỏ Cát Sông Cho Cao Tốc",
        effects: { growth: +25, equity: -5, environment: -20, stability: +5 },
        quality: "wrong",
      },
    },
    {
      id: "18",
      categoryId: 4,
      categoryName: categoryLabels[4],
      speakerTitle: "Công Ty Khai Thác Khoáng Sản Hiếm",
      speakerName: "Hứa Đình Nghĩa",
      dialogue:
        "Dự án đầu tư 3 tỷ USD sẽ mang lại nguồn thu ngân sách lớn và 5.000 việc làm cho huyện nghèo, nhưng nằm trong khu rừng đầu nguồn cấp nước cho hai triệu dân. Chúng tôi có thể cấp phép ngay, hoặc làm bản thu nhỏ dưới sự giám sát nguồn nước của Nhà nước.",
      left: {
        label: "Cấp Phép Ngay, Chấp Nhận Rủi Ro Nguồn Nước",
        effects: { growth: +30, equity: -10, environment: -30, stability: +5 },
        quality: "wrong",
      },
      right: {
        label: "Cấp Phép Có Điều Kiện, Nhà Nước Giám Sát",
        effects: { growth: +10, equity: +5, environment: -10, stability: -15 },
        quality: "correct",
      },
    },
    {
      id: "19",
      categoryId: 4,
      categoryName: categoryLabels[4],
      speakerTitle: "Nhà Máy Thép Công Suất Lớn",
      speakerName: "Âu Dương Khải",
      dialogue:
        "Chuyển đổi sang công nghệ sạch cần 2 tỷ USD, vượt xa khả năng của chúng tôi, nên nhà máy xin tiếp tục vận hành công nghệ cũ thêm 7 năm. Nếu Nhà nước cho vay ưu đãi, chúng tôi có thể chuyển đổi theo lộ trình.",
      left: {
        label: "Giữ Công Nghệ Cũ, Dân Chịu Bụi Mịn",
        effects: { growth: +25, equity: -15, environment: -30, stability: +5 },
        quality: "wrong",
      },
      right: {
        label: "Chuyển Đổi Theo Lộ Trình, Vay Ưu Đãi",
        effects: { growth: -5, equity: -5, environment: +15, stability: -15 },
        quality: "correct",
      },
    },
    {
      id: "20",
      categoryId: 4,
      categoryName: categoryLabels[4],
      speakerTitle: "Tập Đoàn Du Lịch Nghỉ Dưỡng Ven Biển",
      speakerName: "Lâm Gia Phúc",
      dialogue:
        "Khu nghỉ dưỡng 10.000 tỷ đồng sẽ tạo hàng nghìn việc làm và kéo du khách về vùng ven biển còn nghèo, nhưng phải lấn một phần rừng ngập mặn. Chúng tôi có thể giảm diện tích xây dựng nếu quỹ trồng rừng bù đắp được trích từ lợi nhuận.",
      left: {
        label: "Cho Lấn Rừng, Bờ Biển Dễ Sạt Lở",
        effects: { growth: +30, equity: 0, environment: -30, stability: -5 },
        quality: "wrong",
      },
      right: {
        label: "Xây Có Điều Kiện, Trích Quỹ Trồng Rừng Bù",
        effects: { growth: +5, equity: +5, environment: -5, stability: -10 },
        quality: "correct",
      },
    },

    // ================= NHÓM 5: KHOA HỌC CÔNG NGHỆ VÀ CHUYỂN ĐỔI SỐ =================
    {
      id: "21",
      categoryId: 5,
      categoryName: categoryLabels[5],
      speakerTitle: "Hiệp hội Doanh nghiệp Công nghệ",
      speakerName: "Nguyễn Minh Khôi",
      dialogue:
        "Doanh nghiệp đang ồ ạt đầu tư AI, đe dọa việc làm của lao động phổ thông. Cho phép tự động hóa nhanh để tăng cạnh tranh, hay yêu cầu kèm kế hoạch đào tạo lại?",
      left: {
        label: "Tự Động Hóa Nhanh",
        effects: { growth: +20, equity: -20, environment: -5, stability: -10 },
        quality: "wrong",
      },
      right: {
        label: "Đổi Mới Kèm Đào Tạo",
        effects: { growth: +15, equity: +20, environment: +5, stability: +10 },
        quality: "correct",
      },
    },
    {
      id: "22",
      categoryId: 5,
      categoryName: categoryLabels[5],
      speakerTitle: "Hiệp hội Thương mại Điện tử",
      speakerName: "Lê Thu Hà",
      dialogue:
        "Nền tảng số ngoại đang thu lợi lớn nhưng nộp thuế chưa bình đẳng với doanh nghiệp nội. Siết chặt thu thuế để bảo đảm công bằng, hay duy trì ưu đãi để hút vốn?",
      left: {
        label: "Thu Thuế Bình Đẳng",
        effects: { growth: +10, equity: +20, environment: 0, stability: +15 },
        quality: "correct",
      },
      right: {
        label: "Ưu Đãi Thuế Có Hạn",
        effects: { growth: +20, equity: -15, environment: 0, stability: -10 },
        quality: "wrong",
      },
    },
    {
      id: "23",
      categoryId: 5,
      categoryName: categoryLabels[5],
      speakerTitle: "Hội Bảo vệ Người tiêu dùng",
      speakerName: "Phạm Ngọc Linh",
      dialogue:
        "Các siêu ứng dụng đang thu thập dữ liệu cá nhân ồ ạt nhưng thiếu minh bạch. Siết chặt bảo vệ dữ liệu người dùng, hay để nền tảng tự quản lý để không cản trở đổi mới?",
      left: {
        label: "Bảo Vệ Dữ Liệu Chặt",
        effects: { growth: +5, equity: +20, environment: 0, stability: +20 },
        quality: "correct",
      },
      right: {
        label: "Tự Quản Dữ Liệu",
        effects: { growth: +15, equity: -20, environment: 0, stability: -15 },
        quality: "wrong",
      },
    },
    {
      id: "24",
      categoryId: 5,
      categoryName: categoryLabels[5],
      speakerTitle: "Liên minh Nghiên cứu Bán dẫn",
      speakerName: "Đỗ Minh Anh",
      dialogue:
        "Chúng ta cần trung tâm bán dẫn để tự chủ công nghệ, nhưng dự án rất tốn kém và rủi ro. Ưu tiên đầu tư công trọng điểm, hay nhường lại cho tư nhân dẫn dắt?",
      left: {
        label: "Đầu Tư Công Trọng Điểm",
        effects: { growth: +20, equity: +15, environment: -10, stability: +5 },
        quality: "correct",
      },
      right: {
        label: "Hợp Tác Tư Nhân Dẫn Dắt",
        effects: { growth: +15, equity: +10, environment: -5, stability: +15 },
        quality: "correct",
      },
    },
    {
      id: "25",
      categoryId: 5,
      categoryName: categoryLabels[5],
      speakerTitle: "Hiệp hội Truyền thông Số",
      speakerName: "Võ Hoàng Nam",
      dialogue:
        "Thuật toán mạng xã hội đang ưu tiên nội dung giật gân, độc hại để câu tương tác. Ép buộc minh bạch thuật toán có kiểm toán, hay để nền tảng giữ bí mật kinh doanh?",
      left: {
        label: "Minh Bạch Có Kiểm Toán",
        effects: { growth: +10, equity: +20, environment: 0, stability: +20 },
        quality: "correct",
      },
      right: {
        label: "Giữ Kín Thuật Toán",
        effects: { growth: +20, equity: -15, environment: 0, stability: -15 },
        quality: "wrong",
      },
    },

    // ================= NHÓM 6: HỘI NHẬP KINH TẾ QUỐC TẾ VÀ AN NINH KINH TẾ =================
    {
      id: "26",
      categoryId: 6,
      categoryName: categoryLabels[6],
      speakerTitle: "Hiệp hội Dệt may Việt Nam",
      speakerName: "Trần Ngọc Mai",
      dialogue:
        "Chuẩn lao động và môi trường quốc tế khắt khe đang tạo áp lực lớn cho doanh nghiệp. Hỗ trợ doanh nghiệp tuân thủ theo lộ trình, hay xin giãn cam kết để cứu vãn chi phí?",
      left: {
        label: "Tuân Thủ Kèm Hỗ Trợ",
        effects: { growth: +10, equity: +15, environment: +20, stability: +10 },
        quality: "correct",
      },
      right: {
        label: "Xin Giãn Cam Kết",
        effects: { growth: +10, equity: -10, environment: -20, stability: -10 },
        quality: "wrong",
      },
    },
    {
      id: "27",
      categoryId: 6,
      categoryName: categoryLabels[6],
      speakerTitle: "Hiệp hội Sản xuất Nội địa",
      speakerName: "Nguyễn Quốc Bảo",
      dialogue:
        "Hàng nhập khẩu giá siêu rẻ đang tràn vào, đe dọa đánh sập các nhà sản xuất trong nước. Áp dụng phòng vệ thương mại, hay giữ thị trường mở để có lợi cho người tiêu dùng?",
      left: {
        label: "Phòng Vệ Thương Mại",
        effects: { growth: +5, equity: +15, environment: 0, stability: +10 },
        quality: "correct",
      },
      right: {
        label: "Giữ Thị Trường Mở",
        effects: { growth: +15, equity: +5, environment: 0, stability: +5 },
        quality: "wrong",
      },
    },
    {
      id: "28",
      categoryId: 6,
      categoryName: categoryLabels[6],
      speakerTitle: "Hiệp hội Doanh nghiệp Xuất khẩu",
      speakerName: "Lê Phương Thảo",
      dialogue:
        "60% xuất khẩu nông sản của ta đang phụ thuộc rủi ro vào một thị trường duy nhất. Tiếp tục tập trung khai thác thị trường này, hay tốn nguồn lực để đa dạng hóa đối tác?",
      left: {
        label: "Tập Trung Thị Trường Lớn",
        effects: { growth: +20, equity: -5, environment: 0, stability: -20 },
        quality: "wrong",
      },
      right: {
        label: "Đa Dạng Hóa Thị Trường",
        effects: { growth: +10, equity: +10, environment: 0, stability: +20 },
        quality: "correct",
      },
    },
    {
      id: "29",
      categoryId: 6,
      categoryName: categoryLabels[6],
      speakerTitle: "Hiệp hội Doanh nghiệp Xuất nhập khẩu",
      speakerName: "Phạm Đức Long",
      dialogue:
        "Xuất khẩu đang lao đao, doanh nghiệp xin phá giá tiền Đồng để tăng sức cạnh tranh. Cho giảm giá nội tệ nhanh, hay ưu tiên điều chỉnh thận trọng để kiểm soát lạm phát?",
      left: {
        label: "Giảm Giá Nội Tệ Nhanh",
        effects: { growth: +15, equity: -10, environment: 0, stability: -20 },
        quality: "wrong",
      },
      right: {
        label: "Điều Chỉnh Tỷ Giá Thận Trọng",
        effects: { growth: +5, equity: +10, environment: 0, stability: +20 },
        quality: "correct",
      },
    },
    {
      id: "30",
      categoryId: 6,
      categoryName: categoryLabels[6],
      speakerTitle: "Hiệp hội Nhà đầu tư Tài chính",
      speakerName: "Hoàng Gia Huy",
      dialogue:
        "Dòng vốn ngoại đang tháo chạy ồ ạt, đe dọa đánh sập thị trường chứng khoán. Để dòng vốn tự do lưu chuyển, hay áp dụng biện pháp can thiệp để giám sát rủi ro?",
      left: {
        label: "Tự Do Vốn Tối Đa",
        effects: { growth: +15, equity: -5, environment: 0, stability: -20 },
        quality: "wrong",
      },
      right: {
        label: "Tăng Giám Sát Rủi Ro",
        effects: { growth: +10, equity: +10, environment: 0, stability: +20 },
        quality: "correct",
      },
    },
  ];

  // Hiệu ứng Pháo giấy (Confetti) chúc mừng khi Thắng (vượt qua đủ 10 năm)
  let confettiAnimId = null;
  let confettiParticles = [];

  function startConfetti() {
    stopConfetti();
    const canvas = document.getElementById("game-confetti-canvas");
    if (!canvas) return;
    canvas.classList.remove("hidden");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext("2d");

    const colors = [
      "#f59e0b",
      "#10b981",
      "#3b82f6",
      "#ec4899",
      "#8b5cf6",
      "#f43f5e",
      "#eab308",
    ];
    confettiParticles = Array.from({ length: 140 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * -canvas.height,
      w: 8 + Math.random() * 8,
      h: 6 + Math.random() * 6,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 4,
      vy: 2.5 + Math.random() * 4.5,
      angle: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.2,
    }));

    function renderConfetti() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      confettiParticles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.angle += p.spin;
        if (p.y > canvas.height + 20) {
          p.y = -15;
          p.x = Math.random() * canvas.width;
        }
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      });
      confettiAnimId = requestAnimationFrame(renderConfetti);
    }

    renderConfetti();
  }

  function stopConfetti() {
    if (confettiAnimId) {
      cancelAnimationFrame(confettiAnimId);
      confettiAnimId = null;
    }
    const canvas = document.getElementById("game-confetti-canvas");
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
      canvas.classList.add("hidden");
    }
  }

  // Chế độ chơi duy nhất: NGẪU NHIÊN 10 năm trộn từ 30 thẻ bài
  let selectedCategory = "all";
  let currentYear = 1;
  const maxYears = 10;
  let reignsStats = { growth: 50, equity: 50, environment: 50, stability: 50 };
  let currentCardIndex = 0;
  let isGameOver = false;
  let deck = [];
  let cardAnimTimer = null;

  // Trạng thái Người chơi & BXH Online
  let leaderboardClient = null;
  let activePlayer = null;
  let playerPlaysUsed = 0;
  let playerBestScore = null;
  let isEditingPlayer = false;
  let hasSubmittedCurrentRun = false;
  let isRefreshingLeaderboard = false;
  let srAnnounceTimer = null;
  let lastAnnouncedField = null;
  const fieldInteractionState = new WeakMap();
  let latestLeaderboardSnapshot = {
    mode: "online",
    entries: [],
    allEntries: [],
    totalPlayers: 0,
  };

  function shuffleArray(arr) {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function buildDeck() {
    deck = shuffleArray(reignsDeck).slice(0, maxYears);
  }

  function updateHUDStats() {
    ["growth", "equity", "environment", "stability"].forEach((k) => {
      const val = reignsStats[k];
      const bar = document.getElementById(`stat-bar-${k}`);
      const text = document.getElementById(`stat-val-${k}`);
      const clamped = Math.max(0, Math.min(100, val));
      const isDanger = clamped < 20 || clamped > 80;

      if (bar) {
        bar.style.width = `${clamped}%`;
        if (isDanger) bar.classList.add("stat-bar-danger");
        else bar.classList.remove("stat-bar-danger");
      }
      if (text) {
        text.textContent = clamped;
        if (isDanger) text.classList.add("stat-val-danger");
        else text.classList.remove("stat-val-danger");
      }
    });
  }

  function renderCard() {
    if (isGameOver || !deck.length) return;
    const cardData = deck[currentCardIndex];

    const topicBadge = document.getElementById("card-topic-badge");
    const idBadge = document.getElementById("card-id-badge");
    if (topicBadge) topicBadge.textContent = cardData.categoryName;
    if (idBadge) idBadge.textContent = `Thẻ #${cardData.id}`;

    document.getElementById("card-speaker-title").textContent =
      cardData.speakerTitle;
    document.getElementById("card-speaker-name").textContent =
      cardData.speakerName;
    document.getElementById("card-dialogue").textContent = cardData.dialogue;
    document.getElementById("btn-label-left").textContent =
      cardData.left.label;
    document.getElementById("btn-label-right").textContent =
      cardData.right.label;
    document.getElementById("choice-pill-left").textContent =
      cardData.left.label;
    document.getElementById("choice-pill-right").textContent =
      cardData.right.label;
    document.getElementById("game-year-display").textContent =
      `Năm thứ ${currentYear} / ${maxYears}`;

    const card = document.getElementById("reigns-card");
    if (card) card.style.transform = "translate(0px, 0px) rotate(0deg)";
    document.getElementById("choice-pill-left").style.opacity = "0";
    document.getElementById("choice-pill-right").style.opacity = "0";
    clearStatDots();
  }

  function showStatDots(effects) {
    clearStatDots();
    ["growth", "equity", "environment", "stability"].forEach((k) => {
      if (effects[k] && effects[k] !== 0) {
        const hud = document.querySelector(
          `.stat-hud[data-stat="${k}"] .stat-dot`,
        );
        if (hud) hud.classList.add("active");
      }
    });
  }

  function clearStatDots() {
    document
      .querySelectorAll(".stat-dot")
      .forEach((d) => d.classList.remove("active"));
  }

  // Đánh giá chất lượng lựa chọn: ưu tiên độ chính xác lý luận/thực tiễn đã gán trên thẻ bài,
  // đồng thời tự động chuyển sang "wrong" nếu quyết sách đẩy chỉ số sâu hơn vào vùng nguy hiểm (< 20 hoặc > 80)
  function evaluateChoiceQuality(_oldStats, newStats, decision) {
    const statKeys = ["growth", "equity", "environment", "stability"];
    const effects = (decision && decision.effects) || {};

    let pushedIntoDanger = false;
    statKeys.forEach((k) => {
      const delta = effects[k] || 0;
      if (
        (newStats[k] < 20 && delta < 0) ||
        (newStats[k] > 80 && delta > 0)
      ) {
        pushedIntoDanger = true;
      }
    });

    if (pushedIntoDanger) return "wrong";
    return decision && decision.quality === "wrong" ? "wrong" : "correct";
  }

  function hideFeedbackBanner() {
    const banner = document.getElementById("card-feedback-banner");
    if (banner) {
      banner.className = "hidden";
      banner.textContent = "";
    }
  }

  // Hiển thị hiệu ứng thẻ phát sáng xanh lá + nảy nhẹ (Chọn Đúng) hoặc rung lắc + viền đỏ (Chọn Sai)
  function triggerChoiceVisualFeedback(quality) {
    const card = document.getElementById("reigns-card");
    const banner = document.getElementById("card-feedback-banner");
    if (!card) return;

    if (cardAnimTimer) {
      clearTimeout(cardAnimTimer);
      cardAnimTimer = null;
    }

    card.classList.remove("card-correct-glow", "card-wrong-shake");
    void card.offsetWidth; // Force reflow để chạy lại animation tức thì

    if (quality === "correct") {
      card.classList.add("card-correct-glow");
      if (banner) {
        banner.className =
          "w-full mb-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold text-center bg-emerald-50 text-emerald-700 border border-emerald-300";
        banner.textContent =
          "Quyết sách hợp lý: Cân bằng vĩ mô & Tác động tích cực!";
      }
    } else {
      card.classList.add("card-wrong-shake");
      if (banner) {
        banner.className =
          "w-full mb-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold text-center bg-rose-50 text-rose-700 border border-rose-300";
        banner.textContent =
          "Cảnh báo: Quyết sách gây mất cân bằng hoặc đẩy chỉ số vào vùng nguy hiểm!";
      }
    }

    cardAnimTimer = setTimeout(() => {
      card.classList.remove("card-correct-glow", "card-wrong-shake");
    }, 550);
  }

  // Hiển thị hiệu ứng chớp đỏ màn hình và rung khung thông báo khi Thua (Game Over)
  function triggerLoseVisualEffect() {
    const redFlash = document.getElementById("game-red-flash-overlay");
    const modal = document.getElementById("reigns-gameover-modal");

    if (redFlash) {
      redFlash.classList.remove("active-red-flash");
      void redFlash.offsetWidth;
      redFlash.classList.add("active-red-flash");
    }
    if (modal) {
      modal.classList.remove("gameover-modal-shake");
      void modal.offsetWidth;
      modal.classList.add("gameover-modal-shake");
    }
  }

  function checkGameOver() {
    const reasons = {
      growth_low:
        "Chỉ số Tăng Trưởng rơi về mức 0: Nền kinh tế đình trệ hoàn toàn, doanh nghiệp giải thể hàng loạt, thất nghiệp tràn lan khiến thể chế mất hoàn toàn nguồn thu ngân sách.",
      growth_high:
        "Chỉ số Tăng Trưởng chạm mức 100: Nền kinh tế phát triển quá nóng sinh ra siêu bong bóng đầu cơ tài chính. Lạm phát phi mã làm đồng tiền mất giá hoàn toàn, gây khủng hoảng tiền tệ nghiêm trọng.",
      equity_low:
        "Chỉ số Công Bằng rơi về mức 0: Bất bình đẳng thu nhập và phân hóa giàu nghèo tột độ. Người lao động cùng quẫn bùng nổ làn sóng tổng bãi công làm tê liệt bộ máy quản lý.",
      equity_high:
        "Chỉ số Công Bằng chạm mức 100: Chủ nghĩa cào bằng bình quân tuyệt đối triệt tiêu hoàn toàn động lực lao động và sáng tạo. Xã hội rơi vào trì trệ bao cấp xơ cứng.",
      environment_low:
        "Chỉ số Môi Trường rơi về mức 0: Ô nhiễm không khí, cạn kiệt tài nguyên và nguồn nước nhiễm độc làm bùng phát thảm họa y tế công cộng diện rộng, đời sống xã hội bị hủy hoại.",
      environment_high:
        "Chỉ số Môi Trường chạm mức 100: Đình chỉ cực đoan mọi hoạt động sản xuất công nghiệp và khai thác, khiến xã hội thiếu thốn nhu yếu phẩm trầm trọng, kinh tế suy sụp.",
      stability_low:
        "Chỉ số Ổn Định rơi về mức 0: Khủng hoảng chu kỳ tài chính bùng nổ dây chuyền, hệ thống ngân hàng phá sản, thị trường mất kiểm soát dẫn đến sụp đổ thể chế.",
      stability_high:
        "Chỉ số Ổn Định chạm mức 100: Can thiệp mệnh lệnh hành chính quá mức làm thị trường đông cứng tuyệt đối, nền kinh tế tê liệt khả năng ứng phó với các biến động thế giới.",
    };

    let failureKey = null;
    if (reignsStats.growth <= 0) failureKey = "growth_low";
    else if (reignsStats.growth >= 100) failureKey = "growth_high";
    else if (reignsStats.equity <= 0) failureKey = "equity_low";
    else if (reignsStats.equity >= 100) failureKey = "equity_high";
    else if (reignsStats.environment <= 0) failureKey = "environment_low";
    else if (reignsStats.environment >= 100) failureKey = "environment_high";
    else if (reignsStats.stability <= 0) failureKey = "stability_low";
    else if (reignsStats.stability >= 100) failureKey = "stability_high";

    function finishGame({ isVictory, yearsSurvived, failureReason }) {
      isGameOver = true;
      hideFeedbackBanner();
      const scoreInfo = calculateGameScore({
        yearsSurvived,
        stats: reignsStats,
        isVictory,
      });

      document.getElementById("game-play-area").classList.add("hidden");
      if (isVictory) {
        const vicTitle = document.getElementById("victory-title-years");
        if (vicTitle) {
          vicTitle.textContent = `Hoàn Thành Xuất Sắc ${maxYears} Năm Nhiệm Kỳ!`;
        }
        renderEndgameScoreBox("victory", scoreInfo);
        document
          .getElementById("reigns-victory-modal")
          .classList.remove("hidden");
        startConfetti();
      } else {
        document.getElementById("gameover-cause").textContent = failureReason;
        document.getElementById("gameover-years").textContent =
          `${yearsSurvived} / ${maxYears} năm`;
        renderEndgameScoreBox("gameover", scoreInfo);
        document
          .getElementById("reigns-gameover-modal")
          .classList.remove("hidden");
        triggerLoseVisualEffect();
      }

      if (!hasSubmittedCurrentRun) {
        hasSubmittedCurrentRun = true;
        handleRunFinished({ yearsSurvived, isVictory, scoreInfo });
      }
      return true;
    }

    if (failureKey) {
      return finishGame({
        isVictory: false,
        yearsSurvived: Math.max(0, currentYear - 1),
        failureReason: reasons[failureKey],
      });
    }

    if (currentYear >= maxYears) {
      return finishGame({
        isVictory: true,
        yearsSurvived: maxYears,
      });
    }

    return false;
  }

  function applyChoice(side) {
    if (!isPlayerReadyToPlay() || isGameOver || !deck.length) return;
    const cardData = deck[currentCardIndex];
    const decision = side === "left" ? cardData.left : cardData.right;

    const oldStats = { ...reignsStats };
    ["growth", "equity", "environment", "stability"].forEach((k) => {
      reignsStats[k] += decision.effects[k] || 0;
    });

    const quality = evaluateChoiceQuality(oldStats, reignsStats, decision);

    updateHUDStats();

    if (!checkGameOver()) {
      currentYear++;
      currentCardIndex++;
      renderCard();
      triggerChoiceVisualFeedback(quality);
    }
  }

  function resetGame() {
    stopConfetti();
    currentYear = 1;
    currentCardIndex = 0;
    reignsStats = { growth: 50, equity: 50, environment: 50, stability: 50 };
    isGameOver = false;
    hasSubmittedCurrentRun = false;

    hideFeedbackBanner();
    const card = document.getElementById("reigns-card");
    if (card) {
      card.classList.remove("card-correct-glow", "card-wrong-shake");
    }

    document.getElementById("reigns-gameover-modal").classList.add("hidden");
    document.getElementById("reigns-victory-modal").classList.add("hidden");
    buildDeck();
    updateHUDStats();
    renderCard();
    updatePlayerPanelUI();
  }

  function setCategory() {
    selectedCategory = "all";
    const modeSub = document.getElementById("game-mode-subtitle");
    if (modeSub) {
      modeSub.textContent = `Chế độ: ${categoryLabels.all}`;
    }
    if (!isPlayerReadyToPlay()) {
      focusPlayerForm();
      return;
    }
    resetGame();
  }

  function getMaxScoredPlays() {
    const cfg = resolveLeaderboardConfig();
    return Number(cfg.maxScoredPlays) > 0 ? Number(cfg.maxScoredPlays) : 5;
  }

  function isPlayerReadyToPlay() {
    return Boolean(activePlayer && !isEditingPlayer);
  }

  function isPracticeModeActive() {
    return isPlayerReadyToPlay() && playerPlaysUsed >= getMaxScoredPlays();
  }

  function focusPlayerForm() {
    const nameInput = document.getElementById("player-name-input");
    const mssvInput = document.getElementById("player-mssv-input");
    if (nameInput && !nameInput.value.trim()) {
      nameInput.focus();
    } else if (mssvInput) {
      mssvInput.focus();
    }
  }

  function renderEndgameScoreBox(prefix, scoreInfo) {
    const totalEl = document.getElementById(`${prefix}-total-score`);
    const breakdownEl = document.getElementById(`${prefix}-score-breakdown`);
    const statusEl = document.getElementById(`${prefix}-submit-status`);
    if (totalEl) totalEl.textContent = String(scoreInfo.totalScore);
    if (breakdownEl) {
      breakdownEl.textContent = `Năm: +${scoreInfo.yearScore} • Cân bằng: +${scoreInfo.balanceScore} • Thưởng: +${scoreInfo.victoryBonus}`;
    }
    if (statusEl) {
      statusEl.textContent =
        playerPlaysUsed >= getMaxScoredPlays()
          ? "Đã hết 5 lượt tính điểm — lượt này chơi tự do, không tính điểm và không ghi lên BXH."
          : "Đang lưu kết quả lên BXH...";
    }
  }

  function setRulesPanelVisible(showRules) {
    const rulesBox = document.getElementById("game-rules-box");
    const lbPanel = document.getElementById("game-leaderboard-panel");
    const toggleBtn = document.getElementById("btn-game-rules-toggle");
    const toggleLabel = document.getElementById("btn-game-rules-label");
    if (rulesBox) rulesBox.classList.toggle("hidden", !showRules);
    if (lbPanel) lbPanel.classList.toggle("hidden", showRules);
    if (toggleBtn) toggleBtn.setAttribute("aria-expanded", String(showRules));
    if (toggleLabel) toggleLabel.textContent = showRules ? "Xem BXH" : "Luật chơi";
  }

  function updatePlayerPanelUI() {
    const ready = isPlayerReadyToPlay();
    const maxPlays = getMaxScoredPlays();
    const clampedPlays = Math.min(playerPlaysUsed, maxPlays);
    const practice = isPracticeModeActive();

    const formWrap = document.getElementById("game-player-form-wrap");
    const summaryWrap = document.getElementById("game-player-summary");
    const cancelBtn = document.getElementById("btn-player-cancel");
    const lockOverlay = document.getElementById("game-lock-overlay");
    const playArea = document.getElementById("game-play-area");
    const practiceNotice = document.getElementById("player-practice-notice");
    const practiceBanner = document.getElementById("game-practice-banner");
    const hudPlaysPill = document.getElementById("game-plays-hud-pill");

    if (formWrap) formWrap.classList.toggle("hidden", ready);
    if (summaryWrap) summaryWrap.classList.toggle("hidden", !ready);
    if (cancelBtn) cancelBtn.classList.toggle("hidden", !(isEditingPlayer && activePlayer));

    if (ready && activePlayer) {
      const nameEl = document.getElementById("player-summary-name");
      const mssvEl = document.getElementById("player-summary-mssv");
      const playsEl = document.getElementById("player-plays-badge");
      const bestEl = document.getElementById("player-best-badge");

      if (nameEl) nameEl.textContent = activePlayer.name;
      if (mssvEl) mssvEl.textContent = activePlayer.mssv;
      if (playsEl) playsEl.textContent = `Lượt tính điểm: ${clampedPlays} / ${maxPlays}`;
      if (bestEl) {
        bestEl.textContent =
          playerBestScore !== null ? `Kỷ lục: ${playerBestScore} đ` : "Kỷ lục: --";
      }
    }

    if (hudPlaysPill) {
      hudPlaysPill.textContent = ready ? `Lượt: ${clampedPlays}/${maxPlays}` : "Chưa định danh";
    }
    if (practiceNotice) practiceNotice.classList.toggle("hidden", !practice);
    if (practiceBanner) practiceBanner.classList.toggle("hidden", !practice);

    if (lockOverlay) lockOverlay.classList.toggle("hidden", ready);
    if (playArea) {
      playArea.classList.toggle("hidden", !ready || isGameOver);
    }
    if (!ready) {
      const overModal = document.getElementById("reigns-gameover-modal");
      const winModal = document.getElementById("reigns-victory-modal");
      if (overModal) overModal.classList.add("hidden");
      if (winModal) winModal.classList.add("hidden");
    }
  }

  function setLeaderboardStatusBadge(mode, isLoading) {
    const badges = [
      document.getElementById("leaderboard-status-badge"),
      document.getElementById("leaderboard-full-status-badge"),
    ];
    badges.forEach((badge) => {
      if (!badge) return;
      badge.classList.remove("lb-status-online", "lb-status-offline");
      if (isLoading) {
        badge.textContent = "Đang tải...";
        badge.classList.add("lb-status-offline");
      } else if (mode === "online") {
        badge.textContent = "BXH Online";
        badge.classList.add("lb-status-online");
      } else {
        badge.textContent = "Offline";
        badge.classList.add("lb-status-offline");
      }
    });
  }

  function renderFullLeaderboard(snapshot) {
    const data = snapshot || latestLeaderboardSnapshot;
    const fullTbody = document.getElementById("leaderboard-full-tbody");
    const countEl = document.getElementById("leaderboard-full-count");
    const allEntries = data.allEntries || data.entries || [];
    const maxPlays = getMaxScoredPlays();

    if (countEl) {
      countEl.textContent = `${allEntries.length} sinh viên`;
    }
    if (!fullTbody) return;

    if (!allEntries.length) {
      fullTbody.innerHTML =
        '<tr><td colspan="6" class="py-8 text-center text-xs sm:text-sm text-slate-500">Chưa có sinh viên nào trên BXH. Hãy là người đầu tiên!</td></tr>';
      return;
    }

    const activeMssv = activePlayer ? activePlayer.mssv : "";
    fullTbody.innerHTML = allEntries
      .map((entry, idx) => {
        const rank = idx + 1;
        const isSelf = activeMssv && entry.mssv === activeMssv;
        const rankClass =
          rank <= 3
            ? `leaderboard-rank-badge leaderboard-rank-${rank}`
            : "leaderboard-rank-badge text-slate-500";
        const safeName = escapeHtml(entry.name);
        const safeMssv = escapeHtml(entry.mssv);
        const playsCount = Math.min(maxPlays, Math.max(0, Number(entry.plays) || 0));
        return `<tr class="${isSelf ? "leaderboard-row-self" : "hover:bg-slate-50"}">
          <td class="text-center"><span class="${rankClass}">${rank}</span></td>
          <td class="font-bold text-slate-900">
            <span class="block leading-snug">${safeName}</span>
            <span class="sm:hidden block font-mono text-[10.5px] font-normal text-slate-500 mt-0.5">${safeMssv}</span>
          </td>
          <td class="hidden sm:table-cell font-mono text-slate-600">${safeMssv}</td>
          <td class="text-center font-mono text-slate-600">${playsCount}/${maxPlays}</td>
          <td class="text-center font-mono text-slate-600">${entry.years}/${maxYears}</td>
          <td class="text-right font-mono font-extrabold text-slate-900 pr-2">${entry.score}</td>
        </tr>`;
      })
      .join("");
  }

  function openFullLeaderboardModal() {
    const dialog = document.getElementById("leaderboard-full-modal");
    if (!dialog) return;
    renderFullLeaderboard(latestLeaderboardSnapshot);
    if (typeof dialog.showModal === "function") {
      if (!dialog.open) dialog.showModal();
    } else {
      dialog.setAttribute("open", "open");
    }
    syncLeaderboardAndPlayer();
  }

  function closeFullLeaderboardModal() {
    const dialog = document.getElementById("leaderboard-full-modal");
    if (!dialog) return;
    if (typeof dialog.close === "function") {
      if (dialog.open) dialog.close();
    } else {
      dialog.removeAttribute("open");
    }
  }

  function renderLeaderboard(snapshot) {
    latestLeaderboardSnapshot = snapshot || latestLeaderboardSnapshot;
    const tbody = document.getElementById("leaderboard-tbody");
    const selfRankEl = document.getElementById("leaderboard-self-rank");
    setLeaderboardStatusBadge(latestLeaderboardSnapshot.mode, false);
    renderFullLeaderboard(latestLeaderboardSnapshot);
    if (!tbody) return;

    const entries = latestLeaderboardSnapshot.entries || [];
    const allEntries = latestLeaderboardSnapshot.allEntries || entries;

    if (!entries.length) {
      tbody.innerHTML =
        '<tr><td colspan="4" class="py-5 text-center text-xs text-slate-500">Chưa có sinh viên nào trên BXH. Hãy là người đầu tiên!</td></tr>';
      if (selfRankEl) selfRankEl.classList.add("hidden");
      return;
    }

    const activeMssv = activePlayer ? activePlayer.mssv : "";
    tbody.innerHTML = entries
      .map((entry, idx) => {
        const rank = idx + 1;
        const isSelf = activeMssv && entry.mssv === activeMssv;
        const rankClass =
          rank <= 3
            ? `leaderboard-rank-badge leaderboard-rank-${rank}`
            : "leaderboard-rank-badge text-slate-500";
        const safeName = escapeHtml(entry.name);
        const safeMssv = escapeHtml(entry.mssv);
        return `<tr class="${isSelf ? "leaderboard-row-self" : "hover:bg-slate-100/70"}">
          <td class="text-center"><span class="${rankClass}">${rank}</span></td>
          <td>
            <div class="leaderboard-student-cell">
              <span class="leaderboard-name" title="${safeName} (${safeMssv})">${safeName}</span>
              <span class="leaderboard-mssv">${safeMssv}</span>
            </div>
          </td>
          <td class="text-center font-mono text-slate-600">${entry.years}/${maxYears}</td>
          <td class="text-right font-mono font-extrabold text-slate-900 pr-1">${entry.score}</td>
        </tr>`;
      })
      .join("");

    if (selfRankEl) {
      if (activeMssv) {
        const fullIdx = allEntries.findIndex((item) => item.mssv === activeMssv);
        const inTop = entries.some((item) => item.mssv === activeMssv);
        if (fullIdx >= 0 && !inTop) {
          const selfEntry = allEntries[fullIdx];
          selfRankEl.innerHTML = `<span>Hạng của bạn: <strong>#${fullIdx + 1}/${allEntries.length}</strong></span><span class="font-mono">${selfEntry.score} đ (${selfEntry.years}/${maxYears} năm)</span>`;
          selfRankEl.classList.remove("hidden");
          return;
        }
      }
      selfRankEl.classList.add("hidden");
    }
  }

  async function syncLeaderboardAndPlayer() {
    if (!leaderboardClient || isRefreshingLeaderboard) return;
    isRefreshingLeaderboard = true;
    setLeaderboardStatusBadge(latestLeaderboardSnapshot.mode, true);
    const refreshBtn = document.getElementById("btn-leaderboard-refresh");
    const fullRefreshBtn = document.getElementById("btn-leaderboard-full-refresh");
    if (refreshBtn) refreshBtn.disabled = true;
    if (fullRefreshBtn) fullRefreshBtn.disabled = true;

    try {
      const targetMssv = activePlayer ? activePlayer.mssv : "";
      const [lbResult, playerResult] = await Promise.all([
        leaderboardClient.fetchLeaderboard(),
        targetMssv
          ? leaderboardClient.fetchPlayerRecord(targetMssv)
          : Promise.resolve(null),
      ]);

      if (activePlayer && activePlayer.mssv === targetMssv) {
        const record =
          (playerResult && playerResult.entry) ||
          (lbResult.allEntries || []).find((item) => item.mssv === targetMssv) ||
          null;
        playerPlaysUsed = record ? record.plays : 0;
        playerBestScore = record ? record.score : null;
        updatePlayerPanelUI();
      }
      renderLeaderboard(lbResult);
    } finally {
      isRefreshingLeaderboard = false;
      if (refreshBtn) refreshBtn.disabled = false;
      if (fullRefreshBtn) fullRefreshBtn.disabled = false;
    }
  }

  async function handleRunFinished({ yearsSurvived, isVictory, scoreInfo }) {
    if (!leaderboardClient || !activePlayer) return;
    const prefix = isVictory ? "victory" : "gameover";
    const statusEl = document.getElementById(`${prefix}-submit-status`);
    const maxPlays = getMaxScoredPlays();

    if (playerPlaysUsed >= maxPlays) {
      if (statusEl) {
        statusEl.textContent =
          "Đã hết 5 lượt tính điểm — lượt này chơi tự do, không tính điểm và không ghi lên BXH.";
      }
      return;
    }

    const submittedPlayer = { ...activePlayer };
    const result = await leaderboardClient.submitPlayResult({
      mssv: submittedPlayer.mssv,
      name: submittedPlayer.name,
      score: scoreInfo.totalScore,
      years: yearsSurvived,
      balanceScore: scoreInfo.balanceScore,
      isVictory,
    });

    if (activePlayer && activePlayer.mssv === submittedPlayer.mssv) {
      playerPlaysUsed = result.playsUsed;
      if (result.entry) {
        playerBestScore = result.entry.score;
      }
      updatePlayerPanelUI();
    }

    if (statusEl) {
      if (result.isPractice) {
        statusEl.textContent =
          "Đã hết 5 lượt tính điểm — lượt này không ghi lên BXH.";
      } else if (result.mode === "online") {
        statusEl.textContent = result.isNewBest
          ? `Kỷ lục mới ${result.entry.score}đ! Đã lưu lên BXH Online (Lượt ${result.playsUsed}/${result.maxScoredPlays}).`
          : `Đã lưu lượt ${result.playsUsed}/${result.maxScoredPlays} (giữ kỷ lục ${result.entry.score}đ).`;
      } else {
        statusEl.textContent = result.isNewBest
          ? `Offline: đã lưu tạm ${result.entry.score}đ trên máy (Lượt ${result.playsUsed}/${result.maxScoredPlays}).`
          : `Offline: đã ghi nhận lượt ${result.playsUsed}/${result.maxScoredPlays}.`;
      }
    }

    const updatedLb = await leaderboardClient.fetchLeaderboard();
    renderLeaderboard(updatedLb);
  }

  function linkFieldError(inputEl, shown) {
    const errorId = inputEl && inputEl.dataset ? inputEl.dataset.error : "";
    if (!errorId) return;
    const existingIds = (inputEl.getAttribute("aria-describedby") || "")
      .split(/\s+/)
      .filter((id) => id && id !== errorId);
    if (shown) existingIds.push(errorId);
    if (existingIds.length) {
      inputEl.setAttribute("aria-describedby", existingIds.join(" "));
    } else {
      inputEl.removeAttribute("aria-describedby");
    }
  }

  function announceFormError(inputEl, message) {
    const announcer = document.getElementById("game-sr-announcer");
    if (!announcer || !message) return;
    clearTimeout(srAnnounceTimer);
    announcer.textContent = "";
    lastAnnouncedField = inputEl;
    srAnnounceTimer = setTimeout(() => {
      announcer.textContent = message;
    }, 500);
  }

  function syncPlayerFormValidation({ showErrors = false, announce = false } = {}) {
    const nameInput = document.getElementById("player-name-input");
    const mssvInput = document.getElementById("player-mssv-input");
    if (!nameInput || !mssvInput) return { valid: false };

    const check = validatePlayerIdentity(nameInput.value, mssvInput.value);
    const pairs = [
      { input: nameInput, errorMsg: check.errors.name },
      { input: mssvInput, errorMsg: check.errors.mssv },
    ];

    pairs.forEach(({ input, errorMsg }) => {
      input.setCustomValidity(errorMsg || "");
      const state = fieldInteractionState.get(input) || {
        touched: false,
        blurred: false,
      };
      const shouldShow = showErrors || state.blurred;
      const isInvalid = Boolean(errorMsg) && shouldShow;
      const errorEl = document.getElementById(input.dataset.error || "");

      input.classList.toggle("user-invalid-fallback", isInvalid);
      input.classList.toggle(
        "user-valid-fallback",
        !errorMsg && (showErrors || state.blurred || state.touched),
      );
      input.setAttribute("aria-invalid", isInvalid ? "true" : "false");
      linkFieldError(input, isInvalid);

      if (errorEl) {
        errorEl.textContent = isInvalid ? errorMsg : "";
        errorEl.classList.toggle("is-visible", isInvalid);
      }

      if (!errorMsg && lastAnnouncedField === input) {
        clearTimeout(srAnnounceTimer);
        const announcer = document.getElementById("game-sr-announcer");
        if (announcer) announcer.textContent = "";
      }
    });

    if (announce && !check.valid) {
      const firstErr = check.errors.name || check.errors.mssv;
      const firstEl = check.errors.name ? nameInput : mssvInput;
      announceFormError(firstEl, firstErr);
    }

    return check;
  }

  function clearPlayerFormErrors() {
    const nameInput = document.getElementById("player-name-input");
    const mssvInput = document.getElementById("player-mssv-input");
    [nameInput, mssvInput].forEach((input) => {
      if (!input) return;
      fieldInteractionState.delete(input);
      input.setCustomValidity("");
      input.classList.remove("user-invalid-fallback", "user-valid-fallback");
      input.setAttribute("aria-invalid", "false");
      linkFieldError(input, false);
      const errorEl = document.getElementById(input.dataset.error || "");
      if (errorEl) {
        errorEl.textContent = "";
        errorEl.classList.remove("is-visible");
      }
    });
  }

  function onTabActivated() {
    renderCard();
    updatePlayerPanelUI();
    syncLeaderboardAndPlayer();
  }

  function init() {
    leaderboardClient = createLeaderboardClient();

    const card = document.getElementById("reigns-card");
    const btnLeft = document.getElementById("btn-reigns-left");
    const btnRight = document.getElementById("btn-reigns-right");
    const pillLeft = document.getElementById("choice-pill-left");
    const pillRight = document.getElementById("choice-pill-right");
    const rulesToggleBtn = document.getElementById("btn-game-rules-toggle");
    const rulesCloseBtn = document.getElementById("btn-game-rules-close");
    const refreshLbBtn = document.getElementById("btn-leaderboard-refresh");
    const expandLbBtn = document.getElementById("btn-leaderboard-expand");
    const fullLbModal = document.getElementById("leaderboard-full-modal");
    const fullLbCloseBtn = document.getElementById("btn-leaderboard-full-close");
    const fullLbRefreshBtn = document.getElementById("btn-leaderboard-full-refresh");
    const playerForm = document.getElementById("game-player-form");
    const nameInput = document.getElementById("player-name-input");
    const mssvInput = document.getElementById("player-mssv-input");
    const changePlayerBtn = document.getElementById("btn-change-player");
    const cancelPlayerBtn = document.getElementById("btn-player-cancel");

    const saved = leaderboardClient.loadSavedPlayer();
    if (saved) {
      activePlayer = saved;
      isEditingPlayer = false;
      const localRecord = leaderboardClient.getLocalEntry(saved.mssv);
      playerPlaysUsed = localRecord ? localRecord.plays : 0;
      playerBestScore = localRecord ? localRecord.score : null;
    } else {
      activePlayer = null;
      isEditingPlayer = false;
    }

    const filterButtons = document.querySelectorAll(".game-filter-btn");
    filterButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        setCategory("all");
      });
    });

    if (rulesToggleBtn) {
      rulesToggleBtn.addEventListener("click", () => {
        const isCurrentlyOpen =
          rulesToggleBtn.getAttribute("aria-expanded") === "true";
        setRulesPanelVisible(!isCurrentlyOpen);
      });
    }

    if (rulesCloseBtn) {
      rulesCloseBtn.addEventListener("click", () => setRulesPanelVisible(false));
    }

    if (refreshLbBtn) {
      refreshLbBtn.addEventListener("click", () => syncLeaderboardAndPlayer());
    }

    if (expandLbBtn) {
      expandLbBtn.addEventListener("click", openFullLeaderboardModal);
    }

    if (fullLbCloseBtn) {
      fullLbCloseBtn.addEventListener("click", closeFullLeaderboardModal);
    }

    if (fullLbRefreshBtn) {
      fullLbRefreshBtn.addEventListener("click", () => syncLeaderboardAndPlayer());
    }

    // Fallback light-dismiss cho trình duyệt chưa hỗ trợ thuộc tính closedby="any"
    if (
      fullLbModal &&
      typeof HTMLDialogElement !== "undefined" &&
      !("closedBy" in HTMLDialogElement.prototype)
    ) {
      fullLbModal.addEventListener("click", (event) => {
        if (event.target !== fullLbModal) return;
        const rect = fullLbModal.getBoundingClientRect();
        const inside =
          rect.top <= event.clientY &&
          event.clientY <= rect.top + rect.height &&
          rect.left <= event.clientX &&
          event.clientX <= rect.left + rect.width;
        if (!inside) closeFullLeaderboardModal();
      });
    }

    function bindPlayerFieldEvents(inputEl, transformFn) {
      if (!inputEl) return;
      inputEl.addEventListener("input", () => {
        if (transformFn) {
          const next = transformFn(inputEl.value);
          if (inputEl.value !== next) inputEl.value = next;
        }
        const st = fieldInteractionState.get(inputEl) || {
          touched: false,
          blurred: false,
        };
        st.touched = true;
        fieldInteractionState.set(inputEl, st);
        syncPlayerFormValidation();
      });

      inputEl.addEventListener("blur", () => {
        const st = fieldInteractionState.get(inputEl) || {
          touched: false,
          blurred: false,
        };
        if (st.touched || inputEl.value.length > 0) {
          st.blurred = true;
          fieldInteractionState.set(inputEl, st);
          syncPlayerFormValidation({ announce: true });
        }
      });
    }

    bindPlayerFieldEvents(mssvInput, sanitizeMssvInput);
    bindPlayerFieldEvents(nameInput, null);

    if (playerForm) {
      playerForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        if (mssvInput) {
          mssvInput.value = sanitizeMssvInput(mssvInput.value);
        }
        [nameInput, mssvInput].forEach((input) => {
          if (input) {
            fieldInteractionState.set(input, { touched: true, blurred: true });
          }
        });

        const validation = syncPlayerFormValidation({
          showErrors: true,
          announce: false,
        });
        if (!validation.valid) {
          const firstInvalid = validation.errors.name ? nameInput : mssvInput;
          if (firstInvalid) firstInvalid.focus();
          return;
        }

        const isDifferentPlayer =
          !activePlayer || activePlayer.mssv !== validation.mssv;
        const confirmed = leaderboardClient.savePlayer({
          name: validation.name,
          mssv: validation.mssv,
        });
        activePlayer = confirmed;
        isEditingPlayer = false;
        clearPlayerFormErrors();

        const localEntry = leaderboardClient.getLocalEntry(confirmed.mssv);
        playerPlaysUsed = localEntry ? localEntry.plays : 0;
        playerBestScore = localEntry ? localEntry.score : null;

        if (isDifferentPlayer || isGameOver) {
          resetGame();
        } else {
          updatePlayerPanelUI();
        }
        await syncLeaderboardAndPlayer();
      });
    }

    if (changePlayerBtn) {
      changePlayerBtn.addEventListener("click", () => {
        isEditingPlayer = true;
        clearPlayerFormErrors();
        if (nameInput) nameInput.value = "";
        if (mssvInput) mssvInput.value = "";
        updatePlayerPanelUI();
        if (nameInput) nameInput.focus();
      });
    }

    if (cancelPlayerBtn) {
      cancelPlayerBtn.addEventListener("click", () => {
        if (!activePlayer) return;
        isEditingPlayer = false;
        clearPlayerFormErrors();
        updatePlayerPanelUI();
      });
    }

    btnLeft.addEventListener("click", () => applyChoice("left"));
    btnRight.addEventListener("click", () => applyChoice("right"));

    btnLeft.addEventListener("mouseenter", () => {
      if (isPlayerReadyToPlay() && !isGameOver && deck[currentCardIndex])
        showStatDots(deck[currentCardIndex].left.effects);
    });
    btnLeft.addEventListener("mouseleave", clearStatDots);

    btnRight.addEventListener("mouseenter", () => {
      if (isPlayerReadyToPlay() && !isGameOver && deck[currentCardIndex])
        showStatDots(deck[currentCardIndex].right.effects);
    });
    btnRight.addEventListener("mouseleave", clearStatDots);

    let isDragging = false;
    let startX = 0;
    let currentX = 0;

    function onDragStart(e) {
      if (!isPlayerReadyToPlay() || isGameOver) return;
      isDragging = true;
      currentX = 0;
      startX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      card.classList.add("swiping");
      card.classList.remove("reset-anim");
    }

    function onDragMove(e) {
      if (!isDragging) return;
      currentX =
        (e.clientX || (e.touches && e.touches[0].clientX) || 0) - startX;
      const rot = currentX * 0.08;
      card.style.transform = `translate(${currentX}px, ${Math.abs(currentX) * 0.1}px) rotate(${rot}deg)`;

      const cardData = deck[currentCardIndex];
      if (!cardData) return;
      if (currentX < -30) {
        pillLeft.style.opacity = Math.min(
          1,
          Math.abs(currentX) / 100,
        ).toString();
        pillRight.style.opacity = "0";
        showStatDots(cardData.left.effects);
      } else if (currentX > 30) {
        pillRight.style.opacity = Math.min(
          1,
          Math.abs(currentX) / 100,
        ).toString();
        pillLeft.style.opacity = "0";
        showStatDots(cardData.right.effects);
      } else {
        pillLeft.style.opacity = "0";
        pillRight.style.opacity = "0";
        clearStatDots();
      }
    }

    function onDragEnd() {
      if (!isDragging) return;
      isDragging = false;
      card.classList.remove("swiping");

      if (currentX < -110) {
        applyChoice("left");
      } else if (currentX > 110) {
        applyChoice("right");
      } else {
        card.classList.add("reset-anim");
        card.style.transform = "translate(0px, 0px) rotate(0deg)";
        pillLeft.style.opacity = "0";
        pillRight.style.opacity = "0";
        clearStatDots();
      }
    }

    card.addEventListener("mousedown", onDragStart);
    window.addEventListener("mousemove", onDragMove);
    window.addEventListener("mouseup", onDragEnd);

    card.addEventListener("touchstart", onDragStart, { passive: true });
    window.addEventListener("touchmove", onDragMove, { passive: true });
    window.addEventListener("touchend", onDragEnd);

    window.addEventListener("keydown", (e) => {
      const qrModal = document.getElementById("qr-modal");
      if (qrModal && !qrModal.classList.contains("hidden")) {
        return;
      }
      const fullLb = document.getElementById("leaderboard-full-modal");
      if (fullLb && fullLb.open) {
        return;
      }
      const activeTag =
        document.activeElement && document.activeElement.tagName
          ? document.activeElement.tagName.toUpperCase()
          : "";
      if (["INPUT", "TEXTAREA", "SELECT"].includes(activeTag)) {
        return;
      }
      const gameSection = document.getElementById("section-game");
      if (
        gameSection &&
        !gameSection.classList.contains("hidden") &&
        isPlayerReadyToPlay() &&
        !isGameOver
      ) {
        if (e.key === "ArrowLeft") applyChoice("left");
        else if (e.key === "ArrowRight") applyChoice("right");
      }
    });

    document
      .getElementById("btn-reigns-retry")
      .addEventListener("click", resetGame);
    document
      .getElementById("btn-reigns-win-restart")
      .addEventListener("click", resetGame);

    buildDeck();
    updateHUDStats();
    renderCard();
    updatePlayerPanelUI();
    syncLeaderboardAndPlayer();
  }

  // ================= BẢNG XẾP HẠNG ONLINE & QUY TẮC ĐỊNH DANH =================
  const MSSV_REGEX = /^\d{8}$/;
  const DEFAULT_LEADERBOARD_CONFIG = {
    firebaseDbUrl: "",
    maxScoredPlays: 5,
    topLimit: 10,
    requestTimeoutMs: 7000,
    storageKeys: {
      player: "ktct_game_player_v1",
      localLeaderboard: "ktct_game_leaderboard_local_v1",
    },
  };

  function resolveLeaderboardConfig(overrideConfig) {
    const globalCfg =
      typeof window !== "undefined" && window.GAME_LEADERBOARD_CONFIG
        ? window.GAME_LEADERBOARD_CONFIG
        : typeof globalThis !== "undefined" && globalThis.GAME_LEADERBOARD_CONFIG
          ? globalThis.GAME_LEADERBOARD_CONFIG
          : null;
    const merged = {
      ...DEFAULT_LEADERBOARD_CONFIG,
      ...(globalCfg || {}),
      ...(overrideConfig || {}),
    };
    merged.storageKeys = {
      ...DEFAULT_LEADERBOARD_CONFIG.storageKeys,
      ...(globalCfg && globalCfg.storageKeys ? globalCfg.storageKeys : {}),
      ...(overrideConfig && overrideConfig.storageKeys
        ? overrideConfig.storageKeys
        : {}),
    };
    return merged;
  }

  function normalizeDbUrl(url) {
    return typeof url === "string" ? url.trim().replace(/\/+$/, "") : "";
  }

  function sanitizePlayerName(raw) {
    return typeof raw === "string" ? raw.trim().replace(/\s+/g, " ") : "";
  }

  function sanitizeMssvInput(raw) {
    if (raw === null || raw === undefined) return "";
    return String(raw).replace(/\D/g, "").slice(0, 8);
  }

  function buildLeaderboardUrls(baseUrl, mssv) {
    const cleanBase = normalizeDbUrl(baseUrl);
    const cleanMssv = sanitizeMssvInput(mssv);
    return {
      baseUrl: cleanBase,
      listUrl: cleanBase ? `${cleanBase}/leaderboard.json` : "",
      entryUrl:
        cleanBase && MSSV_REGEX.test(cleanMssv)
          ? `${cleanBase}/leaderboard/${cleanMssv}.json`
          : "",
    };
  }

  function validatePlayerIdentity(rawName, rawMssv) {
    const name = sanitizePlayerName(rawName);
    const mssv = rawMssv === null || rawMssv === undefined ? "" : String(rawMssv).trim();
    let nameError = "";
    let mssvError = "";

    if (!name) {
      nameError = "Nhập Họ và tên.";
    } else if (name.length < 2 || name.length > 40) {
      nameError = "Tên từ 2–40 ký tự.";
    }

    if (!mssv) {
      mssvError = "Nhập MSSV (8 số).";
    } else if (!MSSV_REGEX.test(mssv)) {
      mssvError = "MSSV phải đúng 8 chữ số.";
    }

    return {
      valid: !nameError && !mssvError,
      name,
      mssv,
      errors: {
        name: nameError,
        mssv: mssvError,
      },
    };
  }

  function escapeHtml(text) {
    return String(text ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function calculateGameScore({ yearsSurvived, stats, isVictory }) {
    const safeYears = Math.max(0, Math.min(maxYears, Number(yearsSurvived) || 0));
    const yearScore = safeYears * 100;
    const statKeys = ["growth", "equity", "environment", "stability"];
    const deviation = statKeys.reduce((sum, key) => {
      const rawVal = stats && typeof stats[key] === "number" ? stats[key] : 50;
      const clampedVal = Math.max(0, Math.min(100, rawVal));
      return sum + Math.abs(clampedVal - 50);
    }, 0);
    const balanceScore = Math.max(0, 200 - deviation);
    const victoryBonus = isVictory ? 200 : 0;
    const totalScore = yearScore + balanceScore + victoryBonus;
    return {
      yearScore,
      balanceScore,
      victoryBonus,
      totalScore,
      deviation,
    };
  }

  function normalizeLeaderboardEntry(rawEntry, fallbackMssv) {
    if (!rawEntry || typeof rawEntry !== "object") return null;
    const rawMssv =
      typeof rawEntry.mssv === "string"
        ? rawEntry.mssv.trim()
        : typeof fallbackMssv === "string"
          ? fallbackMssv.trim()
          : "";
    if (!MSSV_REGEX.test(rawMssv)) return null;
    if (typeof rawEntry.score !== "number" || !Number.isFinite(rawEntry.score)) {
      return null;
    }

    const name = sanitizePlayerName(rawEntry.name) || "Ẩn danh";
    const score = Math.max(0, Math.min(1400, Math.round(rawEntry.score)));
    const plays = Math.max(0, Math.round(Number(rawEntry.plays) || 0));
    const years = Math.max(0, Math.min(maxYears, Math.round(Number(rawEntry.years) || 0)));
    const balanceScore = Math.max(
      0,
      Math.min(200, Math.round(Number(rawEntry.balanceScore) || 0)),
    );
    const isVictory = Boolean(rawEntry.isVictory);
    const updatedAt =
      Number(rawEntry.updatedAt) > 0 ? Number(rawEntry.updatedAt) : 0;

    return {
      mssv: rawMssv,
      name,
      score,
      plays,
      years,
      balanceScore,
      isVictory,
      updatedAt,
    };
  }

  function sortLeaderboardEntries(rawMapOrArray, topLimit = 10) {
    if (!rawMapOrArray || typeof rawMapOrArray !== "object") return [];

    const byMssv = new Map();
    const pairs = Array.isArray(rawMapOrArray)
      ? rawMapOrArray.map((item) => [item && item.mssv, item])
      : Object.entries(rawMapOrArray);

    pairs.forEach(([key, item]) => {
      const normalized = normalizeLeaderboardEntry(item, typeof key === "string" ? key : "");
      if (!normalized) return;
      const prev = byMssv.get(normalized.mssv);
      if (!prev || normalized.score > prev.score) {
        byMssv.set(normalized.mssv, normalized);
      }
    });

    const sorted = Array.from(byMssv.values()).sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (b.years !== a.years) return b.years - a.years;
      if (b.balanceScore !== a.balanceScore) {
        return b.balanceScore - a.balanceScore;
      }
      if (a.updatedAt !== b.updatedAt) return a.updatedAt - b.updatedAt;
      return a.mssv.localeCompare(b.mssv);
    });

    if (typeof topLimit === "number" && Number.isFinite(topLimit) && topLimit > 0) {
      return sorted.slice(0, topLimit);
    }
    return sorted;
  }

  function mergeLeaderboardSubmission(existingEntry, candidate, maxScoredPlays = 5) {
    const cleanMssv = sanitizeMssvInput(candidate && candidate.mssv);
    const existing = existingEntry
      ? normalizeLeaderboardEntry(existingEntry, cleanMssv)
      : null;
    const oldPlays = existing ? existing.plays : 0;

    if (oldPlays >= maxScoredPlays) {
      return {
        shouldSubmit: false,
        isPractice: true,
        isNewBest: false,
        entry: existing,
      };
    }

    const nextPlays = oldPlays + 1;
    const cleanName =
      sanitizePlayerName(candidate && candidate.name) ||
      (existing ? existing.name : "Ẩn danh");
    const cleanScore = Math.max(
      0,
      Math.min(1400, Math.round(Number(candidate && candidate.score) || 0)),
    );
    const cleanYears = Math.max(
      0,
      Math.min(maxYears, Math.round(Number(candidate && candidate.years) || 0)),
    );
    const cleanBalance = Math.max(
      0,
      Math.min(200, Math.round(Number(candidate && candidate.balanceScore) || 0)),
    );
    const cleanVictory = Boolean(candidate && candidate.isVictory);
    const timestamp =
      Number(candidate && candidate.now) > 0 ? Number(candidate.now) : Date.now();
    const isNewBest = !existing || cleanScore > existing.score;

    const entry = isNewBest
      ? {
          mssv: cleanMssv,
          name: cleanName,
          score: cleanScore,
          plays: nextPlays,
          years: cleanYears,
          balanceScore: cleanBalance,
          isVictory: cleanVictory,
          updatedAt: timestamp,
        }
      : {
          mssv: cleanMssv,
          name: cleanName,
          score: existing.score,
          plays: nextPlays,
          years: existing.years,
          balanceScore: existing.balanceScore,
          isVictory: existing.isVictory,
          updatedAt: existing.updatedAt,
        };

    return {
      shouldSubmit: true,
      isPractice: false,
      isNewBest,
      entry,
    };
  }

  function getSafeBrowserStorage(kind) {
    try {
      if (typeof window === "undefined" || !window[kind]) return null;
      return window[kind];
    } catch (_) {
      return null;
    }
  }

  async function fetchJsonWithTimeout(url, options, timeoutMs, fetchImpl) {
    if (!url || typeof fetchImpl !== "function") {
      throw new Error("Fetch unavailable");
    }
    const canAbort = typeof AbortController === "function";
    const controller = canAbort ? new AbortController() : null;
    const timer =
      canAbort && timeoutMs > 0
        ? setTimeout(() => controller.abort(), timeoutMs)
        : null;
    try {
      const fetchOpts = controller
        ? { ...(options || {}), signal: controller.signal }
        : { ...(options || {}) };
      const response = await fetchImpl(url, fetchOpts);
      if (!response || !response.ok) {
        throw new Error(`HTTP ${response ? response.status : "ERR"}`);
      }
      return await response.json();
    } finally {
      if (timer !== null) {
        clearTimeout(timer);
      }
    }
  }

  function createLeaderboardClient(options = {}) {
    const cfg = resolveLeaderboardConfig(options.config);
    const maxScoredPlays =
      Number(cfg.maxScoredPlays) > 0 ? Number(cfg.maxScoredPlays) : 5;
    const topLimit = Number(cfg.topLimit) > 0 ? Number(cfg.topLimit) : 10;
    const timeoutMs =
      Number(cfg.requestTimeoutMs) > 0 ? Number(cfg.requestTimeoutMs) : 7000;
    const playerKey = cfg.storageKeys.player;
    const localLbKey = cfg.storageKeys.localLeaderboard;
    const fetcher =
      options.fetchImpl ||
      (typeof fetch === "function" ? fetch.bind(globalThis) : null);
    const localStore = options.storage || getSafeBrowserStorage("localStorage");
    const sessionStore =
      options.sessionStorage || getSafeBrowserStorage("sessionStorage");

    function readJsonStorage(store, key) {
      if (!store || !key) return null;
      try {
        const raw = store.getItem(key);
        return raw ? JSON.parse(raw) : null;
      } catch (_) {
        return null;
      }
    }

    function writeJsonStorage(store, key, value) {
      if (!store || !key) return;
      try {
        store.setItem(key, JSON.stringify(value));
      } catch (_) {}
    }

    function removeStorageKey(store, key) {
      if (!store || !key) return;
      try {
        store.removeItem(key);
      } catch (_) {}
    }

    function readLocalMap() {
      const parsed = readJsonStorage(localStore, localLbKey);
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
        return {};
      }
      const clean = {};
      Object.entries(parsed).forEach(([key, val]) => {
        const entry = normalizeLeaderboardEntry(val, key);
        if (entry) clean[entry.mssv] = entry;
      });
      return clean;
    }

    function writeLocalMap(map) {
      writeJsonStorage(localStore, localLbKey, map || {});
    }

    function getLocalEntry(mssv) {
      if (!MSSV_REGEX.test(String(mssv || ""))) return null;
      const map = readLocalMap();
      return map[mssv] || null;
    }

    function setLocalEntry(entry) {
      if (!entry || !MSSV_REGEX.test(entry.mssv)) return;
      const map = readLocalMap();
      map[entry.mssv] = entry;
      writeLocalMap(map);
    }

    function savePlayer(player) {
      const check = validatePlayerIdentity(
        player && player.name,
        player && player.mssv,
      );
      if (!check.valid) return null;
      const clean = { name: check.name, mssv: check.mssv };
      writeJsonStorage(sessionStore, playerKey, clean);
      writeJsonStorage(localStore, playerKey, clean);
      return clean;
    }

    function loadSavedPlayer() {
      const fromSession = readJsonStorage(sessionStore, playerKey);
      const fromLocal = readJsonStorage(localStore, playerKey);
      const candidate = fromSession || fromLocal;
      if (!candidate || typeof candidate !== "object") return null;
      const check = validatePlayerIdentity(candidate.name, candidate.mssv);
      return check.valid ? { name: check.name, mssv: check.mssv } : null;
    }

    function clearSavedPlayer() {
      removeStorageKey(sessionStore, playerKey);
      removeStorageKey(localStore, playerKey);
    }

    async function fetchLeaderboard() {
      const urls = buildLeaderboardUrls(cfg.firebaseDbUrl, "");
      if (urls.listUrl && fetcher) {
        try {
          const remoteRaw = await fetchJsonWithTimeout(
            urls.listUrl,
            { method: "GET" },
            timeoutMs,
            fetcher,
          );
          const cleanRemoteMap = {};
          if (remoteRaw && typeof remoteRaw === "object") {
            Object.entries(remoteRaw).forEach(([key, val]) => {
              const entry = normalizeLeaderboardEntry(val, key);
              if (entry) cleanRemoteMap[entry.mssv] = entry;
            });
          }
          writeLocalMap(cleanRemoteMap);
          const allEntries = sortLeaderboardEntries(cleanRemoteMap, Infinity);
          return {
            mode: "online",
            entries: allEntries.slice(0, topLimit),
            allEntries,
            totalPlayers: allEntries.length,
          };
        } catch (_) {}
      }

      const localMap = readLocalMap();
      const allEntries = sortLeaderboardEntries(localMap, Infinity);
      return {
        mode: "offline",
        entries: allEntries.slice(0, topLimit),
        allEntries,
        totalPlayers: allEntries.length,
      };
    }

    async function fetchPlayerRecord(mssv) {
      const cleanMssv = sanitizeMssvInput(mssv);
      if (!MSSV_REGEX.test(cleanMssv)) {
        return { mode: "offline", entry: null };
      }
      const urls = buildLeaderboardUrls(cfg.firebaseDbUrl, cleanMssv);
      if (urls.entryUrl && fetcher) {
        try {
          const remoteRaw = await fetchJsonWithTimeout(
            urls.entryUrl,
            { method: "GET" },
            timeoutMs,
            fetcher,
          );
          const remoteEntry = remoteRaw
            ? normalizeLeaderboardEntry(remoteRaw, cleanMssv)
            : null;
          if (remoteEntry) {
            setLocalEntry(remoteEntry);
          }
          return { mode: "online", entry: remoteEntry };
        } catch (_) {}
      }
      return { mode: "offline", entry: getLocalEntry(cleanMssv) };
    }

    async function submitPlayResult(payload) {
      const check = validatePlayerIdentity(
        payload && payload.name,
        payload && payload.mssv,
      );
      const runScore = Math.max(
        0,
        Math.min(1400, Math.round(Number(payload && payload.score) || 0)),
      );
      if (!check.valid) {
        return {
          submitted: false,
          isPractice: false,
          isNewBest: false,
          mode: "invalid",
          entry: null,
          playsUsed: 0,
          maxScoredPlays,
          runScore,
        };
      }

      const candidate = {
        mssv: check.mssv,
        name: check.name,
        score: runScore,
        years: payload && payload.years,
        balanceScore: payload && payload.balanceScore,
        isVictory: Boolean(payload && payload.isVictory),
        now: payload && payload.now,
      };

      const urls = buildLeaderboardUrls(cfg.firebaseDbUrl, check.mssv);
      if (urls.entryUrl && fetcher) {
        try {
          const remoteRaw = await fetchJsonWithTimeout(
            urls.entryUrl,
            { method: "GET" },
            timeoutMs,
            fetcher,
          );
          const remoteEntry = remoteRaw
            ? normalizeLeaderboardEntry(remoteRaw, check.mssv)
            : null;
          const merged = mergeLeaderboardSubmission(
            remoteEntry,
            candidate,
            maxScoredPlays,
          );

          if (!merged.shouldSubmit) {
            if (remoteEntry) setLocalEntry(remoteEntry);
            return {
              submitted: false,
              isPractice: true,
              isNewBest: false,
              mode: "online",
              entry: remoteEntry,
              playsUsed: maxScoredPlays,
              maxScoredPlays,
              runScore,
            };
          }

          await fetchJsonWithTimeout(
            urls.entryUrl,
            {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(merged.entry),
            },
            timeoutMs,
            fetcher,
          );

          setLocalEntry(merged.entry);
          return {
            submitted: true,
            isPractice: false,
            isNewBest: merged.isNewBest,
            mode: "online",
            entry: merged.entry,
            playsUsed: merged.entry.plays,
            maxScoredPlays,
            runScore,
          };
        } catch (_) {}
      }

      const localEntry = getLocalEntry(check.mssv);
      const offlineMerged = mergeLeaderboardSubmission(
        localEntry,
        candidate,
        maxScoredPlays,
      );
      if (!offlineMerged.shouldSubmit) {
        return {
          submitted: false,
          isPractice: true,
          isNewBest: false,
          mode: "offline",
          entry: localEntry,
          playsUsed: maxScoredPlays,
          maxScoredPlays,
          runScore,
        };
      }

      setLocalEntry(offlineMerged.entry);
      return {
        submitted: true,
        isPractice: false,
        isNewBest: offlineMerged.isNewBest,
        mode: "offline",
        entry: offlineMerged.entry,
        playsUsed: offlineMerged.entry.plays,
        maxScoredPlays,
        runScore,
      };
    }

    return {
      fetchLeaderboard,
      fetchPlayerRecord,
      submitPlayResult,
      loadSavedPlayer,
      savePlayer,
      clearSavedPlayer,
      getLocalEntry,
    };
  }

  return {
    init,
    resetGame,
    setCategory,
    onTabActivated,
    stopConfetti,
    openFullLeaderboardModal,
    closeFullLeaderboardModal,
    getDeckCount: () => reignsDeck.length,
    _leaderboard: {
      normalizeDbUrl,
      buildLeaderboardUrls,
      sanitizePlayerName,
      sanitizeMssvInput,
      validatePlayerIdentity,
      escapeHtml,
      calculateGameScore,
      normalizeLeaderboardEntry,
      sortLeaderboardEntries,
      mergeLeaderboardSubmission,
      createLeaderboardClient,
    },
  };
})();

if (typeof window !== "undefined") {
  window.ReignsGame = ReignsGame;
}
if (typeof module !== "undefined" && module.exports) {
  module.exports = ReignsGame;
}
