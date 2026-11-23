// game/game.js - Ứng dụng Web Game Thể Chế Độc Lập (Reigns - 30 thẻ bài, 3 tab, Firebase RTDB)
const StandaloneReignsGame = (() => {
  const MAX_YEARS = 10;
  const MSSV_REGEX = /^\d{8}$/;

  const categoryLabels = {
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
        "Mất mùa diện rộng khiến giá gạo trên thị trường nội địa tăng 35%, đồng thời giá gạo xuất khẩu chạm đỉnh lịch sử. Thương lái ráo riết thu gom lúa gạo để xuất bán ra nước ngoài nhằm kiếm lời khủng.",
      left: {
        label: "Thả Tự Do Xuất Khẩu Gạo",
        effects: { growth: +20, equity: -25, environment: -10, stability: -20 },
        quality: "wrong",
      },
      right: {
        label: "Xả Kho Dự Trữ & Hạn Ngạch Xuất Khẩu",
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
        label: "Đóng Cửa, Phát Triển Điện Mái Nhà Và Nhập Điện",
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
        label: "Xây Có Điều Kiện, Lập Quỹ Trồng Rừng Thay Thế",
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
        quality: "tradeoff",
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

  // ================= PURE HELPER & FIREBASE LOGIC =================
  function resolveConfig(overrideConfig) {
    if (overrideConfig && typeof overrideConfig === "object") return overrideConfig;
    if (typeof window !== "undefined" && window.GAME_CONFIG) return window.GAME_CONFIG;
    if (typeof require === "function") {
      try {
        return require("./config.js");
      } catch (_) {}
    }
    return {
      firebaseDbUrl:
        "https://ktct-459fa-default-rtdb.asia-southeast1.firebasedatabase.app",
      maxScoredPlays: 5,
      requestTimeoutMs: 7000,
      storageKeys: {
        player: "ktct_standalone_game_player_v1",
        localLeaderboard: "ktct_standalone_game_leaderboard_v1",
      },
    };
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

  function validatePlayerIdentity(rawName, rawMssv) {
    const name = sanitizePlayerName(rawName);
    const mssv =
      rawMssv === null || rawMssv === undefined ? "" : String(rawMssv).trim();
    let nameError = "";
    let mssvError = "";

    if (!name) {
      nameError = "Vui lòng nhập Họ và tên.";
    } else if (name.length < 2 || name.length > 40) {
      nameError = "Họ và tên phải từ 2–40 ký tự.";
    }

    if (!mssv) {
      mssvError = "Vui lòng nhập MSSV (8 chữ số).";
    } else if (!MSSV_REGEX.test(mssv)) {
      mssvError = "MSSV bắt buộc đúng 8 chữ số.";
    }

    return {
      valid: !nameError && !mssvError,
      name,
      mssv,
      errors: { name: nameError, mssv: mssvError },
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

  function calculateGameScore({ yearsSurvived, stats, isVictory }) {
    const safeYears = Math.max(0, Math.min(MAX_YEARS, Number(yearsSurvived) || 0));
    const yearScore = safeYears * 100;
    const statKeys = ["growth", "equity", "environment", "stability"];
    const deviation = statKeys.reduce((sum, key) => {
      const rawVal = stats && typeof stats[key] === "number" ? stats[key] : 50;
      const clampedVal = Math.max(0, Math.min(100, rawVal));
      return sum + Math.abs(clampedVal - 50);
    }, 0);
    const balanceScore = Math.max(0, 200 - deviation);
    const victoryBonus = isVictory ? 200 : 0;
    return {
      yearScore,
      balanceScore,
      victoryBonus,
      totalScore: yearScore + balanceScore + victoryBonus,
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

    return {
      mssv: rawMssv,
      name: sanitizePlayerName(rawEntry.name) || "Ẩn danh",
      score: Math.max(0, Math.min(1400, Math.round(rawEntry.score))),
      plays: Math.max(0, Math.round(Number(rawEntry.plays) || 0)),
      years: Math.max(0, Math.min(MAX_YEARS, Math.round(Number(rawEntry.years) || 0))),
      balanceScore: Math.max(
        0,
        Math.min(200, Math.round(Number(rawEntry.balanceScore) || 0)),
      ),
      isVictory: Boolean(rawEntry.isVictory),
      updatedAt: Number(rawEntry.updatedAt) > 0 ? Number(rawEntry.updatedAt) : 0,
    };
  }

  function sortLeaderboardEntries(rawMapOrArray, topLimit = Infinity) {
    if (!rawMapOrArray || typeof rawMapOrArray !== "object") return [];

    const byMssv = new Map();
    const pairs = Array.isArray(rawMapOrArray)
      ? rawMapOrArray.map((item) => [item && item.mssv, item])
      : Object.entries(rawMapOrArray);

    pairs.forEach(([key, item]) => {
      const normalized = normalizeLeaderboardEntry(
        item,
        typeof key === "string" ? key : "",
      );
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

  function mergeLeaderboardSubmission(
    existingEntry,
    candidate,
    maxScoredPlays = 5,
  ) {
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
      Math.min(MAX_YEARS, Math.round(Number(candidate && candidate.years) || 0)),
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
      if (timer !== null) clearTimeout(timer);
    }
  }

  function createLeaderboardClient(options = {}) {
    const cfg = resolveConfig(options.config);
    const maxScoredPlays =
      Number(cfg.maxScoredPlays) > 0 ? Number(cfg.maxScoredPlays) : 5;
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
      return readLocalMap()[mssv] || null;
    }

    function setLocalEntry(entry) {
      if (!entry || !MSSV_REGEX.test(entry.mssv)) return;
      const map = readLocalMap();
      map[entry.mssv] = entry;
      writeLocalMap(map);
    }

    function removeLocalEntry(mssv) {
      if (!MSSV_REGEX.test(String(mssv || ""))) return;
      const map = readLocalMap();
      if (Object.prototype.hasOwnProperty.call(map, mssv)) {
        delete map[mssv];
        writeLocalMap(map);
      }
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
      const candidate =
        readJsonStorage(sessionStore, playerKey) ||
        readJsonStorage(localStore, playerKey);
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
            allEntries,
            totalPlayers: allEntries.length,
          };
        } catch (_) {}
      }

      const allEntries = sortLeaderboardEntries(readLocalMap(), Infinity);
      return {
        mode: "offline",
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
          if (remoteEntry) setLocalEntry(remoteEntry);
          return { mode: "online", entry: remoteEntry };
        } catch (_) {}
      }
      return { mode: "offline", entry: getLocalEntry(cleanMssv) };
    }

    async function updatePlayerDisplayName(mssv, newName) {
      const cleanMssv = sanitizeMssvInput(mssv);
      const cleanName = sanitizePlayerName(newName);
      if (!MSSV_REGEX.test(cleanMssv) || !cleanName) return false;
      const urls = buildLeaderboardUrls(cfg.firebaseDbUrl, cleanMssv);
      const local = getLocalEntry(cleanMssv);
      if (local) {
        setLocalEntry({ ...local, name: cleanName });
      }
      if (urls.entryUrl && fetcher) {
        try {
          await fetchJsonWithTimeout(
            urls.entryUrl,
            {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ name: cleanName }),
            },
            timeoutMs,
            fetcher,
          );
          return true;
        } catch (_) {}
      }
      return false;
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

    async function deletePlayerRecord(mssv) {
      const cleanMssv = sanitizeMssvInput(mssv);
      let remoteDeleted = false;
      let mode = "offline";

      if (MSSV_REGEX.test(cleanMssv)) {
        const urls = buildLeaderboardUrls(cfg.firebaseDbUrl, cleanMssv);
        if (urls.entryUrl && fetcher) {
          try {
            await fetchJsonWithTimeout(
              urls.entryUrl,
              { method: "DELETE" },
              timeoutMs,
              fetcher,
            );
            remoteDeleted = true;
            mode = "online";
          } catch (_) {}
        }
        removeLocalEntry(cleanMssv);
      }

      clearSavedPlayer();
      return { deleted: true, remoteDeleted, mode };
    }

    return {
      fetchLeaderboard,
      fetchPlayerRecord,
      updatePlayerDisplayName,
      submitPlayResult,
      deletePlayerRecord,
      loadSavedPlayer,
      savePlayer,
      clearSavedPlayer,
      getLocalEntry,
    };
  }

  // ================= AUDIO ENGINE =================
  let audioCtx = null;
  let isMuted = false;

  function playSound(type) {
    if (isMuted || typeof window === "undefined") return;
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      if (!audioCtx) audioCtx = new Ctx();
      if (audioCtx.state === "suspended") audioCtx.resume();

      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      if (type === "correct") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.12);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
        osc.start(now);
        osc.stop(now + 0.22);
      } else if (type === "wrong") {
        osc.type = "triangle";
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(146.83, now + 0.18);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);
        osc.start(now);
        osc.stop(now + 0.24);
      } else if (type === "victory") {
        [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
          const o = audioCtx.createOscillator();
          const g = audioCtx.createGain();
          o.type = "sine";
          o.frequency.setValueAtTime(freq, now + idx * 0.09);
          g.gain.setValueAtTime(0.08, now + idx * 0.09);
          g.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.09 + 0.35);
          o.connect(g);
          g.connect(audioCtx.destination);
          o.start(now + idx * 0.09);
          o.stop(now + idx * 0.09 + 0.35);
        });
      } else if (type === "gameover") {
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(196, now);
        osc.frequency.exponentialRampToValueAtTime(98, now + 0.45);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.48);
        osc.start(now);
        osc.stop(now + 0.48);
      }
    } catch (_) {}
  }

  // ================= CONFETTI =================
  let confettiAnimId = null;
  let confettiParticles = [];

  function startConfetti() {
    const canvas = document.getElementById("confetti-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = canvas.parentElement ? canvas.parentElement.clientWidth : window.innerWidth;
    canvas.height = canvas.parentElement ? canvas.parentElement.clientHeight : window.innerHeight;

    const colors = ["#df7a28", "#f59e0b", "#10b981", "#3b82f6", "#ef4444"];
    confettiParticles = Array.from({ length: 70 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      w: Math.random() * 8 + 4,
      h: Math.random() * 5 + 3,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 2.5,
      vy: Math.random() * 3 + 2,
      rot: Math.random() * 360,
      vRot: (Math.random() - 0.5) * 6,
    }));

    function renderFrame() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      confettiParticles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vRot;
        if (p.y > canvas.height) {
          p.y = -10;
          p.x = Math.random() * canvas.width;
        }
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rot * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      });
      confettiAnimId = requestAnimationFrame(renderFrame);
    }
    stopConfetti();
    confettiAnimId = requestAnimationFrame(renderFrame);
  }

  function stopConfetti() {
    if (confettiAnimId) {
      cancelAnimationFrame(confettiAnimId);
      confettiAnimId = null;
    }
    const canvas = typeof document !== "undefined" ? document.getElementById("confetti-canvas") : null;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  // ================= BROWSER STATE & UI CONTROLLERS =================
  let currentTab = "play";
  let currentYear = 1;
  let reignsStats = { growth: 50, equity: 50, environment: 50, stability: 50 };
  let currentCardIndex = 0;
  let isGameOver = false;
  let deck = [];
  let cardAnimTimer = null;

  let client = null;
  let activePlayer = null;
  let playerPlaysUsed = 0;
  let playerBestScore = null;
  let hasSubmittedCurrentRun = false;
  let latestLeaderboard = { mode: "online", allEntries: [], totalPlayers: 0 };

  function shuffleArray(arr) {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function buildDeck() {
    deck = shuffleArray(reignsDeck).slice(0, MAX_YEARS);
  }

  function updatePlayerBadges() {
    const cfg = resolveConfig();
    const maxPlays = Number(cfg.maxScoredPlays) || 5;
    const nameEl = document.getElementById("header-player-name");
    const mssvEl = document.getElementById("header-player-mssv");
    const playCountBadge = document.getElementById("play-count-badge");
    const bestBadge = document.getElementById("play-best-badge");
    const practiceBanner = document.getElementById("game-practice-banner");

    if (nameEl) nameEl.textContent = activePlayer ? activePlayer.name : "Khách";
    if (mssvEl) mssvEl.textContent = activePlayer ? activePlayer.mssv : "--------";
    if (playCountBadge) {
      playCountBadge.textContent = `Lượt tính điểm: ${Math.min(playerPlaysUsed, maxPlays)} / ${maxPlays}`;
    }
    if (bestBadge) {
      bestBadge.textContent =
        playerBestScore !== null ? `Kỷ lục: ${playerBestScore} điểm` : "Kỷ lục: --";
    }
    if (practiceBanner) {
      practiceBanner.classList.toggle("hidden", playerPlaysUsed < maxPlays);
    }
  }

  function updateHUDStats() {
    ["growth", "equity", "environment", "stability"].forEach((key) => {
      const val = Math.max(0, Math.min(100, reignsStats[key]));
      const bar = document.getElementById(`stat-bar-${key}`);
      const text = document.getElementById(`stat-val-${key}`);
      const isDanger = val < 20 || val > 80;

      if (bar) {
        bar.style.width = `${val}%`;
        bar.classList.toggle("stat-bar-danger", isDanger);
      }
      if (text) {
        text.textContent = val;
        text.classList.toggle("stat-val-danger", isDanger);
      }
    });
  }

  function clearStatDots() {
    document.querySelectorAll(".stat-dot").forEach((d) => d.classList.remove("active"));
  }

  function showStatDots(effects) {
    clearStatDots();
    ["growth", "equity", "environment", "stability"].forEach((key) => {
      if (effects && effects[key]) {
        const dot = document.querySelector(`.stat-hud[data-stat="${key}"] .stat-dot`);
        if (dot) dot.classList.add("active");
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

    document.getElementById("card-speaker-title").textContent = cardData.speakerTitle;
    document.getElementById("card-speaker-name").textContent = cardData.speakerName;
    document.getElementById("card-dialogue").textContent = cardData.dialogue;
    document.getElementById("btn-label-left").textContent = cardData.left.label;
    document.getElementById("btn-label-right").textContent = cardData.right.label;
    document.getElementById("choice-pill-left").textContent = cardData.left.label;
    document.getElementById("choice-pill-right").textContent = cardData.right.label;
    document.getElementById("game-year-display").textContent = `Năm thứ ${currentYear} / ${MAX_YEARS}`;

    const card = document.getElementById("reigns-card");
    if (card) card.style.transform = "translate(0px, 0px) rotate(0deg)";
    document.getElementById("choice-pill-left").style.opacity = "0";
    document.getElementById("choice-pill-right").style.opacity = "0";
    clearStatDots();
  }

  function evaluateChoiceQuality(_oldStats, newStats, decision) {
    const effects = (decision && decision.effects) || {};
    const pushedIntoDanger = ["growth", "equity", "environment", "stability"].some(
      (k) => (newStats[k] < 20 && (effects[k] || 0) < 0) || (newStats[k] > 80 && (effects[k] || 0) > 0),
    );
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

  function triggerChoiceVisualFeedback(quality) {
    const card = document.getElementById("reigns-card");
    const banner = document.getElementById("card-feedback-banner");
    if (!card) return;

    if (cardAnimTimer) {
      clearTimeout(cardAnimTimer);
      cardAnimTimer = null;
    }

    card.classList.remove("card-correct-glow", "card-wrong-shake");
    void card.offsetWidth;

    if (quality === "correct") {
      card.classList.add("card-correct-glow");
      playSound("correct");
      if (banner) {
        banner.className =
          "w-full px-3 py-1.5 rounded-xl text-xs font-extrabold text-center bg-emerald-50 text-emerald-700 border border-emerald-300";
        banner.textContent = "Quyết sách hợp lý: Cân bằng vĩ mô & Tác động tích cực!";
      }
    } else {
      card.classList.add("card-wrong-shake");
      playSound("wrong");
      if (banner) {
        banner.className =
          "w-full px-3 py-1.5 rounded-xl text-xs font-extrabold text-center bg-rose-50 text-rose-700 border border-rose-300";
        banner.textContent =
          "Cảnh báo: Quyết sách gây mất cân bằng hoặc đẩy chỉ số vào vùng nguy hiểm!";
      }
    }

    cardAnimTimer = setTimeout(() => {
      card.classList.remove("card-correct-glow", "card-wrong-shake");
    }, 550);
  }

  function renderEndgameScoreBox(kind, scoreInfo) {
    const totalEl = document.getElementById(`${kind}-total-score`);
    const breakdownEl = document.getElementById(`${kind}-score-breakdown`);
    const noteEl = document.getElementById(`${kind}-submit-note`);
    if (totalEl) totalEl.textContent = `${scoreInfo.totalScore} điểm`;
    if (breakdownEl) {
      breakdownEl.textContent = `Số năm (${scoreInfo.yearScore}) + Cân bằng (${scoreInfo.balanceScore}) + Hoàn thành (${scoreInfo.victoryBonus})`;
    }
    if (noteEl) {
      noteEl.textContent = "Đang đồng bộ kết quả lên Bảng Xếp Hạng...";
    }
  }

  async function handleRunFinished({ yearsSurvived, isVictory, scoreInfo }) {
    if (!activePlayer || !client) return;
    const kind = isVictory ? "victory" : "gameover";
    const noteEl = document.getElementById(`${kind}-submit-note`);

    const result = await client.submitPlayResult({
      name: activePlayer.name,
      mssv: activePlayer.mssv,
      score: scoreInfo.totalScore,
      years: yearsSurvived,
      balanceScore: scoreInfo.balanceScore,
      isVictory,
    });

    if (result.entry) {
      playerPlaysUsed = result.entry.plays;
      playerBestScore = result.entry.score;
    }
    updatePlayerBadges();

    if (noteEl) {
      if (result.isPractice) {
        noteEl.textContent =
          "Đã hết 5 lượt tính điểm — lượt này chơi tự do, không ghi lên BXH.";
      } else if (result.isNewBest) {
        noteEl.textContent = `Đã lưu kỷ lục mới (${result.entry.score} điểm) — Lượt ${result.playsUsed}/${result.maxScoredPlays}.`;
      } else {
        noteEl.textContent = `Đã ghi nhận lượt ${result.playsUsed}/${result.maxScoredPlays}. Kỷ lục giữ nguyên: ${result.entry.score} điểm.`;
      }
    }
    refreshLeaderboard();
  }

  function checkGameOver() {
    const reasons = {
      growth_low:
        "Chỉ số Tăng Trưởng rơi về 0: Nền kinh tế đình trệ hoàn toàn, thất nghiệp tràn lan khiến thể chế mất nguồn thu ngân sách.",
      growth_high:
        "Chỉ số Tăng Trưởng chạm 100: Nền kinh tế quá nóng sinh ra bong bóng đầu cơ và lạm phát phi mã.",
      equity_low:
        "Chỉ số Công Bằng rơi về 0: Bất bình đẳng thu nhập tột độ dẫn đến tổng bãi công diện rộng.",
      equity_high:
        "Chỉ số Công Bằng chạm 100: Chủ nghĩa cào bằng tuyệt đối triệt tiêu động lực lao động và sáng tạo.",
      environment_low:
        "Chỉ số Môi Trường rơi về 0: Cạn kiệt tài nguyên và ô nhiễm nghiêm trọng gây thảm họa y tế công cộng.",
      environment_high:
        "Chỉ số Môi Trường chạm 100: Đình chỉ cực đoan mọi hoạt động sản xuất khiến xã hội thiếu thốn nhu yếu phẩm.",
      stability_low:
        "Chỉ số Ổn Định rơi về 0: Khủng hoảng tài chính dây chuyền, thị trường mất kiểm soát.",
      stability_high:
        "Chỉ số Ổn Định chạm 100: Can thiệp hành chính quá mức làm thị trường đông cứng tuyệt đối.",
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
        document.getElementById("victory-title-years").textContent =
          `Hoàn Thành Xuất Sắc ${MAX_YEARS} Năm Nhiệm Kỳ!`;
        renderEndgameScoreBox("victory", scoreInfo);
        document.getElementById("reigns-victory-modal").classList.remove("hidden");
        playSound("victory");
        startConfetti();
      } else {
        document.getElementById("gameover-cause").textContent = failureReason;
        document.getElementById("gameover-years").textContent =
          `${yearsSurvived} / ${MAX_YEARS} năm`;
        renderEndgameScoreBox("gameover", scoreInfo);
        document.getElementById("reigns-gameover-modal").classList.remove("hidden");
        const flash = document.getElementById("game-red-flash-overlay");
        if (flash) {
          flash.classList.remove("active-red-flash");
          void flash.offsetWidth;
          flash.classList.add("active-red-flash");
        }
        playSound("gameover");
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
    if (currentYear >= MAX_YEARS) {
      return finishGame({ isVictory: true, yearsSurvived: MAX_YEARS });
    }
    return false;
  }

  function applyChoice(side) {
    if (!activePlayer || isGameOver || !deck.length) return;
    const cardData = deck[currentCardIndex];
    const decision = side === "left" ? cardData.left : cardData.right;

    const oldStats = { ...reignsStats };
    ["growth", "equity", "environment", "stability"].forEach((k) => {
      reignsStats[k] += decision.effects[k] || 0;
    });

    const quality = evaluateChoiceQuality(oldStats, reignsStats, decision);
    updateHUDStats();
    triggerChoiceVisualFeedback(quality);

    if (!checkGameOver()) {
      currentYear++;
      currentCardIndex++;
      if (currentCardIndex >= deck.length) {
        buildDeck();
        currentCardIndex = 0;
      }
      renderCard();
    }
  }

  function resetGame() {
    currentYear = 1;
    reignsStats = { growth: 50, equity: 50, environment: 50, stability: 50 };
    currentCardIndex = 0;
    isGameOver = false;
    hasSubmittedCurrentRun = false;
    buildDeck();
    stopConfetti();
    hideFeedbackBanner();

    document.getElementById("reigns-gameover-modal").classList.add("hidden");
    document.getElementById("reigns-victory-modal").classList.add("hidden");
    document.getElementById("game-play-area").classList.remove("hidden");

    updateHUDStats();
    updatePlayerBadges();
    renderCard();
  }

  // ================= LEADERBOARD RENDERING =================
  function renderLeaderboardTable(queryText = "") {
    const tbody = document.getElementById("leaderboard-tbody");
    const countEl = document.getElementById("leaderboard-total-count");
    const statusBadge = document.getElementById("leaderboard-status-badge");
    if (!tbody) return;

    const all = latestLeaderboard.allEntries || [];
    if (countEl) countEl.textContent = `${all.length} sinh viên`;
    if (statusBadge) {
      statusBadge.textContent =
        latestLeaderboard.mode === "online" ? "Online Firebase" : "Offline Cache";
      statusBadge.className =
        latestLeaderboard.mode === "online"
          ? "px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200"
          : "px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200";
    }

    const q = String(queryText || "").trim().toLowerCase();
    const filtered = all
      .map((entry, idx) => ({ entry, rank: idx + 1 }))
      .filter(({ entry }) => {
        if (!q) return true;
        return (
          entry.name.toLowerCase().includes(q) || entry.mssv.includes(q)
        );
      });

    if (!filtered.length) {
      tbody.innerHTML = `<tr><td colspan="6" class="py-8 text-center text-sm text-slate-500">${
        q ? "Không tìm thấy sinh viên phù hợp." : "Chưa có dữ liệu xếp hạng."
      }</td></tr>`;
      return;
    }

    const myMssv = activePlayer ? activePlayer.mssv : "";
    tbody.innerHTML = filtered
      .map(({ entry, rank }) => {
        const isMe = entry.mssv === myMssv;
        const rowClass = isMe
          ? "bg-[#fff7ed] font-semibold text-slate-900"
          : "hover:bg-slate-50 text-slate-700";
        const rankBadge =
          rank <= 3
            ? `<span class="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-extrabold ${
                rank === 1
                  ? "bg-amber-400 text-amber-950"
                  : rank === 2
                    ? "bg-slate-300 text-slate-800"
                    : "bg-orange-300 text-orange-950"
              }">${rank}</span>`
            : `<span class="font-mono text-xs font-bold text-slate-500">#${rank}</span>`;
        const statusTag = entry.isVictory
          ? '<span class="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">10 năm</span>'
          : `<span class="px-2 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600 border border-slate-200">${entry.years}/10 năm</span>`;

        return `<tr class="border-b border-slate-100 ${rowClass}">
          <td class="py-2.5 px-3 text-center">${rankBadge}</td>
          <td class="py-2.5 px-3">${escapeHtml(entry.name)}${
            isMe
              ? ' <span class="ml-1 px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-[#df7a28] text-white">Bạn</span>'
              : ""
          }</td>
          <td class="py-2.5 px-3 font-mono text-xs">${escapeHtml(entry.mssv)}</td>
          <td class="py-2.5 px-3 text-right font-extrabold text-[#c4661b]">${entry.score}</td>
          <td class="py-2.5 px-3 text-center text-xs font-mono">${Math.min(entry.plays, 5)}/5</td>
          <td class="py-2.5 px-3 text-center">${statusTag}</td>
        </tr>`;
      })
      .join("");
  }

  async function refreshLeaderboard() {
    if (!client) return;
    latestLeaderboard = await client.fetchLeaderboard();
    const searchInput = document.getElementById("leaderboard-search");
    renderLeaderboardTable(searchInput ? searchInput.value : "");
  }

  // ================= TAB NAVIGATION =================
  function switchTab(tabName) {
    currentTab = tabName;
    const tabs = document.querySelectorAll('[role="tab"][data-tab]');
    const panels = document.querySelectorAll('[role="tabpanel"][data-panel]');

    tabs.forEach((tab) => {
      const selected = tab.dataset.tab === tabName;
      tab.setAttribute("aria-selected", selected ? "true" : "false");
      tab.toggleAttribute("focusgroupstart", selected);
    });

    panels.forEach((panel) => {
      const active = panel.dataset.panel === tabName;
      if (active) {
        panel.removeAttribute("hidden");
        panel.setAttribute("tabindex", "0");
      } else {
        panel.setAttribute("hidden", "");
        panel.removeAttribute("tabindex");
      }
    });

    if (tabName === "leaderboard") {
      refreshLeaderboard();
    }
  }

  // ================= LOGIN GATE & LOGOUT =================
  function showLoginGate() {
    const gate = document.getElementById("login-gate");
    const shell = document.getElementById("app-shell");
    if (gate) gate.classList.remove("hidden");
    if (shell) {
      shell.classList.add("hidden");
      shell.setAttribute("inert", "");
    }
    const nameInput = document.getElementById("login-name");
    if (nameInput) nameInput.focus();
  }

  function showAppShell() {
    const gate = document.getElementById("login-gate");
    const shell = document.getElementById("app-shell");
    if (gate) gate.classList.add("hidden");
    if (shell) {
      shell.classList.remove("hidden");
      shell.removeAttribute("inert");
    }
  }

  async function completeLogin(player, syncNameToDb = true) {
    activePlayer = player;
    client.savePlayer(player);
    updatePlayerBadges();
    showAppShell();
    switchTab("play");
    resetGame();

    const rec = await client.fetchPlayerRecord(player.mssv);
    if (rec.entry) {
      playerPlaysUsed = rec.entry.plays;
      playerBestScore = rec.entry.score;
      if (syncNameToDb && rec.entry.name !== player.name) {
        await client.updatePlayerDisplayName(player.mssv, player.name);
      }
    } else {
      playerPlaysUsed = 0;
      playerBestScore = null;
    }
    updatePlayerBadges();
    refreshLeaderboard();
  }

  function setupCardDragAndKeyboard() {
    const card = document.getElementById("reigns-card");
    if (!card) return;
    let startX = 0;
    let currentX = 0;
    let isDragging = false;

    const pillLeft = document.getElementById("choice-pill-left");
    const pillRight = document.getElementById("choice-pill-right");

    card.addEventListener("pointerdown", (e) => {
      if (!activePlayer || isGameOver) return;
      isDragging = true;
      startX = e.clientX;
      currentX = 0;
      card.classList.add("swiping");
      card.setPointerCapture(e.pointerId);
    });

    card.addEventListener("pointermove", (e) => {
      if (!isDragging) return;
      currentX = e.clientX - startX;
      const rot = Math.max(-12, Math.min(12, currentX * 0.05));
      card.style.transform = `translate(${currentX}px, 0px) rotate(${rot}deg)`;

      const ratio = Math.min(1, Math.abs(currentX) / 80);
      if (currentX < -15) {
        pillLeft.style.opacity = String(ratio);
        pillRight.style.opacity = "0";
        showStatDots(deck[currentCardIndex]?.left?.effects);
      } else if (currentX > 15) {
        pillRight.style.opacity = String(ratio);
        pillLeft.style.opacity = "0";
        showStatDots(deck[currentCardIndex]?.right?.effects);
      } else {
        pillLeft.style.opacity = "0";
        pillRight.style.opacity = "0";
        clearStatDots();
      }
    });

    const endDrag = () => {
      if (!isDragging) return;
      isDragging = false;
      card.classList.remove("swiping");
      if (currentX < -85) {
        applyChoice("left");
      } else if (currentX > 85) {
        applyChoice("right");
      } else {
        card.classList.add("reset-anim");
        card.style.transform = "translate(0px, 0px) rotate(0deg)";
        pillLeft.style.opacity = "0";
        pillRight.style.opacity = "0";
        clearStatDots();
        setTimeout(() => card.classList.remove("reset-anim"), 250);
      }
    };

    card.addEventListener("pointerup", endDrag);
    card.addEventListener("pointercancel", endDrag);
  }

  function init() {
    if (typeof document === "undefined") return;
    client = createLeaderboardClient();

    // Tab clicks & keyboard navigation
    const tabButtons = Array.from(document.querySelectorAll('[role="tab"][data-tab]'));
    tabButtons.forEach((btn, idx) => {
      btn.addEventListener("click", () => switchTab(btn.dataset.tab));
      btn.addEventListener("keydown", (e) => {
        if (e.key === "ArrowRight") {
          const next = tabButtons[(idx + 1) % tabButtons.length];
          next.focus();
          switchTab(next.dataset.tab);
        } else if (e.key === "ArrowLeft") {
          const prev = tabButtons[(idx - 1 + tabButtons.length) % tabButtons.length];
          prev.focus();
          switchTab(prev.dataset.tab);
        }
      });
    });

    // Login form
    const loginForm = document.getElementById("login-form");
    const nameInput = document.getElementById("login-name");
    const mssvInput = document.getElementById("login-mssv");
    const nameErr = document.getElementById("login-name-error");
    const mssvErr = document.getElementById("login-mssv-error");
    const loginSubmitBtn = document.getElementById("btn-login-submit");

    if (mssvInput) {
      mssvInput.addEventListener("input", () => {
        const cleaned = sanitizeMssvInput(mssvInput.value);
        if (mssvInput.value !== cleaned) mssvInput.value = cleaned;
        mssvInput.removeAttribute("aria-invalid");
        if (mssvErr) mssvErr.textContent = "";
      });
    }
    if (nameInput) {
      nameInput.addEventListener("input", () => {
        nameInput.removeAttribute("aria-invalid");
        if (nameErr) nameErr.textContent = "";
      });
    }

    if (loginForm) {
      loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const check = validatePlayerIdentity(
          nameInput ? nameInput.value : "",
          mssvInput ? mssvInput.value : "",
        );
        if (nameErr) nameErr.textContent = check.errors.name;
        if (mssvErr) mssvErr.textContent = check.errors.mssv;

        if (!check.valid) {
          if (check.errors.name && nameInput) {
            nameInput.setAttribute("aria-invalid", "true");
            nameInput.focus();
          } else if (check.errors.mssv && mssvInput) {
            mssvInput.setAttribute("aria-invalid", "true");
            mssvInput.focus();
          }
          return;
        }

        if (loginSubmitBtn) {
          loginSubmitBtn.disabled = true;
          loginSubmitBtn.textContent = "Đang đồng bộ tài khoản...";
        }
        try {
          await completeLogin({ name: check.name, mssv: check.mssv }, true);
        } finally {
          if (loginSubmitBtn) {
            loginSubmitBtn.disabled = false;
            loginSubmitBtn.textContent = "Đăng nhập & Vào Game";
          }
        }
      });
    }

    // Gameplay buttons
    const leftBtn = document.getElementById("btn-reigns-left");
    const rightBtn = document.getElementById("btn-reigns-right");
    if (leftBtn) leftBtn.addEventListener("click", () => applyChoice("left"));
    if (rightBtn) rightBtn.addEventListener("click", () => applyChoice("right"));

    const resetBtn = document.getElementById("btn-reigns-reset");
    const retryBtn = document.getElementById("btn-reigns-retry");
    const winRestartBtn = document.getElementById("btn-reigns-win-restart");
    if (resetBtn) resetBtn.addEventListener("click", resetGame);
    if (retryBtn) retryBtn.addEventListener("click", resetGame);
    if (winRestartBtn) winRestartBtn.addEventListener("click", resetGame);

    document.querySelectorAll("[data-goto-tab]").forEach((btn) => {
      btn.addEventListener("click", () => switchTab(btn.dataset.gotoTab));
    });

    const soundBtn = document.getElementById("btn-sound-toggle");
    if (soundBtn) {
      soundBtn.addEventListener("click", () => {
        isMuted = !isMuted;
        soundBtn.setAttribute("aria-pressed", String(isMuted));
        soundBtn.textContent = isMuted ? "🔇 Tắt tiếng" : "🔊 Âm thanh";
      });
    }

    // Leaderboard search & refresh
    const searchInput = document.getElementById("leaderboard-search");
    const refreshBtn = document.getElementById("btn-leaderboard-refresh");
    if (searchInput) {
      searchInput.addEventListener("input", () =>
        renderLeaderboardTable(searchInput.value),
      );
    }
    if (refreshBtn) {
      refreshBtn.addEventListener("click", refreshLeaderboard);
    }

    // Person-icon Logout & Native <dialog> confirmation
    const logoutBtn = document.getElementById("btn-logout");
    const logoutDialog = document.getElementById("logout-confirm-dialog");
    const logoutMssvSpan = document.getElementById("logout-dialog-mssv");
    const logoutConfirmBtn = document.getElementById("btn-logout-confirm");
    const logoutCancelBtn = document.getElementById("btn-logout-cancel");

    if (logoutBtn && logoutDialog) {
      logoutBtn.addEventListener("click", () => {
        if (!activePlayer) return;
        if (logoutMssvSpan) logoutMssvSpan.textContent = activePlayer.mssv;
        logoutDialog.returnValue = "";
        logoutDialog.showModal();
      });
    }
    if (logoutCancelBtn && logoutDialog) {
      logoutCancelBtn.addEventListener("click", () => logoutDialog.close("cancel"));
    }
    if (logoutConfirmBtn && logoutDialog) {
      logoutConfirmBtn.addEventListener("click", async () => {
        if (!activePlayer) {
          logoutDialog.close();
          return;
        }
        const mssvToDelete = activePlayer.mssv;
        logoutConfirmBtn.disabled = true;
        logoutConfirmBtn.textContent = "Đang xóa dữ liệu...";
        try {
          await client.deletePlayerRecord(mssvToDelete);
          activePlayer = null;
          playerPlaysUsed = 0;
          playerBestScore = null;
          latestLeaderboard.allEntries = latestLeaderboard.allEntries.filter(
            (e) => e.mssv !== mssvToDelete,
          );
          if (nameInput) nameInput.value = "";
          if (mssvInput) mssvInput.value = "";
          logoutDialog.close("confirm");
          showLoginGate();
        } finally {
          logoutConfirmBtn.disabled = false;
          logoutConfirmBtn.textContent = "Xác nhận đăng xuất & Xóa dữ liệu";
        }
      });
    }

    setupCardDragAndKeyboard();
    setupQrModal();
    setupGlobalShortcuts();

    // Auto-restore session if saved
    const saved = client.loadSavedPlayer();
    if (saved) {
      completeLogin(saved, false);
    } else {
      showLoginGate();
    }
  }

  function resolveGameQrUrl(loc) {
    const source =
      loc || (typeof window !== "undefined" ? window.location : null);
    if (!source || !source.origin) return "";
    return `${source.origin}${source.pathname || "/"}`;
  }

  function resolveKeyboardShortcutAction(eventLike, context) {
    if (!eventLike || !context) return null;
    if (!context.isLoggedIn || context.currentTab !== "play") return null;
    if (context.hasOpenDialog || context.isTypingTarget) return null;

    if (!context.isGameOver) {
      if (eventLike.key === "ArrowLeft") return "choose_left";
      if (eventLike.key === "ArrowRight") return "choose_right";
      return null;
    }

    if (eventLike.code === "Space" || eventLike.key === " ") {
      return "restart_term";
    }
    return null;
  }

  function isTextInputElement(el) {
    if (!el || typeof el.tagName !== "string") return false;
    const tag = el.tagName.toUpperCase();
    return (
      tag === "INPUT" ||
      tag === "TEXTAREA" ||
      tag === "SELECT" ||
      Boolean(el.isContentEditable)
    );
  }

  function setupGlobalShortcuts() {
    document.addEventListener("keydown", (e) => {
      const action = resolveKeyboardShortcutAction(e, {
        isLoggedIn: Boolean(activePlayer),
        currentTab,
        hasOpenDialog: Boolean(document.querySelector("dialog[open]")),
        isTypingTarget: isTextInputElement(document.activeElement),
        isGameOver,
      });

      if (!action) return;
      if (action === "choose_left") {
        e.preventDefault();
        applyChoice("left");
      } else if (action === "choose_right") {
        e.preventDefault();
        applyChoice("right");
      } else if (action === "restart_term") {
        e.preventDefault();
        resetGame();
      }
    });
  }

  function setupQrModal() {
    const qrModal = document.getElementById("qr-modal");
    const qrContainer = document.getElementById("qr-code-container");
    const qrUrlLink = document.getElementById("qr-target-url-link");
    const btnCloseQr = document.getElementById("btn-close-qr-modal");
    const btnCopyQr = document.getElementById("btn-copy-qr-url");
    const qrTriggers = [
      document.getElementById("btn-qr-modal"),
      document.getElementById("btn-login-qr"),
    ].filter(Boolean);

    if (!qrModal) return;
    let qrRendered = false;
    let activeTrigger = null;

    function getTargetUrl() {
      return (
        resolveGameQrUrl() ||
        "https://allendq1-lmq.github.io/KTCT_MacLenin_WebThuyetTrinh_Grp8/game/"
      );
    }

    function renderQrIfNeeded() {
      const targetUrl = getTargetUrl();
      if (qrUrlLink) {
        qrUrlLink.href = targetUrl;
        qrUrlLink.textContent = targetUrl;
      }
      if (qrContainer) {
        qrContainer.setAttribute("aria-label", `Mã QR dẫn tới ${targetUrl}`);
      }
      if (qrRendered || !qrContainer || typeof QRCode === "undefined") return;
      qrContainer.innerHTML = "";
      new QRCode(qrContainer, {
        text: targetUrl,
        width: 600,
        height: 600,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H,
      });
      qrRendered = true;
    }

    function openQr(triggerEl) {
      activeTrigger = triggerEl || null;
      renderQrIfNeeded();
      if (activeTrigger) activeTrigger.setAttribute("aria-expanded", "true");
      qrModal.returnValue = "";
      qrModal.showModal();
    }

    qrTriggers.forEach((btn) => {
      btn.addEventListener("click", () => openQr(btn));
    });

    if (btnCloseQr) {
      btnCloseQr.addEventListener("click", () => qrModal.close("close"));
    }

    qrModal.addEventListener("close", () => {
      qrModal.returnValue = "";
      qrTriggers.forEach((btn) => btn.setAttribute("aria-expanded", "false"));
      if (activeTrigger) activeTrigger.focus();
    });

    // Light-dismiss fallback for browsers without <dialog closedby="any">
    if (!("closedBy" in HTMLDialogElement.prototype)) {
      let pressedOutside = false;
      const isOutside = (e) => {
        const r = qrModal.getBoundingClientRect();
        return (
          e.clientX < r.left ||
          e.clientX > r.right ||
          e.clientY < r.top ||
          e.clientY > r.bottom
        );
      };
      qrModal.addEventListener("pointerdown", (e) => {
        pressedOutside = isOutside(e);
      });
      qrModal.addEventListener("pointerup", (e) => {
        if (pressedOutside && isOutside(e)) qrModal.close("backdrop");
      });
    }

    if (btnCopyQr) {
      btnCopyQr.addEventListener("click", async () => {
        const url = getTargetUrl();
        try {
          if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(url);
          } else {
            const tmp = document.createElement("textarea");
            tmp.value = url;
            tmp.setAttribute("readonly", "");
            tmp.style.position = "fixed";
            tmp.style.opacity = "0";
            document.body.appendChild(tmp);
            tmp.select();
            document.execCommand("copy");
            document.body.removeChild(tmp);
          }
          const orig = btnCopyQr.textContent;
          btnCopyQr.textContent = "✓ Đã sao chép liên kết!";
          setTimeout(() => {
            btnCopyQr.textContent = orig;
          }, 2000);
        } catch (_) {}
      });
    }
  }

  if (typeof document !== "undefined") {
    document.addEventListener("DOMContentLoaded", init);
  }

  return {
    init,
    resetGame,
    switchTab,
    getDeckCount: () => reignsDeck.length,
    _core: {
      sanitizePlayerName,
      sanitizeMssvInput,
      validatePlayerIdentity,
      escapeHtml,
      buildLeaderboardUrls,
      calculateGameScore,
      normalizeLeaderboardEntry,
      sortLeaderboardEntries,
      mergeLeaderboardSubmission,
      createLeaderboardClient,
      resolveGameQrUrl,
      resolveKeyboardShortcutAction,
    },
  };
})();

if (typeof window !== "undefined") {
  window.StandaloneReignsGame = StandaloneReignsGame;
}
if (typeof module !== "undefined" && module.exports) {
  module.exports = StandaloneReignsGame;
}
