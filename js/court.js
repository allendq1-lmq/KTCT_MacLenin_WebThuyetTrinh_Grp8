// js/court.js - Logic Tòa Án Lý Luận
window.CourtModule = (() => {
  const dossierDetails = {
    A: {
      title: "Hồ Sơ A: Quan Hệ Sở Hữu",
      content:
        "Việc thừa nhận đa dạng sở hữu giải phóng sức sản xuất của toàn xã hội. Kinh tế Nhà nước nắm giữ huyết mạch giữ vai trò chủ đạo, làm công cụ vật chất để định hướng và điều tiết nền kinh tế vì lợi ích toàn dân, triệt tiêu sự lũng đoạn của tài phiệt.",
    },
    B: {
      title: "Hồ Sơ B: Quan Hệ Phân Phối",
      content:
        "Phân phối theo kết quả lao động và hiệu quả kinh tế giúp khắc phục triệt để căn bệnh cào bằng bao cấp cũ; đồng thời phân phối qua hệ thống an sinh xã hội giúp hạn chế tình trạng tích tụ tài sản quá mức dẫn đến bất công cùng cực của mô hình tư bản.",
    },
    C: {
      title: "Hồ Sơ C: Mục Tiêu Xã Hội",
      content:
        "Khác biệt căn bản với CNTB: Tiến bộ và công bằng xã hội không phải là thứ để chờ nền kinh tế phát triển cao rồi mới ban phát từ thiện; mà được tích hợp, giải quyết ngay trong từng chủ trương, chính sách phát triển quốc gia.",
    },
  };

  function init() {
    const dossierButtons = document.querySelectorAll(".court-dossier-btn");
    const dossierSummary = document.getElementById("dossier-summary");
    const btnStamp = document.getElementById("btn-stamp-verdict");

    dossierButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        dossierButtons.forEach((b) => {
          b.classList.remove(
            "active",
            "border-amber-300",
            "bg-amber-50/70",
            "text-slate-900",
          );
          b.classList.add("border-slate-200", "bg-slate-50", "text-slate-700");
        });
        btn.classList.add(
          "active",
          "border-amber-300",
          "bg-amber-50/70",
          "text-slate-900",
        );
        btn.classList.remove(
          "border-slate-200",
          "bg-slate-50",
          "text-slate-700",
        );

        const d = btn.getAttribute("data-dossier");
        const info = dossierDetails[d];
        if (info && dossierSummary) {
          dossierSummary.innerHTML = `<span class="font-bold text-slate-900 block mb-1">Thẩm tra ${info.title}:</span>${info.content}`;
        }
      });
    });

    if (btnStamp) {
      btnStamp.addEventListener("click", () => {
        btnStamp.textContent = "ĐÃ XÁC NHẬN: KTTT ĐHXHCN LÀ TẤT YẾU KHÁCH QUAN";
        btnStamp.classList.remove("bg-amber-500", "hover:bg-amber-600");
        btnStamp.classList.add("bg-emerald-600", "hover:bg-emerald-700");
      });
    }
  }

  return { init };
})();
