import React, { useCallback, useEffect, useState } from 'react';
import {
  Newspaper,
  TrendingUp,
  AlertTriangle,
  Scale,
  ShieldCheck,
  Clock,
  Eye,
  Search,
  ExternalLink,
  ChevronRight,
  Flame,
  X,
  Share2,
  Bookmark,
  Sparkles,
  Send,
  Loader2,
  Copy,
  Check,
  FileText,
  RotateCw,
} from 'lucide-react';
import { soundFx } from '@/lib/audio-effects';
import { askAboutNewsArticle } from '@/lib/gemini-client';
import { AiRichText } from '@/components/ai-rich-text';
import { getAccessToken, isSupabaseConfigured, supabase } from '@/lib/supabase';
import {
  BotanicalCornerFiligree,
  BotanicalVineDivider,
  BotanicalCardCorners,
  BotanicalHeaderCrest,
  BotanicalWatermark,
} from '@/components/botanical-filigree';
import {
  NotebookCardCorners,
  NotebookRibbonDivider,
} from '@/components/notebook-corner-guard';

interface NewsItem {
  id: string;
  category: 'chinh-sach' | 'dai-an' | 'canh-bao' | 'thi-truong';
  categoryLabel: string;
  badgeColor: string;
  title: string;
  summary: string;
  time: string;
  readTime: string;
  views: string;
  source: string;
  imageUrl: string;
  hot?: boolean;
  content: string[];
  legalReference: string;
  investorAdvice: string;
  quickQuestions: string[];
  sourceUrl?: string;
  isFallback?: boolean;
}

interface NewsRow {
  id: string;
  title: string;
  summary: string;
  category: 'chinh-sach' | 'xu-phat' | 'canh-bao' | 'thi-truong';
  source_name: string;
  source_url: string;
  published_at: string;
  legal_references: string[];
  investor_takeaway: string;
  image_url: string | null;
}

interface SyncRun {
  finished_at: string | null;
  accepted_count: number;
}

const CATEGORY_STYLE: Record<NewsRow['category'], { category: NewsItem['category']; label: string; badgeColor: string }> = {
  'chinh-sach': { category: 'chinh-sach', label: 'Chính Sách & Luật Mới', badgeColor: 'bg-[#8C2B0A] text-white' },
  'xu-phat': { category: 'dai-an', label: 'Đại Án & Xử Phạt', badgeColor: 'bg-rose-800 text-white' },
  'canh-bao': { category: 'canh-bao', label: 'Cảnh Báo NĐT', badgeColor: 'bg-amber-800 text-white' },
  'thi-truong': { category: 'thi-truong', label: 'Thị Trường CafeF', badgeColor: 'bg-emerald-800 text-white' },
};

function formatVietnamTime(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('vi-VN', {
    timeZone: 'Asia/Ho_Chi_Minh',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date).replace(',', ' •');
}

function mapNewsRow(row: NewsRow, index: number): NewsItem {
  const style = CATEGORY_STYLE[row.category] || CATEGORY_STYLE['thi-truong'];
  return {
    id: row.id,
    category: style.category,
    categoryLabel: style.label,
    badgeColor: style.badgeColor,
    title: row.title,
    summary: row.summary,
    time: formatVietnamTime(row.published_at),
    readTime: 'Tóm tắt nguồn',
    views: '',
    source: row.source_name,
    sourceUrl: row.source_url,
    imageUrl: row.image_url || '/guardian-lion-crest.jpg',
    hot: index === 0,
    content: [],
    legalReference: row.legal_references.length
      ? row.legal_references.join('; ')
      : 'Nguồn CafeF — cần đối chiếu bài gốc và nguồn chính thức',
    investorAdvice: row.investor_takeaway,
    quickQuestions: [
      'Tin này ảnh hưởng thế nào đến nhà đầu tư cá nhân?',
      'Thông tin nào trong bài cần kiểm chứng thêm từ nguồn chính thức?',
      'Nhà đầu tư nên lưu ý rủi ro pháp lý hoặc tài chính nào?',
    ],
  };
}

const INITIAL_NEWS_DATA: NewsItem[] = [
  {
    id: 'nd245-2025',
    category: 'chinh-sach',
    categoryLabel: 'Chính Sách Mới',
    badgeColor: 'bg-[#8C2B0A] text-white',
    title: 'Chính thức ban hành Nghị định 245/2025/NĐ-CP: Bước ngoặt bảo vệ cổ đông thiểu số và kiểm soát giao dịch nội bộ',
    summary: 'Chính phủ siết chặt nghĩa vụ công bố thông tin tức thời, quy định thành viên độc lập HĐQT và tăng quyền biểu quyết điện tử cho nhà đầu tư cá nhân tại các công ty đại chúng quy mô lớn.',
    time: '29/09/2026 • 08:30 (Mới cập nhật)',
    readTime: '5 phút đọc',
    views: '2.8K',
    source: 'Cổng Thông tin Điện tử Chính phủ / UBCKNN',
    imageUrl: '/guardian-lion-crest.jpg',
    hot: true,
    legalReference: 'Nghị định 245/2025/NĐ-CP & Luật Chứng khoán 2019 (sửa đổi 2024)',
    investorAdvice: 'Nhà đầu tư cá nhân sở hữu từ 1% cổ phần đã có thể tiếp cận danh sách cổ đông và kiến nghị đưa vấn đề vào chương trình Đại hội đồng Cổ đông thường niên.',
    quickQuestions: [
      'Nghị định 245/2025/NĐ-CP trao thêm những quyền biểu quyết nào cho cổ đông cá nhân?',
      'Làm thế nào để nhà đầu tư nhỏ lẻ kiểm tra giao dịch của người có liên quan?',
      'Quy định về thành viên độc lập HĐQT bảo vệ NĐT trước việc rút ruột công ty ra sao?',
    ],
    content: [
      'Nghị định số 245/2025/NĐ-CP của Chính phủ đánh dấu bước tiến quan trọng trong nỗ lực hoàn thiện thể chế quản trị công ty đại chúng tại Việt Nam, tiệm cận các thông lệ tốt nhất của OECD.',
      'Điểm đột phá lớn nhất của Nghị định nằm ở việc quy định cụ thể cơ chế giám sát xung đột lợi ích giữa người quản lý doanh nghiệp và cổ đông nhỏ lẻ. Mọi giao dịch với người có liên quan có giá trị từ 10% tổng tài sản trở lên bắt buộc phải được chấp thuận bởi các thành viên độc lập Hội đồng Quản trị.',
      'Đồng thời, Nghị định cũng mở đường cho việc áp dụng bắt buộc hệ thống biểu quyết điện tử (E-voting) thông qua VSDC, giúp hàng triệu nhà đầu tư cá nhân trên cả nước dễ dàng tham gia biểu quyết mà không cần phải có mặt trực tiếp tại Đại hội.',
    ],
  },
  {
    id: 'tt68-non-prefunding',
    category: 'chinh-sach',
    categoryLabel: 'Chính Sách & Thể Chế',
    badgeColor: 'bg-[#C2410C] text-white',
    title: 'Hiệu lực Thông tư 68/2024/TT-BTC: Tháo gỡ nút thắt Non-prefunding, rộng cửa đón dòng vốn ngoại FTSE',
    summary: 'Quy trình giao dịch không yêu cầu ký quỹ 100% bằng tiền đối với nhà đầu tư tổ chức nước ngoài chính thức vận hành trơn tru, bảo đảm an toàn hệ thống thanh toán bù trừ CCP.',
    time: '28/09/2026 • 14:15',
    readTime: '4 phút đọc',
    views: '1.9K',
    source: 'Thời báo Tài chính Việt Nam / CafeF',
    imageUrl: '/guardian-lion-clean.jpg',
    hot: true,
    legalReference: 'Thông tư 68/2024/TT-BTC & Quy chế VSDC',
    investorAdvice: 'Dòng tiền ngoại dự kiến bổ sung thanh khoản mạnh mẽ, tuy nhiên NĐT cá nhân cần tránh fomo vào các cổ phiếu vốn hóa nhỏ không thuộc tiêu chuẩn đầu tư của quỹ ngoại.',
    quickQuestions: [
      'Cơ chế Non-prefunding ảnh hưởng thế nào đến an toàn của nhà đầu tư cá nhân?',
      'Khi công ty chứng khoán bảo lãnh thanh toán cho khối ngoại, ai chịu rủi ro vỡ nợ?',
      'Nhà đầu tư cá nhân có được áp dụng cơ chế không ký quỹ 100% tiền mặt không?',
    ],
    content: [
      'Việc xóa bỏ yêu cầu nộp đủ 100% tiền trước khi đặt lệnh (pre-funding) là một trong hai điều kiện tiên quyết để tổ chức xếp hạng thị trường FTSE Russell chính thức nâng hạng thị trường chứng khoán Việt Nam từ cận biên lên mới nổi thứ cấp.',
      'Cơ chế mới cho phép các công ty chứng khoán có năng lực vốn và quản trị rủi ro tốt đứng ra bảo lãnh thanh toán cho khối ngoại, dưới sự giám sát đa tầng của Ủy ban Chứng khoán Nhà nước.',
    ],
  },
  {
    id: 'xet-xu-thao-tung-flc',
    category: 'dai-an',
    categoryLabel: 'Xử Phạt & Đại Án',
    badgeColor: 'bg-rose-800 text-white',
    title: 'Bài học từ đại án FLC & Tân Hoàng Minh: Hoàn thiện cơ chế bồi thường thiệt hại thực chất cho nhà đầu tư',
    summary: 'Tòa án nhân dân cấp cao xác định trách nhiệm dân sự của các bị cáo, mở ra tiền lệ pháp lý về việc trích xuất tài sản kê biên để bồi thường cho hàng chục nghìn trái chủ và cổ đông bị lừa dối.',
    time: '27/09/2026 • 10:00',
    readTime: '6 phút đọc',
    views: '4.2K',
    source: 'Báo Pháp luật & Đời sống / Tòa án Nhân dân',
    imageUrl: '/guardian-lion-grand.jpg',
    legalReference: 'Điều 211 Bộ luật Hình sự & Điều 584 Bộ luật Dân sự',
    investorAdvice: 'Khi xảy ra vụ án thao túng hoặc lừa đảo phát hành, nhà đầu tư phải lập tức lưu trữ đầy đủ sao kê lệnh khớp, hợp đồng mua bán và chủ động làm đơn gửi Cơ quan Điều tra / Tòa án để được ghi nhận tư cách Bị hại.',
    quickQuestions: [
      'Làm thế nào để nhà đầu tư bị thiệt hại từ cổ phiếu FLC được nhận tiền bồi thường?',
      'Thời hiệu nộp đơn yêu cầu bồi thường dân sự trong vụ án hình sự là bao lâu?',
      'Tại sao việc luật hóa cơ chế Khởi kiện tập thể (Class Action) lại cấp thiết sau đại án này?',
    ],
    content: [
      'Bản án phúc thẩm vụ án Thao túng thị trường chứng khoán và Lừa đảo chiếm đoạt tài sản xảy ra tại Tập đoàn FLC không chỉ trừng trị nghiêm khắc các cá nhân vi phạm mà còn đặt ra vấn đề cấp bách: Làm sao để tiền bồi thường thực sự về được tay nhà đầu tư?',
      'Theo phán quyết của Hội đồng xét xử, toàn bộ số tiền thu lợi bất chính từ hành vi thao túng giá cổ phiếu mã FLC, ROS, ART được ưu tiên xử lý bồi thường cho các nhà đầu tư cá nhân có lệnh mua khớp trong giai đoạn bị đẩy giá.',
      'Các chuyên gia pháp lý tại Hội thảo Khoa học HVNH khẳng định đây là cơ sở thực tiễn vững chắc để thúc đẩy việc thành lập Quỹ bảo vệ nhà đầu tư chứng khoán (SIPF) và luật hóa cơ chế khởi kiện tập thể.',
    ],
  },
  {
    id: 'canh-bao-hoi-nhom-vip',
    category: 'canh-bao',
    categoryLabel: 'Cảnh Báo An Toàn',
    badgeColor: 'bg-amber-800 text-white',
    title: 'Cảnh báo khẩn cấp: Nhận diện bẫy thao túng giá qua các "Hội nhóm VIP Zalo, Telegram" cam kết lãi 30%/tháng',
    summary: 'UBCKNN phối hợp Cục An ninh mạng (A05) phát hiện hàng loạt nhóm môi giới chui tự xưng chuyên gia, lôi kéo nhà đầu tư nộp tiền vào các app chứng khoán quốc tế giả mạo.',
    time: '26/09/2026 • 16:45',
    readTime: '3 phút đọc',
    views: '3.1K',
    source: 'Cảnh báo UBCKNN & A05 Bộ Công an',
    imageUrl: '/guardian-lion.jpg',
    hot: true,
    legalReference: 'Điều 12 Khoản 3 Luật Chứng khoán 2019',
    investorAdvice: 'Chỉ giao dịch chứng khoán qua 74 Công ty Chứng khoán được UBCKNN cấp phép hoạt động chính thức. Mọi cam kết "bao lỗ" hoặc "cam kết lợi nhuận cố định" đều là hành vi lừa đảo hoặc vi phạm pháp luật nghiêm trọng.',
    quickQuestions: [
      'Làm thế nào để kiểm tra một app giao dịch có được UBCKNN cấp phép hay không?',
      'Khi lỡ nộp tiền vào app lừa đảo, nạn nhân cần làm gì ngay trong 24 giờ đầu?',
      'Hành vi cam kết lợi nhuận cố định của môi giới bị xử lý hành chính hay hình sự?',
    ],
    content: [
      'Thời gian gần đây, xuất hiện thủ đoạn tinh vi: các đối tượng lập các nhóm chat Telegram/Zalo quy tụ hàng nghìn thành viên ảo, liên tục tung các ảnh chụp màn hình tài khoản lãi khủng để tạo niềm tin cho các F0 (nhà đầu tư mới).',
      'Sau khi nạn nhân nộp số tiền lớn, hệ thống sẽ báo lỗi không cho rút tiền và yêu cầu đóng thêm "thuế thu nhập cá nhân" hoặc "phí chống rửa tiền" rồi cắt đứt liên lạc hoàn toàn.',
    ],
  },
  {
    id: 'dong-tien-f0-ky-luc',
    category: 'thi-truong',
    categoryLabel: 'Thị Trường CafeF',
    badgeColor: 'bg-emerald-800 text-white',
    title: 'Số lượng tài khoản chứng khoán vượt mốc 9 triệu: Nhà đầu tư cá nhân tiếp tục là trụ cột thanh khoản VN-Index',
    summary: 'Tỷ trọng giao dịch của NĐT cá nhân trong nước duy trì trên 88% tổng thanh khoản toàn sàn. Nhu cầu trang bị kiến thức pháp lý và quản trị rủi ro tài chính trở nên cấp thiết hơn bao giờ hết.',
    time: '25/09/2026 • 11:20',
    readTime: '4 phút đọc',
    views: '2.3K',
    source: 'VSDC / Báo cáo Thị trường CafeF',
    imageUrl: '/guardian-lion-crest.jpg',
    legalReference: 'Báo cáo thống kê thường niên VSDC 2026',
    investorAdvice: 'Thị trường có quy mô lớn đòi hỏi nhà đầu tư phải tự trang bị kiến thức pháp luật và kỹ năng đọc báo cáo tài chính thay vì chỉ chạy theo tin đồn rỉ tai.',
    quickQuestions: [
      'Tỷ trọng NĐT cá nhân chiếm 88% thanh khoản tạo ra những rủi ro cấu trúc gì?',
      'Tại sao NĐT cá nhân tại Việt Nam thường dễ bị tâm lý bầy đàn (FOMO)?',
      'Cơ quan quản lý cần làm gì để chuyển đổi NĐT cá nhân sang đầu tư qua quỹ mở chuyên nghiệp?',
    ],
    content: [
      'Số liệu mới nhất từ Trung tâm Lưu ký Chứng khoán Việt Nam cho thấy tốc độ mở mới tài khoản của người dân vẫn tăng trưởng ổn định ở mức 150.000 tài khoản/tháng.',
      'Sự bùng nổ của tầng lớp nhà đầu tư bán lẻ đặt ra thách thức lớn cho cơ quan quản lý trong việc minh bạch thông tin, ngăn chặn hiện tượng làm giá và bảo vệ quyền lợi cổ đông thiểu số.',
    ],
  },
  {
    id: 'xu-phat-thao-tung-apg',
    category: 'dai-an',
    categoryLabel: 'Xử Phạt Vi Phạm',
    badgeColor: 'bg-rose-800 text-white',
    title: 'Thanh tra UBCKNN phạt nặng 1,5 tỷ đồng và đình chỉ giao dịch 2 năm đối với cá nhân thao túng cổ phiếu',
    summary: 'Đối tượng sử dụng 22 tài khoản chứng khoán để giao dịch chéo liên tục nhằm tạo cung cầu giả tạo đối với cổ phiếu ngành xây dựng hạ tầng.',
    time: '24/09/2026 • 09:15',
    readTime: '3 phút đọc',
    views: '1.7K',
    source: 'Thanh tra Ủy ban Chứng khoán Nhà nước',
    imageUrl: '/guardian-lion-clean.jpg',
    legalReference: 'Nghị định 156/2020/NĐ-CP & Nghị định 128/2021/NĐ-CP',
    investorAdvice: 'Hệ thống giám sát giao dịch của VNX hiện đã tích hợp thuật toán AI nhận diện bất thường, các hành vi quay tay thanh khoản sẽ bị phát hiện nhanh chóng.',
    quickQuestions: [
      'Căn cứ nào để UBCKNN phát hiện hành vi mở nhiều tài khoản thao túng giá?',
      'Số tiền phạt 1,5 tỷ đồng có được trích trả cho các nhà đầu tư bị thiệt hại không?',
      'Thế nào là hành vi "quay tay thanh khoản" và cách nhận biết biểu đồ giá bị làm giả?',
    ],
    content: [
      'Ủy ban Chứng khoán Nhà nước vừa ban hành Quyết định xử phạt vi phạm hành chính trong lĩnh vực chứng khoán đối với một cá nhân có hành vi thao túng thị trường.',
      'Căn cứ kết quả giám sát, cá nhân này đã mượn chứng minh thư của người thân để mở 22 tài khoản tại 4 công ty chứng khoán khác nhau, thực hiện hàng trăm lệnh mua bán khớp chéo trong phiên.',
    ],
  },
];

export function NewsPage() {
  const [newsList, setNewsList] = useState<NewsItem[]>(INITIAL_NEWS_DATA);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeArticle, setActiveArticle] = useState<NewsItem | null>(null);

  // In-Post AI Q&A State
  const [aiArticle, setAiArticle] = useState<NewsItem | null>(null);
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [copiedAnswer, setCopiedAnswer] = useState(false);

  // Rotating Paper Refresh State ("Giấy quay tròn lại")
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshedTime, setLastRefreshedTime] = useState('Cập nhật mỗi buổi sáng');
  const [notice, setNotice] = useState('');

  const categories = [
    { id: 'all', label: 'Tất Cả Tin Tức' },
    { id: 'chinh-sach', label: 'Chính Sách & Luật Mới' },
    { id: 'dai-an', label: 'Đại Án & Xử Phạt' },
    { id: 'canh-bao', label: 'Cảnh Báo NĐT' },
    { id: 'thi-truong', label: 'Thị Trường CafeF' },
  ];

  const loadNews = useCallback(async () => {
    if (!supabase) {
      setNewsList(INITIAL_NEWS_DATA.map((item) => ({ ...item, isFallback: true })));
      setNotice('Đang hiển thị dữ liệu minh họa cho đến khi Supabase được kết nối. Hệ thống không tự tạo tin mới.');
      return;
    }

    const [articlesResult, syncResult] = await Promise.all([
      supabase
        .from('news_articles')
        .select('id,title,summary,category,source_name,source_url,published_at,legal_references,investor_takeaway,image_url')
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(120),
      supabase
        .from('news_sync_runs')
        .select('finished_at,accepted_count')
        .eq('status', 'success')
        .order('finished_at', { ascending: false })
        .limit(1)
        .maybeSingle(),
    ]);

    if (articlesResult.error) {
      setNewsList(INITIAL_NEWS_DATA.map((item) => ({ ...item, isFallback: true })));
      setNotice('Chưa tải được kho tin. Dữ liệu minh họa được giữ nguyên và không có tin giả được tạo thêm.');
    } else if (!articlesResult.data?.length) {
      setNewsList(INITIAL_NEWS_DATA.map((item) => ({ ...item, isFallback: true })));
      setNotice('Chưa có tin CafeF nào trong kho hôm nay. Dưới đây là dữ liệu minh họa giao diện.');
    } else {
      setNewsList((articlesResult.data as NewsRow[]).map(mapNewsRow));
      setNotice('');
    }

    if (!syncResult.error && syncResult.data) {
      const run = syncResult.data as SyncRun;
      if (run.finished_at) setLastRefreshedTime(formatVietnamTime(run.finished_at));
    }
  }, []);

  useEffect(() => {
    void loadNews();
  }, [loadNews]);

  // Refresh News with the existing paper animation and a real CafeF sync.
  const handleRefreshLiveNews = async () => {
    if (isRefreshing) return;
    soundFx.playChime();
    setIsRefreshing(true);
    setNotice('Đang lấy các bài mới nhất trong ngày từ chuyên mục Chứng khoán CafeF…');
    try {
      if (!isSupabaseConfigured) throw new Error('Supabase chưa được cấu hình nên chưa thể lưu và làm mới tin CafeF.');
      const token = await getAccessToken();
      const response = await fetch('/api/news-refresh', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json() as { ok?: boolean; cached?: boolean; accepted?: number; message?: string };
      if (!response.ok || !result.ok) throw new Error(result.message || 'Không thể cập nhật CafeF.');
      await loadNews();
      setNotice(result.cached
        ? 'Kho tin vừa được cập nhật trong 10 phút gần đây.'
        : `Đã cập nhật ${result.accepted || 0} bài CafeF mới trong ngày.`);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'CafeF tạm thời chưa phản hồi; kho tin gần nhất vẫn được giữ nguyên.');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleOpenAiModal = (item: NewsItem, question?: string) => {
    soundFx.playChime();
    setAiArticle(item);
    setAiAnswer(null);
    setAiQuestion(question || item.quickQuestions[0]);
    if (question) {
      triggerAiQuery(item, question);
    }
  };

  const triggerAiQuery = async (item: NewsItem, queryText: string) => {
    if (!queryText.trim()) return;
    setIsAiLoading(true);
    setAiAnswer(null);

    try {
      const answer = await askAboutNewsArticle(
        item.title,
        item.summary,
        item.legalReference,
        queryText.trim(),
        item.sourceUrl,
        setAiAnswer
      );
      setAiAnswer(answer);
    } catch {
      setAiAnswer('Chưa thể kết nối Gemini 3.8. Vui lòng kiểm tra cấu hình dịch vụ và thử lại.');
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleCopyAiAnswer = () => {
    if (!aiAnswer) return;
    soundFx.playChime();
    navigator.clipboard.writeText(aiAnswer);
    setCopiedAnswer(true);
    setTimeout(() => setCopiedAnswer(false), 2000);
  };

  const filteredNews = newsList.filter((item) => {
    const matchCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.source.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="min-h-screen bg-[#FFFDF9] text-[#1C130E] font-serif pt-6 pb-20">
      {/* 1. Ticker / Marquee Banner */}
      <div className="site-shell mb-8">
        <div className="bg-gradient-to-r from-[#8C2B0A] via-[#C2410C] to-[#D9531E] text-white rounded-2xl px-4 py-2.5 flex items-center justify-between gap-3 shadow-lg shadow-[#8C2B0A]/15 border border-[#D4AF37]/50 overflow-hidden">
          <div className="flex items-center gap-2 shrink-0">
            <span className="flex items-center gap-1.5 bg-white/15 backdrop-blur-xs px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider text-amber-100">
              <Flame className="w-3.5 h-3.5 text-amber-300 animate-bounce" />
              <span>Tin Nóng 24/7</span>
            </span>
          </div>

          <div className="truncate text-xs font-sans tracking-wide flex-1 px-2">
            {newsList.slice(0, 3).map((item, index) => (
              <React.Fragment key={item.id}>
                {index > 0 && <span className="mx-3 opacity-60">|</span>}
                <span className="font-bold">• {item.title}</span>
              </React.Fragment>
            ))}
          </div>

          {/* Section 5: Prominent Paper Spin Refresh Button */}
          <button
            onClick={handleRefreshLiveNews}
            disabled={isRefreshing}
            className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold transition-all border border-amber-300/40 cursor-pointer disabled:opacity-75"
            title="Làm mới luồng tin tức trực tiếp từ CafeF"
          >
            <FileText className={`w-3.5 h-3.5 text-amber-200 ${isRefreshing ? 'animate-paper-spin' : ''}`} />
            <span className="hidden sm:inline">{isRefreshing ? 'Đang cuộn giấy...' : 'Làm mới tin'}</span>
          </button>
        </div>
      </div>

      {/* 2. Main Shell */}
      <div className="site-shell relative">
        <BotanicalWatermark opacity={0.04} />

        {/* Page Title & Search Bar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 pb-6 border-b border-[#EBD7C7] relative z-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#8C2B0A] bg-[#FAF0E6] border border-[#EBD7C7] px-3.5 py-1.5 rounded-full w-fit mb-3">
              <Newspaper className="w-4 h-4 text-[#C2410C]" />
              <span>Chuyên Trang Thời Sự Pháp Lý Chứng Khoán</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1C130E] tracking-tight text-artistic-halo">
              Cẩm Nang &amp; Tin Tức Pháp Luật Chứng Khoán
            </h1>
            <BotanicalHeaderCrest className="!justify-start my-2" />
            <p className="text-sm sm:text-base text-[#3D2E24] mt-2 max-w-2xl leading-relaxed">
              Cập nhật liên tục các văn bản quy phạm pháp luật mới, án lệ xử phạt thao túng giá và cảnh báo an toàn tài chính cho nhà đầu tư cá nhân Việt Nam.
            </p>
          </div>

          {/* Search Box & Status */}
          <div className="flex flex-col gap-2 w-full md:w-80">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-[#8C2B0A] absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm tin tức, mã CK, văn bản..."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-[#D4AF37]/50 focus:border-[#C2410C] focus:ring-1 focus:ring-[#C2410C] outline-none text-xs sm:text-sm bg-white text-[#1C130E] shadow-xs"
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-[#7A6658] px-1">
              <span>Nguồn tin trực tiếp: CafeF</span>
              <span className="italic">{lastRefreshedTime}</span>
            </div>
          </div>
        </div>

        {/* Botanical Classical Divider */}
        <BotanicalVineDivider className="mb-6 opacity-75 relative z-10" />

        {/* Category Filter Pills & Live Refresh Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 relative z-10">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  soundFx.playTap();
                  setSelectedCategory(c.id);
                }}
                className={`px-4 py-2 rounded-full text-xs font-bold tracking-wide whitespace-nowrap transition-all border cursor-pointer ${
                  selectedCategory === c.id
                    ? 'bg-gradient-to-r from-[#8C2B0A] via-[#C2410C] to-[#D9531E] border-[#8C2B0A] text-white shadow-sm'
                    : 'bg-white border-[#EBD7C7] text-[#3D2E24] hover:bg-[#FAF0E6]'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Section 5: The user-requested "Làm mới tin + giấy quay tròn lại" */}
          <button
            onClick={handleRefreshLiveNews}
            disabled={isRefreshing}
            className="self-start sm:self-auto inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-[#8C2B0A] via-[#C2410C] to-[#D9531E] text-white text-xs font-bold font-serif shadow-md shadow-[#8C2B0A]/15 hover:scale-102 transition-all cursor-pointer disabled:opacity-70"
          >
            <FileText className={`w-4 h-4 text-amber-200 ${isRefreshing ? 'animate-paper-spin' : ''}`} />
            <span>{isRefreshing ? 'Đang cuộn giấy làm mới...' : 'Làm Mới Tin CafeF Hôm Nay'}</span>
          </button>
        </div>

        {notice && (
          <div className="relative z-10 mb-6 rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-xs leading-relaxed text-amber-950">
            {notice}
          </div>
        )}

        {/* ============================================================== */}
        {/* 3. HORIZONTAL NEWS CARD LIST (CHUẨN EMLAW EXPORT STYLE)       */}
        {/* ============================================================== */}
        <div className="space-y-6 relative z-10">
          {filteredNews.map((item) => (
            <article
              key={item.id}
              className="botanical-luxury-card rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-300 group relative"
            >
              {/* Góc bọc sổ kim loại mạ vàng Vintage Brass Corner Guards 4 góc */}
              <NotebookCardCorners size={56} mode="all-4" className="opacity-80 group-hover:opacity-100" />
              <div className="flex flex-col sm:flex-row items-stretch">
                {/* Left Thumbnail Image Column */}
                <div className="relative sm:w-[270px] sm:min-w-[270px] h-[200px] sm:h-auto overflow-hidden bg-[#FAF3EC] shrink-0 border-b sm:border-b-0 sm:border-r border-[#EBD7C7]">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Category Badge overlay */}
                  <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider shadow-sm ${item.badgeColor}`}>
                    {item.categoryLabel}
                  </span>
                  {item.hot && (
                    <span className="absolute bottom-3 left-3 px-2 py-0.5 rounded-full bg-rose-600/90 text-white text-[10px] font-bold flex items-center gap-1 shadow-xs">
                      <Flame className="w-3 h-3 text-amber-200" /> Nổi Bật
                    </span>
                  )}
                </div>

                {/* Right Content Column */}
                <div className="flex-1 p-5 sm:p-6 flex flex-col justify-between">
                  <div>
                    {/* Title */}
                    <h2
                      onClick={() => {
                        soundFx.playTap();
                        setActiveArticle(item);
                      }}
                      className="text-lg sm:text-xl font-bold font-serif text-[#1C130E] group-hover:text-[#C2410C] transition-colors leading-snug mb-2.5 cursor-pointer line-clamp-2 text-gilded-gold-halo text-artistic-halo"
                    >
                      {item.title}
                    </h2>

                    {/* Summary */}
                    <p className="text-xs sm:text-sm text-[#3D2E24] leading-relaxed mb-3.5 line-clamp-3">
                      {item.summary}
                    </p>

                    {/* Legal Citation pill */}
                    <div className="inline-flex items-center gap-1.5 text-xs text-[#8C2B0A] bg-[#FAF0E6] px-3 py-1 rounded-lg border border-[#EBD7C7] mb-4">
                      <Scale className="w-3.5 h-3.5 text-[#C2410C]" />
                      <span className="font-semibold truncate max-w-lg">{item.legalReference}</span>
                    </div>
                  </div>

                  {/* Metadata & Interactive Action Row */}
                  <div className="pt-3.5 border-t border-[#EBD7C7] flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2.5 text-[#7A6658]">
                      <time>{item.time}</time>
                      {item.views && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Eye className="w-3.5 h-3.5 text-[#8C2B0A]" /> {item.views}
                          </span>
                        </>
                      )}
                      <span className="hidden sm:inline">•</span>
                      <span className="hidden sm:inline font-bold text-[#8C2B0A]">{item.source}</span>
                    </div>

                    {/* Action Buttons: Ask AI + Read Full */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenAiModal(item)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAF0E6] hover:bg-[#F2E4D4] border border-[#D4AF37]/70 text-[#8C2B0A] font-bold text-xs transition-colors cursor-pointer"
                        title="Dùng Trợ lý Gemini AI hỏi đáp riêng về bài báo này"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-[#C2410C]" />
                        <span>Hỏi AI Về Bài Này</span>
                      </button>

                      <button
                        onClick={() => {
                          soundFx.playTap();
                          setActiveArticle(item);
                        }}
                        className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#8C2B0A] via-[#C2410C] to-[#D9531E] text-white font-bold text-xs shadow-xs hover:scale-102 transition-transform cursor-pointer"
                      >
                        <span>{item.sourceUrl ? 'Xem Tóm Tắt' : 'Đọc Toàn Văn'}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {filteredNews.length === 0 && (
          <div className="text-center py-16 bg-[#FAF0E6] rounded-3xl border border-[#EBD7C7] mt-6">
            <Newspaper className="w-12 h-12 text-[#8C2B0A]/50 mx-auto mb-3" />
            <p className="text-base font-bold text-[#1C130E]">Không tìm thấy tin tức phù hợp</p>
            <p className="text-xs text-[#7A6658] mt-1">Thử từ khóa khác hoặc chuyển sang danh mục "Tất Cả Tin Tức".</p>
          </div>
        )}
      </div>

      {/* ============================================================== */}
      {/* 4. MODAL ĐỌC TOÀN VĂN BÀI VIẾT (ARTICLE DETAIL MODAL)           */}
      {/* ============================================================== */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#F5E6D8]/90 backdrop-blur-sm animate-fade-in font-serif">
          <div
            className="w-full max-w-3xl botanical-luxury-card rounded-3xl shadow-2xl p-6 sm:p-8 relative max-h-[90vh] flex flex-col text-[#1C130E]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Corner Filigree */}
            <BotanicalCornerFiligree className="absolute top-2 left-2 rotate-0 opacity-70" size={42} />
            <BotanicalCornerFiligree className="absolute top-2 right-2 rotate-90 opacity-70" size={42} />

            {/* Close Button */}
            <button
              onClick={() => setActiveArticle(null)}
              className="absolute top-5 right-5 w-9 h-9 rounded-full bg-[#FAF0E6] hover:bg-[#F2E4D4] text-[#8C2B0A] flex items-center justify-center transition-colors cursor-pointer z-10"
              title="Đóng"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header info */}
            <div className="flex items-center gap-2 mb-3 text-xs relative z-10">
              <span className={`px-2.5 py-1 rounded-full font-bold shadow-xs ${activeArticle.badgeColor}`}>
                {activeArticle.categoryLabel}
              </span>
              <span className="text-slate-400">•</span>
              <span className="text-[#7A6658]">{activeArticle.time}</span>
              <span className="text-slate-400">•</span>
              <span className="text-[#8C2B0A] font-bold">{activeArticle.source}</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-[#1C130E] leading-snug mb-4 pr-8 text-artistic-halo">
              {activeArticle.title}
            </h2>

            {/* Legal Anchor Box */}
            <div className="p-3.5 rounded-2xl bg-[#FAF0E6] border border-[#EBD7C7] mb-4 text-xs">
              <div className="font-bold text-[#8C2B0A] flex items-center gap-1.5 mb-1">
                <Scale className="w-4 h-4 text-[#C2410C]" />
                Căn cứ / nguồn tham chiếu: {activeArticle.legalReference}
              </div>
              <div className="text-[#5A4638] italic">
                Nguồn xuất bản: {activeArticle.source}
              </div>
            </div>

            {/* Scrollable Article Body */}
            <div className="flex-1 overflow-y-auto space-y-4 text-sm leading-relaxed text-[#2B1D15] pr-2">
              <p className="font-semibold text-[#1C130E] bg-[#FAF3EC] p-3.5 rounded-xl border-l-4 border-[#C2410C]">
                {activeArticle.summary}
              </p>

              {activeArticle.content.map((paragraph, idx) => (
                <p key={idx} className="indent-6 text-justify">
                  {paragraph}
                </p>
              ))}

              {/* Investor Advice Box */}
              <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-300 text-emerald-950 mt-4">
                <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-800 mb-1 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Khuyến Nghị Bảo Vệ Quyền Lợi Cho Nhà Đầu Tư Cá Nhân
                </h4>
                <p className="text-xs leading-relaxed text-emerald-900">
                  {activeArticle.investorAdvice}
                </p>
              </div>

              {/* Quick AI Trigger Box Inside Modal */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-[#FAF0E6] to-[#F5E6D8] border border-[#D4AF37]/60 mt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div>
                  <div className="font-bold text-xs text-[#8C2B0A] flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#C2410C]" />
                    <span>Bạn có thắc mắc pháp lý về vụ việc này?</span>
                  </div>
                  <p className="text-[11px] text-[#5A4638] mt-0.5">
                    Hỏi Trợ lý Gemini AI để được giải đáp tức thì viện dẫn điều luật chi tiết.
                  </p>
                </div>
                <button
                  onClick={() => {
                    const cur = activeArticle;
                    setActiveArticle(null);
                    handleOpenAiModal(cur);
                  }}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#8C2B0A] via-[#C2410C] to-[#D9531E] text-white font-bold text-xs shrink-0 cursor-pointer shadow-sm hover:scale-102 transition-transform"
                >
                  Mở Trợ Lý AI Bài Này
                </button>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-4 border-t border-[#EBD7C7] flex items-center justify-between text-xs text-[#7A6658] mt-4">
              <span>Đề tài NCKH Lớp 261LAW10A01 • Nhóm 2 • Khoa Luật HVNH</span>
              {activeArticle.sourceUrl ? (
                <a
                  href={activeArticle.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#8C2B0A] font-bold hover:underline flex items-center gap-1"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Đọc bài gốc trên CafeF
                </a>
              ) : (
                <button
                  onClick={() => {
                    soundFx.playTap();
                    navigator.clipboard.writeText(window.location.href);
                    alert('Đã sao chép liên kết bài viết!');
                  }}
                  className="text-[#8C2B0A] font-bold hover:underline flex items-center gap-1"
                >
                  <Share2 className="w-3.5 h-3.5" /> Chia sẻ bài viết
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 5. MODAL HỎI ĐÁP AI TRỰC TIẾP VỀ BÀI BÁO (GEMINI AI Q&A MODAL)   */}
      {/* ============================================================== */}
      {aiArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#F5E6D8]/90 backdrop-blur-sm animate-fade-in font-serif">
          <div
            className="w-full max-w-2xl botanical-luxury-card rounded-3xl shadow-2xl p-6 sm:p-8 relative max-h-[90vh] flex flex-col text-[#1C130E]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Corner Filigree */}
            <BotanicalCornerFiligree className="absolute top-2 left-2 rotate-0 opacity-80" size={42} />
            <BotanicalCornerFiligree className="absolute top-2 right-2 rotate-90 opacity-80" size={42} />

            {/* Close Button */}
            <button
              onClick={() => {
                setAiArticle(null);
                setAiAnswer(null);
              }}
              className="absolute top-5 right-5 w-9 h-9 rounded-full bg-[#FAF0E6] hover:bg-[#F2E4D4] text-[#8C2B0A] flex items-center justify-center transition-colors cursor-pointer z-10"
              title="Đóng"
            >
              <X className="w-5 h-5" />
            </button>

            {/* AI Modal Header */}
            <div className="flex items-center gap-2 mb-2 relative z-10">
              <span className="p-2 rounded-xl bg-gradient-to-br from-[#8C2B0A] to-[#C2410C] text-white shadow-sm">
                <Sparkles className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-[#1C130E] text-artistic-halo">
                  Trợ Lý AI Phân Tích Bài Báo
                </h3>
                <p className="text-[11px] text-[#8C2B0A] font-semibold">
                  Mô hình: Google Gemini 3.8 Flash • Khoa Luật, Học viện Ngân hàng
                </p>
              </div>
            </div>

            {/* Target Article Reference Box */}
            <div className="p-3 rounded-2xl bg-[#FAF0E6] border border-[#EBD7C7] mb-4 text-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C2B0A] block">
                Ngữ cảnh bài báo đang hỏi:
              </span>
              <h4 className="font-bold text-[#1C130E] line-clamp-1 mt-0.5">
                {aiArticle.title}
              </h4>
              <p className="text-[#5A4638] text-[11px] mt-0.5">
                Căn cứ: {aiArticle.legalReference}
              </p>
            </div>

            {/* Quick Questions Suggestions */}
            <div className="mb-4">
              <span className="text-[11px] font-bold text-[#7A6658] block mb-2">
                Gợi ý câu hỏi pháp lý nhanh:
              </span>
              <div className="flex flex-col gap-1.5">
                {aiArticle.quickQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      soundFx.playTap();
                      setAiQuestion(q);
                      triggerAiQuery(aiArticle, q);
                    }}
                    className="text-left px-3 py-2 rounded-xl bg-white border border-[#EBD7C7] hover:border-[#C2410C] hover:bg-[#FAF3EC] text-xs text-[#1C130E] transition-all flex items-center justify-between group cursor-pointer shadow-2xs"
                  >
                    <span className="truncate pr-2">{q}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-[#C2410C] shrink-0 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                ))}
              </div>
            </div>

            {/* User Custom Question Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (aiQuestion.trim()) {
                  soundFx.playTap();
                  triggerAiQuery(aiArticle, aiQuestion);
                }
              }}
              className="flex items-center gap-2 mb-4"
            >
              <input
                type="text"
                value={aiQuestion}
                onChange={(e) => setAiQuestion(e.target.value)}
                placeholder="Nhập câu hỏi riêng của bạn về bài báo này..."
                className="flex-1 px-4 py-2.5 rounded-2xl border border-[#D4AF37]/50 focus:border-[#C2410C] focus:ring-1 focus:ring-[#C2410C] outline-none text-xs sm:text-sm bg-white text-[#1C130E] shadow-2xs"
              />
              <button
                type="submit"
                disabled={isAiLoading || !aiQuestion.trim()}
                className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#8C2B0A] via-[#C2410C] to-[#D9531E] text-white text-xs font-bold flex items-center gap-1.5 shadow-md hover:scale-102 transition-all cursor-pointer disabled:opacity-50"
              >
                {isAiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                <span className="hidden sm:inline">Gửi câu hỏi</span>
              </button>
            </form>

            {/* Answer Display Area */}
            <div className="flex-1 overflow-y-auto p-4 rounded-2xl bg-[#FFFDF9] border border-[#EBD7C7] text-xs sm:text-sm leading-relaxed text-[#2B1D15]">
              {isAiLoading && !aiAnswer ? (
                <div className="py-8 flex flex-col items-center justify-center gap-2 text-[#8C2B0A]">
                  <Loader2 className="w-7 h-7 animate-spin text-[#C2410C]" />
                  <p className="font-bold text-xs">Trợ lý Gemini AI đang tra cứu điều luật và soạn thảo câu trả lời...</p>
                </div>
              ) : aiAnswer ? (
                <AiRichText text={aiAnswer} streaming={isAiLoading} className="font-serif" />
              ) : (
                <div className="py-8 text-center text-[#7A6658]">
                  <Sparkles className="w-8 h-8 text-[#D4AF37] mx-auto mb-2 opacity-60" />
                  <p className="font-bold text-xs">Hãy chọn một câu hỏi gợi ý bên trên hoặc gõ câu hỏi để AI phân tích.</p>
                </div>
              )}
            </div>

            {/* AI Modal Actions */}
            {aiAnswer && (
              <div className="pt-3.5 border-t border-[#EBD7C7] flex items-center justify-between text-xs mt-3">
                <span className="text-[#7A6658]">Câu trả lời được cá nhân hóa theo bài báo</span>
                <button
                  onClick={handleCopyAiAnswer}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#FAF0E6] hover:bg-[#F2E4D4] text-[#8C2B0A] font-bold transition-colors cursor-pointer"
                >
                  {copiedAnswer ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedAnswer ? 'Đã sao chép' : 'Sao chép câu trả lời'}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
