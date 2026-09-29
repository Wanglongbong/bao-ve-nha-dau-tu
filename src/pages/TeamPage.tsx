import React, { useState, useEffect, useRef } from 'react';
import { useRouter, Link } from '@/router';
import { SectionHero } from '@/components/section-hero';
import { TEAM_MEMBERS, TeamMember, PROJECT_METADATA } from '@/lib/research-data';
import { CheckCircle, Camera, Upload, Sparkles, RefreshCw, ArrowLeft, Award, FileText, Globe, Presentation, Mic, Calendar, Shield } from 'lucide-react';
import { soundFx } from '@/lib/audio-effects';

interface TeamPageProps {
  onNavigateHome?: (sectionId?: string) => void;
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

export function TeamPage({ onNavigateHome }: TeamPageProps) {
  const [avatars, setAvatars] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem('chung_khoan_team_avatars');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [activeCategory, setActiveCategory] = useState<'all' | 'lead' | 'tech' | 'research' | 'presentation'>('all');
  const [uploadingSlug, setUploadingSlug] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const batchInputRef = useRef<HTMLInputElement | null>(null);

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

  const handleSingleUpload = async (member: TeamMember, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    soundFx.playTap();
    setUploadingSlug(member.slug);
    try {
      const base64 = await compressImageFile(file);
      if (base64) {
        saveAvatar(member.slug, base64);
        soundFx.playChime();
        setNotification(`Đã cập nhật ảnh thành công cho thành viên ${member.name}`);
        setTimeout(() => setNotification(null), 3500);
      }
    } catch (err) {
      console.error('Error processing avatar:', err);
    } finally {
      setUploadingSlug(null);
    }
  };

  const handleBatchUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
    setNotification(`Đã nhận diện và cập nhật ${matchedCount} ảnh thành viên thành công!`);
    setTimeout(() => setNotification(null), 4000);
  };

  const filteredMembers = TEAM_MEMBERS.filter((m) => {
    if (activeCategory === 'all') return true;
    return m.category === activeCategory;
  });

  const { navigate } = useRouter();

  const handleBackHome = () => {
    soundFx.playTap();
    if (onNavigateHome) {
      onNavigateHome('hero');
    } else {
      navigate('/');
    }
  };

  return (
    <main className="min-h-screen bg-[#FFFDFB]">
      {/* Top Breadcrumb & Back Action Bar */}
      <div className="bg-[#FAF5EE] border-b border-orange-200/80 py-3.5">
        <div className="site-shell flex items-center justify-between gap-4 text-xs font-serif">
          <button
            onClick={handleBackHome}
            className="inline-flex items-center gap-2 text-orange-700 hover:text-orange-950 font-bold transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại Trang Chủ</span>
          </button>

          <div className="hidden sm:flex items-center gap-2 text-slate-500">
            <span>Trang Chủ</span>
            <span>/</span>
            <span className="text-orange-800 font-bold">Ban Nghiên Cứu &amp; Đội Ngũ Đề Án</span>
          </div>
        </div>
      </div>

      {/* 1. Section Hero - Standard Academic Banner with Watermark '§' */}
      <SectionHero
        eyebrow="Hội đồng Nghiên cứu &amp; Đề án Pháp lý Chứng Khoán"
        title="Đội ngũ xây dựng nội dung chuyên sâu"
        description="Tám thành viên cùng phát triển hệ thống nghiên cứu pháp luật bảo vệ quyền lợi nhà đầu tư cá nhân trên thị trường chứng khoán Việt Nam. Cấu trúc phối hợp chặt chẽ giữa Thẩm định đề cương, Lý luận pháp lý, Quản trị công ty đại chúng, Giám sát 3 cấp, Kỹ thuật Web Portal, Thiết kế Slide và Thuyết trình phản biện trước Hội đồng."
      >
        <div className="hero-stat bg-white/95 border-l-4 border-orange-600 p-5 text-[#0a131e] shadow-xs rounded-r-lg">
          <strong className="text-3xl font-serif text-orange-700 block">08</strong>
          <span className="text-xs text-slate-700 font-semibold">chuyên đề nghiên cứu đồng bộ</span>
        </div>
      </SectionHero>

      {/* 2. Principles Overview - Standard Banking Academy & Securities Law Standards */}
      <section className="bg-white py-14 border-b border-orange-200/80">
        <div className="site-shell">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#FAF7F2] border border-orange-200 p-6 lg:p-10 rounded-xl shadow-xs">
            <div className="lg:col-span-12">
              <span className="eyebrow text-orange-700 text-xs font-bold uppercase tracking-wider mb-2 block">
                Nguyên tắc làm việc nhóm
              </span>
              <h3 className="font-serif text-2xl lg:text-3xl text-[#0a131e] font-bold mb-3">
                Chuẩn hóa hồ sơ theo tiêu chuẩn Học viện Ngân hàng &amp; Luật Chứng khoán
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-6 font-serif">
                Mỗi thành viên phụ trách một mảng chuyên đề độc lập nhưng đồng bộ: từ thẩm định tính khả thi của đề cương, số hóa ma trận pháp lý 2026, đánh giá 2.731 quyết định xử phạt VPHC của UBCKNN, phân tích đại án FLC - Tân Hoàng Minh - Louis Holdings, đến xây dựng đề xuất Quỹ bảo vệ NĐT và cơ chế khởi kiện tập thể (Class Action).
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-5 border-t border-orange-200">
                <div className="flex items-center gap-2 text-xs font-bold text-[#0a131e]">
                  <CheckCircle className="w-4 h-4 text-orange-600 shrink-0" /> Luật CK 2019 (sửa đổi 2024)
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-[#0a131e]">
                  <CheckCircle className="w-4 h-4 text-orange-600 shrink-0" /> NĐ 155/2020 &amp; 245/2025
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-[#0a131e]">
                  <CheckCircle className="w-4 h-4 text-orange-600 shrink-0" /> TT 96/2020 &amp; 68/2024
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-[#0a131e]">
                  <CheckCircle className="w-4 h-4 text-orange-600 shrink-0" /> NQ 57-NQ/TW (Giám Sát AI)
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Member Cards Grid with Photos - Luxury Amber-Orange Palette */}
      <section className="py-16 bg-[#FAF7F2] border-b border-orange-200/80">
        <div className="site-shell">
          {/* Section Toolbar */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-orange-200">
            <div>
              <span className="eyebrow text-orange-700">Hồ sơ nhân sự đề án</span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#0a131e] mt-1">
                8 Thành viên Ban Nghiên cứu &amp; Chuyên đề
              </h2>
              <p className="text-sm text-slate-600 mt-1 font-serif">
                Nhóm 2 - Lớp học phần 261LAW10A01 · Khoa Luật, Học viện Ngân hàng · GVHD: TS. Nguyễn Phương Thảo · Đánh giá: Xếp loại A (Top 30% Xuất sắc)
              </p>
            </div>

            {/* Batch Upload Action */}
            <div className="flex items-center gap-3">
              <input
                ref={batchInputRef}
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={handleBatchUpload}
              />
              <button
                type="button"
                onClick={() => batchInputRef.current?.click()}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-orange-300 text-orange-900 hover:bg-orange-600 hover:text-white text-xs font-bold transition shadow-xs cursor-pointer rounded-lg font-serif"
              >
                <Upload className="w-4 h-4 text-orange-600 group-hover:text-white" />
                <span>Tải lên hàng loạt 8 ảnh</span>
              </button>
            </div>
          </div>

          {/* Filter Categories */}
          <div className="flex flex-wrap items-center gap-2 mb-8">
            <button
              onClick={() => {
                soundFx.playTap();
                setActiveCategory('all');
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-serif font-bold transition-all cursor-pointer ${
                activeCategory === 'all'
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-orange-200 hover:bg-orange-50'
              }`}
            >
              Tất cả (8)
            </button>
            <button
              onClick={() => {
                soundFx.playTap();
                setActiveCategory('lead');
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-serif font-bold transition-all cursor-pointer ${
                activeCategory === 'lead'
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-orange-200 hover:bg-orange-50'
              }`}
            >
              Trưởng nhóm &amp; Thẩm định (1)
            </button>
            <button
              onClick={() => {
                soundFx.playTap();
                setActiveCategory('tech');
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-serif font-bold transition-all cursor-pointer ${
                activeCategory === 'tech'
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-orange-200 hover:bg-orange-50'
              }`}
            >
              Kỹ thuật Web &amp; Portal (1)
            </button>
            <button
              onClick={() => {
                soundFx.playTap();
                setActiveCategory('research');
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-serif font-bold transition-all cursor-pointer ${
                activeCategory === 'research'
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-orange-200 hover:bg-orange-50'
              }`}
            >
              Nghiên cứu Văn bản Word (4)
            </button>
            <button
              onClick={() => {
                soundFx.playTap();
                setActiveCategory('presentation');
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-serif font-bold transition-all cursor-pointer ${
                activeCategory === 'presentation'
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-orange-200 hover:bg-orange-50'
              }`}
            >
              Slide &amp; Thuyết trình (2)
            </button>
          </div>

          {/* Toast Notification */}
          {notification && (
            <div className="mb-6 p-4 bg-amber-50 text-amber-900 border border-amber-300 text-xs font-bold flex items-center justify-between shadow-xs rounded-lg animate-fadeIn font-serif">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-orange-600" />
                <span>{notification}</span>
              </div>
              <button
                onClick={() => setNotification(null)}
                className="text-slate-500 hover:text-black cursor-pointer font-bold px-2"
              >
                ✕
              </button>
            </div>
          )}

          {/* Grid of Members */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMembers.map((member, index) => {
              const avatarSrc = avatars[member.slug] || member.avatarUrl;
              const isLead = member.role.includes('Nhóm trưởng') || member.role.includes('Trưởng nhóm');
              const isTech = member.category === 'tech';
              const isPres = member.category === 'presentation';

              return (
                <article
                  key={member.id}
                  className={`bg-white border shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group relative rounded-xl ${
                    isLead
                      ? 'border-orange-400 ring-1 ring-orange-300/60'
                      : isTech
                      ? 'border-amber-300'
                      : 'border-orange-200 hover:border-orange-400'
                  }`}
                >
                  {/* Photo Container */}
                  <div className="relative h-60 w-full bg-[#FAF5EE] overflow-hidden border-b border-orange-200">
                    <img
                      src={avatarSrc}
                      alt={member.name}
                      onError={(e) => {
                        const target = e.currentTarget;
                        target.style.display = 'none';
                        const fallback = target.nextElementSibling as HTMLElement;
                        if (fallback) fallback.style.display = 'flex';
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Styled Fallback Avatar if file not yet available */}
                    <div
                      style={{ display: 'none' }}
                      className="absolute inset-0 bg-gradient-to-br from-[#FFFDF9] via-[#FAF2DC] to-[#F5ECD2] flex flex-col items-center justify-center text-center p-4"
                    >
                      <div className="w-16 h-16 rounded-full bg-white border-2 border-orange-400 flex items-center justify-center text-xl font-serif font-bold text-orange-700 mb-2 shadow-xs">
                        {member.name
                          .split(' ')
                          .slice(-2)
                          .map((part) => part[0])
                          .join('')}
                      </div>
                      <span className="text-xs text-orange-900 font-bold font-serif">
                        {member.name}
                      </span>
                    </div>

                    {/* Member Number Badge */}
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs border border-orange-300/80 text-orange-800 font-mono text-[11px] font-bold px-2.5 py-0.5 shadow-xs rounded-sm">
                      #{String(TEAM_MEMBERS.findIndex((m) => m.id === member.id) + 1).padStart(2, '0')}
                    </div>

                    {/* Role Tag on Photo */}
                    <div className="absolute top-3 right-12">
                      {isLead ? (
                        <span className="bg-orange-600 text-white font-serif text-[10px] font-bold px-2 py-0.5 rounded shadow-xs uppercase tracking-wide">
                          Trưởng nhóm
                        </span>
                      ) : isTech ? (
                        <span className="bg-amber-500 text-white font-serif text-[10px] font-bold px-2 py-0.5 rounded shadow-xs uppercase tracking-wide">
                          Kỹ Sư Web
                        </span>
                      ) : isPres ? (
                        <span className="bg-orange-500 text-white font-serif text-[10px] font-bold px-2 py-0.5 rounded shadow-xs uppercase tracking-wide">
                          Thuyết Trình
                        </span>
                      ) : null}
                    </div>

                    {/* Individual Upload Trigger */}
                    <label className="absolute top-3 right-3 w-8 h-8 bg-white/90 hover:bg-orange-600 text-orange-800 hover:text-white border border-orange-300 rounded-full flex items-center justify-center cursor-pointer transition shadow-xs group/btn">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleSingleUpload(member, e)}
                      />
                      <Camera className="w-4 h-4" />
                      <span className="sr-only">Tải ảnh cho {member.name}</span>
                    </label>

                    {/* Loading State Overlay */}
                    {uploadingSlug === member.slug && (
                      <div className="absolute inset-0 bg-white/80 backdrop-blur-xs flex items-center justify-center text-orange-700 text-xs font-bold gap-2">
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Đang lưu ảnh...</span>
                      </div>
                    )}
                  </div>

                  {/* Member Meta */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <h3 className="font-serif text-lg font-bold text-[#0a131e] group-hover:text-orange-600 transition-colors leading-snug">
                          {member.name}
                        </h3>
                        <span className="font-mono text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                          {member.studentId}
                        </span>
                      </div>

                      <p className="text-xs font-semibold text-orange-800 mb-2.5 font-serif">
                        {member.role}
                      </p>

                      {/* Huy hiệu đánh giá đóng góp */}
                      <div className="mb-3.5">
                        {member.evaluation === 'A' ? (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-[#FAF1D7] to-[#FAF5E8] border border-[#C59B27] rounded-sm text-[#8C6B18] font-bold text-xs shadow-2xs font-serif">
                            <span className="w-2 h-2 rounded-full bg-[#8C6B18]"></span>
                            <span>{member.evaluationNote}</span>
                          </div>
                        ) : member.evaluation === 'B+' ? (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-orange-50/80 border border-orange-200 rounded-sm text-orange-800 font-semibold text-xs font-serif">
                            <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                            <span>{member.evaluationNote}</span>
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50/70 border border-amber-200 rounded-sm text-amber-800 font-medium text-xs font-serif">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                            <span>{member.evaluationNote}</span>
                          </div>
                        )}
                      </div>

                      {/* Nhiệm vụ phân công chi tiết */}
                      <div className="mb-4 bg-[#FDFBF7] p-3 rounded-lg border border-orange-200/80 font-serif">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-orange-900 block mb-1.5">
                          Phân công công việc:
                        </span>
                        <ul className="space-y-1.5">
                          {member.tasks.map((task, idx) => (
                            <li key={idx} className="text-xs text-[#2c3e50] leading-relaxed flex items-start gap-1.5">
                              <span className="text-orange-600 font-bold select-none leading-tight mt-0.5">•</span>
                              <span className="flex-1">{task}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-orange-100 flex items-center justify-between text-[11px] text-slate-500 font-serif">
                      <span>Mục tiêu: <strong className="text-slate-800">{member.pageTarget}</strong></span>
                      <span className="text-orange-700 font-bold flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-orange-500" /> Hạn: {member.deadline}
                      </span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Project Deliverables Showcase */}
      <section className="py-14 bg-white">
        <div className="site-shell">
          <div className="max-w-2xl mb-8">
            <span className="eyebrow text-orange-700">Sản phẩm bàn giao toàn diện</span>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 mt-1">
              4 Trụ Cột Đóng Góp Của Ban Nghiên Cứu
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 font-serif">
            <div className="p-5 rounded-xl bg-orange-50/40 border border-orange-200 shadow-xs">
              <FileText className="w-7 h-7 text-orange-600 mb-3" />
              <h4 className="font-bold text-base text-slate-900 mb-1">Bản Báo Cáo Word</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Dung lượng ~25 trang chuẩn mực học thuật Học viện Ngân hàng, chuẩn hóa trích dẫn theo thể thức pháp lý.
              </p>
            </div>
            <div className="p-5 rounded-xl bg-amber-50/40 border border-amber-200 shadow-xs">
              <Globe className="w-7 h-7 text-amber-600 mb-3" />
              <h4 className="font-bold text-base text-slate-900 mb-1">Web Portal Tương Tác</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Nền tảng số hóa trực quan hóa dữ liệu giám sát 3 cấp, ma trận tra cứu văn bản pháp luật và trợ lý AI tư vấn.
              </p>
            </div>
            <div className="p-5 rounded-xl bg-orange-50/40 border border-orange-200 shadow-xs">
              <Presentation className="w-7 h-7 text-orange-600 mb-3" />
              <h4 className="font-bold text-base text-slate-900 mb-1">Slide Báo Cáo Chuyên Sâu</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Bộ slide 30+ trang đồ họa infographics hiện đại phục vụ buổi bảo vệ chính thức trước Hội đồng.
              </p>
            </div>
            <div className="p-5 rounded-xl bg-amber-50/40 border border-amber-200 shadow-xs">
              <Mic className="w-7 h-7 text-amber-600 mb-3" />
              <h4 className="font-bold text-base text-slate-900 mb-1">Kịch Bản Thuyết Trình</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Nội dung báo cáo 20 phút mạch lạc, sắc bén cùng bộ câu hỏi phản biện chuyên sâu về chính sách bảo vệ NĐT.
              </p>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-orange-100 flex items-center justify-between">
            <button
              onClick={handleBackHome}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-orange-600 text-white font-serif font-bold text-sm hover:bg-orange-700 transition cursor-pointer shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Quay lại Trang Chủ Cổng Thông Tin</span>
            </button>

            <span className="text-xs text-slate-500 font-serif">
              © 2026 Nhóm Nghiên Cứu BTL Luật Chứng Khoán - Khoa Luật, Học viện Ngân hàng.
            </span>
          </div>
        </div>
      </section>
    </main>
  );
}
