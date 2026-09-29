import React, { useState } from 'react';
import { BookOpen, Copy, Check, Download, ZoomIn, ZoomOut, Bookmark, FileText } from 'lucide-react';
import { soundFx } from '@/lib/audio-effects';
import { ViewerBorderFlourish } from './section-filigree';

export function FullResearchViewer() {
  const [fontSize, setFontSize] = useState<'normal' | 'large'>('normal');
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'modau' | 'chuong1' | 'chuong2' | 'chuong3' | 'chuong4' | 'ketluan'>('all');

  const handleTabChange = (tab: 'all' | 'modau' | 'chuong1' | 'chuong2' | 'chuong3' | 'chuong4' | 'ketluan') => {
    soundFx.playTap();
    setActiveTab(tab);
  };

  const handleToggleFontSize = () => {
    soundFx.playTap();
    setFontSize(fontSize === 'normal' ? 'large' : 'normal');
  };

  const handleCopyCitation = () => {
    soundFx.playChime();
    const citation = `Nhóm Nghiên cứu Luật Chứng khoán (2026), "Bảo vệ quyền lợi nhà đầu tư cá nhân trên thị trường chứng khoán Việt Nam", Đề tài Nghiên cứu Khoa học, Khoa Luật - Học viện Ngân hàng.`;
    navigator.clipboard.writeText(citation);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="toan-van" className="py-20 bg-[#FAF8F5] border-b border-orange-100">
      <div className="site-shell">
        {/* Section Header */}
        <div className="max-w-3xl mb-8">
          <span className="eyebrow">
            <BookOpen className="w-4 h-4 text-orange-600" />
            Toàn Văn Đề Cương &amp; Báo Cáo Nghiên Cứu
          </span>
          <h2 className="section-title">
            Văn Bản Nghiên Cứu ~25 Trang Chuẩn Học Thuật
          </h2>
          <p className="section-subtitle">
            Hệ thống hóa đầy đủ đề cương chi tiết từ tài liệu nghiên cứu gốc của Khoa Luật - Học viện Ngân hàng theo cấu trúc chuẩn mực của một bài báo khoa học pháp lý.
          </p>
        </div>

        {/* Section Filigree Frame Ornament */}
        <div className="mb-4">
          <ViewerBorderFlourish />
        </div>

        {/* Toolbar */}
        <div className="bg-white border border-orange-200 rounded-2xl p-4 mb-8 shadow-sm flex flex-wrap items-center justify-between gap-4">
          {/* Chapter navigation */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => handleTabChange('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'all'
                  ? 'bg-orange-600 text-white'
                  : 'text-slate-700 hover:bg-orange-50'
              }`}
            >
              Toàn Bộ Đề Tài
            </button>
            <button
              onClick={() => handleTabChange('modau')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'modau'
                  ? 'bg-orange-600 text-white'
                  : 'text-slate-700 hover:bg-orange-50'
              }`}
            >
              Mở Đầu
            </button>
            <button
              onClick={() => handleTabChange('chuong1')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'chuong1'
                  ? 'bg-orange-600 text-white'
                  : 'text-slate-700 hover:bg-orange-50'
              }`}
            >
              Phần 1: Khái Quát
            </button>
            <button
              onClick={() => handleTabChange('chuong2')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'chuong2'
                  ? 'bg-orange-600 text-white'
                  : 'text-slate-700 hover:bg-orange-50'
              }`}
            >
              Phần 2: Thực Trạng
            </button>
            <button
              onClick={() => handleTabChange('chuong3')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'chuong3'
                  ? 'bg-orange-600 text-white'
                  : 'text-slate-700 hover:bg-orange-50'
              }`}
            >
              Phần 3: Bất Cập
            </button>
            <button
              onClick={() => handleTabChange('chuong4')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'chuong4'
                  ? 'bg-orange-600 text-white'
                  : 'text-slate-700 hover:bg-orange-50'
              }`}
            >
              Phần 4: Kiến Nghị
            </button>
            <button
              onClick={() => handleTabChange('ketluan')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'ketluan'
                  ? 'bg-orange-600 text-white'
                  : 'text-slate-700 hover:bg-orange-50'
              }`}
            >
              Phần 5: Kết Luận
            </button>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleFontSize}
              className="px-3 py-1.5 rounded-lg border border-orange-200 text-xs font-medium text-slate-700 hover:bg-orange-50 flex items-center gap-1.5 cursor-pointer"
              title="Thay đổi cỡ chữ đọc"
            >
              {fontSize === 'normal' ? <ZoomIn className="w-3.5 h-3.5" /> : <ZoomOut className="w-3.5 h-3.5" />}
              <span>{fontSize === 'normal' ? 'Cỡ chữ lớn' : 'Cỡ chuẩn'}</span>
            </button>
            <button
              onClick={handleCopyCitation}
              className="px-3 py-1.5 rounded-lg border border-orange-200 text-xs font-medium text-slate-700 hover:bg-orange-50 flex items-center gap-1.5"
              title="Sao chép trích dẫn học thuật"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5 text-orange-600" />}
              <span>{copied ? 'Đã sao chép' : 'Trích dẫn'}</span>
            </button>
          </div>
        </div>

        {/* Paper Container - Academic White Paper Style */}
        <article
          className={`bg-white border border-orange-200/90 rounded-2xl p-8 md:p-14 shadow-lg mx-auto transition-all ${
            fontSize === 'large' ? 'text-base md:text-lg leading-relaxed' : 'text-sm md:text-base leading-relaxed'
          }`}
          style={{ maxWidth: '980px' }}
        >
          {/* Header Title inside Document */}
          <div className="text-center pb-10 mb-10 border-b border-orange-100">
            <span className="text-xs uppercase tracking-widest text-orange-700 font-bold block mb-2">
              HỌC VIỆN NGÂN HÀNG • KHOA LUẬT
            </span>
            <h1 className="font-serif font-bold text-2xl md:text-3xl text-slate-900 leading-snug max-w-2xl mx-auto">
              BẢO VỆ QUYỀN LỢI NHÀ ĐẦU TƯ CÁ NHÂN TRÊN THỊ TRƯỜNG CHỨNG KHOÁN VIỆT NAM
            </h1>
            <p className="text-xs text-slate-500 mt-3 italic font-serif">
              Tập thể tác giả Nhóm 13: Quân, Hiền, Trường, Khuê, Minh, Hoài • Thời lượng ước tính: ~25 trang
            </p>
          </div>

          {/* PHẦN MỞ ĐẦU */}
          {(activeTab === 'all' || activeTab === 'modau') && (
            <section className="mb-12">
              <div className="flex items-center gap-2 text-orange-700 font-bold text-xs uppercase tracking-wider mb-2">
                <Bookmark className="w-4 h-4" />
                <span>Người 1 phụ trách (2–3 trang) • Hạn nộp: 22/9</span>
              </div>
              <h2 className="font-serif font-bold text-xl md:text-2xl text-slate-900 mb-6 pb-2 border-b border-orange-200">
                PHẦN MỞ ĐẦU
              </h2>

              <div className="space-y-6 text-slate-800">
                <div>
                  <h3 className="font-serif font-bold text-lg text-orange-950 mb-2">1. Lý do chọn đề tài</h3>
                  <p className="mb-2">
                    Thị trường chứng khoán Việt Nam qua hơn hai thập kỷ hình thành và phát triển đã khẳng định vai trò là kênh huy động vốn trung và dài hạn quan trọng bậc nhất của nền kinh tế. Đặc biệt, những năm gần đây chứng kiến làn sóng tham gia bùng nổ của tầng lớp nhà đầu tư cá nhân, chiếm trên 90% số lượng tài khoản và chi phối phần lớn giá trị giao dịch toàn thị trường.
                  </p>
                  <p className="mb-2">
                    Tuy nhiên, nhà đầu tư cá nhân lại luôn là đối tượng chịu nhiều tổn thương nhất do sự bất cân xứng thông tin gay gắt, hạn chế về năng lực tài chính, thiếu hụt kiến thức pháp lý và không có bộ máy chuyên môn hỗ trợ như các định chế đầu tư chuyên nghiệp.
                  </p>
                  <p>
                    Thực tiễn giai đoạn 2020 – 2026 cho thấy nhiều vụ vi phạm nghiêm trọng (thao túng giá cổ phiếu, gian lận công bố thông tin, lừa đảo phát hành trái phiếu) đã gây thiệt hại khôn lường về tài sản, làm suy giảm niềm tin công chúng, đặt ra yêu cầu cấp thiết phải hoàn thiện khung khổ pháp lý và nâng cao hiệu quả bảo vệ nhà đầu tư cá nhân.
                  </p>
                </div>

                <div>
                  <h3 className="font-serif font-bold text-lg text-orange-950 mb-2">2. Mục tiêu nghiên cứu</h3>
                  <ul className="list-disc pl-5 space-y-1.5 text-slate-700">
                    <li>Làm rõ khung pháp lý hiện hành về bảo vệ quyền lợi nhà đầu tư cá nhân trên TTCK Việt Nam.</li>
                    <li>Phân tích sâu sắc những bất cập, hạn chế và khoảng trống nổi bật tồn tại trong thực tiễn thực thi pháp luật.</li>
                    <li>Đề xuất hệ thống giải pháp, kiến nghị hoàn thiện thể chế và nâng cao năng lực giám sát bảo vệ nhà đầu tư nhỏ lẻ.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-serif font-bold text-lg text-orange-950 mb-2">3. Đối tượng và phạm vi nghiên cứu</h3>
                  <p>
                    <strong>Đối tượng:</strong> Toàn bộ các quy phạm pháp luật chứng khoán điều chỉnh việc bảo vệ quyền và lợi ích hợp pháp của nhà đầu tư cá nhân cùng thực tiễn áp dụng của cơ quan quản lý và tòa án.
                  </p>
                  <p className="mt-1">
                    <strong>Phạm vi:</strong> Luật Chứng khoán 2019, Luật sửa đổi 2024 và các văn bản quy định chi tiết; trọng tâm khảo sát giai đoạn 2020 – 2026.
                  </p>
                </div>

                <div>
                  <h3 className="font-serif font-bold text-lg text-orange-950 mb-2">4. Phương pháp nghiên cứu</h3>
                  <p>
                    Đề tài áp dụng phương pháp nghiên cứu định tính kết hợp phân tích quy phạm pháp luật, tổng hợp - so sánh đối chiếu với chuẩn mực quốc tế (IOSCO, Hoa Kỳ) và phương pháp nghiên cứu tình huống điển hình (Case study) từ các đại án thực tế.
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* PHẦN 1: KHÁI QUÁT CHUNG */}
          {(activeTab === 'all' || activeTab === 'chuong1') && (
            <section className="mb-12">
              <div className="flex items-center gap-2 text-orange-700 font-bold text-xs uppercase tracking-wider mb-2">
                <Bookmark className="w-4 h-4" />
                <span>Người 1 phụ trách (khoảng 4 trang)</span>
              </div>
              <h2 className="font-serif font-bold text-xl md:text-2xl text-slate-900 mb-6 pb-2 border-b border-orange-200">
                1. KHÁI QUÁT CHUNG VỀ NHÀ ĐẦU TƯ CÁ NHÂN VÀ PHÁP LUẬT BẢO VỆ NHÀ ĐẦU TƯ CÁ NHÂN
              </h2>

              <div className="space-y-6 text-slate-800">
                <div>
                  <h3 className="font-serif font-bold text-lg text-orange-950 mb-2">1.1. Khái niệm nhà đầu tư cá nhân trên thị trường chứng khoán</h3>
                  <p className="mb-2">
                    Theo Luật Chứng khoán 2019, nhà đầu tư là tổ chức, cá nhân Việt Nam và nước ngoài tham gia đầu tư trên thị trường chứng khoán. Khác với nhà đầu tư tổ chức (quỹ đầu tư, công ty bảo hiểm, ngân hàng thương mại), nhà đầu tư cá nhân là các cá nhân bỏ vốn nhàn rỗi để mua bán, sở hữu chứng khoán.
                  </p>
                  <p>
                    Đặc điểm pháp lý then chốt của nhà đầu tư cá nhân là tính phân tán, quy mô vốn nhỏ lẻ, năng lực tiếp cận và giải mã báo cáo tài chính hạn chế, dễ bị tác động bởi tâm lý đám đông và bất lợi tuyệt đối trước các nhóm cổ đông nội bộ nắm quyền chi phối.
                  </p>
                </div>

                <div>
                  <h3 className="font-serif font-bold text-lg text-orange-950 mb-2">1.2. Sự cần thiết bảo vệ quyền lợi nhà đầu tư cá nhân</h3>
                  <p className="mb-2">
                    Nhà đầu tư cá nhân là chủ thể cung cấp dòng thanh khoản huyết mạch quyết định sự tồn tại và phát triển của thị trường chứng khoán. Khi quyền lợi của nhà đầu tư nhỏ lẻ không được bảo đảm, dòng vốn xã hội sẽ rút khỏi kênh chứng khoán, làm tê liệt chức năng dẫn vốn của thị trường tài chính.
                  </p>
                  <p>
                    Nguyên tắc công bằng, công khai, minh bạch đòi hỏi pháp luật phải đóng vai trò là "chiếc van an toàn", cân bằng lại thế yếu bẩm sinh của nhà đầu tư cá nhân trước các tổ chức phát hành và các công ty chứng khoán.
                  </p>
                </div>

                <div>
                  <h3 className="font-serif font-bold text-lg text-orange-950 mb-2">1.3. Khung pháp lý hiện hành</h3>
                  <p>
                    Hệ thống pháp luật bao gồm Luật Chứng khoán 2019 (Luật số 54/2019/QH14), Luật sửa đổi bổ sung số 56/2024/QH15, Nghị định 155/2020/NĐ-CP, Nghị định 245/2025/NĐ-CP, Thông tư 120/2020, Thông tư 96/2020, Thông tư 68/2024 (chuẩn công bố song ngữ) và Thông tư 08/2026/TT-BTC.
                  </p>
                </div>

                <div>
                  <h3 className="font-serif font-bold text-lg text-orange-950 mb-2">1.4. Các nguyên tắc pháp lý cốt lõi</h3>
                  <p>
                    (1) Tôn trọng quyền sở hữu và tự do giao dịch đầu tư; (2) Nguyên tắc công bằng, công khai, minh bạch; (3) Nguyên tắc bảo vệ quyền và lợi ích hợp pháp của mọi thành viên tham gia thị trường.
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* PHẦN 2: THỰC TRẠNG ÁP DỤNG PHÁP LUẬT */}
          {(activeTab === 'all' || activeTab === 'chuong2') && (
            <section className="mb-12">
              <div className="flex items-center gap-2 text-orange-700 font-bold text-xs uppercase tracking-wider mb-2">
                <Bookmark className="w-4 h-4" />
                <span>Người 2 &amp; Người 3 phụ trách (khoảng 12 trang)</span>
              </div>
              <h2 className="font-serif font-bold text-xl md:text-2xl text-slate-900 mb-6 pb-2 border-b border-orange-200">
                2. THỰC TRẠNG ÁP DỤNG PHÁP LUẬT VỀ BẢO VỆ QUYỀN LỢI NHÀ ĐẦU TƯ CÁ NHÂN
              </h2>

              <div className="space-y-6 text-slate-800">
                <div className="p-4 rounded-xl bg-orange-50/50 border border-orange-200">
                  <h3 className="font-serif font-bold text-lg text-orange-950 mb-2">2.1. Bảo vệ qua quy định công bố thông tin (Người 2 - ~4-5 trang)</h3>
                  <p className="mb-2">
                    Nghĩa vụ công bố thông tin định kỳ (BCTC kiểm toán, Báo cáo thường niên, Quản trị công ty) và bất thường (trong vòng 24h khi có biến động trọng yếu) theo Thông tư 96/2020 và Thông tư 68/2024 (song ngữ Anh - Việt).
                  </p>
                  <p className="mb-2">
                    <strong>Thực tiễn vi phạm:</strong> Diễn biến tràn lan việc chậm trễ hoặc che giấu thông tin. Điển hình: Công ty CP Mua bán nợ Thuận Minh chậm công bố tài liệu trên 10 ngày làm việc (phạt 92,5 triệu đồng); Đất Xanh Miền Bắc không công bố BCTC năm 2024...
                  </p>
                  <p>
                    <strong>Bất cập:</strong> Chế tài xử phạt hành chính quá thấp so với lợi ích thu được từ việc bưng bít thông tin; thiếu quy định xử lý trách nhiệm của đơn vị tư vấn và kiểm toán.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-orange-50/50 border border-orange-200">
                  <h3 className="font-serif font-bold text-lg text-orange-950 mb-2">2.2. Bảo vệ qua quản trị công ty đại chúng (Người 2 - ~2 trang)</h3>
                  <p>
                    Quy định về cổ đông lớn, giao dịch với bên có liên quan, vai trò của thành viên HĐQT độc lập theo Nghị định 245/2025/NĐ-CP. Cơ chế giám sát thực thi còn yếu, nhiều doanh nghiệp lách luật rút ruột vốn qua các hợp đồng hợp tác đầu tư không minh bạch.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-orange-50/50 border border-orange-200">
                  <h3 className="font-serif font-bold text-lg text-orange-950 mb-2">2.3. Chế tài xử lý vi phạm (Người 3 - ~3 trang)</h3>
                  <p className="mb-2">
                    <strong>Chế tài hành chính:</strong> Từ 2020 đến 2025, UBCKNN ban hành hơn 2.731 quyết định xử phạt vi phạm hành chính.
                  </p>
                  <p>
                    <strong>Chế tài hình sự:</strong> Khởi tố hàng loạt đại án gây rúng động: FLC (thao túng giá), Tân Hoàng Minh (lừa đảo trái phiếu), Louis Holdings (thổi giá cổ phiếu rác), ASA (tăng khống cổ phiếu)... Bất cập lớn nhất là thời gian tố tụng kéo dài và việc thu hồi tài sản bồi hoàn cho nhà đầu tư cá nhân gặp muôn vàn trắc trở.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-orange-50/50 border border-orange-200">
                  <h3 className="font-serif font-bold text-lg text-orange-950 mb-2">2.4. Khiếu nại, tố cáo &amp; Giải quyết tranh chấp (Người 3 - ~2 trang)</h3>
                  <p>
                    UBCKNN tiếp nhận hơn 1.000 đơn thư khiếu nại, tố cáo trong giai đoạn 2021 – 2023. Quy trình giải quyết còn nặng tính hành chính, thiếu cơ chế giải quyết tranh chấp ngoài tòa án (ADR) và hoàn toàn vắng bóng chế định khởi kiện tập thể.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-orange-50/50 border border-orange-200">
                  <h3 className="font-serif font-bold text-lg text-orange-950 mb-2">2.5. Hoạt động giám sát thị trường (Người 3 - ~3 trang)</h3>
                  <p>
                    Vận hành hệ thống giám sát 3 cấp (CTCK – Sở Giao dịch – UBCKNN). Bất cập về liên thông dữ liệu liên ngành; việc chuyển đổi số và ứng dụng công nghệ giám sát cảnh báo sớm theo tinh thần Nghị quyết 57-NQ/TW chưa hoàn tất đồng bộ.
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* PHẦN 3: NHỮNG BẤT CẬP CÒN TỒN TẠI */}
          {(activeTab === 'all' || activeTab === 'chuong3') && (
            <section className="mb-12">
              <div className="flex items-center gap-2 text-orange-700 font-bold text-xs uppercase tracking-wider mb-2">
                <Bookmark className="w-4 h-4" />
                <span>Người 4 phụ trách (khoảng 6–7 trang) • Hạn nộp: 24/9</span>
              </div>
              <h2 className="font-serif font-bold text-xl md:text-2xl text-slate-900 mb-6 pb-2 border-b border-orange-200">
                3. NHỮNG BẤT CẬP CÒN TỒN TẠI TRÊN THỰC TẾ
              </h2>

              <div className="space-y-4 text-slate-800">
                <p>
                  <strong>3.1. Bất cập về thể chế pháp luật:</strong> Thiếu quy định cụ thể về trách nhiệm liên đới của chủ thể trung gian (tư vấn, kiểm toán, thẩm định giá); chế tài phạt tiền hành chính chưa tương xứng với thiệt hại; thiếu cơ chế bồi thường thiệt hại hiệu quả; lỗ hổng trong tiêu chí xác định nhà đầu tư chứng khoán chuyên nghiệp.
                </p>
                <p>
                  <strong>3.2. Bất cập trong thực thi pháp luật:</strong> Vi phạm công bố thông tin phổ biến; hành vi thao túng tinh vi qua tài khoản mượn danh; năng lực giám sát còn mỏng; tư vấn đầu tư trái phép qua mạng xã hội và ứng dụng AI lừa đảo; nhiều vụ án thao túng giá quy mô lớn gây thiệt hại nhưng "không xác định được số thu lợi bất chính".
                </p>
                <p>
                  <strong>3.3. Nhận thức &amp; Năng lực nhà đầu tư cá nhân:</strong> Thiếu kiến thức pháp lý và thẩm định tài chính, tâm lý đám đông, nhận thức về quyền cổ đông và cơ chế tự vệ pháp lý còn rất hạn chế.
                </p>
                <p>
                  <strong>3.4. Cơ chế phối hợp quản lý:</strong> Chia sẻ dữ liệu giữa UBCKNN, VSDC, Sở Giao dịch và Cơ quan Công an chưa liên tục và tự động theo thời gian thực.
                </p>
              </div>
            </section>
          )}

          {/* PHẦN 4: KIẾN NGHỊ HOÀN THIỆN */}
          {(activeTab === 'all' || activeTab === 'chuong4') && (
            <section className="mb-12">
              <div className="flex items-center gap-2 text-orange-700 font-bold text-xs uppercase tracking-wider mb-2">
                <Bookmark className="w-4 h-4" />
                <span>Người 5 phụ trách (khoảng 4–6 trang) • Hạn nộp: 25/9</span>
              </div>
              <h2 className="font-serif font-bold text-xl md:text-2xl text-slate-900 mb-6 pb-2 border-b border-orange-200">
                4. KIẾN NGHỊ HOÀN THIỆN PHÁP LUẬT VÀ NÂNG CAO HIỆU QUẢ BẢO VỆ NHÀ ĐẦU TƯ
              </h2>

              <div className="space-y-4 text-slate-800">
                <p>
                  <strong>4.1. Hoàn thiện thể chế pháp luật:</strong> Bổ sung quy định trách nhiệm bồi thường liên đới của tổ chức trung gian; nâng trần mức phạt tiền và áp dụng chế tài cấm giao dịch / cấm hành nghề có thời hạn; xây dựng cơ chế <em>Khởi kiện tập thể (Class Action)</em>; hoàn thiện chế độ công bố thông tin minh bạch.
                </p>
                <p>
                  <strong>4.2. Nâng cao hiệu quả thực thi:</strong> Ứng dụng AI và Big Data phát hiện dấu hiệu giao dịch bất thường theo Nghị quyết 57-NQ/TW; liên thông dữ liệu dân cư và tài khoản chứng khoán; siết chặt xử lý tư vấn đầu tư trái phép trên mạng xã hội; thành lập <em>Quỹ Bảo vệ Nhà Đầu Tư</em> bồi thường thiệt hại do thao túng giá.
                </p>
              </div>
            </section>
          )}

          {/* PHẦN 5: KẾT LUẬN & TLTK */}
          {(activeTab === 'all' || activeTab === 'ketluan') && (
            <section className="mb-8">
              <div className="flex items-center gap-2 text-orange-700 font-bold text-xs uppercase tracking-wider mb-2">
                <Bookmark className="w-4 h-4" />
                <span>Người 6 phụ trách (khoảng 3–4 trang) • Hạn nộp: 25/9</span>
              </div>
              <h2 className="font-serif font-bold text-xl md:text-2xl text-slate-900 mb-6 pb-2 border-b border-orange-200">
                5. KẾT LUẬN &amp; TÀI LIỆU THAM KHẢO
              </h2>

              <div className="space-y-4 text-slate-800">
                <p>
                  <strong>5.1. Tóm tắt kết quả:</strong> Khung pháp lý về bảo vệ nhà đầu tư cá nhân trên TTCK Việt Nam đã từng bước được kiện toàn với Luật Chứng khoán 2019 và Luật sửa đổi 2024. Tuy nhiên, khoảng cách giữa quy định văn bản và thực tiễn thực thi vẫn còn lớn, đòi hỏi cải cách đồng bộ.
                </p>
                <p>
                  <strong>5.2. Đánh giá chung:</strong> Nhà đầu tư cá nhân vẫn là lực lượng đông đảo nhất nhưng dễ bị tổn thương nhất. Sự ổn định và bền vững của thị trường vốn Việt Nam phụ thuộc trực tiếp vào mức độ bảo vệ công bằng và minh bạch dành cho họ.
                </p>
                <div className="p-4 rounded-xl bg-orange-50/70 border border-orange-200 mt-6">
                  <h4 className="font-serif font-bold text-sm text-slate-900 mb-2 uppercase tracking-wide">
                    Danh Mục Tài Liệu Tham Khảo Trọng Tâm:
                  </h4>
                  <ul className="text-xs space-y-1.5 text-slate-700 list-decimal pl-4">
                    <li>Quốc hội (2019), <em>Luật Chứng khoán số 54/2019/QH14</em>.</li>
                    <li>Quốc hội (2024), <em>Luật sửa đổi, bổ sung một số điều của Luật Chứng khoán số 56/2024/QH15</em>.</li>
                    <li>Chính phủ (2020), <em>Nghị định 155/2020/NĐ-CP</em> quy định chi tiết thi hành Luật Chứng khoán.</li>
                    <li>Chính phủ (2025), <em>Nghị định 245/2025/NĐ-CP</em> sửa đổi về quản trị công ty đại chúng.</li>
                    <li>Bộ Tài chính (2024), <em>Thông tư 68/2024/TT-BTC</em> về công bố thông tin song ngữ.</li>
                    <li>Ủy ban Chứng khoán Nhà nước (2020–2025), <em>Báo cáo thường niên và dữ liệu quyết định xử phạt vi phạm hành chính</em>.</li>
                  </ul>
                </div>
              </div>
            </section>
          )}
        </article>
      </div>
    </section>
  );
}
