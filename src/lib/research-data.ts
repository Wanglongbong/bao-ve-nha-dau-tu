export interface TeamMember {
  id: string;
  name: string;
  role: string;
  slug: string;
  avatarUrl: string;
  studentId: string;
  assignedSections: string;
  pageTarget: string;
  deadline: string;
  status: 'completed' | 'in-progress' | 'review';
  evaluation: 'A' | 'B+' | 'B';
  evaluationNote: string;
  category: 'lead' | 'research' | 'tech' | 'presentation';
  tasks: string[];
  bio: string;
}

export interface LegalDocument {
  id: string;
  code: string;
  title: string;
  issueDate: string;
  effectiveDate: string;
  type: 'Luật' | 'Nghị định' | 'Thông tư' | 'Nghị quyết';
  signer: string;
  highlight: string;
  relevance: string;
}

export interface CaseStudy {
  id: string;
  title: string;
  entities: string[];
  violationType: 'Thao túng giá' | 'Vi phạm Công bố thông tin' | 'Lừa đảo phát hành trái phiếu' | 'Giao dịch nội gián';
  period: string;
  penalty: string;
  investorDamage: string;
  legalLesson: string;
  status: 'Đã xét xử' | 'Đã khởi tố / Xử phạt' | 'Đang xử lý';
}

export interface SurveillanceTier {
  tier: number;
  name: string;
  organization: string;
  role: string;
  mechanisms: string[];
  challenges: string;
  innovations: string;
}

export interface ResearchSection {
  id: string;
  order: string;
  title: string;
  author: string;
  pageCount: string;
  summary: string;
  keyPoints: string[];
  fullContentMarkdown?: string;
}

export const PROJECT_METADATA = {
  title: 'Pháp Luật Về Bảo Vệ Quyền Lợi Của Nhà Đầu Tư Cá Nhân Trên Thị Trường Chứng Khoán Việt Nam',
  subtitle: 'Bài Tập Lớn Học Phần Luật Chứng Khoán',
  institution: 'Khoa Luật - Học viện Ngân hàng',
  courseCode: '261LAW10A01',
  group: 'Nhóm 2',
  instructor: 'TS. Nguyễn Phương Thảo',
  program: 'Luật Kinh tế',
  year: '2026',
  estimatedPages: '~30 trang chuẩn học thuật',
  periodFocus: '2020 – 2026',
  legalBasis: 'Luật Chứng khoán 2019 (sửa đổi 2024), Nghị định 245/2025/NĐ-CP, Nghị định 155/2020/NĐ-CP',
  teamSize: '08 Thành viên',
};

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'member-1',
    name: 'Vũ Anh Quân',
    role: 'Nghiên cứu viên chính & Kỹ sư Web Portal',
    slug: 'vu-anh-quan',
    avatarUrl: '/team/vu-anh-quan.jpg',
    studentId: '26A4062552',
    assignedSections: 'Mở đầu + Chương 1; Tổng hợp Word, Xây dựng Web Portal',
    pageTarget: '~7 trang Word + Toàn bộ nền tảng Web số hóa',
    deadline: '22/9',
    status: 'completed',
    evaluation: 'A',
    evaluationNote: 'Top 30% đóng góp xuất sắc · Nghiên cứu & Xây dựng Web',
    category: 'tech',
    tasks: [
      'Nghiên cứu và soạn thảo Phần Mở đầu cùng Chương 1 (Những vấn đề lý luận về bảo vệ NĐT cá nhân)',
      'Tổng hợp, định dạng và hoàn thiện toàn văn báo cáo Word chuẩn học thuật Học viện Ngân hàng',
      'Thiết kế, xây dựng và lập trình toàn bộ nền tảng Web Portal tương tác theo phong cách Thịnh Vượng Remix',
      'Tích hợp ma trận tra cứu văn bản pháp luật, hồ sơ đại án, trình đọc toàn văn và trợ lý AI pháp lý',
    ],
    bio: 'Phụ trách nền tảng lý luận pháp luật khởi đầu, tổng hợp tài liệu Word hoàn chỉnh và kỹ sư phát triển toàn bộ hệ thống Web số hóa BTL.',
  },
  {
    id: 'member-2',
    name: 'Hoàng Thu Hiền',
    role: 'Nghiên cứu Thực trạng I (Công bố thông tin & Quản trị)',
    slug: 'hoang-thu-hien',
    avatarUrl: '/team/hoang-thu-hien.jpg',
    studentId: '26A4063370',
    assignedSections: 'Chương 2: Mục 2.1 (Công bố thông tin) & Mục 2.2 (Quản trị công ty đại chúng)',
    pageTarget: '~6 - 7 trang (Mục 2.1 + 2.2)',
    deadline: '22/9',
    status: 'completed',
    evaluation: 'B',
    evaluationNote: 'Nghiên cứu chuyên sâu nghĩa vụ CBTT và chuẩn mực quản trị công ty',
    category: 'research',
    tasks: [
      'Phân tích thực trạng nghĩa vụ công bố thông tin định kỳ, bất thường theo Thông tư 96/2020 và Thông tư 68/2024',
      'Đánh giá thực tiễn thực thi và các vấn đề đặt ra trong việc công bố thông tin của tổ chức phát hành',
      'Mổ xẻ cơ chế quản trị công ty đại chúng và bảo vệ quyền lợi cổ đông thiểu số theo Nghị định 245/2025/NĐ-CP',
      'Minh họa thực tiễn qua một số doanh nghiệp niêm yết trên HOSE và HNX',
    ],
    bio: 'Phân tích thực trạng minh bạch thông tin thị trường, chuẩn mực song ngữ Anh - Việt và nguyên tắc quản trị bảo vệ cổ đông nhỏ lẻ.',
  },
  {
    id: 'member-3',
    name: 'Ngô Quang Trường',
    role: 'Nghiên cứu Thực trạng II (Chế tài & Giám sát Thị trường)',
    slug: 'ngo-quang-truong',
    avatarUrl: '/team/ngo-quang-truong.jpg',
    studentId: '26A4060754',
    assignedSections: 'Chương 2: Mục 2.3 (Chế tài xử lý), Mục 2.4 (Khiếu nại tố cáo) & Mục 2.5 (Giám sát 3 cấp)',
    pageTarget: '~8 trang (Mục 2.3, 2.4, 2.5)',
    deadline: '22/9',
    status: 'completed',
    evaluation: 'B',
    evaluationNote: 'Khối lượng nghiên cứu lớn · Tổng hợp 2.731 quyết định xử phạt',
    category: 'research',
    tasks: [
      'Khung pháp lý về chế tài xử phạt trên TTCK (hành chính theo NĐ 156/2020 và hình sự theo Điều 209, 211 BLHS)',
      'Thực tiễn áp dụng chế tài hình sự qua các vụ án điển hình: FLC, Louis Holdings, Tân Hoàng Minh',
      'Cơ chế tiếp nhận, xử lý hơn 1.000 đơn thư khiếu nại, tố cáo và các phương thức giải quyết tranh chấp theo Điều 133 Luật CK',
      'Hệ thống giám sát thị trường 3 cấp (CTCK - SGDCK - UBCKNN) và ứng dụng công nghệ cảnh báo sớm',
    ],
    bio: 'Đánh giá chuyên sâu hệ thống chế tài xử lý vi phạm pháp luật chứng khoán, thực tiễn giải quyết khiếu nại và cơ chế giám sát đa tầng.',
  },
  {
    id: 'member-4',
    name: 'Bùi Minh Khuê',
    role: 'Nghiên cứu Bất cập Thể chế & Thực tiễn',
    slug: 'bui-minh-khue',
    avatarUrl: '/team/bui-minh-khue.jpg',
    studentId: '26A4063390',
    assignedSections: 'Chương 3: Những bất cập còn tồn tại trên thực tế (Mục 3.1 - 3.4)',
    pageTarget: '~6 - 7 trang (Toàn bộ Chương 3)',
    deadline: '24/9',
    status: 'completed',
    evaluation: 'B',
    evaluationNote: 'Mổ xẻ 4 trụ cột hạn chế sâu sắc & Phân tích thực tế',
    category: 'research',
    tasks: [
      'Phân tích bất cập về thể chế: thiếu quy định định lượng cụ thể về trách nhiệm của các chủ thể trung gian (CTCK, kiểm toán)',
      'Đánh giá những lỗ hổng trong thực thi pháp luật và rào cản tố tụng dân sự đòi bồi thường thiệt hại',
      'Mổ xẻ bất cập về nhận thức, kiến thức tài chính và tâm lý đám đông (FOMO) của nhà đầu tư cá nhân',
      'Phân tích sự phối hợp chưa đồng bộ giữa UBCKNN, Cơ quan điều tra và Tòa án trong xử lý vi phạm',
    ],
    bio: 'Phát hiện và chứng minh các điểm nghẽn thể chế, bất cập trong thực thi và những cạm bẫy tâm lý đe dọa tài sản nhà đầu tư nhỏ lẻ.',
  },
  {
    id: 'member-5',
    name: 'Lê Đức Minh',
    role: 'Nhóm trưởng & Thẩm định Đề cương',
    slug: 'le-duc-minh',
    avatarUrl: '/team/le-duc-minh.jpg',
    studentId: '25A4021470',
    assignedSections: 'Lập dàn ý đề cương; Nhận xét nội dung bài làm; Phụ trách Chương 4 (Kiến nghị hoàn thiện)',
    pageTarget: '~6 trang (Chương 4) + Thẩm định tổng thể bài làm',
    deadline: '25/9',
    status: 'completed',
    evaluation: 'A',
    evaluationNote: 'Trưởng nhóm xuất sắc · Điều phối, Lập dàn ý & Thẩm định chất lượng',
    category: 'lead',
    tasks: [
      'Lập dàn ý chi tiết toàn bộ đề cương nghiên cứu bài tập lớn môn Luật Chứng khoán',
      'Kiểm tra, thẩm định thông tin dàn ý và rà soát logic lập luận của toàn bài',
      'Chỉnh sửa, hoàn thiện phần bài làm của các thành viên trong nhóm để đạt chất lượng học thuật cao nhất',
      'Phụ trách nghiên cứu và biên soạn toàn bộ Chương 4: Kiến nghị hoàn thiện thể chế và nâng cao hiệu quả thực thi',
    ],
    bio: 'Nhóm trưởng điều phối, chịu trách nhiệm cao nhất về cấu trúc học thuật, tiến độ giao nộp và tính chuẩn xác của các luận điểm pháp lý.',
  },
  {
    id: 'member-6',
    name: 'Tạ Thị Thu Hoài',
    role: 'Nghiên cứu Kết luận & Nhận xét Nội dung',
    slug: 'ta-thi-thu-hoai',
    avatarUrl: '/team/ta-thi-thu-hoai.jpg',
    studentId: '26A4063376',
    assignedSections: 'Chương 5 (Kết luận), Nhận xét nội dung bài làm & Thư mục tài liệu tham khảo',
    pageTarget: '~4 trang (Kết luận + Danh mục TLTK)',
    deadline: '25/9',
    status: 'completed',
    evaluation: 'B',
    evaluationNote: 'Tổng kết giá trị đề tài & Đối soát danh mục trích dẫn chuẩn mực',
    category: 'research',
    tasks: [
      'Tổng kết toàn diện các kết luận then chốt về bảo vệ quyền lợi nhà đầu tư cá nhân trên TTCK Việt Nam',
      'Tham gia nhận xét, rà soát tính khả thi và đồng bộ của các kiến nghị hoàn thiện pháp luật',
      'Xây dựng và đối soát danh mục tài liệu tham khảo pháp lý theo đúng quy chuẩn trích dẫn khoa học',
    ],
    bio: 'Đúc kết giá trị nghiên cứu đề tài, kiểm chứng tính khả thi của các đề xuất cải cách và bảo đảm tính hàn lâm của hệ thống tài liệu trích dẫn.',
  },
  {
    id: 'member-7',
    name: 'Đinh Thị Minh Hoà',
    role: 'Thiết Kế Slides & Thuyết Trình Báo Cáo',
    slug: 'dinh-thi-minh-hoa',
    avatarUrl: '/team/dinh-thi-minh-hoa.jpg',
    studentId: '26A4063375',
    assignedSections: 'Làm Slide thuyết trình 30+ slide + Thuyết trình báo cáo Hội đồng',
    pageTarget: 'Bộ Slide 30+ trang trình chiếu chuẩn mực + Kịch bản thuyết trình',
    deadline: '26/9',
    status: 'completed',
    evaluation: 'B',
    evaluationNote: 'Thiết kế slide trực quan và thuyết trình mạch lạc, tự tin',
    category: 'presentation',
    tasks: [
      'Cùng Trần Sỹ Long thiết kế và hoàn thiện bộ Slide trình chiếu báo cáo đề tài 30+ slide chuẩn học thuật',
      'Đại diện nhóm thuyết trình chính kết quả nghiên cứu trước Hội đồng giảng viên Khoa Luật - Học viện Ngân hàng',
      'Trực quan hóa sơ đồ giám sát 3 cấp, biểu đồ xử phạt và các vụ án điểm trên slide',
    ],
    bio: 'Thuyết trình viên đại diện nhóm báo cáo, sở hữu kỹ năng trình bày truyền cảm, rõ ràng cùng khả năng trực quan hóa bài thuyết trình xuất sắc.',
  },
  {
    id: 'member-8',
    name: 'Trần Sỹ Long',
    role: 'Thiết Kế Slides & Thuyết Trình Báo Cáo',
    slug: 'tran-sy-long',
    avatarUrl: '/team/tran-sy-long.jpg',
    studentId: '26A4060305',
    assignedSections: 'Làm Slide thuyết trình 30+ slide + Thuyết trình báo cáo Hội đồng',
    pageTarget: 'Bộ Slide 30+ trang trình chiếu chuẩn mực + Kịch bản phản biện',
    deadline: '26/9',
    status: 'completed',
    evaluation: 'B',
    evaluationNote: 'Thiết kế slide trực quan và hỗ trợ thuyết trình phản biện sắc sảo',
    category: 'presentation',
    tasks: [
      'Cùng Đinh Thị Minh Hoà thiết kế, dàn trang và biên tập bộ Slide báo cáo trực quan 30+ slide',
      'Đại diện nhóm thuyết trình các phần trọng tâm và chuẩn bị kịch bản phản biện trả lời câu hỏi của giảng viên',
      'Thiết kế đồ họa các infographics phân tích vụ án FLC, Tân Hoàng Minh, Louis Holdings',
    ],
    bio: 'Phụ trách thiết kế slide và thuyết trình báo cáo, chuyển hóa các thuật ngữ pháp lý phức tạp thành sơ đồ trực quan dễ hiểu và sinh động.',
  },
];

export const LEGAL_FRAMEWORK: LegalDocument[] = [
  {
    id: 'law-2019',
    code: 'Luật số 54/2019/QH14',
    title: 'Luật Chứng khoán năm 2019',
    issueDate: '26/11/2019',
    effectiveDate: '01/01/2021',
    type: 'Luật',
    signer: 'Quốc hội khóa XIV',
    highlight: 'Thiết lập nguyên tắc cốt lõi: Tôn trọng quyền sở hữu, công bằng, công khai, minh bạch; bảo vệ quyền và lợi ích hợp pháp của mọi nhà đầu tư.',
    relevance: 'Khung pháp lý nền tảng điều chỉnh toàn diện tổ chức, hoạt động chào bán, giao dịch và giám sát trên thị trường chứng khoán Việt Nam.',
  },
  {
    id: 'law-2024',
    code: 'Luật số 56/2024/QH15',
    title: 'Luật sửa đổi, bổ sung một số điều của Luật Chứng khoán và các luật kinh tế',
    issueDate: '29/11/2024',
    effectiveDate: '01/01/2025',
    type: 'Luật',
    signer: 'Quốc hội khóa XV',
    highlight: 'Siết chặt điều kiện chào bán chứng khoán ra công chúng, nâng cao trách nhiệm của người đại diện theo pháp luật và đơn vị kiểm toán.',
    relevance: 'Trực tiếp bít các lỗ hổng phát hành cổ phiếu "ma", tăng cường hàng rào bảo vệ nhà đầu tư cá nhân trước các đợt phát hành rủi ro cao.',
  },
  {
    id: 'nd-155',
    code: 'Nghị định 155/2020/NĐ-CP',
    title: 'Quy định chi tiết thi hành một số điều của Luật Chứng khoán',
    issueDate: '31/12/2020',
    effectiveDate: '01/01/2021',
    type: 'Nghị định',
    signer: 'Chính phủ',
    highlight: 'Quy định chi tiết điều kiện chào bán, niêm yết, công ty đại chúng, tổ chức thị trường giao dịch và đại diện người sở hữu chứng khoán.',
    relevance: 'Quy định cơ chế bảo đảm quyền biểu quyết, tham dự ĐHĐCĐ và quyền tiếp cận thông tin của cổ đông nhỏ lẻ.',
  },
  {
    id: 'nd-245',
    code: 'Nghị định 245/2025/NĐ-CP',
    title: 'Sửa đổi, bổ sung Nghị định 155/2020/NĐ-CP về quản trị công ty đại chúng',
    issueDate: '15/01/2025',
    effectiveDate: '01/03/2025',
    type: 'Nghị định',
    signer: 'Chính phủ',
    highlight: 'Tăng cường tiêu chuẩn độc lập của thành viên HĐQT, siết chặt giao dịch với bên có liên quan, kiểm soát chuyển giá và rút ruột vốn.',
    relevance: 'Tạo công cụ phòng ngừa hữu hiệu xung đột lợi ích giữa nhóm cổ đông chi phối và nhà đầu tư cá nhân thiểu số.',
  },
  {
    id: 'tt-68',
    code: 'Thông tư 68/2024/TT-BTC',
    title: 'Sửa đổi các thông tư về giao dịch chứng khoán và công bố thông tin',
    issueDate: '18/09/2024',
    effectiveDate: '02/11/2024',
    type: 'Thông tư',
    signer: 'Bộ Tài chính',
    highlight: 'Quy định lộ trình bắt buộc công bố thông tin song ngữ Việt - Anh đối với công ty đại chúng quy mô lớn, tạo tiền đề nâng hạng thị trường.',
    relevance: 'Bảo đảm quyền bình đẳng tiếp cận thông tin chuẩn hóa giữa nhà đầu tư cá nhân trong nước và nhà đầu tư quốc tế.',
  },
  {
    id: 'tt-08',
    code: 'Thông tư 08/2026/TT-BTC',
    title: 'Quy định về hệ thống giao dịch công nghệ mới và cơ chế giám sát rủi ro',
    issueDate: '10/02/2026',
    effectiveDate: '01/04/2026',
    type: 'Thông tư',
    signer: 'Bộ Tài chính',
    highlight: 'Tích hợp kết nối dữ liệu giám sát thời gian thực, quản lý giao dịch ký quỹ (margin) tự động và cơ chế cảnh báo sớm thao túng thị trường.',
    relevance: 'Nâng cấp năng lực bảo vệ kỹ thuật số cho tài khoản của nhà đầu tư cá nhân trước các thủ thuật nghẽn lệnh hoặc xả hàng.',
  },
];

export const SURVEILLANCE_SYSTEM: SurveillanceTier[] = [
  {
    tier: 1,
    name: 'Tuyến Giám Sát Đầu Tiên',
    organization: 'Các Công ty Chứng khoán (CTCK)',
    role: 'Giám sát trực tiếp tại nguồn phát sinh lệnh',
    mechanisms: [
      'Kiểm soát tính hợp lệ của tài khoản giao dịch, danh tính khách hàng (eKYC).',
      'Giám sát tỷ lệ ký quỹ, hạn mức margin và ngăn chặn đặt lệnh vượt sức mua.',
      'Phát hiện sớm các tài khoản cùng IP, cùng chủ sở hữu đặt lệnh đối ứng hoặc quay tay thanh khoản ảo.',
    ],
    challenges: 'Xung đột lợi ích khi CTCK vừa muốn tăng doanh số phí giao dịch vừa phải gác cổng kiểm soát rủi ro cho khách hàng.',
    innovations: 'Triển khai thuật toán chấm điểm rủi ro tài khoản tự động trước khi đẩy lệnh vào hệ thống sở.',
  },
  {
    tier: 2,
    name: 'Tuyến Giám Sát Thị Trường',
    organization: 'Sở Giao Dịch Chứng Khoán (HoSE / HNX / VNX)',
    role: 'Giám sát diễn biến phiên giao dịch và biến động giá theo thời gian thực',
    mechanisms: [
      'Hệ thống phần mềm giám sát cảnh báo tự động các mã tăng/giảm kịch trần nhiều phiên bất thường.',
      'Theo dõi chỉ số tập trung lệnh, tỷ trọng khớp lệnh giữa các nhóm tài khoản liên quan.',
      'Yêu cầu doanh nghiệp giải trình bắt buộc khi cổ phiếu biến động bất thường từ 5 phiên liên tiếp.',
    ],
    challenges: 'Hệ thống hạ tầng công nghệ đôi lúc chưa bắt kịp tốc độ giao dịch thuật toán (Algo-trading) và các tài khoản mượn danh ngụy trang tinh vi.',
    innovations: 'Hệ thống KRX/CNTT mới phân tích dữ liệu tick-by-tick nhận diện dòng tiền bất thường tức thì.',
  },
  {
    tier: 3,
    name: 'Tuyến Giám Sát Tối Cao & Chế Tài',
    organization: 'Ủy Ban Chứng Khoán Nhà Nước (UBCKNN)',
    role: 'Thanh tra, xử lý vi phạm hành chính và chuyển giao cơ quan điều tra hình sự',
    mechanisms: [
      'Tiến hành thanh tra định kỳ và đột xuất các công ty đại chúng, công ty chứng khoán, công ty kiểm toán.',
      'Ban hành quyết định xử phạt vi phạm hành chính (hơn 2.731 quyết định giai đoạn 2020–2025).',
      'Phối hợp với Cục An ninh mạng & Phòng chống tội phạm công nghệ cao (A05) và C03 (Bộ Công an).',
    ],
    challenges: 'Quy trình xử lý hành chính qua nhiều bước; mức phạt tiền còn thấp so với số tiền thao túng trục lợi hàng trăm, hàng nghìn tỷ đồng.',
    innovations: 'Chuyển đổi số toàn diện theo Nghị quyết 57-NQ/TW, kết nối cơ sở dữ liệu quốc gia về dân cư với tài khoản chứng khoán.',
  },
];

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'case-flc',
    title: 'Đại án thao túng thị trường chứng khoán tại Tập đoàn FLC (Mã: ROS, FLC, ART, HAI...)',
    entities: ['Trịnh Văn Quyết', 'Tập đoàn FLC', 'Công ty CP Chứng khoán BOS'],
    violationType: 'Thao túng giá',
    period: '2017 – 2022',
    penalty: 'Xử lý hình sự, tuyên án phạt tù nghiêm khắc, tịch thu tài sản thu lợi bất chính',
    investorDamage: 'Hàng chục nghìn nhà đầu tư cá nhân bị thua lỗ nặng nề, "cháy tài khoản" khi cổ phiếu bị hủy niêm yết',
    legalLesson: 'Lỗ hổng từ việc tăng vốn ảo (vốn điều lệ ROS tăng khống từ 1,5 tỷ lên 4.300 tỷ) và việc mượn hàng trăm tài khoản để tạo cung cầu giả tạo. Đòi hỏi siết chặt thẩm định vốn tại Luật sửa đổi 2024.',
    status: 'Đã xét xử',
  },
  {
    id: 'case-tan-hoang-minh',
    title: 'Đại án phát hành trái phiếu riêng lẻ lừa đảo chiếm đoạt tài sản tại Tập đoàn Tân Hoàng Minh',
    entities: ['Đỗ Anh Dũng', 'Tập đoàn Tân Hoàng Minh', 'Các công ty thành viên'],
    violationType: 'Lừa đảo phát hành trái phiếu',
    period: '2021 – 2022',
    penalty: 'Khởi tố hình sự, thu hồi hơn 8.600 tỷ đồng khắc phục hậu quả hoàn trả nhà đầu tư',
    investorDamage: 'Hơn 6.600 nhà đầu tư cá nhân bị lừa mua các gói trái phiếu thứ cấp không có tài sản bảo đảm chuẩn',
    legalLesson: 'Sự thiếu trách nhiệm nghiêm trọng của các tổ chức kiểm toán độc lập, công ty thẩm định giá và tổ chức đại lý phát hành. Đặt ra yêu cầu tăng mạnh trách nhiệm của chủ thể trung gian.',
    status: 'Đã xét xử',
  },
  {
    id: 'case-louis',
    title: 'Vụ án thao túng giá nhóm cổ phiếu "họ Louis" (BII, TGG...)',
    entities: ['Đỗ Thành Nhân', 'Louis Holdings', 'Chứng khoán Trí Việt'],
    violationType: 'Thao túng giá',
    period: '2020 – 2021',
    penalty: 'Phạt tù hình sự các bị cáo, cấm đảm nhiệm chức vụ quản lý',
    investorDamage: 'Nhiều NĐT cá nhân FOMO đu đỉnh khi cổ phiếu bị thổi giá phi mã từ vài nghìn đồng lên gần 80.000đ/cp rồi mất thanh khoản',
    legalLesson: 'Sự tiếp tay của CTCK (cấp margin trái luật, thông đồng tạo thanh khoản). Cần nâng cao đạo đức nghề nghiệp và thu hồi giấy phép hành nghề CTCK vi phạm.',
    status: 'Đã xét xử',
  },
  {
    id: 'case-thuan-minh',
    title: 'Vi phạm nghĩa vụ công bố thông tin tại Công ty CP Mua bán nợ Thuận Minh',
    entities: ['Công ty CP Mua bán nợ Thuận Minh'],
    violationType: 'Vi phạm Công bố thông tin',
    period: '2024',
    penalty: 'UBCKNN xử phạt vi phạm hành chính 92,5 triệu đồng',
    investorDamage: 'NĐT cá nhân không nắm được tình hình tài chính thực tế và rủi ro chậm trả nợ',
    legalLesson: 'Chậm công bố nhiều tài liệu từ 10 ngày làm việc trở lên. Mức phạt hành chính vài chục triệu còn quá thấp, chưa đủ sức răn đe các tổ chức phát hành chậm trễ.',
    status: 'Đã khởi tố / Xử phạt',
  },
  {
    id: 'case-dat-xanh',
    title: 'Chậm trễ / Không công bố BCTC năm 2024 tại Đất Xanh Miền Bắc',
    entities: ['Công ty CP Bất động sản Đất Xanh Miền Bắc'],
    violationType: 'Vi phạm Công bố thông tin',
    period: '2024 – 2025',
    penalty: 'Xử phạt hành chính và nhắc nhở công khai trên cổng thông tin UBCKNN',
    investorDamage: 'Bất cân xứng thông tin trầm trọng, NĐT nắm giữ trái phiếu và cổ phần hoang mang về dòng tiền doanh nghiệp',
    legalLesson: 'Cần có chế tài bổ sung: tạm ngừng giao dịch cổ phiếu hoặc đình chỉ tư cách công ty đại chúng nếu cố tình chây ì nghĩa vụ minh bạch thông tin.',
    status: 'Đã khởi tố / Xử phạt',
  },
  {
    id: 'case-asa',
    title: 'Vụ án lừa đảo phát hành khống 7 triệu cổ phiếu ASA',
    entities: ['Nguyễn Văn Nam', 'Công ty CP Liên doanh SANA Hà Nội (ASA)'],
    violationType: 'Thao túng giá',
    period: '2022',
    penalty: 'Khởi tố vụ án hình sự lừa đảo chiếm đoạt tài sản',
    investorDamage: 'Cổ phiếu bị hủy giao dịch khẩn cấp, vốn liếng của cổ đông cá nhân bị đóng băng',
    legalLesson: 'Báo động đỏ về công tác hậu kiểm sau khi doanh nghiệp trở thành công ty đại chúng. Cần cơ chế bảo vệ khẩn cấp cho cổ đông bên thứ ba ngay tình.',
    status: 'Đã xét xử',
  },
];

export const CORE_PAIN_POINTS = [
  {
    title: 'Bất Cập Thể Chế Pháp Luật',
    subtitle: 'Lỗ hổng trong quy định và chế tài',
    icon: 'ShieldAlert',
    points: [
      'Thiếu quy định cụ thể về trách nhiệm liên đới của tổ chức trung gian (kiểm toán, thẩm định giá, bảo lãnh phát hành) khi xác nhận số liệu sai lệch.',
      'Mức phạt tiền hành chính tối đa (3 tỷ đồng đối với tổ chức) còn quá thấp so với số tiền hàng chục, hàng trăm tỷ đồng thu lợi từ thao túng giá.',
      'Thiếu hoàn toàn cơ chế khởi kiện tập thể (Class Action), khiến nhà đầu tư nhỏ lẻ không đủ chi phí và thời gian tự mình khởi kiện đòi bồi thường.',
      'Tiêu chí xác định NĐT chuyên nghiệp chưa thực chất, dễ bị lách qua các chứng chỉ hoặc tài sản danh nghĩa.',
    ],
  },
  {
    title: 'Bất Cập Trong Thực Thi Pháp Luật',
    subtitle: 'Thủ đoạn tinh vi và hạn chế nguồn lực',
    icon: 'Scale',
    points: [
      'Tình trạng chậm công bố, công bố thông tin sai lệch diễn ra phổ biến ở các công ty đại chúng chưa niêm yết.',
      'Thao túng thị trường ứng dụng công nghệ tinh vi, giao dịch thuật toán phân tán qua hàng trăm tài khoản mượn danh.',
      'Sự xuất hiện của các hội nhóm "phím hàng" kín trên MXH (Zalo, Telegram) ứng dụng AI lừa đảo, tư vấn đầu tư trái phép mà chưa có cơ chế xử lý xuyên biên giới.',
      'Nhiều vụ án "không xác định được khoản thu trái pháp luật" của đối tượng cầm đầu nhưng vẫn gây thiệt hại nặng nề cho nhà đầu tư nhỏ lẻ.',
    ],
  },
  {
    title: 'Nhận Thức & Năng Lực Của NĐT Cá Nhân',
    subtitle: 'Tâm lý đám đông và thiếu hụt kiến thức',
    icon: 'UserCheck',
    points: [
      'NĐT cá nhân chiếm hơn 90% thanh khoản thị trường nhưng phần lớn thiếu kiến thức pháp lý và phân tích tài chính căn bản.',
      'Tâm lý "FOMO" (sợ bỏ lỡ), ham làm giàu nhanh, dễ dàng tin theo các "chuyên gia mạng" và "đội lái".',
      'Nhận thức về quyền của cổ đông và quy trình gửi đơn khiếu nại, tố cáo còn rất hạn chế; thường chấp nhận chịu thiệt thay vì đấu tranh pháp lý.',
      'Công tác giáo dục tài chính cộng đồng của cơ quan quản lý chưa tiếp cận sâu rộng tới tầng lớp NĐT trẻ (F0).',
    ],
  },
  {
    title: 'Phối Hợp Giữa Các Cơ Quan Quản Lý',
    subtitle: 'Nút thắt liên thông dữ liệu liên ngành',
    icon: 'Network',
    points: [
      'Hệ thống kết nối và chia sẻ dữ liệu giữa UBCKNN, Sở Giao dịch, VSDC và Cơ quan Công an còn phân tán, chưa đạt chuẩn thời gian thực.',
      'Thời gian xác minh tài khoản ngân hàng và truy vết dòng tiền giao dịch chứng khoán còn kéo dài qua nhiều thủ tục hành chính.',
      'Chuyển đổi số thị trường chứng khoán còn chậm so với tốc độ bùng nổ của quy mô tài khoản giao dịch mới.',
    ],
  },
];

export const STRATEGIC_PROPOSALS = [
  {
    order: '01',
    title: 'Thiết Lập Cơ Chế Khởi Kiện Tập Thể (Class Action)',
    description: 'Nghiên cứu áp dụng mô hình đại diện khởi kiện tập thể như tại Hoa Kỳ, cho phép một nhóm NĐT hoặc một tổ chức bảo vệ NĐT thay mặt toàn bộ các cá nhân bị thiệt hại kiện đòi bồi thường.',
    impact: 'Tiết kiệm chi phí tố tụng, tạo áp lực pháp lý cực lớn lên các đối tượng thao túng và doanh nghiệp gian dối.',
    badge: 'Đột phá Thể chế',
  },
  {
    order: '02',
    title: 'Thành Lập Quỹ Bảo Vệ Nhà Đầu Tư (Investor Protection Fund)',
    description: 'Trích từ nguồn tiền phạt vi phạm hành chính chứng khoán và đóng góp của các CTCK để hỗ trợ ứng trước hoặc bồi thường thiệt hại cho NĐT cá nhân khi tổ chức phát hành vỡ nợ hoặc bị thao túng.',
    impact: 'Cung cấp tấm lưới an sinh tài chính tức thời, giảm thiểu tổn thương cho NĐT nhỏ lẻ.',
    badge: 'Cơ chế Bồi thường',
  },
  {
    order: '03',
    title: 'Siết Chặt Trách Nhiệm Đơn Vị Trung Gian',
    description: 'Quy định rõ trách nhiệm bồi thường liên đới của tổ chức kiểm toán độc lập, công ty thẩm định giá và tổ chức tư vấn khi xác nhận các báo cáo tài chính sai lệch nghiêm trọng.',
    impact: 'Buộc các tổ chức kiểm toán và thẩm định phải cẩn trọng tối đa, chấm dứt tình trạng "ký bừa" trục lợi.',
    badge: 'Minh bạch Thông tin',
  },
  {
    order: '04',
    title: 'Ứng Dụng AI & Big Data Giám Sát Theo NQ 57-NQ/TW',
    description: 'Triển khai mô hình máy học phân tích hành vi đặt/hủy lệnh theo thời gian thực, liên thông dữ liệu VSDC - CTCK - Tài khoản ngân hàng để phát hiện ngay dòng tiền thao túng.',
    impact: 'Phát hiện và ngăn chặn vi phạm từ trong trứng nước, không để xảy ra hậu quả nghiêm trọng rồi mới khởi tố.',
    badge: 'Công nghệ Giám sát',
  },
  {
    order: '05',
    title: 'Chuẩn Hóa Tiêu Chí NĐT Chuyên Nghiệp & Xử Lý Room Mạng Xã Hội',
    description: 'Siết chặt điều kiện xác định NĐT chứng khoán chuyên nghiệp bằng năng lực tài chính thực chất; phối hợp với Bộ Thông tin & Truyền thông xử lý hình sự các nhóm tư vấn "phím hàng" trái phép.',
    impact: 'Làm sạch không gian mạng, bảo vệ NĐT cá nhân khỏi bẫy lừa đảo công nghệ cao.',
    badge: 'Thực thi Pháp luật',
  },
];
