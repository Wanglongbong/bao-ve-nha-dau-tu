import React, { useState, useEffect, useRef } from 'react';
import { TeamMember, TEAM_MEMBERS, PROJECT_METADATA } from '@/lib/research-data';
import { X, Award, CheckCircle2, Calendar, FileText, Globe, Presentation, Mic, Camera, Upload, Sparkles, RefreshCw, Users, Shield } from 'lucide-react';
import { soundFx } from '@/lib/audio-effects';

interface TeamDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMemberSlug?: string | null;
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

export function TeamDetailModal({ isOpen, onClose, initialMemberSlug }: TeamDetailModalProps) {
  const [activeCategory, setActiveCategory] = useState<'all' | 'lead' | 'tech' | 'research' | 'presentation'>('all');
  const [avatars, setAvatars] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem('chung_khoan_team_avatars');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const [uploadingSlug, setUploadingSlug] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const modalContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      if (initialMemberSlug) {
        const member = TEAM_MEMBERS.find((m) => m.slug === initialMemberSlug);
        if (member) {
          setActiveCategory('all');
        }
      }
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, initialMemberSlug]);

  if (!isOpen) return null;

  const handleClose = () => {
    soundFx.playTap();
    onClose();
  };

  const handleSingleUpload = async (member: TeamMember, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    soundFx.playTap();
    setUploadingSlug(member.slug);
    try {
      const base64 = await compressImageFile(file);
      if (base64) {
        setAvatars((prev) => {
          const next = { ...prev, [member.slug]: base64 };
          try {
            localStorage.setItem('chung_khoan_team_avatars', JSON.stringify(next));
          } catch (err) {
            console.warn('LocalStorage limit reached', err);
          }
          return next;
        });
        soundFx.playChime();
        setToastMsg(`Đã cập nhật ảnh thành công cho ${member.name}!`);
        setTimeout(() => setToastMsg(null), 3500);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUploadingSlug(null);
    }
  };

  const filteredMembers = TEAM_MEMBERS.filter((m) => {
    if (activeCategory === 'all') return true;
    return m.category === activeCategory;
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-md animate-fadeIn"
      onClick={handleClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        ref={modalContentRef}
        className="relative w-full max-w-6xl max-h-[92vh] flex flex-col bg-[#FFFDFB] rounded-2xl border border-orange-200 shadow-2xl overflow-hidden animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="relative p-6 sm:p-8 bg-gradient-to-r from-orange-700 via-amber-600 to-orange-600 text-white border-b border-orange-400/40">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 text-xs font-bold uppercase tracking-wider text-orange-100 mb-2">
                <Shield className="w-3.5 h-3.5 text-amber-200" />
                Khoa Luật • Học Viện Ngân Hàng • Lớp LAW10A
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white">
                Hồ Sơ Ban Nghiên Cứu &amp; Đội Ngũ 8 Thành Viên
              </h2>
              <p className="text-orange-100/90 text-sm mt-1 max-w-2xl">
                Bảng phân công nhiệm vụ chi tiết, tiến độ bàn giao và kết quả đánh giá đóng góp của 8 thành viên đề tài BTL Luật Chứng khoán 2026.
              </p>
            </div>

            <button
              onClick={handleClose}
              className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all cursor-pointer shrink-0"
              aria-label="Đóng cửa sổ"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* 4 Sản phẩm bàn giao cốt lõi */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 pt-5 border-t border-white/15 text-xs">
            <div className="flex items-center gap-2.5 bg-white/10 backdrop-blur-xs p-2.5 rounded-lg border border-white/10">
              <FileText className="w-4 h-4 text-amber-200 shrink-0" />
              <div>
                <strong className="block text-white font-semibold">Báo Cáo Word</strong>
                <span className="text-[11px] text-orange-200">~25 trang chuẩn HVNH</span>
              </div>
            </div>
            <div className="flex items-center gap-2.5 bg-white/10 backdrop-blur-xs p-2.5 rounded-lg border border-white/10">
              <Globe className="w-4 h-4 text-amber-200 shrink-0" />
              <div>
                <strong className="block text-white font-semibold">Web Portal</strong>
                <span className="text-[11px] text-orange-200">Số hóa tương tác 2026</span>
              </div>
            </div>
            <div className="flex items-center gap-2.5 bg-white/10 backdrop-blur-xs p-2.5 rounded-lg border border-white/10">
              <Presentation className="w-4 h-4 text-amber-200 shrink-0" />
              <div>
                <strong className="block text-white font-semibold">Slide Báo Cáo</strong>
                <span className="text-[11px] text-orange-200">Đồ họa &amp; Infographics</span>
              </div>
            </div>
            <div className="flex items-center gap-2.5 bg-white/10 backdrop-blur-xs p-2.5 rounded-lg border border-white/10">
              <Mic className="w-4 h-4 text-amber-200 shrink-0" />
              <div>
                <strong className="block text-white font-semibold">Thuyết Trình &amp; Phản Biện</strong>
                <span className="text-[11px] text-orange-200">Bảo vệ trước Hội đồng</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Navigation Tabs */}
        <div className="px-6 py-3.5 bg-[#FFF7EE] border-b border-orange-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                soundFx.playTap();
                setActiveCategory('all');
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeCategory === 'all'
                  ? 'bg-orange-600 text-white shadow-sm'
                  : 'bg-white text-slate-700 border border-orange-200 hover:bg-orange-100/50'
              }`}
            >
              Tất cả 8 Thành viên
            </button>
            <button
              onClick={() => {
                soundFx.playTap();
                setActiveCategory('lead');
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeCategory === 'lead'
                  ? 'bg-orange-600 text-white shadow-sm'
                  : 'bg-white text-slate-700 border border-orange-200 hover:bg-orange-100/50'
              }`}
            >
              Trưởng nhóm &amp; Thẩm định (1)
            </button>
            <button
              onClick={() => {
                soundFx.playTap();
                setActiveCategory('tech');
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeCategory === 'tech'
                  ? 'bg-orange-600 text-white shadow-sm'
                  : 'bg-white text-slate-700 border border-orange-200 hover:bg-orange-100/50'
              }`}
            >
              Kỹ thuật Web &amp; Portal (1)
            </button>
            <button
              onClick={() => {
                soundFx.playTap();
                setActiveCategory('research');
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeCategory === 'research'
                  ? 'bg-orange-600 text-white shadow-sm'
                  : 'bg-white text-slate-700 border border-orange-200 hover:bg-orange-100/50'
              }`}
            >
              Nghiên cứu Văn bản Word (4)
            </button>
            <button
              onClick={() => {
                soundFx.playTap();
                setActiveCategory('presentation');
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeCategory === 'presentation'
                  ? 'bg-orange-600 text-white shadow-sm'
                  : 'bg-white text-slate-700 border border-orange-200 hover:bg-orange-100/50'
              }`}
            >
              Slide &amp; Thuyết trình (2)
            </button>
          </div>

          <div className="text-xs text-orange-950 font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Tiến độ hoàn thành: <strong>100%</strong></span>
          </div>
        </div>

        {/* Toast Notification */}
        {toastMsg && (
          <div className="mx-6 mt-4 p-3 bg-amber-50 border border-amber-300 text-amber-900 rounded-lg text-xs font-semibold flex items-center justify-between shadow-sm animate-fadeIn">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-orange-600" />
              <span>{toastMsg}</span>
            </div>
            <button onClick={() => setToastMsg(null)} className="text-slate-400 hover:text-slate-800 px-2 cursor-pointer">
              ✕
            </button>
          </div>
        )}

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredMembers.map((member, index) => {
              const avatarSrc = avatars[member.slug] || member.avatarUrl;
              const isLead = member.role.includes('Nhóm trưởng') || member.role.includes('Trưởng nhóm');
              const isTech = member.category === 'tech';
              const isPres = member.category === 'presentation';

              return (
                <article
                  key={member.id}
                  className={`bg-white rounded-xl border p-5 shadow-xs transition-all duration-300 hover:shadow-md flex flex-col justify-between ${
                    isLead
                      ? 'border-orange-400 bg-gradient-to-br from-white via-orange-50/20 to-amber-50/30'
                      : isTech
                      ? 'border-orange-300'
                      : 'border-orange-200'
                  }`}
                >
                  <div>
                    {/* Top Row: Avatar & Basic Meta */}
                    <div className="flex items-start gap-4 mb-4">
                      {/* Avatar with Camera Trigger */}
                      <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-orange-100 border-2 border-orange-300 shadow-xs shrink-0 group">
                        <img
                          src={avatarSrc}
                          alt={member.name}
                          onError={(e) => {
                            const target = e.currentTarget;
                            target.style.display = 'none';
                            const fallback = target.nextElementSibling as HTMLElement;
                            if (fallback) fallback.style.display = 'flex';
                          }}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />

                        {/* Fallback Initials */}
                        <div
                          style={{ display: 'none' }}
                          className="absolute inset-0 bg-gradient-to-br from-orange-500 to-amber-600 text-white font-serif font-bold text-2xl flex items-center justify-center"
                        >
                          {member.name.split(' ').slice(-1)[0]?.charAt(0)}
                        </div>

                        {/* Number Badge */}
                        <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-black/60 text-white font-mono text-[9px] font-bold">
                          #{String(TEAM_MEMBERS.findIndex((m) => m.id === member.id) + 1).padStart(2, '0')}
                        </div>

                        {/* Camera Upload Overlay */}
                        <label
                          className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-white/90 hover:bg-orange-600 hover:text-white text-orange-800 flex items-center justify-center cursor-pointer transition-colors shadow-xs"
                          title="Đổi ảnh đại diện"
                        >
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleSingleUpload(member, e)}
                          />
                          <Camera className="w-3.5 h-3.5" />
                        </label>

                        {uploadingSlug === member.slug && (
                          <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                            <RefreshCw className="w-4 h-4 text-orange-600 animate-spin" />
                          </div>
                        )}
                      </div>

                      {/* Header Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h3 className="font-serif font-bold text-lg text-slate-900 leading-snug">
                            {member.name}
                          </h3>
                          {isLead && (
                            <span className="px-2 py-0.5 rounded bg-orange-600 text-white font-bold text-[10px] tracking-wide uppercase shadow-xs">
                              Trưởng Nhóm
                            </span>
                          )}
                          {isTech && (
                            <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300 font-bold text-[10px] tracking-wide uppercase">
                              Kỹ Sư Web Portal
                            </span>
                          )}
                          {isPres && (
                            <span className="px-2 py-0.5 rounded bg-orange-100 text-orange-900 border border-orange-300 font-bold text-[10px] tracking-wide uppercase">
                              Slide &amp; Thuyết Trình
                            </span>
                          )}
                        </div>

                        <p className="text-xs font-semibold text-orange-800 mb-2">
                          {member.role}
                        </p>

                        {/* Evaluation Badge */}
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-gradient-to-r from-amber-50 to-orange-50 border border-orange-300/80 text-[11px] font-bold text-orange-900 shadow-xs">
                          <Award className="w-3.5 h-3.5 text-amber-600" />
                          <span>{member.evaluationNote}</span>
                        </div>
                      </div>
                    </div>

                    {/* Assigned Section & Target */}
                    <div className="p-3 bg-[#FFFBF6] border border-orange-100 rounded-lg text-xs space-y-1.5 mb-3">
                      <div>
                        <span className="font-bold text-orange-950 block">Phân công đề tài:</span>
                        <span className="text-slate-700 leading-relaxed font-medium">{member.assignedSections}</span>
                      </div>
                      <div className="flex items-center justify-between pt-1 border-t border-orange-100/60 text-[11px]">
                        <span className="text-slate-500">Mục tiêu: <strong className="text-slate-800">{member.pageTarget}</strong></span>
                        <span className="flex items-center gap-1 text-orange-700 font-bold">
                          <Calendar className="w-3 h-3 text-orange-600" /> Hạn: {member.deadline}
                        </span>
                      </div>
                    </div>

                    {/* Detailed Task Checklist */}
                    <div className="mb-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-orange-900 block mb-1.5">
                        Nhiệm Vụ Cụ Thể Đã Thực Hiện:
                      </span>
                      <ul className="space-y-1.5">
                        {member.tasks.map((task, idx) => (
                          <li key={idx} className="text-xs text-slate-700 flex items-start gap-2 leading-relaxed">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{task}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Footer Meta */}
                  <div className="pt-3 border-t border-orange-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span className="italic">"{member.bio}"</span>
                    <span className="font-mono font-bold text-orange-900 bg-orange-100/70 px-2 py-0.5 rounded border border-orange-200">
                      {member.studentId}
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        {/* Footer Bar */}
        <div className="px-6 py-4 bg-[#FAF5EE] border-t border-orange-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-2 text-slate-700 font-medium">
            <Award className="w-4 h-4 text-orange-600" />
            <span>Đề tài: <strong>{PROJECT_METADATA.title}</strong> (~25 trang chuẩn)</span>
          </div>

          <button
            onClick={handleClose}
            className="px-5 py-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold rounded-lg shadow-sm cursor-pointer transition-all"
          >
            Đóng Cửa Sổ
          </button>
        </div>
      </div>
    </div>
  );
}
