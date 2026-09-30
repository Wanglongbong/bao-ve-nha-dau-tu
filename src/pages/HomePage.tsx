import React, { useState, useRef } from 'react';
import { Link } from '@/router';
import {
  Shield,
  ArrowRight,
  BookOpen,
  Scale,
  Sparkles,
  FileText,
  CheckCircle2,
  Users,
  Search,
  Landmark,
  Layers,
  Lock,
  FileCode2,
  ShieldCheck,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Upload,
  Camera,
  Award,
  Presentation,
  SlidersHorizontal,
  LayoutGrid,
} from 'lucide-react';
import { TEAM_MEMBERS } from '@/lib/research-data';
import { RoyalCornerFiligree } from '@/components/royal-corner-filigree';
import { LionHeroBackdrop } from '@/components/lion-hero-backdrop';
import { PresentationSlides } from '@/components/presentation-slides';
import { DocumentPresentation } from '@/components/document-presentation';
import {
  PillarsFiligree,
  AcademicFiligree,
  TeamFiligree,
  FiligreeDefs,
} from '@/components/section-filigree';
import {
  BotanicalCornerFiligree,
  BotanicalCardCorners,
  BotanicalHeaderCrest,
  BotanicalVineDivider,
  BotanicalWatermark,
} from '@/components/botanical-filigree';
import {
  NotebookCornerGuard,
  NotebookCardCorners,
  NotebookRibbonDivider,
  NotebookBookbindingStitch,
} from '@/components/notebook-corner-guard';
import { soundFx } from '@/lib/audio-effects';

interface HomePageProps {
  onOpenAi: () => void;
  onOpenViewer: () => void;
  onOpenTeamModal: (slug?: string) => void;
}

function compressImageFile(file: File, maxDimension = 900, quality = 0.85): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target?.result as string;
      if (!src) return resolve('');
      const img = new window.Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', quality));
        } else {
          resolve(src);
        }
      };
      img.onerror = () => resolve(src);
      img.src = src;
    };
    reader.onerror = () => resolve('');
    reader.readAsDataURL(file);
  });
}

// 6 Core Research Pillars
const RESEARCH_PILLARS = [
  {
    id: 'pillar-1',
    number: '01',
    minimum: true,
    title: 'Lý Luận Bất Cân Xứng Thông Tin & Vị Thế NĐT Cá Nhân',
    description: 'Bóc tách bản chất NĐT nhỏ lẻ nắm giữ >90% thanh khoản nhưng hoàn toàn lép vế trước tin nội bộ, thao túng giá và hành vi bất đối xứng thông tin nghiêm trọng trên thị trường.',
    outcome: 'Mô hình 4 rủi ro cơ cấu của NĐT cá nhân trên TTCK Việt Nam.',
  },
  {
    id: 'pillar-2',
    number: '02',
    minimum: true,
    title: 'Ma Trận Thể Chế Luật CK 2024 & Nghị Định 245/2025',
    description: 'Chuẩn hóa nghĩa vụ công bố thông tin song ngữ (Việt - Anh), thẩm định tư cách thành viên HĐQT độc lập và trách nhiệm giải trình của các công ty đại chúng quy mô lớn.',
    outcome: 'Bộ bảng đối chiếu quy định mới áp dụng cho 100% CTĐC từ năm 2026.',
  },
  {
    id: 'pillar-3',
    number: '03',
    advanced: true,
    title: 'Hệ Thống Giám Sát 3 Cấp & Cơ Chế Phòng Ngừa Bằng AI',
    description: 'Vận hành chu trình giám sát liên thông giữa CTCK (tuyến 1) - SGDCK (tuyến 2) - UBCKNN (tuyến 3), tích hợp công nghệ AI nhận diện lệnh bất thường theo Nghị quyết 57-NQ/TW.',
    outcome: 'Quy trình nhận diện và xử lý giao dịch đáng ngờ trong 15 phút.',
  },
  {
    id: 'pillar-4',
    number: '04',
    advanced: true,
    title: 'Hồ Sơ Đại Án: FLC, Tân Hoàng Minh & Louis Holdings',
    description: 'Phân tích thủ thuật tạo thanh khoản ảo, thổi giá cổ phiếu, phát hành trái phiếu khống và bài học bảo vệ quyền cổ đông thiểu số qua các bản án hình sự đã tuyên.',
    outcome: 'Hồ sơ thực chứng bóc tách phương thức thao túng và bồi thường thiệt hại.',
  },
  {
    id: 'pillar-5',
    number: '05',
    advanced: true,
    title: 'Bất Cập Bồi Thường Thiệt Hại & Rào Cản Tố Tụng Dân Sự',
    description: 'Đánh giá 4 điểm nghẽn pháp lý: nghĩa vụ chứng minh mối quan hệ nhân quả, định lượng thiệt hại Điều 145, rào cản án phí và thiếu vắng cơ chế khởi kiện tập thể.',
    outcome: 'Khung kiến nghị gỡ bỏ rào cản tiếp cận công lý cho cổ đông nhỏ.',
  },
  {
    id: 'pillar-6',
    number: '06',
    advanced: true,
    title: '5 Giải Pháp Đột Phá: Quỹ Bảo Vệ NĐT & Class Action',
    description: 'Đề xuất thành lập Quỹ bảo vệ nhà đầu tư (SIPF) từ nguồn tiền phạt vi phạm, triển khai cơ chế khởi kiện tập thể đại diện (Class Action) và bắt buộc bảo hiểm D&O.',
    outcome: 'Lộ trình 5 bước cải cách thể chế hướng tới mục tiêu nâng hạng FTSE.',
  },
];

export function HomePage({ onOpenAi, onOpenViewer, onOpenTeamModal }: HomePageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [researchViewMode, setResearchViewMode] = useState<'slides' | 'paper'>('slides');
  const [teamViewMode, setTeamViewMode] = useState<'grid' | 'carousel'>('grid');
  const [isTeamExpanded, setIsTeamExpanded] = useState<boolean>(true);
  const carouselContainerRef = useRef<HTMLDivElement | null>(null);
  const teamBatchInputRef = useRef<HTMLInputElement | null>(null);
  const [teamNotification, setTeamNotification] = useState<string | null>(null);

  const [avatars, setAvatars] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem('chung_khoan_team_avatars');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const scrollCarousel = (direction: 'left' | 'right') => {
    soundFx.playTap();
    if (carouselContainerRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      carouselContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const saveAvatar = (slug: string, base64: string) => {
    setAvatars((prev) => {
      const updated = { ...prev, [slug]: base64 };
      try {
        localStorage.setItem('chung_khoan_team_avatars', JSON.stringify(updated));
      } catch (err) {
        console.warn('LocalStorage limit exceeded:', err);
      }
      return updated;
    });
  };

  const handleBatchTeamUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    soundFx.playTap();
    let matchedCount = 0;
    const fileList = Array.from(files) as File[];

    for (const file of fileList) {
      const fileNameLower = file.name.toLowerCase().normalize('NFC');
      const matched = TEAM_MEMBERS.find((m) => {
        const normSlug = m.slug.toLowerCase();
        const normName = m.name.toLowerCase().normalize('NFC');
        return (
          fileNameLower.includes(normSlug) ||
          fileNameLower.includes(normName) ||
          normName.includes(fileNameLower.replace(/\.[^/.]+$/, ''))
        );
      });

      if (matched) {
        matchedCount++;
        try {
          const base64 = await compressImageFile(file);
          if (base64) {
            saveAvatar(matched.slug, base64);
          }
        } catch (err) {
          console.error('Error compressing batch image:', err);
        }
      }
    }

    soundFx.playChime();
    setTeamNotification(`Đã nhận diện và cập nhật ${matchedCount} ảnh thành viên thành công!`);
    setTimeout(() => setTeamNotification(null), 4000);
  };

  return (
    <main className="font-serif">
      <FiligreeDefs />

      {/* 1. HERO SECTION - LUXURY MIDNIGHT NAVY & GILDED GOLD NOTEBOOK EDITION */}
      <section className="home-hero relative overflow-hidden" id="hero">
        <div className="hero-overlay" />
        <BotanicalWatermark opacity={0.06} />

        {/* 4 Góc bọc sổ kim loại mạ vàng Vintage Brass Notebook Corner Guards */}
        <div className="absolute top-2 left-2 z-10 pointer-events-none">
          <NotebookCornerGuard size={92} position="top-left" />
        </div>
        <div className="absolute top-2 right-2 z-10 pointer-events-none">
          <NotebookCornerGuard size={92} position="top-right" />
        </div>
        <div className="absolute bottom-2 left-2 z-10 pointer-events-none">
          <NotebookCornerGuard size={92} position="bottom-left" />
        </div>
        <div className="absolute bottom-2 right-2 z-10 pointer-events-none">
          <NotebookCornerGuard size={92} position="bottom-right" />
        </div>

        {/* HÌNH TƯỢNG SƯ TỬ UY NGHI */}
        <LionHeroBackdrop />

        <div className="site-shell hero-content">
          <div className="hero-copy">
            <span className="eyebrow">
              <Shield className="w-4 h-4 text-[#E5C158]" />
              Công Trình Nghiên Cứu Pháp Luật Chứng Khoán
            </span>

            <h1 className="text-gilded-gold-halo text-artistic-halo">
              Tấm khiên pháp lý chuẩn mực bảo vệ{' '}
              <em className="text-transparent bg-clip-text bg-gradient-to-r from-[#E5C158] via-[#FFF3D1] to-[#D4AF37] not-italic drop-shadow-sm font-bold">
                Nhà đầu tư cá nhân.
              </em>
            </h1>

            <p className="text-base sm:text-lg text-[#3D2E24] leading-relaxed font-serif">
              Đồng bộ toàn diện từ khung pháp lý Luật Chứng khoán 2019 (sửa đổi 2024), 
              hệ thống giám sát 3 cấp, phân tích các đại án thao túng giá (FLC, Tân Hoàng Minh, Louis Holdings)
              đến 5 giải pháp đột phá bảo vệ quyền lợi NĐT nhỏ lẻ giai đoạn 2020 – 2026.
            </p>

            <div className="hero-actions">
              <Link className="orange-button cursor-pointer" href="/ban-word">
                <FileText className="w-4 h-4" />
                <span>Toàn Văn Bản Word &amp; Tải Về</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link className="ghost-orange-button cursor-pointer" href="/nen-tang-ai">
                <Sparkles className="w-4 h-4 text-[#C2410C]" />
                <span>Nền Tảng AI Gemini</span>
              </Link>
              <Link className="ghost-orange-button cursor-pointer" href="/doi-ngu">
                <Users className="w-4 h-4 text-[#C2410C]" />
                <span>Ban Nghiên Cứu (8 TV)</span>
              </Link>
            </div>

            {/* 4-Stat Metrics Ribbon */}
            <div className="stats-ribbon">
              <div className="stat-item">
                <span className="stat-number">2.731+</span>
                <span className="stat-label">Quyết định xử phạt VPHC (2020–2025)</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">1.000+</span>
                <span className="stat-label">Đơn thư khiếu nại, tố cáo UBCKNN</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">&gt; 90%</span>
                <span className="stat-label">Thanh khoản do NĐT cá nhân nắm giữ</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">08</span>
                <span className="stat-label">Thành viên Ban nghiên cứu BTL Khoa Luật</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. QUICK COMMAND & SEARCH BAR */}
      <section className="site-shell quick-command-wrap py-6">
        <div className="quick-command-bar">
          <Search className="w-5 h-5 text-orange-600 shrink-0" />
          <input
            type="text"
            placeholder="Tra cứu nhanh: gõ 'FLC', 'Tân Hoàng Minh', 'Nghị định 245/2025', 'thao túng', 'bồi thường', 'giám sát'..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="text-xs text-slate-400 hover:text-slate-600 px-2 py-1 font-semibold cursor-pointer"
            >
              Xóa
            </button>
          )}
        </div>
        <div className="quick-tags">
          <span>Gợi ý chủ đề:</span>
          {[
            'Thao túng FLC',
            'Trái phiếu Tân Hoàng Minh',
            'Nghị định 245/2025',
            'Giám sát 3 cấp',
            'Quỹ bảo vệ NĐT (SIPF)',
            'Khởi kiện tập thể (Class Action)',
          ].map((tag) => (
            <button
              key={tag}
              type="button"
              className="quick-tag-btn"
              onClick={() => {
                soundFx.playTap();
                setSearchQuery(tag);
              }}
            >
              {tag}
            </button>
          ))}
        </div>
      </section>

      {/* 3. SECTION 1: 6-PILLAR ARCHITECTURE (ROYAL BOTANICAL BENTO GRID) */}
      <section className="services-section py-14 relative overflow-hidden" id="tru-cot">
        <BotanicalWatermark opacity={0.04} />
        <div className="site-shell relative z-10">
          <div className="section-heading mb-8">
            <div>
              <span className="section-filigree-label">
                <Layers className="w-3.5 h-3.5 text-[#C2410C]" />
                Hành trình pháp lý toàn diện
              </span>
              <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-[#1C130E] text-artistic-halo">
                Sáu Trụ Cột Nghiên Cứu Bảo Vệ Nhà Đầu Tư Cá Nhân
              </h2>
              <BotanicalHeaderCrest />
            </div>
            <p className="text-sm sm:text-base text-[#3D2E24] max-w-2xl leading-relaxed mt-2">
              Khung nghiên cứu 6 trụ cột được thiết kế mạch lạc: từ cơ sở lý luận, ma trận thể chế, hệ thống giám sát 3 cấp đến phân tích đại án và 5 giải pháp đột phá.
            </p>
          </div>

          <div className="bento-pillar-grid">
            {RESEARCH_PILLARS.map((pillar, index) => {
              const icons = [
                <Layers key="0" className="w-6 h-6" />,
                <Landmark key="1" className="w-6 h-6" />,
                <Lock key="2" className="w-6 h-6" />,
                <FileCode2 key="3" className="w-6 h-6" />,
                <ShieldAlert key="4" className="w-6 h-6" />,
                <ShieldCheck key="5" className="w-6 h-6" />,
              ];
              return (
                <article className="notebook-leather-card rounded-3xl p-6 sm:p-8 relative overflow-hidden group shadow-md" key={pillar.id}>
                  {/* Góc bọc sổ kim loại mạ vàng Vintage Brass Notebook Corner Guards 4 góc */}
                  <NotebookCardCorners size={64} mode="all-4" />
                  <NotebookBookbindingStitch />

                  <div className="relative z-10 pl-2">
                    <div className="bento-pillar-head mb-4">
                      <span className="bento-pillar-num text-2xl font-mono text-[#E5C158] font-bold drop-shadow-xs">{pillar.number}</span>
                      <div className="bento-pillar-icon w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FFF7ED] via-[#FFE8D2] to-[#FFD7B5] border border-[#E8B68F] text-[#B83D16] shadow-xs">{icons[index]}</div>
                    </div>
                    <div className="mb-2">
                      {pillar.minimum && (
                        <span className="tier minimum mr-2">Cốt lõi (*)</span>
                      )}
                      {pillar.advanced && (
                        <span className="tier advanced mr-2">Đột phá</span>
                      )}
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold mb-2 leading-snug text-[#2D211B]">{pillar.title}</h3>
                    <p className="text-sm sm:text-base text-[#5E4A3E] leading-relaxed mb-4">{pillar.description}</p>
                  </div>
                  <div className="bento-outcome-box mt-2 bg-[#FFFDF9]/95 border border-[#E5C158]/40 rounded-xl p-3 relative z-10 shadow-xs">
                    <CheckCircle2 className="w-5 h-5 shrink-0 text-[#E5C158]" />
                    <span className="text-xs sm:text-sm text-[#5E4A3E]">
                      <strong className="text-[#856417]">Bàn giao:</strong> {pillar.outcome}
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. SECTION 2: ACADEMIC HUB — PRESENTATION SLIDES & FULL RESEARCH PAPER (~30 TRANG, 20.388 TỪ) */}
      <section id="toan-van" className="py-14 bg-gradient-to-b from-[#FFFDF9] via-[#FAF2E8] to-[#FFF6EB] border-y border-[#E9C5A9] relative overflow-hidden">
        <BotanicalWatermark opacity={0.05} />
        <div className="site-shell relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-8">
            <div>
              <span className="section-filigree-label">
                <BookOpen className="w-3.5 h-3.5 text-[#E5C158]" />
                Trung Tâm Báo Cáo Học Thuật &amp; Trình Chiếu
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-[#2D211B] text-artistic-halo mt-2 mb-2 tracking-tight">
                Slide Canva Thiết Kế Mới 2026 &amp; Toàn Văn Đề Tài 20.388 Từ
              </h2>
              <NotebookRibbonDivider title="Ấn Bản Toàn Văn & Slide Canva 2026" />
              <BotanicalHeaderCrest />
              <p className="text-xs sm:text-sm text-[#5E4A3E] max-w-2xl mt-2 leading-relaxed">
                Chuyển đổi tức thời giữa Bộ Slide thuyết trình Canva trực quan 16:9 HD mới cập nhật và Trình đọc văn bản toàn văn đề tài học thuật chính thức của Lớp 261LAW10A01.
              </p>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="flex items-center bg-[#FAF3EC] p-1.5 rounded-2xl border border-[#D4AF37]/60 shrink-0 shadow-xs">
              <button
                type="button"
                onClick={() => {
                  soundFx.playTap();
                  setResearchViewMode('slides');
                }}
                className={`flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition cursor-pointer ${
                  researchViewMode === 'slides'
                    ? 'bg-gradient-to-r from-[#C2410C] via-[#E85D24] to-[#F0783A] border border-[#D9531E] text-white shadow-md'
                    : 'text-[#5E4A3E] hover:bg-[#F5EDE0]'
                }`}
              >
                <Presentation className="w-4 h-4 text-[#E5C158]" />
                <span>Bộ Slide Trình Chiếu Canva</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  soundFx.playTap();
                  setResearchViewMode('paper');
                }}
                className={`flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition cursor-pointer ${
                  researchViewMode === 'paper'
                    ? 'bg-gradient-to-r from-[#C2410C] via-[#E85D24] to-[#F0783A] border border-[#D9531E] text-white shadow-md'
                    : 'text-[#5E4A3E] hover:bg-[#F5EDE0]'
                }`}
              >
                <FileText className="w-4 h-4 text-[#E5C158]" />
                <span>Toàn Văn Bản Word (20.388 từ)</span>
              </button>
            </div>
          </div>

          {/* Viewer Render inside Royal Notebook Folio Frame */}
          <div className="botanical-hero-frame p-2 sm:p-4 rounded-3xl relative overflow-hidden shadow-2xl">
            <NotebookCardCorners size={72} mode="all-4" />
            <div className="relative z-10">
              {researchViewMode === 'slides' ? (
                <PresentationSlides />
              ) : (
                <DocumentPresentation />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 5. SECTION 3: RESEARCH TEAM SUMMARY (8 MEMBERS) */}
      <section className="py-14 bg-white relative overflow-hidden" id="doi-ngu-section">
        <BotanicalWatermark opacity={0.03} />
        <div className="site-shell relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-6">
            <div>
              <span className="section-filigree-label">
                <Award className="w-3.5 h-3.5 text-[#C2410C]" />
                Minh bạch học thuật &amp; Nhân sự
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1C130E] text-artistic-halo mt-2 mb-1">
                Ban Nghiên Cứu Đề Tài (8 Thành Viên)
              </h2>
              <BotanicalHeaderCrest />
              <p className="text-xs sm:text-sm text-slate-600 max-w-xl mt-1 leading-relaxed">
                8 thành viên phụ trách chuyên môn phân bổ theo từng mảng: đề cương, số hóa Web Portal, tổng hợp bản Word, biên soạn slide và thuyết trình phản biện trước Hội đồng.
              </p>
            </div>

            <div className="flex items-center flex-wrap gap-2">
              {/* Chế độ xem: Lưới hoặc Băng trượt */}
              <div className="flex items-center bg-orange-50/80 p-1 rounded-xl border border-orange-200">
                <button
                  type="button"
                  onClick={() => {
                    soundFx.playTap();
                    setTeamViewMode('grid');
                  }}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer ${
                    teamViewMode === 'grid'
                      ? 'bg-white text-orange-950 shadow-xs border border-orange-300 font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Hiển thị lưới gọn"
                >
                  <LayoutGrid className="w-3.5 h-3.5 text-orange-600" />
                  <span>Lưới</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    soundFx.playTap();
                    setTeamViewMode('carousel');
                  }}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer ${
                    teamViewMode === 'carousel'
                      ? 'bg-white text-orange-950 shadow-xs border border-orange-300 font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Hiển thị thanh trượt ngang"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 text-orange-600" />
                  <span>Băng trượt</span>
                </button>
              </div>

              {/* Nút lướt nếu ở chế độ Băng trượt */}
              {teamViewMode === 'carousel' && (
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => scrollCarousel('left')}
                    className="p-1.5 bg-white border border-orange-300 hover:bg-orange-600 hover:text-white text-orange-800 rounded-lg transition cursor-pointer shadow-xs"
                    title="Lướt sang trái"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollCarousel('right')}
                    className="p-1.5 bg-white border border-orange-300 hover:bg-orange-600 hover:text-white text-orange-800 rounded-lg transition cursor-pointer shadow-xs"
                    title="Lướt sang phải"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Nút tải ảnh hàng loạt */}
              <input
                ref={teamBatchInputRef}
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={handleBatchTeamUpload}
              />
              <button
                type="button"
                onClick={() => teamBatchInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-orange-300 text-orange-950 hover:bg-orange-600 hover:text-white text-xs font-bold transition shadow-xs cursor-pointer rounded-lg"
              >
                <Upload className="w-3.5 h-3.5 text-orange-600" />
                <span>Cập nhật ảnh</span>
              </button>
            </div>
          </div>

          {teamNotification && (
            <div className="mb-4 p-3 bg-amber-50 text-amber-900 border border-amber-300 text-xs font-semibold flex items-center justify-between shadow-xs rounded-xl">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-orange-600" />
                <span>{teamNotification}</span>
              </div>
              <button
                onClick={() => setTeamNotification(null)}
                className="text-slate-500 hover:text-black cursor-pointer font-bold px-2"
              >
                ✕
              </button>
            </div>
          )}

          {teamViewMode === 'grid' ? (
            <div className="team-strip">
              {(isTeamExpanded ? TEAM_MEMBERS : TEAM_MEMBERS.slice(0, 4)).map((member) => {
                const initials = member.name
                  .split(' ')
                  .slice(-2)
                  .map((w) => w[0])
                  .join('');
                const avatarSrc = avatars[member.slug] || member.avatarUrl;
                const isLead = member.role.includes('Nhóm trưởng') || member.role.includes('Trưởng nhóm');

                return (
                  <div
                    className="botanical-luxury-card rounded-2xl p-3 sm:p-3.5 flex items-center gap-3 group relative cursor-pointer shadow-xs hover:shadow-md transition-all overflow-hidden"
                    key={member.id}
                    onClick={() => {
                      soundFx.playTap();
                      onOpenTeamModal(member.slug);
                    }}
                  >
                    <BotanicalCornerFiligree size={44} position="top-right" className="absolute top-0 right-0 opacity-40 group-hover:opacity-100" />
                    <div className="team-member-avatar relative overflow-hidden flex-shrink-0">
                      <img
                        src={avatarSrc}
                        alt={member.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.currentTarget;
                          target.style.display = 'none';
                          const fallback = target.nextElementSibling as HTMLElement;
                          if (fallback) fallback.style.display = 'grid';
                        }}
                      />
                      <div
                        style={{ display: 'none' }}
                        className="absolute inset-0 bg-gradient-to-br from-orange-400 to-amber-500 text-white font-serif font-bold text-sm grid place-items-center rounded-full"
                      >
                        {initials}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <strong className="truncate text-base font-bold text-[#0a131e] group-hover:text-orange-600 transition-colors">
                          {member.name}
                        </strong>
                        {isLead ? (
                          <span className="bg-orange-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                            Trưởng nhóm
                          </span>
                        ) : member.category === 'tech' ? (
                          <span className="bg-amber-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                            Kỹ Sư Web
                          </span>
                        ) : null}
                      </div>
                      <span className="text-xs text-slate-500 block truncate mt-0.5">
                        {member.studentId} • {member.role.split('(')[0]}
                      </span>
                    </div>

                    {/* Quick upload icon on card hover */}
                    <label
                      title={`Đổi ảnh cho ${member.name}`}
                      onClick={(e) => e.stopPropagation()}
                      className="opacity-0 group-hover:opacity-100 transition-opacity absolute top-2 right-2 p-1 bg-white hover:bg-orange-600 text-orange-700 hover:text-white rounded-full border border-orange-300 shadow-xs cursor-pointer"
                    >
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const base64 = await compressImageFile(file);
                            if (base64) {
                              saveAvatar(member.slug, base64);
                              setTeamNotification(`Đã cập nhật ảnh thành viên ${member.name}`);
                              setTimeout(() => setTeamNotification(null), 3000);
                            }
                          }
                        }}
                      />
                      <Camera className="w-3.5 h-3.5" />
                    </label>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="relative">
              <div ref={carouselContainerRef} className="team-carousel-strip">
                {TEAM_MEMBERS.map((member) => {
                  const initials = member.name
                    .split(' ')
                    .slice(-2)
                    .map((w) => w[0])
                    .join('');
                  const avatarSrc = avatars[member.slug] || member.avatarUrl;
                  const isLead = member.role.includes('Nhóm trưởng') || member.role.includes('Trưởng nhóm');

                  return (
                    <div className="team-carousel-item" key={member.id}>
                      <div
                        className="botanical-luxury-card rounded-2xl p-3 sm:p-3.5 flex items-center gap-3 group relative cursor-pointer shadow-xs hover:shadow-md transition-all overflow-hidden"
                        onClick={() => {
                          soundFx.playTap();
                          onOpenTeamModal(member.slug);
                        }}
                      >
                        <BotanicalCornerFiligree size={44} position="top-right" className="absolute top-0 right-0 opacity-40 group-hover:opacity-100" />
                        <div className="team-member-avatar relative overflow-hidden flex-shrink-0">
                          <img
                            src={avatarSrc}
                            alt={member.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.currentTarget;
                              target.style.display = 'none';
                              const fallback = target.nextElementSibling as HTMLElement;
                              if (fallback) fallback.style.display = 'grid';
                            }}
                          />
                          <div
                            style={{ display: 'none' }}
                            className="absolute inset-0 bg-gradient-to-br from-orange-400 to-amber-500 text-white font-serif font-bold text-sm grid place-items-center rounded-full"
                          >
                            {initials}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <strong className="truncate text-base font-bold text-[#0a131e] group-hover:text-orange-600 transition-colors">
                              {member.name}
                            </strong>
                            {isLead ? (
                              <span className="bg-orange-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                                Trưởng nhóm
                              </span>
                            ) : null}
                          </div>
                          <span className="text-xs text-slate-500 block truncate mt-0.5">
                            {member.studentId} • {member.role.split('(')[0]}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Action Row */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-orange-100 pt-5">
            <button
              type="button"
              onClick={() => {
                soundFx.playTap();
                setIsTeamExpanded(!isTeamExpanded);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-orange-900 bg-orange-50 border border-orange-300 rounded-xl hover:bg-orange-100 transition"
            >
              {isTeamExpanded ? (
                <>
                  <span>Thu gọn (hiển thị 4 thành viên)</span>
                  <ChevronUp className="w-4 h-4" />
                </>
              ) : (
                <>
                  <span>Xem đủ 8 thành viên (2 hàng)</span>
                  <ChevronDown className="w-4 h-4" />
                </>
              )}
            </button>

            <Link
              className="orange-button inline-flex text-xs py-3 px-6 shadow-md"
              href="/doi-ngu"
            >
              <span>Xem chi tiết hồ sơ 8 thành viên Ban nghiên cứu</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* 6. CONCISE FINAL CTA SECTION */}
      <section className="py-16 bg-gradient-to-r from-[#FFF5EB] via-[#FFEBD1] to-[#FFDCB0] border-t-2 border-orange-300 relative overflow-hidden">
        <div className="site-shell flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-orange-800 bg-orange-200/80 px-3 py-1 rounded-full mb-3 inline-block">
              Khởi đầu vững chắc từ thể chế
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#241003] leading-snug">
              Bảo vệ Nhà đầu tư là chìa khóa nâng hạng Thị trường Chứng khoán Việt Nam.
            </h2>
            <p className="text-sm sm:text-base text-[#5A2C0D] mt-2 max-w-2xl leading-relaxed">
              Khám phá Cổng AI pháp lý hỗ trợ soạn thảo hợp đồng, so sánh bẫy điều khoản hoặc tham gia Diễn đàn trao đổi học thuật ngay hôm nay.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <Link
              href="/nen-tang-ai"
              className="orange-button text-sm py-3 px-6 shadow-lg inline-flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Trải Nghiệm Nền Tảng AI</span>
            </Link>
            <Link
              href="/dien-dan"
              className="ghost-orange-button bg-white text-sm py-3 px-6 border-orange-400"
            >
              <span>Tham Gia Diễn Đàn</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default HomePage;
