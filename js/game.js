// js/game.js - Engine Game Thể Chế (Reigns) - Chế độ NGẪU NHIÊN 10 năm / 30 thẻ bài kèm Hiệu ứng Hình ảnh & Âm thanh
window.ReignsGame = (() => {
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
      },
      right: {
        label: "Giữ Cổ Phần Chi Phối Nhà Nước",
        effects: { growth: -10, equity: +15, environment: 0, stability: +20 },
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
      },
      right: {
        label: "Kích Hoạt Luật Chống Độc Quyền",
        effects: { growth: -15, equity: +20, environment: 0, stability: +15 },
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
      },
      right: {
        label: "Giữ Khung Bình Đẳng Thuế",
        effects: { growth: -15, equity: +20, environment: +5, stability: +15 },
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
      },
      right: {
        label: "Giữ Đất Nông Nghiệp Cho Dân",
        effects: { growth: -10, equity: +20, environment: +15, stability: +10 },
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
      },
      right: {
        label: "Buộc Siết Nợ & Tự Phá Sản",
        effects: { growth: -20, equity: +20, environment: 0, stability: -15 },
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
      },
      right: {
        label: "Xả Quỹ Bình Ổn & Giảm Thuế",
        effects: { growth: +10, equity: +15, environment: -5, stability: +15 },
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
      },
      right: {
        label: "Cấp Bù Lỗ & Giữ Ổn Định Giá",
        effects: { growth: +10, equity: +15, environment: -5, stability: +10 },
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
      },
      right: {
        label: "Xả Kho Dự Trữ & Hạn Ngạch Xuất",
        effects: { growth: -10, equity: +25, environment: 0, stability: +20 },
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
      },
      right: {
        label: "Siết Tín Dụng & Đánh Thuế Lũy Tiến",
        effects: { growth: -15, equity: +20, environment: +5, stability: +20 },
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
      },
      right: {
        label: "Đặt Vào Kiểm Soát Đặc Biệt",
        effects: { growth: -5, equity: +20, environment: 0, stability: +25 },
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
      },
      right: {
        label: "Tăng 3%, Xây Nhà Ở Cho Công Nhân",
        effects: { growth: +10, equity: +10, environment: 0, stability: -15 },
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
      },
      right: {
        label: "Cho Rút Tự Do, Tự Chịu Trách Nhiệm Hưu Trí",
        effects: { growth: +15, equity: +10, environment: 0, stability: -20 },
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
      },
      right: {
        label: "Bảo Hiểm Tự Nguyện Có Hỗ Trợ, Giữ Mô Hình Đối Tác",
        effects: { growth: +15, equity: -10, environment: 0, stability: 0 },
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
      },
      right: {
        label: "Giữ Bảo Hiểm, Nhà Nước Gánh Ưu Đãi",
        effects: { growth: +5, equity: +5, environment: 0, stability: -20 },
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
      },
      right: {
        label: "Cho Ép Giá Thu Mua, Nông Dân Chịu Lỗ",
        effects: { growth: +30, equity: -25, environment: -5, stability: -5 },
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
      },
      right: {
        label: "Đóng Cửa, Đẩy Điện Mái Nhà Và Nhập Điện",
        effects: { growth: -15, equity: +5, environment: +20, stability: -10 },
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
      },
      right: {
        label: "Cấp Thêm Mỏ Cát Sông Cho Cao Tốc",
        effects: { growth: +25, equity: -5, environment: -20, stability: +5 },
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
      },
      right: {
        label: "Cấp Phép Có Điều Kiện, Nhà Nước Giám Sát",
        effects: { growth: +10, equity: +5, environment: -10, stability: -15 },
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
      },
      right: {
        label: "Chuyển Đổi Theo Lộ Trình, Vay Ưu Đãi",
        effects: { growth: -5, equity: -5, environment: +15, stability: -15 },
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
      },
      right: {
        label: "Xây Có Điều Kiện, Trích Quỹ Trồng Rừng Bù",
        effects: { growth: +5, equity: +5, environment: -5, stability: -10 },
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
      },
      right: {
        label: "Đổi Mới Kèm Đào Tạo",
        effects: { growth: +15, equity: +20, environment: +5, stability: +10 },
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
      },
      right: {
        label: "Ưu Đãi Thuế Có Hạn",
        effects: { growth: +20, equity: -15, environment: 0, stability: -10 },
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
      },
      right: {
        label: "Tự Quản Dữ Liệu",
        effects: { growth: +15, equity: -20, environment: 0, stability: -15 },
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
      },
      right: {
        label: "Hợp Tác Tư Nhân Dẫn Dắt",
        effects: { growth: +15, equity: +10, environment: -5, stability: +15 },
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
      },
      right: {
        label: "Giữ Kín Thuật Toán",
        effects: { growth: +20, equity: -15, environment: 0, stability: -15 },
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
      },
      right: {
        label: "Xin Giãn Cam Kết",
        effects: { growth: +10, equity: -10, environment: -20, stability: -10 },
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
      },
      right: {
        label: "Giữ Thị Trường Mở",
        effects: { growth: +15, equity: +5, environment: 0, stability: +5 },
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
      },
      right: {
        label: "Đa Dạng Hóa Thị Trường",
        effects: { growth: +10, equity: +10, environment: 0, stability: +20 },
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
      },
      right: {
        label: "Điều Chỉnh Tỷ Giá Thận Trọng",
        effects: { growth: +5, equity: +10, environment: 0, stability: +20 },
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
      },
      right: {
        label: "Tăng Giám Sát Rủi Ro",
        effects: { growth: +10, equity: +10, environment: 0, stability: +20 },
      },
    },
  ];

  // Hệ thống âm thanh từ thư mục assets/sounds/
  let soundEnabled = true;
  const gameSounds = {
    correct: new Audio("assets/sounds/correct.mp3"),
    wrong: new Audio("assets/sounds/wrong.mp3"),
    lose: new Audio("assets/sounds/lose.mp3"),
    win: new Audio("assets/sounds/win.mp3"),
  };

  Object.values(gameSounds).forEach((aud) => {
    aud.preload = "auto";
  });

  function stopAllSounds() {
    Object.values(gameSounds).forEach((aud) => {
      try {
        aud.pause();
        aud.currentTime = 0;
      } catch (_) {}
    });
  }

  function playGameSound(type) {
    if (!soundEnabled || !gameSounds[type]) return;
    stopAllSounds();
    try {
      const p = gameSounds[type].play();
      if (p && typeof p.catch === "function") {
        p.catch(() => {});
      }
    } catch (_) {}
  }

  function toggleSound() {
    soundEnabled = !soundEnabled;
    if (!soundEnabled) {
      stopAllSounds();
    }
    const btn = document.getElementById("btn-game-sound-toggle");
    const icon = document.getElementById("game-sound-icon");
    const label = document.getElementById("game-sound-label");
    if (btn) btn.setAttribute("aria-pressed", String(soundEnabled));
    if (icon) icon.textContent = soundEnabled ? "🔊" : "🔇";
    if (label)
      label.textContent = soundEnabled ? "Âm thanh: BẬT" : "Âm thanh: TẮT";
  }

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

  // Đánh giá chất lượng lựa chọn: Chọn Đúng (cân bằng / tổng tác động tích cực) vs. Chọn Sai (mất cân bằng / vùng nguy hiểm < 20 hoặc > 80)
  function evaluateChoiceQuality(oldStats, newStats, effects) {
    const statKeys = ["growth", "equity", "environment", "stability"];
    const netEffect = statKeys.reduce((sum, k) => sum + (effects[k] || 0), 0);
    const oldDeviation = statKeys.reduce(
      (sum, k) => sum + Math.abs(oldStats[k] - 50),
      0,
    );
    const newDeviation = statKeys.reduce(
      (sum, k) => sum + Math.abs(newStats[k] - 50),
      0,
    );

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
    if (netEffect < 0 && newDeviation > oldDeviation) return "wrong";
    if (netEffect <= -10) return "wrong";
    return "correct";
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
          "w-full mb-3 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-extrabold text-center bg-emerald-50 text-emerald-700 border border-emerald-300 shadow-sm";
        banner.textContent =
          "✓ Quyết sách hợp lý: Cân bằng vĩ mô & Tác động tích cực!";
      }
    } else {
      card.classList.add("card-wrong-shake");
      if (banner) {
        banner.className =
          "w-full mb-3 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-extrabold text-center bg-rose-50 text-rose-700 border border-rose-300 shadow-sm";
        banner.textContent =
          "⚠ Cảnh báo: Quyết sách gây mất cân bằng hoặc đẩy chỉ số vào vùng nguy hiểm!";
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

    if (failureKey) {
      isGameOver = true;
      document.getElementById("game-play-area").classList.add("hidden");
      document.getElementById("gameover-cause").textContent =
        reasons[failureKey];
      document.getElementById("gameover-years").textContent =
        `${currentYear} / ${maxYears} năm (${categoryLabels.all})`;
      document
        .getElementById("reigns-gameover-modal")
        .classList.remove("hidden");

      triggerLoseVisualEffect();
      playGameSound("lose");
      return true;
    }

    if (currentYear >= maxYears) {
      isGameOver = true;
      document.getElementById("game-play-area").classList.add("hidden");
      const vicTitle = document.getElementById("victory-title-years");
      if (vicTitle) {
        vicTitle.textContent = `Hoàn Thành Xuất Sắc ${maxYears} Năm Nhiệm Kỳ!`;
      }
      document
        .getElementById("reigns-victory-modal")
        .classList.remove("hidden");

      startConfetti();
      playGameSound("win");
      return true;
    }

    return false;
  }

  function applyChoice(side) {
    if (isGameOver || !deck.length) return;
    const cardData = deck[currentCardIndex];
    const decision = side === "left" ? cardData.left : cardData.right;

    const oldStats = { ...reignsStats };
    ["growth", "equity", "environment", "stability"].forEach((k) => {
      reignsStats[k] += decision.effects[k] || 0;
    });

    const quality = evaluateChoiceQuality(
      oldStats,
      reignsStats,
      decision.effects,
    );

    updateHUDStats();

    if (!checkGameOver()) {
      currentYear++;
      currentCardIndex++;
      renderCard();
      triggerChoiceVisualFeedback(quality);
      playGameSound(quality);
    }
  }

  function resetGame() {
    stopAllSounds();
    stopConfetti();
    currentYear = 1;
    currentCardIndex = 0;
    reignsStats = { growth: 50, equity: 50, environment: 50, stability: 50 };
    isGameOver = false;

    const banner = document.getElementById("card-feedback-banner");
    if (banner) {
      banner.className = "hidden";
      banner.textContent = "";
    }
    const card = document.getElementById("reigns-card");
    if (card) {
      card.classList.remove("card-correct-glow", "card-wrong-shake");
    }

    document.getElementById("reigns-gameover-modal").classList.add("hidden");
    document.getElementById("reigns-victory-modal").classList.add("hidden");
    document.getElementById("game-play-area").classList.remove("hidden");
    buildDeck();
    updateHUDStats();
    renderCard();
  }

  function setCategory() {
    selectedCategory = "all";
    const modeSub = document.getElementById("game-mode-subtitle");
    if (modeSub) {
      modeSub.textContent = `Chế độ: ${categoryLabels.all}`;
    }
    resetGame();
  }

  function init() {
    const card = document.getElementById("reigns-card");
    const btnLeft = document.getElementById("btn-reigns-left");
    const btnRight = document.getElementById("btn-reigns-right");
    const pillLeft = document.getElementById("choice-pill-left");
    const pillRight = document.getElementById("choice-pill-right");
    const soundBtn = document.getElementById("btn-game-sound-toggle");

    const filterButtons = document.querySelectorAll(".game-filter-btn");
    filterButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        setCategory("all");
      });
    });

    if (soundBtn) {
      soundBtn.addEventListener("click", toggleSound);
    }

    btnLeft.addEventListener("click", () => applyChoice("left"));
    btnRight.addEventListener("click", () => applyChoice("right"));

    btnLeft.addEventListener("mouseenter", () => {
      if (!isGameOver && deck[currentCardIndex])
        showStatDots(deck[currentCardIndex].left.effects);
    });
    btnLeft.addEventListener("mouseleave", clearStatDots);

    btnRight.addEventListener("mouseenter", () => {
      if (!isGameOver && deck[currentCardIndex])
        showStatDots(deck[currentCardIndex].right.effects);
    });
    btnRight.addEventListener("mouseleave", clearStatDots);

    let isDragging = false;
    let startX = 0;
    let currentX = 0;

    function onDragStart(e) {
      if (isGameOver) return;
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
      const gameSection = document.getElementById("section-game");
      if (
        gameSection &&
        !gameSection.classList.contains("hidden") &&
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
  }

  return {
    init,
    resetGame,
    setCategory,
    stopAllSounds,
    stopConfetti,
    getDeckCount: () => reignsDeck.length,
  };
})();
