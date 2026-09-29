import React, { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  AlertTriangle,
  Award,
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  FileCheck2,
  FileText,
  Landmark,
  Layers,
  Lock,
  Maximize2,
  Minimize2,
  Pause,
  Play,
  Scale,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
  Volume2,
  VolumeX,
  Zap,
  ArrowRight,
  Database,
  Cpu,
  RefreshCw,
  Eye,
  Key,
  Globe,
} from 'lucide-react';
import { soundFx } from '@/lib/audio-effects';

export interface SlideData {
  id: number;
  chapter: string;
  category: string;
  title: string;
  subtitle: string;
  badge: string;
  legalArticle?: string;
  bullets: string[];
  takeaways: { label: string; text: string }[];
  speakerNotes: string;
  chartOrVisual?: 'hero' | 'toc' | 'pyramid' | 'cases' | 'surveillance' | 'solutions' | 'stat';
  stats?: { value: string; label: string }[];
}

export const SLIDES_DATA: SlideData[] = [
  {
    id: 1,
    chapter: 'BÌA ĐỀ TÀI',
    category: 'Tổng quan học thuật',
    badge: 'Học viện Ngân hàng · Khoa Luật · 261LAW10A01',
    title: 'Pháp Luật Về Bảo Vệ Quyền Lợi Của Nhà Đầu Tư Cá Nhân Trên Thị Trường Chứng Khoán Việt Nam',
    subtitle: 'Bài Tập Lớn Học Phần Luật Chứng Khoán — Nhóm 2',
    speakerNotes: 'Kính chào TS. Nguyễn Phương Thảo cùng Quý Thầy Cô và các bạn sinh viên. Đại diện Nhóm 2 - Lớp học phần 261LAW10A01 Khoa Luật, Học viện Ngân hàng, chúng em xin trân trọng báo cáo đề tài nghiên cứu pháp luật về bảo vệ quyền lợi của nhà đầu tư cá nhân trên thị trường chứng khoán Việt Nam.',
    bullets: [
      'Cơ quan chủ quản: Ngân hàng Nhà nước Việt Nam — Học viện Ngân hàng',
      'Đơn vị đào tạo: Khoa Luật — Chương trình đào tạo cử nhân Luật Kinh tế',
      'Lớp học phần: 261LAW10A01 — Nhóm thực hiện: Nhóm 2 (08 thành viên)',
      'Giảng viên hướng dẫn: TS. Nguyễn Phương Thảo',
      'Năm thực hiện: 2026',
    ],
    takeaways: [
      { label: 'Quy mô chủ thể', text: 'Nhà đầu tư cá nhân chiếm trên 99% tổng số tài khoản và hơn 85–90% giá trị giao dịch toàn thị trường.' },
      { label: 'Mục tiêu nghiên cứu', text: 'Đánh giá thực trạng pháp luật, phân tích án điểm và đề xuất hệ thống giải pháp hoàn thiện thể chế.' }
    ],
    stats: [
      { value: '2.731+', label: 'Quyết định xử phạt' },
      { value: '>90%', label: 'Thanh khoản NĐT cá nhân' },
      { value: '08', label: 'Thành viên nghiên cứu' },
    ],
    chartOrVisual: 'hero'
  },
  {
    id: 2,
    chapter: 'MỤC LỤC',
    category: 'Cấu trúc đề tài',
    badge: 'Bố cục 5 Chương chuẩn mực',
    title: 'Cấu Trúc Hệ Thống Đề Tài Nghiên Cứu',
    subtitle: 'Bố cục công trình nghiên cứu theo chuẩn phương pháp luận khoa học pháp lý',
    speakerNotes: 'Bài tập lớn của nhóm được xây dựng với kết cấu 5 phần mạch lạc: từ làm rõ cơ sở lý luận, đánh giá thực trạng áp dụng pháp luật, phân tích các bất cập điển hình, đến đề xuất hệ thống 5 nhóm giải pháp hoàn thiện.',
    bullets: [
      'Phần Mở đầu: Tính cấp thiết, mục tiêu, đối tượng, phạm vi và phương pháp luận nghiên cứu.',
      'Chương 1: Những vấn đề lý luận và khung pháp luật về bảo vệ quyền lợi của NĐT cá nhân.',
      'Chương 2: Thực trạng áp dụng pháp luật về bảo vệ quyền lợi NĐT cá nhân tại Việt Nam.',
      'Chương 3: Những bất cập, hạn chế còn tồn tại (về thể chế, thực thi và năng lực chủ thể).',
      'Chương 4: Kiến nghị hoàn thiện pháp luật và giải pháp nâng cao hiệu quả bảo vệ NĐT cá nhân.',
      'Chương 5: Kết luận và Thư mục tài liệu tham khảo pháp lý.',
    ],
    takeaways: [
      { label: 'Phương pháp tiếp cận', text: 'Kết hợp nghiên cứu lý luận pháp luật với khảo sát thực tiễn áp dụng từ các đại án thao túng điểm.' },
    ],
    chartOrVisual: 'toc'
  },
  {
    id: 3,
    chapter: 'PHẦN MỞ ĐẦU',
    category: 'Tính cấp thiết',
    badge: 'Lý do chọn đề tài',
    title: 'Sự Cần Thiết Hoàn Thiện Pháp Luật Bảo Vệ Nhà Đầu Tư Cá Nhân',
    subtitle: 'Bất cân xứng thông tin và yêu cầu chuẩn hóa theo chuẩn mực quốc tế',
    speakerNotes: 'Thị trường chứng khoán Việt Nam sau hơn hai thập kỷ phát triển đã khẳng định vai trò kênh dẫn vốn trung và dài hạn chủ lực. Tuy nhiên, NĐT cá nhân - lực lượng tạo nên phần lớn thanh khoản - vẫn luôn ở vị thế yếu thế do bất cân xứng thông tin và hạn chế nguồn lực pháp lý.',
    bullets: [
      'Kênh dẫn vốn trọng yếu: TTCK đóng vai trò huyết mạch luân chuyển vốn trung và dài hạn cho nền kinh tế quốc gia.',
      'Vị thế yếu thế của NĐT cá nhân: Chiếm hơn 90% giao dịch nhưng chịu bất cân xứng thông tin nghiêm trọng so với tổ chức phát hành và NĐT lớn.',
      'Gia tăng các hành vi gian lận: Thao túng giá qua mạng xã hội, tăng khống vốn điều lệ, phát hành trái phiếu doanh nghiệp riêng lẻ sai mục đích.',
      'Yêu cầu nâng hạng thị trường: Tiêu chuẩn của FTSE Russell và MSCI đòi hỏi khung pháp lý bảo vệ nhà đầu tư phải minh bạch, bình đẳng và thực thi hiệu quả.',
    ],
    takeaways: [
      { label: 'Ý nghĩa cốt lõi', text: 'Bảo vệ quyền lợi NĐT cá nhân là tiền đề giữ vững niềm tin công chúng và bảo đảm thị trường vốn phát triển ổn định.' }
    ]
  },
  {
    id: 4,
    chapter: 'CHƯƠNG 1',
    category: 'Cơ sở lý luận',
    badge: 'Khái niệm & Đặc điểm',
    title: 'Khái Niệm Và Đặc Điểm Của Nhà Đầu Tư Cá Nhân',
    subtitle: 'Căn cứ Khoản 15, 16 Điều 4 & Điều 11 Luật Chứng khoán 2019',
    legalArticle: 'Luật Chứng khoán 2019 (Điều 4, Điều 11)',
    speakerNotes: 'Theo Luật Chứng khoán 2019, NĐT cá nhân là các thể nhân bỏ vốn vào thị trường để tìm kiếm lợi nhuận. Họ có 4 đặc điểm pháp lý nổi bật chi phối trực tiếp đến nhu cầu được pháp luật bảo vệ.',
    bullets: [
      'Khái niệm pháp lý: Thể nhân trực tiếp bỏ vốn mua, bán, nắm giữ chứng khoán vì lợi ích sinh lời của bản thân (Khoản 15 Điều 4).',
      'Nguồn vốn và rủi ro: Đầu tư bằng tài sản cá nhân và tự chịu trách nhiệm tài sản đối với các rủi ro phát sinh.',
      'Hạn chế nguồn lực chuyên môn: Ra quyết định độc lập, thiếu bộ phận phân tích dữ liệu và quản trị rủi ro chuyên nghiệp hỗ trợ.',
      'Tính dễ bị tổn thương: Dễ chịu tác động bởi tâm lý đám đông, tin đồn thất thiệt và các hội nhóm giao dịch chưa kiểm chứng.',
    ],
    takeaways: [
      { label: 'Ý nghĩa phân loại', text: 'Tách bạch NĐT chuyên nghiệp và không chuyên nhằm giới hạn NĐT cá nhân tiếp cận các sản phẩm rủi ro cao (như trái phiếu riêng lẻ).' }
    ]
  },
  {
    id: 5,
    chapter: 'CHƯƠNG 1',
    category: 'Cơ sở lý luận',
    badge: 'Nội dung bảo vệ',
    title: 'Nội Dung Bảo Vệ Quyền Lợi Của Nhà Đầu Tư Cá Nhân',
    subtitle: 'Chuỗi 3 khâu bảo vệ liên hoàn: Phòng ngừa — Giám sát — Xử lý bồi thường',
    speakerNotes: 'Bảo vệ quyền lợi nhà đầu tư không đơn thuần là xử phạt sau vi phạm, mà là một cơ chế đồng bộ vận hành xuyên suốt qua 3 giai đoạn chặt chẽ.',
    bullets: [
      'Khâu 1 — Phòng ngừa rủi ro: Thiết lập điều kiện chào bán nghiêm ngặt, chuẩn mực công bố thông tin minh bạch và cấp phép hành nghề chặt chẽ.',
      'Khâu 2 — Giám sát và phát hiện: Vận hành hệ thống giám sát giao dịch 3 cấp, theo dõi biến động bất thường và thanh tra định kỳ, đột xuất.',
      'Khâu 3 — Xử lý và bồi thường: Áp dụng biện pháp ngăn chặn khẩn cấp, hủy giao dịch vi phạm, xử phạt nghiêm minh và cơ chế bồi thường thiệt hại.',
    ],
    takeaways: [
      { label: '5 Nhóm quyền cốt lõi', text: 'Quyền sở hữu tài sản · Quyền tiếp cận thông tin bình đẳng · Quyền biểu quyết quản trị · Quyền khiếu nại tố cáo · Quyền yêu cầu bồi thường thiệt hại.' }
    ]
  },
  {
    id: 6,
    chapter: 'CHƯƠNG 1',
    category: 'Nguyên tắc pháp lý',
    badge: '4 Nguyên tắc cốt lõi',
    title: 'Các Nguyên Tắc Pháp Lý Cốt Lõi Trong Bảo Vệ Nhà Đầu Tư',
    subtitle: 'Nền tảng triết lý lập pháp của Luật Chứng khoán Việt Nam',
    speakerNotes: 'Bốn nguyên tắc nền tảng này định hình mọi quy định của Luật Chứng khoán, bảo đảm môi trường đầu tư công bằng và kỷ cương.',
    bullets: [
      'Nguyên tắc Bình đẳng và Công bằng: Mọi chủ thể đều được tiếp cận thông tin cùng thời điểm; nghiêm cấm giao dịch nội gián trục lợi.',
      'Nguyên tắc Công khai và Minh bạch: Thông tin công bố phải kịp thời, đầy đủ và trung thực; cấm che giấu hoặc làm sai lệch dữ liệu thị trường.',
      'Nguyên tắc Quản lý và Giám sát của Nhà nước: Nhà nước giữ vững kỷ cương, phòng ngừa lũng đoạn và bảo vệ trật tự an toàn tài chính quốc gia.',
      'Nguyên tắc Tự chịu rủi ro có trật tự (Caveat Emptor): NĐT tự chịu rủi ro thương mại, nhưng Nhà nước bảo đảm môi trường giao dịch không có hành vi gian lận.',
    ],
    takeaways: [
      { label: 'Bản chất pháp lý', text: 'Bảo vệ NĐT là bảo vệ sự công bằng của luật chơi và tính minh bạch của thị trường, không phải bảo đảm lợi nhuận kinh doanh.' }
    ]
  },
  {
    id: 7,
    chapter: 'CHƯƠNG 2',
    category: 'Thực trạng pháp luật',
    badge: 'Công bố thông tin',
    title: 'Bảo Vệ NĐT Thông Qua Cơ Chế Công Bố Thông Tin (CBTT)',
    subtitle: 'Quy định định kỳ, bất thường và bước tiến CBTT song ngữ',
    legalArticle: 'Thông tư 96/2020/TT-BTC & Thông tư 68/2024/TT-BTC',
    speakerNotes: 'Công bố thông tin là trái tim của thị trường chứng khoán. NĐT cá nhân chỉ có thể đưa ra quyết định đúng đắn nếu thông tin được công khai trung thực và kịp thời.',
    bullets: [
      'CBTT Định kỳ: Báo cáo tài chính quý, bán niên, năm đã kiểm toán; Báo cáo thường niên; Nghị quyết và Biên bản ĐHĐCĐ thường niên.',
      'CBTT Bất thường (trong 24 giờ): Biến động nhân sự chủ chốt, tài khoản bị phong tỏa, khởi tố hình sự, giao dịch tài sản lớn trên 10% tổng tài sản.',
      'CBTT Theo yêu cầu: Doanh nghiệp có nghĩa vụ xác thực hoặc bác bỏ trong 24 giờ khi có tin đồn ảnh hưởng nghiêm trọng đến giá cổ phiếu.',
      'Điểm mới Thông tư 68/2024/TT-BTC: Bắt buộc CBTT song ngữ (Việt - Anh) đối với công ty đại chúng quy mô lớn, tạo bình đẳng tiếp cận cho mọi NĐT.',
    ],
    takeaways: [
      { label: 'Thực tế xử lý', text: 'Hành vi vi phạm nghĩa vụ công bố thông tin chiếm tỷ lệ lớn nhất (trên 40%) trong các quyết định xử phạt hành chính của UBCKNN hàng năm.' }
    ]
  },
  {
    id: 8,
    chapter: 'CHƯƠNG 2',
    category: 'Thực trạng pháp luật',
    badge: 'Quản trị công ty',
    title: 'Bảo Vệ NĐT Thông Qua Quy Định Về Quản Trị Công Ty Đại Chúng',
    subtitle: 'Bảo vệ quyền lợi cổ đông nhỏ lẻ theo Nghị định 245/2025/NĐ-CP',
    legalArticle: 'Nghị định 245/2025/NĐ-CP & Luật Doanh nghiệp 2020',
    speakerNotes: 'Tại các công ty đại chúng, cổ đông lớn và người điều hành thường nắm ưu thế áp đảo. Pháp luật quản trị công ty thiết lập các van an toàn bảo vệ quyền lợi cổ đông thiểu số.',
    bullets: [
      'Tỷ lệ thành viên HĐQT độc lập: Bắt buộc tối thiểu 1/3 tổng số thành viên HĐQT là độc lập đối với công ty niêm yết để phản biện khách quan.',
      'Ủy ban Kiểm toán trực thuộc HĐQT: Giám sát tính trung thực của báo cáo tài chính và kiểm soát chặt các giao dịch với bên có liên quan.',
      'Quyền năng cổ đông thiểu số: Nhóm cổ đông sở hữu từ 5% cổ phần có quyền đề cử ứng viên HĐQT, yêu cầu triệu tập ĐHĐCĐ bất thường.',
      'Ngăn chặn giao dịch tư lợi: Biểu quyết loại trừ đối với người quản lý hoặc bên có liên quan khi phát sinh hợp đồng, giao dịch trọng yếu.',
    ],
    takeaways: [
      { label: 'Thách thức thực tiễn', text: 'Tính độc lập của thành viên HĐQT tại nhiều doanh nghiệp vẫn còn mang tính hình thức, chưa phát huy đầy đủ vai trò giám sát.' }
    ]
  },
  {
    id: 9,
    chapter: 'CHƯƠNG 2',
    category: 'Thực trạng chế tài',
    badge: 'Chế tài xử phạt',
    title: 'Hệ Thống Chế Tài Xử Phạt Vi Phạm Trên Thị Trường Chứng Khoán',
    subtitle: 'Sự kết hợp giữa chế tài hành chính và truy cứu trách nhiệm hình sự',
    legalArticle: 'Nghị định 156/2020/NĐ-CP & Điều 209, 211 BLHS 2015',
    speakerNotes: 'Khung chế tài hiện hành đã được hoàn thiện theo hướng kết hợp song song giữa phạt vi phạm hành chính và xử lý nghiêm minh bằng biện pháp hình sự.',
    bullets: [
      'Chế tài Hành chính (NĐ 156/2020/NĐ-CP, sửa đổi bởi NĐ 128/2021): Phạt tiền tối đa 3 tỷ đồng đối với tổ chức, hoặc gấp 10 lần khoản thu lợi bất chính; buộc nộp lại toàn bộ số lợi bất hợp pháp.',
      'Biện pháp khắc phục hậu quả: Buộc cải chính thông tin sai lệch, đình chỉ giao dịch có thời hạn, tước quyền sử dụng chứng chỉ hành nghề chứng khoán.',
      'Chế tài Hình sự (BLHS 2015, sửa đổi 2017): Điều 209 (Cố ý CBTT sai lệch - phạt tù đến 5 năm); Điều 211 (Thao túng thị trường chứng khoán - phạt tù đến 7 năm, phạt tiền đến 4 tỷ đồng).',
      'Thực tiễn áp dụng: Giai đoạn 2020–2025, UBCKNN đã ban hành hơn 2.731 quyết định xử phạt VPHC và chuyển cơ quan điều tra hàng chục vụ việc có dấu hiệu tội phạm.',
    ],
    takeaways: [
      { label: 'Tính răn đe', text: 'Việc khởi tố hình sự các vụ án lớn khẳng định quyết tâm làm trong sạch thị trường của các cơ quan quản lý và tư pháp.' }
    ]
  },
  {
    id: 10,
    chapter: 'CHƯƠNG 2',
    category: 'Hồ sơ đại án',
    badge: 'Đại án điểm I',
    title: 'Đại Án Thao Túng Thị Trường Chứng Khoán FLC & Trịnh Văn Quyết',
    subtitle: 'Thao túng liên tài khoản và lừa đảo nâng khống vốn điều lệ',
    legalArticle: 'Bản án TAND TP. Hà Nội (Áp dụng Điều 211 & Điều 174 BLHS)',
    speakerNotes: 'Vụ án FLC là điển hình về thủ đoạn sử dụng hàng trăm tài khoản tạo cung cầu giả, kết hợp nâng khống vốn điều lệ và bán lượng lớn cổ phiếu không công bố thông tin.',
    bullets: [
      'Thao túng liên tài khoản: Sử dụng hơn 500 tài khoản mở tại 45 công ty chứng khoán, liên tục giao dịch chéo tạo thanh khoản và giá cổ phiếu giả tạo đối với họ cổ phiếu FLC.',
      'Giao dịch không công bố thông tin: Ngày 10/01/2022, bán 74,8 triệu cổ phiếu FLC không báo cáo trước, buộc UBCKNN lần đầu tiên ra quyết định hủy bỏ giao dịch.',
      'Nâng khống vốn điều lệ Faros: Tăng khống vốn điều lệ từ 1,5 tỷ lên 4.300 tỷ đồng (gấp hơn 2.800 lần) thông qua thủ đoạn ủy nhiệm chi lòng vòng trước khi niêm yết.',
      'Hậu quả và xử lý tư pháp: Thu lời bất chính hơn 723 tỷ đồng từ thao túng và lừa đảo chiếm đoạt hơn 3.620 tỷ đồng của hơn 30.000 NĐT; bị xử phạt tù nghiêm khắc.',
    ],
    takeaways: [
      { label: 'Phản ứng quản lý', text: 'UBCKNN hủy bỏ giao dịch vi phạm, phong tỏa tài khoản và chuyển hồ sơ khởi tố hình sự; chỉ ra lỗ hổng lớn trong kiểm soát lệnh người nội bộ.' }
    ],
    chartOrVisual: 'cases'
  },
  {
    id: 11,
    chapter: 'CHƯƠNG 2',
    category: 'Hồ sơ đại án',
    badge: 'Đại án điểm II & III',
    title: 'Đại Án Trái Phiếu Tân Hoàng Minh & Thao Túng Louis Holdings',
    subtitle: 'Gian lận phát hành trái phiếu riêng lẻ và thao túng cổ phiếu đầu cơ',
    speakerNotes: 'Hai vụ án Tân Hoàng Minh và Louis Holdings phản ánh rõ nét nguy cơ lạm dụng phát hành trái phiếu riêng lẻ và hành vi trục lợi thao túng qua các hội nhóm mạng xã hội.',
    bullets: [
      'Gian lận phát hành Tân Hoàng Minh: Phát hành 9 gói trái phiếu riêng lẻ trị giá 10.030 tỷ đồng qua 3 công ty con với phương án tạo dựng khống; chiếm đoạt 8.644 tỷ đồng của 6.630 NĐT cá nhân.',
      'Xử lý tư pháp Tân Hoàng Minh: TAND TP. Hà Nội tuyên phạt tù người đứng đầu và buộc bồi thường toàn bộ 8.644 tỷ đồng đã thu hồi trả lại cho các bị hại.',
      'Thao túng tại Louis Holdings: Đỗ Thành Nhân cùng đồng phạm sử dụng nhóm mạng xã hội và nhiều tài khoản thông đồng thổi giá mã BII, TGG, thu lời bất chính hơn 154 tỷ đồng.',
      'Bài học cảnh tỉnh: Bộc lộ sơ hở nghiêm trọng trong thẩm định giá, kiểm toán độc lập và tâm lý hám lợi theo tin đồn của một bộ phận NĐT cá nhân.',
    ],
    takeaways: [
      { label: 'Điểm chung', text: 'Tận dụng khoảng trống quản lý của tổ chức trung gian (kiểm toán, thẩm định giá) kết hợp khai thác điểm yếu thiếu kiến thức của NĐT cá nhân.' }
    ]
  },
  {
    id: 12,
    chapter: 'CHƯƠNG 2',
    category: 'Giải quyết tranh chấp',
    badge: 'Khiếu nại & Tố tụng',
    title: 'Cơ Chế Giải Quyết Tranh Chấp & Xử Lý Đơn Thư Của UBCKNN',
    subtitle: 'Khung pháp lý Điều 133 Luật Chứng khoán và thực tiễn tiếp nhận đơn thư',
    legalArticle: 'Điều 133 Luật Chứng khoán 2019 & Bộ luật TTDS 2015',
    speakerNotes: 'Điều 133 Luật Chứng khoán quy định 4 kênh giải quyết tranh chấp: Thương lượng, Hòa giải, Trọng tài thương mại và Tòa án. Tuy nhiên, trên thực tế NĐT cá nhân gặp rất nhiều rào cản khi bảo vệ quyền lợi.',
    bullets: [
      'Thương lượng & Hòa giải: Được khuyến khích nhưng hiệu quả thấp do bên vi phạm thường trốn tránh, thiếu thiện chí bồi thường.',
      'Trọng tài thương mại: Chi phí tố tụng cao, chủ yếu thích hợp cho tranh chấp giữa các định chế tài chính, không khả thi với NĐT nhỏ lẻ.',
      'Khởi kiện tại Tòa án: Thời gian tố tụng kéo dài từ 2–3 năm; gánh nặng nộp tạm ứng án phí và nghĩa vụ tự chứng minh thiệt hại là rào cản lớn.',
      'Thực tiễn xử lý đơn thư tại UBCKNN: Tiếp nhận hơn 1.000 đơn thư/năm; tuy nhiên UBCKNN chỉ có thẩm quyền xử phạt hành chính, chưa có thẩm quyền phán quyết bồi thường tài sản cho NĐT.',
    ],
    takeaways: [
      { label: 'Khoảng trống pháp lý', text: 'Tiền phạt hành chính nộp vào ngân sách Nhà nước; NĐT bị thiệt hại vẫn phải tự khởi kiện vụ án dân sự độc lập để đòi bồi thường.' }
    ]
  },
  {
    id: 13,
    chapter: 'CHƯƠNG 2',
    category: 'Giám sát thị trường',
    badge: 'Mô hình giám sát',
    title: 'Hệ Thống Giám Sát Thị Trường Chứng Khoán 3 Cấp',
    subtitle: 'Mô hình giám sát phòng thủ đa tầng: CTCK — Sở Giao Dịch — UBCKNN',
    speakerNotes: 'Hệ thống giám sát thị trường tại Việt Nam được tổ chức theo mô hình 3 cấp nhằm phát hiện sớm các giao dịch bất thường.',
    bullets: [
      'Cấp 1 — Công ty Chứng khoán (CTCK): Tuyến phòng thủ trực tiếp; giám sát lệnh đặt của khách hàng, kiểm soát tỷ lệ margin và phòng chống rửa tiền.',
      'Cấp 2 — Sở Giao dịch Chứng khoán (VNX, HOSE, HNX): Giám sát phiên giao dịch thời gian thực (real-time); phát hiện các lệnh đặt/hủy bất thường, gom hàng hoặc đè giá.',
      'Cấp 3 — Ủy ban Chứng khoán Nhà nước (UBCKNN): Cơ quan quản lý cấp Nhà nước; kiểm tra, thanh tra chuyên ngành, xử lý vi phạm hoặc chuyển giao hồ sơ sang Cơ quan điều tra.',
      'Thách thức hiện tại: Dữ liệu giữa các CTCK còn phân tán, độ trễ báo cáo liên công ty khiến việc nhận diện thao túng liên tài khoản đôi khi chưa tức thời.',
    ],
    takeaways: [
      { label: 'Định hướng', text: 'Cần tích hợp dữ liệu giao dịch tập trung và triển khai hệ thống cảnh báo sớm liên thông toàn thị trường.' }
    ],
    chartOrVisual: 'surveillance'
  },
  {
    id: 14,
    chapter: 'CHƯƠNG 3',
    category: 'Bất cập thực tế',
    badge: 'Lỗ hổng thể chế',
    title: 'Bất Cập Về Thể Chế: Trách Nhiệm Chủ Thể Trung Gian',
    subtitle: 'Khoảng trống định lượng trách nhiệm của CTCK, Kiểm toán & Đơn vị tư vấn',
    speakerNotes: 'Chương 3 của đề tài tập trung nhận diện các bất cập lớn. Đầu tiên là khoảng trống về trách nhiệm pháp lý và chế tài đối với các tổ chức trung gian thị trường.',
    bullets: [
      'Trách nhiệm pháp lý của CTCK còn mờ nhạt: Thiếu chế tài đủ mạnh khi CTCK buông lỏng kiểm soát mở tài khoản, cấp margin sai quy định hoặc môi giới câu kết tạo sóng.',
      'Tổ chức kiểm toán thiếu độc lập: Vụ án nâng vốn khống Faros có sự tiếp tay của kiểm toán viên, song chế tài đình chỉ hành nghề chưa tương xứng với hậu quả gây ra.',
      'Đơn vị thẩm định giá và xếp hạng tín nhiệm: Chưa phát huy vai trò độc lập; nhiều tài sản bảo đảm của trái phiếu bị nâng khống giá trị gấp nhiều lần thực tế.',
      'Trần phạt tiền hành chính chưa đủ sức răn đe: Mức phạt tối đa 3 tỷ đồng là quá nhỏ so với khoản lợi bất chính hàng trăm tỷ đồng thu được từ hành vi thao túng.',
    ],
    takeaways: [
      { label: 'Yêu cầu lập pháp', text: 'Cần luật hóa cơ chế liên đới chịu trách nhiệm bồi thường thiệt hại đối với tổ chức kiểm toán và CTCK khi có lỗi cố ý hoặc tắc trách nghiêm trọng.' }
    ]
  },
  {
    id: 15,
    chapter: 'CHƯƠNG 3',
    category: 'Bất cập thực tế',
    badge: 'Rào cản tố tụng',
    title: 'Bất Cập Trong Thực Thi: Rào Cản Tố Tụng Đòi Bồi Thường',
    subtitle: 'Nút thắt định lượng thiệt hại theo Điều 145 Luật Chứng khoán',
    legalArticle: 'Điều 145 Luật Chứng khoán 2019 & Bộ luật TTDS 2015',
    speakerNotes: 'Đây là bất cập lớn nhất khiến cho quyền đòi bồi thường thiệt hại của nhà đầu tư cá nhân trên thực tế rất khó triển khai thành công.',
    bullets: [
      'Thiếu phương pháp định lượng thiệt hại: Điều 145 Luật CK quy định quyền đòi bồi thường, nhưng chưa có thông tư hướng dẫn công thức xác định thiệt hại do thao túng giá.',
      'Khó khăn chứng minh quan hệ nhân quả: Khó phân định mức giảm giá cổ phiếu là do hành vi thao túng hay do biến động khách quan của thị trường chung.',
      'Chi phí tố tụng không tương xứng: Chi phí thuê luật sư, tạm ứng án phí và thời gian theo kiện thường vượt quá giá trị thiệt hại thực tế của từng cá nhân.',
      'Thiếu vắng cơ chế Khởi kiện tập thể (Class Action): Luật Tố tụng Dân sự hiện hành chỉ cho phép ủy quyền hoặc gộp vụ án đơn lẻ, gây quá tải và tốn kém.',
    ],
    takeaways: [
      { label: 'Thực tiễn tư pháp', text: 'Chưa từng có tiền lệ NĐT cá nhân khởi kiện dân sự độc lập thành công đòi bồi thường từ đối tượng thao túng chứng khoán tại Việt Nam.' }
    ]
  },
  {
    id: 16,
    chapter: 'CHƯƠNG 3',
    category: 'Bất cập thực tế',
    badge: 'Năng lực NĐT',
    title: 'Bất Cập Về Nhận Thức & Tâm Lý Của Nhà Đầu Tư Cá Nhân',
    subtitle: 'Hạn chế kiến thức tài chính, tâm lý đầu cơ và cạm bẫy mạng xã hội',
    speakerNotes: 'Bảo vệ nhà đầu tư phải song hành với việc nâng cao năng lực tự bảo vệ và nhận thức pháp lý của chính họ.',
    bullets: [
      'Tư duy đầu cơ ngắn hạn chiếm ưu thế: Nhiều NĐT tham gia với kỳ vọng sinh lời nhanh chóng thay vì đánh giá giá trị nội tại dài hạn của doanh nghiệp.',
      'Tâm lý đám đông và ảnh hưởng tin đồn: Dễ bị dẫn dắt bởi các hội nhóm "phím hàng", room chat kín trên mạng xã hội chưa được cấp phép tư vấn.',
      'Hạn chế về năng lực đọc hiểu Báo cáo tài chính: Phần lớn NĐT không tìm hiểu bản cáo bạch, thiếu kỹ năng phân tích các chỉ số tài chính nền tảng.',
      'Tâm lý e ngại tố tụng: Khi phát sinh thua lỗ hoặc phát hiện sai phạm, NĐT thường chọn bán tháo chịu lỗ thay vì chủ động gửi phản ánh tới cơ quan quản lý.',
    ],
    takeaways: [
      { label: 'Giải pháp căn cơ', text: 'Chiến lược quốc gia về giáo dục tài chính là nền tảng nâng cao năng lực tự thẩm định và phòng ngừa rủi ro cho nhà đầu tư.' }
    ]
  },
  {
    id: 17,
    chapter: 'CHƯƠNG 4',
    category: 'Kiến nghị hoàn thiện',
    badge: 'Kiến nghị thể chế I',
    title: 'Kiến Nghị Hoàn Thiện Thể Chế: Siết Trách Nhiệm Trung Gian',
    subtitle: 'Quy định trách nhiệm liên đới và nâng mức chế tài xử phạt',
    speakerNotes: 'Bước sang Chương 4, nhóm nghiên cứu đề xuất 5 nhóm giải pháp hoàn thiện, bắt đầu từ việc củng cố trách nhiệm của các chủ thể trung gian thị trường.',
    bullets: [
      'Luật hóa trách nhiệm liên đới của CTCK: Bắt buộc CTCK bồi thường nếu để rò rỉ dữ liệu hoặc nhân viên môi giới lợi dụng chức vụ tiếp tay thao túng gây hại cho NĐT.',
      'Siết chặt chế tài đối với tổ chức kiểm toán: Bổ sung quy định tước giấy phép hành nghề vĩnh viễn và xử lý hình sự đối với kiểm toán viên ký xác nhận BCTC gian dối.',
      'Nâng mức xử phạt vi phạm hành chính: Bỏ mức trần xử phạt cố định đối với hành vi thao túng; áp dụng phạt theo tỷ lệ gấp 3–5 lần tổng giá trị giao dịch vi phạm.',
      'Chuẩn hóa công bố thông tin bắt buộc bằng tiếng Anh: Mở rộng diện áp dụng bắt buộc song ngữ đối với 100% công ty niêm yết theo lộ trình cụ thể.',
    ],
    takeaways: [
      { label: 'Mục tiêu lập pháp', text: 'Tạo chi phí vi phạm pháp luật vượt xa lợi ích bất chính thu được, triệt tiêu động cơ vi phạm từ giai đoạn chuẩn bị.' }
    ],
    chartOrVisual: 'solutions'
  },
  {
    id: 18,
    chapter: 'CHƯƠNG 4',
    category: 'Kiến nghị hoàn thiện',
    badge: 'Kiến nghị đột phá II',
    title: 'Kiến Nghị Đột Phá: Xây Dựng Cơ Chế Khởi Kiện Tập Thể (Class Action)',
    subtitle: 'Giải pháp đột phá khắc phục rào cản khởi kiện bồi thường thiệt hại cho NĐT',
    speakerNotes: 'Đây là kiến nghị cốt lõi trong nhóm giải pháp hoàn thiện thủ tục tố tụng dân sự nhằm bảo vệ quyền lợi cho số đông nhà đầu tư cá nhân.',
    bullets: [
      'Bản chất cơ chế Khởi kiện tập thể: Cho phép một hoặc một số NĐT đại diện khởi kiện thay mặt cho toàn bộ các cá nhân cùng chịu thiệt hại từ một hành vi vi phạm.',
      'Nguyên tắc "Opt-out" (Rút lui): Phán quyết của Tòa án có hiệu lực áp dụng đối với tất cả NĐT trong nhóm bị hại, trừ người chủ động nộp đơn từ chối tham gia.',
      'Tối ưu hóa nguồn lực tư pháp: Tòa án thụ lý và xét xử một vụ án đại diện duy nhất, tránh tình trạng hàng ngàn đơn kiện riêng lẻ gây quá tải hệ thống xét xử.',
      'Cơ chế thù lao luật sư theo kết quả (Contingency Fee): Luật sư nhận thù lao trích từ phần bồi thường thắng kiện, giúp NĐT nghèo dễ dàng tiếp cận công lý.',
    ],
    takeaways: [
      { label: 'Kinh nghiệm quốc tế', text: 'Mô hình Class Action theo Rule 23 của Hoa Kỳ và Hàn Quốc là gợi ý giá trị để sửa đổi Bộ luật Tố tụng Dân sự Việt Nam.' }
    ]
  },
  {
    id: 19,
    chapter: 'CHƯƠNG 4',
    category: 'Kiến nghị hoàn thiện',
    badge: 'Kiến nghị đột phá III',
    title: 'Kiến Nghị Đột Phá: Thành Lập Quỹ Bảo Vệ Nhà Đầu Tư (SIPF)',
    subtitle: 'Học hỏi mô hình Quỹ SIPC (Hoa Kỳ) và Quỹ bồi thường NĐT của Hàn Quốc',
    speakerNotes: 'Nhóm nghiên cứu kiến nghị thành lập Quỹ Bảo Vệ Nhà Đầu Tư độc lập để bồi thường khẩn cấp khi các tổ chức tài chính trung gian phá sản hoặc mất thanh khoản.',
    bullets: [
      'Nguồn vốn tạo lập Quỹ: Ngân sách ban đầu từ UBCKNN và các Sở GDCK; trích tỷ lệ định kỳ từ doanh thu phí giao dịch của các CTCK thành viên và tiền xử phạt vi phạm.',
      'Chức năng bồi thường khẩn cấp: Bồi thường ngay lập tức cho NĐT cá nhân trong trường hợp CTCK phá sản, mất khả năng thanh toán hoặc gian lận chiếm dụng tài sản.',
      'Hỗ trợ chi phí tố tụng: Tạm ứng kinh phí giám định tài chính, định giá và hỗ trợ thuê luật sư cho NĐT cá nhân có hoàn cảnh khó khăn khi khởi kiện.',
      'Cơ chế vận hành minh bạch: Quỹ hoạt động phi lợi nhuận, chịu sự kiểm toán độc lập và giám sát chặt chẽ của UBCKNN.',
    ],
    takeaways: [
      { label: 'Ý nghĩa an sinh', text: 'Thiết lập mạng lưới an toàn tài chính, củng cố niềm tin công chúng và ngăn ngừa rủi ro đổ vỡ dây chuyền trên thị trường vốn.' }
    ]
  },
  {
    id: 20,
    chapter: 'CHƯƠNG 4',
    category: 'Kiến nghị thực thi',
    badge: 'Chuyển đổi số & Giám sát',
    title: 'Kiến Nghị Nâng Cao Hiệu Quả Thực Thi: Giám Sát Bằng AI & SupTech',
    subtitle: 'Ứng dụng công nghệ RegTech và SupTech trong phòng ngừa vi phạm tài chính',
    speakerNotes: 'Để đối phó hiệu quả với các hành vi vi phạm ngày càng tinh vi, cơ quan quản lý cần ứng dụng công nghệ giám sát thời gian thực hiện đại.',
    bullets: [
      'Giám sát giao dịch thời gian thực (SupTech): Ứng dụng thuật toán phát hiện ngay trong phiên các hành vi đặt/hủy lệnh lặp lại, tạo cung cầu ảo (Spoofing, Wash sale).',
      'Đồng bộ dữ liệu định danh VNeID: Bắt buộc xác thực sinh trắc học và CCCD gắn chip khi mở tài khoản, ngăn chặn triệt để tình trạng mượn tài khoản thao túng.',
      'Cảnh báo sớm trên không gian số: Sử dụng công nghệ xử lý ngôn ngữ tự nhiên (NLP) giám sát các nền tảng mạng xã hội để kịp thời phát hiện thông tin sai lệch lôi kéo NĐT.',
      'Quy chế phong tỏa tài khoản khẩn cấp: Trao thẩm quyền cho UBCKNN tạm dừng giao dịch và phong tỏa tài sản ngay khi có dấu hiệu vi phạm nghiêm trọng, tránh tẩu tán.',
    ],
    takeaways: [
      { label: 'Chuyển đổi phương thức', text: 'Chuyển từ cơ chế "Hậu kiểm" (phát hiện sau nhiều tháng) sang cơ chế "Tiền kiểm & Giám sát thời gian thực" (ngăn chặn ngay trong phiên).' }
    ]
  },
  {
    id: 21,
    chapter: 'CHƯƠNG 5',
    category: 'Kết luận & Triển vọng',
    badge: 'Tầm nhìn phát triển',
    title: 'Kết Luận: Hướng Tới Một Thị Trường Chứng Khoán Minh Bạch & Nâng Hạng',
    subtitle: 'Đồng bộ giải pháp pháp lý để thị trường vốn phát triển lành mạnh, bền vững',
    speakerNotes: 'Bảo vệ quyền lợi nhà đầu tư cá nhân không chỉ là vấn đề kỹ thuật pháp lý, mà là điều kiện then chốt để khơi thông nguồn vốn xã hội và thúc đẩy kinh tế đất nước phát triển.',
    bullets: [
      'Tổng kết công trình nghiên cứu: Đề tài đã phân tích toàn diện 4 chương nội dung từ cơ sở lý luận đến án điểm thực tiễn và đề xuất 5 nhóm kiến nghị đồng bộ.',
      'Khơi thông nguồn vốn xã hội: Bảo vệ hiệu quả quyền lợi NĐT cá nhân là chìa khóa duy trì dòng vốn nhàn rỗi trong nhân dân phục vụ sản xuất kinh doanh.',
      'Tiêu chuẩn nâng hạng quốc tế: Khung pháp lý bảo vệ nhà đầu tư minh bạch, bình đẳng là tiêu chí quyết định để FTSE Russell và MSCI nâng hạng TTCK Việt Nam.',
      'Đóng góp học thuật: Kết quả nghiên cứu cung cấp luận cứ khoa học và thực tiễn tham khảo cho công tác hoàn thiện pháp luật chứng khoán giai đoạn 2026–2030.',
    ],
    takeaways: [
      { label: 'Thông điệp cốt lõi', text: 'Một thị trường chứng khoán kỷ cương, minh bạch và an toàn là nơi mà mọi đồng vốn của người dân đều được pháp luật che chở.' }
    ]
  },
  {
    id: 22,
    chapter: 'LỜI CẢM ƠN',
    category: 'Báo cáo hoàn thành',
    badge: 'Khoa Luật · HVNH',
    title: 'Lời Cảm Ơn & Phần Thảo Luận (Q&A)',
    subtitle: 'Nhóm 2 xin trân trọng cảm ơn Giảng viên hướng dẫn TS. Nguyễn Phương Thảo',
    speakerNotes: 'Đại diện Nhóm 2, chúng em xin chân thành cảm ơn TS. Nguyễn Phương Thảo đã tận tình định hướng và hướng dẫn. Nhóm xin trân trọng kính mời Quý Thầy Cô và các bạn đặt câu hỏi phản biện.',
    bullets: [
      'Kính chúc Quý Thầy Cô Khoa Luật - Học viện Ngân hàng dồi dào sức khỏe, hạnh phúc và công tác tốt!',
      'Ban Nghiên Cứu Nhóm 2 — Lớp học phần 261LAW10A01 xin trân trọng cảm ơn sự theo dõi của Thầy Cô và các bạn!',
      'Trang web số hóa đề tài & Tài liệu trực tuyến: https://bao-ve-nha-dau-tu.vercel.app',
      'Nhóm xin sẵn sàng lắng nghe ý kiến đóng góp và trả lời các câu hỏi phản biện.',
    ],
    takeaways: [
      { label: 'Tác giả', text: 'Nhóm 2 · Lớp học phần 261LAW10A01 · Khoa Luật · Học viện Ngân hàng · Năm 2026' }
    ]
  }
];

import { BotanicalCornerFiligree } from '@/components/botanical-filigree';
import { ExternalLink } from 'lucide-react';

export function PresentationSlides() {
  const [viewMode, setViewMode] = useState<'canva' | 'academic'>('canva');
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [showThumbnails, setShowThumbnails] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const currentSlide = SLIDES_DATA[currentSlideIndex];

  const handleNext = useCallback(() => {
    if (soundEnabled) soundFx.playTap();
    setCurrentSlideIndex((prev) => (prev < SLIDES_DATA.length - 1 ? prev + 1 : 0));
  }, [soundEnabled]);

  const handlePrev = useCallback(() => {
    if (soundEnabled) soundFx.playTap();
    setCurrentSlideIndex((prev) => (prev > 0 ? prev - 1 : SLIDES_DATA.length - 1));
  }, [soundEnabled]);

  const handleToggleFullscreen = () => {
    if (soundEnabled) soundFx.playChime();
    setIsFullscreen(!isFullscreen);
  };

  const handleTogglePlay = () => {
    if (soundEnabled) soundFx.playTap();
    setIsPlaying(!isPlaying);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (viewMode !== 'academic') return;
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'f' || e.key === 'F') {
        setIsFullscreen((prev) => !prev);
      } else if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, isFullscreen, viewMode]);

  // Auto-play interval
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && viewMode === 'academic') {
      timer = setInterval(() => {
        handleNext();
      }, 7000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, handleNext, viewMode]);

  const slideContent = (
    <div
      ref={containerRef}
      className={`presentation-slide-deck relative flex flex-col justify-between overflow-hidden transition-all duration-300 ${
        isFullscreen
          ? 'fixed inset-0 z-50 bg-[#120F0D] text-white p-6 sm:p-12 w-screen h-screen'
          : 'w-full botanical-luxury-card rounded-3xl p-6 sm:p-8 min-h-[580px]'
      }`}
    >
      {/* Corner Botanical Flourishes */}
      {!isFullscreen && (
        <>
          <BotanicalCornerFiligree className="absolute top-2 left-2 rotate-0" size={54} />
          <BotanicalCornerFiligree className="absolute top-2 right-2 rotate-90" size={54} />
        </>
      )}

      {/* Top Header & Switcher Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#D4AF37]/40 pb-4 mb-6 relative z-10">
        <div className="flex flex-wrap items-center gap-3">
          {/* Switcher Tabs */}
          <div className="inline-flex p-1 rounded-2xl bg-[#FAF3EC] border border-[#D4AF37]/60 shadow-xs">
            <button
              onClick={() => {
                if (soundEnabled) soundFx.playTap();
                setViewMode('canva');
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-serif font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'canva'
                  ? 'bg-gradient-to-r from-[#8C2B0A] via-[#C2410C] to-[#D9531E] text-white shadow-sm'
                  : 'text-[#5A4638] hover:text-[#8C2B0A]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Slide Canva Mới 2026</span>
            </button>
            <button
              onClick={() => {
                if (soundEnabled) soundFx.playTap();
                setViewMode('academic');
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-serif font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'academic'
                  ? 'bg-gradient-to-r from-[#8C2B0A] via-[#C2410C] to-[#D9531E] text-white shadow-sm'
                  : 'text-[#5A4638] hover:text-[#8C2B0A]'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Bản Trình Chiếu 22 Slide Khoa Luật</span>
            </button>
          </div>

          {viewMode === 'academic' && (
            <span className="hidden sm:inline-block px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-[#8C2B0A] text-white shadow-sm">
              {currentSlide.badge}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {viewMode === 'canva' ? (
            <a
              href="https://www.canva.com/design/DAHWNtwdblg/Y45A3p9PZYakv0ZcDaNyvw/view"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => soundFx.playChime()}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#8C2B0A] via-[#C2410C] to-[#D9531E] text-white text-xs font-bold font-serif shadow-sm hover:scale-102 transition-transform"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Mở Canva Toàn Màn Hình</span>
            </a>
          ) : (
            <>
              <span className={`text-xs font-bold font-serif ${isFullscreen ? 'text-slate-400' : 'text-slate-500'}`}>
                Slide {currentSlide.id} / {SLIDES_DATA.length}
              </span>
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`p-2 rounded-xl border transition-all ${
                  soundEnabled
                    ? 'bg-orange-100/80 border-orange-300 text-orange-800'
                    : 'border-slate-200 text-slate-400'
                }`}
                title={soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>
              <button
                onClick={handleTogglePlay}
                className={`p-2 rounded-xl border transition-all ${
                  isPlaying
                    ? 'bg-orange-600 border-orange-600 text-white'
                    : 'border-orange-200 text-orange-800 hover:bg-orange-50'
                }`}
                title={isPlaying ? 'Dừng tự động chuyển' : 'Tự động chạy slide (7s)'}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
              <button
                onClick={handleToggleFullscreen}
                className="p-2 rounded-xl border border-orange-200 text-orange-800 hover:bg-orange-50 transition-all"
                title="Toàn màn hình (phím F)"
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Slide Body: Canva mode or Academic mode */}
      {viewMode === 'canva' ? (
        <div className="space-y-4 my-2 relative z-10">
          <div className="relative w-full pb-[56.25%] h-0 rounded-2xl overflow-hidden border-2 border-[#8C2B0A] shadow-2xl bg-[#1C130E] ring-1 ring-[#D4AF37]/50">
            <iframe
              loading="lazy"
              className="absolute top-0 left-0 w-full h-full border-0"
              src="https://www.canva.com/design/DAHWNtwdblg/Y45A3p9PZYakv0ZcDaNyvw/view?embed"
              allowFullScreen
              allow="fullscreen"
              title="Canva Presentation: Pháp luật bảo vệ nhà đầu tư cá nhân"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-gradient-to-r from-[#FFFDF9] via-[#FAF3EC] to-[#F5E6D8] border border-[#D4AF37]/50 text-xs font-serif">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#C2410C] animate-pulse" />
              <span className="font-bold text-[#1C130E] text-artistic-halo">
                Slide Báo Cáo Thiết Kế Trực Quan Canva — Nhóm 2 (261LAW10A01), Khoa Luật, Học viện Ngân hàng
              </span>
            </div>
            <a
              href="https://www.canva.com/design/DAHWNtwdblg/Y45A3p9PZYakv0ZcDaNyvw/view"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => soundFx.playChime()}
              className="inline-flex items-center gap-1.5 text-xs text-[#8C2B0A] hover:text-[#C2410C] font-bold underline"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Xem trực tiếp bản Canva nếu iframe không tải được</span>
            </a>
          </div>
        </div>
      ) : (
        <>
          {/* Main Slide Body */}
      <div className="flex-1 flex flex-col justify-center my-4">
        <div className="max-w-4xl mx-auto w-full">
          <div className="mb-2">
            <span className="text-xs uppercase font-serif tracking-widest text-amber-600 font-bold">
              {currentSlide.chapter}
            </span>
            <h3
              className={`text-2xl sm:text-4xl font-serif font-bold tracking-tight mt-1 leading-tight ${
                isFullscreen ? 'text-amber-100' : 'text-[#3E230E]'
              }`}
            >
              {currentSlide.title}
            </h3>
            <p className={`text-sm sm:text-base font-medium mt-2 italic ${isFullscreen ? 'text-slate-300' : 'text-slate-600'}`}>
              {currentSlide.subtitle}
            </p>
          </div>

          {/* Stats Bar if present */}
          {currentSlide.stats && (
            <div className="grid grid-cols-3 gap-4 my-6 p-4 rounded-2xl bg-orange-500/10 border border-orange-500/20">
              {currentSlide.stats.map((st, idx) => (
                <div key={idx} className="text-center">
                  <div className="text-2xl sm:text-4xl font-bold font-serif text-orange-600">{st.value}</div>
                  <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider mt-1">{st.label}</div>
                </div>
              ))}
            </div>
          )}

          {/* Bullet Points */}
          <div className="my-6 space-y-3.5">
            {currentSlide.bullets.map((b, i) => {
              const colonIndex = b.indexOf(':');
              const hasPrefix = colonIndex > 0 && colonIndex < 45;
              const prefix = hasPrefix ? b.substring(0, colonIndex + 1) : '';
              const rest = hasPrefix ? b.substring(colonIndex + 1) : b;

              return (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-orange-600 to-amber-500 mt-1.5 shrink-0 shadow-sm" />
                  <p className={`text-sm sm:text-base leading-relaxed ${isFullscreen ? 'text-zinc-200' : 'text-slate-800'}`}>
                    {hasPrefix ? (
                      <>
                        <strong className={`font-bold font-serif ${isFullscreen ? 'text-amber-300' : 'text-[#7C2D12]'}`}>
                          {prefix}{' '}
                        </strong>
                        <span className="font-serif">{rest.trim()}</span>
                      </>
                    ) : (
                      <span className="font-serif">{b}</span>
                    )}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Key Takeaways Box */}
          {currentSlide.takeaways && currentSlide.takeaways.length > 0 && (
            <div
              className={`p-4 rounded-2xl border transition-all ${
                isFullscreen
                  ? 'bg-amber-950/30 border-amber-500/30 text-amber-200'
                  : 'bg-amber-50/80 border-amber-200/90 text-amber-950'
              }`}
            >
              {currentSlide.takeaways.map((t, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm">
                  <Award className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-serif">{t.label}: </strong>
                    <span>{t.text}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Speaker Notes Toggle */}
      {showNotes && (
        <div
          className={`p-4 rounded-2xl border mb-4 text-xs sm:text-sm leading-relaxed ${
            isFullscreen ? 'bg-zinc-900 border-zinc-700 text-zinc-300' : 'bg-white border-orange-200 text-slate-700 shadow-sm'
          }`}
        >
          <div className="font-bold text-orange-600 uppercase text-[11px] mb-1 tracking-wider flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5" /> Lời Báo Cáo Thuyết Trình Viên:
          </div>
          {currentSlide.speakerNotes}
        </div>
      )}

      {/* Slide Navigation Bottom Bar */}
      <div className="flex items-center justify-between border-t border-orange-200/40 pt-4 mt-4">
        <button
          onClick={() => setShowNotes(!showNotes)}
          className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${
            showNotes
              ? 'bg-orange-600 text-white border-orange-600'
              : isFullscreen
              ? 'border-zinc-700 text-zinc-400 hover:text-zinc-200'
              : 'border-orange-200 text-orange-800 hover:bg-orange-50'
          }`}
        >
          {showNotes ? 'Ẩn lời thuyết trình' : 'Xem kịch bản thuyết trình'}
        </button>

        {/* Progress Dots */}
        <div className="hidden sm:flex items-center gap-1 max-w-md overflow-x-auto py-1 px-2">
          {SLIDES_DATA.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => {
                if (soundEnabled) soundFx.playTap();
                setCurrentSlideIndex(idx);
              }}
              className={`h-2 rounded-full transition-all ${
                idx === currentSlideIndex
                  ? 'w-6 bg-orange-600'
                  : 'w-2 bg-orange-300/40 hover:bg-orange-400'
              }`}
              title={`Slide ${idx + 1}: ${s.title}`}
            />
          ))}
        </div>

        {/* Next / Prev Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            className={`flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
              isFullscreen
                ? 'border-zinc-700 hover:bg-zinc-800 text-zinc-200'
                : 'border-orange-200 hover:bg-orange-50 text-slate-800'
            }`}
          >
            <ChevronLeft className="w-4 h-4" /> Trước
          </button>
          <button
            onClick={handleNext}
            className="flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-md hover:from-orange-500 hover:to-amber-500 transition-all cursor-pointer"
          >
            Tiếp <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
        </>
      )}
    </div>
  );

  return isFullscreen ? createPortal(slideContent, document.body) : slideContent;
}
